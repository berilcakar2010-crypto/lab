import { builder } from "../dsl";

/**
 * GENEL_KULTUR ekleri — küresel ve Avrupa tarihi temaları, beşeri coğrafya.
 * Tüm nesneler `src: true`: yapı, karşılaştırma ve neden-sonuç öne çıkar;
 * tarihler, sayılar ve kurumsal ayrıntılar birincil ve akademik kaynaklardan doğrulanmalıdır.
 */
export const CULTURE_PLUS = builder("GENEL_KULTUR")
  // ───────────────────────────── Tarih / Dünya tarihi
  .unit("Tarih", "Dünya tarihi")
  .o("gk.world.ap-1200-1450", "Küresel bağlantılar 1200–1450: imparatorluklar ve ticaret ağları", {
    d: "Afro-Avrasya'yı birbirine bağlayan kara ve deniz ticaret ağları (İpek Yolları, Hint Okyanusu, Sahra ötesi yollar), bu ağlar üzerinde yükselen devletler ve malların, fikirlerin, dinlerin ve hastalıkların dolaşımı.",
    w: "Dünya tarihini tek tek ülkelerin hikâyesi yerine bağlantılar ve ağlar üzerinden düşünmeyi öğretir; bugünkü küreselleşmeyi tarihsel bir karşılaştırmayla değerlendirmeyi sağlar.",
    pre: ["gk.world.medieval"],
    q: [
      "Bir tüccar mallarını binlerce kilometre öteye, hiç tanımadığı insanlar aracılığıyla nasıl güvenle ulaştırır? Güveni sağlayan kurumlar neler olabilir? Tahmin et, sonra tarihsel örneklerle karşılaştır.",
      "Ticaret yolları hem zenginlik hem salgın taşır. Bir ağın bağlantısı arttıkça kırılganlığı da artar mı?",
    ],
    cq: [
      "Kara ve deniz ticaret ağları hangi coğrafi ve teknolojik koşullara dayanıyordu?",
      "Büyük imparatorluklar ticaret ağlarını nasıl kolaylaştırdı ya da denetledi?",
      "Dinler, teknolojiler ve hastalıklar bu ağlar üzerinden nasıl yayıldı?",
    ],
    obj: [
      "Başlıca ticaret ağlarını bir harita üzerinde gösterip taşınan mal ve fikirleri sınıflandırır",
      "İki farklı bölgedeki devletin ticaretle ilişkisini karşılaştıran bir paragraf yazar",
      "Bir yayılma sürecini (din, teknoloji ya da salgın) neden-sonuç zinciriyle açıklar",
      "Bir seyyah anlatısını yazar-amaç-kitle açısından değerlendirir",
    ],
    ev: "DIAGRAM YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Bu dönemde dünya bölgeleri birbirinden kopuktu; küresel bağlantı Avrupa keşifleriyle başladı.",
      "Ticaret ağları yalnızca lüks malları taşıyordu.",
    ],
    x: [
      "math.discrete.graph-theory:ticaret ağlarını düğüm ve bağlantılardan oluşan bir graf olarak modellemek",
      "bio.micro.microbes:salgın hastalıkların ağlar boyunca yayılması",
      "art.history.global:biçim ve tekniklerin ticaret yollarıyla dolaşımı",
    ],
    notes: ["Devletlerin, seyyahların ve salgınların tarihlerini ve ayrıntılarını akademik kaynaklardan doğrula; AP Dünya Tarihi dönemlendirmesini güncel resmi ders tanımından kontrol et."],
    rel: ["gk.world.ap-land-sea-empires", "gk.tr-hist.anatolia"],
    tags: ["dunya-tarihi", "ticaret", "ag"],
    src: true,
  })
  .o("gk.world.ap-land-sea-empires", "Kara ve deniz imparatorlukları (1450–1750)", {
    d: "Barut teknolojisiyle güçlenen kara imparatorlukları ile okyanus aşırı deniz imparatorluklarının kuruluşu, yönetim yöntemleri, meşruiyet araçları ve ekonomik sistemlerinin karşılaştırılması.",
    w: "Osmanlı'yı dünya tarihinin karşılaştırmalı çerçevesine yerleştirir; imparatorlukların çeşitliliği nasıl yönettiğini ve küresel ekonominin nasıl birbirine bağlandığını gösterir.",
    pre: ["gk.world.ap-1200-1450", "gk.world.renaissance~s"],
    q: [
      "Çok dinli, çok dilli geniş bir toprağı yönetmen gerekiyor. Herkesi tek bir kimliğe mi zorlarsın, farklılıklara alan mı tanırsın? Her seçimin bedelini tahmin et.",
    ],
    cq: [
      "Kara imparatorlukları otoritelerini ve meşruiyetlerini nasıl kurdu ve sürdürdü?",
      "Deniz imparatorlukları hangi ekonomik ve teknolojik araçlarla genişledi?",
      "Küresel ticaret ve sömürgecilik farklı toplumları nasıl etkiledi (zorla çalıştırma ve köle ticareti dahil)?",
    ],
    obj: [
      "İki kara imparatorluğunun yönetim ve meşruiyet araçlarını bir karşılaştırma tablosunda düzenler",
      "Bir deniz imparatorluğunun genişleme nedenlerini ekonomik, teknolojik ve siyasi olarak sınıflandırır",
      "Küresel ticaretin sonuçlarını farklı toplumların bakış açısından yorumlar",
    ],
    ev: "YORUMLAMA DIAGRAM ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "İmparatorluklar yalnızca askeri güçle ayakta kaldı.",
      "Kara imparatorlukları bu dönemde durgunluk içindeydi; tarih yalnızca denizlerde yazıldı.",
    ],
    x: [
      "gk.tr-hist.ottoman-institutions:Osmanlı kurumlarını diğer imparatorluklarla karşılaştırmak",
      "econ.intl.trade:küresel ticaretin kazananları ve kaybedenleri",
    ],
    notes: ["İmparatorlukların kuruluş-yıkılış tarihlerini, nüfus ve ticaret rakamlarını akademik kaynaklardan doğrula; tek bir genel anlatıya dayanma."],
    rel: ["gk.tr-hist.ottoman-rise"],
    tags: ["dunya-tarihi", "imparatorluk", "karsilastirma"],
    src: true,
  })
  .o("gk.world.ap-revolutions", "Devrimler ve sanayileşmenin küresel sonuçları", {
    d: "Aydınlanma fikirlerinden beslenen siyasi devrimler, milliyetçiliğin yükselişi ve sanayileşmenin emek, kentleşme, emperyalizm ve küresel eşitsizlik üzerindeki sonuçları.",
    w: "Modern devlet, ulus kimliği ve küresel ekonomik düzenin nasıl ortaya çıktığını açıklar; değişimin farklı bölgelerde neden farklı hızda ve sonuçla gerçekleştiğini sorgulatır.",
    pre: ["gk.world.enlightenment", "gk.world.industrial~s"],
    q: [
      "Bir fabrika şehrin yanına kurulduğunda yalnızca üretim mi değişir? Aile, zaman algısı ve kent hayatında neyin değişeceğini tahmin et.",
    ],
    cq: [
      "Devrimler hangi fikirlerle meşrulaştırıldı ve hangi çelişkilerle karşılaştı?",
      "Sanayileşme neden bazı bölgelerde önce başladı?",
      "Sanayileşme ile emperyalizm ve küresel eşitsizlik arasında nasıl bir bağ vardır?",
    ],
    obj: [
      "İki devrimi nedenler, katılımcılar ve sonuçlar açısından karşılaştırır",
      "Sanayileşmenin toplumsal sonuçlarını bir neden-sonuç diyagramıyla gösterir",
      "Sanayileşmeyle ilgili bir veri serisini (nüfus, üretim, ücret) yorumlayıp sınırlarını belirtir",
    ],
    ev: "DIAGRAM YORUMLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Sanayileşme herkesin yaşam koşullarını hemen iyileştirdi.",
      "Devrimlerin tek bir nedeni vardır.",
    ],
    x: [
      "phys.thermo.engines:buhar makinesi ve ısı makinelerinin verimi",
      "econ.macro.growth:sanayileşme ve uzun dönemli ekonomik büyüme",
      "env.energy.resources:fosil yakıtlara geçişin uzun vadeli sonuçları",
    ],
    notes: ["Devrimlerin tarihlerini, olay sıralamalarını ve sayısal verileri birincil kaynaklardan ve güncel akademik çalışmalardan doğrula."],
    rel: ["gk.tr-hist.ottoman-reform"],
    tags: ["dunya-tarihi", "devrim", "sanayi"],
    src: true,
  })
  .o("gk.world.europe-reformation", "Avrupa'da Reform ve din savaşları", {
    d: "Kilise eleştirisinden doğan reform hareketleri, matbaanın rolü, Karşı Reform, din savaşları ve bunların devlet egemenliği ile dini hoşgörü fikirlerine etkisi.",
    w: "Dini bölünmenin siyasi düzeni nasıl dönüştürdüğünü ve modern egemenlik kavramının nasıl biçimlendiğini gösterir; bilgi teknolojisinin toplumsal çatışmadaki rolüne dair bir vaka sunar.",
    pre: ["gk.world.renaissance"],
    q: [
      "Bir eleştiri metni yüz yıl önce birkaç kişiye ulaşabilirken matbaayla binlerce kişiye ulaşıyor. Bu, bir tartışmanın seyrini nasıl değiştirir?",
    ],
    cq: [
      "Reform hareketlerinin dini, siyasi ve ekonomik nedenleri nelerdi?",
      "Matbaa reform fikirlerinin yayılmasında nasıl bir rol oynadı?",
      "Din savaşlarının sona ermesi devletler arası düzeni nasıl değiştirdi?",
    ],
    obj: [
      "Reformun nedenlerini dini, siyasi ve ekonomik başlıklar altında sınıflandırır",
      "Bir dönem broşürünü ya da propaganda görselini yazar-amaç-kitle açısından çözümler",
      "Din savaşlarının devlet egemenliği kavramına etkisini açıklar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Reform yalnızca dini bir tartışmaydı; siyaset ve ekonomiyle ilgisi yoktu.",
      "Din savaşları yalnızca iki taraf arasında geçti.",
    ],
    x: [
      "media.lit.persuasion:matbaa propagandası ile bugünkü ikna teknikleri",
      "art.history.renaissance-baroque:Reform ve Karşı Reform'un sanata etkisi",
    ],
    notes: ["Olayların tarihlerini, antlaşmaları ve kişilere atfedilen görüşleri birincil kaynaklardan doğrula."],
    rel: ["gk.world.europe-absolutism"],
    tags: ["avrupa-tarihi", "reform", "din"],
    src: true,
  })
  .o("gk.world.europe-absolutism", "Mutlakiyet ve anayasal monarşi", {
    d: "Güçlü merkezi monarşilerin bürokrasi, ordu ve vergiyle otoritelerini pekiştirmesi ile hükümdar gücünü parlamento ve yasalarla sınırlayan anayasal düzenlerin karşılaştırılması.",
    w: "Devlet gücünün nasıl merkezileştiğini ve nasıl sınırlandırılabileceğini gösterir; anayasa, temel haklar ve güçler ayrılığı tartışmalarının tarihsel zeminini kurar.",
    pre: ["gk.world.europe-reformation"],
    q: [
      "Bir kral savaş için para istiyor ama vergi vermesi gerekenler karşılığında söz hakkı talep ediyor. Bu pazarlık nasıl sonuçlanabilir? Olası iki senaryo yaz.",
    ],
    cq: [
      "Mutlak monarşiler otoritelerini hangi araçlarla kurdu?",
      "Bazı ülkelerde parlamentolar hükümdarın gücünü nasıl sınırladı?",
      "Vergi, savaş ve temsil arasındaki ilişki siyasi düzeni nasıl biçimlendirdi?",
    ],
    obj: [
      "Mutlakiyet ile anayasal monarşiyi güç kaynakları ve sınırlar açısından karşılaştıran bir tablo hazırlar",
      "Vergi-savaş-temsil ilişkisini bir neden-sonuç şemasıyla modeller",
      "Bir dönem metnini (ör. hak bildirgesi) siyaset felsefesi kavramlarıyla yorumlar",
    ],
    ev: "DIAGRAM YORUMLAMA MODELLEME",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Mutlak hükümdarlar hiçbir sınırlama olmadan istedikleri her şeyi yapabiliyordu.",
      "Anayasal monarşi ortaya çıkar çıkmaz demokrasi kuruldu.",
    ],
    x: [
      "gk.phil.political:toplum sözleşmesi ve meşruiyet kuramları",
      "gk.civics.state-constitution:anayasa ve güçler ayrılığı",
      "econ.macro.monetary-fiscal:devlet borçlanması ve vergilendirme",
    ],
    notes: ["Hükümdarların, belgelerin ve olayların tarihlerini birincil kaynaklardan doğrula."],
    rel: ["gk.world.enlightenment"],
    tags: ["avrupa-tarihi", "monarsi", "anayasa"],
    src: true,
  })
  .o("gk.world.europe-integration", "Avrupa'da bütünleşme", {
    d: "İkinci Dünya Savaşı sonrasında ekonomik iş birliğinden siyasi kurumlara uzanan Avrupa bütünleşme süreci, genişleme ve derinleşme tartışmaları, egemenlik ve ortak karar alma gerilimi.",
    w: "Devletlerin egemenliklerinin bir kısmını ortak kurumlara neden devrettiğini anlamayı sağlar; uluslararası iş birliği, ticaret ve kimlik tartışmalarının somut bir örneğidir.",
    pre: ["gk.world.cold-war", "gk.civics.international~s"],
    q: [
      "Uzun süre savaşmış iki ülke kömür ve çelik üretimini ortak bir kuruma bağlıyor. Bu neden barışı korumaya yardım edebilir? Bir oyun kuramı argümanı kur.",
    ],
    cq: [
      "Bütünleşmeyi başlatan güvenlik ve ekonomi kaygıları nelerdi?",
      "Ortak kurumlar kararlarını nasıl alır ve ulusal egemenlikle nasıl dengelenir?",
      "Genişleme ve derinleşme arasında hangi gerilimler vardır?",
    ],
    obj: [
      "Bütünleşmenin aşamalarını amaç ve araçlarıyla bir zaman çizelgesinde düzenler",
      "Ortak karar almanın yararlarını ve egemenlik kaygılarını karşılıklı argümanlarla tartışır",
      "Ekonomik bütünleşmenin ticaret üzerindeki etkisini basit bir modelle açıklar",
    ],
    ev: "DIAGRAM ACIKLAMA MODELLEME",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Avrupa bütünleşmesi baştan tek bir plana göre ilerledi.",
      "Bütünleşme yalnızca ekonomik bir projedir.",
    ],
    x: [
      "econ.micro.game-theory:iş birliği, güven ve tekrarlanan oyunlar",
      "econ.intl.trade:gümrük birliği ve ortak pazarın ticarete etkisi",
      "gk.civics.international:uluslararası kuruluşların işleyişi",
    ],
    notes: [
      "Antlaşma adlarını, tarihlerini, üye sayılarını ve kurumların yetkilerini resmi kaynaklardan doğrula; güncel siyasi gelişmeleri bu nesnenin kapsamı dışında tut.",
    ],
    rel: ["gk.world.globalization"],
    tags: ["avrupa-tarihi", "butunlesme", "uluslararasi"],
    src: true,
  })

  // ───────────────────────────── Coğrafya / Coğrafya
  .unit("Coğrafya", "Coğrafya")
  .o("gk.geo.human-culture", "Kültür coğrafyası: dil, din, yayılma", {
    d: "Dillerin, dinlerin ve kültürel öğelerin mekânsal dağılımı; yayılma türleri (genişlemeci, yer değiştirmeli, hiyerarşik) ve küreselleşmenin yerel kültürlere etkisi.",
    w: "Kültürün neden belirli yerlerde yoğunlaştığını ve nasıl yayıldığını mekânsal olarak düşünmeyi öğretir; göç, kimlik ve kültürel değişim tartışmalarını harita üzerinden okumayı sağlar.",
    pre: ["gk.geo.human"],
    q: [
      "Bir yemek, bir müzik türü ya da bir sözcük senin şehrine nasıl gelmiş olabilir? Yolunu tahmin et ve hangi yayılma türüne uyduğunu düşün.",
    ],
    cq: [
      "Kültürel öğeler hangi yayılma türleriyle yer değiştirir?",
      "Dil ve din dağılımları hangi tarihsel ve coğrafi süreçlerin izini taşır?",
      "Küreselleşme kültürü tekdüzeleştirir mi, yoksa yeni karışımlar mı üretir?",
    ],
    obj: [
      "Bir kültürel öğenin yayılmasını harita üzerinde gösterip yayılma türünü belirler",
      "Bir dil ya da din dağılımı haritasını tarihsel süreçlerle ilişkilendirerek yorumlar",
      "Küreselleşmenin yerel bir kültürel uygulama üzerindeki etkisini örnekle tartışır",
    ],
    ev: "YORUMLAMA DIAGRAM ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Kültürel yayılma yalnızca göçle olur.",
      "Bir dilin konuşulduğu bölge siyasi sınırlarla birebir örtüşür.",
    ],
    x: [
      "psy.language:dil gelişimi ve dil-düşünce ilişkisi",
      "bio.evolution:dil ağaçları ile filogenetik ağaçlar arasındaki yöntem benzerliği",
      "art.history.global:sanat biçimlerinin kültürler arası dolaşımı",
    ],
    notes: ["Konuşucu sayıları ve din dağılımı istatistiklerini güncel ve güvenilir kaynaklardan doğrula; kaynağın yöntemini not et."],
    rel: ["gk.geo.political", "gk.geo.maps"],
    tags: ["cografya", "kultur", "yayilma"],
    src: true,
  })
  .o("gk.geo.political", "Siyasi coğrafya: devletler, sınırlar", {
    d: "Devlet, ulus ve egemenlik kavramlarının mekânsal boyutu; sınır türleri ve oluşumu, merkezcil ve merkezkaç kuvvetler, yerinden yönetim ve seçim coğrafyası.",
    w: "Sınırların doğal değil insan yapımı olduğunu ve devletlerin bütünlüğünü hangi etkenlerin güçlendirip zayıflattığını gösterir; uluslararası ilişkileri harita üzerinden okumayı sağlar.",
    pre: ["gk.geo.human", "gk.civics.state-constitution~s"],
    q: [
      "Bir haritadaki düz, cetvelle çizilmiş gibi duran sınırlar neden var? Bu sınırların yanında yaşayan insanlar için ne gibi sonuçlar doğurmuş olabilir?",
    ],
    cq: [
      "Devlet, ulus ve ulus-devlet arasındaki farklar nelerdir?",
      "Sınırlar nasıl çizilir ve hangi anlaşmazlıklara yol açar?",
      "Hangi kuvvetler bir devleti birleştirir, hangileri böler?",
    ],
    obj: [
      "Sınır türlerini (doğal, geometrik, kültürel) haritalardan örneklerle sınıflandırır",
      "Bir devlet için merkezcil ve merkezkaç kuvvetleri bir tabloda çözümler",
      "Seçim bölgesi çiziminin sonuçları nasıl etkileyebileceğini basit bir örnek üzerinde hesaplar",
    ],
    ev: "YORUMLAMA HESAPLAMA ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Sınırlar doğal coğrafyanın kendiliğinden sonucudur.",
      "Her devlet tek bir ulustan oluşur.",
    ],
    x: [
      "gk.civics.democracy:seçim sistemleri ve temsil",
      "math.found.arithmetic:seçim bölgesi çiziminde oran ve dağılım hesapları",
      "gk.civics.international:sınır anlaşmazlıkları ve uluslararası hukuk",
    ],
    notes: ["Güncel sınır anlaşmazlıklarına girme; tarihsel örneklerin ayrıntılarını akademik kaynaklardan doğrula."],
    rel: ["gk.geo.human-culture", "gk.world.europe-integration"],
    tags: ["cografya", "siyasi", "sinir"],
    src: true,
  })
  .o("gk.geo.agriculture", "Tarım ve gıda sistemleri", {
    d: "Tarımın kökenleri ve yayılması, iklim ve toprağa göre tarım türleri, tarımsal devrimler, küresel gıda tedarik zincirleri ve gıda güvenliği.",
    w: "Yediğimiz yiyeceğin hangi coğrafi, ekonomik ve ekolojik süreçlerden geçtiğini gösterir; nüfus, su, çevre ve ekonomi konularını bir araya getirir.",
    pre: ["gk.geo.human", "env.land.water~s"],
    q: [
      "Kahvaltı tabağındaki her ürün nereden gelmiş olabilir? Toplam kaç kilometre yol yapmıştır? Tahmin et, sonra etiketlerden izini sür.",
    ],
    cq: [
      "İklim, toprak ve su tarım türlerini nasıl belirler?",
      "Tarımsal yenilikler verimi ve çevreyi nasıl etkiledi?",
      "Küresel gıda sistemleri gıda güvenliğini nasıl güçlendirir ya da kırılganlaştırır?",
    ],
    obj: [
      "Tarım türlerini (yoğun, yaygın, ticari, geçimlik) iklim ve pazar koşullarıyla ilişkilendirerek sınıflandırır",
      "Bir gıda ürününün tedarik zincirini haritalayıp çevresel maliyetlerini değerlendirir",
      "Tarımsal üretim verilerini yorumlayıp verim artışının yararlarını ve bedellerini tartışır",
    ],
    ev: "VERI_ANALIZI DIAGRAM YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Açlığın tek nedeni yeterli gıda üretilmemesidir.",
      "Yerel üretilen gıda her zaman daha düşük çevresel etkiye sahiptir.",
    ],
    x: [
      "bio.plants.structure:bitki büyümesi, su ve besin ihtiyacı",
      "env.land.water:sulama ve arazi kullanımının çevresel etkileri",
      "econ.micro.elasticity:gıda fiyatları ve talep esnekliği",
    ],
    notes: ["Üretim, verim ve gıda güvenliği istatistiklerini uluslararası kuruluşların güncel veri tabanlarından doğrula."],
    rel: ["gk.geo.urban"],
    tags: ["cografya", "tarim", "gida"],
    src: true,
  })
  .o("gk.geo.urban", "Kentler ve kentsel planlama", {
    d: "Kentlerin konumu ve büyümesi, kent içi arazi kullanım modelleri, ulaşım ve altyapı, gecekondulaşma, kentsel dönüşüm ve sürdürülebilir kent planlaması.",
    w: "Dünya nüfusunun giderek artan bir bölümünün yaşadığı kentlerin nasıl işlediğini ve nasıl daha iyi tasarlanabileceğini sorgulatır; yaşadığın şehri bir araştırma alanına dönüştürür.",
    pre: ["gk.geo.human", "env.population.human~s"],
    q: [
      "Şehrinin haritasına bak: sanayi, konut ve ticaret alanları nerede? Bu dağılım rastlantı mı, yoksa bir mantığı var mı? Bir model öner.",
    ],
    cq: [
      "Kentler neden belirli yerlerde kurulur ve büyür?",
      "Kent içi arazi kullanımını açıklayan modeller neyi açıklar, neyi açıklayamaz?",
      "Hızlı kentleşme hangi sorunları doğurur ve planlama bunlara nasıl yanıt verir?",
    ],
    obj: [
      "Yaşadığı kentin arazi kullanımını bir haritada gösterip bir kent modeliyle karşılaştırır",
      "Bir kentsel sorunu (ulaşım, konut, ısı adası) verilerle tanımlayıp çözüm önerileri sunar",
      "Kentsel dönüşümün farklı paydaşlar üzerindeki etkilerini yorumlar",
    ],
    ev: "VERI_ANALIZI DIAGRAM MODELLEME ARASTIRMA_UYGULAMASI",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Kentleşme her zaman sanayileşmenin sonucudur.",
      "Daha fazla yol yapmak trafik sıkışıklığını kalıcı olarak çözer.",
    ],
    x: [
      "env.sustainability:sürdürülebilir kent ve çevre politikası",
      "math.discrete.graph-theory:ulaşım ağlarının graf olarak çözümlenmesi",
      "phys.thermo.heat-transfer:kentsel ısı adası ve yüzeylerin ısı soğurması",
    ],
    ra: ["Mahalle ölçeğinde ulaşım ya da yeşil alan erişimi üzerine küçük bir saha araştırması"],
    notes: ["Kent nüfusu ve kentleşme oranlarını resmi istatistik kurumlarının güncel verilerinden doğrula."],
    rel: ["gk.geo.agriculture", "gk.geo.turkey"],
    tags: ["cografya", "kent", "planlama"],
    src: true,
  })
  .done();
