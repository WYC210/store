// 生成模拟的支付流水号
export const generatePaymentId = () => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substr(2, 8)
  return `PAY${timestamp}${random}`.toUpperCase()
} 