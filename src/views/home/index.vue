<template>
  <div class="home-container" :class="{ 'light-theme': !isDarkTheme }">
    <header class="navbar" :class="{ 'navbar-fixed': isNavFixed }">
      <router-link to="/home" class="logo-container">
        <img src="@/assets/logo_w.png" alt="Logo" class="logo" />
        <CyberText />
      </router-link>
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="输入关键词进行搜索..."
          class="search-input"
          :prefix-icon="Search"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
        >
          <template #append>
            <el-button 
              @click="handleSearch" 
              class="search-button"
            >
              <span class="button-text">搜索</span>
            </el-button>
          </template>
        </el-input>
      </div>
      <nav class="nav-links">
        <ThemeToggle v-model:isDark="isDarkTheme" />
        <el-button class="nav-home" @click="goToHome">首页</el-button>
        <el-button class="nav-cart" @click="goToCart">购物车</el-button>
        <el-button class="nav-profile" @click="goToProfile">个人中心</el-button>
      </nav>
    </header>
    <div class="navbar-placeholder" v-show="isNavFixed"></div>

    <section class="main-content">
      <div class="section-divider" :class="{ 'light': !isDarkTheme }"></div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="8" :lg="6">
          <section class="categories">
            <!-- 移动端分类展示 -->
            <div class="mobile-categories" v-if="isMobileView">
              <el-collapse v-model="activeCollapse">
                <el-collapse-item 
                  v-for="(category, index) in categories" 
                  :key="index"
                  :title="category.name"
                  :name="index"
                >
                  <div class="mobile-sub-categories">
                    <el-tag
                      v-for="(subCategory, subIndex) in category.children"
                      :key="subIndex"
                      :class="{ 'light-theme': !isDarkTheme }"
                      @click="handleSubCategoryClick(subCategory)"
                    >
                      {{ subCategory }}
                    </el-tag>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <!-- 桌面端分类展示 -->
            <template v-else>
              <h2>商品分类</h2>
              <el-menu 
                class="category-menu" 
                :default-active="activeIndex"
              >
                <el-menu-item 
                  v-for="(category, index) in categories" 
                  :key="index"
                  :index="String(index)"
                  @mouseenter="handleMouseEnter(category)"
                  @mouseleave="handleMenuLeave"
                  @click="handleCategoryClick(category)"
                >
                  {{ category.name }}
                </el-menu-item>
              </el-menu>
            </template>
            <!-- 二级菜单 -->
            <div 
              class="sub-menu" 
              v-show="activeCategory"
              @mouseenter="handleSubmenuEnter"
              @mouseleave="handleSubmenuLeave"
            >
              <h3>{{ activeCategory?.name }}</h3>
              <div class="sub-categories">
                <span 
                  v-for="(subCategory, index) in activeCategory?.children" 
                  :key="index"
                  class="sub-category"
                  @click="handleSubCategoryClick(subCategory)"
                >
                  {{ subCategory }}
                </span>
              </div>
            </div>
          </section>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="18">
          <!-- 轮播图 -->
          <el-carousel class="carousel" autoplay>
            <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
              <ImageLoader :src="item.image" alt="轮播图" class="carousel-image" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </section>

    <section class="products">
      <div class="title-divider" :class="{ 'light': !isDarkTheme }">
        <span class="divider-text">热销商品</span>
      </div>
      <el-row :gutter="20">
        <el-col 
          v-for="product in products" 
          :key="product.id" 
          :xs="12" 
          :sm="12" 
          :md="8" 
          :lg="6"
        >
          <el-card class="product-card">
            <ImageLoader :src="product.image" alt="商品图片" />
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p>价格: ¥{{ product.price }}</p>
              <el-button type="primary" @click="addToCart(product)">加入购物车</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import ImageLoader from '@/components/ImageLoader.vue'
import CyberText from '@/components/CyberText.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

// 添加 pendingOperations 的定义
const pendingOperations = ref([])
const router = useRouter()
const searchKeyword = ref('')
const activeIndex = ref('0')
const activeCategory = ref(null)
// 从 localStorage 获取主题状态，如果没有则默认为 false
const isDarkTheme = ref(localStorage.getItem('isDarkTheme') === 'true')
const isNavFixed = ref(false)
const isSearchFocused = ref(false)

// 清理函数集合
const cleanupFunctions = []

// 分类数据
const categories = ref([
  {
    name: '电子产品',
    children: ['手机', '平板电脑', '笔记本电脑', '显示器', '智能手表', '耳机']
  },
  {
    name: '服装',
    children: ['上衣', '裤子', '裙子', '外套', '运动服', '内衣']
  },
  {
    name: '家居用品',
    children: ['床上用品', '厨房用具', '家具', '灯具', '收纳用品']
  },
  {
    name: '运动器材',
    children: ['跑步机', '哑铃', '瑜伽垫', '篮球', '羽毛球']
  }
])

let timeoutId = null

// 处理鼠标悬停主菜单
const handleMouseEnter = (category) => {
  if (window.innerWidth <= 768) return
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  activeCategory.value = category
}

// 处理鼠标离开主菜单
const handleMenuLeave = () => {
  timeoutId = setTimeout(() => {
    if (!isSubmenuHovered.value) {
      activeCategory.value = null
    }
  }, 100)
}

// 跟踪二级菜单是否被悬停
const isSubmenuHovered = ref(false)

// 处理鼠标进入二级菜单
const handleSubmenuEnter = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  isSubmenuHovered.value = true
}

// 处理鼠标离开二级菜单
const handleSubmenuLeave = () => {
  isSubmenuHovered.value = false
  timeoutId = setTimeout(() => {
    activeCategory.value = null
  }, 200)
}

// 处理点击二级分类
const handleSubCategoryClick = (subCategory) => {
  console.log('选择的子分类:', subCategory)
  // 这里可以添加跳转到对应分类页面的逻辑
  router.push({
    path: '/products',
    query: { category: subCategory }
  })
}

const carouselItems = ref([
  { 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%201.jpg'
  },
  { 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%202.jpg'
  },
  { 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%203.jpg'
  }
])

