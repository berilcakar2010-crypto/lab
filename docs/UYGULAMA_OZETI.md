# Lab — uygulama özeti

> Bu belge, Lab uygulamasını hiç görmemiş birine (ya da başka bir yapay zekâya) uygulamanın
> ne olduğunu, neler içerdiğini ve nasıl çalıştığını anlatmak için yazıldı.

## 1. Kısaca

**Lab**, lise ve üniversite öncesi düzeydeki bir öğrenci için kişisel bir "akademik işletim
sistemi"dir. Büyük bir öğrenme hedefini küçük, anlamlı adımlara böler. Öğrenci her adımı
dener, anında geri bildirim alır, ustalaşana kadar yeniden dener ve ilerlemesini görür. Her
şey tek bir soruya döner: **"Sırada ne var?"**

```
BÜYÜK HEDEF → MİKRO ADIM → AKTİF DENEME → ANINDA GERİ BİLDİRİM → YENİDEN DENE
           → USTALIK → GÖRÜNÜR İLERLEME → "SIRADA NE VAR?" → SONRAKİ ADIM
```

- **Platform:** Android uygulaması (APK) ve web. Tek kişilik kullanım için tasarlandı.
- **Hesap ve sunucu yok:** Tüm veriler cihazda (IndexedDB) tutulur.
- **İnternetsiz çalışır:** Yapay zekâ isteğe bağlıdır. Anahtar girilmezse her YZ işlevinin
  çevrimdışı bir karşılığı vardır.
- **Dil:** Ana dil İngilizcedir; Türkçe tam bir seçenektir. Arayüz, içerik ve YZ yanıtları
  iki dillidir. Dil değişince düzenlenmemiş hazır içerik de çevrilir.
- **Tasarım:** "Bordo araştırma defteri" teması kullanılır: koyu kâğıt zemin, bordo vurgular,
  serif başlıklar ve defter kenar çizgisi. Arka planda hafif ışık, kartlarda derinlik ve
  sade animasyonlar vardır. "Hareketi azalt" ayarı açıkken hepsi kapanır.

## 2. Temel ilkeler

- **Ustalık esaslı ilerleme:** Bir adım, ustalık ölçütleri karşılanınca tamamlanır.
  "Okudum" demek yetmez; bir şeyi yapabilmek gerekir.
- **Zorlamadan yönlendirme:** Önkoşul eksikse Lab yalnızca "Buradan başlaman öneriliyor"
  der. Öğrenciyi geri göndermez, kilitlemez.
- **Dürüst istatistik:** Örnek azsa sonuç gösterilmez ("yetersiz veri"). Oranlar örnek
  sayısı ve güven aralığıyla verilir. "Neden olur" değil, yalnızca "ilişkili" denir.
  Eğlenmek, öğrenmenin kanıtı sayılmaz.
- **Verinin sahibi öğrencidir:** Her şey dışa aktarılabilir (JSON, CSV, Markdown, Anki,
  .ics, SVG/PNG).

## 3. Ana ekranlar

Alt menüde altı bölüm var: Ana sayfa · Grafik · Çalış · Çalışmalar · İstatistik · Ayarlar.
Her yerden **Ctrl/⌘ K** ya da `/` ile genel arama ve hızlı komut paleti açılır.

