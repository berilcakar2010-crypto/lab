import { useEffect, useRef, useState } from "react";
import type { ID } from "../../domain/types";
import { courseMilestones, milestoneQuestions, addQuestion } from "../../engines/curriculum";
import { sanitizeQuestion } from "../../engines/curriculumSpec";
import { ensureSession } from "../../engines/sessions";
import { grantMastery, leaveMilestone, openMilestone, skipMilestone, endSession } from "../../engines/progress";
import { milestoneSessionState, nextQuestion } from "../../engines/sessionPlan";
import { logEvent } from "../../engines/analytics";
import { generateQuestionsAI } from "../../ai/curriculumAI";
import { act, aiHost, navigate, store, toast, useAsync, useDB } from "../state";
import { Bar, Difficulty, Empty, Icon, StatusChip, TYPE_LABEL, minutes } from "../components/common";
import { QuestionCard } from "../components/QuestionCard";
import { NextOptions } from "../components/NextOptions";
import { courseProgress } from "./CoursePage";
import { useActivityTracker } from "../activity";
import { ImmediateCheck } from "../components/ImmediateCheck";

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

  if (!m) return <Empty title="This milestone no longer exists"><button className="btn" onClick={() => navigate("/")}>Home</button></Empty>;
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
          <span className="row" style={{ gap: 8 }}><Icon.lock /><span className="eyebrow">Locked</span></span>
          <h1>{m.title}</h1>
          <p className="text-2">This builds on milestones you haven't completed yet:</p>
          <div className="list">
            {missing.map((p) => (
              <button key={p.id} className="list-item" style={{ background: "none", border: 0, color: "inherit", textAlign: "left" }} onClick={() => navigate(`/session/${p.id}`)}>
                <span className="grow">{p.title}</span><StatusChip status={p.status} /><Icon.arrow />
              </button>
            ))}
          </div>
          <div className="row">
            <button className="btn primary grow" onClick={() => missing[0] && navigate(`/session/${missing[0].id}`)}>Go to the prerequisite</button>
            <button className="btn" onClick={() => { act((d) => openMilestone(d, sessionId, milestoneId, { override: true })); setGate("open"); }}>Open anyway</button>
          </div>
        </div>
      </div>
    );
  }
  if (gate === "checking" || !sessionId) return <div className="skeleton" style={{ height: 200 }} />;

  if (phase === "complete") {
    return (
      <CompletionView milestoneId={milestoneId} sessionId={sessionId} before={before.current}
        onChoose={(id) => {
          act((d) => logEvent(d, "CONTINUE_DECISION", { sessionId, milestoneId }, { continued: true, next: id }));
          navigate(`/session/${id}`);
        }}
        onFinish={finishSession} onBack={exit} />
    );
  }

  const toComplete = () => {
    completedHere.current = true;
    setPhase("complete");
  };

  return (
    <div className="stack-lg rise">
      <TopBar title={course?.title ?? ""} onBack={exit} onEnd={finishSession} />
      <ObjectiveHeader milestoneId={milestoneId} />
      <ContextPanel milestoneId={milestoneId} />
      <WorkArea milestoneId={milestoneId} sessionId={sessionId} onComplete={toComplete} />
      <div className="row">
        <button className="btn ghost small" onClick={() => { act((d) => skipMilestone(d, milestoneId, sessionId)); toast("Skipped. It stays on the map for later."); exit(); }}>Skip this milestone</button>
      </div>
    </div>
  );
}

