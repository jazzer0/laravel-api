import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/projects'
import { useToastStore } from '@/stores/toast'
import type { CreateProjectPayload, UpdateProjectPayload } from '@/types'

function isErrorWithUserMessage(error: unknown): error is { userMessage: string } {
  return typeof error === 'object' && error !== null && 'userMessage' in error
}

export function useProjects() {
  const store = useProjectStore()
  const toast = useToastStore()
  const { projects, loading, error } = storeToRefs(store)

  async function createProject(payload: CreateProjectPayload) {
    try {
      const project = await store.createProject(payload)
      toast.show('Projeto criado com sucesso!')
      return project
    } catch (err: unknown) {
      const message = isErrorWithUserMessage(err) ? err.userMessage : 'Erro inesperado'
      toast.show(message, 'error')
      throw err
    }
  }

  async function updateProject(id: number, payload: UpdateProjectPayload) {
    try {
      const project = await store.updateProject(id, payload)
      toast.show('Projeto atualizado!')
      return project
    } catch (err: unknown) {
      const message = isErrorWithUserMessage(err) ? err.userMessage : 'Erro inesperado'
      toast.show(message, 'error')
      throw err
    }
  }

  async function deleteProject(id: number) {
    try {
      await store.deleteProject(id)
      toast.show('Projeto removido.')
    } catch (err: unknown) {
      const message = isErrorWithUserMessage(err) ? err.userMessage : 'Erro inesperado'
      toast.show(message, 'error')
      throw err
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects: store.fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}
