# Truva Resources design reference

## Source

- Reference: https://www.wiz.io/resources
- Captured: 2026-10-19
- Evidence: Firecrawl branding, page structure, image inventory, and full-page screenshot
- Screenshot: `../.firecrawl/wiz-resources/wiz-resources-full.png`

## Observed Wiz pattern

- Large centered “Explore resources” heading with generous white space.
- One wide search control before the library.
- Narrow left filter rail beside a three-column resource grid.
- Filters are grouped by content type and topic with a visible result count.
- Cards use strong visual thumbnails, short labels, compact titles, and minimal decoration.
- Blue is used for interaction while most of the page stays white and neutral.

## Truva adaptation

- Keep the hierarchy, density, and filter-first browsing pattern.
- Use Truva navy, orange, ink, muted gray, and pale blue rather than Wiz colors.
- Use existing Truva photography and infographic artwork only. Do not reuse Wiz assets, logos, or copy.
- Content types: Blog, White Paper, Case Study, Events. Events currently includes the SF Tech Week collection and its 13 published reports; future firsthand event coverage can use the same category. Empty categories explain that material is being prepared instead of presenting invented publications.
- Topics: AI Security, Cloud Security, Application Security, Compliance, Founder & Industry.
- Desktop: 210px filter rail plus three-column grid. Tablet: two-column grid. Mobile: stacked filters and one-column cards.
- Cards should have a subtle border, 8px radius, 16:10 artwork, compact metadata, and a clear focus state.

## Build rules

- Search works on title, description, topic, and type.
- Type and topic filters can be combined and cleared.
- Results update client-side with an accessible live count and empty state.
- Preserve Truva’s existing header, footer, typography, and booking flow.
- Avoid decorative arrows.
