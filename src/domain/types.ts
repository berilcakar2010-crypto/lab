/**
 * Lab domain model.
 *
 * Every entity is a plain serialisable object keyed by `id`. Relations are by id
 * so the curriculum graph is independent of the UI and of any AI provider.
 * Timestamps are epoch milliseconds.
 */

import type { LearningObject } from "../knowledge/schema";
import type { Lang } from "../i18n";

import type {
  CurriculumProposal, DecisionRecord, ErrorRecord, ExperimentReport, GranularityResult, Insight, LearningPathPlan, LearningSource,
  PredictionRecord, Provenance, ResearchProject, SandboxRun, StudyMode, Capability,
} from "./adaptive";
import type {
  AcademicArtifact, AcademicGoal, AIStyle, AnimationLevel, ChallengeLevel, GradeRecord, JournalEntry, KnowledgeCheck, Project, SchoolSubject,
} from "./academic";

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
  | "FEEDBACK_GENERATOR"
  | "QA_ASSISTANT"
  | "EXPLANATION_EVALUATOR"
  | "FLASHCARD_GENERATOR"
  | "MINDMAP_GENERATOR"
  | "GRANULARITY_VALIDATOR"
  | "PATH_PLANNER"
  | "STUCK_DETECTOR"
  | "ERROR_ANALYST"
  | "CURRICULUM_REVIEWER"
  | "RESEARCH_GUIDE";

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
  /** Daily spaced-repetition reminder (local notification). */
  reminders: { enabled: boolean; hour: number; minute: number; /** Notifications before school exams and deadlines. */ exams: boolean };
  /** NORMAL: understanding, mastery, retention, transfer. EXAM: a temporary layer of exam priorities over the same graph. */
  studyMode: StudyMode;
  /** The exam whose priorities apply in EXAM mode. */
  focusExamId?: ID;
  /** How hard suggested challenges should be (cognitive difficulty only). */
  challengeLevel: ChallengeLevel;
  /** How the AI should talk to the learner; sent with every AI request. */
  aiStyle: AIStyle;
  /** "off" also sets reduceMotion. */
  animation: AnimationLevel;
  /** Show a suggested "one thing now" on the home screen. */
  dailySuggestions: boolean;
  /** Deep work: minimal navigation and no analytics around the problem. */
  deepWork: boolean;
  /** Send AI only what the request needs (never the learner's history). Default on. */
  minimalAIContext: boolean;
  /** Keep a dated local snapshot of the database each day. */
  autoBackup: boolean;
  /** Spaced-repetition strategy per kind of item (see adaptive/retentionStrategy). */
  retentionStrategies?: { topics?: string; cards?: string };
  /** Set when the first-run question was answered or skipped. */
  firstRunAt?: Millis;
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
  /** Where the course content came from (AI, a book, the learner…). */
  provenance?: Provenance;
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
  /** The single independently assessable capability this milestone builds. */
  capability?: Capability;
  /** Last granularity check (generated milestones must pass before they are added). */
  granularity?: GranularityResult;
  provenance?: Provenance;
  /**
   * Temporary step created to break a milestone the learner is stuck on into
   * smaller pieces. Lives in the personal plan only (never in the graph) and is
   * archived once the parent milestone is mastered.
   */
  ephemeral?: { parentId: ID; reason: string; createdAt: Millis; archivedAt?: Millis };
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
  /** Learner marked it as a favourite in the question bank. */
  favorite?: boolean;
  /** This question is a variation (same skill, other numbers/context) of another one. */
  variantOf?: ID;
  /** What the variation changes, e.g. "different numbers". */
  variation?: string;
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
  /** Hypothesis, design, observed data, result, confidence and limitations, written when concluded. */
  report?: ExperimentReport;
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
  "FLASHCARD_REVIEW",
  "EXPLANATION",
  "TOPIC_REVIEW",
  // Adaptive layer (Lab 2.0 upgrade)
  "ERROR_IDENTIFIED",
  "ERROR_RECLASSIFIED",
  "REPAIR_STARTED",
  "REPAIR_COMPLETED",
  "INSIGHT_DETECTED",
  "STUCK_DETECTED",
  "STUCK_OPTION_CHOSEN",
  "PATH_CREATED",
  "PATH_MODIFIED",
  "PATH_ABANDONED",
  "PATH_RESUMED",
  "WHAT_NEXT_SHOWN",
  "WHAT_NEXT_CHOSEN",
  "MODE_CHANGED",
  "TRANSFER_ATTEMPT",
  "PREDICTION_SUBMITTED",
  "SANDBOX_STARTED",
  "SANDBOX_RESULT",
  "RESEARCH_STEP_COMPLETED",
  "CURRICULUM_PROPOSED",
  "CURRICULUM_DECIDED",
  // Academic layer (Final OS)
  "KNOWLEDGE_CHECK",
  "DECOMPOSED",
  "ENTRY_SHOWN",
  "ENTRY_CHOSEN",
  "DISCOVERY_SHOWN",
  "DISCOVERY_OPENED",
  "JOURNAL_ENTRY",
  "PROJECT_UPDATED",
  "ARTIFACT_SAVED",
  "GOAL_UPDATED",
  "DEEP_WORK",
  "SESSION_RESUMED",
  "REFLECTION",
  "SEARCH",
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
  /** The (single) user of this device; recorded so exported events stay attributable. */
  userId?: ID;
  /** Knowledge-graph objects (concepts) the event is about. */
  loIds?: string[];
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
  flashcards: Table<Flashcard>;
  chats: Table<ChatThread>;
  explanations: Table<Explanation>;
  /** Personal notes per learning object, keyed by object id. */
  notes: Table<StudyNote>;
  /** Spaced repetition of whole topics (graph objects), keyed by object id. */
  topicReviews: Table<TopicReview>;
  /** School exams, quizzes and deadlines with the graph topics they cover. */
  exams: Table<Exam>;
  // Adaptive layer
  /** Every wrong answer, classified and traced back into the graph. */
  errors: Table<ErrorRecord>;
  /** Patterns found across errors (recurring, cross-domain). */
  insights: Table<Insight>;
  /** Learning paths planned over the graph. */
  paths: Table<LearningPathPlan>;
  /** Books, courses, papers mapped to graph objects. */
  sources: Table<LearningSource>;
  curriculumProposals: Table<CurriculumProposal>;
  research: Table<ResearchProject>;
  sandboxRuns: Table<SandboxRun>;
  predictions: Table<PredictionRecord>;
  /** Engine and AI decisions with reason, confidence and evidence. */
  decisions: Table<DecisionRecord>;
  // Academic layer
  journal: Table<JournalEntry>;
  projects: Table<Project>;
  artifacts: Table<AcademicArtifact>;
  academicGoals: Table<AcademicGoal>;
  /** Short knowledge checks that replace bare "I know this" claims. */
  checks: Table<KnowledgeCheck>;
  schoolSubjects: Table<SchoolSubject>;
  grades: Table<GradeRecord>;
}

