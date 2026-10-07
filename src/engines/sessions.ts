/**
 * Session lifecycle. A session spans several milestones; it is reused while
 * the user keeps working and closed automatically when abandoned.
 */
import type { ID, LabDB, Session } from "../domain/types";
import { endSession, startSession } from "./progress";
import { assignArms } from "./experiments";

export const SESSION_IDLE_LIMIT_MS = 30 * 60_000;

export function lastActivity(db: LabDB, s: Session): number {
  let last = s.startedAt;
  for (let i = db.events.length - 1; i >= 0; i--) {
    const e = db.events[i];
    if (e.sessionId === s.id) {
      last = Math.max(last, e.at);
      break;
    }
  }
  return last;
}

/** End any open sessions that have been inactive too long (closed tab, lost device). */
export function closeStaleSessions(db: LabDB, now = Date.now()) {
  for (const s of Object.values(db.sessions)) {
    if (s.endedAt) continue;
    const last = lastActivity(db, s);
    if (now - last > SESSION_IDLE_LIMIT_MS) endSession(db, s.id, "ABANDONED", last);
  }
}

export function openSessions(db: LabDB): Session[] {
  return Object.values(db.sessions).filter((s) => !s.endedAt).sort((a, b) => b.startedAt - a.startedAt);
}

/** Reuse the current open session or start a new one. */
export function ensureSession(db: LabDB, courseId: ID | undefined, now = Date.now()): Session {
  closeStaleSessions(db, now);
  const open = openSessions(db)[0];
  if (open) {
    if (!open.courseId && courseId) open.courseId = courseId;
    return open;
  }
  const s = startSession(db, courseId, now);
  assignArms(db, s);
  return s;
}
