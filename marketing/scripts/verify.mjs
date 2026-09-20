import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("artifacts", { recursive: true });
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4321";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const report = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const viewportContext = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await viewportContext.newPage();
    const errors = [];
    const external = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (!r.url().startsWith(base)) external.push(r.url());
    });
    const response = await page.goto(base, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("h1").count(), 1);
    const result = await page.evaluate(() => {
      const html = document.documentElement;
      const badAnchors = [...document.querySelectorAll('a[href^="#"]')]
        .filter(
          (a) => !document.getElementById(a.getAttribute("href").slice(1)),
        )
        .map((a) => a.getAttribute("href"));
      const missingImages = [...document.images]
        .filter(
          (img) =>
            !img.complete ||
            img.naturalWidth === 0 ||
            !img.width ||
            !img.height,
        )
        .map((img) => img.src);
      return {
        width: innerWidth,
        scrollWidth: html.scrollWidth,
        badAnchors,
        missingImages,
        font: getComputedStyle(document.body).fontFamily,
        title: document.title,
        description: document.querySelector('meta[name="description"]').content,
        robots: document.querySelector('meta[name="robots"]').content,
        canonical: document.querySelector('link[rel="canonical"]').href,
        schema: JSON.parse(
          document.querySelector('script[type="application/ld+json"]')
            .textContent,
        ),
      };
    });
    assert.ok(
      result.scrollWidth <= width,
      `Overflow at ${width}: ${result.scrollWidth}`,
    );
    assert.deepEqual(result.badAnchors, []);
    assert.deepEqual(result.missingImages, []);
    assert.ok(result.font.startsWith("Arial"));
    assert.ok(result.title.length < 60);
    assert.ok(result.description.length < 155);
    assert.match(result.robots, process.env.RELEASE_TEST ? /^index/ : /noindex/);
    assert.equal(result.canonical, "https://truvasolutions.com/");
    assert.equal(result.schema["@graph"].length, 2);
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(":focus").innerText(), "Skip to content");
    const nav = width < 768 ? ".mobile-nav" : ".desktop-nav";
    if (width < 768) await page.locator(".mobile-nav > summary").click();
    await page.locator(`${nav} a[href="/security-hub"]`).click();
    assert.equal(new URL(page.url()).pathname, "/security-hub");
    if (width < 768) await page.locator(".mobile-nav > summary").click();
    await page
      .locator(`${nav} .services-menu > summary`)
      .filter({ hasText: "Services" })
      .click();
    await page.locator(`${nav} .compliance-menu > summary`).click();
    await page.locator(`${nav} a[href="/services#iso-42001"]`).click();
    assert.equal(new URL(page.url()).hash, "#iso-42001");
    assert.equal(await page.locator("#iso-42001 h3").innerText(), "ISO 42001");
    assert.match(new URL(page.url()).pathname, /services/);
    assert.equal(await page.locator(".service-card").count(), 6);
    if (width < 768) await page.locator(".mobile-nav > summary").click();
    await page.locator(`${nav} a[href="/"]`).click();
    assert.equal(new URL(page.url()).pathname, "/");
    assert.equal(
      await page.locator("#products, .hero-meta, #services").count(),
      0,
    );
    assert.equal(
      await page.locator(".header-inner > .button").getAttribute("href"),
      "https://calendly.com/satish-truvasolutions/30min",
    );
    await page.goto(base, { waitUntil: "networkidle" });
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    await writeFile(
      `artifacts/axe-${width}.json`,
      JSON.stringify(accessibility.violations, null, 2),
    );
    assert.deepEqual(
      accessibility.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        elements: v.nodes.map((n) => n.target),
      })),
      [],
      `Accessibility violations at ${width}`,
    );
    await page.screenshot({
      path: `artifacts/home-${width}.png`,
      fullPage: true,
    });
    if (width === 1440)
      await page.screenshot({ path: "artifacts/desktop-hero.png" });
    if (width === 390)
      await page.screenshot({ path: "artifacts/mobile-hero.png" });
    assert.deepEqual(errors, []);
    assert.deepEqual(
      external,
      [],
      "Unexpected third-party resources in preview",
    );
    report.push({
      width,
      status: "passed",
      accessibilityViolations: 0,
      externalRequests: 0,
    });
    await viewportContext.close();
  }
  for (const width of [390, 1440]) {
    const routeContext = await browser.newContext({
      viewport: { width, height: 1000 },
    });
    const page = await routeContext.newPage();
    for (const route of [
      "services",
      "security-hub",
      "security-hub/guides",
    ]) {
      const response = await page.goto(`${base}/${route}`, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator("h1").count(), 1);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      const a11y = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        a11y.violations.map((v) => v.id),
        [],
        `${route} at ${width}`,
      );
      await page.screenshot({
        path: `artifacts/${route.replaceAll("/", "-")}-${width}.png`,
        fullPage: true,
      });
    }
    await routeContext.close();
  }
  const reviewContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await reviewContext.newPage();
  await page.goto(`${base}/${process.env.RELEASE_TEST ? "privacy" : "design-system"}`, { waitUntil: "networkidle" });
  const review = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    review.violations.map((v) => v.id),
    [],
  );
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noJs = await context.newPage();
  await noJs.goto(base);
  await noJs.locator(".mobile-nav > summary").click();
  assert.equal(await noJs.locator(".mobile-nav nav").isVisible(), true);
  assert.ok(await noJs.locator("h1").isVisible());
  report.push({
    noJavaScriptNavigation: "passed",
    designSystemAccessibility: "passed",
  });
  await writeFile(
    "artifacts/verification.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
