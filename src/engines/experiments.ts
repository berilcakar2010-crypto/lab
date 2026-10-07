/**
 * Personal experiments: compare study conditions within one learner by
 * alternating them across sessions. Only one experiment runs at a time so
 * conditions don't confound each other. Comparisons use raw events and
 * retention records, and never name a winner on small samples.
 */
import type { Experiment, ExperimentArm, ExperimentVariable, ID, LabDB, Session } from "../domain/types";
import { newId } from "../data/ids";
import { rate, visitRows, engagementIndex, type Rate, type VisitRow } from "./statistics";
import { zTwoProportions } from "./focusLab";

export interface Conditions {
  preferScope?: "MICRO" | "LONG";
  workspaceOpen?: boolean;
  feedbackDetail?: "full" | "minimal";
  choiceMode?: "choose" | "assigned";
  difficultyOffset?: number;
  hintCap?: number;
  guide?: boolean;
}

export interface ExperimentTemplate {
  variable: ExperimentVariable;
  title: string;
  hypothesis: string;
  arms: { label: string; condition: Conditions }[];
}

export const EXPERIMENT_TEMPLATES: ExperimentTemplate[] = [
  {
    variable: "MILESTONE_SIZE", title: "Long tasks vs micro-milestones",
    hypothesis: "Small, concrete milestones keep me going longer than large ones.",
    arms: [{ label: "Micro-milestones", condition: { preferScope: "MICRO" } }, { label: "Longer tasks", condition: { preferScope: "LONG" } }],
  },
  {
    variable: "STYLUS", title: "Micro-milestones + stylus workspace",
    hypothesis: "Working by hand with the stylus helps me persist and understand.",
    arms: [{ label: "Workspace open (stylus)", condition: { workspaceOpen: true, preferScope: "MICRO" } }, { label: "Typing only", condition: { workspaceOpen: false, preferScope: "MICRO" } }],
  },
  {
    variable: "IMMEDIATE_FEEDBACK", title: "Micro-milestones + detailed immediate feedback",
    hypothesis: "Detailed, immediate feedback makes me retry more and learn more.",
    arms: [{ label: "Detailed feedback", condition: { feedbackDetail: "full", preferScope: "MICRO" } }, { label: "Correct / not yet only", condition: { feedbackDetail: "minimal", preferScope: "MICRO" } }],
  },
  {
    variable: "NEXT_CHOICE", title: "Micro-milestones + choosing what's next",
    hypothesis: "Choosing my next milestone keeps me more engaged than being assigned one.",
    arms: [{ label: "I choose", condition: { choiceMode: "choose" } }, { label: "One suggestion (override allowed)", condition: { choiceMode: "assigned" } }],
  },
  {
    variable: "DIFFICULTY", title: "Higher vs moderate difficulty",
    hypothesis: "A bit more challenge keeps me engaged without hurting learning.",
    arms: [{ label: "Stretch (+1 difficulty)", condition: { difficultyOffset: 1 } }, { label: "Moderate", condition: { difficultyOffset: 0 } }],
  },
  {
    variable: "AI_ASSISTANCE", title: "More vs less AI assistance",
    hypothesis: "Less help leads to better retention, even if sessions feel harder.",
    arms: [{ label: "More help (up to partial guidance, guide on)", condition: { hintCap: 4, guide: true } }, { label: "Less help (small hints, guide off)", condition: { hintCap: 1, guide: false } }],
  },
];

export const runningExperiment = (db: LabDB): Experiment | undefined =>
  Object.values(db.experiments).find((e) => e.status === "RUNNING");

export function startExperiment(db: LabDB, variable: ExperimentVariable, minSessionsPerArm = 6): Experiment {
  if (runningExperiment(db)) throw new Error("Another experiment is running. Pause or conclude it first, so conditions don't mix.");
  const t = EXPERIMENT_TEMPLATES.find((x) => x.variable === variable);
  if (!t) throw new Error("Unknown experiment");
  const exp: Experiment = {
    id: newId("exp"),
    title: t.title,
    hypothesis: t.hypothesis,
    variable,
    arms: t.arms.map((a) => ({ id: newId("arm"), label: a.label, condition: a.condition as ExperimentArm["condition"] })),
    status: "RUNNING",
    minSessionsPerArm,
    createdAt: Date.now(),
  };
  db.experiments[exp.id] = exp;
  return exp;
}

export function setExperimentStatus(db: LabDB, id: ID, status: Experiment["status"], note?: string) {
  const e = db.experiments[id];
  if (!e) return;
  if (status === "RUNNING" && runningExperiment(db) && runningExperiment(db)!.id !== id) throw new Error("Another experiment is running.");
  e.status = status;
  if (status === "CONCLUDED") {
    e.concludedAt = Date.now();
    e.note = note;
  }
}

const sessionsInArm = (db: LabDB, expId: ID, armId: ID) =>
  Object.values(db.experimentResults).filter((r) => r.experimentId === expId && r.armId === armId);

/**
 * Assign the running experiment's arm to a new session: alternate arms so
 * counts stay balanced; the very first arm is chosen at random.
 */
