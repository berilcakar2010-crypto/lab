import { builder } from "../dsl";

export const EARTH = builder("YER_UZAY")
  // ---------------------------------------------------------------------------
  .unit("Yer bilimleri", "Katı yer")
  .o("earth.geo.structure", "Yerin iç yapısı ve levha tektoniği", {
    d: "Yerin katmanları (kabuk, manto, dış ve iç çekirdek), litosfer–astenosfer ayrımı ve levhaların ıraksak, yakınsak ve dönüşüm sınırlarındaki hareketi.",
    w: "Depremleri, volkanları, dağ kuşaklarını ve kıtaların dağılımını tek bir çerçevede açıklar; Yer'e dair diğer konuların çoğu bu modelin üzerine kurulur.",
    pre: ["phys.mech.newton~h", "gk.geo.physical~s"],
    q: [
      "Kimse Yer'in 100 km'den derinine kazmadı. Öyleyse çekirdeğin sıvı bir dış katmanı olduğunu nereden biliyoruz? Bir yöntem öner.",
      "Afrika'nın batı kıyısı ile Güney Amerika'nın doğu kıyısı yapboz gibi uyuyor. Bu tek başına kıtaların hareket ettiğini kanıtlar mı?",
    ],
    cq: [
      "Yerin katmanları kimyasal bileşime göre ve mekanik davranışa göre nasıl farklı biçimde ayrılır?",
      "Levhaları hareket ettiren süreçler nelerdir ve hangi kanıtlar bu hareketi destekler?",
      "Üç levha sınırı türünde hangi yer şekilleri ve olaylar beklenir?",
    ],
    obj: [
      "Yerin katmanlarını bileşim ve mekanik özelliklere göre ayrı ayrı sınıflandırır.",
      "Levha tektoniği için paleomanyetik, sismik ve fosil kanıtlarını değerlendirir.",
      "Bir haritadaki levha sınırını türüne göre tanımlar ve beklenen yer şekillerini tahmin eder.",
    ],
    ev: "ACIKLAMA DIAGRAM YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Mantonun tamamen erimiş magma olduğunu sanmak (manto büyük ölçüde katıdır, uzun zamanda akar).",
      "Levhaların yalnızca kıtalardan oluştuğunu düşünmek.",
    ],
    x: [
      "phys.mech.fluids:manto konveksiyonu çok yüksek viskoziteli akışkan davranışıdır",
      "gk.geo.turkey:Anadolu'nun aktif tektonik konumu",
    ],
    ra: ["GPS ölçümleriyle levha hızlarının belirlenmesi"],
    rel: ["earth.geo.earthquakes", "earth.geo.volcanoes"],
    tags: ["tektonik", "yer-ici", "levha"],
  })
  .o("earth.geo.rocks", "Mineraller, kayaçlar ve kayaç döngüsü", {
    d: "Mineralin tanımı ve kristal yapısı; magmatik, tortul ve metamorfik kayaçların oluşumu ve aralarındaki dönüşümü anlatan kayaç döngüsü.",
    w: "Bir kayacı okuyabilmek, geçmiş ortamları (deniz tabanı, volkan, dağ kökü) yeniden kurmanı sağlar; kaynak arama ve jeolojik tarihleme de buna dayanır.",
    pre: ["earth.geo.structure", "chem.bond.bonding~s"],
    q: [
      "Granitteki iri kristaller ile bazalttaki çok küçük kristaller aynı tür magmadan gelmiş olabilir mi? Kristal boyutunu ne belirler?",
      "Bir dağın tepesinde deniz kabuğu fosili içeren kireçtaşı bulunuyor. Bu kayacın hikâyesini adım adım anlat.",
    ],
    cq: [
      "Bir minerali kayaçtan ayıran nedir?",
      "Üç kayaç türü hangi koşullarda oluşur ve birbirine nasıl dönüşür?",
      "Doku (kristal boyutu, katmanlanma) kayacın geçmişi hakkında ne söyler?",
    ],
    obj: [
      "Mineralleri sertlik, dilinim ve parlaklık gibi özelliklerle ayırt eder.",
      "Bir kayacı dokusuna bakarak magmatik, tortul ya da metamorfik olarak sınıflandırır ve gerekçelendirir.",
      "Kayaç döngüsünü enerji kaynaklarıyla birlikte diyagram olarak çizer.",
    ],
    ev: "DIAGRAM YORUMLAMA ACIKLAMA DENEY",
    t: "KAVRAM",
    lv: 1,
    sc: "M",
    mis: [
      "Kayaç döngüsünün sabit bir sırayla (magmatik → tortul → metamorfik) ilerlediğini sanmak.",
      "Metamorfik kayaçların erimiş olduğunu düşünmek (metamorfizma katı hâlde olur).",
    ],
    x: [
      "chem.bond.bonding:minerallerin kristal yapısı ve bağ türleri",
      "chem.solutions:tortul kayaçlarda çözünme ve çökelme",
    ],
    rel: ["earth.geo.deep-time"],
    tags: ["mineral", "kayac", "kayac-dongusu"],
  })
  .o("earth.geo.earthquakes", "Depremler, sismik dalgalar ve deprem riski", {
    d: "Fay mekaniği ve elastik geri sekme; P, S ve yüzey dalgaları, deprem merkezinin üç istasyonla bulunması, büyüklük (logaritmik ölçek) ile şiddet ayrımı ve risk kavramı.",
    w: "Türkiye gibi aktif bir bölgede deprem riskini sayılarla düşünmeyi sağlar; sismik dalgalar aynı zamanda Yer'in iç yapısını bildiğimiz başlıca araçtır.",
    pre: ["earth.geo.structure", "phys.waves.basics"],
    q: [
      "Bir istasyona P dalgası S dalgasından 20 saniye önce ulaşıyor. Depremin ne kadar uzakta olduğunu bulmak için başka neye ihtiyacın var?",
      "Büyüklüğü 1 birim artan bir depremde açığa çıkan enerji kabaca kaç kat artar? Önce tahmin et.",
    ],
    cq: [
      "P ve S dalgaları neden farklı hızlarda yayılır ve S dalgaları neden sıvı dış çekirdekten geçemez?",
      "Episantr üçgenlemeyle nasıl bulunur?",
      "Deprem tehlikesi, maruziyet ve hasar görebilirlik risk hesabında nasıl birleşir?",
    ],
    obj: [
      "P–S varış zaman farkından istasyon–episantr uzaklığını hesaplar.",
      "Üç istasyonun verisiyle episantrın yerini harita üzerinde üçgenleme ile bulur.",
      "Logaritmik büyüklük ölçeğinde enerji oranlarını hesaplar ve büyüklük ile şiddeti ayırt eder.",
      "Bir yerleşim için deprem riskini etkileyen etkenleri gerekçeli biçimde değerlendirir.",
    ],
    ev: "HESAPLAMA PROBLEM_COZME YORUMLAMA",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Büyüklük ile şiddetin aynı şey olduğunu sanmak (şiddet yere ve hasara bağlıdır).",
      "Depremlerin kesin tarihle tahmin edilebildiğini düşünmek (olasılıksal tehlike tahmini yapılır).",
    ],
    x: [
      "math.found.exp-log:büyüklük ölçeği logaritmiktir",
      "math.prob.distributions:deprem oluşumunun olasılıksal modellenmesi",
      "gk.geo.turkey:Türkiye'deki fay hatları ve deprem tehlikesi",
    ],
    ra: ["Sismik ağ verisiyle deprem konumu belirleme"],
    ca: ["Yer bilimleri olimpiyatlarında episantr ve dalga soruları"],
    rel: ["earth.geo.structure"],
    tags: ["deprem", "sismik-dalga", "risk"],
  })
  .o("earth.geo.volcanoes", "Volkanizma ve dağ oluşumu", {
    d: "Magmanın oluşumu (basınç düşmesi, su eklenmesi, ısınma), magma viskozitesinin patlama türünü belirlemesi, sıcak noktalar ve levha çarpışmasıyla dağ oluşumu (orojenez).",
    w: "Hangi volkanın neden patlayıcı olduğunu ve dağ kuşaklarının neden belirli yerlerde dizildiğini açıklar; volkan tehlike değerlendirmesinin temelidir.",
    pre: ["earth.geo.structure"],
    q: [
      "Manto büyük ölçüde katıysa magma nereden geliyor? Sıcaklığı artırmadan bir kayacı eritmenin yolu olabilir mi?",
      "Hawaii volkanları akıcı lav akıtırken bazı volkanlar neden şiddetle patlar?",
    ],
    cq: [
      "Magma hangi üç yolla oluşur ve her biri hangi levha ortamına karşılık gelir?",
      "Silika içeriği ve gaz miktarı patlama biçimini nasıl etkiler?",
      "Dağlar levha çarpışmasında nasıl yükselir ve neden zamanla aşınır?",
    ],
    obj: [
      "Magma oluşum mekanizmalarını levha ortamlarıyla eşleştirir.",
      "Magma bileşiminden volkanın patlama türünü tahmin eder ve gerekçelendirir.",
      "Sıcak nokta zincirindeki yaş dağılımından levha hareketinin yönünü ve hızını kestirir.",
    ],
    ev: "ACIKLAMA TAHMIN HESAPLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "S",
    mis: [
      "Tüm volkanların levha sınırlarında olduğunu sanmak (sıcak noktalar levha içindedir).",
      "Lavın sıcaklığının patlama türünü tek başına belirlediğini düşünmek.",
    ],
    x: [
      "chem.gas.laws:magmadaki gazların basınç düşünce genleşmesi",
      "phys.mech.fluids:viskozitenin akış ve patlama davranışına etkisi",
    ],
    rel: ["earth.geo.earthquakes", "earth.geo.rocks"],
    tags: ["volkan", "magma", "orojenez"],
  })
  .o("earth.geo.deep-time", "Jeolojik zaman, fosiller ve radyometrik tarihleme", {
    d: "Göreli tarihleme ilkeleri (üst üste gelme, kesişme), fosillerin oluşumu ve korelasyon, radyoaktif bozunma ile mutlak yaş hesabı ve jeolojik zaman ölçeği.",
    w: "Milyonlarca yılı ölçülebilir kılar; evrimi, iklim geçmişini ve kayaç döngüsünü zaman ekseninde birleştirir.",
    pre: ["earth.geo.rocks", "phys.modern.atomic-nuclear~s", "math.found.exp-log"],
    q: [
      "Bir kayaçtaki ana izotopun yalnızca dörtte biri kaldı. Yarılanma ömrünü biliyorsan kayacın yaşını hesaplamadan önce kaç yarılanma geçtiğini söyleyebilir misin?",
      "Karbon-14 ile bir dinozor kemiğini tarihlemek neden işe yaramaz?",
    ],
    cq: [
      "Göreli tarihleme hangi mantıksal ilkelere dayanır?",
      "Üstel bozunmadan yaş formülü nasıl elde edilir ve hangi varsayımlar gerekir?",
      "Hangi izotop sistemi hangi yaş aralığına uygundur?",
    ],
    obj: [
      "Bir jeolojik kesitteki olayları göreli tarihleme ilkeleriyle sıralar.",
      "Üstel bozunma yasasından t = (t½/ln2)·ln(1 + D/P) yaş bağıntısını türetir ve uygular.",
      "Bir izotop sistemini örneğin yaşına ve türüne göre seçer, kapalı sistem varsayımını eleştirir.",
    ],
    ev: "TURETME HESAPLAMA YORUMLAMA",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Karbon-14'ün her fosili tarihlemede kullanıldığını sanmak.",
      "Yarılanma ömründen sonra her bir atomun 'yarısının' bozunduğunu düşünmek.",
    ],
    x: [
      "math.found.exp-log:radyoaktif bozunma üstel fonksiyondur",
      "bio.evolution:fosil kaydı ve evrimin zaman ölçeği",
      "phys.modern.atomic-nuclear:bozunma türleri ve yarılanma ömrü",
    ],
    rel: ["earth.geo.rocks"],
    tags: ["jeolojik-zaman", "fosil", "radyometrik"],
  })

  // ---------------------------------------------------------------------------
  .unit("Yer bilimleri", "Atmosfer ve okyanus")
  .o("earth.atm.structure", "Atmosferin yapısı ve enerji dengesi", {
    d: "Atmosferin katmanları ve sıcaklık profili, bileşimi, Güneş ışınımının soğurulması ve yansıtılması (albedo), sera etkisi ve Yer'in ışınım dengesi.",
    w: "Hava, iklim ve hava kirliliğinin hepsi bu enerji bütçesinin sonucudur; sera etkisini sayılarla açıklayabilmek iklim tartışmalarını değerlendirmeyi mümkün kılar.",
    pre: ["phys.thermo.temperature-heat", "gk.geo.physical~s"],
    q: [
      "Atmosfer olmasaydı Yer'in ortalama sıcaklığı bugünkünden daha mı soğuk olurdu, daha mı sıcak? Bir sayı tahmin et.",
      "Yükseldikçe hava soğuyor; ama stratosferde yükseldikçe ısınıyor. Bunun nedeni ne olabilir?",
    ],
    cq: [
      "Atmosfer katmanları sıcaklık profiline göre nasıl ayrılır?",
      "Gelen ve giden ışınım arasındaki denge Yer'in sıcaklığını nasıl belirler?",
      "Sera gazları hangi dalga boylarını soğurur ve bu neden önemlidir?",
    ],
    obj: [
      "Stefan–Boltzmann yasası ve albedo ile atmosfersiz Yer'in denge sıcaklığını türetir.",
      "Sıcaklık profilinden atmosfer katmanlarını belirler ve her katmandaki ısınma nedenini açıklar.",
      "Basit tek katmanlı sera modelini kurar ve sınırlarını tartışır.",
    ],
    ev: "TURETME HESAPLAMA MODELLEME",
    t: "MODELLEME",
    lv: 3,
    sc: "M",
    mis: [
      "Sera etkisinin ozon tabakasındaki delikten kaynaklandığını sanmak.",
      "Sera gazlarının gelen Güneş ışığını tuttuğunu düşünmek (asıl soğurulan, Yer'in yaydığı kızılötesidir).",
    ],
    x: [
      "phys.thermo.laws:enerji korunumu ve ışınım dengesi",
      "chem.bond.bonding:molekül titreşimleri ve kızılötesi soğurma",
      "gk.geo.climate-change:sera etkisinin iklim tartışmasındaki yeri",
    ],
    rel: ["earth.atm.weather", "earth.atm.climate-system"],
    tags: ["atmosfer", "sera-etkisi", "enerji-dengesi"],
  })
  .o("earth.atm.weather", "Hava olayları: basınç, rüzgâr, cepheler", {
    d: "Basınç farkı, Coriolis etkisi ve sürtünmeyle rüzgâr; nem, adyabatik soğuma ve bulut oluşumu; hava kütleleri, cepheler ve alçak–yüksek basınç sistemleri.",
    w: "Bir hava durumu haritasını okuyup ertesi günü kabaca tahmin etmeyi sağlar; akışkan mekaniğinin gündelik en büyük laboratuvarıdır.",
    pre: ["earth.atm.structure", "phys.mech.fluids~s"],
    q: [
      "Rüzgâr neden doğrudan yüksek basınçtan alçak basınca esmiyor da kuzey yarımkürede alçak basıncın etrafında saat yönünün tersine dönüyor?",
      "Yükselen bir hava parseli hiç ısı vermeden neden soğur?",
    ],
    cq: [
      "Rüzgârı belirleyen kuvvetler nelerdir?",
      "Bulut ve yağış oluşumu için hangi koşullar gerekir?",
      "Soğuk ve sıcak cephe geçişlerinde hava nasıl değişir?",
    ],
    obj: [
      "Basınç gradyanı ve Coriolis kuvvetinin dengesini bir sinoptik harita üzerinde çizer.",
      "Kuru adyabatik soğuma oranıyla yoğuşma yüksekliğini kabaca hesaplar.",
      "Bir hava durumu haritasından cephe geçişini ve beklenen hava olaylarını tahmin eder.",
    ],
    ev: "DIAGRAM HESAPLAMA TAHMIN YORUMLAMA",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Coriolis etkisinin lavabodaki suyun dönüş yönünü belirlediğini sanmak.",
      "Bulutun su buharı olduğunu düşünmek (bulut yoğuşmuş damlacık ve buz kristalidir).",
    ],
    x: [
      "phys.mech.circular:dönen referans sisteminde Coriolis ivmesi",
      "phys.thermo.kinetic-theory:adyabatik genleşme ve sıcaklık",
      "math.ode.numerical:sayısal hava tahmini modelleri",
    ],
    rel: ["earth.ocean.circulation"],
    tags: ["hava", "ruzgar", "cephe"],
  })
  .o("earth.ocean.circulation", "Okyanus akıntıları ve iklimle etkileşim", {
    d: "Rüzgârla sürülen yüzey akıntıları ve okyanus girdapları, yoğunluk (sıcaklık–tuzluluk) farkıyla oluşan termohalin dolaşım, yukarı çıkma (upwelling) ve okyanus–atmosfer etkileşimine örnek olarak El Niño.",
    w: "Okyanus ısıyı ekvatordan kutuplara taşır ve karbonu depolar; kıyı iklimlerini ve balıkçılığı anlamak için gereklidir.",
    pre: ["earth.atm.structure", "phys.mech.fluids~s"],
    q: [
      "Aynı enlemde olmalarına rağmen Batı Avrupa kıyıları neden Kanada'nın doğu kıyısından belirgin biçimde daha ılımandır?",
      "Tuzlu ve soğuk su batar. Kutuplarda deniz buzu oluşurken çevredeki suyun yoğunluğuna ne olur?",
    ],
    cq: [
      "Yüzey akıntılarını ve derin dolaşımı farklı süreçler nasıl sürer?",
      "Okyanus ısıyı ve karbonu nasıl taşır ve depolar?",
      "El Niño olayında okyanus ve atmosfer birbirini nasıl etkiler?",
    ],
    obj: [
      "Yüzey akıntılarını rüzgâr kuşakları ve kıta konumlarıyla ilişkilendirerek harita üzerinde açıklar.",
      "Sıcaklık ve tuzluluğun yoğunluğa etkisini kullanarak termohalin dolaşımın itici gücünü açıklar.",
      "Deniz yüzeyi sıcaklığı verisini yorumlayarak El Niño koşullarını tanımlar.",
    ],
    ev: "ACIKLAMA YORUMLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Okyanus akıntılarının yalnızca rüzgârla oluştuğunu sanmak.",
      "Okyanusun iklim değişikliğinde pasif bir 'su deposu' olduğunu düşünmek.",
    ],
    x: [
      "phys.thermo.temperature-heat:suyun yüksek ısı sığası ve ısı taşınımı",
      "chem.solutions:tuzluluk ve yoğunluk; CO₂'nin suda çözünmesi",
      "bio.ecology:yukarı çıkma bölgelerinde verimlilik",
    ],
    rel: ["earth.atm.weather", "earth.atm.climate-system"],
    tags: ["okyanus", "akinti", "el-nino"],
  })
  .o("earth.atm.climate-system", "İklim sistemi ve geri beslemeler", {
    d: "Hava ile iklimin ayrımı; atmosfer, okyanus, buz, kara ve canlıların etkileşimi; buz–albedo ve su buharı gibi geri beslemeler, iklim duyarlılığı ve geçmiş iklimlerin vekil verilerle (buz karotları, tortular) okunması.",
    w: "İklim değişikliği tartışmalarını mekanizma düzeyinde değerlendirmeyi sağlar; geri besleme kavramı biyolojiden ekonomiye kadar her sistemde tekrar karşına çıkar.",
    pre: ["earth.atm.weather", "earth.ocean.circulation", "gk.geo.climate-change~s"],
    q: [
      "Hava tahmini birkaç gün sonra güvenilmez hâle geliyorsa, yüz yıl sonraki iklim nasıl tahmin edilebilir? Bu bir çelişki mi?",
      "Kutuplardaki buz erirse Yer daha fazla ısı soğurur. Bu süreç kendi kendini sonsuza kadar hızlandırır mı?",
    ],
    cq: [
      "Pozitif ve negatif geri besleme iklim sisteminde nasıl işler?",
      "Geçmiş iklimler hangi vekil verilerden ve nasıl çıkarılır?",
      "İklim modelleri neyi tahmin eder, neyi tahmin edemez?",
    ],
    obj: [
      "Basit bir enerji dengesi modeline albedo geri beslemesi ekleyerek denge noktalarını bulur.",
      "Pozitif ve negatif geri beslemeleri sistem diyagramında gösterir ve sonuçlarını tahmin eder.",
      "Bir buz karotu ya da sıcaklık zaman serisini analiz ederek eğilim ile değişkenliği ayırt eder.",
    ],
    ev: "MODELLEME DIAGRAM VERI_ANALIZI SIMULASYON",
    t: "MODELLEME",
    lv: 4,
    sc: "L",
    mis: [
      "Hava ile iklimi karıştırmak (soğuk bir kış ısınmayı çürütmez).",
      "Pozitif geri beslemenin her zaman 'iyi' ya da 'kontrolsüz' olduğunu sanmak.",
    ],
    x: [
      "math.dyn.stability:denge noktaları ve kararlılık analizi",
      "math.stat.regression:sıcaklık serilerinde eğilim kestirimi",
      "media.lit.science-news:iklim haberlerini kanıta göre değerlendirme",
    ],
    ra: ["Sıfır boyutlu enerji dengesi modeliyle duyarlılık deneyleri"],
    rel: ["earth.atm.structure"],
    tags: ["iklim", "geri-besleme", "model"],
  })

  // ---------------------------------------------------------------------------
  .unit("Uzay bilimleri", "Gökbilim")
  .o("space.sky.observation", "Gökyüzü gözlemi: koordinatlar, mevsimler, Ay evreleri", {
    d: "Gök küresi, ufuk ve ekvatoral koordinatlar, yıldızların görünen günlük hareketi, eksen eğikliğiyle mevsimler, Ay evreleri ve tutulmaların geometrisi.",
    w: "Gökyüzünde bir şey bulmanın ve gözlem planlamanın dilidir; trigonometrinin gerçek bir küre üzerindeki ilk uygulamasıdır.",
    pre: ["math.trig.basics", "math.geo.euclid"],
    q: [
      "Yaz aylarında Yer Güneş'e daha mı yakındır? Güney yarımkürede o sırada hangi mevsim yaşanır, bu sana ne söyler?",
      "Her ay Yeni Ay oluyorsa neden her ay Güneş tutulması olmuyor?",
    ],
    cq: [
      "Bir yıldızın gökteki konumu hangi koordinatlarla belirtilir?",
      "Mevsimlerin gerçek nedeni nedir?",
      "Ay evreleri ve tutulmalar hangi geometrik düzenlemelerden doğar?",
    ],
    obj: [
      "Bir gözlem yerinin enlemi ile Kutup Yıldızı'nın yüksekliği arasındaki ilişkiyi kullanarak enlemi bulur.",
      "Güneş'in öğle yüksekliğini enleme ve tarihe göre hesaplar.",
      "Ay evrelerini Güneş–Yer–Ay geometrisiyle diyagramla açıklar ve tutulma koşullarını belirtir.",
    ],
    ev: "HESAPLAMA DIAGRAM DENEY",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Mevsimlerin Güneş'e uzaklık değişiminden kaynaklandığını sanmak.",
      "Ay evrelerinin Yer'in gölgesinden kaynaklandığını düşünmek.",
    ],
    x: [
      "math.trig.basics:açı ve yükseklik hesapları",
      "gk.sci-hist.ancient-medieval:antik ve İslam dünyası gökbilim gözlemleri",
      "gk.geo.maps:enlem–boylam ve koordinat sistemleri",
    ],
    ca: ["Astronomi olimpiyatlarında gök küresi ve zaman soruları"],
    rel: ["space.solar.system"],
    tags: ["gozlem", "koordinat", "mevsim"],
  })
  .o("space.solar.system", "Güneş sistemi ve gezegen bilimi", {
    d: "Güneş sisteminin oluşumu (bulutsu modeli), karasal ve dev gezegenlerin farkı, uydular, cüce gezegenler, kuyruklu yıldızlar ve gezegen atmosferlerinin karşılaştırılması; ötegezegenlere kısa bir giriş.",
    w: "Yer'i diğer gezegenlerle karşılaştırarak neden yaşanabilir olduğunu sorgulamayı sağlar; gezegen bilimi yer bilimlerinin uzaydaki uzantısıdır.",
    pre: ["space.sky.observation", "phys.mech.gravitation~s"],
    q: [
      "Venüs Güneş'e Merkür'den daha uzak; ama yüzeyi Merkür'ünkinden daha sıcak. Bunu nasıl açıklarsın?",
      "İç gezegenler neden kayalık, dış gezegenler neden gaz devi? Oluşum sırasında sıcaklığın rolünü tahmin et.",
    ],
    cq: [
      "Bulutsu modeli gezegenlerin dizilişini nasıl açıklar?",
      "Bir gezegenin atmosferini tutabilmesini hangi etkenler belirler?",
      "Ötegezegenler hangi yöntemlerle bulunur?",
    ],
    obj: [
      "Gezegenleri kütle, yoğunluk ve uzaklık verisine göre karşılaştırarak gruplandırır.",
      "Kaçış hızı ile gaz moleküllerinin ısıl hızını karşılaştırarak bir gezegenin atmosfer tutup tutamayacağını tahmin eder.",
      "Geçiş (transit) ışık eğrisinden bir ötegezegenin göreli boyutunu hesaplar.",
    ],
    ev: "VERI_ANALIZI HESAPLAMA TAHMIN",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Gaz devlerinin tamamen gazdan oluştuğunu ve 'yüzeyleri' olduğunu sanmak.",
      "Güneş sisteminin ölçekli çizimlerdeki gibi sıkışık olduğunu düşünmek.",
    ],
    x: [
      "phys.thermo.kinetic-theory:moleküllerin ortalama hızı ve atmosfer kaçışı",
      "chem.gas.laws:gezegen atmosferlerinde basınç ve sıcaklık",
      "bio.evolution:yaşanabilirlik ve yaşamın kökeni soruları",
    ],
    rel: ["space.orbits.kepler"],
    tags: ["gezegen", "gunes-sistemi", "otegezegen"],
  })
  .o("space.orbits.kepler", "Kepler yasaları ve yörünge mekaniği", {
    d: "Kepler'in üç yasası, bunların Newton'un kütle çekimi yasasından türetilmesi, yörünge enerjisi, kaçış hızı, dairesel ve eliptik yörüngeler ve Hohmann transfer yörüngesi.",
    w: "Uydu fırlatmaktan ötegezegen kütlesi ölçmeye kadar gökbilimdeki sayısal akıl yürütmenin merkezidir; olimpiyatların en sık konularındandır.",
    pre: ["phys.mech.gravitation", "math.geo.analytic"],
    q: [
      "Bir uyduyu daha yüksek bir yörüngeye çıkarmak için ileri doğru itersin; ama yeni yörüngede daha yavaş gider. Bu nasıl mümkün?",
      "Yer Güneş'e Ocak başında en yakındır. O sırada yörüngede daha hızlı mı, daha yavaş mı hareket eder?",
    ],
    cq: [
      "Kepler'in üçüncü yasası Newton'un yasalarından nasıl çıkar?",
      "Yörünge enerjisi ile yarı büyük eksen arasındaki ilişki nedir?",
      "Bir yörüngeden diğerine geçmek için hangi hız değişimleri gerekir?",
    ],
    obj: [
      "Dairesel yörünge için Kepler'in üçüncü yasasını Newton'un kütle çekimi yasasından türetir.",
      "Açısal momentum korunumu ile ikinci yasayı (eşit alanlar) ilişkilendirir ve günberi–günöte hızlarını hesaplar.",
      "Vis-viva denklemiyle bir Hohmann transferi için gereken hız değişimlerini hesaplar.",
      "Bir uydunun periyodundan merkezî cismin kütlesini bulur.",
    ],
    ev: "TURETME HESAPLAMA PROBLEM_COZME",
    t: "TURETME",
    lv: 4,
    sc: "L",
    mis: [
      "Yörüngedeki astronotların yer çekimi olmadığı için ağırlıksız olduğunu sanmak.",
      "Daha hızlı gitmek için yörüngede ileri itmenin her zaman işe yaradığını düşünmek.",
    ],
    x: [
      "math.geo.analytic:elips ve odak özellikleri",
      "phys.mech.angular-momentum:eşit alanlar yasası açısal momentum korunumudur",
      "gk.sci-hist.scientific-revolution:Kepler ve Newton'un yörünge kuramı",
    ],
    ca: ["Astronomi ve fizik olimpiyatlarında yörünge ve kaçış hızı soruları"],
    rel: ["space.solar.system", "space.astro.olympiad"],
    tags: ["kepler", "yorunge", "kutle-cekimi"],
  })
  .o("space.light.spectra", "Işık, tayf ve teleskoplar", {
    d: "Elektromanyetik tayf, karacisim ışıması (Wien ve Stefan–Boltzmann), soğurma ve salma çizgileri, Doppler kayması, teleskopların toplama gücü ve ayırma gücü.",
    w: "Yıldızlara gidemeyiz; onlar hakkında bildiğimiz hemen her şey ışıklarından gelir. Tayf okumak sıcaklık, bileşim ve hızı uzaktan ölçmenin yoludur.",
    pre: ["phys.optics.wave", "phys.modern.atomic-nuclear~s"],
    q: [
      "Kırmızı görünen bir yıldız mı daha sıcaktır, mavi görünen mi? Bir demir çubuğun ısıtılmasını düşünerek tahmin et.",
      "Teleskobun aynasını iki katına çıkarırsan sönük bir gökadayı ne kadar daha iyi görürsün?",
    ],
    cq: [
      "Bir yıldızın sıcaklığı ve bileşimi tayfından nasıl çıkarılır?",
      "Doppler kayması bir cismin hızını nasıl verir?",
      "Teleskop çapı toplama gücünü ve ayırma gücünü nasıl etkiler?",
    ],
    obj: [
      "Wien yasasıyla tepe dalga boyundan yüzey sıcaklığını hesaplar.",
      "Soğurma ve salma çizgilerinin oluşumunu enerji düzeyleriyle açıklar ve bir tayftaki elementi tanımlar.",
      "Dalga boyu kaymasından bakış doğrultusundaki hızı hesaplar.",
      "Teleskopların toplama gücünü ve kırınım sınırlı ayırma gücünü hesaplayarak karşılaştırır.",
    ],
    ev: "HESAPLAMA YORUMLAMA ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Büyük teleskopların asıl amacının 'büyütme' olduğunu sanmak.",
      "Kırmızıya kaymanın cismin kırmızı renkte göründüğü anlamına geldiğini düşünmek.",
    ],
    x: [
      "chem.atoms.electron-config:enerji düzeyleri ve tayf çizgileri",
      "phys.waves.sound:ses ve ışıkta Doppler etkisi",
      "phys.thermo.stat-mech:karacisim ışımasının istatistiksel kökeni",
    ],
    rel: ["space.stars.life"],
    tags: ["tayf", "teleskop", "doppler"],
  })
  .o("space.stars.life", "Yıldızların yapısı ve yaşam döngüsü", {
    d: "Hidrostatik denge, çekirdekte hidrojen füzyonu, Hertzsprung–Russell diyagramı, kütle–parlaklık ilişkisi ve kütleye bağlı evrim: beyaz cüce, nötron yıldızı ve kara delik.",
    w: "Vücudundaki karbon ve oksijenin yıldızlarda nasıl oluştuğunu açıklar; HR diyagramı astrofiziğin en çok kullanılan veri okuma aracıdır.",
    pre: ["space.light.spectra", "phys.thermo.laws~s", "phys.modern.atomic-nuclear"],
    q: [
      "Daha kütleli bir yıldızın daha fazla yakıtı var. Öyleyse neden daha kısa yaşar? Önce tahmin et, sonra parlaklık–kütle ilişkisine bak.",
      "Güneş neden kendi çekimiyle çökmüyor, neden patlayıp dağılmıyor?",
    ],
    cq: [
      "Bir yıldızı dengede tutan kuvvetler nelerdir?",
      "HR diyagramındaki konum yıldız hakkında ne söyler?",
      "Bir yıldızın kaderini başlıca hangi özelliği belirler?",
    ],
    obj: [
      "Parlaklık, yarıçap ve sıcaklık arasındaki L = 4πR²σT⁴ bağıntısını türetir ve kullanır.",
      "Bir yıldız kümesinin HR diyagramını yorumlayarak ana kol dışına çıkmış yıldızları belirler.",
      "Kütle–parlaklık ilişkisinden ana kol ömrünün kütleyle ölçeklenmesini türetir.",
      "Farklı kütlelerdeki yıldızların evrim yollarını diyagramla gösterir.",
    ],
    ev: "TURETME YORUMLAMA DIAGRAM HESAPLAMA",
    t: "KAVRAM",
    lv: 4,
    sc: "L",
    mis: [
      "Güneş'in 'yanan' bir ateş topu olduğunu, kimyasal yanma yaptığını sanmak.",
      "Tüm yıldızların sonunda kara delik olduğunu düşünmek.",
    ],
    x: [
      "phys.modern.atomic-nuclear:füzyonda kütle–enerji eşdeğerliği",
      "chem.atoms.structure:elementlerin yıldızlarda oluşumu",
      "phys.thermo.laws:yıldızların enerji taşınımı ve denge",
    ],
    ra: ["Açık kaynaklı yıldız kataloglarıyla HR diyagramı çizme"],
    rel: ["space.galaxies.cosmology"],
    tags: ["yildiz", "hr-diyagrami", "fuzyon"],
  })
  .o("space.galaxies.cosmology", "Galaksiler ve kozmolojiye giriş", {
    d: "Samanyolu'nun yapısı, galaksi türleri, uzaklık merdiveni (paralaks, değişen yıldızlar), Hubble–Lemaître yasası, genişleyen evren, kozmik mikrodalga arka plan ışıması ve karanlık madde için kanıtlar.",
    w: "Evrenin yaşı ve büyüklüğü gibi en büyük soruların nasıl ölçüldüğünü gösterir; ölçüm zincirindeki her adımın belirsizliğini düşünmeyi öğretir.",
    pre: ["space.stars.life", "phys.modern.relativity~s"],
    q: [
      "Tüm galaksiler bizden uzaklaşıyorsa bu, evrenin merkezinde olduğumuz anlamına mı gelir?",
      "Bir galaksinin dış kısımlarındaki yıldızlar iç kısımlardakiler kadar hızlı dönüyor. Kepler yasalarına göre ne beklerdin?",
    ],
    cq: [
      "Kozmik uzaklıklar adım adım hangi yöntemlerle ölçülür?",
      "Hubble–Lemaître yasası genişleyen evren hakkında ne söyler?",
      "Karanlık madde için gözlemsel kanıtlar nelerdir?",
    ],
    obj: [
      "Paralakstan ve standart mumlardan uzaklık hesaplar ve uzaklık merdiveninin mantığını açıklar.",
      "Hız–uzaklık verisinden Hubble sabitini kestirir ve evrenin yaşı için kaba bir tahmin türetir.",
      "Galaksi dönme eğrisini Kepler beklentisiyle karşılaştırarak karanlık madde çıkarımını yorumlar.",
    ],
    ev: "TURETME VERI_ANALIZI YORUMLAMA",
    t: "KAVRAM",
    lv: 4,
    sc: "L",
    mis: [
      "Büyük Patlama'nın uzayda belirli bir noktada olan bir patlama olduğunu sanmak.",
      "Karanlık maddenin kara delikler ya da sıradan karanlık toz olduğunu kesin saymak.",
    ],
    x: [
      "math.stat.regression:hız–uzaklık verisine doğru uydurma",
      "gk.phil.science:gözlemlenemeyen varlıklar ve kanıt",
      "gk.sci-hist.modern-physics:modern kozmolojinin doğuşu",
    ],
    rel: ["space.stars.life"],
    tags: ["galaksi", "kozmoloji", "hubble"],
  })
  .o("space.astro.olympiad", "Astronomi olimpiyatı problemleri", {
    d: "Gök küresi, yörünge mekaniği, fotometri (kadir sistemi) ve yıldız fiziğini birleştiren çok adımlı olimpiyat tipi problemler; Fermi tahmini ve gözlem verisi analizi.",
    w: "Bu alandaki bilgilerini sınırlı zamanda, alışılmadık bağlamlarda kullanmayı sağlar; ulusal ve uluslararası astronomi olimpiyatlarına hazırlığın çekirdeğidir.",
    pre: ["space.orbits.kepler", "space.stars.life", "phys.olymp.estimation"],
    q: [
      "Bir yıldızın görünen kadiri 5 birim azalıyor. Bu, gelen ışık akısının kaç katına çıktığı anlamına gelir? Ölçeğin neden 'ters' olduğunu tartış.",
      "Ay'dan bakan bir gözlemci Yer'in evrelerini görür mü? Ay'da 'bir gün' ne kadar sürer?",
    ],
    cq: [
      "Kadir sistemi ile akı ve uzaklık nasıl ilişkilendirilir?",
      "Çok adımlı bir astronomi probleminde hangi yaklaşımlar güvenle yapılabilir?",
      "Gözlem verisi (ışık eğrisi, tayf) bir probleme nasıl dönüştürülür?",
    ],
    obj: [
      "Görünen ve mutlak kadir arasındaki uzaklık modülü bağıntısını türetir ve uygular.",
      "Yörünge, fotometri ve yıldız fiziğini birleştiren çok adımlı problemleri çözer.",
      "Bir ışık eğrisi ya da tayf verisinden fiziksel bir nicelik çıkararak belirsizliğini tahmin eder.",
    ],
    ev: "TURETME PROBLEM_COZME VERI_ANALIZI TAHMIN",
    t: "CHALLENGE",
    lv: 5,
    sc: "L",
    ch: true,
    mis: [
      "Kadir arttıkça yıldızın parlaklaştığını sanmak.",
      "Her yaklaşımı (küçük açı, dairesel yörünge) kontrol etmeden uygulamak.",
    ],
    x: [
      "comp.meta.problem-solving:çok adımlı problemlerde strateji",
      "math.found.exp-log:kadir sistemi logaritmiktir",
      "phys.olymp.boss:fizik olimpiyatıyla ortak problem çözme becerileri",
    ],
    ca: ["Ulusal ve uluslararası astronomi olimpiyatları (format ve kuralları resmî kaynaktan doğrula)"],
    rel: ["space.orbits.kepler", "space.stars.life"],
    tags: ["olimpiyat", "astronomi", "problem"],
  })
  .o("space.boss", "Boss: Yer ve uzay bilimleri sentezi", {
    d: "Yer'in iklim sistemi, yıldız fiziği ve yörünge mekaniğini birleştiren bir sentez görevi: örneğin bir ötegezegenin yaşanabilirliğini yıldızının özellikleri, yörüngesi ve olası atmosferiyle değerlendirme.",
    w: "Bu alandaki tüm araçları tek bir gerçekçi soru etrafında birlikte kullanmayı gerektirir; bilimsel bir argümanı varsayımlarıyla birlikte savunmanı sağlar.",
    pre: ["earth.atm.climate-system", "space.stars.life", "space.orbits.kepler"],
    q: [
      "Kırmızı bir cüce yıldızın çevresinde, 'yaşanabilir bölgede' bir gezegen bulundu. Bu gezegende sıvı su olduğunu söylemek için hangi bilgilere daha ihtiyacın var?",
    ],
    cq: [
      "Bir gezegenin yüzey sıcaklığını yıldız, yörünge ve atmosfer birlikte nasıl belirler?",
      "Hangi varsayımlar sonucu en çok değiştirir?",
    ],
    obj: [
      "Yıldız parlaklığı ve yörünge yarıçapından gezegenin denge sıcaklığını türetir.",
      "Sera etkisi ve albedo geri beslemelerini ekleyerek sonucu yeniden değerlendirir ve duyarlılığını analiz eder.",
      "Bulgularını varsayımları ve belirsizlikleriyle kısa bir bilimsel rapor olarak savunur.",
    ],
    ev: "TURETME MODELLEME PROBLEM_COZME TRANSFER",
    t: "BOSS",
    lv: 5,
    sc: "L",
    boss: true,
    mis: [
      "'Yaşanabilir bölge'de olmanın yaşam ya da su olduğunu garantilediğini sanmak.",
    ],
    x: [
      "res.project.modeling:varsayımları açık bir modelleme çalışması",
      "bio.evolution:yaşamın ortaya çıkış koşulları",
    ],
    rel: ["earth.atm.climate-system", "space.stars.life", "space.orbits.kepler"],
    tags: ["boss", "sentez", "yasanabilirlik"],
  })
  .done();
