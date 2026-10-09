/**
 * Shared rules for every AI judgement of a learner's work (open answers,
 * explanations). The aim is to measure knowledge and understanding — not how
 * closely an answer matches the expected wording or method.
 */
/** How Lab judges open answers: understanding, not conformity to the reference wording. */
export const EVALUATION_PRINCIPLES = [
  "Measure understanding, not conformity. The rubric says WHAT must be understood, never which words, order, notation or method must be used.",
  "Credit an idea whenever it is present in substance: in the student's own words, informally, with an example, a sketch, a different but valid method, or implied by a correct step. Never require the reference solution's phrasing or key terms.",
  "Do not penalise brevity when the idea is clearly there, spelling, grammar, language mix, notation, or answering in a different order. A small arithmetic slip in otherwise sound reasoning costs little and is a CARELESS error, not a CONCEPTUAL one.",
  "Penalise what shows the idea is NOT understood: a wrong principle, a misconception, a contradiction, a memorised phrase used where it does not fit, or a missing step the question actually needs.",
  "Never invent errors. When unsure whether an idea is present, look for evidence in the answer and give PARTIAL rather than NONE.",
].join("\n");
