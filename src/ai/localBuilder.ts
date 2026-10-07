/**
 * Offline curriculum builder. Used when no AI provider is configured or the
 * provider fails. It is deliberately honest: built-in packs carry real
 * content; anything else becomes a structured scaffold whose open questions
 * are self-assessed against a rubric.
 */
import type { CurriculumSpec, MilestoneSpec, TopicSpec, UnitSpec } from "../engines/curriculumSpec";
import type { SplitPart } from "../engines/curriculum";
import type { Milestone } from "../domain/types";
import { getLang, L } from "../i18n";
import { mechanicsPack } from "./packs/mechanics";
import { calculusPack } from "./packs/calculus";
import { mechanicsPackEn } from "./packs/en/mechanics";
import { calculusPackEn } from "./packs/en/calculus";

/** Built-in packs in both languages; the two versions are structurally identical (see packs.test.ts). */
export const packsByLang = {
  mech: { en: mechanicsPackEn, tr: mechanicsPack },
  calc: { en: calculusPackEn, tr: calculusPack },
};

const PACKS: { id: keyof typeof packsByLang; keywords: RegExp }[] = [
  { id: "mech", keywords: /mechanic|mekanik|newton|kinemati|dynamics|dinamik|fizik olimpiyat|physics olympiad/i },
  { id: "calc", keywords: /calculus|kalk[üu]l[üu]s|t[üu]rev|derivative|integral|analiz ?1|limit/i },
];

/** The built-in pack matching an English or Turkish request, in the current language. */
export function matchPack(text: string): CurriculumSpec | null {
  const hit = PACKS.find((p) => p.keywords.test(text));
  return hit ? structuredClone(packsByLang[hit.id][getLang()]) : null;
}

/** Built-in packs in the current language. */
export const builtInPacks = (): CurriculumSpec[] => PACKS.map((p) => packsByLang[p.id][getLang()]);

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
    for (let i = 0; i < all.length; i += 4) groups.push({ title: L(`Part ${groups.length + 1}`, `Bölüm ${groups.length + 1}`), topics: all.slice(i, i + 4) });
    return { units: groups };
  }
  return { units: nonEmpty.map((u, i) => ({ ...u, title: u.title || L(`Part ${i + 1}`, `Bölüm ${i + 1}`) })) };
}

// ---------------------------------------------------------------------------
// Generic scaffold
// ---------------------------------------------------------------------------

const H = (topic: string): string[] => [
  L(`What is the single most important idea in "${topic}"? Try to state it in one sentence.`, `"${topic}" konusundaki en önemli tek fikir ne? Bunu tek cümleyle söylemeyi dene.`),
  L(`Which definitions or principles does "${topic}" rest on? Write them down first.`, `"${topic}" hangi tanım ya da ilkelere dayanıyor? Önce onları yaz.`),
  L(`Plan before solving: what is given, what is asked, and which principle connects them?`, `Çözmeden önce planla: ne verilmiş, ne isteniyor ve ikisini hangi ilke bağlıyor?`),
  L(`Work one small example completely, then generalise. Compare with your source material.`, `Küçük bir örneği tamamen çöz, sonra genelle. Kaynağınla karşılaştır.`),
];

