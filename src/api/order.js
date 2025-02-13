import request from '@/utils/request'

export const createOrder = (orderData) => {
  return request({
    url: '/orders/create',
    method: 'POST',
    data: orderData
  })
}

export const payOrder = (orderId, paymentData) => {
  return request({
    url: `/orders/${orderId}/pay`,
    method: 'POST',
    data: paymentData
  })
}

export const getOrderList = (params) => {
  return request({
    url: '/orders',
    method: 'GET',
    params
  })
}

export const getOrderDetail = (orderId) => {
  return request({
    url: `/orders/${orderId}`,
    method: 'GET'
  })
}

export const cancelOrder = (orderId) => {
  return request({
    url: `/orders/${orderId}/cancel`,
    method: 'POST'
  })
} 