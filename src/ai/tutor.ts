/**
 * AI learning roles: Tutor, Socratic Guide, Evaluator, Hint Generator,
 * Feedback Generator, Difficulty Calibrator, Reflection Analyst and
 * Curriculum Advisor. Every role goes through `runAI` (same provider
 * abstraction) and has a deterministic fallback. Answers are guarded so
 * hints and guidance never leak the final result: productive struggle stays.
 */
import type { ErrorType, Feedback, HintLevel, ID, LabDB, Question } from "../domain/types";
import { HINT_LEVELS } from "../domain/types";
import { courseMilestones } from "../engines/curriculum";
import { attemptsFor } from "../engines/progress";
import { recentPerformance, recommendNext } from "../engines/progression";
import { evalNumber } from "../engines/expr";
import { parseJSON, runAI, type AIHost, type AIResult } from "./engine";

const STRUGGLE_RULES = `You preserve productive struggle: never state the final answer, the final number, or the complete solution unless explicitly told the student unlocked the full solution. Prefer questions that make the student think. Keep replies short (at most 4 sentences). Always write in Turkish (Türkçe).`;

const describeQuestion = (q: Question) =>
  `Question (${q.kind.toLowerCase()}): ${q.prompt}${q.choices ? `\nOptions: ${q.choices.map((c, i) => `${i + 1}) ${c}`).join("  ")}` : ""}`;

const secret = (q: Question) =>
  `Reference answer (CONFIDENTIAL — do not reveal): ${q.numeric ? `${q.numeric.value} ${q.numeric.unit ?? ""}` : q.acceptedExpressions?.[0] ?? (q.correctChoice !== undefined ? q.choices?.[q.correctChoice] : "") ?? ""}\nSolution (CONFIDENTIAL): ${q.solution}`;

// ---------------------------------------------------------------------------
// Answer-leak guard
// ---------------------------------------------------------------------------

/** True when `text` appears to give away the question's final answer. */
export function leaksAnswer(text: string, q: Question): boolean {
  const t = text.toLowerCase();
  if (q.numeric && Math.abs(q.numeric.value) > 1e-9) {
    const v = q.numeric.value;
    const nums = text.match(/-?\d+(?:[.,]\d+)?(?:e[-+]?\d+)?/gi) ?? [];
    for (const n of nums) {
      const x = evalNumber(n.replace(",", "."));
      if (x !== null && Math.abs(x - v) <= Math.max(Math.abs(v) * Math.max(q.numeric.tolerance, 0.01), 1e-9) && !isTrivial(x)) return true;
    }
  }
  if (q.correctChoice !== undefined && q.choices) {
    const c = q.choices[q.correctChoice].toLowerCase();
    if (c.length > 6 && t.includes(c)) return true;
    if (new RegExp(`\\b(option|answer|choice)\\s*\\(?${q.correctChoice + 1}\\b`).test(t)) return true;
  }
  for (const e of q.acceptedExpressions ?? []) {
    const compact = e.replace(/\s+/g, "").toLowerCase();
    if (compact.length > 3 && t.replace(/\s+/g, "").includes(compact)) return true;
  }
  return false;
}
const isTrivial = (x: number) => [0, 1, 2, 10, 100].includes(Math.abs(x));

// ---------------------------------------------------------------------------
// Hint generator
// ---------------------------------------------------------------------------

export function genericHints(q: Question): string[] {
  return [
    "Soruyu yeniden oku: tam olarak ne isteniyor, ne verilmiş?",
    "Verilenle istenen arasında hangi tanım, yasa ya da ilke köprü kuruyor?",
    "Hesaplamadan önce yolu planla: atacağın adımları sırayla yaz.",
    q.rubric.length ? `Tam bir cevap şunu içerir: ${q.rubric[0]}. Oradan başla.` : "Adım adım ilerle ve her adımı seçtiğin ilkeyle kontrol et.",
  ];
}

