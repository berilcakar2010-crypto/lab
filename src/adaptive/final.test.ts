import { describe, expect, it } from "vitest";
import { kit, answer, T0, DAY } from "./testkit";
import { getBaseGraph } from "../knowledge/graph";
import { personalGraph } from "../knowledge/state";
import { createEmptyDB, hydrateDB } from "../data/db";
import { answerAutoItem, answerOpenItem, buildCheck, finishCheck } from "./checks";
import { masteryProfile } from "./mastery";
import { decompose, ephemeralChildren, lengthAdvice, milestoneLength } from "./decompose";
import { courseMilestones } from "../engines/curriculum";
import { courseProgress } from "../ui/pages/CoursePage";
import { depthReport, examVsResearch, lastMasteryChange, masteryState } from "./depth";
import { logEntryShown, openLab, routesWhenUnsure, surpriseMe } from "./entry";
import { discoveries, explorationQuestions, newConnections, whereLeads, whyMatters } from "./discovery";
import { localVariant, questionBank, questionQuality, questionState, toggleFavorite } from "./questionBank";
import { RETENTION_STRATEGIES } from "./retentionStrategy";
import { reviewTopic } from "../study/topics";
import { observedPreferences, trendInsights } from "./personalModel";
import { globalSearch, parseQuickAction } from "./search";
import { addQuestion } from "../engines/curriculum";
import { grantMastery } from "../engines/progress";

const g = getBaseGraph();
const NEWTON = "phys.mech.newton";

describe("knowledge checks replace bare 'I know this' claims", () => {
  it("a passed check on a graph object satisfies it; a failed one does not", () => {
    const k = kit([NEWTON]);
    const draft = buildCheck(k.db, g, { loId: NEWTON });
    expect(draft.items.length).toBeGreaterThanOrEqual(2);
    expect(draft.items.length).toBeLessThanOrEqual(3);
    expect(draft.items.some((i) => i.kind === "auto")).toBe(true);
    draft.items.forEach((it, i) => {
      if (it.kind === "auto") {
        const q = k.db.questions[it.questionId!];
        answerAutoItem(k.db, draft, i, q.numeric ? { kind: "number", text: "10" } : { kind: "choice", index: 0 }, k.sessionId, "touch", T0);
      } else answerOpenItem(draft, i, "A full answer about forces and acceleration", it.rubric.map(() => true), "self");
    });
    const out = finishCheck(k.db, draft, k.sessionId, T0);
    expect(out.passed).toEqual([NEWTON]);
    expect(personalGraph(k.db, g).progress.get(NEWTON)!.state).not.toBe("BEYAN");
    expect(personalGraph(k.db, g).satisfied(NEWTON)).toBe(true);
    expect(k.db.events.some((e) => e.type === "KNOWLEDGE_CHECK" && e.data.passed)).toBe(true);
  });

  it("an empty or wrong check fails and changes nothing but the record", () => {
    const db = createEmptyDB(T0);
    const lo = g.order.find((id) => !g.objects[id].prerequisites.length && g.objects[id].coreQuestions.length)!;
    const draft = buildCheck(db, g, { loId: lo });
    expect(draft.items.every((i) => i.kind === "open")).toBe(true);
    draft.items.forEach((it, i) => answerOpenItem(draft, i, "", it.rubric.map(() => false), "self"));
    const out = finishCheck(db, draft, undefined, T0);
    expect(out.failed).toEqual([lo]);
    expect(personalGraph(db, g).satisfied(lo)).toBe(false);
  });

  it("a milestone check grants mastery with its answers as evidence", () => {
    const k = kit([NEWTON]);
    const id = k.ms[NEWTON];
    const draft = buildCheck(k.db, g, { milestoneId: id });
    draft.items.forEach((it, i) => {
      if (it.kind === "auto") {
        const q = k.db.questions[it.questionId!];
        answerAutoItem(k.db, draft, i, q.numeric ? { kind: "number", text: "10" } : { kind: "choice", index: 0 }, k.sessionId, "touch", T0);
      } else answerOpenItem(draft, i, "explained", it.rubric.map(() => true), "ai");
    });
    finishCheck(k.db, draft, k.sessionId, T0);
    expect(k.db.milestones[id].masteredAt).toBeTruthy();
    const rec = Object.values(k.db.mastery).find((r) => r.milestoneId === id)!;
    expect(rec.selfAttested).toBe(false);
    expect(masteryProfile(k.db, NEWTON, T0).evidenceCount).toBeGreaterThan(0);
  });

  it("several basics are checked at once and pass or fail one by one", () => {
    const db = createEmptyDB(T0);
    const basics = g.order.filter((id) => g.objects[id].difficulty <= 1 && g.objects[id].coreQuestions.length).slice(0, 3);
    const draft = buildCheck(db, g, { loIds: basics });
    draft.items.forEach((it, i) => answerOpenItem(draft, i, "ok", it.rubric.map(() => it.loId === basics[0]), "self"));
    const out = finishCheck(db, draft, undefined, T0);
    expect(out.passed).toEqual([basics[0]]);
    expect(out.failed.sort()).toEqual(basics.slice(1).sort());
  });
});

