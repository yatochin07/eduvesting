"""TransactionService: pencatatan transaksi harian, tanpa API realtime."""
import uuid
from datetime import date

from sqlalchemy.orm import Session

from app.repositories.transaction_repository import TransactionRepository
from app.schemas.transaction import TransactionCreate, TransactionUpdate


class TransactionService:
    def __init__(self, db: Session):
        self.repo = TransactionRepository(db)

    def list_transactions(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100):
        return self.repo.get_all_by_user(user_id, skip, limit)

    def create_transaction(self, user_id: uuid.UUID, payload: TransactionCreate):
        return self.repo.create({**payload.model_dump(), "user_id": user_id})

    def update_transaction(self, tx, payload: TransactionUpdate):
        return self.repo.update(tx, payload.model_dump(exclude_unset=True))

    def delete_transaction(self, tx) -> None:
        self.repo.delete(tx)

    def summary_by_month(self, user_id: uuid.UUID, year: int, month: int) -> dict:
        """Dipakai oleh Dashboard untuk menampilkan ringkasan income vs expense."""
        transactions = (
            self.repo.db.query(self.repo.model)
            .filter(
                self.repo.model.user_id == user_id,
                self.repo.model.transaction_date >= date(year, month, 1),
            )
            .all()
        )
        income = sum(float(t.amount) for t in transactions if t.type == "income")
        expense = sum(float(t.amount) for t in transactions if t.type == "expense")
        investment = sum(float(t.amount) for t in transactions if t.type == "investment")
        return {"income": income, "expense": expense, "investment": investment, "net": income - expense}
