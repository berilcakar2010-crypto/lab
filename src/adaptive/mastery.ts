/**
 * Mastery profiles: mastery is no longer only "mastered / not mastered".
 *
 * For every knowledge-graph object (or a milestone without a graph link) the
 * profile scores seven dimensions — recall, understanding, application,
 * problem solving, transfer, explanation and delayed retention — from the
 * evidence Lab has actually recorded: answers, explanations, card and topic
 * reviews, retention checks and predictions. Nothing is invented: a dimension
 * without evidence has no score.
 *
 * Help lowers the value of evidence (a hint-free answer counts fully, an
 * answer after the full solution counts for nothing), and the learner's own
 * "I know this" is kept apart as `selfDeclared` — it is never verified mastery.
 * Profiles are derived and cached per database state, so they stay in step
 * with the raw records and cost nothing on re-render.
 */
import type { Attempt, InteractionType, LabDB, Millis, Milestone } from "../domain/types";
import { MASTERY_DIMENSIONS, type DimensionScore, type MasteryDimension, type MasteryProfile, type RetentionStatus } from "../domain/adaptive";
import { L } from "../i18n";

const DAY = 86_400_000;

/** Evidence value by hint level 0..5: a full solution (5) is not evidence of mastery. */
export const HINT_WEIGHT = [1, 0.85, 0.7, 0.55, 0.35, 0] as const;

const DIM_FOR_KIND: Partial<Record<InteractionType, MasteryDimension>> = {
  MULTIPLE_CHOICE: "recall",
  CLASSIFICATION: "recall",
  ORDERING: "recall",
  CONCEPT_EXPLANATION: "understanding",
  EXPLANATION: "understanding",
  PREDICTION: "understanding",
  COMPARISON: "understanding",
  GRAPH_INTERPRETATION: "understanding",
  FREE_RESPONSE: "understanding",
  NUMERIC: "problemSolving",
  EQUATION: "problemSolving",
  PROBLEM_SOLVING: "problemSolving",
  DERIVATION: "problemSolving",
  PROOF: "problemSolving",
  SIMULATION: "application",
  DIAGRAM: "application",
  DRAWING: "application",
  CODE: "application",
};

const APPLIED_TYPES = new Set(["APPLICATION", "PROJECT", "EXPERIMENT"]);

export const DIMENSION_LABEL = (d: MasteryDimension): string =>
  ({
    recall: L("Recall", "Hatırlama"),
    understanding: L("Understanding", "Kavrayış"),
    application: L("Application", "Uygulama"),
    problemSolving: L("Problem solving", "Problem çözme"),
    transfer: L("Transfer", "Transfer"),
    explanation: L("Explanation", "Açıklama"),
    retention: L("Delayed retention", "Gecikmeli kalıcılık"),
  })[d];

export const RETENTION_LABEL = (s: RetentionStatus): string =>
  ({ FRESH: L("Fresh", "Taze"), FADING: L("Fading", "Soluyor"), STALE: L("Stale", "Bayatladı"), UNKNOWN: L("No evidence", "Kanıt yok") })[s];

export interface EvidenceItem {
  key: string;
  dim: MasteryDimension;
  /** 0..1 */
  score: number;
  /** Evidence weight after assistance/quality discounts. */
  weight: number;
  at: Millis;
  source: "attempt" | "explanation" | "card" | "topicReview" | "prediction" | "check" | "sandbox";
  ref: string;
}

export const milestoneKey = (m: Milestone): string[] => (m.learningObjectIds?.length ? m.learningObjectIds : [`ms:${m.id}`]);

/** Which dimension an answer is evidence for. */
export function dimensionOf(db: LabDB, a: Attempt): MasteryDimension {
  if (a.purpose === "TRANSFER") return "transfer";
  if (a.purpose === "RETENTION") {
    const check = Object.values(db.retention).find((r) => r.attemptId === a.id);
    return check?.kind === "TRANSFER" ? "transfer" : "retention";
  }
  const q = db.questions[a.questionId];
  const m = db.milestones[a.milestoneId];
  const dim = (q && DIM_FOR_KIND[q.kind]) ?? "understanding";
  return dim === "problemSolving" && m && APPLIED_TYPES.has(m.milestoneType) ? "application" : dim;
}