const products = ref([
  { 
    id: 1, 
    name: '智能手机', 
    price: 2999, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%204.jpg'
  },
  { 
    id: 2, 
    name: '运动鞋', 
    price: 799, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%205.jpg'
  },
  { 
    id: 3, 
    name: '咖啡机', 
    price: 1299, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%206.jpg'
  },
  { 
    id: 4, 
    name: '无线耳机', 
    price: 999, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%207.jpg'
  },
  { 
    id: 5, 
    name: '游戏主机', 
    price: 3999, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%208.jpg'
  },
  { 
    id: 6, 
    name: '机械键盘', 
    price: 599, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%209.jpg'
  },
  { 
    id: 7, 
    name: '电竞显示器', 
    price: 2499, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%2010.jpg'
  },
  { 
    id: 8, 
    name: '智能手表', 
    price: 1599, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%2011.jpg'
  },
  { 
    id: 9, 
    name: '电动牙刷', 
    price: 299, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%2012.jpg'
  },
  { 
    id: 10, 
    name: '蓝牙音箱', 
    price: 499, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%2013.jpg'
  },
  { 
    id: 11, 
    name: '平板电脑', 
    price: 3299, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%2014.jpg'
  },
  { 
    id: 12, 
    name: '智能门锁', 
    price: 899, 
    image: 'https://raw.githubusercontent.com/microsoft/wallpapers/main/Cyberpunk_Dreams/Cyberpunk%20Dreams%2015.jpg'
  }
])

const addToCart = (product) => {
  console.log(`添加到购物车: ${product.name}`)
}

const goToHome = () => {
  router.push('/home')
}

const goToProducts = () => {
  router.push('/products')
}

const goToCart = () => {
  router.push('/cart')
}

const goToProfile = () => {
  router.push('/profile')
}

// 性能优化：使用防抖处理滚动和调整大小事件
const debounce = (fn, delay) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 优化滚动处理
const handleScroll = debounce(() => {
  if (window.scrollY > 0) {
    isNavFixed.value = true
    document.body.style.paddingTop = '60px'
  } else {
    isNavFixed.value = false
    document.body.style.paddingTop = '0'
  }
}, 16)

// 优化窗口大小变化处理
const checkMobileView = debounce(() => {
  isMobileView.value = window.innerWidth <= 768
}, 100)

// 优化动画性能
const optimizeAnimations = () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const styleSheet = document.createElement('style')
  if (isReducedMotion) {
    styleSheet.textContent = `
      * {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
      }
    `
    document.head.appendChild(styleSheet)
  }
  return () => styleSheet.remove()
}

// 图片懒加载优化
const observeImages = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        observer.unobserve(img)
      }
    })
  }, {
    rootMargin: '50px'
  })
  
  return observer
}

onMounted(() => {
  // 使用 nextTick 确保 DOM 已更新
  nextTick(() => {
    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', checkMobileView, { passive: true })
    
    // 初始化动画优化
    const cleanupAnimation = optimizeAnimations()
    
    // 初始化图片懒加载
    const imageObserver = observeImages()
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
    
    cleanupFunctions.push(() => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobileView)
      cleanupAnimation()
      imageObserver.disconnect()
    })
  })

  // 初始化时同步一次主题
  if (isDarkTheme.value) {
    document.body.classList.add('dark-theme')
  }
})

onUnmounted(() => {
  // 清理所有定时器和监听器
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
    searchTimeout.value = null
  }
  
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  
  // 清理所有异步操作
  Promise.all(pendingOperations.value)
    .catch(error => console.error('Cleanup error:', error))
    .finally(() => {
      pendingOperations.value = []
      document.body.style.paddingTop = '0'
      document.body.classList.remove('dark-theme')
      
      // 执行所有清理函数
      cleanupFunctions.forEach(cleanup => {
        try {
          cleanup()
        } catch (error) {
          console.error('Cleanup error:', error)
        }
      })
      cleanupFunctions.length = 0
    })
})

// 优化事件处理函数
const handleSearchFocus = () => {
  isSearchFocused.value = true
}

const handleSearchBlur = () => {
  isSearchFocused.value = false
}

// 使用防抖处理搜索
const searchTimeout = ref(null)
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  const promise = new Promise(resolve => {
    searchTimeout.value = setTimeout(() => {
      // 处理搜索逻辑
      searchTimeout.value = null
      resolve()
    }, 300)
  })
  
  pendingOperations.value.push(promise)
}

// 清理定时器
onUnmounted(() => {
  // 取消所有定时器
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  // 等待所有未完成的操作
  Promise.all(pendingOperations.value)
    .catch(error => console.error('Cleanup error:', error))
    .finally(() => {
      // 清理样式和事件监听
      document.body.style.paddingTop = '0'
      cleanupFunctions.forEach(cleanup => cleanup())
      pendingOperations.value = []
    })
})

// 添加点击处理函数
const handleCategoryClick = (category) => {
  // 在移动端，点击时切换显示状态
  if (window.innerWidth <= 768) {
    if (activeCategory.value === category) {
      // 如果点击的是当前激活的分类，则关闭菜单
      activeCategory.value = null
    } else {
      // 否则显示新点击的分类的菜单
      activeCategory.value = category
    }
  }
}

// 检测是否为移动端视图
const isMobileView = ref(false)
const activeCollapse = ref([]) // 控制折叠面板的展开状态

