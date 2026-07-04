"""
AuthService: orkestrasi proses login Google OAuth -> cari/buat user di DB
-> terbitkan JWT access & refresh token milik EduVesting sendiri.
"""
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.security import create_access_token, create_refresh_token
from app.repositories.user_repository import UserRepository
from app.services.google_oauth import google_oauth_service


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    async def login_with_google(self, code: str) -> dict:
        profile = await google_oauth_service.exchange_code_for_profile(code)

        user = self.user_repo.get_by_google_sub(profile["google_sub"])
        if user is None:
            user = self.user_repo.get_by_email(profile["email"])

        if user is None:
            user = self.user_repo.create(
                {
                    "email": profile["email"],
                    "full_name": profile["full_name"],
                    "avatar_url": profile["avatar_url"],
                    "google_sub": profile["google_sub"],
                    "last_login_at": datetime.now(timezone.utc),
                }
            )
        else:
            user = self.user_repo.update(
                user,
                {
                    "google_sub": profile["google_sub"],
                    "full_name": profile["full_name"],
                    "avatar_url": profile["avatar_url"],
                    "last_login_at": datetime.now(timezone.utc),
                },
            )

        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)

        return {"access_token": access_token, "refresh_token": refresh_token, "user": user}


def get_auth_service(db: Session) -> AuthService:
    return AuthService(db)
