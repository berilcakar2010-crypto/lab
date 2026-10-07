import { builder } from "../dsl";

export const NEURO = builder("NOROBILIM")
  // ───────────────────────── Hücresel nörobilim ─────────────────────────
  .unit("Hücresel nörobilim", "Nöron ve membran")
  .o("neuro.cell.neuron-anatomy", "Nöron anatomisi ve glia", {
    pre: ["bio.cell.structure"],
    d: "Dendrit, soma, akson tepeciği, akson ve sinaps uçlarıyla nöronun bölümleri; nöron tipleri ve astrosit, oligodendrosit, mikroglia gibi glia hücreleri.",
    w: "Bilginin nöronda hangi yönde aktığını ve modellerde hangi bölmelerin temsil edildiğini belirler; HH ve kablo modelleri bu anatomiyi soyutlar.",
    q: [
      "Bir nöron yalnızca tek bir aksona ama binlerce sinapsa sahip olabiliyorsa, 'tek çıkış – çok giriş' tasarımı hesaplama açısından ne kazandırır?",
      "Miyelin bir yalıtkandır; o halde aksonun her yerini kaplasaydı sinyal daha mı hızlı, yoksa hiç mi iletilmezdi?",
    ],
    cq: [
      "Nöronun her bölümü bilgi işlemede hangi rolü üstlenir?",
      "Glia hücreleri nöronların çalışmasına nasıl katkı verir?",
    ],
    obj: [
      "Bir nöron çizimi üzerinde bölümleri ve sinyal akış yönünü diyagramla gösterir.",
      "Nöron tiplerini morfolojilerine göre sınıflandırır.",
      "Glia tiplerinin işlevlerini nöron fizyolojisiyle ilişkilendirerek açıklar.",
    ],
    ev: "DIAGRAM ACIKLAMA HATIRLAMA",
    t: "KAVRAM",
    lv: 1,
    sc: "S",
    mis: [
      "Glia yalnızca nöronları bir arada tutan 'yapıştırıcı'dır; sinaps düzenleme ve miyelinlemede etkin rol oynar.",
      "Her nöronun bilgisi dendritten aksona sıkı biçimde tek yönlü akar; geri yayılan aksiyon potansiyelleri de vardır.",
    ],
    x: [
      "bio.cell.structure:nöron özelleşmiş bir ökaryot hücredir",
      "math.discrete.graph-theory:nöron dallanması ve bağlantılar ağaç/graf olarak temsil edilir",
      "bio.immune:mikroglia beynin bağışıklık hücreleridir",
    ],
    ra: ["Nöron morfolojisi veritabanlarındaki rekonstrüksiyonların incelenmesi"],
    ca: ["Brain Bee tipi yarışmalarda nöron yapısı soruları"],
    rel: ["neuro.cell.cable", "neuro.sys.neuroanatomy"],
    tags: ["noron", "glia", "anatomi"],
  })
  .o("neuro.cell.membrane-potential", "Membran potansiyeli: Nernst ve GHK denklemleri", {
    pre: ["neuro.cell.neuron-anatomy", "bio.cell.membrane", "phys.em.potential", "math.found.exp-log", "chem.redox-electrochem~c"],
    d: "İyon derişim farkları ve seçici geçirgenlikten dinlenim potansiyelinin doğuşu; Nernst denge potansiyeli ve birden çok iyon için Goldman–Hodgkin–Katz denklemi.",
    w: "HH modelindeki her iyon akımı (V − E_ion) farkıyla yazılır; E_Na ve E_K değerlerini hesaplayamadan model parametrelerinin anlamı kaybolur.",
    q: [
      "Hücre içindeki K⁺ derişimi dışarıdakinin yaklaşık 30 katıyken K⁺ neden hepsi dışarı akıp bitmez? Neyin akışı durdurduğunu tahmin et.",
      "Dinlenim potansiyelini oluşturmak için kaç iyonun zarı geçmesi gerekir: hücredeki K⁺'nın yarısı mı, yoksa çok küçük bir kesri mi?",
    ],
    cq: [
      "Kimyasal ve elektriksel kuvvetler hangi gerilimde dengelenir?",
      "Birden çok iyon geçirgen olduğunda dinlenim potansiyeli nasıl belirlenir?",
      "Na⁺/K⁺ pompası dinlenim potansiyeline doğrudan mı dolaylı mı katkı verir?",
    ],
    obj: [
      "Nernst denklemini Boltzmann dağılımından ya da elektrokimyasal potansiyel eşitliğinden türetir.",
      "Verilen derişimlerle E_K, E_Na ve E_Cl değerlerini hesaplar.",
      "GHK denklemiyle geçirgenlik oranları değişince dinlenim potansiyelinin nasıl kaydığını tahmin eder.",
      "Kondansatör hesabıyla dinlenim potansiyeli için gereken yük miktarını tahmin eder.",
    ],
    ev: "TURETME HESAPLAMA TAHMIN",
    t: "TURETME",
    lv: 4,
    sc: "M",
    mis: [
      "Dinlenim potansiyeli doğrudan pompa tarafından üretilir; esas olarak K⁺ sızıntısı ve derişim farkından doğar.",
      "Bir aksiyon potansiyeli iyon derişimlerini belirgin biçimde değiştirir; değişen iyon sayısı toplamın çok küçük bir kesridir.",
      "Denge potansiyelinde iyon akışı durur; aslında içe ve dışa akışlar eşitlenir.",
    ],
    x: [
      "chem.redox-electrochem:Nernst denklemi elektrokimyadaki ile aynı denklemdir",
      "phys.thermo.stat-mech:Boltzmann dağılımı denge potansiyelinin kökenidir",
      "phys.em.capacitance:zar bir kondansatör gibi yük depolar",
    ],
    ra: [
      "HH simülasyonunda dış K⁺ derişimini değiştirip uyarılabilirliği incelemek",
      "Hiperkalemi gibi durumların nöron davranışına etkisini modellemek",
    ],
    ca: ["Biyoloji ve beyin olimpiyatlarında Nernst hesabı soruları"],
    rel: ["neuro.cell.action-potential", "neuro.comp.hh-model", "neuro.comp.lif"],
    tags: ["nernst", "ghk", "dinlenim-potansiyeli", "elektrokimya"],
  })
  .o("neuro.cell.action-potential", "Aksiyon potansiyeli ve iyon kanalları", {
    pre: ["neuro.cell.membrane-potential"],
    d: "Gerilim kapılı Na⁺ ve K⁺ kanallarının açılıp kapanma sırasıyla oluşan hep-ya-hiç sinyal; eşik, refrakter dönem ve aksonda yayılma.",
    w: "Nöronların iletişim biriminin mekanizmasıdır; HH modeli tam olarak bu olayın nicel açıklamasıdır.",
    q: [
      "Aksiyon potansiyeli 'hep ya hiç' ise, nöron bir uyaranın şiddetini nasıl kodlar?",
      "Na⁺ kanalları açık kalmaya devam etseydi zar potansiyeli nereye giderdi? Bir sayı tahmin et.",
    ],
    cq: [
      "Pozitif ve negatif geri besleme döngüleri spike şeklini nasıl üretir?",
      "Refrakter dönemin nedeni nedir ve hangi sonuçları vardır?",
      "Miyelin iletim hızını nasıl artırır?",
    ],
    obj: [
      "Aksiyon potansiyelinin evrelerini kanal durumları ve iyon akımlarıyla diyagramla gösterir.",
      "Kanal blokerlerinin (ör. TTX, TEA) spike üzerindeki etkisini tahmin eder.",
      "Mutlak ve göreli refrakter dönemin en yüksek ateşleme hızına etkisini hesaplar.",
    ],
    ev: "DIAGRAM TAHMIN ACIKLAMA HESAPLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Spike sırasında Na⁺ ve K⁺ yer değiştirir; aslında farklı zaman ölçeklerinde açılan iki ayrı akım vardır.",
      "Aksiyon potansiyeli akson boyunca bir elektrik akımı gibi ışık hızına yakın ilerler; yayılma yalnızca m/s mertebesindedir.",
      "Repolarizasyon pompa sayesinde olur; K⁺ kanalları sayesinde olur.",
    ],
    x: [
      "math.dyn.stability:eşik bir kararsızlık noktası olarak yorumlanabilir",
      "phys.em.rc-circuits:zar akımları paralel RC devresine benzer",
      "bio.genetics.molecular:kanal proteinlerindeki mutasyonlar kanalopatilere yol açar",
    ],
    ra: ["Kanalopatilerde (ör. bazı epilepsi türleri) kanal kinetiğinin rolü"],
    ca: ["Brain Bee ve biyoloji olimpiyatlarında spike evreleri soruları"],
    rel: ["neuro.comp.hh-model", "neuro.cell.cable", "neuro.methods.electrophysiology"],
    vs: ["neuro.cell.cable"],
    tags: ["aksiyon-potansiyeli", "iyon-kanali", "spike"],
  })
  .o("neuro.cell.cable", "Kablo kuramı ve dendritik entegrasyon", {
    pre: ["neuro.cell.action-potential", "phys.em.rc-circuits", "math.ode.pde-intro~s"],
    d: "Pasif dendrit ve aksonları sızdıran bir kablo olarak modelleyen kablo denklemi; uzunluk ve zaman sabitleri, sinyalin uzaklıkla sönümü ve dendritlerde uzaysal-zamansal toplama.",
    w: "Sinapsın soma'dan uzaklığının etkisini nicel hale getirir; çok bölmeli nöron modellerinin temelidir ve HH'yi aksonda yayılan bir dalgaya genişletir.",
    q: [
      "Uzak bir dendritteki sinaps ile somaya yakın bir sinaps aynı akımı enjekte ederse soma hangisini daha güçlü 'duyar'? Neden?",
      "Aksonu iki kat kalınlaştırırsan sinyal kaç kat uzağa taşınır: iki kat mı, daha az mı?",
    ],
    cq: [
      "Pasif kablo boyunca gerilim neden üstel olarak söner?",
      "Uzunluk sabiti λ akson çapına nasıl bağlıdır?",
    ],
    obj: [
      "Kablo denklemini zar ve eksenel akımların korunumundan türetir.",
      "Durağan durumda gerilimin uzaklıkla üstel sönümünü çözer ve λ'yı hesaplar.",
      "Çok bölmeli bir modeli Python'da kurarak sinaps konumunun etkisini simüle eder.",
    ],
    ev: "TURETME HESAPLAMA SIMULASYON MODELLEME",
    t: "TURETME",
    lv: 4,
    sc: "L",
    mis: [
      "Dendritler yalnızca pasif tellerdir; birçoğu aktif kanallar taşır ve dendritik spike üretebilir.",
      "λ çapla doğrusal artar; pasif kabloda λ çapın kareköküyle orantılıdır.",
    ],
    x: [
      "math.ode.pde-intro:kablo denklemi bir difüzyon tipi kısmi diferansiyel denklemdir",
      "phys.em.rc-circuits:her zar parçası bir RC elemanıdır",
      "math.found.exp-log:mesafeyle üstel sönüm",
    ],
    ra: [
      "HH modelini çok bölmeli aksona genişletip iletim hızını ölçmek",
      "Dendritik konumun sinaptik ağırlık üzerindeki etkisinin modellenmesi",
    ],
    rel: ["neuro.comp.hh-model", "neuro.cell.neuron-anatomy", "neuro.comp.lif"],
    tags: ["kablo-denklemi", "dendrit", "pde"],
  })
  .unit("Hücresel nörobilim", "Sinaps")
  .o("neuro.syn.transmission", "Sinaptik iletim ve nörotransmitterler", {
    pre: ["neuro.cell.action-potential", "bio.cell.signaling"],
    d: "Kimyasal sinapsta Ca²⁺ girişiyle vezikül salınımı, nörotransmitter–reseptör etkileşimi, EPSP/IPSP, elektriksel sinapslar ve sinyalin sonlandırılması.",
    w: "Nöronlar arası iletişimin ve hemen her psikoaktif ilacın etki noktası; ağ modellerindeki sinaptik akım terimleri buradan gelir.",
    q: [
      "Sinaptik iletim olasılıksaldır: bir spike bazen hiç vezikül salmaz. Bu 'güvenilmezlik' bir hata mı, yoksa bir hesaplama özelliği olabilir mi?",
      "Aynı nörotransmitter (ör. asetilkolin) neden kalpte yavaşlatıcı, iskelet kasında uyarıcı etki yapar?",
    ],
    cq: [
      "Elektriksel sinyal nasıl kimyasala, sonra yeniden elektriksele dönüşür?",
      "Uyarıcı ve baskılayıcı sinapsları belirleyen nedir?",
      "Kuantal salınım hipotezi hangi verilere dayanır?",
    ],
    obj: [
      "Sinaptik iletim adımlarını Ca²⁺ girişinden reseptör yanıtına kadar diyagramla gösterir.",
      "Bir sinaptik akımın tersine dönme potansiyelinden uyarıcı mı baskılayıcı mı olacağını tahmin eder.",
      "Kuantal salınımı binom modeliyle hesaplar ve yanıt dağılımını yorumlar.",
    ],
    ev: "DIAGRAM TAHMIN HESAPLAMA YORUMLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Bir nörotransmitter her zaman uyarıcı ya da her zaman baskılayıcıdır; etkiyi reseptör ve iyon dengesi belirler.",
      "Sinapslar ya tam iletir ya hiç; salınım olasılığı genellikle 1'den küçüktür.",
    ],
    x: [
      "math.prob.distributions:kuantal salınımın binom ve Poisson modeli",
      "bio.cell.signaling:iyonotropik ve metabotropik reseptör yolları",
      "bio.enzymes:asetilkolinesteraz ile sinyalin sonlandırılması",
    ],
    ra: ["Sinaptik akımların iletkenlik temelli modellerle simülasyonu"],
    ca: ["Brain Bee'de nörotransmitter ve ilaç etkisi soruları"],
    rel: ["neuro.syn.plasticity", "neuro.syn.neuromodulation", "neuro.comp.networks"],
    vs: ["neuro.syn.neuromodulation"],
    tags: ["sinaps", "norotransmitter", "epsp"],
  })
  .o("neuro.syn.plasticity", "Sinaptik plastisite: LTP, LTD, STDP", {
    pre: ["neuro.syn.transmission"],
    d: "Sinaptik gücün etkinliğe bağlı kalıcı değişimi: NMDA reseptörü aracılı LTP ve LTD, spike zamanlamasına bağlı plastisite (STDP) ve kısa süreli kolaylaştırma/çökme.",
    w: "Öğrenme ve belleğin hücresel temeli olarak kabul edilir; Hebbian öğrenme ve yapay ağlardaki ağırlık güncellemeleri buradan ilham alır.",
    q: [
      "NMDA reseptörü hem glutamat hem de depolarizasyon ister. Bu 'VE kapısı' neden öğrenme için ideal bir dedektördür?",
      "Önce-sonra sırası 10 ms farkla tersine dönerse sinaps güçlenmek yerine zayıflayabilir. Bunun nedensellik açısından anlamı ne olabilir?",
    ],
    cq: [
      "Hangi koşullarda sinaps güçlenir, hangilerinde zayıflar?",
      "STDP penceresi nasıl ölçülür ve nasıl modellenir?",
    ],
    obj: [
      "NMDA reseptörünün çakışma dedektörü rolünü Mg²⁺ bloğu üzerinden açıklar.",
      "Bir STDP öğrenme penceresini üstel fonksiyonlarla modeller.",
      "LTP deney verisinden potansiyasyon büyüklüğünü ve süresini yorumlar.",
    ],
    ev: "ACIKLAMA MODELLEME YORUMLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "LTP bellekle aynı şeydir; LTP belleğin olası mekanizmalarından biridir.",
      "Plastisite yalnızca sinapsları güçlendirir; zayıflama (LTD) ve homeostatik ölçekleme de eşit derecede önemlidir.",
    ],
    x: [
      "math.found.exp-log:STDP penceresi üstel çekirdeklerle tanımlanır",
      "prog.ml.neural-nets:ağırlık güncellemesi kavramının biyolojik karşılığı",
      "bio.genetics.regulation:geç LTP gen ifadesi ve protein sentezi gerektirir",
    ],
    ra: ["STDP kuralıyla basit bir iki nöronlu devrenin öğrenmesini simüle etmek"],
    rel: ["neuro.comp.hebbian", "neuro.cog.learning-memory", "neuro.syn.transmission"],
    tags: ["plastisite", "ltp", "stdp", "nmda"],
  })
  .o("neuro.syn.neuromodulation", "Nöromodülasyon: dopamin, serotonin, asetilkolin", {
    pre: ["neuro.syn.transmission", "bio.physiology.endocrine~s"],
    d: "Yaygın projeksiyonlu modülatör sistemlerin metabotropik reseptörler üzerinden nöron ve sinaps özelliklerini yavaş ve geniş ölçekte değiştirmesi.",
    w: "Dikkat, motivasyon, uyku ve öğrenme hızının ayarlanmasını açıklar; pekiştirmeli öğrenme modellerinde dopamin ödül tahmin hatası sinyali olarak yer alır.",
    q: [
      "Az sayıda dopamin nöronu beynin geniş bölgelerine projeksiyon yapar. Bu yapı 'mesaj' mı taşır, yoksa 'bağlam' mı ayarlar?",
    ],
    cq: [
      "Nöromodülatörler hızlı sinaptik iletimden nasıl ayrılır?",
      "Dopamin, serotonin ve asetilkolin sistemleri hangi işlevlerle ilişkilendirilir?",
    ],
    obj: [
      "Nöromodülasyonu klasik sinaptik iletimle zaman ölçeği ve etki alanı açısından ayırt eder.",
      "Bir modülatörün iletkenlik değişikliği yoluyla f–I eğrisini nasıl kaydırdığını tahmin eder.",
      "Başlıca modülatör sistemlerin kaynak çekirdeklerini ve hedeflerini diyagramla gösterir.",
    ],
    ev: "ACIKLAMA TAHMIN DIAGRAM",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Dopamin 'mutluluk molekülü'dür; daha çok beklenti, motivasyon ve öğrenme sinyaliyle ilişkilidir.",
      "Bir modülatör yalnızca bir işleve sahiptir; etkileri reseptör alt tipine ve bölgeye göre değişir.",
    ],
    x: [
      "bio.physiology.endocrine:hormonal ve nöromodülatör sinyaller benzer yavaş zaman ölçeklerinde çalışır",
      "bio.cell.signaling:G-proteini bağlı reseptörler ve ikincil haberciler",
      "math.opt.optimization:modülatörlerin öğrenme hızını ayarlaması gradyan adım boyuna benzetilir",
    ],
    ra: ["HH veya LIF modelinde bir iletkenliği ölçekleyerek modülasyonu taklit etmek"],
    rel: ["neuro.cog.decision", "neuro.comp.reinforcement", "neuro.cog.attention"],
    vs: ["neuro.syn.transmission"],
    tags: ["dopamin", "serotonin", "asetilkolin", "modulasyon"],
  })
  // ───────────────────────── Sistem nörobilimi ─────────────────────────
  .unit("Sistem nörobilimi", "Sistemler")
  .o("neuro.sys.neuroanatomy", "Nöroanatomi: beyin bölgeleri ve yolaklar", {
    pre: ["neuro.cell.neuron-anatomy"],
    d: "Korteks lobları, talamus, bazal gangliyonlar, hipokampus, beyincik ve beyin sapı; başlıca yolaklar ve anatomik yön terimleri.",
    w: "Bir fMRI sonucunu, lezyon vakasını ya da makaledeki bölge adını okumak için gereken haritadır; sistem ve bilişsel nörobilimin ortak dili.",
    q: [
      "Beynin sol yarısı vücudun sağ tarafını kontrol eder. Bunun bir 'tasarım nedeni' olmak zorunda mı, yoksa evrimsel bir rastlantı olabilir mi?",
      "Beyinciğin nöron sayısı korteksinkinden fazla olabilir; peki neden 'düşünmenin merkezi' olarak anılmaz?",
    ],
    cq: [
      "Başlıca beyin bölgeleri hangi işlevlerle ilişkilendirilir?",
      "Bölgeler arası yolaklar bilgiyi nasıl taşır?",
    ],
    obj: [
      "Başlıca beyin bölgelerini kesit görüntülerinde tanır ve adlandırır.",
      "Bir lezyon konumundan olası işlev kaybını tahmin eder.",
      "Bir duyusal ya da motor yolağı alıcıdan kortekse kadar diyagramla gösterir.",
    ],
    ev: "HATIRLAMA DIAGRAM TAHMIN",
    t: "KAVRAM",
    lv: 2,
    sc: "L",
    mis: [
      "Her işlevin tek bir 'merkezi' vardır; işlevler dağıtık ağlarda yürür.",
      "İnsanlar beyinlerinin yalnızca %10'unu kullanır.",
    ],
    x: [
      "math.discrete.graph-theory:konektom bir graf olarak analiz edilir",
      "bio.evolution:beyin yapılarının türler arası korunumu",
      "math.geo.analytic:stereotaksik koordinat sistemleri",
    ],
    ra: ["Açık beyin atlaslarını kullanarak bir yolağın izlenmesi"],
    ca: ["Brain Bee yarışmalarında nöroanatomi bölümü"],
    rel: ["neuro.sys.sensory", "neuro.sys.motor", "neuro.methods.imaging"],
    tags: ["noroanatomi", "korteks", "beyin-bolgeleri"],
  })
  .o("neuro.sys.sensory", "Duyusal sistemler: görme ve işitme", {
    pre: ["neuro.sys.neuroanatomy", "neuro.syn.transmission", "phys.optics.geometric~c", "phys.waves.sound~c"],
    d: "Fotoreseptörler ve retina devreleri, alıcı alanlar, görme yolağı; kokleada frekans ayrımı ve işitsel yolak; duyusal adaptasyon.",
    w: "Fiziksel bir uyaranın nöral koda dönüşümünün en iyi bilinen örnekleri; nöral kodlama ve Bayesçi algı modellerinin deney zemini.",
    q: [
      "Retinanın ışığa duyarlı hücreleri ışığın geldiği yöne değil, arkaya bakar. Bu 'ters' tasarımın bedeli ve olası avantajı ne olabilir?",
      "Koklea frekansları ayırırken bir Fourier analizcisi gibi mi çalışır? Benzerlik nerede bozulur?",
    ],
    cq: [
      "Bir alıcı alan nedir ve merkez–çevre yapısı neyi vurgular?",
      "Koklea frekans bilgisini konuma nasıl dönüştürür?",
      "Adaptasyon neden duyusal sistemler için gereklidir?",
    ],
    obj: [
      "Merkez–çevre alıcı alanını iki Gauss farkıyla modeller ve kenar tepkisini tahmin eder.",
      "Mercek optiğini kullanarak retinadaki görüntü boyutunu hesaplar.",
      "Kokleadaki tonotopik düzeni dalga fiziğiyle açıklar.",
    ],
    ev: "MODELLEME HESAPLAMA ACIKLAMA TAHMIN",
    t: "KAVRAM",
    lv: 3,
    sc: "L",
    mis: [
      "Göz bir kamera gibi beyne tam bir görüntü gönderir; retina zaten yoğun işleme yapar.",
      "Algıladığımız renk doğrudan ışığın dalga boyudur; algı bağlama ve karşıtlığa bağlıdır.",
    ],
    x: [
      "phys.optics.geometric:göz merceği ve görüntü oluşumu",
      "phys.waves.sound:ses dalgaları ve frekans",
      "math.fourier:kokleanın frekans ayrıştırması Fourier analizine benzer",
    ],
    ra: ["Alıcı alan modellerinin doğal görüntülere uygulanması"],
    ca: ["Brain Bee'de duyu sistemleri soruları"],
    rel: ["neuro.comp.neural-coding", "neuro.comp.bayesian-brain", "neuro.cog.attention"],
    tags: ["gorme", "isitme", "retina", "alici-alan"],
  })
  .o("neuro.sys.motor", "Motor sistem ve hareket kontrolü", {
    pre: ["neuro.sys.neuroanatomy", "neuro.syn.transmission"],
    d: "Motor nöronlar ve kas, refleks yayları, merkezi örüntü üreteçleri, motor korteks, bazal gangliyonlar ve beyinciğin hareket kontrolündeki rolleri.",
    w: "Algıdan eyleme giden zinciri tamamlar; geri beslemeli kontrol ve beyin–bilgisayar arayüzleri bu sistemin modellerine dayanır.",
    q: [
      "Bir bardağı kaldırırken beynin, kolun ne kadar ağır olacağını önceden 'tahmin ettiğini' gösteren bir gündelik deneyim düşün.",
      "Duyusal geri bildirim yüzlerce milisaniye gecikmeliyse hızlı hareketleri nasıl düzgün yapabiliyoruz?",
    ],
    cq: [
      "Refleks, ritmik ve istemli hareketler hangi düzeylerde üretilir?",
      "Beyincik ve bazal gangliyonlar hareketi nasıl düzenler?",
    ],
    obj: [
      "Gerilme refleksi yayını afferent ve efferent bileşenleriyle diyagramla gösterir.",
      "Gecikmeli geri beslemenin kararlılığa etkisini basit bir modelle tahmin eder.",
      "Motor bozuklukları (ör. Parkinson) ilgili devre değişiklikleriyle ilişkilendirerek açıklar.",
    ],
    ev: "DIAGRAM TAHMIN ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Tüm hareketler motor kortekste planlanır; birçok ritmik hareket omurilik devrelerince üretilir.",
      "Beyincik yalnızca dengeyle ilgilidir; zamanlama ve motor öğrenmede de rol oynar.",
    ],
    x: [
      "phys.mech.torque:eklem torkları ve kas kuvvetleri",
      "math.dyn.stability:gecikmeli geri beslemeli kontrolün kararlılığı",
      "phys.mech.oscillations:merkezi örüntü üreteçleri osilatör olarak modellenir",
    ],
    ra: ["Merkezi örüntü üreteci için çift osilatör modeli kurmak"],
    rel: ["neuro.sys.neuroanatomy", "bio.physiology.systems", "neuro.comp.reinforcement"],
    tags: ["motor", "refleks", "beyincik", "bazal-gangliyon"],
  })
  .o("neuro.sys.development", "Sinir sisteminin gelişimi", {
    pre: ["neuro.sys.neuroanatomy", "bio.genetics.regulation"],
    opt: true,
    d: "Nöral tüp oluşumu, nörogenez, nöron göçü, akson yönlendirme, sinaps oluşumu ve budama; kritik dönemler.",
    w: "Beynin nasıl 'kendini kurduğunu' açıklar; kritik dönemler ve etkinliğe bağlı bağlantı düzenlenmesi plastisite modelleriyle doğrudan ilişkilidir.",
    q: [
      "İnsan genomundaki gen sayısı, beyindeki sinaps sayısından çok daha küçüktür. Öyleyse bağlantılar nasıl belirlenir?",
    ],
    cq: [
      "Aksonlar hedeflerini hangi kimyasal ipuçlarıyla bulur?",
      "Etkinlik bağlantıların budanmasını nasıl yönlendirir?",
    ],
    obj: [
      "Sinir sistemi gelişiminin ana evrelerini sırasıyla diyagramla gösterir.",
      "Gen sayısı ile sinaps sayısı arasındaki farkı bir bilgi hesabıyla yorumlar.",
      "Kritik dönem deneylerinin sonuçlarını etkinliğe bağlı plastisiteyle açıklar.",
    ],
    ev: "DIAGRAM YORUMLAMA ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Beyin gelişimi doğumda tamamlanır; budama ve miyelinleşme ergenlikte ve sonrasında sürer.",
      "Her bağlantı genlerde tek tek kodlanmıştır.",
    ],
    x: [
      "bio.genetics.regulation:gen ifadesi örüntüleri hücre kaderini belirler",
      "bio.cell.division:nörogenez ve hücre çoğalması",
      "math.info.entropy:genomun bilgi kapasitesi ile bağlantı bilgisinin karşılaştırılması",
    ],
    rel: ["neuro.syn.plasticity", "neuro.comp.hebbian"],
    tags: ["gelisim", "norogenez", "kritik-donem"],
  })
  // ───────────────────────── Bilişsel nörobilim ─────────────────────────
  .unit("Bilişsel nörobilim", "Biliş")
  .o("neuro.cog.learning-memory", "Öğrenme ve bellek sistemleri", {
    pre: ["neuro.syn.plasticity", "neuro.sys.neuroanatomy"],
    d: "Kısa ve uzun süreli bellek, açık (bildirimsel) ve örtük bellek sistemleri, hipokampusun rolü, pekiştirme ve geri çağırma.",
    w: "Hem nörobilimin temel sorularından biri hem de kendi öğrenme stratejilerini (aralıklı tekrar, geri çağırma pratiği) bilimsel temele oturtmanın yoludur.",
    q: [
      "Hipokampusu hasar gören bir hasta yeni bir motor beceriyi öğrenebilir ama öğrendiğini hatırlamaz. Bu, bellek hakkında ne söyler?",
      "Bir bilgiyi tekrar okumak mı, yoksa kendini test etmek mi daha kalıcıdır? Tahmin et ve nedenini sinaptik düzeyde düşün.",
    ],
    cq: [
      "Farklı bellek türleri hangi beyin sistemlerine dayanır?",
      "Bir anı nasıl kodlanır, pekiştirilir ve geri çağrılır?",
    ],
    obj: [
      "Bellek sistemlerini işlev ve ilgili beyin bölgeleriyle sınıflandırır.",
      "Lezyon vakalarından bellek sistemlerinin ayrışmasına dair çıkarım yapar.",
      "Aralıklı tekrar ve geri çağırma pratiğini kendi çalışma planına uygular.",
    ],
    ev: "ACIKLAMA YORUMLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Bellek bir video kaydı gibi olduğu gibi saklanır; geri çağırma yeniden kurgulayıcıdır.",
      "Kısa süreli bellek sadece 'kısa' uzun süreli bellektir; farklı mekanizmalar içerir.",
    ],
    x: [
      "comp.meta.learning-to-learn:aralıklı tekrar ve geri çağırma etkisinin nörobilimsel temeli",
      "prog.ml.neural-nets:yapay ağlarda felaket unutma ve biyolojik bellek karşılaştırması",
      "res.method.causal:lezyon çalışmalarından nedensel çıkarım",
    ],
    ra: ["Geri çağırma pratiğinin etkisini ölçen küçük bir kendi üzerine deney"],
    ca: ["Brain Bee'de bellek ve öğrenme soruları"],
    rel: ["neuro.cog.sleep", "neuro.comp.attractors", "neuro.comp.hebbian"],
    tags: ["bellek", "hipokampus", "ogrenme"],
  })
  .o("neuro.cog.attention", "Dikkat", {
    pre: ["neuro.sys.neuroanatomy", "neuro.sys.sensory~s"],
    d: "Seçici dikkat, dikkat ağları, dikkatin nöral yanıtları kazanç değişimiyle modülasyonu ve dikkat kapasitesinin sınırları.",
    w: "Sınırlı işlem kaynağının nasıl dağıtıldığını açıklar; çalışma alışkanlıkları ve nöral kodlama modellerinde gain modülasyonu olarak karşına çıkar.",
    q: [
      "Kalabalık bir odada adının söylendiğini fark edersin. Dikkat etmediğin bir şeyi nasıl 'duydun'?",
    ],
    cq: [
      "Dikkat nöron yanıtlarını nasıl değiştirir?",
      "Yukarıdan aşağı ve aşağıdan yukarı dikkat nasıl ayrılır?",
    ],
    obj: [
      "Yukarıdan aşağı ve aşağıdan yukarı dikkati örneklerle ayırt eder.",
      "Dikkatin bir ayar eğrisini kazanç olarak nasıl ölçeklediğini modeller.",
      "Basit bir tepki süresi deneyini tasarlayıp sonuçlarını yorumlar.",
    ],
    ev: "ACIKLAMA MODELLEME DENEY",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Çoklu görev yapabiliriz; çoğunlukla dikkat hızla görevler arasında geçiş yapar ve maliyeti vardır.",
      "Dikkat tek bir beyin bölgesinde bulunur.",
    ],
    x: [
      "math.stat.inference:tepki süresi deneylerinde grup farklarının testi",
      "res.method.experimental-design:dikkat deneylerinde karşı dengeleme",
      "prog.ml.neural-nets:yapay ağlardaki dikkat mekanizmalarıyla kavramsal karşılaştırma",
    ],
    ra: ["Çevrimiçi bir Posner ipucu görevi kurup veri toplamak"],
    rel: ["neuro.syn.neuromodulation", "neuro.comp.neural-coding"],
    tags: ["dikkat", "kazanc-modulasyonu"],
  })
  .o("neuro.cog.decision", "Karar verme ve ödül", {
    pre: ["neuro.syn.neuromodulation", "math.prob.bayes~s"],
    d: "Kanıt biriktirme (sürüklenme–difüzyon) modelleri, değer temsili, ödül tahmin hatası ve risk altında seçim.",
    w: "Davranışı nicel modellere bağlayan en verimli alanlardan biri; pekiştirmeli öğrenme ve Bayesçi beyin konularının köprüsüdür.",
    q: [
      "Daha hızlı karar verdiğinde neden daha çok hata yaparsın? Hız–doğruluk ödünleşimini bir 'eşik' fikriyle açıklamayı dene.",
    ],
    cq: [
      "Beyin gürültülü kanıtı zaman içinde nasıl biriktirir?",
      "Ödül ve değer nöral düzeyde nasıl temsil edilir?",
    ],
    obj: [
      "Sürüklenme–difüzyon modelini rastgele yürüyüş olarak simüle eder.",
      "Eşik değiştiğinde tepki süresi ve doğruluğun nasıl değişeceğini tahmin eder.",
      "Ödül tahmin hatası kavramını dopamin kayıtlarıyla yorumlar.",
    ],
    ev: "SIMULASYON TAHMIN YORUMLAMA",
    t: "MODELLEME",
    lv: 3,
    sc: "M",
    mis: [
      "Kararlar ya tamamen rasyonel ya tamamen duygusaldır; değer hesabı ikisini birleştirir.",
      "Dopamin ödülün kendisini kodlar; beklentiden sapmayı kodladığına dair güçlü kanıt vardır.",
    ],
    x: [
      "math.prob.stochastic:sürüklenme–difüzyon bir rastgele yürüyüştür",
      "math.prob.bayes:kanıtın Bayesçi birikimi",
      "prog.sci.simulation:karar modellerinin Monte Carlo simülasyonu",
    ],
    ra: ["Tepki süresi verisine sürüklenme–difüzyon modeli uydurmak"],
    rel: ["neuro.comp.reinforcement", "neuro.comp.bayesian-brain", "neuro.syn.neuromodulation"],
    tags: ["karar", "odul", "ddm"],
  })
  .o("neuro.cog.sleep", "Uyku ve bellek pekiştirme", {
    pre: ["neuro.cog.learning-memory"],
    d: "Uyku evreleri ve EEG imzaları, sirkadiyen ritim, uyku sırasında hipokampal yeniden oynatma ve bellek pekiştirme.",
    w: "Öğrenmenin uyku sırasında da sürdüğünü gösterir; çalışma planını bilimsel temelle düzenlemeye ve EEG verisini yorumlamaya bağlanır.",
    q: [
      "Sınavdan önceki geceyi uykusuz çalışarak geçirmek kazanç mı kayıp mı? Bellek pekiştirme açısından tahmin et.",
    ],
    cq: [
      "Uyku evreleri EEG'de nasıl ayırt edilir?",
      "Uyku belleği hangi mekanizmalarla güçlendirir?",
    ],
    obj: [
      "Uyku evrelerini EEG frekans bantlarıyla ayırt eder.",
      "Sirkadiyen ritmi bir osilatör modeliyle açıklar.",
      "Uyku ve bellek deneylerinin bulgularını yöntemsel sınırlarıyla yorumlar.",
    ],
    ev: "YORUMLAMA ACIKLAMA VERI_ANALIZI",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Uykuda beyin 'kapanır'; bazı evrelerde etkinlik uyanıklığa yakındır.",
      "Kaybedilen uyku tek bir uzun uykuyla tamamen telafi edilir.",
    ],
    x: [
      "math.fourier:EEG güç spektrumu ile uyku evrelerinin belirlenmesi",
      "comp.meta.learning-to-learn:çalışma planında uykunun yeri",
      "bio.physiology.endocrine:melatonin ve kortizolün günlük ritmi",
    ],
    ra: ["Açık uyku EEG veri setinde frekans bantlarının analizi"],
    rel: ["neuro.methods.electrophysiology", "neuro.cog.learning-memory"],
    tags: ["uyku", "sirkadiyen", "eeg", "pekistirme"],
  })
  .o("neuro.cog.emotion", "Duygu ve stres", {
    pre: ["neuro.sys.neuroanatomy", "neuro.syn.neuromodulation~s", "bio.physiology.endocrine~s"],
    opt: true,
    d: "Amigdala ve prefrontal korteksin duygu düzenlemesindeki rolü, korku koşullanması, HPA ekseni ve kronik stresin beyne etkileri.",
    w: "Duygunun bilişi ve öğrenmeyi nasıl etkilediğini açıklar; sınav kaygısını ve dayanıklılığı anlamada bilimsel bir çerçeve sunar.",
    q: [
      "Orta düzey stres performansı artırırken yüksek stres neden düşürür? Ters U eğrisini bir mekanizmayla açıklamayı dene.",
    ],
    cq: [
      "Korku koşullanması hangi devrelerle öğrenilir ve söndürülür?",
      "Kronik stres hipokampus ve prefrontal korteksi nasıl etkiler?",
    ],
    obj: [
      "Korku koşullanması ve sönmeyi devre düzeyinde diyagramla gösterir.",
      "Stres ile performans ilişkisini veriden yorumlar.",
      "Duygu düzenleme stratejilerini nöral mekanizmalarla ilişkilendirerek açıklar.",
    ],
    ev: "DIAGRAM YORUMLAMA ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Amigdala 'korku merkezi'dir ve yalnızca korkuyla ilgilidir; önem ve değer işlemede de rol oynar.",
      "Her stres zararlıdır.",
    ],
    x: [
      "bio.physiology.endocrine:HPA ekseni ve kortizol",
      "comp.meta.stress:performans kaygısıyla başa çıkmanın bilimsel temeli",
      "res.method.causal:stres–hastalık ilişkilerinde karıştırıcı değişkenler",
    ],
    rel: ["neuro.cog.learning-memory", "neuro.syn.neuromodulation"],
    tags: ["duygu", "stres", "amigdala"],
  })
  // ───────────────────────── Hesaplamalı nörobilim ─────────────────────────
  .unit("Hesaplamalı nörobilim", "Nöron modelleri")
  .o("neuro.comp.lif", "Sızdıran entegre-ve-ateşle (LIF) modeli", {
    pre: ["neuro.cell.action-potential", "math.ode.first-order", "phys.em.rc-circuits~s"],
    d: "Zarı bir RC devresi olarak alan, eşikte spike sayıp sıfırlayan en basit spike modeli; f–I eğrisi, refrakter dönem ve gürültülü girdiler.",
    w: "Ağ simülasyonlarının iş atı; HH modeline geçmeden önce diferansiyel denklemle nöron modellemenin mantığını en sade biçimde öğretir.",
    q: [
      "Bir LIF nöronuna sabit akım verirsen, akımı iki katına çıkarmak ateşleme hızını da tam iki katına çıkarır mı? Önce tahmin et.",
      "Eşiğin altında kalan sabit bir akım sonsuza kadar beklesen de spike üretir mi?",
    ],
    cq: [
      "LIF modeli hangi biyofiziği tutar, neyi atar?",
      "f–I eğrisi analitik olarak nasıl bulunur?",
    ],
    obj: [
      "LIF denklemini RC devresinden türetir ve analitik çözümünü yazar.",
      "İlk spike zamanından f–I eğrisini analitik olarak türetir ve reobaz akımını hesaplar.",
      "LIF nöronunu Euler yöntemiyle Python'da kodlar ve analitik sonuçla karşılaştırır.",
    ],
    ev: "TURETME HESAPLAMA KODLAMA SIMULASYON",
    t: "MODELLEME",
    lv: 4,
    sc: "M",
    mis: [
      "LIF spike şeklini modeller; spike yalnızca bir olay olarak eklenir.",
      "Zaman adımı ne olursa olsun sonuç aynıdır; büyük adımlar spike zamanlarını kaydırır.",
    ],
    x: [
      "phys.em.rc-circuits:LIF eşiksiz kısmıyla tam bir RC devresidir",
      "math.ode.first-order:doğrusal birinci mertebe denklemin üstel çözümü",
      "math.ode.numerical:Euler yöntemiyle sayısal entegrasyon",
    ],
    ra: [
      "HH projesine hazırlık olarak LIF simülatörü yazmak",
      "LIF ve HH f–I eğrilerini karşılaştırmak",
    ],
    rel: ["neuro.comp.hh-model", "neuro.comp.networks", "neuro.comp.spike-stats"],
    vs: ["neuro.comp.hh-model"],
    tags: ["lif", "noron-modeli", "ode", "rc-devresi"],
  })
  .o("neuro.comp.hh-model", "Hodgkin–Huxley modeli", {
    pre: ["neuro.comp.lif", "math.ode.systems", "math.ode.numerical"],
    d: "Na⁺, K⁺ ve sızıntı iletkenlikleriyle zar akımını; m, h, n kapı değişkenleriyle kanal kinetiğini tanımlayan dört boyutlu doğrusal olmayan ODE sistemi.",
    w: "Biyofiziksel nöron modellemenin temel taşı ve senin araştırma projenin merkezi; deneysel veriyi mekanistik bir modele dönüştürmenin örnek vakası.",
    q: [
      "HH modelinde iletkenlik g_Na·m³·h olarak yazılır. Neden m'nin küpü? Bağımsız kapı fikrinden bir açıklama tahmin et.",
      "Akım enjeksiyonu yavaşça artırılırsa HH nöronu sürekli ateşlemeye LIF'teki gibi sıfır frekanstan mı başlar, yoksa birden belirli bir frekansla mı? Tahmin et.",
    ],
    cq: [
      "Kapı değişkenleri gerilime nasıl bağlıdır ve neden farklı zaman sabitleri vardır?",
      "Voltaj kenetleme deneyleri modelin parametrelerini nasıl belirledi?",
      "Model spike, eşik ve refrakterliği nasıl kendiliğinden üretir?",
    ],
    obj: [
      "HH denklemlerini zar akımının korunumu ve kapı kinetiğinden türetir.",
      "Kapı değişkenleri için α(V), β(V) üzerinden x∞ ve τx eğrilerini hesaplayıp yorumlar.",
      "HH sistemini Runge–Kutta ile kodlar ve zaman adımının doğruluğa etkisini sınar.",
      "Tip I ve tip II uyarılabilirliği f–I eğrisi üzerinden ayırt eder.",
    ],
    ev: "TURETME KODLAMA SIMULASYON YORUMLAMA",
    t: "MODELLEME",
    lv: 5,
    sc: "XL",
    mis: [
      "m, h, n gerçek fiziksel parçacıklardır; kanal açılma olasılıklarını özetleyen fenomenolojik değişkenlerdir.",
      "HH yalnızca kalamar aksonu için geçerlidir; aynı biçimcilik çok sayıda kanal türüne genellenir.",
      "Euler yöntemi her zaman yeterlidir; HH sert dinamikler içerdiğinden adım boyu dikkat ister.",
    ],
    x: [
      "math.ode.systems:dört boyutlu doğrusal olmayan ODE sistemi",
      "math.ode.numerical:Runge–Kutta ile entegrasyon ve kararlılık",
      "phys.em.circuits-dc:paralel iletkenlikli eşdeğer devre ve Kirchhoff akım yasası",
    ],
    ra: [
      "HH modelini sıfırdan simüle edip f–I eğrisini çıkarmak",
      "Sıcaklık (Q10) ya da kanal yoğunluğu değişiminin spike şekline etkisini incelemek",
      "Kanal blokerlerini modelde taklit edip deneysel bulgularla karşılaştırmak",
    ],
    rel: ["neuro.proj.hh-simulation", "neuro.comp.phase-plane", "neuro.cell.membrane-potential", "neuro.cell.action-potential"],
    vs: ["neuro.comp.lif"],
    tags: ["hodgkin-huxley", "biyofizik", "ode", "iyon-kanali"],
  })
  .o("neuro.comp.phase-plane", "İndirgenmiş modeller ve faz düzlemi (FitzHugh–Nagumo)", {
    pre: ["neuro.comp.hh-model", "math.dyn.stability"],
    d: "HH'nin hızlı ve yavaş değişkenlere ayrılarak iki boyutlu modellere (FitzHugh–Nagumo, Morris–Lecar) indirgenmesi; nullcline'lar, sabit noktalar ve limit çevrimleriyle uyarılabilirliğin geometrik analizi.",
    w: "Spike üretimini 'neden' sorusuyla anlamayı sağlar: eşik, tekrarlı ateşleme ve tip I/II davranış faz düzlemindeki çatallanmalarla açıklanır.",
    q: [
      "Dört değişkenli HH'den iki değişkene inerken ne kaybedersin? Hangi değişkenler birbirinin 'yerine geçebilir'?",
      "Faz düzleminde bir 'eşik çizgisi' gerçekten var mıdır, yoksa eşik sadece bir yanılsama mı?",
    ],
    cq: [
      "Nullcline'lar ve sabit noktalar uyarılabilirliği nasıl belirler?",
      "Hopf ve eyer-düğüm çatallanmaları hangi ateşleme tiplerine karşılık gelir?",
    ],
    obj: [
      "FitzHugh–Nagumo modelinin nullcline'larını çizer ve sabit noktayı bulur.",
      "Sabit noktanın kararlılığını Jacobi matrisinin özdeğerleriyle türetir.",
      "Girdi akımı değişince oluşan çatallanmayı simülasyonla gösterir ve tip I/II davranışı yorumlar.",
    ],
    ev: "TURETME DIAGRAM SIMULASYON YORUMLAMA",
    t: "MODELLEME",
    lv: 5,
    sc: "L",
    ch: true,
    mis: [
      "Daha basit model her zaman daha az doğrudur; doğru soru için indirgenmiş model daha açıklayıcı olabilir.",
      "Eşik sabit bir gerilim değeridir; faz düzleminde bir ayraç bölgesidir ve girdinin şekline bağlıdır.",
    ],
    x: [
      "math.dyn.stability:Jacobi matrisi ve doğrusallaştırma",
      "math.dyn.bifurcation:Hopf ve eyer-düğüm çatallanmaları",
      "math.linalg.eigen:sabit nokta kararlılığı özdeğerlerden okunur",
    ],
    ra: ["HH projesinde f–I eğrisinin tipini faz düzlemi analiziyle açıklamak"],
    rel: ["neuro.comp.hh-model", "neuro.comp.attractors", "neuro.comp.networks"],
    tags: ["faz-duzlemi", "fitzhugh-nagumo", "catallanma", "dinamik-sistemler"],
  })
  .unit("Hesaplamalı nörobilim", "Kodlama ve ağlar")
  .o("neuro.comp.spike-stats", "Spike dizisi istatistiği ve Poisson modeli", {
    pre: ["math.prob.distributions", "math.prob.stochastic~s", "neuro.comp.lif~s"],
    d: "Ateşleme hızı, spike aralığı (ISI) dağılımı, Fano faktörü, değişim katsayısı ve homojen/homojen olmayan Poisson süreçleriyle spike dizilerinin istatistiksel betimlenmesi.",
    w: "Gerçek nöron kayıtlarının gürültülü olduğu düşünüldüğünde nöral kodlama, veri analizi ve model doğrulamanın hepsi bu istatistiksel dile dayanır.",
    q: [
      "Bir nöron saniyede ortalama 10 spike atıyorsa, 100 ms'lik bir pencerede hiç spike görmeme olasılığını tahmin et. Bu olasılık 'küçük' mü?",
      "Refrakter dönem varsa spike dizisi tam Poisson olabilir mi?",
    ],
    cq: [
      "Spike dizisinin düzenliliği hangi ölçütlerle tanımlanır?",
      "Poisson modeli nerede işe yarar, nerede bozulur?",
    ],
    obj: [
      "Poisson sürecinde ISI dağılımının üstel olduğunu türetir.",
      "Bir spike dizisinden Fano faktörü ve CV değerlerini hesaplar.",
      "Homojen olmayan Poisson spike üreteci kodlar ve PSTH ile doğrular.",
    ],
    ev: "TURETME HESAPLAMA KODLAMA VERI_ANALIZI",
    t: "VERI_ANALIZI",
    lv: 4,
    sc: "M",
    mis: [
      "Ateşleme hızı tek bir denemeden güvenilir biçimde ölçülür; genellikle çok sayıda deneme ve pencere seçimi gerekir.",
      "Fano faktörünün 1 olması dizinin Poisson olduğunu kanıtlar; gerekli ama yeterli değildir.",
    ],
    x: [
      "math.prob.distributions:Poisson ve üstel dağılım",
      "math.prob.stochastic:Poisson süreci",
      "prog.python.numpy:spike dizisi üretimi ve histogram hesabı",
    ],
    ra: ["Açık elektrofizyoloji verisinde ISI dağılımı analizi", "LIF ve HH çıktılarının düzenliliğini karşılaştırmak"],
    rel: ["neuro.comp.neural-coding", "neuro.methods.data-analysis", "neuro.comp.lif"],
    tags: ["spike-istatistigi", "poisson", "fano"],
  })
  .o("neuro.comp.neural-coding", "Nöral kodlama ve kod çözme", {
    pre: ["neuro.comp.spike-stats", "math.stat.regression", "math.info.entropy~s"],
    d: "Ayar eğrileri, hız ve zamanlama kodları, popülasyon kodları; spike-tetikli ortalama, doğrusal–doğrusal olmayan–Poisson (LNP) modeller ve popülasyon vektörü ile kod çözme.",
    w: "Nöronların 'ne söylediğini' soran merkezi sorudur; beyin–bilgisayar arayüzlerinin ve modern sistem nörobilimi analizlerinin temelidir.",
    q: [
      "Tek bir nöron yönü kabaca kodluyorsa, 100 gürültülü nöron birlikte yönü ne kadar iyi kestirebilir? İyileşmenin nasıl ölçekleneceğini tahmin et.",
      "Spike'ların tam zamanlaması mı bilgi taşır, yoksa yalnızca sayıları mı? Hangi deneyle ayırırdın?",
    ],
    cq: [
      "Bir uyaran nöral yanıta nasıl eşlenir (kodlama) ve tersine nasıl kestirilir (kod çözme)?",
      "Popülasyon kodları tek nöron kodlarına göre ne kazandırır?",
    ],
    obj: [
      "Spike-tetikli ortalamayı beyaz gürültü uyaranından türetir ve hesaplar.",
      "Kosinüs ayar eğrileriyle popülasyon vektörü kod çözücüsü kodlar.",
      "Doğrusal regresyonla bir kod çözücü kurar ve çapraz doğrulamayla başarımını yorumlar.",
    ],
    ev: "TURETME KODLAMA VERI_ANALIZI YORUMLAMA",
    t: "MODELLEME",
    lv: 4,
    sc: "L",
    mis: [
      "Kod çözülebilen bilgi beynin kullandığı bilgidir; kod çözülebilirlik kullanıldığını göstermez.",
      "Gürültü yalnızca bilgi kaybıdır; ilişkili gürültü bazen bilgiyi korur ya da artırır.",
    ],
    x: [
      "math.stat.regression:doğrusal kod çözücüler regresyondur",
      "math.linalg.orthogonality:en küçük kareler ile filtre kestirimi",
      "prog.ml.basics:sınıflandırıcıyla kod çözme ve çapraz doğrulama",
    ],
    ra: ["Açık veri setinde hareket yönünün popülasyon etkinliğinden kod çözülmesi"],
    rel: ["neuro.comp.info-theory", "neuro.comp.spike-stats", "neuro.sys.sensory", "neuro.comp.bayesian-brain"],
    tags: ["noral-kodlama", "kod-cozme", "ayar-egrisi", "populasyon-kodu"],
  })
  .o("neuro.comp.info-theory", "Nörobilimde bilgi kuramı", {
    pre: ["neuro.comp.neural-coding", "math.info.entropy"],
    d: "Spike yanıtlarının entropisi, uyaran ile yanıt arasındaki karşılıklı bilgi, bit/spike ölçütleri, verimli kodlama hipotezi ve kestirim yanlılığı.",
    w: "Bir nöronun 'ne kadar' bilgi taşıdığını model-bağımsız olarak ölçmeyi sağlar; duyusal sistemlerin neden belirli biçimde kodladığını açıklayan verimli kodlama fikrine götürür.",
    q: [
      "Bir nöron her uyarana aynı yanıtı veriyorsa entropisi sıfırdır. Ya her denemede tamamen rastgele yanıt veriyorsa? İkisi de neden bilgi taşımaz?",
    ],
    cq: [
      "Karşılıklı bilgi nöral yanıtlardan nasıl kestirilir ve hangi yanlılıklar ortaya çıkar?",
      "Verimli kodlama hipotezi duyusal ayar eğrileri hakkında ne öngörür?",
    ],
    obj: [
      "Karşılıklı bilginin entropi farkı olarak tanımını türetir ve özelliklerini ispatlar.",
      "Ayrık bir uyaran–yanıt tablosundan karşılıklı bilgiyi hesaplar.",
      "Sınırlı örneklemde kestirim yanlılığını simülasyonla gösterir ve yorumlar.",
    ],
    ev: "TURETME ISPAT HESAPLAMA SIMULASYON",
    t: "TURETME",
    lv: 5,
    sc: "M",
    mis: [
      "Yüksek entropi yüksek bilgi demektir; bilgi uyaranla ilişkili entropidir.",
      "Az veriyle hesaplanan karşılıklı bilgi güvenilirdir; sistematik olarak fazla kestirilir.",
    ],
    x: [
      "math.info.entropy:entropi ve karşılıklı bilgi tanımları",
      "phys.thermo.stat-mech:termodinamik ve bilgi entropisinin ortak biçimi",
      "math.stat.inference:kestirim yanlılığı ve önyükleme (bootstrap)",
    ],
    ra: ["Model nöronun bit/spike değerini farklı gürültü düzeylerinde hesaplamak"],
    rel: ["neuro.comp.neural-coding", "neuro.sys.sensory"],
    tags: ["bilgi-kurami", "entropi", "karsilikli-bilgi"],
  })
  .o("neuro.comp.networks", "Nöron ağları ve popülasyon dinamikleri", {
    pre: ["neuro.comp.lif", "math.linalg.eigen", "math.dyn.stability~s"],
    d: "Uyarıcı–baskılayıcı (E–I) denge, hız modelleri (Wilson–Cowan), bağlantı matrisinin özdeğerleri, ağ salınımları ve LIF ağlarının simülasyonu.",
    w: "Tek nörondan davranışa giden köprüdür; korteksteki düzensiz etkinlik, ritimler ve çalışma belleği ağ düzeyinde açıklanır.",
    q: [
      "Yalnızca uyarıcı nöronlardan oluşan bir ağ neden patlar? Baskılayıcı nöronların eklenmesi dinamiği nasıl değiştirir?",
      "Bağlantı matrisinin en büyük özdeğeri 1'i geçerse ağdaki etkinlik ne olur? Tahmin et.",
    ],
    cq: [
      "Doğrusal hız ağının kararlılığı bağlantı matrisinden nasıl okunur?",
      "E–I dengesi düzensiz ateşleme ve salınımları nasıl üretir?",
    ],
    obj: [
      "Doğrusal hız ağının çözümünü özvektör ayrışımıyla türetir.",
      "Wilson–Cowan modelinin sabit noktalarının kararlılığını analiz eder.",
      "Seyrek bağlantılı bir LIF ağını NumPy ile kodlar ve raster grafiğini yorumlar.",
    ],
    ev: "TURETME KODLAMA SIMULASYON YORUMLAMA",
    t: "MODELLEME",
    lv: 5,
    sc: "L",
    mis: [
      "Ağ davranışı tek tek nöronların davranışının toplamıdır; ortaya çıkan (emergent) dinamikler vardır.",
      "Gürültülü ateşleme mutlaka dış gürültüden gelir; dengeli ağlar düzensizliği kendileri üretebilir.",
    ],
    x: [
      "math.linalg.eigen:bağlantı matrisinin spektrumu ağ kararlılığını belirler",
      "math.dyn.stability:Wilson–Cowan sabit noktalarının analizi",
      "bio.ecology:E–I etkileşimi av–avcı dinamiğine benzer",
    ],
    ra: ["E–I oranının ağ salınımlarına etkisini simüle etmek", "Küçük bir LIF ağında senkroni ölçmek"],
    rel: ["neuro.comp.attractors", "neuro.comp.hebbian", "neuro.comp.lif", "neuro.syn.transmission"],
    tags: ["ag-dinamigi", "wilson-cowan", "e-i-denge"],
  })
  .o("neuro.comp.attractors", "Çekici ağları ve çalışma belleği", {
    pre: ["neuro.comp.networks", "math.dyn.bifurcation~s"],
    ch: true,
    d: "Hopfield ağları, enerji fonksiyonu ve sabit nokta çekicileri; sürekli (halka) çekiciler, kalıcı etkinlik ve çalışma belleği modelleri.",
    w: "Belleğin bir ağın kararlı durumu olarak depolanabileceği fikrini somutlaştırır; dinamik sistemler, istatistiksel fizik ve nörobilimi tek modelde birleştirir.",
    q: [
      "Bir anıyı hatırlamak, eksik bir ipucundan tam bir örüntüye 'yuvarlanmak' gibi olabilir mi? Bunu bir enerji manzarasıyla çizmeyi dene.",
      "Bir Hopfield ağına çok fazla örüntü depolarsan ne olur? Kapasiteyi nöron sayısına göre tahmin et.",
    ],
    cq: [
      "Simetrik bağlantılı bir ağ neden her zaman sabit bir noktaya yakınsar?",
      "Kalıcı etkinlik bir uyaran kalktıktan sonra bilgiyi nasıl saklar?",
    ],
    obj: [
      "Hopfield ağında enerjinin her güncellemede artmadığını ispatlar.",
      "Hebb kuralıyla örüntü depolayan bir Hopfield ağı kodlar ve bozulmuş ipuçlarından geri çağırmayı test eder.",
      "Depolanan örüntü sayısı arttıkça geri çağırma başarısının nasıl düştüğünü simülasyonla gösterir.",
    ],
    ev: "ISPAT KODLAMA SIMULASYON TAHMIN",
    t: "CHALLENGE",
    lv: 5,
    sc: "L",
    mis: [
      "Çekici ağları belleği bir 'adreste' saklar; bilgi bağlantıların tamamına dağılmıştır.",
      "Kalıcı etkinlik yalnızca tek nöronların özelliğidir; genellikle ağ geri beslemesinden doğar.",
    ],
    x: [
      "math.dyn.bifurcation:çekicilerin doğuşu ve kaybı",
      "phys.thermo.stat-mech:Hopfield ağı ile spin camı modelleri arasındaki benzerlik",
      "math.linalg.eigen:bağlantı matrisi ve depolanan örüntüler",
    ],
    ra: ["Hopfield ağının gürültüye dayanıklılığını sistematik olarak ölçmek"],
    rel: ["neuro.cog.learning-memory", "neuro.comp.hebbian", "neuro.comp.phase-plane"],
    tags: ["hopfield", "cekici", "calisma-bellegi"],
  })
  .o("neuro.comp.hebbian", "Hebbian öğrenme ve plastisite modelleri", {
    pre: ["neuro.syn.plasticity", "neuro.comp.networks~s", "math.linalg.eigen~s"],
    d: "Hebb kuralı ve kararsızlığı, Oja kuralı ile normalizasyon, BCM kuralı, STDP modelleri ve Hebbian öğrenmenin temel bileşenler analiziyle ilişkisi.",
    w: "Biyolojik öğrenme kurallarının neyi hesapladığını matematiksel olarak gösterir; Oja kuralının PCA'ya yakınsaması nörobilim ile doğrusal cebiri birleştirir.",
    q: [
      "'Birlikte ateşleyen nöronlar birbirine bağlanır' kuralını olduğu gibi uygularsan ağırlıklar zamanla ne olur? Neden?",
    ],
    cq: [
      "Saf Hebb kuralı neden kararsızdır ve nasıl dengelenir?",
      "Oja kuralı neden girdi kovaryans matrisinin baş özvektörünü bulur?",
    ],
    obj: [
      "Ortalama Hebb dinamiğini kovaryans matrisiyle yazıp ağırlık büyümesini türetir.",
      "Oja kuralının baş bileşene yakınsadığını özdeğer analiziyle gösterir.",
      "Hebb, Oja ve STDP kurallarını kodlayıp sonuçlarını PCA ile karşılaştırır.",
    ],
    ev: "TURETME KODLAMA SIMULASYON TRANSFER",
    t: "MODELLEME",
    lv: 5,
    sc: "L",
    mis: [
      "Hebb kuralı yalnızca güçlenme içerir ve tek başına yeterlidir; normalizasyon ya da LTD olmadan ağırlıklar patlar.",
      "Hebbian öğrenme geri yayılım ile aynıdır; geri yayılım global hata sinyali kullanır, Hebb yerel çalışır.",
    ],
    x: [
      "math.linalg.svd:Oja kuralı PCA'nın çevrimiçi biçimidir",
      "math.linalg.eigen:ağırlık dinamiği kovaryans matrisinin özvektörlerince belirlenir",
      "prog.ml.neural-nets:yerel öğrenme kuralları ile geri yayılımın karşılaştırılması",
    ],
    ra: ["Doğal görüntü yamalarında Hebbian öğrenmenin alıcı alan benzeri filtreler üretmesini incelemek"],
    rel: ["neuro.syn.plasticity", "neuro.comp.attractors", "neuro.comp.ann-bridge"],
    vs: ["neuro.comp.reinforcement"],
    tags: ["hebb", "oja", "pca", "ogrenme-kurali"],
  })
  .o("neuro.comp.reinforcement", "Pekiştirmeli öğrenme ve dopamin (TD öğrenme)", {
    pre: ["neuro.cog.decision", "math.prob.markov", "prog.python.basics~c"],
    d: "Rescorla–Wagner kuralı, Markov karar süreçleri, değer fonksiyonu, zamansal fark (TD) hatası ve dopamin nöronlarının ödül tahmin hatası yorumu.",
    w: "Bir nöron popülasyonunun etkinliği ile bir algoritmanın iç değişkeni arasında kurulan en başarılı eşleşmelerden biridir; yapay zekâ ile nörobilimin ortak dilidir.",
    q: [
      "Bir ödül her zaman bir zil sesinden sonra geliyorsa, öğrenmeden sonra dopamin nöronları ödülde mi yoksa zilde mi ateşler? Ödül beklenmedik biçimde gelmezse ne olur?",
    ],
    cq: [
      "TD hatası nasıl tanımlanır ve değer tahminlerini nasıl günceller?",
      "Dopamin kayıtları TD modelinin hangi öngörüleriyle uyuşur?",
    ],
    obj: [
      "TD(0) güncelleme kuralını Bellman denkleminden türetir.",
      "Basit bir koşullanma görevinde TD öğrenmeyi kodlar ve TD hatasının zamanla ipucuna kaymasını gösterir.",
      "Model öngörülerini dopamin kayıt bulgularıyla karşılaştırarak yorumlar.",
    ],
    ev: "TURETME KODLAMA SIMULASYON YORUMLAMA",
    t: "MODELLEME",
    lv: 4,
    sc: "L",
    mis: [
      "Dopamin her ödülde aynı miktarda salınır; yanıt beklentiye göre değişir.",
      "Pekiştirmeli öğrenme yalnızca ödül maksimizasyonudur ve keşfe gerek yoktur.",
    ],
    x: [
      "math.prob.markov:Markov karar süreçleri",
      "prog.algo.dp:Bellman denklemi dinamik programlamadır",
      "prog.ml.basics:öğrenme kuralı ve parametre güncellemesi",
    ],
    ra: ["İki kollu haydut görevinde insan seçim verisine RL modeli uydurmak"],
    rel: ["neuro.syn.neuromodulation", "neuro.cog.decision", "neuro.sys.motor"],
    vs: ["neuro.comp.hebbian"],
    tags: ["pekistirmeli-ogrenme", "td", "dopamin"],
  })
  .o("neuro.comp.bayesian-brain", "Bayesçi beyin ve algı", {
    pre: ["math.stat.bayesian", "neuro.sys.sensory"],
    d: "Algıyı gürültülü duyusal veriden olasılıksal çıkarım olarak gören çerçeve; önsel bilgi, olabilirlik, duyular arası birleştirme ve görsel yanılsamaların Bayesçi açıklaması.",
    w: "Davranış verisini nicel ve sınanabilir öngörülere bağlar; belirsizlik altında algı ve karar verme modellerinin ortak dilidir.",
    q: [
      "Karanlıkta bir şeyin hareket ettiğini gördüğünde, aynı anda bir ses de duyarsan konumu daha iyi mi kestirirsin? Ne kadar iyi?",
      "Gölgeli bir yüzeyi neden 'ışık yukarıdan geliyor' varsayımıyla yorumlarız?",
    ],
    cq: [
      "Optimal bir gözlemci iki gürültülü ipucunu nasıl birleştirir?",
      "Önseller algıyı ne zaman yanıltır?",
    ],
    obj: [
      "İki Gauss ipucunun ters-varyans ağırlıklı birleştirilmesini Bayes kuralından türetir.",
      "Bir psikofizik deneyinde optimal birleştirme öngörüsünü hesaplar.",
      "Bir görsel yanılsamayı önsel–olabilirlik çatışmasıyla yorumlar.",
    ],
    ev: "TURETME HESAPLAMA YORUMLAMA MODELLEME",
    t: "MODELLEME",
    lv: 4,
    sc: "M",
    mis: [
      "Bayesçi beyin, nöronların açıkça Bayes formülü hesapladığı anlamına gelir; davranış düzeyinde bir hesaplama kuramıdır.",
      "Optimal davranış her zaman doğru algı demektir; yanlış önseller optimal ama yanlış algılar üretir.",
    ],
    x: [
      "math.stat.bayesian:önsel, olabilirlik ve sonsal",
      "math.prob.bayes:Bayes teoremi",
      "math.prob.distributions:Gauss dağılımlarının çarpımı",
    ],
    ra: ["Görsel–işitsel konum kestirimi için küçük bir çevrimiçi psikofizik deneyi"],
    rel: ["neuro.cog.decision", "neuro.comp.neural-coding", "neuro.sys.sensory"],
    tags: ["bayes", "algi", "cikarim"],
  })
  .o("neuro.comp.ann-bridge", "Yapay sinir ağları ve beyin", {
    pre: ["prog.ml.neural-nets", "neuro.comp.hebbian~s"],
    d: "Yapay ve biyolojik sinir ağlarının karşılaştırılması: görme yolu ile evrişimli ağlar, geri yayılımın biyolojik olabilirliği, ağları beyin verisiyle karşılaştırma yöntemleri.",
    w: "Güncel hesaplamalı nörobilim araştırmalarının büyük bir kısmı yapay ağları beyin modeli olarak kullanır; benzerlik ve farkları ayırt etmek eleştirel okumayı mümkün kılar.",
    q: [
      "Yapay bir ağ nesneleri insan kadar iyi tanıyorsa, bu onun beyin gibi çalıştığını gösterir mi? Hangi ek kanıtı isterdin?",
    ],
    cq: [
      "Yapay nöron ile biyolojik nöron arasında hangi soyutlamalar yapılır?",
      "Bir ağın iç temsilleri beyin etkinliğiyle nasıl karşılaştırılır?",
    ],
    obj: [
      "Yapay ve biyolojik ağları nöron modeli, öğrenme kuralı ve mimari açısından karşılaştırır.",
      "Geri yayılımın ağırlık taşıma (weight transport) gereksinimini zincir kuralından türetir ve biyolojik olabilirliğini tartışır.",
      "Temsil benzerliği analizini (RSA) küçük bir veri setinde kodlar.",
      "Bir 'ağ beyne benziyor' iddiasının kanıt gücünü değerlendirir.",
    ],
    ev: "TURETME KODLAMA YORUMLAMA TRANSFER",
    t: "TRANSFER",
    lv: 4,
    sc: "M",
    mis: [
      "Yapay sinir ağları beynin basitleştirilmiş kopyasıdır; tasarım hedefleri ve öğrenme kuralları büyük ölçüde farklıdır.",
      "Yüksek tahmin başarısı mekanistik benzerlik demektir.",
    ],
    x: [
      "prog.ml.neural-nets:yapay ağların mimarisi ve eğitimi",
      "math.opt.optimization:gradyan inişi ile biyolojik öğrenmenin karşılaştırılması",
      "res.lit.reading:model–beyin karşılaştırma makalelerinin eleştirel okunması",
    ],
    ra: ["Önceden eğitilmiş bir ağın katman temsillerini açık beyin verisiyle karşılaştırmak"],
    rel: ["neuro.comp.hebbian", "neuro.comp.neural-coding", "neuro.sys.sensory"],
    tags: ["yapay-sinir-agi", "rsa", "derin-ogrenme"],
  })
  // ───────────────────────── Yöntemler ve projeler ─────────────────────────
  .unit("Yöntemler ve projeler", "Yöntemler")
  .o("neuro.methods.electrophysiology", "Elektrofizyoloji ve EEG", {
    pre: ["neuro.cell.action-potential", "phys.em.circuits-dc~s", "math.fourier~s"],
    d: "Hücre içi ve patch-clamp kayıt, akım ve voltaj kenetleme, hücre dışı spike kaydı ve spike sıralama, yerel alan potansiyeli ve EEG ritimleri.",
    w: "HH modelinin parametreleri voltaj kenetleme deneylerinden gelir; model ile veri arasında köprü kurmak için kayıt tekniklerinin neyi ölçtüğünü bilmek gerekir.",
    q: [
      "Kafa derisinden ölçülen EEG, tek tek spike'ları mı yoksa başka bir şeyi mi görür? Neden milyonlarca nöronun eşzamanlı olması gerekir?",
      "Voltaj kenetlemede gerilimi sabit tutarsan ölçtüğün akım neyi gösterir?",
    ],
    cq: [
      "Farklı kayıt yöntemleri hangi uzaysal ve zamansal ölçekleri görür?",
      "Voltaj kenetleme iyon akımlarını nasıl ayırmayı sağlar?",
    ],
    obj: [
      "Kayıt yöntemlerini uzaysal ve zamansal çözünürlüğe göre karşılaştırır.",
      "Voltaj kenetleme deneyini devre diyagramı üzerinde açıklar.",
      "EEG verisinin güç spektrumunu hesaplayıp frekans bantlarını yorumlar.",
    ],
    ev: "ACIKLAMA DIAGRAM VERI_ANALIZI",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "EEG beynin derin yapılarındaki tek nöronları ölçer; esas olarak kortikal piramidal hücrelerin senkron sinaptik akımlarını görür.",
      "Kayıtta görülen her sinyal nöral kökenlidir; kas, göz hareketi ve elektrik şebekesi artefaktları yaygındır.",
    ],
    x: [
      "phys.em.circuits-dc:kayıt devreleri ve elektrot direnci",
      "math.fourier:sinyalin frekans bileşenlerine ayrılması",
      "phys.lab.experimental:ölçüm gürültüsü ve belirsizlik",
    ],
    ra: ["Açık voltaj kenetleme verisiyle HH iletkenlik eğrilerini karşılaştırmak", "Açık EEG veri setinde alfa ritmi analizi"],
    rel: ["neuro.methods.data-analysis", "neuro.comp.hh-model", "neuro.cog.sleep"],
    vs: ["neuro.methods.imaging"],
    tags: ["elektrofizyoloji", "eeg", "patch-clamp", "voltaj-kenetleme"],
  })
  .o("neuro.methods.imaging", "Beyin görüntüleme: fMRI ve kalsiyum görüntüleme", {
    pre: ["neuro.sys.neuroanatomy", "phys.modern.atomic-nuclear~c"],
    d: "MRI'nin fiziksel ilkesi, BOLD sinyali ve hemodinamik yanıt, fMRI deney tasarımı; genetik olarak kodlanmış kalsiyum göstergeleriyle hücre düzeyinde görüntüleme.",
    w: "İnsan beyni araştırmalarının çoğu fMRI ile yapılır; sinyalin dolaylı ve yavaş olduğunu bilmek, makalelerdeki iddiaları doğru tartmayı sağlar.",
    q: [
      "fMRI nöron etkinliğini değil kan oksijenlenmesini ölçer. Bu gecikme ve dolaylılık, 'X bölgesi Y işini yapar' türü iddiaları nasıl etkiler?",
    ],
    cq: [
      "BOLD sinyali nöral etkinlikle nasıl ilişkilidir?",
      "Kalsiyum görüntüleme spike'ları ne kadar iyi yansıtır?",
    ],
    obj: [
      "Görüntüleme yöntemlerini çözünürlük ve invazivlik açısından karşılaştırır.",
      "Hemodinamik yanıt fonksiyonuyla evrişim yaparak beklenen BOLD sinyalini modeller.",
      "Bir fMRI bulgusunun çoklu karşılaştırma ve ters çıkarım sorunlarını değerlendirir.",
    ],
    ev: "ACIKLAMA MODELLEME YORUMLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "fMRI'de 'yanan' bölge o işi tek başına yapar.",
      "Kalsiyum sinyali tek tek spike'ları doğrudan gösterir; yavaş göstergelerde spike'lar bulanıklaşır ve kestirim gerekir.",
    ],
    x: [
      "phys.modern.atomic-nuclear:nükleer manyetik rezonansın fiziksel temeli",
      "res.stats.pitfalls:fMRI'de çoklu karşılaştırma sorunu",
      "bio.genetics.molecular:genetik olarak kodlanmış göstergeler",
    ],
    ra: ["Açık bir fMRI veri setinde basit bir genel doğrusal model analizi"],
    rel: ["neuro.methods.electrophysiology", "neuro.methods.data-analysis", "neuro.sys.neuroanatomy"],
    vs: ["neuro.methods.electrophysiology"],
    tags: ["fmri", "bold", "kalsiyum-goruntuleme"],
  })
  .o("neuro.methods.data-analysis", "Nöral veri analizi (Python)", {
    pre: ["prog.python.numpy", "math.stat.inference", "math.fourier~s"],
    d: "Spike dizisi ve sürekli sinyallerin Python ile işlenmesi: filtreleme, güç spektrumu, PSTH, deneme ortalaması, istatistiksel karşılaştırma ve tekrarlanabilir analiz düzeni.",
    w: "Gerçek nörobilim verisiyle çalışmanın pratik becerisi; HH projesinin sonuçlarını analiz etmek ve açık veri setleriyle araştırma yapmak için gereklidir.",
    q: [
      "Bir sinyale 50 Hz'lik şebeke gürültüsü karışmış. Onu temizlemek için zaman alanında mı, frekans alanında mı çalışırdın? Neden?",
      "Aynı veriyle 20 farklı test yaparsan, hiç etki olmasa bile kaç 'anlamlı' sonuç beklersin?",
    ],
    cq: [
      "Nöral sinyaller nasıl temizlenir, özetlenir ve karşılaştırılır?",
      "Analiz kararları sonuçları nasıl etkileyebilir?",
    ],
    obj: [
      "Bir spike veri setinden PSTH ve raster grafiği kodlar.",
      "Örnekleme frekansı ile Nyquist sınırı arasındaki ilişkiyi türetir ve örtüşme (aliasing) hatasını gösterir.",
      "Sürekli bir sinyalin güç spektrumunu hesaplayıp filtre tasarımını gerekçelendirir.",
      "İki koşul arasındaki farkı uygun bir testle analiz eder ve belirsizliğini raporlar.",
    ],
    ev: "TURETME KODLAMA VERI_ANALIZI YORUMLAMA",
    t: "VERI_ANALIZI",
    lv: 4,
    sc: "L",
    mis: [
      "Daha fazla filtreleme her zaman daha temiz ve doğru veri demektir; filtreler sahte salınımlar ve faz kaymaları üretebilir.",
      "p < 0,05 etkinin büyük ve önemli olduğunu gösterir.",
    ],
    x: [
      "prog.python.numpy:dizi işlemleri ve vektörleştirme",
      "math.fourier:güç spektrumu ve filtreleme",
      "res.data.analysis-pipeline:tekrarlanabilir analiz iş akışı",
    ],
    ra: ["Açık bir elektrofizyoloji veri setinde koşullar arası ateşleme farkını analiz etmek"],
    rel: ["neuro.comp.spike-stats", "neuro.methods.electrophysiology", "neuro.boss"],
    tags: ["veri-analizi", "python", "psth", "spektrum"],
  })
  .o("neuro.methods.ethics", "Nörobilimde etik", {
    pre: ["res.ethics"],
    opt: true,
    d: "Hayvan deneylerinde ilkeler, insan katılımcılarla araştırmada onam, nöral verinin gizliliği, beyin–bilgisayar arayüzleri ve bilişsel güçlendirmenin etik soruları.",
    w: "Nörobilim zihin ve kimlikle doğrudan ilgilendiği için etik sorular kaçınılmazdır; kendi deneylerinde ve veri kullanımında sorumlu karar vermeni sağlar.",
    q: [
      "Bir cihaz düşüncelerinden metin üretebiliyorsa, bu veri kime aittir? Hangi koruma kurallarını önerirdin?",
    ],
    cq: [
      "Nörobilim araştırmasında hangi etik ilkeler uygulanır?",
      "Nöroteknolojiler hangi yeni etik sorunları doğurur?",
    ],
    obj: [
      "Hayvan araştırmalarındaki yerine koyma, azaltma ve iyileştirme ilkelerini bir deney önerisine uygular.",
      "Nöral veri gizliliğine ilişkin bir senaryoyu farklı etik çerçevelerle değerlendirir.",
      "Kendi küçük deneyi için bilgilendirilmiş onam metni hazırlar.",
    ],
    ev: "ACIKLAMA TRANSFER ARASTIRMA_UYGULAMASI",
    t: "KAVRAM",
    lv: 2,
    sc: "S",
    mis: [
      "Etik yalnızca deney onaylandıktan sonra bürokratik bir adımdır; tasarımın baştan bir parçasıdır.",
      "Anonimleştirilmiş nöral veri her zaman güvenlidir; yeniden tanımlama riski vardır.",
    ],
    x: [
      "res.ethics:genel araştırma etiği ilkeleri",
      "res.data.management:hassas verinin saklanması ve paylaşımı",
    ],
    notes: ["Yürürlükteki etik kurul ve mevzuat gerekliliklerini kurumunun güncel kaynaklarından doğrula."],
    rel: ["neuro.methods.imaging", "neuro.methods.electrophysiology"],
    tags: ["etik", "noroetik", "onam"],
  })
  .o("neuro.proj.hh-simulation", "Proje: Hodgkin–Huxley modelini sıfırdan simüle et", {
    pre: ["neuro.comp.hh-model", "prog.python.numpy", "res.write.report~s"],
    d: "HH denklemlerini hazır nörobilim kütüphanesi kullanmadan Python ile kodlamak; spike, eşik, refrakterlik ve f–I eğrisini yeniden üretmek, bir parametre sorusunu araştırıp rapor yazmak.",
    w: "Araştırma ilgi alanının çekirdek projesi: biyofizik, diferansiyel denklemler, sayısal yöntemler, kodlama ve bilimsel yazımı tek bir somut çıktıda birleştirir.",
    q: [
      "Simülasyonun 'doğru' olduğunu nasıl bileceksin? Elinde gerçek bir nöron yokken hangi testler güven verir?",
      "Zaman adımını yarıya indirdiğinde spike zamanları değişiyorsa bu neyi gösterir?",
    ],
    cq: [
      "Model doğru kodlandığında hangi bilinen davranışları yeniden üretmelidir?",
      "Seçilen parametre değişikliği nöronun davranışını nasıl etkiler?",
      "Sonuçlar nasıl tekrarlanabilir biçimde raporlanır?",
    ],
    obj: [
      "HH denklemlerini RK4 ile kodlar ve birim testleriyle (dinlenim potansiyeli, kapı denge değerleri) doğrular.",
      "Akım basamaklarıyla f–I eğrisini çıkarır ve tip II davranışı yorumlar.",
      "Bir araştırma sorusu (ör. sıcaklık, kanal yoğunluğu ya da bloker etkisi) belirleyip sistematik parametre taraması yapar.",
      "Yöntem, sonuç ve sınırlılıkları içeren kısa bir bilimsel rapor yazar ve kodu sürüm kontrolüyle paylaşır.",
    ],
    ev: "KODLAMA SIMULASYON TURETME ARASTIRMA_UYGULAMASI",
    t: "PROJE",
    lv: 5,
    sc: "XL",
    mis: [
      "Grafik doğru görünüyorsa kod doğrudur; birim ve işaret hataları makul görünen yanlış sonuçlar üretebilir.",
      "Orijinal makaledeki gerilim işaret kuralları modern kurallarla aynıdır; tarihsel kurallar farklıdır, dönüştürme gerekir.",
      "Proje kodu yazınca biter; doğrulama, araştırma sorusu ve raporlama işin yarısıdır.",
    ],
    x: [
      "math.ode.numerical:RK4 ve adım boyu yakınsama testleri",
      "prog.tools.git:proje kodunun sürüm kontrolü",
      "res.write.report:bilimsel rapor yazımı",
    ],
    ra: [
      "HH modelinde sıcaklığın (Q10) spike genişliği ve ateşleme hızına etkisi",
      "Na⁺ ya da K⁺ iletkenliği azaltıldığında uyarılabilirliğin değişimi",
      "HH sonuçlarını LIF ve FitzHugh–Nagumo ile karşılaştıran kısa bir rapor",
    ],
    ca: ["Araştırma projesi yarışmalarına dönüştürülebilir"],
    rel: ["neuro.comp.hh-model", "neuro.comp.phase-plane", "neuro.methods.data-analysis", "res.project.modeling"],
    tags: ["proje", "hodgkin-huxley", "simulasyon", "python"],
  })
  .o("neuro.boss", "Boss: Hesaplamalı nörobilim sentezi", {
    pre: ["neuro.comp.hh-model", "neuro.comp.neural-coding", "neuro.comp.networks", "neuro.methods.data-analysis"],
    boss: true,
    d: "Tek nöron biyofiziği, nöral kodlama, ağ dinamikleri ve veri analizini birlikte gerektiren bütünleşik bir problem seti: model kur, simüle et, veri üret, kodu çöz ve yorumla.",
    w: "Hesaplamalı nörobilimin parçalarını birbirine bağlayabildiğini kanıtlar; yaz okulu ve araştırma başvurularında beklenen bütüncül beceriyi sınar.",
    q: [
      "HH nöronlarından oluşan küçük bir ağın çıktısından uyaranı geri kestirmek istiyorsun. Hangi adımlar, hangi sırayla? Plan yapmadan önce tahmin et: en zor adım hangisi olacak?",
    ],
    cq: [
      "Tek nöron, ağ ve kodlama düzeyleri birbirini nasıl kısıtlar?",
      "Bir modelin sonucunu veri analiziyle nasıl doğrularsın?",
    ],
    obj: [
      "Bir nöron modelinin f–I ilişkisini analitik ya da faz düzlemi yöntemleriyle türetir.",
      "Model nöronlardan oluşan bir popülasyondan spike verisi üretir ve uyaranı kod çözer.",
      "Bir ağın kararlılığını özdeğer analiziyle öngörür ve simülasyonla doğrular.",
      "Tüm sonuçları belirsizlikleriyle birlikte kısa bir teknik rapor olarak yorumlar.",
    ],
    ev: "TURETME SIMULASYON VERI_ANALIZI TRANSFER",
    t: "BOSS",
    lv: 5,
    sc: "L",
    mis: [
      "Her parçayı ayrı ayrı bilmek bütünü çözmeye yeter; düzeyler arası varsayımları tutarlı tutmak ayrı bir beceridir.",
    ],
    x: [
      "math.linalg.eigen:ağ kararlılığı analizi",
      "math.stat.regression:kod çözücü kurma",
      "prog.sci.simulation:büyük ölçekli simülasyon düzeni",
    ],
    ra: ["Boss sonuçlarının bir araştırma posterine dönüştürülmesi"],
    ca: ["Hesaplamalı nörobilim yaz okulu başvurularında örnek çalışma olarak kullanılabilir"],
    rel: ["neuro.proj.hh-simulation", "neuro.comp.hh-model", "neuro.comp.neural-coding", "neuro.comp.networks"],
    tags: ["boss", "sentez", "hesaplamali-norobilim"],
  })
  .done();
