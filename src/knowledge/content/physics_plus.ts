import { builder } from "../dsl";

export const PHYSICS_PLUS = builder("FIZIK")
  // ---------------------------------------------------------------------------
  .unit("Elektromanyetizma", "Elektrostatik ve devreler")
  .o("phys.em.circuits-intro", "Basit devreler: akım, gerilim, direnç (giriş)", {
    d: "Akımın yük akışı, gerilimin birim yük başına enerji, direncin akıma karşı koyma olarak tanımı; Ohm yasası, seri ve paralel bağlı dirençler, ampermetre ve voltmetrenin bağlanışı.",
    w: "Her elektrik ve elektronik konusunun dilidir; Kirchhoff kuralları, RC devreleri ve nöron zarının devre modeli bu temelin üzerine kurulur.",
    pre: ["phys.measure.units", "phys.em.charge-field~s"],
    q: [
      "Bir pile tek ampul yerine iki özdeş ampulü seri bağlarsan ampuller daha mı parlak, daha mı sönük yanar? Paralel bağlarsan? Önce tahmin et.",
      "Bir anahtarı açtığında ampul neredeyse anında yanar, ama elektronlar kablo içinde saniyede milimetreler mertebesinde ilerler. Bu nasıl olabilir?",
    ],
    cq: [
      "Akım, gerilim ve direnç arasındaki ilişki nedir?",
      "Seri ve paralel bağlamada akım ve gerilim nasıl paylaşılır?",
      "Ölçü aletleri devreye nasıl ve neden öyle bağlanır?",
    ],
    obj: [
      "Seri, paralel ve karışık direnç ağlarında eşdeğer direnci ve kol akımlarını hesaplar.",
      "Bir devre şemasını doğru sembollerle çizer ve ampermetre ile voltmetreyi doğru yere yerleştirir.",
      "Ampul parlaklığının bağlantı türüyle nasıl değiştiğini güç üzerinden tahmin eder ve gerekçelendirir.",
    ],
    ev: "HESAPLAMA DIAGRAM TAHMIN DENEY",
    t: "KAVRAM",
    lv: 1,
    sc: "M",
    mis: [
      "Akımın devrede 'harcandığını', ampulden sonra azaldığını sanmak.",
      "Pilin sabit akım verdiğini düşünmek (yaklaşık sabit olan gerilimdir).",
      "Paralel kol eklemenin toplam direnci artırdığını sanmak.",
    ],
    x: [
      "neuro.cell.membrane-potential:zarın direnç ve pil (Nernst potansiyeli) olarak devre modeli",
      "cs.algo.logic-gates:mantık kapılarının anahtarlı devrelerle gerçekleştirilmesi",
    ],
    rel: ["phys.em.circuits-dc", "phys.em.potential"],
    tags: ["devre", "ohm", "akim", "gerilim"],
  })
  // ---------------------------------------------------------------------------
  .unit("Mekanik", "Kinematik ve dinamik")
  .o("phys.mech.relative-motion", "Bağıl hareket ve referans sistemleri", {
    d: "Konum, hız ve ivmenin gözlemciye göre değişimi; Galileo dönüşümü ve hız toplama, akıntıda yüzücü ve rüzgârda uçak problemleri, eylemsiz referans sistemleri.",
    w: "Bir problemi doğru referans sisteminde çözmek çoğu zaman hesabı yarıya indirir; çarpışmalar, yörüngeler ve görelilik bu fikre dayanır.",
    pre: ["phys.mech.kinematics-2d"],
    q: [
      "Nehri en kısa sürede geçmek isteyen bir yüzücü karşıya doğru mu yüzmeli, yoksa akıntıya karşı açılı mı? Peki en kısa yoldan geçmek isterse?",
      "Yağmur dikey yağıyor; koşarsan ıslanma açın değişir mi? Şemsiyeyi nasıl eğmelisin?",
    ],
    cq: [
      "Hızlar farklı gözlemciler arasında nasıl dönüştürülür?",
      "Hangi referans sistemleri eylemsizdir ve bu neden önemlidir?",
    ],
    obj: [
      "Bağıl hız problemlerini vektör diyagramıyla kurar ve bileşenlerle çözer.",
      "Bir problemi hesabı kolaylaştıran referans sistemine taşır ve sonucu yer sistemine geri çevirir.",
      "Galileo hız toplamasının ışık hızına yakın hızlarda neden geçersiz olduğunu açıklar.",
    ],
    ev: "PROBLEM_COZME DIAGRAM ACIKLAMA",
    t: "BECERI",
    lv: 2,
    sc: "S",
    mis: [
      "Hareketin 'gerçek' hızının tek olduğunu, gözlemciden bağımsız olduğunu sanmak.",
      "En kısa sürede geçmekle en kısa yoldan geçmeyi aynı strateji sanmak.",
    ],
    x: [
      "math.geo.vectors:hız toplamanın vektör toplamı olması",
      "space.sky.observation:gökyüzü hareketlerinin Dünya'nın dönen sisteminden görünüşü",
    ],
    rel: ["phys.modern.relativity", "phys.mech.momentum"],
    tags: ["bagil-hareket", "referans-sistemi", "galileo"],
  })
  .o("phys.mech.energy-systems", "Sistemlerde enerji: korunumlu kuvvetler ve potansiyel enerji grafikleri", {
    d: "Korunumlu ve korunumsuz kuvvetler, F = −dU/dx ilişkisi, potansiyel enerji eğrilerinden denge noktaları, dönüm noktaları ve kararlılığın okunması; sürtünmeli sistemlerde enerji muhasebesi.",
    w: "Bir U(x) grafiğine bakarak hareketi denklemi çözmeden öngörmeyi sağlar; moleküler bağlar, yörüngeler ve salınımlar aynı dille incelenir.",
    pre: ["phys.mech.work-energy", "math.calc.derivative-def~s"],
    q: [
      "Bir tepenin üstündeki top ile bir çukurun dibindeki top: ikisinde de net kuvvet sıfır. Hangisi gerçekten 'dengede'dir? Farkı bir grafikte nasıl görürsün?",
      "Bir bilyeyi bir kâse içinde bırakıyorsun; kâsenin kenarından hiç taşabilir mi? Hangi bilgiyle kesin karar verirsin?",
    ],
    cq: [
      "Bir kuvvetin korunumlu olduğu nasıl anlaşılır ve potansiyel enerji neden yalnızca onlar için tanımlıdır?",
      "U(x) grafiğinden kuvvet, denge ve hareket bölgeleri nasıl okunur?",
      "Korunumsuz kuvvetler varken enerji nasıl izlenir?",
    ],
    obj: [
      "Korunumlu bir kuvvet için U(x)'i F(x)'ten türetir ve F = −dU/dx ilişkisini kanıtlar.",
      "Bir potansiyel enerji grafiğinde kararlı, kararsız denge noktalarını ve verilen toplam enerji için izinli bölgeleri belirler.",
      "Sürtünmeli bir sistemde mekanik enerji kaybını iç enerjiye aktarım olarak hesaplar.",
      "Kararlı denge yakınındaki küçük salınımların frekansını U''(x) üzerinden tahmin eder.",
    ],
    ev: "TURETME YORUMLAMA HESAPLAMA PROBLEM_COZME",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Net kuvvetin sıfır olduğu her noktayı kararlı denge sanmak.",
      "Potansiyel enerjinin sıfır noktasının fiziksel bir anlamı olduğunu düşünmek.",
      "Sürtünmenin enerjiyi 'yok ettiğini' sanmak.",
    ],
    x: [
      "chem.bond.bonding:bağ uzunluğunun potansiyel enerji eğrisinin minimumu olması",
      "math.dyn.stability:denge noktalarının kararlılık analizi",
    ],
    rel: ["phys.mech.oscillations", "phys.mech.gravitation"],
    tags: ["enerji", "potansiyel", "denge", "korunumlu-kuvvet"],
  })
  // ---------------------------------------------------------------------------
  .unit("Dalgalar ve termodinamik", "Termodinamik")
  .o("phys.thermo.heat-transfer", "Isı iletimi, taşınım ve ışınım", {
    d: "İletimde Fourier yasası ve ısıl direnç, taşınımda akışkan hareketi, ışınımda Stefan–Boltzmann yasası ve siyah cisim; yalıtım ve soğuma problemleri.",
    w: "Bir evin yalıtımından gezegenlerin sıcaklığına, vücut ısısının korunmasından elektronik soğutmaya kadar enerji akışını sayısal olarak tahmin etmeyi sağlar.",
    pre: ["phys.thermo.temperature-heat"],
    q: [
      "Aynı oda sıcaklığındaki bir metal kaşık ile tahta kaşıktan hangisi daha soğuk hissettirir? Gerçekten daha mı soğuktur?",
      "Termos şişesi sıcak çayı nasıl sıcak, soğuk suyu nasıl soğuk tutar? Üç ısı aktarım yolunu nasıl keser?",
    ],
    cq: [
      "Üç ısı aktarım mekanizması hangi koşullarda baskın olur?",
      "Katmanlı bir duvardan geçen ısı akısı nasıl hesaplanır?",
      "Bir cismin ışınımla yaydığı güç sıcaklığa nasıl bağlıdır?",
    ],
    obj: [
      "Katmanlı bir yüzeyde ısıl dirençleri seri toplayarak ısı akısını hesaplar.",
      "Stefan–Boltzmann yasasıyla bir cismin yaydığı gücü ve denge sıcaklığını hesaplar.",
      "Günlük bir ısı kaybı durumunda baskın mekanizmayı ayırt eder ve azaltmak için bir önlem önerir.",
    ],
    ev: "HESAPLAMA MODELLEME ACIKLAMA DENEY",
    t: "UYGULAMA",
    lv: 2,
    sc: "M",
    mis: [
      "Dokununca soğuk hissedilen cismin sıcaklığının daha düşük olduğunu sanmak (ısı iletkenliği farkıdır).",
      "Işınımın yalnızca çok sıcak cisimlerden yayıldığını düşünmek.",
    ],
    x: [
      "earth.atm.structure:Dünya'nın ışınım enerji dengesi",
      "env.energy.resources:binalarda enerji verimliliği ve yalıtım",
      "space.stars.life:yıldız ışınımı ve sıcaklık",
    ],
    rel: ["phys.thermo.laws", "phys.thermo.kinetic-theory"],
    tags: ["isi-iletimi", "tasinim", "isinim", "stefan-boltzmann"],
  })
  .o("phys.thermo.engines", "Isı makineleri ve verim", {
    d: "Isı makinesi, buzdolabı ve ısı pompası çevrimleri; P–V diyagramlarında iş, Carnot verimi ve ikinci yasanın getirdiği sınır; gerçek motorların verim kayıpları.",
    w: "Enerji santrallerinden araç motorlarına, buzdolaplarından ısı pompalarına kadar 'enerjinin ne kadarı işe dönüşebilir?' sorusunun kesin sınırını verir.",
    pre: ["phys.thermo.laws"],
    q: [
      "Kapısı açık bırakılmış bir buzdolabı kapalı bir odayı soğutur mu, ısıtır mı? Neden?",
      "Bir ısı makinesinin verimini %100'e çıkarmak için mühendislere sınırsız bütçe verilse başarabilirler mi?",
    ],
    cq: [
      "Bir ısı makinesinin verimi neden ikinci yasayla sınırlıdır?",
      "Carnot verimi nasıl türetilir ve neye bağlıdır?",
      "Isı pompası neden harcadığı elektrikten daha fazla ısı taşıyabilir?",
    ],
    obj: [
      "İdeal gaz için Carnot çevriminin verimini adım adım türetir.",
      "Bir P–V diyagramında çevrimin yaptığı net işi ve alınan, verilen ısıları hesaplar.",
      "Buzdolabı ve ısı pompası için performans katsayısını hesaplar ve verimle karşılaştırır.",
      "Gerçek bir motorun veriminin Carnot sınırından neden düşük kaldığını açıklar.",
    ],
    ev: "TURETME HESAPLAMA YORUMLAMA ACIKLAMA",
    t: "TURETME",
    lv: 4,
    sc: "M",
    mis: [
      "Daha iyi mühendislikle her ısı makinesinin %100 verime yaklaşabileceğini sanmak.",
      "Performans katsayısının 1'den büyük olmasının enerji korunumunu çiğnediğini düşünmek.",
    ],
    x: [
      "env.energy.resources:santral verimi ve atık ısı",
      "chem.thermo.gibbs:entropi ve kendiliğinden olma ölçütü",
      "gk.world.industrial:buhar makinesinin sanayi devrimindeki rolü",
    ],
    ca: ["Fizik olimpiyatlarında çevrim verimi ve P–V diyagramı problemleri"],
    rel: ["phys.thermo.stat-mech", "phys.thermo.kinetic-theory"],
    tags: ["isi-makinesi", "carnot", "verim", "entropi"],
  })
  // ---------------------------------------------------------------------------
  .unit("Optik ve modern fizik", "Modern fizik")
  .o("phys.modern.photoelectric", "Fotoelektrik olay ve foton", {
    d: "Metal yüzeyden ışıkla elektron sökülmesi; eşik frekansı, iş fonksiyonu, durdurma potansiyeli ve Einstein'ın E = hf foton açıklaması; dalga modelinin neden yetmediği.",
    w: "Işığın parçacık yönünü gösteren temel deneydir; güneş pilleri, fotoçoğaltıcılar, kamera sensörleri ve spektroskopi bu fikre dayanır.",
    pre: ["phys.modern.quantum-intro~s", "phys.em.potential"],
    q: [
      "Çok parlak kırmızı ışık bir metalden elektron sökemiyor, ama sönük morötesi ışık sökebiliyor. Işık bir dalga ise bu nasıl olabilir?",
      "Işığın şiddetini iki katına çıkarırsan sökülen elektronların en büyük kinetik enerjisi ne olur? Tahmin et.",
    ],
    cq: [
      "Fotoelektrik deney sonuçları dalga modelinin hangi öngörüleriyle çelişir?",
      "Durdurma potansiyeli, frekans ve iş fonksiyonu nasıl ilişkilidir?",
    ],
    obj: [
      "Enerji korunumundan eV₀ = hf − φ ilişkisini türetir.",
      "Durdurma potansiyeli–frekans verisinden Planck sabitini ve iş fonksiyonunu grafikle bulur.",
      "Şiddet ve frekans değişimlerinin akım ve en büyük kinetik enerji üzerindeki etkisini tahmin eder.",
    ],
    ev: "TURETME VERI_ANALIZI TAHMIN HESAPLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Işık şiddetini artırmanın elektronların enerjisini artırdığını sanmak (yalnızca sayısını artırır).",
      "Fotonu küçük bir bilye gibi, klasik bir parçacık olarak düşünmek.",
    ],
    x: [
      "chem.analysis.spectroscopy:foton enerjisi ve madde ile etkileşim",
      "gk.sci-hist.modern-physics:kuantum fikrinin doğuşu",
      "env.energy.resources:güneş pillerinin çalışma ilkesi",
    ],
    rel: ["phys.modern.atomic-nuclear", "phys.optics.wave"],
    vs: ["phys.optics.wave"],
    tags: ["fotoelektrik", "foton", "kuantum", "planck"],
  })
  .o("phys.modern.nuclear-energy", "Çekirdek enerjisi: fisyon ve füzyon", {
    d: "Bağlanma enerjisi eğrisi ve kütle açığı, E = mc² ile açığa çıkan enerji; fisyon zincir tepkimesi, kritik kütle, reaktör denetimi; füzyon koşulları ve yıldızlarda enerji üretimi.",
    w: "Yıldızların neden parladığını, nükleer santrallerin nasıl çalıştığını ve enerji politikası tartışmalarının fiziksel temelini anlamaya yarar.",
    pre: ["phys.modern.atomic-nuclear"],
    q: [
      "Hem ağır bir çekirdeği bölmek hem de hafif çekirdekleri birleştirmek enerji açığa çıkarıyor. Bu çelişki gibi görünüyor; nasıl ikisi de doğru olabilir?",
      "Füzyon neden Güneş'in merkezinde kendiliğinden oluyor da yeryüzünde gerçekleştirmesi bu kadar zor?",
    ],
    cq: [
      "Nükleon başına bağlanma enerjisi eğrisi fisyon ve füzyonu nasıl açıklar?",
      "Zincir tepkimesi nasıl sürer ve nasıl denetlenir?",
      "Füzyon için hangi koşullar gereklidir?",
    ],
    obj: [
      "Bir fisyon ya da füzyon tepkimesinde kütle açığından açığa çıkan enerjiyi hesaplar.",
      "Bağlanma enerjisi eğrisini yorumlayarak hangi tepkimelerin enerji vereceğini tahmin eder.",
      "Bir reaktörde moderatör ve denetim çubuklarının rolünü açıklar.",
    ],
    ev: "HESAPLAMA YORUMLAMA TAHMIN ACIKLAMA",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Nükleer tepkimelerde kütlenin 'yok olup' enerjiye dönüştüğünü, kimyasal tepkimelerde ise bunun hiç olmadığını sanmak.",
      "Nükleer santralin bir bomba gibi patlayabileceğini düşünmek.",
    ],
    x: [
      "space.stars.life:yıldızlarda füzyon ve enerji üretimi",
      "env.energy.resources:nükleer enerjinin artıları ve atık sorunu",
      "chem.nuclear:radyoaktif bozunma ve çekirdek tepkimeleri",
    ],
    rel: ["phys.modern.relativity", "phys.modern.particles"],
    tags: ["fisyon", "fuzyon", "baglanma-enerjisi", "nukleer"],
  })
  .o("phys.modern.particles", "Parçacık fiziğine giriş", {
    d: "Temel parçacıklar ve Standart Model'in genel yapısı: kuarklar, leptonlar, dört temel etkileşim ve aracı parçacıklar; korunum yasalarıyla tepkimelerin olabilirliğini denetleme.",
    w: "Maddenin en küçük yapı taşlarını ve modern fiziğin sınırını tanıtır; korunum yasalarını bir 'muhasebe' aracı olarak kullanmayı öğretir.",
    pre: ["phys.modern.atomic-nuclear"],
    q: [
      "Proton ve nötronun kütlesi neredeyse aynı. Biri 'temel', diğeri 'bileşik' midir, yoksa ikisi de mi bileşiktir? Bunu nasıl anlarız?",
      "Bir parçacık tepkimesi yazdın: enerji korunuyor ama yük korunmuyor. Bu tepkime gerçekleşebilir mi?",
    ],
    cq: [
      "Standart Model'deki parçacık aileleri ve etkileşimler nelerdir?",
      "Hangi korunum yasaları bir tepkimenin mümkün olup olmadığını belirler?",
    ],
    obj: [
      "Bir parçacık tepkimesinin yük, baryon ve lepton sayısı korunumunu sağlayıp sağlamadığını denetler.",
      "Hadronları kuark bileşimlerinden yük hesabıyla oluşturur.",
      "Dört temel etkileşimi menzil, göreli şiddet ve aracı parçacık açısından karşılaştırır.",
    ],
    ev: "PROBLEM_COZME ACIKLAMA HESAPLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "S",
    opt: true,
    mis: [
      "Elektron ve protonun aynı anlamda 'temel' parçacık olduğunu sanmak.",
      "Antimaddenin yalnızca bilimkurguda var olduğunu düşünmek.",
    ],
    x: [
      "math.adv.abstract-algebra:simetri ve korunum yasalarının grup kuramı dili",
      "gk.phil.science:gözlenemeyen varlıklar ve kuramların doğrulanması",
    ],
    rel: ["phys.modern.nuclear-energy", "phys.modern.relativity"],
    tags: ["parcacik", "standart-model", "kuark", "korunum"],
  })
  .done();
