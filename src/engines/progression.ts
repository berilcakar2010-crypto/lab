/**
 * Progression engine: ranks what to do next and calibrates where to start.
 * It only recommends — the user always chooses, and every recommendation
 * carries human-readable reasons.
 */
import type { ID, LabDB, Milestone, MilestoneType, RecommendationKind } from "../domain/types";
import { AUTO_GRADED } from "../domain/types";
import { clamp, courseMilestones, milestoneQuestions, orderedMilestones } from "./curriculum";
import { L } from "../i18n";
import { dependsOn } from "./graph";
import { dueRetentionChecks, skipMilestone, recomputeStatuses } from "./progress";
import { prereqMap } from "./curriculum";

export interface Recommendation {
  milestoneId: ID;
  kind: RecommendationKind;
  score: number;
  reasons: string[];
}

export interface RecommendOptions {
  justCompletedId?: ID;
  now?: number;
  /** Continuation rate per milestone type relative to the user's average (from Statistics, Phase 8). */
  engagementLift?: Partial<Record<MilestoneType, number>>;
  /** Experiment condition: preferred milestone scope. */
  preferScope?: "MICRO" | "LONG";
  /** Experiment condition: preferred difficulty offset. */
  difficultyOffset?: number;
}

const CANDIDATE = new Set(["AVAILABLE", "ATTEMPTED", "OPTIONAL", "BOSS", "ACTIVE", "NEEDS_REVIEW"]);

export function recentPerformance(db: LabDB, courseId: ID, n = 15) {
  const atts = Object.values(db.attempts)
    .filter((a) => a.correct !== null && db.milestones[a.milestoneId]?.courseId === courseId)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, n);
  const accuracy = atts.length ? atts.filter((a) => a.correct).length / atts.length : null;
  const mastered = courseMilestones(db, courseId).filter((m) => m.masteredAt).sort((a, b) => b.masteredAt! - a.masteredAt!);
  const recentDiff = mastered.slice(0, 5).map((m) => m.difficulty);
  const base = recentDiff.length ? recentDiff.reduce((s, d) => s + d, 0) / recentDiff.length : 2;
  const shift = accuracy === null ? 0 : accuracy >= 0.8 ? 0.7 : accuracy < 0.5 ? -0.7 : 0;
  return { accuracy, sample: atts.length, targetDifficulty: clamp(base + shift, 1, 5), recentlyMastered: mastered.slice(0, 3) };
}

