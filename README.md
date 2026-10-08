# Lab — kişisel akademik işletim sistemi

Lab büyük bir akademik hedefi küçük ve anlamlı adımlardan oluşan bir haritaya
dönüştürür. Her adımı dener, geri bildirim alır, ustalaşana kadar yeniden dener,
ilerlemeni görür ve tek önemli soruya dönersin: **sırada ne var?** Bu sırada Lab,
*senin* en iyi nasıl öğrendiğini anlamaya yetecek kadar ham veri toplar.

```
BÜYÜK HEDEF → MİKRO ADIM → AKTİF DENEME → ANINDA GERİ BİLDİRİM → YENİDEN DENE
           → USTALIK → GÖRÜNÜR İLERLEME → "SIRADA NE VAR?" → SONRAKİ ADIM
```

## Android APK (GitHub'dan derlenir)

Her push'ta `.github/workflows/android.yml` bir APK derler:

1. GitHub'da depo → **Releases** → **son-surum** (ön sürüm) sayfasını telefonundan aç.
2. `Lab-1.0.N.apk` dosyasına dokun ve indir.
3. Android "bilinmeyen kaynaklardan yükleme" izni isterse ver ve kur.

APK ayrıca **Actions** sekmesindeki her çalıştırmada artifact olarak da bulunur.
`v1.0.0` gibi bir etiket push'larsan kalıcı bir sürüm yayınlanır.

- Yeni APK eski sürümün **üzerine** kurulur; çalışma verilerin (IndexedDB) korunur.
  Bunun için APK her zaman aynı anahtarla imzalanır (`android/app/lab-debug.keystore`).
- Play Store'a yüklemek istersen depo sırlarına `LAB_KEYSTORE_BASE64`,
  `LAB_KEYSTORE_PASSWORD`, `LAB_KEY_ALIAS`, `LAB_KEY_PASSWORD` ekle; iş akışı
  APK'yı otomatik olarak o özel anahtarla imzalar.
- Uygulamada Android geri tuşu açık pencereyi kapatır ya da bir önceki ekrana döner.
  Yedekler ve CSV dışa aktarımları Android paylaşım menüsüyle kaydedilir.

## Dil

Lab'in ana dili **İngilizcedir**; **Türkçe** tam bir seçenek olarak gelir. Dil, Ana sayfanın
sağ üstündeki EN/TR düğmesiyle ya da Ayarlar → Dil bölümünden değiştirilir. Arayüz, motor
mesajları, YZ yanıtları, hazır ders paketleri ve bilgi grafiğinin tamamı iki dillidir.
Dil değiştirince düzenlemediğin hazır ders içerikleri de çevrilir; kendi metinlerin ve
ilerlemen olduğu gibi kalır.

## Çalışma araçları

- **Bilgi haritası:** Grafik → Harita. Önce tüm alanların atlası görünür, sonra seçilen
  alanın önkoşul haritası, en sonda tek bir nesnenin komşuluğu: önkoşulları yukarıda, açtığı
  konular aşağıda, disiplinlerarası bağlantıları yanlarda. Kaydırılabilir ve yakınlaştırılabilir.
- **Zihin haritaları:** her nesne ve her alan için tek bakışta hatırlatan haritalar. Kendi
  dallarını ekleyebilirsin. SVG, PNG ya da Markdown olarak dışa aktarılabilir.
- **Kartlar:** grafikten otomatik, YZ ile ya da elle kart; boşluk doldurma kartları da var.
  SM-2 aralıklı tekrar kullanılır. Kartlar Anki ve CSV olarak dışa aktarılabilir.
- **YZ'ye sor:** her nesne için kayıtlı sohbet. Çevrimdışıyken yanıtlar grafikten gelir.
- **Mantığını anlat:** konuyu yazılı, sesli ya da videolu anlatırsın. Kayıtlar cihazda kalır.
  - Gemini sesi ve videoyu doğrudan değerlendirir.
  - Groq önce Whisper ile konuşmayı yazıya döker.
  - Anahtar yoksa ustalık ölçütlerini kendin işaretlersin.
  - Kayıtlar, dökümler ve değerlendirmeler dışa aktarılabilir.
- **Notlar** ve **sesli okuma** (cihazda ses varsa).

## Bilgi grafiği — Lab Müfredatı v2.1

Lab'in merkezinde zamandan bağımsız, yaşayan bir **bilgi grafiği** vardır (`src/knowledge/`).
19 alanda 482 öğrenme nesnesi içerir:

