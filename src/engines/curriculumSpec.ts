/**
 * The interchange format between curriculum builders (AI providers, the
 * offline builder, built-in packs) and the curriculum engine. Builders only
 * produce this JSON; `importCurriculum` validates, repairs and stores it, so a
 * malformed AI response can never corrupt the database.
 */
import type {
  ID, InteractionType, LabDB, Milestone, MilestoneType, Question, QuestionPurpose, CurriculumSource,
} from "../domain/types";
import { INTERACTION_TYPES, MILESTONE_TYPES } from "../domain/types";
import {
  addConcept, addMilestone, addQuestion, addTopic, addUnit, clamp, createCourse, createSubject, DEFAULT_INTERACTION,
  defaultMastery, syncNextMilestones, courseMilestones,
} from "./curriculum";
import { breakCycles, type PrereqMap } from "./graph";
import { recomputeStatuses } from "./progress";

export interface QuestionSpec {
  kind?: string;
  purpose?: string;
  prompt: string;
  choices?: string[];
  correctChoice?: number;
  numeric?: { value: number; tolerance?: number; unit?: string };
  acceptedExpressions?: string[];
  variables?: string[];
  orderItems?: string[];
  classification?: { categories: string[]; items: { text: string; category: string }[] };
  graph?: { expression: string; xMin: number; xMax: number; xLabel?: string; yLabel?: string };
  simulation?: Question["simulation"];
  rubric?: string[];
  hints?: string[];
  solution?: string;
  difficulty?: number;
}

export interface MilestoneSpec {
  key: string;
  title: string;
  learningObjective?: string;
  description?: string;
  type?: string;
  difficulty?: number;
  estimatedMinutes?: number;
  prerequisites?: string[];
  optional?: boolean;
  interaction?: string;
  masteryCriterion?: string;
  requiredCorrect?: number;
  tags?: string[];
  conceptKeys?: string[];
  questions?: QuestionSpec[];
}

export interface TopicSpec {
  key?: string;
  title: string;
  concepts?: { key: string; title: string; description?: string }[];
  milestones: MilestoneSpec[];
}

export interface UnitSpec {
  key?: string;
  title: string;
  summary?: string;
  topics: TopicSpec[];
}

export interface CurriculumSpec {
  title: string;
  subject?: string;
  goal: string;
  description?: string;
  units: UnitSpec[];
}

export interface ImportReport {
  courseId: ID;
  milestoneCount: number;
  questionCount: number;
  repairs: string[];
}

const asType = (t: string | undefined): MilestoneType => {
  const u = (t ?? "").toUpperCase().replace(/[\s-]+/g, "_");
  return (MILESTONE_TYPES as readonly string[]).includes(u) ? (u as MilestoneType) : "PRACTICE";
};
const asInteraction = (t: string | undefined, fallback: InteractionType): InteractionType => {
  const u = (t ?? "").toUpperCase().replace(/[\s/-]+/g, "_");
  if (u === "DRAG_DROP" || u === "DRAG_AND_DROP") return "ORDERING";
  return (INTERACTION_TYPES as readonly string[]).includes(u) ? (u as InteractionType) : fallback;
};
const asPurpose = (p: string | undefined): QuestionPurpose => {
  const u = (p ?? "").toUpperCase();
  return u === "PRACTICE" || u === "RETENTION" || u === "TRANSFER" ? u : "MASTERY";
};
const str = (x: unknown, d = ""): string => (typeof x === "string" ? x.trim() : typeof x === "number" ? String(x) : d);
const strs = (x: unknown): string[] => (Array.isArray(x) ? x.map((v) => str(v)).filter(Boolean) : []);

const NUMERIC_CAPABLE = new Set<InteractionType>(["NUMERIC", "SIMULATION", "GRAPH_INTERPRETATION", "PREDICTION", "PROBLEM_SOLVING"]);

