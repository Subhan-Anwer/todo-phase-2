// Tasks API Functions

import { apiClient } from './client'
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task'
import { APIResponse } from '@/types/api'

export async function getTasks(): Promise<APIResponse<Task[]>> {
  return apiClient.get<Task[]>('/api/v1/todos')
}

export async function createTask(input: CreateTaskInput): Promise<APIResponse<Task>> {
  return apiClient.post<Task>('/api/v1/todos', input)
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<APIResponse<Task>> {
  return apiClient.patch<Task>(`/api/v1/todos/${id}`, input)
}

export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/todos/${id}`)
}

/**
 * Task API object for useTasks hook
 */
export const taskApi = {
  async list(): Promise<Task[]> {
    const response = await getTasks()
    return response.data || []
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const response = await createTask(input)
    if (!response.data) throw new Error('Failed to create task')
    return response.data
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const response = await updateTask(id, input)
    if (!response.data) throw new Error('Failed to update task')
    return response.data
  },

  async delete(id: string): Promise<void> {
    await deleteTask(id)
  },
}
