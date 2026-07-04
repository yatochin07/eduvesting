"""AllocationService: mengelola profil alokasi aset user (konservatif/moderat/agresif/kustom)."""
import uuid

from sqlalchemy.orm import Session

from app.repositories.allocation_repository import AllocationRepository
from app.schemas.allocation import AllocationProfileCreate

# Template preset persentase alokasi (dipakai frontend sebagai starting point,
# user tetap bisa override dengan 'custom').
PRESET_ALLOCATIONS = {
    "conservative": {"stock": 20, "mutual_fund": 40, "gold": 20, "cash": 20, "crypto": 0},
    "moderate": {"stock": 35, "mutual_fund": 30, "gold": 15, "cash": 10, "crypto": 10},
    "aggressive": {"stock": 45, "mutual_fund": 15, "gold": 5, "cash": 5, "crypto": 30},
}


class AllocationService:
    def __init__(self, db: Session):
        self.repo = AllocationRepository(db)

    def list_profiles(self, user_id: uuid.UUID):
        return self.repo.get_all_by_user(user_id)

    def create_profile(self, user_id: uuid.UUID, payload: AllocationProfileCreate):
        # Hanya 1 profil aktif per user pada satu waktu
        self.repo.deactivate_all(user_id)
        profile = self.repo.create({"user_id": user_id, "profile_type": payload.profile_type, "is_active": True})
        self.repo.add_targets(profile.id, [t.model_dump() for t in payload.targets])
        self.repo.db.refresh(profile)
        return profile
