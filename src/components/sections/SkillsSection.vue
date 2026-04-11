<script setup>
import { ref, onMounted } from 'vue'
import SectionTitle from '../ui/SectionTitle.vue'
import { useApi } from '../../composables/useApi'
import { Code, Layout, Server, Database, Wrench } from 'lucide-vue-next'

const { fetchSkills } = useApi()
const skills = ref({ frontend: [], backend: [], database: [], tools: [] })
const loading = ref(true)

onMounted(async () => {
  const { data } = await fetchSkills()
  if (data.value) {
    skills.value = data.value
  }
  loading.value = false
})

const getSkillIcon = (name) => {
  const map = {
    'HTML': 'html5/html5-original.svg',
    'CSS': 'css3/css3-original.svg',
    'JavaScript': 'javascript/javascript-original.svg',
    'Tailwind': 'tailwindcss/tailwindcss-original.svg',
    'Bootstrap': 'bootstrap/bootstrap-original.svg',
    'React': 'react/react-original.svg',
    'Vue.js': 'vuejs/vuejs-original.svg',
    'Laravel': 'laravel/laravel-original.svg',
    'Express.js': 'express/express-original.svg',
    'Node.js': 'nodejs/nodejs-original.svg',
    'MySQL': 'mysql/mysql-original.svg',
    'MongoDB': 'mongodb/mongodb-original.svg',
    'Git/GitHub': 'github/github-original.svg',
    'PHP': 'php/php-original.svg',
    'Docker': 'docker/docker-original.svg',
    'Linux': 'linux/linux-original.svg'
  }
  if (map[name]) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${map[name]}`
  }
  return null
}

const needsInvert = (name) => ['Express.js', 'Git/GitHub'].includes(name)

const getCategoryIcon = (category) => {
  switch(category) {
    case 'frontend': return Layout;
    case 'backend': return Server;
    case 'database': return Database;
    case 'tools': return Wrench;
    default: return Code;
  }
}
</script>

<template>
  <section class="py-24 px-6 max-w-7xl mx-auto">
    <SectionTitle number="04" subtitle="My technical toolkit" title="Skills" />
    
    <div v-if="loading" class="text-center text-[#A0A0B0]">Loading skills...</div>
    
    <div v-else class="space-y-20">
      <div v-for="(categorySkills, categoryName) in skills" :key="categoryName">
        <h4 class="text-2xl font-bold text-[#EAEAEA] mb-8 capitalize flex items-center gap-3">
          <component :is="getCategoryIcon(categoryName)" class="w-6 h-6 text-[#E94560]" />
          {{ categoryName }}
        </h4>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6" style="perspective: 1000px;">
          <div 
            v-for="skill in categorySkills" 
            :key="skill.id" 
            class="skill-card-3d group relative flex flex-col items-center justify-center p-6 rounded-3xl cursor-pointer"
          >
            <div class="skill-card-content flex flex-col items-center justify-center w-full h-full">
              <div class="w-16 h-16 mb-4 flex items-center justify-center icon-wrapper">
                <img 
                  v-if="getSkillIcon(skill.name)" 
                  :src="getSkillIcon(skill.name)" 
                  :alt="skill.name"
                  class="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                  :class="{ 'invert opacity-90': needsInvert(skill.name) }"
                />
                <Code v-else class="w-10 h-10 text-[#E94560] drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span class="text-[#A0A0B0] group-hover:text-[#EAEAEA] font-semibold text-sm text-center transition-colors tracking-wide">{{ skill.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skill-card-3d {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.skill-card-3d::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 0%, rgba(233, 69, 96, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.skill-card-3d:hover {
  transform: translateY(-10px) rotateX(10deg) rotateY(-10deg);
  box-shadow: 
    15px 20px 30px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(233, 69, 96, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  border-color: rgba(233, 69, 96, 0.3);
}

.skill-card-3d:hover::before {
  opacity: 1;
}

.skill-card-content {
  transform: translateZ(20px);
  transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.skill-card-3d:hover .skill-card-content {
  transform: translateZ(40px);
}

.icon-wrapper img, .icon-wrapper svg {
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
}
</style>
