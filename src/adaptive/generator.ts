/**
 * AI curriculum generator: "teach me X".
 *
 *   request → find X in the graph (reuse, never duplicate) → missing
 *   prerequisites → new nodes only if the graph lacks them (AI only; offline
 *   Lab never invents nodes) → milestones as single assessable capabilities
 *   (question → attempt → feedback → learn only what is needed → apply →
 *   verify → transfer) → granularity validator → graph validator →
 *   provenance → diff → learner approval (all / selected / none) → versioned
 *   graph update + course.
 *
 * Nothing is applied before approval, invalid changes cannot be approved, and
 * every new node carries provenance (AI-generated, unverified).
 */
import type { ID, LabDB, Millis } from "../domain/types";
import type { Capability, CurriculumProposal, ProposalChange, ProposedMilestone, ProposedNode } from "../domain/adaptive";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { importCurriculum, type CurriculumSpec, type MilestoneSpec, type QuestionSpec } from "../engines/curriculumSpec";
import { topoSort } from "../engines/graph";
import { getBaseGraph, getGraph, prereqMap, ancestors } from "../knowledge/graph";
import { objectMilestones } from "../knowledge/generate";
import { applyPlan, compareVersions, diffUpdate, knownIds, type GraphUpdate } from "../knowledge/planner";
import { ID_LEDGER, RETIRED_IDS } from "../knowledge/registry";
import { matchRequest } from "../knowledge/search";
import { DOMAINS, domainLabel, type KnowledgeGraph, type LearningObject } from "../knowledge/schema";
import { L, getLang } from "../i18n";
import { runAI, parseJSON, type AIHost } from "../ai/engine";
import { COGNITIVE_LABEL, cognitiveActions, isValid, similarity, validateGranularity } from "./granularity";
import { makeProvenance } from "./provenance";
import { masteryProfile } from "./mastery";
import { recordDecision } from "./decisions";

/** Learning material should be "only what is needed" — never a long lecture. */
export const MAX_MATERIAL_CHARS = 900;

export const CHANGE_KIND_LABEL = (k: ProposalChange["kind"]): string =>
  ({
    ADD_NODE: L("+ Added node", "+ Eklenen düğüm"),
    MODIFY_NODE: L("~ Modified node", "~ Değişen düğüm"),
    REMOVE_NODE: L("- Removed node", "- Kaldırılan düğüm"),
    ADD_PREREQ: L("→ Added prerequisite", "→ Eklenen önkoşul"),
    REMOVE_PREREQ: L("→ Removed prerequisite", "→ Kaldırılan önkoşul"),
    ADD_MILESTONE: L("+ Milestone", "+ Adım"),
    CHANGE_MILESTONE: L("→ Changed milestone", "→ Değişen adım"),
  })[k];

// ---------------------------------------------------------------------------
// AI draft
// ---------------------------------------------------------------------------

interface DraftNode { title: string; domain?: string; unit?: string; description?: string; whyItMatters?: string; prerequisites?: string[]; learningObjectives?: string[]; difficulty?: number }
interface DraftMilestone { node: string; title: string; capability: string; startingQuestion: string; attempt: string; learningMaterial: string; application: string; masteryEvidence: string; transfer: string; difficulty?: number; estimatedMinutes?: number }
export interface CurriculumDraft {
  goal: string;
  reuse: string[];
  newNodes: DraftNode[];
  /** Prerequisite edges between existing nodes, {from: prerequisite, to: dependent}. */
  addEdges: { from: string; to: string }[];
  removeEdges: { from: string; to: string }[];
  milestones: DraftMilestone[];
  sources: { title: string; url?: string; type?: string }[];
}

const str = (x: unknown, max = 400) => (typeof x === "string" ? x.trim().slice(0, max) : "");
const arr = <T>(x: unknown): T[] => (Array.isArray(x) ? (x as T[]) : []);

