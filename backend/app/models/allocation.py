"""
Model AllocationProfile & AllocationTarget: profil alokasi aset user
(konservatif/agresif/moderat/kustom) beserta target persentase per kelas aset.
Tidak pakai API realtime — murni preferensi/rencana user.
"""
import uuid

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base, TimestampMixin, UUIDMixin


class AllocationProfile(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "allocation_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    profile_type: Mapped[str] = mapped_column(String(20), nullable=False)  # conservative|moderate|aggressive|custom
    is_active: Mapped[bool] = mapped_column(default=True)


class AllocationTarget(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "allocation_targets"

    profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("allocation_profiles.id", ondelete="CASCADE"), index=True
    )
    asset_class: Mapped[str] = mapped_column(String(30), nullable=False)  # stock|crypto|gold|mutual_fund|cash
    target_percentage: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
