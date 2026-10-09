# Lab 2.0 — Son Denetim (Final Academic OS görevinin 1. adımı)

Tarih: 2026-10-09 · Dal: `ccr-2af93b6d-f90t4l` · Başlangıç commit'i: `c1be66a`

Bu belge, "Final Academic Operating System" spesifikasyonundaki (175 madde) her ana sistemi
**kod tabanının gerçek durumu** ile karşılaştırır. Durumlar:

- **DONE**: veri + mantık + kalıcılık + arayüz + test var
- **PARTIAL**: bir kısmı var; eksik katman belirtilmiştir
- **MISSING**: hiç yok
- **BROKEN**: var ama spesifikasyona aykırı davranıyor

Önceki "Adaptive Upgrade" görevi (23 aşama) yarıda kalmamış, `c1be66a` ile tamamlanıp push
edilmiştir. Testler (183), typecheck, build ve 48 adımlık smoke testi bu commit'te geçiyordu.
Bu nedenle tekrar yazılacak bir şey yok; aşağıdaki eksikler yeni spesifikasyonun getirdiği
kapsamdır.

## Mevcut mimari (kurtarılan yapı)

| Katman | Konum | Not |
|---|---|---|
| Kalıcılık | `src/data/store.ts`, `db.ts` | IndexedDB (iki slot, yarım yazmaya karşı), localStorage yedeği, `hydrateDB` ile eksik alan doldurma, `SCHEMA_VERSION = 3` |
| Alan modeli | `src/domain/types.ts`, `adaptive.ts` | 31 tablo + olay günlüğü |
| Bilgi grafiği | `src/knowledge/*` | 482 nesne, 19 alan, kararlı ID, overlay + sürüm geçmişi, diff → plan → uygula |
| Öğrenme motoru | `src/engines/*` | müfredat, ilerleme, oturum, analitik, deneyler |
| Uyarlanabilir katman | `src/adaptive/*` | ustalık profili, hata grafiği, takılma, rota, What Next, sınav modu, tekrar, üretici, köken, metrikler, sandbox, PTE, araştırma |
| YZ | `src/ai/*` | sağlayıcı soyutlaması (local/gemini/groq), `runAI` doğrulama + yedek |
| Arayüz | `src/ui/*` | hash router, 5 sekme |

## Özellik özellik durum

