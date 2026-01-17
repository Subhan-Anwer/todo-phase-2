# Setup Guide - Todo App Frontend

## Issue Fixed ✅

The "Failed to fetch" error has been resolved with improved error handling and development tools.

## Root Cause

The error occurred because the **backend API server is not running** on `http://localhost:8000`. The frontend application requires a backend API to handle authentication and task management.

## What Was Fixed

1. **Better Error Messages**: The API client now shows clear messages when the backend is unreachable:
   ```
   Unable to connect to the API server at http://localhost:8000.
   Please ensure the backend is running.
   ```

2. **Development Banner**: A visual indicator now shows the backend connection status:
   - 🟢 Green: Backend connected
   - 🔴 Red: Backend not running
   - 🟡 Yellow: Checking connection

3. **README**: Complete setup instructions added to `frontend/README.md`

## Next Steps

### Option 1: Start the Backend API (Recommended)

You need to start the backend API server. The backend should provide these endpoints:

```
POST   /api/v1/auth/signup    - Create account
POST   /api/v1/auth/login     - Authenticate
POST   /api/v1/auth/logout    - Logout
GET    /api/v1/todos          - Get tasks
POST   /api/v1/todos          - Create task
PATCH  /api/v1/todos/:id      - Update task
DELETE /api/v1/todos/:id      - Delete task
```

**If you have a backend:**
```bash
# Navigate to your backend directory
cd ../backend  # or wherever your backend is

# Start the backend server (adjust command as needed)
npm start        # Node.js
python main.py   # Python
go run main.go   # Go
# etc.
```

**If you don't have a backend yet:**
You'll need to implement the backend API. The frontend specification is in `specs/001-nextjs-frontend/` which defines the expected API contract.

### Option 2: Test with Mock Data (Development Only)

For frontend development without a backend, you can use Mock Service Worker (MSW):

```bash
cd frontend

# MSW is already installed
# Create mock handlers in tests/mocks/handlers.ts
# Enable MSW in development mode
```

## Verify Everything Works

1. **Start the backend** on `http://localhost:8000`

2. **Verify backend is running:**
   ```bash
   curl http://localhost:8000/api/v1/health
   # Should return 200 OK
   ```

3. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Check the development banner:**
   - Visit `http://localhost:3000`
   - You should see a green banner: "✓ Backend API connected"

5. **Test the signup flow:**
   - Go to `http://localhost:3000/signup`
   - Fill in email and password
   - Submit the form
   - If backend is running, you should create an account successfully

## Troubleshooting

### Still seeing "Failed to fetch"?

**Check 1: Backend is running**
```bash
curl http://localhost:8000/api/v1/health
```

**Check 2: Correct port**
- Frontend expects backend on port 8000
- Check `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000`

**Check 3: CORS configuration**
- Backend must allow requests from `http://localhost:3000`
- Add CORS headers in your backend

**Check 4: Backend endpoints**
- Verify `/api/v1/auth/signup` endpoint exists
- Check backend logs for errors

### Port conflicts

**Frontend (port 3000):**
```bash
npx kill-port 3000
npm run dev
```

**Backend (port 8000):**
```bash
npx kill-port 8000
# Then restart your backend
```

## Quick Test Without Backend

If you want to test the UI without a backend, you can temporarily modify the forms to skip API calls, but this is not recommended for real development.

## Summary

✅ **Error handling improved** - Clear messages when backend is not reachable
✅ **DevBanner added** - Visual indicator of backend status
✅ **README created** - Complete setup instructions
✅ **TypeScript passing** - No compilation errors

**Next step**: Start or implement the backend API server on port 8000.

## Need Help?

Check these files:
- `frontend/README.md` - Complete frontend documentation
- `specs/001-nextjs-frontend/spec.md` - Feature specification
- `specs/001-nextjs-frontend/plan.md` - Technical architecture
- `specs/001-nextjs-frontend/contracts/` - API contracts (if exists)
