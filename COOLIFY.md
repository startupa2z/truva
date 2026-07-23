# Deploy Truva on Coolify

Your Coolify project has:
- **1 application** → `https://truvasolutions.com`
- **1 PostgreSQL database** → `truva` DB with `users` table

Choose **one** deployment style below.

---

## Option A — Single domain (no `api` subdomain) **recommended**

Everything runs on `https://truvasolutions.com`:
- `/` → static site
- `/api/*` → FastAPI (proxied by frontend nginx)
- **No extra DNS record needed**

### How it works

```
Browser → truvasolutions.com
            ├─ /           → nginx serves HTML/CSS/JS
            └─ /api/*      → nginx proxies to backend:8000
                                    └─ PostgreSQL (truva DB)
```

### Coolify setup

1. **Replace** your current application with a **Docker Compose** resource  
   (or create new and delete the old one after cutover)

2. **Compose file**: `docker-compose.prod.yml` (repo root)

3. **Domain**: attach `https://truvasolutions.com` to the **`frontend`** service only  
   (backend has no public domain)

4. **Environment variables** (project or compose env):

```env
DATABASE_URL=postgresql://USER:PASSWORD@INTERNAL_POSTGRES_HOST:5432/truva
SECRET_KEY=<long-random-string>
FRONTEND_URL=https://truvasolutions.com
LINKEDIN_CLIENT_ID=<your-linkedin-client-id>
LINKEDIN_CLIENT_SECRET=<your-linkedin-client-secret>
LINKEDIN_REDIRECT_URI=https://truvasolutions.com/api/auth/linkedin/callback
```

`DATABASE_URL`: copy the **internal** Postgres URL from your Coolify PostgreSQL resource and set the database name to `truva`.

5. **Do not set** `TRUVA_API_BASE` — the frontend uses the same origin automatically.

6. **LinkedIn Developer Portal** → Authorized redirect URL:

```
https://truvasolutions.com/api/auth/linkedin/callback
```

7. Redeploy.

### Verify

1. `https://truvasolutions.com` → site loads  
2. `https://truvasolutions.com/health` → `{"status":"ok"}`  
3. Sign In → LinkedIn → profile popup → photo in nav  

---

## Option B — Two subdomains (`api.truvasolutions.com`)

Use two separate Coolify **Application** resources (see previous sections in git history). Requires an extra DNS **A record** for `api`.

| App | Base dir | Domain |
|-----|----------|--------|
| Frontend | `/frontend` | `truvasolutions.com` |
| Backend | `/backend` | `api.truvasolutions.com` |

Frontend env: `TRUVA_API_BASE=https://api.truvasolutions.com`

---

## PostgreSQL

You already ran `backend/sql/init.sql` on the `truva` database. No further SQL is required unless you add new tables.

The backend also runs `create_all()` and adds `profile_photo_url` on startup if missing.

---

## Local development (unchanged)

```bash
docker compose up -d
```

- Frontend: http://localhost:8888  
- Backend: http://localhost:8000  
- Auth JS auto-detects port `8888` and calls backend on `:8000`

For local single-domain testing:

```bash
API_PROXY_BACKEND=http://host.docker.internal:8000 TRUVA_API_BASE= docker compose -f docker-compose.prod.yml up --build
```

(Only if you want to test the prod compose layout locally.)
