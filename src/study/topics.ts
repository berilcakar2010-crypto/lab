/**
 * Spaced repetition of whole topics, and the study log by date.
 *
 * The log is derived from the raw event stream (attempts, mastery, explanations,
 * AI questions, card reviews), so it also covers study done before this
 * feature existed. Each studied topic gets a review schedule on an expanding
 * ladder — 1, 3, 7, 14, 30, 60, 120 days — moved by how well it comes back.
 */
import type { LabDB, Millis, TopicGrade, TopicReview } from "../domain/types";
import { logEvent } from "../engines/analytics";
import { L } from "../i18n";

const DAY = 86_400_000;
export const LADDER_DAYS = [1, 3, 7, 14, 30, 60, 120] as const;
export const TOPIC_GRADE_LABELS = () => [L("Forgot", "Unuttum"), L("Hard", "Zorlandım"), L("Good", "İyi"), L("Easy", "Kolay")] as const;

export type StudyKind = "practice" | "mastery" | "explain" | "ask" | "cards" | "review";

/** Local calendar day, e.g. "2026-10-08". */
export function dayKey(ms: Millis): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function startOfDay(ms: Millis): Millis {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export interface StudyEntry {
  loId: string;
  at: Millis;
  kind: StudyKind;
}

/** Every study action that can be tied to a graph object, oldest first. */
export function studyEntries(db: LabDB): StudyEntry[] {
  const out: StudyEntry[] = [];
  const los = (mid?: string) => (mid ? db.milestones[mid]?.learningObjectIds ?? [] : []);
  for (const e of db.events) {
    const lo = typeof e.data?.lo === "string" ? (e.data.lo as string) : undefined;
    switch (e.type) {
      case "ATTEMPT":
        for (const id of los(e.milestoneId)) out.push({ loId: id, at: e.at, kind: "practice" });
        break;
      case "MILESTONE_COMPLETE":
        for (const id of los(e.milestoneId)) out.push({ loId: id, at: e.at, kind: "mastery" });
        break;
      case "EXPLANATION":
        if (lo) out.push({ loId: lo, at: e.at, kind: "explain" });
        break;
      case "AI_INTERACTION":
        if (lo && e.data?.role === "QA_ASSISTANT") out.push({ loId: lo, at: e.at, kind: "ask" });
        break;
      case "FLASHCARD_REVIEW":
        if (lo) out.push({ loId: lo, at: e.at, kind: "cards" });
        break;
      case "TOPIC_REVIEW":
        if (lo) out.push({ loId: lo, at: e.at, kind: "review" });
        break;
    }
  }
  return out.sort((a, b) => a.at - b.at);
}

export interface StudyDay {
  day: string;
  start: Millis;
  topics: { loId: string; count: number; kinds: StudyKind[] }[];
  actions: number;
}

/** Study grouped by calendar day, newest first. */
export function studyLog(db: LabDB, entries = studyEntries(db)): StudyDay[] {
  const days = new Map<string, Map<string, { count: number; kinds: Set<StudyKind> }>>();
  for (const e of entries) {
    const k = dayKey(e.at);
    if (!days.has(k)) days.set(k, new Map());
    const m = days.get(k)!;
    if (!m.has(e.loId)) m.set(e.loId, { count: 0, kinds: new Set() });
    const t = m.get(e.loId)!;
    t.count++;
    t.kinds.add(e.kind);
  }
  return [...days.entries()]
    .map(([day, m]) => ({
      day,
      start: new Date(`${day}T00:00:00`).getTime(),
      topics: [...m.entries()].map(([loId, t]) => ({ loId, count: t.count, kinds: [...t.kinds] })).sort((a, b) => b.count - a.count),
      actions: [...m.values()].reduce((s, t) => s + t.count, 0),
    }))
    .sort((a, b) => b.start - a.start);
}

/** Consecutive days with any study, ending today (or yesterday if today has none yet). */
export function streak(log: StudyDay[], now: Millis = Date.now()): number {
  const have = new Set(log.map((d) => d.day));
  let t = startOfDay(now);
  if (!have.has(dayKey(t))) t -= DAY;
  let n = 0;
  while (have.has(dayKey(t))) {
    n++;
    t -= DAY;
  }
  return n;
}

const LEARNING: ReadonlySet<StudyKind> = new Set(["practice", "mastery", "explain", "ask"]);
const stageDue = (at: Millis, stage: number) => startOfDay(at) + LADDER_DAYS[Math.min(stage, LADDER_DAYS.length - 1)] * DAY;

/**
 * Creates or advances topic schedules from new study. Learning a topic again
 * after its review is due counts as a successful review; card reviews show in
 * the log but have their own schedule, so they don't move the topic.
 */
export function syncTopicSchedule(db: LabDB, now: Millis = Date.now()): number {
  let changed = 0;
  for (const e of studyEntries(db)) {
    if (!LEARNING.has(e.kind) || e.at > now) continue;
    const r = db.topicReviews[e.loId];
    if (!r) {
      db.topicReviews[e.loId] = { id: e.loId, firstStudied: e.at, lastStudied: e.at, stage: 0, due: stageDue(e.at, 0), history: [{ at: e.at, kind: "study" }] };
      changed++;
      continue;
    }
    if (e.at <= r.lastStudied) continue;
    if (dayKey(e.at) !== dayKey(r.lastStudied)) r.history = [...r.history, { at: e.at, kind: "study" as const }].slice(-60);
    if (e.at >= r.due) {
      r.stage = Math.min(r.stage + 1, LADDER_DAYS.length - 1);
      r.due = stageDue(e.at, r.stage);
    }
    r.lastStudied = e.at;
    changed++;
  }
  return changed;
}

/** Record a deliberate topic review and move it on the ladder. */
export function reviewTopic(db: LabDB, loId: string, grade: TopicGrade, now: Millis = Date.now()): TopicReview {
  const r: TopicReview = db.topicReviews[loId] ?? { id: loId, firstStudied: now, lastStudied: now, stage: 0, due: now, history: [] };
  if (grade === 0) r.stage = 0;
  else if (grade === 2) r.stage = Math.min(r.stage + 1, LADDER_DAYS.length - 1);
  else if (grade === 3) r.stage = Math.min(r.stage + 2, LADDER_DAYS.length - 1);
  // "Hard" keeps the stage but comes back sooner than its interval.
  const days = grade === 1 ? Math.max(1, Math.round(LADDER_DAYS[r.stage] * 0.6)) : LADDER_DAYS[r.stage];
  r.due = startOfDay(now) + days * DAY;
  r.lastStudied = now;
  r.history = [...r.history, { at: now, kind: "review" as const, grade }].slice(-60);
  db.topicReviews[loId] = r;
  logEvent(db, "TOPIC_REVIEW", {}, { lo: loId, grade, stage: r.stage, nextInDays: days });
  return r;
}

export function dueTopics(db: LabDB, now: Millis = Date.now()): TopicReview[] {
  return Object.values(db.topicReviews).filter((r) => r.due <= now).sort((a, b) => a.due - b.due);
}

/** Topics coming up in the next `days` days (not yet due). */
export function upcomingTopics(db: LabDB, now: Millis = Date.now(), days = 7): TopicReview[] {
  return Object.values(db.topicReviews).filter((r) => r.due > now && r.due <= now + days * DAY).sort((a, b) => a.due - b.due);
}

export interface ReminderSlot {
  at: Millis;
  cards: number;
  topics: number;
}

/** What will be due at the reminder time on each of the next `days` days (from today's schedule). */
export function reminderForecast(db: LabDB, hour: number, minute: number, now: Millis = Date.now(), days = 14): ReminderSlot[] {
  const out: ReminderSlot[] = [];
  const cards = Object.values(db.flashcards).filter((c) => !c.suspended);
  const topics = Object.values(db.topicReviews);
  for (let i = 0; i < days; i++) {
    const d = new Date(startOfDay(now) + i * DAY);
    d.setHours(hour, minute, 0, 0);
    const at = d.getTime();
    if (at <= now) continue;
    out.push({ at, cards: cards.filter((c) => c.due <= at).length, topics: topics.filter((t) => t.due <= at).length });
  }
  return out;
}

export function reminderText(slot: ReminderSlot): { title: string; body: string } {
  const parts = [
    slot.topics ? L(`${slot.topics} topics`, `${slot.topics} konu`) : "",
    slot.cards ? L(`${slot.cards} cards`, `${slot.cards} kart`) : "",
  ].filter(Boolean).join(L(" and ", " ve "));
  return {
    title: L("Time to review", "Tekrar zamanı"),
    body: L(`${parts} are ready for review — a few minutes now keeps them for weeks.`, `${parts} tekrar için hazır — şimdi birkaç dakika, haftalarca kalıcılık.`),
  };
}
