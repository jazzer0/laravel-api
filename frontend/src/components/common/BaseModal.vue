<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="absolute inset-0 bg-black/40" @click="emit('close')" />

        <div class="relative bg-white rounded-lg w-full max-w-md">
          <div class="flex items-center justify-between px-5 py-4 border-b">
            <h2 class="text-base font-semibold">{{ title }}</h2>
            <button
              class="text-gray-400 hover:text-gray-600 text-xl"
              aria-label="Fechar modal"
              @click="emit('close')"
            >
              &#x2715;
            </button>
          </div>

          <div class="px-5 py-5">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.97) translateY(-8px);
}
.modal-leave-to .relative {
  transform: scale(0.97) translateY(-8px);
}
</style>
