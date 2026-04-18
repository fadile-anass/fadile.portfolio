<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'

const route = useRoute()
const router = useRouter()
const { fetchBlogPostBySlug, fetchReactions, addReaction, fetchComments, addComment } = useApi()

const post = ref(null)
const loading = ref(true)
const error = ref(null)
const relatedPosts = ref([])

// Reactions & Comments state
const reactions = ref({})
const comments = ref([])
const commentForm = ref({ name: '', content: '' })
const submittingComment = ref(false)
const commentError = ref('')
const commentSuccess = ref(false)

// Reading progress
const readingProgress = ref(0)
const articleRef = ref(null)

// Table of Contents
const tocItems = ref([])
const activeHeading = ref('')

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function parseToc(htmlContent) {
  const div = document.createElement('div')
  div.innerHTML = htmlContent
  const headings = div.querySelectorAll('h2, h3')
  return Array.from(headings).map((h, i) => {
    const id = `heading-${i}`
    return { id, text: h.textContent, level: h.tagName }
  })
}

function injectHeadingIds(htmlContent) {
  let i = 0
  return htmlContent.replace(/<(h[23])>/g, (match, tag) => {
    return `<${tag} id="heading-${i++}">`
  })
}

function scrollToHeading(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Scroll handler: reading progress + active heading
function onScroll() {
  // Progress bar
  const article = articleRef.value
  if (article) {
    const top = article.getBoundingClientRect().top
    const bottom = article.getBoundingClientRect().bottom
    const viewH = window.innerHeight
    const total = bottom - top - viewH
    const scrolled = Math.max(0, -top)
    readingProgress.value = Math.min(100, total > 0 ? (scrolled / total) * 100 : 100)
  }
  // Active heading
  for (const item of [...tocItems.value].reverse()) {
    const el = document.getElementById(item.id)
    if (el && el.getBoundingClientRect().top <= 120) {
      activeHeading.value = item.id
      break
    }
  }
}

// Copy link
const copied = ref(false)
function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function shareTwitter() {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(post.value?.title || '')
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
}

function shareLinkedIn() {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
}

onMounted(async () => {
  const slug = route.params.slug
  const { data, error: apiError } = await fetchBlogPostBySlug(slug)

  if (data.value) {
    const raw = data.value
    relatedPosts.value = raw.relatedPosts || []
    post.value = {
      ...raw,
      content: injectHeadingIds(raw.content || '')
    }
    await nextTick()
    tocItems.value = parseToc(post.value.content)
    if (tocItems.value.length) activeHeading.value = tocItems.value[0].id
    
    await loadInteractions(slug)
  } else {
    error.value = apiError.value || 'Blog post not found'
  }
  loading.value = false

  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// Interaction methods
async function loadInteractions(slug) {
  const [reactionsRes, commentsRes] = await Promise.all([
    fetchReactions(slug),
    fetchComments(slug)
  ])
  if (reactionsRes.data?.value) reactions.value = reactionsRes.data.value
  if (commentsRes.data?.value) comments.value = commentsRes.data.value
}

async function toggleReaction(emoji) {
  if (!post.value) return
  // Optimistically update could go here
  const { data } = await addReaction(post.value.slug, emoji)
  if (data.value) reactions.value = data.value
}

async function submitComment() {
  if (!post.value) return
  commentError.value = ''
  
  if (commentForm.value.name.trim().length < 2) return commentError.value = 'Name must be at least 2 characters.'
  if (commentForm.value.content.trim().length < 5) return commentError.value = 'Comment must be at least 5 characters.'
  
  submittingComment.value = true
  const { data, error: apiError } = await addComment(post.value.slug, { 
    author_name: commentForm.value.name, 
    content: commentForm.value.content 
  })
  submittingComment.value = false
  
  if (apiError.value) {
    commentError.value = apiError.value
  } else if (data.value) {
    comments.value = data.value
    commentForm.value.name = ''
    commentForm.value.content = ''
    commentSuccess.value = true
    setTimeout(() => commentSuccess.value = false, 3000)
  }
}
</script>

<template>
  <!-- Reading Progress Bar -->
  <div class="fixed top-0 left-0 z-50 h-[3px] bg-gradient-to-r from-[#E94560] to-[#FF6B6B] transition-all duration-100 ease-linear" :style="{ width: readingProgress + '%' }"></div>

  <div class="min-h-screen pt-24 pb-16">
    <div class="px-6 max-w-7xl mx-auto">

      <!-- Back button -->
      <button @click="router.back()" class="mb-10 text-[#A0A0B0] hover:text-[#E94560] transition-colors flex items-center gap-2 group">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        Back to blog
      </button>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-[#E94560] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[#A0A0B0]">Loading post content...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <h2 class="text-2xl font-bold text-[#E94560] mb-4">{{ error }}</h2>
        <button @click="router.push('/#blog')" class="text-[#A0A0B0] hover:underline">Return to home</button>
      </div>

      <!-- Article + Sidebar Layout -->
      <div v-else-if="post" class="flex gap-12 xl:gap-16 animate-fade-in">

        <!-- Main Article -->
        <article ref="articleRef" class="flex-1 min-w-0">

          <!-- Header -->
          <header class="mb-10">
            <div class="flex flex-wrap items-center gap-2 mb-5">
              <span v-for="tag in JSON.parse(post.tags || '[]')" :key="tag" class="px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#E94560] bg-[#E94560]/10 border border-[#E94560]/20 rounded-full">
                #{{ tag }}
              </span>
            </div>
            <h1 class="text-4xl md:text-5xl font-black text-[#EAEAEA] mb-6 leading-tight tracking-tight">{{ post.title }}</h1>
            <div class="flex flex-wrap items-center gap-5 text-sm text-[#606070]">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-[#E94560] to-[#FF6B6B] flex items-center justify-center text-white font-black text-sm">AF</div>
                <div>
                  <div class="text-[#EAEAEA] font-semibold text-sm">Anass Fadile</div>
                  <div class="text-[#606070] text-xs">Full Stack Developer</div>
                </div>
              </div>
              <span class="w-px h-8 bg-[#1A1A2E]"></span>
              <time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
              <span v-if="post.read_time" class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ post.read_time }} min read
              </span>
            </div>
          </header>

          <!-- Cover Image -->
          <div class="relative w-full rounded-2xl mb-12 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[#1A1A2E] aspect-video bg-[#16213E]">
            <img v-if="post.cover_image" :src="post.cover_image" :alt="post.title" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-center p-12 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#E94560]/20">
              <span class="text-5xl md:text-7xl font-black text-white/5 select-none uppercase tracking-tighter leading-none italic">
                {{ post.title }}
              </span>
            </div>
          </div>

          <!-- Excerpt (lead) -->
          <p class="text-xl text-[#B0B0C0] leading-relaxed mb-8 font-medium border-l-4 border-[#E94560] pl-6 italic">
            {{ post.excerpt }}
          </p>
          <div class="h-px bg-[#1A1A2E] w-full mb-10"></div>

          <!-- Article Content (HTML rendered) -->
          <div class="prose-blog" v-html="post.content"></div>

          <!-- Reactions Section -->
          <div class="mt-16 bg-[#16213E]/50 border border-[#1A1A2E] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <h3 class="text-xl font-bold text-[#EAEAEA]">What do you think?</h3>
            <div class="flex flex-wrap items-center justify-center gap-3">
              <button
                v-for="emoji in ['🔥', '❤️', '👏', '💡', '🚀', '👀']"
                :key="emoji"
                @click="toggleReaction(emoji)"
                class="flex items-center gap-2 px-3 py-2 bg-[#0F0F1A] border border-[#1A1A2E] hover:border-[#E94560]/50 hover:bg-[#1A1A2E] rounded-xl transition-all duration-200 hover:-translate-y-1 active:scale-95 group"
              >
                <span class="text-xl group-hover:scale-125 transition-transform">{{ emoji }}</span>
                <span class="text-sm font-semibold text-[#A0A0B0] group-hover:text-[#EAEAEA]">{{ reactions[emoji] || 0 }}</span>
              </button>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="mt-12">
            <h3 class="text-2xl font-black text-[#EAEAEA] mb-8">Comments ({{ comments.length }})</h3>
            
            <!-- Comment Form -->
            <form @submit.prevent="submitComment" class="bg-[#16213E] border border-[#1A1A2E] rounded-2xl p-6 md:p-8 mb-10 shadow-lg">
              <div v-if="commentSuccess" class="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-medium">
                Your comment has been added successfully!
              </div>
              <div v-if="commentError" class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                {{ commentError }}
              </div>
              
              <div class="grid gap-6">
                <div>
                  <label class="block text-sm font-medium text-[#A0A0B0] mb-2">Display Name</label>
                  <input v-model="commentForm.name" type="text" placeholder="John Doe" class="w-full bg-[#0F0F1A] border border-[#1A1A2E] focus:border-[#E94560] text-[#EAEAEA] rounded-xl px-4 py-3 outline-none transition-colors" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#A0A0B0] mb-2">Comment</label>
                  <textarea v-model="commentForm.content" rows="4" placeholder="Share your thoughts..." class="w-full bg-[#0F0F1A] border border-[#1A1A2E] focus:border-[#E94560] text-[#EAEAEA] rounded-xl px-4 py-3 outline-none transition-colors resize-y"></textarea>
                </div>
                <div class="flex justify-end">
                  <button type="submit" :disabled="submittingComment" class="px-6 py-3 bg-[#E94560] hover:bg-[#FF6B6B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#E94560]/20 flex items-center gap-2">
                    <span v-if="submittingComment" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {{ submittingComment ? 'Posting...' : 'Post Comment' }}
                  </button>
                </div>
              </div>
            </form>

            <!-- Comments List -->
            <div class="space-y-6">
              <div v-if="comments.length === 0" class="text-center py-10 text-[#A0A0B0] bg-[#16213E]/30 rounded-2xl border border-[#1A1A2E]/50 border-dashed">
                Be the first to share your thoughts!
              </div>
              
              <div v-for="comment in comments" :key="comment.id" class="flex gap-4 md:gap-6 bg-[#16213E]/50 border border-[#1A1A2E] rounded-2xl p-6">
                <!-- Avatar -->
                <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1A1A2E] to-[#2A2A3E] border border-[#2A2A3E] flex items-center justify-center text-[#EAEAEA] font-bold text-lg shrink-0 overflow-hidden">
                  {{ comment.author_name.charAt(0).toUpperCase() }}
                </div>
                <!-- Content -->
                <div class="flex-grow">
                  <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                    <h4 class="font-bold text-[#EAEAEA] text-lg">{{ comment.author_name }}</h4>
                    <span class="text-xs text-[#606070]">{{ formatDate(comment.created_at) }}</span>
                  </div>
                  <p class="text-[#A0A0B0] leading-relaxed whitespace-pre-line">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Share + Footer -->
          <div class="mt-16 pt-10 border-t border-[#1A1A2E]">
            <!-- Social Share -->
            <div class="mb-10">
              <p class="text-xs uppercase tracking-widest text-[#606070] font-semibold mb-4">Share this post</p>
              <div class="flex items-center gap-3">
                <button @click="shareTwitter" class="flex items-center gap-2 px-4 py-2 bg-[#16213E] border border-[#1A1A2E] hover:border-[#E94560]/40 text-[#A0A0B0] hover:text-[#E94560] rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X / Twitter
                </button>
                <button @click="shareLinkedIn" class="flex items-center gap-2 px-4 py-2 bg-[#16213E] border border-[#1A1A2E] hover:border-[#E94560]/40 text-[#A0A0B0] hover:text-[#E94560] rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  LinkedIn
                </button>
                <button @click="copyLink" class="flex items-center gap-2 px-4 py-2 bg-[#16213E] border border-[#1A1A2E] hover:border-[#E94560]/40 text-[#A0A0B0] hover:text-[#E94560] rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  {{ copied ? 'Copied!' : 'Copy Link' }}
                </button>
              </div>
            </div>

            <!-- Author card -->
            <div class="flex items-center justify-between p-6 bg-[#16213E] rounded-2xl border border-[#1A1A2E]">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E94560] to-[#FF6B6B] flex items-center justify-center text-white font-black text-xl shrink-0">AF</div>
                <div>
                  <div class="text-[#EAEAEA] font-bold text-lg">Anass Fadile</div>
                  <div class="text-sm text-[#606070]">Full Stack Developer — Vue.js, Node.js, Laravel</div>
                </div>
              </div>
              <button @click="router.push('/#contact')" class="hidden sm:block px-5 py-2 bg-transparent text-[#E94560] border border-[#E94560]/30 rounded-xl hover:bg-[#E94560]/10 transition-all font-medium text-sm">
                Let's talk
              </button>
            </div>
          </div>

          <!-- Related Posts -->
          <div v-if="relatedPosts.length > 0" class="mt-16">
            <h2 class="text-2xl font-black text-[#EAEAEA] mb-8">Related Articles</h2>
            <div class="grid sm:grid-cols-2 gap-6">
              <div
                v-for="rp in relatedPosts"
                :key="rp.id"
                @click="router.push({ name: 'blog-detail', params: { slug: rp.slug } })"
                class="group bg-[#16213E] rounded-2xl overflow-hidden border border-[#1A1A2E] hover:border-[#E94560]/40 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] flex flex-col"
              >
                <div class="aspect-video overflow-hidden bg-[#0F0F1A] relative">
                  <img v-if="rp.cover_image" :src="rp.cover_image" :alt="rp.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div 
                    v-else 
                    class="w-full h-full flex items-center justify-center text-center p-4 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#E94560]/10"
                  >
                    <span class="text-lg font-black text-white/5 select-none uppercase tracking-tighter leading-tight italic">
                      {{ rp.title }}
                    </span>
                  </div>
                </div>
                <div class="p-5 flex flex-col flex-grow">
                  <div class="flex flex-wrap gap-1 mb-3">
                    <span v-for="tag in JSON.parse(rp.tags || '[]')" :key="tag" class="text-[9px] uppercase tracking-wider text-[#E94560] bg-[#E94560]/10 px-2 py-0.5 rounded border border-[#E94560]/10">{{ tag }}</span>
                  </div>
                  <h4 class="font-bold text-[#EAEAEA] group-hover:text-[#E94560] transition-colors leading-snug mb-2 flex-grow">{{ rp.title }}</h4>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-[#606070]">{{ rp.read_time }} min read</span>
                    <span class="text-xs text-[#E94560] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </article>

        <!-- Sticky ToC Sidebar (large screens) -->
        <aside v-if="tocItems.length > 0" class="hidden xl:block w-64 shrink-0">
          <div class="sticky top-28">
            <p class="text-xs uppercase tracking-widest text-[#606070] font-semibold mb-4">On this page</p>
            <nav class="space-y-1">
              <button
                v-for="item in tocItems"
                :key="item.id"
                @click="scrollToHeading(item.id)"
                :class="[
                  'block w-full text-left text-sm py-1.5 border-l-2 transition-all duration-200',
                  item.level === 'H3' ? 'pl-6' : 'pl-4',
                  activeHeading === item.id
                    ? 'border-[#E94560] text-[#EAEAEA] font-semibold'
                    : 'border-[#1A1A2E] text-[#606070] hover:text-[#A0A0B0] hover:border-[#E94560]/40'
                ]"
              >{{ item.text }}</button>
            </nav>
          </div>
        </aside>

      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Blog Article Typography */
:deep(.prose-blog h2) {
  font-size: 1.75rem;
  font-weight: 800;
  color: #EAEAEA;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.25;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #1A1A2E;
}
:deep(.prose-blog h3) {
  font-size: 1.25rem;
  font-weight: 700;
  color: #EAEAEA;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  line-height: 1.35;
}
:deep(.prose-blog p) {
  color: #C0C0D0;
  line-height: 1.85;
  margin-bottom: 1.25rem;
  font-size: 1.05rem;
}
:deep(.prose-blog strong) {
  color: #EAEAEA;
  font-weight: 700;
}
:deep(.prose-blog ul),
:deep(.prose-blog ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
  color: #C0C0D0;
  line-height: 1.85;
}
:deep(.prose-blog li) {
  margin-bottom: 0.4rem;
}
:deep(.prose-blog ul li) {
  list-style-type: none;
  position: relative;
  padding-left: 0.5rem;
}
:deep(.prose-blog ul li::before) {
  content: '▸';
  color: #E94560;
  position: absolute;
  left: -1rem;
  font-size: 0.8rem;
  top: 0.05rem;
}
:deep(.prose-blog a) {
  color: #E94560;
  text-decoration: underline;
  text-decoration-color: #E94560/40;
  text-underline-offset: 3px;
}
:deep(.prose-blog a:hover) {
  text-decoration-color: #E94560;
}
:deep(.prose-blog code) {
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.88em;
  background: #1A1A2E;
  border: 1px solid #2A2A3E;
  color: #E94560;
  padding: 0.15em 0.45em;
  border-radius: 5px;
}
:deep(.prose-blog pre) {
  background: #0D0D1A;
  border: 1px solid #1A1A2E;
  border-radius: 14px;
  padding: 1.5rem;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
  position: relative;
}
:deep(.prose-blog pre code) {
  background: transparent;
  border: none;
  color: #A0D8EF;
  padding: 0;
  font-size: 0.9rem;
  line-height: 1.7;
}
:deep(.prose-blog blockquote) {
  border-left: 4px solid #E94560;
  padding-left: 1.25rem;
  margin-left: 0;
  color: #909090;
  font-style: italic;
  font-size: 1.1rem;
}
</style>
