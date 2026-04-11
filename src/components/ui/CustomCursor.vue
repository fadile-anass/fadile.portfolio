<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cursor = ref(null)
const dot = ref(null)
const isHovering = ref(false)

let mouseX = 0
let mouseY = 0
let cursorX = 0
let cursorY = 0

const onMouseMove = (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
  
  // Move dot instantly
  if (dot.value) {
    dot.value.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
  }
}

const updateCursor = () => {
  // Lerp outer ring
  cursorX += (mouseX - cursorX) * 0.15
  cursorY += (mouseY - cursorY) * 0.15
  
  if (cursor.value) {
    cursor.value.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`
  }
  
  requestAnimationFrame(updateCursor)
}

const handleMouseOver = (e) => {
  const target = e.target
  if (target.tagName.toLowerCase() === 'a' || 
      target.tagName.toLowerCase() === 'button' ||
      target.closest('a') || 
      target.closest('button') ||
      target.hasAttribute('data-cursor')) {
    isHovering.value = true
  } else {
    isHovering.value = false
  }
}

onMounted(() => {
  // Only enable on non-touch devices
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    requestAnimationFrame(updateCursor)
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseover', handleMouseOver)
})
</script>

<template>
  <div class="hidden md:block pointer-events-none fixed inset-0 z-[100] mix-blend-difference">
    <div 
      ref="cursor" 
      class="absolute w-10 h-10 border border-[#E94560] rounded-full -ml-5 -mt-5 transition-all duration-200 ease-out"
      :class="{ 'scale-150 opacity-50': isHovering }"
    ></div>
    <div 
      ref="dot" 
      class="absolute w-2 h-2 bg-[#E94560] rounded-full -ml-1 -mt-1"
    ></div>
  </div>
</template>
