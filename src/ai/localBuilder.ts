/**
 * Offline curriculum builder. Used when no AI provider is configured or the
 * provider fails. It is deliberately honest: built-in packs carry real
 * content; anything else becomes a structured scaffold whose open questions
 * are self-assessed against a rubric.
 */
import type { CurriculumSpec, MilestoneSpec, TopicSpec, UnitSpec } from "../engines/curriculumSpec";
import type { SplitPart } from "../engines/curriculum";
import type { Milestone } from "../domain/types";
import { mechanicsPack } from "./packs/mechanics";
import { calculusPack } from "./packs/calculus";

const PACKS: { pack: CurriculumSpec; keywords: RegExp }[] = [
  { pack: mechanicsPack, keywords: /mechanic|mekanik|newton|kinemati|dynamics|dinamik|fizik olimpiyat|physics olympiad/i },
  { pack: calculusPack, keywords: /calculus|kalk[üu]l[üu]s|t[üu]rev|derivative|integral|analiz ?1|limit/i },
];

export function matchPack(text: string): CurriculumSpec | null {
  const hit = PACKS.find((p) => p.keywords.test(text));
  return hit ? structuredClone(hit.pack) : null;
}

export const builtInPacks = () => PACKS.map((p) => p.pack);

// ---------------------------------------------------------------------------
// Syllabus parsing
// ---------------------------------------------------------------------------

const UNIT_RE = /^(#{1,3}\s+|(unit|chapter|part|module|section|week|ünite|unite|bölüm|bolum|kısım|kisim|hafta|konu)\b\s*[\w.]*[:.)\-–]?\s*|[IVXLC]+[.)]\s+|\d+[.)]\s+)/i;
const TOPIC_RE = /^(\s{2,}|\t|[-*•·◦▪–]\s*|\d+\.\d+[.)]?\s+|[a-z][.)]\s+)/i;

export interface ParsedSyllabus {
  units: { title: string; topics: string[] }[];
}

export function parseSyllabus(text: string): ParsedSyllabus {
  const lines = text.split(/\r?\n/).map((l) => l.replace(/\s+$/, "")).filter((l) => l.trim().length > 1);
  const units: { title: string; topics: string[] }[] = [];
  const clean = (s: string) => s.replace(UNIT_RE, "").replace(TOPIC_RE, "").replace(/^[\s:.\-–]+|[\s:.\-–]+$/g, "").trim();

  for (const raw of lines) {
    const isTopic = TOPIC_RE.test(raw) && !/^\d+[.)]\s/.test(raw.trim());
    const trimmed = raw.trim();
    const colon = trimmed.match(/^(.*?):\s*(.+)$/);
    const headedList = !!colon && /[,;]/.test(colon[2]) && colon[1].length < 60;
    const isUnit =
      !isTopic &&
      (UNIT_RE.test(trimmed) || headedList || /:$/.test(trimmed) || (trimmed === trimmed.toUpperCase() && /[A-ZÇĞİÖŞÜ]{4}/.test(trimmed)));
    if (isUnit) {
      const head = colon ? colon[1] : trimmed;
      const tail = colon ? colon[2] : "";
      const headTitle = clean(head);
      if (!headTitle && tail) {
        // "Unit 1: Kinematics" → the tail is the title.
        units.push({ title: clean(tail), topics: [] });
      } else {
        // "Kinematics: velocity, acceleration" → unit with inline topics.
        const topics = tail ? tail.split(/[,;]/).map((t) => clean(t)).filter(Boolean) : [];
        units.push({ title: headTitle || trimmed, topics });
      }
    } else {
      const t = clean(trimmed);
      if (!t) continue;
      if (!units.length) units.push({ title: "", topics: [] });
      units[units.length - 1].topics.push(t);
    }
  }
  // A heading with no topics underneath becomes a topic of its own unit.
  for (const u of units) if (!u.topics.length && u.title) u.topics.push(u.title);
  const nonEmpty = units.filter((u) => u.topics.length);
  // Flat list with no headings: group into parts of ~4 topics.
  if (nonEmpty.length === 1 && !nonEmpty[0].title) {
    const all = nonEmpty[0].topics;
    const groups: { title: string; topics: string[] }[] = [];
    for (let i = 0; i < all.length; i += 4) groups.push({ title: `Part ${groups.length + 1}`, topics: all.slice(i, i + 4) });
    return { units: groups };
  }
  return { units: nonEmpty.map((u, i) => ({ ...u, title: u.title || `Part ${i + 1}` })) };
}

