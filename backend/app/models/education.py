"""
Model EducationContent (konten statis edukasi investasi, disable RLS -> publik read-only)
dan EducationProgress (progress baca per user, enable RLS agar privat).
"""
import uuid

from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, TimestampMixin, UUIDMixin


class EducationContent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "education_contents"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # basic|stocks|crypto|mutual_fund|risk
    summary: Mapped[str] = mapped_column(String(500), nullable=True)
    content_body: Mapped[str] = mapped_column(Text, nullable=False)
    thumbnail_url: Mapped[str] = mapped_column(String(500), nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)


class EducationProgress(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "education_progress"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    content_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("education_contents.id", ondelete="CASCADE"), index=True
    )
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
