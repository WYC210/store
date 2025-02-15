import { defineStore } from 'pinia'
import { getCartItems, updateCartItem, removeFromCart } from '@/api/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
    totalCount: 0,
    loading: false,
    error: null
  }),

  getters: {
    totalItems: (state) => state.cartItems.length,
    selectedItems: (state) => state.cartItems.filter(item => item.selected),
    totalPrice: (state) => {
      return state.cartItems.reduce((total, item) => {
        if (item.selected) {
          return total + (item.product.price * item.quantity)
        }
        return total
      }, 0)
    }
  },

  actions: {
    async fetchCartItems(items) {
      try {
        if (Array.isArray(items)) {
          this.cartItems = items.map(item => ({
            ...item,
            selected: false,
            id: item.cartItemId
          }))
          this.totalCount = this.cartItems.length
        } else {
          console.error('购物车数据格式错误:', items)
          throw new Error('购物车数据格式错误')
        }
      } catch (error) {
        console.error('处理购物车数据失败:', error)
        throw error
      }
    },

    async updateCartItem(data) {
      try {
        const index = this.cartItems.findIndex(item => item.id === data.id)
        if (index !== -1) {
          this.cartItems[index] = { ...this.cartItems[index], ...data }
        }
      } catch (error) {
        console.error('更新购物车商品失败:', error)
        throw error
      }
    },

    async removeCartItem(itemId) {
      try {
        const index = this.cartItems.findIndex(item => item.id === itemId)
        if (index !== -1) {
          this.cartItems.splice(index, 1)
          this.totalCount = this.cartItems.length
        }
      } catch (error) {
        console.error('移除购物车商品失败:', error)
        throw error
      }
    },

    updateSelection(items) {
      this.cartItems = items
    },

    clearCart() {
      this.cartItems = []
    }
  }
}) 