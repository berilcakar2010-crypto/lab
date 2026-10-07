import { useMemo, useState } from "react";
import type { ID } from "../../domain/types";
import { courseUnits } from "../../engines/curriculum";
import { applyCalibration, diagnosticPlan, estimateStart, type CalibrationResult } from "../../engines/progression";
import { evaluateAuto, type Answer } from "../../engines/evaluation";
import { act, toast, useDB } from "../state";
import { AnswerInput } from "../components/AnswerInput";
import { Sheet } from "../components/common";
import { MathText } from "../components/MathText";

type Step = "rate" | "diagnose" | "result";

export function CalibrationSheet({ courseId, onClose }: { courseId: ID; onClose: () => void }) {
  const db = useDB();
  const units = courseUnits(db, courseId);
  const plan = useMemo(() => diagnosticPlan(db, courseId), [db, courseId]);
  const [step, setStep] = useState<Step>("rate");
  const [ratings, setRatings] = useState<Record<ID, 0 | 1 | 2>>({});
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [results, setResults] = useState<Record<ID, boolean>>({});
  const [result, setResult] = useState<CalibrationResult | null>(null);
  const [skipKnown, setSkipKnown] = useState(false);

  const finish = (diag: Record<ID, boolean>) => {
    setResult(estimateStart(db, courseId, { selfRatings: ratings, diagnostic: diag }));
    setStep("result");
  };

  const submitDiag = (skip = false) => {
    const item = plan[index];
    const q = db.questions[item.questionId];
    const next = { ...results };
    if (!skip && answer) next[item.milestoneId] = !!evaluateAuto(q, answer).correct;
    else next[item.milestoneId] = false;
    setResults(next);
    setAnswer(null);
    if (index + 1 < plan.length) setIndex(index + 1);
    else finish(next);
  };

  const apply = () => {
    if (!result) return;
    act((d) => applyCalibration(d, courseId, result, skipKnown));
    toast(result.startHereId ? "Starting point set. You can always choose differently." : "Calibration saved.");
    onClose();
  };

  return (
    <Sheet title="Find your starting point" onClose={onClose}>
      {step === "rate" && (
        <div className="stack">
          <p className="text-2">How familiar is each part? This only shapes the recommendation — nothing is locked or marked as mastered.</p>
          {units.map((u) => (
            <div key={u.id} className="card raised stack" style={{ gap: 8 }}>
              <strong>{u.title}</strong>
              <div className="row" style={{ gap: 6 }}>
                {(["New to me", "Some exposure", "Confident"] as const).map((label, i) => (
                  <button key={label} className="btn small" onClick={() => setRatings({ ...ratings, [u.id]: i as 0 | 1 | 2 })}
                    style={{ borderColor: ratings[u.id] === i ? "var(--accent)" : undefined, background: ratings[u.id] === i ? "var(--accent-soft)" : undefined }}>{label}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="row">
            <button className="btn" onClick={() => finish({})}>Skip the questions</button>
            <button className="btn primary grow" onClick={() => (plan.length ? setStep("diagnose") : finish({}))}>
              {plan.length ? `Answer ${plan.length} quick diagnostic questions` : "See recommendation"}
            </button>
          </div>
        </div>
      )}
      {step === "diagnose" && plan[index] && (
        <div className="stack">
          <div className="row between"><span className="eyebrow">Diagnostic {index + 1} / {plan.length}</span><span className="small muted">{db.milestones[plan[index].milestoneId]?.title}</span></div>
          <MathText className="serif" style={{ fontSize: "1.1rem" }} text={db.questions[plan[index].questionId].prompt} />
          <AnswerInput question={db.questions[plan[index].questionId]} value={answer} onChange={setAnswer} onSubmit={() => answer && submitDiag()} />
          <div className="row">
            <button className="btn" onClick={() => submitDiag(true)}>I don't know yet</button>
            <button className="btn primary grow" disabled={!answer} onClick={() => submitDiag()}>Next</button>
          </div>
          <p className="tiny muted">No feedback here on purpose — this only estimates where to begin.</p>
        </div>
      )}
      {step === "result" && result && (
        <div className="stack">
          {result.startHereId ? (
            <div className="card accent stack" style={{ gap: 6 }}>
              <span className="eyebrow">Start here</span>
              <h3>{db.milestones[result.startHereId]?.title}</h3>
              <p className="small text-2">{db.milestones[result.startHereId]?.learningObjective}</p>
            </div>
          ) : (
            <div className="banner ok">Everything appears familiar.</div>
          )}
          <ul className="small text-2" style={{ margin: 0, paddingLeft: 18 }}>
            {result.rationale.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          {result.likelyKnown.length > 0 && (
            <label className="row nowrap card raised" style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={skipKnown} onChange={(e) => setSkipKnown(e.target.checked)} style={{ width: 20, height: 20 }} />
              <span className="small">Skip the {result.likelyKnown.length} milestones that look familiar. They stay in the map as <em>skipped</em> — not mastered — and you can return to them anytime.</span>
            </label>
          )}
          <div className="row">
            <button className="btn" onClick={onClose}>Not now</button>
            <button className="btn primary grow" onClick={apply}>Use this starting point</button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
