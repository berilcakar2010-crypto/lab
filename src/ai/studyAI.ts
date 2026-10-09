/**
 * AI roles for the study tools: questions about a graph object, judging an
 * explanation (typed, spoken or filmed) and proposing flashcards. Every role
 * has an offline fallback, and nothing is written to the database here except
 * the AIInteraction record that runAI keeps.
 */
import type { ChatMessage, ExplanationEvaluation } from "../domain/types";
import { L, getLang, lower } from "../i18n";
import { matchRequest } from "../knowledge/search";
import type { KnowledgeGraph, LearningObject } from "../knowledge/schema";
import { autoCards, type CardDraft } from "../study/flashcards";
import { parseJSON, runAI, type AIHost, type AIResult } from "./engine";

const langLine = () => L("Write everything for the learner in English.", "Öğrenciye yönelik her şeyi Türkçe yaz.");

/** A compact, factual description of the object for prompts. */
export function objectContext(o: LearningObject, g: KnowledgeGraph): string {
  const t = (id: string) => g.objects[id]?.title ?? id;
  return [
    `Topic: ${o.title} (${o.field} › ${o.unit}; difficulty ${o.difficulty}/5)`,
    `Description: ${o.description}`,
    `Why it matters: ${o.whyItMatters}`,
    `Learning objectives: ${o.learningObjectives.join(" | ")}`,
    `Mastery evidence: ${o.masteryCriteria.join(" | ")}`,
    o.commonMisconceptions.length ? `Common misconceptions: ${o.commonMisconceptions.join(" | ")}` : "",
    o.prerequisites.length ? `Prerequisites: ${o.prerequisites.map((p) => `${t(p.id)} (${p.strength})`).join(", ")}` : "",
    o.unlocks.length ? `Leads to: ${o.unlocks.map(t).join(", ")}` : "",
    o.interdisciplinaryLinks.length ? `Links: ${o.interdisciplinaryLinks.map((l) => `${t(l.id)} — ${l.relation}`).join(" | ")}` : "",
    o.requiresSources ? "This topic contains historical or institutional facts: say clearly when something should be checked against a primary source." : "",
  ].filter(Boolean).join("\n");
}

// ---------------------------------------------------------------------------
// Ask AI about an object
// ---------------------------------------------------------------------------

const tokens = (s: string) => lower(s).replace(/[^\p{L}\p{N}\s]+/gu, " ").split(/\s+/).filter((w) => w.length > 3);

/** Offline answer: the most relevant sentences of the object and its neighbours, quoted honestly as such. */
export function offlineAnswer(o: LearningObject, g: KnowledgeGraph, question: string): string {
  const q = new Set(tokens(question));
  const pool: { text: string; from: string }[] = [];
  const add = (from: string, texts: string[]) => texts.forEach((text) => pool.push({ text, from }));
  add(o.title, [o.description, o.whyItMatters, ...o.learningObjectives, ...o.commonMisconceptions, ...o.interdisciplinaryLinks.map((l) => `${g.objects[l.id]?.title ?? l.id}: ${l.relation}`)]);
  for (const p of o.prerequisites) {
    const po = g.objects[p.id];
    if (po) add(po.title, [po.description]);
  }
  for (const u of o.unlocks) {
    const uo = g.objects[u];
    if (uo) add(uo.title, [uo.description]);
  }
  const scored = pool
    .map((p) => ({ ...p, s: tokens(p.text).filter((w) => q.has(w) || [...q].some((x) => x.length > 4 && w.startsWith(x.slice(0, 5)))).length }))
    .filter((p) => p.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);
  const body = (scored.length ? scored : [{ text: o.description, from: o.title }, { text: o.whyItMatters, from: o.title }])
    .map((p) => `• ${p.text}${p.from !== o.title ? ` (${p.from})` : ""}`)
    .join("\n");
  return `${L("Offline answer from the knowledge graph (connect Gemini or Groq in Settings for a full explanation):", "Bilgi grafiğinden çevrimdışı yanıt (tam açıklama için Ayarlar'dan Gemini ya da Groq bağla):")}\n${body}\n\n${L("Try next", "Sonra dene")}: ${o.entryQuestions[0] ?? o.learningObjectives[0] ?? ""}`;
}

