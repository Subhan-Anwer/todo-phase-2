from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer
from sqlmodel import Session
from typing import List, Optional
from src.models.task import TaskCreate, TaskRead, TaskUpdate, TaskListResponse
from src.models.user import User
from src.services.task_service import TaskService
from src.core.database import get_db_session
from src.core.security import verify_token
from src.core.config import settings


router = APIRouter()
security = HTTPBearer()


def get_current_user(token: str = Depends(security)) -> User:
    """Get current user from JWT token."""
    payload = verify_token(token.credentials)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # In a real implementation, you would fetch the user from the database
    # For now, we'll just return a basic user object
    return User(id=user_id, email=payload.get("email", ""), is_active=True)


@router.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_create: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Create a new task for the authenticated user."""
    task_service = TaskService(db)

    # Create the task with the current user's ID
    db_task = task_service.create_task(task_create, str(current_user.id))

    return TaskRead(
        id=db_task.id,
        title=db_task.title,
        description=db_task.description,
        completed=db_task.completed,
        user_id=db_task.user_id,
        created_at=db_task.created_at,
        updated_at=db_task.updated_at,
        due_date=db_task.due_date
    )


@router.get("/tasks", response_model=TaskListResponse)
async def get_tasks(
    current_user: User = Depends(get_current_user),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    sort_by: str = Query("created_at", description="Field to sort by"),
    order: str = Query("desc", description="Sort order (asc/desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Number of items per page"),
    db: Session = Depends(get_db_session)
):
    """Get all tasks for the authenticated user with pagination and filtering."""
    task_service = TaskService(db)

    tasks, total_count = task_service.get_tasks_for_user(
        user_id=str(current_user.id),
        completed=completed,
        sort_by=sort_by,
        order=order,
        page=page,
        limit=limit
    )

    # Calculate pagination metadata
    total_pages = (total_count + limit - 1) // limit

    return TaskListResponse(
        data=[
            TaskRead(
                id=task.id,
                title=task.title,
                description=task.description,
                completed=task.completed,
                user_id=task.user_id,
                created_at=task.created_at,
                updated_at=task.updated_at,
                due_date=task.due_date
            ) for task in tasks
        ],
        pagination={
            "page": page,
            "limit": limit,
            "total": total_count,
            "total_pages": total_pages
        }
    )


@router.get("/tasks/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Get a specific task for the authenticated user."""
    task_service = TaskService(db)

    db_task = task_service.get_task_by_id(task_id, str(current_user.id))

    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or you don't have permission to access it"
        )

    return TaskRead(
        id=db_task.id,
        title=db_task.title,
        description=db_task.description,
        completed=db_task.completed,
        user_id=db_task.user_id,
        created_at=db_task.created_at,
        updated_at=db_task.updated_at,
        due_date=db_task.due_date
    )


@router.put("/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Update a task for the authenticated user."""
    task_service = TaskService(db)

    updated_task = task_service.update_task(task_id, task_update, str(current_user.id))

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or you don't have permission to update it"
        )

    return TaskRead(
        id=updated_task.id,
        title=updated_task.title,
        description=updated_task.description,
        completed=updated_task.completed,
        user_id=updated_task.user_id,
        created_at=updated_task.created_at,
        updated_at=updated_task.updated_at,
        due_date=updated_task.due_date
    )


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """Delete a task for the authenticated user."""
    task_service = TaskService(db)

    success = task_service.delete_task(task_id, str(current_user.id))

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or you don't have permission to delete it"
        )

    return