"""
Client untuk Finnhub API - dipakai khusus untuk saham US.
Docs: https://finnhub.io/docs/api/quote
"""
from datetime import datetime, timezone

import httpx

from app.core.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

BASE_URL = "https://finnhub.io/api/v1"


class FinnhubClient:
    def __init__(self):
        self.api_key = settings.FINNHUB_API_KEY

    async def get_quote(self, symbol: str) -> dict:
        """
        Ambil kuotasi realtime saham US.
        Response Finnhub: c=current, d=change, dp=percent change, pc=previous close
        """
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{BASE_URL}/quote",
                params={"symbol": symbol.upper(), "token": self.api_key},
            )
            resp.raise_for_status()
            data = resp.json()

        if not data or data.get("c") in (None, 0):
            raise ValueError(f"Simbol saham US tidak ditemukan atau data kosong: {symbol}")

        return {
            "symbol": symbol.upper(),
            "price": data["c"],
            "change": data.get("d"),
            "change_percent": data.get("dp"),
            "source": "finnhub",
            "fetched_at": datetime.now(timezone.utc),
        }

    async def search_symbol(self, query: str) -> list[dict]:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{BASE_URL}/search", params={"q": query, "token": self.api_key}
            )
            resp.raise_for_status()
            return resp.json().get("result", [])


finnhub_client = FinnhubClient()
