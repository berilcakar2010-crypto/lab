/**
 * Depth of mastery, built on the mastery profile:
 *
 *  - eight depth levels, from "I have seen it" to "I can use it independently
 *    in research", each tied to concrete evidence;
 *  - the state of the claim: self-declared, observed, verified or stale;
 *  - exam mastery and research mastery kept apart (a topic can be one without
 *    the other);
 *  - the learner's own confidence and how well it matches results;
 *  - an audit of the latest change ("0.62 → 0.71 because of …").
 *
 * Everything is derived from stored records; nothing is estimated without evidence.
 */
import type { LabDB, Millis } from "../domain/types";
import type { MasteryProfile } from "../domain/adaptive";
import { L } from "../i18n";
import { buildProfile, evidenceFor, masteryProfile, type EvidenceItem } from "./mastery";

export const DEPTH_LEVELS = ["SEEN", "REMEMBER", "UNDERSTAND", "SOLVE", "EXPLAIN", "TRANSFER", "MODEL", "RESEARCH"] as const;
export type DepthLevel = (typeof DEPTH_LEVELS)[number];

export const DEPTH_LABEL = (d: DepthLevel): string =>
  ({
    SEEN: L("I have seen it", "Gördüm"),
    REMEMBER: L("I remember it", "Hatırlıyorum"),
    UNDERSTAND: L("I understand it", "Anlıyorum"),
    SOLVE: L("I can solve with it", "Onunla problem çözebiliyorum"),
    EXPLAIN: L("I can explain it", "Açıklayabiliyorum"),
    TRANSFER: L("I can use it somewhere new", "Yeni bir yerde kullanabiliyorum"),
    MODEL: L("I can derive or model with it", "Onunla türetebiliyor / modelleyebiliyorum"),
    RESEARCH: L("I can use it in research", "Araştırmada kullanabiliyorum"),
  })[d];

export const DEPTH_EVIDENCE = (d: DepthLevel): string =>
  ({
    SEEN: L("opened, reviewed or attempted once", "en az bir kez açıldı, tekrar edildi ya da denendi"),
    REMEMBER: L("recall or delayed review ≥ 60%", "hatırlama ya da gecikmeli tekrar ≥ %60"),
    UNDERSTAND: L("understanding questions ≥ 60%", "kavrayış soruları ≥ %60"),
    SOLVE: L("problems solved ≥ 60%", "çözülen problemler ≥ %60"),
    EXPLAIN: L("an explanation judged ≥ 60%", "≥ %60 değerlendirilen bir açıklama"),
    TRANSFER: L("transfer problems ≥ 60%", "transfer problemleri ≥ %60"),
    MODEL: L("application ≥ 70% plus a derivation, proof or saved simulation", "uygulama ≥ %70 ve bir türetme, ispat ya da kaydedilmiş simülasyon"),
    RESEARCH: L("a research project or result that uses it", "onu kullanan bir araştırma projesi ya da sonucu"),
  })[d];

const ok = (p: MasteryProfile, d: keyof MasteryProfile["dims"], t = 0.6) => (p.dims[d].score ?? 0) >= t && p.dims[d].n > 0;

export interface DepthReport {
  /** Levels with evidence. */
  reached: DepthLevel[];
  /** Highest level reached, or null when nothing is recorded. */
  top: DepthLevel | null;
  /** The next level not yet reached, with what would show it. */
  next?: { level: DepthLevel; needs: string };
}

export function depthReport(db: LabDB, loId: string, now: Millis = Date.now()): DepthReport {
  const p = masteryProfile(db, loId, now);
  const touched = p.evidenceCount > 0 || db.events.some((e) => e.loIds?.includes(loId) && (e.type === "MILESTONE_OPEN" || e.type === "TOPIC_REVIEW" || e.type === "KNOWLEDGE_CHECK"));
  const modelled =
    Object.values(db.sandboxRuns).some((r) => r.evidence && r.loIds.includes(loId)) ||
    Object.values(db.artifacts).some((a) => a.loIds.includes(loId) && (a.kind === "DERIVATION" || a.kind === "PROOF" || a.kind === "SIMULATION")) ||
    Object.values(db.attempts).some((a) => a.correct && ["DERIVATION", "PROOF"].includes(db.questions[a.questionId]?.kind ?? "") && db.milestones[a.milestoneId]?.learningObjectIds?.includes(loId));
  const researched =
    Object.values(db.research).some((r) => r.loIds.includes(loId) && (r.steps.RESULT?.doneAt || r.status === "DONE")) ||
    Object.values(db.artifacts).some((a) => a.loIds.includes(loId) && (a.kind === "RESULT" || a.kind === "PAPER"));
  const has: Record<DepthLevel, boolean> = {
    SEEN: touched,
    REMEMBER: ok(p, "recall") || ok(p, "retention"),
    UNDERSTAND: ok(p, "understanding"),
    SOLVE: ok(p, "problemSolving"),
    EXPLAIN: ok(p, "explanation"),
    TRANSFER: ok(p, "transfer"),
    MODEL: ok(p, "application", 0.7) && modelled,
    RESEARCH: researched,
  };
  const reached = DEPTH_LEVELS.filter((d) => has[d]);
  const missing = DEPTH_LEVELS.find((d) => !has[d]);
  return { reached, top: reached.length ? reached[reached.length - 1] : null, next: missing ? { level: missing, needs: DEPTH_EVIDENCE(missing) } : undefined };
}

