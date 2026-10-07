/**
 * The learner's personal state on the canonical graph. Nothing here is stored
 * on graph objects: it is derived from milestones (which link to objects), the
 * learner's own "I know this" claims and goals. Only ZORUNLU prerequisites
 * count toward readiness, and even they never lock: Lab recommends a start
 * point ("Buradan başlaman öneriliyor"), it never forces the learner backward.
 */
import type { LabDB, Milestone } from "../domain/types";
import { topoSort } from "../engines/graph";
import { ancestors, isActive, prereqMap } from "./graph";
import type { KnowledgeGraph, LearningObject } from "./schema";

export const LO_STATES = ["USTALASILDI", "TEKRAR", "BEYAN", "CALISILIYOR", "HAZIR", "ONKOSUL_EKSIK", "PASIF"] as const;
export type LOState = (typeof LO_STATES)[number];
export const LO_STATE_LABEL: Record<LOState, string> = {
  USTALASILDI: "Ustalaşıldı",
  TEKRAR: "Tekrar gerekli",
  BEYAN: "Biliyorum (kendi beyanım)",
  CALISILIYOR: "Çalışılıyor",
  HAZIR: "Başlamaya hazır",
  ONKOSUL_EKSIK: "Önkoşul eksik",
  PASIF: "Pasif",
};

export interface LOProgress {
  state: LOState;
  milestones: Milestone[];
  mastered: number;
  /** Required (non-optional) linked milestones. */
  required: number;
  missingRequired: string[];
  missingSoft: string[];
}

/** Milestones linked to each learning object. */
export function milestonesByLO(db: LabDB): Map<string, Milestone[]> {
  const out = new Map<string, Milestone[]>();
  for (const m of Object.values(db.milestones)) {
    for (const lo of m.learningObjectIds ?? []) {
      if (!out.has(lo)) out.set(lo, []);
      out.get(lo)!.push(m);
    }
  }
  return out;
}

export const SATISFIED: ReadonlySet<LOState> = new Set<LOState>(["USTALASILDI", "TEKRAR", "BEYAN"]);

export interface PersonalGraph {
  g: KnowledgeGraph;
  progress: Map<string, LOProgress>;
  satisfied: (id: string) => boolean;
}

export function personalGraph(db: LabDB, g: KnowledgeGraph): PersonalGraph {
  const byLO = milestonesByLO(db);
  const own = new Map<string, Omit<LOProgress, "state" | "missingRequired" | "missingSoft"> & { base: LOState | null }>();
  for (const id of g.order) {
    const o = g.objects[id];
    const ms = byLO.get(id) ?? [];
    const required = ms.filter((m) => !m.optional);
    const mastered = ms.filter((m) => m.status === "MASTERED" || m.status === "NEEDS_REVIEW").length;
    const reqMastered = required.filter((m) => m.status === "MASTERED" || m.status === "NEEDS_REVIEW").length;
    let base: LOState | null = null;
    if (!isActive(o)) base = "PASIF";
    else if (ms.some((m) => m.status === "NEEDS_REVIEW")) base = "TEKRAR";
    else if (required.length && reqMastered === required.length) base = "USTALASILDI";
    else if (!required.length && mastered > 0) base = "USTALASILDI";
    else if (db.knowledge.selfAttested[id]) base = "BEYAN";
    else if (mastered > 0 || ms.some((m) => m.status === "ATTEMPTED" || m.status === "ACTIVE")) base = "CALISILIYOR";
    own.set(id, { base, milestones: ms, mastered, required: required.length });
  }
  const satisfied = (id: string) => {
    const b = own.get(id)?.base;
    return !!b && SATISFIED.has(b);
  };
  const progress = new Map<string, LOProgress>();
  for (const id of g.order) {
    const o = g.objects[id];
    const p = own.get(id)!;
    const missingRequired = o.prerequisites.filter((x) => x.strength === "ZORUNLU" && g.objects[x.id] && !satisfied(x.id)).map((x) => x.id);
    const missingSoft = o.prerequisites.filter((x) => x.strength === "YUMUSAK" && g.objects[x.id] && !satisfied(x.id)).map((x) => x.id);
    const state: LOState = p.base ?? (missingRequired.length ? "ONKOSUL_EKSIK" : "HAZIR");
    progress.set(id, { state, milestones: p.milestones, mastered: p.mastered, required: p.required, missingRequired, missingSoft });
  }
  return { g, progress, satisfied };
}

// ---------------------------------------------------------------------------
// Readiness (section 37) and start point (section 38)
// ---------------------------------------------------------------------------

export interface Readiness {
  targets: string[];
  /** Unsatisfied ZORUNLU ancestors, prerequisites first. */
  requiredGaps: string[];
  /** Unsatisfied YUMUŞAK prerequisites of the targets and of the gaps. */
  softGaps: string[];
  /** Where Lab suggests starting: gaps (or targets) whose own requirements are all met. */
  startHere: string[];
  /** Satisfied ancestors: what the learner can already build on. */
  known: string[];
  /** Targets already linked to milestones in some course. */
  alreadyPlanned: string[];
  message: string;
}

