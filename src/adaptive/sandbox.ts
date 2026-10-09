/**
 * Sandbox: a safe, controlled workspace whose results can become evidence.
 *
 * Execution model (what Lab actually supports, offline, on a tablet):
 *   - SWEEP — evaluate a formula over a range of one parameter (plots);
 *   - ODE   — integrate a system of differential equations with RK4, with an
 *             optional threshold-reset rule (e.g. a leaky integrate-and-fire
 *             neuron) — physics, chemistry, biology and neuroscience models;
 *   - DATA  — descriptive statistics, a histogram and linear regression on
 *             numbers the learner pastes.
 * Everything runs on Lab's own expression parser (no eval, no code execution,
 * no network), with hard limits on steps and output size. General-purpose
 * Python is NOT supported: it would need a ~10 MB runtime and the network,
 * and Lab will not pretend otherwise. The runner interface is kept narrow so
 * such an engine could be plugged in later.
 *
 * A run is only activity, not proof of understanding: it becomes mastery
 * evidence through the learner's interpretation (an explanation that is then
 * evaluated) or through a prediction it tests.
 */
import type { ID, LabDB, Millis } from "../domain/types";
import type { SandboxRun } from "../domain/adaptive";
import { newId } from "../data/ids";
import { evaluate, parse, type Node } from "../engines/expr";
import { logEvent } from "../engines/analytics";
import { L } from "../i18n";
import { addExplanation } from "../study/actions";

export const MAX_SWEEP_POINTS = 400;
export const MAX_ODE_STEPS = 50_000;
export const MAX_SERIES_POINTS = 400;
export const MAX_DATA_ROWS = 5000;

export interface Param { name: string; label: string; min: number; max: number; value: number; unit?: string }

export interface FormulaModel {
  id: string;
  kind: "formula";
  title: string;
  loIds: string[];
  expression: string;
  output: string;
  params: Param[];
  /** Parameter the predict–test–explain task varies. */
  pteParam: string;
}

export interface OdeModel {
  id: string;
  kind: "ode";
  title: string;
  loIds: string[];
  /** state variable → derivative expression */
  equations: Record<string, string>;
  initial: Record<string, number>;
  params: Param[];
  t1: number;
  dt: number;
  reset?: { variable: string; threshold: string; value: string };
  /** What to measure for predictions: a state variable's final value, or the number of resets (spikes). */
  measure: { kind: "final"; variable: string } | { kind: "resets" };
  output: string;
  pteParam: string;
}

export type SandboxModel = FormulaModel | OdeModel;

const p = (name: string, label: string, min: number, max: number, value: number, unit?: string): Param => ({ name, label, min, max, value, unit });

