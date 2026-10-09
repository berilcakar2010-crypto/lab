import { describe, expect, it } from "vitest";
import { kit, answer, T0, DAY } from "../adaptive/testkit";
import { createEmptyDB } from "../data/db";
import { getBaseGraph, getGraph } from "../knowledge/graph";
import { addJournal, artifactFromRecord, createProject, journalFor, projectOverview, saveArtifact, updateProject } from "./records";
import { restoreVersion } from "./versioning";
import { createGoal, decomposeGoal, pathForGoal, suggestGoalObjects } from "./goals";
import { addGrade, addSchoolSubject, passedDeadlines, subjectSummary } from "./school";
import { depthAnalytics, personalRecords, portfolio, timeline, yearlyReflection } from "./portfolio";
import { fullExport, importFull, relationships } from "../data/exchange";
import { addUserConcept, archiveConcept, renameConcept, rollbackLastUpdate } from "../knowledge/userContent";
import { globalSearch } from "../adaptive/search";
import { addExam } from "../study/exams";
import { runAI, fitPrompt, styleInstruction, type AIHost } from "../ai/engine";
import type { AIProvider } from "../ai/providers";
import { memoryAdapter, Store, parseable } from "../data/store";
import { healthReport, maintenanceSuggestions } from "../engines/health";
import { setSelfAttested } from "../knowledge/actions";

const g = getBaseGraph();
const NEWTON = "phys.mech.newton";

describe("journal, projects, artifacts", () => {
  it("records link to the graph, projects are versioned and restorable", () => {
    const db = createEmptyDB(T0);
    const j = addJournal(db, { kind: "QUESTION", text: "Why is F = ma linear?", loIds: [NEWTON] }, T0);
    expect(journalFor(db, NEWTON)).toEqual([j]);
    expect(() => addJournal(db, { kind: "IDEA", text: "  " })).toThrow();
    const p = createProject(db, { title: "Pendulum study", kind: "RESEARCH", loIds: [NEWTON] }, T0);
    updateProject(db, p.id, { goal: "Measure g", questions: ["How long?", ""] }, "first", T0 + 1);
    updateProject(db, p.id, { goal: "Measure g precisely" }, "second", T0 + 2);
    expect(db.projects[p.id].questions).toEqual(["How long?"]);
    expect(db.projects[p.id].versions).toHaveLength(2);
    restoreVersion(db.projects[p.id], 1, "restore", T0 + 3);
    expect(db.projects[p.id].goal).toBe("Measure g");
    expect(db.projects[p.id].versions).toHaveLength(3);
    const a = saveArtifact(db, { kind: "DERIVATION", title: "Small-angle period", body: "T = 2π√(L/g)", loIds: [NEWTON], projectId: p.id }, T0);
    expect(projectOverview(db, p.id)!.artifacts).toEqual([a]);
    expect(portfolio(db).map((x) => x.kind)).toEqual(expect.arrayContaining(["ARTIFACT", "PROJECT"]));
  });

  it("saving the same record twice updates one artifact", () => {
    const db = createEmptyDB(T0);
    db.research.r1 = { id: "r1", title: "R", loIds: [NEWTON], steps: { RESULT: { text: "found", doneAt: T0 } }, status: "OPEN", createdAt: T0, updatedAt: T0 };
    artifactFromRecord(db, "research", "r1", undefined, T0);
    artifactFromRecord(db, "research", "r1", undefined, T0 + 1);
    expect(Object.keys(db.artifacts)).toHaveLength(1);
  });
});

describe("academic goals", () => {
  it("decomposes into domains → concepts → capabilities → milestones → evidence, and plans a path", () => {
    const db = createEmptyDB(T0);
    const ids = suggestGoalObjects(g, "Newton");
    expect(ids.length).toBeGreaterThan(0);
    const goal = createGoal(db, { title: "Strong in mechanics", why: "olympiad", loIds: [NEWTON] }, T0);
    const d = decomposeGoal(db, g, goal, T0);
    expect(d.conceptCount).toBeGreaterThan(1);
    const all = d.domains.flatMap((x) => x.concepts);
    expect(all.find((c) => c.loId === NEWTON)!.target).toBe(true);
    expect(all.every((c) => c.capabilities.length > 0)).toBe(true);
    expect(d.progress).toBe(0);
    expect(d.next).toBeTruthy();
    const path = pathForGoal(db, g, goal.id, T0);
    expect(path.goalIds).toEqual([NEWTON]);
    expect(() => pathForGoal(db, g, createGoal(db, { title: "empty" }, T0).id, T0)).toThrow();
  });
});

