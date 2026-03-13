<script setup lang="ts">
import { ref } from 'vue'
import type { Task, TaskStatus } from '../../types'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'status-changed', newStatus: TaskStatus): void
  (e: 'deleted'): void
}>()

const updating = ref(false)

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'A Fazer',
  in_progress: 'Em Progresso',
  done: 'Concluída',
}

const PRIORITY_CLASSES: Record<Task['priority'], string> = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-red-50 text-red-700 border-red-200',
}

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

async function handleStatusChange(e: Event) {
  const target = e.target as HTMLSelectElement
  updating.value = true
  try {
    await emit('status-changed', target.value as TaskStatus)
  } finally {
    updating.value = false
  }
}
</script>

<template>
  <div
    class="border rounded-lg p-4"
    :class="task.is_overdue ? 'border-red-300' : 'border-gray-200'"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <p v-if="task.is_overdue" class="text-xs font-medium text-red-600 mb-1">⚠ Em atraso</p>
        <p class="text-sm font-medium truncate">{{ task.title }}</p>
        <p v-if="task.description" class="text-xs text-gray-500 line-clamp-2 mt-0.5">
          {{ task.description }}
        </p>
      </div>

      <span
        class="shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium"
        :class="PRIORITY_CLASSES[task.priority]"
      >
        {{ PRIORITY_LABELS[task.priority] }}
      </span>
    </div>

    <div class="flex items-center justify-between mt-3 gap-2">
      <div class="flex items-center gap-2">
        <select
          :value="task.status"
          :disabled="updating"
          class="text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          @change="handleStatusChange"
        >
          <option v-for="(label, val) in STATUS_LABELS" :key="val" :value="val">
            {{ label }}
          </option>
        </select>
        <span v-if="updating" class="text-xs text-gray-400 animate-pulse">salvando…</span>
      </div>

      <div class="flex items-center gap-3">
        <span
          v-if="task.due_date"
          class="text-xs"
          :class="task.is_overdue ? 'text-red-500 font-medium' : 'text-gray-400'"
        >
          {{ task.due_date }}
        </span>
        <button
          class="text-xs text-red-400 hover:text-red-600"
          aria-label="Apagar tarefa"
          @click="emit('deleted')"
        >
          Apagar
        </button>
      </div>
    </div>
  </div>
</template>
