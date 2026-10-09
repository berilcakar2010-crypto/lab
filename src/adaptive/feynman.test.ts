import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import type { LabDB } from "../domain/types";
import type { AIHost } from "../ai/engine";
import type { AIProvider } from "../ai/providers";
import { evaluateExplanation, linkMisconceptions, offlineFollowUps } from "../ai/studyAI";
import { addExplanation, answerFollowUp, explanationThread, setEvaluation } from "../study/actions";
import { getGraph } from "../knowledge/graph";
import { masteryProfile } from "./mastery";

const host = (db: LabDB, provider?: AIProvider): AIHost => ({ db: () => db, record: (fn) => fn(db), provider });
const fake = (obj: unknown): AIProvider => ({ id: "gemini", model: "test", ready: () => true, complete: async () => JSON.stringify(obj) });
const HH = "neuro.comp.hh-model";

describe("Feynman / explain mode", () => {
  it("asks follow-up questions instead of giving the answer, and links misconceptions to the graph", async () => {
    const db = createEmptyDB();
    const g = getGraph(db.knowledge);
    const o = g.objects[HH];
    const res = await evaluateExplanation(host(db, fake({
      score: 0.55, criteria: [], strengths: ["Mentions sodium channels"], gaps: ["No role for potassium"],
      misconceptions: ["The membrane potential is caused by the action potential itself"],
      followUps: ["What would happen to the spike if potassium channels opened faster?", "Here is the full answer: ..."],
      feedback: "Good start.",
    })), o, g, { text: "Sodium rushes in and the neuron fires." });
    expect(res.value.followUps).toEqual(["What would happen to the spike if potassium channels opened faster?"]);
    expect(res.value.misconceptionLinks![0].loId).toBeTruthy();
    expect(g.objects[res.value.misconceptionLinks![0].loId!]).toBeTruthy();
  });

  it("offline: follow-ups come from the graph's own questions and misconceptions", () => {
    const g = getGraph(createEmptyDB().knowledge);
    const o = g.objects[HH];
    const f = offlineFollowUps(o, "");
    expect(f.length).toBeGreaterThan(0);
    for (const q of f) expect(q).toContain("?");
    expect(linkMisconceptions(g, o, [o.commonMisconceptions[0] ?? "x"])[0].loId).toBe(o.commonMisconceptions[0] ? HH : undefined);
  });

  it("keeps a dialogue thread and counts evaluated explanations as explanation evidence", () => {
    const db = createEmptyDB();
    const root = addExplanation(db, { loId: HH, prompt: "Why does HH produce a spike?", mode: "TEXT", text: "Because..." });
    setEvaluation(db, root.id, { score: 0.8, criteria: [], strengths: [], gaps: [], misconceptions: [], feedback: "", provider: "gemini", by: "ai", at: Date.now() });
    const child = answerFollowUp(db, root.id, "What if K+ opened faster?", "The spike would be shorter because repolarisation starts earlier.")!;
    expect(child.followUpOf).toBe(root.id);
    expect(explanationThread(db, root.id).map((e) => e.id)).toEqual([root.id, child.id]);
    expect(masteryProfile(db, HH).dims.explanation.n).toBe(1);
  });
});
