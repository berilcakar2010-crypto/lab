import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import { kit, answer, T0, DAY } from "./testkit";
import { learningMetrics, CAUSAL_WORDS } from "./metrics";
import { logEvent } from "../engines/analytics";
import { startSession, endSession } from "../engines/progress";
import { reviewTopic } from "../study/topics";

describe("learning metrics", () => {
  it("reports 'not enough data' instead of numbers when there is no data", () => {
    const m = learningMetrics(createEmptyDB(), { now: T0 });
    expect(m.layers).toEqual({ engagement: "INSUFFICIENT", learning: "INSUFFICIENT", retention: "INSUFFICIENT" });
    expect(m.learning.immediateAccuracy.value).toBeNull();
    expect(m.productivity.milestonesPerHour.value).toBeNull();
    expect(m.depth.meanDepth.value).toBeNull();
  });

  it("derives every layer from raw events and keeps engagement, learning and retention apart", () => {
    const k = kit(["phys.mech.newton", "phys.mech.momentum"], { kinds: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "MULTIPLE_CHOICE"] });
    // Many long sessions (high engagement), good first tries (learning), poor delayed recall (retention).
    for (let d = 0; d < 20; d++) {
      const s = startSession(k.db, k.courseId, T0 + d * DAY);
      k.sessionId = s.id;
      logEvent(k.db, "MILESTONE_OPEN", { sessionId: s.id, milestoneId: k.ms["phys.mech.newton"], at: T0 + d * DAY + 1000 });
      for (const q of k.qs[k.ms["phys.mech.newton"]]) answer(k, q, true, { at: T0 + d * DAY + 60_000 });
      logEvent(k.db, "ACTIVITY_TICK", { sessionId: s.id, at: T0 + d * DAY + 25 * 60_000 });
      endSession(k.db, s.id, "COMPLETED", T0 + d * DAY + 25 * 60_000);
    }
    for (let i = 0; i < 6; i++) reviewTopic(k.db, "phys.mech.momentum", 0, T0 + (i + 1) * 3 * DAY);
    const m = learningMetrics(k.db, { now: T0 + 25 * DAY, days: 30 });
    expect(m.window.sessions).toBe(21); // + the kit's own session
    expect(m.layers.engagement).toBe("HIGH");
    expect(m.layers.learning).toBe("HIGH");
    expect(m.layers.retention).toBe("LOW");
    expect(m.productivity.attemptsPerSession.value).toBeCloseTo(60 / 21, 5);
    expect(m.engagement.medianSessionMinutes.value!).toBeGreaterThan(20);
    expect(m.depth.recall.value).toBe(1);
    expect(m.summary.join(" ")).toMatch(/observation|gözlem/);
    for (const s of m.summary) expect(s).not.toMatch(CAUSAL_WORDS);
  });

  it("counts errors and transfer from raw records", () => {
    const k = kit(["phys.mech.newton"], { kinds: ["NUMERIC", "NUMERIC", "NUMERIC", "NUMERIC", "NUMERIC", "NUMERIC"] });
    for (const q of k.qs[k.ms["phys.mech.newton"]]) answer(k, q, false, { answer: -10, purpose: "TRANSFER", at: T0 + 10 });
    const m = learningMetrics(k.db, { now: T0 + DAY });
    expect(m.subject.mostCommonError).toMatch(/Transfer|Calculation|Hesap/);
    expect(m.learning.transferSuccess.value).toBe(0);
  });
});
