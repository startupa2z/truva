# AI security article: local review

Route: `/blog/top-10-ai-security-risks-2026.html`. The existing blog URL is retained. Blog listing and homepage link to the local preview for this article; other existing articles still use their original live URLs. No production content has changed.

## Editorial approach

Read the supplied Brahma Gupta LinkedIn post through the browser after the web fetch failed. It discusses enterprise AI visibility, data, APIs, permissions, configuration, dependencies, agents, monitoring, and governance. The article credits the post as inspiration. It is an original practical guide, not a copied post, an empirical risk ranking, or a reproduction of the OWASP list. Prompt injection and permission-aware retrieval are explicitly included. Examples are marked illustrative rather than reported incidents.

Primary references were verified: NIST AI RMF and GenAI Profile (AI 600-1); OWASP LLM prompt injection, disclosure, supply chain, excessive agency, vector/embedding weaknesses; OWASP API Security Top 10 2023. Exact URLs are in `src/data/ai-security-article.ts` and linked from each section.

No numerical breach claims, incident statistics, certification promises, or named-client stories. Truva organization attribution is a review draft; no individual author credentials have been invented. The existing preview-wide noindex setting remains active.

## Presentation and checks

Navy editorial cover, clickable ten-issue index, sticky desktop contents, numbered reading sections, warm example boxes, pale blue evidence callouts, first-week action plan, references, and assessment CTA. Content works without JavaScript.

Astro checks/build pass. Browser checks at 320, 390, 768, 1440px pass: no horizontal overflow, one h1, ten issue sections, valid internal anchors, jump links, and automated WCAG A/AA checks. Mobile article text was visually inspected. Blog listing to article navigation and jump links also passed with JavaScript disabled.
