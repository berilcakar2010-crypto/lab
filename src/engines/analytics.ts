/**
 * Raw analytics event log. Every meaningful interaction appends an immutable
 * event; all statistics are recomputed from these events and the raw records,
 * never stored as final numbers only.
 */
import type { AnalyticsEvent, EventType, ID, LabDB } from "../domain/types";
import { newId } from "../data/ids";

export interface EventContext {
  sessionId?: ID;
  milestoneId?: ID;
  courseId?: ID;
  questionId?: ID;
  at?: number;
}

export function logEvent(
  db: LabDB,
  type: EventType,
  ctx: EventContext = {},
  data: Record<string, unknown> = {},
): AnalyticsEvent {
  const m = ctx.milestoneId ? db.milestones[ctx.milestoneId] : undefined;
  const courseId = ctx.courseId ?? m?.courseId;
  const ev: AnalyticsEvent = {
    id: newId("ev"),
    type,
    at: ctx.at ?? Date.now(),
    sessionId: ctx.sessionId,
    courseId,
    subjectId: m?.subjectId ?? (courseId ? db.courses[courseId]?.subjectId : undefined),
    unitId: m?.unitId,
    topicId: m?.topicId,
    conceptIds: m?.conceptIds.length ? [...m.conceptIds] : undefined,
    milestoneId: ctx.milestoneId,
    questionId: ctx.questionId,
    data: {
      ...data,
      // Snapshot milestone characteristics so stats survive later edits/deletes.
      ...(m
        ? {
            milestoneType: m.milestoneType,
            difficulty: m.difficulty,
            estimatedDuration: m.estimatedDuration,
            scope: m.scope,
            interactionType: m.recommendedInteractionType,
          }
        : {}),
    },
  };
  db.events.push(ev);
  return ev;
}

export const eventsOf = (db: LabDB, type: EventType) => db.events.filter((e) => e.type === type);

export const sessionEvents = (db: LabDB, sessionId: ID) =>
  db.events.filter((e) => e.sessionId === sessionId).sort((a, b) => a.at - b.at);
