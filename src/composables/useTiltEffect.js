export function useTiltEffect() {
  const applyTilt = (element) => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = ((y - centerY) / centerY) * -15
      const rotateY = ((x - centerX) / centerX) * 15
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    })
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`
    })
  }
  
  return { applyTilt }
}
