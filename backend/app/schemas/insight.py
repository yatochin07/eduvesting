import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InsightGenerateRequest(BaseModel):
    insight_type: str = "general"  # general | portfolio | spending


class AIInsightRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    user_id: uuid.UUID
    insight_type: str
    summary: str
    recommendations: dict | None = None
    created_at: datetime
