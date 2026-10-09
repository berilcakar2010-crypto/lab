/**
 * AI engine: runs a role-specific request through the configured provider,
 * records an AIInteraction + raw event, validates the result, and falls back
 * to a deterministic local implementation on any failure. AI never writes to
 * the database directly — callers decide what to do with the result.
 */
import type { AIProviderId, AIRole, ID, LabDB } from "../domain/types";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { capabilitiesOf, extractJSON, makeProvider, type AIProvider } from "./providers";
import { L } from "../i18n";
import type { AIStyle } from "../domain/academic";

export interface AIHost {
  /** Read current state (preferences). */
  db(): LabDB;
  /** Persist a mutation (used only to record interactions). */
  record(fn: (db: LabDB) => void): void;
  /** Override provider (tests). */
  provider?: AIProvider;
}

export interface AIRunOptions<T> {
  role: AIRole;
  system: string;
  prompt: string;
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  images?: string[];
  /** Parse + validate the raw text; throw to reject. */
  parse: (text: string) => T;
  /** Deterministic result used when AI is unavailable or fails. */
  fallback: () => T;
  sessionId?: ID;
  milestoneId?: ID;
  summary: string;
  /** Reuse an identical earlier answer (default true). Pass false when a fresh answer is wanted. */
  cache?: boolean;
}

export interface AIResult<T> {
  value: T;
  provider: AIProviderId;
  fallbackUsed: boolean;
  error?: string;
  /** The answer came from the cache (no new request was made). */
  cached?: boolean;
}

// ---------------------------------------------------------------------------
// Cost control: identical requests within the TTL reuse the earlier answer.
// ---------------------------------------------------------------------------

export const AI_CACHE_TTL_MS = 12 * 3600_000;
const AI_CACHE_MAX = 120;
type Cache = Map<string, { at: number; text: string }>;
const aiCache: Cache = new Map();
/** Providers injected by a host (tests, previews) get their own cache, so they never see each other's answers. */
const injected = new WeakMap<AIProvider, Cache>();
const cacheFor = (host: AIHost): Cache => (host.provider ? injected.get(host.provider) ?? (injected.set(host.provider, new Map()), injected.get(host.provider)!) : aiCache);

function hashKey(s: string): string {
  let h1 = 0x811c9dc5, h2 = 0x1b873593;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619);
    h2 = Math.imul(h2 ^ c, 2246822507);
  }
  return `${(h1 >>> 0).toString(36)}${(h2 >>> 0).toString(36)}${s.length}`;
}

export function clearAICache(): void {
  aiCache.clear();
}

export const aiCacheSize = () => aiCache.size;

// ---------------------------------------------------------------------------
// Learner preferences: how the AI should talk (only for roles that talk to the learner)
// ---------------------------------------------------------------------------

const TALKING_ROLES = new Set<AIRole>(["TUTOR", "SOCRATIC_GUIDE", "HINT_GENERATOR", "FEEDBACK_GENERATOR", "QA_ASSISTANT", "REFLECTION_ANALYST", "RESEARCH_GUIDE", "EXPLANATION_EVALUATOR"]);

export function styleInstruction(style: AIStyle | undefined): string {
  if (!style) return "";
  const parts: string[] = [];
  if (style.socratic) parts.push("prefer guiding questions over statements");
  if (style.concise) parts.push("be concise");
  if (style.rigorous) parts.push("be mathematically and scientifically rigorous; state assumptions");
  if (style.explanatory) parts.push("explain the reasoning step by step");
  if (style.challenging) parts.push("push the learner a little beyond what is comfortable");
  return parts.length ? `\nLearner's preferences for how you respond: ${parts.join("; ")}. Never give the full answer unless it is explicitly requested.` : "";
}

/** With minimal context on, very long prompts keep their beginning and end (the question and the latest input). */
export const PROMPT_BUDGET = 9000;

export function fitPrompt(prompt: string, budget = PROMPT_BUDGET): string {
  if (prompt.length <= budget) return prompt;
  const head = Math.floor(budget * 0.6);
  return `${prompt.slice(0, head)}\n[… ${prompt.length - budget} characters left out to keep the request small …]\n${prompt.slice(prompt.length - (budget - head))}`;
}

