/**
 * Error analysis: a wrong answer is not just "wrong".
 *
 * Each wrong answer becomes an ErrorRecord with a category from a fixed
 * taxonomy, a confidence and a reason. Classification uses the evidence Lab
 * has (the answer itself, the question type, the purpose, help used, the
 * learner's confidence, speed, the evaluator's error types) and can be
 * corrected by the learner or refined by an AI model. Every error is then
 * traced back into the knowledge graph — error → skill → milestone →
 * concept → prerequisite → repair — as a hypothesis with a confidence, never
 * as a fact. Repairs resolve errors when later evidence shows the gap closed,
 * and repeated errors form patterns (including misconceptions that show up in
 * more than one subject).
 */
import type { Attempt, ID, LabDB, Millis } from "../domain/types";
import { ERROR_CATEGORIES, type ErrorCategory, type ErrorRecord, type ErrorTrace, type Insight } from "../domain/adaptive";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { getGraph } from "../knowledge/graph";
import type { KnowledgeGraph } from "../knowledge/schema";
import { L } from "../i18n";
import { masteryProfile } from "./mastery";
import { recordDecision } from "./decisions";

const DAY = 86_400_000;

export const ERROR_LABEL = (c: ErrorCategory): string =>
  ({
    CONCEPTUAL: L("Conceptual", "Kavramsal"),
    FORMULA_SELECTION: L("Wrong formula or method", "Yanlış formül/yöntem seçimi"),
    CALCULATION: L("Calculation", "Hesap"),
    ATTENTION: L("Attention slip", "Dikkat"),
    PREREQUISITE: L("Prerequisite gap", "Önkoşul eksiği"),
    STRATEGY: L("Strategy", "Strateji"),
    ASSUMPTION: L("Wrong assumption", "Hatalı varsayım"),
    INTERPRETATION: L("Interpretation", "Yorumlama"),
    TRANSFER: L("Transfer", "Transfer"),
    RECALL: L("Recall", "Hatırlama"),
  })[c];

export const ERROR_HELP = (c: ErrorCategory): string =>
  ({
    CONCEPTUAL: L("The idea itself is not yet clear.", "Fikrin kendisi henüz net değil."),
    FORMULA_SELECTION: L("The right idea, but the wrong tool for this problem.", "Fikir doğru olabilir ama bu problem için yanlış araç seçildi."),
    CALCULATION: L("The method looks right; the arithmetic slipped.", "Yöntem doğru görünüyor; işlemde kayma var."),
    ATTENTION: L("Probably a slip — you have answered this kind of question before.", "Muhtemelen bir dalgınlık — bu tür soruları daha önce doğru yaptın."),
    PREREQUISITE: L("Something this builds on is missing.", "Bunun dayandığı bir temel eksik."),
    STRATEGY: L("The plan of attack did not work.", "Çözüm planı işe yaramadı."),
    ASSUMPTION: L("An assumption did not hold for this problem.", "Bir varsayım bu problem için geçerli değildi."),
    INTERPRETATION: L("The question, graph or result was read differently.", "Soru, grafik ya da sonuç farklı okundu."),
    TRANSFER: L("Known idea, new setting — it did not carry over yet.", "Bilinen fikir, yeni bağlam — henüz aktarılamadı."),
    RECALL: L("It has faded since you learned it.", "Öğrendiğinden beri solmuş."),
  })[c];

export interface Classification {
  category: ErrorCategory;
  confidence: number;
  reason: string;
}

const LEGACY: Record<string, [ErrorCategory, number]> = {
  CONCEPTUAL: ["CONCEPTUAL", 0.65],
  PROCEDURAL: ["CALCULATION", 0.5],
  CARELESS: ["ATTENTION", 0.65],
  MISSING_PREREQUISITE: ["PREREQUISITE", 0.7],
  INCOMPLETE_EXPLANATION: ["CONCEPTUAL", 0.45],
};

const num = (x: unknown): number | null => {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string" && x.trim() && Number.isFinite(Number(x.replace(",", ".")))) return Number(x.replace(",", "."));
  if (x && typeof x === "object" && "value" in x) return num((x as { value: unknown }).value);
  return null;
};

