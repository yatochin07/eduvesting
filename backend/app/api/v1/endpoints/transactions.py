import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.transaction_repository import TransactionRepository
from app.schemas.transaction import TransactionCreate, TransactionRead, TransactionUpdate
from app.services.transaction_service import TransactionService

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=list[TransactionRead])
def list_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=500),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TransactionService(db)
    return service.list_transactions(current_user.id, skip, limit)


@router.post("", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
def create_transaction(
    payload: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TransactionService(db)
    return service.create_transaction(current_user.id, payload)


@router.patch("/{tx_id}", response_model=TransactionRead)
def update_transaction(
    tx_id: uuid.UUID,
    payload: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    repo = TransactionRepository(db)
    tx = repo.get(tx_id)
    if tx is None or tx.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan.")
    service = TransactionService(db)
    return service.update_transaction(tx, payload)


@router.delete("/{tx_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    tx_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    repo = TransactionRepository(db)
    tx = repo.get(tx_id)
    if tx is None or tx.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Transaksi tidak ditemukan.")
    service = TransactionService(db)
    service.delete_transaction(tx)
