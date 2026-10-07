/** AI roles that create or reshape curriculum structure. */
import type { LabDB, Milestone } from "../domain/types";
import type { CurriculumSpec, MilestoneSpec, QuestionSpec } from "../engines/curriculumSpec";
import type { SplitPart } from "../engines/curriculum";
import { courseMilestones, milestoneQuestions } from "../engines/curriculum";
import { localBuildCurriculum, localSplit } from "./localBuilder";
import { L } from "../i18n";
import { parseJSON, runAI, type AIHost, type AIResult } from "./engine";

export const MILESTONE_PHILOSOPHY = `
A milestone is a meaningful intellectual achievement — it answers "What can the student now DO that they could not reliably do before?"
BAD: "Study Newton's laws for 30 minutes."  GOOD: "Given a physical situation, identify all relevant forces and construct a correct free-body diagram."
Never split topics mechanically or by time. Sizes vary: a simple concept may take 5–10 minutes, a derivation 30–45, a project hours.
The curriculum is a knowledge graph, not a chapter list: use prerequisites to express real conceptual dependencies, allow branching where several routes are valid (e.g. after Newton's laws, Energy and Momentum are parallel), mark enrichment as optional, add REVIEW milestones at consolidation points, optional CHALLENGE milestones, and BOSS milestones that integrate several branches.`;

const QUESTION_RULES = `
Questions: every milestone needs at least 2 "MASTERY" questions, 1 "RETENTION" question (same skill, new numbers) and 1 "TRANSFER" question (same concept, unfamiliar context).
Prefer auto-gradable forms when they fit the skill: NUMERIC {"numeric":{"value":number,"tolerance":0.02,"unit":"..."}}, MULTIPLE_CHOICE {"choices":[...],"correctChoice":index}, EQUATION {"acceptedExpressions":["ascii math, e.g. 6*t+2"],"variables":["t"]}, ORDERING {"orderItems":[correct order]}, CLASSIFICATION {"classification":{"categories":[...],"items":[{"text":"...","category":"..."}]}}, GRAPH_INTERPRETATION {"graph":{"expression":"in x","xMin":0,"xMax":5}} plus numeric or choices.
Do NOT reduce proofs or derivations to multiple choice: use PROOF/DERIVATION/EXPLANATION with a "rubric" (list of key points a complete answer contains).
Every question has "hints": exactly 4 strings escalating from a small nudge, to a conceptual hint, to a strategic hint, to partial guidance — never giving the final answer — and a full "solution".
Math in expressions uses ascii: ^ for powers, sqrt(), sin(), cos(), tan(), exp(), ln(), pi.`;

const SPEC_SHAPE = `{
 "title": string, "subject": string, "goal": string, "description": string,
 "units": [{ "title": string, "summary": string, "topics": [{ "title": string,
   "concepts": [{"key": string, "title": string, "description": string}],
   "milestones": [{ "key": "unique short id", "title": string, "learningObjective": "what the student can now do",
     "description": string, "type": "CONCEPT|PRACTICE|APPLICATION|DERIVATION|PROOF|PROBLEM_SOLVING|EXPERIMENT|PROJECT|REVIEW|CHALLENGE|BOSS",
     "difficulty": 1-5, "estimatedMinutes": number, "prerequisites": ["keys of earlier milestones"], "optional": boolean,
     "interaction": "MULTIPLE_CHOICE|FREE_RESPONSE|EQUATION|NUMERIC|DERIVATION|PROOF|EXPLANATION|PREDICTION|DIAGRAM|DRAWING|GRAPH_INTERPRETATION|ORDERING|CODE|SIMULATION|PROBLEM_SOLVING|CLASSIFICATION|COMPARISON|CONCEPT_EXPLANATION",
     "masteryCriterion": string, "requiredCorrect": number, "tags": [string], "conceptKeys": [string],
     "questions": [{ "kind": string, "purpose": "MASTERY|RETENTION|TRANSFER|PRACTICE", "prompt": string, "rubric": [string], "hints": [4 strings], "solution": string, "difficulty": 1-5 }]
 }]}]}]
}`;

function validateSpec(x: unknown): CurriculumSpec {
  const s = x as CurriculumSpec;
  if (!s || typeof s !== "object" || !Array.isArray(s.units) || !s.units.length) throw new Error("Missing units");
  const count = s.units.flatMap((u) => (u.topics ?? []).flatMap((t) => t.milestones ?? [])).length;
  if (count < 3) throw new Error("Too few milestones");
  return s;
}

