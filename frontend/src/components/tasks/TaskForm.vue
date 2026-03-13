<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { TaskStatus, TaskPriority } from '../../types/index'

export type TaskPayload = {
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
}

const emit = defineEmits<{
  (e: 'submit', task: TaskPayload): void
  (e: 'cancel'): void
}>()

const form = reactive<TaskPayload>({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: '',
})

const submitting = ref(false)
const formError = ref('')

async function handleSubmit() {
  formError.value = ''
  if (!form.title.trim()) {
    formError.value = 'O título da tarefa é obrigatório.'
    return
  }

  submitting.value = true
  try {
    await emit('submit', {
      ...form,
      due_date: form.due_date || null,
    })
  } catch {
    formError.value = 'Erro ao salvar. Tente novamente.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
    <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

    <div>
      <label class="block text-sm font-medium mb-1">
        Título <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.title"
        type="text"
        class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Título da tarefa"
        maxlength="255"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Descrição</label>
      <textarea
        v-model="form.description"
        rows="2"
        class="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Descrição opcional"
        maxlength="2000"
      />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-sm font-medium mb-1">Status</label>
        <select
          v-model="form.status"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todo">A Fazer</option>
          <option value="in_progress">Em Progresso</option>
          <option value="done">Concluída</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Prioridade</label>
        <select
          v-model="form.priority"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Data limite</label>
      <input
        v-model="form.due_date"
        type="date"
        class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="flex justify-end gap-2 pt-1">
      <button
        type="button"
        class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        @click="emit('cancel')"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="submitting"
      >
        {{ submitting ? 'Salvando...' : 'Criar Tarefa' }}
      </button>
    </div>
  </form>
</template>
