import { BaseApiService } from './base'
import { httpClient } from '@/utils/request'

class ProductService extends BaseApiService {
  constructor() {
    super('/products')
  }

  // 获取商品列表
  async getProducts(params = {}) {
    const defaultParams = {
      pageNum: 1,
      pageSize: 10,
      keyword: '',
      categoryId: null,
      sortField: 'default',
      sortOrder: 'desc'
    }

    return this.getAll({ ...defaultParams, ...params })
  }

  // 获取商品详情
  async getProductDetail(productId) {
    return this.getById(productId)
  }

  // 获取商品详细信息
  async getProductDetails(productId) {
    if (!productId) {
      throw new Error('商品ID不能为空')
    }

    return this.request({
      url: this.getUrl(`/${productId}/details`),
      method: 'GET',
      params: {
        includeOptions: true,
        includeComments: true
      }
    })
  }

  // 获取商品图片
  async getProductImages(productId, limit = 5) {
    if (!productId) {
      throw new Error('商品ID不能为空')
    }

    return this.request({
      url: this.getUrl(`/${productId}/images`),
      method: 'GET',
      params: { limit }
    })
  }

  // 获取最新评论
  async getLatestComments(productId, limit = 5) {
    if (!productId) {
      throw new Error('商品ID不能为空')
    }

    return this.request({
      url: this.getUrl(`/${productId}/comments/latest`),
      method: 'GET',
      params: {
        limit,
        sort: 'createdTime,desc'
      }
    })
  }

  // 搜索商品
  async searchProducts(keyword, options = {}) {
    return this.getAll({
      keyword,
      ...options
    })
  }

  // 获取推荐商品
  async getRecommendedProducts(productId, limit = 5) {
    return this.request({
      url: this.getUrl(`/${productId}/recommendations`),
      method: 'GET',
      params: { limit }
    })
  }
}

export const productService = new ProductService()

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

export const getProducts = async (params) => {
  return await httpClient.get('/products', { params })
} 