export function validateDraft(x: unknown, g: KnowledgeGraph): CurriculumDraft {
  const o = x as Record<string, unknown>;
  if (!o || typeof o !== "object") throw new Error("draft");
  const reuse = arr<unknown>(o.reuse).map((r) => str(r, 120)).filter((id) => g.objects[id]);
  const newNodes = arr<Record<string, unknown>>(o.newNodes).slice(0, 8).map((n) => ({
    title: str(n.title, 120), domain: str(n.domain, 40), unit: str(n.unit, 80), description: str(n.description, 600), whyItMatters: str(n.whyItMatters, 400),
    prerequisites: arr<unknown>(n.prerequisites).map((p) => str(p, 120)).filter(Boolean), learningObjectives: arr<unknown>(n.learningObjectives).map((p) => str(p, 300)).filter(Boolean).slice(0, 6),
    difficulty: Number(n.difficulty) || 2,
  })).filter((n) => n.title.length >= 3);
  const edge = (e: Record<string, unknown>) => ({ from: str(e.from, 120), to: str(e.to, 120) });
  const milestones = arr<Record<string, unknown>>(o.milestones).slice(0, 40).map((m) => ({
    node: str(m.node, 120), title: str(m.title, 160), capability: str(m.capability, 300), startingQuestion: str(m.startingQuestion, 600), attempt: str(m.attempt, 600),
    learningMaterial: str(m.learningMaterial, 4000), application: str(m.application, 600), masteryEvidence: str(m.masteryEvidence, 300), transfer: str(m.transfer, 600),
    difficulty: Number(m.difficulty) || 2, estimatedMinutes: Number(m.estimatedMinutes) || 20,
  })).filter((m) => m.title && m.node);
  if (!reuse.length && !newNodes.length) throw new Error("empty draft");
  return {
    goal: str(o.goal, 200), reuse, newNodes, milestones,
    addEdges: arr<Record<string, unknown>>(o.addEdges).map(edge).filter((e) => e.from && e.to),
    removeEdges: arr<Record<string, unknown>>(o.removeEdges).map(edge).filter((e) => e.from && e.to),
    sources: arr<Record<string, unknown>>(o.sources).slice(0, 6).map((s) => ({ title: str(s.title, 200), url: str(s.url, 300) || undefined, type: str(s.type, 30) || undefined })).filter((s) => s.title),
  };
}

const slug = (s: string) => s.toLocaleLowerCase("en").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "node";

function freshId(db: LabDB, g: KnowledgeGraph, title: string, taken: Set<string>): string {
  const used = new Set([...ID_LEDGER, ...RETIRED_IDS.map((r) => r.id), ...knownIds(db), ...Object.keys(g.objects), ...taken]);
  const base = `user.${slug(title)}`;
  let id = base;
  for (let i = 2; used.has(id); i++) id = `${base}-${i}`;
  taken.add(id);
  return id;
}

function nextVersion(v: string): string {
  const parts = v.split(".").map((n) => parseInt(n, 10) || 0);
  while (parts.length < 3) parts.push(0);
  parts[parts.length - 1]++;
  return parts.join(".");
}

const KIND_FOR_ACTION: Record<string, string> = { CALCULATE: "NUMERIC", DERIVE: "DERIVATION", PROVE: "PROOF", PREDICT: "PREDICTION", MODEL: "SIMULATION", INTERPRET: "GRAPH_INTERPRETATION" };

function fromSpec(m: MilestoneSpec, loId: string, g: KnowledgeGraph): ProposedMilestone {
  const qs = m.questions ?? [];
  const action = cognitiveActions(`${m.title}. ${m.learningObjective ?? ""}`)[0] ?? "APPLY";
  const cap: Capability = {
    capability: m.learningObjective ?? m.title,
    cognitiveAction: action,
    assessmentMethod: L(`${qs.length} questions`, `${qs.length} soru`),
    masteryEvidence: m.masteryCriterion ?? L("Answers the mastery question correctly", "Ustalık sorusunu doğru cevaplar"),
    estimatedEffort: m.estimatedMinutes,
  };
  return {
    key: m.key, loId, title: m.title, capability: cap,
    startingQuestion: qs[0]?.prompt ?? g.objects[loId]?.entryQuestions[0] ?? "",
    attempt: qs.find((q) => q.purpose === "MASTERY")?.prompt ?? qs[0]?.prompt ?? "",
    learningMaterial: (m.description ?? "").slice(0, MAX_MATERIAL_CHARS),
    application: g.objects[loId]?.coreQuestions[1] ?? "",
    masteryEvidence: cap.masteryEvidence,
    transfer: qs.find((q) => q.purpose === "TRANSFER")?.prompt ?? "",
    difficulty: m.difficulty ?? 2,
    estimatedDuration: m.estimatedMinutes ?? 20,
    granularity: { status: ["VALID"], notes: [], checkedAt: 0 },
  };
}

// ---------------------------------------------------------------------------
// Proposal
// ---------------------------------------------------------------------------

/**
 * Build a proposal for "teach me X". With AI, new nodes and milestones for
 * them may be proposed; without AI only existing graph objects are used.
 */
