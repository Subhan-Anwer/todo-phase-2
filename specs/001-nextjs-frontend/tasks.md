# Tasks: Next.js Frontend Web Application

**Input**: Design documents from `/specs/001-nextjs-frontend/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-contract.md

**Constitution Compliance**: All tasks must adhere to Constitution v1.2.0 standards including Security Principles, Testing Requirements, Error Handling Standards, and Code Quality Standards.

**Tests**: Tests are MANDATORY per Constitution v1.2.0 - Test-Driven Development principle. All features must have accompanying tests before being marked complete.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**CRITICAL CONSTRAINT**: Better Auth is NOT implemented in the frontend directly. Authentication flows are simulated via `MockAuthService` (Phase 2 Frontend). Auth integration is swappable to `BetterAuthService` (Phase 2 Backend) without UI changes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/` directory
- **Source**: `frontend/app/`, `frontend/components/`, `frontend/lib/`, `frontend/types/`
- **Tests**: `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure per quickstart.md

- [X] T001 Initialize Next.js project with TypeScript and Tailwind CSS in `frontend/` directory
- [X] T002 [P] Configure TypeScript strict mode in `frontend/tsconfig.json`
- [X] T003 [P] Configure Tailwind CSS in `frontend/tailwind.config.js`
- [X] T004 [P] Configure Next.js settings in `frontend/next.config.js`
- [X] T005 [P] Setup ESLint configuration in `frontend/.eslintrc.json`
- [X] T006 [P] Setup Prettier configuration in `frontend/.prettierrc.json`
- [X] T007 [P] Create environment variable template in `frontend/.env.example`
- [X] T008 Create `frontend/.env.local` with `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_USE_MOCK_AUTH=true`
- [X] T009 [P] Setup Git hooks with Husky and lint-staged in `frontend/`
- [X] T010 [P] Create directory structure per plan.md (app/, components/, lib/, types/, tests/)
- [X] T011 [P] Install core dependencies (Next.js, React, Tailwind CSS, TypeScript)
- [X] T012 [P] Install testing dependencies (Jest, React Testing Library, MSW, Playwright)
- [X] T013 [P] Configure Jest in `frontend/jest.config.js`
- [X] T014 [P] Create Jest setup file in `frontend/jest.setup.js`
- [X] T015 [P] Setup MSW handlers in `frontend/tests/mocks/handlers.ts`
- [X] T016 [P] Setup MSW server in `frontend/tests/mocks/server.ts`
- [X] T017 [P] Create test fixtures for users in `frontend/tests/fixtures/users.ts`
- [X] T018 [P] Create test fixtures for tasks in `frontend/tests/fixtures/tasks.ts`
- [X] T019 Add npm scripts to `frontend/package.json` (dev, build, test, lint, format, type-check)

**Checkpoint**: ✅ Project structure ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Type Definitions (Constitution: Code Quality)

- [X] T020 [P] Create User types in `frontend/types/auth.ts` (User, AuthResponse, LoginCredentials, SignupData, AuthState)
- [X] T021 [P] Create Task types in `frontend/types/task.ts` (Task, CreateTaskInput, UpdateTaskInput, TaskListState)
- [X] T022 [P] Create API response types in `frontend/types/api.ts` (APIResponse, APIError, PaginationMeta)
- [X] T023 [P] Create Form types in `frontend/types/form.ts` (FormErrors, FormState, LoginFormValues, SignupFormValues, TaskFormValues)
- [X] T024 [P] Create type guards in `frontend/types/guards.ts` (isTask, isAPIError, isAuthResponse)

### Mock Auth Service Layer (CRITICAL - Swappable Implementation)

- [X] T025 [P] Define AuthService interface in `frontend/lib/auth/auth-service.ts`
- [X] T026 Implement MockAuthService in `frontend/lib/auth/mock-auth-service.ts` (localStorage-based, base64 JWT tokens)
- [X] T027 [P] Create Better Auth service placeholder in `frontend/lib/auth/better-auth-service.ts` (for Phase 2 Backend)
- [X] T028 Create auth service factory in `frontend/lib/auth/index.ts` (environment variable toggle)
- [X] T029 Add helper functions to MockAuthService (generateMockJWT, getMockUsers, validateMockCredentials)

### API Client & Utilities (Constitution: API Design)

- [X] T030 [P] Create API client wrapper in `frontend/lib/api/client.ts` (Fetch API with auth headers)
- [ ] T031 [P] Create API error handling in `frontend/lib/api/errors.ts` (transform backend errors to user-friendly messages)
- [X] T032 [P] Create task API methods in `frontend/lib/api/tasks.ts` (list, create, update, delete)
- [ ] T033 [P] Add request timeout configuration to API client
- [ ] T034 Add retry logic for network failures to API client

### Custom Hooks

- [X] T035 Create useAuth hook in `frontend/lib/hooks/useAuth.ts` (auth state management)
- [X] T036 Create useTasks hook in `frontend/lib/hooks/useTasks.ts` (task state management, optimistic updates)

### Utility Functions

- [X] T037 [P] Create form validators in `frontend/lib/utils/validators.ts` (email, password, task title)
- [X] T038 [P] Create formatters in `frontend/lib/utils/formatters.ts` (date, text)

### Reusable UI Components (Constitution: Accessibility)

- [X] T039 [P] Create Button component in `frontend/components/ui/Button.tsx` (accessible, keyboard navigable)
- [X] T040 [P] Create Input component in `frontend/components/ui/Input.tsx` (with label, error display)
- [X] T041 [P] Create Checkbox component in `frontend/components/ui/Checkbox.tsx` (accessible)
- [X] T042 [P] Create ErrorMessage component in `frontend/components/ui/ErrorMessage.tsx`
- [X] T043 [P] Create LoadingSpinner component in `frontend/components/ui/LoadingSpinner.tsx`
- [X] T044 [P] Create Modal component in `frontend/components/ui/Modal.tsx` (accessible, keyboard trap)

### Layout Components

- [X] T045 [P] Create Header component in `frontend/components/layout/Header.tsx` (with logout button)
- [X] T046 [P] Create Footer component in `frontend/components/layout/Footer.tsx`

### Next.js Middleware (Route Protection)

- [X] T047 Create middleware in `frontend/middleware.ts` (protect /tasks routes, redirect unauthenticated users)
- [X] T048 Add redirect logic for authenticated users on /login and /signup

### Root Layout & Landing Page

- [X] T049 Create root layout in `frontend/app/layout.tsx` (metadata, global styles)
- [X] T050 Create landing page in `frontend/app/page.tsx` (redirect logic based on auth state)
- [X] T051 [P] Create global error boundary in `frontend/app/error.tsx`
- [X] T052 [P] Create global loading UI in `frontend/app/loading.tsx`

**Checkpoint**: ✅ Foundation complete - user story implementation can now begin in parallel

