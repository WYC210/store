export const paymentService = {
  generatePaymentId() {
    return `PAY${Date.now()}${Math.random().toString(36).substr(2, 6)}`
  },

  validatePaymentData(paymentData) {
    if (!paymentData.orderId) {
      throw new Error('订单ID不能为空')
    }
    if (!paymentData.amount) {
      throw new Error('支付金额不能为空')
    }
    if (!paymentData.paymentMethod) {
      throw new Error('请选择支付方式')
    }
    return true
  }
} 