describe("dynamic decomposition", () => {
  it("splits a milestone the learner is stuck on into temporary steps that do not touch progress", () => {
    const k = kit(["math.stat.bayesian"], { kinds: ["MULTIPLE_CHOICE", "NUMERIC", "MULTIPLE_CHOICE"] });
    const id = k.ms["math.stat.bayesian"];
    const before = courseProgress(k.db, k.courseId);
    for (let i = 0; i < 5; i++) answer(k, k.qs[id][0], false, { answer: 1, at: T0 + i * 1000 });
    expect(lengthAdvice(k.db, id)?.kind).toBe("TOO_BIG");
    const steps = decompose(k.db, g, id, { stuckQuestionId: k.qs[id][0], now: T0 });
    expect(steps.length).toBeGreaterThanOrEqual(1);
    for (const s of steps) {
      const m = k.db.milestones[s];
      expect(m.ephemeral?.parentId).toBe(id);
      expect(m.required).toBe(false);
      expect(m.status).not.toBe("LOCKED");
      expect(Object.values(k.db.questions).some((q) => q.milestoneId === s)).toBe(true);
    }
    expect(courseProgress(k.db, k.courseId).requiredTotal).toBe(before.requiredTotal);
    // Idempotent: asking again returns the same steps.
    expect(decompose(k.db, g, id, { now: T0 })).toEqual(steps);
    // Mastering the original archives the temporary steps.
    grantMastery(k.db, id, [], false, false, k.sessionId, T0 + DAY);
    expect(ephemeralChildren(k.db, id)).toHaveLength(0);
    expect(courseMilestones(k.db, k.courseId).some((m) => steps.includes(m.id))).toBe(false);
    expect(k.db.events.some((e) => e.type === "DECOMPOSED")).toBe(true);
  });

  it("milestone length reflects cognitive scope", () => {
    const k = kit([NEWTON]);
    const m = k.db.milestones[k.ms[NEWTON]];
    expect(milestoneLength({ ...m, estimatedDuration: 8, difficulty: 1 })).toBe("MICRO");
    expect(milestoneLength({ ...m, milestoneType: "DERIVATION", estimatedDuration: 10 })).toBe("MEDIUM");
    expect(milestoneLength({ ...m, milestoneType: "BOSS" })).toBe("BOSS");
  });
});

describe("depth of mastery", () => {
  it("levels, state, exam vs research and the audit come from evidence", () => {
    const k = kit([NEWTON]);
    const id = k.ms[NEWTON];
    expect(depthReport(k.db, NEWTON, T0).top).toBeNull();
    expect(masteryState(masteryProfile(k.db, NEWTON, T0))).toBe("NONE");
    for (const [i, q] of k.qs[id].entries()) answer(k, q, true, { at: T0 + i * 1000 });
    const d = depthReport(k.db, NEWTON, T0 + DAY);
    expect(d.reached).toContain("SEEN");
    expect(d.reached).toContain("SOLVE");
    expect(d.next).toBeDefined();
    const er = examVsResearch(k.db, NEWTON, T0 + DAY);
    expect(er.exam).not.toBeNull();
    expect(er.research).toBeNull();
    const ch = lastMasteryChange(k.db, NEWTON, T0 + DAY)!;
    expect(ch.after).toBeGreaterThan(ch.before);
    expect(ch.because).toMatch(/\d/);
  });
});

