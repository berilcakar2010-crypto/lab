import { useMemo, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { depths } from "../../engines/graph";
import { L } from "../../i18n";
import { domainLabel, DOMAINS, type Domain, type KnowledgeGraph } from "../../knowledge/schema";
import type { LOState, PersonalGraph } from "../../knowledge/state";

/** One colour per domain, tuned for the bordo theme (all readable on dark paper). */
export const DOMAIN_COLOR: Record<Domain, string> = {
  MATEMATIK: "#e28a9a", FIZIK: "#e0b46a", KIMYA: "#9cc5a1", BIYOLOJI: "#7fc8b8", NOROBILIM: "#c7a3ef",
  PROGRAMLAMA: "#8fb5f0", ARASTIRMA: "#f0c08f", YARISMA: "#f08f8f", YER_UZAY: "#a3c7ef", CEVRE: "#a8d08d",
  PSIKOLOJI: "#e3a3c3", EKONOMI: "#d8c27a", GENEL_KULTUR: "#d2bfb5", YAZIM: "#f3e9e1", SANAT_MUZIK: "#e8a87c",
  MEDYA: "#b8b0d8", INGILIZCE: "#9fd3e0", ALMANCA: "#c9d38f", JAPONCA: "#f2a6a6",
};

const STATE_RING: Partial<Record<LOState, string>> = {
  USTALASILDI: "var(--mastered)", BEYAN: "var(--mastered)", TEKRAR: "var(--review)", CALISILIYOR: "var(--accent)",
};

interface Node { id: string; x: number; y: number; label: string; color: string; ring?: string; dim?: boolean; focus?: boolean; r: number }
interface Edge { from: string; to: string; kind: "pre" | "soft" | "link"; w?: number }

/** Pan (drag) and zoom (wheel, pinch or buttons) over an SVG viewBox. */
function usePanZoom(initial: { x: number; y: number; w: number; h: number }) {
  const [vb, setVb] = useState(initial);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const last = useRef<{ x: number; y: number; d?: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const scale = () => (svgRef.current ? vb.w / svgRef.current.clientWidth : 1);
  const zoom = (f: number) => setVb((v) => {
    const w = Math.min(Math.max(v.w * f, 200), 6000);
    const h = (w / v.w) * v.h;
    return { x: v.x + (v.w - w) / 2, y: v.y + (v.h - h) / 2, w, h };
  });
  const onPointerDown = (e: RPointerEvent<SVGSVGElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    last.current = null;
  };
  const onPointerMove = (e: RPointerEvent<SVGSVGElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    const d = pts.length === 2 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : undefined;
    if (last.current) {
      const s = scale();
      const dx = (cx - last.current.x) * s;
      const dy = (cy - last.current.y) * s;
      setVb((v) => ({ ...v, x: v.x - dx, y: v.y - dy }));
      if (d && last.current.d) zoom(last.current.d / d);
    }
    last.current = { x: cx, y: cy, d };
  };
  const onPointerUp = (e: RPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    last.current = null;
  };
  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => zoom(e.deltaY > 0 ? 1.12 : 1 / 1.12);
  return { vb, setVb, zoom, svgRef, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onPointerLeave: onPointerUp, onWheel } };
}

function MapFrame({ nodes, edges, onTap, height = 420, legend }: { nodes: Node[]; edges: Edge[]; onTap: (id: string) => void; height?: number; legend?: ReactNode }) {
  const bounds = useMemo(() => {
    const xs = nodes.map((n) => n.x), ys = nodes.map((n) => n.y);
    const pad = 90;
    const x = Math.min(...xs, 0) - pad, y = Math.min(...ys, 0) - pad;
    return { x, y, w: Math.max(...xs, 0) + pad - x, h: Math.max(...ys, 0) + pad - y };
  }, [nodes]);
  const { vb, setVb, zoom, svgRef, handlers } = usePanZoom(bounds);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const moved = useRef(false);
  return (
    <div className="graph-map">
      <svg ref={svgRef} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{ height }} role="img" aria-label={L("Knowledge map", "Bilgi haritası")}
        {...handlers}
        onPointerDown={(e) => { moved.current = false; handlers.onPointerDown(e); }}
        onPointerMove={(e) => { if (e.buttons || e.pointerType === "touch") moved.current = true; handlers.onPointerMove(e); }}>
        <defs>
          <marker id="gm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--border-strong)" />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const a = byId.get(e.from), b = byId.get(e.to);
          if (!a || !b) return null;
          const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
          const x2 = b.x - (dx / len) * (b.r + 4), y2 = b.y - (dy / len) * (b.r + 4);
          return <line key={i} x1={a.x} y1={a.y} x2={x2} y2={y2} className={`gm-edge gm-${e.kind}`} style={e.w ? { strokeWidth: Math.min(1 + Math.log2(e.w), 7) } : undefined} markerEnd={e.kind === "link" ? undefined : "url(#gm-arrow)"} />;
        })}
        {nodes.map((n) => (
          <g key={n.id} className={`gm-node ${n.focus ? "focus" : ""} ${n.dim ? "dim" : ""}`} transform={`translate(${n.x},${n.y})`}
            onClick={() => !moved.current && onTap(n.id)} role="button" aria-label={n.label} tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onTap(n.id)}>
            {n.ring && <circle r={n.r + 5} fill="none" stroke={n.ring} strokeWidth={2.5} />}
            <circle r={n.r} fill={n.color} fillOpacity={n.focus ? 0.95 : 0.8} />
            <text y={n.r + 15} textAnchor="middle" className="gm-label">{n.label.length > 26 ? `${n.label.slice(0, 25)}…` : n.label}</text>
          </g>
        ))}
      </svg>
      <div className="gm-tools">
        <button className="btn small" onClick={() => zoom(1 / 1.3)} aria-label={L("Zoom in", "Yakınlaştır")}>+</button>
        <button className="btn small" onClick={() => zoom(1.3)} aria-label={L("Zoom out", "Uzaklaştır")}>−</button>
        <button className="btn small" onClick={() => setVb(bounds)}>{L("Fit", "Sığdır")}</button>
      </div>
      {legend}
    </div>
  );
}

