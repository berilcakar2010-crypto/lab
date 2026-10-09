import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import { assembleGraph, getGraph } from "../knowledge/graph";
import { BASE_OBJECTS } from "../knowledge/content";
import { validateGraph } from "../knowledge/validate";
import { validateCurriculum, summarizeIssues } from "./validation";
import { kit } from "./testkit";
import { makeProvenance } from "./provenance";
import type { LearningObject } from "../knowledge/schema";

const clone = (id: string, patch: Partial<LearningObject>): LearningObject => ({ ...BASE_OBJECTS.find((o) => o.id === id)!, ...patch });

describe("graph validation", () => {
  it("detects a prerequisite cycle", () => {
    const a = clone("math.prob.counting", { prerequisites: [{ id: "math.prob.basics", strength: "ZORUNLU" }] });
    const g = assembleGraph(BASE_OBJECTS, { version: "9.9.9", objects: { [a.id]: a } });
    expect(validateGraph(g).some((i) => i.code === "DONGU" && i.severity === "HATA")).toBe(true);
  });

  it("detects an orphan (disconnected) object", () => {
    const lone = { ...clone("math.prob.counting", {}), id: "user.lonely", stableId: "user.lonely", title: "Lonely topic", prerequisites: [], unlocks: [], interdisciplinaryLinks: [] } as LearningObject;
    const g = assembleGraph(BASE_OBJECTS, { version: "9.9.9", objects: { [lone.id]: lone } });
    expect(validateGraph(g, { ledger: false }).some((i) => i.code === "BAGLANTISIZ" && i.loId === "user.lonely")).toBe(true);
  });

  it("detects duplicates, invalid references and impossible prerequisites", () => {
    const dup = { ...clone("math.prob.counting", {}), id: "user.dup", stableId: "user.dup" } as LearningObject;
    const bad = clone("math.prob.basics", { prerequisites: [{ id: "does.not.exist", strength: "ZORUNLU" }] });
    const g = assembleGraph(BASE_OBJECTS, { version: "9.9.9", objects: { [dup.id]: dup, [bad.id]: bad } });
    const codes = validateGraph(g, { ledger: false }).map((i) => i.code);
    expect(codes).toContain("YINELENEN_BASLIK");
    expect(codes).toContain("EKSIK_ONKOSUL");
  });
});

describe("curriculum validation (final)", () => {
  it("the built-in graph and a fresh database have no errors", () => {
    const db = createEmptyDB();
    const s = summarizeIssues(validateCurriculum(db, getGraph(db.knowledge)));
    expect(s.errors).toBe(0);
    expect(s.warnings).toBe(0);
  });

  it("flags duplicate milestones, invalid references, broad AI milestones and invalid AI objects", () => {
    const k = kit(["phys.mech.newton", "phys.mech.momentum"]);
    const [a, b] = Object.values(k.db.milestones);
    b.learningObjective = a.learningObjective;
    a.learningObjectIds = ["no.such.object"];
    b.title = "Learn mechanics";
    b.learningObjective = "Learn everything about mechanics";
    b.provenance = makeProvenance("AI_GENERATED");
    k.db.knowledge.provenance = { "user.ghost": makeProvenance("AI_GENERATED") };
    const issues = validateCurriculum(k.db, getGraph(k.db.knowledge));
    const codes = issues.map((i) => i.code);
    expect(codes).toContain("INVALID_REFERENCE");
    expect(codes).toContain("MILESTONE_GRANULARITY");
    expect(codes).toContain("AI_OBJECT_INVALID");
    expect(issues.find((i) => i.code === "MILESTONE_GRANULARITY")!.severity).toBe("WARNING");
    const k2 = kit(["phys.mech.newton", "phys.mech.momentum"]);
    const [x, y] = Object.values(k2.db.milestones);
    y.learningObjective = x.learningObjective;
    expect(validateCurriculum(k2.db, getGraph(k2.db.knowledge)).some((i) => i.code === "DUPLICATE_MILESTONE")).toBe(true);
    // Validation never changes the data.
    expect(k.db.milestones[b.id].granularity).toBeUndefined();
  });
});
