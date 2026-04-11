<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' }
]
</script>

<template>
  <nav 
    class="navbar fixed top-0 left-0 w-full z-50 transition-all duration-300 opacity-0 -translate-y-full"
    :class="{ 'bg-[rgba(15,15,26,0.95)] backdrop-blur-[10px] py-4 shadow-lg': isScrolled, 'bg-transparent py-6': !isScrolled }"
  >
    <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
      <a href="#hero" class="text-2xl font-bold text-[#E94560] tracking-tighter">FA.</a>
      
      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8">
        <a 
          v-for="link in navLinks" 
          :key="link.name" 
          :href="link.href"
          class="text-[#A0A0B0] hover:text-[#EAEAEA] text-sm font-medium transition-colors relative group"
        >
          {{ link.name }}
          <span class="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#E94560] transition-all duration-300 group-hover:w-full"></span>
        </a>
      </div>
      
      <!-- Mobile Toggle -->
      <button @click="toggleMenu" class="md:hidden text-[#EAEAEA] z-50 relative">
        <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
    
    <!-- Mobile Menu -->
    <div 
      class="fixed inset-0 bg-[#0F0F1A] z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden"
      :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <a 
        v-for="link in navLinks" 
        :key="link.name" 
        :href="link.href"
        @click="closeMenu"
        class="text-2xl font-bold text-[#A0A0B0] hover:text-[#E94560] transition-colors"
      >
        {{ link.name }}
      </a>
    </div>
  </nav>
</template>
