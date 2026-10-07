/**
 * Graph validator (section 33). Reports problems; never repairs or deletes.
 * Disconnected objects in particular are only reported, never removed.
 */
import { findCycle } from "../engines/graph";
import { prereqMap } from "./graph";
import { ID_LEDGER, RETIRED_IDS } from "./registry";
import type { KnowledgeGraph, LearningObject } from "./schema";

export type Severity = "HATA" | "UYARI" | "BILGI";
export const SEVERITY_LABEL: Record<Severity, string> = { HATA: "Hata", UYARI: "Uyarı", BILGI: "Bilgi" };

export const ISSUE_CODES = [
  "EKSIK_ONKOSUL", "IMKANSIZ_ONKOSUL", "DONGU", "BAGLANTISIZ", "YINELENEN_ID", "YINELENEN_BASLIK",
  "BELIRSIZ_USTALIK", "EYLEMSIZ_HEDEF", "GIRIS_SORUSU_YOK", "KANIT_YOK", "ILERI_ONKOSULSUZ", "ILERI_TURETMESIZ",
  "DISIPLINLERARASI_YOK", "BILINMEYEN_BAGLANTI", "ESKIMIS_ESLEME", "ESLEME_KAYNAKSIZ", "ESLEME_BILINMEYEN_NESNE",
  "DOGRULANMAMIS_TARIH", "KAYNAKSIZ_ICERIK", "COK_BUYUK", "COK_KUCUK", "KAYITSIZ_ID", "KAYBOLAN_ID",
] as const;
export type IssueCode = (typeof ISSUE_CODES)[number];

export const ISSUE_LABEL: Record<IssueCode, string> = {
  EKSIK_ONKOSUL: "Var olmayan önkoşul",
  IMKANSIZ_ONKOSUL: "İmkânsız önkoşul",
  DONGU: "Önkoşul döngüsü",
  BAGLANTISIZ: "Bağlantısız nesne",
  YINELENEN_ID: "Yinelenen ID",
  YINELENEN_BASLIK: "Olası kopya",
  BELIRSIZ_USTALIK: "Belirsiz ustalık ölçütü",
  EYLEMSIZ_HEDEF: "Eylem içermeyen hedef",
  GIRIS_SORUSU_YOK: "Giriş sorusu yok",
  KANIT_YOK: "Kanıt türü yok",
  ILERI_ONKOSULSUZ: "Önkoşulsuz ileri nesne",
  ILERI_TURETMESIZ: "İleri nesnede türetme/ispat yok",
  DISIPLINLERARASI_YOK: "Disiplinlerarası bağlantı yok",
  BILINMEYEN_BAGLANTI: "Var olmayan nesneye bağlantı",
  ESKIMIS_ESLEME: "Eskimiş eşleme",
  ESLEME_KAYNAKSIZ: "Kaynaksız doğrulanmış eşleme",
  ESLEME_BILINMEYEN_NESNE: "Eşleme var olmayan nesneyi gösteriyor",
  DOGRULANMAMIS_TARIH: "Doğrulanmamış tarihsel iddia",
  KAYNAKSIZ_ICERIK: "Kaynak gerektiren ama kaynağı olmayan içerik",
  COK_BUYUK: "Aşırı büyük nesne",
  COK_KUCUK: "Önemsiz derecede küçük nesne",
  KAYITSIZ_ID: "ID defterinde olmayan ID",
  KAYBOLAN_ID: "Defterdeki ID grafikte yok",
};

export interface Issue {
  severity: Severity;
  code: IssueCode;
  loId?: string;
  message: string;
}

const VAGUE = /(^|\s)(anlar|bilir|kavrar|aşina|farkında|rahat|öğrenir)(\s|[.,;]|$)/i;
const NON_ACTION_END = /(^|\s)(anlar|bilir|kavrar|öğrenir|farkındadır|aşinadır)\.?$/i;
const WHAT_IS = /^\s*[^.?!]{0,60}\bnedir\s*\?\s*$/i;
const STALE_DAYS = 365;

export interface ValidateOptions {
  /** Raw object list before de-duplication, to detect duplicate ids. */
  raw?: LearningObject[];
  now?: Date;
  /** Skip ledger checks (e.g. for a proposed update before it is recorded). */
  ledger?: boolean;
  /** Ids recorded by applied updates; they extend the static ledger. */
  knownIds?: string[];
}

