import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { LabDB } from "../domain/types";
import { indexedDBAdapter, localStorageAdapter, Store } from "../data/store";
import type { AIHost } from "../ai/engine";
import { recomputeAll } from "../engines/progress";
import { closeStaleSessions } from "../engines/sessions";
import { isLang, setLang } from "../i18n";
import { switchLanguage } from "../knowledge/relocalize";
import { syncTopicSchedule } from "../study/topics";

/** Initialised by `initStore()` before the app renders (ES module live binding). */
export let store: Store;

export async function initStore() {
  try {
    if (typeof indexedDB === "undefined") throw new Error("no IndexedDB");
    const adapter = indexedDBAdapter();
    store = new Store(adapter, true, await adapter.load());
  } catch (e) {
    console.warn("Lab: IndexedDB unavailable, using localStorage", e);
    store = new Store(localStorageAdapter());
  }
  // `?lang=tr` / `?lang=en` in the URL switches the language (used by links and tests).
  const asked = new URLSearchParams(window.location.search).get("lang");
  if (isLang(asked) && asked !== store.state.preferences.language) store.update((db) => switchLanguage(db, asked));
  // v2.1: English became the main language. Move older (Turkish) data once, translating built-in content.
  if (!store.state.knowledge.migrations.some((m) => m.id === "v21-english-default")) {
    store.update((db) => {
      if (!isLang(asked)) switchLanguage(db, "en");
      db.knowledge.migrations.push({ id: "v21-english-default", at: Date.now(), note: "Ana dil İngilizce oldu; hazır içerik çevrildi. | English became the main language; built-in content was translated." });
    });
  }
  setLang(store.state.preferences.language);
  // Statuses are derived; refresh them on load in case time-based facts changed.
  store.update((db) => {
    closeStaleSessions(db);
    recomputeAll(db);
    syncTopicSchedule(db);
  });
  window.addEventListener("pagehide", () => void store.flush());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void store.flush();
  });
}

export const aiHost: AIHost = {
  db: () => store.state,
  record: (fn) => store.update(fn),
};

/** Subscribe to the store; components re-render on every change. */
export function useDB(): LabDB {
  useSyncExternalStore(store.subscribe, store.getVersion);
  return store.state;
}

export const act = <T,>(fn: (db: LabDB) => T): T => store.update(fn);

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------

type Toast = { id: number; text: string; kind: "info" | "error" };
let toasts: Toast[] = [];
const toastListeners = new Set<() => void>();
let toastSeq = 0;

export function toast(text: string, kind: Toast["kind"] = "info") {
  const t = { id: ++toastSeq, text, kind };
  toasts = [...toasts, t];
  toastListeners.forEach((l) => l());
  setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== t.id);
    toastListeners.forEach((l) => l());
  }, kind === "error" ? 6000 : 3500);
}

export function useToasts() {
  return useSyncExternalStore(
    (l) => {
      toastListeners.add(l);
      return () => toastListeners.delete(l);
    },
    () => toasts,
  );
}

/** Run a mutation and report errors as a toast instead of crashing. */
export function safely<T>(fn: () => T, success?: string): T | undefined {
  try {
    const r = fn();
    if (success) toast(success);
    return r;
  } catch (e) {
    toast(e instanceof Error ? e.message : String(e), "error");
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Router (hash based, works from file:// and any static host)
// ---------------------------------------------------------------------------

const getHash = () => (typeof window === "undefined" ? "/" : window.location.hash.replace(/^#/, "") || "/");

export function useRoute(): string[] {
  const [path, setPath] = useState(getHash);
  useEffect(() => {
    const on = () => {
      setPath(getHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return path.split("?")[0].split("/").filter(Boolean);
}

export function navigate(path: string) {
  window.location.hash = path;
}

export function useAsync() {
  const [busy, setBusy] = useState(false);
  const run = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
    setBusy(true);
    try {
      return await fn();
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
      return undefined;
    } finally {
      setBusy(false);
    }
  }, []);
  return { busy, run };
}
