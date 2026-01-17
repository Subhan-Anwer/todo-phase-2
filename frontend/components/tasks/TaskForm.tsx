'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { CreateTaskInput } from '@/types/task'

interface TaskFormProps {
  onSubmit: (data: CreateTaskInput) => Promise<void>
  isSubmitting: boolean
}

export function TaskForm({ onSubmit, isSubmitting }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Task title is required')
      return
    }

    if (trimmedTitle.length > 500) {
      setError('Task title must be less than 500 characters')
      return
    }

    try {
      await onSubmit({ title: trimmedTitle })
      setTitle('') // Clear form on success
    } catch (err: any) {
      setError(err.message || 'Failed to create task')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    if (error) {
      setError(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            error={error || undefined}
            placeholder="What needs to be done?"
            autoFocus
            disabled={isSubmitting}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </Button>
      </div>
    </form>
  )
}
