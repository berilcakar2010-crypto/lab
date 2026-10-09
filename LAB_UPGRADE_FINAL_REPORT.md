# LAB 2.0 — Adaptif Öğrenme Yükseltmesi: Son Rapor

Tarih: 2026-10-09 · Dal: `ccr-2af93b6d-f90t4l`
Denetim: `LAB_UPGRADE_AUDIT.md` · Faz faz raporlar: `docs/LAB_UPGRADE_PHASES.md`

Lab artık kişisel çalışma takibinin ötesinde, kanıta dayalı ve uyarlanır bir öğrenme sistemi. Mevcut mimari bozulmadı:
bilgi grafiği, kalıcı ID'ler, müfredat ile arayüz ayrımı, YZ sağlayıcı soyutlaması, çevrimdışı öncelik, ustalık takibi,
ham olay analitiği, Odak Lab, deneyler, dışa/içe aktarma, doğrulayıcı, taşıma sistemi, tablet/dikey kullanım, Android ve
iki dil korunuyor. Arayüz yeniden tasarlanmadı; yeni yetenekler mevcut ekranlara yerleştirildi.

Ana döngü artık gerçek verilerle uçtan uca çalışıyor:

```text
HEDEF → ROTA → SORU → DENEME → GERİ BİLDİRİM → HATA ANALİZİ → ONARIM → ÖĞREN → UYGULA
→ KANIT → USTALIK (profil) → TRANSFER → SIRADAKİ SEÇİM (A–G)
```

## Durum özeti

| # | Özellik | Durum |
|---|---|---|
| 1 | Denetim (LAB_UPGRADE_AUDIT.md) | PASS |
| 2 | Path Planner (gerekçeli, değiştirilebilir, terk/devam) | PASS |
| 3 | What Next motoru (A–G, sıralar ama seçmez) | PASS |
| 4 | Adım granularity motoru (yetenek alanları) | PASS |
| 5 | Granularity doğrulayıcı (VALID/TOO_BROAD/TOO_NARROW/DUPLICATE/MISSING_PREREQUISITE/WEAK_EVIDENCE) | PASS |
| 6 | Ustalık profili (7 boyut) | PASS |
| 7 | Kendi beyanı ≠ doğrulanmış ustalık | PASS (kilit açma kullanıcı geçersiz kılmasıyla aynı kaldı — bkz. sınırlılıklar) |
| 8 | Bayat ustalık (last_verified_at, evidence_count, recent_performance, retention_status, confidence) | PASS |
| 9 | Takılma algılama + seçenekler | PASS |
| 10 | Hata taksonomisi (10 kategori) | PASS |
| 11 | Hata → bilgi grafiği (güvenli, olasılık diliyle) | PASS |
| 12 | Hata örüntüsü / alanlar arası yanılgı | PASS |
| 13 | Normal mod / Sınav modu | PASS |
| 14 | Uyarlanır aralıklı tekrar | PASS |
| 15 | Katılım ≠ öğrenme ≠ kalıcılık | PASS |
| 16 | Ustalık derinliği (genişlik/derinlik/kalıcılık/transfer) | PASS |
| 17 | Kaynak ve köken | PASS |
| 18 | YZ güncellemesi → diff → onay → sürüm | PASS |
| 19 | Kitap/kurs = kaynak (grafiğe eşleme) | PASS |
| 20 | Tahmin → Test → Açıklama | PASS |
| 21 | Feynman / Anlat modu (takip soruları, yanılgı → grafik) | PASS |
| 22 | Araştırma modu | PASS |
| 23 | Sandbox | **PARTIAL** — formül taraması, ODE (RK4) simülasyonu, veri analizi çalışıyor; **Python BLOCKED** |
| 24 | YZ rolleri genişletildi + karar kaydı (reason/confidence/evidence) | PASS |
| 25 | YZ yardım hiyerarşisi (kanıt değerine etkisiyle) | PASS |
| 26–27 | Müfredat üretici ("yalnızca gerekeni öğren" formatı) | PASS |
| 28 | Olay modeli genişletmesi | PASS (mevcut olay adları yeniden adlandırılmadı, eşleme aşağıda) |
| 29 | İstatistik motoru (ham olaylardan) | PASS |
| 30 | Nedensellik koruması | PASS |
| 31 | Odak Lab entegrasyonu (+ granularity etkeni) | PASS |
| 32 | Kullanıcı deneyleri (yazılı sonuç) | PASS |
| 33–34 | Arayüz entegrasyonu ve "Neden?" | PASS |
| 35 | Taşıma | PASS |
| 36 | Doğrulama | PASS |
| 37 | Testler | PASS |
| 39 | Performans | PASS (önbellekler) / teknik borç: paket boyutu |
| 40 | Veri sahipliği (dışa/içe aktarma) | PASS |

