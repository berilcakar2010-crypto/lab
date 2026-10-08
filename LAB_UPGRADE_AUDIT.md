# LAB 2.0 — Adaptif Öğrenme Yükseltmesi: Denetim Raporu (Faz 1)

Tarih: 2026-10-08 · Dal: `ccr-2af93b6d-f90t4l` · Başlangıç commit'i: `5bbfb30`

Bu rapor kod yazılmadan önce mevcut sistemin ne olduğunu, istenen özelliklerden
hangilerinin zaten var olduğunu, hangilerinin kısmen var olduğunu ve hangilerinin
eksik olduğunu kaydeder. Var olan bir özellik ikinci kez yazılmayacak; genişletilecek.

---

## 1. Mevcut mimari

| Katman | Yer | Not |
|---|---|---|
| Arayüz | `src/ui/` (React 18, hash router, düz CSS) | Sayfalar `pages/`, bileşenler `components/`. Bordo defter teması. Telefon/tablet dikey öncelikli. |
| Durum | `src/ui/state.ts` | Tek `Store`; `store.transact(fn)` ile işlemsel değişiklik, `useDB()` ile okuma. |
| Depolama | `src/data/store.ts`, `db.ts` | IndexedDB (yedek: localStorage/bellek). Tüm veri tek `LabDB` nesnesi. `hydrateDB` eksik alanları doldurur ve taşıma çalıştırır. Medya ayrı IndexedDB (`media.ts`). |
| Alan modeli | `src/domain/types.ts` | Tüm varlık tipleri, olay tipleri, YZ rolleri, `SCHEMA_VERSION = 2`. |
| Motorlar | `src/engines/` | `curriculum` (ders/adım/soru CRUD, doğrulama), `progress` (durum türetme, deneme, ustalık, kalıcılık), `progression` (öneri, kalibrasyon), `evaluation` (otomatik/öz değerlendirme), `analytics` (ham olay günlüğü, oturum yeniden kurma), `statistics` (Wilson aralıklı oranlar), `focusLab` (gözlemsel ilişki), `experiments` (kişisel A/B), `integrity` (veri tutarlılığı), `graph` (döngü/topolojik sıralama), `sessionPlan`, `sessions`, `expr` (güvenli ifade ayrıştırıcı/değerlendirici). |
| YZ | `src/ai/` | `providers.ts` (Gemini, Groq, local), `engine.ts` (`runAI`: rol, şema doğrulama, 2 deneme, deterministik yedek, `AIInteraction` + olay kaydı), `curriculumAI`, `tutor` (ipucu, Sokratik, değerlendirme, hata teşhisi, zorluk, yansıma), `studyAI` (soru-cevap, anlatım değerlendirme, kart), `localBuilder` (çevrimdışı paketler + müfredat ayrıştırıcı). |
| Bilgi grafiği | `src/knowledge/` | 482 nesne / 19 alan, kalıcı ID defteri, iki dil, doğrulayıcı, güvenli güncelleme planlayıcı (diff → plan → overlay), kişisel durum (`personalGraph`), hazır olma, öneri, yollar, eşlemeler, kaynaklar, veri taşımaları. |
| Çalışma araçları | `src/study/` | Kartlar (SM-2), zihin haritası, konu tekrarı (merdiven), sınavlar (hazırlık + plan + hatırlatma), notlar/sohbet/anlatım. |
| Android | `android/`, Capacitor 8 | Yerel bildirim, dosya, paylaşım, geri tuşu. |
| Testler | Vitest (16 dosya, 114 test) + `scripts/smoke*.mjs` (tarayıcıda uçtan uca, ~48 adım) | `npm test`, `npm run typecheck`, `npm run build`, `npm run smoke`. Ayrı bir lint komutu yok (strict TS denetimi lint görevi görüyor). |

**Backend yok.** Tüm "domain/backend" mantığı istemcide, saf fonksiyonlar olarak
`engines/`, `knowledge/`, `study/` altında. Bu fonksiyonlar `LabDB` alır, test edilebilir.

## 2. Mevcut veri modelleri (`LabDB`)

