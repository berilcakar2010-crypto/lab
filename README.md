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
- **Konu bazlı aralıklı tekrar:** çalıştığın her konu tarihiyle izlenir ve 1, 3, 7, 14, 30,
  60, 120 gün aralıklarla tekrara gelir. Önce hatırlarsın, sonra grafikle karşılaştırırsın ve
  Unuttum, Zorlandım, İyi ya da Kolay diye işaretlersin.
- **Çalışma takvimi:** hangi gün hangi konuları çalıştığın, kaç gündür üst üste çalıştığın
  ve yaklaşan tekrarlar.
- **Hatırlatma bildirimleri:** Android'de seçtiğin saatte, o gün tekrar edilecek konu ve kart
  sayısını söyleyen günlük yerel bildirim. Bildirime dokununca Çalış sayfası açılır.
  Tarayıcıda bildirim yalnızca Lab açıldığında gelir.
- **Sınav takvimi:** Çalış → Sınavlar. Okul sınavlarını, quizleri, ödev ve sunum teslimlerini
  kapsadıkları grafik konularıyla eklersin (ders ve başlıktan konu önerilir).
  - Her sınav için hazırlık yüzdesi ve konu konu durum gösterilir (yeni, zayıf, orta, güçlü),
    eksik önkoşullar da listelenir.
  - Sınava kadar günlük plan çıkarılır: önce eksik önkoşullar, sonra yeni ve zayıf konular,
    ardından 1 ve 3 gün sonra tekrarlar, sınavdan önceki gün kendini sınama, sınav sabahı
    kısa bir göz atma. Plan, sıkışık ya da rahat olduğunu da söyler.
  - Ana sayfada sıradaki sınavın geri sayımı ve "Bugün, sınavların için" önerileri görünür.
  - Hatırlatmalar sınavdan 2 hafta, 1 hafta, 3 gün, 1 gün önce ve sınav sabahı seçilebilir.
    Android'de bildirim olarak planlanır; bildirime dokununca sınavın planı açılır.
  - Sınavlar .ics olarak telefon takvimine aktarılabilir. Sınavdan sonra notunu girersin.
- **Notlar** ve **sesli okuma** (cihazda ses varsa).

## Uyarlanır öğrenme katmanı (`src/adaptive/`)

Ana döngü: hedef → rota → soru → deneme → geri bildirim → hata analizi → onarım → öğren → uygula → kanıt →
ustalık → transfer → sıradaki seçim.

- **Ustalık profili:** 7 boyut (hatırlama, kavrayış, uygulama, problem çözme, transfer, açıklama, gecikmeli
  kalıcılık). Doğrulanmış skor ile kendi beyan ayrı tutulur; bayatlayan ustalık işaretlenir.
- **Hata analizi:** 10 kategori. Her hata grafikte bir izle önkoşuluna bağlanır (güven değeriyle); onarım önerilir;
  tekrarlayan hatalar ve dersler arası yanılgılar yakalanır.
- **Takılma algılama:** Seçenek sunar; çözümü asla varsayılan yapmaz.
- **Rota planlayıcı:** "Rotam" sekmesi. Her adımın gerekçesi gösterilir; rota değiştirilebilir, bırakılabilir ve
  sürdürülebilir.
- **Sırada ne var:** Yedi tür seçenek (A–G): devam, meydan okuma, onarım, tekrar, transfer, alan değiştirme,
  araştırma.
- **Sınav modu:** Öncelikler aynı grafik üzerinde geçici bir katmandır.
- **Uyarlanır tekrar:** Tekrar sırası ve aralığı konuya göre ayarlanır.
- **YZ müfredat önerisi:** Önce diff gösterilir; değişiklikler seçerek onaylanır, sonra sürümlenir. Her değişikliğin
  köken bilgisi tutulur.
- **Kaynaklar:** Kitap ve kurslar kaynaktır, müfredat değil.
- **Lab sekmesi:** Tahmin → test → açıkla, araştırma defteri ve güvenli sandbox (formül, ODE/RK4, veri analizi ve
  numpy/scipy/pandas/matplotlib içeren gerçek Python).
- **İstatistik:** Katılım, öğrenme ve kalıcılık ayrı gösterilir.

Ayrıntılar: `LAB_UPGRADE_AUDIT.md`, `docs/LAB_UPGRADE_PHASES.md`, `LAB_UPGRADE_FINAL_REPORT.md`.

## Akademik işletim sistemi katmanı (`src/academic/`, şema v4)

Lab açıldığında bir pano değil, **Open Lab** görünür: nerede olduğunu söyleyen tek bir cümle,
gerekçesi ve güven değeriyle **tek bir "şimdi bunu yap"** (asıl soruyla başlar), yarım kalan
iş için *Devam / Baştan / Gözden geçir / Değiştir*, **Beni şaşırt** (Rahat → En zor) ve
**Ne çalışacağımı bilmiyorum**. Yeni bir Lab "Neyi anlamak istiyorsun?" sorusuyla açılır.

