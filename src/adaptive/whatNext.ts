/**
 * "What next?" — after a milestone (or whenever asked) Lab weighs seven kinds
 * of next step and shows them ranked, with reasons, without choosing for the
 * learner:
 *   A Continue   — the natural next step in the path or graph
 *   B Challenge  — a slightly harder milestone
 *   C Repair     — fix a prerequisite that recent errors point to
 *   D Review     — something due for retention, or going stale
 *   E Transfer   — use the same idea in another field
 *   F Switch     — move to another subject or path
 *   G Research   — turn the topic into an open question
 */
import type { ID, LabDB, Millis } from "../domain/types";
import { logEvent } from "../engines/analytics";
import { recommendNext } from "../engines/progression";
import { dueRetentionChecks } from "../engines/progress";
import type { KnowledgeGraph } from "../knowledge/schema";
import { L } from "../i18n";
import { masteryProfile, staleObjects } from "./mastery";
import { repairQueue } from "./errors";
import { activePath, currentStep } from "./pathPlanner";
import { dueTopics } from "../study/topics";

export type NextKind = "CONTINUE" | "CHALLENGE" | "REPAIR" | "REVIEW" | "TRANSFER" | "SWITCH" | "RESEARCH";
export const NEXT_LETTER: Record<NextKind, string> = { CONTINUE: "A", CHALLENGE: "B", REPAIR: "C", REVIEW: "D", TRANSFER: "E", SWITCH: "F", RESEARCH: "G" };

export interface NextOption {
  kind: NextKind;
  title: string;
  detail: string;
  target: { milestoneId?: ID; loId?: string; courseId?: ID; pathId?: ID };
  score: number;
  reasons: string[];
}

export const NEXT_LABEL = (k: NextKind): string =>
  ({
    CONTINUE: L("Continue", "Devam et"),
    CHALLENGE: L("Challenge", "Meydan okuma"),
    REPAIR: L("Repair a prerequisite", "Önkoşulu onar"),
    REVIEW: L("Review", "Tekrar"),
    TRANSFER: L("Transfer", "Transfer"),
    SWITCH: L("Switch area", "Alan değiştir"),
    RESEARCH: L("Research", "Araştırma"),
  })[k];

const milestoneFor = (db: LabDB, loId: string): ID | undefined => {
  const ms = Object.values(db.milestones).filter((m) => m.learningObjectIds?.includes(loId));
  return (ms.find((m) => !m.masteredAt && m.status !== "LOCKED") ?? ms.find((m) => !m.masteredAt) ?? ms[0])?.id;
};

function lastActivity(db: LabDB, courseId: ID): number {
  let t = 0;
  for (const e of db.events) if (e.courseId === courseId && e.at > t) t = e.at;
  return t;
}