| Ekran | İçerik |
|---|---|
| **Ana sayfa (Open Lab)** | Pano değil: nerede olduğunu söyleyen tek cümle ve gerekçesi, güven değeriyle **tek bir "şimdi bunu yap"**, yarım kalan iş için Devam / Baştan / Gözden geçir / Değiştir, **Beni şaşırt** ve **Ne çalışacağımı bilmiyorum**. Altında: sırada ne var, önerilen adımlar, sıradaki sınav ve geri sayımı, "Bugün, sınavların için" önerileri, bilgi grafiği önerisi, tekrar bekleyen konu/kart sayısı, dersler ve son ilerlemeler, EN/TR düğmesi. |
| **Ders oluşturucu** | Ders adı yazılır ya da müfredat yapıştırılır. Lab ünite → konu → mikro adım yapısına çevirir. Önce bilgi grafiğinde eşleşen yol ya da nesne aranır. |
| **Ders sayfası** | Ünite ve adım haritası, ilerleme, müfredat düzenleyici. |
| **Oturum** | Bir adım üzerinde aktif çalışma: soru, deneme, ipucu, geri bildirim, yeniden deneme. Ustalık kontrolünden geçince kutlama gösterilir. Ardından oturum özeti gelir. |
| **Grafik (bilgi grafiği)** | Bağlam, Harita, Yollar, Alanlar, Eşlemeler, Doğrulama ve Sürüm görünümleri. Her nesne bir alt pencerede açılır. |
| **Çalış** | Konular (aralıklı tekrar), Sınavlar, Kart tekrarı, Takvim, Kartlar, Anlatımlar, YZ sohbetleri, Dışa aktar. |
| **Çalışmalar** | Hedefler, projeler, araştırma günlüğü, portfolyo/eserler, okul kayıtları, zaman çizelgesi, yıllık değerlendirme (bkz. §12). |
| **İstatistik** | Ham olaylardan hesaplanan istatistikler, Odak Lab, kişisel deneyler. |
| **Kalıcılık** | Ustalaşılan adımlar için zamanla gelen kalıcılık kontrolleri. |
| **Ayarlar** | Dil, YZ sağlayıcısı ve anahtarı, YZ üslubu, hatırlatmalar, kalıcılık stratejisi, hareketi azaltma, yedekleme/geri yükleme, sistem sağlığı, bütünlük kontrolü. |

## 4. Bilgi grafiği (Lab Müfredatı v2.1)

Uygulamanın merkezinde zamandan bağımsız, "yaşayan" bir bilgi grafiği var.

- **Kapsam:** 19 alanda **482 öğrenme nesnesi**.
  - **Bilimler:** matematik, fizik, kimya, biyoloji, nörobilim, yer ve uzay bilimleri, çevre bilimi.
  - **Hesaplama ve araştırma:** programlama/bilgisayar bilimi, araştırma becerileri, yarışma ve meta beceriler.
  - **Sosyal bilimler ve sanat:** psikoloji, ekonomi, genel kültür, yazım ve retorik, sanat ve müzik.
  - **Diller ve medya:** medya okuryazarlığı, İngilizce, Almanca, Japonca.
- **Nesnenin içeriği:**
  - açıklama ve neden önemli olduğu,
  - giriş soruları ve temel sorular,
  - öğrenme hedefleri ve ustalık ölçütleri,
  - kanıt türleri,
  - zorluk (1–5) ve kapsam,
  - sık yapılan yanılgılar,
  - disiplinlerarası bağlantılar,
  - araştırma ve yarışma uygulamaları.
- **Önkoşullar dört güçtedir:** zorunlu, yumuşak, bağlamsal, önerilen hazırlık. Hazır olmayı
  yalnızca zorunlu olanlar etkiler.
- **Kalıcı kimlikler:** Her nesnenin değişmez bir kimliği var (ör. `math.calc.limits`).
  Kimlik defteri yalnızca büyür; bölünen ya da birleşen nesneler "kullanım dışı" olarak kalır.
- **Eşleme katmanı:** 25 AP dersinin 163 ünitesi grafiğe eşlenmiştir; bunlardan 24 ders
  College Board metnine göre doğrulanmıştır. Okul, yarışma ve araştırma eşlemeleri de vardır.
  Her eşlemenin durumu "doğrulanmış", "geçici" ya da "bilinmiyor"dur.
- **Kişisel durum:** Her nesne şu durumlardan birini alır: Ustalaşıldı, Tekrar gerekli,
  Biliyorum (kendi beyanım), Çalışılıyor, Başlamaya hazır, Önkoşul eksik, Pasif.
- **Yollar:** Fizik Olimpiyatı, Hesaplamalı Nörobilim, Araştırma gibi öğrenme yolları ayrı
  müfredat değildir; aynı grafiğin aşama aşama görünümleridir.
- **"Bunu çalış":** Bir nesne, her biri yeni bir yetenek kazandıran mikro adımlara bölünür ve
  derse eklenir.
