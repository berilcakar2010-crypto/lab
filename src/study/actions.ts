/**
 * Mutations for notes, AI chats and explanations (run inside store.transact),
 * plus exports that turn everything the learner produced into portable files.
 */
import type { ChatMessage, ChatThread, Explanation, ExplanationEvaluation, ID, LabDB, StudyNote } from "../domain/types";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { fmtDate, L } from "../i18n";
import type { KnowledgeGraph } from "../knowledge/schema";

// Notes and personal mind-map branches -----------------------------------------

const note = (db: LabDB, loId: string): StudyNote => (db.notes[loId] ??= { id: loId, text: "", mapItems: [], updatedAt: Date.now() });

export function setNoteText(db: LabDB, loId: string, text: string): void {
  const n = note(db, loId);
  n.text = text;
  n.updatedAt = Date.now();
}

export function addMapItem(db: LabDB, loId: string, text: string): void {
  const n = note(db, loId);
  n.mapItems = [...n.mapItems, text.trim()].filter(Boolean).slice(-12);
  n.updatedAt = Date.now();
}

export function removeMapItem(db: LabDB, loId: string, index: number): void {
  const n = note(db, loId);
  n.mapItems = n.mapItems.filter((_, i) => i !== index);
  n.updatedAt = Date.now();
}

// AI chats ----------------------------------------------------------------------

export function threadFor(db: LabDB, loId: string): ChatThread | undefined {
  return Object.values(db.chats).filter((c) => c.loId === loId).sort((a, b) => b.updatedAt - a.updatedAt)[0];
}

export function appendChat(db: LabDB, loId: string, title: string, msgs: ChatMessage[]): ChatThread {
  let t = threadFor(db, loId);
  if (!t) {
    t = { id: newId("chat"), loId, title, messages: [], createdAt: Date.now(), updatedAt: Date.now() };
    db.chats[t.id] = t;
  }
  t.messages = [...t.messages, ...msgs].slice(-200);
  t.updatedAt = Date.now();
  logEvent(db, "AI_INTERACTION", {}, { role: "QA_ASSISTANT", lo: loId, messages: msgs.length });
  return t;
}

export function clearChat(db: LabDB, id: ID): void {
  delete db.chats[id];
}

// Explanations --------------------------------------------------------------------

export function addExplanation(db: LabDB, e: Omit<Explanation, "id" | "createdAt">): Explanation {
  const rec: Explanation = { ...e, id: newId("expl"), createdAt: Date.now() };
  db.explanations[rec.id] = rec;
  logEvent(db, "EXPLANATION", {}, { mode: e.mode, lo: e.loId ?? null, chars: (e.text ?? "").length, durationSec: e.durationSec ?? null });
  return rec;
}

/** Feynman dialogue: answer one follow-up question of an earlier explanation, in your own words. */
export function answerFollowUp(db: LabDB, parentId: ID, question: string, text: string): Explanation | null {
  const parent = db.explanations[parentId];
  if (!parent || !text.trim()) return null;
  return addExplanation(db, { loId: parent.loId, prompt: question, mode: "TEXT", text: text.trim(), followUpOf: parentId });
}

/** The explanation and its follow-up answers, oldest first. */
export function explanationThread(db: LabDB, rootId: ID): Explanation[] {
  const out: Explanation[] = [];
  const walk = (id: ID) => {
    const e = db.explanations[id];
    if (!e) return;
    out.push(e);
    for (const c of Object.values(db.explanations).filter((x) => x.followUpOf === id).sort((a, b) => a.createdAt - b.createdAt)) walk(c.id);
  };
  walk(rootId);
  return out;
}

export function setEvaluation(db: LabDB, id: ID, evaluation: ExplanationEvaluation, transcript?: string): void {
  const e = db.explanations[id];
  if (!e) return;
  e.evaluation = evaluation;
  if (transcript && !e.transcript) e.transcript = transcript;
  logEvent(db, "AI_INTERACTION", {}, { role: "EXPLANATION_EVALUATOR", lo: e.loId ?? null, score: evaluation.score, by: evaluation.by });
}

export function deleteExplanation(db: LabDB, id: ID): void {
  delete db.explanations[id];
}

// Exports ---------------------------------------------------------------------------

export function chatsMarkdown(db: LabDB, g: KnowledgeGraph): string {
  const threads = Object.values(db.chats).sort((a, b) => a.createdAt - b.createdAt);
  return threads.map((t) => [
    `# ${t.loId ? g.objects[t.loId]?.title ?? t.title : t.title}`,
    ...t.messages.map((m) => `**${m.role === "user" ? L("Me", "Ben") : "AI"}** (${fmtDate(m.at)}): ${m.text}`),
  ].join("\n\n")).join("\n\n---\n\n");
}

export function explanationsMarkdown(db: LabDB, g: KnowledgeGraph): string {
  return Object.values(db.explanations).sort((a, b) => a.createdAt - b.createdAt).map((e) => {
    const ev = e.evaluation;
    return [
      `# ${e.loId ? g.objects[e.loId]?.title ?? e.prompt : e.prompt} — ${fmtDate(e.createdAt)} (${e.mode})`,
      e.text ? `## ${L("Text", "Metin")}\n${e.text}` : "",
      e.transcript ? `## ${L("Transcript", "Döküm")}\n${e.transcript}` : "",
      e.mediaId ? `${L("Recording", "Kayıt")}: ${e.mediaId} (${e.mime ?? ""}, ${e.durationSec ?? "?"} s)` : "",
      ev ? `## ${L("Evaluation", "Değerlendirme")} (${ev.by === "ai" ? ev.provider : L("self", "kendi")}) — ${Math.round(ev.score * 100)}%\n${ev.feedback}\n${ev.criteria.map((c) => `- [${c.met ? "x" : " "}] ${c.criterion}${c.comment ? ` — ${c.comment}` : ""}`).join("\n")}` : "",
    ].filter(Boolean).join("\n\n");
  }).join("\n\n---\n\n");
}

/** Everything the learner produced with the study tools, as one JSON document. */
export function studyExport(db: LabDB): string {
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    flashcards: Object.values(db.flashcards),
    chats: Object.values(db.chats),
    explanations: Object.values(db.explanations),
    notes: Object.values(db.notes),
    topicReviews: Object.values(db.topicReviews),
    exams: Object.values(db.exams),
  }, null, 2);
}
