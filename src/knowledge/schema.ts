/**
 * Lab Müfredatı v2.0 — the canonical knowledge graph.
 *
 * The graph is time-independent: it describes what can be learned and how
 * ideas depend on each other, never *when* the learner studies them. Personal
 * plans (courses, milestones, sessions) are views that link to graph objects
 * by stable id. School, AP, competition and research mappings and learning
 * resources live in separate layers (`mappings.ts`, `resources.ts`) so they can
 * change without touching the graph.
 */

import { L, pick } from "../i18n";

export const CURRICULUM_NAME_TR = "Lab Müfredatı";
export const CURRICULUM_NAME_EN = "Lab Curriculum";
export const curriculumName = () => L(CURRICULUM_NAME_EN, CURRICULUM_NAME_TR);
/** Kept for stored data and exports; the UI uses curriculumName(). */
export const CURRICULUM_NAME = CURRICULUM_NAME_TR;
export const CURRICULUM_VERSION = "2.1.0";

export const DOMAINS = [
  "MATEMATIK", "FIZIK", "KIMYA", "BIYOLOJI", "NOROBILIM", "PROGRAMLAMA",
  "ARASTIRMA", "YARISMA", "YER_UZAY", "CEVRE", "PSIKOLOJI", "EKONOMI", "GENEL_KULTUR", "YAZIM", "SANAT_MUZIK",
  "MEDYA", "INGILIZCE", "ALMANCA", "JAPONCA",
] as const;
export type Domain = (typeof DOMAINS)[number];

export const DOMAIN_LABEL: Record<Domain, string> = {
  MATEMATIK: "Matematik",
  FIZIK: "Fizik",
  KIMYA: "Kimya",
  BIYOLOJI: "Biyoloji",
  NOROBILIM: "Nörobilim",
  PROGRAMLAMA: "Programlama ve hesaplama",
  ARASTIRMA: "Araştırma becerileri",
  YARISMA: "Yarışma ve meta beceriler",
  YER_UZAY: "Yer ve uzay bilimleri",
  CEVRE: "Çevre bilimi",
  PSIKOLOJI: "Psikoloji",
  EKONOMI: "Ekonomi",
  YAZIM: "Yazım ve retorik",
  SANAT_MUZIK: "Sanat ve müzik",
  GENEL_KULTUR: "Genel kültür",
  MEDYA: "Medya okuryazarlığı",
  INGILIZCE: "İngilizce",
  ALMANCA: "Almanca",
  JAPONCA: "Japonca",
};

/** How strongly a prerequisite is needed. Only ZORUNLU ever locks anything. */
export const PREREQ_STRENGTHS = ["ZORUNLU", "YUMUSAK", "BAGLAMSAL", "ONERILEN_HAZIRLIK"] as const;
export type PrereqStrength = (typeof PREREQ_STRENGTHS)[number];
export const STRENGTH_LABEL: Record<PrereqStrength, string> = {
  ZORUNLU: "Zorunlu",
  YUMUSAK: "Yumuşak",
  BAGLAMSAL: "Bağlamsal",
  ONERILEN_HAZIRLIK: "Önerilen hazırlık",
};
export const STRENGTH_HELP: Record<PrereqStrength, string> = {
  ZORUNLU: "Bu olmadan nesne anlamlı biçimde öğrenilemez.",
  YUMUSAK: "Bilmek işi çok kolaylaştırır; eksikse yol üstünde tamamlanabilir.",
  BAGLAMSAL: "Yalnızca belirli uygulamalar ya da yollar için gerekir.",
  ONERILEN_HAZIRLIK: "Isınma olarak önerilir; atlanabilir.",
};

