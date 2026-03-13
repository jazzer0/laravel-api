<script setup lang="ts">
import { reactive, ref } from 'vue'

export type ProjectPayload = {
  name: string
  description: string | null
  status: 'active' | 'archived'
}

const emit = defineEmits<{
  (e: 'submit', project: ProjectPayload): void
  (e: 'cancel'): void
}>()

const form = reactive<ProjectPayload>({
  name: '',
  description: '',
  status: 'active',
})

const submitting = ref(false)
const formError = ref('')

async function handleSubmit() {
  formError.value = ''
  if (!form.name.trim()) {
    formError.value = 'O nome do projeto é obrigatório.'
    return
  }

  submitting.value = true
  try {
    await emit('submit', { ...form })
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
        Nome <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Nome do projeto"
        maxlength="255"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Descrição</label>
      <textarea
        v-model="form.description"
        rows="3"
        class="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Descrição opcional"
        maxlength="2000"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Status</label>
      <select
        v-model="form.status"
        class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="active">Ativo</option>
        <option value="archived">Arquivado</option>
      </select>
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
        {{ submitting ? 'Salvando...' : 'Criar Projeto' }}
      </button>
    </div>
  </form>
</template>
