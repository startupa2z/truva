export const crawlerAgents = [
  "Googlebot",
  "bingbot",
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
];

const rules = ["Allow: /", "Disallow: /admin/", "Disallow: /api/"];

export const robotsTxt = [
  "# Public pages are available to search engines and AI answer engines.",
  ...crawlerAgents.flatMap((agent) => [`User-agent: ${agent}`, ...rules, ""]),
  "User-agent: *",
  ...rules,
  "",
  "Sitemap: https://truvasolutions.com/sitemap.xml",
  "",
].join("\n");