/** Rule-based classification. Deterministic, explainable, and honest about its confidence. */
export function classifyError(db: LabDB, a: Attempt): Classification {
  const q = db.questions[a.questionId];
  if (a.purpose === "TRANSFER") return { category: "TRANSFER", confidence: 0.7, reason: L("Wrong on a transfer question: the idea did not carry over to a new setting.", "Transfer sorusunda yanlış: fikir yeni bağlama aktarılamadı.") };
  if (a.purpose === "RETENTION") return { category: "RECALL", confidence: 0.6, reason: L("Wrong on a delayed check of something mastered before.", "Daha önce ustalaşılan bir şeyin gecikmeli kontrolünde yanlış.") };
  if (a.feedback.missingPrerequisiteIds?.length || a.feedback.errorTypes.includes("MISSING_PREREQUISITE"))
    return { category: "PREREQUISITE", confidence: 0.7, reason: L("The evaluation pointed at a missing prerequisite.", "Değerlendirme eksik bir önkoşula işaret etti.") };

  if (q?.kind === "NUMERIC" && q.numeric) {
    const v = num(a.answer), e = q.numeric.value;
    if (v !== null && e !== 0) {
      const ratio = v / e;
      const lg = Math.log10(Math.abs(ratio));
      if (Math.abs(ratio + 1) < 0.02) return { category: "CALCULATION", confidence: 0.65, reason: L("Right size, wrong sign.", "Büyüklük doğru, işaret yanlış.") };
      if (Math.abs(lg) >= 0.9 && Math.abs(lg - Math.round(lg)) < 0.02) return { category: "CALCULATION", confidence: 0.65, reason: L(`Off by a factor of 10^${Math.round(lg)} — a unit or decimal slip.`, `10^${Math.round(lg)} katı fark — birim ya da ondalık kayması.`) };
      if (Math.abs(ratio - 1) <= 0.25) return { category: "CALCULATION", confidence: 0.55, reason: L("Close to the answer: probably an arithmetic or rounding slip.", "Cevaba yakın: muhtemelen işlem ya da yuvarlama kayması.") };
    }
  }

  const types = a.feedback.errorTypes;
  for (const t of ["CARELESS", "CONCEPTUAL", "PROCEDURAL", "INCOMPLETE_EXPLANATION"] as const) {
    if (types.includes(t)) {
      const [category, confidence] = LEGACY[t];
      return { category: category === "CALCULATION" && q?.kind === "EQUATION" ? "FORMULA_SELECTION" : category, confidence, reason: L(`The evaluation marked it ${t.toLowerCase().replace("_", " ")}.`, `Değerlendirme bunu "${ERROR_LABEL(category)}" olarak işaretledi.`) };
    }
  }

  // Fast and confident but wrong, on something answered correctly before: likely a slip.
  const before = Object.values(db.attempts).filter((x) => x.milestoneId === a.milestoneId && x.createdAt < a.createdAt && x.correct !== null);
  const priorAcc = before.length ? before.filter((x) => x.correct).length / before.length : 0;
  if ((a.confidence ?? 0) >= 4 && a.durationMs < 20_000 && before.length >= 2 && priorAcc >= 0.7)
    return { category: "ATTENTION", confidence: 0.55, reason: L("Fast, confident and usually right here — probably a slip.", "Hızlı, emin ve burada genelde doğru — muhtemelen dalgınlık.") };

  switch (q?.kind) {
    case "NUMERIC":
      return { category: "FORMULA_SELECTION", confidence: 0.4, reason: L("Far from the answer: the method or formula was probably not the right one.", "Cevaptan uzak: yöntem ya da formül muhtemelen uygun değildi.") };
    case "EQUATION":
      return { category: "FORMULA_SELECTION", confidence: 0.45, reason: L("The expression is not equivalent to a correct one.", "İfade doğru bir ifadeye denk değil.") };
    case "GRAPH_INTERPRETATION":
    case "PREDICTION":
      return { category: "INTERPRETATION", confidence: 0.45, reason: L("The graph or the situation was read differently.", "Grafik ya da durum farklı okundu.") };
    case "PROBLEM_SOLVING":
    case "DERIVATION":
    case "PROOF":
      return { category: "STRATEGY", confidence: 0.4, reason: L("The chosen approach did not reach the result.", "Seçilen yaklaşım sonuca ulaşmadı.") };
    default:
      return { category: "CONCEPTUAL", confidence: 0.4, reason: L("Wrong choice on a question about the idea itself.", "Fikrin kendisiyle ilgili bir soruda yanlış seçim.") };
  }
}

