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
          :class="{ 'search-active': isSearchFocused }"
        >
          <template #append>
            <el-button 
              @click="handleSearch" 
              class="search-button"
              :class="{ 'search-button-active': isSearchFocused }"
            >
              <span class="button-text">搜索</span>
              <div class="button-glitch"></div>
            </el-button>
          </template>
        </el-input>
        <div class="search-decoration left"></div>
        <div class="search-decoration right"></div>
      </div>
      <nav class="nav-links">
        <ThemeToggle @theme-change="handleThemeChange" />
        <el-button class="nav-home" @click="goToHome">首页</el-button>
        <el-button class="nav-cart" @click="goToCart">购物车</el-button>
        <el-button class="nav-profile" @click="goToProfile">个人中心</el-button>
      </nav>
    </header>
    <div class="navbar-placeholder" v-show="isNavFixed"></div>

    <section class="main-content">
      <el-row :gutter="20">
        <el-col :span="6">
          <section class="categories">
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
              >
                {{ category.name }}
              </el-menu-item>
            </el-menu>
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
        <el-col :span="18">
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
      <div class="title-container" :class="{ 'dark-mode': isDarkTheme }">
        <h2>热销商品</h2>
        <!-- 动态生成叶子 -->
        <div v-if="!isDarkTheme" class="leaves-wrapper" ref="leavesWrapper">
          <!-- 叶子会通过 JS 动态生成 -->
        </div>
        <!-- 闪电效果 -->
        <template v-else>
          <div class="lightning-extra"></div>
        </template>
      </div>
      <el-row :gutter="20">
        <el-col v-for="product in products" :key="product.id" :span="6">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import ImageLoader from '@/components/ImageLoader.vue'
import CyberText from '@/components/CyberText.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import ThemeAnimation from '@/components/ThemeAnimation.vue'

const router = useRouter()
const searchKeyword = ref('')
const activeIndex = ref('0')
const activeCategory = ref(null)

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
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  activeCategory.value = category
}

// 处理鼠标进入二级菜单
const handleSubmenuEnter = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
}

// 处理鼠标离开二级菜单
const handleSubmenuLeave = () => {
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

const handleSearch = () => {
  console.log('搜索关键词:', searchKeyword.value)
  // 这里添加搜索逻辑
}

const isNavFixed = ref(false)
const navbarHeight = ref(0)

// 监听滚动事件
const handleScroll = () => {
  if (window.scrollY > 0) {
    isNavFixed.value = true
  } else {
    isNavFixed.value = false
  }
}

onMounted(() => {
  // 获取导航栏高度
  const navbar = document.querySelector('.navbar')
  if (navbar) {
    navbarHeight.value = navbar.offsetHeight
  }
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll)
})

const isSearchFocused = ref(false)

const handleSearchFocus = () => {
  isSearchFocused.value = true
}

const handleSearchBlur = () => {
  isSearchFocused.value = false
}

const isDarkTheme = ref(false)

const handleThemeChange = (isDark) => {
  isDarkTheme.value = isDark
}

// 叶子生成相关
const leavesWrapper = ref(null)
const leafTypes = ['🍂', '🍁']

const createLeaf = () => {
  const leaf = document.createElement('span')
  leaf.className = 'leaf'
  leaf.textContent = leafTypes[Math.floor(Math.random() * leafTypes.length)]
  
  const startY = Math.random() * 60
  const size = 14 + Math.random() * 6
  const duration = 4 + Math.random() * 2
  
  leaf.style.cssText = `
    font-size: ${size}px;
    position: absolute;
    left: 100%;
    top: ${startY}px;
    opacity: 0.8;
    animation: leafFloat ${duration}s linear forwards;
    transform-origin: center;
  `
  
  leaf.addEventListener('animationend', () => {
    leaf.remove()
  })
  
  return leaf
}

const generateLeaves = () => {
  if (!leavesWrapper.value || isDarkTheme.value) return
  
  const count = 1 + Math.floor(Math.random() * 2)
  
  for (let i = 0; i < count; i++) {
    const leaf = createLeaf()
    leavesWrapper.value.appendChild(leaf)
  }
}

let leafInterval

onMounted(() => {
  const startLeafGeneration = () => {
    generateLeaves()
    leafInterval = setTimeout(startLeafGeneration, 1000 + Math.random() * 1500)
  }
  startLeafGeneration()
})

onUnmounted(() => {
  if (leafInterval) {
    clearTimeout(leafInterval)
  }
})
</script>

<style scoped>
.home-container {
  padding: 20px;
  background-color: #0B0B2B;
  background-image: 
    linear-gradient(
      45deg,
      rgba(11, 11, 43, 0.97),
      rgba(20, 10, 40, 0.97)
    );
  min-height: 100vh;
  color: #fff;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: linear-gradient(
    rgba(13, 13, 48, 0.95),
    rgba(23, 12, 45, 0.95)
  );
  backdrop-filter: blur(8px);
  border-bottom: 2px solid rgba(255, 0, 255, 0.3);
  box-shadow: 
    0 0 20px rgba(0, 255, 255, 0.2),
    inset 0 0 20px rgba(255, 0, 255, 0.2);
  border-top: 3px solid #FF00FF;
  transition: all 0.3s ease;
  width: 100%;
  z-index: 1000;
}

