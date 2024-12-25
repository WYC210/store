<template>
  <div class="home-container"
       v-touch:pandown="handlePullToRefresh"
       v-touch:press="handlePress">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <div class="logo-container">
          <svg class="animated-text" preserveAspectRatio="xMidYMid meet" viewBox="41.8 35.90001 205.50002 94.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FF6B6B"/>
                <stop offset="50%" style="stop-color:#4ECDC4"/>
                <stop offset="100%" style="stop-color:#45B7D1"/>
              </linearGradient>
            </defs>
            <path d="M 53.5 47.800003 Q 55.2 45.90001 58.5 45.90001 L 58.7 45.90001 Q 61.5 45.90001 63.4 47.300003 Q 65.3 48.700005 66 51.40001 L 76 92.90001 L 87.7 51.40001 Q 89.2 45.90001 95 45.90001 L 95.600006 45.90001 Q 101.3 45.90001 102.9 51.40001 L 115.200005 93.200005 L 125.200005 51.40001 Q 126.6 45.90001 132.1 45.90001 L 132.3 45.90001 Q 135.70001 45.90001 137.55 47.800003 Q 139.4 49.700005 138.6 52.90001 L 123.200005 114.40001 Q 121.9 120.00001 116 120.00001 L 115.700005 120.00001 Q 109.9 120.00001 108.4 114.50001 L 95.4 68.20001 L 82.7 114.50001 Q 81.3 120.00001 75.5 120.00001 L 75.2 120.00001 Q 69.3 120.00001 68 114.40001 L 52.6 52.90001 Q 51.8 49.700005 53.5 47.800003 Z" style="--path-length: 583.52783; fill: transparent; stroke: url(#logoGradient)"/>
            <path d="M 235.65001 108.65001 Q 237.30002 110.30001 237.30002 113.40001 L 237.30002 113.600006 Q 237.30002 116.700005 235.65001 118.350006 Q 234.00002 120.00001 230.90001 120.00001 L 187.00002 120.00001 Q 184.00002 120.00001 182.30002 118.25001 Q 180.6 116.50001 180.6 114.00001 L 180.6 113.40001 Q 180.6 111.100006 181.30002 109.50001 Q 182.00002 107.90001 184.30002 104.80001 L 216.70001 58.900005 L 187.80002 58.900005 Q 184.70001 58.900005 183.05002 57.250008 Q 181.40001 55.600006 181.40001 52.500008 L 181.40001 52.300003 Q 181.40001 49.200005 183.05002 47.550003 Q 184.70001 45.90001 187.80002 45.90001 L 228.6 45.90001 Q 231.6 45.90001 233.30002 47.65001 Q 235.00002 49.40001 235.00002 51.90001 L 235.00002 52.500008 Q 235.00002 54.800003 234.35 56.300007 Q 233.70001 57.800007 231.80002 60.500008 L 198.90001 107.00001 L 230.90001 107.00001 Q 234.00002 107.00001 235.65001 108.65001 Z" style="--path-length: 404.6023; fill: transparent; stroke: url(#logoGradient)"/>
          </svg>
        </div>
      </div>
      
      <div class="header-center">
        <el-input
          v-model="searchText"
          placeholder="搜索商品"
          :prefix-icon="Search"
          class="search-input">
        </el-input>
      </div>
      
      <div class="header-right">
        <el-button type="primary" class="cart-button" @click="goToCart">
          <el-badge :value="cartCount" class="cart-badge">
            <el-icon><ShoppingCart /></el-icon>
          </el-badge>
          购物车
        </el-button>
        <el-dropdown trigger="click">
          <el-avatar :size="40" :src="userInfo?.avatar || defaultAvatar" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>我的订单</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 这里可以添加商品列表等内容 -->
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ShoppingCart } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const searchText = ref('')
const cartCount = ref(0)
const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const goToCart = () => {
  router.push('/cart')
}

const handleLogout = () => {
  localStorage.removeItem('userInfo')
  router.push('/login')
  ElMessage.success('退出成功')
}

const handlePullToRefresh = (e) => {
  if (e.distance > 100) {
    ElMessage.success('刷新中...')
    // 这里可以添加实际的刷新逻辑
    setTimeout(() => {
      // 模拟刷新完成
      ElMessage.success('刷新成功')
    }, 1000)
  }
}

const handlePress = () => {
  ElMessage({
    message: '长按可以进行更多操作',
    type: 'info'
  })
}

onMounted(() => {
  // 这里可以获取购物车数量等初始数据
  cartCount.value = 0
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  height: var(--header-height);
  background: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.header-left {
  flex: 1;
}

.logo-container {
  width: 120px;
  height: 50px;
  cursor: pointer;
}

.header-center {
  flex: 2;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.search-input {
  width: 100%;
  max-width: 500px;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}

.cart-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

.cart-badge :deep(.el-badge__content) {
  background-color: #ff4949;
}

.main-content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 20px;
}

/* SVG 动画相关样式 */
.animated-text {
  max-width: 100%;
  height: auto;
}

.animated-text path {
  fill: transparent;
  stroke: url(#logoGradient);
  stroke-width: 2;
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);
  animation: logo-anim 15s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  transform-origin: center;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@keyframes logo-anim {
  0% {
    stroke-dashoffset: var(--path-length);
    stroke-dasharray: var(--path-length) var(--path-length);
    opacity: 0;
    fill: transparent;
  }
  5% {
    opacity: 1;
    stroke-dashoffset: var(--path-length);
    stroke-dasharray: var(--path-length) var(--path-length);
  }
  50% {
    stroke-dashoffset: 0;
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: transparent;
  }
  60% {
    stroke-dashoffset: 0;
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: currentColor;
    opacity: 1;
  }
  75% {
    stroke-dashoffset: 0;
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: currentColor;
    opacity: 1;
  }
  85% {
    stroke-dashoffset: 0;
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: transparent;
    opacity: 1;
  }
  95% {
    stroke-dashoffset: var(--path-length);
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: transparent;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: var(--path-length);
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: transparent;
    opacity: 0;
  }
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .header {
    height: var(--mobile-header-height);
    flex-wrap: wrap;
    padding: 10px;
  }

  .header-left {
    flex: 0 0 100%;
    display: flex;
    justify-content: center;
  }

  .header-center {
    flex: 1 0 100%;
    order: 3;
    padding: 10px 0;
  }

  .header-right {
    flex: 0 0 100%;
    justify-content: center;
  }

  .cart-button {
    font-size: 12px;
    padding: 8px 15px;
  }

  .logo-container {
    width: 100px;
    height: 40px;
  }
}

/* 平板适配 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .header {
    padding: 0 15px;
  }

  .search-input {
    max-width: 300px;
  }
}
</style> 