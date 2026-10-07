import { useEffect, useRef, useState } from "react";
import type { Feedback, HintLevel, InputMethod, Question } from "../../domain/types";
import { HINT_LEVELS } from "../../domain/types";
import { answerMode, evaluateAuto, evaluateSelf, type Answer, type Evaluation } from "../../engines/evaluation";
import { recordAttempt } from "../../engines/progress";
import { logEvent } from "../../engines/analytics";
import { act, useDB } from "../state";
import { AnswerInput } from "./AnswerInput";
import { CodeEditor, GraphPlot, SimulationPanel } from "./Widgets";
import { DrawingCanvas, type DrawingStats } from "./DrawingCanvas";
import { MathText } from "./MathText";
import { Icon } from "./common";
import { AIHelp, evaluateOpenWithAI, type AIEvalResult } from "./AIHelp";

const WORKSPACE_KINDS = new Set(["DRAWING", "DIAGRAM", "PROBLEM_SOLVING", "DERIVATION", "PROOF"]);
const DRAW_ONLY = new Set(["DRAWING", "DIAGRAM"]);

const ERROR_LABEL: Record<string, string> = {
  CONCEPTUAL: "Conceptual misunderstanding",
  PROCEDURAL: "Procedural error",
  CARELESS: "Careless slip",
  MISSING_PREREQUISITE: "Missing prerequisite",
  INCOMPLETE_EXPLANATION: "Incomplete explanation",
};

export interface QuestionOutcome {
  correct: boolean | null;
  masteredNow: boolean;
}

