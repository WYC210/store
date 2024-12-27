<template>
  <div class="image-loader">
    <div v-if="loading" class="loading-container">
      <div class="container">
        <svg v-for="n in 10" :key="n" :class="{ blue: n % 2 === 0, yellow: n % 2 !== 0 }" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="25"/>
        </svg>
      </div>
    </div>
    <img
      :src="src"
      :alt="alt"
      @load="handleImageLoad"
      @error="handleImageError"
      :class="{ 'image-loaded': !loading }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  }
})

const loading = ref(true)

const handleImageLoad = () => {
  loading.value = false
}

const handleImageError = () => {
  loading.value = false
  // 可以在这里处理图片加载失败的情况
}
</script>

<style scoped>
.image-loader {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 150px;
  background: #111;
}

.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 17, 17, 0.9);
  backdrop-filter: blur(8px);
}

.container {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 0.8rem;
  max-width: 100%;
  padding: 0 10px;
  margin: auto;
  grid-row: 1/2;
  grid-column: 1/2;
}

.container svg {
  width: 100%;
  height: auto;
  max-width: 20px;
  animation: spin 0.8s ease-in-out alternate infinite;
}

.container svg circle {
  animation: pulse 0.8s ease-in-out alternate infinite;
  transform-origin: 50% 50%;
}

.container svg.blue {
  fill: #0052b7;
  animation: spin_reverse 0.8s ease-in-out alternate infinite;
}

.container svg.blue circle {
  animation-delay: 0.8s;
}

.container svg.yellow {
  fill: #ffd600;
}

.container svg:nth-of-type(1) { animation-delay: 0.2s; }
.container svg:nth-of-type(2) { animation-delay: 0.4s; }
.container svg:nth-of-type(3) { animation-delay: 0.6s; }
.container svg:nth-of-type(4) { animation-delay: 0.8s; }
.container svg:nth-of-type(5) { animation-delay: 1s; }
.container svg:nth-of-type(6) { animation-delay: 1.2s; }
.container svg:nth-of-type(7) { animation-delay: 1.4s; }
.container svg:nth-of-type(8) { animation-delay: 1.6s; }
.container svg:nth-of-type(9) { animation-delay: 1.8s; }
.container svg:nth-of-type(10) { animation-delay: 2s; }

@keyframes spin {
  0% { transform: translateY(150%); }
  100% { transform: translateY(-150%); }
}

@keyframes spin_reverse {
  0% { transform: translateY(-150%); }
  100% { transform: translateY(150%); }
}

@keyframes pulse {
  0% { transform: scale(0.25); }
  100% { transform: scale(1); }
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 4px;
}

.image-loaded {
  opacity: 1;
}

:deep(.carousel-image .image-loader) {
  min-height: 300px;
}

:deep(.product-card .image-loader) {
  min-height: 150px;
}
</style> 