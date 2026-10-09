/**
 * Research mode: known → open question → assumptions → model → prediction →
 * simulation/experiment → result → interpretation → limitations → next
 * question. The learner writes every step; Lab (and, if connected, an AI
 * research guide) only asks questions that push the thinking further and
 * never writes the steps for them. A model or simulation step can attach a
 * real sandbox run. A finished project can be turned into an explanation and
 * evaluated, which is how it counts as evidence.
 */
import type { ID, LabDB, Millis } from "../domain/types";
import { RESEARCH_STEPS, type ResearchProject, type ResearchStep } from "../domain/adaptive";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { getGraph } from "../knowledge/graph";
import { L, getLang } from "../i18n";
import { addExplanation } from "../study/actions";
import { runAI, parseJSON, type AIHost, type AIResult } from "../ai/engine";

export const STEP_LABEL = (s: ResearchStep): string =>
  ({
    KNOWN: L("What is known", "Bilinenler"),
    OPEN_QUESTION: L("Open question", "Açık soru"),
    ASSUMPTIONS: L("Assumptions", "Varsayımlar"),
    MODEL: L("Model", "Model"),
    PREDICTION: L("Prediction", "Tahmin"),
    SIMULATION: L("Simulation / experiment", "Simülasyon / deney"),
    RESULT: L("Result", "Sonuç"),
    INTERPRETATION: L("Interpretation", "Yorum"),
    LIMITATIONS: L("Limitations", "Sınırlılıklar"),
    NEXT_QUESTION: L("Next question", "Sonraki soru"),
  })[s];

/** Guiding questions per step — they prompt thinking, they never answer. */
export function stepPrompts(p: ResearchProject, step: ResearchStep, db?: LabDB): string[] {
  const g = db ? getGraph(db.knowledge) : null;
  const topic = p.loIds.map((id) => g?.objects[id]?.title).filter(Boolean)[0] ?? p.title;
  const q = p.steps.OPEN_QUESTION?.text || p.title;
  switch (step) {
    case "KNOWN": return [L(`What do you already know for sure about ${topic}? Which of it could you derive or show?`, `${topic} hakkında kesin bildiğin ne? Bunun hangisini türetebilir ya da gösterebilirsin?`)];
    case "OPEN_QUESTION": return [L("What exactly don't you know yet? Can it be answered with a model, a simulation or data?", "Tam olarak neyi henüz bilmiyorsun? Bir model, simülasyon ya da veriyle cevaplanabilir mi?")];
    case "ASSUMPTIONS": return [L(`To study "${q}", what will you simplify? What would change if an assumption were false?`, `"${q}" sorusunu çalışmak için neyi basitleştireceksin? Bir varsayım yanlış olsaydı ne değişirdi?`)];
    case "MODEL": return [L("Which quantities matter and how are they related? Write the equation or rule, even a rough one.", "Hangi nicelikler önemli ve nasıl ilişkili? Kaba da olsa denklemi ya da kuralı yaz."), L("Can the sandbox run it?", "Sandbox bunu çalıştırabilir mi?")];
    case "PREDICTION": return [L("Before running anything: what do you expect, and why?", "Bir şey çalıştırmadan önce: ne bekliyorsun ve neden?")];
    case "SIMULATION": return [L("Which parameter will you vary, over what range? What stays fixed?", "Hangi parametreyi hangi aralıkta değiştireceksin? Ne sabit kalacak?")];
    case "RESULT": return [L("What came out — numbers and shape, without explaining it yet?", "Ne çıktı — açıklamadan önce sayılar ve biçim?")];
    case "INTERPRETATION": return [L("Does it match your prediction? If not, which assumption or step explains the difference?", "Tahminine uyuyor mu? Uymuyorsa farkı hangi varsayım ya da adım açıklıyor?")];
    case "LIMITATIONS": return [L("Where would this model stop being true? What did you not measure?", "Bu model nerede geçerliliğini yitirir? Neyi ölçmedin?")];
    case "NEXT_QUESTION": return [L("What new question does this result raise?", "Bu sonuç hangi yeni soruyu doğuruyor?")];
  }
}

export function createResearch(db: LabDB, title: string, loIds: string[] = [], now: Millis = Date.now()): ResearchProject {
  const p: ResearchProject = { id: newId("res"), title: title.trim() || L("Untitled question", "Adsız soru"), loIds, steps: {}, status: "OPEN", createdAt: now, updatedAt: now };
  db.research[p.id] = p;
  return p;
}

