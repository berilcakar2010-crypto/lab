/**
 * Questions as first-class objects: a question bank across all courses.
 *
 * Each question has a state derived from its answers (new, attempted,
 * mastered, weak, due for retention) and can be a favourite. Variations test
 * transfer — same skill, other numbers, context or representation — and are
 * created only where Lab can still grade them exactly (simulations and graph
 * questions are recomputed; other kinds go through the AI generator and the
 * quality check). AI questions must pass `questionQuality` before they are
 * stored: ambiguity, answerability, difficulty, duplicates, a solution or
 * rubric, and a valid milestone.
 */
import type { ID, LabDB, Millis, Question } from "../domain/types";
import { AUTO_GRADED } from "../domain/types";
import { addQuestion, milestoneQuestions } from "../engines/curriculum";
import { answerMode, isAutoGradable } from "../engines/evaluation";
import { evaluate, parse } from "../engines/expr";
import { L } from "../i18n";
import { similarity } from "./granularity";

const DAY = 86_400_000;

export type QuestionState = "NEW" | "ATTEMPTED" | "MASTERED" | "WEAK" | "RETENTION";

export const QUESTION_STATE_LABEL = (s: QuestionState): string =>
  ({ NEW: L("New", "Yeni"), ATTEMPTED: L("Attempted", "Denendi"), MASTERED: L("Mastered", "Ustalaşıldı"), WEAK: L("Weak", "Zayıf"), RETENTION: L("Due again", "Yeniden zamanı geldi") })[s];

/** Question types the bank distinguishes (spec: calculation … research question). */
export const QUESTION_TYPE_LABEL = (q: Question): string =>
  ({
    MULTIPLE_CHOICE: L("Multiple choice", "Çoktan seçmeli"), NUMERIC: L("Calculation", "Hesaplama"), EQUATION: L("Calculation", "Hesaplama"),
    PROBLEM_SOLVING: L("Problem", "Problem"), DERIVATION: L("Derivation", "Türetme"), PROOF: L("Proof", "İspat"), PREDICTION: L("Prediction", "Tahmin"),
    COMPARISON: L("Comparison", "Karşılaştırma"), GRAPH_INTERPRETATION: L("Interpretation", "Yorumlama"), CODE: L("Code / debugging", "Kod / hata ayıklama"),
    SIMULATION: L("Modelling", "Modelleme"), EXPLANATION: L("Explanation", "Açıklama"), CONCEPT_EXPLANATION: L("Explanation", "Açıklama"),
    FREE_RESPONSE: L("Open response", "Açık uçlu"), DIAGRAM: L("Diagram / design", "Diyagram / tasarım"), DRAWING: L("Drawing", "Çizim"),
    ORDERING: L("Ordering", "Sıralama"), CLASSIFICATION: L("Classification", "Sınıflandırma"),
  } as Record<string, string>)[q.kind] ?? q.kind;

export interface BankEntry {
  question: Question;
  state: QuestionState;
  attempts: number;
  correct: number;
  lastAt?: Millis;
  loIds: string[];
}

export function questionState(db: LabDB, q: Question, now: Millis = Date.now()): BankEntry {
  const atts = Object.values(db.attempts).filter((a) => a.questionId === q.id).sort((a, b) => a.createdAt - b.createdAt);
  const correct = atts.filter((a) => a.correct && a.hintLevelUsed < 5).length;
  const last = atts[atts.length - 1];
  const recent = atts.slice(-3);
  let state: QuestionState = "NEW";
  if (atts.length) {
    const recentAcc = recent.filter((a) => a.correct).length / recent.length;
    if (last.correct && last.hintLevelUsed < 5 && correct >= 1 && recentAcc >= 0.66) state = now - last.createdAt > 30 * DAY ? "RETENTION" : "MASTERED";
    else if (atts.length >= 2 && recentAcc < 0.5) state = "WEAK";
    else state = "ATTEMPTED";
  }
  return { question: q, state, attempts: atts.length, correct, lastAt: last?.createdAt, loIds: db.milestones[q.milestoneId]?.learningObjectIds ?? [] };
}

export interface BankFilter {
  state?: QuestionState;
  favorite?: boolean;
  loId?: string;
  text?: string;
}

export function questionBank(db: LabDB, filter: BankFilter = {}, now: Millis = Date.now()): BankEntry[] {
  const text = filter.text?.trim().toLocaleLowerCase();
  return Object.values(db.questions)
    .filter((q) => db.milestones[q.milestoneId] && !db.milestones[q.milestoneId].ephemeral?.archivedAt)
    .filter((q) => !filter.favorite || q.favorite)
    .filter((q) => !text || q.prompt.toLocaleLowerCase().includes(text))
    .map((q) => questionState(db, q, now))
    .filter((e) => !filter.state || e.state === filter.state)
    .filter((e) => !filter.loId || e.loIds.includes(filter.loId))
    .sort((a, b) => (b.lastAt ?? 0) - (a.lastAt ?? 0) || a.question.difficulty - b.question.difficulty);
}

export function toggleFavorite(db: LabDB, id: ID): boolean {
  const q = db.questions[id];
  if (!q) return false;
  q.favorite = !q.favorite;
  return q.favorite;
}

// ---------------------------------------------------------------------------
// Quality
// ---------------------------------------------------------------------------

export interface QualityReport {
  ok: boolean;
  issues: string[];
}

