/**
 * Curriculum engine: creates and edits subjects, courses, curricula, units,
 * topics, concepts, milestones and questions. All functions operate on a LabDB
 * object and are independent of the UI. Graph integrity (no dangling or cyclic
 * prerequisites, inverse `nextMilestones` edges) is maintained here.
 */
import type {
  Concept, Course, Curriculum, CurriculumSource, ID, LabDB, MasteryCriteria, Milestone,
  MilestoneScope, MilestoneType, Question, Subject, Topic, Unit, InteractionType,
} from "../domain/types";
import { newId } from "../data/ids";
import { L } from "../i18n";
import { breakCycles, dependsOn, findCycle, topoSort, type PrereqMap } from "./graph";

export class CurriculumError extends Error {}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const courseMilestones = (db: LabDB, courseId: ID): Milestone[] =>
  Object.values(db.milestones)
    // Archived temporary steps (see adaptive/decompose) are history, not part of the plan.
    .filter((m) => m.courseId === courseId && !m.ephemeral?.archivedAt)
    .sort((a, b) => a.order - b.order);

export const courseUnits = (db: LabDB, courseId: ID): Unit[] =>
  Object.values(db.units).filter((u) => u.courseId === courseId).sort((a, b) => a.order - b.order);

export const unitTopics = (db: LabDB, unitId: ID): Topic[] =>
  Object.values(db.topics).filter((t) => t.unitId === unitId).sort((a, b) => a.order - b.order);

export const milestoneQuestions = (db: LabDB, milestoneId: ID): Question[] =>
  Object.values(db.questions).filter((q) => q.milestoneId === milestoneId);

export function prereqMap(db: LabDB, courseId: ID): PrereqMap {
  const m: PrereqMap = new Map();
  for (const ms of courseMilestones(db, courseId)) m.set(ms.id, [...ms.prerequisites]);
  return m;
}

/** Milestones in a sensible study order: prerequisites first, then user order. */
export function orderedMilestones(db: LabDB, courseId: ID): Milestone[] {
  const ms = courseMilestones(db, courseId);
  const byId = new Map(ms.map((m) => [m.id, m]));
  return topoSort(prereqMap(db, courseId), (id) => byId.get(id)?.order ?? 0).map((id) => byId.get(id)!);
}

// ---------------------------------------------------------------------------
// Creation
// ---------------------------------------------------------------------------

