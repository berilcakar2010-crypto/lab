/**
 * AI roles for two jobs Lab also does locally:
 *
 *  - Milestone decomposition: the AI proposes up to three smaller steps for a
 *    milestone the learner is stuck on. Every step's objective goes through the
 *    granularity validator and every question through the question-quality
 *    check; anything that fails is dropped, and if nothing survives Lab uses
 *    its own local plan.
 *  - Question variation: same skill, other numbers / context / representation,
 *    with an answer key Lab can grade. Accepted only if it passes the same
 *    quality check and keeps an auto-gradable answer when the original had one.
 *
 * Only the milestone/question text is sent; never the learner's history.
 */
import type { ID, LabDB, Question } from "../domain/types";
import type { KnowledgeGraph } from "../knowledge/schema";
import { sanitizeQuestion, type QuestionSpec } from "../engines/curriculumSpec";
import { isAutoGradable } from "../engines/evaluation";
import { addQuestion } from "../engines/curriculum";
import { L } from "../i18n";
import { isValid, validateGranularity } from "../adaptive/granularity";
import { questionQuality } from "../adaptive/questionBank";
import { planDecomposition, type StepPlan } from "../adaptive/decompose";
import { parseJSON, runAI, type AIHost, type AIResult } from "./engine";

const QUESTION_SCHEMA = `{"kind":"MULTIPLE_CHOICE|NUMERIC|FREE_RESPONSE","prompt":string,"choices"?:string[],"correctChoice"?:number,"numeric"?:{"value":number,"tolerance":number,"unit"?:string},"rubric":string[],"hints":string[],"solution":string,"difficulty":1-5}`;

const describe = (q: Question) => JSON.stringify({ kind: q.kind, prompt: q.prompt, choices: q.choices, correctChoice: q.correctChoice, numeric: q.numeric, rubric: q.rubric, solution: q.solution, difficulty: q.difficulty });

/** Validate an AI step list against the milestone; returns only steps that pass. */
export function acceptSteps(db: LabDB, milestoneId: ID, raw: unknown): { steps: StepPlan[]; rejected: string[] } {
  const m = db.milestones[milestoneId];
  const rejected: string[] = [];
  const steps: StepPlan[] = [];
  const list = Array.isArray((raw as { steps?: unknown })?.steps) ? (raw as { steps: unknown[] }).steps : [];
  for (const s of list.slice(0, 3)) {
    const x = s as { title?: string; objective?: string; question?: QuestionSpec };
    const title = String(x?.title ?? "").trim().slice(0, 140);
    const objective = String(x?.objective ?? "").trim();
    if (!title || !objective || !x.question) { rejected.push(L("incomplete step", "eksik adım")); continue; }
    const gr = validateGranularity({ title, objective, questionCount: 1, estimatedDuration: 8, prerequisites: [] }, { siblings: steps.map((p, i) => ({ id: String(i), text: p.objective })), knownIds: new Set() });
    if (!isValid(gr) && gr.status.some((st) => st === "TOO_BROAD" || st === "DUPLICATE")) { rejected.push(`${title}: ${gr.notes.join("; ")}`); continue; }
    const repairs: string[] = [];
    const q = sanitizeQuestion(x.question, milestoneId, "FREE_RESPONSE", "ai:decompose", repairs);
    if (!q) { rejected.push(`${title}: ${L("unusable question", "kullanılamaz soru")}`); continue; }
    const qa = questionQuality(db, q);
    const issues = qa.issues.filter((i) => !/duplicate|aynı/i.test(i));
    if (issues.length) { rejected.push(`${title}: ${issues.join("; ")}`); continue; }
    const { milestoneId: _m, ...rest } = q;
    void _m;
    steps.push({ title, objective, questions: [{ ...rest, purpose: "MASTERY" }], difficulty: Math.max(1, Math.min(m?.difficulty ?? 3, q.difficulty)) });
  }
  return { steps, rejected };
}

