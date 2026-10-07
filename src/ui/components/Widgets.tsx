import { useMemo, useState } from "react";
import type { GraphSpec, SimulationSpec } from "../../domain/types";
import { evaluate, parse } from "../../engines/expr";

/** Plot y = f(x) as SVG with axes, gridlines and a pointer read-out. */
export function GraphPlot({ spec }: { spec: GraphSpec }) {
  const W = 640, H = 300, P = 36;
  const data = useMemo(() => {
    try {
      const tree = parse(spec.expression, ["x"]);
      const pts: [number, number][] = [];
      for (let i = 0; i <= 240; i++) {
        const x = spec.xMin + ((spec.xMax - spec.xMin) * i) / 240;
        const y = evaluate(tree, { x });
        if (Number.isFinite(y) && Math.abs(y) < 1e6) pts.push([x, y]);
      }
      return pts;
    } catch {
      return [];
    }
  }, [spec.expression, spec.xMin, spec.xMax]);
  const [hover, setHover] = useState<[number, number] | null>(null);
  if (!data.length) return <div className="banner warn small">This graph could not be drawn.</div>;
  let yMin = Math.min(...data.map((d) => d[1])), yMax = Math.max(...data.map((d) => d[1]));
  if (yMin > 0) yMin = 0;
  if (yMax < 0) yMax = 0;
  if (yMax - yMin < 1e-9) { yMax += 1; yMin -= 1; }
  const pad = (yMax - yMin) * 0.08;
  yMin -= pad; yMax += pad;
  const sx = (x: number) => P + ((x - spec.xMin) / (spec.xMax - spec.xMin)) * (W - 2 * P);
  const sy = (y: number) => H - P - ((y - yMin) / (yMax - yMin)) * (H - 2 * P);
  const path = data.map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join("");
  const ticks = (lo: number, hi: number) => {
    const step = niceStep((hi - lo) / 6);
    const out: number[] = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(Number(v.toFixed(6)));
    return out;
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = spec.xMin + (((e.clientX - r.left) / r.width) * W - P) / (W - 2 * P) * (spec.xMax - spec.xMin);
    const nearest = data.reduce((b, d) => (Math.abs(d[0] - x) < Math.abs(b[0] - x) ? d : b), data[0]);
    setHover(nearest);
  };
  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Graph of ${spec.expression}`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}
        style={{ background: "#0d1218", borderRadius: 12, border: "1px solid var(--border)", touchAction: "pan-y" }}>
        {ticks(spec.xMin, spec.xMax).map((t) => (
          <g key={`x${t}`}><line x1={sx(t)} x2={sx(t)} y1={P} y2={H - P} stroke="#1d2632" /><text x={sx(t)} y={H - P + 16} fill="#7d8a9b" fontSize="11" textAnchor="middle">{t}</text></g>
        ))}
        {ticks(yMin, yMax).map((t) => (
          <g key={`y${t}`}><line x1={P} x2={W - P} y1={sy(t)} y2={sy(t)} stroke="#1d2632" /><text x={P - 6} y={sy(t) + 4} fill="#7d8a9b" fontSize="11" textAnchor="end">{t}</text></g>
        ))}
        <line x1={P} x2={W - P} y1={sy(0)} y2={sy(0)} stroke="#4a5566" />
        {spec.xMin <= 0 && spec.xMax >= 0 && <line x1={sx(0)} x2={sx(0)} y1={P} y2={H - P} stroke="#4a5566" />}
        <path d={path} fill="none" stroke="#6cb6dd" strokeWidth="2.2" />
        {hover && (
          <g>
            <circle cx={sx(hover[0])} cy={sy(hover[1])} r="4.5" fill="#6cb6dd" />
            <text x={Math.min(sx(hover[0]) + 8, W - 120)} y={Math.max(sy(hover[1]) - 10, 14)} fill="#e4e9f0" fontSize="12" fontFamily="ui-monospace, monospace">({hover[0].toFixed(2)}, {hover[1].toFixed(2)})</text>
          </g>
        )}
        {spec.xLabel && <text x={W - P} y={H - 6} fill="#b4bfcc" fontSize="12" textAnchor="end">{spec.xLabel}</text>}
        {spec.yLabel && <text x={8} y={P - 12} fill="#b4bfcc" fontSize="12">{spec.yLabel}</text>}
      </svg>
    </figure>
  );
}

function niceStep(raw: number) {
  const p = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1e-9))));
  const n = raw / p;
  return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * p;
}

/** Parameter sliders with a live computed output. */
export function SimulationPanel({ spec, onInteract }: { spec: SimulationSpec; onInteract?: () => void }) {
  const [vals, setVals] = useState<Record<string, number>>(() => Object.fromEntries(spec.variables.map((v) => [v.name, v.initial])));
  const out = useMemo(() => {
    try {
      return evaluate(parse(spec.expression, spec.variables.map((v) => v.name)), vals);
    } catch {
      return NaN;
    }
  }, [spec, vals]);
  return (
    <div className="card raised stack" style={{ gap: 12 }}>
      <span className="eyebrow">Simulation</span>
      {spec.variables.map((v) => (
        <label key={v.name} className="stack" style={{ gap: 4 }}>
          <span className="row between small"><span>{v.label}</span><span className="mono">{vals[v.name]}</span></span>
          <input type="range" min={v.min} max={v.max} step={v.step} value={vals[v.name]} style={{ width: "100%", height: 32 }}
            onChange={(e) => { setVals({ ...vals, [v.name]: Number(e.target.value) }); onInteract?.(); }} />
        </label>
      ))}
      <div className="row between" style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
        <span className="text-2">{spec.outputLabel}</span>
        <span className="mono" style={{ fontSize: "1.3rem", color: "var(--accent)" }}>{Number.isFinite(out) ? out.toFixed(3) : "—"}</span>
      </div>
    </div>
  );
}

/** Monospaced code editor with tab indentation. */
export function CodeEditor({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <textarea
      className="textarea mono" spellCheck={false} autoCapitalize="off" autoCorrect="off" disabled={disabled} aria-label="Code answer"
      style={{ minHeight: 220, fontSize: 14, tabSize: 2, background: "#0d1218" }}
      value={value} placeholder="// write your code here"
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          const t = e.currentTarget, s = t.selectionStart, end = t.selectionEnd;
          const next = value.slice(0, s) + "  " + value.slice(end);
          onChange(next);
          requestAnimationFrame(() => t.setSelectionRange(s + 2, s + 2));
        }
      }}
    />
  );
}
