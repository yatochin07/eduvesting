"""
Client untuk CoinGecko API - dipakai untuk kripto dan emas (via token
tokenized gold seperti PAXG, atau proxy XAU jika tersedia).
Docs: https://docs.coingecko.com/reference/simple-price
"""
from datetime import datetime, timezone

import httpx

from app.core.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class CoinGeckoClient:
    def __init__(self):
        self.base_url = settings.COINGECKO_BASE_URL
        self.api_key = settings.COINGECKO_API_KEY

    def _headers(self) -> dict:
        headers = {"accept": "application/json"}
        if self.api_key:
            headers["x-cg-demo-api-key"] = self.api_key
        return headers

    async def get_quote(self, coin_id: str, vs_currency: str = "idr") -> dict:
        """
        coin_id contoh: 'bitcoin', 'ethereum', 'pax-gold' (representasi emas tokenized).
        """
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{self.base_url}/simple/price",
                params={
                    "ids": coin_id,
                    "vs_currencies": vs_currency,
                    "include_24hr_change": "true",
                },
                headers=self._headers(),
            )
            resp.raise_for_status()
            data = resp.json()

        if coin_id not in data:
            raise ValueError(f"Coin id tidak ditemukan di CoinGecko: {coin_id}")

        coin_data = data[coin_id]
        return {
            "symbol": coin_id,
            "price": coin_data.get(vs_currency),
            "change": None,
            "change_percent": coin_data.get(f"{vs_currency}_24h_change"),
            "source": "coingecko",
            "fetched_at": datetime.now(timezone.utc),
        }


coingecko_client = CoinGeckoClient()
