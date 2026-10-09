/**
 * Retention strategies. Lab does not depend on one spaced-repetition formula:
 * every scheduler implements `RetentionStrategy`, and topics and flashcards
 * each use the strategy chosen in the preferences. A new algorithm is one
 * more entry in `RETENTION_STRATEGIES`; the review history stays the same.
 *
 * The adaptive layer (retention.ts) only scales the interval by a factor
 * (importance, errors, transfer…), independent of the strategy.
 */
import type { CardGrade } from "../domain/types";
import { L } from "../i18n";

export interface ReviewState {
  /** Position on a ladder/box system. */
  stage: number;
  intervalDays: number;
  ease: number;
  reps: number;
  lapses: number;
}

export interface RetentionStrategy {
  id: RetentionStrategyId;
  label: () => string;
  description: () => string;
  /** The next state and interval (days; 0 = again within this review) after a grade 0 forgot … 3 easy. */
  next(state: ReviewState, grade: CardGrade): { state: ReviewState; days: number };
}

export type RetentionStrategyId = "ladder" | "sm2" | "leitner";

export const LADDER_DAYS = [1, 3, 7, 14, 30, 60, 120] as const;
const LEITNER_DAYS = [1, 2, 4, 8, 16, 32, 64] as const;

const ladder: RetentionStrategy = {
  id: "ladder",
  label: () => L("Expanding ladder", "Genişleyen merdiven"),
  description: () => L("1, 3, 7, 14, 30, 60, 120 days; forgetting starts over, easy skips a rung.", "1, 3, 7, 14, 30, 60, 120 gün; unutunca baştan, kolaysa bir basamak atlar."),
  next(s, grade) {
    let stage = s.stage;
    if (grade === 0) stage = 0;
    else if (grade === 2) stage = Math.min(stage + 1, LADDER_DAYS.length - 1);
    else if (grade === 3) stage = Math.min(stage + 2, LADDER_DAYS.length - 1);
    // "Hard" keeps the stage but comes back sooner than its interval.
    const days = grade === 1 ? LADDER_DAYS[stage] * 0.6 : LADDER_DAYS[stage];
    return { state: { ...s, stage, intervalDays: days, reps: grade ? s.reps + 1 : 0, lapses: s.lapses + (grade ? 0 : 1) }, days };
  },
};

const sm2: RetentionStrategy = {
  id: "sm2",
  label: () => "SM-2",
  description: () => L("Classic SuperMemo-2: the interval grows by a per-item ease factor.", "Klasik SuperMemo-2: aralık, öğeye özgü bir kolaylık katsayısıyla büyür."),
  next(s, grade) {
    let { ease, intervalDays, reps, lapses } = s;
    if (grade === 0) {
      lapses += 1;
      reps = 0;
      intervalDays = 0;
      ease = Math.max(1.3, ease - 0.2);
    } else {
      reps += 1;
      const q = grade + 2; // map 1..3 → 3..5 on the SM-2 scale
      ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
      if (reps === 1) intervalDays = grade === 3 ? 3 : 1;
      else if (reps === 2) intervalDays = grade === 1 ? 3 : 6;
      else intervalDays = Math.round(intervalDays * (grade === 1 ? 1.2 : grade === 3 ? ease * 1.3 : ease));
      intervalDays = Math.max(1, Math.min(intervalDays, 365));
    }
    return { state: { ...s, ease, intervalDays, reps, lapses }, days: intervalDays };
  },
};

const leitner: RetentionStrategy = {
  id: "leitner",
  label: () => "Leitner",
  description: () => L("Boxes of 1, 2, 4, 8, 16, 32, 64 days; a miss goes back to box 1.", "1, 2, 4, 8, 16, 32, 64 günlük kutular; bilinmeyen 1. kutuya döner."),
  next(s, grade) {
    const stage = grade === 0 ? 0 : grade === 1 ? s.stage : Math.min(s.stage + 1, LEITNER_DAYS.length - 1);
    const days = grade === 0 ? 0 : LEITNER_DAYS[stage];
    return { state: { ...s, stage, intervalDays: days, reps: grade ? s.reps + 1 : 0, lapses: s.lapses + (grade ? 0 : 1) }, days };
  },
};

export const RETENTION_STRATEGIES: Record<RetentionStrategyId, RetentionStrategy> = { ladder, sm2, leitner };

export const strategy = (id: string | undefined, fallback: RetentionStrategyId): RetentionStrategy =>
  RETENTION_STRATEGIES[(id ?? fallback) as RetentionStrategyId] ?? RETENTION_STRATEGIES[fallback];
