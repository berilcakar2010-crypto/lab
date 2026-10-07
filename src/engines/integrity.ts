/**
 * Whole-database integrity audit: impossible milestone states, prerequisite
 * loops, dead ends, broken inverse edges and dangling references. Used by
 * tests (including a fuzz test) and available as a diagnostic in Settings.
 */
import type { LabDB, MilestoneStatus } from "../domain/types";
import { L } from "../i18n";
import { courseMilestones, validateCourse } from "./curriculum";
import { deriveStatus, SATISFIES_PREREQ } from "./progress";

export function auditDatabase(db: LabDB): string[] {
  const issues: string[] = [];
  for (const c of Object.values(db.courses)) {
    for (const i of validateCourse(db, c.id)) if (i.level === "error") issues.push(`${c.title}: ${i.message}`);
    const ms = courseMilestones(db, c.id);
    const statuses = new Map<string, MilestoneStatus>(ms.map((m) => [m.id, m.status]));
    if (ms.filter((m) => m.status === "ACTIVE").length > 1) issues.push(L(`${c.title}: more than one active milestone`, `${c.title}: birden fazla etkin adım`));
    if (c.activeMilestoneId && !db.milestones[c.activeMilestoneId]) issues.push(L(`${c.title}: active milestone missing`, `${c.title}: etkin adım bulunamadı`));
    if (c.startHereMilestoneId && !db.milestones[c.startHereMilestoneId]) issues.push(L(`${c.title}: start-here milestone missing`, `${c.title}: başlangıç adımı bulunamadı`));
    for (const m of ms) {
      const derived = deriveStatus(db, m, statuses);
      if (derived !== m.status) issues.push(L(`"${m.title}": stored ${m.status} but facts say ${derived}`, `"${m.title}": kayıtlı durum ${m.status}, olması gereken ${derived}`));
      if (m.status === "MASTERED" && !m.masteredAt) issues.push(L(`"${m.title}": mastered without a mastery time`, `"${m.title}": ustalık zamanı olmadan ustalaşılmış`));
      if (m.status === "LOCKED" && (m.manuallyUnlocked || m.prerequisites.every((p) => SATISFIES_PREREQ.has(statuses.get(p)!)))) {
        issues.push(L(`"${m.title}": locked although it is unlockable`, `"${m.title}": açılabilir olduğu halde kilitli`));
      }
      for (const n of m.nextMilestones) if (!db.milestones[n]?.prerequisites.includes(m.id)) issues.push(L(`"${m.title}": stale next-milestone edge`, `"${m.title}": eskimiş sonraki-adım bağlantısı`));
      for (const p of m.prerequisites) if (!db.milestones[p]?.nextMilestones.includes(m.id)) issues.push(L(`"${m.title}": missing inverse edge`, `"${m.title}": eksik ters bağlantı`));
    }
    // No dead end: unless every milestone is done, something can be opened without an override.
    const unfinished = ms.filter((m) => !m.masteredAt && !m.skippedAt);
    if (unfinished.length && !unfinished.some((m) => m.status !== "LOCKED")) issues.push(L(`${c.title}: dead end — nothing can be opened`, `${c.title}: çıkmaz — açılabilecek hiçbir adım yok`));
  }
  for (const q of Object.values(db.questions)) if (!db.milestones[q.milestoneId]) issues.push(L(`Question without milestone (${q.id})`, `Adımı olmayan soru (${q.id})`));
  for (const r of Object.values(db.retention)) {
    if (!r.completedAt && !db.milestones[r.milestoneId]) issues.push(L(`Pending retention check for a deleted milestone (${r.id})`, `Silinmiş bir adım için bekleyen kalıcılık kontrolü (${r.id})`));
    if (!r.completedAt && !db.questions[r.questionId]) issues.push(L(`Pending retention check without question (${r.id})`, `Sorusu olmayan bekleyen kalıcılık kontrolü (${r.id})`));
  }
  for (const m of Object.values(db.milestones)) if (!db.courses[m.courseId]) issues.push(L(`Milestone without course (${m.title})`, `Dersi olmayan adım (${m.title})`));
  return issues;
}