export async function proposeCurriculum(host: AIHost, request: string, now: Millis = Date.now()): Promise<CurriculumProposal> {
  const db = host.db();
  const g = getGraph(db.knowledge);
  const match = matchRequest(g, request, 8);
  const found = match.path ? [...new Set([...match.path.targets, ...match.objects])] : match.objects;
  const candidates = [...new Set([...found, ...found.flatMap((id) => g.objects[id].prerequisites.map((p) => p.id))])].filter((id) => g.objects[id]).slice(0, 30);

  // Prefer objects whose title really matches the request (one shared word like "theorem" is not enough).
  const baseTr = getBaseGraph(db.knowledge);
  const close = found.filter((id) => similarity(g.objects[id].title, request) >= 0.3 || (baseTr.objects[id] && similarity(baseTr.objects[id].title, request) >= 0.3));
  const offline = (): CurriculumDraft => {
    if (!found.length) throw new Error("no match");
    return { goal: request, reuse: (close.length ? close : found).slice(0, 3), newNodes: [], addEdges: [], removeEdges: [], milestones: [], sources: [] };
  };
  let draft: CurriculumDraft;
  let generatedBy: CurriculumProposal["generatedBy"] = "engine";
  let fallbackUsed = true;
  const notes: string[] = [];
  try {
    const res = await runAI(host, {
      role: "CURRICULUM_BUILDER",
      system: [
        "You extend a knowledge graph for one learner. Reuse existing nodes whenever they cover the request; never duplicate them.",
        "Only propose new nodes for concepts the graph truly lacks. Each milestone is ONE independently assessable capability",
        "(e.g. 'Given two dependent events, calculate and explain conditional probability'), never 'learn X' and never 'read X'.",
        "Lab's format is QUESTION → ATTEMPT → FEEDBACK → LEARN ONLY WHAT IS NEEDED → APPLY → VERIFY: keep learningMaterial short (a few sentences).",
        "Do not invent citations. Only list sources you are sure exist; they will be marked unverified anyway.",
        `Domains: ${DOMAINS.join(", ")}.`,
        "Return JSON {goal, reuse:[existing ids], newNodes:[{title,domain,unit,description,whyItMatters,prerequisites:[ids or new titles],learningObjectives:[],difficulty}],",
        "addEdges:[{from,to}], removeEdges:[{from,to}], milestones:[{node (existing id or new title), title, capability, startingQuestion, attempt, learningMaterial, application, masteryEvidence, transfer, difficulty, estimatedMinutes}], sources:[{title,url,type}]}.",
        getLang() === "tr" ? "Write all text in Turkish." : "Write all text in English.",
      ].join("\n"),
      prompt: JSON.stringify({ request, existingCandidates: candidates.map((id) => ({ id, title: g.objects[id].title, domain: g.objects[id].domain, prerequisites: g.objects[id].prerequisites.map((p) => p.id) })) }),
      parse: parseJSON((x) => validateDraft(x, g)),
      fallback: offline,
      maxTokens: 4000,
      summary: `curriculum proposal: ${request.slice(0, 80)}`,
    });
    draft = res.value;
    fallbackUsed = res.fallbackUsed;
    generatedBy = res.fallbackUsed ? "engine" : res.provider;
    if (res.fallbackUsed) notes.push(L("AI was not available: only existing graph objects are proposed. New nodes are never invented offline.", "YZ kullanılamadı: yalnızca grafikteki mevcut nesneler önerildi. Çevrimdışıyken yeni düğüm uydurulmaz."));
  } catch {
    draft = { goal: request, reuse: [], newNodes: [], addEdges: [], removeEdges: [], milestones: [], sources: [] };
    notes.push(L("Nothing in the graph matches this request, and new nodes need AI. Add an AI key in Settings or try other words.", "Grafikte bu isteğe uyan bir şey yok ve yeni düğüm için YZ gerekiyor. Ayarlar'dan bir YZ anahtarı ekle ya da başka kelimeler dene."));
  }
  return buildProposal(db, g, request, draft, { generatedBy, fallbackUsed, notes }, now);
}

