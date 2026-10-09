/**
 * Types for the adaptive learning layer (Lab 2.0 upgrade): error analysis,
 * mastery profiles, milestone capabilities, learning paths, provenance and
 * sources, AI curriculum proposals, research, sandbox, predictions and the
 * decision log. Everything here is plain data stored in `LabDB` (or derived
 * from it) so it is exported, imported and migrated like the rest.
 */
import type { AIProviderId, AIRole, HintLevel, ID, Millis } from "./types";

// ---------------------------------------------------------------------------
// Error analysis
// ---------------------------------------------------------------------------

export const ERROR_CATEGORIES = [
  "CONCEPTUAL",
  "FORMULA_SELECTION",
  "CALCULATION",
  "ATTENTION",
  "PREREQUISITE",
  "STRATEGY",
  "ASSUMPTION",
  "INTERPRETATION",
  "TRANSFER",
  "RECALL",
] as const;
export type ErrorCategory = (typeof ERROR_CATEGORIES)[number];

export type ErrorResolution = "OPEN" | "REPAIRING" | "RESOLVED" | "DISMISSED";

export type TraceStepKind = "error" | "skill" | "milestone" | "concept" | "prerequisite" | "repair";

/** A hypothesis linking an error back into the knowledge graph. Never presented as certain. */
export interface ErrorTrace {
  /** Graph object whose skill most likely failed. */
  suspectedSkill?: string;
  /** The concept (graph object) the question practised. */
  concept?: string;
  /** Weak prerequisite of the concept, when the error points below it. */
  prerequisite?: string;
  /** Where to repair: a graph object, and an existing milestone for it if there is one. */
  repairLoId?: string;
  repairMilestoneId?: ID;
  /** 0..1 — how much the trace should be trusted. */
  confidence: number;
  steps: { kind: TraceStepKind; id?: string; label: string }[];
  reason: string;
}

export interface ErrorRecord {
  id: ID;
  attemptId: ID;
  questionId: ID;
  milestoneId: ID;
  courseId?: ID;
  subjectId?: ID;
  sessionId?: ID;
  /** Graph objects the milestone practises. */
  loIds: string[];
  category: ErrorCategory;
  /** 0..1 confidence that the category is right. */
  confidence: number;
  /** Who classified it: deterministic rules, an AI model, the learner, or a migration of old data. */
  source: "rule" | "ai" | "self" | "legacy";
  reason: string;
  hintLevel: HintLevel;
  /** The learner's own confidence for the attempt (1..5), if given. */
  learnerConfidence?: number;
  trace?: ErrorTrace;
  resolution: ErrorResolution;
  repair?: { loId?: string; milestoneId?: ID; startedAt?: Millis; completedAt?: Millis };
  createdAt: Millis;
  resolvedAt?: Millis;
}

export type InsightKind = "CROSS_DOMAIN_MISCONCEPTION" | "RECURRING_ERROR";

export interface Insight {
  id: ID;
  kind: InsightKind;
  /** Stable key (kind|concept|category) so repeated detection updates one insight. */
  key: string;
  loId?: string;
  category: ErrorCategory;
  /** Error record ids that support it. */
  evidence: ID[];
  /** Subjects (or courses without a subject) the errors came from. */
  affectedSubjects: string[];
  confidence: number;
  summary: string;
  createdAt: Millis;
  updatedAt: Millis;
  dismissed?: boolean;
}

// ---------------------------------------------------------------------------
// Mastery profile (derived from evidence; snapshots are exported)
// ---------------------------------------------------------------------------

export const MASTERY_DIMENSIONS = ["recall", "understanding", "application", "problemSolving", "transfer", "explanation", "retention"] as const;
export type MasteryDimension = (typeof MASTERY_DIMENSIONS)[number];

export interface DimensionScore {
  /** 0..1, or null when there is no evidence for this dimension. */
  score: number | null;
  /** Number of pieces of evidence. */
  n: number;
  /** Total evidence weight (assistance and quality lower it). */
  weight: number;
  lastAt?: Millis;
}

export type RetentionStatus = "FRESH" | "FADING" | "STALE" | "UNKNOWN";

export interface MasteryProfile {
  /** Graph object id, or "ms:<milestoneId>" for a milestone without a graph link. */
  key: string;
  dims: Record<MasteryDimension, DimensionScore>;
  /** 0..1 from verified evidence only. */
  verified: number;
  /** 0..1 from the learner's own claim ("I know this"). Never counted as verified. */
  selfDeclared: number;
  lastVerifiedAt?: Millis;
  evidenceCount: number;
  /** Accuracy over the most recent evidence, or null. */
  recentPerformance: number | null;
  retentionStatus: RetentionStatus;
  /** 0..1 — how much evidence the verified score rests on. */
  confidence: number;
  /** Depth layers reached (0..7), see MASTERY_DIMENSIONS. */
  depth: number;
}