function collect(db: LabDB): Map<string, EvidenceItem[]> {
  const out = new Map<string, EvidenceItem[]>();
  const push = (keys: string[], e: Omit<EvidenceItem, "key">) => {
    if (e.weight <= 0) return;
    for (const key of keys) {
      if (!out.has(key)) out.set(key, []);
      out.get(key)!.push({ ...e, key });
    }
  };
  for (const a of Object.values(db.attempts)) {
    const m = db.milestones[a.milestoneId];
    if (!m || a.correct === null) continue;
    const w = HINT_WEIGHT[Math.max(0, Math.min(5, a.hintLevelUsed ?? 0))] * (a.evaluatedBy === "self" ? 0.7 : 1);
    push(milestoneKey(m), { dim: dimensionOf(db, a), score: a.correct ? Math.max(0, Math.min(1, a.score ?? 1)) : Math.min(0.3, a.score ?? 0), weight: w, at: a.createdAt, source: "attempt", ref: a.id });
  }
  for (const e of Object.values(db.explanations)) {
    if (!e.loId || !e.evaluation) continue;
    push([e.loId], { dim: "explanation", score: e.evaluation.score, weight: e.evaluation.by === "ai" ? 1 : 0.6, at: e.evaluation.at, source: "explanation", ref: e.id });
  }
  for (const c of Object.values(db.flashcards)) {
    if (!c.loId) continue;
    for (const h of c.history) push([c.loId], { dim: "recall", score: [0, 0.5, 0.85, 1][h.grade], weight: 0.5, at: h.at, source: "card", ref: c.id });
  }
  for (const r of Object.values(db.topicReviews)) {
    for (const h of r.history) {
      if (h.kind !== "review" || h.grade === undefined) continue;
      push([r.id], { dim: "retention", score: [0, 0.5, 0.85, 1][h.grade], weight: 0.8, at: h.at, source: "topicReview", ref: r.id });
    }
  }
  for (const p of Object.values(db.predictions)) {
    push(p.loIds, { dim: "understanding", score: p.correct ? 1 : 0, weight: 0.6, at: p.createdAt, source: "prediction", ref: p.id });
    if (p.explanationScore !== undefined) push(p.loIds, { dim: "explanation", score: p.explanationScore, weight: 0.5, at: p.createdAt, source: "prediction", ref: p.id });
  }
  // Open answers in knowledge checks (auto-graded items are ordinary attempts, counted above).
  for (const c of Object.values(db.checks ?? {})) {
    const ms = c.target.milestoneId ? db.milestones[c.target.milestoneId] : undefined;
    for (const it of c.items) {
      if (it.kind !== "open" || it.by === "none") continue;
      const keys = it.loId ? [it.loId] : c.target.loId ? [c.target.loId] : ms ? milestoneKey(ms) : [];
      push(keys, { dim: "understanding", score: it.score, weight: it.by === "ai" ? 0.9 : 0.5, at: c.createdAt, source: "check", ref: c.id });
    }
  }
  // Sandbox runs the learner saved as evidence, with their own interpretation: applying the idea in a model.
  for (const r of Object.values(db.sandboxRuns ?? {})) {
    if (!r.evidence || !r.loIds.length) continue;
    push(r.loIds, { dim: "application", score: r.evidence.note.trim().length >= 40 ? 0.8 : 0.6, weight: 0.5, at: r.evidence.savedAt, source: "sandbox", ref: r.id });
  }
  for (const list of out.values()) list.sort((a, b) => a.at - b.at);
  return out;
}

