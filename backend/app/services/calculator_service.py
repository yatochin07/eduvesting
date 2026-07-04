"""
CalculatorService: simulasi compound interest / kalkulator investasi masa depan.
Murni komputasi matematis, tidak ada API realtime, tapi hasil bisa disimpan
sebagai histori (calculator_history) sesuai preferensi user.
"""
import uuid

from sqlalchemy.orm import Session

from app.repositories.calculator_repository import CalculatorRepository
from app.schemas.calculator import CompoundInterestRequest, CompoundInterestResponse, YearlyProjection


class CalculatorService:
    def __init__(self, db: Session):
        self.repo = CalculatorRepository(db)

    @staticmethod
    def _simulate(payload: CompoundInterestRequest) -> CompoundInterestResponse:
        monthly_rate = (payload.annual_return_rate / 100) / 12
        balance = payload.initial_amount
        total_contributed = payload.initial_amount
        projections: list[YearlyProjection] = []

        for year in range(1, payload.duration_years + 1):
            for _ in range(12):
                balance += payload.monthly_contribution
                balance *= 1 + monthly_rate
                total_contributed += payload.monthly_contribution
            projections.append(
                YearlyProjection(
                    year=year,
                    contributed=round(total_contributed, 2),
                    total_value=round(balance, 2),
                    interest_earned=round(balance - total_contributed, 2),
                )
            )

        return CompoundInterestResponse(
            projections=projections,
            final_value=round(balance, 2),
            total_contributed=round(total_contributed, 2),
            total_interest=round(balance - total_contributed, 2),
        )

    def calculate(self, user_id: uuid.UUID, payload: CompoundInterestRequest) -> CompoundInterestResponse:
        result = self._simulate(payload)

        if payload.save_history:
            self.repo.create(
                {
                    "user_id": user_id,
                    "calculator_type": "compound_interest",
                    "initial_amount": payload.initial_amount,
                    "monthly_contribution": payload.monthly_contribution,
                    "annual_return_rate": payload.annual_return_rate,
                    "duration_years": payload.duration_years,
                    "result_projection": result.model_dump(),
                }
            )
        return result

    def list_history(self, user_id: uuid.UUID):
        return self.repo.get_all_by_user(user_id)
