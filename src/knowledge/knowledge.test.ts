import { describe, expect, it } from "vitest";
import { createEmptyDB, hydrateDB } from "../data/db";
import { importCurriculum } from "../engines/curriculumSpec";
import { grantMastery } from "../engines/progress";
import { mechanicsPack } from "../ai/packs/mechanics";
import { BASE_OBJECTS } from "./content";
import { assembleGraph, getGraph, prereqMap } from "./graph";
import { findCycle } from "../engines/graph";
import { ID_LEDGER } from "./registry";
import { validateGraph, summarize } from "./validate";
import { courseSpecFor, milestoneQuality, objectMilestones } from "./generate";
import { personalGraph, readiness, recommendObjects } from "./state";
import { applyPlan, diffUpdate } from "./planner";
import { LEARNING_PATHS, pathObjects } from "./paths";
import { MAPPINGS } from "./mappings";
import { matchRequest } from "./search";
import { setSelfAttested, studyObjects } from "./actions";
import { DOMAINS, SCOPE_MILESTONES } from "./schema";
import { setLang } from "../i18n";

const g = getGraph();

describe("Lab Müfredatı v2.0 — canonical graph", () => {
  it("has the expected size and every domain, and no extra-language placeholder", () => {
    expect(g.order.length).toBeGreaterThanOrEqual(480);
    const domains = new Set(g.order.map((id) => g.objects[id].domain));
    for (const d of DOMAINS) expect(domains.has(d), d).toBe(true);
    expect(g.order.filter((id) => g.objects[id].status === "YER_TUTUCU")).toEqual([]);
  });

  it("validates with zero errors, is acyclic and matches the permanent id ledger", () => {
    const issues = validateGraph(g, { raw: BASE_OBJECTS, now: new Date("2026-10-07") });
    const errors = issues.filter((i) => i.severity === "HATA");
    expect(errors.map((e) => e.message)).toEqual([]);
    expect(findCycle(prereqMap(g))).toBeNull();
    expect([...ID_LEDGER].sort()).toEqual([...g.order].sort());
    expect(summarize(issues).HATA).toBe(0);
  });

  it("gives every object an entry question, action objectives, evidence and mastery criteria", () => {
    for (const id of g.order) {
      const o = g.objects[id];
      expect(o.entryQuestions.length, id).toBeGreaterThan(0);
      expect(o.learningObjectives.length, id).toBeGreaterThan(0);
      expect(o.evidenceTypes.length, id).toBeGreaterThan(0);
      expect(o.masteryCriteria.length, id).toBeGreaterThan(0);
    }
    const issues = validateGraph(g);
    expect(issues.filter((i) => i.code === "EYLEMSIZ_HEDEF" || i.code === "ILERI_TURETMESIZ" || i.code === "BELIRSIZ_USTALIK").map((i) => i.message)).toEqual([]);
  });

  it("connects learning-to-learn and keeps interdisciplinary links as real edges", () => {
    const l2l = g.objects["comp.meta.learning-to-learn"];
    expect(l2l.unlocks.length).toBeGreaterThan(0);
    expect(l2l.interdisciplinaryLinks.map((l) => l.id)).toEqual(expect.arrayContaining(["neuro.cog.learning-memory", "neuro.cog.sleep"]));
    expect(validateGraph(g).filter((i) => i.code === "BAGLANTISIZ")).toEqual([]);
    for (const id of g.order) for (const l of g.objects[id].interdisciplinaryLinks) expect(g.objects[l.id], `${id} → ${l.id}`).toBeDefined();
  });

  it("only uses source-flagged wording for history, and stores no current events", () => {
    for (const id of g.order.filter((x) => x.startsWith("gk.tr-hist") || x.startsWith("gk.world"))) {
      expect(g.objects[id].requiresSources, id).toBe(true);
    }
  });
});