/** Categories that can point below the concept, to a prerequisite. */
const GRAPH_CATEGORIES: ReadonlySet<ErrorCategory> = new Set(["PREREQUISITE", "CONCEPTUAL", "FORMULA_SELECTION", "STRATEGY", "ASSUMPTION", "INTERPRETATION", "TRANSFER"]);

/** How weak a graph object looks (0 strong … 1 weak). Unknown counts as half weak; self-declared slightly less. */
function weakness(db: LabDB, loId: string, now: Millis): number {
  const p = masteryProfile(db, loId, now);
  if (p.evidenceCount) return 1 - p.verified;
  return p.selfDeclared ? 0.4 : 0.5;
}

function repairMilestoneFor(db: LabDB, loId: string): ID | undefined {
  const ms = Object.values(db.milestones).filter((m) => m.learningObjectIds?.includes(loId));
  return (ms.find((m) => !m.masteredAt) ?? ms[0])?.id;
}

/** Link an error back into the graph. Returns a hypothesis with a confidence. */
export function traceError(db: LabDB, g: KnowledgeGraph, err: Pick<ErrorRecord, "category" | "confidence" | "loIds" | "milestoneId" | "createdAt">, missingMilestones: ID[] = []): ErrorTrace {
  const now = err.createdAt;
  const m = db.milestones[err.milestoneId];
  const concept = err.loIds.find((id) => g.objects[id]);
  const title = (id: string) => g.objects[id]?.title ?? id;
  const steps: ErrorTrace["steps"] = [{ kind: "error", label: ERROR_LABEL(err.category) }];

  if (err.category === "CALCULATION" || err.category === "ATTENTION") {
    if (m) steps.push({ kind: "milestone", id: m.id, label: m.title });
    if (concept) steps.push({ kind: "concept", id: concept, label: title(concept) });
    return {
      concept,
      confidence: err.confidence,
      steps,
      reason: L("A calculation or attention slip does not point to a missing prerequisite; practising carefully is the repair.", "Hesap ya da dikkat hatası eksik bir önkoşula işaret etmez; onarım dikkatli pratik."),
    };
  }

  // Prerequisite milestones the evaluator named, mapped to their graph objects.
  const named = missingMilestones.flatMap((id) => db.milestones[id]?.learningObjectIds ?? []).filter((id) => g.objects[id]);
  let prerequisite: string | undefined;
  let weak = 0;
  if (concept && GRAPH_CATEGORIES.has(err.category)) {
    const candidates = [...new Set([...named, ...g.objects[concept].prerequisites.filter((p) => g.objects[p.id]).map((p) => p.id)])];
    const scored = candidates
      .map((id) => ({ id, w: weakness(db, id, now) + (named.includes(id) ? 0.3 : 0) + (g.objects[concept].prerequisites.find((p) => p.id === id)?.strength === "ZORUNLU" ? 0.05 : 0) }))
      .sort((a, b) => b.w - a.w);
    const best = scored[0];
    // Point below the concept only when a prerequisite really looks weak (or the error itself says so).
    if (best && (best.w >= 0.55 || err.category === "PREREQUISITE")) {
      prerequisite = best.id;
      weak = Math.min(1, best.w);
    }
  }
  const suspectedSkill = prerequisite ?? concept;
  const repairLoId = suspectedSkill;
  const repairMilestoneId = repairLoId ? repairMilestoneFor(db, repairLoId) : undefined;
  if (suspectedSkill) steps.push({ kind: "skill", id: suspectedSkill, label: title(suspectedSkill) });
  if (m) steps.push({ kind: "milestone", id: m.id, label: m.title });
  if (concept) steps.push({ kind: "concept", id: concept, label: title(concept) });
  if (prerequisite) steps.push({ kind: "prerequisite", id: prerequisite, label: title(prerequisite) });
  if (repairLoId) steps.push({ kind: "repair", id: repairMilestoneId ?? repairLoId, label: repairMilestoneId ? db.milestones[repairMilestoneId].title : title(repairLoId) });

  const confidence = prerequisite ? Math.min(0.85, err.confidence * (0.5 + 0.5 * weak)) : concept ? Math.min(0.8, err.confidence) : 0.2;
  const pct = Math.round(confidence * 100);
  const reason = prerequisite
    ? L(`This error may come from a gap in "${title(prerequisite)}", which "${title(concept!)}" builds on (confidence ${pct}%).`, `Bu hata muhtemelen "${title(concept!)}" konusunun dayandığı "${title(prerequisite)}" konusundaki bir eksikten kaynaklanıyor (güven %${pct}).`)
    : concept
      ? L(`The gap is probably in "${title(concept)}" itself (confidence ${pct}%).`, `Eksik muhtemelen "${title(concept)}" konusunun kendisinde (güven %${pct}).`)
      : L("This milestone is not linked to the knowledge graph, so the error cannot be traced further.", "Bu adım bilgi grafiğine bağlı değil; hata daha ileri izlenemiyor.");
  return { suspectedSkill, concept, prerequisite, repairLoId, repairMilestoneId, confidence, steps, reason };
}

