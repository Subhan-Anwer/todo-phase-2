---
id: "0004"
title: "Mock Auth Frontend Planning"
stage: "plan"
date: "2026-01-15"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "001-nextjs-frontend"
branch: "001-nextjs-frontend"
user: "developer"
command: "/sp.plan"
labels: ["planning", "mock-auth", "frontend", "architecture"]
links:
  spec: "specs/001-nextjs-frontend/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-nextjs-frontend/research.md
  - specs/001-nextjs-frontend/plan.md
  - CLAUDE.md
tests:
  - N/A (planning phase)
---

## Prompt

During Phase 2 frontend development:

- Better Auth is NOT implemented in the frontend directly
- Authentication flows are simulated via mock auth services
- UI must behave as if Better Auth exists
- The auth integration must be swappable without UI changes

Better Auth is fully integrated in Phase 2 backend implementation. @specs/001-nextjs-frontend/

## Response snapshot

Executed /sp.plan workflow for feature 001-nextjs-frontend with critical constraint: Mock Auth Strategy for Phase 2 Frontend.

Key Decisions:
1. Updated research.md with Mock Auth Service Pattern (Section 11):
   - Service layer pattern with AuthService interface
   - MockAuthService for Phase 2 Frontend (localStorage-based mock users, base64-encoded JWT tokens)
   - BetterAuthService for Phase 2 Backend (real Better Auth integration)
   - Swappable via NEXT_PUBLIC_USE_MOCK_AUTH environment variable

2. Completed plan.md with comprehensive implementation plan:
   - Technical Context: TypeScript 5.x, Next.js 14+ App Router, Tailwind CSS, React Hook Form
   - Constitution Check: All principles verified (including mock auth compliance)
   - Project Structure: Detailed frontend directory layout with lib/auth/ service layer
   - Security Considerations: Mock auth risks identified (base64 tokens not cryptographically secure - acceptable for Phase 2 Frontend)
   - Testing Strategy: Jest + React Testing Library + MSW for API mocking
   - Error Handling: Standardized error response format and user-friendly messages
   - API Design: RESTful endpoints documented (auth, tasks)
   - Performance Guidelines: Target <2s page load, <1s task operations
   - Phase 0 (Research): ✅ Complete with 11 technical decisions resolved
   - Phase 1 (Design): ✅ Complete (data-model.md, contracts/api-contract.md, quickstart.md)
   - Phase 2 (Tasks): ⏭️ Pending (use /sp.tasks command)

3. Updated CLAUDE.md agent context with new technologies:
   - TypeScript 5.x with Next.js 14+ (App Router)
   - Next.js, React 18+, Tailwind CSS, React Hook Form (optional)
   - Client-side JWT storage strategy (http-only cookies preferred, localStorage fallback)

Implementation Approach:
- MockAuthService stores mock users in localStorage (Phase 2 Frontend)
- Mock JWT tokens are base64-encoded (NOT cryptographically secure)
- UI components import authService from lib/auth/ (no direct Better Auth dependency)
- Set NEXT_PUBLIC_USE_MOCK_AUTH=false to swap to BetterAuthService (Phase 2 Backend)
- No UI changes required during swap (service interface enforces contract)

Definition of Done:
- All tasks in tasks.md implemented and passing tests
- Mock auth service allows full user flows (signup, login, task CRUD, logout)
- Test coverage ≥80% for critical paths
- TypeScript strict mode compilation passes
- Accessibility audit passes (WCAG 2.1 Level AA)
- Mock auth service swappable to real Better Auth via environment variable

## Outcome

- ✅ Impact: Planning phase complete for 001-nextjs-frontend with mock auth architecture documented. Critical constraint satisfied: Better Auth NOT implemented in frontend, auth flows simulated via swappable mock services.
- 🧪 Tests: N/A (planning phase - testing strategy defined in plan.md)
- 📁 Files: Updated research.md (Mock Auth Strategy section 11), completed plan.md (full implementation plan), updated CLAUDE.md (agent context with new technologies)
- 🔁 Next prompts: Run /sp.tasks to generate testable implementation tasks, then implement in red-green-refactor cycle
- 🧠 Reflection: Service layer pattern with AuthService interface successfully isolates UI from auth implementation details, enabling clean swap from mock to real Better Auth without UI changes. Environment variable toggle (NEXT_PUBLIC_USE_MOCK_AUTH) provides clear boundary between Phase 2 Frontend and Phase 2 Backend development.

## Evaluation notes (flywheel)

- Failure modes observed: None - all planning requirements satisfied
- Graders run and results (PASS/FAIL): PASS - Technical Context fully resolved, Constitution Check verified, Mock Auth Strategy documented with service layer pattern
- Prompt variant (if applicable): Standard /sp.plan workflow with additional mock auth constraint
- Next experiment (smallest change to try): Validate that MockAuthService implementation in tasks.md preserves the swappability guarantee (no UI dependencies on mock-specific logic)
