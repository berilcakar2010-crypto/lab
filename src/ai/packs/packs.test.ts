import { describe, expect, it } from "vitest";
import type { CurriculumSpec } from "../../engines/curriculumSpec";
import { mechanicsPack } from "./mechanics";
import { calculusPack } from "./calculus";
import { mechanicsPackEn } from "./en/mechanics";
import { calculusPackEn } from "./en/calculus";

/** String fields that are identifiers or maths, not prose: they must match exactly across languages. */
const EXACT = new Set(["key", "type", "kind", "purpose", "interaction", "prerequisites", "conceptKeys", "acceptedExpressions", "variables", "expression", "name", "unit"]);

/**
 * Reduce a pack to its language-independent shape: object keys, array lengths,
 * numbers, booleans and identifier/maths strings. Prose becomes "<text>".
 * `exact` applies to strings directly under an identifier field (or its string
 * array), not to nested objects. Classification items keep their category as an index into `categories`.
 */
function shape(x: unknown, field = "", exact = false): unknown {
  if (Array.isArray(x)) return x.map((v) => shape(v, field, exact));
  if (x && typeof x === "object") {
    const o = x as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(o).sort()) {
      if (o[k] === undefined) continue;
      if (k === "classification") {
        const c = o[k] as { categories: string[]; items: { text: string; category: string }[] };
        out[k] = {
          categories: c.categories.length,
          items: c.items.map((i) => ({ text: "<text>", category: c.categories.indexOf(i.category) })),
        };
      } else out[k] = shape(o[k], k, EXACT.has(k));
    }
    return out;
  }
  if (typeof x === "string") return exact || EXACT.has(field) ? x : "<text>";
  return x;
}

const PAIRS: [string, CurriculumSpec, CurriculumSpec][] = [
  ["mechanics", mechanicsPackEn, mechanicsPack],
  ["calculus", calculusPackEn, calculusPack],
];

describe("built-in packs — English/Turkish alignment", () => {
  it.each(PAIRS)("%s: EN and TR packs have identical structure", (_n, en, tr) => {
    expect(shape(en)).toEqual(shape(tr));
  });

  it.each(PAIRS)("%s: classification items reference a real category", (_n, en, tr) => {
    for (const pack of [en, tr])
      for (const u of pack.units) for (const t of u.topics) for (const m of t.milestones)
        for (const q of m.questions ?? [])
          if (q.classification) for (const i of q.classification.items) expect(q.classification.categories).toContain(i.category);
  });

  it("English titles", () => {
    expect(mechanicsPackEn.title).toBe("Mechanics — Physics Olympiad Track");
    expect(calculusPackEn.title).toBe("Calculus 1");
    expect(mechanicsPack.title).toBe("Mekanik — Fizik Olimpiyatı Hattı");
    expect(calculusPack.title).toBe("Kalkülüs 1");
  });

  it("English packs contain no Turkish-only letters", () => {
    expect(JSON.stringify(mechanicsPackEn)).not.toMatch(/[ğşıİĞŞ]/);
    expect(JSON.stringify(calculusPackEn)).not.toMatch(/[ğşıİĞŞ]/);
  });
});
