import { defineStore } from 'pinia'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    orderData: null,
    loading: false,
    error: null
  }),
  
  getters: {
    orderId: (state) => state.orderData?.orderId,
    totalAmount: (state) => state.orderData?.totalAmount,
    orderItems: (state) => state.orderData?.items || [],
    orderStatus: (state) => state.orderData?.status
  },
  
  actions: {
    setOrderData(orderData) {
      this.orderData = orderData
    },
    
    clearOrderData() {
      this.orderData = null
      this.error = null
    }
  }
}) 