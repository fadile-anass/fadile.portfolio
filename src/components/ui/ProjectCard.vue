<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTiltEffect } from '../../composables/useTiltEffect'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cardRef = ref(null)
const { applyTilt } = useTiltEffect()

onMounted(() => {
  if (cardRef.value) {
    applyTilt(cardRef.value)
  }
})

const navigateToProject = () => {
  router.push(`/project/${props.project.slug}`)
}
</script>

<template>
  <div 
    ref="cardRef"
    class="project-card bg-[#16213E] rounded-2xl overflow-hidden border border-[#1A1A2E] cursor-pointer group relative h-full flex flex-col"
    @click="navigateToProject"
    style="transform-style: preserve-3d;"
  >
    <div v-if="project.featured" class="absolute top-4 right-4 bg-[#E94560] text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
      Featured
    </div>
    
    <div class="relative w-full aspect-video overflow-hidden bg-[#0F0F1A]">
      <img 
        v-if="project.image_url" 
        :src="project.image_url" 
        :alt="project.title" 
        class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
      />
      <div v-else class="absolute inset-0 flex items-center justify-center text-[#A0A0B0]">
        No Image
      </div>
      
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#16213E] to-transparent opacity-60"></div>
    </div>
    
    <div class="p-6 flex-1 flex flex-col" style="transform: translateZ(30px);">
      <h4 class="text-xl font-bold text-[#EAEAEA] mb-2 group-hover:text-[#E94560] transition-colors line-clamp-1">{{ project.title }}</h4>
      <p class="text-[#A0A0B0] text-sm mb-4 line-clamp-3">{{ project.description }}</p>
      
      <div class="flex flex-wrap gap-2 mb-6">
        <span v-for="tech in JSON.parse(project.tech_stack).slice(0, 3)" :key="tech" class="text-xs text-[#E94560] font-mono px-2 py-1 bg-[#1A1A2E] rounded">
          {{ tech }}
        </span>
        <span v-if="JSON.parse(project.tech_stack).length > 3" class="text-xs text-[#606070] font-mono px-2 py-1 bg-[#1A1A2E] rounded">
          +{{ JSON.parse(project.tech_stack).length - 3 }}
        </span>
      </div>
      
      <div class="flex gap-3 mt-auto pt-4 border-t border-[#1A1A2E]" @click.stop>
        <a v-if="project.demo_url" :href="project.demo_url" target="_blank" class="flex-1 flex items-center justify-center gap-2 p-2 bg-[#1A1A2E] rounded-lg text-[#EAEAEA] hover:text-[#E94560] hover:bg-[#0F0F1A] transition-all border border-transparent hover:border-[#E94560]/30" title="Live Demo">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          <span class="text-xs font-bold uppercase tracking-wider">Demo</span>
        </a>
        <a v-if="project.github_url" :href="project.github_url" target="_blank" class="p-2 bg-[#1A1A2E] rounded-lg text-[#EAEAEA] hover:text-[#E94560] hover:bg-[#0F0F1A] transition-all border border-transparent hover:border-[#E94560]/30" title="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  transition: box-shadow 0.3s ease;
}
.project-card:hover {
  box-shadow: 0 10px 30px -10px rgba(233, 69, 96, 0.3);
}
</style>