/** Turn a draft (AI or offline) into a validated proposal with a diff. Pure: nothing is stored. */
export function buildProposal(db: LabDB, g: KnowledgeGraph, request: string, draft: CurriculumDraft, meta: { generatedBy: CurriculumProposal["generatedBy"]; fallbackUsed: boolean; notes?: string[] }, now: Millis = Date.now()): CurriculumProposal {
  const notes = [...(meta.notes ?? [])];
  const taken = new Set<string>();
  const reused = new Set(draft.reuse.filter((id) => g.objects[id]));
  const titleToId = new Map<string, string>();
  const nodes: ProposedNode[] = [];
  const aiSourced = draft.sources[0];

  // New nodes: duplicates of existing objects become reuse.
  for (const n of draft.newNodes) {
    // Check titles in both languages so "Bayes teoremi" matches "Bayes' theorem".
    const baseTr = getBaseGraph(db.knowledge);
    const same = (a: string) => similarity(a, n.title) >= 0.6 || a.toLocaleLowerCase("tr") === n.title.toLocaleLowerCase("tr");
    const dup = g.order.find((id) => same(g.objects[id].title) || (baseTr.objects[id] && same(baseTr.objects[id].title)));
    if (dup) {
      reused.add(dup);
      titleToId.set(n.title, dup);
      notes.push(L(`"${n.title}" already exists as "${g.objects[dup].title}" — reused, not duplicated.`, `"${n.title}" zaten "${g.objects[dup].title}" olarak var — kopyalanmadı, yeniden kullanıldı.`));
      continue;
    }
    const id = freshId(db, g, n.title, taken);
    titleToId.set(n.title, id);
    nodes.push({
      id, title: n.title, domain: (DOMAINS as readonly string[]).includes(n.domain ?? "") ? n.domain! : g.objects[[...reused][0]]?.domain ?? "GENEL_KULTUR",
      unit: n.unit || L("Added by AI", "YZ ile eklendi"), description: n.description ?? "", whyItMatters: n.whyItMatters ?? "",
      prerequisites: n.prerequisites ?? [], learningObjectives: n.learningObjectives ?? [], difficulty: Math.max(1, Math.min(5, Math.round(n.difficulty ?? 2))),
      provenance: makeProvenance("AI_GENERATED", { source: meta.generatedBy, sourceTitle: aiSourced?.title, sourceUrl: aiSourced?.url, confidence: 0.4 }, now),
    });
  }
  const resolve = (ref: string) => (g.objects[ref] ? ref : titleToId.get(ref) ?? nodes.find((n) => n.id === ref)?.id);
  for (const n of nodes) n.prerequisites = n.prerequisites.map((p) => resolve(p) ?? `?${p}`);

  // Prerequisites the learner is missing on the way (existing objects, not yet verified).
  const missingPrereqs = [...ancestors(g, [...reused])].filter((id) => masteryProfile(db, id, now).verified < 0.6).slice(0, 12);

  // Milestones: AI milestones for new (or named) nodes; graph-generated milestones for reused objects.
  const milestones: ProposedMilestone[] = [];
  const existingObjectives = Object.values(db.milestones).map((m) => ({ id: m.id, text: m.learningObjective || m.title }));
  for (const m of draft.milestones) {
    const loId = resolve(m.node);
    if (!loId) continue;
    const material = m.learningMaterial.length > MAX_MATERIAL_CHARS ? `${m.learningMaterial.slice(0, MAX_MATERIAL_CHARS)}…` : m.learningMaterial;
    if (m.learningMaterial.length > MAX_MATERIAL_CHARS) notes.push(L(`"${m.title}": learning material shortened — learn only what is needed.`, `"${m.title}": öğrenme metni kısaltıldı — yalnızca gerekeni öğren.`));
    milestones.push({
      key: `gen-${milestones.length + 1}`, loId, title: m.title,
      capability: { capability: m.capability || m.title, cognitiveAction: cognitiveActions(`${m.title}. ${m.capability}`)[0] ?? "APPLY", assessmentMethod: m.attempt ? L("Starting question, an attempt and a transfer question", "Giriş sorusu, bir deneme ve bir transfer sorusu") : "", masteryEvidence: m.masteryEvidence, estimatedEffort: m.estimatedMinutes },
      startingQuestion: m.startingQuestion, attempt: m.attempt, learningMaterial: material, application: m.application, masteryEvidence: m.masteryEvidence, transfer: m.transfer,
      difficulty: Math.max(1, Math.min(5, Math.round(m.difficulty ?? 2))), estimatedDuration: Math.max(3, Math.min(240, Math.round(m.estimatedMinutes ?? 20))),
      granularity: { status: ["VALID"], notes: [], checkedAt: 0 },
    });
  }
  const covered = new Set(milestones.map((m) => m.loId));
  for (const id of reused) {
    if (covered.has(id) || Object.values(db.milestones).some((m) => m.learningObjectIds?.includes(id))) continue;
    for (const spec of objectMilestones(g.objects[id])) milestones.push({ ...fromSpec(spec, id, g), key: `gen-${milestones.length + 1}` });
  }
  const knownKeys = new Set([...Object.keys(db.milestones), ...milestones.map((m) => m.key)]);
  for (const m of milestones) {
    m.granularity = validateGranularity({
      id: m.key, title: m.title, objective: m.capability.capability, masteryEvidence: m.masteryEvidence, assessmentMethod: m.capability.assessmentMethod,
      questionCount: [m.startingQuestion, m.attempt, m.transfer].filter(Boolean).length, estimatedDuration: m.estimatedDuration, prerequisites: [],
    }, { siblings: [...milestones.filter((x) => x.key !== m.key).map((x) => ({ id: x.key, text: x.capability.capability })), ...existingObjectives], knownIds: knownKeys }, now);
  }

  // Changes (the diff).
  const changes: ProposalChange[] = [];
  const nodeChange = new Map<string, ID>();
  for (const n of nodes) {
    const bad = n.prerequisites.filter((p) => p.startsWith("?"));
    const c: ProposalChange = { id: newId("chg"), kind: "ADD_NODE", target: n.id, title: n.title, detail: `${domainLabel(n.domain as never)} · ${n.description.slice(0, 160)}`, valid: true, issues: [], dependsOn: [] };
    if (!n.learningObjectives.length) { c.valid = false; c.issues.push(L("No learning objective", "Öğrenme hedefi yok")); }
    nodeChange.set(n.id, c.id);
    changes.push(c);
    for (const p of n.prerequisites) {
      const ok = !p.startsWith("?");
      changes.push({ id: newId("chg"), kind: "ADD_PREREQ", target: n.id, other: ok ? p : p.slice(1), title: `${ok ? g.objects[p]?.title ?? nodes.find((x) => x.id === p)?.title ?? p : p.slice(1)} → ${n.title}`, detail: ok ? "" : L("Prerequisite not found in the graph", "Önkoşul grafikte bulunamadı"), valid: ok, issues: ok ? [] : [L("Missing prerequisite", "Eksik önkoşul")], dependsOn: [c.id] });
    }
    if (bad.length) n.prerequisites = n.prerequisites.filter((p) => !p.startsWith("?"));
  }
  for (const e of draft.addEdges) {
    const from = resolve(e.from), to = resolve(e.to);
    const ok = !!from && !!to && !!g.objects[to];
    changes.push({ id: newId("chg"), kind: "ADD_PREREQ", target: to ?? e.to, other: from ?? e.from, title: `${from ? g.objects[from]?.title ?? from : e.from} → ${to ? g.objects[to]?.title ?? to : e.to}`, detail: L("New prerequisite for an existing object", "Mevcut bir nesneye yeni önkoşul"), valid: ok, issues: ok ? [] : [L("Unknown object", "Bilinmeyen nesne")], dependsOn: from && nodeChange.has(from) ? [nodeChange.get(from)!] : [] });
  }
  for (const e of draft.removeEdges) {
    const exists = !!g.objects[e.to]?.prerequisites.some((p) => p.id === e.from);
    changes.push({ id: newId("chg"), kind: "REMOVE_PREREQ", target: e.to, other: e.from, title: `${g.objects[e.from]?.title ?? e.from} ↛ ${g.objects[e.to]?.title ?? e.to}`, detail: L("Removing a prerequisite of a built-in object", "Yerleşik bir nesnenin önkoşulunu kaldırma"), valid: exists, issues: exists ? [] : [L("No such prerequisite", "Böyle bir önkoşul yok")], dependsOn: [] });
  }
  for (const m of milestones) {
    const ok = isValid(m.granularity);
    changes.push({ id: newId("chg"), kind: "ADD_MILESTONE", target: m.key, other: m.loId, title: m.title, detail: `${COGNITIVE_LABEL(m.capability.cognitiveAction)} · ${m.estimatedDuration} ${L("min", "dk")}`, valid: ok, issues: m.granularity.notes, dependsOn: nodeChange.has(m.loId) ? [nodeChange.get(m.loId)!] : [] });
  }

  // Graph validator over the hypothetical update.
  const base = getBaseGraph(db.knowledge);
  const update = graphUpdateFor(base, nodes, changes, changes.map((c) => c.id));
  const graphErrors: string[] = [];
  if (update.objects?.length) {
    const plan = diffUpdate(base, update, db);
    for (const e of plan.newErrors) {
      graphErrors.push(`${e.loId ?? ""} ${e.message}`.trim());
      for (const c of changes) if (c.target === e.loId || c.other === e.loId) { c.valid = false; c.issues.push(e.message); }
    }
    for (const c of plan.changes.filter((x) => x.kind === "REDDEDILDI")) graphErrors.push(`${c.id}: ${c.detail}`);
  }

  return {
    id: newId("prop"), request, goal: draft.goal || request, createdAt: now, status: "PENDING",
    reused: [...reused], missingPrereqs, nodes, milestones, changes, graphErrors,
    generatedBy: meta.generatedBy, fallbackUsed: meta.fallbackUsed, notes,
  };
}

