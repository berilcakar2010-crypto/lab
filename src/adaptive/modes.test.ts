import { describe, expect, it } from "vitest";
import { kit, answer, T0, DAY } from "./testkit";
import { examConstraints, normalizeMode, planExamPath, setExamPriority, setStudyMode } from "./modes";
import { addExam, examPlan } from "../study/exams";
import { getBaseGraph } from "../knowledge/graph";

const g = getBaseGraph();

function withExam() {
  const k = kit(["phys.mech.newton", "phys.mech.momentum", "phys.waves.basics"].filter((id) => g.objects[id]), { kinds: ["NUMERIC", "NUMERIC"] });
  const los = Object.keys(k.ms);
  const exam = addExam(k.db, { title: "Physics exam", subject: "Physics", kind: "EXAM", date: T0 + 20 * DAY, loIds: los, notes: "", remindDays: [1] }, T0);
  return { k, exam, los };
}

describe("normal vs exam mode", () => {
  it("switches mode with an exam, never changes the curriculum, and ends after the exam", () => {
    const { k, exam } = withExam();
    const before = JSON.stringify([k.db.milestones, k.db.questions, k.db.knowledge.overlay]);
    expect(setStudyMode(k.db, "EXAM", exam.id, T0)).toBe(true);
    expect(k.db.preferences.studyMode).toBe("EXAM");
    const c = examConstraints(k.db, g, T0)!;
    expect(c.daysLeft).toBe(20);
    expect(c.coverage).toBe(0);
    expect(c.practice.length).toBeGreaterThan(0);
    expect(c.advice).toMatch(/Suggestion|Öneri|Coverage|Kapsam/);
    expect(JSON.stringify([k.db.milestones, k.db.questions, k.db.knowledge.overlay])).toBe(before);
    normalizeMode(k.db, T0 + 25 * DAY);
    expect(k.db.preferences.studyMode).toBe("NORMAL");
    expect(examConstraints(k.db, g, T0)).toBeNull();
    expect(k.db.events.filter((e) => e.type === "MODE_CHANGED")).toHaveLength(2);
  });

  it("applies topic priorities (Mechanics > Waves) to the exam plan, the path and practice", () => {
    const { k, exam, los } = withExam();
    const [a, b] = los;
    setExamPriority(k.db, exam.id, b, 3);
    setExamPriority(k.db, exam.id, a, 1);
    setStudyMode(k.db, "EXAM", exam.id, T0);
    const c = examConstraints(k.db, g, T0)!;
    expect(c.priorities[b]).toBe(3);
    expect(k.db.questions[c.practice[0]].milestoneId).toBe(k.ms[b]);
    expect(c.weakHighPriority).toEqual([b]);
    const plan = examPlan(k.db, g, k.db.exams[exam.id], T0);
    const learned = plan.flatMap((d) => d.items.filter((i) => i.action === "learn").map((i) => i.loId));
    expect(learned.indexOf(b)).toBeLessThan(learned.indexOf(a));
    const p = planExamPath(k.db, g, exam.id, T0)!;
    expect(p.mode).toBe("EXAM");
    // Solving the high-priority topic raises coverage.
    for (const q of k.qs[k.ms[b]]) { answer(k, q, true, { at: T0 + 1 }); answer(k, q, true, { at: T0 + 2 }); }
    expect(examConstraints(k.db, g, T0 + 3)!.weakHighPriority).toEqual([]);
  });
});
