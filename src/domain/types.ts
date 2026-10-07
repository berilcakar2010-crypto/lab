/**
 * Lab domain model.
 *
 * Every entity is a plain serialisable object keyed by `id`. Relations are by id
 * so the curriculum graph is independent of the UI and of any AI provider.
 * Timestamps are epoch milliseconds.
 */

import type { LearningObject } from "../knowledge/schema";
import type { Lang } from "../i18n";

export type ID = string;
export type Millis = number;

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

export const MILESTONE_STATUSES = [
  "LOCKED",
  "AVAILABLE",
  "ACTIVE",
  "ATTEMPTED",
  "MASTERED",
  "NEEDS_REVIEW",
  "SKIPPED",
  "OPTIONAL",
  "BOSS",
] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export const MILESTONE_TYPES = [
  "CONCEPT",
  "PRACTICE",
  "APPLICATION",
  "DERIVATION",
  "PROOF",
  "PROBLEM_SOLVING",
  "EXPERIMENT",
  "PROJECT",
  "REVIEW",
  "CHALLENGE",
  "BOSS",
] as const;
export type MilestoneType = (typeof MILESTONE_TYPES)[number];

export const INTERACTION_TYPES = [
  "MULTIPLE_CHOICE",
  "FREE_RESPONSE",
  "EQUATION",
  "NUMERIC",
  "DERIVATION",
  "PROOF",
  "EXPLANATION",
  "PREDICTION",
  "DIAGRAM",
  "DRAWING",
  "GRAPH_INTERPRETATION",
  "ORDERING",
  "CODE",
  "SIMULATION",
  "PROBLEM_SOLVING",
  "CLASSIFICATION",
  "COMPARISON",
  "CONCEPT_EXPLANATION",
] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];

/** Interaction types the app can grade without AI or self-assessment. */
export const AUTO_GRADED: ReadonlySet<InteractionType> = new Set<InteractionType>([
  "MULTIPLE_CHOICE",
  "NUMERIC",
  "EQUATION",
  "ORDERING",
  "CLASSIFICATION",
  "PREDICTION",
  "GRAPH_INTERPRETATION",
  "SIMULATION",
]);

/** 0 = no help … 5 = full solution. */
export const HINT_LEVELS = [
  "NONE",
  "SMALL_HINT",
  "CONCEPTUAL_HINT",
  "STRATEGIC_HINT",
  "PARTIAL_GUIDANCE",
  "FULL_SOLUTION",
] as const;
export type HintLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type MilestoneScope = "MICRO" | "STANDARD" | "EXTENDED" | "PROJECT";

export type InputMethod = "pen" | "touch" | "mouse" | "keyboard" | "unknown";

export type ErrorType =
  | "CONCEPTUAL"
  | "PROCEDURAL"
  | "CARELESS"
  | "MISSING_PREREQUISITE"
  | "INCOMPLETE_EXPLANATION";

export type QuestionPurpose = "PRACTICE" | "MASTERY" | "RETENTION" | "TRANSFER";

export type RecommendationKind =
  | "CONTINUE"
  | "REVIEW"
  | "PRACTICE"
  | "CHALLENGE"
  | "EXPLORE"
  | "BOSS";

export type AIProviderId = "local" | "gemini" | "groq";

export type AIRole =
  | "TUTOR"
  | "SOCRATIC_GUIDE"
  | "EVALUATOR"
  | "HINT_GENERATOR"
  | "MILESTONE_GENERATOR"
  | "CURRICULUM_BUILDER"
  | "DIFFICULTY_CALIBRATOR"
  | "REFLECTION_ANALYST"
  | "CURRICULUM_ADVISOR"
  | "FEEDBACK_GENERATOR";

// ---------------------------------------------------------------------------
// Entities
// ---------------------------------------------------------------------------

export interface User {
  id: ID;
  name: string;
  createdAt: Millis;
}

