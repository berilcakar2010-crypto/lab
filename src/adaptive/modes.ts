/**
 * Normal mode and exam mode. The curriculum is timeless; exam mode is a
 * temporary layer of constraints over the same graph — a deadline, coverage,
 * topic priorities, question practice and time — that changes what Lab
 * suggests, never what the curriculum is. Lab suggests; it does not order.
 */
import type { Exam, ID, LabDB, Millis } from "../domain/types";
import type { LearningPathPlan, StudyMode } from "../domain/adaptive";
import { logEvent } from "../engines/analytics";
import type { KnowledgeGraph } from "../knowledge/schema";
import { L } from "../i18n";
import { daysUntil, upcomingExams } from "../study/exams";
import { masteryProfile } from "./mastery";
import { createPath } from "./pathPlanner";
import { recordDecision } from "./decisions";

export const MODE_GOALS = (m: StudyMode): string[] =>
  m === "NORMAL"
    ? [L("Understanding", "Anlama"), L("Mastery", "Ustalık"), L("Retention", "Kalıcılık"), L("Transfer", "Transfer")]
    : [L("Deadline", "Son tarih"), L("Coverage", "Kapsam"), L("Exam priority", "Sınav önceliği"), L("Question practice", "Soru pratiği"), L("Time", "Zaman")];

export function setStudyMode(db: LabDB, mode: StudyMode, examId?: ID, now: Millis = Date.now()): boolean {
  if (mode === "EXAM") {
    const exam = examId ? db.exams[examId] : upcomingExams(db, now)[0];
    if (!exam || exam.date < now) return false;
    db.preferences.studyMode = "EXAM";
    db.preferences.focusExamId = exam.id;
  } else {
    db.preferences.studyMode = "NORMAL";
    db.preferences.focusExamId = undefined;
  }
  logEvent(db, "MODE_CHANGED", { at: now }, { mode, examId: db.preferences.focusExamId });
  return true;
}

/** Exam mode ends by itself once its exam has passed. */
export function normalizeMode(db: LabDB, now: Millis = Date.now()): void {
  if (db.preferences.studyMode !== "EXAM") return;
  const e = db.preferences.focusExamId ? db.exams[db.preferences.focusExamId] : undefined;
  if (!e || e.result || daysUntil(e, now) < 0) setStudyMode(db, "NORMAL", undefined, now);
}

export function setExamPriority(db: LabDB, examId: ID, loId: string, priority: 1 | 2 | 3): void {
  const e = db.exams[examId];
  if (!e || !e.loIds.includes(loId)) return;
  e.priorities = { ...(e.priorities ?? {}), [loId]: priority };
}

export interface ExamConstraints {
  exam: Exam;
  daysLeft: number;
  priorities: Record<string, number>;
  /** Share of covered topics with verified mastery ≥ 0.6. */
  coverage: number;
  weakHighPriority: string[];
  /** Practice questions on the exam topics, high priority first, not yet answered correctly. */
  practice: ID[];
  advice: string;
}

export function examConstraints(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now()): ExamConstraints | null {
  if (db.preferences.studyMode !== "EXAM" || !db.preferences.focusExamId) return null;
  const exam = db.exams[db.preferences.focusExamId];
  if (!exam) return null;
  const los = exam.loIds.filter((id) => g.objects[id]);
  const priorities = Object.fromEntries(los.map((id) => [id, exam.priorities?.[id] ?? 2]));
  const verified = new Map(los.map((id) => [id, masteryProfile(db, id, now).verified]));
  const coverage = los.length ? los.filter((id) => verified.get(id)! >= 0.6).length / los.length : 0;
  const weakHighPriority = los.filter((id) => priorities[id] === 3 && verified.get(id)! < 0.6);
  const solved = new Set(Object.values(db.attempts).filter((a) => a.correct).map((a) => a.questionId));
  const practice = Object.values(db.questions)
    .filter((q) => !solved.has(q.id) && (q.purpose === "PRACTICE" || q.purpose === "MASTERY"))
    .map((q) => ({ q, lo: db.milestones[q.milestoneId]?.learningObjectIds?.find((id) => los.includes(id)) }))
    .filter((x) => x.lo)
    .sort((a, b) => priorities[b.lo!] - priorities[a.lo!] || a.q.difficulty - b.q.difficulty)
    .map((x) => x.q.id);
  const daysLeft = daysUntil(exam, now);
  const advice = weakHighPriority.length
    ? L(`Suggestion: ${weakHighPriority.length} high-priority topics are not solid yet — they may be worth your time first.`, `Öneri: ${weakHighPriority.length} yüksek öncelikli konu henüz oturmadı — önce bunlara zaman ayırmak işine yarayabilir.`)
    : L(`Coverage ${Math.round(coverage * 100)}%. Timed practice questions are a good use of the remaining ${daysLeft} days.`, `Kapsam %${Math.round(coverage * 100)}. Kalan ${daysLeft} günde süreli soru pratiği iyi bir seçenek olabilir.`);
  return { exam, daysLeft, priorities, coverage, weakHighPriority, practice, advice };
}

/** A path toward the exam topics with their priorities (the curriculum is not touched). */
export function planExamPath(db: LabDB, g: KnowledgeGraph, examId: ID, now: Millis = Date.now()): LearningPathPlan | null {
  const exam = db.exams[examId];
  if (!exam) return null;
  const goals = exam.loIds.filter((id) => g.objects[id]);
  if (!goals.length) return null;
  const priorities = Object.fromEntries(goals.map((id) => [id, exam.priorities?.[id] ?? 2]));
  const p = createPath(db, g, { goalIds: goals, exam: { id: exam.id, priorities }, title: `${exam.subject ? `${exam.subject} · ` : ""}${exam.title}` }, now);
  recordDecision(db, { role: "PATH_PLANNER", decision: `exam path ${p.id}`, reason: L("Exam mode: same graph, ordered by exam priority and deadline.", "Sınav modu: aynı grafik, sınav önceliği ve tarihe göre sıralandı."), confidence: 0.7, evidence: goals, ref: `exam:${exam.id}` }, now);
  return p;
}
