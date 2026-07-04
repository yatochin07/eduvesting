import logging
import asyncio
from fastapi import APIRouter, HTTPException
from typing import List

from app.schemas.market import QuoteResponse, MarketSnapshotResponse
from app.services.market_data.router import market_data_router
from app.core.cache import market_data_cache

router = APIRouter()
logger = logging.getLogger(__name__)

_SNAPSHOT_CACHE_KEY = "market_snapshot"

def format_price_idr(value: float) -> str:
    if value >= 1_000_000_000:
        return f"Rp {value / 1_000_000_000:.2f} M"
    elif value >= 1_000_000:
        return f"Rp {value / 1_000_000:.2f} Jt"
    else:
        return f"Rp {value:,.0f}"

# Dummy per-item, dipakai HANYA kalau provider spesifik itu yang gagal
DUMMY = {
    "btc": MarketSnapshotResponse(
        id="btc", symbol="BTC/IDR", name="Bitcoin (Offline)",
        priceFormatted="Rp 1.11 M", changePercent=0.00,
        icon="fa-brands fa-bitcoin", iconColor="text-amber-500", iconBg="bg-amber-500/10",
    ),
    "idx": MarketSnapshotResponse(
        id="idx", symbol="IHSG", name="Composite IDX (Offline)",
        priceFormatted="7,321.45", changePercent=0.00,
        icon="fa-solid fa-chart-line", iconColor="text-indigo-500", iconBg="bg-indigo-500/10",
    ),
    "xau": MarketSnapshotResponse(
        id="xau", symbol="XAU/IDR", name="Emas (Offline)",
        priceFormatted="Rp 1.35 Jt", changePercent=0.00,
        icon="fa-solid fa-coins", iconColor="text-yellow-400", iconBg="bg-yellow-400/10",
    ),
}

async def _safe_fetch(coro, label: str):
    """Bungkus tiap fetch supaya gagal satu provider tidak menjatuhkan semuanya."""
    try:
        return await coro
    except Exception:
        logger.error(f"Gagal mengambil data '{label}'", exc_info=True)
        return None

async def _build_snapshot() -> List[MarketSnapshotResponse]:
    # Menggunakan market_data_router (Facade) agar arsitektur tetap bersih
    btc_task = _safe_fetch(market_data_router.get_quote("crypto", "bitcoin"), "btc")
    ihsg_task = _safe_fetch(market_data_router.get_quote("idx_stock", "^JKSE"), "idx")
    xau_task = _safe_fetch(market_data_router.get_quote("crypto", "pax-gold"), "xau")

    btc_data, ihsg_data, paxg_data = await asyncio.gather(btc_task, ihsg_task, xau_task)

    result: List[MarketSnapshotResponse] = []

    if btc_data:
        result.append(MarketSnapshotResponse(
            id="btc", symbol="BTC/IDR", name="Bitcoin",
            priceFormatted=format_price_idr(btc_data.price), # Akses via dot notation (.price)
            changePercent=round(btc_data.change_percent, 2),
            icon="fa-brands fa-bitcoin", iconColor="text-amber-500", iconBg="bg-amber-500/10",
        ))
    else:
        result.append(DUMMY["btc"])

    if ihsg_data:
        result.append(MarketSnapshotResponse(
            id="idx", symbol="IHSG", name="Composite IDX",
            priceFormatted=f"{ihsg_data.price:,.2f}",
            changePercent=round(ihsg_data.change_percent, 2),
            icon="fa-solid fa-chart-line", iconColor="text-indigo-500", iconBg="bg-indigo-500/10",
        ))
    else:
        result.append(DUMMY["idx"])

    if paxg_data:
        harga_emas_per_gram = paxg_data.price / 31.1034768
        result.append(MarketSnapshotResponse(
            id="xau", symbol="XAU/IDR", name="Emas (1 gr)",
            priceFormatted=format_price_idr(harga_emas_per_gram),
            changePercent=round(paxg_data.change_percent, 2),
            icon="fa-solid fa-coins", iconColor="text-yellow-400", iconBg="bg-yellow-400/10",
        ))
    else:
        result.append(DUMMY["xau"])

    return result


# -------------------------------------------------------------
# 1. Endpoint Snapshot (YANG BARU)
# -------------------------------------------------------------
@router.get("/snapshot", response_model=List[MarketSnapshotResponse])
async def get_market_snapshot():
    # Cek Cache
    cached = market_data_cache.get(_SNAPSHOT_CACHE_KEY)
    if cached is not None:
        return cached

    # Jika tidak ada di cache, fetch baru
    result = await _build_snapshot()
    
    # Simpan ke cache
    market_data_cache[_SNAPSHOT_CACHE_KEY] = result
    
    return result


# -------------------------------------------------------------
# 2. Endpoint Quote Spesifik (YANG LAMA)
# -------------------------------------------------------------
@router.get("/quote/{asset_type}/{symbol}", response_model=QuoteResponse)
async def get_market_quote(asset_type: str, symbol: str):
    try:
        data = await market_data_router.get_quote(asset_type=asset_type, symbol=symbol)
        return data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil data pasar: {str(e)}")