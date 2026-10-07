import { describe, expect, it } from "vitest";
import { createEmptyDB, hydrateDB } from "../data/db";
import { memoryAdapter, Store } from "../data/store";
import type { LabDB, Question } from "../domain/types";
import {
  addConcept, addMilestone, addQuestion, addTopic, addUnit, assertValidCourse, connectPrerequisite, createCourse,
  createSubject, CurriculumError, deleteMilestone, mergeMilestones, reorderMilestone, splitMilestone, validateCourse,
  courseMilestones,
} from "./curriculum";
import {
  completeRetentionCheck, dueRetentionChecks, endSession, openMilestone, recomputeStatuses, recordAttempt,
  recordEngagement, skipMilestone, startSession,
} from "./progress";

export function buildFixture() {
  const db = createEmptyDB();
  const subject = createSubject(db, { name: "Physics" });
  const { course } = createCourse(db, {
    subjectId: subject.id, title: "Mechanics", goal: "Solve olympiad mechanics", source: { kind: "MANUAL", text: "" }, generatedBy: "test",
  });
  const unit = addUnit(db, course.id, "Kinematics");
  const topic = addTopic(db, unit.id, "1D motion");
  const concept = addConcept(db, topic.id, "Velocity");
  const a = addMilestone(db, { title: "A", topicId: topic.id, conceptIds: [concept.id] });
  const b = addMilestone(db, { title: "B", topicId: topic.id, prerequisites: [a.id] });
  const c = addMilestone(db, { title: "C", topicId: topic.id, prerequisites: [a.id] });
  const d = addMilestone(db, { title: "D", topicId: topic.id, prerequisites: [b.id, c.id], milestoneType: "BOSS" });
  const q = (milestoneId: string, purpose: Question["purpose"], value = 2): Question =>
    addQuestion(db, {
      milestoneId, kind: "NUMERIC", purpose, prompt: "x?", numeric: { value, tolerance: 0.01 }, rubric: [], hints: [], solution: "", difficulty: 2, createdBy: "test",
    });
  recomputeStatuses(db, course.id);
  return { db, subject, course, unit, topic, concept, a, b, c, d, q };
}

const attempt = (db: LabDB, sessionId: string, milestoneId: string, questionId: string, correct: boolean, purpose: Question["purpose"] = "MASTERY") =>
  recordAttempt(db, {
    sessionId, milestoneId, questionId, answer: 1, correct, score: correct ? 1 : 0,
    feedback: { correctness: correct ? "CORRECT" : "INCORRECT", reasoningQuality: "UNKNOWN", errorTypes: [], message: "" },
    hintLevelUsed: 0, evaluatedBy: "auto", inputMethod: "keyboard", usedStylus: false, durationMs: 1000, purpose,
  });

