import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";

test("release build retains the legacy /resources permanent redirect without emitting its page", () => {
  const redirects = readFileSync(new URL("../public/_redirects", import.meta.url), "utf8");
  const releasePreparation = readFileSync(new URL("./prepare-release.mjs", import.meta.url), "utf8");

  assert.match(redirects, /^\/resources\s+\/security-hub\s+301$/m);
  assert.doesNotMatch(releasePreparation, /rmSync\('dist\/_redirects'/);
  assert.equal(existsSync(new URL("../src/pages/resources/index.astro", import.meta.url)), false);
});
