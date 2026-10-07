import { builder } from "../dsl";

export const PSYCHOLOGY = builder("PSIKOLOJI")
  // ---------------------------------------------------------------------------
  .unit("Psikoloji", "Yöntem ve biyolojik temeller")
  .o("psy.methods", "Psikolojide araştırma yöntemleri", {
    d: "Gözlem, anket, korelasyonel çalışma ve deney; işlevsel tanımlama, örneklem seçimi, güvenirlik–geçerlik ve araştırma etiği.",
    w: "Psikolojideki her iddianın değeri yönteminden gelir; bir 'araştırmalar gösteriyor ki' cümlesini değerlendirmeyi ve kendi küçük çalışmanı tasarlamayı sağlar.",
    pre: ["res.method.scientific-method", "math.stat.descriptive~s"],
    q: [
      "Kahvaltı yapan öğrencilerin notları daha yüksek çıktı. Okullar kahvaltıyı zorunlu yapmalı mı? Başka hangi açıklamalar olabilir?",
      "'Mutluluk'u nasıl ölçerdin? Önerdiğin ölçümün neyi kaçırdığını söyle.",
    ],
    cq: [
      "Korelasyonel çalışma ile deney hangi soruları yanıtlayabilir, hangilerini yanıtlayamaz?",
      "Soyut bir kavram (kaygı, dikkat) ölçülebilir bir değişkene nasıl dönüştürülür?",
      "Bir ölçüm güvenilir olup geçersiz olabilir mi?",
    ],
    obj: [
      "Bir araştırma iddiasının korelasyonel mi deneysel mi olduğunu ayırt eder ve nedensellik iddiasını değerlendirir.",
      "Soyut bir psikolojik kavram için işlevsel tanım ve ölçüm önerir.",
      "Bağımsız ve bağımlı değişkeni, kontrol grubunu ve olası karıştırıcıları belirterek basit bir deney tasarlar.",
      "Bir çalışmadaki etik sorunları (bilgilendirilmiş onam, aldatma, gizlilik) saptar.",
    ],
    ev: "YORUMLAMA DENEY VERI_ANALIZI",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Korelasyonun nedenselliği gösterdiğini sanmak.",
      "Büyük bir örneklemin yanlı seçimi otomatik olarak düzelttiğini düşünmek.",
      "Kişisel deneyimin ya da çarpıcı bir vakanın sistematik veriden daha güçlü kanıt olduğunu sanmak.",
    ],
    x: [
      "res.method.causal:karıştırıcı değişkenler ve nedensellik aynı mantıkla ele alınır",
      "math.stat.inference:psikoloji bulguları hipotez testi ve güven aralığıyla raporlanır",
      "res.ethics:insan katılımcılarla araştırmanın etik ilkeleri",
    ],
    ra: ["Küçük bir anket ya da tepki süresi deneyi tasarlama", "Yayımlanmış bir çalışmanın yöntem bölümünü eleştirme"],
    rel: ["psy.intelligence"],
    tags: ["yöntem", "deney", "korelasyon", "etik"],
  })
  .o("psy.bio.behavior", "Davranışın biyolojik temelleri", {
    d: "Nöronlar ve nörotransmitterler, beynin temel bölgeleri, endokrin sistem, genler ve çevrenin davranıştaki ortak rolü.",
    w: "Duygudan belleğe kadar psikolojinin her konusu biyolojik bir düzeyde de açıklanır; psikoloji ile nörobilim arasında köprü kurar.",
    pre: ["neuro.sys.neuroanatomy~s", "psy.methods~s"],
    q: [
      "Tek yumurta ikizleri ayrı ailelerde büyüse kişilikleri ne kadar benzer olur? Tahminini yap, sonra ikiz çalışmalarının neyi ölçtüğünü düşün.",
      "Bir beyin bölgesi hasar görünce bir yetenek kayboluyorsa, o yetenek 'orada mı yaşıyor'?",
    ],
    cq: [
      "Nörotransmitterler ve hormonlar davranışı hangi zaman ölçeklerinde etkiler?",
      "Kalıtım ve çevre etkisi nasıl ayrıştırılmaya çalışılır, bu ayrıştırmanın sınırı nedir?",
      "Lezyon ve görüntüleme çalışmaları işlev hakkında ne söyleyebilir?",
    ],
    obj: [
      "Temel beyin bölgelerini işlevleriyle eşleştirir ve tek-bölge-tek-işlev yorumunun sınırını açıklar.",
      "Sinirsel ve hormonal iletişimi hız, menzil ve süre bakımından karşılaştırır.",
      "İkiz ve evlat edinme çalışmalarının kalıtsallık hakkında neyi gösterip neyi göstermediğini yorumlar.",
    ],
    ev: "ACIKLAMA DIAGRAM YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Kalıtsallık oranının tek bir bireyde özelliğin ne kadarının genlerden geldiğini söylediğini sanmak.",
      "İnsanların beyinlerinin yalnızca %10'unu kullandığına inanmak.",
      "'Sağ beyinli / sol beyinli' insan tiplerinin olduğunu düşünmek.",
    ],
    x: [
      "neuro.syn.transmission:davranışın altındaki sinaptik iletim",
      "bio.physiology.endocrine:hormonların davranış üzerindeki etkisi",
      "bio.genetics.mendel:kalıtım ve kalıtsallık kavramlarının temeli",
    ],
    rel: ["psy.motivation-emotion", "psy.states.consciousness"],
    tags: ["beyin", "hormon", "kalıtım"],
  })
  .o("psy.sensation-perception", "Duyum ve algı", {
    d: "Duyusal eşikler, Weber yasası, sinyal saptama kuramı, aşağıdan yukarı ve yukarıdan aşağı işleme, Gestalt ilkeleri ve algısal yanılsamalar.",
    w: "Algının dünyanın birebir kopyası değil bir yorum olduğunu gösterir; tanıklık, tasarım ve bilimsel gözlemin güvenilirliğini değerlendirmeyi sağlar.",
    pre: ["psy.bio.behavior", "neuro.sys.sensory~s"],
    q: [
      "Karanlık bir odada bir mumun ışığını fark edebilirsin; aydınlık bir salonda aynı mumu fark etmezsin. Eşik sabit değilse neye bağlı?",
      "Aynı gri kare, koyu bir zemin üzerinde daha açık görünür. Gözün mü yanılıyor, beynin mi 'doğru' hesap yapıyor?",
    ],
    cq: [
      "Mutlak eşik ve fark eşiği nasıl ölçülür; Weber yasası ne söyler?",
      "Sinyal saptama kuramı duyarlılığı karar ölçütünden nasıl ayırır?",
      "Beklenti ve bağlam algıyı nasıl şekillendirir?",
    ],
    obj: [
      "Weber oranını kullanarak bir uyaran için fark eşiğini hesaplar.",
      "Sinyal saptama deneyindeki isabet ve yanlış alarm oranlarını duyarlılık ve ölçüt bakımından yorumlar.",
      "Bir yanılsamayı aşağıdan yukarı ve yukarıdan aşağı işleme kavramlarıyla açıklar.",
    ],
    ev: "HESAPLAMA YORUMLAMA DENEY",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Algının dış dünyanın pasif bir kaydı olduğunu sanmak.",
      "Duyum ve algıyı aynı süreç saymak.",
      "Bilinçaltı reklamların davranışı güçlü biçimde yönlendirdiğinin kanıtlandığını düşünmek.",
    ],
    x: [
      "neuro.comp.bayesian-brain:algıyı önsel beklenti ve duyusal kanıtın birleşimi olarak modelleme",
      "math.found.exp-log:Weber–Fechner ilişkisinin logaritmik biçimi",
      "art.elements:Gestalt ilkelerinin görsel tasarımda kullanımı",
    ],
    ra: ["Çevrimiçi bir psikofizik deneyle eşik ölçme"],
    rel: ["psy.states.consciousness"],
    tags: ["algı", "psikofizik", "yanılsama"],
  })
  .o("psy.states.consciousness", "Bilinç durumları: uyku, rüya, dikkat", {
    d: "Seçici dikkat ve dikkat sınırları, uyku evreleri ve sirkadiyen ritim, rüya kuramları ve psikoaktif maddelerin bilinç üzerindeki genel etkileri.",
    w: "Uyku ve dikkat öğrenmenin doğrudan koşullarıdır; kendi çalışma düzenini kanıta dayalı kurmanı sağlar.",
    pre: ["psy.bio.behavior", "neuro.cog.sleep~s"],
    q: [
      "Kalabalık bir partide kimseyi dinlemiyorken biri adını söyleyince hemen duyarsın. Dinlemediğin konuşmayı nasıl 'duydun'?",
      "Sınavdan önceki gece uykusuz çalışmak mı, uyumak mı daha çok puan getirir? Tahminini gerekçelendir.",
    ],
    cq: [
      "Dikkat neden sınırlıdır ve çoklu görev ne zaman bedel öder?",
      "Uyku evreleri nelerdir ve beyin uykuda ne yapar?",
      "Rüyalar hakkında hangi kuramlar vardır ve hangileri sınanabilir?",
    ],
    obj: [
      "Bir uyku kaydı (hipnogram) üzerinde evreleri ayırt eder ve gece boyunca dağılımlarını yorumlar.",
      "Seçici dikkat ve dikkat körlüğü deneylerinin sonuçlarını açıklar.",
      "Uyku yoksunluğunun bellek ve dikkat üzerindeki etkisini kanıta dayanarak değerlendirir.",
    ],
    ev: "ACIKLAMA YORUMLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Çoklu görevde insanların iki işi gerçekten aynı anda yaptığını sanmak.",
      "Uykuda beynin 'kapandığını' düşünmek.",
      "Kaçırılan uykunun hafta sonu tamamen telafi edilebileceğini sanmak.",
    ],
    x: [
      "neuro.cog.attention:dikkatin sinirsel mekanizmaları",
      "neuro.methods.electrophysiology:uyku evreleri EEG ile tanımlanır",
      "gk.phil.mind:bilinç sorununun felsefi boyutu",
    ],
    rel: ["psy.cognition.memory"],
    tags: ["uyku", "dikkat", "bilinç"],
  })

  // ---------------------------------------------------------------------------
  .unit("Psikoloji", "Biliş ve öğrenme")
  .o("psy.learning.conditioning", "Öğrenme: klasik ve edimsel koşullanma", {
    d: "Klasik koşullanma (koşulsuz/koşullu uyaran ve tepki, sönme, genelleme), edimsel koşullanma (pekiştirme, ceza, pekiştirme tarifeleri) ve gözlem yoluyla öğrenme.",
    w: "Alışkanlıkların, korkuların ve oyun/uygulama tasarımlarının nasıl çalıştığını açıklar; pekiştirmeli öğrenme algoritmalarının da psikolojik kökenidir.",
    pre: ["psy.methods"],
    q: [
      "Bir slot makinesi neden her seferinde ödül veren bir makineden daha bağımlılık yapıcıdır? Tahmin et.",
      "Telefon bildirim sesini duyunca elin telefona gidiyor. Bunu kim, ne zaman öğretti?",
    ],
    cq: [
      "Klasik ve edimsel koşullanma hangi bakımlardan farklıdır?",
      "Olumsuz pekiştirme ile ceza nasıl ayrılır?",
      "Değişken oranlı tarife neden sönmeye dirençlidir?",
    ],
    obj: [
      "Bir senaryoda koşulsuz uyaran, koşullu uyaran, koşulsuz ve koşullu tepkiyi belirler.",
      "Olumlu/olumsuz pekiştirme ve cezayı örneklerle ayırt eder.",
      "Pekiştirme tarifelerinin tepki örüntülerini grafikten tahmin eder ve açıklar.",
      "Bir davranış değiştirme planını edimsel ilkelerle tasarlar.",
    ],
    ev: "ACIKLAMA TAHMIN TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Olumsuz pekiştirmenin ceza ile aynı şey olduğunu sanmak.",
      "Koşullanmanın yalnızca hayvanlarda ve basit reflekslerde görüldüğünü düşünmek.",
    ],
    x: [
      "neuro.comp.reinforcement:ödül tahmin hatası ve TD öğrenme koşullanmanın hesaplamalı modelidir",
      "neuro.syn.neuromodulation:dopaminin pekiştirmedeki rolü",
      "comp.meta.deliberate-practice:geri bildirim ve pekiştirmeyle beceri kazanma",
    ],
    rel: ["psy.cognition.memory", "psy.motivation-emotion"],
    tags: ["koşullanma", "pekiştirme", "öğrenme"],
  })
  .o("psy.cognition.memory", "Bellek süreçleri ve unutma", {
    d: "Kodlama, depolama ve geri getirme; duyusal, kısa süreli/çalışma ve uzun süreli bellek; açık ve örtük bellek; unutma eğrisi, bozulma, ket vurma ve yeniden yapılandırıcı bellek.",
    w: "Nasıl çalıştığının bilimsel temelini verir: geri çağırma pratiği ve aralıklı tekrar bu bulgulardan gelir; tanık ifadelerinin güvenilirliğini değerlendirmeyi sağlar.",
    pre: ["psy.learning.conditioning~s", "neuro.cog.learning-memory~s"],
    q: [
      "Bir konuyu üç kez yeniden okumak mı, bir kez okuyup iki kez kendini sınamak mı bir hafta sonra daha çok hatırlatır? Tahmin et.",
      "Çok canlı ve emin olduğun bir anının yanlış olması mümkün mü?",
    ],
    cq: [
      "Çalışma belleğinin kapasite sınırı neden önemlidir?",
      "Unutma neden olur: iz bozulması mı, ket vurma mı, geri getirme başarısızlığı mı?",
      "Bellek neden bir kayıt değil, bir yeniden kurma sürecidir?",
    ],
    obj: [
      "Unutma eğrisi verisini yorumlar ve aralıklı tekrarın etkisini tahmin eder.",
      "Bellek sistemlerini (açık/örtük, epizodik/semantik) örneklerle sınıflandırır.",
      "Yanlış bilgi etkisi deneylerini tanık ifadesi bağlamında değerlendirir.",
      "Kendi çalışma yöntemine geri çağırma ve aralıklama ilkelerini uygular.",
    ],
    ev: "YORUMLAMA TAHMIN TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Belleğin bir video kaydı gibi çalıştığını sanmak.",
      "Bir anıdan emin olmanın onun doğru olduğunu gösterdiğini düşünmek.",
      "Tekrar okumanın en etkili çalışma yöntemi olduğunu sanmak.",
    ],
    x: [
      "neuro.cog.learning-memory:hipokampüs ve bellek sistemlerinin sinirsel temeli",
      "comp.meta.learning-to-learn:aralıklı tekrar ve geri çağırma pratiği",
      "neuro.syn.plasticity:uzun süreli belleğin hücresel mekanizması",
    ],
    rel: ["psy.cognition.thinking", "psy.states.consciousness"],
    tags: ["bellek", "unutma", "çalışma-belleği"],
  })
  .o("psy.cognition.thinking", "Düşünme, problem çözme ve bilişsel yanlılıklar", {
    d: "Kavramlar ve prototipler, algoritma ve sezgisel yöntemler, işlevsel sabitlik, çerçeveleme, doğrulama yanlılığı, erişilebilirlik ve çapalama gibi yanlılıklar; hızlı ve yavaş düşünme ayrımı.",
    w: "Kendi kararlarındaki sistematik hataları görmeni sağlar; bilimsel yöntemin neden yanlılıklara karşı tasarlandığını açıklar.",
    pre: ["psy.cognition.memory"],
    q: [
      "Bir sopa ve top toplam 1,10 TL; sopa toptan 1 TL pahalı. Top kaç TL? İlk aklına gelen cevabı yaz, sonra kontrol et.",
      "Uçak kazaları haberlerde çok yer alıyor. Bu, uçmanın araba kullanmaktan daha tehlikeli olduğu hissini nasıl etkiler?",
    ],
    cq: [
      "Sezgisel yöntemler neden işe yarar ve ne zaman sistematik hata üretir?",
      "Doğrulama yanlılığına karşı hangi stratejiler etkilidir?",
      "Çerçeveleme aynı bilgiyle farklı kararlar verdirebilir mi?",
    ],
    obj: [
      "Bir karar senaryosundaki bilişsel yanlılığı adlandırır ve mekanizmasını açıklar.",
      "Bir problemde işlevsel sabitlik ya da zihinsel kümelenmeyi tespit edip alternatif temsil önerir.",
      "Doğrulama yanlılığına karşı yanlışlamaya dayalı bir sınama stratejisi tasarlar.",
    ],
    ev: "YORUMLAMA PROBLEM_COZME TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Yanlılıkların yalnızca az zeki ya da eğitimsiz insanlarda görüldüğünü sanmak.",
      "Yanlılıkları bilmenin onlardan otomatik olarak korunmayı sağladığını düşünmek.",
    ],
    x: [
      "media.lit.persuasion:ikna tekniklerinin bilişsel yanlılıkları kullanması",
      "gk.econ.behavioral:yanlılıkların ekonomik kararlara yansıması",
      "comp.meta.problem-solving:problem çözme stratejileri ve zihinsel kümelenmeyi aşma",
    ],
    rel: ["psy.social"],
    vs: ["econ.micro.consumer"],
    tags: ["yanlılık", "sezgisel", "karar"],
  })
  .o("psy.language", "Dil gelişimi ve dil-düşünce ilişkisi", {
    d: "Dilin birimleri (sesbirim, biçimbirim, sözdizimi, anlam), çocukta dil edinimi evreleri, edinim kuramları ve dilin düşünceyi ne ölçüde etkilediği tartışması.",
    w: "Yabancı dil öğrenirken neyin kolay neyin zor olduğunu açıklar; dil ile düşünce arasındaki ilişki hakkında abartılı iddiaları değerlendirmeni sağlar.",
    pre: ["psy.cognition.thinking~s"],
    q: [
      "Çocuklar 'gitti' yerine bazen 'gitdi' gibi hiç duymadıkları biçimler kullanır. Bu hata dil öğrenimi hakkında neyi gösterir?",
      "Rengi adlandıran sözcüğü olmayan bir dilin konuşurları o rengi daha zor mu ayırt eder? Nasıl test ederdin?",
    ],
    cq: [
      "Çocuklar dili taklitle mi, kural çıkarımıyla mı, ikisiyle mi edinir?",
      "Dil edinimi için duyarlı bir dönem var mıdır?",
      "Dil düşünceyi belirler mi, etkiler mi, yoksa yalnızca ifade mi eder?",
    ],
    obj: [
      "Bir ifadeyi sesbirim, biçimbirim ve sözdizimi düzeylerinde çözümler.",
      "Aşırı genelleme hatalarını kural öğrenmenin kanıtı olarak yorumlar.",
      "Dilsel görelilik iddiasının güçlü ve zayıf biçimlerini kanıta göre değerlendirir.",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "S",
    mis: [
      "Çocukların dili yalnızca taklit ederek öğrendiğini sanmak.",
      "İki dilli büyümenin çocukta kalıcı dil gerilemesine yol açtığını düşünmek.",
    ],
    x: [
      "en.b1.vocab:sözcük öğrenme stratejileri ve bellek",
      "write.read.close-reading:dilin anlam katmanlarını çözümleme",
      "neuro.sys.neuroanatomy:dil alanları ve beyin",
    ],
    rel: ["psy.development"],
    tags: ["dil", "edinim", "dilsel-görelilik"],
  })
  .o("psy.intelligence", "Zekâ ve ölçme", {
    d: "Zekâ kuramları (genel etken g, çoklu zekâ, üçlü kuram), test standardizasyonu, normal dağılım ve standart puanlar, güvenirlik–geçerlik, test yanlılığı ve kalıtım–çevre tartışması.",
    w: "Tek bir puanın bir insan hakkında ne söyleyip ne söyleyemeyeceğini gösterir; sınav ve ölçme sistemlerini eleştirel okumayı sağlar.",
    pre: ["psy.methods", "math.stat.descriptive"],
    q: [
      "Ortalaması 100, standart sapması 15 olan bir testte 130 alan biri nüfusun yaklaşık yüzde kaçından yüksektir? Kâğıda bakmadan tahmin et.",
      "Bir zekâ testi tamamen güvenilir (her seferinde aynı sonucu veren) ama yine de geçersiz olabilir mi?",
    ],
    cq: [
      "Zekâ tek bir yetenek midir, birden çok yeteneğin toplamı mıdır?",
      "Bir test nasıl standardize edilir ve standart puan nasıl yorumlanır?",
      "Grup ortalamaları arasındaki farklar bireyler hakkında ne söyler?",
    ],
    obj: [
      "Standart puanları z-puanına çevirir ve normal dağılımla yüzdelik sıraya dönüştürür.",
      "Test-tekrar test güvenirliği ile yordama geçerliğini veriden ayırt eder.",
      "Zekâ kuramlarını kanıtları ve sınırlılıklarıyla karşılaştırır.",
    ],
    ev: "HESAPLAMA YORUMLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Kalıtsallığın yüksek olmasının bir özelliğin değiştirilemez olduğu anlamına geldiğini sanmak.",
      "Bir test puanının kişinin sabit ve tek boyutlu 'zekâ miktarını' ölçtüğünü düşünmek.",
    ],
    x: [
      "math.prob.distributions:test puanları normal dağılım varsayımıyla ölçeklenir",
      "math.stat.regression:yordama geçerliği korelasyonla ölçülür",
      "res.stats.pitfalls:grup farklarının yanlış yorumlanması",
    ],
    rel: ["psy.methods", "psy.personality"],
    tags: ["zekâ", "ölçme", "psikometri"],
  })

  // ---------------------------------------------------------------------------
  .unit("Psikoloji", "Gelişim, kişilik ve toplum")
  .o("psy.development", "Yaşam boyu gelişim", {
    d: "Doğum öncesinden yaşlılığa fiziksel, bilişsel ve sosyal gelişim; Piaget'nin evreleri, Vygotsky'nin yakınsal gelişim alanı, bağlanma araştırmaları ve ergenlikte kimlik.",
    w: "Öğrenmenin ve öğretmenin yaşa göre nasıl değiştiğini açıklar; kendi ergenlik döneminin bilişsel ve duygusal değişimlerini anlamlandırmayı sağlar.",
    pre: ["psy.methods"],
    q: [
      "Küçük bir çocuğa aynı miktar suyu kısa-geniş bir bardaktan uzun-ince bir bardağa döktüğünde 'daha çok su var' der. Neden?",
      "Ergenlerin risk alma eğilimi yalnızca 'hormonlarla' mı açıklanır? Başka ne olabilir?",
    ],
    cq: [
      "Gelişim evreler hâlinde mi, sürekli mi ilerler?",
      "Kesitsel ve boylamsal araştırmaların gelişim çalışmasındaki güçlü ve zayıf yanları nelerdir?",
      "Erken bağlanma deneyimleri sonraki ilişkileri ne ölçüde etkiler?",
    ],
    obj: [
      "Bir çocuğun davranışını Piaget evreleri ve korunum kavramıyla yorumlar.",
      "Yakınsal gelişim alanı fikrini bir öğretme durumuna uygular.",
      "Kesitsel ve boylamsal tasarımı karşılaştırır ve kuşak etkisini açıklar.",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Gelişim evrelerinin herkes için aynı yaşta, keskin geçişlerle olduğunu sanmak.",
      "Bilişsel gelişimin ergenlikte tamamlandığını düşünmek.",
    ],
    x: [
      "neuro.sys.development:beyin gelişimi ve olgunlaşma",
      "res.method.experimental-design:kesitsel ve boylamsal tasarımlar",
      "bio.reproduction:embriyonik gelişim yaşam boyu gelişimin başlangıcıdır",
    ],
    rel: ["psy.language", "psy.personality"],
    tags: ["gelişim", "piaget", "bağlanma"],
  })
  .o("psy.motivation-emotion", "Güdülenme ve duygu", {
    d: "Güdü kuramları (dürtü azaltma, uyarılma, ihtiyaçlar hiyerarşisi, öz-belirleme), içsel ve dışsal güdülenme, duygu kuramları ve stres tepkisi.",
    w: "Uzun soluklu çalışmayı sürdürmenin ve sınav kaygısını yönetmenin psikolojik temelini verir.",
    pre: ["psy.bio.behavior", "neuro.cog.emotion~s"],
    q: [
      "Çok sevdiğin bir hobi için para almaya başlasan ona olan isteğin artar mı, azalır mı? Tahmin et.",
      "Kalbin hızla çarptığı için mi korkarsın, korktuğun için mi kalbin hızla çarpar?",
    ],
    cq: [
      "Uyarılma düzeyi ile performans arasındaki ilişki nasıldır?",
      "Dışsal ödüller içsel güdülenmeyi hangi koşullarda zayıflatır?",
      "Duygu kuramları bedensel tepki ile bilişsel değerlendirmenin sırasını nasıl açıklar?",
    ],
    obj: [
      "Yerkes–Dodson ilişkisini bir performans durumuna uygular ve görev zorluğunun etkisini tahmin eder.",
      "Duygu kuramlarını (James–Lange, Cannon–Bard, iki etmen) bir senaryo üzerinde karşılaştırır.",
      "İçsel ve dışsal güdülenmeyi ayırt eder ve öz-belirleme kuramıyla bir öğrenme ortamını değerlendirir.",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Her türlü ödülün güdülenmeyi her zaman artırdığını sanmak.",
      "Stresin tamamen zararlı olduğunu ve performansa hiç katkı sağlamadığını düşünmek.",
    ],
    x: [
      "neuro.cog.emotion:duygu ve stresin sinirsel devreleri",
      "comp.meta.stress:performans kaygısını yönetme stratejileri",
      "neuro.cog.decision:ödül ve karar verme",
    ],
    rel: ["psy.learning.conditioning", "psy.health.treatment"],
    tags: ["güdülenme", "duygu", "stres"],
  })
  .o("psy.personality", "Kişilik kuramları ve değerlendirme", {
    d: "Psikodinamik, hümanistik, özellik ve sosyal-bilişsel yaklaşımlar; Beş Faktör modeli; öz-bildirim ölçekleri ve projektif testlerin bilimsel değerlendirmesi.",
    w: "İnternetteki kişilik testlerini ve 'tip' iddialarını bilimsel ölçütlerle sınamayı öğretir.",
    pre: ["psy.methods", "psy.development~s"],
    q: [
      "Bir burç yorumu okuyunca 'tam beni anlatıyor' dersin; arkadaşın da aynı metin için aynısını söyler. Bu neyi gösterir?",
      "Bir insanın kişiliği mi davranışını belirler, yoksa içinde bulunduğu durum mu?",
    ],
    cq: [
      "Kişilik kuramları sınanabilirlik bakımından nasıl karşılaştırılır?",
      "Beş Faktör modeli neye dayanır ve ne kadar kararlıdır?",
      "Kişilik ölçümü hangi yanlılıklara açıktır?",
    ],
    obj: [
      "Kişilik kuramlarını sınanabilirlik ve kanıt bakımından karşılaştırır.",
      "Bir ölçeğin maddelerini Beş Faktör boyutlarıyla eşleştirir ve puanları yorumlar.",
      "Barnum etkisini ve sosyal beğenirlik yanlılığını bir test örneği üzerinde gösterir.",
    ],
    ev: "YORUMLAMA ACIKLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Popüler tip testlerinin kişiliği bilimsel olarak geçerli kategorilere ayırdığını sanmak.",
      "Kişiliğin yetişkinlikte hiç değişmediğini düşünmek.",
    ],
    x: [
      "gk.phil.science:yanlışlanabilirlik ölçütüyle kuramları değerlendirme",
      "media.lit.claim-analysis:kişilik testi iddialarını kanıt düzeyine göre sınama",
    ],
    rel: ["psy.intelligence", "psy.social"],
    tags: ["kişilik", "beş-faktör", "ölçek"],
  })
  .o("psy.social", "Sosyal psikoloji: tutum, uyma, grup", {
    d: "Yükleme hataları, tutum ve bilişsel çelişki, uyma ve itaat deneyleri, grup etkileri (sosyal kaytarma, grup düşüncesi, kutuplaşma), önyargı ve yardım etme davranışı.",
    w: "Grupların ve ortamın bireysel davranışı ne kadar güçlü etkilediğini gösterir; ekip çalışması, medya ve toplumsal tartışmaları daha bilinçli okumanı sağlar.",
    pre: ["psy.methods", "psy.cognition.thinking~s"],
    q: [
      "Sınıfta herkes açıkça yanlış bir cevabı doğru diye söylüyor. Sen de katılır mısın? Kaç kişiden sonra katılma olasılığın artar, tahmin et.",
      "Bir kazayı çok kişi görürse yardım gelme olasılığı artar mı, azalır mı?",
    ],
    cq: [
      "İnsanlar başkalarının davranışını neden kişiliğe, kendi davranışlarını neden duruma bağlar?",
      "Uyma ve itaat deneyleri ne gösterdi ve etik açıdan nasıl değerlendirilir?",
      "Grup içi tartışma kararları neden daha uç hâle getirebilir?",
    ],
    obj: [
      "Bir olayın açıklamasında temel yükleme hatasını tanır ve durumsal açıklama önerir.",
      "Bilişsel çelişki kuramıyla tutum değişimini öngörür.",
      "Klasik sosyal psikoloji deneylerini yöntem, bulgu ve etik açısından eleştirir.",
    ],
    ev: "YORUMLAMA TAHMIN ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Klasik deneylerdeki davranışların yalnızca 'kötü insanlara' özgü olduğunu sanmak.",
      "Ünlü deneylerin tümünün tekrarlanma ve yöntem eleştirilerinden bağımsız olarak kesin kabul edildiğini düşünmek.",
    ],
    x: [
      "media.lit.algorithms:filtre balonları ve grup kutuplaşması",
      "res.ethics:klasik deneylerin etik tartışması",
      "econ.micro.game-theory:iş birliği ve sosyal ikilemlerin modellenmesi",
    ],
    rel: ["psy.cognition.thinking", "psy.personality"],
    tags: ["sosyal", "uyma", "grup", "tutum"],
  })
  .o("psy.health.disorders", "Psikolojik bozukluklar (tanım ve sınıflama)", {
    d: "Normal ile bozukluk arasındaki sınırı belirleyen ölçütler, tanı sınıflama sistemlerinin mantığı, başlıca bozukluk kümelerinin (kaygı, duygudurum, psikotik vb.) genel özellikleri ve biyopsikososyal yaklaşım — yalnızca eğitim düzeyinde, tanı amacı taşımaz.",
    w: "Ruh sağlığı hakkında damgalayıcı ve yanlış inanışları düzeltir; sınıflama sistemlerinin nasıl ve neden değiştiğini anlamayı sağlar. Kendinde ya da başkasında tanı koymak için kullanılmaz; endişe varsa bir uzmana başvurulur.",
    pre: ["psy.personality~s", "psy.bio.behavior"],
    q: [
      "Sınavdan önce kaygılanmak 'normal'dir. Kaygı hangi noktada bir sorun olarak görülmeye başlanır? Hangi ölçütleri kullanırdın?",
      "Bir davranış bir kültürde olağan, başka bir kültürde tuhaf sayılıyorsa, 'bozukluk' tanımı ne kadar evrenseldir?",
    ],
    cq: [
      "Sıkıntı, işlev kaybı ve sapma ölçütleri neden tek başına yetmez?",
      "Tanı sınıflama sistemleri hangi amaçla kullanılır ve hangi eleştirilere açıktır?",
      "Biyopsikososyal model bir bozukluğun ortaya çıkışını nasıl açıklar?",
    ],
    obj: [
      "Normal ve anormal davranışı ayırmada kullanılan ölçütleri karşılaştırır ve her birinin sınırını gösterir.",
      "Bir bozukluk kümesinin genel özelliklerini biyolojik, psikolojik ve sosyal etkenlerle açıklar.",
      "Etiketleme ve damgalamanın etkilerini kanıta dayanarak tartışır.",
      "Sınıflama sistemlerinin güncel sürümlerini ve değişikliklerini birincil kaynaktan doğrulama yolunu açıklar.",
    ],
    ev: "ACIKLAMA YORUMLAMA ARASTIRMA_UYGULAMASI",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    src: true,
    mis: [
      "Bir listedeki belirtileri okuyarak kendine ya da arkadaşına tanı koyulabileceğini sanmak.",
      "Psikolojik bozuklukların bir 'karakter zayıflığı' olduğunu düşünmek.",
      "Ruh sağlığı sorunu olan kişilerin genellikle tehlikeli olduğuna inanmak.",
    ],
    x: [
      "neuro.methods.ethics:beyin temelli açıklamaların etik ve toplumsal boyutu",
      "media.lit.science-news:ruh sağlığı haberlerini eleştirel okuma",
    ],
    rel: ["psy.health.treatment"],
    tags: ["ruh-sağlığı", "sınıflama", "damgalama"],
    notes: ["Eğitim amaçlıdır; tanı veya tedavi önerisi içermez. Endişe durumunda bir ruh sağlığı uzmanına başvurulmalıdır."],
  })
  .o("psy.health.treatment", "Tedavi yaklaşımları ve iyi oluş", {
    d: "Psikoterapi yaklaşımlarının (psikodinamik, hümanistik, bilişsel-davranışçı) temel mantığı, biyomedikal yaklaşımların genel ilkesi, tedavi etkililiğinin nasıl araştırıldığı ve iyi oluşu destekleyen kanıta dayalı alışkanlıklar — eğitim düzeyinde, tedavi önerisi değildir.",
    w: "Bir tedavinin işe yarayıp yaramadığına nasıl karar verildiğini (kontrol grubu, plasebo, meta-analiz) gösterir; yardım aramanın yollarını ve uydurma 'mucize' çözümleri ayırt etmeyi sağlar.",
    pre: ["psy.health.disorders"],
    q: [
      "Bir terapiye başlayan insanların çoğu birkaç ay sonra daha iyi hissediyor. Bu, terapinin işe yaradığını kanıtlar mı? Başka ne olmuş olabilir?",
      "Uyku, hareket ve sosyal bağ gibi gündelik alışkanlıklar iyi oluşu gerçekten etkiler mi? Bunu nasıl test ederdin?",
    ],
    cq: [
      "Farklı terapi yaklaşımları sorunun kaynağını nerede arar?",
      "Bir tedavinin etkili olduğu hangi araştırma tasarımlarıyla gösterilir?",
      "Kanıta dayalı uygulama ile kanıtsız iddialar nasıl ayırt edilir?",
    ],
    obj: [
      "Terapi yaklaşımlarını varsayımları ve yöntemleri bakımından karşılaştırır.",
      "Bir tedavi etkililiği iddiasını kontrol grubu, plasebo ve kendiliğinden düzelme açısından değerlendirir.",
      "İyi oluşla ilgili bir iddianın kanıt düzeyini birincil kaynaklardan araştırır.",
    ],
    ev: "ACIKLAMA YORUMLAMA ARASTIRMA_UYGULAMASI",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    src: true,
    mis: [
      "Yardım almanın yalnızca 'ağır' durumlar için olduğunu sanmak.",
      "Bir kişide işe yarayan bir yöntemin herkese uygulanabilecek kanıt olduğunu düşünmek.",
      "İlaç ve terapinin birbirinin tamamen yerine geçtiğini düşünmek.",
    ],
    x: [
      "res.method.experimental-design:randomize kontrollü çalışmalar ve plasebo kontrolü",
      "media.lit.claim-analysis:sağlık iddialarını kanıt düzeyine göre sınama",
      "comp.meta.stress:stres ve kaygıyı yönetmede kanıta dayalı stratejiler",
    ],
    rel: ["psy.motivation-emotion"],
    tags: ["terapi", "iyi-oluş", "kanıta-dayalı"],
    notes: ["Eğitim amaçlıdır; kişisel tedavi önerisi değildir. Destek için bir uzmana ya da okul rehberlik servisine başvurulmalıdır."],
  })
  .o("psy.boss", "Boss: Psikoloji sentezi", {
    d: "Bellek, gelişim ve sosyal psikolojiyi birleştiren bir araştırma vakası: bir iddiayı yöntem, biyolojik temel, bilişsel süreç ve sosyal bağlam düzeylerinde çözümle; küçük bir çalışma tasarla.",
    w: "Psikolojinin farklı alanlarının aynı soruya nasıl farklı düzeylerden yanıt verdiğini birleştirir; yarışma ve araştırma projelerinde kullanılacak bütünleşik düşünmeyi sınar.",
    pre: ["psy.cognition.memory", "psy.social", "psy.development"],
    q: [
      "'Çocuklar ekranda gördüklerinden ergenlere göre daha kolay yanlış anı oluşturur' iddiasını nasıl sınardın? Hangi alanlardan bilgi gerekir?",
    ],
    cq: [
      "Tek bir davranış biyolojik, bilişsel, gelişimsel ve sosyal düzeylerde nasıl açıklanır?",
      "Bir iddiayı sınayan etik ve geçerli bir çalışma nasıl tasarlanır?",
    ],
    obj: [
      "Karmaşık bir psikolojik iddiayı en az üç açıklama düzeyinde çözümler.",
      "Etik açıdan kabul edilebilir, değişkenleri işlevsel olarak tanımlanmış bir çalışma tasarlar.",
      "Varsayımsal bir veri setini analiz eder ve bulgunun sınırlarını yazar.",
    ],
    ev: "PROBLEM_COZME DENEY VERI_ANALIZI TRANSFER",
    t: "BOSS",
    lv: 4,
    sc: "L",
    boss: true,
    x: [
      "res.project.mini:bütünleşik bir mini araştırma projesi",
      "neuro.cog.learning-memory:bellek bulgularının sinirsel düzeyle birleştirilmesi",
    ],
    ca: ["Beyin olimpiyatı ve psikoloji yarışmalarında vaka analizi"],
    rel: ["psy.methods"],
    tags: ["boss", "sentez", "psikoloji"],
  })
  .done();
