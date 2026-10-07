import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import type { LabDB } from "../domain/types";
import { importCurriculum, replaceTopicMilestones, type CurriculumSpec } from "./curriculumSpec";
import { assertValidCourse, courseMilestones, milestoneQuestions, splitMilestone, validateCourse } from "./curriculum";
import { applyCalibration, diagnosticPlan, estimateStart, recommendNext, topPicks } from "./progression";
import { grantMastery, startSession, openMilestone } from "./progress";
import { mechanicsPack } from "../ai/packs/mechanics";
import { calculusPack } from "../ai/packs/calculus";
import { buildGenericSpec, localBuildCurriculum, parseSyllabus } from "../ai/localBuilder";
import { buildCurriculumAI, splitMilestoneAI } from "../ai/curriculumAI";
import type { AIHost } from "../ai/engine";
import type { AIProvider } from "../ai/providers";

const hostFor = (db: LabDB, provider?: AIProvider): AIHost => ({ db: () => db, record: (fn) => fn(db), provider });
const fakeProvider = (reply: string | Error): AIProvider => ({
  id: "gemini",
  model: "fake",
  ready: () => true,
  complete: async () => {
    if (reply instanceof Error) throw reply;
    return reply;
  },
});

const importPack = (spec: CurriculumSpec) => {
  const db = createEmptyDB();
  const report = importCurriculum(db, structuredClone(spec), { source: { kind: "SEED", text: "" }, generatedBy: "seed" });
  return { db, report, courseId: report.courseId };
};

describe("Phase 3 — curriculum builder", () => {
  it.each([["mechanics", mechanicsPack], ["calculus", calculusPack]])("imports the %s pack as a valid branching graph", (_n, pack) => {
    const { db, report, courseId } = importPack(pack);
    expect(report.repairs).toEqual([]);
    expect(validateCourse(db, courseId)).toEqual([]);
    const ms = courseMilestones(db, courseId);
    expect(ms.length).toBeGreaterThanOrEqual(10);
    // Branching: some milestone has 2+ dependents.
    expect(ms.some((m) => m.nextMilestones.length >= 2)).toBe(true);
    for (const t of ["REVIEW", "CHALLENGE", "BOSS"]) expect(ms.some((m) => m.milestoneType === t)).toBe(true);
    expect(ms.some((m) => m.optional)).toBe(true);
    for (const m of ms) {
      expect(m.learningObjective.length).toBeGreaterThan(10);
      expect(milestoneQuestions(db, m.id).length).toBeGreaterThan(0);
      expect(m.masteryCriteria.description).toBeTruthy();
    }
    // Every question in the packs is gradable as intended (no silent downgrades).
    for (const q of Object.values(db.questions)) expect(q.hints.length).toBe(4);
  });

  it("parses a pasted syllabus into units and topics", () => {
    const parsed = parseSyllabus(`Unit 1: Kinematics
- Displacement and velocity
- Acceleration
Unit 2 Dynamics
  Newton's laws
  Friction
Energy: work, kinetic energy, potential energy`);
    expect(parsed.units.map((u) => u.title)).toEqual(["Kinematics", "Dynamics", "Energy"]);
    expect(parsed.units[0].topics).toEqual(["Displacement and velocity", "Acceleration"]);
    expect(parsed.units[2].topics).toEqual(["work", "kinetic energy", "potential energy"]);
  });

  it("parses a flat topic list into parts", () => {
    const parsed = parseSyllabus("Neurons\nSynapses\nIntegrate-and-fire\nHodgkin-Huxley\nNetworks");
    expect(parsed.units).toHaveLength(2);
  });

  it("builds a valid generic scaffold with branches, review, challenge and boss", () => {
    const db = createEmptyDB();
    const { courseId } = importCurriculum(db, buildGenericSpec("Theoretical Neuroscience"), { source: { kind: "REQUEST", text: "" }, generatedBy: "local" });
    assertValidCourse(db, courseId);
    const ms = courseMilestones(db, courseId);
    expect(ms.some((m) => m.milestoneType === "BOSS")).toBe(true);
    expect(ms.filter((m) => m.prerequisites.length === 0)).toHaveLength(1);
  });

  it("local builder picks packs by keyword, including Turkish requests", () => {
    expect(localBuildCurriculum("TÜBİTAK Fizik Olimpiyatı Mekanik").spec.title).toMatch(/Mechanics/);
    expect(localBuildCurriculum("Calculus 1").spec.title).toBe("Calculus 1");
    expect(localBuildCurriculum("Theoretical Neuroscience").spec.title).toBe("Theoretical Neuroscience");
  });

  it("uses AI output when valid and repairs loops / unknown prerequisites", async () => {
    const db = createEmptyDB();
    const spec = {
      title: "Toy", goal: "g", units: [{ title: "U", topics: [{ title: "T", milestones: [
        { key: "a", title: "A", prerequisites: ["c"], questions: [{ kind: "NUMERIC", prompt: "1+1", numeric: { value: 2 } }] },
        { key: "b", title: "B", prerequisites: ["a", "ghost"] },
        { key: "c", title: "C", prerequisites: ["b"], questions: [{ kind: "MULTIPLE_CHOICE", prompt: "bad mc", choices: ["x"], correctChoice: 3 }] },
      ] }] }],
    };
    const res = await buildCurriculumAI(hostFor(db, fakeProvider("```json\n" + JSON.stringify(spec) + "\n```")), { request: "Toy" });
    expect(res.fallbackUsed).toBe(false);
    const report = importCurriculum(db, res.value.spec, { source: { kind: "REQUEST", text: "Toy" }, generatedBy: res.provider });
    assertValidCourse(db, report.courseId);
    expect(report.repairs.some((r) => r.includes("ghost"))).toBe(true);
    expect(report.repairs.some((r) => r.includes("loop"))).toBe(true);
    expect(Object.values(db.questions).find((q) => q.prompt === "bad mc")?.kind).toBe("FREE_RESPONSE");
    expect(Object.values(db.aiInteractions)[0].ok).toBe(true);
  });

  it("falls back to the offline builder when the AI fails, and records the failure", async () => {
    const db = createEmptyDB();
    const res = await buildCurriculumAI(hostFor(db, fakeProvider(new Error("Gemini 500: boom"))), { request: "Calculus 1" });
    expect(res.fallbackUsed).toBe(true);
    expect(res.value.spec.title).toBe("Calculus 1");
    const ai = Object.values(db.aiInteractions)[0];
    expect(ai.ok).toBe(false);
    expect(ai.error).toContain("500");
    expect(db.events.some((e) => e.type === "AI_INTERACTION")).toBe(true);
  });

  it("splits with AI fallback and keeps the graph valid", async () => {
    const { db, courseId } = importPack(mechanicsPack);
    const target = courseMilestones(db, courseId).find((m) => m.title.startsWith("Analyse projectile"))!;
    const res = await splitMilestoneAI(hostFor(db), target);
    splitMilestone(db, target.id, res.value);
    assertValidCourse(db, courseId);
  });

  it("regenerates one topic and reattaches the surrounding graph", () => {
    const { db, courseId } = importPack(mechanicsPack);
    const fbd = courseMilestones(db, courseId).find((m) => m.title === "Construct a free-body diagram")!;
    const topicId = fbd.topicId;
    const { created } = replaceTopicMilestones(db, topicId, [
      { key: "x", title: "Identify contact forces", questions: [{ kind: "NUMERIC", prompt: "?", numeric: { value: 1 } }] },
      { key: "y", title: "Identify field forces", prerequisites: ["x"] },
    ], "test");
    expect(created).toHaveLength(2);
    assertValidCourse(db, courseId);
    // Energy depended on n2 (in this topic) and must now depend on the new leaf.
    const energy = courseMilestones(db, courseId).find((m) => m.title === "Use the work–energy theorem")!;
    expect(energy.prerequisites).toContain(created[1]);
    expect(db.milestones[created[0]].prerequisites.length).toBeGreaterThan(0);
  });
});

