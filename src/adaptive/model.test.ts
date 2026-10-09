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
    expect(SCHEMA_VERSION).toBe(3);
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
    expect(db.schemaVersion).toBe(3);
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