.navbar::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    #00FFFF,
    #FF00FF,
    transparent
  );
  animation: neonFlow 2s linear infinite;
}

@keyframes neonFlow {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  animation: slideDown 0.3s ease;
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
}

.nav-links {
  display: flex;
  gap: 15px;
}

.main-content {
  margin: 20px 0;
}

.carousel {
  margin: 20px 0;
}

.carousel-image {
  width: 100%;
  height: auto;
}

.categories {
  position: relative;
  margin-top: 20px;
}

.category-menu {
  border-right: none;
  width: 160px;
  background: linear-gradient(
    to right,
    rgba(20, 15, 25, 0.95),
    rgba(15, 10, 20, 0.95)
  );
  border: 2px solid #4B0082;
  clip-path: polygon(0 0, 95% 0, 100% 100%, 5% 100%);
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
  left: 160px;
  top: 0;
  width: 200px;
  min-height: 100%;
  background: linear-gradient(
    135deg,
    rgba(32, 16, 16, 0.9),
    rgba(16, 16, 32, 0.9)
  );
  border: 2px solid #8B4513;
  clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
  padding: 15px;
  z-index: 10;
  animation: hologramAppear 0.3s ease;
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
}

.product-card img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-info {
  margin-top: 10px;
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
  border: 1px solid rgba(139, 109, 30, 0.2);
  border-radius: 4px;
  padding: 15px;
  box-shadow: 
    0 5px 20px rgba(139, 109, 30, 0.15),
    inset 0 0 10px rgba(139, 109, 30, 0.05);
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
  border-bottom: 1px solid rgba(139, 109, 30, 0.2);
  text-align: center;
  position: relative;
}

.light-theme .sub-menu h3::before,
.light-theme .sub-menu h3::after {
  content: '〜';
  position: absolute;
  top: 0;
  color: rgba(139, 109, 30, 0.4);
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
  border: 1px solid rgba(139, 109, 30, 0.2);
  position: relative;
  overflow: hidden;
}

.light-theme .sub-category:hover {
  color: #1B3B1B;
  background: rgba(139, 109, 30, 0.15);
  transform: translateY(-2px);
  box-shadow: 
    0 3px 10px rgba(139, 109, 30, 0.1),
    inset 0 0 5px rgba(139, 109, 30, 0.05);
  border-color: rgba(139, 109, 30, 0.4);
}

.light-theme .sub-category::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(139, 109, 30, 0.1), transparent);
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
  color: rgba(139, 109, 30, 0.4);
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
  border: 1px solid rgba(139, 109, 30, 0.2);
  z-index: -1;
}

.light-theme .product-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 10px 20px rgba(139, 109, 30, 0.15),
    0 0 15px rgba(139, 109, 30, 0.1);
}

.light-theme .product-card:hover::after {
  border-color: rgba(139, 109, 30, 0.4);
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
    rgba(139, 109, 30, 0.2),
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
  border: 1px solid rgba(139, 109, 30, 0.3);
  color: #8B4513;
  transition: all 0.3s ease;
}

.light-theme .product-info .el-button:hover {
  background: rgba(139, 109, 30, 0.1);
  border-color: rgba(139, 109, 30, 0.5);
  color: #A0522D;
  transform: translateY(-2px);
  box-shadow: 
    0 5px 15px rgba(139, 109, 30, 0.1),
    inset 0 0 5px rgba(139, 109, 30, 0.05);
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
  border: 1px solid rgba(139, 109, 30, 0.1);
}

.light-theme .product-card:hover img {
  transform: scale(1.02);
  border-color: rgba(139, 109, 30, 0.3);
}

/* 装饰性角落 */
.light-theme .product-card::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-top: 2px solid rgba(139, 109, 30, 0.2);
  border-left: 2px solid rgba(139, 109, 30, 0.2);
  top: 10px;
  left: 10px;
}

.light-theme .product-card::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-bottom: 2px solid rgba(139, 109, 30, 0.2);
  border-right: 2px solid rgba(139, 109, 30, 0.2);
  bottom: 10px;
  right: 10px;
}

.light-theme .search-container {
  position: relative;
  background: rgba(244, 236, 216, 0.95);
  border: 1px solid rgba(139, 109, 30, 0.3);
  border-radius: 4px;
  padding: 2px;
  box-shadow: 
    0 5px 15px rgba(139, 109, 30, 0.1),
    inset 0 0 10px rgba(139, 109, 30, 0.05);
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
    color: rgba(139, 109, 30, 0.6);
  }
}

.light-theme :deep(.el-input__prefix-inner) {
  color: rgba(139, 109, 30, 0.6);
}

.light-theme .search-button {
  background: transparent;
  border: 1px solid rgba(139, 109, 30, 0.3);
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
  background: rgba(139, 109, 30, 0.1);
  border-color: rgba(139, 109, 30, 0.5);
  transform: translateY(-1px);
  box-shadow: 
    0 5px 15px rgba(139, 109, 30, 0.1),
    inset 0 0 5px rgba(139, 109, 30, 0.05);
}

