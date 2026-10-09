/**
 * Semantic search over the knowledge graph with text embeddings, when the
 * chosen provider can embed (Gemini). Only public graph text (title,
 * description, objectives) and the query are sent — never the learner's data.
 *
 * Object vectors are computed once per graph version and kept in a local
 * cache (memory + localStorage, as compact Float32 base64), so a search costs
 * one small request: the query. Without an embedding provider the search
 * falls back to the lexical global search, and says so.
 */
import type { AIProviderId, LabDB } from "../domain/types";
import type { KnowledgeGraph } from "../knowledge/schema";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { capabilitiesOf, EMBED_DIMS, EMBED_MODEL, makeProvider, type AIProvider } from "./providers";
import type { AIHost } from "./engine";

export interface SemanticHit { id: string; score: number }

type Index = { key: string; ids: string[]; vecs: Float32Array[] };
let memory: Index | null = null;
const STORE_KEY = "lab.semantic.v1";

export const objectText = (g: KnowledgeGraph, id: string) => {
  const o = g.objects[id];
  return [o.title, ...(o.aliases ?? []), o.description, ...o.learningObjectives.slice(0, 3), o.field].filter(Boolean).join(". ");
};

const norm = (v: number[] | Float32Array): Float32Array => {
  let s = 0;
  for (const x of v) s += x * x;
  const n = Math.sqrt(s) || 1;
  return Float32Array.from(v, (x) => x / n);
};
const dot = (a: Float32Array, b: Float32Array) => {
  let s = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) s += a[i] * b[i];
  return s;
};

function encode(ix: Index): string {
  const flat = new Float32Array(ix.vecs.length * EMBED_DIMS);
  ix.vecs.forEach((v, i) => flat.set(v.subarray(0, EMBED_DIMS), i * EMBED_DIMS));
  const bytes = new Uint8Array(flat.buffer);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return JSON.stringify({ key: ix.key, ids: ix.ids, data: btoa(bin) });
}

function decode(s: string): Index | null {
  try {
    const o = JSON.parse(s) as { key: string; ids: string[]; data: string };
    const bin = atob(o.data);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const flat = new Float32Array(bytes.buffer);
    return { key: o.key, ids: o.ids, vecs: o.ids.map((_, i) => flat.subarray(i * EMBED_DIMS, (i + 1) * EMBED_DIMS)) };
  } catch {
    return null;
  }
}

export const indexKey = (g: KnowledgeGraph, provider: AIProviderId) => `${provider}|${EMBED_MODEL}|${EMBED_DIMS}|${g.version}|${g.order.length}|${g.objects[g.order[0]]?.title ?? ""}`;

export function canEmbed(p: AIProvider): boolean {
  return p.ready() && capabilitiesOf(p).embed && typeof p.embed === "function";
}

async function ensureIndex(host: AIHost, g: KnowledgeGraph, p: AIProvider): Promise<Index> {
  const key = indexKey(g, p.id);
  if (memory?.key === key) return memory;
  try {
    const cached = typeof localStorage !== "undefined" ? localStorage.getItem(STORE_KEY) : null;
    const ix = cached ? decode(cached) : null;
    if (ix?.key === key) return (memory = ix);
  } catch { /* storage unavailable */ }
  const ids = [...g.order];
  const vecs = (await p.embed!(ids.map((id) => objectText(g, id)))).map(norm);
  memory = { key, ids, vecs };
  try { localStorage.setItem(STORE_KEY, encode(memory)); } catch { /* quota: keep in memory only */ }
  host.record((db) => recordCall(db, p, true, `index ${ids.length} objects`));
  return memory;
}

function recordCall(db: LabDB, p: AIProvider, ok: boolean, summary: string, error?: string) {
  const id = newId("ai");
  db.aiInteractions[id] = { id, role: "SEMANTIC_SEARCH", provider: p.id, model: EMBED_MODEL, ok, fallbackUsed: !ok, latencyMs: 0, summary, error, createdAt: Date.now() };
  logEvent(db, "AI_INTERACTION", {}, { role: "SEMANTIC_SEARCH", provider: p.id, ok });
}

/** Objects closest in meaning to the query, best first. Throws when no embedding provider is available. */
export async function semanticSearch(host: AIHost, g: KnowledgeGraph, query: string, k = 8): Promise<SemanticHit[]> {
  const p = host.provider ?? makeProvider(host.db().preferences);
  if (!canEmbed(p)) throw new Error("no-embeddings");
  try {
    const ix = await ensureIndex(host, g, p);
    const [q] = (await p.embed!([query])).map(norm);
    host.record((db) => recordCall(db, p, true, `search "${query.slice(0, 60)}"`));
    return ix.ids.map((id, i) => ({ id, score: dot(q, ix.vecs[i]) })).filter((h) => g.objects[h.id]).sort((a, b) => b.score - a.score).slice(0, k);
  } catch (e) {
    host.record((db) => recordCall(db, p, false, `search "${query.slice(0, 60)}"`, e instanceof Error ? e.message : String(e)));
    throw e;
  }
}

export function clearSemanticIndex(): void {
  memory = null;
  try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
}