- **Doğrulayıcı ve güncelleme planlayıcı:**
  - Doğrulayıcı döngüleri, eksik önkoşulları, bağlantısız nesneleri, belirsiz ölçütleri ve
    eskimiş eşlemeleri raporlar.
  - Güncellemeler önce bir plan olarak gösterilir. Yeni hata getiren güncelleme uygulanmaz
    ve öğrencinin ilerlemesi her zaman korunur.

## 5. Çalışma araçları

Her bilgi grafiği nesnesinin penceresinde şu sekmeler var: Genel · Harita · Zihin haritası ·
Kartlar · YZ'ye sor · Anlat · Notlar.

- **Bilgi haritası:**
  - Atlas: tüm alanlar.
  - Alan haritası: seçilen alanın önkoşul ağı.
  - Komşuluk haritası: önkoşullar yukarıda, açtığı konular aşağıda, disiplinlerarası
    bağlantılar yanlarda.
  - Sürükle-kaydır, iki parmakla ve tekerlekle yakınlaştırma.
- **Zihin haritaları:**
  - Her nesne ve her alan için tek bakışta hatırlatan, iki yana açılan dallı harita.
  - Öğrenci kendi dallarını ekleyebilir.
  - SVG, PNG ve Markdown olarak dışa aktarılır.
- **Kartlar (flashcard):**
  - Grafikten otomatik, YZ ile ya da elle oluşturulur. Boşluk doldurma kartları da var.
  - SM-2 tabanlı aralıklı tekrar: Tekrar / Zor / İyi / Kolay.
  - Anki ve CSV olarak dışa aktarılır.
- **YZ'ye sor:** Her nesne için kayıtlı sohbet. Çevrimdışıyken yanıtlar grafikten üretilir.
- **Mantığını anlat:**
  - Öğrenci konuyu yazılı, sesli ya da videolu anlatır.
  - YZ, nesnenin ustalık ölçütlerine göre puanlar ve eksikleri söyler.
    - Gemini sesi ve videoyu doğrudan değerlendirir.
    - Groq önce Whisper ile konuşmayı yazıya döker.
  - Anahtar yoksa öğrenci ölçütleri kendisi işaretler.
  - Kayıtlar cihazda ayrı bir depoda tutulur ve dışa aktarılabilir.
- **Notlar** ve **sesli okuma** (cihazın metin okuma özelliğiyle).

## 6. Aralıklı tekrar ve çalışma takibi

- **Çalışma günlüğü:** Çalışılan her konu tarihiyle kaydedilir. Kaynaklar: pratik, ustalık,
  anlatım, YZ sorusu, kart tekrarı ve konu tekrarı.
- **Konu tekrarı:**
  - Her konu 1 → 3 → 7 → 14 → 30 → 60 → 120 gün aralıklarla tekrara gelir.
  - Öğrenci önce hatırlamaya çalışır, sonra grafikle karşılaştırır.
  - Unuttum / Zorlandım / İyi / Kolay seçimine göre basamakta ilerler ya da geriler.
- **Takvim:** 5 haftalık çalışma ızgarası, üst üste çalışılan gün sayısı (seri), günlere göre
  konular ve yaklaşan tekrarlar.
- **Kalıcılık kontrolleri:** Ustalaşılan adımlar belirli aralıklarla yeniden sınanır.

## 7. Sınav takvimi ve sınava göre çalışma önerileri

- **Kayıt:** Okul sınavları, quizler, ödev ve sunum teslimleri girilir: ders, başlık,
  tarih-saat, notlar ve kapsadığı bilgi grafiği konuları. Ders ve başlıktan konu önerilir.
- **Hazırlık yüzdesi:** Konu konu hesaplanır ve her konu yeni / zayıf / orta / güçlü diye
  işaretlenir. Hesapta ustalık, kendi beyan, tekrar basamağı, son çalışma tarihi ve kart
  sonuçları kullanılır. Eksik zorunlu önkoşullar ayrıca listelenir.
- **Günlük çalışma planı:** Sınava kadar her gün için çıkarılır:
  - önce eksik önkoşullar,
  - sonra yeni ve zayıf konular,
  - her konu 1 ve 3 gün sonra tekrar,
  - sınavdan önceki gün kendini sınama,
  - sınav sabahı kısa bir göz atma.

  Plan sürenin rahat, yoğun ya da sıkışık olduğunu açıkça söyler.