describe("Phase 3 — progression engine", () => {
  it("recommends root milestones first and explains why", () => {
    const { db, courseId } = importPack(mechanicsPack);
    const recs = recommendNext(db, courseId);
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) expect(["AVAILABLE", "OPTIONAL", "BOSS", "ATTEMPTED", "ACTIVE", "NEEDS_REVIEW"]).toContain(db.milestones[r.milestoneId].status);
    expect(recs[0].reasons.length).toBeGreaterThan(0);
  });

  it("after mastering, offers multiple kinds of next steps including branches", () => {
    const { db, courseId } = importPack(mechanicsPack);
    const ms = courseMilestones(db, courseId);
    const byTitle = (t: string) => ms.find((m) => m.title.startsWith(t))!;
    for (const t of ["Resolve a vector", "Add vectors", "Construct a free-body", "Apply Newton's second"]) grantMastery(db, byTitle(t).id, [], false, false);
    const newton2 = byTitle("Apply Newton's second");
    const recs = recommendNext(db, courseId, { justCompletedId: newton2.id });
    const ids = recs.map((r) => r.milestoneId);
    // Energy and momentum branches both become available.
    expect(ids).toContain(byTitle("Use the work–energy").id);
    expect(ids).toContain(byTitle("Relate impulse").id);
    const picks = topPicks(recs);
    expect(new Set(picks.map((p) => p.kind)).size).toBeGreaterThan(1);
    expect(picks.length).toBeLessThanOrEqual(4);
  });

  it("calibrates a START HERE point from diagnostics and self-ratings", () => {
    const { db, courseId } = importPack(mechanicsPack);
    const plan = diagnosticPlan(db, courseId);
    expect(plan.length).toBeGreaterThan(1);
    const units = Object.values(db.units).filter((u) => u.courseId === courseId);
    const tools = units.find((u) => u.title === "Mathematical tools")!;
    const kin = courseMilestones(db, courseId).find((m) => m.title.startsWith("Solve constant-acceleration"))!;
    const fbd = courseMilestones(db, courseId).find((m) => m.title.startsWith("Construct a free-body"))!;
    const result = estimateStart(db, courseId, { selfRatings: { [tools.id]: 2 }, diagnostic: { [kin.id]: true, [fbd.id]: false } });
    expect(result.startHereId).toBe(fbd.id);
    expect(result.likelyKnown.length).toBeGreaterThan(2);
    applyCalibration(db, courseId, result, true);
    expect(db.milestones[fbd.id].status).toBe("AVAILABLE");
    expect(recommendNext(db, courseId)[0].milestoneId).toBe(fbd.id);
    // The user can still open anything that is unlocked.
    const s = startSession(db, courseId);
    const vec = courseMilestones(db, courseId).find((m) => m.title.startsWith("Resolve a vector"))!;
    openMilestone(db, s.id, vec.id);
    expect(db.milestones[vec.id].status).toBe("ACTIVE");
  });
});