function topicMilestones(topic: string, unitKey: string, ti: number, prevKey: string | null, firstTopicKey: string | null): MilestoneSpec[] {
  const k = `${unitKey}t${ti}`;
  const entry = ti === 0 ? (prevKey ? [prevKey] : []) : [firstTopicKey!];
  return [
    {
      key: `${k}c`, type: "CONCEPT", difficulty: 2, estimatedMinutes: 10, prerequisites: entry,
      title: L(`Explain the core idea of ${topic}`, `Ana fikri açıkla: ${topic}`),
      learningObjective: L(`State the central idea of ${topic} precisely, give an example, and connect it to what you already know.`, `"${topic}" konusunun ana fikrini kesin biçimde ifade et, bir örnek ver ve bildiklerinle ilişkilendir.`),
      interaction: "CONCEPT_EXPLANATION",
      masteryCriterion: L("Your explanation meets every rubric point without looking at notes.", "Açıklaman notlara bakmadan tüm ölçütleri karşılıyor."),
      requiredCorrect: 1,
      questions: [
        { kind: "CONCEPT_EXPLANATION", purpose: "MASTERY", prompt: L(`Explain ${topic} as if teaching a classmate. Include a definition, one concrete example, and one common misconception.`, `"${topic}" konusunu bir sınıf arkadaşına öğretiyormuş gibi açıkla. Bir tanım, somut bir örnek ve sık yapılan bir yanılgı ekle.`),
          rubric: [L("Accurate definition or statement of the central idea", "Ana fikrin doğru tanımı ya da ifadesi"), L("A concrete, correct example", "Somut ve doğru bir örnek"), L("A plausible misconception and why it is wrong", "Akla yatkın bir yanılgı ve neden yanlış olduğu")], hints: H(topic),
          solution: L(`Compare your explanation with a trusted source on ${topic}. A complete answer defines it, illustrates it, and names a misconception.`, `Açıklamanı "${topic}" hakkında güvenilir bir kaynakla karşılaştır. Tam bir cevap tanımlar, örnekler ve bir yanılgıyı adlandırır.`) },
        { kind: "EXPLANATION", purpose: "RETENTION", prompt: L(`Without notes: what is ${topic}, and when would you use it?`, `Notlara bakmadan: "${topic}" nedir ve ne zaman kullanılır?`),
          rubric: [L("Correct central idea", "Ana fikir doğru"), L("Correct situation of use", "Kullanım durumu doğru")], hints: H(topic), solution: L(`Check against your source on ${topic}.`, `"${topic}" kaynağınla karşılaştır.`) },
      ],
    },
    {
      key: `${k}p`, type: "PRACTICE", difficulty: 3, estimatedMinutes: 20, prerequisites: [`${k}c`],
      title: L(`Solve a standard problem on ${topic}`, `Standart bir problem çöz: ${topic}`),
      learningObjective: L(`Solve a typical ${topic} problem from your course material with every step justified.`, `Ders materyalinden tipik bir "${topic}" problemini her adımı gerekçelendirerek çöz.`),
      interaction: "PROBLEM_SOLVING",
      masteryCriterion: L("Two different problems solved correctly with justified steps.", "İki farklı problem, gerekçeli adımlarla doğru çözüldü."),
      requiredCorrect: 2,
      questions: [1, 2].map((n) => ({
        kind: "PROBLEM_SOLVING", purpose: "MASTERY",
        prompt: L(`Choose standard exercise #${n} on ${topic} from your textbook or problem set (a different one each time). Write the problem, then solve it here, showing each step.`, `Ders kitabından ya da soru setinden "${topic}" üzerine ${n}. standart alıştırmayı seç (her seferinde farklı bir tane). Problemi yaz, sonra burada her adımı göstererek çöz.`),
        rubric: [
          L("Problem stated and the relevant principle identified", "Problem yazılmış ve ilgili ilke belirlenmiş"),
          L("Each step follows from the previous one", "Her adım bir öncekinden çıkıyor"),
          L("Final answer checked (units, limiting case or substitution)", "Sonuç kontrol edilmiş (birim, sınır durumu ya da yerine koyma)"),
        ],
        hints: H(topic), solution: L("Check your final answer against the textbook's answer key and compare methods.", "Sonucunu kitabın cevap anahtarıyla karşılaştır ve yöntemleri kıyasla."),
      })).concat([{
        kind: "PROBLEM_SOLVING", purpose: "TRANSFER",
        prompt: L(`Find or invent a problem where ${topic} appears in an unfamiliar context (another subject, or real life). Solve it.`, `"${topic}" konusunun alışık olmadığın bir bağlamda (başka bir ders ya da gerçek hayat) ortaya çıktığı bir problem bul ya da kur. Çöz.`),
        rubric: [L("The context is genuinely different", "Bağlam gerçekten farklı"), L(`${topic} is applied correctly`, "Konu doğru uygulanmış"), L("The result is interpreted in context", "Sonuç bağlam içinde yorumlanmış")], hints: H(topic),
        solution: L("A good transfer answer shows the same principle working outside its usual setting.", "İyi bir transfer cevabı aynı ilkenin alışılmış ortamı dışında işlediğini gösterir."),
      }]),
    },
  ];
}

