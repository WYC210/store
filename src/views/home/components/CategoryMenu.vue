<template>
  <section class="categories" :style="{ height: `${parseInt(contentHeight) + 48}px` }">
    <!-- 移动端分类 -->
    <div class="mobile-categories" v-if="isMobileView">
      <h2>商品分类</h2>
      <el-collapse v-model="activeCollapse" v-loading="categoriesLoading">
        <el-collapse-item 
          v-for="category in categories" 
          :key="category.categoryId"
          :title="category.name"
          :name="category.categoryId"
        >
          <div class="mobile-sub-categories">
            <span
              v-for="subCategory in category.children"
              :key="subCategory.categoryId"
              class="mobile-sub-category"
              @click="handleSubCategoryClick(subCategory)"
            >
              {{ subCategory.name }}
            </span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 桌面端分类 -->
    <template v-else>
      <h2>商品分类</h2>
      <el-menu 
        v-loading="categoriesLoading"
        class="category-menu" 
        :default-active="activeIndex"
        :style="{ height: 'calc(100% - 60px)' }"
      >
        <el-menu-item 
          v-for="category in categories" 
          :key="category.categoryId"
          :index="String(category.categoryId)"
          @mouseenter="handleMouseEnter(category)"
          @mouseleave="handleMenuItemLeave"
          @click="handleCategoryClick(category)"
        >
          {{ category.name }}
        </el-menu-item>
      </el-menu>
      
      <!-- 子分类菜单 -->
      <div 
        class="sub-menu" 
        v-show="activeCategory && activeCategory.children?.length"
        @mouseenter="clearHideTimer"
        @mouseleave="handleSubmenuLeave"
      >
        <h3>{{ activeCategory?.name }}</h3>
        <div class="sub-categories">
          <span 
            v-for="subCategory in activeCategory?.children" 
            :key="subCategory.categoryId"
            class="sub-category"
            @click="handleSubCategoryClick(subCategory)"
          >
            {{ subCategory.name }}
          </span>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategories } from '../composables/useCategories'
import { useBreakpoints } from '@vueuse/core'

const props = defineProps({
  contentHeight: {
    type: [String, Number],
    default: '600'
  }
})

const emit = defineEmits(['category-change'])

const {
  categories,
  categoriesLoading,
  activeCategory,
  activeCollapse,
  fetchCategories,
  handleCategoryClick,
  handleSubCategoryClick
} = useCategories()

const breakpoints = useBreakpoints({
  mobile: 768
})

const isMobileView = computed(() => breakpoints.smaller('mobile'))
const activeIndex = ref('0')
let hideTimer = null

// 在组件挂载时获取分类数据
onMounted(async () => {
  await fetchCategories()
})

// 鼠标进入分类
const handleMouseEnter = (category) => {
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
  activeCategory.value = category
}

// 清除隐藏定时器
const clearHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// 处理菜单项离开
const handleMenuItemLeave = () => {
  hideTimer = setTimeout(() => {
    activeCategory.value = null
  }, 200)
}

// 处理子菜单离开
const handleSubmenuLeave = () => {
  hideTimer = setTimeout(() => {
    activeCategory.value = null
  }, 200)
}

// 处理分类点击，向父组件发送事件
const handleCategorySelect = (category) => {
  handleCategoryClick(category)
  emit('category-change', category)
}

// 处理子分类点击，向父组件发送事件
const handleSubCategorySelect = (subCategory) => {
  handleSubCategoryClick(subCategory)
  emit('category-change', subCategory)
}
</script>

<style scoped>
.categories {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 15px;
  overflow: hidden;
}

h2 {
  color: var(--starlight);
  margin-bottom: 20px;
  font-size: 1.2em;
}

.category-menu {
  background: transparent;
  border: none;
}

.category-menu :deep(.el-menu-item) {
  color: var(--starlight);
  transition: all 0.3s;
}

.category-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 97, 210, 0.1);
}

.category-menu :deep(.el-menu-item.is-active) {
  color: var(--cosmic-blue);
  background: rgba(255, 97, 210, 0.1);
}

.sub-menu {
  position: absolute;
  left: 100%;
  top: 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  min-width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(255, 97, 210, 0.1);
  margin-left: 10px;
  z-index: 10;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.sub-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sub-category {
  color: var(--starlight);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 97, 210, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sub-category:hover {
  color: var(--cosmic-blue);
  background: rgba(255, 97, 210, 0.2);
  border-color: var(--cosmic-blue);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 97, 210, 0.2);
}

.sub-menu h3 {
  color: var(--cosmic-blue);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 移动端样式 */
.mobile-categories {
  width: 100%;
}

.mobile-sub-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 0;
}

.mobile-sub-category {
  color: var(--starlight);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  background: rgba(255, 97, 210, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.mobile-sub-category:hover {
  color: var(--cosmic-blue);
  background: rgba(255, 97, 210, 0.2);
  border-color: var(--cosmic-blue);
  transform: translateY(-1px);
}

:deep(.el-collapse) {
  border: none;
  background: transparent;
}

:deep(.el-collapse-item__header) {
  background: transparent;
  color: var(--starlight);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-collapse-item__content) {
  background: transparent;
  color: var(--starlight);
  padding: 15px 0;
}

/* 覆盖 Element Plus 的菜单样式 */
:deep(.el-menu) {
  background: transparent;
  border: none;
}

:deep(.el-menu-item) {
  background: transparent !important;
  color: var(--starlight) !important;
  transition: all 0.3s;
}

:deep(.el-menu-item:hover) {
  background: rgba(255, 97, 210, 0.1) !important;
}

:deep(.el-menu-item.is-active) {
  color: var(--cosmic-blue) !important;
  background: rgba(255, 97, 210, 0.1) !important;
}

/* 覆盖折叠面板样式 */
:deep(.el-collapse) {
  border: none;
  background: transparent;
}

:deep(.el-collapse-item__header) {
  background: transparent !important;
  color: var(--starlight) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-collapse-item__wrap) {
  background: transparent !important;
  border: none;
}

:deep(.el-collapse-item__content) {
  background: transparent !important;
  color: var(--starlight) !important;
  padding: 15px 0;
}

/* 移除默认的边框和背景 */
:deep(.el-menu--popup) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

:deep(.el-menu--popup-right-start) {
  margin-left: 10px !important;
}

:deep(.el-menu--popup .el-menu-item) {
  background: transparent !important;
  color: var(--starlight) !important;
}

:deep(.el-menu--popup .el-menu-item:hover) {
  background: rgba(255, 97, 210, 0.1) !important;
}

:deep(.el-menu--popup .el-menu-item.is-active) {
  color: var(--cosmic-blue) !important;
  background: rgba(255, 97, 210, 0.1) !important;
}
</style> 