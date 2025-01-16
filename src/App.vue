<template>
  <router-view></router-view>
</template>

<script setup>
import { onUnmounted, onMounted } from 'vue'
import { provideAnimationManager } from './composables/useAnimationManager'
import { useUserStore } from '@/stores/user'

const animationManager = provideAnimationManager()
const userStore = useUserStore()

onUnmounted(() => {
  animationManager.cleanup()
})

onMounted(async () => {
  try {
    const token = document.cookie.includes('AUTH-TOKEN')
    if (token) {
      await userStore.validateToken()
    }
  } catch (error) {
    console.error('Token validation error:', error)
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
