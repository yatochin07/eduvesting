"""Fetch data saham US dari Finnhub.io"""
import httpx
from ...core.config import get_settings
from ...core.cache import market_data_cache

settings = get_settings()
BASE_URL = "https://finnhub.io/api/v1"

class FinnhubClient:
    async def get_quote(self, symbol: str) -> dict:
        cache_key = f"finnhub:{symbol}"
        if cache_key in market_data_cache:
            return market_data_cache[cache_key]

        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(
                f"{BASE_URL}/quote",
                # Pastikan token menggunakan huruf kapital sesuai config
                params={"symbol": symbol, "token": settings.FINNHUB_API_KEY},
            )
            res.raise_for_status()
            data = res.json()

        result = {
            "symbol": symbol,
            "price": data.get("c"),
            "change_percent": data.get("dp"),
            "source": "finnhub",
        }
        market_data_cache[cache_key] = result
        return result

# INI BAGIAN PALING PENTING: Membuat instance dari class
finnhub_client = FinnhubClient()