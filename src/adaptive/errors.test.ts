import { describe, expect, it } from "vitest";
import { kit, answer, T0, DAY } from "./testkit";
import { classifyError, detectPatterns, migrateLegacyErrors, openErrors, reclassifyError, repairQueue, startRepair, updateRepairs } from "./errors";
import { createEmptyDB } from "../data/db";

describe("error taxonomy", () => {
  it("classifies wrong answers from the evidence", () => {
    const k = kit(["phys.mech.newton"], { kinds: ["NUMERIC", "NUMERIC", "MULTIPLE_CHOICE"] });
    const [n1, n2, mc] = k.qs[k.ms["phys.mech.newton"]];
    const cls = (q: string, o: Parameters<typeof answer>[3]) => classifyError(k.db, answer(k, q, false, o).attempt);
    expect(cls(n1, { answer: -10 }).category).toBe("CALCULATION");
    expect(cls(n1, { answer: 100 }).reason).toMatch(/10\^1/);
    expect(cls(n2, { answer: 9.1 }).category).toBe("CALCULATION");
    expect(cls(n2, { answer: 2 }).category).toBe("FORMULA_SELECTION");
    expect(cls(mc, { answer: 1, purpose: "TRANSFER" }).category).toBe("TRANSFER");
    expect(cls(mc, { answer: 1, purpose: "RETENTION" }).category).toBe("RECALL");
    expect(cls(mc, { answer: 1, errorTypes: ["MISSING_PREREQUISITE"] }).category).toBe("PREREQUISITE");
    expect(cls(mc, { answer: 1, errorTypes: ["CARELESS"] }).category).toBe("ATTENTION");
    // Every wrong answer was stored as an error record with question, attempt, type, confidence, hint level and resolution.
    const errs = Object.values(k.db.errors);
    expect(errs).toHaveLength(8);
    for (const e of errs) {
      expect(e.questionId && e.attemptId && e.category).toBeTruthy();
      expect(e.confidence).toBeGreaterThan(0);
      expect(e.resolution).toBe("OPEN");
      expect(typeof e.hintLevel).toBe("number");
    }
    expect(k.db.events.filter((e) => e.type === "ERROR_IDENTIFIED")).toHaveLength(8);
  });
});

