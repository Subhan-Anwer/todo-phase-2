# Implementation Plan: Next.js Frontend Web Application

**Branch**: `001-nextjs-frontend` | **Date**: 2026-01-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-nextjs-frontend/spec.md`

**Note**: This plan covers Phase 2 frontend development with **mock auth services**. Better Auth integration occurs in Phase 2 backend implementation.

## Summary

Build a standalone Next.js frontend application for the todo management system using App Router architecture. The frontend communicates exclusively via REST APIs with NO direct database access or shared code with the backend. **Critical constraint**: Better Auth is NOT implemented in the frontend directly - authentication flows are simulated via mock auth services that are swappable without UI changes.

**Technical Approach**: Service layer pattern with `AuthService` interface enables mock authentication during frontend development (Phase 2 Frontend) and seamless swap to real Better Auth when backend is integrated (Phase 2 Backend). UI components remain unchanged during the swap.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14+ (App Router)
**Primary Dependencies**: Next.js, React 18+, Tailwind CSS, React Hook Form (optional)
**Storage**: Client-side JWT in http-only cookies (preferred) or localStorage (fallback). Mock users stored in localStorage during Phase 2 Frontend development.
**Testing**: Jest + React Testing Library for unit/component tests, MSW for API mocking, Playwright (optional) for E2E
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions), responsive (320px - 2560px width)
**Project Type**: Web application (frontend only) - monorepo with backend separation
**Performance Goals**: Initial page load <2s, API responses with visual feedback <100ms, task operations complete <1s
**Constraints**: <200ms p95 for UI interactions, no direct database access, no shared code with backend, RESTful API boundary only
**Scale/Scope**: Support 1000+ tasks per user without degradation, responsive design across all devices, WCAG 2.1 Level AA compliance

**Mock Auth Constraint (Phase 2 Frontend)**:
- `MockAuthService` implements `AuthService` interface
- Auth flows simulated locally (localStorage-based mock users)
- JWT tokens are base64-encoded mock payloads (NOT cryptographically secure)
- Environment variable `NEXT_PUBLIC_USE_MOCK_AUTH=true` enables mock mode
- Swap to `BetterAuthService` in Phase 2 Backend by setting `NEXT_PUBLIC_USE_MOCK_AUTH=false`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Verification
- [x] Spec First: Implementation derived from approved spec.md and will be derived from tasks.md
- [x] No Manual Coding: All implementation via Claude Code, humans edit specs only
- [x] Monorepo Architecture: Frontend in `/frontend` directory, backend in `/backend` (clear separation)
- [x] Stateless Backend: N/A for frontend - backend responsibility
- [x] Multi-User by Design: Frontend enforces user-specific views via JWT tokens (mock or real)
- [x] RESTful API Boundary: Frontend communicates ONLY via REST APIs (`/api/v1/*`), no direct DB access
- [x] Authentication via JWT: JWT tokens (mock in Phase 2 Frontend, real Better Auth in Phase 2 Backend)
- [x] Test-Driven Development: All features have accompanying tests; tests are part of definition of done
- [x] Technology Constraints: Using Next.js (App Router), TypeScript, Tailwind CSS as specified
- [x] Core Todo Operations: UI supports Add, Delete, Update, View, and Mark Complete operations
- [x] Task Management: Tasks persist via API calls (mock storage in Phase 2 Frontend, real DB in Phase 2 Backend)

### Phase 2 Frontend-Specific Compliance
- [x] **Mock Auth Requirement**: Better Auth NOT implemented directly in frontend (see research.md section 11)
- [x] **Swappable Implementation**: Service layer pattern enables mock→real swap without UI changes
- [x] **UI Behavior**: UI must behave as if Better Auth exists (auth flows, protected routes, JWT handling)

## Project Structure

### Documentation (this feature)

```text
specs/001-nextjs-frontend/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (includes Mock Auth Strategy)
├── data-model.md        # Phase 1 output (frontend type definitions)
├── quickstart.md        # Phase 1 output (developer onboarding guide)
├── contracts/           # Phase 1 output (API contract from frontend perspective)
│   └── api-contract.md
├── checklists/          # Generated checklists
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Public route group
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── signup/
│   │       └── page.tsx          # Signup page
│   ├── (protected)/              # Protected route group (requires auth)
│   │   ├── layout.tsx            # Protected layout with auth check
│   │   └── tasks/
│   │       └── page.tsx          # Task list page (main app)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page (redirect logic)
│   ├── error.tsx                 # Global error boundary
│   └── loading.tsx               # Global loading UI
│
├── components/
│   ├── auth/                     # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── tasks/                    # Task management components
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── CreateTaskForm.tsx
│   │   ├── EditTaskForm.tsx
│   │   └── DeleteTaskConfirm.tsx
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Modal.tsx
│   └── layout/                   # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── api/                      # API client and utilities
│   │   ├── client.ts             # Fetch wrapper with auth headers
│   │   ├── tasks.ts              # Task API methods
│   │   └── errors.ts             # API error handling
│   ├── auth/                     # Authentication service layer
│   │   ├── index.ts              # Factory: creates Mock or Real service
│   │   ├── auth-service.ts       # AuthService interface
│   │   ├── mock-auth-service.ts  # Mock implementation (Phase 2 Frontend)
│   │   └── better-auth-service.ts # Real Better Auth (Phase 2 Backend)
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Authentication state hook
│   │   └── useTasks.ts           # Task management hook
│   └── utils/                    # Utility functions
│       ├── validators.ts         # Form validation helpers
│       └── formatters.ts         # Date/text formatting
│
├── types/
│   ├── auth.ts                   # User, AuthResponse, LoginCredentials types
│   ├── task.ts                   # Task, CreateTaskInput, UpdateTaskInput types
│   ├── api.ts                    # APIResponse, APIError, PaginationMeta types
│   ├── form.ts                   # Form state and validation types
│   └── guards.ts                 # Type guards for runtime validation
│
├── middleware.ts                 # Next.js middleware (route protection)
│
├── tests/
│   ├── unit/                     # Unit tests (utilities, helpers)
│   ├── components/               # Component tests (React Testing Library)
│   ├── integration/              # Integration tests (MSW-mocked APIs)
│   ├── e2e/                      # E2E tests (Playwright - optional)
│   ├── mocks/                    # MSW handlers and test fixtures
│   │   ├── handlers.ts           # MSW request handlers
│   │   └── server.ts             # MSW server setup
│   └── fixtures/                 # Test data fixtures
│       ├── users.ts
│       └── tasks.ts
│
├── public/                       # Static assets
│   ├── favicon.ico
│   └── images/
│
├── .env.local                    # Local environment variables (gitignored)
├── .env.example                  # Example environment variables
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── next.config.js                # Next.js configuration
├── jest.config.js                # Jest configuration
├── jest.setup.js                 # Jest setup file
├── .eslintrc.json                # ESLint configuration
├── .prettierrc.json              # Prettier configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # Frontend documentation

backend/                          # Backend (separate - Phase 2 Backend)
├── [backend implementation]      # Better Auth integrated here
```

**Structure Decision**: Web application structure with frontend/backend separation in monorepo. Frontend uses Next.js App Router with route groups for auth separation. Service layer pattern (`lib/auth/`) enables mock auth in Phase 2 Frontend and real Better Auth swap in Phase 2 Backend.

## Complexity Tracking

No constitution violations. All principles followed:
- Clear frontend/backend separation via RESTful API boundary
- Mock auth strategy aligns with phased development approach
- Service layer pattern maintains swappability without UI changes

## Security Considerations

*Required for all features. Reference: Constitution v1.2.0 - Security Principles*

### Input Validation
- [x] All user input validated on frontend for UX (email format, password length, required fields)
- [x] Frontend validation is NOT authoritative - backend validates
- [x] Input sanitization to prevent XSS (React JSX auto-escaping)

### Authentication & Authorization
- [x] **Phase 2 Frontend**: Mock JWT tokens stored in localStorage (`MockAuthService`)
- [x] **Phase 2 Backend**: Real JWT verification via Better Auth, tokens in http-only cookies
- [x] All protected routes enforce authentication via Next.js middleware
- [x] User identity extracted from JWT payload (mock or real)
- [x] Authorization header included in all authenticated API requests

### SQL Injection Prevention
- [x] N/A for frontend (backend responsibility)

### XSS Protection
- [x] User-generated content (task titles) rendered via React JSX (auto-escaped)
- [x] No use of `dangerouslySetInnerHTML`
- [x] Form inputs controlled and validated
- [x] CSP headers configured (future enhancement)

### CORS Policy
- [x] N/A for frontend - backend configures CORS to allow frontend origin

### Rate Limiting
- [x] N/A for frontend - backend enforces rate limits

### Secrets Management
- [x] No hardcoded secrets in source code
- [x] Environment variables used: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_USE_MOCK_AUTH`
- [x] `.env.local` in `.gitignore`
- [x] `.env.example` documents all required variables

**Security Risks Identified**:
1. **Mock Auth in Development**: Mock JWT tokens are NOT cryptographically secure (base64-encoded only). This is acceptable for Phase 2 Frontend development but MUST be swapped to real Better Auth before production.
2. **localStorage XSS Risk**: If using localStorage for JWT storage (fallback), vulnerable to XSS. Mitigation: Prefer http-only cookies in Phase 2 Backend.
3. **Client-Side Route Protection**: Next.js middleware provides route protection but can be bypassed client-side. Backend MUST enforce authorization on all API endpoints.

## Testing Strategy

*Required for all features. Reference: Constitution v1.2.0 - Testing Requirements*

### Test Coverage Targets
- [x] Frontend: Minimum 80% code coverage for critical paths
- [x] All UI components have unit tests (React Testing Library)
- [x] All user flows have integration tests with mocked APIs (MSW)

### Testing Approach
- **Unit Tests**: Utility functions (validators, formatters, type guards), custom hooks (useAuth, useTasks), service layer (MockAuthService, BetterAuthService)
- **Component Tests**: All UI components (forms, task list, buttons), auth pages (login, signup), task page
- **Integration Tests**: Full user flows with MSW-mocked API responses (signup→login→create task→toggle complete→delete)
- **E2E Tests** (Optional): Critical paths via Playwright (signup, login, CRUD operations)

### Test-Driven Development
- [x] Tests written BEFORE or alongside implementation
- [x] Each task in tasks.md includes test cases
- [x] Tests are part of definition of done (all tests must pass)

### Testing Tools & Setup
- **Frontend**: Jest + React Testing Library
- **API Mocking**: MSW (Mock Service Worker) - simulates REST API responses
- **E2E** (Optional): Playwright for multi-browser testing
- **Test Data**: Fixtures in `tests/fixtures/` (mock users, tasks), MSW handlers in `tests/mocks/handlers.ts`

**Testing Risks**:
1. **Mock Auth Behavior Divergence**: Mock auth may not perfectly match real Better Auth behavior. Mitigation: Service interface enforces contract; integration tests verify both implementations.
2. **MSW Handler Maintenance**: API contract changes require MSW handler updates. Mitigation: Centralize handlers, use contract testing tools (Pact - future).

## Error Handling Standards

*Required for all features. Reference: Constitution v1.2.0 - Error Handling Standards*

### HTTP Status Code Usage
Document expected status codes for this feature:
- **200 OK**: Successful GET (fetch tasks), successful PATCH (update task)
- **201 Created**: Successful signup/login, successful task creation
- **204 No Content**: Successful logout, successful task deletion
- **400 Bad Request**: Validation failures (empty task title, invalid email format)
- **401 Unauthorized**: Missing/invalid/expired JWT token (redirect to login)
- **403 Forbidden**: User doesn't own resource (task belongs to another user)
- **404 Not Found**: Task not found (deleted or doesn't exist)
- **409 Conflict**: Email already exists during signup
- **422 Unprocessable Entity**: Field validation errors from backend
- **429 Too Many Requests**: Rate limit exceeded (auth endpoints)
- **500 Internal Server Error**: Unexpected backend errors

### Error Response Format
All errors follow standardized format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {
      "field_name": "Field-specific error"
    }
  }
}
```

### Error Handling Strategy
- [x] No sensitive information in error messages (no stack traces, internal details)
- [x] User-friendly error messages displayed in UI near relevant elements
- [x] Backend errors transformed to actionable user messages (see Error Scenarios below)
- [x] Global error boundary (`app/error.tsx`) catches unhandled React errors

### Logging Approach
- [x] Client-side errors logged to console (development)
- [x] Production errors sent to Sentry (optional)
- [x] No sensitive data logged (passwords, full JWT tokens)

**Error Scenarios**:
- **ERR-001**: Email already exists → "An account with this email already exists. Please log in or use a different email."
- **ERR-002**: Invalid credentials → "Invalid email or password. Please try again."
- **ERR-003**: Session expired (401) → Clear auth state, redirect to login, show "Your session has expired. Please log in again."
- **ERR-004**: Task not found (404) → "This task could not be found. It may have been deleted."
- **ERR-005**: Network failure → "Unable to connect. Please check your internet connection and try again."
- **ERR-006**: Server error (500) → "Something went wrong on our end. Please try again later."
- **ERR-007**: Empty task title → "Task title is required. Please enter a title."

## API Design

*Required for API features. Reference: Constitution v1.2.0 - API Design Principles*

### API Versioning
- [x] All endpoints versioned: `/api/v1/*`
- [x] Backwards compatibility assumed within v1

### RESTful Endpoints
Document endpoints for this feature (see `contracts/api-contract.md` for details):
- `POST /api/v1/auth/signup`: Create new user account
- `POST /api/v1/auth/login`: Authenticate existing user
- `POST /api/v1/auth/logout`: Invalidate session (optional)
- `GET /api/v1/todos`: List all tasks for authenticated user
- `POST /api/v1/todos`: Create new task
- `PATCH /api/v1/todos/{id}`: Update task (title or completion status)
- `DELETE /api/v1/todos/{id}`: Delete task

### Pagination
- [x] Pagination NOT implemented in MVP (all tasks fetched at once)
- [x] Future enhancement: `GET /api/v1/todos?page=1&limit=20`
- [x] Pagination metadata: `{ data: [...], pagination: { page, limit, total, total_pages } }`

### Filtering & Sorting
- [x] Filtering and sorting NOT implemented in MVP
- [x] Future enhancement: `?status=completed&sort_by=created_at&order=desc`

### Response Format
- [x] Consistent response structure:
  ```json
  {
    "data": {},
    "meta": {}
  }
  ```
  or
  ```json
  {
    "error": {
      "code": "ERROR_CODE",
      "message": "...",
      "details": {}
    }
  }
  ```

**API Design Decisions**:
- RESTful conventions followed for all endpoints
- JWT tokens included via `Authorization: Bearer <token>` header
- Frontend expects backend to filter tasks by user (JWT-based isolation)

## Data Management

*Required for database features. Reference: Constitution v1.2.0 - Data Management*

### Database Migrations
- [x] N/A for frontend (backend responsibility)

### Data Validation Boundaries
- **Frontend**: Basic validation for UX (required fields, email format, password length, max task title length)
- **Backend**: Authoritative validation (Pydantic/SQLModel - backend spec)
- **Database**: Schema constraints (backend - NOT NULL, UNIQUE, FOREIGN KEY)

### Data Integrity
- [x] N/A for frontend - backend enforces data integrity

### Data Retention
- [x] N/A for frontend - backend defines retention policy

**Data Model Decisions**:
- Frontend consumes data via API (see `data-model.md`)
- TypeScript interfaces defined for all data structures
- Type guards validate API responses at runtime

## Performance Guidelines

*Required for all features. Reference: Constitution v1.2.0 - Performance Guidelines*

### Response Time Targets
- [x] Initial page load (login/signup): <2 seconds
- [x] Task list page load after auth: <1 second
- [x] Task operations (create, toggle, delete): Visual feedback <100ms, API completion <1 second
- [x] UI interactions: <200ms (button clicks, form submissions)

### Database Optimization
- [x] N/A for frontend (backend responsibility)

### Caching Strategy
- [x] Static assets cached via Next.js default configuration
- [x] API responses NOT cached (real-time task updates required)
- [x] Future enhancement: React Query or SWR for smart caching

### Resource Management
- [x] Components lazy-loaded where appropriate
- [x] Images optimized via Next.js Image component
- [x] JavaScript bundle size minimized via tree shaking and code splitting

**Performance Risks**:
1. **Large Task Lists**: Rendering 1000+ tasks without pagination may degrade performance. Mitigation: Virtual scrolling (future) or pagination.
2. **Network Latency**: Slow API responses impact UX. Mitigation: Loading states, optimistic updates, request timeouts.

## Observability & Monitoring

*Required for all features. Reference: Constitution v1.2.0 - Observability*

### Logging Standards
- **ERROR**: Unhandled exceptions, API failures
- **WARNING**: Validation failures, auth failures
- **INFO**: User actions (login, logout, task operations - development only)
- **DEBUG**: Detailed diagnostics (development only)

### Health Checks
- [x] N/A for frontend - backend implements `/health` endpoint

### Monitoring Requirements
- [x] Client-side error tracking via Sentry (production - optional)
- [x] API response times tracked via browser DevTools (development)
- [x] Auth success/failure rates visible in logs (development)

### Structured Logging
- [x] Console logging in development (structured JSON in production via Sentry)
- [x] Include: timestamp, level, message, user_id (if available), error details

**Monitoring Strategy**:
- Development: Browser console + React DevTools
- Production: Sentry for error tracking, Vercel Analytics for performance metrics (optional)

## Environment & Configuration

*Required for all features. Reference: Constitution v1.2.0 - Environment Management*

### Environment Variables Required
Document all environment variables for this feature:
```
# Backend API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Mock Auth Mode (required for Phase 2 Frontend)
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Error tracking (optional - production only)
NEXT_PUBLIC_SENTRY_DSN=

# Analytics (optional - production only)
NEXT_PUBLIC_GA_ID=
```

### Configuration Management
- [x] Environment variables validated on application startup (Next.js default)
- [x] Fail fast if required variables missing (`NEXT_PUBLIC_API_URL`)
- [x] `.env.example` documents all required variables

**Configuration Decisions**:
- `NEXT_PUBLIC_USE_MOCK_AUTH=true` enables mock auth service (Phase 2 Frontend)
- Set to `false` when integrating real Better Auth (Phase 2 Backend)
- API URL configurable via environment variable for dev/staging/prod

## Code Quality Standards

*Required for all features. Reference: Constitution v1.2.0 - Code Quality*

### Backend (Python/FastAPI)
- [x] N/A for frontend

### Frontend (TypeScript/Next.js)
- [x] Prettier for code formatting
- [x] ESLint for linting (`next/core-web-vitals` + custom rules)
- [x] TypeScript strict mode enabled
- [x] Explicit types (no `any` without justification)
- [x] Airbnb or Google style guide followed

### Documentation
- [x] All components documented with JSDoc comments
- [x] README.md updated with setup instructions (see `quickstart.md`)
- [x] Environment variables documented in `.env.example`
- [x] API integration documented in `lib/api/` files

**Code Quality Checks**:
- `npm run lint`: ESLint check
- `npm run type-check`: TypeScript compilation check
- `npm run format`: Prettier formatting check
- Pre-commit hooks: lint-staged + husky (run linter and formatter on staged files)

## Phase 0: Research (Complete)

**Status**: ✅ Completed

**Output**: `research.md` with all technical decisions resolved

**Key Decisions**:
1. Next.js App Router (modern React patterns)
2. HTTP-only cookies for JWT storage (preferred)
3. React built-in hooks for state management (no global state library)
4. Tailwind CSS for styling
5. Fetch API with custom wrapper (no axios)
6. Jest + React Testing Library + MSW for testing
7. Next.js middleware for route protection
8. Sentry for error tracking (production)
9. WCAG 2.1 Level AA accessibility target
10. **Mock Auth Strategy**: Service layer pattern with `AuthService` interface
11. `MockAuthService` for Phase 2 Frontend, `BetterAuthService` for Phase 2 Backend

**Research Topics Covered**:
- ✅ Framework choice (App Router vs Pages Router)
- ✅ JWT storage strategy (security analysis)
- ✅ State management approach
- ✅ Styling framework
- ✅ Form handling
- ✅ HTTP client library
- ✅ Testing tools and strategy
- ✅ Protected route implementation
- ✅ Error tracking
- ✅ Accessibility standards
- ✅ **Mock Auth Service Pattern** (CRITICAL for Phase 2 Frontend)

## Phase 1: Design & Contracts (Complete)

**Status**: ✅ Completed

**Outputs**:
- ✅ `data-model.md`: Frontend TypeScript type definitions
- ✅ `contracts/api-contract.md`: API contract from frontend perspective
- ✅ `quickstart.md`: Developer onboarding guide

**Data Model**:
- User types (User, AuthResponse, LoginCredentials, SignupData, AuthState)
- Task types (Task, CreateTaskInput, UpdateTaskInput, TaskListState)
- API response types (APIResponse, APIError, PaginationMeta)
- Form types (FormErrors, FormState, LoginFormValues, SignupFormValues, TaskFormValues)
- Type guards (isTask, isAPIError, isAuthResponse)

**API Contracts**:
- Auth endpoints: signup, login, logout
- Task endpoints: list, create, update, delete
- Standard error response format
- HTTP status code usage documented

**Quick Start**:
- Setup instructions (Node.js, npm, environment variables)
- Project structure creation
- Configuration files (TypeScript, Tailwind, ESLint, Prettier)
- Testing setup (Jest, MSW)
- Git hooks (Husky, lint-staged)

## Phase 2: Tasks (To Be Generated)

**Status**: ⏭️ Pending (use `/sp.tasks` command)

**Expected Output**: `tasks.md` with testable implementation tasks

**Task Categories** (expected):
1. Project initialization and configuration
2. Authentication service layer (mock implementation)
3. API client and utilities
4. UI components (auth forms, task forms, reusable UI)
5. Pages (login, signup, tasks)
6. Custom hooks (useAuth, useTasks)
7. Middleware (route protection)
8. Testing (unit, component, integration)
9. E2E testing (optional)
10. Documentation and deployment

## Definition of Done

**Frontend is complete when**:
1. ✅ All tasks in `tasks.md` are implemented and passing tests
2. ✅ Mock auth service allows full user flows (signup, login, task CRUD, logout)
3. ✅ All UI components render correctly and are responsive (320px - 2560px)
4. ✅ All user stories from spec.md are testable and passing
5. ✅ Test coverage ≥80% for critical paths
6. ✅ TypeScript compilation passes with no errors (strict mode)
7. ✅ ESLint and Prettier checks pass
8. ✅ Accessibility audit passes (aXe/Lighthouse - WCAG 2.1 AA)
9. ✅ README and quickstart.md are up to date
10. ✅ Environment variables documented in `.env.example`
11. ✅ Mock auth service is swappable to real Better Auth via environment variable

**Integration Ready When** (Phase 2 Backend):
1. Set `NEXT_PUBLIC_USE_MOCK_AUTH=false`
2. Backend API running and accessible
3. Integration tests pass with real backend
4. Auth flows work with real Better Auth
5. Task operations persist to real database

---

**Next Steps**:
1. ✅ Research complete (`research.md`)
2. ✅ Design complete (`data-model.md`, `contracts/`, `quickstart.md`)
3. ⏭️ Run `/sp.tasks` to generate actionable tasks
4. ⏭️ Implement tasks in red-green-refactor cycle
5. ⏭️ Integrate with Phase 2 Backend (swap mock auth to real Better Auth)
