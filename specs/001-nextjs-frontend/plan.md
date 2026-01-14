# Implementation Plan: Next.js Frontend Web Application

**Branch**: `001-nextjs-frontend` | **Date**: 2026-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-nextjs-frontend/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a standalone Next.js frontend web application using the App Router that provides authentication (signup/login) and full CRUD task management capabilities. The frontend communicates exclusively with the backend via REST APIs, with no direct database access or shared code. Key features include JWT-based authentication, responsive design, comprehensive error handling, and accessibility compliance.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14+ (App Router)
**Primary Dependencies**:
- Next.js 14+ (App Router)
- React 18+
- TypeScript 5.x
- Tailwind CSS (or similar utility-first CSS framework)
- HTTP Client: native fetch API or axios/ky
- Form Handling: React Hook Form or Formik (optional)
- Testing: Jest + React Testing Library
**Storage**: N/A (frontend only - state managed in React, persistent storage via backend API)
**Testing**: Jest for unit tests, React Testing Library for component tests, Playwright/Cypress for E2E (optional)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions), responsive design for desktop (1024px-2560px), tablet (768px-1024px), and mobile (320px-768px)
**Project Type**: Web application frontend (standalone client)
**Performance Goals**:
- Initial page load <2 seconds
- Task operations <1 second with visual feedback <100ms
- Support 1000+ tasks without performance degradation
**Constraints**:
- No direct database access
- No shared code with backend
- All communication via REST API only
- HTTP-only cookies or secure localStorage for JWT storage
- Responsive design required
- WCAG 2.1 Level AA accessibility compliance
**Scale/Scope**:
- 3 main pages (login, signup, task list)
- 7 prioritized user stories
- ~10-15 reusable UI components
- Full CRUD operations on tasks
- Multi-user support (isolated by JWT)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Verification
- [x] Spec First: Implementation derived from approved spec.md
- [x] No Manual Coding: All implementation via Claude Code
- [x] Monorepo Architecture: Frontend will live in `/frontend` directory with clear separation from backend
- [x] Stateless Backend: N/A (frontend only - backend handles stateless design)
- [x] Multi-User by Design: Frontend enforces user isolation via JWT authentication
- [x] RESTful API Boundary: Frontend communicates with backend ONLY via HTTP REST APIs
- [x] Authentication via JWT: Frontend consumes JWT tokens from Better Auth backend
- [x] Test-Driven Development: Frontend components, forms, and user flows will have Jest/RTL tests
- [x] Technology Constraints: Using Next.js 14+ (App Router) with TypeScript
- [x] Core Todo Operations: Frontend provides UI for Add, Delete, Update, View, and Mark Complete
- [x] Task Management: Frontend displays user's tasks fetched from backend API

**Compliance Notes**:
- Frontend is a standalone client with no direct database or backend code access
- All state management is client-side (React state), with persistence via API calls
- JWT tokens stored securely (http-only cookies preferred, or secure localStorage)
- Responsive design and accessibility requirements align with constitution quality standards

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx   # Login page
│   │   │   └── signup/
│   │   │       └── page.tsx   # Signup page
│   │   ├── (protected)/       # Protected route group
│   │   │   └── tasks/
│   │   │       └── page.tsx   # Task list page (default after login)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Root redirect
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (buttons, inputs, cards)
│   │   ├── auth/             # Auth-specific components (LoginForm, SignupForm)
│   │   ├── tasks/            # Task-specific components (TaskList, TaskItem, TaskForm)
│   │   └── layout/           # Layout components (Header, Footer, etc.)
│   ├── lib/                  # Utility libraries
│   │   ├── api/              # API communication layer
│   │   │   ├── client.ts     # Centralized API client
│   │   │   ├── auth.ts       # Auth API functions
│   │   │   └── tasks.ts      # Task API functions
│   │   ├── auth/             # Auth utilities
│   │   │   ├── token.ts      # JWT token handling
│   │   │   └── middleware.ts # Auth middleware for protected routes
│   │   └── utils/            # General utilities
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.ts
│   │   └── task.ts
│   └── hooks/                # Custom React hooks (optional)
│       └── useAuth.ts        # Auth state hook
├── public/                   # Static assets
├── tests/
│   ├── unit/                 # Unit tests
│   ├── components/           # Component tests (RTL)
│   └── e2e/                  # E2E tests (Playwright/Cypress)
├── .env.example              # Environment variable template
├── .env.local                # Local environment variables (gitignored)
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

