/**
 * Test Fixtures: Mock Tasks
 *
 * Provides consistent mock task data for testing task CRUD operations.
 * These fixtures simulate the data structure expected from the task API.
 */

import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task';

/**
 * Mock task 1 - Incomplete task
 */
export const mockTask1: Task = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Buy groceries',
  completed: false,
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  created_at: '2026-01-14T10:30:00Z',
  updated_at: '2026-01-14T10:30:00Z',
};

/**
 * Mock task 2 - Completed task
 */
export const mockTask2: Task = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  title: 'Write documentation',
  completed: true,
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  created_at: '2026-01-13T15:20:00Z',
  updated_at: '2026-01-14T09:15:00Z',
};

/**
 * Mock task 3 - Another incomplete task
 */
export const mockTask3: Task = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  title: 'Complete project documentation',
  completed: false,
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  created_at: '2026-01-14T11:00:00Z',
  updated_at: '2026-01-14T11:00:00Z',
};

/**
 * Mock task 4 - Task belonging to user 2
 */
export const mockTask4: Task = {
  id: '123e4567-e89b-12d3-a456-426614174003',
  title: 'Review pull request',
  completed: false,
  user_id: '550e8400-e29b-41d4-a716-446655440001',
  created_at: '2026-01-14T12:00:00Z',
  updated_at: '2026-01-14T12:00:00Z',
};

/**
 * Mock task list for user 1
 */
export const mockTasksUser1: Task[] = [mockTask1, mockTask2, mockTask3];

/**
 * Mock task list for user 2
 */
export const mockTasksUser2: Task[] = [mockTask4];

/**
 * Empty task list (for new users or after deleting all tasks)
 */
export const emptyTaskList: Task[] = [];

/**
 * Mock create task input
 */
export const mockCreateTaskInput: CreateTaskInput = {
  title: 'New task to create',
};

/**
 * Mock update task input - update title
 */
export const mockUpdateTaskTitleInput: UpdateTaskInput = {
  title: 'Updated task title',
};

/**
 * Mock update task input - toggle completion
 */
export const mockUpdateTaskCompletionInput: UpdateTaskInput = {
  completed: true,
};

/**
 * Mock update task input - update both
 */
export const mockUpdateTaskBothInput: UpdateTaskInput = {
  title: 'Updated and completed task',
  completed: true,
};

/**
 * Generate a new mock task with custom properties
 */
export function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Test task',
    completed: false,
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Generate a list of mock tasks
 */
export function createMockTasks(count: number, userId?: string): Task[] {
  return Array.from({ length: count }, (_, index) =>
    createMockTask({
      title: `Task ${index + 1}`,
      completed: index % 2 === 0, // Alternate between complete and incomplete
      user_id: userId || '550e8400-e29b-41d4-a716-446655440000',
    })
  );
}