export interface UserPreference {
  userId: ID;
  aiProvider: AIProviderId;
  apiKeys: Partial<Record<Exclude<AIProviderId, "local">, string>>;
  models: Record<Exclude<AIProviderId, "local">, string>;
  /** Highest hint level offered before the user explicitly asks to unlock more. */
  hintCap: HintLevel;
  reduceMotion: boolean;
  experimentsEnabled: boolean;
  /** Days after mastery before the first delayed retention check. */
  retentionDelayDays: number;
  /** Interface and content language. English is the default. */
  language: Lang;
}

export interface Subject {
  id: ID;
  name: string;
  description: string;
  createdAt: Millis;
}

export interface CurriculumSource {
  kind: "REQUEST" | "SYLLABUS" | "MANUAL" | "SEED";
  text: string;
}

export interface Curriculum {
  id: ID;
  subjectId: ID;
  courseId: ID;
  goal: string;
  source: CurriculumSource;
  /** Provider that generated it, e.g. "gemini", "groq", "local", "seed". */
  generatedBy: string;
  version: number;
  createdAt: Millis;
  updatedAt: Millis;
}

export interface Course {
  id: ID;
  subjectId: ID;
  curriculumId: ID;
  title: string;
  description: string;
  goal: string;
  /** Calibrated recommendation; the user can always start elsewhere. */
  startHereMilestoneId?: ID;
  /** The single milestone currently in focus for this course. */
  activeMilestoneId?: ID;
  /** Where built-in content came from, so it can be re-localised when the language changes. */
  origin?: CourseOrigin;
  archived: boolean;
  createdAt: Millis;
}

export type CourseOrigin =
  | { kind: "pack"; pack: string }
  | { kind: "graph"; loIds: string[]; title?: string };

export interface Unit {
  id: ID;
  courseId: ID;
  title: string;
  summary: string;
  order: number;
}

export interface Topic {
  id: ID;
  courseId: ID;
  unitId: ID;
  title: string;
  order: number;
}

export interface Concept {
  id: ID;
  courseId: ID;
  topicId: ID;
  title: string;
  description: string;
}

export interface MasteryCriteria {
  description: string;
  /** Number of correct mastery-purpose answers required. */
  requiredCorrect: number;
  /** If true, answers given after the full solution (hint level 5) do not count toward mastery. */
  requireUnassisted: boolean;
  /** Minimum score (0..1) for an answer to count as correct. */
  minScore: number;
}

export interface Milestone {
  id: ID;
  subjectId: ID;
  courseId: ID;
  unitId: ID;
  topicId: ID;
  conceptIds: ID[];
  title: string;
  description: string;
  learningObjective: string;
  prerequisites: ID[];
  /** Maintained by the curriculum engine as the inverse of `prerequisites`. */
  nextMilestones: ID[];
  /** 1 (easy) … 5 (very hard). */
  difficulty: number;
  /** Minutes. Varies by milestone; never a fixed universal size. */
  estimatedDuration: number;
  scope: MilestoneScope;
  status: MilestoneStatus;
  masteryCriteria: MasteryCriteria;
  milestoneType: MilestoneType;
  optional: boolean;
  required: boolean;
  recommendedInteractionType: InteractionType;
  tags: string[];
  /** User-controlled display order within the topic. */
  order: number;
  /** User override: open this milestone even though prerequisites are unmet. */
  manuallyUnlocked?: boolean;
  masteredAt?: Millis;
  skippedAt?: Millis;
  /** Canonical knowledge-graph objects this milestone practises (Lab Müfredatı v2.0). */
  learningObjectIds?: string[];
  /** Stable key of the milestone inside its source pack, e.g. "mech:kin2". */
  sourceKey?: string;
  createdAt: Millis;
  updatedAt: Millis;
}

export interface NumericAnswer {
  value: number;
  /** Relative tolerance, e.g. 0.02 for 2 %. */
  tolerance: number;
  unit?: string;
}

export interface GraphSpec {
  /** Expression in `x`, rendered as a curve. */
  expression: string;
  xMin: number;
  xMax: number;
  xLabel?: string;
  yLabel?: string;
}

export interface SimulationSpec {
  /** Output expression over the variables. */
  expression: string;
  outputLabel: string;
  variables: { name: string; label: string; min: number; max: number; step: number; initial: number }[];
}

