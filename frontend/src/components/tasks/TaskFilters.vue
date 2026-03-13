<script setup lang="ts">
defineProps<{
  status: string
  priority: string
}>()

const emit = defineEmits<{
  (e: 'update:status', value: string): void
  (e: 'update:priority', value: string): void
}>()

const onStatusChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:status', target.value)
}

const onPriorityChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:priority', target.value)
}
</script>

<template>
  <div class="flex gap-2">
    <select
      :value="status"
      class="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      @change="onStatusChange"
    >
      <option value="">Todos os status</option>
      <option value="todo">A Fazer</option>
      <option value="in_progress">Em Progresso</option>
      <option value="done">Concluída</option>
    </select>

    <select
      :value="priority"
      class="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      @change="onPriorityChange"
    >
      <option value="">Todas as prioridades</option>
      <option value="low">Baixa</option>
      <option value="medium">Média</option>
      <option value="high">Alta</option>
    </select>
  </div>
</template>
