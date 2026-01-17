# Data Model: Next.js Frontend

**Feature**: 001-nextjs-frontend
**Date**: 2026-01-14
**Phase**: 1 (Data Modeling)

## Overview

This document defines the TypeScript types and data structures used in the Next.js frontend. The frontend consumes data from the backend REST API and does not directly access the database.

**Note**: This is the *frontend perspective* of the data model. The authoritative data model is defined by the backend (database schema and API contracts).

---

## Frontend Type Definitions

### User Types

**Location**: `src/types/auth.ts`

```typescript
/**
 * Represents an authenticated user
 */
export interface User {
  /** Unique user identifier (UUID from backend) */
  id: string;
  /** User's email address */
  email: string;
}

/**
 * Response from successful authentication (login/signup)
 */
export interface AuthResponse {
  /** Authenticated user data */
  user: User;
  /** JWT authentication token */
  token: string;
}

/**
 * Login request payload
 */
export interface LoginCredentials {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Signup request payload
 */
export interface SignupData {
  /** User's email address */
  email: string;
  /** User's password (minimum 8 characters) */
  password: string;
  /** Optional: Password confirmation (frontend validation) */
  confirmPassword?: string;
}

/**
 * Authentication state (client-side)
 */
export interface AuthState {
  /** Currently authenticated user (null if not authenticated) */
  user: User | null;
  /** Whether authentication check is in progress */
  isLoading: boolean;
  /** Authentication error message */
  error: string | null;
}
```

---

### Task Types

**Location**: `src/types/task.ts`

```typescript
/**
 * Represents a todo task
 */
export interface Task {
  /** Unique task identifier (UUID from backend) */
  id: string;
  /** Task title/description */
  title: string;
  /** Whether the task is completed */
  completed: boolean;
  /** User who owns this task (implicit via JWT, not exposed in frontend) */
  user_id?: string;
  /** Timestamp when task was created (ISO 8601 string) */
  created_at?: string;
  /** Timestamp when task was last updated (ISO 8601 string) */
  updated_at?: string;
}

/**
 * Request payload for creating a new task
 */
export interface CreateTaskInput {
  /** Task title (required, non-empty) */
  title: string;
}

/**
 * Request payload for updating a task
 */
export interface UpdateTaskInput {
  /** Updated task title (optional) */
  title?: string;
  /** Updated completion status (optional) */
  completed?: boolean;
}

/**
 * Task list state (client-side)
 */
export interface TaskListState {
  /** Array of tasks */
  tasks: Task[];
  /** Whether tasks are being fetched */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Whether a task operation is in progress (create, update, delete) */
  isSubmitting: boolean;
}
```

---

### API Response Types

**Location**: `src/types/api.ts`

```typescript
/**
 * Standard API success response format
 */
export interface APIResponse<T> {
  /** Response data (resource or array of resources) */
  data: T;
  /** Optional metadata */
  meta?: Record<string, unknown>;
}

/**
 * Standard API error response format
 */
export interface APIError {
  error: {
    /** Error code identifier */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Optional field-specific error details */
    details?: Record<string, string | string[]>;
  };
}

/**
 * Pagination metadata (future enhancement)
 */
export interface PaginationMeta {
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  total_pages: number;
}

/**
 * Paginated response (future enhancement)
 */
export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: PaginationMeta;
}
```

---

### Form Types

**Location**: `src/types/form.ts`

```typescript
/**
 * Form validation error state
 */
export interface FormErrors {
  /** Field-specific error messages (key: field name, value: error message) */
  [field: string]: string | undefined;
}

/**
 * Form submission state
 */
export interface FormState {
  /** Whether form is being submitted */
  isSubmitting: boolean;
  /** General form error (non-field-specific) */
  error: string | null;
  /** Field-specific validation errors */
  fieldErrors: FormErrors;
}

/**
 * Login form values
 */
export interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Signup form values
 */
export interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Task form values (create or edit)
 */
export interface TaskFormValues {
  title: string;
}
```

---

## Data Relationships

### Frontend Perspective

```
User (authenticated)
  └── Has many Tasks (via JWT user_id)
      └── Tasks filtered by backend (user can only see their own)
```

**Key Points**:
- Frontend does not enforce data relationships (backend responsibility)
- User-task association is implicit (JWT contains user_id)
- Frontend displays only tasks returned by backend API (already filtered)

---

## Data Validation Rules (Frontend)

### User Email
- **Format**: Valid email address (regex validation)
- **Example**: `user@example.com`
- **Frontend validation**: Email format check
- **Backend validation**: Email format + uniqueness check

### User Password
- **Minimum length**: 8 characters (frontend enforced)
- **Backend validation**: Length + complexity requirements (backend decision)

### Task Title
- **Required**: Non-empty string (frontend enforced)
- **Maximum length**: 500 characters (suggested, enforced by backend)
- **Frontend validation**: Required field check, length check
- **Backend validation**: Required + length + sanitization