/** Make a question internally consistent, or return null if it is unusable. */
export function sanitizeQuestion(
  q: QuestionSpec,
  milestoneId: ID,
  fallbackKind: InteractionType,
  createdBy: string,
  repairs: string[],
): Omit<Question, "id"> | null {
  const prompt = str(q?.prompt);
  if (!prompt) return null;
  let kind = asInteraction(q.kind, fallbackKind);
  const base: Omit<Question, "id"> = {
    milestoneId,
    kind,
    purpose: asPurpose(q.purpose),
    prompt,
    rubric: strs(q.rubric),
    hints: strs(q.hints).slice(0, 4),
    solution: str(q.solution),
    difficulty: clamp(Math.round(Number(q.difficulty) || 2), 1, 5),
    createdBy,
  };
  const choices = strs(q.choices);
  const choiceKinds: InteractionType[] = ["MULTIPLE_CHOICE", "PREDICTION", "GRAPH_INTERPRETATION", "COMPARISON", "CLASSIFICATION"];
  if (choices.length >= 2 && Number.isInteger(q.correctChoice) && q.correctChoice! >= 0 && q.correctChoice! < choices.length) {
    base.choices = choices;
    base.correctChoice = q.correctChoice;
    if (!choiceKinds.includes(kind) && !q.numeric && !q.classification) kind = "MULTIPLE_CHOICE";
  } else if (kind === "MULTIPLE_CHOICE") {
    repairs.push(`Question "${prompt.slice(0, 40)}…" had invalid choices; converted to free response`);
    kind = "FREE_RESPONSE";
  }
  if (q.numeric && Number.isFinite(Number(q.numeric.value))) {
    base.numeric = {
      value: Number(q.numeric.value),
      tolerance: clamp(Number(q.numeric.tolerance) || 0.02, 0.0001, 0.5),
      unit: q.numeric.unit ? str(q.numeric.unit) : undefined,
    };
    if (!base.choices && !NUMERIC_CAPABLE.has(kind)) kind = "NUMERIC";
  } else if (kind === "NUMERIC") {
    repairs.push(`Numeric question "${prompt.slice(0, 40)}…" had no numeric answer; converted to free response`);
    kind = "FREE_RESPONSE";
  }
  const exprs = strs(q.acceptedExpressions);
  if (exprs.length) {
    base.acceptedExpressions = exprs;
    base.variables = strs(q.variables);
  } else if (kind === "EQUATION") {
    kind = "FREE_RESPONSE";
  }
  const order = strs(q.orderItems);
  if (order.length >= 2) base.orderItems = order;
  else if (kind === "ORDERING") kind = "FREE_RESPONSE";
  if (q.classification && Array.isArray(q.classification.items) && strs(q.classification.categories).length >= 2) {
    const cats = strs(q.classification.categories);
    const items = q.classification.items
      .map((i) => ({ text: str(i?.text), category: str(i?.category) }))
      .filter((i) => i.text && cats.includes(i.category));
    if (items.length >= 2) base.classification = { categories: cats, items };
  }
  if (kind === "CLASSIFICATION" && !base.classification) kind = base.choices ? "MULTIPLE_CHOICE" : "FREE_RESPONSE";
  if (q.graph && str(q.graph.expression) && Number.isFinite(q.graph.xMin) && Number.isFinite(q.graph.xMax) && q.graph.xMax > q.graph.xMin) {
    base.graph = { ...q.graph, expression: str(q.graph.expression) };
  } else if (kind === "GRAPH_INTERPRETATION") {
    kind = base.choices ? "MULTIPLE_CHOICE" : base.numeric ? "NUMERIC" : "FREE_RESPONSE";
  }
  if (q.simulation && Array.isArray(q.simulation.variables) && q.simulation.variables.length && str(q.simulation.expression)) {
    base.simulation = q.simulation;
  } else if (kind === "SIMULATION") {
    kind = base.numeric ? "NUMERIC" : "FREE_RESPONSE";
  }
  if (kind === "PREDICTION" && !base.choices && !base.numeric) kind = "FREE_RESPONSE";
  base.kind = kind;
  // Open responses need something to evaluate against.
  if (!base.rubric.length && !base.choices && !base.numeric && !base.acceptedExpressions && !base.orderItems && !base.classification) {
    base.rubric = base.solution ? [base.solution.slice(0, 200)] : ["States the key idea correctly and justifies it."];
  }
  return base;
}

