/**
 * Open Lab: what the learner sees first. Not a dashboard — one thing now,
 * chosen from the current state, with the reason, and a way in that starts
 * with the actual challenge (the question itself, not a menu).
 *
 * Entry kinds (none is ever compulsory):
 *   CONTINUE   an unfinished milestone or the next step of the active path
 *   CHALLENGE  the harder continuation of something just mastered
 *   REPAIR     a prerequisite that recent errors point to
 *   REVIEW     retention that is due or fading
 *   DISCOVER   a real connection into new territory
 *   RESEARCH   the next step of an open research project
 *   EXPERIMENT a running Focus Lab experiment
 *   EXPLORE    the next concept of one of the learner's goals
 *   START      nothing yet: "What do you want to understand?"
 *
 * The same entry is not pushed every time: an entry shown recently and not
 * taken is ranked lower. After a long break the state line says so, plainly,
 * and review of what was learned before is weighed higher — without locking
 * the learner into the old plan.
 */
import type { ID, InteractionType, LabDB, Millis } from "../domain/types";
import type { ChallengeLevel } from "../domain/academic";
import type { KnowledgeGraph } from "../knowledge/schema";
import { domainLabel } from "../knowledge/schema";
import { isActive } from "../knowledge/graph";
import { personalGraph } from "../knowledge/state";
import { nextQuestion } from "../engines/sessionPlan";
import { dueRetentionChecks } from "../engines/progress";
import { logEvent } from "../engines/analytics";
import { runningExperiment } from "../engines/experiments";
import { L } from "../i18n";
import { dueTopics } from "../study/topics";
import { activePath, currentStep } from "./pathPlanner";
import { repairQueue } from "./errors";
import { masteryProfile, staleObjects } from "./mastery";
import { whatNext } from "./whatNext";
import { discoveries } from "./discovery";
import { nextStep, STEP_LABEL } from "./research";
import { decomposeGoal } from "../academic/goals";

const DAY = 86_400_000;

export type EntryKind = "CONTINUE" | "CHALLENGE" | "REPAIR" | "REVIEW" | "DISCOVER" | "RESEARCH" | "EXPERIMENT" | "EXPLORE" | "PROJECT" | "START";

export const ENTRY_LABEL = (k: EntryKind): string =>
  ({
    CONTINUE: L("Continue", "Devam et"), CHALLENGE: L("Challenge", "Meydan okuma"), REPAIR: L("Repair", "Onar"), REVIEW: L("Review", "Tekrar"),
    DISCOVER: L("Discover", "Keşfet"), RESEARCH: L("Research", "Araştırma"), EXPERIMENT: L("Experiment", "Deney"), EXPLORE: L("Explore", "Keşfe çık"),
    PROJECT: L("Project", "Proje"), START: L("Start", "Başla"),
  })[k];

export type Verb = "SOLVE" | "EXPLAIN" | "PREDICT" | "DERIVE" | "THINK" | "REPAIR" | "RECALL";

export const VERB_LABEL = (v: Verb): string =>
  ({ SOLVE: L("Solve this", "Bunu çöz"), EXPLAIN: L("Explain this", "Bunu açıkla"), PREDICT: L("Predict what happens", "Ne olacağını tahmin et"), DERIVE: L("Derive this", "Bunu türet"), THINK: L("Think about this", "Bunu düşün"), REPAIR: L("Repair this prerequisite", "Bu önkoşulu onar"), RECALL: L("Recall this", "Bunu hatırla") })[v];

const VERB_FOR: Partial<Record<InteractionType, Verb>> = {
  PREDICTION: "PREDICT", SIMULATION: "PREDICT", EXPLANATION: "EXPLAIN", CONCEPT_EXPLANATION: "EXPLAIN", FREE_RESPONSE: "EXPLAIN",
  DERIVATION: "DERIVE", PROOF: "DERIVE", MULTIPLE_CHOICE: "SOLVE", NUMERIC: "SOLVE", EQUATION: "SOLVE", PROBLEM_SOLVING: "SOLVE",
};

