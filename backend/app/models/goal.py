"""
Model Goal: target finansial jangka depan (mis. beli laptop, DP rumah, dll).
Tidak pakai API realtime, progress dihitung dari current_amount vs target_amount.
"""
import uuid
from datetime import date

from sqlalchemy import Date, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, TimestampMixin, UUIDMixin


class Goal(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "goals"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=True)
    target_amount: Mapped[float] = mapped_column(Numeric(20, 2), nullable=False)
    current_amount: Mapped[float] = mapped_column(Numeric(20, 2), default=0)
    target_date: Mapped[date] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="in_progress")  # in_progress|achieved|cancelled