/** Fill missing hint levels 1–4 for a question (AI, guarded; generic fallback). */
export async function generateHints(host: AIHost, q: Question, sessionId?: ID): Promise<AIResult<string[]>> {
  return runAI(host, {
    role: "HINT_GENERATOR",
    summary: `Hints for ${q.prompt.slice(0, 60)}`,
    sessionId,
    milestoneId: q.milestoneId,
    system: `You are Lab's Hint Generator. ${STRUGGLE_RULES}
Write exactly 4 hints of increasing strength: 1) a small nudge, 2) a conceptual hint (which idea applies), 3) a strategic hint (the plan), 4) partial guidance (the first concrete step). None may contain the final answer.
Return ONLY {"hints":[string,string,string,string]}.`,
    prompt: `${describeQuestion(q)}\n${secret(q)}`,
    parse: parseJSON((x) => {
      const hints = (x as { hints?: unknown }).hints;
      if (!Array.isArray(hints) || hints.length < 4) throw new Error("Need 4 hints");
      const clean = hints.slice(0, 4).map(String);
      if (clean.some((h) => leaksAnswer(h, q))) throw new Error("A hint leaked the answer");
      return clean;
    }),
    fallback: () => genericHints(q),
  });
}

// ---------------------------------------------------------------------------
// Socratic guide + tutor
// ---------------------------------------------------------------------------

export interface ChatTurn {
  role: "student" | "guide";
  text: string;
}

const SOCRATIC_FALLBACK = [
  "Soru aslında ne istiyor — bir sayı mı, bir ilişki mi, bir gerekçe mi?",
  "Bu adımın hedefindeki hangi ilke verilenleri bilinmeyene bağlayabilir?",
  "Bildiklerini çizebilir ya da listeleyebilir misin? Hâlâ eksik olan ne?",
  "Daha basit bir durumu dene (küçük sayılar, tek boyut, özel bir açı). Orada ne oluyor?",
  "Son adımını kontrol et: hangi varsayıma dayanıyordu? O varsayım burada geçerli mi?",
];

export async function socraticReply(host: AIHost, q: Question, history: ChatTurn[], studentAnswer: string, sessionId?: ID): Promise<AIResult<string>> {
  const asked = history.filter((h) => h.role === "guide").length;
  return runAI(host, {
    role: "SOCRATIC_GUIDE",
    summary: "Socratic guidance",
    sessionId,
    milestoneId: q.milestoneId,
    json: true,
    system: `You are Lab's Socratic Guide. ${STRUGGLE_RULES} Respond with one or two guiding questions or a brief observation about the student's reasoning, never a solution. Return ONLY {"reply": string}.`,
    prompt: `${describeQuestion(q)}\n${secret(q)}\nStudent's current answer/work: ${studentAnswer || "(none yet)"}\nConversation so far:\n${history.map((h) => `${h.role}: ${h.text}`).join("\n") || "(start)"}`,
    parse: parseJSON((x) => {
      const reply = String((x as { reply?: unknown }).reply ?? "");
      if (!reply) throw new Error("Empty reply");
      if (leaksAnswer(reply, q)) throw new Error("Reply leaked the answer");
      return reply;
    }),
    fallback: () => SOCRATIC_FALLBACK[asked % SOCRATIC_FALLBACK.length],
  });
}

/** Tutor: explain the underlying idea (not the specific solution) after an attempt. */
export async function explainConcept(host: AIHost, db: LabDB, q: Question, sessionId?: ID): Promise<AIResult<string>> {
  const m = db.milestones[q.milestoneId];
  const concepts = m?.conceptIds.map((c) => db.concepts[c]).filter(Boolean) ?? [];
  return runAI(host, {
    role: "TUTOR",
    summary: `Explain concept for ${m?.title ?? "question"}`,
    sessionId,
    milestoneId: q.milestoneId,
    system: `You are Lab's Tutor. Explain the underlying concept clearly with one short example that is DIFFERENT from the student's question. ${STRUGGLE_RULES} Return ONLY {"explanation": string} (max 6 sentences).`,
    prompt: `Milestone objective: ${m?.learningObjective}\nConcepts: ${concepts.map((c) => `${c.title}: ${c.description}`).join("; ") || "n/a"}\n${describeQuestion(q)}\n${secret(q)}`,
    parse: parseJSON((x) => {
      const e = String((x as { explanation?: unknown }).explanation ?? "");
      if (!e) throw new Error("Empty");
      if (leaksAnswer(e, q)) throw new Error("Explanation leaked the answer");
      return e;
    }),
    fallback: () =>
      [
        m ? `Bu adımın arkasındaki fikir: ${m.learningObjective}` : "",
        ...concepts.map((c) => `${c.title} — ${c.description}`),
        q.hints[1] ? `Anahtar fikir: ${q.hints[1]}` : "",
      ].filter(Boolean).join("\n\n") || "Adımın hedefine ve üzerine kurulduğu ön koşula yeniden bak.",
  });
}

