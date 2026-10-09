/**
 * The learner's own changes to the knowledge graph, through the same safe
 * pipeline as every other update (validate → plan → apply → versioned
 * history):
 *
 *  - add a concept of their own (marked user-created);
 *  - rename a concept (the id never changes; the old title becomes an alias);
 *  - archive a concept (retired, kept as history — never deleted);
 *  - roll back the latest graph update.
 */
import type { GraphUpdateRecord, LabDB, Millis } from "../domain/types";
import { L } from "../i18n";
import { makeProvenance } from "../adaptive/provenance";
import { logEvent } from "../engines/analytics";
import { getBaseGraph } from "./graph";
import { applyPlan, diffUpdate, knownIds, type GraphUpdate, type UpdatePlan } from "./planner";
import { DOMAINS, type Domain, type EvidenceType, type LearningObject } from "./schema";
import { ID_LEDGER } from "./registry";

export function nextPatch(v: string): string {
  const parts = v.split(".").map((n) => parseInt(n, 10) || 0);
  while (parts.length < 3) parts.push(0);
  parts[parts.length - 1]++;
  return parts.join(".");
}

const slug = (s: string) =>
  s.toLocaleLowerCase("tr").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "concept";

export interface UserConceptInput {
  title: string;
  domain: Domain;
  description?: string;
  whyItMatters?: string;
  /** Required prerequisites (graph ids). */
  prerequisites?: string[];
  learningObjectives?: string[];
  difficulty?: number;
  aliases?: string[];
}

function apply(db: LabDB, update: GraphUpdate, now: Millis): { plan: UpdatePlan; record: GraphUpdateRecord } {
  const base = getBaseGraph(db.knowledge);
  const plan = diffUpdate(base, update, db);
  if (!plan.ok) {
    const why = [...plan.newErrors.map((e) => e.message), ...plan.changes.filter((c) => c.kind === "REDDEDILDI").map((c) => c.detail)];
    throw new Error(why.join(" ") || L("The change could not be applied.", "Değişiklik uygulanamadı."));
  }
  return { plan, record: applyPlan(db, plan, now) };
}

/** Add a concept of the learner's own. Returns its new, permanent id. */
export function addUserConcept(db: LabDB, input: UserConceptInput, now: Millis = Date.now()): string {
  const title = input.title.trim().slice(0, 140);
  if (!title) throw new Error(L("Name the concept.", "Kavrama bir ad ver."));
  if (!DOMAINS.includes(input.domain)) throw new Error(L("Choose a field.", "Bir alan seç."));
  const objectives = (input.learningObjectives ?? []).map((x) => x.trim()).filter(Boolean);
  if (!objectives.length) throw new Error(L("Say what someone who knows it can do (at least one objective).", "Bunu bilen birinin ne yapabildiğini yaz (en az bir hedef)."));
  const base = getBaseGraph(db.knowledge);
  const taken = new Set([...ID_LEDGER, ...knownIds(db), ...base.order]);
  let id = `user.${slug(title)}`;
  for (let i = 2; taken.has(id); i++) id = `user.${slug(title)}-${i}`;
  const evidence: EvidenceType[] = ["ACIKLAMA", "PROBLEM_COZME"];
  const obj: Partial<LearningObject> & { id: string } = {
    id, title, domain: input.domain, field: L("Your concepts", "Senin kavramların"), unit: L("Your concepts", "Senin kavramların"), topic: title,
    description: input.description?.trim() || title, whyItMatters: input.whyItMatters?.trim() ?? "",
    prerequisites: (input.prerequisites ?? []).filter((p) => base.objects[p]).map((p) => ({ id: p, strength: "ZORUNLU" as const })),
    learningObjectives: objectives, evidenceTypes: evidence, difficulty: Math.max(1, Math.min(5, Math.round(input.difficulty ?? 2))),
    estimatedScope: "S", coreQuestions: objectives.map((o) => L(`How would you show that you can ${o.charAt(0).toLowerCase()}${o.slice(1)}?`, `Şunu yapabildiğini nasıl gösterirsin: ${o}?`)).slice(0, 2),
    entryQuestions: [], tags: ["user"], aliases: (input.aliases ?? []).map((a) => a.trim()).filter(Boolean), reviewStatus: "TASLAK",
  };
  apply(db, { version: nextPatch(base.version), summary: L(`Your concept: ${title}`, `Senin kavramın: ${title}`), objects: [obj] }, now);
  db.knowledge.provenance = { ...(db.knowledge.provenance ?? {}), [id]: makeProvenance("USER_CREATED", { source: L("You", "Sen"), generatedByAI: false }, now) };
  logEvent(db, "CURRICULUM_EDIT", { at: now, loIds: [id] }, { action: "user_concept_add", lo: id });
  return id;
}

