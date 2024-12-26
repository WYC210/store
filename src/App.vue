<template>
  <router-view></router-view>
</template>

<script>
import { onUnmounted } from 'vue'
import { provideAnimationManager } from './composables/useAnimationManager'

export default {
  name: 'App',
  setup() {
    const animationManager = provideAnimationManager()

    onUnmounted(() => {
      animationManager.cleanup()
    })
  }
}
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
