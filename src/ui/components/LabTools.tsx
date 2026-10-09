/**
 * Lab tools in the interface: predict → test → explain, the sandbox (model
 * runs, formula sweeps, data analysis) and research notebooks. All results
 * come from the real computation in src/adaptive; nothing here is simulated.
 */
import { useMemo, useState } from "react";
import type { ID, LabDB } from "../../domain/types";
import { RESEARCH_STEPS, type Direction, type PredictionRecord, type ResearchStep } from "../../domain/adaptive";
import { fmtDate, L } from "../../i18n";
import type { KnowledgeGraph } from "../../knowledge/schema";
import { getGraph } from "../../knowledge/graph";
import { freeVariables, parse } from "../../engines/expr";
import { MODELS, modelsFor, runData, runOde, runSweep, saveAsEvidence, saveRun, startSandbox, type SandboxModel } from "../../adaptive/sandbox";
import { DIRECTION_LABEL, comparison, explainPrediction, pteTask, submitPrediction } from "../../adaptive/pte";
import { STEP_LABEL, createResearch, nextStep, researchAsExplanation, researchGuideAI, researchMarkdown, setStep, stepPrompts } from "../../adaptive/research";
import { act, aiHost, navigate, toast, useAsync, useDB } from "../state";
import { saveTextFile } from "../native";

/** A small line chart for numeric series. */
export function SeriesPlot({ series, marks = [], height = 180, xLabel, yLabel }: { series: { label: string; points: [number, number][] }[]; marks?: number[]; height?: number; xLabel?: string; yLabel?: string }) {
  const pts = series.flatMap((s) => s.points).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (pts.length < 2) return <p className="tiny muted">{L("Nothing to plot.", "Çizilecek bir şey yok.")}</p>;
  const W = 320, H = height, pad = 30;
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const sx = (x: number) => pad + ((x - x0) / (x1 - x0 || 1)) * (W - pad - 8);
  const sy = (y: number) => H - pad + 6 - ((y - y0) / (y1 - y0 || 1)) * (H - pad - 6);
  const colors = ["var(--accent)", "var(--review)", "var(--mastered)", "#8fb5f0"];
  const f = (v: number) => (Math.abs(v) >= 1e4 || (Math.abs(v) < 1e-2 && v !== 0) ? v.toExponential(1) : String(Math.round(v * 100) / 100));
  return (
    <svg className="series-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={series.map((s) => s.label).join(", ")}>
      <line x1={pad} y1={H - pad + 6} x2={W - 8} y2={H - pad + 6} className="sp-axis" />
      <line x1={pad} y1={0} x2={pad} y2={H - pad + 6} className="sp-axis" />
      <text x={pad} y={H - 4} className="sp-tick">{f(x0)}</text>
      <text x={W - 8} y={H - 4} className="sp-tick" textAnchor="end">{f(x1)}</text>
      <text x={pad - 3} y={10} className="sp-tick" textAnchor="end">{f(y1)}</text>
      <text x={pad - 3} y={H - pad + 6} className="sp-tick" textAnchor="end">{f(y0)}</text>
      {xLabel && <text x={(W + pad) / 2} y={H - 4} className="sp-tick" textAnchor="middle">{xLabel}</text>}
      {yLabel && <text x={pad + 4} y={12} className="sp-tick">{yLabel}</text>}
      {marks.map((m, i) => <line key={i} x1={sx(m)} x2={sx(m)} y1={0} y2={H - pad + 6} className="sp-mark" />)}
      {series.map((s, i) => (
        <polyline key={i} fill="none" stroke={colors[i % colors.length]} strokeWidth={1.8}
          points={s.points.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y)).map(([x, y]) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(" ")} />
      ))}
    </svg>
  );
}

const defaults = (m: SandboxModel) => Object.fromEntries(m.params.map((p) => [p.name, p.value]));

