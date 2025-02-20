import { BaseApiService } from './base'
import { validator } from '@/utils/validator'
import { paymentService as paymentUtil } from '@/utils/payment'

class PaymentService extends BaseApiService {
  constructor() {
    super('/payments')
    this.supportedMethods = ['alipay', 'wechat', 'creditCard']
  }

  // 创建支付订单
  async createPayment(orderData) {
    const { amount, method, orderId } = orderData

    if (!this.supportedMethods.includes(method)) {
      throw new Error('不支持的支付方式')
    }

    if (!validator.validateAmount(amount)) {
      throw new Error('无效的支付金额')
    }

    return this.request({
      url: this.getUrl('/create'),
      method: 'POST',
      data: {
        paymentId: paymentUtil.generatePaymentId(),
        amount,
        method,
        orderId,
        timestamp: Date.now()
      }
    })
  }

  // 查询支付状态
  async queryPaymentStatus(paymentId) {
    return this.request({
      url: this.getUrl(`/${paymentId}/status`),
      method: 'GET'
    })
  }

  // 取消支付
  async cancelPayment(paymentId) {
    return this.request({
      url: this.getUrl(`/${paymentId}/cancel`),
      method: 'POST'
    })
  }

  // 申请退款
  async requestRefund(paymentId, refundData) {
    return this.request({
      url: this.getUrl(`/${paymentId}/refund`),
      method: 'POST',
      data: refundData
    })
  }

  // 获取支付方式列表
  async getPaymentMethods() {
    return this.request({
      url: this.getUrl('/methods'),
      method: 'GET'
    })
  }
}

export const paymentService = new PaymentService() 