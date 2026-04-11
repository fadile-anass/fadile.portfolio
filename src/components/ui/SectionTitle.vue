<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="section-title-container relative mb-16">
    <div class="absolute -top-10 -left-4 text-8xl font-bold text-[#1A1A2E] opacity-50 select-none z-0">
      {{ number }}
    </div>
    <div class="relative z-10">
      <h3 class="text-[#E94560] font-mono text-sm tracking-widest uppercase mb-2">{{ subtitle }}</h3>
      <h2 class="text-3xl md:text-4xl font-bold text-[#EAEAEA]">{{ title }}</h2>
      <div class="w-16 h-1 bg-[#E94560] mt-4 rounded-full"></div>
    </div>
  </div>
</template>
