/**
 * Path Planner: a temporary, suggested route over the knowledge graph from
 * where the learner is to where they want to be. It never changes the
 * curriculum — it only orders graph objects — and every step carries the
 * reasons it was chosen (prerequisite, mastery gap, importance, centrality,
 * recent errors, retention, goal relevance, self-declared knowledge to
 * verify, exam priority). The path is a suggestion: the learner can skip,
 * add, reorder, pause, abandon and resume it at any point.
 */
import type { ID, LabDB, Millis } from "../domain/types";
import type { LearningPathPlan, PathOptions, PathStep, PathStepRole, Reason } from "../domain/adaptive";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { topoSort } from "../engines/graph";
import { prereqMap, isActive } from "../knowledge/graph";
import type { KnowledgeGraph } from "../knowledge/schema";
import { L } from "../i18n";
import { masteryProfile } from "./mastery";
import { openErrors } from "./errors";
import { recordDecision } from "./decisions";

export const DEFAULT_PATH_OPTIONS: PathOptions = { difficulty: "normal", includeSoft: false };

/** Verified mastery at or above this counts as known, by difficulty preference. */
const KNOWN: Record<PathOptions["difficulty"], number> = { gentle: 0.8, normal: 0.7, stretch: 0.6 };

// Graph structure is fixed per graph object: compute dependents once.
const structCache = new WeakMap<KnowledgeGraph, { descendants: Map<string, number>; unlocks: Map<string, number>; maxDesc: number }>();
export function graphStructure(g: KnowledgeGraph) {
  let s = structCache.get(g);
  if (s) return s;
  const children = new Map<string, string[]>();
  for (const id of g.order) for (const p of g.objects[id].prerequisites) if (g.objects[p.id]) children.set(p.id, [...(children.get(p.id) ?? []), id]);
  const descendants = new Map<string, number>();
  const count = (id: string, seen = new Set<string>()): number => {
    for (const c of children.get(id) ?? []) if (!seen.has(c)) { seen.add(c); count(c, seen); }
    return seen.size;
  };
  for (const id of g.order) descendants.set(id, count(id));
  const unlocks = new Map(g.order.map((id) => [id, (children.get(id) ?? []).length]));
  s = { descendants, unlocks, maxDesc: Math.max(1, ...descendants.values()) };
  structCache.set(g, s);
  return s;
}

/** Objects on the way to the goals with their distance (1 = direct prerequisite) and the strengths followed. */
function route(g: KnowledgeGraph, goals: string[], opts: PathOptions): Map<string, { dist: number; via: string; strength: string }> {
  const follow = new Set(["ZORUNLU", ...(opts.includeSoft || opts.difficulty === "gentle" ? ["YUMUSAK"] : []), ...(opts.difficulty === "gentle" ? ["ONERILEN_HAZIRLIK"] : [])]);
  const out = new Map<string, { dist: number; via: string; strength: string }>();
  const queue: [string, number][] = goals.map((id) => [id, 0]);
  for (const [id] of queue) out.set(id, { dist: 0, via: id, strength: "GOAL" });
  while (queue.length) {
    const [id, d] = queue.shift()!;
    for (const p of g.objects[id]?.prerequisites ?? []) {
      if (!follow.has(p.strength) || !g.objects[p.id] || !isActive(g.objects[p.id]) || out.has(p.id)) continue;
      out.set(p.id, { dist: d + 1, via: id, strength: p.strength });
      queue.push([p.id, d + 1]);
    }
  }
  return out;
}

export interface PlanInput {
  goalIds: string[];
  options?: Partial<PathOptions>;
  /** Exam mode: priorities per covered object (3 high … 1 low). */
  exam?: { id: ID; priorities: Record<string, number> };
  title?: string;
}

