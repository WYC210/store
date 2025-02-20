import request from './request'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { httpClient } from '@/utils/request'

// 安全相关配置
const SECURITY_CONFIG = {
  tokenExpireTime: 2 * 60 * 60 * 1000, // token 有效期 2 小时
  maxLoginAttempts: 5, // 最大登录尝试次数
  lockoutTime: 15 * 60 * 1000 // 锁定时间 15 分钟
}

class TokenManager {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken')
    this.refreshToken = localStorage.getItem('refreshToken')
  }

  // 保存令牌
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  // 获取访问令牌
  getAccessToken() {
    return this.accessToken
  }

  // 获取刷新令牌
  getRefreshToken() {
    return this.refreshToken
  }

  // 清除令牌
  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  // 刷新令牌
  async refreshAccessToken() {
    try {
      const response = await httpClient.post('/auth/refresh', {
        refreshToken: this.getRefreshToken()  // 在请求体中携带刷新 token
      })
      
      if (response.state === 200) {
        this.accessToken = response.data.accessToken
        localStorage.setItem('accessToken', this.accessToken)
        return this.accessToken
      }
      
      throw new Error('Failed to refresh token')
    } catch (error) {
      this.clearTokens()
      throw error
    }
  }
}

export const tokenManager = new TokenManager()

export const auth = {
  // 登录
  async login(credentials) {
    const response = await request({
      url: '/users/login',
      method: 'POST',
      data: credentials
    })
    
    if (response.state === 200) {
      const { accessToken, refreshToken } = response.data
      this.storeTokens({ accessToken, refreshToken })
      return response.data
    }
    throw new Error(response.message || '登录失败')
  },

  // 注册
  async register(userData) {
    const response = await request({
      url: '/users/register',
      method: 'POST',
      data: userData
    })
    
    if (response.state === 200) {
      return response.data
    }
    throw new Error(response.message || '注册失败')
  },

  // Token 管理
  storeTokens({ accessToken, refreshToken }) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  },

  clearTokens() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  // 刷新 token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken')
    const response = await request({
      url: '/auth/refresh',
      method: 'POST',
      data: { refreshToken }
    })
    
    if (response.state === 200) {
      this.storeTokens(response.data)
      return response.data
    }
    throw new Error('刷新 token 失败')
  }
}

// 获取用户信息
export const getUserInfo = async () => {
  try {
    const response = await request({
      url: '/users/info',
      method: 'get'
    })
    return response
  } catch (error) {
    console.error('Get user info error:', error)
    throw error
  }
}

// 登出
export const logout = async () => {
  try {
    await request({
      url: '/users/logout',
      method: 'POST',
      withCredentials: true
    })
  } catch (error) {
    console.error('登出请求失败:', error)
  } finally {
    // 无论登出请求是否成功，都清除本地状态
    auth.clearTokens()
    localStorage.removeItem('userInfo')
    router.push('/login')
  }
}

// 注册函数
export const register = async (userData) => {
  return await httpClient.post('/users/register', userData)
} 