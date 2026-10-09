/**
 * Long-term academic goals ("become strong in computational neuroscience").
 * A goal names graph objects; everything else is derived from the graph and
 * the evidence, so the decomposition is never a frozen plan:
 *
 *   goal → domains → capabilities → concepts → milestones → evidence
 *
 * Concepts are the goal's objects plus their required prerequisites the
 * learner has not yet shown; capabilities are the objects' learning
 * objectives; milestones are the learner's own steps linked to the concepts;
 * evidence comes from the mastery profiles.
 */
import type { ID, LabDB, Millis } from "../domain/types";
import type { AcademicGoal, GoalStatus } from "../domain/academic";
import type { Domain, KnowledgeGraph } from "../knowledge/schema";
import { domainLabel } from "../knowledge/schema";
import { ancestors, isActive } from "../knowledge/graph";
import { matchRequest } from "../knowledge/search";
import { masteryProfile } from "../adaptive/mastery";
import { createPath } from "../adaptive/pathPlanner";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { L } from "../i18n";
import { pushVersion } from "./versioning";

const clean = (s: unknown, max = 2000) => String(s ?? "").trim().slice(0, max);

export const GOAL_STATUS_LABEL = (s: GoalStatus): string =>
  ({ ACTIVE: L("Active", "Etkin"), ACHIEVED: L("Achieved", "Ulaşıldı"), PAUSED: L("Paused", "Duraklatıldı"), ARCHIVED: L("Archived", "Arşivde") })[s];

/** Graph objects that match a goal written in the learner's own words. */
export function suggestGoalObjects(g: KnowledgeGraph, text: string, limit = 6): string[] {
  const m = matchRequest(g, text, limit);
  return [...new Set([...(m.path?.targets ?? []), ...m.objects])].filter((id) => g.objects[id]).slice(0, limit);
}

export function createGoal(db: LabDB, input: { title: string; why?: string; targetArea?: string; currentState?: string; desiredState?: string; loIds?: string[] }, now: Millis = Date.now()): AcademicGoal {
  const title = clean(input.title, 200);
  if (!title) throw new Error(L("Name the goal first.", "Önce hedefe bir ad ver."));
  const goal: AcademicGoal = {
    id: newId("goal"), title, why: clean(input.why), targetArea: clean(input.targetArea, 200), currentState: clean(input.currentState), desiredState: clean(input.desiredState),
    loIds: [...new Set(input.loIds ?? [])], projectIds: [], status: "ACTIVE", versions: [], createdAt: now, updatedAt: now,
  };
  db.academicGoals[goal.id] = goal;
  logEvent(db, "GOAL_UPDATED", { loIds: goal.loIds, at: now }, { action: "create", id: goal.id });
  return goal;
}

export function updateGoal(db: LabDB, id: ID, patch: Partial<Pick<AcademicGoal, "title" | "why" | "targetArea" | "currentState" | "desiredState" | "loIds" | "projectIds" | "status">>, summary = L("Edited", "Düzenlendi"), now: Millis = Date.now()): string[] {
  const goal = db.academicGoals[id];
  if (!goal) return [];
  const fixed = { ...patch };
  if (fixed.loIds) fixed.loIds = [...new Set(fixed.loIds)];
  if (fixed.projectIds) fixed.projectIds = [...new Set(fixed.projectIds)];
  const changed = pushVersion<AcademicGoal>(goal, fixed, summary, now);
  if (changed.length) logEvent(db, "GOAL_UPDATED", { loIds: goal.loIds, at: now }, { action: "update", id, changed, status: goal.status });
  return changed;
}

export interface GoalConcept {
  loId: string;
  title: string;
  /** Part of the goal itself (not a prerequisite). */
  target: boolean;
  capabilities: string[];
  milestoneIds: ID[];
  verified: number;
  evidence: number;
  depth: number;
}

export interface GoalDecomposition {
  goalId: ID;
  domains: { domain: Domain; label: string; concepts: GoalConcept[] }[];
  /** 0..1, weighted toward the goal's own objects. */
  progress: number;
  conceptCount: number;
  shown: number;
  /** The next concept worth working on (lowest verified, prerequisites first). */
  next?: string;
}

export const SHOWN = 0.6;

export function decomposeGoal(db: LabDB, g: KnowledgeGraph, goal: AcademicGoal, now: Millis = Date.now()): GoalDecomposition {
  const targets = goal.loIds.filter((id) => g.objects[id]);
  const anc = ancestors(g, targets, ["ZORUNLU"]);
  const ids = g.order.filter((id) => (targets.includes(id) || anc.has(id)) && isActive(g.objects[id]));
  const byLo = new Map<string, ID[]>();
  for (const m of Object.values(db.milestones)) for (const lo of m.learningObjectIds ?? []) if (!m.ephemeral) byLo.set(lo, [...(byLo.get(lo) ?? []), m.id]);
  const concepts: GoalConcept[] = [];
  for (const id of ids) {
    const p = masteryProfile(db, id, now);
    const target = targets.includes(id);
    // Prerequisites the learner already shows are context, not part of the remaining work.
    if (!target && p.verified >= SHOWN) continue;
    const o = g.objects[id];
    concepts.push({ loId: id, title: o.title, target, capabilities: o.learningObjectives, milestoneIds: byLo.get(id) ?? [], verified: p.verified, evidence: p.evidenceCount, depth: p.depth });
  }
  const groups = new Map<Domain, GoalConcept[]>();
  for (const c of concepts) {
    const d = g.objects[c.loId].domain;
    groups.set(d, [...(groups.get(d) ?? []), c]);
  }
  let w = 0, sum = 0;
  for (const c of concepts) {
    const weight = c.target ? 2 : 1;
    w += weight;
    sum += weight * Math.min(1, c.verified / SHOWN);
  }
  const next = concepts.find((c) => c.verified < SHOWN)?.loId;
  return {
    goalId: goal.id,
    domains: [...groups].map(([domain, cs]) => ({ domain, label: domainLabel(domain), concepts: cs })),
    progress: w ? sum / w : targets.length ? 1 : 0,
    conceptCount: concepts.length,
    shown: concepts.filter((c) => c.verified >= SHOWN).length,
    next,
  };
}

/** Plan (or re-plan) a learning path toward the goal. Old paths are paused, never deleted. */
export function pathForGoal(db: LabDB, g: KnowledgeGraph, goalId: ID, now: Millis = Date.now()) {
  const goal = db.academicGoals[goalId];
  if (!goal) throw new Error(L("Goal not found.", "Hedef bulunamadı."));
  const targets = goal.loIds.filter((id) => g.objects[id]);
  if (!targets.length) throw new Error(L("Link at least one topic from the knowledge graph to this goal first.", "Önce bu hedefe bilgi grafiğinden en az bir konu bağla."));
  return createPath(db, g, { goalIds: targets, title: goal.title }, now);
}
