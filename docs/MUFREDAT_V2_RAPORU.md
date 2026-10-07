# Lab Müfredatı v2.0 — uygulama raporu

**Önce önemli bir not:** spesifikasyon "mevcut 198 nesne"den söz ediyordu. Bu nesneler
depoda, Drive'da ya da Notion'da bulunamadı. Senin seçiminle ("Sıfırdan v2.0 kur") kanonik
bilgi grafiği **sıfırdan, yeni kalıcı ID'lerle** kuruldu. Aşağıdaki "korunan nesne" sayısı
bu yüzden sıfırdır. Korunan şey, mevcut Mekanik ve Kalkülüs 1 ilerlemendir.

Senin sonradan verdiğin iki karar uygulandı:

- "Ek dil" yer tutucusu **oluşturulmadı**.
- Eksik kalan **İngilizce** alanı eklendi: B1'den C2'ye genel İngilizce, ayrıca akademik ve bilimsel İngilizce.

## Sayılar

| | |
|---|---|
| Korunan mevcut kanonik nesne | 0 (önceden kanonik nesne yoktu) |
| Grafiğe bağlanan mevcut adım | 31 paket adımı (19 Mekanik, 12 Kalkülüs 1). Türkçe başlıklarla ve 1.0.3 öncesi İngilizce başlıklarla eşleşir. Ustalık, deneme ve tekrar kayıtlarının hiçbiri değişmez. |
| Yeni eklenen nesne | **334** |
| Değiştirilen / birleştirilen / bölünen nesne | 0 / 0 / 0 |
| Eklenen önkoşul | **617**: 435 zorunlu, 149 yumuşak, 24 bağlamsal, 9 önerilen hazırlık. 164'ü alanlar arası. |
| Disiplinlerarası bağlantı | **836** (gerçek grafik kenarları) |
| Ustalık kriteri | **1002**, her biri bir kanıt türüne bağlı ve gözlemlenebilir |
| Başlangıç sorusu | **525**, tümü aktif düşünme sorusu |
| İsteğe bağlı / boss / kaynak gerektiren nesne | 27 / 5 / 41 |

**Alanlara göre nesne sayısı:**

| Alan | Nesne |
|---|---|
| Matematik | 69 |
| Fizik | 44 |
| Kimya | 16 |
| Biyoloji | 18 |
| Nörobilim | 34 |
| Programlama | 21 |
| Araştırma | 18 |
| Yarışma ve meta beceriler | 13 |
| Genel kültür | 48 |
| Medya okuryazarlığı | 11 |
| İngilizce | 14 |
| Almanca | 15 |
| Japonca | 13 |

"Öğrenmeyi öğrenme" (`comp.meta.learning-to-learn`) grafiğe bağlı:

- Önkoşulu olduğu nesneler: bilinçli pratik, problem çözme, dillerin ilk adımları.
- Disiplinlerarası bağlantıları: bellek, uyku, plastisite, dikkat, deney tasarımı.

## Doğrulayıcı sonucu

- **Grafik döngüsüz:** evet. Yinelenen ID yok, var olmayan önkoşul yok.
- **0 hata, 0 uyarı, 94 bilgi notu.**
- Kalıcı ID defteri (`src/knowledge/ledger.ts`) grafikle birebir aynı: 334 ID.

Bilgi notları kasıtlı:

- **41 × "Doğrulanmamış tarihsel iddia":** tarih, kurum ve sınav içeren nesneler "kaynakla doğrulanmalı" işaretiyle gelir. İçerikte kesin tarih ya da rakam verilmedi. Her biri seni birincil kaynağa yönlendirir.
- **40 × "Kaynak gerektiren ama kaynağı olmayan içerik":** uydurma kaynak eklememek için bilerek boş bırakıldı. Kaynak katmanı zamanla doldurulmalı.
- **13 × "Disiplinlerarası bağlantı yok":** dilbilgisi gibi doğası gereği tek alanda kalan nesneler.

