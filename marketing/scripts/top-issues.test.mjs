import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const article = readFileSync(new URL("../src/data/ai-security-article.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(article, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { risks } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

test("AI issue list contains ten distinct issues with authoritative HTTPS references", () => {
  assert.equal(risks.length, 10);
  assert.equal(new Set(risks.map((risk) => risk.id)).size, 10);
  for (const risk of risks) {
    assert.ok(risk.short && risk.source.name);
    const url = new URL(risk.source.url);
    assert.equal(url.protocol, "https:");
    assert.match(url.hostname, /(^|\.)(owasp\.org|nist\.gov)$/);
  }
});

test("Hub reuses the guide, labels curation and links directly to references", () => {
  const data = readFileSync(new URL("../src/data/top-issues.ts", import.meta.url), "utf8");
  const component = readFileSync(new URL("../src/components/TopIssues.astro", import.meta.url), "utf8");
  assert.match(data, /aiTopIssueLinks = risks\.map/);
  assert.match(data, /not an (?:official )?OWASP ranking/);
  assert.match(component, /href=\{issue\.url\}/);
  assert.match(component, /<small>\{issue\.sourceName\}<\/small>/);
});

test("LLM and cloud guides each provide ten distinct issue links", async () => {
  const source = readFileSync(new URL("../src/data/security-series.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  const { series } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
  for (const guide of series) {
    assert.equal(guide.items.length, 10);
    assert.equal(new Set(guide.items.map((item) => item.title)).size, 10);
    for (const item of guide.items) assert.equal(new URL(item.source).protocol, "https:");
  }
});