.light-theme .search-decoration {
  display: none;
}

.light-theme .search-active {
  border-color: rgba(139, 109, 30, 0.5);
  box-shadow: 
    0 5px 15px rgba(139, 109, 30, 0.15),
    inset 0 0 10px rgba(139, 109, 30, 0.1);
}

/* 导航栏按钮样式 */
.light-theme .nav-links {
  display: flex;
  gap: 15px;
  align-items: center;
}

.light-theme .nav-links :deep(.el-button) {
  background: rgba(244, 236, 216, 0.95);
  border: 1px solid rgba(139, 109, 30, 0.3);
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
    background: rgba(139, 109, 30, 0.1);
    border-color: rgba(139, 109, 30, 0.5);
    transform: translateY(-2px);
    box-shadow: 
      0 5px 15px rgba(139, 109, 30, 0.1),
       inset 0 0 5px rgba(139, 109, 30, 0.05);
  }
}

/* 为每个导航按钮添加独特的装饰 */
.light-theme .nav-links :deep(.nav-home::after) {
  content: '『家』';
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 0.7em;
  color: rgba(139, 109, 30, 0.4);
}

.light-theme .nav-links :deep(.nav-cart::after) {
  content: '『市』';
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 0.7em;
  color: rgba(139, 109, 30, 0.4);
}

.light-theme .nav-links :deep(.nav-profile::after) {
  content: '『我』';
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 0.7em;
  color: rgba(139, 109, 30, 0.4);
}

.title-container {
  margin-bottom: 30px;
  padding: 20px 0;
  position: relative;
  overflow: hidden;
  text-align: center;
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
    left: 100%;
    transform: rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  50% {
    left: 50%;
    transform: rotate(180deg);
  }
  90% {
    opacity: 0.8;
  }
  100% {
    left: -10%;
    transform: rotate(360deg);
    opacity: 0;
  }
}

/* 黑夜模式的闪电动画 */
.dark-mode::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%,
    transparent 20%,
    rgba(255, 0, 255, 0.1) 45%,
    rgba(0, 255, 255, 0.4) 48%,
    rgba(255, 0, 255, 0.1) 51%,
    transparent 80%,
    transparent 100%
  );
  opacity: 0;
  animation: horizontalFlash 3s infinite;
  transform: translateX(-100%);
}

.dark-mode::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg,
    transparent 0%,
    transparent 30%,
    rgba(0, 255, 255, 0.1) 45%,
    rgba(255, 0, 255, 0.4) 48%,
    rgba(0, 255, 255, 0.1) 51%,
    transparent 70%,
    transparent 100%
  );
  opacity: 0;
  animation: horizontalFlash 3s infinite;
  animation-delay: 1.5s;
  transform: translateX(-100%);
}

@keyframes horizontalFlash {
  0%, 100% { 
    opacity: 0;
    transform: translateX(-100%);
  }
  40% {
    opacity: 1;
    transform: translateX(0%);
  }
  45% {
    opacity: 0;
    transform: translateX(-20%);
  }
  50% {
    opacity: 1;
    transform: translateX(0%);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* 添加额外的闪电效果 */
.dark-mode .lightning-extra {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #FF00FF, #00FFFF);
  opacity: 0;
  animation: lightningPulse 3s infinite;
  animation-delay: 0.5s;
}

@keyframes lightningPulse {
  0%, 100% { 
    opacity: 0;
    transform: scaleX(0);
  }
  50% { 
    opacity: 0.6;
    transform: scaleX(1);
  }
}

/* 标题样式 */
.light-theme .title-container {
  background: rgba(244, 236, 216, 0.8);
  border: 1px solid rgba(139, 109, 30, 0.2);
  border-radius: 4px;
  box-shadow: 
    0 5px 15px rgba(139, 109, 30, 0.1),
    inset 0 0 10px rgba(139, 109, 30, 0.05);
}

.light-theme .title-container h2 {
  color: #8B4513;
  font-family: "楷体", "KaiTi", serif;
  letter-spacing: 4px;
  text-shadow: 2px 2px 4px rgba(139, 109, 30, 0.1);
}

.dark-mode {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 0, 255, 0.2);
  border-radius: 4px;
  box-shadow: 
    0 0 20px rgba(255, 0, 255, 0.1),
    inset 0 0 10px rgba(0, 255, 255, 0.1);
}

.dark-mode h2 {
  color: #fff;
  text-shadow: 
    0 0 10px rgba(255, 0, 255, 0.5),
    0 0 20px rgba(0, 255, 255, 0.3);
}

.leaves-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.leaf {
  position: absolute;
  color: #8B4513;
  pointer-events: none;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.1));
}

@keyframes leafFloat {
  0% {
    left: 100%;
    transform: rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  50% {
    left: 50%;
    transform: rotate(180deg);
  }
  90% {
    opacity: 0.8;
  }
  100% {
    left: -10%;
    transform: rotate(360deg);
    opacity: 0;
  }
}
</style> 