export async function runAI<T>(host: AIHost, opts: AIRunOptions<T>): Promise<AIResult<T>> {
  const prefs = host.db().preferences;
  const provider = host.provider ?? makeProvider(prefs);
  const started = Date.now();
  let error: string | undefined;
  let value: T | undefined;
  let ok = false;
  let cached = false;
  const system = TALKING_ROLES.has(opts.role) ? opts.system + styleInstruction(prefs.aiStyle) : opts.system;
  const prompt = prefs.minimalAIContext === false ? opts.prompt : fitPrompt(opts.prompt);
  const key = hashKey(`${provider.id}|${provider.model}|${opts.role}|${system}|${prompt}|${opts.images?.length ?? 0}|${opts.images?.[0]?.length ?? 0}`);

  const cache = cacheFor(host);
  const hit = opts.cache !== false && provider.ready() ? cache.get(key) : undefined;
  if (hit && Date.now() - hit.at < AI_CACHE_TTL_MS) {
    try {
      value = opts.parse(hit.text);
      ok = true;
      cached = true;
    } catch {
      cache.delete(key);
    }
  }

  if (!ok && provider.ready()) {
    for (let attempt = 0; attempt < 2 && !ok; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 60_000);
      try {
        const text = await provider.complete({
          system,
          prompt: attempt === 0 ? prompt : `${prompt}\n\nYour previous reply could not be parsed. Reply with ONLY valid JSON matching the schema.`,
          json: opts.json ?? true,
          temperature: opts.temperature,
          maxTokens: opts.maxTokens,
          signal: ctrl.signal,
          images: capabilitiesOf(provider).vision ? opts.images : undefined,
        });
        value = opts.parse(text);
        ok = true;
        error = undefined;
        if (opts.cache !== false) {
          cache.set(key, { at: Date.now(), text });
          if (cache.size > AI_CACHE_MAX) cache.delete(cache.keys().next().value!);
        }
      } catch (e) {
        error = e instanceof Error ? (e.name === "AbortError" ? "Timed out" : e.message) : String(e);
        // Network / auth errors will not improve on retry; parse errors might.
        if (/^(Gemini|Groq) (4\d\d)|Timed out|Failed to fetch|NetworkError/.test(error)) break;
      } finally {
        clearTimeout(timer);
      }
    }
  } else if (!ok && provider.id !== "local") {
    error = `${provider.id} is not configured`;
  }

  const fallbackUsed = !ok;
  if (!ok) value = opts.fallback();
  const latencyMs = Date.now() - started;
  host.record((db) => {
    const id = newId("ai");
    db.aiInteractions[id] = {
      id,
      role: opts.role,
      provider: provider.id,
      model: provider.model,
      ok,
      fallbackUsed,
      latencyMs,
      summary: (cached ? "(cached) " : "") + opts.summary.slice(0, 190),
      error,
      sessionId: opts.sessionId,
      milestoneId: opts.milestoneId,
      createdAt: Date.now(),
    };
    logEvent(db, "AI_INTERACTION", { sessionId: opts.sessionId, milestoneId: opts.milestoneId }, {
      role: opts.role, provider: provider.id, ok, fallbackUsed, latencyMs, cached,
    });
  });
  return { value: value as T, provider: ok ? provider.id : "local", fallbackUsed, error, cached };
}

export const parseJSON = <T>(validate: (x: unknown) => T) => (text: string) => validate(extractJSON(text));

/** What the AI is doing, for loading states (instead of a bare "Generating…"). */
export const AI_PROGRESS = (role: AIRole): string =>
  (({
    CURRICULUM_BUILDER: L("Mapping prerequisites…", "Önkoşullar haritalanıyor…"),
    CURRICULUM_REVIEWER: L("Reviewing the proposal…", "Öneri gözden geçiriliyor…"),
    MILESTONE_GENERATOR: L("Checking milestone granularity…", "Adım büyüklüğü kontrol ediliyor…"),
    GRANULARITY_VALIDATOR: L("Checking milestone granularity…", "Adım büyüklüğü kontrol ediliyor…"),
    PATH_PLANNER: L("Building your path…", "Rotan oluşturuluyor…"),
    EVALUATOR: L("Reading your answer against the criteria…", "Cevabın ölçütlere göre okunuyor…"),
    EXPLANATION_EVALUATOR: L("Checking your explanation…", "Açıklaman kontrol ediliyor…"),
    ERROR_ANALYST: L("Tracing where the error comes from…", "Hatanın kaynağı izleniyor…"),
    HINT_GENERATOR: L("Finding a small next step…", "Küçük bir sonraki adım bulunuyor…"),
    TUTOR: L("Thinking it through…", "Düşünülüyor…"),
    SOCRATIC_GUIDE: L("Preparing a guiding question…", "Yol gösteren bir soru hazırlanıyor…"),
    QA_ASSISTANT: L("Looking at this topic…", "Konuya bakılıyor…"),
    FLASHCARD_GENERATOR: L("Writing cards…", "Kartlar yazılıyor…"),
    MINDMAP_GENERATOR: L("Drawing the map…", "Harita çiziliyor…"),
    REFLECTION_ANALYST: L("Looking back at the session…", "Oturuma geri bakılıyor…"),
    RESEARCH_GUIDE: L("Thinking about the next research step…", "Sonraki araştırma adımı düşünülüyor…"),
  } as Partial<Record<AIRole, string>>)[role] ?? L("Working…", "Çalışıyor…"));