| # | Sistem (spesifikasyon maddesi) | Durum | Bulgu |
|---|---|---|---|
| 1 | Bilgi grafiği (11) | DONE | `knowledge/schema.ts`, ilişkiler, disiplinlerarası bağlar, kaynaklar |
| 2 | Grafik uzun ömrü (12): kararlı ID, sürüm, arşiv | PARTIAL | ID/sürüm/`KULLANIM_DISI` var; **takma ad (alias) yok**, aramada kullanılmıyor |
| 3 | Müfredat = bilgi, takvim değil (13) | DONE | grafik zamandan bağımsız |
| 4 | Path Planner (14) + Path memory (15) | DONE | `pathPlanner.ts`; ACTIVE/PAUSED/ABANDONED/COMPLETED saklanıyor |
| 5 | What Next (16) | PARTIAL | A–G seçenekleri var; **EXPLORE** seçeneği ve **güven (confidence)** alanı yok |
| 6 | Kullanıcı özerkliği (17) | DONE | atla/ertele/değiştir/elle seç |
| 7 | Ustalık profili (18) | PARTIAL | 7 boyut var; **güven boyutu** profil dışında; SELF_DECLARED/OBSERVED/VERIFIED/STALE ayrımı **adlandırılmış durum olarak yok** |
| 8 | Kanıt sistemi (19) | DONE | denemeler, açıklamalar, tahminler, kartlar, tekrarlar, sandbox |
| 9 | Ustalık derinliği (20): 8 seviye | MISSING | yalnız sayısal `depth` (0–7) |
| 10 | Hata motoru + hata grafiği (21–22) | DONE | 10 kategori, iz, onarım, örüntü |
| 11 | Takılma tespiti (23) | DONE | 8 seçenek |
| 12 | **"Biliyorum" beyanı** | BROKEN (kullanıcı isteği) | 4 yerde (nesne, giriş düzeyi toplu, adım, editör) kanıtsız beyan önkoşulu karşılıyor; **kısa testle değiştirilmeli** |
| 13 | Dinamik ayrıştırma (10): geçici alt adımlar | MISSING | `splitMilestone` kalıcı bölüyor; geçici onarım adımı yok |
| 14 | Milestone uzunluğu MICRO…BOSS (9) | PARTIAL | `scope` (MICRO/STANDARD/EXTENDED/PROJECT) var; 5 kademeli bilişsel uzunluk yok |
| 15 | Open Lab / One Thing Now / dinamik giriş (4–6) | PARTIAL | `NowCard` yalnızca rota/onarım/sınav; ana ekran hâlâ ders listesi + öneriler + kartlar (çoklu pano) |
| 16 | Focus flow (7) | DONE | `SessionPage` soru → cevap → geri bildirim → ustalık → sonraki |
| 17 | Deep Work modu (88) | MISSING | |
| 18 | Oturum devamı / kesinti kurtarma (89–91) | PARTIAL | ACTIVE adım "Devam eden" kartında; **Devam/Yeniden başla/Tekrar/Değiştir** seçimi yok |
| 19 | Oturum sonu özeti + yansıtma (122–123) | PARTIAL | sayılar ve notlar var; "ne değişti / belirsiz kalan / üretilen kanıt" ve iki yansıtma sorusu yok |
| 20 | Keşif / Surprise me / "Ne çalışacağımı bilmiyorum" / meydan okuma seviyesi (59, 108–112) | MISSING | |
| 21 | "Neden önemli / Nereye götürür" (61–62) | PARTIAL | metin + `unlocks` listesi var; gerçek grafik bağlantılarından türetilmiş zincir (2 adım + araştırma + projeler) yok |
| 22 | Önizleme modu (63–64) | PARTIAL | grafik nesneleri kilitsiz; adım ekranı "Kilitli" diyor |
| 23 | Journal (65) | MISSING | |
| 24 | Sorular birinci sınıf nesne + soru bankası + varyasyon (66–70) | PARTIAL | `Question` ayrı tablo; **durumlar (yeni/denendi/ustalaşıldı/zayıf/tekrar/favori)**, **banka görünümü**, **varyasyon üretimi** yok |
| 25 | Araştırma modu (34) | DONE | 12 adımlı proje akışı |
| 26 | Proje sistemi + akademik eserler + portfolyo (35–36, 96) | MISSING | |
| 27 | Sandbox (37) | PARTIAL | ifade/ODE/veri gerçek; **Python BLOCKED** (çevrimdışı Android, yorumlayıcı yok) |
| 28 | Okul: dersler, ödev, not, AP (38) | PARTIAL | sınav/ödev/sunum (`Exam`) var; **ders listesi, notlar, AP/yarışma dersi** yok |
| 29 | Sınav modu (39) | DONE | geçici kısıt katmanı |
| 30 | Kaçırılan son tarih dili (40) | PARTIAL | geçmiş sınav sadece listeleniyor; "plan değişti" yeniden planlama yok |
| 31 | Akademik hedefler + ayrıştırma (41–42) | PARTIAL | `knowledge.goals` yalnız nesne kimlikleri; neden/şimdiki/istenen durum ve alan → yetenek → kavram → adım → kanıt ayrıştırması yok |
| 32 | Kişisel öğrenme modeli + içgörüler (43–44, 120) | PARTIAL | hata örüntüleri var; gözlemlenmiş tercih modeli ve veri + zaman aralığı + örneklemli içgörü yok |
| 33 | Focus Lab (45) | DONE | 7 faktör, rapor (hipotez/deney/gözlem/sonuç/güven/sınırlar) |
| 34 | Analitik katmanları (46) | DONE | katılım ≠ öğrenme ≠ kalıcılık; **"Seri" (streak) metriği gösteriliyor → spesifikasyona aykırı** |
| 35 | Derinlik analitiği (47) | MISSING | genişlik/derinlik/kalıcılık/transfer/araştırma göstergesi yok |
| 36 | Kişisel rekorlar (87) | MISSING | |
| 37 | Akademik zaman çizelgesi + yıllık değerlendirme (94–95) | MISSING | |
| 38 | Kalıcılık motoru strateji arayüzü (52) | MISSING | sabit merdiven + SM-2; değiştirilebilir `RetentionStrategy` yok |
| 39 | Bildirim felsefesi (53) | DONE | yalnız kullanıcının seçtiği hatırlatmalar |
| 40 | YZ rolleri (25) | PARTIAL | 20 rol; Granularity/Difficulty/Retention Planner ayrı çağrı olarak yok (deterministik motorlar) |
| 41 | YZ belleği = yapılandırılmış durum (26) | DONE | istemler kayıtlardan kuruluyor |
| 42 | YZ müfredat oluşturucu + diff + onay + sürüm (27–29) | DONE | `generator.ts`, `ProposalReview`; **geri alma (rollback)** yok |
| 43 | Kaynak sistemi (30, 72) | DONE | tür/yazar/url/doğrulama; sürüm/tarih alanı eksik (PARTIAL) |
| 44 | Arşivleme (74) | PARTIAL | dersler ve nesneler arşivlenebiliyor; kullanıcı tarafı arşiv görünümü sınırlı |
| 45 | Kullanıcı özel içeriği (75) | PARTIAL | ders/adım/soru/kaynak eklenebiliyor; **kavram (grafik nesnesi)**, proje, hedef eklenemiyor |
| 46 | Import/Export (76–77) | PARTIAL | tam yedek + uyarlanabilir dışa aktarma; **sürümlü varlık/ilişki biçimi** ve journal/proje/hedef yok |
| 47 | Gizlilik / bağlam azaltma (78) | PARTIAL | istemler zaten küçük; açık bir **bağlam bütçesi** ve tercih yok |
| 48 | Çevrimdışı öncelik + YZ hatası (79–80, 136) | DONE | her rolün yerel yedeği var |
| 49 | Maliyet kontrolü / önbellek (81) | MISSING | aynı istem tekrar çağrılıyor |
| 50 | Sağlayıcı yetenekleri (82, 137) | PARTIAL | `complete()` var; generate/evaluate/embed/structuredOutput yetenek bildirimi yok |
| 51 | YZ çıktı doğrulama hattı (83–84) | DONE | parse → alan → grafik → diff → onay |
| 52 | Kullanıcı kontrol paneli + YZ kişiselleştirme (116–118) | PARTIAL | sağlayıcı, ipucu sınırı, hareket, dil var; **YZ üslubu, meydan okuma seviyesi, animasyon düzeyi, günlük öneri, gizlilik** yok |
| 53 | İstatistik dürüstlüğü (119) | DONE | n ve aralık gösteriliyor |
| 54 | Arama (106) + hızlı komut (107) | MISSING | yalnız grafik içi arama |
| 55 | İlk çalıştırma (145) / mevcut kullanıcı (146) | PARTIAL | boş durumda "yeni ders" kartı; "Ne anlamak istiyorsun?" akışı yok |
| 56 | Dil öğrenimi yetenekleri (149) | PARTIAL | dil alanları var; kelime/dilbilgisi/okuma/dinleme/yazma/konuşma dağılımı yok |
| 57 | Yarışma katmanı (150) | PARTIAL | grafik eşlemeleri var; hız/doğruluk/çözüm kalitesi takibi yok |
| 58 | Araştırma vs sınav ustalığı (151–152) | MISSING | tek `verified` değeri |
| 59 | Bakım önerileri (160–162) | PARTIAL | doğrulayıcı var; kullanıcıya sade bakım önerisi yok |
| 60 | Sistem sağlığı (163) | MISSING | |
| 61 | Yedekleme: otomatik yerel yedek + geri yükleme (139) | PARTIAL | iki slotlu yazma var; tarihli otomatik anlık görüntü yok |
| 62 | Göç sistemi (99) | DONE | `runKnowledgeMigrations`, `migrateLegacyErrors` deterministik/idempotent |
| 63 | Erişilebilirlik / dikey tablet / kalem (101–105) | DONE | çizim tuvali, büyük dokunma hedefleri, azaltılmış hareket |
| 64 | Yükleme/hata/boş durumları (142–144) | PARTIAL | `spinner` + genel hata; anlamlı adım mesajları yok |

## Sonuç

- BROKEN: 1 ("Biliyorum" beyanı — kullanıcı isteği) + streak metriği (spesifikasyona aykırı)
- MISSING: 17 sistem
- PARTIAL: 30 sistem
- DONE: 20 sistem

Tamamlama sırası (spesifikasyon §165): Veri → Alan mantığı → YZ → Analitik → Müfredat → Arayüz
→ Entegrasyon → Günlük deneyim → Uzun vadeli sağlamlaştırma → Test → Cila.
Sonuçlar `LAB_FINAL_COMPLETION_REPORT.md` dosyasında.
