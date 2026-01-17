import re
from typing import Optional
from pydantic import BaseModel, validator


def is_valid_email(email: str) -> bool:
    """Validate email format using regex."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def is_strong_password(password: str) -> bool:
    """
    Validate password strength.
    At least 8 characters with uppercase, lowercase, and special character.
    """
    if len(password) < 8:
        return False

    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_special = any(not c.isalnum() for c in password)

    return has_upper and has_lower and has_special


class EmailValidator(BaseModel):
    email: str

    @validator('email')
    def validate_email_format(cls, v):
        if not is_valid_email(v):
            raise ValueError('Invalid email format')
        return v


class PasswordValidator(BaseModel):
    password: str

    @validator('password')
    def validate_password_strength(cls, v):
        if not is_strong_password(v):
            raise ValueError('Password must be at least 8 characters with uppercase, lowercase, and special character')
        return v