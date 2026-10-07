/**
 * Offline curriculum builder. Used when no AI provider is configured or the
 * provider fails. It is deliberately honest: built-in packs carry real
 * content; anything else becomes a structured scaffold whose open questions
 * are self-assessed against a rubric.
 */
import type { CurriculumSpec, MilestoneSpec, TopicSpec, UnitSpec } from "../engines/curriculumSpec";
import type { SplitPart } from "../engines/curriculum";
import type { Milestone } from "../domain/types";
import { mechanicsPack } from "./packs/mechanics";
import { calculusPack } from "./packs/calculus";

const PACKS: { pack: CurriculumSpec; keywords: RegExp }[] = [
  { pack: mechanicsPack, keywords: /mechanic|mekanik|newton|kinemati|dynamics|dinamik|fizik olimpiyat|physics olympiad/i },
  { pack: calculusPack, keywords: /calculus|kalk[üu]l[üu]s|t[üu]rev|derivative|integral|analiz ?1|limit/i },
];

export function matchPack(text: string): CurriculumSpec | null {
  const hit = PACKS.find((p) => p.keywords.test(text));
  return hit ? structuredClone(hit.pack) : null;
}

export const builtInPacks = () => PACKS.map((p) => p.pack);

// ---------------------------------------------------------------------------
// Syllabus parsing
// ---------------------------------------------------------------------------

const UNIT_RE = /^(#{1,3}\s+|(unit|chapter|part|module|section|week|ünite|unite|bölüm|bolum|kısım|kisim|hafta|konu)\b\s*[\w.]*[:.)\-–]?\s*|[IVXLC]+[.)]\s+|\d+[.)]\s+)/i;
const TOPIC_RE = /^(\s{2,}|\t|[-*•·◦▪–]\s*|\d+\.\d+[.)]?\s+|[a-z][.)]\s+)/i;

export interface ParsedSyllabus {
  units: { title: string; topics: string[] }[];
}

export function parseSyllabus(text: string): ParsedSyllabus {
  const lines = text.split(/\r?\n/).map((l) => l.replace(/\s+$/, "")).filter((l) => l.trim().length > 1);
  const units: { title: string; topics: string[] }[] = [];
  const clean = (s: string) => s.replace(UNIT_RE, "").replace(TOPIC_RE, "").replace(/^[\s:.\-–]+|[\s:.\-–]+$/g, "").trim();

  for (const raw of lines) {
    const isTopic = TOPIC_RE.test(raw) && !/^\d+[.)]\s/.test(raw.trim());
    const trimmed = raw.trim();
    const colon = trimmed.match(/^(.*?):\s*(.+)$/);
    const headedList = !!colon && /[,;]/.test(colon[2]) && colon[1].length < 60;
    const isUnit =
      !isTopic &&
      (UNIT_RE.test(trimmed) || headedList || /:$/.test(trimmed) || (trimmed === trimmed.toUpperCase() && /[A-ZÇĞİÖŞÜ]{4}/.test(trimmed)));
    if (isUnit) {
      const head = colon ? colon[1] : trimmed;
      const tail = colon ? colon[2] : "";
      const headTitle = clean(head);
      if (!headTitle && tail) {
        // "Unit 1: Kinematics" → the tail is the title.
        units.push({ title: clean(tail), topics: [] });
      } else {
        // "Kinematics: velocity, acceleration" → unit with inline topics.
        const topics = tail ? tail.split(/[,;]/).map((t) => clean(t)).filter(Boolean) : [];
        units.push({ title: headTitle || trimmed, topics });
      }
    } else {
      const t = clean(trimmed);
      if (!t) continue;
      if (!units.length) units.push({ title: "", topics: [] });
      units[units.length - 1].topics.push(t);
    }
  }
  // A heading with no topics underneath becomes a topic of its own unit.
  for (const u of units) if (!u.topics.length && u.title) u.topics.push(u.title);
  const nonEmpty = units.filter((u) => u.topics.length);
  // Flat list with no headings: group into parts of ~4 topics.
  if (nonEmpty.length === 1 && !nonEmpty[0].title) {
    const all = nonEmpty[0].topics;
    const groups: { title: string; topics: string[] }[] = [];
    for (let i = 0; i < all.length; i += 4) groups.push({ title: `Bölüm ${groups.length + 1}`, topics: all.slice(i, i + 4) });
    return { units: groups };
  }
  return { units: nonEmpty.map((u, i) => ({ ...u, title: u.title || `Bölüm ${i + 1}` })) };
}

