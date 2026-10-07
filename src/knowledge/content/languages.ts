import { builder } from "../dsl";

/**
 * Yabancı diller: İngilizce (B1→C2), Almanca (A1→C1), Japonca (N5→N3).
 * Her dil hem genel hem bilimsel/akademik kullanım için tasarlanmıştır.
 * Sınav biçimleri, puanlama ve kanji sayıları gibi bilgiler değişebilir;
 * `src: true` nesnelerde resmî kaynaklardan doğrulanmalıdır.
 */

// ═════════════════════════════════════════════ İNGİLİZCE
export const ENGLISH = builder("INGILIZCE")
  .unit("İngilizce", "Genel İngilizce")
  .o("en.b1.grammar-review", "B1: Dilbilgisi sağlamlaştırma (zamanlar, koşul cümleleri, edilgen)", {
    d: "Zaman sistemi, koşul cümleleri ve edilgen yapının bilinçli ve hatasız kullanımına yönelik sağlamlaştırma.",
    w: "Akademik okuma ve yazımın taşıyıcı iskeletidir: bilimsel metinlerde edilgen yapı ve koşul cümleleri ('if the temperature increases…') sürekli karşına çıkar.",
    pre: ["comp.meta.learning-to-learn~h"],
    q: [
      "'I have lived here for five years' ile 'I lived here for five years' cümlelerini söyleyen iki kişiden hangisi hâlâ orada yaşıyor? Nereden anladın?",
      "Bilimsel makalelerde neden 'We heated the sample' yerine sıkça 'The sample was heated' yazılır? Tahmin et.",
    ],
    cq: [
      "Present perfect ile past simple arasındaki seçim neye göre yapılır?",
      "Koşul cümlelerinin türleri gerçeklik derecesini nasıl ifade eder?",
      "Edilgen yapı ne zaman tercih edilir, ne zaman metni bulanıklaştırır?",
    ],
    obj: [
      "Bağlama uygun zamanı seçerek kısa bir deneyim paragrafı yazar",
      "Bir deney sonucunu gerçek ve varsayımsal koşul cümleleriyle ifade eder",
      "Etken bir yöntem paragrafını edilgene çevirir ve hangisinin daha uygun olduğunu gerekçelendirir",
    ],
    ev: "TRANSFER YORUMLAMA ACIKLAMA",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Türkçedeki '-di' her zaman past simple'a karşılık gelir.",
      "Edilgen yapı her zaman daha 'akademik' ve daha iyidir.",
    ],
    x: ["res.write.report:bilimsel yazımda zaman ve edilgen seçimi"],
    rel: ["en.b1.vocab"],
    tags: ["ingilizce", "dilbilgisi", "b1"],
  })
  .o("en.b1.vocab", "B1: Sözcük öğrenme stratejileri ve dağarcık", {
    d: "Sık kullanılan sözcükleri bağlam içinde öğrenme, kök-ek analizi, eşdizimler ve aralıklı tekrarla kalıcı dağarcık kurma.",
    w: "Okuma ve dinlemedeki anlama oranı büyük ölçüde dağarcığa bağlıdır; bilimsel terimlerin çoğu Latince/Yunanca köklerle tahmin edilebilir.",
    pre: ["en.b1.grammar-review~s"],
    q: [
      "'Neuroplasticity' kelimesini hiç görmediysen bile parçalarından anlamını tahmin edebilir misin? Dene.",
      "Bir kelimeyi listeden 20 kez tekrar etmek mi, 5 farklı cümlede görmek mi daha kalıcıdır? Tahmin et.",
    ],
    cq: [
      "Hangi sözcükler önce öğrenilmeli (sıklık ilkesi)?",
      "Kök ve ekler bilinmeyen sözcüğün anlamını tahmin etmeye nasıl yardım eder?",
      "Aralıklı tekrar ve geri çağırma sözcük öğrenmeyi nasıl kalıcılaştırır?",
    ],
    obj: [
      "Okuduğu metinlerden eşdizimleriyle birlikte kişisel bir kelime kartı destesi oluşturur",
      "Bilinmeyen sözcüklerin anlamını kök-ek ve bağlamdan tahmin edip sözlükle doğrular",
      "Aralıklı tekrar takvimi kurup bir ay boyunca uygular ve hatırlama oranını kaydeder",
    ],
    ev: "TRANSFER YORUMLAMA ACIKLAMA",
    t: "PRATIK",
    lv: 1,
    sc: "M",
    mis: [
      "Bir kelimeyi bilmek Türkçe karşılığını bilmektir.",
      "Ne kadar çok kelime listesi ezberlersem o kadar iyi konuşurum.",
    ],
    x: [
      "neuro.cog.learning-memory:aralıklı tekrar ve geri çağırma etkisi",
      "comp.meta.learning-to-learn:öğrenme stratejileri",
    ],
    rel: ["en.c1.academic-vocab"],
    tags: ["ingilizce", "sozcuk", "b1"],
  })
  .o("en.b2.reading", "B2: Okuma stratejileri (göz gezdirme, tarama, çıkarım)", {
    d: "Amaca göre okuma hızını ve stratejisini ayarlama: ana fikir için göz gezdirme, bilgi için tarama, ima edilen anlamı çıkarma.",
    w: "Kaynakların çoğu İngilizcedir; doğru stratejiyle bir makale veya ders kitabı bölümünden ihtiyaç duyulan bilgiyi verimli biçimde çıkarmayı sağlar.",
    pre: ["en.b1.vocab", "en.b1.grammar-review"],
    q: [
      "Bir metnin her kelimesini anlamadan ana fikrini yakalayabilir misin? Yalnızca başlıklara ve paragrafların ilk cümlelerine bakarak bir tahmin yap, sonra metni oku ve karşılaştır.",
    ],
    cq: [
      "Göz gezdirme ve tarama hangi amaçlarla kullanılır?",
      "Metindeki bağlaçlar ve sinyal sözcükler argüman yapısını nasıl gösterir?",
      "Yazarın açıkça söylemediği bir tutum nasıl çıkarılır?",
    ],
    obj: [
      "Uzun bir metnin ana fikrini kısa sürede göz gezdirerek belirler ve doğrular",
      "Bir metinde belirli bilgiyi tarayarak bulur",
      "Yazarın tutumunu metinden kanıtlarla çıkarır",
    ],
    ev: "YORUMLAMA TRANSFER",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "İyi okumak her kelimeyi sözlükte bakmaktır.",
      "Hızlı okumak her zaman yüzeysel okumaktır.",
    ],
    x: ["gk.lit.reading-analysis:çıkarım ve yorum becerileri", "res.lit.reading:makale okuma stratejileri"],
    rel: ["en.c1.sci-reading"],
    tags: ["ingilizce", "okuma", "b2"],
  })
  .o("en.b2.listening", "B2: Ders ve konuşma dinleme, not alma", {
    d: "Ders, seminer ve podcast gibi uzun konuşmaları takip etme, ana fikir ve ayrıntıyı ayırt edip yapılandırılmış not alma.",
    w: "Çevrim içi dersler, yaz okulları ve konferans konuşmaları İngilizcedir; dinlerken not alma becerisi doğrudan öğrenme verimliliğini belirler.",
    pre: ["en.b1.vocab"],
    q: [
      "Bir konuşmacı 'There are three reasons…' dediğinde notunu nasıl düzenlersin? Bu tür sinyaller dinlemeyi nasıl kolaylaştırır?",
    ],
    cq: [
      "Konuşmacının yapı sinyalleri (first, however, in summary) nasıl yakalanır?",
      "Ana fikir ile örnek ve ayrıntı nasıl ayırt edilir?",
      "Not alma yöntemleri (Cornell, zihin haritası) hangi dinleme türüne uygundur?",
    ],
    obj: [
      "İngilizce bir bilim dersini dinleyip yapılandırılmış not çıkarır",
      "Notlarından konuşmanın ana argümanını kısa bir özetle yeniden kurar",
      "Farklı aksanlardaki konuşmaları anlama düzeyini izleyip zorlandığı noktaları raporlar",
    ],
    ev: "YORUMLAMA TRANSFER",
    t: "PRATIK",
    lv: 2,
    sc: "M",
    mis: [
      "Altyazıyla izlemek dinleme becerisini aynı ölçüde geliştirir.",
      "Her kelimeyi duymadan konuşmayı anlamak mümkün değildir.",
    ],
    x: ["neuro.cog.attention:uzun süreli dinlemede dikkat yönetimi", "neuro.sys.sensory:işitsel algı"],
    rel: ["en.b2.speaking"],
    tags: ["ingilizce", "dinleme", "b2"],
  })
  .o("en.b2.speaking", "B2: Akıcı konuşma ve tartışma", {
    d: "Bir konuda görüş bildirme, gerekçelendirme, karşı görüşe yanıt verme ve tartışmayı sürdürme.",
    w: "Mülakatlar, yaz okulu tartışmaları ve uluslararası işbirlikleri için gereklidir; düşünceyi gerçek zamanlı olarak dile dökmeyi öğretir.",
    pre: ["en.b1.grammar-review", "en.b2.listening~s"],
    q: [
      "Konuşurken bir kelimeyi hatırlayamazsan susmak yerine ne yapabilirsin? Üç farklı strateji öner.",
    ],
    cq: [
      "Görüş bildirme ve katılmama kibar ama net biçimde nasıl ifade edilir?",
      "Akıcılık ile doğruluk arasındaki denge nasıl kurulur?",
      "Bilinmeyen kelime karşısında dolaylı anlatım nasıl kullanılır?",
    ],
    obj: [
      "Bir bilim konusunda iki dakikalık hazırlıksız bir görüş konuşması yapar",
      "Bir tartışmada karşı görüşü özetleyip gerekçeli yanıt verir",
      "Kendi konuşma kaydını dinleyip tekrarlayan hataları belirler ve düzeltme planı kurar",
    ],
    ev: "ACIKLAMA TRANSFER",
    t: "PRATIK",
    lv: 3,
    sc: "M",
    mis: [
      "Hatasız konuşamıyorsam hiç konuşmamalıyım.",
      "Aksanım 'yerli' gibi değilse iyi konuşmuyorum demektir.",
    ],
    x: ["comp.meta.stress:konuşma kaygısını yönetmek", "gk.phil.intro:argüman kurma"],
    rel: ["en.c1.sci-communication"],
    tags: ["ingilizce", "konusma", "b2"],
  })
  .o("en.b2.writing", "B2: Paragraf ve deneme yazımı", {
    d: "Konu cümlesi, destekleyici ayrıntı ve bağlantı ifadeleriyle tutarlı paragraflar ve kısa denemeler yazma.",
    w: "Akademik yazımın temelidir; e-posta, başvuru metni ve rapor yazımında doğrudan kullanılır.",
    pre: ["en.b1.grammar-review", "en.b2.reading~s"],
    q: [
      "Bir paragraftaki cümlelerin sırasını karıştırsan, okur doğru sırayı hangi ipuçlarıyla bulabilir? Bu ipuçları yazarken sana ne söylüyor?",
    ],
    cq: [
      "İyi bir paragrafın yapısı nedir?",
      "Bağlantı ifadeleri (however, therefore, in contrast) mantıksal ilişkiyi nasıl gösterir?",
      "Bir deneme nasıl planlanır ve gözden geçirilir?",
    ],
    obj: [
      "Konu cümlesi ve kanıtlarla desteklenmiş tutarlı bir paragraf yazar",
      "Bir öğretmene ya da araştırmacıya resmî bir e-posta yazar",
      "Taslak bir denemeyi geri bildirim doğrultusunda revize eder",
    ],
    ev: "ACIKLAMA TRANSFER",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Uzun ve karmaşık cümleler yazı kalitesini artırır.",
      "Türkçe düşünüp kelime kelime çevirmek iyi bir yöntemdir.",
    ],
    x: ["res.write.report:yapılandırılmış yazım"],
    rel: ["en.c1.academic-writing"],
    tags: ["ingilizce", "yazma", "b2"],
  })
  .o("en.c2.style", "C2: Üslup, ton ve ince anlam farkları", {
    d: "Eşanlamlılar arasındaki ince farklar, ton ve kayıt (register) ayarı, ironi ve ima gibi ileri düzey dil kullanımı.",
    w: "Ana dil düzeyine yakın okuma ve yazma; edebi metinleri, ince eleştiri yazılarını ve ikna metinlerini tam anlamayı sağlar.",
    pre: ["en.c1.academic-writing"],
    q: [
      "'Slim', 'skinny' ve 'thin' aynı şeyi mi söyler? Her birini kullanan bir konuşmacının tutumu hakkında ne düşünürsün?",
    ],
    cq: [
      "Kayıt (resmî, nötr, gündelik) seçimi okura ne iletir?",
      "Eşanlamlı sözcükler arasındaki çağrışım farkı nasıl fark edilir?",
      "İroni ve ima metinde nasıl kurulur ve nasıl çözülür?",
    ],
    obj: [
      "Aynı içeriği üç farklı kayıtta yeniden yazar",
      "Bir metindeki ton değişimlerini ve bunları yaratan sözcük seçimlerini çözümler",
      "Kendi yazısında anlamı netleştiren üslup düzeltmeleri yapar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "CHALLENGE",
    lv: 5,
    sc: "L",
    mis: [
      "İleri düzey yazmak nadir ve süslü kelimeler kullanmaktır.",
      "Sözlükteki eşanlamlılar her bağlamda birbirinin yerine kullanılabilir.",
    ],
    x: ["gk.lit.world:edebi metinlerde üslup", "media.lit.persuasion:ton ve ikna"],
    rel: ["en.c1.academic-writing"],
    tags: ["ingilizce", "uslup", "c2"],
    opt: true,
  })

  .unit("İngilizce", "Akademik ve bilimsel İngilizce")
  .o("en.c1.academic-vocab", "C1: Akademik sözcük dağarcığı ve eşdizimler", {
    d: "Disiplinler arası akademik sözcükler (analyse, significant, hypothesis, consistent with) ve bunların doğru eşdizimleri.",
    w: "Bilimsel makalelerin ve akademik yazımın dili büyük ölçüde bu ortak dağarcığa dayanır; doğru eşdizim kullanımı yazıyı doğal kılar.",
    pre: ["en.b2.reading"],
    q: [
      "Bilimsel bir metinde 'significant' kelimesi gündelik dildeki 'önemli' ile aynı anlamı taşır mı? Bir istatistikçi bu kelimeyi okuyunca ne düşünür?",
    ],
    cq: [
      "Akademik sözcükler gündelik karşılıklarından nasıl ayrılır?",
      "Eşdizimler (conduct an experiment, draw a conclusion) neden tek tek kelime bilgisinden önemlidir?",
      "Bilimsel bağlamda anlam değiştiren sözcükler nelerdir (significant, theory, error)?",
    ],
    obj: [
      "Okuduğu makalelerden akademik eşdizimlerden oluşan bir sözlükçe derler",
      "Gündelik bir metni akademik dağarcıkla yeniden yazar",
      "Bilimsel bağlamda anlam değiştiren sözcükleri doğru kullanır ve farkı açıklar",
    ],
    ev: "TRANSFER ACIKLAMA",
    t: "PRATIK",
    lv: 3,
    sc: "M",
    mis: [
      "'Significant' her bağlamda 'büyük' ya da 'önemli' anlamındadır.",
      "Akademik dil, anlaşılması zor kelimeler kullanmak demektir.",
    ],
    x: [
      "math.stat.inference:'significant' teriminin istatistiksel anlamı",
      "gk.phil.science:'theory' kelimesinin bilimsel anlamı",
    ],
    rel: ["en.c1.academic-writing"],
    tags: ["ingilizce", "akademik", "c1"],
  })
  .o("en.c1.academic-writing", "C1: Akademik yazım: argüman, temkinli dil, kaynak", {
    d: "Tez cümlesi, kanıta dayalı argüman, temkinli dil (hedging: may, suggests, appears to) ve kaynak entegrasyonu ile akademik metin yazma.",
    w: "Araştırma raporu, başvuru metni ve bilimsel makale yazımının temelidir; iddiayı kanıtla orantılı ifade etmeyi öğretir.",
    pre: ["en.b2.writing", "en.c1.academic-vocab", "res.lit.citation~c"],
    q: [
      "'This proves that…' ile 'These results suggest that…' arasındaki fark ne? Hangisini ne zaman kullanırsın? Bir hakem hangisine itiraz eder?",
    ],
    cq: [
      "Temkinli dil iddianın gücünü kanıtla nasıl uyumlu hale getirir?",
      "Başka bir kaynağın fikri özetleme, aktarma ve alıntılama ile nasıl entegre edilir?",
      "Akademik bir paragrafın argüman yapısı nasıl kurulur?",
    ],
    obj: [
      "Bir bulguyu kanıt düzeyine uygun temkinli dille ifade eder",
      "Bir kaynağı intihale düşmeden özetleyip metnine entegre eder",
      "Tez cümlesi, kanıt ve karşı argüman içeren kısa bir akademik metin yazar",
    ],
    ev: "ACIKLAMA TRANSFER ARASTIRMA_UYGULAMASI",
    t: "BECERI",
    lv: 4,
    sc: "L",
    mis: [
      "Temkinli dil zayıflık ya da kararsızlık göstergesidir.",
      "Bir cümlenin birkaç kelimesini değiştirmek intihalden kaçınmak için yeterlidir.",
    ],
    x: [
      "res.write.report:bilimsel rapor yapısı",
      "res.lit.citation:kaynak gösterme",
      "media.lit.claim-analysis:iddia ile kanıt arasındaki orantı",
    ],
    rel: ["en.c1.sci-reading"],
    tags: ["ingilizce", "akademik-yazim", "c1"],
  })
  .o("en.c1.sci-reading", "C1: İngilizce bilimsel makale okuma", {
    d: "Özet, giriş, yöntem, bulgular ve tartışma bölümlerini amaca göre okuma; şekil açıklamalarını ve teknik terimleri çözme.",
    w: "Araştırma yapmanın ön koşuludur: literatürün neredeyse tamamı İngilizcedir ve makaleyi verimli okumak araştırma hızını belirler.",
    pre: ["en.b2.reading", "en.c1.academic-vocab", "res.lit.reading~s"],
    q: [
      "Bir makaleyi baştan sona sırayla okumak zorunda mısın? Yalnızca özeti, şekilleri ve sonucu okusan neyi kaçırırsın, neyi kazanırsın?",
    ],
    cq: [
      "IMRaD yapısındaki her bölüm hangi soruyu yanıtlar?",
      "Şekil ve tablo açıklamaları nasıl okunur?",
      "Yazarların temkinli ifadeleri iddianın gücü hakkında ne söyler?",
    ],
    obj: [
      "İngilizce bir makalenin ana iddiasını, yöntemini ve sınırlılığını Türkçe kısa bir özetle aktarır",
      "Bir şekil açıklamasını okuyup şeklin ne gösterdiğini açıklar",
      "Makaledeki temkinli ifadeleri tespit edip iddianın gücünü değerlendirir",
    ],
    ev: "YORUMLAMA ARASTIRMA_UYGULAMASI TRANSFER",
    t: "UYGULAMA",
    lv: 4,
    sc: "L",
    mis: [
      "Bir makaleyi anlamak için her kelimeyi bilmek gerekir.",
      "Özet makalenin tüm önemli bilgisini içerir.",
    ],
    x: [
      "res.lit.reading:makale okuma yöntemi",
      "neuro.methods.data-analysis:nörobilim makalelerindeki yöntem dili",
      "media.lit.science-news:habere değil özgün makaleye gitmek",
    ],
    ra: ["Seçilen bir nörobilim ya da fizik makalesinin Türkçe özetini çıkarma"],
    rel: ["en.c1.sci-communication"],
    tags: ["ingilizce", "bilimsel-okuma", "c1"],
  })
  .o("en.c1.sci-communication", "C1: İngilizce bilimsel sunum ve poster", {
    d: "Bir araştırmayı İngilizce sözlü sunum ve poster olarak aktarma; soru-cevap bölümünü yönetme.",
    w: "Uluslararası yarışmalar, yaz okulları ve konferanslar için gereklidir; bilimsel düşünceyi kısa sürede net aktarmayı öğretir.",
    pre: ["en.b2.speaking", "en.c1.sci-reading~s", "res.write.presentation~c"],
    q: [
      "Bir jüri üyesi sunumunda anlamadığın bir soru sorarsa ne dersin? Hazırlıksız yakalanmamak için hangi kalıpları önceden hazırlarsın?",
    ],
    cq: [
      "Bilimsel sunumun yapısı ve geçiş ifadeleri nelerdir?",
      "Bir grafik İngilizce olarak adım adım nasıl anlatılır?",
      "Soru-cevap sırasında belirsizlik ve sınırlılık nasıl dürüstçe ifade edilir?",
    ],
    obj: [
      "Kendi projesi için beş dakikalık İngilizce bir sunum hazırlayıp yapar",
      "Bir grafiği eksenler, eğilim ve yorum sırasıyla İngilizce anlatır",
      "Zor bir soruya açıklama isteme, yeniden ifade etme ve dürüst sınır belirtme kalıplarıyla yanıt verir",
    ],
    ev: "ACIKLAMA TRANSFER ARASTIRMA_UYGULAMASI",
    t: "UYGULAMA",
    lv: 4,
    sc: "L",
    mis: [
      "Slaytlara tam metni yazıp okumak güvenli bir yöntemdir.",
      "Bir soruya 'bilmiyorum' demek sunumu başarısız kılar.",
    ],
    x: [
      "res.write.presentation:sunum ve poster tasarımı",
      "comp.research.science-fair:uluslararası proje yarışmaları",
      "media.lit.production:bilim iletişimi",
    ],
    ca: ["Uluslararası bilim fuarları ve proje yarışmalarında İngilizce sunum"],
    rel: ["en.c1.sci-reading"],
    tags: ["ingilizce", "sunum", "c1"],
  })
  .o("en.c1.math-physics-language", "Matematik ve fizik İngilizcesi: sembol okuma ve problem dili", {
    d: "Matematiksel ifadeleri sesli okuma ('the derivative of f with respect to x'), problem metinlerindeki kalıplar ve ispat dili ('suppose', 'it follows that', 'without loss of generality').",
    w: "Olimpiyat problemleri, İngilizce ders kitapları ve çevrim içi dersler bu dili kullanır; yanlış okunan tek bir ifade (at least, at most) problemi değiştirir.",
    pre: ["en.b2.reading", "math.found.algebra~c"],
    q: [
      "'∫₀¹ x² dx' ifadesini İngilizce yüksek sesle nasıl okursun? 'At most two' ile 'at least two' arasındaki fark bir olimpiyat probleminin yanıtını nasıl değiştirir?",
    ],
    cq: [
      "Temel matematiksel semboller ve işlemler İngilizce nasıl okunur?",
      "Problem metinlerindeki niceleyiciler (at least, exactly, for all, there exists) nasıl yorumlanır?",
      "İspat yazımında hangi kalıplar mantıksal adımları işaret eder?",
    ],
    obj: [
      "Kalkülüs ve cebir ifadelerini İngilizce doğru biçimde sesli okur",
      "İngilizce bir olimpiyat problemini niceleyicileri doğru yorumlayarak Türkçeye aktarır",
      "Kısa bir ispatı İngilizce ispat kalıplarıyla yazar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "BECERI",
    lv: 3,
    sc: "S",
    mis: [
      "Matematik evrensel bir dildir; problem metnindeki İngilizce ayrıntılar önemsizdir.",
      "'If' ile 'if and only if' aynı anlamdadır.",
    ],
    x: [
      "math.found.logic:niceleyiciler ve koşul ifadeleri",
      "math.comp.olympiad-methods:İngilizce olimpiyat problemleri",
      "phys.mech.newton:İngilizce fizik problemlerinin dili",
    ],
    ca: ["Uluslararası olimpiyatlarda İngilizce problem metinleri"],
    rel: ["en.c1.academic-vocab"],
    tags: ["ingilizce", "matematik", "fizik"],
  })
  .o("en.exam.prep", "İngilizce yeterlik sınavlarına hazırlık (IELTS, TOEFL)", {
    d: "Uluslararası yeterlik sınavlarının bölüm yapısı, görev türleri ve stratejilerine yönelik planlı hazırlık.",
    w: "Yurt dışı yaz okulları ve üniversite başvurularında istenebilir; hazırlık süreci tüm becerileri ölçülebilir hedeflere bağlar.",
    pre: ["en.c1.academic-writing", "en.b2.listening"],
    q: [
      "Bir sınavda iyi puan almak ile dili iyi kullanmak aynı şey mi? Arada fark varsa hazırlığını nasıl dengelersin?",
    ],
    cq: [
      "Sınavın her bölümü hangi beceriyi ve nasıl ölçer?",
      "Görev türlerine özgü stratejiler nelerdir?",
      "Deneme sınavı sonuçları zayıf noktaları hedefleyen bir plana nasıl dönüştürülür?",
    ],
    obj: [
      "Resmî kaynaklardan sınav yapısını araştırıp bir hazırlık takvimi kurar",
      "Zamanlı bir deneme sınavı çözüp sonuçlarını bölüm bazında analiz eder",
      "Yazma ve konuşma görevlerinde değerlendirme ölçütlerine göre kendi çıktısını puanlar",
    ],
    ev: "TRANSFER VERI_ANALIZI",
    t: "PRATIK",
    lv: 3,
    sc: "L",
    mis: [
      "Yalnızca deneme sınavı çözmek dil becerisini geliştirmeye yeter.",
      "Tüm üniversiteler aynı sınavı ve aynı puanı ister.",
    ],
    x: ["comp.meta.exam-strategy:zaman yönetimi ve sınav stratejisi", "res.career.academic:başvuru gereklilikleri"],
    notes: [
      "Sınav bölümleri, süreleri, puanlama ve geçerlilik süresi değişebilir; güncel bilgiyi sınav kurumlarının resmî sitelerinden ve başvurulan kurumdan doğrula.",
    ],
    rel: ["de.c1.exam", "ja.n3.exam"],
    tags: ["ingilizce", "sinav"],
    opt: true,
    src: true,
  })
  .o("en.app.personal-statement", "Başvuru metni ve kişisel deneme yazımı", {
    d: "Yaz okulu, program ve üniversite başvuruları için motivasyon mektubu ve kişisel deneme yazma.",
    w: "Akademik yolun kapılarını açan metinlerdir; kendi deneyimini somut kanıtlarla ve özgün bir anlatıyla sunmayı öğretir.",
    pre: ["en.c1.academic-writing", "res.career.academic~s"],
    q: [
      "'I am passionate about science' cümlesini okuyan bir değerlendirici ne düşünür? Aynı şeyi göstermenin, söylemekten daha etkili bir yolu ne olabilir?",
    ],
    cq: [
      "Etkili bir kişisel metin hangi yapıyı izler?",
      "'Söyleme, göster' ilkesi başvuru metninde nasıl uygulanır?",
      "Metin farklı programlara nasıl uyarlanır?",
    ],
    obj: [
      "Kendi bir araştırma ya da öğrenme deneyimini somut ayrıntılarla anlatan bir taslak yazar",
      "Genel ve klişe cümleleri somut kanıtlarla değiştirerek metni revize eder",
      "Aynı metni iki farklı programın beklentilerine göre uyarlar",
    ],
    ev: "ACIKLAMA TRANSFER",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Başarı listesi ne kadar uzunsa metin o kadar güçlüdür.",
      "Tek bir metin tüm başvurular için aynen kullanılabilir.",
    ],
    x: ["res.career.academic:akademik başvuru süreçleri", "en.c2.style:ton ve üslup"],
    notes: ["Programların uzunluk, format ve içerik beklentilerini başvurulan kurumun resmî sayfasından doğrula."],
    rel: ["en.c1.academic-writing"],
    tags: ["ingilizce", "basvuru"],
    src: true,
  })
  .done();

// ═════════════════════════════════════════════ ALMANCA
export const GERMAN = builder("ALMANCA")
  .unit("Almanca", "Genel Almanca")
  .o("de.a1.basics", "A1: Telaffuz, selamlaşma, kendini tanıtma", {
    d: "Almanca ses sistemi (ü, ö, ch, sch, uzun-kısa ünlüler), selamlaşma, kendini ve başkalarını tanıtma.",
    w: "Doğru telaffuz baştan öğrenilmezse sonradan düzeltmek zordur; Almanca yazımın büyük ölçüde sesli okunuşu öngörmesi okumayı hızlandırır.",
    pre: ["comp.meta.learning-to-learn~h"],
    q: [
      "Türkçede 'ü' ve 'ö' sesleri varken Almanca öğrenen bir Türk hangi seslerde avantajlı, hangilerinde zorlanır? Tahmin et.",
      "'Ich', 'Bach' ve 'sch' seslerini çıkarırken dilin ağzındaki konumu nasıl değişiyor? Dene.",
    ],
    cq: [
      "Almanca yazım-ses ilişkisinin temel kuralları nelerdir?",
      "Resmî (Sie) ve samimi (du) hitap ne zaman kullanılır?",
      "Kendini tanıtmak için hangi temel kalıplar gerekir?",
    ],
    obj: [
      "Kendini ad, yaş, şehir ve ilgi alanlarıyla Almanca tanıtır",
      "Yeni sözcükleri yazım kurallarından yola çıkarak doğru telaffuz eder",
      "Bağlama göre 'du' ya da 'Sie' hitabını seçerek kısa bir diyalog kurar",
    ],
    ev: "TRANSFER HATIRLAMA",
    t: "PRATIK",
    lv: 1,
    sc: "S",
    mis: [
      "Almanca telaffuzu yazımdan tahmin edilemez.",
      "'Sie' yalnızca yaşlılara hitapta kullanılır.",
    ],
    x: ["phys.waves.sound:ses üretimi ve frekans"],
    rel: ["de.a1.grammar"],
    tags: ["almanca", "a1", "telaffuz"],
  })
  .o("de.a1.grammar", "A1: Artikeller, fiil çekimi, cümle düzeni", {
    d: "Der/die/das artikelleri, düzenli ve temel düzensiz fiillerin şimdiki zaman çekimi, fiilin ikinci konumda olduğu temel cümle düzeni.",
    w: "Almancanın tüm yapısı artikel sistemi ve fiil konumu üzerine kuruludur; erken sağlam kurulması sonraki tüm düzeyleri kolaylaştırır.",
    pre: ["de.a1.basics"],
    q: [
      "'Das Mädchen' (kız) neden dişil değil de nötr artikel alır? Artikel biyolojik cinsiyete mi, sözcüğün biçimine mi bağlı? Bir hipotez kur.",
    ],
    cq: [
      "Artikel tahmininde hangi ek ipuçları (-ung, -chen, -heit) işe yarar?",
      "Fiil neden ana cümlede ikinci konumdadır ve bu kural soru cümlesinde nasıl değişir?",
      "Düzenli fiil çekimi hangi örüntüyü izler?",
    ],
    obj: [
      "Sözcük sonlarından artikel tahmin edip sözlükle doğrular",
      "Fiil ikinci konum kuralına uyan basit cümleler ve sorular kurar",
      "Düzenli ve sık kullanılan düzensiz fiilleri doğru çekimler",
    ],
    ev: "TRANSFER HATIRLAMA",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Artikeller tamamen rastgeledir ve hiçbir örüntü yoktur.",
      "Almanca cümle düzeni Türkçe gibi fiil sonda olacak şekilde kurulur.",
    ],
    x: ["math.found.logic:kural ve istisna örüntüleri"],
    rel: ["de.a2.grammar"],
    tags: ["almanca", "a1", "dilbilgisi"],
  })
  .o("de.a2.everyday", "A2: Gündelik iletişim ve geçmiş zaman (Perfekt)", {
    d: "Alışveriş, yol sorma, randevu alma gibi gündelik durumlar ve geçmiş olayları Perfekt zamanıyla anlatma.",
    w: "Almanca konuşulan bir ortamda kendi başına idare etmeyi sağlar; Perfekt konuşma dilinde geçmişi anlatmanın ana yoludur.",
    pre: ["de.a1.grammar"],
    q: [
      "Neden 'Ich habe gegessen' ama 'Ich bin gegangen' denir? 'haben' ile 'sein' arasındaki seçimin bir mantığı olabilir mi? Hareket fiillerine bak ve tahmin et.",
    ],
    cq: [
      "Perfekt nasıl kurulur ve yardımcı fiil nasıl seçilir?",
      "Gündelik durumlarda hangi kalıplar en çok işe yarar?",
      "Ayrılabilen fiiller cümlede nasıl davranır?",
    ],
    obj: [
      "Hafta sonunu Perfekt kullanarak birkaç cümleyle anlatır",
      "Bir rol oyununda alışveriş ya da randevu diyaloğunu sürdürür",
      "Ayrılabilen fiilleri cümlede doğru konumlandırır",
    ],
    ev: "ACIKLAMA TRANSFER",
    t: "PRATIK",
    lv: 2,
    sc: "M",
    mis: [
      "Perfekt'te her fiil 'haben' ile kurulur.",
      "Ayrılabilen fiillerin öneki her zaman fiille birlikte kalır.",
    ],
    x: ["neuro.cog.learning-memory:kalıp öğrenme ve otomatikleşme"],
    rel: ["de.b1.communication"],
    tags: ["almanca", "a2", "gunluk-iletisim"],
  })
  .o("de.a2.grammar", "A2: Haller (Akkusativ, Dativ) ve edatlar", {
    d: "Nominativ, Akkusativ ve Dativ hallerinde artikel değişimi ve hal yöneten edatlar (iki yönlü edatlar dahil).",
    w: "Almanca anlamın büyük kısmı hal ekleriyle taşınır; bilimsel metinlerdeki uzun isim öbeklerini çözmenin ön koşuludur.",
    pre: ["de.a1.grammar"],
    q: [
      "Türkçede 'kitabı', 'kitaba', 'kitapta' dediğimizde hal ekini sözcüğün sonuna ekleriz. Almanca bunu nereye koyuyor olabilir? 'den Hund' ve 'dem Hund' örneklerine bak.",
    ],
    cq: [
      "Haller cümledeki görevi (özne, nesne, dolaylı nesne) nasıl gösterir?",
      "Hangi edatlar hangi hali yönetir?",
      "İki yönlü edatlarda (in, auf, an) hareket ve konum hal seçimini nasıl belirler?",
    ],
    obj: [
      "Bir cümledeki öğelerin halini belirleyip artikeli doğru çekimler",
      "İki yönlü edatlarla hareket ve konum bildiren cümle çiftleri kurar",
      "Artikel-hal tablosunu kendi örnekleriyle oluşturup açıklar",
    ],
    ev: "TRANSFER ACIKLAMA",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Hal yalnızca anlamdan çıkarılabilir; artikeller önemsizdir.",
      "Türkçedeki '-e hali' her zaman Dativ'e karşılık gelir.",
    ],
    x: ["math.found.functions:girdiye göre biçim değiştiren eşleme olarak çekim tablosu"],
    rel: ["de.b1.grammar"],
    tags: ["almanca", "a2", "haller"],
  })
  .o("de.b1.communication", "B1: Görüş bildirme ve anlatı", {
    d: "Bir konuda görüş bildirme, deneyim ve planları anlatma, kısa metinler ve mektuplar yazma.",
    w: "Bağımsız dil kullanıcısı düzeyine geçişi işaret eder; bir öğrenci değişimi ya da yaz okulunda günlük hayatı ve basit akademik konuşmaları yönetmeyi sağlar.",
    pre: ["de.a2.everyday", "de.a2.grammar"],
    q: [
      "Almanca 'Ich finde, dass…' ile başlayan bir cümlede fiil neden en sona gidiyor? Bu kuralı keşfetmek için birkaç örneği karşılaştır.",
    ],
    cq: [
      "Görüş, katılma ve katılmama hangi kalıplarla ifade edilir?",
      "Bir deneyim tutarlı bir anlatıya nasıl dönüştürülür?",
      "Yarı resmî bir e-posta ya da mektup nasıl yazılır?",
    ],
    obj: [
      "Tanıdık bir konuda gerekçeli görüşünü sözlü olarak bildirir",
      "Bir deneyimi başlangıç-gelişme-sonuç yapısıyla anlatır",
      "Bir dil kursu ya da yaz okulu için bilgi isteyen bir e-posta yazar",
    ],
    ev: "ACIKLAMA TRANSFER",
    t: "PRATIK",
    lv: 3,
    sc: "M",
    mis: [
      "B1 düzeyinde dilbilgisi hataları iletişimi engeller; mükemmel olmadan konuşmamalıyım.",
    ],
    x: ["gk.phil.intro:görüşü gerekçelendirme"],
    rel: ["de.b2.argumentation"],
    tags: ["almanca", "b1", "iletisim"],
  })
  .o("de.b1.grammar", "B1: Yan cümleler, Präteritum, edilgen", {
    d: "Fiilin sona gittiği yan cümleler (dass, weil, wenn, obwohl), yazı dilinde geçmiş zaman Präteritum ve werden ile edilgen yapı.",
    w: "Yazılı Almanca ve özellikle bilimsel metinler yan cümle, Präteritum ve edilgenle doludur; bunlar olmadan okuma B1'in ötesine geçemez.",
    pre: ["de.a2.grammar"],
    q: [
      "Bilimsel bir Almanca metinde 'Die Lösung wurde erhitzt' cümlesini görürsen kim ısıttı? Bu bilgi neden verilmiyor olabilir?",
    ],
    cq: [
      "Yan cümlede fiil neden sona gider ve bağlaç seçimi anlamı nasıl değiştirir?",
      "Präteritum ve Perfekt hangi bağlamlarda tercih edilir?",
      "Vorgangspassiv ve Zustandspassiv arasındaki fark nedir?",
    ],
    obj: [
      "Neden, koşul ve karşıtlık bildiren yan cümleleri doğru fiil konumuyla kurar",
      "Bir deney yöntemini Präteritum ve edilgen kullanarak yazar",
      "Etken ve edilgen cümleleri birbirine dönüştürür",
    ],
    ev: "ACIKLAMA TRANSFER",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Präteritum yalnızca masallarda kullanılır.",
      "Yan cümlede fiil konumu konuşmacıya göre değişebilir.",
    ],
    x: ["res.write.report:yöntem bölümünde edilgen anlatım"],
    rel: ["de.b2.grammar", "de.b1.science-vocab"],
    tags: ["almanca", "b1", "dilbilgisi"],
  })
  .o("de.b2.argumentation", "B2: Tartışma ve yazılı argüman", {
    d: "Bir konuda artı ve eksileri tartan yapılandırılmış sözlü tartışma ve yazılı görüş metni (Erörterung).",
    w: "Almanca konuşulan üniversitelerde ve akademik ortamlarda tartışmaya katılmanın ve görüş yazısı yazmanın temelidir.",
    pre: ["de.b1.communication", "de.b1.grammar"],
    q: [
      "Almanca bir tartışmada 'einerseits… andererseits…' kalıbını kullanmak düşüncende neyi zorunlu kılar? Bir konu seç ve dene.",
    ],
    cq: [
      "Almanca yazılı argümanın klasik yapısı nedir?",
      "Karşı görüş nasıl kabul edilir ve çürütülür?",
      "Bağlaçlar ve geçiş ifadeleri argüman akışını nasıl yönlendirir?",
    ],
    obj: [
      "Bilimle ilgili bir tartışma konusunda artı-eksi yapısında bir Erörterung yazar",
      "Sözlü bir tartışmada karşı görüşü özetleyip gerekçeli yanıt verir",
      "Kendi metnindeki argüman akışını geçiş ifadeleri açısından gözden geçirir",
    ],
    ev: "ACIKLAMA TRANSFER",
    t: "BECERI",
    lv: 4,
    sc: "M",
    mis: [
      "Güçlü bir argüman karşı görüşü hiç anmamalıdır.",
      "Türkçe argüman yapısı Almancaya birebir aktarılabilir.",
    ],
    x: ["gk.phil.intro:argüman yapısı", "gk.phil.ethics:bilim etiği tartışmaları"],
    rel: ["de.c1.academic-writing"],
    tags: ["almanca", "b2", "arguman"],
  })
  .o("de.b2.grammar", "B2: Konjunktiv II ve Nominalstil", {
    d: "Varsayım ve kibar istek için Konjunktiv II; bilimsel ve resmî metinlerin karakteristik isimleştirme üslubu (Nominalstil).",
    w: "Bilimsel Almancanın yoğunluğu büyük ölçüde Nominalstil'den gelir; bunu çözebilmek bilimsel metin okumanın anahtarıdır.",
    pre: ["de.b1.grammar"],
    q: [
      "'Nach der Erhitzung der Probe' ile 'Nachdem die Probe erhitzt wurde' aynı şeyi söyler. Hangisi daha kısa, hangisi daha kolay anlaşılır? Bilim insanları neden birincisini sever?",
    ],
    cq: [
      "Konjunktiv II gerçek dışı koşul ve kibarlığı nasıl ifade eder?",
      "Fiil yapıları isim yapılarına (Nominalisierung) nasıl dönüştürülür?",
      "Uzun isim öbekleri ve sıfat-fiiller nasıl çözümlenir?",
    ],
    obj: [
      "Gerçek dışı bir koşulu Konjunktiv II ile ifade eder",
      "Fiil üslubundaki cümleleri Nominalstil'e ve tersine dönüştürür",
      "Uzun bir bilimsel isim öbeğini parçalarına ayırarak çözümler",
    ],
    ev: "TRANSFER YORUMLAMA",
    t: "BECERI",
    lv: 4,
    sc: "M",
    mis: [
      "Nominalstil her zaman daha iyi ve daha 'akademik' bir üsluptur.",
      "Konjunktiv II yalnızca kibarlık için kullanılır.",
    ],
    x: ["en.c1.academic-writing:akademik üslup tercihleri"],
    rel: ["de.b2.science-reading"],
    tags: ["almanca", "b2", "nominalstil"],
  })
  .o("de.c1.fluency", "C1: Akıcılık, deyimler ve üslup", {
    d: "Karmaşık konularda akıcı ve kendiliğinden ifade, deyimler ve kalıplar, bağlama göre üslup ayarı.",
    w: "Almanca konuşulan bir akademik ortamda tam katılım ve özgün metinlerin (edebiyat, deneme, gazete) rahat okunmasını sağlar.",
    pre: ["de.b2.argumentation", "de.b2.grammar"],
    q: [
      "'Das ist nicht mein Bier' cümlesini kelime kelime çevirirsen ne çıkar? Deyimleri anlamak için hangi stratejiyi kullanırsın?",
    ],
    cq: [
      "Deyimler ve kalıplar nasıl öğrenilir ve uygun bağlamda kullanılır?",
      "Resmî ve gündelik üslup arasında nasıl geçiş yapılır?",
      "Uzun ve karmaşık konuşmalarda akıcılık nasıl korunur?",
    ],
    obj: [
      "Soyut bir konuda hazırlıksız ve akıcı biçimde birkaç dakika konuşur",
      "Bir metindeki deyimleri bağlamdan yorumlayıp anlamlarını açıklar",
      "Aynı içeriği resmî ve gündelik üslupta yazar",
    ],
    ev: "ACIKLAMA TRANSFER YORUMLAMA",
    t: "PRATIK",
    lv: 4,
    sc: "L",
    mis: [
      "C1 düzeyi ana dili düzeyinde hatasız konuşmak demektir.",
      "Deyimler sözlük listesinden ezberlenerek doğru kullanılabilir.",
    ],
    x: ["gk.lit.world:Almanca edebiyattan özgün metinler"],
    rel: ["de.c1.exam"],
    tags: ["almanca", "c1", "akicilik"],
  })
  .o("de.c1.exam", "C1 sınav hazırlığı (Goethe-Zertifikat C1, TestDaF)", {
    d: "Almanca C1 düzeyinde yeterlik belgelendiren sınavların yapısına ve görev türlerine yönelik planlı hazırlık.",
    w: "Almanca konuşulan ülkelerde üniversite eğitimi ve araştırma programları için dil yeterliği belgesi istenebilir.",
    pre: ["de.c1.academic-writing", "de.c1.fluency"],
    q: [
      "İki farklı yeterlik sınavı aynı düzeyi farklı görevlerle ölçüyorsa, hangisine hazırlanacağına nasıl karar verirsin? Hangi bilgileri araştırman gerekir?",
    ],
    cq: [
      "Sınavların bölümleri hangi becerileri ölçer?",
      "Hangi kurumlar hangi sınavı ve sonucu kabul eder?",
      "Deneme sınavı sonuçları hedefli bir plana nasıl dönüştürülür?",
    ],
    obj: [
      "Resmî kaynaklardan sınav yapısını ve kabul koşullarını araştırıp karşılaştırmalı bir tablo hazırlar",
      "Zamanlı bir deneme sınavı çözüp sonuçlarını bölüm bazında analiz eder",
      "Yazma ve konuşma görevlerinde kendi çıktısını değerlendirme ölçütlerine göre puanlar",
    ],
    ev: "TRANSFER VERI_ANALIZI",
    t: "PRATIK",
    lv: 4,
    sc: "L",
    mis: [
      "Tüm Almanca yeterlik sınavları aynı yapıya sahiptir ve her yerde aynı şekilde kabul edilir.",
    ],
    x: ["comp.meta.exam-strategy:sınav stratejisi", "res.career.academic:yurt dışı program başvuruları"],
    notes: [
      "Sınav bölümleri, süreleri, puanlama ve kabul koşulları değişebilir; güncel bilgiyi sınav kurumlarının ve başvurulan üniversitenin resmî sitelerinden doğrula.",
    ],
    rel: ["en.exam.prep"],
    tags: ["almanca", "c1", "sinav"],
    opt: true,
    src: true,
  })
  .o("de.culture", "Almanca konuşulan ülkeler: kültür ve bilim geleneği", {
    d: "Almanca konuşulan ülkelerin kültürel çeşitliliği, üniversite ve araştırma kurumlarının yapısı ve bilim tarihindeki yeri.",
    w: "Dil öğrenimini anlamlı bir bağlama yerleştirir; fizik, kimya ve nörobilim tarihinin önemli bir kısmının Almanca yazıldığını fark ettirir.",
    pre: ["de.a2.everyday~s"],
    q: [
      "Fizik ve kimya terimlerinden hangileri Almanca kökenli olabilir? 'Eigenvalue' kelimesinin ilk yarısı nereden geliyor?",
    ],
    cq: [
      "Almanca konuşulan ülkeler arasında hangi dilsel ve kültürel farklar vardır?",
      "Üniversite ve araştırma kurumları nasıl örgütlenmiştir?",
      "Almanca bilim dilinin tarihsel önemi nasıl değişti?",
    ],
    obj: [
      "Almanca konuşulan iki ülkeyi dil kullanımı ve eğitim sistemi açısından karşılaştırır",
      "Almanca kökenli bilimsel terimleri derleyip kökenlerini açıklar",
      "Bir araştırma kurumunu resmî kaynaklarından araştırıp kısa bir tanıtım yazar",
    ],
    ev: "ARASTIRMA_UYGULAMASI ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "S",
    mis: [
      "Almanca konuşulan her yerde aynı Almanca konuşulur.",
      "Almanca bilimde hiçbir zaman önemli bir rol oynamamıştır.",
    ],
    x: [
      "gk.sci-hist.modern-physics:modern fiziğin doğuşunda Almanca bilim ortamı",
      "math.linalg.eigen:'eigen' teriminin kökeni",
    ],
    notes: ["Kurumlar, eğitim sistemleri ve tarihsel iddialar hakkında resmî ve akademik kaynaklardan doğrulama yap."],
    rel: ["de.a2.everyday"],
    tags: ["almanca", "kultur"],
    opt: true,
    src: true,
  })

  .unit("Almanca", "Bilimsel Almanca")
  .o("de.b1.science-vocab", "B1: Temel bilimsel sözcük dağarcığı", {
    d: "Sayılar, birimler, matematiksel işlemler, deney malzemeleri ve temel fizik, kimya, biyoloji terimleri; bileşik sözcüklerin çözümlenmesi.",
    w: "Bilimsel metin okumanın ve laboratuvarda iletişim kurmanın ön koşuludur; Almanca bileşik sözcükler parçalarından anlaşılabilir.",
    pre: ["de.a2.everyday", "de.b1.grammar~s"],
    q: [
      "'Geschwindigkeit', 'Beschleunigung' ve 'Kraft' sözcüklerinden yola çıkarak 'Erdbeschleunigung' ne demek olabilir? Bileşik sözcüğü parçala.",
    ],
    cq: [
      "Bileşik sözcükler nasıl parçalanır ve anlamı hangi parça belirler?",
      "Matematiksel ifadeler Almanca nasıl okunur?",
      "Laboratuvar ortamında hangi temel ifadeler gerekir?",
    ],
    obj: [
      "Bilimsel bileşik sözcükleri parçalarına ayırarak anlamını tahmin eder ve doğrular",
      "Basit denklemleri ve birimleri Almanca sesli okur",
      "Bir deneyi malzemeler ve adımlarla birkaç Almanca cümleyle anlatır",
    ],
    ev: "TRANSFER YORUMLAMA",
    t: "PRATIK",
    lv: 3,
    sc: "M",
    mis: [
      "Bilimsel terimler her dilde aynıdır; ayrıca öğrenmeye gerek yoktur.",
      "Uzun bileşik sözcükler sözlükte olduğu gibi tek parça halinde ezberlenmelidir.",
    ],
    x: [
      "phys.measure.units:birimler ve ölçüm dili",
      "chem.react.types:tepkime terimleri",
      "bio.cell.structure:hücre biyolojisi terimleri",
    ],
    rel: ["de.b2.science-reading"],
    tags: ["almanca", "bilimsel", "sozcuk"],
  })
  .o("de.b2.science-reading", "B2: Bilimsel metin okuma", {
    d: "Ders kitabı bölümleri, popüler bilim metinleri ve basit makale özetleri gibi Almanca bilimsel metinleri anlamak.",
    w: "Almanca kaynaklara doğrudan erişim sağlar; Nominalstil ve edilgen yapıları gerçek bir bağlamda kullanır.",
    pre: ["de.b1.science-vocab", "de.b2.grammar"],
    q: [
      "Almanca bir fizik metninde Newton'un ikinci yasasını anlatan bir paragraf okusan, hangi kelimeler ve formüller anlamana yardım ederdi? Önceden bildiğin fiziği bir 'iskele' olarak nasıl kullanırsın?",
    ],
    cq: [
      "Konu bilgisi yabancı dilde okumayı nasıl kolaylaştırır?",
      "Uzun cümleler ve isim öbekleri nasıl sistematik olarak çözümlenir?",
      "Bir metindeki tanım, örnek ve sonuç nasıl ayırt edilir?",
    ],
    obj: [
      "Almanca bir fizik ya da kimya ders kitabı bölümünü okuyup ana kavramları Türkçe özetler",
      "Karmaşık bir cümleyi fiil ve isim öbeklerine ayırarak çözümler",
      "Metindeki bir tanımı ve formülü kendi sözleriyle Almanca yeniden ifade eder",
    ],
    ev: "YORUMLAMA TRANSFER",
    t: "UYGULAMA",
    lv: 4,
    sc: "L",
    mis: [
      "Bilimsel metin okumak için önce C1 düzeyine ulaşmak gerekir.",
      "Her bilinmeyen sözcüğe sözlükte bakmak okumayı hızlandırır.",
    ],
    x: [
      "phys.mech.newton:bilinen fizik içeriği okumada iskele olur",
      "chem.equilibrium:Almanca kimya metinlerinde denge kavramı",
      "phys.thermo.laws:termodinamiğin Almanca terminolojisi",
    ],
    ra: ["Almanca bir ders kitabı bölümünden terim sözlüğü çıkarma"],
    rel: ["de.b2.science-communication"],
    tags: ["almanca", "bilimsel-okuma", "b2"],
  })
  .o("de.b2.science-communication", "B2: Bilimsel sunum ve tartışma", {
    d: "Bir deneyi ya da projeyi Almanca sunma, bir grafiği açıklama ve sunum sonrası sorulara yanıt verme.",
    w: "Değişim programları ve Almanca konuşulan laboratuvarlarda işbirliği için gereklidir.",
    pre: ["de.b2.science-reading", "de.b2.argumentation", "res.write.presentation~c"],
    q: [
      "Bir grafiği anlatırken 'steigt', 'sinkt', 'bleibt konstant' gibi fiiller yeterli mi? Bir eğrinin tüm hikâyesini anlatmak için başka neye ihtiyacın var?",
    ],
    cq: [
      "Almanca bir sunumun yapısı ve geçiş ifadeleri nelerdir?",
      "Grafik ve verileri anlatmak için hangi kalıplar kullanılır?",
      "Soru-cevapta belirsizlik nasıl ifade edilir?",
    ],
    obj: [
      "Kendi projesi için birkaç dakikalık Almanca bir sunum yapar",
      "Bir grafiği eksenler, eğilim ve yorum sırasıyla Almanca anlatır",
      "Sunum sonrası sorulara gerekçeli ve dürüst yanıt verir",
    ],
    ev: "ACIKLAMA TRANSFER",
    t: "UYGULAMA",
    lv: 4,
    sc: "M",
    mis: [
      "Sunumu ezberlemek akıcılık yerine geçer.",
    ],
    x: ["res.write.presentation:sunum tasarımı", "res.data.visualization:grafik anlatımı"],
    rel: ["en.c1.sci-communication"],
    tags: ["almanca", "sunum", "b2"],
  })
  .o("de.c1.academic-writing", "C1: Akademik yazım (wissenschaftliches Schreiben)", {
    d: "Almanca akademik metin türleri (Hausarbeit, Bericht), alıntılama, temkinli dil ve akademik üslup kuralları.",
    w: "Almanca konuşulan bir üniversitede ödev, rapor ve tez yazmanın temelidir; C1 sınavlarının yazma bölümleriyle de doğrudan bağlantılıdır.",
    pre: ["de.b2.argumentation", "de.b2.science-reading", "res.write.report~c"],
    q: [
      "Almanca akademik yazımda 'ich' kullanmak neden çoğu zaman kaçınılan bir tercihtir? Aynı düşünceyi kişisiz nasıl ifade edersin? Bunun bir bedeli var mı?",
    ],
    cq: [
      "Almanca akademik metnin yapısı ve üslup beklentileri nelerdir?",
      "Doğrudan ve dolaylı alıntı (Konjunktiv I dahil) nasıl yapılır?",
      "Temkinli dil Almancada hangi araçlarla kurulur?",
    ],
    obj: [
      "Bir bilimsel konuda giriş, ana bölüm ve sonuçtan oluşan kısa bir akademik metin yazar",
      "Bir kaynağın görüşünü dolaylı anlatımla doğru biçimde aktarır",
      "Kendi metnini akademik üslup ölçütlerine göre revize eder",
    ],
    ev: "ACIKLAMA TRANSFER ARASTIRMA_UYGULAMASI",
    t: "BECERI",
    lv: 5,
    sc: "L",
    mis: [
      "Akademik yazım, mümkün olan en uzun cümleleri kurmaktır.",
      "İngilizce akademik yazım kuralları Almancaya birebir aktarılır.",
    ],
    x: ["res.write.report:bilimsel rapor yapısı", "res.lit.citation:kaynak gösterme", "en.c1.academic-writing:dil karşılaştırmalı akademik yazım"],
    rel: ["de.c1.exam"],
    tags: ["almanca", "akademik-yazim", "c1"],
  })
  .done();

