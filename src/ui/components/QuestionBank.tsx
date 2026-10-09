/**
 * The question bank: every question across courses with its state (new,
 * attempted, mastered, weak, due again), favourites, and exact variations for
 * transfer practice.
 */
import { useMemo, useState } from "react";
import { L, fmtDate } from "../../i18n";
import { getGraph } from "../../knowledge/graph";
import { QUESTION_STATE_LABEL, QUESTION_TYPE_LABEL, localVariant, questionBank, recycleCandidates, toggleFavorite, variantsOf, type QuestionState } from "../../adaptive/questionBank";
import { act, navigate, toast, useDB } from "../state";
import { Icon } from "./common";
import { MathText } from "./MathText";

const STATES: QuestionState[] = ["NEW", "ATTEMPTED", "WEAK", "MASTERED", "RETENTION"];
const CHIP: Record<QuestionState, string> = { NEW: "", ATTEMPTED: "s-ATTEMPTED", WEAK: "s-NEEDS_REVIEW", MASTERED: "s-MASTERED", RETENTION: "s-OPTIONAL" };

export function QuestionBankTab() {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const [state, setState] = useState<QuestionState | "">("");
  const [fav, setFav] = useState(false);
  const [text, setText] = useState("");
  const list = useMemo(() => questionBank(db, { state: state || undefined, favorite: fav, text }), [db.events.length, Object.keys(db.questions).length, state, fav, text, db]);
  const recycle = useMemo(() => recycleCandidates(db).length, [db.events.length]);
  return (
    <div className="stack" style={{ gap: 10 }}>
      <p className="small text-2">{L(`${Object.keys(db.questions).length} questions. A question you solved long ago is worth a variation, not the same item again${recycle ? ` (${recycle} ready).` : "."}`, `${Object.keys(db.questions).length} soru. Uzun zaman önce çözdüğün bir soru için aynı soru değil, bir varyasyonu daha değerlidir${recycle ? ` (${recycle} hazır).` : "."}`)}</p>
      <div className="row" style={{ gap: 6 }}>
        <input className="input grow" value={text} onChange={(e) => setText(e.target.value)} placeholder={L("Search questions…", "Sorularda ara…")} aria-label={L("Search", "Ara")} />
        <select className="input" style={{ width: "auto" }} value={state} onChange={(e) => setState(e.target.value as QuestionState | "")} aria-label={L("State", "Durum")}>
          <option value="">{L("All states", "Tüm durumlar")}</option>
          {STATES.map((s) => <option key={s} value={s}>{QUESTION_STATE_LABEL(s)}</option>)}
        </select>
        <button className={`btn small ${fav ? "primary" : ""}`} aria-pressed={fav} onClick={() => setFav(!fav)}>★ {L("Favourites", "Favoriler")}</button>
      </div>
      {!list.length && <p className="small muted">{L("No questions match.", "Eşleşen soru yok.")}</p>}
      {list.slice(0, 60).map((e) => {
        const q = e.question;
        const vs = variantsOf(db, q.id).length;
        return (
          <article key={q.id} className="card stack" style={{ gap: 6 }}>
            <div className="row between nowrap">
              <span className="row" style={{ gap: 6 }}><span className={`chip ${CHIP[e.state]}`}>{QUESTION_STATE_LABEL(e.state)}</span><span className="tiny muted">{QUESTION_TYPE_LABEL(q)} · {L("difficulty", "zorluk")} {q.difficulty}/5{q.variantOf ? L(" · variation", " · varyasyon") : ""}</span></span>
              <button className="btn small ghost" aria-pressed={!!q.favorite} aria-label={L("Favourite", "Favori")} onClick={() => act((d) => toggleFavorite(d, q.id))} style={{ color: q.favorite ? "var(--accent)" : undefined }}>★</button>
            </div>
            <div className="small" style={{ maxHeight: 96, overflow: "hidden" }}><MathText text={q.prompt} /></div>
            <div className="row" style={{ gap: 6 }}>
              <span className="tiny muted grow">{db.milestones[q.milestoneId]?.title}{e.loIds[0] && g.objects[e.loIds[0]] ? ` · ${g.objects[e.loIds[0]].title}` : ""}{e.attempts ? L(` · ${e.correct}/${e.attempts} correct · ${fmtDate(e.lastAt!)}`, ` · ${e.attempts} denemede ${e.correct} doğru · ${fmtDate(e.lastAt!)}`) : ""}{vs ? L(` · ${vs} variations`, ` · ${vs} varyasyon`) : ""}</span>
              {(q.simulation || q.graph) && <button className="btn small ghost" onClick={() => { const v = act((d) => localVariant(d, q.id)); toast(v ? L("Variation added — same skill, other numbers.", "Varyasyon eklendi — aynı beceri, başka sayılar.") : L("This question cannot be varied exactly.", "Bu soru tam olarak değiştirilemiyor.")); }}>{L("Make a variation", "Varyasyon üret")}</button>}
              <button className="btn small" onClick={() => navigate(`/session/${q.milestoneId}`)}>{L("Practise", "Çalış")} <Icon.arrow /></button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
