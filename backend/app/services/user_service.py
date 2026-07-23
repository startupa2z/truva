import uuid

from sqlalchemy import func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.user import User


def upsert_user(
    db: Session,
    *,
    email: str,
    full_name: str,
    organization: str | None = None,
    role: str | None = None,
    linkedin_id: str | None = None,
    profile_photo_url: str | None = None,
    password_hash: str | None = None,
) -> User:
    """Insert a user or update profile fields when the email already exists."""
    insert_stmt = insert(User).values(
        email=email.lower(),
        full_name=full_name,
        organization=organization,
        role=role,
        linkedin_id=linkedin_id,
        profile_photo_url=profile_photo_url,
        password_hash=password_hash,
    )

    update_values: dict = {
        "full_name": insert_stmt.excluded.full_name,
        "updated_at": func.now(),
    }

    if organization is not None:
        update_values["organization"] = insert_stmt.excluded.organization
    if role is not None:
        update_values["role"] = insert_stmt.excluded.role
    if linkedin_id is not None:
        update_values["linkedin_id"] = insert_stmt.excluded.linkedin_id
    if profile_photo_url is not None:
        update_values["profile_photo_url"] = insert_stmt.excluded.profile_photo_url
    if password_hash is not None:
        update_values["password_hash"] = insert_stmt.excluded.password_hash

    stmt = insert_stmt.on_conflict_do_update(
        index_elements=[User.email],
        set_=update_values,
    ).returning(User)

    user = db.execute(stmt).scalar_one()
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.lower()).one_or_none()


def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).one_or_none()


def update_user_profile(
    db: Session,
    user: User,
    *,
    organization: str,
    role: str,
) -> User:
    user.organization = organization.strip()
    user.role = role.strip()
    db.commit()
    db.refresh(user)
    return user


def create_user_with_password(
    db: Session,
    *,
    email: str,
    password_hash: str,
    full_name: str,
    organization: str,
    role: str,
) -> User:
    return upsert_user(
        db,
        email=email,
        full_name=full_name,
        organization=organization,
        role=role,
        password_hash=password_hash,
    )
