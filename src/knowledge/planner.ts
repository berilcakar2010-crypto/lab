/**
 * Safe graph updates (sections 35–36). An update — from the learner or an AI —
 * is never written blindly:
 *   1. diffUpdate: compare it with the current graph and classify every change;
 *   2. the plan is validated as a whole and shown to the learner;
 *   3. applyPlan: only a plan without new errors is applied, as an overlay.
 * Base content is never mutated, ids are never deleted or reused, and progress
 * on a retired object follows it to its successors.
 */
import type { GraphUpdateRecord, LabDB } from "../domain/types";
import { newId } from "../data/ids";
import { assembleGraph } from "./graph";
import { BASE_OBJECTS } from "./content";
import { ID_LEDGER, RETIRED_IDS } from "./registry";
import {
  CURRICULUM_VERSION, DOMAINS, EVIDENCE_TYPES, LO_MILESTONE_TYPES, PREREQ_STRENGTHS, SCOPES,
  type KnowledgeGraph, type LearningObject,
} from "./schema";
import { validateGraph, type Issue } from "./validate";
import { generateMasteryCriteria, LAST_REVIEWED } from "./dsl";

export interface GraphUpdate {
  version: string;
  summary?: string;
  /** New objects, or changes to existing ones (only the given fields change). */
  objects?: (Partial<LearningObject> & { id: string })[];
  /** Split, merged or dropped objects. They stay in the graph as history. */
  retire?: { id: string; supersededBy?: string[]; reason?: string }[];
  /** Deletion is not allowed; listed ids are refused with an explanation. */
  remove?: string[];
}

export type ChangeKind = "EKLE" | "DEGISTIR" | "KULLANIM_DISI" | "REDDEDILDI";
export const CHANGE_LABEL: Record<ChangeKind, string> = {
  EKLE: "Yeni nesne",
  DEGISTIR: "Değişiklik",
  KULLANIM_DISI: "Kullanım dışı",
  REDDEDILDI: "Reddedildi",
};

export interface Change {
  kind: ChangeKind;
  id: string;
  title: string;
  detail: string;
  fields?: string[];
  /** Milestones whose progress is linked to this object. */
  affectedMilestones: number;
}

export interface UpdatePlan {
  fromVersion: string;
  toVersion: string;
  summary: string;
  changes: Change[];
  /** Validator errors the update would introduce. */
  newErrors: Issue[];
  newWarnings: Issue[];
  ok: boolean;
  overlay: { version: string; objects: Record<string, LearningObject> };
  retired: { id: string; supersededBy: string[] }[];
}

const IMMUTABLE = new Set(["id", "stableId", "unlocks", "schoolMappings", "apMappings", "recommendedResources"]);

export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

/** Fills a new object's missing fields so the validator, not a crash, reports what's missing. */
function completeNew(p: Partial<LearningObject> & { id: string }, version: string): LearningObject {
  const evidence = (p.evidenceTypes ?? []).filter((e) => (EVIDENCE_TYPES as readonly string[]).includes(e));
  return {
    stableId: p.id,
    title: p.id,
    domain: "ARASTIRMA",
    field: "",
    unit: "",
    topic: p.title ?? p.id,
    description: "",
    whyItMatters: "",
    prerequisites: [],
    unlocks: [],
    entryQuestions: [],
    coreQuestions: [],
    learningObjectives: [],
    masteryCriteria: generateMasteryCriteria(evidence),
    evidenceTypes: evidence,
    difficulty: 2,
    estimatedScope: "M",
    milestoneType: "KAVRAM",
    status: "AKTIF",
    optional: false,
    required: true,
    challenge: false,
    boss: false,
    reviewable: true,
    interdisciplinaryLinks: [],
    researchApplications: [],
    competitionApplications: [],
    schoolMappings: [],
    apMappings: [],
    recommendedResources: [],
    resourceNotes: [],
    commonMisconceptions: [],
    relatedConcepts: [],
    contrastsWith: [],
    tags: [],
    reviewStatus: "TASLAK",
    requiresSources: false,
    lastReviewed: LAST_REVIEWED,
    ...p,
    version,
  } as LearningObject;
}

/** Rejects field values outside the schema; returns a reason or null. */
function invalidField(o: Partial<LearningObject>): string | null {
  if (o.domain && !(DOMAINS as readonly string[]).includes(o.domain)) return `bilinmeyen alan "${o.domain}"`;
  if (o.milestoneType && !(LO_MILESTONE_TYPES as readonly string[]).includes(o.milestoneType)) return `bilinmeyen tür "${o.milestoneType}"`;
  if (o.estimatedScope && !(SCOPES as readonly string[]).includes(o.estimatedScope)) return `bilinmeyen kapsam "${o.estimatedScope}"`;
  if (o.difficulty !== undefined && !(Number.isInteger(o.difficulty) && o.difficulty >= 1 && o.difficulty <= 5)) return "zorluk 1–5 arasında olmalı";
  if (o.prerequisites?.some((p) => !p?.id || !(PREREQ_STRENGTHS as readonly string[]).includes(p.strength))) return "geçersiz önkoşul";
  if (o.evidenceTypes?.some((e) => !(EVIDENCE_TYPES as readonly string[]).includes(e))) return "bilinmeyen kanıt türü";
  return null;
}

