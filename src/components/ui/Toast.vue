<script setup>
import { ref } from 'vue'
import { useToastStore } from '../../stores/toastStore'

const toastStore = useToastStore()
</script>

<template>
  <Teleport to="body">
    <TransitionGroup 
      name="toast" 
      tag="div" 
      class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"
    >
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id"
        class="min-w-[300px] p-4 rounded-lg shadow-lg flex items-start gap-3 pointer-events-auto"
        :class="{
          'bg-[#16213E] border border-green-500/50 text-green-400': toast.type === 'success',
          'bg-[#16213E] border border-red-500/50 text-red-400': toast.type === 'error',
          'bg-[#16213E] border border-blue-500/50 text-blue-400': toast.type === 'info'
        }"
      >
        <div class="flex-shrink-0 mt-0.5">
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        </div>
        <p class="text-sm font-medium">{{ toast.message }}</p>
        <button @click="toastStore.removeToast(toast.id)" class="ml-auto text-[#A0A0B0] hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
