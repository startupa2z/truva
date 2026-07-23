from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.config import settings
from app.database import Base, engine
from app.routers import auth

SITE_ROOT = Path("/site")

app = FastAPI(title="Truva Auth API", version="1.0.0")

def _cors_origins() -> list[str]:
    frontend = settings.frontend_url.rstrip("/")
    origins = {
        frontend,
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:8888",
        "http://127.0.0.1:8888",
    }
    if frontend.startswith("https://") and "://www." not in frontend:
        origins.add(frontend.replace("https://", "https://www.", 1))
    elif frontend.startswith("https://www."):
        origins.add(frontend.replace("https://www.", "https://", 1))
    return sorted(origins)


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    with engine.begin() as conn:
        conn.execute(
            text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo_url VARCHAR(2048)"
            )
        )


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/")
def root():
    index_path = SITE_ROOT / "index.html"
    if index_path.is_file():
        return FileResponse(index_path)
    return {
        "message": "Truva Auth API",
        "health": "/health",
        "docs": "/docs",
        "auth": {
            "signup": "POST /api/auth/signup",
            "signin": "POST /api/auth/signin",
            "linkedin_login": "GET /api/auth/linkedin/login",
            "linkedin_callback": "GET /api/auth/linkedin/callback",
        },
    }


if SITE_ROOT.is_dir():
    app.mount("/", StaticFiles(directory=str(SITE_ROOT), html=True), name="site")
