<script setup>
import { ref, onMounted } from 'vue'
import SectionTitle from '../ui/SectionTitle.vue'
import { useApi } from '../../composables/useApi'

const { fetchBlogPosts } = useApi()
const posts = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await fetchBlogPosts()
  if (data.value) {
    posts.value = data.value
  }
  loading.value = false
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <section class="py-24 px-6 max-w-7xl mx-auto">
    <SectionTitle number="06" subtitle="My thoughts and learnings" title="Blog" />
    
    <div v-if="loading" class="text-center text-[#A0A0B0]">Loading posts...</div>
    
    <div v-else-if="posts.length === 0" class="grid md:grid-cols-3 gap-8">
      <!-- Placeholders -->
      <div v-for="i in 3" :key="i" class="bg-[#16213E] rounded-2xl overflow-hidden border border-[#1A1A2E] relative group">
        <div class="absolute top-4 right-4 bg-[#E94560] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          Coming Soon
        </div>
        <div class="aspect-video bg-[#0F0F1A] w-full"></div>
        <div class="p-6">
          <div class="h-4 bg-[#1A1A2E] rounded w-1/4 mb-4"></div>
          <div class="h-6 bg-[#1A1A2E] rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-[#1A1A2E] rounded w-full mb-2"></div>
          <div class="h-4 bg-[#1A1A2E] rounded w-2/3"></div>
        </div>
      </div>
    </div>
    
    <div v-else class="grid md:grid-cols-3 gap-8">
      <div v-for="post in posts" :key="post.id" class="bg-[#16213E] rounded-2xl overflow-hidden border border-[#1A1A2E] hover:border-[#E94560]/30 transition-colors group flex flex-col">
        <div class="aspect-video bg-[#0F0F1A] w-full overflow-hidden relative">
          <img v-if="post.cover_image" :src="post.cover_image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div v-else class="w-full h-full flex items-center justify-center text-[#A0A0B0]">No Image</div>
        </div>
        <div class="p-6 flex flex-col flex-grow">
          <div class="flex items-center justify-between text-xs text-[#606070] mb-4">
            <span>{{ formatDate(post.created_at) }}</span>
            <span v-if="post.read_time">{{ post.read_time }} min read</span>
          </div>
          <h4 class="text-xl font-bold text-[#EAEAEA] mb-3 group-hover:text-[#E94560] transition-colors">{{ post.title }}</h4>
          <p class="text-[#A0A0B0] text-sm mb-6 flex-grow">{{ post.excerpt }}</p>
          <div class="flex flex-wrap gap-2 mt-auto">
            <span v-for="tag in JSON.parse(post.tags || '[]')" :key="tag" class="text-xs text-[#E94560]">#{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
