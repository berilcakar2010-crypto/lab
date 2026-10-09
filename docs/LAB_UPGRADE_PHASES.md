# LAB 2.0 Adaptif Yükseltme — Faz raporları

Her fazın sonunda istenen formatta durum raporu. Son özet: `LAB_UPGRADE_FINAL_REPORT.md`.

## Faz 1 — Denetim

```text
PHASE STATUS: PASS
Implemented: Mevcut sistemin denetimi → LAB_UPGRADE_AUDIT.md
Modified files: —
New files: LAB_UPGRADE_AUDIT.md, docs/LAB_UPGRADE_PHASES.md
Data model changes: —
Tests: mevcut 114 test geçiyor (değişiklik yok)
Known limitations: Promptta geçen "9 warning" depoda yok; güncel doğrulayıcı 0 hata / 0 uyarı / 132 bilgi notu.
Next phase: Faz 2 — veri modeli genişletmeleri
```

## Faz 2 — Veri modeli genişletmeleri

```text
PHASE STATUS: PASS
Implemented: Uyarlanır katmanın tüm veri tipleri; LabDB'ye 9 yeni tablo; tercihlere çalışma modu;
  adım/ders/grafik nesnesi için köken (provenance), adım için yetenek (capability) ve granularity sonucu;
  sınav konu önceliği; deney raporu; anlatım değerlendirmesinde takip soruları ve grafiğe bağlı yanılgılar;
  21 yeni olay tipi; olaylarda kullanıcı ve kavram (loIds) alanı; 6 yeni YZ rolü; SCHEMA_VERSION 3.
Modified files: src/domain/types.ts, src/data/db.ts, src/engines/analytics.ts
New files: src/domain/adaptive.ts, src/adaptive/model.test.ts
Data model changes: errors, insights, paths, sources, curriculumProposals, research, sandboxRuns,
  predictions, decisions tabloları; preferences.studyMode/focusExamId; Milestone.capability/granularity/provenance;
  Course.provenance; Exam.priorities; Experiment.report; ExplanationEvaluation.followUps/misconceptionLinks;
  KnowledgeState.provenance; AnalyticsEvent.userId/loIds.
Tests: 3 yeni (yeni tablolar, şema-2 verisinin taşınması ve idempotentlik, olay damgaları); toplam 117 geçiyor.
Known limitations: Mevcut olay adları (SESSION_START vb.) yeniden adlandırılmadı; istenen adlarla eşleme son raporda.
Next phase: Faz 3 — ustalık profili
```

## Faz 3 — Ustalık profili

```text
PHASE STATUS: PASS
Implemented: Her grafik nesnesi (ya da grafiğe bağlı olmayan adım) için 7 boyutlu ustalık profili:
  hatırlama, kavrayış, uygulama, problem çözme, transfer, açıklama, gecikmeli kalıcılık. Kaynak: gerçek
  denemeler (soru türü + amaç), anlatım değerlendirmeleri, kart ve konu tekrarları, kalıcılık kontrolleri,
  tahminler. Yardım düzeyi kanıt değerini düşürür (tam çözüm = 0). Kanıtı olmayan boyut skorsuz kalır.
  Doğrulanmış skor ile kendi beyan ayrı (beyan doğrulanmış sayılmaz). last_verified_at, evidence_count,
  recent_performance, retention_status (FRESH/FADING/STALE/UNKNOWN), confidence, depth. Bayat ustalık
  için öneri (tekrar / gecikmeli hatırlama / transfer problemi) ve "biliyor ama uygulayamıyor" teşhisi.
Modified files: —
New files: src/adaptive/mastery.ts, src/adaptive/testkit.ts, src/adaptive/mastery.test.ts
Data model changes: Yok — profil ham kanıttan türetilir ve durum başına önbelleklenir (dışa aktarımda anlık görüntü yazılır).
Tests: 5 yeni (boyutlar, güncelleme + yardım cezası, beyan ≠ doğrulanmış, bayatlama + tazelenme, transfer boşluğu).
Known limitations: İkili ustalık (masteredAt) kilit açma için korunuyor; Lab kullanıcıyı zorlamaz ilkesi gereği
  "kendi beyanım" geçersiz kılması hâlâ adımları açar, ama doğrulanmış skor ve istatistikler beyanı saymaz.
  Sandbox çalıştırmaları skor üretmez (doğru/yanlış ölçütü yok); yalnızca tahmin/anlatımla birleşince kanıt olur.
Next phase: Faz 4 — hata taksonomisi ve hata grafiği
```

