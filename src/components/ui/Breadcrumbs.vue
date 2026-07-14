<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex mb-6 text-sm text-[#A0A0B0] font-mono">
    <ol class="flex flex-wrap items-center space-x-2">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <span v-if="index > 0" class="mx-2 text-[#606070] select-none">/</span>
        <RouterLink 
          v-if="item.to && index < items.length - 1" 
          :to="item.to" 
          class="hover:text-[#E94560] transition-colors"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="text-[#EAEAEA] font-medium" aria-current="page">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