export async function buildCurriculumAI(
  host: AIHost,
  input: { request: string; syllabus?: string },
): Promise<AIResult<{ spec: CurriculumSpec; note: string }>> {
  const local = () => localBuildCurriculum(input.request, input.syllabus);
  return runAI(host, {
    role: "CURRICULUM_BUILDER",
    summary: `Build curriculum: ${input.request.slice(0, 80)}`,
    maxTokens: 16_000,
    timeoutMs: 120_000,
    temperature: 0.3,
    system: `You are Lab's Curriculum Builder, an expert teacher and curriculum designer. You turn a large academic goal into a knowledge graph of small, meaningful micro-milestones.${MILESTONE_PHILOSOPHY}${QUESTION_RULES}
${L("Write all text in English unless the user's request is clearly written in another language; use correct academic terminology.", "Write all text in Turkish (Türkçe) unless the user's request is clearly written in another language; use correct Turkish academic terminology.")} Return ONLY a JSON object of this shape:
${SPEC_SHAPE}`,
    prompt: `Course request: "${input.request}"
${input.syllabus?.trim() ? `Source material provided by the student (syllabus / table of contents / exam spec). Follow its scope but model the knowledge structure, not the chapter order:\n"""\n${input.syllabus.slice(0, 20_000)}\n"""` : "No syllabus was provided; use the standard scope for this course and level."}
Determine the overall goal, major units, topics, concepts, prerequisites and dependencies, practice and application requirements, review points and challenge/boss milestones.
Aim for 14–30 milestones in total. Include at least one branch, at least one optional milestone, at least one REVIEW, one CHALLENGE and one BOSS.`,
    parse: parseJSON((x) => ({ spec: validateSpec(x), note: L("Generated by AI. Review and edit anything that does not fit you.", "YZ tarafından oluşturuldu. Sana uymayan her şeyi gözden geçirip düzenleyebilirsin.") })),
    fallback: local,
  });
}

/** Regenerate the milestones of one topic (the rest of the course stays intact). */
export async function generateTopicMilestonesAI(
  host: AIHost,
  db: LabDB,
  topicId: string,
  instruction: string,
): Promise<AIResult<MilestoneSpec[] | null>> {
  const topic = db.topics[topicId];
  const course = db.courses[topic.courseId];
  const existing = courseMilestones(db, course.id).filter((m) => m.topicId === topicId);
  return runAI(host, {
    role: "MILESTONE_GENERATOR",
    summary: `Regenerate topic ${topic.title}`,
    maxTokens: 8000,
    system: `You are Lab's Milestone Generator.${MILESTONE_PHILOSOPHY}${QUESTION_RULES}
${L("Write in English unless the existing titles are in another language.", "Write in Turkish unless the existing titles are in another language.")} Return ONLY {"milestones": [milestone objects as in: ${SPEC_SHAPE.slice(SPEC_SHAPE.indexOf('"milestones"'))}]}.
"prerequisites" may only reference keys of milestones you return (earlier in the list).`,
    prompt: `Course: ${course.title} — goal: ${course.goal}
Topic: ${topic.title}
Current milestones: ${JSON.stringify(existing.map((m) => ({ title: m.title, objective: m.learningObjective, type: m.milestoneType, difficulty: m.difficulty })))}
Student's instruction: ${instruction || "Improve the breakdown into meaningful micro-milestones."}`,
    parse: parseJSON((x) => {
      const ms = (x as { milestones?: MilestoneSpec[] }).milestones;
      if (!Array.isArray(ms) || !ms.length) throw new Error("No milestones");
      return ms;
    }),
    fallback: () => null,
  });
}

export async function splitMilestoneAI(host: AIHost, m: Milestone): Promise<AIResult<SplitPart[]>> {
  return runAI(host, {
    role: "MILESTONE_GENERATOR",
    summary: `Split ${m.title}`,
    milestoneId: m.id,
    system: `You are Lab's Milestone Generator.${MILESTONE_PHILOSOPHY}
Split one milestone into 2–4 smaller milestones that each represent a meaningful achievement and form a sequence. ${L("Write in English unless the input is in another language.", "Write in Turkish unless the input is in another language.")}
Return ONLY {"parts":[{"title":string,"learningObjective":string,"milestoneType":string,"difficulty":1-5,"estimatedDuration":minutes}]}`,
    prompt: `Milestone: ${m.title}\nObjective: ${m.learningObjective}\nType: ${m.milestoneType}, difficulty ${m.difficulty}, ~${m.estimatedDuration} min.`,
    parse: parseJSON((x) => {
      const parts = (x as { parts?: SplitPart[] }).parts;
      if (!Array.isArray(parts) || parts.length < 2) throw new Error("Need at least two parts");
      return parts.slice(0, 4).map((p) => ({ ...p, milestoneType: p.milestoneType?.toUpperCase() as SplitPart["milestoneType"] }));
    }),
    fallback: () => localSplit(m),
  });
}

