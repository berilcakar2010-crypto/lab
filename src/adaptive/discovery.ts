/**
 * Discovery: curiosity built from real graph relationships, never invented.
 *
 *  - whyMatters: what the object actually connects to (dependents, links into
 *    other fields, research uses, school/AP/competition mappings);
 *  - whereLeads: what learning it opens up two steps ahead, and where it is
 *    used in research and in the learner's own projects;
 *  - discoveries: a short, rotating list (not an infinite feed) of
 *    connections from what the learner knows into new territory, unexplored
 *    adjacent areas, potential exploration questions and a weak spot;
 *  - newConnections: links that became complete when an object was learned
 *    ("you just connected A ↔ B");
 *  - explorationQuestions: "what could be explored further?" — always
 *    labelled as potential questions, never as open problems.
 */
import type { LabDB, Millis } from "../domain/types";
import type { KnowledgeGraph, LearningObject } from "../knowledge/schema";
import { domainLabel } from "../knowledge/schema";
import { incomingLinks, isActive, mappingsFor } from "../knowledge/graph";
import { personalGraph } from "../knowledge/state";
import { L } from "../i18n";
import { graphStructure } from "./pathPlanner";
import { masteryProfile } from "./mastery";
import { modelsFor } from "./sandbox";

const DAY = 86_400_000;

export interface Link { id: string; title: string; relation: string; domain: string; crossDomain: boolean }

export interface WhyMatters {
  /** Objects that build on this one, directly or further on. */
  dependents: number;
  direct: string[];
  links: Link[];
  research: string[];
  mappings: { framework: string; unit: string }[];
  /** One sentence, made only from the facts above. */
  summary: string;
}

const linkOf = (g: KnowledgeGraph, o: LearningObject, id: string, relation: string): Link | null => {
  const t = g.objects[id];
  return t ? { id, title: t.title, relation, domain: domainLabel(t.domain), crossDomain: t.domain !== o.domain } : null;
};

export function whyMatters(g: KnowledgeGraph, loId: string): WhyMatters | null {
  const o = g.objects[loId];
  if (!o) return null;
  const st = graphStructure(g);
  const links = [
    ...o.interdisciplinaryLinks.map((l) => linkOf(g, o, l.id, l.relation)),
    ...incomingLinks(g, loId).filter((l) => !o.interdisciplinaryLinks.some((x) => x.id === l.id)).map((l) => linkOf(g, o, l.id, l.relation)),
  ].filter((x): x is Link => !!x);
  const direct = o.unlocks.filter((u) => g.objects[u]);
  const dependents = st.descendants.get(loId) ?? 0;
  const mappings = mappingsFor(g, loId).map((m) => ({ framework: m.framework, unit: m.unit }));
  const fields = [...new Set(links.filter((l) => l.crossDomain).map((l) => l.domain))];
  const parts: string[] = [];
  if (dependents) parts.push(L(`${dependents} other topics build on it`, `${dependents} başka konu bunun üzerine kurulu`));
  if (fields.length) parts.push(L(`it connects to ${fields.slice(0, 3).join(", ")}`, `${fields.slice(0, 3).join(", ")} alanlarına bağlanıyor`));
  if (o.researchApplications.length) parts.push(L(`it is used in ${o.researchApplications.length} research areas`, `${o.researchApplications.length} araştırma alanında kullanılıyor`));
  if (mappings.length) parts.push(L(`it appears in ${mappings.length} school/exam frameworks`, `${mappings.length} okul/sınav çerçevesinde geçiyor`));
  return { dependents, direct, links, research: o.researchApplications, mappings, summary: parts.length ? parts.join("; ") + "." : L("A self-contained topic: nothing in the graph depends on it yet.", "Kendi içinde bir konu: grafikte henüz ona dayanan bir şey yok.") };
}

export interface WhereLeads {
  next: string[];
  further: string[];
  research: string[];
  projects: { id: string; title: string }[];
  domains: string[];
}