**Structure Decision**:
Using Next.js App Router (not Pages Router) with route groups for organization:
- **(auth)** route group: Public authentication pages (login, signup)
- **(protected)** route group: Authenticated pages (tasks) with middleware protection
- **components/**: Domain-organized reusable components (ui, auth, tasks, layout)
- **lib/api/**: Centralized API communication layer with dedicated files per domain
- **lib/auth/**: Authentication utilities (token storage, middleware)
- **types/**: TypeScript interfaces for type safety
- **tests/**: Organized by test type (unit, components, e2e)

## Frontend Architecture Plan (Next.js)

### 1. Framework & Routing

**Framework**: Next.js 14+ using the App Router (not Pages Router)

**Route Structure**:

| Route | Path | Protection | Purpose |
|-------|------|------------|---------|
| Login Page | `/login` | Public (redirect if authenticated) | User authentication entry point |
| Signup Page | `/signup` | Public (redirect if authenticated) | New user registration |
| Task List Page | `/tasks` or `/` | Protected (redirect to `/login` if not authenticated) | Main application - view and manage tasks |

**Protected Route Enforcement**:

Protected routes are enforced at the frontend level using Next.js middleware:

1. **Middleware Approach** (recommended):
   - Create `middleware.ts` in the root of the `frontend/` directory
   - Check for JWT token in cookies or localStorage on every request to protected routes
   - If token missing or invalid: redirect to `/login`
   - If token present: allow access and set user context

2. **Alternative: Layout-level Protection**:
   - Create a `(protected)` route group with a layout.tsx
   - Layout checks authentication state on mount
   - Redirect to `/login` if not authenticated

3. **Token Validation**:
   - Frontend validates token existence (not cryptographic validation - backend's responsibility)
   - Check token expiry timestamp (decoded from JWT payload)
   - If expired: clear token and redirect to `/login` with session expired message

**Route Group Organization**:
- `(auth)/` - Public authentication routes (login, signup)
- `(protected)/` - Authenticated routes (tasks)
- Root redirect: `/` → `/tasks` if authenticated, `/login` if not

### 2. Application Structure

**High-Level Folder Organization**:

**Pages** (`src/app/`):
- Next.js App Router file-based routing
- Route groups for logical separation
- Each page is a React Server Component (RSC) or Client Component as needed
- Page components orchestrate data fetching and layout

**Reusable UI Components** (`src/components/`):
- **ui/**: Base components (Button, Input, Card, Modal, Spinner, ErrorMessage)
- **auth/**: LoginForm, SignupForm, AuthProvider
- **tasks/**: TaskList, TaskItem, TaskForm, TaskEmptyState, TaskLoadingState
- **layout/**: Header, Footer, Navigation, Sidebar (if needed)

**API Communication Layer** (`src/lib/api/`):
- **client.ts**: Centralized HTTP client (fetch wrapper or axios instance)
  - Handles base URL configuration
  - Adds authentication headers (Bearer token)
  - Intercepts responses for error handling
  - Handles 401/403 responses (redirect to login)
- **auth.ts**: Authentication API functions (signup, login, logout)
- **tasks.ts**: Task API functions (getTasks, createTask, updateTask, deleteTask, toggleCompletion)

**Auth Utilities** (`src/lib/auth/`):
- **token.ts**: JWT storage/retrieval functions
  - `getToken()`: Retrieve JWT from storage
  - `setToken(token)`: Store JWT securely
  - `clearToken()`: Remove JWT on logout
  - `isTokenExpired()`: Check token expiry
- **middleware.ts**: Authentication middleware for route protection
- **context.tsx** (optional): React Context for auth state (authenticated user, loading state)

**Separation of Concerns**:
- Pages: Route-level orchestration, SEO, metadata
- Components: Presentational logic, UI rendering
- API Layer: Backend communication, error handling
- Auth Utilities: Token management, route protection
- Types: Shared TypeScript interfaces
- Hooks (optional): Reusable stateful logic

### 3. Authentication Flow (Frontend Perspective)

**Signup Flow**:
1. User navigates to `/signup`
2. SignupForm component renders with email/password fields
3. User fills form and submits
4. Frontend validates input (format, required fields) → display errors if invalid
5. API call to `POST /api/v1/auth/signup` with email/password
6. On success:
   - Receive JWT token in response
   - Store token securely (`setToken(token)`)
   - Redirect to `/tasks` (or auto-login and redirect)
7. On error:
   - Parse error response
   - Display user-friendly error message (e.g., "Email already exists")

**Login Flow**:
1. User navigates to `/login`
2. LoginForm component renders with email/password fields
3. User submits credentials
4. Frontend validates input → display errors if invalid
5. API call to `POST /api/v1/auth/login` with credentials
6. On success:
   - Receive JWT token
   - Store token securely (`setToken(token)`)
   - Redirect to `/tasks`
7. On error:
   - Display "Invalid email or password" message

**JWT-Based Authentication (Browser Handling)**:

**Storage Options**:
- **Preferred: HTTP-only Cookies**
  - Backend sets JWT in http-only cookie on login/signup
  - Browser automatically includes cookie in requests
  - Frontend doesn't directly access token (XSS protection)
- **Alternative: Secure localStorage**
  - Store JWT in localStorage
  - Manually add `Authorization: Bearer <token>` header to API requests
  - Higher XSS risk but simpler to implement

**Token Lifecycle**:
- Token received on successful login/signup
- Token included in all API requests via:
  - Automatic cookie inclusion (if http-only cookie)
  - Manual Authorization header (if localStorage)
- Token cleared on logout

**Authenticated State Check on Page Load**:
1. App initialization (root layout or middleware)
2. Check for token existence:
   - If http-only cookie: Cookie present (backend validates)
   - If localStorage: Call `getToken()` and check expiry
3. If token exists and valid:
   - Set authenticated state to `true`
   - Allow access to protected routes
4. If token missing or expired:
   - Set authenticated state to `false`
   - Redirect to `/login` if on protected route

**Logout Handling**:
1. User clicks "Logout" button
2. Call `clearToken()` to remove JWT from storage
3. Optionally call `POST /api/v1/auth/logout` (if backend invalidates tokens)
4. Clear any client-side user state (React context, local state)
5. Redirect to `/login`
6. Display "You have been logged out" message (optional)

### 4. State Management

**Task Data Storage**:
- **React Component State** (primary):
  - Task list page maintains `tasks` state (array of task objects)
  - Individual TaskItem components receive tasks as props
  - State updated via setter functions on CRUD operations
- **No Global State Library** (Redux, Zustand) unless justified:
  - Current scope (single-page task list) doesn't require complex state management
  - React's built-in useState/useReducer sufficient
- **Server State** (optional enhancement):
  - Consider React Query or SWR for server state management
  - Provides caching, background refetching, optimistic updates
  - Not required for MVP but improves UX

**Loading State Representation**:
- **Component-level loading states**:
  - `isLoading`: Boolean for async operations (fetching tasks, creating task)
  - `isSubmitting`: Boolean for form submissions
- **UI Indicators**:
  - Page-level: Full-page spinner while fetching initial tasks
  - Component-level: Inline spinners on submit buttons, task items
  - Skeleton loading (optional): Placeholder UI while loading

**Error State Representation**:
- **Component-level error states**:
  - `error`: String or error object with user-friendly message
  - `fieldErrors`: Object mapping field names to error messages (form validation)
- **UI Display**:
  - Error banners above forms or task list
  - Inline error messages below form fields
  - Toast notifications for transient errors (optional)

**Empty State Representation**:
- **Empty task list**:
  - `tasks.length === 0` → render TaskEmptyState component
  - Display: "No tasks yet. Create your first task to get started!"
  - Include a prominent "Create Task" button

**State Management Strategy**:
- Keep state as local as possible (component-level)
- Lift state only when needed for sharing between components
- Avoid global state unless multiple pages/components need shared data
- Use React Context sparingly (auth state is a good use case)

### 5. API Communication Strategy

**Centralized API Client** (`lib/api/client.ts`):

**Client Configuration**:
- Base URL from environment variable (e.g., `process.env.NEXT_PUBLIC_API_URL`)
- Default headers: `Content-Type: application/json`
- Request interceptor: Add `Authorization: Bearer <token>` header if token exists
- Response interceptor: Handle errors consistently

**Client Functions**:
- `get(endpoint, options)`: GET requests
- `post(endpoint, data, options)`: POST requests
- `patch(endpoint, data, options)`: PATCH requests
- `delete(endpoint, options)`: DELETE requests

**Success Response Handling**:
- Parse JSON response
- Extract `data` field from standardized response format:
  ```json
  {
    "data": { ... },
    "meta": { ... }
  }
  ```
- Return data to calling component

**Error Response Handling**:
- Catch HTTP errors (4xx, 5xx)
- Parse error response body:
  ```json
  {
    "error": {
      "code": "ERROR_CODE",
      "message": "User-friendly message",
      "details": {}
    }
  }
  ```
- Extract `error.message` for display to user
- Special handling for specific status codes:
  - **401 Unauthorized**: Clear token, redirect to `/login`, show "Session expired"
  - **403 Forbidden**: Show "You don't have permission" message
  - **404 Not Found**: Show "Resource not found" message
  - **422 Unprocessable Entity**: Extract field-specific validation errors from `error.details`
  - **500 Internal Server Error**: Show "Something went wrong. Please try again later."

**Unauthorized Response Behavior** (401):
1. Detect 401 status code in response interceptor
2. Call `clearToken()` to remove invalid token
3. Redirect to `/login`
4. Show message: "Your session has expired. Please log in again."
5. Preserve redirect URL (optional): After login, redirect back to intended page

**Retry Behavior** (optional enhancement):
- Automatic retry for network failures (timeout, connection error)
- Exponential backoff for transient errors
- Max retries: 3
- Not applicable to 4xx errors (client errors should not retry)

**Authentication Failure Flow**:
1. API request includes invalid/expired JWT
2. Backend responds with 401
3. Frontend interceptor catches 401
4. Token cleared from storage
5. User redirected to `/login`
6. Login form displays "Session expired" message

### 6. UX & UI Standards

**Layout Principles**:

**Spacing**:
- Consistent spacing scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px
- Tailwind spacing utilities: `p-4`, `m-6`, `gap-4`
- Generous whitespace between sections and elements
- Avoid cramped UI - prioritize readability over density

**Typography**:
- Font hierarchy:
  - Headings: 32px (H1), 24px (H2), 20px (H3)
  - Body: 16px
  - Small text: 14px
  - Labels: 14px
- Font weights: Regular (400), Medium (500), Semibold (600), Bold (700)
- Line height: 1.5 for body text, 1.2 for headings
- Use distinctive, professional fonts (avoid Arial/Inter per frontend-design skill)

**Hierarchy**:
- Clear visual hierarchy: Headings > Body > Labels
- Use size, weight, and color to establish importance
- Group related elements together

**Responsive Design Approach**:

**Breakpoints**:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px - 2560px

**Mobile-First Strategy**:
- Design for mobile first, enhance for larger screens
- Stack elements vertically on mobile
- Use flexbox/grid for responsive layouts
- Touch targets: Minimum 44x44px on mobile

**Responsive Patterns**:
- Task list: Single column on mobile, 2-3 columns on desktop (if grid layout)
- Forms: Full-width on mobile, constrained width (max-w-md) on desktop
- Navigation: Hamburger menu on mobile, horizontal nav on desktop

**Accessibility Considerations**:

**Keyboard Navigation**:
- All interactive elements reachable via Tab key
- Logical tab order (top to bottom, left to right)
- Enter/Space to activate buttons, checkboxes
- Escape to close modals

**Focus Indicators**:
- Visible focus ring on all focusable elements
- High contrast focus styles (e.g., 2px blue outline)
- Avoid relying on `outline: none` without custom focus styles

**Semantic HTML**:
- Use `<button>` for actions, `<a>` for navigation
- Use `<form>` for forms, `<label>` for inputs
- Use headings (`<h1>`, `<h2>`, etc.) in logical order

**ARIA Labels**:
- All form inputs have associated `<label>` or `aria-label`
- Buttons have descriptive text or `aria-label`
- Error messages use `aria-live="polite"` for screen reader announcements
- Loading states use `aria-busy` attribute

**Color Contrast**:
- Text color contrast ratio: 4.5:1 minimum (WCAG AA)
- Large text (18px+): 3:1 minimum
- Don't rely on color alone (use icons + color)

**Consistent Feedback for User Actions**:

**Success Feedback**:
- Task created: New task appears in list immediately (optimistic update)
- Task updated: Visual confirmation (e.g., brief green highlight)
- Task deleted: Removed from list with fade-out animation (optional)
- Optional: Toast notification "Task created successfully" (dismissible)

**Loading Feedback**:
- Submit buttons: Show spinner + "Creating..." text while loading
- Disable button during submission to prevent double-clicks
- Page-level loading: Spinner or skeleton while fetching tasks

**Error Feedback**:
- Error messages displayed near relevant UI element
- Red color + error icon for visibility
- Specific, actionable error text
- Error banner at top of form or page

**Validation Feedback**:
- Real-time validation: Show errors as user types (email format, password length)
- Error messages below input fields
- Red border on invalid fields
- Green checkmark on valid fields (optional)

### 7. Error & Edge Case Handling

**Network Failures**:

**Scenario**: User's internet connection drops during API request

**Handling**:
1. API client detects network error (fetch fails, no response)
2. Catch error in try-catch block
3. Set error state with message: "Unable to connect. Please check your internet connection and try again."
4. Display error banner with retry button
5. Retry button re-attempts the failed request
6. Optional: Automatic retry with exponential backoff (1s, 2s, 4s)

**User Experience**:
- Don't leave user in broken state
- Provide clear explanation and recovery action
- Avoid technical jargon (no "ERR_CONNECTION_REFUSED")

**Unauthorized Access**:

**Scenario**: Unauthenticated user attempts to access `/tasks` directly

**Handling**:
1. Middleware checks for JWT token
2. Token missing or expired
3. Redirect to `/login`
4. Preserve intended URL (optional): `redirect=/tasks`
5. After successful login, redirect to preserved URL

**Scenario**: Authenticated user's token expires mid-session

**Handling**:
1. API request receives 401 response
2. Response interceptor detects 401
3. Clear token from storage
4. Redirect to `/login`
5. Display message: "Your session has expired. Please log in again."

**Empty Task Lists**:

**Scenario**: User has zero tasks

**Handling**:
1. Fetch tasks returns empty array: `[]`
2. Render TaskEmptyState component
3. Display:
   - Illustration or icon (optional)
   - Message: "No tasks yet. Create your first task to get started!"
   - Prominent "Create Task" button
4. Clicking button opens task creation form

**User Experience**:
- Empty state is welcoming, not discouraging
- Provides clear call-to-action
- Guides user to next step

**Form Validation Errors**:

**Scenario**: User submits form with invalid data

**Frontend Validation** (UX):
1. User submits signup form with invalid email
2. Validate email format (regex or built-in validation)
3. Display error: "Please enter a valid email address (e.g., user@example.com)"
4. Highlight email field with red border
5. Focus on first invalid field

**Backend Validation** (Authoritative):
1. Frontend validation passes, submit to backend
2. Backend validates (e.g., email already exists)
3. Backend responds with 422 or 400:
   ```json
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "An account with this email already exists.",
       "details": {
         "email": "Email already registered"
       }
     }
   }
   ```
4. Frontend extracts field errors from `details`
5. Display error messages below relevant fields

**Additional Edge Cases**:

| Edge Case | Handling |
|-----------|----------|
| User navigates back after form submission | Form doesn't resubmit (check if already submitted) |
| User rapidly clicks submit button | Disable button during submission (`isSubmitting` state) |
| User opens multiple tabs | Each tab has independent auth state; token shared via storage |
| API returns malformed JSON | Catch parse error, show generic error message |
| Very long task titles | Truncate with ellipsis, show full title on hover/expand |
| User creates 1000+ tasks | Implement pagination or virtual scrolling (future enhancement) |
| Slow API response | Show loading state, timeout after 30s with error message |

### 8. Non-Goals (Explicit)

These features are explicitly **NOT** included in this frontend implementation:

**No Real-Time Updates**:
- No WebSockets or Server-Sent Events (SSE)
- No live synchronization across devices/tabs
- Tasks update only on page refresh or explicit user actions
- Rationale: Simplifies architecture, reduces complexity for MVP

**No Advanced Animations**:
- No complex transitions or motion effects
- Basic transitions only: fade-in, slide-in, hover states
- No animation libraries (Framer Motion, GSAP)
- Rationale: Focus on functionality and accessibility; animations are future enhancements

**No AI or Agent Features**:
- No AI-powered task suggestions or smart categorization
- No natural language processing for task input
- No intelligent task prioritization
- Rationale: Out of scope for current requirements

**No Offline Support**:
- No service workers or Progressive Web App (PWA) features
- No offline data persistence or synchronization
- App requires active internet connection
- Rationale: API-first design; offline support adds significant complexity

**No Rich Task Attributes** (Initial Version):
- No due dates, priorities, tags, categories
- No subtasks or task dependencies
- No task attachments or rich text descriptions
- Task schema: `{ id, title, completed, user_id }` only
- Rationale: Scoped to MVP; additional fields are future enhancements

**No Collaboration Features**:
- No task sharing or team workspaces
- No real-time multi-user collaboration
- Single-user experience only (isolated by JWT)
- Rationale: Phase 2 focuses on multi-user architecture, not collaboration

**No Advanced Filtering/Sorting** (Initial Version):
- No search functionality
- No complex filters (by date, priority, category)
- No custom sort options beyond default order
- Rationale: Future enhancement; MVP displays all tasks in default order

**Implementation Guidance**:
- Avoid feature creep - stick to spec requirements
- Document future enhancements separately
- Focus on quality implementation of core features
- Ensure architecture allows for future additions without major refactoring

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

## Security Considerations

*Required for all features. Reference: Constitution v1.2.0 - Security Principles*

### Input Validation
- [x] Frontend validation for UX (format checks, required fields)
- [x] Backend validation is authoritative (frontend trusts backend responses)
- [x] Form libraries (React Hook Form/Formik) provide built-in validation
- [x] Input sanitization handled by React JSX auto-escaping

### Authentication & Authorization
- [x] JWT token included in all API requests (Authorization header or http-only cookie)
- [x] Frontend checks token existence for route protection (middleware)
- [x] Token validation (cryptographic) performed by backend only
- [x] User identity derived from backend responses, not client-side token decoding
- [x] 401 responses trigger token clearance and redirect to login

### SQL Injection Prevention
- [x] N/A (frontend only - no database access)
- [x] Backend handles all SQL queries with ORM

### XSS Protection
- [x] React's JSX auto-escaping used for all user-generated content
- [x] No use of `dangerouslySetInnerHTML` (avoid unless absolutely necessary)
- [x] Task titles and user input rendered via JSX variables: `{task.title}`
- [x] If dynamic HTML needed: sanitize with DOMPurify library

### CORS Policy
- [x] N/A (frontend consumes backend API - CORS configured on backend)
- [x] Backend must allow frontend origin in CORS policy

### Rate Limiting
- [x] N/A (frontend - rate limiting enforced by backend)
- [x] Frontend handles 429 responses with user-friendly "Too many requests. Please try again later." message

### Secrets Management
- [x] No secrets in frontend code (frontend is public)
- [x] API URL in environment variable: `NEXT_PUBLIC_API_URL`
- [x] `.env.local` in `.gitignore`
- [x] `.env.example` documents required variables:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

### Frontend-Specific Security Concerns

**JWT Token Storage**:
- **Risk**: XSS attacks can steal tokens from localStorage
- **Mitigation**: Prefer http-only cookies (backend sets, frontend doesn't access)
- **Fallback**: If using localStorage, implement Content Security Policy (CSP)

**Token Exposure**:
- **Risk**: Token leaked in URL params, logs, or error messages
- **Mitigation**: Never include token in URLs or GET parameters
- **Mitigation**: Don't log full tokens (log only last 4 chars for debugging)

**Client-Side Validation Bypass**:
- **Risk**: Users can bypass frontend validation via browser dev tools
- **Mitigation**: Frontend validation is UX only; backend enforces security
- **Mitigation**: Trust backend error responses for validation

**Open Redirects**:
- **Risk**: After login, redirect to user-controlled URL (phishing)
- **Mitigation**: Whitelist redirect URLs (only `/tasks`, `/`)
- **Mitigation**: Validate redirect parameter before using

**Dependency Vulnerabilities**:
- **Risk**: npm packages with known security issues
- **Mitigation**: Run `npm audit` regularly
- **Mitigation**: Keep dependencies updated
- **Mitigation**: Use Dependabot or Snyk for automated alerts

**Security Risks Identified**:
1. **XSS via task titles**: Mitigated by JSX auto-escaping
2. **JWT theft via XSS**: Mitigated by http-only cookies (preferred)
3. **CSRF attacks**: Mitigated by SameSite cookie policy (backend responsibility)
4. **Session fixation**: Mitigated by generating new token on login (backend responsibility)
5. **Brute force login**: Mitigated by backend rate limiting
6. **Clickjacking**: Mitigated by X-Frame-Options header (backend/CDN)

## Testing Strategy

*Required for all features. Reference: Constitution v1.2.0 - Testing Requirements*

### Test Coverage Targets
- [x] Frontend: Critical user flows tested (signup, login, task CRUD)
- [x] UI components have unit tests (Jest + React Testing Library)
- [x] Form validation logic covered by tests
- [x] API integration and error handling tested

### Testing Approach

**Unit Tests** (Jest):
- **Utility functions**: `lib/auth/token.ts` (getToken, setToken, clearToken, isTokenExpired)
- **API client functions**: `lib/api/client.ts` (error handling, header injection)
- **Form validation logic**: Email format, password strength checks
- **Helper functions**: Date formatting, string manipulation

**Component Tests** (React Testing Library):
- **UI components**: Button, Input, Card, Modal, Spinner, ErrorMessage
- **Auth components**: LoginForm, SignupForm (form submission, validation errors)
- **Task components**: TaskList, TaskItem, TaskForm, TaskEmptyState
- **Layout components**: Header, Navigation

**Test Scenarios**:
- Render components without crashing
- Display correct content based on props
- Handle user interactions (clicks, form submissions)
- Show loading/error states appropriately
- Call callbacks with correct arguments

**Integration Tests** (React Testing Library + MSW):
- **Mock Service Worker (MSW)**: Mock backend API responses
- **User flows**:
  - Signup: Submit form → API success → redirect to `/tasks`
  - Login: Submit credentials → API success → redirect to `/tasks`
  - Task CRUD: Fetch tasks → create new task → toggle completion → delete task
  - Error handling: API failure → display error message
  - Auth expiry: 401 response → redirect to `/login`

**E2E Tests** (Playwright/Cypress - Optional):
- **Happy path - New user**:
  1. Navigate to `/signup`
  2. Fill signup form with valid data
  3. Submit form
  4. Verify redirect to `/tasks`
  5. Verify empty state message
  6. Create first task
  7. Verify task appears in list
- **Happy path - Returning user**:
  1. Navigate to `/login`
  2. Enter credentials
  3. Submit form
  4. Verify redirect to `/tasks`
  5. Verify existing tasks displayed
  6. Toggle task completion
  7. Edit task
  8. Delete task
- **Unauthorized access**:
  1. Navigate to `/tasks` without auth
  2. Verify redirect to `/login`

### Test-Driven Development
- [x] Tests written alongside feature development (TDD encouraged)
- [x] Each task in tasks.md includes test cases
- [x] Tests are part of definition of done

### Testing Tools & Setup

**Frontend Testing Stack**:
- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing (user-centric)
- **MSW (Mock Service Worker)**: API mocking for integration tests
- **@testing-library/user-event**: Simulate user interactions
- **Playwright or Cypress**: E2E testing (optional for MVP)

**Test Configuration**:
- `jest.config.js`: Jest configuration
- `setupTests.ts`: Global test setup (MSW server, custom matchers)
- `.env.test`: Test environment variables

**Test Data Strategy**:
- **Fixtures**: Mock user and task data in `tests/fixtures/`
- **MSW Handlers**: Mock API responses (success, error, edge cases)
- **Factory Functions**: Generate test data dynamically (createMockTask, createMockUser)
- **Cleanup**: Reset MSW handlers between tests, clear localStorage

**Running Tests**:
```bash
npm test                # Run all tests
npm test -- --coverage  # Run with coverage report
npm test -- --watch     # Watch mode for development
npm run test:e2e        # Run E2E tests (Playwright/Cypress)
```

**Testing Risks**:
1. **API dependency**: Mitigated by MSW mocking
2. **Authentication flows**: Complex multi-step flows - mitigated by integration tests
3. **Browser-specific issues**: E2E tests in multiple browsers (Chrome, Firefox, Safari)
4. **Async timing issues**: Use React Testing Library's `waitFor` and `findBy` queries
5. **localStorage mocking**: Mock localStorage in test environment

## Error Handling Standards

*Required for all features. Reference: Constitution v1.2.0 - Error Handling Standards*

### HTTP Status Code Handling (Frontend Perspective)

Frontend handles these status codes from backend API:

- **200 OK**: Successful GET, PATCH requests → Display data normally
- **201 Created**: Successful POST (task creation, signup) → Add to list, redirect as appropriate
- **204 No Content**: Successful DELETE → Remove from list
- **400 Bad Request**: Invalid input → Display validation error message
- **401 Unauthorized**: Missing/invalid/expired auth → Clear token, redirect to `/login` with "Session expired" message
- **403 Forbidden**: Insufficient permissions → Display "You don't have permission to perform this action"
- **404 Not Found**: Resource not found → Display "This task could not be found. It may have been deleted."
- **422 Unprocessable Entity**: Validation errors → Display field-specific error messages
- **429 Too Many Requests**: Rate limit exceeded → Display "Too many requests. Please try again later."
- **500 Internal Server Error**: Server error → Display "Something went wrong on our end. Please try again later."
- **Network Error** (no response): Connection failure → Display "Unable to connect. Please check your internet connection and try again."

### Error Response Parsing

Frontend expects errors in this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

**Parsing Logic**:
1. Check response status code
2. If 4xx or 5xx, parse response body
3. Extract `error.message` for user display
4. If `error.details` present, map to field errors

**Fallback Handling**:
- If response doesn't match expected format, display generic error
- If network error (no response), display connection error message

### Error Handling Strategy

- [x] Display user-friendly error messages (no technical jargon)
- [x] Map HTTP status codes to specific user messages
- [x] Extract field-specific errors from `error.details` for form validation
- [x] Provide actionable guidance ("Please try again", "Check your input")
- [x] No sensitive information exposed (backend's responsibility)

### Logging Approach (Frontend)

- [x] Log errors to browser console (development only)
- [x] Production logging: Send critical errors to error tracking service (Sentry, LogRocket)
- [x] Log context: URL, user action, timestamp, error message
- [x] No sensitive data logged (passwords, full tokens)
- [x] Severity levels: `console.error()` for errors, `console.warn()` for warnings

**Frontend Logging Strategy**:
```typescript
// Development: Console logging
console.error('[API Error]', {
  endpoint: '/api/v1/tasks',
  status: 500,
  message: error.message,
  timestamp: new Date().toISOString()
});

// Production: Error tracking service
Sentry.captureException(error, {
  tags: { feature: 'tasks', action: 'create' },
  user: { id: userId }, // Don't log PII
  extra: { endpoint, status }
});
```

**Error Scenarios for Frontend**:

| Scenario | User Message | Action |
|----------|--------------|--------|
| Signup with existing email | "An account with this email already exists. Please log in or use a different email." | Highlight email field |
| Invalid login credentials | "Invalid email or password. Please try again." | Clear password field |
| Session expired (401) | "Your session has expired. Please log in again." | Redirect to `/login` |
| Network failure | "Unable to connect. Please check your internet connection and try again." | Show retry button |
| Task not found (404) | "This task could not be found. It may have been deleted." | Remove from list |
| Empty task title | "Task title is required. Please enter a title." | Highlight title field |
| Server error (500) | "Something went wrong. Please try again later." | Log error, show contact support option |
| Rate limit (429) | "Too many requests. Please try again in a few minutes." | Disable submit temporarily |

## API Design (Frontend Consumer Perspective)

*Frontend consumes backend API. Reference: Constitution v1.2.0 - API Design Principles*

### API Versioning
- [x] All endpoints versioned: `/api/v1/...`
- [x] Frontend configured for `/api/v1` base path

### Expected API Endpoints (Frontend Consumption)

**Authentication Endpoints**:
- `POST /api/v1/auth/signup`: Create new user account
  - Request: `{ "email": "string", "password": "string" }`
  - Response: `{ "data": { "user": {...}, "token": "jwt-string" } }`
- `POST /api/v1/auth/login`: Authenticate user
  - Request: `{ "email": "string", "password": "string" }`
  - Response: `{ "data": { "user": {...}, "token": "jwt-string" } }`
- `POST /api/v1/auth/logout`: Invalidate session (optional)

**Task Endpoints**:
- `GET /api/v1/todos`: List all tasks for authenticated user
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "data": [ { "id": "uuid", "title": "string", "completed": boolean }, ... ] }`
- `POST /api/v1/todos`: Create new task
  - Request: `{ "title": "string" }`
  - Response: `{ "data": { "id": "uuid", "title": "string", "completed": false } }`
- `PATCH /api/v1/todos/{id}`: Update task
  - Request: `{ "title": "string" }` OR `{ "completed": boolean }`
  - Response: `{ "data": { "id": "uuid", "title": "string", "completed": boolean } }`
- `DELETE /api/v1/todos/{id}`: Delete task
  - Response: `204 No Content`

### Pagination (Future Enhancement)
- [ ] List endpoints will support pagination when task count grows
- [ ] Frontend will handle pagination parameters: `?page=1&limit=20`
- [ ] Display pagination controls (Previous/Next buttons)
- [ ] Current MVP: No pagination (fetch all tasks)

### Filtering & Sorting (Not Implemented - MVP)
- [ ] Future: Filter by status (`?status=completed`)
- [ ] Future: Sort by creation date (`?sort_by=created_at&order=desc`)
- [ ] Current: Display all tasks in default order

### Response Format

**Success Responses**:
```json
{
  "data": { /* resource object or array */ },
  "meta": { /* optional metadata */ }
}
```

**Error Responses**:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { /* field-specific errors */ }
  }
}
```

