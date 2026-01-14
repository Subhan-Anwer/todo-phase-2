# Tasks: Next.js Frontend Web Application

**Input**: Design documents from `/specs/001-nextjs-frontend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Constitution Compliance**: All tasks must adhere to Constitution v1.2.0 standards including Security Principles, Testing Requirements, Error Handling Standards, and Code Quality Standards.

**Tests**: Tests are included for critical user flows and components per Constitution v1.2.0 Test-Driven Development principle.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **Checkbox**: ALWAYS start with `- [ ]`
- **[ID]**: Sequential task number (T001, T002, T003...)
- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

All paths relative to `frontend/` directory:
- **Pages**: `app/(auth)/`, `app/(protected)/`
- **Components**: `components/ui/`, `components/auth/`, `components/tasks/`
- **API**: `lib/api/`
- **Utils**: `lib/auth/`, `lib/utils/`
- **Types**: `types/`
- **Tests**: `tests/unit/`, `tests/components/`

---

## Phase 1: Setup & Project Initialization

**Purpose**: Initialize Next.js project with required dependencies and configuration

**Deliverable**: Working Next.js development environment with all dependencies installed

### Project Initialization
- [ ] T001 Initialize Next.js 14+ project with TypeScript and Tailwind CSS in `frontend/` directory
- [ ] T002 Configure `tsconfig.json` with strict mode and path aliases (`@/*`)
- [ ] T003 [P] Configure Tailwind CSS in `tailwind.config.js` with custom theme (per frontend-design skill)
- [ ] T004 [P] Configure Next.js in `next.config.js` with environment variable support
- [ ] T005 [P] Set up ESLint with Next.js, TypeScript, and Prettier rules in `.eslintrc.json`
- [ ] T006 [P] Configure Prettier in `.prettierrc.json`
- [ ] T007 Create `.env.example` with `NEXT_PUBLIC_API_URL` documentation
- [ ] T008 Create `.env.local` with local development API URL (`http://localhost:8000`)
- [ ] T009 [P] Add `.env.local` to `.gitignore`

### Dependency Installation
- [ ] T010 [P] Install core dependencies: `react-hook-form` (optional), `msw` (dev), testing libraries
- [ ] T011 [P] Install dev dependencies: `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- [ ] T012 [P] Install Husky and lint-staged for git hooks
- [ ] T013 Configure Husky pre-commit hook to run ESLint, Prettier, and type-check

### Directory Structure
- [ ] T014 Create `app/(auth)/login/` and `app/(auth)/signup/` route directories
- [ ] T015 Create `app/(protected)/tasks/` route directory
- [ ] T016 [P] Create `components/ui/`, `components/auth/`, `components/tasks/`, `components/layout/` directories
- [ ] T017 [P] Create `lib/api/`, `lib/auth/`, `lib/utils/` directories
- [ ] T018 [P] Create `types/` directory with `auth.ts` and `task.ts` files
- [ ] T019 [P] Create `tests/unit/`, `tests/components/`, `tests/fixtures/` directories

### Testing Setup
- [ ] T020 [P] Configure Jest in `jest.config.js` for Next.js
- [ ] T021 [P] Create `jest.setup.js` with Testing Library setup and localStorage mock
- [ ] T022 [P] Configure MSW (Mock Service Worker) in `tests/mocks/server.ts`
- [ ] T023 [P] Create MSW handlers in `tests/mocks/handlers.ts` for auth and tasks endpoints

### Configuration Files
- [ ] T024 [P] Update `package.json` with scripts: `dev`, `build`, `test`, `lint`, `format`, `type-check`
- [ ] T025 [P] Create global CSS in `app/globals.css` with Tailwind directives
- [ ] T026 Verify setup: Run `npm run dev` and confirm Next.js starts on port 3000

---

## Phase 2: Foundational (Core Infrastructure)

**Purpose**: Implement shared utilities and infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Deliverable**: Working API client, auth utilities, type definitions, and base UI components

### TypeScript Type Definitions
- [ ] T027 [P] [US1] Define User, AuthResponse, LoginCredentials, SignupData interfaces in `types/auth.ts`
- [ ] T028 [P] [US3] Define Task, CreateTaskInput, UpdateTaskInput interfaces in `types/task.ts`
- [ ] T029 [P] Define APIResponse, APIError, PaginationMeta interfaces in `types/api.ts`
- [ ] T030 [P] Define FormErrors, FormState interfaces in `types/form.ts`
- [ ] T031 [P] Create type guards in `types/guards.ts` (isTask, isAPIError, isAuthResponse)

### API Client Infrastructure
- [ ] T032 Create centralized API client wrapper in `lib/api/client.ts` with fetch, error handling, auth header injection
- [ ] T033 Implement error response parser and HTTP status code handler in `lib/api/client.ts`
- [ ] T034 [P] Create auth API functions in `lib/api/auth.ts` (signup, login, logout)
- [ ] T035 [P] Create tasks API functions in `lib/api/tasks.ts` (getTasks, createTask, updateTask, deleteTask)
- [ ] T036 Add 401 response interceptor to clear token and redirect to login in `lib/api/client.ts`

### Authentication Utilities
- [ ] T037 [P] Implement JWT token storage functions in `lib/auth/token.ts` (getToken, setToken, clearToken, isTokenExpired)
- [ ] T038 [P] Create Next.js middleware in `middleware.ts` for route protection (redirect unauthenticated users from /tasks to /login)
- [ ] T039 [P] Implement auth redirect logic in `middleware.ts` (redirect authenticated users from /login to /tasks)
- [ ] T040 Configure middleware matcher in `middleware.ts` to run on all routes except API, static files

### Base UI Components (Reusable)
- [ ] T041 [P] Create Button component in `components/ui/button.tsx` with variants (primary, secondary, danger)
- [ ] T042 [P] Create Input component in `components/ui/input.tsx` with label, error state, accessibility attributes
- [ ] T043 [P] Create Spinner component in `components/ui/spinner.tsx` for loading states
- [ ] T044 [P] Create ErrorMessage component in `components/ui/error-message.tsx` with icon and dismissible option
- [ ] T045 [P] Create Card component in `components/ui/card.tsx` for content containers

### Root Layout & App Shell
- [ ] T046 Create root layout in `app/layout.tsx` with HTML structure, metadata, and global CSS import
- [ ] T047 Create root page in `app/page.tsx` with redirect logic (authenticated → /tasks, unauthenticated → /login)
- [ ] T048 [P] Create Header component in `components/layout/header.tsx` with app title and logout button (if authenticated)

### Testing Infrastructure
- [ ] T049 [P] Create test fixtures in `tests/fixtures/auth.ts` (mock user, mock auth response)
- [ ] T050 [P] Create test fixtures in `tests/fixtures/tasks.ts` (mock tasks array, createMockTask helper)
- [ ] T051 Write unit tests for token utils in `tests/unit/token.test.ts`
- [ ] T052 [P] Write unit tests for API client error handling in `tests/unit/api-client.test.ts`

---

## Phase 3: User Story 1 - New User Registration (P1)

**Goal**: Users can create a new account via signup page

**Independent Test**: Navigate to `/signup`, fill email/password, submit, verify account created and redirected to login or tasks page

**Why P1**: Entry point for new users - fundamental to multi-user architecture

### Signup Page Implementation
- [ ] T053 [US1] Create signup page in `app/(auth)/signup/page.tsx` with page metadata and client component import
- [ ] T054 [US1] Create SignupForm component in `components/auth/signup-form.tsx` with email, password, confirm password fields
- [ ] T055 [US1] Implement form validation in SignupForm (email format, password ≥8 chars, passwords match)
- [ ] T056 [US1] Implement form submission handler in SignupForm calling `lib/api/auth.ts signup()`
- [ ] T057 [US1] Handle success: store JWT token and redirect to `/tasks` in SignupForm
- [ ] T058 [US1] Handle errors: display user-friendly messages ("Email already exists", validation errors) in SignupForm
- [ ] T059 [US1] Add loading state during form submission (disable button, show spinner) in SignupForm
- [ ] T060 [US1] Add "Already have an account? Login" link to `/login` in SignupForm

### Testing for User Story 1
- [ ] T061 [US1] Write component test for SignupForm in `tests/components/signup-form.test.tsx` (renders form)
- [ ] T062 [US1] Test SignupForm validation errors (invalid email, weak password, passwords don't match)
- [ ] T063 [US1] Test SignupForm successful signup flow (mocked API, token stored, redirect triggered)
- [ ] T064 [US1] Test SignupForm handles API errors (400, 409, 500)

---

## Phase 4: User Story 2 - User Login and Authentication (P1)

**Goal**: Registered users can authenticate via login page

**Independent Test**: Navigate to `/login`, enter credentials, submit, verify authenticated and redirected to `/tasks`

**Why P1**: Critical for multi-user system - users can't access data without login

### Login Page Implementation
- [ ] T065 [US2] Create login page in `app/(auth)/login/page.tsx` with page metadata and client component import
- [ ] T066 [US2] Create LoginForm component in `components/auth/login-form.tsx` with email and password fields
- [ ] T067 [US2] Implement form validation in LoginForm (required fields, email format)
- [ ] T068 [US2] Implement form submission handler in LoginForm calling `lib/api/auth.ts login()`
- [ ] T069 [US2] Handle success: store JWT token and redirect to `/tasks` in LoginForm
- [ ] T070 [US2] Handle errors: display "Invalid email or password" on 401, generic errors on 500
- [ ] T071 [US2] Add loading state during form submission (disable button, show spinner) in LoginForm
- [ ] T072 [US2] Add "Don't have an account? Sign up" link to `/signup` in LoginForm

### Logout Functionality
- [ ] T073 [US2] Implement logout function in `lib/api/auth.ts` (clear token, optionally call backend logout endpoint)
- [ ] T074 [US2] Add logout button to Header component in `components/layout/header.tsx`
- [ ] T075 [US2] Handle logout click: clear token and redirect to `/login`

### Testing for User Story 2
- [ ] T076 [US2] Write component test for LoginForm in `tests/components/login-form.test.tsx` (renders form)
- [ ] T077 [US2] Test LoginForm validation errors (missing fields, invalid email)
- [ ] T078 [US2] Test LoginForm successful login flow (mocked API, token stored, redirect triggered)
- [ ] T079 [US2] Test LoginForm handles API errors (401 invalid credentials, 500 server error)
- [ ] T080 [US2] Test logout functionality (token cleared, redirected to login)

---

## Phase 5: User Story 3 - View Personal Task List (P2)

**Goal**: Authenticated users can view all their tasks in a clear list

**Independent Test**: Login with account that has existing tasks, verify tasks displayed with title and completion status

**Why P2**: Core value proposition after authentication - primary user action

### Tasks Page Implementation
- [ ] T081 [US3] Create tasks page in `app/(protected)/tasks/page.tsx` with page metadata and client component import
- [ ] T082 [US3] Create TaskList component in `components/tasks/task-list.tsx` to fetch and display tasks
- [ ] T083 [US3] Implement useEffect hook in TaskList to fetch tasks on mount via `lib/api/tasks.ts getTasks()`
- [ ] T084 [US3] Implement loading state in TaskList (show Spinner while fetching)
- [ ] T085 [US3] Implement error state in TaskList (show ErrorMessage if API fails)
- [ ] T086 [US3] Implement empty state in TaskList (show TaskEmptyState if tasks.length === 0)
- [ ] T087 [US3] Render task items using TaskItem component (pass task data as props)

### Task Display Components
- [ ] T088 [US3] Create TaskItem component in `components/tasks/task-item.tsx` displaying title and completion checkbox
- [ ] T089 [US3] Style completed tasks (strikethrough, opacity, or color change) in TaskItem
- [ ] T090 [US3] Create TaskEmptyState component in `components/tasks/task-empty-state.tsx` with message "No tasks yet. Create your first task!"

### Testing for User Story 3
- [ ] T091 [US3] Write component test for TaskList in `tests/components/task-list.test.tsx` (renders loading spinner initially)
- [ ] T092 [US3] Test TaskList displays tasks after fetch (mocked API with sample tasks)
- [ ] T093 [US3] Test TaskList displays empty state when no tasks
- [ ] T094 [US3] Test TaskList displays error message when API fails
- [ ] T095 [US3] Write component test for TaskItem in `tests/components/task-item.test.tsx` (renders task title and completion checkbox)

---

## Phase 6: User Story 4 - Create New Task (P2)

**Goal**: Authenticated users can add new tasks to their list

**Independent Test**: Login, use task creation interface, add task with title, verify task appears in list

**Why P2**: Core CRUD operation - enables users to build their todo lists

### Task Creation Implementation
- [ ] T096 [US4] Create TaskForm component in `components/tasks/task-form.tsx` with title input and submit button
- [ ] T097 [US4] Implement form validation in TaskForm (title required, non-empty)
- [ ] T098 [US4] Implement form submission handler in TaskForm calling `lib/api/tasks.ts createTask()`
- [ ] T099 [US4] Handle success: add new task to tasks array (optimistic update) and clear form
- [ ] T100 [US4] Handle errors: display validation errors or API errors
- [ ] T101 [US4] Add loading state during submission (disable button, show spinner on button)
- [ ] T102 [US4] Integrate TaskForm into TaskList component above task items
- [ ] T103 [US4] Update TaskEmptyState component to include inline TaskForm

### Testing for User Story 4
- [ ] T104 [US4] Write component test for TaskForm in `tests/components/task-form.test.tsx` (renders input and button)
- [ ] T105 [US4] Test TaskForm validation (rejects empty title)
- [ ] T106 [US4] Test TaskForm successful creation (mocked API, task added to list, form cleared)
- [ ] T107 [US4] Test TaskForm handles API errors (400, 500)
- [ ] T108 [US4] Integration test: TaskList + TaskForm (create task, verify appears in list)

---

## Phase 7: User Story 5 - Mark Task Complete/Incomplete (P2)

**Goal**: Users can toggle task completion status

**Independent Test**: Login with existing tasks, click completion toggle, verify status changes visually and persists

**Why P2**: Primary value of todo app - tracking what's done

### Completion Toggle Implementation
- [ ] T109 [US5] Add completion toggle (checkbox) to TaskItem component
- [ ] T110 [US5] Implement click handler in TaskItem calling `lib/api/tasks.ts updateTask()` with `{completed: !task.completed}`
- [ ] T111 [US5] Implement optimistic update: toggle completed state immediately in UI
- [ ] T112 [US5] Handle API success: keep optimistic update
- [ ] T113 [US5] Handle API failure: rollback to previous state and show error message
- [ ] T114 [US5] Add loading state on specific task while toggling (disable checkbox, show mini spinner)
- [ ] T115 [US5] Update TaskList to pass toggle handler to TaskItem components

### Testing for User Story 5
- [ ] T116 [US5] Write component test for TaskItem toggle in `tests/components/task-item.test.tsx` (clicking checkbox calls handler)
- [ ] T117 [US5] Test optimistic update (checkbox toggles immediately)
- [ ] T118 [US5] Test successful toggle (mocked API, state persists)
- [ ] T119 [US5] Test failed toggle rollback (mocked API error, state reverts, error shown)
- [ ] T120 [US5] Test loading state during toggle (checkbox disabled)

---

## Phase 8: User Story 6 - Edit Task Details (P3)

**Goal**: Users can modify task titles

**Independent Test**: Login, select task to edit, modify title, save, verify changes persist

**Why P3**: Quality-of-life feature - less critical than create/view/toggle

### Task Editing Implementation
- [ ] T121 [US6] Add edit mode state to TaskItem component (toggle between view/edit modes)
- [ ] T122 [US6] Add "Edit" button to TaskItem (shows when not in edit mode)
- [ ] T123 [US6] Show inline input field when in edit mode (pre-filled with current title)
- [ ] T124 [US6] Add "Save" and "Cancel" buttons for edit mode
- [ ] T125 [US6] Implement save handler calling `lib/api/tasks.ts updateTask()` with new title
- [ ] T126 [US6] Handle success: update task title in list, exit edit mode
- [ ] T127 [US6] Handle errors: show validation errors or API errors, stay in edit mode
- [ ] T128 [US6] Handle cancel: revert to original title, exit edit mode without saving
- [ ] T129 [US6] Add loading state during save (disable buttons, show spinner)

### Testing for User Story 6
- [ ] T130 [US6] Write component test for TaskItem edit mode in `tests/components/task-item.test.tsx` (renders edit button)
- [ ] T131 [US6] Test entering edit mode (click edit, input appears)
- [ ] T132 [US6] Test successful save (mocked API, title updates, exit edit mode)
- [ ] T133 [US6] Test cancel edit (original title restored, exit edit mode)
- [ ] T134 [US6] Test validation errors (empty title rejected)

---

## Phase 9: User Story 7 - Delete Task (P3)

**Goal**: Users can permanently remove tasks from their list

**Independent Test**: Login, delete a task, verify it no longer appears in list

**Why P3**: Cleanup functionality - less critical than core workflows

### Task Deletion Implementation
- [ ] T135 [US7] Add "Delete" button to TaskItem component
- [ ] T136 [US7] Implement confirmation modal/dialog component in `components/ui/confirmation-modal.tsx`
- [ ] T137 [US7] Show confirmation modal on delete button click ("Are you sure you want to delete this task?")
- [ ] T138 [US7] Implement delete handler calling `lib/api/tasks.ts deleteTask()` on confirmation
- [ ] T139 [US7] Handle success: remove task from list (optimistic update)
- [ ] T140 [US7] Handle errors: rollback (re-add task) and show error message
- [ ] T141 [US7] Handle cancel: close modal without deleting
- [ ] T142 [US7] Add loading state during deletion (disable buttons, show spinner)

### Testing for User Story 7
- [ ] T143 [US7] Write component test for TaskItem delete in `tests/components/task-item.test.tsx` (renders delete button)
- [ ] T144 [US7] Test delete confirmation modal (appears on delete click)
- [ ] T145 [US7] Test successful deletion (mocked API, task removed from list)
- [ ] T146 [US7] Test cancel deletion (task remains in list)
- [ ] T147 [US7] Test deletion error handling (rollback, error shown)

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final touches for production readiness

**Deliverable**: Production-ready frontend with responsive design, accessibility, error handling, and performance optimizations

### Responsive Design
- [ ] T148 [P] Verify mobile layout (320px-768px) for all pages and components
- [ ] T149 [P] Verify tablet layout (768px-1024px) for all pages and components
- [ ] T150 [P] Verify desktop layout (1024px-2560px) for all pages and components
- [ ] T151 [P] Ensure touch targets are at least 44x44px on mobile

### Accessibility (WCAG 2.1 Level AA)
- [ ] T152 [P] Add ARIA labels to all form inputs and buttons
- [ ] T153 [P] Verify keyboard navigation (Tab, Enter, Escape) works for all interactive elements
- [ ] T154 [P] Add focus indicators to all focusable elements
- [ ] T155 [P] Verify screen reader compatibility (test with aXe DevTools or Lighthouse)
- [ ] T156 [P] Ensure color contrast ratio ≥4.5:1 for all text
- [ ] T157 [P] Add `aria-live` regions for dynamic content (error messages, success notifications)

### Error Handling & UX Polish
- [ ] T158 [P] Standardize all error messages to be user-friendly (no technical jargon)
- [ ] T159 [P] Add error boundaries to catch React render errors
- [ ] T160 [P] Implement global error handler for unhandled promise rejections
- [ ] T161 [P] Add loading skeleton (optional) as alternative to spinner for better UX
- [ ] T162 [P] Add form field auto-focus (email field on login/signup, title field on task create)

### Performance Optimizations
- [ ] T163 [P] Run Lighthouse audit and achieve performance score >90
- [ ] T164 [P] Verify Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] T165 [P] Optimize images (use next/image component if using images)
- [ ] T166 [P] Verify bundle size is reasonable (<500KB initial JS load)
- [ ] T167 [P] Add React.memo to TaskItem if rendering performance is slow with many tasks

### Code Quality & Standards
- [ ] T168 [P] Run `npm run lint` and fix all ESLint errors/warnings
- [ ] T169 [P] Run `npm run format` to ensure Prettier formatting
- [ ] T170 [P] Run `npm run type-check` and fix all TypeScript errors
- [ ] T171 [P] Verify all components have TypeScript interfaces for props
- [ ] T172 [P] Remove all console.log statements (use console.error only for errors)

### Testing Coverage
- [ ] T173 [P] Run test coverage report and verify critical paths are tested
- [ ] T174 [P] Add missing component tests for any untested components
- [ ] T175 [P] Verify all user stories have passing integration tests

### Documentation & Deployment Prep
- [ ] T176 [P] Create README.md in `frontend/` with setup instructions, scripts, and project structure
- [ ] T177 [P] Document all environment variables in `.env.example`
- [ ] T178 [P] Verify production build succeeds: `npm run build`
- [ ] T179 [P] Test production build locally: `npm run start`
- [ ] T180 [P] Create deployment checklist (environment variables, API URL, CORS configuration)

---

## Dependencies & Execution Order

### User Story Dependencies

```
Prerequisites (Phases 1-2): MUST complete before any user stories
    ↓
US1 (Signup) ──┐
               ├──→ US3 (View Tasks) ──→ US4 (Create Task) ──→ US5 (Toggle) ──→ US6 (Edit) ──→ US7 (Delete)
US2 (Login) ───┘                              ↓                     ↓              ↓             ↓
                                         (Can test independently once US3 complete)
```

**Key Dependencies**:
1. **Phase 1-2 (Setup & Foundational)**: BLOCKING - must complete before any user story work
2. **US1 + US2**: Independent of each other, both are P1 (can implement in parallel)
3. **US3**: Depends on either US1 or US2 being complete (need authentication to test)
4. **US4, US5**: Depend on US3 (need to view tasks to interact with them)
5. **US6, US7**: Depend on US4 or having pre-existing tasks (need tasks to edit/delete)

### Parallel Execution Opportunities

**Within Each Phase**, these tasks can run in parallel (marked with [P]):

**Phase 1 (Setup)**: T003-T006, T010-T012, T016-T019, T020-T023, T024-T025
**Phase 2 (Foundational)**: T027-T031, T034-T035, T037-T040, T041-T045, T049-T052
**Phase 3 (US1)**: T061-T064 (tests can run in parallel)
**Phase 4 (US2)**: T076-T080 (tests can run in parallel)
**Phase 5 (US3)**: T091-T095 (tests can run in parallel)
**Phase 6 (US4)**: T104-T108 (tests can run in parallel)
**Phase 7 (US5)**: T116-T120 (tests can run in parallel)
**Phase 8 (US6)**: T130-T134 (tests can run in parallel)
**Phase 9 (US7)**: T143-T147 (tests can run in parallel)
**Phase 10 (Polish)**: T148-T180 (most tasks independent)

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**MVP = User Story 1 + User Story 2 + User Story 3**

This delivers:
- ✅ User registration (US1)
- ✅ User login (US2)
- ✅ View task list (US3)
- ❌ Create tasks (will need backend to pre-seed tasks for testing)
- ❌ Task management (toggle, edit, delete)

**Rationale**: Demonstrates authentication flow and task viewing - proves frontend-backend integration.

### Recommended Delivery Increments

1. **Increment 1 (MVP)**: Phases 1-2, US1, US2, US3 → Deliverable: Users can signup, login, view tasks
2. **Increment 2**: US4, US5 → Add: Task creation and completion toggling → Deliverable: Functional todo app
3. **Increment 3**: US6, US7 → Add: Task editing and deletion → Deliverable: Full CRUD capabilities
4. **Increment 4**: Phase 10 → Add: Polish, accessibility, performance → Deliverable: Production-ready app

### Independent Testing Per Story

Each user story has defined **Independent Test** criteria (see spec.md):

- **US1**: Navigate to /signup, create account, verify redirect
- **US2**: Navigate to /login, authenticate, verify redirect to /tasks
- **US3**: Login with existing tasks, verify tasks displayed
- **US4**: Login, create task, verify appears in list
- **US5**: Login, toggle task, verify status changes
- **US6**: Login, edit task, verify changes persist
- **US7**: Login, delete task, verify removed from list

---

## Task Summary

**Total Tasks**: 180

**Tasks by Phase**:
- Phase 1 (Setup): 26 tasks (T001-T026)
- Phase 2 (Foundational): 26 tasks (T027-T052)
- Phase 3 (US1 - Signup): 12 tasks (T053-T064)
- Phase 4 (US2 - Login): 16 tasks (T065-T080)
- Phase 5 (US3 - View Tasks): 15 tasks (T081-T095)
- Phase 6 (US4 - Create Tasks): 13 tasks (T096-T108)
- Phase 7 (US5 - Toggle Complete): 12 tasks (T109-T120)
- Phase 8 (US6 - Edit Tasks): 14 tasks (T121-T134)
- Phase 9 (US7 - Delete Tasks): 13 tasks (T135-T147)
- Phase 10 (Polish): 33 tasks (T148-T180)

**Parallel Opportunities**: ~80 tasks marked with [P] can run in parallel within their phase

**Test Tasks**: 40 tasks dedicated to testing (component tests, integration tests)

**Independent Test Criteria**: All 7 user stories have defined test scenarios

**MVP Task Count**: ~79 tasks (Phases 1-2 + US1 + US2 + US3)

---

## Validation Checklist

**Format Compliance**:
- ✅ All tasks start with `- [ ]` checkbox
- ✅ All tasks have sequential ID (T001-T180)
- ✅ User story tasks labeled with [US1]-[US7]
- ✅ Parallelizable tasks marked with [P]
- ✅ All tasks include file paths in descriptions

**Organization**:
- ✅ Tasks organized by user story for independent implementation
- ✅ Setup and Foundational phases clearly separated
- ✅ Each user story phase includes implementation + tests
- ✅ Dependencies documented

**Completeness**:
- ✅ All 7 user stories from spec.md covered
- ✅ All components from plan.md structure included
- ✅ API client, auth utils, types all implemented
- ✅ Testing setup and tests included
- ✅ Polish and accessibility tasks included

**Ready for Implementation**: ✅ Yes - tasks are specific, actionable, and immediately executable
