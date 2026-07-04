from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.insight import AIInsightRead, InsightGenerateRequest
from app.services.insight_service import InsightService

router = APIRouter(prefix="/insights", tags=["Insights"])


@router.post("/generate", response_model=AIInsightRead, status_code=status.HTTP_201_CREATED)
async def generate_insight(
    payload: InsightGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Analisis jejak finansial user memakai Groq AI, hasil disimpan sebagai histori."""
    service = InsightService(db)
    return await service.generate_insight(current_user.id, payload.insight_type)


@router.get("/history", response_model=list[AIInsightRead])
def list_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = InsightService(db)
    return service.list_history(current_user.id)
