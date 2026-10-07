/**
 * Language view of graph objects. Turkish is the authored base; English comes
 * from the overlay in content/en. Missing English text falls back to Turkish
 * so a partially translated update never breaks the app.
 */
import type { Lang } from "../i18n";
import { generateMasteryCriteria } from "./dsl";
import { EN_TEXT, EN_UNITS } from "./content/en";
import type { LearningObject } from "./schema";

export function hasEnglish(id: string): boolean {
  return !!EN_TEXT[id];
}

export const unitName = (name: string, lang: Lang): string => (lang === "en" ? EN_UNITS[name] ?? name : name);

export function localizeObject(o: LearningObject, lang: Lang): LearningObject {
  if (lang === "tr") return o;
  const t = EN_TEXT[o.id];
  const field = unitName(o.field, lang);
  const unit = unitName(o.unit, lang);
  if (!t) return { ...o, field, unit };
  return {
    ...o,
    title: t.title,
    topic: t.title,
    field,
    unit,
    description: t.description,
    whyItMatters: t.whyItMatters,
    entryQuestions: t.entryQuestions,
    coreQuestions: t.coreQuestions,
    learningObjectives: t.learningObjectives,
    commonMisconceptions: t.commonMisconceptions ?? [],
    researchApplications: t.researchApplications ?? [],
    competitionApplications: t.competitionApplications ?? [],
    resourceNotes: t.notes ?? o.resourceNotes,
    masteryCriteria: t.masteryCriteria ?? (o.masteryFromEvidence ? generateMasteryCriteria(o.evidenceTypes, "en") : o.masteryCriteria),
    interdisciplinaryLinks: o.interdisciplinaryLinks.map((l) => ({ ...l, relation: t.links?.[l.id] ?? l.relation })),
  };
}
