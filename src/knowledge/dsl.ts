/**
 * A compact authoring format for the canonical graph. Content files describe
 * objects with short keys; `builder` expands them into full LearningObjects so
 * the content stays readable and every object gets the same defaults.
 *
 * Prerequisite strength is written as a suffix:
 *   "math.calc.limits"     ZORUNLU
 *   "math.calc.limits~s"   YUMUŞAK
 *   "math.calc.limits~c"   BAĞLAMSAL
 *   "math.calc.limits~h"   ÖNERİLEN HAZIRLIK
 * Interdisciplinary links are "target.id:ilişki".
 */
import {
  CURRICULUM_VERSION, EVIDENCE_LABEL, EVIDENCE_TYPES, LO_MILESTONE_TYPES,
  type Domain, type EvidenceType, type LearningObject, type LOMilestoneType, type LOStatus,
  type Prerequisite, type PrereqStrength, type ReviewStatus, type Scope,
} from "./schema";

export const LAST_REVIEWED = "2026-10-07";

export interface LOSpec {
  /** description */
  d: string;
  /** whyItMatters */
  w: string;
  /** prerequisites, with strength suffixes */
  pre?: string[];
  /** entry question(s): active thinking prompts, not definitions */
  q: string | string[];
  /** core questions the object answers */
  cq?: string[];
  /** action-based learning objectives */
  obj: string[];
  /** evidence types, space separated */
  ev: string;
  /** explicit mastery criteria; generated from objectives and evidence when absent */
  mc?: string[];
  /** milestone type */
  t: LOMilestoneType;
  /** difficulty 1–5 */
  lv: number;
  sc: Scope;
  /** interdisciplinary links "id:relation" */
  x?: string[];
  mis?: string[];
  ra?: string[];
  ca?: string[];
  rel?: string[];
  vs?: string[];
  tags?: string[];
  opt?: boolean;
  ch?: boolean;
  boss?: boolean;
  /** reviewable; defaults to true */
  rev?: boolean;
  /** factual claims that must be checked against sources */
  src?: boolean;
  status?: LOStatus;
  review?: ReviewStatus;
  topic?: string;
  notes?: string[];
}

const STRENGTH_SUFFIX: Record<string, PrereqStrength> = {
  "": "ZORUNLU", s: "YUMUSAK", c: "BAGLAMSAL", h: "ONERILEN_HAZIRLIK",
};

export function parsePrereq(raw: string): Prerequisite {
  const [id, suffix = ""] = raw.split("~");
  const strength = STRENGTH_SUFFIX[suffix];
  if (!strength) throw new Error(`Bilinmeyen önkoşul gücü: ${raw}`);
  return { id: id.trim(), strength };
}

export function parseEvidence(raw: string): EvidenceType[] {
  const out: EvidenceType[] = [];
  for (const token of raw.split(/\s+/).filter(Boolean)) {
    if (!(EVIDENCE_TYPES as readonly string[]).includes(token)) throw new Error(`Bilinmeyen kanıt türü: ${token}`);
    if (!out.includes(token as EvidenceType)) out.push(token as EvidenceType);
  }
  return out;
}

