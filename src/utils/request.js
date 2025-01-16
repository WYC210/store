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
  }
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
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
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
    return Promise.reject(error)
  }
)

export default request 