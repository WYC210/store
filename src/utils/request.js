/* eslint-disable */
import axios from 'axios'
import { getCookie, removeCookie } from '@/utils/cookie'
import router from '@/router'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8088',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true  // 全局启用 credentials
})

// 需要登录验证的接口路径
const authRequiredPaths = [
  '/users/info',  // 获取用户信息
  '/cart',        // 购物车相关
  '/orders',      // 订单相关
  '/profile'      // 个人中心相关
]

// 判断是否需要登录验证
const isAuthRequired = (url) => {
  return authRequiredPaths.some(path => url.startsWith(path))
}

// 请求拦截器
request.interceptors.request.use(
  config => {
    config.withCredentials = true
    // 从 cookie 中获取 token
    const token = getCookie('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 如果响应头中包含新的 token，更新 cookie
    const newToken = response.headers['new-token']
    if (newToken) {
      setCookie('token', newToken, {
        path: '/',
        maxAge: 7 * 24 * 60 * 60
      })
    }
    if (response.data.state === 500) {
      return Promise.reject(new Error(response.data.message))
    }
    if (response.data.state === 401) {
      if (response.config.withCredentials) {
        router.push('/login')
        return Promise.reject(new Error('请先登录'))
      }
    }
    return response.data
  },
  error => {
    console.error('Request error:', error)
    // 如果是 401 错误，可能是 cookie 过期
    if (error.response && error.response.status === 401) {
      // 清除无效的 token
      removeCookie('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('isAuthenticated')
    }
    return Promise.reject(error)
  }
)

export default request 