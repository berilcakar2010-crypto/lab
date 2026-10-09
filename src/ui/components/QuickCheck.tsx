/**
 * "I know this" → a short check. Two or three items, no hints: questions Lab
 * grades itself first, then open questions judged by the AI evaluator (when
 * one is set up) or honestly against the criteria by the learner. Passing marks
 * the topic as known with evidence; failing only changes what Lab suggests.
 */
import { useMemo, useState } from "react";
import type { ID } from "../../domain/types";
import { L } from "../../i18n";
import { getGraph } from "../../knowledge/graph";
import { answerAutoItem, answerOpenItem, buildCheck, finishCheck, itemAsQuestion, PASS_SCORE, type CheckDraft, type CheckOutcome, type CheckTarget } from "../../adaptive/checks";
import { evaluateOpenResponse } from "../../ai/tutor";
import { AI_PROGRESS } from "../../ai/engine";
import { ensureSession } from "../../engines/sessions";
import type { Answer } from "../../engines/evaluation";
import { act, aiHost, store, toast, useDB } from "../state";
import { AnswerInput } from "./AnswerInput";
import { MathText } from "./MathText";
import { Icon, Sheet } from "./common";

const online = () => {
  const p = store.state.preferences;
  return p.aiProvider !== "local" && !!p.apiKeys[p.aiProvider as "gemini" | "groq"];
};

