from app.models.market import MarketWatchlistItem
from app.repositories.base_repository import BaseRepository


class MarketWatchlistRepository(BaseRepository[MarketWatchlistItem]):
    def __init__(self, db):
        super().__init__(MarketWatchlistItem, db)
