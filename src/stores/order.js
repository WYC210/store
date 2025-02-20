import { defineStore } from 'pinia'
import { orderService } from '@/api/order'
import { ElMessage } from 'element-plus'
import router from '@/router'
import axios from 'axios'
import { tokenManager } from '@/utils/tokenManager'


export const useOrderStore = defineStore('order', {
  state: () => ({
    currentOrder: null,
    orderList: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      size: 10,
      total: 0
    }
  }),

  getters: {
    orderTotal: (state) => state.currentOrder?.totalAmount || 0,
    orderStatus: (state) => state.currentOrder?.status
  },

  actions: {
    // 更新订单状态
    updateOrderStatus(orderId, status) {
      const order = this.orderList.find(order => order.orderId === orderId)
      if (order) {
        order.status = status
        this.orderList = [...this.orderList]
      } else {
        this.fetchOrderList()
      }
    },

    async createNewOrder(orderData) {
      this.loading = true
      try {
        const data = await orderService.createOrder(orderData)
        this.currentOrder = {
          ...data,
          items: orderData.items
        }
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // 支付订单
    async payCurrentOrder(orderId, paymentData) {
      // 这里传入的数据莫名其妙无效 是一个对象，但是无法解析
      try {
        this.loading = true
        ElMessage.info('正在处理支付请求...')
        
        // 详细的参数验证和调试
        console.log('支付请求原始参数:', {
          orderId,
          type: typeof orderId,
          value: JSON.stringify(orderId),
          paymentData
        })
        
        // 从对象中提取订单ID（如果是对象的话）
        const orderIdStr = typeof orderId === 'object' ? 
          orderId.orderId || orderId.id || orderId.orderid : 
          String(orderId)

        // 从 orderId 中提取 paymentData
        const paymentDataStr = typeof orderId === 'object' ? {
          amount: orderId.amount,
          paymentMethod: orderId.paymentMethod,
          paymentId: orderId.paymentId
        } : paymentData; // 如果 paymentData 已经传入，则使用传入的值

        if (!orderIdStr) {
          throw new Error('无效的订单ID')
        }
        
        const token = tokenManager.getAccessToken()
        console.log('获取到的 token:', token)
        
        if (!token) {
          throw new Error('未登录或 token 已过期')
        }
        
        // 打印最终请求信息
        console.log('最终支付请求信息:', {
          orderIdStr,
          paymentDataStr,
          token,
          requestHeaders: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const response = await orderService.payOrder(orderIdStr, paymentDataStr, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response?.state === 200 && response.data) {
          ElMessage.success('支付成功')
          // 支付成功后跳转到订单列表
          router.push('/orders')
          return response.data
        } else {
          throw new Error(response?.message || '支付失败')
        }
      } catch (error) {
        console.error('支付处理错误:', error)
        ElMessage.error(error.message || '支付失败')
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取订单列表
    async fetchOrderList() {
      if (this.loading) return // 防止重复请求
      
      try {
        this.loading = true
        const response = await orderService.getOrderList()
        console.log('API 响应:', response)
        
        if (response?.state === 200 && Array.isArray(response.data)) {
          this.orderList = response.data
        } else {
          console.warn('API 响应格式不正确:', response)
          this.orderList = []
        }
      } catch (error) {
        console.error('获取订单列表失败:', error)
        this.orderList = []
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchOrderDetail(orderId) {
      this.loading = true
      try {
        const response = await orderService.getOrderDetail(orderId)
        this.currentOrder = response
        return response
      } catch (error) {
        this.error = error.response?.data?.error || { message: '获取订单详情失败' }
        throw error
      } finally {
        this.loading = false
      }
    },

    async cancelOrder(orderId) {
      this.loading = true
      try {
        const response = await orderService.cancelOrder(orderId)
        if (this.currentOrder?.orderId === orderId) {
          this.currentOrder.status = 'CANCELLED'
        }
        return response
      } catch (error) {
        this.error = error.response?.data?.error || { message: '取消订单失败' }
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentOrder(order) {
      this.currentOrder = order
    },

    clearCurrentOrder() {
      this.currentOrder = null
    }
  }
}) 