<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-black text-[#EAEAEA] tracking-tight">Contact Inquiries</h2>
      <button @click="fetchContacts" class="bg-[#16213E] hover:bg-[#1A2A4A] text-[#A0A0B0] hover:text-[#EAEAEA] p-3 rounded-xl transition-colors active:scale-95" title="Refresh">
        ↻
      </button>
    </div>

    <!-- Error/Loading -->
    <div v-if="loading" class="text-[#A0A0B0] animate-pulse">Loading messages...</div>
    <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">{{ error }}</div>

    <!-- Empty State -->
    <div v-if="!loading && contacts.length === 0 && !error" class="text-center py-20 bg-[#16213E]/30 border border-[#1A1A2E]/50 border-dashed rounded-2xl">
      <p class="text-[#A0A0B0] text-lg">Inbox zero! No contact messages found.</p>
    </div>

    <!-- List -->
    <div class="grid gap-4">
      <div v-for="msg in contacts" :key="msg.id" class="bg-[#16213E]/50 border border-[#1A1A2E] rounded-2xl p-6 flex flex-col xl:flex-row gap-6 transition-all" :class="{'opacity-75': msg.read_status === 1}">
        
        <div class="flex-grow">
          <div class="flex items-center gap-3 mb-4 flex-wrap">
            <h4 class="font-bold text-[#EAEAEA] text-lg">{{ msg.name }}</h4>
            <a :href="'mailto:' + msg.email" class="text-sm text-[#38BDF8] hover:underline">{{ msg.email }}</a>
            <span class="text-xs text-[#606070] ml-auto xl:ml-2">{{ new Date(msg.created_at).toLocaleString() }}</span>
          </div>
          
          <div class="bg-[#0F0F1A] border border-[#1A1A2E] rounded-xl p-5 relative">
            <h5 class="text-sm font-bold text-[#EAEAEA] mb-2 border-b border-[#1A1A2E] pb-2">Subject: {{ msg.subject || 'No Subject' }}</h5>
            <p class="text-[#A0A0B0] whitespace-pre-line leading-relaxed">{{ msg.message }}</p>
          </div>
        </div>
        
        <div class="xl:w-48 flex xl:flex-col gap-3 justify-end xl:justify-center">
          <a :href="'mailto:' + msg.email" class="flex-1 shrink text-center px-4 py-3 bg-[#E94560]/10 hover:bg-[#E94560]/20 border border-[#E94560]/20 text-[#E94560] font-bold rounded-xl transition-colors">
            Reply
          </a>
          <button @click="deleteMessage(msg.id)" class="flex-1 shrink px-4 py-3 bg-[#1A1A2E] hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 border border-[#2A2A3E] text-[#A0A0B0] font-bold rounded-xl transition-colors">
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
const contacts = ref([])
const loading = ref(true)
const error = ref('')

async function fetchContacts() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/admin/contacts', { headers: auth.authHeaders() })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to fetch')
    contacts.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function deleteMessage(id) {
  if (!confirm('Delete this contact message permanently?')) return
  
  try {
    const res = await fetch(`/api/admin/contacts/${id}`, { 
      method: 'DELETE',
      headers: auth.authHeaders() 
    })
    if (!res.ok) throw new Error('Failed to delete')
    contacts.value = contacts.value.filter(c => c.id !== id)
  } catch (err) {
    alert(err.message)
  }
}

onMounted(() => {
  fetchContacts()
})
</script>
