# Proposed keyword map and launch roadmap

Status: planning scaffold for phase 1. No measured volume, difficulty, current rankings, Search Console data, or conversion baseline is available. These are intent-led hypotheses, not finalized targets. First-page ranking and AI citation outcomes are unknown. In phase 2, validate US volume/difficulty using an authorized SEO data source; export Search Console queries/pages and inspect current results before finalizing copy. Do not invent estimates when access is missing.

## Page → intent

| Page | Primary query | Secondary queries | Search intent |
|---|---|---|---|
| / | startup security consulting | cybersecurity for SaaS startups; California startup security | Choose a provider |
| /services/ai-security | AI security assessment for startups | LLM prompt injection assessment; securing AI agents | Buy an assessment |
| /services/cloud-security | cloud security assessment for startups | CSPM consulting; AWS security assessment | Buy a cloud review |
| /services/soc-2-compliance | SOC 2 compliance for startups | SOC 2 readiness consultant; SOC 2 for startups | Hire readiness support |
| /services/iso-27001-compliance | ISO 27001 for startups | ISO 27001 readiness consultant | Implement an ISMS |
| /services/iso-42001-compliance | ISO 42001 for startups | ISO 42001 readiness; AIMS implementation; ISO 42001 certification consultant | Implement AI governance |
| /products | Truva security products | security action tracking | Explore actual products |
| /products/[approved-slug] | [approved product name] | [validated product problem] | Evaluate / register interest |
| /clients | Truva Solutions clients | Truva case studies | Validate proof |
| /about | Truva Solutions | startup security practitioners | Validate expertise |
| /blog | startup security insights | AI security and compliance guides | Learn |
| /resources | startup security checklist | AI governance checklist | Get practical materials |
| /contact | Truva Solutions contact | book security consultation | Contact / book |
| /privacy, /terms | No keyword acquisition target | Brand + privacy / terms | Understand policies |

Do not claim “Wiz implementation partner” until Truva's own partnership/authorization is verified. Another entity's relationship does not establish Truva's status. Bay Area/California language is a service-area context, not a fictitious office or doorway-page strategy.

## Preserve before changing

Existing repository contains `/blog.html` and six `/blog/*.html` articles: `ai-security-checklist`, `how-to-prepare-application-security-testing`, `internal-vs-external-pen-testing`, `owasp-top-10-explained`, `top-10-ai-security-risks-2026`, `would-your-company-survive-ransomware-attack`. Preserve all content and URLs or map individual 301s after the replacement routes exist. Historical application-security blog posts stay; do not create new application-security, CMMC, or vCISO service pages. Confirm full indexed/backlinked URL inventory using Search Console and production crawl before cutover; repository inventory alone is incomplete evidence.

## Phase 2 service briefs

Write 900–1,400 useful words per service: buyer trigger, deliverables, process, conditional timeline, fit, 5–7 buyer FAQs, and CTA. Validate questions using authorized inquiry notes and current search results; don't label invented questions as measured buyer research. Cross-link AI security ↔ ISO 42001 and SOC 2 ↔ ISO 27001 ↔ ISO 42001. Explain that the appropriate order depends on buyers, scope, and AI risk. ISO 42001 copy must cover policy, risk/impact assessments, controls mapping, internal-audit support with appropriate independence, and certification-audit support. No guaranteed outcome or universal timeline. Check official ISO/AICPA/EU sources before final compliance copy; ISO 42001 certification does not automatically establish EU AI Act compliance.

## Twelve proposed new articles

1. SOC 2 cost breakdown for a 30-person SaaS startup — cost / purchase intent; dated assumptions, not an unqualified quote.
2. SOC 2 readiness: what to have ready before hiring a consultant — provider selection.
3. SOC 2 Type I or Type II: which does your customer need? — buyer decision.
4. ISO 27001 for startups: a practical first scope — implementation.
5. ISO 42001 vs SOC 2: which should an AI startup pursue first? — comparison.
6. ISO 42001 vs ISO 27001: where the work overlaps — comparison.
7. What an ISO 42001 readiness assessment should deliver — provider evaluation.
8. ISO 42001 and the EU AI Act: where certification helps and where it does not — governance; primary legal sources and review.
9. What a prompt-injection assessment can and cannot tell you — assessment intent.
10. Securing AI agents: permissions, tool use, and data boundaries — technical authority.
11. Cloud security assessment vs CSPM: what still needs a person? — evaluation.
12. Preparing cloud evidence for your first enterprise security review — buyer problem.