/** The graph update for the approved changes (new nodes + prerequisite edges). */
function graphUpdateFor(base: KnowledgeGraph, nodes: ProposedNode[], changes: ProposalChange[], approved: ID[]): GraphUpdate {
  const ok = new Set(approved);
  const objects: (Partial<LearningObject> & { id: string })[] = [];
  const addedNodes = new Set(changes.filter((c) => c.kind === "ADD_NODE" && ok.has(c.id) && c.valid).map((c) => c.target));
  const edges = changes.filter((c) => c.kind === "ADD_PREREQ" && ok.has(c.id) && c.valid && c.other);
  const removals = changes.filter((c) => c.kind === "REMOVE_PREREQ" && ok.has(c.id) && c.valid && c.other);
  for (const n of nodes) {
    if (!addedNodes.has(n.id)) continue;
    const pre = edges.filter((e) => e.target === n.id && (base.objects[e.other!] || addedNodes.has(e.other!))).map((e) => ({ id: e.other!, strength: "ZORUNLU" as const }));
    objects.push({
      id: n.id, title: n.title, domain: n.domain as LearningObject["domain"], field: n.unit, unit: n.unit, topic: n.title, description: n.description, whyItMatters: n.whyItMatters,
      prerequisites: pre, learningObjectives: n.learningObjectives, entryQuestions: [L(`Before you start: what do you already know about "${n.title}"?`, `Başlamadan önce: "${n.title}" hakkında ne biliyorsun?`)],
      coreQuestions: n.learningObjectives.map((o) => L(`Show that you can: ${o}`, `Şunu yapabildiğini göster: ${o}`)),
      evidenceTypes: ["ACIKLAMA", "PROBLEM_COZME"], difficulty: n.difficulty, tags: ["ai"],
    });
  }
  const touched = new Map<string, LearningObject["prerequisites"]>();
  for (const e of edges.filter((x) => base.objects[x.target])) {
    const cur = touched.get(e.target) ?? [...base.objects[e.target].prerequisites];
    if (!cur.some((p) => p.id === e.other)) cur.push({ id: e.other!, strength: "ZORUNLU" });
    touched.set(e.target, cur);
  }
  for (const r of removals) touched.set(r.target, (touched.get(r.target) ?? [...base.objects[r.target].prerequisites]).filter((p) => p.id !== r.other));
  for (const [id, prerequisites] of touched) objects.push({ id, prerequisites });
  return { version: nextVersion(base.version), summary: L("AI curriculum proposal", "YZ müfredat önerisi"), objects };
}

