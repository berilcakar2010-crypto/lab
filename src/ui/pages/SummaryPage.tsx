import { useState } from "react";
import { reconstructSession } from "../../engines/analytics";
import { dueRetentionChecks } from "../../engines/progress";
import { reflectSession, reflectSessionAI } from "../../ai/tutor";
import { aiHost, navigate, store, useAsync, useDB } from "../state";
import { Bar, Empty, Icon } from "../components/common";
import { WhatNextPanel } from "../components/Adaptive";
import { getGraph } from "../../knowledge/graph";
import { buildProfile, evidenceFor } from "../../adaptive/mastery";
import { ERROR_LABEL } from "../../adaptive/errors";
import { addJournal } from "../../academic/records";
import { act } from "../state";
import { StatTile, pct } from "../components/Stats";
import { courseProgress } from "./CoursePage";
import { L } from "../../i18n";

/** Session end: what happened, what moved, what stuck — then back to "What's next?". */
export function SummaryPage({ sessionId }: { sessionId: string }) {
  const db = useDB();
  const s = db.sessions[sessionId];
  const [notes, setNotes] = useState<string[] | null>(null);
  const { busy, run } = useAsync();
  if (!s) return <Empty title={L("Session not found", "Oturum bulunamadı")}><a className="btn" href="#/">{L("Home", "Ana sayfa")}</a></Empty>;
  const r = reconstructSession(db, sessionId);
  const completed = r.visits.filter((v) => v.outcome === "COMPLETED");
  const courseId = s.courseId ?? r.visits.map((v) => db.milestones[v.milestoneId]?.courseId).find(Boolean);
  const p = courseId ? courseProgress(db, courseId) : null;
  const due = dueRetentionChecks(db).filter((c) => c.kind !== "IMMEDIATE");
  const reflection = notes ?? reflectSession(db, sessionId);
  const activeMin = Math.round((r.times?.activeMs ?? 0) / 60_000);

  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">{L("Session complete", "Oturum tamamlandı")}</span>
        <h1>{completed.length ? L(`${completed.length} milestone${completed.length > 1 ? "s" : ""} mastered`, `${completed.length} adımda ustalaştın`) : L("Session saved", "Oturum kaydedildi")}</h1>
        <p className="text-2">{activeMin ? L(`${activeMin} min of active work.`, `${activeMin} dk etkin çalışma.`) : L("A short session.", "Kısa bir oturum.")} {L("Progress is measured in what you can now do, not in minutes.", "İlerleme dakikayla değil, artık yapabildiklerinle ölçülür.")}</p>
      </header>

      {completed.length > 0 && (
        <div className="card stack" style={{ gap: 6 }}>
          {completed.map((v) => (
            <div key={v.milestoneId} className="row small nowrap"><span style={{ color: "var(--mastered)" }}>✓</span><span className="grow">{db.milestones[v.milestoneId]?.title ?? L("(deleted)", "(silindi)")}</span></div>
          ))}
        </div>
      )}

      <div className="grid-2">
        <StatTile label={L("Attempts", "Denemeler")} value={r.attempts} note={L(`${r.retries} retr${r.retries === 1 ? "y" : "ies"} after a miss`, `hatadan sonra ${r.retries} yeniden deneme`)} />
        <StatTile label={L("Correct", "Doğru")} value={r.attempts ? pct(r.correct / r.attempts) : null} needed={L("no attempts", "deneme yok")} note={r.attempts ? L(`${r.correct} of ${r.attempts}`, `${r.attempts} denemeden ${r.correct}`) : undefined} />
        <StatTile label={L("Help used", "Kullanılan yardım")} value={r.hints} note={r.aiInteractions ? L(`${r.aiInteractions} AI interactions`, `${r.aiInteractions} YZ etkileşimi`) : L("hint requests", "ipucu istekleri")} />
      </div>

      {p && (
        <div className="card stack" style={{ gap: 6 }}>
          <div className="row between small"><span className="text-2">{db.courses[courseId!]?.title}</span><span className="mono">{p.requiredMastered}/{p.requiredTotal}</span></div>
          <Bar value={p.requiredTotal ? p.requiredMastered / p.requiredTotal : 0} mastered />
        </div>
      )}

      <SessionStory sessionId={sessionId} />
      <Reflect sessionId={sessionId} />

      <section className="card stack" style={{ gap: 8 }}>
        <div className="row between">
          <h2>{L("Reflection", "Değerlendirme notları")}</h2>
          {db.preferences.aiProvider !== "local" && r.attempts > 0 && (
            <button className="btn ghost small" disabled={busy} onClick={() => run(async () => setNotes((await reflectSessionAI(aiHost, store.state, sessionId)).value))}>{busy ? <span className="spinner" /> : L("AI reflection", "YZ değerlendirmesi")}</button>
          )}
        </div>
        <ul className="small text-2" style={{ margin: 0, paddingLeft: 18 }}>{reflection.map((n, i) => <li key={i}>{n}</li>)}</ul>
      </section>

      {due.length > 0 && (
        <button className="banner warn row between" style={{ textAlign: "left", color: "inherit", font: "inherit", cursor: "pointer" }} onClick={() => navigate("/retention")}>
          <span>{L(`${due.length} retention check${due.length > 1 ? "s" : ""} due.`, `${due.length} kalıcılık kontrolü bekliyor.`)}</span><Icon.arrow />
        </button>
      )}

      {courseId && (
        <section className="stack">
          <h2>{L("What's next?", "Sırada ne var?")}</h2>
          <WhatNextPanel justCompletedMilestoneId={completed[completed.length - 1]?.milestoneId} sessionId={sessionId} />
        </section>
      )}
      <button className="btn" onClick={() => navigate("/")}>{L("Home", "Ana sayfa")}</button>
    </div>
  );
}

