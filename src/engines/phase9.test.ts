import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createEmptyDB } from "../data/db";
import type { LabDB, Question } from "../domain/types";
import { importCurriculum, type CurriculumSpec } from "./curriculumSpec";
import { courseMilestones, milestoneQuestions } from "./curriculum";
import { logEvent } from "./analytics";
import { completeRetentionCheck, dueRetentionChecks, endSession, openMilestone, recordAttempt } from "./progress";
import { ensureSession } from "./sessions";
import { reviewQuestion } from "./sessionPlan";
import { assignArms, compareExperiment, runningExperiment, sessionConditions, setExperimentStatus, startExperiment } from "./experiments";
import { mechanicsPack } from "../ai/packs/mechanics";

let clock = 1_700_000_000_000;
const tick = (ms: number) => {
  clock += ms;
  vi.setSystemTime(clock);
  return clock;
};
beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(clock);
});
afterAll(() => vi.useRealTimers());
const DAY = 86_400_000;

const answer = (db: LabDB, sessionId: string, q: Question, correct: boolean, purpose: Question["purpose"] = q.purpose) =>
  recordAttempt(db, {
    questionId: q.id, milestoneId: q.milestoneId, sessionId, answer: null, correct, score: correct ? 1 : 0, createdAt: tick(30_000),
    feedback: { correctness: correct ? "CORRECT" : "INCORRECT", reasoningQuality: "UNKNOWN", errorTypes: [], message: "" },
    hintLevelUsed: 0, evaluatedBy: "auto", inputMethod: "keyboard", usedStylus: false, durationMs: 30_000, purpose,
  });

describe("Phase 9 — retention", () => {
  it("runs immediate, delayed and transfer checks, expands intervals and supports review recovery", () => {
    const db = createEmptyDB();
    const { courseId } = importCurriculum(db, structuredClone(mechanicsPack), { source: { kind: "SEED", text: "" }, generatedBy: "seed" });
    const vec = courseMilestones(db, courseId).find((m) => m.title.startsWith("Resolve a vector"))!;
    const s = ensureSession(db, courseId);
    openMilestone(db, s.id, vec.id);
    const mastery = milestoneQuestions(db, vec.id).filter((q) => q.purpose === "MASTERY");
    answer(db, s.id, mastery[0], true);
    answer(db, s.id, mastery[1], true);
    expect(db.milestones[vec.id].status).toBe("MASTERED");

    // Immediate check is due now; delayed and transfer are scheduled for later.
    const due = dueRetentionChecks(db);
    expect(due.map((d) => d.kind)).toEqual(["IMMEDIATE"]);
    const imm = answer(db, s.id, db.questions[due[0].questionId], true, "RETENTION");
    completeRetentionCheck(db, due[0].id, imm.attempt);
    // A check counts once, even if the question is answered again.
    const again = answer(db, s.id, db.questions[due[0].questionId], false, "RETENTION");
    completeRetentionCheck(db, due[0].id, again.attempt);
    expect(db.retention[due[0].id].correct).toBe(true);

    tick(4 * DAY);
    const later = dueRetentionChecks(db);
    expect(later.map((d) => d.kind).sort()).toEqual(["DELAYED", "TRANSFER"]);
    const transfer = later.find((d) => d.kind === "TRANSFER")!;
    expect(db.questions[transfer.questionId].purpose).toBe("TRANSFER");
    const delayed = later.find((d) => d.kind === "DELAYED")!;
    const s2 = ensureSession(db, courseId, clock);
    const d1 = answer(db, s2.id, db.questions[delayed.questionId], true, "RETENTION");
    completeRetentionCheck(db, delayed.id, d1.attempt);
    // Success schedules a longer interval (spacing expands).
    const next = Object.values(db.retention).find((r) => r.kind === "DELAYED" && !r.completedAt)!;
    expect(next.intervalDays).toBeGreaterThan(delayed.intervalDays);

    const t1 = answer(db, s2.id, db.questions[transfer.questionId], false, "TRANSFER");
    completeRetentionCheck(db, transfer.id, t1.attempt);
    expect(db.milestones[vec.id].status).toBe("NEEDS_REVIEW");

    // Review: a correct answer restores mastery.
    const rq = reviewQuestion(db, vec.id)!;
    expect(rq.purpose).not.toBe("TRANSFER");
    answer(db, s2.id, rq, true, "MASTERY");
    expect(db.milestones[vec.id].status).toBe("MASTERED");
  });
});