export function QuestionCard({
  question: q, sessionId, onNext, onMastered, onDifferent, purposeOverride, hideHelp, onRecorded,
}: {
  question: Question;
  sessionId: string;
  onNext: () => void;
  onMastered: () => void;
  onDifferent?: () => void;
  purposeOverride?: Question["purpose"];
  /** Retention checks hide hints by design. */
  hideHelp?: boolean;
  onRecorded?: (attemptId: string, correct: boolean | null) => void;
}) {
  const db = useDB();
  const m = db.milestones[q.milestoneId];
  const prefs = db.preferences;
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [code, setCode] = useState("");
  const [hintLevel, setHintLevel] = useState<HintLevel>(0);
  const [result, setResult] = useState<(Evaluation & { masteredNow: boolean; by: "auto" | "ai" | "self" }) | null>(null);
  const [rubricStep, setRubricStep] = useState<null | { met: boolean[]; ai?: AIEvalResult | null; aiBusy?: boolean }>(null);
  const [confidence, setConfidence] = useState<number | undefined>();
  const [showWorkspace, setShowWorkspace] = useState(WORKSPACE_KINDS.has(q.kind));
  const [drawing, setDrawing] = useState<{ stats: DrawingStats; image: () => string } | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const input = useRef<InputMethod>("unknown");
  const usedStylus = useRef(false);
  const started = useRef(Date.now());
  const mode = answerMode(q);
  const isCode = q.kind === "CODE";
  const drawOnly = DRAW_ONLY.has(q.kind) && mode === "text";

  useEffect(() => {
    act((d) => logEvent(d, "QUESTION_SHOWN", { sessionId, milestoneId: q.milestoneId, questionId: q.id }, { kind: q.kind, purpose: purposeOverride ?? q.purpose }));
  }, [q.id, q.kind, q.milestoneId, q.purpose, purposeOverride, sessionId]);

  const noteInput = (mth: InputMethod) => {
    input.current = mth;
    if (mth === "pen") usedStylus.current = true;
  };

  const effectiveAnswer = (): Answer | null => {
    if (isCode) return code.trim() ? { kind: "text", text: code } : null;
    if (drawOnly) return drawing?.stats.strokes ? { kind: "text", text: answer?.kind === "text" ? answer.text : "", drawing: "drawing" } : answer;
    return answer;
  };

  const record = (ev: Evaluation, by: "auto" | "ai" | "self", extra?: Partial<Feedback>) => {
    const a = effectiveAnswer();
    const stored = a?.kind === "text" ? { kind: "text", text: a.text.slice(0, 4000), hasDrawing: !!drawing?.stats.strokes, drawingStrokes: drawing?.stats.strokes ?? 0 } : a;
    const res = act((d) =>
      recordAttempt(d, {
        questionId: q.id, milestoneId: q.milestoneId, sessionId, answer: stored, correct: ev.correct, score: ev.score,
        feedback: { ...ev.feedback, ...extra }, hintLevelUsed: hintLevel, evaluatedBy: by, inputMethod: input.current,
        usedStylus: usedStylus.current || (drawing?.stats.penStrokes ?? 0) > 0, confidence, durationMs: Date.now() - started.current,
        purpose: purposeOverride ?? q.purpose,
      }),
    );
    setAttempts((n) => n + 1);
    setResult({ ...ev, feedback: { ...ev.feedback, ...extra }, masteredNow: res.masteredNow, by });
    onRecorded?.(res.attempt.id, ev.correct);
  };

  const submit = () => {
    const a = effectiveAnswer();
    if (!a) return;
    if (mode !== "text") {
      record(evaluateAuto(q, a), "auto");
    } else {
      setRubricStep({ met: q.rubric.map(() => false) });
    }
  };

  const askAI = async () => {
    if (!rubricStep) return;
    setRubricStep({ ...rubricStep, aiBusy: true });
    const a = effectiveAnswer();
    const ai = await evaluateOpenWithAI(q, a?.kind === "text" ? a.text : "", drawing?.image(), sessionId);
    setRubricStep((r) => (r ? { ...r, aiBusy: false, ai, met: ai?.met ?? r.met } : r));
  };

  const confirmRubric = () => {
    if (!rubricStep) return;
    const minScore = m?.masteryCriteria.minScore ?? 0.7;
    const ev = evaluateSelf(q, rubricStep.met, minScore);
    if (rubricStep.ai) {
      record({ ...ev, feedback: { ...ev.feedback, ...rubricStep.ai.feedback, correctness: ev.feedback.correctness } }, "ai");
    } else record(ev, "self");
    setRubricStep(null);
  };

  const retry = () => {
    setResult(null);
    started.current = Date.now();
    act((d) => logEvent(d, "INPUT", { sessionId, milestoneId: q.milestoneId, questionId: q.id }, { action: "retry_requested" }));
  };

  const requestHint = (level: HintLevel) => {
    if (level > prefs.hintCap && !confirm(`This goes past your usual help limit (level ${prefs.hintCap}). Struggling a little longer often helps learning stick. Show it anyway?`)) return;
    if (level === 5 && attempts === 0 && !confirm("You haven't attempted this yet. Reveal the full solution anyway? Answers after seeing the solution won't count toward mastery.")) return;
    setHintLevel(level);
    if (level === 5) setShowSolution(true);
    act((d) => logEvent(d, "HINT_REQUEST", { sessionId, milestoneId: q.milestoneId, questionId: q.id }, { level, label: HINT_LEVELS[level], attemptsBefore: attempts, source: "authored" }));
  };

  const purpose = purposeOverride ?? q.purpose;
  const canSubmit = !!effectiveAnswer() && !result && !rubricStep;

  return (
    <div className="card stack" style={{ gap: 14 }}
      onPointerDown={(e) => noteInput(e.pointerType === "pen" ? "pen" : e.pointerType === "touch" ? "touch" : "mouse")}
      onKeyDown={() => input.current !== "pen" && noteInput("keyboard")}>
      <div className="row between">
        <span className="eyebrow">{purpose === "PRACTICE" ? "Warm-up" : purpose === "MASTERY" ? "Mastery question" : purpose === "RETENTION" ? "Retention check" : "Transfer check"} · {q.kind.replace(/_/g, " ").toLowerCase()}</span>
        {attempts > 0 && <span className="tiny muted">attempt {attempts + (result ? 0 : 1)}</span>}
      </div>
      <MathText text={q.prompt} className="serif" style={{ fontSize: "1.15rem", lineHeight: 1.45 }} />
      {q.graph && <GraphPlot spec={q.graph} />}
      {q.simulation && <SimulationPanel spec={q.simulation} onInteract={() => noteInput(input.current)} />}

      {!drawOnly && (
        <button type="button" className="btn ghost small" style={{ alignSelf: "flex-start" }} onClick={() => setShowWorkspace(!showWorkspace)}>
          <Icon.edit /> {showWorkspace ? "Hide" : "Open"} {WORKSPACE_KINDS.has(q.kind) ? "workspace" : "scratch space"}
        </button>
      )}
      {(showWorkspace || drawOnly) && (
        <DrawingCanvas
          label={drawOnly ? "Draw your answer" : "Workspace (not graded)"} height={drawOnly ? 380 : 300} onInput={noteInput}
          onChange={(stats, image) => setDrawing({ stats, image })}
        />
      )}

      {isCode ? (
        <CodeEditor value={code} onChange={setCode} disabled={!!result} />
      ) : (
        <div onPointerDown={(e) => noteInput(e.pointerType === "pen" ? "pen" : e.pointerType === "touch" ? "touch" : "mouse")}>
          {drawOnly ? (
            <textarea className="textarea" style={{ minHeight: 70 }} placeholder="Optional: label or explain your drawing" aria-label="Drawing notes" disabled={!!result}
              value={answer?.kind === "text" ? answer.text : ""} onChange={(e) => setAnswer({ kind: "text", text: e.target.value })} />
          ) : (
            <AnswerInput question={q} value={answer} onChange={setAnswer} disabled={!!result || !!rubricStep} onSubmit={() => canSubmit && submit()} />
          )}
        </div>
      )}

      {!result && !rubricStep && (
        <>
          <div className="row" style={{ gap: 6 }}>
            <span className="small muted">Confidence</span>
            {[1, 2, 3, 4, 5].map((c) => (
              <button key={c} type="button" className="btn small" aria-pressed={confidence === c} onClick={() => setConfidence(confidence === c ? undefined : c)}
                style={{ minWidth: 40, borderColor: confidence === c ? "var(--accent)" : undefined, background: confidence === c ? "var(--accent-soft)" : undefined }}>{c}</button>
            ))}
          </div>
          <div className="row">
            <button className="btn primary grow" disabled={!canSubmit} onClick={submit}>Check</button>
          </div>
        </>
      )}

      {rubricStep && (
        <div className="card raised stack rise" style={{ gap: 10 }}>
          <span className="eyebrow">Evaluate against the rubric</span>
          <p className="small text-2">Tick each point your answer genuinely contains. Be strict — this is for you.</p>
          {q.rubric.map((r, i) => (
            <label key={i} className="row nowrap" style={{ alignItems: "flex-start", cursor: "pointer" }}>
              <input type="checkbox" checked={rubricStep.met[i]} style={{ width: 22, height: 22, flex: "none", marginTop: 2 }}
                onChange={(e) => setRubricStep({ ...rubricStep, met: rubricStep.met.map((x, j) => (j === i ? e.target.checked : x)) })} />
              <span>{r}</span>
            </label>
          ))}
          {rubricStep.ai && <div className="banner info small">AI evaluator: {rubricStep.ai.feedback.message} <span className="muted">(you can change any tick)</span></div>}
          {rubricStep.ai === null && <div className="banner warn small">The AI evaluator is unavailable — please self-assess.</div>}
          <div className="row">
            <button className="btn" onClick={askAI} disabled={rubricStep.aiBusy}>{rubricStep.aiBusy ? <><span className="spinner" /> Evaluating…</> : "Ask AI to evaluate"}</button>
            <button className="btn primary grow" onClick={confirmRubric}>Confirm</button>
          </div>
        </div>
      )}

      {result && <FeedbackPanel result={result} />}

      {result && (
        <div className="row">
          {result.masteredNow ? (
            <button className="btn primary grow" onClick={onMastered}>Milestone mastered — continue <Icon.arrow /></button>
          ) : result.correct ? (
            <button className="btn primary grow" onClick={onNext}>Next <Icon.arrow /></button>
          ) : (
            <>
              <button className="btn primary grow" onClick={retry}>Try again</button>
              {onDifferent && <button className="btn" onClick={onDifferent}>Different question</button>}
            </>
          )}
          {(result.correct || hintLevel >= 5) && q.solution && <button className="btn ghost" onClick={() => setShowSolution(!showSolution)}>{showSolution ? "Hide" : "Worked"} solution</button>}
        </div>
      )}

      {!hideHelp && (
        <HelpLadder q={q} level={hintLevel} cap={prefs.hintCap} onRequest={requestHint} attempts={attempts} />
      )}
      {!hideHelp && <AIHelp question={q} sessionId={sessionId} answerText={effectiveAnswer()?.kind === "text" ? (effectiveAnswer() as { text: string }).text : JSON.stringify(effectiveAnswer() ?? "")} attempts={attempts} lastFeedback={result?.feedback} />}

      {showSolution && q.solution && (
        <div className="card raised rise">
          <span className="eyebrow">Worked solution</span>
          <MathText text={q.solution} className="text-2" style={{ marginTop: 6 }} />
        </div>
      )}
    </div>
  );
}

