import { Celebrate } from "../components/Effects";
import { getGraph } from "../../knowledge/graph";
import { useEffect, useRef, useState } from "react";
import type { ID } from "../../domain/types";
import { courseMilestones, milestoneQuestions, addQuestion } from "../../engines/curriculum";
import { sanitizeQuestion } from "../../engines/curriculumSpec";
import { ensureSession } from "../../engines/sessions";
import { leaveMilestone, openMilestone, skipMilestone, endSession } from "../../engines/progress";
import { milestoneSessionState, nextQuestion, reviewQuestion } from "../../engines/sessionPlan";
import { sessionConditions } from "../../engines/experiments";
import { logEvent } from "../../engines/analytics";
import { generateQuestionsAI } from "../../ai/curriculumAI";
import { act, aiHost, navigate, store, toast, useAsync, useDB } from "../state";
import { Bar, Difficulty, Empty, Icon, StatusChip, TYPE_LABEL, minutes } from "../components/common";
import { QuestionCard } from "../components/QuestionCard";
import { WhatNextPanel } from "../components/Adaptive";
import { courseProgress } from "./CoursePage";
import { useActivityTracker } from "../activity";
import { ImmediateCheck } from "../components/ImmediateCheck";
import { QuickCheck } from "../components/QuickCheck";
import { decomposeAI } from "../../ai/generativeAI";
import { makeProvider } from "../../ai/providers";
import { AI_PROGRESS } from "../../ai/engine";
import { decompose, ephemeralChildren, lengthAdvice, milestoneLength, LENGTH_LABEL, LENGTH_SCOPE } from "../../adaptive/decompose";
import { lastMasteryChange } from "../../adaptive/depth";
import { newConnections, whyMatters } from "../../adaptive/discovery";
import { logEvent as logEv } from "../../engines/analytics";
import { L } from "../../i18n";

/**
 * The learning session: one milestone in focus. Objective → attempt →
 * feedback → retry/help → mastery → visible progress → what's next.
 */
