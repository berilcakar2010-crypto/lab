/**
 * Versioned export and import of the whole academic state — the learner's
 * insurance against losing years of data or being locked in.
 *
 * Format (version 2):
 *   { format: "lab-export", version: 2, schemaVersion, exportedAt,
 *     metadata: { app, graphVersion, language, userId, counts },
 *     entities: { <table>: [records…] },     // every table, ids kept
 *     relationships: [{ from, to, type }],    // derived, for other tools
 *     events: [...], knowledge: {...}, preferences: {...}, user: {...} }
 *
 * API keys are never exported unless asked for. Import accepts this format
 * and the older raw backup (the database object itself); either way the data
 * goes through `hydrateDB`, which fills defaults and runs the migrations.
 */
import type { LabDB, Millis } from "../domain/types";
import { SCHEMA_VERSION } from "../domain/types";
import { ENTITY_TABLES, hydrateDB } from "./db";

export const EXPORT_FORMAT = "lab-export";
export const EXPORT_VERSION = 2;

export interface Relationship {
  from: { table: string; id: string };
  to: { table: string; id: string };
  type: string;
}

/** Relations between records (and from records to graph objects), derived from their ids. */
export function relationships(db: LabDB): Relationship[] {
  const out: Relationship[] = [];
  const rel = (ft: string, fid: string, tt: string, tid: string | undefined, type: string) => {
    if (tid) out.push({ from: { table: ft, id: fid }, to: { table: tt, id: tid }, type });
  };
  for (const m of Object.values(db.milestones)) {
    rel("milestones", m.id, "courses", m.courseId, "in_course");
    for (const lo of m.learningObjectIds ?? []) rel("milestones", m.id, "graph", lo, "practises");
    for (const p of m.prerequisites) rel("milestones", m.id, "milestones", p, "requires");
    if (m.ephemeral) rel("milestones", m.id, "milestones", m.ephemeral.parentId, "smaller_step_of");
  }
  for (const q of Object.values(db.questions)) {
    rel("questions", q.id, "milestones", q.milestoneId, "tests");
    rel("questions", q.id, "questions", q.variantOf, "variant_of");
  }
  for (const a of Object.values(db.attempts)) rel("attempts", a.id, "questions", a.questionId, "answers");
  for (const e of Object.values(db.errors)) {
    rel("errors", e.id, "attempts", e.attemptId, "from_attempt");
    rel("errors", e.id, "graph", e.trace?.repairLoId, "repair_at");
  }
  for (const j of Object.values(db.journal)) {
    for (const lo of j.loIds) rel("journal", j.id, "graph", lo, "about");
    rel("journal", j.id, "projects", j.projectId, "in_project");
  }
  for (const p of Object.values(db.projects)) {
    for (const lo of p.loIds) rel("projects", p.id, "graph", lo, "uses");
    for (const s of p.sourceIds) rel("projects", p.id, "sources", s, "cites");
    for (const r of p.researchIds) rel("projects", p.id, "research", r, "includes");
    for (const x of p.experimentIds) rel("projects", p.id, "experiments", x, "includes");
    for (const m of p.milestoneIds) rel("projects", p.id, "milestones", m, "includes");
    rel("projects", p.id, "academicGoals", p.goalId, "serves");
  }
  for (const a of Object.values(db.artifacts)) {
    for (const lo of a.loIds) rel("artifacts", a.id, "graph", lo, "about");
    rel("artifacts", a.id, "projects", a.projectId, "in_project");
    if (a.ref) rel("artifacts", a.id, a.ref.table, a.ref.id, "saved_from");
  }
  for (const g of Object.values(db.academicGoals)) for (const lo of g.loIds) rel("academicGoals", g.id, "graph", lo, "targets");
  for (const c of Object.values(db.checks)) {
    rel("checks", c.id, "graph", c.target.loId, "checks");
    rel("checks", c.id, "milestones", c.target.milestoneId, "checks");
  }
  for (const s of Object.values(db.schoolSubjects)) for (const lo of s.loIds) rel("schoolSubjects", s.id, "graph", lo, "covers");
  for (const gr of Object.values(db.grades)) rel("grades", gr.id, "schoolSubjects", gr.subjectId, "for_subject");
  for (const x of Object.values(db.exams)) for (const lo of x.loIds) rel("exams", x.id, "graph", lo, "covers");
  for (const s of Object.values(db.sources)) for (const sec of s.sections) for (const lo of sec.loIds) rel("sources", s.id, "graph", lo, "teaches");
  for (const r of Object.values(db.research)) for (const lo of r.loIds) rel("research", r.id, "graph", lo, "about");
  return out;
}

export function fullExport(db: LabDB, opts: { includeApiKeys?: boolean; now?: Millis; graphVersion?: string } = {}): string {
  const now = opts.now ?? Date.now();
  const entities = Object.fromEntries(ENTITY_TABLES.map((t) => [t, Object.values(db[t] as Record<string, unknown>)]));
  const counts = Object.fromEntries(ENTITY_TABLES.map((t) => [t, (entities[t] as unknown[]).length]));
  const preferences = { ...db.preferences, apiKeys: opts.includeApiKeys ? db.preferences.apiKeys : {} };
  return JSON.stringify({
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date(now).toISOString(),
    metadata: { app: "Lab", graphVersion: opts.graphVersion ?? db.knowledge.overlay.version, language: db.preferences.language, userId: db.user.id, counts, events: db.events.length },
    user: db.user,
    preferences,
    knowledge: db.knowledge,
    entities,
    events: db.events,
    relationships: relationships(db),
  });
}

export interface ImportResult {
  db: LabDB;
  format: "v2" | "legacy";
  /** Notes on what was filled in or ignored. */
  notes: string[];
}

/** Parse any Lab export or backup into a complete, migrated database. Throws on anything else. */
export function importFull(text: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Not a JSON file.");
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Not a Lab export.");
  const d = data as Record<string, unknown>;
  const notes: string[] = [];
  if (d.format === EXPORT_FORMAT) {
    if (typeof d.version !== "number" || d.version > EXPORT_VERSION) throw new Error(`Export version ${String(d.version)} is newer than this Lab understands (${EXPORT_VERSION}).`);
    const raw: Record<string, unknown> = { user: d.user, preferences: d.preferences, knowledge: d.knowledge, events: d.events, schemaVersion: d.schemaVersion };
    const ents = (d.entities ?? {}) as Record<string, unknown>;
    for (const t of ENTITY_TABLES) {
      const rows = ents[t];
      if (!Array.isArray(rows)) { notes.push(`${t}: missing, started empty`); continue; }
      const table: Record<string, unknown> = {};
      for (const r of rows as { id?: unknown }[]) if (r && typeof r.id === "string") table[r.id] = r;
      raw[t] = table;
    }
    return { db: hydrateDB(raw), format: "v2", notes };
  }
  if ("milestones" in d || "courses" in d || "knowledge" in d) return { db: hydrateDB(d), format: "legacy", notes };
  throw new Error("Not a Lab export.");
}
