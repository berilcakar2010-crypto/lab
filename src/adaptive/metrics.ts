/**
 * Learning analytics, derived only from raw events and raw records — no
 * stored dashboard numbers. Engagement, learning and retention are separate
 * layers and never stand in for one another ("you studied a lot, so you
 * learned well" is never said). Every rate carries its sample size and is
 * withheld below a minimum, and comparisons are worded as observations, not
 * causes; questions of cause go to the experiments in Focus Lab.
 */
import type { AnalyticsEvent, LabDB, Millis } from "../domain/types";
import { MASTERY_DIMENSIONS } from "../domain/adaptive";
import { computeSessionTimes } from "../engines/analytics";
import { rate, type Rate } from "../engines/statistics";
import { L } from "../i18n";
import { allProfiles } from "./mastery";
import { ERROR_LABEL } from "./errors";
import { studyLog, dayKey } from "../study/topics";

const DAY = 86_400_000;

export type Level = "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT";
export const LEVEL_LABEL = (l: Level) => ({ HIGH: L("High", "Yüksek"), MEDIUM: L("Medium", "Orta"), LOW: L("Low", "Düşük"), INSUFFICIENT: L("Not enough data", "Yetersiz veri") })[l];

export interface Num { value: number | null; n: number }
const num = (value: number | null, n: number): Num => ({ value: n ? value : null, n });
const median = (xs: number[]) => (xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] : null);

export interface LearningMetrics {
  window: { from: Millis; to: Millis; sessions: number };
  productivity: { activeMinutes: Num; milestonesPerHour: Num; questionsPerSession: Num; attemptsPerSession: Num };
  persistence: { retryRate: Rate; abandonmentRate: Rate; continuationRate: Rate; stuckPerSession: Num };
  learning: { immediateAccuracy: Rate; masteryGain: Num; errorReduction: Num; transferSuccess: Rate };
  retention: { delayedRecall: Rate; retentionDecay: Num; reviewEffectiveness: Rate };
  engagement: { medianSessionMinutes: Num; interactionDensity: Num; /** Days with any study in the window — a description of activity, never a streak to keep. */ activeDays: number; stylusShare: Rate; interruptionsPerSession: Num };
  depth: Record<(typeof MASTERY_DIMENSIONS)[number], Num> & { breadth: number; meanDepth: Num };
  subject: { strongest?: string; weakest?: string; strongestMilestoneType?: string; mostCommonError?: string; highestRetention?: string; highestTransfer?: string };
  layers: { engagement: Level; learning: Level; retention: Level };
  summary: string[];
}

