import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { Project, CreateProjectPayload, UpdateProjectPayload } from '@/types'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProjects() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<{ data: Project[] }>('/projects')
      projects.value = response.data.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    } finally {
      loading.value = false
    }
  }

  async function createProject(payload: CreateProjectPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<Project>('/projects', payload)
      projects.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProject(id: number, payload: UpdateProjectPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put<Project>(`/projects/${id}`, payload)
      const index = projects.value.findIndex((p) => p.id === id)
      if (index !== -1) projects.value[index] = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProject(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/projects/${id}`)
      projects.value = projects.value.filter((p) => p.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
})
