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
      data: config.data
    });
    
    const token = getCookie('token')
    if (token && isAuthRequired(config.url)) {
      config.headers.Authorization = `Bearer ${token}`
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
    if (response.data.state === 500) {
      return Promise.reject(new Error(response.data.message))
    }
    if (response.data.state === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push({
        path: '/login',
        query: { redirect: router.currentRoute.value.fullPath }
      })
      return Promise.reject(new Error('请先登录'))
    }
    return response.data
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
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