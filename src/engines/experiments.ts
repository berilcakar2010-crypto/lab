/**
 * Personal experiments: compare study conditions within one learner by
 * alternating them across sessions. Only one experiment runs at a time so
 * conditions don't confound each other. Comparisons use raw events and
 * retention records, and never name a winner on small samples.
 */
import type { Experiment, ExperimentArm, ExperimentVariable, ID, LabDB, Session } from "../domain/types";
import type { ExperimentReport } from "../domain/adaptive";
import { newId } from "../data/ids";
import { L, getLang, lazyLabels, type Lang } from "../i18n";
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

const templates = (): ExperimentTemplate[] => [
  {
    variable: "MILESTONE_SIZE", title: L("Long tasks vs micro-milestones", "Uzun görevler mi, mikro adımlar mı?"),
    hypothesis: L("Small, concrete milestones keep me going longer than large ones.", "Küçük, somut adımlar beni büyük görevlerden daha uzun süre çalışmaya devam ettirir."),
    arms: [{ label: L("Micro-milestones", "Mikro adımlar"), condition: { preferScope: "MICRO" } }, { label: L("Longer tasks", "Uzun görevler"), condition: { preferScope: "LONG" } }],
  },
  {
    variable: "STYLUS", title: L("Micro-milestones + stylus workspace", "Mikro adımlar + kalemle çalışma alanı"),
    hypothesis: L("Working by hand with the stylus helps me persist and understand.", "Kalemle elle çalışmak sebat etmeme ve anlamama yardım eder."),
    arms: [{ label: L("Workspace open (stylus)", "Çalışma alanı açık (kalem)"), condition: { workspaceOpen: true, preferScope: "MICRO" } }, { label: L("Typing only", "Sadece yazarak"), condition: { workspaceOpen: false, preferScope: "MICRO" } }],
  },
  {
    variable: "IMMEDIATE_FEEDBACK", title: L("Micro-milestones + detailed immediate feedback", "Mikro adımlar + ayrıntılı anında geri bildirim"),
    hypothesis: L("Detailed, immediate feedback makes me retry more and learn more.", "Ayrıntılı ve anında geri bildirim daha çok yeniden denememi ve daha çok öğrenmemi sağlar."),
    arms: [{ label: L("Detailed feedback", "Ayrıntılı geri bildirim"), condition: { feedbackDetail: "full", preferScope: "MICRO" } }, { label: L("Correct / not yet only", "Sadece doğru / henüz değil"), condition: { feedbackDetail: "minimal", preferScope: "MICRO" } }],
  },
  {
    variable: "NEXT_CHOICE", title: L("Micro-milestones + choosing what's next", "Mikro adımlar + sıradakini kendim seçmek"),
    hypothesis: L("Choosing my next milestone keeps me more engaged than being assigned one.", "Sıradaki adımı kendim seçmek, bana atanmasından daha bağlı tutar."),
    arms: [{ label: L("I choose", "Ben seçerim"), condition: { choiceMode: "choose" } }, { label: L("One suggestion (override allowed)", "Tek öneri (değiştirilebilir)"), condition: { choiceMode: "assigned" } }],
  },
  {
    variable: "DIFFICULTY", title: L("Higher vs moderate difficulty", "Yüksek mi, orta zorluk mu?"),
    hypothesis: L("A bit more challenge keeps me engaged without hurting learning.", "Biraz daha zorlanmak, öğrenmeye zarar vermeden bağlılığımı artırır."),
    arms: [{ label: L("Stretch (+1 difficulty)", "Zorlayıcı (+1 zorluk)"), condition: { difficultyOffset: 1 } }, { label: L("Moderate", "Orta"), condition: { difficultyOffset: 0 } }],
  },
  {
    variable: "AI_ASSISTANCE", title: L("More vs less AI assistance", "Daha çok mu, daha az mı YZ desteği?"),
    hypothesis: L("Less help leads to better retention, even if sessions feel harder.", "Oturumlar zor gelse de daha az yardım daha iyi kalıcılık sağlar."),
    arms: [{ label: L("More help (up to partial guidance, guide on)", "Daha çok yardım (kısmi yönlendirmeye kadar, rehber açık)"), condition: { hintCap: 4, guide: true } }, { label: L("Less help (small hints, guide off)", "Daha az yardım (küçük ipuçları, rehber kapalı)"), condition: { hintCap: 1, guide: false } }],
  },
];

