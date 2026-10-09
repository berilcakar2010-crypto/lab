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
