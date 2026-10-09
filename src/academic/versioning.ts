/**
 * Versioning for records whose history matters (goals, projects). Before a
 * change, the fields about to change are snapshotted with a summary; the list
 * is capped so years of edits stay small. `restoreVersion` brings a snapshot
 * back as a new change (history is never rewritten).
 */
import type { Millis } from "../domain/types";
import type { VersionEntry } from "../domain/academic";

export const VERSION_CAP = 40;

export function pushVersion<T extends { versions: VersionEntry[]; updatedAt: Millis }>(rec: T, patch: Partial<T>, summary: string, now: Millis = Date.now()): string[] {
  const changed = (Object.keys(patch) as (keyof T)[]).filter((k) => k !== "versions" && k !== "updatedAt" && JSON.stringify(rec[k]) !== JSON.stringify(patch[k]));
  if (!changed.length) return [];
  const snapshot: Record<string, unknown> = {};
  for (const k of changed) snapshot[k as string] = structuredClone(rec[k]);
  rec.versions = [...rec.versions, { at: now, summary, snapshot }].slice(-VERSION_CAP);
  Object.assign(rec, patch);
  rec.updatedAt = now;
  return changed as string[];
}

export function restoreVersion<T extends { versions: VersionEntry[]; updatedAt: Millis }>(rec: T, index: number, summary: string, now: Millis = Date.now()): string[] {
  const v = rec.versions[index];
  if (!v) return [];
  return pushVersion(rec, structuredClone(v.snapshot) as Partial<T>, summary, now);
}