// ---------------------------------------------------------------------------
// Evaluator + feedback generator
// ---------------------------------------------------------------------------

const ERROR_TYPES: ErrorType[] = ["CONCEPTUAL", "PROCEDURAL", "CARELESS", "MISSING_PREREQUISITE", "INCOMPLETE_EXPLANATION"];

export interface OpenEvaluation {
  met: boolean[];
  feedback: Partial<Feedback> & { message: string };
}

/** Evaluate an open response against its rubric. Returns null when AI is unavailable (self-assess instead). */
export async function evaluateOpenResponse(
  host: AIHost, db: LabDB, q: Question, answer: string, image: string | undefined, sessionId?: ID,
): Promise<AIResult<OpenEvaluation | null>> {
  const m = db.milestones[q.milestoneId];
  const prereqs = m?.prerequisites.map((p) => db.milestones[p]?.title).filter(Boolean) ?? [];
  return runAI(host, {
    role: "EVALUATOR",
    summary: `Evaluate open answer (${q.kind})`,
    sessionId,
    milestoneId: q.milestoneId,
    images: image ? [image] : undefined,
    system: `You are Lab's Evaluator. Judge the student's answer strictly but fairly against each rubric point. Distinguish correctness from reasoning quality, and classify errors as CONCEPTUAL, PROCEDURAL, CARELESS, MISSING_PREREQUISITE or INCOMPLETE_EXPLANATION. Name a successful strategy if there is one. Do not rewrite the solution for them; point to what is missing. Write the message in Turkish.
Return ONLY {"met":[boolean per rubric point],"reasoningQuality":"STRONG|ADEQUATE|WEAK","errorTypes":[...],"successfulStrategy":string|null,"message":string (max 3 sentences),"missingPrerequisite":string|null}.`,
    prompt: `${describeQuestion(q)}\nRubric:\n${q.rubric.map((r, i) => `${i + 1}. ${r}`).join("\n")}\nReference solution: ${q.solution}\nPrerequisite milestones: ${prereqs.join("; ") || "none"}\nStudent's answer:\n${answer || "(see drawing)"}${image ? "\nThe student's drawing is attached." : ""}`,
    parse: parseJSON((x) => {
      const r = x as { met?: unknown[]; reasoningQuality?: string; errorTypes?: string[]; successfulStrategy?: string | null; message?: string; missingPrerequisite?: string | null };
      if (!Array.isArray(r.met) || r.met.length !== q.rubric.length) throw new Error("Rubric length mismatch");
      const rq = ["STRONG", "ADEQUATE", "WEAK"].includes(String(r.reasoningQuality)) ? (r.reasoningQuality as Feedback["reasoningQuality"]) : "UNKNOWN";
      const missingId = r.missingPrerequisite ? m?.prerequisites.find((p) => db.milestones[p]?.title === r.missingPrerequisite) : undefined;
      return {
        met: r.met.map(Boolean),
        feedback: {
          message: String(r.message ?? ""),
          reasoningQuality: rq,
          errorTypes: (r.errorTypes ?? []).filter((e): e is ErrorType => ERROR_TYPES.includes(e as ErrorType)),
          successfulStrategy: r.successfulStrategy || undefined,
          missingPrerequisiteIds: missingId ? [missingId] : undefined,
        },
      };
    }),
    fallback: () => null,
  });
}