export function storeProposal(db: LabDB, p: CurriculumProposal): void {
  db.curriculumProposals[p.id] = p;
  logEvent(db, "CURRICULUM_PROPOSED", { at: p.createdAt, loIds: [...p.reused, ...p.nodes.map((n) => n.id)].slice(0, 20) }, { proposalId: p.id, changes: p.changes.length, invalid: p.changes.filter((c) => !c.valid).length, generatedBy: p.generatedBy });
}

/** Changes that must come with the selected ones (a milestone needs its node, an edge its node). */
export function withDependencies(p: CurriculumProposal, ids: ID[]): ID[] {
  const set = new Set(ids);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of p.changes) if (set.has(c.id)) for (const d of c.dependsOn) if (!set.has(d)) { set.add(d); grew = true; }
    // A new node comes with its own prerequisite edges.
    for (const c of p.changes) if (c.kind === "ADD_PREREQ" && !set.has(c.id) && c.dependsOn.some((d) => set.has(d) && p.changes.find((x) => x.id === d)?.kind === "ADD_NODE" && p.changes.find((x) => x.id === d)?.target === c.target)) { set.add(c.id); grew = true; }
  }
  return [...set];
}

export interface DecisionResult {
  ok: boolean;
  status: CurriculumProposal["status"];
  errors: string[];
  appliedVersion?: string;
  courseId?: ID;
}

