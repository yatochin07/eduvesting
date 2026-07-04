import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.education import EducationContentRead, EducationProgressUpdate
from app.services.education_service import EducationService

router = APIRouter(prefix="/education", tags=["Education"])


@router.get("", response_model=list[EducationContentRead])
def list_education_content(category: str | None = None, db: Session = Depends(get_db)):
    """Publik (tidak wajib login) — konten edukasi investasi, RLS disabled."""
    service = EducationService(db)
    return service.list_content(category)


@router.post("/{content_id}/progress")
def update_progress(
    content_id: uuid.UUID,
    payload: EducationProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = EducationService(db)
    progress = service.mark_progress(current_user.id, content_id, payload.is_completed)
    return {"content_id": content_id, "is_completed": progress.is_completed}
