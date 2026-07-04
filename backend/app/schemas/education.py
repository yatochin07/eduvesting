import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EducationContentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    title: str
    category: str
    summary: str | None = None
    content_body: str
    thumbnail_url: str | None = None
    created_at: datetime


class EducationProgressUpdate(BaseModel):
    is_completed: bool
