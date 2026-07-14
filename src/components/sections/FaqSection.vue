<script setup>
import { ref, onMounted } from 'vue'
import { injectJsonLd } from '../../utils/seo'

const openIndex = ref(null)

const faqs = [
  {
    q: 'What is Anass Fadile\'s main specialisation as a developer?',
    a: 'Anass Fadile specialises in Full Stack Web Development, primarily using Vue.js on the frontend and Laravel or Node.js on the backend. He focuses on building complex, data-driven web applications including dashboards, management systems, SaaS products, and REST APIs.'
  },
  {
    q: 'Can Anass Fadile build a complete web application from scratch?',
    a: 'Yes. Anass handles the entire development lifecycle: requirements analysis, architecture design, frontend and backend development, database modelling, API integration, deployment, and post-launch support. He is a complete end-to-end developer.'
  },
  {
    q: 'What frontend technologies does Anass Fadile use?',
    a: 'Anass primarily uses Vue.js 3 with the Composition API for frontend development. He also works with React, Vite, Tailwind CSS, and vanilla HTML/CSS/JavaScript for lighter projects. He is skilled in building responsive, accessible, and performant interfaces.'
  },
  {
    q: 'What backend technologies does Anass Fadile use?',
    a: 'On the backend, Anass works with Laravel (PHP), Node.js, and Express.js. He designs RESTful APIs, handles authentication (JWT, sessions), and architects scalable server-side logic for both small and enterprise-level applications.'
  },
  {
    q: 'Does Anass Fadile work with databases?',
    a: 'Yes. Anass is experienced with MySQL and MongoDB as primary databases. He also uses SQLite and Turso (libSQL) for lightweight or edge deployments. He handles schema design, query optimisation, and data relationships.'
  },
  {
    q: 'Can Anass Fadile integrate AI or machine learning into a web application?',
    a: 'Yes. Anass integrates AI capabilities into web applications using the OpenAI API and Google Gemini API. He implements RAG (Retrieval-Augmented Generation) pipelines, function calling, and prompt engineering to build intelligent chatbots, assistants, and automation workflows.'
  },
  {
    q: 'What types of projects has Anass Fadile worked on?',
    a: 'Anass has built field distribution tracking systems, travel agency dashboards, event management platforms, healthcare management systems, integrated management systems (for NGOs), and business landing pages. His work spans logistics, healthcare, tourism, and non-profit sectors.'
  },
  {
    q: 'Does Anass Fadile offer SaaS product development?',
    a: 'Yes. Anass can architect and build Software-as-a-Service (SaaS) products from MVP to scalable production systems. This includes multi-tenancy, subscription billing integration, admin panels, user management, and API-first design.'
  },
  {
    q: 'Is Anass Fadile available for freelance or remote work?',
    a: 'Yes. Anass is available for freelance projects, remote work with international clients, and on-site engagements in Morocco. He works with clients from Morocco, Europe, and beyond. You can contact him via the contact section of this portfolio.'
  },
  {
    q: 'How does Anass Fadile approach a new project?',
    a: 'Anass begins every project by deeply understanding the business problem, then designs the system architecture before writing code. He builds iteratively, ships early, collects feedback, and continuously improves. He prioritises clarity, performance, and long-term maintainability.'
  },
  {
    q: 'What makes Anass Fadile different from other developers?',
    a: 'Anass combines technical depth with business understanding. He doesn\'t just write code — he thinks like a product owner. He has experience on both the technical and business sides of development, which allows him to build products that solve real problems rather than over-engineered solutions.'
  },
  {
    q: 'Can Anass Fadile build a landing page or business website?',
    a: 'Yes. Anass builds conversion-focused landing pages and business websites optimised for SEO, performance, and user experience. He uses clean HTML, CSS, and JavaScript (or Vue.js for dynamic pages) and applies best practices for Core Web Vitals and structured data.'
  },
  {
    q: 'Does Anass Fadile help with business automation?',
    a: 'Yes. Anass builds automation workflows that digitalise manual business processes — from automated reporting and notifications to AI-powered document processing and workflow orchestration. He has done this for field operations teams and management systems.'
  },
  {
    q: 'Where is Anass Fadile located?',
    a: 'Anass Fadile is based in Casablanca, Morocco. He works remotely with international clients and is available for on-site work within Morocco.'
  }
]

const toggle = (i) => {
  openIndex.value = openIndex.value === i ? null : i
}

onMounted(() => {
  injectJsonLd('faq', {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  })
})
</script>

<template>
  <section id="faq" class="py-24 px-6 max-w-4xl mx-auto" aria-labelledby="faq-heading">
    <header class="text-center mb-14">
      <p class="text-xs uppercase tracking-[0.3em] text-[#E94560] font-semibold mb-3">Got Questions?</p>
      <h2 id="faq-heading" class="text-4xl md:text-5xl font-black text-[#EAEAEA] tracking-tight">
        Frequently Asked Questions
      </h2>
      <p class="mt-4 text-[#A0A0B0] max-w-xl mx-auto">
        Everything you need to know before working together — from technologies and process to
        availability and pricing.
      </p>
    </header>

    <dl class="space-y-3">
      <div
        v-for="(faq, i) in faqs"
        :key="i"
        class="faq-item bg-[#16213E] border rounded-2xl overflow-hidden transition-all duration-300"
        :class="openIndex === i ? 'border-[#E94560]/40' : 'border-[#1A1A2E] hover:border-[#E94560]/20'"
      >
        <dt>
          <button
            :id="`faq-q-${i}`"
            :aria-expanded="openIndex === i"
            :aria-controls="`faq-a-${i}`"
            class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer group"
            @click="toggle(i)"
          >
            <span class="font-semibold text-[#EAEAEA] text-base leading-snug group-hover:text-[#E94560] transition-colors">
              {{ faq.q }}
            </span>
            <span
              class="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-[#2A2A3E] text-[#E94560] transition-transform duration-300"
              :class="openIndex === i ? 'rotate-45 bg-[#E94560]/10' : ''"
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14"/><path d="M5 12h14"/>
              </svg>
            </span>
          </button>
        </dt>
        <dd
          :id="`faq-a-${i}`"
          :aria-labelledby="`faq-q-${i}`"
          class="answer-panel overflow-hidden transition-all duration-300"
          :class="openIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'"
        >
          <p class="px-6 pb-6 text-[#A0A0B0] leading-relaxed text-sm">
            {{ faq.a }}
          </p>
        </dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.answer-panel {
  will-change: max-height, opacity;
}
</style>
