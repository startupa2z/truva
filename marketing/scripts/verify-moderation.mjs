import { chromium } from "@playwright/test";
import { createCommunityServer } from "../server/community.mjs";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import assert from "node:assert/strict";
const temp = mkdtempSync(join(tmpdir(), "truva-ui-"));
const origin = "http://127.0.0.1:4339",
  token = "isolated-test-admin-key";
const server = createCommunityServer({
  root: resolve("dist"),
  dbPath: join(temp, "test.sqlite"),
  adminToken: token,
  origin,
});
await new Promise((r) => server.listen(4339, "127.0.0.1", r));
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage();
  const article = origin + "/blog/top-10-cspm-issues";
  await page.goto(article, { waitUntil: "networkidle" });
  await page.locator("#comment-name").fill("Test reader");
  const message =
    "Helpful checklist. <img src=x onerror=alert(1)> should stay plain text.";
  await page.locator("#comment-body").fill(message);
  await page.getByRole("button", { name: "Submit for review" }).click();
  await page.getByText("Thank you. Your comment is awaiting review.").waitFor();
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("#approved-comments article").count(), 0);
  await page.goto(origin + "/admin/community");
  await page.locator("#admin-key").fill(token);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("button", { name: "Approve", exact: true }).click();
  await page.getByRole("heading", { name: "Test reader · approved", exact: true }).waitFor();
  await page.goto(article, { waitUntil: "networkidle" });
  assert.equal(
    await page.locator("#approved-comments article p").innerText(),
    message,
  );
  assert.equal(await page.locator("#approved-comments img").count(), 0);
  console.log(
    "Isolated browser flow passed: submit, pending visibility, approval, public display, and HTML rendered as text.",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
  rmSync(temp, { recursive: true, force: true });
}
