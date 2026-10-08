/**
 * Mind maps for recall at a glance. A map is a small tree: the object in the
 * centre, then branches the learner can scan in seconds — the core idea, why it
 * matters, what to ask, what you can do, pitfalls, what it needs, what it opens,
 * links to other fields — plus the learner's own branch. Domain maps show a
 * whole field: units around the domain, objects around each unit.
 */
import type { StudyNote } from "../domain/types";
import { L } from "../i18n";
import { domainLabel, type Domain, type KnowledgeGraph, type LearningObject } from "../knowledge/schema";

export interface MindNode {
  id: string;
  label: string;
  /** Longer text shown on tap. */
  detail?: string;
  kind: "root" | "branch" | "leaf";
  /** Knowledge-graph object this node opens, if any. */
  loId?: string;
  tone?: "idea" | "why" | "ask" | "do" | "warn" | "need" | "open" | "link" | "mine" | "unit";
  children: MindNode[];
}

/** First sentence, shortened: maps are for recall, the detail is one tap away. */
export function gist(text: string, max = 70): string {
  const first = text.split(/(?<=[.!?…])\s+/)[0] ?? text;
  return first.length <= max ? first : `${first.slice(0, max - 1).trimEnd()}…`;
}

const leaf = (id: string, text: string, extra: Partial<MindNode> = {}): MindNode => ({ id, label: gist(text), detail: text, kind: "leaf", children: [], ...extra });

export function objectMindMap(o: LearningObject, g: KnowledgeGraph, note?: StudyNote): MindNode {
  const t = (id: string) => g.objects[id]?.title ?? id;
  const branch = (id: string, label: string, tone: MindNode["tone"], children: MindNode[]): MindNode | null =>
    children.length ? { id, label, kind: "branch", tone, children } : null;
  const branches = [
    branch("idea", L("Core idea", "Ana fikir"), "idea", [leaf("idea.0", o.description, { tone: "idea" })]),
    branch("why", L("Why it matters", "Neden önemli"), "why", [leaf("why.0", o.whyItMatters, { tone: "why" })]),
    branch("ask", L("Ask yourself", "Kendine sor"), "ask", [...o.entryQuestions, ...o.coreQuestions].slice(0, 4).map((q, i) => leaf(`ask.${i}`, q, { tone: "ask" }))),
    branch("do", L("You can", "Yapabilirsin"), "do", o.learningObjectives.slice(0, 4).map((x, i) => leaf(`do.${i}`, x, { tone: "do" }))),
    branch("warn", L("Watch out", "Dikkat"), "warn", o.commonMisconceptions.slice(0, 3).map((x, i) => leaf(`warn.${i}`, x, { tone: "warn" }))),
    branch("need", L("Builds on", "Dayandığı"), "need", o.prerequisites.filter((p) => g.objects[p.id]).slice(0, 5).map((p, i) => leaf(`need.${i}`, t(p.id), { tone: "need", loId: p.id }))),
    branch("open", L("Opens", "Açtığı"), "open", o.unlocks.slice(0, 5).map((u, i) => leaf(`open.${i}`, t(u), { tone: "open", loId: u }))),
    branch("link", L("Links", "Bağlantılar"), "link", o.interdisciplinaryLinks.filter((l) => g.objects[l.id]).slice(0, 4).map((l, i) =>
      leaf(`link.${i}`, `${t(l.id)} — ${l.relation}`, { tone: "link", loId: l.id, label: gist(t(l.id), 40) }))),
    branch("mine", L("My notes", "Notlarım"), "mine", (note?.mapItems ?? []).map((x, i) => leaf(`mine.${i}`, x, { tone: "mine" }))),
  ].filter((b): b is MindNode => !!b);
  return { id: o.id, label: o.title, detail: o.description, kind: "root", loId: o.id, children: branches };
}

/** A whole domain: units as branches, objects as leaves (in graph order). */
export function domainMindMap(g: KnowledgeGraph, domain: Domain, maxPerUnit = 8): MindNode {
  const units = new Map<string, string[]>();
  for (const id of g.order) {
    const o = g.objects[id];
    if (o.domain !== domain || o.status === "KULLANIM_DISI" || o.status === "YERINE_GECILDI") continue;
    const u = o.unit || o.field;
    if (!units.has(u)) units.set(u, []);
    units.get(u)!.push(id);
  }
  return {
    id: `domain.${domain}`,
    label: domainLabel(domain),
    kind: "root",
    children: [...units.entries()].map(([u, ids], i) => ({
      id: `unit.${i}`,
      label: u,
      kind: "branch" as const,
      tone: "unit" as const,
      children: ids.slice(0, maxPerUnit).map((id) => leaf(id, g.objects[id].title, { loId: id, detail: g.objects[id].description })),
    })),
  };
}

/** Indented outline (Markdown) — for export and for screen readers. */
export function mindMapMarkdown(root: MindNode): string {
  const lines = [`# ${root.label}`];
  const walk = (n: MindNode, depth: number) => {
    for (const c of n.children) {
      lines.push(`${"  ".repeat(depth)}- ${c.detail && c.kind === "leaf" ? c.detail : c.label}`);
      walk(c, depth + 1);
    }
  };
  walk(root, 0);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Radial layout
// ---------------------------------------------------------------------------

export interface PlacedNode {
  node: MindNode;
  x: number;
  y: number;
  depth: number;
  angle: number;
  parent?: PlacedNode;
}

/**
 * Places branches around the root and leaves fanned out beyond their branch.
 * Angular space is shared in proportion to each branch's leaf count so dense
 * branches do not overlap sparse ones.
 */
export function radialLayout(root: MindNode, r1 = 150, r2 = 290): PlacedNode[] {
  const out: PlacedNode[] = [];
  const center: PlacedNode = { node: root, x: 0, y: 0, depth: 0, angle: 0 };
  out.push(center);
  const weights = root.children.map((b) => Math.max(1, b.children.length));
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  let a0 = -Math.PI / 2;
  root.children.forEach((b, i) => {
    const span = (2 * Math.PI * weights[i]) / total;
    const mid = a0 + span / 2;
    const bp: PlacedNode = { node: b, x: Math.cos(mid) * r1, y: Math.sin(mid) * r1, depth: 1, angle: mid, parent: center };
    out.push(bp);
    const n = b.children.length;
    b.children.forEach((c, j) => {
      const a = n === 1 ? mid : a0 + (span * (j + 0.5)) / n;
      const r = r2 + (n > 3 && j % 2 ? 46 : 0);
      out.push({ node: c, x: Math.cos(a) * r, y: Math.sin(a) * r, depth: 2, angle: a, parent: bp });
    });
    a0 += span;
  });
  return out;
}
