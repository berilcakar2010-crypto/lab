import { builder } from "../dsl";

export const MATH_PLUS = builder("MATEMATIK")
  // ---------------------------------------------------------------------------
  .unit("Temeller", "Fonksiyonlar ve ön kalkülüs")
  .o("math.precalc.transformations", "Fonksiyon dönüşümleri ve bileşke", {
    d: "y = a·f(b(x − h)) + k biçimindeki öteleme, germe ve yansımaların grafiğe etkisi; fonksiyonların bileşkesi, tanım kümesi ve bileşkenin ayrıştırılması.",
    w: "Yeni bir fonksiyonu bildiğin bir 'ana' fonksiyonun dönüşümü olarak görmek, grafik çizmeyi ve kalkülüste zincir kuralını çok kolaylaştırır.",
    pre: ["math.found.functions"],
    q: [
      "y = (x − 3)² grafiği y = x² grafiğinin sağa mı, sola mı kaydırılmış hâlidir? İçerideki eksi işareti neden sezgiye ters görünüyor?",
      "f(g(x)) ile g(f(x)) aynı fonksiyon olabilir mi? Bir örnek ve bir karşı örnek bul.",
    ],
    cq: [
      "Dönüşümler hangi sırayla uygulanmalı ve sıra neden önemlidir?",
      "Fonksiyonun içine ve dışına yapılan değişiklikler grafiği nasıl farklı etkiler?",
      "Bir bileşke fonksiyonun tanım kümesi nasıl bulunur?",
    ],
    obj: [
      "Bir ana fonksiyona uygulanan dönüşümler dizisinden yeni grafiği çizer.",
      "Verilen bir grafiğin denklemini ana fonksiyonun dönüşümü olarak yazar.",
      "İki fonksiyonun bileşkesini ve tanım kümesini hesaplar; karmaşık bir fonksiyonu bileşke olarak ayrıştırır.",
    ],
    ev: "DIAGRAM HESAPLAMA YORUMLAMA",
    t: "BECERI",
    lv: 1,
    sc: "M",
    mis: [
      "f(x − 3)'ün grafiği sola kaydırdığını sanmak.",
      "Bileşkenin değişmeli olduğunu, f∘g = g∘f olduğunu düşünmek.",
    ],
    x: [
      "phys.waves.basics:y = A sin(kx − ωt) yürüyen dalga ötelenmiş bir fonksiyondur",
      "prog.python.functions:fonksiyon bileşkesi ve modüler kod",
    ],
    rel: ["math.precalc.inverse", "math.calc.diff-rules"],
    tags: ["donusum", "bileske", "grafik"],
  })
  .o("math.precalc.inverse", "Ters fonksiyonlar", {
    d: "Birebirlik ve yatay doğru testi, ters fonksiyonun bulunması, y = x doğrusuna göre yansıma, tanım ve değer kümesinin yer değiştirmesi ve tersi olmayan fonksiyonlarda tanım kümesini kısıtlama.",
    w: "Logaritma, kök ve ters trigonometrik fonksiyonların hepsi bir 'geri alma' işlemidir; ters fonksiyon bir denklemi çözmenin genel fikridir.",
    pre: ["math.precalc.transformations"],
    q: [
      "f(x) = x² fonksiyonunun tersi √x midir? f(−3) = 9 iken 9'u geri alınca ne elde edersin?",
      "Bir şifreleme fonksiyonu iki farklı mesajı aynı şifreye dönüştürürse, şifreyi çözmek mümkün olur mu?",
    ],
    cq: [
      "Bir fonksiyonun tersinin olması için hangi koşul gerekir?",
      "Ters fonksiyonun grafiği orijinalinkinden nasıl elde edilir?",
      "Tersi olmayan bir fonksiyon nasıl tersinir hâle getirilir?",
    ],
    obj: [
      "Bir fonksiyonun birebir olup olmadığını cebirsel ve grafik yoldan sınar.",
      "Ters fonksiyonu cebirsel olarak bulur ve f(f⁻¹(x)) = x ile doğrular.",
      "Tanım kümesini kısıtlayarak tersinir bir dal seçer ve gerekçelendirir.",
    ],
    ev: "HESAPLAMA ACIKLAMA DIAGRAM",
    t: "KAVRAM",
    lv: 2,
    sc: "S",
    mis: [
      "f⁻¹(x) ile 1/f(x)'i karıştırmak.",
      "Her fonksiyonun bir tersi olduğunu sanmak.",
    ],
    x: [
      "cs.security:şifreleme ve çözme ters fonksiyon çiftidir",
      "chem.acid-base:pH ve [H⁺] arasındaki logaritma–üstel ters ilişki",
    ],
    rel: ["math.found.exp-log", "math.calc.implicit"],
    tags: ["ters-fonksiyon", "birebir"],
  })
  .o("math.precalc.rational", "Rasyonel fonksiyonlar ve asimptotlar", {
    d: "Polinom bölümü olarak rasyonel fonksiyonlar; düşey, yatay ve eğik asimptotlar, delikler (kaldırılabilir süreksizlik), işaret tablosu ve rasyonel eşitsizlikler.",
    w: "Kalkülüsteki limit ve süreksizlik fikirlerinin sezgisel provasıdır; fizikte ve kimyada doyuma ulaşan bağıntılar (örneğin Michaelis–Menten) rasyonel fonksiyondur.",
    pre: ["math.found.polynomials", "math.precalc.transformations~s"],
    q: [
      "f(x) = (x² − 1)/(x − 1) fonksiyonu x = 1'de tanımsız. Grafikte orada bir asimptot mu vardır, yoksa başka bir şey mi?",
      "Bir grafik yatay asimptotunu kesebilir mi? Düşey asimptotunu?",
    ],
    cq: [
      "Asimptot türleri pay ve paydanın derecelerinden nasıl belirlenir?",
      "Delik ile düşey asimptot nasıl ayırt edilir?",
      "Rasyonel bir eşitsizlik işaret tablosuyla nasıl çözülür?",
    ],
    obj: [
      "Bir rasyonel fonksiyonun asimptotlarını ve deliklerini hesaplar.",
      "Sıfırları, asimptotları ve işaret tablosunu kullanarak grafiği çizer.",
      "Rasyonel eşitsizlikleri işaret tablosuyla çözer.",
    ],
    ev: "HESAPLAMA DIAGRAM PROBLEM_COZME",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Grafiğin yatay asimptotunu asla kesemeyeceğini sanmak.",
      "Paydanın her sıfırında düşey asimptot olduğunu düşünmek (ortak çarpan delik oluşturur).",
    ],
    x: [
      "bio.enzymes:Michaelis–Menten hız bağıntısı rasyonel bir fonksiyondur",
      "phys.optics.geometric:mercek denkleminde görüntü uzaklığının asimptotik davranışı",
    ],
    rel: ["math.calc.limits"],
    tags: ["rasyonel", "asimptot"],
  })
  .o("math.precalc.trig-functions", "Trigonometrik fonksiyonların grafikleri ve modelleme", {
    d: "Sinüs, kosinüs ve tanjant grafikleri; genlik, periyot, faz kayması ve düşey kayma; periyodik olayları (gelgit, gün ışığı süresi, salınım) sinüzoidal modelle ifade etme.",
    w: "Dalgalar, salınımlar, alternatif akım ve biyolojik ritimlerin hepsi sinüzoidlerle anlatılır; Fourier analizine giden yolun ilk adımıdır.",
    pre: ["math.trig.basics", "math.precalc.transformations"],
    q: [
      "Bir şehirde gün ışığı süresi yıl boyunca nasıl değişir? Bir grafik çiz; bu grafik neden bir sinüse benzeyebilir?",
      "y = sin(2x) grafiği y = sin x'e göre sıkışmış mıdır, gerilmiş mi? Periyodu ne olur?",
    ],
    cq: [
      "Genlik, periyot ve faz kayması denklemde nerede görünür?",
      "Periyodik bir veri sinüzoidal modelle nasıl ifade edilir?",
      "Tanjant grafiğinin asimptotları nereden gelir?",
    ],
    obj: [
      "y = A sin(B(x − C)) + D biçimindeki bir fonksiyonun grafiğini parametrelerinden çizer.",
      "Periyodik bir veri setinden (gelgit, sıcaklık) sinüzoidal bir model kurar ve parametreleri yorumlar.",
      "Trigonometrik grafiklerin birim çemberden nasıl türediğini diyagramla açıklar.",
    ],
    ev: "DIAGRAM MODELLEME YORUMLAMA",
    t: "MODELLEME",
    lv: 2,
    sc: "M",
    mis: [
      "y = sin(Bx)'te periyodun B olduğunu sanmak (periyot 2π/B'dir).",
      "Faz kaymasının parantez içindeki sayının kendisi olduğunu her durumda kabul etmek (B ≠ 1 iken çarpanı unutmak).",
    ],
    x: [
      "phys.mech.oscillations:basit harmonik hareket sinüzoidaldir",
      "phys.em.ac-rlc:alternatif akım ve faz farkı",
      "neuro.methods.electrophysiology:EEG ritimleri periyodik sinyallerdir",
    ],
    rel: ["math.fourier", "math.trig.identities"],
    tags: ["trigonometri", "periyodik", "modelleme"],
  })
  .o("math.precalc.inverse-trig", "Ters trigonometrik fonksiyonlar ve trigonometrik denklemler", {
    d: "arcsin, arccos ve arctan için tanım kümesi kısıtlaması ve ana değer; trigonometrik denklemlerin genel çözümü ve belirli aralıktaki tüm çözümlerin bulunması.",
    w: "Bir kenar oranından açıyı bulmak, fizikte açı hesaplamak ve trigonometrik denklemleri eksiksiz çözmek için gereklidir; kalkülüste arctan'ın türevi ve integrali sık karşına çıkar.",
    pre: ["math.precalc.trig-functions", "math.precalc.inverse"],
    q: [
      "sin x = 1/2 denkleminin kaç çözümü vardır? Hesap makinesi neden yalnızca birini veriyor?",
      "arcsin(sin(5π/6)) değeri 5π/6 mıdır? Önce tahmin et.",
    ],
    cq: [
      "Ters trigonometrik fonksiyonlar için tanım kümesi neden kısıtlanır?",
      "Bir trigonometrik denklemin genel çözümü nasıl yazılır?",
      "Özdeşlikler denklem çözmede nasıl kullanılır?",
    ],
    obj: [
      "Ters trigonometrik fonksiyonların ana değerlerini hesaplar ve bileşke ifadeleri sadeleştirir.",
      "Trigonometrik denklemlerin genel çözümünü türetir ve verilen aralıktaki tüm çözümleri bulur.",
      "Özdeşlikleri kullanarak ikinci dereceden trigonometrik denklemleri çözer.",
    ],
    ev: "HESAPLAMA PROBLEM_COZME TURETME",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "sin⁻¹x ile 1/sin x'i karıştırmak.",
      "Hesap makinesinin verdiği tek açıyı denklemin tek çözümü sanmak.",
    ],
    x: [
      "phys.mech.kinematics-2d:eğik atışta açının bileşenlerden bulunması",
      "phys.optics.geometric:Snell yasasında kırılma açısının hesabı",
    ],
    ca: ["Olimpiyat ve sınavlarda aralık içi çözüm sayısı soruları"],
    rel: ["math.trig.identities"],
    tags: ["ters-trigonometri", "trigonometrik-denklem"],
  })
  .o("math.precalc.polar", "Kutupsal koordinatlar ve karmaşık düzlem", {
    d: "Kutupsal koordinatlar ve Kartezyen dönüşüm; kutupsal eğriler (gül, kardioid, spiral); karmaşık sayıların kutupsal biçimi, çarpımın dönme olarak yorumu, De Moivre teoremi ve birimin n'inci kökleri.",
    w: "Dönme ve periyodik hareketi en doğal biçimde anlatan koordinat sistemidir; karmaşık sayılarla çarpmanın 'döndür ve ölçekle' anlamı, sinyal işleme ve fizikte her yerde kullanılır.",
    pre: ["math.precalc.trig-functions", "math.complex.numbers~s"],
    q: [
      "Bir karmaşık sayıyı i ile çarpınca düzlemde ne olur? Birkaç sayı dene ve bir kural tahmin et.",
      "r = cos(3θ) eğrisinin kaç yaprağı vardır? r = cos(2θ) için? Çizmeden önce tahmin et.",
    ],
    cq: [
      "Kutupsal ve Kartezyen koordinatlar arasında nasıl dönüşüm yapılır?",
      "Karmaşık sayıların çarpımı geometrik olarak nedir?",
      "zⁿ = 1 denkleminin kökleri düzlemde nasıl dizilir?",
    ],
    obj: [
      "Noktaları ve denklemleri kutupsal ve Kartezyen biçimler arasında dönüştürür.",
      "Temel kutupsal eğrileri çizer ve simetrilerini belirler.",
      "De Moivre teoremini tümevarımla ispatlar ve birimin n'inci köklerini hesaplar.",
    ],
    ev: "HESAPLAMA DIAGRAM ISPAT",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Kutupsal bir noktanın tek bir (r, θ) gösterimi olduğunu sanmak.",
      "Karmaşık sayıların çarpımında açıların da çarpıldığını düşünmek (açılar toplanır).",
    ],
    x: [
      "phys.em.ac-rlc:fazörler karmaşık düzlemde dönen vektörlerdir",
      "phys.mech.circular:dairesel hareketin kutupsal betimlemesi",
    ],
    rel: ["math.calc.parametric-polar", "math.complex.numbers"],
    tags: ["kutupsal", "karmasik-duzlem", "de-moivre"],
  })
  .o("math.precalc.modeling", "Verilerle fonksiyon modelleme", {
    d: "Bir veri setine doğrusal, üstel, logaritmik, kuvvet ya da sinüzoidal model seçme; dönüştürülmüş eksenlerle (log–log, yarı-log) doğrusallaştırma, artık analizi ve modelin sınırları.",
    w: "Laboratuvar verisinden fiziksel yasa çıkarmanın ve büyümeyi, bozunmayı ya da ölçeklenmeyi doğru modelle anlatmanın temel becerisidir.",
    pre: ["math.precalc.transformations", "math.found.exp-log", "math.stat.descriptive~s"],
    q: [
      "Bir sarkacın uzunluğu ile periyodunu ölçtün. Verinin bir doğru mu, parabol mü, kök fonksiyonu mu olduğunu nasıl anlarsın?",
      "Bir modelin verdiği tahmin veriye çok iyi uyuyor. Bu, modelin doğru olduğu anlamına gelir mi?",
    ],
    cq: [
      "Veriye uygun fonksiyon ailesi nasıl seçilir?",
      "Logaritmik ölçekler bir ilişkiyi nasıl doğrusallaştırır?",
      "Artıklar modelin uygunluğu hakkında ne söyler?",
    ],
    obj: [
      "Bir veri setinin grafiğinden ve oranlarından uygun fonksiyon ailesini seçer ve gerekçelendirir.",
      "Log–log ya da yarı-log grafikle kuvvet ve üstel ilişkileri doğrusallaştırarak parametreleri hesaplar.",
      "Artık grafiğini yorumlar ve modelin geçerlilik aralığını belirtir.",
    ],
    ev: "MODELLEME VERI_ANALIZI YORUMLAMA",
    t: "MODELLEME",
    lv: 3,
    sc: "M",
    mis: [
      "Yüksek R²'nin modelin doğru olduğunu kanıtladığını sanmak.",
      "Bir modeli veri aralığının çok dışına güvenle uzatmak (ekstrapolasyon).",
    ],
    x: [
      "phys.lab.experimental:deney verisinden yasa çıkarma ve doğrusallaştırma",
      "res.data.visualization:logaritmik eksenlerin doğru kullanımı",
      "env.population.human:nüfus verisine büyüme modeli uydurma",
    ],
    ra: ["Deney verisine model uydurma ve parametre kestirimi"],
    rel: ["math.stat.regression"],
    tags: ["modelleme", "veri", "dogrusallastirma"],
  })

  // ---------------------------------------------------------------------------
  .unit("Temeller", "Geometri ve trigonometri")
  .o("math.geo.proofs", "Geometrik ispat ve yapılar", {
    d: "Eşlik ve benzerlik ölçütleriyle iki sütunlu ve paragraf ispatlar; yardımcı çizgi kurma, pergel–cetvel yapıları, çember teoremleri (çevre açı, kiriş, teğet) ve geometrik yer.",
    w: "Matematiksel ispatın en görsel okuludur; olimpiyat geometrisinin ve her türlü kesin akıl yürütmenin temelini oluşturur.",
    pre: ["math.geo.euclid", "math.found.proof-techniques~s"],
    q: [
      "Bir çemberin çapını gören her çevre açı neden dik açıdır? Birkaç örnek çiz, sonra nedenini bulmaya çalış.",
      "Yalnızca pergel ve cetvelle bir açıyı iki eş parçaya bölebilirsin. Üçe bölebilir misin?",
    ],
    cq: [
      "Geometrik bir ispat hangi aksiyom ve teoremlere dayanır?",
      "Yardımcı çizgi nasıl ve ne zaman eklenir?",
      "Pergel–cetvel yapısının adımları nasıl gerekçelendirilir?",
    ],
    obj: [
      "Eşlik ve benzerlik ölçütlerini kullanarak üçgenlerle ilgili önermeleri ispatlar.",
      "Çevre açı ve teğet–kiriş teoremlerini ispatlar ve problemlerde uygular.",
      "Temel pergel–cetvel yapılarını (açıortay, dikme, teğet) gerçekleştirir ve doğruluğunu ispatlar.",
    ],
    ev: "ISPAT DIAGRAM PROBLEM_COZME",
    t: "ISPAT",
    lv: 3,
    sc: "L",
    mis: [
      "Bir şeklin çizimde 'öyle görünmesini' ispat yerine saymak.",
      "AAK ölçütü yerine geçerli olmayan AKK (iki kenar ve aralarında olmayan açı) ile eşlik çıkarmak.",
    ],
    x: [
      "gk.phil.intro:geçerli argüman ve tümdengelim",
      "gk.sci-hist.ancient-medieval:Öklid'in Elemanlar'ı ve aksiyomatik yöntem",
    ],
    ca: ["Matematik olimpiyatı geometri problemleri"],
    rel: ["math.comp.olympiad-methods"],
    tags: ["ispat", "geometri", "yapi"],
  })
  .o("math.geo.conics", "Konikler: çember, elips, parabol, hiperbol", {
    d: "Koniklerin odak–doğrultman tanımları, standart denklemleri, kare tamamlama ile denklemin tanınması, dışmerkezlik ve yansıma özellikleri.",
    w: "Gezegen yörüngeleri, çanak antenler, far reflektörleri ve eğik atış yörüngeleri koniktir; fizikte ve astronomide sürekli karşına çıkar.",
    pre: ["math.geo.analytic"],
    q: [
      "Elips biçimli bir bilardo masasının bir odağından vurulan top, kenara çarptıktan sonra nereye gider? Tahmin et.",
      "Bir koniyi bir düzlemle kesince kaç farklı türde eğri elde edebilirsin?",
    ],
    cq: [
      "Konikler odak ve doğrultmanla nasıl tanımlanır?",
      "Genel ikinci derece denklemden koniğin türü nasıl anlaşılır?",
      "Koniklerin yansıma özellikleri neden doğrudur?",
    ],
    obj: [
      "Odak–doğrultman tanımından parabol ve elipsin standart denklemlerini türetir.",
      "Kare tamamlayarak bir denklemin hangi koniği gösterdiğini belirler ve grafiğini çizer.",
      "Dışmerkezlik ile yörünge şekli arasındaki ilişkiyi kullanarak bir problemi çözer.",
    ],
    ev: "TURETME HESAPLAMA DIAGRAM",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Elipsin 'basık bir çember' olup odakları olmadığını sanmak.",
      "Her parabolün y = ax² biçiminde olduğunu düşünmek (yönelim ve öteleme).",
    ],
    x: [
      "space.orbits.kepler:gezegen yörüngeleri elips, kaçış yörüngeleri parabol/hiperboldür",
      "phys.optics.geometric:parabolik ayna ve odak",
    ],
    rel: ["math.geo.analytic"],
    tags: ["konik", "elips", "parabol"],
  })
  .o("math.geo.transformations", "Dönüşüm geometrisi: öteleme, dönme, yansıma, benzerlik", {
    d: "Düzlemde izometriler (öteleme, dönme, yansıma, kayma yansıması) ve benzerlik dönüşümleri; bileşkeleri, matrislerle gösterimi, simetri ve desenler.",
    w: "Simetriyi kesin bir dille anlatmayı sağlar; bilgisayar grafiği, kristalografi ve soyut cebirdeki gruplar bu fikirden doğar.",
    pre: ["math.geo.analytic", "math.linalg.matrices~s"],
    q: [
      "İki farklı doğruya göre arka arkaya yansıma yaparsan sonuç tek bir dönüşüm olarak ne olur? Doğrular paralelse?",
      "Bir kare kaç farklı dönüşümle kendisine eşlenir?",
    ],
    cq: [
      "Hangi dönüşümler uzunluğu ve açıyı korur?",
      "Dönüşümlerin bileşkesi nasıl bulunur?",
      "Dönme ve yansıma matrislerle nasıl gösterilir?",
    ],
    obj: [
      "Noktaları ve şekilleri verilen dönüşümlerle koordinat düzleminde eşler.",
      "İki yansımanın bileşkesinin bir öteleme ya da dönme olduğunu ispatlar.",
      "Dönme, yansıma ve ölçekleme dönüşümlerini 2×2 matrislerle yazar ve bileşkelerini hesaplar.",
    ],
    ev: "DIAGRAM HESAPLAMA ISPAT",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Dönüşümlerin bileşkesinin sıradan bağımsız olduğunu sanmak.",
      "Benzerlik dönüşümünün uzunluğu koruduğunu düşünmek.",
    ],
    x: [
      "art.elements:desen, simetri ve kompozisyon",
      "chem.bond.lewis-vsepr:molekül simetrisi",
      "cs.web.basics:CSS ve grafiklerde dönüşüm matrisleri",
    ],
    rel: ["math.linalg.linear-maps", "math.adv.abstract-algebra"],
    tags: ["donusum", "simetri", "izometri"],
  })
  .o("math.geo.solid", "Katı cisimler: alan ve hacim", {
    d: "Prizma, piramit, silindir, koni ve kürenin yüzey alanı ve hacmi; Cavalieri ilkesi, kesitler, benzer cisimlerde alan ve hacim oranları.",
    w: "Mühendislikten biyolojiye ölçekleme düşüncesinin temelidir: bir hücrenin ya da hayvanın boyutu büyüdükçe yüzey–hacim oranının değişmesi birçok olguyu açıklar.",
    pre: ["math.geo.euclid"],
    q: [
      "Tüm boyutları iki katına çıkarılmış bir heykel için iki kat mı boya gerekir, dört kat mı, sekiz kat mı? Peki kaç kat bronz?",
      "Bir piramidin hacmi neden aynı taban ve yükseklikteki prizmanın tam üçte biridir? Bir yol öner.",
    ],
    cq: [
      "Temel katı cisimlerin hacim formülleri nereden gelir?",
      "Cavalieri ilkesi hacimleri karşılaştırmayı nasıl sağlar?",
      "Benzer cisimlerde alan ve hacim nasıl ölçeklenir?",
    ],
    obj: [
      "Bileşik katı cisimlerin yüzey alanı ve hacmini hesaplar.",
      "Cavalieri ilkesiyle kürenin hacim formülünü türetir.",
      "Benzerlik oranından alan ve hacim oranlarını hesaplar ve bir ölçekleme problemine uygular.",
    ],
    ev: "HESAPLAMA TURETME TRANSFER",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Boyutlar iki katına çıkınca hacmin de iki katına çıktığını sanmak.",
      "Yüzey alanı ile hacmin aynı biçimde ölçeklendiğini düşünmek.",
    ],
    x: [
      "bio.cell.structure:yüzey–hacim oranı hücre boyutunu sınırlar",
      "phys.olymp.estimation:ölçekleme yasalarıyla tahmin",
    ],
    rel: ["math.calc.integral-apps"],
    tags: ["hacim", "alan", "olcekleme"],
  })
  .o("math.trig.laws", "Sinüs ve kosinüs teoremleri", {
    d: "Herhangi bir üçgende sinüs ve kosinüs teoremleri, belirsiz durum (KKA), üçgenin alanı için ½ab·sinC ve Heron formülleri ve ölçme–navigasyon uygulamaları.",
    w: "Dik açı olmayan her üçgeni çözmeyi sağlar; kuvvet ve hız vektörlerinin toplanması, ölçme ve gökbilimde doğrudan kullanılır.",
    pre: ["math.trig.basics", "math.geo.euclid"],
    q: [
      "İki kenarı ve bunlardan birinin karşısındaki açı verilen bir üçgen her zaman tek midir? İki farklı üçgen çizmeyi dene.",
      "Pisagor teoremi dik olmayan üçgenlerde nasıl 'düzeltilmeli'? Bir tahmin yaz.",
    ],
    cq: [
      "Sinüs ve kosinüs teoremleri nasıl ispatlanır?",
      "Hangi veri durumunda hangi teorem kullanılır?",
      "KKA durumunda kaç üçgen olabilir?",
    ],
    obj: [
      "Sinüs ve kosinüs teoremlerini yükseklik çizerek ya da koordinatlarla ispatlar.",
      "Verilen bilgilere göre uygun teoremi seçerek üçgeni çözer; belirsiz durumu analiz eder.",
      "Ölçme ve navigasyon problemlerinde teoremleri uygular.",
    ],
    ev: "ISPAT HESAPLAMA PROBLEM_COZME",
    t: "BECERI",
    lv: 2,
    sc: "S",
    mis: [
      "Sinüs teoremiyle bulunan açının her zaman tek olduğunu sanmak.",
      "Kosinüs teoreminin yalnızca geniş açılı üçgenlerde geçerli olduğunu düşünmek.",
    ],
    x: [
      "phys.mech.newton:dik olmayan kuvvetlerin bileşkesini bulma",
      "space.sky.observation:gök cisimlerinin açısal konum hesapları",
    ],
    rel: ["math.geo.vectors"],
    tags: ["sinus-teoremi", "kosinus-teoremi", "ucgen"],
  })

  // ---------------------------------------------------------------------------
  .unit("Olasılık ve istatistik", "Olasılık ve istatistik")
  .o("math.stat.sampling", "Örnekleme yöntemleri ve yanlılık", {
    d: "Basit rastgele, tabakalı, küme ve sistematik örnekleme; seçim yanlılığı, yanıtsızlık yanlılığı, yanıt yanlılığı; gözlemsel çalışma ile deney arasındaki fark ve sonuçların genellenebilirliği.",
    w: "Bir anket ya da çalışmanın sonucuna ne kadar güvenebileceğini belirler; büyük bir örneklemin bile yanlış soruyu yanlış kişilere sorarak hiçbir şey söylemeyebileceğini gösterir.",
    pre: ["math.stat.descriptive", "math.prob.basics~s"],
    q: [
      "Bir haber sitesi okurlarına bir anket yapıyor ve 100.000 yanıt alıyor. Bu, 1000 kişilik rastgele bir örneklemden daha mı güvenilirdir?",
      "Okul kantinini değerlendirmek için kantinde oturan öğrencilere sormak neden sorunlu olabilir?",
    ],
    cq: [
      "Farklı örnekleme yöntemleri ne zaman tercih edilir?",
      "Hangi yanlılık türleri bir örneklemi temsil edici olmaktan çıkarır?",
      "Bir çalışmanın sonucu hangi koşullarda nedensellik ve genelleme için kullanılabilir?",
    ],
    obj: [
      "Bir araştırma sorusu için uygun örnekleme yöntemini seçer ve gerekçelendirir.",
      "Bir çalışma tasarımındaki yanlılık kaynaklarını belirler ve sonucu nasıl etkilediğini tahmin eder.",
      "Bir simülasyonla örneklem büyüklüğünün ve yanlılığın kestirime etkisini karşılaştırır.",
    ],
    ev: "YORUMLAMA TAHMIN SIMULASYON",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Büyük örneklemin yanlılığı ortadan kaldırdığını sanmak.",
      "Rastgele örneklemenin 'gelişigüzel seçmek' olduğunu düşünmek.",
    ],
    x: [
      "res.method.experimental-design:deneylerde rastgeleleştirme ve kontrol",
      "media.lit.stats-in-news:haberlerdeki anket sonuçlarını değerlendirme",
      "psy.methods:psikolojide örneklem ve genelleme",
    ],
    rel: ["math.stat.inference"],
    tags: ["ornekleme", "yanlilik", "anket"],
  })
  .o("math.stat.chi-square", "Ki-kare testleri ve kategorik veri", {
    d: "Kategorik veride gözlenen ve beklenen sıklıklar; uyum iyiliği, bağımsızlık ve homojenlik için ki-kare testleri, serbestlik derecesi, koşullar ve sonuçların yorumu.",
    w: "Genetik çaprazlama oranlarını, anket yanıtlarını ya da iki kategorik değişkenin ilişkisini sınamanın standart aracıdır; biyoloji ve sosyal bilim araştırmalarında sık kullanılır.",
    pre: ["math.stat.inference"],
    q: [
      "Bir zarı 60 kez attın ve 6 sayısı 16 kez geldi. Zar hileli midir? 'Çok mu, şans mı?' sorusunu nasıl sayısallaştırırsın?",
      "Mendel'in bir çaprazlamasında 3:1 beklenirken 290:110 elde edildi. Bu fark önemli mi?",
    ],
    cq: [
      "Ki-kare istatistiği nasıl hesaplanır ve neyi ölçer?",
      "Uyum iyiliği, bağımsızlık ve homojenlik testleri hangi soruları yanıtlar?",
      "Testin geçerli olması için hangi koşullar gerekir?",
    ],
    obj: [
      "Gözlenen ve beklenen sıklıklardan ki-kare istatistiğini ve serbestlik derecesini hesaplar.",
      "Uygun ki-kare testini seçer, p-değerini bulur ve sonucu bağlam içinde yorumlar.",
      "Beklenen sıklık koşulunu denetler ve sonucun neden-sonuç anlamına gelmediğini açıklar.",
    ],
    ev: "HESAPLAMA VERI_ANALIZI YORUMLAMA",
    t: "VERI_ANALIZI",
    lv: 3,
    sc: "M",
    mis: [
      "Ki-kare testini oranlar ya da yüzdelerle yapmak (sıklıklarla yapılır).",
      "Anlamlı bir bağımsızlık testinin nedensellik kanıtladığını sanmak.",
    ],
    x: [
      "bio.genetics.mendel:çaprazlama oranlarının uyum iyiliği testi",
      "res.stats.pitfalls:p-değerinin yanlış yorumları",
      "prog.python.pandas:çapraz tablolarla kategorik veri analizi",
    ],
    rel: ["math.stat.inference"],
    tags: ["ki-kare", "kategorik", "hipotez-testi"],
  })
  .done();
