import { useMemo, useState } from "react";
import { FOCUS_FACTORS, MIN_GROUP_N, OUTCOME_LABEL, focusReport, type Outcome } from "../../engines/focusLab";
import { GROUP_LABEL } from "../../engines/statistics";
import { useDB } from "../state";
import { RateBars } from "../components/Stats";
import { ExperimentsSection } from "./ExperimentsSection";

export function FocusLabPage() {
  const db = useDB();
  const len = db.events.length;
  const report = useMemo(() => focusReport(db), [db, len]);
  const [outcome, setOutcome] = useState<Outcome>("continuation");

  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">Focus Lab</span>
        <h1>What seems to help you?</h1>
        <p className="small text-2">Patterns in your own data — milestone length, difficulty, stylus use, feedback, novelty, time of day, help level. These are observational: they show what tends to go together, not what causes what. A group needs {MIN_GROUP_N} observations before it is compared.</p>
      </header>

      <section className="card stack">
        <h2>Your design hypothesis</h2>
        <p className="small text-2">"I may engage strongly when a big goal keeps turning into small, concrete milestones with active work, immediate feedback, visible progress and a clear next step." Lab treats this as something to test, not a given.</p>
        {report.hypothesis.map((h) => (
          <div key={h.label} className="list-item small" style={{ alignItems: "flex-start" }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, marginTop: 7, flex: "none", background: h.pattern ? "var(--accent)" : "var(--border-strong)" }} />
            <span className="grow"><strong>{h.label}</strong><br />
              <span className="text-2">{h.pattern ? h.pattern.sentence : h.status.status === "insufficient" ? `Not enough evidence yet — each compared group needs ${MIN_GROUP_N} observations.` : "No clear difference so far."}</span>
            </span>
          </div>
        ))}
        <p className="tiny muted">For a fairer test, run a personal experiment below — it alternates conditions so other factors are less likely to explain a difference.</p>
      </section>

      <section className="stack">
        <h2>Patterns found</h2>
        {report.patterns.length ? (
          report.patterns.slice(0, 6).map((p, i) => (
            <div key={i} className={`banner ${p.strength === "associated" ? "info" : ""} small`}>
              {p.sentence} <span className="muted">{p.strength === "associated" ? "Observational, not causal." : "Weak evidence — may disappear with more data."}</span>
            </div>
          ))
        ) : (
          <div className="card small text-2">{report.visits < 2 * MIN_GROUP_N ? `Insufficient data: ${report.visits} milestone visits recorded. Patterns need at least two groups of ${MIN_GROUP_N}.` : "No clear patterns yet. That is a valid result: differences so far are small or within noise."}</div>
        )}
      </section>

      <section className="card stack">
        <h2>Explore a factor</h2>
        <div className="tabs">
          {(["continuation", "completion", "persistence", "firstTry"] as Outcome[]).map((o) => (
            <button key={o} className={outcome === o ? "on" : ""} onClick={() => setOutcome(o)}>{o === "firstTry" ? "First try" : o[0].toUpperCase() + o.slice(1)}</button>
          ))}
        </div>
        <p className="tiny muted">Outcome: {OUTCOME_LABEL[outcome]}.</p>
        {FOCUS_FACTORS.map((f) => {
          const st = report.statuses.find((s) => s.factor === f && s.outcome === outcome)!;
          return (
            <div key={f} className="stack" style={{ gap: 6, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
              <div className="row between small"><strong>{GROUP_LABEL[f]}</strong>
                <span className="muted">{st.status === "pattern" ? "pattern" : st.status === "insufficient" ? "insufficient data" : "no clear difference"}</span></div>
              <RateBars rows={st.groups.map((g) => ({ label: g.group, r: g.rate }))} empty="No observations yet." />
            </div>
          );
        })}
      </section>

      <ExperimentsSection />
    </div>
  );
}
