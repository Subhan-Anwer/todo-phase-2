from sqlmodel import SQLModel, Field, Column, DateTime, Boolean
from typing import Optional
from datetime import datetime
import uuid


class UserBase(SQLModel):
    email: str = Field(sa_column=Column(unique=True, nullable=False))
    is_active: bool = Field(default=True)


class User(UserBase, table=True):
    """User model for the todo application."""
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str = Field(nullable=False)
    created_at: Optional[datetime] = Field(default=datetime.utcnow(), sa_column=Column(DateTime(timezone=True)))
    updated_at: Optional[datetime] = Field(default=datetime.utcnow(), sa_column=Column(DateTime(timezone=True)))


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str

    @classmethod
    def from_request(cls, email: str, password: str):
        return cls(email=email, password=password)


class UserRead(UserBase):
    """Schema for reading user data."""
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class UserUpdate(SQLModel):
    """Schema for updating user data."""
    email: Optional[str] = None
    is_active: Optional[bool] = None


class UserLogin(SQLModel):
    """Schema for user login."""
    email: str
    password: str


class Token(SQLModel):
    """Schema for JWT token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(SQLModel):
    """Schema for token data."""
    user_id: Optional[str] = None
    email: Optional[str] = None