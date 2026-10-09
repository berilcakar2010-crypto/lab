/**
 * Deterministic evaluation. Auto-gradable answers are graded here; open
 * responses return UNGRADED so the AI evaluator or rubric self-assessment can
 * grade them. Feedback separates correctness from error type.
 */
import type { ErrorType, Feedback, Question } from "../domain/types";
import { L } from "../i18n";
import { compareExpressions, evalNumber } from "./expr";

export type Answer =
  | { kind: "choice"; index: number }
  | { kind: "number"; text: string }
  | { kind: "expression"; text: string }
  | { kind: "order"; items: string[] }
  | { kind: "classify"; map: Record<string, string> }
  | { kind: "text"; text: string; drawing?: string };

export interface Evaluation {
  correct: boolean | null;
  score: number;
  feedback: Feedback;
}

const fb = (
  correctness: Feedback["correctness"],
  message: string,
  errorTypes: ErrorType[] = [],
  extra: Partial<Feedback> = {},
): Feedback => ({ correctness, reasoningQuality: "UNKNOWN", errorTypes, message, ...extra });

/** Which structured answer the question expects (independent of display kind). */
export function answerMode(q: Question): Answer["kind"] {
  if (q.classification) return "classify";
  if (q.orderItems?.length) return "order";
  if (q.choices?.length && q.correctChoice !== undefined) return "choice";
  if (q.acceptedExpressions?.length) return "expression";
  if (q.numeric) return "number";
  return "text";
}

export const isAutoGradable = (q: Question) => answerMode(q) !== "text";

export function evaluateAuto(q: Question, a: Answer): Evaluation {
  switch (a.kind) {
    case "choice": {
      const ok = a.index === q.correctChoice;
      return ok
        ? { correct: true, score: 1, feedback: fb("CORRECT", L("Correct.", "Doğru.")) }
        : { correct: false, score: 0, feedback: fb("INCORRECT", L(`Not this one. Think about why "${q.choices?.[a.index] ?? ""}" is tempting — and what it misses.`, `Bu değil. "${q.choices?.[a.index] ?? ""}" neden cazip geliyor — ve neyi gözden kaçırıyor?`), ["CONCEPTUAL"]) };
    }
    case "number":
      return evaluateNumber(q, a.text);
    case "expression":
      return evaluateExpression(q, a.text);
    case "order": {
      const ref = q.orderItems ?? [];
      if (a.items.length !== ref.length) return { correct: false, score: 0, feedback: fb("INCORRECT", L("Place every step.", "Her adımı yerleştir."), ["INCOMPLETE_EXPLANATION"]) };
      let pairs = 0;
      for (let i = 0; i + 1 < a.items.length; i++) if (ref.indexOf(a.items[i]) < ref.indexOf(a.items[i + 1])) pairs++;
      const exact = a.items.every((x, i) => x === ref[i]);
      const score = exact ? 1 : pairs / Math.max(1, ref.length - 1);
      return exact
        ? { correct: true, score: 1, feedback: fb("CORRECT", L("Correct order.", "Sıralama doğru.")) }
        : { correct: false, score, feedback: fb(score >= 0.6 ? "PARTIAL" : "INCORRECT", L(`${pairs} of ${ref.length - 1} neighbouring steps are in the right order. Which step must logically come first?`, `${ref.length - 1} komşu adımdan ${pairs} tanesi doğru sırada. Mantıksal olarak hangi adım önce gelmeli?`), ["PROCEDURAL"]) };
    }
    case "classify": {
      const items = q.classification?.items ?? [];
      const right = items.filter((i) => a.map[i.text] === i.category).length;
      const score = items.length ? right / items.length : 0;
      const wrong = items.filter((i) => a.map[i.text] !== i.category).map((i) => `"${i.text}"`);
      return score === 1
        ? { correct: true, score, feedback: fb("CORRECT", L("All classified correctly.", "Hepsi doğru sınıflandırıldı.")) }
        : { correct: false, score, feedback: fb(score >= 0.5 ? "PARTIAL" : "INCORRECT", L(`${right}/${items.length} correct. Reconsider ${wrong.slice(0, 3).join(", ")}.`, `${right}/${items.length} doğru. Şunları yeniden düşün: ${wrong.slice(0, 3).join(", ")}.`), ["CONCEPTUAL"]) };
    }
    case "text":
      return { correct: null, score: 0, feedback: fb("UNGRADED", L("Compare your answer with the rubric.", "Cevabını değerlendirme ölçütleriyle karşılaştır.")) };
  }
}

