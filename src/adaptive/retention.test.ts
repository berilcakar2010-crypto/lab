import { describe, expect, it } from "vitest";
import { kit, answer, T0, DAY } from "./testkit";
import { adaptiveReviewCard, adaptiveReviewTopic, prioritizedDueTopics, reviewPriority } from "./retention";
import { getBaseGraph } from "../knowledge/graph";
import { createEmptyDB } from "../data/db";
import { reviewTopic, startOfDay } from "../study/topics";
import { newCard } from "../study/flashcards";
import { graphStructure } from "./pathPlanner";

const g = getBaseGraph();

describe("adaptive retention", () => {
  it("changes nothing without signals", () => {
    const db = createEmptyDB();
    expect(reviewPriority(db, g, "x.unknown", T0).factor).toBe(1);
    const r = adaptiveReviewTopic(db, g, "x.unknown", 2, T0);
    expect(r.due).toBe(startOfDay(T0) + 3 * DAY);
  });

  it("brings important, error-prone, transfer-weak topics back sooner and lets settled ones wait longer", () => {
    const weak = kit(["math.prob.basics"], { kinds: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "MULTIPLE_CHOICE"] });
    const qs = weak.qs[weak.ms["math.prob.basics"]];
    answer(weak, qs[0], false, { answer: 1, errorTypes: ["CONCEPTUAL"], at: T0 });
    answer(weak, qs[1], false, { answer: 1, purpose: "TRANSFER", at: T0 + 1 });
    answer(weak, qs[2], true, { at: T0 + 2 });
    const pw = reviewPriority(weak.db, g, "math.prob.basics", T0 + DAY);
    expect(pw.factor).toBeLessThan(1);
    expect(pw.reasons.length).toBeGreaterThan(0);

    // A leaf of the graph (nothing builds on it), learned well.
    const lo = g.order.find((id) => graphStructure(g).descendants.get(id) === 0)!;
    const strong = kit([lo], { kinds: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "MULTIPLE_CHOICE"] });
    for (const q of strong.qs[strong.ms[lo]]) for (let i = 0; i < 3; i++) answer(strong, q, true, { at: T0 + i });
    const ps = reviewPriority(strong.db, g, lo, T0 + DAY);
    expect(ps.factor).toBeGreaterThan(pw.factor);

    const a = adaptiveReviewTopic(weak.db, g, "math.prob.basics", 2, T0 + DAY);
    const plain = reviewTopic(createEmptyDB(), "math.prob.basics", 2, T0 + DAY);
    expect(a.due).toBeLessThan(plain.due);
  });

  it("orders due topics by priority and scales card intervals", () => {
    const k = kit(["math.prob.basics", "math.prob.counting"], { kinds: ["MULTIPLE_CHOICE"] });
    reviewTopic(k.db, "math.prob.counting", 2, T0);
    reviewTopic(k.db, "math.prob.basics", 2, T0);
    answer(k, k.qs[k.ms["math.prob.basics"]][0], false, { answer: 1, errorTypes: ["CONCEPTUAL"], at: T0 + 1 });
    const order = prioritizedDueTopics(k.db, g, T0 + 10 * DAY).map((r) => r.id);
    expect(order[0]).toBe("math.prob.basics");
    const c = newCard({ front: "q", back: "a" }, "math.prob.basics", "USER", T0);
    k.db.flashcards[c.id] = c;
    const plainCard = newCard({ front: "q", back: "a" }, undefined, "USER", T0);
    k.db.flashcards[plainCard.id] = plainCard;
    const adaptive = adaptiveReviewCard(k.db, g, c.id, 2, 1000, T0 + DAY)!;
    const fixed = adaptiveReviewCard(k.db, g, plainCard.id, 2, 1000, T0 + DAY)!;
    expect(adaptive.due).toBeLessThan(fixed.due);
  });
});
