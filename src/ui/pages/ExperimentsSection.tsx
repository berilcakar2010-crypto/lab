import { useState } from "react";
import type { ExperimentVariable } from "../../domain/types";
import { EXPERIMENT_TEMPLATES, METRIC_LABEL, compareExperiment, runningExperiment, setExperimentStatus, startExperiment, concludeExperiment } from "../../engines/experiments";
import { act, safely, useDB } from "../state";
import { Sheet } from "../components/common";
import { pct } from "../components/Stats";
import { L } from "../../i18n";

/** Personal experiments: alternate conditions across sessions and compare, cautiously. */
export function ExperimentsSection() {
  const db = useDB();
  const [picking, setPicking] = useState(false);
  const running = runningExperiment(db);
  const others = Object.values(db.experiments).filter((e) => e.id !== running?.id).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section className="stack">
      <div className="row between">
        <h2>{L("Personal experiments", "Kişisel deneyler")}</h2>
        {!running && <button className="btn" onClick={() => setPicking(true)}>{L("New experiment", "Yeni deney")}</button>}
      </div>
      {!db.preferences.experimentsEnabled && <div className="banner warn small">{L("Experiments are switched off in Settings, so sessions won't be assigned to conditions.", "Deneyler Ayarlar'da kapalı; oturumlar koşullara atanmayacak.")}</div>}
      {running ? <ExperimentCard id={running.id} /> : !others.length && (
        <div className="card small text-2">{L("Test a learning strategy on yourself: Lab alternates two conditions across sessions (for example micro-milestones vs longer tasks) and compares engagement, completion, performance, retention, transfer and persistence. Only one experiment runs at a time.", "Bir öğrenme stratejisini kendi üzerinde dene: Lab iki koşulu oturumlar arasında sırayla uygular (örneğin mikro adımlar ve uzun görevler) ve bağlılık, tamamlama, performans, kalıcılık, transfer ve sebatı karşılaştırır. Aynı anda yalnızca bir deney yürür.")}</div>
      )}
      {others.map((e) => <ExperimentCard key={e.id} id={e.id} />)}
      {picking && (
        <Sheet title={L("Choose an experiment", "Bir deney seç")} onClose={() => setPicking(false)}>
          <div className="stack">
            {EXPERIMENT_TEMPLATES.map((t) => (
              <button key={t.variable} className="card clickable stack" style={{ textAlign: "left", color: "inherit", font: "inherit", gap: 4 }}
                onClick={() => { safely(() => act((d) => startExperiment(d, t.variable as ExperimentVariable)), L("Experiment started. Your next sessions alternate between the two conditions.", "Deney başladı. Sonraki oturumların iki koşul arasında sırayla değişecek.")); setPicking(false); }}>
                <strong>{t.title}</strong>
                <span className="small text-2">{t.hypothesis}</span>
                <span className="tiny muted">{t.arms.map((a) => a.label).join(L("  vs  ", "  ↔  "))}</span>
              </button>
            ))}
          </div>
        </Sheet>
      )}
    </section>
  );
}

