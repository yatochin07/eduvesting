from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.calculator import CalculatorHistoryRead, CompoundInterestRequest, CompoundInterestResponse
from app.services.calculator_service import CalculatorService

router = APIRouter(prefix="/calculator", tags=["Calculator"])


@router.post("/compound-interest", response_model=CompoundInterestResponse)
def calculate_compound_interest(
    payload: CompoundInterestRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = CalculatorService(db)
    return service.calculate(current_user.id, payload)


@router.get("/history", response_model=list[CalculatorHistoryRead])
def list_calculator_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = CalculatorService(db)
    return service.list_history(current_user.id)