- **Ana sayfa:** Sıradaki sınavın geri sayımı ve o günün önerileri görünür.
- **Ek özellikler:** Zayıf konular için tek dokunuşla kart, .ics takvim dışa aktarımı, sınav
  sonrası not kaydı.

## 8. Bildirimler

- **Günlük tekrar hatırlatması:** Seçilen saatte o gün tekrar edilecek konu ve kart sayısını
  söyler. Android'de 14 gün önceden planlanır ve uygulamadan her çıkışta güncellenir.
- **Sınav hatırlatmaları:**
  - Sınavdan 2 hafta, 1 hafta, 3 gün ya da 1 gün önce ve sınav sabahı seçilebilir.
  - Bildirimde hazırlık yüzdesi ve o günün konuları yazar.
  - Dokununca ilgili ekran açılır.
- **Tarayıcıda:** Bildirim yalnızca uygulama açılınca gösterilebilir.

## 9. Yapay zekâ katmanı

- **Sağlayıcılar:** Gemini ya da Groq. API anahtarı yalnızca cihazda saklanır.
- **14 YZ rolü:**
  - Öğretme ve rehberlik: öğretmen, Sokratik rehber, ipucu üretici, geri bildirim üretici.
  - Değerlendirme: değerlendirici, zorluk ayarlayıcı.
  - Müfredat: adım üretici, müfredat kurucu, müfredat danışmanı, yansıma analisti.
  - Çalışma araçları: soru-cevap asistanı, anlatım değerlendirici, kart üretici, zihin
    haritası üretici.
  - Sonradan eklenenler: araştırma rehberi, YZ ile adım ayrıştırma, soru varyasyonu üretme
    (büyüklük ve kalite kontrolünden geçen kabul edilir).
- **Çevrimdışı yedek:** Her rolün deterministik bir karşılığı var: elle yazılmış ders
  paketleri (olimpiyat mekaniği, Kalkülüs 1; iki dilde), bir müfredat ayrıştırıcı ve
  grafikten üretilen yanıtlar.
- **Hata durumu:** Bir YZ çağrısı başarısız olursa uygulama çevrimdışı davranışa geçer ve
  bunu kaydeder.
- **Doğrulama:** YZ çıktıları şema ile doğrulanır. Geçersiz çıktı kullanılmaz.
- **Diğer:** sağlayıcı yetenek bildirimi, aynı istek için önbellek, öğrencinin seçtiği üslup,
  bağlam bütçesi, rol bazlı yükleme mesajları.
- **Anlamsal arama:** Gemini embedding'leriyle anlama göre arama. Yalnızca sorgu metni
  gönderilir; günlük ve notlar cihazdan çıkmaz.
- **YZ müfredat önerisi:** Önce fark (diff) gösterilir; değişiklikler tek tek onaylanır,
  sonra sürümlenir. Her değişikliğin kökeni (kim/ne üretti) tutulur.

## 10. İstatistik, Odak Lab ve deneyler

- **İstatistikler:** Hiçbir şey saklanmaz; her şey ham olaylardan yeniden hesaplanır.
  Her oranla birlikte örnek sayısı ve Wilson güven aralığı gösterilir. Az örnekte sonuç
  gizlenir.
- **Odak Lab:** Çalışma biçimiyle sonuçlar arasındaki ilişkileri arar. Bakılan etkenler:
  süre, zorluk, kalem kullanımı, etkileşim türü, geri bildirim, meydan okuma, yenilik, ders,
  günün saati ve yardım düzeyi. Bakılan sonuçlar: devam etme, tamamlama, hatadan sonra
  yeniden deneme ve ilk denemede doğruluk.
- **Kişisel deneyler:** Öğrenci iki çalışma koşulunu oturumlar arasında dönüşümlü uygular
  (ör. kısa ya da uzun adımlar). Aynı anda tek deney çalışır. Az örnekte "kazanan" ilan
  edilmez.

## 11. Teknik yapı

- **Ön yüz:** React 18 + TypeScript (strict) + Vite 6. Düz CSS ve tasarım değişkenleri
  kullanılır.
