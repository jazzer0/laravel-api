<script setup>
import { onMounted, ref } from 'vue'
import { useProjects } from '@/composables/useProjects'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import ProjectForm from '@/components/projects/ProjectForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const { projects, loading, error, fetchProjects, createProject, deleteProject } = useProjects()

const showModal = ref(false)

onMounted(() => fetchProjects())

async function handleCreate(payload) {
  await createProject(payload)
  showModal.value = false
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Projetos</h1>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="showModal = true"
      >
        + Novo Projeto
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="text-gray-400 text-sm">Carregando projetos...</div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-sm"
    >
      {{ error }}
    </div>

    <!-- Empty -->
    <div
      v-else-if="projects.length === 0"
      class="text-center py-16 text-gray-400"
    >
      <p class="text-lg">Nenhum projeto encontrado.</p>
      <p class="text-sm mt-1">Crie o primeiro projeto para começar.</p>
    </div>

    <!-- Grid -->
    <TransitionGroup
      v-else
      tag="div"
      name="card-list"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @deleted="deleteProject(project.id)"
      />
    </TransitionGroup>

    <!-- Modal -->
    <BaseModal :open="showModal" title="Novo Projeto" @close="showModal = false">
      <ProjectForm @submit="handleCreate" @cancel="showModal = false" />
    </BaseModal>
  </div>
</template>

<style scoped>
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.25s ease;
}
.card-list-enter-from {
  opacity: 0;
  transform: scale(0.97);
}
.card-list-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
