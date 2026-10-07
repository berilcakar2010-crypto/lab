/**
 * Switching language. Built-in content (packs, graph-generated courses) is
 * re-written in the new language field by field, and only where the stored
 * text is still exactly the built-in text of the old language — so anything
 * the learner edited, AI-generated courses and all progress stay as they are.
 */
import type { Course, CourseOrigin, LabDB, Question } from "../domain/types";
import { setLang, withLang, type Lang } from "../i18n";
import { packsByLang } from "../ai/localBuilder";
import { defaultMastery, DEFAULT_INTERACTION } from "../engines/curriculum";
import { sanitizeQuestion, type CurriculumSpec, type MilestoneSpec, type QuestionSpec } from "../engines/curriculumSpec";
import { courseSpecFor } from "./generate";
import { getGraph } from "./graph";
import { MILESTONE_TYPES, INTERACTION_TYPES, type InteractionType, type MilestoneType } from "../domain/types";

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Replace `obj[key]` with `to` only if it still equals `from`. Returns 1 when changed. */
function swap<T extends object, K extends keyof T>(obj: T, key: K, from: T[K] | undefined, to: T[K] | undefined): number {
  if (from === undefined || to === undefined || same(from, to) || !same(obj[key], from)) return 0;
  obj[key] = to;
  return 1;
}

/** Recover the origin of courses created before origins were recorded. */
export function inferOrigin(db: LabDB, course: Course): CourseOrigin | undefined {
  if (course.origin) return course.origin;
  const ms = Object.values(db.milestones).filter((m) => m.courseId === course.id);
  const pack = ms.map((m) => m.sourceKey?.split(":")[0]).find((p) => p === "mech" || p === "calc");
  if (pack) return { kind: "pack", pack };
  const cur = db.curricula[course.curriculumId];
  if (cur?.generatedBy?.startsWith("graph:")) {
    const ids = cur.source.text.split(":").slice(1).join(":").split(",").map((s) => s.trim()).filter(Boolean);
    if (ids.length) return { kind: "graph", loIds: ids };
  }
  return undefined;
}

function specFor(db: LabDB, origin: CourseOrigin, lang: Lang): CurriculumSpec | undefined {
  if (origin.kind === "pack") return packsByLang[origin.pack as keyof typeof packsByLang]?.[lang];
  return withLang(lang, () => {
    const g = getGraph(db.knowledge, lang);
    const first = g.objects[origin.loIds[origin.loIds.length - 1]] ?? g.objects[origin.loIds[0]];
    if (!first) return undefined;
    return courseSpecFor(g, origin.loIds, origin.title ?? first.title, `${first.title}: ${first.learningObjectives[0] ?? first.description}`);
  });
}

const asType = (t?: string): MilestoneType => {
  const u = (t ?? "").toUpperCase().replace(/[\s-]+/g, "_");
  return (MILESTONE_TYPES as readonly string[]).includes(u) ? (u as MilestoneType) : "PRACTICE";
};
const asInteraction = (t: string | undefined, fallback: InteractionType): InteractionType => {
  const u = (t ?? "").toUpperCase().replace(/[\s/-]+/g, "_");
  return (INTERACTION_TYPES as readonly string[]).includes(u) ? (u as InteractionType) : fallback;
};

/** The milestone text exactly as importCurriculum would store it, in `lang`. */
function storedMilestone(ms: MilestoneSpec, lang: Lang) {
  return withLang(lang, () => {
    const type = asType(ms.type);
    const difficulty = Math.min(5, Math.max(1, Math.round(Number(ms.difficulty) || 2)));
    const mastery = defaultMastery(type, difficulty);
    return {
      title: ms.title.trim(),
      learningObjective: (ms.learningObjective ?? "").trim() || ms.title.trim(),
      description: (ms.description ?? "").trim(),
      mastery: (ms.masteryCriterion ?? "").trim() || mastery.description,
      interaction: asInteraction(ms.interaction, DEFAULT_INTERACTION[type]),
    };
  });
}

function storedQuestion(q: QuestionSpec, fallback: InteractionType, lang: Lang) {
  return withLang(lang, () => sanitizeQuestion(q, "x", fallback, "x", []));
}

