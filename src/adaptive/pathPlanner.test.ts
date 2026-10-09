import { describe, expect, it } from "vitest";
import { kit, answer, T0, DAY } from "./testkit";
import { abandonPath, activePath, addStep, createPath, currentStep, moveStep, planPath, refreshPath, resumePath, skipStep } from "./pathPlanner";
import { getBaseGraph } from "../knowledge/graph";
import { setSelfAttested } from "../knowledge/actions";

const g = getBaseGraph();
const GOAL = "math.stat.bayesian";
const ids = (p: { steps: { loId: string }[] }) => p.steps.map((s) => s.loId);

function master(k: ReturnType<typeof kit>, lo: string, at = T0) {
  for (const q of k.qs[k.ms[lo]]) { answer(k, q, true, { at }); answer(k, q, true, { at: at + 1 }); }
}

describe("path planner", () => {
  it("plans prerequisites before the goal, with reasons, without touching the curriculum", () => {
    const k = kit(["math.prob.counting"]);
    const before = JSON.stringify(k.db.milestones);
    const p = planPath(k.db, g, { goalIds: [GOAL] }, T0);
    const order = ids(p);
    expect(order.at(-1)).toBe(GOAL);
    for (const pre of ["math.prob.counting", "math.prob.basics", "math.prob.bayes"]) expect(order).toContain(pre);
    expect(order.indexOf("math.prob.counting")).toBeLessThan(order.indexOf("math.prob.basics"));
    expect(order.indexOf("math.prob.basics")).toBeLessThan(order.indexOf("math.prob.bayes"));
    const basics = p.steps.find((s) => s.loId === "math.prob.basics")!;
    expect(basics.reasons.map((r) => r.code)).toEqual(expect.arrayContaining(["PREREQUISITE", "MASTERY_GAP", "GOAL_RELEVANCE"]));
    expect(JSON.stringify(k.db.milestones)).toBe(before);
  });

  it("leaves out what is verified, verifies what is only self-declared, and repairs what errors point to", () => {
    const k = kit(["math.prob.counting", "math.prob.basics", "math.prob.bayes", "math.stat.bayesian"], { kinds: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "MULTIPLE_CHOICE"] });
    master(k, "math.prob.counting");
    setSelfAttested(k.db, "math.prob.distributions", true, T0);
    answer(k, k.qs[k.ms[GOAL]][0], false, { answer: 1, errorTypes: ["CONCEPTUAL"], at: T0 + 10 });
    const p = planPath(k.db, g, { goalIds: [GOAL] }, T0 + DAY);
    expect(ids(p)).not.toContain("math.prob.counting");
    expect(p.steps.find((s) => s.loId === "math.prob.distributions")!.role).toBe("verify");
    const repair = p.steps.find((s) => s.role === "repair")!;
    expect(repair).toBeTruthy();
    expect(repair.reasons.some((r) => r.code === "RECENT_ERRORS")).toBe(true);
  });

  it("offers alternative paths through options (soft prerequisites, difficulty) and exam priorities", () => {
    const k = kit(["math.prob.counting"]);
    const strict = planPath(k.db, g, { goalIds: ["neuro.comp.hh-model"] }, T0);
    const gentle = planPath(k.db, g, { goalIds: ["neuro.comp.hh-model"], options: { difficulty: "gentle", includeSoft: true } }, T0);
    expect(gentle.steps.length).toBeGreaterThan(strict.steps.length);
    const exam = planPath(k.db, g, { goalIds: ["math.prob.bayes", "math.prob.distributions"], exam: { id: "e1", priorities: { "math.prob.distributions": 3, "math.prob.bayes": 1 } } }, T0);
    expect(exam.mode).toBe("EXAM");
    expect(exam.steps.find((s) => s.loId === "math.prob.distributions")!.reasons.some((r) => r.code === "EXAM")).toBe(true);
    // Among independent goals the high-priority one comes first.
    expect(ids(exam).indexOf("math.prob.distributions")).toBeLessThan(ids(exam).indexOf("math.prob.bayes"));
  });

  it("lets the learner override: skip, add, reorder, abandon and resume", () => {
    const k = kit(["math.prob.counting"]);
    const p = createPath(k.db, g, { goalIds: [GOAL] }, T0);
    expect(activePath(k.db)!.id).toBe(p.id);
    const first = currentStep(p)!.loId;
    skipStep(k.db, p.id, first, T0 + 1);
    expect(currentStep(k.db.paths[p.id])!.loId).not.toBe(first);
    addStep(k.db, g, p.id, "math.stat.descriptive", T0 + 2);
    expect(ids(k.db.paths[p.id])).toContain("math.stat.descriptive");
    const second = k.db.paths[p.id].steps[1].loId;
    moveStep(k.db, p.id, second, -1, T0 + 3);
    expect(k.db.paths[p.id].steps[0].loId).toBe(second);
    abandonPath(k.db, p.id, T0 + 4);
    expect(activePath(k.db)).toBeUndefined();
    resumePath(k.db, p.id, T0 + 5);
    expect(activePath(k.db)!.id).toBe(p.id);
    const types = k.db.events.map((e) => e.type);
    for (const t of ["PATH_CREATED", "PATH_MODIFIED", "PATH_ABANDONED", "PATH_RESUMED"]) expect(types).toContain(t);
    expect(k.db.paths[p.id].history.map((h) => h.action)).toEqual(["created", "skip", "add", "move-up", "abandoned", "resumed"]);
    expect(Object.values(k.db.decisions).some((d) => d.role === "PATH_PLANNER")).toBe(true);
  });

  it("marks steps done from new verified evidence", () => {
    const k = kit(["math.prob.counting", "math.prob.basics"], { kinds: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "MULTIPLE_CHOICE"] });
    const p = createPath(k.db, g, { goalIds: ["math.prob.basics"] }, T0);
    expect(p.steps.find((s) => s.loId === "math.prob.counting")!.status).toBe("TODO");
    master(k, "math.prob.counting", T0 + DAY);
    expect(refreshPath(k.db, p.id, T0 + DAY + 10)).toContain("math.prob.counting");
    expect(k.db.paths[p.id].steps.find((s) => s.loId === "math.prob.counting")!.status).toBe("DONE");
    master(k, "math.prob.basics", T0 + 2 * DAY);
    refreshPath(k.db, p.id, T0 + 2 * DAY + 10);
    expect(k.db.paths[p.id].status).toBe("COMPLETED");
  });
});