function Legend() {
  return (
    <div className="gm-legend tiny muted">
      <span><i className="gm-swatch pre" /> {L("required", "zorunlu")}</span>
      <span><i className="gm-swatch soft" /> {L("soft", "yumuşak")}</span>
      <span><i className="gm-swatch link" /> {L("interdisciplinary", "disiplinlerarası")}</span>
      <span><i className="gm-swatch ring" /> {L("known / mastered", "biliniyor")}</span>
    </div>
  );
}

/**
 * Neighbourhood of one object: prerequisites above (two levels), what it opens
 * below, interdisciplinary links to the sides. Tap a node to re-centre.
 */
export function NeighbourhoodMap({ pg, focus, onFocus, onOpen }: { pg: PersonalGraph; focus: string; onFocus: (id: string) => void; onOpen: (id: string) => void }) {
  const { g } = pg;
  const o = g.objects[focus];
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const seen = new Set<string>();
    const mk = (id: string, x: number, y: number, extra: Partial<Node> = {}) => {
      if (seen.has(id) || !g.objects[id]) return;
      seen.add(id);
      const st = pg.progress.get(id)?.state;
      nodes.push({ id, x, y, label: g.objects[id].title, color: DOMAIN_COLOR[g.objects[id].domain], ring: st ? STATE_RING[st] : undefined, r: 14, ...extra });
    };
    const row = (ids: string[], y: number, gap = 150) => ids.forEach((id, i) => mk(id, (i - (ids.length - 1) / 2) * gap, y));
    mk(focus, 0, 0, { focus: true, r: 22 });
    const pre1 = o.prerequisites.map((p) => p.id).filter((id) => g.objects[id]);
    row(pre1, -150);
    const pre2 = [...new Set(pre1.flatMap((id) => g.objects[id].prerequisites.filter((p) => p.strength === "ZORUNLU").map((p) => p.id)))].filter((id) => g.objects[id] && !pre1.includes(id) && id !== focus).slice(0, 8);
    row(pre2, -290, 130);
    for (const p of o.prerequisites) edges.push({ from: p.id, to: focus, kind: p.strength === "ZORUNLU" ? "pre" : "soft" });
    for (const id of pre1) for (const p of g.objects[id].prerequisites) if (pre2.includes(p.id)) edges.push({ from: p.id, to: id, kind: p.strength === "ZORUNLU" ? "pre" : "soft" });
    const un = o.unlocks.slice(0, 8);
    row(un, 160);
    for (const u of un) edges.push({ from: focus, to: u, kind: g.objects[u].prerequisites.find((p) => p.id === focus)?.strength === "ZORUNLU" ? "pre" : "soft" });
    const links = [...o.interdisciplinaryLinks.map((l) => l.id), ...g.order.filter((id) => g.objects[id].interdisciplinaryLinks.some((l) => l.id === focus))]
      .filter((id, i, a) => g.objects[id] && a.indexOf(id) === i && !seen.has(id)).slice(0, 8);
    links.forEach((id, i) => {
      const side = i % 2 ? 1 : -1;
      const k = Math.floor(i / 2);
      mk(id, side * (240 + k * 40), -60 + k * 75);
      edges.push({ from: focus, to: id, kind: "link" });
    });
    return { nodes, edges };
  }, [g, pg, focus, o]);
  return (
    <div className="stack" style={{ gap: 6 }}>
      <MapFrame key={focus} nodes={nodes} edges={edges} onTap={(id) => (id === focus ? onOpen(id) : onFocus(id))} legend={<Legend />} />
      <p className="tiny muted">{L("Tap a node to move the map there; tap the centre to open it. Drag to pan, pinch or use +/− to zoom.", "Haritayı oraya taşımak için bir düğüme dokun; açmak için merkeze dokun. Kaydırmak için sürükle, yakınlaştırmak için iki parmak ya da +/− kullan.")}</p>
    </div>
  );
}

