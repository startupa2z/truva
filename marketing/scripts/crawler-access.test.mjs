import assert from "node:assert/strict";
import test from "node:test";
import { crawlerAgents, robotsTxt } from "./crawler-policy.mjs";

function rulesFor(text, agent) {
  const lines = text.split(/\r?\n/);
  const start = lines.indexOf(`User-agent: ${agent}`);
  assert.notEqual(start, -1, `missing ${agent} policy`);
  const ruleLines = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (
      lines[index].startsWith("User-agent:") ||
      lines[index].startsWith("Sitemap:")
    )
      break;
    if (/^(Allow|Disallow):/.test(lines[index])) ruleLines.push(lines[index]);
  }
  return ruleLines;
}

test("release robots policy explicitly allows public crawler access", () => {
  for (const agent of crawlerAgents) {
    const rules = rulesFor(robotsTxt, agent);
    assert.deepEqual(rules, [
      "Allow: /",
      "Disallow: /admin/",
      "Disallow: /api/",
    ]);
  }
  assert.match(
    robotsTxt,
    /User-agent: \*\nAllow: \/\nDisallow: \/admin\/\nDisallow: \/api\//,
  );
  assert.match(
    robotsTxt,
    /Sitemap: https:\/\/truvasolutions\.com\/sitemap\.xml/,
  );
});
