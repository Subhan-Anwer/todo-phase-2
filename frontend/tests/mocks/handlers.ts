import { http, HttpResponse } from 'msw'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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

  // Mock signup
  http.post(`${API_URL}/api/v1/auth/signup`, () => {
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

  // Mock create task
  http.post(`${API_URL}/api/v1/todos`, async ({ request }) => {
    const body = (await request.json()) as { title: string }
    return HttpResponse.json({
      data: {
        id: '2',
        title: body.title,
        completed: false,
      },
    })
  }),

  // Mock update task
  http.patch(`${API_URL}/api/v1/todos/:id`, async ({ request, params }) => {
    const body = (await request.json()) as { title?: string; completed?: boolean }
    return HttpResponse.json({
      data: {
        id: params.id,
        title: body.title || 'Updated task',
        completed: body.completed !== undefined ? body.completed : false,
      },
    })
  }),

  // Mock delete task
  http.delete(`${API_URL}/api/v1/todos/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
