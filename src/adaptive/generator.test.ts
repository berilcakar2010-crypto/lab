import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import type { LabDB } from "../domain/types";
import type { AIHost } from "../ai/engine";
import type { AIProvider } from "../ai/providers";
import { decideProposal, proposeCurriculum, reviewNotes, storeProposal, withDependencies } from "./generator";
import { addSection, addSource, makeProvenance, mapSection, provenanceOf, sourcesForObject, verifyProvenance } from "./provenance";
import { getGraph } from "../knowledge/graph";
import { validateGraph } from "../knowledge/validate";

const host = (db: LabDB, provider?: AIProvider): AIHost => ({ db: () => db, record: (fn) => fn(db), provider });
const fake = (obj: unknown): AIProvider => ({ id: "gemini", model: "test", ready: () => true, complete: async () => JSON.stringify(obj) });

const DRAFT = {
  goal: "Naive Bayes classification",
  reuse: ["math.prob.bayes"],
  newNodes: [
    { title: "Naive Bayes classifier", domain: "PROGRAMLAMA", unit: "Machine learning", description: "Classify with Bayes' theorem under independence.", whyItMatters: "A simple, strong baseline.", prerequisites: ["math.prob.bayes", "Feature vectors (not in graph)"], learningObjectives: ["Given word counts, calculate the class posterior with naive Bayes."], difficulty: 3 },
    { title: "Bayes teoremi", domain: "MATEMATIK", prerequisites: [], learningObjectives: ["x"] },
  ],
  addEdges: [],
  removeEdges: [],
  milestones: [
    { node: "Naive Bayes classifier", title: "Compute a naive Bayes posterior", capability: "Given word counts for two classes, calculate and explain the posterior of each class with naive Bayes.", startingQuestion: "Which class is more likely for 'free money'?", attempt: "Compute P(spam | 'free money') from the table.", learningMaterial: "Multiply the class prior by each word likelihood, then normalise.", application: "Classify three new messages.", masteryEvidence: "2 correct posteriors, unassisted", transfer: "Use the same idea to diagnose a disease from two symptoms.", difficulty: 3, estimatedMinutes: 25 },
    { node: "Naive Bayes classifier", title: "Learn machine learning", capability: "Learn everything about machine learning", startingQuestion: "", attempt: "", learningMaterial: "", application: "", masteryEvidence: "", transfer: "", difficulty: 3, estimatedMinutes: 300 },
  ],
  sources: [{ title: "Some book", url: "https://example.org" }],
};