export function SessionPage({ milestoneId }: { milestoneId: ID }) {
  const db = useDB();
  const m = db.milestones[milestoneId];
  const [sessionId, setSessionId] = useState<ID | null>(null);
  const [gate, setGate] = useState<"checking" | "locked" | "open">("checking");
  const [phase, setPhase] = useState<"work" | "complete">("work");
  const before = useRef<{ progress: number; open: Set<ID> } | null>(null);
  const completedHere = useRef(false);

  useActivityTracker(sessionId, milestoneId);

  useEffect(() => {
    if (!m) return;
    const s = act((d) => ensureSession(d, m.courseId));
    setSessionId(s.id);
    if (m.status === "LOCKED") setGate("locked");
    else {
      act((d) => openMilestone(d, s.id, milestoneId));
      setGate("open");
    }
    const ms = courseMilestones(store.state, m.courseId);
    const p = courseProgress(store.state, m.courseId);
    before.current = { progress: p.requiredTotal ? p.requiredMastered / p.requiredTotal : 0, open: new Set(ms.filter((x) => x.status !== "LOCKED").map((x) => x.id)) };
    return () => {
      if (store.state.milestones[milestoneId]) act((d) => leaveMilestone(d, s.id, milestoneId, completedHere.current || !!d.milestones[milestoneId]?.masteredAt));
    };
  }, [milestoneId]); // re-run only when the milestone changes

  if (!m) return <Empty title={L("This milestone no longer exists", "Bu adım artık yok")}><button className="btn" onClick={() => navigate("/")}>{L("Home", "Ana sayfa")}</button></Empty>;
  const course = db.courses[m.courseId];

  const exit = () => navigate(`/course/${m.courseId}`);
  const finishSession = () => {
    if (sessionId) {
      act((d) => {
        logEvent(d, "CONTINUE_DECISION", { sessionId, milestoneId }, { continued: false });
        endSession(d, sessionId, "USER_ENDED");
      });
      navigate(`/summary/${sessionId}`);
    } else exit();
  };

  if (gate === "locked" && sessionId) {
    const missing = m.prerequisites.map((p) => db.milestones[p]).filter((p) => p && !["MASTERED", "NEEDS_REVIEW", "SKIPPED"].includes(p.status));
    return (
      <div className="stack-lg rise">
        <TopBar title={course?.title ?? ""} onBack={exit} onEnd={finishSession} />
        <div className="card stack">
          <span className="row" style={{ gap: 8 }}><Icon.lock /><span className="eyebrow">{L("Preview", "Önizleme")}</span></span>
          <h1>{m.title}</h1>
          <p className="serif">{m.learningObjective}</p>
          {(() => { const lo = m.learningObjectIds?.[0]; const w = lo ? whyMatters(getGraph(db.knowledge), lo) : null; return w ? <p className="small text-2">{L("Why it matters: ", "Neden önemli: ")}{w.summary}</p> : null; })()}
          <p className="text-2">{L("It builds on steps you haven't shown yet. You can look first, start anyway, or go to the prerequisite:", "Henüz göstermediğin adımlar üzerine kurulu. Önce bakabilir, yine de başlayabilir ya da önkoşula gidebilirsin:")}</p>
          <div className="list">
            {missing.map((p) => (
              <button key={p.id} className="list-item" style={{ background: "none", border: 0, color: "inherit", textAlign: "left" }} onClick={() => navigate(`/session/${p.id}`)}>
                <span className="grow">{p.title}</span><StatusChip status={p.status} /><Icon.arrow />
              </button>
            ))}
          </div>
          <div className="row">
            <button className="btn primary grow" onClick={() => missing[0] && navigate(`/session/${missing[0].id}`)}>{L("Go to the prerequisite", "Ön koşula git")}</button>
            <button className="btn" onClick={() => { act((d) => openMilestone(d, sessionId, milestoneId, { override: true })); setGate("open"); }}>{L("Start anyway", "Yine de başla")}</button>
            {m.learningObjectIds?.[0] && <button className="btn ghost" onClick={() => navigate(`/graph?lo=${encodeURIComponent(m.learningObjectIds![0])}`)}>{L("Look first", "Önce bak")}</button>}
          </div>
        </div>
      </div>
    );
  }
  if (gate === "checking" || !sessionId) return <div className="skeleton" style={{ height: 200 }} />;

  if (phase === "complete") {
    return (
      <CompletionView milestoneId={milestoneId} sessionId={sessionId} before={before.current}
        onFinish={finishSession} onBack={exit} />
    );
  }

  const toComplete = () => {
    completedHere.current = true;
    setPhase("complete");
  };

  const deep = db.preferences.deepWork;
  const parent = m.ephemeral ? db.milestones[m.ephemeral.parentId] : undefined;
  return (
    <div className={`stack-lg rise ${deep ? "deep" : ""}`}>
      <TopBar title={course?.title ?? ""} onBack={exit} onEnd={finishSession} sessionId={sessionId} />
      {parent && (
        <button className="banner info row between" style={{ textAlign: "left", color: "inherit", font: "inherit", cursor: "pointer" }} onClick={() => navigate(`/session/${parent.id}`)}>
          <span className="small">{L(`A smaller step toward "${parent.title}". Temporary — it disappears once that is mastered.`, `"${parent.title}" adımına doğru daha küçük bir adım. Geçici — o ustalaşılınca kaybolur.`)}</span><Icon.arrow />
        </button>
      )}
      {!deep && sessionConditions(db, sessionId).armLabel && (
        <div className="tiny muted">{L("Experiment running · this session: ", "Deney sürüyor · bu oturum: ")}{sessionConditions(db, sessionId).armLabel}</div>
      )}
      <ObjectiveHeader milestoneId={milestoneId} />
      {!deep && <ContextPanel milestoneId={milestoneId} />}
      <SmallerSteps milestoneId={milestoneId} sessionId={sessionId} />
      <WorkArea milestoneId={milestoneId} sessionId={sessionId} onComplete={toComplete} />
      {!deep && (
        <div className="row">
          <button className="btn ghost small" onClick={() => { act((d) => skipMilestone(d, milestoneId, sessionId)); toast(L("Skipped. It stays on the map for later.", "Atlandı. Daha sonrası için haritada duruyor.")); exit(); }}>{L("Skip this milestone", "Bu adımı atla")}</button>
        </div>
      )}
    </div>
  );
}

