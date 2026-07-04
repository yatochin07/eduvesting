"""TransactionService: pencatatan transaksi harian, tanpa API realtime."""
import uuid
from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.transaction_repository import TransactionRepository
from app.schemas.transaction import TransactionCreate, TransactionUpdate


class TransactionService:
    def __init__(self, db: AsyncSession):
        self.repo = TransactionRepository(db)

    async def list_transactions(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100):
        return await self.repo.get_all_by_user(user_id, skip, limit)

    async def create_transaction(self, user_id: uuid.UUID, payload: TransactionCreate):
        return await self.repo.create({**payload.model_dump(), "user_id": user_id})

    async def update_transaction(self, tx, payload: TransactionUpdate):
        return await self.repo.update(tx, payload.model_dump(exclude_unset=True))

    async def delete_transaction(self, tx) -> None:
        await self.repo.delete(tx)

    async def summary_by_month(self, user_id: uuid.UUID, year: int, month: int) -> dict:
        """Dipakai oleh Dashboard untuk menampilkan ringkasan income vs expense."""
        result = await self.repo.db.execute(
            select(self.repo.model).where(
                self.repo.model.user_id == user_id,
                self.repo.model.transaction_date >= date(year, month, 1),
            )
        )
        transactions = result.scalars().all()
        income = sum(float(t.amount) for t in transactions if t.type == "income")
        expense = sum(float(t.amount) for t in transactions if t.type == "expense")
        investment = sum(float(t.amount) for t in transactions if t.type == "investment")
        return {"income": income, "expense": expense, "investment": investment, "net": income - expense}