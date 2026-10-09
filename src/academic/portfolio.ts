/**
 * Long-term views of the learner's academic life, all derived from stored
 * records and events (nothing hard-coded):
 *
 *  - depth analytics: breadth, depth, retention, transfer, research;
 *  - personal records: longest deep session, hardest problem solved,
 *    largest knowledge expansion, longest recall, strongest improvement…;
 *  - an academic timeline (what was learned, built and explored, by month);
 *  - a yearly reflection ("what did I learn this year?");
 *  - the portfolio: everything the learner produced, in one place.
 *
 * Time is never the primary state: minutes appear as context, not as a score.
 */
import type { ID, LabDB, Millis } from "../domain/types";
import type { KnowledgeGraph } from "../knowledge/schema";
import { domainLabel } from "../knowledge/schema";
import { personalGraph } from "../knowledge/state";
import { computeSessionTimes } from "../engines/analytics";
import { L } from "../i18n";
import { masteryProfile } from "../adaptive/mastery";
import { depthReport, DEPTH_LEVELS } from "../adaptive/depth";
import { RESEARCH_STEPS } from "../domain/adaptive";

const DAY = 86_400_000;

// ---------------------------------------------------------------------------
// Depth analytics
// ---------------------------------------------------------------------------

export interface DepthAnalytics {
  /** Concepts shown (verified ≥ 60 %, or a passed check, or mastered) and the fields they span. */
  breadth: { concepts: number; domains: number };
  /** Mean depth level (0–8) over concepts with evidence. */
  depth: { mean: number | null; n: number };
  /** Share of shown concepts whose retention is fresh. */
  retention: { fresh: number | null; n: number };
  /** Mean transfer score over concepts with transfer evidence. */
  transfer: { mean: number | null; n: number };
  research: { projects: number; results: number; artifacts: number };
}

export function depthAnalytics(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now()): DepthAnalytics {
  const pg = personalGraph(db, g);
  const shown = g.order.filter((id) => pg.satisfied(id) && pg.progress.get(id)!.state !== "BEYAN" || masteryProfile(db, id, now).verified >= 0.6);
  const withEvidence = g.order.filter((id) => masteryProfile(db, id, now).evidenceCount > 0);
  const depths = withEvidence.map((id) => depthReport(db, id, now).reached.length);
  const fresh = shown.filter((id) => masteryProfile(db, id, now).retentionStatus === "FRESH").length;
  const evidenced = shown.filter((id) => masteryProfile(db, id, now).evidenceCount > 0).length;
  const tr = withEvidence.map((id) => masteryProfile(db, id, now).dims.transfer).filter((d) => d.n > 0).map((d) => d.score!);
  return {
    breadth: { concepts: shown.length, domains: new Set(shown.map((id) => g.objects[id].domain)).size },
    depth: { mean: depths.length ? depths.reduce((a, b) => a + b, 0) / depths.length : null, n: depths.length },
    retention: { fresh: evidenced ? fresh / evidenced : null, n: evidenced },
    transfer: { mean: tr.length ? tr.reduce((a, b) => a + b, 0) / tr.length : null, n: tr.length },
    research: {
      projects: Object.values(db.research).length + Object.values(db.projects).filter((p) => p.kind === "RESEARCH").length,
      results: Object.values(db.research).filter((r) => r.steps.RESULT?.doneAt).length,
      artifacts: Object.values(db.artifacts).length,
    },
  };
}

export const DEPTH_SCALE = DEPTH_LEVELS.length;

// ---------------------------------------------------------------------------
// Personal records
// ---------------------------------------------------------------------------

export interface PersonalRecord {
  id: string;
  label: string;
  value: string;
  detail: string;
  at?: Millis;
  ref?: { milestoneId?: ID; loId?: string; sessionId?: ID; researchId?: ID };
}

