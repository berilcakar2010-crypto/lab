/**
 * Provider abstraction. The rest of the app only knows `AIProvider`; adding a
 * provider means implementing `complete` and registering it in `makeProvider`.
 */
import type { AIProviderId, UserPreference } from "../domain/types";

export interface CompletionRequest {
  system: string;
  prompt: string;
  /** Ask for a JSON object response. */
  json: boolean;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
  /** Optional JPEG/PNG data URLs (e.g. a stylus drawing). Providers without vision ignore them. */
  images?: string[];
}

/** What a provider can do. Application code asks for a capability, never for a vendor. */
export interface ProviderCapabilities {
  /** Free text generation. */
  generate: boolean;
  /** Judging an answer against a rubric (needs reliable JSON). */
  evaluate: boolean;
  /** A JSON-object response mode. */
  structuredOutput: boolean;
  /** Image input (stylus drawings). */
  vision: boolean;
  /** Text embeddings. Not used by any provider yet; search is local. */
  embed: boolean;
}

export interface AIProvider {
  id: AIProviderId;
  model: string;
  /** Declared capabilities; a provider that omits them is treated as text + JSON capable. */
  capabilities?: ProviderCapabilities;
  /** False when the provider cannot be called (e.g. no key, offline). */
  ready(): boolean;
  complete(req: CompletionRequest): Promise<string>;
}

export class AIUnavailableError extends Error {}

export const capabilitiesOf = (p: AIProvider): ProviderCapabilities =>
  p.capabilities ?? { generate: true, evaluate: true, structuredOutput: true, vision: false, embed: false };

type Fetch = typeof fetch;

export function geminiProvider(apiKey: string | undefined, model: string, fetchImpl: Fetch = fetch): AIProvider {
  return {
    id: "gemini",
    model,
    capabilities: { generate: true, evaluate: true, structuredOutput: true, vision: true, embed: false },
    ready: () => !!apiKey,
    async complete(req) {
      if (!apiKey) throw new AIUnavailableError("No Gemini API key configured");
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
      const res = await fetchImpl(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        signal: req.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: req.system }] },
          contents: [{ role: "user", parts: [{ text: req.prompt }, ...(req.images ?? []).map(toInlineData)] }],
          generationConfig: {
            temperature: req.temperature ?? 0.4,
            maxOutputTokens: req.maxTokens ?? 4096,
            ...(req.json ? { responseMimeType: "application/json" } : {}),
          },
        }),
      });
      if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await safeText(res)).slice(0, 200)}`);
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
      if (!text) throw new Error("Gemini returned an empty response");
      return text;
    },
  };
}

export function groqProvider(apiKey: string | undefined, model: string, fetchImpl: Fetch = fetch): AIProvider {
  return {
    id: "groq",
    model,
    capabilities: { generate: true, evaluate: true, structuredOutput: true, vision: false, embed: false },
    ready: () => !!apiKey,
    async complete(req) {
      if (!apiKey) throw new AIUnavailableError("No Groq API key configured");
      const res = await fetchImpl("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        signal: req.signal,
        body: JSON.stringify({
          model,
          temperature: req.temperature ?? 0.4,
          max_tokens: req.maxTokens ?? 4096,
          messages: [
            { role: "system", content: req.system },
            { role: "user", content: req.prompt },
          ],
          ...(req.json ? { response_format: { type: "json_object" } } : {}),
        }),
      });
      if (!res.ok) throw new Error(`Groq ${res.status}: ${(await safeText(res)).slice(0, 200)}`);
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content ?? "";
      if (!text) throw new Error("Groq returned an empty response");
      return text;
    },
  };
}

/** The local provider never answers free text; every role has a deterministic fallback instead. */
export const localProvider: AIProvider = {
  id: "local",
  model: "offline",
  capabilities: { generate: false, evaluate: false, structuredOutput: false, vision: false, embed: false },
  ready: () => false,
  complete: async () => {
    throw new AIUnavailableError("Offline mode");
  },
};

export function makeProvider(prefs: UserPreference, id: AIProviderId = prefs.aiProvider): AIProvider {
  switch (id) {
    case "gemini":
      return geminiProvider(prefs.apiKeys.gemini, prefs.models.gemini);
    case "groq":
      return groqProvider(prefs.apiKeys.groq, prefs.models.groq);
    default:
      return localProvider;
  }
}

function toInlineData(dataUrl: string) {
  const m = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  return m ? { inline_data: { mime_type: m[1], data: m[2] } } : { text: "" };
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

/** Extract the first JSON object from a model response (handles code fences/prose). */
export function extractJSON<T = unknown>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object in response");
  return JSON.parse(body.slice(start, end + 1)) as T;
}
