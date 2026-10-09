import { describe, expect, it } from "vitest";
import { createEmptyDB, hydrateDB } from "../data/db";
import { logEvent } from "../engines/analytics";
import { SCHEMA_VERSION } from "../domain/types";

const NEW_TABLES = ["errors", "insights", "paths", "sources", "curriculumProposals", "research", "sandboxRuns", "predictions", "decisions"] as const;

describe("data model extensions (phase 2)", () => {
  it("creates the new tables and defaults", () => {
    const db = createEmptyDB();
    for (const t of NEW_TABLES) expect(db[t]).toEqual({});
    expect(db.preferences.studyMode).toBe("NORMAL");
    expect(SCHEMA_VERSION).toBe(4);
  });

  it("hydrates schema-2 data without the new tables and keeps everything else", () => {
    const old = createEmptyDB() as unknown as Record<string, unknown>;
    for (const t of NEW_TABLES) delete old[t];
    const prefs = old.preferences as Record<string, unknown>;
    delete prefs.studyMode;
    old.schemaVersion = 2;
    (old.attempts as Record<string, unknown>).a1 = { id: "a1", milestoneId: "m", questionId: "q" };
    const db = hydrateDB(JSON.parse(JSON.stringify(old)));
    for (const t of NEW_TABLES) expect(db[t]).toEqual({});
    expect(db.preferences.studyMode).toBe("NORMAL");
    expect(db.schemaVersion).toBe(4);
    expect(db.attempts.a1).toBeTruthy();
    // Hydrating again changes nothing (idempotent).
    expect(hydrateDB(JSON.parse(JSON.stringify(db)))).toEqual(db);
  });

  it("stamps events with the user and the concepts they are about", () => {
    const db = createEmptyDB();
    const e = logEvent(db, "PATH_CREATED", { loIds: ["math.prob.basics"] }, { steps: 3 });
    expect(e.userId).toBe(db.user.id);
    expect(e.loIds).toEqual(["math.prob.basics"]);
  });
});

import { adaptiveExport, importAdaptive } from "./exportData";
import { kit, answer } from "./testkit";
import { createPath } from "./pathPlanner";
import { getBaseGraph } from "../knowledge/graph";

describe("export / import of adaptive data", () => {
  it("exports every new entity and imports it elsewhere with relations intact", () => {
    const k = kit(["math.prob.basics", "math.stat.bayesian"], { kinds: ["MULTIPLE_CHOICE"] });
    answer(k, k.qs[k.ms["math.stat.bayesian"]][0], false, { answer: 1, errorTypes: ["CONCEPTUAL"] });
    createPath(k.db, getBaseGraph(), { goalIds: ["math.stat.bayesian"] });
    const json = adaptiveExport(k.db);
    const data = JSON.parse(json);
    for (const key of ["paths", "errors", "repairs", "insights", "masteryProfiles", "retention", "experiments", "provenance", "sources", "curriculumVersions", "aiDecisions"]) expect(data).toHaveProperty(key);
    expect(data.errors).toHaveLength(1);
    expect(data.masteryProfiles.length).toBeGreaterThan(0);
    const other = createEmptyDB();
    const added = importAdaptive(other, json);
    expect(added.errors).toBe(1);
    expect(added.paths).toBe(1);
    const err = Object.values(other.errors)[0];
    // The decision that classified the error still points at it.
    expect(Object.values(other.decisions).some((d) => d.ref === `error:${err.id}`)).toBe(true);
    // Importing twice adds nothing.
    expect(importAdaptive(other, json).errors).toBe(0);
  });
});