describe("Open Lab", () => {
  it("an empty Lab invites the first question", () => {
    const lab = openLab(createEmptyDB(T0), g, T0);
    expect(lab.stateLine).toMatch(/empty|boş/);
    expect(lab.awayDays).toBeNull();
  });

  it("an unfinished milestone becomes the one thing now, starting with its question", () => {
    const k = kit([NEWTON]);
    const id = k.ms[NEWTON];
    answer(k, k.qs[id][0], false, { at: T0 });
    const lab = openLab(k.db, g, T0 + 3600_000);
    expect(lab.resume?.milestoneId).toBe(id);
    expect(lab.primary?.kind).toBe("CONTINUE");
    expect(lab.primary?.challenge?.prompt).toBeTruthy();
    expect(lab.primary?.why.length).toBeGreaterThan(0);
  });

  it("after months away it says so and puts review first, without locking into the old plan", () => {
    const k = kit([NEWTON]);
    const id = k.ms[NEWTON];
    for (const q of k.qs[id]) answer(k, q, true, { at: T0 });
    const later = T0 + 90 * DAY;
    const lab = openLab(k.db, g, later);
    expect(lab.awayDays).toBe(90);
    expect(lab.stateLine).toMatch(/90/);
    expect(lab.primary?.kind).toBe("REVIEW");
    expect(lab.alternatives.length).toBeGreaterThan(0);
  });

  it("an entry shown and not taken sinks the next time", () => {
    const k = kit([NEWTON]);
    answer(k, k.qs[k.ms[NEWTON]][0], false, { at: T0 });
    const first = openLab(k.db, g, T0 + 1000).primary!;
    for (let i = 0; i < 3; i++) logEntryShown(k.db, first, T0 + 2000 + i);
    const again = openLab(k.db, g, T0 + 5000);
    const same = [again.primary, ...again.alternatives].find((e) => e && e.kind === first.kind && e.target.milestoneId === first.target.milestoneId);
    expect(same!.score).toBeLessThan(first.score);
  });

  it("surprise me picks something new and reachable; unsure offers different routes", () => {
    const db = createEmptyDB(T0);
    const s = surpriseMe(db, g, "COMFORT", 0, T0)!;
    expect(s.target.loId).toBeTruthy();
    expect(personalGraph(db, g).progress.get(s.target.loId!)!.missingRequired).toHaveLength(0);
    expect(s.challenge?.prompt).toBeTruthy();
    const hard = surpriseMe(db, g, "EXTREME", 0, T0)!;
    expect(g.objects[hard.target.loId!].difficulty).toBeGreaterThanOrEqual(g.objects[s.target.loId!].difficulty);
    const k = kit([NEWTON]);
    answer(k, k.qs[k.ms[NEWTON]][0], false, { at: T0 });
    const routes = routesWhenUnsure(k.db, g, T0 + 1000);
    expect(new Set(routes.map((r) => r.kind)).size).toBe(routes.length);
    expect(routes.length).toBeGreaterThanOrEqual(2);
  });
});

describe("discovery", () => {
  it("why it matters and where it leads come from real graph edges", () => {
    const w = whyMatters(g, NEWTON)!;
    expect(w.dependents).toBeGreaterThan(0);
    expect(w.direct.every((id) => g.objects[id])).toBe(true);
    const l = whereLeads(createEmptyDB(T0), g, NEWTON)!;
    expect(l.next.every((id) => g.objects[NEWTON].unlocks.includes(id))).toBe(true);
    expect(explorationQuestions(g, NEWTON).every((q) => q.length > 10)).toBe(true);
  });

  it("knowing an object with a cross-domain link surfaces the connection", () => {
    const from = g.order.find((id) => g.objects[id].interdisciplinaryLinks.some((l) => g.objects[l.id] && g.objects[l.id].domain !== g.objects[id].domain))!;
    const k = kit([from]);
    for (const q of k.qs[k.ms[from]]) answer(k, q, true, { at: T0 });
    const ds = discoveries(k.db, g, T0 + 1000, 6);
    expect(ds.some((d) => d.kind === "CONNECTION" && d.fromId === from)).toBe(true);
    for (const d of ds) expect(g.objects[d.loId]).toBeTruthy();
    expect(newConnections(k.db, g, from).every((l) => l.crossDomain)).toBe(true);
  });
});

