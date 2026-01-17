# How to Test Frontend Without Backend

## Quick Fix: Enable Mock API

To test the frontend UI without a backend, use the mock API client:

### Step 1: Update Auth API to use Mock

Edit `lib/api/auth.ts`:

```typescript
// At the top, add:
import { mockApi } from './mock-client'

// Then replace each function:
export async function signup(data: SignupData): Promise<APIResponse<AuthResponse>> {
  return mockApi.signup(data)  // Use mock instead of apiClient
}

export async function login(credentials: LoginCredentials): Promise<APIResponse<AuthResponse>> {
  return mockApi.login(credentials)  // Use mock instead of apiClient
}

export async function logout(): Promise<void> {
  return mockApi.logout()  // Use mock instead of apiClient
}
```

### Step 2: Update Tasks API to use Mock

Edit `lib/api/tasks.ts`:

```typescript
// At the top, add:
import { mockApi } from './mock-client'

// Then replace each function:
export async function getTasks(): Promise<APIResponse<Task[]>> {
  return mockApi.getTasks()
}

export async function createTask(input: CreateTaskInput): Promise<APIResponse<Task>> {
  return mockApi.createTask(input)
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<APIResponse<Task>> {
  return mockApi.updateTask(id, input)
}

export async function deleteTask(id: string): Promise<void> {
  return mockApi.deleteTask(id)
}
```

### Step 3: Test the Frontend

```bash
npm run dev
```

Now you can:
- ✅ Signup with any email/password
- ✅ Login with the account you created
- ✅ Create, edit, delete, and toggle tasks
- ✅ All data is stored in memory (resets on page refresh)

## Important Notes

⚠️ **This is for TESTING ONLY!**
- Data is NOT persistent (lost on refresh)
- No real authentication
- No backend validation
- Must replace with real backend for production

## When You Have a Backend

Revert the changes and restore the original API calls:

```typescript
// lib/api/auth.ts - restore to:
export async function signup(data: SignupData): Promise<APIResponse<AuthResponse>> {
  return apiClient.post<AuthResponse>('/api/v1/auth/signup', data)
}
// ... etc
```

---

## Better Solution: Build the Backend

Ask me to help you create a backend with:
- Node.js + Express + Better Auth
- Python + FastAPI
- Or another stack you prefer
