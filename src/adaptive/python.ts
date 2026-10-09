/**
 * Page side of the Python sandbox: one worker, reused while it is healthy,
 * terminated (and recreated on the next run) when a run exceeds the time limit.
 */
import type { SandboxRun } from "../domain/adaptive";
import { L } from "../i18n";
import type { PyResult } from "./pythonCore";

export const PY_TIMEOUT_MS = 15_000;
/** Loading large packages (scipy, scikit-learn) the first time can take a while on a phone. */
export const PY_LOAD_TIMEOUT_MS = 240_000;
let worker: Worker | null = null;
let seq = 0;
type Msg = PyResult & { id: number; ready?: boolean; done?: boolean; progress?: string; running?: boolean };
const pending = new Map<number, (r: Msg) => void>();

const indexURL = () => new URL("pyodide/", document.baseURI).href;

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("./python.worker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (e: MessageEvent<Msg>) => {
    pending.get(e.data.id)?.(e.data);
  };
  worker.onerror = () => {
    for (const [id, done] of pending) done({ id, ok: false, stdout: "", series: [], images: [], packages: [], done: true, error: L("The Python runtime could not be loaded.", "Python çalışma ortamı yüklenemedi."), ms: 0 });
    pending.clear();
    worker?.terminate();
    worker = null;
  };
  return worker;
}

function send(code: string | undefined, timeoutMs: number, onProgress?: (m: string) => void): Promise<PyResult & { ready?: boolean }> {
  const id = ++seq;
  const w = getWorker();
  return new Promise((resolve) => {
    let timer: ReturnType<typeof setTimeout>;
    const arm = (ms: number) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!pending.has(id)) return;
        pending.delete(id);
        w.terminate();
        if (worker === w) worker = null;
        resolve({ ok: false, stdout: "", series: [], images: [], packages: [], error: L(`Stopped after ${Math.round(ms / 1000)} s (time limit). An infinite loop?`, `${Math.round(ms / 1000)} sn sonra durduruldu (süre sınırı). Sonsuz döngü olabilir mi?`), ms });
      }, ms);
    };
    // Starting the runtime and loading packages get a long allowance; the code itself gets timeoutMs.
    arm(code === undefined ? timeoutMs : PY_LOAD_TIMEOUT_MS);
    pending.set(id, (m) => {
      if (m.progress !== undefined) { onProgress?.(m.progress); arm(PY_LOAD_TIMEOUT_MS); return; }
      if (m.running) { arm(timeoutMs); return; }
      if (!m.done && !m.ready) return;
      clearTimeout(timer);
      pending.delete(id);
      resolve(m);
    });
    w.postMessage({ id, code, indexURL: indexURL() });
  });
}

/** Load the runtime ahead of the first run (takes a few seconds the first time). */
export const warmUpPython = () => send(undefined, 60_000);

export const runPython = (code: string, opts: { timeoutMs?: number; onProgress?: (m: string) => void } = {}) => send(code, opts.timeoutMs ?? PY_TIMEOUT_MS, opts.onProgress);

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
  return { kind: "PYTHON", input: { code, packages: r.packages }, summary: text.slice(0, 600) || L("(no output)", "(çıktı yok)"), series: r.series, images: r.images.slice(0, 2), stats: { ms: r.ms } };
}


/** Starting points for the sandbox; each one runs offline with the bundled packages. */
export const PY_EXAMPLES: { id: string; title: string; code: string }[] = [
  { id: "basic", title: "Python (standard library)", code: PY_EXAMPLE },
  { id: "numpy", title: "numpy + matplotlib: damped oscillator", code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 10, 500)
for gamma in (0.1, 0.4, 1.0):
    plt.plot(t, np.exp(-gamma * t) * np.cos(3 * t), label=f"γ = {gamma}")
plt.xlabel("t (s)"); plt.ylabel("x(t)"); plt.title("Damped oscillator"); plt.legend()
print("energy after 5 s, γ=0.4:", round(float(np.exp(-0.8 * 5)), 4))
` },
  { id: "scipy", title: "scipy: solve an ODE (Lotka–Volterra)", code: `import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

def f(t, z, a=1.0, b=0.1, c=1.5, d=0.075):
    x, y = z
    return [a*x - b*x*y, -c*y + d*x*y]

sol = solve_ivp(f, (0, 30), [10, 5], dense_output=True, max_step=0.05)
t = np.linspace(0, 30, 600)
x, y = sol.sol(t)
plt.plot(t, x, label="prey"); plt.plot(t, y, label="predators"); plt.legend(); plt.xlabel("t")
print("max prey:", round(float(x.max()), 1))
` },
  { id: "pandas", title: "pandas + statsmodels: regression", code: `import numpy as np, pandas as pd
import statsmodels.api as sm

rng = np.random.default_rng(1)
df = pd.DataFrame({"hours": rng.uniform(0, 10, 60)})
df["score"] = 50 + 4.2 * df.hours + rng.normal(0, 6, len(df))
model = sm.OLS(df.score, sm.add_constant(df.hours)).fit()
print(df.describe().round(2))
print(model.params.round(2))
print("R² =", round(model.rsquared, 3))
` },
  { id: "sympy", title: "sympy: symbolic calculus", code: `import sympy as sp
x = sp.symbols("x")
f = sp.sin(x) * sp.exp(-x)
print("f'(x) =", sp.simplify(sp.diff(f, x)))
print("∫ f dx from 0 to ∞ =", sp.integrate(f, (x, 0, sp.oo)))
print("Taylor:", sp.series(f, x, 0, 5))
` },
  { id: "sklearn", title: "scikit-learn: classify iris flowers", code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

X, y = load_iris(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)
clf = LogisticRegression(max_iter=500).fit(Xtr, ytr)
print("test accuracy:", round(clf.score(Xte, yte), 3))
` },
  { id: "networkx", title: "networkx: shortest path in a graph", code: `import networkx as nx
G = nx.Graph()
G.add_weighted_edges_from([("A","B",2),("B","C",1),("A","C",4),("C","D",1),("B","D",5)])
print("shortest A→D:", nx.shortest_path(G, "A", "D", weight="weight"))
print("length:", nx.shortest_path_length(G, "A", "D", weight="weight"))
` },
];
