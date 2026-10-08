import { describe, expect, it } from "vitest";
import { getGraph } from "../knowledge/graph";
import { DOMAINS } from "../knowledge/schema";
import { domainMindMap, mindLayout, objectMindMap } from "./mindmap";

const finite = (ps: ReturnType<typeof mindLayout>) => ps.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y));

describe("mind maps for the whole graph", () => {
  for (const lang of ["en", "tr"] as const) {
    it(`builds and lays out every object and domain map (${lang})`, () => {
      const g = getGraph(undefined, lang);
      for (const id of g.order) {
        const placed = mindLayout(objectMindMap(g.objects[id], g, { id, text: "", mapItems: ["my own branch"], updatedAt: 0 }));
        expect(placed.length, id).toBeGreaterThan(1);
        expect(finite(placed), id).toBe(true);
        expect(placed.every((p) => typeof p.node.label === "string" && p.node.label.length > 0), id).toBe(true);
      }
      for (const d of DOMAINS) {
        const placed = mindLayout(domainMindMap(g, d));
        expect(finite(placed), d).toBe(true);
      }
    });
  }
});