/** Built-in models. Formulas are the standard textbook ones. */
export const MODELS = (): SandboxModel[] => [
  { id: "projectile-range", kind: "formula", title: L("Projectile range", "Eğik atış menzili"), loIds: ["phys.mech.kinematics-2d"], expression: "v^2*sin(2*a*pi/180)/g", output: L("Range (m)", "Menzil (m)"), params: [p("v", L("Launch speed", "Atış hızı"), 1, 50, 20, "m/s"), p("a", L("Launch angle", "Atış açısı"), 5, 85, 30, "°"), p("g", L("Gravity", "Yerçekimi"), 1, 25, 9.81, "m/s²")], pteParam: "a" },
  { id: "pendulum", kind: "formula", title: L("Pendulum period", "Sarkaç periyodu"), loIds: ["phys.mech.oscillations"], expression: "2*pi*sqrt(L/g)", output: L("Period (s)", "Periyot (s)"), params: [p("L", L("Length", "Uzunluk"), 0.1, 5, 1, "m"), p("g", L("Gravity", "Yerçekimi"), 1, 25, 9.81, "m/s²")], pteParam: "L" },
  { id: "rc-charge", kind: "formula", title: L("Charging a capacitor", "Kondansatörün dolması"), loIds: ["phys.em.rc-circuits"], expression: "V0*(1-exp(-t/(R*C)))", output: L("Voltage (V)", "Gerilim (V)"), params: [p("V0", L("Source voltage", "Kaynak gerilimi"), 1, 24, 9, "V"), p("t", L("Time", "Zaman"), 0, 10, 1, "s"), p("R", L("Resistance", "Direnç"), 0.1, 10, 1, "kΩ"), p("C", L("Capacitance", "Sığa"), 0.1, 10, 1, "mF")], pteParam: "R" },
  { id: "decay", kind: "formula", title: L("Radioactive decay", "Radyoaktif bozunma"), loIds: ["chem.nuclear", "phys.modern.atomic-nuclear"], expression: "N0*exp(-ln(2)*t/h)", output: L("Nuclei left", "Kalan çekirdek"), params: [p("N0", L("Initial nuclei", "Başlangıç çekirdeği"), 100, 10000, 1000), p("t", L("Time", "Zaman"), 0, 50, 10, "y"), p("h", L("Half-life", "Yarı ömür"), 1, 30, 5, "y")], pteParam: "h" },
  { id: "ideal-gas", kind: "formula", title: L("Ideal gas pressure", "İdeal gaz basıncı"), loIds: ["chem.gas.laws", "phys.thermo.kinetic-theory"], expression: "n*8.314*T/V", output: L("Pressure (Pa)", "Basınç (Pa)"), params: [p("n", L("Amount", "Madde miktarı"), 0.1, 5, 1, "mol"), p("T", L("Temperature", "Sıcaklık"), 100, 600, 300, "K"), p("V", L("Volume", "Hacim"), 0.001, 0.1, 0.0224, "m³")], pteParam: "V" },
  { id: "lif-rate", kind: "formula", title: L("Firing rate of an integrate-and-fire neuron", "Bütünleştir-ateşle nöronun ateşleme hızı"), loIds: ["neuro.comp.lif"], expression: "1000/(tr + tau*ln(R*I/(R*I - th)))", output: L("Rate (Hz)", "Hız (Hz)"), params: [p("I", L("Input current", "Giriş akımı"), 1.6, 5, 2.5, "nA"), p("R", L("Membrane resistance", "Zar direnci"), 5, 20, 10, "MΩ"), p("tau", L("Time constant", "Zaman sabiti"), 5, 30, 10, "ms"), p("th", L("Threshold above rest", "Dinlenime göre eşik"), 5, 25, 15, "mV"), p("tr", L("Refractory period", "Refrakter süre"), 0, 5, 2, "ms")], pteParam: "tau" },
  { id: "logistic", kind: "formula", title: L("Logistic population growth", "Lojistik nüfus büyümesi"), loIds: ["bio.ecology", "env.population.human"], expression: "K/(1+((K-N0)/N0)*exp(-r*t))", output: L("Population", "Nüfus"), params: [p("K", L("Carrying capacity", "Taşıma kapasitesi"), 100, 5000, 1000), p("N0", L("Initial population", "Başlangıç nüfusu"), 1, 100, 10), p("r", L("Growth rate", "Büyüme hızı"), 0.05, 2, 0.5, "1/y"), p("t", L("Time", "Zaman"), 0, 40, 10, "y")], pteParam: "r" },
  { id: "revenue", kind: "formula", title: L("Revenue on a linear demand curve", "Doğrusal talepte gelir"), loIds: ["econ.micro.elasticity"], expression: "P*(a - b*P)", output: L("Revenue", "Gelir"), params: [p("P", L("Price", "Fiyat"), 0, 100, 20), p("a", L("Demand at price 0", "Fiyat 0'daki talep"), 50, 500, 200), p("b", L("Slope of demand", "Talep eğimi"), 0.5, 10, 4)], pteParam: "P" },
  { id: "coulomb", kind: "formula", title: L("Coulomb force", "Coulomb kuvveti"), loIds: ["phys.em.charge-field"], expression: "8.99*q1*q2/r^2", output: L("Force (mN)", "Kuvvet (mN)"), params: [p("q1", L("Charge 1", "Yük 1"), 0.1, 10, 1, "μC"), p("q2", L("Charge 2", "Yük 2"), 0.1, 10, 1, "μC"), p("r", L("Distance", "Uzaklık"), 0.1, 5, 1, "m")], pteParam: "r" },
  {
    id: "lif-sim", kind: "ode", title: L("Leaky integrate-and-fire neuron (simulation)", "Sızıntılı bütünleştir-ateşle nöron (simülasyon)"), loIds: ["neuro.comp.lif"],
    equations: { V: "(-(V - EL) + R*I)/tau" }, initial: { V: -65 }, t1: 200, dt: 0.1,
    params: [p("I", L("Input current", "Giriş akımı"), 0, 5, 2, "nA"), p("R", L("Membrane resistance", "Zar direnci"), 5, 20, 10, "MΩ"), p("tau", L("Time constant", "Zaman sabiti"), 5, 30, 10, "ms"), p("EL", L("Resting potential", "Dinlenim potansiyeli"), -80, -55, -65, "mV"), p("Vth", L("Threshold", "Eşik"), -60, -40, -50, "mV"), p("Vr", L("Reset", "Sıfırlama"), -80, -55, -65, "mV")],
    reset: { variable: "V", threshold: "Vth", value: "Vr" }, measure: { kind: "resets" }, output: L("Spikes in 200 ms", "200 ms'deki ateşleme"), pteParam: "I",
  },
  {
    id: "damped-oscillator", kind: "ode", title: L("Damped spring", "Sönümlü yay"), loIds: ["phys.mech.damped-driven", "phys.mech.oscillations"],
    equations: { x: "v", v: "-(k/m)*x - (c/m)*v" }, initial: { x: 1, v: 0 }, t1: 20, dt: 0.01,
    params: [p("k", L("Spring constant", "Yay sabiti"), 0.5, 20, 4, "N/m"), p("m", L("Mass", "Kütle"), 0.1, 5, 1, "kg"), p("c", L("Damping", "Sönüm"), 0, 5, 0.3, "kg/s")],
    measure: { kind: "final", variable: "x" }, output: L("Position at t = 20 s", "t = 20 s'de konum"), pteParam: "c",
  },
  {
    id: "predator-prey", kind: "ode", title: L("Predator–prey (Lotka–Volterra)", "Av–avcı (Lotka–Volterra)"), loIds: ["bio.ecology", "math.ode.systems"],
    equations: { x: "a*x - b*x*y", y: "d*x*y - c*y" }, initial: { x: 10, y: 5 }, t1: 50, dt: 0.01,
    params: [p("a", L("Prey growth", "Av büyümesi"), 0.1, 2, 1), p("b", L("Predation rate", "Avlanma hızı"), 0.01, 0.5, 0.1), p("c", L("Predator death", "Avcı ölümü"), 0.1, 2, 1.5), p("d", L("Predator growth per prey", "Av başına avcı büyümesi"), 0.01, 0.5, 0.075)],
    measure: { kind: "final", variable: "x" }, output: L("Prey at t = 50", "t = 50'de av"), pteParam: "b",
  },
];