export interface Entry {
  kind: EntryKind;
  title: string;
  /** The challenge itself: the question to start with. */
  challenge?: { verb: Verb; prompt: string; questionId?: ID };
  target: { milestoneId?: ID; loId?: string; researchId?: ID; projectId?: ID; pathId?: ID; experimentId?: ID };
  why: string[];
  /** 0..1 — how strongly the data supports this suggestion. */
  confidence: number;
  score: number;
}

export interface Resume {
  milestoneId: ID;
  title: string;
  questionId?: ID;
  at: Millis;
}

export interface OpenLab {
  /** One sentence on where the learner stands. */
  stateLine: string;
  primary: Entry | null;
  alternatives: Entry[];
  resume?: Resume;
  /** Days since the last activity (null for a new learner). */
  awayDays: number | null;
}

function challengeFor(db: LabDB, milestoneId: ID | undefined, g: KnowledgeGraph, loId?: string): Entry["challenge"] {
  if (milestoneId && db.milestones[milestoneId]) {
    const q = nextQuestion(db, milestoneId);
    if (q) return { verb: VERB_FOR[q.kind] ?? "SOLVE", prompt: q.prompt, questionId: q.id };
  }
  const o = loId ? g.objects[loId] : undefined;
  const prompt = o?.entryQuestions[0] ?? o?.coreQuestions[0];
  return prompt ? { verb: "THINK", prompt } : undefined;
}

const milestoneFor = (db: LabDB, loId: string): ID | undefined => {
  const ms = Object.values(db.milestones).filter((m) => m.learningObjectIds?.includes(loId) && !m.ephemeral);
  return (ms.find((m) => !m.masteredAt && m.status !== "LOCKED") ?? ms.find((m) => !m.masteredAt))?.id;
};

export function lastActivityAt(db: LabDB): Millis | null {
  for (let i = db.events.length - 1; i >= 0; i--) {
    const e = db.events[i];
    if (e.type !== "ENTRY_SHOWN" && e.type !== "DISCOVERY_SHOWN" && e.type !== "RECOMMENDATION_SHOWN" && e.type !== "WHAT_NEXT_SHOWN") return e.at;
  }
  return null;
}

/** A milestone left open last time (opened, not completed, not abandoned on purpose), within 30 days. */
export function resumable(db: LabDB, now: Millis = Date.now()): Resume | undefined {
  for (let i = db.events.length - 1; i >= 0; i--) {
    const e = db.events[i];
    if (e.at < now - 30 * DAY) break;
    if (!e.milestoneId) continue;
    if (e.type === "MILESTONE_COMPLETE" || e.type === "MILESTONE_SKIP") return undefined;
    if (e.type === "MILESTONE_OPEN" || e.type === "QUESTION_SHOWN" || e.type === "ATTEMPT" || e.type === "MILESTONE_ABANDON") {
      const m = db.milestones[e.milestoneId];
      if (!m || m.masteredAt || m.skippedAt || m.ephemeral?.archivedAt) return undefined;
      const shown = [...db.events].reverse().find((x) => x.milestoneId === m.id && x.type === "QUESTION_SHOWN");
      return { milestoneId: m.id, title: m.title, questionId: shown?.questionId, at: e.at };
    }
  }
  return undefined;
}

