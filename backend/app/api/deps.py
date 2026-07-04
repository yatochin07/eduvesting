"""
Dependency bersama untuk semua endpoint:
- get_db: session database per-request
- get_current_user: memverifikasi JWT dari header Authorization dan
  mengembalikan objek User. Dipakai di HAMPIR SEMUA endpoint (kecuali
  endpoint publik seperti /auth/google dan /education untuk baca publik).
"""
import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = credentials.credentials
    try:
        payload = decode_token(token)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid, silakan login kembali.",
        ) from exc

    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Tipe token salah.")

    user_id = payload.get("sub")
    
    # PERUBAHAN: Gunakan await karena method get() sekarang asinkron
    user = await UserRepository(db).get(uuid.UUID(user_id))

    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User tidak ditemukan/nonaktif.")

    return user