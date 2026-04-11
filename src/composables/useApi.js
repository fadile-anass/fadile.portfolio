import { ref } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export function useApi() {
  const fetchProjects = async (params = {}) => {
    const data = ref(null)
    const loading = ref(true)
    const error = ref(null)
    
    try {
      const response = await api.get('/projects', { params })
      data.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || err.message
    } finally {
      loading.value = false
    }
    
    return { data, loading, error }
  }

  const fetchSkills = async () => {
    const data = ref(null)
    const loading = ref(true)
    const error = ref(null)
    
    try {
      const response = await api.get('/skills')
      data.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || err.message
    } finally {
      loading.value = false
    }
    
    return { data, loading, error }
  }

  const fetchExperiences = async () => {
    const data = ref(null)
    const loading = ref(true)
    const error = ref(null)
    
    try {
      const response = await api.get('/experiences')
      data.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || err.message
    } finally {
      loading.value = false
    }
    
    return { data, loading, error }
  }

  const fetchServices = async () => {
    const data = ref(null)
    const loading = ref(true)
    const error = ref(null)
    
    try {
      const response = await api.get('/services')
      data.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || err.message
    } finally {
      loading.value = false
    }
    
    return { data, loading, error }
  }

  const fetchBlogPosts = async () => {
    const data = ref(null)
    const loading = ref(true)
    const error = ref(null)
    
    try {
      const response = await api.get('/blog')
      data.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || err.message
    } finally {
      loading.value = false
    }
    
    return { data, loading, error }
  }

  const submitContact = async (formData) => {
    const data = ref(null)
    const error = ref(null)
    
    try {
      const response = await api.post('/contact', formData)
      data.value = response.data
    } catch (err) {
      error.value = err.response?.data?.errors || err.message
    }
    
    return { data, error }
  }

  return {
    fetchProjects,
    fetchSkills,
    fetchExperiences,
    fetchServices,
    fetchBlogPosts,
    submitContact
  }
}
