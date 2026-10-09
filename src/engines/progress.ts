/**
 * Progress engine: derives milestone status from raw facts (mastery, skips,
 * attempts, retention, prerequisites) and records attempts, sessions, mastery,
 * retention and engagement. Status is always derived, so impossible states
 * (e.g. an AVAILABLE milestone with unmet prerequisites) cannot persist.
 */
import type {
  Attempt, EngagementRecord, ID, LabDB, MasteryRecord, Milestone, MilestoneStatus, RetentionCheck,
  RetentionKind, Session, SessionEndReason,
} from "../domain/types";
import { newId } from "../data/ids";
import { L } from "../i18n";
import { courseMilestones, milestoneQuestions } from "./curriculum";
import { computeSessionTimes, logEvent, sessionEvents } from "./analytics";
import { detectPatterns, recordError, updateRepairs } from "../adaptive/errors";

const DAY = 86_400_000;

/** Statuses that satisfy a dependent's prerequisite. Skipping is a user override. */
export const SATISFIES_PREREQ: ReadonlySet<MilestoneStatus> = new Set(["MASTERED", "NEEDS_REVIEW", "SKIPPED"]);

/** Statuses meaning "can be opened now without an override". */
export const OPENABLE: ReadonlySet<MilestoneStatus> = new Set([
  "AVAILABLE", "ACTIVE", "ATTEMPTED", "OPTIONAL", "BOSS", "NEEDS_REVIEW", "MASTERED", "SKIPPED",
]);

export const attemptsFor = (db: LabDB, milestoneId: ID): Attempt[] =>
  Object.values(db.attempts).filter((a) => a.milestoneId === milestoneId).sort((a, b) => a.createdAt - b.createdAt);

export function lastRetentionFailed(db: LabDB, milestoneId: ID): boolean {
  const done = Object.values(db.retention)
    .filter((r) => r.milestoneId === milestoneId && r.completedAt)
    .sort((a, b) => a.completedAt! - b.completedAt!);
  const last = done[done.length - 1];
  if (!last || last.correct) return false;
  // A later successful review attempt restores mastery.
  const recovered = Object.values(db.attempts).some(
    (a) => a.milestoneId === milestoneId && a.createdAt > last.completedAt! && a.correct && a.purpose !== "PRACTICE",
  );
  return !recovered;
}

function prereqsSatisfied(db: LabDB, m: Milestone, statuses: Map<ID, MilestoneStatus>): boolean {
  return m.prerequisites.every((p) => {
    const s = statuses.get(p) ?? db.milestones[p]?.status;
    return s === undefined || SATISFIES_PREREQ.has(s);
  });
}

/** Derive one milestone's status given its prerequisites' statuses. */
export function deriveStatus(db: LabDB, m: Milestone, statuses: Map<ID, MilestoneStatus>): MilestoneStatus {
  if (m.masteredAt) return lastRetentionFailed(db, m.id) ? "NEEDS_REVIEW" : "MASTERED";
  if (m.skippedAt) return "SKIPPED";
  const unlocked = m.manuallyUnlocked || prereqsSatisfied(db, m, statuses);
  if (!unlocked) return "LOCKED";
  if (db.courses[m.courseId]?.activeMilestoneId === m.id) return "ACTIVE";
  if (attemptsFor(db, m.id).length) return "ATTEMPTED";
  if (m.milestoneType === "BOSS") return "BOSS";
  if (m.optional) return "OPTIONAL";
  return "AVAILABLE";
}

/** Recompute all statuses in a course in prerequisite order. Returns changed ids. */
export function recomputeStatuses(db: LabDB, courseId: ID): { id: ID; from: MilestoneStatus; to: MilestoneStatus }[] {
  const ms = courseMilestones(db, courseId);
  const statuses = new Map<ID, MilestoneStatus>();
  const changes: { id: ID; from: MilestoneStatus; to: MilestoneStatus }[] = [];
  // Iterate to a fixed point; graphs are acyclic so depth+1 passes suffice.
  for (let pass = 0; pass <= ms.length; pass++) {
    let changed = false;
    for (const m of ms) {
      const s = deriveStatus(db, m, statuses);
      if (statuses.get(m.id) !== s) {
        statuses.set(m.id, s);
        changed = true;
      }
    }
    if (!changed) break;
  }
  for (const m of ms) {
    const to = statuses.get(m.id)!;
    if (m.status !== to) {
      changes.push({ id: m.id, from: m.status, to });
      m.status = to;
    }
  }
  const course = db.courses[courseId];
  if (course?.activeMilestoneId && !db.milestones[course.activeMilestoneId]) course.activeMilestoneId = undefined;
  return changes;
}

