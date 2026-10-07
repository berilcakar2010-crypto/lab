import type { LabDB } from "../domain/types";
import { createEmptyDB, hydrateDB } from "./db";

/** Persistence backend. `load` runs once at startup; `save` may be async. */
export interface StorageAdapter {
  load(): string | null | Promise<string | null>;
  save(serialised: string): void | Promise<void>;
  name: string;
}

export const STORAGE_KEY = "lab.db.v1";
const BACKUP_KEY = "lab.db.v1.backup";

export function localStorageAdapter(): StorageAdapter {
  return {
    name: "localStorage",
    load() {
      try {
        return localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(BACKUP_KEY);
      } catch {
        return null;
      }
    },
    save(s) {
      // Keep the previous good copy so a failed/partial write cannot lose data.
      const prev = localStorage.getItem(STORAGE_KEY);
      if (prev) localStorage.setItem(BACKUP_KEY, prev);
      localStorage.setItem(STORAGE_KEY, s);
    },
  };
}

/**
 * IndexedDB backend: raw event logs outgrow localStorage's ~5 MB quota, so the
 * database lives here. Two slots alternate so an interrupted write never
 * destroys the last good copy. Existing localStorage data is migrated once.
 */
export function indexedDBAdapter(dbName = "lab"): StorageAdapter {
  const open = () =>
    new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(dbName, 1);
      req.onupgradeneeded = () => req.result.createObjectStore("kv");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  let conn: Promise<IDBDatabase> | null = null;
  const db = () => (conn ??= open());
  const get = async (key: string) =>
    new Promise<unknown>(async (resolve, reject) => {
      const tx = (await db()).transaction("kv", "readonly").objectStore("kv").get(key);
      tx.onsuccess = () => resolve(tx.result);
      tx.onerror = () => reject(tx.error);
    });
  const putMany = async (entries: [string, unknown][]) =>
    new Promise<void>(async (resolve, reject) => {
      const tx = (await db()).transaction("kv", "readwrite");
      for (const [k, v] of entries) tx.objectStore("kv").put(v, k);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  let slot = 0;
  return {
    name: "IndexedDB",
    async load() {
      const meta = (await get("meta")) as { slot: number } | undefined;
      if (meta) {
        slot = meta.slot;
        const primary = (await get(`db${slot}`)) as string | undefined;
        if (primary) return primary;
        return ((await get(`db${1 - slot}`)) as string | undefined) ?? null;
      }
      // First run with IndexedDB: migrate any localStorage data.
      return localStorageAdapter().load();
    },
    async save(s) {
      const next = 1 - slot;
      await putMany([[`db${next}`, s], ["meta", { slot: next, savedAt: Date.now() }]]);
      slot = next;
    },
  };
}

export function memoryAdapter(initial: string | null = null): StorageAdapter & { value: string | null } {
  const a = {
    name: "memory",
    value: initial,
    load: () => a.value,
    save: (s: string) => {
      a.value = s;
    },
  };
  return a;
}

function parseRaw(raw: string | null): LabDB {
  if (raw) {
    try {
      return hydrateDB(JSON.parse(raw));
    } catch {
      /* fall through to empty */
    }
  }
  return createEmptyDB();
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
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private saving: Promise<void> = Promise.resolve();
  lastSaveError: string | null = null;

  /** Synchronous construction for synchronous adapters (tests, localStorage). */
  constructor(private adapter: StorageAdapter, private autoFlush = true, initialRaw?: string | null) {
    const raw = initialRaw !== undefined ? initialRaw : (adapter.load() as string | null);
    this.db = parseRaw(typeof raw === "string" ? raw : null);
  }

  /** Construct with an async adapter (IndexedDB). */
  static async create(adapter: StorageAdapter, autoFlush = true): Promise<Store> {
    let raw: string | null = null;
    try {
      raw = await adapter.load();
    } catch (e) {
      console.warn("Lab: could not load data", e);
    }
    return new Store(adapter, autoFlush, raw);
  }

  get state(): LabDB {
    return this.db;
  }

  get backend(): string {
    return this.adapter.name;
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

  /** Persist now. Writes are serialised so they land in order. */
  flush(): Promise<void> {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    const snapshot = JSON.stringify(this.db);
    this.saving = this.saving.then(async () => {
      try {
        await this.adapter.save(snapshot);
        this.lastSaveError = null;
      } catch (e) {
        this.lastSaveError = e instanceof Error ? e.message : String(e);
        console.warn("Lab: could not persist data", e);
      }
    });
    return this.saving;
  }

  private changed() {
    this.version++;
    if (this.autoFlush) {
      // Coalesce bursts of changes into one write.
      if (!this.saveTimer) this.saveTimer = setTimeout(() => void this.flush(), 150);
    } else {
      void this.flush();
    }
    for (const l of this.listeners) l();
  }
}
