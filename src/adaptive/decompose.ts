/**
 * Milestone length and dynamic decomposition.
 *
 * Length is cognitive scope, not only minutes: MICRO (one idea, one check) …
 * DEEP (multi-step reasoning) and BOSS (synthesis). The evidence says when a
 * milestone is too easy (expand: offer the harder continuation) or too big
 * (split it).
 *
 * Splitting is temporary. `decompose` creates up to three ephemeral steps in
 * the learner's own course — never in the knowledge graph — that lead back to
 * the original milestone:
 *
 *   current milestone → [refresh a weak prerequisite] → [one capability at a time]
 *                     → [an easier case] → original milestone
 *
 * Each step has at least one real question: copied (as a variation) from the
 * question bank when possible, otherwise an open question from the graph
 * judged against its criteria. The steps are archived as soon as the original
 * milestone is mastered, so they never pile up.
 */
import type { ID, LabDB, Milestone, Millis, Question } from "../domain/types";
import type { KnowledgeGraph } from "../knowledge/schema";
import { addMilestone, addQuestion, milestoneQuestions } from "../engines/curriculum";
import { isAutoGradable } from "../engines/evaluation";
import { recomputeStatuses } from "../engines/progress";
import { logEvent } from "../engines/analytics";
import { L } from "../i18n";
import { masteryProfile } from "./mastery";

export const LENGTHS = ["MICRO", "SHORT", "MEDIUM", "DEEP", "BOSS"] as const;
export type MilestoneLength = (typeof LENGTHS)[number];

export const LENGTH_LABEL = (l: MilestoneLength): string =>
  ({ MICRO: L("Micro", "Mikro"), SHORT: L("Short", "Kısa"), MEDIUM: L("Medium", "Orta"), DEEP: L("Deep", "Derin"), BOSS: L("Synthesis", "Sentez") })[l];

export const LENGTH_SCOPE = (l: MilestoneLength): string =>
  ({
    MICRO: L("one idea, one check", "tek fikir, tek kontrol"),
    SHORT: L("one skill, a few problems", "tek beceri, birkaç problem"),
    MEDIUM: L("one skill in several forms", "tek beceri, birkaç biçimde"),
    DEEP: L("multi-step reasoning or a derivation", "çok adımlı akıl yürütme ya da türetme"),
    BOSS: L("several ideas combined", "birkaç fikrin birleşimi"),
  })[l];

const DEEP_TYPES = new Set(["DERIVATION", "PROOF", "PROJECT", "EXPERIMENT"]);

export function milestoneLength(m: Milestone): MilestoneLength {
  if (m.milestoneType === "BOSS" || m.status === "BOSS") return "BOSS";
  let i = m.estimatedDuration <= 10 ? 0 : m.estimatedDuration <= 20 ? 1 : m.estimatedDuration <= 40 ? 2 : 3;
  if (DEEP_TYPES.has(m.milestoneType)) i = Math.max(i, 2);
  if (m.difficulty >= 4) i = Math.min(3, i + 1);
  if (m.scope === "MICRO") i = Math.min(i, 1);
  return LENGTHS[i];
}

export type LengthAdvice = { kind: "TOO_BIG" | "TOO_EASY"; reason: string } | null;

/** What the learner's answers say about the size of this milestone. */
export function lengthAdvice(db: LabDB, milestoneId: ID): LengthAdvice {
  const m = db.milestones[milestoneId];
  if (!m) return null;
  const atts = Object.values(db.attempts).filter((a) => a.milestoneId === milestoneId).sort((a, b) => a.createdAt - b.createdAt);
  const wrong = atts.filter((a) => a.correct === false).length;
  const stuck = db.events.filter((e) => e.type === "STUCK_DETECTED" && e.milestoneId === milestoneId).length;
  const abandons = db.events.filter((e) => e.type === "MILESTONE_ABANDON" && e.milestoneId === milestoneId).length;
  if (!m.masteredAt && (stuck >= 1 && wrong >= 3 || wrong >= 5 || abandons >= 2))
    return { kind: "TOO_BIG", reason: L(`${wrong} wrong answers${stuck ? `, stuck ${stuck}×` : ""}${abandons ? `, left ${abandons}×` : ""} — this milestone may be too big. Smaller steps can help.`, `${wrong} yanlış cevap${stuck ? `, ${stuck} kez takılma` : ""}${abandons ? `, ${abandons} kez bırakma` : ""} — bu adım fazla büyük olabilir. Daha küçük adımlar yardımcı olabilir.`) };
  const firstTry = atts.filter((a) => !a.isRetry);
  const fast = firstTry.filter((a) => a.correct && a.hintLevelUsed === 0 && a.durationMs > 0 && a.durationMs < m.estimatedDuration * 60_000 * 0.15).length;
  if (m.masteredAt && firstTry.length >= 2 && firstTry.every((a) => a.correct && a.hintLevelUsed === 0) && fast >= 2)
    return { kind: "TOO_EASY", reason: L("Solved on the first try, quickly and without hints — the harder continuation is a better use of your time.", "İlk denemede, hızlıca ve ipucusuz çözüldü — zor devamı zamanını daha iyi değerlendirir.") };
  return null;
}