// ---------------------------------------------------------------------------
// Generic scaffold
// ---------------------------------------------------------------------------

const H = (topic: string): string[] => [
  `What is the single most important idea in "${topic}"? Try to state it in one sentence.`,
  `Which definitions or principles does "${topic}" rest on? Write them down first.`,
  `Plan before solving: what is given, what is asked, and which principle connects them?`,
  `Work one small example completely, then generalise. Compare with your source material.`,
];

function topicMilestones(topic: string, unitKey: string, ti: number, prevKey: string | null, firstTopicKey: string | null): MilestoneSpec[] {
  const k = `${unitKey}t${ti}`;
  const entry = ti === 0 ? (prevKey ? [prevKey] : []) : [firstTopicKey!];
  return [
    {
      key: `${k}c`, type: "CONCEPT", difficulty: 2, estimatedMinutes: 10, prerequisites: entry,
      title: `Explain the core idea of ${topic}`,
      learningObjective: `State the central idea of ${topic} precisely, give an example, and connect it to what you already know.`,
      interaction: "CONCEPT_EXPLANATION",
      masteryCriterion: "Your explanation meets every rubric point without looking at notes.",
      requiredCorrect: 1,
      questions: [
        { kind: "CONCEPT_EXPLANATION", purpose: "MASTERY", prompt: `Explain ${topic} as if teaching a classmate. Include a definition, one concrete example, and one common misconception.`,
          rubric: ["Accurate definition or statement of the central idea", "A concrete, correct example", "A plausible misconception and why it is wrong"], hints: H(topic),
          solution: `Compare your explanation with a trusted source on ${topic}. A complete answer defines it, illustrates it, and names a misconception.` },
        { kind: "EXPLANATION", purpose: "RETENTION", prompt: `Without notes: what is ${topic}, and when would you use it?`,
          rubric: ["Correct central idea", "Correct situation of use"], hints: H(topic), solution: `Check against your source on ${topic}.` },
      ],
    },
    {
      key: `${k}p`, type: "PRACTICE", difficulty: 3, estimatedMinutes: 20, prerequisites: [`${k}c`],
      title: `Solve a standard problem on ${topic}`,
      learningObjective: `Solve a typical ${topic} problem from your course material with every step justified.`,
      interaction: "PROBLEM_SOLVING",
      masteryCriterion: "Two different problems solved correctly with justified steps.",
      requiredCorrect: 2,
      questions: [1, 2].map((n) => ({
        kind: "PROBLEM_SOLVING", purpose: "MASTERY",
        prompt: `Choose standard exercise #${n} on ${topic} from your textbook or problem set (a different one each time). Write the problem, then solve it here, showing each step.`,
        rubric: ["Problem stated and the relevant principle identified", "Each step follows from the previous one", "Final answer checked (units, limiting case or substitution)"],
        hints: H(topic), solution: "Check your final answer against the textbook's answer key and compare methods.",
      })).concat([{
        kind: "PROBLEM_SOLVING", purpose: "TRANSFER",
        prompt: `Find or invent a problem where ${topic} appears in an unfamiliar context (another subject, or real life). Solve it.`,
        rubric: ["The context is genuinely different", `${topic} is applied correctly`, "The result is interpreted in context"], hints: H(topic),
        solution: "A good transfer answer shows the same principle working outside its usual setting.",
      }]),
    },
  ];
}

