import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createEmptyDB } from "../data/db";
import type { LabDB } from "../domain/types";
import { importCurriculum, type CurriculumSpec } from "./curriculumSpec";
import { courseMilestones, milestoneQuestions } from "./curriculum";
import { logEvent } from "./analytics";
import { endSession, leaveMilestone, openMilestone, recordAttempt, startSession } from "./progress";
import { overview, rate, visitRows, engagementLift } from "./statistics";
import { focusReport, analyseFactor } from "./focusLab";

/** A course with many short and many long independent milestones. */
function course(n: number): { db: LabDB; short: string[]; long: string[] } {
  const ms = (prefix: string, minutes: number) =>
    Array.from({ length: n }, (_, i) => ({
      key: `${prefix}${i}`, title: `${prefix} ${i}`, type: "PRACTICE", estimatedMinutes: minutes, difficulty: 2, requiredCorrect: 1,
      questions: [{ kind: "NUMERIC", purpose: "MASTERY", prompt: "x", numeric: { value: 1 } }],
    }));
  const spec: CurriculumSpec = { title: "Sim", goal: "g", units: [{ title: "U", topics: [{ title: "S", milestones: ms("short", 8) }, { title: "L", milestones: ms("long", 45) }] }] };
  const db = createEmptyDB();
  const { courseId } = importCurriculum(db, spec, { source: { kind: "SEED", text: "" }, generatedBy: "t" });
  const all = courseMilestones(db, courseId);
  return { db, short: all.filter((m) => m.estimatedDuration === 8).map((m) => m.id), long: all.filter((m) => m.estimatedDuration === 45).map((m) => m.id) };
}

let clock = 1_700_000_000_000;
/** Advance a fake system clock so every engine timestamp is consistent. */
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

function visit(db: LabDB, milestoneId: string, opts: { complete: boolean; continued?: boolean; failFirst?: boolean; retry?: boolean }) {
  const s = startSession(db, db.milestones[milestoneId].courseId, tick(3_600_000));
  openMilestone(db, s.id, milestoneId);
  const q = milestoneQuestions(db, milestoneId)[0];
  const attempt = (correct: boolean) =>
    recordAttempt(db, { questionId: q.id, milestoneId, sessionId: s.id, answer: 1, correct, score: correct ? 1 : 0, createdAt: tick(60_000),
      feedback: { correctness: correct ? "CORRECT" : "INCORRECT", reasoningQuality: "UNKNOWN", errorTypes: [], message: "" },
      hintLevelUsed: 0, evaluatedBy: "auto", inputMethod: "keyboard", usedStylus: false, durationMs: 60_000, purpose: "MASTERY" });
  if (opts.failFirst) attempt(false);
  if (opts.complete && (!opts.failFirst || opts.retry !== false)) attempt(true);
  else {
    tick(30_000);
    leaveMilestone(db, s.id, milestoneId, false);
  }
  if (opts.complete) logEvent(db, "CONTINUE_DECISION", { sessionId: s.id, at: tick(1000) }, { continued: !!opts.continued });
  endSession(db, s.id, "USER_ENDED", tick(60_000));
}

describe("Phase 8 — statistics", () => {
  it("withholds rates below the minimum sample and reports intervals otherwise", () => {
    expect(rate(2, 3).value).toBeNull();
    const r = rate(8, 10);
    expect(r.value).toBe(0.8);
    expect(r.low!).toBeGreaterThan(0.4);
    expect(r.high!).toBeLessThan(1);
  });

  it("an empty database produces no fake numbers", () => {
    const o = overview(createEmptyDB());
    expect(o.sessions).toBe(0);
    expect(o.completion.value).toBeNull();
    expect(o.milestonesPerHour.value).toBeNull();
    expect(o.engagement).toBeNull();
    expect(o.delayedRetention.value).toBeNull();
    expect(focusReport(createEmptyDB()).patterns).toEqual([]);
  });

  it("computes progress, engagement and learning metrics from events", () => {
    const { db, short } = course(6);
    for (let i = 0; i < 6; i++) visit(db, short[i], { complete: i < 5, continued: i % 2 === 0, failFirst: i < 2 });
    const o = overview(db);
    expect(o.sessions).toBe(6);
    expect(o.milestonesCompleted).toBe(5);
    expect(o.completion.k).toBe(5);
    expect(o.completion.n).toBe(6);
    expect(o.retry.k).toBe(2);
    expect(o.continuation.n).toBe(5);
    expect(o.continuation.k).toBe(3);
    expect(o.persistence.n).toBe(2);
    expect(o.activeMs).toBeGreaterThan(0);
    const rows = visitRows(db);
    expect(rows).toHaveLength(6);
    expect(rows[0].estimatedDuration).toBe(8);
  });
});

describe("Phase 8 — Focus Lab", () => {
  it("finds an association with cautious wording when the data supports it", () => {
    const { db, short, long } = course(14);
    // Short milestones: mostly continued; long ones: mostly stopped.
    short.forEach((id, i) => visit(db, id, { complete: true, continued: i < 12 }));
    long.forEach((id, i) => visit(db, id, { complete: true, continued: i < 3 }));
    const { pattern } = analyseFactor(db, visitRows(db), "duration", "continuation");
    expect(pattern).not.toBeNull();
    expect(pattern!.high.group).toMatch(/short/);
    expect(pattern!.strength).toBe("associated");
    expect(pattern!.sentence).toMatch(/appears associated with/);
    expect(pattern!.sentence).not.toMatch(/causes|because|leads to/i);
    expect(focusReport(db).hypothesis[0].pattern).not.toBeNull();
    // Recommendation engine can now use the (observational) continuation lift.
    expect(Object.keys(engagementLift(db)).length).toBeGreaterThan(0);
  });

  it("reports insufficient data rather than a pattern for tiny samples", () => {
    const { db, short, long } = course(3);
    short.forEach((id) => visit(db, id, { complete: true, continued: true }));
    long.forEach((id) => visit(db, id, { complete: true, continued: false }));
    const { pattern, status } = analyseFactor(db, visitRows(db), "duration", "continuation");
    expect(pattern).toBeNull();
    expect(status.status).toBe("insufficient");
  });

  it("does not call small differences a pattern", () => {
    const { db, short, long } = course(12);
    short.forEach((id, i) => visit(db, id, { complete: true, continued: i < 7 }));
    long.forEach((id, i) => visit(db, id, { complete: true, continued: i < 6 }));
    expect(analyseFactor(db, visitRows(db), "duration", "continuation").status.status).toBe("no-difference");
  });
});