const templateCache = new Map<Lang, ExperimentTemplate[]>();
/** The experiment catalogue in the current language (an array view, so `.map`/`.find` keep working). */
export const EXPERIMENT_TEMPLATES: ExperimentTemplate[] = new Proxy([] as ExperimentTemplate[], {
  get: (_t, k) => {
    const lang = getLang();
    let list = templateCache.get(lang);
    if (!list) templateCache.set(lang, (list = templates()));
    const v = Reflect.get(list, k);
    return typeof v === "function" ? v.bind(list) : v;
  },
  has: (_t, k) => k in templates(),
});

export const runningExperiment = (db: LabDB): Experiment | undefined =>
  Object.values(db.experiments).find((e) => e.status === "RUNNING");

export function startExperiment(db: LabDB, variable: ExperimentVariable, minSessionsPerArm = 6): Experiment {
  if (runningExperiment(db)) throw new Error(L("Another experiment is running. Pause or conclude it first, so conditions don't mix.", "Başka bir deney sürüyor. Koşullar karışmasın diye önce onu duraklat ya da bitir."));
  const t = EXPERIMENT_TEMPLATES.find((x) => x.variable === variable);
  if (!t) throw new Error(L("Unknown experiment", "Bilinmeyen deney"));
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
  if (status === "RUNNING" && runningExperiment(db) && runningExperiment(db)!.id !== id) throw new Error(L("Another experiment is running.", "Başka bir deney sürüyor."));
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

export const METRIC_LABEL = lazyLabels<Metric>(
  { engagement: "Engagement index", completion: "Completion", persistence: "Persistence after failure", continuation: "Continuation", performance: "First-try accuracy", retention: "Delayed retention", transfer: "Transfer" },
  { engagement: "Bağlılık endeksi", completion: "Tamamlama", persistence: "Hatadan sonra sebat", continuation: "Devam etme", performance: "İlk denemede doğruluk", retention: "Gecikmeli kalıcılık", transfer: "Transfer" },
);

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
      findings.push({ metric, leader: null, text: L("Not enough data yet", "Henüz yeterli veri yok") });
      continue;
    }
    const z = zTwoProportions(ra, rb);
    if (Math.abs(z) >= 1.96 && Math.abs(ra.value - rb.value) >= 0.15) {
      const lead = z > 0 ? a : b;
      findings.push({ metric, leader: lead.arm.label, text: L(`Higher with "${lead.arm.label}" (${Math.round(ra.value * 100)}% vs ${Math.round(rb.value * 100)}%)`, `"${lead.arm.label}" ile daha yüksek (%${Math.round(ra.value * 100)} ve %${Math.round(rb.value * 100)})`) });
    } else {
      findings.push({ metric, leader: null, text: L(`No reliable difference (${Math.round(ra.value * 100)}% vs ${Math.round(rb.value * 100)}%)`, `Güvenilir bir fark yok (%${Math.round(ra.value * 100)} ve %${Math.round(rb.value * 100)})`) });
    }
  }
  const leads = findings.filter((f) => f.leader);
  let verdict: string;
  if (!enoughSessions) {
    const need = arms.map((a) => L(`${Math.max(0, exp.minSessionsPerArm - a.sessions)} more with "${a.arm.label}"`, `"${a.arm.label}" ile ${Math.max(0, exp.minSessionsPerArm - a.sessions)} oturum daha`)).join(", ");
    verdict = L(`Too early to compare. Keep going: ${need}.`, `Karşılaştırmak için henüz erken. Devam: ${need}.`);
  } else if (!leads.length) {
    verdict = L("No reliable difference so far. Both conditions seem to work similarly for you — or the effect is too small to see yet.", "Şimdilik güvenilir bir fark yok. İki koşul da sende benzer işliyor gibi — ya da etki henüz görülemeyecek kadar küçük.");
  } else {
    const byArm = new Map<string, string[]>();
    for (const f of leads) (byArm.get(f.leader!) ?? byArm.set(f.leader!, []).get(f.leader!)!).push(METRIC_LABEL[f.metric].toLowerCase());
    verdict = [...byArm.entries()].map(([arm, ms]) => L(`"${arm}" appears better for ${ms.join(", ")}`, `"${arm}" şu açılardan daha iyi görünüyor: ${ms.join(", ")}`)).join("; ") +
      L(". This is evidence from your own sessions, not proof — other things changed between sessions too.", ". Bu kendi oturumlarından gelen bir kanıt, kesin ispat değil — oturumlar arasında başka şeyler de değişti.");
  }
  return { arms, enoughSessions, findings, verdict };
}