/**
 * Apply the learner's decision. "none" rejects. Otherwise the selected valid
 * changes (plus what they depend on) are applied: the graph update as a new
 * version, the milestones as a new course. Invalid changes are never applied.
 */
export function decideProposal(db: LabDB, proposalId: ID, selection: "all" | "none" | ID[], now: Millis = Date.now()): DecisionResult {
  const p = db.curriculumProposals[proposalId];
  if (!p || p.status !== "PENDING") return { ok: false, status: p?.status ?? "REJECTED", errors: [L("This proposal was already decided.", "Bu öneri için zaten karar verildi.")] };
  if (selection === "none") {
    p.status = "REJECTED";
    p.decidedAt = now;
    p.approvedChangeIds = [];
    logEvent(db, "CURRICULUM_DECIDED", { at: now }, { proposalId, decision: "rejected" });
    return { ok: true, status: "REJECTED", errors: [] };
  }
  const valid = new Set(p.changes.filter((c) => c.valid).map((c) => c.id));
  const chosen = withDependencies(p, selection === "all" ? [...valid] : selection).filter((id) => valid.has(id));
  // A selected change whose dependency is invalid cannot be applied either.
  const approved = chosen.filter((id) => p.changes.find((c) => c.id === id)!.dependsOn.every((d) => valid.has(d)));
  if (!approved.length) return { ok: false, status: "PENDING", errors: [L("Nothing valid was selected.", "Geçerli bir şey seçilmedi.")] };

  const base = getBaseGraph(db.knowledge);
  const update = graphUpdateFor(base, p.nodes, p.changes, approved);
  let appliedVersion: string | undefined;
  if (update.objects?.length) {
    const plan = diffUpdate(base, update, db);
    if (!plan.ok) return { ok: false, status: "PENDING", errors: [...plan.newErrors.map((e) => e.message), ...plan.changes.filter((c) => c.kind === "REDDEDILDI").map((c) => c.detail)] };
    const rec = applyPlan(db, plan, now);
    appliedVersion = rec.toVersion;
    const prov = { ...(db.knowledge.provenance ?? {}) };
    for (const n of p.nodes) if (rec.added.includes(n.id)) prov[n.id] = n.provenance;
    db.knowledge.provenance = prov;
  }

  // Milestones → a course built over the (updated) graph.
  const g = getGraph(db.knowledge);
  const ms = p.milestones.filter((m) => approved.includes(p.changes.find((c) => c.kind === "ADD_MILESTONE" && c.target === m.key)?.id ?? "") && g.objects[m.loId]);
  let courseId: ID | undefined;
  if (ms.length) {
    const spec = specFor(g, p, ms);
    const report = importCurriculum(db, spec, { source: { kind: "REQUEST", text: p.request }, generatedBy: `proposal:${p.generatedBy}`, subjectName: spec.subject });
    courseId = report.courseId;
    const course = db.courses[courseId];
    course.origin = { kind: "graph", loIds: [...new Set(ms.map((m) => m.loId))], title: spec.title };
    course.provenance = makeProvenance(p.generatedBy === "engine" ? "OTHER" : "AI_GENERATED", { source: p.generatedBy === "engine" ? L("Lab knowledge graph", "Lab bilgi grafiği") : String(p.generatedBy), generatedByAI: p.generatedBy !== "engine" }, now);
    for (const m of Object.values(db.milestones)) {
      if (m.courseId !== courseId || !m.sourceKey?.startsWith(`gen:${p.id}:`)) continue;
      const pm = ms.find((x) => m.sourceKey === `gen:${p.id}:${x.key}`);
      if (!pm) continue;
      m.capability = pm.capability;
      m.granularity = pm.granularity;
      m.provenance = course.provenance;
    }
  }

  p.status = approved.length === valid.size ? "APPLIED" : "PARTIAL";
  p.decidedAt = now;
  p.approvedChangeIds = approved;
  p.appliedVersion = appliedVersion;
  p.courseId = courseId;
  logEvent(db, "CURRICULUM_DECIDED", { at: now, courseId }, { proposalId, decision: p.status.toLowerCase(), approved: approved.length, of: p.changes.length, version: appliedVersion });
  recordDecision(db, { role: "CURRICULUM_BUILDER", decision: `${p.status}: ${approved.length}/${p.changes.length}`, reason: L(`Approved by the learner${appliedVersion ? `; graph version ${appliedVersion}` : ""}.`, `Öğrenci onayladı${appliedVersion ? `; grafik sürümü ${appliedVersion}` : ""}.`), confidence: 1, evidence: approved, provider: p.generatedBy, fallbackUsed: p.fallbackUsed, ref: `proposal:${p.id}` }, now);
  return { ok: true, status: p.status, errors: [], appliedVersion, courseId };
}

