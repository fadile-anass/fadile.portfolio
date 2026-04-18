<template>
  <div class="min-h-screen bg-[#0A0A12] text-[#EAEAEA] flex selection:bg-[#E94560] selection:text-white">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#0F0F1A] border-r border-[#1A1A2E] flex flex-col fixed h-full z-10 transition-transform md:translate-x-0" :class="{'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen}">
      <!-- Header -->
      <div class="p-6 border-b border-[#1A1A2E] flex items-center justify-between">
        <h2 class="text-xl font-black bg-gradient-to-r from-[#EAEAEA] to-[#A0A0B0] bg-clip-text text-transparent">Admin Panel</h2>
        <button class="md:hidden text-[#A0A0B0] hover:text-[#EAEAEA]" @click="sidebarOpen = false">
          ✕
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-grow p-4 space-y-2">
        <router-link to="/admin/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium" active-class="bg-[#E94560]/10 text-[#E94560]" :class="$route.path.includes('/dashboard') ? '' : 'text-[#A0A0B0] hover:bg-[#16213E] hover:text-[#EAEAEA]'">
          📊 Dashboard
        </router-link>
        <router-link to="/admin/comments" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium" active-class="bg-[#E94560]/10 text-[#E94560]" :class="$route.path.includes('/comments') ? '' : 'text-[#A0A0B0] hover:bg-[#16213E] hover:text-[#EAEAEA]'">
          💬 Comments
        </router-link>
        <router-link to="/admin/contacts" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium" active-class="bg-[#E94560]/10 text-[#E94560]" :class="$route.path.includes('/contacts') ? '' : 'text-[#A0A0B0] hover:bg-[#16213E] hover:text-[#EAEAEA]'">
          ✉️ Contacts
        </router-link>
      </nav>

      <!-- Footer / Logout -->
      <div class="p-4 border-t border-[#1A1A2E]">
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium">
          🚪 Logout
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 md:ml-64 flex flex-col min-h-screen relative overflow-x-hidden">
      <!-- Mobile Header -->
      <header class="md:hidden bg-[#0F0F1A] border-b border-[#1A1A2E] p-4 flex items-center sticky top-0 z-0">
        <button @click="sidebarOpen = true" class="text-[#A0A0B0] p-2 hover:bg-[#16213E] rounded-lg border border-[#1A1A2E]">
          ☰
        </button>
        <h1 class="font-bold ml-4 text-lg">Portfolio Admin</h1>
      </header>

      <!-- Router View Container -->
      <div class="p-6 md:p-10 flex-grow max-w-7xl mx-auto w-full">
        <router-view></router-view>
      </div>
    </main>

    <!-- Mobile Overlay overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/60 z-0 md:hidden backdrop-blur-sm transition-opacity" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const sidebarOpen = ref(false)
const auth = useAuthStore()

function handleLogout() {
  auth.logout()
}
</script>