/** Holds the question in focus until the user moves on, so feedback stays visible after answering. */
function WorkArea({ milestoneId, sessionId, onComplete }: { milestoneId: ID; sessionId: ID; onComplete: () => void }) {
  const db = useDB();
  const m = db.milestones[milestoneId];
  // Mastered (or fading) milestones can be practised again; that is review mode.
  const reviewMode = () => !!store.state.milestones[milestoneId]?.masteredAt;
  const pick = (exclude: ID[] = []) =>
    (reviewMode() ? reviewQuestion(store.state, milestoneId, exclude) : nextQuestion(store.state, milestoneId, { exclude }))?.id ?? null;
  const [currentQ, setCurrentQ] = useState<ID | null>(() => {
    if (store.state.milestones[milestoneId]?.status === "NEEDS_REVIEW") return pick();
    // "Restart" from the home screen: begin with a different question than the one left open.
    if (new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("restart")) {
      const last = [...store.state.events].reverse().find((e) => e.milestoneId === milestoneId && e.type === "QUESTION_SHOWN")?.questionId;
      return nextQuestion(store.state, milestoneId, { exclude: last ? [last] : [] })?.id ?? null;
    }
    return nextQuestion(store.state, milestoneId)?.id ?? null;
  });
  const [practising, setPractising] = useState(false);
  const [qKey, setQKey] = useState(0);
  const state = milestoneSessionState(db, milestoneId);
  const q = currentQ ? db.questions[currentQ] : undefined;
  const conditions = sessionConditions(db, sessionId);

  useEffect(() => {
    // Questions can be generated while the page is open; pick one up when none is held.
    if (!currentQ || !db.questions[currentQ]) {
      const next = nextQuestion(db, milestoneId);
      if (next) setCurrentQ(next.id);
    }
  }, [db, currentQ, milestoneId, db.events.length]);

  const advance = (exclude: ID[] = []) => {
    setCurrentQ(pick(exclude));
    setQKey((k) => k + 1);
  };

  return (
    <>
      {state.mastered && (
        <div className="card stack">
          <div className={`banner ${m.status === "NEEDS_REVIEW" ? "warn" : "ok"}`}>
            {m.status === "NEEDS_REVIEW" ? L("A retention check suggests this has faded. One correct answer below restores it.", "Bir kalıcılık kontrolü bunun unutulmaya başladığını gösteriyor. Aşağıdaki tek bir doğru cevap ustalığı geri getirir.") : L("You have mastered this milestone.", "Bu adımda ustalaştın.")}
          </div>
          <div className="row">
            {!q && !practising && <button className="btn" onClick={() => { setPractising(true); advance(); }}>{L("Practise again", "Yeniden çalış")}</button>}
            <button className="btn primary" onClick={onComplete}>{L("What's next?", "Sırada ne var?")}</button>
          </div>
        </div>
      )}
      {q ? (
        <QuestionCard key={`${q.id}-${qKey}`} question={q} sessionId={sessionId} conditions={conditions}
          purposeOverride={state.mastered ? "MASTERY" : undefined}
          onNext={() => advance([q.id])} onMastered={onComplete} onDifferent={() => advance([q.id])}
          onSwitchQuestion={(id) => { setCurrentQ(id); setQKey((k) => k + 1); }} />
      ) : !state.mastered ? (
        <NoQuestions milestoneId={milestoneId} sessionId={sessionId} onMastered={onComplete} exhausted={state.exhausted} />
      ) : null}
    </>
  );
}

