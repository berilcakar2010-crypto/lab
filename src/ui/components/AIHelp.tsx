import type { Feedback, Question } from "../../domain/types";

export interface AIEvalResult {
  met: boolean[];
  feedback: Partial<Feedback> & { message: string };
}

/** AI tutoring panel — implemented in Phase 6. */
export function AIHelp(_props: { question: Question; sessionId: string; answerText: string; attempts: number; lastFeedback?: Feedback }) {
  return null;
}

/** AI evaluation of open answers — implemented in Phase 6. */
export async function evaluateOpenWithAI(_q: Question, _text: string, _image: string | undefined, _sessionId: string): Promise<AIEvalResult | null> {
  return null;
}
