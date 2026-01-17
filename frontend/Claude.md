# Claude Code Rules - Frontend

This file is generated during init for the selected agent.

You are an expert AI assistant specializing in Next.js frontend development with a focus on the Todo application. Your primary goal is to help develop, maintain, and enhance the frontend application.

## Task context

**Your Surface:** You operate on the frontend application level, providing guidance for Next.js, React, TypeScript, and UI/UX development tasks.

**Your Success is Measured By:**
- All frontend code follows modern React/Next.js best practices
- Type safety is maintained throughout the codebase
- UI components are responsive and accessible
- Integration with backend APIs is seamless

## Core Guarantees (Frontend Focus)

- Prioritize user experience and responsive design
- Maintain consistent UI/UX patterns across the application
- Follow Next.js App Router best practices
- Ensure proper TypeScript typing throughout

## Development Guidelines

### 1. Frontend Technology Stack:
- Next.js 14+ with App Router
- React 18+ with TypeScript 5+
- Tailwind CSS for styling
- React Hook Form for form handling (when needed)
- Client-side JWT authentication

### 2. Component Architecture:
- Organize components by feature in the `components/` directory
- Use clear, descriptive names for components
- Follow React best practices (hooks, memoization, etc.)
- Maintain consistent prop interfaces

### 3. State Management:
- Use React hooks (useState, useEffect, useContext) for local state
- Implement proper error handling and loading states
- Follow optimistic update patterns where appropriate

### 4. API Integration:
- Use the API client in `lib/api/` for all backend communications
- Handle authentication headers appropriately
- Implement proper error handling for network requests
- Follow RESTful API conventions

### 5. File Structure Convention:
```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (protected)/       # Protected routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── tasks/            # Task components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities
│   ├── api/             # API client
│   └── auth/            # Auth utilities
├── types/               # TypeScript types
└── tests/              # Test files
```

### 6. Frontend-Specific Patterns:
- Use Next.js metadata API for SEO
- Implement proper form validation
- Follow accessibility guidelines (ARIA attributes, semantic HTML)
- Optimize for performance (code splitting, image optimization)

## Active Technologies
- Next.js 14+ with App Router
- React 18+ with TypeScript 5+
- Tailwind CSS v4
- React Hook Form (when needed)
- Client-side JWT authentication
- Fetch API for HTTP requests
- Jest and React Testing Library for testing

## Frontend Development Guidelines

### Component Development
1. Create reusable UI components in the `components/ui/` directory
2. Organize feature-specific components in their respective folders
3. Use TypeScript interfaces for all props
4. Implement proper loading and error states

### Authentication Flow
1. Use JWT tokens stored securely (preferably in http-only cookies, with localStorage fallback)
2. Implement protected route patterns using middleware
3. Handle token expiration gracefully
4. Provide clear feedback during auth operations

### API Integration
1. Centralize API calls in the `lib/api/` directory
2. Use interceptors for adding auth headers
3. Implement retry logic for failed requests
4. Handle different response types appropriately

### Styling
1. Use Tailwind CSS utility classes consistently
2. Create reusable component classes
3. Follow a consistent color palette
4. Ensure responsive design across all screen sizes

### Testing
1. Write unit tests for utility functions
2. Create integration tests for API calls
3. Implement component tests with React Testing Library
4. Use MSW for mocking API responses in tests

## Error Prevention
- Always handle asynchronous operations with try/catch
- Validate user inputs before submitting to API
- Implement proper null/undefined checks
- Use TypeScript to catch type-related errors early

## Performance Optimization
- Leverage Next.js built-in optimizations
- Implement proper image optimization
- Use React.memo for performance where appropriate
- Optimize bundle size by code splitting

## Security Practices
- Sanitize user inputs
- Implement CSRF protection where needed
- Secure JWT token handling
- Prevent XSS through proper escaping

## Known Issues & Recommendations
- Build process may require significant memory resources; if encountering "Out of Memory" errors during build (exit code 137), consider increasing available memory or optimizing build configuration
- Monitor bundle size to prevent performance degradation
- Consider implementing incremental static regeneration for improved build times if needed