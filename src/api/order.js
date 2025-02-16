import request from '@/utils/request'

// 创建订单
export const createOrder = async (orderData) => {
  console.log('发送创建订单请求:', orderData)
  const response = await request({
    url: '/orders/create',
    method: 'POST',
    data: orderData
  })
  console.log('创建订单响应:', response)
  return response
}

// 支付订单
export const payOrder = async (orderId, paymentData) => {
  console.log('发送支付订单请求:', { orderId, paymentData })
  const response = await request({
    url: `/orders/${orderId}/pay`,
    method: 'POST',
    data: paymentData
  })
  console.log('支付订单响应:', response)
  return response
}

// 获取订单列表
export const getOrderList = async (params = {}) => {
  console.log('发送获取订单列表请求:', params)
  const response = await request({
    url: '/orders',
    method: 'get',
    params
  })
  console.log('获取订单列表响应:', response)
  return response
}

// 获取订单详情
export const getOrderDetail = async (orderId) => {
  console.log('发送获取订单详情请求:', orderId)
  const response = await request({
    url: `/orders/${orderId}`,
    method: 'get'
  })
  console.log('获取订单详情响应:', response)
  return response
}

// 取消订单
export const cancelOrder = (orderId) => {
  return request({
    url: `/orders/${orderId}/cancel`,
    method: 'post'
  })
}

// 直接购买商品
export const purchaseDirectly = (orderData) => {
  return request({
    url: '/cart/purchase',
    method: 'POST',
    data: orderData
  })
}

const orderApi = {
  createOrder,
  payOrder,
  getOrderList,
  getOrderDetail
}

export default orderApi 