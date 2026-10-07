import { useState } from "react";
import { reconstructSession } from "../../engines/analytics";
import { dueRetentionChecks } from "../../engines/progress";
import { reflectSession, reflectSessionAI } from "../../ai/tutor";
import { aiHost, navigate, store, useAsync, useDB } from "../state";
import { Bar, Empty, Icon } from "../components/common";
import { NextOptions } from "../components/NextOptions";
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
          <NextOptions courseId={courseId} justCompletedId={completed[completed.length - 1]?.milestoneId} onChoose={(id) => navigate(`/session/${id}`)} compact limit={3} />
        </section>
      )}
      <button className="btn" onClick={() => navigate("/")}>{L("Home", "Ana sayfa")}</button>
    </div>
  );
}
