/**
 * System health (for the developer/maintenance view, not the learner's home):
 * graph health, data integrity, migrations, AI provider health and storage.
 * Plus maintenance suggestions in plain words — never destructive: each one
 * points to where the learner can review and approve a change.
 */
import type { LabDB, Millis } from "../domain/types";
import { SCHEMA_VERSION } from "../domain/types";
import type { KnowledgeGraph } from "../knowledge/schema";
import { validateGraph } from "../knowledge/validate";
import { auditDatabase } from "./integrity";
import { ENTITY_TABLES } from "../data/db";
import { L } from "../i18n";
import { masteryProfile } from "../adaptive/mastery";
import { similarity } from "../adaptive/granularity";

const DAY = 86_400_000;

export interface HealthReport {
  graph: { version: string; objects: number; errors: number; warnings: number; info: number };
  data: { issues: string[]; records: Record<string, number>; events: number };
  schema: { version: number; migrations: { id: string; at: Millis }[] };
  ai: { provider: string; calls: number; ok: number; fallbacks: number; lastError?: string; lastAt?: Millis };
  storage: { backend: string; sizeKB: number | null; lastSavedAt: Millis | null; lastError: string | null; snapshots: number | null };
}

export function healthReport(db: LabDB, g: KnowledgeGraph, storage: { backend: string; size: number | null; lastSavedAt: Millis | null; lastError: string | null; snapshots: number | null }, now: Millis = Date.now()): HealthReport {
  const issues = validateGraph(g);
  const ai = Object.values(db.aiInteractions).filter((a) => a.createdAt > now - 30 * DAY).sort((a, b) => b.createdAt - a.createdAt);
  const lastErr = ai.find((a) => !a.ok && a.error);
  return {
    graph: { version: g.version, objects: g.order.length, errors: issues.filter((i) => i.severity === "HATA").length, warnings: issues.filter((i) => i.severity === "UYARI").length, info: issues.filter((i) => i.severity === "BILGI").length },
    data: { issues: auditDatabase(db), records: Object.fromEntries(ENTITY_TABLES.map((t) => [t, Object.keys(db[t] as object).length])), events: db.events.length },
    schema: { version: SCHEMA_VERSION, migrations: db.knowledge.migrations.map((m) => ({ id: m.id, at: m.at })) },
    ai: { provider: db.preferences.aiProvider, calls: ai.length, ok: ai.filter((a) => a.ok).length, fallbacks: ai.filter((a) => a.fallbackUsed).length, lastError: lastErr?.error, lastAt: ai[0]?.createdAt },
    storage: { backend: storage.backend, sizeKB: storage.size === null ? null : Math.round(storage.size / 1024), lastSavedAt: storage.lastSavedAt, lastError: storage.lastError, snapshots: storage.snapshots },
  };
}

export interface MaintenanceSuggestion {
  kind: "DUPLICATE" | "UNVERIFIED_AI" | "STALE_EVIDENCE" | "ORPHAN_MILESTONE" | "WEAK_EVIDENCE";
  text: string;
  /** Where to review it. */
  href: string;
}

/** Quiet maintenance suggestions — at most a handful, each actionable, none applied automatically. */
export function maintenanceSuggestions(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now()): MaintenanceSuggestion[] {
  const out: MaintenanceSuggestion[] = [];
  // Possible duplicate concepts among the learner's own additions (overlay) and the graph.
  const own = Object.keys(db.knowledge.overlay.objects).filter((id) => g.objects[id]);
  for (const id of own) {
    const o = g.objects[id];
    const twin = g.order.find((x) => x !== id && similarity(g.objects[x].title, o.title) >= 0.85);
    if (twin) out.push({ kind: "DUPLICATE", text: L(`"${o.title}" looks like a duplicate of "${g.objects[twin].title}". Merging keeps all progress.`, `"${o.title}", "${g.objects[twin].title}" ile aynı görünüyor. Birleştirmek tüm ilerlemeyi korur.`), href: `/graph?view=dogrulama` });
  }
  const unverified = Object.entries(db.knowledge.provenance ?? {}).filter(([id, p]) => p.generatedByAI && p.verification !== "VERIFIED" && g.objects[id]);
  if (unverified.length) out.push({ kind: "UNVERIFIED_AI", text: L(`${unverified.length} AI-generated concepts have not been checked against a source yet.`, `YZ'nin ürettiği ${unverified.length} kavram henüz bir kaynakla karşılaştırılmadı.`), href: `/graph?lo=${encodeURIComponent(unverified[0][0])}` });
  const stale = g.order.filter((id) => {
    const p = masteryProfile(db, id, now);
    return p.evidenceCount > 0 && p.retentionStatus === "STALE" && p.verified >= 0.5;
  });
  if (stale.length >= 3) out.push({ kind: "STALE_EVIDENCE", text: L(`${stale.length} concepts you once showed have not been checked for a long time.`, `Bir zamanlar gösterdiğin ${stale.length} kavram uzun süredir kontrol edilmedi.`), href: "/study?tab=topics" });
  const weak = Object.keys(db.knowledge.selfAttested).filter((id) => g.objects[id] && masteryProfile(db, id, now).evidenceCount === 0);
  if (weak.length) out.push({ kind: "WEAK_EVIDENCE", text: L(`${weak.length} "I know this" claims have no evidence yet. A short check confirms each one.`, `${weak.length} "biliyorum" beyanının henüz kanıtı yok. Kısa bir kontrol her birini doğrular.`), href: `/graph?lo=${encodeURIComponent(weak[0])}` });
  const orphan = Object.values(db.milestones).filter((m) => !m.ephemeral && (m.learningObjectIds ?? []).some((lo) => !g.objects[lo]));
  if (orphan.length) out.push({ kind: "ORPHAN_MILESTONE", text: L(`${orphan.length} of your milestones point to concepts no longer in the graph.`, `${orphan.length} adımın artık grafikte olmayan kavramları gösteriyor.`), href: "/graph?view=dogrulama" });
  return out.slice(0, 5);
}
