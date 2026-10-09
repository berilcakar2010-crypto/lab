import { beforeAll, describe, expect, it } from "vitest";
import { loadPyodide } from "pyodide";
import { execute, prepare, type PyodideLike } from "./pythonCore";
import { pythonRun } from "./python";

let py: PyodideLike;
beforeAll(async () => {
  py = (await loadPyodide({ indexURL: `${process.cwd()}/node_modules/pyodide/` })) as unknown as PyodideLike;
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
