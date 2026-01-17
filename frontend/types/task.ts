// Task Types

export interface Task {
  id: string
  title: string
  completed: boolean
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface CreateTaskInput {
  title: string
}

export interface UpdateTaskInput {
  title?: string
  completed?: boolean
}

export interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
}
