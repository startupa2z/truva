import assert from "node:assert/strict";
import { crawlerAgents } from "./crawler-policy.mjs";

const base = (process.argv[2] || "https://truvasolutions.com").replace(
  /\/$/,
  "",
);

function parseGroups(text) {
  const groups = [];
  let group = { agents: [], rules: [] };

  const save = () => {
    if (group.agents.length) groups.push(group);
    group = { agents: [], rules: [] };
  };

  for (const sourceLine of text.split(/\r?\n/)) {
    const line = sourceLine.replace(/#.*/, "").trim();
    if (!line) continue;
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (field === "user-agent") {
      if (group.rules.length) save();
      group.agents.push(value.toLowerCase());
    } else if (
      (field === "allow" || field === "disallow") &&
      group.agents.length
    ) {
      group.rules.push({ field, value });
    }
  }
  save();
  return groups;
}

function robotsAllows(text, userAgent, pathname) {
  const normalizedAgent = userAgent.toLowerCase();
  const groups = parseGroups(text);
  const matches = groups
    .map((group) => ({
      group,
      score: Math.max(
        ...group.agents.map((agent) =>
          agent !== "*" && normalizedAgent.includes(agent)
            ? agent.length
            : agent === "*"
              ? 0
              : -1,
        ),
      ),
    }))
    .filter(({ score }) => score >= 0);
  const bestScore = Math.max(...matches.map(({ score }) => score));
  const rules = matches
    .filter(({ score }) => score === bestScore)
    .flatMap(({ group }) => group.rules)
    .filter(({ value, field }) => value || field === "allow")
    .filter(({ value }) => pathname.startsWith(value));
  if (!rules.length) return true;
  rules.sort(
    (a, b) => b.value.length - a.value.length || (a.field === "allow" ? -1 : 1),
  );
  return rules[0].field === "allow";
}

const robotsResponse = await fetch(`${base}/robots.txt`, {
  headers: { "user-agent": "TruvaCrawlerAccessCheck/1.0" },
});
assert.equal(robotsResponse.status, 200, "robots.txt must return HTTP 200");
const robots = await robotsResponse.text();
assert.match(robots, /Sitemap:\s*https:\/\/truvasolutions\.com\/sitemap\.xml/i);

for (const agent of crawlerAgents) {
  assert.equal(
    robotsAllows(robots, agent, "/"),
    true,
    `${agent} is blocked from public pages`,
  );
  assert.equal(
    robotsAllows(robots, agent, "/admin/community"),
    false,
    `${agent} can crawl admin pages`,
  );
  assert.equal(
    robotsAllows(robots, agent, "/api/views"),
    false,
    `${agent} can crawl API routes`,
  );

  const response = await fetch(`${base}/`, {
    headers: { "user-agent": agent },
  });
  assert.equal(
    response.status,
    200,
    `${agent} received HTTP ${response.status}`,
  );
  assert.doesNotMatch(
    response.headers.get("x-robots-tag") || "",
    /noindex|none/i,
  );
  assert.doesNotMatch(
    await response.text(),
    /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*(?:noindex|none)/i,
  );
}

console.log(
  `Crawler access verified for ${crawlerAgents.length} agents at ${base}.`,
);

export { parseGroups, robotsAllows };
