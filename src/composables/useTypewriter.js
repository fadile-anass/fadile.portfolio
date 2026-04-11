import { ref } from 'vue'

export function useTypewriter(strings, options = {}) {
  const {
    typeSpeed = 100,
    deleteSpeed = 50,
    delayBetween = 2000
  } = options

  const currentText = ref('')
  const isTyping = ref(true)
  
  let stringIndex = 0
  let charIndex = 0
  let isDeleting = false
  let timeoutId = null

  const type = () => {
    const currentString = strings[stringIndex]
    
    if (isDeleting) {
      currentText.value = currentString.substring(0, charIndex - 1)
      charIndex--
    } else {
      currentText.value = currentString.substring(0, charIndex + 1)
      charIndex++
    }

    isTyping.value = true

    let typeDelay = isDeleting ? deleteSpeed : typeSpeed

    if (!isDeleting && charIndex === currentString.length) {
      typeDelay = delayBetween
      isDeleting = true
      isTyping.value = false
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      stringIndex = (stringIndex + 1) % strings.length
      typeDelay = 500
    }

    timeoutId = setTimeout(type, typeDelay)
  }

  // Start typing
  setTimeout(type, 1000)

  return { currentText, isTyping }
}