/** Create the error record for a wrong attempt (called by the progress engine). */
export function recordError(db: LabDB, a: Attempt, c: Classification = classifyError(db, a), source: ErrorRecord["source"] = "rule"): ErrorRecord | null {
  if (a.correct !== false) return null;
  const existing = Object.values(db.errors).find((e) => e.attemptId === a.id);
  if (existing) return existing;
  const m = db.milestones[a.milestoneId];
  const g = getGraph(db.knowledge);
  const base = {
    category: c.category,
    confidence: c.confidence,
    loIds: m?.learningObjectIds ?? [],
    milestoneId: a.milestoneId,
    createdAt: a.createdAt,
  };
  const err: ErrorRecord = {
    id: newId("err"),
    attemptId: a.id,
    questionId: a.questionId,
    milestoneId: a.milestoneId,
    courseId: m?.courseId,
    subjectId: m?.subjectId,
    sessionId: a.sessionId,
    loIds: base.loIds,
    category: c.category,
    confidence: c.confidence,
    source,
    reason: c.reason,
    hintLevel: a.hintLevelUsed,
    learnerConfidence: a.confidence,
    trace: traceError(db, g, base, a.feedback.missingPrerequisiteIds ?? []),
    resolution: "OPEN",
    createdAt: a.createdAt,
  };
  db.errors[err.id] = err;
  logEvent(db, "ERROR_IDENTIFIED", { sessionId: a.sessionId, milestoneId: a.milestoneId, questionId: a.questionId, at: a.createdAt }, {
    errorId: err.id, category: err.category, confidence: err.confidence, source, suspectedSkill: err.trace?.suspectedSkill, traceConfidence: err.trace?.confidence,
  });
  if (source !== "legacy") {
    recordDecision(db, {
      role: "ERROR_ANALYST", decision: `${err.category}${err.trace?.prerequisite ? ` → ${err.trace.prerequisite}` : ""}`, reason: `${c.reason} ${err.trace?.reason ?? ""}`.trim(),
      confidence: Math.min(err.confidence, err.trace?.confidence ?? 1), evidence: [a.id], provider: source === "ai" ? db.preferences.aiProvider : "engine", ref: `error:${err.id}`,
    }, a.createdAt);
  }
  return err;
}

/** The learner (or an AI model) corrects the category; the trace is recomputed. */
export function reclassifyError(db: LabDB, errorId: ID, category: ErrorCategory, source: "self" | "ai" = "self", confidence = 1, reason?: string): ErrorRecord | null {
  const e = db.errors[errorId];
  if (!e || !ERROR_CATEGORIES.includes(category)) return null;
  const from = e.category;
  e.category = category;
  e.confidence = confidence;
  e.source = source;
  if (reason) e.reason = reason;
  else if (source === "self") e.reason = L("Marked by you.", "Senin işaretlemen.");
  const a = db.attempts[e.attemptId];
  e.trace = traceError(db, getGraph(db.knowledge), e, a?.feedback.missingPrerequisiteIds ?? []);
  logEvent(db, "ERROR_RECLASSIFIED", { milestoneId: e.milestoneId, questionId: e.questionId }, { errorId, from, to: category, source });
  return e;
}

export function startRepair(db: LabDB, errorId: ID, now: Millis = Date.now()): ErrorRecord | null {
  const e = db.errors[errorId];
  if (!e || e.resolution === "RESOLVED") return e ?? null;
  e.resolution = "REPAIRING";
  e.repair = { loId: e.trace?.repairLoId, milestoneId: e.trace?.repairMilestoneId, startedAt: now };
  logEvent(db, "REPAIR_STARTED", { milestoneId: e.trace?.repairMilestoneId, at: now, loIds: e.trace?.repairLoId ? [e.trace.repairLoId] : undefined }, { errorId, target: e.trace?.repairLoId });
  return e;
}

