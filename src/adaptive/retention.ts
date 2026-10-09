/**
 * Adaptive spaced repetition. Lab does not rely on one fixed algorithm: the
 * card scheduler (SM-2) and the topic ladder still set the base interval, but
 * each review's interval and the order of the review queue are adjusted by
 * what is known about the topic — importance and centrality in the graph,
 * previous errors, the learner's confidence, immediate vs delayed accuracy,
 * transfer performance, time since verification, evidence quality and the
 * mastery profile. Important, central or transfer-weak topics come back
 * sooner; well-established ones a little later. Without any signal the factor
 * is exactly 1, so nothing changes for topics Lab knows nothing about.
 */
import type { CardGrade, ID, LabDB, Millis, TopicGrade } from "../domain/types";
import type { KnowledgeGraph } from "../knowledge/schema";
import { L } from "../i18n";
import { evidenceFor, masteryProfile, staleAfterDays } from "./mastery";
import { graphStructure } from "./pathPlanner";
import { dueCards, reviewCard } from "../study/flashcards";
import { dueTopics, reviewTopic } from "../study/topics";

const DAY = 86_400_000;

export interface ReviewPriority {
  loId: string;
  /** 0..1 — higher means review sooner. */
  priority: number;
  /** Multiplier for the next interval (0.5 … 1.3). */
  factor: number;
  factors: Record<string, number>;
  reasons: string[];
}

export function reviewPriority(db: LabDB, g: KnowledgeGraph, loId: string, now: Millis = Date.now()): ReviewPriority {
  const p = masteryProfile(db, loId, now);
  const ev = evidenceFor(db, loId, now);
  const reasons: string[] = [];
  const f: Record<string, number> = {};
  if (g.objects[loId]) {
    const st = graphStructure(g);
    f.importance = (st.descendants.get(loId) ?? 0) / st.maxDesc;
    f.centrality = Math.min(1, (st.unlocks.get(loId) ?? 0) / 6);
    if (f.importance >= 0.3) reasons.push(L("Many topics build on it", "Birçok konu bunun üzerine kurulu"));
    if (f.centrality >= 0.5) reasons.push(L("Central prerequisite", "Merkezi önkoşul"));
  }
  const errs = Object.values(db.errors).filter((e) => (e.trace?.repairLoId === loId || e.loIds.includes(loId)) && now - e.createdAt < 60 * DAY);
  if (errs.length) {
    f.errors = Math.min(1, errs.length / 3);
    reasons.push(L(`${errs.length} errors in the last 60 days`, `Son 60 günde ${errs.length} hata`));
  }
  const confs = Object.values(db.errors).filter((e) => e.loIds.includes(loId) && e.learnerConfidence !== undefined).map((e) => e.learnerConfidence!);
  if (ev.length >= 2) f.confidence = 1 - p.confidence;
  if (confs.length) f.lowConfidence = Math.max(0, (3 - confs.reduce((s, c) => s + c, 0) / confs.length) / 2);
  // Immediate vs delayed accuracy: right when fresh but wrong later means it fades fast.
  const immediate = ev.filter((e) => e.dim !== "retention").map((e) => e.score);
  const delayed = ev.filter((e) => e.dim === "retention").map((e) => e.score);
  if (immediate.length && delayed.length) {
    const gap = immediate.reduce((s, x) => s + x, 0) / immediate.length - delayed.reduce((s, x) => s + x, 0) / delayed.length;
    if (gap > 0) {
      f.forgetting = Math.min(1, gap * 1.5);
      if (gap > 0.25) reasons.push(L("Right when fresh, weaker later", "Tazeyken doğru, sonra zayıf"));
    }
  }
  if (p.dims.transfer.score !== null && p.dims.transfer.score < 0.6) {
    f.transfer = 1 - p.dims.transfer.score;
    reasons.push(L("Weak in transfer", "Transferde zayıf"));
  }
  if (p.lastVerifiedAt !== undefined) f.age = Math.min(1, (now - p.lastVerifiedAt) / DAY / staleAfterDays(p.evidenceCount));
  if (ev.length) {
    const quality = ev.reduce((s, e) => s + e.weight, 0) / ev.length;
    if (quality < 0.8) f.assisted = 1 - quality;
  }
  if (ev.length) f.gap = 1 - p.verified;

  const W: Record<string, number> = { importance: 0.15, centrality: 0.1, errors: 0.2, confidence: 0.05, lowConfidence: 0.05, forgetting: 0.15, transfer: 0.1, age: 0.1, assisted: 0.05, gap: 0.15 };
  const keys = Object.keys(f);
  const priority = keys.length ? Math.min(1, keys.reduce((s, k) => s + f[k] * W[k], 0) / 0.6) : 0;
  // Strong, settled topics stretch a little; important or weak ones come back sooner. No signal → exactly 1.
  const factor = keys.length ? Math.max(0.5, Math.min(1.3, 1.2 - 0.7 * priority)) : 1;
  return { loId, priority, factor: Math.round(factor * 100) / 100, factors: f, reasons };
}

/** Topic review with an adaptive interval. */
export function adaptiveReviewTopic(db: LabDB, g: KnowledgeGraph, loId: string, grade: TopicGrade, now: Millis = Date.now()) {
  const pr = reviewPriority(db, g, loId, now);
  return reviewTopic(db, loId, grade, now, pr.factor);
}

/** Card review: SM-2 sets the base, the topic's priority scales the next interval. */
export function adaptiveReviewCard(db: LabDB, g: KnowledgeGraph, id: ID, grade: CardGrade, ms?: number, now: Millis = Date.now()) {
  const c = reviewCard(db, id, grade, ms, now);
  if (!c || !c.loId || grade === 0) return c;
  const pr = reviewPriority(db, g, c.loId, now);
  if (pr.factor !== 1) {
    c.due = now + Math.max(10 * 60_000, (c.due - now) * pr.factor);
    c.intervalDays = Math.max(c.intervalDays * pr.factor, 0.007);
  }
  return c;
}

/** Due topics, most important first. */
export function prioritizedDueTopics(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now()) {
  return dueTopics(db, now)
    .map((r) => ({ r, p: reviewPriority(db, g, r.id, now) }))
    .sort((a, b) => b.p.priority - a.p.priority || a.r.due - b.r.due)
    .map((x) => x.r);
}

/** Due cards, cards of high-priority topics first. */
export function prioritizedDueCards(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now()) {
  const cache = new Map<string, number>();
  const pr = (lo?: string) => (lo ? (cache.get(lo) ?? (cache.set(lo, reviewPriority(db, g, lo, now).priority), cache.get(lo)!)) : 0);
  return dueCards(db, now).sort((a, b) => pr(b.loId) - pr(a.loId) || a.due - b.due);
}
