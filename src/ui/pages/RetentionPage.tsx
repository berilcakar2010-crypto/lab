import { useState } from "react";
import type { ID, RetentionCheck } from "../../domain/types";
import { completeRetentionCheck, dueRetentionChecks, endSession } from "../../engines/progress";
import { ensureSession } from "../../engines/sessions";
import { rate } from "../../engines/statistics";
import { act, navigate, store, useDB } from "../state";
import { QuestionCard } from "../components/QuestionCard";
import { Empty, Icon } from "../components/common";
import { RateTile, pct } from "../components/Stats";
import { useActivityTracker } from "../activity";

const KIND_LABEL: Record<RetentionCheck["kind"], string> = { IMMEDIATE: "Immediate", DELAYED: "Delayed", TRANSFER: "Transfer" };
const DAY = 86_400_000;

export function RetentionPage() {
  const db = useDB();
  const [running, setRunning] = useState<ID[] | null>(null);
  const due = dueRetentionChecks(db).filter((r) => db.questions[r.questionId]);
  const upcoming = Object.values(db.retention).filter((r) => !r.completedAt && r.dueAt > Date.now() && db.milestones[r.milestoneId]).sort((a, b) => a.dueAt - b.dueAt);
  const done = Object.values(db.retention).filter((r) => r.completedAt).sort((a, b) => b.completedAt! - a.completedAt!);

  if (running) return <ReviewRunner queue={running} onDone={() => setRunning(null)} />;

  const of = (k: RetentionCheck["kind"]) => done.filter((r) => r.kind === k);
  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">Retention</span>
        <h1>Did it stick?</h1>
        <p className="small text-2">Doing something once is not the same as having learned it. Lab re-tests mastered milestones right away, again days later, and in new contexts (transfer).</p>
      </header>

      <section className="card stack">
        <div className="row between">
          <h2>Due now</h2>
          {due.length > 0 && <button className="btn primary" onClick={() => setRunning(due.map((d) => d.id))}>Start review ({due.length})</button>}
        </div>
        {due.length === 0 ? (
          <p className="small text-2">Nothing is due. {upcoming.length ? `Next check ${relative(upcoming[0].dueAt)}.` : "Checks are scheduled when you master milestones."}</p>
        ) : (
          <div className="list">
            {due.map((r) => (
              <div key={r.id} className="list-item small">
                <span className="chip">{KIND_LABEL[r.kind]}</span>
                <span className="grow">{db.milestones[r.milestoneId]?.title}</span>
                <span className="muted">{r.intervalDays ? `after ${r.intervalDays} d` : "right after mastery"}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="stack">
        <h2>Learned, not just done</h2>
        <div className="grid-2">
          <RateTile label="Immediate checks" r={rate(of("IMMEDIATE").filter((r) => r.correct).length, of("IMMEDIATE").length, 3)} />
          <RateTile label="Delayed retention" r={rate(of("DELAYED").filter((r) => r.correct).length, of("DELAYED").length, 3)} />
          <RateTile label="Transfer" r={rate(of("TRANSFER").filter((r) => r.correct).length, of("TRANSFER").length, 3)} />
        </div>
        <EnjoyedVsLearned />
      </section>

      {upcoming.length > 0 && (
        <section className="card stack">
          <h2>Coming up</h2>
          <div className="list">
            {upcoming.slice(0, 8).map((r) => (
              <div key={r.id} className="list-item small">
                <span className="chip">{KIND_LABEL[r.kind]}</span>
                <span className="grow">{db.milestones[r.milestoneId]?.title}</span>
                <span className="muted">{relative(r.dueAt)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {done.length > 0 && (
        <section className="card stack">
          <h2>History</h2>
          <div className="list">
            {done.slice(0, 12).map((r) => (
              <div key={r.id} className="list-item small">
                <span style={{ color: r.correct ? "var(--mastered)" : "var(--review)" }}>{r.correct ? "✓" : "↻"}</span>
                <span className="chip">{KIND_LABEL[r.kind]}</span>
                <span className="grow">{db.milestones[r.milestoneId]?.title ?? "(deleted milestone)"}</span>
                <span className="muted">{new Date(r.completedAt!).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/** Per milestone: did it feel engaging (completed, continued) vs did it stick (checks)? */
function EnjoyedVsLearned() {
  const db = useDB();
  const byMilestone = new Map<ID, RetentionCheck[]>();
  for (const r of Object.values(db.retention)) if (r.completedAt && r.kind !== "IMMEDIATE") (byMilestone.get(r.milestoneId) ?? byMilestone.set(r.milestoneId, []).get(r.milestoneId)!).push(r);
  if (!byMilestone.size) return <p className="small muted">After delayed or transfer checks, this shows which milestones felt engaging and which actually stuck.</p>;
  const continued = new Set(
    db.events.filter((e) => e.type === "CONTINUE_DECISION" && e.data.continued).map((e) => {
      const done = [...db.events].reverse().find((x) => x.type === "MILESTONE_COMPLETE" && x.sessionId === e.sessionId && x.at <= e.at);
      return done?.milestoneId;
    }),
  );
  return (
    <div className="card stack" style={{ gap: 6 }}>
      <div className="row small muted" style={{ gap: 10 }}><span className="grow">Milestone</span><span style={{ width: 90 }}>Engaged</span><span style={{ width: 70, textAlign: "right" }}>Stuck</span></div>
      {[...byMilestone.entries()].map(([id, rs]) => {
        const ok = rs.filter((r) => r.correct).length / rs.length;
        return (
          <div key={id} className="row small nowrap" style={{ gap: 10 }}>
            <span className="grow truncate">{db.milestones[id]?.title ?? "(deleted)"}</span>
            <span style={{ width: 90 }} className="text-2">{continued.has(id) ? "continued" : "stopped after"}</span>
            <span style={{ width: 70, textAlign: "right" }} className="mono">{pct(ok)} <span className="muted">({rs.length})</span></span>
          </div>
        );
      })}
    </div>
  );
}

function ReviewRunner({ queue, onDone }: { queue: ID[]; onDone: () => void }) {
  const db = useDB();
  const [index, setIndex] = useState(0);
  const [sessionId] = useState(() => {
    const first = store.state.retention[queue[0]];
    return act((d) => ensureSession(d, d.milestones[first.milestoneId]?.courseId).id);
  });
  const [answered, setAnswered] = useState(false);
  useActivityTracker(sessionId);
  const check = db.retention[queue[index]];
  const finish = () => {
    act((d) => endSession(d, sessionId, "COMPLETED"));
    onDone();
  };
  if (!check) return <Empty title="Review complete"><button className="btn" onClick={finish}>Done</button></Empty>;
  const q = db.questions[check.questionId];
  const m = db.milestones[check.milestoneId];
  const next = () => {
    setAnswered(false);
    if (index + 1 < queue.length) setIndex(index + 1);
    else finish();
  };
  return (
    <div className="stack-lg rise">
      <div className="row between nowrap">
        <button className="btn ghost small" onClick={finish}><Icon.back /> Retention</button>
        <span className="small muted">{index + 1} / {queue.length}</span>
      </div>
      <header className="stack" style={{ gap: 4 }}>
        <span className="eyebrow">{KIND_LABEL[check.kind]} check{check.kind === "TRANSFER" ? " · same idea, new situation" : ""}</span>
        <h2>{m?.title}</h2>
      </header>
      {q ? (
        <QuestionCard key={check.id} question={q} sessionId={sessionId} purposeOverride={check.kind === "TRANSFER" ? "TRANSFER" : "RETENTION"} hideHelp
          onRecorded={(attemptId) => { act((d) => completeRetentionCheck(d, check.id, d.attempts[attemptId])); setAnswered(true); }}
          onNext={next} onMastered={next} />
      ) : (
        <p className="text-2">This question was removed.</p>
      )}
      {answered && (
        <div className="row">
          {db.retention[check.id]?.correct === false && m && <button className="btn" onClick={() => navigate(`/session/${m.id}`)}>Review this milestone</button>}
          <button className="btn primary grow" onClick={next}>{index + 1 < queue.length ? "Next check" : "Finish"} <Icon.arrow /></button>
        </div>
      )}
    </div>
  );
}

function relative(t: number) {
  const d = Math.round((t - Date.now()) / DAY);
  return d <= 0 ? "today" : d === 1 ? "tomorrow" : `in ${d} days`;
}