const Q_FIELDS = ["prompt", "hints", "solution", "rubric", "choices", "orderItems", "classification"] as const;

function relocalizeCourse(db: LabDB, course: Course, origin: CourseOrigin, from: CurriculumSpec, to: CurriculumSpec, fromLang: Lang, toLang: Lang): number {
  let n = 0;
  n += swap(course, "title", from.title, to.title);
  n += swap(course, "goal", from.goal, to.goal);
  n += swap(course, "description", from.description ?? "", to.description ?? "");
  const units = Object.values(db.units).filter((u) => u.courseId === course.id).sort((a, b) => a.order - b.order);
  units.forEach((u, ui) => {
    const fu = from.units[ui];
    const tu = to.units[ui];
    if (!fu || !tu) return;
    n += swap(u, "title", fu.title, tu.title);
    n += swap(u, "summary", fu.summary ?? "", tu.summary ?? "");
    const topics = Object.values(db.topics).filter((t) => t.unitId === u.id).sort((a, b) => a.order - b.order);
    topics.forEach((t, ti) => {
      const ft = fu.topics[ti];
      const tt = tu.topics[ti];
      if (!ft || !tt) return;
      n += swap(t, "title", ft.title, tt.title);
      const concepts = Object.values(db.concepts).filter((c) => c.topicId === t.id);
      concepts.forEach((c, ci) => {
        n += swap(c, "title", ft.concepts?.[ci]?.title, tt.concepts?.[ci]?.title);
        n += swap(c, "description", ft.concepts?.[ci]?.description ?? "", tt.concepts?.[ci]?.description ?? "");
      });
    });
  });
  // Milestones are matched by their stable key, wherever the learner moved them.
  const fromByKey = new Map<string, MilestoneSpec>();
  const toByKey = new Map<string, MilestoneSpec>();
  const keyOf = (ms: MilestoneSpec) => ms.sourceKey ?? (origin.kind === "pack" ? `${origin.pack}:${ms.key}` : `lo:${ms.key}`);
  for (const u of from.units) for (const t of u.topics) for (const ms of t.milestones) fromByKey.set(keyOf(ms), ms);
  for (const u of to.units) for (const t of u.topics) for (const ms of t.milestones) toByKey.set(keyOf(ms), ms);
  for (const m of Object.values(db.milestones)) {
    if (m.courseId !== course.id || !m.sourceKey) continue;
    const fm = fromByKey.get(m.sourceKey);
    const tm = toByKey.get(m.sourceKey);
    if (!fm || !tm) continue;
    const a = storedMilestone(fm, fromLang);
    const b = storedMilestone(tm, toLang);
    n += swap(m, "title", a.title, b.title);
    n += swap(m, "learningObjective", a.learningObjective, b.learningObjective);
    n += swap(m, "description", a.description, b.description);
    n += swap(m.masteryCriteria, "description", a.mastery, b.mastery);
    const qs = Object.values(db.questions).filter((q) => q.milestoneId === m.id);
    const fq = fm.questions ?? [];
    const tq = tm.questions ?? [];
    qs.forEach((q, qi) => {
      if (!fq[qi] || !tq[qi]) return;
      const sa = storedQuestion(fq[qi], a.interaction, fromLang);
      const sb = storedQuestion(tq[qi], b.interaction, toLang);
      if (!sa || !sb) return;
      for (const f of Q_FIELDS) n += swap(q as Question, f, sa[f] as Question[typeof f], sb[f] as Question[typeof f]);
    });
  }
  return n;
}

/** Switch the language and re-localise built-in content. Returns the number of fields changed. */
export function switchLanguage(db: LabDB, to: Lang): number {
  const from = db.preferences.language;
  let changed = 0;
  if (from !== to) {
    for (const course of Object.values(db.courses)) {
      const origin = inferOrigin(db, course);
      if (!origin) continue;
      course.origin ??= origin;
      const a = specFor(db, origin, from);
      const b = specFor(db, origin, to);
      if (a && b) changed += relocalizeCourse(db, course, origin, a, b, from, to);
    }
  }
  db.preferences.language = to;
  setLang(to);
  return changed;
}