**API Integration Decisions**:

1. **Base URL Configuration**:
   - Environment variable: `NEXT_PUBLIC_API_URL`
   - Development: `http://localhost:8000`
   - Production: `https://api.example.com` (configured via env)

2. **Authentication Header**:
   - JWT sent via `Authorization: Bearer <token>` header
   - Automatically added by API client for all requests (except login/signup)

3. **Content-Type**:
   - All requests: `Content-Type: application/json`
   - All responses: `Content-Type: application/json`

4. **CORS Handling**:
   - Backend must allow frontend origin
   - Frontend includes credentials in requests if using cookies
   - Fetch API: `credentials: 'include'` (for http-only cookies)

5. **Error Handling**:
   - Parse error responses consistently
   - Map status codes to user-friendly messages
   - Handle network errors gracefully

## Data Management (Frontend Perspective)

*Frontend consumes data via API. Reference: Constitution v1.2.0 - Data Management*

### Frontend Data Flow

**Data Source**: All data fetched from backend REST API (no direct database access)

**Data Lifecycle**:
1. **Fetch**: GET request to API → receive data → parse JSON → store in React state
2. **Create**: POST request → receive new resource → add to local state
3. **Update**: PATCH request → receive updated resource → update in local state
4. **Delete**: DELETE request → remove from local state