export function readiness(pg: PersonalGraph, targets: string[]): Readiness {
  const { g, progress, satisfied } = pg;
  const valid = targets.filter((t) => g.objects[t]);
  const anc = ancestors(g, valid, ["ZORUNLU"]);
  const order = topoSort(prereqMap(g, ["ZORUNLU"]), (id) => g.order.indexOf(id));
  const requiredGaps = order.filter((id) => anc.has(id) && !satisfied(id) && isActive(g.objects[id]));
  const known = order.filter((id) => anc.has(id) && satisfied(id));
  const soft = new Set<string>();
  for (const id of [...valid, ...requiredGaps]) for (const s of progress.get(id)?.missingSoft ?? []) if (!anc.has(s)) soft.add(s);
  const candidates = [...requiredGaps, ...valid.filter((t) => !satisfied(t))];
  const startHere = candidates.filter((id) => (progress.get(id)?.missingRequired.length ?? 0) === 0);
  const alreadyPlanned = valid.filter((t) => (progress.get(t)?.milestones.length ?? 0) > 0);

  const names = (ids: string[]) => ids.slice(0, 3).map((id) => `"${g.objects[id].title}"`).join(", ") + (ids.length > 3 ? ` ve ${ids.length - 3} tane daha` : "");
  let message: string;
  if (!valid.length) message = "Hedef grafikte bulunamadı.";
  else if (valid.every(satisfied)) message = "Bu hedefi zaten tamamlamışsın ya da bildiğini belirtmişsin. Tekrar ya da bir üst adım için grafikten devam edebilirsin.";
  else if (!requiredGaps.length) message = `Hazırsın: zorunlu önkoşulların tamam${known.length ? ` (${known.length} nesne üzerine kuruyorsun)` : ""}. Doğrudan başlayabilirsin.`;
  else message = `Buradan başlaman öneriliyor: ${names(startHere)}. Bu bir zorunluluk değil — istersen doğrudan hedeften başlayıp eksikleri yol üstünde tamamlayabilirsin. Henüz tamamlanmamış ${requiredGaps.length} zorunlu önkoşul var.`;
  return { targets: valid, requiredGaps, softGaps: [...soft], startHere, known, alreadyPlanned, message };
}

// ---------------------------------------------------------------------------
// Recommended next objects (section 40 "önerilen sonraki")
// ---------------------------------------------------------------------------

export interface LORecommendation {
  id: string;
  score: number;
  reasons: string[];
}

export function recommendObjects(pg: PersonalGraph, goals: string[], limit = 5, focus?: Set<string>): LORecommendation[] {
  const { g, progress } = pg;
  const goalAnc = ancestors(g, goals, ["ZORUNLU", "YUMUSAK"]);
  for (const t of goals) goalAnc.add(t);
  const satisfiedLevels = g.order.filter((id) => pg.satisfied(id)).map((id) => g.objects[id].difficulty);
  const level = satisfiedLevels.length ? satisfiedLevels.reduce((a, b) => a + b, 0) / satisfiedLevels.length : 1.5;

  const out: LORecommendation[] = [];
  for (const id of g.order) {
    const o: LearningObject = g.objects[id];
    const p = progress.get(id)!;
    if (!isActive(o) || p.state === "USTALASILDI" || p.state === "BEYAN" || p.state === "ONKOSUL_EKSIK" || p.state === "PASIF") continue;
    if (focus && !focus.has(id)) continue;
    const reasons: string[] = [];
    let score = 0;
    if (p.state === "TEKRAR") { score += 4; reasons.push("Tekrar zamanı geldi"); }
    if (p.state === "CALISILIYOR") { score += 3; reasons.push("Yarım kalan bir çalışma"); }
    if (goalAnc.has(id)) { score += goals.includes(id) ? 6 : 4; reasons.push(goals.includes(id) ? "Hedefin" : "Hedefine giden yolda"); }
    const opens = o.unlocks.filter((u) => g.objects[u] && progress.get(u)?.missingRequired.length === 1).length;
    if (opens) { score += Math.min(opens, 4) * 0.6; reasons.push(`${opens} yeni nesnenin önünü açar`); }
    const fit = Math.abs(o.difficulty - (level + 0.5));
    score -= fit * 0.7;
    if (fit <= 1) reasons.push("Seviyene uygun");
    if (o.optional) score -= 1;
    if (o.boss && p.state === "HAZIR") { score += 1; reasons.push("Bir sentez sınavı hazır"); }
    if (!reasons.length) reasons.push("Önkoşulların tamam");
    out.push({ id, score, reasons });
  }
  out.sort((a, b) => b.score - a.score || g.order.indexOf(a.id) - g.order.indexOf(b.id));
  // Keep some variety: at most two from the same field among the first picks.
  const picked: LORecommendation[] = [];
  const perField = new Map<string, number>();
  for (const r of out) {
    const f = g.objects[r.id].field + g.objects[r.id].domain;
    if ((perField.get(f) ?? 0) >= 2 && picked.length < limit) continue;
    perField.set(f, (perField.get(f) ?? 0) + 1);
    picked.push(r);
    if (picked.length >= limit) break;
  }
  return picked;
}
