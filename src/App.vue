<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import CustomCursor from './components/ui/CustomCursor.vue'
import ScrollProgress from './components/ui/ScrollProgress.vue'
import Toast from './components/ui/Toast.vue'
</script>

<template>
  <CustomCursor />
  <ScrollProgress />
  <Navbar />
  <RouterView />
  <Toast />
</template>