function candidates(db: LabDB, g: KnowledgeGraph, now: Millis, awayDays: number | null): Entry[] {
  const out: Entry[] = [];
  const title = (id: string) => g.objects[id]?.title ?? id;
  const back = awayDays !== null && awayDays >= 21;

  // CONTINUE: unfinished milestone, then the active path.
  const res = resumable(db, now);
  if (res) out.push({ kind: "CONTINUE", title: res.title, challenge: challengeFor(db, res.milestoneId, g), target: { milestoneId: res.milestoneId }, why: [L("You left this one in the middle.", "Bunu yarıda bırakmıştın.")], confidence: 0.8, score: back ? 0.9 : 1.3 });
  const path = activePath(db);
  const step = path ? currentStep(path) : undefined;
  if (step && step.loId !== (res ? db.milestones[res.milestoneId]?.learningObjectIds?.[0] : undefined)) {
    const ms = milestoneFor(db, step.loId);
    const left = path!.steps.filter((s) => s.status === "TODO").length;
    out.push({ kind: "CONTINUE", title: title(step.loId), challenge: challengeFor(db, ms, g, step.loId), target: { loId: step.loId, milestoneId: ms, pathId: path!.id }, why: [L(`Next step of your path "${path!.title}" (${left} left).`, `"${path!.title}" rotanın sıradaki adımı (${left} kaldı).`), ...step.reasons.slice(0, 2).map((r) => r.text)], confidence: 0.75, score: 1.1 });
  }

  // REPAIR
  const rep = repairQueue(db)[0];
  if (rep) {
    const ms = rep.errors[0].trace?.repairMilestoneId ?? milestoneFor(db, rep.loId);
    out.push({ kind: "REPAIR", title: title(rep.loId), challenge: { ...(challengeFor(db, ms, g, rep.loId) ?? { prompt: title(rep.loId) }), verb: "REPAIR" }, target: { loId: rep.loId, milestoneId: ms }, why: [L(`${rep.errors.length} recent errors trace back here.`, `Son ${rep.errors.length} hata buraya işaret ediyor.`), rep.errors[0].trace?.reason ?? ""].filter(Boolean), confidence: rep.confidence, score: 1 + Math.min(0.5, rep.errors.length * 0.15) * rep.confidence });
  }

  // REVIEW: due checks, due topics, fading mastery (weighed up after a long break).
  const due = dueRetentionChecks(db, now).filter((r) => r.kind !== "IMMEDIATE" && db.milestones[r.milestoneId]);
  const dueT = dueTopics(db, now).filter((t) => g.objects[t.id]);
  const stale = staleObjects(db, now).filter((p) => g.objects[p.key]).sort((a, b) => b.verified - a.verified);
  if (due.length) {
    const m = db.milestones[due[0].milestoneId];
    const q = db.questions[due[0].questionId];
    out.push({ kind: "REVIEW", title: m.title, challenge: q ? { verb: "RECALL", prompt: q.prompt, questionId: q.id } : undefined, target: { milestoneId: m.id }, why: [L(`${due.length} retention checks are due — a few minutes shows what stayed.`, `${due.length} kalıcılık kontrolü zamanı geldi — birkaç dakika neyin kaldığını gösterir.`)], confidence: 0.85, score: 0.85 + (back ? 0.6 : 0) + Math.min(0.2, due.length * 0.03) });
  } else if (dueT.length) {
    out.push({ kind: "REVIEW", title: title(dueT[0].id), challenge: challengeFor(db, undefined, g, dueT[0].id) && { verb: "RECALL", prompt: g.objects[dueT[0].id].coreQuestions[0] ?? g.objects[dueT[0].id].entryQuestions[0] ?? title(dueT[0].id) }, target: { loId: dueT[0].id }, why: [L(`${dueT.length} topics are due on your review schedule.`, `Tekrar takviminde ${dueT.length} konunun zamanı geldi.`)], confidence: 0.75, score: 0.75 + (back ? 0.6 : 0) });
  } else if (stale.length) {
    const p = stale[0];
    out.push({ kind: "REVIEW", title: title(p.key), challenge: challengeFor(db, milestoneFor(db, p.key), g, p.key), target: { loId: p.key, milestoneId: milestoneFor(db, p.key) }, why: [L(`You showed this before (${Math.round(p.verified * 100)}%), but it hasn't been checked for a while.`, `Bunu daha önce göstermiştin (%${Math.round(p.verified * 100)}), ama bir süredir kontrol edilmedi.`)], confidence: 0.6, score: 0.6 + (back ? 0.7 : 0) });
  }

  // CHALLENGE (from What Next: the harder continuation of recent mastery)
  const wn = whatNext(db, g, { now });
  const ch = wn.find((o) => o.kind === "CHALLENGE");
  if (ch) out.push({ kind: "CHALLENGE", title: ch.title, challenge: challengeFor(db, ch.target.milestoneId, g, ch.target.loId), target: { milestoneId: ch.target.milestoneId, loId: ch.target.loId }, why: ch.reasons.length ? ch.reasons : [ch.detail], confidence: 0.55, score: 0.7 + (db.preferences.challengeLevel === "HARD" || db.preferences.challengeLevel === "EXTREME" ? 0.3 : 0) });

  // RESEARCH: next step of an open research project.
  const r = Object.values(db.research).filter((p) => p.status === "OPEN").sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const rs = r ? nextStep(r) : undefined;
  if (r && rs) out.push({ kind: "RESEARCH", title: r.title, challenge: { verb: "THINK", prompt: `${STEP_LABEL(rs)}: ${r.title}` }, target: { researchId: r.id }, why: [L(`Open research — next: ${STEP_LABEL(rs).toLowerCase()}.`, `Açık araştırma — sıradaki: ${STEP_LABEL(rs).toLocaleLowerCase("tr")}.`)], confidence: 0.6, score: 0.55 + (now - r.updatedAt < 7 * DAY ? 0.2 : 0) });

  // EXPLORE: the next concept of an academic goal.
  const goal = Object.values(db.academicGoals).filter((x) => x.status === "ACTIVE" && x.loIds.length).sort((a, b) => b.updatedAt - a.updatedAt)[0];
  if (goal) {
    const d = decomposeGoal(db, g, goal, now);
    if (d.next) out.push({ kind: "EXPLORE", title: title(d.next), challenge: challengeFor(db, milestoneFor(db, d.next), g, d.next), target: { loId: d.next, milestoneId: milestoneFor(db, d.next) }, why: [L(`Toward your goal "${goal.title}" (${Math.round(d.progress * 100)}% shown).`, `"${goal.title}" hedefine doğru (%${Math.round(d.progress * 100)} gösterildi).`)], confidence: 0.6, score: 0.8 });
  }

  // DISCOVER
  const disc = discoveries(db, g, now, 1)[0];
  if (disc) out.push({ kind: "DISCOVER", title: disc.title, challenge: disc.question ? { verb: "THINK", prompt: disc.question } : undefined, target: { loId: disc.loId }, why: [disc.detail], confidence: 0.5, score: 0.5 + (back ? 0 : 0.1) });

  // EXPERIMENT: a running Focus Lab experiment wants sessions.
  const exp = db.preferences.experimentsEnabled ? runningExperiment(db) : undefined;
  if (exp) out.push({ kind: "EXPERIMENT", title: exp.title, target: { experimentId: exp.id }, why: [L(`Your experiment "${exp.hypothesis}" collects data from ordinary sessions.`, `"${exp.hypothesis}" deneyin sıradan oturumlardan veri topluyor.`)], confidence: 0.4, score: 0.3 });

  return out;
}

