<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore, type ToastType } from '../../stores/toast'

const store = useToastStore()
const { toasts } = storeToRefs(store)

const TYPE_CLASSES: Record<ToastType, string> = {
  success: 'bg-gray-900 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="px-4 py-3 rounded-lg shadow-lg text-sm max-w-xs cursor-pointer"
          :class="TYPE_CLASSES[toast.type]"
          role="alert"
          @click="store.dismiss(toast.id)"
        >
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
