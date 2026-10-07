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

export interface AIProvider {
  id: AIProviderId;
  model: string;
  /** False when the provider cannot be called (e.g. no key, offline). */
  ready(): boolean;
  complete(req: CompletionRequest): Promise<string>;
}

export class AIUnavailableError extends Error {}

type Fetch = typeof fetch;

export function geminiProvider(apiKey: string | undefined, model: string, fetchImpl: Fetch = fetch): AIProvider {
  return {
    id: "gemini",
    model,
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
