import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGsapAnimations() {
  
  const initScrollAnimations = () => {
    // Hero Load Sequence
    const tl = gsap.timeline()
    
    tl.to('.hero-canvas', { opacity: 1, duration: 1, ease: 'power2.inOut' }, 0)
      .to('.hero-name', { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.4)
      .to('.hero-role', { opacity: 1, duration: 0.5 }, 0.8)
      .to('.hero-tagline', { opacity: 1, duration: 0.5 }, 1.2)
      .to('.hero-buttons', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 1.4)
      .to('.navbar', { opacity: 1, y: 0, duration: 0.5 }, 1.6)

    // Section Titles
    gsap.utils.toArray('.section-title-container').forEach(container => {
      gsap.from(container, {
        scrollTrigger: {
          trigger: container,
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      })
    })

    // Timeline Items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        },
        x: -60,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      })
    })

    // Skill Bars
    gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
      const targetWidth = bar.getAttribute('data-width')
      gsap.fromTo(bar, 
        { width: '0%' },
        {
          scrollTrigger: {
            trigger: bar,
            start: 'top 95%',
            toggleActions: 'play none none reverse'
          },
          width: targetWidth,
          duration: 1,
          ease: 'power2.out'
        }
      )
    })
  }

  const cleanup = () => {
    ScrollTrigger.getAll().forEach(t => t.kill())
  }

  return { initScrollAnimations, cleanup }
}
