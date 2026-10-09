/**
 * Stuck detection. Lab notices when a learner is stuck — not from one signal,
 * but from several that agree: repeated wrong answers, many hints, a long
 * time on one question, many retries, more AI help, low confidence, earlier
 * abandons of the same milestone and the same kind of error again. The
 * window restarts at the last correct answer, and slowness or hints alone are
 * never enough (false-positive protection). When stuck, Lab offers choices;
 * seeing the solution is always the last option and never the default.
 */
import type { ID, LabDB, Millis } from "../domain/types";
import { logEvent } from "../engines/analytics";
import { L } from "../i18n";
import { recordDecision } from "./decisions";

export type StuckState = "OK" | "STRUGGLING" | "STUCK";

export type StuckSignalKind = "WRONG_STREAK" | "HINTS" | "LONG_TIME" | "RETRIES" | "AI_HELP" | "LOW_CONFIDENCE" | "ABANDONS" | "REPEATED_ERROR";

export interface StuckSignal {
  kind: StuckSignalKind;
  value: number;
  weight: number;
  text: string;
}

export type StuckOptionKind = "TRY_AGAIN" | "SMALL_HINT" | "CONCEPT_EXPLANATION" | "SIMPLER_EXAMPLE" | "CHECK_PREREQUISITE" | "CHANGE_STRATEGY" | "SKIP_TEMPORARILY" | "SEE_SOLUTION";

export interface StuckOption {
  kind: StuckOptionKind;
  label: string;
  detail: string;
  recommended?: boolean;
  /** Graph object or milestone the option points to (prerequisite check). */
  target?: { loId?: string; milestoneId?: ID };
}

export interface StuckReport {
  state: StuckState;
  score: number;
  signals: StuckSignal[];
  options: StuckOption[];
  reason: string;
  since: Millis;
}

const AI_HELP_ROLES = new Set(["TUTOR", "SOCRATIC_GUIDE", "HINT_GENERATOR", "QA_ASSISTANT"]);
export const STUCK_THRESHOLD = 4;
export const STRUGGLING_THRESHOLD = 2;

function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