function FeedbackPanel({ result }: { result: Evaluation & { by: string } }) {
  const f = result.feedback;
  const tone = f.correctness === "CORRECT" ? "ok" : f.correctness === "PARTIAL" ? "warn" : f.correctness === "UNGRADED" ? "info" : "error";
  const title = f.correctness === "CORRECT" ? "Correct" : f.correctness === "PARTIAL" ? (result.correct ? "Good enough to count — with gaps" : "Partly there") : f.correctness === "UNGRADED" ? "Recorded" : "Not yet";
  return (
    <div className={`banner ${tone} stack rise`} style={{ gap: 6 }} role="status" aria-live="polite">
      <div className="row between"><strong>{title}</strong><span className="tiny muted">{result.by === "auto" ? "checked automatically" : result.by === "ai" ? "AI-evaluated" : "self-assessed"}</span></div>
      <span>{f.message}</span>
      <div className="row" style={{ gap: 6 }}>
        {f.errorTypes.map((e) => <span key={e} className="chip">{ERROR_LABEL[e] ?? e}</span>)}
        {f.reasoningQuality !== "UNKNOWN" && <span className="chip">reasoning: {f.reasoningQuality.toLowerCase()}</span>}
      </div>
      {f.successfulStrategy && <span className="small">What worked: {f.successfulStrategy}</span>}
      {f.correctness !== "CORRECT" && f.errorTypes.includes("MISSING_PREREQUISITE") && <span className="small">A prerequisite may need review — see the context panel above.</span>}
    </div>
  );
}