export function recommendNext(db: LabDB, courseId: ID, opts: RecommendOptions = {}): Recommendation[] {
  const now = opts.now ?? Date.now();
  const course = db.courses[courseId];
  if (!course) return [];
  const ms = courseMilestones(db, courseId);
  const perf = recentPerformance(db, courseId);
  const target = clamp(perf.targetDifficulty + (opts.difficultyOffset ?? 0), 1, 5);
  // Immediate checks are offered on the completion screen, not as later reviews.
  const due = new Set(dueRetentionChecks(db, now).filter((r) => r.kind !== "IMMEDIATE").map((r) => r.milestoneId));
  const recentTopics = new Set(perf.recentlyMastered.map((m) => m.topicId));
  const recentUnits = new Set(perf.recentlyMastered.map((m) => m.unitId));
  const just = opts.justCompletedId ? db.milestones[opts.justCompletedId] : undefined;
  const nothingDone = !ms.some((m) => m.masteredAt);
  const out: Recommendation[] = [];

  for (const m of ms) {
    const isDue = due.has(m.id);
    if (!CANDIDATE.has(m.status) && !(m.status === "MASTERED" && isDue)) continue;
    if (m.id === opts.justCompletedId && !isDue) continue;
    const reasons: string[] = [];
    let score = 50;
    let kind: RecommendationKind = "CONTINUE";

    if (m.required) score += 15;
    else score -= 5;

    if (just && just.nextMilestones.includes(m.id)) {
      score += 20;
      reasons.push(L(`Builds directly on "${just.title}"`, `Doğrudan "${just.title}" üzerine kurulu`));
    }
    if (nothingDone && course.startHereMilestoneId === m.id) {
      score += 25;
      reasons.push(L("Calibrated starting point", "Belirlenen başlangıç noktası"));
    }
    const unlocks = m.nextMilestones.length;
    if (unlocks) {
      score += Math.min(4, unlocks) * 3;
      reasons.push(L(`Unlocks ${unlocks} milestone${unlocks > 1 ? "s" : ""}`, `${unlocks} adımın kilidini açar`));
    }
    const diffGap = Math.abs(m.difficulty - target);
    score -= diffGap * 6;
    if (diffGap <= 0.75) reasons.push(L("Difficulty matches your recent performance", "Zorluk son performansınla uyumlu"));

    if (opts.engagementLift?.[m.milestoneType] !== undefined) {
      const lift = opts.engagementLift[m.milestoneType]!;
      score += clamp(lift * 20, -8, 8);
      if (lift > 0.1) reasons.push(L(`You tend to continue after ${m.milestoneType.toLowerCase()} milestones`, `Bu türdeki adımlardan sonra devam etme eğilimindesin`));
    }
    if (opts.preferScope === "MICRO") score += m.scope === "MICRO" || m.estimatedDuration <= 15 ? 8 : -6;
    if (opts.preferScope === "LONG") score += m.estimatedDuration >= 30 ? 8 : -6;

    const novelTopic = !recentTopics.has(m.topicId) && perf.recentlyMastered.length > 0;
    const novelUnit = !recentUnits.has(m.unitId) && perf.recentlyMastered.length > 0;
    if (novelTopic) score += 4;

    if (m.status === "NEEDS_REVIEW" || isDue) {
      kind = "REVIEW";
      score += m.status === "NEEDS_REVIEW" ? 18 : 15;
      reasons.unshift(m.status === "NEEDS_REVIEW" ? L("A retention check showed this has faded", "Bir kalıcılık kontrolü bunun unutulmaya başladığını gösterdi") : L("A retention check is due", "Bir kalıcılık kontrolünün zamanı geldi"));
    } else if (m.milestoneType === "BOSS") {
      kind = "BOSS";
      reasons.unshift(L("Integrates several branches you have unlocked", "Açtığın birkaç dalı birleştiriyor"));
    } else if (m.milestoneType === "CHALLENGE" || m.difficulty >= target + 1.5) {
      kind = "CHALLENGE";
      if (perf.accuracy !== null && perf.accuracy >= 0.8) {
        score += 8;
        reasons.unshift(L("Your recent accuracy is high — a stretch could help", "Son doğruluk oranın yüksek — biraz zorlamak iyi gelebilir"));
      } else reasons.unshift(L("A step above your current level", "Şu anki seviyenin bir adım üstünde"));
    } else if (m.status === "ATTEMPTED" || m.status === "ACTIVE") {
      kind = "PRACTICE";
      score += 12;
      reasons.unshift(L("You started this — finishing it closes a mastery gap", "Buna başlamıştın — bitirmek bir ustalık açığını kapatır"));
    } else if (m.optional || (novelUnit && !(just && just.nextMilestones.includes(m.id)))) {
      kind = "EXPLORE";
      reasons.unshift(m.optional ? L("Optional branch — explore if curious", "İsteğe bağlı dal — merak ediyorsan keşfet") : L("Opens a different area of the course", "Dersin farklı bir alanını açar"));
    } else {
      reasons.unshift(L("Next step on the main path", "Ana yoldaki bir sonraki adım"));
    }
    out.push({ milestoneId: m.id, kind, score: Math.round(score), reasons });
  }
  return out.sort((a, b) => b.score - a.score);
}

