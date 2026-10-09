import { beforeAll, describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { loadPyodide } from "pyodide";
import { bundledImports, execute, prepare, type PyodideLike } from "./pythonCore";
import { pythonRun } from "./python";

let py: PyodideLike;
/** Packages are bundled by scripts/fetch-pyodide-packages.mjs (run by build/dev and CI). */
const BUNDLED = existsSync("public/pyodide/lab-packages.json");
const readJson = (f: string) => JSON.parse(readFileSync(f, "utf8"));
/** The same allowlist the worker uses, so a machine with network behaves like the offline app. */
const ALLOWED = BUNDLED ? bundledImports(readJson("public/pyodide/lab-packages.json"), readJson("node_modules/pyodide/pyodide-lock.json")) : new Set<string>();
const opts = { allowedImports: ALLOWED };
beforeAll(async () => {
  // Runtime from the npm package; scientific packages from the bundle the app ships.
  py = (await loadPyodide({ indexURL: `${process.cwd()}/node_modules/pyodide/`, ...(BUNDLED ? { packageCacheDir: `${process.cwd()}/public/pyodide/` } : {}) } as Parameters<typeof loadPyodide>[0])) as unknown as PyodideLike;
  prepare(py);
}, 60_000);

describe("Python sandbox (real CPython via Pyodide)", () => {
  it("runs code, captures output, the last value and plotted series", async () => {
    const r = await execute(py, "import math\nprint('hi', 2+3)\nplot([0,1,2],[0,1,4],'sq')\nmath.sqrt(16)");
    expect(r.ok).toBe(true);
    expect(r.stdout).toContain("hi 5");
    expect(r.result).toBe("4");
    expect(r.series).toEqual([{ label: "sq", points: [[0, 0], [1, 1], [2, 4]] }]);
    const run = pythonRun("x", r);
    expect(run.kind).toBe("PYTHON");
    expect(run.summary).toContain("hi 5");
  });

  it("reports Python errors with the traceback, and the next run starts clean", async () => {
    const r = await execute(py, "plot([1,2])\n1/0");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/ZeroDivisionError/);
    const r2 = await execute(py, "print('ok')");
    expect(r2.ok).toBe(true);
    expect(r2.series).toEqual([]);
  });

  it("cannot reach JavaScript (and through it the network or storage)", async () => {
    const r = await execute(py, "import js");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/ImportError|ModuleNotFoundError|halted/);
    const r2 = await execute(py, "import pyodide.http");
    expect(r2.ok).toBe(false);
  });

  it("caps runaway output", async () => {
    const r = await execute(py, "for i in range(100000): print('x'*50)");
    expect(r.stdout.length).toBeLessThanOrEqual(20_001);
  });
});

describe.skipIf(!BUNDLED)("bundled scientific packages (offline)", () => {
  it("numpy, scipy, pandas, sympy work", async () => {
    const r = await execute(py, `import numpy as np
from scipy.integrate import quad
import pandas as pd
import sympy as sp
x = sp.symbols("x")
print(float(np.mean([1, 2, 3])), round(quad(lambda t: t**2, 0, 3)[0], 6), int(pd.DataFrame({"a": [1, 2]}).a.sum()), sp.diff(x**3, x))`, opts);
    expect(r.error).toBeUndefined();
    expect(r.stdout).toContain("2.0 9.0 3 3*x**2");
    expect(r.packages).toEqual(expect.arrayContaining(["numpy", "scipy", "pandas", "sympy"]));
  }, 180_000);

  it("matplotlib figures come back as PNG images", async () => {
    const r = await execute(py, "import matplotlib.pyplot as plt\nplt.plot([0, 1, 2], [0, 1, 4])\nplt.title('t')", opts);
    expect(r.error).toBeUndefined();
    expect(r.images).toHaveLength(1);
    expect(r.images[0]).toMatch(/^data:image\/png;base64,iVBOR/);
    const again = await execute(py, "print('no figure left open')");
    expect(again.images).toEqual([]);
  }, 180_000);

  it("scikit-learn, statsmodels and networkx work", async () => {
    const r = await execute(py, `from sklearn.linear_model import LinearRegression
import statsmodels.api as sm
import networkx as nx
import numpy as np
X = np.arange(10).reshape(-1, 1); y = 3 * X.ravel() + 1
print(round(LinearRegression().fit(X, y).coef_[0], 3), round(sm.OLS(y, sm.add_constant(X)).fit().params[1], 3), nx.shortest_path_length(nx.path_graph(5), 0, 4))`, opts);
    expect(r.error).toBeUndefined();
    expect(r.stdout).toContain("3.0 3.0 4");
  }, 180_000);

  it("a package that is not bundled is reported clearly", async () => {
    const r = await execute(py, "import math\nimport astropy.units as u", opts);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/No module named 'astropy' \(not bundled/);
    expect(r.packages).toEqual([]);
    // The standard library and bundled packages are never refused.
    const ok = await execute(py, "import json, statistics\nfrom numpy import pi\nprint(round(pi, 2))", opts);
    expect(ok.error).toBeUndefined();
    expect(ok.stdout).toContain("3.14");
  }, 60_000);
});