export function whereLeads(db: LabDB, g: KnowledgeGraph, loId: string): WhereLeads | null {
  const o = g.objects[loId];
  if (!o) return null;
  const next = o.unlocks.filter((u) => g.objects[u] && isActive(g.objects[u]));
  const seen = new Set([loId, ...next]);
  const further: string[] = [];
  for (const n of next) for (const u of g.objects[n].unlocks) if (g.objects[u] && !seen.has(u) && isActive(g.objects[u])) { seen.add(u); further.push(u); }
  const domains = [...new Set([...next, ...further].map((id) => domainLabel(g.objects[id].domain)))];
  const projects = Object.values(db.projects).filter((p) => p.loIds.includes(loId) && p.status !== "ARCHIVED").map((p) => ({ id: p.id, title: p.title }));
  return { next, further: further.slice(0, 8), research: o.researchApplications, projects, domains };
}

// ---------------------------------------------------------------------------
// Discoveries
// ---------------------------------------------------------------------------

export type DiscoveryKind = "CONNECTION" | "ADJACENT" | "EXPLORATION" | "WEAK_SPOT";

export interface Discovery {
  kind: DiscoveryKind;
  /** Object to open. */
  loId: string;
  /** Object the discovery starts from, when there is one. */
  fromId?: string;
  title: string;
  detail: string;
  /** A question to think about first. */
  question?: string;
  score: number;
}

export const DISCOVERY_LABEL = (k: DiscoveryKind): string =>
  ({ CONNECTION: L("Connection", "Bağlantı"), ADJACENT: L("Unexplored area", "Keşfedilmemiş alan"), EXPLORATION: L("Potential exploration question", "Olası keşif sorusu"), WEAK_SPOT: L("Worth another look", "Bir daha bakmaya değer") })[k];

/** Small deterministic hash so the selection rotates by day without randomness in tests. */
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
};

export function discoveries(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now(), limit = 4): Discovery[] {
  const pg = personalGraph(db, g);
  const day = Math.floor(now / DAY);
  const known = g.order.filter((id) => pg.satisfied(id) || masteryProfile(db, id, now).verified >= 0.5);
  const touchedDomains = new Set(g.order.filter((id) => pg.progress.get(id)!.state !== "HAZIR" && pg.progress.get(id)!.state !== "ONKOSUL_EKSIK" && pg.progress.get(id)!.state !== "PASIF").map((id) => g.objects[id].domain));
  const recentlyShown = new Set(db.events.filter((e) => e.type === "DISCOVERY_SHOWN" && e.at > now - 2 * DAY).flatMap((e) => (e.data.loIds as string[] | undefined) ?? []));
  const out: Discovery[] = [];
  const fresh = (id: string) => !pg.satisfied(id) && isActive(g.objects[id]) && masteryProfile(db, id, now).evidenceCount === 0;

  for (const k of known) {
    const o = g.objects[k];
    for (const l of o.interdisciplinaryLinks) {
      const t = g.objects[l.id];
      if (!t || !fresh(l.id) || t.domain === o.domain) continue;
      const reachable = (pg.progress.get(l.id)?.missingRequired.length ?? 0) === 0;
      out.push({ kind: "CONNECTION", loId: l.id, fromId: k, title: `${o.title} ↔ ${t.title}`, detail: L(`What you know about "${o.title}" reappears in ${domainLabel(t.domain)}: ${l.relation}.`, `"${o.title}" hakkında bildiklerin ${domainLabel(t.domain)} alanında yeniden karşına çıkıyor: ${l.relation}.`), question: t.entryQuestions[0], score: 2 + (reachable ? 1 : 0) + hash(`${day}:${l.id}`) });
    }
  }
  for (const id of g.order) {
    const o = g.objects[id];
    if (touchedDomains.has(o.domain) || !fresh(id) || o.prerequisites.some((p) => p.strength === "ZORUNLU") || o.difficulty > 2) continue;
    out.push({ kind: "ADJACENT", loId: id, title: o.title, detail: L(`A way into ${domainLabel(o.domain)}, a field you haven't touched yet. No prerequisites.`, `Henüz dokunmadığın ${domainLabel(o.domain)} alanına bir giriş. Önkoşulu yok.`), question: o.entryQuestions[0], score: 1.2 + hash(`${day}:${id}`) * 1.5 });
  }
  for (const k of known) {
    const p = masteryProfile(db, k, now);
    const q = explorationQuestions(g, k)[0];
    if (q && p.depth >= 3) out.push({ kind: "EXPLORATION", loId: k, title: g.objects[k].title, detail: L("You know this well enough to go beyond exercises.", "Bunu alıştırmaların ötesine geçecek kadar iyi biliyorsun."), question: q, score: 1.5 + hash(`${day}:x:${k}`) });
  }
  const weak = g.order
    .map((id) => ({ id, p: masteryProfile(db, id, now) }))
    .filter((x) => x.p.evidenceCount >= 2 && x.p.verified < 0.4)
    .sort((a, b) => a.p.verified - b.p.verified)[0];
  if (weak) out.push({ kind: "WEAK_SPOT", loId: weak.id, title: g.objects[weak.id].title, detail: L(`Verified mastery is ${Math.round(weak.p.verified * 100)}% from ${weak.p.evidenceCount} pieces of evidence.`, `${weak.p.evidenceCount} kanıttan doğrulanmış ustalık %${Math.round(weak.p.verified * 100)}.`), score: 1.4 });

  // One per target, at most one of each kind first, things shown in the last two days last.
  const seen = new Set<string>();
  const ranked = out.map((d) => ({ ...d, score: d.score - (recentlyShown.has(d.loId) ? 2 : 0) })).sort((a, b) => b.score - a.score).filter((d) => (seen.has(d.loId) ? false : (seen.add(d.loId), true)));
  const picked: Discovery[] = [];
  const kinds = new Set<DiscoveryKind>();
  for (const d of ranked) if (picked.length < limit && !kinds.has(d.kind)) { picked.push(d); kinds.add(d.kind); }
  for (const d of ranked) if (picked.length < limit && !picked.includes(d)) picked.push(d);
  return picked;
}

