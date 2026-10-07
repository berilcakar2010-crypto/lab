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

## Bilgi grafiği — Lab Müfredatı v2.0

Lab'in merkezinde zamandan bağımsız, yaşayan bir **bilgi grafiği** vardır (`src/knowledge/`).
Matematik, fizik, kimya, biyoloji, nörobilim, programlama, araştırma, yarışma ve
meta beceriler, genel kültür, medya okuryazarlığı, İngilizce, Almanca ve Japonca
alanlarında 300'ü aşkın öğrenme nesnesi içerir.

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

Yeni içerik ekledikten sonra `node scripts/ledger.mjs` ile ID defterini güncelle.

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
| Arayüz (bordo araştırma defteri teması) | `src/ui/` |
| Android kabuğu (Capacitor) | `android/`, `capacitor.config.ts`, `src/ui/native.ts` |

Ayrıntılı rapor: `docs/IMPLEMENTATION_REPORT.md`.