/** Rename without changing the id; the old title is kept as an alias so search still finds it. */
export function renameConcept(db: LabDB, id: string, newTitle: string, now: Millis = Date.now()): void {
  const base = getBaseGraph(db.knowledge);
  const o = base.objects[id];
  if (!o) throw new Error(L("Concept not found.", "Kavram bulunamadı."));
  const title = newTitle.trim();
  if (!title || title === o.title) return;
  const aliases = [...new Set([...(o.aliases ?? []), o.title])].filter((a) => a !== title);
  apply(db, { version: nextPatch(base.version), summary: L(`Renamed: ${o.title} → ${title}`, `Yeniden adlandırıldı: ${o.title} → ${title}`), objects: [{ id, title, aliases }] }, now);
  logEvent(db, "CURRICULUM_EDIT", { at: now, loIds: [id] }, { action: "lo_rename", lo: id });
}

/** Archive (retire) a concept. It stays in the graph as history; progress and links are kept. */
export function archiveConcept(db: LabDB, id: string, reason: string, supersededBy: string[] = [], now: Millis = Date.now()): void {
  const base = getBaseGraph(db.knowledge);
  if (!base.objects[id]) throw new Error(L("Concept not found.", "Kavram bulunamadı."));
  apply(db, { version: nextPatch(base.version), summary: L(`Archived: ${base.objects[id].title}`, `Arşivlendi: ${base.objects[id].title}`), retire: [{ id, supersededBy, reason }] }, now);
  logEvent(db, "CURRICULUM_EDIT", { at: now, loIds: [id] }, { action: "lo_archive", lo: id, supersededBy });
}

/** The latest update that can still be rolled back, if any. */
export const rollbackable = (db: LabDB): GraphUpdateRecord | undefined =>
  [...db.knowledge.history].reverse().find((h) => !h.rolledBackAt && h.previousOverlay && !h.id.startsWith("rollback"));

/**
 * Undo the latest graph update: the overlay goes back to its state before it.
 * The update stays in the history (marked rolled back) and the rollback is a
 * new version, so the history is never rewritten. Milestones that were relinked
 * keep their extra links (harmless; progress is never lost).
 */
export function rollbackLastUpdate(db: LabDB, now: Millis = Date.now()): GraphUpdateRecord | null {
  const last = rollbackable(db);
  if (!last || !last.previousOverlay) return null;
  // Only the most recent applied update can be undone, so later versions are never lost.
  const newest = [...db.knowledge.history].reverse().find((h) => !h.rolledBackAt && !h.id.startsWith("rollback"));
  if (newest !== last) return null;
  const current = getBaseGraph(db.knowledge).version;
  const toVersion = nextPatch(current);
  db.knowledge.overlay = { version: toVersion, objects: structuredClone(last.previousOverlay.objects) };
  last.rolledBackAt = now;
  const rec: GraphUpdateRecord = {
    id: `rollback_${now.toString(36)}`, at: now, fromVersion: current, toVersion,
    summary: L(`Rolled back ${last.toVersion}: ${last.summary}`, `${last.toVersion} geri alındı: ${last.summary}`),
    added: [], modified: [...last.added, ...last.modified], retired: [], relinkedMilestones: 0,
  };
  db.knowledge.history.push(rec);
  logEvent(db, "CURRICULUM_EDIT", { at: now }, { action: "graph_rollback", version: last.toVersion });
  return rec;
}