const PRIOR = 1;
/** Older evidence counts less (half-life ~ 120 days, never below a quarter). */
const recency = (at: Millis, now: Millis) => Math.max(0.25, Math.pow(0.5, Math.max(0, now - at) / (120 * DAY)));

function dimScore(items: EvidenceItem[], now: Millis): DimensionScore {
  if (!items.length) return { score: null, n: 0, weight: 0 };
  let sw = 0, sws = 0;
  for (const e of items) {
    const w = e.weight * recency(e.at, now);
    sw += w;
    sws += w * e.score;
  }
  // Shrink toward 0.5 so one lucky answer is not "mastery".
  return { score: (sws + 0.5 * PRIOR) / (sw + PRIOR), n: items.length, weight: sw, lastAt: items[items.length - 1].at };
}

function selfDeclaredFor(db: LabDB, key: string): number {
  if (key.startsWith("ms:")) return db.mastery[Object.keys(db.mastery).find((id) => db.mastery[id].milestoneId === key.slice(3)) ?? ""]?.selfAttested ? 0.8 : 0;
  if (db.knowledge.selfAttested[key]) return 0.9;
  const selfMs = Object.values(db.mastery).some((r) => r.selfAttested && db.milestones[r.milestoneId]?.learningObjectIds?.includes(key));
  return selfMs ? 0.8 : 0;
}

/** Days after which unverified mastery is considered stale; more evidence keeps it longer. */
export function staleAfterDays(evidenceCount: number): number {
  return Math.min(120, Math.round(21 * (1 + Math.log2(1 + evidenceCount))));
}

export function buildProfile(db: LabDB, key: string, items: EvidenceItem[], now: Millis = Date.now()): MasteryProfile {
  const dims = {} as Record<MasteryDimension, DimensionScore>;
  for (const d of MASTERY_DIMENSIONS) dims[d] = dimScore(items.filter((e) => e.dim === d), now);
  const present = MASTERY_DIMENSIONS.filter((d) => dims[d].score !== null);
  const totalW = present.reduce((s, d) => s + dims[d].weight, 0);
  const raw = present.length ? present.reduce((s, d) => s + dims[d].score! * Math.min(3, dims[d].weight), 0) / present.reduce((s, d) => s + Math.min(3, dims[d].weight), 0) : 0;
  const confidence = totalW / (totalW + 1.5);
  const verified = present.length ? raw * (0.5 + 0.5 * confidence) : 0;
  const lastVerifiedAt = items.length ? items[items.length - 1].at : undefined;
  const recent = items.slice(-5);
  const recentPerformance = recent.length ? recent.reduce((s, e) => s + e.score, 0) / recent.length : null;

  let retentionStatus: RetentionStatus = "UNKNOWN";
  if (lastVerifiedAt !== undefined) {
    const age = (now - lastVerifiedAt) / DAY;
    const limit = staleAfterDays(items.length);
    const lastRet = [...items].reverse().find((e) => e.dim === "retention" || e.dim === "transfer");
    if (age > limit || (lastRet && lastRet.score < 0.4 && lastRet.at === lastVerifiedAt)) retentionStatus = "STALE";
    else if (age > limit * 0.6 || (recentPerformance !== null && recentPerformance < 0.5)) retentionStatus = "FADING";
    else retentionStatus = "FRESH";
  }
  const depth = MASTERY_DIMENSIONS.filter((d) => (dims[d].score ?? 0) >= 0.7).length;
  return {
    key,
    dims,
    verified,
    selfDeclared: selfDeclaredFor(db, key),
    lastVerifiedAt,
    evidenceCount: items.length,
    recentPerformance,
    retentionStatus,
    confidence,
    depth,
  };
}

// Cache per database object. Some writes mutate the object in place, so a
// cheap signature of the evidence-bearing records is checked too.
const cache = new WeakMap<LabDB, { sig: string; now: number; evidence: Map<string, EvidenceItem[]>; profiles: Map<string, MasteryProfile> }>();

