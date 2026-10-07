import type { CurriculumSpec } from "../../engines/curriculumSpec";
import { expr, mc, num, open } from "./helpers";

/** Elle yazılmış paket: tek değişkenli Kalkülüs 1. */
export const calculusPack: CurriculumSpec = {
  title: "Kalkülüs 1",
  subject: "Matematik",
  goal: "Limit, türev ve integrali anlayıp değişim ve birikim problemlerini modellemek ve çözmek için kullanabilmek.",
  description: "Limitler → türevler (kurallar, anlam, uygulamalar) ve integrale paralel bir yol; ikisi Temel Teoremle birleşir.",
  units: [
    {
      title: "Limitler",
      summary: "Bir fonksiyon neye yaklaşır ve bu neden önemlidir?",
      topics: [
        {
          title: "Limit fikri",
          milestones: [
            {
              key: "lim1", type: "CONCEPT", difficulty: 1, estimatedMinutes: 10,
              title: "Bir limiti grafikten ve tablodan tahmin et",
              learningObjective: "lim f(x)'in ne anlama geldiğini açıkla ve f tanımsız olsa bile sayısal ya da grafiksel kanıttan tahmin et.",
              interaction: "GRAPH_INTERPRETATION",
              questions: [
                { kind: "GRAPH_INTERPRETATION", purpose: "MASTERY", prompt: "Grafik, x = 1'de tanımsız olan f(x) = (x² − 1)/(x − 1) fonksiyonunu gösteriyor. x → 1 iken lim f(x) nedir?",
                  graph: { expression: "(x^2-1)/(x-1)", xMin: -1, xMax: 3, xLabel: "x", yLabel: "f(x)" }, numeric: { value: 2, tolerance: 0.01 },
                  hints: ["x = 1'e iki taraftan yakın değerlere bak.", "Boşluk önemli değil; eğilim önemli.", "Payı çarpanlara ayır.", "(x−1)(x+1)/(x−1) = x + 1 → 2."], solution: "x ≠ 1 için f(x) = x + 1, yani limit 2." },
                mc("MASTERY", "x → a iken lim f(x) = L ifadesini en iyi hangisi anlatır?",
                  ["x'i a'ya yeterince yakın (x ≠ a) alarak f(x)'i L'ye istediğimiz kadar yaklaştırabiliriz", "f(a) = L", "f(x), a yakınındaki bir x'te L'ye ulaşır", "L, a yakınında f'nin en büyük değeridir"], 0,
                  ["Tanım f(a)'nın var olmasını gerektiriyor mu?", "a'daki değerle değil, a yakınındaki davranışla ilgili.", "Eşitlik değil, yakınlık.", "İlk seçenek."], "Limit a'daki değeri değil, yaklaşmayı anlatır."),
                num("RETENTION", "x → 0 iken lim (sin x)/x'i tahmin et.", 1, undefined,
                  ["x = 0,1 ve 0,01 dene.", "sin(0,01)/0,01 ≈ 0,99998.", "Değerler neye yaklaşıyor?", "1."], "Limit 1'dir."),
                num("TRANSFER", "Bir tankın hacmi t ≠ 2 için V(t) = (t² − 4)/(t − 2) litre. Fonksiyonun sürekli olması için V(2) kaç olmalı?", 4, "L",
                  ["Süreklilik V(2) = lim V(t) gerektirir.", "Payı çarpanlara ayır.", "(t − 2)(t + 2)/(t − 2).", "t = 2'de t + 2."], "V(2) = 4."),
              ],
            },
            {
              key: "lim2", type: "PRACTICE", difficulty: 2, estimatedMinutes: 15, prerequisites: ["lim1"],
              title: "Limitleri cebirsel olarak hesapla",
              learningObjective: "Çarpanlara ayırma, eşlenikle çarpma ve baskın terim akıl yürütmesiyle sonsuzdakiler dahil limitleri hesapla.",
              questions: [
                num("MASTERY", "x → 3 iken lim (x² − 9)/(x − 3)", 6, undefined,
                  ["Doğrudan yerine koyma 0/0 verir.", "Payı çarpanlara ayır.", "(x − 3)(x + 3).", "x + 3 → 6."], "6."),
                num("MASTERY", "x → ∞ iken lim (3x² + 2)/(x² − 5x)", 3, undefined,
                  ["En yüksek kuvvetleri karşılaştır.", "Pay ve paydayı x²'ye böl.", "(3 + 2/x²)/(1 − 5/x).", "→ 3/1."], "3."),
                num("MASTERY", "x → 0 iken lim (√(x + 4) − 2)/x", 0.25, undefined,
                  ["Kökle 0/0: eşlenikle çarp.", "(√(x+4) + 2) ile çarp.", "x / (x(√(x+4) + 2)).", "1/4."], "1/4."),
                num("RETENTION", "x → 4 iken lim (x² − 4x)/(x − 4)", 4, undefined,
                  ["x parantezine al.", "x(x − 4)/(x − 4).", "x → 4.", "4."], "4."),
                num("TRANSFER", "Bir ilacın derişimi C(t) = 8t/(2t + 1) mg/L. Uzun vadede hangi değere yaklaşır?", 4, "mg/L",
                  ["Uzun vade t → ∞ demek.", "Baskın terimler.", "8t/2t.", "4."], "C → 4 mg/L."),
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Türevler",
      summary: "Anlık değişim hızı.",
      topics: [
        {
          title: "Anlam ve kurallar",
          milestones: [
            {
              key: "d1", type: "CONCEPT", difficulty: 2, estimatedMinutes: 15, prerequisites: ["lim2"],
              title: "Türevi eğimlerin limiti olarak yorumla",
              learningObjective: "f'(a)'yı limit tanımından hesapla ve teğet eğimi ile anlık hız olarak yorumla.",
              questions: [
                num("MASTERY", "Tanımı kullanarak, f(x) = x². f'(3) nedir?", 6, undefined,
                  ["f'(a) = lim [f(a+h) − f(a)]/h.", "(9 + 6h + h² − 9)/h.", "6 + h.", "h → 0."], "6."),
                open("CONCEPT_EXPLANATION", "MASTERY", "Türevin neden sadece bir fark oranı olarak değil de bir limit olarak tanımlandığını kendi cümlelerinle açıkla.",
                  ["bir aralık üzerindeki kesen eğimi", "aralığı küçültme, h → 0", "tek bir noktadaki eğimi / anlık hızı verir"],
                  ["(f(a+h) − f(a))/h neyi ölçer?", "Bir aralık üzerindeki ortalamayı.", "Biz tek bir andaki hızı istiyoruz.", "Aralığı küçült."], "Fark oranı ortalama değişim hızıdır; h → 0 limiti onu anlık hıza (teğet eğimine) dönüştürür."),
                num("RETENTION", "f(x) = 3x. f'(5)?", 3, undefined, ["Doğrusal fonksiyon.", "Eğim sabit.", "3.", "3."], "3."),
                num("TRANSFER", "Bir parçacığın konumu s(t) = t² + t metre. Tanımı kullanarak t = 2 s'deki hızı nedir?", 5, "m/s",
                  ["Hız, konumun türevidir.", "[(2+h)² + (2+h) − 6]/h.", "(5h + h²)/h.", "5."], "5 m/s."),
              ],
            },
            {
              key: "d2", type: "PRACTICE", difficulty: 2, estimatedMinutes: 15, prerequisites: ["d1"],
              title: "Kuvvet, toplam ve sabit kurallarıyla türev al",
              learningObjective: "Polinomların ve kuvvet fonksiyonlarının türevini akıcı biçimde al.",
              questions: [
                expr("MASTERY", "d/dx [4x³ − 5x + 7]", ["12*x^2 - 5"], ["x"],
                  ["Terim terim türev al.", "Kuvvet kuralı: n·xⁿ⁻¹.", "Sabitler kaybolur.", "12x² − 5."], "12x² − 5."),
                expr("MASTERY", "d/dx [√x + 1/x]", ["1/(2*sqrt(x)) - 1/x^2"], ["x"],
                  ["Kuvvet olarak yeniden yaz.", "x^(1/2) + x^(−1).", "Kuvvet kuralını uygula.", "½x^(−1/2) − x^(−2)."], "1/(2√x) − 1/x²."),
                expr("RETENTION", "d/dx [x⁵ + 2x²]", ["5*x^4 + 4*x"], ["x"], ["Kuvvet kuralı.", "5x⁴ …", "+ 4x.", "5x⁴ + 4x."], "5x⁴ + 4x."),
                num("TRANSFER", "q adet ürün üretmenin maliyeti C(q) = 0,02q² + 3q + 500. q = 100'de marjinal maliyet C'(q) nedir?", 7, undefined,
                  ["Marjinal maliyet türevdir.", "C'(q) = 0,04q + 3.", "100 koy.", "7."], "Ürün başına 7."),
              ],
            },
            {
              key: "d3", type: "PRACTICE", difficulty: 3, estimatedMinutes: 20, prerequisites: ["d2"],
              title: "Çarpım, bölüm ve zincir kurallarını uygula",
              learningObjective: "Fonksiyonun yapısını ayrıştır ve doğru kuralı (ya da kombinasyonu) seç.",
              questions: [
                expr("MASTERY", "d/dx [sin(3x²)]", ["6*x*cos(3*x^2)"], ["x"],
                  ["Dış fonksiyon sin, iç 3x².", "Zincir kuralı: dış' (iç) · iç'.", "cos(3x²) · 6x.", "6x cos(3x²)."], "6x·cos(3x²)."),
                expr("MASTERY", "d/dx [x² · e^x]", ["2*x*exp(x) + x^2*exp(x)"], ["x"],
                  ["İki fonksiyonun çarpımı.", "(uv)' = u'v + uv'.", "u = x², v = eˣ.", "2x eˣ + x² eˣ."], "eˣ(2x + x²)."),
                expr("RETENTION", "d/dx [(2x + 1)^5]", ["10*(2*x+1)^4"], ["x"], ["Zincir kuralı.", "5(2x+1)⁴ · 2.", "10(2x+1)⁴.", "Bitti."], "10(2x + 1)⁴."),
                expr("TRANSFER", "Bir balonun yarıçapı r(t) = 1 + 0,5t ile büyüyor. Hacim V = (4/3)π r³. dV/dt'yi t cinsinden yaz.",
                  ["2*pi*(1+0.5*t)^2"], ["t"],
                  ["V, t'ye r üzerinden bağlı.", "dV/dt = dV/dr · dr/dt.", "4πr² · 0,5.", "2π(1 + 0,5t)²."], "dV/dt = 2π(1 + 0,5t)²."),
              ],
            },
            {
              key: "d4", type: "CONCEPT", difficulty: 2, estimatedMinutes: 12, prerequisites: ["d2"],
              title: "f'nin grafiğinden türevi (f′) oku",
              learningObjective: "f'nin artan/azalan olmasını, ekstremumlarını ve bükeyliğini f'nin işareti ve davranışıyla ilişkilendir.",
              interaction: "GRAPH_INTERPRETATION",
              questions: [
                { kind: "GRAPH_INTERPRETATION", purpose: "MASTERY", prompt: "Grafik f(x) = x³ − 3x fonksiyonunu gösteriyor. Hangi aralıkta f'(x) < 0?",
                  graph: { expression: "x^3 - 3*x", xMin: -2.5, xMax: 2.5 }, choices: ["−1 < x < 1", "x < −1", "x > 1", "her yerde"], correctChoice: 0,
                  hints: ["f azalırken f' < 0.", "Eğrinin nerede aşağı indiğine bak.", "İki dönüm noktası arasında.", "|x| < 1 için f'(x) = 3x² − 3 < 0."], solution: "f, (−1, 1) aralığında azalır." },
                { kind: "GRAPH_INTERPRETATION", purpose: "MASTERY", prompt: "Aynı f(x) = x³ − 3x için f hangi pozitif x'te yerel minimuma sahiptir?",
                  graph: { expression: "x^3 - 3*x", xMin: -2.5, xMax: 2.5 }, numeric: { value: 1, tolerance: 0.03 },
                  hints: ["Yerel minimum: f' −'den +'ya geçer.", "Dönüm noktaları f' = 0'da.", "3x² − 3 = 0.", "x = 1."], solution: "x = 1." },
                mc("TRANSFER", "Bir şirketin kârı P(t) artıyor ama artış hızı yavaşlıyor. Hangisi doğru?",
                  ["P' > 0 ve P'' < 0", "P' < 0 ve P'' > 0", "P' > 0 ve P'' > 0", "P' = 0"], 0,
                  ["Artıyor ⇒ P′ türevinin işareti?", "Yavaşlıyor ⇒ P' azalıyor.", "P' azalıyorsa P'' < 0.", "İlk seçenek."], "Artan (P' > 0), aşağı bükey (P'' < 0)."),
              ],
            },
          ],
        },
        {
          title: "Uygulamalar",
          milestones: [
            {
              key: "d5", type: "APPLICATION", difficulty: 3, estimatedMinutes: 30, prerequisites: ["d3", "d4"],
              title: "Optimizasyon problemlerini çöz",
              learningObjective: "Bir sözel problemi tanım kümesiyle birlikte fonksiyona çevir, kritik noktaları bul ve optimumu gerekçelendir.",
              interaction: "PROBLEM_SOLVING",
              questions: [
                num("MASTERY", "Bir dikdörtgenin çevresi 40 m. Alabileceği en büyük alan kaç m²?", 100, "m²",
                  ["Alanı tek değişkenle yaz.", "w = 20 − l, A = l(20 − l).", "A'(l) = 20 − 2l = 0.", "l = 10, A = 100."], "A_max = 100 m² (bir kare)."),
                num("MASTERY", "12 × 12 cm'lik bir levhanın köşelerinden x kenarlı kareler kesilerek üstü açık bir kutu yapılıyor. Hacmi en büyük yapan x (cm) nedir?", 2, "cm",
                  ["V(x) = x(12 − 2x)².", "Türev: V' = (12 − 2x)(12 − 6x).", "Kritik noktalar x = 6 veya x = 2.", "x = 6 sıfır hacim verir."], "x = 2 cm."),
                num("TRANSFER", "Bir çiftçi nehir kenarında (nehir tarafına çit yok) 600 m çitle dikdörtgen bir tarla çeviriyor. En büyük alan (m²)?", 45000, "m²",
                  ["Yalnızca üç kenara çit gerekir.", "2w + l = 600.", "A = w(600 − 2w).", "w = 150, l = 300."], "45 000 m²."),
              ],
            },
          ],
        },
      ],
    },
    {
      title: "İntegraller",
      summary: "Birikim — limitlerden ulaşılır, Temel Teoremle tamamlanır.",
      topics: [
        {
          title: "Birikim",
          milestones: [
            {
              key: "i1", type: "CONCEPT", difficulty: 2, estimatedMinutes: 15, prerequisites: ["lim2"],
              title: "Belirli integrali birikmiş alan olarak yorumla",
              learningObjective: "Birikimi Riemann toplamlarıyla yaklaşık hesapla ve işaretli alanı yorumla.",
              questions: [
                num("MASTERY", "4 eşit aralıklı sol Riemann toplamıyla ∫₀⁴ x dx'i yaklaşık hesapla.", 6, undefined,
                  ["Aralık genişliği 1.", "Sol uçlar: 0, 1, 2, 3.", "f değerleri × genişliği topla.", "0 + 1 + 2 + 3."], "6 (gerçek değer 8)."),
                mc("MASTERY", "Bir hız grafiği [0, 2]'de negatif, [2, 5]'te pozitif. ∫₀⁵ v dt neyi temsil eder?",
                  ["Net yer değiştirme", "Alınan toplam yol", "Ortalama hız", "Son hız"], 0,
                  ["İşaretli alan.", "Negatif kısımlar çıkarılır.", "Bu konumdaki net değişimdir.", "Yer değiştirme."], "Net yer değiştirme."),
                num("TRANSFER", "Bir tanka 10 dk boyunca sabit 3 L/dk, sonra 4 dk boyunca 5 L/dk su akıyor. Eklenen toplam hacim (L)?", 50, "L",
                  ["Birikim = parça parça hız × süre.", "30 + 20.", "Hız grafiğinin altındaki alan.", "50."], "50 L."),
              ],
            },
            {
              key: "i2", type: "PRACTICE", difficulty: 3, estimatedMinutes: 20, prerequisites: ["i1", "d2"],
              title: "İntegralleri Temel Teoremle hesapla",
              learningObjective: "Ters türevleri bul ve belirli integralleri F(b) − F(a) ile hesapla.",
              questions: [
                num("MASTERY", "∫₀² (3x² + 1) dx", 10, undefined,
                  ["Bir ters türev bul.", "x³ + x.", "2'de ve 0'da hesapla.", "8 + 2 − 0."], "10."),
                num("MASTERY", "∫₁^e (1/x) dx", 1, undefined, ["1/x'in ters türevi.", "ln|x|.", "ln e − ln 1.", "1."], "1."),
                num("RETENTION", "∫₀³ 2x dx", 9, undefined, ["x².", "9 − 0.", "9.", "9."], "9."),
                num("TRANSFER", "Bir parçacığın hızı v(t) = 6t − t² m/s. t = 0 ile t = 6 s arasında ne kadar yol alır?", 36, "m",
                  ["[0, 6]'da v ≥ 0, yani yol = ∫v dt.", "Ters türev 3t² − t³/3.", "6'da: 108 − 72.", "36."], "36 m."),
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Sentez",
      topics: [
        {
          title: "Tekrar ve meydan okuma",
          milestones: [
            {
              key: "rev", type: "REVIEW", difficulty: 2, estimatedMinutes: 10, prerequisites: ["d2", "i1"],
              title: "Tekrar: hız mı, birikim mi?",
              learningObjective: "Problemin ifadesinden türev (hız) mı yoksa integral (birikim) mi istendiğine karar ver.",
              questions: [
                mc("MASTERY", "\"Yağış hızı bilindiğine göre öğleden sonra 2 ile 5 arasında toplam ne kadar yağmur yağdı?\" Bunun için gereken…",
                  ["Hızın integrali", "Hızın türevi", "Saat 5'teki hız", "Sonsuzdaki limit"], 0,
                  ["Soru bir hız mı, bir toplam mı soruyor?", "Hızdan toplam = birikim.", "Birikim bir integraldir.", "İlk seçenek."], "Hızdan bir toplam, integraldir."),
                mc("MASTERY", "\"T(t) verildiğine göre öğlende sıcaklık ne kadar hızlı değişiyor?\" Bunun için gereken…",
                  ["T'(12)", "∫ T dt", "T(12)", "t → ∞ iken lim T(t)"], 0,
                  ["Tek bir andaki hız.", "Anlık hız = türev.", "Öğlende hesapla.", "T'(12)."], "Anlık hız bir türevdir."),
              ],
            },
            {
              key: "mvt", type: "CHALLENGE", difficulty: 4, estimatedMinutes: 40, optional: true, prerequisites: ["d4"],
              title: "Meydan okuma: Ortalama Değer Teoreminin bir sonucunu ispatla",
              learningObjective: "Bir aralıkta türevi sıfır olan bir fonksiyonun sabit olduğunu kesin biçimde ispatla.",
              interaction: "PROOF",
              questions: [
                open("PROOF", "MASTERY", "İspatla: f, (a, b)'de türevlenebilir, [a, b]'de sürekli ve (a, b)'deki her x için f'(x) = 0 ise f, [a, b]'de sabittir.",
                  ["[a, b]'de keyfi x₁ < x₂ alıyor", "[x₁, x₂] üzerinde ODT koşullarını kontrol ediyor", "ODT'yi uyguluyor: f(x₂) − f(x₁) = f'(c)(x₂ − x₁)", "f'(c) = 0 olduğundan f(x₂) = f(x₁), yani sabit sonucuna varıyor"],
                  ["f'nin iki keyfi değerini karşılaştırman gerekiyor.", "Hangi teorem f'nin değerlerini f''ye bağlar?", "[x₁, x₂] üzerinde Ortalama Değer Teoremini uygula.", "f(x₂) − f(x₁) = f'(c)(x₂ − x₁) ve f'(c) = 0."],
                  "[a, b]'deki her x₁ < x₂ için f, [x₁, x₂]'de sürekli ve (x₁, x₂)'de türevlenebilirdir. ODT'ye göre f(x₂) − f(x₁) = f'(c)(x₂ − x₁) = 0 olacak bir c vardır. Dolayısıyla tüm değerler eşittir: f sabittir."),
              ],
            },
          ],
        },
        {
          title: "Final",
          milestones: [
            {
              key: "boss", type: "BOSS", difficulty: 5, estimatedMinutes: 60, prerequisites: ["d5", "i2"],
              title: "Final: ilişkili oranlar ve birikim",
              learningObjective: "Değişen bir sistemi, daha önce görmediğin bir bağlamda türev ve integrali birlikte kullanarak modelle.",
              requiredCorrect: 2,
              questions: [
                num("MASTERY", "5 m'lik bir merdiven duvardan aşağı kayıyor. Tabanı duvardan 3 m uzaktayken taban 0,4 m/s ile uzaklaşıyor. Tepe kaç m/s ile aşağı kayıyor?", 0.3, "m/s",
                  ["x² + y² = 25.", "Türev: 2x x' + 2y y' = 0.", "x = 3'te y = 4.", "y' = −(3·0,4)/4."], "Tepe 0,3 m/s ile aşağı kayar."),
                num("MASTERY", "Bir tanktan r(t) = 2e^(−0,5t) L/dk hızıyla su sızıyor. İlk 4 dakikada ne kadar sızar?", 3.459, "L",
                  ["Toplam = ∫₀⁴ r dt.", "Ters türev −4e^(−0,5t).", "−4e^(−2) + 4.", "4(1 − e^(−2))."], "4(1 − e⁻²) ≈ 3,46 L."),
                num("TRANSFER", "Koni biçimli bir huni (yarıçap = yükseklik) dV/dt = −2 cm³/s ile boşalıyor. h = 4 cm iken yükseklik kaç cm/s hızla azalır? (V = πh³/3)", 0.0398, "cm/s",
                  ["V = πh³/3.", "dV/dt = πh² dh/dt.", "−2 = 16π dh/dt.", "dh/dt = −1/(8π)."], "|dh/dt| = 1/(8π) ≈ 0,040 cm/s."),
              ],
            },
          ],
        },
      ],
    },
  ],
};