export function importCurriculum(
  db: LabDB,
  spec: CurriculumSpec,
  meta: { source: CurriculumSource; generatedBy: string; subjectName?: string },
): ImportReport {
  const repairs: string[] = [];
  if (!spec || !Array.isArray(spec.units) || !spec.units.length) throw new Error("The curriculum has no units");
  const subject = createSubject(db, { name: str(meta.subjectName) || str(spec.subject) || str(spec.title) || "General" });
  const { course } = createCourse(db, {
    subjectId: subject.id,
    title: str(spec.title) || "Untitled course",
    description: str(spec.description),
    goal: str(spec.goal) || str(spec.title),
    source: meta.source,
    generatedBy: meta.generatedBy,
  });

  const keyToId = new Map<string, ID>();
  const pendingPrereqs: { id: ID; keys: string[] }[] = [];
  let questionCount = 0;

  spec.units.forEach((u, ui) => {
    if (!u || !Array.isArray(u.topics)) return;
    const unit = addUnit(db, course.id, str(u.title) || `Unit ${ui + 1}`, str(u.summary));
    u.topics.forEach((t, ti) => {
      if (!t || !Array.isArray(t.milestones) || !t.milestones.length) return;
      const topic = addTopic(db, unit.id, str(t.title) || `Topic ${ti + 1}`);
      const conceptIds = new Map<string, ID>();
      for (const c of t.concepts ?? []) {
        if (!str(c?.title)) continue;
        conceptIds.set(str(c.key) || str(c.title), addConcept(db, topic.id, str(c.title), str(c.description)).id);
      }
      for (const ms of t.milestones) {
        if (!str(ms?.title)) {
          repairs.push("Dropped a milestone without a title");
          continue;
        }
        const type = asType(ms.type);
        const difficulty = clamp(Math.round(Number(ms.difficulty) || 2), 1, 5);
        const minutes = clamp(Math.round(Number(ms.estimatedMinutes) || defaultMinutes(type)), 2, 600);
        const interaction = asInteraction(ms.interaction, DEFAULT_INTERACTION[type]);
        const mastery = defaultMastery(type, difficulty);
        if (str(ms.masteryCriterion)) mastery.description = str(ms.masteryCriterion);
        if (Number(ms.requiredCorrect) > 0) mastery.requiredCorrect = clamp(Math.round(Number(ms.requiredCorrect)), 1, 10);
        const m = addMilestone(db, {
          title: str(ms.title),
          topicId: topic.id,
          learningObjective: str(ms.learningObjective) || str(ms.title),
          description: str(ms.description),
          milestoneType: type,
          difficulty,
          estimatedDuration: minutes,
          optional: !!ms.optional,
          recommendedInteractionType: interaction,
          masteryCriteria: mastery,
          tags: strs(ms.tags),
          conceptIds: strs(ms.conceptKeys).map((k) => conceptIds.get(k)).filter((x): x is ID => !!x),
        });
        if (!m.conceptIds.length && conceptIds.size) m.conceptIds = [...conceptIds.values()].slice(0, 1);
        const key = str(ms.key) || m.id;
        if (keyToId.has(key)) repairs.push(`Duplicate milestone key "${key}"`);
        keyToId.set(key, m.id);
        pendingPrereqs.push({ id: m.id, keys: strs(ms.prerequisites) });
        for (const q of ms.questions ?? []) {
          const clean = sanitizeQuestion(q, m.id, interaction, meta.generatedBy, repairs);
          if (clean) {
            addQuestion(db, clean);
            questionCount++;
          }
        }
      }
    });
  });

  // Resolve prerequisite keys, drop unknown ones, and break any loops.
  const pm: PrereqMap = new Map();
  for (const { id, keys } of pendingPrereqs) {
    const ids: ID[] = [];
    for (const k of keys) {
      const target = keyToId.get(k);
      if (!target) repairs.push(`Unknown prerequisite "${k}" ignored`);
      else if (target !== id && !ids.includes(target)) ids.push(target);
    }
    pm.set(id, ids);
  }
  for (const [node, pre] of breakCycles(pm)) {
    repairs.push(`Removed loop: "${db.milestones[node].title}" no longer requires "${db.milestones[pre].title}"`);
  }
  for (const [id, ps] of pm) db.milestones[id].prerequisites = ps;
  syncNextMilestones(db, course.id);

  const ms = courseMilestones(db, course.id);
  if (!ms.length) throw new Error("The curriculum contains no usable milestones");
  if (!ms.some((m) => m.prerequisites.length === 0)) {
    ms[0].prerequisites = [];
    syncNextMilestones(db, course.id);
    repairs.push(`No starting point existed; "${ms[0].title}" is now a starting milestone`);
  }
  recomputeStatuses(db, course.id);
  return { courseId: course.id, milestoneCount: ms.length, questionCount, repairs };
}

export function defaultMinutes(type: MilestoneType): number {
  switch (type) {
    case "CONCEPT": return 10;
    case "REVIEW": return 10;
    case "PRACTICE": return 15;
    case "APPLICATION":
    case "PROBLEM_SOLVING": return 25;
    case "DERIVATION":
    case "PROOF": return 35;
    case "CHALLENGE": return 40;
    case "EXPERIMENT": return 30;
    case "BOSS": return 60;
    case "PROJECT": return 180;
  }
}