/** Links that are complete now that `loId` is known: both ends known by the learner. */
export function newConnections(db: LabDB, g: KnowledgeGraph, loId: string): Link[] {
  const o = g.objects[loId];
  if (!o) return [];
  const pg = personalGraph(db, g);
  return [
    ...o.interdisciplinaryLinks.map((l) => linkOf(g, o, l.id, l.relation)),
    ...incomingLinks(g, loId).map((l) => linkOf(g, o, l.id, l.relation)),
  ].filter((l): l is Link => !!l && l.crossDomain && pg.satisfied(l.id));
}

/** "What could be explored further?" — potential questions built from the graph, never claimed to be open problems. */
export function explorationQuestions(g: KnowledgeGraph, loId: string): string[] {
  const o = g.objects[loId];
  if (!o) return [];
  const out: string[] = [];
  for (const r of o.researchApplications.slice(0, 2)) out.push(L(`How is "${o.title}" used in ${r}? What would a small model of it look like?`, `"${o.title}" ${r} alanında nasıl kullanılıyor? Bunun küçük bir modeli nasıl görünürdü?`));
  for (const c of o.contrastsWith.slice(0, 1)) if (g.objects[c]) out.push(L(`When does "${o.title}" stop working, and "${g.objects[c].title}" take over?`, `"${o.title}" ne zaman işe yaramaz hâle gelir ve "${g.objects[c].title}" devreye girer?`));
  for (const m of modelsFor(loId).slice(0, 1)) {
    const p = m.params[0];
    if (p) out.push(L(`In the "${m.title}" model, what happens if ${p.label} is doubled? Predict first, then run it.`, `"${m.title}" modelinde ${p.label} iki katına çıkarsa ne olur? Önce tahmin et, sonra çalıştır.`));
  }
  for (const l of o.interdisciplinaryLinks.slice(0, 1)) if (g.objects[l.id]) out.push(L(`Is the link between "${o.title}" and "${g.objects[l.id].title}" (${l.relation}) exact, or only an analogy?`, `"${o.title}" ile "${g.objects[l.id].title}" arasındaki bağ (${l.relation}) tam mı, yoksa yalnızca bir benzetme mi?`));
  return out;
}
