/**
 * The learner's own academic records: journal entries, projects and the
 * artifacts they produce. Plain mutations meant to run inside `store.update`;
 * each logs a raw event so the timeline, portfolio and statistics are derived
 * from what actually happened.
 */
import type { ID, LabDB, Millis } from "../domain/types";
import {
  ARTIFACT_KINDS, JOURNAL_KINDS, PROJECT_KINDS,
  type AcademicArtifact, type ArtifactKind, type JournalEntry, type JournalKind, type Project, type ProjectKind, type ProjectStatus,
} from "../domain/academic";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { L } from "../i18n";
import { pushVersion } from "./versioning";

const clean = (s: unknown, max = 20_000) => String(s ?? "").trim().slice(0, max);
const uniq = <T,>(xs: T[]) => [...new Set(xs)];

// ---------------------------------------------------------------------------
// Journal
// ---------------------------------------------------------------------------

export const JOURNAL_LABEL = (k: JournalKind): string =>
  ({
    IDEA: L("Idea", "Fikir"), INSIGHT: L("Insight", "İçgörü"), QUESTION: L("Question", "Soru"), HYPOTHESIS: L("Hypothesis", "Hipotez"),
    CONFUSION: L("Confusion", "Kafa karışıklığı"), DISCOVERY: L("Discovery", "Keşif"), REFLECTION: L("Reflection", "Yansıtma"),
  })[k];

export function addJournal(db: LabDB, input: { kind: JournalKind; text: string; loIds?: string[]; projectId?: ID; sessionId?: ID }, now: Millis = Date.now()): JournalEntry {
  const text = clean(input.text);
  if (!text) throw new Error(L("Write something first.", "Önce bir şey yaz."));
  if (!JOURNAL_KINDS.includes(input.kind)) throw new Error(`Unknown journal kind ${input.kind}`);
  const e: JournalEntry = { id: newId("jr"), kind: input.kind, text, loIds: uniq(input.loIds ?? []), projectId: input.projectId, sessionId: input.sessionId, createdAt: now, updatedAt: now };
  db.journal[e.id] = e;
  logEvent(db, "JOURNAL_ENTRY", { sessionId: input.sessionId, loIds: e.loIds, at: now }, { kind: e.kind, id: e.id, projectId: e.projectId });
  return e;
}

export function updateJournal(db: LabDB, id: ID, patch: Partial<Pick<JournalEntry, "text" | "kind" | "loIds" | "projectId">>, now: Millis = Date.now()): void {
  const e = db.journal[id];
  if (!e) return;
  if (patch.text !== undefined) e.text = clean(patch.text) || e.text;
  if (patch.kind && JOURNAL_KINDS.includes(patch.kind)) e.kind = patch.kind;
  if (patch.loIds) e.loIds = uniq(patch.loIds);
  if ("projectId" in patch) e.projectId = patch.projectId;
  e.updatedAt = now;
}

export function deleteJournal(db: LabDB, id: ID): void {
  delete db.journal[id];
}

export const journalFor = (db: LabDB, loId: string) => Object.values(db.journal).filter((j) => j.loIds.includes(loId)).sort((a, b) => b.createdAt - a.createdAt);

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const PROJECT_LABEL = (k: ProjectKind): string =>
  ({
    PROJECT: L("Project", "Proje"), RESEARCH: L("Research project", "Araştırma projesi"), COMPETITION: L("Competition project", "Yarışma projesi"),
    PAPER: L("Paper", "Makale"), PRESENTATION: L("Presentation", "Sunum"), EXPERIMENT: L("Experiment", "Deney"), BOOK: L("Book", "Kitap"), CLUB: L("Club project", "Kulüp projesi"),
  })[k];

export const PROJECT_STATUS_LABEL = (s: ProjectStatus): string =>
  ({ ACTIVE: L("Active", "Etkin"), PAUSED: L("Paused", "Duraklatıldı"), DONE: L("Done", "Tamamlandı"), ARCHIVED: L("Archived", "Arşivde") })[s];

export function createProject(db: LabDB, input: { title: string; kind?: ProjectKind; goal?: string; loIds?: string[]; goalId?: ID }, now: Millis = Date.now()): Project {
  const title = clean(input.title, 200);
  if (!title) throw new Error(L("A project needs a title.", "Projenin bir başlığı olmalı."));
  const kind = input.kind && PROJECT_KINDS.includes(input.kind) ? input.kind : "PROJECT";
  const p: Project = {
    id: newId("prj"), title, kind, goal: clean(input.goal, 2000), status: "ACTIVE",
    questions: [], loIds: uniq(input.loIds ?? []), sourceIds: [], milestoneIds: [], researchIds: [], experimentIds: [],
    notes: "", results: "", nextQuestions: [], goalId: input.goalId, versions: [], createdAt: now, updatedAt: now,
  };
  db.projects[p.id] = p;
  if (input.goalId && db.academicGoals[input.goalId]) db.academicGoals[input.goalId].projectIds = uniq([...db.academicGoals[input.goalId].projectIds, p.id]);
  logEvent(db, "PROJECT_UPDATED", { loIds: p.loIds, at: now }, { action: "create", id: p.id, kind });
  return p;
}

export type ProjectPatch = Partial<Pick<Project, "title" | "kind" | "goal" | "status" | "questions" | "loIds" | "sourceIds" | "milestoneIds" | "researchIds" | "experimentIds" | "notes" | "results" | "nextQuestions" | "goalId">>;

