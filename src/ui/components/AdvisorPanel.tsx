import { useState } from "react";
import type { ID } from "../../domain/types";
import { adviseCourse, adviseCourseAI, type Advice } from "../../ai/tutor";
import { aiHost, navigate, store, useAsync, useDB } from "../state";
import { L } from "../../i18n";

const TONE: Record<Advice["tone"], string> = { ready: "ok", review: "warn", gap: "warn", info: "info" };

/** Curriculum Advisor: suggestions only — opening anything is the user's choice. */
export function AdvisorPanel({ courseId }: { courseId: ID }) {
  const db = useDB();
  const [aiAdvice, setAiAdvice] = useState<Advice[] | null>(null);
  const [offline, setOffline] = useState(false);
  const { busy, run } = useAsync();
  const advice = aiAdvice ?? adviseCourse(db, courseId);
  const online = db.preferences.aiProvider !== "local";

  const ask = () => run(async () => {
    const res = await adviseCourseAI(aiHost, store.state, courseId);
    setAiAdvice(res.value);
    setOffline(res.fallbackUsed);
  });

  if (!advice.length && !online) return null;
  return (
    <section className="stack" style={{ gap: 8 }}>
      <div className="row between">
        <span className="eyebrow">{L("Advisor", "Danışman")}{aiAdvice ? (offline ? L(" · offline", " · çevrimdışı") : ` · ${db.preferences.aiProvider}`) : ""}</span>
        {online && <button className="btn ghost small" onClick={ask} disabled={busy}>{busy ? <span className="spinner" /> : L("Ask the advisor", "Danışmana sor")}</button>}
      </div>
      {advice.length === 0 && <p className="small muted">{L("No suggestions right now.", "Şu an öneri yok.")}</p>}
      {advice.map((a, i) => (
        <div key={i} className={`banner ${TONE[a.tone]} row between nowrap`}>
          <span className="small">{a.text}</span>
          {a.milestoneId && db.milestones[a.milestoneId] && (
            <button className="btn small" onClick={() => navigate(`/session/${a.milestoneId}`)}>{a.action ?? L("Open", "Aç")}</button>
          )}
        </div>
      ))}
    </section>
  );
}
