/**
 * The learner's observed learning model and insights.
 *
 * Observations are behaviour, never personality: "in sessions with X, first-try
 * accuracy was higher (a% vs b%, n = …, last 90 days)". Each carries its data,
 * time range and sample sizes, and none is stated below the minimum sample.
 * The wording is descriptive, not causal — only a Focus Lab experiment can
 * support a causal claim, and that is reported separately.
 */
import type { LabDB, Millis } from "../domain/types";
import type { KnowledgeGraph } from "../knowledge/schema";
import { domainLabel } from "../knowledge/schema";
import { groupStats, MIN_N, rate, visitRows, GROUP_LABEL, type GroupKey } from "../engines/statistics";
import { L } from "../i18n";
import { dimensionOf, masteryProfile } from "./mastery";

const DAY = 86_400_000;
const pct = (x: number) => `${Math.round(x * 100)}%`;

export interface Observation {
  text: string;
  /** Which variable the observation is about. */
  key: GroupKey | "domain";
  n: number;
  from: Millis;
  to: Millis;
}

const OBS_KEYS: GroupKey[] = ["interaction", "duration", "timeOfDay", "stylus", "feedback", "granularity", "difficulty"];

/** Differences in first-try accuracy and completion between groups, where the data is large enough. */
export function observedPreferences(db: LabDB, now: Millis = Date.now(), days = 90): Observation[] {
  const from = now - days * DAY;
  const rows = visitRows(db).filter((r) => r.openedAt >= from);
  const out: Observation[] = [];
  for (const key of OBS_KEYS) {
    const stats = groupStats(db, rows, key).filter((s) => s.firstTry.value !== null);
    if (stats.length < 2) continue;
    const sorted = [...stats].sort((a, b) => b.firstTry.value! - a.firstTry.value!);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    if (hi.firstTry.value! - lo.firstTry.value! < 0.15) continue;
    out.push({
      key, n: hi.firstTry.n + lo.firstTry.n, from, to: now,
      text: L(
        `${GROUP_LABEL[key]}: first-try accuracy was ${pct(hi.firstTry.value!)} with "${hi.group}" (n=${hi.firstTry.n}) and ${pct(lo.firstTry.value!)} with "${lo.group}" (n=${lo.firstTry.n}), last ${days} days. Observed, not a cause.`,
        `${GROUP_LABEL[key]}: ilk deneme doğruluğu "${hi.group}" ile %${Math.round(hi.firstTry.value! * 100)} (n=${hi.firstTry.n}), "${lo.group}" ile %${Math.round(lo.firstTry.value! * 100)} (n=${lo.firstTry.n}), son ${days} gün. Gözlem; neden değil.`,
      ),
    });
  }
  // Persistence by milestone length: where milestones get abandoned.
  const dur = groupStats(db, rows, "duration").filter((s) => s.completion.value !== null);
  if (dur.length >= 2) {
    const sorted = [...dur].sort((a, b) => b.completion.value! - a.completion.value!);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    if (hi.completion.value! - lo.completion.value! >= 0.2)
      out.push({ key: "duration", n: hi.completion.n + lo.completion.n, from, to: now, text: L(`Milestones that were ${hi.group} were completed ${pct(hi.completion.value!)} of the time (n=${hi.completion.n}); ${lo.group} ones ${pct(lo.completion.value!)} (n=${lo.completion.n}).`, `${hi.group} adımlar %${Math.round(hi.completion.value! * 100)} oranında tamamlandı (n=${hi.completion.n}); ${lo.group} olanlar %${Math.round(lo.completion.value! * 100)} (n=${lo.completion.n}).`) });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Insights: trends within a field, with data, time frame and sample size
// ---------------------------------------------------------------------------

export interface TrendInsight {
  text: string;
  domain: string;
  n: number;
  from: Millis;
  to: Millis;
}

/**
 * For each field with enough recent answers: did first-try accuracy on
 * understanding/problem-solving change between the earlier and the later half,
 * and did transfer move with it? ("conceptual accuracy rose while transfer
 * stayed flat").
 */
export function trendInsights(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now(), days = 90): TrendInsight[] {
  const from = now - days * DAY;
  const byDomain = new Map<string, { at: number; ok: boolean; dim: string }[]>();
  for (const a of Object.values(db.attempts)) {
    if (a.createdAt < from || a.correct === null || a.isRetry) continue;
    const lo = db.milestones[a.milestoneId]?.learningObjectIds?.find((id) => g.objects[id]);
    if (!lo) continue;
    const d = g.objects[lo].domain;
    (byDomain.get(d) ?? byDomain.set(d, []).get(d)!).push({ at: a.createdAt, ok: !!a.correct, dim: dimensionOf(db, a) });
  }
  const out: TrendInsight[] = [];
  for (const [domain, xs] of byDomain) {
    const core = xs.filter((x) => x.dim !== "transfer" && x.dim !== "retention").sort((a, b) => a.at - b.at);
    if (core.length < 12) continue;
    const half = Math.floor(core.length / 2);
    const early = rate(core.slice(0, half).filter((x) => x.ok).length, half);
    const late = rate(core.slice(half).filter((x) => x.ok).length, core.length - half);
    if (early.value === null || late.value === null) continue;
    const delta = late.value - early.value;
    const tr = xs.filter((x) => x.dim === "transfer");
    const trRate = rate(tr.filter((x) => x.ok).length, tr.length);
    const name = domainLabel(domain as never);
    let text: string;
    if (Math.abs(delta) < 0.1) text = L(`${name}: first-try accuracy was steady at about ${pct(late.value)} over your last ${core.length} answers.`, `${name}: son ${core.length} cevabında ilk deneme doğruluğu yaklaşık %${Math.round(late.value * 100)} düzeyinde sabit kaldı.`);
    else text = L(`${name}: first-try accuracy ${delta > 0 ? "rose" : "fell"} from ${pct(early.value)} to ${pct(late.value)} across your last ${core.length} answers.`, `${name}: son ${core.length} cevabında ilk deneme doğruluğu %${Math.round(early.value * 100)}'den %${Math.round(late.value * 100)}'e ${delta > 0 ? "yükseldi" : "düştü"}.`);
    if (trRate.value !== null) text += " " + L(`Transfer success over the same period: ${pct(trRate.value)} (n=${trRate.n}).`, `Aynı dönemde transfer başarısı: %${Math.round(trRate.value * 100)} (n=${trRate.n}).`);
    else if (tr.length) text += " " + L(`Only ${tr.length} transfer answers — not enough to compare.`, `Yalnızca ${tr.length} transfer cevabı var — karşılaştırmaya yetmez.`);
    out.push({ text, domain: name, n: core.length, from, to: now });
  }
  return out.sort((a, b) => b.n - a.n);
}

// ---------------------------------------------------------------------------
// Academic profile: where the learner goes deepest (an observation, not an identity)
// ---------------------------------------------------------------------------

export interface DomainDepth { domain: string; label: string; objects: number; meanVerified: number; deep: number }

export function academicProfile(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now()): DomainDepth[] {
  const map = new Map<string, { n: number; sum: number; deep: number }>();
  for (const id of g.order) {
    const p = masteryProfile(db, id, now);
    if (!p.evidenceCount) continue;
    const d = g.objects[id].domain;
    const e = map.get(d) ?? { n: 0, sum: 0, deep: 0 };
    e.n++;
    e.sum += p.verified;
    if (p.depth >= 3) e.deep++;
    map.set(d, e);
  }
  return [...map]
    .filter(([, e]) => e.n >= 1)
    .map(([d, e]) => ({ domain: d, label: domainLabel(d as never), objects: e.n, meanVerified: e.sum / e.n, deep: e.deep }))
    .sort((a, b) => b.deep - a.deep || b.meanVerified * b.objects - a.meanVerified * a.objects);
}

export const ENOUGH_DATA = MIN_N;
