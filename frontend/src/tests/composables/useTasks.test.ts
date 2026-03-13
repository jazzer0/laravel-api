import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasks } from '../../composables/useTasks'
import { useTasksStore } from '../../stores/tasks'
import { useToastStore } from '@/stores/toast'
import type { Task } from '@/types'
import { ref } from 'vue'

vi.mock('@/stores/tasks', () => ({
  useTasksStore: vi.fn(),
}))

vi.mock('@/stores/toast', () => ({
  useToastStore: vi.fn(),
}))

describe('useTasks', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should create a task and show success toast', async () => {
    const mockAddTask = vi.fn().mockResolvedValue({ id: 1 } as Task)
    const mockShowToast = vi.fn()

    vi.mocked(useTasksStore).mockReturnValue({
      tasks: ref([]),
      loading: ref(false),
      error: ref(null),
      fetchTasks: vi.fn(),
      addTask: mockAddTask,
      updateTaskStatus: vi.fn(),
      deleteTask: vi.fn(),
    } as unknown as ReturnType<typeof useTasksStore>)

    vi.mocked(useToastStore).mockReturnValue({
      show: mockShowToast,
    } as unknown as ReturnType<typeof useToastStore>)

    const { createTask } = useTasks(1)
    const payload = {
      title: 'Nova tarefa',
      description: '',
      priority: 'medium' as const,
    }
    await createTask(payload)

    expect(mockAddTask).toHaveBeenCalledWith(1, payload)
    expect(mockShowToast).toHaveBeenCalledWith('Tarefa criada!')
  })

  it('should handle error when creating task', async () => {
    const error = { userMessage: 'Erro ao criar' }
    const mockAddTask = vi.fn().mockRejectedValue(error)
    const mockShowToast = vi.fn()

    vi.mocked(useTasksStore).mockReturnValue({
      tasks: ref([]),
      loading: ref(false),
      error: ref(null),
      fetchTasks: vi.fn(),
      addTask: mockAddTask,
      updateTaskStatus: vi.fn(),
      deleteTask: vi.fn(),
    } as unknown as ReturnType<typeof useTasksStore>)

    vi.mocked(useToastStore).mockReturnValue({
      show: mockShowToast,
    } as unknown as ReturnType<typeof useToastStore>)

    const { createTask } = useTasks(1)
    const payload = {
      title: 'Nova tarefa',
      description: '',
      priority: 'medium' as const,
    }

    await expect(createTask(payload)).rejects.toThrow()
    expect(mockShowToast).toHaveBeenCalledWith(error.userMessage, 'error')
  })
})