export function dismissError(db: LabDB, errorId: ID): void {
  const e = db.errors[errorId];
  if (e) e.resolution = "DISMISSED";
}

/**
 * Close errors that later evidence has repaired: a correct, lightly helped
 * answer to the same question or milestone, or verified mastery of the repair
 * target recorded after the error. Returns the ids resolved.
 */
export function updateRepairs(db: LabDB, now: Millis = Date.now()): ID[] {
  const resolved: ID[] = [];
  const open = Object.values(db.errors).filter((e) => e.resolution === "OPEN" || e.resolution === "REPAIRING");
  if (!open.length) return resolved;
  const atts = Object.values(db.attempts);
  for (const e of open) {
    let how: string | null = null;
    const later = atts.filter((a) => a.correct && a.createdAt > e.createdAt && a.hintLevelUsed <= 2);
    if (later.some((a) => a.questionId === e.questionId)) how = "same-question";
    else if (later.some((a) => a.milestoneId === e.milestoneId) && (e.category === "CALCULATION" || e.category === "ATTENTION")) how = "same-milestone";
    const target = e.trace?.repairLoId;
    if (!how && target) {
      const p = masteryProfile(db, target, now);
      if (p.verified >= 0.6 && (p.lastVerifiedAt ?? 0) > e.createdAt) how = "verified-repair";
    }
    if (!how) continue;
    e.resolution = "RESOLVED";
    e.resolvedAt = now;
    if (e.repair) e.repair.completedAt = now;
    resolved.push(e.id);
    logEvent(db, "REPAIR_COMPLETED", { milestoneId: e.milestoneId, at: now, loIds: target ? [target] : undefined }, { errorId: e.id, how });
  }
  return resolved;
}

export const openErrors = (db: LabDB) =>
  Object.values(db.errors).filter((e) => e.resolution === "OPEN" || e.resolution === "REPAIRING").sort((a, b) => b.createdAt - a.createdAt);

/** Open errors grouped by repair target: what to repair first. */
export function repairQueue(db: LabDB): { loId: string; errors: ErrorRecord[]; confidence: number }[] {
  const by = new Map<string, ErrorRecord[]>();
  for (const e of openErrors(db)) {
    const t = e.trace?.repairLoId;
    if (!t || e.category === "CALCULATION" || e.category === "ATTENTION") continue;
    if (!by.has(t)) by.set(t, []);
    by.get(t)!.push(e);
  }
  return [...by.entries()]
    .map(([loId, errors]) => ({ loId, errors, confidence: Math.max(...errors.map((x) => x.trace?.confidence ?? 0)) }))
    .sort((a, b) => b.errors.length - a.errors.length || b.confidence - a.confidence);
}

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------

/**
 * Finds repeated errors on the same skill. Three or more errors of the same
 * kind on one skill form a pattern; when they come from two or more subjects
 * it is reported as a cross-domain misconception. Insights are upserted by key.
 */