/** The arm the template's hypothesis favours (AI assistance: "less help" is the hypothesis). */
export const hypothesisArm = (e: Experiment) => (e.variable === "AI_ASSISTANCE" ? 1 : 0);

/**
 * The written result of an experiment: hypothesis, design, observed data,
 * result, confidence and limitations. Single-learner, alternating design —
 * evidence about this learner, never general proof.
 */
export function experimentReport(db: LabDB, expId: ID, now = Date.now()): ExperimentReport {
  const exp = db.experiments[expId];
  const c = compareExperiment(db, expId);
  const fav = exp.arms[hypothesisArm(exp)]?.label;
  const leads = c.findings.filter((f) => f.leader);
  const forH = leads.filter((f) => f.leader === fav).length, against = leads.length - forH;
  const result: ExperimentReport["result"] = !c.enoughSessions || !leads.length || (forH && against) ? "INCONCLUSIVE" : forH ? "SUPPORTED" : "NOT_SUPPORTED";
  const sessions = c.arms.reduce((s, a) => s + a.sessions, 0);
  const limitations = [
    L("One learner, alternating conditions across sessions, no blinding.", "Tek öğrenci, oturumlar arasında dönüşümlü koşullar, körleme yok."),
    L("Topics, time of day and mood also changed between sessions.", "Oturumlar arasında konu, günün saati ve ruh hali de değişti."),
  ];
  if (sessions < exp.minSessionsPerArm * exp.arms.length * 2) limitations.push(L("Few sessions; small effects cannot be seen.", "Az oturum; küçük etkiler görülemez."));
  if (c.arms.some((a) => a.rates.retention.value === null)) limitations.push(L("Too few delayed retention checks to compare retention.", "Kalıcılığı karşılaştırmak için çok az gecikmeli kontrol var."));
  return {
    hypothesis: exp.hypothesis,
    design: L(`${exp.arms.map((a) => `"${a.label}"`).join(" vs ")}, alternating by session, at least ${exp.minSessionsPerArm} sessions each.`, `${exp.arms.map((a) => `"${a.label}"`).join(" ve ")}, oturum oturum dönüşümlü, her biri en az ${exp.minSessionsPerArm} oturum.`),
    observed: [...c.arms.map((a) => `${a.arm.label}: ${a.sessions} ${L("sessions", "oturum")}, ${a.visits} ${L("visits", "ziyaret")}`), ...c.findings.map((f) => `${METRIC_LABEL[f.metric]}: ${f.text}`)].join("\n"),
    result,
    confidence: result === "INCONCLUSIVE" ? 0.2 : Math.min(0.85, 0.4 + 0.1 * leads.length + Math.min(0.2, sessions / 100)),
    limitations,
    createdAt: now,
  };
}

/** Conclude and store the written report with the experiment. */
export function concludeExperiment(db: LabDB, expId: ID, note?: string, now = Date.now()): ExperimentReport | null {
  if (!db.experiments[expId]) return null;
  setExperimentStatus(db, expId, "CONCLUDED", note);
  const report = experimentReport(db, expId, now);
  db.experiments[expId].report = report;
  return report;
}
