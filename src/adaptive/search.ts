/**
 * Global search and quick actions.
 *
 * One query searches concepts (titles, aliases, tags, fields), milestones,
 * questions, sources, projects, research, journal entries, goals and
 * artifacts. Each result says what it is, how it relates (field, course,
 * project) and the learner's current state on it. A query that starts with a
 * verb ("learn X", "practice X", "review", "continue", "start research …",
 * "add concept …", "add source …", "ask …") becomes a quick action.
 */
import type { ID, LabDB, Millis } from "../domain/types";
import type { KnowledgeGraph } from "../knowledge/schema";
import { domainLabel } from "../knowledge/schema";
import { personalGraph, LO_STATE_LABEL } from "../knowledge/state";
import { L } from "../i18n";
import { masteryProfile } from "./mastery";
import { masteryState, MASTERY_STATE_LABEL } from "./depth";
import { JOURNAL_LABEL, PROJECT_LABEL } from "../academic/records";

export type SearchType = "CONCEPT" | "MILESTONE" | "QUESTION" | "SOURCE" | "PROJECT" | "RESEARCH" | "JOURNAL" | "GOAL" | "ARTIFACT";

export const SEARCH_TYPE_LABEL = (t: SearchType): string =>
  ({ CONCEPT: L("Concept", "Kavram"), MILESTONE: L("Milestone", "Adım"), QUESTION: L("Question", "Soru"), SOURCE: L("Source", "Kaynak"), PROJECT: L("Project", "Proje"), RESEARCH: L("Research", "Araştırma"), JOURNAL: L("Journal", "Günlük"), GOAL: L("Goal", "Hedef"), ARTIFACT: L("Artifact", "Eser") })[t];

export interface SearchResult {
  type: SearchType;
  id: ID;
  title: string;
  /** Relationship: field › unit, course, project… */
  context: string;
  /** Current state for the learner, if meaningful. */
  state?: string;
  /** Where to go. */
  href: string;
  score: number;
}

const norm = (s: string) => s.toLocaleLowerCase("tr").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");

function scoreText(q: string[], text: string): number {
  const h = norm(text);
  let s = 0;
  for (const t of q) {
    if (!t) continue;
    if (h.startsWith(t)) s += 3;
    else if (h.includes(` ${t}`)) s += 2;
    else if (h.includes(t)) s += 1;
    else return 0;
  }
  return s;
}

