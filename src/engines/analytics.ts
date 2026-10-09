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
  /** Graph objects the event is about; defaults to the milestone's objects. */
  loIds?: string[];
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
    userId: db.user?.id,
    loIds: ctx.loIds?.length ? [...ctx.loIds] : m?.learningObjectIds?.length ? [...m.learningObjectIds] : undefined,
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

// ---------------------------------------------------------------------------
// Reconstruction (everything below is derived from raw events only)
// ---------------------------------------------------------------------------

export interface SessionTimes {
  startedAt: number;
  endedAt: number;
  totalMs: number;
  idleMs: number;
  hiddenMs: number;
  activeMs: number;
  interruptions: number;
}

/**
 * Active time = session span − idle intervals − interruption (hidden) intervals.
 * Open intervals are closed at the session end (or the last event).
 */
export function computeSessionTimes(events: AnalyticsEvent[], fallbackEnd?: number): SessionTimes | null {
  const evs = [...events].sort((a, b) => a.at - b.at);
  const start = evs.find((e) => e.type === "SESSION_START")?.at ?? evs[0]?.at;
  if (start === undefined) return null;
  const endEv = evs.find((e) => e.type === "SESSION_END");
  const end = endEv?.at ?? Math.max(fallbackEnd ?? 0, evs[evs.length - 1].at);
  let idleMs = 0, hiddenMs = 0, interruptions = 0;
  let idleFrom: number | null = null, hiddenFrom: number | null = null;
  for (const e of evs) {
    if (e.at > end) break;
    if (e.type === "IDLE_START" && idleFrom === null) idleFrom = e.at;
    else if (e.type === "IDLE_END" && idleFrom !== null) {
      idleMs += Math.max(0, e.at - idleFrom);
      idleFrom = null;
    } else if (e.type === "INTERRUPTION" && e.data.phase === "start" && hiddenFrom === null) {
      // An interruption ends any idle stretch so time is never double counted.
      if (idleFrom !== null) {
        idleMs += Math.max(0, e.at - idleFrom);
        idleFrom = null;
      }
      hiddenFrom = e.at;
      interruptions++;
    } else if (e.type === "INTERRUPTION" && e.data.phase === "end" && hiddenFrom !== null) {
      hiddenMs += Math.max(0, e.at - hiddenFrom);
      hiddenFrom = null;
    }
  }
  if (idleFrom !== null) idleMs += Math.max(0, end - idleFrom);
  if (hiddenFrom !== null) hiddenMs += Math.max(0, end - hiddenFrom);
  const totalMs = Math.max(0, end - start);
  return { startedAt: start, endedAt: end, totalMs, idleMs, hiddenMs, activeMs: Math.max(0, totalMs - idleMs - hiddenMs), interruptions };
}

export interface MilestoneVisit {
  milestoneId: ID;
  openedAt: number;
  closedAt: number | null;
  outcome: "COMPLETED" | "ABANDONED" | "SKIPPED" | "OPEN";
  attempts: number;
  correct: number;
  retries: number;
  hints: number;
  maxHintLevel: number;
  aiInteractions: number;
  inputMethods: string[];
  usedStylus: boolean;
}

export interface SessionReconstruction {
  sessionId: ID;
  times: SessionTimes | null;
  visits: MilestoneVisit[];
  attempts: number;
  correct: number;
  retries: number;
  hints: number;
  aiInteractions: number;
  completions: number;
  abandonments: number;
  continued: boolean | null;
  endReason: string | null;
  inputMethods: Record<string, number>;
  confidence: number[];
}

/** Rebuild what happened in a session from its raw events alone. */
export function reconstructSession(db: LabDB, sessionId: ID): SessionReconstruction {
  const evs = sessionEvents(db, sessionId);
  const visits: MilestoneVisit[] = [];
  const current = new Map<ID, MilestoneVisit>();
  const inputs: Record<string, number> = {};
  const r: SessionReconstruction = {
    sessionId, times: computeSessionTimes(evs), visits, attempts: 0, correct: 0, retries: 0, hints: 0, aiInteractions: 0,
    completions: 0, abandonments: 0, continued: null, endReason: null, inputMethods: inputs, confidence: [],
  };
  const visitFor = (e: AnalyticsEvent): MilestoneVisit | undefined => (e.milestoneId ? current.get(e.milestoneId) : undefined);
  const close = (id: ID, at: number, outcome: MilestoneVisit["outcome"]) => {
    const v = current.get(id);
    if (v && v.outcome === "OPEN") {
      v.closedAt = at;
      v.outcome = outcome;
      current.delete(id);
    }
  };
  for (const e of evs) {
    switch (e.type) {
      case "MILESTONE_OPEN": {
        if (e.milestoneId && current.has(e.milestoneId)) break; // re-open of the same visit
        const v: MilestoneVisit = { milestoneId: e.milestoneId!, openedAt: e.at, closedAt: null, outcome: "OPEN", attempts: 0, correct: 0, retries: 0, hints: 0, maxHintLevel: 0, aiInteractions: 0, inputMethods: [], usedStylus: false };
        visits.push(v);
        current.set(v.milestoneId, v);
        break;
      }
      case "ATTEMPT": {
        r.attempts++;
        if (e.data.correct) r.correct++;
        const m = String(e.data.inputMethod ?? "unknown");
        inputs[m] = (inputs[m] ?? 0) + 1;
        if (typeof e.data.confidence === "number") r.confidence.push(e.data.confidence);
        const v = visitFor(e);
        if (v) {
          v.attempts++;
          if (e.data.correct) v.correct++;
          if (!v.inputMethods.includes(m)) v.inputMethods.push(m);
          if (e.data.usedStylus) v.usedStylus = true;
          v.maxHintLevel = Math.max(v.maxHintLevel, Number(e.data.hintLevel ?? 0));
        }
        break;
      }
      case "RETRY": {
        r.retries++;
        const v = visitFor(e);
        if (v) v.retries++;
        break;
      }
      case "HINT_REQUEST": {
        r.hints++;
        const v = visitFor(e);
        if (v) {
          v.hints++;
          v.maxHintLevel = Math.max(v.maxHintLevel, Number(e.data.level ?? 0));
        }
        break;
      }
      case "AI_INTERACTION": {
        r.aiInteractions++;
        const v = visitFor(e);
        if (v) v.aiInteractions++;
        break;
      }
      case "INPUT": {
        const v = visitFor(e);
        if (v && e.data.method === "pen") v.usedStylus = true;
        break;
      }
      case "MILESTONE_COMPLETE":
        r.completions++;
        if (e.milestoneId) close(e.milestoneId, e.at, "COMPLETED");
        break;
      case "MILESTONE_ABANDON":
        r.abandonments++;
        if (e.milestoneId) close(e.milestoneId, e.at, "ABANDONED");
        break;
      case "MILESTONE_SKIP":
        if (e.milestoneId) close(e.milestoneId, e.at, "SKIPPED");
        break;
      case "CONTINUE_DECISION":
        r.continued = !!e.data.continued;
        break;
      case "SESSION_END":
        r.endReason = String(e.data.reason ?? "");
        break;
    }
  }
  return r;
}
