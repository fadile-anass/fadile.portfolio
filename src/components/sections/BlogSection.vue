<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SectionTitle from '../ui/SectionTitle.vue'
import { useApi } from '../../composables/useApi'

const router = useRouter()
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

const featuredPost = computed(() => posts.value[0] || null)
const gridPosts = computed(() => posts.value.slice(1, 4))

const navigateToPost = (slug) => {
  router.push({ name: 'blog-detail', params: { slug } })
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <section id="blog" class="py-24 px-6 max-w-7xl mx-auto">
    <SectionTitle number="06" subtitle="My thoughts and learnings" title="Blog" />

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 flex flex-col items-center gap-4">
      <div class="w-10 h-10 border-[3px] border-[#E94560] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[#A0A0B0]">Fetching thoughts...</p>
    </div>

    <template v-else-if="posts.length === 0">
      <!-- Placeholders -->
      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="bg-[#16213E] rounded-2xl overflow-hidden border border-[#1A1A2E] relative shadow-lg">
          <div class="absolute top-4 right-4 bg-[#E94560] text-white text-xs font-bold px-3 py-1 rounded-full z-10">Coming Soon</div>
          <div class="aspect-video bg-[#0F0F1A] w-full"></div>
          <div class="p-6">
            <div class="h-4 bg-[#1A1A2E] rounded w-1/4 mb-4 animate-pulse"></div>
            <div class="h-6 bg-[#1A1A2E] rounded w-3/4 mb-4 animate-pulse delay-75"></div>
            <div class="h-4 bg-[#1A1A2E] rounded w-full mb-2 animate-pulse delay-150"></div>
            <div class="h-4 bg-[#1A1A2E] rounded w-2/3 animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>

      <!-- Featured Hero Post -->
      <div
        v-if="featuredPost"
        @click="navigateToPost(featuredPost.slug)"
        class="group relative w-full rounded-3xl overflow-hidden border border-[#1A1A2E] hover:border-[#E94560]/40 transition-all duration-500 cursor-pointer mb-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_80px_rgba(233,69,96,0.15)] hover:-translate-y-1 blog-hero-card"
      >
        <!-- Background Image -->
        <div class="relative h-[420px] md:h-[480px] overflow-hidden">
          <img
            v-if="featuredPost.cover_image"
            :src="featuredPost.cover_image"
            :alt="featuredPost.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div 
            v-else 
            class="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#E94560]/20 flex items-center justify-center p-12 text-center"
          >
            <span class="text-4xl md:text-5xl font-black text-white/10 select-none uppercase tracking-tighter leading-none italic">
              {{ featuredPost.title }}
            </span>
          </div>
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-[#0F0F1A]/70 to-transparent"></div>
        </div>

        <!-- Content overlaid on image -->
        <div class="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <!-- Featured badge -->
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-[#E94560] text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
              ✦ Latest Post
            </span>
          </div>
          <h3 class="text-3xl md:text-4xl font-black text-[#EAEAEA] mb-3 leading-tight group-hover:text-white transition-colors max-w-3xl">
            {{ featuredPost.title }}
          </h3>
          <p class="text-[#A0A0B0] text-base md:text-lg max-w-2xl mb-5 leading-relaxed line-clamp-2">
            {{ featuredPost.excerpt }}
          </p>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 text-xs text-[#606070]">
              <span class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                {{ formatDate(featuredPost.created_at) }}
              </span>
              <span v-if="featuredPost.read_time" class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ featuredPost.read_time }} min read
              </span>
              <div class="flex gap-1.5">
                <span v-for="tag in JSON.parse(featuredPost.tags || '[]')" :key="tag" class="px-2 py-0.5 bg-[#E94560]/15 text-[#E94560] border border-[#E94560]/20 rounded-md text-[10px] uppercase tracking-wider">{{ tag }}</span>
              </div>
            </div>
            <span class="flex items-center gap-2 text-[#E94560] font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              Read Article
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </div>

      <!-- Grid Posts -->
      <div v-if="gridPosts.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(post, index) in gridPosts"
          :key="post.id"
          @click="navigateToPost(post.slug)"
          :style="{ animationDelay: `${index * 0.1}s` }"
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

      <!-- View All Button -->
      <div class="mt-14 text-center">
        <router-link
          to="/blog"
          class="inline-flex items-center gap-2 px-8 py-4 bg-[#16213E] text-[#EAEAEA] font-bold rounded-xl border border-[#1A1A2E] hover:border-[#E94560]/50 hover:bg-[#1A1A2E] hover:text-[#E94560] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(233,69,96,0.15)] group"
        >
          View All Posts
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </router-link>
      </div>
    </template>
  </section>
</template>

<style scoped>
.blog-hero-card {
  animation: fadeInUp 0.6s ease-out forwards;
}
.blog-card {
  animation: fadeInUp 0.5s ease-out both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
