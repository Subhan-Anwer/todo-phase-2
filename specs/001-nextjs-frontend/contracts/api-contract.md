# API Contract: Frontend Consumer Perspective

**Feature**: 001-nextjs-frontend
**Date**: 2026-01-14
**Backend API Version**: v1

## Overview

This document defines the API contract from the frontend's perspective. It specifies the expected request/response formats for all API endpoints consumed by the Next.js frontend.

**Base URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable
- Development: `http://localhost:8000`
- Production: `https://api.example.com` (TBD)

**API Version**: `/api/v1`

---

## Authentication Endpoints

### POST /api/v1/auth/signup

**Purpose**: Create a new user account

**Request**:
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response** (201 Created):
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:

400 Bad Request (Invalid input):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "email": "Please enter a valid email address"
    }
  }
}
```

409 Conflict (Email already exists):
```json
{
  "error": {
    "code": "USER_EXISTS",
    "message": "An account with this email already exists",
    "details": {}
  }
}
```

422 Unprocessable Entity (Validation errors):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password must be at least 8 characters",
    "details": {
      "password": "Password must be at least 8 characters"
    }
  }
}
```

---

### POST /api/v1/auth/login

**Purpose**: Authenticate an existing user

**Request**:
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response** (200 OK):
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:

401 Unauthorized (Invalid credentials):
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  }
}
```

400 Bad Request (Missing fields):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email and password are required",
    "details": {
      "email": "Email is required",
      "password": "Password is required"
    }
  }
}
```

---

### POST /api/v1/auth/logout

**Purpose**: Invalidate current user session (optional endpoint)

**Request**:
```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

**Success Response** (204 No Content):
```
(Empty body)
```

**Note**: Logout may be handled client-side only (clear token from storage). Backend logout endpoint is optional if JWTs are stateless.

---

## Task Endpoints

### GET /api/v1/todos

**Purpose**: Retrieve all tasks for the authenticated user

**Request**:
```http
GET /api/v1/todos
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Buy groceries",
      "completed": false,
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2026-01-14T10:30:00Z",
      "updated_at": "2026-01-14T10:30:00Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "title": "Write documentation",
      "completed": true,
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2026-01-13T15:20:00Z",
      "updated_at": "2026-01-14T09:15:00Z"
    }
  ]
}
```

**Empty Response** (200 OK):
```json
{
  "data": []
}
```

**Error Responses**:

401 Unauthorized (Missing or invalid token):
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": {}
  }
}
```

---

### POST /api/v1/todos

**Purpose**: Create a new task

**Request**:
```http
POST /api/v1/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation"
}
```

**Success Response** (201 Created):
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "title": "Complete project documentation",
    "completed": false,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-01-14T11:00:00Z",
    "updated_at": "2026-01-14T11:00:00Z"
  }
}
```

**Error Responses**:

400 Bad Request (Empty title):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Task title is required",
    "details": {
      "title": "Title cannot be empty"
    }
  }
}
```

401 Unauthorized:
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": {}
  }
}
```

---

### PATCH /api/v1/todos/{id}

**Purpose**: Update an existing task (title or completion status)

**Request (Update title)**:
```http
PATCH /api/v1/todos/123e4567-e89b-12d3-a456-426614174002
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation and tests"
}
```

**Request (Toggle completion)**:
```http
PATCH /api/v1/todos/123e4567-e89b-12d3-a456-426614174002
Authorization: Bearer <token>
Content-Type: application/json

{
  "completed": true
}
```

**Success Response** (200 OK):
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "title": "Complete project documentation and tests",
    "completed": true,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-01-14T11:00:00Z",
    "updated_at": "2026-01-14T11:30:00Z"
  }
}
```

**Error Responses**:

404 Not Found (Task doesn't exist):
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Task not found",
    "details": {}
  }
}
```

403 Forbidden (User doesn't own this task):
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to modify this task",
    "details": {}
  }
}
```

