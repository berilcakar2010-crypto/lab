import type { LabDB } from "../domain/types";
import { createEmptyDB, hydrateDB } from "./db";

export interface StorageAdapter {
  load(): string | null;
  save(serialised: string): void;
}

export const STORAGE_KEY = "lab.db.v1";
const BACKUP_KEY = "lab.db.v1.backup";

export function localStorageAdapter(): StorageAdapter {
  return {
    load() {
      try {
        return localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(BACKUP_KEY);
      } catch {
        return null;
      }
    },
    save(s) {
      try {
        // Keep the previous good copy so a failed/partial write cannot lose data.
        const prev = localStorage.getItem(STORAGE_KEY);
        if (prev) localStorage.setItem(BACKUP_KEY, prev);
        localStorage.setItem(STORAGE_KEY, s);
      } catch (e) {
        console.warn("Lab: could not persist data", e);
        throw e;
      }
    },
  };
}

export function memoryAdapter(initial: string | null = null): StorageAdapter & { value: string | null } {
  const a = {
    value: initial,
    load: () => a.value,
    save: (s: string) => {
      a.value = s;
    },
  };
  return a;
}

/**
 * The single source of truth. Mutations happen through `update` (in place, cheap)
 * or `transact` (on a copy, validated, then swapped in — used for curriculum
 * edits so a failed edit can never corrupt the graph).
 */
export class Store {
  private db: LabDB;
  private version = 0;
  private listeners = new Set<() => void>();
  private saveScheduled = false;
  lastSaveError: string | null = null;

  constructor(private adapter: StorageAdapter, private autoFlush = true) {
    const raw = adapter.load();
    let parsed: unknown = null;
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
    }
    this.db = parsed ? hydrateDB(parsed) : createEmptyDB();
  }

  get state(): LabDB {
    return this.db;
  }

  getVersion = () => this.version;

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  update<T>(fn: (db: LabDB) => T): T {
    const result = fn(this.db);
    this.changed();
    return result;
  }

  /** Run `fn` on a deep copy; `validate` may throw to reject the change. */
  transact<T>(fn: (db: LabDB) => T, validate?: (db: LabDB) => void): T {
    const draft = structuredClone(this.db);
    const result = fn(draft);
    validate?.(draft);
    this.db = draft;
    this.changed();
    return result;
  }

  replace(db: LabDB) {
    this.db = hydrateDB(db);
    this.changed();
  }

  flush() {
    this.saveScheduled = false;
    try {
      this.adapter.save(JSON.stringify(this.db));
      this.lastSaveError = null;
    } catch (e) {
      this.lastSaveError = e instanceof Error ? e.message : String(e);
    }
  }

  private changed() {
    this.version++;
    if (this.autoFlush) {
      if (!this.saveScheduled) {
        this.saveScheduled = true;
        queueMicrotask(() => this.flush());
      }
    } else {
      this.flush();
    }
    for (const l of this.listeners) l();
  }
}
