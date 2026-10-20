import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist';
const origin = 'https://truvasolutions.com';
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(urls.length, new Set(urls).size, 'Sitemap has duplicate URLs');

const required = [
  '/',
  '/services',
  '/services/soc-2-readiness',
  '/services/cloud-security-assessment',
  '/services/ai-security-assessment',
  '/security-hub',
  '/security-hub/guides',
  '/security-hub/ai-security-architecture-review',
  '/resources',
  '/blog/top-10-ai-security-risks-2026.html',
];
for (const route of required) assert.ok(urls.includes(origin + route), `Missing ${route}`);

for (const loc of urls) {
  const url = new URL(loc);
  assert.equal(url.origin, origin);
  assert.ok(!/\/(?:admin|design-system)(?:\/|$)/.test(url.pathname), `Non-public route ${loc}`);
  let file = join(root, decodeURIComponent(url.pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  assert.ok(existsSync(file), `Sitemap URL has no release HTML: ${loc}`);
  const html = readFileSync(file, 'utf8');
  assert.ok(html.includes(`<link rel="canonical" href="${loc}">`), `Canonical mismatch: ${loc}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html), `Noindex URL in sitemap: ${loc}`);
  assert.match(html, /<h1\b/i, `Missing primary heading: ${loc}`);
}

const home = readFileSync(join(root, 'index.html'), 'utf8');
const services = readFileSync(join(root, 'services', 'index.html'), 'utf8');
for (const route of required.filter((path) => path.startsWith('/services/'))) {
  assert.ok(home.includes(`href="${route}"`), `Homepage does not link to ${route}`);
  assert.ok(services.includes(`href="${route}"`), `Services page does not link to ${route}`);
}
console.log(`SEO release checks passed: ${urls.length} canonical, indexable URLs.`);
