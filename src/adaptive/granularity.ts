/**
 * Milestone granularity. A milestone is one independently assessable
 * capability: a single core cognitive skill that can be tested on its own,
 * produces evidence, has a measurable mastery criterion and connects
 * meaningfully to other milestones. "Learn probability" is too broad; "read
 * the definition of conditional probability" is too narrow; "given two
 * dependent events, calculate and explain conditional probability" is right.
 *
 * The validator classifies a milestone (or a generated draft) as VALID,
 * TOO_BROAD, TOO_NARROW, DUPLICATE, MISSING_PREREQUISITE or WEAK_EVIDENCE.
 * Generated curriculum must pass it — or be explicitly kept by the learner —
 * before it is added. Calibration compares estimated and actual effort from
 * the learner's own visits.
 */
import type { ID, LabDB, Milestone, Millis } from "../domain/types";
import type { Capability, CognitiveAction, GranularityResult, GranularityStatus } from "../domain/adaptive";
import type { CurriculumSpec } from "../engines/curriculumSpec";
import { milestoneQuestions } from "../engines/curriculum";
import { visitRows } from "../engines/statistics";
import { L } from "../i18n";

/** Verb stems (English and Turkish, matched at word start) for each cognitive action. */
const ACTIONS: [CognitiveAction, string[]][] = [
  ["DERIVE", ["derive", "türet"]],
  ["PROVE", ["prove", "kanıtla", "ispatla", "ispat et"]],
  ["CALCULATE", ["calculate", "compute", "solve", "find the", "determine", "hesapla", "çöz", "bul", "belirle"]],
  ["PREDICT", ["predict", "estimate", "forecast", "tahmin", "öngör"]],
  ["COMPARE", ["compare", "contrast", "distinguish", "karşılaştır", "ayırt et", "ayırt ed"]],
  ["ANALYZE", ["analyze", "analyse", "decompose", "break down", "analiz", "çözümle", "incele"]],
  ["MODEL", ["model", "simulate", "modelle", "simüle", "benzet"]],
  ["DESIGN", ["design", "plan an", "plan a", "tasarla", "planla"]],
  ["EVALUATE", ["evaluate", "assess", "judge", "critique", "değerlendir", "eleştir"]],
  ["INTERPRET", ["interpret", "yorumla", "okuyup yorum"]],
  ["APPLY", ["apply", "use ", "uygula", "kullan"]],
  ["EXPLAIN", ["explain", "describe", "justify", "açıkla", "betimle", "gerekçelendir", "anlat"]],
  ["CREATE", ["create", "build", "compose", "construct", "oluştur", "kur ", "kurar", "üret"]],
  ["RECALL", ["recall", "list", "name the", "state", "define", "hatırla", "listele", "tanımla", "say "]],
];

/** Only consumption, nothing a learner can be assessed on. */
const PASSIVE = ["read", "watch", "listen", "look at", "skim", "go through", "review the notes", "oku", "izle", "dinle", "göz at", "bak", "gözden geçir"];
const BROAD = ["learn ", "understand ", "master ", "everything", "all of", "the whole", "öğren", "anla", "tamamı", "hepsi", "bütün", "temellerini"];
const VAGUE_EVIDENCE = /\b(understands?|knows?|is familiar|feels comfortable|anlar|bilir|aşinadır|rahat hisseder)\b/i;
const MEASURABLE = /\d|\b(correct|unassisted|score|criteria|rubric|problems?|questions?|doğru|yardımsız|puan|ölçüt|problem|soru)\b/i;

const norm = (s: string) => ` ${s.toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}\s]+/gu, " ").replace(/\s+/g, " ").trim()} `;

/** Cognitive actions named in a sentence, in order of appearance. */
export function cognitiveActions(text: string): CognitiveAction[] {
  const t = norm(text);
  const found: { a: CognitiveAction; i: number }[] = [];
  // Reading a graph, plot or diagram is interpretation, not passive reading.
  const graphRead = /\b(read|oku)\w*\b.*\b(graph|plot|diagram|chart|grafi\w*|diyagram\w*)|\b(graph|plot|diagram|chart|grafi\w*|diyagram\w*)\b.*\b(read|oku)/u.exec(t);
  if (graphRead) found.push({ a: "INTERPRET", i: graphRead.index });
  for (const [a, stems] of ACTIONS) {
    let best = -1;
    for (const s of stems) {
      const i = t.indexOf(` ${s}`);
      if (i >= 0 && (best < 0 || i < best)) best = i;
    }
    if (best >= 0) found.push({ a, i: best });
  }
  return found.sort((x, y) => x.i - y.i).map((x) => x.a);
}