describe("error → knowledge graph", () => {
  it("traces a Bayesian inference error to conditional probability through the graph, with a confidence", () => {
    const k = kit(["math.stat.bayesian"], { kinds: ["MULTIPLE_CHOICE"], subject: "Statistics" });
    const q = k.qs[k.ms["math.stat.bayesian"]][0];
    answer(k, q, false, { answer: 1, errorTypes: ["CONCEPTUAL"] });
    const e = Object.values(k.db.errors)[0];
    expect(e.trace!.concept).toBe("math.stat.bayesian");
    // Prerequisite with no evidence is half-weak; the error is conceptual → points to Bayes' theorem (a required prerequisite).
    expect(["math.prob.bayes", "math.prob.distributions"]).toContain(e.trace!.prerequisite);
    expect(e.trace!.repairLoId).toBe(e.trace!.prerequisite);
    expect(e.trace!.steps.map((s) => s.kind)).toEqual(["error", "skill", "milestone", "concept", "prerequisite", "repair"]);
    expect(e.trace!.confidence).toBeLessThan(0.9);
    expect(e.trace!.reason).toMatch(/may come from|muhtemelen/);
    // A calculation slip does not invent a prerequisite gap.
    const k2 = kit(["phys.mech.newton"], { kinds: ["NUMERIC"] });
    answer(k2, k2.qs[k2.ms["phys.mech.newton"]][0], false, { answer: -10 });
    const e2 = Object.values(k2.db.errors)[0];
    expect(e2.category).toBe("CALCULATION");
    expect(e2.trace!.prerequisite).toBeUndefined();
    expect(e2.trace!.repairLoId).toBeUndefined();
  });

  it("does not blame a prerequisite that is verified strong", () => {
    const k = kit(["math.prob.bayes", "math.stat.bayesian", "math.prob.distributions"], { kinds: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "MULTIPLE_CHOICE"] });
    for (const lo of ["math.prob.bayes", "math.prob.distributions"]) for (const q of k.qs[k.ms[lo]]) { answer(k, q, true); answer(k, q, true, { at: T0 + 1 }); }
    answer(k, k.qs[k.ms["math.stat.bayesian"]][0], false, { answer: 1, errorTypes: ["CONCEPTUAL"], at: T0 + 10 });
    const e = Object.values(k.db.errors)[0];
    expect(e.trace!.prerequisite).toBeUndefined();
    expect(e.trace!.suspectedSkill).toBe("math.stat.bayesian");
  });

  it("starts and completes a repair milestone, and lets the learner correct the category", () => {
    const k = kit(["math.prob.bayes", "math.stat.bayesian"], { kinds: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "MULTIPLE_CHOICE"] });
    answer(k, k.qs[k.ms["math.stat.bayesian"]][0], false, { answer: 1, errorTypes: ["CONCEPTUAL"], at: T0 });
    const e = Object.values(k.db.errors)[0];
    expect(e.trace!.repairMilestoneId).toBe(k.ms["math.prob.bayes"]);
    expect(repairQueue(k.db)[0].loId).toBe("math.prob.bayes");
    startRepair(k.db, e.id, T0 + DAY);
    expect(k.db.errors[e.id].resolution).toBe("REPAIRING");
    for (const q of k.qs[k.ms["math.prob.bayes"]]) answer(k, q, true, { at: T0 + DAY + 100 });
    expect(k.db.errors[e.id].resolution).toBe("RESOLVED");
    expect(k.db.events.some((x) => x.type === "REPAIR_COMPLETED")).toBe(true);
    expect(openErrors(k.db)).toHaveLength(0);
    reclassifyError(k.db, e.id, "ASSUMPTION");
    expect(k.db.errors[e.id].source).toBe("self");
    expect(k.db.errors[e.id].confidence).toBe(1);
  });
});

describe("error patterns", () => {
  it("detects a cross-domain misconception: same conceptual error on one skill in two subjects", () => {
    const k = kit(["math.prob.basics"], { kinds: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "MULTIPLE_CHOICE"], subject: "Mathematics" });
    const k2 = kit(["math.prob.basics"], { kinds: ["MULTIPLE_CHOICE"], subject: "Biology", db: k.db });
    const qs = k.qs[k.ms["math.prob.basics"]];
    answer(k, qs[0], false, { answer: 1, errorTypes: ["CONCEPTUAL"], at: T0 });
    answer(k, qs[1], false, { answer: 1, errorTypes: ["CONCEPTUAL"], at: T0 + 1 });
    expect(Object.values(k.db.insights)).toHaveLength(0);
    answer(k2, k2.qs[k2.ms["math.prob.basics"]][0], false, { answer: 1, errorTypes: ["CONCEPTUAL"], at: T0 + 2 });
    const ins = Object.values(k.db.insights);
    expect(ins).toHaveLength(1);
    expect(ins[0].kind).toBe("CROSS_DOMAIN_MISCONCEPTION");
    expect(ins[0].affectedSubjects.sort()).toEqual(["Biology", "Mathematics"]);
    expect(ins[0].evidence).toHaveLength(3);
    // Running detection again updates the same insight instead of duplicating it.
    detectPatterns(k.db, T0 + 3);
    expect(Object.values(k.db.insights)).toHaveLength(1);
  });
});