`user`, `preferences`, `subjects`, `curricula`, `courses`, `units`, `topics`, `concepts`,
`milestones`, `questions`, `attempts`, `sessions`, `aiInteractions`, `mastery`, `retention`,
`experiments`, `experimentResults`, `engagement`, `events` (ham olaylar), `knowledge`
(selfAttested, goals, pathId, overlay, history, migrations), `flashcards`, `chats`,
`explanations`, `notes`, `topicReviews`, `exams`.

Önemli alanlar:
- `Milestone`: difficulty (1–5), estimatedDuration, scope, masteryCriteria (requiredCorrect,
  requireUnassisted, minScore), milestoneType, prerequisites/nextMilestones, learningObjectIds,
  recommendedInteractionType, manuallyUnlocked, masteredAt.
- `Attempt`: correct, score, feedback (correctness, reasoningQuality, **errorTypes**,
  missingPrerequisiteIds), **hintLevelUsed (0–5)**, evaluatedBy, inputMethod, usedStylus,
  **confidence**, durationMs, attemptNumber, isRetry, purpose (PRACTICE/MASTERY/RETENTION/TRANSFER).
- `MasteryRecord`: level, evidenceAttemptIds, assisted, **selfAttested**.
- `RetentionCheck`: IMMEDIATE / DELAYED / TRANSFER.
- `AnalyticsEvent`: type, at, sessionId, subjectId, courseId, unitId, topicId, conceptIds,
  milestoneId, questionId, data.
- `LearningObject` (grafik): prerequisites (4 güç), unlocks, entry/core questions, objectives,
  masteryCriteria, evidenceTypes, difficulty, scope, misconceptions, interdisciplinaryLinks,
  research/competition applications, mappings, resources.

## 3. Mevcut özellikler (özet)

Ders oluşturucu (YZ + çevrimdışı), ders haritası, oturum (soru → deneme → geri bildirim →
yeniden deneme), 6 basamaklı yardım merdiveni ve yardım sınırı, ustalık ve kalıcılık
kontrolleri, "Sırada ne var?" önerileri (gerekçeli), kalibrasyon, istatistik, Odak Lab,
kişisel deneyler, bütünlük denetimi, yedekleme/geri yükleme (tam JSON), bilgi grafiği
(görünümler, yollar, eşlemeler, doğrulayıcı, güncelleme planlayıcı), kartlar, zihin
haritası, YZ'ye sor, sesli/videolu anlatım + YZ değerlendirmesi, konu bazlı aralıklı
tekrar, takvim, sınav takvimi ve sınav planı, bildirimler, iki dil.

## 4–6. İstenen özelliklerin durumu

