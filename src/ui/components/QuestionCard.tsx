import { useEffect, useRef, useState } from "react";
import type { Feedback, HintLevel, InputMethod, Question } from "../../domain/types";
import { HINT_LEVELS } from "../../domain/types";
import { answerMode, evaluateAuto, evaluateSelf, type Answer, type Evaluation } from "../../engines/evaluation";
import { recordAttempt } from "../../engines/progress";
import { logEvent } from "../../engines/analytics";
import { act, aiHost, navigate, toast, useDB } from "../state";
import { explainConcept, generateHints } from "../../ai/tutor";
import { ErrorInsight, StuckCard } from "./Adaptive";
import { simplerQuestion, type StuckOption } from "../../adaptive/stuck";
import { skipMilestone } from "../../engines/progress";
import type { Conditions } from "../../engines/experiments";
import { INTERACTION_TR } from "../../engines/statistics";
import { AnswerInput } from "./AnswerInput";
import { CodeEditor, GraphPlot, SimulationPanel } from "./Widgets";
import { DrawingCanvas, type DrawingStats } from "./DrawingCanvas";
import { MathText } from "./MathText";
import { Icon } from "./common";
import { AIHelp, evaluateOpenWithAI, type AIEvalResult } from "./AIHelp";
import { L, lazyLabels, pick } from "../../i18n";

const WORKSPACE_KINDS = new Set(["DRAWING", "DIAGRAM", "PROBLEM_SOLVING", "DERIVATION", "PROOF"]);
const DRAW_ONLY = new Set(["DRAWING", "DIAGRAM"]);

const ERROR_LABEL: Record<string, string> = lazyLabels<string>({
  CONCEPTUAL: "Conceptual misunderstanding",
  PROCEDURAL: "Procedural error",
  CARELESS: "Careless slip",
  MISSING_PREREQUISITE: "Missing prerequisite",
  INCOMPLETE_EXPLANATION: "Incomplete explanation",
}, {
  CONCEPTUAL: "Kavramsal yanılgı",
  PROCEDURAL: "İşlem hatası",
  CARELESS: "Dikkatsizlik",
  MISSING_PREREQUISITE: "Eksik ön koşul",
  INCOMPLETE_EXPLANATION: "Eksik açıklama",
});

export interface QuestionOutcome {
  correct: boolean | null;
  masteredNow: boolean;
}