export const modelById = (id: string) => MODELS().find((m) => m.id === id);
export const modelsFor = (loId: string) => MODELS().filter((m) => m.loIds.includes(loId));

// ---------------------------------------------------------------------------
// Runners
// ---------------------------------------------------------------------------

function compile(src: string, names: string[]): Node {
  return parse(src, names);
}

const finite = (x: number) => Number.isFinite(x);

/** Downsample a series to at most MAX_SERIES_POINTS points. */
function thin(points: [number, number][]): [number, number][] {
  if (points.length <= MAX_SERIES_POINTS) return points;
  const step = points.length / MAX_SERIES_POINTS;
  const out: [number, number][] = [];
  for (let i = 0; i < MAX_SERIES_POINTS; i++) out.push(points[Math.floor(i * step)]);
  out.push(points[points.length - 1]);
  return out;
}

export function evalFormula(m: FormulaModel, values: Record<string, number>): number {
  return evaluate(compile(m.expression, m.params.map((x) => x.name)), values);
}

export interface SweepInput { expression: string; variable: string; from: number; to: number; points?: number; params: Record<string, number> }

export function runSweep(input: SweepInput): Omit<SandboxRun, "id" | "createdAt" | "loIds" | "title"> {
  const names = [input.variable, ...Object.keys(input.params)];
  const node = compile(input.expression, names);
  const n = Math.max(2, Math.min(MAX_SWEEP_POINTS, Math.round(input.points ?? 100)));
  const pts: [number, number][] = [];
  let skipped = 0;
  for (let i = 0; i < n; i++) {
    const x = input.from + ((input.to - input.from) * i) / (n - 1);
    const y = evaluate(node, { ...input.params, [input.variable]: x });
    if (finite(y)) pts.push([x, y]);
    else skipped++;
  }
  const ys = pts.map((q) => q[1]);
  const stats = ys.length ? { min: Math.min(...ys), max: Math.max(...ys), first: ys[0], last: ys[ys.length - 1] } : undefined;
  return {
    kind: "SWEEP", input: { ...input },
    summary: ys.length ? L(`${pts.length} points; from ${fmt(stats!.first)} to ${fmt(stats!.last)} (min ${fmt(stats!.min)}, max ${fmt(stats!.max)}).${skipped ? ` ${skipped} points undefined.` : ""}`, `${pts.length} nokta; ${fmt(stats!.first)} → ${fmt(stats!.last)} (en az ${fmt(stats!.min)}, en çok ${fmt(stats!.max)}).${skipped ? ` ${skipped} nokta tanımsız.` : ""}`) : L("The formula is undefined on this range.", "Formül bu aralıkta tanımsız."),
    series: [{ label: input.expression, points: pts }], stats,
  };
}

