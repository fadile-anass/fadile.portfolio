<template>
  <div class="min-h-screen bg-[#0A0A12] flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E94560]/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#263159]/20 rounded-full blur-[100px]"></div>
    </div>

    <div class="w-full max-w-md bg-[#0F0F1A]/80 backdrop-blur-xl border border-[#1A1A2E] rounded-3xl p-8 relative z-10 shadow-2xl">
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-[#16213E] border border-[#1A1A2E] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span class="text-2xl text-[#E94560]">🔐</span>
        </div>
        <h2 class="text-3xl font-black text-[#EAEAEA] mb-2 tracking-tight">Admin Portal</h2>
        <p class="text-[#A0A0B0] text-sm">Secure access required</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center animate-pulse">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-semibold text-[#A0A0B0] mb-2">Username</label>
          <input 
            v-model="username" 
            type="text" 
            required
            class="w-full bg-[#16213E] border border-[#1A1A2E] text-[#EAEAEA] px-4 py-3 rounded-xl focus:outline-none focus:border-[#E94560] transition-colors placeholder:text-[#606070]"
            placeholder="admin"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-[#A0A0B0] mb-2">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full bg-[#16213E] border border-[#1A1A2E] text-[#EAEAEA] px-4 py-3 rounded-xl focus:outline-none focus:border-[#E94560] transition-colors placeholder:text-[#606070]"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-4 px-6 bg-[#E94560] hover:bg-[#FF6B6B] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-[#E94560]/20 flex justify-center items-center gap-2"
        >
          <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ loading ? 'Authenticating...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) return
  
  loading.value = true
  error.value = ''
  
  const res = await auth.login(username.value, password.value)
  loading.value = false
  
  if (res.success) {
    router.push('/admin/dashboard')
  } else {
    error.value = res.error || 'Authentication failed'
  }
}
</script>
