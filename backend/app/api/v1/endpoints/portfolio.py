import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.portfolio_repository import PortfolioRepository
from app.schemas.portfolio import PortfolioAssetCreate, PortfolioAssetRead, PortfolioAssetUpdate, PortfolioAssetWithMarketData
from app.services.portfolio_service import PortfolioService

# PERBAIKAN 1: Hapus prefix="/portfolio" di sini karena sudah disetel di router.py
router = APIRouter(tags=["Portfolio"])


@router.get("", response_model=list[PortfolioAssetWithMarketData])
async def list_portfolio(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """List aset portfolio user + harga realtime (finnhub/yfinance/coingecko sesuai asset_type)."""
    service = PortfolioService(db)
    return await service.list_assets_with_market_data(current_user.id)


@router.post("", response_model=PortfolioAssetRead, status_code=status.HTTP_201_CREATED)
async def add_asset(
    payload: PortfolioAssetCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PortfolioService(db)
    return await service.create_asset(current_user.id, payload)


# PERBAIKAN 2: Ubah @router.patch menjadi @router.put agar sinkron dengan apiClient.put() di frontend
@router.put("/{asset_id}", response_model=PortfolioAssetRead)
async def update_asset(
    asset_id: uuid.UUID,
    payload: PortfolioAssetUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = PortfolioRepository(db)
    asset = await repo.get(asset_id)
    if asset is None or asset.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Aset tidak ditemukan.")
    service = PortfolioService(db)
    return await service.update_asset(asset, payload)


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(
    asset_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = PortfolioRepository(db)
    asset = await repo.get(asset_id)
    if asset is None or asset.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Aset tidak ditemukan.")
    service = PortfolioService(db)
    await service.delete_asset(asset)