// ---------------------------------------------------------------------------
// Decomposition
// ---------------------------------------------------------------------------

export const ephemeralChildren = (db: LabDB, parentId: ID): Milestone[] =>
  Object.values(db.milestones).filter((m) => m.ephemeral?.parentId === parentId && !m.ephemeral.archivedAt).sort((a, b) => a.order - b.order);

export interface StepPlan {
  title: string;
  objective: string;
  questions: Omit<Question, "id" | "milestoneId">[];
  difficulty: number;
}

const copyQuestion = (q: Question, variation: string): Omit<Question, "id" | "milestoneId"> => {
  const { id, milestoneId, favorite, ...rest } = q;
  void milestoneId; void favorite;
  return { ...structuredClone(rest), purpose: "MASTERY", variantOf: id, variation, createdBy: "decompose" };
};

const openQuestion = (prompt: string, rubric: string[], difficulty: number, hints: string[] = []): Omit<Question, "id" | "milestoneId"> => ({
  kind: "FREE_RESPONSE", purpose: "MASTERY", prompt, rubric: rubric.slice(0, 3), hints: hints.slice(0, 4), solution: "", difficulty, createdBy: "decompose",
});

/** Plan the smaller steps. Pure: reads the database, writes nothing. */
export function planDecomposition(db: LabDB, g: KnowledgeGraph, milestoneId: ID, stuckQuestionId?: ID, now: Millis = Date.now()): StepPlan[] {
  const m = db.milestones[milestoneId];
  if (!m) return [];
  const steps: StepPlan[] = [];
  const lo = m.learningObjectIds?.map((id) => g.objects[id]).find(Boolean);
  const stuck = stuckQuestionId ? db.questions[stuckQuestionId] : undefined;

  // 1. A weak required prerequisite (by the evidence), if there is one.
  if (lo) {
    const weak = lo.prerequisites
      .filter((p) => p.strength === "ZORUNLU" && g.objects[p.id])
      .map((p) => ({ o: g.objects[p.id], v: masteryProfile(db, p.id, now).verified }))
      .filter((x) => x.v < 0.6)
      .sort((a, b) => a.v - b.v)[0];
    if (weak) {
      const bank = Object.values(db.milestones).filter((x) => x.learningObjectIds?.includes(weak.o.id) && !x.ephemeral).flatMap((x) => milestoneQuestions(db, x.id)).filter(isAutoGradable).sort((a, b) => a.difficulty - b.difficulty);
      const qs = bank.slice(0, 2).map((q) => copyQuestion(q, L("prerequisite refresher", "önkoşul tazeleme")));
      if (!qs.length) qs.push(openQuestion(weak.o.coreQuestions[0] ?? weak.o.entryQuestions[0] ?? weak.o.learningObjectives[0] ?? weak.o.title, weak.o.masteryCriteria.length ? weak.o.masteryCriteria : weak.o.learningObjectives, Math.max(1, weak.o.difficulty)));
      steps.push({ title: L(`Refresh: ${weak.o.title}`, `Tazele: ${weak.o.title}`), objective: weak.o.learningObjectives[0] ?? weak.o.description, questions: qs, difficulty: Math.max(1, Math.min(m.difficulty - 1, weak.o.difficulty)) });
    }
  }

  // 2. One capability at a time: the graph object's other objectives.
  if (lo) {
    const objectives = lo.learningObjectives.filter((x) => x.trim() && x !== m.learningObjective).slice(0, 2);
    for (const [i, obj] of objectives.entries()) {
      if (steps.length >= 2) break;
      const prompt = lo.coreQuestions[i] ?? L(`Show that you can: ${obj}`, `Şunu yapabildiğini göster: ${obj}`);
      steps.push({ title: L(`One piece: ${obj}`, `Tek parça: ${obj}`).slice(0, 140), objective: obj, questions: [openQuestion(prompt, [obj, ...(lo.masteryCriteria[i] ? [lo.masteryCriteria[i]] : [])], Math.max(1, m.difficulty - 1))], difficulty: Math.max(1, m.difficulty - 1) });
    }
  }
  // Without a graph object, the hard question's own hints become the pieces.
  if (!lo && stuck && stuck.hints.length >= 2 && steps.length < 2) {
    steps.push({
      title: L("First part only", "Yalnızca ilk kısım"),
      objective: stuck.hints[0],
      questions: [openQuestion(`${stuck.prompt}\n\n${L("Do only the first part:", "Yalnızca ilk kısmı yap:")} ${stuck.hints[0]}`, [stuck.hints[0]], Math.max(1, stuck.difficulty - 1), stuck.hints.slice(0, 1))],
      difficulty: Math.max(1, m.difficulty - 1),
    });
  }

  // 3. An easier case of the same milestone.
  const easier = milestoneQuestions(db, m.id).filter((q) => q.id !== stuckQuestionId && isAutoGradable(q) && q.difficulty < (stuck?.difficulty ?? m.difficulty + 1)).sort((a, b) => a.difficulty - b.difficulty).slice(0, 2);
  if (easier.length) steps.push({ title: L(`An easier case: ${m.title}`, `Daha kolay bir durum: ${m.title}`).slice(0, 140), objective: m.learningObjective, questions: easier.map((q) => copyQuestion(q, L("easier case", "daha kolay durum"))), difficulty: Math.max(1, Math.min(...easier.map((q) => q.difficulty))) });

  return steps.slice(0, 3);
}