describe("legacy error migration", () => {
  it("turns old wrong answers into error records once", () => {
    const k = kit(["phys.mech.newton"], { kinds: ["NUMERIC"] });
    answer(k, k.qs[k.ms["phys.mech.newton"]][0], false, { answer: -10 });
    // Simulate data from before the upgrade: no error records, no migration mark.
    k.db.errors = {};
    expect(migrateLegacyErrors(k.db, T0)).toBe(1);
    expect(Object.values(k.db.errors)[0].source).toBe("legacy");
    expect(migrateLegacyErrors(k.db, T0)).toBe(0);
    expect(Object.values(k.db.errors)).toHaveLength(1);
    expect(migrateLegacyErrors(createEmptyDB(), T0)).toBe(0);
  });

  it("closes old errors already fixed by a later correct answer", () => {
    const k = kit(["phys.mech.newton"], { kinds: ["NUMERIC"] });
    const q = k.qs[k.ms["phys.mech.newton"]][0];
    answer(k, q, false, { answer: -10, at: T0 });
    answer(k, q, true, { at: T0 + 5 });
    expect(updateRepairs(k.db, T0 + 6)).toEqual([]);
    expect(Object.values(k.db.errors)[0].resolution).toBe("RESOLVED");
  });
});

import { analyzeErrorAI } from "../ai/adaptiveAI";
import { applyAIAnalysis } from "./errors";
import type { AIHost } from "../ai/engine";
import type { AIProvider } from "../ai/providers";
import type { LabDB } from "../domain/types";

const host = (db: LabDB, provider?: AIProvider): AIHost => ({ db: () => db, record: (fn) => fn(db), provider });
const fake = (text: string): AIProvider => ({ id: "gemini", model: "test", ready: () => true, complete: async () => text });

describe("AI error analyst", () => {
  it("uses a valid AI analysis (capped confidence, prerequisite only from candidates) and logs the decision", async () => {
    const k = kit(["math.stat.bayesian"], { kinds: ["FREE_RESPONSE"] });
    answer(k, k.qs[k.ms["math.stat.bayesian"]][0], false, { answer: "text" });
    const e = Object.values(k.db.errors)[0];
    const res = await analyzeErrorAI(host(k.db, fake(JSON.stringify({ category: "ASSUMPTION", confidence: 0.99, reason: "Assumed the events were independent.", prerequisite: "math.prob.bayes" }))), e, "P(A|B)=P(A)");
    expect(res.fallbackUsed).toBe(false);
    expect(res.value.confidence).toBe(0.85);
    applyAIAnalysis(k.db, e.id, res.value, res.provider, res.fallbackUsed);
    expect(k.db.errors[e.id].category).toBe("ASSUMPTION");
    expect(k.db.errors[e.id].source).toBe("ai");
    expect(k.db.errors[e.id].trace!.prerequisite).toBe("math.prob.bayes");
    expect(Object.values(k.db.decisions).some((d) => d.role === "ERROR_ANALYST" && d.provider === "gemini")).toBe(true);
  });

  it("rejects invented categories or prerequisites and falls back to the rules", async () => {
    const k = kit(["math.stat.bayesian"], { kinds: ["FREE_RESPONSE"] });
    answer(k, k.qs[k.ms["math.stat.bayesian"]][0], false, { answer: "text" });
    const e = Object.values(k.db.errors)[0];
    const bad = await analyzeErrorAI(host(k.db, fake(JSON.stringify({ category: "LAZINESS", confidence: 0.5, reason: "Did not try hard enough." }))), e, "x");
    expect(bad.fallbackUsed).toBe(true);
    const invented = await analyzeErrorAI(host(k.db, fake(JSON.stringify({ category: "CONCEPTUAL", confidence: 0.5, reason: "Gap in measure theory basics.", prerequisite: "math.measure.made-up" }))), e, "x");
    expect(invented.value.prerequisite).toBeUndefined();
    const offline = await analyzeErrorAI(host(k.db), e, "x");
    expect(offline.fallbackUsed).toBe(true);
    expect(applyAIAnalysis(k.db, e.id, offline.value, offline.provider, true)!.source).toBe("rule");
  });
});
