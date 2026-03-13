<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AppToast from '@/components/common/AppToast.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
        <RouterLink to="/" class="font-semibold text-gray-900 text-lg hover:text-blue-600">
          Task Manager
        </RouterLink>
        <RouterLink
          to="/"
          class="text-sm text-gray-500 hover:text-gray-700"
          active-class="text-blue-600 font-medium"
        >
          Projetos
        </RouterLink>
      </div>
    </nav>

    <main class="max-w-5xl mx-auto px-4 py-8">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <AppToast />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