/** Explain why an auto-graded answer was wrong, without giving the answer. */
export async function diagnoseMistake(host: AIHost, q: Question, studentAnswer: string, base: Feedback, sessionId?: ID): Promise<AIResult<string>> {
  return runAI(host, {
    role: "FEEDBACK_GENERATOR",
    summary: "Diagnose mistake",
    sessionId,
    milestoneId: q.milestoneId,
    system: `You are Lab's Feedback Generator. Infer the most likely misconception or slip behind the student's wrong answer and say what to re-check. ${STRUGGLE_RULES} Return ONLY {"diagnosis": string}.`,
    prompt: `${describeQuestion(q)}\n${secret(q)}\nStudent answered: ${studentAnswer}\nAutomatic check said: ${base.message} (${base.errorTypes.join(", ") || "unclassified"})`,
    parse: parseJSON((x) => {
      const d = String((x as { diagnosis?: unknown }).diagnosis ?? "");
      if (!d) throw new Error("Empty");
      if (leaksAnswer(d, q)) throw new Error("Diagnosis leaked the answer");
      return d;
    }),
    fallback: () => `${base.message} ${q.hints[0] ? `Başlamak için: ${q.hints[0]}` : "Uyguladığın ilkeyi ve her adımın işlemlerini yeniden kontrol et."}`,
  });
}

// ---------------------------------------------------------------------------
// Difficulty calibrator (deterministic signal + AI phrasing)
// ---------------------------------------------------------------------------

export interface DifficultySignal {
  suggested: number | null;
  rationale: string;
  sample: number;
}

/** Compare a milestone's rated difficulty with how attempts actually went. */
export function difficultySignal(db: LabDB, milestoneId: ID): DifficultySignal {
  const m = db.milestones[milestoneId];
  const atts = attemptsFor(db, milestoneId).filter((a) => a.correct !== null);
  if (atts.length < 4) return { suggested: null, rationale: "Zorluğu değerlendirmek için henüz yeterli deneme yok.", sample: atts.length };
  const firstTry = new Map<ID, boolean>();
  for (const a of atts) if (!firstTry.has(a.questionId)) firstTry.set(a.questionId, !!a.correct);
  const fta = [...firstTry.values()].filter(Boolean).length / firstTry.size;
  const hinted = atts.filter((a) => a.hintLevelUsed >= 3).length / atts.length;
  let suggested = m.difficulty;
  if (fta >= 0.85 && hinted < 0.1) suggested = Math.max(1, m.difficulty - 1);
  else if (fta <= 0.3 || hinted >= 0.5) suggested = Math.min(5, m.difficulty + 1);
  return {
    suggested: suggested !== m.difficulty ? suggested : null,
    rationale: `${firstTry.size} soruda ilk deneme doğruluğu %${Math.round(fta * 100)}; ${atts.length} denemenin %${Math.round(hinted * 100)}'inde güçlü ipucu kullanıldı.`,
    sample: atts.length,
  };
}

export async function calibrateDifficultyAI(host: AIHost, db: LabDB, milestoneId: ID): Promise<AIResult<DifficultySignal>> {
  const sig = difficultySignal(db, milestoneId);
  const m = db.milestones[milestoneId];
  if (sig.sample < 4) return { value: sig, provider: "local", fallbackUsed: true };
  return runAI(host, {
    role: "DIFFICULTY_CALIBRATOR",
    summary: `Calibrate ${m.title}`,
    milestoneId,
    system: `You are Lab's Difficulty Calibrator. Given rated difficulty and observed performance, suggest a difficulty from 1 to 5 and explain in one cautious sentence in Turkish (small samples are uncertain). Return ONLY {"difficulty": number, "rationale": string}.`,
    prompt: `Milestone: ${m.title} (rated ${m.difficulty}/5, type ${m.milestoneType}).\nObserved: ${sig.rationale}`,
    parse: parseJSON((x) => {
      const r = x as { difficulty?: number; rationale?: string };
      const d = Math.round(Number(r.difficulty));
      if (!(d >= 1 && d <= 5)) throw new Error("Bad difficulty");
      return { suggested: d !== m.difficulty ? d : null, rationale: String(r.rationale ?? sig.rationale), sample: sig.sample };
    }),
    fallback: () => sig,
  });
}

// ---------------------------------------------------------------------------
// Curriculum advisor
// ---------------------------------------------------------------------------

export interface Advice {
  text: string;
  milestoneId?: ID;
  action?: string;
  tone: "ready" | "review" | "gap" | "info";
}

