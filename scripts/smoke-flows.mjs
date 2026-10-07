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

  if (globalThis.SMOKE_EXTRA) await globalThis.SMOKE_EXTRA({ page, step, shot, click, BASE });
}
