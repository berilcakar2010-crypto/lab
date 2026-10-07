import { builder } from "../dsl";

export const BIOLOGY = builder("BIYOLOJI")
  .unit("Hücre", "Hücre biyolojisi")
  .o("bio.cell.structure", "Hücre yapısı ve organeller", {
    pre: ["chem.atoms.structure~h"],
    d: "Prokaryot ve ökaryot hücrelerin temel bileşenleri; çekirdek, mitokondri, endoplazmik retikulum, Golgi ve hücre iskeletinin görevleri.",
    w: "Nöronlar dahil her dokunun davranışı organellerin iş bölümünden doğar; hücre biyolojisinin geri kalanı bu haritanın üzerine kurulur.",
    q: [
      "Bir hücre neden bir metre büyüklüğünde olamaz? Yüzey/hacim oranını düşünerek bir sınır tahmin et.",
      "Bir nöronun aksonu bir metreyi geçebiliyor; bu, ilk sorudaki sınırla çelişir mi?",
    ],
    cq: [
      "Hangi organel hangi işi yapar ve bu işler birbirine nasıl bağlanır?",
      "Hücre boyutunu ve şeklini hangi fiziksel kısıtlar belirler?",
    ],
    obj: [
      "Prokaryot ve ökaryot hücreleri yapısal ölçütlerle ayırt eder.",
      "Bir proteinin üretiminden salgılanmasına kadar izlediği organel yolunu diyagramla gösterir.",
      "Yüzey/hacim oranını hesaplayarak hücre boyutu sınırını açıklar.",
    ],
    ev: "ACIKLAMA DIAGRAM HESAPLAMA",
    t: "KAVRAM",
    lv: 1,
    sc: "M",
    mis: [
      "Hücrenin içi homojen bir 'sıvı torba'dır; oysa sitoplazma hücre iskeletiyle yoğun biçimde örgütlenmiştir.",
      "Mitokondri yalnızca 'enerji santrali'dir; kalsiyum depolama ve apoptozda da rol oynar.",
    ],
    x: [
      "neuro.cell.neuron-anatomy:nöronun özelleşmiş hücre yapısı bu temel üzerine kurulur",
      "math.found.arithmetic:yüzey/hacim oranı ölçekleme hesabı",
    ],
    rel: ["bio.cell.membrane", "bio.molecules"],
    tags: ["hucre", "organel"],
  })
  .o("bio.cell.membrane", "Hücre zarı ve madde taşınımı", {
    pre: ["bio.cell.structure", "chem.solutions~s", "chem.bond.intermolecular~s"],
    d: "Fosfolipit çift katman, difüzyon, osmoz, kanal ve taşıyıcı proteinler, aktif taşıma ve Na⁺/K⁺ pompası.",
    w: "Nöronun dinlenim potansiyeli, böbreğin çalışması ve ilaçların hücreye girişi zar taşınımına dayanır; HH modelindeki iletkenlikler buradaki kanallardır.",
    q: [
      "Tuzlu suya konan bir marul yaprağı neden pörsür? Su hangi yöne, neden hareket eder?",
      "Na⁺/K⁺ pompası durdurulsa nöron hemen mi susar, yoksa bir süre ateşlemeye devam eder mi? Tahmin et.",
    ],
    cq: [
      "Bir molekül zarı hangi yollarla ve hangi enerji bedeliyle geçer?",
      "Derişim farkı ve elektriksel fark taşınımı birlikte nasıl yönlendirir?",
    ],
    obj: [
      "Pasif ve aktif taşımayı enerji kaynağına göre ayırt eder.",
      "Fick yasasıyla basit bir difüzyon akısını hesaplar.",
      "Osmoz deneyinin sonucunu çözelti derişimlerinden tahmin eder.",
      "Na⁺/K⁺ pompasının elektrojenik etkisini yorumlar.",
    ],
    ev: "ACIKLAMA HESAPLAMA TAHMIN DENEY",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Difüzyonda moleküller 'az olan yere gitmek ister'; aslında rastgele hareketin net sonucudur.",
      "İyon kanalları iyonları pompalar; kanallar yalnızca elektrokimyasal gradyan yönünde geçişe izin verir.",
    ],
    x: [
      "neuro.cell.membrane-potential:iyon gradyanları membran potansiyelini doğurur",
      "chem.solutions:derişim ve osmotik basınç",
      "phys.thermo.kinetic-theory:difüzyonun mikroskobik kökeni",
    ],
    ra: ["Membran geçirgenliğinin ilaç dağılımı modellerinde kullanımı"],
    rel: ["bio.cell.signaling", "bio.physiology.systems"],
    vs: ["bio.cell.signaling"],
    tags: ["zar", "difuzyon", "osmoz", "tasinim"],
  })
  .o("bio.molecules", "Biyolojik makromoleküller", {
    pre: ["bio.cell.structure~s", "chem.biochem~s"],
    d: "Karbonhidratlar, lipitler, proteinler ve nükleik asitler; yapı birimleri, bağ türleri ve yapı–işlev ilişkisi.",
    w: "Enzimler, iyon kanalları, reseptörler ve DNA hep bu dört sınıftan gelir; yapı–işlev ilişkisini okumak biyolojinin dilini okumaktır.",
    q: [
      "Bir proteinin amino asit dizisi aynı kalırken ısıtıldığında işlevini kaybetmesi ne anlama gelir?",
      "Yağ ve şeker ikisi de enerji depolar; neden vücut uzun süreli depoda yağı tercih eder?",
    ],
    cq: [
      "Monomerler polimerleri hangi bağlarla oluşturur?",
      "Proteinin dört yapı düzeyi işlevini nasıl belirler?",
    ],
    obj: [
      "Dört makromolekül sınıfını monomer ve bağ türüne göre sınıflandırır.",
      "Protein katlanma düzeylerini ve onları tutan etkileşimleri açıklar.",
      "Bir mutasyonun protein işlevine olası etkisini yapı üzerinden tahmin eder.",
    ],
    ev: "ACIKLAMA TAHMIN DIAGRAM",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Denatürasyon peptit bağlarını koparır; genellikle yalnızca zayıf etkileşimler bozulur.",
      "Lipitler 'kötü' moleküllerdir; zarların ve miyelinin temel yapı taşıdırlar.",
    ],
    x: [
      "chem.biochem:aynı moleküllerin kimyasal temeli",
      "chem.bond.intermolecular:hidrojen bağı ve hidrofobik etki katlanmayı belirler",
    ],
    rel: ["bio.enzymes", "bio.genetics.molecular"],
    tags: ["protein", "lipit", "nukleik-asit"],
  })
  .o("bio.enzymes", "Enzimler ve metabolizma", {
    pre: ["bio.molecules", "chem.kinetics~s"],
    d: "Enzimlerin aktivasyon enerjisini düşürmesi, Michaelis–Menten kinetiği, inhibisyon türleri ve metabolik yolların düzenlenmesi.",
    w: "Metabolizma, ilaç tasarımı ve nörotransmitter yıkımı enzim kinetiğiyle açıklanır; Michaelis–Menten, biyolojide doygunluk gösteren her sürecin şablonudur.",
    q: [
      "Substrat derişimini iki katına çıkarırsan tepkime hızı hep iki katına mı çıkar? Grafiği tahmin edip çiz.",
      "Bir enzim tepkimenin dengesini değiştirebilir mi?",
    ],
    cq: [
      "Enzim hızı substrat derişimine nasıl bağlıdır ve neden doyar?",
      "Yarışmalı ve yarışmasız inhibisyon grafikte nasıl ayırt edilir?",
    ],
    obj: [
      "Michaelis–Menten denklemini yarı-kararlı durum varsayımından türetir.",
      "Deney verisinden Km ve Vmax değerlerini hesaplar.",
      "İnhibisyon türünü kinetik grafiklerden ayırt eder.",
    ],
    ev: "TURETME HESAPLAMA VERI_ANALIZI YORUMLAMA",
    t: "MODELLEME",
    lv: 3,
    sc: "M",
    mis: [
      "Enzimler tepkimenin ΔG değerini değiştirir; yalnızca aktivasyon enerjisini düşürürler.",
      "Km bağlanma afinitesinin tam ölçüsüdür; yalnızca belirli koşullarda yaklaşık olarak öyledir.",
    ],
    x: [
      "chem.kinetics:hız yasaları ve aktivasyon enerjisi",
      "math.ode.first-order:kinetik denklemler diferansiyel denklemdir",
      "neuro.syn.transmission:asetilkolinesteraz sinaptik sinyali sonlandırır",
    ],
    ra: ["Enzim kinetiği parametrelerinin veriye uydurulması"],
    rel: ["bio.energy.respiration", "bio.molecules"],
    tags: ["enzim", "kinetik", "metabolizma"],
  })
  .o("bio.energy.respiration", "Hücresel solunum", {
    pre: ["bio.enzymes", "chem.redox-electrochem~s", "chem.thermo.gibbs~s"],
    d: "Glikoliz, Krebs döngüsü ve oksidatif fosforilasyon; elektron taşıma zinciri ve kemiozmotik ATP sentezi.",
    w: "Beyin vücut enerjisinin orantısız büyük bir kısmını tüketir; iyon pompalarını çalıştıran ATP buradan gelir. Kemiozmoz, zar gradyanından iş çıkarmanın evrensel örneğidir.",
    q: [
      "Glikozu yakmak da solunum da aynı ürünleri verir; o halde hücre neden yanmaz?",
      "Mitokondri zarı sızdıran hale gelirse ATP üretimine ve vücut sıcaklığına ne olur? Tahmin et.",
    ],
    cq: [
      "Glikozdaki enerji hangi adımlarla ATP'ye aktarılır?",
      "Proton gradyanı ATP sentazını nasıl çalıştırır?",
    ],
    obj: [
      "Solunumun evrelerini girdi ve çıktılarıyla diyagramla gösterir.",
      "Redoks potansiyelleri üzerinden elektron akışının yönünü açıklar.",
      "Yaklaşık ATP verimini hesaplar ve neden kesin olmadığını yorumlar.",
    ],
    ev: "DIAGRAM ACIKLAMA HESAPLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "ATP sentezi doğrudan glikozdan olur; büyük kısmı proton gradyanı üzerinden gerçekleşir.",
      "Bitkiler solunum yapmaz; bitkiler de mitokondriyle solunum yapar.",
    ],
    x: [
      "chem.redox-electrochem:elektron taşıma zinciri redoks potansiyellerine göre ilerler",
      "chem.thermo.gibbs:enerji eşleşmesinin termodinamiği",
      "neuro.cell.membrane-potential:proton gradyanı ile iyon gradyanı aynı elektrokimyasal mantık",
    ],
    rel: ["bio.energy.photosynthesis", "bio.enzymes"],
    vs: ["bio.energy.photosynthesis"],
    tags: ["solunum", "atp", "mitokondri"],
  })
  .o("bio.energy.photosynthesis", "Fotosentez", {
    pre: ["bio.enzymes", "bio.energy.respiration~s"],
    d: "Işığa bağlı tepkimeler, fotosistemler ve Calvin döngüsü; ışık enerjisinin kimyasal enerjiye dönüşümü.",
    w: "Yeryüzündeki besin zincirlerinin enerji girişidir; solunumla aynı kemiozmotik ilkeyi ters yönde kullanması karşılaştırmalı düşünmeyi öğretir.",
    q: [
      "Bir ağacın kütlesinin çoğu nereden gelir: topraktan mı, sudan mı, havadan mı? Önce tahmin et.",
    ],
    cq: [
      "Işık enerjisi hangi adımlarda kimyasal enerjiye dönüşür?",
      "Fotosentez ile solunum hangi ortak mekanizmayı paylaşır?",
    ],
    obj: [
      "Işığa bağlı ve ışıktan bağımsız tepkimeleri girdi–çıktı olarak ayırt eder.",
      "Fotosentez ile solunumu karşılaştırmalı bir diyagramda gösterir.",
      "Işık şiddeti ve CO₂ derişiminin hıza etkisini ölçen bir deney tasarlar.",
    ],
    ev: "DIAGRAM DENEY ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Bitki kütlesi topraktan gelir; çoğu havadaki CO₂'den gelir.",
      "Calvin döngüsü karanlıkta çalışır; ışığa bağlı tepkimelerin ürünlerine ihtiyaç duyar.",
    ],
    x: [
      "phys.modern.quantum-intro:foton soğurması ve enerji düzeyleri",
      "chem.redox-electrochem:suyun yükseltgenmesi ve NADP⁺ indirgenmesi",
    ],
    rel: ["bio.energy.respiration", "bio.ecology"],
    vs: ["bio.energy.respiration"],
    tags: ["fotosentez", "kloroplast"],
  })
  .o("bio.cell.signaling", "Hücre sinyalleşmesi", {
    pre: ["bio.cell.membrane", "bio.molecules"],
    d: "Ligand–reseptör etkileşimi, G-proteinine bağlı reseptörler, ikincil haberciler, kinaz kaskadları ve sinyal yükseltme.",
    w: "Nörotransmitterler, hormonlar ve ilaçların çoğu bu yollarla etki eder; nöromodülasyonun ve sinaptik plastisitenin moleküler dili budur.",
    q: [
      "Tek bir adrenalin molekülü nasıl olur da binlerce glikoz molekülünün serbest kalmasına yol açar?",
      "Aynı sinyal molekülü iki farklı hücrede zıt etkiler doğurabilir mi? Nasıl?",
    ],
    cq: [
      "Hücre dışı sinyal hücre içine nasıl aktarılır ve yükseltilir?",
      "Sinyal nasıl sonlandırılır ve neden sonlandırma önemlidir?",
    ],
    obj: [
      "İyonotropik ve metabotropik reseptör yollarını hız ve mekanizma açısından ayırt eder.",
      "Bir kinaz kaskadındaki yükseltme oranını hesaplar.",
      "Bir sinyal yolunu başlangıçtan yanıta kadar diyagramla gösterir.",
    ],
    ev: "DIAGRAM HESAPLAMA ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Reseptör sinyalin ne yapacağını tek başına belirler; yanıt hücrenin içindeki yollara bağlıdır.",
      "Sinyal molekülü hücreye girmelidir; çoğu yüzey reseptörüne bağlanıp dışarıda kalır.",
    ],
    x: [
      "neuro.syn.transmission:sinaptik iletim özelleşmiş hücre sinyalleşmesidir",
      "neuro.syn.neuromodulation:metabotropik reseptörler ve ikincil haberciler",
      "math.found.exp-log:kaskad yükseltmesi üstel büyümedir",
    ],
    rel: ["bio.physiology.endocrine", "bio.cell.membrane"],
    tags: ["sinyal", "reseptor", "kaskad"],
  })
  .o("bio.cell.division", "Hücre döngüsü, mitoz ve mayoz", {
    pre: ["bio.cell.structure"],
    d: "Hücre döngüsünün evreleri ve denetim noktaları, mitozla eşit bölünme, mayozla genetik çeşitlilik.",
    w: "Kalıtımın, gelişimin ve kanserin anlaşılması bölünmenin doğru ve yanlış işlemesine dayanır; olgun nöronların neden bölünmediği de buradan sorulur.",
    q: [
      "Mayozda krossing-over olmasaydı bir insanın kaç farklı gamet üretebileceğini kromozom sayısından tahmin et.",
      "Olgun nöronlar neden çoğunlukla bölünmez; bunun beyin hasarı açısından sonucu ne olur?",
    ],
    cq: [
      "Mitoz ve mayoz hangi amaçlarla ve hangi farklarla gerçekleşir?",
      "Denetim noktaları bozulduğunda ne olur?",
    ],
    obj: [
      "Mitoz ve mayoz evrelerini kromozom sayısını izleyerek diyagramla gösterir.",
      "Bağımsız açılımın ürettiği gamet çeşitliliğini hesaplar.",
      "Denetim noktası kaybının kanserle ilişkisini açıklar.",
    ],
    ev: "DIAGRAM HESAPLAMA ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Kromatit ile kromozom aynı şeydir; sayım kurallarını karıştırmak mayoz hesaplarını bozar.",
      "Mayoz II'de kromozom sayısı yarıya iner; azalma mayoz I'de olur.",
    ],
    x: [
      "math.prob.counting:gamet kombinasyonlarının sayılması",
      "neuro.sys.development:nörogenez ve hücre çoğalması",
    ],
    rel: ["bio.genetics.mendel", "bio.genetics.molecular"],
    vs: ["bio.genetics.mendel"],
    tags: ["mitoz", "mayoz", "hucre-dongusu"],
  })
  .unit("Genetik ve evrim", "Genetik ve evrim")
  .o("bio.genetics.mendel", "Mendel genetiği", {
    pre: ["bio.cell.division", "math.prob.basics"],
    d: "Ayrılma ve bağımsız açılım yasaları, baskınlık türleri, soyağacı analizi ve olasılıkla çaprazlama hesapları.",
    w: "Kalıtsal hastalık riskini hesaplamak ve genetik veriyi yorumlamak için olasılık temelli düşünmeyi öğretir.",
    q: [
      "İki taşıyıcı ebeveynin dört çocuğundan hiçbirinin hasta olmaması mümkün mü? Olasılığı hesaplamadan önce tahmin et.",
    ],
    cq: [
      "Mendel'in oranları mayozdan nasıl doğar?",
      "Bağlantılı genler bağımsız açılımı nasıl bozar?",
    ],
    obj: [
      "Tek ve iki karakterli çaprazlamalarda fenotip oranlarını hesaplar.",
      "Bir soyağacından kalıtım biçimini çıkarır ve gerekçelendirir.",
      "Gözlenen oranların beklenene uyup uymadığını ki-kare testiyle yorumlar.",
    ],
    ev: "HESAPLAMA PROBLEM_COZME YORUMLAMA",
    t: "BECERI",
    lv: 2,
    sc: "M",
    mis: [
      "Baskın alel toplumda daha yaygındır; baskınlık ile sıklık bağımsızdır.",
      "3:1 oranı her ailede tam olarak görülür; küçük örneklerde rastgele sapma beklenir.",
    ],
    x: [
      "math.prob.basics:bağımsız olayların çarpımı",
      "math.stat.inference:ki-kare uygunluk testi",
    ],
    ca: ["Biyoloji olimpiyatlarında soyağacı ve çaprazlama problemleri"],
    rel: ["bio.evolution.popgen", "bio.cell.division"],
    tags: ["genetik", "kalitim", "olasilik"],
  })
  .o("bio.genetics.molecular", "Moleküler genetik: DNA, transkripsiyon, translasyon", {
    pre: ["bio.molecules", "bio.cell.division~s"],
    d: "DNA'nın yapısı ve eşlenmesi, transkripsiyon, RNA işlenmesi, genetik kod ve translasyon; mutasyon türleri.",
    w: "Genden proteine giden yol; iyon kanalı mutasyonlarının (kanalopatiler) nasıl epilepsiye yol açtığını anlamanın ve genetik araçları (optogenetik gibi) kullanmanın temeli.",
    q: [
      "Genetik kod üçlü kodonlardan oluşur; iki harfli kod neden yetmezdi? 20 amino asidi kodlamak için gereken en kısa uzunluğu hesapla.",
    ],
    cq: [
      "Bilgi DNA'dan proteine hangi adımlarla akar?",
      "Hangi mutasyonlar proteini değiştirir, hangileri değiştirmez?",
    ],
    obj: [
      "Bir DNA dizisini mRNA'ya ve amino asit dizisine çevirir.",
      "Nokta, çerçeve kayması ve sessiz mutasyonların etkisini tahmin eder.",
      "Yarı korunumlu eşlenmeyi deneysel kanıtla açıklar.",
    ],
    ev: "PROBLEM_COZME TAHMIN ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Her DNA dizisi bir proteini kodlar; genomun büyük kısmı kodlamayan dizidir.",
      "Sessiz mutasyonlar her zaman etkisizdir; ekleme veya translasyon hızını etkileyebilirler.",
    ],
    x: [
      "math.found.exp-log:kod uzunluğu için 4^n ≥ 20 hesabı",
      "neuro.methods.imaging:genetik olarak kodlanmış kalsiyum göstergeleri",
      "chem.biochem:nükleotit kimyası",
    ],
    rel: ["bio.genetics.regulation", "bio.molecules"],
    tags: ["dna", "rna", "protein-sentezi"],
  })
  .o("bio.genetics.regulation", "Gen ifadesinin düzenlenmesi", {
    pre: ["bio.genetics.molecular"],
    d: "Operon modeli, transkripsiyon faktörleri, epigenetik değişiklikler ve hücre tipine özgü gen ifadesi.",
    w: "Aynı genoma sahip bir nöron ile bir karaciğer hücresinin neden farklı olduğunu açıklar; uzun süreli belleğin gen ifadesi gerektirmesi de buraya bağlanır.",
    q: [
      "Vücudundaki her hücre aynı DNA'yı taşıyorsa, bir nöron nasıl nöron olarak kalır?",
    ],
    cq: [
      "Gen ifadesi hangi düzeylerde açılıp kapatılır?",
      "Geri besleme döngüleri gen ağlarında nasıl kararlı durumlar üretir?",
    ],
    obj: [
      "lac operonunun farklı koşullardaki davranışını tahmin eder.",
      "Basit bir gen düzenleme devresini diferansiyel denklemle modeller.",
      "Epigenetik ve genetik değişikliği kalıtım açısından ayırt eder.",
    ],
    ev: "TAHMIN MODELLEME ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Genler ya tam açık ya tam kapalıdır; ifade düzeyi sürekli ve gürültülüdür.",
      "Epigenetik değişiklikler DNA dizisini değiştirir; dizi aynı kalır, erişilebilirlik değişir.",
    ],
    x: [
      "math.dyn.stability:çift kararlı gen anahtarları",
      "neuro.cog.learning-memory:uzun süreli bellek yeni protein sentezi gerektirir",
    ],
    rel: ["neuro.sys.development", "bio.genetics.molecular"],
    tags: ["gen-ifadesi", "epigenetik"],
  })
  .o("bio.evolution", "Evrim ve doğal seçilim", {
    pre: ["bio.genetics.mendel", "bio.genetics.molecular~s"],
    d: "Varyasyon, kalıtım ve seçilimle uyum; evrimin kanıtları, türleşme ve filogenetik ağaçların okunması.",
    w: "Biyolojideki her 'neden' sorusunun nihai çerçevesi; beyin yapılarının türler arası karşılaştırılması da evrimsel düşünce ister.",
    q: [
      "Antibiyotik kullanımı bakterilerin 'direnç geliştirmesine' mi yol açar, yoksa dirençli olanları mı seçer? Fark neden önemli?",
    ],
    cq: [
      "Doğal seçilim hangi koşullar sağlandığında kaçınılmazdır?",
      "Bir filogenetik ağaç neyi gösterir, neyi göstermez?",
    ],
    obj: [
      "Doğal seçilimin üç koşulunu bir örnek üzerinde uygular.",
      "Filogenetik bir ağaçtan ortak ata ilişkilerini doğru yorumlar.",
      "Evrimin farklı kanıt türlerini değerlendirir ve karşılaştırır.",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Bireyler yaşamları boyunca evrimleşir; evrim popülasyon düzeyinde olur.",
      "Evrim bir amaca ya da 'en gelişmiş' türe doğru ilerler.",
      "İnsan şempanzeden evrimleşti; ortak bir atayı paylaşırlar.",
    ],
    x: [
      "math.prob.stochastic:rastgele değişim ve seçilim",
      "neuro.sys.neuroanatomy:beyin yapılarının evrimsel korunumu",
    ],
    rel: ["bio.evolution.popgen", "bio.ecology"],
    tags: ["evrim", "secilim", "filogeni"],
  })
  .o("bio.evolution.popgen", "Popülasyon genetiği: Hardy–Weinberg", {
    pre: ["bio.evolution", "bio.genetics.mendel", "math.prob.basics"],
    d: "Alel ve genotip frekansları, Hardy–Weinberg dengesi ve varsayımları, genetik sürüklenme, göç ve seçilimin frekanslara etkisi.",
    w: "Evrimi nicel hale getiren ilk matematiksel model; nüfustaki taşıyıcı oranlarını tahmin etmek için kullanılır.",
    q: [
      "Nadir bir çekinik hastalık her 10 000 kişiden birinde görülüyorsa taşıyıcıların oranı sence %1'den çok mu az mı? Önce tahmin et, sonra hesapla.",
    ],
    cq: [
      "Hiçbir evrimsel kuvvet yoksa alel frekansları neden sabit kalır?",
      "Küçük popülasyonlarda sürüklenme neden daha güçlüdür?",
    ],
    obj: [
      "Hardy–Weinberg dengesini olasılık kurallarından türetir.",
      "Fenotip verisinden alel ve taşıyıcı frekanslarını hesaplar.",
      "Genetik sürüklenmeyi basit bir Python simülasyonuyla gösterir.",
    ],
    ev: "TURETME HESAPLAMA SIMULASYON",
    t: "MODELLEME",
    lv: 3,
    sc: "M",
    mis: [
      "Baskın alel zamanla yayılıp çekiniği yok eder; seçilim yoksa frekanslar sabit kalır.",
      "Hardy–Weinberg gerçek popülasyonları tam olarak betimler; bir sıfır hipotezidir.",
    ],
    x: [
      "math.prob.markov:Wright–Fisher modeli bir Markov zinciridir",
      "prog.sci.simulation:sürüklenmenin Monte Carlo simülasyonu",
    ],
    ra: ["Popülasyon verisinde seçilim izlerinin aranması"],
    rel: ["bio.genetics.mendel", "bio.evolution"],
    tags: ["populasyon-genetigi", "hardy-weinberg"],
  })
  .unit("Organizma ve ekoloji", "Organizma ve ekoloji")
  .o("bio.physiology.systems", "İnsan fizyolojisi ve homeostaz", {
    pre: ["bio.cell.membrane", "bio.cell.signaling~s"],
    d: "Dolaşım, solunum, boşaltım ve sindirim sistemlerinin işleyişi; negatif geri beslemeyle homeostaz.",
    w: "Organizma düzeyinde düşünmeyi kazandırır; sinir sistemi bu sistemlerin denetleyicisidir ve geri besleme kavramı kontrol kuramıyla ortaktır.",
    q: [
      "Sıcak bir günde terlemek seni serinletir; peki çok nemli bir havada neden daha az işe yarar?",
      "Kan basıncını ayarlayan bir sistemde geri besleme gecikmesi çok büyük olursa ne olur? Tahmin et.",
    ],
    cq: [
      "Vücut iç ortamını hangi geri besleme döngüleriyle sabit tutar?",
      "Organ sistemleri birbirine nasıl bağımlıdır?",
    ],
    obj: [
      "Bir homeostatik döngüyü algılayıcı, denetleyici ve etkileyici olarak diyagramla gösterir.",
      "Negatif ve pozitif geri beslemeyi örneklerle ayırt eder.",
      "Kalp debisi ve damar direnci hesabını devre benzetmesiyle yapar.",
    ],
    ev: "DIAGRAM ACIKLAMA HESAPLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "L",
    mis: [
      "Homeostaz değerlerin hiç değişmemesidir; değerler bir ayar noktası etrafında dalgalanır.",
      "Kalp kanı 'emerek' çeker; dolaşım basınç farklarıyla yürür.",
    ],
    x: [
      "phys.em.circuits-dc:dolaşım ve Ohm yasası benzetmesi",
      "phys.mech.fluids:kan akışı ve basınç",
      "math.dyn.stability:geri beslemeli sistemlerde kararlılık",
    ],
    rel: ["bio.physiology.endocrine", "neuro.sys.motor"],
    tags: ["fizyoloji", "homeostaz", "geri-besleme"],
  })
  .o("bio.physiology.endocrine", "Endokrin sistem", {
    pre: ["bio.physiology.systems", "bio.cell.signaling"],
    d: "Hormon sınıfları, hipotalamus–hipofiz ekseni, hormon geri besleme döngüleri ve stres yanıtı.",
    w: "Sinir sistemi ile hormonal sistemin ortak denetimini gösterir; stres, uyku ve duygu konularında nörobilimle doğrudan kesişir.",
    q: [
      "Sinir sinyali milisaniyelerde, hormon sinyali dakikalar–saatlerde etki eder. Vücut neden iki ayrı iletişim sistemine ihtiyaç duyar?",
    ],
    cq: [
      "Hipotalamus–hipofiz ekseni nasıl bir hiyerarşik geri besleme sistemi kurar?",
      "Steroid ve peptit hormonları hücreye etki biçiminde nasıl ayrılır?",
    ],
    obj: [
      "Bir hormon ekseninin geri besleme döngüsünü diyagramla gösterir.",
      "Bir hormon bozukluğunun eksen boyunca etkilerini tahmin eder.",
      "Sinirsel ve hormonal iletişimi hız, menzil ve kalıcılık açısından karşılaştırır.",
    ],
    ev: "DIAGRAM TAHMIN ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Hormonlar yalnızca hedef organa gider; kanla her yere ulaşır, yalnızca reseptörü olan hücreler yanıt verir.",
      "Kortizol yalnızca 'kötü' bir stres hormonudur; normal günlük ritimde de gereklidir.",
    ],
    x: [
      "neuro.cog.emotion:HPA ekseni ve stres yanıtı",
      "neuro.syn.neuromodulation:hormon ve nöromodülatörlerin örtüşen etkileri",
      "math.ode.first-order:hormon yarılanma ömrü ve üstel bozunma",
    ],
    rel: ["bio.cell.signaling", "neuro.cog.sleep"],
    tags: ["hormon", "endokrin", "stres"],
  })
  .o("bio.immune", "Bağışıklık sistemi", {
    pre: ["bio.physiology.systems", "bio.molecules"],
    opt: true,
    d: "Doğuştan ve edinsel bağışıklık, antikorlar, T ve B hücreleri, aşıların çalışma ilkesi.",
    w: "Aşı, otoimmün hastalık ve nöroinflamasyon konularını anlamak için gerekli; mikroglia beynin bağışıklık hücreleridir.",
    q: [
      "Bağışıklık sistemi daha önce hiç görmediği bir virüsü nasıl tanıyabilir? 'Önceden hazırlanmış çeşitlilik' fikrini düşün.",
    ],
    cq: [
      "Bağışıklık sistemi kendini yabancıdan nasıl ayırır?",
      "Aşılar bağışıklık belleğini nasıl oluşturur?",
    ],
    obj: [
      "Doğuştan ve edinsel bağışıklığı hız ve özgüllük açısından ayırt eder.",
      "Birincil ve ikincil yanıt grafiklerini yorumlar.",
      "Antikor çeşitliliğinin kombinatoryal kökenini hesapla gösterir.",
    ],
    ev: "ACIKLAMA YORUMLAMA HESAPLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Antibiyotikler virüslere karşı etkilidir.",
      "Beyin bağışıklık sisteminden tamamen yalıtılmıştır; mikroglia ve sınırlı geçiş vardır.",
    ],
    x: [
      "math.prob.counting:V(D)J yeniden düzenlenmesinin çeşitlilik hesabı",
      "neuro.cell.neuron-anatomy:mikroglia ve glia işlevleri",
    ],
    rel: ["bio.physiology.systems"],
    tags: ["bagisiklik", "asi"],
  })
  .o("bio.ecology", "Ekoloji ve popülasyon dinamiği", {
    pre: ["bio.evolution~s", "math.ode.first-order~c"],
    d: "Üstel ve lojistik büyüme, av–avcı (Lotka–Volterra) etkileşimleri, besin ağları ve enerji akışı.",
    w: "Diferansiyel denklemlerle biyolojik sistem modellemenin en temiz örneği; aynı matematik nöron popülasyonlarında da karşına çıkar.",
    q: [
      "Avcıların hepsi ortadan kalkarsa av popülasyonu sonsuza kadar büyür mü? Neyin onu durduracağını tahmin et.",
      "Av–avcı sayıları neden genellikle faz farkıyla dalgalanır?",
    ],
    cq: [
      "Popülasyon büyümesi hangi koşullarda doyar?",
      "Etkileşen popülasyonlar nasıl salınım üretir?",
    ],
    obj: [
      "Lojistik büyüme denklemini çözer ve taşıma kapasitesini yorumlar.",
      "Lotka–Volterra sistemini sayısal olarak simüle eder.",
      "Bir besin ağındaki enerji aktarımını yüzdelerle hesaplar.",
    ],
    ev: "MODELLEME SIMULASYON HESAPLAMA",
    t: "MODELLEME",
    lv: 3,
    sc: "M",
    mis: [
      "Ekosistemler kendiliğinden 'dengeye' gelir ve orada kalır.",
      "Avcı ve av popülasyonları aynı anda tepe yapar.",
    ],
    x: [
      "math.ode.systems:Lotka–Volterra faz uzayı",
      "math.ode.numerical:popülasyon modellerinin sayısal çözümü",
      "neuro.comp.networks:uyarıcı–baskılayıcı popülasyonlar av–avcı benzeri dinamik gösterir",
    ],
    ra: ["Popülasyon modellerinin saha verisine uydurulması"],
    rel: ["bio.evolution", "bio.energy.photosynthesis"],
    tags: ["ekoloji", "lotka-volterra", "populasyon"],
  })
  .o("bio.methods.lab", "Biyoloji laboratuvar yöntemleri ve deney tasarımı", {
    pre: ["bio.cell.structure", "res.method.experimental-design~s"],
    d: "Mikroskopi, PCR, jel elektroforezi, hücre kültürü temelleri; biyolojik deneylerde kontrol grupları, tekrarlar ve değişkenlik.",
    w: "Biyolojik veride değişkenlik büyüktür; deneyi doğru kurmayı bilmek, makalelerdeki iddiaları değerlendirmenin ve kendi projeni yapmanın ön koşuludur.",
    q: [
      "Bir ilacın hücreleri öldürdüğünü gösteren bir deneyde hangi kontrol olmazsa sonuç anlamsızlaşır?",
      "Üç kuyucukta tekrarlanan bir ölçüm 'n = 3' midir, yoksa aynı hücre kültüründen geliyorsa 'n = 1' mi?",
    ],
    cq: [
      "Biyolojik ve teknik tekrar arasındaki fark nedir?",
      "Bir yöntem hangi soruyu yanıtlayabilir, hangisini yanıtlayamaz?",
    ],
    obj: [
      "Pozitif ve negatif kontrolleri içeren bir deney tasarlar.",
      "Jel elektroforezi görüntüsünden parça boyutlarını yorumlar.",
      "Biyolojik ve teknik tekrarı ayırt ederek örneklem büyüklüğünü doğru belirler.",
    ],
    ev: "DENEY YORUMLAMA VERI_ANALIZI",
    t: "DENEY",
    lv: 3,
    sc: "M",
    mis: [
      "Daha çok teknik tekrar her zaman daha güçlü kanıttır; bağımsız biyolojik tekrarlar gerekir.",
      "Kontrol grubu yalnızca 'hiçbir şey yapılmayan' gruptur; araç (vehicle) kontrolü de gerekir.",
    ],
    x: [
      "res.method.experimental-design:kontrol, rastgeleleştirme ve güç",
      "res.stats.pitfalls:sözde tekrar ve çoklu karşılaştırma",
      "math.stat.inference:grup farklarının testi",
    ],
    ra: ["Okul laboratuvarında küçük bir biyoloji deneyinin tasarlanması"],
    ca: ["Biyoloji olimpiyatlarının pratik bölümleri"],
    rel: ["neuro.methods.electrophysiology", "res.method.experimental-design"],
    tags: ["laboratuvar", "deney-tasarimi", "pcr"],
  })
  .done();
