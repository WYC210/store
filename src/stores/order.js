import { defineStore } from 'pinia'
import { createOrder, payOrder, getOrderList, getOrderDetail, cancelOrder } from '@/api/order'

export const useOrderStore = defineStore('order', {
  state: () => ({
    currentOrder: null,
    orderList: [],
    orderStatus: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      size: 10,
      total: 0
    }
  }),

  actions: {
    async createNewOrder(orderData) {
      this.loading = true
      this.error = null
      try {
        const response = await createOrder(orderData)
        this.currentOrder = response
        this.orderStatus = response.status
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
          this.orderStatus = response.status
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