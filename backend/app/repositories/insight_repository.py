from app.models.insight import AIInsight
from app.repositories.base_repository import BaseRepository


class InsightRepository(BaseRepository[AIInsight]):
    def __init__(self, db):
        super().__init__(AIInsight, db)
