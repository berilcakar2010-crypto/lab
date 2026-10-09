import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import { groupOf, type VisitRow } from "../engines/statistics";
import { FOCUS_FACTORS } from "../engines/focusLab";
import { concludeExperiment, experimentReport, hypothesisArm, startExperiment } from "../engines/experiments";
import { kit } from "./testkit";
import { checkMilestone } from "./granularity";

describe("Focus Lab and experiments in the adaptive system", () => {
  it("can compare milestone granularity", () => {
    expect(FOCUS_FACTORS).toEqual(expect.arrayContaining(["duration", "difficulty", "interaction", "stylus", "feedback", "challenge", "novelty", "subject", "timeOfDay", "assistance", "granularity"]));
    const k = kit(["phys.mech.newton"]);
    const id = k.ms["phys.mech.newton"];
    const row = { milestoneId: id } as VisitRow;
    k.db.milestones[id].scope = "MICRO";
    expect(groupOf(k.db, row, "granularity")).toMatch(/micro|mikro/);
    k.db.milestones[id].learningObjective = "Derive, prove, calculate and design everything in mechanics";
    checkMilestone(k.db, id);
    expect(groupOf(k.db, row, "granularity")).toMatch(/too broad|çok geniş/);
  });

  it("stores the result as hypothesis, design, observed data, result, confidence and limitations", () => {
    const db = createEmptyDB();
    const exp = startExperiment(db, "MILESTONE_SIZE", 3);
    const r = experimentReport(db, exp.id);
    expect(r.hypothesis).toBe(exp.hypothesis);
    expect(r.design).toMatch(/alternating|dönüşümlü/);
    expect(r.result).toBe("INCONCLUSIVE");
    expect(r.confidence).toBeLessThan(0.5);
    expect(r.limitations.length).toBeGreaterThanOrEqual(3);
    expect(hypothesisArm(exp)).toBe(0);
    concludeExperiment(db, exp.id, "done");
    expect(db.experiments[exp.id].status).toBe("CONCLUDED");
    expect(db.experiments[exp.id].report!.result).toBe("INCONCLUSIVE");
  });
});