export interface OdeInput { equations: Record<string, string>; initial: Record<string, number>; params: Record<string, number>; t1: number; dt: number; reset?: OdeModel["reset"] }

/** Classic 4th-order Runge–Kutta with an optional threshold-reset rule. */
export function runOde(input: OdeInput): Omit<SandboxRun, "id" | "createdAt" | "loIds" | "title"> & { resets: number; final: Record<string, number> } {
  const vars = Object.keys(input.equations);
  const names = [...vars, "t", ...Object.keys(input.params)];
  const f = vars.map((v) => compile(input.equations[v], names));
  const dt = Math.max(1e-5, input.dt);
  const steps = Math.min(MAX_ODE_STEPS, Math.ceil(input.t1 / dt));
  let y = vars.map((v) => input.initial[v] ?? 0);
  const series = vars.map(() => [] as [number, number][]);
  const deriv = (t: number, s: number[]) => {
    const scope: Record<string, number> = { ...input.params, t };
    vars.forEach((v, i) => (scope[v] = s[i]));
    return f.map((n) => evaluate(n, scope));
  };
  const resetIdx = input.reset ? vars.indexOf(input.reset.variable) : -1;
  const thr = input.reset ? evaluate(compile(input.reset.threshold, names), { ...input.params, t: 0 }) : 0;
  const rv = input.reset ? evaluate(compile(input.reset.value, names), { ...input.params, t: 0 }) : 0;
  let resets = 0;
  let stopped: string | null = null;
  for (let k = 0; k <= steps; k++) {
    const t = k * dt;
    vars.forEach((_, i) => series[i].push([t, y[i]]));
    if (k === steps) break;
    const k1 = deriv(t, y);
    const k2 = deriv(t + dt / 2, y.map((v, i) => v + (dt / 2) * k1[i]));
    const k3 = deriv(t + dt / 2, y.map((v, i) => v + (dt / 2) * k2[i]));
    const k4 = deriv(t + dt, y.map((v, i) => v + dt * k3[i]));
    y = y.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    if (resetIdx >= 0 && y[resetIdx] >= thr) {
      y[resetIdx] = rv;
      resets++;
    }
    if (!y.every(finite)) {
      stopped = L(`The solution blew up at t = ${fmt(t)}; try a smaller step.`, `Çözüm t = ${fmt(t)} anında ıraksadı; daha küçük bir adım dene.`);
      break;
    }
  }
  const final = Object.fromEntries(vars.map((v, i) => [v, y[i]]));
  return {
    kind: "ODE", input: { ...input }, resets, final,
    summary: stopped ?? L(`Integrated to t = ${fmt(input.t1)} (RK4, step ${dt}). Final: ${vars.map((v, i) => `${v} = ${fmt(y[i])}`).join(", ")}${input.reset ? `; ${resets} resets` : ""}.`, `t = ${fmt(input.t1)}'e kadar çözüldü (RK4, adım ${dt}). Son: ${vars.map((v, i) => `${v} = ${fmt(y[i])}`).join(", ")}${input.reset ? `; ${resets} sıfırlama` : ""}.`),
    series: vars.map((v, i) => ({ label: v, points: thin(series[i]) })),
    stats: { ...final, resets },
  };
}

export interface DataResult { columns: { name: string; n: number; mean: number; sd: number; min: number; max: number; median: number }[]; regression?: { slope: number; intercept: number; r2: number } }

/** Parse pasted numbers (CSV, tabs or spaces; an optional header row). */
export function parseData(text: string): { names: string[]; rows: number[][] } {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, MAX_DATA_ROWS + 1);
  const split = (l: string) => l.split(/[,;\t ]+/).map((x) => x.trim()).filter(Boolean);
  const first = split(lines[0] ?? "");
  const header = first.some((x) => !Number.isFinite(Number(x.replace(",", "."))));
  const names = header ? first : first.map((_, i) => `x${i + 1}`);
  const rows = (header ? lines.slice(1) : lines).map((l) => split(l).map((x) => Number(x.replace(",", ".")))).filter((r) => r.length >= names.length && r.slice(0, names.length).every(finite)).map((r) => r.slice(0, names.length));
  return { names, rows };
}

