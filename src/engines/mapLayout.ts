/**
 * Layered layout for the progression map: layers by prerequisite depth
 * (top → bottom for portrait screens), ordered within a layer by barycenter
 * sweeps to reduce edge crossings. Pure and UI-independent.
 */
import type { ID, Milestone } from "../domain/types";
import { depths, type PrereqMap } from "./graph";

export interface MapNode {
  id: ID;
  x: number;
  y: number;
  layer: number;
}

export interface MapEdge {
  from: ID;
  to: ID;
  path: string;
}

export interface MapLayout {
  nodes: Map<ID, MapNode>;
  edges: MapEdge[];
  width: number;
  height: number;
  layers: ID[][];
  colWidth: number;
}

export function layoutMap(
  milestones: Milestone[],
  opts: { minWidth: number; colWidth?: number; rowHeight?: number; padX?: number; padY?: number } = { minWidth: 360 },
): MapLayout {
  const rowH = opts.rowHeight ?? 128;
  const padX = opts.padX ?? 24;
  const padY = opts.padY ?? 44;
  const byId = new Map(milestones.map((m) => [m.id, m]));
  const pm: PrereqMap = new Map(milestones.map((m) => [m.id, m.prerequisites.filter((p) => byId.has(p))]));
  const depth = depths(pm, (id) => byId.get(id)?.order ?? 0);

  const layers: ID[][] = [];
  for (const m of [...milestones].sort((a, b) => a.order - b.order)) {
    const d = depth.get(m.id) ?? 0;
    (layers[d] ??= []).push(m.id);
  }
  for (let i = 0; i < layers.length; i++) layers[i] ??= [];

  // Barycenter sweeps (down then up) to reduce crossings.
  const pos = new Map<ID, number>();
  const setPos = () => layers.forEach((l) => l.forEach((id, i) => pos.set(id, i / Math.max(1, l.length - 1 || 1))));
  setPos();
  const dependents = new Map<ID, ID[]>();
  for (const [id, ps] of pm) for (const p of ps) (dependents.get(p) ?? dependents.set(p, []).get(p)!).push(id);
  const bary = (ids: ID[]) => (ids.length ? ids.reduce((s, x) => s + (pos.get(x) ?? 0.5), 0) / ids.length : null);
  for (let sweep = 0; sweep < 4; sweep++) {
    const down = sweep % 2 === 0;
    const range = down ? layers.map((_, i) => i).slice(1) : layers.map((_, i) => i).slice(0, -1).reverse();
    for (const li of range) {
      const l = layers[li];
      const keyed = l.map((id, i) => ({ id, i, b: bary(down ? pm.get(id) ?? [] : dependents.get(id) ?? []) }));
      keyed.sort((a, b) => (a.b ?? a.i / Math.max(1, l.length)) - (b.b ?? b.i / Math.max(1, l.length)) || a.i - b.i);
      layers[li] = keyed.map((k) => k.id);
      setPos();
    }
  }

  const maxCols = Math.max(1, ...layers.map((l) => l.length));
  // Fit the widest layer to the screen when possible; scroll only beyond that.
  const colW = opts.colWidth ?? Math.min(160, Math.max(108, (opts.minWidth - padX * 2) / maxCols));
  const width = Math.max(opts.minWidth, padX * 2 + maxCols * colW);
  const nodes = new Map<ID, MapNode>();
  layers.forEach((l, li) => {
    const span = l.length * colW;
    const start = (width - span) / 2 + colW / 2;
    l.forEach((id, i) => nodes.set(id, { id, layer: li, x: start + i * colW, y: padY + li * rowH }));
  });
  const height = padY * 2 + Math.max(0, layers.length - 1) * rowH + 40;

  const edges: MapEdge[] = [];
  for (const [id, ps] of pm) {
    const to = nodes.get(id)!;
    for (const p of ps) {
      const from = nodes.get(p)!;
      const y1 = from.y + 50, y2 = to.y - 24; // leave room for the two-line label
      const my = (y1 + y2) / 2;
      edges.push({ from: p, to: id, path: `M${from.x},${y1} C${from.x},${my} ${to.x},${my} ${to.x},${y2}` });
    }
  }
  return { nodes, edges, width, height, layers, colWidth: colW };
}
