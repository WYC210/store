import { BaseApiService } from './base'
import { QueryBuilder } from '@/utils/queryBuilder'

class SearchService extends BaseApiService {
  constructor() {
    super('/search')
  }

  // 全局搜索
  async search(keyword, options = {}) {
    const query = new QueryBuilder()
      .withPagination(options.page || 1, options.size || 10)
      .withSort(options.sortField, options.sortOrder)
      .withFilter(options.filters)
      .build()

    return this.request({
      url: this.getUrl(''),
      method: 'GET',
      params: {
        keyword,
        ...query
      }
    })
  }

  // 搜索建议
  async getSuggestions(keyword) {
    return this.request({
      url: this.getUrl('/suggestions'),
      method: 'GET',
      params: { keyword }
    })
  }

  // 热门搜索
  async getHotSearches() {
    return this.request({
      url: this.getUrl('/hot'),
      method: 'GET'
    })
  }

  // 搜索历史
  async getSearchHistory() {
    return this.request({
      url: this.getUrl('/history'),
      method: 'GET'
    })
  }

  // 清除搜索历史
  async clearSearchHistory() {
    return this.request({
      url: this.getUrl('/history'),
      method: 'DELETE'
    })
  }
}

export const searchService = new SearchService() 