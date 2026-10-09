/**
 * Two layers kept apart from ordinary mastery:
 *
 *  - Languages: the same concept → practice → evidence → retention model,
 *    broken down by capability (vocabulary, grammar, reading, listening,
 *    writing, speaking) from how the language objects are tagged.
 *  - Competition: performance on competition-relevant topics — accuracy,
 *    speed, the hardest problem solved, solution quality and the most common
 *    error type. A topic can be mastered without being competition-fast, and
 *    the other way round.
 */
import type { LabDB, Millis } from "../domain/types";
import type { KnowledgeGraph, Domain, LearningObject } from "../knowledge/schema";
import { domainLabel } from "../knowledge/schema";
import { L } from "../i18n";
import { masteryProfile } from "../adaptive/mastery";
import { ERROR_LABEL } from "../adaptive/errors";

export const LANGUAGE_DOMAINS: Domain[] = ["INGILIZCE", "ALMANCA", "JAPONCA"];
export const LANGUAGE_SKILLS = ["vocabulary", "grammar", "reading", "listening", "writing", "speaking"] as const;
export type LanguageSkill = (typeof LANGUAGE_SKILLS)[number];

export const SKILL_LABEL = (s: LanguageSkill): string =>
  ({ vocabulary: L("Vocabulary", "Kelime"), grammar: L("Grammar", "Dilbilgisi"), reading: L("Reading", "Okuma"), listening: L("Listening", "Dinleme"), writing: L("Writing", "Yazma"), speaking: L("Speaking", "Konuşma") })[s];

const SKILL_PATTERNS: Record<LanguageSkill, RegExp> = {
  vocabulary: /(vocab|kelime|sözcük|kanji|wortschatz)/i,
  grammar: /(grammar|dilbilgisi|grammatik|bunpo|bunpō|particle|parçacık)/i,
  reading: /(read|okuma|lesen|dokkai)/i,
  listening: /(listen|dinleme|hören|chokai)/i,
  writing: /(writ|yazma|yazım|schreib|essay|kompozisyon)/i,
  speaking: /(speak|konuşma|sprechen|telaffuz|pronunc)/i,
};

export function skillsOf(o: LearningObject): LanguageSkill[] {
  const hay = `${o.id} ${o.tags.join(" ")} ${o.title}`;
  return LANGUAGE_SKILLS.filter((s) => SKILL_PATTERNS[s].test(hay));
}

export interface LanguageReport {
  domain: Domain;
  label: string;
  skills: { skill: LanguageSkill; objects: number; touched: number; meanVerified: number | null }[];
}

/** Per language: how each capability stands, from verified evidence only. Languages never touched are left out. */
export function languageReports(db: LabDB, g: KnowledgeGraph, now: Millis = Date.now()): LanguageReport[] {
  const out: LanguageReport[] = [];
  for (const d of LANGUAGE_DOMAINS) {
    const objs = g.order.map((id) => g.objects[id]).filter((o) => o.domain === d);
    const touchedAny = objs.some((o) => masteryProfile(db, o.id, now).evidenceCount > 0);
    if (!touchedAny) continue;
    out.push({
      domain: d,
      label: domainLabel(d),
      skills: LANGUAGE_SKILLS.map((skill) => {
        const os = objs.filter((o) => skillsOf(o).includes(skill));
        const ps = os.map((o) => masteryProfile(db, o.id, now)).filter((p) => p.evidenceCount > 0);
        return { skill, objects: os.length, touched: ps.length, meanVerified: ps.length ? ps.reduce((s, p) => s + p.verified, 0) / ps.length : null };
      }).filter((s) => s.objects > 0),
    });
  }
  return out;
}

export interface CompetitionReport {
  attempts: number;
  /** First-try accuracy (0..1) or null when there are too few attempts. */
  accuracy: number | null;
  /** Median seconds per answered problem. */
  medianSeconds: number | null;
  hardestSolved: number | null;
  /** Mean score on open (rubric-judged) solutions. */
  solutionQuality: number | null;
  topError?: string;
  topics: number;
}

/** Topics that count as competition practice: the competition field, objects with competition uses, or a subject's topics. */
export function competitionTopics(g: KnowledgeGraph, loIds?: string[]): Set<string> {
  if (loIds?.length) return new Set(loIds.filter((id) => g.objects[id]));
  return new Set(g.order.filter((id) => g.objects[id].domain === "YARISMA" || g.objects[id].competitionApplications.length > 0));
}

export function competitionReport(db: LabDB, g: KnowledgeGraph, loIds?: string[], minN = 5): CompetitionReport {
  const topics = competitionTopics(g, loIds);
  const atts = Object.values(db.attempts).filter((a) => a.correct !== null && (db.milestones[a.milestoneId]?.learningObjectIds ?? []).some((lo) => topics.has(lo)));
  const first = atts.filter((a) => !a.isRetry);
  const secs = atts.filter((a) => a.durationMs > 0).map((a) => a.durationMs / 1000).sort((a, b) => a - b);
  const solved = atts.filter((a) => a.correct && a.hintLevelUsed < 5).map((a) => db.questions[a.questionId]?.difficulty ?? 0);
  const open = atts.filter((a) => a.evaluatedBy !== "auto");
  const errs = new Map<string, number>();
  for (const e of Object.values(db.errors)) if (e.loIds.some((lo) => topics.has(lo))) errs.set(e.category, (errs.get(e.category) ?? 0) + 1);
  const top = [...errs].sort((a, b) => b[1] - a[1])[0];
  return {
    attempts: atts.length,
    accuracy: first.length >= minN ? first.filter((a) => a.correct).length / first.length : null,
    medianSeconds: secs.length >= minN ? secs[Math.floor(secs.length / 2)] : null,
    hardestSolved: solved.length ? Math.max(...solved) : null,
    solutionQuality: open.length >= minN ? open.reduce((s, a) => s + a.score, 0) / open.length : null,
    topError: top ? ERROR_LABEL(top[0] as never) : undefined,
    topics: topics.size,
  };
}
