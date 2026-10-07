import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import type { LabDB, Question } from "../domain/types";
import { importCurriculum } from "./curriculumSpec";
import { courseMilestones } from "./curriculum";
import { computeSessionTimes, logEvent, reconstructSession } from "./analytics";
import { endSession, leaveMilestone, openMilestone, recordAttempt, skipMilestone } from "./progress";
import { ensureSession } from "./sessions";
import { nextQuestion } from "./sessionPlan";
import { mechanicsPack } from "../ai/packs/mechanics";

const T0 = 1_700_000_000_000;
const MIN = 60_000;

describe("Phase 7 — raw analytics", () => {
  it("derives active time from idle and interruption events without double counting", () => {
    const db = createEmptyDB();
    const s = ensureSession(db, undefined, T0);
    const at = (m: number) => ({ sessionId: s.id, at: T0 + m * MIN });
    logEvent(db, "IDLE_START", at(10));
    logEvent(db, "IDLE_END", at(15)); // 5 min idle
    logEvent(db, "IDLE_START", at(20));
    logEvent(db, "INTERRUPTION", at(22), { phase: "start" }); // idle 2 min, then hidden
    logEvent(db, "INTERRUPTION", at(30), { phase: "end" }); // 8 min hidden
    endSession(db, s.id, "USER_ENDED", T0 + 40 * MIN);
    const t = computeSessionTimes(db.events.filter((e) => e.sessionId === s.id))!;
    expect(t.totalMs).toBe(40 * MIN);
    expect(t.idleMs).toBe(7 * MIN);
    expect(t.hiddenMs).toBe(8 * MIN);
    expect(t.activeMs).toBe(25 * MIN);
    expect(t.interruptions).toBe(1);
    expect(db.sessions[s.id].activeMs).toBe(25 * MIN); // cache matches events
  });

  it("closes open idle intervals at session end", () => {
    const db = createEmptyDB();
    const s = ensureSession(db, undefined, T0);
    logEvent(db, "IDLE_START", { sessionId: s.id, at: T0 + 5 * MIN });
    endSession(db, s.id, "ABANDONED", T0 + 9 * MIN);
    expect(computeSessionTimes(db.events)!.activeMs).toBe(5 * MIN);
  });

  it("reconstructs every meaningful interaction of a session from events alone", () => {
    const db: LabDB = createEmptyDB();
    const { courseId } = importCurriculum(db, structuredClone(mechanicsPack), { source: { kind: "SEED", text: "" }, generatedBy: "seed" });
    const ms = courseMilestones(db, courseId);
    const vec = ms.find((m) => m.sourceKey === "mech:vec1")!;
    const calc = ms.find((m) => m.sourceKey === "mech:calc1")!;
    const s = ensureSession(db, courseId);
    const answer = (q: Question, correct: boolean, extra: { hint?: number; input?: "pen" | "keyboard" } = {}) =>
      recordAttempt(db, {
        questionId: q.id, milestoneId: q.milestoneId, sessionId: s.id, answer: "x", correct, score: correct ? 1 : 0,
        feedback: { correctness: correct ? "CORRECT" : "INCORRECT", reasoningQuality: "UNKNOWN", errorTypes: correct ? [] : ["CARELESS"], message: "" },
        hintLevelUsed: (extra.hint ?? 0) as 0, evaluatedBy: "auto", inputMethod: extra.input ?? "keyboard", usedStylus: extra.input === "pen",
        durationMs: 4000, purpose: q.purpose, confidence: 3,
      });

    openMilestone(db, s.id, vec.id);
    const q1 = nextQuestion(db, vec.id)!;
    logEvent(db, "HINT_REQUEST", { sessionId: s.id, milestoneId: vec.id, questionId: q1.id }, { level: 2 });
    answer(q1, false, { hint: 2, input: "pen" });
    answer(q1, true, { hint: 2, input: "pen" });
    answer(nextQuestion(db, vec.id)!, true);
    leaveMilestone(db, s.id, vec.id, true);
    logEvent(db, "CONTINUE_DECISION", { sessionId: s.id }, { continued: true });
    openMilestone(db, s.id, calc.id);
    answer(nextQuestion(db, calc.id)!, false);
    leaveMilestone(db, s.id, calc.id, false);
    const add = ms.find((m) => m.sourceKey === "mech:vec2")!;
    openMilestone(db, s.id, add.id);
    skipMilestone(db, add.id, s.id);
    endSession(db, s.id, "USER_ENDED");

    const r = reconstructSession(db, s.id);
    expect(r.attempts).toBe(4);
    expect(r.correct).toBe(2);
    expect(r.retries).toBe(1);
    expect(r.hints).toBe(1);
    expect(r.completions).toBe(1);
    expect(r.abandonments).toBe(1);
    expect(r.continued).toBe(true);
    expect(r.endReason).toBe("USER_ENDED");
    expect(r.inputMethods).toEqual({ pen: 2, keyboard: 2 });
    expect(r.confidence).toEqual([3, 3, 3, 3]);
    expect(r.visits.map((v) => [v.milestoneId, v.outcome])).toEqual([[vec.id, "COMPLETED"], [calc.id, "ABANDONED"], [add.id, "SKIPPED"]]);
    expect(r.visits[0]).toMatchObject({ attempts: 3, correct: 2, retries: 1, maxHintLevel: 2, usedStylus: true });

    // Each ATTEMPT event carries enough to rebuild the attempt's analytics without the record.
    const ev = db.events.find((e) => e.type === "ATTEMPT")!;
    for (const k of ["attemptId", "correct", "score", "hintLevel", "inputMethod", "usedStylus", "durationMs", "purpose", "questionKind", "milestoneType", "difficulty", "estimatedDuration"]) {
      expect(ev.data).toHaveProperty(k);
    }
    expect(ev.subjectId).toBe(vec.subjectId);
    expect(ev.topicId).toBe(vec.topicId);
  });
});