## 1. Uygulanan özellikler

- **Ustalık profili** (`src/adaptive/mastery.ts`): Her grafik nesnesi için hatırlama, kavrayış, uygulama, problem çözme,
  transfer, açıklama ve gecikmeli kalıcılık skorları. Kaynakları cevaplar, açıklamalar, kart ve konu tekrarları,
  kalıcılık kontrolleri ve tahminler. Yardım kanıtın değerini düşürür; tam çözüm kanıt sayılmaz. Kanıtı olmayan boyut
  skorsuz kalır. Doğrulanmış skor ile kendi beyan ayrıdır. Bayatlama ve önerilen çare (tekrar, gecikmeli hatırlama ya
  da transfer) hesaplanır. "Biliyor ama uygulayamıyor" teşhisi yapılır.
- **Hata analizi** (`errors.ts`): Her yanlış cevap 10 kategoriden birine sınıflandırılır (kural tabanlı; açık uçlu
  cevaplarda isteğe bağlı YZ analisti). Hata → beceri → adım → kavram → önkoşul → onarım izi, güven değeriyle çıkarılır;
  önkoşul ancak gerçekten zayıf görünüyorsa suçlanır. Onarım başlatılabilir; sonraki kanıtla kendiliğinden kapanır.
  Öğrenci türü düzeltebilir. Aynı beceride tekrarlayan hata ve alanlar arası yanılgı içgörüleri oluşur.
- **Granularity** (`granularity.ts`): Yetenek tanımı ve iki dilli bilişsel eylem sözlüğü. Doğrulayıcı yerleşik içerikte
  0/80 yanlış pozitif verir. Kullanıcının kendi ziyaretlerinden kalibrasyon yapılır.
- **Takılma** (`stuck.ts`): Sekiz sinyal birleştirilir. Yanlış cevap olmadan ve en az iki farklı sinyal olmadan asla
  "takıldı" denmez. Sekiz seçenek sunulur; çözüm her zaman en sonda ve hiçbir zaman önerilmez.
- **Path Planner** (`pathPlanner.ts`): Hedef(ler)e geçici rota çıkarır; müfredat değişmez. Adım rolleri: önkoşul, hedef,
  onarım, tekrar, kısa kontrol. Her adımın gerçek veriye dayalı gerekçe kodları vardır. Atla, ekle, taşı, bırak ve
  devam et desteklenir; rota kanıtla ilerler.
- **What Next** (`whatNext.ts`): A Devam, B Meydan okuma, C Önkoşul onarımı, D Tekrar, E Transfer, F Alan değiştir,
  G Araştırma. Seçenekler sıralanır ve gerekçelendirilir; seçim kullanıcıdadır.
- **Sınav modu** (`modes.ts`): Aynı grafik üzerinde geçici kısıt katmanıdır. Konu önceliği; plan, rota, öneriler ve
  pratik listesine yansır. Kapsam yüzdesi gösterilir. Sınav geçince mod kendiliğinden kapanır.
- **Uyarlanır tekrar** (`retention.ts`): Öncelik ve aralık çarpanı önem, merkezilik, hatalar, güven, anlık ve gecikmeli
  doğruluk, transfer, yaş, kanıt kalitesi ve ustalık açığından hesaplanır. Sinyal yoksa davranış değişmez.
- **YZ müfredat üretici + diff/onay** (`generator.ts`):
  - Mevcut düğümler yeniden kullanılır; kopya önlenir. Yeni düğüm yalnızca YZ ile önerilir; çevrimdışıyken
    uydurulmaz.
  - Her adım tek yetenektir ve "yalnızca gerekeni öğren" kuralıyla kısa tutulur.
  - Öneri granularity ve grafik doğrulamasından geçer. Diff satırları tek tek onaylanır, reddedilir ya da tümü
    onaylanır; bağımlılıklar otomatik eklenir.
  - Onaylanan değişiklikler grafikte yeni sürüm olur ve bunlardan ders üretilir.
