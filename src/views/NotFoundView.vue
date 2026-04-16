<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '404 - Page Not Found'
})
</script>

<template>
  <div class="not-found-container">
    <div class="content">
      <h1 class="glitch" data-text="404">404</h1>
      <h2 class="subtitle">Page Not Found</h2>
      <p class="description">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <router-link to="/" class="home-btn">
        <span>Return Home</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #ffffff;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow: hidden;
  position: relative;
}

/* Background effects */
.not-found-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(74, 222, 128, 0.1) 0%, rgba(10, 10, 10, 1) 70%);
  pointer-events: none;
}

.content {
  text-align: center;
  z-index: 10;
  padding: 2rem;
  max-width: 600px;
}

.glitch {
  font-size: 8rem;
  font-weight: 800;
  margin: 0;
  position: relative;
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  animation: float 6s ease-in-out infinite;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: -2px 0 #00fff9;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

.subtitle {
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #4ade80;
}

.description {
  font-size: 1.1rem;
  color: #a0aec0;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.home-btn {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: transparent;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid #4ade80;
  border-radius: 50px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.home-btn span {
  position: relative;
  z-index: 2;
}

.home-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: #4ade80;
  z-index: 1;
  transition: all 0.3s ease;
}

.home-btn:hover {
  color: #0a0a0a;
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.4);
  transform: translateY(-3px);
}

.home-btn:hover::before {
  width: 100%;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@keyframes glitch-anim {
  0% { clip: rect(74px, 9999px, 83px, 0); }
  5% { clip: rect(10px, 9999px, 1px, 0); }
  10% { clip: rect(69px, 9999px, 20px, 0); }
  15% { clip: rect(15px, 9999px, 86px, 0); }
  20% { clip: rect(96px, 9999px, 34px, 0); }
  25% { clip: rect(27px, 9999px, 63px, 0); }
  30% { clip: rect(81px, 9999px, 11px, 0); }
  35% { clip: rect(4px, 9999px, 92px, 0); }
  40% { clip: rect(53px, 9999px, 48px, 0); }
  45% { clip: rect(22px, 9999px, 75px, 0); }
  50% { clip: rect(89px, 9999px, 29px, 0); }
  55% { clip: rect(38px, 9999px, 57px, 0); }
  60% { clip: rect(66px, 9999px, 4px, 0); }
  65% { clip: rect(12px, 9999px, 88px, 0); }
  70% { clip: rect(79px, 9999px, 42px, 0); }
  75% { clip: rect(31px, 9999px, 19px, 0); }
  80% { clip: rect(94px, 9999px, 71px, 0); }
  85% { clip: rect(46px, 9999px, 25px, 0); }
  90% { clip: rect(6px, 9999px, 82px, 0); }
  95% { clip: rect(59px, 9999px, 37px, 0); }
  100% { clip: rect(85px, 9999px, 64px, 0); }
}

@keyframes glitch-anim2 {
  0% { clip: rect(42px, 9999px, 96px, 0); }
  5% { clip: rect(78px, 9999px, 15px, 0); }
  10% { clip: rect(23px, 9999px, 61px, 0); }
  15% { clip: rect(89px, 9999px, 4px, 0); }
  20% { clip: rect(11px, 9999px, 74px, 0); }
  25% { clip: rect(56px, 9999px, 29px, 0); }
  30% { clip: rect(34px, 9999px, 82px, 0); }
  35% { clip: rect(95px, 9999px, 18px, 0); }
  40% { clip: rect(8px, 9999px, 67px, 0); }
  45% { clip: rect(71px, 9999px, 43px, 0); }
  50% { clip: rect(26px, 9999px, 88px, 0); }
  55% { clip: rect(63px, 9999px, 12px, 0); }
  60% { clip: rect(49px, 9999px, 76px, 0); }
  65% { clip: rect(5px, 9999px, 31px, 0); }
  70% { clip: rect(84px, 9999px, 93px, 0); }
  75% { clip: rect(17px, 9999px, 55px, 0); }
  80% { clip: rect(68px, 9999px, 2px, 0); }
  85% { clip: rect(39px, 9999px, 81px, 0); }
  90% { clip: rect(91px, 9999px, 47px, 0); }
  95% { clip: rect(20px, 9999px, 65px, 0); }
  100% { clip: rect(75px, 9999px, 9px, 0); }
}

@media (max-width: 768px) {
  .glitch { font-size: 5rem; }
  .subtitle { font-size: 1.5rem; }
  .description { font-size: 1rem; }
}
</style>