| # | Özellik | Durum | Mevcut olan | Eksik olan |
|---|---|---|---|---|
| 2 | Path Planner | **Kısmi** | `readiness()` (zorunlu önkoşul boşlukları, başlangıç önerisi), `recommendObjects()`, statik öğrenme yolları, hedefler | Kişisel, kalıcı, değiştirilebilir rota; düğüm başına gerekçe (merkezilik, hata, kalıcılık, hedef ilgisi); terk/devam; olaylar |
| 3 | What Next (A–G) | **Kısmi** | `recommendNext` (CONTINUE/REVIEW/PRACTICE/CHALLENGE/EXPLORE/BOSS) ders içinde, gerekçeli | Onarım, transfer, alan değiştirme, araştırma seçenekleri; grafik düzeyinde değerlendirme |
| 4 | Milestone granularity | **Kısmi** | `milestoneQuality` (kötü kalıplar, çok kısa), `scope`, `difficulty`, `estimatedDuration`, `prerequisites`, ustalık ölçütü | Açık `capability`, `cognitive_action`, `assessment_method`, `mastery_evidence` alanları |
| 5 | Granularity validator | **Kısmi** | Grafik doğrulayıcıda `COK_BUYUK`, `COK_KUCUK`, `BELIRSIZ_USTALIK`, `YINELENEN_BASLIK`; ders doğrulayıcı (`validateCourse`) | Adım düzeyinde VALID/TOO_BROAD/TOO_NARROW/DUPLICATE/MISSING_PREREQUISITE/WEAK_EVIDENCE; YZ üretimini kapıdan geçirme |
| 6 | Mastery profile | **Eksik** | İkili ustalık (masteredAt) + `level` | Boyutlar (kavrayış, problem çözme, uygulama, transfer, hatırlama, açıklama, gecikmeli kalıcılık) |
| 7 | Self-declared ≠ verified | **Kısmi** | `knowledge.selfAttested` ve `MasteryRecord.selfAttested` ayrı tutuluyor, arayüzde "kendi beyanın" etiketi | Sayısal self vs verified skor; istatistikte beyanın dışlanması |
| 8 | Stale mastery | **Kısmi** | Kalıcılık kontrolleri, NEEDS_REVIEW, konu tekrar merdiveni | `last_verified_at`, evidence_count, confidence, STALE durumu |
| 9 | Stuck detection | **Eksik** | Ham sinyaller kaydediliyor (ATTEMPT, RETRY, HINT_REQUEST, AI_INTERACTION, CONFIDENCE_REPORT, MILESTONE_ABANDON) | Sinyalleri birleştiren algılayıcı, seçenekler, yanlış pozitif koruması |
| 10 | Error taxonomy | **Kısmi** | `ErrorType`: CONCEPTUAL, PROCEDURAL, CARELESS, MISSING_PREREQUISITE, INCOMPLETE_EXPLANATION (geri bildirimde) | İstenen 10 kategori, ayrı hata kaydı (soru, deneme, tür, güven, ipucu, çözüm durumu) |
| 11 | Error → graph | **Eksik** | `missingPrerequisiteIds`, `diagnoseMistake` (YZ) | Hata → beceri → nesne → önkoşul → onarım zinciri, güven |
| 12 | Error patterns | **Eksik** | — | Tekrarlayan / alanlar arası yanılgı içgörüsü |
| 13 | Normal vs Exam mode | **Kısmi** | Sınav takvimi, hazırlık, günlük plan, tempo notu (müfredatı değiştirmeden) | Mod ayrımı, konu önceliği (Mekanik > Dalgalar), planlayıcı/öneri/tekrar üzerinde geçici kısıt |
| 14 | Adaptive spaced repetition | **Kısmi** | Kartlarda SM-2, konularda sabit merdiven, kalıcılık kontrolleri | Önem, merkezilik, hata, güven, transfer, kanıt kalitesine göre öncelik ve aralık |
| 15 | Engagement ≠ Learning ≠ Retention | **Kısmi** | `statistics.ts` katılımı öğrenmeden ayrı raporluyor ("enjoying ≠ learning"), Wilson aralıkları | Üç katmanlı açık özet (HIGH/MEDIUM/LOW/yetersiz veri) |
| 16 | Depth of mastery | **Eksik** | — | Derinlik katmanları; genişlik/derinlik/kalıcılık/transfer |
| 17 | Source & provenance | **Kısmi** | `RESOURCES`, eşleme durumları (VERIFIED/PROVISIONAL/UNKNOWN), doğrulayıcı `KAYNAKSIZ_ICERIK`, `Curriculum.generatedBy` | Nesne/ders başına provenance kaydı, source_type, UNVERIFIED işareti |
| 18 | AI update → diff → approval | **Kısmi** | `planner.ts`: diffUpdate → plan → yeni hata varsa uygulanmaz → overlay + sürüm geçmişi; Sürüm görünümünde önizleme | Seçerek onaylama, tümünü reddetme, önkoşul ekleme/silme ve adım değişikliklerinin ayrı satırlar olarak gösterilmesi, YZ'den gelen öneriye bağlanması |
| 19 | Books/courses = source | **Eksik** | Statik kaynak listesi | Kullanıcı kaynağı, bölüm → grafik düğümü eşlemesi |
| 20 | Predict → Test → Explain | **Kısmi** | PREDICTION ve SIMULATION soru tipleri, `SimulationSpec`, `expr.ts` | Tahmin → simülasyon → gözlem → açıklama → karşılaştırma akışı ve kanıt kaydı |
| 21 | Feynman / Explain | **Kısmi** | Anlat paneli (yazılı/sesli/video), YZ değerlendirmesi, ölçüt bazlı geri bildirim | Takip soruları (cevabı vermeden), yanılgıların grafikte nesnelere bağlanması |
| 22 | Research mode | **Eksik** | Nesnelerde `researchApplications` | Adım adım araştırma defteri |
| 23 | Sandbox | **Eksik** | `expr.ts` güvenli ifade motoru, simülasyon soruları | Çalışma alanı, sonuç → kanıt bağlantısı |
| 24 | AI rolleri | **Kısmi** | 14 rol (Tutor, Socratic, Evaluator, Hint, Milestone, Curriculum Builder, Difficulty, Reflection, Advisor, Feedback, QA, Explanation, Flashcard, Mindmap) | Granularity Validator, Path Planner, Stuck Detector, Error Analyst, Curriculum Reviewer, Research Guide; karar kaydı (reason/confidence/evidence) |
| 25 | Assistance hierarchy | **Var** | `HINT_LEVELS` 0–5, merdiven tek tek açılıyor, `hintCap` + onay, tam çözüm yardımı ustalık kanıtı sayılmıyor | Yardım düzeyinin kanıt değerini kademeli düşürmesi (profilde) |
| 26–27 | Curriculum generator | **Kısmi** | YZ ders kurucu, grafikte arama (section 37), "Bunu çalış" mikro adım üretimi, soru üretimi | Mevcut düğümü yeniden kullanma + yeni düğüm önerisi + granularity + provenance + diff + onay hattı |
| 28 | Event model | **Kısmi** | 26 olay tipi (SESSION_START, MILESTONE_OPEN/COMPLETE/ABANDON, QUESTION_SHOWN, ATTEMPT, HINT_REQUEST, AI_INTERACTION, RETENTION_CHECK, EXPLANATION…) | ERROR_IDENTIFIED, REPAIR_*, PATH_*, TRANSFER_ATTEMPT, SANDBOX_*, RESEARCH_STEP_COMPLETED, STUCK_*; olaylarda kullanıcı ve kavram alanı |
| 29 | Statistics engine | **Kısmi** | Ham olaylardan hesap, en az örnek kuralı, grup karşılaştırmaları | Verimlilik/sebat/öğrenme/kalıcılık/katılım/derinlik/ders kırılımı tam seti |
| 30 | Causality koruması | **Var** | Odak Lab "ilişkili" diliyle konuşuyor, az örnekte susuyor; deneylere yönlendiriyor | Yeni metriklerde aynı dilin korunması |
| 31 | Focus Lab | **Var (genişletilecek)** | Süre, zorluk, kalem, etkileşim, geri bildirim, meydan okuma, yenilik, ders, günün saati, yardım | Granularity etkeni |
| 32 | User experiments | **Var (genişletilecek)** | Hipotez, kollar, dönüşümlü atama, karşılaştırma, az örnekte kazanan yok | Sonucun hipotez/tasarım/gözlem/sonuç/güven/sınırlılık olarak saklanması |
| 35 | Migration | **Var** | `hydrateDB` (eksik tabloları doldurur), `runKnowledgeMigrations` (kimlikli, tek seferlik), `v21-english-default` | Yeni tablolar ve alanlar için idempotent taşıma |
| 36 | Validation | **Var (genişletilecek)** | Grafik doğrulayıcı (23 kod), ders doğrulayıcı, bütünlük denetimi | Adım granularity'si, YZ nesneleri, provenance kontrolü |
| 40 | Export | **Kısmi** | Tam JSON yedek + çalışma verisi dışa aktarma | Yeni varlıkların (rotalar, hatalar, onarımlar, profiller, kararlar…) dışa aktarımda bulunması |