export function assignArms(db: LabDB, session: Session, random = Math.random) {
  if (!db.preferences.experimentsEnabled) return;
  const exp = runningExperiment(db);
  if (!exp || session.experimentArms[exp.id]) return;
  const counts = exp.arms.map((a) => sessionsInArm(db, exp.id, a.id).length);
  const min = Math.min(...counts);
  const candidates = exp.arms.filter((_, i) => counts[i] === min);
  const arm = candidates.length > 1 ? candidates[Math.floor(random() * candidates.length)] : candidates[0];
  session.experimentArms[exp.id] = arm.id;
  const id = newId("expres");
  db.experimentResults[id] = { id, experimentId: exp.id, armId: arm.id, sessionId: session.id, createdAt: Date.now() };
}

/** Conditions in force for a session (empty when no experiment applies). */
export function sessionConditions(db: LabDB, sessionId?: ID): Conditions & { experimentId?: ID; armLabel?: string } {
  if (!sessionId) return {};
  const s = db.sessions[sessionId];
  if (!s) return {};
  for (const [expId, armId] of Object.entries(s.experimentArms)) {
    const exp = db.experiments[expId];
    if (!exp || exp.status !== "RUNNING") continue;
    const arm = exp.arms.find((a) => a.id === armId);
    if (arm) return { ...(arm.condition as Conditions), experimentId: expId, armLabel: arm.label };
  }
  return {};
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

export type Metric = "engagement" | "completion" | "persistence" | "continuation" | "performance" | "retention" | "transfer";

export const METRIC_LABEL: Record<Metric, string> = {
  engagement: "Engagement index",
  completion: "Completion",
  persistence: "Persistence after failure",
  continuation: "Continuation",
  performance: "First-try accuracy",
  retention: "Delayed retention",
  transfer: "Transfer",
};

export interface ArmSummary {
  arm: ExperimentArm;
  sessions: number;
  visits: number;
  engagement: number | null;
  rates: Record<Exclude<Metric, "engagement">, Rate>;
}

export interface Comparison {
  arms: ArmSummary[];
  enoughSessions: boolean;
  findings: { metric: Metric; leader: string | null; text: string }[];
  verdict: string;
}

export function compareExperiment(db: LabDB, expId: ID): Comparison {
  const exp = db.experiments[expId];
  const rows = visitRows(db);
  const arms: ArmSummary[] = exp.arms.map((arm) => {
    const sessionIds = new Set(sessionsInArm(db, expId, arm.id).map((r) => r.sessionId));
    const rs: VisitRow[] = rows.filter((r) => sessionIds.has(r.sessionId));
    const e = engagementIndex(rs);
    const masteredHere = new Set(
      db.events.filter((ev) => ev.type === "MILESTONE_COMPLETE" && ev.sessionId && sessionIds.has(ev.sessionId) && !ev.data.selfAttested).map((ev) => ev.milestoneId!),
    );
    const checks = Object.values(db.retention).filter((c) => c.completedAt && masteredHere.has(c.milestoneId));
    const of = (k: string) => checks.filter((c) => c.kind === k);
    const ft = rs.filter((r) => r.firstTryCorrect !== null);
    return {
      arm,
      sessions: sessionIds.size,
      visits: rs.length,
      engagement: e.value,
      rates: {
        completion: e.parts.completion,
        persistence: e.parts.persistence,
        continuation: e.parts.continuation,
        performance: rate(ft.filter((r) => r.firstTryCorrect).length, ft.length),
        retention: rate(of("DELAYED").filter((c) => c.correct).length, of("DELAYED").length, 4),
        transfer: rate(of("TRANSFER").filter((c) => c.correct).length, of("TRANSFER").length, 4),
      },
    };
  });
  const enoughSessions = arms.every((a) => a.sessions >= exp.minSessionsPerArm);
  const findings: Comparison["findings"] = [];
  for (const metric of ["completion", "persistence", "continuation", "performance", "retention", "transfer"] as const) {
    const [a, b] = arms;
    const ra = a.rates[metric], rb = b.rates[metric];
    if (!enoughSessions || ra.value === null || rb.value === null) {
      findings.push({ metric, leader: null, text: "Not enough data yet" });
      continue;
    }
    const z = zTwoProportions(ra, rb);
    if (Math.abs(z) >= 1.96 && Math.abs(ra.value - rb.value) >= 0.15) {
      const lead = z > 0 ? a : b;
      findings.push({ metric, leader: lead.arm.label, text: `Higher with "${lead.arm.label}" (${Math.round(ra.value * 100)}% vs ${Math.round(rb.value * 100)}%)` });
    } else {
      findings.push({ metric, leader: null, text: `No reliable difference (${Math.round(ra.value * 100)}% vs ${Math.round(rb.value * 100)}%)` });
    }
  }
  const leads = findings.filter((f) => f.leader);
  let verdict: string;
  if (!enoughSessions) {
    const need = arms.map((a) => `${Math.max(0, exp.minSessionsPerArm - a.sessions)} more with "${a.arm.label}"`).join(", ");
    verdict = `Too early to compare. Keep going: ${need}.`;
  } else if (!leads.length) {
    verdict = "No reliable difference so far. Both conditions seem to work similarly for you — or the effect is too small to see yet.";
  } else {
    const byArm = new Map<string, string[]>();
    for (const f of leads) (byArm.get(f.leader!) ?? byArm.set(f.leader!, []).get(f.leader!)!).push(METRIC_LABEL[f.metric].toLowerCase());
    verdict = [...byArm.entries()].map(([arm, ms]) => `"${arm}" appears better for ${ms.join(", ")}`).join("; ") +
      ". This is evidence from your own sessions, not proof — other things changed between sessions too.";
  }
  return { arms, enoughSessions, findings, verdict };
}
