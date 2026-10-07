/**
 * Switching language. Built-in content (packs, graph-generated courses) that the
 * learner has not edited is re-written in the new language; everything else —
 * the learner's own text, AI-generated courses, all progress — stays as it is.
 */
import type { LabDB } from "../domain/types";
import { setLang, type Lang } from "../i18n";

export function switchLanguage(db: LabDB, to: Lang): void {
  db.preferences.language = to;
  setLang(to);
}
