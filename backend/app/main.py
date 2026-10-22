from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import date, datetime, timedelta, timezone
import hashlib
import hmac
import os
import re
import secrets
import time
from threading import Lock

from fastapi import Cookie, FastAPI, HTTPException, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool


DATABASE_URL = os.environ["DATABASE_URL"]
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://127.0.0.1:8888").rstrip("/")
ADMIN_TOKEN = os.environ["ADMIN_TOKEN"]
RELEASE_COMMIT = os.getenv("RELEASE_COMMIT", "unknown")
SESSION_SECONDS = 3600
EVENT_SECONDS = 1800
PUBLIC_FIXED_PATHS = {
    "/",
    "/privacy",
    "/resources",
    "/security-hub",
    "/security-hub/guides",
    "/services",
}
PUBLIC_PREFIXES = ("/blog/", "/resources/", "/security-hub/", "/services/")
ID_PATTERN = re.compile(r"^[-a-zA-Z0-9]{16,80}$")


class ViewEvent(BaseModel):
    path: str = Field(min_length=1, max_length=240)
    eventId: str
    visitorId: str | None = None


class AdminLogin(BaseModel):
    token: str = Field(min_length=1, max_length=512)


class RateLimiter:
    def __init__(self) -> None:
        self._records: dict[str, tuple[int, float]] = {}
        self._lock = Lock()

    def check(self, key: str, maximum: int, seconds: int) -> None:
        now = time.monotonic()
        with self._lock:
            count, expires = self._records.get(key, (0, now + seconds))
            if expires < now:
                count, expires = 0, now + seconds
            count += 1
            self._records[key] = (count, expires)
            if len(self._records) > 10000:
                self._records = {k: v for k, v in self._records.items() if v[1] >= now}
        if count > maximum:
            raise HTTPException(429, "Too many requests. Please try again later.")


pool = ConnectionPool(DATABASE_URL, min_size=1, max_size=8, open=False)
limits = RateLimiter()


def initialize_database() -> None:
    statements = """
    CREATE TABLE IF NOT EXISTS views (
      day date NOT NULL,
      path text NOT NULL,
      count bigint NOT NULL DEFAULT 0,
      PRIMARY KEY (day, path)
    );
    CREATE TABLE IF NOT EXISTS view_events (
      id char(64) PRIMARY KEY,
      expires_at timestamptz NOT NULL
    );
    CREATE INDEX IF NOT EXISTS view_events_expiry ON view_events (expires_at);
    CREATE TABLE IF NOT EXISTS visitors (
      day date NOT NULL,
      id char(64) NOT NULL,
      PRIMARY KEY (day, id)
    );
    CREATE INDEX IF NOT EXISTS visitors_day ON visitors (day);
    """
    with pool.connection() as connection:
        connection.execute(statements)


@asynccontextmanager
async def lifespan(_: FastAPI):
    pool.open(wait=True)
    initialize_database()
    yield
    pool.close()


app = FastAPI(title="Truva Website API", docs_url=None, redoc_url=None, lifespan=lifespan)


@app.exception_handler(HTTPException)
async def http_error(_: Request, exc: HTTPException):
    return JSONResponse({"error": exc.detail}, status_code=exc.status_code)


@app.exception_handler(RequestValidationError)
async def validation_error(_: Request, __: RequestValidationError):
    return JSONResponse({"error": "Invalid request."}, status_code=400)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Cache-Control"] = "no-store"
    return response


def require_origin(request: Request) -> None:
    if request.headers.get("origin") != FRONTEND_ORIGIN:
        raise HTTPException(403, "Origin not allowed.")


def client_key(request: Request, kind: str) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    address = forwarded.split(",")[0].strip() or (request.client.host if request.client else "unknown")
    return hashlib.sha256(f"{address}:{kind}".encode()).hexdigest()


def digest(value: str) -> str:
    return hmac.new(ADMIN_TOKEN.encode(), value.encode(), hashlib.sha256).hexdigest()


def valid_public_path(path: str) -> bool:
    return (
        path in PUBLIC_FIXED_PATHS
        or any(path.startswith(prefix) and len(path) > len(prefix) for prefix in PUBLIC_PREFIXES)
    ) and not any(part in path for part in ("..", "?", "#"))


def session_cookie(expires: int) -> str:
    signature = digest(f"session:{expires}")
    return f"{expires}.{signature}"


def require_admin(cookie: str | None) -> None:
    try:
        expires_text, signature = (cookie or "").split(".", 1)
        expires = int(expires_text)
    except (TypeError, ValueError):
        raise HTTPException(401, "Sign in required.")
    expected = digest(f"session:{expires}")
    if expires < int(time.time()) or not secrets.compare_digest(signature, expected):
        raise HTTPException(401, "Sign in required.")