### Data Validation Boundaries

- **Frontend Validation** (UX only):
  - Email format validation (regex)
  - Password minimum length (8 characters)
  - Required field checks (task title non-empty)
  - Real-time validation feedback as user types

- **Backend Validation** (Authoritative):
  - Frontend trusts backend responses
  - Display backend validation errors from `error.details`
  - No frontend logic to override backend rules

- **Database Constraints**: N/A (backend responsibility)

### State Management Strategy

**React State**:
- Task list: `const [tasks, setTasks] = useState<Task[]>([])`
- Loading state: `const [isLoading, setIsLoading] = useState(false)`
- Error state: `const [error, setError] = useState<string | null>(null)`

**State Updates**:
- **Optimistic Updates**: Update UI immediately before API confirmation
  - Example: Mark task complete → update UI → send API request → rollback on error
- **Pessimistic Updates**: Wait for API confirmation before updating UI
  - Example: Create task → send API request → add to list on success

**State Persistence**:
- Tasks persisted via backend API (not frontend localStorage)
- Auth token persisted in localStorage or http-only cookie
- No other client-side persistence (no IndexedDB, sessionStorage for task data)

### TypeScript Type Definitions

```typescript
// types/task.ts
interface Task {
  id: string;           // UUID from backend
  title: string;        // Task title
  completed: boolean;   // Completion status
  user_id: string;      // User association (implicit via JWT)
  created_at?: string;  // Optional timestamp
  updated_at?: string;  // Optional timestamp
}

// types/auth.ts
interface User {
  id: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
}
```

