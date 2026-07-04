import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.goal_repository import GoalRepository
from app.schemas.goal import GoalCreate, GoalRead, GoalUpdate
from app.services.goal_service import GoalService

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.get("", response_model=list[GoalRead])
def list_goals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = GoalService(db)
    return service.list_goals(current_user.id)


@router.post("", response_model=GoalRead, status_code=status.HTTP_201_CREATED)
def create_goal(payload: GoalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = GoalService(db)
    return service.create_goal(current_user.id, payload)


@router.patch("/{goal_id}", response_model=GoalRead)
def update_goal(
    goal_id: uuid.UUID,
    payload: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    repo = GoalRepository(db)
    goal = repo.get(goal_id)
    if goal is None or goal.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Goal tidak ditemukan.")
    service = GoalService(db)
    return service.update_goal(goal, payload)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: uuid.UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = GoalRepository(db)
    goal = repo.get(goal_id)
    if goal is None or goal.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Goal tidak ditemukan.")
    service = GoalService(db)
    service.delete_goal(goal)