export function planPath(db: LabDB, g: KnowledgeGraph, input: PlanInput, now: Millis = Date.now()): LearningPathPlan {
  const opts: PathOptions = { ...DEFAULT_PATH_OPTIONS, ...input.options };
  const goals = [...new Set(input.goalIds)].filter((id) => g.objects[id]);
  const known = KNOWN[opts.difficulty];
  const r = route(g, goals, opts);
  const st = graphStructure(g);
  const errs = openErrors(db);
  const errorsOn = (id: string) => errs.filter((e) => e.trace?.repairLoId === id).length;
  const title = (id: string) => g.objects[id]?.title ?? id;
  const prio = (id: string) => input.exam?.priorities[id] ?? (input.exam && goals.includes(id) ? 2 : 0);
  // For ordering, a prerequisite inherits the highest exam priority of the goals it leads to.
  const inherited = new Map<string, number>();
  if (input.exam) {
    for (const gid of goals) {
      const pr = prio(gid);
      const stack = [gid];
      const seen = new Set<string>();
      while (stack.length) {
        const id = stack.pop()!;
        if (seen.has(id) || !r.has(id)) continue;
        seen.add(id);
        inherited.set(id, Math.max(inherited.get(id) ?? 0, pr));
        for (const pq of g.objects[id]?.prerequisites ?? []) stack.push(pq.id);
      }
    }
  }

  const steps: PathStep[] = [];
  for (const [id, info] of r) {
    const p = masteryProfile(db, id, now);
    const errors = errorsOn(id);
    const isGoal = info.dist === 0;
    const reasons: Reason[] = [];
    let role: PathStepRole;
    if (errors) role = "repair";
    else if (isGoal) role = "target";
    else if (p.verified >= known && p.retentionStatus === "FRESH") continue; // already known: not on the path
    else if (p.verified >= known) role = "review";
    else if (p.selfDeclared >= 0.8) role = "verify";
    else role = "prerequisite";

    if (!isGoal) reasons.push({ code: "PREREQUISITE", value: info.dist, text: L(`${info.strength === "ZORUNLU" ? "Required" : "Helpful"} prerequisite of "${title(info.via)}"`, `"${title(info.via)}" için ${info.strength === "ZORUNLU" ? "zorunlu" : "yardımcı"} önkoşul`) });
    if (p.verified < known) reasons.push({ code: "MASTERY_GAP", value: Math.round((1 - p.verified) * 100) / 100, text: p.evidenceCount ? L(`Verified mastery ${Math.round(p.verified * 100)}%`, `Doğrulanmış ustalık %${Math.round(p.verified * 100)}`) : L("No verified evidence yet", "Henüz doğrulanmış kanıt yok") });
    if (errors) reasons.push({ code: "RECENT_ERRORS", value: errors, text: L(`${errors} recent errors trace back here`, `Son ${errors} hata buraya işaret ediyor`) });
    if (p.retentionStatus === "STALE" || p.retentionStatus === "FADING") reasons.push({ code: "RETENTION", text: p.retentionStatus === "STALE" ? L("Not verified for a long time (stale)", "Uzun süredir doğrulanmadı (bayat)") : L("Retention is fading", "Kalıcılık zayıflıyor") });
    if (role === "verify") reasons.push({ code: "SELF_DECLARED", value: p.selfDeclared, text: L("You said you know it — a quick check instead of a full lesson", "Bildiğini söyledin — tam ders yerine kısa bir kontrol") });
    const desc = st.descendants.get(id) ?? 0;
    if (desc >= 5) reasons.push({ code: "IMPORTANCE", value: desc, text: L(`${desc} other objects build on it`, `${desc} başka nesne bunun üzerine kurulu`) });
    const un = st.unlocks.get(id) ?? 0;
    if (un >= 3) reasons.push({ code: "CENTRALITY", value: un, text: L(`Direct prerequisite of ${un} objects (central)`, `${un} nesnenin doğrudan önkoşulu (merkezi)`) });
    reasons.push({ code: "GOAL_RELEVANCE", value: info.dist, text: isGoal ? L("Your goal", "Hedefin") : info.dist === 1 ? L("Directly needed for the goal", "Hedef için doğrudan gerekli") : L(`${info.dist} steps from the goal`, `Hedefe ${info.dist} adım uzaklıkta`) });
    if (prio(id)) reasons.push({ code: "EXAM", value: prio(id), text: L(`Exam priority: ${["", "low", "medium", "high"][prio(id)]}`, `Sınav önceliği: ${["", "düşük", "orta", "yüksek"][prio(id)]}`) });

    const score = (1 - p.verified) * 2 + Math.min(errors, 3) * 0.8 + (desc / st.maxDesc) * 1.2 + Math.min(un, 6) * 0.1 + (isGoal ? 1 : 1 / (1 + info.dist)) + (role === "review" ? 0.5 : 0) + prio(id) * 0.6;
    const done = isGoal && p.verified >= known && p.retentionStatus === "FRESH";
    steps.push({ loId: id, role, reasons, score: Math.round(score * 100) / 100, status: done ? "DONE" : "TODO" });
  }

  // Order: prerequisites always first; among independent objects repairs, exam priority and score lead.
  const ids = new Set(steps.map((s) => s.loId));
  const pm = prereqMap(g);
  const sub = new Map([...ids].map((id) => [id, (pm.get(id) ?? []).filter((p) => ids.has(p))]));
  const byId = new Map(steps.map((s) => [s.loId, s]));
  const rank = (id: string) => {
    const s = byId.get(id)!;
    return -((s.role === "repair" ? 10 : 0) + (inherited.get(id) ?? prio(id)) * 3 + s.score) * 1000 + g.order.indexOf(id) / 10_000;
  };
  const ordered = topoSort(sub, rank).map((id) => byId.get(id)!);

  return {
    id: newId("path"),
    goalIds: goals,
    title: input.title ?? goals.map(title).join(" + "),
    mode: input.exam ? "EXAM" : "NORMAL",
    examId: input.exam?.id,
    options: opts,
    steps: ordered,
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now,
    history: [{ at: now, action: "created", detail: `${ordered.length}` }],
  };
}

