import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
}

// 注册
export function register(userData) {
  return request({
    url: '/users/reg',
    method: 'post',
    data: userData,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/users/info',
    method: 'get',
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/users/update',
    method: 'patch',
    data: {
      phone: data.phone,
      email: data.email,
      gender: data.gender
    },
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
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
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
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
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
} 