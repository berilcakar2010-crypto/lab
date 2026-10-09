import { describe, expect, it } from "vitest";
import { kit, T0 } from "../adaptive/testkit";
import { getBaseGraph } from "../knowledge/graph";
import { decomposeAI, varyQuestionAI } from "./generativeAI";
import { semanticSearch, clearSemanticIndex } from "./semantic";
import { decompose } from "../adaptive/decompose";
import type { AIHost } from "./engine";
import type { AIProvider } from "./providers";
import type { LabDB } from "../domain/types";

const g = getBaseGraph();
const NEWTON = "phys.mech.newton";
const host = (db: LabDB, reply: string, embed?: AIProvider["embed"]): AIHost => ({
  db: () => db, record: (fn) => fn(db),
  provider: { id: "gemini", model: "m", ready: () => true, complete: async () => reply, capabilities: { generate: true, evaluate: true, structuredOutput: true, vision: false, embed: !!embed }, embed },
});

describe("AI decomposition", () => {
  it("keeps only steps that pass granularity and question quality, then creates them", async () => {
    const k = kit([NEWTON]);
    const reply = JSON.stringify({ steps: [
      { title: "Draw the forces", objective: "Draw a free-body diagram for a block on a table", question: { kind: "FREE_RESPONSE", prompt: "Draw and label every force on a block resting on a table.", rubric: ["weight", "normal force"], hints: [], solution: "W down, N up", difficulty: 1 } },
      { title: "Net force", objective: "Calculate the net force from two opposite forces", question: { kind: "NUMERIC", prompt: "A 10 N force pushes right and a 4 N force pushes left. What is the net force in newtons?", numeric: { value: 6, tolerance: 0.01 }, rubric: [], hints: [], solution: "6 N", difficulty: 1 } },
      { title: "Bad", objective: "Understand", question: { kind: "NUMERIC", prompt: "?", rubric: [], hints: [], solution: "" } },
    ] });
    const r = await decomposeAI(host(k.db, reply), g, k.ms[NEWTON]);
    expect(r.fallbackUsed).toBe(false);
    expect(r.value).toHaveLength(2);
    expect(r.rejected.length).toBeGreaterThan(0);
    const ids = decompose(k.db, g, k.ms[NEWTON], { plan: r.value, source: "ai", now: T0 });
    expect(ids).toHaveLength(2);
    expect(Object.values(k.db.questions).some((q) => q.milestoneId === ids[1] && q.numeric?.value === 6)).toBe(true);
  });

  it("falls back to the local plan when the AI gives nothing usable", async () => {
    const k = kit([NEWTON]);
    const r = await decomposeAI(host(k.db, '{"steps":[]}'), g, k.ms[NEWTON]);
    expect(r.fallbackUsed).toBe(true);
  });
});

describe("AI question variation", () => {
  it("accepts a gradable variant of the same skill and rejects one that loses its answer key", async () => {
    const k = kit([NEWTON], { kinds: ["NUMERIC"] });
    const q = k.qs[k.ms[NEWTON]][0];
    const good = JSON.stringify({ kind: "NUMERIC", prompt: "A 3 kg cart accelerates at 4 m/s². What net force acts on it, in newtons?", numeric: { value: 12, tolerance: 0.02 }, rubric: [], hints: [], solution: "F = ma = 12 N", difficulty: 2 });
    const v = await varyQuestionAI(host(k.db, good), q, "numbers");
    expect(v?.variantOf).toBe(q);
    expect(v?.numeric?.value).toBe(12);
    const bad = JSON.stringify({ kind: "FREE_RESPONSE", prompt: "Explain Newton's second law in words, please.", rubric: ["F = ma"], hints: [], solution: "", difficulty: 2 });
    expect(await varyQuestionAI(host(k.db, bad), q)).toBeNull();
  });
});

describe("semantic search", () => {
  it("ranks objects by embedding similarity and caches the object index", async () => {
    clearSemanticIndex();
    const k = kit([NEWTON]);
    let calls = 0;
    const vec = (t: string) => { const s = t.toLowerCase(); return [s.includes("newton") || s.includes("force") || s.includes("kuvvet") ? 1 : 0, s.includes("neuron") || s.includes("nöron") ? 1 : 0, 0.01]; };
    const embed = async (texts: string[]) => { calls++; return texts.map(vec); };
    const hits = await semanticSearch(host(k.db, "{}", embed), g, "push with a force", 5);
    expect(hits.length).toBe(5);
    expect(vec(g.objects[hits[0].id].title + g.objects[hits[0].id].description)[0] + vec(g.objects[hits[0].id].learningObjectives.join(" "))[0]).toBeGreaterThan(0);
    await semanticSearch(host(k.db, "{}", embed), g, "neurons", 3);
    expect(calls).toBe(3); // index once + two queries
    expect(Object.values(k.db.aiInteractions).some((a) => a.role === "SEMANTIC_SEARCH")).toBe(true);
    await expect(semanticSearch(host(k.db, "{}"), g, "x")).rejects.toThrow("no-embeddings");
  });
});
