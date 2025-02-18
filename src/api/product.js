import request from '@/utils/request'

// 获取商品列表
export const getProducts = async (params = {}) => {
  const {
    pageNum = 1,
    pageSize = 10,
    keyword,
  } = params

  return request({
    url: '/products',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      keyword,
    }
  })
}

// 获取商品详情
export const getProductDetail = async (id) => {
  if (!id) {
    throw new Error('商品ID不能为空')
  }
  return request({
    url: `/products/${id}`,
    method: 'get'
  })
}

// 添加到购物车
export const addToCart = async (cartData) => {
  if (!cartData.productId) {
    throw new Error('商品ID不能为空')
  }
  return request({
    url: '/cart/add',
    method: 'post',
    data: cartData
  })
}

// 获取分类列表
export const getCategories = async () => {
  return request({
    url: '/categories',
    method: 'get',
  })
}

// 获取商品详细信息（包含配置选项和评论）
export const getProductDetails = async (productId) => {
  if (!productId) {
    throw new Error('商品ID不能为空')
  }
  return request({
    url: `/products/${productId}/details`,
    method: 'get',
    params: {
      includeOptions: true,  // 包含配置选项
      includeComments: true  // 包含评论
    }
  })
}

// 获取商品图片列表
export const getProductImages = async (productId) => {
  if (!productId) {
    throw new Error('商品ID不能为空')
  }
  return request({
    url: `/products/${productId}/images`,
    method: 'get',
    params: {
      limit: 5  // 限制图片数量
    }
  })
}

// 获取最新评论（用于弹幕）
export const getLatestComments = async (productId, limit = 5) => {
  if (!productId) {
    throw new Error('商品ID不能为空')
  }
  return request({
    url: `/products/${productId}/comments/latest`,
    method: 'get',
    params: { 
      limit,
      sort: 'createdTime,desc'  // 按时间倒序
    }
  })
}

// 批量获取商品信息
export const batchGetProducts = async (productIds) => {
  if (!Array.isArray(productIds) || !productIds.length) {
    return []
  }
  
  try {
    const results = await Promise.allSettled(
      productIds.map(id => getProductDetail(id))
    )
    
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value?.data)
      .filter(Boolean)
  } catch (error) {
    console.error('批量获取商品信息失败:', error)
    return []
  }
} 