### Data Caching (Optional Enhancement)

**Current MVP**: No caching
- Fetch tasks fresh on every page load
- No cache invalidation complexity

**Future Enhancement**: React Query or SWR
- Automatic caching and background refetching
- Optimistic updates with rollback
- Cache invalidation on mutations

**Data Management Decisions**:
1. **No client-side data persistence**: All data stored on backend
2. **Optimistic UI updates**: Improve perceived performance for task operations
3. **Simple state management**: React useState sufficient for MVP scope
4. **Type safety**: TypeScript interfaces for all data structures
5. **No local caching**: Simplifies architecture, avoids stale data issues

## Performance Guidelines

*Required for all features. Reference: Constitution v1.2.0 - Performance Guidelines*

### Response Time Targets

- [x] Frontend pages: <2s initial load (Next.js optimized builds)
- [x] Task operations: <1s with visual feedback <100ms
- [x] API calls: Frontend displays loading state immediately
- [x] Backend API response time: <200ms (backend responsibility)

### Frontend Optimization Strategies

**Initial Page Load** (<2s target):
- Next.js automatic code splitting (page-level)
- Tree shaking to remove unused code
- Minified and compressed assets (production build)
- Lazy loading for non-critical components
- Image optimization (next/image component)

**Runtime Performance**:
- Optimistic UI updates (immediate feedback)
- Debounce search/filter inputs (if implemented)
- Virtualized lists for 100+ tasks (future enhancement)
- Memoization for expensive computations (`useMemo`, `useCallback`)

