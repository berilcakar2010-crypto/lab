import { useMemo, useState } from "react";
import { usePanZoom } from "./panZoom";
import { L } from "../../i18n";
import { mindLayout, mindMapMarkdown, type MindNode, type PlacedNode } from "../../study/mindmap";
import { saveBlobFile, saveTextFile } from "../native";
import { toast } from "../state";

const TONE: Record<string, string> = {
  idea: "#e28a9a", why: "#e0b46a", ask: "#8fb5f0", do: "#9cc5a1", warn: "#ef7a7a", need: "#c7a3ef",
  open: "#7fc8b8", link: "#a7a3ef", mine: "#f3e9e1", unit: "#e28a9a",
};

/** Splits a label into at most `lines` lines of about `width` characters. */
function wrap(text: string, width: number, lines: number): string[] {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > width && cur) {
      out.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
    if (out.length === lines) break;
  }
  if (out.length < lines && cur) out.push(cur);
  if (out.length === lines && words.join(" ").length > out.join(" ").length) out[lines - 1] = `${out[lines - 1].replace(/…$/, "")}…`;
  return out;
}

function NodeBox({ p, onTap, selected, delay }: { p: PlacedNode; onTap: () => void; selected: boolean; delay: number }) {
  const n = p.node;
  const cls = n.kind === "root" ? "mm-root" : n.kind === "branch" ? "mm-branch" : "mm-leaf";
  const [w, lines] = n.kind === "root" ? [200, wrap(n.label, 20, 3)] : n.kind === "branch" ? [140, wrap(n.label, 17, 2)] : [230, wrap(n.label, 32, 3)];
  const lh = n.kind === "root" ? 20 : 15;
  const h = lines.length * lh + 14;
  const color = TONE[n.tone ?? ""] ?? "#e28a9a";
  return (
    <g className={`mm-node ${cls}`} transform={`translate(${p.x},${p.y})`} style={{ animationDelay: `${delay}s` }} onClick={onTap} role="button" tabIndex={0} aria-label={n.detail ?? n.label}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onTap()}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={n.kind === "leaf" ? 8 : 12}
        style={n.kind === "branch" ? { stroke: color } : n.kind === "leaf" ? { stroke: selected ? color : undefined } : undefined} />
      {n.kind === "leaf" && <rect x={-w / 2} y={-h / 2} width={4} height={h} rx={2} fill={color} />}
      <text textAnchor="middle">
        {lines.map((l, i) => <tspan key={i} x={0} y={-h / 2 + 7 + lh * (i + 0.78)}>{l}</tspan>)}
      </text>
    </g>
  );
}

