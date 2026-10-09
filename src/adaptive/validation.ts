/**
 * Final validation of the learner's whole curriculum: the knowledge graph
 * (cycles, orphans, duplicates, invalid or impossible references, missing
 * mastery evidence, missing sources where required, oversized or trivial
 * objects — Lab's existing validator), plus what lives in the learner's own
 * data: duplicate milestones, too broad / too narrow / weak-evidence
 * milestones, invalid references between records, invalid or unverified
 * AI-generated objects, and the database integrity audit. Nothing is deleted
 * or fixed automatically; every issue says what is wrong.
 */
import type { LabDB } from "../domain/types";
import type { KnowledgeGraph } from "../knowledge/schema";
import { validateGraph, type Issue } from "../knowledge/validate";
import { auditDatabase } from "../engines/integrity";
import { L } from "../i18n";
import { checkMilestone, isValid, similarity, GRANULARITY_LABEL } from "./granularity";

export type CurriculumIssueCode =
  | "GRAPH"
  | "DUPLICATE_MILESTONE"
  | "MILESTONE_GRANULARITY"
  | "INVALID_REFERENCE"
  | "AI_OBJECT_INVALID"
  | "AI_OBJECT_UNVERIFIED"
  | "INTEGRITY";

export interface CurriculumIssue {
  severity: "ERROR" | "WARNING" | "INFO";
  code: CurriculumIssueCode;
  message: string;
  ref?: string;
  /** For GRAPH issues: the original validator code. */
  graphCode?: Issue["code"];
}

const SEV: Record<Issue["severity"], CurriculumIssue["severity"]> = { HATA: "ERROR", UYARI: "WARNING", BILGI: "INFO" };

export function validateCurriculum(db: LabDB, g: KnowledgeGraph, now = Date.now()): CurriculumIssue[] {
  const out: CurriculumIssue[] = [];
  for (const i of validateGraph(g)) out.push({ severity: SEV[i.severity], code: "GRAPH", graphCode: i.code, message: i.message, ref: i.loId });

  // Milestones in the learner's courses (checked on a copy: validation never writes).
  const draft: LabDB = { ...db, milestones: Object.fromEntries(Object.entries(db.milestones).map(([k, v]) => [k, { ...v }])) };
  const byCourse = new Map<string, string[]>();
  for (const m of Object.values(db.milestones)) byCourse.set(m.courseId, [...(byCourse.get(m.courseId) ?? []), m.id]);
  for (const ids of byCourse.values()) {
    for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) {
      const x = db.milestones[ids[a]], y = db.milestones[ids[b]];
      if (similarity(x.learningObjective || x.title, y.learningObjective || y.title) >= 0.85)
        out.push({ severity: "WARNING", code: "DUPLICATE_MILESTONE", message: L(`"${x.title}" and "${y.title}" build the same capability.`, `"${x.title}" ve "${y.title}" aynı yeteneği kazandırıyor.`), ref: y.id });
    }
  }
  for (const m of Object.values(db.milestones)) {
    const r = checkMilestone(draft, m.id, now);
    if (!r || isValid(r)) continue;
    const ai = !!m.provenance?.generatedByAI;
    const relevant = r.status.filter((s) => s !== "DUPLICATE" && s !== "MISSING_PREREQUISITE");
    if (relevant.length) out.push({ severity: ai ? "WARNING" : "INFO", code: "MILESTONE_GRANULARITY", message: `"${m.title}": ${relevant.map(GRANULARITY_LABEL).join(", ")}${ai ? L(" (AI-generated)", " (YZ üretimi)") : ""}.`, ref: m.id });
  }
  for (const m of Object.values(db.milestones)) for (const lo of m.learningObjectIds ?? []) if (!g.objects[lo]) out.push({ severity: "ERROR", code: "INVALID_REFERENCE", message: L(`"${m.title}" points to a graph object that does not exist (${lo}).`, `"${m.title}" var olmayan bir grafik nesnesini gösteriyor (${lo}).`), ref: m.id });

  // References between adaptive records.
  for (const e of Object.values(db.errors)) {
    if (!db.attempts[e.attemptId]) out.push({ severity: "WARNING", code: "INVALID_REFERENCE", message: L(`Error record ${e.id} refers to a missing answer.`, `${e.id} hata kaydı olmayan bir cevaba bağlı.`), ref: e.id });
    if (e.trace?.repairLoId && !g.objects[e.trace.repairLoId]) out.push({ severity: "WARNING", code: "INVALID_REFERENCE", message: L(`Error ${e.id} suggests repairing an object that no longer exists.`, `${e.id} hatası artık olmayan bir nesnenin onarımını öneriyor.`), ref: e.id });
  }
  for (const p of Object.values(db.paths)) for (const s of p.steps) if (!g.objects[s.loId]) out.push({ severity: "WARNING", code: "INVALID_REFERENCE", message: L(`Path "${p.title}" has a step that is not in the graph (${s.loId}).`, `"${p.title}" rotasında grafikte olmayan bir adım var (${s.loId}).`), ref: p.id });
  for (const s of Object.values(db.sources)) for (const sec of s.sections) for (const lo of sec.loIds) if (!g.objects[lo]) out.push({ severity: "WARNING", code: "INVALID_REFERENCE", message: L(`Source "${s.title}" maps to an unknown object (${lo}).`, `"${s.title}" kaynağı bilinmeyen bir nesneye eşlenmiş (${lo}).`), ref: s.id });

  // AI-generated graph objects.
  for (const [id, prov] of Object.entries(db.knowledge.provenance ?? {})) {
    const o = g.objects[id];
    if (!prov.generatedByAI) continue;
    if (!o) { out.push({ severity: "ERROR", code: "AI_OBJECT_INVALID", message: L(`AI object ${id} has provenance but is not in the graph.`, `YZ nesnesi ${id} köken kaydına sahip ama grafikte yok.`), ref: id }); continue; }
    if (!o.learningObjectives.length || !o.evidenceTypes.length) out.push({ severity: "ERROR", code: "AI_OBJECT_INVALID", message: L(`AI object "${o.title}" has no learning objective or no evidence type.`, `YZ nesnesi "${o.title}" öğrenme hedefi ya da kanıt türü içermiyor.`), ref: id });
    if (prov.verification !== "VERIFIED") out.push({ severity: "INFO", code: "AI_OBJECT_UNVERIFIED", message: L(`"${o.title}" is AI-generated and not yet checked against a source.`, `"${o.title}" YZ üretimi ve henüz bir kaynakla karşılaştırılmadı.`), ref: id });
  }

  for (const msg of auditDatabase(db)) out.push({ severity: "ERROR", code: "INTEGRITY", message: msg });
  return dedupe(out);
}

function dedupe(xs: CurriculumIssue[]): CurriculumIssue[] {
  const seen = new Set<string>();
  return xs.filter((x) => {
    const k = `${x.code}|${x.graphCode ?? ""}|${x.ref ?? ""}|${x.message}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function summarizeIssues(xs: CurriculumIssue[]) {
  return { errors: xs.filter((x) => x.severity === "ERROR").length, warnings: xs.filter((x) => x.severity === "WARNING").length, info: xs.filter((x) => x.severity === "INFO").length };
}
