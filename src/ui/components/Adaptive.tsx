/**
 * UI for the adaptive layer, built from the existing pieces (cards, chips,
 * bars, banners). Each component answers one question for the learner: what
 * now and why, where did it go wrong and how to repair it, am I stuck, how
 * deep is my mastery, what are my options next.
 */
import { useEffect, useMemo, useState } from "react";
import type { ID, LabDB } from "../../domain/types";
import { ERROR_CATEGORIES, MASTERY_DIMENSIONS, type ErrorCategory, type ErrorRecord, type Reason } from "../../domain/adaptive";
import { fmtDate, L } from "../../i18n";
import { getGraph } from "../../knowledge/graph";
import type { KnowledgeGraph } from "../../knowledge/schema";
import { act, aiHost, navigate, store, toast, useDB } from "../state";
import { Bar, Icon } from "./common";
import { ERROR_HELP, ERROR_LABEL, applyAIAnalysis, dismissError, openErrors, reclassifyError, repairQueue, startRepair } from "../../adaptive/errors";
import { analyzeErrorAI } from "../../ai/adaptiveAI";
import { detectStuck, logStuck, chooseStuckOption, type StuckOption } from "../../adaptive/stuck";
import { DIMENSION_LABEL, RETENTION_LABEL, masteryProfile, profileGap, staleRemedy } from "../../adaptive/mastery";
import { NEXT_LABEL, NEXT_LETTER, chooseWhatNext, logWhatNextShown, whatNext, type NextOption } from "../../adaptive/whatNext";
import { activePath, currentStep, ROLE_LABEL } from "../../adaptive/pathPlanner";
import { LEVEL_LABEL, learningMetrics, type Level, type Num } from "../../adaptive/metrics";
import { examConstraints } from "../../adaptive/modes";
import { createResearch } from "../../adaptive/research";
import type { Rate } from "../../engines/statistics";

const pct = (x: number | null | undefined) => (x === null || x === undefined ? "—" : `${Math.round(x * 100)}%`);
const online = (db: LabDB) => db.preferences.aiProvider !== "local" && !!db.preferences.apiKeys[db.preferences.aiProvider as "gemini" | "groq"];

