/* eslint-disable */
import axios from 'axios'
import { getCookie, removeCookie } from '@/utils/cookie'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8088',
  timeout: 5000,
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

// 添加请求拦截器，输出请求信息
request.interceptors.request.use(
  config => {
    console.log('发送请求:', {
      url: config.baseURL + config.url,
      method: config.method,
      data: config.data,
      params: config.params
    })
    
    const token = getCookie('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    console.log('接收响应:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response.data
  },
  error => {
    console.error('响应错误:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      removeCookie('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('isAuthenticated')
    }
    return Promise.reject(error)
  }
)

export default request 