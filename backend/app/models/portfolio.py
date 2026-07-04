"""
Model PortfolioAsset: aset yang dimiliki user (saham US, IDX, reksadana, kripto, emas).
`asset_type` menentukan sumber API mana yang dipakai saat fetch harga realtime
(lihat services/market_data/*).
"""
import uuid

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, TimestampMixin, UUIDMixin


class PortfolioAsset(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "portfolio_assets"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )

    # us_stock | idx_stock | mutual_fund | crypto | gold
    asset_type: Mapped[str] = mapped_column(String(30), nullable=False)
    symbol: Mapped[str] = mapped_column(String(50), nullable=False)  # AAPL, BBCA.JK, bitcoin, XAU, dll
    name: Mapped[str] = mapped_column(String(255), nullable=True)

    quantity: Mapped[float] = mapped_column(Numeric(20, 8), nullable=False)
    average_buy_price: Mapped[float] = mapped_column(Numeric(20, 8), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="IDR")

    notes: Mapped[str] = mapped_column(String(1000), nullable=True)