**Bundle Size Optimization**:
- Analyze bundle size: `next build && next-bundle-analyzer`
- Remove unused dependencies
- Use dynamic imports for large libraries
- Code split by route (Next.js default)

### Caching Strategy

**Static Assets** (Next.js default):
- Cache-Control headers on static files (images, fonts, CSS, JS)
- Long-term caching for hashed assets
- Service worker caching (future PWA enhancement)

**API Response Caching** (Future Enhancement):
- React Query or SWR for client-side caching
- Stale-while-revalidate pattern
- Background refetching

**Browser Caching**:
- JWT token in http-only cookie or localStorage (persistent)
- No other client-side data caching for MVP

### Resource Management

**API Request Optimization**:
- Avoid redundant API calls (don't refetch on every render)
- Cancel in-flight requests on component unmount (AbortController)
- Request timeouts (30s default)

**Memory Management**:
- Clean up event listeners on component unmount
- Clear timers and intervals
- Properly manage React refs

**Network Optimization**:
- HTTP/2 or HTTP/3 for multiplexing (server/CDN config)
- Compress API responses (gzip/brotli - backend responsibility)
- Minimize request payload size

### Performance Monitoring

**Metrics to Track**:
- **Largest Contentful Paint (LCP)**: <2.5s (Core Web Vital)
- **First Input Delay (FID)**: <100ms (Core Web Vital)
- **Cumulative Layout Shift (CLS)**: <0.1 (Core Web Vital)
- **Time to Interactive (TTI)**: <3.8s

**Monitoring Tools**:
- Lighthouse (Chrome DevTools) for performance audits
- Next.js analytics for real user monitoring
- Google Analytics or Vercel Analytics
- Web Vitals library for Core Web Vitals tracking

**Performance Risks**:
1. **Large task lists (1000+ tasks)**: Mitigated by pagination or virtualization (future)
2. **Slow API responses**: Mitigated by loading states and timeouts
3. **Large bundle size**: Mitigated by code splitting and tree shaking
4. **Network latency**: Mitigated by optimistic updates and caching (future)
5. **Re-renders on state changes**: Mitigated by React.memo and proper state design

## Observability & Monitoring (Frontend)

*Frontend monitoring and error tracking. Reference: Constitution v1.2.0 - Observability*

### Logging Standards (Frontend)

**Development**:
- **console.error()**: API errors, unexpected errors, component crashes
- **console.warn()**: Deprecated API usage, performance warnings
- **console.info()**: User actions, navigation events, API calls
- **console.debug()**: Detailed component lifecycle, state changes (development only)

**Production**:
- **Error Tracking**: Sentry, LogRocket, or similar service
- **No console.log()**: Remove all console statements in production builds
- **Structured Error Context**:
  ```typescript
  Sentry.captureException(error, {
    tags: { feature: 'tasks', action: 'create' },
    user: { id: userId }, // No PII
    extra: { endpoint, status, timestamp }
  });
  ```

### Error Monitoring

**Error Tracking Service** (Sentry recommended):
- Capture unhandled errors and promise rejections
- Track API errors (4xx, 5xx responses)
- Monitor render errors (React error boundaries)
- Record user sessions leading to errors (optional)

**Error Boundaries**:
```tsx
// app/error.tsx (Next.js App Router)
'use client';
export default function Error({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Monitoring Requirements

**Frontend Metrics to Track**:
- [x] API call success/failure rates
- [x] API response times (client perspective)
- [x] Authentication success/failure rates
- [x] User actions (task created, toggled, deleted)
- [x] Error frequency and types
- [x] Page load times (Core Web Vitals)

**Analytics Integration** (Google Analytics, Mixpanel, or Amplitude):
- Track user flows: Signup → Login → Task creation
- Track feature usage: Tasks created, tasks completed
- Track error events: API failures, validation errors
- A/B testing support (future)

### Health Monitoring

**Frontend Health** (no dedicated endpoint):
- Client-side error rates monitored via error tracking
- Performance metrics via Web Vitals
- Uptime monitored via backend API health checks

**Backend Health** (consumed by frontend):
- Frontend can ping `GET /api/health` to check backend status
- Display system status page if backend unhealthy

### User Session Recording (Optional)

**Tools**: LogRocket, FullStory, Hotjar
- Record user sessions for debugging
- Replay user actions leading to errors
- Privacy: Mask sensitive input fields (passwords, emails)
- Opt-in/opt-out based on consent

**Monitoring Strategy for Frontend**:
1. **Error Tracking**: Sentry for error capture and alerting
2. **Analytics**: Google Analytics for user behavior and funnels
3. **Performance**: Web Vitals tracking + Lighthouse audits
4. **Session Replay**: LogRocket for debugging complex user issues (optional)
5. **Alerts**: Set up Sentry alerts for error rate thresholds (e.g., >10 errors/min)

## Environment & Configuration

*Required for all features. Reference: Constitution v1.2.0 - Environment Management*

### Environment Variables Required

**Frontend Environment Variables**:

```.env.local
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Sentry DSN for error tracking (production)
NEXT_PUBLIC_SENTRY_DSN=https://...

# Optional: Google Analytics ID (production)
NEXT_PUBLIC_GA_ID=G-...

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

**Variable Naming Convention**:
- `NEXT_PUBLIC_*`: Public variables exposed to browser (Next.js requirement)
- Non-prefixed variables: Server-side only (not accessible in browser)

**`.env.example`** (committed to repo):
```
# Backend API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Error tracking (optional - production only)
# NEXT_PUBLIC_SENTRY_DSN=

# Analytics (optional - production only)
# NEXT_PUBLIC_GA_ID=
```

### Configuration Management

**Next.js Configuration** (`next.config.js`):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Other configs...
}
module.exports = nextConfig;
```

**Environment-Specific Configs**:
- **Development**: `.env.local` (gitignored)
- **Production**: Environment variables set via hosting platform (Vercel, Netlify, etc.)

**Configuration Validation**:
- [x] Required variables checked at build time
- [x] TypeScript types for env variables (type safety)
- [x] Fail fast if `NEXT_PUBLIC_API_URL` missing

**Type-Safe Environment Variables** (optional):
```typescript
// lib/env.ts
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  gaId: process.env.NEXT_PUBLIC_GA_ID,
} as const;

