/**
 * Knowledge checks: "I know this" has to be shown, not just claimed.
 *
 * A check is a short test (2–3 items, at most 2 per object when several basics
 * are checked at once). Items come from the question bank first — questions
 * Lab can grade itself — and are filled up with open questions from the graph
 * object (its core questions, judged against its mastery criteria). Open
 * answers are graded by the AI evaluator when one is available, otherwise by
 * the learner against the rubric, which counts for less evidence.
 *
 * Passing a check on a graph object marks it "passed a short check" (it then
 * satisfies prerequisites, like mastery); passing on a milestone grants
 * mastery with the check's answers as evidence. Failing changes nothing except
 * what Lab suggests next. All results are stored and logged.
 */
import type { ID, LabDB, Millis, Question } from "../domain/types";
import type { CheckItem, KnowledgeCheck } from "../domain/academic";
import type { KnowledgeGraph } from "../knowledge/schema";
import { milestoneQuestions } from "../engines/curriculum";
import { evaluateAuto, evaluateSelf, isAutoGradable, type Answer } from "../engines/evaluation";
import { grantMastery, recordAttempt } from "../engines/progress";
import { logEvent } from "../engines/analytics";
import { newId } from "../data/ids";
import { L } from "../i18n";

export const PASS_SCORE = 0.7;
export const MAX_ITEMS = 3;
export const MAX_BATCH_ITEMS = 8;

export type CheckTarget = { loId: string } | { milestoneId: ID } | { loIds: string[] };

export interface CheckDraft {
  target: CheckTarget;
  items: CheckItem[];
}

const bankFor = (db: LabDB, loId: string): Question[] =>
  Object.values(db.milestones)
    .filter((m) => m.learningObjectIds?.includes(loId) && !m.ephemeral)
    .flatMap((m) => milestoneQuestions(db, m.id));

/** Auto-gradable questions first, the less used ones first, mastery/transfer questions before practice. */
function pickQuestions(db: LabDB, qs: Question[], n: number): Question[] {
  const used = new Map<ID, number>();
  for (const a of Object.values(db.attempts)) used.set(a.questionId, (used.get(a.questionId) ?? 0) + 1);
  const purposeRank = { MASTERY: 0, TRANSFER: 1, PRACTICE: 2, RETENTION: 3 } as const;
  const kinds = new Set<string>();
  const out: Question[] = [];
  const sorted = qs
    .filter(isAutoGradable)
    .sort((a, b) => (used.get(a.id) ?? 0) - (used.get(b.id) ?? 0) || purposeRank[a.purpose] - purposeRank[b.purpose] || a.difficulty - b.difficulty);
  // Prefer variety of question kinds.
  for (const q of sorted) if (out.length < n && !kinds.has(q.kind)) { out.push(q); kinds.add(q.kind); }
  for (const q of sorted) if (out.length < n && !out.includes(q)) out.push(q);
  return out;
}

const autoItem = (q: Question, loId?: string): CheckItem => ({ prompt: q.prompt, questionId: q.id, loId, kind: "auto", rubric: [], correct: null, score: 0, by: "none" });

/** Open items from the graph object: its core questions, judged against its mastery criteria. */
function openItems(g: KnowledgeGraph, loId: string, n: number): CheckItem[] {
  const o = g.objects[loId];
  if (!o) return [];
  const rubric = (o.masteryCriteria.length ? o.masteryCriteria : o.learningObjectives).slice(0, 3);
  const prompts = [...o.coreQuestions, ...o.entryQuestions, ...o.learningObjectives.map((x) => L(`Show that you can: ${x}`, `Şunu yapabildiğini göster: ${x}`))];
  return [...new Set(prompts)].slice(0, n).map((prompt) => ({ prompt, loId, kind: "open" as const, rubric, correct: null, score: 0, by: "none" as const }));
}

export function buildCheck(db: LabDB, g: KnowledgeGraph, target: CheckTarget): CheckDraft {
  if ("milestoneId" in target) {
    const m = db.milestones[target.milestoneId];
    if (!m) throw new Error(L("Milestone not found.", "Adım bulunamadı."));
    const qs = milestoneQuestions(db, m.id);
    const items: CheckItem[] = pickQuestions(db, qs, MAX_ITEMS).map((q) => autoItem(q));
    // Fill with the milestone's own open questions, then with the linked object's.
    for (const q of qs.filter((q) => !isAutoGradable(q) && q.rubric.length)) {
      if (items.length >= MAX_ITEMS) break;
      items.push({ prompt: q.prompt, questionId: q.id, kind: "open", rubric: q.rubric, correct: null, score: 0, by: "none" });
    }
    for (const lo of m.learningObjectIds ?? []) if (items.length < 2) items.push(...openItems(g, lo, 2 - items.length));
    if (!items.length) items.push({ prompt: L(`Show that you can: ${m.learningObjective}`, `Şunu yapabildiğini göster: ${m.learningObjective}`), kind: "open", rubric: [m.masteryCriteria.description || m.learningObjective], correct: null, score: 0, by: "none" });
    return { target, items };
  }
  const loIds = "loId" in target ? [target.loId] : [...new Set(target.loIds)].filter((id) => g.objects[id]);
  if (!loIds.length || !g.objects[loIds[0]]) throw new Error(L("Topic not found in the graph.", "Konu grafikte bulunamadı."));
  const per = loIds.length === 1 ? MAX_ITEMS : Math.max(1, Math.min(2, Math.floor(MAX_BATCH_ITEMS / loIds.length)));
  const items: CheckItem[] = [];
  for (const lo of loIds) {
    const own = pickQuestions(db, bankFor(db, lo), Math.min(2, per)).map((q) => autoItem(q, lo));
    own.push(...openItems(g, lo, per - own.length));
    items.push(...own);
    if (items.length >= MAX_BATCH_ITEMS) break;
  }
  return { target, items: items.slice(0, loIds.length === 1 ? MAX_ITEMS : MAX_BATCH_ITEMS) };
}

