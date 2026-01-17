from typing import List, Optional
from sqlmodel import Session, select, func
from src.models.task import Task, TaskCreate, TaskUpdate
from src.models.user import User
from datetime import datetime


class TaskService:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create_task(self, task_create: TaskCreate, user_id: str) -> Task:
        """Create a new task for a user."""
        db_task = Task(
            title=task_create.title,
            description=task_create.description,
            completed=task_create.completed,
            user_id=user_id,
            due_date=task_create.due_date
        )

        self.db_session.add(db_task)
        self.db_session.commit()
        self.db_session.refresh(db_task)

        return db_task

    def get_task_by_id(self, task_id: str, user_id: str) -> Optional[Task]:
        """Get a specific task by ID for a user."""
        return self.db_session.exec(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        ).first()

    def get_tasks_for_user(
        self,
        user_id: str,
        completed: Optional[bool] = None,
        sort_by: str = "created_at",
        order: str = "desc",
        page: int = 1,
        limit: int = 20
    ) -> tuple[List[Task], int]:
        """Get all tasks for a user with filtering, sorting, and pagination."""
        query = select(Task).where(Task.user_id == user_id)

        # Apply completion filter
        if completed is not None:
            query = query.where(Task.completed == completed)

        # Apply sorting
        if hasattr(Task, sort_by):
            sort_field = getattr(Task, sort_by)
            if order.lower() == "desc":
                query = query.order_by(sort_field.desc())
            else:
                query = query.order_by(sort_field.asc())

        # Count total records
        total_count = self.db_session.exec(query.subquery().select(func.count())).one()

        # Apply pagination
        query = query.offset((page - 1) * limit).limit(limit)

        tasks = self.db_session.exec(query).all()

        return tasks, total_count

    def update_task(self, task_id: str, task_update: TaskUpdate, user_id: str) -> Optional[Task]:
        """Update a task for a user."""
        db_task = self.db_session.exec(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        ).first()

        if not db_task:
            return None

        # Update fields
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)

        db_task.updated_at = datetime.utcnow()

        self.db_session.add(db_task)
        self.db_session.commit()
        self.db_session.refresh(db_task)

        return db_task

    def delete_task(self, task_id: str, user_id: str) -> bool:
        """Delete a task for a user."""
        db_task = self.db_session.exec(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        ).first()

        if not db_task:
            return False

        self.db_session.delete(db_task)
        self.db_session.commit()

        return True