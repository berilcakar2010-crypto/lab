/**
 * AI roles of the adaptive layer. Each goes through `runAI`, so the provider
 * stays swappable (Gemini, Groq, …), output is validated before use, and a
 * deterministic fallback runs when AI is unavailable. Results carry a reason
 * and a confidence; callers record them in the decision log.
 */
import type { LabDB } from "../domain/types";
import { ERROR_CATEGORIES, type ErrorCategory, type ErrorRecord } from "../domain/adaptive";
import { getGraph } from "../knowledge/graph";
import { getLang } from "../i18n";
import { runAI, parseJSON, type AIHost, type AIResult } from "./engine";
import { ERROR_HELP, classifyError, type Classification } from "../adaptive/errors";

const langLine = () => (getLang() === "tr" ? "Write every text field in Turkish." : "Write every text field in English.");

// ---------------------------------------------------------------------------
// Error analyst
// ---------------------------------------------------------------------------

export interface ErrorAnalysis extends Classification {
  /** A prerequisite id from the given candidates, when the model thinks the gap is there. */
  prerequisite?: string;
}

export function validateErrorAnalysis(x: unknown, candidates: string[]): ErrorAnalysis {
  const o = x as Record<string, unknown>;
  const category = String(o?.category ?? "").toUpperCase() as ErrorCategory;
  if (!ERROR_CATEGORIES.includes(category)) throw new Error("unknown category");
  const confidence = Number(o.confidence);
  if (!Number.isFinite(confidence)) throw new Error("confidence");
  const reason = String(o.reason ?? "").trim();
  if (reason.length < 8) throw new Error("reason");
  const prerequisite = typeof o.prerequisite === "string" && candidates.includes(o.prerequisite) ? o.prerequisite : undefined;
  // Models are overconfident; never let one claim certainty.
  return { category, confidence: Math.max(0.1, Math.min(0.85, confidence)), reason: reason.slice(0, 400), prerequisite };
}

/** Classify an error on an open response with AI; falls back to the rules. */
export async function analyzeErrorAI(host: AIHost, err: ErrorRecord, answerText: string): Promise<AIResult<ErrorAnalysis>> {
  const db: LabDB = host.db();
  const q = db.questions[err.questionId];
  const a = db.attempts[err.attemptId];
  const g = getGraph(db.knowledge);
  const concept = err.loIds.find((id) => g.objects[id]);
  const candidates = concept ? g.objects[concept].prerequisites.map((p) => p.id).filter((id) => g.objects[id]) : [];
  const fallback = (): ErrorAnalysis => (a ? classifyError(db, a) : { category: err.category, confidence: err.confidence, reason: err.reason });
  return runAI(host, {
    role: "ERROR_ANALYST",
    system: [
      "You analyse a learner's wrong answer to find the kind of error. You never give the solution.",
      `Categories: ${ERROR_CATEGORIES.map((c) => `${c} (${ERROR_HELP(c)})`).join("; ")}.`,
      "Return JSON {\"category\":string,\"confidence\":0..1,\"reason\":string,\"prerequisite\":string|null}.",
      "Only name a prerequisite from the candidate list, and only if the answer shows that gap. Be honest about uncertainty.",
      langLine(),
    ].join("\n"),
    prompt: JSON.stringify({
      question: q?.prompt ?? "",
      keyIdeas: q?.rubric ?? [],
      learnerAnswer: answerText.slice(0, 2000),
      concept: concept ? g.objects[concept].title : null,
      prerequisiteCandidates: candidates.map((id) => ({ id, title: g.objects[id].title })),
    }),
    parse: parseJSON((x) => validateErrorAnalysis(x, candidates)),
    fallback,
    milestoneId: err.milestoneId,
    summary: `error analysis ${err.id}`,
  });
}
