import { defineStore } from 'pinia'
import { createOrder, payOrder, getOrderList, getOrderDetail, cancelOrder } from '@/api/order'

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

  actions: {
    // 更新订单状态
    updateOrderStatus(orderId, status) {
      console.log('更新订单状态:', orderId, status)
      const order = this.orderList.find(order => order.orderId === orderId)
      if (order) {
        console.log('找到订单，更新状态')
        order.status = status
        // 触发状态更新
        this.orderList = [...this.orderList]
      } else {
        console.log('未找到订单')
        // 如果订单不在列表中，重新获取订单列表
        this.fetchOrderList()
      }
    },

    async createNewOrder(orderData) {
      this.loading = true
      this.error = null
      try {
        const response = await createOrder(orderData)
        // 保存商品详细信息
        this.currentOrder = {
          ...response,
          items: orderData.items.map(item => ({
            ...item,
            imageUrl: item.imageUrl,
            productName: item.productName
          }))
        }
        return response
      } catch (error) {
        this.error = error.response?.data?.error || { message: '创建订单失败' }
        throw error
      } finally {
        this.loading = false
      }
    },

    async payCurrentOrder(paymentId) {
      this.loading = true
      this.error = null
      try {
        const paymentData = {
          orderId: this.currentOrder.orderId,
          paymentId
        }
        const response = await payOrder(paymentData)
        if (response.success) {
          return response
        } else {
          throw new Error(response.error?.message || '支付失败')
        }
      } catch (error) {
        this.error = error.response?.data?.error || { message: '支付处理失败' }
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchOrderList(params = {}) {
      this.loading = true
      console.log('Fetching order list with params:', params)
      try {
        const response = await getOrderList({
          page: this.pagination.page,
          size: this.pagination.size,
          ...params
        })
        this.orderList = response.data
        this.pagination.total = response.total
        return response
      } catch (error) {
        this.error = error.response?.data?.error || { message: '获取订单列表失败' }
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchOrderDetail(orderId) {
      this.loading = true
      try {
        const response = await getOrderDetail(orderId)
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
        const response = await cancelOrder(orderId)
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
    }
  }
}) 