const EVIDENCE_CRITERION: Record<EvidenceType, string> = {
  HATIRLAMA: "Temel terimleri ve sonuçları yardım almadan doğru hatırlar.",
  ACIKLAMA: "Fikri kendi sözleriyle, bir örnek ve bir karşı örnekle açıklar.",
  HESAPLAMA: "Yeni sayılarla en az üç hesaplamayı ipucusuz ve doğru yapar.",
  PROBLEM_COZME: "Daha önce görmediği çok adımlı bir problemi stratejisini gerekçelendirerek çözer.",
  TURETME: "Temel sonucu ilk ilkelerden adım adım türetir ve her adımı gerekçelendirir.",
  ISPAT: "Ana sonucun ispatını yazar; her mantıksal adımın neden geçerli olduğunu söyler.",
  MODELLEME: "Gerçek bir durumu varsayımlarını açıkça yazarak bir modele dönüştürür ve modelin sınırını söyler.",
  TAHMIN: "Sonucu hesaplamadan önce tahmin eder ve tahmini sonuçla karşılaştırıp farkı açıklar.",
  YORUMLAMA: "Bir grafiği, tabloyu ya da metni okuyup doğru ve gerekçeli bir yorum çıkarır.",
  KODLAMA: "Çalışan, okunur bir kod yazar ve bir test durumuyla doğruluğunu gösterir.",
  SIMULASYON: "Bir simülasyon kurar ya da kullanır, parametre değiştirince ne olacağını önceden söyler.",
  DIAGRAM: "Durumu doğru bir diyagramla (kuvvet, akış, devre, kavram haritası…) temsil eder.",
  DENEY: "Bir deney ya da gözlem tasarlar, değişkenleri ayırır ve sonucu belirsizliğiyle raporlar.",
  VERI_ANALIZI: "Gerçek ya da gerçekçi bir veri setini analiz eder ve sonucun ne kadar güvenilir olduğunu belirtir.",
  TRANSFER: "Fikri farklı bir alanda ya da beklenmedik bir bağlamda doğru kullanır.",
  ARASTIRMA_UYGULAMASI: "Fikri küçük bir araştırma sorusuna uygular ve bulguyu kaynaklarıyla yazar.",
};

/** Mastery is evidence, not a feeling: one concrete criterion per evidence type. */
export function generateMasteryCriteria(evidence: EvidenceType[]): string[] {
  return evidence.map((e) => `${EVIDENCE_LABEL[e]}: ${EVIDENCE_CRITERION[e]}`);
}

export interface Builder {
  /** Sets the field and unit for the following objects. */
  unit(field: string, unit: string): Builder;
  o(id: string, title: string, spec: LOSpec): Builder;
  done(): LearningObject[];
}

export function builder(domain: Domain): Builder {
  const out: LearningObject[] = [];
  let field = "";
  let unit = "";
  const b: Builder = {
    unit(f, u) {
      field = f;
      unit = u;
      return b;
    },
    o(id, title, s) {
      if (!LO_MILESTONE_TYPES.includes(s.t)) throw new Error(`${id}: bilinmeyen tür ${s.t}`);
      const evidence = parseEvidence(s.ev);
      const links = (s.x ?? []).map((raw) => {
        const i = raw.indexOf(":");
        return i < 0 ? { id: raw.trim(), relation: "ilişkili" } : { id: raw.slice(0, i).trim(), relation: raw.slice(i + 1).trim() };
      });
      out.push({
        id,
        stableId: id,
        title,
        domain,
        field,
        unit,
        topic: s.topic ?? title,
        description: s.d,
        whyItMatters: s.w,
        prerequisites: (s.pre ?? []).map(parsePrereq),
        unlocks: [],
        entryQuestions: Array.isArray(s.q) ? s.q : [s.q],
        coreQuestions: s.cq ?? [],
        learningObjectives: s.obj,
        masteryCriteria: s.mc ?? generateMasteryCriteria(evidence),
        evidenceTypes: evidence,
        difficulty: s.lv,
        estimatedScope: s.sc,
        milestoneType: s.boss ? "BOSS" : s.t,
        status: s.status ?? "AKTIF",
        optional: !!s.opt,
        required: !s.opt,
        challenge: !!s.ch,
        boss: !!s.boss,
        reviewable: s.rev ?? true,
        interdisciplinaryLinks: links,
        researchApplications: s.ra ?? [],
        competitionApplications: s.ca ?? [],
        schoolMappings: [],
        apMappings: [],
        recommendedResources: [],
        resourceNotes: s.notes ?? [],
        commonMisconceptions: s.mis ?? [],
        relatedConcepts: s.rel ?? [],
        contrastsWith: s.vs ?? [],
        tags: s.tags ?? [],
        version: CURRICULUM_VERSION,
        lastReviewed: LAST_REVIEWED,
        reviewStatus: s.review ?? (s.src ? "KAYNAK_GEREKLI" : "TASLAK"),
        requiresSources: !!s.src,
      });
      return b;
    },
    done: () => out,
  };
  return b;
}
