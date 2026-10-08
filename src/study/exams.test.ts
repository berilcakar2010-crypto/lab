import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import { getBaseGraph } from "../knowledge/graph";
import { addExam, daysUntil, examPlan, examReadiness, examReminders, examsICS, paceNote, suggestTopics, todaySuggestions, upcomingExams } from "./exams";
import { reviewTopic, startOfDay } from "./topics";

const DAY = 86_400_000;
const T0 = new Date(2026, 9, 1, 10, 0).getTime();
const g = getBaseGraph();

function withExam(daysAhead: number, loIds = ["phys.mech.newton", "phys.mech.momentum"]) {
  const db = createEmptyDB();
  const date = new Date(startOfDay(T0) + daysAhead * DAY);
  date.setHours(9, 0, 0, 0);
  const exam = addExam(db, { title: "1. yazılı", subject: "Fizik", kind: "EXAM", date: date.getTime(), loIds, notes: "", remindDays: [7, 3, 1, 0] }, T0);
  return { db, exam };
}

describe("exam readiness", () => {
  it("finds missing prerequisites and rates studied topics higher", () => {
    const { db, exam } = withExam(10);
    let r = examReadiness(db, g, exam, T0);
    expect(r.counts.new).toBe(2);
    // Momentum needs Newton, which the exam covers: only the kinematics gap is reported.
    expect(r.prereqs).toEqual(["phys.mech.kinematics-1d"]);
    expect(r.score).toBe(0);
    db.knowledge.selfAttested["phys.mech.newton"] = { at: T0 };
    reviewTopic(db, "phys.mech.newton", 3, T0);
    r = examReadiness(db, g, exam, T0);
    expect(r.topics.find((t) => t.loId === "phys.mech.newton")!.status).not.toBe("new");
    expect(r.score).toBeGreaterThan(0.2);
  });
});

describe("exam plan", () => {
  it("learns gaps and new topics first, spaces reviews, and tests the day before", () => {
    const { db, exam } = withExam(6);
    const plan = examPlan(db, g, exam, T0);
    expect(plan).toHaveLength(7);
    expect(plan[6].left).toBe(0);
    const actions = (i: number) => plan[i].items.map((x) => `${x.action}:${x.loId}`);
    expect(actions(0)[0]).toBe("prereq:phys.mech.kinematics-1d");
    const learnDay = plan.findIndex((d) => d.items.some((x) => x.action === "learn" && x.loId === "phys.mech.newton"));
    expect(learnDay).toBeGreaterThanOrEqual(0);
    expect(plan[learnDay + 1].items.some((x) => x.action === "review" && x.loId === "phys.mech.newton")).toBe(true);
    expect(plan[5].items.every((x) => x.action === "test")).toBe(true);
    expect(plan[5].items).toHaveLength(2);
    // Nothing is planned on the exam day itself except when the exam is today.
    expect(plan[6].items).toHaveLength(0);
    const examDay = examPlan(db, g, exam, exam.date - 2 * 3600_000);
    expect(examDay).toHaveLength(1);
    expect(examDay[0].items.every((x) => x.action === "glance")).toBe(true);
  });

  it("collects today's items across upcoming exams, nearest first", () => {
    const a = withExam(4);
    const db = a.db;
    addExam(db, { title: "quiz", subject: "Mat", kind: "QUIZ", date: T0 + 2 * DAY, loIds: ["math.calc.limits"], notes: "", remindDays: [1] }, T0);
    const today = todaySuggestions(db, g, T0);
    expect(today.map((t) => t.exam.title)).toEqual(["quiz", "1. yazılı"]);
    expect(today[0].items.length).toBeGreaterThan(0);
    expect(upcomingExams(db, T0 + 10 * DAY)).toHaveLength(0);
    expect(daysUntil(a.exam, T0)).toBe(4);
  });

  it("is honest about the pace", () => {
    const { db, exam } = withExam(2, g.order.filter((id) => id.startsWith("phys.mech.")).slice(0, 10));
    expect(paceNote(examReadiness(db, g, exam, T0), 2).tone).toBe("danger");
    const relaxed = withExam(30, ["phys.mech.newton"]);
    expect(paceNote(examReadiness(relaxed.db, g, relaxed.exam, T0), 30).tone).toBe("ok");
  });
});

describe("exam reminders and export", () => {
  it("schedules reminders on the chosen days and the morning of the exam", () => {
    const { db } = withExam(5);
    const rs = examReminders(db, g, 19, 0, T0);
    // 7 days before is already past; 3 and 1 days before at 19:00, then 07:30 on the day.
    expect(rs.map((r) => new Date(r.at).getDate())).toEqual([3, 5, 6].map((d) => new Date(startOfDay(T0) + (d - 1) * DAY).getDate()));
    expect(new Date(rs[0].at).getHours()).toBe(19);
    expect(new Date(rs[2].at).getHours()).toBe(7);
    expect(rs[1].title).toMatch(/Tomorrow|Yarın/);
  });

  it("suggests topics from the subject and writes an iCalendar file", () => {
    expect(suggestTopics(g, "Fizik Newton yasaları")).toContain("phys.mech.newton");
    const { exam } = withExam(5);
    const ics = examsICS([exam], g, T0);
    expect(ics).toMatch(/^BEGIN:VCALENDAR/);
    expect(ics).toContain("TRIGGER:-P3D");
    expect(ics).toContain("TRIGGER:-PT2H");
    expect(ics.split("BEGIN:VALARM")).toHaveLength(5);
  });
});
