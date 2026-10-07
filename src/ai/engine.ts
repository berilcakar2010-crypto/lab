/**
 * AI engine: runs a role-specific request through the configured provider,
 * records an AIInteraction + raw event, validates the result, and falls back
 * to a deterministic local implementation on any failure. AI never writes to
 * the database directly — callers decide what to do with the result.
 */
import type { AIProviderId, AIRole, ID, LabDB } from "../domain/types";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { extractJSON, makeProvider, type AIProvider } from "./providers";

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
  /** Parse + validate the raw text; throw to reject. */
  parse: (text: string) => T;
  /** Deterministic result used when AI is unavailable or fails. */
  fallback: () => T;
  sessionId?: ID;
  milestoneId?: ID;
  summary: string;
}

export interface AIResult<T> {
  value: T;
  provider: AIProviderId;
  fallbackUsed: boolean;
  error?: string;
}

export async function runAI<T>(host: AIHost, opts: AIRunOptions<T>): Promise<AIResult<T>> {
  const prefs = host.db().preferences;
  const provider = host.provider ?? makeProvider(prefs);
  const started = Date.now();
  let error: string | undefined;
  let value: T | undefined;
  let ok = false;

  if (provider.ready()) {
    for (let attempt = 0; attempt < 2 && !ok; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 60_000);
      try {
        const text = await provider.complete({
          system: opts.system,
          prompt: attempt === 0 ? opts.prompt : `${opts.prompt}\n\nYour previous reply could not be parsed. Reply with ONLY valid JSON matching the schema.`,
          json: opts.json ?? true,
          temperature: opts.temperature,
          maxTokens: opts.maxTokens,
          signal: ctrl.signal,
        });
        value = opts.parse(text);
        ok = true;
        error = undefined;
      } catch (e) {
        error = e instanceof Error ? (e.name === "AbortError" ? "Timed out" : e.message) : String(e);
        // Network / auth errors will not improve on retry; parse errors might.
        if (/^(Gemini|Groq) (4\d\d)|Timed out|Failed to fetch|NetworkError/.test(error)) break;
      } finally {
        clearTimeout(timer);
      }
    }
  } else if (provider.id !== "local") {
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
      summary: opts.summary.slice(0, 200),
      error,
      sessionId: opts.sessionId,
      milestoneId: opts.milestoneId,
      createdAt: Date.now(),
    };
    logEvent(db, "AI_INTERACTION", { sessionId: opts.sessionId, milestoneId: opts.milestoneId }, {
      role: opts.role, provider: provider.id, ok, fallbackUsed, latencyMs,
    });
  });
  return { value: value as T, provider: ok ? provider.id : "local", fallbackUsed, error };
}

export const parseJSON = <T>(validate: (x: unknown) => T) => (text: string) => validate(extractJSON(text));