/** Best options with diverse kinds: the top pick plus the best of each other kind. */
export function topPicks(recs: Recommendation[], limit = 4): Recommendation[] {
  const picks: Recommendation[] = [];
  const kinds = new Set<RecommendationKind>();
  for (const r of recs) {
    if (picks.length >= limit) break;
    if (!kinds.has(r.kind)) {
      picks.push(r);
      kinds.add(r.kind);
    }
  }
  for (const r of recs) {
    if (picks.length >= limit) break;
    if (!picks.includes(r)) picks.push(r);
  }
  return picks.sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Calibration ("START HERE")
// ---------------------------------------------------------------------------

export interface DiagnosticItem {
  milestoneId: ID;
  questionId: ID;
}

/** One auto-gradable probe per unit, from the most advanced required milestone. */
export function diagnosticPlan(db: LabDB, courseId: ID, max = 6): DiagnosticItem[] {
  const ordered = orderedMilestones(db, courseId).filter((m) => m.required && m.milestoneType !== "BOSS" && !m.masteredAt);
  const byUnit = new Map<ID, Milestone[]>();
  for (const m of ordered) {
    if (!byUnit.has(m.unitId)) byUnit.set(m.unitId, []);
    byUnit.get(m.unitId)!.push(m);
  }
  const items: DiagnosticItem[] = [];
  for (const list of byUnit.values()) {
    for (const m of [...list].reverse()) {
      const q = milestoneQuestions(db, m.id).find((x) => x.purpose === "MASTERY" && AUTO_GRADED.has(x.kind) && (x.numeric || x.choices || x.acceptedExpressions || x.orderItems || x.classification));
      if (q) {
        items.push({ milestoneId: m.id, questionId: q.id });
        break;
      }
    }
    if (items.length >= max) break;
  }
  return items;
}

export interface CalibrationInput {
  /** unitId → 0 (new to me) | 1 (some exposure) | 2 (confident) */
  selfRatings: Record<ID, 0 | 1 | 2>;
  /** milestoneId → answered correctly? */
  diagnostic: Record<ID, boolean>;
}

export interface CalibrationResult {
  startHereId: ID | null;
  likelyKnown: ID[];
  rationale: string[];
}

export function estimateStart(db: LabDB, courseId: ID, input: CalibrationInput): CalibrationResult {
  const ordered = orderedMilestones(db, courseId);
  const pm = prereqMap(db, courseId);
  const known = new Set<ID>();
  const rationale: string[] = [];
  const passed = Object.entries(input.diagnostic).filter(([, ok]) => ok).map(([id]) => id);
  const failed = Object.entries(input.diagnostic).filter(([, ok]) => !ok).map(([id]) => id);
  const failedUnits = new Set(failed.map((id) => db.milestones[id]?.unitId));

  for (const m of ordered) {
    if (m.masteredAt) {
      known.add(m.id);
      continue;
    }
    const failedHere = failed.some((f) => f === m.id || dependsOn(pm, m.id, f));
    if (failedHere) continue;
    // Passing a later milestone is evidence for everything it depends on.
    const impliedByPass = passed.some((p) => p === m.id || dependsOn(pm, p, m.id));
    const confident = input.selfRatings[m.unitId] === 2 && !failedUnits.has(m.unitId) && m.milestoneType !== "BOSS" && m.milestoneType !== "CHALLENGE";
    if (impliedByPass || confident) known.add(m.id);
  }
  for (const p of passed) rationale.push(L(`You solved a "${db.milestones[p]?.title}" problem, so its prerequisites are probably familiar.`, `"${db.milestones[p]?.title}" sorusunu çözdün; ön koşulları muhtemelen tanıdık.`));
  for (const f of failed) rationale.push(L(`"${db.milestones[f]?.title}" needs work, so the path should go through it.`, `"${db.milestones[f]?.title}" üzerinde çalışmak gerekiyor; yol buradan geçmeli.`));
  for (const [unitId, r] of Object.entries(input.selfRatings)) {
    if (r === 2 && !failedUnits.has(unitId)) rationale.push(L(`You rated "${db.units[unitId]?.title}" as confident.`, `"${db.units[unitId]?.title}" konusunda kendinden emin olduğunu belirttin.`));
  }
  const ready = (m: Milestone) => !known.has(m.id) && m.prerequisites.every((p) => known.has(p));
  // Prefer the frontier leading to a diagnosed gap, then the main path.
  const towardGap = ordered.find((m) => ready(m) && failed.some((f) => f === m.id || dependsOn(pm, f, m.id)));
  const start = towardGap
    ?? ordered.find((m) => m.required && ready(m))
    ?? ordered.find(ready)
    ?? null;
  if (start) rationale.push(L(`Recommended start: "${start.title}". You can always choose a different milestone.`, `Önerilen başlangıç: "${start.title}". İstediğin zaman başka bir adım seçebilirsin.`));
  else rationale.push(L("Everything appears familiar — consider the boss or challenge milestones.", "Her şey tanıdık görünüyor — final ya da meydan okuma adımlarına bakabilirsin."));
  return { startHereId: start?.id ?? null, likelyKnown: [...known].filter((id) => !db.milestones[id].masteredAt), rationale };
}

/** Apply a calibration. Known milestones are only skipped (not mastered) if the user asks. */
export function applyCalibration(db: LabDB, courseId: ID, result: CalibrationResult, skipKnown: boolean) {
  const course = db.courses[courseId];
  course.startHereMilestoneId = result.startHereId ?? undefined;
  if (skipKnown) for (const id of result.likelyKnown) skipMilestone(db, id);
  recomputeStatuses(db, courseId);
}
