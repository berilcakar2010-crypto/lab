import { describe, expect, it } from "vitest";
import { createEmptyDB } from "../data/db";
import { importCurriculum } from "./curriculumSpec";
import { courseMilestones } from "./curriculum";
import { layoutMap } from "./mapLayout";
import { mechanicsPack } from "../ai/packs/mechanics";

describe("Phase 5 — progression map layout", () => {
  it("places every milestone below all of its prerequisites with no overlaps", () => {
    const db = createEmptyDB();
    const { courseId } = importCurriculum(db, structuredClone(mechanicsPack), { source: { kind: "SEED", text: "" }, generatedBy: "seed" });
    const ms = courseMilestones(db, courseId);
    const L = layoutMap(ms, { minWidth: 760 });
    expect(L.nodes.size).toBe(ms.length);
    for (const m of ms) for (const p of m.prerequisites) expect(L.nodes.get(p)!.y).toBeLessThan(L.nodes.get(m.id)!.y);
    const seen = new Set<string>();
    for (const n of L.nodes.values()) {
      const key = `${Math.round(n.x)}:${Math.round(n.y)}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
      expect(n.x).toBeGreaterThan(0);
      expect(n.x).toBeLessThan(L.width);
    }
    expect(L.edges.length).toBe(ms.reduce((s, m) => s + m.prerequisites.length, 0));
    // Branching is visible: some layer holds more than one milestone.
    expect(L.layers.some((l) => l.length > 1)).toBe(true);
  });

  it("handles an empty or single-node course", () => {
    expect(layoutMap([], { minWidth: 320 }).nodes.size).toBe(0);
  });
});