describe("mapping and resource layers", () => {
  it("keeps verified AP mappings sourced and pointing at real objects", () => {
    for (const m of MAPPINGS) {
      for (const lo of m.loIds) expect(g.objects[lo], `${m.id} → ${lo}`).toBeDefined();
      if (m.status === "DOGRULANMIS") expect(m.source && m.checkedAt, m.id).toBeTruthy();
    }
    expect(MAPPINGS.filter((m) => m.framework.startsWith("AP Statistics")).length).toBe(5);
    expect(MAPPINGS.find((m) => m.framework === "AP Biology")?.status).toBe("GECICI");
    expect(g.objects["math.calc.taylor"].apMappings.length).toBeGreaterThan(0);
  });

  it("flags a stale verified mapping after a year", () => {
    const issues = validateGraph(g, { now: new Date("2028-01-01") });
    expect(issues.some((i) => i.code === "ESKIMIS_ESLEME")).toBe(true);
  });
});

describe("micro-milestones (sections 41–42)", () => {
  it("rejects milestones that give no new ability", () => {
    expect(milestoneQuality("Newton yasalarını oku.").ok).toBe(false);
    expect(milestoneQuality("20 dakika Newton yasaları çalış.").ok).toBe(false);
    expect(milestoneQuality("Newton yasaları hakkında 5 video izle.").ok).toBe(false);
    expect(milestoneQuality("Verilen fiziksel durumda sisteme etki eden kuvvetleri belirler ve serbest cisim diyagramı oluşturur.").ok).toBe(true);
  });

  it("splits every object within its scope and every generated milestone passes the quality check", () => {
    const bad: string[] = [];
    for (const id of g.order) {
      const o = g.objects[id];
      const ms = objectMilestones(o);
      const [, max] = SCOPE_MILESTONES[o.estimatedScope];
      expect(ms.length, id).toBeGreaterThanOrEqual(1);
      expect(ms.length, id).toBeLessThanOrEqual(max + 1);
      for (const m of ms) if (!milestoneQuality(m.title).ok) bad.push(`${id}: ${m.title}`);
      expect(ms.every((m) => m.lo?.includes(id))).toBe(true);
    }
    expect(bad).toEqual([]);
  });

  it("builds a valid course whose milestones respect object prerequisites", () => {
    const db = createEmptyDB();
    const ids = ["math.found.functions", "math.calc.limits", "math.calc.derivative-def"];
    const courseId = studyObjects(db, g, ids);
    const ms = Object.values(db.milestones).filter((m) => m.courseId === courseId);
    expect(ms.length).toBeGreaterThanOrEqual(3);
    const first = (lo: string) => ms.find((m) => m.sourceKey === `lo:${lo}#1`)!;
    expect(first("math.calc.limits").prerequisites.length).toBe(1);
    expect(courseSpecFor(g, ids, "x", "y").units.length).toBeGreaterThan(0);
  });
});

describe("personal state, readiness and recommendations", () => {
  it("suggests a start point without forcing the learner backward", () => {
    const db = createEmptyDB();
    const pg = personalGraph(db, g);
    const r = readiness(pg, ["neuro.comp.hh-model"]);
    expect(r.requiredGaps.length).toBeGreaterThan(5);
    expect(r.message).toContain("Suggested starting point");
    expect(r.message).toContain("not required");
    setLang("tr");
    try {
      const tr = readiness(personalGraph(db, getGraph(db.knowledge, "tr")), ["neuro.comp.hh-model"]);
      expect(tr.message).toContain("Buradan başlaman öneriliyor");
      expect(tr.message).not.toMatch(/zorundasın/);
    } finally {
      setLang("en");
    }
    for (const s of r.startHere) expect(pg.progress.get(s)!.missingRequired).toEqual([]);
  });

  it("counts self-attestation and mastery, and only required prerequisites gate readiness", () => {
    const db = createEmptyDB();
    setSelfAttested(db, "math.found.arithmetic", true);
    setSelfAttested(db, "math.found.algebra", true);
    const pg = personalGraph(db, g);
    expect(pg.progress.get("math.found.algebra")!.state).toBe("BEYAN");
    expect(pg.progress.get("math.found.functions")!.state).toBe("HAZIR");
    const recs = recommendObjects(pg, ["math.calc.derivative-def"], 5);
    expect(recs[0].id).toBe("math.found.functions");
  });

  it("marks an object mastered once its linked milestones are mastered", () => {
    const db = createEmptyDB();
    const courseId = studyObjects(db, g, ["math.found.arithmetic"]);
    for (const m of Object.values(db.milestones).filter((x) => x.courseId === courseId && !x.optional)) grantMastery(db, m.id, [], false, false);
    expect(personalGraph(db, g).progress.get("math.found.arithmetic")!.state).toBe("USTALASILDI");
  });
});

