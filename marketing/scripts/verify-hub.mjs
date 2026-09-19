import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto((process.env.PREVIEW_URL || "http://127.0.0.1:4321") + "/security-hub", {
      waitUntil: "networkidle",
    });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator(".guide-card:visible").count(), 4);
    await page.getByRole("button", { name: "Compliance", exact: true }).click();
    assert.equal(await page.locator(".guide-card:visible").count(), 1);
    await page.getByRole("button", { name: "All topics", exact: true }).click();
    await page.getByRole("searchbox").fill("LLM");
    assert.equal(await page.locator(".guide-card:visible").count(), 1);
    await page.getByRole("searchbox").fill("xyz-no-results");
    assert.ok(await page.locator("#no-results").isVisible());
    await page.getByRole("searchbox").fill("");
    await page.locator("[data-check=ai]").check();
    await page.reload({ waitUntil: "networkidle" });
    assert.ok(await page.locator("[data-check=ai]").isChecked());
    assert.equal(
      await page.locator("#check-progress").innerText(),
      "1 of 3 reviewed · saved in this browser",
    );
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
    );
    assert.deepEqual(errors, []);
    await page.screenshot({
      path: "artifacts/security-hub-" + width + ".png",
      fullPage: true,
    });
    console.log("Hub passed at " + width + "px");
    await context.close();
  }
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const page = await nojs.newPage();
  await page.goto((process.env.PREVIEW_URL || "http://127.0.0.1:4321") + "/security-hub");
  assert.equal(await page.locator(".guide-card:visible").count(), 4);
  assert.equal(await page.locator(".library-tools").isVisible(), false);
  console.log("No-JavaScript guides and navigation available.");
} finally {
  await browser.close();
}