export interface GranularityInput {
  id?: string;
  title: string;
  objective: string;
  description?: string;
  assessmentMethod?: string;
  masteryEvidence?: string;
  questionCount: number;
  estimatedDuration: number;
  scope?: string;
  milestoneType?: string;
  prerequisites: string[];
}

export interface GranularityContext {
  /** Other milestones' capability sentences (id → text) for duplicate detection. */
  siblings: { id: string; text: string }[];
  /** Ids prerequisites may refer to. */
  knownIds: ReadonlySet<string>;
}

const tokens = (s: string) => new Set(norm(s).split(" ").filter((w) => w.length > 2));
export function similarity(a: string, b: string): number {
  const x = tokens(a), y = tokens(b);
  if (!x.size || !y.size) return 0;
  let inter = 0;
  for (const w of x) if (y.has(w)) inter++;
  return inter / (x.size + y.size - inter);
}

export function validateGranularity(m: GranularityInput, ctx: GranularityContext, now: Millis = Date.now()): GranularityResult {
  const status: GranularityStatus[] = [];
  const notes: string[] = [];
  const text = `${m.title}. ${m.objective}`;
  const t = norm(text);
  const actions = cognitiveActions(text);
  // "Explain" and "use/apply" accompany other skills; "evaluate" next to "calculate" is the same computation.
  const distinct = new Set(actions.filter((a) => a !== "EXPLAIN" && a !== "APPLY"));
  if (distinct.has("CALCULATE")) distinct.delete("EVALUATE");
  const project = m.scope === "PROJECT" || m.milestoneType === "PROJECT" || m.milestoneType === "BOSS";

  // Too broad: several independent skills, a whole subject, or far too long.
  const broadWord = BROAD.some((b) => t.includes(` ${b}`));
  const listParts = m.objective.split(/,|;| and | ve | ile /i).filter((p) => p.trim().length > 2).length;
  if (!project && (distinct.size >= 3 || (broadWord && actions.length === 0) || (listParts >= 4 && distinct.size >= 3) || m.estimatedDuration > 120)) {
    status.push("TOO_BROAD");
    notes.push(
      distinct.size >= 3
        ? L(`It asks for ${distinct.size} different skills (${[...distinct].join(", ").toLowerCase()}); split it so each can be assessed alone.`, `${distinct.size} farklı beceri istiyor (${[...distinct].join(", ").toLowerCase()}); her biri tek başına ölçülebilsin diye böl.`)
        : m.estimatedDuration > 120
          ? L(`About ${m.estimatedDuration} minutes is more than one capability.`, `Yaklaşık ${m.estimatedDuration} dakika tek bir yetenekten fazlası.`)
          : L("It names a whole area rather than one ability.", "Tek bir yetenek yerine koca bir alanı adlandırıyor."),
    );
  }

  // Too narrow: consumption only, or too small to assess.
  const passive = PASSIVE.some((p) => t.includes(` ${p}`)) && actions.length === 0;
  const words = norm(m.objective).trim().split(" ").filter(Boolean).length;
  if (passive || m.estimatedDuration < 3 || words < 3) {
    status.push("TOO_NARROW");
    notes.push(passive
      ? L("Reading or watching alone cannot be assessed; say what the learner can then do.", "Yalnızca okumak ya da izlemek ölçülemez; sonrasında ne yapabileceğini söyle.")
      : L("Too small to assess on its own.", "Tek başına ölçülemeyecek kadar küçük."));
  }

  // Duplicate: the same capability already exists.
  let duplicateOf: string | undefined;
  for (const s of ctx.siblings) {
    if (s.id === m.id) continue;
    if (similarity(m.objective, s.text) >= 0.8) {
      duplicateOf = s.id;
      status.push("DUPLICATE");
      notes.push(L("The same capability already exists.", "Aynı yetenek zaten var."));
      break;
    }
  }

  const missing = m.prerequisites.filter((p) => !ctx.knownIds.has(p));
  if (missing.length) {
    status.push("MISSING_PREREQUISITE");
    notes.push(L(`Prerequisite not found: ${missing.join(", ")}.`, `Bulunamayan önkoşul: ${missing.join(", ")}.`));
  }

  const evidence = `${m.masteryEvidence ?? ""} ${m.assessmentMethod ?? ""}`.trim();
  if ((!evidence && m.questionCount === 0) || (evidence && VAGUE_EVIDENCE.test(evidence) && !MEASURABLE.test(evidence) && m.questionCount === 0)) {
    status.push("WEAK_EVIDENCE");
    notes.push(L("It is unclear how mastery would be shown.", "Ustalığın nasıl gösterileceği belirsiz."));
  }

  return { status: status.length ? status : ["VALID"], notes, duplicateOf, checkedAt: now };
}