export function detectPatterns(db: LabDB, now: Millis = Date.now(), windowDays = 90): Insight[] {
  const g = getGraph(db.knowledge);
  const recent = Object.values(db.errors).filter((e) => e.resolution !== "DISMISSED" && now - e.createdAt <= windowDays * DAY && e.category !== "ATTENTION" && e.category !== "CALCULATION");
  const groups = new Map<string, ErrorRecord[]>();
  for (const e of recent) {
    const skill = e.trace?.suspectedSkill ?? e.loIds[0];
    if (!skill) continue;
    const k = `${skill}|${e.category}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(e);
  }
  const out: Insight[] = [];
  for (const [k, errs] of groups) {
    if (errs.length < 3) continue;
    const [skill, category] = k.split("|") as [string, ErrorCategory];
    const subjects = [...new Set(errs.map((e) => (e.subjectId ? db.subjects[e.subjectId]?.name ?? e.subjectId : e.courseId ?? "?")))];
    const kind = subjects.length >= 2 ? "CROSS_DOMAIN_MISCONCEPTION" : "RECURRING_ERROR";
    const key = `${kind}|${k}`;
    const confidence = Math.min(0.9, 0.35 + 0.1 * errs.length + (subjects.length >= 2 ? 0.15 : 0)) * Math.max(...errs.map((e) => e.confidence));
    const name = g.objects[skill]?.title ?? skill;
    const summary = kind === "CROSS_DOMAIN_MISCONCEPTION"
      ? L(`The same ${ERROR_LABEL(category).toLowerCase()} error around "${name}" appeared ${errs.length} times in ${subjects.length} subjects (${subjects.join(", ")}). It may be a misconception rather than a one-off.`, `"${name}" çevresinde aynı ${ERROR_LABEL(category).toLocaleLowerCase("tr")} hata ${subjects.length} farklı derste (${subjects.join(", ")}) ${errs.length} kez görüldü. Tek seferlik değil, bir yanılgı olabilir.`)
      : L(`"${name}": ${errs.length} ${ERROR_LABEL(category).toLowerCase()} errors recently.`, `"${name}": son zamanlarda ${errs.length} ${ERROR_LABEL(category).toLocaleLowerCase("tr")} hata.`);
    const existing = Object.values(db.insights).find((i) => i.key === key);
    if (existing) {
      Object.assign(existing, { evidence: errs.map((e) => e.id), affectedSubjects: subjects, confidence, summary, updatedAt: now });
      out.push(existing);
    } else {
      const ins: Insight = { id: newId("ins"), kind, key, loId: g.objects[skill] ? skill : undefined, category, evidence: errs.map((e) => e.id), affectedSubjects: subjects, confidence, summary, createdAt: now, updatedAt: now };
      db.insights[ins.id] = ins;
      logEvent(db, "INSIGHT_DETECTED", { at: now, loIds: ins.loId ? [ins.loId] : undefined }, { insightId: ins.id, kind, category, count: errs.length, subjects: subjects.length });
      out.push(ins);
    }
  }
  return out;
}

/** One-off migration: old wrong answers get error records (source "legacy"). Idempotent. */
export function migrateLegacyErrors(db: LabDB, now: Millis = Date.now()): number {
  const id = "v3-error-records";
  if (db.knowledge.migrations.some((m) => m.id === id)) return 0;
  const done = new Set(Object.values(db.errors).map((e) => e.attemptId));
  let n = 0;
  for (const a of Object.values(db.attempts).sort((x, y) => x.createdAt - y.createdAt)) {
    if (a.correct !== false || done.has(a.id) || !db.milestones[a.milestoneId]) continue;
    recordError(db, a, classifyError(db, a), "legacy");
    n++;
  }
  if (n) updateRepairs(db, now);
  db.knowledge.migrations.push({ id, at: now, note: `${n} eski yanlış cevap hata kaydına dönüştürüldü (kaynak: legacy). | ${n} earlier wrong answers became error records (source: legacy).` });
  return n;
}

/** Apply an AI error analysis: category, reason and (if named) the prerequisite, all as a hypothesis. */
export function applyAIAnalysis(db: LabDB, errorId: ID, a: Classification & { prerequisite?: string }, provider: string, fallbackUsed: boolean, now: Millis = Date.now()): ErrorRecord | null {
  if (fallbackUsed) return db.errors[errorId] ?? null;
  const e = reclassifyError(db, errorId, a.category, "ai", a.confidence, a.reason);
  if (!e) return null;
  if (a.prerequisite && e.trace) {
    const g = getGraph(db.knowledge);
    e.trace = { ...e.trace, prerequisite: a.prerequisite, suspectedSkill: a.prerequisite, repairLoId: a.prerequisite, repairMilestoneId: repairMilestoneFor(db, a.prerequisite), confidence: Math.min(0.8, a.confidence), reason: L(`The AI thinks this may come from a gap in "${g.objects[a.prerequisite]?.title ?? a.prerequisite}".`, `YZ'ye göre bu, "${g.objects[a.prerequisite]?.title ?? a.prerequisite}" konusundaki bir eksikten kaynaklanıyor olabilir.`) };
  }
  recordDecision(db, { role: "ERROR_ANALYST", decision: `${e.category}${e.trace?.prerequisite ? ` → ${e.trace.prerequisite}` : ""}`, reason: a.reason, confidence: a.confidence, evidence: [e.attemptId], provider: provider as never, ref: `error:${e.id}` }, now);
  return e;
}