/** Entries shown recently but not taken sink a little, so the opening screen does not repeat itself. */
function variety(db: LabDB, entries: Entry[], now: Millis): Entry[] {
  const shown = db.events.filter((e) => e.type === "ENTRY_SHOWN" && e.at > now - DAY);
  const chosen = new Set(db.events.filter((e) => e.type === "ENTRY_CHOSEN" && e.at > now - DAY).map((e) => String(e.data.key)));
  const key = (e: Entry) => `${e.kind}:${e.target.milestoneId ?? e.target.loId ?? e.target.researchId ?? e.target.experimentId ?? ""}`;
  return entries.map((e) => {
    const times = shown.filter((s) => s.data.key === key(e)).length;
    return times && !chosen.has(key(e)) ? { ...e, score: e.score - Math.min(0.45, times * 0.15) } : e;
  });
}

export const entryKey = (e: Entry) => `${e.kind}:${e.target.milestoneId ?? e.target.loId ?? e.target.researchId ?? e.target.experimentId ?? ""}`;

export function openLab(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now()): OpenLab {
  const last = lastActivityAt(db);
  const awayDays = last === null ? null : Math.floor((now - last) / DAY);
  const pg = personalGraph(db, g);
  const shown = g.order.filter((id) => pg.satisfied(id));
  const domains = new Set(shown.map((id) => g.objects[id].domain));
  const ranked = variety(db, candidates(db, g, now, awayDays), now).sort((a, b) => b.score - a.score);
  // One per target, the best first.
  const seen = new Set<string>();
  const list = ranked.filter((e) => {
    const k = e.target.milestoneId ?? e.target.loId ?? e.target.researchId ?? e.kind;
    return seen.has(k) ? false : (seen.add(k), true);
  });
  const primary = db.preferences.dailySuggestions ? list[0] ?? null : null;
  const alternatives = db.preferences.dailySuggestions ? list.slice(1, 6) : list.slice(0, 6);

  let stateLine: string;
  const path = activePath(db);
  const left = path ? path.steps.filter((s) => s.status === "TODO").length : 0;
  if (awayDays !== null && awayDays >= 21) stateLine = L(`It's been ${awayDays} days. What you learned is still here — let's see what held up.`, `${awayDays} gün oldu. Öğrendiklerin hâlâ burada — neyin kaldığına bakalım.`);
  else if (path && left > 0 && left <= 2) stateLine = L(`You're ${left === 1 ? "one step" : "two steps"} away from ${path.title}.`, `${path.title} hedefine ${left === 1 ? "bir" : "iki"} adım uzaktasın.`);
  else if (path && left > 0) stateLine = L(`${left} steps between you and ${path.title}.`, `Seninle ${path.title} arasında ${left} adım var.`);
  else if (shown.length) stateLine = L(`Your map: ${shown.length} concepts shown across ${domains.size} ${domains.size === 1 ? "field" : "fields"}.`, `Haritan: ${domains.size} alanda ${shown.length} kavram gösterildi.`);
  else if (last === null) stateLine = L("Your map is still empty. Let's give it its first question.", "Haritan henüz boş. Ona ilk sorusunu verelim.");
  else stateLine = L("You've started. The first evidence is on its way.", "Başladın. İlk kanıtlar yolda.");

  return { stateLine, primary, alternatives, resume: resumable(db, now), awayDays };
}

