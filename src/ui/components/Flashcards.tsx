import { Celebrate, CountUp } from "./Effects";
import { useMemo, useRef, useState } from "react";
import type { CardGrade, Flashcard, LabDB } from "../../domain/types";
import { fmtDate, L } from "../../i18n";
import { addAutoCards, addCards, cardStats, dueCards, exportAnki, exportCardsCSV, GRADE_LABELS, renderCloze, reviewCard, schedule } from "../../study/flashcards";
import { generateCardsAI } from "../../ai/studyAI";
import type { KnowledgeGraph } from "../../knowledge/schema";
import { aiHost, store, toast, useAsync } from "../state";
import { saveTextFile } from "../native";
import { MathText } from "./MathText";

const days = (d: number) => (d < 1 ? L("10 min", "10 dk") : d === 1 ? L("1 day", "1 gün") : d < 30 ? L(`${d} days`, `${d} gün`) : L(`${Math.round(d / 30)} mo`, `${Math.round(d / 30)} ay`));

/** One review session over a queue of cards: think → reveal → grade. */
export function ReviewSession({ cards, g, onDone }: { cards: Flashcard[]; g: KnowledgeGraph; onDone?: () => void }) {
  const [queue, setQueue] = useState(() => cards.map((c) => c.id));
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(0);
  const started = useRef(Date.now());
  const db = store.state;
  const card = db.flashcards[queue[0]];
  if (!card) {
    return (
      <div className="card stack" style={{ alignItems: "flex-start" }}>
        {done > 0 && <Celebrate />}
        <strong>{done ? L(`Done — ${done} reviews.`, `Bitti — ${done} tekrar.`) : L("Nothing is due right now.", "Şu an tekrar edilecek kart yok.")}</strong>
        <span className="small muted">{L("Cards come back when they are about to be forgotten.", "Kartlar unutulmak üzereyken geri gelir.")}</span>
        {onDone && <button className="btn small" onClick={onDone}>{L("Close", "Kapat")}</button>}
      </div>
    );
  }
  const grade = (gr: CardGrade) => {
    store.transact((d) => reviewCard(d, card.id, gr, Date.now() - started.current));
    setDone((n) => n + 1);
    setShown(false);
    started.current = Date.now();
    // "Again" goes to the back of this session's queue.
    setQueue((q) => (gr === 0 ? [...q.slice(1), q[0]] : q.slice(1)));
  };
  const front = card.kind === "CLOZE" ? renderCloze(card.front, false) : card.front;
  const back = card.kind === "CLOZE" ? renderCloze(card.front, true) + (card.back ? `\n\n${card.back}` : "") : card.back;
  const preview = ([0, 1, 2, 3] as CardGrade[]).map((gr) => schedule(card, gr).intervalDays);
  const labels = GRADE_LABELS();
  return (
    <div className="stack flashcard-review">
      <div className="row between small muted"><span>{L(`${queue.length} left`, `${queue.length} kaldı`)}</span>{card.loId && <span className="truncate">{g.objects[card.loId]?.title}</span>}</div>
      <button className="card flashcard" onClick={() => setShown(true)} aria-label={shown ? L("Answer shown", "Cevap gösteriliyor") : L("Show answer", "Cevabı göster")}>
        <div className="serif" style={{ fontSize: "1.15rem", whiteSpace: "pre-wrap" }}><MathText text={front} /></div>
        {shown ? (
          <div className="flashcard-back small text-2" style={{ whiteSpace: "pre-wrap" }}><MathText text={back} /></div>
        ) : (
          <span className="tiny muted">{L("Answer in your head (or out loud), then tap to check.", "Önce kafanda (ya da sesli) cevapla, sonra kontrol için dokun.")}</span>
        )}
      </button>
      {shown && (
        <div className="grade-row">
          {([0, 1, 2, 3] as CardGrade[]).map((gr) => (
            <button key={gr} className={`btn ${gr === 2 ? "primary" : ""} grade-${gr}`} onClick={() => grade(gr)}>
              <span>{labels[gr]}</span><span className="tiny muted">{days(preview[gr])}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Cards for one graph object: create (auto, AI, own), review, browse. */
export function ObjectFlashcards({ db, g, loId }: { db: LabDB; g: KnowledgeGraph; loId: string }) {
  const o = g.objects[loId];
  const cards = Object.values(db.flashcards).filter((c) => c.loId === loId).sort((a, b) => a.createdAt - b.createdAt);
  const stats = cardStats(db, Date.now(), loId);
  const [reviewing, setReviewing] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const { busy, run } = useAsync();
  const due = useMemo(() => dueCards(db, Date.now(), loId), [db, loId, stats.due]);

  if (reviewing) return <ReviewSession cards={due} g={g} onDone={() => setReviewing(false)} />;
  const auto = () => {
    const n = store.transact((d) => addAutoCards(d, g, loId));
    toast(n ? L(`${n} cards added.`, `${n} kart eklendi.`) : L("The automatic cards already exist.", "Otomatik kartlar zaten var."));
  };
  const ai = () => run(async () => {
    const res = await generateCardsAI(aiHost, o, g);
    const added = store.transact((d) => addCards(d, res.value, loId, res.fallbackUsed ? "AUTO" : "AI"));
    toast(res.fallbackUsed
      ? L(`AI unavailable — ${added.length} cards made from the graph instead.`, `YZ kullanılamadı — bunun yerine grafikten ${added.length} kart yapıldı.`)
      : L(`${added.length} AI cards added.`, `${added.length} YZ kartı eklendi.`));
  });
  const addOwn = () => {
    store.transact((d) => addCards(d, [{ front, back }], loId, "USER"));
    setFront("");
    setBack("");
    toast(L("Card added.", "Kart eklendi."));
  };
  return (
    <div className="stack">
      <div className="grid-3">
        <div className="card stat"><span className="eyebrow">{L("Cards", "Kart")}</span><span className="serif stat-n"><CountUp value={stats.total} /></span></div>
        <div className="card stat"><span className="eyebrow">{L("Due", "Sırada")}</span><span className="serif stat-n"><CountUp value={stats.due} /></span></div>
        <div className="card stat"><span className="eyebrow">{L("Learned", "Öğrenildi")}</span><span className="serif stat-n"><CountUp value={stats.learned} /></span></div>
      </div>
      <div className="row">
        <button className="btn primary" disabled={!stats.due} onClick={() => setReviewing(true)}>{L(`Review ${stats.due}`, `${stats.due} kartı tekrar et`)}</button>
        <button className="btn" onClick={auto}>{L("Make cards from the graph", "Grafikten kart yap")}</button>
        <button className="btn" onClick={ai} disabled={busy}>{busy ? <span className="spinner" /> : L("AI cards", "YZ kartları")}</button>
      </div>
      <details className="card">
        <summary className="small" style={{ cursor: "pointer" }}>{L("Write your own card", "Kendi kartını yaz")}</summary>
        <div className="stack" style={{ marginTop: 8 }}>
          <textarea className="textarea" style={{ minHeight: 60 }} value={front} onChange={(e) => setFront(e.target.value)}
            placeholder={L("Front — a question. For a cloze card write {{answer}} inside the sentence.", "Ön yüz — bir soru. Boşluk doldurma için cümlenin içine {{cevap}} yaz.")} aria-label={L("Front", "Ön yüz")} />
          <textarea className="textarea" style={{ minHeight: 60 }} value={back} onChange={(e) => setBack(e.target.value)} placeholder={L("Back — the answer", "Arka yüz — cevap")} aria-label={L("Back", "Arka yüz")} />
          <button className="btn small" style={{ alignSelf: "flex-start" }} disabled={!front.trim() || (!back.trim() && !/\{\{.+\}\}/.test(front))} onClick={addOwn}>{L("Add card", "Kartı ekle")}</button>
        </div>
      </details>
      {cards.length > 0 && (
        <details>
          <summary className="small muted" style={{ cursor: "pointer" }}>{L(`All cards (${cards.length})`, `Tüm kartlar (${cards.length})`)}</summary>
          <div className="list">
            {cards.map((c) => (
              <div key={c.id} className="list-item" style={{ alignItems: "flex-start" }}>
                <span className="grow small"><MathText text={c.kind === "CLOZE" ? renderCloze(c.front, true) : c.front} /><br /><span className="tiny muted">{c.source} · {L("next", "sonraki")} {fmtDate(c.due)} · {c.reps}×</span></span>
                <button className="btn small ghost" onClick={() => store.transact((d) => { d.flashcards[c.id].suspended = !c.suspended; })}>{c.suspended ? L("Resume", "Sürdür") : L("Pause", "Duraklat")}</button>
                <button className="btn small ghost" onClick={() => confirm(L("Delete this card?", "Bu kart silinsin mi?")) && store.transact((d) => { delete d.flashcards[c.id]; })}>×</button>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

export function exportCards(db: LabDB, g: KnowledgeGraph, kind: "anki" | "csv") {
  const cards = Object.values(db.flashcards);
  if (kind === "anki") void saveTextFile("lab-flashcards-anki.txt", exportAnki(cards, g), "text/plain");
  else void saveTextFile("lab-flashcards.csv", exportCardsCSV(cards), "text/csv");
}
