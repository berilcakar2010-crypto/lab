/** User flows exercised by scripts/smoke.mjs. Each phase adds to this file. */
export default async function flows({ page, step, shot, click, BASE }) {
  await step("home renders with empty state", async () => {
    await page.goto(BASE);
    await page.getByRole("heading", { name: "What's next?" }).waitFor();
    await shot("01-home-empty");
  });

  await step("build Calculus 1 offline and accept", async () => {
    await click("New course");
    await page.getByLabel("What do you want to master?").fill("Calculus 1");
    await click("Build curriculum");
    await page.getByRole("heading", { name: "Calculus 1" }).waitFor();
    await shot("02-draft");
    await click("Accept and find my starting point");
    await page.getByRole("dialog", { name: "Find your starting point" }).waitFor();
  });

  await step("calibrate with a diagnostic", async () => {
    await click("Confident");
    await page.getByRole("button", { name: /quick diagnostic/ }).click();
    // Answer first diagnostic with "I don't know yet", then accept the rest the same way.
    for (let i = 0; i < 6; i++) {
      const btn = page.getByRole("button", { name: "I don't know yet" });
      if (!(await btn.isVisible().catch(() => false))) break;
      await btn.click();
    }
    await page.getByText("Start here").first().waitFor();
    await shot("03-calibration");
    await click("Use this starting point");
  });

  await step("what's next lists recommendations with reasons", async () => {
    await page.getByRole("tab", { name: "What's next" }).waitFor();
    await page.getByText("suggested").first().waitFor();
    await shot("04-next");
  });

  await step("data persists across a reload (IndexedDB)", async () => {
    await page.waitForTimeout(600);
    await page.reload();
    await page.getByRole("heading", { name: "Calculus 1" }).waitFor();
    const backend = await page.evaluate(() => new Promise((resolve) => {
      const req = indexedDB.open("lab");
      req.onsuccess = () => resolve(req.result.objectStoreNames.contains("kv"));
      req.onerror = () => resolve(false);
    }));
    if (!backend) throw new Error("IndexedDB store missing");
  });

  await step("curriculum editor: open, edit and save a milestone", async () => {
    await page.getByRole("tab", { name: "Curriculum" }).click();
    await page.getByRole("button", { name: /Estimate a limit/ }).first().click();
    await page.getByRole("dialog", { name: "Edit milestone" }).waitFor();
    await page.getByLabel("Title").first().fill("Estimate a limit from a graph or table");
    await click("Save changes");
    await page.getByRole("button", { name: /Estimate a limit from a graph or table/ }).first().waitFor();
    await shot("05-editor");
  });

  await step("curriculum editor: merge two milestones", async () => {
    const boxes = page.getByRole("checkbox", { name: /^Select / });
    await boxes.nth(2).check();
    await boxes.nth(3).check();
    await click("Merge");
    await page.getByText(/Merged 2 milestones/).waitFor();
  });

  await step("curriculum editor: split a milestone (offline)", async () => {
    await page.getByRole("button", { name: /Solve optimisation problems/ }).first().click();
    await click("Split…");
    await page.getByRole("dialog", { name: "Split milestone" }).waitFor();
    await click("Split", { exact: true });
    await page.getByText(/Split into/).waitFor();
  });

  await step("map tab renders", async () => {
    await page.getByRole("tab", { name: "Map" }).click();
    await shot("06-map");
  });

  await step("build Mechanics and open the first recommendation", async () => {
    await page.goto(`${BASE}#/build`);
    await page.getByLabel("What do you want to master?").fill("TÜBİTAK Fizik Olimpiyatı Mekanik");
    await click("Build curriculum");
    await click("Accept and find my starting point");
    await page.getByRole("button", { name: "Close" }).click();
    await page.getByText("suggested").first().click();
    await page.getByText("After this, you can").waitFor();
    await shot("07-session");
  });

  await step("session: wrong answer → feedback → hint → retry → correct", async () => {
    await page.getByLabel("Numeric answer").fill("5");
    await click("Check");
    await page.getByText("Not yet", { exact: true }).waitFor();
    await shot("08-feedback");
    await click("Try again");
    await page.getByRole("button", { name: /Small hint/ }).click();
    await page.getByText("Draw the vector").waitFor();
    await page.getByLabel("Numeric answer").fill("8.66");
    await click("Check");
    await page.getByText("Correct", { exact: true }).waitFor();
    await click("Next");
  });

  await step("session: second answer reaches mastery and shows progress + next options", async () => {
    await page.getByLabel("Numeric answer").fill("-19.97 m/s");
    await click("Check");
    await click("Milestone mastered — continue");
    await page.getByText("Mastered", { exact: true }).waitFor();
    await page.getByRole("heading", { name: "What's next?" }).waitFor();
    await page.getByText("Unlocked").waitFor();
    await page.waitForTimeout(1200);
    await shot("09-complete");
  });

  await step("immediate retention check after mastery", async () => {
    await click("Check now");
    await page.getByText("Retention check · numeric").waitFor();
    await page.getByLabel("Numeric answer").fill("10.39");
    await click("Check");
    await page.getByText("Immediate check passed").waitFor();
  });

  await step("continue to the next milestone", async () => {
    await page.getByText("suggested").first().click();
    await page.getByText("After this, you can").waitFor();
  });

  await step("locked milestone can be opened with an explicit override", async () => {
    await page.goto(`${BASE}#/`);
    await page.getByRole("button", { name: /Mechanics/ }).first().click();
    await page.getByRole("tab", { name: "Map" }).click();
    await page.getByRole("button", { name: /Construct a free-body diagram/ }).first().click();
    await shot("11-map-sheet");
    await click("Look inside");
    await page.getByText("This builds on milestones you haven't completed yet:").waitFor();
    await click("Open anyway");
    await page.getByText("After this, you can").waitFor();
  });

  await step("stylus drawing with pressure and rubric self-assessment", async () => {
    await page.getByRole("img", { name: "Draw your answer" }).waitFor();
    await page.evaluate(() => {
      const c = document.querySelector('canvas[aria-label="Draw your answer"]');
      const r = c.getBoundingClientRect();
      const fire = (type, x, y) => c.dispatchEvent(new PointerEvent(type, { pointerType: "pen", pointerId: 7, clientX: r.left + x, clientY: r.top + y, pressure: 0.7, bubbles: true, isPrimary: true }));
      fire("pointerdown", 100, 100);
      for (let i = 1; i < 20; i++) fire("pointermove", 100 + i * 5, 100 + i * 3);
      fire("pointerup", 200, 160);
      // A palm touch after the pen must be ignored.
      c.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "touch", pointerId: 9, clientX: r.left + 300, clientY: r.top + 300, bubbles: true }));
      c.dispatchEvent(new PointerEvent("pointerup", { pointerType: "touch", pointerId: 9, clientX: r.left + 300, clientY: r.top + 300, bubbles: true }));
    });
    await page.getByText("pen detected, palm rejection on").waitFor();
    await click("Check");
    await page.getByText("Evaluate against the rubric").waitFor();
    const boxes = page.locator('label:has(input[type=checkbox])');
    for (let i = 0; i < 4; i++) await boxes.nth(i).locator("input").check();
    await shot("10-rubric");
    await click("Confirm");
    await page.getByText("self-assessed").waitFor();
  });

  await step("offline guide asks a question without giving the answer", async () => {
    await page.goto(`${BASE}#/`);
    await page.getByRole("button", { name: /Mechanics/ }).first().click();
    await page.getByRole("button", { name: /Add vectors by components/ }).first().click();
    await page.getByLabel("Numeric answer").fill("1");
    await click("Check");
    await page.getByRole("button", { name: /Guide/ }).click();
    await click("Ask me a guiding question");
    await page.getByText("What is the question really asking for").waitFor();
    await click("Why was it wrong?");
    await page.getByText("Why it might be wrong (offline)").waitFor();
    await shot("12-guide");
  });

  await step("end session shows a summary and returns to what's next", async () => {
    await click("End session");
    await page.getByText("Session complete").waitFor();
    await page.getByRole("heading", { name: "Reflection" }).waitFor();
    await page.getByRole("heading", { name: "What's next?" }).waitFor();
    await shot("18-summary");
  });

  await step("home shows objective, progress, next actions and recent progress", async () => {
    await page.goto(`${BASE}#/`);
    await page.getByRole("heading", { name: "What's next?" }).waitFor();
    await page.getByRole("heading", { name: "Recent progress" }).waitFor();
    await page.getByRole("heading", { name: "Courses" }).waitFor();
    await shot("19-home");
  });

  await step("statistics render from events with insufficient-data states", async () => {
    await page.goto(`${BASE}#/stats`);
    await page.getByRole("heading", { name: "Statistics" }).waitFor();
    await page.getByText("Engagement is not evidence of learning").waitFor();
    await page.getByText("Not enough data").first().waitFor();
    await page.getByRole("button", { name: "Stylus", exact: true }).click();
    await shot("14-stats");
  });

  await step("focus lab shows hypothesis and refuses to over-claim", async () => {
    await page.goto(`${BASE}#/focus`);
    await page.getByRole("heading", { name: "What seems to help you?" }).waitFor();
    await page.getByText(/Insufficient data|No clear patterns yet/).first().waitFor();
    await shot("15-focus");
  });

  await step("retention page shows schedule and learned-vs-done", async () => {
    await page.goto(`${BASE}#/retention`);
    await page.getByRole("heading", { name: "Did it stick?" }).waitFor();
    await page.getByText("Coming up").waitFor();
    await shot("16-retention");
  });

  await step("start a personal experiment", async () => {
    await page.goto(`${BASE}#/focus`);
    await click("New experiment");
    await page.getByRole("button", { name: /Long tasks vs micro-milestones/ }).click();
    await page.getByText("Running", { exact: true }).waitFor();
    await page.getByText(/Too early to compare/).waitFor();
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
    await page.getByLabel("Groq API key").fill("test-key");
    await click("Save keys");
    await page.goto(`${BASE}#/build`);
    await page.getByLabel("What do you want to master?").fill("Theoretical Neuroscience");
    await click("Build curriculum");
    await page.getByText("Generated by AI").waitFor();
    await page.getByText("Simulate a leaky integrate-and-fire neuron").waitFor();
    await shot("13-ai-draft");
  });

  await step("swap to Gemini: provider failure falls back to the offline builder", async () => {
    await page.route("https://generativelanguage.googleapis.com/**", (route) => route.fulfill({ status: 503, body: "overloaded" }));
    await page.goto(`${BASE}#/settings`);
    await page.getByRole("button", { name: "Gemini", exact: true }).click();
    await page.getByLabel("Gemini API key").fill("test-key");
    await click("Save keys");
    await page.goto(`${BASE}#/build`);
    await page.getByLabel("What do you want to master?").fill("Calculus 1");
    await click("Build curriculum");
    await page.getByText(/The AI provider failed/).waitFor();
    await page.goto(`${BASE}#/settings`);
    await page.getByText("AI activity").waitFor();
    await page.getByRole("button", { name: "Offline", exact: true }).click();
  });

  await step("boss milestone: open via the map with an override and solve an equation", async () => {
    await page.goto(`${BASE}#/`);
    await page.getByRole("button", { name: /Mechanics/ }).first().click();
    await page.getByRole("tab", { name: "Map" }).click();
    await page.getByRole("button", { name: /loop-the-loop launcher/ }).first().click();
    await click("Look inside");
    await click("Open anyway");
    await page.getByText("Boss", { exact: true }).first().waitFor();
    await page.getByLabel("Expression answer").fill("5R/2");
    await click("Check");
    await page.getByText("Correct — equivalent to the expected expression.").waitFor();
    await shot("21-boss");
  });

  await step("unknown and stale routes degrade gracefully", async () => {
    for (const r of ["#/nonsense", "#/course/missing", "#/session/missing", "#/summary/missing"]) {
      await page.goto(`${BASE}${r}`);
      await page.waitForTimeout(150);
      const body = await page.textContent("body");
      if (!/What's next\?|not found|no longer exists/i.test(body)) throw new Error(`route ${r} rendered nothing useful`);
    }
  });

  await step("integrity check passes in the real app", async () => {
    await page.goto(`${BASE}#/settings`);
    await click("Check integrity");
    await page.getByText("Integrity check passed").waitFor();
  });

  for (const [w, h, label] of [[390, 844, "phone"], [1180, 820, "tablet-landscape"], [820, 1180, "tablet-portrait"]]) {
    await step(`no horizontal overflow at ${label} (${w}px)`, async () => {
      await page.setViewportSize({ width: w, height: h });
      for (const r of ["#/", "#/stats", "#/focus", "#/retention", "#/settings", "#/build"]) {
        await page.goto(`${BASE}${r}`);
        await page.waitForTimeout(250);
        const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (over > 1) throw new Error(`${r} overflows by ${over}px`);
      }
      await page.goto(`${BASE}#/`);
      await page.getByRole("button", { name: /Mechanics/ }).first().click();
      await page.getByRole("tab", { name: "Map" }).click();
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (over > 1) throw new Error(`map overflows the page by ${over}px`);
      await shot(`20-${label}`);
    });
  }
  await page.setViewportSize({ width: 820, height: 1180 });

  if (globalThis.SMOKE_EXTRA) await globalThis.SMOKE_EXTRA({ page, step, shot, click, BASE });
}
