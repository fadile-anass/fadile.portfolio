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
  <div
    class="profile-portrait group relative w-72 h-72 md:w-80 md:h-80"
  >
    <!-- Dark background with subtle red glow -->
    <div
      class="absolute inset-0 rounded-full
             bg-[#0D0D17]
             shadow-[0_0_80px_rgba(233,69,96,0.12)]
             transition-all duration-500
             group-hover:shadow-[0_0_100px_rgba(233,69,96,0.25)]"
    ></div>

    <!-- Gradient circular border -->
    <div
      class="absolute inset-0 rounded-full
             border-[3px] border-transparent
             bg-gradient-to-br from-[#2B2B40] via-[#E94560] to-[#2B2B40]
             [background-origin:border-box]
             [background-clip:border-box]
             transition-transform duration-700
             group-hover:rotate-6"
    ></div>

    <!-- Inner dark circle -->
    <div
      class="absolute inset-[3px] rounded-full
             overflow-hidden bg-[#0D0D17]"
    >
      <!-- Red atmospheric glow -->
      <div
        class="absolute inset-0
               bg-[radial-gradient(ellipse_at_50%_65%,rgba(233,69,96,0.22),transparent_65%)]"
      ></div>

      <!-- Transparent portrait -->
      <img
        :src="profileImage"
        alt="Fadile Anass"
        loading="lazy"
        decoding="async"
        class="relative z-10 w-full h-full
               object-contain object-bottom
               transition-transform duration-700
               group-hover:scale-[1.04]"
      />
    </div>

    <!-- Outer decorative ring -->
    <div
      class="absolute -inset-3 rounded-full
             border border-[#252538]
             pointer-events-none
             transition-colors duration-500
             group-hover:border-[rgba(233,69,96,0.35)]"
    ></div>

    <!-- Small red accent -->
    <div
      class="absolute top-[18%] right-[12%]
             w-3 h-3 rounded-full
             bg-[#E94560]
             shadow-[0_0_20px_rgba(233,69,96,0.8)]"
    ></div>
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
        
        <h3 class="text-xl font-bold text-[#EAEAEA] mb-4">Education</h3>
        <div class="space-y-4 mb-8">
          <TimelineItem 
            title="ESTEM" 
            subtitle="2023 - 2024" 
            description="Advanced studies in Information Technology and Management."
            headingTag="h4"
          />
          <TimelineItem 
            title="CFPM Sidi Moumen" 
            subtitle="2021 - 2023" 
            description="Foundation in software development and computer science."
            headingTag="h4"
          />
        </div>
        
        <h3 class="text-xl font-bold text-[#EAEAEA] mb-4">Soft Skills</h3>
        <div class="flex flex-wrap gap-2 mb-8">
          <span v-for="skill in soft_skills" :key="skill" class="px-4 py-2 bg-[#16213E] text-[#EAEAEA] text-sm rounded-lg border border-[rgba(233,69,96,0.1)]">
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
