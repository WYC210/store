class TokenManager {
  constructor() {
    console.log('TokenManager 正在初始化...')
    this.accessToken = localStorage.getItem('accessToken')
    this.refreshToken = localStorage.getItem('refreshToken')
    console.log('TokenManager 初始化完成，当前 token:', {
      accessToken: this.accessToken ? '存在' : '不存在',
      refreshToken: this.refreshToken ? '存在' : '不存在'
    })
  }

  // 保存令牌
  setTokens(accessToken, refreshToken) {
    console.log('Setting tokens with values:', { accessToken, refreshToken })
    
    // 验证参数
    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      console.error('Invalid token types:', {
        accessTokenType: typeof accessToken,
        refreshTokenType: typeof refreshToken
      })
      return false
    }

    if (!accessToken || !refreshToken) {
      console.error('Empty tokens provided:', { accessToken, refreshToken })
      return false
    }
    
    try {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      console.log('Tokens set successfully:', { accessToken, refreshToken })
      return true
    } catch (error) {
      console.error('Failed to set tokens:', error)
      return false
    }
  }

  // 获取访问令牌
  getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('accessToken')
    }
    console.log('Getting access token:', this.accessToken)
    return this.accessToken
  }

  // 获取刷新令牌
  getRefreshToken() {
    if (!this.refreshToken) {
      this.refreshToken = localStorage.getItem('refreshToken')
    }
    console.log('Getting refresh token:', this.refreshToken)
    return this.refreshToken
  }

  // 清除令牌
  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    console.log('Tokens cleared')
  }
}

// 添加调试日志
console.log('正在创建 tokenManager 实例...')
export const tokenManager = new TokenManager()
console.log('tokenManager 实例创建完成') 