- **Mobil:** Capacitor 8 (Android). Kullanılan eklentiler: yerel bildirim, dosya sistemi,
  paylaşım, durum çubuğu, uygulama (geri tuşu).
- **Depolama:** IndexedDB, işlemsel düzenlemelerle. Ses ve video kayıtları ayrı bir depoda.
  Şema sürümlüdür (şu an v4); eski veriler deterministik ve tekrarlanabilir biçimde taşınır.
  Günlük otomatik yerel anlık görüntü alınır, bozuk kopyada otomatik kurtarma yapılır.
- **Derleme:** Her push'ta GitHub Actions bir APK derler ve "son-surum" sürümüne koyar.
  APK aynı anahtarla imzalanır, böylece veriler korunarak eskisinin üzerine kurulur.
- **Testler:** 36 dosyada 231 birim/entegrasyon testi (Vitest), gerçek CPython testleri dahil. Ayrıca derlenmiş uygulama üzerinde tarayıcıda
  çalışan uçtan uca duman testi var: tüm akışlar, iki dil, telefon ve tablet genişlikleri.
- **Kod düzeni:**

  | Klasör | İçerik |
  |---|---|
  | `src/domain/` | Veri modeli |
  | `src/data/` | Depolama |
  | `src/engines/` | Müfredat, ilerleme, değerlendirme, analitik, istatistik, Odak Lab, deneyler, bütünlük |
  | `src/ai/` | YZ katmanı |
  | `src/knowledge/` | Bilgi grafiği, eşlemeler, doğrulayıcı, planlayıcı |
  | `src/study/` | Kartlar, zihin haritaları, konu tekrarı, sınavlar |
  | `src/adaptive/` | Uyarlanır öğrenme: ustalık profili, hatalar, rota, sırada ne var, tekrar, sandbox, Python |
  | `src/academic/` | Akademik işletim sistemi: hedefler, projeler, günlük, portfolyo, okul, sürümleme, şema göçü |
  | `src/ui/` | Arayüz |
  | `src/i18n.ts` | Dil altyapısı |

## 12. Uyarlanır öğrenme katmanı

Ana döngü: hedef → rota → soru → deneme → geri bildirim → hata analizi → onarım → öğren →
uygula → kanıt → ustalık → transfer → sıradaki seçim.

- **Ustalık profili:** 7 boyut (hatırlama, kavrayış, uygulama, problem çözme, transfer,
  açıklama, gecikmeli kalıcılık). Doğrulanmış skor ile öğrencinin kendi beyanı ayrı tutulur.
- **Ustalık derinliği:** 8 seviye ("gördüm"den "araştırmada kullanabiliyorum"a). Beyan /
  gözlendi / doğrulandı / bayat ayrımı yapılır; sınav ustalığı araştırma ustalığıyla aynı
  sayılmaz; güven kalibrasyonu ve "neden değişti" kaydı tutulur.
- **"Biliyorum" artık kısa bir test:** 2–3 ipucusuz soru. Geçilirse konu "kontrolü geçti"
  sayılır ve önkoşulları karşılar. Eski beyanlar silinmez, doğrulanmamış kalır.
- **Hata analizi:** 10 kategori. Her hata grafikte bir önkoşula bağlanır (güven değeriyle),
  onarım önerilir; tekrarlayan hatalar ve dersler arası yanılgılar yakalanır.
- **Takılma algılama:** Seçenek sunar; çözümü asla varsayılan yapmaz.
- **Dinamik ayrıştırma:** Zorlanılan adım geçici küçük adımlara bölünür; asıl adımda
  ustalaşınca bunlar arşivlenir, grafik kirlenmez.
- **Rota planlayıcı ("Rotam"):** Her adımın gerekçesi gösterilir; rota değiştirilebilir,
  bırakılabilir, sürdürülebilir.
- **Sırada ne var:** Yedi tür seçenek: devam, meydan okuma, onarım, tekrar, transfer, alan
  değiştirme, araştırma.
- **Keşif:** Gerçek grafik bağlantılarından "neden önemli / nereye götürür", "az önce
  bağladın" anı, olası keşif soruları.
