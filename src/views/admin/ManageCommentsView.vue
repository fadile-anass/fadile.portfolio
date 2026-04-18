<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-black text-[#EAEAEA] tracking-tight">Manage Comments</h2>
      <button @click="fetchComments" class="bg-[#16213E] hover:bg-[#1A2A4A] text-[#A0A0B0] hover:text-[#EAEAEA] p-3 rounded-xl transition-colors active:scale-95" title="Refresh">
        ↻
      </button>
    </div>

    <!-- Error/Loading -->
    <div v-if="loading" class="text-[#A0A0B0] animate-pulse">Loading comments...</div>
    <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">{{ error }}</div>

    <!-- Empty State -->
    <div v-if="!loading && comments.length === 0 && !error" class="text-center py-20 bg-[#16213E]/30 border border-[#1A1A2E]/50 border-dashed rounded-2xl">
      <p class="text-[#A0A0B0] text-lg">No comments found across any blog posts.</p>
    </div>

    <!-- Comments List -->
    <div class="grid gap-4">
      <div v-for="comment in comments" :key="comment.id" class="bg-[#16213E]/50 border border-[#1A1A2E] rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
        <div class="flex-grow">
          <div class="flex items-baseline gap-3 mb-2">
            <h4 class="font-bold text-[#EAEAEA] text-lg">{{ comment.author_name }}</h4>
            <span class="text-xs text-[#606070]">{{ new Date(comment.created_at).toLocaleString() }}</span>
            <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#E94560]/10 text-[#E94560] border border-[#E94560]/20 ml-auto sm:ml-0">Post #{{ comment.post_id }}</span>
          </div>
          <p class="text-[#A0A0B0] leading-relaxed whitespace-pre-line bg-[#0F0F1A] p-4 rounded-xl border border-[#1A1A2E] mt-3">{{ comment.content }}</p>
          <div class="mt-3 text-xs text-[#606070] flex items-center gap-2">
            <span>IP: {{ comment.ip_address || 'Unknown' }}</span>
          </div>
        </div>
        
        <div class="sm:flex-shrink-0 flex items-center justify-end">
          <button @click="deleteComment(comment.id)" class="px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 font-bold rounded-xl transition-all shadow-lg active:scale-95">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const comments = ref([])
const loading = ref(true)
const error = ref('')

async function fetchComments() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/admin/comments', { headers: auth.authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to fetch')
    comments.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function deleteComment(id) {
  if (!confirm('Are you sure you want to permanently delete this comment?')) return
  
  try {
    const res = await fetch(`/api/admin/comments/${id}`, { 
      method: 'DELETE',
      headers: auth.authHeaders() 
    })
    if (!res.ok) throw new Error('Failed to delete')
    comments.value = comments.value.filter(c => c.id !== id)
  } catch (err) {
    alert(err.message)
  }
}

onMounted(() => {
  fetchComments()
})
</script>