export type ExamKind = "EXAM" | "QUIZ" | "ASSIGNMENT" | "PRESENTATION";

export interface Exam {
  id: ID;
  title: string;
  kind: ExamKind;
  /** School subject as the learner calls it, e.g. "Physics". */
  subject: string;
  /** Start time of the exam (or deadline). */
  date: Millis;
  /** Graph objects the exam covers. */
  loIds: string[];
  /** Exam priority per covered object: 3 high, 2 medium, 1 low (default 2). */
  priorities?: Record<string, 1 | 2 | 3>;
  notes: string;
  /** Days before the exam to send a reminder; 0 = the morning of the exam. */
  remindDays: number[];
  createdAt: Millis;
  /** Filled in afterwards. */
  result?: { score?: number; outOf?: number; note?: string; at: Millis };
}

/** 0 forgot, 1 hard, 2 good, 3 easy — how well the topic came back when reviewed. */
export type TopicGrade = 0 | 1 | 2 | 3;

export interface TopicReview {
  /** Equal to the learning object id. */
  id: string;
  firstStudied: Millis;
  lastStudied: Millis;
  /** Index into the review ladder (1, 3, 7, 14, 30, 60, 120 days). */
  stage: number;
  due: Millis;
  history: { at: Millis; kind: "study" | "review"; grade?: TopicGrade }[];
}

// ---------------------------------------------------------------------------
// Study tools: flashcards, AI questions, explain-the-logic, notes
// ---------------------------------------------------------------------------

export type CardGrade = 0 | 1 | 2 | 3; // again, hard, good, easy

export interface Flashcard {
  id: ID;
  /** Learning object the card belongs to (optional for free cards). */
  loId?: string;
  front: string;
  back: string;
  kind: "BASIC" | "CLOZE" | "REVERSE";
  source: "AUTO" | "USER" | "AI";
  /** Stable key for auto cards so regeneration never duplicates them. */
  autoKey?: string;
  tags: string[];
  createdAt: Millis;
  /** SM-2 style scheduling. */
  due: Millis;
  intervalDays: number;
  ease: number;
  reps: number;
  lapses: number;
  /** Box/rung for ladder-style strategies. */
  stage?: number;
  suspended?: boolean;
  history: { at: Millis; grade: CardGrade; ms?: number }[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  at: Millis;
  provider?: string;
}

export interface ChatThread {
  id: ID;
  loId?: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Millis;
  updatedAt: Millis;
}

export interface ExplanationEvaluation {
  /** 0..1 */
  score: number;
  criteria: { criterion: string; met: boolean; comment?: string }[];
  strengths: string[];
  gaps: string[];
  misconceptions: string[];
  /** Questions that make the learner think further — never the answer. */
  followUps?: string[];
  /** Misconceptions linked to graph objects, when one could be found. */
  misconceptionLinks?: { text: string; loId?: string }[];
  feedback: string;
  provider: string;
  /** "ai" when a model judged it; "self" when the learner ticked the rubric. */
  by: "ai" | "self";
  at: Millis;
}

export interface Explanation {
  id: ID;
  loId?: string;
  /** What the learner set out to explain. */
  prompt: string;
  mode: "TEXT" | "AUDIO" | "VIDEO";
  text?: string;
  transcript?: string;
  /** Key of the recording in the media store (IndexedDB), if any. */
  mediaId?: string;
  mime?: string;
  durationSec?: number;
  sizeBytes?: number;
  evaluation?: ExplanationEvaluation;
  /** Feynman dialogue: this explanation answers a follow-up question of another one. */
  followUpOf?: ID;
  createdAt: Millis;
}

export interface StudyNote {
  /** Equal to the learning object id. */
  id: string;
  text: string;
  /** Extra mind-map branches the learner added. */
  mapItems: string[];
  updatedAt: Millis;
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
  /** The overlay before this update, so the update can be rolled back. */
  previousOverlay?: { version: string; objects: Record<string, LearningObject> };
  /** Set when the update was rolled back (the record stays as history). */
  rolledBackAt?: Millis;
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
  /** Provenance of objects added by updates or AI proposals, keyed by object id. */
  provenance?: Record<string, Provenance>;
  /** Applied one-off data migrations, e.g. "v2-link-milestones". */
  migrations: { id: string; at: Millis; note: string }[];
  /** Graph version the learner last saw (to announce updates). */
  seenVersion?: string;
}

export const SCHEMA_VERSION = 4;
