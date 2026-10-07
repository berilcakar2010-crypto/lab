/**
 * Graph validator (section 33). Reports problems; never repairs or deletes.
 * Disconnected objects in particular are only reported, never removed.
 */
import { findCycle } from "../engines/graph";
import { L, lazyLabels } from "../i18n";
import { prereqMap } from "./graph";
import { ID_LEDGER, RETIRED_IDS } from "./registry";
import type { KnowledgeGraph, LearningObject } from "./schema";

export type Severity = "HATA" | "UYARI" | "BILGI";
export const SEVERITY_LABEL = lazyLabels<Severity>({ HATA: "Error", UYARI: "Warning", BILGI: "Info" }, { HATA: "Hata", UYARI: "Uyarı", BILGI: "Bilgi" });

export const ISSUE_CODES = [
  "EKSIK_ONKOSUL", "IMKANSIZ_ONKOSUL", "DONGU", "BAGLANTISIZ", "YINELENEN_ID", "YINELENEN_BASLIK",
  "BELIRSIZ_USTALIK", "EYLEMSIZ_HEDEF", "GIRIS_SORUSU_YOK", "KANIT_YOK", "ILERI_ONKOSULSUZ", "ILERI_TURETMESIZ",
  "DISIPLINLERARASI_YOK", "BILINMEYEN_BAGLANTI", "ESKIMIS_ESLEME", "ESLEME_KAYNAKSIZ", "ESLEME_BILINMEYEN_NESNE",
  "DOGRULANMAMIS_TARIH", "KAYNAKSIZ_ICERIK", "COK_BUYUK", "COK_KUCUK", "KAYITSIZ_ID", "KAYBOLAN_ID",
] as const;
export type IssueCode = (typeof ISSUE_CODES)[number];

const ISSUE_LABEL_TR: Record<IssueCode, string> = {
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
const ISSUE_LABEL_EN: Record<IssueCode, string> = {
  EKSIK_ONKOSUL: "Missing prerequisite",
  IMKANSIZ_ONKOSUL: "Impossible prerequisite",
  DONGU: "Prerequisite cycle",
  BAGLANTISIZ: "Disconnected object",
  YINELENEN_ID: "Duplicate id",
  YINELENEN_BASLIK: "Possible duplicate",
  BELIRSIZ_USTALIK: "Vague mastery criterion",
  EYLEMSIZ_HEDEF: "Objective without an action",
  GIRIS_SORUSU_YOK: "No entry question",
  KANIT_YOK: "No evidence type",
  ILERI_ONKOSULSUZ: "Advanced object without prerequisites",
  ILERI_TURETMESIZ: "Advanced object without derivation/proof",
  DISIPLINLERARASI_YOK: "No interdisciplinary link",
  BILINMEYEN_BAGLANTI: "Link to a missing object",
  ESKIMIS_ESLEME: "Stale mapping",
  ESLEME_KAYNAKSIZ: "Verified mapping without source",
  ESLEME_BILINMEYEN_NESNE: "Mapping points to a missing object",
  DOGRULANMAMIS_TARIH: "Unverified historical claim",
  KAYNAKSIZ_ICERIK: "Content needing sources has none",
  COK_BUYUK: "Oversized object",
  COK_KUCUK: "Trivially small object",
  KAYITSIZ_ID: "Id not in the ledger",
  KAYBOLAN_ID: "Ledger id missing from the graph",
};
export const ISSUE_LABEL = lazyLabels<IssueCode>(ISSUE_LABEL_EN, ISSUE_LABEL_TR);

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
  /** Graph in the display language, for titles in messages (checks always run on the authored graph). */
  display?: KnowledgeGraph;
}

