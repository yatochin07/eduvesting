import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PortfolioAssetBase(BaseModel):
    asset_type: str = Field(..., pattern="^(us_stock|idx_stock|mutual_fund|crypto|gold)$")
    symbol: str
    name: str | None = None
    quantity: float = Field(gt=0)
    average_buy_price: float = Field(ge=0)
    currency: str = "IDR"
    notes: str | None = None


class PortfolioAssetCreate(PortfolioAssetBase):
    pass


class PortfolioAssetUpdate(BaseModel):
    quantity: float | None = None
    average_buy_price: float | None = None
    notes: str | None = None


class PortfolioAssetRead(PortfolioAssetBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class PortfolioAssetWithMarketData(PortfolioAssetRead):
    """Response gabungan data DB + harga realtime dari provider terkait."""
    current_price: float | None = None
    market_value: float | None = None
    unrealized_pnl: float | None = None
    unrealized_pnl_percentage: float | None = None
    price_source: str | None = None
    price_updated_at: datetime | None = None
