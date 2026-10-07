import { builder } from "../dsl";

export const PROGRAMMING = builder("PROGRAMLAMA")
  .unit("Python", "Temeller")
  .o("prog.python.basics", "Python temelleri: değişken, koşul, döngü", {
    d: "Değişkenler, temel veri türleri, koşullu ifadeler ve döngülerle küçük ama eksiksiz programlar yazmak.",
    w: "Bilimsel hesaplama, veri analizi ve nöron simülasyonlarının hepsi bu yapı taşlarıyla kurulur; bir formülü elle değil binlerce kez bilgisayara hesaplatabilmenin ilk adımıdır.",
    pre: ["math.found.algebra~h"],
    q: [
      "x = x + 1 matematikte çelişkidir ama programda her gün yazılır. Bu satır bilgisayara tam olarak ne söylüyor?",
      "1'den 1000'e kadar 3'e ya da 5'e bölünen sayıların toplamını elle bulmak ne kadar sürer? Bunu üç satırlık bir döngüyle nasıl yaptırırsın?",
    ],
    cq: [
      "Bir değişken bellekte neyi temsil eder ve atama ne zaman olur?",
      "Koşul ve döngü bir hesaplamanın akışını nasıl değiştirir?",
      "int, float, str ve bool türleri birbirleriyle nasıl etkileşir?",
    ],
    obj: [
      "Bir sözel problemi değişken, koşul ve döngü kullanan çalışan bir programa dönüştürür.",
      "Bir döngünün kaç kez döneceğini çalıştırmadan önce tahmin eder ve izleme tablosuyla doğrular.",
      "Tür hatalarını ve sonsuz döngüleri hata mesajından yola çıkarak ayırt eder ve düzeltir.",
    ],
    ev: "KODLAMA TAHMIN PROBLEM_COZME",
    t: "BECERI",
    lv: 1,
    sc: "M",
    mis: [
      "= işaretinin matematikteki eşitlikle aynı anlama geldiğini sanmak; oysa sağdaki değer soldaki isme atanır.",
      "0.1 + 0.2 == 0.3 ifadesinin her zaman True döneceğini düşünmek.",
      "range(1, 10)'un 10'u da içerdiğini varsaymak.",
    ],
    x: [
      "math.found.algebra:değişken kavramı ortak ama atama ile denklem farklıdır",
      "math.found.sequences:dizilerin terimlerini ve kısmi toplamlarını döngüyle hesaplar",
    ],
    rel: ["prog.python.functions", "prog.python.data-structures"],
    tags: ["python", "temel", "döngü"],
  })
  .o("prog.python.functions", "Fonksiyonlar ve modülerlik", {
    d: "Kodu parametre alan, değer döndüren, tekrar kullanılabilir fonksiyonlara ve modüllere bölmek; kapsam ve yan etki kavramları.",
    w: "Bir simülasyonun her adımını ayrı fonksiyon olarak yazmak hatayı yerelleştirir, test etmeyi mümkün kılar ve aynı kodu farklı deneylerde yeniden kullanmanı sağlar.",
    pre: ["prog.python.basics"],
    q: [
      "Bir fonksiyonun içinde değiştirdiğin bir listenin, fonksiyon bittikten sonra dışarıda da değiştiğini görürsün; ama bir sayıyı değiştirdiğinde değişmez. Neden?",
      "Matematikteki f(x) = x² ile Python'daki def f(x): return x**2 arasında ne fark olabilir? Biri 'yan etki' yaratabilir mi?",
    ],
    cq: [
      "Bir işi ne zaman ayrı bir fonksiyona ayırmalıyım?",
      "Yerel ve global kapsam arasındaki fark programın davranışını nasıl etkiler?",
      "Saf fonksiyon ile yan etkili fonksiyon nasıl ayırt edilir?",
    ],
    obj: [
      "Tekrarlanan kod parçalarını parametreli fonksiyonlara dönüştürür ve anlamlı adlandırır.",
      "Bir fonksiyon çağrısının değişkenleri nasıl etkileyeceğini çalıştırmadan önce tahmin eder.",
      "Kodunu birden fazla modüle böler ve import ile bir araya getirir.",
    ],
    ev: "KODLAMA TAHMIN ACIKLAMA",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "print ile return'ün aynı şey olduğunu sanmak.",
      "Varsayılan argüman olarak liste vermenin her çağrıda yeni liste yaratacağını varsaymak.",
    ],
    x: ["math.found.functions:matematiksel fonksiyon kavramının programdaki karşılığı; saf fonksiyon matematiksel fonksiyona en yakın olandır"],
    rel: ["prog.python.files-debug", "prog.algo.recursion"],
    tags: ["python", "fonksiyon", "modülerlik"],
  })
  .o("prog.python.data-structures", "Veri yapıları: liste, sözlük, küme", {
    d: "Liste, demet, sözlük ve küme yapılarını, aralarındaki performans ve kullanım farklarını bilerek seçmek.",
    w: "Doğru veri yapısı bir programı saatlerden saniyelere indirebilir; graf algoritmaları, veri analizi ve deney kayıtlarının tamamı bu yapıların üzerine kurulur.",
    pre: ["prog.python.basics"],
    q: [
      "Bir milyon öğrenci numarası arasında bir numaranın olup olmadığını listede mi yoksa kümede mi daha hızlı ararsın? Tahmin et, sonra ölç.",
      "a = [1, 2, 3]; b = a; b.append(4) dedikten sonra a'nın değeri ne olur?",
    ],
    cq: [
      "Hangi soruya hangi veri yapısı en iyi cevap verir?",
      "Değiştirilebilir ve değiştirilemez nesneler arasındaki fark neden önemlidir?",
      "Sözlükler anahtar üzerinden aramayı nasıl hızlı yapar?",
    ],
    obj: [
      "Bir problem için uygun veri yapısını seçer ve seçimini zaman maliyetiyle gerekçelendirir.",
      "İç içe sözlük ve listelerle gerçekçi bir veri kaydını modeller.",
      "Takma ad (aliasing) kaynaklı hataları ayırt eder ve kopyalama ile giderir.",
    ],
    ev: "KODLAMA TAHMIN PROBLEM_COZME",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "b = a ifadesinin listenin bir kopyasını oluşturduğunu sanmak.",
      "Sözlük ve kümelerde elemanların her zaman eklendiği sırayla anlamlı bir düzen taşıdığını varsaymak; kümelerde sıra yoktur.",
    ],
    x: [
      "math.found.logic:küme işlemleri (birleşim, kesişim, fark) Python kümelerinde doğrudan karşılık bulur",
      "math.discrete.graph-theory:komşuluk listesi bir sözlük-liste yapısıdır",
    ],
    rel: ["prog.algo.complexity", "prog.python.numpy"],
    vs: ["prog.python.numpy"],
    tags: ["python", "veri-yapısı"],
  })
  .o("prog.python.oop", "Nesne yönelimli programlama", {
    d: "Sınıf, nesne, kalıtım ve kapsülleme ile durumu ve davranışı birlikte paketlemek.",
    w: "Bir nöron, bir parçacık ya da bir deney düzeneği gibi durum taşıyan varlıkları modellemek için doğal bir dildir; büyük bilimsel kütüphanelerin çoğu bu biçimde yazılır.",
    pre: ["prog.python.functions", "prog.python.data-structures"],
    q: [
      "Bir simülasyonda 1000 nöronun her birinin kendi membran potansiyeli var. Bunları ayrı listelerde mi tutarsın yoksa her nöronu bir 'nesne' mi yaparsın? Her birinin bedeli ne?",
    ],
    cq: [
      "Sınıf ile nesne arasındaki ilişki nedir?",
      "Kalıtım ne zaman yararlı, ne zaman gereksiz karmaşıklıktır?",
    ],
    obj: [
      "Durum ve davranış içeren bir varlığı sınıf olarak tasarlar ve kodlar.",
      "Kalıtım ile bileşim (composition) arasında bir tasarım tercihini gerekçelendirir.",
      "Basit bir parçacık ya da nöron simülasyonunu nesnelerle yeniden yapılandırır.",
    ],
    ev: "KODLAMA MODELLEME ACIKLAMA",
    t: "BECERI",
    lv: 3,
    sc: "M",
    opt: true,
    mis: [
      "Her şeyi sınıf yapmanın kodu her zaman daha iyi yapacağını düşünmek.",
      "self parametresinin sihirli bir anahtar kelime olduğunu sanmak; yalnızca nesnenin kendisine verilen addır.",
    ],
    x: [
      "neuro.comp.lif:her nöron bir nesne olarak durum (V) ve güncelleme kuralı taşır",
      "phys.comp.simulation:parçacık sistemlerini nesnelerle modellemek",
    ],
    rel: ["prog.python.functions"],
    tags: ["python", "nesne", "tasarım"],
  })
  .o("prog.python.files-debug", "Hata ayıklama, test ve dosyalar", {
    d: "Hata mesajlarını okumak, sistematik hata ayıklamak, birim testleri yazmak ve dosyalardan veri okuyup yazmak.",
    w: "Bilimsel kodda sessiz hata yanlış bir sonuç yayımlamak demektir; test ve sistematik hata ayıklama, sonuçlarına güvenebilmenin ön koşuludur.",
    pre: ["prog.python.functions"],
    q: [
      "Kodun hata vermeden çalıştı ve bir sayı üretti. Bu sayının doğru olduğunu nasıl bilirsin?",
      "Bir hatayı bulmak için kodun ortasına rastgele print eklemek yerine ikili arama gibi bir strateji nasıl uygulanabilir?",
    ],
    cq: [
      "Bir hata mesajı (traceback) nasıl okunur?",
      "İyi bir test hangi durumları kapsamalıdır?",
      "Dosyadan okunan verinin biçimi nasıl doğrulanır?",
    ],
    obj: [
      "Bir traceback'i okuyup hatanın kaynağını satır düzeyinde bulur.",
      "Bir fonksiyon için sınır durumlarını da kapsayan birim testleri yazar.",
      "Bir CSV ya da metin dosyasını okur, işler ve sonucu yeni bir dosyaya yazar.",
      "Hipotez kur-test et döngüsüyle bir hatayı sistematik olarak daraltır.",
    ],
    ev: "KODLAMA PROBLEM_COZME DENEY",
    t: "PRATIK",
    lv: 2,
    sc: "M",
    mis: [
      "Programın hata vermeden çalışmasının doğru çalıştığı anlamına geldiğini sanmak.",
      "Testlerin yalnızca büyük yazılım projeleri için gerekli olduğunu düşünmek.",
    ],
    x: [
      "res.method.hypothesis:hata ayıklama, hipotez kurup test etmenin küçük ölçekli bir uygulamasıdır",
      "phys.lab.experimental:bilinen sonuçla karşılaştırarak doğrulama, deneysel kalibrasyona benzer",
    ],
    rel: ["prog.tools.reproducible", "prog.tools.git"],
    tags: ["test", "hata-ayıklama", "dosya"],
  })

  .unit("Algoritmalar", "Algoritmalar")
  .o("prog.algo.complexity", "Algoritma karmaşıklığı (Big-O)", {
    d: "Bir algoritmanın çalışma süresi ve bellek kullanımının girdi boyutuyla nasıl büyüdüğünü asimptotik olarak çözümlemek.",
    w: "Bir yöntemin 100 veri noktasında değil, 10 milyon spike kaydında da çalışıp çalışmayacağını önceden söylemeni sağlar; yarışma problemlerinde doğru fikri seçmenin ilk filtresidir.",
    pre: ["prog.python.data-structures", "math.found.exp-log~s"],
    q: [
      "Girdi boyutunu iki katına çıkarınca bir algoritmanın süresi dört katına çıkıyor. Algoritma hakkında ne söyleyebilirsin?",
      "O(n log n) ile O(n²) arasındaki fark n = 10 için önemsizdir. n = 10⁶ için kaç kat fark eder? Tahmin et.",
    ],
    cq: [
      "Big-O neyi ölçer, neyi göz ardı eder?",
      "İç içe döngüler ve yarıya bölme karmaşıklığı nasıl etkiler?",
      "En kötü, ortalama ve en iyi durum neden ayrı ayrı düşünülür?",
    ],
    obj: [
      "Verilen bir kodun zaman karmaşıklığını döngü yapısından türetir.",
      "Ölçülen çalışma sürelerini log-log grafikte yorumlayıp karmaşıklık sınıfını tahmin eder.",
      "Aynı problem için iki algoritmayı karmaşıklıklarına göre karşılaştırır ve seçer.",
    ],
    ev: "TURETME TAHMIN VERI_ANALIZI",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "O(n) bir algoritmanın her zaman O(n²) bir algoritmadan hızlı olduğunu sanmak; küçük n'de sabitler baskın olabilir.",
      "Big-O'nun saniye cinsinden süreyi verdiğini düşünmek.",
    ],
    x: [
      "math.found.exp-log:logaritmik ve üstel büyüme karmaşıklık sınıflarının dilidir",
      "math.calc.lhopital:fonksiyonların büyüme hızlarını limitle karşılaştırmak",
      "math.discrete.recurrences:özyinelemeli algoritmaların süresi rekürans bağıntısıyla ifade edilir",
    ],
    ca: ["Yarışmada girdi sınırlarından izin verilen karmaşıklığı geriye doğru çıkarmak"],
    rel: ["prog.algo.sorting-search"],
    tags: ["algoritma", "karmaşıklık", "big-o"],
  })
  .o("prog.algo.sorting-search", "Sıralama ve arama", {
    d: "Seçme, ekleme, birleştirme ve hızlı sıralama algoritmaları ile doğrusal ve ikili arama; doğruluk ve verim analizi.",
    w: "Sıralama, sayısız algoritmanın ön adımıdır; ikili arama ise sıralı veride ve 'cevap üzerinde arama' tekniğinde yarışma ve bilimsel hesaplamada sürekli karşına çıkar.",
    pre: ["prog.algo.complexity"],
    q: [
      "Bir telefon rehberinde bir ismi en fazla kaç bakışta bulursun? Rehber 1 milyon kişilik olsa?",
      "Karşılaştırmaya dayalı hiçbir sıralama algoritması n log n'den hızlı olamaz. Bu iddia sana neden şaşırtıcı ya da doğal geliyor?",
    ],
    cq: [
      "Böl-yönet sıralamayı nasıl hızlandırır?",
      "İkili arama hangi koşulda doğru çalışır?",
      "Bir algoritmanın doğruluğu döngü değişmezi ile nasıl gösterilir?",
    ],
    obj: [
      "Birleştirme sıralamasını ve ikili aramayı sıfırdan kodlar ve test eder.",
      "İkili aramanın doğruluğunu bir döngü değişmeziyle gerekçelendirir.",
      "Sıralama algoritmalarının farklı girdilerdeki çalışma süresini ölçer ve kuramla karşılaştırır.",
    ],
    ev: "KODLAMA ISPAT VERI_ANALIZI",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "İkili aramanın sıralanmamış veride de çalışacağını sanmak.",
      "Hızlı sıralamanın her girdide O(n log n) olduğunu düşünmek.",
    ],
    x: [
      "math.found.proof-techniques:döngü değişmezi tümevarımla ispatın programdaki karşılığıdır",
      "prog.sci.numerical-methods:ikiye bölme (bisection) kök bulma, ikili aramanın sürekli versiyonudur",
    ],
    ca: ["Cevap üzerinde ikili arama, sıralama + açgözlü yaklaşım"],
    rel: ["prog.algo.recursion"],
    tags: ["sıralama", "arama", "algoritma"],
  })
  .o("prog.algo.recursion", "Özyineleme ve böl-yönet", {
    d: "Bir problemi kendisinin daha küçük örneklerine indirgeyerek çözmek; temel durum, çağrı yığını ve böl-yönet stratejisi.",
    w: "Ağaç ve graf gezintisi, dinamik programlama ve birçok matematiksel tanım özyinelemelidir; tümevarımla düşünmeyi koda dökmenin yoludur.",
    pre: ["prog.python.functions", "math.discrete.recurrences~s"],
    q: [
      "Hanoi kulesinde 64 disk var. Her saniye bir disk taşırsan ne zaman bitirirsin? Önce sezgisel tahmin et.",
      "fib(40)'ı özyinelemeli olarak hesaplayan saf kod neden bu kadar yavaş? Kaç kez fib(2) çağrılıyor?",
    ],
    cq: [
      "Her özyinelemeli çözüm için gereken iki parça nedir?",
      "Özyineleme ile tümevarım ispatı arasında nasıl bir paralellik vardır?",
      "Böl-yönet algoritmalarının süresi nasıl hesaplanır?",
    ],
    obj: [
      "Bir problemi özyinelemeli olarak formüle eder ve temel durumu doğru belirler.",
      "Özyinelemeli bir algoritmanın süresini rekürans bağıntısı kurup türetir.",
      "Özyinelemeli bir çözümün doğruluğunu tümevarımla gerekçelendirir.",
    ],
    ev: "KODLAMA TURETME ISPAT",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Özyinelemenin her zaman döngüden daha yavaş ya da daha 'zarif' olduğunu düşünmek.",
      "Temel durumun yalnızca bir güvenlik önlemi olduğunu sanmak; algoritmanın doğruluğunun parçasıdır.",
    ],
    x: [
      "math.found.proof-techniques:özyinelemeli düşünme tümevarım ispatının hesaplamadaki ikizidir",
      "math.discrete.recurrences:çalışma süresi ve çıktılar rekürans bağıntısıyla ifade edilir",
    ],
    ca: ["Geri izleme (backtracking) ile arama problemleri"],
    rel: ["prog.algo.dp", "prog.algo.graphs"],
    tags: ["özyineleme", "böl-yönet"],
  })
  .o("prog.algo.graphs", "Graf algoritmaları: BFS, DFS, en kısa yol", {
    d: "Grafları temsil etmek; genişlik ve derinlik öncelikli arama, bağlantılı bileşenler ve Dijkstra ile en kısa yol.",
    w: "Sosyal ağlardan bağlantı haritası (connectome) analizine, labirent çözmekten yol planlamaya kadar ilişki yapısı olan her veri bir graftır.",
    pre: ["prog.python.data-structures", "math.discrete.graph-theory", "prog.algo.recursion~s"],
    q: [
      "Bir labirentte çıkışa giden en kısa yolu bulmak için hangi kapıları hangi sırayla açmalısın? 'Önce derine in' mi, 'önce etrafa bak' mı?",
      "Kenar ağırlıkları negatif olabilirse en kısa yol fikri neden bozulabilir?",
    ],
    cq: [
      "BFS ile DFS hangi soruları farklı biçimde yanıtlar?",
      "Dijkstra algoritması neden doğru çalışır?",
      "Komşuluk matrisi ile komşuluk listesi arasında nasıl seçim yapılır?",
    ],
    obj: [
      "Bir problemi graf olarak modeller ve uygun temsil seçer.",
      "BFS, DFS ve Dijkstra'yı kodlar ve küçük graflarda adım adım izler.",
      "Dijkstra'nın doğruluğunu açgözlü seçim argümanıyla gerekçelendirir.",
    ],
    ev: "KODLAMA MODELLEME ISPAT",
    t: "BECERI",
    lv: 4,
    sc: "L",
    mis: [
      "BFS'in ağırlıklı graflarda da en kısa yolu bulduğunu sanmak.",
      "DFS'in her zaman özyinelemeli yazılması gerektiğini düşünmek.",
    ],
    x: [
      "math.discrete.graph-theory:graf kuramının algoritmik yüzü",
      "neuro.comp.networks:nöron bağlantı ağları graf olarak çözümlenir",
      "math.prob.markov:geçiş grafı üzerinde erişilebilirlik ve rastgele yürüyüş",
    ],
    ca: ["En kısa yol, bileşen sayma ve topolojik sıralama soruları"],
    rel: ["prog.algo.dp"],
    tags: ["graf", "bfs", "dfs", "dijkstra"],
  })
  .o("prog.algo.dp", "Dinamik programlama", {
    d: "Örtüşen alt problemleri bir kez çözüp saklayarak üstel aramaları polinom zamana indirmek; durum, geçiş ve tablo tasarımı.",
    w: "Dizilim hizalama, en uygun karar dizileri ve pekiştirmeli öğrenmedeki Bellman denklemi aynı fikre dayanır; yarışma programlamasının en sık çıkan tekniklerinden biridir.",
    pre: ["prog.algo.recursion"],
    q: [
      "1, 3 ve 4 liralık madeni paralarla 6 lirayı en az kaç parayla ödersin? Açgözlü yaklaşım (önce en büyüğünü al) burada doğru cevabı verir mi?",
      "fib(40)'ı bir saniyenin binde birinde hesaplamak için tek bir sözlük yeterlidir. Nasıl?",
    ],
    cq: [
      "Bir problemin dinamik programlamaya uygun olduğunu nasıl anlarım?",
      "Durum ve geçiş denklemi nasıl tanımlanır?",
      "Yukarıdan aşağı (memoization) ile aşağıdan yukarı (tablo) yaklaşımı nasıl karşılaştırılır?",
    ],
    obj: [
      "Bir problem için durum tanımını ve geçiş bağıntısını türetir.",
      "Aynı problemi hem memoization hem tablo yöntemiyle kodlar.",
      "Bir DP çözümünün zaman ve bellek karmaşıklığını hesaplar.",
    ],
    ev: "TURETME KODLAMA PROBLEM_COZME",
    t: "BECERI",
    lv: 4,
    sc: "L",
    mis: [
      "Açgözlü seçimin her optimizasyon problemi için yeterli olduğunu düşünmek.",
      "DP'nin bir algoritma değil belirli bir problem türü olduğunu sanmak; o bir tasarım tekniğidir.",
    ],
    x: [
      "neuro.comp.reinforcement:Bellman denklemi ve değer fonksiyonu dinamik programlamanın doğrudan uygulamasıdır",
      "math.prob.counting:sayma problemlerinin çoğu rekürans + tablo ile çözülür",
      "bio.evolution:DNA dizilim hizalama (sequence alignment) bir DP problemidir",
    ],
    ca: ["Sırt çantası, en uzun ortak alt dizi, yol sayma problemleri"],
    rel: ["prog.comp.competitive"],
    tags: ["dinamik-programlama", "algoritma"],
  })

  .unit("Bilimsel hesaplama", "Bilimsel hesaplama")
  .o("prog.python.numpy", "NumPy ile bilimsel hesaplama", {
    d: "Çok boyutlu diziler, vektörleştirilmiş işlemler, yayınlama (broadcasting) ve doğrusal cebir fonksiyonlarıyla hızlı sayısal hesaplama.",
    w: "Python'da neredeyse tüm bilimsel kod NumPy dizileri üzerine kuruludur; döngüyü vektör işlemine çevirmek bir simülasyonu onlarca kat hızlandırabilir.",
    pre: ["prog.python.data-structures", "math.linalg.matrices~s"],
    q: [
      "Bir milyon sayının karesini Python döngüsüyle ve NumPy ile almayı karşılaştır. Sence fark kaç kat olur?",
      "Şekli (3, 1) olan bir diziyle şekli (1, 4) olan bir diziyi topladığında sonuç ne şekilde olur? Önce tahmin et.",
    ],
    cq: [
      "Vektörleştirme neden bu kadar hızlıdır?",
      "Yayınlama kuralları nasıl çalışır?",
      "Bir matris işlemini NumPy'da nasıl ifade ederim?",
    ],
    obj: [
      "Döngülü bir hesaplamayı vektörleştirilmiş NumPy koduna dönüştürür ve hızlanmayı ölçer.",
      "Yayınlama ile oluşacak dizi şeklini önceden hesaplar.",
      "Matris çarpımı, çözüm ve özdeğer hesaplarını NumPy ile yapar ve sonucu elle küçük bir örnekte doğrular.",
    ],
    ev: "KODLAMA TAHMIN HESAPLAMA",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "A * B'nin matris çarpımı olduğunu sanmak; eleman eleman çarpımdır, matris çarpımı A @ B'dir.",
      "Dilimlemenin (slicing) her zaman kopya oluşturduğunu düşünmek; çoğu zaman görünüm (view) döner.",
    ],
    x: [
      "math.linalg.matrices:matris işlemlerinin sayısal karşılığı",
      "math.linalg.eigen:özdeğer ve özvektörleri sayısal olarak hesaplamak",
      "neuro.methods.data-analysis:nöral kayıtlar NumPy dizileri olarak işlenir",
    ],
    rel: ["prog.python.plotting", "prog.python.pandas"],
    vs: ["prog.python.data-structures"],
    tags: ["numpy", "vektörleştirme", "dizi"],
  })
  .o("prog.python.plotting", "Matplotlib ile görselleştirme", {
    d: "Çizgi, saçılım, histogram ve çok panelli grafikler oluşturmak; eksen, ölçek, etiket ve renk seçimlerini bilinçli yapmak.",
    w: "Bir sonucu görmeden ona güvenemezsin; grafik hem hata ayıklama aracı hem de bulguyu başkasına anlatmanın ana yoludur.",
    pre: ["prog.python.numpy"],
    q: [
      "Aynı veri doğrusal eksende üstel, log eksende düz bir çizgi gibi görünüyor. Hangi grafik 'yanlış'?",
      "Bir grafikteki y ekseni sıfırdan başlamıyorsa izleyicinin aklında ne değişir?",
    ],
    cq: [
      "Hangi veri türü için hangi grafik türü uygundur?",
      "Log ölçek ne zaman gerekir?",
      "Bir grafiği tek başına okunabilir yapan nedir?",
    ],
    obj: [
      "Bir simülasyonun çıktısını eksen etiketleri ve birimleriyle eksiksiz bir grafiğe döker.",
      "Üstel ve kuvvet yasası ilişkilerini uygun log ölçekle ayırt eder.",
      "Çok panelli bir şekil oluşturup panelleri ortak bir anlatıya bağlar.",
    ],
    ev: "KODLAMA YORUMLAMA DIAGRAM",
    t: "BECERI",
    lv: 2,
    sc: "S",
    mis: [
      "Grafiğin yalnızca sonuç sunumu için olduğunu sanmak; keşif ve hata ayıklamada da temel araçtır.",
      "Daha çok renk ve efektin daha iyi grafik demek olduğunu düşünmek.",
    ],
    x: [
      "math.stat.descriptive:dağılımları ve ilişkileri görsel olarak betimlemek",
      "phys.lab.experimental:ölçüm grafiği ve hata çubukları çizmek",
      "media.lit.stats-in-news:yanıltıcı grafiklerin nasıl üretildiğini kendi elinle görmek",
    ],
    rel: ["res.data.visualization"],
    tags: ["matplotlib", "grafik", "görselleştirme"],
  })
  .o("prog.python.pandas", "Pandas ile veri işleme", {
    d: "Tablo biçimindeki veriyi DataFrame olarak okumak, temizlemek, filtrelemek, gruplamak ve birleştirmek.",
    w: "Gerçek veri dağınıktır; eksik değerler, yanlış türler ve tutarsız etiketlerle başa çıkmak analizin çoğunu oluşturur.",
    pre: ["prog.python.numpy"],
    q: [
      "Bir tabloda yaş sütununda '17', 17 ve 'on yedi' yazıyor. Ortalamayı hesaplamadan önce neler yapmalısın?",
      "Eksik değerleri silmek mi, doldurmak mı? Her birinin sonucu nasıl çarpıtabileceğini tahmin et.",
    ],
    cq: [
      "Bir veri setini analiz etmeden önce hangi kontroller yapılmalıdır?",
      "groupby işlemi hangi soruyu yanıtlar?",
      "İki tablo hangi anahtarla ve hangi birleştirme türüyle birleştirilir?",
    ],
    obj: [
      "Ham bir CSV dosyasını okuyup türleri, eksik değerleri ve aykırı değerleri raporlar.",
      "groupby ve birleştirme işlemleriyle bir araştırma sorusuna sayısal yanıt üretir.",
      "Veri temizleme kararlarını belgeler ve sonuca etkisini karşılaştırır.",
    ],
    ev: "KODLAMA VERI_ANALIZI YORUMLAMA",
    t: "VERI_ANALIZI",
    lv: 3,
    sc: "M",
    mis: [
      "Eksik değerleri sessizce silmenin sonucu etkilemeyeceğini varsaymak.",
      "Zincirleme indekslemeyle yapılan atamanın her zaman orijinal tabloyu değiştirdiğini sanmak.",
    ],
    x: [
      "math.stat.descriptive:grup ortalamaları, dağılımlar ve özet istatistikler",
      "res.data.management:temiz ve belgelenmiş veri tablosu düzeni",
    ],
    ra: ["Kendi çalışma kayıtlarını ya da açık bir veri setini temizleyip analiz etmek"],
    rel: ["res.data.analysis-pipeline", "prog.ml.basics"],
    tags: ["pandas", "veri", "tablo"],
  })
  .o("prog.sci.numerical-methods", "Sayısal yöntemler: kök bulma, sayısal integral, kayan nokta", {
    d: "Kayan nokta aritmetiğinin sınırları; ikiye bölme ve Newton yöntemiyle kök bulma; yamuk ve Simpson kurallarıyla sayısal integral ve hata analizi.",
    w: "Kapalı çözümü olmayan denklemlerin çoğu bilimde böyle çözülür; yöntem hatasını ve yuvarlama hatasını ayırt edemeyen biri sonucuna güvenemez.",
    pre: ["prog.python.numpy", "math.calc.integral-def~s"],
    q: [
      "Bilgisayarda 1e16 + 1 - 1e16 işleminin sonucu neden 0 çıkabilir?",
      "Adım boyunu yarıya indirirsen yamuk kuralının hatası kaç kat küçülür? Tahmin et, sonra deneyerek kontrol et.",
    ],
    cq: [
      "Kayan nokta sayıları gerçek sayıları nasıl yaklaşık temsil eder?",
      "Newton yöntemi neden hızlı yakınsar ve ne zaman başarısız olur?",
      "Sayısal integralde hata adım boyuna nasıl bağlıdır?",
    ],
    obj: [
      "Newton yöntemini Taylor açılımından türetir ve kodlar.",
      "Yamuk kuralının hata mertebesini türetir ve sayısal deneyle doğrular.",
      "Yuvarlama hatası ile kesme (yöntem) hatasını bir log-log hata grafiğinde ayırt eder.",
    ],
    ev: "TURETME KODLAMA VERI_ANALIZI",
    t: "TURETME",
    lv: 4,
    sc: "L",
    mis: [
      "Adım boyunu küçülttükçe hatanın her zaman azalacağını sanmak; bir noktadan sonra yuvarlama hatası büyür.",
      "Newton yönteminin her başlangıç noktasından köke yakınsadığını düşünmek.",
    ],
    x: [
      "math.calc.taylor:Newton yöntemi ve hata analizleri Taylor açılımına dayanır",
      "math.calc.integral-def:Riemann toplamının hesaplamadaki karşılığı",
      "math.ode.numerical:aynı hata analizi diferansiyel denklem çözücülerine taşınır",
    ],
    rel: ["prog.sci.simulation"],
    tags: ["sayısal", "kayan-nokta", "kök-bulma", "integral"],
  })
  .o("prog.sci.simulation", "Simülasyon ve Monte Carlo", {
    d: "Rastgele sayılarla olasılıkları ve integralleri tahmin etmek; deterministik ve stokastik sistemleri zaman adımlarıyla simüle etmek.",
    w: "Analitik çözümü zor olan her sistemi, bir rastgele yürüyüşten spike üreten nöron popülasyonuna kadar, deneyerek keşfetmeni sağlar.",
    pre: ["prog.sci.numerical-methods", "math.prob.random-vars"],
    q: [
      "Bir kareye rastgele nokta atıp içindeki çembere düşenleri sayarak π'yi tahmin edebilirsin. 10 kat daha doğru sonuç için kaç kat daha fazla nokta gerekir?",
      "Doğum günü paradoksunu formül kullanmadan, yalnızca simülasyonla nasıl doğrularsın?",
    ],
    cq: [
      "Monte Carlo tahmininin hatası örnek sayısıyla nasıl küçülür?",
      "Rastgele sayı üreteci ve tohum (seed) tekrarlanabilirliği nasıl etkiler?",
      "Bir simülasyonun doğru olduğunu nasıl kontrol ederim?",
    ],
    obj: [
      "Bir olasılık problemini Monte Carlo ile çözer ve analitik sonuçla karşılaştırır.",
      "Monte Carlo hatasının 1/√N ile küçüldüğünü merkezi limit teoreminden türetir ve deneyle gösterir.",
      "Rastgele yürüyüş ya da Poisson spike üreteci gibi stokastik bir süreci simüle eder.",
    ],
    ev: "SIMULASYON TURETME KODLAMA TAHMIN",
    t: "MODELLEME",
    lv: 4,
    sc: "L",
    mis: [
      "Rastgele sayı üreteçlerinin gerçekten rastgele olduğunu sanmak; sözde rastgeledirler.",
      "Daha uzun simülasyonun sistematik bir model hatasını da düzelteceğini düşünmek.",
    ],
    x: [
      "math.prob.limit-theorems:Monte Carlo hatası merkezi limit teoremiyle açıklanır",
      "math.prob.stochastic:rastgele yürüyüş ve Poisson süreçlerini simüle etmek",
      "neuro.comp.spike-stats:Poisson spike dizileri üretmek ve istatistiğini incelemek",
    ],
    ra: ["Analitik çözümü bilinmeyen bir modelin parametre taraması"],
    rel: ["phys.comp.simulation"],
    tags: ["simülasyon", "monte-carlo", "rastgele"],
  })

  .unit("Makine öğrenmesi", "Makine öğrenmesi")
  .o("prog.ml.basics", "Makine öğrenmesine giriş: regresyon ve sınıflandırma", {
    d: "Veriden model öğrenmek: doğrusal ve lojistik regresyon, eğitim/test ayrımı, aşırı uyum, düzenlileştirme ve çapraz doğrulama.",
    w: "Nöral kod çözmeden deney verisinden örüntü bulmaya kadar modern bilimin büyük bölümü bu araçlarla yapılır; yanlış kullanıldığında ise kolayca sahte başarı üretir.",
    pre: ["prog.python.pandas", "math.stat.regression", "math.opt.optimization~s"],
    q: [
      "Bir model eğitim verisinde %100 doğruluk elde ediyor. Bu sevindirici mi, endişe verici mi?",
      "Bir sınıftaki öğrencilerin %95'i sınavı geçiyorsa, 'herkes geçer' diyen bir model %95 doğrudur. Bu iyi bir model mi?",
    ],
    cq: [
      "Model veriden ne öğrenir ve bunu nasıl yapar?",
      "Aşırı uyum nasıl tespit edilir ve nasıl önlenir?",
      "Bir sınıflandırıcının başarısı hangi ölçütlerle değerlendirilmelidir?",
    ],
    obj: [
      "Bir veri setini eğitim ve test olarak ayırıp doğrusal ve lojistik regresyon modelleri eğitir.",
      "Model karmaşıklığına karşı eğitim ve test hatasını çizip aşırı uyumu yorumlar.",
      "Dengesiz sınıflarda doğruluk yerine uygun ölçütleri seçer ve gerekçelendirir.",
    ],
    ev: "KODLAMA VERI_ANALIZI YORUMLAMA",
    t: "UYGULAMA",
    lv: 4,
    sc: "L",
    mis: [
      "Test verisini model seçimi için defalarca kullanmanın sonucu etkilemeyeceğini sanmak (veri sızıntısı).",
      "Yüksek doğruluğun modelin nedensel bir ilişki bulduğu anlamına geldiğini düşünmek.",
    ],
    x: [
      "math.stat.regression:en küçük kareler regresyonu makine öğrenmesinin en basit modelidir",
      "neuro.comp.neural-coding:spike verisinden uyaranı kod çözme bir sınıflandırma problemidir",
      "res.stats.pitfalls:veri sızıntısı ve çoklu deneme, p-hacking'in makine öğrenmesindeki karşılığıdır",
    ],
    ra: ["Nöral ya da davranışsal veriden kod çözme modelleri"],
    rel: ["prog.ml.neural-nets"],
    tags: ["makine-öğrenmesi", "regresyon", "sınıflandırma"],
  })
  .o("prog.ml.neural-nets", "Yapay sinir ağları ve geri yayılım", {
    d: "Çok katmanlı algılayıcılar, aktivasyon fonksiyonları, kayıp fonksiyonu ve zincir kuralıyla geri yayılım; gradyan inişiyle eğitim.",
    w: "Modern yapay zekânın temelidir ve beyinle karşılaştırıldığında öğrenme kuralları hakkında derin sorular doğurur.",
    pre: ["prog.ml.basics", "math.calc.multivar", "math.linalg.matrices"],
    q: [
      "Tek bir doğrusal nöron XOR problemini çözemez. Bir gizli katman eklemek bunu neden değiştirir?",
      "Geri yayılım, beyindeki sinapsların öğrenme biçimine benziyor mu? Hangi yönden benzer, hangi yönden kesinlikle değil?",
    ],
    cq: [
      "Doğrusal olmayan aktivasyon neden zorunludur?",
      "Geri yayılım zincir kuralını nasıl verimli uygular?",
      "Öğrenme hızı ve başlatma eğitimi nasıl etkiler?",
    ],
    obj: [
      "İki katmanlı bir ağ için geri yayılım denklemlerini zincir kuralından türetir.",
      "Küçük bir ağı yalnızca NumPy ile sıfırdan kodlar ve XOR ya da basit bir veri setinde eğitir.",
      "Sayısal gradyanla analitik gradyanı karşılaştırarak geri yayılım kodunu doğrular.",
    ],
    ev: "TURETME KODLAMA DENEY",
    t: "TURETME",
    lv: 5,
    sc: "L",
    mis: [
      "Yapay nöronların biyolojik nöronların gerçekçi modelleri olduğunu sanmak.",
      "Daha fazla katmanın her zaman daha iyi sonuç vereceğini düşünmek.",
    ],
    x: [
      "math.calc.multivar:geri yayılım çok değişkenli zincir kuralının uygulamasıdır",
      "neuro.comp.ann-bridge:yapay ve biyolojik ağların karşılaştırılması",
      "neuro.syn.plasticity:geri yayılım ile yerel sinaptik öğrenme kuralları arasındaki karşıtlık",
    ],
    ra: ["Nöral veriyi açıklayan ağ modelleri"],
    vs: ["neuro.comp.hebbian"],
    rel: ["math.opt.optimization"],
    tags: ["sinir-ağı", "geri-yayılım", "derin-öğrenme"],
  })

  .unit("Araçlar", "Araçlar")
  .o("prog.tools.git", "Git ve sürüm kontrolü", {
    d: "Değişiklikleri commit olarak kaydetmek, dallanmak, birleştirmek, uzak depoyla çalışmak ve geçmişte geri dönmek.",
    w: "Dün çalışan kodu bugün bozduğunda geri dönebilmek ve bir sonucu hangi kodun ürettiğini kanıtlayabilmek tekrarlanabilir bilimin altyapısıdır.",
    pre: ["prog.python.basics"],
    q: [
      "'analiz_son.py', 'analiz_son_GERCEKSON.py', 'analiz_son2_duzeltilmis.py'... Bu dosya düzeninin hangi sorunu var ve nasıl çözülür?",
      "Bir grafiğin üç hafta önce farklı göründüğünü fark ettin. Hangi kod değişikliğinin buna yol açtığını nasıl bulursun?",
    ],
    cq: [
      "Commit neyi kaydeder ve iyi bir commit mesajı nasıl yazılır?",
      "Dal (branch) neden kullanılır?",
      "Birleştirme çakışması nasıl çözülür?",
    ],
    obj: [
      "Bir projeyi git deposuna dönüştürür ve anlamlı, küçük commitlerle ilerletir.",
      "Bir deneme için dal açar, sonra ana dala birleştirir ve oluşan bir çakışmayı çözer.",
      "Geçmişteki bir sürümü bulup o sürümle bir sonucu yeniden üretir.",
    ],
    ev: "KODLAMA PROBLEM_COZME",
    t: "PRATIK",
    lv: 2,
    sc: "S",
    mis: [
      "Git'in yalnızca yedekleme aracı olduğunu sanmak.",
      "Büyük veri dosyalarını ve parolaları da depoya eklemenin sorun olmadığını düşünmek.",
    ],
    x: ["res.data.management:kod ve analiz geçmişinin belgelenmesi"],
    rel: ["prog.tools.reproducible"],
    tags: ["git", "sürüm-kontrolü", "araç"],
  })
  .o("prog.tools.reproducible", "Tekrarlanabilir hesaplama: not defterleri ve ortamlar", {
    d: "Jupyter not defterlerini disiplinli kullanmak, sanal ortam ve bağımlılık dosyalarıyla bir analizi başka bir bilgisayarda aynen yeniden üretilebilir kılmak.",
    w: "Bir sonucu bir yıl sonra senin ya da başkasının yeniden üretebilmesi, onun bilimsel olarak değerli olmasının şartıdır.",
    pre: ["prog.tools.git", "prog.python.files-debug"],
    q: [
      "Bir not defterinde hücreleri farklı sırayla çalıştırınca farklı sonuç alıyorsun. Hangisi 'gerçek' sonuç?",
      "Arkadaşının bilgisayarında kodun çalışmıyor ama seninkinde çalışıyor. Neler farklı olabilir?",
    ],
    cq: [
      "Bir analizi tekrarlanabilir kılan bileşenler nelerdir?",
      "Not defterlerinin gizli durum sorunu nasıl önlenir?",
      "Bağımlılıklar ve rastgele tohumlar nasıl sabitlenir?",
    ],
    obj: [
      "Bir analiz projesini ortam dosyası, sabit tohum ve README ile yeniden üretilebilir biçimde paketler.",
      "Bir not defterini baştan sona temiz çekirdekle çalıştırıp aynı sonucu elde ettiğini doğrular.",
      "Başkasının yayımladığı bir analizi yeniden üretmeyi dener ve karşılaştığı engelleri raporlar.",
    ],
    ev: "KODLAMA ARASTIRMA_UYGULAMASI DENEY",
    t: "PRATIK",
    lv: 3,
    sc: "M",
    mis: [
      "Kodu paylaşmanın tek başına tekrarlanabilirlik için yeterli olduğunu sanmak; sürümler, veri ve ortam da gerekir.",
      "Not defterindeki çıktının her zaman yukarıdaki kodun güncel hâline ait olduğunu varsaymak.",
    ],
    x: [
      "res.data.management:veri ve kodun birlikte belgelenmesi",
      "res.ethics:tekrarlanabilirlik, araştırma dürüstlüğünün teknik boyutudur",
    ],
    ra: ["Yayımlanmış bir makalenin şeklini açık kod ve veriyle yeniden üretmek"],
    rel: ["res.data.analysis-pipeline"],
    tags: ["tekrarlanabilirlik", "jupyter", "ortam"],
  })
  .o("prog.tools.latex", "LaTeX ile bilimsel yazım", {
    d: "Denklemleri, şekilleri, tabloları ve kaynakçayı LaTeX ile dizgilemek; belge yapısı ve otomatik numaralandırma.",
    w: "Matematik ve fizik yazımının standart aracıdır; rapor, olimpiyat çözümü ve makale yazarken denklemleri düzgün ve tutarlı yazmanı sağlar.",
    pre: ["prog.python.basics~h"],
    q: [
      "Bir rapora yeni bir denklem eklediğinde sonraki tüm denklem numaralarını ve onlara yapılan atıfları elle mi güncelleyeceksin?",
      "∫₀^∞ e^{-x²} dx = √π/2 ifadesini klavyeden düzgün görünecek biçimde nasıl yazarsın?",
    ],
    cq: [
      "Bir LaTeX belgesinin temel yapısı nedir?",
      "Denklem, şekil ve kaynaklara nasıl otomatik atıf yapılır?",
    ],
    obj: [
      "Denklemler, bir şekil, bir tablo ve kaynakça içeren kısa bir raporu LaTeX ile dizgiler.",
      "Derleme hatalarını log dosyasından okuyarak düzeltir.",
      "Bir fizik çözümünü hizalanmış çok satırlı denklemlerle okunur biçimde yazar.",
    ],
    ev: "KODLAMA ACIKLAMA",
    t: "BECERI",
    lv: 2,
    sc: "S",
    mis: [
      "LaTeX'in bir kelime işlemci gibi 'gördüğün sonuç' mantığıyla çalıştığını sanmak.",
      "Şekillerin tam yazıldığı yerde kalması gerektiğini düşünmek; kayan nesneler yerleşimi otomatik yapar.",
    ],
    x: [
      "res.write.report:bilimsel raporun dizgi aracı",
      "res.lit.citation:BibTeX ile atıf yönetimi",
    ],
    rel: ["res.write.report"],
    tags: ["latex", "yazım", "araç"],
  })
  .o("prog.comp.competitive", "Rekabetçi programlama", {
    d: "Zaman ve bellek sınırları altında algoritmik problemleri çözmek: problem okuma, karmaşıklık bütçesi, uç durumlar ve hızlı, doğru uygulama.",
    w: "Algoritma bilgisini baskı altında doğru ve hızlı uygulamaya dönüştürür; olimpiyat ve programlama yarışmalarına doğrudan hazırlıktır.",
    pre: ["prog.algo.dp", "prog.algo.graphs", "prog.algo.sorting-search"],
    q: [
      "Bir problemde n ≤ 2·10⁵ yazıyor. Bu tek bilgi, hangi algoritmaları daha düşünmeden elemene yeter?",
      "Kodun örnek testleri geçti ama gizli testlerde 'Wrong Answer' aldı. İlk hangi üç durumu kontrol edersin?",
    ],
    cq: [
      "Girdi sınırlarından algoritma sınıfı nasıl çıkarılır?",
      "Bir çözümün doğruluğu göndermeden önce nasıl sınanır?",
      "Yarışma sırasında problemler nasıl önceliklendirilir?",
    ],
    obj: [
      "Girdi sınırlarından uygun karmaşıklığı türetir ve buna uygun algoritmayı seçer.",
      "Kaba kuvvet çözümle karşılaştıran rastgele testlerle (stres testi) kendi çözümündeki hatayı bulur.",
      "Süreli bir problem setini çözer ve sonrasında hatalarını sınıflandırır.",
    ],
    ev: "PROBLEM_COZME KODLAMA TRANSFER",
    t: "CHALLENGE",
    lv: 4,
    sc: "L",
    opt: true,
    ch: true,
    mis: [
      "Daha çok algoritma ezberlemenin daha çok problem çözmek demek olduğunu sanmak; modelleme becerisi belirleyicidir.",
      "Taşma (overflow) ve uç durumların ihmal edilebileceğini düşünmek.",
    ],
    x: [
      "math.comp.olympiad-methods:invaryant, güvercin yuvası ve sayma fikirleri algoritmik problemlerde de kullanılır",
      "comp.meta.deliberate-practice:hata defteri ve bilinçli pratik yarışma gelişiminin motorudur",
    ],
    ca: ["Programlama yarışmaları ve bilişim olimpiyatı hazırlığı"],
    rel: ["comp.prog.contests"],
    tags: ["yarışma", "algoritma", "challenge"],
  })
  .done();
