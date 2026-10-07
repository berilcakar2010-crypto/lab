import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import type { LabDB, Question } from "../domain/types";
import { importCurriculum } from "../engines/curriculumSpec";
import { courseMilestones, milestoneQuestions } from "../engines/curriculum";
import { recordAttempt, grantMastery, completeRetentionCheck, dueRetentionChecks } from "../engines/progress";
import { ensureSession } from "../engines/sessions";
import { mechanicsPack } from "./packs/mechanics";
import { geminiProvider, groqProvider, type AIProvider } from "./providers";
import type { AIHost } from "./engine";
import {
  adviseCourse, diagnoseMistake, difficultySignal, evaluateOpenResponse, explainConcept, generateHints, leaksAnswer,
  reflectSession, socraticReply,
} from "./tutor";

const host = (db: LabDB, provider?: AIProvider): AIHost => ({ db: () => db, record: (fn) => fn(db), provider });
const fake = (reply: unknown): AIProvider => ({ id: "groq", model: "fake", ready: () => true, complete: async () => (typeof reply === "string" ? reply : JSON.stringify(reply)) });

const setup = () => {
  const db = createEmptyDB();
  const { courseId } = importCurriculum(db, structuredClone(mechanicsPack), { source: { kind: "SEED", text: "" }, generatedBy: "seed" });
  const ms = courseMilestones(db, courseId);
  const vec = ms.find((m) => m.title.startsWith("Resolve a vector"))!;
  const q = milestoneQuestions(db, vec.id).find((x) => x.numeric?.value === 8.66)!;
  return { db, courseId, ms, vec, q };
};

describe("Phase 6 — provider abstraction", () => {
  it("Gemini and Groq implement the same interface with their own wire formats", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const fetchStub = (body: unknown) => (async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify(body), { status: 200 });
    }) as unknown as typeof fetch;
    const g = geminiProvider("k1", "gemini-x", fetchStub({ candidates: [{ content: { parts: [{ text: '{"ok":1}' }] } }] }));
    const q = groqProvider("k2", "llama-x", fetchStub({ choices: [{ message: { content: '{"ok":2}' } }] }));
    for (const p of [g, q]) expect(p.ready()).toBe(true);
    expect(await g.complete({ system: "s", prompt: "p", json: true, images: ["data:image/jpeg;base64,AAAA"] })).toBe('{"ok":1}');
    expect(await q.complete({ system: "s", prompt: "p", json: true })).toBe('{"ok":2}');
    expect(calls[0].url).toContain("gemini-x:generateContent");
    const gBody = JSON.parse(String(calls[0].init.body));
    expect(gBody.generationConfig.responseMimeType).toBe("application/json");
    expect(gBody.contents[0].parts[1].inline_data.mime_type).toBe("image/jpeg");
    expect((calls[0].init.headers as Record<string, string>)["x-goog-api-key"]).toBe("k1");
    expect(calls[1].url).toContain("api.groq.com");
    const qBody = JSON.parse(String(calls[1].init.body));
    expect(qBody.response_format).toEqual({ type: "json_object" });
    expect((calls[1].init.headers as Record<string, string>).Authorization).toBe("Bearer k2");
    expect(geminiProvider(undefined, "m").ready()).toBe(false);
  });

  it("an HTTP error falls back gracefully and is logged", async () => {
    const { db, q } = setup();
    const failing = groqProvider("k", "m", (async () => new Response("nope", { status: 401 })) as unknown as typeof fetch);
    const res = await generateHints(host(db, failing), q);
    expect(res.fallbackUsed).toBe(true);
    expect(res.value).toHaveLength(4);
    const log = Object.values(db.aiInteractions)[0];
    expect(log.role).toBe("HINT_GENERATOR");
    expect(log.error).toContain("401");
  });
});

