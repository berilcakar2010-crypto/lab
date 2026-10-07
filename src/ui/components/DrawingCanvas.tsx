import { useCallback, useEffect, useRef, useState } from "react";
import type { InputMethod } from "../../domain/types";
import { Icon } from "./common";

type Pt = [number, number, number]; // x, y, pressure
interface Stroke { pts: Pt[]; color: string; width: number; erase: boolean }

export interface DrawingStats {
  strokes: number;
  penStrokes: number;
  touchStrokes: number;
  mouseStrokes: number;
}

const COLORS = ["#e4e9f0", "#6cb6dd", "#d8aa62", "#79c79a"];

/**
 * Stylus-first drawing surface. Pen input draws with pressure; once a pen has
 * been seen, touch input on the canvas is ignored (palm rejection) so a hand
 * resting on the screen never leaves marks. Without a pen, fingers draw.
 */
export function DrawingCanvas({
  height = 340, onChange, onInput, label = "Workspace",
}: {
  height?: number;
  onChange?: (stats: DrawingStats, toDataURL: () => string) => void;
  onInput?: (m: InputMethod) => void;
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const current = useRef<Stroke | null>(null);
  const penSeen = useRef(false);
  const stats = useRef<DrawingStats>({ strokes: 0, penStrokes: 0, touchStrokes: 0, mouseStrokes: 0 });
  const [color, setColor] = useState(COLORS[0]);
  const [erase, setErase] = useState(false);
  const [count, setCount] = useState(0);

  const redraw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of [...strokes.current, ...(current.current ? [current.current] : [])]) {
      ctx.globalCompositeOperation = s.erase ? "destination-out" : "source-over";
      ctx.strokeStyle = s.color;
      for (let i = 1; i < s.pts.length; i++) {
        const [x0, y0] = s.pts[i - 1];
        const [x1, y1, p] = s.pts[i];
        ctx.lineWidth = s.erase ? 18 : s.width * (0.4 + p * 1.2);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      if (s.pts.length === 1) {
        const [x, y] = s.pts[0];
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x, y, s.width / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }, []);

  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current, w = wrapRef.current;
      if (!c || !w) return;
      const dpr = window.devicePixelRatio || 1;
      c.width = Math.round(w.clientWidth * dpr);
      c.height = Math.round(height * dpr);
      c.style.width = `${w.clientWidth}px`;
      c.style.height = `${height}px`;
      redraw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [height, redraw]);

  const emit = () => {
    setCount(strokes.current.length);
    onChange?.({ ...stats.current }, () => exportImage(canvasRef.current!));
  };

  const pos = (e: React.PointerEvent): Pt => {
    const r = canvasRef.current!.getBoundingClientRect();
    const pressure = e.pointerType === "pen" ? (e.pressure || 0.5) : 0.5;
    return [e.clientX - r.left, e.clientY - r.top, pressure];
  };

  const down = (e: React.PointerEvent) => {
    if (e.pointerType === "pen") penSeen.current = true;
    if (e.pointerType === "touch" && penSeen.current) return; // palm rejection
    onInput?.(e.pointerType === "pen" ? "pen" : e.pointerType === "touch" ? "touch" : "mouse");
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch {
      /* pointer already released; drawing still works without capture */
    }
    current.current = { pts: [pos(e)], color, width: 2.6, erase: erase || e.button === 5 };
    stats.current.strokes++;
    if (e.pointerType === "pen") stats.current.penStrokes++;
    else if (e.pointerType === "touch") stats.current.touchStrokes++;
    else stats.current.mouseStrokes++;
    redraw();
  };
  const move = (e: React.PointerEvent) => {
    if (!current.current) return;
    const events = (e.nativeEvent as PointerEvent).getCoalescedEvents?.() ?? [e.nativeEvent];
    const r = canvasRef.current!.getBoundingClientRect();
    for (const ev of events) {
      current.current.pts.push([ev.clientX - r.left, ev.clientY - r.top, ev.pointerType === "pen" ? ev.pressure || 0.5 : 0.5]);
    }
    redraw();
  };
  const up = () => {
    if (!current.current) return;
    strokes.current.push(current.current);
    current.current = null;
    redraw();
    emit();
  };

  return (
    <div className="stack" style={{ gap: 6 }}>
      <div className="row between">
        <span className="small muted">{label}{penSeen.current ? " · pen detected, palm rejection on" : ""}</span>
        <div className="row nowrap" style={{ gap: 4 }}>
          {COLORS.map((c) => (
            <button key={c} type="button" aria-label={`Ink ${c}`} onClick={() => { setColor(c); setErase(false); }}
              style={{ width: 28, height: 28, borderRadius: 99, background: c, border: color === c && !erase ? "2px solid var(--text)" : "2px solid transparent", cursor: "pointer" }} />
          ))}
          <button type="button" className="btn small" aria-pressed={erase} onClick={() => setErase(!erase)} style={{ borderColor: erase ? "var(--accent)" : undefined }}>Eraser</button>
          <button type="button" className="btn small" disabled={!count} onClick={() => { strokes.current.pop(); redraw(); emit(); }}>Undo</button>
          <button type="button" className="btn small ghost" disabled={!count} aria-label="Clear" onClick={() => { strokes.current = []; redraw(); emit(); }}><Icon.close /></button>
        </div>
      </div>
      <div ref={wrapRef} style={{ borderRadius: 12, border: "1px solid var(--border-strong)", background: "#0d1218", overflow: "hidden",
        backgroundImage: "radial-gradient(circle, rgba(180,191,204,0.12) 1px, transparent 1px)", backgroundSize: "22px 22px" }}>
        <canvas
          ref={canvasRef} aria-label={label} role="img"
          style={{ display: "block", touchAction: "none", cursor: erase ? "cell" : "crosshair" }}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}
        />
      </div>
    </div>
  );
}

/** Downscaled JPEG for AI evaluation; never persisted in full to keep storage small. */
function exportImage(c: HTMLCanvasElement): string {
  const max = 800;
  const scale = Math.min(1, max / c.width);
  const out = document.createElement("canvas");
  out.width = Math.round(c.width * scale);
  out.height = Math.round(c.height * scale);
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#0d1218";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(c, 0, 0, out.width, out.height);
  return out.toDataURL("image/jpeg", 0.6);
}