/** Grade an auto item and record it as an ordinary attempt (no hints in a check). */
export function answerAutoItem(db: LabDB, draft: CheckDraft, index: number, answer: Answer, sessionId: ID, inputMethod: "pen" | "touch" | "mouse" | "keyboard" | "unknown" = "unknown", now: Millis = Date.now()): CheckItem {
  const item = draft.items[index];
  const q = item?.questionId ? db.questions[item.questionId] : undefined;
  if (!item || !q) throw new Error("Unknown check item");
  const ev = evaluateAuto(q, answer);
  const { attempt } = recordAttempt(db, {
    questionId: q.id, milestoneId: q.milestoneId, sessionId, answer, correct: ev.correct, score: ev.score, feedback: ev.feedback,
    hintLevelUsed: 0, evaluatedBy: "auto", inputMethod, usedStylus: inputMethod === "pen", durationMs: 0, purpose: "MASTERY", createdAt: now,
  });
  Object.assign(item, { answer: JSON.stringify(answer), correct: ev.correct, score: ev.score, by: "auto", attemptId: attempt.id });
  return item;
}

/** Grade an open item: `met` per rubric point, judged by the AI evaluator or by the learner. */
export function answerOpenItem(draft: CheckDraft, index: number, text: string, met: boolean[], by: "ai" | "self"): CheckItem {
  const item = draft.items[index];
  if (!item) throw new Error("Unknown check item");
  const q = { rubric: item.rubric } as Question;
  const ev = evaluateSelf(q, item.rubric.map((_, i) => !!met[i]), PASS_SCORE);
  const empty = !text.trim();
  Object.assign(item, { answer: text, met, correct: empty ? false : ev.correct, score: empty ? 0 : ev.score, by });
  return item;
}

/** A synthetic question so the AI evaluator can judge an open check item. */
export const itemAsQuestion = (item: CheckItem, milestoneId = ""): Question => ({
  id: `check:${item.prompt.slice(0, 20)}`, milestoneId, kind: "FREE_RESPONSE", purpose: "MASTERY", prompt: item.prompt,
  rubric: item.rubric, hints: [], solution: "", difficulty: 2, createdBy: "check",
});

const gradedBy = (items: CheckItem[]): KnowledgeCheck["gradedBy"] => {
  const s = new Set(items.map((i) => i.by).filter((b) => b !== "none"));
  return s.size === 1 ? ([...s][0] as KnowledgeCheck["gradedBy"]) : s.size === 0 ? "self" : "mixed";
};

function summarize(target: KnowledgeCheck["target"], items: CheckItem[], sessionId: ID | undefined, now: Millis): KnowledgeCheck {
  const score = items.length ? items.reduce((s, i) => s + i.score, 0) / items.length : 0;
  // Every item must be answered; one fully wrong auto-graded item is allowed only in a three-item check.
  const wrongAuto = items.filter((i) => i.kind === "auto" && i.correct === false).length;
  const passed = items.length > 0 && items.every((i) => i.by !== "none") && score >= PASS_SCORE && wrongAuto <= (items.length >= 3 ? 1 : 0);
  return { id: newId("chk"), target, items, score, passed, gradedBy: gradedBy(items), sessionId, createdAt: now };
}

export interface CheckOutcome {
  checks: KnowledgeCheck[];
  passed: string[];
  failed: string[];
  masteredMilestone?: ID;
}

/**
 * Store the result. A batch over several objects is stored as one check per
 * object, so each object passes or fails on its own items.
 */
export function finishCheck(db: LabDB, draft: CheckDraft, sessionId?: ID, now: Millis = Date.now()): CheckOutcome {
  const out: CheckOutcome = { checks: [], passed: [], failed: [] };
  if ("milestoneId" in draft.target) {
    const c = summarize({ milestoneId: draft.target.milestoneId }, draft.items, sessionId, now);
    db.checks[c.id] = c;
    out.checks.push(c);
    const m = db.milestones[draft.target.milestoneId];
    (c.passed ? out.passed : out.failed).push(draft.target.milestoneId);
    if (c.passed && m && !m.masteredAt) {
      grantMastery(db, m.id, c.items.map((i) => i.attemptId).filter((x): x is ID => !!x), c.gradedBy === "self", false, sessionId, now);
      out.masteredMilestone = m.id;
    }
    logEvent(db, "KNOWLEDGE_CHECK", { milestoneId: draft.target.milestoneId, sessionId, at: now }, { passed: c.passed, score: c.score, items: c.items.length, gradedBy: c.gradedBy });
    return out;
  }
  const ids = "loId" in draft.target ? [draft.target.loId] : draft.target.loIds;
  for (const lo of ids) {
    const items = draft.items.filter((i) => i.loId === lo);
    if (!items.length) continue;
    const c = summarize({ loId: lo }, items, sessionId, now);
    db.checks[c.id] = c;
    out.checks.push(c);
    (c.passed ? out.passed : out.failed).push(lo);
    logEvent(db, "KNOWLEDGE_CHECK", { sessionId, loIds: [lo], at: now }, { passed: c.passed, score: c.score, items: items.length, gradedBy: c.gradedBy });
  }
  return out;
}

export const latestCheck = (db: LabDB, target: { loId?: string; milestoneId?: ID }): KnowledgeCheck | undefined =>
  Object.values(db.checks)
    .filter((c) => (target.loId ? c.target.loId === target.loId : c.target.milestoneId === target.milestoneId))
    .sort((a, b) => b.createdAt - a.createdAt)[0];
