# Phase 1 design decisions

White background; Arial/Helvetica/sans-serif only, weights 400/700. Body line height 1.6. Max paragraph width 65ch. Thin #E1E1E1 borders, 6–8px corners, no heavy shadows. The hero headline is “Protect your business. Win customer trust.” A minimal SVG places “Your product & processes” in the center, with thin orange connections to AI security, cloud security, and compliance. The background is white with blue labels and small line icons. The OG template retains its original arch for now.

## Palette provenance

Source: `src/assets/truva-logo-source.png`, copied without modification from the existing `truva-logo-fixed.png`. Source size 916×948. Nontransparent bounds (128,116)–(720,752). Its gradient contains many shades: there is no single exact brand hex. Counting opaque pixels yielded representative colors:

| Token | Exact sampled pixel | Usage |
|---|---|---|
| Logo orange | #E77539 | Buttons, CTA band, and decorative accents |
| Large-type logo orange | #E67438 | Large heading text only |
| Logo blue | #243A6C | Hero center, labels, and keyboard focus |
| Ink | #292929 | Primary text; chosen neutral |
| Muted | #626262 | Secondary text; chosen neutral |
| Line | #E1E1E1 | Neutral borders and section dividers |

Exact source coordinates: orange (666,304), blue (669,197), all fully opaque.

The user requested the brighter logo orange. #E77539 is used for fills with dark #292929 text. Its contrast on white is 2.9994:1, so large orange text uses the adjacent exact logo sample #E67438 (3.0347:1); small text remains dark. Colors are exact raster samples, not a guessed match to the approximate orange in the brief. WebP preserves the full original gradient logo. The adjacent lowercase Arial wordmark is a proposed typographic treatment for review.

## Facts and assumptions

- Startup/SaaS audience, services, 25+ years, senior-led work, and remote US delivery come from the brief. Supporting bios and credentials need approval before launch.
- `service@truvasolutions.com` is displayed on the existing public homepage, checked during this task. Calendar ownership and a booking URL are unknown; mailto is the working local fallback.
- No products are currently offered. The proposed Compass section and Products navigation have been removed. Services is a separate page; Resources uses a native dropdown for Blogs, White papers, and Case studies; Home returns to the homepage. Experience is in Our approach, not the hero.
- No clients, quotes, or outcome metrics were supplied. `clients.json` contains empty factual arrays and explicit review placeholders; no review schema is emitted.
- No personal address, phone, or private customer information appears.
- “Prepare for audit” is intentional: no guarantee of certification or implication that Truva is the auditor/certification body.
- Phase 1 links use functional in-page anchors or real email/public blog URLs. Detail-page navigation arrives with those pages.

## Scope

Local pages include the homepage, `/services`, `/resources`, `/resources/blogs`, `/resources/white-papers`, `/resources/case-studies`, and `/design-system`. White papers and case studies await approved content; existing blog article URLs remain unchanged. The requested service copy, complete sitemap, products/clients/blog migrations, resources, contact/legal pages, redirect map, author and product schema, analytics, and protected forms belong to the later phases. Pause for review now.

Latest review: restored the light borders; removed the hero’s senior-practitioner and location lines. Client proof stays explicitly pending approval.
