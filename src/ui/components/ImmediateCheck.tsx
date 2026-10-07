import { useState } from "react";
import type { ID } from "../../domain/types";
import { completeRetentionCheck } from "../../engines/progress";
import { act, store, useDB } from "../state";
import { QuestionCard } from "./QuestionCard";
import { L } from "../../i18n";

/**
 * Immediate understanding check right after mastery — no hints, a fresh
 * question. Separates "I just did it" from "I understand it"; delayed and
 * transfer checks follow later on the Retention screen.
 */
export function ImmediateCheck({ milestoneId, sessionId }: { milestoneId: ID; sessionId: ID }) {
  const db = useDB();
  const [checkId] = useState<ID | undefined>(() =>
    Object.values(store.state.retention).find((r) => r.milestoneId === milestoneId && r.kind === "IMMEDIATE" && !r.completedAt)?.id,
  );
  const [started, setStarted] = useState(false);
  const check = checkId ? db.retention[checkId] : undefined;
  if (!check) return null;
  const q = db.questions[check.questionId];
  if (!q) return null;

  if (check.completedAt) {
    return (
      <div className={`banner ${check.correct ? "ok" : "warn"} small`}>
        {check.correct
          ? L("Immediate check passed: you could do it again without help.", "Anında kontrol geçti: yardımsız tekrar yapabildin.")
          : L("The immediate check didn't go through. The milestone is marked for review — it'll come back, which is how things stick.", "Anında kontrol tutmadı. Adım tekrar için işaretlendi — yeniden karşına çıkacak; kalıcılık böyle oluşur.")}
      </div>
    );
  }
  if (!started) {
    return (
      <div className="card row between">
        <div className="stack" style={{ gap: 2 }}>
          <strong>{L("Quick check", "Hızlı kontrol")}</strong>
          <span className="small text-2">{L("One new question, no hints — to see whether it stuck.", "Yeni bir soru, ipucu yok — aklında kalmış mı diye.")}</span>
        </div>
        <div className="row nowrap">
          <button className="btn primary small" onClick={() => setStarted(true)}>{L("Check now", "Şimdi kontrol et")}</button>
        </div>
      </div>
    );
  }
  return (
    <QuestionCard question={q} sessionId={sessionId} purposeOverride="RETENTION" hideHelp
      onRecorded={(attemptId) => act((d) => completeRetentionCheck(d, check.id, d.attempts[attemptId]))}
      onNext={() => undefined} onMastered={() => undefined} />
  );
}
