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

## Faz 8 — What Next motoru

```text
PHASE STATUS: PASS
Implemented: Bir adım bittiğinde (ya da her istendiğinde) yedi tür seçenek değerlendirilir ve gerekçeleriyle
  sıralanır; hiçbiri kullanıcı adına seçilmez: A Devam (etkin rotanın adımı / dersteki doğal devam / grafikte
  açtığı konu), B Meydan okuma (CHALLENGE/BOSS adımı ya da bir kademe zor nesne), C Önkoşul onarımı (hataların
  işaret ettiği beceri, güven yüzdesiyle), D Tekrar (kalıcılık kontrolü / tekrar takvimi / bayatlayan ustalık),
  E Transfer (disiplinlerarası bağlantıyla başka alanda kullanım; profilde transfer zayıfsa öne çıkar),
  F Alan değiştir (en uzun süredir çalışılmayan ders ya da duraklatılmış rota), G Araştırma (nesnenin araştırma
  uygulamalarından açık soru; derinlik yüksekse öne çıkar). Sınav modunda sınav konuları yükseltilir.
  WHAT_NEXT_SHOWN / WHAT_NEXT_CHOSEN olayları.
Modified files: —
New files: src/adaptive/whatNext.ts, src/adaptive/whatNext.test.ts
Data model changes: —
Tests: 3 yeni (A–G seçenekleri, sıralama ama seçmeme, gerekçeler, transfer/araştırma, etkin rota, tekrar).
Known limitations: Mevcut ders içi "Sırada ne var?" önerileri (recommendNext) korunuyor ve A/B/D için kaynak olarak kullanılıyor.
Next phase: Faz 9 — Normal / Sınav modu
```

## Faz 9 — Normal Mod / Sınav Modu

```text
PHASE STATUS: PASS
Implemented: Çalışma modu tercihi (NORMAL: anlama, ustalık, kalıcılık, transfer; EXAM: son tarih, kapsam, sınav
  önceliği, soru pratiği, zaman). Sınav modu yalnızca geçici kısıt katmanıdır: müfredat, sorular ve grafik
  değişmez (testle doğrulandı). Sınav konusu başına öncelik (yüksek/orta/düşük) → mevcut sınav günlük planı,
  rota planlayıcı (önkoşullara miras), What Next (sınav konuları yükseltilir) ve soru pratiği listesine yansır.
  Kapsam yüzdesi (doğrulanmış ≥ 0.6), oturmamış yüksek öncelikli konular, öneri dili ("işine yarayabilir").
  Sınav geçince mod kendiliğinden NORMAL'e döner. MODE_CHANGED olayı; sınav rotası için karar kaydı.
Modified files: src/study/exams.ts (plan sıralamasında öncelik)
New files: src/adaptive/modes.ts, src/adaptive/modes.test.ts
Data model changes: preferences.studyMode/focusExamId ve Exam.priorities kullanılıyor.
Tests: 2 yeni (mod değişimi + müfredat dokunulmazlığı + otomatik dönüş; öncelikler plan/rota/pratik/kapsam).
Known limitations: Süreli deneme sınavı (zamanlayıcı) arayüz tarafında sunulacak; motor süre önerisi yapmıyor.
Next phase: Faz 10 — uyarlanır aralıklı tekrar
```

## Faz 10 — Uyarlanır aralıklı tekrar

```text
PHASE STATUS: PASS
Implemented: Tek bir sabit algoritmaya bağlı olmayan tekrar önceliği. Sinyaller: kavramın önemi (bağımlı nesne
  sayısı), önkoşul merkeziliği, son hatalar, öğrencinin güveni, profil güveni, anlık ve gecikmeli doğruluk farkı
  (çabuk unutma), transfer performansı, son doğrulamadan geçen süre, kanıt kalitesi (yardım indirimi), ustalık açığı.
  Çıktı: 0..1 öncelik, 0.5–1.3 aralık çarpanı ve gerekçeler. Konu merdiveni ve kart SM-2'si taban aralığı verir;
  çarpan bunu ölçekler. Sinyal yoksa çarpan tam 1 (mevcut davranış değişmez). Tekrar kuyrukları (konu ve kart)
  önceliğe göre sıralanır.
Modified files: src/study/topics.ts (reviewTopic'e isteğe bağlı çarpan; olayda kaydedilir),
  src/adaptive/pathPlanner.ts (graphStructure dışa açıldı)
New files: src/adaptive/retention.ts, src/adaptive/retention.test.ts
Data model changes: TOPIC_REVIEW olayına factor alanı.
Tests: 3 yeni (sinyalsiz = değişiklik yok; zayıf/önemli konu daha erken, oturmuş yaprak konu daha geç; kuyruk sırası ve kart aralığı).
Known limitations: Ağırlıklar elle seçildi; kişisel deneylerle ayarlanabilir.
Next phase: Faz 11 — YZ müfredat üretici
```

## Faz 11 — YZ müfredat üretici

