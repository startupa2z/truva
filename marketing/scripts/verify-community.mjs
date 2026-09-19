import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4321";
try {
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 950 },
      extraHTTPHeaders: { DNT: "1" },
    });
    const page = await context.newPage();
    for (const slug of [
      "top-10-cspm-issues",
      "top-10-ai-security-risks-2026.html",
      "top-10-llm-security-issues",
    ]) {
      await page.goto(base + "/blog/" + slug, { waitUntil: "networkidle" });
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator("#comment-form").isVisible(), true);
      assert.match(
        await page.locator("[data-blog-views]").innerText(),
        /page views/,
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.ok(
        await page
          .locator(".top-ten-graphic img[fetchpriority=\"high\"]")
          .evaluate((img) => img.complete && img.naturalWidth > 0),
      );
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        audit.violations.map((v) => ({ id: v.id, impact: v.impact })),
        [],
      );
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: "artifacts/" + slug + "-" + width + ".png",
          fullPage: false,
        });
    }
    await context.close();
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(base + "/admin/community");
  await page
    .locator("#admin-key")
    .fill(readFileSync(process.env.ADMIN_KEY_FILE || ".local/admin-key.txt", "utf8").trim());
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.locator("#views-total").waitFor({ state: "visible" });
  assert.ok(await page.locator("#admin-panel").isVisible());
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.locator("#admin-login").waitFor({ state: "visible" });
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const plain = await nojs.newPage();
  await plain.goto(base + "/blog/top-10-cspm-issues");
  assert.equal(await plain.locator("#comment-form").isVisible(), false);
  assert.equal(await plain.locator(".series-risk").count(), 10);
  console.log(
    "Three blogs pass at 320, 390, 1440px; images, counts, accessibility, admin login/logout, and no-JS reading verified.",
  );
} finally {
  await browser.close();
}
