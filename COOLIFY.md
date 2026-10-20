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
3. Attach `https://truvasolutions.com` to the `frontend` service on port 80.
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
