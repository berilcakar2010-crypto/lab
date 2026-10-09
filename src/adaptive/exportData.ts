/**
 * Data ownership: the adaptive layer's records in one file — paths, errors and
 * repairs, insights, mastery profiles, retention, experiments with reports,
 * provenance, sources, curriculum versions and proposals, AI/engine decisions,
 * research, sandbox runs and predictions. Ids are kept, so relations survive
 * an import (into the same or another device's Lab). The full backup in
 * Settings remains the complete copy of everything.
 */
import type { LabDB, Millis } from "../domain/types";
import { allProfiles } from "./mastery";

export const ADAPTIVE_EXPORT_VERSION = 1;

const MERGE_TABLES = ["paths", "errors", "insights", "sources", "curriculumProposals", "research", "sandboxRuns", "predictions", "decisions"] as const;

export function adaptiveExport(db: LabDB, now: Millis = Date.now()): string {
  return JSON.stringify({
    kind: "lab-adaptive",
    version: ADAPTIVE_EXPORT_VERSION,
    exportedAt: new Date(now).toISOString(),
    userId: db.user.id,
    paths: Object.values(db.paths),
    errors: Object.values(db.errors),
    repairs: Object.values(db.errors).filter((e) => e.repair).map((e) => ({ errorId: e.id, ...e.repair, resolution: e.resolution, resolvedAt: e.resolvedAt })),
    insights: Object.values(db.insights),
    masteryProfiles: allProfiles(db, now),
    retention: { topicReviews: Object.values(db.topicReviews), checks: Object.values(db.retention) },
    experiments: Object.values(db.experiments),
    provenance: db.knowledge.provenance ?? {},
    sources: Object.values(db.sources),
    curriculumVersions: db.knowledge.history,
    curriculumProposals: Object.values(db.curriculumProposals),
    aiDecisions: Object.values(db.decisions),
    aiInteractions: Object.values(db.aiInteractions),
    research: Object.values(db.research),
    sandboxRuns: Object.values(db.sandboxRuns),
    predictions: Object.values(db.predictions),
  }, null, 2);
}

/**
 * Merge an adaptive export into this database. Existing records are never
 * overwritten (local data wins); new ones are added with their ids, so their
 * relations stay intact. Returns how many records were added per table.
 */
export function importAdaptive(db: LabDB, text: string): Record<string, number> {
  const data = JSON.parse(text) as Record<string, unknown>;
  if (data?.kind !== "lab-adaptive") throw new Error("Not a Lab adaptive export");
  const added: Record<string, number> = {};
  const map: Record<(typeof MERGE_TABLES)[number], string> = {
    paths: "paths", errors: "errors", insights: "insights", sources: "sources", curriculumProposals: "curriculumProposals",
    research: "research", sandboxRuns: "sandboxRuns", predictions: "predictions", decisions: "aiDecisions",
  };
  for (const t of MERGE_TABLES) {
    const rows = data[map[t]];
    if (!Array.isArray(rows)) continue;
    const table = db[t] as Record<string, { id: string }>;
    let n = 0;
    for (const r of rows as { id?: unknown }[]) {
      if (!r || typeof r.id !== "string" || table[r.id]) continue;
      table[r.id] = r as { id: string };
      n++;
    }
    added[t] = n;
  }
  const prov = data.provenance as Record<string, unknown> | undefined;
  if (prov && typeof prov === "object") db.knowledge.provenance = { ...(prov as NonNullable<LabDB["knowledge"]["provenance"]>), ...(db.knowledge.provenance ?? {}) };
  return added;
}
