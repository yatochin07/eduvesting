from datetime import datetime
import uuid

from pydantic import BaseModel, ConfigDict, Field


class CompoundInterestRequest(BaseModel):
    initial_amount: float = Field(ge=0)
    monthly_contribution: float = Field(ge=0)
    annual_return_rate: float = Field(gt=0, le=100)
    duration_years: int = Field(gt=0, le=60)
    save_history: bool = True


class YearlyProjection(BaseModel):
    year: int
    contributed: float
    total_value: float
    interest_earned: float


class CompoundInterestResponse(BaseModel):
    projections: list[YearlyProjection]
    final_value: float
    total_contributed: float
    total_interest: float


class CalculatorHistoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    calculator_type: str
    initial_amount: float
    monthly_contribution: float
    annual_return_rate: float
    duration_years: int
    result_projection: dict | None = None
    created_at: datetime