export function detectStuck(db: LabDB, ctx: { milestoneId: ID; questionId?: ID; now?: Millis }): StuckReport {
  const now = ctx.now ?? Date.now();
  const atts = Object.values(db.attempts).filter((a) => a.milestoneId === ctx.milestoneId && a.createdAt <= now).sort((a, b) => a.createdAt - b.createdAt);
  const lastCorrect = [...atts].reverse().find((a) => a.correct);
  // The window: since the last correct answer here, and at most 45 minutes back.
  const since = Math.max(lastCorrect ? lastCorrect.createdAt + 1 : 0, now - 45 * 60_000);
  const recent = atts.filter((a) => a.createdAt >= since);
  const events = db.events.filter((e) => e.at >= since && e.at <= now && e.milestoneId === ctx.milestoneId);
  const signals: StuckSignal[] = [];
  const add = (kind: StuckSignalKind, value: number, weight: number, text: string) => signals.push({ kind, value, weight, text });

  let streak = 0;
  for (let i = recent.length - 1; i >= 0 && recent[i].correct === false; i--) streak++;
  if (streak >= 2) add("WRONG_STREAK", streak, streak >= 3 ? 2 : 1, L(`${streak} wrong answers in a row`, `Art arda ${streak} yanlış cevap`));

  const hints = events.filter((e) => e.type === "HINT_REQUEST");
  const maxHint = Math.max(0, ...hints.map((e) => Number(e.data.level ?? e.data.hintLevel ?? 0)), ...recent.map((a) => a.hintLevelUsed));
  if (hints.length >= 2 || maxHint >= 3) add("HINTS", Math.max(hints.length, maxHint), hints.length >= 2 && maxHint >= 3 ? 1.5 : 1, L(`${hints.length} hints (up to level ${maxHint})`, `${hints.length} ipucu (en fazla düzey ${maxHint})`));

  if (ctx.questionId) {
    const shown = [...events].reverse().find((e) => e.type === "QUESTION_SHOWN" && e.questionId === ctx.questionId);
    const typical = median(Object.values(db.attempts).filter((a) => a.correct).map((a) => a.durationMs));
    const limit = Math.max(6 * 60_000, (typical ?? 0) * 2.5);
    const spent = shown ? now - shown.at : 0;
    if (spent > limit) add("LONG_TIME", Math.round(spent / 60_000), 1, L(`${Math.round(spent / 60_000)} minutes on this question`, `Bu soruda ${Math.round(spent / 60_000)} dakika`));
    const retries = recent.filter((a) => a.questionId === ctx.questionId).length;
    if (retries >= 3) add("RETRIES", retries, 1, L(`${retries} tries on the same question`, `Aynı soruda ${retries} deneme`));
  }

  const ai = events.filter((e) => e.type === "AI_INTERACTION" && AI_HELP_ROLES.has(String(e.data.role)));
  if (ai.length >= 2) add("AI_HELP", ai.length, 1, L(`${ai.length} requests for AI help`, `${ai.length} kez YZ yardımı`));

  const conf = recent.filter((a) => a.confidence !== undefined).slice(-2);
  if (conf.length && conf.every((a) => (a.confidence ?? 5) <= 2)) add("LOW_CONFIDENCE", conf[conf.length - 1].confidence!, 0.5, L("Low confidence", "Düşük güven"));

  const abandons = db.events.filter((e) => e.type === "MILESTONE_ABANDON" && e.milestoneId === ctx.milestoneId && e.at <= now).length;
  if (abandons >= 2) add("ABANDONS", abandons, 1, L(`Left this milestone ${abandons} times before`, `Bu adımdan daha önce ${abandons} kez çıkıldı`));

  const errs = Object.values(db.errors).filter((e) => e.milestoneId === ctx.milestoneId && e.createdAt >= since);
  const byCat = new Map<string, number>();
  for (const e of errs) byCat.set(e.category, (byCat.get(e.category) ?? 0) + 1);
  const [topCat, topN] = [...byCat.entries()].sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
  if (topN >= 2) add("REPEATED_ERROR", topN, 1.5, L(`The same kind of error ${topN} times (${topCat.toLowerCase()})`, `Aynı tür hata ${topN} kez (${topCat.toLowerCase()})`));

  const score = signals.reduce((s, x) => s + x.weight, 0);
  const kinds = new Set(signals.map((s) => s.kind));
  const failed = recent.some((a) => a.correct === false);
  // Never "stuck" from slowness or help alone: it takes wrong answers plus at least one other signal.
  const state: StuckState = failed && kinds.size >= 2 && score >= STUCK_THRESHOLD ? "STUCK" : failed && score >= STRUGGLING_THRESHOLD ? "STRUGGLING" : "OK";

  const lastErr = errs.sort((a, b) => b.createdAt - a.createdAt)[0];
  const m = db.milestones[ctx.milestoneId];
  const prereqTarget = lastErr?.trace?.prerequisite
    ? { loId: lastErr.trace.prerequisite, milestoneId: lastErr.trace.repairMilestoneId }
    : m?.prerequisites.length
      ? { milestoneId: m.prerequisites.find((p) => !db.milestones[p]?.masteredAt) ?? m.prerequisites[0] }
      : undefined;
  const pointsDown = !!lastErr && (lastErr.category === "PREREQUISITE" || !!lastErr.trace?.prerequisite);
  const slip = !!lastErr && (lastErr.category === "CALCULATION" || lastErr.category === "ATTENTION");

  const options: StuckOption[] = [
    { kind: "TRY_AGAIN", label: L("Try again", "Yeniden dene"), detail: L("Take a breath and try once more.", "Bir nefes al ve bir kez daha dene."), recommended: slip },
    { kind: "SMALL_HINT", label: L("Small hint", "Küçük ipucu"), detail: L("One step of help, no more.", "Bir adım yardım, fazlası değil."), recommended: !slip && !pointsDown && maxHint < 2 },
    { kind: "CONCEPT_EXPLANATION", label: L("Concept explanation", "Kavram açıklaması"), detail: L("The idea behind it, without the answer.", "Arkasındaki fikir, cevap olmadan."), recommended: !slip && !pointsDown && maxHint >= 2 },
    { kind: "SIMPLER_EXAMPLE", label: L("Simpler example", "Daha basit örnek"), detail: L("Practise on an easier case first.", "Önce daha kolay bir örnekte çalış.") },
    ...(prereqTarget ? [{ kind: "CHECK_PREREQUISITE" as const, label: L("Check prerequisite", "Önkoşulu kontrol et"), detail: L("This may build on something not yet solid.", "Bu, henüz oturmamış bir şeye dayanıyor olabilir."), recommended: pointsDown, target: prereqTarget }] : []),
    { kind: "CHANGE_STRATEGY", label: L("Change strategy", "Strateji değiştir"), detail: L("A hint about the approach, not the steps.", "Adımlar değil, yaklaşım hakkında bir ipucu.") },
    { kind: "SKIP_TEMPORARILY", label: L("Skip for now", "Şimdilik atla"), detail: L("Come back later; it stays on the map.", "Sonra dön; haritada kalır.") },
    { kind: "SEE_SOLUTION", label: L("See the solution", "Çözümü gör"), detail: L("Last resort — it will not count as mastery evidence.", "Son çare — ustalık kanıtı sayılmaz.") },
  ];
  const reason = state === "OK"
    ? L("No sign of being stuck.", "Takılma belirtisi yok.")
    : `${state === "STUCK" ? L("Looks stuck: ", "Takılmış görünüyor: ") : L("Struggling a little: ", "Biraz zorlanıyor: ")}${signals.map((s) => s.text).join(", ")}.`;
  return { state, score, signals, options, reason, since };
}

