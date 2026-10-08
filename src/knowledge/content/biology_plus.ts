import { builder } from "../dsl";

export const BIOLOGY_PLUS = builder("BIYOLOJI")
  // ---------------------------------------------------------------------------
  .unit("Organizma ve ekoloji", "Organizma ve ekoloji")
  .o("bio.anatomy.circulatory", "Dolaşım sistemi", {
    d: "Kalbin yapısı ve kalp döngüsü, büyük ve küçük dolaşım, damar türleri, kan basıncı, kanın bileşenleri ve kılcallarda madde alışverişi; omurgalılarda dolaşım sistemlerinin karşılaştırılması.",
    w: "Oksijen ve besinin her hücreye nasıl ulaştığını açıklar; akışkanlar fiziğinin, kan basıncı ölçümünün ve egzersiz fizyolojisinin biyolojideki karşılığıdır.",
    pre: ["bio.physiology.systems"],
    q: [
      "Kalbin sol karıncığının duvarı sağdakinden çok daha kalındır. Neden? Kanın nereye gittiğini düşünerek tahmin et.",
      "Bir damarın yarıçapı yarıya inerse içinden geçen kan akışı yarıya mı iner, çok daha fazla mı azalır?",
    ],
    cq: [
      "Kalp döngüsünde kapakçıklar ve basınç değişimleri nasıl sıralanır?",
      "Atardamar, toplardamar ve kılcalların yapısı işlevleriyle nasıl uyumludur?",
      "Kılcallarda sıvı ve madde alışverişini hangi kuvvetler belirler?",
    ],
    obj: [
      "Kanın vücuttaki yolunu kalp odacıkları, kapakçıklar ve damarlar üzerinden diyagramla izler.",
      "Bir kalp döngüsü basınç–zaman grafiğinde kapakçıkların açılıp kapandığı anları yorumlar.",
      "Damar yarıçapındaki değişimin akışa etkisini basit bir akış modeliyle tahmin eder.",
      "Balık, kurbağa ve memeli dolaşım sistemlerini verimlilik bakımından karşılaştırır.",
    ],
    ev: "DIAGRAM YORUMLAMA TAHMIN",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Atardamarların her zaman oksijenli, toplardamarların her zaman oksijensiz kan taşıdığını sanmak (akciğer damarları tersidir).",
      "Toplardamarlardaki kanın gerçekten mavi olduğunu düşünmek.",
    ],
    x: [
      "phys.mech.fluids:basınç, akış ve damar direnci",
      "phys.em.circuits-dc:dolaşım ile devre arasında basınç–gerilim, akış–akım benzetmesi",
    ],
    ca: ["Biyoloji olimpiyatında kalp döngüsü grafik soruları"],
    rel: ["bio.anatomy.respiratory", "bio.immune"],
    tags: ["kalp", "dolaşım", "kan-basıncı"],
  })
  .o("bio.anatomy.respiratory", "Solunum sistemi ve gaz değişimi", {
    d: "Solunum yollarının yapısı, soluk alıp verme mekaniği, alveollerde difüzyonla gaz değişimi, kısmi basınç, hemoglobinin oksijen bağlama eğrisi ve solunumun sinirsel denetimi.",
    w: "Hücresel solunumun ihtiyaç duyduğu oksijenin nasıl sağlandığını açıklar; gaz yasalarının ve difüzyonun canlı bir uygulamasıdır.",
    pre: ["bio.physiology.systems", "chem.gas.laws~s"],
    q: [
      "Nefes almak için akciğerleri 'şişirmek' mi gerekir, yoksa göğüs boşluğunu genişletmek mi? Bir şırınga düşün.",
      "Yüksek bir dağın tepesinde havadaki oksijen yüzdesi deniz seviyesiyle neredeyse aynıdır. O hâlde neden nefes nefese kalırsın?",
    ],
    cq: [
      "Soluk alıp verme basınç farklarıyla nasıl gerçekleşir?",
      "Alveollerin yapısı difüzyon hızını nasıl en büyükler?",
      "Hemoglobinin S biçimli bağlanma eğrisi oksijen taşınmasında neden avantajlıdır?",
    ],
    obj: [
      "Boyle yasasıyla soluk alıp vermede hacim–basınç ilişkisini açıklar.",
      "Fick difüzyon ilkesini kullanarak alveol yüzey alanı ve zar kalınlığının gaz değişimine etkisini tahmin eder.",
      "Oksijen–hemoglobin ayrışma eğrisini yorumlar ve pH ile sıcaklığın eğriyi nasıl kaydırdığını açıklar.",
    ],
    ev: "ACIKLAMA YORUMLAMA TAHMIN",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Soluk vermenin tamamen karbondioksit, soluk almanın tamamen oksijen olduğunu sanmak.",
      "Solunumu (gaz değişimi) hücresel solunumla aynı süreç saymak.",
      "Solunum dürtüsünün esas olarak düşük oksijenle tetiklendiğini düşünmek (çoğunlukla CO₂ belirleyicidir).",
    ],
    x: [
      "chem.gas.laws:Boyle ve Dalton yasaları ve kısmi basınç",
      "bio.energy.respiration:dışsal solunum hücresel solunumun oksijenini sağlar",
      "earth.atm.structure:yükseklikle atmosfer basıncının azalması",
    ],
    ca: ["Biyoloji olimpiyatında ayrışma eğrisi ve kısmi basınç problemleri"],
    rel: ["bio.anatomy.circulatory"],
    tags: ["akciğer", "gaz-değişimi", "hemoglobin"],
  })
  .o("bio.anatomy.digestive", "Sindirim ve beslenme", {
    d: "Mekanik ve kimyasal sindirim, sindirim kanalı ve yardımcı organlar, sindirim enzimleri ve bunların koşulları, emilim ve yüzey alanı, makro ve mikro besinler, sindirimin hormonal denetimi.",
    w: "Enzim kinetiği ve zar taşınımının organ düzeyinde nasıl işlediğini gösterir; beslenme iddialarını biyokimyaya dayanarak değerlendirmeni sağlar.",
    pre: ["bio.physiology.systems", "bio.enzymes"],
    q: [
      "Mide pH'ı yaklaşık 2 iken ince bağırsak bazik ortamdadır. Midede çalışan bir enzim bağırsakta da çalışır mı? Neden?",
      "İnce bağırsak yaklaşık birkaç metre uzunluğunda ama iç yüzeyi bir tenis kortu büyüklüğünde sayılır. Bu nasıl mümkün?",
    ],
    cq: [
      "Her besin grubu hangi enzimlerle, nerede ve hangi ürünlere sindirilir?",
      "Emilim yüzeyi hangi yapılarla büyütülür?",
      "Sindirim hormonlarla nasıl koordine edilir?",
    ],
    obj: [
      "Karbonhidrat, protein ve yağların sindirimini enzim, organ ve ürünleriyle tablo hâlinde düzenler.",
      "pH ve sıcaklığın enzim etkinliğine etkisini bir deney verisinden yorumlar.",
      "Villus ve mikrovillusların yüzey alanı–hacim ilişkisi üzerindeki etkisini hesapla gösterir.",
    ],
    ev: "DIAGRAM DENEY YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Sindirimin büyük kısmının midede gerçekleştiğini sanmak.",
      "Safra sıvısının yağları kimyasal olarak parçalayan bir enzim olduğunu düşünmek (yağları emülsiyonlaştırır).",
    ],
    x: [
      "chem.acid-base:mide asidi ve bağırsaktaki bikarbonat ile pH",
      "chem.biochem:makromoleküllerin hidrolizi",
    ],
    ra: ["Amilaz etkinliğine pH etkisini ölçen basit bir deney"],
    rel: ["bio.molecules", "bio.anatomy.excretory"],
    tags: ["sindirim", "enzim", "beslenme"],
  })
  .o("bio.anatomy.excretory", "Boşaltım ve osmoregülasyon", {
    d: "Böbrek ve nefronun yapısı, süzülme, geri emilim ve salgılama, karşı akım mekanizması, ADH ve aldosteron ile su–tuz dengesi; farklı canlılarda azotlu atıklar ve osmoregülasyon.",
    w: "Homeostazın en net örneklerinden biridir; zar taşınımı, ozmoz ve geri bildirim döngülerini bir organda birleştirir.",
    pre: ["bio.physiology.systems", "bio.cell.membrane"],
    q: [
      "Böbrekler günde yaklaşık 180 litre sıvı süzer ama yalnızca 1–2 litre idrar oluşur. Geri kalanı nereye gider ve neden önce süzülür?",
      "Deniz balığı ile tatlı su balığı su dengesi için zıt sorunlarla karşılaşır. Her biri ne yapmalı?",
    ],
    cq: [
      "Nefronun her bölümünde hangi maddeler nasıl taşınır?",
      "Karşı akım mekanizması derişik idrar üretmeyi nasıl sağlar?",
      "Hormonlar su ve tuz dengesini geri bildirimle nasıl ayarlar?",
    ],
    obj: [
      "Nefron boyunca süzülme, geri emilim ve salgılamayı bir diyagram üzerinde konumlandırır.",
      "Dehidrasyon durumunda ADH düzenlemesini negatif geri bildirim döngüsüyle açıklar.",
      "Farklı ortamlardaki canlıların osmoregülasyon stratejilerini ozmoz ilkesiyle karşılaştırır.",
    ],
    ev: "DIAGRAM ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Böbreğin yalnızca atıkları süzdüğünü, gerekli maddeleri baştan ayırdığını sanmak.",
      "Çok su içmenin kandaki tuz derişimini hiç etkilemediğini düşünmek.",
    ],
    x: [
      "chem.solutions:ozmotik basınç ve derişim",
      "math.ode.first-order:geri bildirimle dengeye dönüşün basit modeli",
    ],
    ca: ["Biyoloji olimpiyatında nefron ve hormon düzenleme soruları"],
    rel: ["bio.physiology.endocrine", "bio.cell.membrane"],
    tags: ["böbrek", "nefron", "homeostaz"],
  })
  .o("bio.anatomy.musculoskeletal", "Kas ve iskelet sistemi", {
    d: "Kemik dokusu ve eklemler, iskelet kasının yapısı, kayan filamentler modeli, uyarılma–kasılma eşleşmesi ve kalsiyumun rolü, kas türleri ve kas–kemik kaldıraç sistemleri.",
    w: "Moleküler motorlardan vücut hareketine kadar ölçekleri birleştirir; tork ve kaldıraç fiziğinin biyolojideki doğrudan uygulamasıdır.",
    pre: ["bio.physiology.systems", "phys.mech.torque~c"],
    q: [
      "Pazı kası dirseğe çok yakın bağlanır; bu yüzden elinde 5 kg tutmak için kas çok daha büyük bir kuvvet üretmek zorunda kalır. Evrim neden böyle 'kötü' bir tasarım seçmiş olabilir?",
      "Kaslar yalnızca çekebilir, itemez. O hâlde kolunu nasıl hem bükersin hem düzeltirsin?",
    ],
    cq: [
      "Sarkomer kısalırken aktin ve miyozin filamentlerinde ne olur?",
      "Bir sinir uyarısı kas kasılmasına hangi adımlarla dönüşür?",
      "Vücuttaki kaldıraçlar kuvvet ve hız arasında nasıl bir ödünleşim yapar?",
    ],
    obj: [
      "Kayan filamentler modelini sarkomer diyagramı üzerinde açıklar ve ATP ile kalsiyumun rolünü belirtir.",
      "Ön kol kaldıracında tork dengesinden kasın üretmesi gereken kuvveti hesaplar.",
      "İskelet, düz ve kalp kasını yapı ve denetim bakımından karşılaştırır.",
    ],
    ev: "DIAGRAM HESAPLAMA ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Kas kasılırken filamentlerin kendisinin kısaldığını sanmak.",
      "Kemiklerin cansız, değişmeyen yapılar olduğunu düşünmek.",
    ],
    x: [
      "phys.mech.torque:ön kol bir kaldıraçtır ve tork dengesiyle çözülür",
      "neuro.sys.motor:motor nöronlar ve hareket kontrolü",
      "neuro.syn.transmission:sinir–kas kavşağında asetilkolin iletimi",
    ],
    rel: ["bio.cell.signaling"],
    tags: ["kas", "iskelet", "sarkomer"],
  })
  .o("bio.reproduction", "Üreme ve embriyonik gelişim", {
    d: "Eşeyli ve eşeysiz üreme, gametlerin oluşumu, döllenme, insanda üreme sisteminin hormonal düzenlenmesi, embriyonik gelişimin evreleri (yarıklanma, gastrulasyon, organogenez) ve hücre farklılaşması.",
    w: "Tek bir hücreden karmaşık bir organizmanın nasıl oluştuğunu açıklar; hücre bölünmesi, gen düzenlemesi ve hormonlar burada birleşir.",
    pre: ["bio.cell.division", "bio.physiology.endocrine~s"],
    q: [
      "Vücudundaki her hücre aynı DNA'yı taşıyor; yine de bir nöron ile bir karaciğer hücresi çok farklı. Bu farklılık gelişim sırasında nasıl ortaya çıkıyor?",
      "Eşeysiz üreme çok daha hızlıyken birçok canlı neden eşeyli ürer? Bir avantaj tahmin et.",
    ],
    cq: [
      "Eşeyli üremenin genetik çeşitlilik açısından avantajı nedir?",
      "Üreme hormonları geri bildirim döngüleriyle nasıl düzenlenir?",
      "Embriyoda hücreler nasıl farklı kaderlere yönlenir?",
    ],
    obj: [
      "Spermatogenez ve oogenezi mayoz bölünmeyle ilişkilendirerek karşılaştırır.",
      "Bir hormon düzeyi grafiğinden döngünün evrelerini ve geri bildirim ilişkilerini yorumlar.",
      "Embriyonik gelişimin evrelerini sıralar ve gastrulasyonda oluşan üç tabakanın türevlerini eşleştirir.",
    ],
    ev: "DIAGRAM YORUMLAMA ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Her hücrenin farklı genler taşıdığı için farklılaştığını sanmak (aynı genler farklı ifade edilir).",
      "Eşeyli üremenin her durumda eşeysiz üremeden 'üstün' olduğunu düşünmek.",
    ],
    x: [
      "psy.development:doğum öncesi gelişim yaşam boyu gelişimin ilk evresidir",
      "neuro.sys.development:sinir sisteminin embriyonik gelişimi",
    ],
    rel: ["bio.genetics.regulation", "bio.cell.division"],
    tags: ["üreme", "embriyo", "farklılaşma"],
  })
  .o("bio.plants.structure", "Bitki yapısı, taşıma ve büyüme", {
    d: "Kök, gövde ve yaprağın doku yapısı, ksilem ve floem, terleme–çekme kuramı ve kök basıncı, floemde basınç–akış modeli, stomaların denetimi, birincil ve ikincil büyüme.",
    w: "Yüz metrelik bir ağacın suyu pompasız nasıl tepeye çıkardığını açıklar; su potansiyeli, kılcallık ve kohezyon fiziğini canlı bir sistemde birleştirir.",
    pre: ["bio.cell.structure", "bio.energy.photosynthesis~s"],
    q: [
      "En iyi vakum pompası bile suyu yaklaşık 10 metreden yükseğe çekemez. Peki 100 metrelik bir sekoya ağacı suyu tepesine nasıl ulaştırır?",
      "Sıcak, kuru ve rüzgârlı bir günde bir bitki stomalarını açık mı tutmalı, kapalı mı? Ne kazanır, ne kaybeder?",
    ],
    cq: [
      "Su kökten yaprağa hangi kuvvetlerle taşınır?",
      "Floemde şeker kaynaktan havuza nasıl taşınır?",
      "Stomalar fotosentez ile su kaybı arasındaki ödünleşimi nasıl yönetir?",
    ],
    obj: [
      "Su potansiyeli farklarından suyun akış yönünü tahmin eder.",
      "Terleme–çekme kuramını kohezyon, adezyon ve gerilim kavramlarıyla açıklar.",
      "Basınç–akış modelini bir kaynak–havuz diyagramıyla gösterir.",
      "Çevre koşullarının terleme hızına etkisini ölçen bir deney tasarlar.",
    ],
    ev: "TAHMIN DIAGRAM DENEY",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Suyun ağaçta esas olarak kök basıncıyla yukarı itildiğini sanmak.",
      "Bitkilerin kütlesinin büyük ölçüde topraktan geldiğini düşünmek (çoğu havadaki CO₂'den gelir).",
    ],
    x: [
      "phys.mech.fluids:basınç, kılcallık ve negatif basınç altında su sütunu",
      "chem.bond.intermolecular:su moleküllerinin kohezyonu ve hidrojen bağları",
    ],
    ra: ["Potometre ile terleme hızı ölçümü"],
    rel: ["bio.plants.hormones", "bio.energy.photosynthesis"],
    tags: ["bitki", "ksilem", "terleme"],
  })
  .o("bio.plants.hormones", "Bitki hormonları ve tepkiler", {
    d: "Oksin, giberelin, sitokinin, absisik asit ve etilenin başlıca etkileri; fototropizma ve gravitropizma, fotoperiyodizm ve fitokrom, bitkilerin çevresel strese tepkisi.",
    w: "Sinir sistemi olmayan bir canlının çevresini nasıl 'algılayıp' tepki verdiğini gösterir; tarımda ve meyve olgunlaştırmada doğrudan uygulanır.",
    pre: ["bio.plants.structure", "bio.cell.signaling~s"],
    q: [
      "Bir saksı bitkisini pencereye koyarsan gövdesi ışığa doğru eğilir. Bitkinin gözü yok; ışığın yönünü nasıl 'bilir'?",
      "Olgun bir muzu ham avokadoların yanına kâğıt torbaya koyarsan avokadolar daha hızlı olgunlaşır. Neden?",
    ],
    cq: [
      "Oksin fototropizmada hücre uzamasını nasıl yönlendirir?",
      "Bitkiler gün uzunluğunu nasıl ölçer ve çiçeklenmeyi nasıl zamanlar?",
      "Hormonlar strese karşı tepkileri nasıl koordine eder?",
    ],
    obj: [
      "Klasik koleoptil deneylerinin sonuçlarını oksin dağılımıyla yorumlar.",
      "Başlıca bitki hormonlarını etkileriyle eşleştirir ve tarımsal kullanımlarına örnek verir.",
      "Fotoperiyot deney verisinden bir bitkinin kısa gün ya da uzun gün bitkisi olduğunu çıkarır.",
    ],
    ev: "YORUMLAMA DENEY ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "S",
    mis: [
      "Bitkilerin ışığa doğru 'bilinçli olarak' hareket ettiğini sanmak.",
      "Her hormonun yalnızca tek bir etkisi olduğunu düşünmek.",
    ],
    x: [
      "bio.physiology.endocrine:bitki ve hayvan hormonal sinyalleşmesinin karşılaştırılması",
      "gk.geo.agriculture:tarımda bitki büyüme düzenleyicilerinin kullanımı",
    ],
    rel: ["bio.cell.signaling"],
    tags: ["bitki-hormonu", "tropizma", "oksin"],
  })
  .o("bio.micro.microbes", "Mikroorganizmalar: bakteriler, virüsler, mantarlar", {
    d: "Bakterilerin yapısı ve üremesi, bakteriyel büyüme eğrisi, yatay gen aktarımı, virüslerin yapısı ve litik/lizojenik döngü, mantarlar ve protistler; mikropların ekolojideki ve sağlıktaki rolleri, antibiyotik direnci.",
    w: "Salgınlardan fermentasyona, azot döngüsünden biyoteknolojiye kadar mikroorganizmaların rolünü açıklar; üstel büyümenin gerçek bir örneğidir.",
    pre: ["bio.cell.structure", "bio.genetics.molecular~s"],
    q: [
      "Bir bakteri 20 dakikada bir bölünürse tek bir bakteriden 24 saatte kaç bakteri olur? Bu neden hiç gerçekleşmez?",
      "Antibiyotikler bakterileri öldürür ama soğuk algınlığına karşı işe yaramaz. Neden?",
    ],
    cq: [
      "Bakteriyel büyüme eğrisinin evreleri nelerdir ve neden ortaya çıkar?",
      "Virüs canlı mıdır? Hangi ölçütlere göre?",
      "Antibiyotik direnci nasıl ortaya çıkar ve yayılır?",
    ],
    obj: [
      "Bakteriyel büyüme verisini yarı logaritmik grafikte çizer ve evreleri belirler.",
      "Prokaryot, ökaryot ve virüsleri yapı ve üreme bakımından karşılaştırır.",
      "Antibiyotik direncinin doğal seçilim ve yatay gen aktarımıyla nasıl yayıldığını açıklar.",
    ],
    ev: "VERI_ANALIZI ACIKLAMA MODELLEME",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Bütün bakterilerin zararlı olduğunu sanmak.",
      "Antibiyotik direncinin insan vücudunun antibiyotiğe 'alışması' olduğunu düşünmek.",
    ],
    x: [
      "math.found.exp-log:bakteriyel büyümenin üstel evresi",
      "bio.immune:patojenlere karşı bağışıklık yanıtı",
      "env.ecosystems.energy:ayrıştırıcılar ve madde döngüleri",
    ],
    ra: ["Farklı koşullarda maya ya da bakteri büyümesini ölçme"],
    rel: ["bio.biotech", "bio.evolution"],
    tags: ["mikrop", "bakteri", "virüs"],
  })
  .o("bio.biotech", "Biyoteknoloji: PCR, klonlama, CRISPR", {
    d: "Restriksiyon enzimleri ve rekombinant DNA, plazmitlerle gen klonlama, PCR ve jel elektroforezi, DNA dizileme, CRISPR–Cas ile gen düzenleme ve bu tekniklerin etik boyutu.",
    w: "Modern biyoloji laboratuvarlarının günlük araçlarıdır; araştırma makalelerindeki yöntem bölümlerini okumanı ve biyoteknoloji tartışmalarını bilgilenerek değerlendirmeni sağlar.",
    pre: ["bio.genetics.molecular", "bio.genetics.regulation~s"],
    q: [
      "Bir olay yerinde tek bir saç teli bulundu; ondan elde edilen DNA analize yetmeyecek kadar az. Bu DNA'yı milyarlarca kez nasıl çoğaltabilirsin?",
      "Bir bakteri insan insülinini üretebilir. Bakteri insan geninin 'dilini' nasıl anlıyor?",
    ],
    cq: [
      "PCR'nin her döngüsünde ne olur ve neden ısıya dayanıklı bir polimeraz gerekir?",
      "Jel elektroforezinde DNA parçaları neden boyutlarına göre ayrılır?",
      "CRISPR–Cas hedef diziyi nasıl bulur ve keser?",
    ],
    obj: [
      "PCR'nin denatürasyon, bağlanma ve uzama adımlarını açıklar ve n döngü sonunda kopya sayısını hesaplar.",
      "Bir jel elektroforezi görüntüsünü yorumlayarak parça boyutlarını tahmin eder.",
      "Bir gen klonlama deneyinin adımlarını restriksiyon enzimi, ligaz ve seçici işaretle tasarlar.",
      "Gen düzenlemenin etik sorularını farklı paydaşların bakış açısından tartışır.",
    ],
    ev: "HESAPLAMA YORUMLAMA DENEY",
    t: "UYGULAMA",
    lv: 3,
    sc: "L",
    mis: [
      "PCR'nin tüm genomu kopyaladığını sanmak (yalnızca primerlerle sınırlanan bölgeyi çoğaltır).",
      "Jelde küçük parçaların daha yavaş ilerlediğini düşünmek.",
    ],
    x: [
      "res.ethics:gen düzenlemenin araştırma etiği",
      "math.found.exp-log:PCR'de kopya sayısının 2ⁿ ile artması",
      "chem.lab.techniques:elektroforez ve ayırma teknikleri",
    ],
    ca: ["Biyoloji olimpiyatında jel ve klonlama deneyi soruları"],
    rel: ["bio.methods.lab", "bio.micro.microbes"],
    tags: ["pcr", "crispr", "klonlama"],
  })
  .o("bio.classification", "Sınıflandırma ve filogenetik ağaçlar", {
    d: "Taksonomik basamaklar ve iki adlı adlandırma, üç üst âlem, filogenetik ağaç okuma, ortak türemiş özellikler, monofiletik gruplar, cimrilik ilkesi ve moleküler veriyle soy ağacı kurma.",
    w: "Canlıların çeşitliliğini evrimsel akrabalık üzerinden düzenler; ağaç okuma becerisi biyoloji olimpiyatlarının ve evrim tartışmalarının temelidir.",
    pre: ["bio.evolution"],
    q: [
      "Bir filogenetik ağaçta insan ile mantar, insan ile bitkiden daha yakın görünüyor. Bu sana şaşırtıcı mı geliyor? Ağaç tam olarak neyi gösteriyor?",
      "Yarasa ve kuşun ikisi de kanatlı. Bu ortak özellik onları yakın akraba yapar mı?",
    ],
    cq: [
      "Filogenetik ağaçta akrabalık neye göre okunur?",
      "Homolog ve analog özellikler nasıl ayırt edilir?",
      "Moleküler veriden ağaç kurarken cimrilik ilkesi nasıl kullanılır?",
    ],
    obj: [
      "Bir filogenetik ağaçta en yakın ortak ataları bularak akrabalık derecelerini belirler.",
      "Bir özellik tablosundan cimrilik ilkesiyle en az değişiklik gerektiren ağacı kurar.",
      "Homolog ve analog özellikleri örneklerle ayırt eder ve monofiletik grupları belirler.",
    ],
    ev: "DIAGRAM PROBLEM_COZME VERI_ANALIZI",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Ağaçta yan yana çizilen dalların daha yakın akraba olduğunu sanmak (dalların döndürülmesi akrabalığı değiştirmez).",
      "Bir türün ötekinden 'daha evrimleşmiş' olduğunu düşünmek.",
    ],
    x: [
      "math.discrete.graph-theory:filogenetik ağaçlar köklü ağaç graflarıdır",
      "prog.algo.dp:dizi hizalama ve ağaç kurma algoritmaları",
    ],
    ca: ["Biyoloji olimpiyatında filogenetik ağaç ve kladogram soruları"],
    rel: ["bio.evolution.popgen"],
    tags: ["sınıflandırma", "filogeni", "kladistik"],
  })
  .o("bio.behavior.animal", "Hayvan davranışı", {
    d: "Doğuştan ve öğrenilmiş davranış, sabit davranış örüntüleri, damgalanma, yön bulma ve göç, iletişim, toplumsal davranış, akraba seçilimi ve özgecilik; Tinbergen'in dört sorusu.",
    w: "Davranışı evrimsel ve mekanizma düzeyinde birlikte açıklamayı öğretir; psikoloji ve nörobilimle doğrudan köprü kurar.",
    pre: ["bio.evolution~s", "neuro.sys.neuroanatomy~c"],
    q: [
      "İşçi arılar hiç üremez ve kovanı korurken ölebilirler. Doğal seçilim kendi genlerini aktarmayan bir davranışı nasıl destekleyebilir?",
      "Yumurtadan yeni çıkan bir kaz yavrusu ilk gördüğü hareketli nesneyi annesi gibi izler. Bu öğrenme mi, içgüdü mü?",
    ],
    cq: [
      "Bir davranış için 'neden' sorusu hangi farklı düzeylerde sorulabilir?",
      "Akraba seçilimi özgeciliği nasıl açıklar?",
      "Doğuştan ve öğrenilmiş davranış nasıl deneysel olarak ayırt edilir?",
    ],
    obj: [
      "Bir davranışı Tinbergen'in dört sorusuna (mekanizma, gelişim, işlev, evrim) göre çözümler.",
      "Hamilton kuralını kullanarak özgecil bir davranışın seçilip seçilmeyeceğini hesaplar.",
      "Doğuştan ve öğrenilmiş davranışı ayırt eden bir gözlem ya da deney tasarlar.",
    ],
    ev: "ACIKLAMA HESAPLAMA DENEY",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Hayvanların 'türün iyiliği için' davrandığını sanmak.",
      "Davranışın ya tamamen doğuştan ya tamamen öğrenilmiş olduğunu düşünmek.",
    ],
    x: [
      "psy.learning.conditioning:hayvanlarda koşullanma ve öğrenme",
      "econ.micro.game-theory:evrimsel oyun kuramı ve stratejik davranış",
      "neuro.cog.decision:hayvan karar verme ve ödül",
    ],
    ra: ["Karıncalar ya da kuşlar üzerine basit bir davranış gözlemi"],
    rel: ["bio.evolution", "bio.ecology"],
    tags: ["davranış", "etoloji", "özgecilik"],
  })
  .done();