**Doğrulayıcı durumu:** Güncel grafikte **0 hata, 0 uyarı, 132 bilgi notu** var (60 doğrulanmamış
tarihsel iddia, 59 kaynak gerektiren içerik, 13 tek alanda kalan nesne). Promptta söz edilen
"9 warning" bu depoda yok; Faz 23'te 132 bilgi notu yeniden değerlendirilecek.

## 7. Değişecek / eklenecek dosyalar (plan)

Yeni modüller (hepsi saf fonksiyon + test):
- `src/adaptive/mastery.ts` — ustalık profili, self vs verified, bayatlama, derinlik.
- `src/adaptive/errors.ts` — hata taksonomisi, sınıflandırma, hata → grafik izi, onarım, örüntüler.
- `src/adaptive/granularity.ts` — yetenek alanları ve granularity doğrulayıcı.
- `src/adaptive/stuck.ts` — takılma algılama ve seçenekler.
- `src/adaptive/planner.ts` — kişisel rota planlayıcı ve gerekçeler.
- `src/adaptive/whatNext.ts` — A–G seçenekleri.
- `src/adaptive/retention.ts` — uyarlanır tekrar önceliği.
- `src/adaptive/generator.ts` — YZ müfredat önerisi → doğrulama → diff → onay → sürüm.
- `src/adaptive/provenance.ts`, `sources.ts` — kaynak ve köken.
- `src/adaptive/metrics.ts` — katılım/öğrenme/kalıcılık/derinlik metrikleri.
- `src/adaptive/research.ts`, `sandbox.ts`, `pte.ts` — araştırma, sandbox, tahmin-test-açıkla.
- `src/adaptive/decisions.ts` — YZ/motor karar kaydı.