describe("AI curriculum generator", () => {
  it("reuses existing nodes offline and never invents new ones", async () => {
    const db = createEmptyDB();
    const p = await proposeCurriculum(host(db), "Bayes theorem");
    expect(p.reused).toContain("math.prob.bayes");
    expect(p.nodes).toHaveLength(0);
    expect(p.generatedBy).toBe("engine");
    expect(p.notes.join(" ")).toMatch(/never invented|uydurulmaz/);
    expect(p.changes.every((c) => c.kind === "ADD_MILESTONE")).toBe(true);
    expect(p.changes.length).toBeGreaterThan(0);
    const none = await proposeCurriculum(host(db), "zzqx unknown vvbq");
    expect(none.changes).toHaveLength(0);
    expect(none.notes[0]).toMatch(/need AI|YZ gerekiyor/);
  });

  it("with AI: proposes new nodes, prevents duplicates, validates granularity and prerequisites, and builds a diff", async () => {
    const db = createEmptyDB();
    const p = await proposeCurriculum(host(db, fake(DRAFT)), "teach me naive Bayes");
    expect(p.generatedBy).toBe("gemini");
    expect(p.nodes.map((n) => n.title)).toEqual(["Naive Bayes classifier"]);
    expect(p.notes.join(" ")).toMatch(/reused|yeniden kullanıldı/);
    const node = p.nodes[0];
    expect(node.id).toMatch(/^user\./);
    expect(node.provenance.generatedByAI).toBe(true);
    expect(node.provenance.verification).toBe("UNVERIFIED");
    const kinds = p.changes.map((c) => c.kind);
    expect(kinds).toEqual(expect.arrayContaining(["ADD_NODE", "ADD_PREREQ", "ADD_MILESTONE"]));
    const badPrereq = p.changes.find((c) => c.kind === "ADD_PREREQ" && !c.valid)!;
    expect(badPrereq.issues.join(" ")).toMatch(/Missing prerequisite|Eksik önkoşul/);
    const broad = p.changes.find((c) => c.kind === "ADD_MILESTONE" && c.title === "Learn machine learning")!;
    expect(broad.valid).toBe(false);
    const good = p.changes.find((c) => c.kind === "ADD_MILESTONE" && c.title === "Compute a naive Bayes posterior")!;
    expect(good.valid).toBe(true);
    expect(withDependencies(p, [good.id])).toContain(p.changes.find((c) => c.kind === "ADD_NODE")!.id);
    expect(reviewNotes(p).join(" ")).toMatch(/unverified|doğrulanmamış/);
  });

  it("applies selected changes as a new graph version and a course; rejected or invalid changes are not applied", async () => {
    const db = createEmptyDB();
    const p = await proposeCurriculum(host(db, fake(DRAFT)), "teach me naive Bayes");
    storeProposal(db, p);
    const broad = p.changes.find((c) => c.title === "Learn machine learning")!;
    const good = p.changes.find((c) => c.title === "Compute a naive Bayes posterior")!;
    const versionBefore = getGraph(db.knowledge).version;
    const r = decideProposal(db, p.id, [good.id, broad.id], 1000);
    expect(r.ok).toBe(true);
    expect(r.status).toBe("PARTIAL");
    expect(r.appliedVersion).not.toBe(versionBefore);
    const g = getGraph(db.knowledge);
    const node = g.objects[p.nodes[0].id];
    expect(node.title).toBe("Naive Bayes classifier");
    expect(node.prerequisites.map((x) => x.id)).toEqual(["math.prob.bayes"]);
    expect(db.knowledge.history.at(-1)!.added).toContain(node.id);
    expect(db.knowledge.provenance![node.id].sourceType).toBe("AI_GENERATED");
    const ms = Object.values(db.milestones).filter((m) => m.courseId === r.courseId);
    expect(ms.map((m) => m.title)).toEqual(["Compute a naive Bayes posterior"]);
    expect(ms[0].capability!.cognitiveAction).toBe("CALCULATE");
    expect(ms[0].provenance!.generatedByAI).toBe(true);
    expect(db.courses[r.courseId!].provenance!.verification).toBe("UNVERIFIED");
    expect(validateGraph(g).filter((i) => i.severity === "HATA")).toHaveLength(0);
    expect(decideProposal(db, p.id, "all").ok).toBe(false);

    const db2 = createEmptyDB();
    const p2 = await proposeCurriculum(host(db2, fake(DRAFT)), "teach me naive Bayes");
    storeProposal(db2, p2);
    const before = JSON.stringify([db2.milestones, db2.knowledge.overlay]);
    expect(decideProposal(db2, p2.id, "none").status).toBe("REJECTED");
    expect(JSON.stringify([db2.milestones, db2.knowledge.overlay])).toBe(before);
    expect(db2.events.some((e) => e.type === "CURRICULUM_DECIDED")).toBe(true);
  });
});

describe("sources and provenance", () => {
  it("never marks AI content verified by itself; a person can verify", () => {
    expect(makeProvenance("AI_GENERATED", { verification: "VERIFIED", verifiedBy: "ai" }).verification).toBe("UNVERIFIED");
    const db = createEmptyDB();
    const g = getGraph(db.knowledge);
    expect(provenanceOf(db, g, "math.calc.limits").verification).toBe("UNVERIFIED");
    expect(verifyProvenance(db, "math.calc.limits", "learner").verification).toBe("VERIFIED");
  });

  it("maps a book's chapters onto existing graph objects (the book is a source, not a curriculum)", () => {
    const db = createEmptyDB();
    const src = addSource(db, { title: "Thomas' Calculus", type: "TEXTBOOK", author: "Thomas" });
    const { sectionId, suggestions } = addSection(db, src.id, "Limits and continuity");
    expect(suggestions).toContain("math.calc.limits");
    mapSection(db, src.id, sectionId, ["math.calc.limits", "not.a.node"]);
    const g = getGraph(db.knowledge);
    const list = sourcesForObject(db, g, "math.calc.limits");
    expect(list.some((s) => s.origin === "yours" && s.title === "Thomas' Calculus" && s.section === "Limits and continuity")).toBe(true);
    expect(db.sources[src.id].sections[0].loIds).toEqual(["math.calc.limits"]);
    expect(Object.keys(db.courses)).toHaveLength(0);
  });
});

import { reviewProposalAI } from "../ai/adaptiveAI";

describe("curriculum reviewer", () => {
  it("adds AI review notes, or the deterministic checklist offline", async () => {
    const db = createEmptyDB();
    const p = await proposeCurriculum(host(db, fake(DRAFT)), "teach me naive Bayes");
    const ai = await reviewProposalAI(host(db, fake({ notes: ["Check that word independence is stated as an assumption."] })), p);
    expect(ai.value[0]).toMatch(/independence/);
    const off = await reviewProposalAI(host(db), p);
    expect(off.fallbackUsed).toBe(true);
    expect(off.value.length).toBeGreaterThan(0);
  });
});