// 监听主题变化并保存到 localStorage
watchEffect(() => {
  localStorage.setItem('isDarkTheme', isDarkTheme.value)
  // 可选：同步更新 body 的类名，用于全局样式
  if (isDarkTheme.value) {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
})
</script>

<style scoped>
.home-container {
  padding: 20px;
  background: #0B0B2B;
  min-height: 100vh;
  color: #fff;
  will-change: auto; /* 重置 will-change */
  contain: content;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: rgba(13, 13, 48, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 0, 255, 0.3);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  width: 100%;
  z-index: 40; /* 确保导航栏始终在最上层 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transform: translateZ(0);
  transition: transform 0.3s ease;
}

.navbar-fixed {
  transform: translateY(0);
}

.navbar-placeholder {
  height: 70px; /* 与导航栏高度保持一致 */
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.logo-container {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 20px;
  position: relative;
  padding: 5px;
}

.search-input {
  width: 100%;
  transition: transform 0.3s ease;
  transform: translateZ(0);
}

.nav-links {
  display: flex;
  gap: 15px;
}

.main-content {
  margin: 20px 0;
}

.carousel {
  margin: 0;
  height: 400px;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.carousel :deep(.el-carousel__container) {
  height: 100% !important;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translateZ(0);
  will-change: transform;
}

.categories {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 20px;
  height: 400px;
  position: relative;
  z-index: 20; /* 确保分类区域在导航栏下方但高于其他内容 */
}

.category-menu {
  border-right: none;
  background: transparent;
}

:deep(.el-menu) {
  background: transparent;
  border: none;
}

:deep(.el-menu-item) {
  background: transparent;
  color: #fff;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  border-left: 2px solid transparent;
  transition: all 0.3s;
}

:deep(.el-menu-item:hover) {
  background: rgba(0, 255, 255, 0.1);
  border-left: 2px solid #00FFFF;
  color: #00FFFF;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}

.sub-menu {
  position: absolute;
  left: 100%;
  top: 0;
  width: 200px;
  padding: 15px;
  border-radius: 4px;
  z-index: 30; /* 确保二级菜单显示在最上层 */
}

@keyframes hologramAppear {
  0% {
    opacity: 0;
    transform: translateX(-10px) skewX(5deg);
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
  }
  100% {
    opacity: 1;
    transform: translateX(0) skewX(0);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}

.sub-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    transparent 0%,
    rgba(0, 255, 255, 0.2) 50%,
    transparent 100%
  );
  animation: scanline 2s linear infinite;
}

@keyframes scanline {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.sub-menu h3 {
  margin-bottom: 15px;
  color: #fff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
  padding-bottom: 10px;
  font-size: 16px;
}

.sub-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sub-category {
  padding: 5px 10px;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.sub-category:hover {
  background: rgba(0, 255, 255, 0.2);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
}

.el-menu-item {
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}

.el-menu-item:hover {
  background-color: #ecf5ff;
}

.products {
  position: relative;
  padding-top: 20px; /* 为动画留出空间 */
}

.products h2 {
  position: relative;
  z-index: 1;
}

.product-card {
  text-align: center;
  background: linear-gradient(
    45deg,
    rgba(13, 13, 48, 0.95),
    rgba(23, 12, 45, 0.95)
  );
  border: 2px solid #00FFFF;
  clip-path: polygon(0 5%, 95% 0, 100% 95%, 5% 100%);
  transform: perspective(1000px) rotateX(5deg);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 
    0 0 15px rgba(0, 255, 255, 0.2),
    inset 0 0 10px rgba(255, 0, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.product-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  margin-top: 10px;
  padding: 15px;
  transition: all 0.3s ease;
}

.product-info h3 {
  margin: 10px 0;
  color: #fff;
  text-shadow: 
    0 0 5px rgba(0, 255, 255, 0.5),
    0 0 10px rgba(255, 0, 255, 0.3);
}

.product-info p {
  color: #00FFFF;
  text-shadow: 
    0 0 5px rgba(0, 255, 255, 0.5),
    0 0 10px rgba(255, 0, 255, 0.3);
}

:deep(.el-input__wrapper) {
  background: rgba(13, 13, 48, 0.8);
  border: 2px solid #00FFFF;
  box-shadow: none;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 
    0 0 15px rgba(0, 255, 255, 0.3),
    inset 0 0 10px rgba(0, 255, 255, 0.2);
  border-color: #00FFFF;
}

:deep(.el-input__inner) {
  color: #00FFFF;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(0, 255, 255, 0.5);
}

:deep(.el-button) {
  background: rgba(13, 13, 48, 0.9);
  border: 1px solid #FF00FF;
  color: #FF00FF;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  backdrop-filter: blur(8px);
}

:deep(.el-button:hover) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 0 10px rgba(255, 0, 255, 0.5),
    inset 0 0 5px rgba(255, 0, 255, 0.3);
  background: rgba(0, 255, 255, 0.1);
  border-color: #FF00FF;
}

:deep(.el-button:hover::before) {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
  animation: buttonGlow 1s linear infinite;
}

@keyframes buttonGlow {
  0% {
    transform: rotate(45deg) translateY(0);
  }
  100% {
    transform: rotate(45deg) translateY(100%);
  }
}

:deep(.el-button--primary) {
  background: linear-gradient(45deg, #FF00FF, #00FFFF);
  border: none;
  color: #000033;
  font-weight: bold;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(45deg, #00FFFF, #FF00FF);
  color: #fff;
  box-shadow: 
    0 0 10px #FF00FF,
    0 0 20px rgba(0, 255, 255, 0.5);
}

.decorative-gear {
  position: absolute;
  width: 50px;
  height: 50px;
  border: 3px solid #8B4513;
  border-radius: 50%;
  border-top-color: #FF4500;
  opacity: 0.3;
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.search-decoration {
  position: absolute;
  width: 20px;
  height: 2px;
  background: #4B0082;
  transition: all 0.3s ease;
}

.search-decoration.left {
  left: 0;
  top: 0;
}

.search-decoration.right {
  right: 0;
  bottom: 0;
}

.search-active ~ .search-decoration.left {
  width: 100%;
  background: linear-gradient(90deg, #9400D3, transparent);
  box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
  animation: glitchLine 1s infinite;
}

.search-active ~ .search-decoration.right {
  width: 100%;
  background: linear-gradient(90deg, transparent, #9400D3);
  box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
  animation: glitchLine 1s infinite reverse;
}

@keyframes glitchLine {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  80% {
    transform: translateX(0);
    opacity: 1;
  }
  90% {
    transform: translateX(-10px);
    opacity: 0.3;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.search-button {
  position: relative;
  overflow: hidden;
  background: rgba(20, 15, 25, 0.9);
  border: none;
  border: 1px solid #4B0082;
  transition: all 0.3s ease;
  color: #9400D3;
}

.search-button-active {
  background: rgba(75, 0, 130, 0.3);
  animation: buttonGlitch 0.3s infinite;
}

.button-text {
  position: relative;
  z-index: 1;
}

.button-glitch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg, 
    transparent 45%, 
    rgba(138, 43, 226, 0.3) 50%, 
    transparent 55%
  );
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.search-button:hover .button-glitch {
  transform: translateX(100%);
}

@keyframes buttonGlitch {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-2px);
  }
  40% {
    transform: translateX(2px);
  }
  60% {
    transform: translateX(-1px);
  }
  80% {
    transform: translateX(1px);
  }
  100% {
    transform: translateX(0);
  }
}

/* 浅色主题 */
.light-theme {
  background-color: #F4ECD8;
  background-image: 
    linear-gradient(
      rgba(244, 236, 216, 0.97),
      rgba(238, 228, 204, 0.97)
    ),
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23AA8B56' fill-opacity='0.02' d='M0 0h200v200H0z' filter='blur(2px)'/%3E%3C/svg%3E");
  position: relative;
}

.light-theme::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 50% 50%, rgba(244, 236, 216, 0), rgba(205, 190, 155, 0.1)),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(139, 109, 30, 0.03) 3px,
      transparent 3px
    );
  pointer-events: none;
  z-index: -1;
}

.light-theme .navbar {
  background: linear-gradient(
    rgba(244, 236, 216, 0.95),
    rgba(238, 228, 204, 0.95)
  );
  border-bottom: 2px solid rgba(139, 109, 30, 0.2);
  box-shadow: 
    0 0 20px rgba(139, 109, 30, 0.1),
    inset 0 0 20px rgba(139, 109, 30, 0.05);
}

.light-theme .categories {
  background: rgba(244, 236, 216, 0.95);
  border: 1px solid rgba(139, 109, 30, 0.3);
  padding: 20px;
  border-radius: 4px;
  box-shadow: 
    0 5px 15px rgba(139, 109, 30, 0.1),
    inset 0 0 10px rgba(139, 109, 30, 0.05);
  background-image: 
    linear-gradient(
      rgba(244, 236, 216, 0.95),
      rgba(238, 228, 204, 0.95)
    ),
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23paper)' opacity='0.05'/%3E%3C/svg%3E");
}

.light-theme .categories h2 {
  color: #2C4F2C;
  font-family: "楷体", "KaiTi", serif;
  font-size: 1.5em;
  letter-spacing: 4px;
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(139, 109, 30, 0.2);
  text-shadow: 2px 2px 4px rgba(139, 109, 30, 0.1);
  position: relative;
}

.light-theme .categories h2::after {
  content: '『 』';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -12px;
  font-size: 0.8em;
  color: rgba(139, 109, 30, 0.6);
  background: rgba(244, 236, 216, 0.95);
  padding: 0 10px;
}

.light-theme :deep(.category-menu) {
  background: transparent;
  border: none;
}

.light-theme :deep(.el-menu-item) {
  font-family: "楷体", "KaiTi", serif;
  color: #2C4F2C;
  letter-spacing: 2px;
  font-size: 1.1em;
  height: 45px;
  line-height: 45px;
  margin: 5px 0;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 40px !important;
}

.light-theme :deep(.el-menu-item)::before {
  content: '•';
  position: absolute;
  left: 20px;
  opacity: 0.6;
}

.light-theme :deep(.el-menu-item:hover),
.light-theme :deep(.el-menu-item.is-active) {
  background: rgba(139, 109, 30, 0.1);
  color: #1B3B1B;
  box-shadow: 
    0 2px 8px rgba(139, 109, 30, 0.1),
    inset 0 0 5px rgba(139, 109, 30, 0.05);
}

.light-theme .sub-menu {
  position: absolute;
  left: 100%;
  top: 0;
  width: 200px;
  background: rgba(244, 236, 216, 0.98);
  background-image: 
    linear-gradient(
      rgba(244, 236, 216, 0.98),
      rgba(238, 228, 204, 0.98)
    ),
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23paper)' opacity='0.05'/%3E%3C/svg%3E");
  border: 1px solid rgba(139, 69, 19, 0.2);
  border-radius: 4px;
  padding: 15px;
  box-shadow: 
    0 5px 20px rgba(139, 69, 19, 0.15),
    inset 0 0 10px rgba(139, 69, 19, 0.05);
  backdrop-filter: blur(5px);
  z-index: 10;
}

.light-theme .sub-menu h3 {
  color: #2C4F2C;
  font-family: "楷体", "KaiTi", serif;
  font-size: 1.2em;
  letter-spacing: 2px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(139, 69, 19, 0.2);
  text-align: center;
  position: relative;
}

.light-theme .sub-menu h3::before,
.light-theme .sub-menu h3::after {
  content: '〜';
  position: absolute;
  top: 0;
  color: rgba(139, 69, 19, 0.4);
}

.light-theme .sub-menu h3::before {
  left: 20px;
}

.light-theme .sub-menu h3::after {
  right: 20px;
}

.light-theme .sub-categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 0 10px;
}

.light-theme .sub-category {
  font-family: "楷体", "KaiTi", serif;
  color: #2C4F2C;
  padding: 8px 15px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 1.1em;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(139, 69, 19, 0.2);
  position: relative;
  overflow: hidden;
}

.light-theme .sub-category:hover {
  color: #1B3B1B;
  background: rgba(139, 69, 19, 0.15);
  transform: translateY(-2px);
  box-shadow: 
    0 3px 10px rgba(139, 69, 19, 0.1),
    inset 0 0 5px rgba(139, 69, 19, 0.05);
  border-color: rgba(139, 69, 19, 0.4);
}

.light-theme .sub-category::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(139, 69, 19, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.light-theme .sub-category:hover::before {
  transform: translateX(100%);
}

/* 商品区域样式 */
.light-theme .products h2 {
  font-family: "楷体", "KaiTi", serif;
  color: #8B4513;
  text-align: center;
  font-size: 2em;
  letter-spacing: 4px;
  margin: 30px 0;
  position: relative;
}

.light-theme .products h2::before,
.light-theme .products h2::after {
  content: '✦';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(139, 69, 19, 0.4);
  font-size: 0.8em;
}

.light-theme .products h2::before {
  left: 30%;
}

.light-theme .products h2::after {
  right: 30%;
}

.light-theme .product-card {
  background: rgba(244, 236, 216, 0.95);
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.light-theme .product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(
      rgba(244, 236, 216, 0.97),
      rgba(238, 228, 204, 0.97)
    ),
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23paper)' opacity='0.05'/%3E%3C/svg%3E");
  z-index: -1;
}

.light-theme .product-card::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  border: 1px solid rgba(139, 69, 19, 0.2);
  z-index: -1;
}

.light-theme .product-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 10px 20px rgba(139, 69, 19, 0.15),
    0 0 15px rgba(139, 69, 19, 0.1);
}

.light-theme .product-card:hover::after {
  border-color: rgba(139, 69, 19, 0.4);
}

.light-theme .product-info {
  padding: 15px;
  position: relative;
}

.light-theme .product-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(139, 69, 19, 0.2),
    transparent
  );
}