export function QuestionCard({
  question: q, sessionId, onNext, onMastered, onDifferent, onSwitchQuestion, purposeOverride, hideHelp, onRecorded, conditions = {},
}: {
  question: Question;
  sessionId: string;
  onNext: () => void;
  onMastered: () => void;
  onDifferent?: () => void;
  /** Move to a specific question (e.g. a simpler example when stuck). */
  onSwitchQuestion?: (questionId: string) => void;
  purposeOverride?: Question["purpose"];
  /** Retention checks hide hints by design. */
  hideHelp?: boolean;
  onRecorded?: (attemptId: string, correct: boolean | null) => void;
  /** Experiment conditions in force for this session. */
  conditions?: Conditions;
}) {
  const db = useDB();
  const m = db.milestones[q.milestoneId];
  const prefs = db.preferences;
  const hintCap = (conditions.hintCap ?? prefs.hintCap) as HintLevel;
  const minimalFeedback = conditions.feedbackDetail === "minimal";
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [code, setCode] = useState("");
  const [hintLevel, setHintLevel] = useState<HintLevel>(0);
  const [result, setResult] = useState<(Evaluation & { masteredNow: boolean; by: "auto" | "ai" | "self" }) | null>(null);
  const [rubricStep, setRubricStep] = useState<null | { met: boolean[]; ai?: AIEvalResult | null; aiBusy?: boolean }>(null);
  const [confidence, setConfidence] = useState<number | undefined>();
  const [showWorkspace, setShowWorkspace] = useState(conditions.workspaceOpen ?? WORKSPACE_KINDS.has(q.kind));
  const [drawing, setDrawing] = useState<{ stats: DrawingStats; image: () => string } | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptId, setLastAttemptId] = useState<string | null>(null);
  const [conceptNote, setConceptNote] = useState<string | null>(null);
  const input = useRef<InputMethod>("unknown");
  const usedStylus = useRef(false);
  const started = useRef(Date.now());
  const mode = answerMode(q);
  const isCode = q.kind === "CODE";
  const drawOnly = DRAW_ONLY.has(q.kind) && mode === "text";

  useEffect(() => {
    act((d) => logEvent(d, "QUESTION_SHOWN", { sessionId, milestoneId: q.milestoneId, questionId: q.id }, { kind: q.kind, purpose: purposeOverride ?? q.purpose }));
  }, [q.id, q.kind, q.milestoneId, q.purpose, purposeOverride, sessionId]);

  const seenMethods = useRef(new Set<InputMethod>());
  const noteInput = (mth: InputMethod) => {
    input.current = mth;
    if (mth === "pen") usedStylus.current = true;
    if (!seenMethods.current.has(mth) && mth !== "unknown") {
      // First use of each input method per question is a raw event (stylus/touch/keyboard analysis).
      seenMethods.current.add(mth);
      act((d) => logEvent(d, "INPUT", { sessionId, milestoneId: q.milestoneId, questionId: q.id }, { method: mth }));
    }
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
    setLastAttemptId(res.attempt.id);
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

  const [hintBusy, setHintBusy] = useState(false);
  const requestHint = async (level: HintLevel) => {
    if (level > hintCap && !confirm(L(`This goes past your usual help limit (level ${hintCap}). Struggling a little longer often helps learning stick. Show it anyway?`, `Bu, alışılmış yardım sınırının (düzey ${hintCap}) ötesinde. Biraz daha uğraşmak öğrenmenin kalıcı olmasına çoğu zaman yardım eder. Yine de gösterilsin mi?`))) return;
    if (level === 5 && attempts === 0 && !confirm(L("You haven't attempted this yet. Reveal the full solution anyway? Answers after seeing the solution won't count toward mastery.", "Bunu henüz denemedin. Tam çözüm yine de gösterilsin mi? Çözümü gördükten sonraki cevaplar ustalığa sayılmaz."))) return;
    let source = "authored";
    if (level <= 4 && !q.hints[level - 1]) {
      // No authored hint at this level: generate the ladder once (AI, guarded; generic offline) and keep it.
      setHintBusy(true);
      const res = await generateHints(aiHost, q, sessionId);
      act((d) => {
        const target = d.questions[q.id];
        if (target) target.hints = [...target.hints, ...res.value.slice(target.hints.length)].slice(0, 4);
      });
      setHintBusy(false);
      source = res.fallbackUsed ? "generic" : "ai";
    }
    setHintLevel(level);
    if (level === 5) setShowSolution(true);
    act((d) => logEvent(d, "HINT_REQUEST", { sessionId, milestoneId: q.milestoneId, questionId: q.id }, { level, label: HINT_LEVELS[level], attemptsBefore: attempts, source }));
  };

  // Stuck options: every one is an explicit choice; the solution is never shown by default.
  const onStuckOption = async (o: StuckOption) => {
    switch (o.kind) {
      case "TRY_AGAIN": if (result) retry(); break;
      case "SMALL_HINT": await requestHint(Math.min(4, hintLevel + 1) as HintLevel); break;
      case "CHANGE_STRATEGY": await requestHint(Math.max(3, Math.min(4, hintLevel + 1)) as HintLevel); break;
      case "SEE_SOLUTION": await requestHint(5); break;
      case "CONCEPT_EXPLANATION": {
        const res = await explainConcept(aiHost, db, q, sessionId);
        setConceptNote(res.value);
        break;
      }
      case "SIMPLER_EXAMPLE": {
        const id = simplerQuestion(db, q.milestoneId, q.id);
        if (id && onSwitchQuestion) onSwitchQuestion(id);
        else toast(L("No simpler question here yet — try the concept explanation or a prerequisite.", "Burada henüz daha basit soru yok — kavram açıklamasını ya da önkoşulu dene."));
        break;
      }
      case "CHECK_PREREQUISITE":
        if (o.target?.milestoneId) navigate(`/session/${o.target.milestoneId}`);
        else if (o.target?.loId) navigate(`/graph?lo=${encodeURIComponent(o.target.loId)}`);
        break;
      case "SKIP_TEMPORARILY":
        act((d) => skipMilestone(d, q.milestoneId, sessionId));
        toast(L("Skipped for now — it stays on the map.", "Şimdilik atlandı — haritada kalıyor."));
        if (m) navigate(`/course/${m.courseId}`);
        break;
    }
  };

  const purpose = purposeOverride ?? q.purpose;
  const canSubmit = !!effectiveAnswer() && !result && !rubricStep;

  return (
    <div className="card stack" style={{ gap: 14 }}
      onPointerDown={(e) => noteInput(e.pointerType === "pen" ? "pen" : e.pointerType === "touch" ? "touch" : "mouse")}
      onKeyDown={() => input.current !== "pen" && noteInput("keyboard")}>
      <div className="row between">
        <span className="eyebrow">{purpose === "PRACTICE" ? L("Warm-up", "Isınma") : purpose === "MASTERY" ? L("Mastery question", "Ustalık sorusu") : purpose === "RETENTION" ? L("Retention check", "Kalıcılık kontrolü") : L("Transfer check", "Transfer kontrolü")} · {INTERACTION_TR[q.kind] ?? q.kind}</span>
        {attempts > 0 && <span className="tiny muted">{L(`attempt ${attempts + (result ? 0 : 1)}`, `${attempts + (result ? 0 : 1)}. deneme`)}</span>}
      </div>
      <MathText text={q.prompt} className="serif" style={{ fontSize: "1.15rem", lineHeight: 1.45 }} />
      {q.graph && <GraphPlot spec={q.graph} />}
      {q.simulation && <SimulationPanel spec={q.simulation} onInteract={() => noteInput(input.current)} />}

      {!drawOnly && (
        <button type="button" className="btn ghost small" style={{ alignSelf: "flex-start" }} onClick={() => setShowWorkspace(!showWorkspace)}>
          <Icon.edit /> {WORKSPACE_KINDS.has(q.kind)
            ? (showWorkspace ? L("Hide workspace", "Çalışma alanını gizle") : L("Open workspace", "Çalışma alanını aç"))
            : (showWorkspace ? L("Hide scratch space", "Karalama alanını gizle") : L("Open scratch space", "Karalama alanını aç"))}
        </button>
      )}
      {(showWorkspace || drawOnly) && (
        <DrawingCanvas
          label={drawOnly ? L("Draw your answer", "Cevabını çiz") : L("Workspace (not graded)", "Çalışma alanı (puanlanmaz)")} height={drawOnly ? 380 : 300} onInput={noteInput}
          onChange={(stats, image) => setDrawing({ stats, image })}
        />
      )}

      {isCode ? (
        <CodeEditor value={code} onChange={setCode} disabled={!!result} />
      ) : (
        <div onPointerDown={(e) => noteInput(e.pointerType === "pen" ? "pen" : e.pointerType === "touch" ? "touch" : "mouse")}>
          {drawOnly ? (
            <textarea className="textarea" style={{ minHeight: 70 }} placeholder={L("Optional: label or explain your drawing", "İsteğe bağlı: çizimini etiketle ya da açıkla")} aria-label={L("Drawing notes", "Çizim notları")} disabled={!!result}
              value={answer?.kind === "text" ? answer.text : ""} onChange={(e) => setAnswer({ kind: "text", text: e.target.value })} />
          ) : (
            <AnswerInput question={q} value={answer} onChange={setAnswer} disabled={!!result || !!rubricStep} onSubmit={() => canSubmit && submit()} />
          )}
        </div>
      )}

      {!result && !rubricStep && (
        <>
          <div className="row" style={{ gap: 6 }}>
            <span className="small muted">{L("Confidence", "Eminlik")}</span>
            {[1, 2, 3, 4, 5].map((c) => (
              <button key={c} type="button" className="btn small" aria-pressed={confidence === c} onClick={() => setConfidence(confidence === c ? undefined : c)}
                style={{ minWidth: 40, borderColor: confidence === c ? "var(--accent)" : undefined, background: confidence === c ? "var(--accent-soft)" : undefined }}>{c}</button>
            ))}
          </div>
          <div className="row">
            <button className="btn primary grow" disabled={!canSubmit} onClick={submit}>{L("Check", "Kontrol et")}</button>
          </div>
        </>
      )}

      {rubricStep && (
        <div className="card raised stack rise" style={{ gap: 10 }}>
          <span className="eyebrow">{L("Evaluate against the rubric", "Ölçütlere göre değerlendir")}</span>
          <p className="small text-2">{L("Tick each point your answer genuinely contains. Be strict — this is for you.", "Cevabının gerçekten içerdiği her maddeyi işaretle. Sıkı ol — bu senin için.")}</p>
          {q.rubric.map((r, i) => (
            <label key={i} className="row nowrap" style={{ alignItems: "flex-start", cursor: "pointer" }}>
              <input type="checkbox" checked={rubricStep.met[i]} style={{ width: 22, height: 22, flex: "none", marginTop: 2 }}
                onChange={(e) => setRubricStep({ ...rubricStep, met: rubricStep.met.map((x, j) => (j === i ? e.target.checked : x)) })} />
              <span>{r}</span>
            </label>
          ))}
          {rubricStep.ai && <div className="banner info small">{L("AI evaluator: ", "YZ değerlendirmesi: ")}{rubricStep.ai.feedback.message} <span className="muted">{L("(you can change any tick)", "(her işareti değiştirebilirsin)")}</span></div>}
          {rubricStep.ai === null && <div className="banner warn small">{L("The AI evaluator is unavailable — please self-assess.", "YZ değerlendiricisi kullanılamıyor — lütfen kendin değerlendir.")}</div>}
          <div className="row">
            <button className="btn" onClick={askAI} disabled={rubricStep.aiBusy}>{rubricStep.aiBusy ? <><span className="spinner" /> {L("Evaluating…", "Değerlendiriliyor…")}</> : L("Ask AI to evaluate", "YZ değerlendirsin")}</button>
            <button className="btn primary grow" onClick={confirmRubric}>{L("Confirm", "Onayla")}</button>
          </div>
        </div>
      )}

      {result && <FeedbackPanel result={result} minimal={minimalFeedback} />}
      {result && result.correct === false && lastAttemptId && !minimalFeedback && (
        <ErrorInsight attemptId={lastAttemptId} answerText={mode === "text" ? (effectiveAnswer() as { text?: string } | null)?.text : undefined} />
      )}

      {result && (
        <div className="row">
          {result.masteredNow ? (
            <button className="btn primary grow" onClick={onMastered}>{L("Milestone mastered — continue", "Adımda ustalaştın — devam")} <Icon.arrow /></button>
          ) : result.correct ? (
            <button className="btn primary grow" onClick={onNext}>{L("Next", "Sonraki")} <Icon.arrow /></button>
          ) : (
            <>
              <button className="btn primary grow" onClick={retry}>{L("Try again", "Tekrar dene")}</button>
              {onDifferent && <button className="btn" onClick={onDifferent}>{L("Different question", "Başka soru")}</button>}
            </>
          )}
          {(result.correct || hintLevel >= 5) && q.solution && <button className="btn ghost" onClick={() => setShowSolution(!showSolution)}>{showSolution ? L("Hide solution", "Çözümü gizle") : L("Worked solution", "Ayrıntılı çözüm")}</button>}
        </div>
      )}

      {!hideHelp && attempts > 0 && !result?.correct && (
        <StuckCard milestoneId={q.milestoneId} questionId={q.id} sessionId={sessionId} onOption={(o) => void onStuckOption(o)} />
      )}
      {conceptNote && (
        <div className="card raised small rise">
          <span className="eyebrow">{L("The idea behind it", "Arkasındaki fikir")}</span>
          <MathText text={conceptNote} className="text-2" style={{ marginTop: 4 }} />
        </div>
      )}
      {!hideHelp && (
        <HelpLadder q={q} level={hintLevel} cap={hintCap} onRequest={requestHint} attempts={attempts} busy={hintBusy} />
      )}
      {!hideHelp && conditions.guide !== false && <AIHelp question={q} sessionId={sessionId} answerText={effectiveAnswer()?.kind === "text" ? (effectiveAnswer() as { text: string }).text : JSON.stringify(effectiveAnswer() ?? "")} attempts={attempts} lastFeedback={result?.feedback} />}

      {showSolution && q.solution && (
        <div className="card raised rise">
          <span className="eyebrow">{L("Worked solution", "Ayrıntılı çözüm")}</span>
          <MathText text={q.solution} className="text-2" style={{ marginTop: 6 }} />
        </div>
      )}
    </div>
  );
}

