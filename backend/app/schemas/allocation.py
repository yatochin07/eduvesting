import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AllocationTargetInput(BaseModel):
    asset_class: str = Field(..., pattern="^(stock|crypto|gold|mutual_fund|cash)$")
    target_percentage: float = Field(ge=0, le=100)


class AllocationProfileCreate(BaseModel):
    profile_type: str = Field(..., pattern="^(conservative|moderate|aggressive|custom)$")
    targets: list[AllocationTargetInput]


class AllocationTargetRead(AllocationTargetInput):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID


class AllocationProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    user_id: uuid.UUID
    profile_type: str
    is_active: bool
    targets: list[AllocationTargetRead] = []
    created_at: datetime
