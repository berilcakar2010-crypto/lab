/**
 * Within-milestone sequencing: which question to work on next. Practice
 * questions come first, then mastery questions that lack a qualifying
 * (correct, not solution-revealed) answer. Retention and transfer questions
 * are reserved for later checks unless nothing else exists.
 */
import type { ID, LabDB, Question } from "../domain/types";
import { milestoneQuestions } from "./curriculum";
import { attemptsFor, masteryProgress } from "./progress";

export function qualifyingCorrect(db: LabDB, milestoneId: ID): Set<ID> {
  const m = db.milestones[milestoneId];
  const crit = m.masteryCriteria;
  const ok = new Set<ID>();
  for (const a of attemptsFor(db, milestoneId)) {
    if (a.correct && a.score >= crit.minScore && !(crit.requireUnassisted && a.hintLevelUsed >= 5)) ok.add(a.questionId);
  }
  return ok;
}

export function workQuestions(db: LabDB, milestoneId: ID): Question[] {
  const qs = milestoneQuestions(db, milestoneId);
  const work = qs.filter((q) => q.purpose === "PRACTICE" || q.purpose === "MASTERY");
  // If authoring left only retention/transfer questions, use them rather than dead-end.
  return work.length ? work : qs;
}

/** The next question to attempt, or null when nothing remains (mastered or no questions). */
export function nextQuestion(db: LabDB, milestoneId: ID, opts: { exclude?: ID[] } = {}): Question | null {
  const done = qualifyingCorrect(db, milestoneId);
  const qs = workQuestions(db, milestoneId);
  const pending = qs.filter((q) => !done.has(q.id));
  const order = (q: Question) => (q.purpose === "PRACTICE" ? 0 : 1);
  const sorted = [...pending].sort((a, b) => order(a) - order(b) || a.difficulty - b.difficulty);
  const preferred = sorted.filter((q) => !opts.exclude?.includes(q.id));
  return preferred[0] ?? sorted[0] ?? null;
}

export function milestoneSessionState(db: LabDB, milestoneId: ID) {
  const m = db.milestones[milestoneId];
  const progress = masteryProgress(db, milestoneId);
  const qs = workQuestions(db, milestoneId);
  return {
    mastered: !!m.masteredAt,
    progress,
    questionCount: qs.length,
    /** True when every question is answered but mastery is still not met (e.g. all needed the full solution). */
    exhausted: !m.masteredAt && qs.length > 0 && nextQuestion(db, milestoneId) === null,
  };
}

/**
 * A question for reviewing a milestone that needs review (or is practised again
 * after mastery): prefer retention questions, then the least recently answered.
 */
export function reviewQuestion(db: LabDB, milestoneId: ID, exclude: ID[] = []): Question | null {
  const qs = milestoneQuestions(db, milestoneId).filter((q) => q.purpose !== "TRANSFER" && !exclude.includes(q.id));
  if (!qs.length) return null;
  const lastAnswered = new Map<ID, number>();
  for (const a of attemptsFor(db, milestoneId)) lastAnswered.set(a.questionId, a.createdAt);
  return [...qs].sort((a, b) => (lastAnswered.get(a.id) ?? 0) - (lastAnswered.get(b.id) ?? 0) || (a.purpose === "RETENTION" ? -1 : 1))[0];
}
