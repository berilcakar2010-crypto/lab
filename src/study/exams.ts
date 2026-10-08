/**
 * School exams and deadlines: how ready you are for each, a day-by-day study
 * plan up to the exam, today's suggestions across all upcoming exams, and the
 * reminder notifications before them.
 *
 * Readiness comes from what Lab already knows about each covered topic
 * (mastery, self-reports, the topic review ladder, recency), so the plan puts
 * the time where it is needed: missing prerequisites and new topics first,
 * weak ones next, and a spaced review of everything before the exam day.
 */
import type { Exam, ExamKind, ID, LabDB, Millis } from "../domain/types";
import { L } from "../i18n";
import type { KnowledgeGraph } from "../knowledge/schema";
import { personalGraph, type PersonalGraph } from "../knowledge/state";
import { matchRequest } from "../knowledge/search";
import { dayKey, startOfDay } from "./topics";

const DAY = 86_400_000;
export const DEFAULT_REMIND_DAYS = [7, 3, 1, 0];
export const REMIND_CHOICES = [14, 7, 3, 1, 0];

export const EXAM_KIND_LABEL = (k: ExamKind) =>
  ({ EXAM: L("Exam", "Sınav"), QUIZ: L("Quiz", "Quiz"), ASSIGNMENT: L("Assignment", "Ödev"), PRESENTATION: L("Presentation", "Sunum") })[k];