function TopBar({ title, onBack, onEnd, sessionId }: { title: string; onBack: () => void; onEnd: () => void; sessionId?: ID }) {
  const db = useDB();
  const deep = db.preferences.deepWork;
  const toggle = () => act((d) => { d.preferences.deepWork = !deep; logEv(d, "DEEP_WORK", { sessionId }, { on: !deep }); });
  return (
    <div className="row between nowrap">
      <button className="btn ghost small" onClick={onBack}><Icon.back /> <span className="truncate" style={{ maxWidth: deep ? 120 : 200 }}>{deep ? "" : title}</span></button>
      <span className="row nowrap" style={{ gap: 6 }}>
        {sessionId && <button className={`btn small ${deep ? "primary" : "ghost"}`} onClick={toggle} aria-pressed={deep} title={L("Deep work: only the problem in front of you", "Derin çalışma: yalnızca önündeki problem")}><Icon.focus /> <span className="hide-narrow">{L("Deep work", "Derin çalışma")}</span></button>}
        <button className="btn small" onClick={onEnd}>{L("End session", "Oturumu bitir")}</button>
      </span>
    </div>
  );
}

/** Too big? Temporary smaller steps (never added to the knowledge graph). */
function SmallerSteps({ milestoneId, sessionId }: { milestoneId: ID; sessionId: ID }) {
  const db = useDB();
  const m = db.milestones[milestoneId];
  const kids = ephemeralChildren(db, milestoneId);
  const advice = lengthAdvice(db, milestoneId);
  if (m.masteredAt || m.ephemeral) return null;
  if (!kids.length && advice?.kind !== "TOO_BIG") return null;
  const [aiBusy, setAiBusy] = useState(false);
  const aiReady = makeProvider(db.preferences).ready();
  const splitAI = async () => {
    setAiBusy(true);
    const r = await decomposeAI(aiHost, getGraph(db.knowledge), milestoneId);
    setAiBusy(false);
    const ids = act((d) => decompose(d, getGraph(d.knowledge), milestoneId, { sessionId, plan: r.value, source: r.fallbackUsed ? "local" : "ai" }));
    if (r.fallbackUsed) toast(L("AI unavailable or its steps did not pass the checks — Lab's own steps were used.", "YZ kullanılamadı ya da adımları kontrolleri geçemedi — Lab'ın kendi adımları kullanıldı."));
    else if (r.rejected.length) toast(L(`${r.rejected.length} AI step(s) were dropped by the quality checks.`, `${r.rejected.length} YZ adımı kalite kontrollerinde elendi.`));
    if (ids.length) navigate(`/session/${ids[0]}`);
  };
  const split = () => {
    const ids = act((d) => decompose(d, getGraph(d.knowledge), milestoneId, { sessionId }));
    if (ids.length) navigate(`/session/${ids[0]}`);
    else toast(L("No smaller pieces could be found here — try a hint or the prerequisite.", "Burada daha küçük parçalar bulunamadı — bir ipucu ya da önkoşulu dene."));
  };
  return (
    <section className="card stack smaller-steps" style={{ gap: 6 }}>
      {kids.length ? (
        <>
          <span className="eyebrow">{L("Smaller steps", "Daha küçük adımlar")}</span>
          {kids.map((k, i) => (
            <button key={k.id} className="row nowrap list-item small" style={{ textAlign: "left" }} onClick={() => navigate(`/session/${k.id}`)}>
              <span className="mono muted">{i + 1}</span><span className="grow truncate">{k.title}</span>{k.masteredAt ? <span style={{ color: "var(--mastered)" }}>✓</span> : <Icon.arrow />}
            </button>
          ))}
          <span className="tiny muted">{L(`Then back here. These are temporary and disappear once "${m.title}" is mastered.`, `Sonra buraya dön. Bunlar geçici; "${m.title}" ustalaşılınca kaybolur.`)}</span>
        </>
      ) : (
        <>
          <span className="small text-2">{advice!.reason}</span>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn small" onClick={split}>{L("Break it into smaller steps", "Daha küçük adımlara böl")}</button>
            {aiReady && <button className="btn small ghost" disabled={aiBusy} onClick={splitAI}>{aiBusy ? <><span className="spinner" /> {AI_PROGRESS("MILESTONE_GENERATOR")}</> : L("Break it down with AI", "YZ ile böl")}</button>}
          </div>
        </>
      )}
    </section>
  );
}