```text
PHASE STATUS: PASS
Implemented: "Bana X'i öğret" hattı: hedef → grafikte arama (yol ya da nesneler) → mevcut düğümler yeniden kullanılır
  (kopya önlenir; YZ'nin önerdiği yeni düğüm iki dilde de mevcut bir başlığa benziyorsa yeniden kullanıma çevrilir)
  → yoldaki doğrulanmamış önkoşullar → yeni düğüm önerisi (yalnızca YZ ile; çevrimdışıyken uydurulmaz, açıkça
  söylenir) → her adım için starting_question, attempt, learning_material (en fazla ~900 karakter: "yalnızca gerekeni
  öğren"), application, mastery_evidence, transfer → granularity doğrulayıcı → grafik doğrulayıcı (varsayımsal
  güncelleme üzerinde) → köken bilgisi → diff. YZ çıktısı şemayla doğrulanır; geçersiz çıktıda çevrimdışı yol.
  Mevcut düğümler için adımlar deterministik grafik üreticisinden gelir.
Modified files: src/ai/adaptiveAI.ts (müfredat gözden geçirici rolü)
New files: src/adaptive/generator.ts, src/adaptive/generator.test.ts
Data model changes: curriculumProposals tablosu.
Tests: çevrimdışı yeniden kullanım + uydurmama, eşleşme yoksa dürüst not, YZ ile yeni düğüm/kopya önleme/granularity/önkoşul.
Known limitations: Yeni düğümlerin İngilizce/Türkçe çevirisi yok; YZ hangi dilde yazdıysa o dilde görünür.
Next phase: Faz 12 — diff ve onay
```

## Faz 12 — YZ müfredat diff + onay + sürüm

```text
PHASE STATUS: PASS
Implemented: Diff satırları: + Eklenen düğüm, ~ Değişen düğüm, - Kaldırılan düğüm (silme yok; her zaman geçersiz,
  "kullanım dışı bırak" önerilir), → Eklenen/kaldırılan önkoşul, + Adım / → Değişen adım; her satır geçerli/geçersiz
  ve gerekçeli. Onay: tümünü onayla, seçerek onayla (bağımlılıklar otomatik eklenir: adım → düğüm, düğüm → kendi
  önkoşul kenarları), tümünü reddet. Geçersiz değişiklik onaylanamaz. Uygulama mevcut güvenli güncelleme hattıyla:
  diffUpdate → yeni hata varsa uygulanmaz → applyPlan (overlay + sürüm geçmişi, sürüm bir artırılır) → onaylanan
  adımlardan yeni ders (yetenek, granularity ve köken bilgisi adımlara yazılır). Durum APPLIED/PARTIAL/REJECTED.
  CURRICULUM_PROPOSED / CURRICULUM_DECIDED olayları ve karar kaydı. YZ gözden geçirici (CURRICULUM_REVIEWER)
  öneriyi değiştirmeden not ekler; çevrimdışıyken deterministik kontrol listesi.
Modified files: —
New files: (generator.ts içinde)
Data model changes: KnowledgeState.history'ye sürüm kaydı, KnowledgeState.provenance.
Tests: seçerek onay → yeni grafik sürümü + ders + köken + grafik doğrulayıcıda 0 hata; reddetme hiçbir şeyi
  değiştirmez; karar verilmiş öneri tekrar uygulanamaz; gözden geçirici (YZ + çevrimdışı).
Known limitations: "Değişen adım" yalnızca yeni ders içinde; mevcut derslerin adımlarını değiştirmez.
Next phase: Faz 13 — kaynak ve köken
```

## Faz 13 — Kaynak ve köken (provenance)

```text
PHASE STATUS: PASS
Implemented: Köken kaydı (source, source_type, source_url, source_title, added_at, last_verified_at, verified_by,
  confidence, generated_by_ai, VERIFIED/UNVERIFIED). Kaynak türleri: TEXTBOOK, COURSE, PAPER, OFFICIAL_DOCUMENT,
  OPEN_RESOURCE, AI_GENERATED, USER_CREATED, OTHER. YZ içeriği kendiliğinden asla doğrulanmış olamaz; yalnızca kişi
  doğrular. Yerleşik içerik "editoryal, kaynakla tek tek doğrulanmamış" olarak dürüstçe UNVERIFIED. Kitap/kurs =
  kaynak: kaynak ekleme, bölüm ekleme (grafikten eşleşme önerisi), bölümü düğümlere eşleme; bir nesnenin tüm
  kaynakları (seninkiler + Lab'in kaynak listesi). Kitap müfredat oluşturmaz (testle doğrulandı).
Modified files: —
New files: src/adaptive/provenance.ts
Data model changes: sources tablosu; Course/Milestone/KnowledgeState provenance alanları.
Tests: 2 yeni (YZ kendini doğrulayamaz + kişi doğrular; Thomas Calculus bölümü → math.calc.limits).
Known limitations: URL'ler erişilebilirlik için denetlenmez (çevrimdışı uygulama).
Next phase: Faz 14 — analitik genişletmeleri
```

## Faz 14 — Analitik genişletmeleri

