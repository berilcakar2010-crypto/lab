import { useState } from "react";
import type { LabDB } from "../../domain/types";
import { L } from "../../i18n";
import { askAboutObject } from "../../ai/studyAI";
import { appendChat, clearChat, threadFor } from "../../study/actions";
import type { KnowledgeGraph } from "../../knowledge/schema";
import { aiHost, store, useAsync } from "../state";
import { MathText } from "./MathText";

/** Ask questions about one graph object; the conversation is saved with the object. */
export function AskAI({ db, g, loId }: { db: LabDB; g: KnowledgeGraph; loId: string }) {
  const o = g.objects[loId];
  const thread = threadFor(db, loId);
  const [q, setQ] = useState("");
  const { busy, run } = useAsync();
  const provider = db.preferences.aiProvider;
  const ready = provider !== "local" && !!db.preferences.apiKeys[provider];
  const suggestions = [
    L(`Explain the logic of "${o.title}" step by step, with an example.`, `"${o.title}" konusunun mantığını adım adım, bir örnekle açıkla.`),
    o.entryQuestions[0] ? L(`Help me think about: ${o.entryQuestions[0]}`, `Şunu düşünmeme yardım et: ${o.entryQuestions[0]}`) : "",
    L("What is the most common mistake here, and why do people make it?", "Burada en sık yapılan hata ne ve neden yapılıyor?"),
    L("Give me a short problem to check my understanding (without the answer).", "Anladığımı sınamak için kısa bir problem ver (cevabını verme)."),
  ].filter(Boolean);

  const ask = (text: string) => run(async () => {
    const question = text.trim();
    if (!question) return;
    setQ("");
    store.transact((d) => appendChat(d, loId, o.title, [{ role: "user", text: question, at: Date.now() }]));
    const res = await askAboutObject(aiHost, o, g, question, thread?.messages ?? []);
    store.transact((d) => appendChat(d, loId, o.title, [{ role: "assistant", text: res.value, at: Date.now(), provider: res.provider }]));
  });

  return (
    <div className="stack">
      {!ready && <div className="banner warn small">{L("Offline: answers come from the knowledge graph only. Add a Gemini or Groq key in Settings for full explanations.", "Çevrimdışı: yanıtlar yalnızca bilgi grafiğinden gelir. Tam açıklamalar için Ayarlar'dan Gemini ya da Groq anahtarı ekle.")}</div>}
      <div className="chat">
        {(thread?.messages ?? []).map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <MathText text={m.text} />
            {m.role === "assistant" && m.provider && <span className="tiny muted">{m.provider}</span>}
          </div>
        ))}
        {busy && <div className="chat-msg assistant"><span className="spinner" /></div>}
        {!thread?.messages.length && !busy && (
          <div className="stack" style={{ gap: 6 }}>
            <span className="small muted">{L("Try one of these:", "Bunlardan birini dene:")}</span>
            {suggestions.map((s) => <button key={s} className="btn small ghost chat-suggest" onClick={() => ask(s)}>{s}</button>)}
          </div>
        )}
      </div>
      <div className="row nowrap">
        <textarea className="textarea grow" style={{ minHeight: 48 }} value={q} onChange={(e) => setQ(e.target.value)} aria-label={L("Your question", "Sorun")}
          placeholder={L("Ask anything about this topic…", "Bu konu hakkında ne istersen sor…")}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(q); } }} />
        <button className="btn primary" disabled={busy || !q.trim()} onClick={() => ask(q)}>{L("Ask", "Sor")}</button>
      </div>
      {thread && <button className="btn small ghost" style={{ alignSelf: "flex-start" }} onClick={() => confirm(L("Clear this conversation?", "Bu konuşma silinsin mi?")) && store.transact((d) => clearChat(d, thread.id))}>{L("Clear conversation", "Konuşmayı temizle")}</button>}
    </div>
  );
}
