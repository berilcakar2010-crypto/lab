import type { LabDB } from "../domain/types";
import { createEmptyDB, hydrateDB } from "./db";

/** Persistence backend. `load` runs once at startup; `save` may be async. */
export interface StorageAdapter {
  load(): string | null | Promise<string | null>;
  save(serialised: string): void | Promise<void>;
  name: string;
  /** Dated local snapshots (automatic backups), newest first. Optional per backend. */
  snapshots?: SnapshotStore;
}

export interface SnapshotInfo { key: string; at: number; size: number }

export interface SnapshotStore {
  put(key: string, serialised: string): Promise<void>;
  list(): Promise<SnapshotInfo[]>;
  get(key: string): Promise<string | null>;
  remove(key: string): Promise<void>;
}

/** How many daily snapshots are kept. */
export const SNAPSHOT_KEEP = 7;

/** True when the text is a JSON object (a usable database copy). */
export function parseable(s: string | null | undefined): s is string {
  if (!s) return false;
  try {
    const x = JSON.parse(s);
    return !!x && typeof x === "object" && !Array.isArray(x);
  } catch {
    return false;
  }
}

export const STORAGE_KEY = "lab.db.v1";
const BACKUP_KEY = "lab.db.v1.backup";

export function localStorageAdapter(): StorageAdapter {
  return {
    name: "localStorage",
    load() {
      try {
        const main = localStorage.getItem(STORAGE_KEY);
        // A damaged main copy falls back to the previous good one.
        return parseable(main) ? main : localStorage.getItem(BACKUP_KEY);
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
  const del = async (key: string) =>
    new Promise<void>(async (resolve, reject) => {
      const tx = (await db()).transaction("kv", "readwrite");
      tx.objectStore("kv").delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  const snapshots: SnapshotStore = {
    async put(key, s) {
      const index = ((await get("snapshots")) as SnapshotInfo[] | undefined) ?? [];
      const next = [{ key, at: Date.now(), size: s.length }, ...index.filter((x) => x.key !== key)];
      const keep = next.slice(0, SNAPSHOT_KEEP);
      await putMany([[`snap:${key}`, s], ["snapshots", keep]]);
      for (const old of next.slice(SNAPSHOT_KEEP)) await del(`snap:${old.key}`);
    },
    async list() {
      return (((await get("snapshots")) as SnapshotInfo[] | undefined) ?? []).slice().sort((a, b) => b.at - a.at);
    },
    async get(key) {
      return ((await get(`snap:${key}`)) as string | undefined) ?? null;
    },
    async remove(key) {
      const index = ((await get("snapshots")) as SnapshotInfo[] | undefined) ?? [];
      await putMany([["snapshots", index.filter((x) => x.key !== key)]]);
      await del(`snap:${key}`);
    },
  };
  let slot = 0;
  return {
    name: "IndexedDB",
    snapshots,
    async load() {
      const meta = (await get("meta")) as { slot: number } | undefined;
      if (meta) {
        slot = meta.slot;
        // Newest good copy wins: primary slot, the other slot, then the latest snapshot.
        const primary = (await get(`db${slot}`)) as string | undefined;
        if (parseable(primary)) return primary;
        const other = (await get(`db${1 - slot}`)) as string | undefined;
        if (parseable(other)) return other;
        for (const s of await snapshots.list()) {
          const snap = await snapshots.get(s.key);
          if (parseable(snap)) return snap;
        }
        return null;
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

export function memoryAdapter(initial: string | null = null): StorageAdapter & { value: string | null; snapshots: SnapshotStore } {
  const snaps = new Map<string, { s: string; at: number }>();
  const a = {
    name: "memory",
    value: initial,
    load: () => a.value,
    save: (s: string) => {
      a.value = s;
    },
    snapshots: {
      async put(key: string, s: string) {
        snaps.set(key, { s, at: Date.now() });
        const keys = [...snaps].sort((x, y) => y[1].at - x[1].at || (y[0] > x[0] ? 1 : -1)).map(([k]) => k);
        for (const k of keys.slice(SNAPSHOT_KEEP)) snaps.delete(k);
      },
      async list() {
        return [...snaps].map(([key, v]) => ({ key, at: v.at, size: v.s.length })).sort((x, y) => y.at - x.at);
      },
      async get(key: string) {
        return snaps.get(key)?.s ?? null;
      },
      async remove(key: string) {
        snaps.delete(key);
      },
    } satisfies SnapshotStore,
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
  private lastSnapshotDay: string | null = null;
  lastSaveError: string | null = null;
  lastSavedAt: number | null = null;
  /** Size of the last persisted copy, in characters. */
  lastSize = 0;

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

  get snapshotStore(): SnapshotStore | undefined {
    return this.adapter.snapshots;
  }

  /** Take a snapshot now (e.g. before restoring an older one), keyed by time. */
  async snapshotNow(label = "manual"): Promise<string | null> {
    if (!this.adapter.snapshots) return null;
    const key = `${new Date().toISOString().slice(0, 19).replace("T", " ")} ${label}`;
    await this.adapter.snapshots.put(key, JSON.stringify(this.db));
    return key;
  }

  /** Restore a snapshot; the current state is snapshotted first so the restore can be undone. */
  async restoreSnapshot(key: string): Promise<boolean> {
    const s = await this.adapter.snapshots?.get(key);
    if (!parseable(s)) return false;
    await this.snapshotNow("before-restore");
    this.replace(JSON.parse(s) as LabDB);
    await this.flush();
    return true;
  }

  /** Persist now. Writes are serialised so they land in order. */
  flush(): Promise<void> {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    const snapshot = JSON.stringify(this.db);
    const auto = this.db.preferences.autoBackup;
    this.saving = this.saving.then(async () => {
      try {
        await this.adapter.save(snapshot);
        this.lastSaveError = null;
        this.lastSavedAt = Date.now();
        this.lastSize = snapshot.length;
        // One automatic local snapshot per day (the last write of the day wins).
        const day = new Date().toISOString().slice(0, 10);
        if (auto && this.adapter.snapshots && this.lastSnapshotDay !== day) {
          await this.adapter.snapshots.put(day, snapshot);
          this.lastSnapshotDay = day;
        }
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