export function personalRecords(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now()): PersonalRecord[] {
  const out: PersonalRecord[] = [];
  // Longest deep session (active time, not wall time).
  let best: { id: ID; ms: number; at: number } | null = null;
  const bySession = new Map<ID, typeof db.events>();
  for (const e of db.events) if (e.sessionId) (bySession.get(e.sessionId) ?? bySession.set(e.sessionId, []).get(e.sessionId)!).push(e);
  for (const [id, evs] of bySession) {
    const t = computeSessionTimes(evs, db.sessions[id]?.endedAt);
    if (t && (!best || t.activeMs > best.ms)) best = { id, ms: t.activeMs, at: evs[0].at };
  }
  if (best && best.ms >= 5 * 60_000) out.push({ id: "deep-session", label: L("Longest deep session", "En uzun derin oturum"), value: L(`${Math.round(best.ms / 60_000)} min active`, `${Math.round(best.ms / 60_000)} dk etkin`), detail: L("Active time only — idle time is not counted.", "Yalnızca etkin süre — boşta geçen süre sayılmaz."), at: best.at, ref: { sessionId: best.id } });

  // Hardest problem solved without the full solution.
  const solved = Object.values(db.attempts).filter((a) => a.correct && a.hintLevelUsed < 5 && db.questions[a.questionId]).sort((a, b) => db.questions[b.questionId].difficulty - db.questions[a.questionId].difficulty || a.hintLevelUsed - b.hintLevelUsed || b.createdAt - a.createdAt)[0];
  if (solved) {
    const q = db.questions[solved.questionId];
    out.push({ id: "hardest", label: L("Hardest problem solved", "Çözülen en zor problem"), value: L(`difficulty ${q.difficulty}/5`, `zorluk ${q.difficulty}/5`), detail: `${db.milestones[solved.milestoneId]?.title ?? ""}${solved.hintLevelUsed ? L(` (hint level ${solved.hintLevelUsed})`, ` (ipucu düzeyi ${solved.hintLevelUsed})`) : L(" (no hints)", " (ipucusuz)")}`, at: solved.createdAt, ref: { milestoneId: solved.milestoneId } });
  }

  // Largest knowledge expansion: most concepts newly shown in one week.
  const firstShown = new Map<string, number>();
  for (const e of db.events) {
    if (e.type === "MILESTONE_COMPLETE" && !e.data.selfAttested) for (const lo of e.loIds ?? []) if (!firstShown.has(lo)) firstShown.set(lo, e.at);
    if (e.type === "KNOWLEDGE_CHECK" && e.data.passed) for (const lo of e.loIds ?? []) if (!firstShown.has(lo)) firstShown.set(lo, e.at);
  }
  const weeks = new Map<number, number>();
  for (const at of firstShown.values()) weeks.set(Math.floor(at / (7 * DAY)), (weeks.get(Math.floor(at / (7 * DAY))) ?? 0) + 1);
  const topWeek = [...weeks].sort((a, b) => b[1] - a[1])[0];
  if (topWeek && topWeek[1] >= 2) out.push({ id: "expansion", label: L("Largest knowledge expansion", "En büyük bilgi genişlemesi"), value: L(`${topWeek[1]} concepts in one week`, `bir haftada ${topWeek[1]} kavram`), detail: L("Concepts shown for the first time (mastered or check passed).", "İlk kez gösterilen kavramlar (ustalık ya da geçilen kontrol)."), at: topWeek[0] * 7 * DAY });

  // Longest successful recall: the biggest gap before a correct delayed review.
  let recall: { lo: string; gap: number; at: number } | null = null;
  for (const r of Object.values(db.topicReviews)) {
    for (let i = 1; i < r.history.length; i++) {
      const h = r.history[i];
      if (h.kind !== "review" || (h.grade ?? 0) < 2) continue;
      const gap = h.at - r.history[i - 1].at;
      if (!recall || gap > recall.gap) recall = { lo: r.id, gap, at: h.at };
    }
  }
  for (const c of Object.values(db.retention)) {
    if (c.kind !== "DELAYED" || !c.correct || !c.completedAt) continue;
    const m = db.milestones[c.milestoneId];
    const gap = c.completedAt - (m?.masteredAt ?? c.completedAt);
    if (m && (!recall || gap > recall.gap)) recall = { lo: m.learningObjectIds?.[0] ?? m.title, gap, at: c.completedAt };
  }
  if (recall && recall.gap >= DAY) out.push({ id: "recall", label: L("Longest recall", "En uzun hatırlama"), value: L(`after ${Math.round(recall.gap / DAY)} days`, `${Math.round(recall.gap / DAY)} gün sonra`), detail: g.objects[recall.lo]?.title ?? recall.lo, at: recall.at, ref: { loId: recall.lo } });

  // Most developed research task.
  const res = Object.values(db.research).map((r) => ({ r, done: RESEARCH_STEPS.filter((s) => r.steps[s]?.doneAt).length })).sort((a, b) => b.done - a.done)[0];
  if (res && res.done >= 3) out.push({ id: "research", label: L("Furthest research", "En ilerletilen araştırma"), value: L(`${res.done} of ${RESEARCH_STEPS.length} steps`, `${RESEARCH_STEPS.length} adımın ${res.done} tanesi`), detail: res.r.title, at: res.r.updatedAt, ref: { researchId: res.r.id } });

  // Strongest improvement: largest rise from the first answers to now on one concept.
  let impr: { lo: string; from: number; to: number } | null = null;
  for (const id of g.order) {
    const p = masteryProfile(db, id, now);
    if (p.evidenceCount < 4) continue;
    const atts = Object.values(db.attempts).filter((a) => a.correct !== null && db.milestones[a.milestoneId]?.learningObjectIds?.includes(id)).sort((a, b) => a.createdAt - b.createdAt).slice(0, 3);
    if (atts.length < 3) continue;
    const start = atts.filter((a) => a.correct).length / atts.length;
    if (p.verified - start > (impr ? impr.to - impr.from : 0.2)) impr = { lo: id, from: start, to: p.verified };
  }
  if (impr) out.push({ id: "improvement", label: L("Strongest improvement", "En güçlü gelişme"), value: `${Math.round(impr.from * 100)}% → ${Math.round(impr.to * 100)}%`, detail: L(`${g.objects[impr.lo].title}: first three answers vs verified mastery now.`, `${g.objects[impr.lo].title}: ilk üç cevap ve şimdiki doğrulanmış ustalık.`), ref: { loId: impr.lo } });
  return out;
}

