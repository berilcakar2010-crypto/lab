/** Pure graph helpers over a prerequisite map: node → prerequisites. */
export type PrereqMap = Map<string, string[]>;

/** Returns one cycle (as a node list) if the graph has any, else null. */
export function findCycle(prereqs: PrereqMap): string[] | null {
  const WHITE = 0, GREY = 1, BLACK = 2;
  const color = new Map<string, number>();
  const stack: string[] = [];
  let found: string[] | null = null;

  const visit = (n: string): boolean => {
    color.set(n, GREY);
    stack.push(n);
    for (const p of prereqs.get(n) ?? []) {
      if (!prereqs.has(p)) continue;
      const c = color.get(p) ?? WHITE;
      if (c === GREY) {
        found = stack.slice(stack.indexOf(p));
        return true;
      }
      if (c === WHITE && visit(p)) return true;
    }
    stack.pop();
    color.set(n, BLACK);
    return false;
  };

  for (const n of prereqs.keys()) {
    if ((color.get(n) ?? WHITE) === WHITE && visit(n)) return found;
  }
  return null;
}

/** True if `target` is reachable from `from` by following prerequisite edges. */
export function dependsOn(prereqs: PrereqMap, from: string, target: string): boolean {
  const seen = new Set<string>();
  const stack = [from];
  while (stack.length) {
    const n = stack.pop()!;
    if (n === target) return true;
    if (seen.has(n)) continue;
    seen.add(n);
    stack.push(...(prereqs.get(n) ?? []));
  }
  return false;
}

/**
 * Removes edges until the graph is acyclic. Edges are dropped from the node
 * that closes each cycle, which is the least destructive repair for AI output.
 * Returns the removed edges as [node, prerequisite].
 */
export function breakCycles(prereqs: PrereqMap): [string, string][] {
  const removed: [string, string][] = [];
  for (let guard = 0; guard < 10_000; guard++) {
    const cycle = findCycle(prereqs);
    if (!cycle) break;
    const node = cycle[cycle.length - 1];
    const pre = cycle[0];
    prereqs.set(node, (prereqs.get(node) ?? []).filter((p) => p !== pre));
    removed.push([node, pre]);
  }
  return removed;
}

/** Topological order (prerequisites first). Ties keep the provided `order`. */
export function topoSort(prereqs: PrereqMap, order: (id: string) => number = () => 0): string[] {
  const indeg = new Map<string, number>();
  const dependents = new Map<string, string[]>();
  for (const [n, ps] of prereqs) {
    indeg.set(n, (ps ?? []).filter((p) => prereqs.has(p)).length);
    for (const p of ps) {
      if (!prereqs.has(p)) continue;
      if (!dependents.has(p)) dependents.set(p, []);
      dependents.get(p)!.push(n);
    }
  }
  const ready = [...prereqs.keys()].filter((n) => indeg.get(n) === 0);
  const out: string[] = [];
  while (ready.length) {
    ready.sort((a, b) => order(a) - order(b));
    const n = ready.shift()!;
    out.push(n);
    for (const d of dependents.get(n) ?? []) {
      indeg.set(d, indeg.get(d)! - 1);
      if (indeg.get(d) === 0) ready.push(d);
    }
  }
  // Any node not emitted is in a cycle; append so callers never lose nodes.
  for (const n of prereqs.keys()) if (!out.includes(n)) out.push(n);
  return out;
}

/** Longest-path depth of each node (roots = 0). Used for map layout. */
export function depths(prereqs: PrereqMap, order?: (id: string) => number): Map<string, number> {
  const d = new Map<string, number>();
  for (const n of topoSort(prereqs, order)) {
    const ps = (prereqs.get(n) ?? []).filter((p) => d.has(p));
    d.set(n, ps.length ? Math.max(...ps.map((p) => d.get(p)!)) + 1 : 0);
  }
  return d;
}
