import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import type { LabDB } from "../domain/types";
import type { AIHost } from "../ai/engine";
import type { AIProvider } from "../ai/providers";
import { MODELS, modelById, runData, runOde, runSweep, saveAsEvidence, saveRun, MAX_ODE_STEPS } from "./sandbox";
import { comparison, explainPrediction, isNonMonotonic, pteTask, runPte, submitPrediction } from "./pte";
import { createResearch, nextStep, researchAsExplanation, researchGuideAI, researchMarkdown, setStep } from "./research";
import { RESEARCH_STEPS } from "../domain/adaptive";
import { masteryProfile } from "./mastery";
import { getGraph } from "../knowledge/graph";

const host = (db: LabDB, provider?: AIProvider): AIHost => ({ db: () => db, record: (fn) => fn(db), provider });
const fake = (obj: unknown): AIProvider => ({ id: "gemini", model: "test", ready: () => true, complete: async () => JSON.stringify(obj) });

describe("sandbox", () => {
  it("every built-in model is valid, linked to real graph objects and computes finite results", () => {
    const g = getGraph(createEmptyDB().knowledge);
    for (const m of MODELS()) {
      for (const id of m.loIds) expect(g.objects[id], `${m.id} → ${id}`).toBeTruthy();
      const r = runPte(m, pteTask(m));
      expect(Number.isFinite(r.base) && Number.isFinite(r.changed), m.id).toBe(true);
    }
  });

  it("sweeps formulas, integrates ODEs with RK4 (incl. a spiking neuron) and analyses data", () => {
    const s = runSweep({ expression: "v^2*sin(2*a*pi/180)/g", variable: "a", from: 5, to: 85, points: 81, params: { v: 20, g: 9.81 } });
    const best = s.series[0].points.reduce((m, p) => (p[1] > m[1] ? p : m));
    expect(best[0]).toBeCloseTo(45, 0);
    // Exponential decay: dy/dt = -y → y(1) = e^-1.
    const o = runOde({ equations: { y: "-y" }, initial: { y: 1 }, params: {}, t1: 1, dt: 0.01 });
    expect(o.final.y).toBeCloseTo(Math.exp(-1), 5);
    // LIF: more current → more spikes; below threshold → none.
    const lif = modelById("lif-sim")!;
    if (lif.kind !== "ode") throw new Error();
    const spikes = (I: number) => runOde({ equations: lif.equations, initial: lif.initial, params: { ...Object.fromEntries(lif.params.map((p) => [p.name, p.value])), I }, t1: lif.t1, dt: lif.dt, reset: lif.reset }).resets;
    expect(spikes(1)).toBe(0);
    expect(spikes(3)).toBeGreaterThan(spikes(2));
    const d = runData("x,y\n1,2.1\n2,3.9\n3,6.2\n4,7.8");
    expect(d.result.regression!.slope).toBeCloseTo(1.93, 1);
    expect(d.result.regression!.r2).toBeGreaterThan(0.99);
    expect(d.result.columns[0].mean).toBe(2.5);
    // Hard limits instead of runaway computation.
    expect(runOde({ equations: { y: "1" }, initial: { y: 0 }, params: {}, t1: 1e9, dt: 1 }).series[0].points.length).toBeLessThanOrEqual(401);
    expect(MAX_ODE_STEPS).toBe(50_000);
  });

  it("turns a run into evidence only through the learner's interpretation", () => {
    const db = createEmptyDB();
    const run = saveRun(db, { ...runSweep({ expression: "2*pi*sqrt(L/g)", variable: "L", from: 0.1, to: 4, params: { g: 9.81 } }), title: "Pendulum" }, ["phys.mech.oscillations"]);
    expect(masteryProfile(db, "phys.mech.oscillations").evidenceCount).toBe(0);
    const eid = saveAsEvidence(db, run.id, "phys.mech.oscillations", "Period grows with the square root of length: 4× longer → 2× slower.")!;
    expect(db.explanations[eid].loId).toBe("phys.mech.oscillations");
    expect(db.sandboxRuns[run.id].evidence).toBeTruthy();
    expect(db.events.map((e) => e.type)).toContain("SANDBOX_RESULT");
  });
});

describe("predict → test → explain", () => {
  it("scores the prediction against the computed result and records the explanation as evidence", () => {
    const db = createEmptyDB();
    const m = modelById("pendulum")!;
    const task = pteTask(m);
    expect(task.question).toMatch(/what happens|ne olur/);
    const wrong = submitPrediction(db, m, task, { direction: "DOWN" });
    expect(wrong.correct).toBe(false);
    expect(comparison(wrong)).toMatch(/why|neden/);
    const right = submitPrediction(db, m, task, { direction: "UP" });
    expect(right.correct).toBe(true);
    explainPrediction(db, right.id, "T = 2π√(L/g): longer string, slower swing.", { mechanism: true, usesResult: true });
    const p = masteryProfile(db, "phys.mech.oscillations");
    expect(p.dims.understanding.n).toBe(2);
    expect(p.dims.explanation.n).toBe(1);
  });

  it("knows when the answer is 'first up, then down'", () => {
    const rev = modelById("revenue")!;
    expect(isNonMonotonic(rev, "P")).toBe(true);
    expect(isNonMonotonic(modelById("pendulum")!, "L")).toBe(false);
    const db = createEmptyDB();
    expect(submitPrediction(db, rev, pteTask(rev), { direction: "NONMONOTONIC" }).correct).toBe(true);
  });
});

describe("research mode", () => {
  it("walks the ten steps, links a sandbox run, and becomes evaluable evidence when done", () => {
    const db = createEmptyDB();
    const p = createResearch(db, "How does synaptic noise affect firing reliability?", ["neuro.comp.lif"]);
    expect(nextStep(p)).toBe("KNOWN");
    const run = saveRun(db, { ...runOde({ equations: { V: "(-(V+65)+10*I)/10" }, initial: { V: -65 }, params: { I: 2 }, t1: 50, dt: 0.1 }), title: "LIF" });
    for (const s of RESEARCH_STEPS) setStep(db, p.id, s, `My ${s.toLowerCase()} text`, { sandboxRunId: s === "SIMULATION" ? run.id : undefined });
    expect(db.research[p.id].status).toBe("DONE");
    expect(db.events.filter((e) => e.type === "RESEARCH_STEP_COMPLETED")).toHaveLength(10);
    expect(db.sandboxRuns[run.id].researchId).toBe(p.id);
    expect(researchMarkdown(db, db.research[p.id])).toMatch(/Sandbox: LIF/);
    const eid = researchAsExplanation(db, p.id)!;
    expect(db.explanations[eid].loId).toBe("neuro.comp.lif");
  });

  it("the research guide asks questions and never writes the step", async () => {
    const db = createEmptyDB();
    const p = createResearch(db, "q", ["neuro.comp.lif"]);
    const ai = await researchGuideAI(host(db, fake({ questions: ["Which noise source do you mean?", "Here is your model: dV/dt = ..."] })), p, "MODEL");
    expect(ai.value).toEqual(["Which noise source do you mean?"]);
    const off = await researchGuideAI(host(db), p, "PREDICTION");
    expect(off.fallbackUsed).toBe(true);
    expect(off.value[0]).toContain("?");
  });
});
