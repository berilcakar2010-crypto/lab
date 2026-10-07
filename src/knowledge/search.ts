/**
 * Section 37: before building an isolated course, look for the request in the
 * existing graph. A learning path or a set of objects that matches the request
 * is returned so the builder can show readiness instead of starting from zero.
 */
import { LEARNING_PATHS, type LearningPath } from "./paths";
import { DOMAIN_LABEL, type KnowledgeGraph } from "./schema";

const STOP = new Set(["ve", "ile", "için", "bir", "öğrenmek", "istiyorum", "çalışmak", "ders", "dersi", "giriş", "temel", "temelleri", "the", "and", "of", "to", "learn"]);

const tokens = (s: string) =>
  s.toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}\s-]+/gu, " ").split(/[\s-]+/).filter((t) => t.length > 2 && !STOP.has(t));

/** Prefix match so Turkish suffixes still match ("nörobilimi" ~ "nörobilim"). */
const near = (a: string, b: string) => {
  const n = Math.min(a.length, b.length, 6);
  return n >= 4 ? a.slice(0, n) === b.slice(0, n) : a === b;
};

export interface GraphMatch {
  path?: LearningPath;
  /** Matching objects, best first. */
  objects: string[];
}

export function matchRequest(g: KnowledgeGraph, text: string, limit = 6): GraphMatch {
  const q = tokens(text);
  if (!q.length) return { objects: [] };
  const score = (hay: string) => {
    const h = tokens(hay);
    return q.filter((t) => h.some((x) => near(t, x))).length / q.length;
  };
  const path = LEARNING_PATHS
    .map((p) => ({ p, s: score(p.title) }))
    .filter((x) => x.s >= 0.99)
    .sort((a, b) => b.s - a.s)[0]?.p;
  const scored = g.order
    .map((id) => {
      const o = g.objects[id];
      const title = score(o.title);
      const ctx = score(`${o.unit} ${o.field} ${DOMAIN_LABEL[o.domain]} ${o.tags.join(" ")}`);
      return { id, s: title * 2 + ctx + (o.boss ? 0.2 : 0) };
    })
    .filter((x) => x.s >= 1)
    .sort((a, b) => b.s - a.s || g.order.indexOf(a.id) - g.order.indexOf(b.id));
  return { path, objects: scored.slice(0, limit).map((x) => x.id) };
}
