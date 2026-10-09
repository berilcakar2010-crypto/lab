# Lab 2.0 — Final Academic Operating System: Tamamlama Raporu

Dal: `ccr-2af93b6d-f90t4l` · Tarih: 2026-10-09 · Denetim: `LAB_FINAL_AUDIT.md`

## Doğrulama özeti

| Kontrol | Sonuç |
|---|---|
| Typecheck (`tsc --noEmit`) | **PASS** |
| Birim + entegrasyon testleri (`vitest`) | **PASS** — 34 dosyada 215 test (öncesi: 183) |
| Üretim derlemesi (`vite build`) | **PASS** — ana paket 2,33 MB (ikincil ekranlar ayrı parçalarda); boyut uyarısı sürüyor |
| Gerçek tarayıcıda uçtan uca akışlar (`npm run smoke`) | **PASS** — 57 adım (öncesi: 48); telefon, yatay ve dikey tablette yatay taşma yok |
| Müfredat doğrulayıcısı (yerleşik grafik) | 0 hata · 0 uyarı (sağlık testi bunu doğruluyor) |

---

## 1. Kurtarılan mevcut uygulama

Önceki "Adaptive Upgrade" görevi yarıda kalmamış, `c1be66a` ile tamamlanmıştı. Kurtarılan
yapı şunlardı:
- bilgi grafiği (482 nesne);
- ustalık profili, hata grafiği, takılma tespiti;
- rota planlayıcı, What Next;
- sınav modu, uyarlanabilir tekrar;
- YZ müfredat üretici, değişiklik listesi ve onay ekranı;
- köken takibi, metrikler, Focus Lab;
- PTE, araştırma, sandbox.

Bunlar yeniden yazılmadı; bu sistemlerin üzerine inşa edildi.

## 2. Zaten tamamlanmış olanlar (korundu)

- Bilgi grafiği, kararlı ID'ler, sürüm geçmişi (diff → plan → uygula).
- Hata motoru: 10 kategori, hatadan önkoşula iz.
- Takılma tespiti ve 8 seçenek.
- Rota planlayıcı ve rota geçmişi (etkin / duraklatıldı / bırakıldı / tamamlandı).
- Sınav modu (geçici kısıt katmanı).
- Araştırma modu (10 adım).
- Focus Lab: hipotez / deney / gözlem / sonuç / güven / sınırlar.
- Katılım ≠ öğrenme ≠ kalıcılık ayrımı ve Wilson aralıkları.
- YZ sağlayıcı soyutlaması ve doğrulama hattı.
- Çevrimdışı yedek davranış.
- Bildirim politikası: yalnızca seçilen hatırlatmalar.

## 3. Bu görevde tamamlananlar