describe("paths and search", () => {
  it("builds each path as a view of the same graph, in dependency order", () => {
    for (const p of LEARNING_PATHS) {
      const ids = pathObjects(g, p);
      for (const t of p.targets) expect(ids).toContain(t);
      const pos = new Map(ids.map((id, i) => [id, i]));
      for (const id of ids) for (const pr of g.objects[id].prerequisites) if (pos.has(pr.id) && (pr.strength === "ZORUNLU" || pr.strength === "YUMUSAK")) expect(pos.get(pr.id)!).toBeLessThan(pos.get(id)!);
    }
  });

  it("finds a request in the existing graph before building a new course (section 37)", () => {
    expect(matchRequest(g, "Hesaplamalı nörobilim öğrenmek istiyorum").path?.id).toBe("yol.hesaplamali-norobilim");
    expect(matchRequest(g, "Fizik olimpiyatı").path?.id).toBe("yol.fizik-olimpiyati");
    expect(matchRequest(g, "Hodgkin Huxley").objects[0]).toBe("neuro.comp.hh-model");
    expect(matchRequest(g, "qqqq zzzz").objects).toEqual([]);
  });
});

describe("safe updates (section 36)", () => {
  it("refuses id reuse, deletion, an old version and cycles; applies a clean diff as an overlay", () => {
    const db = createEmptyDB();
    expect(diffUpdate(g, { version: "1.0.0", objects: [{ id: "math.calc.limits", title: "x" }] }, db).ok).toBe(false);
    const del = diffUpdate(g, { version: "2.2.0", remove: ["math.calc.limits"] }, db);
    expect(del.ok).toBe(false);
    expect(del.changes[0].kind).toBe("REDDEDILDI");
    const cyc = diffUpdate(g, { version: "2.2.0", objects: [{ id: "math.found.arithmetic", prerequisites: [{ id: "math.calc.limits", strength: "ZORUNLU" }] }] }, db);
    expect(cyc.ok).toBe(false);
    expect(cyc.newErrors.some((e) => e.code === "DONGU")).toBe(true);

    const plan = diffUpdate(g, {
      version: "2.2.0",
      summary: "Giriş sorusu düzeltmesi",
      objects: [{ id: "math.calc.limits", entryQuestions: ["0/0 her zaman tanımsız mıdır? Bir örnekle sına."] }],
    }, db);
    expect(plan.ok).toBe(true);
    expect(plan.changes.map((c) => c.kind)).toEqual(["DEGISTIR"]);
    applyPlan(db, plan);
    const g2 = getGraph(db.knowledge);
    expect(g2.version).toBe("2.2.0");
    expect(g2.objects["math.calc.limits"].entryQuestions[0]).toMatch(/^0\/0/);
    expect(g.objects["math.calc.limits"].entryQuestions[0]).not.toMatch(/^0\/0/);
  });

  it("retiring a split object keeps the id and moves progress links to its successors", () => {
    const db = createEmptyDB();
    const courseId = studyObjects(db, g, ["math.found.inequalities"]);
    setSelfAttested(db, "math.found.inequalities", true);
    const plan = diffUpdate(g, {
      version: "2.2.0",
      objects: [
        { id: "math.found.inequalities-linear", title: "Doğrusal eşitsizlikler", domain: "MATEMATIK", field: "Temeller", unit: "Sayılar ve cebir",
          description: "Doğrusal eşitsizlikleri çözer.", whyItMatters: "Optimizasyonun temeli.", prerequisites: [{ id: "math.found.algebra", strength: "ZORUNLU" }],
          entryQuestions: ["-2x < 6 ise x için ne söyleyebilirsin? İşaretin neden döndüğünü tahmin et."], learningObjectives: ["Doğrusal eşitsizlikleri çözer ve çözüm kümesini sayı doğrusunda gösterir."],
          evidenceTypes: ["HESAPLAMA", "ACIKLAMA"], interdisciplinaryLinks: [{ id: "gk.econ.micro", relation: "bütçe kısıtı" }] },
      ],
      retire: [{ id: "math.found.inequalities", supersededBy: ["math.found.inequalities-linear"] }],
    }, db);
    expect(plan.newErrors.map((e) => e.message)).toEqual([]);
    expect(plan.ok).toBe(true);
    const rec = applyPlan(db, plan);
    expect(rec.relinkedMilestones).toBeGreaterThan(0);
    const g2 = getGraph(db.knowledge);
    expect(g2.objects["math.found.inequalities"].status).toBe("YERINE_GECILDI");
    const ms = Object.values(db.milestones).filter((m) => m.courseId === courseId);
    expect(ms.every((m) => m.learningObjectIds!.includes("math.found.inequalities") && m.learningObjectIds!.includes("math.found.inequalities-linear"))).toBe(true);
    expect(db.knowledge.selfAttested["math.found.inequalities-linear"]).toBeDefined();
    // The retired id can never be issued again.
    expect(diffUpdate(g2, { version: "2.3.0", objects: [{ id: "math.found.inequalities-linear", title: "x" }] }, db).changes.some((c) => c.kind === "DEGISTIR")).toBe(true);
  });
});

