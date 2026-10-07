/**
 * Turns graph objects into a personal course of micro-milestones (sections
 * 41–42). Order per object: entry question → each ability (objective) →
 * practice/derivation/proof as the evidence demands → transfer. Every
 * milestone is phrased as a new intellectual ability; "read", "watch" or
 * "study for N minutes" milestones are rejected by `milestoneQuality`.
 */
import type { CurriculumSpec, MilestoneSpec, QuestionSpec, UnitSpec } from "../engines/curriculumSpec";
import { topoSort } from "../engines/graph";
import { L, pick } from "../i18n";
import { prereqMap } from "./graph";
import { domainLabel, SCOPE_MILESTONES, type EvidenceType, type KnowledgeGraph, type LearningObject } from "./schema";

// JS `\b` ignores Turkish letters, so word starts are matched with (^|\s).
const BAD_PATTERNS: [RegExp, string, string][] = [
  [/^\s*(\S+\s+){0,3}(oku|okur|okumak)\s*\.?\s*$/i, "reading alone is not an ability", "yalnızca okumak bir yetenek değil"],
  [/(video|ders|belgesel|kanal)\S*\s+(\S+\s+){0,2}(izle|izler|izlemek)(\s|\.|$)/i, "watching videos is not an ability", "video izlemek bir yetenek değil"],
  [/(^|\s)\d+\s*(dk|dakika|saat)(\s|$).*(^|\s)(çalış|çalışır|çalışmak)(\s|\.|$)/i, "filling time is not an ability", "süre doldurmak bir yetenek değil"],
  [/(^|\s)(çalış|çalışır)\s*\.?\s*$/i, "\"study\" does not say what the learner can do", "\"çalış\" ne yapılabileceğini söylemiyor"],
  [/(^|\s)(anlar|bilir|kavrar|öğrenir)\s*\.?\s*$/i, "not an observable action", "gözlemlenebilir bir eylem değil"],
  [/^\s*(read|reads)\b[^.]{0,40}\.?\s*$/i, "reading alone is not an ability", "yalnızca okumak bir yetenek değil"],
  [/\b(watch|watches)\b.*\b(video|videos|lecture|lectures)\b/i, "watching videos is not an ability", "video izlemek bir yetenek değil"],
  [/\b(study|studies)\b.*\bfor\s+\d+\s*(min|minutes|hours?)\b|\b\d+\s*(min|minutes)\s+(of\s+)?study/i, "filling time is not an ability", "süre doldurmak bir yetenek değil"],
  [/\b(understands?|knows?|learns?|is familiar with)\b[^.]{0,30}\.?\s*$/i, "not an observable action", "gözlemlenebilir bir eylem değil"],
];

/** Section 42: does completing this milestone give a new intellectual ability? */
export function milestoneQuality(text: string): { ok: boolean; reason?: string } {
  for (const [re, en, tr] of BAD_PATTERNS) if (re.test(text)) return { ok: false, reason: L(en, tr) };
  if (text.trim().split(/\s+/).length < 3) return { ok: false, reason: L("too short; it is unclear what ability is gained", "çok kısa; hangi yeteneğin kazanıldığı belli değil") };
  return { ok: true };
}

const TYPE_FOR_EVIDENCE: Partial<Record<EvidenceType, string>> = {
  TURETME: "DERIVATION",
  ISPAT: "PROOF",
  DENEY: "EXPERIMENT",
  ARASTIRMA_UYGULAMASI: "PROJECT",
  MODELLEME: "APPLICATION",
  PROBLEM_COZME: "PROBLEM_SOLVING",
  KODLAMA: "APPLICATION",
  SIMULASYON: "APPLICATION",
  VERI_ANALIZI: "APPLICATION",
  HESAPLAMA: "PRACTICE",
  TRANSFER: "APPLICATION",
};

const INTERACTION_FOR_EVIDENCE: Partial<Record<EvidenceType, string>> = {
  TURETME: "DERIVATION",
  ISPAT: "PROOF",
  KODLAMA: "CODE",
  DIAGRAM: "DIAGRAM",
  TAHMIN: "PREDICTION",
  HESAPLAMA: "PROBLEM_SOLVING",
  PROBLEM_COZME: "PROBLEM_SOLVING",
  YORUMLAMA: "EXPLANATION",
};