### Task Completed
- **Type**: Boolean
- **Default**: `false` (new tasks are incomplete)
- **Frontend validation**: Type check (boolean only)

---

## State Transitions

### Task Completion State

```
incomplete (completed: false)
    ↓ (user clicks toggle)
complete (completed: true)
    ↓ (user clicks toggle again)
incomplete (completed: false)
```

**Frontend Handling**:
1. User toggles completion checkbox
2. Optimistic update: Immediately flip `completed` state in UI
3. API call: `PATCH /api/v1/todos/{id}` with `{ completed: !task.completed }`
4. On success: Keep optimistic update
5. On error: Rollback to previous state, show error message

---

## Data Flow Diagrams

### Authentication Flow

```
[Login Form] → (submit) → [API Client]
                              ↓
                   POST /api/v1/auth/login
                              ↓
                   [Backend API Response]
                              ↓
               {data: {user: {...}, token: "jwt"}}
                              ↓
                   [Store JWT Token]
                              ↓
              [Redirect to /tasks page]
```

### Task Fetch Flow

```
[Task List Page] → (on mount) → [API Client]
                                     ↓
                           GET /api/v1/todos
                        (Authorization: Bearer <token>)
                                     ↓
                         [Backend API Response]
                                     ↓
                      {data: [Task, Task, ...]}
                                     ↓
                       [Update tasks state]
                                     ↓
                      [Render Task List UI]
```

### Task Create Flow

```
[Task Form] → (submit) → [Validate Input]
                              ↓
                 title.trim().length > 0?
                        /            \
                      YES             NO
                       ↓               ↓
              [API Client]    [Show Validation Error]
                       ↓
         POST /api/v1/todos {title: "..."}
                       ↓
           [Backend API Response]
                       ↓
          {data: {id, title, completed: false}}
                       ↓
          [Add new task to tasks array]
                       ↓
              [Re-render Task List]
                       ↓
         [Clear form, show success]
```

---

## Type Guards and Utilities

**Location**: `src/types/guards.ts`

```typescript
/**
 * Type guard to check if value is a valid Task
 */
export function isTask(value: unknown): value is Task {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'completed' in value &&
    typeof (value as Task).id === 'string' &&
    typeof (value as Task).title === 'string' &&
    typeof (value as Task).completed === 'boolean'
  );
}

/**
 * Type guard to check if response is an API error
 */
export function isAPIError(value: unknown): value is APIError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as APIError).error === 'object' &&
    'code' in (value as APIError).error &&
    'message' in (value as APIError).error
  );
}

/**
 * Type guard to check if value is an AuthResponse
 */
export function isAuthResponse(value: unknown): value is AuthResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'user' in value &&
    'token' in value &&
    typeof (value as AuthResponse).token === 'string'
  );
}
```

---

## Default/Initial Values

### Empty States

```typescript
// Empty task list state
export const INITIAL_TASK_LIST_STATE: TaskListState = {
  tasks: [],
  isLoading: false,
  error: null,
  isSubmitting: false,
};

// Unauthenticated state
export const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Empty form state
export const INITIAL_FORM_STATE: FormState = {
  isSubmitting: false,
  error: null,
  fieldErrors: {},
};
```

---

## Data Transformation

### API Response → Frontend State

```typescript
/**
 * Transform API task response to Task type
 * (In case backend sends additional fields we don't need)
 */
export function transformTaskResponse(apiTask: unknown): Task {
  // Validate and extract only needed fields
  if (!isTask(apiTask)) {
    throw new Error('Invalid task data from API');
  }

  return {
    id: apiTask.id,
    title: apiTask.title,
    completed: apiTask.completed,
    created_at: apiTask.created_at,
    updated_at: apiTask.updated_at,
  };
}

/**
 * Transform array of API tasks
 */
export function transformTasksResponse(data: unknown): Task[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected array of tasks from API');
  }

  return data.map(transformTaskResponse);
}
```

---

## Summary

**Frontend Data Model Characteristics**:
- ✅ **Type-Safe**: All data structures defined with TypeScript interfaces
- ✅ **API-Driven**: Data consumed from backend REST API
- ✅ **Stateless**: No persistent client-side storage (except JWT token)
- ✅ **Validation**: Frontend validates for UX, backend is authoritative
- ✅ **Transformations**: API responses transformed to frontend types
- ✅ **Type Guards**: Runtime type checking for API responses

**Key Files**:
- `src/types/auth.ts`: User and authentication types
- `src/types/task.ts`: Task and task list types
- `src/types/api.ts`: Generic API response types
- `src/types/form.ts`: Form state and validation types
- `src/types/guards.ts`: Type guards and validation utilities

**Backend Dependency**:
- Frontend types reflect backend API contracts
- Any changes to backend API require frontend type updates
- Contract testing (future): Ensure frontend types match backend responses