/** Write a step. The first time a step gets text it counts as completed. */
export function setStep(db: LabDB, id: ID, step: ResearchStep, text: string, opts: { sandboxRunId?: ID; now?: Millis } = {}): ResearchProject | null {
  const p = db.research[id];
  if (!p) return null;
  const now = opts.now ?? Date.now();
  const prev = p.steps[step];
  const t = text.trim();
  p.steps[step] = { text: t, doneAt: t ? prev?.doneAt ?? now : undefined, sandboxRunId: opts.sandboxRunId ?? prev?.sandboxRunId };
  p.updatedAt = now;
  if (t && !prev?.doneAt) logEvent(db, "RESEARCH_STEP_COMPLETED", { at: now, loIds: p.loIds }, { researchId: id, step, index: RESEARCH_STEPS.indexOf(step) });
  if (opts.sandboxRunId && db.sandboxRuns[opts.sandboxRunId]) db.sandboxRuns[opts.sandboxRunId].researchId = id;
  p.status = RESEARCH_STEPS.every((s) => p.steps[s]?.doneAt) ? "DONE" : "OPEN";
  return p;
}

export const nextStep = (p: ResearchProject): ResearchStep | undefined => RESEARCH_STEPS.find((s) => !p.steps[s]?.doneAt);

export function researchMarkdown(db: LabDB, p: ResearchProject): string {
  const lines = [`# ${p.title}`, ""];
  for (const s of RESEARCH_STEPS) {
    const st = p.steps[s];
    lines.push(`## ${STEP_LABEL(s)}`, "", st?.text || "—", "");
    const run = st?.sandboxRunId ? db.sandboxRuns[st.sandboxRunId] : undefined;
    if (run) lines.push(`> Sandbox: ${run.title} — ${run.summary}`, "");
  }
  return lines.join("\n");
}

/** Hand the finished write-up in as an explanation, so it can be evaluated and count as evidence. */
export function researchAsExplanation(db: LabDB, id: ID): ID | null {
  const p = db.research[id];
  if (!p || p.status !== "DONE") return null;
  const e = addExplanation(db, { loId: p.loIds[0], prompt: L(`Research: ${p.title}`, `Araştırma: ${p.title}`), mode: "TEXT", text: researchMarkdown(db, p) });
  return e.id;
}

/** AI research guide: Socratic questions for one step, never the content of the step. */
export async function researchGuideAI(host: AIHost, p: ResearchProject, step: ResearchStep): Promise<AIResult<string[]>> {
  const db = host.db();
  return runAI(host, {
    role: "RESEARCH_GUIDE",
    system: [
      "You guide a student through an open research question step by step. Ask 1–3 short questions that help them think about the current step.",
      "Never write the step for them, never give the answer or the model, never invent results. Return JSON {\"questions\":[string]}.",
      getLang() === "tr" ? "Write in Turkish." : "Write in English.",
    ].join("\n"),
    prompt: JSON.stringify({ title: p.title, step, soFar: Object.fromEntries(RESEARCH_STEPS.filter((s) => p.steps[s]?.text).map((s) => [s, p.steps[s]!.text.slice(0, 600)])) }),
    parse: parseJSON((x) => {
      const qs = (x as { questions?: unknown }).questions;
      if (!Array.isArray(qs)) throw new Error("questions");
      const out = qs.map((q) => String(q).trim()).filter((q) => q.includes("?")).slice(0, 3);
      if (!out.length) throw new Error("no questions");
      return out;
    }),
    fallback: () => stepPrompts(p, step, db),
    summary: `research guide ${p.id} ${step}`,
  });
}

export interface ResearchReminder { researchId: ID; at: Millis; title: string; body: string }

/**
 * Opt-in reminders for open research left untouched for a week: at most two,
 * at the learner's reminder time, worded as an invitation (never guilt).
 */
export function researchReminders(db: LabDB, hour: number, minute: number, now: Millis = Date.now(), quietDays = 7): ResearchReminder[] {
  const slot = (t: Millis) => {
    const d = new Date(t);
    d.setHours(hour, minute, 0, 0);
    if (d.getTime() <= t) d.setDate(d.getDate() + 1);
    return d.getTime();
  };
  return Object.values(db.research)
    .filter((p) => p.status === "OPEN" && nextStep(p))
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 2)
    .map((p) => {
      const step = nextStep(p)!;
      return {
        researchId: p.id,
        at: slot(Math.max(now, p.updatedAt + quietDays * 86_400_000)),
        title: L("Your research question is waiting", "Araştırma sorun seni bekliyor"),
        body: L(`“${p.title}” — next: ${STEP_LABEL(step).toLowerCase()}. Whenever you like.`, `“${p.title}” — sıradaki: ${STEP_LABEL(step).toLocaleLowerCase("tr")}. Ne zaman istersen.`),
      };
    });
}