export function MindMapView({ root, onOpenObject, onAddItem, fileName }: {
  root: MindNode;
  onOpenObject?: (id: string) => void;
  onAddItem?: (text: string) => void;
  fileName: string;
}) {
  const placed = useMemo(() => mindLayout(root), [root]);
  const [sel, setSel] = useState<PlacedNode | null>(null);
  const [add, setAdd] = useState("");
  const vb = useMemo(() => {
    const pad = 130;
    const xs = placed.map((p) => p.x), ys = placed.map((p) => p.y);
    if (!xs.length) return { x: -pad, y: -pad, w: 2 * pad, h: 2 * pad };
    return { x: Math.min(...xs) - pad, y: Math.min(...ys) - pad, w: Math.max(...xs) - Math.min(...xs) + 2 * pad, h: Math.max(...ys) - Math.min(...ys) + 2 * pad };
  }, [placed]);
  const { vb: view, fit, zoom, svgRef, wasDrag, handlers } = usePanZoom(vb);
  const viewBox = `${view.x} ${view.y} ${view.w} ${view.h}`;
  // A selection from an older version of the map (e.g. after adding a branch) is dropped.
  const selected = sel && placed.find((p) => p.node.id === sel.node.id) ? sel : null;

  const svgText = () => {
    const el = svgRef.current;
    if (!el) return "";
    const clone = el.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    clone.setAttribute("width", String(Math.round(vb.w)));
    clone.setAttribute("height", String(Math.round(vb.h)));
    // Inline the theme so the file looks the same outside the app.
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `text{font-family:Georgia,serif} .mm-line{stroke:#5a3039;fill:none;stroke-width:1.5}
      .mm-root rect{fill:#8e1f36} .mm-root text{fill:#fbf3ec;font-size:17px} .mm-branch rect{fill:#331c24;stroke-width:1.5}
      .mm-branch text{fill:#f3e9e1;font-size:13px;font-weight:600} .mm-leaf rect{fill:#1f1015;stroke:#3e2229} .mm-leaf text{fill:#d2bfb5;font-size:11.5px}`;
    clone.insertBefore(style, clone.firstChild);
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", String(vb.x)); bg.setAttribute("y", String(vb.y)); bg.setAttribute("width", String(vb.w)); bg.setAttribute("height", String(vb.h)); bg.setAttribute("fill", "#150a0d");
    clone.insertBefore(bg, style.nextSibling);
    return new XMLSerializer().serializeToString(clone);
  };
  const exportPng = async () => {
    try {
      const svg = svgText();
      const img = new Image();
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error("image")); img.src = url; });
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(vb.w * scale);
      canvas.height = Math.round(vb.h * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const blob: Blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("png"))), "image/png"));
      await saveBlobFile(`${fileName}.png`, blob);
    } catch {
      toast(L("Could not create the image; try SVG.", "Görsel oluşturulamadı; SVG'yi dene."), "error");
    }
  };

  return (
    <div className="stack" style={{ gap: 8 }}>
      <div className="mind-map graph-map">
        <svg ref={svgRef} viewBox={viewBox} style={{ height: 460 }} role="img" aria-label={L(`Mind map: ${root.label}`, `Zihin haritası: ${root.label}`)}
          {...handlers}>
          {placed.filter((p) => p.parent).map((p) => {
            const a = p.parent!;
            // Horizontal S-curves from the parent's edge to the child's edge.
            const x1 = a.x + p.side * (a.depth === 0 ? 100 : 70), x2 = p.x - p.side * (p.depth === 1 ? 70 : 115);
            const mx = (x1 + x2) / 2;
            return <path key={`l-${p.node.id}`} className="mm-line" d={`M${x1},${a.y} C${mx},${a.y} ${mx},${p.y} ${x2},${p.y}`}
              style={p.depth === 1 ? { stroke: TONE[p.node.tone ?? ""] ?? undefined, strokeOpacity: 0.6 } : undefined} />;
          })}
          {[...placed].reverse().map((p, i, all) => <NodeBox key={p.node.id} p={p} delay={p.depth === 0 ? 0 : p.depth === 1 ? 0.08 + (all.length - i) * 0.004 : 0.25 + (all.length - i) * 0.008} selected={selected?.node.id === p.node.id} onTap={() => !wasDrag() && setSel(p)} />)}
        </svg>
        <div className="gm-tools">
          <button className="btn small" onClick={() => zoom(1 / 1.25)} aria-label={L("Zoom in", "Yakınlaştır")}>+</button>
          <button className="btn small" onClick={() => zoom(1.25)} aria-label={L("Zoom out", "Uzaklaştır")}>−</button>
          <button className="btn small" onClick={fit}>{L("Fit", "Sığdır")}</button>
        </div>
      </div>
      {selected && (
        <div className="card stack" style={{ gap: 6 }}>
          <span className="eyebrow">{selected.parent?.node.kind === "branch" ? selected.parent.node.label : selected.node.kind === "root" ? L("Topic", "Konu") : L("Branch", "Dal")}</span>
          <p className="small" style={{ margin: 0 }}>{selected.node.detail ?? selected.node.label}</p>
          {selected.node.loId && onOpenObject && selected.node.kind !== "root" && (
            <button className="btn small" style={{ alignSelf: "flex-start" }} onClick={() => onOpenObject(selected.node.loId!)}>{L("Open this object", "Bu nesneyi aç")}</button>
          )}
        </div>
      )}
      {onAddItem && (
        <div className="row nowrap">
          <input className="input grow" value={add} onChange={(e) => setAdd(e.target.value)} placeholder={L("Add your own branch (a fact, a trick, an example)…", "Kendi dalını ekle (bir bilgi, bir püf noktası, bir örnek)…")}
            onKeyDown={(e) => { if (e.key === "Enter" && add.trim()) { onAddItem(add.trim()); setAdd(""); } }} aria-label={L("New branch", "Yeni dal")} />
          <button className="btn" disabled={!add.trim()} onClick={() => { onAddItem(add.trim()); setAdd(""); }}>{L("Add", "Ekle")}</button>
        </div>
      )}
      <div className="row">
        <button className="btn small ghost" onClick={() => saveTextFile(`${fileName}.svg`, svgText(), "image/svg+xml")}>SVG</button>
        <button className="btn small ghost" onClick={exportPng}>PNG</button>
        <button className="btn small ghost" onClick={() => saveTextFile(`${fileName}.md`, mindMapMarkdown(root), "text/markdown")}>{L("Outline (Markdown)", "Taslak (Markdown)")}</button>
      </div>
    </div>
  );
}
