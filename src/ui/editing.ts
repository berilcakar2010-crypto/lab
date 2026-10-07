import type { ID, LabDB } from "../domain/types";
import { assertValidCourse } from "../engines/curriculum";
import { logEvent } from "../engines/analytics";
import { recomputeStatuses } from "../engines/progress";
import { store, toast } from "./state";

/**
 * Apply a curriculum edit atomically: run on a copy, validate the graph,
 * recompute statuses, log the raw edit event, then swap in. On error the
 * curriculum is untouched and the user sees why.
 */
export function editCurriculum<T>(courseId: ID, action: string, fn: (db: LabDB) => T, success?: string): T | undefined {
  try {
    const r = store.transact(
      (db) => {
        const out = fn(db);
        if (db.courses[courseId]) {
          recomputeStatuses(db, courseId);
          logEvent(db, "CURRICULUM_EDIT", { courseId }, { action });
        }
        return out;
      },
      (db) => {
        if (db.courses[courseId]) assertValidCourse(db, courseId);
      },
    );
    if (success) toast(success);
    return r;
  } catch (e) {
    toast(e instanceof Error ? e.message : String(e), "error");
    return undefined;
  }
}
