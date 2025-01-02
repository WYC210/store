import request from './request'

export const login = async (userData) => {
  try {
    const response = await request({
      url: '/users/login',
      method: 'post',
      data: userData
    })
    
    // 检查响应状态
    if (response.state !== 200) {
      throw new Error(response.message || '登录失败')
    }
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    // 处理不同类型的错误
    if (error.response) {
      throw new Error(error.response.data?.message || '登录失败')
    } else if (error.request) {
      throw new Error('网络请求失败，请检查网络连接')
    } else {
      throw new Error(error.message || '登录失败')
    }
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