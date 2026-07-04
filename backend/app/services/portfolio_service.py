"""
PortfolioService: menggabungkan data dari database (kepemilikan user)
dengan harga realtime dari market_data_router. Ini contoh pola inti yang
dipakai berulang di modul lain yang butuh data realtime + histori DB.
"""
import uuid

from sqlalchemy.orm import Session

from app.repositories.portfolio_repository import PortfolioRepository
from app.schemas.portfolio import PortfolioAssetCreate, PortfolioAssetUpdate, PortfolioAssetWithMarketData
from app.services.market_data.router import market_data_router
from app.utils.logger import get_logger

logger = get_logger(__name__)


class PortfolioService:
    def __init__(self, db: Session):
        self.repo = PortfolioRepository(db)

    def list_assets(self, user_id: uuid.UUID):
        return self.repo.get_all_by_user(user_id)

    async def list_assets_with_market_data(self, user_id: uuid.UUID) -> list[PortfolioAssetWithMarketData]:
        assets = self.repo.get_all_by_user(user_id)
        results = []
        for asset in assets:
            enriched = PortfolioAssetWithMarketData.model_validate(asset)
            try:
                quote = await market_data_router.get_quote(asset.asset_type, asset.symbol)
                enriched.current_price = quote.price
                enriched.market_value = quote.price * float(asset.quantity)
                cost_basis = float(asset.average_buy_price) * float(asset.quantity)
                enriched.unrealized_pnl = enriched.market_value - cost_basis
                enriched.unrealized_pnl_percentage = (
                    (enriched.unrealized_pnl / cost_basis) * 100 if cost_basis > 0 else 0
                )
                enriched.price_source = quote.source
                enriched.price_updated_at = quote.fetched_at
            except Exception as exc:  # noqa: BLE001
                logger.warning(f"Gagal fetch harga untuk {asset.symbol}: {exc}")
            results.append(enriched)
        return results

    def create_asset(self, user_id: uuid.UUID, payload: PortfolioAssetCreate):
        return self.repo.create({**payload.model_dump(), "user_id": user_id})

    def update_asset(self, asset, payload: PortfolioAssetUpdate):
        return self.repo.update(asset, payload.model_dump(exclude_unset=True))

    def delete_asset(self, asset) -> None:
        self.repo.delete(asset)
