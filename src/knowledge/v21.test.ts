import { afterEach, describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import { importCurriculum } from "../engines/curriculumSpec";
import { grantMastery } from "../engines/progress";
import { mechanicsPack } from "../ai/packs/mechanics";
import { mechanicsPackEn } from "../ai/packs/en/mechanics";
import { setLang } from "../i18n";
import { BASE_OBJECTS } from "./content";
import { EN_TEXT, EN_UNITS } from "./content/en";
import { getGraph } from "./graph";
import { MAPPINGS } from "./mappings";
import { switchLanguage } from "./relocalize";
import { studyObjects } from "./actions";
import { validateGraph } from "./validate";
import { milestoneQuality, objectMilestones } from "./generate";
import { addAutoCards, autoCards, dueCards, exportAnki, newCard, renderCloze, reviewCard, schedule } from "../study/flashcards";
import { domainMindMap, LEAF_H, mindLayout, mindMapMarkdown, objectMindMap } from "../study/mindmap";
import { offlineAnswer, offlineEvaluation, validateEval } from "../ai/studyAI";

afterEach(() => setLang("en"));

describe("English overlay", () => {
  it("covers every object with matching structure", () => {
    const missing: string[] = [];
    for (const o of BASE_OBJECTS) {
      const t = EN_TEXT[o.id];
      if (!t) { missing.push(o.id); continue; }
      expect(t.learningObjectives.length, o.id).toBe(o.learningObjectives.length);
      expect(t.entryQuestions.length, o.id).toBe(o.entryQuestions.length);
      expect(Object.keys(t.links ?? {}).sort(), o.id).toEqual(o.interdisciplinaryLinks.map((l) => l.id).sort());
      expect(EN_UNITS[o.unit], `${o.id} unit ${o.unit}`).toBeTruthy();
    }
    expect(missing).toEqual([]);
  });

  it("uses English text in the English graph and Turkish in the Turkish graph", () => {
    const en = getGraph(undefined, "en").objects["neuro.comp.hh-model"];
    const tr = getGraph(undefined, "tr").objects["neuro.comp.hh-model"];
    expect(en.title).not.toBe(tr.title);
    expect(en.masteryCriteria[0]).toMatch(/^[A-Z][a-z]+( [a-z]+)?: /);
    expect(tr.masteryCriteria[0]).not.toBe(en.masteryCriteria[0]);
    expect(en.field).not.toBe(tr.field);
  });

  it("keeps English objectives action-based and generated milestones meaningful", () => {
    const g = getGraph(undefined, "en");
    const bad: string[] = [];
    for (const id of g.order) for (const m of objectMilestones(g.objects[id])) if (!milestoneQuality(m.title).ok) bad.push(`${id}: ${m.title}`);
    expect(bad).toEqual([]);
    expect(milestoneQuality("Read chapter 3.").ok).toBe(false);
    expect(milestoneQuality("Watch three videos about Newton's laws.").ok).toBe(false);
    expect(milestoneQuality("Study vectors for 20 minutes.").ok).toBe(false);
    expect(milestoneQuality("Understands vectors.").ok).toBe(false);
    expect(milestoneQuality("Builds a free-body diagram for an unfamiliar system and justifies each force.").ok).toBe(true);
  });
});

describe("v2.1 content", () => {
  it("validates with zero errors and connects every new field", () => {
    const g = getGraph(undefined, "tr");
    const errors = validateGraph(g, { raw: BASE_OBJECTS }).filter((i) => i.severity === "HATA");
    expect(errors.map((e) => e.message)).toEqual([]);
    for (const d of ["YER_UZAY", "CEVRE", "PSIKOLOJI", "EKONOMI", "YAZIM", "SANAT_MUZIK"]) {
      const ids = g.order.filter((id) => g.objects[id].domain === d);
      expect(ids.length, d).toBeGreaterThanOrEqual(9);
      const cross = ids.filter((id) => g.objects[id].interdisciplinaryLinks.some((l) => g.objects[l.id]?.domain !== d) || g.objects[id].prerequisites.some((p) => g.objects[p.id]?.domain !== d));
      expect(cross.length, d).toBeGreaterThan(ids.length / 2);
    }
  });

  it("maps 25 AP courses, all verified except AP Biology", () => {
    const ap = [...new Set(MAPPINGS.filter((m) => m.system === "AP").map((m) => m.framework))];
    expect(ap.length).toBeGreaterThanOrEqual(24);
    const notVerified = [...new Set(MAPPINGS.filter((m) => m.system === "AP" && m.status !== "DOGRULANMIS").map((m) => m.framework))];
    expect(notVerified).toEqual(["AP Biology"]);
    expect(MAPPINGS.filter((m) => m.framework === "AP Physics 2: Algebra-Based").map((m) => m.unit)[0]).toBe("9. Thermodynamics");
  });
});

describe("language switch re-localises built-in content", () => {
  it("translates an untouched pack course and keeps edited text and progress", () => {
    const db = createEmptyDB();
    const { courseId } = importCurriculum(db, structuredClone(mechanicsPackEn), { source: { kind: "SEED", text: "" }, generatedBy: "seed" });
    const ms = Object.values(db.milestones).filter((m) => m.courseId === courseId);
    const kin2 = ms.find((m) => m.sourceKey === "mech:kin2")!;
    const n1 = ms.find((m) => m.sourceKey === "mech:n1")!;
    n1.title = "My own title";
    grantMastery(db, kin2.id, [], false, false);
    expect(db.courses[courseId].title).toBe(mechanicsPackEn.title);

    const changed = switchLanguage(db, "tr");
    expect(changed).toBeGreaterThan(20);
    expect(db.preferences.language).toBe("tr");
    expect(db.courses[courseId].title).toBe(mechanicsPack.title);
    expect(kin2.title).toBe("Sabit ivmeli hareket problemlerini çöz");
    expect(n1.title).toBe("My own title");
    expect(db.milestones[kin2.id].status).toBe("MASTERED");
    const q = Object.values(db.questions).find((x) => x.milestoneId === kin2.id)!;
    expect(q.prompt).toMatch(/[ğüşıöçİ]/);

    switchLanguage(db, "en");
    expect(kin2.title).toBe("Solve constant-acceleration problems");
    expect(db.courses[courseId].title).toBe(mechanicsPackEn.title);
  });

  it("re-localises a course generated from the graph", () => {
    const db = createEmptyDB();
    const courseId = studyObjects(db, getGraph(undefined, "en"), ["math.calc.limits"]);
    const m = Object.values(db.milestones).find((x) => x.courseId === courseId)!;
    const before = m.title;
    switchLanguage(db, "tr");
    expect(m.title).not.toBe(before);
    expect(m.title).toBe(getGraph(undefined, "tr").objects["math.calc.limits"].learningObjectives[0]);
  });
});

describe("flashcards", () => {
  it("makes cards from an object once, with stable keys", () => {
    const db = createEmptyDB();
    const g = getGraph(undefined, "en");
    const n = addAutoCards(db, g, "phys.mech.newton");
    expect(n).toBe(autoCards(g.objects["phys.mech.newton"], g).length);
    expect(n).toBeGreaterThan(6);
    expect(addAutoCards(db, g, "phys.mech.newton")).toBe(0);
  });

  it("schedules with SM-2: again comes back soon, good grows the interval, ease never drops below 1.3", () => {
    const now = Date.UTC(2026, 9, 8);
    let c = newCard({ front: "q", back: "a" }, undefined, "USER", now);
    c = schedule(c, 2, now);
    expect(c.intervalDays).toBe(1);
    c = schedule(c, 2, now);
    expect(c.intervalDays).toBe(6);
    c = schedule(c, 2, now);
    expect(c.intervalDays).toBeGreaterThanOrEqual(14);
    const lapse = schedule(c, 0, now);
    expect(lapse.due - now).toBe(10 * 60_000);
    expect(lapse.lapses).toBe(1);
    let e = c;
    for (let i = 0; i < 20; i++) e = schedule(e, 1, now);
    expect(e.ease).toBeGreaterThanOrEqual(1.3);
  });

  it("reviews update due dates, history and the due queue", () => {
    const db = createEmptyDB();
    const now = Date.now();
    const c = newCard({ front: "The {{mitochondrion}} makes ATP", back: "" }, "bio.cell.structure", "USER", now);
    db.flashcards[c.id] = c;
    expect(c.kind).toBe("CLOZE");
    expect(renderCloze(c.front, false)).toBe("The […] makes ATP");
    expect(dueCards(db, now)).toHaveLength(1);
    reviewCard(db, c.id, 3, 4000, now);
    expect(dueCards(db, now)).toHaveLength(0);
    expect(db.flashcards[c.id].history).toHaveLength(1);
    expect(exportAnki([db.flashcards[c.id]])).toContain("{{c1::mitochondrion}}");
  });
});

describe("mind maps", () => {
  it("builds a readable radial map for an object and a domain", () => {
    const g = getGraph(undefined, "en");
    const root = objectMindMap(g.objects["neuro.comp.hh-model"], g, { id: "neuro.comp.hh-model", text: "", mapItems: ["m, h, n are gates"], updatedAt: 0 });
    expect(root.children.map((c) => c.id)).toEqual(expect.arrayContaining(["idea", "why", "do", "need", "mine"]));
    const placed = mindLayout(root);
    expect(placed.length).toBe(1 + root.children.length + root.children.reduce((s, b) => s + b.children.length, 0));
    // No two leaves on the same side are closer than one leaf height.
    for (const side of [-1, 1]) {
      const ys = placed.filter((p) => p.depth === 2 && p.side === side).map((p) => p.y).sort((a, b) => a - b);
      for (let i = 1; i < ys.length; i++) expect(ys[i] - ys[i - 1]).toBeGreaterThanOrEqual(LEAF_H - 0.001);
    }
    expect(mindMapMarkdown(root)).toContain("m, h, n are gates");
    const dm = domainMindMap(g, "PSIKOLOJI");
    expect(dm.children.length).toBeGreaterThanOrEqual(2);
  });
});

describe("study AI fallbacks", () => {
  it("answers offline from the graph and evaluates honestly", () => {
    const g = getGraph(undefined, "en");
    const o = g.objects["phys.mech.newton"];
    expect(offlineAnswer(o, g, "What is a free body diagram?")).toMatch(/Offline answer/);
    const ev = offlineEvaluation(o, "");
    expect(ev.score).toBe(0);
    expect(ev.criteria).toHaveLength(o.masteryCriteria.length);
    expect(() => validateEval({ criteria: [] }, o)).toThrow();
    expect(validateEval({ score: 80, criteria: [{ criterion: "x", met: true }] }, o).score).toBe(0.8);
  });
});
