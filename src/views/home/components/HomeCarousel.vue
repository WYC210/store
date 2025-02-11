<template>
  <div class="carousel-container" v-if="!isMobileView">
    <el-carousel 
      :interval="4000"
      type="card"
      :height="contentHeight"
      class="carousel"
      indicator-position="outside"
      arrow="always"
    >
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <el-image
          :src="item.image"
          :alt="item.title"
          fit="cover"
          class="carousel-image"
          loading="lazy"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import { useBreakpoints } from '@vueuse/core'

const props = defineProps({
  contentHeight: {
    type: String,
    default: '400px'
  }
})

// 轮播图数据
const carouselItems = ref([
  {
    image: 'carousel1.jpg',
    title: '轮播图1'
  },
  {
    image: 'carousel2.jpg',
    title: '轮播图2'
  },
  {
    image: 'carousel3.jpg',
    title: '轮播图3'
  }
])

// 响应式断点
const breakpoints = useBreakpoints({
  mobile: 768
})

const isMobileView = computed(() => breakpoints.smaller('mobile'))
</script>

<style scoped>
.carousel-container {
  width: 100%;
  margin: 40px auto;
  padding: 0 20px;
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.carousel {
  width: 100%;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(36, 208, 254, 0.5);
  box-shadow: 
    0 0 20px rgba(36, 208, 254, 0.3),
    0 0 40px rgba(36, 208, 254, 0.2),
    inset 0 0 15px rgba(36, 208, 254, 0.2);
  background: rgba(6, 5, 36, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2px;
  perspective: 1000px;
}

.carousel :deep(.el-carousel__item) {
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center center;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

/* 优化卡片轮播效果 */
.carousel :deep(.el-carousel__item--card) {
  transform: translateX(50%) scale(0.8);
  transition: transform 0.4s ease;
  opacity: 0.6;
}

.carousel :deep(.el-carousel__item--card.is-active) {
  transform: translateX(0) scale(1);
  opacity: 1;
  z-index: 2;
}

/* 添加霓虹灯效果 */
@keyframes neonGlow {
  0% {
    box-shadow: 
      0 0 5px rgba(36, 208, 254, 0.5),
      0 0 10px rgba(36, 208, 254, 0.3),
      0 0 15px rgba(36, 208, 254, 0.2);
  }
  50% {
    box-shadow: 
      0 0 10px rgba(36, 208, 254, 0.7),
      0 0 20px rgba(36, 208, 254, 0.5),
      0 0 30px rgba(36, 208, 254, 0.3);
  }
  100% {
    box-shadow: 
      0 0 5px rgba(36, 208, 254, 0.5),
      0 0 10px rgba(36, 208, 254, 0.3),
      0 0 15px rgba(36, 208, 254, 0.2);
  }
}

.carousel :deep(.el-carousel__item--card.is-active) {
  animation: neonGlow 2s infinite;
}
</style> 