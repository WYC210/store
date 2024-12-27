<template>
  <div class="theme-animation" :class="{ 'light-theme': !isDark }">
    <!-- 白天模式的叶子花瓣 -->
    <div v-if="!isDark" class="leaves-container">
      <span v-for="n in 8" :key="n" class="leaf" :style="{ animationDelay: `${n * 0.8}s` }">🍂</span>
    </div>
    <!-- 黑夜模式的闪电 -->
    <div v-else class="lightning-container">
      <div v-for="n in 3" :key="n" class="lightning" :style="{ animationDelay: `${n * 2.5}s` }"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  isDark: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.theme-animation {
  position: relative;
  width: 100%;
  height: 40px;
  overflow: hidden;
  pointer-events: none;
}

/* 叶子动画 */
.leaf {
  position: absolute;
  font-size: 20px;
  color: #8B4513;
  opacity: 0.6;
  animation: leafFall 8s linear infinite;
  transform-origin: center;
}

.leaf:nth-child(2n) { font-size: 16px; }
.leaf:nth-child(3n) { font-size: 24px; }

@keyframes leafFall {
  0% {
    right: -20px;
    top: -20px;
    transform: rotate(0deg);
    opacity: 0.6;
  }
  100% {
    right: 100%;
    top: 40px;
    transform: rotate(360deg);
    opacity: 0;
  }
}

/* 闪电动画 */
.lightning {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent 45%, #FF00FF 48%, #00FFFF 52%, transparent 55%);
  opacity: 0;
  animation: flash 5s infinite;
}

@keyframes flash {
  0%, 100% { opacity: 0; }
  48%, 50% { opacity: 0.1; }
  49% { opacity: 0.4; }
}

.lightning:nth-child(2) {
  background: linear-gradient(-45deg, transparent 45%, #FF00FF 48%, #00FFFF 52%, transparent 55%);
}

.lightning:nth-child(3) {
  background: linear-gradient(90deg, transparent 45%, #FF00FF 48%, #00FFFF 52%, transparent 55%);
}
</style> 