- **Köken ve kaynaklar** (`provenance.ts`): YZ içeriği kendini doğrulayamaz. Kitap ve kurs müfredat değil kaynaktır;
  bölümleri grafiğe eşlenir.
- **Metrikler** (`metrics.ts`): Verimlilik, sebat, öğrenme, kalıcılık, katılım, derinlik ve ders kırılımı ham
  olaylardan hesaplanır. Üç katman ayrı tutulur. Az veride "yetersiz veri" denir. Nedensellik dili kullanılmaz.
- **Odak Lab + deneyler**: Granularity etkeni eklendi. Deney sonucu yazılı rapor olarak saklanır: hipotez, tasarım,
  gözlem, sonuç, güven ve sınırlılıklar.
- **Feynman**: Takip soruları sorulur (cevabı vermeden). Yanlış kavramlar grafikteki nesnelere bağlanır. Diyalog
  zinciri tutulur.
- **Tahmin → Test → Açıklama** (`pte.ts`): Tahmin, hesaplanan sonuca göre puanlanır. Dönüm noktalı ilişkiler
  tanınır. Açıklama kanıt olarak kaydedilir.
- **Araştırma** (`research.ts`): On adımlı defter. Rehber yalnızca soru sorar. Adımlara sandbox çalıştırması
  bağlanabilir. Biten araştırma değerlendirmeye gönderilerek kanıta dönüşür.
- **Sandbox** (`sandbox.ts`): 12 gerçek model (fizik, kimya, biyoloji, sinir bilimi, ekonomi). Parametre taraması,
  RK4 ile ODE (eşik-sıfırlamalı LIF nöron dahil) ve veri analizi (istatistik + regresyon) yapılır. Sert sınırlar
  vardır. Kanıt, öğrencinin yorumu değerlendirildiğinde oluşur.
- **Karar kaydı** (`decisions.ts`): Hata sınıflandırma, takılma, rota, müfredat ve granularity kararları; gerekçe,
  güven ve kanıtla birlikte (en fazla 2000 kayıt).

## 2. Değişen mimari

Mevcut katmanlar korunarak tek bir yeni katman eklendi: `src/adaptive/`. Saf fonksiyonlardan oluşur, `LabDB` alır
ve testlenebilir. Arayüz bu katmanı yalnızca çağırır: yeni bileşenler `Adaptive.tsx`, `PathView.tsx`,
`LabTools.tsx` ve `Curation.tsx`. YZ rolleri `src/ai/adaptiveAI.ts` içinde, mevcut `runAI` üzerinden çalışır: sağlayıcı
değiştirilebilir, çıktı doğrulanır ve deterministik bir yedek davranış vardır.

Mevcut motorlara yalnızca küçük kancalar eklendi:
- `progress.recordAttempt`: hata kaydı ve onarım kapama.
- `topics.reviewTopic`: aralık çarpanı.
- `experiments`: rapor.
- `statistics`/`focusLab`: granularity etkeni.
- `analytics.logEvent`: olaylarda kullanıcı ve kavram alanları.

## 3. Veritabanı / şema değişiklikleri

`SCHEMA_VERSION` 2'den 3'e çıktı.

- **Yeni tablolar:** `errors`, `insights`, `paths`, `sources`, `curriculumProposals`, `research`, `sandboxRuns`,
  `predictions`, `decisions`.
- **Yeni alanlar:**
  - `preferences.studyMode/focusExamId`
  - `Milestone.capability/granularity/provenance`
  - `Course.provenance`
  - `Exam.priorities`
  - `Experiment.report`
  - `Explanation.followUpOf`
  - `ExplanationEvaluation.followUps/misconceptionLinks`
  - `KnowledgeState.provenance`
  - `AnalyticsEvent.userId/loIds`
- **Yeni olaylar:** ERROR_IDENTIFIED, ERROR_RECLASSIFIED, REPAIR_STARTED, REPAIR_COMPLETED, INSIGHT_DETECTED,
  STUCK_DETECTED, STUCK_OPTION_CHOSEN, PATH_CREATED, PATH_MODIFIED, PATH_ABANDONED, PATH_RESUMED, WHAT_NEXT_SHOWN,
  WHAT_NEXT_CHOSEN, MODE_CHANGED, TRANSFER_ATTEMPT, PREDICTION_SUBMITTED, SANDBOX_STARTED, SANDBOX_RESULT,
  RESEARCH_STEP_COMPLETED, CURRICULUM_PROPOSED, CURRICULUM_DECIDED.
