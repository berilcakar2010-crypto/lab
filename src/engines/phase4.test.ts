import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import type { Question } from "../domain/types";
import { importCurriculum } from "./curriculumSpec";
import { courseMilestones } from "./curriculum";
import { evaluateAuto, evaluateSelf } from "./evaluation";
import { milestoneSessionState, nextQuestion } from "./sessionPlan";
import { recordAttempt } from "./progress";
import { ensureSession, closeStaleSessions } from "./sessions";
import { mechanicsPack } from "../ai/packs/mechanics";

const q = (over: Partial<Question>): Question => ({
  id: "q", milestoneId: "m", kind: "NUMERIC", purpose: "MASTERY", prompt: "?", rubric: [], hints: [], solution: "", difficulty: 2, createdBy: "t", ...over,
});

describe("Phase 4 — evaluation and feedback", () => {
  it("grades numbers with tolerance and classifies common errors", () => {
    const n = q({ numeric: { value: 8.66, tolerance: 0.02, unit: "N" } });
    expect(evaluateAuto(n, { kind: "number", text: "8.7 N" }).correct).toBe(true);
    const sign = evaluateAuto(n, { kind: "number", text: "-8.66" });
    expect(sign.correct).toBe(false);
    expect(sign.feedback.errorTypes).toContain("PROCEDURAL");
    expect(evaluateAuto(n, { kind: "number", text: "86.6" }).feedback.errorTypes).toContain("CARELESS");
    expect(evaluateAuto(n, { kind: "number", text: "8.9" }).feedback.correctness).toBe("PARTIAL");
    expect(evaluateAuto(n, { kind: "number", text: "17.32" }).feedback.message).toMatch(/factor of 2/);
    expect(evaluateAuto(n, { kind: "number", text: "hello" }).correct).toBe(false);
  });

  it("grades expressions by equivalence and recognises sign/factor slips", () => {
    const e = q({ kind: "EQUATION", acceptedExpressions: ["6*t + 2"], variables: ["t"] });
    expect(evaluateAuto(e, { kind: "expression", text: "2 + 6t" }).correct).toBe(true);
    expect(evaluateAuto(e, { kind: "expression", text: "-6t-2" }).feedback.correctness).toBe("PARTIAL");
    expect(evaluateAuto(e, { kind: "expression", text: "12t + 4" }).feedback.message).toMatch(/factor/);
  });

  it("grades ordering and classification with partial credit", () => {
    const o = q({ kind: "ORDERING", orderItems: ["a", "b", "c", "d"] });
    expect(evaluateAuto(o, { kind: "order", items: ["a", "b", "c", "d"] }).correct).toBe(true);
    const partial = evaluateAuto(o, { kind: "order", items: ["a", "b", "d", "c"] });
    expect(partial.correct).toBe(false);
    expect(partial.score).toBeCloseTo(2 / 3);
    const c = q({ kind: "CLASSIFICATION", classification: { categories: ["X", "Y"], items: [{ text: "1", category: "X" }, { text: "2", category: "Y" }] } });
    expect(evaluateAuto(c, { kind: "classify", map: { "1": "X", "2": "Y" } }).correct).toBe(true);
    expect(evaluateAuto(c, { kind: "classify", map: { "1": "X", "2": "X" } }).score).toBe(0.5);
  });

  it("open responses are ungraded until rubric/AI evaluation", () => {
    const t = q({ kind: "PROOF", rubric: ["a", "b", "c", "d"] });
    expect(evaluateAuto(t, { kind: "text", text: "proof" }).correct).toBeNull();
    const ev = evaluateSelf(t, [true, true, true, false], 0.7);
    expect(ev.correct).toBe(true);
    expect(ev.feedback.errorTypes).toContain("INCOMPLETE_EXPLANATION");
    expect(evaluateSelf(t, [true, false, false, false], 0.7).correct).toBe(false);
  });
});

describe("Phase 4 — session loop", () => {
  const setup = () => {
    const db = createEmptyDB();
    const { courseId } = importCurriculum(db, structuredClone(mechanicsPack), { source: { kind: "SEED", text: "" }, generatedBy: "seed" });
    const m = courseMilestones(db, courseId).find((x) => x.title.startsWith("Resolve a vector"))!;
    const s = ensureSession(db, courseId);
    return { db, m, s, courseId };
  };
  const answer = (db: ReturnType<typeof setup>["db"], sid: string, question: Question, correct: boolean, hint = 0) =>
    recordAttempt(db, {
      questionId: question.id, milestoneId: question.milestoneId, sessionId: sid, answer: null, correct, score: correct ? 1 : 0,
      feedback: { correctness: correct ? "CORRECT" : "INCORRECT", reasoningQuality: "UNKNOWN", errorTypes: [], message: "" },
      hintLevelUsed: hint as 0, evaluatedBy: "auto", inputMethod: "pen", usedStylus: true, durationMs: 5000, purpose: question.purpose,
    });

  it("walks attempt → retry → mastery and never offers retention/transfer questions as work", () => {
    const { db, m, s } = setup();
    const q1 = nextQuestion(db, m.id)!;
    expect(["PRACTICE", "MASTERY"]).toContain(q1.purpose);
    answer(db, s.id, q1, false);
    expect(nextQuestion(db, m.id)!.id).toBe(q1.id); // retry the same question
    expect(nextQuestion(db, m.id, { exclude: [q1.id] })!.id).not.toBe(q1.id); // or choose a different one
    answer(db, s.id, q1, true);
    const q2 = nextQuestion(db, m.id)!;
    expect(q2.id).not.toBe(q1.id);
    const r = answer(db, s.id, q2, true);
    expect(r.masteredNow).toBe(true);
    expect(nextQuestion(db, m.id)).toBeNull();
    expect(milestoneSessionState(db, m.id).mastered).toBe(true);
  });

  it("answers after the full solution do not count toward mastery", () => {
    const { db, m, s } = setup();
    const q1 = nextQuestion(db, m.id)!;
    answer(db, s.id, q1, true, 5);
    expect(nextQuestion(db, m.id)!.id).toBe(q1.id);
    expect(milestoneSessionState(db, m.id).progress.achieved).toBe(0);
  });

  it("reuses an open session and closes stale ones as abandoned", () => {
    const { db, s, courseId } = setup();
    expect(ensureSession(db, courseId).id).toBe(s.id);
    closeStaleSessions(db, Date.now() + 31 * 60_000);
    expect(db.sessions[s.id].endReason).toBe("ABANDONED");
    expect(ensureSession(db, courseId).id).not.toBe(s.id);
  });
});