/** What was attempted, what was learned, what evidence was produced, what changed, what is still uncertain. */
function SessionStory({ sessionId }: { sessionId: string }) {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const s = db.sessions[sessionId];
  const atts = Object.values(db.attempts).filter((a) => a.sessionId === sessionId);
  if (!s || !atts.length) return null;
  const start = Math.min(...atts.map((a) => a.createdAt));
  const los = [...new Set(atts.flatMap((a) => db.milestones[a.milestoneId]?.learningObjectIds ?? []))].filter((id) => g.objects[id]);
  const changes = los.map((lo) => {
    const items = evidenceFor(db, lo);
    const before = buildProfile(db, lo, items.filter((e) => e.at < start)).verified;
    const after = buildProfile(db, lo, items).verified;
    return { lo, before, after, n: items.filter((e) => e.at >= start).length };
  }).filter((c) => c.n > 0);
  const errors = Object.values(db.errors).filter((e) => e.sessionId === sessionId && e.resolution !== "RESOLVED");
  const attempted = [...new Set(atts.map((a) => db.milestones[a.milestoneId]?.title).filter(Boolean))];
  return (
    <section className="card stack" style={{ gap: 8 }}>
      <h2>{L("What happened", "Ne oldu")}</h2>
      <div className="small"><strong>{L("Attempted: ", "Denendi: ")}</strong><span className="text-2">{attempted.join(" · ")}</span></div>
      <div className="small"><strong>{L("Evidence: ", "Kanıt: ")}</strong><span className="text-2">{L(`${atts.length} answers, ${atts.filter((a) => a.correct).length} correct, ${atts.filter((a) => a.correct && a.hintLevelUsed === 0).length} without hints`, `${atts.length} cevap, ${atts.filter((a) => a.correct).length} doğru, ${atts.filter((a) => a.correct && a.hintLevelUsed === 0).length} ipucusuz`)}</span></div>
      {changes.length > 0 && (
        <div className="stack" style={{ gap: 2 }}>
          <strong className="small">{L("What changed", "Ne değişti")}</strong>
          {changes.map((c) => <div key={c.lo} className="row nowrap small"><span className="grow truncate">{g.objects[c.lo].title}</span><span className="mono">{Math.round(c.before * 100)}% → {Math.round(c.after * 100)}%</span></div>)}
        </div>
      )}
      {errors.length > 0 && (
        <div className="small"><strong>{L("Still uncertain: ", "Hâlâ belirsiz: ")}</strong><span className="text-2">{[...new Set(errors.map((e) => `${ERROR_LABEL(e.category)}${e.trace?.repairLoId && g.objects[e.trace.repairLoId] ? ` (${g.objects[e.trace.repairLoId].title})` : ""}`))].join(" · ")}</span></div>
      )}
    </section>
  );
}

/** Two optional questions; answers go to the journal, linked to what was studied. */
function Reflect({ sessionId }: { sessionId: string }) {
  const db = useDB();
  const [clicked, setClicked] = useState("");
  const [unclear, setUnclear] = useState("");
  const done = Object.values(db.journal).some((j) => j.sessionId === sessionId && j.kind === "REFLECTION");
  const los = [...new Set(Object.values(db.attempts).filter((a) => a.sessionId === sessionId).flatMap((a) => db.milestones[a.milestoneId]?.learningObjectIds ?? []))];
  if (done) return <p className="small muted">{L("Reflection saved to your journal.", "Yansıtma günlüğüne kaydedildi.")}</p>;
  return (
    <details className="card">
      <summary className="small" style={{ cursor: "pointer" }}>{L("Two short questions (optional)", "İki kısa soru (isteğe bağlı)")}</summary>
      <div className="stack" style={{ gap: 8, marginTop: 8 }}>
        <label className="field"><span>{L("What clicked?", "Ne yerine oturdu?")}</span><input className="input" value={clicked} onChange={(e) => setClicked(e.target.value)} /></label>
        <label className="field"><span>{L("What still feels unclear?", "Hâlâ ne belirsiz geliyor?")}</span><input className="input" value={unclear} onChange={(e) => setUnclear(e.target.value)} /></label>
        <button className="btn small" style={{ alignSelf: "flex-start" }} disabled={!clicked.trim() && !unclear.trim()} onClick={() => act((d) => {
          if (clicked.trim()) addJournal(d, { kind: "REFLECTION", text: `${L("Clicked", "Oturdu")}: ${clicked.trim()}`, loIds: los, sessionId });
          if (unclear.trim()) addJournal(d, { kind: "CONFUSION", text: unclear.trim(), loIds: los, sessionId });
          if (!clicked.trim()) addJournal(d, { kind: "REFLECTION", text: L("(only an open question this time)", "(bu sefer yalnızca açık bir soru)"), loIds: los, sessionId });
        })}>{L("Save to journal", "Günlüğe kaydet")}</button>
      </div>
    </details>
  );
}
