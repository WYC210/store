import { defineStore } from 'pinia'
import { categoryService } from '@/api/category'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null
  }),

  getters: {
    // 获取所有顶级分类
    topLevelCategories: (state) => {
      return state.categories.filter(category => !category.parentCategoryId)
    },

    // 获取指定父分类的子分类
    getChildCategories: (state) => (parentId) => {
      return state.categories.filter(category => category.parentCategoryId === parentId)
    },

    // 根据分类ID获取分类信息
    getCategoryById: (state) => (categoryId) =>
      state.categories.find(category => category.categoryId === categoryId)
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const { data } = await categoryService.getCategories()
        this.categories = data
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取分类的完整路径
    getCategoryPath(categoryId) {
      const path = []
      let currentCategory = this.getCategoryById(categoryId)
      
      while (currentCategory) {
        path.unshift(currentCategory)
        currentCategory = this.getCategoryById(currentCategory.parentCategoryId)
      }
      
      return path
    }
  }
}) 