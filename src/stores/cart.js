import { defineStore } from 'pinia'
import { cartService } from '@/api/cart'
import { useCheckoutStore } from '@/stores/checkout'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { ElMessage } from 'element-plus'

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
          return total + (item.price * item.quantity)
        }
        return total
      }, 0)
    }
  },

  actions: {
    async fetchCartItems() {
      try {
        this.loading = true
        const response = await cartService.getCartItems()
        console.log('获取购物车数据响应666666666666666666666666666666666666666:', response)

        if (response?.state === 200 && Array.isArray(response.data)) {
          this.cartItems = response.data.map(item => ({
            id: item.cartItemId,
            cartId: item.cartId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.productName,
            imageUrl: item.imageUrl ? `http://localhost:8088/product${item.imageUrl}` : '',
            selected: false,
            createdTime: item.createdTime,
            modifiedTime: item.modifiedTime,
            availableQuantity: item.availableQuantity,
            paidQuantity: item.paidQuantity
          }))
          
          this.totalCount = this.cartItems.length
          console.log('Processed cart items:', this.cartItems)
        } else {
          this.cartItems = []
          this.totalCount = 0
        }
      } catch (error) {
        console.error('获取购物车数据失败:', error)
        this.error = error.message
        this.cartItems = []
        this.totalCount = 0
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCartItem(data) {
      try {
        const response = await cartService.updateCartItem(data.id, data.quantity)
        if (response?.state === 200) {
          const index = this.cartItems.findIndex(item => item.id === data.id)
          if (index !== -1) {
            this.cartItems[index] = {
              ...this.cartItems[index],
              quantity: data.quantity,
              modifiedTime: new Date().toISOString()
            }
          }
        } else {
          throw new Error(response?.message || '更新购物车失败')
        }
      } catch (error) {
        console.error('更新购物车商品失败:', error)
        ElMessage.error(error.message || '更新购物车失败')
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
    },

    async addItemToCart(cartData) {
      const userStore = useUserStore()
      
      if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录')
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
        return
      }

      this.loading = true
      this.error = null
      try {
        console.log('发送添加到购物车请求:', cartData)
        const response = await cartService.addToCart(cartData)
        console.log('添加购物车响应:', response)
        
        if (response?.state === 200 && response?.data) {
          const item = response.data
          const newItem = {
            id: item.cartItemId,
            cartId: item.cartId,
            quantity: item.quantity,
            product: {
              id: item.productId,
              name: item.productName,
              price: item.price,
              stock: item.availableQuantity ?? 999,
              imageUrl: item.imageUrl
            },
            selected: false,
            createdTime: item.createdTime,
            modifiedTime: item.modifiedTime,
            isPay: item.isPay,
            orderStatus: item.orderStatus
          }
          this.cartItems.push(newItem)
          this.totalCount = this.cartItems.length
          ElMessage.success('添加到购物车成功')
        } else {
          throw new Error(response?.message || '添加商品到购物车失败')
        }
      } catch (error) {
        console.error('添加商品到购物车失败:', error)
        this.error = error.message || '添加商品到购物车失败'
        ElMessage.error(this.error)
      } finally {
        this.loading = false
      }
    },

    setCartItems(items) {
      this.cartItems = items;
    },

    // 购物车结算
    async prepareCheckout() {
      try {
        const selectedItems = this.cartItems.filter(item => item.selected)
        console.log('选中的商品:', selectedItems)

        if (selectedItems.length === 0) {
          throw new Error('请选择要结算的商品')
        }

        this.loading = true
        ElMessage.info('正在处理结算请求...')

        // 只获取选中商品的 ID
        const cartItemIds = selectedItems.map(item => item.id)
        console.log('发送结算请求的商品ID:', cartItemIds) // 只发送选中的商品 ID
        const response = await cartService.purchaseCart(cartItemIds)
        
        console.log('结算响应:', response)
        if (response.state === 200) {
          const { orderId, totalAmount } = response.data
          
          // 使用 checkout store 存储订单数据
          const checkoutStore = useCheckoutStore()
          checkoutStore.setOrderData({
            orderId,
            totalAmount,
            items: selectedItems,
            orderInfo: response.data
          })

          this.clearCheckedItems()
          ElMessage.success('结算成功，正在跳转到支付页面...')
          
          // 简化路由跳转，让 payment 页面从 store 获取数据
          router.push({
            path: `/payment/${orderId}/${totalAmount}`
          })
          
          return response.data
        }
      } catch (error) {
        console.error('结算失败:', error)
        ElMessage.error(error.message || '结算失败')
        throw error
      } finally {
        this.loading = false
      }
    },

    // 清空已结算的商品
    clearCheckedItems() {
      this.cartItems = this.cartItems.filter(item => !item.selected)
      this.totalCount = this.cartItems.length
    }
  }
}) 