<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between mb-2">
      <span class="text-[#EAEAEA] font-medium text-sm">{{ name }}</span>
      <span class="text-[#A0A0B0] text-sm">{{ level }}%</span>
    </div>
    <div class="h-2 w-full bg-[#16213E] rounded-full overflow-hidden">
      <div 
        class="skill-bar-fill h-full bg-[#E94560] rounded-full"
        :data-width="`${level}%`"
        style="width: 0%"
      ></div>
    </div>
  </div>
</template>
