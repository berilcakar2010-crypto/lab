import { describe, expect, it } from "vitest";
import { kit, answer, T0, DAY } from "./testkit";
import { masteryProfile, profileGap, staleObjects, staleRemedy, HINT_WEIGHT } from "./mastery";
import { setSelfAttested } from "../knowledge/actions";
import { reviewTopic } from "../study/topics";

const LO = "phys.mech.newton";

describe("mastery profile", () => {
  it("scores dimensions separately from the evidence and leaves unproven ones empty", () => {
    const k = kit([LO], { kinds: ["NUMERIC", "MULTIPLE_CHOICE", "NUMERIC"] });
    const [num1, mc, num2] = k.qs[k.ms[LO]];
    answer(k, num1, true, { at: T0 });
    answer(k, num2, true, { at: T0 + 1000 });
    answer(k, mc, false, { at: T0 + 2000 });
    const p = masteryProfile(k.db, LO, T0 + DAY);
    expect(p.dims.problemSolving.score!).toBeGreaterThan(0.7);
    expect(p.dims.recall.score!).toBeLessThan(0.5);
    expect(p.dims.transfer.score).toBeNull();
    expect(p.dims.explanation.score).toBeNull();
    expect(p.evidenceCount).toBe(3);
    expect(p.verified).toBeGreaterThan(0.3);
    expect(p.verified).toBeLessThan(0.9);
  });

  it("updates when new evidence arrives (profile update) and counts help less", () => {
    const k = kit([LO], { kinds: ["NUMERIC", "NUMERIC", "NUMERIC"] });
    const [a, b, c] = k.qs[k.ms[LO]];
    answer(k, a, true, { at: T0 });
    const before = masteryProfile(k.db, LO, T0 + DAY).verified;
    answer(k, b, true, { at: T0 + 1000 });
    answer(k, c, true, { at: T0 + 2000 });
    const after = masteryProfile(k.db, LO, T0 + DAY).verified;
    expect(after).toBeGreaterThan(before);

    const helped = kit([LO], { kinds: ["NUMERIC", "NUMERIC", "NUMERIC"] });
    for (const q of helped.qs[helped.ms[LO]]) answer(helped, q, true, { at: T0, hint: 4 });
    expect(masteryProfile(helped.db, LO, T0 + DAY).verified).toBeLessThan(after);
    // An answer after the full solution is not evidence at all.
    const solved = kit([LO], { kinds: ["NUMERIC"] });
    answer(solved, solved.qs[solved.ms[LO]][0], true, { at: T0, hint: 5 });
    expect(HINT_WEIGHT[5]).toBe(0);
    expect(masteryProfile(solved.db, LO, T0 + DAY).evidenceCount).toBe(0);
  });

  it("keeps self-declared knowledge apart from verified mastery", () => {
    const k = kit([LO]);
    setSelfAttested(k.db, LO, true, T0);
    const p = masteryProfile(k.db, LO, T0);
    expect(p.selfDeclared).toBeGreaterThanOrEqual(0.8);
    expect(p.verified).toBe(0);
    expect(profileGap(p)).toMatch(/little verified|az doğrulanmış/);
  });

  it("goes stale when not verified for a long time and suggests a remedy", () => {
    const k = kit([LO], { kinds: ["NUMERIC", "NUMERIC", "NUMERIC"] });
    for (const q of k.qs[k.ms[LO]]) answer(k, q, true, { at: T0 });
    expect(masteryProfile(k.db, LO, T0 + 5 * DAY).retentionStatus).toBe("FRESH");
    const later = T0 + 200 * DAY;
    const p = masteryProfile(k.db, LO, later);
    expect(p.retentionStatus).toBe("STALE");
    expect(staleObjects(k.db, later).map((x) => x.key)).toContain(LO);
    expect(staleRemedy(p)).toBe("delayedRecall");
    // A successful delayed review refreshes it.
    reviewTopic(k.db, LO, 3, later);
    expect(masteryProfile(k.db, LO, later + 1000).retentionStatus).toBe("FRESH");
  });

  it("sees 'knows it but cannot transfer'", () => {
    const k = kit([LO], { kinds: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "NUMERIC"] });
    const [mc1, mc2, num] = k.qs[k.ms[LO]];
    answer(k, mc1, true, { at: T0 });
    answer(k, mc2, true, { at: T0 });
    answer(k, mc1, true, { at: T0 + 10 });
    answer(k, num, false, { at: T0 + 20, purpose: "TRANSFER" });
    answer(k, num, false, { at: T0 + 30, purpose: "TRANSFER" });
    const p = masteryProfile(k.db, LO, T0 + DAY);
    expect(p.dims.transfer.score!).toBeLessThan(0.5);
    expect(profileGap(p)).toMatch(/transfer/);
  });
});