export function validateGraph(g: KnowledgeGraph, opts: ValidateOptions = {}): Issue[] {
  const issues: Issue[] = [];
  const add = (severity: Severity, code: IssueCode, message: string, loId?: string) => issues.push({ severity, code, message, loId });
  const now = opts.now ?? new Date();
  const T = (id: string) => opts.display?.objects[id]?.title ?? g.objects[id]?.title ?? id;

  if (opts.raw) {
    const seen = new Set<string>();
    for (const o of opts.raw) {
      if (seen.has(o.id)) add("HATA", "YINELENEN_ID", L(`The id "${o.id}" is used by more than one object.`, `"${o.id}" ID'si birden fazla nesnede kullanılmış.`), o.id);
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
        add("HATA", "EKSIK_ONKOSUL", L(`"${T(id)}" depends on a prerequisite that does not exist: ${p.id}.`, `"${T(id)}" var olmayan bir önkoşula dayanıyor: ${p.id}.`), id);
      } else if (p.id === id) {
        add("HATA", "IMKANSIZ_ONKOSUL", L(`"${T(id)}" cannot be its own prerequisite.`, `"${T(id)}" kendisinin önkoşulu olamaz.`), id);
      } else if (target.status === "KULLANIM_DISI" || target.status === "YERINE_GECILDI") {
        add("HATA", "IMKANSIZ_ONKOSUL", L(`"${T(id)}" depends on the retired "${T(p.id)}"; use ${target.supersededBy?.join(", ") || "?"} instead.`, `"${T(id)}" kullanımdan kalkmış "${T(p.id)}" nesnesine dayanıyor; yerine ${target.supersededBy?.join(", ") || "?"} kullanılmalı.`), id);
      } else if (target.status === "YER_TUTUCU") {
        add("HATA", "IMKANSIZ_ONKOSUL", L(`"${T(id)}" depends on an empty placeholder.`, `"${T(id)}" içeriği olmayan bir yer tutucuya dayanıyor.`), id);
      } else if (p.strength === "ZORUNLU" && target.optional && !o.optional) {
        add("UYARI", "IMKANSIZ_ONKOSUL", L(`Required "${T(id)}" requires the optional "${T(p.id)}".`, `Zorunlu "${T(id)}", isteğe bağlı "${T(p.id)}" nesnesini zorunlu önkoşul olarak istiyor.`), id);
      } else if (p.strength === "ZORUNLU" && target.difficulty > o.difficulty + 1) {
        add("UYARI", "IMKANSIZ_ONKOSUL", L(`"${T(id)}" (difficulty ${o.difficulty}) requires the much harder "${T(p.id)}" (difficulty ${target.difficulty}).`, `"${T(id)}" (zorluk ${o.difficulty}) kendisinden çok daha zor "${T(p.id)}" (zorluk ${target.difficulty}) nesnesini zorunlu istiyor.`), id);
      }
    }

    for (const ref of [...o.interdisciplinaryLinks.map((l) => l.id), ...o.relatedConcepts, ...o.contrastsWith]) {
      if (!g.objects[ref]) add("HATA", "BILINMEYEN_BAGLANTI", L(`"${T(id)}" links to an object that does not exist: ${ref}.`, `"${T(id)}" var olmayan bir nesneye bağlanıyor: ${ref}.`), id);
    }

    const connected = o.prerequisites.length || o.unlocks.length || o.interdisciplinaryLinks.length || incoming.has(id);
    if (!connected) add("UYARI", "BAGLANTISIZ", L(`"${T(id)}" is not connected to the rest of the graph. It is never deleted automatically; add a connection or leave it on purpose.`, `"${T(id)}" grafiğin geri kalanına bağlı değil. Otomatik silinmez; bağlantı eklenmeli ya da bilerek böyle bırakılmalı.`), id);

    const tkey = `${o.domain}|${o.title.toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}]+/gu, " ").trim()}`;
    if (titles.has(tkey)) add("UYARI", "YINELENEN_BASLIK", L(`"${T(id)}" has the same title as ${titles.get(tkey)}; it may be a duplicate.`, `"${T(id)}" başlığı ${titles.get(tkey)} ile aynı; kopya olabilir.`), id);
    else titles.set(tkey, id);

    if (!o.masteryCriteria.length) add("HATA", "BELIRSIZ_USTALIK", L(`"${T(id)}" has no mastery criteria.`, `"${T(id)}" için ustalık ölçütü yok.`), id);
    for (const c of o.masteryCriteria) {
      if (c.length < 25 || VAGUE.test(c)) add("UYARI", "BELIRSIZ_USTALIK", L(`"${T(id)}": criterion is not observable — "${c.slice(0, 60)}".`, `"${T(id)}": ölçüt gözlemlenebilir değil — "${c.slice(0, 60)}".`), id);
    }
    if (!o.learningObjectives.length) add("HATA", "EYLEMSIZ_HEDEF", L(`"${T(id)}" has no learning objectives.`, `"${T(id)}" için öğrenme hedefi yok.`), id);
    for (const ob of o.learningObjectives) {
      if (NON_ACTION_END.test(ob.trim())) add("UYARI", "EYLEMSIZ_HEDEF", L(`"${T(id)}": objective is not an action — "${ob.slice(0, 60)}".`, `"${T(id)}": hedef bir eylem değil — "${ob.slice(0, 60)}".`), id);
    }
    if (!o.entryQuestions.length) add("UYARI", "GIRIS_SORUSU_YOK", L(`"${T(id)}" has no entry question.`, `"${T(id)}" için giriş sorusu yok.`), id);
    else if (o.entryQuestions.every((q) => WHAT_IS.test(q))) add("BILGI", "GIRIS_SORUSU_YOK", L(`"${T(id)}": the entry question only asks for a definition; a question that needs active thinking works better.`, `"${T(id)}": giriş sorusu yalnızca bir tanım soruyor; aktif düşünme gerektiren bir soru daha iyi olur.`), id);
    if (!o.evidenceTypes.length) add("HATA", "KANIT_YOK", L(`"${T(id)}" accepts no type of evidence.`, `"${T(id)}" için kabul edilen kanıt türü yok.`), id);

    if (o.difficulty >= 4 && !o.prerequisites.some((p) => p.strength === "ZORUNLU" || p.strength === "YUMUSAK")) {
      add("UYARI", "ILERI_ONKOSULSUZ", L(`"${T(id)}" is advanced (difficulty ${o.difficulty}) but has no prerequisites.`, `"${T(id)}" ileri düzey (zorluk ${o.difficulty}) ama önkoşulu yok.`), id);
    }
    const formal = o.domain === "MATEMATIK" || o.domain === "FIZIK" || (o.domain === "NOROBILIM" && o.field.startsWith("Hesaplamalı"));
    if (formal && o.difficulty >= 4 && !o.boss && !o.evidenceTypes.some((e) => e === "TURETME" || e === "ISPAT")) {
      add("UYARI", "ILERI_TURETMESIZ", L(`"${T(id)}" is advanced but asks for no derivation or proof.`, `"${T(id)}" ileri düzey ama türetme ya da ispat kanıtı istemiyor.`), id);
    }
    const linksOut = o.interdisciplinaryLinks.some((l) => g.objects[l.id] && g.objects[l.id].domain !== o.domain);
    const crossPre = o.prerequisites.some((p) => g.objects[p.id] && g.objects[p.id].domain !== o.domain);
    if (!linksOut && !crossPre && !o.boss) add("BILGI", "DISIPLINLERARASI_YOK", L(`"${T(id)}" is not linked to any other field.`, `"${T(id)}" başka bir alanla bağlantılı değil.`), id);

    if (o.requiresSources) {
      if (o.reviewStatus !== "GOZDEN_GECIRILDI") {
        add("BILGI", "DOGRULANMAMIS_TARIH", L(`"${T(id)}" contains information that needs checking against sources; not yet checked.`, `"${T(id)}" kaynakla doğrulanması gereken bilgi içeriyor; henüz doğrulanmadı.`), id);
      }
      if (!o.recommendedResources.length) add("BILGI", "KAYNAKSIZ_ICERIK", L(`"${T(id)}" needs sources but none is linked.`, `"${T(id)}" kaynak gerektiriyor ama bağlı bir kaynak yok.`), id);
    }

    const evidence = o.evidenceTypes.length;
    if (o.learningObjectives.length > 6 || (o.estimatedScope === "XL" && !o.boss && o.milestoneType !== "PROJE" && evidence > 4)) {
      add("UYARI", "COK_BUYUK", L(`"${T(id)}" is too big for one object; consider splitting it.`, `"${T(id)}" tek nesne için çok büyük; bölünmesi düşünülmeli.`), id);
    }
    if (o.estimatedScope === "XS" && o.learningObjectives.length <= 1 && o.evidenceTypes.every((e) => e === "HATIRLAMA")) {
      add("UYARI", "COK_KUCUK", L(`"${T(id)}" is a single recall; it could be merged with another object.`, `"${T(id)}" yalnızca tek bir hatırlama; başka bir nesneyle birleştirilebilir.`), id);
    }
  }

  const cycle = findCycle(prereqMap(g));
  if (cycle) add("HATA", "DONGU", L(`Prerequisite cycle: ${cycle.join(" → ")} → ${cycle[0]}.`, `Önkoşul döngüsü: ${cycle.join(" → ")} → ${cycle[0]}.`), cycle[0]);

  for (const m of Object.values(g.mappings)) {
    for (const lo of m.loIds) {
      if (!g.objects[lo]) add("HATA", "ESLEME_BILINMEYEN_NESNE", L(`Mapping "${m.framework} — ${m.unit}" points to the missing object ${lo}.`, `"${m.framework} — ${m.unit}" eşlemesi var olmayan ${lo} nesnesini gösteriyor.`), lo);
    }
    if (m.status === "DOGRULANMIS" && !m.source) add("UYARI", "ESLEME_KAYNAKSIZ", L(`"${m.framework} — ${m.unit}" is marked verified but has no source.`, `"${m.framework} — ${m.unit}" doğrulanmış görünüyor ama kaynağı yok.`));
    if (m.status === "DOGRULANMIS" && m.checkedAt) {
      const age = (now.getTime() - new Date(m.checkedAt).getTime()) / 86_400_000;
      if (age > STALE_DAYS) add("UYARI", "ESKIMIS_ESLEME", L(`"${m.framework} — ${m.unit}" has not been re-checked for ${Math.floor(age)} days.`, `"${m.framework} — ${m.unit}" ${Math.floor(age)} gündür yeniden kontrol edilmedi.`));
    }
  }

  if (opts.ledger !== false) {
    const ledger = new Set([...ID_LEDGER, ...(opts.knownIds ?? [])]);
    for (const id of g.order) if (!ledger.has(id)) add("UYARI", "KAYITSIZ_ID", L(`${id} is not recorded in the permanent id ledger.`, `${id} kalıcı ID defterine kaydedilmemiş.`), id);
    const retired = new Set(RETIRED_IDS.map((r) => r.id));
    for (const id of ID_LEDGER) {
      if (!g.objects[id] && !retired.has(id)) add("HATA", "KAYBOLAN_ID", L(`${id} is in the ledger but missing from the graph. Ids cannot be deleted; retire the object instead.`, `${id} defterde var ama grafikte yok. ID'ler silinemez; kullanım dışı bırakılmalı.`), id);
    }
  }
  return issues;
}

export function summarize(issues: Issue[]): Record<Severity, number> {
  const out: Record<Severity, number> = { HATA: 0, UYARI: 0, BILGI: 0 };
  for (const i of issues) out[i.severity]++;
  return out;
}
