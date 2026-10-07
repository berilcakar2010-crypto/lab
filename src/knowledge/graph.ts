/**
 * Assembles the canonical graph: base content + the learner's applied update
 * overlay, with derived unlocks and the mapping/resource layers attached.
 */
import type { KnowledgeState } from "../domain/types";
import { BASE_OBJECTS } from "./content";
import { MAPPINGS } from "./mappings";
import { RESOURCES } from "./resources";
import {
  CURRICULUM_NAME, CURRICULUM_VERSION, type KnowledgeGraph, type LearningObject, type Mapping, type Resource,
} from "./schema";
import type { PrereqMap } from "../engines/graph";

export function assembleGraph(
  base: LearningObject[] = BASE_OBJECTS,
  overlay: KnowledgeState["overlay"] | undefined = undefined,
  mappings: Mapping[] = MAPPINGS,
  resources: Resource[] = RESOURCES,
): KnowledgeGraph {
  const objects: Record<string, LearningObject> = {};
  const order: string[] = [];
  for (const o of base) {
    if (objects[o.id]) continue; // duplicates are reported by the validator from the raw list
    objects[o.id] = { ...o, unlocks: [], schoolMappings: [], apMappings: [], recommendedResources: [] };
    order.push(o.id);
  }
  for (const o of Object.values(overlay?.objects ?? {})) {
    if (!objects[o.id]) order.push(o.id);
    objects[o.id] = { ...o, unlocks: [], schoolMappings: [], apMappings: [], recommendedResources: [] };
  }
  for (const id of order) {
    for (const p of objects[id].prerequisites) objects[p.id]?.unlocks.push(id);
  }
  const mapTable: Record<string, Mapping> = {};
  for (const m of mappings) {
    mapTable[m.id] = m;
    // Competition and research mappings are looked up through `mappingsFor`.
    if (m.system !== "AP" && m.system !== "OKUL") continue;
    for (const lo of new Set(m.loIds)) {
      const o = objects[lo];
      if (o) (m.system === "AP" ? o.apMappings : o.schoolMappings).push(m.id);
    }
  }
  const resTable: Record<string, Resource> = {};
  for (const r of resources) {
    resTable[r.id] = r;
    for (const lo of r.loIds) objects[lo]?.recommendedResources.push(r.id);
  }
  return {
    name: CURRICULUM_NAME,
    version: overlay?.version || CURRICULUM_VERSION,
    objects,
    order,
    mappings: mapTable,
    resources: resTable,
  };
}

let cache: { key: KnowledgeState["overlay"] | undefined; graph: KnowledgeGraph } | null = null;

/** The graph for the current learner; cached until the overlay object changes. */
export function getGraph(knowledge?: KnowledgeState): KnowledgeGraph {
  const key = knowledge?.overlay;
  const empty = !key || !Object.keys(key.objects).length;
  if (cache && (cache.key === key || (empty && !cache.key))) return cache.graph;
  const graph = assembleGraph(BASE_OBJECTS, empty ? undefined : key);
  cache = { key: empty ? undefined : key, graph };
  return graph;
}

export const isActive = (o: LearningObject) => o.status === "AKTIF" || o.status === "TASLAK";

/** Prerequisite map restricted to the given strengths (default: all). */
export function prereqMap(g: KnowledgeGraph, strengths?: string[]): PrereqMap {
  const pm: PrereqMap = new Map();
  for (const id of g.order) {
    pm.set(id, g.objects[id].prerequisites.filter((p) => !strengths || strengths.includes(p.strength)).map((p) => p.id));
  }
  return pm;
}

/** All ancestors reachable through prerequisites of the given strengths. */
export function ancestors(g: KnowledgeGraph, ids: string[], strengths = ["ZORUNLU"]): Set<string> {
  const out = new Set<string>();
  const stack = [...ids];
  while (stack.length) {
    const id = stack.pop()!;
    for (const p of g.objects[id]?.prerequisites ?? []) {
      if (!strengths.includes(p.strength) || out.has(p.id)) continue;
      out.add(p.id);
      stack.push(p.id);
    }
  }
  return out;
}

/** Every mapping (any system) that names this object. */
export function mappingsFor(g: KnowledgeGraph, id: string): Mapping[] {
  return Object.values(g.mappings).filter((m) => m.loIds.includes(id));
}

/** Objects that link to `id` (incoming interdisciplinary edges). */
export function incomingLinks(g: KnowledgeGraph, id: string): { id: string; relation: string }[] {
  const out: { id: string; relation: string }[] = [];
  for (const oid of g.order) {
    for (const l of g.objects[oid].interdisciplinaryLinks) if (l.id === id) out.push({ id: oid, relation: l.relation });
  }
  return out;
}