Değişecek: `domain/types.ts` (yeni tablolar/olaylar/roller), `data/db.ts` (varsayılanlar,
taşıma), `engines/progress.ts` (hata kaydı kancası), `engines/analytics.ts` (kullanıcı/kavram
alanları), `engines/focusLab.ts`, `engines/statistics.ts` (granularity etkeni),
`engines/experiments.ts` (rapor), `ai/` (yeni roller), `study/topics.ts`, `study/exams.ts`
(uyarlanır aralık, sınav modu), `knowledge/planner.ts` (seçerek onay), arayüz
(`QuestionCard`, `SessionPage`, `KnowledgePage`, `StudyPage`, `HomePage`,
`StatisticsPage`, `ExamsPanel`, `ExplainPanel`, `BuilderPage`) — yalnızca entegrasyon,
yeniden tasarım yok.

## 8. Taşıma gerekiyor mu?

**Evet, ama yıkıcı değil.** Yeni tablolar (`errors`, `insights`, `paths`, `sources`,
`research`, `sandboxRuns`, `predictions`, `decisions`, `curriculumProposals`) boş olarak
eklenir. Var olan denemelerin `feedback.errorTypes` alanından **geriye dönük hata kayıtları**
türetilir (tek seferlik, kimlikli, idempotent). Mevcut ID'ler, ustalık kayıtları, oturumlar
ve müfredat olduğu gibi kalır. Olay adları yeniden adlandırılmaz (ham olay geçmişi bozulmasın
diye); istenen adlar ile mevcut adlar arasında eşleme tablosu tutulur. `SCHEMA_VERSION` 3'e
çıkar.

## 9. Riskler

1. **Ustalık anlamının değişmesi.** İkili ustalık birçok yerde (kilit açma, ilerleme çubuğu,
   istatistik) kullanılıyor. Profil, ikili ustalığın *yerine* değil *yanına* eklenecek;
   kilit açma kullanıcı geçersiz kılmasıyla aynı kalacak (Lab hiçbir zaman zorlamaz), ama
   doğrulanmış skor ayrı gösterilecek ve istatistikte beyan dışlanacak.
2. **Performans.** Profil, rota ve metrikler tüm olay geçmişinden türetiliyor; tablet için
   olay sayısına göre önbellek (memo) kullanılacak, her etkileşimde grafik yeniden
   hesaplanmayacak.
3. **YZ çıktısı.** Çevrimdışıyken yeni grafik düğümü *uydurulmayacak*; yalnızca mevcut
   düğümler önerilecek ve bu açıkça söylenecek. Kaynaklar doğrulanamıyorsa UNVERIFIED.
4. **Python sandbox.** Uygulama çevrimdışı çalışan bir Android WebView. Pyodide ~10 MB ve
   ağ gerektirir; desteklenmeyecek ve raporda BLOCKED olarak belirtilecek. Sandbox güvenli
   ifade motoru (`expr.ts`) üzerine kurulacak: ifade taraması, ODE simülasyonu, veri analizi.
5. **Arayüz yükü.** Çok sayıda yeni yetenek; ana ekran bilgi çöplüğüne dönmemeli. Her ekranda
   "şu an ne yapmalıyım?" sorusunun cevabı tek ve belirgin kalacak, ayrıntılar katlanır.
6. **Hata sınıflandırmasının belirsizliği.** Kural tabanlı sınıflandırma kesin değildir;
   her hata kaydı güven değeri ve gerekçe taşıyacak, kullanıcı türü düzeltebilecek.
