/**
 * Focus Lab: looks for associations between how you study and how it goes.
 * Observational only — it reports "associated with", never "causes", and
 * stays silent (with an explicit "insufficient data") when samples are small.
 */
import type { LabDB } from "../domain/types";
import { L, lazyLabels } from "../i18n";
import { GROUP_LABEL, groupOf, rate, visitRows, type GroupKey, type Rate, type VisitRow } from "./statistics";

export type Outcome = "continuation" | "completion" | "persistence" | "firstTry";

export const OUTCOME_LABEL = lazyLabels<Outcome>(
  { continuation: "continuing to another milestone", completion: "completing milestones (vs. abandoning)", persistence: "retrying after a mistake", firstTry: "first-try accuracy" },
  { continuation: "başka bir adıma devam etme", completion: "adımları tamamlama (yarıda bırakmaya karşı)", persistence: "hatadan sonra yeniden deneme", firstTry: "ilk denemede doğruluk" },
);

export const FOCUS_FACTORS: GroupKey[] = ["duration", "difficulty", "stylus", "interaction", "feedback", "challenge", "novelty", "subject", "timeOfDay", "assistance", "granularity"];

export const MIN_GROUP_N = 8;

export type Strength = "associated" | "preliminary";

export interface Pattern {
  factor: GroupKey;
  outcome: Outcome;
  high: { group: string; rate: Rate };
  low: { group: string; rate: Rate };
  diff: number;
  z: number;
  strength: Strength;
  sentence: string;
}

export interface FactorStatus {
  factor: GroupKey;
  outcome: Outcome;
  groups: { group: string; rate: Rate }[];
  status: "pattern" | "no-difference" | "insufficient";
  needed?: number;
}

function outcomeRate(rows: VisitRow[], o: Outcome): Rate {
  switch (o) {
    case "continuation": {
      const d = rows.filter((r) => r.continuedAfter !== null);
      return rate(d.filter((r) => r.continuedAfter).length, d.length, MIN_GROUP_N);
    }
    case "completion": {
      const d = rows.filter((r) => r.outcome === "COMPLETED" || r.outcome === "ABANDONED");
      return rate(d.filter((r) => r.outcome === "COMPLETED").length, d.length, MIN_GROUP_N);
    }
    case "persistence": {
      const d = rows.filter((r) => r.persisted !== null);
      return rate(d.filter((r) => r.persisted).length, d.length, MIN_GROUP_N);
    }
    case "firstTry": {
      const d = rows.filter((r) => r.firstTryCorrect !== null);
      return rate(d.filter((r) => r.firstTryCorrect).length, d.length, MIN_GROUP_N);
    }
  }
}

/** Two-proportion z statistic. */
export function zTwoProportions(a: Rate, b: Rate): number {
  if (!a.n || !b.n) return 0;
  const p1 = a.k / a.n, p2 = b.k / b.n, p = (a.k + b.k) / (a.n + b.n);
  const se = Math.sqrt(p * (1 - p) * (1 / a.n + 1 / b.n));
  return se === 0 ? 0 : (p1 - p2) / se;
}

const pct = (x: number) => `${Math.round(x * 100)}%`;

export function analyseFactor(db: LabDB, rows: VisitRow[], factor: GroupKey, outcome: Outcome): { status: FactorStatus; pattern: Pattern | null } {
  const groups = new Map<string, VisitRow[]>();
  for (const r of rows) {
    const g = groupOf(db, r, factor);
    if (g !== null) (groups.get(g) ?? groups.set(g, []).get(g)!).push(r);
  }
  const rated = [...groups.entries()].map(([group, rs]) => ({ group, rate: outcomeRate(rs, outcome) }));
  const usable = rated.filter((g) => g.rate.value !== null);
  if (usable.length < 2) {
    const biggestMissing = rated.filter((g) => g.rate.value === null).map((g) => MIN_GROUP_N - g.rate.n);
    return { status: { factor, outcome, groups: rated, status: "insufficient", needed: Math.max(MIN_GROUP_N, ...biggestMissing) }, pattern: null };
  }
  const sorted = [...usable].sort((a, b) => b.rate.value! - a.rate.value!);
  const high = sorted[0], low = sorted[sorted.length - 1];
  const diff = high.rate.value! - low.rate.value!;
  const z = zTwoProportions(high.rate, low.rate);
  if (diff < 0.15 || z < 1.28) return { status: { factor, outcome, groups: rated, status: "no-difference" }, pattern: null };
  const strength: Strength = z >= 1.96 ? "associated" : "preliminary";
  const sentence = L(`${strength === "associated" ? "" : "Preliminary pattern: "}${cap(GROUP_LABEL[factor].toLowerCase())} "${high.group}" ${strength === "associated" ? "appears associated with" : "may be associated with"} more ${OUTCOME_LABEL[outcome]} than "${low.group}" (${pct(high.rate.value!)} vs ${pct(low.rate.value!)}; n = ${high.rate.n} vs ${low.rate.n}).`, `${strength === "associated" ? "" : "Ön bulgu: "}${GROUP_LABEL[factor]} "${high.group}" olduğunda, "${low.group}" durumuna göre daha fazla ${OUTCOME_LABEL[outcome]} ${strength === "associated" ? "ile ilişkili görünüyor" : "ile ilişkili olabilir"} (%${Math.round(high.rate.value! * 100)} ve %${Math.round(low.rate.value! * 100)}; n = ${high.rate.n} ve ${low.rate.n}).`);
  return { status: { factor, outcome, groups: rated, status: "pattern" }, pattern: { factor, outcome, high, low, diff, z, strength, sentence } };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export interface FocusReport {
  visits: number;
  patterns: Pattern[];
  statuses: FactorStatus[];
  /** Observational evidence bearing on the user's design hypothesis. */
  hypothesis: { label: string; status: FactorStatus; pattern: Pattern | null }[];
}

export function focusReport(db: LabDB): FocusReport {
  const rows = visitRows(db);
  const patterns: Pattern[] = [];
  const statuses: FactorStatus[] = [];
  for (const f of FOCUS_FACTORS) {
    for (const o of ["continuation", "completion", "persistence", "firstTry"] as Outcome[]) {
      const { status, pattern } = analyseFactor(db, rows, f, o);
      statuses.push(status);
      if (pattern) patterns.push(pattern);
    }
  }
  patterns.sort((a, b) => b.z - a.z);
  const hyp = (label: string, f: GroupKey, o: Outcome) => ({ label, ...(() => { const r = analyseFactor(db, rows, f, o); return { status: r.status, pattern: r.pattern }; })() });
  return {
    visits: rows.length,
    patterns,
    statuses,
    hypothesis: [
      hyp(L("Small milestones → continuing", "Küçük adımlar → devam etme"), "duration", "continuation"),
      hyp(L("Immediate feedback → retrying after mistakes", "Anında geri bildirim → hatadan sonra yeniden deneme"), "feedback", "persistence"),
      hyp(L("Stylus interaction → completing", "Kalemle çalışma → tamamlama"), "stylus", "completion"),
      hyp(L("Challenge level → continuing", "Zorlayıcılık → devam etme"), "challenge", "continuation"),
    ],
  };
}
