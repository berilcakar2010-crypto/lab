import { useState } from "react";
import { reconstructSession } from "../../engines/analytics";
import { dueRetentionChecks } from "../../engines/progress";
import { reflectSession, reflectSessionAI } from "../../ai/tutor";
import { aiHost, navigate, store, useAsync, useDB } from "../state";
import { Bar, Empty, Icon } from "../components/common";
import { NextOptions } from "../components/NextOptions";
import { StatTile, pct } from "../components/Stats";
import { courseProgress } from "./CoursePage";

/** Session end: what happened, what moved, what stuck — then back to "What's next?". */
export function SummaryPage({ sessionId }: { sessionId: string }) {
  const db = useDB();
  const s = db.sessions[sessionId];
  const [notes, setNotes] = useState<string[] | null>(null);
  const { busy, run } = useAsync();
  if (!s) return <Empty title="Oturum bulunamadı"><a className="btn" href="#/">Ana sayfa</a></Empty>;
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
        <span className="eyebrow">Oturum tamamlandı</span>
        <h1>{completed.length ? `${completed.length} adımda ustalaştın` : "Oturum kaydedildi"}</h1>
        <p className="text-2">{activeMin ? `${activeMin} dk etkin çalışma.` : "Kısa bir oturum."} İlerleme dakikayla değil, artık yapabildiklerinle ölçülür.</p>
      </header>

      {completed.length > 0 && (
        <div className="card stack" style={{ gap: 6 }}>
          {completed.map((v) => (
            <div key={v.milestoneId} className="row small nowrap"><span style={{ color: "var(--mastered)" }}>✓</span><span className="grow">{db.milestones[v.milestoneId]?.title ?? "(silindi)"}</span></div>
          ))}
        </div>
      )}

      <div className="grid-2">
        <StatTile label="Denemeler" value={r.attempts} note={`hatadan sonra ${r.retries} yeniden deneme`} />
        <StatTile label="Doğru" value={r.attempts ? pct(r.correct / r.attempts) : null} needed="deneme yok" note={r.attempts ? `${r.attempts} denemeden ${r.correct}` : undefined} />
        <StatTile label="Kullanılan yardım" value={r.hints} note={r.aiInteractions ? `${r.aiInteractions} YZ etkileşimi` : "ipucu istekleri"} />
      </div>

      {p && (
        <div className="card stack" style={{ gap: 6 }}>
          <div className="row between small"><span className="text-2">{db.courses[courseId!]?.title}</span><span className="mono">{p.requiredMastered}/{p.requiredTotal}</span></div>
          <Bar value={p.requiredTotal ? p.requiredMastered / p.requiredTotal : 0} mastered />
        </div>
      )}

      <section className="card stack" style={{ gap: 8 }}>
        <div className="row between">
          <h2>Değerlendirme notları</h2>
          {db.preferences.aiProvider !== "local" && r.attempts > 0 && (
            <button className="btn ghost small" disabled={busy} onClick={() => run(async () => setNotes((await reflectSessionAI(aiHost, store.state, sessionId)).value))}>{busy ? <span className="spinner" /> : "YZ değerlendirmesi"}</button>
          )}
        </div>
        <ul className="small text-2" style={{ margin: 0, paddingLeft: 18 }}>{reflection.map((n, i) => <li key={i}>{n}</li>)}</ul>
      </section>

      {due.length > 0 && (
        <button className="banner warn row between" style={{ textAlign: "left", color: "inherit", font: "inherit", cursor: "pointer" }} onClick={() => navigate("/retention")}>
          <span>{due.length} kalıcılık kontrolü bekliyor.</span><Icon.arrow />
        </button>
      )}

      {courseId && (
        <section className="stack">
          <h2>Sırada ne var?</h2>
          <NextOptions courseId={courseId} justCompletedId={completed[completed.length - 1]?.milestoneId} onChoose={(id) => navigate(`/session/${id}`)} compact limit={3} />
        </section>
      )}
      <button className="btn" onClick={() => navigate("/")}>Ana sayfa</button>
    </div>
  );
}
