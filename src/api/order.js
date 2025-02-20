import { BaseApiService } from './base'
import { httpClient } from '@/utils/request'

class OrderService extends BaseApiService {
  constructor() {
    super('/orders')
  }

  // 获取订单列表
  async getOrderList() {
    return this.request(httpClient, {
      url: this.getUrl(''),
      method: 'GET'
    })
  }

  // 获取订单详情
  async getOrderDetail(orderId) {
    return this.request(httpClient, {
      url: this.getUrl(`/${orderId}`),
      method: 'GET'
    })
  }

  // 创建订单
  async createOrder(orderData) {
    return this.request({
      url: this.getUrl('/create'),
      method: 'POST',
      data: orderData
    })
  }

  // 支付订单
  async payOrder(orderId, paymentData) {
    return this.request(httpClient, {
      url: this.getUrl(`/${orderId}/pay`),
      method: 'POST',
      data: paymentData
    })
  }

  // 取消订单
  async cancelOrder(orderId) {
    return this.request({
      url: this.getUrl(`/${orderId}/cancel`),
      method: 'POST'
    })
  }

  // 立即购买
  async purchaseDirectly(data) {
    return httpClient.post('/orders/purchase', data)
  }

  // 获取订单状态
  async getOrderStatus(orderId) {
    return this.request({
      url: this.getUrl(`/${orderId}/status`),
      method: 'GET'
    })
  }

  // 获取订单统计
  async getOrderStats(params) {
    return this.request({
      url: this.getUrl('/stats'),
      method: 'GET',
      params
    })
  }

  // 确认收货
  async confirmReceipt(orderId) {
    return this.request({
      url: this.getUrl(`/${orderId}/confirm`),
      method: 'POST'
    })
  }

  // 申请退款
  async requestRefund(orderId, refundData) {
    return this.request({
      url: this.getUrl(`/${orderId}/refund`),
      method: 'POST',
      data: refundData
    })
  }
}

export const orderService = new OrderService() 