function ObjectiveHeader({ milestoneId }: { milestoneId: ID }) {
  const db = useDB();
  const m = db.milestones[milestoneId];
  const { progress } = milestoneSessionState(db, milestoneId);
  return (
    <header className="stack" style={{ gap: 10 }}>
      <div className="row" style={{ gap: 8 }}>
        <span className="eyebrow">{TYPE_LABEL[m.milestoneType]}</span>
        <StatusChip status={m.status} />
        <span className="row tiny muted" style={{ gap: 6 }} title={LENGTH_SCOPE(milestoneLength(m))}><Difficulty value={m.difficulty} /> ~{minutes(m.estimatedDuration)} · {LENGTH_LABEL(milestoneLength(m))}</span>
      </div>
      <h1>{m.title}</h1>
      <div className="card accent stack" style={{ gap: 6 }}>
        <span className="eyebrow">{L("After this, you can", "Bunun sonunda şunu yapabileceksin")}</span>
        <p className="serif" style={{ fontSize: "1.08rem" }}>{m.learningObjective}</p>
        <div className="row between small text-2" style={{ marginTop: 4 }}>
          <span>{L("Mastery: ", "Ustalık ölçütü: ")}{m.masteryCriteria.description}</span>
        </div>
        <div className="row nowrap" style={{ gap: 6 }} aria-label={L(`${progress.achieved} of ${progress.required} mastery answers`, `${progress.required} ustalık cevabından ${progress.achieved} tanesi`)}>
          {Array.from({ length: progress.required }).map((_, i) => (
            <span key={i} style={{ flex: 1, height: 6, borderRadius: 99, background: i < progress.achieved ? "var(--mastered)" : "var(--raised-2)", transition: "background .5s" }} />
          ))}
          <span className="tiny muted mono" style={{ marginLeft: 6 }}>{progress.achieved}/{progress.required}</span>
        </div>
      </div>
      {!!m.learningObjectIds?.length && (
        <div className="row tiny muted" style={{ gap: 6 }}>
          <span>{L("In the knowledge graph:", "Bilgi grafiğinde:")}</span>
          {m.learningObjectIds.map((id) => {
            const o = getGraph(db.knowledge).objects[id];
            return o ? <a key={id} href={`#/graph?lo=${encodeURIComponent(id)}`} style={{ color: "var(--accent)" }}>{o.title}</a> : null;
          })}
        </div>
      )}
    </header>
  );
}

function ContextPanel({ milestoneId }: { milestoneId: ID }) {
  const db = useDB();
  const m = db.milestones[milestoneId];
  const [open, setOpen] = useState(false);
  const prereqs = m.prerequisites.map((p) => db.milestones[p]).filter(Boolean);
  const concepts = m.conceptIds.map((c) => db.concepts[c]).filter(Boolean);
  if (!prereqs.length && !concepts.length && !m.description) return null;
  return (
    <div className="card" style={{ padding: 0 }}>
      <button className="row between" style={{ width: "100%", padding: 14, background: "none", border: 0, color: "inherit", cursor: "pointer" }} onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="small text-2">{L("Context", "Bağlam")} · {db.units[m.unitId]?.title} › {db.topics[m.topicId]?.title}</span>
        {open ? <Icon.up /> : <Icon.down />}
      </button>
      {open && (
        <div className="stack small" style={{ padding: "0 14px 14px", gap: 8 }}>
          {m.description && <p className="text-2">{m.description}</p>}
          {concepts.map((c) => <p key={c.id}><strong>{c.title}</strong> <span className="text-2">— {c.description}</span></p>)}
          {prereqs.length > 0 && <div className="text-2">{L("Builds on: ", "Üzerine kurulu: ")}{prereqs.map((p) => `${p.title}${p.masteredAt ? " ✓" : ""}`).join(" · ")}</div>}
        </div>
      )}
    </div>
  );
}

