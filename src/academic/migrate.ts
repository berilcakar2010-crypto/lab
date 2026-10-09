/**
 * Schema v4 (academic layer). New tables are filled with defaults by
 * `hydrateDB`; this migration only reconciles preferences and records itself.
 * It is deterministic and idempotent: it runs once per database (recorded in
 * `db.knowledge.migrations`) and never deletes or rewrites learner records.
 */
import type { LabDB, Millis } from "../domain/types";

export const ACADEMIC_MIGRATION_ID = "v4-academic-layer";

export function runAcademicMigrations(db: LabDB, existing: boolean, now: Millis = Date.now()): boolean {
  if (db.knowledge.migrations.some((m) => m.id === ACADEMIC_MIGRATION_ID)) return false;
  // Older data only knew reduceMotion; carry it over to the animation level.
  if (db.preferences.reduceMotion && db.preferences.animation === "full") db.preferences.animation = "reduced";
  // Existing learners never see the first-run question again.
  const hasData = Object.keys(db.courses).length > 0 || Object.keys(db.attempts).length > 0 || db.knowledge.goals.length > 0;
  if (existing && hasData && !db.preferences.firstRunAt) db.preferences.firstRunAt = now;
  const claims = Object.keys(db.knowledge.selfAttested).length;
  db.knowledge.migrations.push({
    id: ACADEMIC_MIGRATION_ID,
    at: now,
    note: claims
      ? `Akademik katman eklendi (günlük, projeler, eserler, hedefler, okul, bilgi kontrolleri). ${claims} eski "biliyorum" beyanı korundu ve kısa testle doğrulanabilir olarak işaretlendi. | Academic layer added (journal, projects, artifacts, goals, school, knowledge checks). ${claims} earlier "I know this" claims were kept and can be confirmed with a short check.`
      : "Akademik katman eklendi (günlük, projeler, eserler, hedefler, okul, bilgi kontrolleri). | Academic layer added (journal, projects, artifacts, goals, school, knowledge checks).",
  });
  return true;
}