export function logEntryShown(db: LabDB, e: Entry, now: Millis = Date.now()): void {
  logEvent(db, "ENTRY_SHOWN", { at: now, loIds: e.target.loId ? [e.target.loId] : undefined, milestoneId: e.target.milestoneId }, { kind: e.kind, key: entryKey(e), score: e.score });
}

export function logEntryChosen(db: LabDB, e: Entry, from: string, now: Millis = Date.now()): void {
  logEvent(db, "ENTRY_CHOSEN", { at: now, loIds: e.target.loId ? [e.target.loId] : undefined, milestoneId: e.target.milestoneId }, { kind: e.kind, key: entryKey(e), from });
}

// ---------------------------------------------------------------------------
// "I don't know what to study"
// ---------------------------------------------------------------------------

/** Several meaningfully different routes, one of each kind, each with its reason. */
export function routesWhenUnsure(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now()): Entry[] {
  const all = candidates(db, g, now, null).sort((a, b) => b.score - a.score);
  const out: Entry[] = [];
  const kinds = new Set<EntryKind>();
  for (const e of all) if (!kinds.has(e.kind) && e.kind !== "EXPERIMENT") { out.push(e); kinds.add(e.kind); }
  const proj = Object.values(db.projects).filter((p) => p.status === "ACTIVE").sort((a, b) => b.updatedAt - a.updatedAt)[0];
  if (proj) out.push({ kind: "PROJECT", title: proj.title, challenge: proj.nextQuestions[0] || proj.questions[0] ? { verb: "THINK", prompt: proj.nextQuestions[0] ?? proj.questions[0] } : undefined, target: { projectId: proj.id }, why: [L("Work on something you are building.", "Üzerinde çalıştığın bir şeyi ilerlet.")], confidence: 0.5, score: 0.5 });
  if (!kinds.has("DISCOVER")) {
    const s = surpriseMe(db, g, "COMFORT", 0.5, now);
    if (s) out.push(s);
  }
  return out.slice(0, 7);
}

