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

Alt menüde beş bölüm var: Ana sayfa · Grafik · Çalış · İstatistik · Ayarlar.

| Ekran | İçerik |
|---|---|
| **Ana sayfa** | Sırada ne var, önerilen adımlar, sıradaki sınav ve geri sayımı, "Bugün, sınavların için" önerileri, bilgi grafiği önerisi, tekrar bekleyen konu/kart sayısı, dersler ve son ilerlemeler, EN/TR düğmesi. |
| **Ders oluşturucu** | Ders adı yazılır ya da müfredat yapıştırılır. Lab ünite → konu → mikro adım yapısına çevirir. Önce bilgi grafiğinde eşleşen yol ya da nesne aranır. |
| **Ders sayfası** | Ünite ve adım haritası, ilerleme, müfredat düzenleyici. |
| **Oturum** | Bir adım üzerinde aktif çalışma: soru, deneme, ipucu, geri bildirim, yeniden deneme. Ustalık kontrolünden geçince kutlama gösterilir. Ardından oturum özeti gelir. |
| **Grafik (bilgi grafiği)** | Bağlam, Harita, Yollar, Alanlar, Eşlemeler, Doğrulama ve Sürüm görünümleri. Her nesne bir alt pencerede açılır. |
| **Çalış** | Konular (aralıklı tekrar), Sınavlar, Kart tekrarı, Takvim, Kartlar, Anlatımlar, YZ sohbetleri, Dışa aktar. |
| **İstatistik** | Ham olaylardan hesaplanan istatistikler, Odak Lab, kişisel deneyler. |
| **Kalıcılık** | Ustalaşılan adımlar için zamanla gelen kalıcılık kontrolleri. |
| **Ayarlar** | Dil, YZ sağlayıcısı ve anahtarı, hatırlatmalar, hareketi azaltma, yedekleme/geri yükleme, bütünlük kontrolü. |

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
- **Çevrimdışı yedek:** Her rolün deterministik bir karşılığı var: elle yazılmış ders
  paketleri (olimpiyat mekaniği, Kalkülüs 1; iki dilde), bir müfredat ayrıştırıcı ve
  grafikten üretilen yanıtlar.
- **Hata durumu:** Bir YZ çağrısı başarısız olursa uygulama çevrimdışı davranışa geçer ve
  bunu kaydeder.
- **Doğrulama:** YZ çıktıları şema ile doğrulanır. Geçersiz çıktı kullanılmaz.

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
  Şema sürümlüdür ve eski veriler otomatik taşınır.
- **Derleme:** Her push'ta GitHub Actions bir APK derler ve "son-surum" sürümüne koyar.
  APK aynı anahtarla imzalanır, böylece veriler korunarak eskisinin üzerine kurulur.
- **Testler:** 114 birim testi (Vitest). Ayrıca derlenmiş uygulama üzerinde tarayıcıda
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
  | `src/ui/` | Arayüz |
  | `src/i18n.ts` | Dil altyapısı |

## 12. Bilinen sınırlar

- Sunucu ve hesap yok, dolayısıyla cihazlar arası eşitleme yok. Taşıma yedek dosyasıyla yapılır.
- Tarayıcı sürümünde bildirimler yalnızca uygulama açıkken gelir.
- YZ değerlendirmesi için kullanıcının kendi Gemini ya da Groq anahtarı gerekir.
- AP Biyoloji eşlemesi geçicidir; diğer 24 AP dersi doğrulanmıştır.
- İçerik "çok üniversite düzeyinde olmayan ama detaylı" lise/ileri lise düzeyini hedefler.