/** Record a detection once per question window (no repeated events while the learner keeps working). */
export function logStuck(db: LabDB, r: StuckReport, ctx: { milestoneId: ID; questionId?: ID; sessionId?: ID; now?: Millis }): boolean {
  if (r.state !== "STUCK") return false;
  const now = ctx.now ?? Date.now();
  const dup = db.events.some((e) => e.type === "STUCK_DETECTED" && e.milestoneId === ctx.milestoneId && e.questionId === ctx.questionId && e.at >= r.since);
  if (dup) return false;
  logEvent(db, "STUCK_DETECTED", { milestoneId: ctx.milestoneId, questionId: ctx.questionId, sessionId: ctx.sessionId, at: now }, { score: r.score, signals: r.signals.map((s) => s.kind) });
  recordDecision(db, { role: "STUCK_DETECTOR", decision: "STUCK", reason: r.reason, confidence: Math.min(0.9, r.score / 8), evidence: r.signals.map((s) => `${s.kind}:${s.value}`), ref: `milestone:${ctx.milestoneId}` }, now);
  return true;
}

export function chooseStuckOption(db: LabDB, kind: StuckOptionKind, ctx: { milestoneId: ID; questionId?: ID; sessionId?: ID; now?: Millis }): void {
  logEvent(db, "STUCK_OPTION_CHOSEN", { milestoneId: ctx.milestoneId, questionId: ctx.questionId, sessionId: ctx.sessionId, at: ctx.now }, { option: kind });
}

/** An easier question for "simpler example": unanswered, lower difficulty, same milestone — else one from a prerequisite. */
export function simplerQuestion(db: LabDB, milestoneId: ID, currentQuestionId?: ID): ID | null {
  const cur = currentQuestionId ? db.questions[currentQuestionId] : undefined;
  const answered = new Set(Object.values(db.attempts).filter((a) => a.correct).map((a) => a.questionId));
  const pool = (mid: ID) => Object.values(db.questions).filter((q) => q.milestoneId === mid && q.id !== currentQuestionId && (q.purpose === "PRACTICE" || q.purpose === "MASTERY"));
  const easier = pool(milestoneId).filter((q) => !answered.has(q.id) && q.difficulty < (cur?.difficulty ?? 6)).sort((a, b) => a.difficulty - b.difficulty)[0];
  if (easier) return easier.id;
  const m = db.milestones[milestoneId];
  for (const p of m?.prerequisites ?? []) {
    const q = pool(p).sort((a, b) => a.difficulty - b.difficulty)[0];
    if (q) return q.id;
  }
  return null;
}
