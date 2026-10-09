/// <reference lib="webworker" />
/**
 * Runs Python (Pyodide) off the page. The page sends { id, code, indexURL };
 * the worker replies { id, ...PyResult } or { id, ready } after loading.
 */
import { execute, prepare, type PyodideLike } from "./pythonCore";

let py: PyodideLike | null = null;
let loading: Promise<PyodideLike> | null = null;

// Some WebViews (Android's local asset server) serve .wasm without the
// application/wasm type, which makes streaming compilation fail. Fall back to
// compiling from the downloaded bytes.
const streaming = WebAssembly.instantiateStreaming?.bind(WebAssembly);
if (streaming) {
  WebAssembly.instantiateStreaming = async (source, imports) => {
    const res = await source;
    const copy = res.clone();
    try {
      return await streaming(res, imports);
    } catch {
      return WebAssembly.instantiate(await copy.arrayBuffer(), imports);
    }
  };
}

async function load(indexURL: string): Promise<PyodideLike> {
  const mod = (await import(/* @vite-ignore */ `${indexURL}pyodide.mjs`)) as { loadPyodide: (o: { indexURL: string }) => Promise<PyodideLike> };
  const p = await mod.loadPyodide({ indexURL });
  prepare(p);
  // From here on, the worker can only fetch the app's own Python files (packages
  // load from there on first import) and nothing else: no network, no storage.
  const g = self as unknown as Record<string, unknown>;
  const ownFetch = fetch.bind(self);
  g.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url, indexURL).href;
    return url.startsWith(indexURL) ? ownFetch(url, init) : Promise.reject(new TypeError("Network access is disabled in the Python sandbox"));
  };
  for (const k of ["XMLHttpRequest", "WebSocket", "indexedDB", "importScripts", "EventSource"]) {
    try { g[k] = undefined; } catch { /* read-only in some engines */ }
  }
  return p;
}

self.onmessage = async (e: MessageEvent<{ id: number; code?: string; indexURL: string }>) => {
  const { id, code, indexURL } = e.data;
  try {
    py ??= await (loading ??= load(indexURL));
    if (code === undefined) {
      (self as unknown as Worker).postMessage({ id, ready: true });
      return;
    }
    const post = (m: object) => (self as unknown as Worker).postMessage({ id, ...m });
    const r = await execute(py, code, { onMessage: (m) => post({ progress: m }), onRunning: () => post({ running: true }) });
    post({ ...r, done: true });
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, ok: false, stdout: "", series: [], images: [], packages: [], error: `Python could not start: ${err instanceof Error ? err.message : String(err)}`, ms: 0, done: true });
  }
};