// ---------------------------------------------------------------------------
// Academic timeline and yearly reflection
// ---------------------------------------------------------------------------

export type TimelineKind = "CONCEPT" | "CHECK" | "PROJECT" | "RESEARCH" | "ARTIFACT" | "DOMAIN" | "EXAM" | "GOAL";

export interface TimelineItem { at: Millis; kind: TimelineKind; title: string; ref?: string }

export function timeline(db: LabDB, g: KnowledgeGraph, from = 0, to = Number.MAX_SAFE_INTEGER): TimelineItem[] {
  const out: TimelineItem[] = [];
  const seenLo = new Set<string>();
  const seenDomain = new Set<string>();
  for (const e of db.events) {
    if (e.at < from || e.at > to) {
      if (e.at < from) for (const lo of e.loIds ?? []) if (g.objects[lo]) seenDomain.add(g.objects[lo].domain);
      continue;
    }
    for (const lo of e.loIds ?? []) {
      const d = g.objects[lo]?.domain;
      if (d && !seenDomain.has(d) && (e.type === "MILESTONE_OPEN" || e.type === "ATTEMPT" || e.type === "KNOWLEDGE_CHECK")) {
        seenDomain.add(d);
        out.push({ at: e.at, kind: "DOMAIN", title: L(`New field: ${domainLabel(d)}`, `Yeni alan: ${domainLabel(d)}`) });
      }
    }
    if (e.type === "MILESTONE_COMPLETE" && !e.data.selfAttested) {
      for (const lo of e.loIds ?? []) if (g.objects[lo] && !seenLo.has(lo)) { seenLo.add(lo); out.push({ at: e.at, kind: "CONCEPT", title: g.objects[lo].title, ref: lo }); }
      if (!e.loIds?.length && e.milestoneId && db.milestones[e.milestoneId] && !db.milestones[e.milestoneId].ephemeral) out.push({ at: e.at, kind: "CONCEPT", title: db.milestones[e.milestoneId].title });
    }
    if (e.type === "KNOWLEDGE_CHECK" && e.data.passed) for (const lo of e.loIds ?? []) if (g.objects[lo] && !seenLo.has(lo)) { seenLo.add(lo); out.push({ at: e.at, kind: "CHECK", title: g.objects[lo].title, ref: lo }); }
  }
  for (const p of Object.values(db.projects)) if (p.createdAt >= from && p.createdAt <= to) out.push({ at: p.createdAt, kind: "PROJECT", title: p.title, ref: p.id });
  for (const r of Object.values(db.research)) {
    const done = r.steps.RESULT?.doneAt;
    if (done && done >= from && done <= to) out.push({ at: done, kind: "RESEARCH", title: r.title, ref: r.id });
  }
  for (const a of Object.values(db.artifacts)) if (a.createdAt >= from && a.createdAt <= to) out.push({ at: a.createdAt, kind: "ARTIFACT", title: a.title, ref: a.id });
  for (const x of Object.values(db.exams)) if (x.result && x.date >= from && x.date <= to) out.push({ at: x.date, kind: "EXAM", title: x.title, ref: x.id });
  for (const gl of Object.values(db.academicGoals)) if (gl.createdAt >= from && gl.createdAt <= to) out.push({ at: gl.createdAt, kind: "GOAL", title: gl.title, ref: gl.id });
  return out.sort((a, b) => a.at - b.at);
}

