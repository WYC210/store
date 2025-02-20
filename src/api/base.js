import { httpClient } from '@/utils/request'
import { errorHandler } from '@/utils/errorHandler'

// 基础 API 类
export class BaseApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async request(config) {
    try {
      const response = await request({
        url: `${this.baseUrl}${config.url}`,
        ...config
      })
      
      if (response.state === 200) {
        return response.data
      }
      throw new Error(response.message)
    } catch (error) {
      console.error(`API Error: ${config.url}`, error)
      throw error
    }
  }
}

export class BaseApiService {
  constructor(resourcePath) {
    this.resourcePath = resourcePath
  }

  // 构建完整URL
  getUrl(path = '') {
    return `${this.resourcePath}${path}`
  }

  // 通用的请求处理
  async request(httpClient, config) {
    try {
      const response = await httpClient.request(config)
      console.log("API响应:", response);
      // 直接返回完整响应，不做处理
      return response
    } catch (error) {
      console.error(`API Error: ${config.url}`, error)
      throw error
    }
  }

  // 通用的 CRUD 操作
  async getAll(params = {}) {
    return this.request(httpClient, {
      url: this.getUrl(''),
      method: 'GET',
      params
    })
  }

  async getById(id) {
    return this.request(httpClient, {
      url: this.getUrl(`/${id}`),
      method: 'GET'
    })
  }

  async create(data) {
    return this.request(httpClient, {
      url: this.getUrl(''),
      method: 'POST',
      data
    })
  }

  async update(id, data) {
    return this.request(httpClient, {
      url: this.getUrl(`/${id}`),
      method: 'PUT',
      data
    })
  }

  async delete(id) {
    return this.request(httpClient, {
      url: this.getUrl(`/${id}`),
      method: 'DELETE'
    })
  }

  // 批量操作
  async batchCreate(httpClient, items) {
    return this.request(httpClient, {
      url: this.getUrl('/batch'),
      method: 'POST',
      data: { items }
    })
  }

  async batchUpdate(httpClient, items) {
    return this.request(httpClient, {
      url: this.getUrl('/batch'),
      method: 'PUT',
      data: { items }
    })
  }

  async batchDelete(httpClient, ids) {
    return this.request(httpClient, {
      url: this.getUrl('/batch'),
      method: 'DELETE',
      data: { ids }
    })
  }
} 