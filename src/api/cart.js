import request from '@/utils/request'

const cartApi = {
  // 获取购物车商品列表
  getCartItems: async () => {
    console.log('发送请求: 获取购物车商品列表')
    const response = await request({
      url: '/cart/list',
      method: 'GET'
    })
    console.log('获取购物车商品列表响应:', response)
    if (response.state === 200) {
      return response.data;
    } else {
      throw new Error(response.message || '获取购物车商品列表失败');
    }
  },

  // 添加商品到购物车
  addToCart: async (cartData) => {
    if (!cartData.productId) {
      throw new Error('商品ID不能为空')
    }
    const response = await request({
      url: '/cart/add',
      method: 'POST',
      data: {
        productId: String(cartData.productId),
        quantity: cartData.quantity
      }
    })

    // 确保返回的数据结构正确
    if (response.state === 200) {
      return response.data;
    } else {
      throw new Error(response.message || '添加到购物车失败');
    }
  },

  // 更新购物车商品
  updateCartItem: async (cartItemId, quantity) => {
    console.log('发送请求: 更新购物车商品', { cartItemId, quantity })
    const response = await request({
      url: `/cart/update/${cartItemId}`,
      method: 'PUT',
      data: {
        quantity: quantity
      }
    })
    console.log('更新购物车商品响应:', response)
    if (response.state === 200) {
      return response.data;
    } else {
      throw new Error(response.message || '更新购物车商品失败');
    }
  },

  // 从购物车删除商品
  deleteCartItem: async (cartItemId) => {
    console.log('发送请求: 删除购物车商品', cartItemId)
    const response = await request({
      url: `/cart/delete/${cartItemId}`,
      method: 'DELETE'
    })
    console.log('删除购物车商品响应:', response)
    if (response.state === 200) {
      return;
    } else {
      throw new Error(response.message || '删除购物车商品失败');
    }
  },

  // 清空购物车
  clearCart: async () => {
    console.log('发送请求: 清空购物车')
    const response = await request({
      url: '/cart/clear',
      method: 'DELETE'
    })
    console.log('清空购物车响应:', response)
    if (response.state === 200) {
      return;
    } else {
      throw new Error(response.message || '清空购物车失败');
    }
  },

  // 获取购物车总金额
  getCartTotal: async () => {
    return request({
      url: '/cart/total',
      method: 'GET'
    })
  },

  // 购买商品
  purchase: async (data) => {
    return request({
      url: '/orders/purchase',
      method: 'POST',
      data
    })
  }
}

export default cartApi