export interface Question {
  id: ID;
  milestoneId: ID;
  kind: InteractionType;
  purpose: QuestionPurpose;
  prompt: string;
  /** MULTIPLE_CHOICE / PREDICTION / GRAPH_INTERPRETATION / COMPARISON options. */
  choices?: string[];
  correctChoice?: number;
  numeric?: NumericAnswer;
  /** EQUATION: accepted expressions, compared by numeric sampling. */
  acceptedExpressions?: string[];
  /** Variables appearing in an EQUATION answer. */
  variables?: string[];
  /** ORDERING: items in the correct order (shown shuffled). */
  orderItems?: string[];
  /** CLASSIFICATION: item → category. */
  classification?: { categories: string[]; items: { text: string; category: string }[] };
  graph?: GraphSpec;
  simulation?: SimulationSpec;
  /** Key ideas a complete answer must contain (for open responses). */
  rubric: string[];
  /** Hints ordered by HintLevel 1..4. Level 5 is `solution`. */
  hints: string[];
  solution: string;
  difficulty: number;
  createdBy: string;
}

export interface Feedback {
  correctness: "CORRECT" | "PARTIAL" | "INCORRECT" | "UNGRADED";
  reasoningQuality: "STRONG" | "ADEQUATE" | "WEAK" | "UNKNOWN";
  errorTypes: ErrorType[];
  successfulStrategy?: string;
  message: string;
  missingPrerequisiteIds?: ID[];
}

export interface Attempt {
  id: ID;
  questionId: ID;
  milestoneId: ID;
  sessionId: ID;
  answer: unknown;
  correct: boolean | null;
  score: number;
  feedback: Feedback;
  hintLevelUsed: HintLevel;
  evaluatedBy: "auto" | "ai" | "self";
  inputMethod: InputMethod;
  usedStylus: boolean;
  confidence?: number;
  durationMs: number;
  attemptNumber: number;
  isRetry: boolean;
  purpose: QuestionPurpose;
  createdAt: Millis;
}

export type SessionEndReason = "COMPLETED" | "USER_ENDED" | "ABANDONED" | "INTERRUPTED";

export interface Session {
  id: ID;
  courseId?: ID;
  startedAt: Millis;
  endedAt?: Millis;
  milestoneIds: ID[];
  activeMs: number;
  idleMs: number;
  endReason?: SessionEndReason;
  /** experimentId → armId */
  experimentArms: Record<ID, ID>;
}

export interface AIInteraction {
  id: ID;
  role: AIRole;
  provider: AIProviderId;
  model: string;
  ok: boolean;
  fallbackUsed: boolean;
  latencyMs: number;
  summary: string;
  error?: string;
  sessionId?: ID;
  milestoneId?: ID;
  createdAt: Millis;
}

export interface MasteryRecord {
  id: ID;
  milestoneId: ID;
  /** 0..1 */
  level: number;
  achievedAt: Millis;
  evidenceAttemptIds: ID[];
  assisted: boolean;
  /** The user declared mastery without auto-graded evidence (user override). */
  selfAttested: boolean;
}

export type RetentionKind = "IMMEDIATE" | "DELAYED" | "TRANSFER";

export interface RetentionCheck {
  id: ID;
  milestoneId: ID;
  kind: RetentionKind;
  questionId: ID;
  dueAt: Millis;
  intervalDays: number;
  completedAt?: Millis;
  attemptId?: ID;
  correct?: boolean;
}

export type ExperimentVariable =
  | "MILESTONE_SIZE"
  | "STYLUS"
  | "IMMEDIATE_FEEDBACK"
  | "NEXT_CHOICE"
  | "DIFFICULTY"
  | "AI_ASSISTANCE";

export interface ExperimentArm {
  id: ID;
  label: string;
  /** Condition parameters applied to sessions in this arm. */
  condition: Record<string, string | number | boolean>;
}

export interface Experiment {
  id: ID;
  title: string;
  hypothesis: string;
  variable: ExperimentVariable;
  arms: ExperimentArm[];
  status: "RUNNING" | "PAUSED" | "CONCLUDED";
  minSessionsPerArm: number;
  createdAt: Millis;
  concludedAt?: Millis;
  note?: string;
}

