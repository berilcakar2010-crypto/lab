/**
 * Statistics engine. Everything is recomputed from raw events (plus raw
 * attempt/retention records); nothing here is stored. Every rate carries its
 * sample size and a Wilson interval, and is withheld below a minimum sample,
 * so the UI never shows fake precision. Engagement is reported separately
 * from learning — enjoying something is not evidence of learning it.
 */
import type { AnalyticsEvent, ID, LabDB, MilestoneType } from "../domain/types";
import { computeSessionTimes, reconstructSession, type MilestoneVisit } from "./analytics";

export const MIN_N = 5;

export interface Rate {
  k: number;
  n: number;
  /** null when n < minimum sample. */
  value: number | null;
  low: number | null;
  high: number | null;
}

/** Wilson score interval (95%). */
export function rate(k: number, n: number, minN = MIN_N): Rate {
  if (n < minN || n === 0) return { k, n, value: null, low: null, high: null };
  const z = 1.96, p = k / n;
  const denom = 1 + (z * z) / n;
  const centre = (p + (z * z) / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
  return { k, n, value: p, low: Math.max(0, centre - half), high: Math.min(1, centre + half) };
}

export interface Quantity {
  value: number | null;
  n: number;
}

// ---------------------------------------------------------------------------
// Visit-level dataset (one row per milestone visit), built from events
// ---------------------------------------------------------------------------

export interface VisitRow extends MilestoneVisit {
  sessionId: ID;
  subjectId?: ID;
  courseId?: ID;
  topicId?: ID;
  milestoneType?: MilestoneType;
  difficulty?: number;
  estimatedDuration?: number;
  /** Dominant question kind among attempts. */
  interaction?: string;
  /** Visit used auto-graded (immediate) feedback. */
  immediateFeedback: boolean;
  /** Any incorrect attempt during the visit. */
  hadFailure: boolean;
  /** After a failure, attempted again within the visit. */
  persisted: boolean | null;
  /** After completing, chose to continue (explicit decision), null if unknown. */
  continuedAfter: boolean | null;
  /** First attempt in the visit was correct. */
  firstTryCorrect: boolean | null;
  activeMs: number;
  hourOfDay: number;
  novelTopic: boolean;
}

const rowCache = new WeakMap<LabDB, { len: number; lastId?: string; rows: VisitRow[] }>();

/** Visit rows are pure functions of the event log, so cache them per log state. */
export function visitRows(db: LabDB): VisitRow[] {
  const last = db.events[db.events.length - 1]?.id;
  const hit = rowCache.get(db);
  if (hit && hit.len === db.events.length && hit.lastId === last) return hit.rows;
  const rows = buildVisitRows(db);
  rowCache.set(db, { len: db.events.length, lastId: last, rows });
  return rows;
}

function buildVisitRows(db: LabDB): VisitRow[] {
  const rows: VisitRow[] = [];
  const bySession = new Map<ID, AnalyticsEvent[]>();
  for (const e of db.events) if (e.sessionId) (bySession.get(e.sessionId) ?? bySession.set(e.sessionId, []).get(e.sessionId)!).push(e);
  for (const [sessionId, evsRaw] of bySession) {
    const evs = evsRaw.sort((a, b) => a.at - b.at);
    const rec = reconstructSession(db, sessionId);
    const seenTopics = new Set<ID>();
    for (const v of rec.visits) {
      const open = evs.find((e) => e.type === "MILESTONE_OPEN" && e.milestoneId === v.milestoneId && e.at === v.openedAt);
      const end = v.closedAt ?? evs[evs.length - 1].at;
      const inVisit = evs.filter((e) => e.at >= v.openedAt && e.at <= end && (e.milestoneId === v.milestoneId || !e.milestoneId));
      const attempts = inVisit.filter((e) => e.type === "ATTEMPT" && e.milestoneId === v.milestoneId);
      const kinds = attempts.map((a) => String(a.data.questionKind ?? ""));
      const firstFail = attempts.findIndex((a) => a.data.correct === false);
      const decision = v.outcome === "COMPLETED" ? evs.find((e) => e.type === "CONTINUE_DECISION" && e.at >= (v.closedAt ?? 0)) : undefined;
      const times = computeSessionTimes(inVisit.filter((e) => ["IDLE_START", "IDLE_END", "INTERRUPTION"].includes(e.type)).concat([
        { ...open!, type: "SESSION_START", at: v.openedAt } as AnalyticsEvent,
        { ...open!, type: "SESSION_END", at: end } as AnalyticsEvent,
      ]));
      const topicId = open?.topicId;
      rows.push({
        ...v,
        sessionId,
        subjectId: open?.subjectId,
        courseId: open?.courseId,
        topicId,
        milestoneType: open?.data.milestoneType as MilestoneType | undefined,
        difficulty: open?.data.difficulty as number | undefined,
        estimatedDuration: open?.data.estimatedDuration as number | undefined,
        interaction: mode(kinds.filter(Boolean)) ?? (open?.data.interactionType as string | undefined),
        immediateFeedback: attempts.some((a) => a.data.evaluatedBy === "auto"),
        hadFailure: firstFail >= 0,
        persisted: firstFail >= 0 ? attempts.length > firstFail + 1 : null,
        continuedAfter: decision ? !!decision.data.continued : null,
        firstTryCorrect: attempts.length ? attempts[0].data.correct === true : null,
        activeMs: times?.activeMs ?? 0,
        hourOfDay: new Date(v.openedAt).getHours(),
        novelTopic: topicId ? !seenTopics.has(topicId) : false,
      });
      if (topicId) seenTopics.add(topicId);
    }
  }
  return rows;
}

const mode = (xs: string[]) => {
  const c = new Map<string, number>();
  for (const x of xs) c.set(x, (c.get(x) ?? 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
};

// ---------------------------------------------------------------------------
// Engagement index (transparent, per visit)
// ---------------------------------------------------------------------------

/**
 * Engagement index of a set of visits = mean of the available rates:
 * completion (vs. abandonment), persistence after failure, and continuation
 * after completion. Each component is shown separately in the UI too.
 */
export function engagementIndex(rows: VisitRow[]): { value: number | null; parts: Record<string, Rate> } {
  const decided = rows.filter((r) => r.outcome === "COMPLETED" || r.outcome === "ABANDONED");
  const parts = {
    completion: rate(decided.filter((r) => r.outcome === "COMPLETED").length, decided.length),
    persistence: rate(rows.filter((r) => r.persisted === true).length, rows.filter((r) => r.persisted !== null).length),
    continuation: rate(rows.filter((r) => r.continuedAfter === true).length, rows.filter((r) => r.continuedAfter !== null).length),
  };
  const vals = Object.values(parts).map((p) => p.value).filter((v): v is number => v !== null);
  return { value: vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null, parts };
}

export type GroupKey =
  | "subject" | "topic" | "milestoneType" | "interaction" | "difficulty" | "duration" | "inputMethod" | "stylus"
  | "feedback" | "challenge" | "novelty" | "timeOfDay" | "assistance";

export const GROUP_LABEL: Record<GroupKey, string> = {
  subject: "Alan", topic: "Konu", milestoneType: "Adım türü", interaction: "Etkileşim türü", difficulty: "Zorluk",
  duration: "Adım uzunluğu", inputMethod: "Giriş yöntemi", stylus: "Kalem", feedback: "Geri bildirim biçimi", challenge: "Zorlayıcılık",
  novelty: "Yenilik", timeOfDay: "Günün saati", assistance: "YZ / ipucu desteği",
};

export function groupOf(db: LabDB, r: VisitRow, key: GroupKey): string | null {
  switch (key) {
    case "subject": return r.subjectId ? db.subjects[r.subjectId]?.name ?? "(silindi)" : null;
    case "topic": return r.topicId ? db.topics[r.topicId]?.title ?? "(silindi)" : null;
    case "milestoneType": return r.milestoneType ? TYPE_TR[r.milestoneType] ?? r.milestoneType : null;
    case "interaction": return r.interaction ? INTERACTION_TR[r.interaction] ?? r.interaction.toLowerCase().replace(/_/g, " ") : null;
    case "difficulty": return r.difficulty === undefined ? null : r.difficulty <= 2 ? "kolay (1–2)" : r.difficulty === 3 ? "orta (3)" : "zor (4–5)";
    case "duration": return r.estimatedDuration === undefined ? null : r.estimatedDuration <= 15 ? "kısa (≤15 dk)" : r.estimatedDuration <= 30 ? "orta (16–30 dk)" : "uzun (>30 dk)";
    case "inputMethod": return r.inputMethods.length ? INPUT_TR[r.inputMethods.includes("pen") ? "pen" : r.inputMethods[0]] ?? r.inputMethods[0] : null;
    case "stylus": return r.attempts ? (r.usedStylus ? "kalemle" : "kalemsiz") : null;
    case "feedback": return r.attempts ? (r.immediateFeedback ? "anında (otomatik)" : "öz/YZ değerlendirmesi") : null;
    case "challenge": return r.milestoneType === "BOSS" || r.milestoneType === "CHALLENGE" ? "meydan okuma / final" : r.milestoneType ? "normal" : null;
    case "novelty": return r.novelTopic ? "oturumda yeni konu" : "önceki konuyla aynı";
    case "timeOfDay": return r.hourOfDay < 6 ? "gece" : r.hourOfDay < 12 ? "sabah" : r.hourOfDay < 18 ? "öğleden sonra" : "akşam";
    case "assistance": return r.maxHintLevel === 0 && r.aiInteractions === 0 ? "yardımsız" : r.maxHintLevel >= 4 ? "yoğun yardım (4–5)" : "hafif yardım (1–3, rehber)";
  }
}

const TYPE_TR: Record<string, string> = {
  CONCEPT: "kavram", PRACTICE: "alıştırma", APPLICATION: "uygulama", DERIVATION: "türetme", PROOF: "ispat", PROBLEM_SOLVING: "problem çözme",
  EXPERIMENT: "deney", PROJECT: "proje", REVIEW: "tekrar", CHALLENGE: "meydan okuma", BOSS: "final",
};
export const INTERACTION_TR: Record<string, string> = {
  MULTIPLE_CHOICE: "çoktan seçmeli", FREE_RESPONSE: "açık uçlu", EQUATION: "denklem", NUMERIC: "sayısal", DERIVATION: "türetme", PROOF: "ispat",
  EXPLANATION: "açıklama", PREDICTION: "tahmin", DIAGRAM: "diyagram", DRAWING: "çizim", GRAPH_INTERPRETATION: "grafik yorumu", ORDERING: "sıralama",
  CODE: "kod", SIMULATION: "simülasyon", PROBLEM_SOLVING: "problem çözme", CLASSIFICATION: "sınıflandırma", COMPARISON: "karşılaştırma",
  CONCEPT_EXPLANATION: "kavram açıklama",
};
const INPUT_TR: Record<string, string> = { pen: "kalem", touch: "dokunma", mouse: "fare", keyboard: "klavye", unknown: "bilinmiyor" };

export interface GroupStat {
  group: string;
  visits: number;
  index: number | null;
  completion: Rate;
  persistence: Rate;
  continuation: Rate;
  firstTry: Rate;
}

export function groupStats(db: LabDB, rows: VisitRow[], key: GroupKey): GroupStat[] {
  const groups = new Map<string, VisitRow[]>();
  for (const r of rows) {
    const g = groupOf(db, r, key);
    if (g !== null) (groups.get(g) ?? groups.set(g, []).get(g)!).push(r);
  }
  return [...groups.entries()]
    .map(([group, rs]) => {
      const e = engagementIndex(rs);
      return {
        group,
        visits: rs.length,
        index: e.value,
        completion: e.parts.completion,
        persistence: e.parts.persistence,
        continuation: e.parts.continuation,
        firstTry: rate(rs.filter((r) => r.firstTryCorrect === true).length, rs.filter((r) => r.firstTryCorrect !== null).length),
      };
    })
    .sort((a, b) => b.visits - a.visits);
}

// ---------------------------------------------------------------------------
// Headline statistics
// ---------------------------------------------------------------------------

export interface Overview {
  sessions: number;
  activeMs: number;
  milestonesCompleted: number;
  selfAttested: number;
  milestonesPerHour: Quantity;
  avgMilestoneMinutes: Quantity;
  completion: Rate;
  abandonment: Rate;
  retry: Rate;
  persistence: Rate;
  continuation: Rate;
  engagement: number | null;
  longestHighEngagement: { sessionId: ID; activeMs: number; completions: number } | null;
  // Learning — kept separate from engagement.
  immediateAccuracy: Rate;
  mastery: { mastered: number; evidenced: number };
  immediateCheck: Rate;
  delayedRetention: Rate;
  transfer: Rate;
}

export function overview(db: LabDB): Overview {
  const rows = visitRows(db);
  const sessions = Object.values(db.sessions).filter((s) => db.events.some((e) => e.sessionId === s.id));
  let activeMs = 0;
  let best: Overview["longestHighEngagement"] = null;
  for (const s of sessions) {
    const rec = reconstructSession(db, s.id);
    const t = rec.times?.activeMs ?? 0;
    activeMs += t;
    const srows = rows.filter((r) => r.sessionId === s.id);
    const idx = engagementIndex(srows);
    // "High engagement": at least one completion, nothing abandoned without a retry, and continuing when asked.
    const high = rec.completions > 0 && srows.every((r) => r.outcome !== "ABANDONED" || r.persisted) && rec.continued !== false;
    if (high && (idx.value === null || idx.value >= 0.6) && (!best || t > best.activeMs)) best = { sessionId: s.id, activeMs: t, completions: rec.completions };
  }
  const completes = db.events.filter((e) => e.type === "MILESTONE_COMPLETE");
  const evidenced = completes.filter((e) => !e.data.selfAttested);
  const decided = rows.filter((r) => r.outcome === "COMPLETED" || r.outcome === "ABANDONED");
  const completedRows = rows.filter((r) => r.outcome === "COMPLETED" && r.attempts > 0);
  const attemptsEv = db.events.filter((e) => e.type === "ATTEMPT");
  const retries = db.events.filter((e) => e.type === "RETRY").length;
  const hours = activeMs / 3_600_000;

  const firstTries = new Map<string, AnalyticsEvent>();
  for (const e of attemptsEv) {
    if (e.data.purpose !== "PRACTICE" && e.data.purpose !== "MASTERY") continue;
    const key = `${e.sessionId}:${e.questionId}`;
    if (!firstTries.has(key)) firstTries.set(key, e);
  }
  const checks = db.events.filter((e) => e.type === "RETENTION_CHECK");
  const kind = (k: string) => checks.filter((c) => c.data.kind === k);
  const e = engagementIndex(rows);
  return {
    sessions: sessions.length,
    activeMs,
    milestonesCompleted: completes.length,
    selfAttested: completes.length - evidenced.length,
    milestonesPerHour: { value: hours >= 0.5 ? evidenced.length / hours : null, n: evidenced.length },
    avgMilestoneMinutes: { value: completedRows.length >= MIN_N ? completedRows.reduce((s, r) => s + r.activeMs, 0) / completedRows.length / 60_000 : null, n: completedRows.length },
    completion: rate(decided.filter((r) => r.outcome === "COMPLETED").length, decided.length),
    abandonment: rate(decided.filter((r) => r.outcome === "ABANDONED").length, decided.length),
    retry: rate(retries, attemptsEv.length),
    persistence: e.parts.persistence,
    continuation: e.parts.continuation,
    engagement: e.value,
    longestHighEngagement: best,
    immediateAccuracy: rate([...firstTries.values()].filter((x) => x.data.correct === true).length, [...firstTries.values()].filter((x) => x.data.correct !== null && x.data.correct !== undefined).length),
    mastery: { mastered: Object.values(db.milestones).filter((m) => m.masteredAt).length, evidenced: evidenced.length },
    immediateCheck: rate(kind("IMMEDIATE").filter((c) => c.data.correct).length, kind("IMMEDIATE").length, 3),
    delayedRetention: rate(kind("DELAYED").filter((c) => c.data.correct).length, kind("DELAYED").length, 3),
    transfer: rate(kind("TRANSFER").filter((c) => c.data.correct).length, kind("TRANSFER").length, 3),
  };
}

/** Continuation lift per milestone type vs the user's average; empty until there is enough data. */
export function engagementLift(db: LabDB): Partial<Record<MilestoneType, number>> {
  const rows = visitRows(db).filter((r) => r.continuedAfter !== null);
  if (rows.length < 12) return {};
  const base = rows.filter((r) => r.continuedAfter).length / rows.length;
  const out: Partial<Record<MilestoneType, number>> = {};
  const byType = new Map<MilestoneType, VisitRow[]>();
  for (const r of rows) if (r.milestoneType) (byType.get(r.milestoneType) ?? byType.set(r.milestoneType, []).get(r.milestoneType)!).push(r);
  for (const [t, rs] of byType) if (rs.length >= MIN_N) out[t] = rs.filter((r) => r.continuedAfter).length / rs.length - base;
  return out;
}
