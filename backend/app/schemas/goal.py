import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class GoalBase(BaseModel):
    title: str
    description: str | None = None
    target_amount: float = Field(gt=0)
    target_date: date | None = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    target_amount: float | None = None
    current_amount: float | None = None
    target_date: date | None = None
    status: str | None = Field(None, pattern="^(in_progress|achieved|cancelled)$")


class GoalRead(GoalBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    user_id: uuid.UUID
    current_amount: float
    status: str
    progress_percentage: float = 0
    created_at: datetime