.light-theme .product-info h3 {
  font-family: "楷体", "KaiTi", serif;
  color: #8B4513;
  font-size: 1.2em;
  letter-spacing: 2px;
  margin-bottom: 10px;
  text-align: center;
}

.light-theme .product-info p {
  font-family: "楷体", "KaiTi", serif;
  color: #A0522D;
  text-align: center;
  margin: 10px 0;
  font-size: 1.1em;
}

.light-theme .product-info .el-button {
  display: block;
  width: 80%;
  margin: 15px auto;
  font-family: "楷体", "KaiTi", serif;
  background: transparent;
  border: 1px solid rgba(139, 69, 19, 0.3);
  color: #8B4513;
  transition: all 0.3s ease;
}

.light-theme .product-info .el-button:hover {
  background: rgba(139, 69, 19, 0.1);
  border-color: rgba(139, 69, 19, 0.5);
  color: #A0522D;
  transform: translateY(-2px);
  box-shadow: 
    0 5px 15px rgba(139, 69, 19, 0.1),
    inset 0 0 5px rgba(139, 69, 19, 0.05);
}

/* 商品图片容器 */
.light-theme .product-card .image-container {
  position: relative;
  padding: 10px;
  background: rgba(244, 236, 216, 0.8);
}

.light-theme .product-card img {
  border-radius: 4px;
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 69, 19, 0.1);
}