```text
PHASE STATUS: PASS
Implemented: Olay modeli genişletildi (21 yeni olay, olaylarda kullanıcı ve kavram alanı — Faz 2). Ham olaylardan
  türetilen metrikler (hiçbir sayı saklanmaz/sabit yazılmaz): Verimlilik (aktif süre, saat başına adım, oturum başına
  soru ve deneme), Sebat (yeniden deneme, bırakma, devam etme oranı, oturum başına takılma), Öğrenme (ilk deneme
  doğruluğu, dönemdeki ustalık kazanımı — beyan hariç, hata azalması, transfer başarısı), Kalıcılık (gecikmeli hatırlama,
  kalıcılık kaybı = anlık − gecikmeli, tekrar etkinliği), Katılım (medyan oturum süresi, etkileşim yoğunluğu, seri,
  kalem payı, kesinti), Derinlik (her boyutta ≥0.7 olan nesne payı, genişlik, ortalama derinlik — yalnızca doğrulanmış
  kanıt), Ders (en güçlü/zayıf ders, en güçlü adım türü, en sık hata, en yüksek kalıcılık ve transfer). Oranlar Wilson
  aralıklı ve az örnekte gizli. Katılım / Öğrenme / Kalıcılık ayrı seviyelerde (HIGH/MEDIUM/LOW/Yetersiz veri);
  "çok çalıştın, iyi öğrendin" gibi bir çıkarım yapılmaz. Gözlemsel karşılaştırmalar nedensellik dili olmadan
  (örn. kalem: "ölçülen doğruluk daha yüksekti … bu nedenini göstermez; Odak Lab deneyle sınayabilir").
Modified files: —
New files: src/adaptive/metrics.ts, src/adaptive/metrics.test.ts
Data model changes: —
Tests: 3 yeni (veri yokken "yetersiz veri", ham olaylardan türetme + katmanların ayrılığı + nedensellik dili yok,
  hata ve transfer sayımı).
Known limitations: Olay adları mevcut adlarla eşleştirildi (SESSION_START ≙ SESSION_STARTED vb.), yeniden adlandırılmadı.
Next phase: Faz 15 — Odak Lab entegrasyonu
```

## Faz 15 — Odak Lab ve kişisel deneyler

```text
PHASE STATUS: PASS
Implemented: Odak Lab'in sınadığı etkenler: adım uzunluğu, zorluk, etkileşim türü, kalem, geri bildirim zamanlaması,
  meydan okuma, yenilik, ders, günün saati, YZ yardımı (mevcuttu) + yeni "adım granularity'si" (mikro / standart /
  geniş-proje / doğrulayıcıya göre çok geniş). Kişisel deney sonucu artık yazılı rapor olarak saklanıyor: hipotez,
  deney tasarımı, gözlenen veri, sonuç (SUPPORTED / NOT_SUPPORTED / INCONCLUSIVE), güven ve sınırlılıklar. Arayüzdeki
  "Bitir" düğmesi raporu kaydediyor.
Modified files: src/engines/statistics.ts, src/engines/focusLab.ts, src/engines/experiments.ts, src/ui/pages/ExperimentsSection.tsx
New files: src/adaptive/focus.test.ts
Data model changes: Experiment.report.
Tests: 2 yeni (granularity etkeni; rapor alanları, yetersiz veride INCONCLUSIVE, bitirince saklanma).
Known limitations: Tek öğrencili dönüşümlü tasarım; raporun kendisi bu sınırlılığı listeler.
Next phase: Faz 16 — Feynman / Anlat modu
```

## Faz 16 — Feynman / Anlat modu

```text
PHASE STATUS: PASS
Implemented: Mevcut Anlat paneli (yazılı/sesli/video + YZ değerlendirmesi) genişletildi: YZ artık açıklamayı ölçütlere
  göre değerlendirir, eksikleri söyler ve cevabı vermeden 1–3 takip sorusu sorar (soru işareti olmayan, yani cevap
  içeren maddeler elenir). Yanlış kavramlar grafikteki nesnelere bağlanır (önce nesnenin bilinen yanılgıları, sonra
  önkoşul/ilgili kavramlarda arama). Çevrimdışıyken takip soruları grafiğin kendi temel sorularından ve yaygın
  yanılgılarından gelir. Feynman diyaloğu: bir takip sorusuna kendi cümlelerinle cevap → zincir (followUpOf).
  Değerlendirilmiş açıklamalar ustalık profilinde "açıklama" kanıtıdır.
Modified files: src/ai/studyAI.ts, src/study/actions.ts, src/domain/types.ts (Explanation.followUpOf)
New files: src/adaptive/feynman.test.ts
Data model changes: ExplanationEvaluation.followUps/misconceptionLinks, Explanation.followUpOf.
Tests: 3 yeni (cevap içeren takip sorusu elenir + yanılgı grafiğe bağlanır; çevrimdışı takip soruları; diyalog zinciri ve kanıt).
Known limitations: Takip sorusu cevabının değerlendirmesi aynı değerlendiriciyle yapılır (ayrı ölçüt seti yok).
Next phase: Faz 17 — Tahmin → Test → Açıklama
```