export const EVIDENCE_TYPES = [
  "HATIRLAMA", "ACIKLAMA", "HESAPLAMA", "PROBLEM_COZME", "TURETME", "ISPAT", "MODELLEME", "TAHMIN",
  "YORUMLAMA", "KODLAMA", "SIMULASYON", "DIAGRAM", "DENEY", "VERI_ANALIZI", "TRANSFER", "ARASTIRMA_UYGULAMASI",
] as const;
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];
export const EVIDENCE_LABEL: Record<EvidenceType, string> = {
  HATIRLAMA: "Hatırlama",
  ACIKLAMA: "Açıklama",
  HESAPLAMA: "Hesaplama",
  PROBLEM_COZME: "Problem çözme",
  TURETME: "Türetme",
  ISPAT: "İspat",
  MODELLEME: "Modelleme",
  TAHMIN: "Tahmin",
  YORUMLAMA: "Yorumlama",
  KODLAMA: "Kodlama",
  SIMULASYON: "Simülasyon",
  DIAGRAM: "Diyagram",
  DENEY: "Deney",
  VERI_ANALIZI: "Veri analizi",
  TRANSFER: "Transfer",
  ARASTIRMA_UYGULAMASI: "Araştırma uygulaması",
};

export const LO_MILESTONE_TYPES = [
  "KAVRAM", "BECERI", "PRATIK", "UYGULAMA", "TURETME", "ISPAT", "MODELLEME", "VERI_ANALIZI", "KODLAMA",
  "DENEY", "TEKRAR", "TRANSFER", "CHALLENGE", "BOSS", "PROJE", "ARASTIRMA",
] as const;
export type LOMilestoneType = (typeof LO_MILESTONE_TYPES)[number];
export const LO_TYPE_LABEL: Record<LOMilestoneType, string> = {
  KAVRAM: "Kavram", BECERI: "Beceri", PRATIK: "Pratik", UYGULAMA: "Uygulama", TURETME: "Türetme",
  ISPAT: "İspat", MODELLEME: "Modelleme", VERI_ANALIZI: "Veri analizi", KODLAMA: "Kodlama", DENEY: "Deney",
  TEKRAR: "Tekrar", TRANSFER: "Transfer", CHALLENGE: "Meydan okuma", BOSS: "Boss", PROJE: "Proje",
  ARASTIRMA: "Araştırma",
};

/** Rough size of the object; milestones are generated from it (section 41). */
export const SCOPES = ["XS", "S", "M", "L", "XL"] as const;
export type Scope = (typeof SCOPES)[number];
export const SCOPE_LABEL: Record<Scope, string> = {
  XS: "çok küçük (tek oturum)",
  S: "küçük (1–2 oturum)",
  M: "orta (birkaç oturum)",
  L: "büyük (bir-iki hafta)",
  XL: "çok büyük (birkaç hafta)",
};
/** Minimum and maximum number of micro-milestones an object should split into. */
export const SCOPE_MILESTONES: Record<Scope, [number, number]> = {
  XS: [1, 1], S: [1, 2], M: [2, 4], L: [3, 6], XL: [5, 9],
};

export const LO_STATUSES = ["AKTIF", "TASLAK", "YER_TUTUCU", "KULLANIM_DISI", "YERINE_GECILDI"] as const;
export type LOStatus = (typeof LO_STATUSES)[number];