.light-theme .product-card:hover img {
  transform: scale(1.02);
  border-color: rgba(139, 69, 19, 0.3);
}

/* 装饰性角落 */
.light-theme .product-card::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-top: 2px solid rgba(139, 69, 19, 0.2);
  border-left: 2px solid rgba(139, 69, 19, 0.2);
  top: 10px;
  left: 10px;
}

.light-theme .product-card::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-bottom: 2px solid rgba(139, 69, 19, 0.2);
  border-right: 2px solid rgba(139, 69, 19, 0.2);
  bottom: 10px;
  right: 10px;
}

.light-theme .search-container {
  position: relative;
  background: rgba(244, 236, 216, 0.95);
  border: 1px solid rgba(139, 69, 19, 0.3);
  border-radius: 4px;
  padding: 2px;
  box-shadow: 
    0 5px 15px rgba(139, 69, 19, 0.1),
    inset 0 0 10px rgba(139, 69, 19, 0.05);
}

.light-theme :deep(.el-input__wrapper) {
  background: rgba(244, 236, 216, 0.95);
  border: none;
  box-shadow: none !important;
}

.light-theme :deep(.el-input__inner) {
  color: #8B4513;
  font-family: "楷体", "KaiTi", serif;
  font-size: 1.1em;
  letter-spacing: 1px;
  &::placeholder {
    color: rgba(139, 69, 19, 0.6);
  }
}

.light-theme :deep(.el-input__prefix-inner) {
  color: rgba(139, 69, 19, 0.6);
}

.light-theme .search-button {
  background: transparent;
  border: 1px solid rgba(139, 69, 19, 0.3);
  color: #8B4513;
  font-family: "楷体", "KaiTi", serif;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h38v38H1z' fill='none' stroke='%23698269' stroke-width='0.5' stroke-opacity='0.2' stroke-dasharray='2 2'/%3E%3C/svg%3E");
    opacity: 0.2;
    z-index: -1;
  }
}

.light-theme .search-button:hover {
  background: rgba(139, 69, 19, 0.1);
  border-color: rgba(139, 69, 19, 0.5);
  transform: translateY(-1px);
  box-shadow: 
    0 5px 15px rgba(139, 69, 19, 0.1),
    inset 0 0 5px rgba(139, 69, 19, 0.05);
}

.light-theme .search-decoration {
  display: none;
}

.light-theme .search-active {
  border-color: rgba(139, 69, 19, 0.5);
  box-shadow: 
    0 5px 15px rgba(139, 69, 19, 0.15),
    inset 0 0 10px rgba(139, 69, 19, 0.1);
}

/* 导航栏按钮样式 */
.light-theme .nav-links {
  display: flex;
  gap: 15px;
  align-items: center;
}

.light-theme .nav-links :deep(.el-button) {
  background: rgba(244, 236, 216, 0.95);
  border: 1px solid rgba(139, 69, 19, 0.3);
  color: #8B4513;
  font-family: "楷体", "KaiTi", serif;
  font-size: 1.1em;
  letter-spacing: 2px;
  padding: 8px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h38v38H1z' fill='none' stroke='%23698269' stroke-width='0.5' stroke-opacity='0.2' stroke-dasharray='2 2'/%3E%3C/svg%3E");
    opacity: 0.2;
    z-index: -1;
  }

  &:hover {
    background: rgba(139, 69, 19, 0.1);
    border-color: rgba(139, 69, 19, 0.5);
    transform: translateY(-2px);
    box-shadow: 
      0 5px 15px rgba(139, 69, 19, 0.1),
       inset 0 0 5px rgba(139, 69, 19, 0.05);
  }
}

/* 为每个导航按钮添加独特的装饰 */
.light-theme .nav-links :deep(.nav-home::after) {
  content: '『家』';
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 0.7em;
  color: rgba(139, 69, 19, 0.4);
}

.light-theme .nav-links :deep(.nav-cart::after) {
  content: '『市』';
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 0.7em;
  color: rgba(139, 69, 19, 0.4);
}

.light-theme .nav-links :deep(.nav-profile::after) {
  content: '『我』';
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 0.7em;
  color: rgba(139, 69, 19, 0.4);
}

.title-container {
  position: relative;
  margin-bottom: 30px;
  padding: 0;
  overflow: hidden;
}

.title-container h2 {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 28px;
}

/* 白天模式的叶子动画 */
.light-theme .title-container::before {
  content: '🍂';
  position: absolute;
  font-size: 20px;
  color: #8B4513;
  opacity: 0;
  animation: customLeafFall 8s linear infinite;
}

.light-theme .title-container::after {
  content: '🍂';
  position: absolute;
  font-size: 24px;
  color: #8B4513;
  opacity: 0;
  animation: customLeafFall 8s linear infinite;
  animation-delay: 4s;
}

.light-theme .title-container {
  position: relative;
}

.light-theme .title-container .leaf {
  position: absolute;
  opacity: 0;
  font-size: 20px;
  content: '🍂';
  animation: customLeafFall 8s linear infinite;
}

/* 为每片叶子设置不同的大小和延迟 */
.light-theme .title-container .leaf:nth-child(1) {
  font-size: 16px;
  animation-delay: 0s;
  right: 10%;
}

.light-theme .title-container .leaf:nth-child(2) {
  font-size: 20px;
  animation-delay: 1.5s;
  right: 30%;
}

.light-theme .title-container .leaf:nth-child(3) {
  font-size: 24px;
  animation-delay: 3s;
  right: 50%;
}

.light-theme .title-container .leaf:nth-child(4) {
  font-size: 18px;
  animation-delay: 4.5s;
  right: 70%;
}

