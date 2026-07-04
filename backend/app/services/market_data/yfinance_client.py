"""
Client untuk yfinance - dipakai untuk saham IDX (kode ".JK") dan reksadana.
yfinance bersifat sinkron & blocking, jadi dipanggil lewat run_in_executor
agar tidak memblok event loop FastAPI.
"""
import asyncio
from datetime import datetime, timezone

import yfinance as yf

from app.utils.logger import get_logger

logger = get_logger(__name__)


def _fetch_quote_sync(symbol: str) -> dict:
    ticker = yf.Ticker(symbol)
    info = ticker.fast_info  # lebih ringan daripada ticker.info

    price = info.get("last_price")
    previous_close = info.get("previous_close")

    if price is None:
        raise ValueError(f"Simbol tidak ditemukan di yfinance: {symbol}")

    change = None
    change_percent = None
    if previous_close:
        change = price - previous_close
        change_percent = (change / previous_close) * 100

    return {
        "symbol": symbol,
        "price": float(price),
        "change": change,
        "change_percent": change_percent,
        "source": "yfinance",
        "fetched_at": datetime.now(timezone.utc),
    }


class YFinanceClient:
    async def get_quote(self, symbol: str) -> dict:
        """
        symbol contoh: 'BBCA.JK' (saham IDX) atau kode reksadana yang tersedia di Yahoo Finance.
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _fetch_quote_sync, symbol)


yfinance_client = YFinanceClient()
