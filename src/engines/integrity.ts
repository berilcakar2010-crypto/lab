/**
 * Whole-database integrity audit: impossible milestone states, prerequisite
 * loops, dead ends, broken inverse edges and dangling references. Used by
 * tests (including a fuzz test) and available as a diagnostic in Settings.
 */
import type { LabDB, MilestoneStatus } from "../domain/types";
import { courseMilestones, validateCourse } from "./curriculum";
import { deriveStatus, SATISFIES_PREREQ } from "./progress";

export function auditDatabase(db: LabDB): string[] {
  const issues: string[] = [];
  for (const c of Object.values(db.courses)) {
    for (const i of validateCourse(db, c.id)) if (i.level === "error") issues.push(`${c.title}: ${i.message}`);
    const ms = courseMilestones(db, c.id);
    const statuses = new Map<string, MilestoneStatus>(ms.map((m) => [m.id, m.status]));
    if (ms.filter((m) => m.status === "ACTIVE").length > 1) issues.push(`${c.title}: birden fazla etkin adım`);
    if (c.activeMilestoneId && !db.milestones[c.activeMilestoneId]) issues.push(`${c.title}: etkin adım bulunamadı`);
    if (c.startHereMilestoneId && !db.milestones[c.startHereMilestoneId]) issues.push(`${c.title}: başlangıç adımı bulunamadı`);
    for (const m of ms) {
      const derived = deriveStatus(db, m, statuses);
      if (derived !== m.status) issues.push(`"${m.title}": kayıtlı durum ${m.status}, olması gereken ${derived}`);
      if (m.status === "MASTERED" && !m.masteredAt) issues.push(`"${m.title}": ustalık zamanı olmadan ustalaşılmış`);
      if (m.status === "LOCKED" && (m.manuallyUnlocked || m.prerequisites.every((p) => SATISFIES_PREREQ.has(statuses.get(p)!)))) {
        issues.push(`"${m.title}": açılabilir olduğu halde kilitli`);
      }
      for (const n of m.nextMilestones) if (!db.milestones[n]?.prerequisites.includes(m.id)) issues.push(`"${m.title}": eskimiş sonraki-adım bağlantısı`);
      for (const p of m.prerequisites) if (!db.milestones[p]?.nextMilestones.includes(m.id)) issues.push(`"${m.title}": eksik ters bağlantı`);
    }
    // No dead end: unless every milestone is done, something can be opened without an override.
    const unfinished = ms.filter((m) => !m.masteredAt && !m.skippedAt);
    if (unfinished.length && !unfinished.some((m) => m.status !== "LOCKED")) issues.push(`${c.title}: çıkmaz — açılabilecek hiçbir adım yok`);
  }
  for (const q of Object.values(db.questions)) if (!db.milestones[q.milestoneId]) issues.push(`Adımı olmayan soru (${q.id})`);
  for (const r of Object.values(db.retention)) {
    if (!r.completedAt && !db.milestones[r.milestoneId]) issues.push(`Silinmiş bir adım için bekleyen kalıcılık kontrolü (${r.id})`);
    if (!r.completedAt && !db.questions[r.questionId]) issues.push(`Sorusu olmayan bekleyen kalıcılık kontrolü (${r.id})`);
  }
  for (const m of Object.values(db.milestones)) if (!db.courses[m.courseId]) issues.push(`Dersi olmayan adım (${m.title})`);
  return issues;
}
