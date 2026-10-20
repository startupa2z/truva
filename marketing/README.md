# Truva Solutions website

Astro static pages served by a small Node 22 server, with SQLite for first-party analytics. The root Dockerfile is the production entrypoint. This is the only active Truva website application.

## Development and checks

From `marketing/`: `npm ci`, `npm run check`, `npm run build`, `npm run preview`. Preview is at http://127.0.0.1:4321 and is noindex. `npm run dev` serves live Astro edits without community APIs.

`npm run test:community` tests API authorization, counts, persistence and moderation. `npm run verify` checks responsive layouts, navigation, accessibility and no-JavaScript access. Additional browser checks are in `scripts/verify-community.mjs`, `verify-hub.mjs`, and `verify-moderation.mjs`.

`npm run build:release` makes indexable production pages, removes the design-review route and unpublished client placeholders, and creates robots.txt and sitemap.xml. Retired article URLs use permanent redirects in `public/_redirects` and the Node server. Run browser verification with `RELEASE_TEST=1 PREVIEW_URL=http://127.0.0.1:4330`; community checks also accept `ADMIN_KEY_FILE`.

## Production

Coolify application `k8n4ueemd8yjkwt7gseard9b`, repository `startupa2z/truva`, branch `main`, Dockerfile `/Dockerfile`, port 80, domain https://truvasolutions.com. The compose files also build this same Astro and Node application for local or compose-based use.

Mount the named Truva-only volume at `/data`. It holds `community.sqlite`, WAL files, `admin-key.txt`, and seven daily SQLite snapshots under `backups/`. Never copy local `.local` data into production. A named volume survives releases; snapshots in the same volume do not protect against VPS or volume loss. Arrange a separate encrypted off-server backup for disaster recovery.

The dashboard is `/admin/community`. The runtime creates a random admin key at `/data/admin-key.txt` with owner-only permissions; retrieve it through the authorized Coolify application terminal. Do not put it in Git or browser-visible configuration. Sessions expire after one hour. Comments require approval before public display.

Views are deduplicated per page/browser tab over 30 minutes. Visitor counts use a random browser identifier expiring after 30 days, stored only as a hash on the server. They count browsers, not verified people; bots, cleared storage and privacy opt-outs affect totals. Do Not Track, Global Privacy Control, and the privacy-page opt-out are honored. No third-party analytics scripts are loaded. Public article counts and private daily/page/visitor totals use this same database.

## Release and rollback

Before releasing, verify the actual Coolify source, branch, running commit, volume and rollback image. The pre-rebuild rollback image is commit `a86113fc2fd3c12b7462073fd2310826649b4c8e` (verified September 19, 2026). Use only this Truva application's deployment and rollback controls. Do not restart shared infrastructure or the unrelated StartupA2Z application.

After release verify the exact commit, `/health`, homepage, booking link, Security Hub, articles, counters, admin authentication boundary, robots and sitemap. The Docker health check calls `/health`, which checks SQLite availability. Public email: satish@truvasolutions.com. Booking: https://calendly.com/satish-truvasolutions/30min.