function NoQuestions({ milestoneId, onMastered, exhausted }: { milestoneId: ID; sessionId?: ID; onMastered: () => void; exhausted: boolean }) {
  const db = useDB();
  const m = db.milestones[milestoneId];
  const { busy, run } = useAsync();
  const [checking, setChecking] = useState(false);
  const generate = () => run(async () => {
    const res = await generateQuestionsAI(aiHost, store.state, m);
    act((d) => {
      const repairs: string[] = [];
      for (const q of res.value) {
        const clean = sanitizeQuestion(q, milestoneId, m.recommendedInteractionType, res.provider, repairs);
        if (clean) addQuestion(d, clean);
      }
    });
    toast(res.fallbackUsed ? L("Added rubric-based prompts (offline).", "Ölçüt temelli sorular eklendi (çevrimdışı).") : L("Questions generated.", "Sorular oluşturuldu."));
  });
  return (
    <div className="card stack">
      <p className="text-2">{exhausted ? L("You've answered every question, but mastery needs answers given without the full solution.", "Her soruyu cevapladın, ama ustalık için tam çözüme bakmadan verilmiş cevaplar gerekiyor.") : L("This milestone has no questions yet.", "Bu adımda henüz soru yok.")}</p>
      <div className="row">
        <button className="btn primary" onClick={generate} disabled={busy}>{busy ? <span className="spinner" /> : <Icon.spark />} {exhausted ? L("Generate fresh questions", "Yeni sorular oluştur") : L("Generate questions", "Sorular oluştur")}</button>
        <button className="btn" onClick={() => setChecking(true)}>{L("I can do this — check me", "Bunu yapabiliyorum — kontrol et")}</button>
      </div>
      <p className="tiny muted">{L("A short check (2–3 questions, no hints) shows it instead of just claiming it.", "Kısa bir kontrol (2–3 soru, ipucusuz) bunu iddia etmek yerine gösterir.")}</p>
      {checking && <QuickCheck target={{ milestoneId }} title={m.title} onClose={() => setChecking(false)} onDone={(o) => { if (o.masteredMilestone) setTimeout(onMastered, 600); }} />}
      {milestoneQuestions(db, milestoneId).length === 0 && null}
    </div>
  );
}