// ---------------------------------------------------------------------------
// Surprise me
// ---------------------------------------------------------------------------

const LEVEL_OFFSET: Record<ChallengeLevel, number> = { COMFORT: 0, STRETCH: 1, HARD: 2, EXTREME: 3 };
const LEVEL_MISSING: Record<ChallengeLevel, number> = { COMFORT: 0, STRETCH: 0, HARD: 1, EXTREME: 2 };

/**
 * A new, reachable and interesting challenge from the graph, at the chosen
 * level (cognitive difficulty only). `random` in [0,1) picks among the best
 * few so it stays a surprise; tests pass a fixed value.
 */
export function surpriseMe(db: LabDB, g: KnowledgeGraph, level: ChallengeLevel = db.preferences.challengeLevel, random = Math.random(), now: Millis = Date.now()): Entry | null {
  const pg = personalGraph(db, g);
  const shownDiff = g.order.filter((id) => pg.satisfied(id)).map((id) => g.objects[id].difficulty).sort((a, b) => a - b);
  const base = shownDiff.length ? shownDiff[Math.floor(shownDiff.length / 2)] : 1;
  const target = Math.max(1, Math.min(5, base + LEVEL_OFFSET[level]));
  const recentDomains = new Set(db.events.slice(-300).flatMap((e) => e.loIds ?? []).map((id) => g.objects[id]?.domain).filter(Boolean));
  const scored = g.order
    .map((id) => g.objects[id])
    .filter((o) => isActive(o) && !pg.satisfied(o.id) && masteryProfile(db, o.id, now).evidenceCount === 0 && (pg.progress.get(o.id)?.missingRequired.length ?? 0) <= LEVEL_MISSING[level] && (o.entryQuestions.length || o.coreQuestions.length))
    .map((o) => {
      const interest = Math.min(3, o.interdisciplinaryLinks.length) * 0.5 + Math.min(2, o.researchApplications.length) * 0.4 + (recentDomains.has(o.domain) ? 0 : 0.8) + (o.challenge ? 0.3 : 0);
      return { o, s: interest - Math.abs(o.difficulty - target) * 1.2 };
    })
    .sort((a, b) => b.s - a.s || g.order.indexOf(a.o.id) - g.order.indexOf(b.o.id))
    .slice(0, 5);
  if (!scored.length) return null;
  const { o } = scored[Math.min(scored.length - 1, Math.floor(random * scored.length))];
  const missing = pg.progress.get(o.id)?.missingRequired ?? [];
  const why = [
    L(`${domainLabel(o.domain)} · difficulty ${o.difficulty}/5 (your level: ${level.toLowerCase()})`, `${domainLabel(o.domain)} · zorluk ${o.difficulty}/5 (seviyen: ${({ COMFORT: "rahat", STRETCH: "esneme", HARD: "zor", EXTREME: "en zor" })[level]})`),
    ...(o.interdisciplinaryLinks.length ? [L(`Connects to ${o.interdisciplinaryLinks.length} ideas in other fields.`, `Başka alanlardaki ${o.interdisciplinaryLinks.length} fikre bağlanıyor.`)] : []),
    ...(missing.length ? [L(`Preview: ${missing.length} prerequisite(s) not shown yet — you can still look.`, `Önizleme: ${missing.length} önkoşul henüz gösterilmedi — yine de bakabilirsin.`)] : []),
  ];
  return { kind: "DISCOVER", title: o.title, challenge: { verb: "THINK", prompt: o.entryQuestions[0] ?? o.coreQuestions[0] }, target: { loId: o.id, milestoneId: milestoneFor(db, o.id) }, why, confidence: 0.4, score: 0.5 };
}
