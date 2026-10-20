import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";

test("resources remains public and retired article URLs redirect to current content", () => {
  const redirects = readFileSync(new URL("../public/_redirects", import.meta.url), "utf8");
  const releasePreparation = readFileSync(new URL("./prepare-release.mjs", import.meta.url), "utf8");

  assert.match(redirects, /^\/blog\/ai-security-checklist\.html\s+\/blog\/top-10-ai-security-risks-2026\.html\s+301$/m);
  assert.match(redirects, /^\/blog\/owasp-top-10-explained\.html\s+\/security-hub\/guides\s+301$/m);
  assert.match(redirects, /^\/blog\/would-your-company-survive-ransomware-attack\.html\s+\/resources\s+301$/m);
  assert.doesNotMatch(releasePreparation, /rmSync\('dist\/_redirects'/);
  assert.doesNotMatch(releasePreparation, /\.\.\/frontend/);
  assert.equal(existsSync(new URL("../src/pages/resources/index.astro", import.meta.url)), true);
});