function evaluateNumber(q: Question, text: string): Evaluation {
  const ref = q.numeric!;
  const v = evalNumber(text);
  if (v === null) return { correct: false, score: 0, feedback: fb("INCORRECT", L("I couldn't read a number there. Enter a value like 8.66 or 3/4 (units optional).", "Burada bir sayı okuyamadım. 8,66 veya 3/4 gibi bir değer gir (birim isteğe bağlı)."), ["CARELESS"]) };
  const tol = ref.value === 0 ? ref.tolerance : Math.abs(ref.value) * ref.tolerance;
  const err = Math.abs(v - ref.value);
  if (err <= Math.max(tol, 1e-9)) return { correct: true, score: 1, feedback: fb("CORRECT", L("Correct.", "Doğru."), [], { successfulStrategy: undefined }) };
  if (ref.value !== 0) {
    if (Math.abs(v + ref.value) <= tol) {
      return { correct: false, score: 0.3, feedback: fb("INCORRECT", L("The magnitude is right but the sign is not. Check your choice of positive direction.", "Büyüklük doğru ama işaret değil. Pozitif yön seçimini kontrol et."), ["PROCEDURAL"]) };
    }
    const ratio = v / ref.value;
    const log10 = Math.log10(Math.abs(ratio));
    if (Math.abs(log10 - Math.round(log10)) < 0.01 && Math.round(log10) !== 0) {
      return { correct: false, score: 0.2, feedback: fb("INCORRECT", L("Off by a power of ten — check units and decimal places.", "Onun kuvveti kadar sapma var — birimleri ve ondalık basamakları kontrol et."), ["CARELESS"]) };
    }
    if (Math.abs(ratio - 2) < 0.02 || Math.abs(ratio - 0.5) < 0.01) {
      return { correct: false, score: 0.2, feedback: fb("INCORRECT", L("Off by a factor of 2 — check for a missing ½ or a doubled term.", "2 kat sapma var — eksik bir ½ ya da iki kez sayılan bir terim olabilir."), ["PROCEDURAL"]) };
    }
    if (err <= Math.abs(ref.value) * 0.06) {
      return { correct: false, score: 0.5, feedback: fb("PARTIAL", L("Very close — probably rounding or a slightly different constant (e.g. g). Recheck the arithmetic.", "Çok yakın — muhtemelen yuvarlama ya da biraz farklı bir sabit (örn. g). İşlemleri tekrar kontrol et."), ["CARELESS"]) };
    }
  }
  return { correct: false, score: 0, feedback: fb("INCORRECT", L("Revisit which principle connects what is given to what is asked.", "Verilenle istenen arasında hangi ilkenin köprü kurduğunu yeniden düşün."), []) };
}

function evaluateExpression(q: Question, text: string): Evaluation {
  if (!text.trim()) return { correct: false, score: 0, feedback: fb("INCORRECT", L("Enter an expression.", "Bir ifade gir."), ["CARELESS"]) };
  let best: ReturnType<typeof compareExpressions> = { result: "DIFFERENT" };
  for (const ref of q.acceptedExpressions ?? []) {
    const c = compareExpressions(text, ref, q.variables ?? []);
    if (c.result === "EQUAL") return { correct: true, score: 1, feedback: fb("CORRECT", L("Correct — equivalent to the expected expression.", "Doğru — beklenen ifadeye denk.")) };
    if (c.result === "SIGN" || c.result === "FACTOR" || (best.result !== "SIGN" && best.result !== "FACTOR" && c.result === "INVALID")) best = c;
  }
  switch (best.result) {
    case "SIGN":
      return { correct: false, score: 0.4, feedback: fb("PARTIAL", L("Right structure, opposite sign. Check a subtraction or a direction.", "Yapı doğru, işaret ters. Bir çıkarmayı ya da yönü kontrol et."), ["PROCEDURAL"]) };
    case "FACTOR": {
      const f = best.factor!;
      const nice = [2, 0.5, 4, 0.25, 3, 1 / 3, Math.PI, 1 / Math.PI].find((x) => Math.abs(f - x) < 1e-6);
      return { correct: false, score: 0.5, feedback: fb("PARTIAL", L(`Off by a constant factor${nice ? ` (×${roundNice(nice)})` : ""} — check coefficients.`, `Sabit bir çarpan kadar fark var${nice ? ` (×${roundNice(nice)})` : ""} — katsayıları kontrol et.`), ["PROCEDURAL"]) };
    }
    case "INVALID":
      return { correct: false, score: 0, feedback: fb("INCORRECT", L(`I couldn't parse that. Use ${q.variables?.length ? `the variables ${q.variables.join(", ")} and ` : ""}* / ^ ( ).`, `Bunu çözümleyemedim. ${q.variables?.length ? `${q.variables.join(", ")} değişkenlerini ve ` : ""}* / ^ ( ) kullan.`), ["CARELESS"]) };
    default:
      return { correct: false, score: 0, feedback: fb("INCORRECT", L("Not equivalent to the expected result. Re-derive one step at a time.", "Beklenen sonuca denk değil. Adım adım yeniden türet."), []) };
  }
}

