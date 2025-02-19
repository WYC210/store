<template>
  <div class="product-sorter">
    <el-radio-group 
      v-model="currentSort" 
      size="large"
      @change="handleSortChange"
    >
      <el-radio-button 
        v-for="option in sortOptions" 
        :key="option.value" 
        :label="option.value"
      >
        <el-icon v-if="option.icon">
          <component :is="getIcon(option.icon)" />
        </el-icon>
        {{ option.label }}
      </el-radio-button>
    </el-radio-group>

    <div class="view-mode">
      <el-tooltip content="网格视图" placement="top">
        <el-button 
          :type="currentView === 'grid' ? 'primary' : 'default'"
          @click="toggleViewMode('grid')"
          class="view-btn"
        >
          <el-icon><Grid /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="列表视图" placement="top">
        <el-button 
          :type="currentView === 'list' ? 'primary' : 'default'"
          @click="toggleViewMode('list')"
          class="view-btn"
        >
          <el-icon><List /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Grid, List, Timer, StarFilled, Sell, SortUp, SortDown } from '@element-plus/icons-vue'
import { useProductSort } from '../composables/useProductSort'

// 定义 props 和 emits
const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  currentView: {
    type: String,
    default: 'grid'
  }
})

const emit = defineEmits(['sort-change', 'view-change'])

// 使用排序 composable
const { sortOptions } = useProductSort()

// 当前排序方式
const currentSort = ref('default')

// 获取图标组件
const getIcon = (iconName) => {
  const icons = {
    Timer,
    StarFilled,
    Sell,
    SortUp,
    SortDown
  }
  return icons[iconName]
}

// 处理排序变化
const handleSortChange = (value) => {
  console.log('排序方式变化:', value)
  currentSort.value = value
  emit('sort-change', value)
}

// 切换视图模式
const toggleViewMode = (mode) => {
  console.log('切换视图模式:', mode)
  emit('view-change', mode)
}
</script>

<style scoped>
.product-sorter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(6, 5, 36, 0.95);
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(250, 159, 252, 0.3);
}

:deep(.el-radio-button__inner) {
  background: transparent;
  border-color: rgba(250, 159, 252, 0.3);
  color: #fff;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: rgba(250, 159, 252, 0.2);
  border-color: rgba(250, 159, 252, 0.5);
  box-shadow: -1px 0 0 0 rgba(250, 159, 252, 0.5);
}

.view-mode {
  display: flex;
  gap: 10px;
}

:deep(.el-button) {
  background: transparent;
  border-color: rgba(250, 159, 252, 0.3);
  color: #fff;
}

:deep(.el-button:hover) {
  background: rgba(250, 159, 252, 0.1);
  border-color: rgba(250, 159, 252, 0.5);
}

:deep(.el-button.el-button--primary) {
  background: rgba(250, 159, 252, 0.2);
  border-color: rgba(250, 159, 252, 0.5);
}

.el-icon {
  margin-right: 4px;
}

/* 动画效果 */
:deep(.el-radio-button__inner),
:deep(.el-button) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 霓虹灯效果 */
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  animation: neonGlow 2s infinite;
}

@keyframes neonGlow {
  0% {
    box-shadow: 0 0 5px rgba(250, 159, 252, 0.2);
  }
  50% {
    box-shadow: 0 0 10px rgba(250, 159, 252, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(250, 159, 252, 0.2);
  }
}
</style> 