- **Bilimler:** matematik, fizik, kimya, biyoloji, nörobilim, yer ve uzay bilimleri, çevre bilimi.
- **Hesaplama ve araştırma:** programlama ve bilgisayar bilimi, araştırma, yarışma ve meta beceriler.
- **Sosyal bilimler ve sanat:** psikoloji, ekonomi, genel kültür, yazım ve retorik, sanat ve müzik.
- **Diller ve medya:** medya okuryazarlığı, İngilizce, Almanca, Japonca.

25 AP dersinin üniteleriyle eşleşir.

- **Kalıcı ID'ler.** Her nesnenin değişmez bir ID'si vardır (`math.calc.limits`).
  ID'ler `ledger.ts` defterinde tutulur; silinmez, yeniden kullanılmaz.
  Bölünen ya da birleşen nesneler "kullanım dışı" olarak kalır.
- **Önkoşul güçleri.** Önkoşullar dört güçte olabilir: zorunlu, yumuşak, bağlamsal
  ve önerilen hazırlık. Yalnızca zorunlu önkoşullar hazır olmayı etkiler. Lab
  yalnızca "Buradan başlaman öneriliyor" der, seni hiçbir zaman geriye zorlamaz.
- **Ayrı katmanlar.** Okul, AP, yarışma ve araştırma eşlemeleri (`mappings.ts`)
  ve kaynaklar (`resources.ts`) grafikten ayrı tutulur. Her eşlemenin bir durumu
  vardır: doğrulanmış, geçici ya da bilinmiyor.
- **Doğrulayıcı.** `validate.ts`; döngüleri, eksik önkoşulları, bağlantısız
  nesneleri, belirsiz ustalık ölçütlerini ve eskimiş eşlemeleri raporlar. Hiçbir
  şeyi kendiliğinden silmez.
- **Güvenli güncelleme.** `planner.ts`; önce farkları bulur, sonra bir plan çıkarır,
  ancak ondan sonra uygular. Yeni hata getiren bir güncelleme uygulanamaz.
  İlerleme her zaman korunur.
- **Yollar ve mikro adımlar.** Fizik Olimpiyatı, Hesaplamalı Nörobilim ve Araştırma
  yolları aynı grafiğin görünümleridir. *Bunu çalış* dediğinde nesne, her biri yeni
  bir yetenek kazandıran mikro adımlara bölünür (`generate.ts`).

Yeni içerik ekledikten sonra `node scripts/content-index.mjs && node scripts/ledger.mjs`
ile içerik dizinini ve ID defterini güncelle.

## Geliştirme

```bash
npm install
npm run dev        # geliştirme sunucusu (http://localhost:5173)
npm test           # birim testleri (Vitest)
npm run typecheck  # TypeScript, strict
npm run build      # üretim derlemesi → dist/
npm run smoke      # dist/ üzerinde uçtan uca tarayıcı testi (önce build)
npx cap sync android && cd android && ./gradlew assembleDebug   # yerelde APK (Android SDK gerekir)
```

## YZ sağlayıcıları

Lab tamamen çevrimdışı çalışır: olimpiyat mekaniği ve Kalkülüs 1 için elle yazılmış
Türkçe içerik paketleri, bir müfredat ayrıştırıcı ve her YZ rolü için deterministik
yedek davranış vardır. YZ ile müfredat, ipucu, rehberlik ve değerlendirme için
**Ayarlar → YZ sağlayıcısı** bölümünden **Gemini** ya da **Groq** seçip API anahtarı
gir. Anahtarlar yalnızca cihazda saklanır. Bir çağrı başarısız olursa Lab çevrimdışı
davranışa geçer ve bunu kaydeder. YZ çıktıları varsayılan olarak Türkçedir.

## Mimari

| Alan | Yer |
|---|---|
| Veri modeli | `src/domain/types.ts` |
| Depolama (IndexedDB, işlemsel düzenlemeler) | `src/data/` |
| Müfredat, ilerleme, değerlendirme, analitik, istatistik, Odak Lab, deneyler, bütünlük | `src/engines/` |
| YZ katmanı (sağlayıcı soyutlaması + 10 rol) | `src/ai/` |
| Bilgi grafiği, eşlemeler, doğrulayıcı, güncelleme planlayıcı | `src/knowledge/` |
| Kartlar, zihin haritaları, notlar, anlatımlar | `src/study/` |
| Dil altyapısı | `src/i18n.ts` |
| Arayüz (bordo araştırma defteri teması) | `src/ui/` |
| Android kabuğu (Capacitor) | `android/`, `capacitor.config.ts`, `src/ui/native.ts` |

Ayrıntılı rapor: `docs/IMPLEMENTATION_REPORT.md`.
