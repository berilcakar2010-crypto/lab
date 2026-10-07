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
    variable: "MILESTONE_SIZE", title: "Uzun görevler mi, mikro adımlar mı?",
    hypothesis: "Küçük, somut adımlar beni büyük görevlerden daha uzun süre çalışmaya devam ettirir.",
    arms: [{ label: "Mikro adımlar", condition: { preferScope: "MICRO" } }, { label: "Uzun görevler", condition: { preferScope: "LONG" } }],
  },
  {
    variable: "STYLUS", title: "Mikro adımlar + kalemle çalışma alanı",
    hypothesis: "Kalemle elle çalışmak sebat etmeme ve anlamama yardım eder.",
    arms: [{ label: "Çalışma alanı açık (kalem)", condition: { workspaceOpen: true, preferScope: "MICRO" } }, { label: "Sadece yazarak", condition: { workspaceOpen: false, preferScope: "MICRO" } }],
  },
  {
    variable: "IMMEDIATE_FEEDBACK", title: "Mikro adımlar + ayrıntılı anında geri bildirim",
    hypothesis: "Ayrıntılı ve anında geri bildirim daha çok yeniden denememi ve daha çok öğrenmemi sağlar.",
    arms: [{ label: "Ayrıntılı geri bildirim", condition: { feedbackDetail: "full", preferScope: "MICRO" } }, { label: "Sadece doğru / henüz değil", condition: { feedbackDetail: "minimal", preferScope: "MICRO" } }],
  },
  {
    variable: "NEXT_CHOICE", title: "Mikro adımlar + sıradakini kendim seçmek",
    hypothesis: "Sıradaki adımı kendim seçmek, bana atanmasından daha bağlı tutar.",
    arms: [{ label: "Ben seçerim", condition: { choiceMode: "choose" } }, { label: "Tek öneri (değiştirilebilir)", condition: { choiceMode: "assigned" } }],
  },
  {
    variable: "DIFFICULTY", title: "Yüksek mi, orta zorluk mu?",
    hypothesis: "Biraz daha zorlanmak, öğrenmeye zarar vermeden bağlılığımı artırır.",
    arms: [{ label: "Zorlayıcı (+1 zorluk)", condition: { difficultyOffset: 1 } }, { label: "Orta", condition: { difficultyOffset: 0 } }],
  },
  {
    variable: "AI_ASSISTANCE", title: "Daha çok mu, daha az mı YZ desteği?",
    hypothesis: "Oturumlar zor gelse de daha az yardım daha iyi kalıcılık sağlar.",
    arms: [{ label: "Daha çok yardım (kısmi yönlendirmeye kadar, rehber açık)", condition: { hintCap: 4, guide: true } }, { label: "Daha az yardım (küçük ipuçları, rehber kapalı)", condition: { hintCap: 1, guide: false } }],
  },
];

export const runningExperiment = (db: LabDB): Experiment | undefined =>
  Object.values(db.experiments).find((e) => e.status === "RUNNING");

export function startExperiment(db: LabDB, variable: ExperimentVariable, minSessionsPerArm = 6): Experiment {
  if (runningExperiment(db)) throw new Error("Başka bir deney sürüyor. Koşullar karışmasın diye önce onu duraklat ya da bitir.");
  const t = EXPERIMENT_TEMPLATES.find((x) => x.variable === variable);
  if (!t) throw new Error("Bilinmeyen deney");
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
  if (status === "RUNNING" && runningExperiment(db) && runningExperiment(db)!.id !== id) throw new Error("Başka bir deney sürüyor.");
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
  engagement: "Bağlılık endeksi",
  completion: "Tamamlama",
  persistence: "Hatadan sonra sebat",
  continuation: "Devam etme",
  performance: "İlk denemede doğruluk",
  retention: "Gecikmeli kalıcılık",
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
      findings.push({ metric, leader: null, text: "Henüz yeterli veri yok" });
      continue;
    }
    const z = zTwoProportions(ra, rb);
    if (Math.abs(z) >= 1.96 && Math.abs(ra.value - rb.value) >= 0.15) {
      const lead = z > 0 ? a : b;
      findings.push({ metric, leader: lead.arm.label, text: `"${lead.arm.label}" ile daha yüksek (%${Math.round(ra.value * 100)} ve %${Math.round(rb.value * 100)})` });
    } else {
      findings.push({ metric, leader: null, text: `Güvenilir bir fark yok (%${Math.round(ra.value * 100)} ve %${Math.round(rb.value * 100)})` });
    }
  }
  const leads = findings.filter((f) => f.leader);
  let verdict: string;
  if (!enoughSessions) {
    const need = arms.map((a) => `"${a.arm.label}" ile ${Math.max(0, exp.minSessionsPerArm - a.sessions)} oturum daha`).join(", ");
    verdict = `Karşılaştırmak için henüz erken. Devam: ${need}.`;
  } else if (!leads.length) {
    verdict = "Şimdilik güvenilir bir fark yok. İki koşul da sende benzer işliyor gibi — ya da etki henüz görülemeyecek kadar küçük.";
  } else {
    const byArm = new Map<string, string[]>();
    for (const f of leads) (byArm.get(f.leader!) ?? byArm.set(f.leader!, []).get(f.leader!)!).push(METRIC_LABEL[f.metric].toLowerCase());
    verdict = [...byArm.entries()].map(([arm, ms]) => `"${arm}" şu açılardan daha iyi görünüyor: ${ms.join(", ")}`).join("; ") +
      ". Bu kendi oturumlarından gelen bir kanıt, kesin ispat değil — oturumlar arasında başka şeyler de değişti.";
  }
  return { arms, enoughSessions, findings, verdict };
}
