import { builder } from "../dsl";

export const PHYSICS = builder("FIZIK")
  // ---------------------------------------------------------------------------
  .unit("Temel", "Ölçme")
  .o("phys.measure.units", "Ölçme, birimler, boyut analizi ve belirsizlik", {
    d: "SI birimleri, birim dönüşümü, boyut analiziyle formül denetimi ve ölçüm belirsizliğinin yayılması.",
    w: "Her fizik hesabının ilk sağlama aracıdır; olimpiyatta yanlış bir sonucu saniyeler içinde yakalamanı ve bilinmeyen bir formülün biçimini tahmin etmeni sağlar.",
    pre: ["math.found.arithmetic"],
    q: [
      "Bir sarkacın periyodu ipin uzunluğuna, kütleye ve g'ye bağlıysa yalnızca birimlere bakarak periyodun formülünü bulabilir misin? Kütle neden formülde olamaz?",
      "Bir cetvelle 12,3 cm ölçtün. Bu sayının alanını hesaplarken kaç basamak yazmak dürüst olur?",
    ],
    cq: [
      "Bir denklemin boyutça tutarlı olması doğru olduğunu gösterir mi?",
      "Ölçüm belirsizlikleri toplama, çarpma ve kuvvet alma işlemlerinde nasıl birleşir?",
      "Buckingham π yaklaşımı hangi bilgiyi verir, hangisini veremez?",
    ],
    obj: [
      "Bir formülün boyutsal tutarlılığını denetler ve hatalı terimi bulur.",
      "Boyut analiziyle bilinmeyen bir bağıntının biçimini sabit çarpana kadar türetir.",
      "Ölçüm belirsizliğini toplama ve çarpma işlemlerinde yayarak sonucu doğru anlamlı basamakla yazar.",
    ],
    ev: "HESAPLAMA PROBLEM_COZME TAHMIN",
    t: "BECERI",
    lv: 1,
    sc: "S",
    mis: [
      "Boyutça doğru bir formülün mutlaka doğru olduğunu sanmak (boyutsuz çarpanlar ve 2π görünmez).",
      "Hesap makinesindeki tüm basamakları yazmanın daha 'kesin' olduğunu düşünmek.",
    ],
    x: [
      "chem.stoich.mole:mol ve derişim hesaplarında aynı birim dönüşümü disiplini",
      "res.data.management:ölçüm birimlerinin ve belirsizliğin veri setinde belgelenmesi",
    ],
    ca: ["Olimpiyat sorularında cevabı boyut analiziyle sağlama", "Boyut analiziyle formül tahmini soruları"],
    rel: ["phys.olymp.estimation", "phys.lab.experimental"],
    tags: ["birim", "boyut-analizi", "belirsizlik"],
  })

  // ---------------------------------------------------------------------------
  .unit("Mekanik", "Kinematik ve dinamik")
  .o("phys.mech.kinematics-1d", "Bir boyutta hareket", {
    d: "Konum, hız ve ivmenin türev-integral ilişkisi; sabit ivmeli hareket denklemleri ve hareket grafiklerinin okunması.",
    w: "Tüm mekaniğin dilidir; x–t, v–t grafiklerini okuyabilmek ileride devrelerdeki akım–zaman ve nöronlardaki gerilim–zaman grafiklerini okumanın da temelidir.",
    pre: ["phys.measure.units", "math.found.functions", "math.calc.derivative-def~s"],
    q: [
      "Bir topu yukarı attığında en tepe noktada ivmesi sıfır mıdır? Tahmin et, sonra gerekçelendir.",
      "Hızı negatif olan bir araç hızlanıyor olabilir mi?",
    ],
    cq: [
      "Konum, hız ve ivme birbirinden nasıl elde edilir?",
      "v–t grafiğinin altındaki alan ve eğimi neyi anlatır?",
      "Sabit ivmeli hareket denklemleri hangi varsayıma dayanır?",
    ],
    obj: [
      "Sabit ivmeli hareket denklemlerini v–t grafiğinden türetir.",
      "x–t, v–t ve a–t grafikleri arasında dönüşüm yapar ve yorumlar.",
      "Takip ve karşılaşma problemlerini göreli hareketle çözer.",
    ],
    ev: "HESAPLAMA DIAGRAM YORUMLAMA PROBLEM_COZME",
    t: "KAVRAM",
    lv: 1,
    sc: "M",
    mis: [
      "Hız sıfırken ivmenin de sıfır olması gerektiğini sanmak.",
      "Negatif ivmenin her zaman yavaşlama demek olduğunu düşünmek.",
    ],
    x: [
      "math.calc.derivative-def:hız konumun türevidir; türevin fiziksel anlamı",
      "math.calc.integral-def:yer değiştirme v–t eğrisi altındaki alandır",
    ],
    ca: ["Grafik okuma ve göreli hareket soruları (ulusal olimpiyat ilk aşaması)", "Takip–yakalama problemleri"],
    rel: ["phys.mech.kinematics-2d"],
    tags: ["kinematik", "grafik", "ivme"],
  })
  .o("phys.mech.kinematics-2d", "İki boyutta hareket ve eğik atış", {
    d: "Hareketi bağımsız bileşenlere ayırma, eğik atış, göreli hız ve referans sistemleri arasında geçiş.",
    w: "Vektörel düşünmeyi zorunlu kılar; eğik atış olimpiyatlarda optimizasyon, zarf eğrisi ve göreli hareket sorularının klasik zeminidir.",
    pre: ["phys.mech.kinematics-1d", "math.geo.vectors", "math.trig.basics"],
    q: [
      "Aynı anda biri yatay fırlatılan, biri serbest bırakılan iki mermiden hangisi yere önce düşer?",
      "Hava direnci yokken en uzak menzil için 45° gerekir. Atış bir yamaçtan aşağı yapılırsa açı büyür mü küçülür mü?",
    ],
    cq: [
      "Yatay ve düşey hareket neden birbirinden bağımsız ele alınabilir?",
      "Göreli hız farklı gözlemciler için nasıl dönüşür?",
      "Belirli bir hıza sahip atışla erişilebilen bölgenin sınırı nedir?",
    ],
    obj: [
      "Eğik atışın menzil, uçuş süresi ve maksimum yükseklik bağıntılarını türetir.",
      "Göreli hız problemlerini vektör diyagramıyla çözer.",
      "Eğik yüzeylere atış ve en uygun açı problemlerini optimizasyonla çözer.",
    ],
    ev: "TURETME PROBLEM_COZME DIAGRAM",
    t: "UYGULAMA",
    lv: 2,
    sc: "M",
    mis: [
      "Tepe noktasında hızın tamamen sıfır olduğunu sanmak (yatay bileşen kalır).",
      "Daha ağır cismin aynı atışta daha kısa menzile sahip olacağını düşünmek.",
    ],
    x: [
      "math.calc.parametric-polar:yörünge parametrik bir eğridir",
      "math.calc.applications:en uygun atış açısı bir optimizasyon problemidir",
    ],
    ca: ["Eğik atış ve güvenli bölge (zarf parabolü) problemleri", "Nehir geçişi ve rüzgârlı uçuş gibi göreli hız soruları"],
    rel: ["phys.mech.circular", "phys.modern.relativity"],
    tags: ["eğik-atış", "vektör", "göreli-hareket"],
  })
  .o("phys.mech.newton", "Newton yasaları ve serbest cisim diyagramı", {
    d: "Kuvvet kavramı, Newton'un üç yasası, eylemsiz referans sistemleri ve serbest cisim diyagramıyla hareket denklemi kurma.",
    w: "Mekanik problemlerinin çoğu doğru bir serbest cisim diyagramıyla başlar; aynı 'kuvvetleri topla, denklemi kur' düşüncesi elektrik ve akışkanlarda da kullanılır.",
    pre: ["phys.mech.kinematics-1d", "math.geo.vectors~s"],
    q: [
      "Bir at arabayı çekerken araba da atı aynı büyüklükte geri çekiyorsa sistem nasıl hareket edebiliyor?",
      "Asansör yukarı doğru yavaşlarken tartı sana gerçek ağırlığından fazla mı az mı gösterir?",
    ],
    cq: [
      "Kuvvet hareketin nedeni midir, yoksa hareketteki değişimin mi?",
      "Etki–tepki çiftleri neden birbirini sıfırlamaz?",
      "İvmeli bir sistemde sahte kuvvetler ne zaman ve nasıl kullanılır?",
    ],
    obj: [
      "Çok cisimli sistemler için doğru serbest cisim diyagramları çizer.",
      "Makara, eğik düzlem ve bağlı cisim sistemlerinin ivmelerini hesaplar.",
      "Etki–tepki çiftlerini dengeleyen kuvvetlerden ayırt eder.",
      "İvmeli referans sisteminde sahte kuvvetle problemi yeniden çözer ve sonuçları karşılaştırır.",
    ],
    ev: "DIAGRAM PROBLEM_COZME ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "L",
    mis: [
      "Hareketi sürdürmek için sürekli kuvvet gerektiğini sanmak (Aristotelesçi sezgi).",
      "Etki–tepki kuvvetlerinin aynı cisme etkidiğini düşünmek.",
      "Normal kuvvetin her zaman ağırlığa eşit olduğunu varsaymak.",
    ],
    x: [
      "gk.sci-hist.scientific-revolution:Newton mekaniğinin tarihsel doğuşu",
      "math.ode.first-order:F = ma bir diferansiyel denklemdir",
    ],
    ca: ["Bağlı cisimler ve makara sistemleri (her olimpiyat aşamasında)", "Hareketli kama ve ivmeli sistem soruları"],
    rel: ["phys.mech.friction-forces", "phys.mech.momentum"],
    tags: ["newton", "kuvvet", "serbest-cisim"],
  })
  .o("phys.mech.friction-forces", "Sürtünme, yay ve gerilme kuvvetleri", {
    d: "Statik ve kinetik sürtünme, Hooke yasası, ip gerilmesi ve sürüklenme kuvvetinin modellenmesi.",
    w: "Gerçekçi problemleri ideal olanlardan ayıran kuvvetlerdir; yay modeli moleküler bağlardan nöron membranına kadar her yerde doğrusal yaklaşım olarak karşına çıkar.",
    pre: ["phys.mech.newton"],
    q: [
      "Duvara yaslanmış bir merdivenin kaymaması için zeminde mi duvarda mı sürtünme daha önemlidir?",
      "Bir halata sarılmış ip neden iki tur sonra yükü taşımayı çok kolaylaştırır?",
    ],
    cq: [
      "Statik sürtünme neden bir eşitlik değil, bir eşitsizliktir?",
      "Seri ve paralel yaylar nasıl birleşir?",
      "Hız ile orantılı sürüklenme kuvveti hareketi nasıl değiştirir?",
    ],
    obj: [
      "Statik ve kinetik sürtünmenin rejimlerini ayırt eder ve kayma eşiğini hesaplar.",
      "Seri ve paralel yay sistemlerinin eşdeğer sabitini türetir.",
      "Doğrusal sürüklenme altında limit hızı diferansiyel denklemle hesaplar.",
    ],
    ev: "PROBLEM_COZME HESAPLAMA MODELLEME",
    t: "UYGULAMA",
    lv: 2,
    sc: "M",
    mis: [
      "Sürtünme kuvvetinin her zaman μN'ye eşit olduğunu sanmak.",
      "Sürtünmenin her zaman hareketin tersine olduğunu düşünmek (yürürken itici sürtünme ileri yöndedir).",
    ],
    x: [
      "math.ode.first-order:limit hız problemi birinci mertebe denklemdir",
      "chem.bond.bonding:kimyasal bağın küçük titreşimlerde yay gibi davranması",
    ],
    ca: ["Kayma eşiği ve devrilme–kayma karşılaştırması soruları", "Kapstan (ip–silindir) sürtünmesi problemleri"],
    rel: ["phys.mech.oscillations", "phys.mech.torque"],
    tags: ["sürtünme", "yay", "gerilme"],
  })
  .o("phys.mech.circular", "Düzgün dairesel hareket", {
    d: "Merkezcil ivme, dairesel harekette kuvvet analizi, virajlar, dikey çember ve dönen referans sistemleri.",
    w: "Yörüngeler, dönme ve manyetik alanda yüklü parçacık hareketinin hepsi dairesel hareketin üzerine kurulur.",
    pre: ["phys.mech.kinematics-2d", "phys.mech.newton"],
    q: [
      "Sabit süratle dönen bir cisim ivmeleniyor mudur? Ivmesi varsa hangi yöne?",
      "Dönen bir lunaparkta seni duvara yapıştıran 'merkezkaç kuvvet' gerçekten var mı?",
    ],
    cq: [
      "Merkezcil kuvvet ayrı bir kuvvet midir, yoksa bir rol mü?",
      "Dikey çemberde ipin gevşemesi için koşul nedir?",
      "Eğimli virajda sürtünmesiz güvenli hız nasıl bulunur?",
    ],
    obj: [
      "a = v²/r bağıntısını geometrik olarak türetir.",
      "Viraj, konik sarkaç ve dikey çember problemlerinde gerekli kuvvetleri hesaplar.",
      "Merkezcil ve merkezkaç kavramlarını eylemsiz ve dönen gözlemciye göre ayırt eder.",
    ],
    ev: "TURETME PROBLEM_COZME DIAGRAM",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Merkezcil kuvveti serbest cisim diyagramına ek bir kuvvet olarak çizmek.",
      "İp koptuğunda cismin dışa doğru radyal uçacağını sanmak.",
    ],
    x: ["math.calc.parametric-polar:kutupsal koordinatlarda ivme bileşenleri"],
    ca: ["Dikey çemberde ilmek–kopma koşulu soruları", "Dönen sistemlerde denge problemleri"],
    rel: ["phys.mech.rotation-kinematics", "phys.mech.gravitation", "phys.em.magnetism"],
    tags: ["dairesel", "merkezcil"],
  })
  .o("phys.mech.work-energy", "İş, enerji ve güç", {
    d: "İş–enerji teoremi, korunumlu kuvvetler ve potansiyel enerji, mekanik enerjinin korunumu, güç ve potansiyel enerji eğrileri.",
    w: "Enerji yöntemi kuvvet takibi gerektirmeden sonuca götürür; potansiyel enerji eğrisi okumak kimyada tepkime koordinatını, nörobilimde enerji manzaralarını anlamanın da anahtarıdır.",
    pre: ["phys.mech.newton", "math.calc.integral-def~s"],
    q: [
      "Bir kayakçı farklı eğimdeki iki pistten aynı yükseklikten sürtünmesiz iniyor. Hangisinin sonunda daha hızlıdır?",
      "Bir kitabı sabit hızla yukarı taşırken yaptığın net iş nedir? Peki yorulman neden?",
    ],
    cq: [
      "Bir kuvvet ne zaman korunumludur ve potansiyel enerji neden ancak o zaman tanımlanır?",
      "F = −dU/dx bağıntısı denge noktaları hakkında ne söyler?",
      "Güç ile kuvvet ve hız arasındaki ilişki nedir?",
    ],
    obj: [
      "İş–enerji teoremini Newton'un ikinci yasasından türetir.",
      "Potansiyel enerji eğrisinden denge noktalarını ve kararlılıklarını yorumlar.",
      "Değişken kuvvet altında işi integralle hesaplar.",
      "Enerji korunumu ile kuvvet yöntemini aynı problemde karşılaştırarak uygun olanı seçer.",
    ],
    ev: "TURETME HESAPLAMA YORUMLAMA PROBLEM_COZME",
    t: "KAVRAM",
    lv: 2,
    sc: "L",
    mis: [
      "İşin yalnızca hareket yönündeki kuvvetle değil, her kuvvetle 'yapıldığını' karıştırmak; normal kuvvetin iş yaptığını sanmak.",
      "Enerjinin korunumunun sürtünme varken geçersiz olduğunu düşünmek (mekanik enerji korunmaz, toplam enerji korunur).",
    ],
    x: [
      "math.calc.integral-apps:değişken kuvvetin işi integral uygulamasıdır",
      "chem.thermo.thermochemistry:enerji korunumunun kimyasal tepkimelere uzantısı",
      "neuro.comp.attractors:enerji manzarası ve kararlı durumlar benzetmesi",
    ],
    ca: ["Enerji korunumu ile hız ve yükseklik soruları", "Potansiyel eğrisinden kararlılık analizi"],
    rel: ["phys.mech.momentum", "phys.mech.oscillations", "phys.thermo.laws"],
    tags: ["enerji", "iş", "güç", "korunum"],
  })
  .o("phys.mech.momentum", "Momentum, itme ve çarpışmalar", {
    d: "Doğrusal momentum, itme–momentum teoremi, momentum korunumu, esnek ve esnek olmayan çarpışmalar, değişken kütleli sistemler.",
    w: "Kuvvetin bilinmediği kısa etkileşimleri çözmenin yoludur; roket denklemi, gaz basıncının mikroskobik açıklaması ve parçacık fiziği momentuma dayanır.",
    pre: ["phys.mech.newton", "phys.mech.work-energy~s"],
    q: [
      "Bir bilardo topu duran özdeş bir topa merkezden olmayan esnek bir çarpışmayla vurursa iki top hangi açıyla ayrılır?",
      "Roket boşlukta itilecek bir şey yokken nasıl hızlanır?",
    ],
    cq: [
      "Momentum ne zaman korunur, enerji ne zaman korunmaz?",
      "Kütle merkezi çerçevesinde çarpışmalar neden daha basit görünür?",
      "Değişken kütleli sistemlerde Newton'un ikinci yasası nasıl yazılır?",
    ],
    obj: [
      "Bir ve iki boyutlu çarpışmaları korunum yasalarıyla çözer.",
      "Tsiolkovsky roket denklemini momentum korunumundan türetir.",
      "Esneklik katsayısıyla enerji kaybını hesaplar ve yorumlar.",
    ],
    ev: "TURETME PROBLEM_COZME HESAPLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Esnek olmayan çarpışmada momentumun da kaybolduğunu sanmak.",
      "Momentum ile kinetik enerjinin aynı bilgiyi taşıdığını düşünmek.",
    ],
    x: [
      "chem.gas.laws:gaz basıncı moleküllerin duvara aktardığı momentumdur",
      "prog.sci.simulation:çarpışma simülasyonlarında korunum denetimi",
    ],
    ca: ["Çok cisimli çarpışma ve bilardo geometrisi soruları", "Roket ve değişken kütle (zincir, kum) problemleri"],
    rel: ["phys.mech.center-of-mass", "phys.thermo.kinetic-theory"],
    vs: ["phys.mech.work-energy"],
    tags: ["momentum", "çarpışma", "roket"],
  })
  .o("phys.mech.center-of-mass", "Kütle merkezi ve parçacık sistemleri", {
    d: "Kesikli ve sürekli sistemlerde kütle merkezi, kütle merkezinin hareketi, indirgenmiş kütle ve sistemlerin iç–dış enerjisi.",
    w: "Karmaşık sistemleri tek bir noktanın hareketiyle özetlemeyi sağlar; iki cisim problemini tek cisme indirgemenin yolu buradan geçer.",
    pre: ["phys.mech.momentum", "math.calc.integral-apps~c"],
    q: [
      "Sürtünmesiz buzda duran bir kayıkçı kayığın bir ucundan öbür ucuna yürürse kıyıya göre kayık ne kadar kayar?",
      "Bir yüksek atlayıcı kütle merkezi çıtanın altından geçerken çıtayı aşabilir mi?",
    ],
    cq: [
      "Sistemin iç kuvvetleri kütle merkezinin hareketini neden etkilemez?",
      "Kinetik enerji kütle merkezi ve iç hareket olarak nasıl ayrışır?",
      "İndirgenmiş kütle iki cisim problemini nasıl basitleştirir?",
    ],
    obj: [
      "Düzgün çubuk, yarım disk ve koni gibi sürekli cisimlerin kütle merkezini integralle hesaplar.",
      "König teoremini (kinetik enerji ayrışması) türetir.",
      "İki cisim problemini indirgenmiş kütleyle tek cisim problemine dönüştürür.",
    ],
    ev: "HESAPLAMA TURETME PROBLEM_COZME",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Kütle merkezinin her zaman cismin içinde bulunması gerektiğini sanmak.",
      "Patlamadan sonra parçaların kütle merkezinin yörüngesinin değiştiğini düşünmek.",
    ],
    x: ["math.calc.multiple-integrals:sürekli cisimlerde kütle merkezi katlı integraldir"],
    ca: ["Kayık–insan ve patlayan mermi soruları", "Sürekli cisimlerin kütle merkezi hesapları"],
    rel: ["phys.mech.rotation-dynamics", "phys.mech.gravitation"],
    tags: ["kütle-merkezi", "sistem"],
  })

  // ---------------------------------------------------------------------------
  .unit("Mekanik", "Dönme, kütle çekimi, salınım")
  .o("phys.mech.rotation-kinematics", "Dönme kinematiği", {
    d: "Açısal konum, hız ve ivme; doğrusal ve açısal nicelikler arasındaki bağıntılar ve kaymadan yuvarlanma koşulu.",
    w: "Dönme hareketi doğrusal kinematiğin birebir eşleniğidir; bu eşlemeyi kurmak dönme dinamiğini neredeyse bedavaya getirir.",
    pre: ["phys.mech.circular"],
    q: [
      "Kaymadan yuvarlanan bir tekerleğin yere değen noktası o an ne hızla hareket eder?",
      "Bir bisiklet tekerleğinin en üst noktası bisikletin kendisinden hızlı mı gider?",
    ],
    cq: [
      "Açısal nicelikler neden vektör olarak ele alınır?",
      "Kaymadan yuvarlanma koşulu v = ωR nereden gelir?",
    ],
    obj: [
      "Sabit açısal ivmeli hareket denklemlerini doğrusal karşılıklarından türetir.",
      "Yuvarlanan cisimlerde farklı noktaların hızlarını vektörel olarak hesaplar.",
      "Anlık dönme merkezi kavramını kullanarak hız dağılımını yorumlar.",
    ],
    ev: "HESAPLAMA DIAGRAM PROBLEM_COZME",
    t: "KAVRAM",
    lv: 2,
    sc: "S",
    mis: [
      "Yuvarlanan tekerleğin tüm noktalarının aynı hızla ilerlediğini sanmak.",
      "Açısal hızın yönünün dönme düzleminde olduğunu düşünmek.",
    ],
    x: ["math.geo.vectors:v = ω × r dış çarpım uygulamasıdır"],
    ca: ["Yuvarlanma ve anlık dönme merkezi soruları"],
    rel: ["phys.mech.rotation-dynamics"],
    tags: ["dönme", "açısal-hız"],
  })
  .o("phys.mech.torque", "Tork ve statik denge", {
    d: "Tork kavramı, statik dengenin iki koşulu, ağırlık merkezi, devrilme ve kayma analizi.",
    w: "Köprüler, kollar ve kaslar torkla çalışır; olimpiyatlarda statik denge soruları çoğu zaman en zarif kısa çözümleri barındırır.",
    pre: ["phys.mech.newton", "math.geo.vectors"],
    q: [
      "Bir kapıyı menteşeye yakın yerden itmek neden bu kadar zordur? Kuvvet aynı olduğu hâlde ne değişiyor?",
      "Üst üste dizilmiş özdeş tuğlalarla masa kenarından ne kadar dışarı taşabilirsin? Sınır var mı?",
    ],
    cq: [
      "Statik dengede tork hangi noktaya göre alınmalı ve bu seçim neden serbesttir?",
      "Bir cisim önce kayar mı, devrilir mi?",
      "Üç kuvvetle dengede kuvvet doğrultuları neden tek noktada kesişir?",
    ],
    obj: [
      "Tork dengesi için uygun pivot noktası seçerek bilinmeyenleri azaltır.",
      "Merdiven, raf ve asılı cisim problemlerinde tepki kuvvetlerini hesaplar.",
      "Kayma ve devrilme koşullarını karşılaştırarak hangisinin önce gerçekleştiğini gösterir.",
    ],
    ev: "PROBLEM_COZME DIAGRAM HESAPLAMA",
    t: "UYGULAMA",
    lv: 2,
    sc: "M",
    mis: [
      "Torku yalnızca kuvvetin büyüklüğüne bağlı sanmak.",
      "Dengede olan bir cismin hiçbir kuvvet altında olmadığını düşünmek.",
    ],
    x: [
      "bio.physiology.systems:kas–kemik sistemi kaldıraç olarak çalışır",
      "math.found.sequences:üst üste tuğla probleminde harmonik seri ortaya çıkar",
    ],
    ca: ["Merdiven ve devrilme soruları", "Üç kuvvet teoremiyle hızlı çözümler"],
    rel: ["phys.mech.rotation-dynamics", "phys.mech.friction-forces"],
    tags: ["tork", "denge", "statik"],
  })
  .o("phys.mech.rotation-dynamics", "Dönme dinamiği ve eylemsizlik momenti", {
    d: "τ = Iα, eylemsizlik momentinin hesaplanması, paralel ve dik eksen teoremleri, dönme kinetik enerjisi ve yuvarlanma dinamiği.",
    w: "Yuvarlanan cisimler, volanlar ve sarkaçlar dönme dinamiği olmadan çözülemez; bu konu olimpiyat mekaniğinin en çok sorulan bölümlerindendir.",
    pre: ["phys.mech.torque", "phys.mech.rotation-kinematics", "phys.mech.center-of-mass~s"],
    q: [
      "Aynı kütle ve yarıçaptaki dolu silindir ile içi boş silindir aynı rampadan bırakılıyor. Hangisi önce iner? Kütleleri farklı olsaydı sonuç değişir miydi?",
      "Dönen bir ipli yo-yo'yu yatay çekersen hangi yöne yuvarlanır?",
    ],
    cq: [
      "Eylemsizlik momenti kütlenin nasıl dağıldığını nasıl ölçer?",
      "Paralel eksen teoremi neden doğrudur?",
      "Yuvarlanan cisimde sürtünme ne zaman iş yapmaz?",
    ],
    obj: [
      "Çubuk, disk, küre ve kabuk için eylemsizlik momentlerini integralle türetir.",
      "Paralel ve dik eksen teoremlerini ispatlar ve uygular.",
      "Yuvarlanma problemlerini tork ve enerji yöntemleriyle çözer.",
      "Fiziksel sarkacın periyodunu eylemsizlik momentinden hesaplar.",
    ],
    ev: "TURETME ISPAT PROBLEM_COZME HESAPLAMA",
    t: "TURETME",
    lv: 4,
    sc: "L",
    mis: [
      "Eylemsizlik momentinin yalnızca kütleye bağlı olduğunu sanmak.",
      "Yuvarlanan cismin tüm kinetik enerjisinin öteleme enerjisi olduğunu düşünmek.",
      "Statik sürtünmenin yuvarlanmada her zaman enerji kaybettirdiğini sanmak.",
    ],
    x: [
      "math.calc.multiple-integrals:eylemsizlik momenti kütle dağılımının integralidir",
      "math.linalg.eigen:eylemsizlik tensörünün asal eksenleri özvektörlerdir",
    ],
    ca: ["Rampadan yuvarlanma yarışı soruları", "Makara–disk ve yo-yo problemleri", "Kayarak başlayıp yuvarlanmaya geçen bowling topu"],
    rel: ["phys.mech.angular-momentum", "phys.mech.oscillations"],
    tags: ["dönme", "eylemsizlik-momenti", "yuvarlanma"],
  })
  .o("phys.mech.angular-momentum", "Açısal momentum ve korunumu", {
    d: "Parçacık ve katı cisim için açısal momentum, açısal itme, korunum koşulları, jiroskop ve presesyonun temelleri.",
    w: "Merkezi kuvvet problemlerinin, buz patencisinin dönüşünün ve gezegen yörüngelerinin anahtarıdır; kuantum mekaniğinde de temel bir korunan niceliktir.",
    pre: ["phys.mech.rotation-dynamics", "phys.mech.momentum"],
    q: [
      "Buz patencisi kollarını kapatınca hızlanır. Kinetik enerjisi de artar mı? Artıyorsa bu enerji nereden gelir?",
      "Dönen bir bisiklet tekerleğini tek ucundan tuttuğunda neden düşmeyip yatay düzlemde döner?",
    ],
    cq: [
      "Açısal momentum hangi noktaya göre korunur?",
      "Merkezi kuvvet altında alan hızı neden sabittir?",
      "Presesyon hızı tork ve açısal momentumla nasıl ilişkilidir?",
    ],
    obj: [
      "Merkezi kuvvet altında açısal momentum korunumunu türetir ve Kepler'in ikinci yasasına bağlar.",
      "Doğrusal ve açısal momentumun birlikte korunduğu çarpışmaları çözer.",
      "Hızlı topacın presesyon frekansını yaklaşık olarak hesaplar.",
    ],
    ev: "TURETME PROBLEM_COZME ACIKLAMA",
    t: "KAVRAM",
    lv: 4,
    sc: "L",
    mis: [
      "Açısal momentumun yalnızca dönen cisimlerde olduğunu sanmak (düz çizgide giden parçacığın da vardır).",
      "Açısal momentum korunuyorsa dönme kinetik enerjisinin de korunduğunu düşünmek.",
    ],
    x: [
      "math.geo.vectors:L = r × p dış çarpım",
      "chem.atoms.electron-config:orbitallerin açısal momentum kuantum sayıları",
    ],
    ca: ["Çubuğa çarpıp yapışan parçacık soruları", "Patenci ve dönen platform problemleri", "Jiroskop ve topaç presesyonu"],
    rel: ["phys.mech.gravitation", "phys.modern.atomic-nuclear"],
    tags: ["açısal-momentum", "korunum", "presesyon"],
  })
  .o("phys.mech.gravitation", "Evrensel kütle çekimi ve yörüngeler", {
    d: "Newton'un çekim yasası, çekim potansiyeli, kabuk teoremi, Kepler yasaları, yörünge enerjisi ve kaçış hızı.",
    w: "Fiziğin ilk büyük birleştirmesidir; yörünge mekaniği uzay görevlerinden çift yıldızlara kadar uzanır ve olimpiyatların vazgeçilmez konusudur.",
    pre: ["phys.mech.circular", "phys.mech.work-energy"],
    q: [
      "Uydudaki astronotlar çekim olmadığı için mi ağırlıksızdır? Uydu yüksekliğinde g ne kadar azalır, tahmin et.",
      "Yörüngedeki bir uydu öndeki uyduya yetişmek için ileri doğru motor ateşlerse ne olur?",
    ],
    cq: [
      "Kabuk teoremi neden gezegenleri noktasal kütle gibi ele almamızı sağlar?",
      "Eliptik yörüngenin enerjisi neden yalnızca büyük yarı eksene bağlıdır?",
      "Kaçış hızı ve bağlı yörünge koşulu nasıl bulunur?",
    ],
    obj: [
      "Dairesel yörünge için Kepler'in üçüncü yasasını türetir.",
      "Kaçış hızını ve yörünge enerjisini hesaplar.",
      "Etkin potansiyel yardımıyla yörünge türlerini sınıflandırır.",
      "Kabuk teoreminin sonuçlarını integralle gösterir.",
    ],
    ev: "TURETME ISPAT HESAPLAMA PROBLEM_COZME",
    t: "KAVRAM",
    lv: 4,
    sc: "L",
    mis: [
      "Yörüngedeki astronotların çekim kuvvetinin sıfır olduğunu sanmak.",
      "Hızlanmak için ileri ateşlemenin uyduyu öndekine yaklaştıracağını düşünmek (daha yüksek, daha yavaş yörüngeye geçer).",
    ],
    x: [
      "gk.sci-hist.scientific-revolution:Kepler'den Newton'a gök mekaniğinin gelişimi",
      "math.calc.parametric-polar:yörünge denklemi kutupsal koordinatta konik kesittir",
    ],
    ca: ["Kepler yasaları ve yörünge geçişi (Hohmann) soruları", "Çift yıldız ve indirgenmiş kütle problemleri", "Gelgit kuvvetlerinin kabaca tahmini"],
    rel: ["phys.mech.angular-momentum", "phys.em.charge-field"],
    tags: ["kütle-çekimi", "yörünge", "kepler"],
  })
  .o("phys.mech.oscillations", "Basit harmonik hareket", {
    d: "Geri çağırıcı kuvvet, basit harmonik hareketin denklemi, periyot, enerji ve küçük salınım yaklaşımı.",
    w: "Kararlı bir dengenin etrafındaki her küçük hareket harmonik osilatördür; dalgalar, devreler, moleküler titreşimler ve nöron modelleri bu modelden doğar.",
    pre: ["phys.mech.work-energy", "math.trig.basics", "math.ode.linear-second~s"],
    q: [
      "Bir sarkacı Ay'a götürürsen periyodu ne olur? Bir yay–kütle sistemini götürürsen?",
      "Dünyanın içinden bir tünel kazıp bir taş bıraksan karşı uca ne kadar sürede ulaşır? Önce tahmin et.",
    ],
    cq: [
      "Herhangi bir potansiyel minimumu etrafında hareket neden harmoniktir?",
      "Periyot neden genliğe bağlı değildir ve bu ne zaman bozulur?",
      "Enerji kinetik ve potansiyel arasında nasıl paylaşılır?",
    ],
    obj: [
      "Potansiyel enerjinin ikinci türevinden küçük salınım frekansını türetir.",
      "Yay–kütle, basit sarkaç ve fiziksel sarkaç periyotlarını hesaplar.",
      "Salınımın faz ve genliğini başlangıç koşullarından belirler.",
    ],
    ev: "TURETME HESAPLAMA PROBLEM_COZME MODELLEME",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Sarkacın periyodunun kütleye bağlı olduğunu sanmak.",
      "Geniş açılı sarkacın da tam harmonik olduğunu varsaymak.",
    ],
    x: [
      "math.ode.linear-second:x'' + ω²x = 0 denkleminin fiziksel örneği",
      "math.calc.taylor:küçük salınım yaklaşımı potansiyelin ikinci derece Taylor açılımıdır",
      "neuro.comp.phase-plane:salınımların faz düzleminde gösterimi",
    ],
    ca: ["Küçük salınım frekansı bulma (olimpiyatların klasik sorusu)", "Bağlı yaylar ve karmaşık sarkaçlar"],
    rel: ["phys.mech.damped-driven", "phys.waves.basics", "phys.em.ac-rlc"],
    tags: ["salınım", "harmonik", "sarkaç"],
  })
  .o("phys.mech.damped-driven", "Sönümlü ve zorlanmış salınım, rezonans", {
    d: "Sönüm türleri (az, kritik, aşırı), zorlanmış salınımın kararlı durumu, rezonans eğrisi, kalite faktörü ve faz gecikmesi.",
    w: "Gerçek osilatörlerin davranışıdır; köprü titreşimlerinden radyo alıcılarına, MR cihazlarından nöronların frekans seçiciliğine kadar rezonans her yerdedir.",
    pre: ["phys.mech.oscillations", "math.ode.linear-second"],
    q: [
      "Salıncaktaki bir çocuğu en yükseğe çıkarmak için hangi sıklıkla itmelisin? Daha sık itmek neden işe yaramaz?",
      "Bir arabanın amortisörü 'çok iyi' sönümlerse yol konforu artar mı azalır mı?",
    ],
    cq: [
      "Kritik sönüm neden en hızlı dengeye dönüşü sağlar?",
      "Rezonans frekansında faz farkı neden 90°'dir?",
      "Kalite faktörü rezonansın genişliğini nasıl belirler?",
    ],
    obj: [
      "Sönümlü osilatörün üç rejimini karakteristik denklemden türetir.",
      "Zorlanmış salınımın genlik ve faz ifadesini karmaşık sayılarla türetir.",
      "Rezonans eğrisinin genişliğini Q faktörüyle ilişkilendirir ve veriden Q hesaplar.",
    ],
    ev: "TURETME MODELLEME HESAPLAMA SIMULASYON",
    t: "MODELLEME",
    lv: 4,
    sc: "M",
    mis: [
      "Rezonansta genliğin her zaman sonsuz olduğunu sanmak.",
      "Zorlanmış salınımın kendi doğal frekansında sürdüğünü düşünmek.",
    ],
    x: [
      "math.complex.numbers:karmaşık genlik yöntemi",
      "neuro.cell.cable:membranın RC filtre gibi davranması ve frekans tepkisi",
      "math.ode.linear-second:homojen olmayan denklemin özel çözümü",
    ],
    ca: ["Rezonans ve Q faktörü soruları", "Deneysel sınavda rezonans eğrisinden parametre çıkarma"],
    rel: ["phys.em.ac-rlc", "phys.waves.sound"],
    tags: ["sönüm", "rezonans", "zorlanmış"],
  })
  .o("phys.mech.fluids", "Akışkanlar mekaniği", {
    d: "Basınç, Pascal ve Arşimet ilkeleri, süreklilik denklemi, Bernoulli denklemi, viskozite ve yüzey gerilimine giriş.",
    w: "Kan dolaşımından uçak kanadına, hidrolik pistondan balık yüzücü kesesine kadar geniş bir uygulama alanını açar; olimpiyatlarda sık görülen kendi başına bir konudur.",
    pre: ["phys.mech.newton", "phys.mech.work-energy~s"],
    q: [
      "İçinde buz parçası yüzen bir bardak su ağzına kadar dolu. Buz eriyince taşar mı?",
      "Bir bardağın içindeki suya parmağını değmeden daldırırsan tartı ne gösterir?",
    ],
    cq: [
      "Kaldırma kuvveti nereden gelir?",
      "Bernoulli denklemi hangi varsayımlar altında geçerlidir?",
      "Viskozite ve Reynolds sayısı akışın karakterini nasıl belirler?",
    ],
    obj: [
      "Arşimet ilkesini basınç farkından türetir.",
      "Bernoulli denklemini enerji korunumundan türetir ve Torricelli sorusuna uygular.",
      "Yüzen cisimlerin dengesini ve küçük salınımlarını hesaplar.",
    ],
    ev: "TURETME PROBLEM_COZME ACIKLAMA",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Kaldırma kuvvetinin cismin ağırlığına bağlı olduğunu sanmak.",
      "Uçak kanadındaki kaldırmayı yalnızca 'eşit sürede buluşma' argümanıyla açıklamak.",
    ],
    x: [
      "bio.physiology.systems:kan akışı, basınç ve damar direnci",
      "math.ode.pde-intro:akışkan denklemleri kısmi diferansiyel denklemlerdir",
    ],
    ca: ["Kaldırma kuvveti ve tartı soruları", "Bernoulli ve Torricelli boşalma problemleri", "Yüzey gerilimi tahmin soruları"],
    rel: ["phys.thermo.kinetic-theory"],
    tags: ["akışkan", "basınç", "bernoulli"],
  })
  .o("phys.mech.lagrangian", "Lagrange mekaniği", {
    d: "Genelleştirilmiş koordinatlar, en az eylem ilkesi, Euler–Lagrange denklemleri, korunan nicelikler ve simetri ilişkisi.",
    w: "Kısıtlı sistemleri kuvvet hesaplamadan çözer; simetri–korunum ilişkisini (Noether) gösterir ve kuantum ile alan kuramlarının dilidir.",
    pre: ["phys.mech.oscillations", "phys.mech.angular-momentum~s", "math.calc.multivar"],
    q: [
      "Işık iki ortam arasında neden en kısa yolu değil, en kısa süreli yolu seçer? Doğa 'önceden hesap mı yapıyor'?",
      "Çift sarkacın denklemlerini kuvvetlerle yazmaya çalışsan kaç bilinmeyen kuvvetle uğraşman gerekir?",
    ],
    cq: [
      "Euler–Lagrange denklemleri en az eylem ilkesinden nasıl çıkar?",
      "Döngüsel koordinat neden bir korunan niceliğe karşılık gelir?",
      "Lagrange yöntemi Newton yönteminden ne zaman üstündür?",
    ],
    obj: [
      "Euler–Lagrange denklemlerini varyasyon hesabıyla türetir.",
      "Çift sarkaç ve eğik düzlemde kayan kama gibi sistemlerin hareket denklemlerini kurar.",
      "Döngüsel koordinatlardan korunan momentumları belirler ve Noether ilişkisini açıklar.",
    ],
    ev: "TURETME PROBLEM_COZME ISPAT",
    t: "TURETME",
    lv: 5,
    sc: "L",
    opt: true,
    ch: true,
    mis: [
      "Lagrange fonksiyonunun toplam enerji olduğunu sanmak (L = T − V).",
      "En az eylem ilkesinin eylemin her zaman minimum olmasını gerektirdiğini düşünmek (durağan olması yeterlidir).",
    ],
    x: [
      "math.calc.multivar:kısmi türevler ve zincir kuralı",
      "math.opt.optimization:varyasyonel ilke bir optimizasyon problemidir",
      "math.adv.abstract-algebra:simetri grupları ve korunum yasaları",
    ],
    ca: ["Kısıtlı sistemlerde hareket denklemi kurma (uluslararası düzey)", "Hareketli kama ve boncuk–tel problemlerinde hızlı çözüm"],
    ra: ["Robotik ve kontrol sistemlerinde hareket denklemleri", "Alan kuramlarında Lagrange yoğunluğu"],
    rel: ["phys.mech.angular-momentum", "phys.optics.geometric"],
    tags: ["lagrange", "varyasyon", "noether"],
  })
  .o("phys.mech.boss", "Boss: Mekanik sentezi", {
    d: "Momentum, enerji, dönme, kütle çekimi ve salınımı aynı anda gerektiren çok aşamalı problemlerden oluşan sentez sınavı.",
    w: "Gerçek olimpiyat problemleri tek bir konuda kalmaz; bu sentez hangi korunum yasasını ne zaman kullanacağını seçme becerini sınar.",
    pre: ["phys.mech.momentum", "phys.mech.angular-momentum", "phys.mech.oscillations", "phys.mech.gravitation~s"],
    q: [
      "Bir çubuğun ucuna çarpıp yapışan bir parçacık sorusunda hangi nicelikler korunur: momentum, açısal momentum, enerji? Neden hepsi değil?",
      "Bir problem ilk okumada 'çözülemez' göründüğünde ilk üç adımın ne olur?",
    ],
    cq: [
      "Bir problemde hangi korunum yasalarının geçerli olduğu nasıl hızlıca anlaşılır?",
      "Aynı problem farklı referans sistemlerinde nasıl basitleşir?",
      "Sonucun doğruluğu limit durumlar ve boyut analiziyle nasıl sağlanır?",
    ],
    obj: [
      "Çok aşamalı bir mekanik problemini alt evrelere ayırır ve her evre için korunan nicelikleri gerekçelendirir.",
      "Çözümünü limit durumlar ve boyut analiziyle sağlar.",
      "Kritik bir sonucu ilk ilkelerden türetir ve zaman sınırı altında yazılı çözüm sunar.",
    ],
    ev: "PROBLEM_COZME TURETME TRANSFER",
    t: "CHALLENGE",
    lv: 4,
    sc: "L",
    boss: true,
    mis: [
      "Çarpışma içeren her problemde enerjinin korunduğunu varsaymak.",
      "Tork alınan noktanın sabit olmasının gerektiğini unutmak.",
    ],
    x: ["comp.phys.theory-practice:olimpiyat kuramsal problemlerinin mekanik bölümü", "comp.meta.problem-solving:problemi evrelere ayırma stratejisi"],
    ca: ["Ulusal ve uluslararası olimpiyatların mekanik problemleri", "Zaman sınırlı deneme setleri"],
    rel: ["phys.olymp.boss"],
    tags: ["boss", "mekanik", "sentez"],
  })

  // ---------------------------------------------------------------------------
  .unit("Dalgalar ve termodinamik", "Dalgalar")
  .o("phys.waves.basics", "Dalgalar: yayılma, girişim, duran dalga", {
    d: "Dalga denklemi, dalga hızı, süperpozisyon, girişim, yansıma, duran dalgalar ve normal modlar.",
    w: "Ses, ışık, deprem ve kuantum dalga fonksiyonu aynı matematiği kullanır; normal modlar fikri fiziğin her alanında karşına çıkar.",
    pre: ["phys.mech.oscillations", "math.trig.identities~s"],
    q: [
      "İki dalga aynı noktada üst üste gelip birbirini yok ettiğinde enerjileri nereye gider?",
      "Gitar telini tam ortasından hafifçe dokunarak çaldığında temel ton neden kaybolur?",
    ],
    cq: [
      "Gergin ipte dalga hızı neye bağlıdır ve neden?",
      "Duran dalgaların frekansları sınır koşullarından nasıl belirlenir?",
      "Grup hızı ve faz hızı arasındaki fark nedir?",
    ],
    obj: [
      "Gergin ip için dalga denklemini Newton yasasından türetir.",
      "Farklı sınır koşullarında duran dalga frekanslarını hesaplar.",
      "Girişim desenlerinde yapıcı ve yıkıcı koşulları yol farkıyla yorumlar.",
    ],
    ev: "TURETME HESAPLAMA DIAGRAM",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Dalgada ortamın parçacıklarının dalgayla birlikte ilerlediğini sanmak.",
      "Yıkıcı girişimde enerjinin yok olduğunu düşünmek.",
    ],
    x: [
      "math.ode.pde-intro:dalga denklemi temel bir kısmi diferansiyel denklemdir",
      "math.fourier:her dalga biçimi sinüs bileşenlerine ayrılabilir",
      "neuro.sys.sensory:kokleada frekans analizi",
    ],
    ca: ["Duran dalga ve rezonans tüpü soruları", "Dalga hızı türetme problemleri"],
    rel: ["phys.waves.sound", "phys.optics.wave", "phys.modern.quantum-intro"],
    tags: ["dalga", "girişim", "duran-dalga"],
  })
  .o("phys.waves.sound", "Ses ve Doppler olayı", {
    d: "Ses dalgalarının doğası, ses şiddeti ve desibel, borularda rezonans, vuru ve Doppler olayı.",
    w: "İşitme, müzik, ultrason görüntüleme ve astronomide hız ölçümü bu konuya dayanır.",
    pre: ["phys.waves.basics"],
    q: [
      "Geçen bir ambulansın sireni neden yaklaşırken tiz, uzaklaşırken pes duyulur? Sen hareket ediyor olsaydın etki aynı mı olurdu?",
      "Ses şiddeti iki katına çıkınca desibel değeri de iki katına mı çıkar?",
    ],
    cq: [
      "Kaynak ve gözlemcinin hareketi frekansı neden farklı biçimde etkiler?",
      "Vuru frekansı nereden gelir?",
      "Logaritmik desibel ölçeği neden kullanılır?",
    ],
    obj: [
      "Hareketli kaynak ve gözlemci için Doppler formülünü türetir.",
      "Açık ve kapalı borularda rezonans frekanslarını hesaplar.",
      "Desibel farklarını şiddet oranına dönüştürür.",
    ],
    ev: "TURETME HESAPLAMA PROBLEM_COZME",
    t: "UYGULAMA",
    lv: 2,
    sc: "M",
    mis: [
      "Doppler olayında sesin hızının değiştiğini sanmak.",
      "Uzaklaşan kaynağın sesinin frekansının giderek azaldığını düşünmek (sabit hızda sabit kalır).",
    ],
    x: [
      "neuro.sys.sensory:işitme sistemi ve frekans algısı",
      "math.found.exp-log:desibel logaritmik bir ölçektir",
      "gk.art.music:aralıklar, armonikler ve akort",
    ],
    ca: ["Doppler ve yansıyan ses soruları", "Rezonans tüpüyle ses hızı ölçümü (deneysel)"],
    rel: ["phys.optics.wave"],
    tags: ["ses", "doppler", "rezonans"],
  })

  // ---------------------------------------------------------------------------
  .unit("Dalgalar ve termodinamik", "Termodinamik")
  .o("phys.thermo.temperature-heat", "Sıcaklık, ısı ve ısıl denge", {
    d: "Sıcaklık ölçekleri, öz ısı, hal değişimleri, ısı iletimi, taşınım ve ışıma ile ısıl genleşme.",
    w: "Enerji aktarımını günlük hayatla bağlar; iklim, yemek pişirme ve vücut sıcaklığı düzenlemesi buradan anlaşılır.",
    pre: ["phys.measure.units"],
    q: [
      "Aynı sıcaklıktaki metal bir sıra ile tahta sıradan hangisi daha soğuk hissettirir? Neden?",
      "Kaynayan suya ısı vermeye devam edince sıcaklığı neden artmaz?",
    ],
    cq: [
      "Isı ve sıcaklık arasındaki fark nedir?",
      "Isıl denge karışım problemlerinde nasıl kullanılır?",
      "Isı iletiminin hızı neye bağlıdır?",
    ],
    obj: [
      "Hal değişimi içeren karışım problemlerinde son sıcaklığı hesaplar.",
      "Isı ve sıcaklık kavramlarını günlük örneklerle ayırt eder.",
      "Katmanlı duvarlarda ısı iletimini elektrik direnci benzetmesiyle modeller.",
    ],
    ev: "HESAPLAMA ACIKLAMA MODELLEME",
    t: "KAVRAM",
    lv: 1,
    sc: "M",
    mis: [
      "Isının bir cismin içerdiği madde olduğunu sanmak.",
      "Metalin daha soğuk olduğu için soğuk hissettirdiğini düşünmek.",
    ],
    x: [
      "chem.thermo.thermochemistry:tepkime ısısı ve kalorimetri",
      "bio.physiology.systems:vücut sıcaklığının düzenlenmesi",
      "gk.geo.climate-change:enerji dengesi ve ışıma",
    ],
    ca: ["Kalorimetri ve hal değişimi soruları", "Isı iletimi tahmin problemleri"],
    rel: ["phys.thermo.kinetic-theory"],
    tags: ["ısı", "sıcaklık", "kalorimetri"],
  })
  .o("phys.thermo.kinetic-theory", "Gazların kinetik kuramı", {
    d: "İdeal gazın mikroskobik modeli, basıncın moleküler kökeni, sıcaklığın ortalama kinetik enerjiyle ilişkisi, eşbölüşüm ve hız dağılımı fikri.",
    w: "Makroskobik niceliklerin mikroskobik ortalamalardan çıktığını gösteren ilk örnektir; istatistiksel fiziğe ve kimyada tepkime hızlarına köprüdür.",
    pre: ["phys.thermo.temperature-heat", "phys.mech.momentum", "math.prob.random-vars~s"],
    q: [
      "Odadaki hava molekülleri saniyede yüzlerce metre hızla gidiyorsa açılan bir parfümün kokusu neden karşı köşeye dakikalar sonra ulaşır?",
      "Aynı sıcaklıkta hidrojen ve oksijen moleküllerinden hangisi daha hızlıdır? Kaç kat?",
    ],
    cq: [
      "Basınç moleküler çarpışmalardan nasıl türetilir?",
      "Sıcaklık neden ortalama kinetik enerjinin ölçüsüdür?",
      "Eşbölüşüm ilkesi gazların ısı sığasını nasıl açıklar?",
    ],
    obj: [
      "pV = (1/3)Nm⟨v²⟩ bağıntısını momentum aktarımından türetir.",
      "Kök ortalama kare hızı ve ortalama serbest yolu hesaplar.",
      "Eşbölüşüm ilkesiyle tek ve iki atomlu gazların ısı sığalarını tahmin eder.",
    ],
    ev: "TURETME HESAPLAMA TAHMIN",
    t: "TURETME",
    lv: 3,
    sc: "M",
    mis: [
      "Tüm moleküllerin aynı hızla hareket ettiğini sanmak.",
      "Sıcaklığın tek bir molekül için anlamlı olduğunu düşünmek.",
    ],
    x: [
      "chem.gas.laws:ideal gaz yasasının mikroskobik açıklaması",
      "math.prob.random-vars:ortalama ve varyans olarak hız dağılımı",
      "chem.kinetics:çarpışma kuramı ve tepkime hızı",
    ],
    ca: ["Kinetik kuramla basınç ve efüzyon soruları", "Ortalama serbest yol tahmini"],
    rel: ["phys.thermo.laws", "phys.thermo.stat-mech"],
    tags: ["kinetik-kuram", "ideal-gaz", "eşbölüşüm"],
  })
  .o("phys.thermo.laws", "Termodinamiğin yasaları ve entropi", {
    d: "Birinci yasa, iç enerji, PV diyagramındaki süreçler, ısı makineleri, Carnot verimi, ikinci yasa ve entropi.",
    w: "Enerjinin ne kadarının işe dönüşebileceğinin sınırını koyar; motorlardan buzdolaplarına, kimyasal kendiliğindenlikten canlıların enerji kullanımına kadar geçerlidir.",
    pre: ["phys.thermo.kinetic-theory", "phys.mech.work-energy"],
    q: [
      "Buzdolabının kapağını açık bırakırsan mutfak soğur mu ısınır mı?",
      "Hiç ısı kaybı olmayan mükemmel bir motor yakıt enerjisinin tamamını işe çevirebilir mi?",
    ],
    cq: [
      "Isı, iş ve iç enerji birbirine nasıl bağlıdır?",
      "Carnot verimi neden aşılamaz?",
      "Entropi neden ikinci yasanın doğal dilidir?",
    ],
    obj: [
      "İzotermal, adyabatik, izobarik ve izokorik süreçlerde iş ve ısıyı hesaplar.",
      "Adyabatik süreç için pVᵞ = sabit bağıntısını türetir.",
      "Carnot veriminin üst sınır olduğunu ikinci yasadan ispatlar.",
      "Tersinmez süreçlerde entropi değişimini hesaplar.",
    ],
    ev: "TURETME ISPAT HESAPLAMA PROBLEM_COZME",
    t: "KAVRAM",
    lv: 4,
    sc: "L",
    mis: [
      "Isının bir durum fonksiyonu olduğunu sanmak.",
      "Entropinin yalnızca 'düzensizlik' olduğunu ve her sistemde artmak zorunda olduğunu düşünmek (yalıtılmış sistemde artar).",
    ],
    x: [
      "chem.thermo.gibbs:kendiliğindenlik ve serbest enerji",
      "bio.energy.respiration:canlılarda enerji dönüşümünün verimi",
      "gk.world.industrial:buhar makineleri ve termodinamiğin doğuşu",
    ],
    ca: ["PV döngülerinde verim hesabı", "Adyabatik süreçler ve atmosfer soruları", "Entropi değişimi problemleri"],
    rel: ["phys.thermo.stat-mech"],
    tags: ["termodinamik", "entropi", "carnot"],
  })
  .o("phys.thermo.stat-mech", "İstatistiksel mekaniğe giriş: Boltzmann dağılımı", {
    d: "Mikrohal ve makrohal, S = k ln Ω, Boltzmann faktörü, bölüşüm fonksiyonu ve iki düzeyli sistemler.",
    w: "Termodinamiği olasılıktan türetir; kimyasal denge, iyon kanallarının açık olma olasılığı ve makine öğrenmesindeki enerji tabanlı modeller aynı Boltzmann faktörünü kullanır.",
    pre: ["phys.thermo.laws", "math.prob.distributions", "math.info.entropy~s"],
    q: [
      "Bir odadaki tüm hava moleküllerinin kendiliğinden bir köşede toplanması fiziksel olarak yasak mıdır, yoksa sadece çok mu olasılık dışıdır?",
      "Yüksek dağların tepesinde havanın seyrek olmasını tek bir üstel çarpanla açıklayabilir misin?",
    ],
    cq: [
      "Entropi neden mikrohal sayısının logaritmasıdır?",
      "Boltzmann faktörü nereden gelir?",
      "Bölüşüm fonksiyonundan ortalama enerji nasıl çıkarılır?",
    ],
    obj: [
      "Boltzmann dağılımını bir ısı banyosuyla temas eden sistem için türetir.",
      "İki düzeyli bir sistemin ortalama enerjisini ve ısı sığasını hesaplar.",
      "Barometrik formülü Boltzmann faktöründen türetir.",
    ],
    ev: "TURETME HESAPLAMA MODELLEME",
    t: "TURETME",
    lv: 4,
    sc: "L",
    mis: [
      "İkinci yasanın kesin bir yasak olduğunu, istatistiksel bir ifade olmadığını sanmak.",
      "Yüksek enerji durumlarının hiç dolmadığını düşünmek.",
    ],
    x: [
      "math.info.entropy:Gibbs ve Shannon entropisinin ortak biçimi",
      "neuro.cell.action-potential:iyon kanalı geçitlerinin Boltzmann eğrisi",
      "chem.equilibrium:denge sabiti ve Boltzmann faktörü",
      "prog.ml.neural-nets:softmax Boltzmann dağılımıdır",
    ],
    ca: ["İki düzeyli sistemler ve barometrik formül soruları (uluslararası olimpiyat)"],
    ra: ["Biyofizikte protein katlanması ve kanal kinetiği", "Enerji tabanlı makine öğrenmesi modelleri"],
    rel: ["phys.modern.quantum-intro"],
    tags: ["istatistiksel-mekanik", "boltzmann", "entropi"],
  })

  // ---------------------------------------------------------------------------
  .unit("Elektromanyetizma", "Elektrostatik ve devreler")
  .o("phys.em.charge-field", "Elektrik yükü, Coulomb yasası ve elektrik alan", {
    d: "Yükün korunumu ve kuantumlanması, Coulomb yasası, süperpozisyon, elektrik alan çizgileri ve sürekli yük dağılımlarının alanı.",
    w: "Kimyasal bağdan sinir hücresinin zarına kadar maddeyi bir arada tutan etkileşimin temelidir.",
    pre: ["phys.mech.newton", "math.geo.vectors"],
    q: [
      "Elektrik kuvveti kütle çekiminden çok daha güçlüyse neden günlük hayatta sürekli çekilip itilmiyoruz?",
      "Yüklü bir tarak nötr kâğıt parçalarını neden çeker?",
    ],
    cq: [
      "Alan kavramı uzaktan etkiyi nasıl yeniden tanımlar?",
      "Sürekli yük dağılımlarının alanı nasıl hesaplanır?",
      "Nötr cisimler neden elektrik alandan etkilenir?",
    ],
    obj: [
      "Noktasal yük sistemlerinin alanını süperpozisyonla hesaplar.",
      "Yüklü çubuk ve halkanın eksen üzerindeki alanını integralle türetir.",
      "Kutuplanma ile nötr cisimlerin çekilmesini açıklar.",
    ],
    ev: "HESAPLAMA TURETME DIAGRAM",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Alan çizgilerinin yüklü bir parçacığın izleyeceği yol olduğunu sanmak.",
      "Nötr cisimlerin elektrik alanla hiç etkileşmediğini düşünmek.",
    ],
    x: [
      "chem.bond.intermolecular:dipoller ve Coulomb etkileşimi",
      "neuro.cell.membrane-potential:iyonların elektrik alandaki hareketi",
      "math.calc.integral-apps:sürekli dağılımların alanı",
    ],
    ca: ["Süperpozisyon ve simetri soruları", "Yüklü halka ve çubuk alanı problemleri"],
    rel: ["phys.em.gauss", "phys.em.potential", "phys.mech.gravitation"],
    tags: ["elektrostatik", "coulomb", "alan"],
  })
  .o("phys.em.gauss", "Gauss yasası", {
    d: "Elektrik akısı, Gauss yasası, simetrik yük dağılımlarının alanı ve iletkenlerin elektrostatik özellikleri.",
    w: "Simetrik durumlarda integral hesabını tek satıra indirir; Maxwell denklemlerinden birincisidir.",
    pre: ["phys.em.charge-field", "math.calc.multiple-integrals~s"],
    q: [
      "Yüklü bir metal kürenin içindeki elektrik alan neden sıfırdır? Küre içi boş olsa ve içine bir yük koysan ne değişir?",
      "Sonsuz bir yüklü düzlemin alanı neden uzaklıkla azalmaz?",
    ],
    cq: [
      "Kapalı bir yüzeyden geçen akı neden yalnızca içteki yüke bağlıdır?",
      "Gauss yasası hangi durumlarda alanı hesaplamaya yeter?",
      "İletkende yük neden yüzeyde toplanır?",
    ],
    obj: [
      "Küresel, silindirik ve düzlemsel simetrili dağılımların alanını Gauss yasasıyla türetir.",
      "Coulomb yasasından Gauss yasasının integral biçimini ispatlar.",
      "İletken kabuk ve boşluk problemlerinde yük dağılımını belirler.",
    ],
    ev: "TURETME ISPAT PROBLEM_COZME",
    t: "TURETME",
    lv: 4,
    sc: "M",
    mis: [
      "Gauss yüzeyinin dışındaki yüklerin yüzeydeki alanı etkilemediğini sanmak (akıyı etkilemez, alanı etkiler).",
      "Gauss yasasının yalnızca simetrik durumlarda geçerli olduğunu düşünmek (her zaman geçerli, yalnızca simetride kullanışlı).",
    ],
    x: [
      "math.calc.vector-calc:diverjans teoremi ile diferansiyel biçim",
      "math.calc.multiple-integrals:yüzey integrali olarak akı",
    ],
    ca: ["Simetrik dağılımlarda alan hesabı", "İletken kabuklar ve görüntü yükü problemleri"],
    rel: ["phys.em.capacitance", "phys.em.maxwell"],
    tags: ["gauss", "akı", "simetri"],
  })
  .o("phys.em.potential", "Elektrik potansiyeli ve potansiyel enerji", {
    d: "Elektrik potansiyeli, eş potansiyel yüzeyler, alan ile potansiyel arasındaki gradyan ilişkisi ve yük sistemlerinin potansiyel enerjisi.",
    w: "Devrelerdeki gerilim, nöron zarındaki potansiyel farkı ve elektrokimyadaki hücre potansiyeli hep bu kavramdır.",
    pre: ["phys.em.charge-field", "phys.mech.work-energy"],
    q: [
      "Kuşlar yüksek gerilim hattına konunca neden çarpılmaz? Bir ayağını yere değdirse ne olurdu?",
      "Elektrik alanın sıfır olduğu bir noktada potansiyel de sıfır mı olmak zorundadır?",
    ],
    cq: [
      "Potansiyel ile potansiyel enerji arasındaki fark nedir?",
      "E = −∇V bağıntısı nasıl yorumlanır?",
      "Bir yük sistemini kurmak için gereken enerji nasıl hesaplanır?",
    ],
    obj: [
      "Noktasal ve sürekli dağılımların potansiyelini hesaplar.",
      "Eş potansiyel yüzeylerden alan yönünü ve büyüklüğünü yorumlar.",
      "Yük sistemlerinin elektrostatik potansiyel enerjisini hesaplar.",
    ],
    ev: "HESAPLAMA YORUMLAMA PROBLEM_COZME",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Alanın sıfır olduğu yerde potansiyelin de sıfır olduğunu sanmak.",
      "Gerilimin bir noktadaki mutlak bir değer olduğunu düşünmek (her zaman bir referansa göredir).",
    ],
    x: [
      "neuro.cell.membrane-potential:zar potansiyeli bir potansiyel farkıdır",
      "chem.redox-electrochem:elektrot potansiyelleri ve hücre gerilimi",
      "math.calc.multivar:gradyan",
    ],
    ca: ["Potansiyel enerji ve yük sistemleri soruları", "Yüklü parçacığın alanda hızlanması"],
    rel: ["phys.em.capacitance", "phys.em.circuits-dc"],
    tags: ["potansiyel", "gerilim", "enerji"],
  })
  .o("phys.em.capacitance", "İletkenler, kondansatörler ve dielektrikler", {
    d: "İletkenlerde yük dağılımı, sığa, seri–paralel kondansatörler, depolanan enerji ve dielektriklerin etkisi.",
    w: "Enerji depolayan devre elemanıdır; hücre zarı da bir kondansatör gibi davranır ve nöron modellerinin merkezindedir.",
    pre: ["phys.em.potential"],
    q: [
      "Yüklü bir kondansatörün plakalarını birbirinden uzaklaştırırsan depolanan enerji artar mı azalır mı? Pil bağlıyken sonuç değişir mi?",
      "Bir hücre zarı birkaç nanometre kalınlıkta. Bu ince yalıtkan tabakanın sığası büyük mü küçük mü olur, tahmin et.",
    ],
    cq: [
      "Sığa neden yalnızca geometriye ve malzemeye bağlıdır?",
      "Kondansatörde enerji nerede depolanır?",
      "Dielektrik malzeme sığayı neden artırır?",
    ],
    obj: [
      "Paralel plaka, küresel ve silindirik kondansatörlerin sığasını türetir.",
      "Seri ve paralel bağlı kondansatör ağlarını çözer.",
      "Elektrik alanın enerji yoğunluğunu hesaplar ve dielektrik etkisini yorumlar.",
    ],
    ev: "TURETME HESAPLAMA PROBLEM_COZME",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Kondansatörün yük 'depoladığını' sanmak (net yükü sıfırdır; enerji depolar).",
      "Seri bağlı kondansatörlerin sığalarının toplandığını düşünmek.",
    ],
    x: [
      "neuro.cell.membrane-potential:hücre zarının sığası",
      "neuro.comp.lif:LIF modelindeki membran kondansatörü",
    ],
    ca: ["Dielektrik yerleştirme ve plaka kaydırma soruları", "Kondansatör ağlarında enerji korunumu tuzakları"],
    rel: ["phys.em.rc-circuits"],
    tags: ["kondansatör", "sığa", "dielektrik"],
  })
  .o("phys.em.circuits-dc", "Doğru akım devreleri: Ohm ve Kirchhoff", {
    d: "Akım, direnç, Ohm yasası, seri–paralel bağlama, Kirchhoff kuralları, iç direnç ve güç.",
    w: "Her elektronik sistemin ve nöronların eşdeğer devre modellerinin temelidir; Kirchhoff kuralları korunum yasalarının devredeki hâlidir.",
    pre: ["phys.em.potential", "math.linalg.systems~s"],
    q: [
      "Evdeki lambaları seri bağlasaydık ne olurdu? Bir lamba yanınca diğerleri ne yapardı?",
      "Bir pilin uçlarına çok küçük bir direnç bağlarsan neden sınırsız akım akmaz?",
    ],
    cq: [
      "Kirchhoff kuralları hangi korunum yasalarından gelir?",
      "Karmaşık direnç ağları nasıl sistematik olarak çözülür?",
      "Bir kaynaktan en fazla güç ne zaman çekilir?",
    ],
    obj: [
      "Kirchhoff kurallarıyla çok çevreli devreleri doğrusal denklem sistemine dönüştürüp çözer.",
      "Simetri ve eş potansiyel noktaları kullanarak karmaşık direnç ağlarını sadeleştirir.",
      "Maksimum güç aktarımı koşulunu türetir.",
    ],
    ev: "PROBLEM_COZME HESAPLAMA DIAGRAM",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Akımın devrede 'harcandığını' sanmak.",
      "Pilin her zaman sabit akım verdiğini düşünmek.",
    ],
    x: [
      "math.linalg.systems:çevre akımları denklem sistemidir",
      "neuro.cell.membrane-potential:paralel iletkenlik modeli",
      "math.discrete.graph-theory:devre bir graftır",
    ],
    ca: ["Sonsuz direnç merdiveni ve küp direnç soruları", "Simetri ile devre sadeleştirme"],
    rel: ["phys.em.rc-circuits"],
    tags: ["devre", "kirchhoff", "ohm"],
  })
  .o("phys.em.rc-circuits", "RC devreleri", {
    d: "Kondansatörün dolması ve boşalması, zaman sabiti, üstel yaklaşım ve RC devrelerinin filtre davranışı.",
    w: "Zamanla değişen devrelere ilk adımdır; LIF nöron modeli tam olarak bir RC devresidir.",
    pre: ["phys.em.circuits-dc", "phys.em.capacitance", "math.ode.first-order"],
    q: [
      "Bir kondansatörü bir dirençle doldururken pilin verdiği enerjinin ne kadarı kondansatörde kalır? Direnç değerini değiştirmek bu oranı değiştirir mi?",
      "Fotoğraf makinesinin flaşı neden önce birkaç saniye 'şarj olur', sonra bir anda patlar?",
    ],
    cq: [
      "Zaman sabiti RC neyi belirler?",
      "Devre neden üstel olarak dengeye yaklaşır?",
      "Dolma sırasında enerjinin yarısı neden dirençte harcanır?",
    ],
    obj: [
      "Dolma ve boşalma için akım ve gerilim ifadelerini diferansiyel denklemden türetir.",
      "Zaman sabitini deneysel bir eğriden çıkarır.",
      "RC devresini LIF nöron modeline eşleyerek parametreleri yorumlar.",
    ],
    ev: "TURETME HESAPLAMA VERI_ANALIZI TRANSFER",
    t: "MODELLEME",
    lv: 3,
    sc: "M",
    mis: [
      "Kondansatörün bir zaman sabitinde tamamen dolduğunu sanmak (yaklaşık %63).",
      "Kondansatörden doğru akımın sürekli geçtiğini düşünmek.",
    ],
    x: [
      "neuro.comp.lif:LIF modeli bir RC devresine eşik eklenmiş hâlidir",
      "neuro.cell.cable:dendrit segmentleri RC zinciridir",
      "math.ode.first-order:doğrusal birinci mertebe denklem",
    ],
    ca: ["RC zaman sabiti ölçümü (deneysel sınav)", "Anahtar açılıp kapanan devre soruları"],
    ra: ["Nöron membranının elektriksel modellemesi"],
    rel: ["phys.em.ac-rlc"],
    tags: ["rc", "zaman-sabiti", "üstel"],
  })

  // ---------------------------------------------------------------------------
  .unit("Elektromanyetizma", "Manyetizma ve indüksiyon")
  .o("phys.em.magnetism", "Manyetik alan ve manyetik kuvvet", {
    d: "Lorentz kuvveti, yüklü parçacıkların manyetik alandaki hareketi, akım taşıyan tele kuvvet, Biot–Savart ve Ampère yasaları.",
    w: "Elektrik motorları, kütle spektrometresi, parçacık hızlandırıcıları ve MR görüntüleme manyetik kuvvete dayanır.",
    pre: ["phys.em.charge-field", "math.geo.vectors"],
    q: [
      "Manyetik kuvvet yüklü bir parçacığın hızını değiştirebilir mi? Peki kinetik enerjisini?",
      "Aynı yönde akım taşıyan iki paralel tel birbirini çeker mi iter mi? Tahmin et.",
    ],
    cq: [
      "Manyetik kuvvet neden iş yapmaz?",
      "Akımlar manyetik alanı nasıl oluşturur?",
      "Ampère yasası hangi simetrilerde kullanışlıdır?",
    ],
    obj: [
      "Yüklü parçacığın manyetik alandaki çembersel ve helisel yörüngesini hesaplar.",
      "Düz tel, halka ve selenoidin alanını Biot–Savart ve Ampère yasalarıyla türetir.",
      "Hız seçici ve kütle spektrometresinin çalışmasını açıklar.",
    ],
    ev: "TURETME HESAPLAMA PROBLEM_COZME",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Manyetik kuvvetin parçacığı alan çizgileri boyunca ittiğini sanmak.",
      "Manyetik alanın durgun yüklere de kuvvet uyguladığını düşünmek.",
    ],
    x: [
      "math.geo.vectors:F = qv × B dış çarpım",
      "neuro.methods.imaging:MR görüntülemenin fiziksel temeli",
    ],
    ca: ["Yüklü parçacık yörüngeleri ve hız seçici soruları", "Biot–Savart ile alan hesabı"],
    rel: ["phys.em.induction", "phys.mech.circular"],
    tags: ["manyetizma", "lorentz", "biot-savart"],
  })
  .o("phys.em.induction", "Elektromanyetik indüksiyon: Faraday ve Lenz", {
    d: "Manyetik akı, Faraday yasası, Lenz kuralı, hareketsel emk, öz ve karşılıklı indüktans, manyetik alanın enerjisi.",
    w: "Jeneratörler, transformatörler ve kablosuz şarj indüksiyonla çalışır; elektrik ve manyetizmanın birleştiği yerdir.",
    pre: ["phys.em.magnetism", "math.calc.derivative-def"],
    q: [
      "Bakır bir borunun içinden bırakılan mıknatıs neden yavaşça düşer? Plastik boruda ne olur?",
      "Bir halkayı sabit manyetik alanda döndürmeden ötelersen akım oluşur mu?",
    ],
    cq: [
      "İndüksiyon emk'sı akıdaki değişimle nasıl ilişkilidir?",
      "Lenz kuralı enerji korunumunu nasıl yansıtır?",
      "İndüktör devrede neden 'eylemsizlik' gibi davranır?",
    ],
    obj: [
      "Hareketli çubuk ve dönen halka için emk'yı türetir.",
      "Lenz kuralıyla indüklenen akımın yönünü belirler ve enerji dengesiyle gerekçelendirir.",
      "Selenoidin öz indüktansını ve depolanan enerjiyi hesaplar.",
    ],
    ev: "TURETME PROBLEM_COZME ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Akının büyük olmasının emk'yı büyüttüğünü sanmak (değişim hızı önemlidir).",
      "Lenz kuralının akının kendisine karşı koyduğunu düşünmek (değişime karşı koyar).",
    ],
    x: [
      "math.calc.derivative-def:emk akının zamana göre türevidir",
      "neuro.methods.electrophysiology:transkraniyal manyetik uyarım ilkesi",
    ],
    ca: ["Raylar üzerinde kayan çubuk ve terminal hız soruları", "Düşen mıknatıs ve girdap akımları", "Karşılıklı indüktans hesapları"],
    rel: ["phys.em.ac-rlc", "phys.em.maxwell"],
    tags: ["indüksiyon", "faraday", "lenz"],
  })
  .o("phys.em.ac-rlc", "Alternatif akım ve RLC devreleri", {
    d: "Sinüzoidal akım, empedans, fazörler, RLC devresinde rezonans, güç faktörü ve LC salınımı.",
    w: "Elektrik şebekesi ve radyo alıcıları AC devreleriyle çalışır; RLC devresi mekanik osilatörün birebir elektriksel eşidir.",
    pre: ["phys.em.induction", "phys.em.rc-circuits", "math.ode.linear-second", "math.complex.numbers~s"],
    q: [
      "Seri RLC devresinde kondansatörün ve bobinin üzerindeki gerilimler tek tek kaynak geriliminden büyük olabilir mi? Bu enerji korunumunu ihlal eder mi?",
      "Bir radyo yalnızca bir istasyonu nasıl seçer?",
    ],
    cq: [
      "Empedans neden karmaşık sayıyla en doğal biçimde ifade edilir?",
      "RLC devresi hangi frekansta rezonansa girer?",
      "Mekanik ve elektriksel osilatörler arasındaki eşleme nedir?",
    ],
    obj: [
      "Fazör yöntemiyle seri ve paralel RLC devrelerinin empedansını hesaplar.",
      "LC devresinin salınım frekansını diferansiyel denklemden türetir.",
      "RLC ile sönümlü mekanik osilatör arasındaki eşlemeyi kurar ve kullanır.",
    ],
    ev: "TURETME HESAPLAMA TRANSFER",
    t: "UYGULAMA",
    lv: 4,
    sc: "M",
    opt: true,
    mis: [
      "AC devresinde etkin değerlerin doğrudan toplandığını sanmak.",
      "Rezonansta devrede hiç enerji kaybı olmadığını düşünmek.",
    ],
    x: [
      "math.complex.numbers:fazörler karmaşık sayılardır",
      "neuro.comp.hh-model:HH modelindeki iletkenliklerin eşdeğer devresi",
      "math.ode.linear-second:aynı denklem, farklı fizik",
    ],
    ca: ["RLC rezonansı ve güç soruları", "Mekanik–elektrik eşlemesiyle çözüm"],
    rel: ["phys.mech.damped-driven"],
    tags: ["ac", "rlc", "empedans"],
  })
  .o("phys.em.maxwell", "Maxwell denklemleri ve elektromanyetik dalgalar", {
    d: "Dört Maxwell denkleminin integral ve diferansiyel biçimi, yer değiştirme akımı, elektromanyetik dalga denklemi ve ışık hızı.",
    w: "Elektrik, manyetizma ve optiği tek kurama bağlar; ışığın bir elektromanyetik dalga olduğu ve görelilik kuramının çıkış noktası buradadır.",
    pre: ["phys.em.induction", "phys.em.gauss", "math.calc.vector-calc", "phys.waves.basics"],
    q: [
      "Bir kondansatörün plakaları arasında yük akmıyorsa Ampère yasası orada neden bozulur? Maxwell bunu nasıl onardı?",
      "Elektrik ve manyetik sabitlerden bir hız elde edebilir misin? Sayısal değerini hesapla ve tanıdık bir sayıyla karşılaştır.",
    ],
    cq: [
      "Yer değiştirme akımı neden gereklidir?",
      "Dalga denklemi Maxwell denklemlerinden nasıl çıkar?",
      "Elektromanyetik dalga enerji ve momentum taşır mı?",
    ],
    obj: [
      "Maxwell denklemlerinden boşlukta elektromanyetik dalga denklemini türetir.",
      "Yer değiştirme akımının gerekliliğini yük korunumuyla ispatlar.",
      "Poynting vektörüyle ışınım şiddetini ve ışınım basıncını hesaplar.",
    ],
    ev: "TURETME ISPAT HESAPLAMA",
    t: "TURETME",
    lv: 5,
    sc: "L",
    ch: true,
    mis: [
      "Elektromanyetik dalgaların yayılmak için bir ortama ihtiyaç duyduğunu sanmak.",
      "Elektrik ve manyetik alanların dalgada birbirinin 'nedeni' olarak sırayla oluştuğunu düşünmek (birlikte salınırlar).",
    ],
    x: [
      "math.calc.vector-calc:diverjans ve rotasyonel ile diferansiyel biçim",
      "math.ode.pde-intro:dalga denklemi",
      "gk.sci-hist.modern-physics:Maxwell'in birleştirmesi ve göreliliğe giden yol",
    ],
    ca: ["Işınım basıncı ve Poynting vektörü soruları (uluslararası düzey)"],
    ra: ["Anten ve dalga kılavuzu tasarımı", "Biyolojik dokularda elektromanyetik alan modellemesi"],
    rel: ["phys.optics.wave", "phys.modern.relativity"],
    tags: ["maxwell", "em-dalga", "ışık"],
  })

  // ---------------------------------------------------------------------------
  .unit("Optik ve modern fizik", "Optik")
  .o("phys.optics.geometric", "Geometrik optik: yansıma, kırılma, mercekler", {
    d: "Yansıma ve kırılma yasaları, tam iç yansıma, aynalar, ince mercekler, optik aletler ve Fermat ilkesi.",
    w: "Göz, kamera, mikroskop ve teleskopun çalışması buradan anlaşılır; olimpiyatlarda kısa ama geometri yoğun sorular üretir.",
    pre: ["math.geo.euclid", "phys.waves.basics~s"],
    q: [
      "Havuzun dibi neden olduğundan daha sığ görünür? Kenardan bakınca daha mı sığ, tepeden bakınca mı?",
      "Düz bir aynada kendini boydan görmek için ayna en az ne kadar uzun olmalı? Aynadan uzaklaşmak bunu değiştirir mi?",
    ],
    cq: [
      "Snell yasası Fermat ilkesinden nasıl çıkar?",
      "İnce mercek denklemi hangi yaklaşımlara dayanır?",
      "Mikroskop ve teleskop büyütmeyi nasıl sağlar?",
    ],
    obj: [
      "Snell yasasını Fermat ilkesinden türetir.",
      "İnce mercek ve ayna sistemlerinde görüntü konumunu ve büyütmeyi ışın diyagramı ve hesapla bulur.",
      "Tam iç yansıma koşulunu hesaplar ve fiber optiğe uygular.",
    ],
    ev: "TURETME DIAGRAM HESAPLAMA",
    t: "UYGULAMA",
    lv: 2,
    sc: "M",
    mis: [
      "Merceğin yarısını kapatınca görüntünün yarısının kaybolacağını sanmak.",
      "Aynadaki görüntünün sağ–sol ters çevrildiğini düşünmek (ön–arka tersine döner).",
    ],
    x: [
      "math.geo.euclid:ışın geometrisi ve benzer üçgenler",
      "neuro.sys.sensory:gözün optiği ve retinada görüntü",
      "gk.sci-hist.ancient-medieval:İbn el-Heysem ve optiğin tarihi",
    ],
    ca: ["Mercek sistemleri ve görüntü soruları", "Kırılma ve görünür derinlik problemleri", "Deneysel sınavda odak uzaklığı ölçümü"],
    rel: ["phys.optics.wave", "phys.mech.lagrangian"],
    tags: ["optik", "mercek", "kırılma"],
  })
  .o("phys.optics.wave", "Dalga optiği: girişim ve kırınım", {
    d: "Young çift yarık deneyi, ince film girişimi, tek yarık ve kırınım ağı, çözünürlük sınırı ve kutuplanma.",
    w: "Işığın dalga doğasının kanıtıdır; mikroskopların çözünürlük sınırını, spektroskopiyi ve kuantum fiziğinin girişim deneylerini anlamayı sağlar.",
    pre: ["phys.waves.basics", "phys.optics.geometric~s"],
    q: [
      "Sabun köpüğü neden renkli görünür ve patlamadan hemen önce neden siyahlaşır?",
      "İki kat daha geniş açıklıklı bir teleskop iki kat daha yakın yıldızları ayırt edebilir mi?",
    ],
    cq: [
      "Girişim deseninin aralıkları neye bağlıdır?",
      "Kırınım optik aletlerin çözünürlüğünü nasıl sınırlar?",
      "Kutuplanma ışığın hangi özelliğini gösterir?",
    ],
    obj: [
      "Çift yarık ve kırınım ağında aydınlık saçak koşullarını türetir.",
      "İnce film girişiminde faz değişimini hesaba katarak renkleri tahmin eder.",
      "Rayleigh ölçütüyle açısal çözünürlüğü hesaplar.",
    ],
    ev: "TURETME HESAPLAMA DENEY",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Yarıklar daraldıkça kırınım deseninin de daraldığını sanmak.",
      "Yansımada her zaman faz değişimi olduğunu düşünmek.",
    ],
    x: [
      "math.fourier:kırınım deseni açıklığın Fourier dönüşümüdür",
      "neuro.methods.imaging:mikroskobide çözünürlük sınırı",
      "math.trig.identities:fazörlerin toplamı",
    ],
    ca: ["Çift yarık ve ince film soruları", "Deneysel sınavda kırınım ağıyla dalga boyu ölçümü"],
    rel: ["phys.modern.quantum-intro", "phys.em.maxwell"],
    tags: ["girişim", "kırınım", "dalga-optiği"],
  })

  // ---------------------------------------------------------------------------
  .unit("Optik ve modern fizik", "Modern fizik")
  .o("phys.modern.relativity", "Özel görelilik", {
    d: "Görelilik postulaları, eşzamanlılığın göreliliği, zaman genişlemesi, uzunluk büzülmesi, Lorentz dönüşümleri ve göreli enerji–momentum.",
    w: "Zaman ve uzay hakkındaki sezgilerimizi değiştirir; parçacık fiziği, GPS düzeltmeleri ve E = mc² bu kurama dayanır.",
    pre: ["phys.mech.kinematics-2d", "phys.mech.work-energy"],
    q: [
      "Işık hızına yakın giden bir trenin ön ve arka ucuna aynı anda yıldırım düşüyor. Trendeki yolcu için de 'aynı anda' mıdır?",
      "Atmosferin üst katmanlarında oluşan müonlar ömürleri çok kısa olmasına rağmen yere nasıl ulaşır?",
    ],
    cq: [
      "Işık hızının sabitliği eşzamanlılık kavramını nasıl yıkar?",
      "Lorentz dönüşümleri postulalardan nasıl türetilir?",
      "Göreli enerji ve momentum hangi bağıntıyla birbirine bağlıdır?",
    ],
    obj: [
      "Zaman genişlemesini ışık saati düşünce deneyiyle türetir.",
      "Lorentz dönüşümlerini uygulayarak olayların farklı çerçevelerdeki koordinatlarını hesaplar.",
      "Göreli enerji–momentum bağıntısını parçacık bozunması ve çarpışma problemlerinde kullanır.",
      "İkizler paradoksunu ivme ve eşzamanlılık üzerinden çözümler.",
    ],
    ev: "TURETME PROBLEM_COZME ACIKLAMA",
    t: "KAVRAM",
    lv: 4,
    sc: "L",
    mis: [
      "Zaman genişlemesinin saatlerin mekanik bir bozukluğu olduğunu sanmak.",
      "Kütlenin hızla 'arttığını' ve bunun ışık hızını aşmayı engelleyen tek şey olduğunu düşünmek.",
    ],
    x: [
      "gk.sci-hist.modern-physics:Einstein ve göreliliğin tarihsel bağlamı",
      "gk.phil.science:paradigma değişimi örneği",
      "math.linalg.linear-maps:Lorentz dönüşümü doğrusal bir dönüşümdür",
    ],
    ca: ["Göreli kinematik ve bozunma soruları", "Eşik enerjisi problemleri"],
    rel: ["phys.em.maxwell"],
    vs: ["phys.mech.kinematics-2d"],
    tags: ["görelilik", "lorentz", "uzay-zaman"],
  })
  .o("phys.modern.quantum-intro", "Kuantum fiziğine giriş", {
    d: "Fotoelektrik olay, foton, de Broglie dalga boyu, belirsizlik ilkesi, dalga fonksiyonu ve kutudaki parçacık.",
    w: "Atomların, kimyasal bağların, yarı iletkenlerin ve lazerlerin davranışı ancak kuantum fiziğiyle açıklanır.",
    pre: ["phys.waves.basics", "phys.mech.work-energy", "math.complex.numbers~s", "math.prob.basics~s"],
    q: [
      "Elektronlar çift yarıktan tek tek gönderilirse ekranda yine girişim deseni oluşur mu? Hangi yarıktan geçtiğine bakarsan ne olur?",
      "Kırmızı ışığın şiddetini ne kadar artırırsan artır bazı metallerden elektron koparamıyorsun. Bu dalga modelinde neden şaşırtıcıdır?",
    ],
    cq: [
      "Fotoelektrik olay ışığın hangi özelliğini kanıtlar?",
      "Belirsizlik ilkesi ölçüm hatası mıdır, yoksa doğanın bir özelliği mi?",
      "Sınırlandırılmış parçacığın enerjisi neden kesiklidir?",
    ],
    obj: [
      "Fotoelektrik olay verisinden Planck sabitini ve iş fonksiyonunu hesaplar.",
      "Kutudaki parçacığın enerji düzeylerini duran dalga koşulundan türetir.",
      "Belirsizlik ilkesiyle atom boyutu ve sıfır noktası enerjisi gibi büyüklükleri tahmin eder.",
    ],
    ev: "TURETME HESAPLAMA TAHMIN ACIKLAMA",
    t: "KAVRAM",
    lv: 4,
    sc: "L",
    mis: [
      "Belirsizlik ilkesinin yalnızca ölçüm aletlerinin kusurundan kaynaklandığını sanmak.",
      "Elektronun atomda gezegen gibi belirli bir yörüngede döndüğünü düşünmek.",
    ],
    x: [
      "chem.atoms.electron-config:orbitaller ve kuantum sayıları",
      "math.complex.numbers:dalga fonksiyonu karmaşık değerlidir",
      "gk.sci-hist.modern-physics:kuantum kuramının doğuşu",
    ],
    ca: ["Fotoelektrik ve de Broglie soruları", "Belirsizlik ilkesiyle büyüklük tahmini"],
    ra: ["Kuantum hesaplama ve kuantum biyolojisine giriş"],
    rel: ["phys.modern.atomic-nuclear", "phys.optics.wave", "phys.thermo.stat-mech"],
    tags: ["kuantum", "foton", "belirsizlik"],
  })
  .o("phys.modern.atomic-nuclear", "Atom ve çekirdek fiziği", {
    d: "Hidrojen atomu ve Bohr modeli, spektrum çizgileri, çekirdek yapısı, bağlanma enerjisi, radyoaktif bozunma, fisyon ve füzyon.",
    w: "Yıldızların enerjisini, tıbbi görüntülemeyi, radyometrik tarihlemeyi ve nükleer enerjiyi anlamanın temelidir.",
    pre: ["phys.modern.quantum-intro"],
    q: [
      "Çekirdekteki protonlar birbirini itiyorsa çekirdek neden dağılmaz?",
      "Hem ağır çekirdekleri bölmek hem de hafif çekirdekleri birleştirmek nasıl enerji açığa çıkarabilir?",
    ],
    cq: [
      "Hidrojen spektrumu neden kesikli çizgilerden oluşur?",
      "Nükleon başına bağlanma enerjisi eğrisi neyi açıklar?",
      "Radyoaktif bozunma neden üstel bir yasaya uyar?",
    ],
    obj: [
      "Bohr modelinden hidrojen enerji düzeylerini türetir ve spektral çizgileri hesaplar.",
      "Kütle eksikliğinden bağlanma enerjisini hesaplar.",
      "Yarı ömür ve aktivite hesaplarını üstel bozunma yasasıyla yapar.",
    ],
    ev: "TURETME HESAPLAMA PROBLEM_COZME",
    t: "UYGULAMA",
    lv: 4,
    sc: "M",
    mis: [
      "Yarı ömür sonunda tüm çekirdeklerin bozunduğunu sanmak.",
      "Tek bir çekirdeğin ne zaman bozunacağının önceden bilinebileceğini düşünmek.",
    ],
    x: [
      "chem.atoms.structure:atom modeli ve izotoplar",
      "math.found.exp-log:üstel bozunma",
      "math.prob.stochastic:radyoaktif bozunma bir Poisson sürecidir",
      "neuro.methods.imaging:PET görüntülemede pozitron yayınlanması",
    ],
    ca: ["Spektrum ve Bohr modeli soruları", "Bağlanma enerjisi ve bozunma zincirleri"],
    rel: ["phys.mech.angular-momentum"],
    tags: ["atom", "çekirdek", "radyoaktivite"],
  })

  // ---------------------------------------------------------------------------
  .unit("Deney ve hesaplama", "Deney ve hesaplama")
  .o("phys.lab.experimental", "Deneysel fizik: ölçüm, hata analizi ve grafik", {
    d: "Deney tasarımı, rastgele ve sistematik hata, hata yayılımı, doğrusallaştırma, en küçük kareler uydurma ve deney raporu.",
    w: "Olimpiyatlarda puanın önemli bir kısmı deneysel sınavdan gelir; aynı beceriler her laboratuvar araştırmasının temelidir.",
    pre: ["phys.measure.units", "math.stat.descriptive", "math.stat.regression~s"],
    q: [
      "Bir sarkacın periyodunu kronometreyle ölçerken tek salınım mı, yirmi salınım mı ölçmek daha doğrudur? Neden?",
      "Verin bir parabol gibi görünüyor. Hangi eksenleri değiştirerek onu doğruya çevirebilirsin?",
    ],
    cq: [
      "Rastgele ve sistematik hata nasıl ayırt edilir ve nasıl azaltılır?",
      "Doğrusal olmayan bir ilişkiden parametre çıkarmak için hangi grafik çizilmeli?",
      "Uydurmanın eğimi ve belirsizliği nasıl hesaplanır?",
    ],
    obj: [
      "Doğrusal olmayan bir bağıntıyı doğrusallaştırıp grafiğin eğiminden fiziksel bir sabiti belirsizliğiyle hesaplar.",
      "Bir deneyde baskın hata kaynağını belirler ve ölçüm stratejisini buna göre tasarlar.",
      "Ölçüm, grafik ve sonuçtan oluşan kısa bir deney raporu yazar.",
    ],
    ev: "DENEY VERI_ANALIZI HESAPLAMA YORUMLAMA",
    t: "DENEY",
    lv: 3,
    sc: "L",
    mis: [
      "Daha çok anlamlı basamak yazmanın daha doğru ölçüm demek olduğunu sanmak.",
      "Grafikteki tüm noktaların doğru üzerinden geçmesi gerektiğini düşünmek.",
    ],
    x: [
      "math.stat.regression:en küçük kareler uydurma",
      "res.method.experimental-design:deney tasarımı ve kontrol",
      "res.data.visualization:bilimsel grafik çizimi",
    ],
    ca: ["Olimpiyat deneysel sınavları", "Grafik doğrusallaştırma ve belirsizlik hesabı"],
    ra: ["Her deneysel araştırma projesinde veri analizi"],
    rel: ["phys.measure.units", "phys.comp.simulation"],
    tags: ["deney", "hata-analizi", "grafik"],
  })
  .o("phys.comp.simulation", "Hesaplamalı fizik: sayısal simülasyon", {
    d: "Hareket denklemlerini sayısal olarak çözme, Euler ve Verlet yöntemleri, zaman adımı seçimi, enerji korunumu denetimi ve çok cisim simülasyonları.",
    w: "Analitik çözümü olmayan sistemleri (çift sarkaç, üç cisim, nöron ağları) keşfetmeyi sağlar; modern fizik araştırmasının üçüncü ayağıdır.",
    pre: ["math.ode.numerical", "prog.python.numpy", "phys.mech.newton"],
    q: [
      "Bir gezegen yörüngesini basit Euler yöntemiyle simüle edersen gezegen birkaç tur sonra ne yapar? Önce tahmin et, sonra dene.",
      "Zaman adımını yarıya indirmek hatayı yarıya mı indirir, dörtte bire mi?",
    ],
    cq: [
      "Sayısal yöntemin hatası zaman adımına nasıl bağlıdır?",
      "Bazı yöntemler neden enerjiyi uzun sürede daha iyi korur?",
      "Bir simülasyonun doğru olduğuna nasıl güvenebiliriz?",
    ],
    obj: [
      "Eğik atış, yay ve yörünge problemlerini Euler ve Verlet yöntemleriyle kodlar.",
      "Simülasyonu analitik çözüm ve korunum yasalarıyla doğrular.",
      "Hava direnci gibi analitik olarak zor bir etkiyi simülasyonla inceler ve sonucu yorumlar.",
    ],
    ev: "KODLAMA SIMULASYON YORUMLAMA",
    t: "KODLAMA",
    lv: 3,
    sc: "L",
    mis: [
      "Daha küçük zaman adımının her zaman daha iyi sonuç verdiğini sanmak (yuvarlama hatası ve maliyet).",
      "Simülasyonun güzel görünmesinin doğru olduğunu kanıtladığını düşünmek.",
    ],
    x: [
      "prog.sci.simulation:genel simülasyon teknikleri",
      "neuro.proj.hh-simulation:aynı sayısal yöntemlerle nöron modeli",
      "math.ode.numerical:Euler ve Runge–Kutta",
    ],
    ra: ["Moleküler dinamik ve gök mekaniği simülasyonları", "Hesaplamalı nörobilim modelleri"],
    ca: ["Programlama ile desteklenen araştırma projesi yarışmaları"],
    rel: ["phys.lab.experimental", "phys.mech.gravitation"],
    tags: ["simülasyon", "sayısal", "python"],
  })
  .o("phys.olymp.estimation", "Fermi tahmini ve boyut analiziyle akıl yürütme", {
    d: "Kaba büyüklük tahmini, ölçekleme yasaları, boyut analizi ve limit durum denetimiyle hızlı fiziksel akıl yürütme.",
    w: "Bir problemi çözmeden önce cevabın büyüklüğünü bilmek hataları yakalar; olimpiyatlarda ve araştırmada 'mantıklı mı?' sorusunun cevabıdır.",
    pre: ["phys.measure.units", "math.found.exp-log~s"],
    q: [
      "İstanbul'da kaç piyano akortçusu vardır? Hiç veri aramadan bir aralık ver ve varsayımlarını yaz.",
      "Bir fil neden bir pire kadar yükseğe zıplayamaz? Ölçekleme ile açıkla.",
    ],
    cq: [
      "Bir büyüklüğü bir kat doğrulukla tahmin etmek için hangi varsayımlar yeterlidir?",
      "Ölçekleme yasaları canlıların ve yapıların boyutlarını nasıl sınırlar?",
      "Limit durumlar bir sonucun doğruluğunu nasıl sınar?",
    ],
    obj: [
      "Bir Fermi problemini alt tahminlere ayırır ve sonucu bir mertebe içinde verir.",
      "Boyut analiziyle bilinmeyen bir bağıntıyı türetir ve sınar.",
      "Bir çözümü limit durumlar ve uç değerlerle denetler.",
    ],
    ev: "TAHMIN TURETME PROBLEM_COZME",
    t: "BECERI",
    lv: 2,
    sc: "S",
    mis: [
      "Tahminin 'sallamak' olduğunu ve kesin veri olmadan değersiz olduğunu sanmak.",
      "Her ara adımı çok kesin hesaplamanın tahmini iyileştirdiğini düşünmek.",
    ],
    x: [
      "bio.ecology:ölçekleme yasaları ve metabolizma",
      "media.lit.stats-in-news:haberlerdeki sayıların makul olup olmadığını sınama",
      "math.found.exp-log:logaritmik ölçekte düşünme",
    ],
    ca: ["Olimpiyatlarda tahmin soruları", "Çözüm sağlaması için limit durum denetimi"],
    rel: ["phys.measure.units"],
    tags: ["fermi", "tahmin", "ölçekleme"],
  })
  .o("phys.olymp.boss", "Boss: Fizik olimpiyatı tam problem seti", {
    d: "Mekanik, elektromanyetizma, termodinamik, optik ve tahmin sorularını birleştiren, gerçek sınav koşullarında çözülen tam olimpiyat seti.",
    w: "Konuları ayrı ayrı bilmekten tek bir uzun problemin farklı bölümlerini zaman baskısı altında birleştirmeye geçişi sağlar.",
    pre: ["phys.mech.boss", "phys.em.induction", "phys.thermo.laws", "phys.optics.geometric", "phys.olymp.estimation"],
    q: [
      "Bir problemin a, b, c şıklarından ilkini çözemezsen sonrakilerde hâlâ puan alabilir misin? Nasıl bir strateji izlersin?",
      "Bir sınavda hangi soruya ilk başlayacağına nasıl karar verirsin?",
    ],
    cq: [
      "Uzun ve çok bölümlü bir problem nasıl okunur ve planlanır?",
      "Farklı konular tek bir fiziksel durumda nasıl birleşir?",
      "Zaman sınırı altında kısmi puan nasıl en çoğa çıkarılır?",
    ],
    obj: [
      "Zaman sınırlı tam bir problem setini çözer ve çözümünü okunur biçimde yazar.",
      "Farklı konuları birleştiren bir problemde gerekli ilkeleri seçer ve türetir.",
      "Kendi çözümünü resmi çözümle karşılaştırarak hata defterine analiz yazar.",
    ],
    ev: "PROBLEM_COZME TURETME TRANSFER TAHMIN",
    t: "CHALLENGE",
    lv: 5,
    sc: "XL",
    boss: true,
    ch: true,
    mis: [
      "İlk bölüm çözülmeden sonraki bölümlere geçilemeyeceğini sanmak.",
      "Çözümün yalnızca son sayının doğru olmasıyla puanlandığını düşünmek.",
    ],
    x: [
      "comp.phys.theory-practice:olimpiyat kuramsal pratik",
      "comp.meta.exam-strategy:zaman yönetimi ve soru seçimi",
      "comp.boss.mock:tam deneme sınavı simülasyonu",
    ],
    ca: ["Ulusal fizik olimpiyatı aşamaları", "Uluslararası fizik olimpiyatı ve bölgesel olimpiyatlar", "Geçmiş yıl soru setleriyle deneme"],
    rel: ["phys.mech.boss"],
    tags: ["boss", "olimpiyat", "sentez"],
  })
  .done();
