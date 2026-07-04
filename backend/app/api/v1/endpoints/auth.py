from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, decode_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import GoogleAuthRequest, RefreshTokenRequest, Token
from app.schemas.user import UserRead
from app.services.auth_service import get_auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/google", response_model=Token)
async def login_with_google(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Login/register via Google OAuth. Frontend mengirim `code` yang didapat
    dari redirect Google Sign-In, backend menukarnya menjadi profil user
    lalu menerbitkan JWT milik EduVesting sendiri.
    """
    service = get_auth_service(db)
    result = await service.login_with_google(payload.code)
    return Token(
        access_token=result["access_token"],
        refresh_token=result["refresh_token"],
        user=UserRead.model_validate(result["user"]),
    )


@router.post("/refresh", response_model=dict)
def refresh_access_token(payload: RefreshTokenRequest):
    data = decode_token(payload.refresh_token)
    if data.get("type") != "refresh":
        raise ValueError("Token bukan refresh token.")
    new_access_token = create_access_token(subject=data["sub"])
    return {"access_token": new_access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
