/**
 * Bundles scientific Python packages (numpy, scipy, pandas, matplotlib,
 * sympy, networkx, scikit-learn, statsmodels and their dependencies) into
 * public/pyodide so they work offline in the app, including on Android.
 *
 * The packages come from the official Pyodide release matching the installed
 * `pyodide` npm version (GitHub release tarball). The tarball is cached in
 * .cache/pyodide; only the needed wheels are extracted, and the release's own
 * pyodide-lock.json is used so file names and hashes match exactly.
 *
 * Usage: node scripts/fetch-pyodide-packages.mjs   (idempotent)
 * Env:   PYODIDE_TARBALL=/path/to/pyodide-X.tar.bz2 to use a local copy.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const PACKAGES = ["numpy", "scipy", "pandas", "matplotlib", "sympy", "networkx", "scikit-learn", "statsmodels"];

const version = JSON.parse(readFileSync("node_modules/pyodide/package.json", "utf8")).version;
const out = "public/pyodide";
const cache = ".cache/pyodide";
const tarball = process.env.PYODIDE_TARBALL ?? join(cache, `pyodide-${version}.tar.bz2`);
const url = `https://github.com/pyodide/pyodide/releases/download/${version}/pyodide-${version}.tar.bz2`;

mkdirSync(out, { recursive: true });
mkdirSync(cache, { recursive: true });

const manifest = join(out, "lab-packages.json");
if (existsSync(manifest)) {
  const m = JSON.parse(readFileSync(manifest, "utf8"));
  if (m.version === version && PACKAGES.every((p) => m.requested.includes(p)) && m.files.every((f) => existsSync(join(out, f)))) {
    console.log(`Python packages already bundled (${m.files.length} files).`);
    process.exit(0);
  }
}

if (!existsSync(tarball)) {
  console.log(`Downloading Pyodide ${version} distribution (~390 MB, cached afterwards)…`);
  const tmp = `${tarball}.part`;
  try {
    execFileSync("curl", ["-fsSL", "--retry", "4", "--retry-delay", "2", "-o", tmp, url], { stdio: "inherit" });
    renameSync(tmp, tarball);
  } catch {
    console.warn("Could not download the Pyodide packages. The Python sandbox still works with the standard library; scientific packages will report themselves unavailable.");
    process.exit(0);
  }
}

const tmpDir = join(cache, "extract");
mkdirSync(tmpDir, { recursive: true });
execFileSync("tar", ["xjf", tarball, "-C", tmpDir, "pyodide/pyodide-lock.json"]);
const lock = JSON.parse(readFileSync(join(tmpDir, "pyodide/pyodide-lock.json"), "utf8"));

// Dependency closure from the release's lock file.
const seen = new Set();
const files = [];
const visit = (name) => {
  const n = name.toLowerCase();
  if (seen.has(n)) return;
  seen.add(n);
  const p = lock.packages[n];
  if (!p) throw new Error(`Package ${n} is not in Pyodide ${version}`);
  for (const d of p.depends ?? []) visit(d);
  files.push(p.file_name);
};
for (const p of PACKAGES) visit(p);

execFileSync("tar", ["xjf", tarball, "-C", tmpDir, ...files.map((f) => `pyodide/${f}`)]);
let bytes = 0;
for (const f of files) {
  copyFileSync(join(tmpDir, "pyodide", f), join(out, f));
  bytes += statSync(join(out, f)).size;
}
// The release lock describes every file we ship.
copyFileSync(join(tmpDir, "pyodide/pyodide-lock.json"), join(out, "pyodide-lock.json"));
writeFileSync(manifest, JSON.stringify({ version, requested: PACKAGES, packages: [...seen], files }, null, 2));
console.log(`Bundled ${seen.size} Python packages (${files.length} files, ${(bytes / 1e6).toFixed(1)} MB) into ${out}.`);
