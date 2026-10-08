import { builder } from "../dsl";

export const ENVIRONMENT = builder("CEVRE")
  // ---------------------------------------------------------------------------
  .unit("Çevre bilimi", "Sistemler ve kaynaklar")
  .o("env.ecosystems.energy", "Ekosistemlerde enerji akışı ve madde döngüleri", {
    d: "Besin zincirleri ve ağları, trofik düzeyler arasında enerji aktarımı ve kayıp (kabaca %10 kuralı), birincil üretim; karbon, azot, fosfor ve su döngüleri.",
    w: "Enerjinin tek yönlü aktığını, maddenin ise döndüğünü ayırt etmek; tarım, iklim ve kirlilik sorularının hepsinde neyin nereye gittiğini izlemeyi sağlar.",
    pre: ["bio.ecology", "bio.energy.photosynthesis~s"],
    q: [
      "Aynı tarlada yetişen buğdayla doğrudan insan beslemek mi daha çok insanı doyurur, yoksa o buğdayla hayvan besleyip etini yemek mi? Neden?",
      "Bir ağacın kütlesinin büyük kısmı nereden gelir: topraktan mı, sudan mı, havadan mı? Tahmin et.",
    ],
    cq: [
      "Enerji neden trofik düzeyler boyunca azalır?",
      "Karbon ve azot hangi havuzlar arasında ve hangi süreçlerle dolaşır?",
      "İnsan etkinlikleri bu döngüleri nasıl değiştirir?",
    ],
    obj: [
      "Bir besin ağında trofik düzeyler arası enerji aktarımını hesaplar ve enerji piramidini çizer.",
      "Karbon ve azot döngülerini havuz ve akı diyagramı olarak gösterir.",
      "Fosil yakıt kullanımı ya da gübrelemenin bir döngüdeki akıları nasıl değiştirdiğini tahmin eder.",
    ],
    ev: "HESAPLAMA DIAGRAM TAHMIN",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Bitkilerin kütlelerini topraktan aldığını sanmak (karbonun çoğu havadaki CO₂'den gelir).",
      "Enerjinin de madde gibi ekosistemde döndüğünü düşünmek.",
    ],
    x: [
      "phys.thermo.laws:enerji dönüşümlerinde kayıp ve ikinci yasa",
      "chem.react.types:döngülerdeki yükseltgenme–indirgenme tepkimeleri",
    ],
    rel: ["env.biodiversity", "env.methods.fieldwork"],
    tags: ["ekosistem", "enerji-akisi", "biyojeokimyasal-dongu"],
  })
  .o("env.biodiversity", "Biyoçeşitlilik ve koruma biyolojisi", {
    d: "Genetik, tür ve ekosistem çeşitliliği; çeşitlilik indeksleri, ada biyocoğrafyası ve habitat parçalanması, istilacı türler ve koruma stratejileri.",
    w: "Bir türün kaybının neden bir zincirleme etki yaratabileceğini ve koruma alanlarının nasıl tasarlandığını gösterir; ekosistem hizmetlerini sayısal düşünmeyi öğretir.",
    pre: ["env.ecosystems.energy", "bio.evolution~s"],
    q: [
      "İki ormanda aynı sayıda tür var; birinde bir tür baskın, diğerinde türler eşit dağılmış. Hangisi daha 'çeşitli'dir? Bunu nasıl ölçerdin?",
      "Bir ormanı tek büyük parça yerine birçok küçük parça olarak korumak türler için aynı şey midir?",
    ],
    cq: [
      "Biyoçeşitlilik hangi düzeylerde ve nasıl ölçülür?",
      "Habitat parçalanması ve istilacı türler tür kaybına nasıl yol açar?",
      "Koruma çabaları hangi ilkelere göre önceliklendirilir?",
    ],
    obj: [
      "Bir örnek veri setinde tür zenginliği ve Simpson ya da Shannon çeşitlilik indeksini hesaplar.",
      "Ada biyocoğrafyası düşüncesini kullanarak parçalanmış habitatlarda tür sayısının değişimini tahmin eder.",
      "Bir koruma planını anahtar türler, koridorlar ve yerel toplulukların ihtiyaçları açısından değerlendirir.",
    ],
    ev: "HESAPLAMA VERI_ANALIZI TAHMIN YORUMLAMA",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Biyoçeşitliliğin yalnızca tür sayısı demek olduğunu sanmak.",
      "Bir türü korumanın en iyi yolunun her zaman onu hayvanat bahçesine almak olduğunu düşünmek.",
    ],
    x: [
      "bio.evolution.popgen:küçük popülasyonlarda genetik sürüklenme ve çeşitlilik kaybı",
      "math.info.entropy:Shannon indeksi bilgi entropisidir",
    ],
    ra: ["Saha sayımlarından çeşitlilik indeksi hesaplama"],
    rel: ["env.climate.impacts"],
    tags: ["biyocesitlilik", "koruma", "habitat"],
  })
  .o("env.population.human", "İnsan nüfusu ve taşıma kapasitesi", {
    d: "Üstel ve lojistik büyüme, katlanma süresi, demografik geçiş modeli, yaş piramitleri ve taşıma kapasitesi kavramının insan için sınırları; ekolojik ayak izi.",
    w: "Nüfus haberlerini ve projeksiyonlarını sayılarla değerlendirmeyi sağlar; üstel büyümenin sezgiye aykırı hızını hissettirir.",
    pre: ["bio.ecology", "math.found.exp-log"],
    q: [
      "Yıllık %2 büyüyen bir nüfus kaç yılda ikiye katlanır? Önce kafadan tahmin et, sonra hesapla.",
      "Doğurganlık düşen bir ülkede nüfus neden hâlâ yıllarca artmaya devam edebilir?",
    ],
    cq: [
      "Üstel ve lojistik büyüme modelleri nüfus için ne zaman uygundur?",
      "Demografik geçişin aşamaları doğum ve ölüm oranlarıyla nasıl açıklanır?",
      "Taşıma kapasitesi insanlar için neden sabit bir sayı değildir?",
    ],
    obj: [
      "Büyüme oranından katlanma süresini 70 kuralıyla ve tam formülle hesaplar.",
      "Bir yaş piramidini yorumlayarak nüfusun gelecekteki değişimini tahmin eder.",
      "Lojistik modelin varsayımlarını insan nüfusu bağlamında eleştirir.",
    ],
    ev: "HESAPLAMA YORUMLAMA MODELLEME",
    t: "MODELLEME",
    lv: 2,
    sc: "M",
    mis: [
      "Doğurganlık yenilenme düzeyine inince nüfusun hemen durduğunu sanmak (nüfus ivmesi).",
      "Taşıma kapasitesinin teknolojiden ve tüketimden bağımsız sabit bir sayı olduğunu düşünmek.",
    ],
    x: [
      "math.found.exp-log:üstel büyüme ve katlanma süresi",
      "gk.geo.human:nüfus dağılımı ve göç",
      "math.ode.first-order:lojistik denklem",
    ],
    rel: ["env.land.water"],
    tags: ["nufus", "demografi", "tasima-kapasitesi"],
  })
  .o("env.land.water", "Arazi ve su kullanımı", {
    d: "Tarım, orman ve kent arazisi kullanımı; toprak erozyonu ve çölleşme; su döngüsünde insan payı, yeraltı suyu, sulama ve su ayak izi.",
    w: "Gıda, su ve kentleşme kararlarının çevresel bedelini görmeyi sağlar; Türkiye gibi su stresi yaşayan bölgeler için doğrudan önemlidir.",
    pre: ["env.population.human~s", "gk.geo.human~s"],
    q: [
      "Bir kilo pirinç mi daha çok su gerektirir, yoksa bir kilo domates mi? 'Su ayak izi' kavramını kullanmadan tahminini gerekçelendir.",
      "Bir akiferden yağmurla dolduğundan hızlı su çekersen ne olur? Hemen fark edilir mi?",
    ],
    cq: [
      "Arazi kullanımı değişiklikleri toprak ve suyu nasıl etkiler?",
      "Yeraltı suyu nasıl dolar, nasıl tükenir?",
      "Su ayak izi ve sanal su ticareti ne anlatır?",
    ],
    obj: [
      "Bir havza için basit bir su bütçesi (girdi, çıktı, depo değişimi) kurar.",
      "Farklı ürünlerin su ayak izini karşılaştırarak bir beslenme tercihinin su etkisini hesaplar.",
      "Erozyonu ve çölleşmeyi önleme yöntemlerini nedenleriyle ilişkilendirerek değerlendirir.",
    ],
    ev: "MODELLEME HESAPLAMA YORUMLAMA",
    t: "UYGULAMA",
    lv: 2,
    sc: "M",
    mis: [
      "Yeraltı suyunun yeraltında akan büyük nehirler ya da göller olduğunu sanmak.",
      "Suyun tükenmez olduğunu, çünkü döngüde kaybolmadığını düşünmek (yerel ve zamansal kıtlık).",
    ],
    x: [
      "gk.geo.turkey:Türkiye'de su kaynakları ve tarım",
      "phys.mech.fluids:gözenekli ortamda yeraltı suyu akışı",
    ],
    rel: ["env.pollution.water-soil"],
    tags: ["arazi", "su", "erozyon"],
  })
  .o("env.energy.resources", "Enerji kaynakları ve verimlilik", {
    d: "Fosil yakıtlar, nükleer ve yenilenebilir kaynaklar (güneş, rüzgâr, hidro, jeotermal); enerji dönüşüm verimleri, kapasite faktörü, depolama sorunu ve yaşam döngüsü emisyonları.",
    w: "Enerji politikası tartışmalarını kWh ve verim gibi gerçek sayılarla değerlendirmeyi sağlar; fiziğin toplumsal kararlara en doğrudan girdiği yerdir.",
    pre: ["phys.mech.work-energy", "phys.thermo.laws~s"],
    q: [
      "Bir evin çatısını güneş panelleriyle kaplasan evin yıllık elektriğini karşılayabilir misin? Hangi sayılara ihtiyacın var? Kaba bir tahmin yap.",
      "Bir elektrikli araç kömür santralinden gelen elektrikle şarj ediliyorsa benzinli araçtan daha mı temizdir?",
    ],
    cq: [
      "Farklı enerji kaynakları verim, maliyet, süreklilik ve emisyon açısından nasıl karşılaştırılır?",
      "Güç ile enerji ve kurulu güç ile üretilen enerji neden karıştırılmamalı?",
      "Yenilenebilir kaynakların değişkenliği hangi depolama ve şebeke çözümlerini gerektirir?",
    ],
    obj: [
      "Bir enerji dönüşüm zincirinin toplam verimini adımların verimlerinden hesaplar.",
      "Kurulu güç ve kapasite faktöründen yıllık üretimi kestirir.",
      "Bir enerji seçeneğini yaşam döngüsü emisyonları ve maliyetiyle başka bir seçenekle karşılaştırarak gerekçeli öneri yapar.",
    ],
    ev: "HESAPLAMA TAHMIN PROBLEM_COZME TRANSFER",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Kilowatt ile kilowatt-saati karıştırmak.",
      "Yenilenebilir enerjinin hiçbir çevresel etkisi olmadığını sanmak.",
    ],
    x: [
      "phys.olymp.estimation:enerji ihtiyacı için Fermi tahmini",
      "phys.em.induction:jeneratörlerde elektrik üretimi",
      "gk.econ.micro:enerji maliyetleri ve fiyatlar",
    ],
    rel: ["env.climate.impacts", "env.pollution.air"],
    tags: ["enerji", "verim", "yenilenebilir"],
  })
  .o("env.pollution.air", "Hava kirliliği", {
    d: "Birincil ve ikincil kirleticiler (partikül madde, NOₓ, SO₂, ozon), fotokimyasal duman, asit yağmuru, sıcaklık terselmesi, iç ortam hava kalitesi ve sağlık etkileri.",
    w: "Bir şehirde neden kışın hava kirliliğinin arttığını ve bir hava kalitesi indeksinin neyi ölçtüğünü açıklar; kimya, meteoroloji ve halk sağlığını birleştirir.",
    pre: ["earth.atm.structure", "chem.react.types~s"],
    q: [
      "Yerdeki ozon zararlı, stratosferdeki ozon ise koruyucu. Aynı molekül nasıl hem iyi hem kötü olabilir?",
      "Rüzgârsız, açık bir kış gecesinde bir vadideki şehrin havası neden sabaha karşı daha kirli olur?",
    ],
    cq: [
      "Birincil ve ikincil kirleticiler nasıl oluşur?",
      "Meteorolojik koşullar kirleticilerin birikmesini nasıl etkiler?",
      "Partikül madde boyutu sağlık etkisini neden belirler?",
    ],
    obj: [
      "Asit yağmuru ve yer seviyesi ozonun oluşum tepkimelerini yazar.",
      "Sıcaklık terselmesinin kirleticileri nasıl hapsettiğini diyagramla açıklar.",
      "Hava kalitesi ölçüm verisini analiz ederek kirlilik düzeyini meteorolojik koşullarla ilişkilendirir.",
    ],
    ev: "ACIKLAMA DIAGRAM VERI_ANALIZI",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Hava kirliliğinin yalnızca dışarıda olduğunu, iç mekânın hep temiz olduğunu sanmak.",
      "Görünmeyen havanın temiz olduğunu düşünmek (ince partiküller ve gazlar görünmez).",
    ],
    x: [
      "chem.acid-base:asit yağmurunun pH'ı ve tamponlama",
      "chem.kinetics:fotokimyasal tepkimelerin hızı",
      "bio.anatomy.respiratory:partiküllerin solunum yolunda tutulması",
    ],
    rel: ["env.pollution.water-soil"],
    tags: ["hava-kirliligi", "ozon", "partikul"],
  })
  .o("env.pollution.water-soil", "Su ve toprak kirliliği", {
    d: "Noktasal ve yayılı kirlilik kaynakları; ötrofikasyon, oksijen tükenmesi, ağır metaller, biyobirikim ve biyobüyütme, mikroplastikler, atık su arıtımı ve katı atık yönetimi.",
    w: "Bir gölün neden yeşile döndüğünü ya da bir besin zincirinin tepesindeki canlılarda neden zehir biriktiğini açıklar; arıtma teknolojilerinin mantığını gösterir.",
    pre: ["env.land.water", "chem.solutions~s"],
    q: [
      "Göle karışan gübre bitkilerin büyümesini artırıyorsa, neden balıklar ölüyor? Olaylar zincirini tahmin et.",
      "Suda çok düşük derişimde bulunan bir zehir, neden yırtıcı kuşlarda tehlikeli düzeye ulaşabilir?",
    ],
    cq: [
      "Ötrofikasyon hangi adımlarla oksijen tükenmesine yol açar?",
      "Biyobirikim ve biyobüyütme nasıl işler?",
      "Atık su arıtımının aşamaları hangi kirleticileri hedefler?",
    ],
    obj: [
      "Ötrofikasyon sürecini neden–sonuç zinciri olarak diyagramla gösterir.",
      "Trofik düzey başına büyütme katsayısıyla bir besin zincirinin tepesindeki kirletici derişimini hesaplar.",
      "Bir su örneğinin çözünmüş oksijen, nitrat ve pH verilerini yorumlayarak kirlilik kaynağı hakkında gerekçeli çıkarım yapar.",
    ],
    ev: "DIAGRAM HESAPLAMA VERI_ANALIZI",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Berrak görünen suyun temiz olduğunu sanmak.",
      "Seyreltmenin kirliliğe her zaman çözüm olduğunu düşünmek (biyobüyütme derişimi yeniden artırır).",
    ],
    x: [
      "chem.solutions:derişim birimleri (ppm, mg/L) ve çözünürlük",
      "bio.micro.microbes:arıtmada ve ötrofikasyonda mikroorganizmaların rolü",
      "chem.lab.techniques:su örneklerinin titrasyonla analizi",
    ],
    rel: ["env.pollution.air"],
    tags: ["su-kirliligi", "otrofikasyon", "biyobirikim"],
  })
  .o("env.climate.impacts", "Küresel değişim: etkiler ve uyum", {
    d: "Deniz seviyesi yükselmesi, aşırı hava olayları, okyanus asitlenmesi ve ekosistem kaymaları gibi etkiler; azaltım ile uyum arasındaki fark ve risk değerlendirmesi.",
    w: "İklim biliminden toplum için ne çıktığını ve kararların hangi belirsizliklerle verildiğini görmeyi sağlar.",
    pre: ["earth.atm.climate-system", "env.biodiversity~s"],
    q: [
      "Denizde yüzen buzlar erirse deniz seviyesi yükselir mi? Peki Grönland'daki buz erirse? Bir bardak buzlu suyla düşün.",
      "Okyanus fazladan CO₂ soğurarak ısınmayı yavaşlatıyor. Bunun bir bedeli olabilir mi?",
    ],
    cq: [
      "İklim değişikliğinin başlıca fiziksel ve biyolojik etkileri nelerdir?",
      "Azaltım (mitigation) ve uyum (adaptation) hangi soruları yanıtlar?",
      "Bir etki projeksiyonundaki belirsizlik nasıl okunmalı?",
    ],
    obj: [
      "Deniz seviyesi yükselmesine ısıl genleşme ve kara buzunun katkısını ayırt ederek açıklar.",
      "Okyanus asitlenmesinin karbonat dengesi üzerinden kabuklu canlıları nasıl etkilediğini tahmin eder.",
      "Bir bölge için iklim riskini tehlike, maruziyet ve hassasiyet bileşenleriyle değerlendirerek uyum önerisi yapar.",
    ],
    ev: "ACIKLAMA TAHMIN YORUMLAMA TRANSFER",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Deniz buzunun erimesinin deniz seviyesini doğrudan yükselttiğini sanmak.",
      "Belirsizlik olmasının 'bilim insanları bilmiyor' anlamına geldiğini düşünmek.",
    ],
    x: [
      "chem.equilibrium:karbonat dengesi ve okyanus asitlenmesi",
      "media.lit.science-news:iklim projeksiyonlarının haberlerde sunumu",
      "gk.geo.climate-change:iklim değişikliğinin bilimsel temeli",
    ],
    rel: ["env.sustainability"],
    tags: ["iklim-etkileri", "uyum", "deniz-seviyesi"],
  })
  .o("env.sustainability", "Sürdürülebilirlik ve çevre politikası", {
    d: "Sürdürülebilirlik kavramının farklı tanımları, ortak malların trajedisi, dışsallıklar ve araçları (vergi, emisyon ticareti, düzenleme), uluslararası çevre anlaşmalarının yapısı ve politika değerlendirmesi.",
    w: "Bilimsel bilginin nasıl karara dönüştüğünü ve neden çoğu zaman tartışmalı olduğunu gösterir; ekonomi, hukuk ve fen bilgisini bir araya getirir.",
    pre: ["env.climate.impacts", "gk.econ.micro~s"],
    q: [
      "Herkesin hayvan otlatabildiği ortak bir mera var. Her çoban için bir hayvan daha eklemek mantıklı; ama herkes böyle yaparsa ne olur?",
      "Kirliliği azaltmak için bir yasak mı daha etkilidir, yoksa kirletene ödetilen bir vergi mi? Hangi koşullarda?",
    ],
    cq: [
      "Ortak malların trajedisi hangi koşullarda ortaya çıkar ve nasıl önlenebilir?",
      "Çevre politikası araçları nasıl karşılaştırılır?",
      "Uluslararası bir çevre anlaşmasının başarısını hangi ölçütlerle değerlendirirsin?",
    ],
    obj: [
      "Ortak malların trajedisini basit bir oyun ya da sayısal örnekle modeller.",
      "Vergi, kota ve düzenleme araçlarını etkinlik ve adalet açısından karşılaştırır.",
      "Bir çevre anlaşmasının hedeflerini ve sonuçlarını birincil kaynaklardan araştırarak değerlendirir.",
    ],
    ev: "MODELLEME YORUMLAMA ARASTIRMA_UYGULAMASI",
    t: "TRANSFER",
    lv: 3,
    sc: "M",
    src: true,
    mis: [
      "Sürdürülebilirliğin yalnızca çevre koruma demek olduğunu sanmak (ekonomik ve sosyal boyutlar).",
      "Uluslararası anlaşmaların içerik ve tarihlerini kaynağa bakmadan aktarmak.",
    ],
    x: [
      "econ.micro.market-failure:dışsallıklar ve piyasa aksaklığı",
      "econ.micro.game-theory:ortak mallar ve işbirliği oyunları",
      "gk.civics.international:uluslararası kuruluşlar ve anlaşmalar",
    ],
    notes: ["Anlaşmaların adlarını, tarihlerini ve hedeflerini resmî metinlerden doğrula."],
    rel: ["env.climate.impacts"],
    tags: ["surdurulebilirlik", "politika", "ortak-mallar"],
  })
  .o("env.methods.fieldwork", "Çevre bilimi saha çalışması ve veri", {
    d: "Örnekleme tasarımı (kuadrat, transekt), işaretle–yeniden yakala ile popülasyon tahmini, su ve toprak ölçümleri, veri kaydı, belirsizlik ve basit istatistiksel karşılaştırma.",
    w: "Çevre hakkındaki iddiaları kendi ölçümlerinle sınamayı sağlar; iyi bir saha verisinin nasıl toplandığını bilmek başkalarının verisini eleştirmenin de temelidir.",
    pre: ["env.ecosystems.energy", "math.stat.descriptive", "res.method.experimental-design~s"],
    q: [
      "Bir göldeki balık sayısını bütün balıkları yakalamadan nasıl tahmin edersin? Bir yöntem öner.",
      "Bir çayırda bitki türlerini saymak için 1 m²'lik çerçeveyi nereye koyacağına nasıl karar verirsin? Hep en ilginç yeri seçmenin sakıncası ne?",
    ],
    cq: [
      "Saha örneklemesi yanlılığı azaltacak biçimde nasıl tasarlanır?",
      "İşaretle–yeniden yakala yöntemi hangi varsayımlara dayanır?",
      "Saha verisinin belirsizliği nasıl raporlanır?",
    ],
    obj: [
      "Bir alan için rastgele ya da sistematik örnekleme planı tasarlar ve gerekçelendirir.",
      "İşaretle–yeniden yakala verisinden Lincoln–Petersen tahminini hesaplar ve varsayımlarını sınar.",
      "İki bölgeden toplanan verileri betimleyici istatistik ve grafikle karşılaştırarak belirsizliğiyle raporlar.",
    ],
    ev: "DENEY HESAPLAMA VERI_ANALIZI",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Daha çok ölçümün yanlı bir örneklemeyi düzelteceğini sanmak.",
      "Tek bir ölçüm noktasından bütün alan hakkında genelleme yapmak.",
    ],
    x: [
      "math.stat.sampling:örnekleme yöntemleri ve yanlılık",
      "res.data.management:saha verisinin kaydı ve belgelenmesi",
      "bio.methods.lab:biyolojide deney ve gözlem tasarımı",
    ],
    ra: ["Yerel bir habitatta tür çeşitliliği izleme"],
    rel: ["env.proj.local-study"],
    tags: ["saha", "ornekleme", "veri"],
  })
  .o("env.proj.local-study", "Proje: Yerel çevre araştırması", {
    d: "Yakın çevrende (okul bahçesi, dere, park) bir araştırma sorusu belirleyip saha verisi toplama, analiz etme ve bulguları bilimsel bir rapor ya da poster olarak sunma.",
    w: "Bilimsel yöntemin bütün döngüsünü gerçek ve kendi seçtiğin bir soru üzerinde yaşatır; araştırma projesi yarışmaları için de sağlam bir başlangıçtır.",
    pre: ["env.methods.fieldwork", "res.write.report~s"],
    q: [
      "Okulunun çevresinde ölçebileceğin ve sonucunu gerçekten merak ettiğin bir çevre sorusu yaz. Bu soru bir haftada yanıtlanabilir mi?",
    ],
    cq: [
      "Yerel ölçekte sınanabilir bir araştırma sorusu nasıl kurulur?",
      "Sınırlı veriden hangi sonuçlar dürüstçe çıkarılabilir?",
    ],
    obj: [
      "Ölçülebilir bir araştırma sorusu ve hipotez yazar, değişkenleri tanımlar.",
      "Bir saha çalışması planlar ve uygular; veriyi düzenli olarak kaydeder.",
      "Veriyi analiz eder ve bulguları sınırlılıklarıyla birlikte rapor ya da poster olarak sunar.",
    ],
    ev: "DENEY VERI_ANALIZI ARASTIRMA_UYGULAMASI",
    t: "PROJE",
    lv: 3,
    sc: "L",
    mis: [
      "Projenin amacının önceden 'beklenen' sonucu doğrulamak olduğunu sanmak.",
    ],
    x: [
      "res.project.mini:mini araştırma projesinin aşamaları",
      "comp.research.science-fair:araştırma projesi yarışmalarına hazırlık",
      "res.write.presentation:bulguların poster ve sunumla paylaşımı",
    ],
    ra: ["Yerel su kalitesi, hava kalitesi ya da biyoçeşitlilik izleme projesi"],
    ca: ["Araştırma projesi yarışmalarında çevre bilimi kategorisi (kategori ve kuralları resmî kaynaktan doğrula)"],
    rel: ["env.methods.fieldwork"],
    tags: ["proje", "saha", "arastirma"],
  })
  .o("env.boss", "Boss: Çevre sistemleri sentezi", {
    d: "İklim etkileri, enerji seçimleri ve kirlilik bilgisini tek bir senaryoda birleştiren sentez görevi: örneğin bir şehir için enerji ve su planının çevresel etkilerini sayısal olarak karşılaştırma.",
    w: "Çevre biliminin parçalarını gerçek bir karar problemine birlikte uygulamayı gerektirir; ödünleşimleri açıkça savunmayı öğretir.",
    pre: ["env.climate.impacts", "env.energy.resources", "env.pollution.water-soil"],
    q: [
      "Bir şehir yeni bir enerji santrali kuracak: kömür, doğal gaz, güneş + depolama ya da rüzgâr. İklim, hava, su ve maliyet açısından hangisini önerirsin ve hangi bilgi kararını değiştirebilir?",
    ],
    cq: [
      "Farklı çevresel etkiler ortak bir karar çerçevesinde nasıl karşılaştırılır?",
      "Bir önerinin en zayıf varsayımı nedir?",
    ],
    obj: [
      "Seçenekleri emisyon, su kullanımı ve kirlilik açısından sayısal olarak karşılaştırır.",
      "Bir çok ölçütlü karar tablosu kurar ve ağırlıkların değişimine karşı duyarlılığını sınar.",
      "Önerisini varsayımları ve ödünleşimleriyle kısa bir politika notu olarak savunur.",
    ],
    ev: "MODELLEME HESAPLAMA PROBLEM_COZME TRANSFER",
    t: "BOSS",
    lv: 4,
    sc: "L",
    boss: true,
    mis: [
      "Tek bir ölçüte (örneğin yalnızca maliyete) bakarak 'en iyi' seçeneğin belirlenebileceğini sanmak.",
    ],
    x: [
      "res.project.modeling:varsayımları açık bir modelleme çalışması",
      "math.opt.optimization:kısıtlar altında seçim",
    ],
    rel: ["env.energy.resources", "env.climate.impacts"],
    tags: ["boss", "sentez", "karar"],
  })
  .done();
