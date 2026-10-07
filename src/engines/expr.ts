/**
 * Small, safe math expression parser/evaluator (no eval). Supports + − × ÷ ^,
 * unary minus, implicit multiplication (2x, 3(t+1), 2 pi r), functions, constants
 * and variables, plus common Unicode input from stylus/keyboard (·, ×, −, π, ², √).
 */
export type Node =
  | { t: "num"; v: number }
  | { t: "var"; name: string }
  | { t: "neg"; a: Node }
  | { t: "bin"; op: "+" | "-" | "*" | "/" | "^"; a: Node; b: Node }
  | { t: "call"; fn: string; a: Node };

const FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan,
  arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
  sqrt: Math.sqrt, exp: Math.exp, ln: Math.log, log: Math.log10, abs: Math.abs, cbrt: Math.cbrt,
};
const CONSTS: Record<string, number> = { pi: Math.PI, e: Math.E };

export function normalise(src: string): string {
  return src
    .replace(/[·×∙⋅]/g, "*")
    .replace(/[÷]/g, "/")
    .replace(/[−–—]/g, "-")
    .replace(/π/g, "pi")
    .replace(/θ/g, "th")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/√\s*\(/g, "sqrt(")
    .replace(/√\s*([a-zA-Z0-9.]+)/g, "sqrt($1)")
    .replace(/\*\*/g, "^")
    .replace(/(\d),(\d)/g, "$1.$2");
}

type Tok = { k: "num"; v: number } | { k: "id"; v: string } | { k: "op"; v: string };

function tokenize(src: string, variables: string[]): Tok[] {
  const s = normalise(src);
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.]/.test(c)) {
      const m = s.slice(i).match(/^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/);
      if (!m) throw new Error(`Bad number at ${i}`);
      out.push({ k: "num", v: parseFloat(m[0]) });
      i += m[0].length;
      continue;
    }
    if (/[a-zA-Z_]/.test(c)) {
      const m = s.slice(i).match(/^[a-zA-Z_][a-zA-Z_0-9]*/)!;
      i += m[0].length;
      for (const part of splitIdentifier(m[0], variables)) out.push({ k: "id", v: part });
      continue;
    }
    if ("+-*/^()".includes(c)) { out.push({ k: "op", v: c }); i++; continue; }
    throw new Error(`Unexpected "${c}"`);
  }
  return out;
}

/** Split e.g. "xy" into ["x","y"] or "mgh" into ["m","g","h"] when those are known variables. */
function splitIdentifier(id: string, variables: string[]): string[] {
  if (variables.includes(id) || id in FUNCS || id in CONSTS) return [id];
  const known = [...variables, ...Object.keys(CONSTS)].sort((a, b) => b.length - a.length);
  const parts: string[] = [];
  let rest = id;
  while (rest) {
    const fn = Object.keys(FUNCS).find((f) => rest === f);
    if (fn) { parts.push(fn); break; }
    const k = known.find((v) => rest.startsWith(v));
    if (!k) return [id];
    parts.push(k);
    rest = rest.slice(k.length);
  }
  return parts;
}

export function parse(src: string, variables: string[] = []): Node {
  const toks = tokenize(src, variables);
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.k === "op" && peek()!.v === v;
  const startsPrimary = () => {
    const t = peek();
    return !!t && (t.k === "num" || t.k === "id" || (t.k === "op" && t.v === "("));
  };

  const expr = (): Node => {
    let a = term();
    while (isOp("+") || isOp("-")) {
      const op = toks[p++].v as "+" | "-";
      a = { t: "bin", op, a, b: term() };
    }
    return a;
  };
  const term = (): Node => {
    let a = unary();
    for (;;) {
      if (isOp("*") || isOp("/")) {
        const op = toks[p++].v as "*" | "/";
        a = { t: "bin", op, a, b: unary() };
      } else if (startsPrimary()) {
        a = { t: "bin", op: "*", a, b: power() }; // implicit multiplication
      } else break;
    }
    return a;
  };
  const unary = (): Node => {
    if (isOp("-")) { p++; return { t: "neg", a: unary() }; }
    if (isOp("+")) { p++; return unary(); }
    return power();
  };
  const power = (): Node => {
    const base = primary();
    if (isOp("^")) {
      p++;
      return { t: "bin", op: "^", a: base, b: unary() }; // right-assoc
    }
    return base;
  };
  const primary = (): Node => {
    const t = toks[p++];
    if (!t) throw new Error("Unexpected end of expression");
    if (t.k === "num") return { t: "num", v: t.v };
    if (t.k === "op" && t.v === "(") {
      const e = expr();
      if (!isOp(")")) throw new Error("Missing )");
      p++;
      return e;
    }
    if (t.k === "id") {
      if (t.v in FUNCS) {
        if (isOp("(")) {
          p++;
          const a = expr();
          if (!isOp(")")) throw new Error("Missing )");
          p++;
          return { t: "call", fn: t.v, a };
        }
        return { t: "call", fn: t.v, a: power() }; // "sin x"
      }
      return { t: "var", name: t.v };
    }
    throw new Error(`Unexpected "${t.v}"`);
  };

  const tree = expr();
  if (p < toks.length) throw new Error(`Unexpected "${(toks[p] as Tok).v}"`);
  return tree;
}

