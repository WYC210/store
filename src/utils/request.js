/* eslint-disable */
import axios from 'axios'
import { auth } from './auth'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { errorHandler } from './errorHandler'
import { cacheManager } from './cache'
import { tokenManager } from './tokenManager'

class HttpClient {
  constructor() {
    this.instance = null
    this.isRefreshing = false
    this.refreshSubscribers = []
  }

  async refreshToken() {
    try {
      const refreshToken = tokenManager.getRefreshToken()
      console.log('Attempting to refresh token with:', refreshToken)
      
      const response = await this.getInstance().post('/auth/refresh', {
        refreshToken: refreshToken
      })
      
      if (response.data.state === 200 && response.data.data.accessToken) {
        const newAccessToken = response.data.data.accessToken
        tokenManager.setTokens(newAccessToken, refreshToken)
        console.log('Token refreshed successfully:', newAccessToken)
        return newAccessToken
      }
      
      throw new Error('Failed to refresh token: Invalid response')
    } catch (error) {
      console.error('Token refresh failed:', error)
      tokenManager.clearTokens()
      throw error
    }
  }

  // 懒加载初始化
  getInstance() {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8088',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // 请求拦截器
      this.instance.interceptors.request.use(
        config => {
          const token = tokenManager.getAccessToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log('Request headers set:', config.headers)
          } else {
            console.warn('No token available for request')
          }
          return config
        },
        error => Promise.reject(error)
      )

      // 响应拦截器
      this.instance.interceptors.response.use(
        response => {
          console.log('Response interceptor:', response.data)
          return response.data
        },
        error => {
          // 处理网络错误
          if (error.response) {
            // 服务器返回了状态码，但状态码不在 2xx 范围内
            console.error('Network Error:', error)
            return Promise.reject(new Error('服务端在摸鱼，快去告状'))
          } else if (error.request) {
            // 请求已发出，但没有收到响应
            console.error('Network Error:', error)
            return Promise.reject(new Error('服务端在摸鱼，快去告状'))
          } else {
            // 其他错误
            return Promise.reject(new Error('请求配置错误'))
          }
        }
      )
    }
    return this.instance
  }

  // 日志记录请求
  logRequest(config) {
    console.log('发送请求:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      params: config.params
    })
  }

  // 日志记录响应
  logResponse(response) {
    console.log('接收响应:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
  }

  // 日志记录错误
  logError(error) {
    console.error('请求错误:', {
      message: error.message,
      config: error.config,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    })
  }

  request(config) {
    console.log('当前实例:', this.instance)
    return this.getInstance().request(config)
  }

  get(url, config = {}) {
    return this.getInstance().get(url, config)
  }

  post(url, data, config = {}) {
    return this.request({ ...config, url, method: 'POST', data })
  }

  put(url, data, config = {}) {
    return this.getInstance().put(url, data, config)
  }

  delete(url, config = {}) {
    return this.getInstance().delete(url, config)
  }

  // 需要登录验证的接口路径
  authRequiredPaths = [
    '/users/info',
    '/cart',
    '/orders',
    '/profile'
  ]

  // 可以缓存的接口路径
  cacheablePaths = [
    '/categories',
    '/products'
  ]

  // 判断是否需要登录验证
  isAuthRequired(url) {
    return this.authRequiredPaths.some(path => url.startsWith(path))
  }

  // 判断是否可以缓存
  isCacheable(config) {
    return config.method === 'get' && 
           this.cacheablePaths.some(path => config.url.startsWith(path))
  }

  // 设置拦截器
  setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      config => this.handleRequest(config),
      error => Promise.reject(error)
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      response => response.data,
      error => this.handleResponseError(error)
    )
  }

  // 处理请求
  async handleRequest(config) {
    // 检查缓存
    if (this.isCacheable(config)) {
      const cachedData = cacheManager.get(config.url)
      if (cachedData) {
        return Promise.resolve(cachedData)
      }
    }

    // 添加token
    const token = tokenManager.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  }

  // 处理响应错误
  async handleResponseError(error) {
    const originalRequest = error.config

    // 处理401和403错误
    if (error.response?.status === 401 && !originalRequest._retry || error.response?.status === 403 && !originalRequest._retry ) {
      if (this.isRefreshing) {
        return new Promise(resolve => {
          this.refreshSubscribers.push(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(this.instance(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      this.isRefreshing = true

      try {
        const newToken = await this.refreshToken()
        this.refreshSubscribers.forEach(callback => callback(newToken))
        this.refreshSubscribers = []
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return this.instance(originalRequest)
      } catch (refreshError) {
        this.refreshSubscribers = []
        tokenManager.clearTokens()
        ElMessage.error('登录已过期，请重新登录')
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
        return Promise.reject(refreshError)
      } finally {
        this.isRefreshing = false
      }
    }

    // 处理其他错误
    const errorInfo = errorHandler.handleApiError(error)
    ElMessage.error(errorInfo.message)
    return Promise.reject(errorInfo)
  }

  // 发送请求
  async request(config) {
    try {
      const response = await this.getInstance()(config)
      
      // 缓存响应
      if (this.isCacheable(config)) {
        cacheManager.set(config.url, response)
      }

      return response
    } catch (error) {
      console.error('请求失败:', error)
      return Promise.reject(error)
    }
  }

  // 便捷方法
  get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' })
  }

  put(url, data, config = {}) {
    return this.request({ ...config, url, method: 'PUT', data })
  }

  delete(url, config = {}) {
    return this.request({ ...config, url, method: 'DELETE' })
  }

  patch(url, data, config = {}) {
    return this.request({ ...config, url, method: 'PATCH', data })
  }
}

export const httpClient = new HttpClient()
export default httpClient.request.bind(httpClient) 