function curve(m: SandboxModel, param: string, values: Record<string, number>) {
  const p = m.params.find((x) => x.name === param)!;
  if (m.kind === "formula") return runSweep({ expression: m.expression, variable: param, from: p.min, to: p.max, points: 60, params: values });
  // ODE: the measured output across the parameter range (coarse, to keep it fast on a tablet).
  const pts: [number, number][] = [];
  for (let i = 0; i <= 16; i++) {
    const v = p.min + ((p.max - p.min) * i) / 16;
    const r = runOde({ equations: m.equations, initial: m.initial, params: { ...values, [param]: v }, t1: m.t1, dt: m.dt, reset: m.reset });
    pts.push([v, m.measure.kind === "resets" ? r.resets : r.final[m.measure.variable]]);
  }
  return { kind: "SWEEP" as const, input: {}, summary: "", series: [{ label: m.output, points: pts }] };
}

// ---------------------------------------------------------------------------
// Predict → test → explain
// ---------------------------------------------------------------------------

export function PtePanel({ model }: { model: SandboxModel }) {
  const db = useDB();
  const task = useMemo(() => pteTask(model), [model]);
  const [dir, setDir] = useState<Direction | null>(null);
  const [value, setValue] = useState("");
  const [recId, setRecId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [rubric, setRubric] = useState({ mechanism: false, usesResult: false });
  const rec: PredictionRecord | undefined = recId ? db.predictions[recId] : undefined;
  const plot = useMemo(() => (rec ? curve(model, task.param, defaults(model)) : null), [rec, model, task.param]);
  const predict = () => {
    if (!dir) return;
    const v = value.trim() ? Number(value.replace(",", ".")) : undefined;
    const r = act((d) => submitPrediction(d, model, task, { direction: dir, value: Number.isFinite(v) ? v : undefined }));
    setRecId(r.id);
  };
  return (
    <div className="card stack pte" style={{ gap: 8 }}>
      <span className="eyebrow">{L("Predict → test → explain", "Tahmin → test → açıkla")}</span>
      <p className="serif" style={{ margin: 0 }}>{task.question}</p>
      {!rec ? (
        <>
          <div className="row" style={{ gap: 6 }}>
            {(["UP", "DOWN", "SAME", "NONMONOTONIC"] as Direction[]).map((d) => (
              <button key={d} className={`btn small ${dir === d ? "primary" : ""}`} aria-pressed={dir === d} onClick={() => setDir(d)}>{DIRECTION_LABEL(d)}</button>
            ))}
          </div>
          <input className="input" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder={L("Optional: your numeric guess", "İsteğe bağlı: sayısal tahminin")} aria-label={L("Numeric guess", "Sayısal tahmin")} />
          <button className="btn primary" disabled={!dir} onClick={predict}>{L("Predict, then test", "Tahmin et, sonra test et")}</button>
        </>
      ) : (
        <>
          <div className={`banner ${rec.correct ? "ok" : "warn"} small`}>{comparison(rec)}</div>
          {plot && <SeriesPlot series={plot.series} marks={[task.from, task.to]} xLabel={model.params.find((p) => p.name === task.param)?.label} yLabel={model.output} />}
          {rec.explanation === undefined ? (
            <>
              <textarea className="textarea" style={{ minHeight: 70 }} value={text} onChange={(e) => setText(e.target.value)} placeholder={L("Explain why, in your own words…", "Nedenini kendi cümlelerinle açıkla…")} aria-label={L("Explanation", "Açıklama")} />
              <label className="row nowrap small" style={{ gap: 8 }}><input type="checkbox" checked={rubric.mechanism} onChange={(e) => setRubric({ ...rubric, mechanism: e.target.checked })} />{L("I named the mechanism (which quantity drives which)", "Mekanizmayı söyledim (hangi nicelik hangisini etkiliyor)")}</label>
              <label className="row nowrap small" style={{ gap: 8 }}><input type="checkbox" checked={rubric.usesResult} onChange={(e) => setRubric({ ...rubric, usesResult: e.target.checked })} />{L("I used the result (numbers or shape) to back it up", "Sonucu (sayılar ya da biçim) kanıt olarak kullandım")}</label>
              <button className="btn" disabled={!text.trim()} onClick={() => act((d) => explainPrediction(d, rec.id, text, rubric))}>{L("Save the explanation", "Açıklamayı kaydet")}</button>
            </>
          ) : (
            <span className="small text-2">{L("Explanation saved — it counts as evidence for this topic.", "Açıklama kaydedildi — bu konu için kanıt sayılır.")}</span>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sandbox
// ---------------------------------------------------------------------------

export function SandboxPanel({ loId }: { loId?: string }) {
  const models = loId ? modelsFor(loId) : MODELS();
  const [mode, setMode] = useState<"model" | "formula" | "data">(models.length ? "model" : "formula");
  const [modelId, setModelId] = useState(models[0]?.id ?? "");
  const model = models.find((m) => m.id === modelId);
  const [values, setValues] = useState<Record<string, number>>(model ? defaults(model) : {});
  const [param, setParam] = useState(model?.pteParam ?? "");
  const [expr, setExpr] = useState("A*sin(w*t)");
  const [variable, setVariable] = useState("t");
  const [range, setRange] = useState({ from: 0, to: 10 });
  const [data, setData] = useState("x,y\n1,2\n2,4.1\n3,5.9\n4,8.2");
  const [run, setRun] = useState<ReturnType<typeof runSweep> | null>(null);
  const [saved, setSaved] = useState<ID | null>(null);
  const [note, setNote] = useState("");
  const vars = useMemo(() => {
    try { return [...freeVariables(parse(expr))].filter((v) => v !== variable); } catch { return []; }
  }, [expr, variable]);

  const choose = (id: string) => {
    const m = models.find((x) => x.id === id)!;
    setModelId(id); setValues(defaults(m)); setParam(m.pteParam); setRun(null); setSaved(null);
  };
  const go = () => {
    act((d) => startSandbox(d, mode === "data" ? "DATA" : model?.kind === "ode" && mode === "model" ? "ODE" : "SWEEP", loId ? [loId] : model?.loIds ?? []));
    try {
      let r: ReturnType<typeof runSweep>;
      if (mode === "data") r = runData(data);
      else if (mode === "formula") r = runSweep({ expression: expr, variable, from: range.from, to: range.to, points: 120, params: Object.fromEntries(vars.map((v) => [v, values[v] ?? 1])) });
      else if (model!.kind === "ode") r = runOde({ equations: model!.equations, initial: model!.initial, params: values, t1: model!.t1, dt: model!.dt, reset: model!.reset });
      else r = runSweep({ expression: model!.expression, variable: param, from: model!.params.find((p) => p.name === param)!.min, to: model!.params.find((p) => p.name === param)!.max, points: 120, params: values });
      setRun(r);
      setSaved(null);
    } catch (e) {
      toast(L(`Could not run it: ${e instanceof Error ? e.message : e}`, `Çalıştırılamadı: ${e instanceof Error ? e.message : e}`), "error");
    }
  };
  const save = () => {
    if (!run) return;
    const title = mode === "data" ? L("Data analysis", "Veri analizi") : mode === "formula" ? expr : model!.title;
    const r = act((d) => saveRun(d, { ...run, title }, loId ? [loId] : model?.loIds ?? []));
    setSaved(r.id);
    toast(L("Run saved.", "Çalıştırma kaydedildi."));
  };
  const evidence = () => {
    const target = loId ?? model?.loIds[0];
    if (!saved || !target) return;
    act((d) => saveAsEvidence(d, saved, target, note));
    setNote("");
    toast(L("Saved with your interpretation — evaluate it under Explanations to count it as evidence.", "Yorumunla kaydedildi — kanıt sayılması için Anlatımlar'da değerlendir."));
  };

  return (
    <div className="card stack sandbox" style={{ gap: 8 }}>
      <div className="row between"><span className="eyebrow">{L("Sandbox", "Sandbox")}</span><span className="tiny muted">{L("safe calculations · no code execution", "güvenli hesaplama · kod çalıştırma yok")}</span></div>
      <div className="row" style={{ gap: 6 }}>
        {models.length > 0 && <button className={`btn small ${mode === "model" ? "primary" : ""}`} onClick={() => setMode("model")}>{L("Models", "Modeller")}</button>}
        <button className={`btn small ${mode === "formula" ? "primary" : ""}`} onClick={() => setMode("formula")}>{L("Formula", "Formül")}</button>
        <button className={`btn small ${mode === "data" ? "primary" : ""}`} onClick={() => setMode("data")}>{L("Data", "Veri")}</button>
      </div>
      {mode === "model" && model && (
        <>
          <select className="input" value={modelId} onChange={(e) => choose(e.target.value)} aria-label={L("Model", "Model")}>
            {models.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
          <span className="tiny mono text-2">{model.kind === "formula" ? `${model.output} = ${model.expression}` : Object.entries(model.equations).map(([k, v]) => `d${k}/dt = ${v}`).join("; ")}</span>
          {model.params.map((p) => (
            <label key={p.name} className="row nowrap small" style={{ gap: 8 }}>
              <span style={{ minWidth: 120 }}>{p.label}{p.unit ? ` (${p.unit})` : ""}</span>
              <input type="range" min={p.min} max={p.max} step={(p.max - p.min) / 100} value={values[p.name] ?? p.value} onChange={(e) => setValues({ ...values, [p.name]: Number(e.target.value) })} className="grow" />
              <span className="mono" style={{ minWidth: 52, textAlign: "right" }}>{Math.round((values[p.name] ?? p.value) * 100) / 100}</span>
              {model.kind === "formula" && <input type="radio" name="sweep" checked={param === p.name} onChange={() => setParam(p.name)} aria-label={L(`Vary ${p.label}`, `${p.label} değişsin`)} />}
            </label>
          ))}
          {model.kind === "formula" && <span className="tiny muted">{L("The selected circle is the parameter swept on the x-axis.", "Seçili daire, x ekseninde taranan parametredir.")}</span>}
        </>
      )}
      {mode === "formula" && (
        <>
          <input className="input mono" value={expr} onChange={(e) => setExpr(e.target.value)} aria-label={L("Formula", "Formül")} />
          <div className="row nowrap small" style={{ gap: 6 }}>
            <span>{L("vary", "değişken")}</span><input className="input" style={{ width: 70 }} value={variable} onChange={(e) => setVariable(e.target.value.trim())} aria-label={L("Variable", "Değişken")} />
            <input className="input" style={{ width: 80 }} inputMode="decimal" value={range.from} onChange={(e) => setRange({ ...range, from: Number(e.target.value) })} aria-label={L("From", "Başlangıç")} />
            <span>→</span>
            <input className="input" style={{ width: 80 }} inputMode="decimal" value={range.to} onChange={(e) => setRange({ ...range, to: Number(e.target.value) })} aria-label={L("To", "Bitiş")} />
          </div>
          {vars.map((v) => (
            <label key={v} className="row nowrap small" style={{ gap: 8 }}><span style={{ minWidth: 40 }} className="mono">{v}</span>
              <input className="input" inputMode="decimal" style={{ width: 110 }} value={values[v] ?? 1} onChange={(e) => setValues({ ...values, [v]: Number(e.target.value) })} /></label>
          ))}
        </>
      )}
      {mode === "data" && <textarea className="textarea mono" style={{ minHeight: 110 }} value={data} onChange={(e) => setData(e.target.value)} aria-label={L("Data (CSV)", "Veri (CSV)")} />}
      <button className="btn primary" onClick={go}>{L("Run", "Çalıştır")}</button>
      {run && (
        <div className="stack" style={{ gap: 6 }}>
          <SeriesPlot series={run.series} />
          <span className="small text-2">{run.summary}</span>
          {!saved ? <button className="btn small" style={{ alignSelf: "flex-start" }} onClick={save}>{L("Save run", "Çalıştırmayı kaydet")}</button> : (loId || model) && (
            <div className="stack" style={{ gap: 6 }}>
              <textarea className="textarea" style={{ minHeight: 60 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder={L("What does this show? Your interpretation becomes evidence once evaluated.", "Bu ne gösteriyor? Yorumun değerlendirildiğinde kanıt olur.")} aria-label={L("Interpretation", "Yorum")} />
              <button className="btn small" style={{ alignSelf: "flex-start" }} disabled={!note.trim()} onClick={evidence}>{L("Save as evidence", "Kanıt olarak kaydet")}</button>
            </div>
          )}
        </div>
      )}
      <span className="tiny muted">{L("Python is not available: it would need a large runtime and the internet. Lab runs formulas, differential equations (RK4) and data analysis itself.", "Python yok: büyük bir çalışma zamanı ve internet gerektirir. Lab formülleri, diferansiyel denklemleri (RK4) ve veri analizini kendisi çalıştırır.")}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Research
// ---------------------------------------------------------------------------

export function ResearchPanel({ id }: { id: ID }) {
  const db = useDB();
  const p = db.research[id];
  const [drafts, setDrafts] = useState<Partial<Record<ResearchStep, string>>>({});
  const [guide, setGuide] = useState<Partial<Record<ResearchStep, string[]>>>({});
  const { busy, run } = useAsync();
  if (!p) return null;
  const nxt = nextStep(p);
  const runs = Object.values(db.sandboxRuns).sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);
  const ask = (s: ResearchStep) => run(async () => {
    const res = await researchGuideAI(aiHost, p, s);
    setGuide({ ...guide, [s]: res.value });
  });
  return (
    <div className="stack research" style={{ gap: 10 }}>
      <div className="row between"><h2 style={{ margin: 0 }}>{p.title}</h2><span className="chip">{RESEARCH_STEPS.filter((s) => p.steps[s]?.doneAt).length}/{RESEARCH_STEPS.length}</span></div>
      {RESEARCH_STEPS.map((s, i) => {
        const st = p.steps[s];
        const isNext = s === nxt;
        return (
          <details key={s} className={`card research-step ${st?.doneAt ? "done" : ""}`} open={isNext}>
            <summary className="row between" style={{ cursor: "pointer" }}><span>{i + 1}. {STEP_LABEL(s)}</span>{st?.doneAt && <span className="tiny muted">✓</span>}</summary>
            <div className="stack" style={{ gap: 6, marginTop: 6 }}>
              <ul className="tiny text-2" style={{ margin: 0, paddingLeft: 18 }}>{(guide[s] ?? stepPrompts(p, s, db)).map((q, j) => <li key={j}>{q}</li>)}</ul>
              <textarea className="textarea" style={{ minHeight: 70 }} value={drafts[s] ?? st?.text ?? ""} onChange={(e) => setDrafts({ ...drafts, [s]: e.target.value })} aria-label={STEP_LABEL(s)} />
              {(s === "MODEL" || s === "SIMULATION" || s === "RESULT") && runs.length > 0 && (
                <select className="input" value={st?.sandboxRunId ?? ""} onChange={(e) => act((d) => setStep(d, id, s, drafts[s] ?? st?.text ?? "", { sandboxRunId: e.target.value || undefined }))} aria-label={L("Attach a sandbox run", "Sandbox çalıştırması ekle")}>
                  <option value="">{L("Attach a sandbox run…", "Sandbox çalıştırması ekle…")}</option>
                  {runs.map((r) => <option key={r.id} value={r.id}>{r.title} · {fmtDate(r.createdAt)}</option>)}
                </select>
              )}
              <div className="row" style={{ gap: 6 }}>
                <button className="btn small primary" onClick={() => act((d) => setStep(d, id, s, drafts[s] ?? st?.text ?? ""))}>{L("Save step", "Adımı kaydet")}</button>
                <button className="btn small ghost" disabled={busy} onClick={() => ask(s)}>{busy ? <span className="spinner" /> : L("Guiding questions", "Yol gösteren sorular")}</button>
              </div>
            </div>
          </details>
        );
      })}
      <div className="row" style={{ gap: 6 }}>
        <button className="btn small" onClick={() => saveTextFile(`lab-research-${p.id}.md`, researchMarkdown(db, p), "text/markdown")}>{L("Export (Markdown)", "Dışa aktar (Markdown)")}</button>
        {p.status === "DONE" && p.loIds[0] && <button className="btn small primary" onClick={() => { act((d) => researchAsExplanation(d, id)); toast(L("Sent to Explanations — evaluate it there.", "Anlatımlar'a gönderildi — orada değerlendir.")); navigate(`/graph?lo=${encodeURIComponent(p.loIds[0])}`); }}>{L("Hand in for evaluation", "Değerlendirmeye gönder")}</button>}
      </div>
    </div>
  );
}

/** Study → Research: notebooks and the general sandbox. */
export function ResearchTab({ db, g, initial }: { db: LabDB; g: KnowledgeGraph; initial?: string }) {
  const [open, setOpen] = useState<string | null>(initial && db.research[initial] ? initial : null);
  const [title, setTitle] = useState("");
  const list = Object.values(db.research).sort((a, b) => b.updatedAt - a.updatedAt);
  if (open && db.research[open]) return (
    <div className="stack">
      <button className="btn small ghost" style={{ alignSelf: "flex-start" }} onClick={() => setOpen(null)}>← {L("All research", "Tüm araştırmalar")}</button>
      <ResearchPanel id={open} />
    </div>
  );
  return (
    <div className="stack">
      <div className="card stack" style={{ gap: 6 }}>
        <strong>{L("New research question", "Yeni araştırma sorusu")}</strong>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L("e.g. How does synaptic noise affect firing reliability?", "ör. Sinaptik gürültü ateşleme güvenilirliğini nasıl etkiler?")} aria-label={L("Research question", "Araştırma sorusu")} />
        <button className="btn primary" disabled={!title.trim()} onClick={() => { const r = act((d) => createResearch(d, title)); setTitle(""); setOpen(r.id); }}>{L("Start", "Başla")}</button>
        <span className="tiny muted">{L("You write every step; Lab only asks questions. Not a homework generator.", "Her adımı sen yazarsın; Lab yalnızca soru sorar. Ödev üreticisi değildir.")}</span>
      </div>
      {list.length > 0 && (
        <div className="card list">
          {list.map((r) => (
            <button key={r.id} className="list-item lo-row" onClick={() => setOpen(r.id)}>
              <span className="grow stack" style={{ gap: 0, minWidth: 0, textAlign: "left" }}>
                <span className="truncate">{r.title}</span>
                <span className="tiny muted">{r.loIds.map((id) => g.objects[id]?.title).filter(Boolean).join(", ")} · {fmtDate(r.updatedAt)}</span>
              </span>
              <span className="chip">{RESEARCH_STEPS.filter((s) => r.steps[s]?.doneAt).length}/{RESEARCH_STEPS.length}</span>
            </button>
          ))}
        </div>
      )}
      <SandboxPanel />
    </div>
  );
}

/** Object sheet → Lab: predict-test-explain and sandbox for this topic, and a research start. */
export function LabTab({ loId }: { loId: string }) {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const o = g.objects[loId];
  const models = modelsFor(loId);
  const [pteIdx, setPteIdx] = useState(0);
  return (
    <div className="stack">
      {models.length > 0 ? (
        <>
          {models.length > 1 && (
            <div className="row" style={{ gap: 6 }}>{models.map((m, i) => <button key={m.id} className={`btn small ${pteIdx === i ? "primary" : ""}`} onClick={() => setPteIdx(i)}>{m.title}</button>)}</div>
          )}
          <PtePanel key={models[pteIdx].id} model={models[pteIdx]} />
        </>
      ) : (
        <p className="small muted">{L("No built-in model for this topic yet — use the formula sandbox below or a research question.", "Bu konu için henüz yerleşik model yok — aşağıdaki formül sandbox'ını ya da bir araştırma sorusunu kullan.")}</p>
      )}
      <SandboxPanel loId={loId} />
      {o && (
        <div className="card stack" style={{ gap: 6 }}>
          <strong>{L("Turn it into research", "Araştırmaya dönüştür")}</strong>
          {(o.researchApplications.length ? o.researchApplications : [L(`An open question about ${o.title}`, `${o.title} hakkında açık bir soru`)]).slice(0, 3).map((q) => (
            <button key={q} className="list-item lo-row" onClick={() => { const r = act((d) => createResearch(d, q, [loId])); navigate(`/study?tab=research&res=${r.id}`); }}>
              <span className="grow" style={{ textAlign: "left" }}>{q}</span><span className="muted">→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