/** Deterministic advice from the graph and performance. The user decides what to do. */
export function adviseCourse(db: LabDB, courseId: ID): Advice[] {
  const ms = courseMilestones(db, courseId);
  const recs = recommendNext(db, courseId).slice(0, 6);
  const perf = recentPerformance(db, courseId);
  const out: Advice[] = [];
  const seen = new Set<string>();
  const push = (a: Advice) => {
    const key = `${a.tone}:${a.milestoneId}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(a);
    }
  };

  for (const r of recs) {
    const m = db.milestones[r.milestoneId];
    for (const p of m.prerequisites) {
      const pm = db.milestones[p];
      if (pm?.status === "NEEDS_REVIEW") push({ tone: "review", milestoneId: p, action: "Tekrar et", text: `"${m.title}" adımından önce "${pm.title}" adımını tekrar etmek isteyebilirsin — bir kalıcılık kontrolü unutulmaya başladığını gösterdi.` });
    }
  }
  for (const m of ms) {
    const atts = attemptsFor(db, m.id).slice(-8);
    const wrong = atts.filter((a) => a.correct === false);
    if (!m.masteredAt && wrong.length >= 3) {
      const prereqGap = wrong.some((a) => a.feedback.errorTypes.includes("MISSING_PREREQUISITE") || a.feedback.errorTypes.includes("CONCEPTUAL"));
      const weakest = m.prerequisites.map((p) => db.milestones[p]).find((p) => p && (p.status === "SKIPPED" || p.status === "NEEDS_REVIEW" || (p.masteredAt && attemptsFor(db, p.id).length === 0)));
      if (weakest) {
        push({ tone: "gap", milestoneId: weakest.id, action: "Göz at", text: `"${m.title}" şimdiye kadar zorlayıcı oldu ve "${weakest.title}" üzerine kurulu${weakest.status === "SKIPPED" ? " (bu adımı atlamıştın)" : ""}. Ona dönmek yardımcı olabilir.` });
      } else if (prereqGap && m.prerequisites.length) {
        const p = db.milestones[m.prerequisites[0]];
        if (p) push({ tone: "gap", milestoneId: p.id, action: "Göz at", text: `"${m.title}" adımındaki birkaç hata kavramsal görünüyor. "${p.title}" adımına hızlıca dönmek yardımcı olabilir.` });
      }
    }
  }
  if (perf.accuracy !== null && perf.sample >= 6 && perf.accuracy >= 0.85) {
    const stretch = recs.find((r) => r.kind === "CHALLENGE" || r.kind === "BOSS");
    if (stretch) push({ tone: "ready", milestoneId: stretch.milestoneId, action: "Dene", text: `"${db.milestones[stretch.milestoneId].title}" için hazır görünüyorsun — son ${perf.sample} cevabının %${Math.round(perf.accuracy * 100)}'i doğruydu.` });
  }
  if (perf.accuracy !== null && perf.sample >= 6 && perf.accuracy < 0.45) {
    push({ tone: "info", text: `Son ${perf.sample} cevabının %${Math.round(perf.accuracy * 100)}'i doğru. Daha küçük adımlar ya da bir tekrar adımı sonraki oturumu kolaylaştırabilir.` });
  }
  return out.slice(0, 4);
}

export async function adviseCourseAI(host: AIHost, db: LabDB, courseId: ID): Promise<AIResult<Advice[]>> {
  const base = adviseCourse(db, courseId);
  const ms = courseMilestones(db, courseId);
  const titleToId = new Map(ms.map((m) => [m.title.toLowerCase(), m.id]));
  return runAI(host, {
    role: "CURRICULUM_ADVISOR",
    summary: "Course advice",
    system: `You are Lab's Curriculum Advisor. Suggest at most 3 next moves in Turkish using cautious language ("hazır görünüyorsun", "tekrar etmek isteyebilirsin"). You never change the curriculum; the student decides. Reference milestones by exact title. Return ONLY {"advice":[{"text":string,"milestoneTitle":string|null,"tone":"ready|review|gap|info"}]}.`,
    prompt: `Course: ${db.courses[courseId]?.title}\nMilestones (title — status — difficulty):\n${ms.map((m) => `${m.title} — ${m.status} — ${m.difficulty}`).join("\n")}\nRecent accuracy: ${recentPerformance(db, courseId).accuracy ?? "n/a"}\nRule-based observations: ${base.map((b) => b.text).join(" | ") || "none"}`,
    parse: parseJSON((x) => {
      const list = (x as { advice?: { text?: string; milestoneTitle?: string | null; tone?: string }[] }).advice;
      if (!Array.isArray(list)) throw new Error("No advice");
      return list.slice(0, 3).map((a) => {
        const id = a.milestoneTitle ? titleToId.get(a.milestoneTitle.toLowerCase()) : undefined;
        return { text: String(a.text ?? ""), milestoneId: id, action: id ? "Open" : undefined, tone: (["ready", "review", "gap", "info"].includes(String(a.tone)) ? a.tone : "info") as Advice["tone"] };
      }).filter((a) => a.text);
    }),
    fallback: () => base,
  });
}

