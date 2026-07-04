# HAPUS import yang lama:
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker

# GUNAKAN import async:
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# engine harus menggunakan create_async_engine
engine = create_async_engine(
    settings.DATABASE_URL, # PASTIKAN URL KAMU PAKAI "postgresql+asyncpg://"
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    echo=settings.DEBUG,
)

# SessionLocal harus menggunakan async_sessionmaker dan kelas AsyncSession
AsyncSessionLocal = async_sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine,
    class_=AsyncSession
)

# Fungsi get_db wajib menggunakan "async def" dan "async with"
async def get_db():
    """Dependency FastAPI: buka session per-request secara asinkron."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            # Karena session bersifat asinkron, penutupannya pun harus di-await
            await session.close()