describe("Phase 6 — productive struggle", () => {
  it("detects answer leaks for numbers, choices and expressions", () => {
    const { q } = setup();
    expect(leaksAnswer("The x-component is 8.66 N.", q)).toBe(true);
    expect(leaksAnswer("It is about 8,7 newtons", q)).toBe(true);
    expect(leaksAnswer("Use cos of 30 degrees with the 10 N magnitude.", q)).toBe(false);
    const mcq = { ...q, numeric: undefined, choices: ["Weight and normal force from the table", "Only weight"], correctChoice: 0 } as Question;
    expect(leaksAnswer("It's weight and normal force from the table.", mcq)).toBe(true);
    expect(leaksAnswer("The answer is option 1", mcq)).toBe(true);
    const ex = { ...q, numeric: undefined, acceptedExpressions: ["6*t + 2"] } as Question;
    expect(leaksAnswer("v = 6*t+2", ex)).toBe(true);
  });

  it("rejects AI hints/guidance that leak the answer and uses the safe fallback", async () => {
    const { db, q } = setup();
    const hints = await generateHints(host(db, fake({ hints: ["a", "b", "c", "The answer is 8.66"] })), q);
    expect(hints.fallbackUsed).toBe(true);
    expect(hints.value.join(" ")).not.toContain("8.66");
    const reply = await socraticReply(host(db, fake({ reply: "It's 8.66 N, easy." })), q, [], "5");
    expect(reply.fallbackUsed).toBe(true);
    expect(leaksAnswer(reply.value, q)).toBe(false);
    const good = await socraticReply(host(db, fake({ reply: "Which side of the triangle is adjacent to the angle?" })), q, [], "5");
    expect(good.fallbackUsed).toBe(false);
  });

  it("all tutoring roles have offline fallbacks", async () => {
    const { db, q, courseId } = setup();
    const h = host(db);
    expect((await explainConcept(h, db, q)).value.length).toBeGreaterThan(10);
    expect((await diagnoseMistake(h, q, "5", { correctness: "INCORRECT", reasoningQuality: "UNKNOWN", errorTypes: [], message: "Not yet." })).value).toContain("Not yet");
    expect((await evaluateOpenResponse(h, db, { ...q, rubric: ["a"] }, "x", undefined)).value).toBeNull();
    expect(adviseCourse(db, courseId)).toEqual([]);
  });

  it("the evaluator separates correctness, reasoning quality and error types", async () => {
    const { db, ms } = setup();
    const fbd = ms.find((m) => m.title.startsWith("Construct a free-body"))!;
    const open = milestoneQuestions(db, fbd.id).find((x) => x.rubric.length === 4)!;
    const res = await evaluateOpenResponse(host(db, fake({ met: [true, true, false, true], reasoningQuality: "ADEQUATE", errorTypes: ["CONCEPTUAL", "BOGUS"], successfulStrategy: "Isolated the body first", message: "Friction direction is missing.", missingPrerequisite: null })), db, open, "weight, normal", undefined);
    expect(res.value!.met).toEqual([true, true, false, true]);
    expect(res.value!.feedback.errorTypes).toEqual(["CONCEPTUAL"]);
    expect(res.value!.feedback.reasoningQuality).toBe("ADEQUATE");
    expect(res.value!.feedback.successfulStrategy).toBe("Isolated the body first");
  });
});

describe("Phase 6 — advisor, calibrator, reflection", () => {
  it("advises reviewing a faded prerequisite and reports readiness cautiously", () => {
    const { db, courseId, ms, vec } = setup();
    const s = ensureSession(db, courseId);
    grantMastery(db, vec.id, [], false, false, s.id);
    const check = dueRetentionChecks(db)[0];
    const q = db.questions[check.questionId];
    const { attempt } = recordAttempt(db, { questionId: q.id, milestoneId: vec.id, sessionId: s.id, answer: null, correct: false, score: 0, feedback: { correctness: "INCORRECT", reasoningQuality: "UNKNOWN", errorTypes: [], message: "" }, hintLevelUsed: 0, evaluatedBy: "auto", inputMethod: "keyboard", usedStylus: false, durationMs: 1, purpose: "RETENTION" });
    completeRetentionCheck(db, check.id, attempt);
    const add = ms.find((m) => m.title.startsWith("Add vectors"))!;
    expect(db.milestones[add.id].status).toBe("AVAILABLE");
    const advice = adviseCourse(db, courseId);
    expect(advice.some((a) => a.tone === "review" && a.milestoneId === vec.id && /may want to review/.test(a.text))).toBe(true);
  });

  it("difficulty calibration needs data and then suggests a direction", () => {
    const { db, courseId, vec } = setup();
    expect(difficultySignal(db, vec.id).suggested).toBeNull();
    const s = ensureSession(db, courseId);
    for (const q of milestoneQuestions(db, vec.id)) {
      for (let i = 0; i < 2; i++) recordAttempt(db, { questionId: q.id, milestoneId: vec.id, sessionId: s.id, answer: null, correct: false, score: 0, feedback: { correctness: "INCORRECT", reasoningQuality: "UNKNOWN", errorTypes: [], message: "" }, hintLevelUsed: 3, evaluatedBy: "auto", inputMethod: "keyboard", usedStylus: false, durationMs: 1, purpose: "PRACTICE" });
    }
    const sig = difficultySignal(db, vec.id);
    expect(sig.suggested).toBe(vec.difficulty + 1);
    expect(reflectSession(db, s.id).join(" ")).toMatch(/retried/);
  });
});