// ---------------------------------------------------------------------------
// State of the claim
// ---------------------------------------------------------------------------

export type MasteryState = "NONE" | "SELF_DECLARED" | "OBSERVED" | "VERIFIED" | "STALE";

export const MASTERY_STATE_LABEL = (s: MasteryState): string =>
  ({ NONE: L("No evidence", "Kanıt yok"), SELF_DECLARED: L("Self-declared", "Kendi beyanı"), OBSERVED: L("Observed", "Gözlendi"), VERIFIED: L("Verified", "Doğrulandı"), STALE: L("Stale", "Bayatladı") })[s];

export function masteryState(p: MasteryProfile): MasteryState {
  if (p.evidenceCount > 0 && p.retentionStatus === "STALE") return "STALE";
  if (p.verified >= 0.6 && p.confidence >= 0.5) return "VERIFIED";
  if (p.evidenceCount > 0) return "OBSERVED";
  if (p.selfDeclared > 0) return "SELF_DECLARED";
  return "NONE";
}

// ---------------------------------------------------------------------------
// Exam mastery vs research mastery
// ---------------------------------------------------------------------------

const mean = (xs: (number | null)[]) => {
  const v = xs.filter((x): x is number => x !== null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};

/**
 * Exam mastery: recall, problem solving and delayed retention (what timed
 * exams test). Research mastery: transfer, explanation and application, plus
 * independent modelling and research outputs. Null without evidence.
 */
export function examVsResearch(db: LabDB, loId: string, now: Millis = Date.now()): { exam: number | null; research: number | null } {
  const p = masteryProfile(db, loId, now);
  const d = depthReport(db, loId, now);
  const exam = mean([p.dims.recall.score, p.dims.problemSolving.score, p.dims.retention.score]);
  let research = mean([p.dims.transfer.score, p.dims.explanation.score, p.dims.application.score]);
  if (research !== null) research = Math.min(1, research * 0.85 + (d.reached.includes("MODEL") ? 0.1 : 0) + (d.reached.includes("RESEARCH") ? 0.15 : 0));
  else if (d.reached.includes("RESEARCH")) research = 0.5;
  return { exam, research };
}

// ---------------------------------------------------------------------------
// Confidence
// ---------------------------------------------------------------------------

export interface ConfidenceReport {
  /** Mean self-reported confidence 0..1 (from 1..5), or null. */
  mean: number | null;
  n: number;
  /** Confidence minus accuracy on the same answers: > 0 over-confident, < 0 under-confident. */
  calibrationGap: number | null;
}

export function confidenceReport(db: LabDB, loId: string): ConfidenceReport {
  const atts = Object.values(db.attempts).filter((a) => a.confidence !== undefined && a.correct !== null && db.milestones[a.milestoneId]?.learningObjectIds?.includes(loId));
  if (!atts.length) return { mean: null, n: 0, calibrationGap: null };
  const conf = atts.reduce((s, a) => s + (a.confidence! - 1) / 4, 0) / atts.length;
  const acc = atts.filter((a) => a.correct).length / atts.length;
  return { mean: conf, n: atts.length, calibrationGap: atts.length >= 3 ? conf - acc : null };
}

// ---------------------------------------------------------------------------
// Audit: why the mastery value changed
// ---------------------------------------------------------------------------

export interface MasteryChange {
  before: number;
  after: number;
  at: Millis;
  /** e.g. "2 problems solved, 1 explanation". */
  because: string;
  items: EvidenceItem[];
}

const SOURCE_PHRASE = (e: EvidenceItem): string => {
  if (e.source === "explanation") return L("explanation", "açıklama");
  if (e.source === "card") return L("flashcard review", "kart tekrarı");
  if (e.source === "topicReview") return L("delayed recall", "gecikmeli hatırlama");
  if (e.source === "prediction") return L("prediction", "tahmin");
  if (e.source === "check") return L("knowledge-check answer", "bilgi kontrolü cevabı");
  if (e.source === "sandbox") return L("simulation", "simülasyon");
  if (e.dim === "transfer") return L("transfer problem", "transfer problemi");
  if (e.dim === "retention") return L("delayed recall", "gecikmeli hatırlama");
  if (e.dim === "problemSolving" || e.dim === "application") return L("problem", "problem");
  return L("answer", "cevap");
};

/** The latest change: the evidence recorded on the most recent day, and the value before and after it. */
export function lastMasteryChange(db: LabDB, key: string, now: Millis = Date.now()): MasteryChange | null {
  const items = evidenceFor(db, key, now);
  if (!items.length) return null;
  const lastAt = items[items.length - 1].at;
  const recent = items.filter((e) => e.at > lastAt - 86_400_000).slice(-12);
  const earlier = items.slice(0, items.length - recent.length);
  const before = buildProfile(db, key, earlier, now).verified;
  const after = masteryProfile(db, key, now).verified;
  const groups = new Map<string, { n: number; good: number }>();
  for (const e of recent) {
    const k = SOURCE_PHRASE(e);
    const g = groups.get(k) ?? { n: 0, good: 0 };
    g.n++;
    if (e.score >= 0.6) g.good++;
    groups.set(k, g);
  }
  const because = [...groups].map(([k, g]) => (g.good === g.n ? `${g.n} ${k}` : L(`${g.n} ${k} (${g.good} good)`, `${g.n} ${k} (${g.good} iyi)`))).join(", ");
  return { before, after, at: lastAt, because, items: recent };
}