export function buildGenericSpec(title: string, parsed?: ParsedSyllabus): CurriculumSpec {
  const units: { title: string; topics: string[] }[] = parsed?.units.length
    ? parsed.units
    : [
        { title: L(`Foundations of ${title}`, `${title}: temeller`), topics: [L("Key vocabulary and definitions", "Temel kavramlar ve tanımlar"), L("Central principles", "Ana ilkeler")] },
        { title: L(`Core methods of ${title}`, `${title}: temel yöntemler`), topics: [L("Standard techniques", "Standart teknikler"), L("Typical problems", "Tipik problemler")] },
        { title: L(`Applying ${title}`, `${title}: uygulamalar`), topics: [L("Connections and applications", "Bağlantılar ve uygulamalar")] },
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
      title: L(`${u.title} — review`, `${u.title} — tekrar`),
      milestones: [
        {
          key: reviewKey, type: "REVIEW", difficulty: 2, estimatedMinutes: 15, prerequisites: lastKeys,
          title: L(`Review: connect the ideas of ${u.title}`, `Tekrar: ${u.title} fikirlerini birleştir`),
          learningObjective: L(`Explain how the topics of ${u.title} relate to one another and choose the right one for a given problem.`, `"${u.title}" konularının birbiriyle ilişkisini açıkla ve verilen bir problem için doğru olanı seç.`),
          interaction: "COMPARISON", requiredCorrect: 1,
          questions: [{ kind: "COMPARISON", purpose: "MASTERY", prompt: L(`Compare the topics of ${u.title} (${u.topics.slice(0, 5).join(", ")}). For each, give one problem type it is the right tool for.`, `"${u.title}" konularını karşılaştır (${u.topics.slice(0, 5).join(", ")}). Her biri için doğru araç olduğu bir problem türü ver.`),
            rubric: [L("Each topic matched to a suitable problem type", "Her konu uygun bir problem türüyle eşleşmiş"), L("At least one connection between topics explained", "Konular arasında en az bir bağlantı açıklanmış")], hints: H(u.title), solution: L("Check each match against your course material.", "Her eşleştirmeyi ders materyalinle kontrol et.") }],
        },
        {
          key: `${uk}ch`, type: "CHALLENGE", difficulty: 4, estimatedMinutes: 40, optional: true, prerequisites: [reviewKey],
          title: L(`Challenge: a hard ${u.title} problem`, `Meydan okuma: zor bir ${u.title} problemi`),
          learningObjective: L(`Solve a demanding problem that combines several ideas from ${u.title}.`, `"${u.title}" içinden birkaç fikri birleştiren zorlu bir problemi çöz.`),
          interaction: "PROBLEM_SOLVING", requiredCorrect: 1,
          questions: [{ kind: "PROBLEM_SOLVING", purpose: "MASTERY", prompt: L(`Pick the hardest end-of-chapter or competition problem you can find on ${u.title} and solve it here.`, `"${u.title}" üzerine bulabildiğin en zor bölüm sonu ya da yarışma problemini seç ve burada çöz.`),
            rubric: [L("Combines at least two ideas", "En az iki fikri birleştiriyor"), L("Correct reasoning throughout", "Akıl yürütme baştan sona doğru"), L("Answer verified", "Cevap doğrulanmış")], hints: H(u.title), solution: L("Compare with the official solution if available.", "Varsa resmi çözümle karşılaştır.") }],
        },
      ],
    });
    prevReview = reviewKey;
    reviews.push(reviewKey);
    return { title: u.title, summary: "", topics };
  });
  unitSpecs.push({
    title: L("Synthesis", "Sentez"),
    topics: [{
      title: L("Boss", "Final"),
      milestones: [{
        key: "boss", type: "BOSS", difficulty: 5, estimatedMinutes: 60, prerequisites: reviews,
        title: L(`Boss: an exam-level ${title} problem set`, `Final: sınav düzeyinde ${title} soru seti`),
        learningObjective: L(`Solve unseen, exam-level problems that span the whole of ${title}.`, `${title} dersinin tamamını kapsayan, daha önce görmediğin sınav düzeyinde problemleri çöz.`),
        interaction: "PROBLEM_SOLVING", requiredCorrect: 2,
        questions: [1, 2].map((n) => ({ kind: "PROBLEM_SOLVING", purpose: "MASTERY",
          prompt: L(`Take past-exam problem #${n} covering several units of ${title}. Solve it under exam conditions, without notes.`, `Birkaç üniteyi kapsayan ${n}. çıkmış sınav sorusunu al. Sınav koşullarında, notsuz çöz.`),
          rubric: [L("Correct approach chosen without prompting", "Doğru yaklaşım yönlendirme olmadan seçilmiş"), L("Complete, justified solution", "Eksiksiz, gerekçeli çözüm"), L("Within a realistic exam time", "Gerçekçi bir sınav süresinde")], hints: H(title),
          solution: L("Grade yourself strictly against the official mark scheme.", "Kendini resmi puanlama anahtarına göre sıkı değerlendir.") })),
      }],
    }],
  });
  return {
    title,
    goal: L(`Be able to solve unseen problems across ${title} with understanding, not memorisation.`, `${title} genelinde daha önce görmediğin problemleri ezberle değil anlayarak çözebilmek.`),
    description: L("Offline scaffold — connect Gemini or Groq in Settings for a content-aware curriculum with auto-graded questions.", "Çevrimdışı iskelet — içeriğe duyarlı ve otomatik puanlanan sorular için Ayarlar'dan Gemini ya da Groq bağla."),
    units: unitSpecs,
  };
}