export const COGNITIVE_LABEL = (a: CognitiveAction): string =>
  ({
    RECALL: L("recall", "hatırlama"), EXPLAIN: L("explain", "açıklama"), CALCULATE: L("calculate", "hesaplama"), APPLY: L("apply", "uygulama"),
    ANALYZE: L("analyse", "analiz"), DERIVE: L("derive", "türetme"), PROVE: L("prove", "ispat"), PREDICT: L("predict", "tahmin"),
    COMPARE: L("compare", "karşılaştırma"), DESIGN: L("design", "tasarım"), MODEL: L("model", "modelleme"), EVALUATE: L("evaluate", "değerlendirme"),
    CREATE: L("create", "oluşturma"), INTERPRET: L("interpret", "yorumlama"),
  })[a];

export const isValid = (r: GranularityResult) => r.status.length === 1 && r.status[0] === "VALID";

export const GRANULARITY_LABEL = (s: GranularityStatus): string =>
  ({
    VALID: L("Valid", "Uygun"),
    TOO_BROAD: L("Too broad", "Çok geniş"),
    TOO_NARROW: L("Too narrow", "Çok dar"),
    DUPLICATE: L("Duplicate", "Kopya"),
    MISSING_PREREQUISITE: L("Missing prerequisite", "Eksik önkoşul"),
    WEAK_EVIDENCE: L("Weak evidence", "Zayıf kanıt"),
  })[s];

/** The capability a stored milestone builds, inferred from its objective, questions and criterion when not stated. */
export function capabilityOf(db: LabDB, m: Milestone): Capability {
  if (m.capability) return m.capability;
  const qs = milestoneQuestions(db, m.id);
  const kinds = [...new Set(qs.map((q) => q.kind.toLowerCase().replace(/_/g, " ")))];
  const c = m.masteryCriteria;
  return {
    capability: m.learningObjective || m.title,
    cognitiveAction: cognitiveActions(`${m.title}. ${m.learningObjective}`)[0] ?? "APPLY",
    assessmentMethod: qs.length ? L(`${qs.length} questions (${kinds.join(", ")})`, `${qs.length} soru (${kinds.join(", ")})`) : L("Self-assessment against the criterion", "Ölçüte göre öz değerlendirme"),
    masteryEvidence: L(`${c.requiredCorrect} correct answers, score ≥ ${Math.round(c.minScore * 100)}%${c.requireUnassisted ? ", without the full solution" : ""}`, `${c.requiredCorrect} doğru cevap, puan ≥ %${Math.round(c.minScore * 100)}${c.requireUnassisted ? ", tam çözüme bakmadan" : ""}`),
    estimatedEffort: m.estimatedDuration,
  };
}

/** Check one stored milestone against its course siblings and store the result on it. */
export function checkMilestone(db: LabDB, id: ID, now: Millis = Date.now()): GranularityResult | null {
  const m = db.milestones[id];
  if (!m) return null;
  const cap = capabilityOf(db, m);
  const siblings = Object.values(db.milestones).filter((x) => x.courseId === m.courseId && x.id !== m.id).map((x) => ({ id: x.id, text: x.learningObjective || x.title }));
  const r = validateGranularity({
    id: m.id, title: m.title, objective: m.learningObjective || m.title, description: m.description, assessmentMethod: cap.assessmentMethod,
    masteryEvidence: cap.masteryEvidence, questionCount: milestoneQuestions(db, m.id).length, estimatedDuration: m.estimatedDuration,
    scope: m.scope, milestoneType: m.milestoneType, prerequisites: m.prerequisites,
  }, { siblings, knownIds: new Set(Object.keys(db.milestones)) }, now);
  m.granularity = r;
  return r;
}