/**
 * Create the ephemeral steps. They are optional, so course progress is not
 * affected, and chained so they lead back to the original. Returns their ids
 * (existing active steps are returned instead of creating duplicates).
 */
export function decompose(db: LabDB, g: KnowledgeGraph, milestoneId: ID, opts: { stuckQuestionId?: ID; sessionId?: ID; reason?: string; now?: Millis; /** A validated plan (e.g. from the AI); otherwise Lab plans it locally. */ plan?: StepPlan[]; source?: string } = {}): ID[] {
  const existing = ephemeralChildren(db, milestoneId);
  if (existing.length) return existing.map((m) => m.id);
  const m = db.milestones[milestoneId];
  if (!m) return [];
  const now = opts.now ?? Date.now();
  const plan = opts.plan?.length ? opts.plan.slice(0, 3) : planDecomposition(db, g, milestoneId, opts.stuckQuestionId, now);
  if (!plan.length) return [];
  const reason = opts.reason ?? L("Broken into smaller steps while working on it.", "Üzerinde çalışırken daha küçük adımlara bölündü.");
  const ids: ID[] = [];
  for (const [i, s] of plan.entries()) {
    const child = addMilestone(db, {
      title: s.title, topicId: m.topicId, learningObjective: s.objective, description: L(`Smaller step ${i + 1} of ${plan.length} toward "${m.title}".`, `"${m.title}" adımına giden ${plan.length} küçük adımdan ${i + 1}.`),
      difficulty: s.difficulty, estimatedDuration: 8, scope: "MICRO", milestoneType: "PRACTICE", optional: true, required: false,
      recommendedInteractionType: s.questions[0]?.kind ?? "FREE_RESPONSE", tags: ["ephemeral"], order: m.order + (i + 1) / 10,
      masteryCriteria: { description: L("One correct answer without the full solution.", "Tam çözüme bakmadan bir doğru cevap."), requiredCorrect: 1, requireUnassisted: true, minScore: 0.6 },
    });
    child.ephemeral = { parentId: m.id, reason, createdAt: now };
    // Never locked: the order (and the parent's "smaller steps" list) carries the sequence.
    child.manuallyUnlocked = true;
    for (const q of s.questions) addQuestion(db, { ...q, milestoneId: child.id });
    ids.push(child.id);
  }
  recomputeStatuses(db, m.courseId);
  logEvent(db, "DECOMPOSED", { milestoneId, sessionId: opts.sessionId, at: now }, { steps: ids.length, reason, stuckQuestionId: opts.stuckQuestionId, source: opts.source ?? "local" });
  return ids;
}

/** Archive the temporary steps of a milestone (called when it is mastered). */
export function archiveEphemeral(db: LabDB, parentId: ID, now: Millis = Date.now()): number {
  let n = 0;
  for (const c of Object.values(db.milestones)) if (c.ephemeral?.parentId === parentId && !c.ephemeral.archivedAt) { c.ephemeral.archivedAt = now; n++; }
  return n;
}
