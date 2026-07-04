from app.schemas.market import QuoteResponse
from app.services.market_data.coingecko_client import coingecko_client
# Pastikan dua file client di bawah ini juga sudah Anda buat format class-nya
from app.services.market_data.finnhub_client import finnhub_client
from app.services.market_data.yfinance_client import yfinance_client

# Mapping asset_type -> provider
ASSET_TYPE_PROVIDER_MAP = {
    "us_stock": "finnhub",
    "idx_stock": "yfinance",
    "mutual_fund": "yfinance",
    "crypto": "coingecko",
    "gold": "coingecko",
}

class MarketDataRouter:
    async def get_quote(self, asset_type: str, symbol: str) -> QuoteResponse:
        provider = ASSET_TYPE_PROVIDER_MAP.get(asset_type)
        if provider is None:
            raise ValueError(f"asset_type tidak dikenali: {asset_type}")

        if provider == "finnhub":
            data = await finnhub_client.get_quote(symbol)
        elif provider == "yfinance":
            data = await yfinance_client.get_quote(symbol)
        elif provider == "coingecko":
            data = await coingecko_client.get_quote(symbol)
        else:
            raise ValueError(f"Provider tidak diimplementasikan: {provider}")

        # Return langsung berupa objek skema Pydantic
        return QuoteResponse(**data)

# Instance tunggal yang akan diekspor dan dipakai oleh API Endpoint
market_data_router = MarketDataRouter()