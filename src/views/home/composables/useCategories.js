import { ref, computed } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { ElMessage } from 'element-plus'

export function useCategories() {
  const categoryStore = useCategoryStore()
  const activeCategory = ref(null)
  const activeCollapse = ref([])

  const fetchCategories = async () => {
    try {
      await categoryStore.fetchCategories()
    } catch (error) {
      console.error('获取分类失败:', error)
      ElMessage.error(error.message || '获取分类失败')
    }
  }

  const handleCategoryClick = (category) => {
    activeCategory.value = category
  }

  const handleSubCategoryClick = (subCategory) => {
    // 处理子分类点击
  }

  // 使用 computed 确保返回的始终是数组
  const categories = computed(() => categoryStore.categories || [])

  return {
    categories,
    categoriesLoading: computed(() => categoryStore.loading),
    activeCategory,
    activeCollapse,
    fetchCategories,
    handleCategoryClick,
    handleSubCategoryClick
  }
} 