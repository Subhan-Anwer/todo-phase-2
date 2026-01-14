# Research: Next.js Frontend Architecture

**Feature**: 001-nextjs-frontend
**Date**: 2026-01-14
**Phase**: 0 (Research & Technical Decisions)

## Research Summary

This document captures research findings and technical decisions for the Next.js frontend implementation. All unknowns from the Technical Context have been resolved.

## Technical Decisions

### 1. Next.js App Router vs Pages Router

**Decision**: Use **Next.js App Router**

**Rationale**:
- Modern React patterns (Server Components, Suspense, Streaming)
- Better file-based routing with route groups
- Improved performance with automatic code splitting
- Better TypeScript support
- Future-proof (Next.js direction)

**Alternatives Considered**:
- **Pages Router**: Older, stable, but less modern features
- Rejected because: App Router is the recommended approach for new projects

**References**:
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [App Router vs Pages Router Comparison](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

---

### 2. JWT Storage: HTTP-only Cookies vs localStorage

**Decision**: **Prefer HTTP-only Cookies** (with localStorage as documented fallback)

**Rationale**:
- **HTTP-only cookies** prevent XSS attacks (JavaScript cannot access token)
- Automatically included in requests by browser
- More secure for JWT storage
- Backend sets cookie on login/signup

**Fallback to localStorage**:
- Simpler to implement initially
- Requires manual Authorization header management
- Higher XSS risk but acceptable with proper CSP headers

**Alternatives Considered**:
- **sessionStorage**: Doesn't persist across tabs, less convenient
- Rejected because: Poor UX (logout on tab close)

**Implementation Approach**:
- Backend sets `HttpOnly`, `Secure`, `SameSite=Strict` cookie
- Frontend doesn't directly access token
- Logout clears cookie via backend API call

**References**:
- [OWASP JWT Storage Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [Auth0: Where to Store Tokens](https://auth0.com/docs/secure/security-guidance/data-security/token-storage)

---

### 3. State Management Library

**Decision**: **React useState/useReducer** (no global state library for MVP)

**Rationale**:
- MVP scope limited to single-page task list
- No complex state sharing across multiple pages
- React built-in hooks sufficient
- Avoids unnecessary complexity and bundle size

**Future Enhancement**:
- Consider **React Query** or **SWR** for server state management
- Benefits: Caching, background refetching, optimistic updates
- Trigger: When implementing pagination, filtering, or multi-page features

**Alternatives Considered**:
- **Redux**: Overkill for current scope, boilerplate overhead
- **Zustand**: Lightweight, but unnecessary for MVP
- **Context API**: Useful for auth state only

**References**:
- [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
- [React Query Documentation](https://tanstack.com/query/latest)

---

### 4. CSS/Styling Framework

**Decision**: **Tailwind CSS**

**Rationale**:
- Utility-first approach: Fast development
- No CSS naming conflicts (scoped by design)
- Small production bundle (unused styles purged)
- Excellent responsive design utilities
- Aligns with frontend-design skill (distinctive aesthetics)

**Alternatives Considered**:
- **CSS Modules**: More verbose, manual scoping
- **Styled Components**: Runtime CSS-in-JS, performance overhead
- **Plain CSS**: No utility framework, slower development

**References**:
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind with Next.js Setup](https://tailwindcss.com/docs/guides/nextjs)

---

### 5. Form Handling Library

**Decision**: **React Hook Form** (optional, can use plain React state for MVP)

**Rationale**:
- Lightweight, performant (uncontrolled components)
- Built-in validation support
- Easy integration with custom validation schemas (Zod, Yup)
- Reduces boilerplate for forms

**Alternative**:
- **Plain React state**: Simplest for MVP (email/password forms only)
- **Formik**: Heavier, more features than needed

**MVP Approach**:
- Start with plain React state for login/signup forms
- Upgrade to React Hook Form if forms become complex

**References**:
- [React Hook Form Documentation](https://react-hook-form.com/)
- [React Hook Form vs Formik](https://blog.logrocket.com/react-hook-form-vs-formik/)

---

### 6. HTTP Client Library

**Decision**: **Native Fetch API** with custom wrapper

**Rationale**:
- Built-in to browsers and Node.js (modern versions)
- No additional dependency
- Sufficient for simple REST API calls
- Custom wrapper adds:
  - Base URL configuration
  - Authorization header injection
  - Error handling

**Alternative**:
- **axios**: More features (interceptors, automatic JSON parsing)
- Rejected for MVP: Adds 13KB to bundle, not necessary for basic needs

**Implementation**:
```typescript
// lib/api/client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient(endpoint: string, options?: RequestInit) {
  const token = getToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new APIError(response);
  }

  return response.json();
}
```

**References**:
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)

---

### 7. Testing Strategy

**Decision**: **Jest + React Testing Library** for unit/component tests, **Playwright** for E2E (optional)

**Rationale**:
- **Jest**: Industry standard for JavaScript testing
- **React Testing Library**: User-centric testing (queries by role, label, text)
- **Playwright**: Modern E2E framework, multi-browser support

**Test Coverage Goals**:
- Unit tests: Utility functions, API client, auth helpers
- Component tests: All UI components, forms, task list
- Integration tests: Full user flows with mocked API (MSW)
- E2E tests (optional): Critical paths (signup, login, task CRUD)

**Mocking Strategy**:
- **MSW (Mock Service Worker)**: Mock API responses for integration tests
- **jest.fn()**: Mock functions and callbacks
- **localStorage mock**: Test token storage without browser APIs

**References**:
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Playwright Documentation](https://playwright.dev/)

---

### 8. Protected Route Implementation

**Decision**: **Next.js Middleware** for route protection

**Rationale**:
- Runs before page renders (server-side)
- Centralized auth logic (DRY principle)
- Redirects happen before page load (better UX)
- Middleware runs on Edge Runtime (fast)

**Implementation Approach**:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // or check localStorage via client-side redirect
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/tasks');
  const isAuthRoute = ['/login', '/signup'].includes(request.nextUrl.pathname);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Alternative**:
- **Layout-level protection**: Check auth in `(protected)/layout.tsx`
- Rejected: Client-side redirect causes flash of content

**References**:
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Authentication Patterns in Next.js](https://nextjs.org/docs/app/building-your-application/authentication)

---

### 9. Error Tracking Service

**Decision**: **Sentry** (production), **Console logging** (development)

**Rationale**:
- **Sentry**: Industry standard, great React/Next.js integration
- Captures unhandled errors, promise rejections, React errors
- Session replay and context tracking
- Free tier sufficient for MVP

**Alternatives Considered**:
- **LogRocket**: More expensive, focuses on session replay
- **Bugsnag**: Good, but less popular than Sentry
- **Native console logging**: Insufficient for production debugging

**Setup**:
```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filter sensitive data
    return event;
  },
});
```

**References**:
- [Sentry Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

### 10. Accessibility Standards

**Decision**: Target **WCAG 2.1 Level AA** compliance

**Rationale**:
- Level AA is widely recognized standard
- Required for many organizations and regulations
- Achievable without excessive effort
- Tools available for testing (aXe, Lighthouse)

**Implementation Guidelines**:
- Semantic HTML (`<button>`, `<form>`, `<label>`)
- ARIA labels for non-obvious elements
- Keyboard navigation support (Tab, Enter, Escape)
- Color contrast ratio 4.5:1 minimum
- Focus indicators on all interactive elements

**Testing Tools**:
- **aXe DevTools**: Browser extension for accessibility auditing
- **Lighthouse**: Built into Chrome DevTools
- **WAVE**: Web accessibility evaluation tool

**References**:
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Next.js Accessibility](https://nextjs.org/docs/architecture/accessibility)

---

## Technology Stack Summary

| Category | Technology | Justification |
|----------|------------|---------------|
| Framework | Next.js 14+ (App Router) | Modern React patterns, SSR/SSG, optimal performance |
| Language | TypeScript 5.x | Type safety, better DX, catch errors at compile time |
| Styling | Tailwind CSS | Utility-first, fast development, small bundle |
| State Management | React useState/useReducer | Sufficient for MVP, no global state needed |
| HTTP Client | Fetch API (custom wrapper) | Native, lightweight, no extra dependency |
| Forms | React Hook Form (optional) | Lightweight, performant (start with plain React state) |
| Testing | Jest + React Testing Library | Industry standard, user-centric testing |
| E2E Testing | Playwright (optional) | Modern, multi-browser support |
| API Mocking | MSW (Mock Service Worker) | Realistic API mocking for integration tests |
| Error Tracking | Sentry | Industry standard, great Next.js integration |
| Auth Storage | HTTP-only Cookies (preferred) | Most secure, XSS protection |
| Linting | ESLint + Prettier | Code quality and consistency |
| Type Checking | TypeScript (strict mode) | Catch errors early, enforce types |

---

## Best Practices Research

### Next.js App Router Patterns

**Server Components vs Client Components**:
- **Use Server Components** for: Data fetching, static content, SEO
- **Use Client Components** for: Interactivity, hooks, browser APIs
- Mark client components with `'use client'` directive

**Route Groups**:
- `(auth)/`: Public routes (login, signup)
- `(protected)/`: Authenticated routes with middleware protection

**Loading and Error States**:
- `loading.tsx`: Automatic loading UI during navigation
- `error.tsx`: Error boundaries for graceful error handling

**References**:
- [Next.js App Router Best Practices](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

---

### React Patterns

**Component Composition**:
- Small, focused components (Single Responsibility Principle)
- Composition over inheritance
- Use children props for flexible layouts

**Hooks Best Practices**:
- Extract reusable logic into custom hooks (`useAuth`, `useTasks`)
- Use `useCallback` to memoize functions passed as props
- Use `useMemo` for expensive computations

**Performance Optimization**:
- `React.memo()` for expensive components
- Lazy load heavy components: `const HeavyComponent = lazy(() => import('./Heavy'))`
- Avoid inline object/array literals in JSX (causes re-renders)

**References**:
- [React Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

## Resolved Unknowns

All technical context unknowns from plan.md have been resolved:

1. ✅ **Language/Version**: TypeScript 5.x, Next.js 14+
2. ✅ **Primary Dependencies**: Next.js, React, Tailwind CSS, TypeScript
3. ✅ **Testing**: Jest + React Testing Library + Playwright (optional)
4. ✅ **Storage Strategy**: JWT in HTTP-only cookies (preferred)
5. ✅ **State Management**: React built-in hooks (no global state library)
6. ✅ **HTTP Client**: Native Fetch API with custom wrapper
7. ✅ **Form Handling**: React Hook Form (optional) or plain React state
8. ✅ **Protected Routes**: Next.js middleware
9. ✅ **Error Tracking**: Sentry (production)
10. ✅ **Styling**: Tailwind CSS

---

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| XSS attacks steal JWT | Use HTTP-only cookies, implement CSP headers |
| Large bundle size | Code splitting, tree shaking, lazy loading |
| Slow API responses | Loading states, optimistic updates, timeouts |
| Accessibility violations | Use aXe, Lighthouse audits, semantic HTML, ARIA |
| Test maintenance burden | Focus on integration tests over unit tests, use MSW |
| Browser compatibility | Target modern browsers, use Next.js polyfills |

---

## Next Steps

1. ✅ Research complete (this document)
2. ⏭️ **Phase 1**: Generate `data-model.md`, `contracts/`, `quickstart.md`
3. ⏭️ **Phase 2**: Generate `tasks.md` (via `/sp.tasks` command)
