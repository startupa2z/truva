import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const MAX_RESPONSE_BYTES = 2_000_000;
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_ITEMS = 40;
const CISA_KEV_URL =
  "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
const CISA_CATALOG_URL =
  "https://www.cisa.gov/known-exploited-vulnerabilities-catalog";
const GITHUB_ADVISORIES_URL =
  "https://api.github.com/advisories?per_page=100&ecosystem=pip";
const AI_PACKAGES = new Set([
  "transformers",
  "torch",
  "langchain",
  "vllm",
  "gradio",
  "mlflow",
  "lmdeploy",
  "langchain-core",
  "langchain-community",
  "llama-index-core",
]);

const SOURCE_DEFINITIONS = [
  { id: "cisa-kev", name: "CISA KEV", url: CISA_KEV_URL },
  {
    id: "github-advisories",
    name: "GitHub Global Security Advisories",
    url: GITHUB_ADVISORIES_URL,
  },
];

function isoDate(value, now) {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf()) || date.valueOf() > now.valueOf()) return null;
  return date.toISOString();
}

function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}

function plainText(value, maxLength = 560) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_#>~]/g, " ")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cisaItems(payload, now) {
  if (!payload || !Array.isArray(payload.vulnerabilities)) {
    throw new Error("CISA response did not contain a vulnerabilities array");
  }
  return payload.vulnerabilities.flatMap((entry) => {
    const cve = plainText(entry.cveID, 64);
    const publishedAt = isoDate(entry.dateAdded, now);
    const title = plainText(entry.vulnerabilityName, 240);
    const summaryText = plainText(entry.shortDescription || entry.notes);
    if (!cve || !publishedAt || !title || !summaryText) return [];
    return [
      {
        id: `cisa-kev:${cve}`,
        title,
        url: CISA_CATALOG_URL,
        source: "CISA KEV",
        sourceId: "cisa-kev",
        topic: "cloud",
        kind: "advisory",
        publishedAt,
        summary: `Known exploited vulnerability catalog addition: ${summaryText}`,
        cve,
      },
    ];
  });
}

function githubItems(payload, now) {
  if (!Array.isArray(payload)) {
    throw new Error("GitHub advisories response was not an array");
  }
  return payload.flatMap((entry) => {
    const id = plainText(entry.ghsa_id, 80);
    const url = safeHttpsUrl(entry.html_url);
    const publishedAt = isoDate(entry.published_at, now);
    const title = plainText(entry.summary, 240);
    const summary = plainText(entry.description || entry.summary);
    if (!id || !url || !publishedAt || !title || !summary) return [];
    const packages = Array.isArray(entry.vulnerabilities)
      ? entry.vulnerabilities.map((item) => item?.package?.name?.toLowerCase())
      : [];
    const item = {
      id: `github-advisories:${id}`,
      title,
      url,
      source: "GitHub Global Security Advisories",
      sourceId: "github-advisories",
      topic: packages.some((name) => AI_PACKAGES.has(name)) ? "ai" : "cloud",
      kind: "advisory",
      publishedAt,
      summary,
    };
    const severity = plainText(entry.severity, 32).toLowerCase();
    const cve = plainText(entry.cve_id, 64);
    if (severity) item.severity = severity;
    if (cve) item.cve = cve;
    return [item];
  });
}

async function fetchJson(url, fetchImpl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetchImpl(url, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    });
    if (!response?.ok) {
      throw new Error(`HTTP ${response?.status ?? "request failed"}`);
    }
    const length = Number(response.headers?.get?.("content-length"));
    if (Number.isFinite(length) && length > MAX_RESPONSE_BYTES) {
      throw new Error("response exceeded size limit");
    }
    if (typeof response.arrayBuffer === "function") {
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > MAX_RESPONSE_BYTES) {
        throw new Error("response exceeded size limit");
      }
      return JSON.parse(new TextDecoder().decode(bytes));
    }
    return response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function readLastGood(outputPath) {
  try {
    const value = JSON.parse(await readFile(outputPath, "utf8"));
    if (!Array.isArray(value?.sources) || !Array.isArray(value?.items)) return null;
    return value;
  } catch {
    return null;
  }
}

function sourceFromPrevious(previous, definition) {
  return previous?.sources.find((source) => source?.id === definition.id);
}

function errorMessage(error) {
  return plainText(error instanceof Error ? error.message : String(error), 240) || "request failed";
}

function deduplicateAndSort(items) {
  const seen = new Set();
  return items
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, MAX_ITEMS);
}

async function writeJsonAtomically(outputPath, value) {
  await mkdir(dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    await rename(temporaryPath, outputPath);
  } finally {
    await unlink(temporaryPath).catch(() => {});
  }
}

export async function refreshSecurityFeed({
  outputPath = resolve("public/security-feed.json"),
  fetchImpl = fetch,
  now = () => new Date(),
} = {}) {
  const checkedAt = now();
  if (!(checkedAt instanceof Date) || Number.isNaN(checkedAt.valueOf())) {
    throw new Error("now must return a valid Date");
  }
  const previous = await readLastGood(outputPath);
  const sourceResults = await Promise.all(
    SOURCE_DEFINITIONS.map(async (definition) => {
      try {
        const payload = await fetchJson(definition.url, fetchImpl);
        const items =
          definition.id === "cisa-kev"
            ? cisaItems(payload, checkedAt)
            : githubItems(payload, checkedAt);
        return {
          source: {
            ...definition,
            status: "ok",
            checkedAt: checkedAt.toISOString(),
            lastSuccessAt: checkedAt.toISOString(),
          },
          items,
        };
      } catch (error) {
        const oldSource = sourceFromPrevious(previous, definition);
        return {
          source: {
            ...definition,
            status: "error",
            checkedAt: checkedAt.toISOString(),
            ...(oldSource?.lastSuccessAt
              ? { lastSuccessAt: oldSource.lastSuccessAt }
              : {}),
            error: errorMessage(error),
          },
          items: (previous?.items || []).filter(
            (item) => item?.sourceId === definition.id,
          ),
        };
      }
    }),
  );
  const feed = {
    fetchedAt: checkedAt.toISOString(),
    sources: sourceResults.map((result) => result.source),
    items: deduplicateAndSort(sourceResults.flatMap((result) => result.items)),
  };
  await writeJsonAtomically(outputPath, feed);
  return feed;
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (import.meta.url === invokedPath) {
  refreshSecurityFeed()
    .then((feed) => {
      const errors = feed.sources.filter((source) => source.status === "error").length;
      console.log(`Refreshed ${feed.items.length} items from ${feed.sources.length - errors} source(s); ${errors} source error(s).`);
      process.exitCode = errors ? 1 : 0;
    })
    .catch((error) => {
      console.error(`Security feed refresh failed: ${errorMessage(error)}`);
      process.exitCode = 1;
    });
}