- **"Biliyorum" artık kısa bir test.** 2–3 soru, ipucusuz: önce Lab'ın kendi değerlendirdiği
  sorular, sonra ölçütlere göre değerlendirilen açık sorular (YZ varsa YZ, yoksa öğrenci).
  Geçince konu *kontrolü geçti* sayılır ve önkoşulları karşılar; eski beyanlar silinmez,
  doğrulanmamış olarak kalır (`src/adaptive/checks.ts`, `ui/components/QuickCheck.tsx`).
- **Dinamik ayrıştırma**: zorlanılan bir adım geçici, grafiği kirletmeyen küçük adımlara
  bölünür; asıl adımda ustalaşılınca arşivlenir (`adaptive/decompose.ts`).
- **Ustalık derinliği**: 8 seviye (gördüm → araştırmada kullanabiliyorum), beyan / gözlendi /
  doğrulandı / bayat ayrımı, sınav ustalığı ≠ araştırma ustalığı, güven kalibrasyonu ve
  "neden değişti" denetimi (`adaptive/depth.ts`).
- **Keşif**: gerçek grafik bağlantılarından "neden önemli / nereye götürür", dönen kısa bir
  keşif listesi, "az önce bağladın" anı, olası keşif soruları (`adaptive/discovery.ts`).
- **Çalışmalar** sayfası: hedefler (alan → yetenek → kavram → adım → kanıt ayrıştırması,
  sürümlü), projeler (sürümlü), günlük, portfolyo/eserler, okul (ders, AP, yarışma, notlar —
  grafikten ayrı), zaman çizelgesi ve yıllık değerlendirme (`academic/*`).
- **Soru bankası** (durumlar, favoriler, birebir değerlendirilebilen varyasyonlar, kalite
  kontrolü), **genel arama + hızlı komutlar** (Ctrl/⌘ K ya da `/`: "öğren X", "pratik X",
  "beni şaşırt"…), **derin çalışma modu**, oturum sonu hikâyesi ve iki yansıtma sorusu.
- **Kalıcılık stratejileri** değiştirilebilir (`RetentionStrategy`: genişleyen merdiven,
  SM-2, Leitner). **YZ**: sağlayıcı yetenek bildirimi, aynı istek için önbellek, öğrenci
  üslup tercihi, bağlam bütçesi, rol bazlı yükleme mesajları.
- **Uzun ömür**: şema v4 göçü (deterministik, idempotent), kendi kavramın / yeniden adlandırma
  (ID sabit, eski ad takma ad olur) / arşivleme / son güncellemeyi geri alma, sürümlü tam dışa
  aktarma (`data/exchange.ts`, API anahtarları hariç), günlük otomatik yerel anlık görüntüler
  ve bozuk kopyada otomatik kurtarma (`data/store.ts`), sistem sağlığı ve bakım önerileri.

- **Python sandbox**: gerçek CPython 3 (Pyodide), uygulamanın içinde, çevrimdışı. Yalıtılmış bir
  worker'da çalışır; ağa ve verilere erişemez, 15 sn sınırı var, `plot()` ile grafik çizer.
  Derleme sırasında `scripts/copy-pyodide.mjs` dosyaları `public/pyodide`'a kopyalar.
  Bilimsel paketler de çevrimdışı gömülüdür: **numpy, scipy, pandas, matplotlib, sympy, networkx,
  scikit-learn, statsmodels** (bağımlılıklarla 26 wheel, ≈82 MB). `scripts/fetch-pyodide-packages.mjs`
  Pyodide sürüm arşivinden bağımlılık kapanışını çözüp çıkarır (`npm run python:packages`). Paketler
  ilk `import`ta yüklenir; matplotlib figürleri Lab temasıyla PNG olarak gösterilir.
- **Anlamsal arama** (Gemini embedding'leri; yalnızca sorgu gönderilir), **YZ ile ayrıştırma ve
  soru varyasyonu** (büyüklük ve kalite kontrollerinden geçen kabul edilir), kaynaklarda baskı /
  yıl / güncellik, isteğe bağlı araştırma hatırlatması, konu başına kalemle çizimler, yıllık
  değerlendirmenin Markdown olarak dışa aktarılması.

Denetim: `LAB_FINAL_AUDIT.md` · Son rapor: `LAB_FINAL_COMPLETION_REPORT.md`.

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
| Uyarlanır katman: ustalık profili, hatalar, rota, sırada ne var, tekrar, üretici, köken, metrikler, sandbox | `src/adaptive/` |
| Dil altyapısı | `src/i18n.ts` |
| Arayüz (bordo araştırma defteri teması) | `src/ui/` |
| Android kabuğu (Capacitor) | `android/`, `capacitor.config.ts`, `src/ui/native.ts` |

Ayrıntılı rapor: `docs/IMPLEMENTATION_REPORT.md`.