// ---------------------------------------------------------------------------
// Milestone capability and granularity
// ---------------------------------------------------------------------------

export const COGNITIVE_ACTIONS = [
  "RECALL", "EXPLAIN", "CALCULATE", "APPLY", "ANALYZE", "DERIVE", "PROVE", "PREDICT", "COMPARE", "DESIGN", "MODEL", "EVALUATE", "CREATE", "INTERPRET",
] as const;
export type CognitiveAction = (typeof COGNITIVE_ACTIONS)[number];

export interface Capability {
  /** "Given two dependent events, calculate and explain conditional probability." */
  capability: string;
  cognitiveAction: CognitiveAction;
  /** How it is assessed, e.g. "2 numeric problems, unassisted". */
  assessmentMethod: string;
  /** What counts as evidence of mastery. */
  masteryEvidence: string;
  /** Minutes. */
  estimatedEffort?: number;
}

export const GRANULARITY_STATUSES = ["VALID", "TOO_BROAD", "TOO_NARROW", "DUPLICATE", "MISSING_PREREQUISITE", "WEAK_EVIDENCE"] as const;
export type GranularityStatus = (typeof GRANULARITY_STATUSES)[number];

export interface GranularityResult {
  status: GranularityStatus[];
  /** One human-readable note per non-valid status. */
  notes: string[];
  /** Id of the duplicate, when DUPLICATE. */
  duplicateOf?: string;
  checkedAt: Millis;
}

// ---------------------------------------------------------------------------
// Learning paths (planner output; the curriculum itself never changes)
// ---------------------------------------------------------------------------

export type StudyMode = "NORMAL" | "EXAM";

export const REASON_CODES = [
  "PREREQUISITE", "MASTERY_GAP", "IMPORTANCE", "CENTRALITY", "RECENT_ERRORS", "RETENTION", "GOAL_RELEVANCE", "SELF_DECLARED", "EXAM", "USER",
] as const;
export type ReasonCode = (typeof REASON_CODES)[number];

export interface Reason {
  code: ReasonCode;
  text: string;
  /** The number behind the reason (gap, count, centrality…), when there is one. */
  value?: number;
}

export type PathStepRole = "repair" | "prerequisite" | "target" | "verify" | "review";

export interface PathStep {
  loId: string;
  role: PathStepRole;
  reasons: Reason[];
  score: number;
  status: "TODO" | "DONE" | "SKIPPED";
  addedByUser?: boolean;
}

export interface PathOptions {
  difficulty: "gentle" | "normal" | "stretch";
  /** Also follow soft prerequisites. */
  includeSoft: boolean;
}

export interface LearningPathPlan {
  id: ID;
  goalIds: string[];
  title: string;
  mode: StudyMode;
  examId?: ID;
  options: PathOptions;
  steps: PathStep[];
  status: "ACTIVE" | "PAUSED" | "ABANDONED" | "COMPLETED";
  createdAt: Millis;
  updatedAt: Millis;
  history: { at: Millis; action: string; detail?: string }[];
}

// ---------------------------------------------------------------------------
// Sources and provenance
// ---------------------------------------------------------------------------

export const SOURCE_TYPES = ["TEXTBOOK", "COURSE", "PAPER", "OFFICIAL_DOCUMENT", "OPEN_RESOURCE", "AI_GENERATED", "USER_CREATED", "OTHER"] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export interface Provenance {
  sourceType: SourceType;
  source?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  addedAt: Millis;
  lastVerifiedAt?: Millis;
  verifiedBy?: string;
  /** 0..1 */
  confidence: number;
  generatedByAI: boolean;
  /** UNVERIFIED unless a person checked it against the source. AI never self-verifies. */
  verification: "VERIFIED" | "UNVERIFIED";
}

/** A book, course, paper… that teaches parts of the graph. It is never the curriculum itself. */
export interface LearningSource {
  id: ID;
  title: string;
  type: SourceType;
  author?: string;
  url?: string;
  sections: { id: ID; title: string; loIds: string[] }[];
  provenance: Provenance;
  createdAt: Millis;
}

// ---------------------------------------------------------------------------
// AI curriculum proposals: generate → validate → diff → approve → version → apply
// ---------------------------------------------------------------------------

export type ProposalChangeKind = "ADD_NODE" | "MODIFY_NODE" | "REMOVE_NODE" | "ADD_PREREQ" | "REMOVE_PREREQ" | "ADD_MILESTONE" | "CHANGE_MILESTONE";

