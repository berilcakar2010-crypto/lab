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
        ? { correct: true, score: 1, feedback: fb("CORRECT", "Correct.") }
        : { correct: false, score: 0, feedback: fb("INCORRECT", `Not this one. Think about why "${q.choices?.[a.index] ?? ""}" is tempting — and what it misses.`, ["CONCEPTUAL"]) };
    }
    case "number":
      return evaluateNumber(q, a.text);
    case "expression":
      return evaluateExpression(q, a.text);
    case "order": {
      const ref = q.orderItems ?? [];
      if (a.items.length !== ref.length) return { correct: false, score: 0, feedback: fb("INCORRECT", "Place every step.", ["INCOMPLETE_EXPLANATION"]) };
      let pairs = 0;
      for (let i = 0; i + 1 < a.items.length; i++) if (ref.indexOf(a.items[i]) < ref.indexOf(a.items[i + 1])) pairs++;
      const exact = a.items.every((x, i) => x === ref[i]);
      const score = exact ? 1 : pairs / Math.max(1, ref.length - 1);
      return exact
        ? { correct: true, score: 1, feedback: fb("CORRECT", "Correct order.") }
        : { correct: false, score, feedback: fb(score >= 0.6 ? "PARTIAL" : "INCORRECT", `${pairs} of ${ref.length - 1} neighbouring steps are in the right order. Which step must logically come first?`, ["PROCEDURAL"]) };
    }
    case "classify": {
      const items = q.classification?.items ?? [];
      const right = items.filter((i) => a.map[i.text] === i.category).length;
      const score = items.length ? right / items.length : 0;
      const wrong = items.filter((i) => a.map[i.text] !== i.category).map((i) => `"${i.text}"`);
      return score === 1
        ? { correct: true, score, feedback: fb("CORRECT", "All classified correctly.") }
        : { correct: false, score, feedback: fb(score >= 0.5 ? "PARTIAL" : "INCORRECT", `${right}/${items.length} correct. Reconsider ${wrong.slice(0, 3).join(", ")}.`, ["CONCEPTUAL"]) };
    }
    case "text":
      return { correct: null, score: 0, feedback: fb("UNGRADED", "Compare your answer with the rubric.") };
  }
}

function evaluateNumber(q: Question, text: string): Evaluation {
  const ref = q.numeric!;
  const v = evalNumber(text);
  if (v === null) return { correct: false, score: 0, feedback: fb("INCORRECT", "I couldn't read a number there. Enter a value like 8.66 or 3/4 (units optional).", ["CARELESS"]) };
  const tol = ref.value === 0 ? ref.tolerance : Math.abs(ref.value) * ref.tolerance;
  const err = Math.abs(v - ref.value);
  if (err <= Math.max(tol, 1e-9)) return { correct: true, score: 1, feedback: fb("CORRECT", "Correct.", [], { successfulStrategy: undefined }) };
  if (ref.value !== 0) {
    if (Math.abs(v + ref.value) <= tol) {
      return { correct: false, score: 0.3, feedback: fb("INCORRECT", "The magnitude is right but the sign is not. Check your choice of positive direction.", ["PROCEDURAL"]) };
    }
    const ratio = v / ref.value;
    const log10 = Math.log10(Math.abs(ratio));
    if (Math.abs(log10 - Math.round(log10)) < 0.01 && Math.round(log10) !== 0) {
      return { correct: false, score: 0.2, feedback: fb("INCORRECT", "Off by a power of ten — check units and decimal places.", ["CARELESS"]) };
    }
    if (Math.abs(ratio - 2) < 0.02 || Math.abs(ratio - 0.5) < 0.01) {
      return { correct: false, score: 0.2, feedback: fb("INCORRECT", "Off by a factor of 2 — check for a missing ½ or a doubled term.", ["PROCEDURAL"]) };
    }
    if (err <= Math.abs(ref.value) * 0.06) {
      return { correct: false, score: 0.5, feedback: fb("PARTIAL", "Very close — probably rounding or a slightly different constant (e.g. g). Recheck the arithmetic.", ["CARELESS"]) };
    }
  }
  return { correct: false, score: 0, feedback: fb("INCORRECT", "Revisit which principle connects what is given to what is asked.", []) };
}

function evaluateExpression(q: Question, text: string): Evaluation {
  if (!text.trim()) return { correct: false, score: 0, feedback: fb("INCORRECT", "Enter an expression.", ["CARELESS"]) };
  let best: ReturnType<typeof compareExpressions> = { result: "DIFFERENT" };
  for (const ref of q.acceptedExpressions ?? []) {
    const c = compareExpressions(text, ref, q.variables ?? []);
    if (c.result === "EQUAL") return { correct: true, score: 1, feedback: fb("CORRECT", "Correct — equivalent to the expected expression.") };
    if (c.result === "SIGN" || c.result === "FACTOR" || (best.result !== "SIGN" && best.result !== "FACTOR" && c.result === "INVALID")) best = c;
  }
  switch (best.result) {
    case "SIGN":
      return { correct: false, score: 0.4, feedback: fb("PARTIAL", "Right structure, opposite sign. Check a subtraction or a direction.", ["PROCEDURAL"]) };
    case "FACTOR": {
      const f = best.factor!;
      const nice = [2, 0.5, 4, 0.25, 3, 1 / 3, Math.PI, 1 / Math.PI].find((x) => Math.abs(f - x) < 1e-6);
      return { correct: false, score: 0.5, feedback: fb("PARTIAL", `Off by a constant factor${nice ? ` (×${roundNice(nice)})` : ""} — check coefficients.`, ["PROCEDURAL"]) };
    }
    case "INVALID":
      return { correct: false, score: 0, feedback: fb("INCORRECT", `I couldn't parse that. Use ${q.variables?.length ? `the variables ${q.variables.join(", ")} and ` : ""}* / ^ ( ).`, ["CARELESS"]) };
    default:
      return { correct: false, score: 0, feedback: fb("INCORRECT", "Not equivalent to the expected result. Re-derive one step at a time.", []) };
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
      message: missing.length ? `Missing: ${missing.join("; ")}.` : "Every rubric point met.",
    },
  };
}