describe("Phase 2 — core data model", () => {
  it("creates the full hierarchy with graph prerequisites and inverse edges", () => {
    const { db, course, a, b, c, d } = buildFixture();
    expect(Object.keys(db.subjects)).toHaveLength(1);
    expect(db.curricula[course.curriculumId].courseId).toBe(course.id);
    expect(db.milestones[a.id].nextMilestones.sort()).toEqual([b.id, c.id].sort());
    expect(db.milestones[d.id].prerequisites).toEqual([b.id, c.id]);
    expect(validateCourse(db, course.id)).toEqual([]);
  });

  it("derives statuses: roots available, dependents locked, boss shown as BOSS once unlocked", () => {
    const { db, a, b, d } = buildFixture();
    expect(db.milestones[a.id].status).toBe("AVAILABLE");
    expect(db.milestones[b.id].status).toBe("LOCKED");
    expect(db.milestones[d.id].status).toBe("LOCKED");
  });

  it("rejects prerequisite loops", () => {
    const { db, a, d } = buildFixture();
    expect(() => connectPrerequisite(db, a.id, d.id)).toThrow(CurriculumError);
    expect(() => connectPrerequisite(db, a.id, a.id)).toThrow(CurriculumError);
  });

  it("records sessions, attempts, mastery, retention and engagement", () => {
    const { db, course, a, b, c, d, q } = buildFixture();
    const q1 = q(a.id, "MASTERY");
    const q2 = q(a.id, "MASTERY");
    q(a.id, "RETENTION");
    q(a.id, "TRANSFER");
    const s = startSession(db, course.id);
    openMilestone(db, s.id, a.id);
    expect(db.milestones[a.id].status).toBe("ACTIVE");
    attempt(db, s.id, a.id, q1.id, false);
    const r1 = attempt(db, s.id, a.id, q1.id, true);
    expect(r1.attempt.isRetry).toBe(true);
    expect(r1.masteredNow).toBe(false);
    const r2 = attempt(db, s.id, a.id, q2.id, true);
    expect(r2.masteredNow).toBe(true);
    expect(db.milestones[a.id].status).toBe("MASTERED");
    expect(db.milestones[b.id].status).toBe("AVAILABLE");
    expect(db.milestones[c.id].status).toBe("AVAILABLE");
    expect(Object.values(db.mastery)).toHaveLength(1);

    const checks = Object.values(db.retention);
    expect(checks.map((r) => r.kind).sort()).toEqual(["DELAYED", "IMMEDIATE", "TRANSFER"]);
    const due = dueRetentionChecks(db);
    expect(due.map((r) => r.kind)).toEqual(["IMMEDIATE"]);
    const ra = attempt(db, s.id, a.id, due[0].questionId, false, "RETENTION");
    completeRetentionCheck(db, due[0].id, ra.attempt);
    expect(db.milestones[a.id].status).toBe("NEEDS_REVIEW");
    // Needing review still satisfies dependents (no dead ends).
    expect(db.milestones[b.id].status).toBe("AVAILABLE");

    skipMilestone(db, b.id);
    skipMilestone(db, c.id);
    expect(db.milestones[d.id].status).toBe("BOSS");

    recordEngagement(db, { sessionId: s.id, absorption: 4, continued: true });
    endSession(db, s.id, "USER_ENDED");
    expect(db.sessions[s.id].endedAt).toBeDefined();
    const types = db.events.map((e) => e.type);
    for (const t of ["SESSION_START", "MILESTONE_OPEN", "ATTEMPT", "RETRY", "MILESTONE_COMPLETE", "RETENTION_CHECK", "MILESTONE_SKIP", "ENGAGEMENT_REPORT", "SESSION_END"]) {
      expect(types).toContain(t);
    }
  });

  it("locked milestones need an explicit override to open", () => {
    const { db, course, d } = buildFixture();
    const s = startSession(db, course.id);
    expect(() => openMilestone(db, s.id, d.id)).toThrow();
    openMilestone(db, s.id, d.id, { override: true });
    expect(db.milestones[d.id].status).toBe("ACTIVE");
  });

  it("delete reconnects dependents to keep paths open", () => {
    const { db, course, a, b, d } = buildFixture();
    deleteMilestone(db, b.id);
    expect(db.milestones[d.id].prerequisites).toContain(a.id);
    expect(db.milestones[d.id].prerequisites).not.toContain(b.id);
    expect(db.milestones[a.id].nextMilestones).toContain(d.id);
    assertValidCourse(db, course.id);
  });

  it("split creates a chain and keeps dependents attached to the last part", () => {
    const { db, course, a, b, d, q } = buildFixture();
    q(b.id, "MASTERY");
    q(b.id, "MASTERY");
    const parts = splitMilestone(db, b.id, [{ title: "B1" }, { title: "B2" }, { title: "B3" }]);
    expect(parts).toHaveLength(3);
    expect(parts[0].id).toBe(b.id);
    expect(parts[0].prerequisites).toEqual([a.id]);
    expect(parts[1].prerequisites).toEqual([parts[0].id]);
    expect(db.milestones[d.id].prerequisites).toContain(parts[2].id);
    expect(db.milestones[d.id].prerequisites).not.toContain(b.id);
    assertValidCourse(db, course.id);
  });

  it("merge unions prerequisites and redirects dependents without loops", () => {
    const { db, course, a, b, c, d } = buildFixture();
    const m = mergeMilestones(db, [b.id, c.id], "B+C");
    expect(m.title).toBe("B+C");
    expect(db.milestones[c.id]).toBeUndefined();
    expect(db.milestones[d.id].prerequisites).toEqual([b.id]);
    expect(m.prerequisites).toEqual([a.id]);
    assertValidCourse(db, course.id);
  });

  it("merging a chain does not create a self-loop", () => {
    const { db, course, a, b, d } = buildFixture();
    mergeMilestones(db, [a.id, b.id]);
    assertValidCourse(db, course.id);
    expect(db.milestones[a.id].prerequisites).toEqual([]);
    expect(db.milestones[d.id].prerequisites.every((p) => p !== b.id)).toBe(true);
  });

  it("reorders milestones", () => {
    const { db, course, a, d } = buildFixture();
    reorderMilestone(db, d.id, 0);
    expect(courseMilestones(db, course.id)[0].id).toBe(d.id);
    expect(courseMilestones(db, course.id)[1].id).toBe(a.id);
  });

  it("persists and hydrates through the store, rejecting invalid transactions", async () => {
    const adapter = memoryAdapter();
    const store = new Store(adapter, false);
    store.update((db) => createSubject(db, { name: "Math" }));
    await store.flush();
    const reloaded = new Store(adapter, false);
    expect(Object.values(reloaded.state.subjects)[0].name).toBe("Math");
    expect(() =>
      reloaded.transact(
        (db) => createSubject(db, { name: "Bad" }),
        () => {
          throw new Error("nope");
        },
      ),
    ).toThrow();
    expect(Object.values(reloaded.state.subjects)).toHaveLength(1);
    expect(hydrateDB({ subjects: null, events: "x" }).events).toEqual([]);
  });
});
