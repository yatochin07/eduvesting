import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class TransactionBase(BaseModel):
    type: str = Field(..., pattern="^(income|expense|investment)$")
    category: str
    amount: float = Field(gt=0)
    description: str | None = None
    transaction_date: date


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    category: str | None = None
    amount: float | None = None
    description: str | None = None
    transaction_date: date | None = None


class TransactionRead(TransactionBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
