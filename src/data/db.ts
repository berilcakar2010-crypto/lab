import { SCHEMA_VERSION, type LabDB } from "../domain/types";
import { newId } from "./ids";

export function createEmptyDB(now = Date.now()): LabDB {
  const userId = newId("user");
  return {
    schemaVersion: SCHEMA_VERSION,
    user: { id: userId, name: "Learner", createdAt: now },
    preferences: {
      userId,
      aiProvider: "local",
      apiKeys: {},
      models: { gemini: "gemini-2.5-flash", groq: "llama-3.3-70b-versatile" },
      hintCap: 3,
      reduceMotion: false,
      experimentsEnabled: true,
      retentionDelayDays: 3,
    },
    subjects: {},
    curricula: {},
    courses: {},
    units: {},
    topics: {},
    concepts: {},
    milestones: {},
    questions: {},
    attempts: {},
    sessions: {},
    aiInteractions: {},
    mastery: {},
    retention: {},
    experiments: {},
    experimentResults: {},
    engagement: {},
    events: [],
  };
}

const TABLE_KEYS = [
  "subjects", "curricula", "courses", "units", "topics", "concepts", "milestones",
  "questions", "attempts", "sessions", "aiInteractions", "mastery", "retention",
  "experiments", "experimentResults", "engagement",
] as const;

/**
 * Parse and migrate a persisted database. Missing tables/fields are filled from
 * defaults so older or partially written data never crashes the app.
 */
export function hydrateDB(raw: unknown): LabDB {
  const base = createEmptyDB();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<LabDB>;
  const db: LabDB = {
    ...base,
    ...r,
    schemaVersion: SCHEMA_VERSION,
    user: { ...base.user, ...(r.user ?? {}) },
    preferences: {
      ...base.preferences,
      ...(r.preferences ?? {}),
      models: { ...base.preferences.models, ...(r.preferences?.models ?? {}) },
      apiKeys: { ...(r.preferences?.apiKeys ?? {}) },
    },
    events: Array.isArray(r.events) ? r.events : [],
  };
  for (const k of TABLE_KEYS) {
    const t = (r as Record<string, unknown>)[k];
    (db as unknown as Record<string, unknown>)[k] = t && typeof t === "object" && !Array.isArray(t) ? t : {};
  }
  db.preferences.userId = db.user.id;
  return db;
}
