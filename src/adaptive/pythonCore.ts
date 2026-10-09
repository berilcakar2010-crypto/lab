/**
 * Python sandbox core: real CPython (Pyodide, WebAssembly), shared by the
 * Web Worker that runs it in the app and by the tests that run it in Node.
 *
 * Scientific packages (numpy, scipy, pandas, matplotlib, sympy, networkx,
 * scikit-learn, statsmodels…) ship inside the app (scripts/fetch-pyodide-
 * packages.mjs) and are loaded from it on first import — offline. matplotlib
 * draws with the non-interactive Agg backend in Lab's colours; open figures
 * come back as PNG images.
 *
 * Safety: the code runs in a worker (never on the page). From Python there is
 * no access to JavaScript (`js`, `pyodide_js`, `pyodide.http` are blocked);
 * the worker itself can only fetch the app's own Python files, and has no
 * XHR, WebSocket or IndexedDB. Output is capped, and the page terminates the
 * worker after a time limit. Nothing is written to Lab's data unless the
 * learner saves the run.
 */

export const MAX_OUTPUT = 20_000;
export const MAX_POINTS = 400;
export const MAX_FIGURES = 4;

/** Defines plot() and blocks access to JavaScript and the network from Python. */
export const PRELUDE = `
import sys, json, os
os.environ["MPLBACKEND"] = "Agg"
__lab_series__ = []
def plot(xs, ys=None, label="y"):
    """plot(ys) or plot(xs, ys, label): adds a line to the chart Lab shows."""
    if ys is None:
        ys = list(xs)
        xs = list(range(len(ys)))
    pts = [[float(x), float(y)] for x, y in zip(xs, ys)][:${MAX_POINTS}]
    __lab_series__.append({"label": str(label), "points": pts})
def __lab_missing__(code, allowed, _find=__import__("pyodide.code", fromlist=["find_imports"]).find_imports, _spec=__import__("importlib.util", fromlist=["find_spec"]).find_spec):
    """Top-level imports that are neither installed nor among the bundled packages."""
    out = []
    for n in _find(code):
        top = n.split(".")[0]
        if top in allowed or top in out:
            continue
        try:
            found = _spec(top) is not None
        except Exception:
            found = False
        if not found:
            out.append(top)
    return json.dumps(out)
for _m in ("js", "pyodide_js", "pyodide.http", "pyodide.ffi.wrappers"):
    sys.modules[_m] = None
del _m
`;

/** Lab's dark-academic look for matplotlib (applied when matplotlib is first used). */
export const MPL_THEME = `
import matplotlib
matplotlib.use("Agg")
matplotlib.rcParams.update({
    "figure.facecolor": "#1f1015", "axes.facecolor": "#1f1015", "savefig.facecolor": "#1f1015",
    "axes.edgecolor": "#5a3039", "axes.labelcolor": "#f3e9e1", "text.color": "#f3e9e1",
    "xtick.color": "#d2bfb5", "ytick.color": "#d2bfb5", "grid.color": "#3e2229", "axes.grid": True,
    "axes.prop_cycle": matplotlib.cycler(color=["#e28a9a", "#9cc5a1", "#e0b46a", "#a7a3ef", "#7fb7d6", "#d2bfb5"]),
    "figure.figsize": (6.4, 4.0), "figure.dpi": 100, "font.size": 10, "legend.frameon": False,
})
`;

const CAPTURE = `
import base64, io
__lab_figs__ = []
if "matplotlib.pyplot" in sys.modules:
    import matplotlib.pyplot as __plt
    for __n in __plt.get_fignums()[:${MAX_FIGURES}]:
        __b = io.BytesIO()
        __plt.figure(__n).savefig(__b, format="png", dpi=110, bbox_inches="tight")
        __lab_figs__.append(base64.b64encode(__b.getvalue()).decode())
    __plt.close("all")
json.dumps(__lab_figs__)
`;

export interface PyResult {
  ok: boolean;
  stdout: string;
  /** Text of the last expression, if any. */
  result?: string;
  series: { label: string; points: [number, number][] }[];
  /** matplotlib figures as PNG data URLs. */
  images: string[];
  /** Packages loaded for this run. */
  packages: string[];
  error?: string;
  ms: number;
}

