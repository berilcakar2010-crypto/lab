/**
 * Permanent id registry and version history of Lab Müfredatı.
 *
 * Rules (sections 5 and 35):
 *  - Every id ever issued is in ID_LEDGER and is never removed or reused.
 *  - An object that is split, merged or dropped stays in the graph with status
 *    KULLANIM_DISI / YERINE_GECILDI and `supersededBy`; it is listed in RETIRED_IDS.
 *  - Progress is never destroyed: milestones linked to a retired id are also
 *    linked to its successors (see planner.ts).
 */
import { ID_LEDGER_V2 } from "./ledger";

export const ID_LEDGER: readonly string[] = ID_LEDGER_V2;

export interface RetiredId {
  id: string;
  supersededBy: string[];
  version: string;
  reason: string;
}
/** None yet: v2.0 is the first canonical version. */
export const RETIRED_IDS: RetiredId[] = [];

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  notes: string[];
  titleEn: string;
  notesEn: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "2.1.0",
    date: "2026-10-08",
    title: "Lab Müfredatı v2.1 — iki dil, yeni alanlar, yeni AP eşlemeleri",
    notes: [
      "Tüm nesneler İngilizce ve Türkçe; temel metin Türkçe, İngilizce ayrı bir katmanda.",
      "Yeni alanlar: yer ve uzay bilimleri, çevre bilimi, psikoloji, ekonomi, yazım ve retorik, sanat ve müzik.",
      "Matematik (ön kalkülüs, geometri, istatistik), fizik, kimya, biyoloji, bilgisayar bilimi ve dünya tarihi için ek nesneler.",
      "17 AP dersinin ünite listesi College Board'un resmi metniyle karşılaştırılıp eşlendi.",
      "Hiçbir ID silinmedi ya da yeniden kullanılmadı; v2.0 ilerlemesi olduğu gibi geçerli.",
    ],
    titleEn: "Lab Curriculum v2.1 — two languages, new fields, new AP mappings",
    notesEn: [
      "Every object is available in English and Turkish; Turkish is the authored base, English a separate layer.",
      "New fields: earth & space science, environmental science, psychology, economics, writing & rhetoric, art & music.",
      "More objects for mathematics (precalculus, geometry, statistics), physics, chemistry, biology, computer science and world history.",
      "Unit lists of 17 more AP courses were checked against College Board's official text and mapped.",
      "No id was deleted or reused; v2.0 progress stays valid.",
    ],
  },
  {
    version: "2.0.0",
    date: "2026-10-07",
    title: "Lab Müfredatı v2.0 — kanonik bilgi grafiği",
    titleEn: "Lab Curriculum v2.0 — the canonical knowledge graph",
    notesEn: [
      "The knowledge graph was built from scratch; the previous version had no canonical curriculum, only the Mechanics and Calculus 1 packs.",
      "Every object got a permanent id, recorded in the id ledger.",
      "Prerequisites have four strengths: required, soft, contextual and recommended prep. Only required prerequisites gate anything.",
      "School, AP, competition and research mappings and resources moved to separate layers.",
      "Mechanics and Calculus 1 steps were linked to graph objects; existing progress was kept.",
    ],
    notes: [
      "Bilgi grafiği sıfırdan oluşturuldu; önceki sürümde kanonik bir müfredat yoktu, yalnızca Mekanik ve Kalkülüs 1 paketleri vardı.",
      "Tüm nesnelere kalıcı ID verildi ve ID defterine yazıldı.",
      "Önkoşullar dört güçte: zorunlu, yumuşak, bağlamsal, önerilen hazırlık. Yalnızca zorunlu önkoşullar kilitler.",
      "Okul, AP, yarışma ve araştırma eşlemeleri ile kaynaklar grafikten ayrı katmanlara taşındı.",
      "Mekanik ve Kalkülüs 1 adımları grafik nesnelerine bağlandı; mevcut ilerleme korunarak eşlendi.",
    ],
  },
];

/** One-off data migrations applied to a learner's database. */
export const DATA_MIGRATIONS = [
  { id: "v2-link-milestones", note: "Mevcut Mekanik/Kalkülüs adımları başlıklarına göre (Türkçe ya da eski İngilizce) grafik nesnelerine bağlandı; hiçbir kayıt silinmedi." },
] as const;
