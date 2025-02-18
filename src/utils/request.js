/* eslint-disable */
import axios from 'axios'
import { getCookie, removeCookie } from '@/utils/cookie'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8088',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// 需要登录验证的接口路径
const authRequiredPaths = [
  '/users/info',
  '/cart',
  '/orders',
  '/profile'
]

// 判断是否需要登录验证
const isAuthRequired = (url) => {
  return authRequiredPaths.some(path => url.startsWith(path))
}

// 添加请求拦截器
request.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加刷新 token 的函数
const refreshTokenRequest = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    const response = await axios.post('http://localhost:8088/auth/refresh', {
      refreshToken
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    
    if (response.data.state === 200) {
      const { accessToken, refreshToken } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      return accessToken
    }
    throw new Error('刷新 token 失败')
  } catch (error) {
    console.error('刷新 token 失败:', error)
    throw error
  }
}

// 存储等待刷新 token 的请求队列
let isRefreshing = false
let requests = []

// 修改响应拦截器
request.interceptors.response.use(
  response => response.data,
  async error => {
    const originalRequest = error.config

    // 如果响应状态码是 401 且请求未被标记为重试
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 如果正在刷新 token，将请求加入队列
        return new Promise(resolve => {
          requests.push(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(request(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshTokenRequest()
        
        // 执行队列中的请求
        requests.forEach(callback => callback(newToken))
        requests = []
        
        // 重试当前请求
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return request(originalRequest)
      } catch (refreshError) {
        // 刷新 token 失败，清除用户状态并跳转到登录页
        const userStore = useUserStore()
        userStore.clearUserState()
        router.push('/login')
        ElMessage.error('登录已过期，请重新登录')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    
    // 处理其他错误
    ElMessage.error(error.response?.data?.message || '请求失败')
    return Promise.reject(error)
  }
)

export default request 