describe("Phase 9 — personal experiments", () => {
  const spec = (n: number): CurriculumSpec => ({
    title: "Sim", goal: "g", units: [{ title: "U", topics: [{ title: "T", milestones: Array.from({ length: n }, (_, i) => ({
      key: `m${i}`, title: `m${i}`, estimatedMinutes: 10, requiredCorrect: 1, questions: [{ kind: "NUMERIC", purpose: "MASTERY", prompt: "x", numeric: { value: 1 } }],
    })) }] }],
  });

  it("allows one running experiment, alternates arms and exposes conditions", () => {
    const db = createEmptyDB();
    const exp = startExperiment(db, "MILESTONE_SIZE", 3);
    expect(() => startExperiment(db, "STYLUS")).toThrow(/Another experiment/);
    const arms: string[] = [];
    for (let i = 0; i < 6; i++) {
      const s = ensureSession(db, undefined, tick(3_600_000));
      arms.push(s.experimentArms[exp.id]);
      expect(sessionConditions(db, s.id).preferScope).toMatch(/MICRO|LONG/);
      endSession(db, s.id, "USER_ENDED", tick(60_000));
    }
    const counts = exp.arms.map((a) => arms.filter((x) => x === a.id).length);
    expect(counts).toEqual([3, 3]);
    // Pausing stops assignment.
    setExperimentStatus(db, exp.id, "PAUSED");
    const s = ensureSession(db, undefined, tick(3_600_000));
    expect(s.experimentArms[exp.id]).toBeUndefined();
    expect(sessionConditions(db, s.id)).toEqual({});
    expect(runningExperiment(db)).toBeUndefined();
  });

  it("declares nothing on small samples and reports a difference only when the data supports it", () => {
    const db = createEmptyDB();
    const { courseId } = importCurriculum(db, spec(60), { source: { kind: "SEED", text: "" }, generatedBy: "t" });
    const ms = courseMilestones(db, courseId);
    const exp = startExperiment(db, "NEXT_CHOICE", 6);
    let k = 0;
    const runSession = (contProb: (i: number) => boolean, sessions: number) => {
      for (let i = 0; i < sessions; i++) {
        const s = ensureSession(db, courseId, tick(3_600_000));
        const armIdx = exp.arms.findIndex((a) => a.id === s.experimentArms[exp.id]);
        for (let j = 0; j < 2; j++) {
          const m = ms[k++ % ms.length];
          openMilestone(db, s.id, m.id);
          answer(db, s.id, milestoneQuestions(db, m.id)[0], true);
          logEvent(db, "CONTINUE_DECISION", { sessionId: s.id, at: tick(1000) }, { continued: armIdx === 0 ? true : contProb(i * 2 + j) });
        }
        endSession(db, s.id, "USER_ENDED", tick(60_000));
      }
    };
    runSession(() => false, 4);
    const early = compareExperiment(db, exp.id);
    expect(early.enoughSessions).toBe(false);
    expect(early.verdict).toMatch(/Too early/);
    expect(early.findings.every((f) => f.leader === null)).toBe(true);

    runSession((i) => i % 5 === 0, 16);
    const c = compareExperiment(db, exp.id);
    expect(c.enoughSessions).toBe(true);
    const cont = c.findings.find((f) => f.metric === "continuation")!;
    expect(cont.leader).toBe(exp.arms[0].label);
    expect(c.verdict).toMatch(/appears better/);
    expect(c.verdict).toMatch(/not proof/);
  });

  it("does not assign when experiments are disabled", () => {
    const db = createEmptyDB();
    db.preferences.experimentsEnabled = false;
    const exp = startExperiment(db, "DIFFICULTY");
    const s = ensureSession(db, undefined, tick(3_600_000));
    assignArms(db, s);
    expect(s.experimentArms[exp.id]).toBeUndefined();
  });
});
