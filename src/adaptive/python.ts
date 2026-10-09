/**
 * Page side of the Python sandbox: one worker, reused while it is healthy,
 * terminated (and recreated on the next run) when a run exceeds the time limit.
 */
import type { SandboxRun } from "../domain/adaptive";
import { L } from "../i18n";
import type { PyResult } from "./pythonCore";

export const PY_TIMEOUT_MS = 15_000;
let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, (r: PyResult & { ready?: boolean }) => void>();

const indexURL = () => new URL("pyodide/", document.baseURI).href;

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("./python.worker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (e: MessageEvent<PyResult & { id: number; ready?: boolean }>) => {
    const done = pending.get(e.data.id);
    pending.delete(e.data.id);
    done?.(e.data);
  };
  worker.onerror = () => {
    for (const [, done] of pending) done({ ok: false, stdout: "", series: [], error: L("The Python runtime could not be loaded.", "Python çalışma ortamı yüklenemedi."), ms: 0 });
    pending.clear();
    worker?.terminate();
    worker = null;
  };
  return worker;
}

function send(code: string | undefined, timeoutMs: number): Promise<PyResult & { ready?: boolean }> {
  const id = ++seq;
  const w = getWorker();
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      if (!pending.has(id)) return;
      pending.delete(id);
      w.terminate();
      if (worker === w) worker = null;
      resolve({ ok: false, stdout: "", series: [], error: L(`Stopped after ${Math.round(timeoutMs / 1000)} s (time limit). An infinite loop?`, `${Math.round(timeoutMs / 1000)} sn sonra durduruldu (süre sınırı). Sonsuz döngü olabilir mi?`), ms: timeoutMs });
    }, timeoutMs);
    pending.set(id, (r) => { clearTimeout(t); resolve(r); });
    w.postMessage({ id, code, indexURL: indexURL() });
  });
}

/** Load the runtime ahead of the first run (takes a few seconds the first time). */
export const warmUpPython = () => send(undefined, 60_000);

export const runPython = (code: string, timeoutMs = PY_TIMEOUT_MS) => send(code, timeoutMs);

export const PY_EXAMPLE = `# Real Python 3, running offline in Lab. plot(xs, ys, label) draws a line.
import math
g, L = 9.81, 1.0
ts = [i * 0.05 for i in range(200)]
theta = [0.3 * math.cos(math.sqrt(g / L) * t) for t in ts]
plot(ts, theta, "θ(t), small angle")
print("period ≈", round(2 * math.pi * math.sqrt(L / g), 3), "s")
`;

/** Turn a Python result into a sandbox run (saved only when the learner chooses). */
export function pythonRun(code: string, r: PyResult): Omit<SandboxRun, "id" | "createdAt" | "loIds" | "title"> {
  const text = (r.ok ? `${r.stdout}${r.result ? `→ ${r.result}` : ""}` : r.error ?? "").trim();
  return { kind: "PYTHON", input: { code }, summary: text.slice(0, 600) || L("(no output)", "(çıktı yok)"), series: r.series, stats: { ms: r.ms } };
}

