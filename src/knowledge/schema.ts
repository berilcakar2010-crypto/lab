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

export const CURRICULUM_NAME = "Lab Müfredatı";
export const CURRICULUM_VERSION = "2.0.0";

export const DOMAINS = [
  "MATEMATIK", "FIZIK", "KIMYA", "BIYOLOJI", "NOROBILIM", "PROGRAMLAMA",
  "ARASTIRMA", "YARISMA", "GENEL_KULTUR", "MEDYA", "INGILIZCE", "ALMANCA", "JAPONCA",
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
