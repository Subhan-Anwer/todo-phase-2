# Quickstart Guide: Next.js Frontend

**Feature**: 001-nextjs-frontend
**Date**: 2026-01-14
**For**: Frontend Engineers implementing this feature

## Prerequisites

- **Node.js**: 18.x or higher
- **npm** or **yarn** or **pnpm**: Latest version
- **Backend API**: Running and accessible (see backend documentation)
- **Git**: For version control

---

## Quick Setup (5 minutes)

### 1. Clone Repository & Navigate to Frontend

```bash
# If starting fresh
cd todo-phase-2

# Navigate to frontend directory (will be created)
mkdir -p frontend
cd frontend
```

---

### 2. Initialize Next.js Project

**Option A: Using `create-next-app` (Recommended)**

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

Answer prompts:
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ App Router: Yes
- ❌ src/ directory: No (use root-level structure)
- ✅ Import alias (@/*): Yes

**Option B: Manual Setup (if customization needed)**

```bash
npm init -y
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/react @types/node
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint eslint-config-next
npx tailwindcss init -p
```

---

### 3. Configure Environment Variables

Create `.env.local` file:

```bash
cat > .env.local << 'EOF'
# Backend API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Error tracking (production)
# NEXT_PUBLIC_SENTRY_DSN=

# Optional: Analytics (production)
# NEXT_PUBLIC_GA_ID=
EOF
```

Create `.env.example` (for documentation):

```bash
cat > .env.example << 'EOF'
# Backend API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Error tracking (optional - production only)
# NEXT_PUBLIC_SENTRY_DSN=

# Analytics (optional - production only)
# NEXT_PUBLIC_GA_ID=
EOF
```

---

### 4. Install Dependencies

```bash
# Core dependencies already installed via create-next-app

# Install additional dependencies
npm install

# Development dependencies (if not already installed)
npm install -D prettier husky lint-staged

# Optional: Form handling
npm install react-hook-form

# Optional: API mocking for tests
npm install -D msw

# Optional: Testing libraries
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test  # E2E testing (optional)
```

---

### 5. Set Up Project Structure

Create the directory structure as defined in plan.md:

```bash
# Create app router structure
mkdir -p app/\(auth\)/login
mkdir -p app/\(auth\)/signup
mkdir -p app/\(protected\)/tasks

# Create component directories
mkdir -p components/ui
mkdir -p components/auth
mkdir -p components/tasks
mkdir -p components/layout

# Create lib directories
mkdir -p lib/api
mkdir -p lib/auth
mkdir -p lib/utils

# Create types directory
mkdir -p types

# Create tests directory
mkdir -p tests/unit
mkdir -p tests/components
mkdir -p tests/e2e

# Create fixtures directory
mkdir -p tests/fixtures
```

---

### 6. Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

You should see the Next.js default page.

---

## Development Workflow

### Daily Development

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Run tests (after setting up)
npm test

# Run tests in watch mode
npm test -- --watch

# Check types
npx tsc --noEmit
```

---

### Key Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Configuration Files

### TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### Tailwind Config (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Add custom colors, fonts, etc. per frontend-design skill
    },
  },
  plugins: [],
}
```

---

### Next.js Config (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
```

---

### ESLint Config (`.eslintrc.json`)

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

---

### Prettier Config (`.prettierrc.json`)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## Testing Setup

### Jest Config (`jest.config.js`)

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Jest Setup (`jest.setup.js`)

```javascript
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock
```

---

### MSW Setup (API Mocking)

Create `tests/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const handlers = [
  // Mock login
  http.post(`${API_URL}/api/v1/auth/login`, () => {
    return HttpResponse.json({
      data: {
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-jwt-token',
      },
    })
  }),

  // Mock tasks fetch
  http.get(`${API_URL}/api/v1/todos`, () => {
    return HttpResponse.json({
      data: [
        { id: '1', title: 'Test task', completed: false },
      ],
    })
  }),

  // Add more handlers as needed...
]
```

Create `tests/mocks/server.ts`:

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

Update `jest.setup.js`:

```javascript
import { server } from './tests/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## Git Hooks (Husky + lint-staged)

### Setup Husky

```bash
npx husky-init && npm install
npx husky set .husky/pre-commit "npx lint-staged"
```

### Configure lint-staged

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "npm run type-check"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

## Verify Setup

### Checklist

- [ ] `npm run dev` starts development server on http://localhost:3000
- [ ] `.env.local` exists with `NEXT_PUBLIC_API_URL`
- [ ] TypeScript compiles without errors: `npm run type-check`
- [ ] Linter passes: `npm run lint`
- [ ] Prettier formats code: `npm run format`
- [ ] Tests run (even if none exist yet): `npm test`
- [ ] Directory structure matches plan.md

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |
| `npm run type-check` | Check TypeScript types |
| `npx playwright test` | Run E2E tests (if Playwright installed) |

---

## Troubleshooting

### Port 3000 already in use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Module not found errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

```bash
# Regenerate types
npm run dev  # Start dev server, types are generated automatically

# Check specific file
npx tsc --noEmit app/page.tsx
```

### Backend API not accessible

- Verify backend is running: `curl http://localhost:8000/health`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is configured on backend to allow `http://localhost:3000`

---

## Next Steps

1. ✅ Setup complete
2. ⏭️ Implement pages (login, signup, tasks) - see `specs/001-nextjs-frontend/tasks.md` (to be generated)
3. ⏭️ Implement components (forms, task list, UI elements)
4. ⏭️ Implement API client and auth utilities
5. ⏭️ Write tests
6. ⏭️ Build and deploy

---

## Resources

- **Spec**: `specs/001-nextjs-frontend/spec.md`
- **Plan**: `specs/001-nextjs-frontend/plan.md`
- **Data Model**: `specs/001-nextjs-frontend/data-model.md`
- **API Contract**: `specs/001-nextjs-frontend/contracts/api-contract.md`
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro/

---

## Support

- **Questions**: Refer to `spec.md` for requirements
- **Technical Issues**: Check `plan.md` for architecture decisions
- **API Questions**: See `contracts/api-contract.md`

**Happy coding!** 🚀
