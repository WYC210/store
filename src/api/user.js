import axios from 'axios'
import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data,
    withCredentials: true
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

// 更新用户信息
export const updateUserInfo = (data) => {
  return request({
    url: '/users/update',
    method: 'patch',
    data: {
      phone: data.phone,
      email: data.email,
      gender: data.gender
    }
  })
}

// 更新密码
export const updatePassword = (data) => {
  return request({
    url: '/users/password',
    method: 'patch',
    data: {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    },
    withCredentials: true
  })
}

// 更新头像
export const updateAvatar = (file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  
  return request({
    url: '/users/avatar',
    method: 'patch',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
} 