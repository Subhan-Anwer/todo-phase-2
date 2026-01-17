import pytest
from datetime import timedelta
from src.core.security import verify_password, get_password_hash, create_access_token, verify_token


def test_password_hashing():
    """Test that password hashing and verification works correctly."""
    password = "test_password_123!"
    hashed = get_password_hash(password)

    # Verify the password matches the hash
    assert verify_password(password, hashed)

    # Verify a wrong password doesn't match
    assert not verify_password("wrong_password", hashed)


def test_create_and_verify_token():
    """Test that token creation and verification works correctly."""
    data = {"sub": "test_user_id", "email": "test@example.com"}
    token = create_access_token(data=data, expires_delta=timedelta(minutes=30))

    # Verify the token can be decoded
    payload = verify_token(token)
    assert payload is not None
    assert payload["sub"] == "test_user_id"
    assert payload["email"] == "test@example.com"

    # Test with expired token (would normally fail, but for this test we're just checking structure)
    # For a real test, we'd need to mock time or use a very short expiry