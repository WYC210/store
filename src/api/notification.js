import { BaseApiService } from './base'
import { wsClient } from '@/utils/websocket'

class NotificationService extends BaseApiService {
  constructor() {
    super('/notifications')
    this.wsClient = wsClient
    this.setupWebSocket()
  }

  // 设置WebSocket
  setupWebSocket() {
    this.wsClient.on('notification', this.handleNotification.bind(this))
  }

  // 处理WebSocket通知
  handleNotification(data) {
    // 处理实时通知
  }

  // 获取通知列表
  async getNotifications(params = {}) {
    return this.request({
      url: this.getUrl(''),
      method: 'GET',
      params
    })
  }

  // 标记通知为已读
  async markAsRead(notificationId) {
    return this.request({
      url: this.getUrl(`/${notificationId}/read`),
      method: 'POST'
    })
  }

  // 标记所有通知为已读
  async markAllAsRead() {
    return this.request({
      url: this.getUrl('/read-all'),
      method: 'POST'
    })
  }

  // 删除通知
  async deleteNotification(notificationId) {
    return this.request({
      url: this.getUrl(`/${notificationId}`),
      method: 'DELETE'
    })
  }

  // 获取未读通知数量
  async getUnreadCount() {
    return this.request({
      url: this.getUrl('/unread-count'),
      method: 'GET'
    })
  }

  // 订阅通知
  async subscribe(topic) {
    return this.request({
      url: this.getUrl('/subscribe'),
      method: 'POST',
      data: { topic }
    })
  }
}

export const notificationService = new NotificationService() 