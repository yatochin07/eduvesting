"""AllocationService: mengelola profil alokasi aset user."""
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.allocation_repository import AllocationRepository
from app.schemas.allocation import AllocationProfileCreate

PRESET_ALLOCATIONS = {
    "conservative": {"stock": 20, "mutual_fund": 40, "gold": 20, "cash": 20, "crypto": 0},
    "moderate": {"stock": 35, "mutual_fund": 30, "gold": 15, "cash": 10, "crypto": 10},
    "aggressive": {"stock": 45, "mutual_fund": 15, "gold": 5, "cash": 5, "crypto": 30},
}


class AllocationService:
    def __init__(self, db: AsyncSession):
        self.repo = AllocationRepository(db)

    async def list_profiles(self, user_id: uuid.UUID):
        return await self.repo.get_all_by_user(user_id)

    async def create_profile(self, user_id: uuid.UUID, payload: AllocationProfileCreate):
        # Hanya 1 profil aktif per user pada satu waktu
        await self.repo.deactivate_all(user_id)
        profile = await self.repo.create(
            {"user_id": user_id, "profile_type": payload.profile_type, "is_active": True}
        )
        await self.repo.add_targets(profile.id, [t.model_dump() for t in payload.targets])
        await self.repo.db.refresh(profile)
        return profile