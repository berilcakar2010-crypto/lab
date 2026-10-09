/**
 * Sources and provenance. Every curriculum object can say where it came from:
 * source type, title, URL, when it was added, when and by whom it was last
 * verified, a confidence, and whether an AI generated it. Lab never invents a
 * citation: anything that has not been checked by a person is UNVERIFIED.
 *
 * Books and courses are sources, not curricula. A source's chapters are
 * mapped onto existing graph objects, so the same concept can be learned from
 * several sources and the curriculum stays source-independent.
 */
import type { ID, LabDB, Millis } from "../domain/types";
import type { LearningSource, Provenance, SourceType } from "../domain/adaptive";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { getGraph } from "../knowledge/graph";
import { suggestTopics } from "../study/exams";
import type { KnowledgeGraph, ResourceKind } from "../knowledge/schema";
import { L } from "../i18n";

export const SOURCE_TYPE_LABEL = (t: SourceType): string =>
  ({
    TEXTBOOK: L("Textbook", "Ders kitabı"),
    COURSE: L("Course", "Kurs"),
    PAPER: L("Paper", "Makale"),
    OFFICIAL_DOCUMENT: L("Official document", "Resmî belge"),
    OPEN_RESOURCE: L("Open resource", "Açık kaynak"),
    AI_GENERATED: L("AI-generated", "YZ üretimi"),
    USER_CREATED: L("Created by you", "Senin oluşturduğun"),
    OTHER: L("Other", "Diğer"),
  })[t];

export function makeProvenance(sourceType: SourceType, o: Partial<Omit<Provenance, "sourceType">> = {}, now: Millis = Date.now()): Provenance {
  const ai = sourceType === "AI_GENERATED" || !!o.generatedByAI;
  return {
    sourceType,
    source: o.source,
    sourceUrl: o.sourceUrl,
    sourceTitle: o.sourceTitle,
    addedAt: o.addedAt ?? now,
    lastVerifiedAt: o.lastVerifiedAt,
    verifiedBy: o.verifiedBy,
    confidence: Math.max(0, Math.min(1, o.confidence ?? (ai ? 0.4 : 0.6))),
    generatedByAI: ai,
    // Only a person can verify; an AI-generated item starts unverified.
    verification: o.verification === "VERIFIED" && !ai && o.verifiedBy ? "VERIFIED" : "UNVERIFIED",
  };
}

const KIND_TO_TYPE: Record<ResourceKind, SourceType> = { KITAP: "TEXTBOOK", DERS: "COURSE", VIDEO: "OPEN_RESOURCE", SITE: "OPEN_RESOURCE", ARAC: "OPEN_RESOURCE", MAKALE: "PAPER", VERI: "OPEN_RESOURCE" };

/** Provenance of a graph object: recorded (AI/update) or the built-in editorial content. */
export function provenanceOf(db: LabDB, g: KnowledgeGraph, loId: string): Provenance {
  const recorded = db.knowledge.provenance?.[loId];
  if (recorded) return recorded;
  const o = g.objects[loId];
  const res = o?.recommendedResources.map((r) => g.resources[r]).find(Boolean);
  return {
    sourceType: "OTHER",
    source: L(`Lab curriculum ${g.version} (editorial)`, `Lab Müfredatı ${g.version} (editoryal)`),
    sourceTitle: res?.title,
    sourceUrl: res?.url,
    addedAt: 0,
    confidence: 0.7,
    generatedByAI: false,
    // Built-in content is written by the Lab editors but not checked against a cited source item by item.
    verification: "UNVERIFIED",
  };
}

/** A person confirms the object against its source. */
export function verifyProvenance(db: LabDB, loId: string, by = "learner", now: Millis = Date.now()): Provenance {
  const g = getGraph(db.knowledge);
  const p = { ...provenanceOf(db, g, loId), lastVerifiedAt: now, verifiedBy: by };
  // AI-generated content can be marked checked, but stays flagged as generated.
  const next: Provenance = { ...p, verification: "VERIFIED", confidence: Math.max(p.confidence, 0.8) };
  db.knowledge.provenance = { ...(db.knowledge.provenance ?? {}), [loId]: next };
  logEvent(db, "CURRICULUM_EDIT", { at: now, loIds: [loId] }, { action: "provenance_verified", lo: loId, by });
  return next;
}