/** Checks for AI-generated (or imported) questions before they are stored. */
export function questionQuality(db: LabDB, q: Omit<Question, "id"> & { id?: ID }): QualityReport {
  const issues: string[] = [];
  if (!db.milestones[q.milestoneId]) issues.push(L("It belongs to no existing milestone.", "Var olan bir adıma ait değil."));
  const prompt = q.prompt?.trim() ?? "";
  if (prompt.length < 12) issues.push(L("The prompt is too short to be unambiguous.", "Soru metni belirsiz olmayacak kadar uzun değil."));
  if (/\b(etc|vs\.?|something|şey|bir şeyler)\b/i.test(prompt) && prompt.length < 40) issues.push(L("The prompt is vague.", "Soru metni muğlak."));
  if (!(q.difficulty >= 1 && q.difficulty <= 5)) issues.push(L("Difficulty must be 1–5.", "Zorluk 1–5 arası olmalı."));
  const mode = answerMode(q as Question);
  if (AUTO_GRADED.has(q.kind) && mode === "text") issues.push(L("It is meant to be auto-graded but has no answer key.", "Otomatik değerlendirilecek ama cevap anahtarı yok."));
  if (mode === "choice") {
    const ch = q.choices ?? [];
    if (ch.length < 2) issues.push(L("Needs at least two choices.", "En az iki seçenek gerekir."));
    if (new Set(ch.map((c) => c.trim().toLocaleLowerCase())).size !== ch.length) issues.push(L("Two choices are identical.", "İki seçenek aynı."));
    if (q.correctChoice === undefined || q.correctChoice < 0 || q.correctChoice >= ch.length) issues.push(L("The correct choice is missing or out of range.", "Doğru seçenek yok ya da aralık dışında."));
  }
  if (mode === "number" && !Number.isFinite(q.numeric?.value)) issues.push(L("The numeric answer is not a number.", "Sayısal cevap bir sayı değil."));
  if (mode === "text" && !q.rubric?.length && !q.solution?.trim()) issues.push(L("An open question needs a rubric or a model solution.", "Açık uçlu bir sorunun ölçütü ya da örnek çözümü olmalı."));
  const dup = milestoneQuestions(db, q.milestoneId).find((x) => x.id !== q.id && similarity(x.prompt, prompt) >= 0.9);
  if (dup) issues.push(L("Nearly the same as an existing question.", "Var olan bir soruyla neredeyse aynı."));
  return { ok: issues.length === 0, issues };
}

// ---------------------------------------------------------------------------
// Variations
// ---------------------------------------------------------------------------

/**
 * A variation Lab can grade exactly: a simulation question with other
 * starting values (the answer is recomputed from its expression), or a graph
 * question over another range. Returns null for kinds that need the AI
 * generator. `random` picks the new values; tests pass a fixed function.
 */
export function localVariant(db: LabDB, id: ID, random: () => number = Math.random): Question | null {
  const q = db.questions[id];
  if (!q) return null;
  if (q.simulation && q.simulation.variables.length) {
    const vars = q.simulation.variables.map((v) => {
      const steps = Math.max(1, Math.round((v.max - v.min) / (v.step || 1)));
      const k = Math.floor(random() * (steps + 1));
      return { ...v, initial: Math.min(v.max, v.min + k * (v.step || 1)) };
    });
    if (vars.every((v, i) => v.initial === q.simulation!.variables[i].initial)) vars[0] = { ...vars[0], initial: vars[0].initial === vars[0].max ? vars[0].min : vars[0].max };
    const scope = Object.fromEntries(vars.map((v) => [v.name, v.initial]));
    let value: number;
    try {
      value = evaluate(parse(q.simulation.expression, vars.map((v) => v.name)), scope);
    } catch {
      return null;
    }
    if (!Number.isFinite(value)) return null;
    const changed = vars.map((v) => `${v.label} = ${v.initial}`).join(", ");
    return addQuestion(db, {
      ...structuredClone({ ...q, id: undefined, favorite: undefined }),
      prompt: `${q.prompt}\n\n${L("Variation — start from", "Varyasyon — başlangıç")}: ${changed}`,
      simulation: { ...q.simulation, variables: vars },
      numeric: q.numeric ? { ...q.numeric, value } : undefined,
      variantOf: q.id, variation: L("different numbers", "farklı sayılar"), createdBy: "variant",
    });
  }
  if (q.graph && isAutoGradable(q) && q.choices?.length) {
    const span = q.graph.xMax - q.graph.xMin;
    return addQuestion(db, {
      ...structuredClone({ ...q, id: undefined, favorite: undefined }),
      graph: { ...q.graph, xMin: q.graph.xMin - span / 2, xMax: q.graph.xMax + span / 2 },
      prompt: `${q.prompt}\n\n${L("Variation: the same curve over a wider range.", "Varyasyon: aynı eğri daha geniş bir aralıkta.")}`,
      variantOf: q.id, variation: L("different representation", "farklı gösterim"), createdBy: "variant",
    });
  }
  return null;
}

export const variantsOf = (db: LabDB, id: ID) => Object.values(db.questions).filter((q) => q.variantOf === id);

/**
 * Problem recycling: questions answered correctly a while ago on important
 * topics are worth a variation rather than the same item again.
 */
export function recycleCandidates(db: LabDB, now: Millis = Date.now(), minDays = 14): BankEntry[] {
  return questionBank(db, {}, now).filter((e) => e.state === "RETENTION" || (e.state === "MASTERED" && e.lastAt !== undefined && now - e.lastAt > minDays * DAY)).slice(0, 20);
}
