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
