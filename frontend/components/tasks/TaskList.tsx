'use client'

import React, { useEffect, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api/tasks'
import { TaskForm } from './TaskForm'
import { TaskItem } from './TaskItem'
import { TaskEmptyState } from './TaskEmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { Task, CreateTaskInput } from '@/types/task'

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getTasks()
      setTasks(response.data || [])
    } catch (err: any) {
      console.error('Failed to fetch tasks:', err)
      setError('Unable to load tasks. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (input: CreateTaskInput) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await createTask(input)
      if (response.data) {
        // Add new task to the beginning of the list
        setTasks((prev) => [response.data, ...prev])
      }
    } catch (err: any) {
      console.error('Failed to create task:', err)
      setError('Failed to create task. Please try again.')
      throw err // Re-throw to let TaskForm handle it
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleTask = async (id: string, completed: boolean) => {
    setUpdatingTaskId(id)
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, completed } : task))
      )

      await updateTask(id, { completed })
    } catch (err: any) {
      console.error('Failed to toggle task:', err)
      // Rollback on error
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, completed: !completed } : task))
      )
      setError('Failed to update task. Please try again.')
    } finally {
      setUpdatingTaskId(null)
    }
  }

  const handleUpdateTask = async (id: string, title: string) => {
    setUpdatingTaskId(id)
    try {
      const response = await updateTask(id, { title })
      if (response.data) {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? response.data : task))
        )
      }
    } catch (err: any) {
      console.error('Failed to update task:', err)
      throw err // Re-throw to let TaskItem handle it
    } finally {
      setUpdatingTaskId(null)
    }
  }

  const handleDeleteTask = async (id: string) => {
    setUpdatingTaskId(id)
    try {
      // Optimistic delete
      setTasks((prev) => prev.filter((task) => task.id !== id))
      await deleteTask(id)
    } catch (err: any) {
      console.error('Failed to delete task:', err)
      // Re-fetch on error to restore state
      await fetchTasks()
      setError('Failed to delete task. Please try again.')
    } finally {
      setUpdatingTaskId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <TaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />

      {tasks.length === 0 ? (
        <TaskEmptyState />
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              isUpdating={updatingTaskId === task.id}
            />
          ))}
        </div>
      )}

      {tasks.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          {tasks.filter((t) => !t.completed).length} of {tasks.length} tasks remaining
        </div>
      )}
    </div>
  )
}
