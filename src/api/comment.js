import { BaseApiService } from './base'
import { validator } from '@/utils/validator'

class CommentService extends BaseApiService {
  constructor() {
    super('/comments')
  }

  // 获取评论列表
  async getComments(productId, params = {}) {
    return this.request({
      url: this.getUrl(''),
      method: 'GET',
      params: {
        productId,
        ...params
      }
    })
  }

  // 添加评论
  async addComment(data) {
    const { content, rating, productId } = data

    if (!content?.trim()) {
      throw new Error('评论内容不能为空')
    }

    if (rating < 1 || rating > 5) {
      throw new Error('评分必须在1-5之间')
    }

    return this.request({
      url: this.getUrl(''),
      method: 'POST',
      data: {
        content: content.trim(),
        rating,
        productId,
        timestamp: Date.now()
      }
    })
  }

  // 删除评论
  async deleteComment(commentId) {
    return this.request({
      url: this.getUrl(`/${commentId}`),
      method: 'DELETE'
    })
  }

  // 获取评论统计
  async getCommentStats(productId) {
    return this.request({
      url: this.getUrl(`/stats/${productId}`),
      method: 'GET'
    })
  }

  // 点赞评论
  async likeComment(commentId) {
    return this.request({
      url: this.getUrl(`/${commentId}/like`),
      method: 'POST'
    })
  }
}

export const commentService = new CommentService() 