## Faz 4 — Hata taksonomisi ve hata → bilgi grafiği

```text
PHASE STATUS: PASS
Implemented: 10 kategorili hata taksonomisi (CONCEPTUAL, FORMULA_SELECTION, CALCULATION, ATTENTION,
  PREREQUISITE, STRATEGY, ASSUMPTION, INTERPRETATION, TRANSFER, RECALL). Her yanlış cevap otomatik olarak
  hata kaydına dönüşür (soru, deneme, tür, güven, gerekçe, ipucu düzeyi, öğrencinin güveni, çözüm durumu).
  Kural tabanlı sınıflandırıcı (işaret hatası, 10^n kayması, yakın cevap, transfer/kalıcılık amacı, hızlı+emin
  ama yanlış, soru türü). Hata → beceri → adım → kavram → önkoşul → onarım izi; önkoşul yalnızca gerçekten
  zayıf görünüyorsa suçlanır, her iz güven değeri ve "muhtemelen" diliyle. Onarım başlatma; sonraki kanıtla
  (aynı soruda doğru cevap ya da onarım hedefinde doğrulanmış ustalık) otomatik kapanma. Öğrencinin türü
  düzeltmesi. Örüntü tespiti: aynı beceride 3+ hata → tekrarlayan hata; 2+ derste → alanlar arası yanılgı
  (kavram, kanıt, güven, etkilenen dersler). YZ hata analisti (açık uçlu cevaplar; kategori ve önkoşul
  doğrulanır, güven en fazla 0.85, çevrimdışıyken kurallar). Karar kaydı (ERROR_ANALYST). Eski yanlış
  cevaplar için tek seferlik, idempotent taşıma (kaynak: legacy).
Modified files: src/engines/progress.ts (hata/onarım kancası, TRANSFER_ATTEMPT), src/data/db.ts (taşıma),
  src/knowledge/knowledge.test.ts (taşıma sayısı beklentisi)
New files: src/adaptive/errors.ts, src/adaptive/decisions.ts, src/ai/adaptiveAI.ts, src/adaptive/errors.test.ts
Data model changes: errors, insights, decisions tabloları kullanılmaya başlandı; migration "v3-error-records".
Tests: 9 yeni (sınıflandırma, Bayes → koşullu olasılık izi, güçlü önkoşulun suçlanmaması, onarım başlat/tamamla,
  yeniden sınıflandırma, alanlar arası yanılgı, eski veri taşıması ve idempotentlik, YZ analizi kabul/ret/yedek).
Known limitations: Kural tabanlı sınıflandırma kesin değildir; bu yüzden her kayıt güven ve gerekçe taşır.
  YZ analisti arayüze Faz 20'de bağlanacak.
Next phase: Faz 5 — adım granularity motoru
```

## Faz 5 — Adım granularity motoru ve doğrulayıcı

```text
PHASE STATUS: PASS
Implemented: Her adım için yetenek tanımı (capability, cognitive_action, difficulty, estimated_effort,
  assessment_method, mastery_evidence, prerequisites) — kayıtlı adımlarda açıkça yazılmamışsa hedef, sorular
  ve ustalık ölçütünden çıkarılır. İki dilli bilişsel eylem sözlüğü (Türkçe ekleri için kök eşleşmesi).
  Doğrulayıcı: VALID / TOO_BROAD (3+ bağımsız beceri, koca alan, >120 dk) / TOO_NARROW (yalnızca okuma-izleme,
  <3 dk) / DUPLICATE (aynı yetenek) / MISSING_PREREQUISITE / WEAK_EVIDENCE (ölçülemeyen ustalık).
  Taslak müfredat (YZ ders kurucu çıktısı) için toplu doğrulama; kayıtlı adım için kontrol ve sonucun saklanması.
  Kalibrasyon: öğrencinin kendi ziyaretlerinden gerçek/tahmini süre oranı, kısa/uzun adım tamamlama oranı
  (nedensellik iddiası olmadan) ve bölünmeye aday adımlar.
Modified files: —
New files: src/adaptive/granularity.ts, src/adaptive/granularity.test.ts
Data model changes: Milestone.capability ve Milestone.granularity alanları kullanılıyor.
Tests: 4 yeni; yerleşik içerikte yanlış pozitif oranı 0/80 (EN+TR paketler ve grafikten üretilen adımlar).
Known limitations: Sözlük tabanlı; dili garip kurulmuş hedeflerde yanılabilir, bu yüzden kullanıcı işaretli
  bir adımı açıkça "yine de ekle" diyerek tutabilir (Faz 11/20).
Next phase: Faz 6 — takılma algılama
```

