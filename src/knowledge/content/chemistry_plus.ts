import { builder } from "../dsl";

export const CHEMISTRY_PLUS = builder("KIMYA")
  // ---------------------------------------------------------------------------
  .unit("Genel kimya", "Atom ve bağ")
  .o("chem.atoms.periodic-trends", "Periyodik özellikler ayrıntılı: iyonlaşma, elektronegatiflik, yarıçap", {
    d: "Etkin çekirdek yükü ve perdeleme üzerinden atom ve iyon yarıçapı, ardışık iyonlaşma enerjileri, elektron ilgisi ve elektronegatiflik eğilimleri; eğilimlerdeki istisnaların elektron dizilimiyle açıklanması.",
    w: "Periyodik tabloyu ezberlenecek bir liste olmaktan çıkarıp tahmin aracına dönüştürür; bağ türü, tepkime yatkınlığı ve asitlik bu eğilimlerden okunur.",
    pre: ["chem.atoms.electron-config"],
    q: [
      "Na⁺ iyonu ile Ne atomu aynı sayıda elektrona sahip. Hangisi daha küçüktür? Neden?",
      "Bir elementin ardışık iyonlaşma enerjilerinde bir anda çok büyük bir sıçrama görüyorsun. Bu sıçrama sana elementin grubu hakkında ne söyler?",
    ],
    cq: [
      "Etkin çekirdek yükü periyot ve grup boyunca nasıl değişir?",
      "İyonlaşma enerjisindeki istisnalar (ör. Be–B, N–O) nasıl açıklanır?",
      "Elektronegatiflik farkı bağın karakterini nasıl belirler?",
    ],
    obj: [
      "Verilen atom ve iyonları yarıçap, iyonlaşma enerjisi ve elektronegatifliğe göre sıralar ve her sıralamayı gerekçelendirir.",
      "Ardışık iyonlaşma enerjisi verisinden bir elementin değerlik elektron sayısını çıkarır.",
      "Eğilimdeki istisnaları orbital doluluğu ve elektron itmesiyle açıklar.",
    ],
    ev: "YORUMLAMA VERI_ANALIZI ACIKLAMA TAHMIN",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Daha çok elektronu olan atomun her zaman daha büyük olduğunu sanmak.",
      "Elektronegatiflik ile elektron ilgisini aynı nicelik sanmak.",
    ],
    x: [
      "phys.em.charge-field:çekirdek çekimi ve perdeleme için Coulomb yasası",
      "phys.modern.atomic-nuclear:enerji düzeyleri ve iyonlaşma",
    ],
    ca: ["Kimya olimpiyatlarında iyonlaşma enerjisi verisi yorumlama soruları"],
    rel: ["chem.bond.bonding", "chem.atoms.structure"],
    tags: ["periyodik-tablo", "iyonlasma", "elektronegatiflik", "yaricap"],
  })
  .o("chem.bond.lewis-vsepr", "Lewis yapıları, rezonans ve VSEPR", {
    d: "Lewis yapısı çizme, formal yük, rezonans yapıları ve oktet istisnaları; VSEPR ile elektron grubu ve molekül geometrisi, bağ açıları ve molekül polarlığı.",
    w: "Bir molekülün şeklini kâğıt üstünde tahmin etmeyi sağlar; şekil polarlığı, polarlık da çözünürlüğü, kaynama noktasını ve biyolojik etkileşimleri belirler.",
    pre: ["chem.bond.bonding"],
    q: [
      "CO₂ ve H₂O'nun ikisi de polar bağlar içeriyor; ama biri polar molekül, diğeri değil. Hangisi hangisi ve neden?",
      "Ozonda (O₃) iki O–O bağı ölçüldüğünde tamamen aynı uzunlukta çıkıyor; oysa Lewis yapısında biri tekli, biri çiftli görünüyor. Bunu nasıl açıklarsın?",
    ],
    cq: [
      "Bir molekülün en olası Lewis yapısı nasıl seçilir?",
      "Bağ yapmamış elektron çiftleri geometriyi nasıl değiştirir?",
      "Molekül şekli polarlığı nasıl belirler?",
    ],
    obj: [
      "Çok atomlu moleküller ve iyonlar için Lewis yapısı çizer ve formal yüklerle en uygun yapıyı seçer.",
      "VSEPR ile elektron grubu ve molekül geometrisini, yaklaşık bağ açılarını tahmin eder.",
      "Bağ dipollerini vektörel toplayarak molekülün polar olup olmadığını belirler.",
    ],
    ev: "DIAGRAM TAHMIN ACIKLAMA PROBLEM_COZME",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Rezonans yapılarının molekülün sürekli aralarında gidip geldiği ayrı biçimler olduğunu sanmak.",
      "Polar bağ içeren her molekülün polar olduğunu düşünmek.",
    ],
    x: [
      "math.geo.solid:tetrahedral ve bipiramidal geometriler, bağ açıları",
      "math.geo.vectors:dipol momentlerinin vektör toplamı",
      "bio.molecules:biyomoleküllerin şekli ve işlevi",
    ],
    rel: ["chem.bond.intermolecular", "chem.atoms.periodic-trends"],
    tags: ["lewis", "vsepr", "rezonans", "polarlik"],
  })
  // ---------------------------------------------------------------------------
  .unit("Genel kimya", "Tepkimeler ve madde")
  .o("chem.react.limiting-yield", "Sınırlayıcı bileşen ve verim", {
    d: "Denkleştirilmiş tepkimede mol oranlarıyla sınırlayıcı ve artan bileşenin belirlenmesi, kuramsal, gerçek ve yüzde verim; çok basamaklı sentezlerde toplam verim.",
    w: "Laboratuvarda ve endüstride ne kadar ürün beklenebileceğini, hangi maddenin boşa gideceğini hesaplamayı sağlar; her nicel kimya probleminin çekirdeğidir.",
    pre: ["chem.react.types", "chem.stoich.mole"],
    q: [
      "10 ekmek dilimi ve 3 peynir dilimin var; her sandviçe 2 ekmek, 1 peynir gerekiyor. Kaç sandviç yaparsın ve neyin bir kısmı artar? Aynı mantığı bir tepkimeye nasıl uygularsın?",
      "Bir sentezin her basamağı %90 verimle ilerliyor. Beş basamaktan sonra toplam verim yaklaşık ne olur? Önce tahmin et.",
    ],
    cq: [
      "Sınırlayıcı bileşen kütleye göre değil neden mole göre belirlenir?",
      "Gerçek verim neden kuramsal verimden düşük kalır?",
    ],
    obj: [
      "Verilen kütlelerden sınırlayıcı bileşeni belirler ve kuramsal ürün miktarını hesaplar.",
      "Deneysel sonuçtan yüzde verimi hesaplar ve düşük verimin olası nedenlerini sıralar.",
      "Çok basamaklı bir sentezin toplam verimini hesaplar.",
    ],
    ev: "HESAPLAMA PROBLEM_COZME TAHMIN",
    t: "PRATIK",
    lv: 2,
    sc: "S",
    mis: [
      "Kütlesi az olan maddenin her zaman sınırlayıcı olduğunu sanmak.",
      "%100'ü aşan bir verimin daha iyi bir deney anlamına geldiğini düşünmek (genellikle safsızlık ya da nemdir).",
    ],
    x: [
      "math.found.arithmetic:oran ve orantı",
      "env.sustainability:atom ekonomisi ve yeşil kimya",
    ],
    rel: ["chem.stoich.mole", "chem.lab.techniques"],
    tags: ["stokiyometri", "sinirlayici", "verim"],
  })
  .o("chem.react.precipitation", "Çökelme tepkimeleri ve çözünürlük dengesi", {
    d: "Çözünürlük kuralları, net iyon denklemleri, çözünürlük çarpımı (Ksp), molar çözünürlük, ortak iyon etkisi ve Q ile Ksp karşılaştırmasıyla çökelme tahmini.",
    w: "Böbrek taşından sert suya, mağara oluşumundan atık sudaki ağır metallerin ayrılmasına kadar 'bir şey ne zaman çöker?' sorusunu sayısal olarak yanıtlar.",
    pre: ["chem.solutions", "chem.equilibrium~s"],
    q: [
      "İki berrak çözeltiyi karıştırdığında aniden beyaz bir bulanıklık oluşuyor. Bu katı nereden geldi ve hangi iyonlardan oluşuyor?",
      "Az çözünen bir tuzun doymuş çözeltisine aynı iyonu içeren başka bir tuz eklersen ne olur? Tahmin et.",
    ],
    cq: [
      "Ksp ile molar çözünürlük nasıl ilişkilidir?",
      "Bir karışımda çökelme olup olmayacağı nasıl öngörülür?",
      "Ortak iyon ve pH çözünürlüğü nasıl değiştirir?",
    ],
    obj: [
      "Çökelme tepkimelerinin net iyon denklemini yazar.",
      "Ksp'den molar çözünürlüğü ve molar çözünürlükten Ksp'yi hesaplar.",
      "Q ile Ksp'yi karşılaştırarak iki çözelti karıştırıldığında çökelme olup olmayacağını tahmin eder.",
      "Ortak iyon etkisini Le Chatelier ilkesiyle açıklar ve sayısal olarak hesaplar.",
    ],
    ev: "HESAPLAMA TAHMIN PROBLEM_COZME DENEY",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Ksp değeri küçük olan tuzun her zaman daha az çözündüğünü sanmak (iyon sayısı farklıysa doğrudan karşılaştırılamaz).",
      "'Çözünmez' tuzların hiç çözünmediğini düşünmek.",
    ],
    x: [
      "env.pollution.water-soil:ağır metallerin çöktürülerek sudan uzaklaştırılması",
      "earth.geo.rocks:karbonat kayaçlarının çözünmesi ve çökelmesi",
      "bio.anatomy.excretory:böbrek taşlarının oluşumu",
    ],
    rel: ["chem.equilibrium", "chem.acid-base"],
    tags: ["cokelme", "ksp", "cozunurluk", "ortak-iyon"],
  })
  .o("chem.nuclear", "Çekirdek kimyası ve radyoaktivite", {
    d: "Alfa, beta ve gama bozunmaları ve çekirdek denklemlerinin denkleştirilmesi, kararlılık kuşağı, yarı ömür ve birinci dereceden bozunma kinetiği; radyoizotopların tıpta ve tarihlemede kullanımı.",
    w: "Radyometrik tarihlemeden tıbbi görüntülemeye, nükleer atıktan radyasyon güvenliğine kadar çekirdek süreçlerini kimyasal tepkimelerden ayırarak sayısal düşünmeyi sağlar.",
    pre: ["chem.atoms.structure", "phys.modern.atomic-nuclear~s"],
    q: [
      "Bir radyoaktif örneğin yarısı 10 günde bozunuyorsa, kalan yarısı da 10 günde mi tamamen biter? Neden?",
      "Bir atomu ısıtmak, basınç uygulamak ya da bir bileşiğe bağlamak onun bozunma hızını değiştirir mi? Kimyasal tepkimelerle karşılaştır.",
    ],
    cq: [
      "Çekirdek denklemleri nasıl denkleştirilir?",
      "Bir çekirdeğin hangi tür bozunmaya uğrayacağı nasıl tahmin edilir?",
      "Yarı ömür ve üstel bozunma nasıl hesaplanır?",
    ],
    obj: [
      "Alfa, beta ve gama bozunmaları için çekirdek denklemlerini kütle ve atom numarasını koruyarak denkleştirir.",
      "Nötron/proton oranına bakarak bir izotopun olası bozunma türünü tahmin eder.",
      "Yarı ömür kullanarak kalan miktarı ya da bir örneğin yaşını hesaplar.",
    ],
    ev: "HESAPLAMA TAHMIN PROBLEM_COZME",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "İki yarı ömür sonunda örneğin tamamen bozunduğunu sanmak.",
      "Radyoaktif bozunma hızının sıcaklık veya kimyasal ortamla değiştiğini düşünmek.",
    ],
    x: [
      "math.found.exp-log:üstel bozunma ve logaritma ile yaş hesabı",
      "earth.geo.deep-time:radyometrik tarihleme",
      "phys.modern.nuclear-energy:fisyon, füzyon ve bağlanma enerjisi",
    ],
    rel: ["chem.kinetics", "chem.atoms.structure"],
    vs: ["chem.react.types"],
    tags: ["radyoaktivite", "yari-omur", "bozunma", "izotop"],
  })
  // ---------------------------------------------------------------------------
  .unit("Organik ve biyokimya", "Organik ve biyokimya")
  .o("chem.organic.functional-groups", "Fonksiyonel gruplar ve adlandırma", {
    d: "Alkol, eter, aldehit, keton, karboksilik asit, ester, amin ve amit gruplarının tanınması; IUPAC adlandırma kuralları, yapı izomerliği ve fonksiyonel grubun fiziksel özelliklere etkisi.",
    w: "Organik kimyanın alfabesidir: bir molekülün nasıl tepkimeye gireceği büyük ölçüde fonksiyonel grubundan okunur; ilaçlar, biyomoleküller ve polimerler bu dille anlatılır.",
    pre: ["chem.organic.intro"],
    q: [
      "Etanol (C₂H₆O) ile dimetil eter aynı kapalı formüle sahip; biri oda sıcaklığında sıvı, diğeri gaz. Bu nasıl mümkün?",
      "Sirkeyi ve muz kokusunu oluşturan moleküller arasında yalnızca küçük bir yapı farkı olabilir. Bir molekülün kokusunu ya da tadını hangi kısmı belirler?",
    ],
    cq: [
      "Başlıca fonksiyonel gruplar nasıl tanınır ve adlandırılır?",
      "Fonksiyonel grup kaynama noktasını ve çözünürlüğü nasıl etkiler?",
    ],
    obj: [
      "Bir yapı formülünde fonksiyonel grupları tanır ve IUPAC adını yazar.",
      "Verilen bir addan yapı formülünü çizer ve olası yapı izomerlerini üretir.",
      "Fonksiyonel grupların hidrojen bağı yapabilmesine göre kaynama noktalarını sıralar ve gerekçelendirir.",
    ],
    ev: "HATIRLAMA DIAGRAM TAHMIN ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Aynı kapalı formüle sahip moleküllerin aynı özelliklere sahip olduğunu sanmak.",
      "Alkollerdeki –OH grubunun bazik bir hidroksit iyonu gibi davrandığını düşünmek.",
    ],
    x: [
      "bio.molecules:biyomoleküllerdeki fonksiyonel gruplar",
      "neuro.syn.transmission:nörotransmiterlerin amin grupları",
    ],
    rel: ["chem.organic.reactions", "chem.bond.intermolecular"],
    tags: ["fonksiyonel-grup", "iupac", "izomer", "organik"],
  })
  .o("chem.organic.reactions", "Temel organik tepkimeler", {
    d: "Katılma, yer değiştirme (SN1/SN2), ayrılma, yükseltgenme–indirgenme ve esterleşme tepkimeleri; nükleofil ve elektrofil kavramları, eğri okla mekanizma gösterimi.",
    w: "Organik sentezin mantığını kurar: hangi maddeden hangi ürünün nasıl elde edileceğini planlamayı sağlar; ilaç kimyası ve biyokimyasal yolaklar aynı tepkime türlerini kullanır.",
    pre: ["chem.organic.functional-groups", "chem.kinetics~s"],
    q: [
      "Etene brom suyu eklediğinde kahverengi renk hemen kayboluyor, etanda kaybolmuyor. İki molekül arasındaki hangi fark bunu açıklar?",
      "Bir ester yapmak için alkol ile asidi karıştırıyorsun ama verim düşük kalıyor. Dengeyi ürün yönüne nasıl itersin?",
    ],
    cq: [
      "Nükleofil ve elektrofil nedir ve tepkimede nasıl buluşurlar?",
      "SN1 ve SN2 mekanizmaları hangi koşullarda baskın olur?",
      "Bir fonksiyonel grup diğerine hangi tepkimelerle dönüştürülür?",
    ],
    obj: [
      "Temel tepkime türlerinde ürünü tahmin eder ve tepkime türünü adlandırır.",
      "Basit bir mekanizmayı eğri oklarla çizer ve nükleofil ile elektrofili belirler.",
      "İki ya da üç basamaklı bir dönüşüm için sentez yolu önerir.",
    ],
    ev: "TAHMIN DIAGRAM PROBLEM_COZME",
    t: "UYGULAMA",
    lv: 3,
    sc: "L",
    mis: [
      "Eğri okların atomların hareketini gösterdiğini sanmak (elektron çiftlerinin hareketini gösterir).",
      "Her organik tepkimenin tek ve kesin bir ürün verdiğini düşünmek.",
    ],
    x: [
      "bio.enzymes:enzimlerin organik tepkimeleri katalizlemesi",
      "bio.energy.respiration:solunum yolaklarındaki yükseltgenme basamakları",
    ],
    ca: ["Kimya olimpiyatlarında organik dönüşüm ve mekanizma soruları"],
    rel: ["chem.organic.polymers", "chem.redox-electrochem"],
    tags: ["mekanizma", "nukleofil", "sentez", "organik"],
  })
  .o("chem.organic.polymers", "Polimerler ve malzemeler", {
    d: "Katılma ve kondenzasyon polimerleşmesi, monomer–polimer ilişkisi, zincir yapısının (dallanma, çapraz bağ) özelliklere etkisi; doğal polimerler, plastikler ve geri dönüşüm.",
    w: "Plastiklerden liflere, proteinlerden DNA'ya kadar büyük moleküllerin nasıl kurulduğunu ve neden farklı davrandığını gösterir; malzeme seçimi ve plastik kirliliği tartışmalarının temelidir.",
    pre: ["chem.organic.functional-groups"],
    q: [
      "Polietilen poşet ile bir PET şişe ikisi de plastik; ama biri yumuşak ve esnek, öteki sert. Molekül düzeyinde fark ne olabilir?",
      "Bazı plastikler ısıtılınca yeniden şekillendirilebiliyor, bazıları ise yanmadan önce yumuşamıyor bile. Neden?",
    ],
    cq: [
      "Katılma ve kondenzasyon polimerleri nasıl oluşur?",
      "Zincir yapısı ve moleküller arası kuvvetler polimerin özelliklerini nasıl belirler?",
    ],
    obj: [
      "Bir monomerden polimerin tekrar birimini, tekrar biriminden monomer(ler)i çizer.",
      "Polimerleri katılma ya da kondenzasyon polimeri olarak sınıflandırır ve yan ürünü belirtir.",
      "Termoplastik ve termoset davranışını zincir yapısıyla açıklar ve bir kullanım için malzeme önerir.",
    ],
    ev: "DIAGRAM ACIKLAMA TRANSFER",
    t: "UYGULAMA",
    lv: 2,
    sc: "M",
    mis: [
      "Tüm plastiklerin aynı şekilde geri dönüştürülebildiğini sanmak.",
      "'Doğal' polimerlerin kimyasal olarak sentetik polimerlerden tamamen farklı olduğunu düşünmek.",
    ],
    x: [
      "env.pollution.water-soil:plastik ve mikroplastik kirliliği",
      "bio.molecules:proteinler ve nükleik asitler birer polimer",
    ],
    rel: ["chem.bond.intermolecular", "chem.organic.reactions"],
    tags: ["polimer", "plastik", "malzeme", "monomer"],
  })
  // ---------------------------------------------------------------------------
  .unit("Fizikokimya", "Enerji, hız ve denge")
  .o("chem.analysis.spectroscopy", "Spektroskopi ve Beer–Lambert yasası", {
    d: "Işığın madde tarafından soğurulması ve yayımlanması; UV–görünür, IR ve atomik spektrumların temel fikri, renk ile soğurulan dalga boyu ilişkisi, Beer–Lambert yasası ve kalibrasyon eğrisiyle derişim tayini.",
    w: "Bir çözeltinin derişimini ışıkla ölçmeyi ve bir molekülü 'parmak izinden' tanımayı sağlar; tıp laboratuvarlarından astronomiye kadar en yaygın analiz yöntemidir.",
    pre: ["chem.atoms.electron-config", "phys.optics.wave~s", "math.found.exp-log~s"],
    q: [
      "Bakır sülfat çözeltisi mavi görünüyor. Bu, çözeltinin mavi ışığı soğurduğu anlamına mı gelir, yoksa tam tersi mi?",
      "Bir çözeltiyi iki kat seyreltirsen içinden geçen ışık iki kat mı artar? Önce tahmin et.",
    ],
    cq: [
      "Atom ve moleküller ışığı neden yalnızca belirli dalga boylarında soğurur?",
      "Soğurbans, derişim ve yol uzunluğu nasıl ilişkilidir?",
      "Kalibrasyon eğrisi nasıl kurulur ve ne zaman güvenilmez olur?",
    ],
    obj: [
      "Soğurbans ile geçirgenlik arasında dönüşüm yapar ve Beer–Lambert yasasıyla derişim hesaplar.",
      "Standart çözeltilerden bir kalibrasyon eğrisi kurar ve bilinmeyen bir örneğin derişimini belirsizliğiyle bulur.",
      "Bir çözeltinin rengini tamamlayıcı renk ilişkisiyle soğurduğu dalga boyundan tahmin eder.",
      "Basit bir IR spektrumunda karakteristik bağ titreşimlerini tanır.",
    ],
    ev: "HESAPLAMA VERI_ANALIZI DENEY YORUMLAMA",
    t: "VERI_ANALIZI",
    lv: 3,
    sc: "M",
    mis: [
      "Bir çözeltinin gördüğümüz rengini soğurduğu renk sanmak.",
      "Geçirgenliğin derişimle doğrusal azaldığını düşünmek (doğrusal olan soğurbanstır).",
    ],
    x: [
      "phys.modern.photoelectric:foton enerjisi E = hf",
      "space.light.spectra:yıldız tayflarından bileşim çıkarma",
      "math.stat.regression:kalibrasyon doğrusu ve belirsizlik",
    ],
    ra: ["Biyokimya laboratuvarlarında protein ve DNA derişiminin ölçülmesi"],
    rel: ["chem.lab.techniques", "chem.atoms.electron-config"],
    tags: ["spektroskopi", "beer-lambert", "sogurbans", "kalibrasyon"],
  })
  .o("chem.lab.techniques", "Laboratuvar teknikleri: titrasyon, kromatografi, güvenlik", {
    d: "Asit–baz titrasyonu ve indikatör seçimi, standart çözelti hazırlama, kâğıt ve ince tabaka kromatografisi (Rf değeri), süzme, damıtma ve yeniden kristallendirme; laboratuvar güvenliği ve ölçüm belirsizliği.",
    w: "Kâğıt üstündeki kimyayı güvenilir ölçümlere dönüştürür; olimpiyat pratik sınavlarının, bilim projelerinin ve her deneysel raporun temelidir.",
    pre: ["chem.acid-base", "chem.solutions"],
    q: [
      "Bir titrasyonda büreti okurken gözün çizginin biraz üstünde kalıyor. Sonucun hep büyük mü, hep küçük mü çıkar, yoksa rastgele mi değişir?",
      "Bir keçeli kalemin siyah mürekkebini suyla kâğıt üzerinde yürüttüğünde renklere ayrılıyor. Bu ayrılmayı ne sağlar?",
    ],
    cq: [
      "Titrasyonda dönüm noktası nasıl belirlenir ve indikatör nasıl seçilir?",
      "Kromatografide maddeler neden farklı hızlarda ilerler?",
      "Sistematik ve rastgele hatalar nasıl ayırt edilir ve azaltılır?",
    ],
    obj: [
      "Bir asit–baz titrasyonunu planlar, uygular ve sonuçtan bilinmeyen derişimi belirsizliğiyle hesaplar.",
      "Bir kromatogramdan Rf değerlerini hesaplar ve bileşenleri standartlarla karşılaştırarak tanır.",
      "Bir deneyin risklerini değerlendirir ve uygun güvenlik önlemlerini yazar.",
      "Bir ölçüm sonucundaki hatanın sistematik mi rastgele mi olduğunu ayırt eder.",
    ],
    ev: "DENEY HESAPLAMA VERI_ANALIZI",
    t: "DENEY",
    lv: 2,
    sc: "M",
    mis: [
      "Ölçümü tekrarlamanın sistematik hatayı da ortadan kaldırdığını sanmak.",
      "Dönüm noktasında çözeltinin her zaman nötr (pH 7) olduğunu düşünmek.",
    ],
    x: [
      "phys.lab.experimental:ölçüm belirsizliği ve hata yayılımı",
      "res.method.experimental-design:kontrollü deney tasarımı",
      "bio.methods.lab:biyoloji laboratuvarında ayırma teknikleri",
    ],
    ca: ["Kimya olimpiyatlarının pratik sınavlarında titrasyon ve ayırma görevleri"],
    rel: ["chem.acid-base", "chem.analysis.spectroscopy"],
    tags: ["titrasyon", "kromatografi", "laboratuvar", "guvenlik"],
  })
  .done();