/** Raw link between a session and the experimental arm it ran under. */
export interface ExperimentResult {
  id: ID;
  experimentId: ID;
  armId: ID;
  sessionId: ID;
  createdAt: Millis;
}

export interface EngagementRecord {
  id: ID;
  sessionId: ID;
  /** 1..5 self-reported absorption, optional. */
  absorption?: number;
  /** 1..5 self-reported challenge, optional. */
  challenge?: number;
  /** Whether the user chose to continue after a completed milestone. */
  continued?: boolean;
  note?: string;
  createdAt: Millis;
}

// ---------------------------------------------------------------------------
// Raw analytics events (Phase 7)
// ---------------------------------------------------------------------------

export const EVENT_TYPES = [
  "SESSION_START",
  "SESSION_END",
  "ACTIVITY_TICK",
  "IDLE_START",
  "IDLE_END",
  "INTERRUPTION",
  "MILESTONE_OPEN",
  "MILESTONE_COMPLETE",
  "MILESTONE_ABANDON",
  "MILESTONE_SKIP",
  "QUESTION_SHOWN",
  "ATTEMPT",
  "RETRY",
  "HINT_REQUEST",
  "AI_INTERACTION",
  "CONFIDENCE_REPORT",
  "INPUT",
  "CONTINUE_DECISION",
  "RECOMMENDATION_SHOWN",
  "RECOMMENDATION_CHOSEN",
  "RETENTION_CHECK",
  "CURRICULUM_EDIT",
  "ENGAGEMENT_REPORT",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export interface AnalyticsEvent {
  id: ID;
  type: EventType;
  at: Millis;
  sessionId?: ID;
  subjectId?: ID;
  courseId?: ID;
  unitId?: ID;
  topicId?: ID;
  conceptIds?: ID[];
  milestoneId?: ID;
  questionId?: ID;
  data: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

export type Table<T extends { id: ID }> = Record<ID, T>;

export interface LabDB {
  schemaVersion: number;
  user: User;
  preferences: UserPreference;
  subjects: Table<Subject>;
  curricula: Table<Curriculum>;
  courses: Table<Course>;
  units: Table<Unit>;
  topics: Table<Topic>;
  concepts: Table<Concept>;
  milestones: Table<Milestone>;
  questions: Table<Question>;
  attempts: Table<Attempt>;
  sessions: Table<Session>;
  aiInteractions: Table<AIInteraction>;
  mastery: Table<MasteryRecord>;
  retention: Table<RetentionCheck>;
  experiments: Table<Experiment>;
  experimentResults: Table<ExperimentResult>;
  engagement: Table<EngagementRecord>;
  events: AnalyticsEvent[];
  knowledge: KnowledgeState;
}

// ---------------------------------------------------------------------------
// Knowledge graph — personal layer
// ---------------------------------------------------------------------------

/** One applied update to the canonical graph (section 36: diff → plan → apply). */
export interface GraphUpdateRecord {
  id: ID;
  at: Millis;
  fromVersion: string;
  toVersion: string;
  summary: string;
  added: string[];
  modified: string[];
  retired: { id: string; supersededBy: string[] }[];
  /** Milestones whose links were extended so progress follows split/merged objects. */
  relinkedMilestones: number;
}

export interface KnowledgeState {
  /** "I already know this" — the learner's own claim, never shown as mastery. */
  selfAttested: Record<string, { at: Millis; note?: string }>;
  /** Learning objects the learner chose as goals. */
  goals: string[];
  /** Selected learning path id, if any. */
  pathId?: string;
  /** Objects added or changed by updates after v2.0; base content is never mutated. */
  overlay: { version: string; objects: Record<string, LearningObject> };
  history: GraphUpdateRecord[];
  /** Applied one-off data migrations, e.g. "v2-link-milestones". */
  migrations: { id: string; at: Millis; note: string }[];
  /** Graph version the learner last saw (to announce updates). */
  seenVersion?: string;
}

export const SCHEMA_VERSION = 2;
