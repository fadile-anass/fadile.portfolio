<script setup>
import HeroSection from '../components/sections/HeroSection.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import ExperienceSection from '../components/sections/ExperienceSection.vue'
import ProjectsSection from '../components/sections/ProjectsSection.vue'
import SkillsSection from '../components/sections/SkillsSection.vue'
import ServicesSection from '../components/sections/ServicesSection.vue'
import BlogSection from '../components/sections/BlogSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import Footer from '../components/layout/Footer.vue'
import ChatBot from '../components/ChatBot/Chatbot.vue'
import { useGsapAnimations } from '../composables/useGsapAnimations'
import { onMounted, onUnmounted } from 'vue'

const { initScrollAnimations, cleanup } = useGsapAnimations()

onMounted(() => {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    initScrollAnimations()
  }, 100)
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <main>
    <HeroSection id="hero" />
    <AboutSection id="about" />
    <ExperienceSection id="experience" />
    <ProjectsSection id="projects" />
    <SkillsSection id="skills" />
    <ServicesSection id="services" />
    <BlogSection id="blog" />
    <ContactSection id="contact" />
  </main>
  <Footer />
  <ChatBot />
</template>