export function runData(text: string): Omit<SandboxRun, "id" | "createdAt" | "loIds" | "title"> & { result: DataResult } {
  const { names, rows } = parseData(text);
  const columns = names.map((name, j) => {
    const xs = rows.map((r) => r[j]).sort((a, b) => a - b);
    const n = xs.length;
    const mean = n ? xs.reduce((s, x) => s + x, 0) / n : NaN;
    const sd = n > 1 ? Math.sqrt(xs.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1)) : 0;
    return { name, n, mean, sd, min: xs[0], max: xs[n - 1], median: n ? (n % 2 ? xs[(n - 1) / 2] : (xs[n / 2 - 1] + xs[n / 2]) / 2) : NaN };
  });
  let regression: DataResult["regression"];
  if (names.length >= 2 && rows.length >= 3) {
    const xs = rows.map((r) => r[0]), ys = rows.map((r) => r[1]);
    const mx = columns[0].mean, my = columns[1].mean;
    const sxy = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
    const sxx = xs.reduce((s, x) => s + (x - mx) ** 2, 0);
    if (sxx > 0) {
      const slope = sxy / sxx, intercept = my - slope * mx;
      const ssr = ys.reduce((s, yv, i) => s + (yv - (intercept + slope * xs[i])) ** 2, 0);
      const sst = ys.reduce((s, yv) => s + (yv - my) ** 2, 0);
      regression = { slope, intercept, r2: sst > 0 ? 1 - ssr / sst : 1 };
    }
  }
  const series = names.length >= 2 ? [{ label: `${names[1]} ~ ${names[0]}`, points: thin(rows.map((r) => [r[0], r[1]] as [number, number])) }] : [{ label: names[0] ?? "x", points: thin(rows.map((r, i) => [i + 1, r[0]] as [number, number])) }];
  const c0 = columns[0];
  return {
    kind: "DATA", input: { text: text.slice(0, 20_000) }, result: { columns, regression }, series,
    stats: c0 ? { n: c0.n, mean: c0.mean, sd: c0.sd, ...(regression ?? {}) } : {},
    summary: rows.length
      ? L(`${rows.length} rows. ${columns.map((c) => `${c.name}: mean ${fmt(c.mean)}, sd ${fmt(c.sd)}`).join("; ")}${regression ? `. Fit: ${names[1]} = ${fmt(regression.slope)}·${names[0]} + ${fmt(regression.intercept)} (R² = ${fmt(regression.r2)})` : ""}.`, `${rows.length} satır. ${columns.map((c) => `${c.name}: ortalama ${fmt(c.mean)}, ss ${fmt(c.sd)}`).join("; ")}${regression ? `. Uyum: ${names[1]} = ${fmt(regression.slope)}·${names[0]} + ${fmt(regression.intercept)} (R² = ${fmt(regression.r2)})` : ""}.`)
      : L("No numeric rows found.", "Sayısal satır bulunamadı."),
  };
}

const fmt = (x: number) => (Number.isFinite(x) ? (Math.abs(x) >= 1e4 || (Math.abs(x) < 1e-3 && x !== 0) ? x.toExponential(2) : String(Math.round(x * 1000) / 1000)) : "—");

// ---------------------------------------------------------------------------
// Persistence and evidence
// ---------------------------------------------------------------------------

export function startSandbox(db: LabDB, kind: SandboxRun["kind"], loIds: string[] = [], now: Millis = Date.now()): void {
  logEvent(db, "SANDBOX_STARTED", { at: now, loIds }, { kind });
}

export function saveRun(db: LabDB, run: Omit<SandboxRun, "id" | "createdAt" | "loIds" | "title"> & { title?: string }, loIds: string[] = [], now: Millis = Date.now(), researchId?: ID): SandboxRun {
  const rec: SandboxRun = {
    id: newId("sbx"), kind: run.kind, title: run.title ?? run.kind, input: run.input, summary: run.summary,
    series: run.series.map((s) => ({ label: s.label, points: thin(s.points) })), stats: run.stats, loIds, researchId, createdAt: now,
  };
  db.sandboxRuns[rec.id] = rec;
  logEvent(db, "SANDBOX_RESULT", { at: now, loIds }, { runId: rec.id, kind: rec.kind });
  return rec;
}

/**
 * Save a run as evidence: the run is linked to graph objects and the
 * learner's interpretation becomes an explanation that can be evaluated —
 * that evaluation (not the run itself) is what counts toward mastery.
 */
export function saveAsEvidence(db: LabDB, runId: ID, loId: string, interpretation: string, now: Millis = Date.now()): ID | null {
  const run = db.sandboxRuns[runId];
  if (!run || !interpretation.trim()) return null;
  run.loIds = [...new Set([...run.loIds, loId])];
  run.evidence = { savedAt: now, note: interpretation.trim() };
  const e = addExplanation(db, { loId, prompt: L(`Sandbox: what does "${run.title}" show?`, `Sandbox: "${run.title}" ne gösteriyor?`), mode: "TEXT", text: `${interpretation.trim()}\n\n[${run.summary}]` });
  return e.id;
}
