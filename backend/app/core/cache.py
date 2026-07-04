from cachetools import TTLCache
from app.core.config import get_settings

settings = get_settings()

# Cache in-memory sederhana untuk menahan rate-limit API eksternal
# (Finnhub, GoAPI, CoinGecko, Yahoo Finance, TradingView).
# Untuk multi-instance Cloud Run skala besar, ganti dengan Redis (Upstash/Memorystore).
market_data_cache: TTLCache = TTLCache(maxsize=1000, ttl=settings.MARKET_CACHE_TTL_SECONDS)
