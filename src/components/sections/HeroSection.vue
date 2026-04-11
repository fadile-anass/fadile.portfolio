<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useThreeScene } from '../../composables/useThreeScene'
import { useTypewriter } from '../../composables/useTypewriter'
import { onClickOutside } from '@vueuse/core'

const canvasContainer = ref(null)
const { mountScene, destroyScene } = useThreeScene()
const roles = ['Full Stack Developer', 'Business Developer', 'Vue.js Specialist', 'Problem Solver']
const { currentText, isTyping } = useTypewriter(roles, { typeSpeed: 100, deleteSpeed: 50, delayBetween: 2000 })

onMounted(() => {
  if (canvasContainer.value) {
    mountScene(canvasContainer.value)
  }
})

onUnmounted(() => {
  destroyScene()
})

const scrollToWork = () => {
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
}

const isDownloadOpen = ref(false)
const downloadContainer = ref(null)

onClickOutside(downloadContainer, () => {
  isDownloadOpen.value = false
})
</script>

<template>
  <section class="relative h-screen w-full overflow-hidden flex items-center justify-center">
    <!-- 3D Canvas Container -->
    <div ref="canvasContainer" class="absolute inset-0 z-0 opacity-0 hero-canvas"></div>
    
    <!-- Overlay Content -->
    <div class="relative z-10 text-center px-6 max-w-4xl mx-auto pointer-events-none">
      <h1 class="text-5xl md:text-7xl font-bold text-[#EAEAEA] mb-4 tracking-tight hero-name opacity-0 translate-y-16">
        Fadile Anass
      </h1>
      
      <div class="h-12 md:h-16 mb-6 hero-role opacity-0">
        <p class="text-2xl md:text-4xl text-[#E94560] font-medium">
          {{ currentText }}<span class="inline-block w-[3px] h-[1em] bg-[#E94560] ml-1 align-middle" :class="{ 'animate-pulse': !isTyping }"></span>
        </p>
      </div>
      
      <p class="text-lg md:text-xl text-[#A0A0B0] mb-10 font-medium hero-tagline opacity-0">
        I build products. I grow businesses.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center hero-buttons opacity-0 pointer-events-auto">
        <button @click="scrollToWork" class="px-8 py-3 bg-[#E94560] text-white rounded-lg font-medium hover:scale-105 active:scale-95 transition-transform w-full sm:w-auto">
          View My Work
        </button>
        <div ref="downloadContainer" class="relative w-full sm:w-auto">
          <button 
            @keyup.esc="isDownloadOpen = false"
            @click="isDownloadOpen = !isDownloadOpen" 
            class="px-8 py-3 border border-[#E94560] text-[#E94560] rounded-lg font-medium hover:scale-105 active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center gap-2 group"
          >
            Download CV
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              class="transition-transform duration-300"
              :class="{ 'rotate-180': isDownloadOpen }"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          
          <div 
            v-if="isDownloadOpen"
            class="absolute bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 left-0 w-full bg-[#1A1A2E] border border-[#E94560]/30 rounded-lg overflow-hidden z-50 shadow-xl backdrop-blur-md"
          >
            <a 
              href="/Fadile_Anass(EN).pdf" 
              target="_blank" 
              class="flex items-center gap-3 px-4 py-3 hover:bg-[#E94560] hover:text-white transition-colors border-b border-[#E94560]/10"
              @click="isDownloadOpen = false"
            >
              <span class="text-sm font-medium">English (EN)</span>
            </a>
            <a 
              href="/FADILE_ANASS(FR).pdf" 
              target="_blank" 
              class="flex items-center gap-3 px-4 py-3 hover:bg-[#E94560] hover:text-white transition-colors"
              @click="isDownloadOpen = false"
            >
              <span class="text-sm font-medium">Français (FR)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce text-[#A0A0B0]">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
    </div>
  </section>
</template>
