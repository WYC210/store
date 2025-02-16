import request from '@/utils/request'

const cartApi = {
  // 获取购物车商品列表
  getCartItems: async () => {
    console.log('发送请求: 获取购物车商品列表')
    const response = await request({
      url: '/cart',
      method: 'GET'
    })
    console.log('获取购物车商品列表响应:', response)
    return response
  },

  // 添加商品到购物车
  addToCart: async (data) => {
    console.log('发送请求: 添加商品到购物车', data)
    const response = await request({
      url: '/cart/add',
      method: 'POST',
      data
    })
    console.log('添加商品到购物车响应:', response)
    return response
  },

  // 更新购物车商品
  updateCartItem: async (data) => {
    console.log('发送请求: 更新购物车商品', data)
    const response = await request({
      url: `/cart/${data.id}`,
      method: 'PUT',
      data
    })
    console.log('更新购物车商品响应:', response)
    return response
  },

  // 从购物车删除商品
  deleteCartItem: async (cartItemId) => {
    console.log('发送请求: 删除购物车商品', cartItemId)
    const response = await request({
      url: `/cart/${cartItemId}`,
      method: 'DELETE'
    })
    console.log('删除购物车商品响应:', response)
    return response
  },

  // 直接购买商品
  purchaseDirectly: async (orderData) => {
    // 确保 productId 是字符串格式
    const productId = String(orderData.productId);
    const quantity = Math.max(1, orderData.quantity); // 确保数量是正整数

    console.log('发送直接购买请求:', { productId, quantity });
    const response = await request({
      url: '/cart/purchase',
      method: 'POST',
      data: {
        productId, // 使用字符串格式的 productId
        quantity   // 确保数量是正整数
      }
    })
    console.log('直接购买响应:', response)
    return response
  },

  // 清空购物车
  clearCart: async () => {
    console.log('发送请求: 清空购物车')
    const response = await request({
      url: '/cart/clear',
      method: 'DELETE'
    })
    console.log('清空购物车响应:', response)
    return response
  }
}

export default cartApi 
 