/** Every change is versioned so the project's history can be read (and restored) later. */
export function updateProject(db: LabDB, id: ID, patch: ProjectPatch, summary = L("Edited", "Düzenlendi"), now: Millis = Date.now()): string[] {
  const p = db.projects[id];
  if (!p) return [];
  const fixed: ProjectPatch = { ...patch };
  for (const k of ["loIds", "sourceIds", "milestoneIds", "researchIds", "experimentIds"] as const) if (fixed[k]) fixed[k] = uniq(fixed[k]!);
  for (const k of ["questions", "nextQuestions"] as const) if (fixed[k]) fixed[k] = fixed[k]!.map((q) => clean(q, 500)).filter(Boolean);
  const changed = pushVersion<Project>(p, fixed, summary, now);
  if (changed.length) logEvent(db, "PROJECT_UPDATED", { loIds: p.loIds, at: now }, { action: "update", id, changed, status: p.status });
  return changed;
}

/** What a project has gathered, resolved against the rest of Lab. */
export function projectOverview(db: LabDB, id: ID) {
  const p = db.projects[id];
  if (!p) return null;
  return {
    project: p,
    artifacts: Object.values(db.artifacts).filter((a) => a.projectId === id).sort((a, b) => b.createdAt - a.createdAt),
    journal: Object.values(db.journal).filter((j) => j.projectId === id).sort((a, b) => b.createdAt - a.createdAt),
    research: p.researchIds.map((r) => db.research[r]).filter(Boolean),
    sources: p.sourceIds.map((s) => db.sources[s]).filter(Boolean),
    milestones: p.milestoneIds.map((m) => db.milestones[m]).filter(Boolean),
    experiments: p.experimentIds.map((e) => db.experiments[e]).filter(Boolean),
  };
}

// ---------------------------------------------------------------------------
// Artifacts
// ---------------------------------------------------------------------------

export const ARTIFACT_LABEL = (k: ArtifactKind): string =>
  ({
    DERIVATION: L("Derivation", "Türetme"), PROOF: L("Proof", "İspat"), NOTE: L("Note", "Not"), EXPLANATION: L("Explanation", "Açıklama"),
    SIMULATION: L("Simulation", "Simülasyon"), GRAPH: L("Graph", "Grafik"), CODE: L("Code", "Kod"), RESULT: L("Research result", "Araştırma sonucu"),
    PAPER: L("Paper", "Makale"), PRESENTATION: L("Presentation", "Sunum"), OTHER: L("Other", "Diğer"),
  })[k];

export function saveArtifact(db: LabDB, input: { kind: ArtifactKind; title: string; body?: string; url?: string; loIds?: string[]; projectId?: ID; ref?: AcademicArtifact["ref"] }, now: Millis = Date.now()): AcademicArtifact {
  const title = clean(input.title, 200);
  if (!title) throw new Error(L("An artifact needs a title.", "Eserin bir başlığı olmalı."));
  if (!ARTIFACT_KINDS.includes(input.kind)) throw new Error(`Unknown artifact kind ${input.kind}`);
  if (input.ref) {
    // Saving the same record twice updates the existing artifact instead of duplicating it.
    const prev = Object.values(db.artifacts).find((a) => a.ref?.table === input.ref!.table && a.ref.id === input.ref!.id);
    if (prev) {
      Object.assign(prev, { title, body: clean(input.body) || prev.body, loIds: uniq([...prev.loIds, ...(input.loIds ?? [])]), projectId: input.projectId ?? prev.projectId, updatedAt: now });
      return prev;
    }
  }
  const a: AcademicArtifact = { id: newId("art"), kind: input.kind, title, body: clean(input.body), url: input.url ? clean(input.url, 2000) : undefined, loIds: uniq(input.loIds ?? []), projectId: input.projectId, ref: input.ref, createdAt: now, updatedAt: now };
  db.artifacts[a.id] = a;
  logEvent(db, "ARTIFACT_SAVED", { loIds: a.loIds, at: now }, { kind: a.kind, id: a.id, projectId: a.projectId, ref: a.ref?.table });
  return a;
}

export function deleteArtifact(db: LabDB, id: ID): void {
  delete db.artifacts[id];
}

/** Save an existing Lab record (explanation, sandbox run, research project) as a portfolio artifact. */
export function artifactFromRecord(db: LabDB, table: "explanations" | "sandboxRuns" | "research", id: ID, projectId?: ID, now: Millis = Date.now()): AcademicArtifact | null {
  if (table === "explanations") {
    const e = db.explanations[id];
    if (!e) return null;
    return saveArtifact(db, { kind: "EXPLANATION", title: e.prompt.slice(0, 120), body: e.text ?? e.transcript ?? "", loIds: e.loId ? [e.loId] : [], projectId, ref: { table, id } }, now);
  }
  if (table === "sandboxRuns") {
    const r = db.sandboxRuns[id];
    if (!r) return null;
    return saveArtifact(db, { kind: "SIMULATION", title: r.title, body: r.evidence?.note || r.summary, loIds: r.loIds, projectId, ref: { table, id } }, now);
  }
  const p = db.research[id];
  if (!p) return null;
  const result = p.steps.RESULT?.text ?? p.steps.INTERPRETATION?.text ?? "";
  return saveArtifact(db, { kind: "RESULT", title: p.title, body: result, loIds: p.loIds, projectId, ref: { table, id } }, now);
}

export const artifactsFor = (db: LabDB, loId: string) => Object.values(db.artifacts).filter((a) => a.loIds.includes(loId)).sort((a, b) => b.createdAt - a.createdAt);
