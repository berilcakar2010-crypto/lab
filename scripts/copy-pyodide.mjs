/**
 * Copies the Pyodide runtime (CPython compiled to WebAssembly) into
 * public/pyodide so it ships with the app and the Python sandbox works
 * offline. Loaded only when the learner opens the Python sandbox.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";

const FILES = ["pyodide.mjs", "pyodide.asm.js", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"];
const from = "node_modules/pyodide";
const to = "public/pyodide";
if (!existsSync(from)) {
  console.warn("pyodide not installed; the Python sandbox will report itself unavailable");
  process.exit(0);
}
mkdirSync(to, { recursive: true });
for (const f of FILES) copyFileSync(`${from}/${f}`, `${to}/${f}`);
console.log(`Pyodide copied to ${to}`);
