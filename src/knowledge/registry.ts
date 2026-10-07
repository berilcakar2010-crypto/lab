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
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "2.0.0",
    date: "2026-10-07",
    title: "Lab Müfredatı v2.0 — kanonik bilgi grafiği",
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