describe("question bank", () => {
  it("states, favourites, quality and exact variations", () => {
    const k = kit([NEWTON]);
    const id = k.ms[NEWTON];
    const [q0, q1] = k.qs[id];
    expect(questionState(k.db, k.db.questions[q0], T0).state).toBe("NEW");
    answer(k, q0, true, { at: T0 });
    answer(k, q1, false, { at: T0 });
    answer(k, q1, false, { at: T0 + 1 });
    expect(questionState(k.db, k.db.questions[q0], T0).state).toBe("MASTERED");
    expect(questionState(k.db, k.db.questions[q1], T0).state).toBe("WEAK");
    expect(questionState(k.db, k.db.questions[q0], T0 + 40 * DAY).state).toBe("RETENTION");
    toggleFavorite(k.db, q0);
    expect(questionBank(k.db, { favorite: true }, T0).map((e) => e.question.id)).toEqual([q0]);
    expect(questionQuality(k.db, { ...k.db.questions[q0], id: undefined }).issues.length).toBeGreaterThan(0); // duplicate
    expect(questionQuality(k.db, { milestoneId: id, kind: "NUMERIC", purpose: "MASTERY", prompt: "How large is the net force here?", rubric: [], hints: [], solution: "", difficulty: 2, createdBy: "ai" }).ok).toBe(false);
    const sim = addQuestion(k.db, { milestoneId: id, kind: "SIMULATION", purpose: "PRACTICE", prompt: "Predict the range", rubric: [], hints: [], solution: "", difficulty: 2, createdBy: "t",
      simulation: { expression: "v*2", outputLabel: "R", variables: [{ name: "v", label: "v", min: 1, max: 5, step: 1, initial: 2 }] }, numeric: { value: 4, tolerance: 0.01 } });
    const v = localVariant(k.db, sim.id, () => 0.99)!;
    expect(v.variantOf).toBe(sim.id);
    expect(v.numeric!.value).toBe(v.simulation!.variables[0].initial * 2);
  });
});

describe("retention strategies", () => {
  it("the ladder strategy reproduces the old topic schedule, and topics follow the chosen strategy", () => {
    const s0 = { stage: 0, intervalDays: 0, ease: 2.5, reps: 0, lapses: 0 };
    expect(RETENTION_STRATEGIES.ladder.next(s0, 2).days).toBe(3);
    expect(RETENTION_STRATEGIES.ladder.next(s0, 3).days).toBe(7);
    expect(RETENTION_STRATEGIES.sm2.next(s0, 2).days).toBe(1);
    expect(RETENTION_STRATEGIES.leitner.next({ ...s0, stage: 2 }, 0).state.stage).toBe(0);
    const db = createEmptyDB(T0);
    const r = reviewTopic(db, NEWTON, 2, T0);
    expect(r.stage).toBe(1);
    db.preferences.retentionStrategies = { topics: "leitner" };
    const r2 = reviewTopic(db, "phys.mech.kinematics-1d", 2, T0);
    expect(Math.round((r2.due - T0) / DAY)).toBeLessThanOrEqual(2);
  });
});