/** Validate every milestone of a curriculum draft (e.g. from the AI course builder) before it is added. */
export function validateSpec(spec: CurriculumSpec, now: Millis = Date.now()): { key: string; title: string; result: GranularityResult }[] {
  const all = spec.units.flatMap((u) => u.topics.flatMap((t) => t.milestones));
  const keys = new Set(all.map((m) => m.key));
  return all.map((m) => ({
    key: m.key,
    title: m.title,
    result: validateGranularity({
      id: m.key, title: m.title, objective: m.learningObjective || m.title, description: m.description, masteryEvidence: m.masteryCriterion,
      questionCount: m.questions?.length ?? 0, estimatedDuration: m.estimatedMinutes ?? 20, milestoneType: m.type, prerequisites: m.prerequisites ?? [],
    }, { siblings: all.map((x) => ({ id: x.key, text: x.learningObjective || x.title })), knownIds: keys }, now),
  }));
}

// ---------------------------------------------------------------------------
// Calibration from the learner's own visits
// ---------------------------------------------------------------------------

export interface GranularityCalibration {
  /** Actual active minutes per estimated minute (median), or null without data. */
  effortRatio: number | null;
  samples: number;
  /** Completion rate of short (≤15 min) vs long (>15 min) milestones, when known. */
  shortCompletion: number | null;
  longCompletion: number | null;
  /** Milestones that took much longer than estimated and were often abandoned: candidates to split. */
  splitCandidates: ID[];
  advice: string;
}

export function calibrateGranularity(db: LabDB): GranularityCalibration {
  const rows = visitRows(db).filter((r) => r.outcome !== "OPEN" && (r.estimatedDuration ?? 0) > 0);
  const ratios = rows.filter((r) => r.outcome === "COMPLETED" && r.activeMs > 0).map((r) => r.activeMs / 60_000 / r.estimatedDuration!).sort((a, b) => a - b);
  const effortRatio = ratios.length >= 3 ? ratios[Math.floor(ratios.length / 2)] : null;
  const rate = (xs: typeof rows) => (xs.length >= 5 ? xs.filter((r) => r.outcome === "COMPLETED").length / xs.length : null);
  const shortCompletion = rate(rows.filter((r) => r.estimatedDuration! <= 15));
  const longCompletion = rate(rows.filter((r) => r.estimatedDuration! > 15));
  const by = new Map<ID, typeof rows>();
  for (const r of rows) by.set(r.milestoneId, [...(by.get(r.milestoneId) ?? []), r]);
  const splitCandidates = [...by.entries()]
    .filter(([id, rs]) => db.milestones[id] && !db.milestones[id].masteredAt && rs.filter((r) => r.outcome === "ABANDONED").length >= 2 && rs.reduce((s, r) => s + r.activeMs, 0) / 60_000 > 1.5 * db.milestones[id].estimatedDuration)
    .map(([id]) => id);
  let advice = L("Not enough sessions yet to calibrate milestone size.", "Adım boyutunu ayarlamak için henüz yeterli oturum yok.");
  if (shortCompletion !== null && longCompletion !== null && shortCompletion - longCompletion >= 0.2)
    advice = L(`You completed ${Math.round(shortCompletion * 100)}% of short milestones and ${Math.round(longCompletion * 100)}% of long ones. This is an observation, not a cause — an experiment can test it.`, `Kısa adımların %${Math.round(shortCompletion * 100)}'ini, uzunların %${Math.round(longCompletion * 100)}'ini tamamladın. Bu bir gözlem, neden değil — bir deneyle sınanabilir.`);
  else if (effortRatio !== null)
    advice = L(`Milestones take you about ${effortRatio.toFixed(1)}× their estimate.`, `Adımlar sana tahminlerinin yaklaşık ${effortRatio.toFixed(1)} katı sürüyor.`);
  return { effortRatio, samples: rows.length, shortCompletion, longCompletion, splitCandidates, advice };
}