/** Plan and store a path; other active paths are paused (one current path at a time). */
export function createPath(db: LabDB, g: KnowledgeGraph, input: PlanInput, now: Millis = Date.now()): LearningPathPlan {
  const plan = planPath(db, g, input, now);
  for (const p of Object.values(db.paths)) if (p.status === "ACTIVE") { p.status = "PAUSED"; p.history.push({ at: now, action: "paused", detail: plan.id }); }
  db.paths[plan.id] = plan;
  logEvent(db, "PATH_CREATED", { at: now, loIds: plan.goalIds }, { pathId: plan.id, steps: plan.steps.length, mode: plan.mode, roles: countRoles(plan) });
  recordDecision(db, {
    role: "PATH_PLANNER",
    decision: plan.steps.map((s) => s.loId).join(" → "),
    reason: L(`${plan.steps.length} steps toward ${plan.title}; known objects were left out.`, `${plan.title} hedefine ${plan.steps.length} adım; bilinen nesneler dışarıda bırakıldı.`),
    confidence: plan.steps.length ? Math.min(0.9, 0.4 + plan.steps.filter((s) => s.reasons.some((r) => r.code === "MASTERY_GAP")).length / Math.max(1, plan.steps.length) * 0.5) : 0.5,
    evidence: plan.steps.slice(0, 20).map((s) => `${s.loId}:${s.role}`),
    ref: `path:${plan.id}`,
  }, now);
  return plan;
}

const countRoles = (p: LearningPathPlan) => p.steps.reduce<Record<string, number>>((o, s) => ({ ...o, [s.role]: (o[s.role] ?? 0) + 1 }), {});

function modified(db: LabDB, p: LearningPathPlan, action: string, detail: string, now: Millis) {
  p.updatedAt = now;
  p.history.push({ at: now, action, detail });
  logEvent(db, "PATH_MODIFIED", { at: now, loIds: [detail].filter((x) => x && !x.includes(" ")) }, { pathId: p.id, action, detail });
}

export function skipStep(db: LabDB, pathId: ID, loId: string, now: Millis = Date.now()): void {
  const p = db.paths[pathId];
  const s = p?.steps.find((x) => x.loId === loId);
  if (!p || !s) return;
  s.status = "SKIPPED";
  modified(db, p, "skip", loId, now);
}

export function restoreStep(db: LabDB, pathId: ID, loId: string, now: Millis = Date.now()): void {
  const p = db.paths[pathId];
  const s = p?.steps.find((x) => x.loId === loId);
  if (!p || !s) return;
  s.status = "TODO";
  modified(db, p, "restore", loId, now);
}