describe("school layer", () => {
  it("weighted averages, linked mastery, and a passed deadline is never 'failed'", () => {
    const db = createEmptyDB(T0);
    const s = addSchoolSubject(db, { name: "Physics", kind: "AP", year: "2026–27", loIds: [NEWTON] }, T0);
    addGrade(db, { subjectId: s.id, title: "Quiz", score: 8, outOf: 10 }, T0);
    addGrade(db, { subjectId: s.id, title: "Exam", score: 60, outOf: 100, weight: 3 }, T0);
    expect(subjectSummary(db, s.id, T0)!.average).toBeCloseTo((0.8 + 3 * 0.6) / 4);
    expect(() => addGrade(db, { subjectId: s.id, title: "x", score: 1, outOf: 0 })).toThrow();
    addExam(db, { title: "Unit test", kind: "EXAM", subject: "Physics", date: T0 - 2 * DAY, loIds: [NEWTON], notes: "", remindDays: [] }, T0 - 10 * DAY);
    const p = passedDeadlines(db, g, T0);
    expect(p).toHaveLength(1);
    expect(p[0].openTopics).toEqual([NEWTON]);
    expect(p[0].message).not.toMatch(/fail|lost|başarısız|kaybet/i);
  });
});

describe("portfolio, records, timeline, reflection", () => {
  it("are derived from real records and empty when there is nothing", () => {
    const empty = createEmptyDB(T0);
    expect(personalRecords(empty, g, T0)).toEqual([]);
    expect(yearlyReflection(empty, g, 2026, T0).empty).toBe(true);
    expect(depthAnalytics(empty, g, T0).depth.mean).toBeNull();
    const k = kit([NEWTON]);
    const id = k.ms[NEWTON];
    for (const q of k.qs[id]) answer(k, q, true, { at: T0 });
    const tl = timeline(k.db, g);
    expect(tl.some((i) => i.kind === "CONCEPT" && i.ref === NEWTON)).toBe(true);
    expect(tl.some((i) => i.kind === "DOMAIN")).toBe(true);
    const y = yearlyReflection(k.db, g, new Date(T0).getFullYear(), T0 + DAY);
    expect(y.newConcepts).toContain(g.objects[NEWTON].title);
    expect(y.empty).toBe(false);
    expect(personalRecords(k.db, g, T0 + DAY).some((r) => r.id === "hardest")).toBe(true);
    const da = depthAnalytics(k.db, g, T0 + DAY);
    expect(da.breadth.concepts).toBeGreaterThan(0);
    expect(da.depth.n).toBeGreaterThan(0);
  });
});

describe("versioned export and import", () => {
  it("round-trips every table, strips API keys and derives relationships", () => {
    const k = kit([NEWTON]);
    k.db.preferences.apiKeys = { gemini: "SECRET" };
    addJournal(k.db, { kind: "IDEA", text: "x", loIds: [NEWTON] }, T0);
    answer(k, k.qs[k.ms[NEWTON]][0], false, { at: T0 });
    const text = fullExport(k.db, { now: T0 });
    expect(text).not.toContain("SECRET");
    const data = JSON.parse(text);
    expect(data.format).toBe("lab-export");
    expect(data.version).toBe(2);
    expect(data.relationships.some((r: { type: string }) => r.type === "practises")).toBe(true);
    const back = importFull(text);
    expect(back.format).toBe("v2");
    expect(Object.keys(back.db.milestones)).toEqual(Object.keys(k.db.milestones));
    expect(Object.keys(back.db.journal)).toHaveLength(1);
    expect(Object.keys(back.db.errors)).toHaveLength(1);
    expect(back.db.events.length).toBe(k.db.events.length);
    expect(importFull(JSON.stringify(k.db)).format).toBe("legacy");
    expect(() => importFull("{\"x\":1}")).toThrow();
    expect(() => importFull(JSON.stringify({ format: "lab-export", version: 99 }))).toThrow();
    expect(relationships(k.db).every((r) => r.to.id)).toBe(true);
  });
});