export function buildGenericSpec(title: string, parsed?: ParsedSyllabus): CurriculumSpec {
  const units: { title: string; topics: string[] }[] = parsed?.units.length
    ? parsed.units
    : [
        { title: `Foundations of ${title}`, topics: ["Key vocabulary and definitions", "Central principles"] },
        { title: `Core methods of ${title}`, topics: ["Standard techniques", "Typical problems"] },
        { title: `Applying ${title}`, topics: ["Connections and applications"] },
      ];
  let prevReview: string | null = null;
  const reviews: string[] = [];
  const unitSpecs: UnitSpec[] = units.map((u, ui) => {
    const uk = `u${ui}`;
    const topics: TopicSpec[] = [];
    let firstTopicKey: string | null = null;
    const lastKeys: string[] = [];
    u.topics.slice(0, 12).forEach((t, ti) => {
      const ms = topicMilestones(t, uk, ti, prevReview, firstTopicKey);
      if (ti === 0) firstTopicKey = ms[0].key;
      lastKeys.push(ms[ms.length - 1].key);
      topics.push({ title: t, milestones: ms });
    });
    const reviewKey = `${uk}rev`;
    topics.push({
      title: `${u.title} — review`,
      milestones: [
        {
          key: reviewKey, type: "REVIEW", difficulty: 2, estimatedMinutes: 15, prerequisites: lastKeys,
          title: `Review: connect the ideas of ${u.title}`,
          learningObjective: `Explain how the topics of ${u.title} relate to one another and choose the right one for a given problem.`,
          interaction: "COMPARISON", requiredCorrect: 1,
          questions: [{ kind: "COMPARISON", purpose: "MASTERY", prompt: `Compare the topics of ${u.title} (${u.topics.slice(0, 5).join(", ")}). For each, give one problem type it is the right tool for.`,
            rubric: ["Each topic matched to a suitable problem type", "At least one connection between topics explained"], hints: H(u.title), solution: "Check each match against your course material." }],
        },
        {
          key: `${uk}ch`, type: "CHALLENGE", difficulty: 4, estimatedMinutes: 40, optional: true, prerequisites: [reviewKey],
          title: `Challenge: a hard ${u.title} problem`,
          learningObjective: `Solve a demanding problem that combines several ideas from ${u.title}.`,
          interaction: "PROBLEM_SOLVING", requiredCorrect: 1,
          questions: [{ kind: "PROBLEM_SOLVING", purpose: "MASTERY", prompt: `Pick the hardest end-of-chapter or competition problem you can find on ${u.title} and solve it here.`,
            rubric: ["Combines at least two ideas", "Correct reasoning throughout", "Answer verified"], hints: H(u.title), solution: "Compare with the official solution if available." }],
        },
      ],
    });
    prevReview = reviewKey;
    reviews.push(reviewKey);
    return { title: u.title, summary: "", topics };
  });
  unitSpecs.push({
    title: "Synthesis",
    topics: [{
      title: "Boss",
      milestones: [{
        key: "boss", type: "BOSS", difficulty: 5, estimatedMinutes: 60, prerequisites: reviews,
        title: `Boss: an exam-level ${title} problem set`,
        learningObjective: `Solve unseen, exam-level problems that span the whole of ${title}.`,
        interaction: "PROBLEM_SOLVING", requiredCorrect: 2,
        questions: [1, 2].map((n) => ({ kind: "PROBLEM_SOLVING", purpose: "MASTERY",
          prompt: `Take past-exam problem #${n} covering several units of ${title}. Solve it under exam conditions, without notes.`,
          rubric: ["Correct approach chosen without prompting", "Complete, justified solution", "Within a realistic exam time"], hints: H(title),
          solution: "Grade yourself strictly against the official mark scheme." })),
      }],
    }],
  });
  return {
    title,
    goal: `Be able to solve unseen problems across ${title} with understanding, not memorisation.`,
    description: "Offline scaffold — connect Gemini or Groq in Settings for a content-aware curriculum with auto-graded questions.",
    units: unitSpecs,
  };
}

export function localBuildCurriculum(request: string, syllabus?: string): { spec: CurriculumSpec; note: string } {
  const pack = matchPack(`${request}\n${syllabus ?? ""}`);
  if (pack && !syllabus?.trim()) {
    return { spec: pack, note: "Built from Lab's offline knowledge pack (hand-written, auto-graded questions)." };
  }
  const title = request.trim() || "New course";
  if (syllabus?.trim()) {
    const parsed = parseSyllabus(syllabus);
    if (parsed.units.length) {
      return { spec: buildGenericSpec(title, parsed), note: `Structured from your syllabus (${parsed.units.length} units). Questions are rubric-based and self-assessed until an AI provider is connected.` };
    }
  }
  return { spec: buildGenericSpec(title), note: "Offline scaffold. Paste a syllabus or connect an AI provider for a content-aware curriculum." };
}

/** Offline split: concept → practice → application chain. */
export function localSplit(m: Milestone): SplitPart[] {
  const t = m.title.replace(/^(Explain|Solve|Apply|Understand)\s+/i, "");
  return [
    { title: `Understand: ${t}`, milestoneType: "CONCEPT", learningObjective: `Explain the idea behind ${t}.`, difficulty: Math.max(1, m.difficulty - 1) },
    { title: `Practise: ${t}`, milestoneType: "PRACTICE", learningObjective: `Solve standard problems on ${t}.`, difficulty: m.difficulty },
    { title: `Apply: ${t}`, milestoneType: "APPLICATION", learningObjective: `Use ${t} in an unfamiliar situation.`, difficulty: Math.min(5, m.difficulty + 1) },
  ];
}