.light-theme .title-container .leaf:nth-child(5) {
  font-size: 22px;
  animation-delay: 6s;
  right: 90%;
}

.light-theme .title-container .leaf:nth-child(6) {
  font-size: 19px;
  animation-delay: 7.5s;
  right: 20%;
}

@keyframes leafFloat {
  0% {
    right: 0;
    transform: 
      translateX(0)
      translateY(0)
      rotate(0deg)
      scale(0.8);
    opacity: 0;
  }
  
  10% {
    opacity: 1;
    transform: 
      translateX(calc(var(--amplitude) * 1px))
      translateY(calc(var(--fall-speed) * 10vh))
      rotate(45deg)
      scale(1);
  }
  
  45% {
    transform: 
      translateX(calc(var(--amplitude) * -1.2 * 1px))
      translateY(calc(var(--fall-speed) * 45vh))
      rotate(180deg)
      scale(1);
  }
  
  75% {
    transform: 
      translateX(calc(var(--amplitude) * 0.8 * 1px))
      translateY(calc(var(--fall-speed) * 75vh))
      rotate(270deg)
      scale(1);
    opacity: 1;
  }
  
  100% {
    right: 100%;
    transform: 
      translateX(0)
      translateY(calc(var(--fall-speed) * 100vh))
      rotate(360deg)
      scale(0.8);
    opacity: 0;
  }
}

/* 简化黑夜模式样式 */
.dark-mode {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 0, 255, 0.2);
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.1);
  transition: background-color 0.3s ease;
}

.dark-mode h2 {
  color: #fff;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.3);
}

/* 分隔线基础样式 */
.section-divider {
  position: relative;
  height: 2px;
  margin: 30px 0;
  overflow: hidden;
}

/* 暗色主题分隔线 */
.section-divider:not(.light) {
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 0, 255, 0.2),
    rgba(0, 255, 255, 0.2),
    transparent
  );
}

.section-divider:not(.light)::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 0, 255, 0.6),
    rgba(0, 255, 255, 0.6),
    transparent
  );
  animation: neonPulse 3s ease-in-out infinite;
}

@keyframes neonPulse {
  0%, 100% {
    opacity: 0;
    transform: translateX(-100%);
  }
  50% {
    opacity: 1;
    transform: translateX(100%);
  }
}

/* 亮色主题分隔线 */
.section-divider.light {
  background: linear-gradient(90deg,
    transparent,
    rgba(139, 69, 19, 0.1),
    rgba(139, 109, 30, 0.2),
    transparent
  );
}

.section-divider.light::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 1px;
  background: repeating-linear-gradient(90deg,
    transparent,
    transparent 4px,
    rgba(139, 69, 19, 0.2) 4px,
    rgba(139, 69, 19, 0.2) 8px
  );
}

.section-divider.light::after {
  content: '❀';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  color: rgba(139, 69, 19, 0.4);
  background: #fff;
  padding: 0 15px;
}

/* 为每个区域添加过渡效果 */
.main-content,
.products {
  position: relative;
  padding: 20px 0;
  transition: transform 0.3s ease;
}

.main-content:hover,
.products:hover {
  transform: translateY(-2px);
}

/* 优化区域标题样式 */
.title-container {
  margin-top: 20px;
}

/* 适配不同主题 */
.light-theme .section-divider.light::after {
  background: rgba(244, 236, 216, 0.95);
}

.dark-theme .section-divider:not(.light)::after {
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
}

/* 标题分隔线样式 */
.title-divider {
  position: relative;
  height: 2px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 暗色主题标题分隔线 */
.title-divider:not(.light) {
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 0, 255, 0.2) 25%,
    rgba(0, 255, 255, 0.2) 50%,
    rgba(255, 0, 255, 0.2) 75%,
    transparent 100%
  );
}

.title-divider:not(.light)::before,
.title-divider:not(.light)::after {
  content: '';
  position: absolute;
  top: 0;
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 0, 255, 0.6),
    rgba(0, 255, 255, 0.6)
  );
  animation: neonFlow 3s ease-in-out infinite;
}

.title-divider:not(.light)::before {
  left: 0;
  transform-origin: left;
}

.title-divider:not(.light)::after {
  right: 0;
  transform: scaleX(-1);
  transform-origin: right;
}

.title-divider:not(.light) .divider-text {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  padding: 0 20px;
  background: #0B0B2B;
  z-index: 1;
  text-shadow: 
    0 0 10px rgba(255, 0, 255, 0.5),
    0 0 20px rgba(0, 255, 255, 0.3);
}

@keyframes neonFlow {
  0%, 100% {
    opacity: 0.3;
    transform: scaleX(0.8);
  }
  50% {
    opacity: 1;
    transform: scaleX(1);
  }
}

/* 亮色主题标题分隔线 */
.title-divider.light {
  background: linear-gradient(90deg,
    transparent,
    rgba(139, 69, 19, 0.1),
    rgba(139, 109, 30, 0.2),
    rgba(139, 69, 19, 0.1),
    transparent
  );
}

.title-divider.light::before,
.title-divider.light::after {
  content: '';
  position: absolute;
  width: 35%;
  height: 1px;
  background: repeating-linear-gradient(90deg,
    transparent,
    transparent 4px,
    rgba(139, 69, 19, 0.3) 4px,
    rgba(139, 69, 19, 0.3) 8px
  );
}

.title-divider.light::before {
  left: 0;
}

.title-divider.light::after {
  right: 0;
}

.title-divider.light .divider-text {
  color: #8B4513;
  font-size: 24px;
  font-weight: bold;
  padding: 0 20px;
  background: rgba(244, 236, 216, 0.95);
  z-index: 1;
  font-family: "楷体", "KaiTi", serif;
  letter-spacing: 4px;
}

.title-divider.light::before,
.title-divider.light::after {
  content: '❀';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: rgba(139, 69, 19, 0.4);
  background: rgba(244, 236, 216, 0.95);
  padding: 0 10px;
}

.title-divider.light::before {
  left: 30%;
}

.title-divider.light::after {
  right: 30%;
}

/* 移除原有的标题样式 */
.title-container {
  position: relative;
  margin-bottom: 30px;
  padding: 0;
  overflow: hidden;
}

/* 更新主题切换过渡效果 */
.title-container,
.title-divider,
.divider-text {
  transition: all 0.3s ease;
}

/* 优化轮播图容器样式 */
.el-carousel-item {
  height: 100%;
}

:deep(.el-carousel__item) {
  height: 100%;
}

