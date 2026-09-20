import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { refreshSecurityFeed } from "./security-feed.mjs";

const cisaPayload = {
  vulnerabilities: [
    {
      cveID: "CVE-2025-0001",
      vendorProject: "Example",
      product: "Widget",
      vulnerabilityName: "Example Widget vulnerability",
      dateAdded: "2025-01-02",
      shortDescription: "A known exploited vulnerability.",
      notes: "Apply updates.",
    },
  ],
};

const advisory = (overrides = {}) => ({
  ghsa_id: "GHSA-test-0001",
  summary: "Transformers arbitrary code execution",
  description: "A package issue affecting model workflows.",
  html_url: "https://github.com/advisories/GHSA-test-0001",
  published_at: "2025-01-03T12:00:00Z",
  severity: "high",
  cve_id: "CVE-2025-0002",
  vulnerabilities: [{ package: { name: "transformers" } }],
  ...overrides,
});

function response(body, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    async json() {
      return body;
    },
  };
}

async function fixture() {
  const dir = await mkdtemp(join(tmpdir(), "truva-security-feed-"));
  return { outputPath: join(dir, "security-feed.json"), dir };
}

test("refresh writes valid, deduplicated, bounded feed items newest first", async () => {
  const { outputPath } = await fixture();
  const advisories = Array.from({ length: 45 }, (_, index) =>
    advisory({
      ghsa_id: `GHSA-test-${String(index).padStart(4, "0")}`,
      published_at: `2025-02-${String((index % 27) + 1).padStart(2, "0")}T12:00:00Z`,
    }),
  );
  advisories.push(advisories[0]);
  const feed = await refreshSecurityFeed({
    outputPath,
    now: () => new Date("2025-02-28T10:00:00Z"),
    fetchImpl: async (url) =>
      response(url.includes("cisa.gov") ? cisaPayload : advisories),
  });

  assert.equal(feed.sources.every((source) => source.status === "ok"), true);
  assert.equal(feed.items.length, 40);
  assert.equal(new Set(feed.items.map((item) => item.id)).size, feed.items.length);
  assert.deepEqual(
    feed.items.map((item) => item.publishedAt),
    [...feed.items.map((item) => item.publishedAt)].sort().reverse(),
  );
  assert.equal(feed.items.some((item) => item.topic === "ai"), true);
  assert.deepEqual(JSON.parse(await readFile(outputPath, "utf8")), feed);
});

test("refresh excludes unsafe links and invalid or future dates", async () => {
  const { outputPath } = await fixture();
  const feed = await refreshSecurityFeed({
    outputPath,
    now: () => new Date("2025-02-01T00:00:00Z"),
    fetchImpl: async (url) =>
      response(
        url.includes("cisa.gov")
          ? {
              vulnerabilities: [
                { ...cisaPayload.vulnerabilities[0], dateAdded: "not-a-date" },
              ],
            }
          : [
              advisory({ html_url: "http://example.test/advisory" }),
              advisory({ ghsa_id: "GHSA-future", published_at: "2025-03-01T00:00:00Z" }),
              advisory({ ghsa_id: "GHSA-invalid", published_at: "not-a-date" }),
            ],
      ),
  });

  assert.deepEqual(feed.items, []);
});

test("a failed source preserves only its last-good items and freshness metadata", async () => {
  const { outputPath } = await fixture();
  const previous = {
    fetchedAt: "2025-01-05T00:00:00.000Z",
    sources: [
      {
        id: "cisa-kev",
        name: "CISA KEV",
        url: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
        status: "ok",
        checkedAt: "2025-01-05T00:00:00.000Z",
        lastSuccessAt: "2025-01-05T00:00:00.000Z",
      },
      {
        id: "github-advisories",
        name: "GitHub Global Security Advisories",
        url: "https://api.github.com/advisories?per_page=100&ecosystem=pip",
        status: "ok",
        checkedAt: "2025-01-05T00:00:00.000Z",
        lastSuccessAt: "2025-01-05T00:00:00.000Z",
      },
    ],
    items: [
      {
        id: "cisa-kev:CVE-2025-0001",
        title: "Example Widget vulnerability",
        url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
        source: "CISA KEV",
        sourceId: "cisa-kev",
        topic: "cloud",
        kind: "advisory",
        publishedAt: "2025-01-02T00:00:00.000Z",
        summary: "Known exploited vulnerability catalog addition: A known exploited vulnerability.",
        cve: "CVE-2025-0001",
      },
      {
        id: "github-advisories:GHSA-test-0001",
        title: "Transformers arbitrary code execution",
        url: "https://github.com/advisories/GHSA-test-0001",
        source: "GitHub Global Security Advisories",
        sourceId: "github-advisories",
        topic: "ai",
        kind: "advisory",
        publishedAt: "2025-01-03T12:00:00.000Z",
        summary: "A package issue affecting model workflows.",
        severity: "high",
        cve: "CVE-2025-0002",
      },
    ],
  };
  await writeFile(outputPath, JSON.stringify(previous));
  const feed = await refreshSecurityFeed({
    outputPath,
    now: () => new Date("2025-02-01T00:00:00Z"),
    fetchImpl: async (url) => {
      if (url.includes("cisa.gov")) throw new Error("CISA unavailable");
      return response([advisory({ ghsa_id: "GHSA-new", published_at: "2025-01-04T00:00:00Z" })]);
    },
  });

  const cisa = feed.sources.find((source) => source.id === "cisa-kev");
  assert.equal(cisa.status, "error");
  assert.equal(cisa.lastSuccessAt, previous.sources[0].lastSuccessAt);
  assert.match(cisa.error, /CISA unavailable/);
  assert.equal(feed.items.some((item) => item.id === "cisa-kev:CVE-2025-0001"), true);
  assert.equal(feed.items.some((item) => item.id === "github-advisories:GHSA-test-0001"), false);
  assert.equal(feed.items.some((item) => item.id === "github-advisories:GHSA-new"), true);
});
