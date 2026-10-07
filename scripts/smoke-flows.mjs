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

  await step("end session", async () => {
    await click("End session");
    await page.getByText("Session saved").waitFor();
  });

  if (globalThis.SMOKE_EXTRA) await globalThis.SMOKE_EXTRA({ page, step, shot, click, BASE });
}
