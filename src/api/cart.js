import { BaseApiService } from './base'
import { httpClient } from '@/utils/request'

class CartService extends BaseApiService {
  constructor() {
    super('/cart')
  }

  // 获取购物车列表
  async getCartItems() {
    try {
      const response = await this.request(httpClient, {
        url: this.getUrl('/list'),
        method: 'GET'
      })
      
      console.log('Cart API Response:', response)

      // 检查响应的完整性
      if (!response) {
        console.error('No response received')
        return { state: 200, data: [] }
      }

      // 检查响应格式和状态码
      if (response.state !== 200) {
        console.error('Invalid response state:', response.state)
        return { state: response.state, data: [] }
      }

      return response
    } catch (error) {
      console.error('GetCartItems error:', error)
      throw error
    }
  }

  // 添加商品到购物车
  async addToCart(cartData) {
    if (!cartData.productId) {
      throw new Error('商品ID不能为空')
    }

    return httpClient.request({
      url: this.getUrl('/add'),
      method: 'POST',
      data: {
        productId: String(cartData.productId),
        quantity: cartData.quantity || 1
      }
    })
  }

  // 更新购物车商品数量
  async updateCartItem(cartItemId, quantity) {
    return httpClient.request({
      url: this.getUrl(`/update/${cartItemId}`),
      method: 'PUT',
      params: { quantity }
    })
  }

  // 删除购物车商品
  async deleteCartItem(cartItemId) {
    return httpClient.request({
      url: this.getUrl(`/delete/${cartItemId}`),
      method: 'DELETE'
    })
  }

  // 清空购物车
  async clearCart() {
    return httpClient.request({
      url: this.getUrl('/clear'),
      method: 'DELETE'
    })
  }

  // 获取购物车总金额
  async getCartTotal() {
    return httpClient.request({
      url: this.getUrl('/total'),
      method: 'GET'
    })
  }

  // 检查商品库存
  async checkStock(items) {
    return httpClient.request({
      url: this.getUrl('/check-stock'),
      method: 'POST',
      data: { items }
    })
  }

  // 购物车结算
  async purchaseCart(cartItemIds) {
    try {
      console.log('发送结算请求:', {
        url: '/orders/purchase/cart',
        data: { cartItemIds }
      });

      // 直接返回原始响应，不做额外处理
      return await this.request(httpClient, {
        url: '/orders/purchase/cart',
        method: 'POST',
        data: { cartItemIds }
      });
    } catch (error) {
      console.error('购物车结算失败:', error);
      throw error;
    }
  }
}

export const cartService = new CartService()