export async function askAboutObject(
  host: AIHost,
  o: LearningObject,
  g: KnowledgeGraph,
  question: string,
  history: ChatMessage[] = [],
): Promise<AIResult<string>> {
  const past = history.slice(-8).map((m) => `${m.role === "user" ? "Learner" : "You"}: ${m.text}`).join("\n");
  return runAI(host, {
    role: "QA_ASSISTANT",
    json: false,
    temperature: 0.5,
    maxTokens: 1400,
    summary: `${o.id}: ${question.slice(0, 120)}`,
    system: [
      "You are a patient, rigorous tutor inside a study app for an ambitious high-school student (olympiad / AP / research level, not university).",
      "Answer the learner's question about the topic below. Explain the logic step by step, use a concrete example, and connect to prerequisites or linked fields when it helps.",
      "Prefer intuition first, then the precise statement. Use plain text with simple formulas (no LaTeX blocks). Keep it under 300 words unless asked for more.",
      "If the question is outside the topic, answer briefly and say how it connects. If you are not sure about a fact (dates, names, current rules), say so and suggest checking a primary source.",
      "End with one short question that makes the learner think further.",
      langLine(),
    ].join("\n"),
    prompt: `${objectContext(o, g)}\n\n${past ? `Conversation so far:\n${past}\n\n` : ""}Learner's question: ${question}`,
    parse: (text) => {
      const t = text.trim();
      if (!t) throw new Error("empty");
      return t;
    },
    fallback: () => offlineAnswer(o, g, question),
  });
}

// ---------------------------------------------------------------------------
// Evaluate an explanation (Feynman technique)
// ---------------------------------------------------------------------------

interface RawEval {
  score?: number;
  criteria?: { criterion: string; met: boolean; comment?: string }[];
  strengths?: string[];
  gaps?: string[];
  misconceptions?: string[];
  followUps?: string[];
  feedback?: string;
  transcript?: string;
}

const strs = (x: unknown): string[] => (Array.isArray(x) ? x.map((v) => String(v ?? "").trim()).filter(Boolean) : []);

export function validateEval(raw: unknown, o: LearningObject): RawEval {
  const r = (raw ?? {}) as RawEval;
  const score = Number(r.score);
  if (!Number.isFinite(score)) throw new Error("score missing");
  const criteria: { criterion?: string; met?: boolean; comment?: string }[] = Array.isArray(r.criteria) ? r.criteria : [];
  return {
    score: Math.max(0, Math.min(1, score > 1 ? score / 100 : score)),
    criteria: (criteria.length ? criteria : o.masteryCriteria.map((c): { criterion?: string; met?: boolean; comment?: string } => ({ criterion: c, met: false }))).map((c) => ({
      criterion: String(c.criterion ?? "").trim() || "?",
      met: !!c.met,
      comment: c.comment ? String(c.comment) : undefined,
    })),
    strengths: strs(r.strengths),
    gaps: strs(r.gaps),
    misconceptions: strs(r.misconceptions),
    // Follow-ups must be questions; they make the learner think, they never carry the answer.
    followUps: strs(r.followUps).filter((q) => q.includes("?")).slice(0, 3),
    feedback: String(r.feedback ?? "").trim(),
    transcript: r.transcript ? String(r.transcript) : undefined,
  };
}

/** Questions that push further where the explanation is thin — from the graph, never the answer. */
export function offlineFollowUps(o: LearningObject, text: string): string[] {
  const have = new Set(tokens(text));
  const covered = (q: string) => {
    const t = tokens(q).filter((w) => w.length > 4);
    return t.length > 0 && t.filter((w) => [...have].some((h) => h.startsWith(w.slice(0, 5)))).length / t.length >= 0.5;
  };
  const out = [...o.coreQuestions, ...o.entryQuestions].filter((q) => q.includes("?") && !covered(q)).slice(0, 2);
  if (o.commonMisconceptions[0]) out.push(L(`A common misconception: "${o.commonMisconceptions[0]}". How would you show it is wrong?`, `Yaygın bir yanılgı: "${o.commonMisconceptions[0]}". Bunun neden yanlış olduğunu nasıl gösterirsin?`));
  return out.slice(0, 3);
}

