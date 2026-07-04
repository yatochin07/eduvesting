"""MarketService: watchlist user + proxy quote untuk halaman Market."""
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.market_repository import MarketWatchlistRepository


class MarketService:
    def __init__(self, db: AsyncSession):
        self.repo = MarketWatchlistRepository(db)

    async def list_watchlist(self, user_id: uuid.UUID):
        return await self.repo.get_all_by_user(user_id)

    async def add_watchlist_item(self, user_id: uuid.UUID, symbol: str, label: str | None):
        return await self.repo.create({"user_id": user_id, "symbol": symbol, "label": label})

    async def remove_watchlist_item(self, item):
        await self.repo.delete(item)