describe("personal model", () => {
  it("states nothing without enough data, and trends carry their sample size", () => {
    const k = kit([NEWTON]);
    answer(k, k.qs[k.ms[NEWTON]][0], true, { at: T0 });
    expect(observedPreferences(k.db, T0 + DAY)).toEqual([]);
    expect(trendInsights(k.db, g, T0 + DAY)).toEqual([]);
    const id = k.ms[NEWTON];
    for (let i = 0; i < 14; i++) {
      const q = addQuestion(k.db, { milestoneId: id, kind: "NUMERIC", purpose: "PRACTICE", prompt: `extra ${i}`, rubric: [], hints: [], solution: "", difficulty: 2, createdBy: "t", numeric: { value: 10, tolerance: 0.02 } });
      answer(k, q.id, i >= 7, { at: T0 + i * 3600_000 });
    }
    const t = trendInsights(k.db, g, T0 + DAY);
    expect(t).toHaveLength(1);
    expect(t[0].n).toBeGreaterThanOrEqual(12);
    expect(t[0].text).toMatch(/rose|yükseldi/);
  });
});

describe("global search", () => {
  it("finds concepts with their state and parses quick actions", () => {
    const db = createEmptyDB(T0);
    const title = g.objects[NEWTON].title;
    const r = globalSearch(db, g, title.split(" ")[0], 10, T0);
    expect(r.some((x) => x.type === "CONCEPT" && x.id === NEWTON)).toBe(true);
    expect(parseQuickAction("teach me Fourier transforms")).toMatchObject({ kind: "LEARN", arg: "Fourier transforms" });
    expect(parseQuickAction("Ne çalışacağımı bilmiyorum")?.kind).toBe("UNSURE");
    expect(parseQuickAction("surprise me")?.kind).toBe("SURPRISE");
    expect(parseQuickAction("Fourier")).toBeNull();
  });
});

describe("schema v4 migration", () => {
  it("is idempotent and keeps existing learners out of the first-run flow", () => {
    const k = kit([NEWTON]);
    const raw = JSON.parse(JSON.stringify(k.db));
    raw.knowledge.migrations = raw.knowledge.migrations.filter((m: { id: string }) => m.id !== "v4-academic-layer");
    delete raw.journal; delete raw.checks; delete raw.preferences.firstRunAt;
    const db = hydrateDB(raw);
    expect(db.journal).toEqual({});
    expect(db.preferences.firstRunAt).toBeTruthy();
    const again = hydrateDB(JSON.parse(JSON.stringify(db)));
    expect(again.knowledge.migrations.filter((m) => m.id === "v4-academic-layer")).toHaveLength(1);
    expect(hydrateDB(null).preferences.firstRunAt).toBeUndefined();
  });
});

import { whatNext } from "./whatNext";
import { competitionReport, languageReports, skillsOf } from "../academic/layers";

describe("what next: every option carries a confidence; explore uses real links", () => {
  it("adds confidence to all options", () => {
    const k = kit([NEWTON]);
    for (const q of k.qs[k.ms[NEWTON]]) answer(k, q, true, { at: T0 });
    const opts = whatNext(k.db, g, { justCompletedMilestoneId: k.ms[NEWTON], now: T0 + 1000 });
    expect(opts.length).toBeGreaterThan(0);
    for (const o of opts) expect(o.confidence).toBeGreaterThan(0);
    for (const o of opts.filter((x) => x.kind === "EXPLORE")) expect(g.objects[o.target.loId!]).toBeTruthy();
  });
});

describe("language and competition layers", () => {
  it("break languages down by capability and keep competition apart from mastery", () => {
    const lang = g.order.find((id) => g.objects[id].domain === "INGILIZCE" && skillsOf(g.objects[id]).includes("grammar"))!;
    expect(lang).toBeTruthy();
    const k = kit([lang]);
    answer(k, k.qs[k.ms[lang]][0], true, { at: T0 });
    const r = languageReports(k.db, g, T0 + 1000);
    expect(r[0].domain).toBe("INGILIZCE");
    expect(r[0].skills.find((s) => s.skill === "grammar")!.touched).toBe(1);
    expect(languageReports(createEmptyDB(T0), g, T0)).toEqual([]);
    const c = competitionReport(k.db, g, [lang]);
    expect(c.attempts).toBe(1);
    expect(c.accuracy).toBeNull(); // too few attempts to say
  });
});
