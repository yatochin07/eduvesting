from app.models.calculator import CalculatorHistory
from app.repositories.base_repository import BaseRepository


class CalculatorRepository(BaseRepository[CalculatorHistory]):
    def __init__(self, db):
        super().__init__(CalculatorHistory, db)
