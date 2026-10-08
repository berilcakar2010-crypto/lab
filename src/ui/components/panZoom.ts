import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";

export interface Box { x: number; y: number; w: number; h: number }

/** Movement (in screen px) after which a touch is a drag, not a tap. */
const TAP_SLOP = 8;

/**
 * Pan (drag) and zoom (pinch, wheel or buttons) over an SVG viewBox.
 *
 * Every state update is computed from values read at event time, never from
 * refs inside a state updater (a finger lifted before React renders would
 * leave them empty). A drag captures the pointer once it passes the tap slop,
 * so it keeps working outside the frame and never ends as a click on whatever
 * is underneath (such as a sheet's backdrop). `wasDrag()` tells tap handlers
 * to ignore the click that ends a drag.
 */
export function usePanZoom(initial: Box) {
  const [vb, setVb] = useState(initial);
  const vbRef = useRef(vb);
  vbRef.current = vb;
  const svgRef = useRef<SVGSVGElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const last = useRef<{ x: number; y: number; d?: number } | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  // A different map (new bounds) starts fitted.
  const key = `${initial.x}|${initial.y}|${initial.w}|${initial.h}`;
  const lastKey = useRef(key);
  useEffect(() => {
    if (lastKey.current !== key) {
      lastKey.current = key;
      setVb(initial);
    }
  }, [key]);

  const minW = initial.w / 6, maxW = initial.w * 2.5;
  /** Screen px → viewBox units. */
  const unit = () => {
    const el = svgRef.current;
    const cw = el?.clientWidth || 1, ch = el?.clientHeight || 1;
    // preserveAspectRatio "meet": the larger ratio decides the scale.
    return Math.max(vbRef.current.w / cw, vbRef.current.h / ch);
  };
  /** Zoom by factor `f` (<1 zooms in), keeping the point at client (cx, cy) still when given. */
  const zoom = (f: number, cx?: number, cy?: number) => {
    const v = vbRef.current;
    const w = Math.min(Math.max(v.w * f, minW), maxW);
    const k = w / v.w;
    if (!Number.isFinite(k) || k === 1) return;
    let ax = v.x + v.w / 2, ay = v.y + v.h / 2;
    const el = svgRef.current;
    if (el && cx !== undefined && cy !== undefined) {
      const r = el.getBoundingClientRect();
      const u = unit();
      // Point under the fingers, in viewBox units (centre-aligned "meet" layout).
      ax = v.x + v.w / 2 + (cx - (r.left + r.width / 2)) * u;
      ay = v.y + v.h / 2 + (cy - (r.top + r.height / 2)) * u;
    }
    const next = { x: ax - (ax - v.x) * k, y: ay - (ay - v.y) * k, w, h: v.h * k };
    vbRef.current = next;
    setVb(next);
  };
  const panBy = (dxPx: number, dyPx: number) => {
    const u = unit();
    const v = vbRef.current;
    const next = { ...v, x: v.x - dxPx * u, y: v.y - dyPx * u };
    vbRef.current = next;
    setVb(next);
  };

  const onPointerDown = (e: RPointerEvent<SVGSVGElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      start.current = { x: e.clientX, y: e.clientY };
      dragged.current = false;
    }
    last.current = null;
  };
  const onPointerMove = (e: RPointerEvent<SVGSVGElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    if (e.pointerType === "mouse" && !e.buttons) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const s = start.current;
    if (!dragged.current && (pts.length > 1 || (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > TAP_SLOP))) {
      dragged.current = true;
      for (const id of pointers.current.keys()) {
        try { e.currentTarget.setPointerCapture(id); } catch { /* pointer already gone */ }
      }
    }
    if (!dragged.current) return;
    const cx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
    const cy = pts.reduce((a, p) => a + p.y, 0) / pts.length;
    const d = pts.length >= 2 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : undefined;
    const prev = last.current;
    last.current = { x: cx, y: cy, d };
    if (!prev) return;
    panBy(cx - prev.x, cy - prev.y);
    if (d && prev.d && d > 0) zoom(prev.d / d, cx, cy);
  };
  const onPointerUp = (e: RPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* not captured */ }
    // Continue smoothly with the remaining finger after a pinch.
    last.current = null;
    if (!pointers.current.size) start.current = null;
  };

  // Wheel zoom must be able to stop the page from scrolling, so it needs a non-passive listener.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom(e.deltaY > 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  return {
    vb,
    fit: () => { vbRef.current = initial; setVb(initial); },
    zoom,
    svgRef,
    wasDrag: () => dragged.current,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}