## Faz 6 — Takılma algılama (ve yardım hiyerarşisi)

```text
PHASE STATUS: PASS
Implemented: Ham olay ve kayıtlardan takılma algılayıcı. Sinyaller: art arda yanlış, ipucu sayısı/düzeyi,
  sorudaki uzun süre (en az 6 dk ya da kişisel medyanın 2.5 katı), aynı soruda çok deneme, YZ yardımı artışı,
  düşük güven, aynı adımdan önceki çıkışlar, aynı tür hatanın tekrarı. Pencere son doğru cevapta yeniden başlar.
  Yanlış pozitif koruması: yanlış cevap olmadan ve en az iki farklı sinyal olmadan asla STUCK denmez.
  Durumlar OK / STRUGGLING / STUCK. Seçenekler: Yeniden dene, Küçük ipucu, Kavram açıklaması, Daha basit örnek,
  Önkoşulu kontrol et (hata izinden hedefli), Strateji değiştir, Şimdilik atla, Çözümü gör (her zaman son,
  asla önerilmez). Bağlama göre öneri işareti (dalgınlıkta "yeniden dene", önkoşul izinde "önkoşulu kontrol et").
  Olay (STUCK_DETECTED tekil), seçim olayı, karar kaydı (STUCK_DETECTOR). Daha basit soru seçici.
  Yardım hiyerarşisi zaten vardı (0–5, tek tek açılır, sınır + onay); artık her basamak kanıt değerini düşürüyor (Faz 3).
Modified files: —
New files: src/adaptive/stuck.ts, src/adaptive/stuck.test.ts
Data model changes: —
Tests: 5 yeni (spesifikasyondaki STUCK örneği, yalnız ipucu/uzun süre yanlış pozitif değil, tek yanlış en fazla
  STRUGGLING, doğru cevap pencereyi sıfırlar, daha basit örnek).
Known limitations: Eşikler sabit; Odak Lab verisiyle kişiselleştirme ileride yapılabilir.
Next phase: Faz 7 — Path Planner
```

## Faz 7 — Path Planner

```text
PHASE STATUS: PASS
Implemented: Grafik üzerinde geçici, önerilen öğrenme rotası (müfredatı değiştirmez). Girdi: hedef(ler), doğrulanmış
  ustalık profilleri, kendi beyan, açık hatalar (onarım), kalıcılık durumu, zorluk tercihi (nazik/normal/zorlayıcı),
  yumuşak önkoşulları da izleme seçeneği, sınav modu öncelikleri. Bilinen ve taze nesneler rotaya girmez; bayatlar
  "tekrar", yalnızca beyan edilenler "kısa kontrol", hataların işaret ettikleri "onarım" rolünde. Her adımda gerekçe
  kodları: PREREQUISITE, MASTERY_GAP, IMPORTANCE (bağımlı nesne sayısı), CENTRALITY (doğrudan açtığı nesneler),
  RECENT_ERRORS, RETENTION, GOAL_RELEVANCE (hedefe uzaklık), SELF_DECLARED, EXAM — hepsi gerçek veriden.
  Sıralama önkoşullara uyar; bağımsız düğümler arasında onarım, sınav önceliği (önkoşullara miras) ve puan öne çıkar.
  Kullanıcı: adım atla/geri al, ekle (önkoşullarından sonra yerleşir), serbestçe yukarı/aşağı taşı, duraklat, terk et,
  devam et. Yeni kanıtla adımlar DONE olur, hedefler bitince rota COMPLETED. Tek etkin rota. Olaylar + karar kaydı.
Modified files: —
New files: src/adaptive/pathPlanner.ts, src/adaptive/pathPlanner.test.ts
Data model changes: paths tablosu kullanılıyor (adımlar, gerekçeler, seçenekler, geçmiş).
Tests: 5 yeni (doğru rota ve gerekçeler, bilinen/beyan/onarım, alternatif rota + sınav önceliği, kullanıcı
  geçersiz kılması + olaylar, kanıtla ilerleme ve tamamlanma).
Known limitations: Grafik yapısı (bağımlı sayıları) grafik başına önbellekte; rota oluşturulurken bir kez hesaplanır.
Next phase: Faz 8 — What Next motoru
```
