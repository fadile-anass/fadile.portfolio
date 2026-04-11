<script setup>
import { ref } from 'vue'
import SectionTitle from '../ui/SectionTitle.vue'
import { useApi } from '../../composables/useApi'
import { useToast } from '../../composables/useToast'

const { submitContact } = useApi()
const { showToast } = useToast()

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = ref({})
const isSubmitting = ref(false)

const validateForm = () => {
  errors.value = {}
  let isValid = true
  
  if (!form.value.name || form.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
    isValid = false
  }
  
  const emailRegex = /^\S+@\S+\.\S+$/
  if (!form.value.email || !emailRegex.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (!form.value.message || form.value.message.length < 10) {
    errors.value.message = 'Message must be at least 10 characters'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    const { data, error } = await submitContact(form.value)
    
    if (error.value) {
      // Handle server errors
      if (Array.isArray(error.value)) {
        error.value.forEach(err => {
          showToast(err, 'error')
        })
      } else {
        showToast(error.value, 'error')
      }
    } else if (data.value && data.value.success) {
      showToast('Your message has been sent successfully!', 'success')
      form.value = { name: '', email: '', subject: '', message: '' }
    }
  } catch (err) {
    showToast('An unexpected error occurred.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="py-24 px-6 max-w-7xl mx-auto">
    <SectionTitle number="07" subtitle="What's next?" title="Get In Touch" />
    
    <div class="grid md:grid-cols-2 gap-16 mt-12">
      <!-- Contact Info -->
      <div>
        <h3 class="text-3xl font-bold text-[#EAEAEA] mb-6">Let's build something together.</h3>
        <p class="text-[#A0A0B0] mb-12 leading-relaxed">
          I'm currently looking for new opportunities. Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
        </p>
        
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-[#16213E] rounded-full flex items-center justify-center text-[#E94560]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div>
              <p class="text-sm text-[#606070]">Email</p>
              <a href="mailto:anassfadile18@gmail.com" class="text-[#EAEAEA] hover:text-[#E94560] transition-colors">anassfadile18@gmail.com</a>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-[#16213E] rounded-full flex items-center justify-center text-[#E94560]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <p class="text-sm text-[#606070]">Phone</p>
              <a href="tel:+212658769491" class="text-[#EAEAEA] hover:text-[#E94560] transition-colors">+212 658 769 491</a>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-[#16213E] rounded-full flex items-center justify-center text-[#E94560]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <p class="text-sm text-[#606070]">Location</p>
              <p class="text-[#EAEAEA]">Casablanca, Morocco</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Contact Form -->
      <div class="bg-[#16213E] p-8 rounded-2xl border border-[#1A1A2E]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-[#A0A0B0] mb-2">Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name"
              class="w-full bg-[#0F0F1A] border rounded-lg px-4 py-3 text-[#EAEAEA] focus:outline-none focus:border-[#E94560] transition-colors"
              :class="errors.name ? 'border-red-500' : 'border-[#1A1A2E]'"
            />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-[#A0A0B0] mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email"
              class="w-full bg-[#0F0F1A] border rounded-lg px-4 py-3 text-[#EAEAEA] focus:outline-none focus:border-[#E94560] transition-colors"
              :class="errors.email ? 'border-red-500' : 'border-[#1A1A2E]'"
            />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>
          
          <div>
            <label for="subject" class="block text-sm font-medium text-[#A0A0B0] mb-2">Subject (Optional)</label>
            <input 
              type="text" 
              id="subject" 
              v-model="form.subject"
              class="w-full bg-[#0F0F1A] border border-[#1A1A2E] rounded-lg px-4 py-3 text-[#EAEAEA] focus:outline-none focus:border-[#E94560] transition-colors"
            />
          </div>
          
          <div>
            <label for="message" class="block text-sm font-medium text-[#A0A0B0] mb-2">Message</label>
            <textarea 
              id="message" 
              v-model="form.message"
              rows="4"
              class="w-full bg-[#0F0F1A] border rounded-lg px-4 py-3 text-[#EAEAEA] focus:outline-none focus:border-[#E94560] transition-colors resize-none"
              :class="errors.message ? 'border-red-500' : 'border-[#1A1A2E]'"
            ></textarea>
            <p v-if="errors.message" class="text-red-500 text-xs mt-1">{{ errors.message }}</p>
          </div>
          
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full bg-[#E94560] text-white font-medium py-3 rounded-lg hover:bg-[#d83a54] transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
