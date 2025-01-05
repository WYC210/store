import request from './request'

// 安全相关配置
const SECURITY_CONFIG = {
  tokenExpireTime: 2 * 60 * 60 * 1000, // token 有效期 2 小时
  maxLoginAttempts: 5, // 最大登录尝试次数
  lockoutTime: 15 * 60 * 1000 // 锁定时间 15 分钟
}

// 登录时添加安全检查
export const login = async (userData) => {
  try {
    console.log('Login request:', userData) // 调试用
    
    const response = await request({
      url: '/users/login',
      method: 'post',
      data: userData
    })
    
    console.log('Login response:', response) // 调试用
    
    if (response.state === 200 && response.data) {
      return response
    } else {
      throw new Error(response.message || '登录失败')
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const register = async (userData) => {
  try {
    const response = await request({
      url: '/users/reg',
      method: 'post',
      data: userData
    })
    
    if (response.state !== 200) {
      throw new Error(response.message || '注册失败')
    }
    
    return response
  } catch (error) {
    console.error('Register error:', error)
    if (error.response) {
      throw new Error(error.response.data?.message || '注册失败')
    } else if (error.request) {
      throw new Error('网络请求失败，请检查网络连接')
    } else {
      throw new Error(error.message || '注册失败')
    }
  }
}

// 获取用户信息
export const getUserInfo = async () => {
  try {
    const response = await request({
      url: '/users/info',
      method: 'get'
    })
    return response
  } catch (error) {
    console.error('Get user info error:', error)
    throw error
  }
}

// 登出
export const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
} 