export function validateGraph(g: KnowledgeGraph, opts: ValidateOptions = {}): Issue[] {
  const issues: Issue[] = [];
  const add = (severity: Severity, code: IssueCode, message: string, loId?: string) => issues.push({ severity, code, message, loId });
  const now = opts.now ?? new Date();

  if (opts.raw) {
    const seen = new Set<string>();
    for (const o of opts.raw) {
      if (seen.has(o.id)) add("HATA", "YINELENEN_ID", `"${o.id}" ID'si birden fazla nesnede kullanılmış.`, o.id);
      seen.add(o.id);
    }
  }

  const titles = new Map<string, string>();
  const incoming = new Set<string>();
  for (const id of g.order) for (const l of g.objects[id].interdisciplinaryLinks) incoming.add(l.id);

  for (const id of g.order) {
    const o = g.objects[id];
    const retired = o.status === "KULLANIM_DISI" || o.status === "YERINE_GECILDI";
    if (retired || o.status === "YER_TUTUCU") continue;

    for (const p of o.prerequisites) {
      const target = g.objects[p.id];
      if (!target) {
        add("HATA", "EKSIK_ONKOSUL", `"${o.title}" var olmayan bir önkoşula dayanıyor: ${p.id}.`, id);
      } else if (p.id === id) {
        add("HATA", "IMKANSIZ_ONKOSUL", `"${o.title}" kendisinin önkoşulu olamaz.`, id);
      } else if (target.status === "KULLANIM_DISI" || target.status === "YERINE_GECILDI") {
        add("HATA", "IMKANSIZ_ONKOSUL", `"${o.title}" kullanımdan kalkmış "${target.title}" nesnesine dayanıyor; yerine ${target.supersededBy?.join(", ") || "?"} kullanılmalı.`, id);
      } else if (target.status === "YER_TUTUCU") {
        add("HATA", "IMKANSIZ_ONKOSUL", `"${o.title}" içeriği olmayan bir yer tutucuya dayanıyor.`, id);
      } else if (p.strength === "ZORUNLU" && target.optional && !o.optional) {
        add("UYARI", "IMKANSIZ_ONKOSUL", `Zorunlu "${o.title}", isteğe bağlı "${target.title}" nesnesini zorunlu önkoşul olarak istiyor.`, id);
      } else if (p.strength === "ZORUNLU" && target.difficulty > o.difficulty + 1) {
        add("UYARI", "IMKANSIZ_ONKOSUL", `"${o.title}" (zorluk ${o.difficulty}) kendisinden çok daha zor "${target.title}" (zorluk ${target.difficulty}) nesnesini zorunlu istiyor.`, id);
      }
    }

    for (const ref of [...o.interdisciplinaryLinks.map((l) => l.id), ...o.relatedConcepts, ...o.contrastsWith]) {
      if (!g.objects[ref]) add("HATA", "BILINMEYEN_BAGLANTI", `"${o.title}" var olmayan bir nesneye bağlanıyor: ${ref}.`, id);
    }

    const connected = o.prerequisites.length || o.unlocks.length || o.interdisciplinaryLinks.length || incoming.has(id);
    if (!connected) add("UYARI", "BAGLANTISIZ", `"${o.title}" grafiğin geri kalanına bağlı değil. Otomatik silinmez; bağlantı eklenmeli ya da bilerek böyle bırakılmalı.`, id);

    const tkey = `${o.domain}|${o.title.toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}]+/gu, " ").trim()}`;
    if (titles.has(tkey)) add("UYARI", "YINELENEN_BASLIK", `"${o.title}" başlığı ${titles.get(tkey)} ile aynı; kopya olabilir.`, id);
    else titles.set(tkey, id);

    if (!o.masteryCriteria.length) add("HATA", "BELIRSIZ_USTALIK", `"${o.title}" için ustalık ölçütü yok.`, id);
    for (const c of o.masteryCriteria) {
      if (c.length < 25 || VAGUE.test(c)) add("UYARI", "BELIRSIZ_USTALIK", `"${o.title}": ölçüt gözlemlenebilir değil — "${c.slice(0, 60)}".`, id);
    }
    if (!o.learningObjectives.length) add("HATA", "EYLEMSIZ_HEDEF", `"${o.title}" için öğrenme hedefi yok.`, id);
    for (const ob of o.learningObjectives) {
      if (NON_ACTION_END.test(ob.trim())) add("UYARI", "EYLEMSIZ_HEDEF", `"${o.title}": hedef bir eylem değil — "${ob.slice(0, 60)}".`, id);
    }
    if (!o.entryQuestions.length) add("UYARI", "GIRIS_SORUSU_YOK", `"${o.title}" için giriş sorusu yok.`, id);
    else if (o.entryQuestions.every((q) => WHAT_IS.test(q))) add("BILGI", "GIRIS_SORUSU_YOK", `"${o.title}": giriş sorusu yalnızca bir tanım soruyor; aktif düşünme gerektiren bir soru daha iyi olur.`, id);
    if (!o.evidenceTypes.length) add("HATA", "KANIT_YOK", `"${o.title}" için kabul edilen kanıt türü yok.`, id);

    if (o.difficulty >= 4 && !o.prerequisites.some((p) => p.strength === "ZORUNLU" || p.strength === "YUMUSAK")) {
      add("UYARI", "ILERI_ONKOSULSUZ", `"${o.title}" ileri düzey (zorluk ${o.difficulty}) ama önkoşulu yok.`, id);
    }
    const formal = o.domain === "MATEMATIK" || o.domain === "FIZIK" || (o.domain === "NOROBILIM" && o.field.startsWith("Hesaplamalı"));
    if (formal && o.difficulty >= 4 && !o.boss && !o.evidenceTypes.some((e) => e === "TURETME" || e === "ISPAT")) {
      add("UYARI", "ILERI_TURETMESIZ", `"${o.title}" ileri düzey ama türetme ya da ispat kanıtı istemiyor.`, id);
    }
    const linksOut = o.interdisciplinaryLinks.some((l) => g.objects[l.id] && g.objects[l.id].domain !== o.domain);
    const crossPre = o.prerequisites.some((p) => g.objects[p.id] && g.objects[p.id].domain !== o.domain);
    if (!linksOut && !crossPre && !o.boss) add("BILGI", "DISIPLINLERARASI_YOK", `"${o.title}" başka bir alanla bağlantılı değil.`, id);

    if (o.requiresSources) {
      if (o.reviewStatus !== "GOZDEN_GECIRILDI") {
        add("BILGI", "DOGRULANMAMIS_TARIH", `"${o.title}" kaynakla doğrulanması gereken bilgi içeriyor; henüz doğrulanmadı.`, id);
      }
      if (!o.recommendedResources.length) add("BILGI", "KAYNAKSIZ_ICERIK", `"${o.title}" kaynak gerektiriyor ama bağlı bir kaynak yok.`, id);
    }

    const evidence = o.evidenceTypes.length;
    if (o.learningObjectives.length > 6 || (o.estimatedScope === "XL" && !o.boss && o.milestoneType !== "PROJE" && evidence > 4)) {
      add("UYARI", "COK_BUYUK", `"${o.title}" tek nesne için çok büyük; bölünmesi düşünülmeli.`, id);
    }
    if (o.estimatedScope === "XS" && o.learningObjectives.length <= 1 && o.evidenceTypes.every((e) => e === "HATIRLAMA")) {
      add("UYARI", "COK_KUCUK", `"${o.title}" yalnızca tek bir hatırlama; başka bir nesneyle birleştirilebilir.`, id);
    }
  }

  const cycle = findCycle(prereqMap(g));
  if (cycle) add("HATA", "DONGU", `Önkoşul döngüsü: ${cycle.join(" → ")} → ${cycle[0]}.`, cycle[0]);

  for (const m of Object.values(g.mappings)) {
    for (const lo of m.loIds) {
      if (!g.objects[lo]) add("HATA", "ESLEME_BILINMEYEN_NESNE", `"${m.framework} — ${m.unit}" eşlemesi var olmayan ${lo} nesnesini gösteriyor.`, lo);
    }
    if (m.status === "DOGRULANMIS" && !m.source) add("UYARI", "ESLEME_KAYNAKSIZ", `"${m.framework} — ${m.unit}" doğrulanmış görünüyor ama kaynağı yok.`);
    if (m.status === "DOGRULANMIS" && m.checkedAt) {
      const age = (now.getTime() - new Date(m.checkedAt).getTime()) / 86_400_000;
      if (age > STALE_DAYS) add("UYARI", "ESKIMIS_ESLEME", `"${m.framework} — ${m.unit}" ${Math.floor(age)} gündür yeniden kontrol edilmedi.`);
    }
  }

  if (opts.ledger !== false) {
    const ledger = new Set([...ID_LEDGER, ...(opts.knownIds ?? [])]);
    for (const id of g.order) if (!ledger.has(id)) add("UYARI", "KAYITSIZ_ID", `${id} kalıcı ID defterine kaydedilmemiş.`, id);
    const retired = new Set(RETIRED_IDS.map((r) => r.id));
    for (const id of ID_LEDGER) {
      if (!g.objects[id] && !retired.has(id)) add("HATA", "KAYBOLAN_ID", `${id} defterde var ama grafikte yok. ID'ler silinemez; kullanım dışı bırakılmalı.`, id);
    }
  }
  return issues;
}

export function summarize(issues: Issue[]): Record<Severity, number> {
  const out: Record<Severity, number> = { HATA: 0, UYARI: 0, BILGI: 0 };
  for (const i of issues) out[i.severity]++;
  return out;
}
