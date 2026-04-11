import { useToastStore } from '../stores/toastStore'

export function useToast() {
  const toastStore = useToastStore()
  
  const showToast = (message, type = 'info') => {
    toastStore.addToast(message, type)
  }
  
  return { showToast }
}