| Alan | Ne yapıldı | Dosyalar |
|---|---|---|
| **"Biliyorum" → kısa test** (kullanıcı isteği) | 4 yerdeki kanıtsız beyan kaldırıldı: konu, giriş düzeyi toplu, adım, editör. Yerine 2–3 soruluk, ipucusuz kontrol geldi. Otomatik sorular gerçek deneme olarak kaydedilir. Açık sorular YZ ya da öğrenci tarafından ölçütle değerlendirilir. Geçen konu `KONTROL` durumuna geçer; adım kontrolü kanıtla ustalık verir. Eski beyanlar silinmedi, "testle doğrulanmadı" olarak işaretlendi. | `adaptive/checks.ts`, `ui/components/QuickCheck.tsx` |
| Open Lab / One Thing Now / dinamik giriş | 9 giriş türü (CONTINUE … START). Her biri gerekçe ve güven taşır, açılış asıl soruyla olur. Gösterilip seçilmeyen öneri bir sonraki açılışta geri düşer. Uzun aradan sonra açık bir durum cümlesi gösterilir ve tekrar öne alınır. | `adaptive/entry.ts`, `ui/components/OpenLab.tsx`, `pages/HomePage.tsx` |
| Oturum devamı / kesinti kurtarma | "Kaldığın yerden devam?" ekranında Devam / Baştan / Gözden geçir / Değiştir seçenekleri var. Ceza ya da seri yok. | `entry.ts` (`resumable`), `OpenLab.tsx` |
| Beni şaşırt + zorluk seviyesi | Rahat / Esneme / Zor / En zor. Seçilen konu yeni, ulaşılabilir ve ilgi çekici olur; zorluk yalnızca bilişseldir. | `entry.ts` (`surpriseMe`) |
| "Ne çalışacağımı bilmiyorum" | Her biri farklı türden, gerekçeli rotalar (proje dahil). | `entry.ts` (`routesWhenUnsure`) |
| Dinamik ayrıştırma | Zorlanılan adım grafiği kirletmeden en çok 3 geçici adıma bölünür: zayıf önkoşul, tek yetenek, daha kolay durum. Ders ilerlemesini etkilemez; asıl adımda ustalaşılınca arşivlenir. | `adaptive/decompose.ts` |
| Adım uzunluğu | Mikro / Kısa / Orta / Derin / Sentez (bilişsel kapsamla birlikte). Ayrıca "çok kolay → genişlet" ve "çok büyük → böl" önerileri. | `decompose.ts` |
| Ustalık derinliği | 8 seviye. Beyan / gözlendi / doğrulandı / bayat ayrımı. Sınav ve araştırma ustalığı ayrı. Güven kalibrasyonu. Son değişim denetimi ("%62 → %71: 2 problem, 1 açıklama"). | `adaptive/depth.ts`, `GraphExtras.tsx` |
| Kanıt | Kontrol cevapları ve kaydedilmiş sandbox çalıştırmaları da kanıt sayılıyor; yardım ve öz değerlendirme ağırlığı düşürüyor. | `adaptive/mastery.ts` |
| Keşif | "Neden önemli / nereye götürür" gerçek bağlantılardan geliyor. Dönen kısa keşif listesi (sonsuz akış değil), "az önce bağladın" anı, "olası keşif sorusu" etiketi ve kilit yerine önizleme. | `adaptive/discovery.ts` |
| What Next | "Keşfe çık" (H) seçeneği eklendi; her seçenekte güven değeri var. | `adaptive/whatNext.ts` |
| Hedefler | Neden / şimdiki durum / istenen durum / konular / projeler. Alan → yetenek → kavram → adım → kanıt ayrıştırması, sürüm geçmişi ve geri yükleme, hedeften rota. | `academic/goals.ts` |
| Projeler + eserler + portfolyo | 8 proje türü; sorular, kaynaklar, araştırma, deneyler, sonuçlar ve sonraki sorular bağlanabiliyor (sürümlü). 11 eser türü; kayıttan esere dönüştürme tekrar oluşturmaz. | `academic/records.ts`, `pages/WorkPage.tsx` |
| Günlük | 7 tür kayıt; grafiğe ve projeye bağlı. Oturum yansıtması da buraya yazılıyor. | `records.ts` |
| Okul | Ders / AP / yarışma / dil, ağırlıklı notlar. Akademik yıl yalnızca etiket; hiçbir şey sıfırlanmaz. Kaçırılan son tarih için "plan değişti" dili kullanılıyor. | `academic/school.ts` |
| Zaman çizelgesi + yıllık değerlendirme + kişisel rekorlar + derinlik analitiği | Tamamen olaylardan türetiliyor; veri yetersizse bunu söylüyor. | `academic/portfolio.ts`, `StatsExtras.tsx` |
| Kişisel öğrenme modeli + içgörüler | Davranış gözlemleri her zaman n ve zaman aralığıyla veriliyor; neden-sonuç dili yok. Alan trendleri ve "en çok derinleştiğin yerler" eklendi. | `adaptive/personalModel.ts` |
| Soru bankası | Durumlar (yeni / denendi / ustalaşıldı / zayıf / yeniden zamanı geldi), favoriler, birebir değerlendirilebilen varyasyonlar, problem geri dönüşümü, kalite kontrolü. | `adaptive/questionBank.ts`, `QuestionBank.tsx` |
| Arama + hızlı komut | 9 varlık türünde arama; sonuçta tür, ilişki ve durum görünür. 11 komut ("öğren X" doğrudan grafik önerisine gider). | `adaptive/search.ts`, `CommandPalette.tsx` |
| Derin çalışma | Bağlam, deney etiketi ve atlama gizlenir; süre tutulur ama dayatılmaz. | `SessionPage.tsx` |
| Oturum sonu | Ne denendi, kanıt, ne değişti (öncesi → sonrası), hâlâ belirsiz olan, What Next ve isteğe bağlı iki soru. | `SummaryPage.tsx` |
| Kalıcılık strateji arayüzü | `RetentionStrategy`: merdiven, SM-2, Leitner; konular ve kartlar için ayrı seçilebiliyor. | `adaptive/retentionStrategy.ts` |
| YZ | Sağlayıcı yetenek bildirimi; aynı istek için 12 saatlik önbellek; kullanıcı üslup tercihi (yalnızca öğrenciyle konuşan rollerde); bağlam bütçesi; görsel yeteneği olmayan sağlayıcıya görsel gönderilmiyor; rol bazlı yükleme mesajları. | `ai/engine.ts`, `ai/providers.ts` |
| Müfredat | Kendi kavramını ekleme (doğrulanmış ve sürümlü). Yeniden adlandırma (ID sabit, eski ad takma ad olur). Arşivleme. Son güncellemeyi geri alma (geçmiş korunur). Aramada takma adlar. | `knowledge/userContent.ts` |
| Dışa / içe aktarma | Sürümlü biçim: varlıklar, ilişkiler ve meta veri. API anahtarları hariç. Eski yedekleri de okuyor. | `data/exchange.ts` |
| Yedek / kurtarma | Günlük otomatik yerel anlık görüntü (son 7). Bozuk kopyada sırayla diğer slot ve son anlık görüntüye düşülür. Geri yüklemeden önce mevcut durum saklanır. | `data/store.ts` |
| Sistem sağlığı | Grafik, veri bütünlüğü, şema / göçler, YZ, depolama ve yıkıcı olmayan bakım önerileri (Ayarlar'da kapalı bölüm). | `engines/health.ts`, `SettingsExtras.tsx` |
| Diller / yarışma katmanları | Dil başına 6 beceri. Yarışma doğruluğu, hızı, en zor problem, çözüm kalitesi ve en sık hata; ustalıktan ayrı. | `academic/layers.ts` |
| Ayarlar | Zorluk seviyesi, YZ üslubu, günlük öneri, derin çalışma, bağlam azaltma, animasyon düzeyi, tekrar stratejileri, otomatik yedek. | `SettingsExtras.tsx` |
| Spesifikasyona aykırı olanlar | "Seri (streak)" göstergeleri kaldırıldı; yerine "Etkin gün" ve "Dokunulan fikir" geldi. "Kilitli" yerine "Önizleme" kullanılıyor. | — |
| Performans | Ana sayfa ve oturum dışındaki ekranlar ihtiyaç halinde yükleniyor (9 ekran). | `ui/App.tsx` |

## 4. Kısmen desteklenenler (PARTIAL)

- **Sandbox'ta Python**: ifade taraması, ODE ve veri analizi gerçek çalışıyor. Python yorumlayıcısı yok (bkz. BLOCKED).
- **YZ ile ayrıştırma ve soru varyasyonu**: ayrıştırma ve varyasyonlar yerel ve gerçek. YZ ile daha zengin varyasyon yalnızca mevcut soru üretici üzerinden (kalite kontrolü var); ayrı bir "YZ ayrıştırıcı" çağrısı eklenmedi.
- **Embedding**: arayüzde yetenek olarak tanımlı, hiçbir sağlayıcıda uygulanmadı; arama yerel.
- **Kaynak meta verisi**: yazar, URL, tür ve doğrulama var. Baskı / sürüm / tarih alanları yok.
- **Bildirimler**: sınav ve tekrar hatırlatmaları var. "Yarım kalan araştırma" hatırlatması eklenmedi; uygulama içi giriş ekranında öneriliyor.
- **Kalem**: çizim ve el yazısı cevap mevcut. Grafik üzerine not alma (annotation) yok.
- **Paket boyutu**: ikincil ekranlar ayrıldı. Ana paket 2,33 MB çünkü iki dilde 482 nesnelik içerik başta yükleniyor.

## 5. Engellenenler (BLOCKED) ve nedeni

- **Python çalıştırma**: uygulama çevrimdışı çalışan bir Capacitor/WebView uygulaması ve içinde Python çalışma ortamı yok. Pyodide yaklaşık 10 MB+ indirme ve ağ gerektirir; çevrimdışı ve düşük bellek hedefiyle çelişiyor. Sahte çalıştırma üretilmedi.
- **Sağlayıcı embedding'leri**: Gemini ve Groq istemcilerinde uç nokta çağrısı yok ve anahtar olmadan test edilemiyor. Arayüzde `embed: false` olarak dürüstçe bildiriliyor.

## 6. Mimari

```
UI (src/ui)            → yalnızca görüntü + store.update çağrıları
Uygulama / alan        → src/adaptive (öğrenme motoru), src/academic (akademik katman),
                         src/engines (müfredat, ilerleme, analitik, deney, sağlık),
                         src/knowledge (grafik, güncelleme hattı, kullanıcı içeriği),
                         src/study (kartlar, konular, sınavlar), src/ai (sağlayıcı + roller)
Kalıcılık (src/data)   → Store (IndexedDB iki slot + anlık görüntüler), hydrate/migrate, exchange
```

Her alan fonksiyonu `LabDB` alan saf bir fonksiyondur. İş mantığı arayüzde değil; analitik
olay günlüğünden türetilir. YZ hiçbir zaman veritabanına doğrudan yazmaz.

## 7. Veri modeli

`SCHEMA_VERSION = 4`. Yeni tablolar:
- `journal`, `projects`, `artifacts`, `academicGoals`;
- `checks` (bilgi kontrolleri);
- `schoolSubjects`, `grades`.

Mevcut kayıtlara eklenen alanlar:
- Milestone: `ephemeral`;
- Question: `favorite`, `variantOf`, `variation`;
- LearningObject: `aliases`;
- GraphUpdateRecord: `previousOverlay`, `rolledBackAt`;
- Flashcard: `stage`;
- UserPreference: 9 yeni tercih.

14 yeni olay türü eklendi (KNOWLEDGE_CHECK, DECOMPOSED, ENTRY_SHOWN/CHOSEN, DISCOVERY_*, JOURNAL_ENTRY, PROJECT_UPDATED, ARTIFACT_SAVED, GOAL_UPDATED, DEEP_WORK, SESSION_RESUMED, REFLECTION, SEARCH). Türler `src/domain/academic.ts` dosyasında.

## 8. Göç (migration)

`v4-academic-layer` (`academic/migrate.ts`):
- deterministik ve idempotent; `knowledge.migrations` içinde kayıtlı, tekrar çalışmaz;
- hiçbir kaydı silmez;
- yeni tablolar `hydrateDB` ile varsayılan değerleriyle oluşturulur;
- `reduceMotion` tercihi `animation` düzeyine taşınır;
- mevcut kullanıcılar ilk açılış akışını bir daha görmez.

Testler: v3 → v4 dönüşümü, tekrar çalıştırma ve boş veritabanı (`final.test.ts`, `knowledge.test.ts`, `model.test.ts`).

## 9. YZ mimarisi

`AIProvider` arayüzü: `complete` ve `capabilities` (generate / evaluate / structuredOutput / vision / embed).

`runAI` hattı sırasıyla:
1. Öğrencinin üslup tercihi eklenir (yalnızca öğrenciyle konuşan rollerde).
2. Bağlam bütçesi uygulanır.
3. Önbelleğe bakılır.
4. Sağlayıcı çağrılır.
5. Cevap ayrıştırılır ve doğrulanır.
6. Başarısızlıkta yerel yedek kullanılır.
7. Etkileşim kaydedilir.

Müfredat değişiklikleri şu yoldan geçer: şema → alan → grafik doğrulaması → değişiklik listesi → onay → sürüm. Yeni bir sağlayıcı eklemek yalnızca `providers.ts` dosyasında değişiklik gerektirir.

## 10. Müfredat mimarisi

Kanonik grafik + overlay + sürüm geçmişi. Kullanıcının kendi kavramları, YZ önerileri ve elle yazılan güncellemeler aynı `diffUpdate → applyPlan` hattından geçer.

- Silme yok; kavramlar arşivlenir (KULLANIM_DISI / YERINE_GECILDI).
- Son güncelleme geri alınabilir; geri alma yeni bir sürüm olarak kaydedilir.
- Geçici adımlar ve okul verisi grafiğe hiç yazılmaz.

## 11. Analitik

- Katılım, öğrenme ve kalıcılık ayrı katmanlarda.
- Derinlik: genişlik / derinlik / kalıcılık / transfer / araştırma.
- Kişisel rekorlar, alan trendleri, gözlenen örüntüler.
- Diller ve yarışma ayrı katmanlarda.

Her sayı ham olaylardan hesaplanır ve gerektiğinde n ile zaman aralığını gösterir. Örneklem küçükse "Henüz yeterli veri yok" denir.

## 12. Öğrenme motoru

Soru → deneme → geri bildirim → hata analizi → onarım → ustalık profili (7 boyut + derinlik) → kalıcılık (strateji) → transfer → araştırma.

Ek olarak:
- "biliyorum" iddiası yerine kısa kontrol;
- takılınca geçici ayrıştırma;
- What Next'te 8 seçenek, her biri güven değeriyle.

## 13. Araştırma sistemi

10 adımlı araştırma projesi (önceki görevden), sandbox kanıtı ve olası keşif soruları.

Araştırma sonuçları esere dönüştürülebilir ve projeye bağlanabilir. Araştırma ustalığı sınav ustalığından ayrı ölçülür.

## 14. Proje sistemi

Proje → sorular, kavramlar, kaynaklar, araştırmalar, deneyler, adımlar, eserler, notlar, sonuçlar, sonraki sorular, hedef. Her değişiklik sürümlenir ve geri yüklenebilir.

## 15. Kullanıcı deneyimi değişiklikleri

- Open Lab ana ekranı ve ilk açılış akışı.
- Kısa kontrol ekranı.
- Komut paleti.
- Çalışmalar sekmesi (gezinmede 6. öğe).
- Derin çalışma modu.
- "Daha küçük adımlar" kartı.
- Önizleme ekranı.
- İlerleme hikâyesi: kanıt kaydedildi → ustalık % → "az önce bağladın".
- Oturum sonu hikâyesi.
- Grafikte keşif görünümü.
- Derinlik merdiveni.
- "Nereye götürür" bölümü ve "Bu konudaki çalışmaların".
- Soru bankası.
- Ayarlar panelleri.
- Sayfa değişince açık pencereler (sheet) kapanıyor.

## 16. Performans

- Ana sayfa ve oturum dışındaki 9 ekran isteğe bağlı yükleniyor.
- Ustalık profilleri imza kontrollü önbellekte tutuluyor.
- Keşif ve giriş hesapları olay sayısına göre önbelleğe alınıyor.
- Animasyonlar Tam / Azaltılmış / Kapalı seçilebiliyor.

Teknik borç: içerik verisinin dil bazında tembel yüklenmesi.

## 17. Güvenlik ve gizlilik

- API anahtarları dışa aktarımlara asla girmez.
- YZ'ye yalnızca ilgili soru, ölçüt ve konu gönderilir; öğrenci geçmişi gönderilmez. Bağlam bütçesi varsayılan olarak açık.
- Veri tamamen cihazda.
- Silme işlemleri onay ister; geri yüklemeden önce mevcut durumun anlık görüntüsü alınır.

## 18. Testler

- `src/adaptive/final.test.ts` (21 test): kontroller, ayrıştırma, derinlik, Open Lab, keşif, soru bankası, stratejiler, kişisel model, arama, v4 göçü, What Next güven değeri, dil ve yarışma katmanları.
- `src/academic/academic.test.ts` (11 test): kayıtlar ve sürümleme, hedefler, okul, portfolyo, dışa / içe aktarma, kullanıcı kavramları ve geri alma, YZ önbelleği / üslup / bağlam bütçesi, anlık görüntüler, sağlık.
- Smoke: 57 adım. Spesifikasyon §170 senaryolarının karşılığı:
  - **A**: aç → tek şey → başla → derin çalışma → oturum sonu. Hata → onarım → ustalık akışı önceki adımlarda ve birim testlerinde.
  - **B**: komut paletinden "öğren Fourier dönüşümü" → grafik önerisi → onay → ilk soru.
  - **C**: 90 gün sonra dönüş — birim testinde (tarayıcı saatini ileri almak yerine).
  - **D**: Beni şaşırt.
  - **E**: "Ne çalışacağımı bilmiyorum".
  - **F**: YZ hatasında çevrimdışı yedek davranış (Gemini hata adımı).

## 19. Derleme durumu

Typecheck, 215 test, üretim derlemesi ve 57 adımlık smoke testi geçiyor.

## 20. Kalan teknik borç

- İçerik verisini dil bazında parçalara bölmek (ana paket 2,33 MB).
- Kaynaklar için baskı / sürüm / tarih alanları.
- Python sandbox (BLOCKED).
- YZ ile ayrıştırma ve varyasyon için ayrı roller.
- Yarım kalan araştırma için isteğe bağlı bildirim.
- Grafik üzerine kalemle not alma.
- Yıllık değerlendirmenin dışa aktarılması.

## 21. Gelecekte genişletilebilirlik

- Yeni bir varlık: `ENTITY_TABLES` listesine eklenince dışa aktarma, içe aktarma, sağlık ve hidrasyon otomatik çalışır.
- Yeni bir sağlayıcı: `providers.ts`.
- Yeni bir tekrar algoritması: `RETENTION_STRATEGIES`.
- Yeni bir alan: aynı grafik şeması.
- Yeni bir giriş türü: `entry.ts` aday listesi.
- Yeni bir göç: `migrate.ts` (idempotent desen).

Her yeni özellik Kullanıcı → Hedef → Grafik → Rota → Meydan okuma → Deneme → Kanıt → Ustalık → Kalıcılık → Transfer → Araştırma → Yeni soru zincirine oturur.

---

## Özellik bazında durum

| Özellik | Durum |
|---|---|
| Bilgi grafiği, kararlı ID, takma ad, arşiv, sürüm, geri alma | DONE |
| Müfredat sürümleme + YZ diff + onay | DONE |
| Rota planlayıcı + rota geçmişi | DONE |
| What Next (8 seçenek, gerekçe, güven) | DONE |
| Adım sistemi + uzunluk + dinamik ayrıştırma | DONE |
| Soru sistemi + soru bankası + kalite + varyasyon | DONE (YZ varyasyonu PARTIAL) |
| Önce soru döngüsü / Open Lab / tek şey / odak akışı | DONE |
| Ustalık profili + derinlik + kanıt + denetim | DONE |
| "Biliyorum" → kısa test | DONE |
| Hata grafiği + takılma tespiti | DONE |
| Kalıcılık (strateji arayüzü) + transfer | DONE |
| YZ öğretmen, müfredat kurucu, adım üretici, büyüklük doğrulayıcı | DONE |
| Sağlayıcı soyutlaması + yetenekler + önbellek + gizlilik | DONE (embedding BLOCKED) |
| Okul / Sınav / AP / Yarışma / Diller | DONE |
| Araştırma / Projeler / Eserler / Portfolyo / Günlük | DONE |
| Hedefler + ayrıştırma | DONE |
| Kaynaklar | PARTIAL (baskı ve tarih alanları yok) |
| Göç / dışa aktarma / içe aktarma / kurtarma / yedek | DONE |
| Analitik: katılım, öğrenme, kalıcılık, derinlik, hatalar, deneyler, içgörüler, rekorlar | DONE |
| Keşif / Beni şaşırt / bilmiyorum / önizleme / neden önemli / nereye götürür | DONE |
| Derin çalışma / devam / kesinti kurtarma / oturum sonu | DONE |
| Arama + hızlı komut | DONE |
| Sistem sağlığı + bakım önerileri | DONE |
| Sandbox | PARTIAL (Python BLOCKED) |
| Dikey tablet öncelikli, kalem dostu, erişilebilir | DONE (grafik üzerine not alma PARTIAL) |
