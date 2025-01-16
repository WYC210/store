import request from '@/utils/request'

// 获取商品列表
export const getProducts = (params = {}) => {
  const { 
    categoryId,
    keyword,
    page = 1,
    size = 10 
  } = params

  return request({
    url: '/products',
    method: 'get',
    params: {
      categoryId,
      keyword,
      page,
      size
    }
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
    },
    withCredentials: true
  })
}

// 获取分类列表
export function getCategories() {
  return request({
    url: '/categories',
    method: 'get',
    withCredentials: true
  })
} 