function ExperimentCard({ id }: { id: string }) {
  const db = useDB();
  const exp = db.experiments[id];
  const c = compareExperiment(db, id);
  return (
    <div className={`card stack ${exp.status === "RUNNING" ? "accent" : ""}`}>
      <div className="row between">
        <span className="eyebrow">{exp.status === "RUNNING" ? L("Running", "Sürüyor") : exp.status === "PAUSED" ? L("Paused", "Duraklatıldı") : L("Concluded", "Tamamlandı")}</span>
        <div className="row nowrap">
          {exp.status === "RUNNING" && <button className="btn small" onClick={() => act((d) => setExperimentStatus(d, id, "PAUSED"))}>{L("Pause", "Duraklat")}</button>}
          {exp.status === "PAUSED" && <button className="btn small" onClick={() => safely(() => act((d) => setExperimentStatus(d, id, "RUNNING")))}>{L("Resume", "Sürdür")}</button>}
          {exp.status !== "CONCLUDED" && <button className="btn small" onClick={() => { if (confirm(L("Conclude this experiment? Its data is kept.", "Bu deney bitirilsin mi? Verileri saklanır."))) act((d) => concludeExperiment(d, id, c.verdict)); }}>{L("Conclude", "Bitir")}</button>}
        </div>
      </div>
      <h3>{exp.title}</h3>
      <p className="small text-2">{L("Hypothesis", "Hipotez")}: {exp.hypothesis}</p>
      <div className="grid-2">
        {c.arms.map((a) => (
          <div key={a.arm.id} className="card raised stack" style={{ gap: 4 }}>
            <strong className="small">{a.arm.label}</strong>
            <span className="tiny muted">{L(`${a.sessions} / ${exp.minSessionsPerArm} sessions · ${a.visits} milestone visits`, `${a.sessions} / ${exp.minSessionsPerArm} oturum · ${a.visits} adım ziyareti`)}</span>
            <div className="bar"><span style={{ width: `${Math.min(1, a.sessions / exp.minSessionsPerArm) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="stack" style={{ gap: 4 }} role="table">
        <div className="row small muted nowrap" role="row" style={{ gap: 8 }}>
          <span className="grow">{L("Metric", "Ölçüt")}</span>
          {c.arms.map((a) => <span key={a.arm.id} style={{ width: 84, textAlign: "right" }} className="truncate">{a.arm.label.split(" ")[0]}</span>)}
        </div>
        {(["engagement", "completion", "persistence", "continuation", "performance", "retention", "transfer"] as const).map((m) => {
          const f = c.findings.find((x) => x.metric === m);
          return (
            <div key={m} className="row small nowrap" role="row" style={{ gap: 8, borderTop: "1px solid var(--border)", paddingTop: 4 }} title={f?.text}>
              <span className="grow">{METRIC_LABEL[m]}{f?.leader ? <span style={{ color: "var(--accent)" }}> ●</span> : null}</span>
              {c.arms.map((a) => {
                const v = m === "engagement" ? a.engagement : a.rates[m].value;
                const n = m === "engagement" ? a.visits : a.rates[m].n;
                return <span key={a.arm.id} className="mono" style={{ width: 84, textAlign: "right" }}>{v === null ? <span className="muted">n={n}</span> : m === "engagement" ? v.toFixed(2) : pct(v)}</span>;
              })}
            </div>
          );
        })}
      </div>
      <div className={`banner ${c.enoughSessions ? "info" : ""} small`}>{exp.status === "CONCLUDED" && exp.note ? exp.note : c.verdict}</div>
      {exp.report && (
        <details className="card raised">
          <summary className="small" style={{ cursor: "pointer" }}>{L("Written result", "Yazılı sonuç")} · {exp.report.result === "SUPPORTED" ? L("supported", "desteklendi") : exp.report.result === "NOT_SUPPORTED" ? L("not supported", "desteklenmedi") : L("inconclusive", "sonuçsuz")} · {L("confidence", "güven")} {pct(exp.report.confidence)}</summary>
          <div className="stack small" style={{ gap: 4, marginTop: 6 }}>
            <span><strong>{L("Hypothesis", "Hipotez")}:</strong> {exp.report.hypothesis}</span>
            <span><strong>{L("Design", "Tasarım")}:</strong> {exp.report.design}</span>
            <span style={{ whiteSpace: "pre-wrap" }}><strong>{L("Observed", "Gözlenen")}:</strong> {exp.report.observed}</span>
            <span><strong>{L("Limitations", "Sınırlılıklar")}:</strong></span>
            <ul className="tight" style={{ margin: 0 }}>{exp.report.limitations.map((l) => <li key={l}>{l}</li>)}</ul>
          </div>
        </details>
      )}
    </div>
  );
}
