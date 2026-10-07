import { builder } from "../dsl";

export const COMPETITION = builder("YARISMA")
  .unit("Meta beceriler", "Öğrenmeyi öğrenme")
  .o("comp.meta.learning-to-learn", "Öğrenmeyi öğrenme: aralıklı tekrar, geri çağırma, üstbiliş", {
    d: "Aralıklı tekrar, aktif geri çağırma, karışık çalışma (interleaving) ve üstbiliş gibi kanıta dayalı stratejilerle öğrenmeyi planlamak, izlemek ve kişisel deneylerle iyileştirmek.",
    w: "Müfredattaki her nesneyi daha kalıcı ve daha az zamanla öğrenmeni sağlar; bu uygulamanın tekrar takvimi, kanıt odaklı ustalık ölçütleri ve kişisel öğrenme deneyleri doğrudan bu ilkelere dayanır.",
    q: [
      "Bir konuyu üç kez art arda okumak mı, bir kez okuyup iki kez kitabı kapatarak hatırlamaya çalışmak mı daha kalıcıdır? Tahmin et; sonra bir hafta sonra kendini test ederek sına.",
      "Bir konuyu çalıştıktan hemen sonra 'Bunu biliyorum' hissi neden bir hafta sonraki performansın için kötü bir göstergedir?",
    ],
    cq: [
      "Unutma eğrisi nedir ve aralıklı tekrar onu nasıl değiştirir?",
      "Geri çağırma neden yeniden okumaktan daha güçlü bir öğrenme olayıdır?",
      "Ne bildiğimi ve ne bilmediğimi nasıl güvenilir biçimde ölçerim?",
    ],
    obj: [
      "Bir konu için aralıklı tekrar takvimi kurar ve tekrar aralıklarını hatırlama başarısına göre ayarlar.",
      "Pasif çalışma alışkanlıklarını geri çağırma ve karışık pratik içeren etkinliklere dönüştürür.",
      "Kendi öğrenme stratejilerinden birini kontrollü bir kişisel deneyle (n=1) sınar ve sonucu yorumlar.",
      "Güven tahminlerini gerçek test sonuçlarıyla karşılaştırarak üstbilişsel kalibrasyonunu ölçer.",
    ],
    ev: "DENEY VERI_ANALIZI TRANSFER YORUMLAMA",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Akıcı okumanın ve altını çizmenin öğrenmenin iyi göstergeleri olduğunu sanmak (akıcılık yanılsaması).",
      "Bir defada uzun süre çalışmanın (bloklu, yığılmış çalışma) aynı toplam sürenin aralıklı dağıtılmasından daha etkili olduğunu düşünmek.",
      "'Görsel/işitsel öğrenen' gibi öğrenme stillerine göre öğretimin başarıyı artırdığını varsaymak.",
    ],
    x: [
      "neuro.cog.learning-memory:aralıklı tekrar ve geri çağırma etkilerinin bellek sistemlerindeki temelleri",
      "neuro.cog.sleep:uyku sırasında bellek pekiştirme; uykudan kesip çalışmanın bedeli",
      "neuro.syn.plasticity:kalıcı öğrenmenin hücresel temeli olarak LTP ve aralıklı uyarımın etkisi",
      "res.method.experimental-design:öğrenme stratejilerini kontrollü kişisel deneylerle sınamak",
      "neuro.cog.attention:dikkat dağınıklığı ve çoklu görevin kodlamaya etkisi",
      "neuro.syn.neuromodulation:merak, ödül ve dopaminin kodlamayı güçlendirmesi",
      "neuro.cog.emotion:stresin bellek kodlama ve geri çağırma üzerindeki iki yönlü etkisi",
      "math.prob.stochastic:unutma ve tekrar zamanlamasının olasılıksal modellemesi",
    ],
    ra: ["Kişisel öğrenme deneyleri: aralıklı tekrar, uyku süresi, karışık pratik", "Kendi tekrar verisinden unutma eğrisi çıkarmak"],
    ca: ["Olimpiyat hazırlığında uzun dönemli bilgi tutma"],
    rel: ["comp.meta.deliberate-practice", "comp.meta.stress"],
    tags: ["meta", "öğrenme", "aralıklı-tekrar", "üstbiliş"],
  })
  .o("comp.meta.deliberate-practice", "Bilinçli pratik ve hata defteri", {
    d: "Zayıf noktaları hedefleyen, anında geri bildirimli, zorluğu ayarlanmış pratik; hataları türlerine göre sınıflandıran bir hata defteri tutmak.",
    w: "Aynı sürede çok daha hızlı gelişmenin yoludur; olimpiyat ve programlama yarışmalarında ilerlemeyi belirleyen şey çözülen soru sayısından çok hatalardan çıkarılan derstir.",
    pre: ["comp.meta.learning-to-learn"],
    q: [
      "Zaten rahatça çözebildiğin 100 soruyu çözmek mi, zorlandığın 10 soruyu derinlemesine incelemek mi seni daha çok geliştirir?",
      "Bir sınavda yaptığın hatanın 'dikkatsizlik' olduğunu söylemek neden çoğu zaman yetersiz bir teşhistir?",
    ],
    cq: [
      "Bilinçli pratiği sıradan tekrardan ayıran nedir?",
      "Hatalar nasıl sınıflandırılır ve bundan nasıl ders çıkarılır?",
      "Pratiğin zorluğu nasıl ayarlanır?",
    ],
    obj: [
      "Hatalarını kavram, strateji, hesap ve okuma hatası gibi türlere ayıran bir hata defteri tutar.",
      "Hata defterindeki örüntülerden hedefli bir pratik planı türetir.",
      "Çözemediği bir soruyu bir hafta sonra çözümüne bakmadan yeniden çözerek gelişimini ölçer.",
    ],
    ev: "VERI_ANALIZI PROBLEM_COZME TRANSFER",
    t: "PRATIK",
    lv: 2,
    sc: "M",
    mis: [
      "Çok saat çalışmanın kendiliğinden uzmanlık getirdiğini sanmak.",
      "Bir sorunun çözümünü okuyup anlamanın onu çözebilmekle aynı olduğunu düşünmek.",
    ],
    x: [
      "neuro.comp.reinforcement:hata sinyali ve geri bildirimle öğrenme",
      "neuro.cog.learning-memory:prosedürel ve bildirimsel öğrenmenin pratikle gelişimi",
      "prog.python.files-debug:hata ayıklamada olduğu gibi hatanın kök nedenini aramak",
    ],
    ca: ["Her olimpiyat ve yarışma hazırlığı"],
    rel: ["comp.meta.problem-solving"],
    tags: ["pratik", "hata-defteri", "meta"],
  })
  .o("comp.meta.problem-solving", "Problem çözme stratejileri (Pólya)", {
    d: "Problemi anlama, plan yapma, planı uygulama ve geriye bakma döngüsü; özel durumlara bakma, geriye doğru çalışma, simetri arama ve problemi değiştirme gibi sezgisel yöntemler.",
    w: "Matematik, fizik ve programlama olimpiyatlarında daha önce görmediğin problemlere yaklaşabilmenin ortak dilidir.",
    pre: ["comp.meta.learning-to-learn~s", "math.found.algebra~h"],
    q: [
      "Bir problemde takıldın ve 20 dakikadır ilerleyemiyorsun. Problemi değiştirmenin (daha küçük sayılar, daha basit şekil, bir koşulu kaldırma) üç yolunu say.",
      "Çözümü bitirdikten sonra 'geriye bakmak' neden bir sonraki problemi çözme olasılığını artırır?",
    ],
    cq: [
      "Bir problemi gerçekten anladığımı nasıl kontrol ederim?",
      "Takıldığımda hangi stratejileri sırayla deneyebilirim?",
      "Bir çözümden genelleşebilir ne öğrenilir?",
    ],
    obj: [
      "Bir problemi kendi sözleriyle yeniden ifade eder, bilinen ve istenenleri ayırır.",
      "Takıldığında özel durum, geriye doğru çalışma ve simetri gibi en az üç stratejiyi bilinçli olarak dener.",
      "Çözümünü farklı bir yolla ya da sınır durumlarıyla kontrol eder ve yöntemi yeni bir probleme aktarır.",
    ],
    ev: "PROBLEM_COZME TRANSFER ACIKLAMA",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "İyi problem çözücülerin çözümü hemen 'gördüğünü' sanmak.",
      "Doğru cevaba ulaşınca problemle işin bittiğini düşünmek.",
    ],
    x: [
      "math.comp.olympiad-methods:Pólya stratejilerinin matematik olimpiyatındaki somut biçimleri",
      "phys.olymp.estimation:fizik problemlerinde boyut analizi ve sınır durumu kontrolü",
      "prog.algo.recursion:problemi daha küçük örneklerine indirgeme",
    ],
    ca: ["Tüm olimpiyat dallarında yeni problemlere yaklaşım"],
    rel: ["comp.meta.exam-strategy"],
    tags: ["problem-çözme", "polya", "strateji"],
  })
  .o("comp.meta.exam-strategy", "Sınav stratejisi ve zaman yönetimi", {
    d: "Bir sınavda soruları önceliklendirmek, zamanı bölmek, takıldığında geçmeyi bilmek, kısmi puan toplamak ve kontrol için zaman ayırmak.",
    w: "Aynı bilgiyle daha yüksek puan almanın yoludur; olimpiyat sınavlarında zamanın bilinçli kullanımı çoğu zaman sonucu belirler.",
    pre: ["comp.meta.problem-solving"],
    q: [
      "Bir sınavda zor bir soruya 40 dakika harcadın ve çözemedin. Bu kararı ne zaman, hangi işarete bakarak değiştirmeliydin?",
      "Çözemediğin bir sorunun kâğıdına hiçbir şey yazmamak mı, bulduğun kısmi sonuçları düzenli yazmak mı daha mantıklıdır?",
    ],
    cq: [
      "Sınava başlarken sorular nasıl taranıp önceliklendirilir?",
      "Bir soruyu bırakma kararı nasıl verilir?",
      "Kısmi puan nasıl toplanır?",
    ],
    obj: [
      "Süreli bir deneme sınavı için soru başına zaman bütçesi oluşturur ve uygular.",
      "Sınav sonrası zaman kullanımını analiz eder ve stratejisini buna göre düzeltir.",
      "Tam çözemediği bir soruda kısmi sonuçlarını okunur ve puanlanabilir biçimde yazar.",
    ],
    ev: "PROBLEM_COZME VERI_ANALIZI",
    t: "PRATIK",
    lv: 2,
    sc: "S",
    mis: [
      "Soruları her zaman sırayla çözmek gerektiğini sanmak.",
      "Kontrol için zaman ayırmanın zaman kaybı olduğunu düşünmek.",
    ],
    x: [
      "neuro.cog.decision:belirsizlik altında karar verme ve fırsat maliyeti",
      "neuro.cog.attention:uzun sınav boyunca dikkatin sürdürülmesi",
    ],
    ca: ["Olimpiyat ve yeterlik sınavlarında zaman yönetimi"],
    rel: ["comp.boss.mock", "comp.meta.stress"],
    tags: ["sınav", "zaman", "strateji"],
  })
  .o("comp.meta.stress", "Performans kaygısı ve dayanıklılık", {
    d: "Sınav ve yarışma kaygısının bedensel ve bilişsel etkilerini tanımak; yeniden değerlendirme, nefes ve hazırlık rutinleri ile başarısızlıktan toparlanma.",
    w: "Kaygı çalışma belleğini daraltarak bilinen bilgiyi bile erişilmez kılabilir; onu yönetmek hazırlığın karşılığını sınavda almayı sağlar.",
    pre: ["comp.meta.learning-to-learn"],
    q: [
      "Sınav öncesi kalbinin hızlı attığını fark ettin. Bunu 'Çok gerginim, başaramayacağım' diye mi, 'Vücudum performansa hazırlanıyor' diye mi yorumlamak sonucu değiştirir?",
      "Biraz stres neden performansı artırırken çok fazlası düşürür?",
    ],
    cq: [
      "Stres bedende ve beyinde ne yapar?",
      "Kaygı performansı hangi yoldan bozar?",
      "Bir başarısızlıktan sonra nasıl yeniden yapılanılır?",
    ],
    obj: [
      "Kendi kaygı belirtilerini ve tetikleyicilerini bir günlükle izler ve örüntüleri çıkarır.",
      "Sınav öncesi ve sırasında kullanacağı kısa bir sakinleşme ve yeniden değerlendirme rutini tasarlar.",
      "Kötü geçen bir yarışmayı suçlama yerine öğrenme odaklı bir değerlendirmeyle analiz eder.",
    ],
    ev: "ACIKLAMA VERI_ANALIZI TRANSFER",
    t: "BECERI",
    lv: 2,
    sc: "S",
    opt: true,
    mis: [
      "Her türlü stresin performansa zararlı olduğunu sanmak.",
      "Kaygının bir karakter zayıflığı olduğunu ve iradeyle bastırılması gerektiğini düşünmek.",
    ],
    x: [
      "neuro.cog.emotion:stres tepkisi, amigdala ve prefrontal korteks etkileşimi",
      "bio.physiology.endocrine:kortizol ve adrenalinin stres tepkisindeki rolü",
      "neuro.cog.sleep:uyku yoksunluğunun duygu düzenlemeyi zayıflatması",
    ],
    notes: ["Kaygı günlük yaşamı ciddi biçimde etkiliyorsa bir uzmandan destek almak gerekir; bu nesne tıbbi bir rehber değildir."],
    rel: ["comp.meta.exam-strategy"],
    tags: ["stres", "kaygı", "dayanıklılık"],
  })

  .unit("Olimpiyatlar", "Olimpiyatlar")
  .o("comp.phys.olympiad-path", "Fizik olimpiyatı yol haritası", {
    d: "Ulusal ve uluslararası fizik olimpiyatlarının genel yapısını, kuramsal ve deneysel bileşenlerini ve hazırlık için hangi konuların hangi sırayla çalışılabileceğini araştırıp kişisel bir yol haritası çıkarmak.",
    w: "Hazırlığı rastgele soru çözmekten çıkarıp konu boşluklarını ve öncelikleri bilinçli yönetmeyi sağlar.",
    pre: ["comp.meta.problem-solving", "phys.mech.newton~s"],
    q: [
      "Bir olimpiyatın resmî müfredatını ve geçmiş sorularını bulduğunda, hangi konulara ne kadar zaman ayıracağını nasıl belirlersin?",
      "Okul fiziği ile olimpiyat fiziği arasındaki fark konu listesinde mi, yoksa problemlerin yapısında mı? Geçmiş sorulara bakarak gerekçelendir.",
    ],
    cq: [
      "Olimpiyat aşamaları ve sınav biçimleri hangi resmî kaynaklardan doğrulanır?",
      "Resmî müfredat, mevcut bilgi düzeyimle nasıl karşılaştırılır?",
      "Uzun dönemli hazırlık nasıl aşamalara bölünür?",
    ],
    obj: [
      "Hedeflediği olimpiyatın aşamalarını, tarihlerini ve kapsamını resmî kaynaklardan bulur ve doğrular.",
      "Resmî müfredatı bu müfredattaki fizik nesneleriyle eşleyip eksik konularını belirler.",
      "Geçmiş soruları konu ve zorluğa göre sınıflandırıp gerçekçi bir hazırlık planı yazar.",
    ],
    ev: "ARASTIRMA_UYGULAMASI VERI_ANALIZI",
    t: "ARASTIRMA",
    lv: 2,
    sc: "S",
    src: true,
    mis: [
      "Olimpiyat hazırlığının yalnızca daha ileri konuları erken öğrenmek olduğunu sanmak; derinlik ve problem çözme daha belirleyicidir.",
      "Sınav yapısı ve tarihler hakkında forum ya da ikinci el bilgiye güvenmenin yeterli olduğunu düşünmek.",
    ],
    x: [
      "phys.mech.boss:mekanik, olimpiyat fiziğinin omurgasıdır",
      "phys.olymp.estimation:olimpiyat tarzı akıl yürütme",
      "phys.lab.experimental:deneysel sınav bileşenine hazırlık",
    ],
    ca: ["Fizik olimpiyatı hazırlık planı"],
    notes: ["Sınav aşamaları, tarihleri ve kapsamı değişebilir; her bilgiyi düzenleyen kurumun resmî kaynağından doğrula."],
    rel: ["comp.phys.theory-practice", "comp.phys.experimental"],
    tags: ["fizik", "olimpiyat", "plan"],
  })
  .o("comp.phys.theory-practice", "Olimpiyat kuramsal problem pratiği", {
    d: "Çok adımlı, birden fazla fizik konusunu birleştiren olimpiyat kuramsal problemlerini çözmek; modelleme, yaklaşıklık ve sınır durumu kontrolüyle düzenli çözüm yazmak.",
    w: "Fizik bilgisini yeni durumlara aktarma becerisini en sert biçimde sınar; olimpiyat başarısının ana belirleyicisidir.",
    pre: ["comp.phys.olympiad-path", "phys.olymp.estimation", "phys.mech.boss~s"],
    q: [
      "Bir problemde 'küçük açılar için' ya da 'sürtünme ihmal edilebilir' gibi bir ifade yok ama çözüm yaklaşıklık gerektiriyor. Hangi yaklaşıklığın meşru olduğuna nasıl karar verirsin?",
      "Bulduğun sonucun birimini ve uç durumlarını (m → 0, θ → 90°) kontrol etmek çözümün doğruluğu hakkında ne söyler?",
    ],
    cq: [
      "Karmaşık bir fiziksel durum nasıl çözülebilir bir modele indirgenir?",
      "Hangi korunum yasası ya da simetri problemi kolaylaştırır?",
      "Bir sonuç hangi bağımsız kontrollerle doğrulanır?",
    ],
    obj: [
      "Birden fazla konuyu birleştiren bir problemi modelleyip sonucu sembolik olarak türetir.",
      "Her sonucu boyut analizi, sınır durumları ve büyüklük tahminiyle kontrol eder.",
      "Süreli problem setleri çözer ve hata defterine göre çalışma planını günceller.",
    ],
    ev: "PROBLEM_COZME TURETME MODELLEME",
    t: "CHALLENGE",
    lv: 4,
    sc: "XL",
    mis: [
      "Formül ezberleyip doğru formülü bulmanın problemi çözmek olduğunu sanmak.",
      "Sayısal sonucun doğruluğunu kontrol etmenin gereksiz olduğunu düşünmek.",
    ],
    x: [
      "math.calc.applications:optimizasyon ve yaklaşıklık teknikleri",
      "math.ode.linear-second:salınım ve diferansiyel denklem çözümleri",
      "phys.mech.lagrangian:karmaşık mekanik sistemleri daha sistemli çözmek",
    ],
    ca: ["Fizik olimpiyatı kuramsal sınavları"],
    rel: ["phys.olymp.boss", "comp.boss.mock"],
    tags: ["fizik", "olimpiyat", "problem"],
  })
  .o("comp.phys.experimental", "Olimpiyat deneysel sınav pratiği", {
    d: "Sınırlı süre ve donanımla bir ölçüm planlamak, veri almak, doğrusallaştırarak grafik çizmek, belirsizliği hesaplamak ve sonucu raporlamak.",
    w: "Fizik olimpiyatlarının deneysel bileşenine hazırlar; aynı zamanda gerçek laboratuvar çalışmasının özünü (ölçüm, hata, model) pratiğe döker.",
    pre: ["comp.phys.olympiad-path", "phys.lab.experimental"],
    q: [
      "Bir sarkaçla g'yi ölçmen isteniyor ve yalnızca bir cetvelin ve bir kronometren var. En büyük belirsizlik nereden gelir ve onu nasıl küçültürsün?",
      "Ölçtüğün iki büyüklük arasında T ∝ √L gibi bir ilişki bekliyorsan, düz bir çizgi elde etmek için neyi neye karşı çizersin?",
    ],
    cq: [
      "Sınırlı sürede bir ölçüm nasıl planlanır?",
      "Veriler nasıl doğrusallaştırılır ve eğimden nicelik nasıl çıkarılır?",
      "Belirsizlik nasıl yayılır ve raporlanır?",
    ],
    obj: [
      "Verilen düzenekle bir ölçüm planı yapar ve süresini önceden bütçeler.",
      "Veriyi doğrusallaştırıp grafik çizer ve eğimden belirsizliğiyle birlikte bir nicelik hesaplar.",
      "Sistematik hata kaynaklarını belirler ve azaltma yolları önerir.",
    ],
    ev: "DENEY VERI_ANALIZI HESAPLAMA",
    t: "DENEY",
    lv: 4,
    sc: "L",
    mis: [
      "Daha fazla ölçüm noktasının sistematik hatayı da azalttığını sanmak.",
      "Belirsizliği raporlamanın isteğe bağlı bir ayrıntı olduğunu düşünmek.",
    ],
    x: [
      "math.stat.regression:eğim ve kesişimin belirsizliğiyle doğru uydurma",
      "res.data.visualization:hata çubuklu, okunur grafikler",
      "phys.measure.units:boyut analizi ve belirsizlik yayılımı",
    ],
    ca: ["Fizik olimpiyatı deneysel sınavları"],
    rel: ["comp.phys.theory-practice"],
    tags: ["fizik", "deney", "olimpiyat", "ölçüm"],
  })
  .o("comp.math.olympiad", "Matematik olimpiyatı pratiği", {
    d: "Cebir, kombinatorik, geometri ve sayılar kuramı alanlarında olimpiyat problemleri çözmek ve çözümleri eksiksiz ispat olarak yazmak.",
    w: "Matematiksel olgunluğu, ispat yazma becerisini ve yaratıcı problem çözmeyi geliştirir; bu beceriler fizik ve bilgisayar bilimine de taşınır.",
    pre: ["math.comp.olympiad-methods", "comp.meta.problem-solving"],
    q: [
      "Bir satranç tahtasının karşılıklı iki köşesini kesersen, kalan 62 kareyi 31 domino taşıyla tam kaplayabilir misin? Denemeden önce bir kanıt fikri bul.",
      "Bir çözümün 'doğru fikri' bulmuş olması ile tam puan alması arasındaki fark nedir?",
    ],
    cq: [
      "Hangi problem hangi teknik ailesine işaret eder?",
      "Bir ispat nasıl eksiksiz ve okunur yazılır?",
      "Dört ana alan arasında zaman nasıl dengelenir?",
    ],
    obj: [
      "Olimpiyat problemlerini dört ana alanda çözer ve eksiksiz ispat olarak yazar.",
      "Bir çözümdeki boşlukları kendi başına ve akran değerlendirmesiyle bulur.",
      "Çözülen problemleri teknik türüne göre sınıflandırarak kişisel bir yöntem kataloğu oluşturur.",
    ],
    ev: "ISPAT PROBLEM_COZME TRANSFER",
    t: "CHALLENGE",
    lv: 4,
    sc: "XL",
    mis: [
      "Olimpiyat matematiğinin okul matematiğinin daha zor sayılarla yapılan bir versiyonu olduğunu sanmak.",
      "Doğru cevabı bulmanın ispat için yeterli olduğunu düşünmek.",
    ],
    x: [
      "math.found.proof-techniques:tümevarım, çelişki ve doğrudan ispat",
      "math.discrete.number-theory:modüler aritmetik ve bölünebilirlik",
      "prog.comp.competitive:kombinatorik fikirlerin algoritmik karşılıkları",
    ],
    ca: ["Matematik olimpiyatları"],
    rel: ["comp.meta.deliberate-practice"],
    tags: ["matematik", "olimpiyat", "ispat"],
  })
  .o("comp.bio-neuro.brain-bee", "Beyin olimpiyatı (Brain Bee) hazırlığı", {
    d: "Nörobilim yarışmalarının yapısını resmî kaynaklardan araştırmak; nöroanatomi, nöral işlevler ve nörolojik hastalıklar üzerine bilgiyi sistematik biçimde çalışmak.",
    w: "Nörobilim bilgisini bütünsel ve kalıcı biçimde örgütlemeyi gerektirir; aynı zamanda bu alandaki öğrenci topluluklarına açılan bir kapıdır.",
    pre: ["neuro.sys.neuroanatomy", "neuro.cog.learning-memory~s"],
    q: [
      "Beyindeki bir bölgenin adını ezberlemek ile hasar gördüğünde hangi işlevin bozulacağını tahmin edebilmek arasındaki fark ne? Hangisini sorabilirler?",
      "Yüzlerce nöroanatomi terimini kalıcı öğrenmek için hangi öğrenme stratejilerini birleştirirsin?",
    ],
    cq: [
      "Yarışmanın aşamaları, kapsamı ve önerilen kaynakları hangi resmî kaynaklardan doğrulanır?",
      "Nöroanatomi bilgisi işlevle nasıl ilişkilendirilerek öğrenilir?",
      "Büyük bir bilgi hacmi uzun süre nasıl tutulur?",
    ],
    obj: [
      "Yarışmanın aşamalarını, kapsamını ve önerilen kaynaklarını resmî sitesinden bulup doğrular.",
      "Beyin bölgelerini işlevleri ve hasar sonuçlarıyla ilişkilendiren bir kavram haritası çizer.",
      "Aralıklı tekrar sistemiyle nöroanatomi terimlerinin uzun dönemli hatırlanmasını izler.",
    ],
    ev: "HATIRLAMA DIAGRAM ARASTIRMA_UYGULAMASI",
    t: "PRATIK",
    lv: 3,
    sc: "L",
    opt: true,
    src: true,
    mis: [
      "Bu tür yarışmaların yalnızca terim ezberinden ibaret olduğunu sanmak.",
      "Yarışma biçiminin tüm ülkelerde ve her yıl aynı olduğunu varsaymak.",
    ],
    x: [
      "neuro.sys.neuroanatomy:yarışmanın temel içeriği",
      "neuro.cog.learning-memory:kalıcı ezber için bellek ilkelerini kullanmak",
      "comp.meta.learning-to-learn:aralıklı tekrar ve geri çağırma ile hazırlık",
      "gk.sci-hist.neuroscience:nörobilim tarihinden önemli bulgular",
    ],
    ca: ["Nörobilim yarışmaları"],
    notes: ["Yarışmanın ulusal düzenleyicisi, aşamaları ve biçimi değişebilir; resmî kaynaklardan doğrula."],
    rel: ["neuro.sys.neuroanatomy"],
    tags: ["nörobilim", "yarışma", "brain-bee"],
  })
  .o("comp.research.science-fair", "Araştırma projesi yarışmaları", {
    d: "Bir araştırma projesini proje yarışmalarının değerlendirme ölçütlerine uygun biçimde planlamak, raporlamak ve jüriye sunmak; yarışmaların koşullarını resmî kaynaklardan araştırmak.",
    w: "Gerçek bir araştırmayı baştan sona yürütüp dışarıdan değerlendirme almanın en erişilebilir yoludur; başvuru dosyalarında da güçlü bir kanıttır.",
    pre: ["res.project.mini"],
    q: [
      "Bir jüri üyesi 'Bu sonucu başka nasıl açıklayabilirsin?' diye sorduğunda vereceğin yanıt projenin en güçlü ya da en zayıf anı olabilir. Hazırlığını şimdiden nasıl yaparsın?",
      "Yarışmanın değerlendirme ölçütlerini ve kurallarını proje başında mı, sonunda mı okumalısın? Neden?",
    ],
    cq: [
      "Yarışmanın kuralları, kategorileri ve değerlendirme ölçütleri hangi resmî kaynaklardan doğrulanır?",
      "Bir proje jüri ölçütlerine göre nasıl öz-değerlendirilir?",
      "Etik onay ve güvenlik koşulları nasıl karşılanır?",
    ],
    obj: [
      "Hedef yarışmanın kurallarını, takvimini ve değerlendirme ölçütlerini resmî kaynaktan doğrular.",
      "Projesini değerlendirme ölçütlerine göre öz-değerlendirir ve eksikleri giderir.",
      "Prova bir jüri sunumu yapar ve eleştirel sorulara kanıta dayalı yanıt verir.",
    ],
    ev: "ARASTIRMA_UYGULAMASI ACIKLAMA TRANSFER",
    t: "PROJE",
    lv: 3,
    sc: "L",
    src: true,
    mis: [
      "Jürinin en çok gösterişli sonuçları ödüllendirdiğini sanmak; yöntemin sağlamlığı ve öğrencinin anlayışı daha belirleyicidir.",
      "Etik onay ve güvenlik kurallarının proje bittikten sonra halledilebileceğini düşünmek.",
    ],
    x: [
      "res.write.presentation:jüri sunumu ve poster",
      "res.ethics:insan katılımcılı projelerde onam ve etik onay",
      "res.peer-review:projeyi bir hakem gözüyle değerlendirmek",
    ],
    ca: ["Ulusal ve uluslararası proje yarışmaları"],
    notes: ["Yarışma adları, kategorileri ve takvimleri değişebilir; her bilgiyi düzenleyen kurumun resmî duyurusundan doğrula."],
    rel: ["res.project.mini", "res.career.academic"],
    tags: ["proje", "yarışma", "araştırma"],
  })
  .o("comp.prog.contests", "Programlama yarışmaları", {
    d: "Çevrim içi ve yüz yüze programlama yarışmalarına düzenli katılmak; süreli yarışma pratiği, yarışma sonrası analiz ve çözülemeyen problemlerin çözümünü öğrenmek.",
    w: "Algoritma bilgisini süre baskısı altında ölçülebilir biçimde geliştirir ve bilişim olimpiyatı gibi yarışmalara hazırlar.",
    pre: ["prog.comp.competitive"],
    q: [
      "Bir yarışmadan sonra çözemediğin problemin resmî çözümünü okumak mı, bir gün daha uğraşmak mı daha öğreticidir? Ne zaman hangisi?",
      "Puanın yarışmadan yarışmaya dalgalanıyor. Gerçek gelişimini nasıl ölçersin?",
    ],
    cq: [
      "Düzenli yarışma pratiği nasıl planlanır?",
      "Yarışma sonrası analiz nasıl yapılır?",
      "Gelişim nasıl ölçülür?",
    ],
    obj: [
      "Düzenli süreli yarışmalara katılır ve her yarışma sonrası çözemediği problemleri çözer.",
      "Yarışma performansını zaman, hata türü ve konu bakımından analiz eder.",
      "Analizinden hedefli bir konu çalışma planı türetir ve uygular.",
    ],
    ev: "PROBLEM_COZME KODLAMA VERI_ANALIZI",
    t: "PRATIK",
    lv: 4,
    sc: "L",
    opt: true,
    mis: [
      "Puan dalgalanmalarının gerçek gelişimi doğrudan yansıttığını sanmak.",
      "Yalnızca yarışmalara katılmanın, sonrasında analiz yapmadan da gelişim sağlayacağını düşünmek.",
    ],
    x: [
      "prog.algo.dp:yarışmalarda en sık çıkan tekniklerden biri",
      "prog.algo.graphs:graf problemleri",
      "math.stat.descriptive:puan dalgalanmalarını gürültüden ayırt etmek",
    ],
    ca: ["Programlama yarışmaları ve bilişim olimpiyatı"],
    rel: ["comp.meta.deliberate-practice"],
    tags: ["programlama", "yarışma"],
  })
  .o("comp.boss.mock", "Boss: Tam deneme sınavı simülasyonu", {
    d: "Gerçek sınav koşullarında (süre, ortam, kurallar) tam bir olimpiyat deneme sınavına girmek, ardından zaman kullanımı, hata türleri ve kaygı yönetimini ayrıntılı analiz etmek.",
    w: "Bilgi, problem çözme, zaman yönetimi ve stres yönetimini tek bir gerçekçi ortamda birleştirir; asıl sınavdan önce zayıf halkayı görmeni sağlar.",
    pre: ["comp.meta.exam-strategy", "comp.phys.theory-practice"],
    q: [
      "Evde rahatça çözdüğün problemler deneme sınavında çözülemedi. Fark bilgide mi, zamanda mı, yoksa ortamda mı? Bunu nasıl ayırt edersin?",
      "Deneme sınavından sonraki analiz sınavın kendisinden daha uzun sürmeli mi?",
    ],
    cq: [
      "Gerçek sınav koşulları nasıl simüle edilir?",
      "Bir deneme sınavının sonuçları nasıl analiz edilir?",
      "Analizden hangi değişiklikler çıkarılır?",
    ],
    obj: [
      "Gerçek süre ve koşullarda tam bir deneme sınavına girer ve zaman çizelgesini kaydeder.",
      "Her kayıp puanı bilgi, strateji, zaman ya da kaygı kaynaklı olarak sınıflandırır.",
      "Analiz sonuçlarından bir sonraki hazırlık dönemi için öncelikli eylem listesi türetir.",
      "Sınav sırasında stratejisini koşullara göre uyarlar ve kısmi sonuçları puanlanabilir biçimde yazar.",
    ],
    ev: "PROBLEM_COZME VERI_ANALIZI TRANSFER",
    t: "CHALLENGE",
    lv: 4,
    sc: "L",
    boss: true,
    mis: [
      "Deneme sınavının tek amacının bir puan almak olduğunu sanmak.",
      "Kötü geçen bir deneme sınavının kötü bir hazırlık işareti olduğunu düşünmek; eksikleri erken göstermesi asıl değeridir.",
    ],
    x: [
      "phys.olymp.boss:fizik olimpiyatı tam problem seti",
      "neuro.cog.emotion:sınav stresinin performansa etkisi",
      "res.method.experimental-design:deneme sınavlarını karşılaştırılabilir koşullarda tekrarlamak",
    ],
    ca: ["Tüm olimpiyatlara son aşama hazırlık"],
    rel: ["comp.meta.stress", "comp.meta.deliberate-practice"],
    tags: ["boss", "deneme", "sınav"],
  })
  .done();