/** Minimal surface of the Pyodide object this module uses. */
export interface PyodideLike {
  runPython(code: string): unknown;
  runPythonAsync(code: string): Promise<unknown>;
  setStdout(o: { batched: (s: string) => void }): void;
  setStderr(o: { batched: (s: string) => void }): void;
  loadPackagesFromImports?(code: string, opts?: { messageCallback?: (m: string) => void; errorCallback?: (m: string) => void }): Promise<unknown>;
  loadedPackages?: Record<string, string>;
}

export function prepare(py: PyodideLike): void {
  py.runPython(PRELUDE);
}

let themed = false;

/**
 * Import names the app ships packages for: the bundle manifest
 * (public/pyodide/lab-packages.json) joined with Pyodide's lock file.
 */
export function bundledImports(manifest: { packages?: string[] }, lock: { packages?: Record<string, { imports?: string[] }> }): Set<string> {
  const out = new Set<string>();
  for (const name of manifest.packages ?? []) for (const i of lock.packages?.[name]?.imports ?? []) out.add(i);
  return out;
}

/**
 * Load the packages the code imports (from the app's own files). Returns the
 * newly loaded ones. With `allowed`, an import that is neither installed nor
 * bundled is refused up front, so nothing is ever fetched from elsewhere.
 */
export async function loadImports(py: PyodideLike, code: string, onMessage?: (m: string) => void, allowed?: ReadonlySet<string>): Promise<string[]> {
  if (!py.loadPackagesFromImports) return [];
  if (allowed) {
    const missing = JSON.parse(String(py.runPython(`__lab_missing__(${JSON.stringify(code)}, ${JSON.stringify([...allowed])})`))) as string[];
    if (missing.length) throw new Error(`No module named ${missing.map((m) => `'${m}'`).join(", ")} (not bundled with Lab)`);
  }
  const before = new Set(Object.keys(py.loadedPackages ?? {}));
  const errors: string[] = [];
  await py.loadPackagesFromImports(code, { messageCallback: (m) => onMessage?.(m), errorCallback: (m) => errors.push(m) });
  if (errors.length) throw new Error(errors.join("\n"));
  return Object.keys(py.loadedPackages ?? {}).filter((p) => !before.has(p));
}

export async function execute(py: PyodideLike, code: string, opts: { now?: () => number; onMessage?: (m: string) => void; /** Import names of the bundled packages (see bundledImports). */ allowedImports?: ReadonlySet<string>; /** Packages are loaded; the learner's code starts now (the time limit starts here). */ onRunning?: () => void } = {}): Promise<PyResult> {
  const now = opts.now ?? (() => Date.now());
  const started = now();
  let out = "";
  // One-time notices from packages (e.g. matplotlib's font cache) are not the learner's output.
  const sink = { batched: (s: string) => { if (/^Matplotlib is building the font cache/.test(s)) return; if (out.length < MAX_OUTPUT) out += s.slice(0, MAX_OUTPUT - out.length) + "\n"; } };
  py.setStdout(sink);
  py.setStderr(sink);
  py.runPython("__lab_series__.clear()");
  let packages: string[] = [];
  try {
    packages = await loadImports(py, code, opts.onMessage, opts.allowedImports);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, stdout: out, series: [], images: [], packages, error: `Package not available offline: ${msg.slice(0, 400)}`, ms: now() - started };
  }
  opts.onRunning?.();
  try {
    if (!themed && /\bmatplotlib\b/.test(code)) {
      py.runPython(MPL_THEME);
      themed = true;
    }
    const r = await py.runPythonAsync(code);
    const series = JSON.parse(String(py.runPython("json.dumps(__lab_series__)"))) as PyResult["series"];
    const images = (JSON.parse(String(py.runPython(CAPTURE))) as string[]).map((b) => `data:image/png;base64,${b}`);
    let result: string | undefined;
    if (r !== undefined && r !== null) {
      const v = r as { toString(): string; destroy?: () => void };
      result = String(v.toString()).slice(0, 2000);
      v.destroy?.();
    }
    return { ok: true, stdout: out, result, series, images, packages, ms: now() - started };
  } catch (e) {
    try { py.runPython('import sys\nif "matplotlib.pyplot" in sys.modules:\n    sys.modules["matplotlib.pyplot"].close("all")'); } catch { /* ignore */ }
    const msg = e instanceof Error ? e.message : String(e);
    // Keep the useful end of the traceback.
    return { ok: false, stdout: out, series: [], images: [], packages, error: msg.split("\n").filter((l) => !l.includes("/lib/python") || l.includes("File \"<exec>\"")).slice(-12).join("\n"), ms: now() - started };
  }
}