/** A whole domain laid out by prerequisite depth (left to right) — the field at a glance. */
export function DomainMap({ pg, domain, onOpen }: { pg: PersonalGraph; domain: Domain; onOpen: (id: string) => void }) {
  const { g } = pg;
  const { nodes, edges } = useMemo(() => {
    const ids = g.order.filter((id) => g.objects[id].domain === domain && g.objects[id].status !== "KULLANIM_DISI" && g.objects[id].status !== "YERINE_GECILDI");
    const set = new Set(ids);
    const pm = new Map(ids.map((id) => [id, g.objects[id].prerequisites.map((p) => p.id).filter((p) => set.has(p))]));
    const d = depths(pm, (id) => g.order.indexOf(id));
    const cols = new Map<number, string[]>();
    for (const id of ids) {
      const k = d.get(id) ?? 0;
      if (!cols.has(k)) cols.set(k, []);
      cols.get(k)!.push(id);
    }
    const nodes: Node[] = [];
    for (const [k, list] of cols) {
      list.forEach((id, i) => {
        const st = pg.progress.get(id)?.state;
        nodes.push({ id, x: k * 190, y: (i - (list.length - 1) / 2) * 70, label: g.objects[id].title, color: DOMAIN_COLOR[domain], ring: st ? STATE_RING[st] : undefined, dim: st === "ONKOSUL_EKSIK", r: 11 });
      });
    }
    const edges: Edge[] = ids.flatMap((id) => g.objects[id].prerequisites.filter((p) => set.has(p.id)).map((p) => ({ from: p.id, to: id, kind: p.strength === "ZORUNLU" ? ("pre" as const) : ("soft" as const) })));
    return { nodes, edges };
  }, [g, pg, domain]);
  return <MapFrame key={domain} nodes={nodes} edges={edges} onTap={onOpen} height={460} legend={<Legend />} />;
}

/** Every domain as one bubble; edge thickness = number of links/prerequisites between two domains. */
export function AtlasMap({ g, onDomain }: { g: KnowledgeGraph; onDomain: (d: Domain) => void }) {
  const { nodes, edges } = useMemo(() => {
    const present = DOMAINS.filter((d) => g.order.some((id) => g.objects[id].domain === d));
    const count = (d: Domain) => g.order.filter((id) => g.objects[id].domain === d).length;
    const R = 300;
    const nodes: Node[] = present.map((d, i) => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / present.length;
      return { id: d, x: Math.cos(a) * R, y: Math.sin(a) * R, label: `${domainLabel(d)} (${count(d)})`, color: DOMAIN_COLOR[d], r: 10 + Math.sqrt(count(d)) * 2.4 };
    });
    const w = new Map<string, number>();
    for (const id of g.order) {
      const o = g.objects[id];
      for (const t of [...o.prerequisites.map((p) => p.id), ...o.interdisciplinaryLinks.map((l) => l.id)]) {
        const td = g.objects[t]?.domain;
        if (!td || td === o.domain) continue;
        const key = [o.domain, td].sort().join("|");
        w.set(key, (w.get(key) ?? 0) + 1);
      }
    }
    const edges: Edge[] = [...w.entries()].filter(([, n]) => n >= 2).map(([k, n]) => {
      const [a, b] = k.split("|");
      return { from: a, to: b, kind: "link" as const, w: n };
    });
    return { nodes, edges };
  }, [g]);
  return (
    <div className="stack" style={{ gap: 6 }}>
      <MapFrame nodes={nodes} edges={edges} onTap={(d) => onDomain(d as Domain)} height={440} />
      <p className="tiny muted">{L("Each bubble is a field; lines show how many ideas connect two fields. Tap a field to see its map.", "Her baloncuk bir alan; çizgiler iki alanı kaç fikrin bağladığını gösterir. Haritasını görmek için bir alana dokun.")}</p>
    </div>
  );
}
