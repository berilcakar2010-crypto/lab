import { builder } from "../dsl";

/**
 * YAZIM — yakın okuma, retorik çözümleme ve argümantatif yazım.
 * Genel retorik ve kompozisyon becerileri olarak tanımlanır; belirli bir sınava
 * bağlı değildir. Sınav biçimleriyle ilgili ayrıntılar (`src: true`) resmi
 * kaynaklardan doğrulanmalıdır.
 */
export const WRITING = builder("YAZIM")
  // ───────────────────────────── Yazım ve retorik / Okuma ve analiz
  .unit("Yazım ve retorik", "Okuma ve analiz")
  .o("write.read.close-reading", "Yakın okuma ve metin çözümleme", {
    d: "Bir metni sözcük seçimi, sözdizimi, yapı ve ton düzeyinde yavaşça okuyup gözlemleri bir yoruma bağlama yöntemi.",
    w: "Retorik çözümleme, edebiyat analizi ve kaynaklı yazmanın hepsi 'metinde tam olarak ne var?' sorusuyla başlar; bilimsel makale ve haber okurken de aynı dikkat gerekir.",
    pre: ["gk.lit.reading-analysis~s"],
    q: [
      "\"Kapıyı kapattı.\" ile \"Kapıyı çarptı.\" aynı olayı mı anlatıyor? Tek bir fiil değişince okurun karakter hakkındaki yargısı nasıl değişir?",
      "Bir paragrafı ilk okumada 'sıkıcı' bulduğun hâlde ikinci okumada bir şey fark ettiğin oldu mu? Değişen metin miydi, sen mi?",
    ],
    cq: [
      "Bir gözlem ile bir yorum arasındaki fark nedir ve ikisi nasıl bağlanır?",
      "Sözcük seçimi (diksiyon), sözdizimi ve yapı anlamı nasıl taşır?",
      "Metindeki kaymalar (ton, bakış açısı, zaman) neden önemli ipuçlarıdır?",
    ],
    obj: [
      "Kısa bir pasajı işaretleyerek diksiyon, sözdizimi, imge ve yapı gözlemlerini listeler",
      "Gözlemlerden metnin etkisini açıklayan savunulabilir bir yorum cümlesi kurar",
      "Metindeki bir ton ya da bakış açısı kaymasını tespit edip işlevini yorumlar",
      "Özet ile çözümleme arasındaki farkı kendi yazısında ayırt eder",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Yakın okuma, metni satır satır özetlemektir.",
      "Yazarın 'gerçekten ne demek istediğini' bulmak tek doğru cevaba ulaşmaktır.",
      "Önemli olan yalnızca ne söylendiğidir; nasıl söylendiği süstür.",
    ],
    x: [
      "res.lit.reading:bilimsel makalede de iddia, kanıt ve temkin dilini satır düzeyinde okumak",
      "media.lit.claim-analysis:haber metnindeki sözcük seçimlerinin iddiayı nasıl güçlendirdiğini görmek",
    ],
    rel: ["write.rhetoric.appeals", "write.lit.fiction", "write.lit.poetry"],
    tags: ["okuma", "analiz", "metin"],
  })
  .o("write.rhetoric.situation", "Retorik durum: amaç, hedef kitle, bağlam", {
    d: "Her metnin bir konuşucu, hedef kitle, amaç, bağlam ve ileti arasındaki ilişkiden doğduğunu gösteren çözümleme çerçevesi.",
    w: "Bir metnin neden o biçimde yazıldığını açıklamanın ve kendi yazında doğru tonu seçmenin temelidir; bilim iletişimi, başvuru metni ve sunumda doğrudan kullanılır.",
    pre: ["write.read.close-reading"],
    q: [
      "Aynı aşı verisini bir hekim meslektaşlarına, bir belediye başkanı halka, bir gazeteci okurlarına anlatıyor. Üç metin arasında neyin değişmesini beklersin, neyin değişmemesi gerekir?",
    ],
    cq: [
      "Konuşucunun kimliği ve konumu metnin inandırıcılığını nasıl etkiler?",
      "Hedef kitlenin bilgisi, değerleri ve beklentileri yazarın seçimlerini nasıl sınırlar?",
      "Bağlam (zaman, yer, tartışmanın durumu) bir metnin amacını nasıl belirler?",
    ],
    obj: [
      "Bir metnin konuşucu, kitle, amaç, bağlam ve iletisini kanıta dayanarak belirler",
      "Aynı iletiyi iki farklı kitle için yeniden yazar ve değişiklikleri gerekçelendirir",
      "Yazarın bir seçimini (örnek, ton, sıralama) retorik durumla ilişkilendirerek açıklar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "S",
    mis: [
      "Hedef kitle her zaman 'genel okur'dur.",
      "Retorik, yalnızca manipülasyon ve süslü söz demektir.",
    ],
    x: [
      "media.lit.persuasion:ikna tekniklerini kim, kime, neden sorusuyla çözümlemek",
      "res.write.presentation:bilimsel sunumu dinleyici kitlesine göre kurmak",
      "gk.method.historical-thinking:yazar-amaç-kitle sorgusu tarihsel kaynaklara da uygulanır",
    ],
    rel: ["write.rhetoric.appeals"],
    tags: ["retorik", "kitle", "baglam"],
  })
  .o("write.rhetoric.appeals", "Retorik çözümleme: ethos, pathos, logos ve üslup", {
    d: "Yazarın güvenilirlik, duygu ve mantık başvurularını ve bunları taşıyan üslup seçimlerini (yineleme, karşıtlık, soru, anekdot, sözdizimi) metin içinde çözümleme.",
    w: "Bir konuşmanın ya da makalenin neden etkili olduğunu açıklayabilmek, hem ikna girişimlerine karşı eleştirel bir okur olmayı hem de kendi argümanını güçlendirmeyi sağlar.",
    pre: ["write.rhetoric.situation"],
    q: [
      "Bir konuşmacı istatistik vermek yerine tek bir çocuğun hikâyesini anlatıyor. Bu daha mı ikna edici, daha mı az? Hangi kitle için?",
      "\"Ethos, pathos, logos kullanmış\" demek bir çözümleme midir? Eksik olan ne?",
    ],
    cq: [
      "Bir başvuru türü metnin belirli bir yerinde neden seçilmiştir?",
      "Üslup araçları (paralel yapı, karşıtlık, retorik soru, kısa cümle) hangi etkiyi yaratır?",
      "Bir metnin retorik stratejisi baştan sona nasıl gelişir ya da kayar?",
    ],
    obj: [
      "Bir pasajda en az üç retorik seçimi tespit eder ve her birinin kitle üzerindeki etkisini açıklar",
      "Seçimleri yazarın amacına bağlayan, 'ne' yerine 'neden ve nasıl' sorusunu yanıtlayan bir çözümleme paragrafı yazar",
      "Metnin stratejisindeki kaymaları (örneğin kişisel anekdottan genel çağrıya) izleyip yorumlar",
      "Bir başvurunun yanıltıcı ya da safsatalı kullanımını ayırt eder",
    ],
    ev: "YORUMLAMA ACIKLAMA PROBLEM_COZME",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Retorik çözümleme, ethos/pathos/logos örneklerini avlayıp etiketlemektir.",
      "Duyguya başvurmak her zaman mantıksız ve kötüdür.",
      "Bir araç adı (anafora, asindeton) vermek, işlevini açıklamanın yerini tutar.",
    ],
    x: [
      "media.lit.persuasion:propaganda ve bilişsel yanlılıklar retorik başvuruların kötüye kullanımıdır",
      "gk.phil.intro:argüman analizi ve safsatalar logos değerlendirmesinin temelidir",
      "psy.social:tutum değişimi ve ikna üzerine sosyal psikoloji bulguları",
    ],
    rel: ["write.compose.style", "write.compose.thesis"],
    vs: ["write.lit.fiction"],
    tags: ["retorik", "ikna", "analiz"],
  })
  .o("write.lit.fiction", "Kurmaca analizi: anlatıcı, karakter, yapı", {
    d: "Öykü ve romanda anlatıcı konumu, odaklanma, karakterleştirme, olay örgüsü yapısı, zaman ve mekânın anlamı nasıl ürettiğini çözümleme.",
    w: "Kurmaca, bakış açısının bilgiyi nasıl süzdüğünü gösteren en iyi laboratuvardır; edebi analiz denemeleri ve karşılaştırmalı okuma için temel araçları kurar.",
    pre: ["write.read.close-reading"],
    q: [
      "Bir öyküyü katilin ağzından mı, dedektifin ağzından mı anlatmak daha ilginç olur? Okurun bildiği ile karakterin bildiği arasındaki fark ne işe yarar?",
      "Bir anlatıcı yalan söyleyebilir mi? Metin içinde bunu nasıl anlarsın?",
    ],
    cq: [
      "Anlatıcı türü ve odaklanma okurun neyi bilip neyi bilmediğini nasıl belirler?",
      "Karakter dolaylı yollarla (eylem, konuşma, başkalarının tepkisi) nasıl kurulur?",
      "Yapı (sıralama, geriye dönüş, açık son) anlamı nasıl etkiler?",
    ],
    obj: [
      "Bir pasajda anlatıcı türünü ve güvenilirliğini metinsel kanıtla belirler",
      "Bir karakterin bir sahnedeki karmaşıklığını (çatışan istekler, değişim) çözümleyen paragraf yazar",
      "Yapısal bir seçimin (geriye dönüş, sahne kesmesi, son) eserin bütün anlamına katkısını yorumlar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Anlatıcı yazarın kendisidir.",
      "Karakter analizi, karakterin kişilik özelliklerini sıralamaktır.",
      "Bir romanın 'mesajı' tek cümlelik bir ahlak dersidir.",
    ],
    x: [
      "gk.lit.world:dünya edebiyatından eserler bu araçlarla okunur",
      "gk.lit.turkish:Türk romanı ve öyküsünde anlatıcı ve yapı seçimleri",
      "psy.cognition.thinking:bakış açısı alma ve zihin kuramı",
    ],
    rel: ["write.lit.poetry"],
    vs: ["write.rhetoric.appeals"],
    tags: ["edebiyat", "kurmaca", "anlatici"],
  })
  .o("write.lit.poetry", "Şiir analizi: imge, ses, biçim", {
    d: "Şiirde imge, eğretileme, ses örüntüleri, ölçü ve dize kırılması, biçim ve konuşucu sesinin anlamla ilişkisini çözümleme.",
    w: "Şiir, yoğunlaştırılmış dilde her seçimin anlam taşıdığını gösterir; burada kazanılan dikkat düzyazı çözümlemesine ve kendi üslubuna aktarılır.",
    pre: ["write.read.close-reading"],
    q: [
      "Aynı cümleyi düz yazı olarak ve üç dizeye bölerek yaz. Dizenin nerede kırıldığı vurguyu nasıl değiştirdi?",
      "Bir şiir hiç uyak kullanmıyorsa 'sesi' yok mu demektir?",
    ],
    cq: [
      "İmge ve eğretileme soyut bir duyguyu nasıl somutlaştırır?",
      "Ses (yineleme, ölçü, ritim) ve dize kırılması anlamı nasıl destekler ya da bozar?",
      "Şiirin biçimi (sone, serbest şiir, gazel) okur beklentisini nasıl kurar?",
    ],
    obj: [
      "Bir şiirdeki imge kümelerini izleyip şiir boyunca nasıl dönüştüklerini yorumlar",
      "Bir ses ya da biçim özelliğinin anlama katkısını kanıtla açıklar",
      "Şiirdeki dönüm noktasını (volta, ton değişimi) bulup bütün yoruma bağlar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Şiirin 'gizli anlamı' vardır ve analiz onu çözmektir.",
      "Biçim ve ses, anlamdan bağımsız süslerdir.",
    ],
    x: [
      "music.theory.notation:ritim ve vurgu hem ölçüde hem müzikte yapı kurar",
      "gk.lit.turkish:divan ve halk şiirinde biçim ve ölçü gelenekleri",
    ],
    rel: ["write.lit.fiction", "write.compose.style"],
    tags: ["edebiyat", "siir", "imge"],
  })

  // ───────────────────────────── Yazım ve retorik / Yazma
  .unit("Yazım ve retorik", "Yazma")
  .o("write.compose.thesis", "Tez cümlesi ve argüman yapısı", {
    d: "Savunulabilir, belirli ve yönlendirici bir tez cümlesi kurma; argümanı iddia–gerekçe–kanıt zinciriyle ve karşı görüşü hesaba katarak düzenleme.",
    w: "Her türlü argümantatif ve analitik yazının omurgasıdır; bilimsel raporda hipotez ve sonuç, başvuru metninde ana fikir aynı beceriye dayanır.",
    pre: ["write.rhetoric.situation", "gk.phil.intro~s"],
    q: [
      "\"Sosyal medyanın hem iyi hem kötü yanları vardır.\" Bu bir tez mi? Kim buna itiraz edebilir? İtiraz edilemeyen bir cümleyi savunmaya değer mi?",
    ],
    cq: [
      "İyi bir tezi gerçek bir iddia (savunulabilir, itiraz edilebilir) yapan nedir?",
      "Gerekçeler tez ile kanıt arasında nasıl bir köprü kurar?",
      "Karşı görüşü kabul etmek ve çürütmek argümanı neden güçlendirir?",
    ],
    obj: [
      "Zayıf bir tez cümlesini belirli ve savunulabilir hâle getirerek yeniden yazar",
      "Bir argümanın iddia–gerekçe–kanıt yapısını şema olarak çıkarır",
      "Bir karşı görüşü adil biçimde ifade edip yanıtlayan bir paragraf yazar",
      "Tezi destekleyen paragrafları mantıksal bir ilerlemeyle sıralar",
    ],
    ev: "PROBLEM_COZME DIAGRAM ACIKLAMA",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Tez, konunun ne olduğunu duyuran cümledir.",
      "Beş paragraflık kalıp her argüman için en iyi yapıdır.",
      "Karşı görüşe yer vermek kendi argümanını zayıflatır.",
    ],
    x: [
      "gk.phil.intro:öncül-sonuç yapısı ve geçerlilik",
      "math.found.proof-techniques:ispatta da iddia önce açıkça konur, sonra adım adım gerekçelendirilir",
      "res.method.hypothesis:sınanabilir hipotez ile savunulabilir tez benzer kesinlik ister",
    ],
    rel: ["write.compose.evidence"],
    tags: ["yazma", "tez", "arguman"],
  })
  .o("write.compose.evidence", "Kanıt seçimi ve yorumlama (commentary)", {
    d: "İddiaya en uygun kanıtı seçme, alıntıyı metne yerleştirme ve kanıtın iddiayı nasıl desteklediğini açıklayan yorum yazma.",
    w: "Kanıtı yorumsuz bırakmak en yaygın yazım hatasıdır; yorum, okuru 'bu neden önemli?' sorusuna yanıtla bırakan beceridir ve her analitik metinde puanı belirler.",
    pre: ["write.compose.thesis"],
    q: [
      "Bir paragrafa üç alıntı koyup hiçbirini açıklamazsan okur ne yapmak zorunda kalır? Bu işi okura bırakmak neden risklidir?",
    ],
    cq: [
      "Hangi kanıt bir iddia için 'en iyi' kanıttır: en çarpıcı olan mı, en ilgili olan mı?",
      "Yorum, kanıtı tekrar etmekten nasıl ayrılır?",
      "Alıntı, özetleme ve başka sözlerle anlatma ne zaman tercih edilir?",
    ],
    obj: [
      "Bir iddia için aday kanıtları ilgililik ve güç açısından sıralar",
      "Alıntıyı cümleye akıcı biçimde yerleştirir ve kaynağını doğru belirtir",
      "Kanıtın iddiayı nasıl ve neden desteklediğini açıklayan en az iki cümlelik yorum yazar",
    ],
    ev: "PROBLEM_COZME YORUMLAMA ACIKLAMA",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Daha çok alıntı daha güçlü argüman demektir.",
      "Yorum, alıntıyı başka sözcüklerle yeniden söylemektir.",
    ],
    x: [
      "res.write.report:bilimsel raporda bulgunun ardından yorumu yazmak",
      "media.lit.claim-analysis:kanıt düzeylerini tartmak",
    ],
    rel: ["write.compose.synthesis"],
    tags: ["yazma", "kanit", "yorum"],
  })
  .o("write.compose.synthesis", "Kaynaklardan sentez denemesi", {
    d: "Birden çok kaynağı (metin, grafik, görsel) okuyup kendi tezine hizmet edecek biçimde birleştirme, kaynakları birbirleriyle konuşturma ve doğru atıf yapma.",
    w: "Literatür taraması, araştırma raporu ve politika yazısı gibi gerçek yazı türleri tek kaynakla değil sentezle çalışır; kaynakları sıralamak yerine ilişkilendirmeyi öğretir.",
    pre: ["write.compose.evidence", "res.lit.citation~s"],
    q: [
      "Üç kaynağı sırayla özetleyen bir deneme ile üçünü aynı soru etrafında tartıştıran bir deneme arasındaki farkı tahmin et. Hangisi senin fikrini gösterir?",
    ],
    cq: [
      "Kaynaklar arasındaki uzlaşma, gerilim ve boşluk nasıl bulunur?",
      "Bir grafik ya da veri kaynağı argümana nasıl dahil edilir?",
      "Kendi sesini kaynakların arasında nasıl korursun?",
    ],
    obj: [
      "Birden çok kaynağın konumunu bir sentez tablosunda karşılaştırır",
      "En az üç kaynağı kendi tezine bağlayan, kaynakları birbiriyle ilişkilendiren bir deneme yazar",
      "Bir görsel ya da nicel kaynağı doğru yorumlayıp argümana yerleştirir",
      "Kaynakları tutarlı bir atıf biçimiyle belirtir",
    ],
    ev: "VERI_ANALIZI PROBLEM_COZME ARASTIRMA_UYGULAMASI",
    t: "UYGULAMA",
    lv: 4,
    sc: "L",
    mis: [
      "Sentez, kaynakların sırayla özetlenmesidir.",
      "Kaynaklar kendi aralarında çelişiyorsa biri yanlış demektir.",
    ],
    x: [
      "res.lit.search:literatür taraması bilimsel bir sentezdir",
      "res.lit.citation:atıf ve intihalden kaçınma",
      "media.lit.stats-in-news:sentezde kullanılan grafikleri doğru okumak",
    ],
    ra: ["Kısa bir literatür özeti ya da politika notu yazmak"],
    rel: ["write.compose.evidence"],
    tags: ["yazma", "sentez", "kaynak"],
  })
  .o("write.compose.style", "Üslup, cümle çeşitliliği ve düzeltme", {
    d: "Sözcük seçimi, cümle uzunluğu ve yapısı, bağlaçlar ve ton üzerinde bilinçli seçimler yaparak açık ve etkili düzyazı yazma; dilbilgisi ve noktalama düzeltmesi.",
    w: "Fikir ne kadar iyi olursa olsun, okunması zor bir cümle onu gizler; açık ve çeşitli bir üslup hem sınav yazısında hem bilimsel metinde okurun dikkatini korur.",
    pre: ["write.compose.thesis"],
    q: [
      "Uzun bir cümleyi üç kısa cümleye bölmek her zaman daha mı iyidir? Kısa cümlelerin arka arkaya gelmesi okurda nasıl bir etki bırakır?",
    ],
    cq: [
      "Cümle uzunluğu ve yapısı vurgu ve ritmi nasıl etkiler?",
      "Edilgen yapı ve ad soylu anlatım ne zaman uygundur, ne zaman metni bulandırır?",
      "Bağlaçlar ve geçişler fikirler arasındaki mantıksal ilişkiyi nasıl görünür kılar?",
    ],
    obj: [
      "Bir paragrafı gereksiz sözcüklerden arındırarak yeniden yazar",
      "Vurgu için cümle yapısını bilinçli olarak değiştirir ve etkisini açıklar",
      "Bir metindeki geçiş ve bağlaç hatalarını tespit edip düzeltir",
    ],
    ev: "PROBLEM_COZME ACIKLAMA TRANSFER",
    t: "PRATIK",
    lv: 2,
    sc: "M",
    mis: [
      "Akademik yazı, uzun ve karmaşık sözcüklerle yazılan yazıdır.",
      "Üslup yalnızca edebi metinlerin konusudur.",
    ],
    x: [
      "en.c2.style:İngilizcede üslup ve ton farklarının aynı ilkelerle incelenmesi",
      "res.write.report:bilimsel metinde açıklık ve kesinlik",
    ],
    rel: ["write.compose.revision", "write.rhetoric.appeals"],
    tags: ["yazma", "uslup", "duzeltme"],
  })
  .o("write.compose.revision", "Taslak, geri bildirim ve yeniden yazma", {
    d: "Yazıyı taslak–geri bildirim–yeniden yazma döngüsüyle geliştirme; büyük ölçekli (tez, yapı, kanıt) ve küçük ölçekli (cümle, yazım) düzeltmeyi ayırma.",
    w: "İyi yazı ilk taslakta değil yeniden yazmada oluşur; hakem raporuna yanıt vermek ya da bir projeyi geliştirmek aynı döngüyü kullanır.",
    pre: ["write.compose.style~s", "write.compose.evidence"],
    q: [
      "Bir arkadaşın yazına yalnızca yazım hatalarını işaretlediyse, yazın gerçekten daha iyi hâle gelir mi? Hangi geri bildirim daha yararlı olurdu?",
    ],
    cq: [
      "Büyük ölçekli düzeltme ile redaksiyon arasındaki fark nedir ve hangisi önce gelir?",
      "Yararlı ve uygulanabilir geri bildirim nasıl verilir ve alınır?",
      "Bir taslağın tezini yeniden yazmak gerektiğini nasıl anlarsın?",
    ],
    obj: [
      "Kendi taslağının ters taslağını (paragraf başına bir cümle) çıkarıp yapısal sorunları tespit eder",
      "Bir akranın yazısına ölçütlere dayalı, somut ve uygulanabilir geri bildirim yazar",
      "Geri bildirimi kullanarak bir taslağı yeniden yazar ve değişiklikleri bir notla gerekçelendirir",
    ],
    ev: "PROBLEM_COZME YORUMLAMA TRANSFER",
    t: "PRATIK",
    lv: 3,
    sc: "M",
    mis: [
      "Yeniden yazmak, yazım hatalarını düzeltmektir.",
      "İyi yazarlar tek seferde iyi yazar.",
    ],
    x: [
      "res.peer-review:hakemlik ve hakem raporuna yanıt aynı döngünün bilimsel sürümüdür",
      "comp.meta.deliberate-practice:hata defteri ve hedefli geri bildirim",
      "prog.tools.git:sürüm kontrolüyle taslakları izlemek",
    ],
    rel: ["write.compose.style"],
    tags: ["yazma", "geri-bildirim", "taslak"],
  })
  .o("write.compose.timed", "Süreli yazma ve sınav denemeleri", {
    d: "Sınırlı sürede istemi çözümleme, plan yapma, tezi hızla kurma ve analiz, sentez ya da argüman denemesini tamamlama stratejileri.",
    w: "Birçok sınav ve yarışma, yazma becerisini süre baskısı altında ölçer; planlama ve zaman dağıtımı pratiği, bilgiyi sayfaya dönüştürme oranını belirgin biçimde artırır.",
    pre: ["write.compose.evidence", "write.rhetoric.appeals"],
    q: [
      "40 dakikan var. Hemen yazmaya başlamak mı, 8 dakika plan yapmak mı daha çok puan getirir? Tahminini bir deneme yazıp sınayarak kontrol et.",
    ],
    cq: [
      "Bir yazma istemindeki görev sözcükleri (çözümle, savun, karşılaştır) nasıl okunur?",
      "Süre baskısında hangi bölüm kısaltılabilir, hangisi asla atlanmamalıdır?",
      "Bir puanlama ölçütü (rubric) neyi ödüllendirir ve yazına nasıl yansır?",
    ],
    obj: [
      "Bir istemi görev, konu ve kısıtlar açısından çözümleyip kısa bir plan çıkarır",
      "Belirlenen sürede tez, gelişme ve sonucu olan tam bir deneme yazar",
      "Kendi denemesini bir puanlama ölçütüyle değerlendirir ve bir sonraki deneme için hedef belirler",
    ],
    ev: "PROBLEM_COZME YORUMLAMA TRANSFER",
    t: "PRATIK",
    lv: 3,
    sc: "M",
    mis: [
      "Süreli yazmada uzun yazan kazanır.",
      "Plan yapmak süre kaybıdır.",
    ],
    x: [
      "comp.meta.exam-strategy:zaman yönetimi ve sınav stratejisi",
      "comp.meta.stress:baskı altında performans",
      "en.exam.prep:İngilizce yeterlik sınavlarındaki yazma görevleri",
    ],
    notes: [
      "Hedeflediğin sınavın yazma bölümü biçimini, süresini ve puanlama ölçütlerini sınavı düzenleyen kurumun güncel resmi belgelerinden doğrula.",
    ],
    rel: ["write.boss"],
    tags: ["yazma", "sinav", "sure"],
    src: true,
  })
  .o("write.boss", "Boss: Retorik analiz ve argüman denemesi", {
    d: "Bir retorik çözümleme, bir kaynaklı sentez ve bir argüman denemesinden oluşan tam bir yazma setini planlama, yazma ve yeniden yazma.",
    w: "Okuma, çözümleme, tez kurma, kanıt yorumlama ve üslup becerilerinin tek bir performansta birleştiğini gösterir; bu set araştırma ve başvuru yazılarına hazır olduğunun kanıtıdır.",
    pre: ["write.compose.synthesis", "write.rhetoric.appeals", "write.lit.fiction~s"],
    q: [
      "Analiz denemesinde de argüman denemesinde de bir tez savunuyorsun. Bu iki tezin doğası nasıl farklıdır? Birini diğerine dönüştürebilir misin?",
    ],
    cq: [
      "Çözümleme, sentez ve argüman görevleri hangi ortak becerileri, hangi farklı becerileri ister?",
      "Bir denemenin zayıf halkası (tez, kanıt, yorum, yapı) nasıl teşhis edilir?",
    ],
    obj: [
      "Bir retorik çözümleme denemesini savunulabilir bir tezle ve seçimleri amaca bağlayan yorumla yazar",
      "Kaynaklı bir sentez denemesinde en az üç kaynağı tez etrafında ilişkilendirir",
      "Bir argüman denemesinde karşı görüşü yanıtlayan, kanıtı yorumlanmış bir savunma kurar",
      "Üç denemeyi ölçütlere göre değerlendirip birini kapsamlı biçimde yeniden yazar",
    ],
    ev: "PROBLEM_COZME YORUMLAMA TRANSFER ARASTIRMA_UYGULAMASI",
    t: "CHALLENGE",
    lv: 4,
    sc: "L",
    boss: true,
    mis: ["Üç deneme türü için tek bir kalıp yeterlidir."],
    x: [
      "res.write.report:araştırma raporunda da iddia, kanıt ve yorum aynı biçimde kurulur",
      "en.app.personal-statement:başvuru metninde retorik durum ve üslup",
    ],
    rel: ["write.compose.timed", "write.compose.revision"],
    tags: ["boss", "yazma", "retorik"],
  })
  .done();