export function createSubject(db: LabDB, input: { name: string; description?: string }): Subject {
  const name = input.name.trim();
  if (!name) throw new CurriculumError(L("Subject name is required", "Alan adı gerekli"));
  const existing = Object.values(db.subjects).find((s) => s.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing;
  const s: Subject = { id: newId("subj"), name, description: input.description ?? "", createdAt: Date.now() };
  db.subjects[s.id] = s;
  return s;
}

export function createCourse(
  db: LabDB,
  input: {
    subjectId: ID;
    title: string;
    description?: string;
    goal: string;
    source: CurriculumSource;
    generatedBy: string;
  },
): { course: Course; curriculum: Curriculum } {
  if (!db.subjects[input.subjectId]) throw new CurriculumError(L("Unknown subject", "Bilinmeyen alan"));
  if (!input.title.trim()) throw new CurriculumError(L("Course title is required", "Ders adı gerekli"));
  const now = Date.now();
  const courseId = newId("course");
  const curriculum: Curriculum = {
    id: newId("curr"),
    subjectId: input.subjectId,
    courseId,
    goal: input.goal,
    source: input.source,
    generatedBy: input.generatedBy,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };
  const course: Course = {
    id: courseId,
    subjectId: input.subjectId,
    curriculumId: curriculum.id,
    title: input.title.trim(),
    description: input.description ?? "",
    goal: input.goal,
    archived: false,
    createdAt: now,
  };
  db.curricula[curriculum.id] = curriculum;
  db.courses[course.id] = course;
  return { course, curriculum };
}

export function addUnit(db: LabDB, courseId: ID, title: string, summary = ""): Unit {
  requireCourse(db, courseId);
  const u: Unit = { id: newId("unit"), courseId, title, summary, order: courseUnits(db, courseId).length };
  db.units[u.id] = u;
  return u;
}

export function addTopic(db: LabDB, unitId: ID, title: string): Topic {
  const unit = db.units[unitId];
  if (!unit) throw new CurriculumError(L("Unknown unit", "Bilinmeyen ünite"));
  const t: Topic = { id: newId("topic"), courseId: unit.courseId, unitId, title, order: unitTopics(db, unitId).length };
  db.topics[t.id] = t;
  return t;
}

export function addConcept(db: LabDB, topicId: ID, title: string, description = ""): Concept {
  const topic = db.topics[topicId];
  if (!topic) throw new CurriculumError(L("Unknown topic", "Bilinmeyen konu"));
  const c: Concept = { id: newId("concept"), courseId: topic.courseId, topicId, title, description };
  db.concepts[c.id] = c;
  return c;
}

export function defaultMastery(type: MilestoneType, difficulty: number): MasteryCriteria {
  const heavy = type === "BOSS" || type === "CHALLENGE" || type === "PROJECT";
  return {
    description: heavy
      ? L("Solve the challenge correctly without a full solution reveal.", "Tam çözümü açmadan meydan okumayı doğru çöz.")
      : L("Answer the mastery questions correctly without needing the full solution.", "Ustalık sorularını tam çözüme bakmadan doğru cevapla."),
    requiredCorrect: heavy ? 1 : difficulty >= 4 ? 3 : 2,
    requireUnassisted: true,
    minScore: 0.7,
  };
}

/** Scope reflects intellectual size, not a fixed time box. */
export function scopeFor(type: MilestoneType, minutes: number): MilestoneScope {
  if (type === "PROJECT" || minutes >= 120) return "PROJECT";
  if (type === "BOSS" || minutes >= 45) return "EXTENDED";
  if (minutes <= 15) return "MICRO";
  return "STANDARD";
}

export const DEFAULT_INTERACTION: Record<MilestoneType, InteractionType> = {
  CONCEPT: "CONCEPT_EXPLANATION",
  PRACTICE: "NUMERIC",
  APPLICATION: "PROBLEM_SOLVING",
  DERIVATION: "DERIVATION",
  PROOF: "PROOF",
  PROBLEM_SOLVING: "PROBLEM_SOLVING",
  EXPERIMENT: "SIMULATION",
  PROJECT: "FREE_RESPONSE",
  REVIEW: "MULTIPLE_CHOICE",
  CHALLENGE: "PROBLEM_SOLVING",
  BOSS: "PROBLEM_SOLVING",
};

export type MilestoneInput = Partial<Omit<Milestone, "id" | "courseId" | "subjectId" | "unitId" | "createdAt" | "updatedAt">> & {
  title: string;
  topicId: ID;
};

export function addMilestone(db: LabDB, input: MilestoneInput): Milestone {
  const topic = db.topics[input.topicId];
  if (!topic) throw new CurriculumError(L("Unknown topic", "Bilinmeyen konu"));
  const course = requireCourse(db, topic.courseId);
  const type = input.milestoneType ?? "PRACTICE";
  const difficulty = clamp(Math.round(input.difficulty ?? 2), 1, 5);
  const minutes = Math.max(2, Math.round(input.estimatedDuration ?? 20));
  const now = Date.now();
  const m: Milestone = {
    id: newId("ms"),
    subjectId: course.subjectId,
    courseId: course.id,
    unitId: topic.unitId,
    topicId: topic.id,
    conceptIds: input.conceptIds ?? [],
    title: input.title.trim(),
    description: input.description ?? "",
    learningObjective: input.learningObjective ?? input.title.trim(),
    prerequisites: [],
    nextMilestones: [],
    difficulty,
    estimatedDuration: minutes,
    scope: input.scope ?? scopeFor(type, minutes),
    status: "LOCKED",
    masteryCriteria: input.masteryCriteria ?? defaultMastery(type, difficulty),
    milestoneType: type,
    optional: input.optional ?? false,
    required: input.required ?? !(input.optional ?? false),
    recommendedInteractionType: input.recommendedInteractionType ?? DEFAULT_INTERACTION[type],
    tags: input.tags ?? [],
    order: input.order ?? courseMilestones(db, course.id).length,
    createdAt: now,
    updatedAt: now,
  };
  if (m.optional) m.required = false;
  db.milestones[m.id] = m;
  for (const p of input.prerequisites ?? []) connectPrerequisite(db, m.id, p);
  touchCurriculum(db, course.id);
  return m;
}

export function addQuestion(db: LabDB, q: Omit<Question, "id"> & { id?: ID }): Question {
  if (!db.milestones[q.milestoneId]) throw new CurriculumError(L("Unknown milestone", "Bilinmeyen adım"));
  const question: Question = { ...q, id: q.id ?? newId("q") };
  db.questions[question.id] = question;
  return question;
}

// ---------------------------------------------------------------------------
// Graph editing
// ---------------------------------------------------------------------------

export function connectPrerequisite(db: LabDB, milestoneId: ID, prereqId: ID) {
  const m = db.milestones[milestoneId];
  const p = db.milestones[prereqId];
  if (!m || !p) throw new CurriculumError(L("Unknown milestone", "Bilinmeyen adım"));
  if (m.courseId !== p.courseId) throw new CurriculumError(L("Prerequisites must be in the same course", "Ön koşullar aynı derste olmalı"));
  if (milestoneId === prereqId) throw new CurriculumError(L("A milestone cannot require itself", "Bir adım kendisini ön koşul alamaz"));
  if (m.prerequisites.includes(prereqId)) return;
  if (dependsOn(prereqMap(db, m.courseId), prereqId, milestoneId)) {
    throw new CurriculumError(L(`"${p.title}" already depends on "${m.title}"; this would create a loop`, `"${p.title}" zaten "${m.title}" adımına bağlı; bu bir döngü oluşturur`));
  }
  m.prerequisites.push(prereqId);
  if (!p.nextMilestones.includes(milestoneId)) p.nextMilestones.push(milestoneId);
  m.updatedAt = Date.now();
}

export function removePrerequisite(db: LabDB, milestoneId: ID, prereqId: ID) {
  const m = db.milestones[milestoneId];
  if (!m) return;
  m.prerequisites = m.prerequisites.filter((x) => x !== prereqId);
  const p = db.milestones[prereqId];
  if (p) p.nextMilestones = p.nextMilestones.filter((x) => x !== milestoneId);
  m.updatedAt = Date.now();
}

/** Rebuild every `nextMilestones` list from `prerequisites`. */
export function syncNextMilestones(db: LabDB, courseId: ID) {
  const ms = courseMilestones(db, courseId);
  for (const m of ms) m.nextMilestones = [];
  for (const m of ms) {
    m.prerequisites = m.prerequisites.filter((p) => db.milestones[p]?.courseId === courseId && p !== m.id);
    for (const p of m.prerequisites) db.milestones[p].nextMilestones.push(m.id);
  }
}

export type MilestonePatch = Partial<
  Pick<
    Milestone,
    | "title" | "description" | "learningObjective" | "difficulty" | "estimatedDuration" | "milestoneType"
    | "optional" | "required" | "recommendedInteractionType" | "tags" | "masteryCriteria" | "topicId" | "scope"
  >
>;

export function updateMilestone(db: LabDB, id: ID, patch: MilestonePatch): Milestone {
  const m = db.milestones[id];
  if (!m) throw new CurriculumError(L("Unknown milestone", "Bilinmeyen adım"));
  if (patch.title !== undefined && !patch.title.trim()) throw new CurriculumError(L("Title cannot be empty", "Başlık boş olamaz"));
  Object.assign(m, patch);
  if (patch.topicId) {
    const t = db.topics[patch.topicId];
    if (!t || t.courseId !== m.courseId) throw new CurriculumError(L("Topic must belong to the same course", "Konu aynı derse ait olmalı"));
    m.unitId = t.unitId;
  }
  m.difficulty = clamp(Math.round(m.difficulty), 1, 5);
  m.estimatedDuration = Math.max(2, Math.round(m.estimatedDuration));
  if (patch.optional === true) m.required = false;
  if (patch.required === true) m.optional = false;
  if (patch.estimatedDuration !== undefined || patch.milestoneType !== undefined) {
    if (patch.scope === undefined) m.scope = scopeFor(m.milestoneType, m.estimatedDuration);
  }
  m.updatedAt = Date.now();
  touchCurriculum(db, m.courseId);
  return m;
}

/**
 * Delete a milestone. Its dependents inherit its prerequisites so no
 * progression path dead-ends. Raw history (attempts, events) is preserved.
 */
export function deleteMilestone(db: LabDB, id: ID) {
  const m = db.milestones[id];
  if (!m) return;
  for (const dep of courseMilestones(db, m.courseId)) {
    if (!dep.prerequisites.includes(id)) continue;
    dep.prerequisites = dep.prerequisites.filter((p) => p !== id);
    for (const p of m.prerequisites) if (!dep.prerequisites.includes(p)) dep.prerequisites.push(p);
  }
  for (const q of milestoneQuestions(db, id)) delete db.questions[q.id];
  for (const r of Object.values(db.retention)) if (r.milestoneId === id && !r.completedAt) delete db.retention[r.id];
  delete db.milestones[id];
  const course = db.courses[m.courseId];
  if (course?.activeMilestoneId === id) course.activeMilestoneId = undefined;
  if (course?.startHereMilestoneId === id) course.startHereMilestoneId = undefined;
  syncNextMilestones(db, m.courseId);
  renumber(db, m.courseId);
  touchCurriculum(db, m.courseId);
}

/** Move a milestone to a new position in the course's display order. */
export function reorderMilestone(db: LabDB, id: ID, toIndex: number) {
  const m = db.milestones[id];
  if (!m) throw new CurriculumError(L("Unknown milestone", "Bilinmeyen adım"));
  const list = courseMilestones(db, m.courseId).filter((x) => x.id !== id);
  list.splice(clamp(toIndex, 0, list.length), 0, m);
  list.forEach((x, i) => (x.order = i));
  touchCurriculum(db, m.courseId);
}

export interface SplitPart {
  title: string;
  learningObjective?: string;
  description?: string;
  milestoneType?: MilestoneType;
  difficulty?: number;
  estimatedDuration?: number;
}

/**
 * Split a milestone into a chain of smaller ones. The first part inherits the
 * original prerequisites, the last part feeds the original dependents, and the
 * original id is kept by the first part so history stays attached.
 */
export function splitMilestone(db: LabDB, id: ID, parts: SplitPart[]): Milestone[] {
  const m = db.milestones[id];
  if (!m) throw new CurriculumError(L("Unknown milestone", "Bilinmeyen adım"));
  if (parts.length < 2) throw new CurriculumError(L("Split needs at least two parts", "Bölmek için en az iki parça gerekli"));
  const dependents = courseMilestones(db, m.courseId).filter((d) => d.prerequisites.includes(id));
  const share = Math.max(2, Math.round(m.estimatedDuration / parts.length));

  Object.assign(m, {
    title: parts[0].title,
    learningObjective: parts[0].learningObjective ?? parts[0].title,
    description: parts[0].description ?? m.description,
    milestoneType: parts[0].milestoneType ?? m.milestoneType,
    difficulty: clamp(parts[0].difficulty ?? m.difficulty, 1, 5),
    estimatedDuration: parts[0].estimatedDuration ?? share,
    updatedAt: Date.now(),
  });
  m.scope = scopeFor(m.milestoneType, m.estimatedDuration);
  m.masteryCriteria = { ...m.masteryCriteria, requiredCorrect: Math.max(1, Math.ceil(m.masteryCriteria.requiredCorrect / 2)) };
  m.masteredAt = undefined;

  const created: Milestone[] = [m];
  let prev = m;
  for (const part of parts.slice(1)) {
    const next = addMilestone(db, {
      title: part.title,
      topicId: m.topicId,
      learningObjective: part.learningObjective,
      description: part.description,
      milestoneType: part.milestoneType ?? m.milestoneType,
      difficulty: part.difficulty ?? m.difficulty,
      estimatedDuration: part.estimatedDuration ?? share,
      tags: [...m.tags],
      conceptIds: [...m.conceptIds],
      optional: m.optional,
      recommendedInteractionType: m.recommendedInteractionType,
      prerequisites: [prev.id],
    });
    next.masteryCriteria = { ...m.masteryCriteria };
    created.push(next);
    prev = next;
  }
  for (const d of dependents) {
    d.prerequisites = d.prerequisites.map((p) => (p === id ? prev.id : p));
  }
  // Spread existing questions across the parts round-robin.
  milestoneQuestions(db, id).forEach((q, i) => (q.milestoneId = created[i % created.length].id));
  syncNextMilestones(db, m.courseId);
  placeAfter(db, created);
  touchCurriculum(db, m.courseId);
  return created;
}

/**
 * Merge several milestones of one course into the first. Prerequisites are
 * unioned (minus the merged set), dependents re-point to the survivor, and
 * questions/attempts move with it.
 */
export function mergeMilestones(db: LabDB, ids: ID[], title?: string): Milestone {
  const unique = [...new Set(ids)];
  if (unique.length < 2) throw new CurriculumError(L("Select at least two milestones to merge", "Birleştirmek için en az iki adım seç"));
  const ms = unique.map((id) => {
    const m = db.milestones[id];
    if (!m) throw new CurriculumError(L("Unknown milestone", "Bilinmeyen adım"));
    return m;
  });
  const courseId = ms[0].courseId;
  if (ms.some((m) => m.courseId !== courseId)) throw new CurriculumError(L("Milestones must be in the same course", "Adımlar aynı derste olmalı"));
  const keep = ms[0];
  const merged = new Set(unique);
  const prereqs = new Set<ID>();
  for (const m of ms) for (const p of m.prerequisites) if (!merged.has(p)) prereqs.add(p);

  keep.title = title?.trim() || keep.title;
  keep.learningObjective = ms.map((m) => m.learningObjective).join(" ");
  keep.description = ms.map((m) => m.description).filter(Boolean).join("\n\n");
  keep.difficulty = Math.max(...ms.map((m) => m.difficulty));
  keep.estimatedDuration = ms.reduce((s, m) => s + m.estimatedDuration, 0);
  keep.scope = scopeFor(keep.milestoneType, keep.estimatedDuration);
  keep.tags = [...new Set(ms.flatMap((m) => m.tags))];
  keep.conceptIds = [...new Set(ms.flatMap((m) => m.conceptIds))];
  keep.prerequisites = [...prereqs];
  keep.masteredAt = ms.every((m) => m.masteredAt) ? Math.max(...ms.map((m) => m.masteredAt!)) : undefined;
  keep.updatedAt = Date.now();

  for (const m of ms.slice(1)) {
    for (const q of milestoneQuestions(db, m.id)) q.milestoneId = keep.id;
    for (const a of Object.values(db.attempts)) if (a.milestoneId === m.id) a.milestoneId = keep.id;
    for (const r of Object.values(db.retention)) if (r.milestoneId === m.id) r.milestoneId = keep.id;
    delete db.milestones[m.id];
    const course = db.courses[courseId];
    if (course.activeMilestoneId === m.id) course.activeMilestoneId = keep.id;
    if (course.startHereMilestoneId === m.id) course.startHereMilestoneId = keep.id;
  }
  for (const d of courseMilestones(db, courseId)) {
    if (d.id === keep.id) continue;
    const ps = d.prerequisites.map((p) => (merged.has(p) ? keep.id : p));
    d.prerequisites = [...new Set(ps)];
  }
  // Merging can create a loop if a merged milestone sat between two others.
  const pm = prereqMap(db, courseId);
  breakCycles(pm);
  for (const [id, ps] of pm) db.milestones[id].prerequisites = ps;
  syncNextMilestones(db, courseId);
  renumber(db, courseId);
  touchCurriculum(db, courseId);
  return keep;
}

export function deleteCourse(db: LabDB, courseId: ID) {
  const course = db.courses[courseId];
  if (!course) return;
  for (const m of courseMilestones(db, courseId)) {
    for (const q of milestoneQuestions(db, m.id)) delete db.questions[q.id];
    delete db.milestones[m.id];
  }
  for (const t of ["units", "topics", "concepts"] as const) {
    for (const x of Object.values(db[t])) if (x.courseId === courseId) delete db[t][x.id];
  }
  for (const r of Object.values(db.retention)) if (!db.milestones[r.milestoneId]) delete db.retention[r.id];
  delete db.curricula[course.curriculumId];
  delete db.courses[courseId];
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface ValidationIssue {
  level: "error" | "warning";
  message: string;
  milestoneId?: ID;
}

export function validateCourse(db: LabDB, courseId: ID): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ms = courseMilestones(db, courseId);
  for (const m of ms) {
    for (const p of m.prerequisites) {
      const pm = db.milestones[p];
      if (!pm) issues.push({ level: "error", message: L(`"${m.title}" requires a missing milestone`, `"${m.title}" eksik bir adıma bağlı`), milestoneId: m.id });
      else if (pm.courseId !== courseId) issues.push({ level: "error", message: L(`"${m.title}" requires a milestone from another course`, `"${m.title}" başka bir dersteki adıma bağlı`), milestoneId: m.id });
    }
    if (!db.topics[m.topicId]) issues.push({ level: "error", message: L(`"${m.title}" has no topic`, `"${m.title}" bir konuya bağlı değil`), milestoneId: m.id });
    if (m.masteredAt && m.skippedAt) issues.push({ level: "warning", message: L(`"${m.title}" is both mastered and skipped`, `"${m.title}" hem ustalaşılmış hem atlanmış`), milestoneId: m.id });
  }
  const cycle = findCycle(prereqMap(db, courseId));
  if (cycle) {
    issues.push({ level: "error", message: L(`Prerequisite loop: ${cycle.map((id) => db.milestones[id]?.title).join(" → ")}`, `Ön koşul döngüsü: ${cycle.map((id) => db.milestones[id]?.title).join(" → ")}`) });
  }
  if (ms.length && !ms.some((m) => m.prerequisites.length === 0)) {
    issues.push({ level: "error", message: L("No milestone can be started: every milestone has prerequisites", "Hiçbir adıma başlanamıyor: her adımın ön koşulu var") });
  }
  return issues;
}

/** Throws if the course graph has errors. Used as a `transact` validator. */
export function assertValidCourse(db: LabDB, courseId: ID) {
  const errors = validateCourse(db, courseId).filter((i) => i.level === "error");
  if (errors.length) throw new CurriculumError(errors.map((e) => e.message).join("; "));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function requireCourse(db: LabDB, courseId: ID): Course {
  const c = db.courses[courseId];
  if (!c) throw new CurriculumError(L("Unknown course", "Bilinmeyen ders"));
  return c;
}

function touchCurriculum(db: LabDB, courseId: ID) {
  const c = db.courses[courseId];
  const cur = c && db.curricula[c.curriculumId];
  if (cur) {
    cur.updatedAt = Date.now();
    cur.version += 1;
  }
}

function renumber(db: LabDB, courseId: ID) {
  courseMilestones(db, courseId).forEach((m, i) => (m.order = i));
}

/** Put newly created split parts right after the first part in display order. */
function placeAfter(db: LabDB, chain: Milestone[]) {
  const courseId = chain[0].courseId;
  const rest = courseMilestones(db, courseId).filter((m) => !chain.includes(m));
  const at = rest.findIndex((m) => m.order > chain[0].order);
  const list = at < 0 ? [...rest, ...chain] : [...rest.slice(0, at), ...chain, ...rest.slice(at)];
  // chain[0] may already be in `rest` position order; dedupe.
  const seen = new Set<ID>();
  const final = list.filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)));
  final.forEach((m, i) => (m.order = i));
}

export function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}