// ---------------------------------------------------------------------------
// Generic scaffold
// ---------------------------------------------------------------------------

const H = (topic: string): string[] => [
  `"${topic}" konusundaki en önemli tek fikir ne? Bunu tek cümleyle söylemeyi dene.`,
  `"${topic}" hangi tanım ya da ilkelere dayanıyor? Önce onları yaz.`,
  `Çözmeden önce planla: ne verilmiş, ne isteniyor ve ikisini hangi ilke bağlıyor?`,
  `Küçük bir örneği tamamen çöz, sonra genelle. Kaynağınla karşılaştır.`,
];

function topicMilestones(topic: string, unitKey: string, ti: number, prevKey: string | null, firstTopicKey: string | null): MilestoneSpec[] {
  const k = `${unitKey}t${ti}`;
  const entry = ti === 0 ? (prevKey ? [prevKey] : []) : [firstTopicKey!];
  return [
    {
      key: `${k}c`, type: "CONCEPT", difficulty: 2, estimatedMinutes: 10, prerequisites: entry,
      title: `Ana fikri açıkla: ${topic}`,
      learningObjective: `"${topic}" konusunun ana fikrini kesin biçimde ifade et, bir örnek ver ve bildiklerinle ilişkilendir.`,
      interaction: "CONCEPT_EXPLANATION",
      masteryCriterion: "Açıklaman notlara bakmadan tüm ölçütleri karşılıyor.",
      requiredCorrect: 1,
      questions: [
        { kind: "CONCEPT_EXPLANATION", purpose: "MASTERY", prompt: `"${topic}" konusunu bir sınıf arkadaşına öğretiyormuş gibi açıkla. Bir tanım, somut bir örnek ve sık yapılan bir yanılgı ekle.`,
          rubric: ["Ana fikrin doğru tanımı ya da ifadesi", "Somut ve doğru bir örnek", "Akla yatkın bir yanılgı ve neden yanlış olduğu"], hints: H(topic),
          solution: `Açıklamanı "${topic}" hakkında güvenilir bir kaynakla karşılaştır. Tam bir cevap tanımlar, örnekler ve bir yanılgıyı adlandırır.` },
        { kind: "EXPLANATION", purpose: "RETENTION", prompt: `Notlara bakmadan: "${topic}" nedir ve ne zaman kullanılır?`,
          rubric: ["Ana fikir doğru", "Kullanım durumu doğru"], hints: H(topic), solution: `"${topic}" kaynağınla karşılaştır.` },
      ],
    },
    {
      key: `${k}p`, type: "PRACTICE", difficulty: 3, estimatedMinutes: 20, prerequisites: [`${k}c`],
      title: `Standart bir problem çöz: ${topic}`,
      learningObjective: `Ders materyalinden tipik bir "${topic}" problemini her adımı gerekçelendirerek çöz.`,
      interaction: "PROBLEM_SOLVING",
      masteryCriterion: "İki farklı problem, gerekçeli adımlarla doğru çözüldü.",
      requiredCorrect: 2,
      questions: [1, 2].map((n) => ({
        kind: "PROBLEM_SOLVING", purpose: "MASTERY",
        prompt: `Ders kitabından ya da soru setinden "${topic}" üzerine ${n}. standart alıştırmayı seç (her seferinde farklı bir tane). Problemi yaz, sonra burada her adımı göstererek çöz.`,
        rubric: ["Problem yazılmış ve ilgili ilke belirlenmiş", "Her adım bir öncekinden çıkıyor", "Sonuç kontrol edilmiş (birim, sınır durumu ya da yerine koyma)"],
        hints: H(topic), solution: "Sonucunu kitabın cevap anahtarıyla karşılaştır ve yöntemleri kıyasla.",
      })).concat([{
        kind: "PROBLEM_SOLVING", purpose: "TRANSFER",
        prompt: `"${topic}" konusunun alışık olmadığın bir bağlamda (başka bir ders ya da gerçek hayat) ortaya çıktığı bir problem bul ya da kur. Çöz.`,
        rubric: ["Bağlam gerçekten farklı", "Konu doğru uygulanmış", "Sonuç bağlam içinde yorumlanmış"], hints: H(topic),
        solution: "İyi bir transfer cevabı aynı ilkenin alışılmış ortamı dışında işlediğini gösterir.",
      }]),
    },
  ];
}