/** Link misconceptions to graph objects: the object's own known misconceptions first, then a graph search. */
export function linkMisconceptions(g: KnowledgeGraph, o: LearningObject, misconceptions: string[]): { text: string; loId?: string }[] {
  const near = new Set([o.id, ...o.prerequisites.map((p) => p.id), ...o.relatedConcepts]);
  return misconceptions.map((text) => {
    const own = o.commonMisconceptions.some((m) => similarityOf(m, text) >= 0.3);
    if (own) return { text, loId: o.id };
    const hit = matchRequest(g, text, 5).objects.find((id) => near.has(id)) ?? matchRequest(g, text, 1).objects[0];
    return { text, loId: hit };
  });
}

function similarityOf(a: string, b: string): number {
  const x = new Set(tokens(a).filter((w) => w.length > 3)), y = new Set(tokens(b).filter((w) => w.length > 3));
  if (!x.size || !y.size) return 0;
  let i = 0;
  for (const w of x) if ([...y].some((v) => v.slice(0, 5) === w.slice(0, 5))) i++;
  return i / Math.min(x.size, y.size);
}

/** Offline estimate: how many of the object's key terms the explanation uses. Clearly labelled as an estimate. */
export function offlineEvaluation(o: LearningObject, text: string): RawEval {
  const have = new Set(tokens(text));
  const keyTerms = [...new Set(tokens(`${o.title} ${o.description} ${o.learningObjectives.join(" ")}`))].filter((w) => w.length > 4).slice(0, 25);
  const hit = keyTerms.filter((k) => [...have].some((w) => w.startsWith(k.slice(0, 5))));
  const coverage = keyTerms.length ? hit.length / keyTerms.length : 0;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return {
    score: text.trim() ? Math.min(0.8, coverage * (words >= 60 ? 1 : words / 60)) : 0,
    criteria: o.masteryCriteria.map((c) => ({ criterion: c, met: false, comment: L("Tick it yourself if you showed this.", "Bunu gösterdiysen kendin işaretle.") })),
    strengths: hit.length ? [L(`Uses key ideas: ${hit.slice(0, 6).join(", ")}`, `Ana kavramları kullanıyor: ${hit.slice(0, 6).join(", ")}`)] : [],
    gaps: keyTerms.filter((k) => !hit.includes(k)).slice(0, 6).map((k) => L(`Not mentioned: ${k}`, `Değinilmemiş: ${k}`)),
    misconceptions: [],
    followUps: offlineFollowUps(o, text),
    feedback: text.trim()
      ? L("Offline estimate based on key-term coverage only — it cannot judge whether your reasoning is correct. Tick the criteria you actually showed, or connect Gemini/Groq for a real evaluation.", "Yalnızca ana kavramların kapsanmasına dayalı çevrimdışı tahmin; akıl yürütmenin doğru olup olmadığını yargılayamaz. Gerçekten gösterdiğin ölçütleri işaretle ya da gerçek bir değerlendirme için Gemini/Groq bağla.")
      : L("No text or transcript to evaluate. Play your recording, tick the criteria you showed, or connect Gemini (which can listen to audio and video).", "Değerlendirilecek metin ya da döküm yok. Kaydını dinle, gösterdiğin ölçütleri işaretle ya da sesi ve videoyu dinleyebilen Gemini'yi bağla."),
  };
}

export interface ExplainInput {
  text?: string;
  transcript?: string;
  /** data: URL of an audio/video recording (sent to Gemini, which accepts audio and video). */
  mediaDataUrl?: string;
  mime?: string;
}

