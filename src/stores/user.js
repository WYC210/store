import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/utils/auth'
import router from '@/router'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    _isLoggedIn: false,
  }),

  getters: {
    isLoggedIn: (state) => state._isLoggedIn
  },

  actions: {
    setUserInfo(info) {
      this.userInfo = info
      this._isLoggedIn = true
      localStorage.setItem('userInfo', JSON.stringify(info))
    },

    // 保存 tokens
    storeTokens(tokens) {
      const { accessToken, refreshToken } = tokens
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },

    // 清除 tokens
    clearTokens() {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },

    async login(credentials) {
      try {
        const response = await login(credentials)
        if (response.state === 200 && response.data) {
          const { accessToken, refreshToken } = response.data
          if (!accessToken || !refreshToken) {
            throw new Error(response.message || '登录响应中缺少 token')
          }
          
          // 保存 tokens
          this.storeTokens(response.data)
          console.log('Tokens saved:', { accessToken, refreshToken })

          // 保存用户信息
          const userInfo = {
            username: credentials.username,
            // 其他用户信息...
          }
          this.setUserInfo(userInfo)

          return true
        }
        throw new Error(response.message || '登录响应格式错误')
      } catch (error) {
        console.error('登录失败:', error)
        throw new Error(error.response?.data?.message || error.message || '登录失败')
      }
    },

    clearUserState() {
      this.userInfo = null
      this._isLoggedIn = false
      localStorage.removeItem('userInfo')
      this.clearTokens()
    },

    async logout() {
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await logout({ refreshToken })
          // 使用后端返回的成功消息
          ElMessage.success(response.message || '登出成功')
        }
      } catch (error) {
        console.error('登出请求失败:', error)
        // 使用后端返回的错误信息
        ElMessage.error(error.response?.data?.message || '登出失败')
      } finally {
        this.clearUserState()
        router.push('/login')
      }
    },

    // 验证 token 是否有效
    async validateToken() {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        
        if (!accessToken || !refreshToken) {
          return false
        }

        // 获取用户信息来验证 token
        const response = await getUserInfo()
        if (response.state === 200) {
          this.setUserInfo(response.data)
          return true
        }
        return false
      } catch (error) {
        console.error('Token 验证失败:', error)
        return false
      }
    },

    // 初始化用户状态
    async initializeFromStorage() {
      const userInfo = localStorage.getItem('userInfo')
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (userInfo && accessToken && refreshToken) {
        this.userInfo = JSON.parse(userInfo)
        this._isLoggedIn = true
        // 不主动验证 token，等待请求时再处理
        return true
      }
      return false
    }
  }
}) 