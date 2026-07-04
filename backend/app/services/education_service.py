"""EducationService: konten edukasi publik + progress baca per user."""
import uuid

from sqlalchemy.orm import Session

from app.repositories.education_repository import EducationProgressRepository, EducationRepository


class EducationService:
    def __init__(self, db: Session):
        self.content_repo = EducationRepository(db)
        self.progress_repo = EducationProgressRepository(db)

    def list_content(self, category: str | None = None):
        return self.content_repo.list_published(category)

    def mark_progress(self, user_id: uuid.UUID, content_id: uuid.UUID, is_completed: bool):
        progress = self.progress_repo.get_by_user_and_content(user_id, content_id)
        if progress is None:
            return self.progress_repo.create(
                {"user_id": user_id, "content_id": content_id, "is_completed": is_completed}
            )
        return self.progress_repo.update(progress, {"is_completed": is_completed})