/** The learner adds an object; it is placed after its prerequisites already on the path. */
export function addStep(db: LabDB, g: KnowledgeGraph, pathId: ID, loId: string, now: Millis = Date.now()): void {
  const p = db.paths[pathId];
  if (!p || !g.objects[loId] || p.steps.some((s) => s.loId === loId)) return;
  const pre = new Set(g.objects[loId].prerequisites.map((x) => x.id));
  const after = Math.max(-1, ...p.steps.map((s, i) => (pre.has(s.loId) ? i : -1)));
  p.steps.splice(after + 1, 0, { loId, role: "prerequisite", reasons: [{ code: "USER", text: L("Added by you", "Senin eklediğin") }], score: 0, status: "TODO", addedByUser: true });
  modified(db, p, "add", loId, now);
}

/** Reorder freely — the learner may override the suggested order. */
export function moveStep(db: LabDB, pathId: ID, loId: string, dir: -1 | 1, now: Millis = Date.now()): void {
  const p = db.paths[pathId];
  const i = p?.steps.findIndex((x) => x.loId === loId) ?? -1;
  const j = i + dir;
  if (!p || i < 0 || j < 0 || j >= p.steps.length) return;
  [p.steps[i], p.steps[j]] = [p.steps[j], p.steps[i]];
  if (!p.steps[j].reasons.some((r) => r.code === "USER")) p.steps[j].reasons.push({ code: "USER", text: L("Moved by you", "Senin taşıdığın") });
  modified(db, p, dir < 0 ? "move-up" : "move-down", loId, now);
}

export function abandonPath(db: LabDB, pathId: ID, now: Millis = Date.now()): void {
  const p = db.paths[pathId];
  if (!p) return;
  p.status = "ABANDONED";
  p.updatedAt = now;
  p.history.push({ at: now, action: "abandoned" });
  const at = p.steps.findIndex((s) => s.status === "TODO");
  logEvent(db, "PATH_ABANDONED", { at: now, loIds: p.goalIds }, { pathId, atStep: at, done: p.steps.filter((s) => s.status === "DONE").length });
}

/** Continue a paused or abandoned path; any other active path is paused. */
export function resumePath(db: LabDB, pathId: ID, now: Millis = Date.now()): void {
  const p = db.paths[pathId];
  if (!p) return;
  for (const o of Object.values(db.paths)) if (o.status === "ACTIVE" && o.id !== pathId) { o.status = "PAUSED"; o.history.push({ at: now, action: "paused", detail: pathId }); }
  p.status = "ACTIVE";
  p.updatedAt = now;
  p.history.push({ at: now, action: "resumed" });
  logEvent(db, "PATH_RESUMED", { at: now, loIds: p.goalIds }, { pathId });
}

/** Mark steps done from new verified evidence; completes the path when every goal is done. */
export function refreshPath(db: LabDB, pathId: ID, now: Millis = Date.now()): string[] {
  const p = db.paths[pathId];
  if (!p) return [];
  const known = KNOWN[p.options.difficulty];
  const done: string[] = [];
  for (const s of p.steps) {
    if (s.status !== "TODO") continue;
    const prof = masteryProfile(db, s.loId, now);
    const repaired = s.role !== "repair" || !openErrors(db).some((e) => e.trace?.repairLoId === s.loId);
    if (prof.verified >= known && (prof.lastVerifiedAt ?? 0) >= p.createdAt && repaired) {
      s.status = "DONE";
      done.push(s.loId);
    }
  }
  if (done.length) modified(db, p, "progress", done.join(","), now);
  if (p.status === "ACTIVE" && p.goalIds.every((gid) => p.steps.find((s) => s.loId === gid)?.status !== "TODO")) {
    p.status = "COMPLETED";
    p.history.push({ at: now, action: "completed" });
  }
  return done;
}

export const activePath = (db: LabDB): LearningPathPlan | undefined =>
  Object.values(db.paths).filter((p) => p.status === "ACTIVE").sort((a, b) => b.updatedAt - a.updatedAt)[0];

export const currentStep = (p: LearningPathPlan): PathStep | undefined => p.steps.find((s) => s.status === "TODO");

export const ROLE_LABEL = (r: PathStepRole): string =>
  ({ repair: L("Repair", "Onarım"), prerequisite: L("Prerequisite", "Önkoşul"), target: L("Goal", "Hedef"), verify: L("Quick check", "Kısa kontrol"), review: L("Review", "Tekrar") })[r];
