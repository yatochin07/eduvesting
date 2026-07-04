"""MarketService: watchlist user + proxy quote untuk halaman Market (dipakai bersama widget TradingView)."""
import uuid

from sqlalchemy.orm import Session

from app.repositories.market_repository import MarketWatchlistRepository


class MarketService:
    def __init__(self, db: Session):
        self.repo = MarketWatchlistRepository(db)

    def list_watchlist(self, user_id: uuid.UUID):
        return self.repo.get_all_by_user(user_id)

    def add_watchlist_item(self, user_id: uuid.UUID, symbol: str, label: str | None):
        return self.repo.create({"user_id": user_id, "symbol": symbol, "label": label})

    def remove_watchlist_item(self, item):
        self.repo.delete(item)
