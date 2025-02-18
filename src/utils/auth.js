import request from './request'
import { setCookie, removeCookie } from '@/utils/cookie'
import router from '@/router'

// 安全相关配置
const SECURITY_CONFIG = {
  tokenExpireTime: 2 * 60 * 60 * 1000, // token 有效期 2 小时
  maxLoginAttempts: 5, // 最大登录尝试次数
  lockoutTime: 15 * 60 * 1000 // 锁定时间 15 分钟
}

// 登录
export const login = async (credentials) => {
  try {
    const response = await request({
      url: '/auth/login',
      method: 'POST',
      data: credentials,
      withCredentials: true
    })
    return response
  } catch (error) {
    console.error('登录请求失败:', error)
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
export const logout = async () => {
  try {
    await request({
      url: '/auth/logout',
      method: 'POST',
      withCredentials: true
    })
  } catch (error) {
    console.error('登出请求失败:', error)
  } finally {
    // 无论登出请求是否成功，都清除本地状态
    removeCookie('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
  }
}

// 刷新 token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    const response = await request({
      url: '/auth/refresh',
      method: 'POST',
      data: { refreshToken },
      withCredentials: true
    })
    
    if (response.state === 200) {
      const { accessToken, refreshToken } = response.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      return { accessToken, refreshToken }
    }
    throw new Error(response.message || '刷新 token 失败')
  } catch (error) {
    console.error('刷新 token 失败:', error)
    throw error
  }
} 