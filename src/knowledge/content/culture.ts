import { builder } from "../dsl";

/**
 * GENEL_KULTUR — tarih, coğrafya, toplum, düşünce ve kültür.
 * Tarihsel nesneler `src: true`: yapı, neden-sonuç ve yöntem öne çıkar; kesin
 * tarih, sayı ve iddialar öğrenci tarafından birincil kaynaklardan doğrulanmalıdır.
 */
export const CULTURE = builder("GENEL_KULTUR")
  // ───────────────────────────── Tarih / Yöntem
  .unit("Tarih", "Yöntem")
  .o("gk.method.historical-thinking", "Tarihsel düşünme: kaynak, bağlam ve yorum", {
    d: "Geçmişi ezberlenecek olaylar dizisi olarak değil, kaynaklardan kurulan ve tartışılan bir yorum olarak okuma yöntemi.",
    w: "Tüm tarih, bilim tarihi ve medya okuryazarlığı nesnelerinin temelidir; bir iddianın kime, ne zaman ve hangi amaçla ait olduğunu sormayı öğretir.",
    q: [
      "Aynı savaşı iki karşı tarafın ders kitabı nasıl anlatır? Hangisinin 'doğru' olduğuna nasıl karar verirsin?",
      "Bir olaydan yüz yıl sonra yazılmış bir kitap mı, olay günü tutulmuş bir günlük mü daha güvenilirdir? Her zaman mı?",
    ],
    cq: [
      "Birincil ve ikincil kaynak arasındaki fark yorumu nasıl etkiler?",
      "Bir kaynağın yazarı, amacı ve kitlesi içeriğini nasıl biçimlendirir?",
      "Neden-sonuç ilişkisi kurarken tek nedenli açıklamalardan nasıl kaçınılır?",
    ],
    obj: [
      "Bir kaynağı birincil/ikincil olarak sınıflandırır ve yazar-amaç-kitle sorularıyla sorgular",
      "Aynı olayın iki farklı anlatısını karşılaştırıp farkların kaynağını açıklar",
      "Bir olay için çok nedenli bir açıklama şeması (kısa ve uzun vadeli nedenler) çizer",
      "Bugünün değerleriyle geçmişi yargılama (anakronizm) örneklerini tespit eder",
    ],
    ev: "YORUMLAMA ACIKLAMA DIAGRAM TRANSFER",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Tarih tek ve değişmez bir hikâyedir; tarihçiler yalnızca onu aktarır.",
      "Birincil kaynak her zaman tarafsız ve doğrudur.",
      "Bir olayın tek bir 'asıl nedeni' vardır.",
    ],
    x: [
      "media.lit.source-evaluation:aynı kaynak sorgulama alışkanlığı güncel bilgiye uygulanır",
      "res.lit.reading:bilimsel makaleyi de bağlamı ve yazarın iddiasıyla okumak",
      "res.method.causal:nedensellik ve karıştırıcı etkenler tarihte de geçerli",
    ],
    ra: ["Arşiv belgesi üzerinde küçük bir kaynak eleştirisi çalışması"],
    rel: ["gk.phil.epistemology", "gk.sci-hist.ancient-medieval"],
    tags: ["tarih", "yontem", "kaynak"],
  })

  // ───────────────────────────── Tarih / Türk tarihi
  .unit("Tarih", "Türk tarihi")
  .o("gk.tr-hist.early-turks", "İlk Türk devletleri ve Orta Asya", {
    d: "Orta Asya bozkırlarında kurulan erken Türk siyasi yapılarının yaşam biçimi, devlet anlayışı ve komşularıyla ilişkileri.",
    w: "Sonraki Türk-İslam ve Anadolu dönemlerindeki devlet geleneğini (ülke-töre-hükümdar ilişkisi) anlamanın zeminidir; bozkır ekolojisiyle siyaset arasındaki bağı gösterir.",
    pre: ["gk.method.historical-thinking"],
    q: [
      "Göçebe bir topluluk yazılı kayıt az bırakıyorsa, tarihçiler onun hakkında neyi nereden öğrenir? Hangi kaynak türlerini tahmin edersin?",
      "Bozkırda iklimdeki küçük bir değişiklik bir devletin yıkılmasına nasıl yol açabilir?",
    ],
    cq: [
      "Bozkır ekonomisi ve hayvancılık siyasi örgütlenmeyi nasıl şekillendirdi?",
      "Erken Türk yazıtları ve komşu kaynakları (örneğin Çin kaynakları) bize ne tür bilgi verir ve sınırları nedir?",
      "Merkezi otorite ile boy yapısı arasındaki gerilim nasıl işledi?",
    ],
    obj: [
      "Göçebe ekonominin siyasi yapıya etkisini neden-sonuç zinciriyle açıklar",
      "Bir yazıt çevirisini yazarın amacı açısından yorumlar",
      "Farklı kaynak türlerinin (yazıt, komşu kronikleri, arkeoloji) güvenilirlik sınırlarını karşılaştırır",
    ],
    ev: "ACIKLAMA YORUMLAMA DIAGRAM",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Göçebe toplumların devlet kurumu yoktu.",
      "Tüm bilgi Türk kaynaklarından gelir; komşu kaynakların önemi yoktur.",
    ],
    x: ["gk.geo.physical:bozkır iklimi ve yer şekilleri yaşam biçimini belirler"],
    notes: ["Devletlerin kuruluş-yıkılış tarihlerini ve yazıtların tarihlendirmesini birincil kaynak ve güncel akademik çalışmalardan doğrula."],
    rel: ["gk.world.ancient"],
    tags: ["turk-tarihi", "orta-asya"],
    src: true,
  })
  .o("gk.tr-hist.islam-turks", "Türk-İslam devletleri: Karahanlılar, Gazneliler, Büyük Selçuklu", {
    d: "Türklerin İslamiyet'i kabulünden sonra kurulan devletlerin yönetim, kültür ve bilim ortamı.",
    w: "Bozkır devlet geleneği ile İslam dünyasının kurumlarının birleşmesini gösterir; Anadolu ve Osmanlı kurumlarının (ikta, medrese, vezirlik) kökenine götürür.",
    pre: ["gk.tr-hist.early-turks"],
    q: [
      "Bir topluluk yeni bir din kabul ettiğinde, eski devlet gelenekleri ortadan mı kalkar, yoksa yeni kurumlarla mı harmanlanır? Bir tahmin yap.",
      "Bir sultanın sarayında şairler, âlimler ve astronomlar neden himaye görür?",
    ],
    cq: [
      "İslamiyet'in kabulü siyasi meşruiyet anlayışını nasıl değiştirdi?",
      "İkta sistemi askeri ve ekonomik düzeni nasıl bağladı?",
      "Bu dönemin bilim ve edebiyat ürünleri hangi kurumlar sayesinde gelişti?",
    ],
    obj: [
      "Bozkır ve İslam devlet geleneklerinin ortak ve farklı yönlerini tablo halinde karşılaştırır",
      "İkta sisteminin işleyişini bir akış diyagramıyla gösterir",
      "Medrese ve saray himayesinin bilim üretimine etkisini bir örnekle açıklar",
    ],
    ev: "ACIKLAMA DIAGRAM YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "İslamiyet'in kabulü tek bir anda ve tüm toplulukta aynı anda gerçekleşti.",
      "Bu devletler birbirinin kesintisiz devamıdır.",
    ],
    x: ["gk.sci-hist.ancient-medieval:İslam dünyasında bilimin kurumsal ortamı"],
    notes: ["Hükümdar adları, savaş tarihleri ve kurum terimlerinin tanımlarını birincil kaynak ve akademik ansiklopedilerden doğrula."],
    rel: ["gk.world.medieval"],
    tags: ["turk-tarihi", "islam", "selcuklu"],
    src: true,
  })
  .o("gk.tr-hist.anatolia", "Anadolu'nun Türkleşmesi ve Türkiye Selçukluları", {
    d: "Türk topluluklarının Anadolu'ya yerleşmesi, Türkiye Selçuklu Devleti'nin kurumları ve beylikler dönemine geçiş.",
    w: "Bugünkü Türkiye'nin kültürel ve demografik dokusunun nasıl oluştuğunu açıklar; Osmanlı'nın doğduğu siyasi ortamı hazırlar.",
    pre: ["gk.tr-hist.islam-turks"],
    q: [
      "Bir bölgenin dili ve kültürü 'fetihle' mi, yoksa yüzyıllar süren göç ve yerleşimle mi değişir? İkisini nasıl ayırt edersin?",
      "Kervansaraylar bir devletin ekonomisi hakkında ne söyler?",
    ],
    cq: [
      "Anadolu'ya yerleşme hangi aşamalarla ve hangi etkenlerle gerçekleşti?",
      "Türkiye Selçuklularının ticaret ve şehir politikaları nelerdi?",
      "Merkezi otoritenin zayıflaması beylikler dönemine nasıl yol açtı?",
    ],
    obj: [
      "Yerleşim sürecini askeri, demografik ve ekonomik etkenlere ayırarak açıklar",
      "Kervansaray ağını ticaret yollarıyla ilişkilendiren bir harita taslağı çizer",
      "Merkezi otoritenin çözülmesini çok nedenli bir şemayla yorumlar",
    ],
    ev: "ACIKLAMA DIAGRAM YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Anadolu tek bir savaşla bir anda Türkleşti.",
      "Beylikler dönemi yalnızca bir 'çöküş ve karmaşa' dönemidir.",
    ],
    x: ["gk.geo.turkey:yer şekilleri ve ticaret yolları yerleşimi biçimlendirir", "gk.geo.maps:tarihsel haritaları okumak"],
    notes: ["Savaş, kuruluş ve yıkılış tarihlerini ve nüfus tahminlerini akademik kaynaklardan doğrula."],
    rel: ["gk.tr-hist.ottoman-rise"],
    tags: ["turk-tarihi", "anadolu"],
    src: true,
  })
  .o("gk.tr-hist.ottoman-rise", "Osmanlı Devleti'nin kuruluşu ve yükselişi", {
    d: "Küçük bir uç beyliğinin geniş bir imparatorluğa dönüşmesinin siyasi, askeri ve toplumsal nedenleri.",
    w: "Bir devletin hangi koşullarda hızla büyüdüğünü sorgulamak için iyi bir vaka; kurumlar ve modernleşme nesnelerine zemin hazırlar.",
    pre: ["gk.tr-hist.anatolia"],
    q: [
      "Birçok beylik arasından neden biri imparatorluğa dönüştü? Coğrafya mı, liderlik mi, kurumlar mı, şans mı? Önce sırala, sonra gerekçelendir.",
    ],
    cq: [
      "Kuruluş döneminin anlatılarında efsane ile belgeyi nasıl ayırırız?",
      "Konum, iskân politikası ve askeri örgütlenme büyümeye nasıl katkı yaptı?",
      "Fetihler ekonomik ve kültürel yapıyı nasıl dönüştürdü?",
    ],
    obj: [
      "Büyümenin nedenlerini coğrafi, kurumsal ve konjonktürel olarak sınıflandırır",
      "Kuruluş efsanesi ile belgeye dayalı anlatıyı ayırt edip farkın nedenini açıklar",
      "Bir fethin uzun vadeli sonuçlarını neden-sonuç zinciriyle yorumlar",
    ],
    ev: "ACIKLAMA YORUMLAMA DIAGRAM",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Yükseliş yalnızca askeri başarıyla açıklanır.",
      "Kuruluş efsaneleri tarihsel belge değeri taşır.",
    ],
    x: ["gk.geo.maps:sınır değişimlerini haritadan okumak"],
    notes: ["Padişah dönemleri, fetih tarihleri ve kuruluş tarihine ilişkin tartışmaları akademik kaynaklardan doğrula."],
    rel: ["gk.world.renaissance"],
    tags: ["osmanli", "turk-tarihi"],
    src: true,
  })
  .o("gk.tr-hist.ottoman-institutions", "Osmanlı kurumları: yönetim, toplum, ekonomi", {
    d: "Merkezi yönetim, toprak düzeni, askeri yapı, hukuk ve millet sistemi gibi Osmanlı kurumlarının işleyişi.",
    w: "Bir imparatorluğun çok dinli, çok dilli bir nüfusu nasıl yönettiğini gösterir; reform ve modernleşme tartışmalarının neyi değiştirmeye çalıştığını anlamanın ön koşuludur.",
    pre: ["gk.tr-hist.ottoman-rise"],
    q: [
      "Bir devlet maaş ödemek için yeterli nakde sahip değilse askerlerini nasıl besler? Bir çözüm tasarla, sonra tımar sistemiyle karşılaştır.",
    ],
    cq: [
      "Tımar sistemi askeri, mali ve tarımsal işlevleri nasıl birleştirdi?",
      "Merkezi yönetimde divan, kadılık ve devşirme gibi kurumlar nasıl işliyordu?",
      "Farklı dini toplulukların hukuki konumu nasıl düzenleniyordu?",
    ],
    obj: [
      "Tımar sistemini kaynak ve yükümlülük akışlarıyla diyagrama döker",
      "Bir kurumun işlevini ve zamanla nasıl değiştiğini açıklar",
      "Kurumlar arasındaki bağımlılığı (birinin bozulması diğerini nasıl etkiler) modelleyen bir şema çizer",
    ],
    ev: "DIAGRAM ACIKLAMA MODELLEME",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Osmanlı kurumları yüzyıllar boyunca hiç değişmeden kaldı.",
      "Padişahın yetkisi sınırsızdı; hiçbir hukuk ya da kurum onu bağlamazdı.",
    ],
    x: [
      "gk.econ.macro:para, vergi ve enflasyonun devlet maliyesine etkisi",
      "gk.civics.law-basics:hukuk düzeni ve yargı kurumları",
    ],
    notes: ["Kurumların ortaya çıkış ve dönüşüm tarihlerini ile terimlerin anlamlarını akademik kaynaklardan doğrula."],
    rel: ["gk.tr-hist.ottoman-reform"],
    tags: ["osmanli", "kurumlar"],
    src: true,
  })
  .o("gk.tr-hist.ottoman-reform", "Osmanlı'da yenileşme ve modernleşme", {
    d: "Askeri yenilgiler ve dünyadaki dönüşümler karşısında Osmanlı'nın ordu, hukuk, eğitim ve yönetimde yaptığı reformlar.",
    w: "Modernleşmenin ne zaman ve neden 'yukarıdan' yapıldığını sorgulatır; Cumhuriyet dönemi inkılaplarının arka planını oluşturur.",
    pre: ["gk.tr-hist.ottoman-institutions", "gk.world.enlightenment~s"],
    q: [
      "Bir reform yalnızca orduyu modernleştirmeyi hedeflerse, bu değişim eğitimi ve hukuku da değiştirmek zorunda kalır mı? Zincirleme etkileri tahmin et.",
    ],
    cq: [
      "Reformları başlatan iç ve dış etkenler nelerdi?",
      "Askeri reform neden eğitim ve hukuk reformunu da gerektirdi?",
      "Anayasal düzen ve meşrutiyet tartışmaları hangi fikirlerden beslendi?",
    ],
    obj: [
      "Reformları alanlarına göre (ordu, eğitim, hukuk, yönetim) sınıflandırır ve aralarındaki bağımlılığı açıklar",
      "Bir reform belgesinin amacını ve hedef kitlesini yorumlar",
      "Aydınlanma fikirlerinin Osmanlı'daki karşılıklarını karşılaştırır",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Reformlar yalnızca Batı'yı taklit etmekti.",
      "Reformlar toplumun tamamında aynı hızla ve dirençsiz uygulandı.",
    ],
    x: ["gk.civics.state-constitution:anayasal düzen fikrinin gelişimi", "gk.sci-hist.turkey:modern eğitim kurumlarının bilime etkisi"],
    notes: ["Fermanların, anayasal belgelerin ve reform adımlarının tarihlerini birincil kaynaklardan doğrula."],
    rel: ["gk.world.enlightenment"],
    tags: ["osmanli", "modernlesme"],
    src: true,
  })
  .o("gk.tr-hist.ww1-independence", "I. Dünya Savaşı ve Milli Mücadele", {
    d: "Osmanlı'nın I. Dünya Savaşı'na girişi, cepheler, savaş sonrası işgaller ve Milli Mücadele'nin örgütlenmesi.",
    w: "Türkiye Cumhuriyeti'nin kuruluşuna giden süreci ve ulus-devlet fikrinin ortaya çıkışını anlamak için zorunludur.",
    pre: ["gk.tr-hist.ottoman-reform", "gk.world.ww1~s"],
    q: [
      "Yenilmiş bir ordunun kalıntılarından ve dağınık yerel direnişlerden tek bir merkezi hareket nasıl doğar? Hangi koşullar gerekir?",
    ],
    cq: [
      "Osmanlı hangi koşullarda ve hangi beklentilerle savaşa girdi?",
      "Savaş sonrası antlaşmalar ve işgaller hangi tepkileri doğurdu?",
      "Milli Mücadele'de kongreler ve meclis nasıl bir meşruiyet zemini kurdu?",
    ],
    obj: [
      "Savaşa giriş kararını iç ve dış etkenlerle açıklar",
      "Milli Mücadele'nin örgütlenme aşamalarını bir zaman çizelgesi ve akış şemasıyla gösterir",
      "Bir genelge ya da kongre kararının metnini amaç ve meşruiyet açısından yorumlar",
    ],
    ev: "ACIKLAMA YORUMLAMA DIAGRAM",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Milli Mücadele yalnızca askeri bir süreçtir; diplomasi ve örgütlenme ikincildir.",
      "Savaşa giriş tek bir kişinin kararıydı ve hiçbir yapısal neden yoktu.",
    ],
    x: ["gk.civics.international:antlaşmalar ve uluslararası düzen"],
    notes: ["Cephe, kongre ve antlaşma tarihlerini ve kayıp sayılarını birincil kaynaklardan ve akademik çalışmalardan doğrula."],
    rel: ["gk.world.ww1", "gk.tr-hist.republic"],
    tags: ["milli-mucadele", "turk-tarihi"],
    src: true,
  })
  .o("gk.tr-hist.republic", "Cumhuriyet'in kuruluşu, Atatürk ilke ve inkılapları", {
    d: "Cumhuriyet'in ilanı ve hukuk, eğitim, toplum ve ekonomi alanlarındaki inkılapların amaç ve içerikleri.",
    w: "Bugünkü devlet yapısının, laiklik ve hukuk sisteminin kökenini açıklar; vatandaşlık ve anayasa nesneleriyle doğrudan bağlantılıdır.",
    pre: ["gk.tr-hist.ww1-independence"],
    q: [
      "Bir ülkede alfabe değiştiğinde neler olur? Okuma yazma, kitap basımı ve kuşaklar arası iletişim üzerindeki etkileri tahmin et.",
    ],
    cq: [
      "İnkılaplar hangi sorunlara çözüm olarak tasarlandı?",
      "İlkeler (cumhuriyetçilik, laiklik vb.) birbirini nasıl tamamlar?",
      "Hukuk ve eğitim reformlarının uzun vadeli toplumsal etkileri nelerdir?",
    ],
    obj: [
      "Her inkılabı hedeflediği sorun ve alanla eşleştiren bir tablo hazırlar",
      "İlkeler arasındaki ilişkiyi bir kavram haritasıyla gösterir",
      "Bir inkılabın kısa ve uzun vadeli etkilerini kaynaklara dayanarak yorumlar",
    ],
    ev: "ACIKLAMA DIAGRAM YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "L",
    mis: [
      "İnkılaplar birbirinden bağımsız, tek tek alınmış kararlardır.",
      "İnkılapların hepsi aynı anda yapıldı.",
    ],
    x: ["gk.civics.state-constitution:anayasal düzenin kuruluşu", "gk.sci-hist.turkey:üniversite reformu ve bilim kurumları"],
    notes: ["İnkılapların tarihlerini ve yasal düzenlemelerin metinlerini resmî ve akademik kaynaklardan doğrula."],
    rel: ["gk.civics.democracy"],
    tags: ["cumhuriyet", "ataturk", "inkilaplar"],
    src: true,
  })
  .o("gk.tr-hist.modern-turkey", "Çok partili dönemden günümüze Türkiye", {
    d: "Çok partili sisteme geçişten itibaren Türkiye'nin siyasi, ekonomik ve toplumsal dönüşümünün ana eğilimleri.",
    w: "Bugünkü kurumları ve tartışmaları tarihsel bağlama oturtmayı sağlar; ekonomi, demokrasi ve uluslararası ilişkiler nesneleriyle bağ kurar.",
    pre: ["gk.tr-hist.republic", "gk.world.cold-war~s"],
    q: [
      "Bir ülkenin dış politikası küresel bir rekabet ortamında (örneğin iki kutuplu dünya) nasıl şekillenir? Seçenekleri ve bedellerini tahmin et.",
    ],
    cq: [
      "Çok partili sisteme geçişi hangi iç ve dış etkenler hızlandırdı?",
      "Ekonomi politikalarındaki dönüşümler (devletçilik, dışa açılma) hangi gerekçelere dayandı?",
      "Kentleşme ve göç toplumsal yapıyı nasıl değiştirdi?",
    ],
    obj: [
      "Dönemleri ana eğilimlerine göre (siyasi, ekonomik, toplumsal) özetleyen bir zaman çizelgesi kurar",
      "Bir ekonomi politikasının gerekçesini ve sonuçlarını veriye dayanarak yorumlar",
      "Güncel bir kurumsal yapının tarihsel kökenini kaynak göstererek açıklar",
    ],
    ev: "YORUMLAMA VERI_ANALIZI ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Yakın tarih 'tarih' sayılmaz; yalnızca görüş meselesidir.",
      "Tek bir olay bir dönemin tüm özelliklerini açıklar.",
    ],
    x: ["gk.econ.macro:büyüme ve enflasyon verilerini okumak", "gk.geo.human:kentleşme ve iç göç"],
    notes: [
      "Yakın tarih tartışmalıdır: farklı bakış açılarından akademik kaynakları karşılaştır, tarihleri ve verileri resmî istatistiklerden doğrula.",
    ],
    rel: ["gk.civics.democracy", "gk.world.globalization"],
    tags: ["turkiye", "yakin-tarih"],
    src: true,
  })

  // ───────────────────────────── Tarih / Dünya tarihi
  .unit("Tarih", "Dünya tarihi")
  .o("gk.world.ancient", "İlk uygarlıklar ve antik dünya", {
    d: "Tarım, yerleşik yaşam, yazı ve şehir devletlerinin doğuşu; Mezopotamya, Mısır, Anadolu, Hint, Çin ve Akdeniz uygarlıkları.",
    w: "Devlet, hukuk, yazı ve bilimin kökenlerini görmeyi sağlar; antik bilim ve felsefe nesnelerinin zeminidir.",
    pre: ["gk.method.historical-thinking"],
    q: [
      "Tarım insanları daha mı mutlu, daha mı sağlıklı yaptı? Önce tahmin et, sonra iskelet kalıntılarının ne söyleyebileceğini düşün.",
      "Yazı neden önce şiir için değil de muhasebe için ortaya çıkmış olabilir?",
    ],
    cq: [
      "Tarımın ortaya çıkışı toplumsal yapıyı nasıl değiştirdi?",
      "Yazı, hukuk ve bürokrasi neden birlikte gelişti?",
      "Farklı uygarlıklar coğrafyalarından nasıl etkilendi?",
    ],
    obj: [
      "Tarım-artı ürün-uzmanlaşma-devlet zincirini neden-sonuç diyagramıyla gösterir",
      "İki antik uygarlığı coğrafya, yönetim ve inanç açısından karşılaştırır",
      "Arkeolojik bir buluntudan çıkarılabilecek ve çıkarılamayacak bilgileri ayırt eder",
    ],
    ev: "DIAGRAM ACIKLAMA YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "L",
    mis: [
      "Uygarlık tek bir merkezde doğup oradan yayıldı.",
      "Antik insanlar bugünkülerden daha az zekiydi.",
    ],
    x: [
      "gk.geo.physical:nehir havzaları ve iklim yerleşimi belirledi",
      "math.found.arithmetic:sayı sistemlerinin ve ölçmenin kökeni",
    ],
    notes: ["Uygarlıkların kronolojisini ve arkeolojik tarihlendirmeleri güncel akademik kaynaklardan doğrula."],
    rel: ["gk.sci-hist.ancient-medieval"],
    tags: ["antik", "dunya-tarihi"],
    src: true,
  })
  .o("gk.world.medieval", "Orta Çağ: Avrupa, İslam dünyası ve Asya", {
    d: "Feodal Avrupa, İslam dünyasının siyasi ve kültürel yapısı, Bizans ve Doğu Asya'daki gelişmelerin karşılaştırmalı görünümü.",
    w: "'Karanlık çağ' klişesini sorgulamayı öğretir; bilgi aktarımının uygarlıklar arasında nasıl gerçekleştiğini gösterir.",
    pre: ["gk.world.ancient"],
    q: [
      "'Orta Çağ karanlık bir çağdı' cümlesi Bağdat, Kurtuba ya da Çin'deki biri için de doğru olur muydu? Neden?",
    ],
    cq: [
      "Feodalizm toprak, askerlik ve sadakati nasıl birbirine bağladı?",
      "Bilgi ve teknoloji uygarlıklar arasında hangi yollarla aktarıldı?",
      "Ticaret yolları ve salgınlar toplumları nasıl dönüştürdü?",
    ],
    obj: [
      "Feodal düzen ile ikta sistemini işlev açısından karşılaştırır",
      "Bir bilginin ya da teknolojinin uygarlıklar arası yolculuğunu harita üzerinde izler",
      "'Karanlık çağ' kavramının hangi bakış açısını yansıttığını açıklar",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "L",
    mis: [
      "Orta Çağ'da hiçbir bilimsel gelişme olmadı.",
      "Orta Çağ insanları dünyanın düz olduğuna inanıyordu.",
    ],
    x: ["gk.sci-hist.ancient-medieval:İslam dünyasında ve Avrupa'da bilim", "bio.immune:salgın hastalıkların biyolojisi"],
    notes: ["Devlet ve olay tarihlerini, salgınların etkilerine ilişkin sayıları akademik kaynaklardan doğrula."],
    rel: ["gk.tr-hist.islam-turks"],
    vs: ["gk.world.renaissance"],
    tags: ["orta-cag", "dunya-tarihi"],
    src: true,
  })
  .o("gk.world.renaissance", "Rönesans, Reform ve Coğrafi Keşifler", {
    d: "Avrupa'da sanat ve düşüncede yenilenme, matbaanın etkisi, dinde reform hareketleri ve okyanus aşırı keşiflerin sonuçları.",
    w: "Bilimsel Devrim'in ve modern dünyanın arka planını kurar; bilgi teknolojisinin (matbaa) toplumu nasıl değiştirdiğine dair bugünle karşılaştırılabilecek bir vaka sunar.",
    pre: ["gk.world.medieval"],
    q: [
      "Matbaa ile internet arasında nasıl bir benzerlik kurabilirsin? Bilginin ucuzlaması iyi ve kötü hangi sonuçları doğurur?",
    ],
    cq: [
      "Matbaa bilginin yayılmasını ve otoriteyi nasıl değiştirdi?",
      "Reform hareketleri siyasi düzeni nasıl etkiledi?",
      "Coğrafi keşiflerin ekonomik ve insani sonuçları nelerdi (sömürgecilik dahil)?",
    ],
    obj: [
      "Matbaanın etkilerini kısa ve uzun vadeli olarak sınıflandırır ve dijital medyayla karşılaştırır",
      "Keşiflerin farklı toplumlar açısından sonuçlarını çok perspektifli olarak yorumlar",
      "Rönesans'ı tek bir 'yeniden doğuş' anı olarak görmenin sınırlarını açıklar",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Keşifler yalnızca Avrupa açısından yazılabilecek bir 'başarı' hikâyesidir.",
      "Rönesans ani bir kopuştu; Orta Çağ'la hiçbir süreklilik yoktu.",
    ],
    x: ["media.lit.algorithms:bilginin yayılma teknolojisi toplumu dönüştürür", "gk.art.visual:Rönesans sanatında perspektif"],
    notes: ["Olay ve kişi tarihlerini akademik kaynaklardan doğrula."],
    rel: ["gk.sci-hist.scientific-revolution", "gk.tr-hist.ottoman-rise"],
    tags: ["ronesans", "reform", "kesifler"],
    src: true,
  })
  .o("gk.world.enlightenment", "Aydınlanma ve devrimler çağı", {
    d: "Akıl, haklar ve toplum sözleşmesi fikirlerinin yayılması ve bu fikirlerin Amerikan ve Fransız devrimleriyle siyasi düzene yansıması.",
    w: "Modern anayasaların, insan hakları fikrinin ve Osmanlı reformlarının düşünsel arka planını oluşturur.",
    pre: ["gk.world.renaissance", "gk.sci-hist.scientific-revolution~s"],
    q: [
      "Doğa yasalarla işliyorsa toplum da 'yasalarla' tasarlanabilir mi? Bilimsel Devrim'in siyasete böyle bir etkisi olmuş olabilir mi?",
    ],
    cq: [
      "Aydınlanma düşünürlerinin ortak varsayımları nelerdi?",
      "Toplum sözleşmesi fikri meşruiyeti nasıl yeniden tanımladı?",
      "Devrimler fikirleri pratiğe dökerken hangi çelişkilerle karşılaştı?",
    ],
    obj: [
      "Toplum sözleşmesi fikrinin farklı versiyonlarını karşılaştırır",
      "Bir hak bildirgesinden kısa bir pasajı bağlamı içinde yorumlar",
      "Bilimsel Devrim ile siyasi düşünce arasındaki etkileşimi bir örnekle açıklar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Aydınlanma düşünürleri tek bir görüşü paylaşıyordu.",
      "Devrimlerin ilan ettiği haklar başından itibaren herkesi kapsıyordu.",
    ],
    x: ["gk.phil.political:toplum sözleşmesi kuramları", "gk.civics.state-constitution:anayasal hakların kökeni"],
    notes: ["Düşünürlerin eser ve tarihlerini, devrimlerin kronolojisini birincil kaynaklardan doğrula."],
    rel: ["gk.tr-hist.ottoman-reform"],
    tags: ["aydinlanma", "devrimler"],
    src: true,
  })
  .o("gk.world.industrial", "Sanayi Devrimi ve emperyalizm", {
    d: "Buhar gücü, fabrika üretimi ve kentleşmeyle gelen dönüşüm; hammadde ve pazar arayışının emperyalizme bağlanması.",
    w: "Enerji, teknoloji ve toplum ilişkisini gösterir; termodinamiğin tarihsel bağlamını ve bugünkü iklim tartışmasının kökenini anlatır.",
    pre: ["gk.world.enlightenment"],
    q: [
      "Buhar makinesi önce bilimsel kuramdan mı doğdu, yoksa kuram makineyi anlamaya çalışırken mi gelişti? Tahmin et.",
    ],
    cq: [
      "Sanayileşmeyi başlatan teknolojik, ekonomik ve coğrafi koşullar nelerdi?",
      "Fabrika düzeni çalışma hayatını ve kentleri nasıl değiştirdi?",
      "Sanayileşme ile emperyalizm arasındaki bağ nedir?",
    ],
    obj: [
      "Sanayileşmenin önkoşullarını bir neden-sonuç ağıyla gösterir",
      "Buhar makinesi ile termodinamik arasındaki karşılıklı etkiyi açıklar",
      "Emperyalizmin ekonomik gerekçelerini ve insani bedellerini farklı perspektiflerden yorumlar",
    ],
    ev: "DIAGRAM ACIKLAMA YORUMLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Sanayi Devrimi kısa sürede tamamlanmış tek bir olaydır.",
      "Teknoloji her zaman bilimin uygulamasıdır; ters yönde etki olmaz.",
    ],
    x: [
      "phys.thermo.laws:ısı makinelerinin verimi sorusu termodinamiği doğurdu",
      "gk.geo.climate-change:fosil yakıt kullanımının başlangıcı",
      "gk.econ.macro:büyüme ve üretkenlik",
    ],
    notes: ["İcat tarihlerini ve ekonomik verileri akademik kaynaklardan doğrula."],
    rel: ["gk.world.ww1"],
    tags: ["sanayi", "emperyalizm"],
    src: true,
  })
  .o("gk.world.ww1", "I. Dünya Savaşı", {
    d: "Büyük güçler arasındaki rekabetin, ittifak sistemlerinin ve milliyetçiliğin yol açtığı küresel savaş ve sonuçları.",
    w: "Çok nedenli açıklamanın klasik örneğidir; Osmanlı'nın sonu ve yeni ulus-devletlerin doğuşu bu savaşla bağlantılıdır.",
    pre: ["gk.world.industrial"],
    q: [
      "Tek bir suikast neden dünya savaşına dönüştü? 'Kıvılcım' ile 'barut' arasındaki farkı kendi örneğinle açıkla.",
    ],
    cq: [
      "Savaşın uzun vadeli nedenleri (ittifaklar, silahlanma, emperyalizm, milliyetçilik) nasıl etkileşti?",
      "Sanayi teknolojisi savaşın doğasını nasıl değiştirdi?",
      "Barış antlaşmaları neden kalıcı barış getirmedi?",
    ],
    obj: [
      "Savaşın nedenlerini kısa ve uzun vadeli olarak sınıflandıran bir diyagram çizer",
      "İttifak sistemini bir ağ modeli olarak gösterip zincirleme tepkiyi açıklar",
      "Barış düzenlemelerinin sonraki çatışmalara etkisini yorumlar",
    ],
    ev: "DIAGRAM MODELLEME YORUMLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Savaşın tek nedeni suikasttır.",
      "Tüm taraflar savaşın kısa süreceğini bilmesine rağmen savaşa girdi.",
    ],
    x: ["math.discrete.graph-theory:ittifakları bir graf olarak modellemek"],
    notes: ["Tarihleri, cepheleri ve kayıp sayılarını akademik kaynaklardan doğrula."],
    rel: ["gk.tr-hist.ww1-independence"],
    tags: ["dunya-savasi"],
    src: true,
  })
  .o("gk.world.ww2", "İki savaş arası dönem ve II. Dünya Savaşı", {
    d: "Ekonomik kriz, totaliter rejimlerin yükselişi, II. Dünya Savaşı, soykırım ve savaş sonrası uluslararası düzenin kuruluşu.",
    w: "Ekonomik krizlerin siyasi sonuçlarını, propagandanın gücünü ve bilimin savaşta kullanımını gösterir; araştırma etiği ve medya okuryazarlığıyla doğrudan bağlantılıdır.",
    pre: ["gk.world.ww1"],
    q: [
      "Bir ekonomik kriz, demokratik bir toplumda aşırı akımların yükselişini nasıl kolaylaştırabilir? Mekanizmayı adım adım tahmin et.",
    ],
    cq: [
      "Ekonomik buhran siyasi istikrarı nasıl sarstı?",
      "Totaliter rejimler propagandayı ve kitle iletişimini nasıl kullandı?",
      "Savaş sonrası kurulan kurumlar hangi dersleri kurumsallaştırmaya çalıştı?",
    ],
    obj: [
      "Kriz-radikalleşme-savaş zincirini kaynaklara dayalı bir neden-sonuç şemasıyla açıklar",
      "Bir propaganda örneğini ikna teknikleri açısından çözümler",
      "Savaş döneminde bilimin kullanımından doğan etik soruları tartışır",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Totaliter rejimler yalnızca zorla iktidara geldi; toplumsal destekleri yoktu.",
      "Savaş tamamen tek bir liderin kişisel kararlarıyla açıklanabilir.",
    ],
    x: [
      "media.lit.persuasion:propaganda tekniklerini çözümlemek",
      "res.ethics:insan deneyleri ve araştırma etiği ilkelerinin doğuşu",
      "gk.sci-hist.modern-physics:fiziğin savaş teknolojisine dönüşümü",
    ],
    notes: ["Tarihleri ve kayıp sayılarını akademik kaynaklardan ve arşivlerden doğrula; hassas konularda birden çok güvenilir kaynak kullan."],
    rel: ["gk.civics.international"],
    tags: ["dunya-savasi", "totalitarizm"],
    src: true,
  })
  .o("gk.world.cold-war", "Soğuk Savaş ve dekolonizasyon", {
    d: "İki kutuplu dünya düzeni, nükleer caydırıcılık, bilim ve uzay yarışı ile sömürge ülkelerin bağımsızlık süreçleri.",
    w: "Bugünkü uluslararası kurumları ve bloklaşmaları anlamanın anahtarıdır; bilim politikasının siyasetle ilişkisini gösterir.",
    pre: ["gk.world.ww2"],
    q: [
      "İki taraf da yok edici silaha sahipse savaş daha mı olası, daha mı az olası hale gelir? Oyun kuramı gibi düşünerek tahmin et.",
    ],
    cq: [
      "Caydırıcılık mantığı nasıl işler ve hangi riskleri taşır?",
      "Uzay ve bilim yarışı eğitim ve araştırma politikalarını nasıl etkiledi?",
      "Dekolonizasyon süreçleri neden bölgeden bölgeye farklılık gösterdi?",
    ],
    obj: [
      "Caydırıcılığı basit bir karar matrisiyle modeller",
      "Bilim yarışının araştırma kurumlarına etkisini bir örnekle açıklar",
      "İki farklı dekolonizasyon sürecini karşılaştırır",
    ],
    ev: "MODELLEME ACIKLAMA YORUMLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Soğuk Savaş'ta hiç sıcak çatışma yaşanmadı.",
      "Dünya yalnızca iki bloktan oluşuyordu; bağlantısız ülkeler önemsizdi.",
    ],
    x: ["gk.econ.behavioral:stratejik karar verme ve oyun kuramı", "gk.sci-hist.modern-physics:nükleer fiziğin siyasi sonuçları"],
    notes: ["Kriz ve antlaşma tarihlerini ile bağımsızlık süreçlerini akademik kaynaklardan doğrula."],
    rel: ["gk.tr-hist.modern-turkey", "gk.civics.international"],
    tags: ["soguk-savas", "dekolonizasyon"],
    src: true,
  })
  .o("gk.world.globalization", "Küreselleşme ve çağdaş dünya", {
    d: "Ticaret, finans, teknoloji ve iletişimin küresel ölçekte bütünleşmesi; bunun eşitsizlik, göç ve kültür üzerindeki etkileri.",
    w: "Ekonomi, medya ve iklim gibi bugünün sorunlarını tarihsel bir süreç içinde okumayı sağlar.",
    pre: ["gk.world.cold-war"],
    q: [
      "Üzerindeki bir tişörtün hammaddesi, üretimi ve satışı kaç ülkeden geçmiş olabilir? Zinciri tahmin et; bu zincir kırılırsa ne olur?",
    ],
    cq: [
      "Küreselleşmenin itici güçleri (teknoloji, ticaret, politika) nelerdir?",
      "Küreselleşmenin kazananları ve kaybedenleri kimlerdir; bu nasıl ölçülür?",
      "Küresel sorunlar (iklim, salgın) neden küresel işbirliği gerektirir?",
    ],
    obj: [
      "Bir ürünün küresel tedarik zincirini diyagramla çizer ve kırılgan noktalarını belirler",
      "Küreselleşmenin etkilerine dair bir veri grafiğini yorumlar ve sınırlarını belirtir",
      "Küresel bir sorunu ulusal ve uluslararası çözüm seçenekleriyle karşılaştırır",
    ],
    ev: "DIAGRAM VERI_ANALIZI YORUMLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Küreselleşme yeni bir olgudur; tarihte benzeri yoktur.",
      "Küreselleşme herkes için aynı sonuçları doğurur.",
    ],
    x: ["media.lit.stats-in-news:ekonomik grafikleri doğru okumak", "gk.geo.climate-change:küresel ortak sorun"],
    notes: ["Ticaret ve eşitsizlik verilerini uluslararası kuruluşların resmî istatistiklerinden doğrula; güncel olay yorumundan kaçın."],
    rel: ["gk.econ.macro", "gk.geo.human"],
    tags: ["kuresellesme"],
    src: true,
  })

  // ───────────────────────────── Coğrafya
  .unit("Coğrafya", "Coğrafya")
  .o("gk.geo.physical", "Fiziki coğrafya: iklim ve yer şekilleri", {
    d: "Atmosfer dolaşımı, iklim tipleri, levha tektoniği ve yer şekillerini oluşturan iç ve dış kuvvetler.",
    w: "İklim değişikliği, tarih ve beşeri coğrafyanın fiziksel zeminidir; fizikteki ısı ve enerji kavramlarının gezegen ölçeğinde uygulamasıdır.",
    pre: ["phys.thermo.temperature-heat~c"],
    q: [
      "Ekvatora daha yakın olan bir şehir, daha kuzeydeki bir şehirden neden daha soğuk olabilir? En az üç neden tahmin et.",
      "Dağlar sürekli aşınıyorsa neden hâlâ dağ var?",
    ],
    cq: [
      "Güneş enerjisinin eşitsiz dağılımı atmosfer dolaşımını nasıl yaratır?",
      "İklimi belirleyen etkenler (enlem, yükselti, denizellik, akıntılar) nasıl etkileşir?",
      "Levha hareketleri ve aşınma yer şekillerini nasıl dengeler?",
    ],
    obj: [
      "Bir yerin iklimini enlem, yükselti ve denize uzaklıktan yola çıkarak tahmin eder ve gerekçelendirir",
      "Atmosfer dolaşımını basit bir enerji dengesi diyagramıyla açıklar",
      "Bir iklim grafiğini (sıcaklık-yağış) okuyup iklim tipini yorumlar",
    ],
    ev: "TAHMIN DIAGRAM YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Mevsimler Dünya'nın Güneş'e uzaklığının değişmesinden kaynaklanır.",
      "Hava durumu ile iklim aynı şeydir.",
    ],
    x: [
      "phys.thermo.temperature-heat:ısı aktarımı ve öz ısı denizellik etkisini açıklar",
      "phys.mech.fluids:atmosfer ve okyanus dolaşımı akışkan hareketidir",
    ],
    ra: ["Yerel meteoroloji verisiyle iklim grafiği çizme"],
    rel: ["gk.geo.climate-change"],
    tags: ["cografya", "iklim"],
  })
  .o("gk.geo.maps", "Harita okuma ve mekânsal düşünme", {
    d: "Ölçek, projeksiyon, koordinat ve tematik haritaları okuma; mekânsal örüntüleri sorgulama.",
    w: "Tarih, coğrafya ve veri görselleştirmede haritalar bir argüman aracıdır; bir haritanın neyi gösterip neyi gizlediğini görmeyi öğretir.",
    pre: ["math.geo.euclid~h"],
    q: [
      "Dünya haritalarında Grönland neden Afrika kadar büyük görünür? Küreyi düz bir kâğıda nasıl yaymaya çalışırdın?",
    ],
    cq: [
      "Ölçek ve projeksiyon seçimi haritadaki algıyı nasıl değiştirir?",
      "Tematik haritalar (yoğunluk, oran) nasıl yanıltıcı olabilir?",
      "Koordinat sistemi ile konum nasıl tanımlanır?",
    ],
    obj: [
      "Harita ölçeğinden gerçek mesafeyi hesaplar",
      "İki projeksiyonun hangi özelliği koruyup hangisini bozduğunu karşılaştırır",
      "Bir tematik haritanın yanıltıcı olabileceği noktaları tespit eder",
    ],
    ev: "HESAPLAMA YORUMLAMA ACIKLAMA",
    t: "BECERI",
    lv: 2,
    sc: "S",
    mis: [
      "Her harita dünyayı doğru oranlarla gösterir.",
      "Mutlak sayıları gösteren bir harita ile oran gösteren harita aynı şeyi anlatır.",
    ],
    x: [
      "math.geo.analytic:koordinat sistemleri",
      "res.data.visualization:haritalar da bir veri görselleştirmesidir",
      "media.lit.stats-in-news:yanıltıcı harita ve grafikler",
    ],
    rel: ["gk.geo.human"],
    tags: ["harita", "mekansal"],
  })
  .o("gk.geo.human", "Beşeri coğrafya: nüfus, göç, kentleşme", {
    d: "Nüfus dağılımı ve yapısı, göçün nedenleri ve kentleşmenin ekonomik ve toplumsal sonuçları.",
    w: "Toplumsal değişimi veriyle okumayı öğretir; ekonomi ve yakın tarih nesneleriyle doğrudan bağlantılıdır.",
    pre: ["gk.geo.maps", "math.stat.descriptive~s"],
    q: [
      "Bir ülkenin nüfus piramidine bakarak 30 yıl sonraki eğitim ve sağlık ihtiyaçlarını tahmin edebilir misin? Nasıl?",
    ],
    cq: [
      "Nüfus piramidi bir toplum hakkında ne söyler?",
      "Göçün itici ve çekici etkenleri nelerdir?",
      "Kentleşme hangi fırsatları ve sorunları beraberinde getirir?",
    ],
    obj: [
      "Bir nüfus piramidini yorumlayıp gelecekteki ihtiyaçlar için gerekçeli tahmin yapar",
      "Göç örneğini itici-çekici etkenler modeliyle çözümler",
      "Kentleşme verisini grafikle gösterip eğilimini yorumlar",
    ],
    ev: "VERI_ANALIZI YORUMLAMA TAHMIN",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Göç yalnızca ekonomik nedenlerle olur.",
      "Nüfus artışı her zaman doğrusal biçimde sürer.",
    ],
    x: [
      "math.stat.descriptive:nüfus verisini özetlemek ve görselleştirmek",
      "bio.ecology:popülasyon dinamikleri modelleri insan nüfusuna da uygulanır",
    ],
    ra: ["Açık nüfus verisiyle küçük bir veri analizi"],
    rel: ["gk.geo.turkey", "gk.world.globalization"],
    tags: ["nufus", "goc", "kentlesme"],
  })
  .o("gk.geo.turkey", "Türkiye coğrafyası", {
    d: "Türkiye'nin konumu, yer şekilleri, iklim bölgeleri, doğal kaynakları, nüfus ve ekonomik faaliyetlerinin dağılımı.",
    w: "Fiziki ve beşeri coğrafya kavramlarını tanıdık bir örnekte birleştirir; deprem riski gibi yaşamsal konuları bilimsel temele oturtur.",
    pre: ["gk.geo.physical", "gk.geo.human"],
    q: [
      "Karadeniz kıyısında neden bol yağış, İç Anadolu'da neden kurak bir iklim var? Dağların konumunu düşünerek açıkla.",
    ],
    cq: [
      "Türkiye'nin jeolojik konumu deprem riskini nasıl açıklar?",
      "Yer şekilleri iklim bölgelerini nasıl belirler?",
      "Nüfus ve ekonomik faaliyet neden belirli bölgelerde yoğunlaşır?",
    ],
    obj: [
      "Bir bölgenin iklimini yer şekilleri ve konumdan yola çıkarak açıklar",
      "Fay hatları ile deprem riskini harita üzerinde ilişkilendirir",
      "Nüfus yoğunluğu haritasını ekonomik etkenlerle yorumlar",
    ],
    ev: "ACIKLAMA YORUMLAMA DIAGRAM",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Deprem tahmin edilebilir; yalnızca zamanı bilinmez.",
      "Türkiye'nin tamamı aynı iklim tipine sahiptir.",
    ],
    x: ["phys.waves.basics:sismik dalgalar dalga fiziğidir"],
    notes: ["Nüfus, alan ve ekonomik istatistikleri resmî istatistik kurumundan ve güncel kaynaklardan doğrula."],
    rel: ["gk.tr-hist.anatolia"],
    tags: ["turkiye", "cografya", "deprem"],
    src: true,
  })
  .o("gk.geo.climate-change", "İklim değişikliğinin bilimi", {
    d: "Sera etkisinin fiziği, sıcaklık kayıtlarının nasıl ölçüldüğü, iklim modelleri ve belirsizliğin nasıl ifade edildiği.",
    w: "Fizik, istatistik ve medya okuryazarlığını tek bir gerçek dünya sorusunda birleştirir; bilimsel uzlaşının nasıl oluştuğunu gösterir.",
    pre: ["gk.geo.physical", "phys.thermo.laws~s", "math.stat.regression~c"],
    q: [
      "Kışın çok soğuk bir hafta yaşanması küresel ısınma iddiasını çürütür mü? Neden ya da neden değil?",
      "Bir iklim modeli yarın havanın nasıl olacağını bilemiyorsa, 50 yıl sonrası hakkında nasıl bir şey söyleyebilir?",
    ],
    cq: [
      "Sera etkisi enerji dengesini nasıl değiştirir?",
      "Uzun dönemli sıcaklık eğilimi gürültülü veriden nasıl çıkarılır?",
      "İklim modellerinin belirsizliği nasıl ifade edilir ve nasıl okunmalıdır?",
    ],
    obj: [
      "Basit bir enerji dengesi modeliyle sera etkisini açıklar",
      "Bir sıcaklık zaman serisinde eğilimi ve değişkenliği ayırt edip yorumlar",
      "Bir iklim haberindeki iddiayı kanıt düzeyi ve belirsizlik açısından değerlendirir",
    ],
    ev: "MODELLEME VERI_ANALIZI YORUMLAMA",
    t: "MODELLEME",
    lv: 3,
    sc: "M",
    mis: [
      "Hava ile iklim aynıdır; tek bir soğuk gün eğilimi çürütür.",
      "Ozon deliği ile sera etkisi aynı olgudur.",
      "Bilimsel belirsizlik 'hiçbir şey bilinmiyor' demektir.",
    ],
    x: [
      "phys.thermo.laws:ışınım ve enerji dengesi",
      "math.stat.regression:zaman serisinde eğilim kestirimi",
      "media.lit.science-news:iklim haberlerini değerlendirme",
    ],
    ra: ["Açık sıcaklık verisiyle eğilim analizi", "Basit sıfır boyutlu enerji dengesi modeli kodlama"],
    notes: ["Sayısal değerleri ve senaryoları uluslararası iklim değerlendirme raporlarından doğrula."],
    rel: ["gk.world.industrial"],
    tags: ["iklim", "modelleme", "veri"],
    src: true,
  })

  // ───────────────────────────── Toplum
  .unit("Toplum", "Vatandaşlık, hukuk ve ekonomi")
  .o("gk.civics.state-constitution", "Devlet, anayasa ve temel haklar", {
    d: "Devletin unsurları, anayasanın işlevi, kuvvetler ayrılığı ve temel hak ve özgürlüklerin güvencesi.",
    w: "Bir vatandaş olarak hakları ve kurumları okuyabilmeyi sağlar; tarih ve siyaset felsefesi nesnelerinin somut karşılığıdır.",
    pre: ["gk.method.historical-thinking~s"],
    q: [
      "Çoğunluk oyuyla her şey değiştirilebilseydi azınlığın hakları nasıl korunurdu? Bir çözüm tasarla.",
    ],
    cq: [
      "Anayasa neden sıradan yasalardan daha zor değiştirilir?",
      "Kuvvetler ayrılığı gücün kötüye kullanımını nasıl sınırlar?",
      "Temel haklar hangi durumlarda ve hangi ölçütlerle sınırlanabilir?",
    ],
    obj: [
      "Kuvvetler ayrılığını yasama-yürütme-yargı ilişkileriyle diyagrama döker",
      "Bir anayasa maddesini hak ve sınırlama açısından yorumlar",
      "İki farklı yönetim modelini karşılaştırır",
    ],
    ev: "DIAGRAM YORUMLAMA ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Demokrasi yalnızca çoğunluğun yönetimidir.",
      "Temel haklar sınırsızdır ya da tamamen devletin takdirindedir.",
    ],
    x: ["gk.phil.political:meşruiyet ve haklar kuramları"],
    notes: ["Anayasa maddelerini ve kurumların güncel yapısını resmî metinlerden doğrula."],
    rel: ["gk.tr-hist.republic", "gk.world.enlightenment"],
    tags: ["anayasa", "vatandaslik"],
    src: true,
  })
  .o("gk.civics.law-basics", "Hukukun temel kavramları", {
    d: "Hukuk kuralının özellikleri, hukuk dalları, hak ve yükümlülük, yargı süreçleri ve hukukun genel ilkeleri.",
    w: "Sözleşme, telif, gizlilik ve araştırma etiği gibi konularda bilinçli karar vermeyi sağlar.",
    pre: ["gk.civics.state-constitution"],
    q: [
      "Ahlaka aykırı ama yasal, ya da yasaya aykırı ama ahlaki bir eylem örneği bulabilir misin? Bu fark ne anlatıyor?",
    ],
    cq: [
      "Hukuk kuralı ahlak ve görgü kurallarından nasıl ayrılır?",
      "Kamu hukuku ile özel hukuk arasındaki ayrım nedir?",
      "Masumiyet karinesi ve hukuki güvenlik ilkeleri neden önemlidir?",
    ],
    obj: [
      "Verilen bir durumu ilgili hukuk dalına göre sınıflandırır",
      "Hukuk, ahlak ve görgü kurallarını yaptırım türleriyle ayırt eder",
      "Telif ve kişisel veri gibi kavramları bir öğrenci projesine uygular",
    ],
    ev: "ACIKLAMA TRANSFER YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "S",
    mis: [
      "Yasal olan her şey ahlakidir.",
      "İnternetteki her içerik serbestçe kullanılabilir.",
    ],
    x: ["res.ethics:araştırma etiği ve yasal yükümlülükler", "media.lit.privacy:kişisel verilerin korunması"],
    rel: ["gk.phil.ethics"],
    vs: ["gk.phil.ethics"],
    tags: ["hukuk"],
  })
  .o("gk.civics.democracy", "Demokrasi, seçimler ve kurumlar", {
    d: "Temsili demokrasi, seçim sistemleri, siyasi partiler, sivil toplum ve denetim mekanizmaları.",
    w: "Toplumsal karar alma süreçlerini çözümlemeyi sağlar; seçim sistemlerinin matematiği, oy toplamanın beklenmedik sonuçlarını gösterir.",
    pre: ["gk.civics.state-constitution"],
    q: [
      "Aynı oy dağılımı farklı seçim sistemleriyle farklı bir meclis üretebilir mi? Küçük bir örnek kurarak dene.",
    ],
    cq: [
      "Seçim sistemleri (çoğunluk, nispi temsil) sonuçları nasıl etkiler?",
      "Bağımsız kurumlar ve özgür basın demokraside hangi işlevi görür?",
      "Sivil katılım seçimler dışında hangi biçimlerde olur?",
    ],
    obj: [
      "Basit bir oy verisini iki farklı seçim sistemiyle sandalyeye çevirip sonuçları karşılaştırır",
      "Denetim mekanizmalarını (yargı, basın, meclis) bir diyagramla gösterir",
      "Bir sivil katılım örneğinin etkisini değerlendirir",
    ],
    ev: "HESAPLAMA DIAGRAM YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Demokrasi yalnızca seçim günü oy vermekten ibarettir.",
      "Her seçim sistemi oyları sandalyelere aynı oranda yansıtır.",
    ],
    x: ["math.found.arithmetic:oran ve orantıyla sandalye dağılımı", "media.lit.current-events-method:siyasi haberleri yöntemli takip etmek"],
    rel: ["gk.phil.political"],
    tags: ["demokrasi", "secimler"],
  })
  .o("gk.civics.international", "Uluslararası ilişkiler ve kuruluşlar", {
    d: "Devletler arası ilişkileri açıklayan temel yaklaşımlar ve uluslararası kuruluşların yapısı ve sınırları.",
    w: "Küresel sorunların (iklim, salgın, göç) neden işbirliği gerektirdiğini ve işbirliğinin neden zor olduğunu anlamayı sağlar.",
    pre: ["gk.civics.democracy", "gk.world.cold-war~s"],
    q: [
      "Herkesin yararına olan bir anlaşmaya (örneğin emisyon azaltma) neden her ülke uymak istemeyebilir? 'Bedavacı' sorununu kendi örneğinle açıkla.",
    ],
    cq: [
      "Gerçekçilik ve liberalizm gibi yaklaşımlar devlet davranışını nasıl açıklar?",
      "Uluslararası kuruluşların yaptırım gücü neden sınırlıdır?",
      "İşbirliği sorunları oyun kuramıyla nasıl modellenir?",
    ],
    obj: [
      "İki kuramsal yaklaşımı aynı olay örneğine uygulayıp karşılaştırır",
      "Bir uluslararası kuruluşun yapısını ve karar alma sürecini diyagramla gösterir",
      "Bir işbirliği sorununu mahkûm ikilemi gibi basit bir modelle açıklar",
    ],
    ev: "MODELLEME ACIKLAMA DIAGRAM",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Uluslararası kuruluşlar devletlerin üstünde bir dünya hükümetidir.",
      "Devletler her zaman yalnızca kısa vadeli çıkarlarına göre hareket eder.",
    ],
    x: ["gk.geo.climate-change:küresel ortak sorunlar", "neuro.cog.decision:stratejik karar verme"],
    notes: ["Kuruluşların üyelik ve yapı bilgilerini resmî kaynaklarından doğrula."],
    rel: ["gk.world.globalization"],
    tags: ["uluslararasi-iliskiler"],
    src: true,
  })
  .o("gk.econ.micro", "Mikroekonomi: arz, talep ve piyasalar", {
    d: "Kıtlık, fırsat maliyeti, arz-talep, fiyat oluşumu, esneklik ve piyasa başarısızlıkları.",
    w: "Günlük kararlardan kamu politikalarına kadar takasları düşünmeyi öğretir; fonksiyon ve grafik bilgisinin doğrudan bir uygulamasıdır.",
    pre: ["math.found.functions~s"],
    q: [
      "Bir konser bileti fiyatına tavan konursa herkes kazançlı mı çıkar? Kuyrukta, karaborsada ve satıcıda ne olur, tahmin et.",
    ],
    cq: [
      "Fiyat, arz ve talep eğrilerinin kesişiminde nasıl oluşur?",
      "Esneklik vergi ve fiyat politikalarının etkisini nasıl belirler?",
      "Dışsallıklar ve kamu malları neden piyasa başarısızlığına yol açar?",
    ],
    obj: [
      "Doğrusal arz ve talep fonksiyonlarından denge fiyat ve miktarını hesaplar",
      "Bir şokun (vergi, fiyat tavanı) etkisini grafik üzerinde gösterip yorumlar",
      "Bir dışsallık örneğini çözümleyip olası politika araçlarını karşılaştırır",
    ],
    ev: "HESAPLAMA DIAGRAM MODELLEME",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Talep artarsa her zaman yalnızca fiyat artar; miktar değişmez.",
      "Fiyat tavanı her zaman tüketicinin yararınadır.",
    ],
    x: [
      "math.found.functions:arz ve talep fonksiyonları ve kesişimleri",
      "math.calc.derivative-def:marjinal kavramı türevdir",
    ],
    rel: ["gk.econ.macro"],
    tags: ["ekonomi", "piyasa"],
  })
  .o("gk.econ.macro", "Makroekonomi: enflasyon, büyüme, işsizlik", {
    d: "Milli gelir, enflasyon, işsizlik, faiz, para ve maliye politikası gibi ekonomi genelindeki büyüklükler.",
    w: "Haberlerdeki ekonomik göstergeleri doğru okumayı sağlar; bileşik büyüme ve üstel fonksiyonların gerçek hayattaki karşılığıdır.",
    pre: ["gk.econ.micro", "math.found.exp-log~s"],
    q: [
      "Maaşın her yıl %10 artıyor ama fiyatlar %15 artıyorsa daha mı zengin, daha mı fakir oluyorsun? Hesapla.",
    ],
    cq: [
      "Nominal ve reel büyüklükler arasındaki fark nedir?",
      "Merkez bankası faiz oranıyla enflasyonu nasıl etkilemeye çalışır?",
      "Ekonomik büyüme nasıl ölçülür ve neyi ölçmez?",
    ],
    obj: [
      "Nominal değerleri enflasyona göre düzeltip reel değişimi hesaplar",
      "Bileşik büyüme oranıyla iki katına çıkma süresini tahmin eder",
      "Bir makroekonomik göstergenin grafiğini yorumlayıp sınırlarını belirtir",
    ],
    ev: "HESAPLAMA YORUMLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Enflasyonun düşmesi fiyatların düşmesi demektir.",
      "GSYH bir ülkedeki refahın eksiksiz ölçüsüdür.",
    ],
    x: [
      "math.found.exp-log:bileşik büyüme ve iki katına çıkma süresi",
      "media.lit.stats-in-news:ekonomik verileri ve grafikleri doğru okumak",
    ],
    rel: ["gk.econ.personal-finance"],
    tags: ["ekonomi", "enflasyon"],
  })
  .o("gk.econ.personal-finance", "Kişisel finans: bütçe, faiz ve risk", {
    d: "Bütçe yapma, birikim, bileşik faiz, borç, enflasyon karşısında paranın değeri ve risk-getiri ilişkisi.",
    w: "Yaşam boyu verilecek finansal kararların matematiksel temelini kurar; olasılık ve üstel fonksiyonları doğrudan uygular.",
    pre: ["math.found.exp-log", "math.prob.basics~s"],
    q: [
      "Her ay küçük bir miktar biriktirmeye 15 yaşında mı, 25 yaşında mı başlamak daha büyük fark yaratır? Önce sezgiyle tahmin et, sonra hesapla.",
    ],
    cq: [
      "Bileşik faiz zamanla neden bu kadar büyük fark yaratır?",
      "Risk ve getiri arasındaki ilişki nedir; çeşitlendirme neden riski azaltır?",
      "Kredi kartı ve tüketici kredisi gibi borçların gerçek maliyeti nasıl hesaplanır?",
    ],
    obj: [
      "Basit bir aylık bütçe hazırlar ve harcama kalemlerini sınıflandırır",
      "Bileşik faizle birikimin gelecekteki değerini hesaplar ve grafikle gösterir",
      "İki yatırım seçeneğini beklenen getiri ve risk açısından karşılaştırır",
    ],
    ev: "HESAPLAMA MODELLEME TRANSFER",
    t: "UYGULAMA",
    lv: 2,
    sc: "S",
    mis: [
      "Yüksek getiri vaat eden her yatırım iyidir; risk sonradan düşünülür.",
      "Enflasyon varken parayı nakit tutmak değerini korur.",
    ],
    x: [
      "math.found.exp-log:bileşik faiz üstel büyümedir",
      "math.prob.random-vars:beklenen değer ve varyans risk ölçüsüdür",
      "prog.python.basics:birikim simülasyonu kodlamak",
    ],
    rel: ["gk.econ.behavioral"],
    tags: ["finans", "faiz"],
  })
  .o("gk.econ.behavioral", "Davranışsal ekonomi", {
    d: "İnsanların karar verirken 'rasyonel ekonomik insan' modelinden sistematik olarak saptığı durumlar: kayıptan kaçınma, çerçeveleme, şimdiki zaman yanlılığı.",
    w: "Ekonomi ile nörobilimi birleştirir; reklam, ikna ve kişisel karar hatalarını tanımayı sağlar.",
    pre: ["gk.econ.micro", "neuro.cog.decision~s"],
    q: [
      "%90 hayatta kalma oranı ile %10 ölüm oranı aynı bilgidir. Doktor hangisini söylerse daha çok kişi ameliyatı kabul eder sence? Neden?",
    ],
    cq: [
      "Kayıptan kaçınma ve çerçeveleme kararları nasıl değiştirir?",
      "Şimdiki zaman yanlılığı birikim ve çalışma alışkanlıklarını nasıl etkiler?",
      "Bu yanlılıkların beyindeki ödül sistemiyle ilişkisi nedir?",
    ],
    obj: [
      "Bir karar senaryosundaki bilişsel yanlılığı adlandırıp mekanizmasını açıklar",
      "Küçük bir anket deneyi tasarlayıp çerçeveleme etkisini test eder",
      "Davranışsal bir bulguyu bir kamu politikası ya da kişisel strateji önerisine dönüştürür",
    ],
    ev: "DENEY ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "İnsanlar ya tamamen rasyoneldir ya da tamamen irrasyoneldir.",
      "Yanlılıkları bilmek onlardan otomatik olarak korur.",
    ],
    x: [
      "neuro.cog.decision:ödül ve karar verme sistemlerinin nörobilimi",
      "neuro.comp.reinforcement:ödül tahmin hatası ve öğrenme",
      "media.lit.persuasion:ikna teknikleri yanlılıkları kullanır",
    ],
    ra: ["Sınıf içinde çerçeveleme etkisi anketi"],
    rel: ["gk.econ.personal-finance"],
    tags: ["davranissal-ekonomi", "karar"],
    opt: true,
  })

  // ───────────────────────────── Düşünce / Felsefe
  .unit("Düşünce", "Felsefe")
  .o("gk.phil.intro", "Felsefeye giriş ve argüman analizi", {
    d: "Felsefi soruların doğası ve bir argümanı öncül-sonuç yapısına ayırma, geçerlilik ve sağlamlığı değerlendirme.",
    w: "Her alanda iddia değerlendirmenin temel aracıdır; bilimsel tartışma, medya analizi ve ispat yazımında doğrudan kullanılır.",
    pre: ["math.found.logic~s"],
    q: [
      "Tüm öncülleri yanlış ama mantıksal olarak geçerli bir argüman kurabilir misin? Peki sonucu doğru olabilir mi?",
    ],
    cq: [
      "Geçerli bir argüman ile sağlam bir argüman arasındaki fark nedir?",
      "Bir metindeki örtük öncüller nasıl ortaya çıkarılır?",
      "Yaygın mantık safsataları nasıl tanınır?",
    ],
    obj: [
      "Bir paragraftaki argümanı numaralı öncüller ve sonuç olarak yeniden yazar",
      "Bir argümanın geçerliliğini ve sağlamlığını ayrı ayrı değerlendirir",
      "Verilen metinde en az üç safsatayı adlandırıp neden hatalı olduğunu açıklar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Sonucu doğru olan her argüman iyi bir argümandır.",
      "Felsefe yalnızca kişisel görüş beyan etmektir; doğru ya da yanlış argüman yoktur.",
    ],
    x: [
      "math.found.logic:önermeler mantığı ve çıkarım kuralları",
      "media.lit.claim-analysis:argüman analizi iddia değerlendirmenin temelidir",
      "res.peer-review:bir makalenin argümanını eleştirel değerlendirmek",
    ],
    ca: ["Felsefe olimpiyatı deneme yazımı"],
    rel: ["gk.phil.epistemology", "gk.phil.ethics"],
    tags: ["felsefe", "arguman", "mantik"],
  })
  .o("gk.phil.epistemology", "Bilgi felsefesi", {
    d: "Bilginin tanımı, gerekçelendirme, şüphecilik, akılcılık ve deneycilik tartışmaları.",
    w: "Bilimsel bilginin neden güvenilir olduğunu ve sınırlarını sorgulamayı sağlar; bilim felsefesi ve zihin felsefesinin ön koşuludur.",
    pre: ["gk.phil.intro"],
    q: [
      "Durmuş bir saate bakıp tesadüfen doğru saati söylersen, saati 'bildin' mi? Bilgi için doğru inanç yeterli mi?",
    ],
    cq: [
      "Bilgi 'gerekçelendirilmiş doğru inanç' mıdır; Gettier tipi örnekler neyi gösterir?",
      "Akıl ve deneyim bilginin kaynağı olarak nasıl karşılaştırılır?",
      "Radikal şüpheciliğe nasıl yanıt verilebilir?",
    ],
    obj: [
      "Kendi Gettier tipi karşı örneğini kurar ve neyi gösterdiğini açıklar",
      "Akılcı ve deneyci yaklaşımları bir matematik ve bir fizik örneği üzerinden karşılaştırır",
      "Şüpheci bir argümana gerekçeli bir yanıt yazar",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Kesin olmayan hiçbir şey bilgi sayılmaz.",
      "Bilimsel bilgi doğrudan gözlemden, yorum olmadan çıkar.",
    ],
    x: [
      "math.prob.bayes:inançların kanıtla güncellenmesi",
      "neuro.comp.bayesian-brain:algı bir çıkarım süreci olarak",
    ],
    rel: ["gk.phil.science", "gk.phil.mind"],
    tags: ["felsefe", "epistemoloji"],
  })
  .o("gk.phil.ethics", "Etik kuramlar", {
    d: "Sonuççuluk, ödev etiği ve erdem etiği gibi temel kuramlar ve bunların somut ikilemlere uygulanması.",
    w: "Araştırma etiği, yapay zekâ ve nörobilim etiği gibi alanlarda gerekçeli karar vermeyi sağlar.",
    pre: ["gk.phil.intro"],
    q: [
      "Bir tramvay beş kişiye çarpmak üzere; makası değiştirirsen bir kişiye çarpacak. Değiştirir misin? Peki aynı sonucu birini köprüden iterek elde edebilseydin?",
    ],
    cq: [
      "Sonuççuluk ve ödev etiği aynı ikilemde neden farklı yanıtlar verir?",
      "Erdem etiği 'ne yapmalıyım' yerine hangi soruyu sorar?",
      "Etik kuramlar yeni teknolojilere nasıl uygulanır?",
    ],
    obj: [
      "Bir ikilemi üç kuramın her biriyle ayrı ayrı çözümler",
      "Kuramların güçlü ve zayıf yönlerini karşı örneklerle karşılaştırır",
      "Bir araştırma ya da teknoloji senaryosuna gerekçeli etik değerlendirme yazar",
    ],
    ev: "ACIKLAMA TRANSFER YORUMLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Etik tamamen görecelidir; hiçbir gerekçe diğerinden daha iyi değildir.",
      "Yasal olan etiktir.",
    ],
    x: [
      "res.ethics:araştırma etiği ilkeleri",
      "neuro.methods.ethics:nörobilimde etik sorular",
      "prog.ml.basics:algoritmik adalet ve önyargı",
    ],
    ca: ["Etik bowl ve felsefe tartışma yarışmaları"],
    rel: ["gk.phil.political", "gk.civics.law-basics"],
    tags: ["etik", "felsefe"],
  })
  .o("gk.phil.science", "Bilim felsefesi: Popper, Kuhn ve ötesi", {
    d: "Bilimi bilim yapan nedir: yanlışlanabilirlik, paradigmalar, araştırma programları ve kanıtın kuramla ilişkisi.",
    w: "Bilimsel yöntemi bir kurallar listesi olmaktan çıkarıp eleştirel olarak düşünmeyi sağlar; sahte bilimi tanımanın temelidir.",
    pre: ["gk.phil.epistemology", "res.method.scientific-method~s"],
    q: [
      "'Gördüğüm tüm kuğular beyazdı, demek ki tüm kuğular beyazdır.' Bu çıkarım ne kadar güvenilir? Tek bir siyah kuğu ne değiştirir?",
    ],
    cq: [
      "Tümevarım sorunu nedir ve bilim buna nasıl yanıt verir?",
      "Yanlışlanabilirlik ölçütü bilimi sahte bilimden nasıl ayırır ve sınırları nelerdir?",
      "Paradigma değişimleri bilimsel ilerlemeyi nasıl yeniden tanımlar?",
    ],
    obj: [
      "Bir iddianın yanlışlanabilir olup olmadığını değerlendirir ve yanlışlanabilir biçime dönüştürür",
      "Bilim tarihinden bir örneği Popper ve Kuhn'un yaklaşımlarıyla karşılaştırmalı yorumlar",
      "Bayesçi doğrulama fikrini basit bir örnekle açıklar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 4,
    sc: "M",
    mis: [
      "Bilim kesin doğruları ispatlar.",
      "Bir kuram tek bir aykırı gözlemle derhal terk edilir.",
      "'Sadece bir kuram' ifadesi, bilimsel kuramın kanıtsız bir tahmin olduğu anlamına gelir.",
    ],
    x: [
      "res.method.hypothesis:sınanabilir hipotez kurmak",
      "math.stat.bayesian:kanıtla kuram güncelleme",
      "media.lit.science-news:bilim ile sahte bilimi ayırt etmek",
    ],
    rel: ["gk.sci-hist.scientific-revolution", "gk.sci-hist.modern-physics"],
    tags: ["bilim-felsefesi", "popper", "kuhn"],
  })
  .o("gk.phil.mind", "Zihin felsefesi ve bilinç", {
    d: "Zihin-beden sorunu, işlevselcilik, bilincin 'zor sorunu' ve yapay zekânın zihin sahibi olup olamayacağı tartışmaları.",
    w: "Nörobilimin en derin sorularını kavramsal olarak netleştirir; deneysel bulguların neyi gösterip neyi gösteremeyeceğini sorgulatır.",
    pre: ["gk.phil.epistemology", "neuro.sys.neuroanatomy~s"],
    q: [
      "Beynindeki her nöronu tek tek, işlevi aynı kalan silikon çiplerle değiştirsek, bir noktada 'sen' olmaktan çıkar mısın? Ne zaman?",
    ],
    cq: [
      "Zihinsel durumlar beyin durumlarıyla özdeş midir?",
      "İşlevselcilik yapay sistemlerin zihne sahip olabileceğini nasıl savunur?",
      "Bilincin nöral bağıntılarını bulmak 'zor sorunu' çözer mi?",
    ],
    obj: [
      "Özdeşlik kuramı, işlevselcilik ve ikiciliği bir düşünce deneyi üzerinden karşılaştırır",
      "Bir nörobilim bulgusunun felsefi bir iddia için ne ölçüde kanıt olduğunu değerlendirir",
      "Yapay sinir ağlarının 'anlama' yetisi üzerine gerekçeli kısa bir deneme yazar",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 4,
    sc: "M",
    mis: [
      "Beyin taramasında bir bölgenin 'yanması' o bölgenin bir düşünceyi ürettiğini kanıtlar.",
      "Bilinç sorunu yalnızca daha fazla veriyle kendiliğinden çözülecektir.",
    ],
    x: [
      "neuro.sys.neuroanatomy:zihinsel işlevlerin beyin bölgeleriyle ilişkisi",
      "neuro.comp.ann-bridge:yapay ağlar ve beyin karşılaştırması",
      "neuro.methods.imaging:görüntüleme verisinin yorum sınırları",
    ],
    rel: ["gk.sci-hist.neuroscience"],
    tags: ["zihin", "bilinc", "felsefe"],
  })
  .o("gk.phil.political", "Siyaset felsefesi", {
    d: "Adalet, özgürlük, eşitlik ve meşru otorite üzerine temel kuramlar.",
    w: "Demokrasi ve haklar tartışmalarını kavramsal temele oturtur; kamu politikalarını gerekçeleriyle değerlendirmeyi sağlar.",
    pre: ["gk.phil.ethics", "gk.civics.democracy~s"],
    q: [
      "Toplumda hangi konumda doğacağını bilmeseydin, nasıl bir vergi ve eğitim sistemi seçerdin? Bu 'cehalet peçesi' seni neye yöneltiyor?",
    ],
    cq: [
      "Devletin otoritesi neye dayanır?",
      "Özgürlük ve eşitlik arasındaki gerilim nasıl dengelenir?",
      "Farklı adalet kuramları kaynak dağılımı hakkında ne söyler?",
    ],
    obj: [
      "İki adalet kuramını aynı politika sorununa uygulayıp karşılaştırır",
      "Bir siyasi metindeki meşruiyet argümanını yeniden yapılandırır",
      "Bir kamu politikası için gerekçeli bir pozisyon yazar ve karşı argümanı ele alır",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Özgürlük yalnızca devlet müdahalesinin yokluğudur.",
      "Eşitlik herkese aynı miktarda kaynak vermek demektir.",
    ],
    x: ["gk.econ.micro:kaynak dağılımı ve verimlilik", "media.lit.persuasion:siyasi söylemi çözümlemek"],
    rel: ["gk.world.enlightenment", "gk.civics.state-constitution"],
    tags: ["siyaset-felsefesi", "adalet"],
    opt: true,
  })

  // ───────────────────────────── Düşünce / Bilim tarihi
  .unit("Düşünce", "Bilim tarihi")
  .o("gk.sci-hist.ancient-medieval", "Antik ve Orta Çağ bilimi (İslam dünyasında bilim dahil)", {
    d: "Antik uygarlıklarda matematik ve astronomi, Yunan doğa felsefesi ve İslam dünyasında optik, cebir, tıp ve astronomideki gelişmeler.",
    w: "Bilimin tek bir kültürün ürünü olmadığını gösterir; bugün kullandığımız cebir, algoritma ve deneysel yöntem fikirlerinin kökenine götürür.",
    pre: ["gk.world.ancient~s"],
    q: [
      "Teleskop yokken insanlar Dünya'nın büyüklüğünü nasıl ölçmüş olabilir? Bir gölge ve iki şehirle bir yöntem tasarla.",
      "'Algoritma' ve 'cebir' kelimeleri neden Arapça kökenli olabilir?",
    ],
    cq: [
      "Antik dönemde matematik ve astronomi hangi pratik ihtiyaçlardan doğdu?",
      "Çeviri hareketleri ve kurumlar bilginin korunmasını ve gelişmesini nasıl sağladı?",
      "Orta Çağ bilim insanları deney ve gözleme nasıl yaklaştı?",
    ],
    obj: [
      "Antik bir ölçüm yöntemini (örneğin gölge açısından Dünya'nın çevresi) geometriyle yeniden hesaplar",
      "Bir bilimsel fikrin uygarlıklar arası aktarım yolunu izler",
      "Orta Çağ optik çalışmalarının deneysel yönünü bir örnekle açıklar",
    ],
    ev: "HESAPLAMA ACIKLAMA YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Bilim yalnızca Avrupa'da Rönesans'tan sonra başladı.",
      "İslam dünyasındaki bilim insanları yalnızca Yunan eserlerini çevirip korudu, özgün katkı yapmadı.",
    ],
    x: [
      "math.geo.euclid:benzer üçgenler ve açılarla antik ölçümler",
      "math.found.algebra:cebirin tarihsel kökeni",
      "phys.optics.geometric:Orta Çağ optik çalışmaları",
    ],
    notes: ["Bilim insanlarının yaşadığı dönemleri ve hangi buluşun kime ait olduğunu akademik bilim tarihi kaynaklarından doğrula."],
    rel: ["gk.world.medieval", "gk.tr-hist.islam-turks"],
    tags: ["bilim-tarihi", "islam-bilimi"],
    src: true,
  })
  .o("gk.sci-hist.scientific-revolution", "Bilimsel Devrim: Kopernik'ten Newton'a", {
    d: "Güneş merkezli modelden Newton mekaniğine uzanan süreçte gözlem, matematik ve deneyin bilimsel yöntemde birleşmesi.",
    w: "Bugünkü fizik ve bilimsel yöntemin nasıl doğduğunu gösterir; fizik derslerindeki yasaların hangi sorulara yanıt olarak geliştiğini anlatır.",
    pre: ["gk.sci-hist.ancient-medieval"],
    q: [
      "Dünya gerçekten dönüyorsa neden bunu hissetmiyoruz ve havaya atılan taş neden geri ayağımıza düşüyor? O dönemin itirazını sen nasıl yanıtlardın?",
    ],
    cq: [
      "Güneş merkezli model ilk ortaya çıktığında neden hemen daha iyi tahmin vermedi?",
      "Gözlem verisinin matematiksel yasaya dönüşümü nasıl gerçekleşti?",
      "Newton'un sentezi neden bir dönüm noktası sayılır?",
    ],
    obj: [
      "Yer merkezli ve Güneş merkezli modelleri açıklayıcı güç ve basitlik açısından karşılaştırır",
      "Gözlem → ampirik yasa → kuram zincirini bir örnek üzerinde açıklar",
      "Dönemin bir itirazını modern fizik kavramlarıyla yanıtlar",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Güneş merkezli model ilk ortaya çıktığında gözlemleri daha iyi açıklıyordu, bu yüzden hemen kabul edildi.",
      "Bilimsel Devrim tek bir dâhinin eseridir.",
    ],
    x: [
      "phys.mech.gravitation:evrensel çekim yasası ve yörüngeler",
      "phys.mech.newton:hareket yasalarının tarihsel bağlamı",
      "math.calc.derivative-def:kalkülüsün doğuşu",
    ],
    notes: ["Eser yayın tarihlerini ve öncelik tartışmalarını akademik bilim tarihi kaynaklarından doğrula."],
    rel: ["gk.phil.science", "gk.world.enlightenment"],
    tags: ["bilim-tarihi", "bilimsel-devrim"],
    src: true,
  })
  .o("gk.sci-hist.modern-physics", "Modern fiziğin doğuşu", {
    d: "Klasik fiziğin açıklayamadığı deneysel sorunlardan (kara cisim ışıması, ışık hızı, atom tayfları) görelilik ve kuantum kuramına geçiş.",
    w: "Bir paradigma değişiminin içeriden nasıl yaşandığını gösterir; modern fizik derslerine tarihsel motivasyon sağlar.",
    pre: ["gk.sci-hist.scientific-revolution", "phys.modern.quantum-intro~c"],
    q: [
      "Bir kuram neredeyse her şeyi açıklıyor ama birkaç küçük deney sonucuna uymuyorsa ne yaparsın: kuramı mı değiştirirsin, deneyi mi sorgularsın?",
    ],
    cq: [
      "Hangi deneysel anomaliler klasik fiziği sarstı?",
      "Kuantum ve görelilik fikirleri ilk ortaya atıldığında nasıl karşılandı?",
      "Bilim topluluğu yeni kuramları hangi ölçütlerle kabul etti?",
    ],
    obj: [
      "Bir anomaliyi ve onu çözen kuramsal fikri neden-sonuç ilişkisiyle açıklar",
      "Bu geçişi Kuhn'un paradigma kavramıyla yorumlar",
      "Bir tarihsel makale ya da konferans tartışmasının ana argümanını özetler",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Modern fizik klasik fiziği tamamen geçersiz kıldı.",
      "Kuantum kuramı tek bir kişinin tek bir buluşudur.",
    ],
    x: [
      "phys.modern.quantum-intro:kuantum kavramlarının tarihsel kökeni",
      "phys.modern.relativity:görelilik kuramının motivasyonu",
      "gk.phil.science:paradigma değişimi örneği",
    ],
    notes: ["Kişi, deney ve yayın tarihlerini akademik bilim tarihi kaynaklarından doğrula."],
    rel: ["gk.world.ww2"],
    tags: ["bilim-tarihi", "modern-fizik"],
    src: true,
  })
  .o("gk.sci-hist.neuroscience", "Nörobilimin tarihi: Cajal'dan Hodgkin–Huxley'e", {
    d: "Nöron doktrini tartışması, elektriksel uyarılabilirliğin keşfi ve aksiyon potansiyelinin nicel modeline giden yol.",
    w: "Nörobilimin temel kavramlarının hangi deneylerle ve hangi tartışmalarla kurulduğunu gösterir; yöntem ve teknolojinin bilimsel ilerlemeyi nasıl belirlediğini örnekler.",
    pre: ["gk.sci-hist.scientific-revolution~s", "neuro.cell.action-potential~c"],
    q: [
      "Mikroskop altında birbirine dokunuyormuş gibi görünen sinir hücrelerinin aslında ayrı hücreler olduğunu nasıl kanıtlardın?",
      "Bir sinirin elektrik ilettiğini, bunu ölçecek aletler yokken nasıl gösterebilirdin?",
    ],
    cq: [
      "Nöron doktrini ve ağ (retiküler) kuramı arasındaki tartışma nasıl çözüldü?",
      "Hangi teknik yenilikler (boyama yöntemleri, dev akson, voltaj kenetleme) ilerlemeyi mümkün kıldı?",
      "Hodgkin–Huxley modeli neden biyolojide nicel modellemenin örneği sayılır?",
    ],
    obj: [
      "Bir tarihsel tartışmayı iki tarafın kanıtlarıyla yeniden kurar",
      "Bir deneysel tekniğin hangi soruyu yanıtlanabilir kıldığını açıklar",
      "Tarihsel bir deneyin mantığını modern kavramlarla yeniden yorumlar",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Önemli keşifler tek bir parlak fikirle olur; yöntem ve alet geliştirmenin rolü yoktur.",
      "Golgi ile Cajal'ın tartışmasında 'yanlış' taraf hiçbir katkı yapmadı.",
    ],
    x: [
      "neuro.cell.neuron-anatomy:nöron doktrini ve hücre yapısı",
      "neuro.comp.hh-model:modelin kendisi ve matematiği",
      "neuro.methods.electrophysiology:kayıt tekniklerinin evrimi",
    ],
    notes: ["Deneylerin, ödüllerin ve yayınların tarihlerini akademik bilim tarihi kaynaklarından ve orijinal makalelerden doğrula."],
    rel: ["gk.phil.mind"],
    tags: ["bilim-tarihi", "norobilim"],
    src: true,
  })
  .o("gk.sci-hist.turkey", "Türkiye'de bilim ve bilim insanları", {
    d: "Osmanlı'dan günümüze bilim kurumlarının, eğitim reformlarının ve bilim insanlarının katkılarının genel görünümü.",
    w: "Bilimin yerel bağlamda nasıl kurumsallaştığını ve öğrencinin kendi araştırma yolunu bu geleneğe nasıl bağlayabileceğini gösterir.",
    pre: ["gk.sci-hist.scientific-revolution~s"],
    q: [
      "Bir ülkede bilim üretimini artırmak için ilk neye yatırım yapardın: üniversiteye, laboratuvara, dergiye, bursa? Neden?",
    ],
    cq: [
      "Bilim kurumları (rasathane, mühendishane, üniversite) hangi ihtiyaçlarla kuruldu?",
      "Eğitim reformları bilim üretimini nasıl etkiledi?",
      "Bilim insanlarının katkıları hangi kaynaklardan güvenilir biçimde araştırılabilir?",
    ],
    obj: [
      "Bir bilim kurumunun kuruluş amacını ve etkisini kaynak göstererek açıklar",
      "Bir bilim insanının katkısını akademik kaynaklardan araştırıp kısa bir profil yazar",
      "Bilim politikası tercihlerini sonuçları açısından karşılaştırır",
    ],
    ev: "ARASTIRMA_UYGULAMASI ACIKLAMA YORUMLAMA",
    t: "ARASTIRMA",
    lv: 2,
    sc: "M",
    mis: [
      "Türkiye'de bilim tarihi Cumhuriyet'le başlar.",
      "Popüler internet listelerindeki 'ilk'ler ve iddialar doğrulanmış bilgidir.",
    ],
    x: ["res.lit.search:güvenilir kaynak araştırması", "res.career.academic:bilim yolunu planlamak"],
    notes: ["Kişi ve kurum tarihlerini, katkı iddialarını akademik bilim tarihi kaynaklarından doğrula; popüler listelere güvenme."],
    rel: ["gk.tr-hist.republic", "gk.tr-hist.ottoman-reform"],
    tags: ["bilim-tarihi", "turkiye"],
    src: true,
  })

  // ───────────────────────────── Kültür / Edebiyat ve sanat
  .unit("Kültür", "Edebiyat ve sanat")
  .o("gk.lit.reading-analysis", "Edebi metin çözümleme", {
    d: "Bir şiir, öykü ya da romanı tema, anlatıcı, yapı, imge ve dil açısından çözümleme.",
    w: "Dikkatli ve çok katmanlı okumayı öğretir; bilimsel metin okuma ve yabancı dilde anlama becerilerine aktarılır.",
    q: [
      "Aynı olayı birinci tekil şahıstan ve her şeyi bilen bir anlatıcıdan okumak, kime güvendiğini nasıl değiştirir? Bir paragrafı iki türlü yeniden yaz.",
    ],
    cq: [
      "Anlatıcı ve bakış açısı okuru nasıl yönlendirir?",
      "İmge, sembol ve yapı anlamı nasıl taşır?",
      "Bir yorumu metinden kanıtlarla nasıl desteklersin?",
    ],
    obj: [
      "Bir metnin temasını belirleyip metinden en az üç kanıtla destekler",
      "Anlatıcı türünü ve okura etkisini açıklar",
      "Kısa bir metin için gerekçeli bir çözümleme paragrafı yazar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Bir metnin tek bir doğru yorumu vardır ve o da yazarın niyetidir.",
      "Her yorum eşit derecede geçerlidir; metinden kanıt gerekmez.",
    ],
    x: [
      "res.lit.reading:bilimsel makaleyi de çok katmanlı okumak",
      "en.b2.reading:çıkarım stratejileri her dilde geçerli",
    ],
    rel: ["gk.lit.turkish", "gk.lit.world"],
    tags: ["edebiyat", "okuma"],
  })
  .o("gk.lit.turkish", "Türk edebiyatının dönemleri", {
    d: "Sözlü gelenekten divan ve halk edebiyatına, Tanzimat'tan Cumhuriyet dönemine Türk edebiyatının ana akımları.",
    w: "Edebiyatı tarihsel ve toplumsal değişimin bir aynası olarak okumayı sağlar; tarih nesneleriyle karşılıklı aydınlatır.",
    pre: ["gk.lit.reading-analysis", "gk.method.historical-thinking~s"],
    q: [
      "Bir dönemin şiirleri yalnızca aşkı anlatıyor gibi görünüyorsa, o dönemin toplumu hakkında yine de ne öğrenebilirsin?",
    ],
    cq: [
      "Edebi dönemler hangi tarihsel ve toplumsal değişimlerle bağlantılıdır?",
      "Biçim (aruz, hece, serbest ölçü) tercihleri neyi yansıtır?",
      "Bir eseri dönemi içinde nasıl konumlandırırız?",
    ],
    obj: [
      "Bir eseri biçim ve içerik özelliklerinden yola çıkarak döneme yerleştirir ve gerekçelendirir",
      "İki farklı dönemden metni tema ve dil açısından karşılaştırır",
      "Edebi bir değişimi tarihsel bir gelişmeyle ilişkilendirir",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "L",
    mis: [
      "Dönemler keskin sınırlarla birbirinden ayrılır.",
      "Divan edebiyatı halktan tamamen kopuktu ve halk edebiyatıyla hiç etkileşmedi.",
    ],
    x: ["gk.tr-hist.ottoman-reform:Tanzimat edebiyatı ve modernleşme"],
    notes: ["Yazar ve eser tarihlerini, dönem sınırlarını akademik edebiyat tarihi kaynaklarından doğrula."],
    rel: ["gk.tr-hist.republic"],
    tags: ["edebiyat", "turk-edebiyati"],
    src: true,
  })
  .o("gk.lit.world", "Dünya edebiyatından temel eserler", {
    d: "Farklı kültür ve dönemlerden etkili eserlerin karşılaştırmalı okuması.",
    w: "Farklı kültürlerin insan deneyimini nasıl anlattığını görmeyi sağlar; yabancı dil öğrenimini kültürel bağlamla zenginleştirir.",
    pre: ["gk.lit.reading-analysis"],
    q: [
      "Binlerce yıl önce yazılmış bir destan bugün hâlâ okunuyorsa, hangi insan deneyimine dokunuyor olabilir?",
    ],
    cq: [
      "Farklı kültürlerden eserlerde ortak temalar nelerdir?",
      "Çeviri bir eseri nasıl dönüştürür?",
      "Bir eser kendi döneminde ve bugün nasıl farklı okunur?",
    ],
    obj: [
      "İki farklı kültürden eseri ortak bir tema üzerinden karşılaştırır",
      "Aynı pasajın iki çevirisini karşılaştırıp farkların anlamı nasıl etkilediğini yorumlar",
      "Okuduğu bir eser için gerekçeli kısa bir eleştiri yazar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "L",
    mis: [
      "Çeviri bir eseri birebir aktarır; çevirmen seçimi önemsizdir.",
      "'Klasik' eserler yalnızca Avrupa edebiyatından çıkar.",
    ],
    x: [
      "en.c2.style:üslup ve ince anlam farkları",
      "de.c1.fluency:Almanca edebiyattan özgün metin okuma",
      "ja.culture:Japon edebiyatı ve kültürü",
    ],
    notes: ["Eser ve yazar bilgilerini, yayın tarihlerini güvenilir edebiyat kaynaklarından doğrula."],
    rel: ["gk.lit.turkish"],
    tags: ["edebiyat", "dunya-edebiyati"],
    opt: true,
    src: true,
  })
  .o("gk.art.visual", "Sanat tarihi ve görsel okuma", {
    d: "Resim, heykel ve mimarideki ana akımlar ile bir görseli kompozisyon, renk, perspektif ve bağlam açısından okuma.",
    w: "Görsel okuryazarlık, bilimsel görselleştirme ve medya analizinde doğrudan işe yarar; bir görüntünün nasıl anlam ürettiğini öğretir.",
    pre: ["gk.method.historical-thinking~s"],
    q: [
      "Bir resimde gözün önce nereye gittiğini ressam nasıl kontrol eder? Bir tabloya bak, göz yolunu çiz, sonra nedenini açıkla.",
    ],
    cq: [
      "Kompozisyon, renk ve ışık izleyicinin dikkatini nasıl yönlendirir?",
      "Perspektif ve gerçekçilik anlayışı dönemden döneme neden değişti?",
      "Bir sanat eseri tarihsel bir belge olarak nasıl okunur?",
    ],
    obj: [
      "Bir görseli kompozisyon, renk ve bağlam başlıklarıyla çözümler",
      "Doğrusal perspektifin geometrisini basit bir çizimle gösterir",
      "İki farklı akımdan eseri amaç ve teknik açısından karşılaştırır",
    ],
    ev: "YORUMLAMA DIAGRAM ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Gerçekçi olmayan sanat 'beceri eksikliğinin' sonucudur.",
      "Bir görselin anlamı herkes için aynıdır, bağlamdan bağımsızdır.",
    ],
    x: [
      "math.geo.euclid:perspektifin geometrisi",
      "neuro.sys.sensory:görsel algı ve dikkat",
      "res.data.visualization:görsel tasarım ilkeleri",
    ],
    notes: ["Eser, sanatçı ve akım tarihlerini müze ve akademik sanat tarihi kaynaklarından doğrula."],
    rel: ["gk.world.renaissance"],
    tags: ["sanat", "gorsel-okuma"],
    src: true,
  })
  .o("gk.art.music", "Müzik kültürü", {
    d: "Farklı müzik geleneklerinin temel yapıları, aralık ve ölçü kavramları ve müziğin fiziksel ve algısal temelleri.",
    w: "Ses fiziği, işitme nörobilimi ve kültür tarihini tek bir deneyimde buluşturur.",
    pre: ["phys.waves.sound~c"],
    q: [
      "İki notanın 'uyumlu' ya da 'uyumsuz' duyulmasının nedeni fizikte mi, beyinde mi, kültürde mi? Bir hipotez kur.",
    ],
    cq: [
      "Aralıklar ve armoni frekans oranlarıyla nasıl ilişkilidir?",
      "Makam ve ton sistemleri gibi farklı gelenekler sesi nasıl örgütler?",
      "Müzik algısı ve duygu beyinde nasıl işlenir?",
    ],
    obj: [
      "Temel aralıkları frekans oranlarıyla ilişkilendirip hesaplar",
      "İki farklı müzik geleneğini yapı ve kullanım açısından karşılaştırır",
      "Bir müzik parçasını form ve ritim açısından çözümler",
    ],
    ev: "HESAPLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Uyum algısı tamamen evrenseldir; kültürün rolü yoktur.",
      "Bir enstrümanın tınısı yalnızca temel frekansla belirlenir.",
    ],
    x: [
      "phys.waves.sound:frekans, harmonikler ve tını",
      "math.fourier:bir sesi harmoniklerine ayırmak",
      "neuro.sys.sensory:işitme sistemi",
    ],
    notes: ["Müzik geleneklerine dair tarihsel iddiaları ve terimleri akademik müzikoloji kaynaklarından doğrula."],
    rel: ["gk.art.visual"],
    tags: ["muzik", "ses"],
    opt: true,
    src: true,
  })
  .done();