/** Holds the question in focus until the user moves on, so feedback stays visible after answering. */
function WorkArea({ milestoneId, sessionId, onComplete }: { milestoneId: ID; sessionId: ID; onComplete: () => void }) {
  const db = useDB();
  const m = db.milestones[milestoneId];
  const [currentQ, setCurrentQ] = useState<ID | null>(() => nextQuestion(store.state, milestoneId)?.id ?? null);
  const [qKey, setQKey] = useState(0);
  const state = milestoneSessionState(db, milestoneId);
  const q = currentQ ? db.questions[currentQ] : undefined;

  useEffect(() => {
    // Questions can be generated while the page is open; pick one up when none is held.
    if (!currentQ || !db.questions[currentQ]) {
      const next = nextQuestion(db, milestoneId);
      if (next) setCurrentQ(next.id);
    }
  }, [db, currentQ, milestoneId, db.events.length]);

  const advance = (exclude: ID[] = []) => {
    setCurrentQ(nextQuestion(store.state, milestoneId, { exclude })?.id ?? null);
    setQKey((k) => k + 1);
  };

  return (
    <>
      {state.mastered && (
        <div className="card stack">
          <div className="banner ok">You have mastered this milestone{m.status === "NEEDS_REVIEW" ? ", but a retention check suggests it has faded. Practise below to restore it." : "."}</div>
          {!q && <button className="btn primary" onClick={onComplete}>What's next?</button>}
        </div>
      )}
      {q ? (
        <QuestionCard key={`${q.id}-${qKey}`} question={q} sessionId={sessionId}
          onNext={() => advance()} onMastered={onComplete} onDifferent={() => advance([q.id])} />
      ) : !state.mastered ? (
        <NoQuestions milestoneId={milestoneId} sessionId={sessionId} onMastered={onComplete} exhausted={state.exhausted} />
      ) : null}
    </>
  );
}

function TopBar({ title, onBack, onEnd }: { title: string; onBack: () => void; onEnd: () => void }) {
  return (
    <div className="row between nowrap">
      <button className="btn ghost small" onClick={onBack}><Icon.back /> <span className="truncate" style={{ maxWidth: 200 }}>{title}</span></button>
      <button className="btn small" onClick={onEnd}>End session</button>
    </div>
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
        <span className="row tiny muted" style={{ gap: 6 }}><Difficulty value={m.difficulty} /> ~{minutes(m.estimatedDuration)}</span>
      </div>
      <h1>{m.title}</h1>
      <div className="card accent stack" style={{ gap: 6 }}>
        <span className="eyebrow">After this, you can</span>
        <p className="serif" style={{ fontSize: "1.08rem" }}>{m.learningObjective}</p>
        <div className="row between small text-2" style={{ marginTop: 4 }}>
          <span>Mastery: {m.masteryCriteria.description}</span>
        </div>
        <div className="row nowrap" style={{ gap: 6 }} aria-label={`${progress.achieved} of ${progress.required} mastery answers`}>
          {Array.from({ length: progress.required }).map((_, i) => (
            <span key={i} style={{ flex: 1, height: 6, borderRadius: 99, background: i < progress.achieved ? "var(--mastered)" : "var(--raised-2)", transition: "background .5s" }} />
          ))}
          <span className="tiny muted mono" style={{ marginLeft: 6 }}>{progress.achieved}/{progress.required}</span>
        </div>
      </div>
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
        <span className="small text-2">Context · {db.units[m.unitId]?.title} › {db.topics[m.topicId]?.title}</span>
        {open ? <Icon.up /> : <Icon.down />}
      </button>
      {open && (
        <div className="stack small" style={{ padding: "0 14px 14px", gap: 8 }}>
          {m.description && <p className="text-2">{m.description}</p>}
          {concepts.map((c) => <p key={c.id}><strong>{c.title}</strong> <span className="text-2">— {c.description}</span></p>)}
          {prereqs.length > 0 && <div className="text-2">Builds on: {prereqs.map((p) => `${p.title}${p.masteredAt ? " ✓" : ""}`).join(" · ")}</div>}
        </div>
      )}
    </div>
  );
}

function NoQuestions({ milestoneId, sessionId, onMastered, exhausted }: { milestoneId: ID; sessionId: ID; onMastered: () => void; exhausted: boolean }) {
  const db = useDB();
  const m = db.milestones[milestoneId];
  const { busy, run } = useAsync();
  const generate = () => run(async () => {
    const res = await generateQuestionsAI(aiHost, store.state, m);
    act((d) => {
      const repairs: string[] = [];
      for (const q of res.value) {
        const clean = sanitizeQuestion(q, milestoneId, m.recommendedInteractionType, res.provider, repairs);
        if (clean) addQuestion(d, clean);
      }
    });
    toast(res.fallbackUsed ? "Added rubric-based prompts (offline)." : "Questions generated.");
  });
  return (
    <div className="card stack">
      <p className="text-2">{exhausted ? "You've answered every question, but mastery needs answers given without the full solution." : "This milestone has no questions yet."}</p>
      <div className="row">
        <button className="btn primary" onClick={generate} disabled={busy}>{busy ? <span className="spinner" /> : <Icon.spark />} Generate {exhausted ? "fresh " : ""}questions</button>
        <button className="btn" onClick={() => { act((d) => grantMastery(d, milestoneId, [], false, true, sessionId)); onMastered(); }}>I can do this — mark mastered</button>
      </div>
      <p className="tiny muted">Self-attested mastery is recorded as such and still gets retention checks when questions exist.</p>
      {milestoneQuestions(db, milestoneId).length === 0 && null}
    </div>
  );
}

function CompletionView({ milestoneId, sessionId, before, onChoose, onFinish, onBack }: {
  milestoneId: ID; sessionId: ID; before: { progress: number; open: Set<ID> } | null;
  onChoose: (id: ID) => void; onFinish: () => void; onBack: () => void;
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
        <button className="btn ghost small" onClick={onBack}><Icon.back /> Course</button>
        <button className="btn small" onClick={onFinish}>Finish session</button>
      </div>
      <div className="card stack rise" style={{ alignItems: "center", textAlign: "center", padding: "28px 16px", gap: 10 }}>
        <MasteryMark />
        <span className="eyebrow" style={{ color: "var(--mastered)" }}>Mastered</span>
        <h1>{m.title}</h1>
        <p className="text-2" style={{ maxWidth: 520 }}>You can now: {m.learningObjective}</p>
      </div>
      <ImmediateCheck milestoneId={milestoneId} sessionId={sessionId} />
      <div className="card stack" style={{ gap: 8 }}>
        <div className="row between small"><span className="text-2">{db.courses[m.courseId]?.title}</span><span className="mono">{p.requiredMastered}/{p.requiredTotal}</span></div>
        <Bar value={shown} mastered />
        {unlocked.length > 0 && (
          <div className="stack" style={{ gap: 4, marginTop: 6 }}>
            <span className="eyebrow">Unlocked</span>
            {unlocked.map((u, i) => <div key={u.id} className="row small rise" style={{ animationDelay: `${300 + i * 120}ms` }}><span style={{ color: "var(--accent)" }}>◆</span> {u.title}</div>)}
          </div>
        )}
      </div>
      <section className="stack">
        <h2>What's next?</h2>
        <NextOptions courseId={m.courseId} justCompletedId={milestoneId} sessionId={sessionId} onChoose={onChoose} compact />
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