export function whatNext(db: LabDB, g: KnowledgeGraph, ctx: { justCompletedMilestoneId?: ID; courseId?: ID; now?: Millis } = {}): NextOption[] {
  const now = ctx.now ?? Date.now();
  const just = ctx.justCompletedMilestoneId ? db.milestones[ctx.justCompletedMilestoneId] : undefined;
  const courseId = ctx.courseId ?? just?.courseId ?? Object.values(db.courses).filter((c) => !c.archived).sort((a, b) => lastActivity(db, b.id) - lastActivity(db, a.id))[0]?.id;
  const focusLo = just?.learningObjectIds?.find((id) => g.objects[id]);
  const recs = courseId ? recommendNext(db, courseId, { justCompletedId: just?.id, now }) : [];
  const title = (id: string) => g.objects[id]?.title ?? id;
  const examLos = new Set<string>();
  if (db.preferences.studyMode === "EXAM" && db.preferences.focusExamId) for (const id of db.exams[db.preferences.focusExamId]?.loIds ?? []) examLos.add(id);
  const examBoost = (lo?: string) => (lo && examLos.has(lo) ? 0.5 : 0);
  const out: NextOption[] = [];

  // A — continue
  const path = activePath(db);
  const step = path ? currentStep(path) : undefined;
  const cont = recs.find((r) => r.kind === "CONTINUE");
  if (step) {
    out.push({ kind: "CONTINUE", title: title(step.loId), detail: L(`Next step of your path "${path!.title}"`, `"${path!.title}" rotanın sıradaki adımı`), target: { loId: step.loId, milestoneId: milestoneFor(db, step.loId), pathId: path!.id }, score: 1 + examBoost(step.loId), reasons: step.reasons.slice(0, 3).map((r) => r.text) });
  } else if (cont) {
    const m = db.milestones[cont.milestoneId];
    out.push({ kind: "CONTINUE", title: m.title, detail: L("The natural next milestone in this course", "Bu dersteki doğal sonraki adım"), target: { milestoneId: m.id, courseId: m.courseId }, score: 1 + examBoost(m.learningObjectIds?.[0]), reasons: cont.reasons.slice(0, 3) });
  } else if (focusLo) {
    const next = g.objects[focusLo].unlocks.find((u) => g.objects[u] && masteryProfile(db, u, now).verified < 0.7);
    if (next) out.push({ kind: "CONTINUE", title: title(next), detail: L(`Builds on "${title(focusLo)}"`, `"${title(focusLo)}" üzerine kurulu`), target: { loId: next, milestoneId: milestoneFor(db, next) }, score: 0.9 + examBoost(next), reasons: [L("Next in the knowledge graph", "Bilgi grafiğinde sıradaki")] });
  }

  // B — challenge
  const ch = recs.find((r) => r.kind === "CHALLENGE" || r.kind === "BOSS");
  if (ch) {
    const m = db.milestones[ch.milestoneId];
    out.push({ kind: "CHALLENGE", title: m.title, detail: L(`Difficulty ${m.difficulty}/5`, `Zorluk ${m.difficulty}/5`), target: { milestoneId: m.id, courseId: m.courseId }, score: 0.6 + Math.min(0.4, ch.score / 10), reasons: ch.reasons.slice(0, 3) });
  } else if (focusLo) {
    const d = g.objects[focusLo].difficulty;
    const harder = g.objects[focusLo].unlocks.map((u) => g.objects[u]).filter((o) => o && o.difficulty > d).sort((a, b) => a.difficulty - b.difficulty)[0];
    if (harder) out.push({ kind: "CHALLENGE", title: harder.title, detail: L(`One level harder (${harder.difficulty}/5)`, `Bir kademe zor (${harder.difficulty}/5)`), target: { loId: harder.id, milestoneId: milestoneFor(db, harder.id) }, score: 0.6, reasons: [L("A step up from what you just mastered", "Az önce ustalaştığından bir basamak yukarı")] });
  }

  // C — repair
  const rep = repairQueue(db)[0];
  if (rep) {
    const conf = Math.round(rep.confidence * 100);
    out.push({ kind: "REPAIR", title: title(rep.loId), detail: rep.errors[0].trace?.reason ?? "", target: { loId: rep.loId, milestoneId: rep.errors[0].trace?.repairMilestoneId ?? milestoneFor(db, rep.loId) }, score: 0.8 + Math.min(0.6, rep.errors.length * 0.2) * rep.confidence + examBoost(rep.loId), reasons: [L(`${rep.errors.length} recent errors point here (confidence ${conf}%)`, `Son ${rep.errors.length} hata buraya işaret ediyor (güven %${conf})`)] });
  }

  // D — review
  const dueChecks = dueRetentionChecks(db, now).filter((r) => r.kind !== "IMMEDIATE" && db.milestones[r.milestoneId]);
  const dueT = dueTopics(db, now).filter((r) => g.objects[r.id]);
  const stale = staleObjects(db, now).filter((p) => g.objects[p.key]);
  if (dueChecks.length) {
    const m = db.milestones[dueChecks[0].milestoneId];
    out.push({ kind: "REVIEW", title: m.title, detail: L("A retention check is due", "Bir kalıcılık kontrolü zamanı geldi"), target: { milestoneId: m.id, courseId: m.courseId }, score: 0.75 + Math.min(0.3, dueChecks.length * 0.05), reasons: [L(`${dueChecks.length} retention checks due`, `${dueChecks.length} kalıcılık kontrolü bekliyor`)] });
  } else if (dueT.length) {
    out.push({ kind: "REVIEW", title: title(dueT[0].id), detail: L("Due on your review schedule", "Tekrar takviminde zamanı geldi"), target: { loId: dueT[0].id }, score: 0.7 + Math.min(0.3, dueT.length * 0.05) + examBoost(dueT[0].id), reasons: [L(`${dueT.length} topics due for review`, `${dueT.length} konunun tekrarı geldi`)] });
  } else if (stale.length) {
    out.push({ kind: "REVIEW", title: title(stale[0].key), detail: L("Mastered before, not verified for a while", "Daha önce ustalaşıldı, bir süredir doğrulanmadı"), target: { loId: stale[0].key, milestoneId: milestoneFor(db, stale[0].key) }, score: 0.6, reasons: [L(`Retention: ${stale[0].retentionStatus.toLowerCase()}`, `Kalıcılık: ${stale[0].retentionStatus === "STALE" ? "bayat" : "soluyor"}`)] });
  }

  // E — transfer
  const tLo = focusLo ?? (courseId ? Object.values(db.milestones).filter((m) => m.courseId === courseId && m.masteredAt).sort((a, b) => b.masteredAt! - a.masteredAt!)[0]?.learningObjectIds?.[0] : undefined);
  if (tLo && g.objects[tLo]) {
    const o = g.objects[tLo];
    const link = o.interdisciplinaryLinks.find((l) => g.objects[l.id] && g.objects[l.id].domain !== o.domain);
    const p = masteryProfile(db, tLo, now);
    if (link) {
      const weakTransfer = (p.dims.transfer.score ?? 0.4) < 0.6;
      out.push({ kind: "TRANSFER", title: title(link.id), detail: L(`Use "${o.title}" in another field: ${link.relation}`.trim(), `"${o.title}" fikrini başka bir alanda kullan: ${link.relation}`.trim()), target: { loId: link.id, milestoneId: milestoneFor(db, link.id) }, score: 0.5 + (weakTransfer ? 0.35 : 0), reasons: [weakTransfer ? L("Transfer is the weakest part of your profile here", "Profilinde buradaki en zayıf yan transfer") : L("Strengthens the idea by using it elsewhere", "Fikri başka yerde kullanarak güçlendirir")] });
    }
  }

  // F — switch area
  const others = Object.values(db.courses).filter((c) => !c.archived && c.id !== courseId);
  const stalest = others.sort((a, b) => lastActivity(db, a.id) - lastActivity(db, b.id))[0];
  if (stalest) {
    const days = Math.round((now - lastActivity(db, stalest.id)) / 86_400_000);
    out.push({ kind: "SWITCH", title: stalest.title, detail: L("Another of your courses", "Derslerinden bir diğeri"), target: { courseId: stalest.id }, score: 0.4 + Math.min(0.3, days / 30), reasons: [lastActivity(db, stalest.id) ? L(`Last studied ${days} days ago`, `En son ${days} gün önce çalışıldı`) : L("Not started yet", "Henüz başlanmadı")] });
  } else {
    const otherPath = Object.values(db.paths).find((p) => p.status === "PAUSED");
    if (otherPath) out.push({ kind: "SWITCH", title: otherPath.title, detail: L("A paused path", "Duraklatılmış bir rota"), target: { pathId: otherPath.id }, score: 0.4, reasons: [L("You can resume it any time", "İstediğin zaman sürdürebilirsin")] });
  }

  // G — research
  const rLo = tLo && g.objects[tLo]?.researchApplications.length ? tLo : focusLo;
  if (rLo && g.objects[rLo]?.researchApplications.length) {
    const p = masteryProfile(db, rLo, now);
    out.push({ kind: "RESEARCH", title: g.objects[rLo].researchApplications[0], detail: L(`An open question around "${title(rLo)}"`, `"${title(rLo)}" çevresinde açık bir soru`), target: { loId: rLo }, score: 0.35 + (p.depth >= 4 ? 0.3 : 0), reasons: [p.depth >= 4 ? L("Your mastery here is deep enough for open-ended work", "Buradaki ustalığın açık uçlu çalışma için yeterince derin") : L("For when you want to go beyond exercises", "Alıştırmaların ötesine geçmek istediğinde")] });
  }

  return out.sort((a, b) => b.score - a.score);
}

export function logWhatNextShown(db: LabDB, options: NextOption[], ctx: { milestoneId?: ID; sessionId?: ID; now?: Millis } = {}): void {
  logEvent(db, "WHAT_NEXT_SHOWN", { milestoneId: ctx.milestoneId, sessionId: ctx.sessionId, at: ctx.now }, { options: options.map((o) => o.kind), top: options[0]?.kind });
}

export function chooseWhatNext(db: LabDB, o: NextOption, ctx: { milestoneId?: ID; sessionId?: ID; now?: Millis } = {}): void {
  logEvent(db, "WHAT_NEXT_CHOSEN", { milestoneId: ctx.milestoneId, sessionId: ctx.sessionId, at: ctx.now, loIds: o.target.loId ? [o.target.loId] : undefined }, { kind: o.kind, target: o.target, rank: o.score });
}
