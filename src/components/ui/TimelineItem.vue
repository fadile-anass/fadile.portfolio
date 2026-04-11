<script setup>
defineProps({
  title: String,
  subtitle: String,
  description: String,
  isActive: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="timeline-item-wrapper relative pl-10 pb-10 last:pb-0" :class="{ 'is-active': isActive }">
    <!-- Glowing vertical line -->
    <div class="timeline-line absolute left-[7px] top-0 bottom-0 w-[2px]"></div>

    <!-- Animated marker dot -->
    <div class="timeline-marker absolute left-0 top-2">
      <div class="marker-dot" :class="{ 'marker-active': isActive }"></div>
      <div v-if="isActive" class="marker-ring"></div>
    </div>

    <!-- Glassmorphism card -->
    <div class="timeline-card relative rounded-2xl p-6 transition-all duration-500 group cursor-default">
      <h5 class="text-lg font-bold text-[#EAEAEA] group-hover:text-white transition-colors duration-300">{{ title }}</h5>
      <span class="inline-block text-xs text-[#E94560] font-mono mt-1 mb-3 tracking-wide">{{ subtitle }}</span>
      <p class="text-[#A0A0B0] text-sm leading-relaxed group-hover:text-[#C0C0D0] transition-colors duration-300">{{ description }}</p>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
/* Timeline line with gradient */
.timeline-line {
  background: linear-gradient(180deg, rgba(233, 69, 96, 0.5) 0%, rgba(233, 69, 96, 0.1) 100%);
}

.timeline-item-wrapper:last-child .timeline-line {
  display: none;
}

/* Marker dot */
.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1A1A2E;
  border: 3px solid #E94560;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.15);
}

.marker-active {
  background: #22c55e;
  border-color: #22c55e;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.5), 0 0 0 4px rgba(34, 197, 94, 0.15);
  animation: pulse-green 2s ease-in-out infinite;
}

/* Pulsing ring around active marker */
.marker-ring {
  position: absolute;
  top: 2px;
  left: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(34, 197, 94, 0.4);
  animation: ring-expand 2s ease-out infinite;
  z-index: 1;
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 12px rgba(34, 197, 94, 0.5), 0 0 0 4px rgba(34, 197, 94, 0.15); }
  50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.7), 0 0 0 6px rgba(34, 197, 94, 0.25); }
}

@keyframes ring-expand {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* Glassmorphism card */
.timeline-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.timeline-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(ellipse at 0% 0%, rgba(233, 69, 96, 0.1), transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.timeline-card:hover {
  transform: translateY(-4px);
  border-color: rgba(233, 69, 96, 0.3);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(233, 69, 96, 0.1);
}

.timeline-card:hover::before {
  opacity: 1;
}

/* Entrance animation */
.timeline-item-wrapper {
  opacity: 0;
  transform: translateX(-30px);
  animation: slideInTimeline 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  animation-delay: calc(var(--i, 0) * 0.15s);
}

@keyframes slideInTimeline {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Hover on marker when card is hovered */
.timeline-item-wrapper:hover .marker-dot:not(.marker-active) {
  background: #E94560;
  box-shadow: 0 0 12px rgba(233, 69, 96, 0.5), 0 0 0 4px rgba(233, 69, 96, 0.2);
}
</style>
