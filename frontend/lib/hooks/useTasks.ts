/**
 * useTasks Hook
 *
 * React hook for managing task state and operations.
 * Provides CRUD operations with optimistic updates and error handling.
 *
 * **Usage**:
 * ```typescript
 * const { tasks, isLoading, error, createTask, updateTask, deleteTask, refreshTasks } = useTasks();
 * ```
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '@/lib/api/tasks';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task';

interface UseTasksReturn {
  /** List of tasks */
  tasks: Task[];
  /** Whether tasks are being loaded */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Create a new task */
  createTask: (input: CreateTaskInput) => Promise<Task>;
  /** Update an existing task */
  updateTask: (id: string, input: UpdateTaskInput) => Promise<Task>;
  /** Delete a task */
  deleteTask: (id: string) => Promise<void>;
  /** Refresh task list from server */
  refreshTasks: () => Promise<void>;
  /** Clear error */
  clearError: () => void;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load tasks on mount
   */
  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await taskApi.list();
      setTasks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /**
   * Create task handler with optimistic update
   */
  const createTask = useCallback(async (input: CreateTaskInput): Promise<Task> => {
    setError(null);

    try {
      const newTask = await taskApi.create(input);

      // Optimistic update: add to local state immediately
      setTasks((prev) => [newTask, ...prev]);

      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err; // Re-throw for component-level handling
    }
  }, []);

  /**
   * Update task handler with optimistic update
   */
  const updateTask = useCallback(async (id: string, input: UpdateTaskInput): Promise<Task> => {
    setError(null);

    // Store previous state for rollback
    const previousTasks = tasks;

    try {
      // Optimistic update: update local state immediately
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...input } : task))
      );

      const updatedTask = await taskApi.update(id, input);

      // Update with server response
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );

      return updatedTask;
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);

      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err; // Re-throw for component-level handling
    }
  }, [tasks]);

  /**
   * Delete task handler with optimistic update
   */
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setError(null);

    // Store previous state for rollback
    const previousTasks = tasks;

    try {
      // Optimistic update: remove from local state immediately
      setTasks((prev) => prev.filter((task) => task.id !== id));

      await taskApi.delete(id);
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);

      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err; // Re-throw for component-level handling
    }
  }, [tasks]);

  /**
   * Refresh tasks from server
   */
  const refreshTasks = useCallback(async () => {
    await loadTasks();
  }, [loadTasks]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
    clearError,
  };
}
