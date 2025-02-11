import { defineStore } from 'pinia'
import { getCategories } from '@/api/category'

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
    }
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const response = await getCategories()
        if (response.state === 200) {
          this.categories = response.data
        } else {
          throw new Error(response.message || '获取分类失败')
        }
        return response.data
      } catch (error) {
        this.error = error.message || '获取分类失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 根据分类ID获取分类信息
    getCategoryById(categoryId) {
      return this.categories.find(category => category.categoryId === categoryId)
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