function CompletionView({ milestoneId, sessionId, before, onFinish, onBack }: {
  milestoneId: ID; sessionId: ID; before: { progress: number; open: Set<ID> } | null;
  onFinish: () => void; onBack: () => void;
}) {
  const db = useDB();
  const m = db.milestones[milestoneId];
  const p = courseProgress(db, m.courseId);
  const after = p.requiredTotal ? p.requiredMastered / p.requiredTotal : 0;
  const [shown, setShown] = useState(before?.progress ?? after);
  useEffect(() => {
    const t = setTimeout(() => setShown(after), 350);
    return () => clearTimeout(t);
  }, [after]);
  const unlocked = courseMilestones(db, m.courseId).filter((x) => x.status !== "LOCKED" && !x.masteredAt && before && !before.open.has(x.id));
  return (
    <div className="stack-lg">
      <div className="row between nowrap">
        <button className="btn ghost small" onClick={onBack}><Icon.back /> {L("Course", "Ders")}</button>
        <button className="btn small" onClick={onFinish}>{L("Finish session", "Oturumu bitir")}</button>
      </div>
      <div className="card stack rise" style={{ alignItems: "center", textAlign: "center", padding: "28px 16px", gap: 10 }}>
        <MasteryMark />
        <Celebrate count={24} />
        <span className="eyebrow" style={{ color: "var(--mastered)" }}>{L("Mastered", "Ustalaştın")}</span>
        <h1>{m.title}</h1>
        <p className="text-2" style={{ maxWidth: 520 }}>{L("You can now: ", "Artık yapabildiğin: ")}{m.learningObjective}</p>
      </div>
      <ProgressStory milestoneId={milestoneId} />
      <ImmediateCheck milestoneId={milestoneId} sessionId={sessionId} />
      <div className="card stack" style={{ gap: 8 }}>
        <div className="row between small"><span className="text-2">{db.courses[m.courseId]?.title}</span><span className="mono">{p.requiredMastered}/{p.requiredTotal}</span></div>
        <Bar value={shown} mastered />
        {unlocked.length > 0 && (
          <div className="stack" style={{ gap: 4, marginTop: 6 }}>
            <span className="eyebrow">{L("Unlocked", "Kilidi açıldı")}</span>
            {unlocked.map((u, i) => <div key={u.id} className="row small rise" style={{ animationDelay: `${300 + i * 120}ms` }}><span style={{ color: "var(--accent)" }}>◆</span> {u.title}</div>)}
          </div>
        )}
      </div>
      <section className="stack">
        <h2>{L("What's next?", "Sırada ne var?")}</h2>
        <WhatNextPanel justCompletedMilestoneId={milestoneId} sessionId={sessionId}
          onChosen={(o) => act((d) => logEvent(d, "CONTINUE_DECISION", { sessionId, milestoneId }, { continued: true, next: o.target.milestoneId ?? o.target.loId ?? o.target.courseId, kind: o.kind }))} />
      </section>
    </div>
  );
}

function MasteryMark() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="31" fill="none" stroke="var(--raised-2)" strokeWidth="4" />
      <circle cx="36" cy="36" r="31" fill="none" stroke="var(--mastered)" strokeWidth="4" strokeLinecap="round"
        strokeDasharray="195" strokeDashoffset="195" transform="rotate(-90 36 36)" style={{ animation: "draw-ring .9s var(--ease) forwards" }} />
      <path d="M24 37l8 8 16-17" fill="none" stroke="var(--mastered)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="40" strokeDashoffset="40" style={{ animation: "draw-ring .5s .6s var(--ease) forwards" }} />
    </svg>
  );
}

/** Evidence recorded → mastery updated → connections that just became complete. */
function ProgressStory({ milestoneId }: { milestoneId: ID }) {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const m = db.milestones[milestoneId];
  const lo = m?.learningObjectIds?.find((id) => g.objects[id]);
  if (!lo) return null;
  const ch = lastMasteryChange(db, lo);
  const links = newConnections(db, g, lo);
  return (
    <div className="card stack progress-story" style={{ gap: 8 }}>
      <div className="row small rise" style={{ gap: 8 }}><span style={{ color: "var(--mastered)" }}>✓</span> {L("Evidence recorded", "Kanıt kaydedildi")}{ch ? ` — ${ch.because}` : ""}</div>
      {ch && <div className="row small rise" style={{ gap: 8, animationDelay: "200ms" }}><span style={{ color: "var(--accent)" }}>↑</span> {g.objects[lo].title}: <span className="mono">{Math.round(ch.before * 100)}% → {Math.round(ch.after * 100)}%</span></div>}
      {links.length > 0 && (
        <div className="stack discovery-moment rise" style={{ gap: 4, animationDelay: "400ms" }}>
          <span className="eyebrow">{L("You just connected", "Az önce bağladın")}</span>
          {links.slice(0, 3).map((l) => <span key={l.id} className="small serif">{g.objects[lo].title} ↔ {l.title} <span className="tiny muted">· {l.domain}{l.relation ? ` · ${l.relation}` : ""}</span></span>)}
        </div>
      )}
    </div>
  );
}
