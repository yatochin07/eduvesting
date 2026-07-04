from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import create_access_token, create_refresh_token
from app.repositories.user_repository import UserRepository

# Pastikan import service google_oauth kamu sudah benar sesuai lokasinya
from app.services.google_oauth import google_oauth_service 

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def login_with_google(self, code: str) -> dict:
        # 1. Panggil API Google
        profile = await google_oauth_service.exchange_code_for_profile(code)

        # 2. Cari / Simpan Database (Sudah pakai await)
        user = await self.user_repo.get_by_google_sub(profile["google_sub"])
        if user is None:
            user = await self.user_repo.get_by_email(profile["email"])

        if user is None:
            user = await self.user_repo.create({
                "email": profile["email"],
                "full_name": profile["full_name"],
                "avatar_url": profile["avatar_url"],
                "google_sub": profile["google_sub"],
                # Hapus label timezone (offset-naive) agar diterima oleh asyncpg
                "last_login_at": datetime.now(timezone.utc).replace(tzinfo=None),
            })
        else:
            user = await self.user_repo.update(
                user,
                {
                    "google_sub": profile["google_sub"],
                    "full_name": profile["full_name"],
                    "avatar_url": profile["avatar_url"],
                    # Hapus label timezone (offset-naive) agar diterima oleh asyncpg
                    "last_login_at": datetime.now(timezone.utc).replace(tzinfo=None),
                },
            )

        # 3. Terbitkan Token
        access_token = create_access_token(subject=str(user.id))
        refresh_token = create_refresh_token(subject=str(user.id))

        # 4. Ubah format dari model SQLAlchemy ke dictionary biasa
        # SESUAIKAN DENGAN SKEMA UserRead AGAR TIDAK ERROR VALIDASI
        user_data = {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url,
            "is_active": user.is_active,
            "created_at": user.created_at, # <--- SEKARANG SUDAH DITAMBAHKAN
        }

        return {"access_token": access_token, "refresh_token": refresh_token, "user": user_data}

def get_auth_service(db: AsyncSession) -> AuthService:
    return AuthService(db)