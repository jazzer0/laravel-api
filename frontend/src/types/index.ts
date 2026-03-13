export interface Project {
  id: number
  name: string
  description: string | null
  status: 'active' | 'archived'
  tasks_count: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  is_overdue: boolean
  created_at: string
}

export type TaskStatus = Task['status']
export type TaskPriority = Task['priority']

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    prev: string | null
    next: string | null
  }
  meta: {
    per_page: number
    current_page: number
  }
}

export type CreateProjectPayload = {
  name: string
  description?: string | null
  status?: 'active' | 'archived'
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>

export type CreateTaskPayload = {
  title: string
  description?: string | null
  status?: Task['status']
  priority?: Task['priority']
  due_date?: string | null
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>
