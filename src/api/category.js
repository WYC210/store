import { BaseApiService } from './base'
import { httpClient } from '@/utils/request'

class CategoryService extends BaseApiService {
  constructor() {
    super('/categories')
  }

  // 获取分类树
  async getCategories() {
    return this.request(httpClient, {
      url: this.getUrl(''),
      method: 'GET'
    })
  }

  // 获取子分类
  async getSubCategories(parentId) {
    return this.request(httpClient, {
      url: this.getUrl(`/${parentId}/children`),
      method: 'GET'
    })
  }

  // 获取分类路径
  async getCategoryPath(categoryId) {
    return this.request(httpClient, {
      url: this.getUrl(`/${categoryId}/path`),
      method: 'GET'
    })
  }

  // 获取分类详情
  async getCategoryDetail(categoryId) {
    return this.request(httpClient, {
      url: this.getUrl(`/${categoryId}`),
      method: 'GET'
    })
  }

  // 搜索分类
  async searchCategories(keyword) {
    return this.request(httpClient, {
      url: this.getUrl(''),
      method: 'GET',
      params: { keyword }
    })
  }

  // 获取热门分类
  async getHotCategories(limit = 10) {
    return this.request(httpClient, {
      url: this.getUrl('/hot'),
      method: 'GET',
      params: { limit }
    })
  }
}

export const categoryService = new CategoryService()
