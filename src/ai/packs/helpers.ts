import type { QuestionSpec } from "../../engines/curriculumSpec";

type Purpose = "PRACTICE" | "MASTERY" | "RETENTION" | "TRANSFER";
type H = [string, string, string, string];

export const num = (
  purpose: Purpose, prompt: string, value: number, unit: string | undefined, hints: H, solution: string, tolerance = 0.02,
): QuestionSpec => ({ kind: "NUMERIC", purpose, prompt, numeric: { value, tolerance, unit }, hints, solution });

export const mc = (purpose: Purpose, prompt: string, choices: string[], correct: number, hints: H, solution: string): QuestionSpec => ({
  kind: "MULTIPLE_CHOICE", purpose, prompt, choices, correctChoice: correct, hints, solution,
});

export const expr = (
  purpose: Purpose, prompt: string, accepted: string[], variables: string[], hints: H, solution: string,
): QuestionSpec => ({ kind: "EQUATION", purpose, prompt, acceptedExpressions: accepted, variables, hints, solution });

export const open = (kind: string, purpose: Purpose, prompt: string, rubric: string[], hints: H, solution: string): QuestionSpec => ({
  kind, purpose, prompt, rubric, hints, solution,
});
