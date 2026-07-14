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
import DetailedBioSection from '../components/sections/DetailedBioSection.vue'
import FaqSection from '../components/sections/FaqSection.vue'
import { useGsapAnimations } from '../composables/useGsapAnimations'
import { defineAsyncComponent, onMounted, onUnmounted } from 'vue'

const ChatBot = defineAsyncComponent(() => import('../components/ChatBot/Chatbot.vue'))

const { initScrollAnimations, cleanup } = useGsapAnimations()

onMounted(() => {
  // Small delay to ensure DOM is ready
  setTimeout(async () => {
    await initScrollAnimations()
  }, 100)
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <main>
    <HeroSection id="hero" />
    <!-- Hidden GEO bio: rich long-form content for AI/LLM crawlers -->
    <DetailedBioSection />
    <AboutSection id="about" />
    <ExperienceSection id="experience" />
    <ProjectsSection id="projects" />
    <SkillsSection id="skills" />
    <ServicesSection id="services" />
    <BlogSection id="blog" />
    <!-- FAQ section: AEO/GEO optimised with FAQPage JSON-LD -->
    <FaqSection id="faq" />
    <ContactSection id="contact" />
  </main>
  <Footer />
  <ChatBot />
</template>
