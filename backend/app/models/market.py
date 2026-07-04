"""
Model MarketWatchlistItem: simbol yang di-watch user di halaman Market
(disable RLS sesuai spek — dianggap data non-sensitif/semi-publik,
namun tetap difilter by user_id di level query untuk relevansi UX).
"""
import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, TimestampMixin, UUIDMixin


class MarketWatchlistItem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "market_watchlist_items"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    symbol: Mapped[str] = mapped_column(String(50), nullable=False)  # simbol format TradingView, mis. NASDAQ:AAPL
    label: Mapped[str] = mapped_column(String(100), nullable=True)