// ---------------------------------------------------------------------------
// Learning sources (books, courses…) mapped onto the graph
// ---------------------------------------------------------------------------

export function addSource(db: LabDB, s: { title: string; type: SourceType; author?: string; url?: string; edition?: string; published?: string; timeSensitive?: boolean }, now: Millis = Date.now()): LearningSource {
  const src: LearningSource = {
    id: newId("src"),
    title: s.title.trim(),
    type: s.type,
    author: s.author?.trim() || undefined,
    url: s.url?.trim() || undefined,
    edition: s.edition?.trim() || undefined,
    published: s.published?.trim() || undefined,
    timeSensitive: s.timeSensitive || undefined,
    checkedAt: s.timeSensitive ? now : undefined,
    sections: [],
    provenance: makeProvenance(s.type === "AI_GENERATED" ? "AI_GENERATED" : s.type, { source: s.title, sourceUrl: s.url, sourceTitle: s.title }, now),
    createdAt: now,
  };
  db.sources[src.id] = src;
  logEvent(db, "CURRICULUM_EDIT", { at: now }, { action: "source_add", sourceId: src.id, type: s.type });
  return src;
}

/** Add a chapter/section; returns graph objects that look like matches (the learner confirms them). */
export function addSection(db: LabDB, sourceId: ID, title: string, loIds?: string[]): { sectionId: ID; suggestions: string[] } {
  const src = db.sources[sourceId];
  if (!src) throw new Error("source");
  const g = getGraph(db.knowledge);
  const suggestions = suggestTopics(g, `${title}`, 6);
  const sectionId = newId("sec");
  src.sections.push({ id: sectionId, title: title.trim(), loIds: (loIds ?? []).filter((id) => g.objects[id]) });
  return { sectionId, suggestions };
}

export function mapSection(db: LabDB, sourceId: ID, sectionId: ID, loIds: string[]): void {
  const sec = db.sources[sourceId]?.sections.find((s) => s.id === sectionId);
  if (!sec) return;
  const g = getGraph(db.knowledge);
  sec.loIds = [...new Set(loIds.filter((id) => g.objects[id]))];
}

/** A time-sensitive source not checked for a year (or with no date) may be out of date. Timeless knowledge never "expires". */
export function sourceFreshness(s: LearningSource, now: Millis = Date.now()): "timeless" | "current" | "check" {
  if (!s.timeSensitive) return "timeless";
  return s.checkedAt && now - s.checkedAt < 365 * 86_400_000 ? "current" : "check";
}

export function markSourceChecked(db: LabDB, id: ID, now: Millis = Date.now()): void {
  const s = db.sources[id];
  if (!s) return;
  s.checkedAt = now;
  s.provenance = { ...s.provenance, lastVerifiedAt: now, verifiedBy: "learner", verification: "VERIFIED" };
}

export interface ObjectSource {
  title: string;
  type: SourceType;
  url?: string;
  section?: string;
  author?: string;
  edition?: string;
  published?: string;
  freshness?: "timeless" | "current" | "check";
  sourceId?: ID;
  /** "yours" = a source you added; "builtin" = Lab's resource list. */
  origin: "yours" | "builtin";
  verification: Provenance["verification"];
}

/** Every source that teaches a graph object: yours (by section) and Lab's built-in resources. */
export function sourcesForObject(db: LabDB, g: KnowledgeGraph, loId: string): ObjectSource[] {
  const out: ObjectSource[] = [];
  for (const s of Object.values(db.sources)) for (const sec of s.sections) if (sec.loIds.includes(loId)) out.push({ title: s.title, type: s.type, url: s.url, section: sec.title, author: s.author, edition: s.edition, published: s.published, freshness: sourceFreshness(s), sourceId: s.id, origin: "yours", verification: s.provenance.verification });
  for (const rid of g.objects[loId]?.recommendedResources ?? []) {
    const r = g.resources[rid];
    if (r) out.push({ title: r.title, type: KIND_TO_TYPE[r.kind], url: r.url, author: r.author, origin: "builtin", verification: "UNVERIFIED" });
  }
  return out;
}
