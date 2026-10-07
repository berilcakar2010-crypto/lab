import { builder } from "../dsl";

/**
 * SANAT_MUZIK — müzik kuramı, müziğin fiziği ve sanat tarihi.
 * Sanat tarihi nesneleri `src: true`: üslup, yöntem ve görsel çözümleme öne çıkar;
 * eser tarihleri, atıflar ve konumlar müze ve akademik kaynaklardan doğrulanmalıdır.
 */
export const ARTS = builder("SANAT_MUZIK")
  // ───────────────────────────── Müzik / Müzik kuramı
  .unit("Müzik", "Müzik kuramı")
  .o("music.theory.notation", "Nota yazımı ve ritim", {
    d: "Porte, anahtar, nota ve sus değerleri, ölçü sayısı, bağ ve noktalı değerlerle perde ve süreyi yazma ve okuma.",
    w: "Müziği kâğıt üzerinde temsil etmek, onu çözümlemenin, paylaşmanın ve çalmanın ön koşuludur; ritim, kesirlerle düşünmenin somut bir alıştırmasıdır.",
    pre: ["phys.waves.sound~h"],
    q: [
      "4/4'lük bir ölçüye kaç tane noktalı sekizlik sığar? Önce kesirlerle tahmin et, sonra el çırparak dene.",
      "Bir şarkıyı yalnızca el çırparak çalsan arkadaşın tanıyabilir mi? Ritim tek başına ne kadar bilgi taşır?",
    ],
    cq: [
      "Porte ve anahtar perdeyi nasıl kodlar?",
      "Nota değerleri, ölçü sayısı ve vurgu ritmi nasıl belirler?",
      "Senkop ve üçleme gibi düzensizlikler nasıl yazılır ve neden ilginçtir?",
    ],
    obj: [
      "Sol ve fa anahtarında yazılmış notaları adlandırır ve klavyede ya da çalgıda bulur",
      "Verilen bir ölçü sayısına uygun ritimleri yazar ve hatalı ölçüleri düzeltir",
      "Duyduğu kısa bir ritmi nota değerleriyle yazıya döker",
    ],
    ev: "HATIRLAMA HESAPLAMA YORUMLAMA",
    t: "BECERI",
    lv: 1,
    sc: "M",
    mis: [
      "Nota okumak yalnızca klasik müzik için gereklidir.",
      "Ölçü sayısındaki alt sayı ölçüdeki vuruş sayısını gösterir.",
    ],
    x: [
      "math.found.arithmetic:nota değerleri kesir toplama ve oran demektir",
      "write.lit.poetry:şiirde ölçü ve vurgu, müzikteki ritim yapısına benzer",
    ],
    rel: ["music.theory.scales"],
    tags: ["muzik", "nota", "ritim"],
  })
  .o("music.theory.scales", "Dizi, aralık ve tonalite", {
    d: "Majör ve minör diziler, aralıkların adlandırılması, donanım, tonalite ve beşliler çemberi; Batı dışı makam ve dizilere kısa bir bakış.",
    w: "Aralık ve dizi, melodinin ve armoninin yapı taşlarıdır; beşliler çemberi tonlar arası ilişkiyi tek bir diyagramda toplar ve akort fiziğiyle doğrudan bağlantılıdır.",
    pre: ["music.theory.notation"],
    q: [
      "Majör dizideki tam ve yarım ses dizilişini (T-T-Y-T-T-T-Y) bir başka notadan başlatırsan kaç diyez ya da bemol gerekir? Bir örüntü görüyor musun?",
      "Türk makam müziğindeki bazı perdeler piyanoda neden bulunmaz?",
    ],
    cq: [
      "Bir aralık nasıl adlandırılır (sayı ve nitelik)?",
      "Majör ve minör diziler yapı ve etki bakımından nasıl ayrılır?",
      "Beşliler çemberi donanımlar ve tonlar arası yakınlık hakkında ne söyler?",
    ],
    obj: [
      "Her tondan majör ve doğal/armonik/melodik minör dizileri yazar",
      "İki nota arasındaki aralığı sayı ve nitelikle adlandırır",
      "Bir parçanın donanımı ve başlangıç/bitiş notalarından tonunu çıkarır",
      "Beşliler çemberini kullanarak akraba tonları belirler",
    ],
    ev: "HESAPLAMA DIAGRAM YORUMLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Minör ton 'üzgün', majör ton 'mutlu' demektir; başka etken yoktur.",
      "Bütün müzik kültürleri aynı on iki perdeyi kullanır.",
    ],
    x: [
      "math.discrete.number-theory:on iki perde ve beşliler çemberi mod 12 aritmetiğidir",
      "math.adv.abstract-algebra:aktarım ve çevrim işlemleri bir grup yapısı oluşturur",
    ],
    rel: ["music.theory.chords", "music.physics"],
    tags: ["muzik", "dizi", "aralik", "tonalite"],
  })
  .o("music.theory.chords", "Akorlar ve armoni", {
    d: "Üçlü ve yedili akorların kuruluşu, çevrimler, dizinin derecelerine göre akor fonksiyonları, kadanslar ve temel ses yürütme ilkeleri.",
    w: "Armoni, bir melodiye eşlik etmenin, şarkı yazmanın ve bir parçanın gerilim-çözülme mantığını görmenin anahtarıdır.",
    pre: ["music.theory.scales"],
    q: [
      "Bir şarkı neden 'bitmedi' hissi bırakır? Son akoru değiştirerek bu hissi yaratıp yok etmeyi dene.",
    ],
    cq: [
      "Üçlü akorlar nasıl kurulur ve majör, minör, artık, eksik akorlar nasıl ayrılır?",
      "Tonik, dominant ve alt dominant fonksiyonları gerilim ve çözülmeyi nasıl yaratır?",
      "Kadans türleri bir cümlenin sonunu nasıl belirler?",
    ],
    obj: [
      "Verilen bir tonda tüm derecelerin üçlü akorlarını yazar ve Roma rakamlarıyla adlandırır",
      "Bir akor dizisindeki fonksiyonları ve kadansları çözümler",
      "Basit bir melodiye temel ses yürütme kurallarına uyan bir armoni yazar",
    ],
    ev: "HESAPLAMA YORUMLAMA PROBLEM_COZME",
    t: "BECERI",
    lv: 3,
    sc: "M",
    mis: [
      "Armoni kuralları bestecilerin uyması gereken yasalardır.",
      "Akor, aynı anda basılan rastgele notalardır.",
    ],
    x: [
      "phys.waves.basics:uyumlu ve uyumsuz aralıkların dalga girişimi ve vuru ile ilişkisi",
      "prog.python.basics:akor ve dizi üreten küçük bir program yazmak",
    ],
    rel: ["music.theory.form", "music.theory.ear"],
    tags: ["muzik", "armoni", "akor"],
  })
  .o("music.theory.ear", "Kulak eğitimi: aralık ve akor tanıma", {
    d: "Aralıkları, akor türlerini, kadansları ve kısa melodileri kulaktan tanıma, söyleme ve yazıya dökme pratiği.",
    w: "Kuram, ancak duyulan sesle eşleştiğinde müzikal olur; kulak eğitimi işitsel algının pratikle nasıl keskinleştiğini de somut biçimde gösterir.",
    pre: ["music.theory.scales"],
    q: [
      "Bildiğin bir şarkının ilk iki notası arasındaki aralığı bulabilir misin? Bu şarkıyı o aralığı tanımak için 'anahtar' olarak kullanabilir misin?",
    ],
    cq: [
      "Aralıklar kulaktan hangi ipuçlarıyla ayırt edilir?",
      "Majör, minör, artık ve eksik akorların karakteri nasıl tanınır?",
      "Bir melodiyi dikte ederken hangi strateji (önce ritim, sonra perde) işe yarar?",
    ],
    obj: [
      "Çalınan basit aralıkları ve dört temel üçlü akoru kulaktan adlandırır",
      "Kısa bir melodiyi duyduktan sonra notaya döker",
      "Kendi tanıma doğruluğunu düzenli kayıtla izler ve zayıf aralıklara odaklanan bir pratik planı uygular",
    ],
    ev: "TAHMIN VERI_ANALIZI TRANSFER",
    t: "PRATIK",
    lv: 2,
    sc: "M",
    mis: [
      "Kulak ya doğuştan vardır ya yoktur; çalışmayla gelişmez.",
      "Mutlak kulağı olmayan biri aralık tanıyamaz.",
    ],
    x: [
      "neuro.sys.sensory:işitme sistemi ve perde algısı",
      "comp.meta.deliberate-practice:hata kaydı ve hedefli tekrar",
      "psy.sensation-perception:algısal öğrenme ve eşikler",
    ],
    rel: ["music.theory.chords"],
    tags: ["muzik", "kulak", "pratik"],
  })
  .o("music.theory.form", "Müzikal biçim ve analiz", {
    d: "Motif, cümle ve dönem; iki ve üç bölmeli biçim, rondo, tema ve varyasyon, sonat biçimi ve popüler şarkı biçimleri üzerinden bir eserin yapısını çözümleme.",
    w: "Biçim, uzun bir eseri dinlerken nerede olduğunu bilmeyi sağlar; tekrar ve karşıtlık ilkesi edebiyat, mimari ve programlamadaki yapı fikriyle karşılaştırılabilir.",
    pre: ["music.theory.chords", "gk.art.music~s"],
    q: [
      "Bir şarkıda nakarat neden tekrar eder? Hiç tekrar olmayan beş dakikalık bir parça dinleyici için nasıl bir deneyim olur?",
    ],
    cq: [
      "Tekrar, çeşitleme ve karşıtlık bir eserin yapısını nasıl kurar?",
      "Sonat biçiminde ton planı ve tema düzenlemesi nasıl işler?",
      "Bir eserin biçim şeması kayıttan nasıl çıkarılır?",
    ],
    obj: [
      "Bir kayıt ya da partisyondan zaman damgalı bir biçim şeması çıkarır",
      "Bir eserdeki motifin dönüşümlerini izleyip yorumlar",
      "İki farklı dönemden eserlerin biçimsel seçimlerini karşılaştırır",
    ],
    ev: "YORUMLAMA DIAGRAM ACIKLAMA",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "Biçim, besteciden önce var olan katı bir kalıptır.",
      "Popüler müziğin biçimsel bir yapısı yoktur.",
    ],
    x: [
      "write.lit.fiction:anlatıda yapı ve tekrar ile müzikal biçim arasındaki benzerlik",
      "prog.algo.recursion:tema ve varyasyonda öz-benzer, iç içe yapılar",
    ],
    rel: ["music.theory.chords"],
    tags: ["muzik", "bicim", "analiz"],
  })
  .o("music.physics", "Müziğin fiziği: armonikler ve akort", {
    d: "Titreşen tel ve hava sütununda duran dalgalar, armonik seri, tını ve tayf, uyum ve vuru, Pisagor akordu, saf akort ve eşit tamperaman.",
    w: "Bir çalgının neden o sesi çıkardığını ve neden 'mükemmel' bir akortun var olamayacağını fizik ve matematikle açıklar; dalga fiziği ve Fourier analizinin en sezgisel uygulamasıdır.",
    pre: ["music.theory.scales", "phys.waves.basics", "math.fourier~s"],
    q: [
      "On iki saf beşli çıkarsan başladığın notaya (yedi oktav yukarıda) tam olarak geri döner misin? (3/2)^12 ile 2^7'yi karşılaştır.",
      "Bir keman ile bir flüt aynı La notasını çalıyor. Frekans aynıysa neden farklı duyuluyor?",
    ],
    cq: [
      "Tel ve borularda armonik seri nasıl türetilir?",
      "Tını, armoniklerin göreli şiddetleriyle nasıl ilişkilidir?",
      "Pisagor koması nedir ve eşit tamperaman bu sorunu hangi bedelle çözer?",
    ],
    obj: [
      "İki ucu sabit tel ve açık/kapalı borular için izinli frekansları duran dalga koşulundan türetir",
      "Saf beşlilerden kurulan bir dizinin oktavı kapatmadığını hesaplayıp komanın büyüklüğünü sent cinsinden bulur",
      "Bir çalgı kaydının frekans tayfını (FFT) çizip armonikleri yorumlar",
      "Vuru frekansını hesaplayıp akort etmede nasıl kullanıldığını açıklar",
    ],
    ev: "TURETME HESAPLAMA VERI_ANALIZI KODLAMA",
    t: "MODELLEME",
    lv: 4,
    sc: "L",
    mis: [
      "Bir nota tek bir frekanstan oluşur.",
      "Eşit tamperamanda aralıklar 'saf'tır; piyano kusursuz akortludur.",
      "Daha yüksek ses daha yüksek frekans demektir.",
    ],
    x: [
      "phys.waves.basics:duran dalgalar ve harmonikler",
      "math.fourier:tını, bir sesin Fourier tayfıdır",
      "phys.waves.sound:ses şiddeti, perde ve vuru",
    ],
    ra: ["Farklı çalgıların tayflarını kaydedip karşılaştıran küçük bir veri analizi"],
    ca: ["Fizik olimpiyatlarında tel, boru ve vuru problemleri"],
    rel: ["music.theory.scales", "music.theory.ear"],
    tags: ["muzik", "fizik", "akort", "fourier"],
  })

  // ───────────────────────────── Sanat / Sanat tarihi
  .unit("Sanat", "Sanat tarihi")
  .o("art.elements", "Görsel sanatın öğeleri ve ilkeleri", {
    d: "Çizgi, biçim, renk, değer, doku, mekân öğeleri ile denge, vurgu, ritim, oran ve birlik ilkeleri üzerinden bir yapıtı biçimsel olarak çözümleme.",
    w: "Bir resme 'güzel' demenin ötesine geçip nasıl çalıştığını anlatmanın ortak dilidir; tasarım, bilimsel görselleştirme ve fotoğrafta da aynı ilkeler geçerlidir.",
    pre: ["gk.art.visual~s"],
    q: [
      "Bir tabloya ilk baktığında gözün nereye gidiyor? Sonra nereye? Ressam bu yolu nasıl çizmiş olabilir?",
    ],
    cq: [
      "Renk, değer ve kontrast vurguyu nasıl yaratır?",
      "Kompozisyonda denge ve ritim nasıl kurulur?",
      "Biçimsel çözümleme ile bağlamsal yorum nasıl birleştirilir?",
    ],
    obj: [
      "Bir yapıtın biçimsel çözümlemesini öğeler ve ilkeler sözlüğüyle yazar",
      "Bakışın yapıt üzerindeki yolunu bir diyagramla gösterip gerekçelendirir",
      "Aynı konuyu işleyen iki yapıtın biçimsel seçimlerini karşılaştırır",
    ],
    ev: "YORUMLAMA DIAGRAM ACIKLAMA",
    t: "BECERI",
    lv: 1,
    sc: "S",
    mis: [
      "Sanat hakkında konuşmak tamamen kişisel zevk meselesidir.",
      "Renk yalnızca gerçekçilik için kullanılır.",
    ],
    x: [
      "res.data.visualization:vurgu, kontrast ve hiyerarşi bilimsel grafiklerde de geçerlidir",
      "phys.optics.geometric:perspektif ve ışık-gölge geometrik optiğe dayanır",
      "psy.sensation-perception:renk ve şekil algısı, figür-zemin ilişkisi",
    ],
    rel: ["art.history.ancient-medieval", "art.history.global"],
    tags: ["sanat", "bicimsel-analiz", "kompozisyon"],
  })
  .o("art.history.ancient-medieval", "Antik ve Orta Çağ sanatı", {
    d: "Antik Akdeniz ve Yakın Doğu uygarlıklarından Bizans, Roman ve Gotik döneme kadar sanatın işlevi, malzemesi, ikonografisi ve üslup değişimleri.",
    w: "Sanatın dini, siyasi ve toplumsal işlevini anlamak, sonraki dönemlerin neyi sürdürüp neye karşı çıktığını görmeyi sağlar; Anadolu'nun bu tarihteki yeri doğrudan incelenebilir.",
    pre: ["art.elements", "gk.world.ancient~s"],
    q: [
      "Bir heykelin gözleri ve duruşu, yapıldığı toplumun insan hakkında ne düşündüğünü söyleyebilir mi? İki dönemden bir örnek seç ve tahmin et.",
    ],
    cq: [
      "Sanat yapıtları dini ve siyasi otoriteyi nasıl temsil etti?",
      "Gerçekçilik ve stilizasyon arasındaki gidip gelmeler neyle açıklanabilir?",
      "Mimari teknikler (kemer, kubbe, payanda) üslubu nasıl biçimlendirdi?",
    ],
    obj: [
      "Bir yapıtı malzeme, işlev ve ikonografi açısından dönemiyle ilişkilendirerek çözümler",
      "İki dönemden yapıtları üslup özellikleriyle karşılaştırır",
      "Bir mimari yeniliğin yapısal mantığını ve görsel sonucunu açıklar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Orta Çağ sanatı beceri eksikliği nedeniyle 'gerçekçi' değildir.",
      "Antik heykeller her zaman beyaz mermerdi.",
    ],
    x: [
      "gk.world.medieval:Orta Çağ toplum ve inanç yapısı",
      "phys.mech.torque:kemer ve kubbede yük ve denge",
    ],
    notes: ["Yapıtların tarihlerini, konumlarını ve atıflarını müze kataloglarından ve akademik kaynaklardan doğrula."],
    rel: ["art.history.renaissance-baroque"],
    tags: ["sanat-tarihi", "antik", "orta-cag"],
    src: true,
  })
  .o("art.history.renaissance-baroque", "Rönesans ve Barok sanatı", {
    d: "Doğrusal perspektif, anatomi ve ışık çalışmalarıyla Rönesans'ın yeni görme biçimi; Barok'ta hareket, ışık-gölge ve duygusal yoğunluk.",
    w: "Sanat ile bilimin (perspektif geometrisi, anatomi, optik) en yakın olduğu dönemlerden biridir; himaye ve din çatışmalarının sanatı nasıl biçimlendirdiğini gösterir.",
    pre: ["art.history.ancient-medieval", "gk.world.renaissance~s"],
    q: [
      "Düz bir yüzeye derinlik çizmek için bir kural bulmanız gerekseydi ne yapardınız? Bir koridor fotoğrafındaki çizgiler nerede buluşuyor?",
    ],
    cq: [
      "Doğrusal perspektif hangi geometrik ilkeye dayanır?",
      "Himaye sistemi ve dini çatışmalar sanatın konusunu ve üslubunu nasıl etkiledi?",
      "Barok, Rönesans'ın denge idealinden nasıl ayrılır?",
    ],
    obj: [
      "Bir resimde kaçış noktası ve ufuk çizgisini bulup perspektif yapısını çizer",
      "Bir Rönesans ve bir Barok yapıtı kompozisyon, ışık ve hareket açısından karşılaştırır",
      "Bir yapıtın himaye ve dini bağlamını yorumuna dahil eder",
    ],
    ev: "DIAGRAM YORUMLAMA ACIKLAMA",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Rönesans, Orta Çağ'ın 'karanlığından' ani bir kopuştur.",
      "Perspektif yalnızca yetenekle, kurala dayanmadan çizilir.",
    ],
    x: [
      "math.geo.transformations:merkezi izdüşüm ve perspektif geometrisi",
      "gk.sci-hist.scientific-revolution:sanatçı-mühendisler ve gözleme dayalı bilgi",
      "gk.world.europe-reformation:Reform ve Karşı Reform'un sanata etkisi",
    ],
    notes: ["Sanatçılara yapılan atıfları ve eser tarihlerini güncel akademik kaynaklardan doğrula."],
    rel: ["art.history.modern"],
    tags: ["sanat-tarihi", "ronesans", "barok", "perspektif"],
    src: true,
  })
  .o("art.history.modern", "Modern ve çağdaş sanat", {
    d: "Fotoğrafın etkisiyle temsilden uzaklaşan akımlar, soyutlama, hazır nesne ve kavramsal sanat; çağdaş sanatta malzeme, mekân ve izleyicinin rolü.",
    w: "\"Bunu ben de yapardım\" tepkisini bir soruya dönüştürmeyi öğretir: sanat neyi, neden sorguluyor? Teknoloji ve toplumsal değişimin görsel kültüre etkisini izlemeyi sağlar.",
    pre: ["art.history.renaissance-baroque"],
    q: [
      "Fotoğraf makinesi icat edildikten sonra bir ressam neden hâlâ gerçekçi resim yapsın? Sen ressam olsaydın ne yapardın?",
      "Bir nesneyi müzeye koymak onu sanat eseri yapar mı? Kim karar verir?",
    ],
    cq: [
      "Fotoğraf ve sanayileşme resmin amacını nasıl değiştirdi?",
      "Soyutlama ve kavramsal sanat 'sanat nedir?' sorusunu nasıl yeniden tanımladı?",
      "Çağdaş bir yapıtı değerlendirirken hangi sorular sorulmalıdır?",
    ],
    obj: [
      "Modern bir akımın önceki geleneğe karşı çıkışını gerekçeleriyle açıklar",
      "Kavramsal bir yapıtı fikir, malzeme ve izleyici ilişkisi açısından yorumlar",
      "Bir çağdaş yapıt hakkında kanıta dayalı kısa bir eleştiri yazısı yazar",
    ],
    ev: "YORUMLAMA ACIKLAMA TRANSFER",
    t: "KAVRAM",
    lv: 3,
    sc: "M",
    mis: [
      "Soyut sanat, çizim becerisi olmayanların işidir.",
      "Çağdaş sanatın anlamı yoktur ya da yalnızca sanatçının bildiği bir anlamı vardır.",
    ],
    x: [
      "gk.world.industrial:sanayileşme, kentleşme ve yeni görsel kültür",
      "media.lit.image-video:görüntünün manipülasyonu ve gerçeklik iddiası",
      "write.compose.evidence:bir yapıt hakkında kanıta dayalı eleştiri yazmak",
    ],
    notes: ["Akım adları, sanatçılar ve tarihler için müze ve akademik kaynakları kullan; tek bir çevrimiçi özetle yetinme."],
    rel: ["art.history.global"],
    tags: ["sanat-tarihi", "modern", "cagdas"],
    src: true,
  })
  .o("art.history.global", "Avrupa dışı sanat gelenekleri (İslam, Asya, Afrika, Amerika)", {
    d: "İslam dünyası, Güney ve Doğu Asya, Afrika ve yerli Amerika sanat geleneklerini kendi işlevleri, malzemeleri ve estetik ilkeleriyle inceleme; kültürler arası etkileşim.",
    w: "Sanat tarihini tek bir Avrupa çizgisi olarak okumanın sınırlarını gösterir; ticaret yolları ve imparatorluklar boyunca biçimlerin ve tekniklerin nasıl dolaştığını izler.",
    pre: ["art.elements"],
    q: [
      "Bir maske müzede vitrinde durduğunda ile bir törende kullanıldığında aynı nesne midir? Ne kaybolur?",
    ],
    cq: [
      "Farklı geleneklerde sanatın işlevi (ritüel, siyasi, gündelik) nasıl farklılaşır?",
      "Ticaret ve fetih biçim ve tekniklerin yayılmasını nasıl etkiledi?",
      "Müze koleksiyonlarının kökeni hangi etik soruları doğurur?",
    ],
    obj: [
      "Bir Avrupa dışı yapıtı kendi bağlamındaki işlevi ve malzemesiyle çözümler",
      "Bir biçimin ya da tekniğin kültürler arasındaki yolculuğunu bir harita ya da şemayla gösterir",
      "Bir müze nesnesinin edinim geçmişiyle ilgili etik soruları tartışan kısa bir yazı yazar",
    ],
    ev: "YORUMLAMA DIAGRAM ACIKLAMA",
    t: "KAVRAM",
    lv: 2,
    sc: "M",
    mis: [
      "Avrupa dışı sanat 'ilkel' ya da 'zanaat'tır.",
      "Her kültürün sanatı tarih boyunca değişmeden kalmıştır.",
    ],
    x: [
      "gk.world.ap-1200-1450:ticaret ağları boyunca biçim ve teknik alışverişi",
      "gk.geo.human-culture:kültürel yayılma ve etkileşim",
    ],
    notes: ["Kültürlerin ve yapıtların adlandırılmasını, tarihlerini ve koleksiyon geçmişlerini güvenilir müze ve akademik kaynaklardan doğrula."],
    rel: ["art.islamic-ottoman"],
    tags: ["sanat-tarihi", "kuresel", "kulturlerarasi"],
    src: true,
  })
  .o("art.islamic-ottoman", "İslam ve Osmanlı sanatı: hat, tezhip, mimari", {
    d: "İslam sanatında geometrik ve bitkisel bezeme, hat ve tezhip gelenekleri, minyatür; Osmanlı mimarisinde kubbe, külliye ve mekân düzenlemesi.",
    w: "Geometri, yazı ve mimarinin iç içe geçtiği bir geleneği tanıtır; yakın çevredeki yapıları okumayı ve sanatı matematiksel simetri ile ilişkilendirmeyi sağlar.",
    pre: ["art.history.global", "gk.tr-hist.ottoman-institutions~s"],
    q: [
      "Bir çini desenini cetvel ve pergelle yeniden çizebilir misin? Hangi simetrileri fark ediyorsun ve desen sonsuza kadar nasıl devam edebilir?",
    ],
    cq: [
      "Geometrik bezemede simetri ve tekrar nasıl kurulur?",
      "Hat ve tezhip sanatlarında yazı nasıl görsel bir öğeye dönüşür?",
      "Osmanlı külliyesinin mimari ve toplumsal işlevleri nasıl bir araya gelir?",
    ],
    obj: [
      "Basit bir geometrik deseni pergel-cetvel yapımıyla çizer ve simetri türlerini belirler",
      "Bir cami ya da külliye planını mekân düzeni ve işlev açısından çözümler",
      "Hat ve tezhip yapıtında yazı, bezeme ve sayfa düzeni ilişkisini yorumlar",
    ],
    ev: "DIAGRAM YORUMLAMA ACIKLAMA",
    t: "UYGULAMA",
    lv: 3,
    sc: "M",
    mis: [
      "İslam sanatında figür hiçbir zaman kullanılmamıştır.",
      "Geometrik desenler yalnızca süslemedir; matematiksel bir yapıları yoktur.",
    ],
    x: [
      "math.geo.transformations:desenlerde öteleme, dönme ve yansıma simetrileri",
      "math.adv.abstract-algebra:duvar kâğıdı simetri grupları",
      "gk.tr-hist.ottoman-institutions:vakıf ve külliye sisteminin toplumsal işlevi",
    ],
    ra: ["Yakındaki tarihi bir yapının bezeme ve plan belgelemesi"],
    notes: ["Mimarlara ve sanatçılara yapılan atıfları, yapım tarihlerini ve onarım geçmişlerini akademik kaynaklardan doğrula."],
    rel: ["art.elements"],
    tags: ["sanat-tarihi", "islam-sanati", "osmanli", "geometri"],
    src: true,
  })
  .done();
