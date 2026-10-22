# Deploy Truva on Coolify

Truva uses one Docker Compose resource with three services:

```text
Browser -> frontend (Nginx and Astro)
             |-> /api/* and /health -> backend (FastAPI)
                                           |-> db (PostgreSQL)
```

Only the frontend is public. FastAPI and PostgreSQL remain on the private Compose network.

## Coolify configuration

1. Create or update the Truva resource as Docker Compose.
2. Use `docker-compose.prod.yml` from the repository root.
3. Attach a temporary domain to the `frontend` service on internal port 80. The Compose file exposes that port only to Docker; Coolify owns the public ports. Switch `https://truvasolutions.com` only after the parallel deployment passes.
4. Set these secrets in Coolify:

```env
POSTGRES_PASSWORD=<long-random-database-password>
ADMIN_TOKEN=<long-random-admin-token>
FRONTEND_ORIGIN=https://truvasolutions.com
SOURCE_COMMIT=<deployed-git-commit>
```

5. Keep the `postgres_data` volume attached to the `db` service.
6. Configure encrypted PostgreSQL backups outside the application server.

Do not publish ports for `backend` or `db`. Do not copy local PostgreSQL data into production.

## Verification

After deployment, verify:

1. `/health` returns `status: ok`, the deployed commit, and `database: postgres`.
2. `/`, `/resources`, `/security-hub`, and the affected article routes return 200.
3. `/api/views` records and deduplicates a valid page event.
4. `/admin/community` rejects an invalid token and accepts the production `ADMIN_TOKEN`.
5. The frontend, backend, and database services are healthy.

## Local development

```bash
docker compose up -d --build
```

- Frontend: http://127.0.0.1:8888
- FastAPI: http://127.0.0.1:8000
- PostgreSQL: private Docker network only
- Local admin token: `local-development-admin-key-change-me`, unless overridden with `ADMIN_TOKEN`


## Existing production cutover

The existing Dockerfile application and its SQLite `/data` volume are the rollback source. Do not replace their configuration or delete their storage to deploy the new stack.

1. Inspect the existing application, failed deployment, environment variable names, storage mounts, and PostgreSQL resource. Keep secret values out of output.
2. Confirm comments remain disabled in the new product. Historical comments are preserved privately during migration; the old public moderation API is not re-enabled.
3. Create a separate Truva Compose application with a temporary domain and a separate PostgreSQL volume. Keep the old PostgreSQL resource intact.
4. Capture a consistent SQLite snapshot with SQLite's backup API, including WAL contents. Keep it on the production host with restricted permissions. Verify integrity and record row counts only.
5. Reuse the owner-approved admin credential through the secret store. Set a new database credential and bind `SOURCE_COMMIT` to the release revision.
6. Initialize the new database using FastAPI. Before generating test analytics, run `python -m app.migrate_sqlite /path/to/snapshot.sqlite` inside the backend with the snapshot mounted read-only. This is inspection only.
7. Compare the reported source totals with the production snapshot inventory, then run the same command with `--apply`. The utility requires an empty destination, imports in one transaction, verifies counts, and archives historical comments in a private table. It never alters the source file. Expiring view-event deduplication records are not imported.
8. Verify the temporary domain, all three services, asset responses, redirects, admin authentication and analytics reads after an admin overview. Browser testing should send DNT to avoid polluting counts before verification.
9. Present migration totals and the rollback mapping before domain cutover. Keep the old application and all old volumes intact.
10. Switch only the Truva production domain through Coolify. Verify `/health` identifies PostgreSQL and the release revision, and verify the live Resources, service, article, FAQ and booking routes.

Rollback: return the production domain to the prior healthy application and its untouched SQLite volume. Preserve any new PostgreSQL records from the cutover window for later reconciliation; do not overwrite either database with local data.