- **Promptta istenen ve zaten var olan olaylar:** Ham olay geçmişi bozulmasın diye mevcut adlar korundu:

  | İstenen | Mevcut karşılığı |
  |---|---|
  | SESSION_STARTED / SESSION_ENDED | SESSION_START / SESSION_END |
  | MILESTONE_STARTED / MILESTONE_COMPLETED / MILESTONE_ABANDONED | MILESTONE_OPEN / MILESTONE_COMPLETE / MILESTONE_ABANDON |
  | ATTEMPT_SUBMITTED | ATTEMPT |
  | HINT_REQUESTED | HINT_REQUEST |
  | AI_ASSISTANCE_USED | AI_INTERACTION |
  | EXPLANATION_SUBMITTED | EXPLANATION |
  | QUESTION_SHOWN, RETENTION_CHECK | aynı adlar |

## 4. Taşıma

`hydrateDB` eksik tabloları boş olarak ekler. Tek seferlik `v3-error-records` taşıması eski yanlış cevapları
"legacy" kaynaklı hata kayıtlarına çevirir; sonradan düzeltilmiş olanlar RESOLVED olur. Taşıma ham olay üretmez.
ID'ler, ustalık, oturumlar, denemeler ve müfredat aynen korunur. Taşıma idempotenttir: üç kez çalıştırmak aynı sonucu
verir ve geri yüklenen yedeklerde de aynı şekilde çalışır.

## 5. YZ değişiklikleri

- **Yeni roller:**
  - GRANULARITY_VALIDATOR: deterministik; karar kaydına yazar.
  - PATH_PLANNER: deterministik; karar kaydına yazar.
  - STUCK_DETECTOR: deterministik; karar kaydına yazar.
  - ERROR_ANALYST: YZ + kurallar.
  - CURRICULUM_REVIEWER: YZ + kontrol listesi.
  - RESEARCH_GUIDE: YZ + çevrimdışı sorular.
  - Var olan EXPLANATION_EVALUATOR genişletildi: takip soruları ve yanılgı bağlantıları.
- **Sağlayıcı:** Soyutlama korundu (Gemini, Groq ya da yerel). Kritik YZ kararları gerekçe, güven ve kanıtla
  kaydedilir. Model güveni en fazla 0.85 olarak sınırlanır.
- **Doğrulama kuralları:**
  - Uydurma kategori veya önkoşul reddedilir.
  - Cevap içeren takip sorusu ya da araştırma "sorusu" elenir.
  - Kaynak uydurulmaz: YZ'nin önerdiği kaynaklar UNVERIFIED kalır.

## 6. Analitik değişiklikleri

Metrik katmanları (verimlilik, sebat, öğrenme, kalıcılık, katılım, derinlik, ders) ham olaylardan türetilir ve hiçbir
sabit sayı içermez. Katılım, öğrenme ve kalıcılık üç ayrı seviyedir. Nedensellik dili yasaktır ve bu testle
denetlenir. Hata analitiği (en sık hata, örüntüler) ve derinlik (yalnızca doğrulanmış kanıt) eklendi.

## 7. Müfredat değişiklikleri

Yerleşik içerik değişmedi: 482 nesne, 19 alan. YZ önerileri yalnızca onayla uygulanır: grafik overlay'ine yeni sürüm
olarak yazılır ve köken kaydı tutulur. Son doğrulayıcının sonucu:

- Yerleşik grafikte 0 hata ve 0 uyarı var.
- 132 bilgi notu yeniden değerlendirildi:
  - 60 doğrulanmamış tarihsel iddia ve 59 kaynak gerektiren içerik bilerek açık bırakıldı; kaynak uydurulmadı.
  - 13 tek alanda kalan nesne doğası gereği öyle.
- Promptta geçen "9 warning" bu depoda yok.

## 8. Arayüz değişiklikleri

