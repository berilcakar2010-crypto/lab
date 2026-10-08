/** User flows exercised by scripts/smoke.mjs. Each phase adds to this file. */
export default async function flows({ page, step, shot, click, BASE }) {
  await step("English is the default language", async () => {
    await page.goto(BASE);
    await page.getByRole("heading", { name: "What's next?" }).waitFor();
    await page.getByRole("link", { name: "Study" }).waitFor();
    await shot("00-home-english");
  });

  await step("home renders with empty state", async () => {
    // The rest of the flows run in Turkish (the option); ?lang=tr switches and persists.
    await page.goto(`${BASE}?lang=tr`);
    await page.getByRole("heading", { name: "Sırada ne var?" }).waitFor();
    await shot("01-home-empty");
  });

  await step("build Calculus 1 offline and accept", async () => {
    await click("Yeni ders");
    await page.getByLabel("Neyde ustalaşmak istiyorsun?").fill("Kalkülüs 1");
    await click("Müfredatı oluştur");
    await page.getByRole("heading", { name: "Kalkülüs 1" }).waitFor();
    await shot("02-draft");
    await click("Kabul et ve başlangıç noktamı bul");
    await page.getByRole("dialog", { name: "Başlangıç noktanı bul" }).waitFor();
  });

  await step("calibrate with a diagnostic", async () => {
    await click("Eminim");
    await page.getByRole("button", { name: /kısa tanılama/ }).click();
    // Answer first diagnostic with "Henüz bilmiyorum", then accept the rest the same way.
    for (let i = 0; i < 6; i++) {
      const btn = page.getByRole("button", { name: "Henüz bilmiyorum" });
      if (!(await btn.isVisible().catch(() => false))) break;
      await btn.click();
    }
    await page.getByText("Buradan başla").first().waitFor();
    await shot("03-calibration");
    await click("Bu başlangıç noktasını kullan");
  });

  await step("what's next lists recommendations with reasons", async () => {
    await page.getByRole("tab", { name: "Sırada ne var" }).waitFor();
    await page.getByText("önerilen").first().waitFor();
    await shot("04-next");
  });

  await step("data persists across a reload (IndexedDB)", async () => {
    await page.waitForTimeout(600);
    await page.reload();
    await page.getByRole("heading", { name: "Kalkülüs 1" }).waitFor();
    const backend = await page.evaluate(() => new Promise((resolve) => {
      const req = indexedDB.open("lab");
      req.onsuccess = () => resolve(req.result.objectStoreNames.contains("kv"));
      req.onerror = () => resolve(false);
    }));
    if (!backend) throw new Error("IndexedDB store missing");
  });

  await step("curriculum editor: open, edit and save a milestone", async () => {
    await page.getByRole("tab", { name: "Müfredat" }).click();
    await page.getByRole("button", { name: /limiti grafikten/ }).first().click();
    await page.getByRole("dialog", { name: "Adımı düzenle" }).waitFor();
    await page.getByLabel("Başlık").first().fill("Bir limiti grafikten ya da tablodan tahmin et");
    await click("Değişiklikleri kaydet");
    await page.getByRole("button", { name: /limiti grafikten ya da tablodan/ }).first().waitFor();
    await shot("05-editor");
  });

  await step("curriculum editor: merge two milestones", async () => {
    const boxes = page.getByRole("checkbox", { name: /^Seç: / });
    await boxes.nth(2).check();
    await boxes.nth(3).check();
    await click("Birleştir");
    await page.getByText(/2 adım birleştirildi/).waitFor();
  });

  await step("curriculum editor: split a milestone (offline)", async () => {
    await page.getByRole("button", { name: /Optimizasyon problemlerini/ }).first().click();
    await click("Böl…");
    await page.getByRole("dialog", { name: "Adımı böl" }).waitFor();
    await click("Böl", { exact: true });
    await page.getByText(/parçaya bölündü/).waitFor();
  });

  await step("map tab renders", async () => {
    await page.getByRole("tab", { name: "Harita" }).click();
    await shot("06-map");
  });

  await step("build Mechanics and open the first recommendation", async () => {
    await page.goto(`${BASE}#/build`);
    await page.getByLabel("Neyde ustalaşmak istiyorsun?").fill("TÜBİTAK Fizik Olimpiyatı Mekanik");
    await click("Müfredatı oluştur");
    await click("Kabul et ve başlangıç noktamı bul");
    await page.getByRole("button", { name: "Kapat" }).click();
    await page.getByText("önerilen").first().click();
    await page.getByText("Bunun sonunda şunu yapabileceksin").waitFor();
    await shot("07-session");
  });

  await step("session: wrong answer → feedback → hint → retry → correct", async () => {
    await page.getByLabel("Sayısal cevap").fill("5");
    await click("Kontrol et");
    await page.getByText("Henüz değil", { exact: true }).waitFor();
    await shot("08-feedback");
    await click("Tekrar dene");
    await page.getByRole("button", { name: /Küçük ipucu/ }).click();
    await page.getByText("Vektörü çiz").waitFor();
    await page.getByLabel("Sayısal cevap").fill("8,66");
    await click("Kontrol et");
    await page.getByText("Doğru", { exact: true }).waitFor();
    await click("Sonraki");
  });

  await step("session: second answer reaches mastery and shows progress + next options", async () => {
    await page.getByLabel("Sayısal cevap").fill("-19,97 m/s");
    await click("Kontrol et");
    await click("Adımda ustalaştın — devam");
    await page.getByText("Ustalaştın", { exact: true }).waitFor();
    await page.getByRole("heading", { name: "Sırada ne var?" }).waitFor();
    await page.getByText("Kilidi açıldı").waitFor();
    await page.waitForTimeout(1200);
    await shot("09-complete");
  });

  await step("immediate retention check after mastery", async () => {
    await click("Şimdi kontrol et");
    await page.getByText("Kalıcılık kontrolü · sayısal").waitFor();
    await page.getByLabel("Sayısal cevap").fill("10,39");
    await click("Kontrol et");
    await page.getByText("Anında kontrol geçti").waitFor();
  });

  await step("continue to the next milestone", async () => {
    await page.getByText("önerilen").first().click();
    await page.getByText("Bunun sonunda şunu yapabileceksin").waitFor();
  });

  await step("locked milestone can be opened with an explicit override", async () => {
    await page.goto(`${BASE}#/`);
    await page.getByRole("button", { name: /Mekanik/ }).first().click();
    await page.getByRole("tab", { name: "Harita" }).click();
    await page.getByRole("button", { name: /Serbest cisim diyagramı çiz/ }).first().click();
    await shot("11-map-sheet");
    await click("İçine bak");
    await page.getByText("Bu adım, henüz tamamlamadığın adımlar üzerine kurulu:").waitFor();
    await click("Yine de aç");
    await page.getByText("Bunun sonunda şunu yapabileceksin").waitFor();
  });

  await step("stylus drawing with pressure and rubric self-assessment", async () => {
    await page.getByRole("img", { name: "Cevabını çiz" }).waitFor();
    await page.evaluate(() => {
      const c = document.querySelector('canvas[aria-label="Cevabını çiz"]');
      const r = c.getBoundingClientRect();
      const fire = (type, x, y) => c.dispatchEvent(new PointerEvent(type, { pointerType: "pen", pointerId: 7, clientX: r.left + x, clientY: r.top + y, pressure: 0.7, bubbles: true, isPrimary: true }));
      fire("pointerdown", 100, 100);
      for (let i = 1; i < 20; i++) fire("pointermove", 100 + i * 5, 100 + i * 3);
      fire("pointerup", 200, 160);
      // A palm touch after the pen must be ignored.
      c.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "touch", pointerId: 9, clientX: r.left + 300, clientY: r.top + 300, bubbles: true }));
      c.dispatchEvent(new PointerEvent("pointerup", { pointerType: "touch", pointerId: 9, clientX: r.left + 300, clientY: r.top + 300, bubbles: true }));
    });
    await page.getByText("kalem algılandı, avuç içi engelleme açık").waitFor();
    await click("Kontrol et");
    await page.getByText("Ölçütlere göre değerlendir").waitFor();
    const boxes = page.locator('label:has(input[type=checkbox])');
    for (let i = 0; i < 4; i++) await boxes.nth(i).locator("input").check();
    await shot("10-rubric");
    await click("Onayla");
    await page.getByText("öz değerlendirme").waitFor();
  });

  await step("offline guide asks a question without giving the answer", async () => {
    await page.goto(`${BASE}#/`);
    await page.getByRole("button", { name: /Mekanik/ }).first().click();
    await page.getByRole("button", { name: /Vektörleri bileşenleriyle topla/ }).first().click();
    await page.getByLabel("Sayısal cevap").fill("1");
    await click("Kontrol et");
    await page.getByRole("button", { name: /Rehber/ }).click();
    await click("Bana yol gösteren bir soru sor");
    await page.getByText("Soru aslında ne istiyor").waitFor();
    await click("Neden yanlıştı?");
    await page.getByText("Neden yanlış olabilir? (çevrimdışı)").waitFor();
    await shot("12-guide");
  });

  await step("end session shows a summary and returns to what's next", async () => {
    await click("Oturumu bitir");
    await page.getByText("Oturum tamamlandı").waitFor();
    await page.getByRole("heading", { name: "Değerlendirme notları" }).waitFor();
    await page.getByRole("heading", { name: "Sırada ne var?" }).waitFor();
    await shot("18-summary");
  });

  await step("home shows objective, progress, next actions and recent progress", async () => {
    await page.goto(`${BASE}#/`);
    await page.getByRole("heading", { name: "Sırada ne var?" }).waitFor();
    await page.getByRole("heading", { name: "Son ilerlemeler" }).waitFor();
    await page.getByRole("heading", { name: "Dersler" }).waitFor();
    await shot("19-home");
  });

  await step("statistics render from events with insufficient-data states", async () => {
    await page.goto(`${BASE}#/stats`);
    await page.getByRole("heading", { name: "İstatistikler" }).waitFor();
    await page.getByText("Bağlılık öğrenmenin kanıtı değildir").waitFor();
    await page.getByText("Yeterli veri yok").first().waitFor();
    await page.getByRole("button", { name: "Kalem", exact: true }).click();
    await shot("14-stats");
  });

  await step("focus lab shows hypothesis and refuses to over-claim", async () => {
    await page.goto(`${BASE}#/focus`);
    await page.getByRole("heading", { name: "Sana ne yardımcı oluyor gibi?" }).waitFor();
    await page.getByText(/Yetersiz veri|Henüz belirgin örüntü yok/).first().waitFor();
    await shot("15-focus");
  });

  await step("retention page shows schedule and learned-vs-done", async () => {
    await page.goto(`${BASE}#/retention`);
    await page.getByRole("heading", { name: "Aklında kaldı mı?" }).waitFor();
    await page.getByText("Yaklaşanlar").waitFor();
    await shot("16-retention");
  });

  await step("start a personal experiment", async () => {
    await page.goto(`${BASE}#/focus`);
    await click("Yeni deney");
    await page.getByRole("button", { name: /Uzun görevler mi, mikro adımlar mı/ }).click();
    await page.getByText("Sürüyor", { exact: true }).waitFor();
    await page.getByText(/Karşılaştırmak için henüz erken/).waitFor();
    await shot("17-experiment");
  });

  const spec = {
    title: "Theoretical Neuroscience", subject: "Neuroscience", goal: "Model neurons and networks mathematically.",
    units: [{ title: "Single neurons", topics: [{ title: "Membrane", milestones: [
      { key: "a", title: "Explain the membrane as an RC circuit", type: "CONCEPT", difficulty: 2, estimatedMinutes: 10,
        questions: [{ kind: "NUMERIC", purpose: "MASTERY", prompt: "Membrane time constant for R=10 MΩ, C=1 nF (ms)?", numeric: { value: 10, tolerance: 0.02, unit: "ms" }, hints: ["h1", "h2", "h3", "h4"], solution: "τ = RC = 10 ms" }] },
      { key: "b", title: "Simulate a leaky integrate-and-fire neuron", type: "APPLICATION", prerequisites: ["a"], difficulty: 3, estimatedMinutes: 30 },
      { key: "c", title: "Derive the firing-rate curve", type: "DERIVATION", prerequisites: ["a"], difficulty: 4, estimatedMinutes: 40, optional: true },
    ] }] }],
  };

  await step("swap to Groq: curriculum generated through the AI provider (network mocked)", async () => {
    await page.route("https://api.groq.com/**", (route) => route.fulfill({ status: 200, contentType: "application/json",
      body: JSON.stringify({ choices: [{ message: { content: JSON.stringify(spec) } }] }) }));
    await page.goto(`${BASE}#/settings`);
    await page.getByRole("button", { name: "Groq", exact: true }).click();
    await page.getByLabel("Groq API anahtarı").fill("test-key");
    await click("Anahtarları kaydet");
    await page.goto(`${BASE}#/build`);
    await page.getByLabel("Neyde ustalaşmak istiyorsun?").fill("Kuramsal Sinirbilim");
    await click("Müfredatı oluştur");
    await page.getByText(/YZ tarafından oluşturuldu/).waitFor();
    await page.getByText("Simulate a leaky integrate-and-fire neuron").waitFor();
    await shot("13-ai-draft");
  });

  await step("swap to Gemini: provider failure falls back to the offline builder", async () => {
    await page.route("https://generativelanguage.googleapis.com/**", (route) => route.fulfill({ status: 503, body: "overloaded" }));
    await page.goto(`${BASE}#/settings`);
    await page.getByRole("button", { name: "Gemini", exact: true }).click();
    await page.getByLabel("Gemini API anahtarı").fill("test-key");
    await click("Anahtarları kaydet");
    await page.goto(`${BASE}#/build`);
    await page.getByLabel("Neyde ustalaşmak istiyorsun?").fill("Kalkülüs 1");
    await click("Müfredatı oluştur");
    await page.getByText(/YZ sağlayıcısı başarısız oldu/).waitFor();
    await page.goto(`${BASE}#/settings`);
    await page.getByText("YZ etkinliği").waitFor();
    await page.getByRole("button", { name: "Çevrimdışı", exact: true }).click();
  });

  await step("boss milestone: open via the map with an override and solve an equation", async () => {
    await page.goto(`${BASE}#/`);
    await page.getByRole("button", { name: /Mekanik/ }).first().click();
    await page.getByRole("tab", { name: "Harita" }).click();
    await page.getByRole("button", { name: /çember fırlatıcısı/ }).first().click();
    await click("İçine bak");
    await click("Yine de aç");
    await page.getByText("Final", { exact: true }).first().waitFor();
    await page.getByLabel("İfade cevabı").fill("5R/2");
    await click("Kontrol et");
    await page.getByText("Doğru — beklenen ifadeye denk.").waitFor();
    await shot("21-boss");
  });

  await step("knowledge graph: contextual view, search and object sheet", async () => {
    await page.goto(`${BASE}#/graph`);
    await page.getByRole("heading", { name: "Bilginin yapısı" }).waitFor();
    await page.getByRole("heading", { name: "Önerilen sonraki" }).waitFor();
    await page.getByLabel("Grafikte ara").fill("Hodgkin");
    await page.getByRole("button", { name: /Hodgkin–Huxley modeli/ }).first().click();
    const sheet = page.getByRole("dialog", { name: "Hodgkin–Huxley modeli" });
    await sheet.waitFor();
    await sheet.getByText("Önce düşün").waitFor();
    await sheet.getByText(/Buradan başlaman öneriliyor/).first().waitFor();
    if (/zorundasın/.test(await sheet.textContent())) throw new Error("graph must never force the learner");
    await shot("21-graph-sheet");
    await sheet.getByRole("button", { name: "Hedef yap" }).click();
    await page.getByText("Hedeflerine eklendi.").waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("heading", { name: "Hedeflerin" }).waitFor();
  });

  await step("knowledge graph: paths, mappings and validator views", async () => {
    await page.getByRole("tab", { name: "Yollar" }).click();
    await click("Hesaplamalı Nörobilim");
    await page.getByText("Bu ayrı bir müfredat değil").waitFor();
    await page.getByRole("tab", { name: "Eşlemeler" }).click();
    await page.getByRole("button", { name: /AP Calculus AB\/BC/ }).click();
    await page.getByText("Doğrulanmış").first().waitFor();
    await page.getByRole("tab", { name: "Doğrulama" }).click();
    await page.getByText("Grafik döngüsüz").waitFor();
    await shot("22-graph-validator");
  });

  await step("knowledge graph: update is previewed as a plan before it is applied", async () => {
    await page.getByRole("tab", { name: "Sürüm" }).click();
    await page.locator("textarea").fill(JSON.stringify({ version: "2.1.1", summary: "Duman testi", objects: [{ id: "math.calc.limits", entryQuestions: ["0/0 her zaman tanımsız mıdır? Bir örnekle sına."] }], remove: ["math.calc.ftc"] }));
    await click("Farkları göster");
    await page.getByText("Silme yapılmaz", { exact: false }).waitFor();
    await page.locator("textarea").fill(JSON.stringify({ version: "2.1.1", summary: "Duman testi", objects: [{ id: "math.calc.limits", entryQuestions: ["0/0 her zaman tanımsız mıdır? Bir örnekle sına."] }] }));
    await click("Farkları göster");
    await page.getByText(/^Geçiş planı ·/).waitFor();
    await click("Planı uygula");
    await page.getByText("Grafik 2.1.1 sürümüne güncellendi.").waitFor();
    await page.getByText(/Lab Müfredatı v2\.1\.1/).first().waitFor();
  });

  await step("knowledge graph: study an object creates a course of micro-milestones", async () => {
    await page.getByRole("tab", { name: "Bağlam" }).click();
    await page.getByLabel("Grafikte ara").fill("Almanca");
    await page.getByRole("button", { name: /A1: Telaffuz/ }).first().click();
    const sheet = page.getByRole("dialog");
    await sheet.getByRole("button", { name: "Bunu çalış" }).click();
    await page.getByRole("tab", { name: "Sırada ne var" }).waitFor();
    await page.getByText(/A1: Telaffuz/).first().waitFor();
  });

  await step("builder looks in the graph before creating an isolated course", async () => {
    await page.goto(`${BASE}#/build`);
    await page.getByLabel("Neyde ustalaşmak istiyorsun?").fill("Hesaplamalı nörobilim öğrenmek istiyorum");
    await page.getByText("Bilgi grafiğinde zaten var").waitFor();
    await page.getByText(/öğrenme yolu bu isteği karşılıyor/).waitFor();
    await shot("23-builder-graph-check");
  });

  await step("knowledge map: atlas of fields, a field, an object's neighbourhood", async () => {
    await page.goto(`${BASE}#/graph?view=harita`);
    await page.getByRole("img", { name: "Bilgi haritası" }).waitFor();
    await page.getByRole("button", { name: /^Nörobilim \(/ }).click();
    await page.getByRole("button", { name: "Zihin haritası" }).waitFor();
    await page.getByRole("button", { name: "Hodgkin–Huxley modeli" }).first().click();
    await page.getByText("Haritayı oraya taşımak için").waitFor();
    await shot("24-graph-map");
  });

  await step("object tools: mind map, flashcards with review, ask AI offline, explain and self-assess", async () => {
    await page.goto(`${BASE}#/graph?lo=phys.mech.newton`);
    const sheet = page.getByRole("dialog");
    await sheet.getByRole("tab", { name: "Zihin haritası" }).click();
    await sheet.getByRole("img", { name: /Zihin haritası:/ }).waitFor();
    await shot("25-mind-map");
    await sheet.getByRole("tab", { name: /^Kartlar/ }).click();
    await sheet.getByRole("button", { name: "Grafikten kart yap" }).click();
    await page.getByText(/kart eklendi/).first().waitFor();
    await sheet.getByRole("button", { name: /kartı tekrar et/ }).click();
    await sheet.getByRole("button", { name: "Cevabı göster" }).click();
    await sheet.getByRole("button", { name: /^İyi/ }).click();
    await sheet.getByText(/kaldı/).waitFor();
    await shot("26-flashcard");
    await sheet.getByRole("tab", { name: "YZ'ye sor" }).click();
    await sheet.getByLabel("Sorun").fill("Serbest cisim diyagramı neden önemli?");
    await sheet.getByRole("button", { name: "Sor", exact: true }).click();
    await sheet.getByText(/Bilgi grafiğinden çevrimdışı yanıt/).waitFor();
    await sheet.getByRole("tab", { name: "Anlat" }).click();
    await sheet.getByLabel("Anlatımın").fill("Newton'un ikinci yasası net kuvvetin kütle çarpı ivmeye eşit olduğunu söyler. Önce cismi yalıtır, serbest cisim diyagramında tüm kuvvetleri çizerim; sonra eksen seçip bileşenleri toplarım. Sık hata: normal kuvveti her zaman ağırlığa eşit sanmak.");
    await sheet.getByRole("button", { name: "Kaydet ve değerlendir" }).click();
    await page.getByText(/Kaydedildi/).first().waitFor();
    await sheet.locator("input[type=checkbox]").first().check();
    await sheet.getByText(/% · kendi/).first().waitFor();
    await shot("27-explain");
    await page.keyboard.press("Escape");
  });

  await step("study page: review queue, cards and exports", async () => {
    await page.goto(`${BASE}#/study`);
    await page.getByRole("heading", { name: "Öğrendiğini kalıcı yap" }).waitFor();
    await page.getByRole("tab", { name: "Kartlar" }).click();
    await page.getByText(/sonraki/).first().waitFor();
    await page.getByRole("tab", { name: "Anlatımlar" }).click();
    await page.getByText(/Newton yasaları/).first().waitFor();
    await page.getByRole("tab", { name: "Dışa aktar" }).click();
    await page.getByRole("button", { name: "Anki için kartlar (.txt)" }).waitFor();
    await shot("28-study");
  });

  await step("switching language translates the interface and untouched built-in courses", async () => {
    await page.goto(`${BASE}#/settings`);
    await page.getByRole("button", { name: "English" }).first().click();
    await page.getByRole("heading", { name: "Settings" }).waitFor();
    await page.goto(`${BASE}#/`);
    await page.getByRole("heading", { name: "What's next?" }).waitFor();
    await page.getByText("Mechanics — Physics Olympiad Track").first().waitFor();
    await shot("29-english-home");
    await page.goto(`${BASE}#/graph?lo=neuro.comp.hh-model`);
    await page.getByRole("dialog", { name: "Hodgkin–Huxley model" }).waitFor();
    await page.keyboard.press("Escape");
    await page.goto(`${BASE}#/settings`);
    await page.getByRole("button", { name: "Türkçe" }).first().click();
    await page.getByRole("heading", { name: "Ayarlar" }).waitFor();
  });

  await step("study calendar: topics by date, streak and daily reminders", async () => {
    await page.context().grantPermissions(["notifications"]);
    await page.goto(`${BASE}#/study`);
    await page.getByRole("tab", { name: "Takvim" }).click();
    await page.getByRole("grid", { name: "Çalışma takvimi" }).waitFor();
    await page.getByText("Seri").waitFor();
    await page.getByRole("button", { name: /Newton yasaları/ }).first().waitFor();
    await shot("30-calendar");
    await page.getByRole("tab", { name: /^Konular/ }).click();
    await page.getByText(/Hatırlatmalar ·/).click();
    await page.getByLabel("Günlük tekrar hatırlatması").check();
    await page.getByText(/Hatırlatmalar açık/).waitFor();
    await page.getByLabel("Hatırlatma saati").fill("20:30");
    await page.getByText("Hatırlatmalar · 20:30").waitFor();
  });

  await step("topic spaced repetition: studied topics come back days later and move along the ladder", async () => {
    await page.clock.install({ time: new Date(Date.now() + 4 * 86_400_000) });
    await page.goto(`${BASE}#/study`);
    await page.reload();
    await page.getByRole("button", { name: /konuyu tekrar et/ }).click();
    for (let i = 0; i < 30; i++) {
      if (await page.getByText(/Bitti — \d+ konu tekrar edildi/).isVisible().catch(() => false)) break;
      await page.getByRole("button", { name: "Grafikle karşılaştır" }).click();
      if (i === 0) await shot("31-topic-review");
      await page.getByRole("button", { name: /^İyi/ }).click();
    }
    await page.getByText(/Bitti — \d+ konu tekrar edildi/).waitFor();
    await page.getByRole("tab", { name: "Takvim" }).click();
    await page.getByText("Yaklaşan tekrarlar").waitFor();
  });

  await step("exams: add a school exam with topics, see readiness, the plan and today's suggestions", async () => {
    await page.goto(`${BASE}#/study?tab=exams`);
    await page.getByRole("button", { name: "Sınav ya da teslim ekle" }).click();
    const dlg = page.getByRole("dialog", { name: "Yeni sınav" });
    await dlg.getByLabel("Ders", { exact: true }).fill("Fizik");
    await dlg.getByLabel("Başlık", { exact: true }).fill("1. yazılı — Newton yasaları");
    await dlg.getByRole("button", { name: /Newton yasaları ve serbest cisim/ }).first().click();
    await dlg.getByLabel("Konu ara").fill("momentum");
    await dlg.getByRole("button", { name: /[Mm]omentum/ }).first().click();
    await dlg.getByText(/Kapsadığı konular \(2\)/).waitFor();
    await shot("32-exam-editor");
    await dlg.getByRole("button", { name: "Sınavı ekle" }).click();
    await page.getByText(/Sınav eklendi/).waitFor();
    await page.getByRole("button", { name: /Fizik · 1\. yazılı/ }).click();
    const det = page.getByRole("dialog", { name: /Fizik · 1\. yazılı/ });
    await det.getByRole("heading", { name: "Çalışma planı" }).waitFor();
    await det.getByText("Bugün", { exact: true }).waitFor();
    await det.getByText("Kendini sına").first().waitFor();
    await shot("33-exam-plan");
    await det.getByRole("button", { name: "Zayıf konular için kart yap" }).click();
    await page.getByText(/kart eklendi/).waitFor();
    await page.keyboard.press("Escape");
    await page.goto(`${BASE}#/`);
    await page.getByText(/Sıradaki sınav/).waitFor();
    await page.getByText("Bugün, sınavların için").waitFor();
    await shot("34-home-exam");
  });

  await step("unknown and stale routes degrade gracefully", async () => {
    for (const r of ["#/nonsense", "#/course/missing", "#/session/missing", "#/summary/missing"]) {
      await page.goto(`${BASE}${r}`);
      await page.waitForTimeout(150);
      const body = await page.textContent("body");
      if (!/Sırada ne var\?|bulunamadı|artık yok/i.test(body)) throw new Error(`route ${r} rendered nothing useful`);
    }
  });

  await step("integrity check passes in the real app", async () => {
    await page.goto(`${BASE}#/settings`);
    await click("Bütünlüğü kontrol et");
    await page.getByText("Bütünlük kontrolü geçti").waitFor();
  });

  for (const [w, h, label] of [[390, 844, "phone"], [1180, 820, "tablet-landscape"], [820, 1180, "tablet-portrait"]]) {
    await step(`no horizontal overflow at ${label} (${w}px)`, async () => {
      await page.setViewportSize({ width: w, height: h });
      for (const r of ["#/", "#/graph", "#/graph?view=harita", "#/study", "#/study?tab=exams", "#/stats", "#/focus", "#/retention", "#/settings", "#/build"]) {
        await page.goto(`${BASE}${r}`);
        await page.waitForTimeout(250);
        const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (over > 1) throw new Error(`${r} overflows by ${over}px`);
      }
      await page.goto(`${BASE}#/`);
      await page.getByRole("button", { name: /Mekanik/ }).first().click();
      await page.getByRole("tab", { name: "Harita" }).click();
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (over > 1) throw new Error(`map overflows the page by ${over}px`);
      await shot(`20-${label}`);
    });
  }
  await page.setViewportSize({ width: 820, height: 1180 });

  if (globalThis.SMOKE_EXTRA) await globalThis.SMOKE_EXTRA({ page, step, shot, click, BASE });
}
