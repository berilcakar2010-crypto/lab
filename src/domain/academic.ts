/**
 * Types for the academic layer (Lab as an academic operating system): the
 * learner's journal, projects and the artifacts they produce, long-term
 * academic goals, school subjects and grades, short knowledge checks that
 * replace bare "I know this" claims, and preferences for challenge, AI style
 * and deep work. Plain serialisable data stored in `LabDB` like everything else,
 * so it is exported, imported and migrated with the rest.
 */
import type { ID, Millis } from "./types";

/** A previous state of a versioned record (goal, project), newest last. */
export interface VersionEntry {
  at: Millis;
  summary: string;
  snapshot: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Journal
// ---------------------------------------------------------------------------

export const JOURNAL_KINDS = ["IDEA", "INSIGHT", "QUESTION", "HYPOTHESIS", "CONFUSION", "DISCOVERY", "REFLECTION"] as const;
export type JournalKind = (typeof JOURNAL_KINDS)[number];

export interface JournalEntry {
  id: ID;
  kind: JournalKind;
  text: string;
  /** Graph objects the entry is about. */
  loIds: string[];
  projectId?: ID;
  sessionId?: ID;
  createdAt: Millis;
  updatedAt: Millis;
}

// ---------------------------------------------------------------------------
// Projects and academic artifacts
// ---------------------------------------------------------------------------

export const PROJECT_KINDS = ["PROJECT", "RESEARCH", "COMPETITION", "PAPER", "PRESENTATION", "EXPERIMENT", "BOOK", "CLUB"] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];
export type ProjectStatus = "ACTIVE" | "PAUSED" | "DONE" | "ARCHIVED";

export interface Project {
  id: ID;
  title: string;
  kind: ProjectKind;
  goal: string;
  status: ProjectStatus;
  /** Questions the project tries to answer. */
  questions: string[];
  loIds: string[];
  sourceIds: ID[];
  milestoneIds: ID[];
  researchIds: ID[];
  experimentIds: ID[];
  notes: string;
  results: string;
  nextQuestions: string[];
  /** Academic goal this project serves, if any. */
  goalId?: ID;
  versions: VersionEntry[];
  createdAt: Millis;
  updatedAt: Millis;
}

export const ARTIFACT_KINDS = ["DERIVATION", "PROOF", "NOTE", "EXPLANATION", "SIMULATION", "GRAPH", "CODE", "RESULT", "PAPER", "PRESENTATION", "OTHER"] as const;
export type ArtifactKind = (typeof ARTIFACT_KINDS)[number];

/** Something the learner produced. Linked to graph objects so "what did I actually do on this topic?" has an answer. */
export interface AcademicArtifact {
  id: ID;
  kind: ArtifactKind;
  title: string;
  body: string;
  url?: string;
  loIds: string[];
  projectId?: ID;
  /** The record the artifact was saved from (explanation, sandbox run, research project…). */
  ref?: { table: string; id: ID };
  createdAt: Millis;
  updatedAt: Millis;
}

// ---------------------------------------------------------------------------
// Academic goals
// ---------------------------------------------------------------------------

export type GoalStatus = "ACTIVE" | "ACHIEVED" | "PAUSED" | "ARCHIVED";

export interface AcademicGoal {
  id: ID;
  title: string;
  why: string;
  /** Free text, e.g. "computational neuroscience". */
  targetArea: string;
  currentState: string;
  desiredState: string;
  /** Graph objects that make up the goal; decomposition is derived from them. */
  loIds: string[];
  projectIds: ID[];
  status: GoalStatus;
  versions: VersionEntry[];
  createdAt: Millis;
  updatedAt: Millis;
}

// ---------------------------------------------------------------------------
// Knowledge checks ("I know this" must be shown, not claimed)
// ---------------------------------------------------------------------------

export interface CheckItem {
  prompt: string;
  /** Graph object this item tests (a check can cover several basics at once). */
  loId?: string;
  /** Stored question when the item came from the question bank. */
  questionId?: ID;
  /** "auto": graded by Lab; "open": graded by AI or by the learner against the rubric. */
  kind: "auto" | "open";
  rubric: string[];
  answer?: string;
  met?: boolean[];
  /** The evaluator's short note on an open answer (what is right, what to improve). */
  feedback?: string;
  correct: boolean | null;
  score: number;
  by: "auto" | "ai" | "self" | "none";
  attemptId?: ID;
}

export interface KnowledgeCheck {
  id: ID;
  target: { loId?: string; milestoneId?: ID };
  items: CheckItem[];
  /** 0..1 */
  score: number;
  passed: boolean;
  /** How the check was graded overall; self-graded checks count for less evidence. */
  gradedBy: "auto" | "ai" | "self" | "mixed";
  sessionId?: ID;
  createdAt: Millis;
}

// ---------------------------------------------------------------------------
// School layer (kept apart from the graph; links to it by id)
// ---------------------------------------------------------------------------

export const SCHOOL_SUBJECT_KINDS = ["SCHOOL", "AP", "COMPETITION", "LANGUAGE", "OTHER"] as const;
export type SchoolSubjectKind = (typeof SCHOOL_SUBJECT_KINDS)[number];

export interface SchoolSubject {
  id: ID;
  name: string;
  kind: SchoolSubjectKind;
  /** Academic year or term label — metadata only, nothing resets when it changes. */
  year?: string;
  loIds: string[];
  archived?: boolean;
  createdAt: Millis;
}

export interface GradeRecord {
  id: ID;
  subjectId: ID;
  title: string;
  score: number;
  outOf: number;
  /** Relative weight inside the subject (default 1). */
  weight?: number;
  examId?: ID;
  at: Millis;
}

// ---------------------------------------------------------------------------
// Preferences
// ---------------------------------------------------------------------------

export const CHALLENGE_LEVELS = ["COMFORT", "STRETCH", "HARD", "EXTREME"] as const;
/** Purely cognitive difficulty; "extreme" means the hardest problems, nothing else. */
export type ChallengeLevel = (typeof CHALLENGE_LEVELS)[number];

export const AI_STYLE_KEYS = ["socratic", "concise", "rigorous", "explanatory", "challenging"] as const;
export type AIStyleKey = (typeof AI_STYLE_KEYS)[number];
export type AIStyle = Record<AIStyleKey, boolean>;

export type AnimationLevel = "full" | "reduced" | "off";
