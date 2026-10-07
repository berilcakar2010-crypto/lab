import { builder } from "../dsl";

/**
 * MEDYA — medya okuryazarlığı. Yalnızca yöntem: belirli güncel olaylara,
 * kişilere ya da kuruluşlara dair iddia içermez.
 */
export const MEDIA = builder("MEDYA")
  // ───────────────────────────── Doğrulama
  .unit("Medya okuryazarlığı", "Doğrulama")
  .o("media.lit.source-evaluation", "Kaynak değerlendirme: yanal okuma ve SIFT", {
    d: "Bir kaynağı yalnızca kendi sayfasına bakarak değil, başka kaynaklarda onun hakkında ne söylendiğine bakarak (yanal okuma) değerlendirme; Dur-İncele-Daha iyisini bul-İzini sür (SIFT) adımları.",
    w: "İnternette karşılaşılan her bilgi için ilk süzgeçtir; araştırma projelerinde kaynak seçimi ve günlük bilgi tüketiminde doğrudan kullanılır.",
    pre: ["gk.method.historical-thinking~s"],
    q: [
      "Profesyonel görünen, kaynakçası olan, iyi tasarlanmış bir site güvenilir midir? Bunu sitenin kendisine bakmadan nasıl anlayabilirsin?",
    ],
    cq: [
      "Neden bir sitenin 'hakkımızda' sayfası güvenilirliği değerlendirmek için yetersizdir?",
      "Yanal okuma dikey okumadan neden daha hızlı ve daha isabetlidir?",
      "Bir iddianın özgün kaynağına nasıl ulaşılır?",
    ],
    obj: [
      "Bilinmeyen bir kaynağı birkaç dakika içinde yanal okumayla değerlendirir ve gerekçesini yazar",
      "Bir iddianın izini sürerek özgün kaynağına ulaşır",
      "SIFT adımlarını verilen bir paylaşım üzerinde uygular ve her adımda ne bulduğunu raporlar",
    ],
    ev: "ARASTIRMA_UYGULAMASI YORUMLAMA TRANSFER",
    t: "BECERI",
    lv: 1,
    sc: "S",
    mis: [
      "Profesyonel tasarım ve resmî görünen bir alan adı güvenilirlik işaretidir.",
      "Bir kaynağı değerlendirmek için onu baştan sona dikkatle okumak gerekir.",
    ],
    x: [
      "gk.method.historical-thinking:kaynak eleştirisi tarihçilerin temel yöntemidir",
      "res.lit.search:akademik kaynak seçimi",
    ],
    rel: ["media.lit.claim-analysis"],
    tags: ["dogrulama", "kaynak", "sift"],
  })
  .o("media.lit.claim-analysis", "İddia analizi ve kanıt düzeyleri", {
    d: "Bir iddiayı içerik, kanıt türü ve kanıt düzeyi açısından ayrıştırma: anekdot, gözlemsel çalışma, deney, sistematik derleme.",
    w: "Sağlık, bilim ve toplum haberlerinde hangi iddiaya ne kadar güvenileceğini belirlemeyi sağlar; araştırma tasarımı bilgisini gündelik hayata taşır.",
    pre: ["media.lit.source-evaluation", "gk.phil.intro~s"],
    q: [
      "Bir arkadaşın bir takviyeyi kullanıp kendini daha iyi hissettiğini söylüyor. Bu, takviyenin işe yaradığını gösterir mi? Başka hangi açıklamalar olabilir?",
    ],
    cq: [
      "Bir iddia hangi bileşenlere ayrılır (kim, ne, hangi kanıtla, ne kadar emin)?",
      "Kanıt düzeyleri neden bir hiyerarşi oluşturur ve bu hiyerarşinin sınırları nelerdir?",
      "Korelasyon nedensellik iddiasına ne zaman dönüştürülebilir?",
    ],
    obj: [
      "Bir haber metnindeki iddiaları ayıklayıp her birinin dayandığı kanıt türünü sınıflandırır",
      "Bir nedensellik iddiasına en az iki alternatif açıklama (karıştırıcı, ters nedensellik, şans) önerir",
      "İddianın gücünü kanıtın gücüyle karşılaştırıp abartıyı tespit eder",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Çok sayıda kişisel deneyim bilimsel kanıt yerine geçer.",
      "'Bir çalışma gösterdi ki' ifadesi iddianın kanıtlandığı anlamına gelir.",
    ],
    x: [
      "res.method.causal:korelasyon ve nedensellik",
      "res.method.experimental-design:kontrollü deneyin kanıt değeri",
      "gk.phil.intro:argüman yapısı ve safsatalar",
    ],
    rel: ["media.lit.science-news", "media.lit.stats-in-news"],
    tags: ["iddia", "kanit"],
  })
  .o("media.lit.stats-in-news", "Haberlerde sayı ve grafik okuma", {
    d: "Mutlak ve göreli risk, yüzde ve yüzde puanı, eksen manipülasyonu, seçici zaman aralığı ve paydasız sayılar gibi yaygın sayısal yanıltmaları tanıma.",
    w: "Haberlerdeki sayıların çoğu doğru ama yanıltıcı sunulur; istatistik bilgisini gerçek hayatta savunma aracına dönüştürür.",
    pre: ["media.lit.claim-analysis", "math.stat.descriptive", "math.prob.basics~s"],
    q: [
      "'Bu ilaç riski %50 azaltıyor' manşeti, riskin binde 2'den binde 1'e düşmesi anlamına geliyorsa hâlâ etkileyici mi? Hangi bilgi eksik?",
      "Y ekseni sıfırdan başlamayan bir grafikte küçük bir değişim nasıl görünür? Çiz ve dene.",
    ],
    cq: [
      "Göreli risk ile mutlak risk arasındaki fark algıyı nasıl değiştirir?",
      "Grafik tasarımı (eksen, ölçek, zaman aralığı) yorumu nasıl yönlendirir?",
      "Bir sayının anlamlı olması için hangi bağlam (payda, karşılaştırma, belirsizlik) gerekir?",
    ],
    obj: [
      "Göreli riski mutlak riske ve tedavi için gereken sayıya çevirerek hesaplar",
      "Yanıltıcı bir grafiği tespit edip aynı veriyi dürüst biçimde yeniden çizer",
      "Bir haberdeki sayının eksik bağlamını belirleyip doğru soruyu formüle eder",
    ],
    ev: "HESAPLAMA YORUMLAMA VERI_ANALIZI",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Yüzde artışı ile yüzde puan artışı aynı şeydir.",
      "Bir grafikteki dik eğim her zaman büyük bir değişim demektir.",
      "Büyük mutlak sayılar her zaman büyük bir sorunu gösterir.",
    ],
    x: [
      "math.stat.descriptive:özet istatistikler ve görselleştirme",
      "math.prob.basics:koşullu olasılık ve taban oranı",
      "res.data.visualization:dürüst grafik tasarımı",
    ],
    rel: ["media.lit.science-news"],
    tags: ["istatistik", "grafik", "sayi-okuryazarligi"],
  })
  .o("media.lit.science-news", "Bilim haberlerini değerlendirme", {
    d: "Bir bilim haberini özgün makaleye geri götürme; örneklem, model organizma, ön baskı, hakem süreci ve basın bülteni abartısını değerlendirme.",
    w: "Nörobilim ve sağlık haberleri en çok abartılan alanlardır; araştırma okuryazarlığını kamusal bilgiyle buluşturur.",
    pre: ["media.lit.claim-analysis", "res.lit.reading~s", "res.stats.pitfalls~s"],
    q: [
      "'Bilim insanları X'in beyni geliştirdiğini keşfetti' başlıklı bir haberin dayandığı çalışma farelerde yapılmışsa, başlık ne kadar doğrudur? Nasıl yeniden yazardın?",
    ],
    cq: [
      "Haber, basın bülteni ve özgün makale arasında iddia nasıl değişir?",
      "Bir çalışmanın dış geçerliliğini (fare → insan, laboratuvar → hayat) hangi etkenler sınırlar?",
      "Tek bir çalışma ile bilimsel uzlaşı arasındaki fark nasıl anlaşılır?",
    ],
    obj: [
      "Bir bilim haberinden özgün makaleye ulaşıp iki metnin iddialarını karşılaştırır",
      "Bir çalışmanın sınırlılıklarını (örneklem, tasarım, model) listeleyip haberin abartısını değerlendirir",
      "Abartılı bir başlığı kanıtla orantılı biçimde yeniden yazar",
    ],
    ev: "YORUMLAMA ARASTIRMA_UYGULAMASI TRANSFER",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Hakemli bir dergide yayımlanan her sonuç kesinleşmiş bilgidir.",
      "Hayvan deneylerinin sonuçları doğrudan insanlara uygulanabilir.",
      "Tek bir yeni çalışma, önceki tüm kanıtları geçersiz kılar.",
    ],
    x: [
      "res.lit.reading:makalenin yöntem ve sonuç bölümlerini okumak",
      "res.stats.pitfalls:p-hacking ve küçük örneklem sorunları",
      "neuro.methods.imaging:beyin görüntüleme bulgularının sınırları",
    ],
    ra: ["Bir bilim haberini özgün makaleyle karşılaştıran kısa bir rapor"],
    rel: ["media.lit.production"],
    tags: ["bilim-haberi", "dogrulama"],
  })
  .o("media.lit.image-video", "Görsel ve video doğrulama", {
    d: "Görüntülerin bağlamından koparılması, ters görsel arama, meta veri, konum ve zaman doğrulama gibi yöntemler.",
    w: "Yanıltıcı içeriğin büyük kısmı sahte değil, yanlış bağlamdaki gerçek görüntülerdir; bunları ayırt etmek hızlı ve sistematik bir yöntem gerektirir.",
    pre: ["media.lit.source-evaluation"],
    q: [
      "Gerçek bir fotoğraf, değiştirilmeden de yalan söyleyebilir mi? Nasıl? Bir örnek senaryo kur.",
    ],
    cq: [
      "Bir görüntünün ilk ne zaman ve nerede yayımlandığı nasıl bulunur?",
      "Görüntüdeki gölge, tabela, hava durumu gibi ipuçları konum ve zamanı nasıl doğrular?",
      "Kırpma ve yanlış başlık bağlamı nasıl değiştirir?",
    ],
    obj: [
      "Ters görsel aramayla bir görüntünün en eski kaynağını bulur",
      "Görüntüdeki ipuçlarından konum ve zaman hakkında gerekçeli bir çıkarım yapar",
      "Bağlamından koparılmış bir görüntünün nasıl yanılttığını açıklar",
    ],
    ev: "ARASTIRMA_UYGULAMASI YORUMLAMA PROBLEM_COZME",
    t: "BECERI",
    lv: 2,
    sc: "S",
    mis: [
      "Değiştirilmemiş bir fotoğraf her zaman doğruyu gösterir.",
      "Bir videonun çok paylaşılmış olması doğru olduğunu gösterir.",
    ],
    x: [
      "phys.optics.geometric:gölge yönü ve uzunluğundan zaman çıkarımı",
      "gk.geo.maps:konum doğrulamada harita kullanımı",
    ],
    rel: ["media.lit.ai-content"],
    tags: ["gorsel-dogrulama", "video"],
  })

  // ───────────────────────────── Dijital ekosistem
  .unit("Medya okuryazarlığı", "Dijital ekosistem")
  .o("media.lit.algorithms", "Algoritmalar, öneri sistemleri ve filtre balonları", {
    d: "Öneri algoritmalarının etkileşimi en üst düzeye çıkarmak için neyi ölçtüğü ve bunun gördüğümüz içeriği nasıl biçimlendirdiği.",
    w: "Bilgi ortamının tarafsız olmadığını anlamayı sağlar; makine öğrenmesi kavramlarının toplumsal etkisini somutlaştırır.",
    pre: ["media.lit.source-evaluation", "prog.ml.basics~c"],
    q: [
      "Senin ve bir arkadaşının aynı uygulamada gördüğü akış neden farklıdır? Algoritma neyi 'ödül' olarak görüyor olabilir, tahmin et.",
    ],
    cq: [
      "Öneri sistemleri hangi sinyalleri (tıklama, izleme süresi, beğeni) optimize eder?",
      "Geri besleme döngüleri filtre balonu ve kutuplaşmayı nasıl güçlendirebilir?",
      "Kullanıcı akışını bilinçli olarak nasıl çeşitlendirebilir?",
    ],
    obj: [
      "Basit bir öneri sistemini hedef fonksiyonu ve geri besleme döngüsüyle diyagrama döker",
      "Kendi akışında bir hafta boyunca gözlem yapıp örüntüleri raporlar",
      "Etkileşim odaklı optimizasyonun olası yan etkilerini açıklar",
    ],
    ev: "DIAGRAM ACIKLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Akışımda gördüklerim, tarafsız biçimde 'en önemli' içeriklerdir.",
      "Algoritmalar tek bir kişi tarafından elle seçilen kurallardan ibarettir.",
    ],
    x: [
      "prog.ml.basics:sınıflandırma ve hedef fonksiyon",
      "neuro.comp.reinforcement:ödül sinyaliyle öğrenen sistemler",
      "math.opt.optimization:bir metriği optimize etmenin yan etkileri",
    ],
    rel: ["media.lit.privacy", "media.lit.persuasion"],
    tags: ["algoritma", "oneri-sistemi", "filtre-balonu"],
  })
  .o("media.lit.ai-content", "Yapay zekâ üretimi içeriği tanıma", {
    d: "Üretken yapay zekânın metin, görsel, ses ve video üretme biçimi; tespit yöntemlerinin sınırları ve kaynak doğrulamanın önemi.",
    w: "Yapay içerik arttıkça 'göründüğü gibi mi?' sorusu yerine 'kaynağı ne?' sorusu önem kazanır; doğrulama becerilerini yeni bir bağlama aktarır.",
    pre: ["media.lit.image-video", "media.lit.algorithms~s"],
    q: [
      "Bir yapay zekâ tespit aracı bir metne 'insan yazdı' diyorsa buna ne kadar güvenebilirsin? Bu araç nasıl yanılabilir?",
    ],
    cq: [
      "Üretken modeller içeriği nasıl üretir ve neden 'akla yatkın ama yanlış' çıktılar verebilir?",
      "Görsel ipuçlarına dayalı tespit neden giderek güvenilmez hale gelir?",
      "Kaynak ve köken (provenance) doğrulaması bu soruna nasıl yaklaşır?",
    ],
    obj: [
      "Üretken bir modelin uydurma (halüsinasyon) yapma nedenini olasılıksal tahmin fikriyle açıklar",
      "Şüpheli bir içerik için yalnızca görünüşe değil kaynağa dayalı bir doğrulama planı uygular",
      "Bir yapay zekâ çıktısındaki olgusal iddiaları bağımsız kaynaklarla kontrol eder",
    ],
    ev: "ACIKLAMA ARASTIRMA_UYGULAMASI TRANSFER",
    t: "BECERI",
    lv: 2,
    sc: "S",
    mis: [
      "Yapay zekâ içeriği her zaman belirgin hatalardan tanınabilir.",
      "Tespit araçları güvenilir ve kesin sonuç verir.",
      "Akıcı ve kendinden emin bir metin doğrudur.",
    ],
    x: [
      "prog.ml.neural-nets:üretken modellerin temeli",
      "neuro.comp.ann-bridge:yapay ağlar ve insan algısı",
      "math.prob.distributions:olasılıksal sözcük tahmini",
    ],
    rel: ["media.lit.image-video"],
    tags: ["yapay-zeka", "dogrulama"],
  })
  .o("media.lit.persuasion", "İkna, propaganda ve bilişsel yanlılıklar", {
    d: "Duygusal çekicilik, tekrar, düşman imgesi, sahte uzlaşı gibi ikna teknikleri ve bunların istismar ettiği bilişsel yanlılıklar.",
    w: "Reklam, siyasi söylem ve sosyal medyada kendi düşünce süreçlerini fark etmeyi sağlar; nörobilim ve psikolojiyi gündelik hayata bağlar.",
    pre: ["media.lit.claim-analysis", "neuro.cog.decision~c"],
    q: [
      "Bir iddiayı ne kadar çok duyarsan o kadar doğru gelir mi? Bunu kendinde test eden küçük bir deney tasarla.",
    ],
    cq: [
      "Doğrulama yanlılığı ve tekrar etkisi inançları nasıl pekiştirir?",
      "Propaganda teknikleri hangi duygusal ve bilişsel süreçleri hedefler?",
      "Kendi yanlılıklarımıza karşı hangi pratik önlemler işe yarar?",
    ],
    obj: [
      "Bir ikna metninde kullanılan teknikleri adlandırıp etkisini açıklar",
      "Bir yanlılığın mekanizmasını karar verme süreçleriyle ilişkilendirir",
      "Kendi bilgi tüketimi için yanlılıklara karşı somut bir kontrol listesi oluşturur",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Yalnızca az eğitimli insanlar propagandadan etkilenir.",
      "Yanlılıkları bilmek onlardan bağışıklık kazandırır.",
    ],
    x: [
      "neuro.cog.decision:karar verme ve ödül sistemleri",
      "neuro.cog.emotion:duygunun yargıya etkisi",
      "gk.econ.behavioral:çerçeveleme ve kayıptan kaçınma",
    ],
    rel: ["media.lit.algorithms"],
    tags: ["ikna", "propaganda", "yanlilik"],
  })
  .o("media.lit.current-events-method", "Güncel olayları takip etme yöntemi", {
    d: "Gelişmekte olan olaylarda ilk haberlerin belirsizliğini kabul etme, birden çok kaynağı karşılaştırma ve bilgi diyeti oluşturma yöntemi.",
    w: "Hızla yayılan ve sonradan düzeltilen bilgiler karşısında sabırlı ve sistematik bir tutum kazandırır; belirli olaylardan bağımsız, kalıcı bir alışkanlıktır.",
    pre: ["media.lit.source-evaluation", "media.lit.claim-analysis"],
    q: [
      "Bir olayın ilk saatlerinde çıkan haberlerin ne kadarı sonradan düzeltilir sence? Bu durumda ne zaman paylaşım yapmalısın?",
    ],
    cq: [
      "Haber, yorum ve analiz türleri nasıl ayırt edilir?",
      "Gelişmekte olan bir olayda hangi bilgiler güvenilir, hangileri beklemeli?",
      "Dengeli bir bilgi diyeti nasıl kurulur?",
    ],
    obj: [
      "Bir metni haber, yorum ya da analiz olarak sınıflandırır ve gerekçesini belirtir",
      "Farklı bakış açılarından kaynakları içeren kişisel bir bilgi diyeti planı oluşturur",
      "Bir konuyu birkaç gün boyunca takip edip bilginin nasıl değiştiğini kaydeder",
    ],
    ev: "YORUMLAMA ARASTIRMA_UYGULAMASI TRANSFER",
    t: "PRATIK",
    lv: 2,
    sc: "S",
    mis: [
      "İlk çıkan haber genellikle en doğru haberdir.",
      "Tek bir güvenilir kaynak takip etmek yeterlidir.",
    ],
    x: ["gk.method.historical-thinking:anlatıların zamanla değişmesi", "gk.civics.democracy:bilgilenmiş vatandaşlık"],
    rel: ["media.lit.claim-analysis"],
    tags: ["guncel-olaylar", "yontem"],
  })
  .o("media.lit.privacy", "Dijital gizlilik ve veri güvenliği", {
    d: "Kişisel verinin nasıl toplandığı ve kullanıldığı, izin mekanizmaları, güçlü parola, iki adımlı doğrulama ve oltalama saldırılarını tanıma.",
    w: "Kişisel güvenliği ve araştırma verilerinin korunmasını sağlar; algoritmaların hangi veriyle beslendiğini somutlaştırır.",
    pre: ["media.lit.algorithms~s"],
    q: [
      "Uygulama ücretsizse, şirket parayı nereden kazanıyor? 'Ürün' kim olabilir?",
    ],
    cq: [
      "Hangi kişisel veriler toplanır ve bunlardan hangi çıkarımlar yapılabilir?",
      "Bir oltalama mesajı hangi ipuçlarından tanınır?",
      "Parola güvenliği neden uzunluk ve benzersizliğe bağlıdır?",
    ],
    obj: [
      "Bir uygulamanın izinlerini ve gizlilik ayarlarını inceleyip risk değerlendirmesi yapar",
      "Parola uzunluğunun olası kombinasyon sayısına etkisini hesaplar",
      "Örnek mesajlar arasında oltalama girişimlerini tespit edip gerekçesini açıklar",
    ],
    ev: "HESAPLAMA YORUMLAMA TRANSFER",
    t: "UYGULAMA",
    lv: 2,
    sc: "S",
    mis: [
      "Saklayacak bir şeyim yoksa gizlilik önemsizdir.",
      "Karmaşık ama kısa bir parola, uzun bir paroladan daha güvenlidir.",
    ],
    x: [
      "math.prob.counting:parola kombinasyonlarının sayılması",
      "res.data.management:araştırma verisinin güvenliği",
      "gk.civics.law-basics:kişisel verilerin hukuki korunması",
    ],
    rel: ["media.lit.algorithms"],
    tags: ["gizlilik", "guvenlik"],
  })
  .o("media.lit.production", "Sorumlu içerik üretimi ve bilim iletişimi", {
    d: "Bilimsel bir bulguyu kanıtla orantılı, anlaşılır ve kaynaklı biçimde geniş kitleye anlatan içerik üretme.",
    w: "Okuryazarlığı üreticiliğe dönüştürür; öğrencinin kendi araştırmasını ve öğrendiklerini topluma sorumlu biçimde aktarmasını sağlar.",
    pre: ["media.lit.science-news", "res.write.presentation~s"],
    q: [
      "Karmaşık bir bilimsel bulguyu 60 saniyelik bir videoda yanlış bilgi vermeden anlatabilir misin? Neyi atar, neyi mutlaka tutarsın?",
    ],
    cq: [
      "Basitleştirme ile çarpıtma arasındaki çizgi nerededir?",
      "Belirsizlik ve sınırlılıklar geniş kitleye nasıl aktarılır?",
      "Kaynak gösterme ve düzeltme yayımlama neden güven inşa eder?",
    ],
    obj: [
      "Bir bilimsel makaleyi kanıtla orantılı kısa bir popüler metne ya da videoya dönüştürür",
      "Ürettiği içerikte belirsizliği ve sınırlılıkları açıkça belirtir",
      "Akranlarından geri bildirim alıp içeriğini doğruluk açısından revize eder",
    ],
    ev: "TRANSFER ARASTIRMA_UYGULAMASI ACIKLAMA",
    t: "UYGULAMA",
    lv: 3,
    sc: "L",
    mis: [
      "İyi bilim iletişimi her ayrıntıyı vermektir.",
      "İzleyiciyi etkilemek için biraz abartı zararsızdır.",
    ],
    x: [
      "res.write.presentation:bilimsel sunum becerileri",
      "en.c1.sci-communication:İngilizce bilim iletişimi",
      "neuro.cog.learning-memory:anlaşılır anlatımın bellek temeli",
    ],
    ra: ["Kendi araştırma projesi için popüler bilim özeti"],
    ca: ["Bilim iletişimi ve sunum yarışmaları"],
    rel: ["media.lit.science-news"],
    tags: ["bilim-iletisimi", "icerik-uretimi"],
  })
  .done();
