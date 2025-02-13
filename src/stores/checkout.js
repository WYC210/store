import { defineStore } from 'pinia'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    checkoutItems: []
  }),
  
  actions: {
    setCheckoutItems(items) {
      this.checkoutItems = items
    },
    
    clearCheckoutItems() {
      this.checkoutItems = []
    }
  }
}) 