/** "Why?" — the reasons behind a suggestion, from real data. */
export function WhyList({ reasons, label }: { reasons: (Reason | string)[]; label?: string }) {
  if (!reasons.length) return null;
  return (
    <details className="why">
      <summary className="tiny muted" style={{ cursor: "pointer" }}>{label ?? L("Why?", "Neden?")}</summary>
      <ul className="tiny text-2" style={{ margin: "4px 0 0", paddingLeft: 18 }}>
        {reasons.map((r, i) => <li key={i}>{typeof r === "string" ? r : r.text}</li>)}
      </ul>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Error analysis right after a wrong answer
// ---------------------------------------------------------------------------

export function ErrorInsight({ attemptId, answerText }: { attemptId: ID; answerText?: string }) {
  const db = useDB();
  const err = Object.values(db.errors).find((e) => e.attemptId === attemptId);
  const [busy, setBusy] = useState(false);
  if (!err) return null;
  const analyse = async () => {
    setBusy(true);
    const res = await analyzeErrorAI(aiHost, err, answerText ?? "");
    act((d) => applyAIAnalysis(d, err.id, res.value, res.provider, res.fallbackUsed));
    toast(res.fallbackUsed ? L("AI unavailable — the rule-based analysis stays.", "YZ kullanılamadı — kural tabanlı analiz geçerli.") : L("AI analysis applied.", "YZ analizi uygulandı."));
    setBusy(false);
  };
  return <ErrorCard err={err} onAnalyse={answerText && online(db) && err.source !== "ai" ? analyse : undefined} busy={busy} />;
}

export function ErrorCard({ err, onAnalyse, busy, compact }: { err: ErrorRecord; onAnalyse?: () => void; busy?: boolean; compact?: boolean }) {
  const t = err.trace;
  const repair = () => {
    act((d) => startRepair(d, err.id));
    if (t?.repairMilestoneId) navigate(`/session/${t.repairMilestoneId}`);
    else if (t?.repairLoId) navigate(`/graph?lo=${encodeURIComponent(t.repairLoId)}`);
  };
  return (
    <div className="card raised stack small error-card" style={{ gap: 6 }}>
      <div className="row between nowrap">
        <span className="row" style={{ gap: 6 }}>
          <span className="eyebrow">{L("Error analysis", "Hata analizi")}</span>
          <span className="chip s-NEEDS_REVIEW">{ERROR_LABEL(err.category)}</span>
        </span>
        <span className="tiny muted" title={L("How sure the classification is", "Sınıflandırmanın ne kadar kesin olduğu")}>{L("confidence", "güven")} {pct(err.confidence)} · {err.source === "ai" ? L("AI", "YZ") : err.source === "self" ? L("you", "sen") : L("rules", "kural")}</span>
      </div>
      <span>{err.reason}</span>
      {!compact && <span className="tiny muted">{ERROR_HELP(err.category)}</span>}
      {t && t.steps.length > 1 && (
        <div className="trace-chain tiny" aria-label={L("Error trace", "Hata izi")}>
          {t.steps.filter((s, i, all) => all.findIndex((x) => x.label === s.label) === i).map((s, i) => <span key={i} className={`trace-step k-${s.kind}`}>{s.label}</span>)}
        </div>
      )}
      {t && <span className="tiny text-2">{t.reason}</span>}
      <div className="row" style={{ gap: 6 }}>
        {t?.repairLoId && err.resolution !== "RESOLVED" && <button className="btn small primary" onClick={repair}>{err.resolution === "REPAIRING" ? L("Continue the repair", "Onarıma devam et") : L("Repair this", "Bunu onar")} <Icon.arrow /></button>}
        {onAnalyse && <button className="btn small" disabled={busy} onClick={onAnalyse}>{busy ? <span className="spinner" /> : L("Analyse with AI", "YZ ile analiz et")}</button>}
        <select className="input small" style={{ width: "auto", minHeight: 36 }} value="" aria-label={L("Correct the error type", "Hata türünü düzelt")}
          onChange={(e) => e.target.value && act((d) => reclassifyError(d, err.id, e.target.value as ErrorCategory))}>
          <option value="">{L("Wrong type?", "Tür yanlış mı?")}</option>
          {ERROR_CATEGORIES.filter((c) => c !== err.category).map((c) => <option key={c} value={c}>{ERROR_LABEL(c)}</option>)}
        </select>
        {err.resolution === "RESOLVED" && <span className="chip s-MASTERED">{L("Resolved", "Çözüldü")}</span>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stuck
// ---------------------------------------------------------------------------

export function StuckCard({ milestoneId, questionId, sessionId, onOption }: { milestoneId: ID; questionId: ID; sessionId: ID; onOption: (o: StuckOption) => void }) {
  const db = useDB();
  const [dismissedAt, setDismissedAt] = useState(0);
  const report = useMemo(() => detectStuck(db, { milestoneId, questionId }), [db, milestoneId, questionId]);
  useEffect(() => {
    if (report.state === "STUCK") act((d) => void logStuck(d, report, { milestoneId, questionId, sessionId }));
  }, [report.state, report.since, milestoneId, questionId, sessionId]);
  if (report.state !== "STUCK" || dismissedAt >= report.since + report.score) return null;
  const choose = (o: StuckOption) => {
    act((d) => chooseStuckOption(d, o.kind, { milestoneId, questionId, sessionId }));
    if (o.kind === "TRY_AGAIN") setDismissedAt(report.since + report.score);
    onOption(o);
  };
  return (
    <div className="card stuck-card stack rise" role="status" style={{ gap: 8 }}>
      <span className="eyebrow">{L("Seems stuck — that's normal", "Takılmış gibisin — bu normal")}</span>
      <span className="small text-2">{report.reason}</span>
      <div className="stuck-options">
        {report.options.map((o) => (
          <button key={o.kind} className={`btn small ${o.recommended ? "primary" : ""} ${o.kind === "SEE_SOLUTION" ? "ghost" : ""}`} onClick={() => choose(o)} title={o.detail}>
            {o.label}
          </button>
        ))}
      </div>
      <span className="tiny muted">{L("Lab never shows the solution unless you ask.", "Lab, sen istemedikçe çözümü göstermez.")}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mastery profile
// ---------------------------------------------------------------------------

export function MasteryProfileCard({ loId }: { loId: string }) {
  const db = useDB();
  const p = masteryProfile(db, loId);
  const gap = profileGap(p);
  const remedy = staleRemedy(p);
  return (
    <section className="stack mastery-profile" style={{ gap: 8 }}>
      <div className="row between nowrap">
        <strong>{L("Mastery profile", "Ustalık profili")}</strong>
        <span className={`chip ${p.retentionStatus === "FRESH" ? "s-MASTERED" : p.retentionStatus === "UNKNOWN" ? "" : "s-NEEDS_REVIEW"}`}>{RETENTION_LABEL(p.retentionStatus)}</span>
      </div>
      <div className="grid-2 mp-split">
        <div className="stack" style={{ gap: 2 }}><span className="tiny muted">{L("Verified", "Doğrulanmış")}</span><Bar value={p.verified} mastered={p.verified >= 0.7} /><span className="tiny">{pct(p.verified)} · {L(`${p.evidenceCount} evidence`, `${p.evidenceCount} kanıt`)}</span></div>
        <div className="stack" style={{ gap: 2 }}><span className="tiny muted">{L("Self-declared", "Kendi beyanın")}</span><Bar value={p.selfDeclared} /><span className="tiny">{p.selfDeclared ? pct(p.selfDeclared) : L("none", "yok")}</span></div>
      </div>
      <div className="mp-dims">
        {MASTERY_DIMENSIONS.map((d) => (
          <div key={d} className="mp-dim">
            <span className="tiny">{DIMENSION_LABEL(d)}</span>
            {p.dims[d].score === null ? <span className="tiny muted">{L("no evidence", "kanıt yok")}</span> : <><Bar value={p.dims[d].score!} mastered={p.dims[d].score! >= 0.7} /><span className="tiny muted">{pct(p.dims[d].score)}</span></>}
          </div>
        ))}
      </div>
      {gap && <div className="banner warn small">{gap}</div>}
      {remedy && <span className="tiny text-2">{remedy === "transfer" ? L("Suggested: a transfer problem.", "Öneri: bir transfer problemi.") : remedy === "delayedRecall" ? L("Suggested: a delayed recall check.", "Öneri: gecikmeli bir hatırlama kontrolü.") : L("Suggested: a short review.", "Öneri: kısa bir tekrar.")}</span>}
      {p.lastVerifiedAt && <span className="tiny muted">{L("Last verified", "Son doğrulama")}: {fmtDate(p.lastVerifiedAt)} · {L("confidence", "güven")} {pct(p.confidence)}</span>}
      <span className="tiny muted">{L("Help lowers the weight of evidence; the full solution does not count. Your own claim never counts as verified.", "Yardım kanıtın ağırlığını düşürür; tam çözüm sayılmaz. Kendi beyanın hiçbir zaman doğrulanmış sayılmaz.")}</span>
    </section>
  );
}

// ---------------------------------------------------------------------------
// What next (A–G)
// ---------------------------------------------------------------------------

export function followNext(o: NextOption, ctx: { milestoneId?: ID; sessionId?: ID } = {}) {
  act((d) => chooseWhatNext(d, o, ctx));
  if (o.kind === "RESEARCH" && o.target.loId) {
    const r = act((d) => createResearch(d, o.title, [o.target.loId!]));
    navigate(`/study?tab=research&res=${r.id}`);
  } else if (o.target.milestoneId) navigate(`/session/${o.target.milestoneId}`);
  else if (o.target.loId) navigate(`/graph?lo=${encodeURIComponent(o.target.loId)}`);
  else if (o.target.courseId) navigate(`/course/${o.target.courseId}`);
  else if (o.target.pathId) navigate("/graph?view=rota");
}

export function WhatNextPanel({ justCompletedMilestoneId, sessionId, onChosen }: { justCompletedMilestoneId?: ID; sessionId?: ID; onChosen?: (o: NextOption) => void }) {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const options = useMemo(() => whatNext(store.state, g, { justCompletedMilestoneId }), [justCompletedMilestoneId, g]);
  useEffect(() => {
    if (options.length) act((d) => logWhatNextShown(d, options, { milestoneId: justCompletedMilestoneId, sessionId }));
  }, [options, justCompletedMilestoneId, sessionId]);
  if (!options.length) return <p className="small muted">{L("No suggestions yet — open the graph to choose freely.", "Henüz öneri yok — serbestçe seçmek için grafiği aç.")}</p>;
  return (
    <div className="stack what-next" style={{ gap: 8 }}>
      <span className="tiny muted">{L("Ranked suggestions — you choose.", "Sıralı öneriler — seçim senin.")}</span>
      {options.map((o, i) => (
        <div key={`${o.kind}-${i}`} className={`card next-option ${i === 0 ? "accent" : ""}`}>
          <button className="row nowrap next-main" onClick={() => { onChosen?.(o); followNext(o, { milestoneId: justCompletedMilestoneId, sessionId }); }}>
            <span className="next-letter" aria-hidden>{NEXT_LETTER[o.kind]}</span>
            <span className="stack grow" style={{ gap: 2, minWidth: 0, textAlign: "left" }}>
              <span className="eyebrow">{NEXT_LABEL(o.kind)}</span>
              <span className="truncate">{o.title}</span>
              {o.detail && <span className="tiny muted truncate">{o.detail}</span>}
            </span>
            <Icon.arrow />
          </button>
          <WhyList reasons={o.reasons} />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home: what to do right now, and why
// ---------------------------------------------------------------------------

export function NowCard({ db, g }: { db: LabDB; g: KnowledgeGraph }) {
  const path = activePath(db);
  const step = path ? currentStep(path) : undefined;
  const repair = repairQueue(db)[0];
  const exam = examConstraints(db, g);
  if (!step && !repair && !exam) return null;
  const open = (loId: string, milestoneId?: ID) => (milestoneId ? navigate(`/session/${milestoneId}`) : navigate(`/graph?lo=${encodeURIComponent(loId)}`));
  const msFor = (loId: string) => Object.values(db.milestones).find((m) => m.learningObjectIds?.includes(loId) && !m.masteredAt)?.id;
  return (
    <section className="card stack now-card" style={{ gap: 8 }}>
      <div className="row between nowrap">
        <span className="eyebrow">{L("Right now", "Şu an")}{exam ? ` · ${L("exam mode", "sınav modu")}` : ""}</span>
        {path && <button className="btn small ghost" onClick={() => navigate("/graph?view=rota")}>{L("Path", "Rota")} <Icon.arrow /></button>}
      </div>
      {step && (
        <>
          <button className="row nowrap next-main" onClick={() => open(step.loId, msFor(step.loId))}>
            <span className="stack grow" style={{ gap: 2, textAlign: "left", minWidth: 0 }}>
              <span className="tiny muted">{ROLE_LABEL(step.role)} · {path!.title}</span>
              <span className="serif truncate" style={{ fontSize: "1.1rem" }}>{g.objects[step.loId]?.title ?? step.loId}</span>
            </span>
            <Icon.arrow />
          </button>
          <WhyList reasons={step.reasons} />
        </>
      )}
      {repair && (!step || step.loId !== repair.loId) && (
        <button className="row nowrap next-main small" onClick={() => open(repair.loId, repair.errors[0].trace?.repairMilestoneId)}>
          <span className="chip s-NEEDS_REVIEW">{L("Repair", "Onarım")}</span>
          <span className="grow truncate" style={{ textAlign: "left" }}>{g.objects[repair.loId]?.title}</span>
          <span className="tiny muted">{L(`${repair.errors.length} errors`, `${repair.errors.length} hata`)}</span>
        </button>
      )}
      {exam && <span className="tiny text-2">{exam.advice}</span>}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Statistics: engagement ≠ learning ≠ retention, depth, errors
// ---------------------------------------------------------------------------

const LEVEL_CHIP: Record<Level, string> = { HIGH: "s-MASTERED", MEDIUM: "s-ATTEMPTED", LOW: "s-NEEDS_REVIEW", INSUFFICIENT: "" };
const showRate = (r: Rate) => (r.value === null ? L(`— (n=${r.n})`, `— (n=${r.n})`) : `${pct(r.value)} (n=${r.n})`);
const showNum = (n: Num, digits = 1, suffix = "") => (n.value === null ? "—" : `${n.value.toFixed(digits)}${suffix}`);

export function LearningLayers() {
  const db = useDB();
  const m = useMemo(() => learningMetrics(db), [db]);
  const rows: [string, string][][] = [
    [[L("Active time (30 d)", "Aktif süre (30 g)"), showNum(m.productivity.activeMinutes, 0, L(" min", " dk"))], [L("Milestones / hour", "Saat başına adım"), showNum(m.productivity.milestonesPerHour)], [L("Questions / session", "Oturum başına soru"), showNum(m.productivity.questionsPerSession)], [L("Attempts / session", "Oturum başına deneme"), showNum(m.productivity.attemptsPerSession)]],
    [[L("Retry rate", "Yeniden deneme"), showRate(m.persistence.retryRate)], [L("Abandonment", "Bırakma"), showRate(m.persistence.abandonmentRate)], [L("Continuation", "Devam etme"), showRate(m.persistence.continuationRate)], [L("Stuck / session", "Oturum başına takılma"), showNum(m.persistence.stuckPerSession, 2)]],
    [[L("First-try accuracy", "İlk deneme doğruluğu"), showRate(m.learning.immediateAccuracy)], [L("Milestones mastered", "Ustalaşılan adım"), showNum(m.learning.masteryGain, 0)], [L("Error reduction", "Hata azalması"), m.learning.errorReduction.value === null ? "—" : pct(m.learning.errorReduction.value)], [L("Transfer success", "Transfer başarısı"), showRate(m.learning.transferSuccess)]],
    [[L("Delayed recall", "Gecikmeli hatırlama"), showRate(m.retention.delayedRecall)], [L("Retention decay", "Kalıcılık kaybı"), m.retention.retentionDecay.value === null ? "—" : pct(m.retention.retentionDecay.value)], [L("Review effectiveness", "Tekrar etkinliği"), showRate(m.retention.reviewEffectiveness)]],
    [[L("Median session", "Medyan oturum"), showNum(m.engagement.medianSessionMinutes, 0, L(" min", " dk"))], [L("Interactions / min", "Dakikada etkileşim"), showNum(m.engagement.interactionDensity)], [L("Streak", "Seri"), L(`${m.engagement.streakDays} days`, `${m.engagement.streakDays} gün`)], [L("Stylus use", "Kalem kullanımı"), showRate(m.engagement.stylusShare)], [L("Interruptions / session", "Oturum başına kesinti"), showNum(m.engagement.interruptionsPerSession)]],
  ];
  const titles = [L("Productivity", "Verimlilik"), L("Persistence", "Sebat"), L("Learning", "Öğrenme"), L("Retention", "Kalıcılık"), L("Engagement", "Katılım")];
  return (
    <section className="stack" style={{ gap: 10 }}>
      <h2>{L("Engagement, learning, retention", "Katılım, öğrenme, kalıcılık")}</h2>
      <div className="grid-3">
        {(["engagement", "learning", "retention"] as const).map((k) => (
          <div key={k} className="card stat"><span className="eyebrow">{k === "engagement" ? L("Engagement", "Katılım") : k === "learning" ? L("Learning", "Öğrenme") : L("Retention", "Kalıcılık")}</span><span className={`chip ${LEVEL_CHIP[m.layers[k]]}`} style={{ alignSelf: "flex-start" }}>{LEVEL_LABEL(m.layers[k])}</span></div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card stat"><span className="eyebrow">{L("Breadth", "Genişlik")}</span><span className="serif stat-n">{m.depth.breadth}</span><span className="tiny muted">{L("objects verified ≥ 60%", "≥ %60 doğrulanmış nesne")}</span></div>
        <div className="card stat"><span className="eyebrow">{L("Depth", "Derinlik")}</span><span className="serif stat-n">{showNum(m.depth.meanDepth)}</span><span className="tiny muted">{L("of 7 layers on average", "7 katmanın ortalaması")}</span></div>
        <div className="card stat"><span className="eyebrow">{L("Retention", "Kalıcılık")}</span><span className="serif stat-n">{pct(m.depth.retention.value)}</span><span className="tiny muted">n={m.depth.retention.n}</span></div>
        <div className="card stat"><span className="eyebrow">{L("Transfer", "Transfer")}</span><span className="serif stat-n">{pct(m.depth.transfer.value)}</span><span className="tiny muted">n={m.depth.transfer.n}</span></div>
      </div>
      {m.summary.map((s, i) => <p key={i} className="small text-2" style={{ margin: 0 }}>{s}</p>)}
      <details className="card">
        <summary className="small" style={{ cursor: "pointer" }}>{L("All measures (last 30 days)", "Tüm ölçüler (son 30 gün)")}</summary>
        <div className="stack" style={{ gap: 10, marginTop: 8 }}>
          {rows.map((group, i) => (
            <div key={i} className="stack" style={{ gap: 2 }}>
              <span className="eyebrow">{titles[i]}</span>
              {group.map(([k, v]) => <div key={k} className="row between small"><span className="text-2">{k}</span><span className="mono">{v}</span></div>)}
            </div>
          ))}
          <div className="stack" style={{ gap: 2 }}>
            <span className="eyebrow">{L("Depth by layer", "Katmana göre derinlik")}</span>
            {MASTERY_DIMENSIONS.map((d) => <div key={d} className="row between small"><span className="text-2">{DIMENSION_LABEL(d)}</span><span className="mono">{pct(m.depth[d].value)} (n={m.depth[d].n})</span></div>)}
          </div>
          <div className="stack" style={{ gap: 2 }}>
            <span className="eyebrow">{L("Subjects", "Dersler")}</span>
            {([[L("Strongest", "En güçlü"), m.subject.strongest], [L("Weakest", "En zayıf"), m.subject.weakest], [L("Strongest milestone type", "En güçlü adım türü"), m.subject.strongestMilestoneType], [L("Most common error", "En sık hata"), m.subject.mostCommonError], [L("Highest retention", "En yüksek kalıcılık"), m.subject.highestRetention], [L("Highest transfer", "En yüksek transfer"), m.subject.highestTransfer]] as [string, string | undefined][]).map(([k, v]) => <div key={k} className="row between small"><span className="text-2">{k}</span><span>{v ?? "—"}</span></div>)}
          </div>
          <span className="tiny muted">{L("Rates need at least 5 observations; '—' means not enough data. Engagement is not evidence of learning.", "Oranlar en az 5 gözlem ister; '—' yetersiz veri demektir. Katılım öğrenmenin kanıtı değildir.")}</span>
        </div>
      </details>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Study → Errors: patterns, repairs, open errors
// ---------------------------------------------------------------------------

export function ErrorsTab() {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const open = openErrors(db);
  const queue = repairQueue(db);
  const insights = Object.values(db.insights).filter((i) => !i.dismissed).sort((a, b) => b.updatedAt - a.updatedAt);
  const resolved = Object.values(db.errors).filter((e) => e.resolution === "RESOLVED").length;
  return (
    <div className="stack">
      {insights.map((i) => (
        <div key={i.id} className={`banner ${i.kind === "CROSS_DOMAIN_MISCONCEPTION" ? "warn" : "info"} stack`} style={{ gap: 4 }}>
          <strong>{i.kind === "CROSS_DOMAIN_MISCONCEPTION" ? L("Possible misconception across subjects", "Dersler arası olası yanılgı") : L("Recurring error", "Tekrarlayan hata")}</strong>
          <span className="small">{i.summary}</span>
          <span className="tiny muted">{L("confidence", "güven")} {pct(i.confidence)} · {L(`${i.evidence.length} errors`, `${i.evidence.length} hata`)}</span>
          <div className="row">
            {i.loId && <button className="btn small" onClick={() => navigate(`/graph?lo=${encodeURIComponent(i.loId!)}`)}>{L("Open the concept", "Kavramı aç")}</button>}
            <button className="btn small ghost" onClick={() => act((d) => { d.insights[i.id].dismissed = true; })}>{L("Dismiss", "Kapat")}</button>
          </div>
        </div>
      ))}
      {queue.length > 0 && (
        <section className="card stack" style={{ gap: 6 }}>
          <span className="eyebrow">{L("Repair first", "Önce onar")}</span>
          {queue.slice(0, 6).map((q) => (
            <div key={q.loId} className="list-item">
              <span className="grow stack" style={{ gap: 0, minWidth: 0 }}>
                <span className="truncate">{g.objects[q.loId]?.title ?? q.loId}</span>
                <span className="tiny muted">{L(`${q.errors.length} errors point here · confidence ${pct(q.confidence)}`, `${q.errors.length} hata buraya işaret ediyor · güven ${pct(q.confidence)}`)}</span>
              </span>
              <button className="btn small primary" onClick={() => { act((d) => q.errors.forEach((e) => startRepair(d, e.id))); const ms = q.errors[0].trace?.repairMilestoneId; navigate(ms ? `/session/${ms}` : `/graph?lo=${encodeURIComponent(q.loId)}`); }}>{L("Repair", "Onar")}</button>
            </div>
          ))}
        </section>
      )}
      {!open.length && !insights.length && <p className="small muted">{L("No open errors. Every wrong answer is analysed here: its type, where in the graph it may come from, and how to repair it.", "Açık hata yok. Her yanlış cevap burada analiz edilir: türü, grafikte nereden kaynaklanıyor olabileceği ve nasıl onarılacağı.")}</p>}
      {open.slice(0, 30).map((e) => (
        <div key={e.id} className="stack" style={{ gap: 4 }}>
          <span className="tiny muted">{fmtDate(e.createdAt)} · {db.milestones[e.milestoneId]?.title ?? ""}</span>
          <ErrorCard err={e} compact />
          <button className="btn small ghost" style={{ alignSelf: "flex-start" }} onClick={() => act((d) => dismissError(d, e.id))}>{L("Not a real error — dismiss", "Gerçek bir hata değil — kapat")}</button>
        </div>
      ))}
      {resolved > 0 && <p className="tiny muted">{L(`${resolved} errors resolved by later evidence.`, `${resolved} hata sonraki kanıtla çözüldü.`)}</p>}
    </div>
  );
}