export function evaluate(n: Node, scope: Record<string, number> = {}): number {
  switch (n.t) {
    case "num": return n.v;
    case "var":
      if (n.name in scope) return scope[n.name];
      if (n.name in CONSTS) return CONSTS[n.name];
      throw new Error(`Unknown variable "${n.name}"`);
    case "neg": return -evaluate(n.a, scope);
    case "call": return FUNCS[n.fn](evaluate(n.a, scope));
    case "bin": {
      const a = evaluate(n.a, scope), b = evaluate(n.b, scope);
      switch (n.op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return a / b;
        case "^": return Math.pow(a, b);
      }
    }
  }
}

export function freeVariables(n: Node, out = new Set<string>()): Set<string> {
  if (n.t === "var" && !(n.name in CONSTS)) out.add(n.name);
  if (n.t === "neg" || n.t === "call") freeVariables(n.a, out);
  if (n.t === "bin") { freeVariables(n.a, out); freeVariables(n.b, out); }
  return out;
}

/**
 * Evaluate a closed expression like "3*sqrt(2)" or "1/4"; trailing units such
 * as "8.66 N" or "9.8 m/s²" are ignored. Returns null if nothing parses.
 */
export function evalNumber(src: string): number | null {
  const s = src.trim();
  for (let end = s.length; end > 0; end--) {
    const prefix = s.slice(0, end);
    if (end < s.length && !/\s$/.test(prefix) && /[a-zA-Z]/.test(s[end])) continue;
    try {
      const v = evaluate(parse(prefix));
      if (Number.isFinite(v)) return v;
    } catch {
      /* shorter prefix */
    }
  }
  return null;
}

export type Equivalence = "EQUAL" | "SIGN" | "FACTOR" | "DIFFERENT" | "INVALID";

/** Compare two expressions by evaluating at random points. */
export function compareExpressions(user: string, reference: string, variables: string[]): { result: Equivalence; factor?: number } {
  let u: Node, r: Node;
  try {
    u = parse(user, variables);
  } catch {
    return { result: "INVALID" };
  }
  try {
    r = parse(reference, variables);
  } catch {
    return { result: "INVALID" };
  }
  const vars = [...new Set([...variables, ...freeVariables(r), ...freeVariables(u)])];
  const unknown = [...freeVariables(u)].filter((v) => !vars.includes(v));
  if (unknown.length) return { result: "DIFFERENT" };
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const ratios: number[] = [];
  let good = 0;
  for (let i = 0; i < 40 && good < 8; i++) {
    const scope: Record<string, number> = {};
    for (const v of vars) scope[v] = 0.3 + rand() * 1.4; // (0.3, 1.7): avoids 0 and keeps trig/angles tame
    let a: number, b: number;
    try {
      a = evaluate(u, scope);
      b = evaluate(r, scope);
    } catch {
      return { result: "DIFFERENT" };
    }
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    good++;
    if (Math.abs(b) < 1e-12) {
      if (Math.abs(a) > 1e-9) ratios.push(NaN);
      continue;
    }
    ratios.push(a / b);
  }
  if (!good) return { result: "INVALID" };
  if (ratios.some(Number.isNaN)) return { result: "DIFFERENT" };
  if (!ratios.length) return { result: "EQUAL" };
  const close = (x: number, y: number) => Math.abs(x - y) <= 1e-6 * Math.max(1, Math.abs(y));
  if (ratios.every((x) => close(x, 1))) return { result: "EQUAL" };
  if (ratios.every((x) => close(x, -1))) return { result: "SIGN" };
  if (ratios.every((x) => close(x, ratios[0]))) return { result: "FACTOR", factor: ratios[0] };
  return { result: "DIFFERENT" };
}
