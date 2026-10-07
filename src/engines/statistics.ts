/**
 * Statistics engine (expanded in Phase 8). Everything is derived from raw
 * events and records.
 */
import type { LabDB, MilestoneType } from "../domain/types";

/** Continuation lift per milestone type; empty until there is enough data (Phase 8). */
export function engagementLift(_db: LabDB): Partial<Record<MilestoneType, number>> {
  return {};
}
