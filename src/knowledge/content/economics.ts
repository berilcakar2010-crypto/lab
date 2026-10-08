import { builder } from "../dsl";

export const ECONOMICS = builder("EKONOMI")
  // ---------------------------------------------------------------------------
  .unit("Mikroekonomi", "Piyasalar")
  .o("econ.micro.scarcity", "Kıtlık, fırsat maliyeti ve üretim olanakları", {
    d: "Kıtlık ve seçim, fırsat maliyeti, üretim olanakları eğrisi (ÜOE), artan fırsat maliyeti, mutlak ve karşılaştırmalı üstünlük ile uzmanlaşmadan kazanç.",
    w: "Ekonominin tüm modellerinin çıkış noktasıdır; zamanını ders ve projeler arasında paylaştırırken de aynı fırsat maliyeti mantığını kullanırsın.",
    pre: ["gk.econ.micro~h", "math.found.functions~s"],
    q: [
      "Bir konsere 'bedava' bilet buldun ama o akşam saati 200 TL'ye ders vereceğin bir öğrencin vardı. Konser gerçekten bedava mı?",
      "Bir ülke hem buğdayı hem kumaşı komşusundan daha verimli üretiyorsa, ticaret yapmanın ona bir yararı olabilir mi? Tahmin et.",
    ],
    cq: [
      "ÜOE neden genellikle dışa doğru bükülüdür?",
      "Karşılaştırmalı üstünlük, mutlak üstünlük olmadan da ticareti nasıl kârlı kılar?",
      "Eğri üzerindeki, içindeki ve dışındaki noktalar neyi ifade eder?",
    ],
    obj: [
      "Bir üretim tablosundan fırsat maliyetlerini hesaplar ve ÜOE çizer.",
      "İki ülke ya da iki kişi için karşılaştırmalı üstünlüğü belirler ve karşılıklı yararlı ticaret oranları aralığını bulur.",
      "Teknoloji ve kaynak değişikliklerinin ÜOE'yi nasıl kaydırdığını açıklar.",
    ],
    ev: "HESAPLAMA DIAGRAM PROBLEM_COZME",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Fırsat maliyetinin yalnızca ödenen para olduğunu sanmak.",
      "Her şeyi daha iyi üreten tarafın ticaretten kazancı olmayacağını düşünmek.",
    ],
    x: [
      "math.found.functions:ÜOE iki mal arasındaki bir fonksiyon ve eğrinin eğimi fırsat maliyetidir",
      "comp.meta.exam-strategy:sınırlı zamanı sorular arasında paylaştırırken fırsat maliyeti",
    ],
    ca: ["Ekonomi olimpiyatlarında karşılaştırmalı üstünlük soruları"],
    rel: ["econ.intl.trade"],
    tags: ["kıtlık", "fırsat-maliyeti", "üoe"],
  })
  .o("econ.micro.elasticity", "Esneklik", {
    d: "Talebin fiyat, gelir ve çapraz esnekliği; arzın fiyat esnekliği; orta nokta yöntemi; esneklik ile toplam gelir ilişkisi ve vergi yükünün paylaşımı.",
    w: "Bir fiyat artışının satıcının gelirini artırıp artırmayacağını, bir verginin yükünü kimin taşıyacağını tahmin etmeni sağlar.",
    pre: ["gk.econ.micro", "math.found.functions"],
    q: [
      "Bir müze bilet fiyatını iki katına çıkardı ve ziyaretçi sayısı %30 düştü. Müzenin bilet geliri arttı mı, azaldı mı?",
      "Sigaraya konan bir vergiyi asıl kim öder: üretici mi, tüketici mi? Neye bağlı?",
    ],
    cq: [
      "Esneklik neden eğimden farklıdır ve neden birimden bağımsızdır?",
      "Talep esnekliği ile toplam gelir arasında nasıl bir ilişki vardır?",
      "Bir malın talebini esnek ya da inelastik yapan etkenler nelerdir?",
    ],
    obj: [
      "Orta nokta yöntemiyle fiyat, gelir ve çapraz esnekliği hesaplar ve malları buna göre sınıflandırır.",
      "Doğrusal bir talep eğrisi boyunca esnekliğin neden değiştiğini türetir ve toplam gelirin en büyük olduğu noktayı bulur.",
      "Arz ve talep esnekliklerinden vergi yükünün paylaşımını tahmin eder.",
    ],
    ev: "HESAPLAMA TURETME TAHMIN",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Doğrusal bir talep eğrisinin her noktada aynı esnekliğe sahip olduğunu sanmak.",
      "Esnekliği eğimle aynı şey saymak.",
      "Verginin her zaman kanunen ödeyen tarafın üzerinde kaldığını düşünmek.",
    ],
    x: [
      "math.calc.derivative-def:nokta esnekliği türev ile oranın çarpımıdır",
      "math.found.exp-log:sabit esneklikli talep log–log düzleminde doğrudur",
    ],
    ca: ["AP Microeconomics esneklik ve vergi yükü soruları"],
    rel: ["econ.micro.consumer", "econ.micro.market-failure"],
    tags: ["esneklik", "talep", "vergi"],
  })
  .o("econ.micro.consumer", "Tüketici seçimi ve marjinal fayda", {
    d: "Toplam ve marjinal fayda, azalan marjinal fayda, bütçe kısıtı, lira başına marjinal faydanın eşitlenmesi kuralı, gelir ve ikame etkileri, tüketici artığı.",
    w: "Talep eğrisinin neden aşağı eğimli olduğunu bireysel kararlardan türetir; kısıtlı optimizasyonun ekonomideki ilk örneğidir.",
    pre: ["econ.micro.scarcity", "math.calc.derivative-def~c"],
    q: [
      "Su hayati, elmas süs eşyası; yine de elmas sudan çok daha pahalı. Bu 'paradoksu' nasıl çözersin?",
      "Bir pizzacıda ikinci dilim birinciden daha az keyif veriyorsa, kaç dilimde durmalısın?",
    ],
    cq: [
      "Sınırlı bütçe ile fayda nasıl en büyüklenir?",
      "Fiyat değişiminin etkisi gelir ve ikame etkilerine nasıl ayrılır?",
      "Tüketici artığı neyi ölçer?",
    ],
    obj: [
      "Bir fayda tablosu ve bütçe kısıtıyla lira başına marjinal faydayı eşitleyerek en iyi tüketim sepetini bulur.",
      "Bireysel tercihlerden talep eğrisini türetir ve tüketici artığını hesaplar.",
      "Bir fiyat değişikliğinin gelir ve ikame etkilerini ayırt eder.",
    ],
    ev: "HESAPLAMA TURETME PROBLEM_COZME",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Toplam faydanın en büyük olduğu yerde tüketmenin bütçe kısıtı altında da en iyi seçim olduğunu sanmak.",
      "Marjinal faydanın toplam faydayla aynı şey olduğunu düşünmek.",
    ],
    x: [
      "math.calc.applications:kısıtlı optimizasyon ve marjinal analiz",
      "gk.econ.behavioral:rasyonel seçim modelinin davranışsal sınırları",
    ],
    rel: ["econ.micro.elasticity"],
    vs: ["psy.cognition.thinking"],
    tags: ["fayda", "bütçe", "talep"],
  })
  .o("econ.micro.production-costs", "Üretim ve maliyetler", {
    d: "Kısa ve uzun dönem, azalan marjinal getiri, sabit/değişken/toplam maliyet, ortalama ve marjinal maliyet eğrileri, ölçek ekonomileri ve kâr maksimizasyonu (MR = MC).",
    w: "Firmaların ne kadar üreteceğine nasıl karar verdiğini açıklar; marjinal düşünmenin ve eğri ilişkilerinin en temiz örneğidir.",
    pre: ["econ.micro.scarcity", "math.found.functions"],
    q: [
      "Bir fırına bir işçi daha alınca üretim artıyor; onuncu işçide ise neredeyse hiç artmıyor. Neden? Ne zaman işçi almayı bırakmalı?",
      "Marjinal maliyet eğrisi ortalama maliyet eğrisini neden tam en düşük noktasında keser? Önce sınıf not ortalaması üzerinden düşün.",
    ],
    cq: [
      "Azalan marjinal getiri maliyet eğrilerinin biçimini nasıl belirler?",
      "Marjinal maliyet ile ortalama maliyet arasındaki ilişki nedir?",
      "Kısa dönemde ne zaman zararına üretmeye devam etmek mantıklıdır?",
    ],
    obj: [
      "Bir üretim tablosundan marjinal ürün, ortalama ve marjinal maliyetleri hesaplar ve grafiğe döker.",
      "MC eğrisinin AC eğrisini en düşük noktasında kestiğini türetir.",
      "MR = MC kuralıyla kâr maksimize eden üretim miktarını ve kapanma noktasını belirler.",
    ],
    ev: "HESAPLAMA TURETME DIAGRAM",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Sabit maliyetlerin kısa dönemde üretim kararını etkilediğini sanmak.",
      "Kârın en büyük olduğu yerin ortalama maliyetin en düşük olduğu yer olduğunu düşünmek.",
    ],
    x: [
      "math.calc.derivative-def:marjinal maliyet toplam maliyetin türevidir",
      "math.calc.applications:kâr fonksiyonunu en büyükleme",
    ],
    ca: ["AP Microeconomics maliyet eğrisi grafikleri"],
    rel: ["econ.micro.market-structures", "econ.micro.factor-markets"],
    tags: ["maliyet", "marjinal", "üretim"],
  })
  .o("econ.micro.market-structures", "Piyasa yapıları: tam rekabet, tekel, oligopol", {
    d: "Tam rekabette fiyat alıcılık ve uzun dönem dengesi, tekelde fiyat belirleme ve ölü ağırlık kaybı, tekelci rekabet, oligopolde stratejik etkileşim ve fiyat farklılaştırması.",
    w: "Piyasa gücünün fiyatları ve toplum refahını nasıl değiştirdiğini gösterir; rekabet politikası tartışmalarının temelidir.",
    pre: ["econ.micro.production-costs", "gk.econ.micro"],
    q: [
      "Tek bir ilaç şirketi patentli bir ilacı satıyor. İlacı olabildiğince pahalıya mı satar? Hangi fiyatta durur?",
      "Uçak biletinde yanındaki yolcunun senden çok daha ucuza bilet almış olması nasıl mümkün ve neden kârlı?",
    ],
    cq: [
      "Tam rekabette uzun dönemde ekonomik kâr neden sıfıra iner?",
      "Tekelci neden marjinal gelirin fiyattan düşük olduğu bir eğriyle karşılaşır?",
      "Ölü ağırlık kaybı nedir ve nasıl ölçülür?",
    ],
    obj: [
      "Tam rekabet ve tekel için denge fiyatını, miktarı ve kârı grafikle ve hesapla bulur.",
      "Tekelin marjinal gelir eğrisini doğrusal talepten türetir ve ölü ağırlık kaybını hesaplar.",
      "Piyasa yapılarını firma sayısı, giriş engeli ve fiyat gücü bakımından karşılaştırır.",
    ],
    ev: "HESAPLAMA TURETME DIAGRAM PROBLEM_COZME",
    t: "KAVRAM",
    lv: 4,
    sc: "L",
    mis: [
      "Tekelcinin istediği her fiyatı koyabileceğini ve talebin bunu sınırlamadığını sanmak.",
      "Tam rekabette firmaların hiç kazanç sağlamadığını (muhasebe kârı ile ekonomik kârı karıştırmak) düşünmek.",
    ],
    x: [
      "math.calc.applications:marjinal gelirin sıfır olduğu ve MR = MC noktalarının bulunması",
      "cs.impact.ethics:dijital platformlarda piyasa gücü ve ağ etkileri",
    ],
    ca: ["AP Microeconomics serbest yanıt grafik soruları", "Ekonomi olimpiyatı piyasa yapısı problemleri"],
    rel: ["econ.micro.game-theory", "econ.micro.market-failure"],
    tags: ["rekabet", "tekel", "oligopol"],
  })
  .o("econ.micro.game-theory", "Oyun kuramına giriş", {
    d: "Normal biçimli oyunlar, baskın strateji, Nash dengesi, mahkûmlar ikilemi, koordinasyon oyunları, karma stratejiler ve tekrarlanan oyunlarda iş birliği.",
    w: "Oligopolden silahlanma yarışına, evrimsel biyolojiden ekip çalışmasına kadar stratejik etkileşimi modellemeyi sağlar.",
    pre: ["econ.micro.market-structures", "math.prob.basics~s"],
    q: [
      "İki şirket aynı anda fiyat belirliyor; ikisi de yüksek fiyat koyarsa ikisi de kazanır. Yine de neden sık sık fiyat savaşına girerler?",
      "Taş-kâğıt-makas'ta 'en iyi strateji' nedir? Rakibin her zaman taş seçiyorsa cevabın değişir mi?",
    ],
    cq: [
      "Nash dengesi nedir ve neden her zaman herkes için en iyi sonuç değildir?",
      "Saf strateji dengesi olmayan bir oyunda karma strateji nasıl bulunur?",
      "Tekrarlanan oyunlar iş birliğini nasıl sürdürülebilir kılar?",
    ],
    obj: [
      "Bir ödeme matrisinde baskın stratejileri ve saf strateji Nash dengelerini bulur.",
      "İki oyunculu iki stratejili bir oyunda karma strateji dengesini kayıtsızlık koşulundan türetir.",
      "Mahkûmlar ikilemini oligopol, çevre ya da sosyal bir duruma uygular ve iş birliğini destekleyen mekanizmaları açıklar.",
    ],
    ev: "PROBLEM_COZME TURETME MODELLEME",
    t: "MODELLEME",
    lv: 4,
    sc: "M",
    mis: [
      "Nash dengesinin her zaman toplam kazancı en büyükleyen sonuç olduğunu sanmak.",
      "Karma stratejinin 'rastgele, düşünmeden oynamak' anlamına geldiğini düşünmek.",
    ],
    x: [
      "math.prob.random-vars:karma stratejilerde beklenen kazanç hesabı",
      "bio.evolution:evrimsel olarak kararlı stratejiler",
      "psy.social:sosyal ikilemlerde iş birliği davranışı",
    ],
    ca: ["Matematik ve ekonomi olimpiyatlarında oyun kuramı problemleri"],
    rel: ["econ.micro.market-structures"],
    tags: ["oyun-kuramı", "nash", "strateji"],
  })
  .o("econ.micro.factor-markets", "Faktör piyasaları ve gelir dağılımı", {
    d: "Türetilmiş talep, emeğin marjinal ürün değeri, işgücü arzı, ücret belirlenmesi, monopson, asgari ücret tartışması ve gelir eşitsizliğinin ölçümü (Lorenz eğrisi, Gini katsayısı).",
    w: "Ücretlerin neden farklı olduğunu ve eşitsizliğin nasıl ölçüldüğünü açıklar; toplumsal tartışmalarda sayıları doğru okumanı sağlar.",
    pre: ["econ.micro.production-costs"],
    q: [
      "Bir hemşire hayat kurtarıyor, bir futbolcu gol atıyor; ama futbolcu çok daha fazla kazanıyor. Ücretleri ne belirler?",
      "Asgari ücret artışı istihdamı azaltır mı? Cevabın piyasada kaç işveren olduğuna bağlı olabilir mi?",
    ],
    cq: [
      "Bir firma kaç işçi çalıştıracağına nasıl karar verir?",
      "Monopson piyasasında asgari ücretin etkisi rekabetçi piyasadan nasıl farklıdır?",
      "Gelir eşitsizliği nasıl ölçülür ve bu ölçütlerin sınırları nelerdir?",
    ],
    obj: [
      "Marjinal ürün değeri ile ücreti eşitleyerek firmanın emek talebini hesaplar.",
      "Bir gelir dağılımı verisinden Lorenz eğrisini çizer ve Gini katsayısını hesaplar.",
      "Asgari ücretin etkisini rekabetçi ve monopson modellerinde karşılaştırır.",
    ],
    ev: "HESAPLAMA VERI_ANALIZI MODELLEME",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Ücretin işin toplumsal önemine göre belirlendiğini sanmak.",
      "Gini katsayısının tek başına bir toplumun refahını özetlediğini düşünmek.",
    ],
    x: [
      "math.calc.integral-apps:Gini katsayısı Lorenz eğrisi ile eşitlik doğrusu arasındaki alandır",
      "gk.geo.human:nüfus, göç ve işgücü hareketleri",
    ],
    rel: ["econ.micro.market-failure"],
    tags: ["emek", "ücret", "eşitsizlik"],
  })
  .o("econ.micro.market-failure", "Piyasa aksaklıkları ve kamu politikası", {
    d: "Dışsallıklar, kamu malları ve bedavacılık, ortak kaynaklar, asimetrik bilgi; Pigou vergisi, sübvansiyon, emisyon ticareti ve düzenleme; devlet başarısızlığı.",
    w: "Kirlilik, aşılar ve iklim gibi sorunlarda piyasanın neden yetersiz kalabileceğini ve hangi politika araçlarının ne zaman işe yaradığını gösterir.",
    pre: ["econ.micro.market-structures~s", "gk.econ.micro"],
    q: [
      "Bir fabrika nehre atık döküyor ve aşağıdaki balıkçılar zarar görüyor. Fabrikanın ürettiği miktar toplum için 'doğru' miktar mı? Neden?",
      "Deniz feneri herkese yararlı ama kimse parasını ödemek istemiyor. Bu nasıl çözülür?",
    ],
    cq: [
      "Negatif dışsallık özel ve sosyal maliyeti nasıl ayırır?",
      "Kamu malını özel maldan ayıran iki özellik nedir?",
      "Vergi, kota ve emisyon ticareti aynı hedefe hangi farklı yollarla ulaşır?",
    ],
    obj: [
      "Dışsallık içeren bir piyasada sosyal optimum miktarı ve ölü ağırlık kaybını grafikle bulur.",
      "Bir malı rakiplik ve dışlanabilirlik bakımından sınıflandırır ve bedavacılık sorununu açıklar.",
      "Bir çevre sorunu için vergi, düzenleme ve emisyon ticareti seçeneklerini karşılaştırır.",
    ],
    ev: "DIAGRAM HESAPLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Optimal kirlilik düzeyinin her zaman sıfır olduğunu sanmak.",
      "Piyasa aksaklığı varsa devlet müdahalesinin her zaman durumu düzelteceğini düşünmek.",
    ],
    x: [
      "env.sustainability:çevre politikasının ekonomik araçları",
      "env.pollution.air:hava kirliliği negatif dışsallığın tipik örneğidir",
      "psy.social:bedavacılık ve sosyal kaytarma",
    ],
    rel: ["econ.micro.game-theory", "econ.boss"],
    tags: ["dışsallık", "kamu-malı", "politika"],
  })

  // ---------------------------------------------------------------------------
  .unit("Makroekonomi", "Ulusal ekonomi")
  .o("econ.macro.gdp", "Ulusal gelir hesapları ve GSYH", {
    d: "GSYH'nin harcama, gelir ve üretim yöntemleriyle ölçümü; nominal ve reel GSYH, GSYH deflatörü, kişi başı GSYH ve refah ölçütü olarak sınırları.",
    w: "Haberlerdeki büyüme rakamlarının ne anlama geldiğini çözmeni ve ülkeleri doğru karşılaştırmanı sağlar.",
    pre: ["gk.econ.macro"],
    q: [
      "Bir ülkede herkes aynı miktarda üretiyor ama fiyatlar ikiye katlandı. GSYH ikiye katlanır mı? Ülke zenginleşti mi?",
      "Komşunun bahçesini parayla biçersen GSYH artar; kendi bahçeni biçersen artmaz. Bu bir sorun mu?",
    ],
    cq: [
      "Üç ölçüm yöntemi neden aynı sonucu vermelidir?",
      "Nominal ve reel GSYH nasıl ayrılır?",
      "GSYH refahın hangi boyutlarını kaçırır?",
    ],
    obj: [
      "Verilen harcama kalemlerinden GSYH'yi hesaplar ve ara malları çift saymaktan kaçınır.",
      "Fiyat ve miktar verisinden reel GSYH, deflatör ve büyüme oranını hesaplar.",
      "Ülkeler arası kişi başı GSYH karşılaştırmasının sınırlarını yorumlar.",
    ],
    ev: "HESAPLAMA YORUMLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "İkinci el mal satışlarının ve finansal işlemlerin GSYH'ye girdiğini sanmak.",
      "Nominal GSYH artışının her zaman üretimin arttığını gösterdiğini düşünmek.",
    ],
    x: [
      "media.lit.stats-in-news:büyüme rakamlarını haberlerde doğru okuma",
      "math.found.arithmetic:yüzde değişim ve endeks hesapları",
    ],
    rel: ["econ.macro.inflation-unemployment"],
    tags: ["gsyh", "milli-gelir", "reel"],
  })
  .o("econ.macro.inflation-unemployment", "Enflasyon ve işsizliğin ölçümü", {
    d: "Tüketici fiyat endeksi ve sepet yöntemi, enflasyonun maliyetleri, reel ve nominal faiz, işsizlik oranı ve işgücüne katılım, işsizlik türleri ve doğal işsizlik.",
    w: "Maaşının, birikiminin ve faiz oranlarının gerçekte ne kadar değer taşıdığını hesaplamayı sağlar; makro politikanın iki ana göstergesini tanıtır.",
    pre: ["econ.macro.gdp"],
    q: [
      "Maaşın %20 arttı, fiyatlar %30 arttı. Zenginleştin mi, yoksulladın mı? Kaç yüzde?",
      "İş aramayı bırakan biri işsizlik oranını artırır mı, azaltır mı?",
    ],
    cq: [
      "Fiyat endeksi nasıl hesaplanır ve hangi yanlılıklara açıktır?",
      "Enflasyon kimi kazandırır, kimi kaybettirir?",
      "İşsizlik oranı nasıl tanımlanır ve ne zaman yanıltıcı olabilir?",
    ],
    obj: [
      "Bir sepet verisinden fiyat endeksi ve enflasyon oranı hesaplar.",
      "Fisher bağıntısıyla reel faizi hesaplar ve beklenmeyen enflasyonun borçlu ile alacaklıya etkisini açıklar.",
      "İşgücü verisinden işsizlik ve katılım oranlarını hesaplar ve işsizlik türlerini ayırt eder.",
    ],
    ev: "HESAPLAMA YORUMLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Enflasyonun 'her şeyin pahalanması' ile aynı olduğunu ve göreli fiyat değişimlerinden ayırt edilmediğini sanmak.",
      "Doğal işsizlik oranının sıfır olması gerektiğini düşünmek.",
    ],
    x: [
      "gk.econ.personal-finance:reel faiz ve birikimin satın alma gücü",
      "math.found.exp-log:bileşik enflasyon ve yıllıklandırma",
      "media.lit.stats-in-news:endeks ve oran haberlerini değerlendirme",
    ],
    rel: ["econ.macro.ad-as"],
    tags: ["enflasyon", "işsizlik", "tüfe"],
  })
  .o("econ.macro.ad-as", "Toplam talep–toplam arz modeli", {
    d: "Toplam talep bileşenleri ve eğrinin eğimi, kısa ve uzun dönem toplam arz, makroekonomik denge, talep ve arz şokları, enflasyon açığı ve durgunluk açığı, kısa dönem Phillips eğrisi.",
    w: "Durgunluk, enflasyon ve stagflasyonu tek bir grafikle açıklayan temel makro modeldir; politika tartışmalarının ortak dilidir.",
    pre: ["econ.macro.gdp", "econ.micro.elasticity~s"],
    q: [
      "Petrol fiyatları aniden ikiye katlanırsa hem fiyatlar hem işsizlik artabilir mi? Ders kitaplarındaki 'biri artarken diğeri azalır' kuralı ne olur?",
      "Herkes aynı anda tasarrufu artırırsa ekonomi büyür mü, küçülür mü?",
    ],
    cq: [
      "Toplam talep eğrisi neden aşağı eğimlidir?",
      "Kısa ve uzun dönem toplam arz arasındaki fark nedir?",
      "Ekonomi bir şoktan sonra kendiliğinden nasıl uzun dönem dengeye döner?",
    ],
    obj: [
      "Bir talep ya da arz şokunun fiyat düzeyi ve reel üretim üzerindeki kısa ve uzun dönem etkisini diyagramla gösterir.",
      "Enflasyon açığı ve durgunluk açığını belirler ve kendiliğinden uyum sürecini açıklar.",
      "AD–AS modelini kısa dönem Phillips eğrisiyle ilişkilendirir.",
    ],
    ev: "DIAGRAM MODELLEME TAHMIN",
    t: "MODELLEME",
    lv: 3,
    sc: "L",
    mis: [
      "Toplam talep eğrisinin tek bir malın talep eğrisiyle aynı nedenle aşağı eğimli olduğunu sanmak.",
      "Uzun dönem toplam arzın fiyat düzeyine bağlı olduğunu düşünmek.",
    ],
    x: [
      "math.dyn.stability:denge ve şoktan sonra dengeye dönüş",
      "econ.micro.elasticity:arz ve talep diyagramlarının makro düzeydeki benzeri",
    ],
    ca: ["AP Macroeconomics AD–AS serbest yanıt soruları"],
    rel: ["econ.macro.monetary-fiscal", "econ.macro.growth"],
    tags: ["ad-as", "durgunluk", "şok"],
  })
  .o("econ.macro.money-banking", "Para, bankacılık ve merkez bankası", {
    d: "Paranın işlevleri, para arzı tanımları, kısmi rezerv bankacılığı ve para çarpanı, banka bilançosu, merkez bankasının araçları ve para piyasası.",
    w: "Bankaların nasıl 'para yarattığını' ve merkez bankası kararlarının günlük hayata nasıl yansıdığını açıklar.",
    pre: ["econ.macro.gdp"],
    q: [
      "Bankaya 1000 TL yatırdın. Banka bunun bir kısmını kredi olarak verirse ekonomideki toplam para miktarı değişir mi?",
      "Bir ülke istediği kadar para basarsa neden herkes zengin olmaz?",
    ],
    cq: [
      "Kısmi rezerv sistemi para arzını nasıl çoğaltır?",
      "Merkez bankası para arzını ve faizi hangi araçlarla etkiler?",
      "Paranın değeri neye dayanır?",
    ],
    obj: [
      "Bir banka bilançosu üzerinden mevduat ve kredi işlemlerini izler ve basit para çarpanını hesaplar.",
      "Para piyasası diyagramıyla para arzı değişiminin faiz oranına etkisini gösterir.",
      "Merkez bankası araçlarının işleyişini açıklar ve güncel uygulamayı resmî kaynaktan doğrulama yolunu belirtir.",
    ],
    ev: "HESAPLAMA DIAGRAM ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Bankaların yalnızca yatırılan parayı başkalarına aktardığını, yeni para yaratmadığını sanmak.",
      "Basit para çarpanının gerçek ekonomide her zaman tam olarak işlediğini düşünmek.",
    ],
    x: [
      "math.found.sequences:para çarpanı geometrik serinin toplamıdır",
      "gk.econ.personal-finance:mevduat, kredi ve faiz",
    ],
    rel: ["econ.macro.monetary-fiscal"],
    tags: ["para", "banka", "merkez-bankası"],
  })
  .o("econ.macro.monetary-fiscal", "Para ve maliye politikası", {
    d: "Genişletici ve daraltıcı para ve maliye politikası, harcama ve vergi çarpanları, bütçe açığı ve kamu borcu, dışlama etkisi, politika gecikmeleri ve beklentilerin rolü.",
    w: "Durgunluk ve enflasyonla mücadelede hangi aracın nasıl işlediğini ve hangi ödünleşimleri getirdiğini değerlendirmeni sağlar.",
    pre: ["econ.macro.ad-as", "econ.macro.money-banking"],
    q: [
      "Devlet ekonomiye 100 birimlik harcama yaparsa GSYH 100'den fazla artabilir mi? Nasıl?",
      "Hem işsizlik hem enflasyon yüksekken merkez bankası faizi artırmalı mı, düşürmeli mi?",
    ],
    cq: [
      "Harcama çarpanı nasıl türetilir ve neden vergi çarpanından büyüktür?",
      "Para politikası toplam talebi hangi aktarım kanallarıyla etkiler?",
      "Bütçe açıkları özel yatırımı neden dışlayabilir?",
    ],
    obj: [
      "Marjinal tüketim eğiliminden harcama ve vergi çarpanlarını türetir ve hesaplar.",
      "Bir durgunluk ya da enflasyon senaryosu için uygun para ve maliye politikasını AD–AS ve para piyasası diyagramlarıyla gösterir.",
      "Dışlama etkisini ve politika gecikmelerini bir politika önerisinin sınırları olarak değerlendirir.",
    ],
    ev: "TURETME DIAGRAM PROBLEM_COZME",
    t: "UYGULAMA",
    lv: 4,
    sc: "L",
    mis: [
      "Para politikasının ve maliye politikasının aynı kurum tarafından yürütüldüğünü sanmak.",
      "Çarpan etkisinin anında ve sınırsız gerçekleştiğini düşünmek.",
    ],
    x: [
      "math.found.sequences:çarpan, harcama turlarının geometrik serisidir",
      "gk.civics.state-constitution:bütçe ve kamu maliyesinin anayasal ve kurumsal çerçevesi",
    ],
    ca: ["AP Macroeconomics politika analizi soruları"],
    rel: ["econ.boss"],
    tags: ["para-politikası", "maliye-politikası", "çarpan"],
  })
  .o("econ.macro.growth", "Ekonomik büyüme", {
    d: "Uzun dönem büyümenin kaynakları (fiziki ve beşeri sermaye, teknoloji, kurumlar), üretim fonksiyonu, yakınsama fikri, 70 kuralı ve bileşik büyüme.",
    w: "Ülkeler arasındaki büyük gelir farklarının nereden geldiğini ve küçük büyüme farklarının onlarca yılda nasıl büyüdüğünü gösterir.",
    pre: ["econ.macro.ad-as~s", "math.found.exp-log"],
    q: [
      "Yıllık %2 büyüyen bir ekonomi ile %4 büyüyen bir ekonomi arasında 35 yıl sonra ne kadar fark olur? Önce tahmin et.",
      "Bir ülke yalnızca daha fazla makine alarak sonsuza kadar büyüyebilir mi?",
    ],
    cq: [
      "Uzun dönem büyümeyi kısa dönem dalgalanmalardan ayıran nedir?",
      "Sermaye birikimi neden azalan getiriye uğrar ve teknoloji bunu nasıl aşar?",
      "Kurumlar büyümede nasıl bir rol oynar?",
    ],
    obj: [
      "Bileşik büyüme formülünden 70 kuralını türetir ve ikiye katlanma sürelerini hesaplar.",
      "Kişi başı üretim fonksiyonuyla sermaye ve teknolojinin büyümeye katkısını ayırt eder.",
      "Büyüme verisini logaritmik ölçekli grafikte yorumlar.",
    ],
    ev: "TURETME HESAPLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Yüzde birlik büyüme farkının uzun dönemde önemsiz olduğunu sanmak.",
      "Büyümenin yalnızca daha fazla sermaye biriktirmekten kaynaklandığını düşünmek.",
    ],
    x: [
      "math.found.exp-log:bileşik büyüme ve ikiye katlanma süresi",
      "env.population.human:nüfus artışı ve kaynak kullanımı",
      "gk.world.industrial:Sanayi Devrimi ve büyümenin tarihsel başlangıcı",
    ],
    rel: ["econ.macro.ad-as"],
    tags: ["büyüme", "verimlilik", "70-kuralı"],
  })
  .o("econ.intl.trade", "Uluslararası ticaret ve döviz kurları", {
    d: "Ticaretten kazanç, gümrük vergisi ve kotaların etkisi, ödemeler dengesi (cari ve finans hesabı), döviz piyasasında arz–talep, değer kazanma/kaybetme ve kur rejimleri.",
    w: "Döviz kurlarının neden değiştiğini ve bunun ithalat, ihracat ve fiyatlara etkisini açıklar; ticaret politikası tartışmalarını değerlendirmeni sağlar.",
    pre: ["econ.micro.scarcity", "econ.macro.money-banking~s"],
    q: [
      "Yerli para değer kaybederse ihracatçılar mı sevinir, ithalatçılar mı? Tatile yurt dışına gitmek isteyen sen ne hissedersin?",
      "Bir ülke ithal ayakkabıya gümrük vergisi koyarsa kim kazanır, kim kaybeder? Toplam etki ne olur?",
    ],
    cq: [
      "Gümrük vergisi refahı hangi gruplar arasında nasıl yeniden dağıtır?",
      "Döviz kuru hangi etkenlerle belirlenir?",
      "Cari açık ile finans hesabı arasında nasıl bir ilişki vardır?",
    ],
    obj: [
      "Bir gümrük vergisinin tüketici ve üretici artığına, kamu gelirine ve ölü ağırlık kaybına etkisini grafikle hesaplar.",
      "Faiz farkı ya da talep değişikliğinin döviz kuruna etkisini döviz piyasası diyagramıyla gösterir.",
      "Ödemeler dengesi kalemlerini sınıflandırır ve dengenin neden toplamda sıfır olduğunu açıklar.",
    ],
    ev: "DIAGRAM HESAPLAMA YORUMLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Cari açığın her zaman bir ülkenin 'kaybettiğini' gösterdiğini sanmak.",
      "Ticaretin her zaman sıfır toplamlı olduğunu, birinin kazancının ötekinin kaybı olduğunu düşünmek.",
    ],
    x: [
      "gk.civics.international:uluslararası ticaret kuruluşları ve anlaşmalar",
      "gk.world.globalization:küreselleşme ve ticaret ağları",
      "gk.geo.political:sınırlar ve ekonomik bütünleşme",
    ],
    ca: ["AP Macroeconomics açık ekonomi soruları"],
    rel: ["econ.micro.scarcity", "econ.boss"],
    tags: ["ticaret", "döviz", "ödemeler-dengesi"],
  })
  .o("econ.boss", "Boss: Ekonomi sentezi", {
    d: "Mikro ve makroyu birleştiren bir politika vakası: bir çevre dışsallığı, bir durgunluk ve bir kur şokunu aynı ekonomide çözümle; politika önerisini ödünleşimleriyle savun.",
    w: "Ekonomide tek bir doğru cevabın nadiren olduğunu, modellerin varsayımlarıyla birlikte kullanılması gerektiğini sınar; olimpiyat ve AP serbest yanıt sorularının bütünleşik biçimidir.",
    pre: ["econ.micro.market-failure", "econ.macro.monetary-fiscal", "econ.intl.trade"],
    q: [
      "Durgunluktaki bir ülke hem karbon vergisi koymayı hem para birimini savunmayı düşünüyor. Hangi sırayla, hangi araçlarla hareket etmeli? Ödünleşimleri say.",
    ],
    cq: [
      "Mikro ve makro araçlar aynı ekonomide birbirini nasıl etkiler?",
      "Bir politika önerisi model varsayımlarına ne kadar duyarlıdır?",
    ],
    obj: [
      "Çok parçalı bir senaryoyu uygun mikro ve makro diyagramlarla çözümler.",
      "En az iki politika seçeneğini kısa ve uzun dönem etkileri ve dağılım sonuçlarıyla karşılaştırır.",
      "Bir politika önerisinin dayandığı varsayımları açıkça yazar ve bunlar değişirse sonucun nasıl değişeceğini tahmin eder.",
    ],
    ev: "PROBLEM_COZME MODELLEME DIAGRAM TRANSFER",
    t: "BOSS",
    lv: 4,
    sc: "L",
    boss: true,
    x: [
      "env.sustainability:iklim politikasının ekonomik ve çevresel boyutu",
      "res.project.modeling:varsayımları açık bir modelleme projesi",
    ],
    ca: ["Ekonomi olimpiyatları ve AP Micro/Macro serbest yanıt soruları"],
    rel: ["econ.micro.game-theory"],
    tags: ["boss", "sentez", "politika"],
  })
  .done();
