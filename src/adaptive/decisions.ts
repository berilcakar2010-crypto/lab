/**
 * Decision log: critical decisions made by Lab's engines or by an AI model are
 * kept with their reason, confidence and evidence so the learner (and an
 * export) can always see why something was suggested. The log is capped so it
 * cannot grow without bound on a phone.
 */
import type { AIProviderId, AIRole, LabDB, Millis } from "../domain/types";
import type { DecisionRecord } from "../domain/adaptive";
import { newId } from "../data/ids";

export const DECISION_CAP = 2000;

export function recordDecision(
  db: LabDB,
  d: { role: AIRole; decision: string; reason: string; confidence: number; evidence?: string[]; provider?: AIProviderId | "engine"; fallbackUsed?: boolean; ref?: string },
  now: Millis = Date.now(),
): DecisionRecord {
  const rec: DecisionRecord = {
    id: newId("dec"),
    role: d.role,
    decision: d.decision,
    reason: d.reason,
    confidence: Math.max(0, Math.min(1, d.confidence)),
    evidence: d.evidence ?? [],
    provider: d.provider ?? "engine",
    fallbackUsed: d.fallbackUsed ?? false,
    ref: d.ref,
    createdAt: now,
  };
  db.decisions[rec.id] = rec;
  const ids = Object.keys(db.decisions);
  if (ids.length > DECISION_CAP) {
    const oldest = Object.values(db.decisions).sort((a, b) => a.createdAt - b.createdAt).slice(0, ids.length - DECISION_CAP);
    for (const o of oldest) delete db.decisions[o.id];
  }
  return rec;
}

export const decisionsFor = (db: LabDB, ref: string) =>
  Object.values(db.decisions).filter((d) => d.ref === ref).sort((a, b) => b.createdAt - a.createdAt);
