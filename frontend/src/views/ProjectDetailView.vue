<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjects } from '@/composables/useProjects'
import { useTasks } from '@/composables/useTasks'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import TaskFilters from '@/components/tasks/TaskFilters.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { CreateTaskPayload } from '@/types'

const route  = useRoute()
const router = useRouter()

const projectId = Number(route.params.id)

const { projects, fetchProjects } = useProjects()
const { tasks, loading, error, filters, loadTasks, createTask, onStatusChanged, deleteTask } =
  useTasks(projectId)

const project    = computed(() => projects.value.find((p) => p.id === projectId) ?? null)
const showModal  = ref(false)

onMounted(async () => {
  await fetchProjects()
  if (!project.value) {
    router.push({ name: 'projects' })
    return
  }
  loadTasks()
})

async function handleCreateTask(payload: CreateTaskPayload) {
  await createTask(payload)
  showModal.value = false
}
</script>

<template>
  <div v-if="project">
    <!-- Breadcrumb + header -->
    <div class="mb-6">
      <RouterLink to="/" class="text-sm text-blue-600 hover:underline">
        ← Todos os projetos
      </RouterLink>

      <div class="flex items-start justify-between mt-3 gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ project.name }}</h1>
          <p v-if="project.description" class="text-gray-500 text-sm mt-1">
            {{ project.description }}
          </p>
        </div>
        <span
          class="shrink-0 text-xs px-2 py-1 rounded-full border font-medium"
          :class="
            project.status === 'active'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-gray-100 text-gray-500 border-gray-200'
          "
        >
          {{ project.status === 'active' ? 'Ativo' : 'Arquivado' }}
        </span>
      </div>
    </div>

    <!-- Toolbar: filters + new task -->
    <div class="flex flex-col sm:flex-row gap-3 mb-5">
      <TaskFilters
        v-model:status="filters.status"
        v-model:priority="filters.priority"
        class="flex-1"
      />
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
        @click="showModal = true"
      >
        + Nova Tarefa
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-gray-400 text-sm">
      Carregando tarefas...
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-sm"
    >
      {{ error }}
    </div>

    <!-- Empty -->
    <div v-else-if="tasks.length === 0" class="text-center py-10 text-gray-400 text-sm">
      Nenhuma tarefa encontrada com esses filtros.
    </div>

    <!-- Task list -->
    <TransitionGroup v-else tag="div" name="task-list" class="flex flex-col gap-3">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @status-changed="onStatusChanged(task.id, $event)"
        @deleted="deleteTask(task.id)"
      />
    </TransitionGroup>

    <!-- Modal -->
    <BaseModal :open="showModal" title="Nova Tarefa" @close="showModal = false">
      <TaskForm @submit="handleCreateTask" @cancel="showModal = false" />
    </BaseModal>
  </div>

  <!-- Project not loaded yet -->
  <div v-else class="text-center py-16 text-gray-400 text-sm">
    Carregando...
  </div>
</template>

<style scoped>
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.2s ease;
}
.task-list-enter-from {
  opacity: 0;
  transform: translateX(-6px);
}
.task-list-leave-to {
  opacity: 0;
  transform: translateX(6px);
}
</style>
