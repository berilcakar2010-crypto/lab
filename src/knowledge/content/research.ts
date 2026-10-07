import { builder } from "../dsl";

export const RESEARCH = builder("ARASTIRMA")
  .unit("Yöntem", "Bilimsel yöntem")
  .o("res.method.scientific-method", "Bilimsel yöntem ve araştırma sorusu", {
    d: "Merakı test edilebilir, kapsamı belirli ve yanıtlanabilir bir araştırma sorusuna dönüştürmek; gözlem, açıklama ve sınama döngüsü.",
    w: "Kötü sorulmuş bir soru en iyi yöntemle bile anlamlı bir sonuca götürmez; her proje, yarışma başvurusu ve kişisel deney iyi bir soruyla başlar.",
    q: [
      "'Müzik dinlemek ders çalışmaya yardımcı olur mu?' sorusu neden henüz bir araştırma sorusu değildir? Onu bir haftada yanıtlanabilir hâle getir.",
      "Bir iddia hiçbir olası gözlemle yanlışlanamıyorsa, bu onun güçlü mü yoksa zayıf mı olduğunu gösterir?",
    ],
    cq: [
      "İyi bir araştırma sorusunun özellikleri nelerdir?",
      "Gözlem, hipotez, tahmin ve sınama birbirine nasıl bağlanır?",
      "Bir sorunun kapsamı kaynaklara göre nasıl daraltılır?",
    ],
    obj: [
      "Genel bir merakı ölçülebilir değişkenleri olan, kapsamı sınırlı bir araştırma sorusuna dönüştürür.",
      "Bir iddianın yanlışlanabilir olup olmadığını ayırt eder ve gerekçelendirir.",
      "Bir araştırma sorusunu yanıtlamak için hangi verinin gerekeceğini önceden planlar.",
    ],
    ev: "ACIKLAMA ARASTIRMA_UYGULAMASI TRANSFER",
    t: "KAVRAM",
    lv: 1,
    sc: "S",
    mis: [
      "Bilimsel yöntemin her alanda aynı sırayla izlenen katı bir adım listesi olduğunu sanmak.",
      "Bilimin kesin 'kanıt' ürettiğini düşünmek; bilim, sınanmış ve geçici açıklamalar üretir.",
    ],
    x: [
      "gk.phil.science:yanlışlanabilirlik ve bilimsel yöntemin felsefi temelleri",
      "media.lit.claim-analysis:bir iddiayı test edilebilir parçalara ayırmak",
      "gk.sci-hist.scientific-revolution:yöntemin tarihsel olarak nasıl biçimlendiği",
    ],
    ra: ["Her proje önerisinin ilk paragrafı"],
    rel: ["res.method.hypothesis"],
    tags: ["yöntem", "soru", "temel"],
  })
  .o("res.method.hypothesis", "Hipotez ve değişken tasarımı", {
    d: "Bağımsız, bağımlı ve kontrol değişkenlerini tanımlamak; soyut kavramları ölçülebilir hâle getirmek (operasyonelleştirme) ve yönlü hipotez yazmak.",
    w: "'Odaklanma' ya da 'öğrenme' gibi kavramları ölçmeden önce nasıl tanımladığın, sonucun ne anlama geldiğini belirler.",
    pre: ["res.method.scientific-method"],
    q: [
      "'Uyku öğrenmeyi iyileştirir' hipotezinde 'öğrenme'yi kaç farklı biçimde ölçebilirsin? Her ölçüm farklı bir sonuç verebilir mi?",
      "Bir hipotez sonuçtan sonra yazılırsa ne kaybedilir?",
    ],
    cq: [
      "Değişkenler nasıl tanımlanır ve ölçülür?",
      "Bir hipotezi test edilebilir kılan nedir?",
      "Sıfır hipotezi ile araştırma hipotezi nasıl ilişkilidir?",
    ],
    obj: [
      "Bir araştırma sorusundan bağımsız, bağımlı ve kontrol değişkenlerini çıkarır.",
      "Soyut bir kavram için en az iki operasyonel tanım önerir ve karşılaştırır.",
      "Veri toplanmadan önce yönlü ve yanlışlanabilir bir hipotez ile beklenen sonucu yazar.",
    ],
    ev: "ACIKLAMA TAHMIN ARASTIRMA_UYGULAMASI",
    t: "BECERI",
    lv: 2,
    sc: "S",
    mis: [
      "Hipotezin bir 'tahmin tahmini' olduğunu, sonuca göre sonradan düzeltilebileceğini sanmak.",
      "Bir değişkenin tek bir doğru ölçüm biçimi olduğunu düşünmek.",
    ],
    x: [
      "math.stat.inference:sıfır ve alternatif hipotezin istatistiksel karşılığı",
      "bio.methods.lab:biyoloji deneylerinde değişken kontrolü",
      "neuro.cog.learning-memory:'öğrenme' ve 'bellek' gibi kavramların operasyonel tanımları",
    ],
    rel: ["res.method.experimental-design"],
    tags: ["hipotez", "değişken", "ölçüm"],
  })
  .o("res.method.experimental-design", "Deney tasarımı: kontrol, rastgeleleştirme, güç", {
    d: "Kontrol grubu, rastgeleleştirme, körleme, denek içi ve denekler arası tasarım ile örneklem büyüklüğü ve istatistiksel güç planlaması.",
    w: "Kendi üzerinde yaptığın öğrenme deneylerinden laboratuvar çalışmalarına kadar, bir farkın gerçekten müdahaleden kaynaklandığını gösterebilmenin tek yolu iyi tasarımdır.",
    pre: ["res.method.hypothesis", "math.stat.inference~s"],
    q: [
      "Aralıklı tekrarın işe yarayıp yaramadığını kendi üzerinde test etmek istiyorsun. Bir hafta normal, bir hafta aralıklı çalışmak neden yanıltıcı bir tasarım olabilir?",
      "Bir ilacı alan 10 kişiden 7'si iyileşti. Bu sonuç hakkında ne söyleyebilirsin, ne söyleyemezsin?",
    ],
    cq: [
      "Kontrol grubu ve rastgeleleştirme hangi hataları önler?",
      "Denek içi tasarımın avantajları ve tuzakları nelerdir?",
      "Kaç ölçüm yeterlidir ve istatistiksel güç bunu nasıl belirler?",
    ],
    obj: [
      "Bir müdahale için kontrol koşulu, rastgeleleştirme ve körleme içeren bir deney tasarlar.",
      "Sıra etkisi ve öğrenme etkisi gibi karıştırıcıları ayırt edip dengeleme (counterbalancing) önerir.",
      "Beklenen etki büyüklüğünden yaklaşık örneklem büyüklüğünü simülasyonla hesaplar.",
      "Kişisel bir öğrenme deneyini (n=1) önceden kayıtlı bir planla yürütür ve sınırlılıklarını raporlar.",
    ],
    ev: "DENEY SIMULASYON ARASTIRMA_UYGULAMASI",
    t: "DENEY",
    lv: 3,
    sc: "M",
    mis: [
      "Rastgeleleştirmenin yalnızca büyük çalışmalarda gerekli olduğunu sanmak.",
      "Anlamlı çıkmayan bir sonucun 'etki yok' demek olduğunu düşünmek; düşük güç etkiyi gizleyebilir.",
      "Plasebo etkisinin yalnızca ilaç çalışmalarında görüldüğünü varsaymak.",
    ],
    x: [
      "math.stat.inference:güç, anlamlılık düzeyi ve etki büyüklüğü",
      "comp.meta.learning-to-learn:öğrenme stratejilerini kişisel deneylerle sınamak",
      "bio.methods.lab:laboratuvar deneylerinde kontrol ve tekrar",
      "phys.lab.experimental:sistematik ve rastgele hatayı ayırmak",
    ],
    ra: ["Kişisel öğrenme deneyleri (aralıklı tekrar, uyku, çalışma süresi)", "Okul laboratuvarında kontrollü deney"],
    rel: ["res.method.causal", "res.stats.pitfalls"],
    tags: ["deney", "kontrol", "rastgeleleştirme", "güç"],
  })
  .o("res.method.causal", "Nedensellik ve karıştırıcı değişkenler", {
    d: "Korelasyondan nedenselliğe geçişin koşulları; karıştırıcı, aracı ve çarpıştırıcı değişkenler, ters nedensellik ve basit nedensel diyagramlar.",
    w: "Haberlerdeki 'X, Y riskini artırıyor' iddialarından gözlemsel nörobilim verisine kadar, neyin neye yol açtığını doğru okumak en sık yapılan hatayı önler.",
    pre: ["res.method.experimental-design", "math.stat.regression~s"],
    q: [
      "Dondurma satışları arttıkça boğulma vakaları da artıyor. Dondurmayı yasaklamak hayat kurtarır mı?",
      "Çok kitabı olan evlerdeki çocukların sınav başarısı daha yüksek. Her eve kitap dağıtmak başarıyı aynı oranda artırır mı?",
    ],
    cq: [
      "Bir korelasyonun nedensel olduğunu iddia etmek için ne gerekir?",
      "Karıştırıcı değişken nasıl tespit edilir ve kontrol edilir?",
      "Deney yapılamadığında nedensel çıkarım nasıl yapılır?",
    ],
    obj: [
      "Bir nedensellik iddiası için olası karıştırıcıları, ters nedenselliği ve seçim yanlılığını listeler.",
      "Basit bir nedensel diyagram (DAG) çizer ve hangi değişkenin kontrol edilmesi gerektiğini belirler.",
      "Simpson paradoksunu bir veri örneğinde gösterir ve yorumlar.",
    ],
    ev: "DIAGRAM YORUMLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 4,
    sc: "M",
    mis: [
      "Regresyona daha çok değişken eklemenin her zaman daha iyi olduğunu sanmak; çarpıştırıcıyı kontrol etmek yanlılık yaratır.",
      "Korelasyonun nedensellik hakkında hiçbir bilgi vermediğini düşünmek; doğru tasarımla kanıt sağlayabilir.",
    ],
    x: [
      "media.lit.science-news:haberlerdeki nedensellik iddialarını sınamak",
      "math.stat.regression:regresyonda kontrol değişkenlerinin anlamı",
      "neuro.methods.imaging:fMRI korelasyonlarından nedensel sonuç çıkarmanın sınırları",
    ],
    ra: ["Gözlemsel veride nedensel iddiaları değerlendirmek"],
    vs: ["math.stat.regression"],
    rel: ["res.stats.pitfalls"],
    tags: ["nedensellik", "karıştırıcı", "korelasyon"],
  })

  .unit("Literatür", "Literatür")
  .o("res.lit.search", "Literatür taraması", {
    d: "Akademik arama motorları ve veri tabanlarında etkili anahtar sözcüklerle arama yapmak; atıf zincirini ileri ve geri izlemek; derleme makalelerden başlamak.",
    w: "Bir sorunun zaten yanıtlanıp yanıtlanmadığını bilmeden proje başlatmak zaman kaybıdır; iyi tarama özgün katkını da görünür kılar.",
    pre: ["res.method.scientific-method"],
    q: [
      "Uyku ve bellek hakkında binlerce makale var. İlk okuyacağın beş makaleyi hangi ölçütlere göre seçersin?",
      "Bir makalenin kaynakçası geçmişe, ona atıf yapanlar ise geleceğe bakar. Bu iki yönü nasıl kullanırsın?",
    ],
    cq: [
      "Hangi arama araçları hangi amaç için uygundur?",
      "Derleme ve özgün araştırma makalesi nasıl ayırt edilir?",
      "Tarama sonuçları nasıl kaydedilir ve düzenlenir?",
    ],
    obj: [
      "Bir konu için anahtar sözcük listesi ve eş anlamlılarıyla sistematik bir arama yürütür.",
      "Bir derleme makaleden başlayarak geri ve ileri atıf izleme ile temel çalışmaları bulur.",
      "Bulduğu kaynakları bir tabloya soru, yöntem ve bulgu sütunlarıyla kaydeder.",
    ],
    ev: "ARASTIRMA_UYGULAMASI YORUMLAMA",
    t: "BECERI",
    lv: 2,
    sc: "S",
    mis: [
      "İlk arama sayfasındaki sonuçların en önemli çalışmalar olduğunu sanmak.",
      "En yeni makalenin her zaman en doğru bilgiyi verdiğini düşünmek.",
    ],
    x: [
      "media.lit.source-evaluation:kaynağın güvenilirliğini değerlendirme",
      "en.c1.sci-reading:literatürün büyük bölümü İngilizcedir",
    ],
    rel: ["res.lit.reading", "res.lit.citation"],
    tags: ["literatür", "arama", "kaynak"],
  })
  .o("res.lit.reading", "Bilimsel makale okuma", {
    d: "Bir makaleyi çok geçişli okumak: özet ve şekillerden başlamak, yöntemi sorgulamak, iddia ile kanıt arasındaki mesafeyi değerlendirmek.",
    w: "Bilimin ham maddesine doğrudan erişim sağlar; ikinci el özetlerin çarpıttığı noktaları kendin görmeni ve kendi projeni mevcut bilgiye bağlamanı sağlar.",
    pre: ["res.lit.search", "math.stat.inference~c"],
    q: [
      "Bir makaleyi baştan sona sırayla okumak neden çoğu zaman en verimsiz yoldur?",
      "Özet 'X, Y'yi önemli ölçüde iyileştirdi' diyor. Bu cümleye inanmadan önce makalenin hangi kısmına bakarsın?",
    ],
    cq: [
      "Bir makalenin yapısı (IMRaD) okumayı nasıl yönlendirir?",
      "Şekiller ve yöntemler nasıl eleştirel okunur?",
      "Yazarların iddiası ile verinin gösterdiği nasıl karşılaştırılır?",
    ],
    obj: [
      "Bir makalenin ana sorusunu, yöntemini, bulgusunu ve sınırlılığını beş cümlede özetler.",
      "Bir şekli metne bakmadan yorumlar ve yorumunu yazarlarınkiyle karşılaştırır.",
      "Makaledeki en zayıf varsayımı belirler ve onu sınayacak bir takip deneyi önerir.",
    ],
    ev: "YORUMLAMA ACIKLAMA ARASTIRMA_UYGULAMASI",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Hakemli dergide yayımlanmış her sonucun kesin olduğunu sanmak.",
      "Her terimi ve denklemi anlamadan makaleden hiçbir şey çıkarılamayacağını düşünmek.",
    ],
    x: [
      "en.c1.sci-reading:İngilizce bilimsel metin okuma stratejileri",
      "media.lit.science-news:birincil kaynağa giderek haberi doğrulamak",
      "neuro.methods.data-analysis:nörobilim makalelerindeki analizleri anlamak",
    ],
    ra: ["Dergi kulübü sunumu", "Proje için temel makaleleri çözümlemek"],
    rel: ["res.peer-review"],
    tags: ["makale", "okuma", "eleştirel"],
  })
  .o("res.lit.citation", "Kaynak gösterme ve atıf yönetimi", {
    d: "Kaynakları doğru ve tutarlı biçimde göstermek, alıntı ile özetlemeyi ayırmak ve atıf yönetim araçlarıyla kaynakçayı otomatikleştirmek.",
    w: "Doğru atıf, okuyucunun iddiayı izleyebilmesini sağlar ve intihalin en yaygın kaynağı olan dikkatsizliği önler.",
    pre: ["res.lit.search"],
    q: [
      "Bir fikri kendi cümlelerinle yazdın. Yine de kaynak göstermen gerekir mi?",
      "Bir makalede okuduğun bir sonucu, o makalenin atıf yaptığı asıl çalışmayı okumadan ona atıf yaparak verebilir misin?",
    ],
    cq: [
      "Ne zaman ve nasıl kaynak gösterilmelidir?",
      "Doğrudan alıntı, özetleme ve yeniden ifade nasıl ayrılır?",
      "Atıf yönetim araçları nasıl kullanılır?",
    ],
    obj: [
      "Bir metinde kaynak gerektiren iddiaları ayırt eder ve doğru biçimde kaynak gösterir.",
      "Bir paragrafı intihale düşmeden yeniden ifade eder ve kaynağını belirtir.",
      "Bir atıf yönetim aracıyla tutarlı bir kaynakça üretir.",
    ],
    ev: "ACIKLAMA ARASTIRMA_UYGULAMASI",
    t: "BECERI",
    lv: 2,
    sc: "S",
    mis: [
      "Kendi sözlerinle yazdığın bir fikir için kaynak göstermene gerek olmadığını sanmak.",
      "İnternette serbestçe erişilebilen içeriğin kaynak gösterilmeden kullanılabileceğini düşünmek.",
    ],
    x: [
      "prog.tools.latex:BibTeX ile otomatik kaynakça",
      "en.c1.academic-writing:akademik İngilizcede kaynak kullanımı",
    ],
    rel: ["res.write.report", "res.ethics"],
    tags: ["atıf", "kaynakça", "intihal"],
  })

  .unit("Veri", "Veri")
  .o("res.data.management", "Veri yönetimi ve dokümantasyon", {
    d: "Ham veriyi değiştirilmeden saklamak, anlamlı dosya ve klasör adlandırmak, veri sözlüğü ve laboratuvar defteri tutmak.",
    w: "Altı ay sonra kendi verini anlayamamak en yaygın araştırma kazasıdır; iyi düzen hem tekrarlanabilirliği hem de analizin güvenilirliğini sağlar.",
    pre: ["res.method.scientific-method", "prog.tools.reproducible~s"],
    q: [
      "Bir tabloda 'kosul' sütununda 1 ve 2 değerleri var. Üç ay sonra bunların ne anlama geldiğini nasıl bileceksin?",
      "Ham veriyi temizlerken orijinal dosyanın üzerine kaydetmek neden geri dönüşü olmayan bir hata olabilir?",
    ],
    cq: [
      "Ham, işlenmiş ve analiz edilmiş veri neden ayrı tutulur?",
      "Bir veri sözlüğü neleri içermelidir?",
      "Kişisel veriler nasıl korunur?",
    ],
    obj: [
      "Bir proje için ham/işlenmiş/sonuç ayrımı olan bir klasör yapısı ve adlandırma kuralı kurar.",
      "Bir veri seti için değişkenleri, birimleri ve kodlamaları açıklayan bir veri sözlüğü yazar.",
      "Deney sırasında tarih, koşul ve sapmaları kaydeden bir araştırma günlüğü tutar.",
    ],
    ev: "ARASTIRMA_UYGULAMASI ACIKLAMA",
    t: "PRATIK",
    lv: 2,
    sc: "S",
    mis: [
      "Dokümantasyonun projenin sonunda bir kerede yazılabileceğini sanmak.",
      "Verinin yalnızca bir kopyasını tutmanın yeterli olduğunu düşünmek.",
    ],
    x: [
      "prog.tools.git:kod ve metin dosyalarının sürüm geçmişi",
      "media.lit.privacy:kişisel verilerin korunması",
    ],
    rel: ["res.data.analysis-pipeline", "res.ethics"],
    tags: ["veri", "dokümantasyon", "düzen"],
  })
  .o("res.data.analysis-pipeline", "Veri analizi iş akışı", {
    d: "Ham veriden sonuca uzanan analizi okuma, temizleme, keşif, model ve raporlama adımlarına ayırıp betiklerle yeniden çalıştırılabilir kılmak.",
    w: "Sonucu üreten her adımın kodda yazılı olması, hatayı bulmayı, analizi güncellemeyi ve sonucu savunmayı mümkün kılar.",
    pre: ["res.data.management", "prog.python.pandas", "math.stat.inference"],
    q: [
      "Analizini bitirdin, sonra veride bir hata buldun. Tüm grafikleri ve sayıları yeniden üretmen ne kadar sürer: beş dakika mı, iki gün mü?",
      "Veriye bakmadan önce analiz planını yazmak neden önemli olabilir?",
    ],
    cq: [
      "Bir analiz iş akışı hangi aşamalardan oluşur?",
      "Keşifsel ve doğrulayıcı analiz nasıl ayrılır?",
      "Elle yapılan adımlar neden risklidir?",
    ],
    obj: [
      "Ham veriden son grafiğe kadar tek komutla çalışan bir analiz iş akışı kurar.",
      "Keşifsel ve önceden planlanmış analizleri raporda ayrı ayrı belirtir.",
      "Bir analiz adımındaki hatayı ara çıktıları kontrol ederek bulur ve düzeltir.",
    ],
    ev: "VERI_ANALIZI KODLAMA ARASTIRMA_UYGULAMASI",
    t: "VERI_ANALIZI",
    lv: 3,
    sc: "L",
    mis: [
      "Elle yapılan küçük düzeltmelerin belgelenmesine gerek olmadığını sanmak.",
      "Keşifsel analizde bulunan bir örüntünün aynı veriyle doğrulanabileceğini düşünmek.",
    ],
    x: [
      "prog.python.pandas:temizleme ve dönüştürme araçları",
      "neuro.methods.data-analysis:nöral veri için aynı iş akışı ilkeleri",
      "math.stat.inference:analizin çıkarım adımı",
    ],
    ra: ["Mini projenin analiz bölümü"],
    rel: ["res.data.visualization", "res.stats.pitfalls"],
    tags: ["analiz", "iş-akışı", "veri"],
  })
  .o("res.data.visualization", "Bilimsel görselleştirme", {
    d: "Bulguyu dürüstçe ve açıkça gösteren şekiller tasarlamak: belirsizliği göstermek, uygun grafik türünü ve ölçeği seçmek, tek bir mesaja odaklanmak.",
    w: "Çoğu okuyucu bir makalede önce şekillere bakar; iyi bir şekil bulguyu ikna edici kılar, kötü bir şekil doğru bir bulguyu bile gizler ya da çarpıtır.",
    pre: ["prog.python.plotting", "math.stat.descriptive"],
    q: [
      "İki grubun ortalaması sütun grafikte çok farklı görünüyor. Bireysel veri noktalarını eklediğinde bu izlenim değişebilir mi?",
      "Hata çubukları standart sapma mı, standart hata mı, güven aralığı mı gösteriyor? Bu fark yorumu nasıl değiştirir?",
    ],
    cq: [
      "Hangi veri ve soru için hangi grafik uygundur?",
      "Belirsizlik ve dağılım nasıl gösterilir?",
      "Bir şekil başlığı ve açıklaması nasıl yazılır?",
    ],
    obj: [
      "Aynı veriyi üç farklı grafikle gösterir ve hangisinin soruyu en iyi yanıtladığını gerekçelendirir.",
      "Hata çubuklarının ne gösterdiğini belirten, tek başına anlaşılır bir şekil üretir.",
      "Yanıltıcı bir grafiği tespit eder ve düzeltilmiş hâlini çizer.",
    ],
    ev: "DIAGRAM YORUMLAMA KODLAMA",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Sütun grafiğinin her karşılaştırma için uygun olduğunu sanmak; dağılımı gizleyebilir.",
      "Örtüşmeyen hata çubuklarının ya da örtüşenlerin anlamlılık hakkında kesin bilgi verdiğini düşünmek.",
    ],
    x: [
      "media.lit.stats-in-news:yanıltıcı grafikleri tanımak",
      "math.stat.descriptive:dağılım, merkez ve yayılım",
      "neuro.methods.data-analysis:raster grafik, PSTH ve ısı haritaları",
    ],
    rel: ["res.write.report", "res.write.presentation"],
    tags: ["görselleştirme", "şekil", "belirsizlik"],
  })
  .o("res.stats.pitfalls", "İstatistik tuzakları: p-hacking ve çoklu karşılaştırma", {
    d: "p-hacking, çoklu karşılaştırma, seçici raporlama, sonucu gördükten sonra hipotez kurma (HARKing) ve küçük örneklemlerin abartılı etkileri.",
    w: "Yayımlanmış bulguların bir kısmının tekrarlanamamasının başlıca nedenleridir; bunları bilen biri hem kendi analizini korur hem de başkalarınınkini eleştirebilir.",
    pre: ["math.stat.inference", "res.method.experimental-design"],
    q: [
      "20 farklı jelibon renginin sivilceye etkisini ayrı ayrı test ediyorsun. Hiçbir rengin gerçek etkisi yoksa, kaç testin 'anlamlı' çıkmasını beklersin?",
      "Bir araştırmacı sonuç anlamlı çıkana kadar veri toplamaya devam ediyor. Bunda ne sakınca var?",
    ],
    cq: [
      "p-değeri ne söyler, ne söylemez?",
      "Çoklu karşılaştırma neden yanlış pozitifleri artırır ve nasıl düzeltilir?",
      "Ön kayıt (preregistration) hangi sorunları çözer?",
    ],
    obj: [
      "Gerçek etki olmayan veride çoklu testin yanlış pozitif oranını simülasyonla gösterir.",
      "Bonferroni gibi bir düzeltmenin gerekçesini türetir ve uygular.",
      "Bir çalışmadaki olası araştırmacı serbestlik derecelerini (analiz seçimlerini) listeler.",
    ],
    ev: "SIMULASYON TURETME YORUMLAMA",
    t: "KAVRAM",
    lv: 4,
    sc: "M",
    mis: [
      "p = 0.03'ün hipotezin %97 olasılıkla doğru olduğu anlamına geldiğini sanmak.",
      "Anlamlı bir sonucun büyük ya da önemli bir etki olduğunu düşünmek.",
      "p-hacking'in yalnızca kasıtlı sahtekârlıkla olduğunu varsaymak; çoğu zaman iyi niyetli esnekliktir.",
    ],
    x: [
      "math.stat.inference:p-değeri, I. tip hata ve güç",
      "math.stat.bayesian:Bayesçi yaklaşımın p-değerine alternatifi",
      "media.lit.science-news:tek çalışmaya dayanan haberlere temkinle yaklaşmak",
    ],
    ra: ["Kendi analizini ön kayıtla planlamak"],
    rel: ["res.peer-review", "res.method.causal"],
    tags: ["p-hacking", "istatistik", "tekrarlanabilirlik"],
  })

  .unit("İletişim ve etik", "İletişim ve etik")
  .o("res.write.report", "Bilimsel rapor ve makale yazımı", {
    d: "Giriş, yöntem, bulgular ve tartışma yapısında açık, temkinli ve kanıta dayalı bilimsel metin yazmak.",
    w: "Yapılan araştırma yazılmadıkça başkası için yoktur; yarışma raporları, başvurular ve makaleler aynı yazım disiplinini ister.",
    pre: ["res.lit.citation", "res.data.visualization~s"],
    q: [
      "Bulgular bölümüne 'Bu sonuç uykunun belleği güçlendirdiğini kanıtlar' yazdın. Bu cümlede kaç sorun var?",
      "Yöntem bölümünü, bir başkasının deneyini aynen tekrar edebileceği kadar ayrıntılı yazmak için neleri eklemelisin?",
    ],
    cq: [
      "Her bölümün işlevi nedir?",
      "Bulgular ile yorum nasıl ayrı tutulur?",
      "Sınırlılıklar nasıl dürüstçe yazılır?",
    ],
    obj: [
      "Kendi verisiyle IMRaD yapısında kısa bir rapor yazar.",
      "Bulgular bölümünde yalnızca gözlemleri, tartışmada yorumları yazarak ikisini ayırır.",
      "İddialarının gücünü kanıtın gücüne uygun temkinli bir dille ayarlar.",
    ],
    ev: "ACIKLAMA ARASTIRMA_UYGULAMASI YORUMLAMA",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Karmaşık cümlelerin ve terimlerin metni daha bilimsel yaptığını sanmak.",
      "Olumsuz ya da beklenmedik sonuçların rapordan çıkarılması gerektiğini düşünmek.",
    ],
    x: [
      "en.c1.academic-writing:İngilizce akademik yazım kalıpları",
      "prog.tools.latex:raporun dizgisi",
      "de.c1.academic-writing:Almanca akademik yazım geleneği",
    ],
    ra: ["Mini proje raporu", "Yarışma proje raporu"],
    rel: ["res.write.presentation"],
    tags: ["yazım", "rapor", "makale"],
  })
  .o("res.write.presentation", "Bilimsel sunum ve poster", {
    d: "Bir araştırmayı sınırlı sürede ya da tek sayfada, izleyiciye uygun ve tek bir ana mesaj etrafında anlatmak; sorulara yanıt vermek.",
    w: "Yarışmalarda, yaz okullarında ve konferanslarda çalışmanın değerlendirilmesi büyük ölçüde sunumla olur.",
    pre: ["res.write.report~s"],
    q: [
      "Bir jüri üyesi posterinin önünde 30 saniye duracak. Bu sürede aklında kalmasını istediğin tek cümle ne?",
      "Bir slayta 6 grafik koymak mı, 6 slayta birer grafik mi? Neden?",
    ],
    cq: [
      "Bir sunumun yapısı yazılı rapordan nasıl farklıdır?",
      "Bir poster nasıl düzenlenir?",
      "Zor sorulara nasıl yanıt verilir?",
    ],
    obj: [
      "Bir projeyi tek ana mesajlı, süreye uygun bir sunuma dönüştürür.",
      "Uzaktan okunabilir, görsel ağırlıklı bir poster tasarlar.",
      "Bir prova sunumunda gelen eleştirel sorulara kanıta dayalı yanıt verir.",
    ],
    ev: "ACIKLAMA DIAGRAM TRANSFER",
    t: "PRATIK",
    lv: 2,
    sc: "S",
    mis: [
      "Slaytlarda ne kadar çok metin olursa sunumun o kadar eksiksiz olduğunu sanmak.",
      "'Bilmiyorum' demenin sunumda zayıflık göstergesi olduğunu düşünmek.",
    ],
    x: [
      "en.c1.sci-communication:İngilizce bilimsel sunum",
      "de.b2.science-communication:Almanca bilimsel sunum",
      "media.lit.production:bilimi geniş kitleye anlatmak",
    ],
    ca: ["Proje yarışmalarında jüri sunumu"],
    rel: ["res.write.report"],
    tags: ["sunum", "poster", "iletişim"],
  })
  .o("res.ethics", "Araştırma etiği", {
    d: "Uydurma, çarpıtma ve intihalden kaçınmak; insan ve hayvan katılımcılarla araştırmada onam, zararsızlık ve gizlilik; yazarlık ve çıkar çatışması.",
    w: "Bir çalışmanın bilimsel değeri etik temeline bağlıdır; kendi üzerinde ya da arkadaşlarınla yaptığın küçük deneyler bile onam ve gizlilik gerektirir.",
    pre: ["res.method.scientific-method"],
    q: [
      "Arkadaşlarının uyku sürelerini toplayıp bir projede kullanmak istiyorsun. Onlardan izin almak yeterli mi, başka neye dikkat etmelisin?",
      "Bir aykırı veri noktası sonucunu bozuyor. Onu çıkarmak ne zaman meşru, ne zaman çarpıtmadır?",
    ],
    cq: [
      "Araştırma suistimalinin türleri nelerdir?",
      "Bilgilendirilmiş onam neleri içermelidir?",
      "Yazarlık nasıl belirlenir?",
    ],
    obj: [
      "Bir proje planındaki etik riskleri belirler ve önlemler önerir.",
      "Katılımcılar için anlaşılır bir bilgilendirilmiş onam metni yazar.",
      "Veri dışlama kararlarını önceden belirlenmiş ölçütlerle gerekçelendirir.",
    ],
    ev: "ACIKLAMA YORUMLAMA ARASTIRMA_UYGULAMASI",
    t: "KAVRAM",
    lv: 2,
    sc: "S",
    mis: [
      "Etik kurallarının yalnızca tıbbi araştırmalar için geçerli olduğunu sanmak.",
      "Anonimleştirmenin yalnızca isimleri silmek olduğunu düşünmek.",
    ],
    x: [
      "neuro.methods.ethics:nörobilime özgü etik sorular",
      "gk.phil.ethics:etik kuramların araştırmaya uygulanması",
      "media.lit.privacy:kişisel veri ve gizlilik",
    ],
    ra: ["Her insan katılımcılı proje"],
    rel: ["res.data.management"],
    tags: ["etik", "onam", "dürüstlük"],
  })
  .o("res.peer-review", "Hakemlik ve eleştirel değerlendirme", {
    d: "Bir çalışmayı yapıcı ve sistematik biçimde değerlendirmek: iddiaların kanıtla desteklenip desteklenmediğini, yöntemin uygunluğunu ve alternatif açıklamaları sorgulamak.",
    w: "Başkasının çalışmasını değerlendirebilen biri kendi çalışmasındaki zayıflıkları da önceden görür; bilimsel kalite kontrolünün nasıl işlediğini anlamayı sağlar.",
    pre: ["res.lit.reading", "res.stats.pitfalls~s"],
    q: [
      "Bir arkadaşının proje raporunu değerlendiriyorsun. 'Güzel olmuş' demek ile 'Şekil 2'deki etki karıştırıcı X ile açıklanabilir mi?' demek arasındaki fark ne?",
      "Hakem sürecinden geçmiş bir makalede hâlâ ciddi hatalar olabilir mi? Nasıl?",
    ],
    cq: [
      "İyi bir hakem raporu neleri içerir?",
      "Eleştiri nasıl yapıcı ve kanıta dayalı yapılır?",
      "Hakemliğin sınırları nelerdir?",
    ],
    obj: [
      "Bir makale ya da raporu bir kontrol listesiyle değerlendirip yapılandırılmış bir hakem raporu yazar.",
      "Bir bulgu için en az iki alternatif açıklama önerir ve bunları ayırt edecek analizi belirtir.",
      "Kendi raporunu bir hakemin gözüyle yeniden okuyup zayıf noktalarını düzeltir.",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "BECERI",
    lv: 4,
    sc: "M",
    mis: [
      "Hakemliğin sonuçların doğru olduğunu garanti ettiğini sanmak.",
      "Eleştirinin kişisel bir saldırı olduğunu ya da yalnızca hata aramak olduğunu düşünmek.",
    ],
    x: [
      "media.lit.claim-analysis:iddia ve kanıt düzeylerini değerlendirmek",
      "gk.phil.intro:argüman analizi",
    ],
    ra: ["Akran değerlendirmesi ve dergi kulübü"],
    rel: ["res.lit.reading"],
    tags: ["hakemlik", "eleştiri", "değerlendirme"],
  })

  .unit("Projeler", "Projeler")
  .o("res.project.mini", "Mini araştırma projesi", {
    d: "Kendi araştırma sorusunu baştan sona yürütmek: soru, literatür, ön kayıtlı plan, veri toplama, analiz ve rapor.",
    w: "Araştırma becerilerinin tümünü gerçek bir soruda birleştirir; yarışma projeleri, yaz okulu başvuruları ve ileride gerçek araştırma için temel deneyimdir.",
    pre: ["res.method.hypothesis", "res.lit.reading", "res.data.analysis-pipeline", "res.write.report"],
    q: [
      "Bir ayda, kendi imkânlarınla, sonucunu gerçekten merak ettiğin hangi soruyu yanıtlayabilirsin?",
      "Sonucun hipotezinin tersini gösterirse projen başarısız mı olmuş sayılır?",
    ],
    cq: [
      "Kapsamı yönetilebilir bir proje nasıl seçilir?",
      "Plan ile gerçekleşen arasındaki sapmalar nasıl belgelenir?",
      "Sonuçlar sınırlılıklarıyla birlikte nasıl sunulur?",
    ],
    obj: [
      "Kapsamı sınırlı bir araştırma sorusu seçer ve veri toplamadan önce analiz planını yazar.",
      "Veriyi toplar, belgelenmiş bir iş akışıyla analiz eder ve sapmaları raporlar.",
      "Bulguları, sınırlılıkları ve sonraki adımları içeren bir rapor ve kısa bir sunum hazırlar.",
    ],
    ev: "ARASTIRMA_UYGULAMASI VERI_ANALIZI DENEY",
    t: "PROJE",
    lv: 4,
    sc: "L",
    mis: [
      "İyi bir projenin büyük ve özgün bir soru gerektirdiğini sanmak; iyi yürütülmüş küçük bir soru daha değerlidir.",
      "Beklenmedik sonucun projenin başarısızlığı olduğunu düşünmek.",
    ],
    x: [
      "comp.meta.learning-to-learn:kendi öğrenme stratejilerini sınayan bir n=1 deneyi doğal bir mini projedir",
      "neuro.cog.sleep:uyku ve bellek üzerine küçük ölçekli kişisel çalışma",
      "neuro.methods.data-analysis:açık nöral veri setiyle analiz projesi",
    ],
    ra: ["Kişisel öğrenme deneyi", "Açık veri setiyle analiz", "Okul laboratuvarında deney"],
    ca: ["Proje yarışmalarına temel"],
    rel: ["comp.research.science-fair"],
    tags: ["proje", "araştırma"],
  })
  .o("res.project.modeling", "Modelleme projesi", {
    d: "Gerçek bir sistemi diferansiyel denklemler ya da stokastik modellerle ifade edip sayısal olarak çözmek, parametreleri veriyle karşılaştırmak ve modelin sınırlarını tartışmak.",
    w: "Fizik, biyoloji ve nörobilimde kuram ile veriyi buluşturan temel araştırma biçimidir; hesaplamalı nörobilime doğrudan hazırlıktır.",
    pre: ["math.ode.numerical", "res.project.mini~s"],
    q: [
      "Bir salgının yayılmasını üç denklemle modelleyebilirsin. Bu modelin gerçekten 'doğru' olup olmadığını nasıl anlarsın?",
      "Bir model veriye mükemmel uyuyorsa, bu onun doğru mekanizmayı yakaladığını gösterir mi?",
    ],
    cq: [
      "Modelin varsayımları nasıl seçilir ve açıkça yazılır?",
      "Parametreler veriden nasıl tahmin edilir?",
      "Bir modelin öngörü gücü nasıl sınanır?",
    ],
    obj: [
      "Bir sistemi varsayımlarını açıkça yazarak diferansiyel denklemlerle modeller ve modeli türetir.",
      "Modeli sayısal olarak çözer, parametre taraması yapar ve veriyle karşılaştırır.",
      "Modelin yeni bir durumdaki öngörüsünü yazar ve modelin başarısız olacağı koşulları tartışır.",
    ],
    ev: "MODELLEME SIMULASYON TURETME VERI_ANALIZI",
    t: "PROJE",
    lv: 5,
    sc: "L",
    opt: true,
    mis: [
      "Daha fazla parametreli modelin her zaman daha iyi olduğunu sanmak.",
      "Bir modelin yararlı olması için tüm ayrıntıları içermesi gerektiğini düşünmek.",
    ],
    x: [
      "math.ode.numerical:modelin sayısal çözümü",
      "bio.ecology:popülasyon dinamiği modelleri",
      "neuro.comp.hh-model:nöron modelleri klasik bir modelleme projesidir",
      "phys.comp.simulation:fiziksel sistemlerin simülasyonu",
    ],
    ra: ["Popülasyon, salgın, nöron ya da iklim modeli"],
    rel: ["neuro.proj.hh-simulation", "prog.sci.simulation"],
    tags: ["modelleme", "proje", "simülasyon"],
  })
  .o("res.career.academic", "Akademik yollar: yaz okulları, mentorlar ve başvurular", {
    d: "Lise döneminde araştırma deneyimi kazanma yollarını keşfetmek: yaz okulları, araştırma programları, mentor bulma ve başvuru dosyası hazırlama.",
    w: "Doğru program ve mentor, öğrendiklerini gerçek araştırmaya dönüştürmeni hızlandırır; başvuru yazmak da kendi ilgilerini netleştirmeye zorlar.",
    pre: ["res.write.report~s"],
    q: [
      "Bir araştırmacıya e-posta yazıp onun laboratuvarında çalışmak istediğini söyleyeceksin. İlk iki cümlen ne olmalı ki e-posta okunmaya devam etsin?",
      "Bir programın son başvuru tarihini, uygunluk koşullarını ve ücretini hangi kaynaktan doğrularsın?",
    ],
    cq: [
      "Hangi tür programlar ve fırsatlar vardır ve bunlar nasıl araştırılır?",
      "Bir mentora nasıl yaklaşılır?",
      "Güçlü bir başvuru dosyası neleri içerir?",
    ],
    obj: [
      "İlgi alanına uygun programları listeler; tarih, koşul ve ücret bilgilerini resmî kaynaklardan doğrular.",
      "Bir araştırmacıya kısa, özgül ve saygılı bir iletişim e-postası yazar.",
      "Kendi araştırma deneyimini anlatan bir başvuru metni taslağı hazırlar.",
    ],
    ev: "ARASTIRMA_UYGULAMASI ACIKLAMA",
    t: "ARASTIRMA",
    lv: 2,
    sc: "S",
    opt: true,
    src: true,
    mis: [
      "Yalnızca en bilinen programların değerli olduğunu sanmak.",
      "Araştırmacılara öğrenci olarak yazmanın uygunsuz olduğunu düşünmek.",
    ],
    x: [
      "en.app.personal-statement:kişisel deneme ve başvuru metni yazımı",
      "de.culture:Almanca konuşulan ülkelerdeki bilim kurumlarını araştırmak",
      "ja.culture:Japonya'daki bilim geleneği ve programları araştırmak",
    ],
    notes: ["Program adları, tarihleri ve koşulları sık değişir; her bilgiyi resmî kaynaktan doğrula."],
    rel: ["comp.research.science-fair"],
    tags: ["kariyer", "başvuru", "mentor"],
  })
  .done();