/** Convert milestones of one topic back into specs (for AI regeneration context). */
export function milestoneToSpec(db: LabDB, m: Milestone): MilestoneSpec {
  return {
    key: m.id,
    title: m.title,
    learningObjective: m.learningObjective,
    type: m.milestoneType,
    difficulty: m.difficulty,
    estimatedMinutes: m.estimatedDuration,
    prerequisites: m.prerequisites.map((p) => db.milestones[p]?.title ?? p),
  };
}

/**
 * Replace the milestones of one topic with newly generated ones. Edges into the
 * topic attach to the new roots; edges out of the topic attach to the new leaves.
 * Mastered milestones are kept (their history is the user's, not the AI's).
 */
export function replaceTopicMilestones(db: LabDB, topicId: ID, specs: MilestoneSpec[], generatedBy: string): { created: ID[]; repairs: string[] } {
  const topic = db.topics[topicId];
  if (!topic) throw new Error("Unknown topic");
  const repairs: string[] = [];
  const all = courseMilestones(db, topic.courseId);
  const old = all.filter((m) => m.topicId === topicId && !m.masteredAt);
  const oldIds = new Set(old.map((m) => m.id));
  const external = new Set<ID>();
  for (const m of old) for (const p of m.prerequisites) if (!oldIds.has(p)) external.add(p);
  const dependents = all.filter((m) => !oldIds.has(m.id) && m.prerequisites.some((p) => oldIds.has(p)));

  for (const m of old) {
    for (const q of Object.values(db.questions)) if (q.milestoneId === m.id) delete db.questions[q.id];
    for (const r of Object.values(db.retention)) if (r.milestoneId === m.id && !r.completedAt) delete db.retention[r.id];
    delete db.milestones[m.id];
  }
  const course = db.courses[topic.courseId];
  if (course.activeMilestoneId && oldIds.has(course.activeMilestoneId)) course.activeMilestoneId = undefined;
  if (course.startHereMilestoneId && oldIds.has(course.startHereMilestoneId)) course.startHereMilestoneId = undefined;

  const keyToId = new Map<string, ID>();
  const created: Milestone[] = [];
  const pending: { id: ID; keys: string[] }[] = [];
  for (const ms of specs) {
    if (!str(ms?.title)) continue;
    const type = asType(ms.type);
    const difficulty = clamp(Math.round(Number(ms.difficulty) || 2), 1, 5);
    const interaction = asInteraction(ms.interaction, DEFAULT_INTERACTION[type]);
    const mastery = defaultMastery(type, difficulty);
    if (str(ms.masteryCriterion)) mastery.description = str(ms.masteryCriterion);
    const m = addMilestone(db, {
      title: str(ms.title), topicId, learningObjective: str(ms.learningObjective) || str(ms.title), description: str(ms.description),
      milestoneType: type, difficulty, estimatedDuration: clamp(Math.round(Number(ms.estimatedMinutes) || defaultMinutes(type)), 2, 600),
      optional: !!ms.optional, recommendedInteractionType: interaction, masteryCriteria: mastery, tags: strs(ms.tags),
    });
    keyToId.set(str(ms.key) || m.id, m.id);
    pending.push({ id: m.id, keys: strs(ms.prerequisites) });
    created.push(m);
    for (const q of ms.questions ?? []) {
      const clean = sanitizeQuestion(q, m.id, interaction, generatedBy, repairs);
      if (clean) addQuestion(db, clean);
    }
  }
  if (!created.length) throw new Error("No usable milestones were generated");
  for (const { id, keys } of pending) {
    const internal = keys.map((k) => keyToId.get(k)).filter((x): x is ID => !!x && x !== id);
    db.milestones[id].prerequisites = internal.length ? [...new Set(internal)] : [...external].filter((e) => db.milestones[e]);
  }
  const pm: PrereqMap = new Map(courseMilestones(db, topic.courseId).map((m) => [m.id, [...m.prerequisites]]));
  for (const [node, pre] of breakCycles(pm)) repairs.push(`Removed loop between "${db.milestones[node].title}" and "${db.milestones[pre].title}"`);
  for (const [id, ps] of pm) db.milestones[id].prerequisites = ps;
  const createdIds = new Set(created.map((m) => m.id));
  const leaves = created.filter((m) => !created.some((o) => o.prerequisites.includes(m.id)));
  for (const d of dependents) {
    const ps = d.prerequisites.filter((p) => !oldIds.has(p));
    for (const l of leaves) if (!ps.includes(l.id)) ps.push(l.id);
    d.prerequisites = ps;
  }
  syncNextMilestones(db, topic.courseId);
  recomputeStatuses(db, topic.courseId);
  return { created: [...createdIds], repairs };
}
