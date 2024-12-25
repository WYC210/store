/* eslint-disable */
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8088',  // 后端服务器地址
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加请求头等配置
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 如果状态码是200，说明操作成功
    if (response.data.state === 200) {
      return response.data
    }
    // 其他状态码都按错误处理
    return Promise.reject(response.data)
  },
  error => {
    if (error.response) {
      const { state } = error.response.data
      console.log('Error State:', state)  // 输出错误状态码
      // 根据基类定义的状态码显示对应的错误信息
      switch (state) {
        case 4000:
          ElMessage.error('用户名被占用')
          break
        case 5001:
          ElMessage.error('用户不存在')
          break
        case 5002:
          ElMessage.error('密码不匹配')
          break
        case 5000:
          ElMessage.error('注册时发生未知错误')
          break
        default:
          console.log('Unhandled Error State:', state)  // 输出未处理的错误状态码
          ElMessage.error(error.response.data.message || '未知错误')
      }
    } else if (error.request) {
      console.log('Network Error')  // 输出网络错误
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      console.log('Request Error:', error)  // 输出其他错误
      ElMessage.error('请求失败，请稍后重试')
    }
    return Promise.reject(error)
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