- **Ana sayfa:** "Şu an" kartı (rota adımı + Neden?, onarım, sınav modu önerisi).
- **Oturum:** Hata analizi kartı, takılma seçenekleri, A–G "Sırada ne var?" paneli.
- **Grafik:** "Rotam" görünümü, nesne sayfasında Ustalık profili, Kaynaklar/köken, "Lab" sekmesi (Tahmin→Test→Açıkla,
  Sandbox, araştırma başlat), Doğrulama'da "Senin müfredatın".
- **Çalış:**
  - Hatalar ve Araştırma sekmeleri.
  - Uyarlanır tekrar sırası.
  - Sınavda öncelik, sınav modu ve sınav rotası.
  - Anlatımlarda takip soruları.
  - Uyarlanır veri dışa aktarma.
- **İstatistik:** Katılım / öğrenme / kalıcılık bölümü.
- **Ders oluşturucu:** Granularity uyarıları ve onay; "Bilgi grafiği üzerinden öner" ile diff ekranı.
- **Deneyler:** Yazılı sonuç.

Ana ekran bilgi çöplüğüne dönmedi: kartlar yalnızca gösterecek bir şey varsa çıkar, ayrıntılar katlanır.

## 9. Test sonuçları

| Komut | Sonuç |
|---|---|
| `npm run typecheck` (strict TS) | PASS |
| `npm test` (Vitest) | PASS — 32 dosya, **183 test** (yükseltme öncesi 114) |
| `npm run build` | PASS — paket 2.45 MB (gzip 780 kB), büyük parça uyarısı |
| `npm run smoke` (gerçek tarayıcı, uçtan uca) | PASS — **48 adım**; 4 yeni uyarlanır adım dahil |
| Lint | Ayrı bir lint komutu yok; strict TypeScript (`noUnusedLocals` vb.) lint görevini görüyor |

## 10. Kalan sınırlılıklar

- **BLOCKED — Python sandbox:** Çevrimdışı Android WebView'da ~10 MB çalışma zamanı ve ağ gerektirir. Sahte bir
  terminal yapılmadı; çalıştırıcı arayüzü dar tutuldu.
- **Kendi beyanı ve kilit açma:** Lab'in "zorlamaz" ilkesi gereği "Biliyorum" ve "Yine de aç" geçersiz kılmaları
  adımları açmaya devam ediyor. Doğrulanmış ustalık, istatistikler ve rota ise beyanı doğrulanmış saymıyor.
- **Hata sınıflandırması:** Kural tabanlı ve kesin değil. Her kayıt güven ve gerekçe taşır; öğrenci düzeltebilir.
- **YZ'nin yeni düğümleri:** Tek dilde kalır (YZ hangi dilde yazdıysa).
- **Ayarlanmamış sabitler:** Ağırlık ve eşikler (takılma, tekrar önceliği, bayatlama) elle seçildi ve henüz kişisel
  deneylerle ayarlanmadı.
- **Sınav modu:** Süreli deneme sınavı zamanlayıcısı yok; sınav modu soru pratiği listesi veriyor.
- **Sandbox modelleri:** 12 model var; her grafik nesnesinin modeli yok.

## 11. Teknik borç

- Uygulama paketi tek parça ve büyük (2.45 MB). Kod bölme (lazy route'lar) yapılmalı.
- `Store.transact` her işlemde tüm veritabanını derin kopyalıyor; olay sayısı çok büyüdüğünde yavaşlayabilir.
  Profil ve metrikler önbellekli, ama derin kopya maliyeti duruyor.
- Ders sayfasındaki eski `NextOptions` ile yeni A–G paneli iki ayrı bileşen; ileride birleştirilebilir.
- Olay adları iki kuşak (eski + yeni); eşleme tablosu belgede duruyor.

## 12. Gelecek önerileri

1. Eşik ve ağırlıkları Odak Lab deneyleriyle kişiselleştirmek (ör. takılma eşiği, tekrar ağırlıkları).
2. Sınav modunda süreli deneme sınavı ve zaman kısıtlı pratik.
3. Sandbox modellerini artırmak ve Python için isteğe bağlı, açıkça işaretli çevrimiçi bir çalıştırıcı (Pyodide)
   değerlendirmek.
4. YZ'nin önerdiği yeni düğümler için iki dilli çeviri adımı.
5. Paket boyutunu küçültmek için route bazlı kod bölme.
6. Hata sınıflandırmasının doğruluğunu, öğrencinin düzeltmelerinden öğrenerek ölçmek ve iyileştirmek.
