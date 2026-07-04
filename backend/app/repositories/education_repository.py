from app.models.education import EducationContent, EducationProgress
from app.repositories.base_repository import BaseRepository


class EducationRepository(BaseRepository[EducationContent]):
    def __init__(self, db):
        super().__init__(EducationContent, db)

    def list_published(self, category: str | None = None):
        query = self.db.query(EducationContent).filter(EducationContent.is_published == True)  # noqa: E712
        if category:
            query = query.filter(EducationContent.category == category)
        return query.order_by(EducationContent.created_at.desc()).all()


class EducationProgressRepository(BaseRepository[EducationProgress]):
    def __init__(self, db):
        super().__init__(EducationProgress, db)

    def get_by_user_and_content(self, user_id, content_id):
        return (
            self.db.query(EducationProgress)
            .filter(EducationProgress.user_id == user_id, EducationProgress.content_id == content_id)
            .first()
        )
