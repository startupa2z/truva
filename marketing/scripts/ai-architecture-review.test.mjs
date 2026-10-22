import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

test("AI architecture review is listed in Security Hub guides with a local detail route", () => {
  const insights = read("src/data/insights.ts");
  const guides = read("src/pages/security-hub/guides.astro");
  const article = read(
    "src/pages/security-hub/ai-security-architecture-review.astro",
  );

  assert.match(insights, /Review AI Security Architecture Before It Hardens/);
  assert.match(insights, /\/security-hub\/ai-security-architecture-review/);
  assert.match(guides, /insights(?:\.filter\([\s\S]*?\))?\.map/);
  assert.match(article, /Truva recommended review questions/);
  assert.match(article, /Cost of a Data Breach Report 2025/);
  for (const url of [
    "https://www.cisa.gov/resources-tools/resources/shifting-balance-cybersecurity-risk-principles-and-approaches-secure-design-software",
    "https://www.cisa.gov/resources-tools/resources/secure-demand-guide",
    "https://csrc.nist.gov/pubs/sp/800/218/final",
    "https://csrc.nist.gov/pubs/sp/800/218/a/final",
    "https://doi.org/10.6028/NIST.AI.600-1",
    "https://www.enisa.europa.eu/publications/artificial-intelligence-cybersecurity-challenges",
    "https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/",
    "https://www.verizon.com/about/news/2025-data-breach-investigations-report",
    "https://de.newsroom.ibm.com/2025-07-30-IBM-Studie-Kosten-von-Datenlecks-sinken-in-Deutschland-erstmals-seit-funf-Jahren",
  ]) {
    assert.ok(article.includes(url), `missing source URL: ${url}`);
  }
});