function linkedCount(db: LabDB | undefined, id: string): number {
  if (!db) return 0;
  return Object.values(db.milestones).filter((m) => m.learningObjectIds?.includes(id)).length;
}

const errorKey = (i: Issue) => `${i.code}|${i.loId ?? ""}|${i.message}`;

export function knownIds(db?: LabDB): string[] {
  return (db?.knowledge.history ?? []).flatMap((h) => h.added);
}

export function diffUpdate(g: KnowledgeGraph, update: GraphUpdate, db?: LabDB): UpdatePlan {
  const toVersion = String(update?.version ?? "").trim();
  const changes: Change[] = [];
  const overlay: Record<string, LearningObject> = { ...(db?.knowledge.overlay.objects ?? {}) };
  const retired: { id: string; supersededBy: string[] }[] = [];
  const everIssued = new Set([...ID_LEDGER, ...knownIds(db), ...RETIRED_IDS.map((r) => r.id)]);
  const reject = (id: string, detail: string) => changes.push({ kind: "REDDEDILDI", id, title: g.objects[id]?.title ?? id, detail, affectedMilestones: 0 });

  if (!toVersion) reject("—", "Güncellemenin bir sürüm numarası olmalı (ör. 2.1.0).");
  else if (compareVersions(toVersion, g.version) <= 0) reject("—", `Sürüm ${toVersion}, mevcut ${g.version} sürümünden büyük olmalı.`);

  for (const raw of update?.objects ?? []) {
    const id = String(raw?.id ?? "").trim();
    if (!id || !/^[a-z0-9][a-z0-9.-]*$/.test(id)) { reject(id || "?", "Geçersiz ID: küçük harf, rakam, nokta ve tire kullanılmalı."); continue; }
    const bad = invalidField(raw);
    if (bad) { reject(id, `Geçersiz alan: ${bad}.`); continue; }
    const existing = g.objects[id];
    if (!existing) {
      if (everIssued.has(id)) { reject(id, "Bu ID daha önce verilmiş; ID'ler yeniden kullanılamaz. Yeni bir ID seç."); continue; }
      overlay[id] = completeNew(raw, toVersion);
      changes.push({ kind: "EKLE", id, title: overlay[id].title, detail: `${overlay[id].domain} alanına yeni nesne.`, affectedMilestones: 0 });
      continue;
    }
    if (existing.status === "KULLANIM_DISI" || existing.status === "YERINE_GECILDI") { reject(id, "Kullanım dışı bir nesne değiştirilemez; yerine geçen nesneyi güncelle."); continue; }
    const fields = Object.keys(raw).filter((k) => !IMMUTABLE.has(k) && JSON.stringify((raw as Record<string, unknown>)[k]) !== JSON.stringify((existing as unknown as Record<string, unknown>)[k]));
    if (!fields.length) continue;
    const next = { ...existing, ...raw, id, stableId: existing.stableId, version: toVersion } as LearningObject;
    if (fields.includes("evidenceTypes") && !raw.masteryCriteria) next.masteryCriteria = generateMasteryCriteria(next.evidenceTypes);
    overlay[id] = next;
    changes.push({ kind: "DEGISTIR", id, title: next.title, detail: `Değişen alanlar: ${fields.join(", ")}.`, fields, affectedMilestones: linkedCount(db, id) });
  }

  for (const r of update?.retire ?? []) {
    const o = g.objects[r?.id];
    if (!o) { reject(r?.id ?? "?", "Kullanım dışı bırakılacak nesne bulunamadı."); continue; }
    const successors = (r.supersededBy ?? []).filter(Boolean);
    const missing = successors.filter((s) => !g.objects[s] && !overlay[s]);
    if (missing.length) { reject(o.id, `Yerine geçecek nesneler bulunamadı: ${missing.join(", ")}.`); continue; }
    overlay[o.id] = {
      ...(overlay[o.id] ?? o),
      status: successors.length ? "YERINE_GECILDI" : "KULLANIM_DISI",
      supersededBy: successors,
      version: toVersion,
    };
    retired.push({ id: o.id, supersededBy: successors });
    const n = linkedCount(db, o.id);
    changes.push({
      kind: "KULLANIM_DISI", id: o.id, title: o.title,
      detail: successors.length
        ? `Yerine geçenler: ${successors.join(", ")}.${n ? ` ${n} adımın ilerlemesi yeni nesnelere de bağlanacak; eski bağlantı silinmez.` : ""}`
        : `Yerine geçen yok; nesne geçmiş olarak kalır.${r.reason ? ` Gerekçe: ${r.reason}` : ""}`,
      affectedMilestones: n,
    });
  }

  // Objects that depended on a retired object now depend on its successors (shown in the plan).
  for (const r of retired) {
    if (!r.supersededBy.length) continue;
    for (const oid of g.order) {
      const o = overlay[oid] ?? g.objects[oid];
      if (o.status === "KULLANIM_DISI" || o.status === "YERINE_GECILDI" || !o.prerequisites.some((p) => p.id === r.id)) continue;
      const prerequisites = o.prerequisites.flatMap((p) => (p.id === r.id ? r.supersededBy.filter((s) => s !== oid).map((s) => ({ ...p, id: s })) : [p]));
      const seen = new Set<string>();
      overlay[oid] = { ...o, prerequisites: prerequisites.filter((p) => !seen.has(p.id) && seen.add(p.id)), version: toVersion };
      changes.push({
        kind: "DEGISTIR", id: oid, title: o.title, fields: ["prerequisites"],
        detail: `Önkoşul ${r.id} yerine ${r.supersededBy.join(", ")} (otomatik; kullanımdan kalkan nesneye dayanıyordu).`,
        affectedMilestones: linkedCount(db, oid),
      });
    }
  }

  for (const id of update?.remove ?? []) reject(id, "Silme yapılmaz. Nesneyi 'retire' ile kullanım dışı bırak ve yerine geçenleri belirt; ilerleme böylece korunur.");

  const nextVersion = toVersion || g.version;
  const before = validateGraph(g, { ledger: false });
  const candidate = assembleGraph(BASE_OBJECTS, { version: nextVersion, objects: overlay });
  const after = validateGraph(candidate, { ledger: false });
  const beforeKeys = new Set(before.map(errorKey));
  const fresh = after.filter((i) => !beforeKeys.has(errorKey(i)));
  const newErrors = fresh.filter((i) => i.severity === "HATA");
  const newWarnings = fresh.filter((i) => i.severity === "UYARI");
  const meaningful = changes.some((c) => c.kind !== "REDDEDILDI");
  const rejectedVersion = changes.some((c) => c.kind === "REDDEDILDI" && c.id === "—");
  return {
    fromVersion: g.version,
    toVersion: nextVersion,
    summary: update?.summary?.trim() || `${changes.filter((c) => c.kind !== "REDDEDILDI").length} değişiklik`,
    changes,
    newErrors,
    newWarnings,
    ok: meaningful && !rejectedVersion && newErrors.length === 0,
    overlay: { version: nextVersion, objects: overlay },
    retired,
  };
}

