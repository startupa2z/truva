# Truva Solutions website

The Truva website uses three services: an Astro frontend served by Nginx, a FastAPI backend, and PostgreSQL. Nginx proxies `/api` and `/health` to FastAPI. PostgreSQL stores first party analytics.

## Development and checks

From `marketing/`: `npm ci`, `npm run check`, `npm run build`, `npm run preview`. The static preview is at http://127.0.0.1:4321 and is noindex. It does not include FastAPI. Use `docker compose up -d --build` from the repository root for the complete stack at http://127.0.0.1:8888.

`npm run verify` checks responsive layouts, navigation, accessibility and no-JavaScript access. `scripts/verify-community.mjs` checks analytics and the private dashboard against the complete Docker stack.

`npm run build:release` makes indexable production pages, removes the design-review route and unpublished client placeholders, and creates robots.txt and sitemap.xml. Retired article URLs use permanent redirects in `public/_redirects` and Nginx. Run browser verification with `RELEASE_TEST=1 PREVIEW_URL=http://127.0.0.1:4330`.

## Production

Production must use `docker-compose.prod.yml` as one Coolify Compose resource so the frontend, backend, database, internal network, and dependencies are released together. Only the frontend publishes port 80. FastAPI and PostgreSQL remain private to the Compose network.

Set `POSTGRES_PASSWORD`, `ADMIN_TOKEN`, `FRONTEND_ORIGIN`, and `SOURCE_COMMIT` in the production secret store. The `postgres_data` volume persists database records between releases. Never replace production records with local data. Arrange encrypted off-server PostgreSQL backups before relying on analytics history.

The dashboard is `/admin/community`. Sign in with the production `ADMIN_TOKEN`. Do not put the token in Git or browser-visible configuration. Sessions expire after one hour. Comments are disabled.

Views are deduplicated per page/browser tab over 30 minutes. Visitor counts use a random browser identifier expiring after 30 days, stored only as a hash on the server. They count browsers, not verified people; bots, cleared storage and privacy opt-outs affect totals. Do Not Track, Global Privacy Control, and the privacy-page opt-out are honored. No third-party analytics scripts are loaded. Public article counts and private daily/page/visitor totals use this same database.

## Release and rollback

Before releasing, verify the actual Coolify source, branch, running commit, Compose file, database volume, and rollback path. Use only this Truva project's deployment and rollback controls. Do not restart shared infrastructure or the unrelated StartupA2Z application.

After release verify the exact commit, `/health`, homepage, booking link, Security Hub, articles, counters, admin authentication boundary, robots and sitemap. `/health` checks PostgreSQL availability through FastAPI. Public email: satish@truvasolutions.com. Booking: https://calendly.com/satish-truvasolutions/30min.