export function localBuildCurriculum(request: string, syllabus?: string): { spec: CurriculumSpec; note: string } {
  const pack = matchPack(`${request}\n${syllabus ?? ""}`);
  if (pack && !syllabus?.trim()) {
    return { spec: pack, note: L("Built from Lab's offline knowledge pack (hand-written, auto-graded questions).", "Lab'in çevrimdışı bilgi paketinden oluşturuldu (elle yazılmış, otomatik puanlanan sorular).") };
  }
  const title = request.trim() || L("New course", "Yeni ders");
  if (syllabus?.trim()) {
    const parsed = parseSyllabus(syllabus);
    if (parsed.units.length) {
      return { spec: buildGenericSpec(title, parsed), note: L(`Structured from your syllabus (${parsed.units.length} units). Questions are rubric-based and self-assessed until an AI provider is connected.`, `Müfredatından yapılandırıldı (${parsed.units.length} ünite). Bir YZ sağlayıcısı bağlanana kadar sorular ölçüt temelli ve öz değerlendirmeli.`) };
    }
  }
  return { spec: buildGenericSpec(title), note: L("Offline scaffold. Paste a syllabus or connect an AI provider for a content-aware curriculum.", "Çevrimdışı iskelet. İçeriğe duyarlı bir müfredat için bir müfredat metni yapıştır ya da bir YZ sağlayıcısı bağla.") };
}

/** Offline split: concept → practice → application chain. */
export function localSplit(m: Milestone): SplitPart[] {
  const t = m.title.replace(/^(Explain|Solve|Apply|Understand|Practise|Anla|Alıştır|Uygula|Açıkla)\s*:?\s+/i, "");
  return [
    { title: L(`Understand: ${t}`, `Anla: ${t}`), milestoneType: "CONCEPT", learningObjective: L(`Explain the idea behind ${t}.`, `Arkasındaki fikri açıkla: ${t}.`), difficulty: Math.max(1, m.difficulty - 1) },
    { title: L(`Practise: ${t}`, `Alıştır: ${t}`), milestoneType: "PRACTICE", learningObjective: L(`Solve standard problems on ${t}.`, `Standart problemleri çöz: ${t}.`), difficulty: m.difficulty },
    { title: L(`Apply: ${t}`, `Uygula: ${t}`), milestoneType: "APPLICATION", learningObjective: L(`Use ${t} in an unfamiliar situation.`, `Alışık olmadığın bir durumda kullan: ${t}.`), difficulty: Math.min(5, m.difficulty + 1) },
  ];
}
