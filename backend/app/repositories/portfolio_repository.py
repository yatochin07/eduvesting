from app.models.portfolio import PortfolioAsset
from app.repositories.base_repository import BaseRepository


class PortfolioRepository(BaseRepository[PortfolioAsset]):
    def __init__(self, db):
        super().__init__(PortfolioAsset, db)
