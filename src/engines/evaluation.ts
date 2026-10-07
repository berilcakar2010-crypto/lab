/**
 * Deterministic evaluation. Auto-gradable answers are graded here; open
 * responses return UNGRADED so the AI evaluator or rubric self-assessment can
 * grade them. Feedback separates correctness from error type.
 */
import type { ErrorType, Feedback, Question } from "../domain/types";
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
        ? { correct: true, score: 1, feedback: fb("CORRECT", "Doğru.") }
        : { correct: false, score: 0, feedback: fb("INCORRECT", `Bu değil. "${q.choices?.[a.index] ?? ""}" neden cazip geliyor — ve neyi gözden kaçırıyor?`, ["CONCEPTUAL"]) };
    }
    case "number":
      return evaluateNumber(q, a.text);
    case "expression":
      return evaluateExpression(q, a.text);
    case "order": {
      const ref = q.orderItems ?? [];
      if (a.items.length !== ref.length) return { correct: false, score: 0, feedback: fb("INCORRECT", "Her adımı yerleştir.", ["INCOMPLETE_EXPLANATION"]) };
      let pairs = 0;
      for (let i = 0; i + 1 < a.items.length; i++) if (ref.indexOf(a.items[i]) < ref.indexOf(a.items[i + 1])) pairs++;
      const exact = a.items.every((x, i) => x === ref[i]);
      const score = exact ? 1 : pairs / Math.max(1, ref.length - 1);
      return exact
        ? { correct: true, score: 1, feedback: fb("CORRECT", "Sıralama doğru.") }
        : { correct: false, score, feedback: fb(score >= 0.6 ? "PARTIAL" : "INCORRECT", `${ref.length - 1} komşu adımdan ${pairs} tanesi doğru sırada. Mantıksal olarak hangi adım önce gelmeli?`, ["PROCEDURAL"]) };
    }
    case "classify": {
      const items = q.classification?.items ?? [];
      const right = items.filter((i) => a.map[i.text] === i.category).length;
      const score = items.length ? right / items.length : 0;
      const wrong = items.filter((i) => a.map[i.text] !== i.category).map((i) => `"${i.text}"`);
      return score === 1
        ? { correct: true, score, feedback: fb("CORRECT", "Hepsi doğru sınıflandırıldı.") }
        : { correct: false, score, feedback: fb(score >= 0.5 ? "PARTIAL" : "INCORRECT", `${right}/${items.length} doğru. Şunları yeniden düşün: ${wrong.slice(0, 3).join(", ")}.`, ["CONCEPTUAL"]) };
    }
    case "text":
      return { correct: null, score: 0, feedback: fb("UNGRADED", "Cevabını değerlendirme ölçütleriyle karşılaştır.") };
  }
}

function evaluateNumber(q: Question, text: string): Evaluation {
  const ref = q.numeric!;
  const v = evalNumber(text);
  if (v === null) return { correct: false, score: 0, feedback: fb("INCORRECT", "Burada bir sayı okuyamadım. 8,66 veya 3/4 gibi bir değer gir (birim isteğe bağlı).", ["CARELESS"]) };
  const tol = ref.value === 0 ? ref.tolerance : Math.abs(ref.value) * ref.tolerance;
  const err = Math.abs(v - ref.value);
  if (err <= Math.max(tol, 1e-9)) return { correct: true, score: 1, feedback: fb("CORRECT", "Doğru.", [], { successfulStrategy: undefined }) };
  if (ref.value !== 0) {
    if (Math.abs(v + ref.value) <= tol) {
      return { correct: false, score: 0.3, feedback: fb("INCORRECT", "Büyüklük doğru ama işaret değil. Pozitif yön seçimini kontrol et.", ["PROCEDURAL"]) };
    }
    const ratio = v / ref.value;
    const log10 = Math.log10(Math.abs(ratio));
    if (Math.abs(log10 - Math.round(log10)) < 0.01 && Math.round(log10) !== 0) {
      return { correct: false, score: 0.2, feedback: fb("INCORRECT", "Onun kuvveti kadar sapma var — birimleri ve ondalık basamakları kontrol et.", ["CARELESS"]) };
    }
    if (Math.abs(ratio - 2) < 0.02 || Math.abs(ratio - 0.5) < 0.01) {
      return { correct: false, score: 0.2, feedback: fb("INCORRECT", "2 kat sapma var — eksik bir ½ ya da iki kez sayılan bir terim olabilir.", ["PROCEDURAL"]) };
    }
    if (err <= Math.abs(ref.value) * 0.06) {
      return { correct: false, score: 0.5, feedback: fb("PARTIAL", "Çok yakın — muhtemelen yuvarlama ya da biraz farklı bir sabit (örn. g). İşlemleri tekrar kontrol et.", ["CARELESS"]) };
    }
  }
  return { correct: false, score: 0, feedback: fb("INCORRECT", "Verilenle istenen arasında hangi ilkenin köprü kurduğunu yeniden düşün.", []) };
}

