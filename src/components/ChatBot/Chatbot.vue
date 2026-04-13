<template>
  <div class="chatbot-container">
    <!-- Toggle Button -->
    <button
      class="chatbot-toggle"
      @click="toggleChatbot"
      :aria-label="isOpen ? 'Close chat' : 'Open chat'"
    >
      <svg v-if="isOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>

      <div :class="['chatbot-tooltip', { show: showTooltip }]">
        Chat with me!
      </div>
    </button>

    <!-- Chat Dialog -->
    <div v-if="isOpen" class="chatbot-dialog">
      <div class="chatbot-header">
        <h3>Chat with Anass Fadile's AI</h3>

        <div class="chatbot-header-buttons">
          <button @click="clearChatHistory" class="clear-history-button">
            Clear
          </button>

          <button @click="toggleChatbot">✕</button>
        </div>
      </div>

      <!-- Messages -->
      <div class="chatbot-messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="message.role === 'user' ? 'user-message message' : 'assistant-message message'"
        >
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>

        <div v-if="isLoading" class="assistant-message message">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div ref="messagesEndRef"></div>
      </div>

      <!-- Input -->
      <div class="chatbot-input">
        <input
          v-model="input"
          @keyup.enter="sendMessage"
          placeholder="Ask me anything..."
          :disabled="isLoading"
        />

        <button
          @click="sendMessage"
          :disabled="isLoading || !input.trim()"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import './Chatbot.css'


// State
const isOpen = ref(false)
const messages = ref([])
const input = ref('')
const isLoading = ref(false)
const showTooltip = ref(false)
const messagesEndRef = ref(null)

// Load messages
onMounted(() => {
  const saved = localStorage.getItem('chatbotMessages')

  if (saved) {
    messages.value = JSON.parse(saved)
  } else {
    messages.value = [
      {
        role: 'assistant',
        content: "Hi there! I'm the AI version of Fadile Anass. Ask me anything!"
      }
    ]
  }

  // Tooltip timing
  setTimeout(() => (showTooltip.value = true), 1000)
  setTimeout(() => (showTooltip.value = false), 6000)
})

// Save messages
watch(messages, (val) => {
  if (val.length) {
    localStorage.setItem('chatbotMessages', JSON.stringify(val))
  }
}, { deep: true })

// Auto scroll
watch(messages, async () => {
  await nextTick()
  messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
})

// Methods
const toggleChatbot = () => {
  isOpen.value = !isOpen.value
  showTooltip.value = false
}

const sendMessage = async () => {
  if (!input.value.trim()) return

  const userMessage = { role: 'user', content: input.value }
  messages.value.push(userMessage)

  const userInput = input.value
  input.value = ''
  isLoading.value = true

  try {
    const response = await fetchAIResponse(messages.value)
    messages.value.push({ role: 'assistant', content: response })
  } catch (err) {
    messages.value.push({
      role: 'assistant',
      content: 'Error occurred. Try again later.'
    })
  } finally {
    isLoading.value = false
  }
}

// API call
const fetchAIResponse = async (history) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  const apiUrl = 'https://api.groq.com/openai/v1/chat/completions'

  if (!apiKey) throw new Error('Missing API key')

  const systemPrompt = (await import('../../utils/systemPrompt')).default

  const recentMessages = history.slice(-11) // Take the last 11 messages (system + up to 10 history)

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...recentMessages
  ]

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: apiMessages,
      max_tokens: 500,
      temperature: 0.7
    })
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error?.message || 'API error')
  }

  return data.choices[0].message.content
}

// Clear chat
const clearChatHistory = () => {
  localStorage.removeItem('chatbotMessages')
  messages.value = [
    {
      role: 'assistant',
      content: 'Chat history cleared. How can I help?'
    }
  ]
}
</script>