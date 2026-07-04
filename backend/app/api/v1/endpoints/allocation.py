from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.allocation import AllocationProfileCreate, AllocationProfileRead
from app.services.allocation_service import PRESET_ALLOCATIONS, AllocationService

router = APIRouter(prefix="/allocation", tags=["Allocation"])


@router.get("/presets")
def get_presets():
    """Preset persentase untuk konservatif/moderat/agresif, dipakai frontend sbg starting point."""
    return PRESET_ALLOCATIONS


@router.get("", response_model=list[AllocationProfileRead])
def list_profiles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = AllocationService(db)
    return service.list_profiles(current_user.id)


@router.post("", response_model=AllocationProfileRead, status_code=status.HTTP_201_CREATED)
def create_profile(
    payload: AllocationProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AllocationService(db)
    return service.create_profile(current_user.id, payload)
