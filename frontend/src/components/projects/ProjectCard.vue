<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Project } from '../../types/index'

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  (e: 'deleted'): void
}>()

const router = useRouter()

function goToDetail() {
  router.push({ name: 'project-detail', params: { id: props.project.id } })
}
</script>

<template>
  <div
    class="bg-white border rounded-lg p-4 cursor-pointer hover:border-blue-400"
    role="button"
    :aria-label="`Abrir projeto ${project.name}`"
    @click="goToDetail"
  >
    <div class="flex items-start justify-between gap-2 mb-2">
      <h2 class="font-semibold text-sm leading-snug">{{ project.name }}</h2>
      <span
        class="shrink-0 text-xs px-2 py-0.5 rounded-full border"
        :class="
          project.status === 'active'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-gray-100 text-gray-500 border-gray-200'
        "
      >
        {{ project.status === 'active' ? 'Ativo' : 'Arquivado' }}
      </span>
    </div>

    <p class="text-xs text-gray-500 line-clamp-2 mb-3">
      {{ project.description || 'Sem descrição.' }}
    </p>

    <div class="flex items-center justify-between">
      <span class="text-xs text-gray-400">
        {{ project.tasks_count }}
        {{ project.tasks_count === 1 ? 'tarefa' : 'tarefas' }}
      </span>
      <button
        class="text-xs text-red-400 hover:text-red-600"
        aria-label="Apagar projeto"
        @click.stop="emit('deleted')"
      >
        Apagar
      </button>
    </div>
  </div>
</template>
