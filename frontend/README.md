# Todo App - Frontend

A Next.js 14+ frontend application for task management with authentication.

## Prerequisites

- Node.js 18+ and npm
- **Backend API running on `http://localhost:8000`** ⚠️ REQUIRED

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env.local` file is already configured with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start the Backend API (REQUIRED)

**⚠️ IMPORTANT**: The frontend requires the backend API to be running.

Before starting the frontend, ensure the backend is running on port 8000:

```bash
# In the backend directory (adjust path as needed)
cd ../backend
# Start your backend server
# Example: npm start, python main.py, go run main.go, etc.
```

Verify the backend is running:
```bash
curl http://localhost:8000/api/v1/health
```

### 4. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests with Jest

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── (protected)/       # Protected routes
│   │   └── tasks/         # Tasks page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
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

## Features

### Authentication
- ✅ User signup with validation
- ✅ User login
- ✅ JWT token management
- ✅ Protected routes
- ✅ Logout

### Task Management
- ✅ View all tasks
- ✅ Create tasks
- ✅ Toggle task completion
- ✅ Edit tasks
- ✅ Delete tasks (with confirmation)
- ✅ Empty state

### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation
- ✅ Optimistic updates

## Troubleshooting

### "Failed to fetch" or "Unable to connect" Error

This error occurs when the backend API is not running.

**Solution:**
1. Ensure the backend server is running on `http://localhost:8000`
2. Check the backend logs for any errors
3. Verify the backend API endpoints are accessible:
   ```bash
   curl http://localhost:8000/api/v1/health
   ```

### Port 3000 Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

### TypeScript Errors

```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run type-check
```

## API Endpoints Expected

The frontend expects the following backend endpoints:

### Authentication
- `POST /api/v1/auth/signup` - Create account
- `POST /api/v1/auth/login` - Authenticate user
- `POST /api/v1/auth/logout` - Logout (optional)

### Tasks
- `GET /api/v1/todos` - Get all tasks
- `POST /api/v1/todos` - Create task
- `PATCH /api/v1/todos/:id` - Update task
- `DELETE /api/v1/todos/:id` - Delete task

All protected endpoints require `Authorization: Bearer <token>` header.

## Development

### Code Quality

Pre-commit hooks automatically run:
- ESLint
- Prettier
- TypeScript type-check

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Build for Production

```bash
# Build
npm run build

# Start production server
npm run start
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Fetch API
- **Form Handling**: React Hook Form (optional)
- **Testing**: Jest + React Testing Library

## License

ISC