- **Sınav modu:** Öncelikler aynı grafik üzerinde geçici bir katmandır.
- **Kalıcılık stratejileri:** Genişleyen merdiven, SM-2 ya da Leitner seçilebilir.
- **Soru bankası:** Durumlar, favoriler, birebir değerlendirilebilen varyasyonlar, kalite
  kontrolü.
- **Derin çalışma modu**, oturum sonu hikâyesi ve iki yansıtma sorusu.

## 13. Akademik işletim sistemi katmanı (Çalışmalar sayfası)

- **Hedefler:** alan → yetenek → kavram → adım → kanıt ayrıştırması, sürümlü.
- **Projeler** (sürümlü), **araştırma defteri** ve **günlük** (fikir, soru, gözlem…).
- **Portfolyo / eserler:** yapılan işler kanıt olarak saklanır.
- **Okul:** dersler, AP, yarışmalar, notlar — bilgi grafiğinden ayrı tutulur.
- **Kaynaklar:** kitap ve kurslar müfredat değil kaynaktır; baskı, yıl ve güncellik bilgisi
  tutulur.
- **Zaman çizelgesi** ve **yıllık değerlendirme** (Markdown olarak dışa aktarılır).
- **Kendi kavramın:** öğrenci grafiğe kavram ekleyebilir, yeniden adlandırabilir (ID sabit,
  eski ad takma ad olur), arşivleyebilir, son güncellemeyi geri alabilir.
- **Konu başına kalemle çizim** (eskiz) ve isteğe bağlı araştırma hatırlatmaları.
- **Tam dışa aktarma:** sürümlü JSON (API anahtarları hariç).

## 14. Lab sekmesi ve Python sandbox

- **Tahmin → test → açıkla** döngüsü ve araştırma defteri.
- **Sandbox modları:** formül, ODE (RK4), veri analizi ve **gerçek Python**.
- **Python:** CPython 3, WebAssembly üzerinde (Pyodide 0.27.7), uygulamanın içinde ve
  **internetsiz**. Yalnızca Python açıldığında yüklenir.
  - **Gömülü bilimsel paketler:** numpy, scipy, pandas, matplotlib, sympy, networkx,
    scikit-learn, statsmodels (bağımlılıklarla 26 paket, ≈82 MB). İlk `import`ta yüklenir.
  - **Grafikler:** matplotlib figürleri Lab temasıyla PNG olarak gösterilir (en fazla 4);
    ayrıca `plot()` ile sandbox grafiğine çizilebilir.
  - **Hazır örnekler (7):** temel, numpy (sönümlü salınım), scipy (Lotka–Volterra),
    pandas + statsmodels (regresyon), sympy (Taylor), scikit-learn (sınıflandırma),
    networkx (en kısa yol).
  - **Güvenlik:** ayrı bir Web Worker'da çalışır; ağ, depolama ve JavaScript erişimi kapalı.
    Çıktı sınırlı; kod 15 sn'de, paket yükleme 240 sn'de kesilir.
  - Kaydedilen bir çalıştırma, yorumla birlikte kanıt olarak saklanır.
  - Android WebView `.wasm` dosyasını yanlış türde sunarsa başka yoldan derlenir.

## 15. Bilinen sınırlar

- Sunucu ve hesap yok, dolayısıyla cihazlar arası eşitleme yok. Taşıma yedek dosyasıyla yapılır.
- Tarayıcı sürümünde bildirimler yalnızca uygulama açıkken gelir.
- YZ değerlendirmesi için kullanıcının kendi Gemini ya da Groq anahtarı gerekir.
- AP Biyoloji eşlemesi geçicidir; diğer 24 AP dersi doğrulanmıştır.
- İçerik "çok üniversite düzeyinde olmayan ama detaylı" lise/ileri lise düzeyini hedefler.
- APK büyük (Python ve bilimsel paketler yüzünden ≈96 MB ek). Python fiziksel bir Android
  cihazda henüz denenmedi; ilk `import` birkaç saniye sürebilir.
- Gömülü 8 paket dışındaki Python paketleri yok.
- Anlamsal arama Gemini anahtarı gerektirir.
