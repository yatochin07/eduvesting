from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import hash_password, verify_password
from app.db.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import ChangePasswordRequest

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fallback untuk user yang punya password (bukan murni Google OAuth).
    Jika user login khusus via Google (hashed_password kosong), endpoint
    ini akan menolak karena tidak ada password untuk diverifikasi.
    """
    if not current_user.hashed_password:
        raise HTTPException(
            status_code=400,
            detail="Akun ini login via Google, tidak memiliki password untuk diubah.",
        )
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Password saat ini salah.")

    repo = UserRepository(db)
    repo.update(current_user, {"hashed_password": hash_password(payload.new_password)})
    return {"message": "Password berhasil diubah."}
