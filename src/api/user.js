import axios from 'axios'

// 登录
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 注册
export const register = async (userData) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8088/users/reg',
      data: userData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('API register error:', error)
    throw error
  }
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
} 