@app.get("/health")
def health():
    with pool.connection() as connection:
        connection.execute("SELECT 1").fetchone()
    return {"status": "ok", "commit": RELEASE_COMMIT, "database": "postgres"}


@app.post("/api/views")
def record_view(event: ViewEvent, request: Request):
    require_origin(request)
    limits.check(client_key(request, "views"), 100, 60)
    if not valid_public_path(event.path):
        raise HTTPException(400, "Unknown page.")
    if not ID_PATTERN.fullmatch(event.eventId):
        raise HTTPException(400, "Invalid event.")
    if event.visitorId is not None and not ID_PATTERN.fullmatch(event.visitorId):
        raise HTTPException(400, "Invalid visitor.")
    now = datetime.now(timezone.utc)
    event_id = digest(f"{event.path}:{event.eventId}")
    with pool.connection() as connection:
        with connection.transaction():
            connection.execute("DELETE FROM view_events WHERE expires_at < %s", (now,))
            inserted = connection.execute(
                "INSERT INTO view_events(id, expires_at) VALUES (%s, %s) ON CONFLICT DO NOTHING RETURNING id",
                (event_id, now + timedelta(seconds=EVENT_SECONDS)),
            ).fetchone()
            if inserted:
                connection.execute(
                    "INSERT INTO views(day, path, count) VALUES (%s, %s, 1) "
                    "ON CONFLICT(day, path) DO UPDATE SET count=views.count+1",
                    (now.date(), event.path),
                )
            if event.visitorId:
                connection.execute(
                    "INSERT INTO visitors(day, id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (now.date(), digest(f"visitor:{event.visitorId}")),
                )
            connection.execute("DELETE FROM visitors WHERE day < %s", (now.date() - timedelta(days=30),))
        total = connection.execute(
            "SELECT COALESCE(SUM(count), 0) FROM views WHERE path=%s", (event.path,)
        ).fetchone()[0]
    return {"views": total}


@app.get("/api/views")
def get_views(path: str):
    if not valid_public_path(path) or not path.startswith("/blog/"):
        raise HTTPException(404, "Unknown article.")
    with pool.connection() as connection:
        total = connection.execute(
            "SELECT COALESCE(SUM(count), 0) FROM views WHERE path=%s", (path,)
        ).fetchone()[0]
    return {"views": total}


@app.post("/api/admin/session")
def login(data: AdminLogin, request: Request, response: Response):
    require_origin(request)
    limits.check(client_key(request, "login"), 10, 900)
    if not secrets.compare_digest(data.token, ADMIN_TOKEN):
        raise HTTPException(401, "Invalid admin key.")
    expires = int(time.time()) + SESSION_SECONDS
    response.set_cookie(
        "truva_admin",
        session_cookie(expires),
        max_age=SESSION_SECONDS,
        httponly=True,
        secure=FRONTEND_ORIGIN.startswith("https://"),
        samesite="strict",
        path="/api/admin",
    )
    return {"ok": True}


@app.post("/api/admin/logout")
def logout(request: Request, response: Response, truva_admin: str | None = Cookie(default=None)):
    require_origin(request)
    require_admin(truva_admin)
    response.delete_cookie("truva_admin", path="/api/admin")
    return {"ok": True}


@app.get("/api/admin/overview")
def overview(truva_admin: str | None = Cookie(default=None)):
    require_admin(truva_admin)
    today = date.today()
    since = today - timedelta(days=29)
    with pool.connection() as connection:
        with connection.cursor(row_factory=dict_row) as cursor:
            visitors_today = cursor.execute(
                "SELECT COUNT(*) AS total FROM visitors WHERE day=%s", (today,)
            ).fetchone()["total"]
            visitors_30 = cursor.execute(
                "SELECT COUNT(DISTINCT id) AS total FROM visitors WHERE day >= %s", (since,)
            ).fetchone()["total"]
            total_views = cursor.execute("SELECT COALESCE(SUM(count), 0) AS total FROM views").fetchone()["total"]
            pages = cursor.execute(
                "SELECT path, SUM(count) AS views FROM views GROUP BY path ORDER BY views DESC, path"
            ).fetchall()
            days = cursor.execute(
                "SELECT v.day, SUM(v.count) AS views, "
                "(SELECT COUNT(*) FROM visitors x WHERE x.day=v.day) AS visitors "
                "FROM views v GROUP BY v.day ORDER BY v.day DESC LIMIT 30"
            ).fetchall()
    return {
        "visitorsToday": visitors_today,
        "visitors30Days": visitors_30,
        "totalViews": total_views,
        "pages": pages,
        "days": [{**row, "day": row["day"].isoformat()} for row in days],
    }
