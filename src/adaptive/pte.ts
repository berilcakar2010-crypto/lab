/**
 * Predict → Test → Observe → Explain → Compare.
 *
 * The learner first predicts what happens when one parameter of a real model
 * changes ("if the damping doubles, what happens to the motion?"), then the
 * sandbox computes it, the learner sees the result, explains why, and
 * compares prediction and result. The prediction is scored against the
 * computed result (not against an opinion); the explanation is evidence for
 * the explanation dimension once it is assessed.
 */
import type { LabDB, Millis } from "../domain/types";
import type { Direction, PredictionRecord } from "../domain/adaptive";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { L } from "../i18n";
import { evalFormula, runOde, type SandboxModel } from "./sandbox";

export const DIRECTION_LABEL = (d: Direction): string =>
  ({ UP: L("It increases", "Artar"), DOWN: L("It decreases", "Azalır"), SAME: L("It stays the same", "Değişmez"), NONMONOTONIC: L("First one way, then the other", "Önce bir yöne, sonra öbür yöne") })[d];

export interface PteTask {
  modelId: string;
  param: string;
  from: number;
  to: number;
  question: string;
}

/** Output of the model for given parameter values. */
export function measure(model: SandboxModel, values: Record<string, number>): number {
  if (model.kind === "formula") return evalFormula(model, values);
  const r = runOde({ equations: model.equations, initial: model.initial, params: values, t1: model.t1, dt: model.dt, reset: model.reset });
  return model.measure.kind === "resets" ? r.resets : r.final[model.measure.variable];
}

const defaults = (m: SandboxModel) => Object.fromEntries(m.params.map((p) => [p.name, p.value]));

/** A prediction task: double the chosen parameter (within its range), or raise it toward its maximum. */
export function pteTask(model: SandboxModel, param = model.pteParam): PteTask {
  const p = model.params.find((x) => x.name === param) ?? model.params[0];
  const to = Math.min(p.max, p.value * 2 > p.value ? p.value * 2 : p.value + (p.max - p.min) / 2);
  const unit = p.unit ? ` ${p.unit}` : "";
  return {
    modelId: model.id, param: p.name, from: p.value, to: Math.round(to * 1000) / 1000,
    question: L(`${model.title}: if ${p.label.toLowerCase()} goes from ${p.value}${unit} to ${Math.round(to * 1000) / 1000}${unit} (everything else the same), what happens to ${model.output.toLowerCase()}?`, `${model.title}: ${p.label.toLocaleLowerCase("tr")} ${p.value}${unit} değerinden ${Math.round(to * 1000) / 1000}${unit} değerine çıkarsa (diğer her şey aynı), ${model.output.toLocaleLowerCase("tr")} ne olur?`),
  };
}

/** Whether the output turns around somewhere over the parameter's whole range. */
export function isNonMonotonic(model: SandboxModel, param: string, samples = 40): boolean {
  const p = model.params.find((x) => x.name === param)!;
  const base = defaults(model);
  let sign = 0;
  let prev = measure(model, { ...base, [param]: p.min });
  for (let i = 1; i <= samples; i++) {
    const y = measure(model, { ...base, [param]: p.min + ((p.max - p.min) * i) / samples });
    if (!Number.isFinite(y) || !Number.isFinite(prev)) { prev = y; continue; }
    const d = Math.sign(y - prev);
    if (d && sign && d !== sign) return true;
    if (d) sign = d;
    prev = y;
  }
  return false;
}

export interface PteResult { base: number; changed: number; direction: Direction; nonMonotonic: boolean }

export function runPte(model: SandboxModel, task: PteTask): PteResult {
  const base = defaults(model);
  const a = measure(model, { ...base, [task.param]: task.from });
  const b = measure(model, { ...base, [task.param]: task.to });
  const rel = Math.abs(b - a) / Math.max(1e-9, Math.abs(a));
  const direction: Direction = rel < 0.01 ? "SAME" : b > a ? "UP" : "DOWN";
  return { base: a, changed: b, direction, nonMonotonic: isNonMonotonic(model, task.param) };
}

/** Score the prediction against the computed result and record it. */
export function submitPrediction(db: LabDB, model: SandboxModel, task: PteTask, prediction: { direction: Direction; value?: number }, now: Millis = Date.now()): PredictionRecord {
  const r = runPte(model, task);
  const dirOk = prediction.direction === "NONMONOTONIC" ? r.nonMonotonic : prediction.direction === r.direction;
  // A numeric guess, when given, must also be within 25% of the computed value.
  const valueOk = prediction.value === undefined || Math.abs(prediction.value - r.changed) <= 0.25 * Math.max(1e-9, Math.abs(r.changed));
  const rec: PredictionRecord = {
    id: newId("pred"), modelId: model.id, loIds: model.loIds, question: task.question,
    prediction, result: { direction: r.direction, base: r.base, changed: r.changed }, correct: dirOk && valueOk, createdAt: now,
  };
  db.predictions[rec.id] = rec;
  logEvent(db, "PREDICTION_SUBMITTED", { at: now, loIds: model.loIds }, { predictionId: rec.id, modelId: model.id, correct: rec.correct, predicted: prediction.direction, actual: r.direction });
  return rec;
}

/**
 * The learner's explanation after seeing the result. Without an AI score the
 * learner ticks the two rubric points; the score is the share ticked.
 */
export function explainPrediction(db: LabDB, id: string, text: string, rubric: { mechanism: boolean; usesResult: boolean } | { aiScore: number }): PredictionRecord | null {
  const rec = db.predictions[id];
  if (!rec || !text.trim()) return null;
  rec.explanation = text.trim();
  rec.explanationScore = "aiScore" in rubric ? Math.max(0, Math.min(1, rubric.aiScore)) : (Number(rubric.mechanism) + Number(rubric.usesResult)) / 2;
  logEvent(db, "EXPLANATION", { loIds: rec.loIds }, { lo: rec.loIds[0] ?? null, predictionId: id, score: rec.explanationScore, mode: "PTE" });
  return rec;
}

/** Compare: what was predicted, what happened. */
export function comparison(rec: PredictionRecord): string {
  const f = (x: number) => (Math.abs(x) >= 1e4 ? x.toExponential(2) : String(Math.round(x * 1000) / 1000));
  return rec.correct
    ? L(`Your prediction held: ${DIRECTION_LABEL(rec.result.direction).toLowerCase()} (${f(rec.result.base)} → ${f(rec.result.changed)}).`, `Tahminin tuttu: ${DIRECTION_LABEL(rec.result.direction).toLocaleLowerCase("tr")} (${f(rec.result.base)} → ${f(rec.result.changed)}).`)
    : L(`You predicted "${DIRECTION_LABEL(rec.prediction.direction).toLowerCase()}", the model gives ${f(rec.result.base)} → ${f(rec.result.changed)}. The interesting part: why?`, `"${DIRECTION_LABEL(rec.prediction.direction).toLocaleLowerCase("tr")}" dedin; model ${f(rec.result.base)} → ${f(rec.result.changed)} veriyor. Asıl ilginç kısım: neden?`);
}
