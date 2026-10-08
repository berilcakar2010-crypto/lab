import { builder } from "../dsl";

/**
 * PROGRAMLAMA ekleri — bilgisayar bilimi ilkeleri: veri temsili, sistemler,
 * internet, güvenlik, veritabanı, web, mantık kapıları, toplumsal etki ve proje.
 */
export const PROGRAMMING_PLUS = builder("PROGRAMLAMA")
  // ───────────────────────────── Bilgisayar bilimi / Bilgisayar bilimi ilkeleri
  .unit("Bilgisayar bilimi", "Bilgisayar bilimi ilkeleri")
  .o("cs.data.representation", "Verinin temsili: ikilik, metin, görüntü, sıkıştırma", {
    d: "Sayıların ikilik ve onaltılık tabanda, metnin karakter kodlamalarıyla, görüntü ve sesin örnekleme ve nicemlemeyle bitlere dönüştürülmesi; kayıplı ve kayıpsız sıkıştırma.",
    w: "Bilgisayardaki her şey bit dizisidir; taşma, yuvarlama hatası, bozuk karakterler ve dosya boyutu gibi gündelik sorunların nedeni temsil seçimleridir.",
    pre: ["math.found.exp-log~s", "prog.python.basics~h"],
    q: [
      "8 bit ile kaç farklı sayı yazabilirsin? 255'e 1 eklersen ne olur? Tahmin et, sonra Python'da bir bayt dizisiyle dene.",
      "Bir fotoğrafı sıkıştırınca boyutu onda birine iniyor ama gözün farkı görmüyor. Hangi bilgi atılmış olabilir?",
    ],
    cq: [
      "Tamsayılar ve negatif sayılar (ikiye tümleyen) bitlerle nasıl temsil edilir?",
      "Metin, görüntü ve ses bitlere nasıl dönüştürülür ve çözünürlük ne anlama gelir?",
      "Kayıpsız sıkıştırma neden her dosyayı küçültemez?",
    ],
    obj: [
      "Sayıları ikilik, onluk ve onaltılık tabanlar arasında dönüştürür ve ikiye tümleyen gösterimle işlem yapar",
      "Bir görüntü ya da ses dosyasının boyutunu çözünürlük, renk derinliği ve örnekleme hızından hesaplar",
      "Basit bir kayıpsız sıkıştırma algoritmasını (ör. çalışma uzunluğu kodlaması) kodlar ve sıkıştırma oranını ölçer",
      "Kayıplı ve kayıpsız sıkıştırmanın uygun olduğu durumları gerekçeleriyle ayırt eder",
    ],
    ev: "HESAPLAMA KODLAMA ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Bilgisayar 0.1 gibi ondalık sayıları tam olarak saklar.",
      "Her dosya kayıpsız olarak daha da sıkıştırılabilir.",
      "Bir dosyanın uzantısı içeriğinin ne olduğunu belirler.",
    ],
    x: [
      "math.info.entropy:entropi, kayıpsız sıkıştırmanın ulaşabileceği alt sınırdır",
      "math.found.exp-log:n bit ile 2^n durum; logaritma gereken bit sayısını verir",
      "phys.waves.sound:sesin örneklenmesi ve frekans içeriği",
    ],
    rel: ["prog.sci.numerical-methods", "cs.algo.logic-gates"],
    tags: ["bilgisayar-bilimi", "ikilik", "sikistirma"],
  })
  .o("cs.systems.computer", "Bilgisayar sistemleri: donanım, işletim sistemi", {
    d: "İşlemci, bellek hiyerarşisi ve depolamanın birlikte çalışması, getir-çöz-yürüt döngüsü; işletim sisteminin süreç, bellek ve dosya yönetimi.",
    w: "Bir programın neden yavaş çalıştığını, belleğin neden yetmediğini ya da paralel hesaplamanın neden her zaman hızlandırmadığını anlamak için donanım ve işletim sistemi modelini bilmek gerekir.",
    pre: ["cs.data.representation"],
    q: [
      "Bilgisayarın belleği diskinden binlerce kat hızlıysa neden her şeyi bellekte tutmuyoruz? Bir tasarım önerisi yap ve bedelini bul.",
    ],
    cq: [
      "İşlemci bir komutu nasıl getirir, çözer ve yürütür?",
      "Bellek hiyerarşisi (önbellek, RAM, disk) neden vardır ve performansı nasıl etkiler?",
      "İşletim sistemi birden çok programı aynı anda nasıl çalıştırır?",
    ],
    obj: [
      "Getir-çöz-yürüt döngüsünü basit bir makine dili örneği üzerinde adım adım izler",
      "Bellek hiyerarşisindeki erişim sürelerini karşılaştırıp bir programın performansını tahmin eder",
      "Süreç, iş parçacığı ve zamanlama kavramlarını bir örnekle açıklar",
    ],
    ev: "ACIKLAMA TAHMIN DIAGRAM",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Daha fazla çekirdek her programı orantılı olarak hızlandırır.",
      "RAM ile depolama aynı şeydir.",
    ],
    x: [
      "phys.em.circuits-dc:bilgisayarın donanımı elektrik devrelerinden kurulur",
      "neuro.cog.learning-memory:bilgisayar ve beyin bellek sistemleri arasındaki benzerlik ve farklar",
    ],
    rel: ["cs.algo.logic-gates", "prog.algo.complexity"],
    tags: ["bilgisayar-bilimi", "donanim", "isletim-sistemi"],
  })
  .o("cs.systems.internet", "İnternet nasıl çalışır: paketler, protokoller", {
    d: "Verinin paketlere bölünüp yönlendiriciler üzerinden taşınması; IP adresleri, DNS, TCP/UDP ve HTTP gibi katmanlı protokoller; ağın hataya dayanıklılığı.",
    w: "Web, e-posta ve bulut hizmetlerini kullanırken arka planda olanı açıklar; güvenlik, gizlilik ve web geliştirme konularının ön koşuludur.",
    pre: ["cs.systems.computer"],
    q: [
      "Bir mesajı parçalara bölüp her parçayı farklı yoldan gönderiyorsun. Parçalar karışık sırada gelirse, biri kaybolursa ne yapmalısın? Kendi protokolünü tasarla.",
    ],
    cq: [
      "Paket anahtarlama neden tek bir sabit hattan daha dayanıklıdır?",
      "Protokol katmanları (bağlantı, ağ, taşıma, uygulama) neden ayrıdır?",
      "Bir alan adı yazdığında sayfa ekrana gelene kadar hangi adımlar gerçekleşir?",
    ],
    obj: [
      "Bir web isteğinin DNS sorgusundan sayfa yanıtına kadarki yolculuğunu diyagramla gösterir",
      "TCP ve UDP'nin güvenilirlik ve hız ödünleşimini örneklerle karşılaştırır",
      "Bant genişliği ve gecikmeden bir aktarım süresini hesaplar",
    ],
    ev: "DIAGRAM ACIKLAMA HESAPLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "İnternet ile web aynı şeydir.",
      "Veri, gönderenden alıcıya tek parça hâlinde ve tek bir yoldan gider.",
    ],
    x: [
      "math.discrete.graph-theory:ağ, düğüm ve bağlantılardan oluşan bir graftır; yönlendirme en kısa yol problemidir",
      "media.lit.privacy:verinin ağda nereden geçtiği gizliliği belirler",
    ],
    rel: ["prog.algo.graphs", "cs.security"],
    tags: ["bilgisayar-bilimi", "internet", "ag"],
  })
  .o("cs.security", "Siber güvenlik temelleri ve şifreleme", {
    d: "Gizlilik, bütünlük ve erişilebilirlik ilkeleri; parolalar ve özetleme fonksiyonları, simetrik ve açık anahtarlı şifreleme, sayısal imza ve yaygın saldırı türleri.",
    w: "Kendi verini korumanın ve güvenli yazılım yazmanın temelidir; açık anahtarlı şifreleme, sayılar kuramının en çarpıcı uygulamalarından biridir.",
    pre: ["cs.systems.internet", "math.discrete.number-theory~s"],
    q: [
      "Daha önce hiç görüşmediğin biriyle, herkesin dinlediği bir kanal üzerinden gizli bir anahtar üzerinde anlaşabilir misin? İmkânsız görünüyorsa neden?",
      "Bir site parolanı düz metin olarak saklıyorsa sızıntıda ne olur? Parolayı hiç saklamadan doğrulamak mümkün mü?",
    ],
    cq: [
      "Simetrik şifreleme ile açık anahtarlı şifreleme hangi sorunları çözer?",
      "Özetleme fonksiyonları ve tuzlama parolaları nasıl korur?",
      "Kimlik avı ve sosyal mühendislik neden teknik önlemlerden daha etkili olabilir?",
    ],
    obj: [
      "Sezar ve Vigenère şifrelerini kodlayıp frekans analiziyle kırar",
      "Küçük sayılarla RSA anahtar üretimi, şifreleme ve çözmeyi modüler aritmetikle hesaplar",
      "Bir sistem için tehdit modeli çıkarıp gizlilik-bütünlük-erişilebilirlik açısından önlemler önerir",
      "Bir kimlik avı mesajındaki işaretleri tespit eder",
    ],
    ev: "KODLAMA HESAPLAMA PROBLEM_COZME TRANSFER",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Şifreleme algoritmasını gizli tutmak güvenliği sağlar.",
      "Uzun ama tahmin edilebilir bir parola güvenlidir.",
      "Kilit simgesi (HTTPS) sitenin güvenilir olduğunu gösterir.",
    ],
    x: [
      "math.discrete.number-theory:RSA modüler aritmetik ve asal çarpanlara ayırmanın zorluğuna dayanır",
      "media.lit.privacy:kişisel veri güvenliği ve parola yönetimi",
      "math.prob.basics:parola uzayının büyüklüğü ve kaba kuvvet saldırısı olasılığı",
    ],
    ca: ["Siber güvenlik yarışmalarında (CTF) şifreleme ve ağ görevleri"],
    rel: ["cs.impact.ethics"],
    tags: ["bilgisayar-bilimi", "guvenlik", "sifreleme"],
  })
  .o("cs.impact.ethics", "Bilişimin toplumsal etkileri ve etik", {
    d: "Dijital uçurum, algoritmik yanlılık, otomasyonun işe etkisi, fikri mülkiyet, açık kaynak ve verinin toplanması-kullanılmasıyla ilgili etik ve hukuki sorular.",
    w: "Yazdığın kodun insanları nasıl etkileyeceğini önceden düşünmek, iyi bir mühendisin ve bilinçli bir yurttaşın sorumluluğudur.",
    pre: ["cs.systems.internet~s", "media.lit.privacy~s"],
    q: [
      "Bir işe alım algoritması geçmişteki işe alım kararlarından öğreniyor. Geçmiş kararlar yanlıysa algoritma 'tarafsız' olabilir mi?",
    ],
    cq: [
      "Bir teknolojinin yararları ve zararları toplumun farklı kesimlerine nasıl dağılır?",
      "Algoritmik yanlılık veriden, tasarımdan ve kullanımdan nasıl doğar?",
      "Telif, lisans ve açık kaynak yazılımın paylaşımını nasıl düzenler?",
    ],
    obj: [
      "Bir bilişim yeniliğinin farklı paydaşlar üzerindeki etkisini bir etki tablosuyla çözümler",
      "Bir algoritmik yanlılık örneğinde yanlılığın kaynağını belirler ve azaltma önerileri sunar",
      "Farklı yazılım lisanslarının kullanım ve paylaşım koşullarını karşılaştırır",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "S",
    mis: [
      "Algoritmalar matematik olduğu için tarafsızdır.",
      "İnternette bulunan her şey serbestçe kullanılabilir.",
    ],
    x: [
      "gk.phil.ethics:etik kuramlarla teknoloji kararlarını değerlendirmek",
      "media.lit.algorithms:öneri sistemleri ve filtre balonları",
      "res.ethics:veri toplama ve onam",
    ],
    rel: ["cs.security", "prog.ml.basics"],
    tags: ["bilgisayar-bilimi", "etik", "toplum"],
  })
  .o("cs.data.databases", "Veritabanları ve SQL'e giriş", {
    d: "Verinin tablolar, anahtarlar ve ilişkilerle düzenlenmesi; SQL ile seçme, süzme, gruplama ve birleştirme sorguları; veri bütünlüğü.",
    w: "Uygulamalardan bilimsel veri setlerine kadar yapılandırılmış veri her yerde ilişkisel tablolarla saklanır; SQL, pandas'taki düşünce biçimini başka bir dille pekiştirir.",
    pre: ["prog.python.data-structures"],
    q: [
      "Öğrencileri ve aldıkları dersleri tek bir tabloda tutarsan bir öğrencinin adı değiştiğinde ne olur? Bu sorunu çözmek için tabloyu nasıl bölersin?",
    ],
    cq: [
      "Birincil ve yabancı anahtar ilişkileri nasıl kurar?",
      "SELECT, WHERE, GROUP BY ve JOIN sorguları neyi hesaplar?",
      "Veri tekrarı neden tutarsızlığa yol açar?",
    ],
    obj: [
      "Bir problem için tablolar, anahtarlar ve ilişkilerden oluşan basit bir şema tasarlar",
      "Süzme, gruplama ve birleştirme içeren SQL sorguları yazıp sonuçlarını doğrular",
      "Aynı sorguyu SQL ve pandas ile yazıp karşılaştırır",
    ],
    ev: "KODLAMA DIAGRAM VERI_ANALIZI",
    t: "KODLAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Veritabanı büyük bir elektronik tablodur.",
      "JOIN her zaman satır sayısını azaltır.",
    ],
    x: [
      "math.found.logic:SQL sorguları küme işlemleri ve yüklem mantığıdır",
      "res.data.management:araştırma verisini düzenli ve sorgulanabilir saklamak",
    ],
    rel: ["prog.python.pandas"],
    tags: ["bilgisayar-bilimi", "veritabani", "sql"],
  })
  .o("cs.web.basics", "Web temelleri: HTML, CSS, JavaScript", {
    d: "Web sayfalarının yapısını HTML, görünümünü CSS, davranışını JavaScript ile oluşturma; tarayıcının sayfayı nasıl işlediği ve erişilebilirlik ilkeleri.",
    w: "Projeni, verini ya da etkileşimli bir simülasyonu herkesle paylaşmanın en doğrudan yoludur; içerik, sunum ve davranışı ayırma fikri iyi yazılım tasarımının örneğidir.",
    pre: ["cs.systems.internet~s", "prog.python.basics"],
    q: [
      "Bir web sayfasında sağ tıklayıp 'kaynağı görüntüle' dersen ne bulmayı beklersin? Sayfanın yalnızca metinden oluşan bir dosyayla nasıl bu kadar zengin görünebileceğini tahmin et.",
    ],
    cq: [
      "HTML, CSS ve JavaScript'in sorumlulukları neden ayrılır?",
      "Tarayıcı bir sayfayı nasıl yükler ve DOM'u nasıl oluşturur?",
      "Bir sayfayı erişilebilir yapan nedir?",
    ],
    obj: [
      "Anlamsal HTML ile yapılandırılmış, CSS ile biçimlendirilmiş bir sayfa yazar",
      "JavaScript ile kullanıcı etkileşimine yanıt veren basit bir işlev ekler",
      "Bir sayfayı erişilebilirlik açısından (alternatif metin, kontrast, klavye kullanımı) denetler ve düzeltir",
    ],
    ev: "KODLAMA PROBLEM_COZME TRANSFER",
    t: "KODLAMA",
    lv: 2,
    sc: "M",
    mis: [
      "HTML bir programlama dilidir ve görünümü belirler.",
      "JavaScript ile Java aynı dildir.",
    ],
    x: [
      "art.elements:sayfa tasarımında vurgu, hiyerarşi ve kontrast",
      "media.lit.production:bilim iletişimi için etkileşimli içerik üretmek",
    ],
    rel: ["cs.proj.app"],
    tags: ["bilgisayar-bilimi", "web", "javascript"],
  })
  .o("cs.algo.logic-gates", "Mantık kapıları ve Boole cebiri", {
    d: "VE, VEYA, DEĞİL, XOR kapıları, doğruluk tabloları, Boole cebiri sadeleştirmesi ve kapılardan toplayıcı gibi aritmetik devreler kurma.",
    w: "Yazılım ile donanım arasındaki köprüdür: bilgisayarın 'düşünmesi' sonunda kapı devrelerine indirgenir; Boole cebiri mantık ve küme kuramıyla aynı yapıdadır.",
    pre: ["math.found.logic", "cs.data.representation"],
    q: [
      "Yalnızca NAND kapıları kullanarak bir DEĞİL, bir VE ve bir VEYA kapısı kurabilir misin? Dene ve bir bilgisayarın tek tür kapıdan yapılabileceği iddiasını değerlendir.",
    ],
    cq: [
      "Bir doğruluk tablosundan Boole ifadesine ve devreye nasıl geçilir?",
      "De Morgan yasaları devre sadeleştirmede nasıl kullanılır?",
      "İki ikilik sayıyı toplayan bir devre nasıl kurulur?",
    ],
    obj: [
      "Bir doğruluk tablosundan Boole ifadesi yazar ve ifadeyi cebirsel olarak sadeleştirir",
      "De Morgan yasalarını doğruluk tablosuyla ispatlar",
      "Yarım ve tam toplayıcıyı kapılardan tasarlayıp çok bitli toplamaya genişletir",
      "Bir devreyi bir simülatörde ya da kodla sınar",
    ],
    ev: "ISPAT DIAGRAM PROBLEM_COZME SIMULASYON",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "XOR, VEYA ile aynıdır.",
      "Bilgisayarın aritmetiği mantık işlemlerinden ayrı, özel bir donanım gerektirir.",
    ],
    x: [
      "math.found.logic:önermeler mantığı ve küme işlemleri Boole cebiriyle aynı yapıdadır",
      "phys.em.circuits-dc:kapılar transistörlü elektrik devreleriyle gerçekleştirilir",
      "neuro.comp.lif:eşik nöronları mantık kapısı gibi davranabilir",
    ],
    rel: ["cs.systems.computer"],
    tags: ["bilgisayar-bilimi", "mantik", "boole"],
  })
  .o("cs.proj.app", "Proje: Küçük bir uygulama geliştir", {
    d: "Gerçek bir kullanıcının gerçek bir sorununu çözen küçük bir uygulamayı (komut satırı, web ya da veri aracı) gereksinim, tasarım, uygulama, test ve sunum adımlarıyla geliştirme.",
    w: "Ayrı ayrı öğrenilen programlama becerilerini kullanıcıya hizmet eden bütün bir ürüne dönüştürür; portfolyo ve başvurularda somut bir kanıt oluşturur.",
    pre: ["prog.python.functions", "cs.web.basics~s", "prog.tools.git~s"],
    q: [
      "Çevrende her hafta tekrarlanan, sıkıcı ya da hataya açık bir iş var mı? Onu otomatikleştiren bir programın en küçük yararlı sürümü ne olurdu?",
    ],
    cq: [
      "Bir kullanıcı sorunu nasıl ölçülebilir gereksinimlere dönüştürülür?",
      "Kapsamı küçük tutup çalışan bir ilk sürüme nasıl ulaşılır?",
      "Uygulamanın doğru çalıştığı ve kullanılabilir olduğu nasıl sınanır?",
    ],
    obj: [
      "Bir kullanıcıyla görüşüp gereksinimleri ve başarı ölçütlerini yazar",
      "Uygulamayı sürüm kontrolüyle, küçük ve test edilmiş adımlarla geliştirir",
      "Uygulamayı en az bir gerçek kullanıcıyla dener ve geri bildirimle iyileştirir",
      "Projeyi bir README ve kısa bir tanıtımla belgeler",
    ],
    ev: "KODLAMA PROBLEM_COZME TRANSFER ARASTIRMA_UYGULAMASI",
    t: "PROJE",
    lv: 3,
    sc: "L",
    mis: [
      "Proje, ilk günden tüm özellikleriyle tasarlanmalıdır.",
      "Kod çalışıyorsa proje bitmiştir; belge ve test gereksizdir.",
    ],
    x: [
      "res.data.management:projeyi belgelemek ve tekrar üretilebilir kılmak",
      "write.compose.revision:taslak-geri bildirim-yeniden yazma döngüsü yazılımda da geçerlidir",
      "comp.research.science-fair:yazılım projesini yarışmada sunmak",
    ],
    ca: ["Yazılım ve uygulama geliştirme yarışmaları"],
    rel: ["cs.web.basics", "prog.tools.git"],
    tags: ["proje", "uygulama", "yazilim"],
  })
  .done();
