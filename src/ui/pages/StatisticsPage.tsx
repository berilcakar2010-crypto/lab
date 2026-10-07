import { useMemo, useState } from "react";
import { GROUP_LABEL, groupStats, overview, visitRows, type GroupKey } from "../../engines/statistics";
import { useDB } from "../state";
import { RateBars, RateTile, StatTile } from "../components/Stats";

const GROUPS: GroupKey[] = ["subject", "topic", "milestoneType", "interaction", "difficulty", "duration", "inputMethod", "stylus"];

const hm = (ms: number) => {
  const m = Math.round(ms / 60_000);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
};

export function StatisticsPage() {
  const db = useDB();
  const len = db.events.length;
  const o = useMemo(() => overview(db), [db, len]);
  const rows = useMemo(() => visitRows(db), [db, len]);
  const [by, setBy] = useState<GroupKey>("milestoneType");
  const [metric, setMetric] = useState<"completion" | "persistence" | "continuation" | "firstTry">("completion");
  const groups = useMemo(() => groupStats(db, rows, by), [db, rows, by]);

  if (!o.sessions) {
    return (
      <div className="stack-lg rise">
        <h1>Statistics</h1>
        <div className="card"><p className="text-2">Statistics appear after your first learning session. Everything here is computed from raw events, so nothing is estimated before there is data.</p></div>
      </div>
    );
  }

  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <h1>Statistics</h1>
        <p className="small text-2">Computed from {db.events.length} raw events. Percentages show the count, sample size and a likely range; nothing is shown until there are enough observations.</p>
      </header>

      <section className="stack">
        <h2>Progress</h2>
        <div className="grid-2">
          <StatTile label="Active learning time" value={hm(o.activeMs)} note={`${o.sessions} session${o.sessions === 1 ? "" : "s"} · idle and hidden time excluded`} />
          <StatTile label="Milestones completed" value={o.milestonesCompleted} note={o.selfAttested ? `${o.selfAttested} self-attested` : "all with evidence"} />
          <StatTile label="Milestones per active hour" value={o.milestonesPerHour.value === null ? null : o.milestonesPerHour.value.toFixed(1)} needed="needs 30 min of active time" />
          <StatTile label="Average milestone duration" value={o.avgMilestoneMinutes.value === null ? null : `${Math.round(o.avgMilestoneMinutes.value)} min`} needed={`${o.avgMilestoneMinutes.n} of 5 completions`} note="active time, from open to mastery" />
          <RateTile label="Completion rate" r={o.completion} note="completed vs. abandoned visits" />
          <RateTile label="Abandonment rate" r={o.abandonment} />
          <RateTile label="Retry rate" r={o.retry} note="attempts that were retries" />
          <RateTile label="Persistence after failure" r={o.persistence} note="tried again after a mistake" />
          <RateTile label="Continuation rate" r={o.continuation} note="chose another milestone after finishing one" />
        </div>
      </section>

      <section className="stack">
        <h2>Engagement</h2>
        <div className="grid-2">
          <StatTile label="Engagement index" value={o.engagement === null ? null : o.engagement.toFixed(2)} needed="needs completion, persistence or continuation data"
            note="mean of completion, persistence and continuation rates (0–1)" />
          <StatTile label="Longest high-engagement session" value={o.longestHighEngagement ? hm(o.longestHighEngagement.activeMs) : null}
            needed="no qualifying session yet" note={o.longestHighEngagement ? `${o.longestHighEngagement.completions} milestones, continued when asked` : undefined} />
        </div>
        <div className="card stack">
          <div className="row" style={{ gap: 6 }}>
            {GROUPS.map((g) => (
              <button key={g} className="btn small" aria-pressed={by === g} onClick={() => setBy(g)} style={by === g ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : undefined}>{GROUP_LABEL[g]}</button>
            ))}
          </div>
          <div className="tabs">
            {(["completion", "persistence", "continuation", "firstTry"] as const).map((m) => (
              <button key={m} className={metric === m ? "on" : ""} onClick={() => setMetric(m)}>{m === "firstTry" ? "First try" : m[0].toUpperCase() + m.slice(1)}</button>
            ))}
          </div>
          <RateBars rows={groups.map((g) => ({ label: g.group, r: g[metric] }))} empty="No visits recorded for this grouping yet." />
          <p className="tiny muted">Engagement by {GROUP_LABEL[by].toLowerCase()}. Bars appear once a group has 5 observations; the pale band is the likely range.</p>
        </div>
      </section>

      <section className="stack">
        <h2>Learning</h2>
        <div className="banner warn small">Engagement is not evidence of learning. These measures are kept separate on purpose: accuracy right now, mastery, retention days later, and transfer to new situations.</div>
        <div className="grid-2">
          <RateTile label="Immediate accuracy" r={o.immediateAccuracy} note="first attempts" />
          <StatTile label="Mastery" value={o.mastery.mastered} note={`${o.mastery.evidenced} milestones mastered with answer evidence`} />
          <RateTile label="Immediate checks" r={o.immediateCheck} note="right after mastery" />
          <RateTile label="Delayed retention" r={o.delayedRetention} note="days later" />
          <RateTile label="Transfer" r={o.transfer} note="new context, same concept" />
        </div>
      </section>
    </div>
  );
}