const signature = (db: LabDB) =>
  [db.events.length, db.events[db.events.length - 1]?.id ?? "", Object.keys(db.attempts).length, Object.keys(db.explanations).length,
    Object.values(db.explanations).filter((e) => e.evaluation).length, Object.keys(db.predictions).length, Object.keys(db.knowledge.selfAttested).length, Object.keys(db.checks ?? {}).length,
    Object.values(db.sandboxRuns ?? {}).filter((r) => r.evidence).length].join("|");

function entry(db: LabDB, now: Millis) {
  let c = cache.get(db);
  const sig = signature(db);
  // Recompute when the records changed or the clock moved by more than an hour (staleness depends on time).
  if (!c || c.sig !== sig || Math.abs(now - c.now) > 3600_000) {
    c = { sig, now, evidence: collect(db), profiles: new Map() };
    cache.set(db, c);
  }
  return c;
}

export function evidenceFor(db: LabDB, key: string, now: Millis = Date.now()): EvidenceItem[] {
  return entry(db, now).evidence.get(key) ?? [];
}

export function masteryProfile(db: LabDB, key: string, now: Millis = Date.now()): MasteryProfile {
  const c = entry(db, now);
  let p = c.profiles.get(key);
  if (!p) {
    p = buildProfile(db, key, c.evidence.get(key) ?? [], now);
    c.profiles.set(key, p);
  }
  return p;
}

/** Profiles for every object with evidence or a self-declaration. */
export function allProfiles(db: LabDB, now: Millis = Date.now()): MasteryProfile[] {
  const keys = new Set([...entry(db, now).evidence.keys(), ...Object.keys(db.knowledge.selfAttested)]);
  return [...keys].map((k) => masteryProfile(db, k, now));
}

/** Verified mastery of a graph object (0..1). */
export const verifiedOf = (db: LabDB, loId: string, now: Millis = Date.now()) => masteryProfile(db, loId, now).verified;

/** Objects whose mastery was once verified but has gone stale or is fading. */
export function staleObjects(db: LabDB, now: Millis = Date.now()): MasteryProfile[] {
  return allProfiles(db, now).filter((p) => p.evidenceCount > 0 && p.verified >= 0.4 && (p.retentionStatus === "STALE" || p.retentionStatus === "FADING"));
}

/** What a stale profile calls for: a review, a delayed recall or a transfer problem. */
export function staleRemedy(p: MasteryProfile): "review" | "delayedRecall" | "transfer" | null {
  if (p.retentionStatus !== "STALE" && p.retentionStatus !== "FADING") return null;
  if ((p.dims.transfer.score ?? 1) < 0.5 && (p.dims.understanding.score ?? 0) >= 0.7) return "transfer";
  if (p.dims.retention.n === 0) return "delayedRecall";
  return "review";
}

/** A short sentence for gaps like "knows it but cannot apply it to new problems". */
export function profileGap(p: MasteryProfile): string | null {
  const s = (d: MasteryDimension) => p.dims[d].score;
  const know = Math.max(s("understanding") ?? 0, s("recall") ?? 0);
  if (know >= 0.75 && (s("transfer") ?? 1) < 0.5) return L("You know it but have trouble applying it to new problems (transfer).", "Konuyu biliyorsun ama yeni problemlere uygulamakta zorlanıyorsun (transfer).");
  if (know >= 0.75 && (s("problemSolving") ?? 1) < 0.5) return L("You understand it; solving problems with it is the weak spot.", "Konuyu anlıyorsun; onunla problem çözmek zayıf nokta.");
  if ((s("problemSolving") ?? 0) >= 0.75 && (s("explanation") ?? 1) < 0.5) return L("You can solve it but explaining why is weaker.", "Çözebiliyorsun ama nedenini açıklamak daha zayıf.");
  if (p.selfDeclared >= 0.8 && p.verified < 0.5) return L("You said you know this, but there is little verified evidence yet.", "Bunu bildiğini söyledin ama henüz az doğrulanmış kanıt var.");
  return null;
}