export async function evaluateExplanation(host: AIHost, o: LearningObject, g: KnowledgeGraph, input: ExplainInput): Promise<AIResult<ExplanationEvaluation & { transcript?: string }>> {
  const body = (input.text ?? input.transcript ?? "").trim();
  const withMedia = !!input.mediaDataUrl && !body;
  const res = await runAI(host, {
    role: "EXPLANATION_EVALUATOR",
    temperature: 0.2,
    maxTokens: 2000,
    timeoutMs: withMedia ? 120_000 : 60_000,
    summary: `${o.id}: ${input.mime ?? "text"} ${body.length} chars`,
    images: withMedia ? [input.mediaDataUrl!] : undefined,
    system: [
      "You evaluate a student's own explanation of a topic (the Feynman technique): can they explain the logic clearly and correctly, in their own words?",
      "Judge against the mastery criteria given. Be specific and fair: reward correct reasoning even if informal; flag every factual or logical error; do not invent errors.",
      "If an audio or video recording is attached, listen/watch it, transcribe what the student says into `transcript`, and evaluate that. Ignore filler words and accent.",
      'Reply with ONLY JSON: {"score": 0..1, "criteria": [{"criterion": string, "met": boolean, "comment": string}], "strengths": [string], "gaps": [string], "misconceptions": [string], "followUps": [string], "feedback": string, "transcript"?: string}.',
      "`followUps`: 1–3 questions that make the student think further about the biggest gaps. Never give the answer, never write the explanation for them.",
      "`feedback`: 2–4 sentences, encouraging and concrete: the single most important thing to fix next.",
      langLine(),
    ].join("\n"),
    prompt: `${objectContext(o, g)}\n\nMastery criteria to judge against:\n${o.masteryCriteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\n${body ? `Student's explanation:\n"""${body.slice(0, 12000)}"""` : `The student's explanation is in the attached ${input.mime?.startsWith("video") ? "video" : "audio"} recording.`}`,
    parse: parseJSON((x) => validateEval(x, o)),
    fallback: () => offlineEvaluation(o, body),
  });
  const v = res.value;
  return {
    ...res,
    value: {
      score: v.score ?? 0,
      criteria: v.criteria ?? [],
      strengths: v.strengths ?? [],
      gaps: v.gaps ?? [],
      misconceptions: v.misconceptions ?? [],
      followUps: v.followUps?.length ? v.followUps : offlineFollowUps(o, body),
      misconceptionLinks: linkMisconceptions(g, o, v.misconceptions ?? []),
      feedback: v.feedback ?? "",
      provider: res.provider,
      by: res.fallbackUsed ? "self" : "ai",
      at: Date.now(),
      transcript: v.transcript,
    },
  };
}

/** Groq Whisper transcription for a recording (audio or video with sound). */
export async function transcribeWithGroq(apiKey: string, blob: Blob, fetchImpl: typeof fetch = fetch): Promise<string> {
  const form = new FormData();
  const ext = blob.type.includes("mp4") ? "mp4" : blob.type.includes("ogg") ? "ogg" : "webm";
  form.append("file", blob, `explanation.${ext}`);
  form.append("model", "whisper-large-v3-turbo");
  form.append("language", getLang());
  form.append("response_format", "json");
  const res = await fetchImpl("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  return String(data?.text ?? "").trim();
}

// ---------------------------------------------------------------------------
// Flashcards from AI
// ---------------------------------------------------------------------------

export async function generateCardsAI(host: AIHost, o: LearningObject, g: KnowledgeGraph, count = 10): Promise<AIResult<CardDraft[]>> {
  return runAI(host, {
    role: "FLASHCARD_GENERATOR",
    temperature: 0.4,
    maxTokens: 2500,
    summary: `${o.id}: ${count} cards`,
    system: [
      "You write excellent flashcards for long-term retention (minimum information principle, one idea per card).",
      "Mix card types: why/how questions, worked mini-problems with numbers, compare-and-contrast, cause→effect, cloze deletions written as {{answer}} inside the front text.",
      "Avoid trivia and yes/no questions. Backs are short (≤ 40 words) but complete. Use plain text and simple formulas.",
      'Reply with ONLY JSON: {"cards": [{"front": string, "back": string}]}.',
      langLine(),
    ].join("\n"),
    prompt: `${objectContext(o, g)}\n\nWrite ${count} flashcards for this topic.`,
    parse: parseJSON((x) => {
      const cards = (x as { cards?: { front?: unknown; back?: unknown }[] })?.cards;
      if (!Array.isArray(cards) || !cards.length) throw new Error("no cards");
      return cards.map((c) => ({ front: String(c.front ?? "").trim(), back: String(c.back ?? "").trim() })).filter((c) => c.front && c.back).slice(0, 30);
    }),
    fallback: () => autoCards(o, g),
  });
}
