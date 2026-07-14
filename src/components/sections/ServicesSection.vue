<script setup>
import { ref, onMounted } from 'vue'
import SectionTitle from '../ui/SectionTitle.vue'
import { useApi } from '../../composables/useApi'
import { X } from 'lucide-vue-next'

const { fetchServices } = useApi()
const services = ref([])
const loading = ref(true)
const errorMsg = ref(null)
const selectedService = ref(null)

onMounted(async () => {
  const { data, error } = await fetchServices()
  if (error.value) {
    errorMsg.value = error.value
  } else if (data.value) {
    services.value = data.value
  }
  loading.value = false
})

const closeModal = () => {
  selectedService.value = null
}

const getIcon = (name) => {
  const icons = {
    code: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    layers: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    server: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>',
    chart: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>',
    saas: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    api: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/></svg>',
    ai: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
    automation: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    globe: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>'
  }
  return icons[name] || icons.code
}
</script>

<template>
  <section class="py-24 px-6 max-w-7xl mx-auto bg-[#1A1A2E] rounded-3xl my-12" aria-labelledby="services-heading">
    <SectionTitle number="05" subtitle="What I can do for you" title="Services" />
    <span id="services-heading" class="sr-only">Services offered by Anass Fadile</span>

    <div v-if="loading" class="text-center text-[#A0A0B0]">Loading services...</div>
    <div v-else-if="errorMsg" class="text-center text-[#E94560]">Error: {{ errorMsg }}</div>
    <div v-else-if="services.length === 0" class="text-center text-[#E94560]">No services available at the moment.</div>

    <div v-else class="services-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      <article
        v-for="service in services"
        :key="service.id"
        @click="selectedService = service"
        class="service-card bg-[#16213E] p-8 rounded-2xl border border-[#0F0F1A] hover:border-[#E94560]/50 transition-all duration-300 group cursor-pointer"
        :aria-label="`Learn more about ${service.title}`"
        role="button"
        tabindex="0"
        @keydown.enter="selectedService = service"
        @keydown.space.prevent="selectedService = service"
      >
        <div class="w-16 h-16 bg-[#0F0F1A] rounded-xl flex items-center justify-center text-[#E94560] mb-6 group-hover:scale-110 transition-transform" v-html="getIcon(service.icon_name)" aria-hidden="true">
        </div>
        <h3 class="text-xl font-bold text-[#EAEAEA] mb-4">{{ service.title }}</h3>
        <p class="text-[#A0A0B0] text-sm leading-relaxed line-clamp-3">{{ service.description }}</p>
        <span class="mt-4 inline-flex items-center gap-1 text-xs text-[#E94560] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </span>
      </article>
    </div>

    <!-- Rich Service Detail Modal -->
    <Transition name="modal">
      <div
        v-if="selectedService"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        @click="closeModal"
        role="dialog"
        :aria-label="`Details for ${selectedService.title}`"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-[#0F0F1A]/80 backdrop-blur-sm"></div>
        <div class="relative bg-[#16213E] border border-[#2A2A40] rounded-3xl p-8 max-w-xl w-full shadow-2xl overflow-y-auto max-h-[90vh]" @click.stop>
          <button
            @click="closeModal"
            class="absolute top-6 right-6 text-[#A0A0B0] hover:text-[#E94560] transition-colors"
            aria-label="Close modal"
          >
            <X class="w-6 h-6" />
          </button>

          <div class="w-16 h-16 bg-[#0F0F1A] rounded-xl flex items-center justify-center text-[#E94560] mb-6" v-html="getIcon(selectedService.icon_name)" aria-hidden="true"></div>
          <h3 class="text-2xl font-bold text-[#EAEAEA] mb-2">{{ selectedService.title }}</h3>
          <p class="text-[#A0A0B0] leading-relaxed mb-6">{{ selectedService.description }}</p>

          <!-- What is it -->
          <div v-if="selectedService.what_is_it" class="mb-5">
            <h4 class="text-sm font-bold uppercase tracking-widest text-[#E94560] mb-2">What is it?</h4>
            <p class="text-[#A0A0B0] text-sm leading-relaxed">{{ selectedService.what_is_it }}</p>
          </div>

          <!-- Who is it for -->
          <div v-if="selectedService.who_is_it_for" class="mb-5">
            <h4 class="text-sm font-bold uppercase tracking-widest text-[#E94560] mb-2">Who is it for?</h4>
            <p class="text-[#A0A0B0] text-sm leading-relaxed">{{ selectedService.who_is_it_for }}</p>
          </div>

          <!-- Benefits -->
          <div v-if="selectedService.benefits && selectedService.benefits.length" class="mb-5">
            <h4 class="text-sm font-bold uppercase tracking-widest text-[#E94560] mb-3">Key Benefits</h4>
            <ul class="space-y-2">
              <li
                v-for="benefit in selectedService.benefits"
                :key="benefit"
                class="flex items-start gap-2 text-sm text-[#A0A0B0]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E94560" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5" aria-hidden="true"><path d="m9 12 2 2 4-4"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>
                {{ benefit }}
              </li>
            </ul>
          </div>

          <!-- Technologies -->
          <div v-if="selectedService.technologies && selectedService.technologies.length">
            <h4 class="text-sm font-bold uppercase tracking-widest text-[#E94560] mb-3">Technologies</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in selectedService.technologies"
                :key="tech"
                class="px-3 py-1 bg-[#0F0F1A] border border-[#2A2A3E] rounded-full text-xs font-mono text-[#E94560]"
              >{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px -10px rgba(233, 69, 96, 0.2);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