/* 图片加载组件样式调整 */
:deep(.carousel-image .image-loader) {
  height: 100%;
  min-height: unset;
}

:deep(.carousel-image img) {
  height: 100%;
  object-fit: cover;
}

/* 优化商品卡片布局 */
.product-card {
  margin-bottom: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.light-theme .product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.home-container:not(.light-theme) .product-card {
  background: rgba(20, 20, 40, 0.6);
  border: 1px solid rgba(255, 0, 255, 0.1);
}

.home-container:not(.light-theme) .product-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 0 20px rgba(255, 0, 255, 0.2),
    0 0 30px rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(255, 0, 255, 0.3);
}

.home-container:not(.light-theme) .product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg,
    transparent,
    rgba(255, 0, 255, 0.1),
    rgba(0, 255, 255, 0.1),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.home-container:not(.light-theme) .product-card:hover::before {
  opacity: 1;
}

/* 优化商品信息样式 */
.product-info {
  padding: 15px;
  transition: all 0.3s ease;
}

.home-container:not(.light-theme) .product-info {
  background: rgba(0, 0, 0, 0.4);
}

.home-container:not(.light-theme) .product-info h3 {
  color: #fff;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.3);
}

.home-container:not(.light-theme) .product-info p {
  color: #00ffff;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
}

/* 优化按钮样式 */
.home-container:not(.light-theme) .product-info .el-button {
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  border: none;
  color: #fff;
  transition: all 0.3s ease;
}

.home-container:not(.light-theme) .product-info .el-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.4);
}

/* 添加页面底部间距 */
.products {
  margin-bottom: 40px;
}

/* 优化商品网格布局 */
.el-row {
  margin: 0 -10px;
}

.el-col {
  padding: 0 10px;
}

/* 响应式导航栏 */
@media screen and (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 10px;
  }

  .logo-container {
    margin-bottom: 10px;
  }

  .search-container {
    width: 100%;
    margin: 10px 0;
  }

  .nav-links {
    width: 100%;
    justify-content: space-around;
  }

  .nav-links .el-button {
    padding: 8px 12px;
    font-size: 14px;
  }
}

