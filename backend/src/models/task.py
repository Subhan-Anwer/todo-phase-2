from sqlmodel import SQLModel, Field, Column, DateTime, Boolean, Relationship
from typing import Optional
from datetime import datetime
import uuid


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(max_length=1000)
    completed: bool = Field(default=False)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    due_date: Optional[datetime] = Field(sa_column=Column(DateTime(timezone=True)))


class Task(TaskBase, table=True):
    """Task model for the todo application."""
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: Optional[datetime] = Field(default=datetime.utcnow(), sa_column=Column(DateTime(timezone=True)))
    updated_at: Optional[datetime] = Field(default=datetime.utcnow(), sa_column=Column(DateTime(timezone=True)))

    # Relationship to User
    user: Optional["User"] = Relationship(back_populates="tasks")


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    title: str = Field(min_length=1, max_length=100)


class TaskRead(TaskBase):
    """Schema for reading task data."""
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class TaskUpdate(SQLModel):
    """Schema for updating task data."""
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None


class TaskListResponse(SQLModel):
    """Schema for task list response with pagination."""
    data: list[TaskRead]
    pagination: dict