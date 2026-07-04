"""
Model AIInsight: hasil analisis AI (Groq) atas jejak finansial user,
disimpan agar histori insight bisa ditampilkan ulang tanpa perlu re-generate.
"""
import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, TimestampMixin, UUIDMixin


class AIInsight(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ai_insights"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    insight_type: Mapped[str] = mapped_column(String(50), default="general")  # general|portfolio|spending
    prompt_context: Mapped[dict] = mapped_column(JSONB, nullable=True)  # snapshot data yang dikirim ke AI
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    recommendations: Mapped[dict] = mapped_column(JSONB, nullable=True)
