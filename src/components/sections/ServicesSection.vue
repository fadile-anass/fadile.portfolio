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
    chart: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>'
  }
  return icons[name] || icons.code
}
</script>

<template>
  <section class="py-24 px-6 max-w-7xl mx-auto bg-[#1A1A2E] rounded-3xl my-12">
    <SectionTitle number="05" subtitle="What I can do for you" title="Services" />
    
    <div v-if="loading" class="text-center text-[#A0A0B0]">Loading services...</div>
    <div v-else-if="errorMsg" class="text-center text-[#E94560]">Error: {{ errorMsg }}</div>
    <div v-else-if="services.length === 0" class="text-center text-[#E94560]">No services available at the moment.</div>
    
    <div v-else class="services-grid grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
      <div 
        v-for="service in services" 
        :key="service.id"
        @click="selectedService = service"
        class="service-card bg-[#16213E] p-8 rounded-2xl border border-[#0F0F1A] hover:border-[#E94560]/50 transition-all duration-300 group cursor-pointer"
      >
        <div class="w-16 h-16 bg-[#0F0F1A] rounded-xl flex items-center justify-center text-[#E94560] mb-6 group-hover:scale-110 transition-transform" v-html="getIcon(service.icon_name)">
        </div>
        <h4 class="text-xl font-bold text-[#EAEAEA] mb-4">{{ service.title }}</h4>
        <p class="text-[#A0A0B0] text-sm leading-relaxed line-clamp-3">{{ service.description }}</p>
      </div>
    </div>

    <!-- Modal -->
    <Transition name="modal">
      <div v-if="selectedService" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" @click="closeModal">
        <div class="absolute inset-0 bg-[#0F0F1A]/80 backdrop-blur-sm"></div>
        <div class="relative bg-[#16213E] border border-[#2A2A40] rounded-3xl p-8 max-w-lg w-full shadow-2xl" @click.stop>
          <button @click="closeModal" class="absolute top-6 right-6 text-[#A0A0B0] hover:text-[#E94560] transition-colors">
            <X class="w-6 h-6" />
          </button>
          
          <div class="w-16 h-16 bg-[#0F0F1A] rounded-xl flex items-center justify-center text-[#E94560] mb-6" v-html="getIcon(selectedService.icon_name)"></div>
          <h3 class="text-2xl font-bold text-[#EAEAEA] mb-4">{{ selectedService.title }}</h3>
          <p class="text-[#A0A0B0] leading-relaxed">{{ selectedService.description }}</p>
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