const MINUTES: Record<string, number> = {
  CONCEPT: 15, PRACTICE: 20, APPLICATION: 30, DERIVATION: 35, PROOF: 40, PROBLEM_SOLVING: 30,
  EXPERIMENT: 60, PROJECT: 120, REVIEW: 10, CHALLENGE: 45, BOSS: 60,
};

const open = (prompt: string, rubric: string[], purpose: QuestionSpec["purpose"] = "MASTERY", kind = "EXPLANATION"): QuestionSpec => ({
  kind, purpose, prompt, rubric,
  hints: pick([
    "Write down separately what is given and what is asked.",
    "State the core idea of this object in one sentence; where does the question use it?",
    "Start from a prerequisite you know and try the next step.",
    "Solve a similar, simpler case first, then generalise.",
  ], [
    "Ne verildiğini ve ne istendiğini ayrı ayrı yaz.",
    "Bu nesnenin temel fikrini bir cümleyle söyle; soruda nerede kullanılıyor?",
    "Bildiğin bir önkoşul nesnesinden başla ve bir sonraki adımı dene.",
    "Benzer, daha basit bir durumu çöz, sonra genelleştir.",
  ]),
});

/** Splits one object into micro-milestone specs (section 41). */
export function objectMilestones(o: LearningObject, entryPrereqKeys: string[] = []): MilestoneSpec[] {
  const [min, max] = SCOPE_MILESTONES[o.estimatedScope];
  const evidence = o.evidenceTypes;
  const rubric = o.masteryCriteria.slice(0, 3);
  const key = (i: number) => `${o.id}#${i + 1}`;
  const base = { difficulty: o.difficulty, lo: [o.id], tags: [o.domain.toLowerCase(), ...o.tags.slice(0, 2)] };

  if (o.boss || o.milestoneType === "PROJE") {
    const type = o.boss ? "BOSS" : "PROJECT";
    return [{
      ...base, key: key(0), sourceKey: `lo:${key(0)}`, type, title: o.learningObjectives[0] ?? o.title, learningObjective: o.learningObjectives.join(" "),
      description: o.description, prerequisites: entryPrereqKeys, estimatedMinutes: MINUTES[type],
      masteryCriterion: o.masteryCriteria.join(" "), optional: o.optional,
      questions: [open(o.entryQuestions[0] ?? o.title, rubric), ...o.coreQuestions.slice(0, 2).map((q) => open(q, rubric))],
    }];
  }

  // Abilities: objectives, merged if there are more than the scope allows.
  let abilities = [...o.learningObjectives];
  const room = Math.max(1, max - (evidence.includes("TRANSFER") ? 1 : 0));
  while (abilities.length > room) {
    const merged = `${abilities[abilities.length - 2].replace(/\.$/, "")}; ${abilities[abilities.length - 1]}`;
    abilities = [...abilities.slice(0, -2), merged];
  }
  const out: MilestoneSpec[] = [];
  abilities.forEach((ability, i) => {
    const ev = evidence[Math.min(i, evidence.length - 1)];
    const type = i === 0 ? "CONCEPT" : TYPE_FOR_EVIDENCE[ev] ?? "PRACTICE";
    const questions: QuestionSpec[] = [];
    if (i === 0) questions.push(open(o.entryQuestions[0] ?? L(`${o.title}: predict first, then justify.`, `${o.title}: önce tahmin et, sonra gerekçelendir.`), pick(["Gives a prediction or an answer.", "Explains the reasoning."], ["Bir tahmin ya da yanıt veriyor.", "Gerekçesini açıklıyor."]), "PRACTICE", "PREDICTION"));
    const core = o.coreQuestions[i] ?? o.coreQuestions[0];
    questions.push(open(core ? `${core}\n\n${L("Goal", "Hedef")}: ${ability}` : L(`Show that you can do this: ${ability}`, `Şunu yaptığını göster: ${ability}`), rubric, "MASTERY", INTERACTION_FOR_EVIDENCE[ev] ?? "EXPLANATION"));
    out.push({
      ...base, key: key(i), sourceKey: `lo:${key(i)}`, type, title: ability, learningObjective: ability,
      description: i === 0 ? `${o.description} ${L("Why it matters", "Neden önemli")}: ${o.whyItMatters}` : o.description,
      prerequisites: i === 0 ? entryPrereqKeys : [key(i - 1)],
      estimatedMinutes: MINUTES[type] ?? 20, masteryCriterion: rubric[Math.min(i, rubric.length - 1)],
      interaction: INTERACTION_FOR_EVIDENCE[ev], optional: o.optional, questions,
    });
  });
  if (evidence.includes("TRANSFER") || out.length < min) {
    const i = out.length;
    out.push({
      ...base, key: key(i), sourceKey: `lo:${key(i)}`, type: "APPLICATION", title: L(`Transfer: uses "${o.title}" in a context not seen before`, `Transfer: "${o.title}" fikrini daha önce görmediği bir bağlamda kullanır`),
      learningObjective: L(`Uses ${o.title} correctly in a new situation and justifies why it fits.`, `${o.title} fikrini yeni bir durumda doğru kullanır ve neden uygun olduğunu gerekçelendirir.`),
      description: o.interdisciplinaryLinks.length ? `${L("Connection", "Bağlantı")}: ${o.interdisciplinaryLinks[0].relation}.` : o.description,
      prerequisites: [key(i - 1)], estimatedMinutes: MINUTES.APPLICATION, optional: o.optional,
      masteryCriterion: o.masteryCriteria.find((c) => c.startsWith("Transfer")) ?? L("Uses the idea correctly and with justification in a new context.", "Fikri yeni bir bağlamda doğru ve gerekçeli kullanır."),
      questions: [open(L(`Use "${o.title}" in an example from a different field${o.interdisciplinaryLinks[0] ? ` (hint: ${o.interdisciplinaryLinks[0].relation})` : ""}. Explain why it works.`, `"${o.title}" fikrini farklı bir alandan bir örnekte kullan${o.interdisciplinaryLinks[0] ? ` (ipucu: ${o.interdisciplinaryLinks[0].relation})` : ""}. Neden işe yaradığını açıkla.`), rubric, "TRANSFER")],
    });
  }
  return out;
}