/** Generate questions for a milestone that has none (e.g. after manual add or split). */
export async function generateQuestionsAI(host: AIHost, db: LabDB, m: Milestone): Promise<AIResult<QuestionSpec[]>> {
  const course = db.courses[m.courseId];
  return runAI(host, {
    role: "MILESTONE_GENERATOR",
    summary: `Questions for ${m.title}`,
    milestoneId: m.id,
    maxTokens: 6000,
    system: `You are Lab's question author.${QUESTION_RULES}
${L("Write in English unless the milestone is in another language.", "Write in Turkish unless the milestone is in another language.")} Return ONLY {"questions":[...]} with the question shape: {"kind","purpose","prompt","choices","correctChoice","numeric","acceptedExpressions","variables","orderItems","classification","graph","rubric","hints","solution","difficulty"}.`,
    prompt: `Course: ${course?.title}\nMilestone: ${m.title}\nObjective: ${m.learningObjective}\nType: ${m.milestoneType}, recommended interaction ${m.recommendedInteractionType}, difficulty ${m.difficulty}.\nMastery criterion: ${m.masteryCriteria.description}\nExisting question prompts (do not repeat): ${JSON.stringify(milestoneQuestions(db, m.id).map((q) => q.prompt))}`,
    parse: parseJSON((x) => {
      const qs = (x as { questions?: QuestionSpec[] }).questions;
      if (!Array.isArray(qs) || !qs.length) throw new Error("No questions");
      return qs;
    }),
    fallback: () => fallbackQuestions(m),
  });
}

export function fallbackQuestions(m: Milestone): QuestionSpec[] {
  const hints = [
    L("Restate the objective in your own words.", "Hedefi kendi cümlelerinle yeniden ifade et."),
    L("Which definitions or principles does it rely on?", "Hangi tanım ya da ilkelere dayanıyor?"),
    L("Plan: what is given, what is asked, what connects them?", "Planla: ne verilmiş, ne isteniyor, ikisini ne bağlıyor?"),
    L("Work a small example fully, then generalise.", "Küçük bir örneği tamamen çöz, sonra genelle."),
  ];
  const kind = ["PROOF", "DERIVATION", "CODE", "DRAWING", "DIAGRAM"].includes(m.recommendedInteractionType)
    ? m.recommendedInteractionType
    : "PROBLEM_SOLVING";
  return [
    { kind, purpose: "MASTERY", prompt: L(`Demonstrate: ${m.learningObjective}`, `Göster: ${m.learningObjective}`), rubric: [L("Correct central idea", "Ana fikir doğru"), L("Each step justified", "Her adım gerekçeli"), L("Result checked", "Sonuç kontrol edilmiş")], hints, solution: L("Compare with your course material.", "Ders materyalinle karşılaştır.") },
    { kind, purpose: "MASTERY", prompt: L(`Demonstrate again on a different example: ${m.learningObjective}`, `Farklı bir örnekle yeniden göster: ${m.learningObjective}`), rubric: [L("Correct central idea", "Ana fikir doğru"), L("Each step justified", "Her adım gerekçeli"), L("Result checked", "Sonuç kontrol edilmiş")], hints, solution: L("Compare with your course material.", "Ders materyalinle karşılaştır.") },
    { kind: "EXPLANATION", purpose: "RETENTION", prompt: L(`Without notes, explain how to: ${m.learningObjective}`, `Notlara bakmadan nasıl yapılacağını açıkla: ${m.learningObjective}`), rubric: [L("Correct method", "Yöntem doğru"), L("Key conditions stated", "Temel koşullar belirtilmiş")], hints, solution: L("Check against your notes.", "Notlarınla karşılaştır.") },
    { kind, purpose: "TRANSFER", prompt: L(`Apply the same idea in an unfamiliar context: ${m.learningObjective}`, `Aynı fikri alışık olmadığın bir bağlamda uygula: ${m.learningObjective}`), rubric: [L("Context genuinely different", "Bağlam gerçekten farklı"), L("Idea applied correctly", "Fikir doğru uygulanmış")], hints, solution: L("A good answer shows the principle outside its usual setting.", "İyi bir cevap ilkeyi alışılmış ortamının dışında gösterir.") },
  ];
}
