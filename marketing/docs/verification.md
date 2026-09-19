# Phase 1 local verification — 2026-09-19

Scope: local built preview at `http://127.0.0.1:4321`. No push, production write, deployment, DNS change, calendar booking, or form submission.

| Check | Result |
|---|---|
| Astro check | 0 errors, warnings, or hints |
| Static build | Homepage and design-system page built successfully |
| Browser widths | 320, 390, 768, 1440px: no horizontal overflow |
| Automated WCAG A/AA checks | No violations for tested WCAG 2/2.1 rules at all four widths; not a full manual conformance audit |
| Keyboard | Skip link, mobile menu selection, Escape/focus behavior, consult anchor passed |
| No JavaScript | Homepage and native mobile menu remain usable |
| Homepage resources | No third-party requests or page JavaScript errors |
| Metadata | One H1, title under 60 chars, description under 155, canonical and JSON-LD checked |
| Local mobile Lighthouse | Performance 100; accessibility 100; best practices 100; SEO 69 |
| Local mobile LCP / CLS | 1.1 seconds / 0 |
| Local transferred page resources | Approximately 27 KiB in Lighthouse |
| Git whitespace check | Passed |
| Release guard | `npm run build:release` fails intentionally with review-stage explanation |

SEO 69 reflects the intentional `noindex` preview. It is not a production SEO readiness score or a ranking prediction. Robots also disallows preview crawling. Do not remove these controls until content, URL migration, backend routing, and publication are approved.

Lighthouse initially reported a visible/accessibility-name mismatch on the logo; the redundant name was removed and whitespace made explicit. The final audit no longer flags it. Source-only SEO audit treats decorative `alt=""` logo marks as missing alt text; this is intentional because adjacent text supplies the brand name. No image information is omitted for assistive technology.

Visually inspected desktop hero, full desktop page, full mobile page and mobile hero screenshots. Raw Lighthouse, axe, browser reports and screenshots are in ignored `artifacts/`. Actual HTTPS headers, calendar/form integrations, field Core Web Vitals, full sitemap, redirects, search-volume/difficulty, indexing, rankings and production conversions remain unverified or deferred to their planned phases.
