"""GoalService: target finansial dan progressnya, tanpa API realtime."""
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.goal_repository import GoalRepository
from app.schemas.goal import GoalCreate, GoalRead, GoalUpdate


class GoalService:
    def __init__(self, db: AsyncSession):
        self.repo = GoalRepository(db)

    @staticmethod
    def _with_progress(goal) -> GoalRead:
        data = GoalRead.model_validate(goal)
        if data.target_amount > 0:
            data.progress_percentage = round(min(data.current_amount / data.target_amount * 100, 100), 2)
        return data

    async def list_goals(self, user_id: uuid.UUID) -> list[GoalRead]:
        goals = await self.repo.get_all_by_user(user_id)
        return [self._with_progress(g) for g in goals]

    async def create_goal(self, user_id: uuid.UUID, payload: GoalCreate):
        return await self.repo.create({**payload.model_dump(), "user_id": user_id})

    async def update_goal(self, goal, payload: GoalUpdate):
        return await self.repo.update(goal, payload.model_dump(exclude_unset=True))

    async def delete_goal(self, goal) -> None:
        await self.repo.delete(goal)