export function learningMetrics(db: LabDB, opts: { now?: Millis; days?: number } = {}): LearningMetrics {
  const now = opts.now ?? Date.now();
  const from = now - (opts.days ?? 30) * DAY;
  const ev = db.events.filter((e) => e.at >= from && e.at <= now);
  const of = (t: AnalyticsEvent["type"]) => ev.filter((e) => e.type === t);
  const sessions = [...new Set(ev.map((e) => e.sessionId).filter(Boolean))] as string[];
  const times = sessions.map((s) => computeSessionTimes(db.events.filter((e) => e.sessionId === s), now)).filter(Boolean) as NonNullable<ReturnType<typeof computeSessionTimes>>[];
  const activeMs = times.reduce((s, t) => s + t.activeMs, 0);
  const atts = Object.values(db.attempts).filter((a) => a.createdAt >= from && a.createdAt <= now && a.correct !== null);

  // Productivity
  const completed = of("MILESTONE_COMPLETE").length;
  const productivity = {
    activeMinutes: num(activeMs / 60_000, sessions.length),
    milestonesPerHour: num(activeMs > 0 ? completed / (activeMs / 3_600_000) : null, activeMs > 0 ? completed : 0),
    questionsPerSession: num(sessions.length ? of("QUESTION_SHOWN").length / sessions.length : null, sessions.length),
    attemptsPerSession: num(sessions.length ? of("ATTEMPT").length / sessions.length : null, sessions.length),
  };

  // Persistence
  const decisions = of("CONTINUE_DECISION");
  const persistence = {
    retryRate: rate(of("RETRY").length, of("ATTEMPT").length),
    abandonmentRate: rate(of("MILESTONE_ABANDON").length, of("MILESTONE_OPEN").length),
    continuationRate: rate(decisions.filter((e) => e.data.continued === true).length, decisions.length),
    stuckPerSession: num(sessions.length ? of("STUCK_DETECTED").length / sessions.length : null, sessions.length),
  };

  // Learning (within sessions)
  const first = atts.filter((a) => a.attemptNumber === 1 && a.purpose !== "RETENTION" && a.purpose !== "TRANSFER");
  const half = (from + now) / 2;
  const errRate = (xs: typeof atts) => (xs.length ? xs.filter((a) => !a.correct).length / xs.length : null);
  const early = atts.filter((a) => a.createdAt < half), late = atts.filter((a) => a.createdAt >= half);
  const er1 = errRate(early), er2 = errRate(late);
  const transfer = atts.filter((a) => a.purpose === "TRANSFER");
  const learning = {
    immediateAccuracy: rate(first.filter((a) => a.correct).length, first.length),
    masteryGain: num(Object.values(db.mastery).filter((m) => !m.selfAttested && m.achievedAt >= from && m.achievedAt <= now).length, sessions.length || atts.length),
    errorReduction: num(er1 !== null && er2 !== null && early.length >= 5 && late.length >= 5 ? er1 - er2 : null, Math.min(early.length, late.length)),
    transferSuccess: rate(transfer.filter((a) => a.correct).length, transfer.length),
  };

  // Retention (later)
  const delayed = atts.filter((a) => a.purpose === "RETENTION");
  const topicReviews = Object.values(db.topicReviews).flatMap((r) => r.history.filter((h) => h.kind === "review" && h.at >= from && h.at <= now && h.grade !== undefined));
  const delayedK = delayed.filter((a) => a.correct).length + topicReviews.filter((h) => h.grade! >= 2).length;
  const delayedN = delayed.length + topicReviews.length;
  const delayedRecall = rate(delayedK, delayedN);
  const reviewed = Object.values(db.topicReviews).filter((r) => r.history.filter((h) => h.kind === "review").length >= 2);
  const improved = reviewed.filter((r) => {
    const g = r.history.filter((h) => h.kind === "review").map((h) => h.grade ?? 0);
    return g[g.length - 1] >= g[g.length - 2];
  });
  const retention = {
    delayedRecall,
    retentionDecay: num(learning.immediateAccuracy.value !== null && delayedRecall.value !== null ? learning.immediateAccuracy.value - delayedRecall.value : null, Math.min(first.length, delayedN)),
    reviewEffectiveness: rate(improved.length, reviewed.length),
  };

  // Engagement (activity, never evidence of learning)
  const mins = times.map((t) => t.activeMs / 60_000);
  const engagement = {
    medianSessionMinutes: num(median(mins), mins.length),
    interactionDensity: num(activeMs > 0 ? ev.filter((e) => e.type !== "ACTIVITY_TICK").length / (activeMs / 60_000) : null, activeMs > 0 ? ev.length : 0),
    activeDays: studyLog(db).filter((d) => d.day >= dayKey(from) && d.day <= dayKey(now)).length,
    stylusShare: rate(atts.filter((a) => a.usedStylus).length, atts.length),
    interruptionsPerSession: num(times.length ? times.reduce((s, t) => s + t.interruptions, 0) / times.length : null, times.length),
  };

  // Depth (verified evidence only)
  const profiles = allProfiles(db, now).filter((p) => p.evidenceCount > 0);
  const depth = Object.fromEntries(MASTERY_DIMENSIONS.map((d) => {
    const with_ = profiles.filter((p) => p.dims[d].n > 0);
    return [d, num(with_.length ? with_.filter((p) => (p.dims[d].score ?? 0) >= 0.7).length / with_.length : null, with_.length)];
  })) as unknown as LearningMetrics["depth"];
  depth.breadth = profiles.filter((p) => p.verified >= 0.6).length;
  depth.meanDepth = num(profiles.length ? profiles.reduce((s, p) => s + p.depth, 0) / profiles.length : null, profiles.length);

  // Subjects
  const bySubject = new Map<string, { k: number; n: number; dk: number; dn: number; tk: number; tn: number }>();
  for (const a of atts) {
    const m = db.milestones[a.milestoneId];
    const s = m ? db.subjects[m.subjectId]?.name : undefined;
    if (!s) continue;
    const x = bySubject.get(s) ?? { k: 0, n: 0, dk: 0, dn: 0, tk: 0, tn: 0 };
    if (a.purpose === "RETENTION") { x.dn++; if (a.correct) x.dk++; } else if (a.purpose === "TRANSFER") { x.tn++; if (a.correct) x.tk++; } else { x.n++; if (a.correct) x.k++; }
    bySubject.set(s, x);
  }
  const best = (f: (x: { k: number; n: number; dk: number; dn: number; tk: number; tn: number }) => [number, number], dir: 1 | -1) =>
    [...bySubject.entries()].map(([s, x]) => ({ s, r: f(x) })).filter((y) => y.r[1] >= 5).sort((a, b) => dir * (b.r[0] / b.r[1] - a.r[0] / a.r[1]))[0]?.s;
  const types = new Map<string, { k: number; n: number }>();
  for (const e of of("ATTEMPT")) {
    const t = String(e.data.milestoneType ?? "");
    if (!t || e.data.correct === null) continue;
    const x = types.get(t) ?? { k: 0, n: 0 };
    x.n++;
    if (e.data.correct) x.k++;
    types.set(t, x);
  }
  const errCount = new Map<string, number>();
  for (const e of Object.values(db.errors)) if (e.createdAt >= from && e.createdAt <= now) errCount.set(e.category, (errCount.get(e.category) ?? 0) + 1);
  const topErr = [...errCount.entries()].sort((a, b) => b[1] - a[1])[0];
  const subject = {
    strongest: best((x) => [x.k, x.n], 1),
    weakest: best((x) => [x.k, x.n], -1),
    strongestMilestoneType: [...types.entries()].filter(([, x]) => x.n >= 5).sort((a, b) => b[1].k / b[1].n - a[1].k / a[1].n)[0]?.[0],
    mostCommonError: topErr ? ERROR_LABEL(topErr[0] as never) : undefined,
    highestRetention: best((x) => [x.dk, x.dn], 1),
    highestTransfer: best((x) => [x.tk, x.tn], 1),
  };

  // Three separate layers.
  const perWeek = sessions.length / Math.max(1, (now - from) / (7 * DAY));
  const engagementLevel: Level = sessions.length < 3 ? "INSUFFICIENT" : perWeek >= 4 && (median(mins) ?? 0) >= 15 ? "HIGH" : perWeek >= 2 ? "MEDIUM" : "LOW";
  const acc = learning.immediateAccuracy.value;
  const learningLevel: Level = acc === null ? "INSUFFICIENT" : acc >= 0.75 ? "HIGH" : acc >= 0.5 ? "MEDIUM" : "LOW";
  const ret = delayedRecall.value;
  const retentionLevel: Level = ret === null ? "INSUFFICIENT" : ret >= 0.75 ? "HIGH" : ret >= 0.5 ? "MEDIUM" : "LOW";

  const summary: string[] = [];
  summary.push(L("Engagement, learning and retention are measured separately; one does not imply another.", "Katılım, öğrenme ve kalıcılık ayrı ölçülür; biri diğerini göstermez."));
  if (engagementLevel === "HIGH" && retentionLevel === "LOW") summary.push(L("You were very active, but less of it was kept later. Spaced reviews may help — this is an observation, not a cause.", "Çok aktiftin ama sonradan daha azı korundu. Aralıklı tekrar yardımcı olabilir — bu bir gözlem, neden değil."));
  if (stylusComparison(atts)) summary.push(stylusComparison(atts)!);
  return {
    window: { from, to: now, sessions: sessions.length },
    productivity, persistence, learning, retention, engagement, depth, subject,
    layers: { engagement: engagementLevel, learning: learningLevel, retention: retentionLevel },
    summary,
  };
}