export function QuickCheck({ target, title, onClose, onDone }: { target: CheckTarget; title: string; onClose: () => void; onDone?: (o: CheckOutcome) => void }) {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const [draft, setDraft] = useState<CheckDraft | null>(() => {
    try {
      return buildCheck(store.state, g, target);
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
      return null;
    }
  });
  const [i, setI] = useState(0);
  const [value, setValue] = useState<Answer | null>(null);
  const [selfMet, setSelfMet] = useState<boolean[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);
  const sessionId = useMemo(() => {
    const mid = "milestoneId" in target ? target.milestoneId : undefined;
    return act((d) => ensureSession(d, mid ? d.milestones[mid]?.courseId : undefined)).id;
  }, []);

  if (!draft) return <Sheet title={title} onClose={onClose}><p className="text-2">{L("No check can be built for this yet.", "Bunun için henüz bir kontrol oluşturulamıyor.")}</p></Sheet>;
  const item = draft.items[i];
  const q = item?.questionId ? db.questions[item.questionId] : undefined;
  const refresh = () => setDraft({ ...draft, items: [...draft.items] });
  const next = () => {
    setValue(null);
    setSelfMet(null);
    if (i + 1 < draft.items.length) setI(i + 1);
    else {
      const o = act((d) => finishCheck(d, draft, sessionId));
      setOutcome(o);
      onDone?.(o);
    }
  };
  const text = value?.kind === "text" ? value.text : "";

  const submitAuto = () => {
    if (!value) return;
    act((d) => answerAutoItem(d, draft, i, value, sessionId, "touch"));
    refresh();
  };
  const submitOpen = async () => {
    if (online() && text.trim()) {
      setBusy(true);
      const res = await evaluateOpenResponse(aiHost, store.state, itemAsQuestion(item, "milestoneId" in target ? target.milestoneId : ""), text, undefined, sessionId);
      setBusy(false);
      if (res.value) {
        answerOpenItem(draft, i, text, res.value.credit, "ai", res.value).feedback = res.value.feedback.message || undefined;
        refresh();
        return;
      }
      toast(L("AI unavailable — check it against the criteria yourself.", "YZ kullanılamadı — ölçütlere göre kendin kontrol et."));
    }
    setSelfMet(item.rubric.map(() => false));
  };

  if (outcome) {
    const names = (ids: string[]) => ids.map((id) => g.objects[id]?.title ?? db.milestones[id as ID]?.title ?? id);
    const allPassed = !outcome.failed.length;
    return (
      <Sheet title={title} onClose={onClose}>
        <div className="stack rise" style={{ gap: 12 }}>
          <div className={`banner ${allPassed ? "ok" : "info"}`}>
            {allPassed
              ? L("Shown. It now counts as known — with evidence, not just a claim.", "Gösterildi. Artık bir beyan olarak değil, kanıtla biliniyor sayılıyor.")
              : L("Not yet — and that's useful to know. Nothing was taken away; this is where the next step makes sense.", "Henüz değil — ve bunu bilmek işe yarar. Hiçbir şey geri alınmadı; sonraki adım tam olarak burada anlamlı.")}
          </div>
          {outcome.passed.length > 0 && <span className="small"><span style={{ color: "var(--mastered)" }}>✓</span> {names(outcome.passed).join(", ")}</span>}
          {outcome.failed.length > 0 && <span className="small text-2">{L("Worth working on: ", "Üzerinde çalışmaya değer: ")}{names(outcome.failed).join(", ")}</span>}
          <span className="tiny muted">{L(`Score ${Math.round((outcome.checks.reduce((s, c) => s + c.score, 0) / Math.max(1, outcome.checks.length)) * 100)}% · pass mark ${Math.round(PASS_SCORE * 100)}%`, `Puan %${Math.round((outcome.checks.reduce((s, c) => s + c.score, 0) / Math.max(1, outcome.checks.length)) * 100)} · geçme sınırı %${Math.round(PASS_SCORE * 100)}`)}{outcome.checks.some((c) => c.gradedBy === "self") ? L(" · self-graded answers count for less evidence", " · kendi değerlendirdiğin cevaplar daha az kanıt sayılır") : ""}</span>
          <button className="btn primary" onClick={onClose}>{L("Done", "Tamam")}</button>
        </div>
      </Sheet>
    );
  }

  const answered = item.by !== "none";
  return (
    <Sheet title={title} onClose={onClose}>
      <div className="stack" style={{ gap: 12 }}>
        <div className="row between nowrap">
          <span className="eyebrow">{L("Short check", "Kısa kontrol")} · {i + 1}/{draft.items.length}</span>
          <span className="tiny muted">{L("No hints — show what you know", "İpucu yok — bildiğini göster")}</span>
        </div>
        <div className="row nowrap" style={{ gap: 4 }}>{draft.items.map((x, k) => <span key={k} style={{ flex: 1, height: 4, borderRadius: 9, background: k < i || (k === i && answered) ? (x.correct ? "var(--mastered)" : "var(--review)") : "var(--raised-2)" }} />)}</div>
        {item.loId && "loIds" in target && <span className="tiny muted">{g.objects[item.loId]?.title}</span>}
        <div className="serif" style={{ fontSize: "1.08rem" }}><MathText text={item.prompt} /></div>
        {item.kind === "auto" && q ? (
          <AnswerInput question={q} value={value} onChange={setValue} disabled={answered} onSubmit={submitAuto} />
        ) : (
          <textarea className="textarea" value={text} disabled={answered || !!selfMet} placeholder={L("Your answer, in your own words.", "Kendi cümlelerinle cevabın.")} aria-label={L("Answer", "Cevap")}
            onChange={(e) => setValue({ kind: "text", text: e.target.value })} />
        )}
        {selfMet && !answered && (
          <div className="card stack" style={{ gap: 6 }}>
            <span className="small">{L("Be honest: which of these does your answer really cover?", "Dürüst ol: cevabın bunlardan hangilerini gerçekten karşılıyor?")}</span>
            {item.rubric.map((r, k) => (
              <label key={k} className="row nowrap small" style={{ alignItems: "flex-start", gap: 8 }}>
                <input type="checkbox" checked={selfMet[k]} onChange={() => setSelfMet(selfMet.map((x, j) => (j === k ? !x : x)))} style={{ marginTop: 3 }} />
                <span>{r}</span>
              </label>
            ))}
            <button className="btn small primary" style={{ alignSelf: "flex-start" }} onClick={() => { answerOpenItem(draft, i, text, selfMet, "self"); refresh(); }}>{L("Record", "Kaydet")}</button>
          </div>
        )}
        {answered && (
          <div className={`banner ${item.correct ? "ok" : "warn"} small`}>
            {item.correct ? L("Correct.", "Doğru.") : item.kind === "auto" ? L("Not this time.", "Bu sefer değil.") : L(`Understanding shown: ${Math.round(item.score * 100)}%.`, `Gösterilen kavrayış: %${Math.round(item.score * 100)}.`)}
            {item.by === "ai" ? L(" (judged by AI)", " (YZ değerlendirdi)") : item.by === "self" ? L(" (your own judgement)", " (kendi değerlendirmen)") : ""}
            {item.feedback && <div style={{ marginTop: 4 }}>{item.feedback}</div>}
          </div>
        )}
        <div className="row" style={{ gap: 6 }}>
          {!answered && item.kind === "auto" && <button className="btn primary" disabled={!value} onClick={submitAuto}>{L("Check", "Kontrol et")}</button>}
          {!answered && item.kind === "open" && !selfMet && (
            <button className="btn primary" disabled={busy} onClick={submitOpen}>{busy ? <><span className="spinner" /> {AI_PROGRESS("EVALUATOR")}</> : online() ? L("Check my answer", "Cevabımı kontrol et") : L("Compare with the criteria", "Ölçütlerle karşılaştır")}</button>
          )}
          {!answered && <button className="btn ghost" onClick={() => { item.by === "none" && (item.kind === "open" ? answerOpenItem(draft, i, "", item.rubric.map(() => false), "self") : Object.assign(item, { correct: false, score: 0, by: "auto" })); refresh(); }}>{L("I don't know", "Bilmiyorum")}</button>}
          {answered && <button className="btn primary" onClick={next}>{i + 1 < draft.items.length ? L("Next", "Sonraki") : L("See the result", "Sonucu gör")} <Icon.arrow /></button>}
        </div>
      </div>
    </Sheet>
  );
}
