import request from '@/utils/request'

// 获取购物车列表
export const getCartItems = () => {
  return request({
    url: '/cart',
    method: 'get'
  })
}

// 添加商品到购物车
export const addToCart = (data) => {
  return request({
    url: '/cart/add',
    method: 'post',
    data
  })
}

// 更新购物车商品
export const updateCartItem = (data) => {
  return request({
    url: `/cart/${data.id}`,
    method: 'put',
    data
  })
}

// 从购物车删除商品
export const removeFromCart = (itemId) => {
  return request({
    url: `/cart/${itemId}`,
    method: 'delete'
  })
}

// 清空购物车
export const clearCart = () => {
  return request({
    url: '/cart/clear',
    method: 'delete'
  })
} 
 