export interface ProposalChange {
  id: ID;
  kind: ProposalChangeKind;
  /** Graph object id (or proposed milestone key). */
  target: string;
  /** Second endpoint for prerequisite changes. */
  other?: string;
  title: string;
  detail: string;
  valid: boolean;
  issues: string[];
  /** Changes that must also be applied (e.g. a milestone needs its node). */
  dependsOn: ID[];
}

export interface ProposedNode {
  id: string;
  title: string;
  domain: string;
  unit: string;
  description: string;
  whyItMatters: string;
  prerequisites: string[];
  learningObjectives: string[];
  difficulty: number;
  provenance: Provenance;
}

export interface ProposedMilestone {
  key: string;
  loId: string;
  title: string;
  capability: Capability;
  startingQuestion: string;
  attempt: string;
  learningMaterial: string;
  application: string;
  masteryEvidence: string;
  transfer: string;
  difficulty: number;
  estimatedDuration: number;
  granularity: GranularityResult;
}

export interface CurriculumProposal {
  id: ID;
  request: string;
  goal: string;
  createdAt: Millis;
  status: "PENDING" | "APPLIED" | "PARTIAL" | "REJECTED";
  /** Existing graph objects reused instead of duplicated. */
  reused: string[];
  /** Missing prerequisites found on the way to the goal. */
  missingPrereqs: string[];
  nodes: ProposedNode[];
  milestones: ProposedMilestone[];
  changes: ProposalChange[];
  /** Graph validator errors the proposal would introduce. */
  graphErrors: string[];
  generatedBy: AIProviderId | "engine";
  fallbackUsed: boolean;
  notes: string[];
  decidedAt?: Millis;
  approvedChangeIds?: ID[];
  appliedVersion?: string;
  courseId?: ID;
}

// ---------------------------------------------------------------------------
// Research, sandbox and predictions
// ---------------------------------------------------------------------------

export const RESEARCH_STEPS = [
  "KNOWN", "OPEN_QUESTION", "ASSUMPTIONS", "MODEL", "PREDICTION", "SIMULATION", "RESULT", "INTERPRETATION", "LIMITATIONS", "NEXT_QUESTION",
] as const;
export type ResearchStep = (typeof RESEARCH_STEPS)[number];

export interface ResearchProject {
  id: ID;
  title: string;
  loIds: string[];
  steps: Partial<Record<ResearchStep, { text: string; doneAt?: Millis; sandboxRunId?: ID }>>;
  status: "OPEN" | "DONE";
  createdAt: Millis;
  updatedAt: Millis;
}

export type SandboxKind = "SWEEP" | "ODE" | "DATA";

export interface SandboxRun {
  id: ID;
  kind: SandboxKind;
  title: string;
  /** The exact input, so the run can be repeated. */
  input: Record<string, unknown>;
  /** Short text summary of the result. */
  summary: string;
  /** Bounded numeric output for re-plotting (series of [x, y]). */
  series: { label: string; points: [number, number][] }[];
  stats?: Record<string, number>;
  loIds: string[];
  researchId?: ID;
  /** Saved as evidence for these objects, with the learner's interpretation. */
  evidence?: { savedAt: Millis; note: string };
  createdAt: Millis;
}

export type Direction = "UP" | "DOWN" | "SAME" | "NONMONOTONIC";

export interface PredictionRecord {
  id: ID;
  modelId: string;
  loIds: string[];
  question: string;
  prediction: { direction: Direction; value?: number };
  result: { direction: Direction; base: number; changed: number };
  correct: boolean;
  explanation?: string;
  /** 0..1 rubric score of the explanation, when assessed. */
  explanationScore?: number;
  createdAt: Millis;
}

// ---------------------------------------------------------------------------
// Decision log: every critical engine or AI decision with its reason
// ---------------------------------------------------------------------------

export interface DecisionRecord {
  id: ID;
  role: AIRole;
  decision: string;
  reason: string;
  confidence: number;
  evidence: string[];
  /** "engine" for deterministic decisions made by Lab's own rules. */
  provider: AIProviderId | "engine";
  fallbackUsed: boolean;
  /** What the decision is about, e.g. "path:<id>", "error:<id>". */
  ref?: string;
  createdAt: Millis;
}

// ---------------------------------------------------------------------------
// Experiments: the written result
// ---------------------------------------------------------------------------

export interface ExperimentReport {
  hypothesis: string;
  design: string;
  observed: string;
  result: "SUPPORTED" | "NOT_SUPPORTED" | "INCONCLUSIVE";
  confidence: number;
  limitations: string[];
  createdAt: Millis;
}
