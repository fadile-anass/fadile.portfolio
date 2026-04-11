<script setup>
import { ref, onMounted, computed } from 'vue'
import SectionTitle from '../ui/SectionTitle.vue'
import ProjectCard from '../ui/ProjectCard.vue'
import { useApi } from '../../composables/useApi'

const { fetchProjects } = useApi()
const projects = ref([])
const loading = ref(true)
const activeFilter = ref('All')

const filters = ['All', 'Full Stack', 'Frontend', 'Backend']

onMounted(async () => {
  const { data } = await fetchProjects()
  if (data.value) {
    projects.value = data.value
  }
  loading.value = false
})

const filteredProjects = computed(() => {
  if (activeFilter.value === 'All') return projects.value
  return projects.value.filter(p => p.category.toLowerCase() === activeFilter.value.toLowerCase().replace(' ', ''))
})
</script>

<template>
  <section class="py-24 px-6 max-w-7xl mx-auto">
    <SectionTitle number="03" subtitle="Some things I've built" title="Projects" />
    
    <!-- Filter Bar -->
    <div class="flex flex-wrap gap-4 justify-center mb-12">
      <button 
        v-for="filter in filters" 
        :key="filter"
        @click="activeFilter = filter"
        class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
        :class="activeFilter === filter ? 'bg-[#E94560] text-white' : 'bg-[#16213E] text-[#A0A0B0] hover:text-[#EAEAEA]'"
      >
        {{ filter }}
      </button>
    </div>
    
    <div v-if="loading" class="text-center text-[#A0A0B0]">Loading projects...</div>
    
    <div v-else class="projects-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ProjectCard 
        v-for="project in filteredProjects" 
        :key="project.id" 
        :project="project" 
      />
    </div>
  </section>
</template>
