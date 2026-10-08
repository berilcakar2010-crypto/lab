/**
 * Recordings (audio/video explanations) live in their own IndexedDB database,
 * apart from the JSON store, so large blobs never slow down saving the main
 * database. Falls back to memory where IndexedDB is unavailable (tests).
 */
const DB_NAME = "lab-media";
const STORE = "blobs";

export interface MediaStore {
  put(id: string, blob: Blob): Promise<void>;
  get(id: string): Promise<Blob | undefined>;
  delete(id: string): Promise<void>;
  keys(): Promise<string[]>;
}

function idbStore(): MediaStore {
  let dbp: Promise<IDBDatabase> | null = null;
  const open = () =>
    (dbp ??= new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }));
  const run = async <T,>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const req = fn(tx.objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };
  return {
    put: async (id, blob) => void (await run("readwrite", (s) => s.put(blob, id))),
    get: (id) => run("readonly", (s) => s.get(id) as IDBRequest<Blob | undefined>),
    delete: async (id) => void (await run("readwrite", (s) => s.delete(id))),
    keys: async () => (await run("readonly", (s) => s.getAllKeys())).map(String),
  };
}

export function memoryMediaStore(): MediaStore {
  const m = new Map<string, Blob>();
  return {
    put: async (id, b) => void m.set(id, b),
    get: async (id) => m.get(id),
    delete: async (id) => void m.delete(id),
    keys: async () => [...m.keys()],
  };
}

export const media: MediaStore = typeof indexedDB === "undefined" ? memoryMediaStore() : idbStore();

export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

/** File extension for a recording's MIME type. */
export function extFor(mime: string): string {
  if (mime.includes("webm")) return "webm";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mp4")) return mime.startsWith("audio") ? "m4a" : "mp4";
  if (mime.includes("mpeg")) return "mp3";
  if (mime.includes("wav")) return "wav";
  return "bin";
}
