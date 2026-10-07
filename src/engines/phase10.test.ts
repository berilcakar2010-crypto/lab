import { describe, expect, it } from "vitest";
import { memoryAdapter, Store } from "../data/store";
import type { ID, LabDB } from "../domain/types";
import { importCurriculum, replaceTopicMilestones } from "./curriculumSpec";
import {
  assertValidCourse, connectPrerequisite, courseMilestones, deleteMilestone, mergeMilestones, milestoneQuestions,
  removePrerequisite, reorderMilestone, splitMilestone, updateMilestone,
} from "./curriculum";
import {
  completeRetentionCheck, grantMastery, leaveMilestone, openMilestone, recomputeStatuses, recordAttempt, revokeMastery,
  skipMilestone, unskipMilestone, dueRetentionChecks,
} from "./progress";
import { ensureSession } from "./sessions";
import { auditDatabase } from "./integrity";
import { recommendNext } from "./progression";
import { mechanicsPack } from "../ai/packs/mechanics";
import { calculusPack } from "../ai/packs/calculus";
import { buildGenericSpec } from "../ai/localBuilder";

/** Deterministic PRNG so failures are reproducible. */
function prng(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
}

describe("Phase 10 — integrity under random use", () => {
  for (const seed of [1, 7, 42, 2026]) {
    it(`random curriculum edits and learning never corrupt the graph (seed ${seed})`, () => {
      const rand = prng(seed);
      const store = new Store(memoryAdapter(), false);
      const courseIds: ID[] = [];
      for (const pack of [mechanicsPack, calculusPack, buildGenericSpec("Theoretical Neuroscience")]) {
        store.update((db) => courseIds.push(importCurriculum(db, structuredClone(pack), { source: { kind: "SEED", text: "" }, generatedBy: "t" }).courseId));
      }
      const pickCourse = () => courseIds[Math.floor(rand() * courseIds.length)];
      const pickM = (db: LabDB, c: ID) => {
        const ms = courseMilestones(db, c);
        return ms[Math.floor(rand() * ms.length)];
      };
      // Same path the UI uses: edits are transactional and validated.
      const edit = (c: ID, fn: (db: LabDB) => void) => {
        try {
          store.transact((db) => {
            fn(db);
            recomputeStatuses(db, c);
          }, (db) => assertValidCourse(db, c));
        } catch {
          /* rejected edits leave the database untouched */
        }
      };
      for (let step = 0; step < 250; step++) {
        const c = pickCourse();
        const db = store.state;
        if (!courseMilestones(db, c).length) continue;
        const a = pickM(db, c), b = pickM(db, c);
        const op = Math.floor(rand() * 14);
        switch (op) {
          case 0: edit(c, (d) => splitMilestone(d, a.id, [{ title: "p1" }, { title: "p2" }])); break;
          case 1: if (a.id !== b.id && courseMilestones(db, c).length > 3) edit(c, (d) => mergeMilestones(d, [a.id, b.id])); break;
          case 2: if (courseMilestones(db, c).length > 3) edit(c, (d) => deleteMilestone(d, a.id)); break;
          case 3: edit(c, (d) => connectPrerequisite(d, a.id, b.id)); break;
          case 4: if (a.prerequisites[0]) edit(c, (d) => removePrerequisite(d, a.id, a.prerequisites[0])); break;
          case 5: edit(c, (d) => reorderMilestone(d, a.id, Math.floor(rand() * 20))); break;
          case 6: edit(c, (d) => updateMilestone(d, a.id, { difficulty: 1 + Math.floor(rand() * 5), optional: rand() < 0.3 })); break;
          case 7: store.update((d) => skipMilestone(d, a.id)); break;
          case 8: store.update((d) => unskipMilestone(d, a.id)); break;
          case 9: if (a.status !== "LOCKED") store.update((d) => void grantMastery(d, a.id, [], false, rand() < 0.5)); break;
          case 10: store.update((d) => revokeMastery(d, a.id)); break;
          case 11: edit(c, (d) => replaceTopicMilestones(d, a.topicId, [{ key: "x", title: "regen x" }, { key: "y", title: "regen y", prerequisites: ["x"] }], "t")); break;
          case 12: store.update((d) => {
            const s = ensureSession(d, c);
            if (a.status === "LOCKED") openMilestone(d, s.id, a.id, { override: true });
            else openMilestone(d, s.id, a.id);
            const q = milestoneQuestions(d, a.id)[0];
            if (q) recordAttempt(d, { questionId: q.id, milestoneId: a.id, sessionId: s.id, answer: 1, correct: rand() < 0.6, score: 1, feedback: { correctness: "CORRECT", reasoningQuality: "UNKNOWN", errorTypes: [], message: "" }, hintLevelUsed: 0, evaluatedBy: "auto", inputMethod: "pen", usedStylus: true, durationMs: 1000, purpose: q.purpose });
            if (rand() < 0.5) leaveMilestone(d, s.id, a.id, false);
          }); break;
          case 13: store.update((d) => {
            const due = dueRetentionChecks(d, Date.now() + 30 * 86_400_000)[0];
            if (!due) return;
            const s = ensureSession(d, c);
            const q = d.questions[due.questionId];
            const { attempt } = recordAttempt(d, { questionId: q.id, milestoneId: q.milestoneId, sessionId: s.id, answer: 1, correct: rand() < 0.5, score: 1, feedback: { correctness: "CORRECT", reasoningQuality: "UNKNOWN", errorTypes: [], message: "" }, hintLevelUsed: 0, evaluatedBy: "auto", inputMethod: "keyboard", usedStylus: false, durationMs: 1000, purpose: "RETENTION" });
            completeRetentionCheck(d, due.id, attempt);
          }); break;
        }
        const issues = auditDatabase(store.state);
        if (issues.length) throw new Error(`step ${step}, op ${op}: ${issues.slice(0, 3).join(" | ")}`);
        // There is always something to do next (or the course is complete).
        const unfinished = courseMilestones(store.state, c).filter((m) => !m.masteredAt && !m.skippedAt);
        if (unfinished.length) expect(recommendNext(store.state, c).length).toBeGreaterThan(0);
      }
      // The run must actually have exercised the edits, not just rejected them.
      const all = Object.values(store.state.milestones);
      expect(all.some((m) => m.title === "p2")).toBe(true);
      expect(all.some((m) => m.title.startsWith("regen"))).toBe(true);
      expect(all.some((m) => m.masteredAt)).toBe(true);
      expect(store.state.events.some((e) => e.type === "MILESTONE_SKIP")).toBe(true);
      expect(Object.keys(store.state.attempts).length).toBeGreaterThan(5);
      expect(store.state.events.filter((e) => e.type === "RETENTION_CHECK").length).toBeGreaterThan(0);
    });
  }
});
