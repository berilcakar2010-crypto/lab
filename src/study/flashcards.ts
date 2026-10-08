/**
 * Flashcards with spaced repetition (SM-2 family).
 *
 * Cards come from three sources: generated from a graph object (AUTO; each has
 * a stable `autoKey`, so regenerating never duplicates), written by the learner
 * (USER) or proposed by an AI provider (AI). Grades: 0 again, 1 hard, 2 good,
 * 3 easy. Every review is kept on the card so the schedule can be audited and
 * exported.
 */
import type { CardGrade, Flashcard, ID, LabDB, Millis } from "../domain/types";
import { newId } from "../data/ids";
import { logEvent } from "../engines/analytics";
import { L } from "../i18n";
import type { KnowledgeGraph, LearningObject } from "../knowledge/schema";

const DAY = 86_400_000;
export const GRADE_LABELS = () => [L("Again", "Tekrar"), L("Hard", "Zor"), L("Good", "İyi"), L("Easy", "Kolay")] as const;

export interface CardDraft {
  front: string;
  back: string;
  kind?: Flashcard["kind"];
  tags?: string[];
  autoKey?: string;
}

export function newCard(draft: CardDraft, loId: string | undefined, source: Flashcard["source"], now = Date.now()): Flashcard {
  return {
    id: newId("card"),
    loId,
    front: draft.front.trim(),
    back: draft.back.trim(),
    kind: draft.kind ?? (/\{\{.+?\}\}/.test(draft.front) ? "CLOZE" : "BASIC"),
    source,
    autoKey: draft.autoKey,
    tags: draft.tags ?? [],
    createdAt: now,
    due: now,
    intervalDays: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    history: [],
  };
}

const list = (xs: string[]) => xs.map((x) => `• ${x}`).join("\n");

/** Cards that test understanding, not just definitions. Uses the object in the current language. */
export function autoCards(o: LearningObject, g: KnowledgeGraph): CardDraft[] {
  const t = (id: string) => g.objects[id]?.title ?? id;
  const out: CardDraft[] = [];
  const tags = [o.domain.toLowerCase(), ...o.tags.slice(0, 2)];
  out.push({ autoKey: "what", tags, front: L(`What is "${o.title}", in one or two sentences?`, `"${o.title}" nedir? Bir iki cümleyle anlat.`), back: o.description });
  out.push({ autoKey: "why", tags, front: L(`Why does "${o.title}" matter? Where does it come back?`, `"${o.title}" neden önemli? Nerede yeniden karşına çıkar?`), back: o.whyItMatters });
  o.entryQuestions.slice(0, 2).forEach((q, i) =>
    out.push({ autoKey: `entry${i}`, tags, front: `${L("Think first", "Önce düşün")}: ${q}`, back: `${o.description}\n\n${L("Check against", "Şununla karşılaştır")}:\n${list(o.learningObjectives.slice(0, 2))}` }));
  o.learningObjectives.forEach((ob, i) =>
    out.push({ autoKey: `can${i}`, tags, front: `${L("Show that you can", "Yapabildiğini göster")}: ${ob}`, back: `${L("Evidence that counts", "Geçerli kanıt")}:\n${list(o.masteryCriteria.slice(0, 2))}` }));
  o.commonMisconceptions.forEach((m, i) =>
    out.push({ autoKey: `mis${i}`, tags, front: `${L("What is wrong (or incomplete) here?", "Burada yanlış (ya da eksik) olan ne?")}\n"${m}"`, back: `${L("Common misconception in", "Şu konudaki yaygın yanılgı")} "${o.title}".\n\n${o.description}` }));
  const req = o.prerequisites.filter((p) => p.strength === "ZORUNLU").map((p) => t(p.id));
  if (req.length) out.push({ autoKey: "needs", tags, front: L(`What do you need before "${o.title}"?`, `"${o.title}" öncesinde neyi bilmen gerekir?`), back: list(req) });
  if (o.unlocks.length) out.push({ autoKey: "opens", tags, front: L(`What does "${o.title}" open up?`, `"${o.title}" hangi konuların önünü açar?`), back: list(o.unlocks.slice(0, 6).map(t)) });
  o.interdisciplinaryLinks.slice(0, 3).forEach((l, i) =>
    out.push({ autoKey: `link${i}`, tags, front: L(`How is "${o.title}" connected to "${t(l.id)}"?`, `"${o.title}" ile "${t(l.id)}" nasıl bağlantılı?`), back: l.relation }));
  return out;
}

/** Adds auto cards for an object; existing cards (same autoKey) are left untouched. Returns how many were added. */
export function addAutoCards(db: LabDB, g: KnowledgeGraph, loId: string, now = Date.now()): number {
  const o = g.objects[loId];
  if (!o) return 0;
  const have = new Set(Object.values(db.flashcards).filter((c) => c.loId === loId && c.autoKey).map((c) => c.autoKey));
  let added = 0;
  for (const d of autoCards(o, g)) {
    if (have.has(d.autoKey)) continue;
    const c = newCard(d, loId, "AUTO", now);
    db.flashcards[c.id] = c;
    added++;
  }
  if (added) logEvent(db, "CURRICULUM_EDIT", {}, { action: "flashcards_auto", lo: loId, added });
  return added;
}

