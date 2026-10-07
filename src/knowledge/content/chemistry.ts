import { builder } from "../dsl";

export const CHEMISTRY = builder("KIMYA")
  // ---------------------------------------------------------------------------
  .unit("Genel kimya", "Atom ve bağ")
  .o("chem.atoms.structure", "Atom yapısı ve periyodik tablo", {
    d: "Proton, nötron ve elektron; atom numarası, kütle numarası, izotoplar, ortalama atom kütlesi ve periyodik tablonun düzeni.",
    w: "Tüm kimyanın alfabesidir; periyodik tabloyu okuyabilmek bir elementin davranışını ezberlemeden tahmin etmeni sağlar.",
    pre: ["math.found.arithmetic~h"],
    q: [
      "Atomun neredeyse tamamı boşluksa elin masanın içinden neden geçemiyor?",
      "Klorun iki kararlı izotopu var ama tablodaki atom kütlesi tam sayı değil. Bu sayıdan izotopların bolluğunu kestirebilir misin?",
    ],
    cq: [
      "Bir elementin kimliğini ne belirler?",
      "Ortalama atom kütlesi izotop bolluğundan nasıl hesaplanır?",
      "Periyodik tablonun satır ve sütunları neyi temsil eder?",
    ],
    obj: [
      "Bir atom ya da iyon için proton, nötron ve elektron sayılarını hesaplar.",
      "İzotop bolluklarından ortalama atom kütlesini hesaplar ve tersini çözer.",
      "Periyodik tablodaki konumdan bir elementin metal, ametal ya da yarı metal olduğunu ayırt eder.",
    ],
    ev: "HESAPLAMA ACIKLAMA YORUMLAMA",
    t: "KAVRAM",
    lv: 1,
    sc: "S",
    mis: [
      "Elektronların çekirdek etrafında gezegen gibi belirli yörüngelerde döndüğünü sanmak.",
      "İzotopların farklı kimyasal özelliklere sahip olduğunu düşünmek (kimyasal olarak neredeyse aynıdır).",
    ],
    x: [
      "phys.modern.atomic-nuclear:çekirdek yapısı ve izotoplar",
      "gk.sci-hist.modern-physics:atom modellerinin tarihsel gelişimi",
    ],
    ca: ["Kimya olimpiyatı ilk aşamalarında izotop ve kütle spektrumu soruları"],
    rel: ["chem.atoms.electron-config", "chem.stoich.mole"],
    tags: ["atom", "izotop", "periyodik-tablo"],
  })
  .o("chem.atoms.electron-config", "Elektron dizilimi ve periyodik eğilimler", {
    d: "Kuantum sayıları, orbitaller, Aufbau, Pauli ve Hund kuralları; atom yarıçapı, iyonlaşma enerjisi ve elektronegatiflik eğilimleri.",
    w: "Bir elementin hangi bağları kuracağını, hangi iyonu oluşturacağını ve ne kadar tepkin olduğunu elektron dizilimi belirler.",
    pre: ["chem.atoms.structure", "phys.modern.quantum-intro~c"],
    q: [
      "Bir periyotta sağa gittikçe elektron sayısı artıyor ama atom küçülüyor. Bu nasıl olabilir?",
      "Azotun birinci iyonlaşma enerjisi oksijeninkinden neden daha büyüktür? Eğilim tersini söylemiyor mu?",
    ],
    cq: [
      "Elektronlar orbitallere hangi sırayla ve neden yerleşir?",
      "Etkin çekirdek yükü periyodik eğilimleri nasıl açıklar?",
      "Eğilimlerin istisnaları neden ortaya çıkar?",
    ],
    obj: [
      "Atom ve iyonların elektron dizilimini yazar ve değerlik elektronlarını belirler.",
      "Atom yarıçapı ve iyonlaşma enerjisi eğilimlerini etkin çekirdek yüküyle açıklar.",
      "Ardışık iyonlaşma enerjisi verisinden bir elementin grubunu yorumlar.",
    ],
    ev: "ACIKLAMA YORUMLAMA TAHMIN",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Orbitallerin elektronların izlediği yollar olduğunu sanmak.",
      "4s orbitalinin her zaman 3d'den önce boşaldığı ve dolduğu sırayla aynı olduğunu düşünmek (geçiş metali katyonlarında önce 4s boşalır).",
    ],
    x: [
      "phys.modern.quantum-intro:orbitaller kuantum mekaniğinin sonucudur",
      "phys.mech.angular-momentum:açısal momentum kuantum sayıları",
    ],
    ca: ["Ardışık iyonlaşma enerjisi ve eğilim soruları"],
    rel: ["chem.bond.bonding"],
    tags: ["elektron-dizilimi", "orbital", "periyodik-eğilim"],
  })
  .o("chem.bond.bonding", "Kimyasal bağlar ve molekül geometrisi", {
    d: "İyonik, kovalent ve metalik bağ; Lewis yapıları, rezonans, VSEPR ile molekül geometrisi, hibritleşme ve polarlık.",
    w: "Bir molekülün şekli ve polarlığı kaynama noktasından biyolojik işlevine kadar her özelliğini belirler.",
    pre: ["chem.atoms.electron-config"],
    q: [
      "CO₂ ve H₂O ikisi de üç atomlu. Neden biri doğrusal ve apolar, öteki bükük ve polar?",
      "Benzendeki tüm C–C bağları neden aynı uzunluktadır, oysa Lewis yapısında tekli ve çiftli bağlar sırayla diziliyor?",
    ],
    cq: [
      "Elektronegatiflik farkı bağın türünü nasıl belirler?",
      "VSEPR molekül geometrisini nasıl tahmin eder?",
      "Rezonans yapıları gerçekte neyi temsil eder?",
    ],
    obj: [
      "Moleküller ve çok atomlu iyonlar için Lewis yapısı ve biçimsel yük hesaplar.",
      "VSEPR ile molekül geometrisini ve bağ açılarını tahmin eder.",
      "Molekülün polar olup olmadığını geometri ve bağ polarlığından gerekçelendirir.",
    ],
    ev: "DIAGRAM TAHMIN ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "L",
    mis: [
      "Polar bağ içeren her molekülün polar olduğunu sanmak.",
      "Rezonans yapıları arasında molekülün hızla gidip geldiğini düşünmek.",
      "Bağ kırılırken enerji açığa çıktığını sanmak (bağ oluşumu enerji açığa çıkarır).",
    ],
    x: [
      "phys.em.charge-field:bağlar elektrostatik etkileşimdir",
      "phys.mech.oscillations:bağ titreşimleri harmonik osilatör olarak modellenir",
      "bio.molecules:makromoleküllerin yapısı bağ geometrisine dayanır",
    ],
    ca: ["Lewis yapısı ve geometri soruları", "Hibritleşme ve polarlık karşılaştırmaları"],
    rel: ["chem.bond.intermolecular", "chem.organic.intro"],
    tags: ["bağ", "vsepr", "lewis"],
  })
  .o("chem.bond.intermolecular", "Moleküller arası kuvvetler", {
    d: "London dağılma kuvvetleri, dipol–dipol etkileşimleri, hidrojen bağı, iyon–dipol etkileşimi ve bunların fiziksel özelliklere etkisi.",
    w: "Suyun özel davranışını, DNA'nın çift sarmalını, protein katlanmasını ve hücre zarının kendiliğinden oluşmasını açıklar.",
    pre: ["chem.bond.bonding", "phys.em.charge-field~s"],
    q: [
      "Su (H₂O) metandan (CH₄) daha hafif bir molekül değil ama kaynama noktaları arasında yüz derecelerce fark var. Neden?",
      "Kertenkeleler cam duvarda yapıştırıcı olmadan nasıl yürüyebilir?",
    ],
    cq: [
      "Moleküller arası kuvvetler bağlardan nasıl ayrılır?",
      "Hangi kuvvet hangi durumda baskındır?",
      "Kaynama noktası, çözünürlük ve yüzey gerilimi bu kuvvetlerle nasıl ilişkilidir?",
    ],
    obj: [
      "Bir maddedeki baskın moleküller arası kuvveti belirler.",
      "Bir dizi maddeyi kaynama noktasına göre sıralar ve gerekçelendirir.",
      "Benzer benzeri çözer ilkesini kuvvetlerin dengesiyle açıklar.",
    ],
    ev: "TAHMIN ACIKLAMA YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Kaynamada molekül içindeki kovalent bağların kırıldığını sanmak.",
      "London kuvvetlerinin her zaman en zayıf kuvvet olduğunu düşünmek (büyük moleküllerde baskın olabilir).",
    ],
    x: [
      "bio.cell.membrane:hidrofobik etki ve lipid çift tabaka",
      "bio.molecules:protein katlanması ve DNA baz eşleşmesi",
      "phys.mech.fluids:yüzey gerilimi",
    ],
    ca: ["Kaynama noktası sıralama ve çözünürlük soruları"],
    rel: ["chem.solutions", "chem.biochem"],
    vs: ["chem.bond.bonding"],
    tags: ["moleküller-arası", "hidrojen-bağı"],
  })

  // ---------------------------------------------------------------------------
  .unit("Genel kimya", "Tepkimeler ve madde")
  .o("chem.stoich.mole", "Mol kavramı ve stokiyometri", {
    d: "Mol ve Avogadro sayısı, mol kütlesi, kimyasal formüllerden yüzde bileşim, sınırlayıcı bileşen ve verim hesapları.",
    w: "Kimyada her nicel hesabın ortak birimidir; laboratuvarda çözelti hazırlamaktan ilaç dozuna kadar her yerde kullanılır.",
    pre: ["chem.atoms.structure", "math.found.arithmetic"],
    q: [
      "Bir bardak suda kaç su molekülü var? Hesaplamadan önce bir mertebe tahmin et.",
      "Bir tarifte 2 yumurta ve 1 su bardağı un gerekiyor; 5 yumurta ve 2 bardak unla kaç tarif yapabilirsin? Bu kimyada neye karşılık gelir?",
    ],
    cq: [
      "Mol kavramı mikroskobik ve makroskobik dünyayı nasıl bağlar?",
      "Sınırlayıcı bileşen nasıl belirlenir?",
      "Kütle yüzdesinden kaba formül nasıl bulunur?",
    ],
    obj: [
      "Kütle, mol ve tanecik sayısı arasında dönüşüm yapar.",
      "Sınırlayıcı bileşen ve yüzde verim hesaplar.",
      "Yanma analizi verisinden kaba ve molekül formülünü belirler.",
    ],
    ev: "HESAPLAMA PROBLEM_COZME TAHMIN",
    t: "BECERI",
    lv: 1,
    sc: "M",
    mis: [
      "Denklemdeki katsayıların kütle oranlarını gösterdiğini sanmak (mol oranlarını gösterir).",
      "Fazla olan bileşenin ürün miktarını belirlediğini düşünmek.",
    ],
    x: [
      "phys.measure.units:birim dönüşümü ve anlamlı basamak",
      "phys.olymp.estimation:Avogadro ölçeğinde büyüklük tahmini",
    ],
    ca: ["Stokiyometri ve formül belirleme soruları (her kimya olimpiyatı aşamasında)"],
    rel: ["chem.react.types", "chem.solutions", "chem.gas.laws"],
    tags: ["mol", "stokiyometri"],
  })
  .o("chem.react.types", "Tepkime türleri ve denkleştirme", {
    d: "Çökelme, asit–baz, yanma ve redoks tepkimeleri; net iyon denklemleri ve kütle ile yük korunumuna göre denkleştirme.",
    w: "Bir tepkimenin türünü tanımak ürünleri tahmin etmenin ilk adımıdır; fizikokimyanın tüm konuları bu tepkimelerin üzerine kurulur.",
    pre: ["chem.stoich.mole", "chem.bond.bonding~s"],
    q: [
      "Gümüş nitrat ve sodyum klorür çözeltilerini karıştırınca beyaz bir katı oluşuyor. Hangi iyonlar 'seyirci' kalır?",
      "Denkleştirilmiş bir denklemde her iki taraftaki molekül sayısı eşit olmak zorunda mı?",
    ],
    cq: [
      "Bir tepkimenin türü nasıl tanınır?",
      "Net iyon denklemi neden daha anlamlıdır?",
      "Redoks tepkimeleri yarı tepkime yöntemiyle nasıl denkleştirilir?",
    ],
    obj: [
      "Tepkimeleri türlerine göre sınıflandırır ve ürünleri tahmin eder.",
      "Net iyon denklemlerini yazar ve seyirci iyonları belirler.",
      "Asidik ve bazik ortamda redoks tepkimelerini yarı tepkime yöntemiyle denkleştirir.",
    ],
    ev: "PROBLEM_COZME TAHMIN HESAPLAMA",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Denkleştirmede alt indisleri değiştirmenin kabul edilebilir olduğunu sanmak.",
      "Her tepkimenin tamamen tamamlandığını düşünmek.",
    ],
    x: ["math.linalg.systems:denkleştirme bir doğrusal denklem sistemidir"],
    ca: ["Redoks denkleştirme ve ürün tahmini soruları"],
    rel: ["chem.redox-electrochem", "chem.acid-base"],
    tags: ["tepkime", "denkleştirme", "redoks"],
  })
  .o("chem.gas.laws", "Gaz yasaları", {
    d: "Boyle, Charles ve Avogadro yasaları, ideal gaz denklemi, kısmi basınçlar, gaz stokiyometrisi ve gerçek gazlardan sapma.",
    w: "Solunumdan hava yastığına, atmosfer kimyasından laboratuvar gaz hesaplarına kadar gazların davranışını tek denklemle öngörmeyi sağlar.",
    pre: ["chem.stoich.mole", "phys.thermo.temperature-heat~s"],
    q: [
      "Dağa çıkarken kapalı bir cips paketi neden şişer? Termometre aynı olsa da şişer miydi?",
      "Aynı sıcaklık ve basınçta bir balonu helyumla ya da azotla doldurursan hangisinde daha çok molekül olur?",
    ],
    cq: [
      "İdeal gaz denklemi hangi varsayımlara dayanır?",
      "Dalton kısmi basınçlar yasası karışımlarda nasıl kullanılır?",
      "Gerçek gazlar ne zaman ve neden idealden sapar?",
    ],
    obj: [
      "İdeal gaz denklemiyle basınç, hacim, sıcaklık ve mol hesapları yapar.",
      "Gaz karışımlarında kısmi basınç ve mol kesrini hesaplar.",
      "Van der Waals düzeltmelerini molekül hacmi ve çekim kuvvetleriyle yorumlar.",
    ],
    ev: "HESAPLAMA PROBLEM_COZME YORUMLAMA",
    t: "UYGULAMA",
    lv: 2,
    sc: "M",
    mis: [
      "Gaz yasalarında Celsius sıcaklığının doğrudan kullanılabileceğini sanmak.",
      "Ağır gaz moleküllerinin aynı sıcaklıkta daha büyük basınç yaptığını düşünmek.",
    ],
    x: [
      "phys.thermo.kinetic-theory:ideal gaz yasasının mikroskobik türetimi",
      "bio.physiology.systems:solunumda kısmi basınç ve gaz değişimi",
    ],
    ca: ["Gaz stokiyometrisi ve kısmi basınç soruları"],
    rel: ["chem.thermo.thermochemistry"],
    tags: ["gaz", "ideal-gaz", "kısmi-basınç"],
  })
  .o("chem.solutions", "Çözeltiler ve derişim", {
    d: "Çözünme süreci, derişim birimleri (molarite, molalite, kütle yüzdesi), seyreltme, çözünürlük ve koligatif özellikler.",
    w: "Laboratuvar işlerinin çoğu çözeltilerle yapılır; hücre içi ve dışı sıvılar, ozmoz ve ilaç dozları bu kavramlara dayanır.",
    pre: ["chem.stoich.mole", "chem.bond.intermolecular~s"],
    q: [
      "Kışın yollara neden tuz dökülür? Şeker dökmek de aynı işi görür mü, hangisi daha etkili olur?",
      "Deniz suyu içmek neden susuzluğu artırır?",
    ],
    cq: [
      "Derişim birimleri arasında nasıl dönüşüm yapılır?",
      "Koligatif özellikler neden çözünenin kimliğine değil, tanecik sayısına bağlıdır?",
      "Ozmotik basınç nasıl hesaplanır?",
    ],
    obj: [
      "Belirli bir derişimde çözelti hazırlama ve seyreltme hesaplarını yapar.",
      "Donma noktası alçalması ve kaynama noktası yükselmesini van 't Hoff çarpanıyla hesaplar.",
      "Ozmotik basınç farkından su akışının yönünü tahmin eder.",
    ],
    ev: "HESAPLAMA PROBLEM_COZME TAHMIN",
    t: "UYGULAMA",
    lv: 2,
    sc: "M",
    mis: [
      "Tuzun suda çözünürken 'yok olduğunu' sanmak.",
      "Molarite ile molalitenin her zaman eşit olduğunu düşünmek.",
    ],
    x: [
      "bio.cell.membrane:ozmoz ve hücre hacmi",
      "neuro.cell.membrane-potential:hücre içi ve dışı iyon derişimleri",
    ],
    ca: ["Derişim dönüşümü ve koligatif özellik soruları"],
    rel: ["chem.acid-base", "chem.equilibrium"],
    tags: ["çözelti", "derişim", "koligatif"],
  })

  // ---------------------------------------------------------------------------
  .unit("Fizikokimya", "Enerji, hız ve denge")
  .o("chem.thermo.thermochemistry", "Termokimya ve entalpi", {
    d: "İç enerji ve entalpi, ekzotermik ve endotermik tepkimeler, kalorimetri, Hess yasası, oluşum entalpileri ve bağ enerjileri.",
    w: "Bir tepkimenin ne kadar enerji vereceğini ya da alacağını hesaplamak yakıt seçiminden metabolizmaya kadar her enerji sorusunun cevabıdır.",
    pre: ["chem.react.types", "phys.thermo.laws~s"],
    q: [
      "Buz eritmek enerji gerektiriyorsa buzlu su içeceğini nasıl soğutuyor? Enerji hangi yöne akıyor?",
      "Bir tepkimenin entalpisini hiç ölçmeden yalnızca başka tepkimelerin verileriyle bulabilir misin?",
    ],
    cq: [
      "Entalpi neden sabit basınçtaki ısıya eşittir?",
      "Hess yasası neden geçerlidir?",
      "Bağ enerjileri ile oluşum entalpileri neden biraz farklı sonuç verir?",
    ],
    obj: [
      "Kalorimetri verisinden tepkime entalpisini hesaplar.",
      "Hess yasasıyla bilinmeyen bir tepkime entalpisini türetir.",
      "Bağ enerjilerinden tepkime entalpisini tahmin eder ve yaklaşımın sınırını açıklar.",
    ],
    ev: "HESAPLAMA PROBLEM_COZME ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Ekzotermik tepkimelerin her zaman kendiliğinden gerçekleştiğini sanmak.",
      "Bağ kırılmasının enerji açığa çıkardığını düşünmek.",
    ],
    x: [
      "phys.thermo.laws:termodinamiğin birinci yasası",
      "phys.thermo.temperature-heat:kalorimetri ve öz ısı",
      "bio.energy.respiration:glikozun yanma enerjisi",
    ],
    ca: ["Hess yasası ve Born–Haber döngüsü soruları"],
    rel: ["chem.thermo.gibbs"],
    tags: ["entalpi", "hess", "kalorimetri"],
  })
  .o("chem.thermo.gibbs", "Entropi, Gibbs serbest enerjisi ve kendiliğindenlik", {
    d: "Kimyasal sistemlerde entropi, Gibbs serbest enerjisi, ΔG = ΔH − TΔS, standart serbest enerji ve denge sabitiyle ilişkisi.",
    w: "Bir tepkimenin kendiliğinden olup olmayacağını söyleyen ölçüttür; canlıların enerjetiği ve ATP'nin rolü bu çerçevede anlaşılır.",
    pre: ["chem.thermo.thermochemistry", "phys.thermo.laws"],
    q: [
      "Buz oda sıcaklığında kendiliğinden erir ama bu süreç ısı alır. Isı alan bir süreç nasıl kendiliğinden olabilir?",
      "Canlılar düzenli yapılar kurarak entropiyi azaltıyorsa ikinci yasayı çiğniyor mu?",
    ],
    cq: [
      "Kendiliğindenlik için hangi ölçüt kullanılır ve neden?",
      "Sıcaklık ΔG'nin işaretini nasıl değiştirebilir?",
      "ΔG° ile denge sabiti nasıl ilişkilidir?",
    ],
    obj: [
      "ΔH ve ΔS değerlerinden bir tepkimenin kendiliğinden olduğu sıcaklık aralığını hesaplar.",
      "ΔG° = −RT ln K bağıntısıyla denge sabitini hesaplar.",
      "Eşleşmiş tepkimelerin (ör. ATP hidrolizi) kendiliğinden olmayan süreçleri nasıl yürüttüğünü açıklar.",
    ],
    ev: "HESAPLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Kendiliğinden tepkimelerin hızlı olması gerektiğini sanmak (termodinamik hızı söylemez).",
      "Entropinin yalnızca sistemde değerlendirilmesi gerektiğini düşünmek (çevre de hesaba katılır).",
    ],
    x: [
      "phys.thermo.laws:ikinci yasa ve entropi",
      "phys.thermo.stat-mech:entropinin istatistiksel tanımı",
      "bio.energy.respiration:ATP ve eşleşmiş tepkimeler",
    ],
    ca: ["ΔG, ΔH, ΔS ve sıcaklık soruları", "Denge sabiti ile serbest enerji ilişkisi"],
    rel: ["chem.equilibrium", "chem.redox-electrochem"],
    vs: ["chem.kinetics"],
    tags: ["gibbs", "entropi", "kendiliğindenlik"],
  })
  .o("chem.kinetics", "Tepkime hızı ve kinetik", {
    d: "Hız yasaları, tepkime mertebesi, integral hız denklemleri, yarı ömür, aktivasyon enerjisi, Arrhenius denklemi, mekanizmalar ve kataliz.",
    w: "Tepkimenin ne kadar hızlı olduğunu belirler; ilaç yıkımı, enzim etkinliği ve nörotransmitter temizlenmesi kinetik modellerle anlaşılır.",
    pre: ["chem.react.types", "math.found.exp-log", "math.ode.first-order~s"],
    q: [
      "Sıcaklığı yalnızca 10 °C artırmak bazı tepkimeleri yaklaşık iki kat hızlandırır. Moleküllerin hızı bu kadar artmıyorsa bu nasıl olur?",
      "Elmas termodinamik olarak grafite dönüşmeyi 'istiyorsa' neden yüzükteki elmas sonsuza kadar duruyor?",
    ],
    cq: [
      "Hız yasası denkleştirilmiş denklemden neden okunamaz?",
      "Aktivasyon enerjisi sıcaklık bağımlılığını nasıl açıklar?",
      "Katalizör hızı nasıl artırır ama dengeyi neden değiştirmez?",
    ],
    obj: [
      "Başlangıç hızları verisinden hız yasasını ve mertebeleri belirler.",
      "Birinci ve ikinci mertebe integral hız denklemlerini türetir ve grafikle mertebeyi saptar.",
      "Arrhenius grafiğinden aktivasyon enerjisini hesaplar.",
    ],
    ev: "TURETME VERI_ANALIZI HESAPLAMA",
    t: "MODELLEME",
    lv: 3,
    sc: "L",
    mis: [
      "Hız yasasındaki üslerin her zaman stokiyometrik katsayılara eşit olduğunu sanmak.",
      "Katalizörün dengeyi ürünlere kaydırdığını düşünmek.",
    ],
    x: [
      "math.ode.first-order:hız denklemleri diferansiyel denklemdir",
      "phys.thermo.stat-mech:Arrhenius faktörü bir Boltzmann faktörüdür",
      "bio.enzymes:enzim kinetiği ve Michaelis–Menten",
      "neuro.comp.hh-model:iyon kanalı geçitlerinin birinci mertebe kinetiği",
    ],
    ca: ["Hız yasası belirleme ve mekanizma soruları", "Arrhenius hesapları"],
    ra: ["Enzim kinetiği ve ilaç farmakokinetiği modelleri"],
    rel: ["chem.equilibrium"],
    vs: ["chem.thermo.gibbs"],
    tags: ["kinetik", "hız-yasası", "arrhenius"],
  })
  .o("chem.equilibrium", "Kimyasal denge", {
    d: "Dinamik denge, denge sabiti Kc ve Kp, tepkime oranı Q, Le Chatelier ilkesi ve denge hesaplamaları.",
    w: "Birçok tepkime tamamlanmaz, dengede durur; asitlerden kandaki oksijen taşınmasına ve endüstriyel üretime kadar dengeyi hesaplamak gerekir.",
    pre: ["chem.react.types", "math.found.exp-log", "chem.kinetics~s"],
    q: [
      "Dengede tepkime durmuş mudur? Moleküler düzeyde ne olduğunu düşün.",
      "Kapalı bir şişe gazozu açtığında neden köpürür? Hangi denge bozuldu?",
    ],
    cq: [
      "Denge sabiti ileri ve geri hızların eşitliğinden nasıl çıkar?",
      "Q ve K karşılaştırması tepkimenin yönünü nasıl belirler?",
      "Le Chatelier ilkesi hangi durumlarda yanıltıcı olabilir?",
    ],
    obj: [
      "Başlangıç derişimlerinden denge derişimlerini ICE tablosuyla hesaplar.",
      "Q ile K'yı karşılaştırarak tepkimenin yönünü tahmin eder.",
      "Derişim, basınç ve sıcaklık değişikliklerinin dengeye etkisini gerekçelendirir.",
    ],
    ev: "HESAPLAMA TAHMIN PROBLEM_COZME",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Dengede tepkenlerin ve ürünlerin derişimlerinin eşit olduğunu sanmak.",
      "Katalizör eklemenin denge sabitini değiştirdiğini düşünmek.",
    ],
    x: [
      "phys.thermo.stat-mech:denge sabiti ve Boltzmann dağılımı",
      "bio.physiology.systems:kanın tampon dengesi ve oksijen taşınması",
      "math.dyn.stability:dinamik dengenin kararlılığı",
    ],
    ca: ["Denge hesapları ve Le Chatelier soruları", "Çoklu denge problemleri"],
    rel: ["chem.acid-base", "chem.thermo.gibbs"],
    tags: ["denge", "le-chatelier", "denge-sabiti"],
  })
  .o("chem.acid-base", "Asitler, bazlar ve pH", {
    d: "Arrhenius, Brønsted–Lowry ve Lewis tanımları; pH, zayıf asit–baz dengeleri, tampon çözeltiler, Henderson–Hasselbalch denklemi ve titrasyon.",
    w: "Kan pH'ı, enzim etkinliği, toprak kimyası ve okyanus asitlenmesi asit–baz dengesine dayanır.",
    pre: ["chem.equilibrium", "chem.solutions"],
    q: [
      "pH'ı 3 olan bir çözelti pH'ı 6 olandan kaç kat daha asidiktir? İki kat mı?",
      "Kanına az miktarda asit eklense pH'ın neredeyse hiç değişmez. Bunu sağlayan ne olabilir?",
    ],
    cq: [
      "Güçlü ve zayıf asit arasındaki fark nedir?",
      "Tampon çözeltiler pH değişimine nasıl direnir?",
      "Titrasyon eğrisinin şekli neyi anlatır?",
    ],
    obj: [
      "Güçlü ve zayıf asit–baz çözeltilerinin pH'ını hesaplar.",
      "Henderson–Hasselbalch denklemiyle belirli pH'ta tampon tasarlar.",
      "Titrasyon eğrisinden eşdeğerlik noktasını ve pKa'yı yorumlar.",
    ],
    ev: "HESAPLAMA YORUMLAMA DENEY",
    t: "UYGULAMA",
    lv: 3,
    sc: "L",
    mis: [
      "Derişik bir zayıf asidin seyreltik bir güçlü asitten her zaman daha asidik olduğunu sanmak.",
      "Eşdeğerlik noktasında pH'ın her zaman 7 olduğunu düşünmek.",
    ],
    x: [
      "math.found.exp-log:pH logaritmik bir ölçektir",
      "bio.physiology.systems:kan tamponları ve homeostaz",
      "gk.geo.climate-change:okyanus asitlenmesi",
    ],
    ca: ["pH, tampon ve titrasyon soruları", "Laboratuvar aşamasında titrasyon uygulaması"],
    rel: ["chem.redox-electrochem"],
    tags: ["asit", "baz", "ph", "tampon"],
  })
  .o("chem.redox-electrochem", "Redoks ve elektrokimya: Nernst denklemi", {
    d: "Yükseltgenme basamakları, galvanik ve elektrolitik hücreler, standart elektrot potansiyelleri, ΔG = −nFE ve Nernst denklemi.",
    w: "Piller, korozyon ve elektroliz bu konuya dayanır; aynı Nernst denklemi nöronların dinlenim potansiyelini açıklar.",
    pre: ["chem.react.types", "chem.equilibrium~s", "phys.em.potential~s"],
    q: [
      "Bir pil 'bittiğinde' içindeki kimyasal maddeler tükenmiş midir, yoksa başka bir şey mi olmuştur?",
      "Hücre zarının iki yanında yalnızca potasyum derişimi farklıysa kimyasal tepkime olmadan bir gerilim oluşabilir mi?",
    ],
    cq: [
      "Elektrot potansiyelleri hangi yarı tepkimenin gerçekleşeceğini nasıl belirler?",
      "Hücre gerilimi serbest enerjiyle nasıl ilişkilidir?",
      "Nernst denklemi derişim farkının gerilimini nasıl verir?",
    ],
    obj: [
      "Standart potansiyellerden galvanik hücrenin gerilimini ve kendiliğindenliğini hesaplar.",
      "Nernst denklemini ΔG = ΔG° + RT ln Q bağıntısından türetir.",
      "Nernst denklemini derişim hücresine ve bir iyonun zar potansiyeline uygular.",
    ],
    ev: "TURETME HESAPLAMA TRANSFER",
    t: "UYGULAMA",
    lv: 3,
    sc: "L",
    mis: [
      "Potansiyelin, yarı tepkime katsayısıyla çarpılması gerektiğini sanmak (yoğun bir niceliktir).",
      "Anodun her zaman pozitif kutup olduğunu düşünmek (galvanik ve elektrolitik hücrede işaret farklıdır).",
    ],
    x: [
      "neuro.cell.membrane-potential:Nernst denklemi iyonların denge potansiyelini verir",
      "phys.em.potential:elektrik potansiyel farkı",
      "bio.energy.respiration:elektron taşıma zinciri bir redoks dizisidir",
    ],
    ca: ["Hücre gerilimi ve Nernst soruları", "Elektroliz ve Faraday yasaları"],
    ra: ["Batarya malzemeleri ve elektrofizyoloji"],
    rel: ["chem.thermo.gibbs", "chem.acid-base"],
    tags: ["redoks", "elektrokimya", "nernst"],
  })

  // ---------------------------------------------------------------------------
  .unit("Organik ve biyokimya", "Organik ve biyokimya")
  .o("chem.organic.intro", "Organik kimyaya giriş", {
    d: "Karbonun bağ yapma özellikleri, fonksiyonel gruplar, adlandırma, izomeri ve stereokimya, temel tepkime türleri (katılma, yer değiştirme, ayrılma).",
    w: "Canlıların, ilaçların ve plastiklerin kimyasıdır; fonksiyonel grupları tanımak bir molekülün davranışını tahmin etmeni sağlar.",
    pre: ["chem.bond.bonding"],
    q: [
      "Aynı formüle (C₂H₆O) sahip iki maddeden biri içilebilir, öteki bir gaz. Bu nasıl mümkün?",
      "Bir ilacın ayna görüntüsü molekülü neden vücutta tamamen farklı etki gösterebilir?",
    ],
    cq: [
      "Karbon neden bu kadar çeşitli bileşik oluşturur?",
      "Fonksiyonel gruplar tepkimeyi nasıl belirler?",
      "Kiralite nedir ve biyolojide neden önemlidir?",
    ],
    obj: [
      "Organik bileşiklerdeki fonksiyonel grupları tanır ve IUPAC kurallarıyla adlandırır.",
      "Yapı ve stereo izomerleri ayırt eder, kiral merkezleri belirler.",
      "Temel tepkime türlerinde ürünü tahmin eder ve elektron akışını oklarla gösterir.",
    ],
    ev: "DIAGRAM TAHMIN ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Organik bileşiklerin yalnızca canlılar tarafından üretilebileceğini sanmak.",
      "Aynı formüldeki bileşiklerin aynı özellikleri taşıdığını düşünmek.",
    ],
    x: [
      "bio.molecules:biyolojik makromoleküllerin yapı taşları",
      "math.adv.abstract-algebra:simetri ve kiralite",
    ],
    ca: ["Organik yapı belirleme ve tepkime soruları"],
    rel: ["chem.biochem"],
    tags: ["organik", "fonksiyonel-grup", "izomeri"],
  })
  .o("chem.biochem", "Biyomoleküllerin kimyası", {
    d: "Karbonhidratlar, lipitler, proteinler ve nükleik asitlerin kimyasal yapısı; peptit ve glikozit bağları, protein katlanması ve biyolojik tepkimelerin kimyası.",
    w: "Kimya ile biyoloji arasındaki köprüdür; enzimler, DNA ve hücre zarı bu moleküllerin kimyasal özelliklerinden anlaşılır.",
    pre: ["chem.organic.intro", "chem.bond.intermolecular"],
    q: [
      "Proteinler yalnızca yirmi civarında amino asitten oluşuyorsa nasıl bu kadar farklı işlevler üstlenebilir?",
      "Bir yumurtayı pişirdiğinde hangi bağlar kırılır, hangileri kırılmaz?",
    ],
    cq: [
      "Biyomoleküller hangi bağlarla bir araya gelir?",
      "Protein yapısının dört düzeyi hangi etkileşimlerle korunur?",
      "Yapı ile işlev arasındaki ilişki nasıl kurulur?",
    ],
    obj: [
      "Peptit, glikozit ve fosfodiester bağlarının oluşumunu yoğuşma tepkimesi olarak gösterir.",
      "Protein yapı düzeylerini sağlayan etkileşimleri ayırt eder.",
      "Denatürasyonu moleküller arası kuvvetlerin bozulmasıyla açıklar.",
    ],
    ev: "DIAGRAM ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Denatürasyonda peptit bağlarının kırıldığını sanmak.",
      "Yağların yalnızca enerji deposu olduğunu düşünmek (zar yapısı ve sinyal molekülleri de vardır).",
    ],
    x: [
      "bio.molecules:biyolojik makromoleküller",
      "bio.enzymes:enzimlerin kimyasal yapısı",
      "neuro.syn.transmission:nörotransmitterlerin kimyası",
    ],
    ca: ["Biyoloji ve kimya olimpiyatlarında biyokimya soruları"],
    ra: ["Yapısal biyoloji ve ilaç tasarımı"],
    rel: ["chem.bond.intermolecular"],
    tags: ["biyokimya", "protein", "biyomolekül"],
  })
  .done();