/**
 * A course for the given objects. Objects are ordered by prerequisites; the
 * first milestone of each object depends on the last milestone of each
 * ZORUNLU prerequisite object that is also in the course.
 */
export function courseSpecFor(g: KnowledgeGraph, loIds: string[], title: string, goal: string): CurriculumSpec {
  const set = new Set(loIds.filter((id) => g.objects[id]));
  const order = topoSort(prereqMap(g), (id) => g.order.indexOf(id)).filter((id) => set.has(id));
  const lastKey = new Map<string, string>();
  const units = new Map<string, UnitSpec>();
  for (const id of order) {
    const o = g.objects[id];
    const entry = o.prerequisites.filter((p) => p.strength === "ZORUNLU" && lastKey.has(p.id)).map((p) => lastKey.get(p.id)!);
    const milestones = objectMilestones(o, entry);
    lastKey.set(id, milestones[milestones.length - 1].key);
    const unitTitle = `${domainLabel(o.domain)} — ${o.unit}`;
    if (!units.has(unitTitle)) units.set(unitTitle, { title: unitTitle, summary: o.field, topics: [] });
    units.get(unitTitle)!.topics.push({ key: id, title: o.title, concepts: [{ key: id, title: o.title, description: o.description }], milestones: milestones.map((m) => ({ ...m, conceptKeys: [id] })) });
  }
  return {
    title,
    goal,
    subject: order[0] ? domainLabel(g.objects[order[0]].domain) : L("General", "Genel"),
    description: L(`Built from the ${g.name} ${g.version} knowledge graph.`, `Lab Müfredatı ${g.version} bilgi grafiğinden oluşturuldu.`),
    units: [...units.values()],
  };
}
