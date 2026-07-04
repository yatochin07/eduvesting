"""
BaseRepository generik: satu kelas yang dipakai ulang (reusable) oleh semua
repository modul lain. Ini inti dari layered architecture -> Router hanya
bicara ke Service, Service hanya bicara ke Repository, Repository hanya
bicara ke DB session. Jangan skip layer ini walau tergoda shortcut.
"""
import uuid
from typing import Generic, TypeVar

from sqlalchemy.orm import Session

from app.db.base_class import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: type[ModelType], db: Session):
        self.model = model
        self.db = db

    def get(self, id: uuid.UUID) -> ModelType | None:
        return self.db.query(self.model).filter(self.model.id == id).first()

    def get_all_by_user(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[ModelType]:
        return (
            self.db.query(self.model)
            .filter(self.model.user_id == user_id)
            .order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create(self, obj_in: dict) -> ModelType:
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, db_obj: ModelType, obj_in: dict) -> ModelType:
        for field, value in obj_in.items():
            if value is not None:
                setattr(db_obj, field, value)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, db_obj: ModelType) -> None:
        self.db.delete(db_obj)
        self.db.commit()