function FeedbackPanel({ result, minimal }: { result: Evaluation & { by: string }; minimal?: boolean }) {
  const f = result.feedback;
  if (minimal) {
    // Experiment condition: correctness only, no explanation or error classification.
    return (
      <div className={`banner ${result.correct ? "ok" : "error"} rise`} role="status" aria-live="polite">
        <strong>{result.correct ? L("Correct", "Doğru") : L("Not yet", "Henüz değil")}</strong>
      </div>
    );
  }
  const tone = f.correctness === "CORRECT" ? "ok" : f.correctness === "PARTIAL" ? "warn" : f.correctness === "UNGRADED" ? "info" : "error";
  const title = f.correctness === "CORRECT" ? L("Correct", "Doğru") : f.correctness === "PARTIAL" ? (result.correct ? L("Good enough to count — with gaps", "Sayılacak kadar iyi — eksikleri var") : L("Partly there", "Kısmen doğru")) : f.correctness === "UNGRADED" ? L("Recorded", "Kaydedildi") : L("Not yet", "Henüz değil");
  return (
    <div className={`banner ${tone} stack rise`} style={{ gap: 6 }} role="status" aria-live="polite">
      <div className="row between"><strong>{title}</strong><span className="tiny muted">{result.by === "auto" ? L("checked automatically", "otomatik kontrol") : result.by === "ai" ? L("AI-evaluated", "YZ değerlendirdi") : L("self-assessed", "öz değerlendirme")}</span></div>
      <span>{f.message}</span>
      <div className="row" style={{ gap: 6 }}>
        {f.errorTypes.map((e) => <span key={e} className="chip">{ERROR_LABEL[e] ?? e}</span>)}
        {f.reasoningQuality !== "UNKNOWN" && <span className="chip">{L("reasoning: ", "akıl yürütme: ")}{pick({ STRONG: "strong", ADEQUATE: "adequate", WEAK: "weak" }, { STRONG: "güçlü", ADEQUATE: "yeterli", WEAK: "zayıf" })[f.reasoningQuality]}</span>}
      </div>
      {f.successfulStrategy && <span className="small">{L("What worked: ", "İşe yarayan: ")}{f.successfulStrategy}</span>}
      {f.correctness !== "CORRECT" && f.errorTypes.includes("MISSING_PREREQUISITE") && <span className="small">{L("A prerequisite may need review — see the context panel above.", "Bir ön koşulun tekrarı gerekebilir — yukarıdaki bağlam paneline bak.")}</span>}
    </div>
  );
}

