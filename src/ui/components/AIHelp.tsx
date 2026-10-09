import { useState } from "react";
import type { Feedback, Question } from "../../domain/types";
import { diagnoseMistake, evaluateOpenResponse, explainConcept, socraticReply, type ChatTurn, type OpenEvaluation as AIEvalResult } from "../../ai/tutor";
import { logEvent } from "../../engines/analytics";
import { act, aiHost, store, useDB } from "../state";
import { MathText } from "./MathText";
import { L } from "../../i18n";

export type { OpenEvaluation as AIEvalResult } from "../../ai/tutor";

/**
 * AI guidance that preserves productive struggle: guiding questions,
 * mistake diagnosis and concept explanations — never the final answer.
 * Works offline with deterministic fallbacks.
 */
export function AIHelp({ question: q, sessionId, answerText, attempts, lastFeedback }: {
  question: Question; sessionId: string; answerText: string; attempts: number; lastFeedback?: Feedback;
}) {
  const db = useDB();
  const online = db.preferences.aiProvider !== "local" && !!db.preferences.apiKeys[db.preferences.aiProvider as "gemini" | "groq"];
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState<ChatTurn[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ title: string; text: string; offline: boolean } | null>(null);

  const log = (role: string) => act((d) => logEvent(d, "HINT_REQUEST", { sessionId, milestoneId: q.milestoneId, questionId: q.id }, { source: "ai", role, attemptsBefore: attempts }));

  const ask = async (text?: string) => {
    setBusy(true);
    const history = text ? [...chat, { role: "student" as const, text }] : chat;
    if (text) setChat(history);
    setMsg("");
    log("SOCRATIC_GUIDE");
    const res = await socraticReply(aiHost, q, history, answerText, sessionId);
    setChat([...history, { role: "guide", text: res.value }]);
    setBusy(false);
  };

  const diagnose = async () => {
    if (!lastFeedback) return;
    setBusy(true);
    log("FEEDBACK_GENERATOR");
    const res = await diagnoseMistake(aiHost, q, answerText, lastFeedback, sessionId);
    setNote({ title: L("Why it might be wrong", "Neden yanlış olabilir?"), text: res.value, offline: res.fallbackUsed });
    setBusy(false);
  };

  const explain = async () => {
    setBusy(true);
    log("TUTOR");
    const res = await explainConcept(aiHost, store.state, q, sessionId);
    setNote({ title: L("The idea behind it", "Arkasındaki fikir"), text: res.value, offline: res.fallbackUsed });
    setBusy(false);
  };

  if (!open) {
    return (
      <button type="button" className="btn ghost small" style={{ alignSelf: "flex-start" }} onClick={() => setOpen(true)}>
        ✦ {L("Guide", "Rehber")}{online ? "" : L(" (offline)", " (çevrimdışı)")}
      </button>
    );
  }
  const wrong = lastFeedback && lastFeedback.correctness !== "CORRECT";
  return (
    <div className="card raised stack" style={{ gap: 10 }}>
      <div className="row between">
        <span className="eyebrow">{L("Guide", "Rehber")} · {online ? db.preferences.aiProvider : L("offline", "çevrimdışı")}</span>
        <button type="button" className="btn ghost small" onClick={() => setOpen(false)}>{L("Hide", "Gizle")}</button>
      </div>
      <p className="tiny muted">{L("The guide asks questions and explains ideas. It won't hand you the answer — that's your win to earn.", "Rehber soru sorar ve fikirleri açıklar. Cevabı eline vermez — o kazanım senin.")}</p>
      {chat.map((t, i) => (
        <div key={i} className="small" style={{ alignSelf: t.role === "student" ? "flex-end" : "flex-start", maxWidth: "88%", background: t.role === "student" ? "var(--accent-soft)" : "var(--raised-2)", borderRadius: 12, padding: "8px 12px" }}>
          <MathText text={t.text} />
        </div>
      ))}
      {note && (
        <div className="banner info small rise">
          <strong>{note.title}{note.offline ? L(" (offline)", " (çevrimdışı)") : ""}</strong>
          <MathText text={note.text} style={{ marginTop: 4 }} />
        </div>
      )}
      <div className="row" style={{ gap: 6 }}>
        <button type="button" className="btn small" disabled={busy} onClick={() => ask()}>{busy ? <span className="spinner" /> : L("Ask me a guiding question", "Bana yol gösteren bir soru sor")}</button>
        {wrong && <button type="button" className="btn small" disabled={busy} onClick={diagnose}>{L("Why was it wrong?", "Neden yanlıştı?")}</button>}
        {attempts > 0 && <button type="button" className="btn small" disabled={busy} onClick={explain}>{L("Explain the idea", "Fikri açıkla")}</button>}
      </div>
      {chat.length > 0 && (
        <form className="row nowrap" onSubmit={(e) => { e.preventDefault(); if (msg.trim()) ask(msg.trim()); }}>
          <input className="input" placeholder={L("Reply to the guide…", "Rehbere cevap yaz…")} value={msg} onChange={(e) => setMsg(e.target.value)} aria-label={L("Reply to the guide", "Rehbere cevap")} />
          <button className="btn small" disabled={busy || !msg.trim()}>{L("Send", "Gönder")}</button>
        </form>
      )}
    </div>
  );
}

/** AI evaluation of open answers; null means unavailable → self-assess. */
export async function evaluateOpenWithAI(q: Question, text: string, image: string | undefined, sessionId: string): Promise<AIEvalResult | null> {
  const res = await evaluateOpenResponse(aiHost, store.state, q, text, image, sessionId);
  return res.value;
}
