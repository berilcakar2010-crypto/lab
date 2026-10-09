import { describe, expect, it } from "vitest";
import { kit, answer, T0 } from "./testkit";
import { detectStuck, logStuck, simplerQuestion } from "./stuck";
import { logEvent } from "../engines/analytics";

const MIN = 60_000;

function setup() {
  const k = kit(["math.prob.bayes", "math.stat.bayesian"], { kinds: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "MULTIPLE_CHOICE"], prereqChain: true });
  const mid = k.ms["math.stat.bayesian"];
  const q = k.qs[mid][0];
  logEvent(k.db, "QUESTION_SHOWN", { milestoneId: mid, questionId: q, sessionId: k.sessionId, at: T0 });
  return { k, mid, q };
}

describe("stuck detection", () => {
  it("3 failed attempts + 2 hints + a long time + the same conceptual error = STUCK", () => {
    const { k, mid, q } = setup();
    logEvent(k.db, "HINT_REQUEST", { milestoneId: mid, questionId: q, at: T0 + 2 * MIN }, { level: 1 });
    logEvent(k.db, "HINT_REQUEST", { milestoneId: mid, questionId: q, at: T0 + 4 * MIN }, { level: 2 });
    for (let i = 0; i < 3; i++) answer(k, q, false, { answer: 1, errorTypes: ["CONCEPTUAL"], at: T0 + (3 + i * 2) * MIN, hint: 2 });
    const r = detectStuck(k.db, { milestoneId: mid, questionId: q, now: T0 + 12 * MIN });
    expect(r.state).toBe("STUCK");
    expect(r.signals.map((s) => s.kind)).toEqual(expect.arrayContaining(["WRONG_STREAK", "HINTS", "LONG_TIME", "RETRIES", "REPEATED_ERROR"]));
    // Options, with the solution last and not recommended.
    expect(r.options.map((o) => o.kind)).toEqual(["TRY_AGAIN", "SMALL_HINT", "CONCEPT_EXPLANATION", "SIMPLER_EXAMPLE", "CHECK_PREREQUISITE", "CHANGE_STRATEGY", "SKIP_TEMPORARILY", "SEE_SOLUTION"]);
    expect(r.options.at(-1)!.recommended).toBeFalsy();
    const pre = r.options.find((o) => o.kind === "CHECK_PREREQUISITE")!;
    expect(pre.target?.loId ?? pre.target?.milestoneId).toBeTruthy();
    expect(logStuck(k.db, r, { milestoneId: mid, questionId: q, now: T0 + 12 * MIN })).toBe(true);
    expect(logStuck(k.db, r, { milestoneId: mid, questionId: q, now: T0 + 13 * MIN })).toBe(false);
    expect(Object.values(k.db.decisions).some((d) => d.role === "STUCK_DETECTOR")).toBe(true);
  });

  it("does not fire on hints alone or a long think without wrong answers (false-positive protection)", () => {
    const { k, mid, q } = setup();
    logEvent(k.db, "HINT_REQUEST", { milestoneId: mid, questionId: q, at: T0 + MIN }, { level: 1 });
    logEvent(k.db, "HINT_REQUEST", { milestoneId: mid, questionId: q, at: T0 + 2 * MIN }, { level: 3 });
    expect(detectStuck(k.db, { milestoneId: mid, questionId: q, now: T0 + 30 * MIN }).state).toBe("OK");
  });

  it("one wrong answer after a long time is only struggling at most", () => {
    const { k, mid, q } = setup();
    answer(k, q, false, { answer: 1, at: T0 + 9 * MIN });
    expect(detectStuck(k.db, { milestoneId: mid, questionId: q, now: T0 + 10 * MIN }).state).not.toBe("STUCK");
  });

  it("a correct answer resets the window", () => {
    const { k, mid, q } = setup();
    for (let i = 0; i < 3; i++) answer(k, q, false, { answer: 1, errorTypes: ["CONCEPTUAL"], at: T0 + i * MIN });
    answer(k, q, true, { at: T0 + 4 * MIN });
    expect(detectStuck(k.db, { milestoneId: mid, questionId: q, now: T0 + 5 * MIN }).state).toBe("OK");
  });

  it("offers a simpler question from the same milestone or a prerequisite", () => {
    const { k, mid, q } = setup();
    k.db.questions[k.qs[mid][1]].difficulty = 1;
    expect(simplerQuestion(k.db, mid, q)).toBe(k.qs[mid][1]);
    for (const x of k.qs[mid]) k.db.questions[x].difficulty = 3;
    expect(k.qs[k.ms["math.prob.bayes"]]).toContain(simplerQuestion(k.db, mid, q));
  });
});
