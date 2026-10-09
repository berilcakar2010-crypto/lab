/**
 * Python sandbox core: real CPython (Pyodide, WebAssembly), shared by the
 * Web Worker that runs it in the app and by the tests that run it in Node.
 *
 * Safety: the code runs in a worker (never on the page), with no access to
 * JavaScript, the network or storage from Python (`js`, `pyodide_js` and
 * `pyodide.http` are blocked; the worker also removes fetch, XHR, WebSocket
 * and IndexedDB from its own scope), with an output cap, and the page
 * terminates the worker after a time limit. Results come back as text and
 * plotted series — nothing is written to Lab's data unless the learner saves it.
 */

export const MAX_OUTPUT = 20_000;
export const MAX_POINTS = 400;

/** Defines plot() and blocks access to JavaScript and the network from Python. */
export const PRELUDE = `
import sys, json
__lab_series__ = []
def plot(xs, ys=None, label="y"):
    """plot(ys) or plot(xs, ys, label): adds a line to the chart Lab shows."""
    if ys is None:
        ys = list(xs)
        xs = list(range(len(ys)))
    pts = [[float(x), float(y)] for x, y in zip(xs, ys)][:${MAX_POINTS}]
    __lab_series__.append({"label": str(label), "points": pts})
for _m in ("js", "pyodide_js", "pyodide.http", "pyodide.ffi.wrappers"):
    sys.modules[_m] = None
del _m
`;

export interface PyResult {
  ok: boolean;
  stdout: string;
  /** repr of the last expression, if any. */
  result?: string;
  series: { label: string; points: [number, number][] }[];
  error?: string;
  ms: number;
}

/** Minimal surface of the Pyodide object this module uses. */
export interface PyodideLike {
  runPython(code: string): unknown;
  runPythonAsync(code: string): Promise<unknown>;
  setStdout(o: { batched: (s: string) => void }): void;
  setStderr(o: { batched: (s: string) => void }): void;
}

export function prepare(py: PyodideLike): void {
  py.runPython(PRELUDE);
}

export async function execute(py: PyodideLike, code: string, now: () => number = () => Date.now()): Promise<PyResult> {
  const started = now();
  let out = "";
  const sink = { batched: (s: string) => { if (out.length < MAX_OUTPUT) out += s.slice(0, MAX_OUTPUT - out.length) + "\n"; } };
  py.setStdout(sink);
  py.setStderr(sink);
  py.runPython("__lab_series__.clear()");
  try {
    const r = await py.runPythonAsync(code);
    const series = JSON.parse(String(py.runPython("json.dumps(__lab_series__)"))) as PyResult["series"];
    let result: string | undefined;
    if (r !== undefined && r !== null) {
      const v = r as { toString(): string; destroy?: () => void };
      result = String(v.toString()).slice(0, 2000);
      v.destroy?.();
    }
    return { ok: true, stdout: out, result, series, ms: now() - started };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Keep the useful end of the traceback.
    return { ok: false, stdout: out, series: [], error: msg.split("\n").filter((l) => !l.includes("/lib/python") || l.includes("File \"<exec>\"")).slice(-12).join("\n"), ms: now() - started };
  }
}
