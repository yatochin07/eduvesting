"""
Endpoint Dashboard: mengagregasi ringkasan dari modul lain (portfolio,
transaksi, goals) menjadi satu response untuk halaman overview.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.goal_repository import GoalRepository
from app.repositories.portfolio_repository import PortfolioRepository
from app.services.portfolio_service import PortfolioService
from app.services.transaction_service import TransactionService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    portfolio_service = PortfolioService(db)
    transaction_service = TransactionService(db)
    goal_repo = GoalRepository(db)

    assets_with_market = await portfolio_service.list_assets_with_market_data(current_user.id)
    total_portfolio_value = sum(a.market_value or 0 for a in assets_with_market)
    total_unrealized_pnl = sum(a.unrealized_pnl or 0 for a in assets_with_market)

    from datetime import date

    today = date.today()
    monthly_summary = transaction_service.summary_by_month(current_user.id, today.year, today.month)

    goals = goal_repo.get_all_by_user(current_user.id, limit=5)

    return {
        "portfolio": {
            "total_value": total_portfolio_value,
            "total_unrealized_pnl": total_unrealized_pnl,
            "asset_count": len(assets_with_market),
        },
        "monthly_finance": monthly_summary,
        "recent_goals": [
            {"title": g.title, "target_amount": float(g.target_amount), "current_amount": float(g.current_amount)}
            for g in goals
        ],
    }