function evaluateExpression(q: Question, text: string): Evaluation {
  if (!text.trim()) return { correct: false, score: 0, feedback: fb("INCORRECT", "Bir ifade gir.", ["CARELESS"]) };
  let best: ReturnType<typeof compareExpressions> = { result: "DIFFERENT" };
  for (const ref of q.acceptedExpressions ?? []) {
    const c = compareExpressions(text, ref, q.variables ?? []);
    if (c.result === "EQUAL") return { correct: true, score: 1, feedback: fb("CORRECT", "Doğru — beklenen ifadeye denk.") };
    if (c.result === "SIGN" || c.result === "FACTOR" || (best.result !== "SIGN" && best.result !== "FACTOR" && c.result === "INVALID")) best = c;
  }
  switch (best.result) {
    case "SIGN":
      return { correct: false, score: 0.4, feedback: fb("PARTIAL", "Yapı doğru, işaret ters. Bir çıkarmayı ya da yönü kontrol et.", ["PROCEDURAL"]) };
    case "FACTOR": {
      const f = best.factor!;
      const nice = [2, 0.5, 4, 0.25, 3, 1 / 3, Math.PI, 1 / Math.PI].find((x) => Math.abs(f - x) < 1e-6);
      return { correct: false, score: 0.5, feedback: fb("PARTIAL", `Sabit bir çarpan kadar fark var${nice ? ` (×${roundNice(nice)})` : ""} — katsayıları kontrol et.`, ["PROCEDURAL"]) };
    }
    case "INVALID":
      return { correct: false, score: 0, feedback: fb("INCORRECT", `Bunu çözümleyemedim. ${q.variables?.length ? `${q.variables.join(", ")} değişkenlerini ve ` : ""}* / ^ ( ) kullan.`, ["CARELESS"]) };
    default:
      return { correct: false, score: 0, feedback: fb("INCORRECT", "Beklenen sonuca denk değil. Adım adım yeniden türet.", []) };
  }
}

const roundNice = (x: number) => (Math.abs(x - Math.PI) < 1e-6 ? "π" : Math.abs(x - 1 / Math.PI) < 1e-6 ? "1/π" : Number(x.toFixed(3)).toString());

/** Rubric-based self assessment for open responses. */
export function evaluateSelf(q: Question, met: boolean[], minScore: number): Evaluation {
  const total = Math.max(1, q.rubric.length);
  const score = met.filter(Boolean).length / total;
  const missing = q.rubric.filter((_, i) => !met[i]);
  const correct = score >= minScore;
  return {
    correct,
    score,
    feedback: {
      correctness: score === 1 ? "CORRECT" : correct ? "PARTIAL" : score > 0 ? "PARTIAL" : "INCORRECT",
      reasoningQuality: score === 1 ? "STRONG" : score >= 0.6 ? "ADEQUATE" : "WEAK",
      errorTypes: missing.length ? ["INCOMPLETE_EXPLANATION"] : [],
      message: missing.length ? `Eksik: ${missing.join("; ")}.` : "Tüm ölçütler karşılandı.",
    },
  };
}