// Validation
if (!env.apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is required');
}
```

**Configuration Decisions**:
1. **All config via environment variables**: No hardcoded URLs or secrets
2. **`.env.local` for local development**: Gitignored, not committed
3. **`.env.example` documents all variables**: Template for developers
4. **Public variables prefixed with `NEXT_PUBLIC_`**: Next.js convention
5. **Hosting platform manages production env**: Vercel/Netlify/AWS environment management

## Code Quality Standards

*Required for all features. Reference: Constitution v1.2.0 - Code Quality*

### Frontend (TypeScript/Next.js)

**Code Formatting**:
- [x] **Prettier**: Automatic code formatting
- [x] Config: `.prettierrc.json`
- [x] Format on save (VSCode/IDE integration)
- [x] Pre-commit hook: Format staged files

**Linting**:
- [x] **ESLint**: Code quality and consistency
- [x] Config: `.eslintrc.json`
- [x] Rules: Next.js recommended + Airbnb style guide
- [x] Pre-commit hook: Lint staged files

**Type Checking**:
- [x] **TypeScript strict mode**: Enabled in `tsconfig.json`
- [x] No `any` types (use `unknown` or explicit types)
- [x] Explicit return types on functions
- [x] Interface/type definitions for all data structures

**TypeScript Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

**Code Style**:
- [x] Airbnb style guide (via ESLint config)
- [x] Functional components with hooks (no class components)
- [x] Named exports for components (not default exports)
- [x] Consistent file naming: kebab-case for files, PascalCase for components

### Git Hooks (Husky + lint-staged)

**Pre-commit Hook**:
```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "tsc --noEmit"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

