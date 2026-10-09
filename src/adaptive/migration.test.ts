import { describe, expect, it } from "vitest";
import { hydrateDB } from "../data/db";
import { kit, answer, T0 } from "./testkit";

const NEW_TABLES = ["errors", "insights", "paths", "sources", "curriculumProposals", "research", "sandboxRuns", "predictions", "decisions"];

/** Data as a schema-2 app (before the upgrade) would have saved it. */
function oldData() {
  const k = kit(["phys.mech.newton", "phys.mech.momentum"], { kinds: ["NUMERIC", "NUMERIC"] });
  const [q1, q2] = k.qs[k.ms["phys.mech.newton"]];
  answer(k, q1, false, { answer: -10, at: T0 });
  answer(k, q1, true, { at: T0 + 1 });
  answer(k, q2, true, { at: T0 + 2 });
  answer(k, k.qs[k.ms["phys.mech.momentum"]][0], false, { answer: 2, at: T0 + 3 });
  const raw = JSON.parse(JSON.stringify(k.db));
  for (const t of NEW_TABLES) delete raw[t];
  delete raw.preferences.studyMode;
  raw.schemaVersion = 2;
  raw.knowledge.migrations = raw.knowledge.migrations.filter((m: { id: string }) => m.id !== "v3-error-records");
  for (const e of raw.events) { delete e.userId; delete e.loIds; }
  raw.events = raw.events.filter((e: { type: string }) => !["ERROR_IDENTIFIED", "REPAIR_COMPLETED", "TRANSFER_ATTEMPT", "INSIGHT_DETECTED"].includes(e.type));
  return { raw, k };
}

describe("migration to schema 3", () => {
  it("keeps every id, mastery record, session, attempt and the curriculum", () => {
    const { raw } = oldData();
    const before = JSON.parse(JSON.stringify(raw));
    const db = hydrateDB(raw);
    for (const t of ["courses", "units", "topics", "milestones", "questions", "attempts", "sessions", "mastery", "retention"] as const) {
      expect(Object.keys(db[t]).sort(), t).toEqual(Object.keys(before[t]).sort());
    }
    expect(JSON.stringify(db.mastery)).toBe(JSON.stringify(before.mastery));
    for (const id of Object.keys(before.milestones)) expect(db.milestones[id].masteredAt).toBe(before.milestones[id].masteredAt);
    expect(db.events.length).toBe(before.events.length);
  });

  it("adds the new tables and fields and turns old wrong answers into error records", () => {
    const { raw } = oldData();
    const db = hydrateDB(raw);
    expect(db.schemaVersion).toBe(4);
    for (const t of NEW_TABLES) expect((db as unknown as Record<string, unknown>)[t]).toBeTruthy();
    expect(db.preferences.studyMode).toBe("NORMAL");
    const errs = Object.values(db.errors);
    expect(errs).toHaveLength(2);
    expect(errs.every((e) => e.source === "legacy")).toBe(true);
    // The first error was fixed by a later correct answer to the same question.
    expect(errs.filter((e) => e.resolution === "RESOLVED")).toHaveLength(1);
    expect(db.knowledge.migrations.map((m) => m.id)).toContain("v3-error-records");
  });

  it("is idempotent: migrating again (or a restored backup) changes nothing", () => {
    const { raw } = oldData();
    const once = hydrateDB(raw);
    const twice = hydrateDB(JSON.parse(JSON.stringify(once)));
    expect(twice).toEqual(once);
    const thrice = hydrateDB(JSON.parse(JSON.stringify(twice)));
    expect(Object.keys(thrice.errors)).toEqual(Object.keys(once.errors));
  });
});
