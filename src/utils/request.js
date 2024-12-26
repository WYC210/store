/* eslint-disable */
import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8088',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果状态码是200，说明操作成功
    if (res.state === 200) {
      return res
    }
    
    // 非 200 状态码，直接返回错误响应
    return Promise.reject(res)
  }
)

// 封装请求方法
export const http = {
  post(url, data) {
    return request({
      url,
      method: 'post',
      data
    })
  },
  get(url, params) {
    return request({
      url,
      method: 'get',
      params
    })
  }
}

export default http 