export function buildGenericSpec(title: string, parsed?: ParsedSyllabus): CurriculumSpec {
  const units: { title: string; topics: string[] }[] = parsed?.units.length
    ? parsed.units
    : [
        { title: `${title}: temeller`, topics: ["Temel kavramlar ve tanımlar", "Ana ilkeler"] },
        { title: `${title}: temel yöntemler`, topics: ["Standart teknikler", "Tipik problemler"] },
        { title: `${title}: uygulamalar`, topics: ["Bağlantılar ve uygulamalar"] },
      ];
  let prevReview: string | null = null;
  const reviews: string[] = [];
  const unitSpecs: UnitSpec[] = units.map((u, ui) => {
    const uk = `u${ui}`;
    const topics: TopicSpec[] = [];
    let firstTopicKey: string | null = null;
    const lastKeys: string[] = [];
    u.topics.slice(0, 12).forEach((t, ti) => {
      const ms = topicMilestones(t, uk, ti, prevReview, firstTopicKey);
      if (ti === 0) firstTopicKey = ms[0].key;
      lastKeys.push(ms[ms.length - 1].key);
      topics.push({ title: t, milestones: ms });
    });
    const reviewKey = `${uk}rev`;
    topics.push({
      title: `${u.title} — tekrar`,
      milestones: [
        {
          key: reviewKey, type: "REVIEW", difficulty: 2, estimatedMinutes: 15, prerequisites: lastKeys,
          title: `Tekrar: ${u.title} fikirlerini birleştir`,
          learningObjective: `"${u.title}" konularının birbiriyle ilişkisini açıkla ve verilen bir problem için doğru olanı seç.`,
          interaction: "COMPARISON", requiredCorrect: 1,
          questions: [{ kind: "COMPARISON", purpose: "MASTERY", prompt: `"${u.title}" konularını karşılaştır (${u.topics.slice(0, 5).join(", ")}). Her biri için doğru araç olduğu bir problem türü ver.`,
            rubric: ["Her konu uygun bir problem türüyle eşleşmiş", "Konular arasında en az bir bağlantı açıklanmış"], hints: H(u.title), solution: "Her eşleştirmeyi ders materyalinle kontrol et." }],
        },
        {
          key: `${uk}ch`, type: "CHALLENGE", difficulty: 4, estimatedMinutes: 40, optional: true, prerequisites: [reviewKey],
          title: `Meydan okuma: zor bir ${u.title} problemi`,
          learningObjective: `"${u.title}" içinden birkaç fikri birleştiren zorlu bir problemi çöz.`,
          interaction: "PROBLEM_SOLVING", requiredCorrect: 1,
          questions: [{ kind: "PROBLEM_SOLVING", purpose: "MASTERY", prompt: `"${u.title}" üzerine bulabildiğin en zor bölüm sonu ya da yarışma problemini seç ve burada çöz.`,
            rubric: ["En az iki fikri birleştiriyor", "Akıl yürütme baştan sona doğru", "Cevap doğrulanmış"], hints: H(u.title), solution: "Varsa resmi çözümle karşılaştır." }],
        },
      ],
    });
    prevReview = reviewKey;
    reviews.push(reviewKey);
    return { title: u.title, summary: "", topics };
  });
  unitSpecs.push({
    title: "Sentez",
    topics: [{
      title: "Final",
      milestones: [{
        key: "boss", type: "BOSS", difficulty: 5, estimatedMinutes: 60, prerequisites: reviews,
        title: `Final: sınav düzeyinde ${title} soru seti`,
        learningObjective: `${title} dersinin tamamını kapsayan, daha önce görmediğin sınav düzeyinde problemleri çöz.`,
        interaction: "PROBLEM_SOLVING", requiredCorrect: 2,
        questions: [1, 2].map((n) => ({ kind: "PROBLEM_SOLVING", purpose: "MASTERY",
          prompt: `Birkaç üniteyi kapsayan ${n}. çıkmış sınav sorusunu al. Sınav koşullarında, notsuz çöz.`,
          rubric: ["Doğru yaklaşım yönlendirme olmadan seçilmiş", "Eksiksiz, gerekçeli çözüm", "Gerçekçi bir sınav süresinde"], hints: H(title),
          solution: "Kendini resmi puanlama anahtarına göre sıkı değerlendir." })),
      }],
    }],
  });
  return {
    title,
    goal: `${title} genelinde daha önce görmediğin problemleri ezberle değil anlayarak çözebilmek.`,
    description: "Çevrimdışı iskelet — içeriğe duyarlı ve otomatik puanlanan sorular için Ayarlar'dan Gemini ya da Groq bağla.",
    units: unitSpecs,
  };
}