describe("the learner's own concepts", () => {
  it("adds, renames (id kept, old name searchable), archives and rolls back through the versioned pipeline", () => {
    const db = createEmptyDB(T0);
    const id = addUserConcept(db, { title: "Pendulum damping", domain: "FIZIK", learningObjectives: ["Estimate the damping time of a pendulum"], prerequisites: [NEWTON] }, T0);
    expect(id).toMatch(/^user\./);
    let gg = getGraph(db.knowledge, "tr");
    expect(gg.objects[id].title).toBe("Pendulum damping");
    expect(db.knowledge.provenance?.[id].sourceType).toBe("USER_CREATED");
    renameConcept(db, id, "Damped pendulum", T0 + 1);
    gg = getGraph(db.knowledge, "tr");
    expect(gg.objects[id].title).toBe("Damped pendulum");
    expect(globalSearch(db, gg, "Pendulum damping").some((r) => r.id === id)).toBe(true);
    const before = db.knowledge.history.length;
    expect(rollbackLastUpdate(db, T0 + 2)).not.toBeNull();
    expect(getGraph(db.knowledge, "tr").objects[id].title).toBe("Pendulum damping");
    expect(db.knowledge.history.length).toBe(before + 1);
    archiveConcept(db, id, "not needed", [], T0 + 3);
    expect(getGraph(db.knowledge, "tr").objects[id].status).toBe("KULLANIM_DISI");
    expect(() => addUserConcept(db, { title: "x", domain: "FIZIK", learningObjectives: [] })).toThrow();
    // A second concept with the same title never reuses the id.
    expect(addUserConcept(db, { title: "Pendulum damping", domain: "FIZIK", learningObjectives: ["a b c"] }, T0 + 4)).not.toBe(id);
  });
});

describe("AI engine", () => {
  const host = (db = createEmptyDB(T0)) => {
    let calls = 0;
    let lastSystem = "";
    const provider: AIProvider = { id: "gemini", model: "m", ready: () => true, complete: async (r) => { calls++; lastSystem = r.system; return '{"x":1}'; } };
    const h: AIHost = { db: () => db, record: (fn) => fn(db), provider };
    return { h, calls: () => calls, system: () => lastSystem, db };
  };
  const opts = { role: "TUTOR" as const, system: "sys", prompt: "p", summary: "s", parse: (t: string) => JSON.parse(t), fallback: () => null };

  it("reuses an identical answer, unless asked not to", async () => {
    const t = host();
    const a = await runAI(t.h, opts);
    const b = await runAI(t.h, opts);
    expect(a.cached).toBeFalsy();
    expect(b.cached).toBe(true);
    expect(t.calls()).toBe(1);
    await runAI(t.h, { ...opts, cache: false });
    expect(t.calls()).toBe(2);
  });

  it("adds the learner's style to talking roles only, and keeps long prompts small", async () => {
    const t = host();
    t.db.preferences.aiStyle = { socratic: false, concise: true, rigorous: true, explanatory: false, challenging: false };
    await runAI(t.h, opts);
    expect(t.system()).toMatch(/concise/);
    await runAI(t.h, { ...opts, role: "CURRICULUM_BUILDER" });
    expect(t.system()).toBe("sys");
    expect(styleInstruction(undefined)).toBe("");
    const long = "a".repeat(20_000);
    expect(fitPrompt(long).length).toBeLessThan(10_000);
    expect(fitPrompt("short")).toBe("short");
  });
});

describe("backups and health", () => {
  it("takes a daily snapshot and restores one (snapshotting the current state first)", async () => {
    const a = memoryAdapter();
    const store = new Store(a, false);
    store.update((db) => { db.user.name = "First"; });
    await store.flush();
    const list = await a.snapshots.list();
    expect(list).toHaveLength(1);
    store.update((db) => { db.user.name = "Second"; });
    await store.flush();
    expect(await store.restoreSnapshot(list[0].key)).toBe(true);
    expect(store.state.user.name).toBe("First");
    expect((await a.snapshots.list()).some((s) => s.key.includes("before-restore"))).toBe(true);
    expect(parseable("{")).toBe(false);
    expect(parseable("{}")).toBe(true);
  });

  it("reports graph, data, AI and storage health and suggests non-destructive maintenance", () => {
    const db = createEmptyDB(T0);
    setSelfAttested(db, NEWTON, true, T0);
    const h = healthReport(db, g, { backend: "memory", size: 2048, lastSavedAt: T0, lastError: null, snapshots: 1 }, T0);
    expect(h.graph.objects).toBe(g.order.length);
    expect(h.graph.errors).toBe(0);
    expect(h.schema.version).toBe(4);
    expect(h.storage.sizeKB).toBe(2);
    expect(maintenanceSuggestions(db, g, T0).some((m) => m.kind === "WEAK_EVIDENCE")).toBe(true);
  });
});