// ---------------------------------------------------------------------------
// Reflection analyst
// ---------------------------------------------------------------------------

export function reflectSession(db: LabDB, sessionId: ID): string[] {
  const atts = Object.values(db.attempts).filter((a) => a.sessionId === sessionId);
  const notes: string[] = [];
  if (!atts.length) return ["Bu oturumda kayıtlı deneme yok."];
  const retries = atts.filter((a) => a.isRetry);
  const retrySuccess = retries.filter((a) => a.correct).length;
  if (retries.length) notes.push(`Bir hatadan sonra ${retries.length} kez yeniden denedin ve bunların ${retrySuccess} tanesini doğru yaptın — ${retrySuccess ? "sebat işe yaradı" : "sonuç henüz gelmese de emek ortada"}.`);
  const errs = atts.flatMap((a) => a.feedback.errorTypes);
  const top = mode(errs);
  if (top) notes.push(`En sık hata türü: ${ERROR_TR[top] ?? top}. Kısa bir tekrar en çok burada işe yarar.`);
  const hinted = atts.filter((a) => a.hintLevelUsed > 0);
  if (hinted.length) {
    const levels: number[] = hinted.map((a) => a.hintLevelUsed);
    notes.push(`${atts.length} denemenin ${hinted.length} tanesinde yardım kullandın (tipik düzey: ${HINT_TR[Math.round(levels.reduce((s, l) => s + l, 0) / levels.length)]}).`);
  } else notes.push("Bu oturumda ipucu kullanmadan çalıştın.");
  return notes;
}

const mode = <T,>(xs: T[]): T | undefined => {
  const c = new Map<T, number>();
  for (const x of xs) c.set(x, (c.get(x) ?? 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
};

export async function reflectSessionAI(host: AIHost, db: LabDB, sessionId: ID): Promise<AIResult<string[]>> {
  const base = reflectSession(db, sessionId);
  const atts = Object.values(db.attempts).filter((a) => a.sessionId === sessionId);
  if (!atts.length) return { value: base, provider: "local", fallbackUsed: true };
  return runAI(host, {
    role: "REFLECTION_ANALYST",
    summary: "Session reflection",
    sessionId,
    system: `You are Lab's Reflection Analyst. Write 2–3 short, specific, non-judgemental observations about this study session, in Turkish. Use cautious language; one session is not evidence of a trend. Never praise time spent. Return ONLY {"notes":[string]}.`,
    prompt: `Attempts: ${atts.length}; correct: ${atts.filter((a) => a.correct).length}; retries: ${atts.filter((a) => a.isRetry).length}; hint levels: ${atts.map((a) => a.hintLevelUsed).join(",")}; error types: ${atts.flatMap((a) => a.feedback.errorTypes).join(",") || "none"}; milestones: ${[...new Set(atts.map((a) => db.milestones[a.milestoneId]?.title))].join("; ")}.\nRule-based notes: ${base.join(" ")}`,
    parse: parseJSON((x) => {
      const n = (x as { notes?: unknown[] }).notes;
      if (!Array.isArray(n) || !n.length) throw new Error("No notes");
      return n.slice(0, 3).map(String);
    }),
    fallback: () => base,
  });
}

export const HINT_TR = ["yardımsız", "küçük ipucu", "kavramsal ipucu", "stratejik ipucu", "kısmi yönlendirme", "tam çözüm"];
const ERROR_TR: Record<string, string> = {
  CONCEPTUAL: "kavramsal yanılgı", PROCEDURAL: "işlem hatası", CARELESS: "dikkatsizlik", MISSING_PREREQUISITE: "eksik ön koşul", INCOMPLETE_EXPLANATION: "eksik açıklama",
};
export const hintLabel = (l: HintLevel) => HINT_TR[l] ?? HINT_LEVELS[l];