export async function decomposeAI(host: AIHost, g: KnowledgeGraph, milestoneId: ID, stuckQuestionId?: ID): Promise<AIResult<StepPlan[]> & { rejected: string[] }> {
  const db = host.db();
  const m = db.milestones[milestoneId];
  const lo = m?.learningObjectIds?.map((id) => g.objects[id]).find(Boolean);
  const stuck = stuckQuestionId ? db.questions[stuckQuestionId] : undefined;
  let rejected: string[] = [];
  const res = await runAI(host, {
    role: "MILESTONE_GENERATOR",
    summary: `Decompose: ${m?.title ?? milestoneId}`,
    milestoneId,
    system: `You are Lab's Milestone Generator. A learner is stuck on a milestone. Propose 2-3 smaller, sequential steps that lead back to it. Each step builds exactly ONE observable capability (no "read", "watch", "understand") and has ONE question that tests it, with a gradable answer key when possible. Do not solve the original question. ${L("Write in English.", "Write in Turkish.")}
Return ONLY {"steps":[{"title":string,"objective":string,"question":${QUESTION_SCHEMA}}]}.`,
    prompt: `Milestone: ${m?.title}\nObjective: ${m?.learningObjective}\nDifficulty: ${m?.difficulty}/5\n${lo ? `Concept: ${lo.title} — ${lo.description}\nPrerequisites: ${lo.prerequisites.map((p) => g.objects[p.id]?.title).filter(Boolean).join(", ")}` : ""}${stuck ? `\nThe question they are stuck on: ${stuck.prompt}` : ""}`,
    parse: parseJSON((x) => {
      const r = acceptSteps(db, milestoneId, x);
      rejected = r.rejected;
      if (!r.steps.length) throw new Error("No valid steps");
      return r.steps;
    }),
    fallback: () => planDecomposition(db, g, milestoneId, stuckQuestionId),
    cache: false,
  });
  return { ...res, rejected };
}

/** Validate an AI variant against the original. */
export function acceptVariant(db: LabDB, original: Question, raw: unknown): Omit<Question, "id"> | null {
  const repairs: string[] = [];
  const q = sanitizeQuestion(raw as QuestionSpec, original.milestoneId, original.kind, "ai:variant", repairs);
  if (!q) return null;
  if (isAutoGradable(original) && !isAutoGradable(q as Question)) return null;
  if (!questionQuality(db, q).ok) return null;
  if (q.prompt.trim() === original.prompt.trim()) return null;
  return { ...q, purpose: original.purpose === "RETENTION" ? "RETENTION" : "TRANSFER", variantOf: original.id, variation: L("AI variation", "YZ varyasyonu") };
}

export async function varyQuestionAI(host: AIHost, questionId: ID, how: "numbers" | "context" | "representation" = "context"): Promise<Question | null> {
  const db = host.db();
  const q = db.questions[questionId];
  if (!q) return null;
  const res = await runAI(host, {
    role: "MILESTONE_GENERATOR",
    summary: `Vary question (${how})`,
    milestoneId: q.milestoneId,
    system: `You are Lab's question writer. Write ONE variation of the given question that tests the SAME skill with ${how === "numbers" ? "different numbers" : how === "context" ? "a different, unfamiliar context" : "a different representation (graph, table, words)"}. Keep the same answer format; recompute the answer key exactly. ${L("Write in English.", "Write in Turkish.")}
Return ONLY ${QUESTION_SCHEMA}.`,
    prompt: describe(q),
    parse: parseJSON((x) => {
      const v = acceptVariant(host.db(), q, x);
      if (!v) throw new Error("Variant rejected by the quality check");
      return v;
    }),
    fallback: () => null,
    cache: false,
  });
  if (!res.value) return null;
  let added: Question | null = null;
  host.record((d) => { added = addQuestion(d, res.value!); });
  return added;
}