**Pre-push Hook**:
```bash
npm test -- --passWithNoTests
```

### Documentation Standards

**Code Documentation**:
- [x] JSDoc comments for complex functions
- [x] Inline comments for non-obvious logic
- [x] Component props documented (TypeScript interfaces)

**API Integration Documentation** (`lib/api/README.md`):
- Document API client usage
- Include request/response examples
- List all API functions and their parameters

**Component Documentation** (Storybook - Optional):
- Interactive component showcase
- Usage examples
- Props table

**README Documentation** (`frontend/README.md`):
- [x] Setup instructions (install, configure, run)
- [x] Environment variables required
- [x] Available scripts (dev, build, test, lint)
- [x] Project structure overview
- [x] Contribution guidelines

### Quality Gates (CI/CD)

**Build-Time Checks**:
1. **TypeScript compilation**: `tsc --noEmit` (no type errors)
2. **Linting**: `eslint . --ext .ts,.tsx` (no lint errors)
3. **Tests**: `npm test` (all tests pass)
4. **Build**: `npm run build` (production build succeeds)

**Pre-Deployment Checklist**:
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Lighthouse performance score >90
- [ ] Accessibility audit passes (aXe, Lighthouse)
- [ ] Bundle size within limits (<500KB initial JS)

### Component Quality Standards

**Component Structure**:
```tsx
// Good: Named export, explicit types, clear structure
import React from 'react';
import type { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  // Component logic
  return (
    // JSX
  );
}
```

**Code Quality Checks for Frontend**:
1. **No any types**: Use TypeScript strict mode, explicit types
2. **No console.log in production**: Remove via linter or build process
3. **Accessibility**: All interactive elements keyboard accessible
4. **Performance**: React.memo for expensive components, useMemo/useCallback for optimizations
5. **Security**: No dangerouslySetInnerHTML, sanitize user input
6. **Testing**: All components have unit/integration tests
