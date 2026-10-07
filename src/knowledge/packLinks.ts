/**
 * Links the hand-written content packs (Mekanik, Kalkülüs 1) to the canonical
 * graph. New imports carry the link on each milestone; existing data, created
 * before v2.0, is matched by title. The Turkish titles come from the packs
 * themselves; the English titles are from the packs before the Turkish
 * translation, so progress recorded in either language is preserved.
 */
import { mechanicsPack } from "../ai/packs/mechanics";
import { calculusPack } from "../ai/packs/calculus";
import type { CurriculumSpec } from "../engines/curriculumSpec";

export const PACK_LO: Record<string, string[]> = {
  // Mekanik
  "mech:vec1": ["math.geo.vectors"],
  "mech:vec2": ["math.geo.vectors"],
  "mech:calc1": ["math.calc.derivative-def", "phys.mech.kinematics-1d"],
  "mech:kin1": ["phys.mech.kinematics-1d"],
  "mech:kin2": ["phys.mech.kinematics-1d"],
  "mech:kin3": ["phys.mech.kinematics-2d"],
  "mech:kin4": ["phys.mech.kinematics-2d"],
  "mech:n1": ["phys.mech.newton"],
  "mech:n2": ["phys.mech.newton"],
  "mech:n3": ["phys.mech.friction-forces"],
  "mech:n4": ["phys.mech.newton", "phys.mech.friction-forces"],
  "mech:n5": ["phys.mech.circular"],
  "mech:e1": ["phys.mech.work-energy"],
  "mech:e2": ["phys.mech.work-energy"],
  "mech:p1": ["phys.mech.momentum"],
  "mech:p2": ["phys.mech.momentum"],
  "mech:rev1": ["phys.mech.kinematics-1d", "phys.mech.newton"],
  "mech:ch1": ["phys.mech.friction-forces", "phys.mech.newton"],
  "mech:boss1": ["phys.mech.work-energy", "phys.mech.circular", "phys.mech.momentum"],
  // Kalkülüs 1
  "calc:lim1": ["math.calc.limits"],
  "calc:lim2": ["math.calc.limits"],
  "calc:d1": ["math.calc.derivative-def"],
  "calc:d2": ["math.calc.diff-rules"],
  "calc:d3": ["math.calc.diff-rules"],
  "calc:d4": ["math.calc.derivative-def", "math.calc.applications"],
  "calc:d5": ["math.calc.applications"],
  "calc:i1": ["math.calc.integral-def"],
  "calc:i2": ["math.calc.ftc"],
  "calc:rev": ["math.calc.derivative-def", "math.calc.integral-def"],
  "calc:mvt": ["math.calc.mvt"],
  "calc:boss": ["math.calc.boss", "math.calc.implicit", "math.calc.ftc"],
};

/** Titles used before v1.0.3 (English UI). */
const OLD_TITLES: Record<string, string> = {
  "Resolve a vector into components": "mech:vec1",
  "Add vectors by components": "mech:vec2",
  "Differentiate position to get velocity": "mech:calc1",
  "Read velocity from a position–time graph": "mech:kin1",
  "Solve constant-acceleration problems": "mech:kin2",
  "Analyse projectile motion": "mech:kin3",
  "Derive the trajectory equation y(x)": "mech:kin4",
  "Construct a free-body diagram": "mech:n1",
  "Apply Newton's second law to one body": "mech:n2",
  "Reason about static and kinetic friction": "mech:n3",
  "Solve connected-body systems": "mech:n4",
  "Identify the centripetal force in circular motion": "mech:n5",
  "Use the work–energy theorem": "mech:e1",
  "Apply conservation of mechanical energy": "mech:e2",
  "Relate impulse to change in momentum": "mech:p1",
  "Solve one-dimensional collisions": "mech:p2",
  "Review: choose the right model": "mech:rev1",
  "Challenge: block on an incline pulled by a hanging mass": "mech:ch1",
  "Boss: the loop-the-loop launcher": "mech:boss1",
  "Estimate a limit from a graph and a table": "calc:lim1",
  "Compute limits algebraically": "calc:lim2",
  "Interpret the derivative as a limit of slopes": "calc:d1",
  "Differentiate with the power, sum and constant rules": "calc:d2",
  "Apply the product, quotient and chain rules": "calc:d3",
  "Read f' from the graph of f": "calc:d4",
  "Solve optimisation problems": "calc:d5",
  "Interpret a definite integral as accumulated area": "calc:i1",
  "Evaluate integrals with the Fundamental Theorem": "calc:i2",
  "Review: rate or accumulation?": "calc:rev",
  "Challenge: prove a consequence of the Mean Value Theorem": "calc:mvt",
  "Boss: related rates and accumulation": "calc:boss",
};

function titlesOf(prefix: string, spec: CurriculumSpec): [string, string][] {
  return spec.units.flatMap((u) => u.topics.flatMap((t) => t.milestones.map((m): [string, string] => [m.title, `${prefix}:${m.key}`])));
}

const norm = (s: string) => s.toLocaleLowerCase("tr").replace(/\s+/g, " ").trim();

let titleIndex: Map<string, string> | null = null;
/** Pack source key for a milestone title in Turkish or the pre-v1.0.3 English. */
export function packKeyForTitle(title: string): string | undefined {
  if (!titleIndex) {
    titleIndex = new Map();
    for (const [t, k] of [...titlesOf("mech", mechanicsPack), ...titlesOf("calc", calculusPack), ...Object.entries(OLD_TITLES)]) {
      titleIndex.set(norm(t), k);
    }
  }
  return titleIndex.get(norm(title));
}

/** Which pack a spec is, so `importCurriculum` can attach source keys. */
export function packPrefix(spec: CurriculumSpec): string | undefined {
  if (spec === mechanicsPack || spec.title === mechanicsPack.title) return "mech";
  if (spec === calculusPack || spec.title === calculusPack.title) return "calc";
  return undefined;
}