/* 响应式分类区域 */
@media screen and (max-width: 768px) {
  .categories {
    height: auto;
    margin-bottom: 20px;
    padding: 15px;
    margin-top: 60px; /* 为固定导航栏留出空间 */
  }

  .sub-menu {
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    margin-top: 0;
    z-index: 30;
    visibility: visible;
    opacity: 1;
    transition: all 0.3s ease;
  }

  /* 亮色主题移动端二级菜单样式 */
  .light-theme .sub-menu {
    background: rgba(244, 236, 216, 0.98);
    border: 1px solid rgba(139, 69, 19, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    visibility: visible;
    opacity: 1;
  }

  /* 暗色主题移动端二级菜单样式 */
  .home-container:not(.light-theme) .sub-menu {
    background: rgba(20, 20, 40, 0.98);
    border: 1px solid rgba(255, 0, 255, 0.2);
    box-shadow: 0 4px 20px rgba(255, 0, 255, 0.15);
  }

  /* 移动端二级菜单内容样式 */
  @media screen and (max-width: 768px) {
    .sub-menu h3 {
      font-size: 16px;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .light-theme .sub-menu h3 {
      color: #8B4513;
      border-bottom-color: rgba(139, 69, 19, 0.2);
    }
    
    .home-container:not(.light-theme) .sub-menu h3 {
      color: #fff;
      border-bottom-color: rgba(255, 0, 255, 0.2);
    }
    
    .sub-categories {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    
    .sub-category {
      padding: 8px;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .light-theme .sub-category {
      background: rgba(255, 255, 255, 0.5);
      color: #8B4513;
    }
    
    .light-theme .sub-category:active {
      background: rgba(139, 69, 19, 0.1);
    }
    
    .home-container:not(.light-theme) .sub-category {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    
    .home-container:not(.light-theme) .sub-category:active {
      background: rgba(255, 0, 255, 0.2);
    }
  }
}

/* 响应式轮播图 */
@media screen and (max-width: 768px) {
  .carousel {
    height: 200px;
    margin-bottom: 20px;
  }
}

/* 响应式商品卡片 */
@media screen and (max-width: 768px) {
  .product-card {
    margin-bottom: 15px;
  }

  .product-info {
    padding: 10px;
  }

  .product-info h3 {
    font-size: 14px;
  }

  .product-info p {
    font-size: 16px;
  }

  .product-info .el-button {
    width: 100%;
    padding: 8px;
    font-size: 14px;
  }
}

/* 响应式标题和分隔线 */
@media screen and (max-width: 768px) {
  .title-divider {
    margin: 15px 0;
  }

  .title-divider .divider-text {
    font-size: 20px;
    padding: 0 15px;
  }

  .section-divider {
    margin: 20px 0;
  }
}

/* 响应式间距调整 */
@media screen and (max-width: 768px) {
  .home-container {
    padding: 10px;
  }

  .main-content,
  .products {
    padding: 10px 0;
  }

  .el-row {
    margin: 0 -5px;
  }

  .el-col {
    padding: 0 5px;
  }
}

/* 适配不同设备的悬停效果 */
@media (hover: hover) {
  .product-card:hover {
    transform: translateY(-5px);
  }
}

@media (hover: none) {
  .product-card:active {
    transform: scale(0.98);
  }
}

/* 优化移动端触摸体验 */
@media (max-width: 768px) {
  .product-card {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  .el-button {
    min-height: 44px; /* 确保触摸目标足够大 */
  }
}

/* 优化导航栏固定定位在移动端的表现 */
@media screen and (max-width: 768px) {
  .navbar-fixed {
    position: sticky;
    top: 0;
  }

  .navbar-placeholder {
    height: auto;
  }
}

/* 优化暗色主题在移动端的视觉效果 */
@media screen and (max-width: 768px) {
  .home-container:not(.light-theme) .product-card:hover {
    box-shadow: 
      0 0 15px rgba(255, 0, 255, 0.15),
      0 0 20px rgba(0, 255, 255, 0.1);
  }

  .title-divider:not(.light) .divider-text {
    font-size: 20px;
    padding: 0 15px;
  }
}

/* 修复亮色主题下二级菜单的显示问题 */
.light-theme .categories .sub-menu {
  display: block;
  visibility: visible;
  opacity: 1;
  background: rgba(244, 236, 216, 0.98);
  border: 1px solid rgba(139, 69, 19, 0.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 优化二级菜单的显示/隐藏过渡 */
.sub-menu {
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.sub-menu:not([style*="display: none"]) {
  visibility: visible;
  opacity: 1;
}

/* 调整导航栏固定定位后的内容布局 */
.navbar-fixed + .main-content {
  margin-top: 60px;
}

/* 确保内容不被固定导航栏遮挡 */
.home-container {
  padding-top: 60px;
}

/* 移动端分类样式 */
.mobile-categories {
  padding: 0;
  margin-bottom: 20px;
}

/* 自定义折叠面板样式 */
.mobile-categories :deep(.el-collapse) {
  border: none;
  background: transparent;
}

.mobile-categories :deep(.el-collapse-item__header) {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 16px;
  padding: 10px;
  margin-bottom: 5px;
}

/* 折叠面板内容区域样式 */
.mobile-categories :deep(.el-collapse-item__content) {
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

/* 亮色主题折叠面板样式 */
.light-theme .mobile-categories :deep(.el-collapse-item__header) {
  background: rgba(244, 236, 216, 0.9);
  color: #8B4513;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(139, 69, 19, 0.2);
  box-shadow: 0 2px 8px rgba(139, 69, 19, 0.1);
}

/* 秋叶装饰效果 */
.light-theme .mobile-categories :deep(.el-collapse-item__header)::before {
  content: '🍁';
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  opacity: 0.6;
  animation: floatLeaf 3s ease-in-out infinite;
}

.light-theme .mobile-categories :deep(.el-collapse-item__header)::after {
  content: '🍂';
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0.4;
  animation: floatLeaf 4s ease-in-out infinite reverse;
}

/* 展开状态的额外装饰 */
.light-theme .mobile-categories :deep(.el-collapse-item.is-active) .el-collapse-item__header {
  background: linear-gradient(
    to right,
    rgba(244, 236, 216, 0.95),
    rgba(255, 248, 220, 0.95)
  );
  border-color: rgba(139, 69, 19, 0.3);
}

/* 内容区域的秋叶装饰 */
.light-theme .mobile-categories :deep(.el-collapse-item__content) {
  background: rgba(255, 248, 220, 0.95);
  border: 1px solid rgba(139, 69, 19, 0.15);
  border-top: none;
  position: relative;
  overflow: hidden;
}

.light-theme .mobile-categories :deep(.el-collapse-item__content)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 20px,
      rgba(139, 69, 19, 0.03) 20px,
      rgba(139, 69, 19, 0.03) 40px
    );
  pointer-events: none;
}

/* 秋叶飘动动画 */
@keyframes floatLeaf {
  0%, 100% {
    transform: translateY(-50%) rotate(0deg);
  }
  25% {
    transform: translateY(-60%) rotate(5deg);
  }
  75% {
    transform: translateY(-40%) rotate(-5deg);
  }
}

/* 展开/收起动画 */
.light-theme .mobile-categories :deep(.el-collapse-item__wrap) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
}

/* 标签样式优化 */
.light-theme .mobile-sub-categories .el-tag {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(139, 69, 19, 0.2);
  color: #8B4513;
  position: relative;
  overflow: hidden;
}

.light-theme .mobile-sub-categories .el-tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(139, 69, 19, 0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.light-theme .mobile-sub-categories .el-tag:active::before {
  transform: translateX(0);
}

/* 移除移动端不需要的样式 */
@media screen and (max-width: 768px) {
  .categories {
    margin-top: 20px;
    padding: 10px;
  }
}

/* 暗色主题折叠面板样式 */
.home-container:not(.light-theme) .mobile-categories :deep(.el-collapse-item__header) {
  background: linear-gradient(
    135deg,
    rgba(20, 20, 40, 0.8),
    rgba(40, 20, 60, 0.8)
  );
  color: #fff;
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  box-shadow: 
    0 0 10px rgba(255, 0, 255, 0.2),
    inset 0 0 5px rgba(0, 255, 255, 0.2);
}

/* 全息效果 - 扫描线 */
.home-container:not(.light-theme) .mobile-categories :deep(.el-collapse-item__header)::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 255, 0.2),
    rgba(255, 0, 255, 0.2),
    transparent
  );
  animation: holoScan 3s linear infinite;
}

/* 全息效果 - 故障线 */
.home-container:not(.light-theme) .mobile-categories :deep(.el-collapse-item__header)::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    #0ff,
    #f0f,
    transparent
  );
  animation: glitchLine 2s linear infinite;
  opacity: 0.5;
}

/* 暗色主题展开内容样式 */
.home-container:not(.light-theme) .mobile-categories :deep(.el-collapse-item__content) {
  background: rgba(20, 20, 40, 0.9);
  border: 1px solid rgba(0, 255, 255, 0.15);
  border-top: none;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 15px rgba(255, 0, 255, 0.1),
    inset 0 0 8px rgba(0, 255, 255, 0.1);
}

/* 全息网格背景 */
.home-container:not(.light-theme) .mobile-categories :deep(.el-collapse-item__content)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.05) 75%, rgba(255, 0, 255, 0.05) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.05) 75%, rgba(255, 0, 255, 0.05) 76%, transparent 77%, transparent);
  background-size: 30px 30px;
  animation: gridPulse 3s ease infinite;
}

/* 暗色主题标签样式 */
.home-container:not(.light-theme) .mobile-sub-categories .el-tag {
  background: rgba(20, 20, 40, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.2);
  color: #fff;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  position: relative;
  overflow: hidden;
}

.home-container:not(.light-theme) .mobile-sub-categories .el-tag::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(0, 255, 255, 0.1),
    rgba(255, 0, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  animation: holoShift 3s linear infinite;
}

/* 动画定义 */
@keyframes holoScan {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

@keyframes glitchLine {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

@keyframes gridPulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes holoShift {
  0% {
    opacity: 0;
    transform: rotate(45deg) translateY(-100%);
  }
  30% {
    opacity: 0.3;
  }
  70% {
    opacity: 0.1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translateY(100%);
  }
}

/* 使用 CSS containment 优化渲染性能 */
.home-container {
  contain: content;
}

/* 使用 will-change 提示浏览器优化动画 */
.mobile-categories :deep(.el-collapse-item__header)::before,
.mobile-categories :deep(.el-collapse-item__header)::after {
  will-change: transform, opacity;
}

/* 使用 transform 替代 left/top 动画 */
@keyframes holoScan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

/* 减少重绘的动画属性 */
.mobile-categories :deep(.el-collapse-item) {
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style> 