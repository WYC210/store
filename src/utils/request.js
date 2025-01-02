/* eslint-disable */
import axios from 'axios'
import router from '@/router'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8088',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求取消功能
const pendingRequests = new Map()

const generateRequestKey = (config) => {
  const { url, method, params, data } = config
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 请求拦截器
request.interceptors.request.use(
  config => {
    const requestKey = generateRequestKey(config)
    
    // 如果存在相同的请求，取消之前的请求
    if (pendingRequests.has(requestKey)) {
      const controller = pendingRequests.get(requestKey)
      controller.abort()
      pendingRequests.delete(requestKey)
    }
    
    // 创建新的 AbortController
    const controller = new AbortController()
    config.signal = controller.signal
    pendingRequests.set(requestKey, controller)
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const requestKey = generateRequestKey(response.config)
    pendingRequests.delete(requestKey)
    return response.data
  },
  error => {
    if (error.config) {
      const requestKey = generateRequestKey(error.config)
      pendingRequests.delete(requestKey)
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default request 