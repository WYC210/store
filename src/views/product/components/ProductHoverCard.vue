<template>
  <div 
    class="product-hover-card"
    ref="cardRef"
    v-show="visible"
    @mouseleave="$emit('mouseleave')"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <el-spinner size="medium" />
      <span>加载中...</span>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <el-icon><Warning /></el-icon>
      <span>{{ error }}</span>
    </div>

    <!-- 侧边导航 -->
    <div class="hover-card-sidebar">
      <div 
        v-for="tab in tabs" 
        :key="tab.key"
        class="sidebar-item"
        :class="{ active: currentTab === tab.key }"
        @click="currentTab = tab.key"
      >
        <el-icon><component :is="tab.icon" /></el-icon>
        <span>{{ tab.label }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="hover-card-content">
      <!-- 图片展示 -->
      <div v-if="currentTab === 'images'" class="content-images">
        <el-carousel height="200px" indicator-position="outside">
          <el-carousel-item v-for="image in productImages" :key="image.id">
            <el-image :src="image.url" fit="cover" />
          </el-carousel-item>
        </el-carousel>
        <!-- 弹幕区域 -->
        <div class="danmaku-container">
          <transition-group name="danmaku">
            <div 
              v-for="comment in activeComments" 
              :key="comment.id"
              class="danmaku-item"
              :style="comment.style"
            >
              {{ comment.content }}
            </div>
          </transition-group>
        </div>
      </div>

      <!-- 商品介绍 -->
      <div v-if="currentTab === 'intro'" class="content-intro">
        <h3>{{ product.name }}</h3>
        <div class="price">¥{{ product.price.toFixed(2) }}</div>
        <div class="description">{{ product.description }}</div>
        <div class="stock">库存: {{ product.stock }}</div>
      </div>

      <!-- 配置选择 -->
      <div v-if="currentTab === 'config'" class="content-config">
        <div v-for="option in product.options" :key="option.id" class="config-item">
          <h4>{{ option.name }}</h4>
          <el-radio-group v-model="selectedConfigs[option.id]">
            <el-radio 
              v-for="choice in option.choices" 
              :key="choice.id" 
              :label="choice.id"
            >
              {{ choice.name }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>

      <!-- 评论列表 -->
      <div v-if="currentTab === 'comments'" class="content-comments">
        <div v-for="comment in product.reviews" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <span class="username">{{ comment.username }}</span>
            <el-rate v-model="comment.rating" disabled></el-rate>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
          <div class="comment-time">{{ formatTime(comment.createdTime) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Picture, Document, Tools, ChatDotRound, Warning } from '@element-plus/icons-vue'
import { getProductDetails, getProductImages } from '@/api/product'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['mouseleave'])

// 标签页配置
const tabs = [
  { key: 'images', label: '图片', icon: Picture },
  { key: 'intro', label: '介绍', icon: Document },
  { key: 'config', label: '配置', icon: Tools },
  { key: 'comments', label: '评论', icon: ChatDotRound }
]

const currentTab = ref('images')
const productImages = ref([])
const activeComments = ref([])
const selectedConfigs = ref({})
const loading = ref(false)
const error = ref(null)

// 弹幕系统
let danmakuTimer = null

const startDanmaku = () => {
  if (props.product?.reviews?.length) {
    danmakuTimer = setInterval(() => {
      const review = props.product.reviews[
        Math.floor(Math.random() * props.product.reviews.length)
      ]
      if (review) {
        activeComments.value.push({
          id: Date.now(),
          content: review.content,
          style: {
            top: `${Math.random() * 160}px`
          }
        })
      }
    }, 2000)
  }
}

// 加载商品详情
const loadProductDetails = async () => {
  if (!props.product?.id) return
  
  loading.value = true
  error.value = null
  
  try {
    const [details, images] = await Promise.all([
      getProductDetails(props.product.id),
      getProductImages(props.product.id)
    ])
    
    productImages.value = images.data || []
    Object.assign(props.product, details.data)
    
  } catch (err) {
    error.value = '加载失败，请重试'
    console.error('Failed to load product details:', err)
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

onMounted(() => {
  if (props.visible) {
    loadProductDetails()
    startDanmaku()
  }
})

onUnmounted(() => {
  if (danmakuTimer) {
    clearInterval(danmakuTimer)
  }
})
</script>

<style scoped>
.product-hover-card {
  position: fixed;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  width: 500px;
  min-height: 300px;
  display: flex;
  animation: neonPulse 2s infinite;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 霓虹边框动画 */
@keyframes neonPulse {
  0% {
    box-shadow: 0 0 5px #fff,
                0 0 10px #fff,
                0 0 15px #fff,
                0 0 20px #ff1177,
                0 0 35px #ff1177,
                0 0 40px #ff1177,
                0 0 50px #ff1177,
                0 0 75px #ff1177;
  }
  50% {
    box-shadow: 0 0 2.5px #fff,
                0 0 5px #fff,
                0 0 7.5px #fff,
                0 0 10px #ff1177,
                0 0 17.5px #ff1177,
                0 0 20px #ff1177,
                0 0 25px #ff1177,
                0 0 37.5px #ff1177;
  }
  100% {
    box-shadow: 0 0 5px #fff,
                0 0 10px #fff,
                0 0 15px #fff,
                0 0 20px #ff1177,
                0 0 35px #ff1177,
                0 0 40px #ff1177,
                0 0 50px #ff1177,
                0 0 75px #ff1177;
  }
}

/* ... 其他样式保持不变 ... */
</style> 