export function addCards(db: LabDB, drafts: CardDraft[], loId: string | undefined, source: Flashcard["source"], now = Date.now()): Flashcard[] {
  const cards = drafts.filter((d) => d.front?.trim() && d.back?.trim()).map((d) => newCard(d, loId, source, now));
  for (const c of cards) db.flashcards[c.id] = c;
  if (cards.length) logEvent(db, "CURRICULUM_EDIT", {}, { action: "flashcards_add", lo: loId ?? null, source, added: cards.length });
  return cards;
}

/** SM-2 update. Returns the next interval in days. */
export function schedule(card: Flashcard, grade: CardGrade, now: Millis = Date.now()): Flashcard {
  let { ease, intervalDays, reps, lapses } = card;
  if (grade === 0) {
    lapses += 1;
    reps = 0;
    intervalDays = 0;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    reps += 1;
    const q = grade + 2; // map 1..3 → 3..5 on the SM-2 scale
    ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    if (reps === 1) intervalDays = grade === 3 ? 3 : 1;
    else if (reps === 2) intervalDays = grade === 1 ? 3 : 6;
    else intervalDays = Math.round(intervalDays * (grade === 1 ? 1.2 : grade === 3 ? ease * 1.3 : ease));
    intervalDays = Math.max(1, Math.min(intervalDays, 365));
  }
  // "Again" comes back in ten minutes, inside the same review.
  const due = grade === 0 ? now + 10 * 60_000 : now + intervalDays * DAY;
  return { ...card, ease, intervalDays, reps, lapses, due };
}

export function reviewCard(db: LabDB, id: ID, grade: CardGrade, ms?: number, now = Date.now()): Flashcard | undefined {
  const c = db.flashcards[id];
  if (!c) return undefined;
  const next = schedule(c, grade, now);
  next.history = [...c.history, { at: now, grade, ms }].slice(-50);
  db.flashcards[id] = next;
  logEvent(db, "FLASHCARD_REVIEW", {}, { cardId: id, lo: c.loId ?? null, grade, intervalDays: next.intervalDays });
  return next;
}

export function dueCards(db: LabDB, now = Date.now(), loId?: string): Flashcard[] {
  return Object.values(db.flashcards)
    .filter((c) => !c.suspended && c.due <= now && (!loId || c.loId === loId))
    .sort((a, b) => a.due - b.due);
}

export interface CardStats {
  total: number;
  due: number;
  learned: number;
  reviewsToday: number;
  /** Share of reviews in the last 30 days not graded "again" (null below 5 reviews). */
  retention: number | null;
}

export function cardStats(db: LabDB, now = Date.now(), loId?: string): CardStats {
  const cards = Object.values(db.flashcards).filter((c) => !loId || c.loId === loId);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const recent = cards.flatMap((c) => c.history).filter((h) => h.at >= now - 30 * DAY);
  return {
    total: cards.length,
    due: cards.filter((c) => !c.suspended && c.due <= now).length,
    learned: cards.filter((c) => c.intervalDays >= 21).length,
    reviewsToday: cards.flatMap((c) => c.history).filter((h) => h.at >= start.getTime()).length,
    retention: recent.length >= 5 ? recent.filter((h) => h.grade > 0).length / recent.length : null,
  };
}

/** Cloze: "The {{mitochondria}} makes ATP" → front with a blank, back with the answer highlighted. */
export function renderCloze(text: string, reveal: boolean): string {
  return text.replace(/\{\{(.+?)\}\}/g, (_m, a: string) => (reveal ? `[${a}]` : "[…]"));
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

const tsv = (s: string) => s.replace(/\t/g, " ").replace(/\r?\n/g, "<br>");
const csv = (s: string) => `"${s.replace(/"/g, '""')}"`;

/** Anki-compatible tab-separated file: front, back, tags. Import in Anki with "Allow HTML". */
export function exportAnki(cards: Flashcard[], g?: KnowledgeGraph): string {
  return cards
    .map((c) => {
      const front = c.kind === "CLOZE" ? c.front.replace(/\{\{(.+?)\}\}/g, "{{c1::$1}}") : c.front;
      const tags = [...c.tags, c.loId ? (g?.objects[c.loId]?.id ?? c.loId) : ""].filter(Boolean).map((t) => t.replace(/\s+/g, "_"));
      return [tsv(front), tsv(c.back), tags.join(" ")].join("\t");
    })
    .join("\n");
}

export function exportCardsCSV(cards: Flashcard[]): string {
  const head = ["id", "learning_object", "front", "back", "source", "due", "interval_days", "ease", "reps", "lapses", "reviews"].join(",");
  const rows = cards.map((c) =>
    [c.id, c.loId ?? "", c.front, c.back, c.source, new Date(c.due).toISOString(), c.intervalDays, c.ease.toFixed(2), c.reps, c.lapses, c.history.length]
      .map((v) => csv(String(v)))
      .join(","),
  );
  return [head, ...rows].join("\n");
}
