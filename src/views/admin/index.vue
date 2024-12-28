<template>
  <div class="admin-container" :class="{ 'dark': isDarkTheme }">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 
      'collapsed': isCollapsed && !isMobile,
      'mobile': isMobile,
      'mobile-open': isMobileMenuOpen
    }">
      <div class="logo-container">
        <img src="@/assets/logo_w.png" alt="Logo" class="logo" />
        <span class="title" v-if="!isCollapsed">后台管理系统</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :collapse="isCollapsed"
        :class="{ 'dark': isDarkTheme }"
        router
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataLine /></el-icon>
          <template #title>数据概览</template>
        </el-menu-item>
        
        <el-sub-menu index="products">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/admin/products/list">商品列表</el-menu-item>
          <el-menu-item index="/admin/products/category">分类管理</el-menu-item>
          <el-menu-item index="/admin/products/add">添加商品</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="orders">
          <template #title>
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/admin/orders/list">订单列表</el-menu-item>
          <el-menu-item index="/admin/orders/stats">订单统计</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="users">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/admin/users/list">用户列表</el-menu-item>
          <el-menu-item index="/admin/users/roles">角色管理</el-menu-item>
        </el-sub-menu>
        
        <el-menu-item index="/admin/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
      
      <div class="sidebar-footer">
        <button 
          class="theme-toggle" 
          :class="{ 'dark': isDarkTheme }"
          @click="toggleTheme"
        >
          <el-icon>
            <component :is="isDarkTheme ? 'Moon' : 'Sunny'" />
          </el-icon>
        </button>
        <el-button 
          class="collapse-btn"
          @click="toggleCollapse"
        >
          <el-icon>
            <component :is="isCollapsed ? 'Expand' : 'Fold'" />
          </el-icon>
        </el-button>
      </div>
    </aside>

    <!-- 移动端遮罩层 -->
    <div 
      class="mobile-overlay" 
      v-show="isMobile && isMobileMenuOpen"
      @click="closeMobileMenu"
    ></div>

    <!-- 主内容区 -->
    <div class="main-content">
      <header class="admin-header">
        <button 
          class="mobile-menu-btn" 
          @click="toggleMobileMenu" 
          v-show="isMobile"
        >
          <el-icon><Menu /></el-icon>
        </button>
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>{{ currentPath }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="user-info">
          <button 
            class="collapse-btn desktop-only" 
            @click="toggleCollapse"
          >
            <el-icon>
              <component :is="isCollapsed ? 'Expand' : 'Fold'" />
            </el-icon>
          </button>
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :size="32" :src="userAvatar" />
              <span class="username">{{ username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile">个人信息</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      <div class="content-wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Moon,
  Sunny,
  Expand,
  Fold,
  DataLine,
  Goods,
  List,
  User,
  Setting,
  Menu
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isCollapsed = ref(false)
const isDarkTheme = ref(localStorage.getItem('isDarkTheme') === 'true')
const activeMenu = ref('/admin/dashboard')
const username = ref('Admin')
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

// 计算当前路径名称
const currentPath = computed(() => {
  const pathMap = {
    dashboard: '首页',
    'products/list': '商品列表',
    'products/category': '分类管理',
    'products/add': '添加商品',
    'orders/list': '订单列表',
    'orders/stats': '订单统计',
    'users/list': '用户列表',
    'users/roles': '角色管理',
    settings: '系统设置'
  }
  const path = route.path.split('/admin/')[1]
  return pathMap[path] || '数据概览'
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  localStorage.setItem('isDarkTheme', isDarkTheme.value)
  if (isDarkTheme.value) {
    document.documentElement.classList.add('dark')
    document.body.setAttribute('class', 'el-popup-parent--hidden dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.body.setAttribute('class', 'el-popup-parent--hidden')
  }
}

// 初始化主题
onMounted(() => {
  if (isDarkTheme.value) {
    document.documentElement.classList.add('dark')
    document.body.setAttribute('class', 'el-popup-parent--hidden dark')
  }
})

const goToProfile = () => {
  router.push('/admin/profile')
}

const handleLogout = () => {
  // 实现登出逻辑
  router.push('/login')
}

// 响应式相关
const isMobile = ref(window.innerWidth <= 768)
const isMobileMenuOpen = ref(false)

// 监听窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

// 移动端菜单控制
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 路由变化时关闭移动端菜单
watch(route, () => {
  if (isMobile.value) {
    closeMobileMenu()
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
:root {
  /* 亮色主题变量 */
  --bg-color: #ffffff;
  --text-color: #333333;
  --sidebar-bg: #f5f5f5;
  --border-color: #e4e4e4;
}

:root.dark {
  /* 暗色主题变量 */
  --bg-color: #121212;
  --text-color: #ffffff;
  --sidebar-bg: #1e1e1e;
  --border-color: #333333;
  
  /* Element Plus 暗色主题变量覆盖 */
  --el-bg-color: #121212;
  --el-bg-color-overlay: #1e1e1e;
  --el-text-color-primary: #ffffff;
  --el-text-color-regular: #e5eaf3;
  --el-border-color: #333333;
  --el-border-color-light: #333333;
  --el-mask-color: rgba(0, 0, 0, 0.8);
  
  /* 菜单暗色主题 */
  --el-menu-bg-color: #1e1e1e;
  --el-menu-text-color: #ffffff;
  --el-menu-hover-bg-color: #2d2d2d;
  --el-menu-active-color: #409eff;
  --el-menu-item-height: 50px;
}

/* 全局样式 */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.sidebar {
  width: 260px;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 64px;
}

.logo-container {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 60px;
}

.logo {
  width: 32px;
  height: 32px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-header {
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-color);
}

.content-wrapper {
  flex: 1;
  padding: 20px;
  background-color: var(--bg-color);
}

/* 暗色主题样式 */
.admin-container.dark {
  /* 菜单暗色主题样式 */
  :deep(.el-menu) {
    background-color: var(--el-menu-bg-color);
    border-right: 1px solid var(--el-border-color);
  }

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    color: var(--el-menu-text-color);
  }

  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    background-color: var(--el-menu-hover-bg-color);
  }

  :deep(.el-menu-item.is-active) {
    background-color: var(--el-menu-hover-bg-color);
    color: var(--el-menu-active-color);
  }

  /* 下拉菜单暗色主题 */
  :deep(.el-dropdown-menu) {
    background-color: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color);
  }

  :deep(.el-dropdown-menu__item) {
    color: var(--el-text-color-primary);
  }

  :deep(.el-dropdown-menu__item:hover) {
    background-color: var(--el-menu-hover-bg-color);
  }

  /* 面包屑导航暗色主题 */
  :deep(.el-breadcrumb__inner) {
    color: var(--el-text-color-regular);
  }

  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: var(--el-text-color-primary);
  }
}

.sidebar-footer {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid var(--border-color);
}

.theme-toggle {
  width: 100%;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.collapse-btn {
  width: 100%;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  margin-left: 8px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* 移动端样式 */
.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  margin-right: 12px;
  z-index: 1000;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    position: relative;
    left: auto;
    top: auto;
  }

  .sidebar {
    position: fixed;
    left: -260px;
    top: 0;
    bottom: 0;
    z-index: 99;
    transition: all 0.3s ease-in-out;
    box-shadow: none;
  }

  .sidebar.mobile-open {
    left: 0;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }

  .main-content {
    margin-left: 0;
    padding-top: 60px;
  }

  .admin-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 97;
    padding: 0 16px;
    display: flex;
    align-items: center;
    background-color: var(--bg-color);
    height: 60px;
  }

  .breadcrumb {
    flex: 1;
    margin: 0 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* 桌面端折叠按钮样式 */
  .collapse-btn.desktop-only {
    padding: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--text-color);
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .collapse-btn.desktop-only:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .admin-container.dark .collapse-btn.desktop-only:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .desktop-only {
    display: none;
  }

  .content-wrapper {
    padding: 10px;
  }

  /* 调整用户信息显示 */
  .user-info .username {
    display: none;
  }

  /* 调整面包屑导航 */
  .breadcrumb {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 确保移动端只显示一个菜单按钮 */
  .mobile-menu-btn:not(:first-child) {
    display: none;
  }
}

/* 确保暗色主题下移动端样式正确 */
.admin-container.dark .mobile-menu-btn {
  background: transparent;
  border: none;
}

.admin-container.dark .mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* 平板设备优化 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }

  .content-wrapper {
    padding: 15px;
  }
}

/* 确保折叠按钮在桌面端可见 */
@media screen and (min-width: 769px) {
  .collapse-btn.desktop-only {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.breadcrumb {
  flex: 1;
  margin: 0 16px;
  display: flex;
  align-items: center;
}
</style> 