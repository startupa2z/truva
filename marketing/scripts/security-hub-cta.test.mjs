import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = new URL("../src/components/SecurityHub.astro", import.meta.url);

test("Security Hub prioritizes top issues and defers its single consultation CTA", async () => {
  const hub = await readFile(component, "utf8");

  assert.doesNotMatch(hub, /<header class="hub-heading">/);
  assert.match(hub, /<TopIssues \/>/);
  assert.match(hub, /Talk to a security practitioner/);
  assert.doesNotMatch(hub, /class="hub-consult"/);
  assert.match(hub, /<SiteHeader showBooking=\{false\} pageTitle="Security Hub" \/>/);
});

test("top-issue routes remain data-driven until research provides verified entries", async () => {
  const data = await readFile(new URL("../src/data/top-issues.ts", import.meta.url), "utf8");
  const component = await readFile(new URL("../src/components/TopIssues.astro", import.meta.url), "utf8");
  const route = await readFile(new URL("../src/pages/security-hub/issues/[slug].astro", import.meta.url), "utf8");

  assert.match(data, /export const topIssues: TopIssue\[\] = \[\];/);
  assert.match(data, /label: "AI Top 10"/);
  assert.match(data, /label: "LLM Top 10"/);
  assert.match(data, /label: "Cloud Security Top 10"/);
  assert.match(component, /role="tablist"/);
  assert.match(component, /href=\{`\/security-hub\/issues\/\$\{issue\.slug\}`\}/);
  assert.match(route, /What it is/);
  assert.match(route, /Why it matters/);
  assert.match(route, /Who or what is affected/);
  assert.match(route, /What to check now/);
  assert.match(route, /Remediation guidance/);
  assert.match(route, /Primary source:/);
  assert.match(route, /Last updated:/);
});

test("Security Hub hides its seven-link section navigation on mobile", async () => {
  const hub = await readFile(component, "utf8");

  assert.match(hub, /@media \(max-width: 767px\)[\s\S]*\.hub-sidebar\s*\{[\s\S]*display:\s*none/);
});

test("Security Hub preserves source health without retaining the superseded monitor overview", async () => {
  const hub = await readFile(component, "utf8");
  const intelligence = await readFile(
    new URL("../src/components/HubIntelligence.astro", import.meta.url),
    "utf8",
  );

  assert.match(hub, /href="#priority-signals">Priority signals<\/a>/);
  assert.match(hub, /href="#source-health">Source health<\/a>/);
  assert.match(intelligence, /id="priority-signals"/);
  assert.match(intelligence, /id="source-health"/);
  assert.match(intelligence, /Source-backed editorial guidance is being prepared/);
  assert.doesNotMatch(intelligence, /PUBLIC SECURITY MONITOR/);
});
