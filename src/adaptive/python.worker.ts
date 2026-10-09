/// <reference lib="webworker" />
/**
 * Runs Python (Pyodide) off the page. The page sends { id, code, indexURL };
 * the worker replies { id, ...PyResult } or { id, ready } after loading.
 */
import { execute, prepare, type PyodideLike } from "./pythonCore";

let py: PyodideLike | null = null;
let loading: Promise<PyodideLike> | null = null;

async function load(indexURL: string): Promise<PyodideLike> {
  const mod = (await import(/* @vite-ignore */ `${indexURL}pyodide.mjs`)) as { loadPyodide: (o: { indexURL: string }) => Promise<PyodideLike> };
  const p = await mod.loadPyodide({ indexURL });
  prepare(p);
  // From here on, nothing in this worker can reach the network or storage.
  const g = self as unknown as Record<string, unknown>;
  for (const k of ["fetch", "XMLHttpRequest", "WebSocket", "indexedDB", "importScripts", "EventSource"]) {
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
    (self as unknown as Worker).postMessage({ id, ...(await execute(py, code)) });
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, ok: false, stdout: "", series: [], error: `Python could not start: ${err instanceof Error ? err.message : String(err)}`, ms: 0 });
  }
};
