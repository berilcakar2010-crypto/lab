/**
 * School layer: subjects (school, AP, competition, language), grades, and how
 * a passed deadline is handled. School data never changes the knowledge
 * graph; a subject only links to graph objects by id. Academic years are a
 * label on the subject — nothing is reset when a new year starts.
 */
import type { ID, LabDB, Millis } from "../domain/types";
import { SCHOOL_SUBJECT_KINDS, type GradeRecord, type SchoolSubject, type SchoolSubjectKind } from "../domain/academic";
import type { KnowledgeGraph } from "../knowledge/schema";
import { newId } from "../data/ids";
import { L } from "../i18n";
import { masteryProfile } from "../adaptive/mastery";

const DAY = 86_400_000;

export const SUBJECT_KIND_LABEL = (k: SchoolSubjectKind): string =>
  ({ SCHOOL: L("School subject", "Okul dersi"), AP: "AP", COMPETITION: L("Competition", "Yarışma"), LANGUAGE: L("Language", "Dil"), OTHER: L("Other", "Diğer") })[k];

export function addSchoolSubject(db: LabDB, input: { name: string; kind?: SchoolSubjectKind; year?: string; loIds?: string[] }, now: Millis = Date.now()): SchoolSubject {
  const name = input.name.trim().slice(0, 120);
  if (!name) throw new Error(L("Name the subject.", "Dersin adını yaz."));
  const s: SchoolSubject = { id: newId("ssub"), name, kind: input.kind && SCHOOL_SUBJECT_KINDS.includes(input.kind) ? input.kind : "SCHOOL", year: input.year?.trim() || undefined, loIds: [...new Set(input.loIds ?? [])], createdAt: now };
  db.schoolSubjects[s.id] = s;
  return s;
}

export function updateSchoolSubject(db: LabDB, id: ID, patch: Partial<Omit<SchoolSubject, "id" | "createdAt">>): void {
  const s = db.schoolSubjects[id];
  if (!s) return;
  Object.assign(s, patch);
  if (patch.loIds) s.loIds = [...new Set(patch.loIds)];
}

export function addGrade(db: LabDB, input: { subjectId: ID; title: string; score: number; outOf: number; weight?: number; examId?: ID; at?: Millis }, now: Millis = Date.now()): GradeRecord {
  if (!db.schoolSubjects[input.subjectId]) throw new Error(L("Subject not found.", "Ders bulunamadı."));
  if (!(input.outOf > 0) || !Number.isFinite(input.score) || input.score < 0) throw new Error(L("Enter a score and the maximum (e.g. 85 of 100).", "Bir puan ve en yüksek puanı gir (ör. 100 üzerinden 85)."));
  const r: GradeRecord = { id: newId("grd"), subjectId: input.subjectId, title: input.title.trim().slice(0, 120) || L("Grade", "Not"), score: input.score, outOf: input.outOf, weight: input.weight && input.weight > 0 ? input.weight : undefined, examId: input.examId, at: input.at ?? now };
  db.grades[r.id] = r;
  return r;
}

export function deleteGrade(db: LabDB, id: ID): void {
  delete db.grades[id];
}

export interface SubjectSummary {
  subject: SchoolSubject;
  grades: GradeRecord[];
  /** Weighted average 0..1, or null without grades. */
  average: number | null;
  /** Verified mastery of the linked graph objects (0..1), or null without links. */
  mastery: number | null;
  upcoming: number;
}

export function subjectSummary(db: LabDB, id: ID, now: Millis = Date.now()): SubjectSummary | null {
  const s = db.schoolSubjects[id];
  if (!s) return null;
  const grades = Object.values(db.grades).filter((g) => g.subjectId === id).sort((a, b) => a.at - b.at);
  let w = 0, sum = 0;
  for (const g of grades) {
    const wt = g.weight ?? 1;
    w += wt;
    sum += wt * (g.score / g.outOf);
  }
  const ms = s.loIds.map((lo) => masteryProfile(db, lo, now).verified);
  const name = s.name.toLocaleLowerCase();
  const upcoming = Object.values(db.exams).filter((e) => e.date > now && !e.result && (e.subject.toLocaleLowerCase() === name || e.loIds.some((lo) => s.loIds.includes(lo)))).length;
  return { subject: s, grades, average: w ? sum / w : null, mastery: ms.length ? ms.reduce((a, b) => a + b, 0) / ms.length : null, upcoming };
}

/**
 * Deadlines that passed without a result. Never "failed": the plan simply
 * changed, and Lab recomputes the sensible options from here.
 */
export interface PassedDeadline {
  examId: ID;
  title: string;
  daysAgo: number;
  /** Covered topics that still have little verified evidence. */
  openTopics: string[];
  message: string;
}

export function passedDeadlines(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now(), windowDays = 14): PassedDeadline[] {
  return Object.values(db.exams)
    .filter((e) => !e.result && e.date < now - 3 * 3600_000 && e.date > now - windowDays * DAY)
    .sort((a, b) => b.date - a.date)
    .map((e) => {
      const openTopics = e.loIds.filter((lo) => g.objects[lo] && masteryProfile(db, lo, now).verified < 0.6);
      const daysAgo = Math.max(0, Math.round((now - e.date) / DAY));
      return {
        examId: e.id,
        title: e.title,
        daysAgo,
        openTopics,
        message: openTopics.length
          ? L(`The date for "${e.title}" has passed. Plans change — ${openTopics.length} of its topics are still open, and they stay on your map. Recalculating the most sensible next options.`, `"${e.title}" tarihi geçti. Planlar değişir — konularından ${openTopics.length} tanesi hâlâ açık ve haritanda duruyor. En mantıklı sonraki seçenekler yeniden hesaplanıyor.`)
          : L(`The date for "${e.title}" has passed. You can add the result whenever you like.`, `"${e.title}" tarihi geçti. Sonucu istediğin zaman ekleyebilirsin.`),
      };
    });
}
