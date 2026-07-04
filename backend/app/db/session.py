"""
Setup SQLAlchemy engine & session factory.
Menggunakan connection pool standar untuk Supabase Postgres (pgbouncer-aware).
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# pool_pre_ping penting untuk koneksi ke Supabase yang bisa idle-timeout
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency FastAPI: buka session per-request, selalu ditutup di finally."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
