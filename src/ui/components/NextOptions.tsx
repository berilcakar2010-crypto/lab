import { useEffect, useState } from "react";
import type { ID } from "../../domain/types";
import { recommendNext, topPicks, type Recommendation } from "../../engines/progression";
import { logEvent } from "../../engines/analytics";
import { act, useDB } from "../state";
import { Difficulty, Icon, KindChip, TYPE_LABEL, minutes } from "./common";
import { engagementLift } from "../../engines/statistics";
import { sessionConditions } from "../../engines/experiments";

/**
 * "What's next?" — ranked options with reasons. The user always chooses;
 * the full list is one tap away.
 */
export function NextOptions({
  courseId, justCompletedId, sessionId, onChoose, limit = 4, compact,
}: {
  courseId: ID;
  justCompletedId?: ID;
  sessionId?: ID;
  onChoose: (milestoneId: ID, rec: Recommendation) => void;
  limit?: number;
  compact?: boolean;
}) {
  const db = useDB();
  const [showAll, setShowAll] = useState(false);
  // The store mutates in place, so recompute on every render (cheap: one pass over the course).
  const cond = sessionConditions(db, sessionId);
  const recs = recommendNext(db, courseId, { justCompletedId, engagementLift: engagementLift(db), preferScope: cond.preferScope, difficultyOffset: cond.difficultyOffset });
  // Experiment condition "assigned": one suggestion up front; choosing differently stays one tap away.
  const assigned = cond.choiceMode === "assigned";
  const picks = topPicks(recs, assigned ? 1 : limit);
  const list = showAll ? recs : picks;

  // Raw record of what was offered, so choices can be analysed against offers.
  useEffect(() => {
    if (!picks.length) return;
    act((d) => logEvent(d, "RECOMMENDATION_SHOWN", { sessionId, courseId }, {
      after: justCompletedId,
      offered: picks.map((p, i) => ({ id: p.milestoneId, kind: p.kind, rank: i, score: p.score })),
    }));
  }, [courseId, justCompletedId]); // once per screen, not on every re-render

  if (!recs.length) {
    return <div className="card"><p className="text-2">Nothing is open right now. Every remaining milestone is locked or done — open the map to choose one anyway, or add new milestones.</p></div>;
  }

  const choose = (r: Recommendation, rank: number) => {
    act((d) => logEvent(d, "RECOMMENDATION_CHOSEN", { sessionId, milestoneId: r.milestoneId, courseId }, { kind: r.kind, rank, score: r.score, wasTopPick: rank === 0 }));
    onChoose(r.milestoneId, r);
  };

  return (
    <div className="stack" style={{ gap: 10 }}>
      {list.map((r, i) => {
        const m = db.milestones[r.milestoneId];
        if (!m) return null;
        return (
          <button key={r.milestoneId} className={`card clickable rise ${i === 0 && !showAll ? "accent" : ""}`} style={{ textAlign: "left", animationDelay: `${i * 40}ms`, color: "inherit", font: "inherit" }} onClick={() => choose(r, recs.indexOf(r))}>
            <div className="row between nowrap" style={{ marginBottom: 6 }}>
              <div className="row nowrap" style={{ gap: 8 }}><KindChip kind={r.kind} />{i === 0 && !showAll && <span className="tiny muted">suggested</span>}</div>
              <div className="row nowrap tiny muted" style={{ gap: 8 }}><Difficulty value={m.difficulty} /><span>{minutes(m.estimatedDuration)}</span></div>
            </div>
            <div className="serif" style={{ fontSize: "1.08rem", lineHeight: 1.3 }}>{m.title}</div>
            {!compact && <div className="small text-2" style={{ marginTop: 4 }}>{m.learningObjective}</div>}
            <div className="row tiny muted" style={{ marginTop: 8, gap: 6 }}>
              <span>{TYPE_LABEL[m.milestoneType]}</span>·<span>{r.reasons.slice(0, compact ? 1 : 2).join(" · ")}</span>
            </div>
          </button>
        );
      })}
      {recs.length > picks.length && (
        <button className="btn ghost small" onClick={() => setShowAll(!showAll)} style={{ alignSelf: "flex-start" }}>
          {showAll ? "Show suggestions only" : assigned ? "Choose differently" : `See all ${recs.length} open milestones`} <Icon.arrow />
        </button>
      )}
    </div>
  );
}