export function globalSearch(db: LabDB, g: KnowledgeGraph, query: string, limit = 30, now: Millis = Date.now()): SearchResult[] {
  const q = norm(query).split(/\s+/).filter((t) => t.length >= 2);
  if (!q.length) return [];
  const out: SearchResult[] = [];
  const pg = personalGraph(db, g);
  for (const id of g.order) {
    const o = g.objects[id];
    const title = Math.max(scoreText(q, o.title), ...(o.aliases ?? []).map((a) => scoreText(q, a))) * 2;
    const ctx = scoreText(q, `${o.title} ${(o.aliases ?? []).join(" ")} ${o.field} ${o.unit} ${o.tags.join(" ")} ${domainLabel(o.domain)}`);
    const s = Math.max(title, ctx);
    if (!s) continue;
    const p = masteryProfile(db, id, now);
    const st = pg.progress.get(id)?.state;
    out.push({ type: "CONCEPT", id, title: o.title, context: `${domainLabel(o.domain)} › ${o.field}`, state: p.evidenceCount ? `${MASTERY_STATE_LABEL(masteryState(p))} · ${Math.round(p.verified * 100)}%` : st ? LO_STATE_LABEL[st] : undefined, href: `/graph?lo=${encodeURIComponent(id)}`, score: s + 1 });
  }
  for (const m of Object.values(db.milestones)) {
    if (m.ephemeral?.archivedAt) continue;
    const s = scoreText(q, `${m.title} ${m.learningObjective}`);
    if (s) out.push({ type: "MILESTONE", id: m.id, title: m.title, context: db.courses[m.courseId]?.title ?? "", state: m.status, href: `/session/${m.id}`, score: s });
  }
  for (const qu of Object.values(db.questions)) {
    const s = scoreText(q, qu.prompt);
    if (s && db.milestones[qu.milestoneId]) out.push({ type: "QUESTION", id: qu.id, title: qu.prompt.slice(0, 120), context: db.milestones[qu.milestoneId].title, href: `/session/${qu.milestoneId}`, score: s * 0.6 });
  }
  for (const src of Object.values(db.sources)) {
    const s = scoreText(q, `${src.title} ${src.author ?? ""}`);
    if (s) out.push({ type: "SOURCE", id: src.id, title: src.title, context: src.author ?? src.type, href: `/study?tab=sources`, score: s });
  }
  for (const p of Object.values(db.projects)) {
    const s = scoreText(q, `${p.title} ${p.goal} ${p.questions.join(" ")}`);
    if (s) out.push({ type: "PROJECT", id: p.id, title: p.title, context: PROJECT_LABEL(p.kind), state: p.status, href: `/work?tab=projects&id=${p.id}`, score: s });
  }
  for (const r of Object.values(db.research)) {
    const s = scoreText(q, r.title);
    if (s) out.push({ type: "RESEARCH", id: r.id, title: r.title, context: L("Research project", "Araştırma projesi"), state: r.status, href: `/study?tab=research&res=${r.id}`, score: s });
  }
  for (const j of Object.values(db.journal)) {
    const s = scoreText(q, j.text);
    if (s) out.push({ type: "JOURNAL", id: j.id, title: j.text.slice(0, 120), context: JOURNAL_LABEL(j.kind), href: `/work?tab=journal&id=${j.id}`, score: s * 0.8 });
  }
  for (const gl of Object.values(db.academicGoals)) {
    const s = scoreText(q, `${gl.title} ${gl.targetArea} ${gl.why}`);
    if (s) out.push({ type: "GOAL", id: gl.id, title: gl.title, context: gl.targetArea, state: gl.status, href: `/work?tab=goals&id=${gl.id}`, score: s + 0.5 });
  }
  for (const a of Object.values(db.artifacts)) {
    const s = scoreText(q, `${a.title} ${a.body}`);
    if (s) out.push({ type: "ARTIFACT", id: a.id, title: a.title, context: a.kind, href: `/work?tab=portfolio&id=${a.id}`, score: s * 0.8 });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

// ---------------------------------------------------------------------------
// Quick actions
// ---------------------------------------------------------------------------

export type QuickActionKind = "LEARN" | "PRACTICE" | "REVIEW" | "CONTINUE" | "RESEARCH" | "ADD_CONCEPT" | "ADD_SOURCE" | "ASK" | "SURPRISE" | "UNSURE" | "JOURNAL";

export interface QuickAction {
  kind: QuickActionKind;
  label: string;
  /** The rest of the query after the verb ("Fourier transforms"). */
  arg: string;
}

const VERBS: [QuickActionKind, RegExp][] = [
  ["LEARN", /^(learn|teach me|öğren|öğret|bana öğret)\s+(.+)$/i],
  ["PRACTICE", /^(practi[cs]e|çalış|pratik|alıştırma)\s+(.+)$/i],
  ["RESEARCH", /^(start research|research|araştır|araştırma başlat)\s*(.*)$/i],
  ["ADD_CONCEPT", /^(add concept|kavram ekle)\s+(.+)$/i],
  ["ADD_SOURCE", /^(add source|kaynak ekle)\s+(.+)$/i],
  ["ASK", /^(ask|ask ai|sor|yz'?ye sor)\s+(.+)$/i],
  ["JOURNAL", /^(note|journal|not|günlük)\s+(.+)$/i],
  ["REVIEW", /^(review|review weak( concepts)?|tekrar|zayıfları tekrar et)\s*(.*)$/i],
  ["CONTINUE", /^(continue|devam|devam et)\s*(.*)$/i],
  ["SURPRISE", /^(surprise me|şaşırt beni|sürpriz)\s*(.*)$/i],
  ["UNSURE", /^(i don'?t know( what to (do|study))?|ne çalışacağımı bilmiyorum|bilmiyorum)\s*(.*)$/i],
];

export const QUICK_LABEL = (k: QuickActionKind): string =>
  ({
    LEARN: L("Learn", "Öğren"), PRACTICE: L("Practise", "Pratik yap"), REVIEW: L("Review weak concepts", "Zayıf kavramları tekrar et"), CONTINUE: L("Continue", "Devam et"),
    RESEARCH: L("Start research", "Araştırma başlat"), ADD_CONCEPT: L("Add concept", "Kavram ekle"), ADD_SOURCE: L("Add source", "Kaynak ekle"), ASK: L("Ask AI", "YZ'ye sor"),
    SURPRISE: L("Surprise me", "Beni şaşırt"), UNSURE: L("I don't know what to study", "Ne çalışacağımı bilmiyorum"), JOURNAL: L("Write in the journal", "Günlüğe yaz"),
  })[k];

export function parseQuickAction(query: string): QuickAction | null {
  const t = query.trim();
  for (const [kind, re] of VERBS) {
    const m = t.match(re);
    if (m) return { kind, label: QUICK_LABEL(kind), arg: (m[m.length - 1] ?? "").trim() };
  }
  return null;
}

/** Actions offered before anything is typed. */
export const DEFAULT_ACTIONS = (): QuickAction[] =>
  (["CONTINUE", "REVIEW", "SURPRISE", "UNSURE", "RESEARCH", "JOURNAL"] as QuickActionKind[]).map((kind) => ({ kind, label: QUICK_LABEL(kind), arg: "" }));
