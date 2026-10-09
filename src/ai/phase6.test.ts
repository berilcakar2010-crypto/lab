import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import { setLang } from "../i18n";
import type { LabDB, Question } from "../domain/types";
import { importCurriculum } from "../engines/curriculumSpec";
import { courseMilestones, milestoneQuestions } from "../engines/curriculum";
import { recordAttempt, grantMastery, completeRetentionCheck, dueRetentionChecks } from "../engines/progress";
import { ensureSession } from "../engines/sessions";
import { evaluateCredit, evaluateSelf } from "../engines/evaluation";
import { mechanicsPack } from "./packs/mechanics";
import { geminiProvider, groqProvider, type AIProvider } from "./providers";
import type { AIHost } from "./engine";
import {
  adviseCourse, diagnoseMistake, difficultySignal, evaluateOpenResponse, parseOpenEvaluation, explainConcept, generateHints, leaksAnswer,
  reflectSession, socraticReply,
} from "./tutor";

const host = (db: LabDB, provider?: AIProvider): AIHost => ({ db: () => db, record: (fn) => fn(db), provider });
const fake = (reply: unknown): AIProvider => ({ id: "groq", model: "fake", ready: () => true, complete: async () => (typeof reply === "string" ? reply : JSON.stringify(reply)) });

const setup = () => {
  const db = createEmptyDB();
  const { courseId } = importCurriculum(db, structuredClone(mechanicsPack), { source: { kind: "SEED", text: "" }, generatedBy: "seed" });
  const ms = courseMilestones(db, courseId);
  const vec = ms.find((m) => m.sourceKey === "mech:vec1")!;
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
    const fbd = ms.find((m) => m.sourceKey === "mech:n1")!;
    const open = milestoneQuestions(db, fbd.id).find((x) => x.rubric.length === 4)!;
    const res = await evaluateOpenResponse(host(db, fake({ met: [true, true, false, true], reasoningQuality: "ADEQUATE", errorTypes: ["CONCEPTUAL", "BOGUS"], successfulStrategy: "Isolated the body first", message: "Friction direction is missing.", missingPrerequisite: null })), db, open, "weight, normal", undefined);
    expect(res.value!.met).toEqual([true, true, false, true]);
    expect(res.value!.feedback.errorTypes).toEqual(["CONCEPTUAL"]);
    expect(res.value!.feedback.reasoningQuality).toBe("ADEQUATE");
    expect(res.value!.feedback.successfulStrategy).toBe("Isolated the body first");
  });

  it("measures understanding, not conformity: partial credit, points that don't apply, holistic judgement", async () => {
    const { db, ms } = setup();
    const fbd = ms.find((m) => m.sourceKey === "mech:n1")!;
    const open = milestoneQuestions(db, fbd.id).find((x) => x.rubric.length === 4)!;
    const res = await evaluateOpenResponse(host(db, fake({ credit: ["FULL", "PARTIAL", "NA", "FULL"], evidence: ["", "", "", ""], understanding: 0.85, misconception: false, reasoningQuality: "STRONG", errorTypes: [], successfulStrategy: null, message: "Doğru fikir, başka bir yoldan.", missingPrerequisite: null })), db, open, "my own route", undefined);
    const v = res.value!;
    expect(v.credit).toEqual([1, 0.5, null, 1]);
    expect(v.met).toEqual([true, true, false, true]);
    // The point that does not apply is left out; the holistic judgement counts half.
    const ev = evaluateCredit(open, v.credit, 0.7, v);
    expect(ev.score).toBeCloseTo(0.5 * (2.5 / 3) + 0.5 * 0.85, 2);
    expect(ev.correct).toBe(true);
    expect(ev.feedback.message).toMatch(/Kısmen|Partly/);
    // The same ticks under the old all-or-nothing rule would have failed: 2 of 4.
    expect(evaluateSelf(open, [true, false, false, true], 0.7).correct).toBe(false);
  });

  it("a genuine misconception keeps an answer below a pass, however many points it ticks", () => {
    const q = { rubric: ["a", "b", "c"] };
    expect(evaluateCredit(q, [1, 1, 1], 0.7, { understanding: 0.9, misconception: true }).correct).toBe(false);
    expect(evaluateCredit(q, [1, 1, 1], 0.7, { understanding: 0.9, misconception: true }).feedback.errorTypes).toContain("CONCEPTUAL");
    // Without an evaluator's judgement nothing changes for ticked rubrics.
    expect(evaluateCredit(q, [1, 1, 0], 0.6).score).toBeCloseTo(0.67, 2);
  });

  it("rejects malformed evaluator output and accepts the older shape", () => {
    const q = { rubric: ["a", "b"] };
    expect(() => parseOpenEvaluation({ credit: ["FULL"] }, q)).toThrow();
    expect(() => parseOpenEvaluation({ credit: ["FULL", "MAYBE"] }, q)).toThrow();
    expect(parseOpenEvaluation({ met: [true, false], message: "x" }, q).credit).toEqual([1, 0]);
    expect(parseOpenEvaluation({ credit: ["full", "na"], understanding: 80 }, q)).toMatchObject({ credit: [1, null], understanding: 0.8, misconception: false });
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
    const add = ms.find((m) => m.sourceKey === "mech:vec2")!;
    expect(db.milestones[add.id].status).toBe("AVAILABLE");
    const advice = adviseCourse(db, courseId);
    expect(advice.some((a) => a.tone === "review" && a.milestoneId === vec.id && /may want to review/.test(a.text))).toBe(true);
    setLang("tr");
    try {
      expect(adviseCourse(db, courseId).some((a) => a.tone === "review" && /tekrar etmek isteyebilirsin/.test(a.text))).toBe(true);
    } finally {
      setLang("en");
    }
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
    setLang("tr");
    try {
      expect(reflectSession(db, s.id).join(" ")).toMatch(/yeniden denedin/);
    } finally {
      setLang("en");
    }
  });
});