// ═════════════════════════════════════════════ JAPONCA
export const JAPANESE = builder("JAPONCA")
  .unit("Japonca", "Genel Japonca")
  .o("ja.n5.kana", "N5: Hiragana ve katakana", {
    d: "İki hece alfabesinin okunuşu ve yazılışı, uzun ünlüler, ikiz ünsüzler ve yabancı sözcüklerin katakana ile yazımı.",
    w: "Japonca okumanın ilk kapısıdır; katakana bilimsel ve teknik terimlerin büyük kısmında karşına çıkar.",
    pre: ["comp.meta.learning-to-learn~h"],
    q: [
      "'コンピューター' kelimesini katakana tablosuna bakarak çözebilir misin? İngilizce bir kelimenin Japonca seslere nasıl uyarlandığını tahmin et.",
    ],
    cq: [
      "Hiragana ve katakana hangi işlevler için kullanılır?",
      "Hece tablosu hangi sistematik düzenle kurulmuştur?",
      "Yabancı sözcükler Japonca ses yapısına nasıl uyarlanır?",
    ],
    obj: [
      "Tüm hiragana ve katakana karakterlerini akıcı biçimde okur ve yazar",
      "Katakana ile yazılmış yabancı kökenli sözcükleri çözer",
      "Kendi adını ve birkaç bilimsel terimi katakana ile yazar",
    ],
    ev: "HATIRLAMA TRANSFER",
    t: "PRATIK",
    lv: 1,
    sc: "M",
    mis: [
      "Önce romaji (Latin harfleri) ile öğrenmek daha kolaydır ve sonra kana'ya geçilir.",
      "Katakana yalnızca yabancı isimler için kullanılır.",
    ],
    x: [
      "neuro.cog.learning-memory:görsel-işitsel eşleme ve aralıklı tekrar",
      "comp.meta.learning-to-learn:anımsatıcı teknikler",
    ],
    rel: ["ja.n5.grammar", "ja.n5.kanji-vocab"],
    tags: ["japonca", "n5", "kana"],
  })
  .o("ja.n5.grammar", "N5: Temel dilbilgisi (です/ます, parçacıklar)", {
    d: "Kibar です/ます biçimleri, temel parçacıklar (は, が, を, に, で, の) ve özne-nesne-fiil cümle düzeni.",
    w: "Japonca cümle düzeni Türkçeye çok benzer; bu benzerliği bilinçli kullanmak öğrenmeyi hızlandırır.",
    pre: ["ja.n5.kana"],
    q: [
      "'私は学生です' cümlesindeki sıralama Türkçedeki 'Ben öğrenciyim' cümlesine ne kadar benziyor? Japonca ile Türkçenin başka hangi ortak yapıları olabilir? Tahmin et.",
    ],
    cq: [
      "Parçacıklar cümledeki görevleri nasıl işaretler?",
      "は ve が arasındaki temel fark nedir?",
      "Kibar ve sade biçimler ne zaman kullanılır?",
    ],
    obj: [
      "Kendini ve günlük rutinini です/ます biçimleriyle anlatan cümleler kurar",
      "Bir cümledeki parçacıkları doğru seçerek boşlukları doldurur",
      "Japonca ve Türkçe cümle yapısını karşılaştırarak benzerlik ve farkları açıklar",
    ],
    ev: "TRANSFER ACIKLAMA",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "は ve が her zaman birbirinin yerine kullanılabilir.",
      "Japonca dilbilgisi Türkçe konuşan biri için tamamen yabancıdır.",
    ],
    x: ["math.found.logic:cümle yapısını kurallarla çözümlemek"],
    rel: ["ja.n4.grammar"],
    tags: ["japonca", "n5", "dilbilgisi"],
  })
  .o("ja.n5.kanji-vocab", "N5: Temel kanji ve sözcükler", {
    d: "Sayılar, günler, temel isimler ve fiillerde kullanılan ilk kanjiler; kanjilerin anlam ve okunuş ilişkisi.",
    w: "Kanji Japonca okumanın temel taşıdır; temel kanjilerin bileşenleri (radikaller) sonraki tüm kanjileri öğrenmeyi kolaylaştırır.",
    pre: ["ja.n5.kana"],
    q: [
      "'木' (ağaç) karakterini bildiğinde '林' ve '森' ne anlama gelebilir? Kanjilerin bu tür mantıksal yapılarından başka örnekler tahmin et.",
    ],
    cq: [
      "Kanjiler hangi bileşenlerden (radikal) oluşur?",
      "On'yomi ve kun'yomi okunuşları nasıl farklılaşır?",
      "Kanji öğrenmede hangi stratejiler (anımsatıcı, bileşen analizi, aralıklı tekrar) işe yarar?",
    ],
    obj: [
      "Temel kanjileri anlamları ve sık okunuşlarıyla tanır",
      "Bir kanjiyi radikallerine ayırıp anlamı için bir anımsatıcı kurar",
      "Temel sözcükleri kanji ve kana karışık cümlelerde okur",
    ],
    ev: "HATIRLAMA TRANSFER",
    t: "PRATIK",
    lv: 2,
    sc: "M",
    mis: [
      "Her kanjinin tek bir okunuşu vardır.",
      "Kanjiler tamamen rastgele resimlerdir; yapıları yoktur.",
    ],
    x: ["neuro.cog.learning-memory:anlamlı kodlama ve aralıklı tekrar"],
    notes: ["N5 düzeyi için önerilen kanji ve sözcük listeleri resmî bir müfredat değildir; güncel kaynakları karşılaştır."],
    rel: ["ja.n4.kanji-vocab"],
    tags: ["japonca", "n5", "kanji"],
  })
  .o("ja.n4.grammar", "N4: Fiil biçimleri (て形, ない形, olabilirlik)", {
    d: "Fiil grupları, て-biçimi ve kullanımları, olumsuz ない-biçimi, olabilirlik (potansiyel) biçimi ve sade konuşma biçimleri.",
    w: "て-biçimi Japonca cümle bağlamanın ve birçok yapının temelidir; bu düzey gündelik konuşmayı anlamanın eşiğidir.",
    pre: ["ja.n5.grammar"],
    q: [
      "'食べる → 食べて' ama '書く → 書いて'. Fiil sonuna göre değişen bu dönüşümde bir kural sezebiliyor musun? Birkaç örnekten kuralı kendin çıkarmaya çalış.",
    ],
    cq: [
      "Fiil grupları çekimi nasıl belirler?",
      "て-biçimi hangi yapılarda (istek, süreklilik, sıralama) kullanılır?",
      "Sade ve kibar biçimler arasında nasıl geçiş yapılır?",
    ],
    obj: [
      "Fiilleri gruplarına göre て, ない ve potansiyel biçimlerine dönüştürür",
      "て-biçimiyle ardışık eylemleri anlatan cümleler kurar",
      "Kibar bir diyaloğu sade biçime dönüştürür",
    ],
    ev: "TRANSFER ACIKLAMA",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Tüm fiiller aynı biçimde çekimlenir.",
      "Sade biçim kaba ve her zaman kaçınılması gereken bir biçimdir.",
    ],
    x: ["prog.python.functions:girdiye göre kural uygulayan dönüşüm olarak çekim"],
    rel: ["ja.n3.grammar"],
    tags: ["japonca", "n4", "fiil"],
  })
  .o("ja.n4.kanji-vocab", "N4: Kanji ve sözcük dağarcığı", {
    d: "Gündelik yaşam, okul ve doğa ile ilgili kanji ve sözcükler; kanji bileşik sözcükleri (熟語).",
    w: "Bileşik sözcükler bilimsel terimlerin yapı taşıdır; bu düzeyde öğrenilen kanjiler bilimsel sözcüklerde yeniden karşına çıkar.",
    pre: ["ja.n5.kanji-vocab"],
    q: [
      "'電' (elektrik) ve '車' (araç) kanjilerinden '電車' ne demek olabilir? Peki '電気' ve '電話'? Ortak bir kanjinin anlam ailesi nasıl kurduğunu keşfet.",
    ],
    cq: [
      "Kanji bileşik sözcükleri nasıl anlam oluşturur?",
      "Ortak kanji içeren sözcükler nasıl gruplanarak öğrenilir?",
      "Okunuş tahmininde hangi örüntüler işe yarar?",
    ],
    obj: [
      "Bilinen kanjilerden yeni bileşik sözcüklerin anlamını tahmin eder ve doğrular",
      "Ortak kanji etrafında sözcük aileleri oluşturan bir harita hazırlar",
      "N4 düzeyi bir metindeki kanjili sözcükleri okur",
    ],
    ev: "TRANSFER YORUMLAMA",
    t: "PRATIK",
    lv: 3,
    sc: "L",
    mis: [
      "Bileşik sözcüğün anlamı her zaman parçalarının toplamıdır.",
    ],
    x: ["neuro.cog.learning-memory:anlam ağları ve bellek"],
    notes: ["Düzeylere göre kanji ve sözcük sayıları resmî olarak sabitlenmiş değildir; güncel kaynaklarla karşılaştır."],
    rel: ["ja.sci.vocab", "ja.n3.kanji-vocab"],
    tags: ["japonca", "n4", "kanji"],
  })
  .o("ja.n4.listening", "N4: Dinleme ve gündelik konuşma", {
    d: "Gündelik konuşmaları, duyuruları ve yavaş konuşulan kısa anlatıları anlama; basit diyaloglara katılma.",
    w: "Japonca gerçek iletişimin büyük kısmı sözlüdür; dinleme okuma kadar hızlı gelişmezse iletişim kopar.",
    pre: ["ja.n4.grammar~s", "ja.n4.kanji-vocab~s"],
    q: [
      "Japoncada cümle sonundaki 'ね' ve 'よ' konuşmacının tutumu hakkında ne söyler? Aynı cümleyi her ikisiyle dinleyip farkı tahmin et.",
    ],
    cq: [
      "Konuşma dilinde kısaltmalar ve sade biçimler nasıl tanınır?",
      "Cümle sonu parçacıkları duygu ve tutumu nasıl iletir?",
      "Dinlerken anahtar bilgiler nasıl yakalanır?",
    ],
    obj: [
      "Kısa bir gündelik diyaloğu dinleyip kim, ne, nerede sorularını yanıtlar",
      "Basit bir diyalogda kendini tanıtıp sorulara yanıt verir",
      "Gölgeleme (shadowing) çalışmasını düzenli uygular ve gelişimini kayıtla izler",
    ],
    ev: "YORUMLAMA TRANSFER",
    t: "PRATIK",
    lv: 3,
    sc: "M",
    mis: [
      "Okuyabildiğim her şeyi dinlediğimde de anlarım.",
      "Anime ve dizilerdeki konuşma dili her durumda uygundur.",
    ],
    x: ["neuro.sys.sensory:işitsel algı", "neuro.cog.attention:dinlerken seçici dikkat"],
    rel: ["ja.n3.reading"],
    tags: ["japonca", "n4", "dinleme"],
  })
  .o("ja.n3.grammar", "N3: Ara düzey dilbilgisi", {
    d: "Edilgen, ettirgen, koşul yapıları (と, ば, たら, なら), alıntı ve tahmin ifadeleri gibi ara düzey yapılar.",
    w: "Gündelik ve basit yazılı metinlerden gerçek metinlere geçişin köprüsüdür; bilimsel metinlerde sık görülen koşul ve edilgen yapıları içerir.",
    pre: ["ja.n4.grammar"],
    q: [
      "Japoncada 'eğer' anlamına gelen dört farklı yapı (と, ば, たら, なら) neden var? Hangi durumda hangisinin kullanıldığına dair bir hipotez kur.",
    ],
    cq: [
      "Koşul yapıları arasındaki anlam farkları nelerdir?",
      "Edilgen ve ettirgen yapılar nasıl kurulur ve ne zaman kullanılır?",
      "Tahmin ve aktarım ifadeleri (らしい, そうだ, ようだ) nasıl ayrılır?",
    ],
    obj: [
      "Koşul yapılarını bağlama uygun seçerek cümleler kurar",
      "Edilgen ve ettirgen cümleleri etken cümlelere dönüştürür",
      "Tahmin ifadeleri arasındaki farkı örneklerle açıklar",
    ],
    ev: "TRANSFER ACIKLAMA",
    t: "BECERI",
    lv: 4,
    sc: "L",
    mis: [
      "Tüm koşul yapıları her bağlamda birbirinin yerine kullanılabilir.",
    ],
    x: ["math.found.logic:koşul önermeleri ve anlam farkları"],
    rel: ["ja.n3.reading"],
    tags: ["japonca", "n3", "dilbilgisi"],
  })
  .o("ja.n3.kanji-vocab", "N3: Kanji ve sözcük dağarcığı", {
    d: "Toplum, doğa, duygu ve soyut kavramlara ilişkin kanji ve sözcükler; okunuş örüntüleri ve eşsesli sözcükler.",
    w: "Gazete başlıkları, basit makaleler ve bilimsel metinlerde sık geçen kanjilerin önemli bir kısmını kapsar.",
    pre: ["ja.n4.kanji-vocab"],
    q: [
      "Japoncada aynı okunan ama farklı kanjiyle yazılan çok sayıda sözcük var. Konuşmada bu karışıklık nasıl çözülüyor olabilir? Tahmin et.",
    ],
    cq: [
      "Fonetik bileşenler okunuş tahminine nasıl yardım eder?",
      "Eşsesli sözcükler bağlamdan nasıl ayırt edilir?",
      "Soyut kavramları ifade eden bileşik sözcükler nasıl çözümlenir?",
    ],
    obj: [
      "Fonetik bileşeni bilinen kanjilerin okunuşunu tahmin eder ve doğrular",
      "Eşsesli sözcükleri bağlamdan ayırt eder",
      "N3 düzeyi metinlerdeki kanjili sözcükleri okuyup anlamlandırır",
    ],
    ev: "TRANSFER YORUMLAMA",
    t: "PRATIK",
    lv: 4,
    sc: "L",
    mis: [
      "Kanji öğrenmek yalnızca karakterleri tek tek ezberlemektir.",
    ],
    x: ["neuro.cog.learning-memory:büyük bilgi kümelerini kalıcı öğrenme"],
    notes: ["Düzeylere göre kanji listeleri resmî olarak sabitlenmiş değildir; güncel kaynakları karşılaştır."],
    rel: ["ja.sci.vocab"],
    tags: ["japonca", "n3", "kanji"],
  })
  .o("ja.n3.reading", "N3: Okuma anlama", {
    d: "Kısa makaleler, bilgilendirici metinler ve anlatılar gibi gündelik konulardaki metinleri anlama.",
    w: "Japonca kaynaklara bağımsız erişimin başlangıcıdır; bilimsel metin okumaya hazırlık sağlar.",
    pre: ["ja.n3.grammar", "ja.n3.kanji-vocab"],
    q: [
      "Japonca metinlerde kelimeler arasında boşluk yoktur. Bir cümlenin nerede bir sözcüğün bitip diğerinin başladığını nasıl anlarsın? Kanji-kana geçişlerine bak.",
    ],
    cq: [
      "Boşluksuz metinde sözcük sınırları nasıl belirlenir?",
      "Uzun cümlelerde ana yapı nasıl bulunur?",
      "Metnin ana fikri ve yazarın tutumu nasıl çıkarılır?",
    ],
    obj: [
      "N3 düzeyi bir metnin ana fikrini ve ayrıntılarını Türkçe özetler",
      "Uzun bir cümlede ana yüklemi ve öğeleri belirler",
      "Bilinmeyen sözcükleri kanjilerinden tahmin edip doğrular",
    ],
    ev: "YORUMLAMA TRANSFER",
    t: "PRATIK",
    lv: 4,
    sc: "L",
    mis: [
      "Her kanjinin okunuşunu bilmeden metin anlaşılamaz.",
    ],
    x: ["gk.lit.reading-analysis:çıkarım ve yorum stratejileri"],
    rel: ["ja.sci.reading"],
    tags: ["japonca", "n3", "okuma"],
  })
  .o("ja.n3.exam", "JLPT N3 sınav hazırlığı", {
    d: "Japonca Yeterlik Sınavı N3 düzeyinin bölümlerine ve görev türlerine yönelik planlı hazırlık.",
    w: "Japonca düzeyini uluslararası tanınan bir belgeyle göstermeyi sağlar; hazırlık süreci becerileri ölçülebilir hedeflere bağlar.",
    pre: ["ja.n3.reading", "ja.n4.listening"],
    q: [
      "Konuşma ya da yazma bölümü içermeyen bir sınav senin Japonca becerin hakkında neyi gösterir, neyi göstermez? Hazırlığını bu yüzden nasıl dengelersin?",
    ],
    cq: [
      "Sınavın bölümleri hangi becerileri ölçer?",
      "Görev türlerine özgü stratejiler nelerdir?",
      "Deneme sınavı sonuçları hedefli bir plana nasıl dönüştürülür?",
    ],
    obj: [
      "Resmî kaynaklardan sınav yapısını, tarihlerini ve başvuru sürecini araştırır",
      "Zamanlı bir deneme sınavı çözüp sonuçlarını bölüm bazında analiz eder",
      "Zayıf bölümler için haftalık bir çalışma planı kurar ve uygular",
    ],
    ev: "TRANSFER VERI_ANALIZI",
    t: "PRATIK",
    lv: 4,
    sc: "L",
    mis: [
      "Sınavı geçmek, o düzeyde akıcı konuştuğum anlamına gelir.",
    ],
    x: ["comp.meta.exam-strategy:sınav stratejisi ve zaman yönetimi"],
    notes: [
      "Sınav bölümleri, süreleri, puanlama ve oturum dönemleri değişebilir; güncel bilgiyi sınavın resmî sitesinden ve yerel sınav merkezinden doğrula.",
    ],
    rel: ["en.exam.prep", "de.c1.exam"],
    tags: ["japonca", "jlpt", "sinav"],
    opt: true,
    src: true,
  })
  .o("ja.culture", "Japon kültürü ve bilim geleneği", {
    d: "Japon toplumunda dil ve nezaket (keigo), eğitim ve araştırma kültürü ile bilimsel terimlerin Japoncaya kazandırılma süreci.",
    w: "Dil öğrenimini kültürel bağlama yerleştirir; bilim dilinin bir toplumda nasıl inşa edildiğine dair karşılaştırmalı bir örnek sunar.",
    pre: ["ja.n5.grammar~s"],
    q: [
      "Batı'dan gelen bilimsel kavramlar için Japonca yeni kanji bileşikleri mi türetildi, yoksa yabancı sözcükler mi alındı? Her iki yolun avantajlarını tahmin et.",
    ],
    cq: [
      "Nezaket düzeyleri dil kullanımını nasıl şekillendirir?",
      "Bilimsel terimler Japoncaya hangi yollarla kazandırıldı?",
      "Japonya'daki araştırma ve eğitim kurumları nasıl örgütlenmiştir?",
    ],
    obj: [
      "Kibar, sade ve saygı dili örneklerini karşılaştırıp kullanım bağlamlarını açıklar",
      "Kanji bileşiği ile oluşturulmuş ve katakana ile alınmış bilimsel terim örneklerini derleyip karşılaştırır",
      "Bir Japon araştırma kurumunu resmî kaynaklarından araştırıp kısa bir tanıtım yazar",
    ],
    ev: "ARASTIRMA_UYGULAMASI ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "S",
    mis: [
      "Japon kültürü tek tip ve değişmezdir.",
      "Japonca bilimsel terimlerin tamamı İngilizceden alınmıştır.",
    ],
    x: ["gk.lit.world:Japon edebiyatından eserler", "gk.sci-hist.modern-physics:bilimin uluslararası yayılması"],
    notes: ["Tarihsel ve kurumsal iddiaları akademik ve resmî kaynaklardan doğrula; kalıp yargılardan kaçın."],
    rel: ["ja.sci.vocab"],
    tags: ["japonca", "kultur"],
    opt: true,
    src: true,
  })

  .unit("Japonca", "Bilimsel Japonca")
  .o("ja.sci.vocab", "Bilimsel Japonca sözcükler (数学・物理・脳科学)", {
    d: "Matematik, fizik ve beyin bilimi alanlarında temel terimler; kanji bileşenlerinden terim anlamını çıkarma.",
    w: "Bilimsel terimlerin çoğu anlamı açık kanjilerden oluşur; bu sayede Japonca bilimsel sözcükler parçalarından mantıksal olarak çözülebilir.",
    pre: ["ja.n4.kanji-vocab", "ja.n4.grammar~s"],
    q: [
      "'神経' (sinir) ve '細胞' (hücre) sözcüklerini biliyorsan '神経細胞' ne olabilir? '微分' sözcüğündeki '微' (çok küçük) ve '分' (bölmek) kanjileri hangi matematik kavramını çağrıştırıyor?",
    ],
    cq: [
      "Bilimsel terimler hangi kanji bileşenlerinden kuruludur?",
      "Matematik, fizik ve nörobilimde en sık hangi terimler geçer?",
      "Katakana ile yazılan bilimsel terimler hangi alanlarda yaygındır?",
    ],
    obj: [
      "Matematik, fizik ve nörobilimden temel terimlerle üç alanlı bir terim sözlüğü oluşturur",
      "Bilinmeyen bilimsel terimlerin anlamını kanji bileşenlerinden tahmin eder ve doğrular",
      "Basit denklemleri ve birimleri Japonca okur",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "PRATIK",
    lv: 3,
    sc: "M",
    mis: [
      "Bilimsel Japonca terimlerin hepsi katakana ile yazılır.",
      "Bilimsel terimleri anlamak için önce N1 düzeyine ulaşmak gerekir.",
    ],
    x: [
      "neuro.cell.neuron-anatomy:nöron, akson ve sinaps terimleri",
      "math.calc.derivative-def:微分 terimi ve türev kavramı",
      "phys.mech.newton:kuvvet ve ivme terimleri",
    ],
    rel: ["ja.sci.reading"],
    tags: ["japonca", "bilimsel", "sozcuk"],
  })
  .o("ja.sci.reading", "Basit bilimsel metin okuma", {
    d: "Popüler bilim yazıları, ders kitabı bölümleri ve basit açıklayıcı metinler gibi Japonca bilimsel içeriği okuma.",
    w: "Japonca bilim kaynaklarına erişim sağlar ve bilinen bilimsel içeriği dil öğreniminin iskelesi olarak kullanmayı öğretir.",
    pre: ["ja.sci.vocab", "ja.n3.reading~s"],
    q: [
      "Konusunu zaten bildiğin bir fizik ya da nörobilim metnini Japonca okursan, bilinmeyen kelimelerin ne kadarını bağlamdan tahmin edebilirsin? Önce bir oran tahmin et, sonra dene.",
    ],
    cq: [
      "Konu bilgisi yabancı dilde bilimsel okumayı nasıl kolaylaştırır?",
      "Bilimsel metinlerde tanım, açıklama ve sonuç hangi yapılarla verilir?",
      "Formül ve şekil açıklamaları Japonca nasıl okunur?",
    ],
    obj: [
      "Bildiği bir bilimsel konudaki basit bir Japonca metni okuyup Türkçe özetler",
      "Metindeki tanım ve açıklama kalıplarını tespit eder",
      "Okuduğu metinden yeni terimleri kendi terim sözlüğüne ekler",
    ],
    ev: "YORUMLAMA TRANSFER",
    t: "UYGULAMA",
    lv: 4,
    sc: "M",
    mis: [
      "Bilimsel metinler gündelik metinlerden her zaman daha zordur.",
    ],
    x: [
      "neuro.cell.action-potential:bilinen nörobilim içeriği okumada iskele olur",
      "phys.mech.newton:Japonca fizik metinlerinde temel kavramlar",
      "res.lit.reading:bilimsel metin okuma stratejileri",
    ],
    ra: ["Japonca bir popüler bilim yazısından terim sözlüğü çıkarma"],
    rel: ["en.c1.sci-reading", "de.b2.science-reading"],
    tags: ["japonca", "bilimsel-okuma"],
  })
  .done();
