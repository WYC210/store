import request from '@/utils/request'

// 获取商品列表
export const getProducts = () => {
  return request({
    url: '/products',
    method: 'get'
  })
}

// 获取商品详情
export const getProductById = (id) => {
  return request({
    url: `/products/${id}`,
    method: 'get'
  })
}

// 添加到购物车
export const addToCart = (productId, quantity = 1) => {
  return request({
    url: '/cart/add',
    method: 'post',
    data: {
      productId,
      quantity
    }
  })
} 