/** Applies a validated plan. Throws if the plan is not ok. Call inside store.transact. */
export function applyPlan(db: LabDB, plan: UpdatePlan, now = Date.now()): GraphUpdateRecord {
  if (!plan.ok) throw new Error("Bu güncelleme planı uygulanamaz: önce hataları düzelt.");
  let relinked = 0;
  for (const r of plan.retired) {
    if (!r.supersededBy.length) continue;
    for (const m of Object.values(db.milestones)) {
      if (!m.learningObjectIds?.includes(r.id)) continue;
      m.learningObjectIds = [...new Set([...m.learningObjectIds, ...r.supersededBy])];
      relinked++;
    }
    const claim = db.knowledge.selfAttested[r.id];
    if (claim) {
      for (const s of r.supersededBy) {
        db.knowledge.selfAttested[s] ??= { at: claim.at, note: `${r.id} için verilen beyandan aktarıldı` };
      }
    }
    if (db.knowledge.goals.includes(r.id)) {
      db.knowledge.goals = [...new Set([...db.knowledge.goals, ...r.supersededBy])];
    }
  }
  db.knowledge.overlay = plan.overlay;
  const record: GraphUpdateRecord = {
    id: newId("upd"),
    at: now,
    fromVersion: plan.fromVersion,
    toVersion: plan.toVersion,
    summary: plan.summary,
    added: plan.changes.filter((c) => c.kind === "EKLE").map((c) => c.id),
    modified: plan.changes.filter((c) => c.kind === "DEGISTIR").map((c) => c.id),
    retired: plan.retired,
    relinkedMilestones: relinked,
  };
  db.knowledge.history.push(record);
  return record;
}

export function parseUpdate(text: string): GraphUpdate {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Güncelleme geçerli bir JSON değil.");
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Güncelleme bir JSON nesnesi olmalı: { version, objects, retire }.");
  return data as GraphUpdate;
}

/** The current graph as JSON, e.g. to hand to an AI or edit by hand. */
export function exportGraph(g: KnowledgeGraph): string {
  return JSON.stringify({ name: g.name, version: g.version, baseVersion: CURRICULUM_VERSION, objects: g.order.map((id) => g.objects[id]), mappings: Object.values(g.mappings), resources: Object.values(g.resources) }, null, 2);
}