function HelpLadder({ q, level, cap, onRequest, attempts, busy }: { q: Question; level: HintLevel; cap: HintLevel; onRequest: (l: HintLevel) => void; attempts: number; busy: boolean }) {
  const next = (level + 1) as HintLevel;
  const labels = pick(["", "Small hint", "Conceptual hint", "Strategic hint", "Partial guidance", "Full solution"], ["", "Küçük ipucu", "Kavramsal ipucu", "Stratejik ipucu", "Kısmi yönlendirme", "Tam çözüm"]);
  // Levels 1–4 are always available (generated on demand when not authored).
  const available = (l: number) => (l <= 4 ? true : !!q.solution);
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
          <button type="button" className="btn ghost small" disabled={busy} onClick={() => onRequest(next)}>
            {busy ? <span className="spinner" /> : <Icon.bulb />} {labels[next]}{next > cap ? L(" (beyond your limit)", " (sınırının ötesinde)") : ""}
          </button>
          {next <= 4 && available(5) && level >= 3 && attempts > 0 && (
            <button type="button" className="btn ghost small" onClick={() => onRequest(5)}>{L("Show full solution", "Tam çözümü göster")}</button>
          )}
          <span className="tiny muted">{L("help level", "yardım düzeyi")} {level} / 5</span>
        </div>
      )}
    </div>
  );
}
