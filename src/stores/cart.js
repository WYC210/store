import { defineStore } from 'pinia'
import { getCartItems, updateCartItem, removeFromCart } from '@/api/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
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
    async fetchCartItems() {
      this.loading = true
      try {
        const response = await getCartItems()
        if (response.state === 200) {
          this.cartItems = response.data.map(item => ({
            ...item,
            selected: false
          }))
        } else {
          throw new Error(response.message || '获取购物车失败')
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCartItem(item) {
      try {
        const response = await updateCartItem(item)
        if (response.state === 200) {
          const index = this.cartItems.findIndex(i => i.id === item.id)
          if (index !== -1) {
            this.cartItems[index] = {
              ...this.cartItems[index],
              ...item
            }
          }
        } else {
          throw new Error(response.message || '更新购物车失败')
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async removeCartItem(itemId) {
      try {
        const response = await removeFromCart(itemId)
        if (response.state === 200) {
          this.cartItems = this.cartItems.filter(item => item.id !== itemId)
        } else {
          throw new Error(response.message || '删除商品失败')
        }
      } catch (error) {
        this.error = error.message
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