export function localBuildCurriculum(request: string, syllabus?: string): { spec: CurriculumSpec; note: string } {
  const pack = matchPack(`${request}\n${syllabus ?? ""}`);
  if (pack && !syllabus?.trim()) {
    return { spec: pack, note: "Lab'in çevrimdışı bilgi paketinden oluşturuldu (elle yazılmış, otomatik puanlanan sorular)." };
  }
  const title = request.trim() || "Yeni ders";
  if (syllabus?.trim()) {
    const parsed = parseSyllabus(syllabus);
    if (parsed.units.length) {
      return { spec: buildGenericSpec(title, parsed), note: `Müfredatından yapılandırıldı (${parsed.units.length} ünite). Bir YZ sağlayıcısı bağlanana kadar sorular ölçüt temelli ve öz değerlendirmeli.` };
    }
  }
  return { spec: buildGenericSpec(title), note: "Çevrimdışı iskelet. İçeriğe duyarlı bir müfredat için bir müfredat metni yapıştır ya da bir YZ sağlayıcısı bağla." };
}

/** Offline split: concept → practice → application chain. */
export function localSplit(m: Milestone): SplitPart[] {
  const t = m.title.replace(/^(Explain|Solve|Apply|Understand|Anla|Alıştır|Uygula|Açıkla)\s*:?\s+/i, "");
  return [
    { title: `Anla: ${t}`, milestoneType: "CONCEPT", learningObjective: `Arkasındaki fikri açıkla: ${t}.`, difficulty: Math.max(1, m.difficulty - 1) },
    { title: `Alıştır: ${t}`, milestoneType: "PRACTICE", learningObjective: `Standart problemleri çöz: ${t}.`, difficulty: m.difficulty },
    { title: `Uygula: ${t}`, milestoneType: "APPLICATION", learningObjective: `Alışık olmadığın bir durumda kullan: ${t}.`, difficulty: Math.min(5, m.difficulty + 1) },
  ];
}