/** An observational comparison, phrased without causality. */
function stylusComparison(atts: LabDB["attempts"][string][]): string | null {
  const firsts = atts.filter((a) => a.attemptNumber === 1);
  const pen = firsts.filter((a) => a.usedStylus), other = firsts.filter((a) => !a.usedStylus);
  if (pen.length < 8 || other.length < 8) return null;
  const p = pen.filter((a) => a.correct).length / pen.length, o = other.filter((a) => a.correct).length / other.length;
  if (Math.abs(p - o) < 0.1) return null;
  return L(
    `Measured first-try accuracy was ${p > o ? "higher" : "lower"} in answers written with a stylus (${Math.round(p * 100)}% vs ${Math.round(o * 100)}%). This does not show that the stylus causes it; Focus Lab can test it with an experiment.`,
    `Kalemle yazılan cevaplarda ölçülen ilk deneme doğruluğu ${p > o ? "daha yüksekti" : "daha düşüktü"} (%${Math.round(p * 100)} / %${Math.round(o * 100)}). Bu, kalemin buna neden olduğunu göstermez; Odak Lab bunu bir deneyle sınayabilir.`,
  );
}

/** Words that must never appear in an observational summary. */
export const CAUSAL_WORDS = /(\bimproves?\b|increases learning|\bleads to\b|artırıyor|artırır|sayesinde)/i;
