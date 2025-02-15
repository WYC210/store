import request from '@/utils/request'

const orderApi = {
  // 购物车结算创建订单
  createOrder: async (data) => {
    console.log('发送创建订单请求:', data)
    const response = await request({
      url: '/orders/create',
      method: 'POST',
      data
    })
    console.log('创建订单响应:', response)
    return response
  },

  // 直接购买商品
  purchaseDirectly: (orderData) => {
    return request({
      url: '/cart/purchase',
      method: 'POST',
      data: orderData
    })
  },

  // 支付订单
  payOrder: (orderId, paymentData) => {
    return request({
      url: `/orders/${orderId}/pay`,
      method: 'POST',
      data: paymentData
    })
  },

  // 获取订单列表
  getOrderList: (params) => {
    return request({
      url: '/orders',
      method: 'GET',
      params
    })
  },

  // 获取订单详情
  getOrderDetail: (orderId) => {
    return request({
      url: `/orders/${orderId}`,
      method: 'GET'
    })
  },

  // 取消订单
  cancelOrder: (orderId) => {
    return request({
      url: `/orders/${orderId}/cancel`,
      method: 'POST'
    })
  }
}

export default orderApi 