export function recomputeAll(db: LabDB) {
  for (const c of Object.values(db.courses)) recomputeStatuses(db, c.id);
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export function startSession(db: LabDB, courseId?: ID, at = Date.now()): Session {
  const s: Session = { id: newId("sess"), courseId, startedAt: at, milestoneIds: [], activeMs: 0, idleMs: 0, experimentArms: {} };
  db.sessions[s.id] = s;
  logEvent(db, "SESSION_START", { sessionId: s.id, courseId, at });
  return s;
}

export function endSession(db: LabDB, sessionId: ID, reason: SessionEndReason, at = Date.now()) {
  const s = db.sessions[sessionId];
  if (!s || s.endedAt) return;
  s.endedAt = at;
  s.endReason = reason;
  logEvent(db, "SESSION_END", { sessionId, courseId: s.courseId, at }, { reason });
  // Cached for convenience only; the source of truth is the event log.
  const times = computeSessionTimes(sessionEvents(db, sessionId));
  if (times) {
    s.activeMs = times.activeMs;
    s.idleMs = times.idleMs + times.hiddenMs;
  }
}

/** Opening a milestone makes it the course's single ACTIVE milestone. */
export function openMilestone(db: LabDB, sessionId: ID, milestoneId: ID, opts: { override?: boolean } = {}) {
  const m = db.milestones[milestoneId];
  if (!m) throw new Error(L("Unknown milestone", "Bilinmeyen adım"));
  if (m.status === "LOCKED") {
    if (!opts.override) throw new Error(L("Milestone is locked; open with override to proceed anyway", "Bu adım kilitli; yine de devam etmek için kilidi elle aç"));
    m.manuallyUnlocked = true;
  }
  if (m.skippedAt) m.skippedAt = undefined;
  db.courses[m.courseId].activeMilestoneId = m.id;
  const s = db.sessions[sessionId];
  if (s) {
    if (!s.milestoneIds.includes(m.id)) s.milestoneIds.push(m.id);
    s.courseId ??= m.courseId;
  }
  logEvent(db, "MILESTONE_OPEN", { sessionId, milestoneId }, { override: !!opts.override, statusBefore: m.status });
  recomputeStatuses(db, m.courseId);
}

export function leaveMilestone(db: LabDB, sessionId: ID, milestoneId: ID, completed: boolean) {
  const m = db.milestones[milestoneId];
  if (!m) return;
  const course = db.courses[m.courseId];
  if (course.activeMilestoneId === milestoneId) course.activeMilestoneId = undefined;
  if (!completed) logEvent(db, "MILESTONE_ABANDON", { sessionId, milestoneId });
  recomputeStatuses(db, m.courseId);
}

export function skipMilestone(db: LabDB, milestoneId: ID, sessionId?: ID) {
  const m = db.milestones[milestoneId];
  if (!m || m.masteredAt) return;
  m.skippedAt = Date.now();
  const course = db.courses[m.courseId];
  if (course.activeMilestoneId === milestoneId) course.activeMilestoneId = undefined;
  logEvent(db, "MILESTONE_SKIP", { sessionId, milestoneId });
  recomputeStatuses(db, m.courseId);
}

export function unskipMilestone(db: LabDB, milestoneId: ID) {
  const m = db.milestones[milestoneId];
  if (!m) return;
  m.skippedAt = undefined;
  recomputeStatuses(db, m.courseId);
}

// ---------------------------------------------------------------------------
// Attempts and mastery
// ---------------------------------------------------------------------------

export type AttemptInput = Omit<Attempt, "id" | "createdAt" | "attemptNumber" | "isRetry"> & { createdAt?: number };

export function recordAttempt(db: LabDB, input: AttemptInput): { attempt: Attempt; masteredNow: boolean } {
  const prior = Object.values(db.attempts).filter((a) => a.questionId === input.questionId && a.sessionId === input.sessionId);
  const attempt: Attempt = {
    ...input,
    id: newId("att"),
    createdAt: input.createdAt ?? Date.now(),
    attemptNumber: prior.length + 1,
    isRetry: prior.length > 0,
  };
  db.attempts[attempt.id] = attempt;
  const ctx = { sessionId: attempt.sessionId, milestoneId: attempt.milestoneId, questionId: attempt.questionId, at: attempt.createdAt };
  if (attempt.isRetry) logEvent(db, "RETRY", ctx, { attemptNumber: attempt.attemptNumber });
  logEvent(db, "ATTEMPT", ctx, {
    attemptId: attempt.id,
    correct: attempt.correct,
    score: attempt.score,
    hintLevel: attempt.hintLevelUsed,
    evaluatedBy: attempt.evaluatedBy,
    inputMethod: attempt.inputMethod,
    usedStylus: attempt.usedStylus,
    durationMs: attempt.durationMs,
    purpose: attempt.purpose,
    questionKind: db.questions[attempt.questionId]?.kind,
    errorTypes: attempt.feedback.errorTypes,
    confidence: attempt.confidence,
  });
  if (attempt.confidence !== undefined) logEvent(db, "CONFIDENCE_REPORT", ctx, { confidence: attempt.confidence });
  if (attempt.purpose === "TRANSFER") logEvent(db, "TRANSFER_ATTEMPT", ctx, { correct: attempt.correct });
  // Error analysis: classify and trace wrong answers; let right answers close repairs.
  if (attempt.correct === false) {
    recordError(db, attempt);
    detectPatterns(db, attempt.createdAt);
  } else if (attempt.correct) updateRepairs(db, attempt.createdAt);

  const m = db.milestones[attempt.milestoneId];
  let masteredNow = false;
  if (m && !m.masteredAt && (attempt.purpose === "PRACTICE" || attempt.purpose === "MASTERY")) {
    const progress = masteryProgress(db, m.id);
    if (progress.met) {
      grantMastery(db, m.id, progress.evidence, progress.assisted, false, attempt.sessionId, attempt.createdAt);
      masteredNow = true;
    }
  }
  if (m) recomputeStatuses(db, m.courseId);
  return { attempt, masteredNow };
}

/** How far a milestone is toward its mastery criterion. */
export function masteryProgress(db: LabDB, milestoneId: ID) {
  const m = db.milestones[milestoneId];
  const crit = m.masteryCriteria;
  const questions = milestoneQuestions(db, milestoneId).filter((q) => q.purpose === "PRACTICE" || q.purpose === "MASTERY");
  const required = Math.max(1, Math.min(crit.requiredCorrect, questions.length || crit.requiredCorrect));
  const qualifying = new Map<ID, Attempt>();
  let anyAssisted = false;
  for (const a of attemptsFor(db, milestoneId)) {
    if (a.purpose !== "PRACTICE" && a.purpose !== "MASTERY") continue;
    if (!a.correct || a.score < crit.minScore) continue;
    if (crit.requireUnassisted && a.hintLevelUsed >= 5) continue;
    if (a.hintLevelUsed > 0) anyAssisted = true;
    if (!qualifying.has(a.questionId)) qualifying.set(a.questionId, a);
  }
  return {
    required,
    achieved: Math.min(required, qualifying.size),
    met: qualifying.size >= required && questions.length > 0,
    evidence: [...qualifying.values()].map((a) => a.id),
    assisted: anyAssisted,
    hasQuestions: questions.length > 0,
  };
}

export function grantMastery(
  db: LabDB,
  milestoneId: ID,
  evidence: ID[],
  assisted: boolean,
  selfAttested: boolean,
  sessionId?: ID,
  now = Date.now(),
): MasteryRecord {
  const m = db.milestones[milestoneId];
  m.masteredAt = now;
  m.skippedAt = undefined;
  m.manuallyUnlocked = undefined;
  const rec: MasteryRecord = {
    id: newId("mast"),
    milestoneId,
    level: selfAttested ? 0.6 : assisted ? 0.8 : 1,
    achievedAt: now,
    evidenceAttemptIds: evidence,
    assisted,
    selfAttested,
  };
  db.mastery[rec.id] = rec;
  // Temporary smaller steps (adaptive/decompose) have done their job.
  for (const c of Object.values(db.milestones)) if (c.ephemeral?.parentId === milestoneId && !c.ephemeral.archivedAt) c.ephemeral.archivedAt = now;
  logEvent(db, "MILESTONE_COMPLETE", { sessionId, milestoneId, at: now }, { assisted, selfAttested, level: rec.level });
  scheduleRetention(db, milestoneId, now);
  recomputeStatuses(db, m.courseId);
  return rec;
}

/** Undo mastery (e.g. the user marked it by mistake). History is preserved. */
export function revokeMastery(db: LabDB, milestoneId: ID) {
  const m = db.milestones[milestoneId];
  if (!m) return;
  m.masteredAt = undefined;
  for (const r of Object.values(db.retention)) if (r.milestoneId === milestoneId && !r.completedAt) delete db.retention[r.id];
  recomputeStatuses(db, m.courseId);
}

// ---------------------------------------------------------------------------
// Retention
// ---------------------------------------------------------------------------

/** Schedule immediate, delayed and transfer checks if suitable questions exist. */
export function scheduleRetention(db: LabDB, milestoneId: ID, masteredAt: number) {
  const qs = milestoneQuestions(db, milestoneId);
  const used = new Set(
    Object.values(db.attempts).filter((a) => a.milestoneId === milestoneId).map((a) => a.questionId),
  );
  const pick = (purpose: "RETENTION" | "TRANSFER") =>
    qs.find((q) => q.purpose === purpose && !hasOpenCheck(db, q.id)) ??
    qs.find((q) => q.purpose === purpose);
  const delay = db.preferences.retentionDelayDays;
  const plan: [RetentionKind, "RETENTION" | "TRANSFER", number][] = [
    ["IMMEDIATE", "RETENTION", 0],
    ["DELAYED", "RETENTION", delay],
    ["TRANSFER", "TRANSFER", Math.max(1, Math.round(delay / 2))],
  ];
  for (const [kind, purpose, days] of plan) {
    const q = pick(purpose) ?? (kind === "DELAYED" ? qs.find((x) => x.purpose === "MASTERY" && !used.has(x.id)) : undefined);
    if (!q) continue;
    if (Object.values(db.retention).some((r) => r.milestoneId === milestoneId && r.kind === kind && !r.completedAt)) continue;
    const rc: RetentionCheck = {
      id: newId("ret"),
      milestoneId,
      kind,
      questionId: q.id,
      dueAt: masteredAt + days * DAY,
      intervalDays: days,
    };
    db.retention[rc.id] = rc;
  }
}

function hasOpenCheck(db: LabDB, questionId: ID) {
  return Object.values(db.retention).some((r) => r.questionId === questionId && !r.completedAt);
}

export function dueRetentionChecks(db: LabDB, now = Date.now()): RetentionCheck[] {
  return Object.values(db.retention)
    .filter((r) => !r.completedAt && r.dueAt <= now && db.milestones[r.milestoneId])
    .sort((a, b) => a.dueAt - b.dueAt);
}

export function completeRetentionCheck(db: LabDB, checkId: ID, attempt: Attempt) {
  const r = db.retention[checkId];
  if (!r || r.completedAt) return; // a check counts once: the first answer is the measurement
  r.completedAt = attempt.createdAt;
  r.attemptId = attempt.id;
  r.correct = !!attempt.correct;
  logEvent(db, "RETENTION_CHECK", { sessionId: attempt.sessionId, milestoneId: r.milestoneId, questionId: r.questionId }, {
    kind: r.kind,
    correct: r.correct,
    intervalDays: r.intervalDays,
    daysSinceMastery: (attempt.createdAt - (db.milestones[r.milestoneId]?.masteredAt ?? attempt.createdAt)) / DAY,
  });
  // Successful delayed check → schedule a longer interval (expanding spacing).
  if (r.kind === "DELAYED" && r.correct) {
    const next = Math.min(60, Math.max(r.intervalDays * 2.5, 2));
    const id = newId("ret");
    db.retention[id] = {
      ...r,
      id,
      dueAt: attempt.createdAt + next * DAY,
      intervalDays: Math.round(next),
      completedAt: undefined,
      attemptId: undefined,
      correct: undefined,
    };
  }
  const m = db.milestones[r.milestoneId];
  if (m) recomputeStatuses(db, m.courseId);
}

// ---------------------------------------------------------------------------
// Engagement
// ---------------------------------------------------------------------------

export function recordEngagement(db: LabDB, input: Omit<EngagementRecord, "id" | "createdAt">): EngagementRecord {
  const rec: EngagementRecord = { ...input, id: newId("eng"), createdAt: Date.now() };
  db.engagement[rec.id] = rec;
  logEvent(db, "ENGAGEMENT_REPORT", { sessionId: input.sessionId }, {
    absorption: input.absorption,
    challenge: input.challenge,
    continued: input.continued,
  });
  return rec;
}
