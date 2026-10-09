import { describe, expect, it } from "vitest";
import { cognitiveActions, validateGranularity, validateSpec, checkMilestone, capabilityOf, isValid, calibrateGranularity, type GranularityInput } from "./granularity";
import { kit } from "./testkit";
import { packsByLang } from "../ai/localBuilder";
import { courseSpecFor } from "../knowledge/generate";
import { getBaseGraph } from "../knowledge/graph";

const ctx = { siblings: [] as { id: string; text: string }[], knownIds: new Set<string>(["p1"]) };
const base = (objective: string, o: Partial<GranularityInput> = {}): GranularityInput => ({ title: objective, objective, questionCount: 2, estimatedDuration: 20, prerequisites: [], ...o });

describe("granularity validator", () => {
  it("rejects too broad, too narrow and accepts one assessable capability", () => {
    expect(validateGranularity(base("Learn probability"), ctx).status).toContain("TOO_BROAD");
    expect(validateGranularity(base("Read the definition of conditional probability"), ctx).status).toContain("TOO_NARROW");
    const ok = validateGranularity(base("Given two dependent events, calculate and explain conditional probability."), ctx);
    expect(ok.status).toEqual(["VALID"]);
    expect(validateGranularity(base("Derive, prove, calculate and design a full theory of mechanics"), ctx).status).toContain("TOO_BROAD");
    expect(validateGranularity(base("Olasılığı öğren"), ctx).status).toContain("TOO_BROAD");
    expect(validateGranularity(base("Koşullu olasılığın tanımını oku"), ctx).status).toContain("TOO_NARROW");
    expect(validateGranularity(base("Bağımlı iki olay için koşullu olasılığı hesaplar ve açıklar."), ctx).status).toEqual(["VALID"]);
  });

  it("finds duplicates, missing prerequisites and weak evidence", () => {
    const dup = validateGranularity(base("Calculate conditional probability for two dependent events", { id: "b" }), { ...ctx, siblings: [{ id: "a", text: "Calculate conditional probability for two dependent events." }] });
    expect(dup.status).toContain("DUPLICATE");
    expect(dup.duplicateOf).toBe("a");
    expect(validateGranularity(base("Calculate a derivative with the chain rule", { prerequisites: ["p1", "nope"] }), ctx).status).toEqual(["MISSING_PREREQUISITE"]);
    expect(validateGranularity(base("Calculate a derivative with the chain rule", { questionCount: 0, masteryEvidence: "understands derivatives" }), ctx).status).toEqual(["WEAK_EVIDENCE"]);
    expect(validateGranularity(base("Calculate a derivative with the chain rule", { questionCount: 0, masteryEvidence: "3 correct problems, unassisted" }), ctx).status).toEqual(["VALID"]);
  });

  it("names the cognitive action and infers a stored milestone's capability", () => {
    expect(cognitiveActions("Given two events, calculate and explain P(A|B)")).toEqual(["CALCULATE", "EXPLAIN"]);
    const k = kit(["phys.mech.newton"]);
    const m = k.db.milestones[k.ms["phys.mech.newton"]];
    const cap = capabilityOf(k.db, m);
    expect(cap.cognitiveAction).toBe("CALCULATE");
    expect(cap.assessmentMethod).toMatch(/3/);
    expect(isValid(checkMilestone(k.db, m.id)!)).toBe(true);
    expect(k.db.milestones[m.id].granularity!.status).toEqual(["VALID"]);
    expect(calibrateGranularity(k.db).effortRatio).toBeNull();
  });

  it("keeps false positives low on the built-in content", () => {
    const flagged: string[] = [];
    let total = 0;
    const specs = Object.values(packsByLang).flatMap((p) => [p.en, p.tr]);
    const g = getBaseGraph();
    for (const id of ["phys.mech.newton", "math.calc.limits", "math.prob.basics", "neuro.comp.hh-model", "chem.bonding.covalent", "bio.cell.structure"]) if (g.objects[id]) specs.push(courseSpecFor(g, [id], "t", "g"));
    for (const spec of specs) for (const r of validateSpec(spec)) { total++; if (!isValid(r.result)) flagged.push(`${r.title}: ${r.result.status.join(",")}`); }
    expect(total).toBeGreaterThan(40);
    // Hand-written and graph-generated milestones should almost all be one assessable capability.
    expect(flagged.length / total, flagged.join("\n")).toBeLessThan(0.05);
  });
});