const roundNice = (x: number) => (Math.abs(x - Math.PI) < 1e-6 ? "π" : Math.abs(x - 1 / Math.PI) < 1e-6 ? "1/π" : Number(x.toFixed(3)).toString());

/**
 * Credit for one rubric point: 1 (shown), 0.5 (partly shown), 0 (not shown),
 * or null when the point does not apply to this particular question (it is
 * then left out instead of counting against the answer).
 */
export type Credit = number | null;

/** Weight of the evaluator's holistic judgement of understanding against the rubric points. */
export const HOLISTIC_WEIGHT = 0.5;
/** A genuine misconception about the core idea keeps an answer below a pass. */
export const MISCONCEPTION_CAP = 0.6;

/**
 * Score an open answer from per-point credit, and — when an evaluator judged
 * it — its holistic understanding. Rubric points describe *what* to show, not
 * the words to use; the holistic judgement keeps a correct answer that takes
 * another valid route from failing on form.
 */
export function evaluateCredit(q: Pick<Question, "rubric">, credit: Credit[], minScore: number, judged: { understanding?: number; misconception?: boolean } = {}): Evaluation {
  const pts = q.rubric.map((r, i) => ({ r, c: credit[i] === null ? null : Math.max(0, Math.min(1, Number(credit[i] ?? 0) || 0)) }));
  const applicable = pts.filter((p) => p.c !== null) as { r: string; c: number }[];
  const rubricScore = applicable.length ? applicable.reduce((s, p) => s + p.c, 0) / applicable.length : judged.understanding ?? 0;
  let score = judged.understanding === undefined ? rubricScore : (1 - HOLISTIC_WEIGHT) * rubricScore + HOLISTIC_WEIGHT * Math.max(0, Math.min(1, judged.understanding));
  if (judged.misconception) score = Math.min(score, MISCONCEPTION_CAP);
  score = Math.round(score * 100) / 100;
  const missing = applicable.filter((p) => p.c === 0).map((p) => p.r);
  const partial = applicable.filter((p) => p.c > 0 && p.c < 1).map((p) => p.r);
  const correct = score >= minScore;
  const parts = [
    missing.length ? L(`Missing: ${missing.join("; ")}.`, `Eksik: ${missing.join("; ")}.`) : "",
    partial.length ? L(`Partly shown: ${partial.join("; ")}.`, `Kısmen gösterildi: ${partial.join("; ")}.`) : "",
  ].filter(Boolean);
  return {
    correct,
    score,
    feedback: {
      correctness: score >= 0.999 ? "CORRECT" : score > 0 ? "PARTIAL" : "INCORRECT",
      reasoningQuality: score >= 0.85 ? "STRONG" : score >= 0.6 ? "ADEQUATE" : "WEAK",
      errorTypes: judged.misconception ? ["CONCEPTUAL"] : missing.length || partial.length ? ["INCOMPLETE_EXPLANATION"] : [],
      message: parts.join(" ") || L("Every rubric point met.", "Tüm ölçütler karşılandı."),
    },
  };
}

/** Rubric-based self assessment for open responses (each point ticked or not). */
export function evaluateSelf(q: Question, met: boolean[], minScore: number): Evaluation {
  return evaluateCredit(q, q.rubric.map((_, i) => (met[i] ? 1 : 0)), minScore);
}