const newId = (): ID => `exam_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function addExam(db: LabDB, e: Omit<Exam, "id" | "createdAt"> & { id?: ID }, now: Millis = Date.now()): Exam {
  const exam: Exam = { ...e, id: e.id ?? newId(), createdAt: now, loIds: [...new Set(e.loIds)], remindDays: [...new Set(e.remindDays)].sort((a, b) => b - a) };
  db.exams[exam.id] = exam;
  return exam;
}

export function updateExam(db: LabDB, id: ID, patch: Partial<Omit<Exam, "id" | "createdAt">>): void {
  const e = db.exams[id];
  if (!e) return;
  Object.assign(e, patch);
  if (patch.loIds) e.loIds = [...new Set(patch.loIds)];
  if (patch.remindDays) e.remindDays = [...new Set(patch.remindDays)].sort((a, b) => b - a);
}

/** Calendar days from today until the exam day (0 = today, negative = past). */
export function daysUntil(exam: Exam, now: Millis = Date.now()): number {
  return Math.round((startOfDay(exam.date) - startOfDay(now)) / DAY);
}

export function upcomingExams(db: LabDB, now: Millis = Date.now()): Exam[] {
  return Object.values(db.exams).filter((e) => e.date > now - 3 * 3600_000 && !e.result).sort((a, b) => a.date - b.date);
}

export function pastExams(db: LabDB, now: Millis = Date.now()): Exam[] {
  return Object.values(db.exams).filter((e) => e.date <= now - 3 * 3600_000 || e.result).sort((a, b) => b.date - a.date);
}

/** Topics the graph suggests for an exam from its title and subject. */
export function suggestTopics(g: KnowledgeGraph, text: string, limit = 8): string[] {
  const m = matchRequest(g, text, limit);
  const ids = m.path ? [...m.path.targets, ...m.objects] : m.objects;
  return [...new Set(ids)].filter((id) => g.objects[id]).slice(0, limit);
}

// ---------------------------------------------------------------------------
// Readiness
// ---------------------------------------------------------------------------

export type TopicStatus = "new" | "weak" | "ok" | "strong";

export interface TopicReadiness {
  loId: string;
  score: number;
  status: TopicStatus;
  /** Required prerequisites not yet known (and not covered by the exam itself). */
  missingPrereqs: string[];
}

export function topicReadiness(db: LabDB, pg: PersonalGraph, loId: string, now: Millis = Date.now()): TopicReadiness {
  const p = pg.progress.get(loId);
  const base = !p ? 0 : ({ USTALASILDI: 0.8, BEYAN: 0.6, TEKRAR: 0.45, CALISILIYOR: 0.35 } as Record<string, number>)[p.state] ?? 0;
  let score = base;
  const r = db.topicReviews[loId];
  if (r) {
    score = Math.max(score, 0.3);
    if (r.due <= now) score -= 0.12;
    else score += 0.03 * r.stage;
    if (now - r.lastStudied > 21 * DAY) score -= 0.1;
    const last = [...r.history].reverse().find((h) => h.kind === "review");
    if (last?.grade === 0) score -= 0.15;
    if (last?.grade === 3) score += 0.08;
  }
  const cards = Object.values(db.flashcards).filter((c) => c.loId === loId && !c.suspended);
  if (cards.length) {
    const recent = cards.flatMap((c) => c.history.slice(-3));
    if (recent.length) score += (recent.filter((h) => h.grade >= 2).length / recent.length - 0.5) * 0.15;
  }
  score = Math.max(0, Math.min(1, score));
  const studied = !!r || base > 0;
  const status: TopicStatus = !studied ? "new" : score < 0.5 ? "weak" : score < 0.78 ? "ok" : "strong";
  return { loId, score, status, missingPrereqs: p?.missingRequired ?? [] };
}

export interface ExamReadiness {
  score: number;
  topics: TopicReadiness[];
  /** Missing required prerequisites of the covered topics, not covered themselves. */
  prereqs: string[];
  counts: Record<TopicStatus, number>;
}

export function examReadiness(db: LabDB, g: KnowledgeGraph, exam: Exam, now: Millis = Date.now(), pg = personalGraph(db, g)): ExamReadiness {
  const ids = exam.loIds.filter((id) => g.objects[id]);
  const topics = ids.map((id) => topicReadiness(db, pg, id, now));
  const covered = new Set(ids);
  const prereqs = [...new Set(topics.flatMap((t) => t.missingPrereqs))].filter((id) => !covered.has(id) && g.objects[id]);
  const counts = { new: 0, weak: 0, ok: 0, strong: 0 } as Record<TopicStatus, number>;
  for (const t of topics) counts[t.status]++;
  const score = topics.length ? topics.reduce((s, t) => s + t.score, 0) / topics.length : 0;
  return { score, topics, prereqs, counts };
}

// ---------------------------------------------------------------------------
// Day-by-day plan
// ---------------------------------------------------------------------------

export type PlanAction = "prereq" | "learn" | "strengthen" | "review" | "test" | "glance";

export interface PlanItem {
  loId: string;
  action: PlanAction;
  examId: ID;
}

export interface PlanDay {
  day: string;
  start: Millis;
  items: PlanItem[];
  /** Days left until the exam on this day. */
  left: number;
}

export const PLAN_ACTION_LABEL = (a: PlanAction) =>
  ({
    prereq: L("Fill the gap", "Eksiği tamamla"),
    learn: L("Learn", "Öğren"),
    strengthen: L("Strengthen", "Güçlendir"),
    review: L("Review", "Tekrar et"),
    test: L("Test yourself", "Kendini sına"),
    glance: L("Quick look", "Kısa göz at"),
  })[a];

/**
 * Plan from today to the exam day. Gaps and new topics are learned first, weak
 * ones strengthened, each comes back one and three days later, and the last
 * day before the exam is a self-test over everything that is not yet strong.
 */
export function examPlan(db: LabDB, g: KnowledgeGraph, exam: Exam, now: Millis = Date.now(), ready = examReadiness(db, g, exam, now)): PlanDay[] {
  const today = startOfDay(now);
  const left = daysUntil(exam, now);
  if (left < 0) return [];
  const day = (i: number): PlanDay => {
    const start = startOfDay(today + i * DAY + 3 * 3600_000); // robust to daylight-saving shifts
    return { day: dayKey(start), start, items: [], left: left - i };
  };
  const days: PlanDay[] = Array.from({ length: left + 1 }, (_, i) => day(i));
  const push = (i: number, loId: string, action: PlanAction) => {
    const d = days[i];
    if (d && !d.items.some((x) => x.loId === loId)) d.items.push({ loId, action, examId: exam.id });
  };
  const order = (ids: string[]) => [...ids].sort((a, b) => g.order.indexOf(a) - g.order.indexOf(b));
  const by = (s: TopicStatus) => order(ready.topics.filter((t) => t.status === s).map((t) => t.loId));

  if (left === 0) {
    // Exam day: a light look over what is weakest, nothing new.
    for (const t of [...ready.topics].sort((a, b) => a.score - b.score).slice(0, 4)) push(0, t.loId, "glance");
    return days;
  }

  const toLearn: [string, PlanAction][] = [
    ...order(ready.prereqs).slice(0, 4).map((id) => [id, "prereq"] as [string, PlanAction]),
    ...by("new").map((id) => [id, "learn"] as [string, PlanAction]),
    ...by("weak").map((id) => [id, "strengthen"] as [string, PlanAction]),
  ];
  // Days 0..last-1 are for study; the day before the exam (last) is the self-test.
  const last = left - 1;
  const learnDays = Math.max(1, left >= 3 ? Math.ceil(left * 0.6) : left);
  const perDay = Math.ceil(toLearn.length / learnDays);
  toLearn.forEach(([id, action], n) => {
    const i = Math.min(Math.floor(n / Math.max(1, perDay)), learnDays - 1);
    push(i, id, action);
    // Spaced follow-ups that still fall before the exam.
    for (const gap of [1, 3]) if (i + gap < last) push(i + gap, id, "review");
  });
  // Topics that are already fine get one review in the second half.
  const fine = [...by("ok"), ...by("strong")];
  const reviewStart = Math.min(learnDays, Math.max(0, last - 1));
  const reviewSpan = Math.max(1, last - reviewStart);
  fine.forEach((id, n) => push(reviewStart + (n % reviewSpan), id, "review"));
  // The day before: test yourself on everything that is not strong (or on all if few).
  const notStrong = ready.topics.filter((t) => t.status !== "strong").map((t) => t.loId);
  for (const id of order(notStrong.length ? notStrong : ready.topics.map((t) => t.loId))) push(last, id, "test");
  return days;
}

export interface TodaySuggestion {
  exam: Exam;
  left: number;
  readiness: number;
  items: PlanItem[];
}

/** Today's plan items across every exam in the next `horizon` days, nearest exam first. */
export function todaySuggestions(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now(), horizon = 30): TodaySuggestion[] {
  const pg = personalGraph(db, g);
  return upcomingExams(db, now)
    .filter((e) => daysUntil(e, now) <= horizon)
    .map((exam) => {
      const ready = examReadiness(db, g, exam, now, pg);
      const plan = examPlan(db, g, exam, now, ready);
      return { exam, left: daysUntil(exam, now), readiness: ready.score, items: plan[0]?.items ?? [] };
    });
}

/** A short honest note on how the time compares with what is left to do. */
export function paceNote(ready: ExamReadiness, left: number): { tone: "ok" | "warn" | "danger"; text: string } {
  const work = ready.counts.new + ready.counts.weak + Math.min(ready.prereqs.length, 4);
  if (!ready.topics.length) return { tone: "warn", text: L("Add the topics this exam covers to get a plan.", "Plan için bu sınavın kapsadığı konuları ekle.") };
  if (left <= 0) return { tone: "ok", text: L("Exam day — a quick look, then trust what you know.", "Sınav günü — kısa bir göz at, sonra bildiklerine güven.") };
  if (!work) return { tone: "ok", text: L("You're in good shape — keep the reviews going.", "İyi durumdasın — tekrarları sürdür.") };
  const perDay = work / Math.max(1, left - 1);
  if (perDay > 3) return { tone: "danger", text: L(`Tight: about ${Math.ceil(perDay)} new or weak topics a day. Start with the ones most likely on the exam.`, `Sıkışık: günde yaklaşık ${Math.ceil(perDay)} yeni ya da zayıf konu. Sınavda en çok çıkacaklardan başla.`) };
  if (perDay > 1.5) return { tone: "warn", text: L(`Busy but doable: about ${Math.ceil(perDay)} topics a day.`, `Yoğun ama yapılabilir: günde yaklaşık ${Math.ceil(perDay)} konu.`) };
  return { tone: "ok", text: L(`Comfortable: ${work} topics to learn or strengthen over ${left} days.`, `Rahat: ${left} günde öğrenilecek ya da güçlendirilecek ${work} konu.`) };
}

// ---------------------------------------------------------------------------
// Reminders and calendar export
// ---------------------------------------------------------------------------

export interface ExamReminder {
  examId: ID;
  at: Millis;
  title: string;
  body: string;
}

/** Reminder notifications for every upcoming exam, at the daily reminder time (morning of the exam for day 0). */
export function examReminders(db: LabDB, g: KnowledgeGraph, hour: number, minute: number, now: Millis = Date.now()): ExamReminder[] {
  const out: ExamReminder[] = [];
  const pg = personalGraph(db, g);
  for (const exam of upcomingExams(db, now)) {
    const ready = examReadiness(db, g, exam, now, pg);
    const plan = examPlan(db, g, exam, now, ready);
    for (const d of exam.remindDays) {
      const dayStart = startOfDay(exam.date) - d * DAY;
      let at: Millis;
      if (d === 0) at = Math.max(dayStart + 6.5 * 3600_000, exam.date - 90 * 60_000);
      else {
        const t = new Date(dayStart);
        t.setHours(hour, minute, 0, 0);
        at = t.getTime();
      }
      if (at <= now || at >= exam.date) continue;
      const planDay = plan.find((p) => p.day === dayKey(at));
      const names = (planDay?.items ?? []).slice(0, 3).map((i) => g.objects[i.loId]?.title).filter(Boolean).join(", ");
      const what = `${exam.subject ? `${exam.subject} · ` : ""}${exam.title}`;
      out.push({
        examId: exam.id,
        at,
        title: d === 0 ? L(`Today: ${what}`, `Bugün: ${what}`) : d === 1 ? L(`Tomorrow: ${what}`, `Yarın: ${what}`) : L(`${d} days to ${what}`, `${what} için ${d} gün kaldı`),
        body: d === 0
          ? L("Good luck! A quick look at your weakest topics, then go in calm.", "Bol şans! En zayıf konularına kısa bir göz at, sonra sakin gir.")
          : L(`Ready ${Math.round(ready.score * 100)}%.${names ? ` Today: ${names}.` : ""}`, `Hazırlık %${Math.round(ready.score * 100)}.${names ? ` Bugün: ${names}.` : ""}`),
      });
    }
  }
  return out.sort((a, b) => a.at - b.at);
}

const icsDate = (ms: Millis) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (c) => `\\${c}`);

/** The exams as an iCalendar file (phone and school calendars), with alarms on the reminder days. */
export function examsICS(exams: Exam[], g: KnowledgeGraph, now: Millis = Date.now()): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Lab//Exams//EN", "CALSCALE:GREGORIAN"];
  for (const e of exams) {
    const topics = e.loIds.map((id) => g.objects[id]?.title).filter(Boolean).join(", ");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@lab`,
      `DTSTAMP:${icsDate(now)}`,
      `DTSTART:${icsDate(e.date)}`,
      `DTEND:${icsDate(e.date + 3600_000)}`,
      `SUMMARY:${icsText(`${EXAM_KIND_LABEL(e.kind)}: ${e.subject ? `${e.subject} — ` : ""}${e.title}`)}`,
      `DESCRIPTION:${icsText([topics && `${L("Topics", "Konular")}: ${topics}`, e.notes].filter(Boolean).join("\n"))}`,
    );
    for (const d of e.remindDays) lines.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${icsText(e.title)}`, `TRIGGER:-P${d === 0 ? "T2H" : `${d}D`}`, "END:VALARM");
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
