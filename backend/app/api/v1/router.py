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

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(dashboard.router)
api_router.include_router(portfolio.router)
api_router.include_router(transactions.router)
api_router.include_router(goals.router)
api_router.include_router(allocation.router)
api_router.include_router(insights.router)
api_router.include_router(education.router)
api_router.include_router(market.router)
api_router.include_router(calculator.router)
api_router.include_router(settings_endpoint.router)
