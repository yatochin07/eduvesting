from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.market_repository import MarketWatchlistRepository
from app.schemas.market import QuoteResponse, WatchlistItemCreate, WatchlistItemRead
from app.services.market_data.finnhub_client import finnhub_client
from app.services.market_service import MarketService

router = APIRouter(prefix="/market", tags=["Market"])


@router.get("/watchlist", response_model=list[WatchlistItemRead])
def list_watchlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = MarketService(db)
    return service.list_watchlist(current_user.id)


@router.post("/watchlist", response_model=WatchlistItemRead, status_code=status.HTTP_201_CREATED)
def add_watchlist_item(
    payload: WatchlistItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = MarketService(db)
    return service.add_watchlist_item(current_user.id, payload.symbol, payload.label)


@router.delete("/watchlist/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_watchlist_item(item_id, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = MarketWatchlistRepository(db)
    item = repo.get(item_id)
    if item is None or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item tidak ditemukan.")
    service = MarketService(db)
    service.remove_watchlist_item(item)


@router.get("/search")
async def search_symbol(q: str):
    """Bantuan pencarian simbol saham US (dipakai saat menambah watchlist / aset portfolio)."""
    return await finnhub_client.search_symbol(q)
