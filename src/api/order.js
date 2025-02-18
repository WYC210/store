import request from '@/utils/request'

// 创建订单
export const createOrder = async (orderData) => {
  console.log('发送创建订单请求:', orderData)
  const response = await request({
    url: '/orders/purchase/direct',
    method: 'POST',
    data: orderData
  })

  // 确保返回的数据结构正确
  if (response.state === 200) {
    console.log('创建订单响应:', response)
    return response.data // 返回订单信息
  } else {
    throw new Error(response.message || '创建订单失败')
  }
}

// 支付订单
export const payOrder = async (orderId, paymentData) => {
  console.log('发送支付订单请求:', { orderId, paymentData })
  const response = await request({
    url: `/orders/${orderId}/pay`,
    method: 'POST',
    data: paymentData
  })

  // 确保返回的数据结构正确
  if (response.state === 200) {
    console.log('支付订单响应:', response)
    return response
  } else {
    throw new Error(response.message || '支付订单失败')
  }
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
    method: 'GET'
  })

  // 确保返回的数据结构正确
  if (response.state === 200) {
    console.log('获取订单详情响应:', response)
    return response.data // 返回订单详情
  } else {
    throw new Error(response.message || '获取订单详情失败')
  }
}

// 取消订单
export const cancelOrder = (orderId) => {
  return request({
    url: `/orders/${orderId}/cancel`,
    method: 'post'
  })
}

// 直接购买商品
export const purchaseDirectly = async (productId, quantity) => {
  console.log('发送直接购买请求:', { productId, quantity });
  const response = await request({
    url: '/orders/create/direct',
    method: 'POST',
    data: {
      items: {
        productId: String(productId), // 确保是字符串类型
        quantity: quantity
      }
    }
  });

  // 输出完整的响应内容
  console.log("直接购买响应:", response);

  // 检查响应状态
  if (response.state === 200) { // 这里需要根据后端返回的状态进行判断
    return response.data; // 返回订单数据
  } else {
    throw new Error(response.message || '创建订单失败'); // 抛出错误
  }
}

// 导出所有 API 函数
const orderApi = {
  createOrder,
  payOrder,
  getOrderList,
  getOrderDetail,
  purchaseDirectly
}

export default orderApi 