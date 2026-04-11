<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'

const route = useRoute()
const router = useRouter()
const { fetchProjects } = useApi()

const project = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const slug = route.params.slug
  const { data, loading: apiLoading, error: apiError } = await fetchProjects()
  
  loading.value = apiLoading.value
  error.value = apiError.value
  
  if (data.value) {
    project.value = data.value.find(p => p.slug === slug)
    if (!project.value) {
      error.value = 'Project not found'
    }
  }
})
</script>

<template>
  <div class="min-h-screen pt-24 pb-12">
    <div class="px-6 max-w-5xl mx-auto">
      <button @click="router.back()" class="mb-8 text-[#A0A0B0] hover:text-[#E94560] transition-colors flex items-center gap-2 group">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        Back to projects
      </button>
      
      <div v-if="loading" class="text-center py-20 flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-[#E94560] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[#A0A0B0]">Loading project details...</p>
      </div>
      <div v-else-if="error" class="text-center py-20">
        <h2 class="text-2xl font-bold text-[#E94560] mb-4">{{ error }}</h2>
        <button @click="router.push('/#projects')" class="text-[#A0A0B0] hover:underline">Return to home</button>
      </div>
      <div v-else-if="project" class="animate-fade-in">
        <div class="mb-10">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 text-[#EAEAEA] tracking-tight">{{ project.title }}</h1>
          <div class="flex flex-wrap gap-3">
            <span v-for="tech in JSON.parse(project.tech_stack)" :key="tech" class="px-4 py-1.5 bg-[#16213E] border border-[#1A1A2E] rounded-full text-sm font-mono text-[#E94560]">
              {{ tech }}
            </span>
          </div>
        </div>
        
        <div class="relative w-full bg-[#16213E] rounded-2xl mb-12 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#1A1A2E]">
          <img 
            v-if="project.image_url" 
            :src="project.image_url" 
            :alt="project.title" 
            class="w-full h-auto block" 
          />
          <div v-else class="aspect-video flex items-center justify-center text-[#606070] bg-[#0F0F1A]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-4 opacity-20"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <span>No image available</span>
          </div>
        </div>
        
        <div class="grid lg:grid-cols-3 gap-12">
          <div class="lg:col-span-2 prose prose-invert max-w-none">
            <h3 class="text-2xl font-bold mb-4 text-[#EAEAEA]">Overview</h3>
            <p class="text-xl text-[#A0A0B0] leading-relaxed whitespace-pre-wrap">{{ project.description }}</p>
          </div>
          
          <div class="space-y-8">
            <div class="bg-[#16213E] p-6 rounded-2xl border border-[#1A1A2E]">
              <h3 class="text-lg font-bold mb-6 text-[#EAEAEA]">Project Links</h3>
              <div class="flex flex-col gap-4">
                <!-- Live Demo -->
                <a v-if="project.demo_url && project.demo_url !== '#'" :href="project.demo_url" target="_blank" class="flex items-center justify-center gap-2 px-6 py-3 bg-[#E94560] text-white rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all font-bold shadow-lg shadow-[#E94560]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                  Live Demo
                </a>
                <div v-else-if="project.demo_url === '#'" class="flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A2E] text-[#606070] rounded-xl cursor-not-allowed border border-[#1A1A2E] opacity-70 relative group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                  <span>Live Demo</span>
                  <div class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0F0F1A] text-xs text-[#E94560] rounded-md border border-[#E94560]/20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-y-1 group-hover:translate-y-0">
                    Private Project
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0F0F1A]"></div>
                  </div>
                </div>

                <!-- Source Code -->
                <a v-if="project.github_url && project.github_url !== '#'" :href="project.github_url" target="_blank" class="flex items-center justify-center gap-2 px-6 py-3 border border-[#E94560] text-[#E94560] rounded-xl hover:bg-[#E94560]/10 transition-all font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  Source Code
                </a>
                <div v-else-if="project.github_url === '#'" class="flex items-center justify-center gap-2 px-6 py-3 border border-[#606070] text-[#606070] rounded-xl cursor-not-allowed opacity-70 relative group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  <span>Source Code</span>
                  <div class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0F0F1A] text-xs text-[#E94560] rounded-md border border-[#E94560]/20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-y-1 group-hover:translate-y-0">
                    Private Code
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0F0F1A]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