function HelpLadder({ q, level, cap, onRequest, attempts }: { q: Question; level: HintLevel; cap: HintLevel; onRequest: (l: HintLevel) => void; attempts: number }) {
  const next = (level + 1) as HintLevel;
  const labels = ["", "Small hint", "Conceptual hint", "Strategic hint", "Partial guidance", "Full solution"];
  const available = (l: number) => (l <= 4 ? !!q.hints[l - 1] : !!q.solution);
  return (
    <div className="stack" style={{ gap: 8 }}>
      {level > 0 && (
        <div className="stack" style={{ gap: 6 }}>
          {q.hints.slice(0, Math.min(level, 4)).map((h, i) => (
            <div key={i} className="card raised small rise" style={{ padding: 12 }}>
              <span className="eyebrow">{labels[i + 1]}</span>
              <MathText text={h} className="text-2" style={{ marginTop: 4 }} />
            </div>
          ))}
        </div>
      )}
      {level < 5 && available(next) && (
        <div className="row">
          <button type="button" className="btn ghost small" onClick={() => onRequest(next)}>
            <Icon.bulb /> {labels[next]}{next > cap ? " (beyond your limit)" : ""}
          </button>
          {next <= 4 && available(5) && level >= 3 && attempts > 0 && (
            <button type="button" className="btn ghost small" onClick={() => onRequest(5)}>Show full solution</button>
          )}
          <span className="tiny muted">help level {level} / 5</span>
        </div>
      )}
    </div>
  );
}
