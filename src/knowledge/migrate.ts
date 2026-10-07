/**
 * One-off data migrations for the knowledge graph. They only add links; no
 * record is changed or deleted, so they are safe to run on every load and on
 * restored backups (each runs once, recorded in db.knowledge.migrations).
 */
import type { LabDB } from "../domain/types";
import { PACK_LO, packKeyForTitle } from "./packLinks";

export interface MigrationResult {
  id: string;
  linked: number;
  ran: boolean;
}

/** v2.0: link milestones created from the Mekanik/Kalkülüs packs (Turkish or old English titles) to graph objects. */
export function linkPackMilestones(db: LabDB, now = Date.now()): MigrationResult {
  const id = "v2-link-milestones";
  if (db.knowledge.migrations.some((m) => m.id === id)) return { id, linked: 0, ran: false };
  let linked = 0;
  for (const m of Object.values(db.milestones)) {
    if (m.learningObjectIds?.length) continue;
    const key = m.sourceKey ?? packKeyForTitle(m.title);
    const lo = key ? PACK_LO[key] : undefined;
    if (!key || !lo) continue;
    m.sourceKey = key;
    m.learningObjectIds = [...lo];
    linked++;
  }
  db.knowledge.migrations.push({
    id,
    at: now,
    note: linked
      ? `${linked} mevcut adım bilgi grafiğine bağlandı; ilerleme, ustalık ve deneme kayıtları olduğu gibi korundu. | ${linked} existing steps were linked to the knowledge graph; progress, mastery and attempts are unchanged.`
      : "Bağlanacak eski paket adımı bulunmadı. | No older pack steps needed linking.",
  });
  return { id, linked, ran: true };
}

export function runKnowledgeMigrations(db: LabDB, now = Date.now()): MigrationResult[] {
  return [linkPackMilestones(db, now)];
}
