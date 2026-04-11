<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

const updateProgress = () => {
  const scrollY = window.scrollY
  const docHeight = document.body.scrollHeight - window.innerHeight
  progress.value = (scrollY / docHeight) * 100
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress)
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-[3px] z-[100] bg-transparent">
    <div 
      class="h-full bg-[#E94560] transition-all duration-100 ease-out"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>
