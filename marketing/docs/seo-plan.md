# Truva search plan — local working copy

Updated 2026-10-04. Search estimates are directional, not ranking or lead forecasts. No production deployment is included in this local work.

## Buyer priority

The shortest path to a qualified consultation is a specific service problem: a customer asks for SOC 2 evidence, a cloud environment needs a security review, or an AI feature needs a scoped risk assessment. Each service page should explain the trigger, fit, review scope, deliverables, and paid scoping step. Security Hub guides should answer narrower questions and link to the relevant service page. Do not describe Truva as an independent SOC 2 auditor, promise certification, or claim unverified Wiz/MSP capabilities.

## Evidence and targets

Search Console domain-property Web performance for the selected three-month window on 2026-10-04: 12 clicks, 406 impressions, 3.0% CTR, average position 29.5. The homepage accounted for 12 clicks and 300 impressions. The visible query sample was mainly brand/OWASP/AI checklist; there was no visible SOC 2 query. Page-indexing snapshot last updated 2026-09-20 showed six indexed URLs and no service page. These are historical snapshots, not a live post-change measurement. Search Console Links-report access was denied in this session, so no verified referring-domain baseline is available.

Semrush US desktop estimates observed 2026-10-04 (volume / keyword difficulty / CPC in USD):

| Query | Estimate | Role |
|---|---:|---|
| soc 2 readiness assessment | 170 / 20 / 40.78 | Primary SOC 2 page |
| soc 2 consultant | 90 / 10 / 119.50 | Secondary SOC 2 page; high buyer value |
| soc 2 gap assessment | 70 / 13 / 0 | Secondary SOC 2 page; match scope precisely |
| cloud security assessment | 1,300 / 26 / 40.34 | Primary cloud page |
| aws security assessment | 140 / 28 / 0 | Cloud supporting topic only when AWS-specific content is substantiated |
| ai security consulting | 50 / 4 / 124.26 | Secondary AI page; limited sample volume |
| ai security assessment | 320 / 30 / 0 | Primary AI page |

The five immediate query priorities are **SOC 2 readiness assessment**, **SOC 2 consultant**, **SOC 2 gap assessment**, **cloud security assessment**, and **AI security assessment**. The first three share a buyer journey and one focused landing page rather than three thin pages. Semrush difficulty and volume are estimates, not proof of easy ranking. Query intent should be validated against results and actual lead conversations.

## Page map and implementation

| Page | Primary job | Status |
|---|---|---|
| `/services/soc-2-readiness` | SOC 2 readiness/gap/remediation buyer path | Built locally |
| `/services/cloud-security-assessment` | Cloud posture review and CSPM findings | Built locally |
| `/services/ai-security-assessment` | AI application/agent security review | Built locally |
| `/services` | Compare three engagement options | Existing page, linked to details |
| `/security-hub` | Navigate explainers, guides, and topical signals | Existing local page |
| AI architecture review and top-10 guides | Answer specific security questions, lead to service detail | Existing local work, internally linked |
| Preserved `/blog/*.html` articles | Retain historical URLs and useful content | Release script preserves them and adds canonical URLs |

All three detail pages have unique title/description/H1, self-canonical URL through the shared layout, `Service` and breadcrumb structured data, scoped FAQs, and a clear consultation CTA. Navigation, services overview, footer, and relevant guides link to them. The release sitemap is generated from indexable self-canonical pages, including preserved articles, rather than a static URL list. Production robots rules are assembled only in the release build.

## Local QA and release boundary

On 2026-10-04, Astro check passed with zero diagnostics; `build:release` passed and validated 17 distinct, indexable canonical sitemap URLs. Browser QA passed at 320, 390, 768, and 1440 px with no detected overflow or accessibility violations. Community, security-feed, and article tests passed. These are local checks; production indexing and rankings cannot be inferred from them. Existing unrelated working-tree changes were preserved.

Before a later production release, verify the exact deployed commit/rollback path and production service health under `AGENTS.md`; then inspect live HTTP headers, canonical URLs, robots, sitemap, affected pages, and booking flow. Submit/inspect the sitemap in Search Console only with access, and compare service-page impressions/clicks and qualified consultations after indexing. Track actual booked calls and paid scopes separately from CTA clicks.

## Off-page work

Current verified new backlinks from this session: **0**. Do not count a submission or an unapproved profile as a backlink. Five appropriate profile opportunities are Clutch, its included Manifest profile, GoodFirms, DesignRush, and Crunchbase. Confirm no duplicate profile; use the verified Truva name, domain, logo, services and business contact. Do not invent team size, founding date, office, client roster, reviews, or certifications. These services require an authenticated account and/or their own review before publication. See `off-page-seo.md` for exact sources, draft copy, and status.

After those listings, seek earned citations to useful original material through genuine client/partner case studies (only with permission), practitioner talks, and substantive guest articles. A quota of ten low-quality directory or comment links would add spam risk without establishing buyer trust. Measure published referring pages/domains and relevant referral inquiries, not the number of forms filled.

## Next editorial work

First publish one practitioner-backed SOC 2 readiness checklist explaining the evidence/gap/remediation path, one cloud-assessment-vs-CSPM guide, and one AI assessment scope guide. Each needs original examples, accurate sources, author credentials, clear limitations, and a natural service link. Avoid mass-produced topic variants or made-up customer proof. Recheck Search Console after the new pages are live before expanding into ISO 27001/42001 clusters.
