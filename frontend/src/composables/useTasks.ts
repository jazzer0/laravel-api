import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import { useToastStore } from '@/stores/toast'
import { useDebounce } from './useDebounce'
import type { CreateTaskPayload, TaskStatus, TaskPriority } from '@/types'

function isErrorWithUserMessage(error: unknown): error is { userMessage: string } {
  return typeof error === 'object' && error !== null && 'userMessage' in error
}

export function useTasks(projectId: number) {
  const store = useTasksStore()
  const toast = useToastStore()
  const { tasks, loading, error } = storeToRefs(store)

  interface Filters {
    status: TaskStatus | ''
    priority: TaskPriority | ''
  }

  const filters = ref<Filters>({ status: '', priority: '' })
  const debouncedFilters = useDebounce(filters, 400)

  watch(
    debouncedFilters,
    (val) => {
      const params: Record<string, string> = {}
      if (val.status) params.status = val.status
      if (val.priority) params.priority = val.priority
      store.fetchTasks(projectId, params).catch(() => {})
    },
    { deep: true },
  )

  function loadTasks() {
    store.fetchTasks(projectId).catch(() => {})
  }

  async function createTask(payload: CreateTaskPayload) {
    try {
      const task = await store.addTask(projectId, payload)
      toast.show('Tarefa criada!')
      return task
    } catch (err: unknown) {
      const message = isErrorWithUserMessage(err) ? err.userMessage : 'Erro inesperado'
      toast.show(message, 'error')
      throw err
    }
  }

  async function updateTaskStatus(taskId: number, newStatus: TaskStatus) {
    if (!taskId) {
      console.warn('updateTaskStatus chamado com taskId indefinido')
      toast.show('Erro: ID da tarefa inválido.', 'error')
      return
    }

    try {
      await store.updateTaskStatus(taskId, newStatus)
    } catch {
      toast.show('Erro ao atualizar status.', 'error')
    }
  }

  async function deleteTask(taskId: number) {
    if (!taskId) {
      console.warn('deleteTask chamado com taskId indefinido')
      toast.show('Erro: ID da tarefa inválido.', 'error')
      return
    }

    try {
      await store.deleteTask(taskId)
      toast.show('Tarefa removida.')
    } catch (err: unknown) {
      const message = isErrorWithUserMessage(err) ? err.userMessage : 'Erro inesperado'
      toast.show(message, 'error')
    }
  }

  async function onStatusChanged(taskId: number, newStatus: TaskStatus) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (!task) return

    const originalStatus = task.status
    task.status = newStatus

    try {
      await updateTaskStatus(taskId, newStatus)
    } catch {
      task.status = originalStatus
    }
  }

  return {
    tasks,
    loading,
    error,
    filters,
    loadTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    onStatusChanged,
  }
}
