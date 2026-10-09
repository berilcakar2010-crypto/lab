/**
 * Test helpers for the adaptive layer: a small course whose milestones are
 * linked to real knowledge-graph objects, and a way to answer questions
 * through the real progress engine. Used only by tests.
 */
import { createEmptyDB } from "../data/db";
import type { HintLevel, ID, InteractionType, LabDB, Question, QuestionPurpose } from "../domain/types";
import { addMilestone, addQuestion, addTopic, addUnit, createCourse, createSubject, connectPrerequisite } from "../engines/curriculum";
import { recordAttempt, startSession } from "../engines/progress";

export const DAY = 86_400_000;
export const T0 = new Date(2026, 9, 1, 10, 0).getTime();

export interface Kit {
  db: LabDB;
  courseId: ID;
  sessionId: ID;
  /** milestone id per graph object id */
  ms: Record<string, ID>;
  /** question ids per milestone id */
  qs: Record<ID, ID[]>;
}

export function kit(los: string[], opts: { kinds?: InteractionType[]; subject?: string; db?: LabDB; prereqChain?: boolean } = {}): Kit {
  const db = opts.db ?? createEmptyDB(T0);
  const subject = createSubject(db, { name: opts.subject ?? "Physics" });
  const { course } = createCourse(db, { subjectId: subject.id, title: opts.subject ?? "Physics", description: "", goal: "g", source: { kind: "SEED", text: "" }, generatedBy: "test" });
  const unit = addUnit(db, course.id, "u", "");
  const topic = addTopic(db, unit.id, "t");
  const ms: Record<string, ID> = {};
  const qs: Record<ID, ID[]> = {};
  let prev: ID | undefined;
  for (const lo of los) {
    const m = addMilestone(db, { title: `Milestone ${lo}`, topicId: topic.id, learningObjective: `Given a problem, calculate and explain ${lo}` });
    m.learningObjectIds = [lo];
    ms[lo] = m.id;
    qs[m.id] = (opts.kinds ?? ["NUMERIC", "MULTIPLE_CHOICE", "NUMERIC"]).map((kind, i) =>
      addQuestion(db, {
        milestoneId: m.id, kind, purpose: "PRACTICE", prompt: `${lo} q${i}`, rubric: [], hints: ["h1", "h2", "h3", "h4"], solution: "s", difficulty: 2, createdBy: "test",
        ...(kind === "NUMERIC" ? { numeric: { value: 10, tolerance: 0.02 } } : kind === "MULTIPLE_CHOICE" ? { choices: ["a", "b"], correctChoice: 0 } : {}),
      } as Omit<Question, "id">).id,
    );
    if (opts.prereqChain && prev) connectPrerequisite(db, m.id, prev);
    prev = m.id;
  }
  const s = startSession(db, course.id, T0);
  return { db, courseId: course.id, sessionId: s.id, ms, qs };
}

export function answer(
  k: Kit,
  questionId: ID,
  correct: boolean,
  o: { at?: number; hint?: HintLevel; purpose?: QuestionPurpose; confidence?: number; durationMs?: number; answer?: unknown; errorTypes?: ("CONCEPTUAL" | "PROCEDURAL" | "CARELESS" | "MISSING_PREREQUISITE" | "INCOMPLETE_EXPLANATION")[] } = {},
) {
  const q = k.db.questions[questionId];
  return recordAttempt(k.db, {
    questionId, milestoneId: q.milestoneId, sessionId: k.sessionId,
    answer: o.answer ?? (correct ? 10 : 3), correct, score: correct ? 1 : 0,
    feedback: { correctness: correct ? "CORRECT" : "INCORRECT", reasoningQuality: "UNKNOWN", errorTypes: o.errorTypes ?? [], message: "" },
    hintLevelUsed: o.hint ?? 0, evaluatedBy: "auto", inputMethod: "touch", usedStylus: false, confidence: o.confidence,
    durationMs: o.durationMs ?? 30_000, purpose: o.purpose ?? "PRACTICE", createdAt: o.at ?? T0,
  });
}
