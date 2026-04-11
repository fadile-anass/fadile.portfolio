<script setup>
import { ref, onMounted } from 'vue'
import SectionTitle from '../ui/SectionTitle.vue'
import TimelineItem from '../ui/TimelineItem.vue'
import { useApi } from '../../composables/useApi'
import { Briefcase, MapPin, Calendar, AlertCircle } from 'lucide-vue-next'

const { fetchExperiences } = useApi()
const experiences = ref([])
const loading = ref(true)
const errorMsg = ref(null)

onMounted(async () => {
  const { data, error } = await fetchExperiences()
  if (error.value) {
    errorMsg.value = error.value
  } else if (data.value) {
    experiences.value = data.value
  }
  loading.value = false
})

const formatDate = (dateString) => {
  if (!dateString) return 'Present'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
</script>

<template>
  <section class="py-24 px-6 max-w-7xl mx-auto bg-[#1A1A2E] rounded-3xl my-12">
    <SectionTitle number="02" subtitle="Where I've worked" title="Experience" />
    
    <!-- Skeleton Loading State -->
    <div v-if="loading" class="max-w-3xl mx-auto mt-12 space-y-6">
      <div v-for="n in 3" :key="n" class="skeleton-card relative pl-10">
        <div class="absolute left-0 top-3 w-4 h-4 rounded-full bg-[#16213E] animate-pulse"></div>
        <div class="rounded-2xl p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
          <div class="h-5 w-3/5 bg-[#16213E] rounded-lg animate-pulse mb-3"></div>
          <div class="h-3 w-2/5 bg-[#16213E] rounded-lg animate-pulse mb-4"></div>
          <div class="space-y-2">
            <div class="h-3 w-full bg-[#16213E] rounded-lg animate-pulse"></div>
            <div class="h-3 w-4/5 bg-[#16213E] rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="errorMsg" class="max-w-md mx-auto mt-12 text-center">
      <div class="inline-flex items-center gap-3 px-6 py-4 bg-[#E94560]/10 border border-[#E94560]/20 rounded-2xl">
        <AlertCircle class="w-5 h-5 text-[#E94560] shrink-0" />
        <span class="text-[#E94560] text-sm">{{ errorMsg }}</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="experiences.length === 0" class="max-w-md mx-auto mt-12 text-center">
      <Briefcase class="w-12 h-12 text-[#A0A0B0]/30 mx-auto mb-4" />
      <p class="text-[#A0A0B0] text-sm">No experiences to display yet.</p>
    </div>
    
    <!-- Experience Timeline -->
    <div v-else class="max-w-3xl mx-auto mt-12">
      <TimelineItem 
        v-for="(exp, index) in experiences" 
        :key="exp.id"
        :title="`${exp.role} @ ${exp.company}`"
        :description="exp.description"
        :isActive="!exp.end_date"
        :style="{ '--i': index }"
      >
        <template #default>
          <!-- Date + Location row -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 mb-2">
            <span class="inline-flex items-center gap-1.5 text-xs text-[#E94560] font-mono tracking-wide">
              <Calendar class="w-3.5 h-3.5" />
              {{ formatDate(exp.start_date) }} — {{ formatDate(exp.end_date) }}
            </span>
            <span class="inline-flex items-center gap-1.5 text-xs text-[#A0A0B0] font-mono tracking-wide">
              <MapPin class="w-3.5 h-3.5" />
              {{ exp.location }}
            </span>
          </div>

          <!-- Type badge -->
          <div class="mt-1 flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0F0F1A]/80 text-[#A0A0B0] text-xs rounded-lg border border-[#E94560]/15 backdrop-blur-sm">
              <Briefcase class="w-3 h-3 text-[#E94560]" />
              {{ exp.type }}
            </span>
          </div>
        </template>
      </TimelineItem>
    </div>
  </section>
</template>

<style scoped>
/* Skeleton pulse with subtle shimmer */
.skeleton-card {
  animation: fadeIn 0.5s ease forwards;
}

.skeleton-card:nth-child(2) { animation-delay: 0.1s; }
.skeleton-card:nth-child(3) { animation-delay: 0.2s; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
