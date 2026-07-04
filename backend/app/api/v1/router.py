"""Router utama v1: menggabungkan semua router endpoint per modul."""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    allocation,
    auth,
    calculator,
    dashboard,
    education,
    goals,
    insights,
    market,
    portfolio,
    settings as settings_endpoint,
    transactions,
    users,
)

api_router = APIRouter()

# Tambahkan prefix dan tags untuk setiap router agar URL-nya sesuai modul
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(portfolio.router, prefix="/portfolio", tags=["Portfolio"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
api_router.include_router(goals.router, prefix="/goals", tags=["Goals"])
api_router.include_router(allocation.router, prefix="/allocation", tags=["Allocation"])
api_router.include_router(insights.router, prefix="/insights", tags=["Insights"])
api_router.include_router(education.router, prefix="/education", tags=["Education"])

# INI KUNCI UTAMANYA: Mengarahkan rute snapshot ke /market/snapshot
api_router.include_router(market.router, prefix="/market", tags=["Market"]) 

api_router.include_router(calculator.router, prefix="/calculator", tags=["Calculator"])
api_router.include_router(settings_endpoint.router, prefix="/settings", tags=["Settings"])