export const REVIEW_STATUSES = ["GOZDEN_GECIRILDI", "TASLAK", "KAYNAK_GEREKLI"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
export const REVIEW_LABEL: Record<ReviewStatus, string> = {
  GOZDEN_GECIRILDI: "Gözden geçirildi",
  TASLAK: "Taslak",
  KAYNAK_GEREKLI: "Kaynakla doğrulanmalı",
};

export interface Prerequisite {
  id: string;
  strength: PrereqStrength;
  /** Why this prerequisite matters; optional. */
  note?: string;
}

export interface InterdisciplinaryLink {
  /** Target learning object id; a real graph edge, not free text. */
  id: string;
  /** How the two ideas relate, e.g. "aynı matematik", "model olarak kullanır". */
  relation: string;
}

export interface LearningObject {
  /** Permanent id; never reused, never renamed. */
  id: string;
  /** Other names the object is known by (old titles, synonyms); used by search. A rename keeps the id. */
  aliases?: string[];
  /** Equal to `id`. Kept separately so a superseded object keeps its identity. */
  stableId: string;
  title: string;
  domain: Domain;
  field: string;
  unit: string;
  topic: string;
  description: string;
  whyItMatters: string;
  prerequisites: Prerequisite[];
  /** Possible next steps (inverse of prerequisites). Never an obligation. */
  unlocks: string[];
  entryQuestions: string[];
  coreQuestions: string[];
  learningObjectives: string[];
  masteryCriteria: string[];
  evidenceTypes: EvidenceType[];
  /** 1 (giriş) … 5 (ileri araştırma). */
  difficulty: number;
  estimatedScope: Scope;
  milestoneType: LOMilestoneType;
  status: LOStatus;
  optional: boolean;
  required: boolean;
  challenge: boolean;
  boss: boolean;
  reviewable: boolean;
  interdisciplinaryLinks: InterdisciplinaryLink[];
  researchApplications: string[];
  competitionApplications: string[];
  /** Ids into the mapping layer; filled when the graph is assembled. */
  schoolMappings: string[];
  apMappings: string[];
  recommendedResources: string[];
  resourceNotes: string[];
  commonMisconceptions: string[];
  relatedConcepts: string[];
  contrastsWith: string[];
  tags: string[];
  version: string;
  lastReviewed: string;
  reviewStatus: ReviewStatus;
  /** Content makes factual claims (dates, events, people) that need a source. */
  requiresSources: boolean;
  /** For deprecated/split/merged objects: the ids that replace this one. */
  supersededBy?: string[];
  /** Mastery criteria were generated from evidence types (so they can be generated in any language). */
  masteryFromEvidence?: boolean;
}

// ---------------------------------------------------------------------------
// Mapping and resource layers
// ---------------------------------------------------------------------------

export const MAPPING_STATUSES = ["DOGRULANMIS", "GECICI", "BILINMIYOR"] as const;
export type MappingStatus = (typeof MAPPING_STATUSES)[number];
export const MAPPING_STATUS_LABEL: Record<MappingStatus, string> = {
  DOGRULANMIS: "Doğrulanmış",
  GECICI: "Geçici",
  BILINMIYOR: "Bilinmiyor",
};

export const MAPPING_SYSTEMS = ["OKUL", "AP", "YARISMA", "ARASTIRMA"] as const;
export type MappingSystem = (typeof MAPPING_SYSTEMS)[number];

export interface Mapping {
  id: string;
  system: MappingSystem;
  /** e.g. "MEB 10. sınıf Fizik", "AP Calculus BC", "TÜBİTAK Fizik Olimpiyatı". */
  framework: string;
  /** Unit or section label inside the framework. */
  unit: string;
  loIds: string[];
  status: MappingStatus;
  /** Where the mapping was checked; required for DOGRULANMIS. */
  source?: string;
  checkedAt?: string;
  note?: string;
  noteEn?: string;
}

export const RESOURCE_KINDS = ["KITAP", "DERS", "VIDEO", "SITE", "ARAC", "MAKALE", "VERI"] as const;
export type ResourceKind = (typeof RESOURCE_KINDS)[number];

export interface Resource {
  id: string;
  title: string;
  kind: ResourceKind;
  author?: string;
  url?: string;
  language: "tr" | "en" | "de" | "ja" | "çok";
  /** Learning objects this resource serves; many-to-many. */
  loIds: string[];
  note?: string;
}

// ---------------------------------------------------------------------------
// Assembled graph
// ---------------------------------------------------------------------------

export interface KnowledgeGraph {
  name: string;
  version: string;
  objects: Record<string, LearningObject>;
  /** Stable display order. */
  order: string[];
  mappings: Record<string, Mapping>;
  resources: Record<string, Resource>;
}

// ---------------------------------------------------------------------------
// English labels and language-aware getters (the *_LABEL maps above are Turkish)
// ---------------------------------------------------------------------------

export const DOMAIN_LABEL_EN: Record<Domain, string> = {
  MATEMATIK: "Mathematics", FIZIK: "Physics", KIMYA: "Chemistry", BIYOLOJI: "Biology", NOROBILIM: "Neuroscience",
  PROGRAMLAMA: "Programming & computing", ARASTIRMA: "Research skills", YARISMA: "Competitions & meta-skills",
  YER_UZAY: "Earth & space science", CEVRE: "Environmental science", PSIKOLOJI: "Psychology", EKONOMI: "Economics",
  GENEL_KULTUR: "General knowledge", YAZIM: "Writing & rhetoric", SANAT_MUZIK: "Art & music",
  MEDYA: "Media literacy", INGILIZCE: "English", ALMANCA: "German", JAPONCA: "Japanese",
};
const STRENGTH_LABEL_EN: Record<PrereqStrength, string> = {
  ZORUNLU: "Required", YUMUSAK: "Soft", BAGLAMSAL: "Contextual", ONERILEN_HAZIRLIK: "Recommended prep",
};
const STRENGTH_HELP_EN: Record<PrereqStrength, string> = {
  ZORUNLU: "This object cannot be learned meaningfully without it.",
  YUMUSAK: "Knowing it makes things much easier; gaps can be filled along the way.",
  BAGLAMSAL: "Needed only for some applications or paths.",
  ONERILEN_HAZIRLIK: "Suggested as a warm-up; can be skipped.",
};
export const EVIDENCE_LABEL_EN: Record<EvidenceType, string> = {
  HATIRLAMA: "Recall", ACIKLAMA: "Explanation", HESAPLAMA: "Calculation", PROBLEM_COZME: "Problem solving",
  TURETME: "Derivation", ISPAT: "Proof", MODELLEME: "Modelling", TAHMIN: "Prediction", YORUMLAMA: "Interpretation",
  KODLAMA: "Coding", SIMULASYON: "Simulation", DIAGRAM: "Diagram", DENEY: "Experiment", VERI_ANALIZI: "Data analysis",
  TRANSFER: "Transfer", ARASTIRMA_UYGULAMASI: "Research application",
};
const LO_TYPE_LABEL_EN: Record<LOMilestoneType, string> = {
  KAVRAM: "Concept", BECERI: "Skill", PRATIK: "Practice", UYGULAMA: "Application", TURETME: "Derivation",
  ISPAT: "Proof", MODELLEME: "Modelling", VERI_ANALIZI: "Data analysis", KODLAMA: "Coding", DENEY: "Experiment",
  TEKRAR: "Review", TRANSFER: "Transfer", CHALLENGE: "Challenge", BOSS: "Boss", PROJE: "Project", ARASTIRMA: "Research",
};
const SCOPE_LABEL_EN: Record<Scope, string> = {
  XS: "very small (one session)", S: "small (1–2 sessions)", M: "medium (a few sessions)",
  L: "large (a week or two)", XL: "very large (several weeks)",
};
const REVIEW_LABEL_EN: Record<ReviewStatus, string> = {
  GOZDEN_GECIRILDI: "Reviewed", TASLAK: "Draft", KAYNAK_GEREKLI: "Needs source check",
};
const MAPPING_STATUS_LABEL_EN: Record<MappingStatus, string> = {
  DOGRULANMIS: "Verified", GECICI: "Provisional", BILINMIYOR: "Unknown",
};

export const domainLabel = (d: Domain) => pick(DOMAIN_LABEL_EN, DOMAIN_LABEL)[d] ?? d;
export const strengthLabel = (s: PrereqStrength) => pick(STRENGTH_LABEL_EN, STRENGTH_LABEL)[s];
export const strengthHelp = (s: PrereqStrength) => pick(STRENGTH_HELP_EN, STRENGTH_HELP)[s];
export const evidenceLabel = (e: EvidenceType) => pick(EVIDENCE_LABEL_EN, EVIDENCE_LABEL)[e];
export const loTypeLabel = (t: LOMilestoneType) => pick(LO_TYPE_LABEL_EN, LO_TYPE_LABEL)[t];
export const scopeLabel = (s: Scope) => pick(SCOPE_LABEL_EN, SCOPE_LABEL)[s];
export const reviewLabel = (r: ReviewStatus) => pick(REVIEW_LABEL_EN, REVIEW_LABEL)[r];
export const mappingStatusLabel = (m: MappingStatus) => pick(MAPPING_STATUS_LABEL_EN, MAPPING_STATUS_LABEL)[m];

/** English text for one object. Turkish is the authored base; English is an overlay by id. */
export interface LOText {
  title: string;
  description: string;
  whyItMatters: string;
  entryQuestions: string[];
  coreQuestions: string[];
  learningObjectives: string[];
  commonMisconceptions?: string[];
  researchApplications?: string[];
  competitionApplications?: string[];
  /** Only when the Turkish object has explicit (not evidence-generated) mastery criteria. */
  masteryCriteria?: string[];
  /** Interdisciplinary relation text by target id. */
  links?: Record<string, string>;
  notes?: string[];
}
