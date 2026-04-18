<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'

const router = useRouter()
const { fetchBlogPosts } = useApi()

const posts = ref([])
const loading = ref(true)
const activeTag = ref('All')
const searchQuery = ref('')
const sortOrder = ref('newest')

onMounted(async () => {
  const { data } = await fetchBlogPosts()
  if (data.value) {
    posts.value = data.value
  }
  loading.value = false
})

const allTags = computed(() => {
  const tagSet = new Set(['All'])
  posts.value.forEach(p => {
    JSON.parse(p.tags || '[]').forEach(t => tagSet.add(t))
  })
  return [...tagSet]
})

const filteredPosts = computed(() => {
  let result = posts.value

  if (activeTag.value !== 'All') {
    result = result.filter(p => JSON.parse(p.tags || '[]').includes(activeTag.value))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.excerpt && p.excerpt.toLowerCase().includes(q))
    )
  }

  // API returns newest first by default
  if (sortOrder.value === 'oldest') {
    result = [...result].reverse()
  }

  return result
})

const navigateToPost = (slug) => {
  router.push({ name: 'blog-detail', params: { slug } })
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-12">
      <button @click="router.push('/')" class="mb-8 text-[#A0A0B0] hover:text-[#E94560] transition-colors flex items-center gap-2 group">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        Back to Home
      </button>
      <h1 class="text-4xl md:text-5xl font-black text-[#EAEAEA] mb-4">The Blog</h1>
      <p class="text-xl text-[#A0A0B0] max-w-2xl">Thoughts, learnings, and experiences in web development.</p>
    </div>

    <!-- Filters & Search -->
    <div class="bg-[#16213E] border border-[#1A1A2E] rounded-2xl p-6 mb-12 shadow-lg flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
      <!-- Search focus -->
      <div class="relative w-full lg:w-80 shrink-0">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0A0B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search posts..." 
          class="w-full bg-[#0F0F1A] border border-[#1A1A2E] focus:border-[#E94560] text-[#EAEAEA] rounded-xl py-3 pl-11 pr-4 outline-none transition-colors"
        />
      </div>

      <!-- Tag Filters -->
      <div class="flex flex-wrap gap-2 flex-grow overflow-x-auto pb-1 hide-scrollbar">
        <button
          v-for="tag in allTags"
          :key="tag"
          @click="activeTag = tag"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap',
            activeTag === tag
              ? 'bg-[#E94560] text-white shadow-lg shadow-[#E94560]/30 border border-[#E94560]'
              : 'bg-[#0F0F1A] text-[#A0A0B0] border border-[#1A1A2E] hover:border-[#E94560]/40 hover:text-[#E94560]'
          ]"
        >{{ tag }}</button>
      </div>

      <!-- Sort -->
      <div class="shrink-0 flex items-center gap-3">
        <span class="text-sm text-[#606070] font-medium hidden lg:inline">Sort:</span>
        <select 
          v-model="sortOrder"
          class="bg-[#0F0F1A] text-[#EAEAEA] border border-[#1A1A2E] focus:border-[#E94560] rounded-xl px-4 py-3 outline-none appearance-none pr-8 cursor-pointer relative"
          style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23A0A0B0%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 8px center; background-size: 16px;"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 flex flex-col items-center gap-4">
      <div class="w-10 h-10 border-[3px] border-[#E94560] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[#A0A0B0]">Fetching thoughts...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPosts.length === 0" class="text-center py-20 bg-[#16213E] rounded-2xl border border-[#1A1A2E]">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E94560" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 opacity-50"><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>
      <h3 class="text-2xl font-bold text-[#EAEAEA] mb-2">No posts found</h3>
      <p class="text-[#A0A0B0]">Try adjusting your search or filters.</p>
      <button @click="searchQuery = ''; activeTag = 'All'" class="mt-6 text-[#E94560] hover:underline">Clear filters</button>
    </div>

    <!-- Post Grid -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="(post, index) in filteredPosts"
        :key="post.id"
        @click="navigateToPost(post.slug)"
        :style="{ animationDelay: `${(index % 6) * 0.05}s` }"
        class="blog-card bg-[#16213E] rounded-2xl overflow-hidden border border-[#1A1A2E] hover:border-[#E94560]/40 transition-all duration-300 group flex flex-col cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 shadow-sm"
      >
        <div class="aspect-video bg-[#0F0F1A] w-full overflow-hidden relative">
          <img
            v-if="post.cover_image"
            :src="post.cover_image"
            :alt="post.title"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div 
            v-else 
            class="w-full h-full flex items-center justify-center text-center p-6 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#E94560]/10"
          >
            <span class="text-xl font-black text-white/5 select-none uppercase tracking-tighter leading-tight italic">
              {{ post.title }}
            </span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-transparent to-transparent opacity-60"></div>
        </div>
        <div class="p-6 flex flex-col flex-grow relative">
          <div class="flex items-center justify-between text-xs font-medium text-[#606070] mb-4">
            <span class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              {{ formatDate(post.created_at) }}
            </span>
            <span v-if="post.read_time" class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ post.read_time }} min read
            </span>
          </div>
          <h4 class="text-xl font-bold text-[#EAEAEA] mb-3 group-hover:text-[#E94560] transition-colors leading-tight">{{ post.title }}</h4>
          <p class="text-[#A0A0B0] text-sm mb-5 flex-grow leading-relaxed line-clamp-3">{{ post.excerpt }}</p>
          <div class="flex items-center justify-between mt-auto pt-4 border-t border-[#1A1A2E]">
            <div class="flex flex-wrap gap-1.5">
              <span v-for="tag in JSON.parse(post.tags || '[]')" :key="tag" class="text-[10px] uppercase tracking-wider text-[#E94560] bg-[#E94560]/10 px-2.5 py-1 rounded-md border border-[#E94560]/10">
                {{ tag }}
              </span>
            </div>
            <span class="flex items-center gap-1 text-[#E94560] text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 shrink-0 ml-2">
              Read
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-card {
  animation: fadeInUp 0.5s ease-out both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
