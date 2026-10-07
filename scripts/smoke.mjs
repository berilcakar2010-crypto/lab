/**
 * End-to-end smoke test: builds nothing, serves `dist/` with `vite preview`,
 * drives the real app in Chromium at tablet-portrait size with touch enabled,
 * and fails on any console error or uncaught exception.
 *
 *   npm run build && npm run smoke
 *
 * Env: CHROMIUM_PATH (default /opt/pw-browsers/chromium), SHOTS (screenshot dir).
 */
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const PORT = 4179;
const BASE = `http://localhost:${PORT}/`;
const SHOTS = process.env.SHOTS ?? "smoke-shots";
mkdirSync(SHOTS, { recursive: true });

const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--port", String(PORT), "--strictPort"], { stdio: "pipe" });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error("preview server did not start")), 20000);
  server.stdout.on("data", (d) => String(d).includes(String(PORT)) && (clearTimeout(t), resolve()));
  server.stderr.on("data", (d) => process.stderr.write(d));
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 820, height: 1180 }, hasTouch: true, deviceScaleFactor: 1 });
const page = await context.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("dialog", (d) => d.accept());

const steps = [];
const step = async (name, fn) => {
  try {
    await fn();
    steps.push(`ok   ${name}`);
  } catch (e) {
    steps.push(`FAIL ${name}: ${e.message.split("\n")[0]}`);
    await page.screenshot({ path: `${SHOTS}/fail-${steps.length}.png`, fullPage: true });
    throw e;
  }
};
const shot = (n) => page.screenshot({ path: `${SHOTS}/${n}.png`, fullPage: false });
const click = (text, opts = {}) => page.getByRole(opts.role ?? "button", { name: text, exact: opts.exact }).first().click();

let failed = false;
try {
  const flows = (await import("./smoke-flows.mjs")).default;
  await flows({ page, step, shot, click, BASE });
} catch {
  failed = true;
}

await browser.close();
server.kill();
console.log(steps.join("\n"));
if (errors.length) {
  console.log("\nErrors:\n" + errors.join("\n"));
  failed = true;
}
console.log(failed ? "\nSMOKE FAILED" : "\nSMOKE PASSED");
process.exit(failed ? 1 : 0);
