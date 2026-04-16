<script setup>
import SectionTitle from '../ui/SectionTitle.vue'
import TimelineItem from '../ui/TimelineItem.vue'
import profileImage from '../../assets/images/about_photo.png';


const soft_skills = [
    "Problem Solving",
    "Self-Learning",
    "Adaptability",
    "Attention to Detail",
    "Communication",
    "Creativity",
    "Initiative",
    "Time Management",
    "Growth Mindset",
    "User-Centric Thinking",
    "Collaboration Readiness",
    "Persistence"
  ]
</script>

<template>
  <section class="py-24 px-6 max-w-7xl mx-auto">
    <SectionTitle number="01" subtitle="Get to know me" title="About Me" />
    
    <div class="grid md:grid-cols-12 gap-12 items-center">
      <div class="md:col-span-5 flex justify-center">
        <div class="relative w-64 h-64 rounded-full p-2 group">
          <div class="absolute inset-0 rounded-full border-2 border-[#1A1A2E] transition-colors duration-300 group-hover:border-[#E94560]"></div>
          <div class="w-full h-full rounded-full overflow-hidden bg-[#16213E]">
            <img :src="profileImage" alt="Fadile Anass" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
        </div>
      </div>
      
      <div class="md:col-span-7">
        <div class="prose prose-invert max-w-none text-[#A0A0B0]">
          <p class="mb-4">
            Hello! I'm Fadile Anass, a passionate Full Stack Developer and Business Developer based in Casablanca, Morocco. I enjoy bridging the gap between technical implementation and business strategy.
          </p>
          <p class="mb-4">
            My journey in tech started with a deep curiosity for how things work on the web, which led me to master modern frameworks like Vue.js and Node.js. I don't just write code; I build solutions that drive growth and efficiency.
          </p>
          <p class="mb-8">
            Currently, my goal is to leverage my dual expertise to create impactful digital products while continuously expanding my knowledge in 3D web experiences and scalable architectures.
          </p>
        </div>
        
        <h4 class="text-xl font-bold text-[#EAEAEA] mb-4">Education</h4>
        <div class="space-y-4 mb-8">
          <TimelineItem 
            title="ESTEM" 
            subtitle="2023 - 2024" 
            description="Advanced studies in Information Technology and Management."
          />
          <TimelineItem 
            title="CFPM Sidi Moumen" 
            subtitle="2021 - 2023" 
            description="Foundation in software development and computer science."
          />
        </div>
        
        <h4 class="text-xl font-bold text-[#EAEAEA] mb-4">Soft Skills</h4>
        <div class="flex flex-wrap gap-2 mb-8">
          <span v-for="skill in soft_skills" :key="skill" class="px-4 py-2 bg-[#16213E] text-[#EAEAEA] text-sm rounded-lg border border-[rgba(233,69,96,0.1)]">
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