Each needs a real author, approved credentials, original practitioner input, sources, and related service links. No fictional author schema or invented publication dates.

## Pre-launch checklist (phase 4)

- [ ] Approve design, business facts, real product scope, bios, proof permissions, and legal copy.
- [ ] Replace email-only booking with approved calendar; verify time zone, confirmation and cancellation flow without booking a real slot during QA.
- [ ] Implement server-side form processing and Turnstile verification; validate real error/success behavior without public test submissions.
- [ ] Establish Cloudflare ownership, DNS migration, exact previous config, current backend routing/OAuth requirements, DB backups, and rollback owner. Keep the VPS/API isolated from StartupA2Z.
- [ ] Map all existing URLs, preserve old articles, test individual 301s, avoid chains/loops and catch-all home redirects.
- [ ] Unique titles/descriptions, one H1, canonicals, complete internal links and XML sitemap. Exclude review pages and drafts.
- [ ] Remove preview noindex headers/meta and robots disallow only in the approved production release. Check deployed headers, not only files.
- [ ] Validate accurate Organization/ProfessionalService/WebSite, breadcrumb, FAQ, Article/Person, and real Product/SoftwareApplication JSON-LD. FAQ markup is not a promise of Google rich results. Review markup only for real permitted evidence.
- [ ] Production CSP must allow only required calendar/analytics/Turnstile origins and script hashes; test in-browser. HSTS, frame and referrer protections must survive hosting/proxy routing.
- [ ] Add privacy-friendly analytics with approved account; measure consult clicks, actual completed bookings, and successful interest submissions separately. Clicks are not leads.
- [ ] Run Lighthouse mobile/desktop, keyboard and screen-reader checks; aim for 95+ scores, LCP <2s, CLS <0.05. Repeat on deployed HTTPS with actual integrations; confirm field data when available.
- [ ] Verify release artifact/commit, homepage, original URLs, `/health`, auth if retained, booking/forms, TLS, and rollback readiness.
- [ ] Verify Search Console/Bing ownership and submit sitemap after publication; monitor crawl/index coverage.

## Ninety-day post-launch plan

| Window | Work | Owner / effort | Measurement |
|---|---|---|---|
| Days 1–14 | Establish crawl/index and conversion baseline; fix migration errors | Engineer + Satz; 1–2 days then short daily checks | Old/new URL status, index reports, successful real booking events |
| Days 15–30 | Review service-query impressions and CTA flow; publish first three validated buyer guides | Practitioner + editor; about one article/week | Qualified impressions/clicks and consult conversion, not just traffic |
| Days 31–60 | Publish 4–5 guides and approved case study; earn relevant partner/community mentions | Satz + practitioner | Query/page trend, qualified leads, referring domains |
| Days 61–90 | Complete remaining guides as evidence permits; improve pages with real query demand and weak conversion | Editor + engineer; weekly review | Top-10 share for fixed query portfolio, booked calls, pipeline quality |

Do not force article volume if original expertise, demand, or evidence is missing. Monthly repeat a fixed AI-answer prompt set; record engine/date/source links and accurate mentions versus citations separately. Report observed results, not assumed causal uplift.

## Manual off-site work for Satz

- Google Business Profile only if the actual business meets eligibility requirements; do not invent an office or publish a personal address.
- Search Console and Bing Webmaster Tools ownership and sitemap submission.
- Consistent LinkedIn company profile and business details.
- Clutch for services; assess G2 eligibility when an actual software product exists. Request honest reviews without scripting claims.
- Real partner/community directory profiles and relevant earned links; verify permission to use partner badges.
- Guest posts: one substantive practitioner article per month for a relevant SaaS/founder or cloud/AI community; contribute original examples and link naturally to the useful resource. No paid link schemes.

## Biggest risks

Unproven product messaging can distract from booked calls; keep it secondary until real demand is established. Missing credible proof and author evidence may limit trust despite good design. A static-host DNS move can break the current API/auth flows unless routing is planned. Unknown keyword volume/difficulty means the initial query portfolio may need narrowing. Deployment and HTTP 200 do not prove indexability, rankings, or conversions.
