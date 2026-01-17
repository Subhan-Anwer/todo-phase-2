'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Task } from '@/types/task'

interface TaskItemProps {
  task: Task
  onToggle: (id: string, completed: boolean) => Promise<void>
  onUpdate: (id: string, title: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isUpdating: boolean
}

export function TaskItem({ task, onToggle, onUpdate, onDelete, isUpdating }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = async () => {
    try {
      await onToggle(task.id, !task.completed)
    } catch (err) {
      console.error('Failed to toggle task:', err)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditTitle(task.title)
    setError(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditTitle(task.title)
    setError(null)
  }

  const handleSaveEdit = async () => {
    const trimmedTitle = editTitle.trim()
    if (!trimmedTitle) {
      setError('Task title cannot be empty')
      return
    }

    if (trimmedTitle === task.title) {
      setIsEditing(false)
      return
    }

    try {
      await onUpdate(task.id, trimmedTitle)
      setIsEditing(false)
      setError(null)
    } catch (err) {
      setError('Failed to update task')
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(task.id)
      setShowDeleteConfirm(false)
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  if (isEditing) {
    return (
      <div className="task-item task-item-editing">
        <div className="flex-1">
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            error={error || undefined}
            disabled={isUpdating}
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleSaveEdit}
            disabled={isUpdating || !editTitle.trim()}
            isLoading={isUpdating}
          >
            Save
          </Button>
          <Button variant="secondary" onClick={handleCancelEdit} disabled={isUpdating}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  if (showDeleteConfirm) {
    return (
      <div className="task-item task-item-confirm">
        <p className="flex-1 text-gray-700">Are you sure you want to delete this task?</p>
        <div className="flex gap-2">
          <Button
            variant="accent"
            onClick={handleDelete}
            disabled={isUpdating}
            isLoading={isUpdating}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={isUpdating}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`task-item ${task.completed ? 'task-item-completed' : ''}`}>
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          disabled={isUpdating}
          className="task-checkbox"
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span className={`task-title ${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </span>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={handleEdit} disabled={isUpdating} aria-label="Edit task">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isUpdating}
          aria-label="Delete task"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </Button>
      </div>
    </div>
  )
}
