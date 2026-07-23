# Truva Auth Backend

FastAPI backend with PostgreSQL and LinkedIn OpenID Connect (OIDC) social login.

## Structure

```
backend/
  app/
    main.py                 # FastAPI application entrypoint
    config.py               # Environment settings
    database.py             # SQLAlchemy engine and session
    models/user.py          # PostgreSQL users table model
    schemas/auth.py         # Request/response schemas
    routers/auth.py         # Sign in, sign up, LinkedIn OAuth routes
    services/
      linkedin_oauth.py     # OIDC authorization + token exchange
      user_service.py       # Upsert logic for social login
      security.py           # Password hashing and JWT helpers
  sql/init.sql              # Reference SQL for users table
  requirements.txt
  Dockerfile
  .env.example
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/signup` | Register with email, password, full name, organization, role |
| `POST` | `/api/auth/signin` | Email/password login |
| `GET` | `/api/auth/linkedin/login` | Start LinkedIn OIDC flow |
| `GET` | `/api/auth/linkedin/callback` | Exchange authorization code and upsert user |
| `GET` | `/health` | Health check |

## Users Table

- `email` — unique, required
- `full_name` — required
- `organization`, `role` — optional profile fields
- `linkedin_id` — optional unique LinkedIn subject (`sub`)
- `password_hash` — optional for social-only accounts

LinkedIn callback uses PostgreSQL `INSERT ... ON CONFLICT (email) DO UPDATE` upsert logic so returning users update profile fields instead of failing on duplicate email.

## Local Development

1. Copy environment file:

```bash
cp backend/.env.example backend/.env
```

2. Start PostgreSQL and API with Docker:

```bash
docker compose up --build
```

3. Serve the static site (from repo root):

```bash
python3 -m http.server 8888
```

4. Open [http://localhost:8888](http://localhost:8888) and click **Sign In**.

## LinkedIn OIDC Setup

1. Create an app at [LinkedIn Developer Portal](https://www.linkedin.com/developers/).
2. Enable **Sign In with LinkedIn using OpenID Connect**.
3. Add redirect URL: `http://localhost:8000/api/auth/linkedin/callback`
4. Set `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` in `backend/.env`.

## Run Backend Without Docker

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Ensure PostgreSQL is running and `DATABASE_URL` matches your instance.
