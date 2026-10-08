import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import { logEvent } from "../engines/analytics";
import { addMilestone, createCourse, createSubject, addUnit, addTopic } from "../engines/curriculum";
import { dayKey, dueTopics, LADDER_DAYS, reminderForecast, reminderText, reviewTopic, startOfDay, streak, studyLog, syncTopicSchedule } from "./topics";
import { newCard } from "./flashcards";

const DAY = 86_400_000;
const T0 = new Date(2026, 9, 1, 10, 0).getTime();

function dbWithMilestone(lo: string) {
  const db = createEmptyDB();
  const subject = createSubject(db, { name: "x" });
  const { course } = createCourse(db, { subjectId: subject.id, title: "c", description: "", goal: "g", source: { kind: "SEED", text: "" }, generatedBy: "t" });
  const unit = addUnit(db, course.id, "u", "");
  const topic = addTopic(db, unit.id, "t");
  const m = addMilestone(db, { title: "m", topicId: topic.id });
  m.learningObjectIds = [lo];
  return { db, m };
}

const at = (db: ReturnType<typeof createEmptyDB>, type: Parameters<typeof logEvent>[1], ms: number, ctx = {}, data = {}) => {
  const e = logEvent(db, type, ctx, data);
  e.at = ms;
  return e;
};

describe("study log", () => {
  it("groups study by day and topic from the raw events", () => {
    const { db, m } = dbWithMilestone("phys.mech.newton");
    at(db, "ATTEMPT", T0, { milestoneId: m.id });
    at(db, "ATTEMPT", T0 + 60_000, { milestoneId: m.id });
    at(db, "EXPLANATION", T0 + DAY, {}, { lo: "math.calc.limits" });
    at(db, "FLASHCARD_REVIEW", T0 + DAY, {}, { lo: "phys.mech.newton" });
    at(db, "AI_INTERACTION", T0 + DAY, {}, { role: "QA_ASSISTANT", lo: "bio.cell.structure" });
    at(db, "AI_INTERACTION", T0 + DAY, {}, { role: "TUTOR" });
    const log = studyLog(db);
    expect(log.map((d) => d.day)).toEqual([dayKey(T0 + DAY), dayKey(T0)]);
    expect(log[1].topics).toEqual([{ loId: "phys.mech.newton", count: 2, kinds: ["practice"] }]);
    expect(log[0].topics.map((t) => t.loId).sort()).toEqual(["bio.cell.structure", "math.calc.limits", "phys.mech.newton"]);
    expect(streak(log, T0 + DAY + 3600_000)).toBe(2);
    expect(streak(log, T0 + 4 * DAY)).toBe(0);
  });
});

describe("topic schedule", () => {
  it("schedules a studied topic for tomorrow, advances when studied again after it is due, and ignores card reviews", () => {
    const { db, m } = dbWithMilestone("phys.mech.newton");
    at(db, "ATTEMPT", T0, { milestoneId: m.id });
    at(db, "FLASHCARD_REVIEW", T0 + 5 * DAY, {}, { lo: "math.calc.limits" });
    syncTopicSchedule(db, T0 + 1000);
    const r = db.topicReviews["phys.mech.newton"];
    expect(r.stage).toBe(0);
    expect(r.due).toBe(startOfDay(T0) + DAY);
    expect(db.topicReviews["math.calc.limits"]).toBeUndefined();
    // Studying again the same day does not move it.
    at(db, "ATTEMPT", T0 + 3600_000, { milestoneId: m.id });
    syncTopicSchedule(db, T0 + 2 * 3600_000);
    expect(db.topicReviews["phys.mech.newton"].stage).toBe(0);
    // Studying after it is due counts as a review.
    at(db, "MILESTONE_COMPLETE", T0 + 2 * DAY, { milestoneId: m.id });
    syncTopicSchedule(db, T0 + 2 * DAY + 1000);
    expect(db.topicReviews["phys.mech.newton"].stage).toBe(1);
    expect(db.topicReviews["phys.mech.newton"].due).toBe(startOfDay(T0 + 2 * DAY) + LADDER_DAYS[1] * DAY);
  });

  it("moves along the ladder on review: forgot resets, hard comes back sooner, easy jumps", () => {
    const db = createEmptyDB();
    let r = reviewTopic(db, "x", 2, T0);
    expect(r.stage).toBe(1);
    expect(r.due).toBe(startOfDay(T0) + 3 * DAY);
    r = reviewTopic(db, "x", 3, T0);
    expect(r.stage).toBe(3);
    expect(r.due).toBe(startOfDay(T0) + 14 * DAY);
    r = reviewTopic(db, "x", 1, T0);
    expect(r.stage).toBe(3);
    expect(r.due).toBe(startOfDay(T0) + 8 * DAY);
    r = reviewTopic(db, "x", 0, T0);
    expect(r.stage).toBe(0);
    expect(r.history.filter((h) => h.kind === "review")).toHaveLength(4);
    expect(dueTopics(db, startOfDay(T0) + DAY)).toHaveLength(1);
    expect(db.events.some((e) => e.type === "TOPIC_REVIEW")).toBe(true);
  });
});

describe("reminders", () => {
  it("forecasts what will be due at the reminder time on each day", () => {
    const db = createEmptyDB();
    reviewTopic(db, "x", 2, T0); // due in 3 days
    const c = newCard({ front: "q", back: "a" }, undefined, "USER", T0);
    c.due = T0 + 5 * DAY;
    db.flashcards[c.id] = c;
    const slots = reminderForecast(db, 19, 0, T0, 7);
    expect(slots).toHaveLength(7);
    expect(new Date(slots[0].at).getHours()).toBe(19);
    expect(slots.map((s) => s.topics)).toEqual([0, 0, 0, 1, 1, 1, 1]);
    expect(slots.map((s) => s.cards)).toEqual([0, 0, 0, 0, 0, 1, 1]);
    expect(reminderText(slots[6]).body).toMatch(/1 topics and 1 cards/);
  });
});