describe("progress migration", () => {
  it("links pack milestones on import", () => {
    const db = createEmptyDB();
    importCurriculum(db, structuredClone(mechanicsPack), { source: { kind: "SEED", text: "" }, generatedBy: "seed" });
    const ms = Object.values(db.milestones);
    expect(ms.every((m) => m.learningObjectIds?.length && m.sourceKey?.startsWith("mech:"))).toBe(true);
  });

  it("links old data (Turkish or pre-1.0.3 English titles) without changing progress", () => {
    const db = createEmptyDB();
    importCurriculum(db, structuredClone(mechanicsPack), { source: { kind: "SEED", text: "" }, generatedBy: "seed" });
    const ms = Object.values(db.milestones);
    // Simulate a v1 database: no links, one English title, one mastered milestone.
    for (const m of ms) { delete m.learningObjectIds; delete m.sourceKey; }
    const kin2 = ms.find((m) => m.title.startsWith("Sabit ivme"))!;
    kin2.title = "Solve constant-acceleration problems";
    grantMastery(db, kin2.id, [], false, false);
    const raw = JSON.parse(JSON.stringify({ ...db, knowledge: undefined, schemaVersion: 1 }));
    const before = JSON.stringify(raw.mastery);
    const migrated = hydrateDB(raw);
    expect(JSON.stringify(migrated.mastery)).toBe(before);
    expect(migrated.milestones[kin2.id].learningObjectIds).toEqual(["phys.mech.kinematics-1d"]);
    expect(Object.values(migrated.milestones).filter((m) => m.learningObjectIds?.length).length).toBe(ms.length);
    expect(migrated.knowledge.migrations[0].id).toBe("v2-link-milestones");
    expect(personalGraph(migrated, assembleGraph()).progress.get("phys.mech.kinematics-1d")!.mastered).toBe(1);
    // Running again does nothing.
    expect(hydrateDB(JSON.parse(JSON.stringify(migrated))).knowledge.migrations.length).toBe(1);
  });
});
