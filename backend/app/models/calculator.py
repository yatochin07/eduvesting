"""
Model CalculatorHistory: menyimpan histori simulasi kalkulator investasi
(compound interest / goal-based) supaya user bisa melihat simulasi sebelumnya.
Disable RLS sesuai spek — dianggap non-sensitif, tapi tetap difilter per user_id.
"""
import uuid

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, TimestampMixin, UUIDMixin


class CalculatorHistory(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "calculator_history"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    calculator_type: Mapped[str] = mapped_column(String(30), default="compound_interest")
    initial_amount: Mapped[float] = mapped_column(Numeric(20, 2), nullable=False)
    monthly_contribution: Mapped[float] = mapped_column(Numeric(20, 2), default=0)
    annual_return_rate: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    duration_years: Mapped[int] = mapped_column(nullable=False)
    result_projection: Mapped[dict] = mapped_column(JSONB, nullable=True)  # array proyeksi per tahun
