import request from '@/utils/request'

// 登录
export const login = async ({ username, password }) => {
  if (!username?.trim() || !password) {
    throw new Error('用户名和密码不能为空')
  }
  
  return request({
    url: '/users/login',
    method: 'post',
    data: {
      username: username.trim(),
      password
    },
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
}

// 注册
export const register = async (userData) => {
  const { username, password, email } = userData
  
  if (!username?.trim() || !password || !email?.trim()) {
    throw new Error('请填写完整的注册信息')
  }
  
  return request({
    url: '/users/reg',
    method: 'post',
    data: {
      username: username.trim(),
      password,
      email: email.trim()
    },
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
export const updateAvatar = async (file) => {
  if (!file || !(file instanceof File)) {
    throw new Error('请选择有效的图片文件')
  }
  
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

// 获取用户信息和权限
export const getUserData = async (userId) => {
  if (!userId) {
    throw new Error('用户ID不能为空')
  }
  
  try {
    const [userInfo, permissions] = await Promise.all([
      request({
        url: `/users/${userId}/info`,
        method: 'get'
      }),
      request({
        url: `/users/${userId}/permissions`,
        method: 'get'
      })
    ])
    
    return {
      userInfo: userInfo?.data,
      permissions: permissions?.data?.permissions ?? []
    }
  } catch (error) {
    console.error('获取用户数据失败:', error)
    throw error
  }
}

// 批量操作工具函数
export const batchUserOperations = async (operations) => {
  if (!Array.isArray(operations) || !operations.length) {
    return []
  }
  
  try {
    const results = await Promise.allSettled(
      operations.map(async ({ type, data }) => {
        switch (type) {
          case 'update':
            return request({
              url: '/users/update',
              method: 'put',
              data
            })
          case 'delete':
            return request({
              url: `/users/${data.userId}`,
              method: 'delete'
            })
          default:
            throw new Error(`未知的操作类型: ${type}`)
        }
      })
    )
    
    return results
      .map((result, index) => ({
        operation: operations[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }))
  } catch (error) {
    console.error('批量操作失败:', error)
    throw error
  }
} 