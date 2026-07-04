"""
InsightService: mengumpulkan data dari modul lain (portfolio, transaksi,
goals, allocation) menjadi satu konteks finansial, mengirim ke Groq AI,
lalu menyimpan hasilnya sebagai histori insight.
"""
import uuid

from sqlalchemy.orm import Session

from app.repositories.allocation_repository import AllocationRepository
from app.repositories.goal_repository import GoalRepository
from app.repositories.insight_repository import InsightRepository
from app.repositories.portfolio_repository import PortfolioRepository
from app.repositories.transaction_repository import TransactionRepository
from app.services.ai.groq_client import groq_client


class InsightService:
    def __init__(self, db: Session):
        self.db = db
        self.insight_repo = InsightRepository(db)
        self.portfolio_repo = PortfolioRepository(db)
        self.transaction_repo = TransactionRepository(db)
        self.goal_repo = GoalRepository(db)
        self.allocation_repo = AllocationRepository(db)

    def _build_financial_context(self, user_id: uuid.UUID) -> dict:
        assets = self.portfolio_repo.get_all_by_user(user_id, limit=50)
        transactions = self.transaction_repo.get_all_by_user(user_id, limit=50)
        goals = self.goal_repo.get_all_by_user(user_id, limit=20)

        return {
            "portfolio": [
                {"asset_type": a.asset_type, "symbol": a.symbol, "quantity": float(a.quantity)}
                for a in assets
            ],
            "recent_transactions": [
                {"type": t.type, "category": t.category, "amount": float(t.amount), "date": str(t.transaction_date)}
                for t in transactions
            ],
            "goals": [
                {"title": g.title, "target": float(g.target_amount), "current": float(g.current_amount)}
                for g in goals
            ],
        }

    async def generate_insight(self, user_id: uuid.UUID, insight_type: str = "general"):
        context = self._build_financial_context(user_id)
        ai_result = await groq_client.generate_insight(context)

        return self.insight_repo.create(
            {
                "user_id": user_id,
                "insight_type": insight_type,
                "prompt_context": context,
                "summary": ai_result.get("summary", ""),
                "recommendations": {"items": ai_result.get("recommendations", [])},
            }
        )

    def list_history(self, user_id: uuid.UUID):
        return self.insight_repo.get_all_by_user(user_id)