export interface YearReflection {
  year: number;
  newConcepts: string[];
  checksPassed: number;
  projects: number;
  researchResults: number;
  artifacts: number;
  discoveries: number;
  transferSolved: number;
  strongest: { label: string; meanVerified: number; objects: number }[];
  recurringWeaknesses: string[];
  newDomains: string[];
  /** True when the year has no recorded learning at all. */
  empty: boolean;
}

export function yearlyReflection(db: LabDB, g: KnowledgeGraph, year: number, now: Millis = Date.now()): YearReflection {
  const from = new Date(year, 0, 1).getTime();
  const to = new Date(year + 1, 0, 1).getTime() - 1;
  const items = timeline(db, g, from, to);
  const newConcepts = items.filter((i) => i.kind === "CONCEPT" || i.kind === "CHECK").map((i) => i.title);
  const domains = new Map<string, { n: number; sum: number }>();
  for (const i of items) if (i.ref && g.objects[i.ref]) {
    const d = g.objects[i.ref].domain;
    const e = domains.get(d) ?? { n: 0, sum: 0 };
    e.n++;
    e.sum += masteryProfile(db, i.ref, now).verified;
    domains.set(d, e);
  }
  const transferSolved = Object.values(db.attempts).filter((a) => a.purpose === "TRANSFER" && a.correct && a.createdAt >= from && a.createdAt <= to).length;
  const out: YearReflection = {
    year,
    newConcepts,
    checksPassed: items.filter((i) => i.kind === "CHECK").length,
    projects: items.filter((i) => i.kind === "PROJECT").length,
    researchResults: items.filter((i) => i.kind === "RESEARCH").length,
    artifacts: items.filter((i) => i.kind === "ARTIFACT").length,
    discoveries: db.events.filter((e) => e.type === "DISCOVERY_OPENED" && e.at >= from && e.at <= to).length,
    transferSolved,
    strongest: [...domains].map(([d, e]) => ({ label: domainLabel(d as never), meanVerified: e.sum / e.n, objects: e.n })).sort((a, b) => b.meanVerified * b.objects - a.meanVerified * a.objects).slice(0, 3),
    recurringWeaknesses: Object.values(db.insights).filter((i) => !i.dismissed && i.updatedAt >= from && i.updatedAt <= to).map((i) => i.summary).slice(0, 5),
    newDomains: items.filter((i) => i.kind === "DOMAIN").map((i) => i.title),
    empty: false,
  };
  out.empty = !out.newConcepts.length && !out.projects && !out.researchResults && !out.artifacts && !transferSolved;
  return out;
}

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

export interface PortfolioItem { kind: "ARTIFACT" | "PROJECT" | "RESEARCH" | "EXPERIMENT"; id: ID; title: string; subtitle: string; at: Millis }

export function portfolio(db: LabDB): PortfolioItem[] {
  return [
    ...Object.values(db.artifacts).map((a) => ({ kind: "ARTIFACT" as const, id: a.id, title: a.title, subtitle: a.kind, at: a.createdAt })),
    ...Object.values(db.projects).filter((p) => p.status !== "ARCHIVED").map((p) => ({ kind: "PROJECT" as const, id: p.id, title: p.title, subtitle: p.kind, at: p.updatedAt })),
    ...Object.values(db.research).map((r) => ({ kind: "RESEARCH" as const, id: r.id, title: r.title, subtitle: r.status, at: r.updatedAt })),
    ...Object.values(db.experiments).filter((e) => e.status === "CONCLUDED").map((e) => ({ kind: "EXPERIMENT" as const, id: e.id, title: e.title, subtitle: e.hypothesis, at: e.concludedAt ?? e.createdAt })),
  ].sort((a, b) => b.at - a.at);
}
