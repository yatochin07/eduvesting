from app.models.allocation import AllocationProfile, AllocationTarget
from app.repositories.base_repository import BaseRepository


class AllocationRepository(BaseRepository[AllocationProfile]):
    def __init__(self, db):
        super().__init__(AllocationProfile, db)

    def add_targets(self, profile_id, targets: list[dict]) -> None:
        for t in targets:
            self.db.add(AllocationTarget(profile_id=profile_id, **t))
        self.db.commit()

    def deactivate_all(self, user_id) -> None:
        self.db.query(AllocationProfile).filter(
            AllocationProfile.user_id == user_id
        ).update({"is_active": False})
        self.db.commit()