function specFor(g: KnowledgeGraph, p: CurriculumProposal, ms: ProposedMilestone[]): CurriculumSpec {
  const los = [...new Set(ms.map((m) => m.loId))];
  const order = topoSort(new Map([...prereqMap(g)].filter(([id]) => los.includes(id))), (id) => g.order.indexOf(id)).filter((id) => los.includes(id));
  const lastKey = new Map<string, string>();
  const units = new Map<string, CurriculumSpec["units"][number]>();
  const q = (prompt: string, purpose: QuestionSpec["purpose"], kind: string, rubric: string[]): QuestionSpec => ({ kind, purpose, prompt, rubric, hints: [] });
  for (const lo of order) {
    const o = g.objects[lo];
    const mine = ms.filter((m) => m.loId === lo);
    const entry = o.prerequisites.filter((x) => x.strength === "ZORUNLU" && lastKey.has(x.id)).map((x) => lastKey.get(x.id)!);
    const specs: MilestoneSpec[] = mine.map((m, i) => ({
      key: m.key, sourceKey: `gen:${p.id}:${m.key}`, title: m.title, learningObjective: m.capability.capability,
      description: m.learningMaterial, difficulty: m.difficulty, estimatedMinutes: m.estimatedDuration, lo: [lo],
      prerequisites: i === 0 ? entry : [mine[i - 1].key], masteryCriterion: m.masteryEvidence, conceptKeys: [lo],
      interaction: KIND_FOR_ACTION[m.capability.cognitiveAction] ?? "EXPLANATION",
      questions: [
        ...(m.startingQuestion ? [q(m.startingQuestion, "PRACTICE", "PREDICTION", [L("Gives an answer or prediction", "Bir cevap ya da tahmin veriyor")])] : []),
        ...(m.attempt ? [q(m.attempt, "MASTERY", KIND_FOR_ACTION[m.capability.cognitiveAction] === "NUMERIC" ? "PROBLEM_SOLVING" : "EXPLANATION", [m.masteryEvidence].filter(Boolean))] : []),
        ...(m.transfer ? [q(m.transfer, "TRANSFER", "EXPLANATION", [m.masteryEvidence].filter(Boolean))] : []),
      ],
    }));
    if (!specs.length) continue;
    lastKey.set(lo, specs[specs.length - 1].key);
    const unit = `${domainLabel(o.domain)} — ${o.unit}`;
    if (!units.has(unit)) units.set(unit, { title: unit, summary: o.field, topics: [] });
    units.get(unit)!.topics.push({ key: lo, title: o.title, concepts: [{ key: lo, title: o.title, description: o.description }], milestones: specs });
  }
  return { title: p.goal.slice(0, 80) || p.request.slice(0, 80), goal: p.goal || p.request, subject: order[0] ? domainLabel(g.objects[order[0]].domain) : L("General", "Genel"), description: L("Built from an approved curriculum proposal.", "Onaylanmış bir müfredat önerisinden oluşturuldu."), units: [...units.values()] };
}

/** Curriculum reviewer: deterministic summary of what to check before approving (an AI review can add notes). */
export function reviewNotes(p: CurriculumProposal): string[] {
  const out: string[] = [];
  const invalid = p.changes.filter((c) => !c.valid);
  if (invalid.length) out.push(L(`${invalid.length} changes did not pass validation and cannot be approved.`, `${invalid.length} değişiklik doğrulamadan geçmedi ve onaylanamaz.`));
  if (p.nodes.length) out.push(L(`${p.nodes.length} new nodes are AI-generated and unverified — check them against a source.`, `${p.nodes.length} yeni düğüm YZ üretimi ve doğrulanmamış — bir kaynakla karşılaştır.`));
  if (p.reused.length) out.push(L(`${p.reused.length} existing objects are reused instead of duplicated.`, `${p.reused.length} mevcut nesne kopyalanmadan yeniden kullanıldı.`));
  if (p.missingPrereqs.length) out.push(L(`${p.missingPrereqs.length} prerequisites on the way are not yet verified for you.`, `Yoldaki ${p.missingPrereqs.length} önkoşul senin için henüz doğrulanmadı.`));
  if (compareVersions(p.appliedVersion ?? "0", "0") > 0) out.push(L(`Applied as version ${p.appliedVersion}.`, `${p.appliedVersion} sürümü olarak uygulandı.`));
  return out;
}
