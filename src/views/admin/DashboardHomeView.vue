<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-black text-[#EAEAEA] tracking-tight">Dashboard Overview</h2>
      <button @click="fetchStats" class="bg-[#16213E] hover:bg-[#1A2A4A] text-[#A0A0B0] hover:text-[#EAEAEA] p-3 rounded-xl transition-colors active:scale-95" title="Refresh">
        ↻
      </button>
    </div>

    <!-- Error/Loading State -->
    <div v-if="loading" class="animate-pulse flex gap-6">
      <div v-for="i in 3" :key="i" class="h-32 bg-[#16213E]/50 border border-[#1A1A2E] rounded-2xl flex-1"></div>
    </div>
    
    <div v-if="error" class="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
      Error loading statistics: {{ error }}
    </div>

    <!-- Stats Grid -->
    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[#16213E]/50 border border-[#1A1A2E] rounded-2xl p-6 relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 text-6xl opacity-5 group-hover:scale-110 transition-transform">✉️</div>
        <h3 class="text-[#A0A0B0] font-semibold mb-2">Total Contacts</h3>
        <p class="text-5xl font-black text-[#EAEAEA]">{{ stats.contactsCount || 0 }}</p>
      </div>

      <div class="bg-[#16213E]/50 border border-[#1A1A2E] rounded-2xl p-6 relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 text-6xl opacity-5 group-hover:scale-110 transition-transform">💬</div>
        <h3 class="text-[#A0A0B0] font-semibold mb-2">Total Comments</h3>
        <p class="text-5xl font-black text-[#EAEAEA]">{{ stats.commentsCount || 0 }}</p>
      </div>

      <div class="bg-[#16213E]/50 border border-[#1A1A2E] rounded-2xl p-6 relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 text-6xl opacity-5 group-hover:scale-110 transition-transform">🔥</div>
        <h3 class="text-[#A0A0B0] font-semibold mb-2">Total Reactions</h3>
        <p class="text-5xl font-black text-[#EAEAEA]">{{ stats.reactionsCount || 0 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const stats = ref({ commentsCount: 0, reactionsCount: 0, contactsCount: 0 })
const loading = ref(true)
const error = ref('')

async function fetchStats() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/admin/stats', {
      headers: auth.authHeaders()
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to fetch stats')
    stats.value = data
  } catch (err) {
    error.value = err.message
    if (err.message === 'Unauthorized' || err.message === 'Invalid token') {
      auth.logout()
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>
