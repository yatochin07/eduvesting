"""
Import semua model di sini supaya Alembic autogenerate bisa mendeteksinya
lewat Base.metadata. File ini TIDAK dipakai langsung oleh aplikasi,
hanya dipakai oleh alembic/env.py.
"""
from app.db.base_class import Base  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.portfolio import PortfolioAsset  # noqa: F401
from app.models.transaction import Transaction  # noqa: F401
from app.models.goal import Goal  # noqa: F401
from app.models.allocation import AllocationProfile, AllocationTarget  # noqa: F401
from app.models.insight import AIInsight  # noqa: F401
from app.models.education import EducationContent, EducationProgress  # noqa: F401
from app.models.market import MarketWatchlistItem  # noqa: F401
from app.models.calculator import CalculatorHistory  # noqa: F401
