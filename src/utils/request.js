/* eslint-disable */
import axios from 'axios'
import { getCookie } from '@/utils/cookie'
import router from '@/router'
import { ElMessage } from 'element-plus'

// 创建 axios 实例，配置基础参数
const request = axios.create({
  baseURL: 'http://localhost:8088', // 后端服务器地址
  timeout: 5000,  // 请求超时时间
  headers: {
    'Content-Type': 'application/json'  // 默认请求头
  },
  withCredentials: true  // 允许携带 cookie
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
    if (isAuthRequired(config.url)) {
      const token = getCookie('token')
      console.log('Request token:', token) // 调试用
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        console.warn('No token found for auth required path:', config.url)
        return Promise.reject(new Error('请先登录'))
      }
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    console.log('Response:', response) // 调试用
    
    if (isAuthRequired(response.config.url) && response.data.state === 401) {
      removeCookie('token')
      router.push('/login')
      ElMessage.error('登录已过期，请重新登录')
      return Promise.reject(new Error('登录已过期'))
    }
    return response.data
  },
  error => {
    console.error('Request error:', error)
    
    if (error.response) {
      if (error.response.status === 401 && isAuthRequired(error.config.url)) {
        removeCookie('token')
        router.push('/login')
        ElMessage.error('登录已过期，请重新登录')
      } else {
        ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

export default request 