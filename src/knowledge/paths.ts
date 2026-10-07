/**
 * Learning paths (section 39) are views of the one graph, never copies:
 * a path names target objects; its content is their prerequisite closure in
 * dependency order. Changing the graph changes every path automatically.
 */
import { depths, topoSort } from "../engines/graph";
import { ancestors, prereqMap } from "./graph";
import type { KnowledgeGraph } from "./schema";

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  targets: string[];
  /** Extra objects worth doing on this path although no target needs them. */
  extras: string[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "yol.fizik-olimpiyati",
    title: "Fizik Olimpiyatı",
    description: "Mekanikten elektromanyetizmaya, termodinamikten optiğe olimpiyat düzeyinde kuramsal ve deneysel hazırlık.",
    targets: ["phys.olymp.boss", "comp.phys.theory-practice", "comp.phys.experimental", "comp.boss.mock"],
    extras: ["phys.mech.lagrangian", "phys.modern.relativity", "phys.optics.wave", "comp.meta.deliberate-practice"],
  },
  {
    id: "yol.hesaplamali-norobilim",
    title: "Hesaplamalı Nörobilim",
    description: "Membran fiziğinden Hodgkin–Huxley modeline, nöral kodlamadan ağ dinamiklerine; matematik, fizik ve programlamayla birlikte.",
    targets: ["neuro.boss", "neuro.proj.hh-simulation", "neuro.comp.bayesian-brain"],
    extras: ["neuro.comp.attractors", "neuro.comp.reinforcement", "neuro.comp.ann-bridge", "neuro.cog.learning-memory"],
  },
  {
    id: "yol.arastirma",
    title: "Araştırma",
    description: "Soru sormaktan yayına: deney tasarımı, literatür, veri analizi, yazım ve sunum.",
    targets: ["res.project.mini", "res.peer-review", "res.write.presentation", "en.c1.sci-reading"],
    extras: ["res.method.causal", "res.project.modeling", "en.c1.academic-writing", "comp.research.science-fair"],
  },
];

export interface PathStage {
  depth: number;
  ids: string[];
}

/** All objects on a path (targets, extras and their ZORUNLU+YUMUŞAK ancestors) in dependency order. */
export function pathObjects(g: KnowledgeGraph, path: LearningPath): string[] {
  const roots = [...path.targets, ...path.extras].filter((id) => g.objects[id]);
  const set = ancestors(g, roots, ["ZORUNLU", "YUMUSAK"]);
  for (const r of roots) set.add(r);
  const pm = prereqMap(g, ["ZORUNLU", "YUMUSAK"]);
  return topoSort(pm, (id) => g.order.indexOf(id)).filter((id) => set.has(id));
}

/** Objects grouped by dependency depth, for a compact staged view. */
export function pathStages(g: KnowledgeGraph, path: LearningPath): PathStage[] {
  const ids = new Set(pathObjects(g, path));
  const pm = prereqMap(g, ["ZORUNLU", "YUMUSAK"]);
  const sub = new Map([...pm].filter(([id]) => ids.has(id)).map(([id, ps]) => [id, ps.filter((p) => ids.has(p))]));
  const d = depths(sub, (id) => g.order.indexOf(id));
  const stages = new Map<number, string[]>();
  for (const id of ids) {
    const k = d.get(id) ?? 0;
    if (!stages.has(k)) stages.set(k, []);
    stages.get(k)!.push(id);
  }
  return [...stages.entries()].sort((a, b) => a[0] - b[0]).map(([depth, list]) => ({ depth, ids: list }));
}
