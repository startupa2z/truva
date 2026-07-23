import secrets
from urllib.parse import urlencode

import httpx

from app.config import settings

LINKEDIN_SCOPES = "openid profile email"


def build_linkedin_authorize_url(state: str) -> str:
    params = {
        "response_type": "code",
        "client_id": settings.linkedin_client_id,
        "redirect_uri": settings.linkedin_redirect_uri,
        "scope": LINKEDIN_SCOPES,
        "state": state,
    }
    return f"{settings.linkedin_authorize_url}?{urlencode(params)}"


def generate_oauth_state() -> str:
    return secrets.token_urlsafe(32)


async def exchange_code_for_tokens(code: str) -> dict:
    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(
            settings.linkedin_token_url,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": settings.linkedin_redirect_uri,
                "client_id": settings.linkedin_client_id,
                "client_secret": settings.linkedin_client_secret,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        response.raise_for_status()
        return response.json()


async def fetch_linkedin_userinfo(access_token: str) -> dict:
    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(
            settings.linkedin_userinfo_url,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        response.raise_for_status()
        return response.json()