**Kalite kontrolleri:**

- Zorluk 4–5 olan her matematik, fizik ve hesaplamalı nörobilim nesnesi türetme ya da ispat kanıtı istiyor.
- Her nesnenin "anlar / bilir" türü olmayan, eylem bildiren hedefleri var.

Doğrulayıcı iki gerçek sorunu yakaladı ve bunlar düzeltildi:

- "-ebilir" ekini "bilir" sanıyordu.
- Kullanımdan kalkan bir nesneye dayanan nesneleri tespit etti. Planlayıcı artık bunları planın içinde, görünür biçimde, haleflere yönlendiriyor.

## Eşlemeler

**Doğrulanmış (46 ünite).** Ünite adları collegeboard.org'daki resmi metinle karşılaştırıldı:

| Ders | Ünite |
|---|---|
| AP Calculus AB/BC | 10 |
| AP Physics C: Mechanics | 7 |
| AP Physics C: E&M | 6 |
| AP Chemistry | 9 |
| AP Statistics | 5 |
| AP Computer Science A | 4 |
| AP Psychology | 5 |

- **Yöntem hakkında dürüst not:** College Board sayfaları bu ortamdan doğrudan açılamadı. Ünite adları, collegeboard.org ile sınırlı aramada dönen resmi sayfa metninden okundu.
- **AP Statistics 2026-27'de 9 üniteden 5 üniteye indi.** Eşleme yeni çerçeveyi kullanıyor.
- Lab nesneleriyle eşleştirmenin kendisi Lab'in yorumudur.

**Doğrulanmayı bekleyenler:**

