import { describe, expect, it } from "vitest";
import { kit, answer, T0, DAY } from "./testkit";
import { whatNext, chooseWhatNext, logWhatNextShown, NEXT_LETTER } from "./whatNext";
import { getBaseGraph } from "../knowledge/graph";
import { createPath } from "./pathPlanner";

const g = getBaseGraph();

describe("what next", () => {
  it("weighs continue, challenge, repair, review, transfer, switch and research — and only ranks them", () => {
    const k = kit(["math.prob.basics", "math.prob.bayes", "math.stat.bayesian"], { kinds: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "MULTIPLE_CHOICE"], prereqChain: true });
    kit(["phys.mech.newton"], { db: k.db, subject: "Physics" });
    const basics = k.ms["math.prob.basics"];
    for (const q of k.qs[basics]) answer(k, q, true, { at: T0 });
    answer(k, k.qs[k.ms["math.stat.bayesian"]][0], false, { answer: 1, errorTypes: ["CONCEPTUAL"], at: T0 + 10 });
    const opts = whatNext(k.db, g, { justCompletedMilestoneId: basics, now: T0 + DAY });
    const kinds = opts.map((o) => o.kind);
    for (const kind of ["CONTINUE", "REPAIR", "SWITCH"] as const) expect(kinds).toContain(kind);
    // Sorted by score but nothing is chosen: every option stays available, each with reasons.
    expect(opts.map((o) => o.score)).toEqual([...opts.map((o) => o.score)].sort((a, b) => b - a));
    for (const o of opts) expect(o.reasons.length).toBeGreaterThan(0);
    const repair = opts.find((o) => o.kind === "REPAIR")!;
    expect(repair.target.loId).toBeTruthy();
    expect(NEXT_LETTER[repair.kind]).toBe("C");
    logWhatNextShown(k.db, opts, { milestoneId: basics });
    chooseWhatNext(k.db, opts[opts.length - 1], { milestoneId: basics });
    expect(k.db.events.filter((e) => e.type === "WHAT_NEXT_SHOWN" || e.type === "WHAT_NEXT_CHOSEN")).toHaveLength(2);
  });

  it("offers transfer and research from the graph, and follows an active path", () => {
    const k = kit(["neuro.comp.hh-model"]);
    for (const q of k.qs[k.ms["neuro.comp.hh-model"]]) answer(k, q, true, { at: T0 });
    const opts = whatNext(k.db, g, { justCompletedMilestoneId: k.ms["neuro.comp.hh-model"], now: T0 + 1 });
    const kinds = opts.map((o) => o.kind);
    expect(kinds).toContain("TRANSFER");
    expect(kinds).toContain("RESEARCH");
    const p = createPath(k.db, g, { goalIds: ["math.stat.bayesian"] }, T0 + 2);
    const cont = whatNext(k.db, g, { now: T0 + 3 }).find((o) => o.kind === "CONTINUE")!;
    expect(cont.target.pathId).toBe(p.id);
  });

  it("finds a due review", () => {
    const k = kit(["phys.mech.newton"]);
    for (const q of k.qs[k.ms["phys.mech.newton"]]) answer(k, q, true, { at: T0 });
    const later = whatNext(k.db, g, { now: T0 + 300 * DAY });
    expect(later.map((o) => o.kind)).toContain("REVIEW");
  });
});