400 Bad Request (Empty title):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Task title cannot be empty",
    "details": {
      "title": "Title is required"
    }
  }
}
```

---

### DELETE /api/v1/todos/{id}

**Purpose**: Delete a task

**Request**:
```http
DELETE /api/v1/todos/123e4567-e89b-12d3-a456-426614174002
Authorization: Bearer <token>
```

**Success Response** (204 No Content):
```
(Empty body)
```

**Alternative Success Response** (200 OK with message):
```json
{
  "data": {
    "message": "Task deleted successfully"
  }
}
```

**Error Responses**:

404 Not Found:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Task not found",
    "details": {}
  }
}
```

403 Forbidden:
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to delete this task",
    "details": {}
  }
}
```

---

## Common HTTP Headers

### Request Headers

| Header | Value | Required | Notes |
|--------|-------|----------|-------|
| `Content-Type` | `application/json` | Yes (for POST/PATCH) | All request bodies are JSON |
| `Authorization` | `Bearer <token>` | Yes (for protected endpoints) | JWT token from login/signup |
| `Accept` | `application/json` | No | Default response format is JSON |

### Response Headers

| Header | Value | Notes |
|--------|-------|-------|
| `Content-Type` | `application/json` | All responses are JSON |
| `Access-Control-Allow-Origin` | Frontend origin | CORS header (backend sets) |
| `Access-Control-Allow-Credentials` | `true` | If using http-only cookies |

---

## HTTP Status Code Summary

| Status Code | Meaning | Usage |
|-------------|---------|-------|
| 200 OK | Success | GET, PATCH requests |
| 201 Created | Resource created | POST signup, POST create task |
| 204 No Content | Success (no body) | DELETE task, POST logout |
| 400 Bad Request | Invalid request | Missing fields, malformed JSON |
| 401 Unauthorized | Authentication required | Missing/invalid/expired token |
| 403 Forbidden | Permission denied | User doesn't own resource |
| 404 Not Found | Resource not found | Task ID doesn't exist |
| 422 Unprocessable Entity | Validation errors | Field validation failures |
| 429 Too Many Requests | Rate limit exceeded | Too many auth attempts |
| 500 Internal Server Error | Server error | Unexpected backend error |

---

## Authentication Flow

1. **Signup**: `POST /api/v1/auth/signup` → Receive JWT token
2. **Login**: `POST /api/v1/auth/login` → Receive JWT token
3. **Store Token**: Save to localStorage or http-only cookie
4. **Authenticated Requests**: Include `Authorization: Bearer <token>` header
5. **Token Expiry**: Backend returns 401 → Frontend clears token and redirects to login
6. **Logout**: Clear token from storage (optionally call `POST /api/v1/auth/logout`)

---

## Error Response Format (Standard)

All error responses follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field_name": "Field-specific error message"
    }
  }
}
```

**Error Code Examples**:
- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Permission denied
- `NOT_FOUND`: Resource not found
- `USER_EXISTS`: Email already registered
- `INVALID_CREDENTIALS`: Login failed

---

## Pagination (Future Enhancement)

When pagination is implemented, list endpoints will support:

**Request**:
```http
GET /api/v1/todos?page=2&limit=20
Authorization: Bearer <token>
```

**Response**:
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

**Frontend Handling**:
- Display "Previous" and "Next" buttons
- Track current page in state
- Fetch new page on button click

---

## API Versioning

**Current Version**: `v1`

**Future Versions**: Breaking changes require new version (e.g., `/api/v2/...`)

**Backwards Compatibility**: Within `v1`, maintain backwards compatibility

---

## Contract Testing (Future)

**Tools**:
- **Pact**: Consumer-driven contract testing
- **MSW**: Mock Service Worker for integration tests

**Strategy**:
- Frontend defines expected API contracts
- Backend validates against frontend contracts
- Prevent breaking changes without version bump

---

## Summary

**Endpoints Consumed**:
- ✅ POST /api/v1/auth/signup
- ✅ POST /api/v1/auth/login
- ⏭️ POST /api/v1/auth/logout (optional)
- ✅ GET /api/v1/todos
- ✅ POST /api/v1/todos
- ✅ PATCH /api/v1/todos/{id}
- ✅ DELETE /api/v1/todos/{id}

**Authentication**: JWT tokens via `Authorization: Bearer <token>` header

**Response Format**: Consistent `{ data: {...}, meta: {...} }` or `{ error: {...} }`

**Error Handling**: Standardized error codes and messages