- **AP Biology** (8 ünite, geçici): Fall 2025 çerçevesindeki ünite adlarının aynı olduğu teyit edilemedi.
- **MEB** (7 ünite, geçici): Drive'daki kişisel çalışma planından alındı. Sınıf düzeyi ve güncel öğretim programıyla doğrulanmalı.
- **Yarışmalar** (6 satır, geçici): TÜBİTAK fizik ve matematik olimpiyatları, Brain Bee (Türkiye'de düzenlenip düzenlenmediği doğrulanmalı), proje yarışmaları.
- **IPhO müfredatı** (bilinmiyor): güncel belge incelenmedi.
- **Araştırma projeleri P1 ve P2** (geçici): kişisel plandan alındı.

Doğrulanmış eşlemeler 365 gün sonra doğrulayıcıda "eskimiş" olarak uyarı verir.

## Uygulamada ne değişti

- **Yeni "Grafik" sekmesi.** Varsayılan görünüm bağlamsaldır; 334 nesne tek listede dökülmez. Görünümler:
  - **Bağlam:** arama, hedefler, hazır olma durumu, önerilen sonraki, bildiklerin.
  - **Yollar:** Fizik Olimpiyatı, Hesaplamalı Nörobilim ve Araştırma, aşamalara ayrılmış.
  - **Disiplinler:** tamamlanan, önkoşulu eksik ve disiplinlerarası filtreleriyle.
  - **Eşlemeler:** AP, okul, yarışma ve araştırma.
  - **Doğrulama.**
  - **Sürüm:** geçmiş, güncelleme ve dışa aktarma.
- **Nesne sayfası** şunları gösterir: önce düşün sorusu, bu ne, neden önemli, cevapladığı sorular, yapabileceklerin, kanıt, önkoşullar (güçleriyle), açtığı yollar, bağlantılar, yanılgılar, eşlemeler, kaynaklar ve senin adımların. Eylemler:
  - **Bunu çalış:** nesneyi mikro adımlara böler. "Oku", "izle" ya da "20 dakika çalış" gibi adımlar kalite kontrolünde reddedilir.
  - **Eksiklerle birlikte.**
  - **Biliyorum (kendi beyanım):** ustalık sayılmaz, ayrı gösterilir.
  - **Hedef yap.**
- **Yeni ders ekranı önce grafiğe bakar.** "Hesaplamalı nörobilim" yazınca ilgili yolu ve eksik önkoşulları gösterir. Mesaj "Buradan başlaman öneriliyor … Zorunlu değil." biçimindedir; Lab "zorundasın" demez ve seni geri göndermez.
- **Ana sayfada** tek bir grafik önerisi gösterilir. Oturum ekranında adımın bağlı olduğu grafik nesneleri yer alır.
- **Güncellemeler önce farkları gösterir, sonra uygulanır.** Akış: fark, plan, doğrulama, uygulama.
  - Silme reddedilir.
  - Eski bir ID yeniden kullanılamaz.
  - Daha düşük sürüm reddedilir.
  - Döngü yaratan güncelleme uygulanamaz.
  - Bölünen bir nesnenin ilerlemesi ve beyanı haleflere de bağlanır; eski bağlantı silinmez.

## Test ve derleme

- `npm test`: **80/80 geçti.** Bunların 19'u yeni bilgi grafiği testi: doğrulayıcı, defter, kalite, hazır olma, öneri, yollar, arama, güvenli güncelleme ve eski veri migration'ı (İngilizce başlıklar dahil, ilerleme değişmeden).
- `npm run typecheck`: temiz.
- `npm run build`: başarılı.
- `npm run smoke`: **36/36 adım geçti.** 6'sı yeni grafik akışı. 390, 820 ve 1180 px genişlikte taşma yok.
- Android APK GitHub Actions'ta derlenir.

## Değiştirilen önemli dosyalar

- `src/knowledge/schema.ts`: öğrenme nesnesi modeli, kanıt türleri, önkoşul güçleri, eşleme durumları.
- `src/knowledge/dsl.ts`: içerik yazım biçimi ve kanıttan ustalık ölçütü üretimi.
- `src/knowledge/content/*.ts`: 13 alanın içeriği.
- `src/knowledge/ledger.ts` ve `registry.ts`: kalıcı ID defteri, sürüm geçmişi, kullanım dışı kalan ID'ler.
- `src/knowledge/mappings.ts`, `resources.ts`: ayrı eşleme ve kaynak katmanları.
- `src/knowledge/validate.ts`, `planner.ts`, `state.ts`, `paths.ts`, `generate.ts`, `search.ts`, `migrate.ts`, `actions.ts`.
- `src/ui/pages/KnowledgePage.tsx`; `BuilderPage`, `HomePage` ve `SessionPage`'deki entegrasyon.
- `src/domain/types.ts`, `src/data/db.ts`: kişisel grafik durumu, şema sürümü 2, otomatik ve tek seferlik migration.
- `scripts/ledger.mjs`: defteri yalnızca ekleyerek günceller.

## Bilinen sınırlamalar

- **İçerik taslak durumunda.** İçerik yeni yazıldı (`reviewStatus: TASLAK`). Alan uzmanı gözüyle gözden geçirilmeli, özellikle genel kültür ve dil sınavı nesneleri.
- **Grafikten oluşturulan derslerin değerlendirmesi.** Bu derslerdeki adımlar rubrikle ya da YZ ile değerlendirilir. Otomatik puanlanan sorular yalnızca Mekanik ve Kalkülüs 1 paketlerinde var.
- **YZ'nin grafik güncellemesi önermesi.** Bunun için ayrı bir rol yok. Bir YZ'nin ürettiği güncelleme JSON olarak yapıştırılır; güvenli planlayıcıdan geçmeden hiçbir şey uygulanmaz.
- **Süreler kaba tahmin.**
- **Kaynak katmanı küçük.** 26 kaynak var; tarih nesneleri için henüz kaynak yok.
- **Kişisel ilerleme tek cihazda.** Yedek almak için dışa aktarma kullanılmalı.
