import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.portfolio_repository import PortfolioRepository
from app.schemas.portfolio import PortfolioAssetCreate, PortfolioAssetUpdate, PortfolioAssetWithMarketData
from app.services.market_data.router import market_data_router
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Kamus terjemahan untuk CoinGecko (Python menggunakan # untuk komentar)
COINGECKO_IDS = {
    "BTC": "bitcoin", "ETH": "ethereum", "BNB": "binancecoin",
    "SOL": "solana", "USDT": "tether", "USDC": "usd-coin",
    "ADA": "cardano", "XRP": "ripple", "DOGE": "dogecoin",
    "MATIC": "polygon-ecosystem-token", "AVAX": "avalanche-2",
    "DOT": "polkadot", "LTC": "litecoin", "TRX": "tron", "LINK": "chainlink"
}

class PortfolioService:
    def __init__(self, db: AsyncSession):
        self.repo = PortfolioRepository(db)

    async def list_assets(self, user_id: uuid.UUID):
        return await self.repo.get_all_by_user(user_id)

    async def list_assets_with_market_data(self, user_id: uuid.UUID) -> list[PortfolioAssetWithMarketData]:
        assets = await self.repo.get_all_by_user(user_id)
        results = []
        
        for asset in assets:
            try:
                enriched = PortfolioAssetWithMarketData.model_validate(asset)
            except Exception as e:
                logger.error(f"Data DB tidak valid untuk aset {getattr(asset, 'symbol', 'Unknown')}: {e}")
                continue

            a_type_str = str(asset.asset_type).replace("AssetType.", "").lower()
            search_symbol = str(asset.symbol).strip()
            
            try:
                # 1. TRANSLASI TICKER
                if a_type_str == "crypto":
                    search_symbol = COINGECKO_IDS.get(search_symbol.upper(), search_symbol.lower())
                elif a_type_str == "gold":
                    search_symbol = "pax-gold"

                # 2. TEMBAK API
                quote = await market_data_router.get_quote(asset.asset_type, search_symbol)
                
                if isinstance(quote, dict):
                    price = float(quote.get("price", 0))
                else:
                    price = float(getattr(quote, "price", 0))
                    
                # 3. KONVERSI EMAS
                if a_type_str == "gold" and price > 0:
                    price = price / 31.1034768

                # 4. KALKULASI METRIK DASAR
                enriched.current_price = price
                qty = float(asset.quantity)
                
                enriched.market_value = price * qty
                cost_basis = float(asset.average_buy_price) * qty
                
                enriched.unrealized_pnl = enriched.market_value - cost_basis
                enriched.unrealized_pnl_percentage = (
                    (enriched.unrealized_pnl / cost_basis) * 100 if cost_basis > 0 else 0
                )
                
                if isinstance(quote, dict):
                    enriched.price_source = quote.get("source", "unknown")
                    enriched.price_updated_at = quote.get("fetched_at")
                else:
                    enriched.price_source = getattr(quote, "source", "unknown")
                    enriched.price_updated_at = getattr(quote, "fetched_at", None)
                    
            except Exception as exc:
                logger.warning(f"Gagal fetch harga untuk {search_symbol}: {exc}")
                enriched.current_price = 0
                enriched.market_value = 0
                enriched.unrealized_pnl = 0
                enriched.unrealized_pnl_percentage = 0
                
            results.append(enriched)
            
        return results

    async def create_asset(self, user_id: uuid.UUID, payload: PortfolioAssetCreate):
        return await self.repo.create({**payload.model_dump(), "user_id": user_id})

    async def update_asset(self, asset, payload: PortfolioAssetUpdate):
        return await self.repo.update(asset, payload.model_dump(exclude_unset=True))

    async def delete_asset(self, asset) -> None:
        await self.repo.delete(asset)