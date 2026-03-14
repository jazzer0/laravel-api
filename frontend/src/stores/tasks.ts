import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { Task, TaskStatus, TaskPriority, PaginatedResponse, CreateTaskPayload } from '@/types'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTasks(projectId: number, params?: Record<string, string>) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<PaginatedResponse<Task>>(`/projects/${projectId}/tasks`, {
        params,
      })
      tasks.value = response.data.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
      console.error('Erro ao buscar tarefas:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addTask(projectId: number, payload: CreateTaskPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<{ data: Task }>(`/projects/${projectId}/tasks`, payload)
      const task = response.data.data ?? response.data
      tasks.value.push(task)
      return task
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTaskStatus(taskId: number, newStatus: TaskStatus) {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus })
      const task = tasks.value.find((t) => t.id === taskId)
      if (task) {
        task.status = newStatus
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      throw err
    }
  }

  async function deleteTask(taskId: number) {
    try {
      await api.delete(`/tasks/${taskId}`)
      tasks.value = tasks.value.filter((t) => t.id !== taskId)
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err)
      throw err
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTaskStatus,
    deleteTask,
  }
})
