/**
 * Learner actions on the graph. All are plain mutations meant to run inside
 * `store.transact`, and each is logged as a raw event.
 */
import type { ID, LabDB } from "../domain/types";
import { logEvent } from "../engines/analytics";
import { L } from "../i18n";
import { importCurriculum } from "../engines/curriculumSpec";
import { courseSpecFor } from "./generate";
import type { KnowledgeGraph } from "./schema";
import { milestonesByLO } from "./state";

export function setSelfAttested(db: LabDB, loId: string, on: boolean, now = Date.now()): void {
  if (on) db.knowledge.selfAttested[loId] = { at: now };
  else delete db.knowledge.selfAttested[loId];
  logEvent(db, "CURRICULUM_EDIT", {}, { action: on ? "lo_self_attest" : "lo_self_attest_undo", lo: loId });
}

export function toggleGoal(db: LabDB, loId: string): boolean {
  const on = !db.knowledge.goals.includes(loId);
  db.knowledge.goals = on ? [...db.knowledge.goals, loId] : db.knowledge.goals.filter((g) => g !== loId);
  logEvent(db, "CURRICULUM_EDIT", {}, { action: on ? "lo_goal_add" : "lo_goal_remove", lo: loId });
  return on;
}

export function setPath(db: LabDB, pathId: string | undefined): void {
  db.knowledge.pathId = pathId;
  logEvent(db, "CURRICULUM_EDIT", {}, { action: "lo_path", path: pathId ?? null });
}

/** The course that already practises this object, if any. */
export function courseForObject(db: LabDB, loId: string): ID | undefined {
  return milestonesByLO(db).get(loId)?.[0]?.courseId;
}

/**
 * Creates a personal course for the object (and, if the learner chooses, its
 * missing prerequisites). The canonical graph is not changed.
 */
export function studyObjects(db: LabDB, g: KnowledgeGraph, loIds: string[], title?: string): ID {
  const first = g.objects[loIds[loIds.length - 1]] ?? g.objects[loIds[0]];
  if (!first) throw new Error(L("Object not found in the graph.", "Nesne grafikte bulunamadı."));
  const spec = courseSpecFor(g, loIds, title ?? first.title, `${first.title}: ${first.learningObjectives[0] ?? first.description}`);
  const report = importCurriculum(db, spec, {
    source: { kind: "REQUEST", text: `${L("Knowledge graph", "Bilgi grafiği")}: ${loIds.join(", ")}` },
    generatedBy: `graph:${g.version}`,
    subjectName: spec.subject,
  });
  db.courses[report.courseId].origin = { kind: "graph", loIds: [...loIds], title };
  logEvent(db, "CURRICULUM_EDIT", { courseId: report.courseId }, { action: "create_from_graph", lo: loIds, milestones: report.milestoneCount });
  return report.courseId;
}
