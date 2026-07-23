from datetime import datetime, timedelta, timezone
from typing import Annotated
from urllib.parse import urlencode
import uuid

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from jose import JWTError, jwt
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    SignInRequest,
    SignUpRequest,
    UpdateProfileRequest,
    UserResponse,
)
from app.services.linkedin_oauth import (
    build_linkedin_authorize_url,
    exchange_code_for_tokens,
    fetch_linkedin_userinfo,
    generate_oauth_state,
)
from app.services.security import create_access_token, decode_access_token, hash_password, verify_password
from app.services.user_service import (
    create_user_with_password,
    get_user_by_email,
    get_user_by_id,
    update_user_profile,
    upsert_user,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

DbSession = Annotated[Session, Depends(get_db)]


def _encode_oauth_state(payload: dict) -> str:
    body = {
        **payload,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=10),
    }
    return jwt.encode(body, settings.secret_key, algorithm="HS256")


def _decode_oauth_state(state: str) -> dict:
    try:
        return jwt.decode(state, settings.secret_key, algorithms=["HS256"])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OAuth state.",
        ) from exc


def _auth_response(user: User) -> AuthResponse:
    token = create_access_token(str(user.id), {"email": user.email})
    return AuthResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


def _profile_complete(user: User) -> bool:
    return bool(user.organization and user.role)


def get_current_user(
    db: DbSession,
    authorization: Annotated[str | None, Header()] = None,
) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated.",
        )

    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = decode_access_token(token)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        ) from exc

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload.",
        )

    try:
        parsed_id = uuid.UUID(str(user_id))
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload.",
        ) from exc

    user = get_user_by_id(db, parsed_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def sign_up(payload: SignUpRequest, db: DbSession):
    existing = get_user_by_email(db, payload.email)
    if existing and existing.password_hash:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    try:
        user = create_user_with_password(
            db,
            email=payload.email,
            password_hash=hash_password(payload.password),
            full_name=payload.full_name.strip(),
            organization=payload.organization.strip(),
            role=payload.role.strip(),
        )
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Unable to create account with the provided details.",
        ) from exc

    return _auth_response(user)


@router.post("/signin", response_model=AuthResponse)
def sign_in(payload: SignInRequest, db: DbSession):
    user = get_user_by_email(db, payload.email)
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    return _auth_response(user)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: CurrentUser):
    return UserResponse.model_validate(current_user)


@router.patch("/me", response_model=UserResponse)
def update_me(payload: UpdateProfileRequest, db: DbSession, current_user: CurrentUser):
    user = update_user_profile(
        db,
        current_user,
        organization=payload.organization,
        role=payload.role,
    )
    return UserResponse.model_validate(user)


@router.get("/linkedin/setup")
def linkedin_setup():
    """Return the exact OAuth values to register in the LinkedIn Developer Portal."""
    return {
        "redirect_uri": settings.linkedin_redirect_uri,
        "scopes": "openid profile email",
        "client_id_configured": bool(settings.linkedin_client_id),
        "client_secret_configured": bool(settings.linkedin_client_secret),
        "linkedin_portal": "https://www.linkedin.com/developers/apps",
        "required_product": "Sign In with LinkedIn using OpenID Connect",
        "register_redirect_uri_under": "Auth tab -> Authorized redirect URLs for your app",
        "redirect_uri_must_match_exactly": settings.linkedin_redirect_uri,
        "common_mistakes": [
            "Using https instead of http for localhost",
            "Using 127.0.0.1 instead of localhost (they are different to LinkedIn)",
            "Adding a trailing slash: /callback/ vs /callback",
            "OIDC product not enabled on the LinkedIn app",
        ],
    }


@router.get("/linkedin/login")
def linkedin_login(
    tab: str = Query(default="signin"),
    full_name: str | None = Query(default=None),
    organization: str | None = Query(default=None),
    role: str | None = Query(default=None),
):
    if not settings.linkedin_client_id or not settings.linkedin_client_secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="LinkedIn OAuth is not configured.",
        )

    state_payload = {
        "nonce": generate_oauth_state(),
        "tab": tab,
        "full_name": full_name.strip() if full_name else None,
        "organization": organization.strip() if organization else None,
        "role": role.strip() if role else None,
    }
    state = _encode_oauth_state(state_payload)
    return RedirectResponse(build_linkedin_authorize_url(state), status_code=status.HTTP_302_FOUND)


@router.get("/linkedin/callback")
async def linkedin_callback(
    db: DbSession,
    code: str | None = Query(default=None),
    state: str | None = Query(default=None),
    error: str | None = Query(default=None),
    error_description: str | None = Query(default=None),
):
    if error:
        message = error_description or error
        return RedirectResponse(
            f"{settings.frontend_url}?{urlencode({'auth_error': message})}",
            status_code=status.HTTP_302_FOUND,
        )

    if not code or not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing authorization code or state.",
        )

    state_data = _decode_oauth_state(state)

    try:
        token_payload = await exchange_code_for_tokens(code)
        access_token = token_payload["access_token"]
        profile = await fetch_linkedin_userinfo(access_token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to exchange LinkedIn authorization code.",
        ) from exc

    email = profile.get("email")
    if not email:
        return RedirectResponse(
            f"{settings.frontend_url}?{urlencode({'auth_error': 'LinkedIn did not return an email address.'})}",
            status_code=status.HTTP_302_FOUND,
        )

    linkedin_id = profile.get("sub")
    profile_name = profile.get("name") or profile.get("given_name") or email.split("@")[0]
    profile_photo_url = profile.get("picture")
    full_name = state_data.get("full_name") or profile_name
    organization = state_data.get("organization")
    role = state_data.get("role")

    user = upsert_user(
        db,
        email=email,
        full_name=full_name,
        organization=organization,
        role=role,
        linkedin_id=linkedin_id,
        profile_photo_url=profile_photo_url,
    )

    auth = _auth_response(user)
    params: dict[str, str] = {"auth_token": auth.access_token}
    if not _profile_complete(user):
        params["auth_needs_profile"] = "1"
    return RedirectResponse(
        f"{settings.frontend_url}?{urlencode(params)}",
        status_code=status.HTTP_302_FOUND,
    )
