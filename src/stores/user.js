import { defineStore } from 'pinia'
import { auth } from '@/utils/auth'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { tokenManager } from '@/utils/tokenManager'
import { httpClient } from '@/utils/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    isLoggedIn: false
  }),

  actions: {
    async initializeFromStorage() {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo && userInfo !== 'undefined') {
        try {
          this.userInfo = JSON.parse(userInfo)
          this.isLoggedIn = true
        } catch (error) {
          console.error('解析用户信息失败:', error)
          this.clearUserState()
        }
      } else {
        this.clearUserState()
      }
    },

    async login(credentials) {
      try {
        console.log('Attempting login with credentials:', credentials)
        const response = await httpClient.post('/users/login', credentials)
        console.log('Login response:', response)  // 添加日志
        
        if (response.state === 200) {
          // 检查响应数据结构
          console.log('Login response data:', response.data)
          
          // 解构前检查数据是否存在
          if (!response.data || !response.data.accessToken || !response.data.refreshToken) {
            console.error('Invalid response data structure:', response.data)
            throw new Error('登录响应数据格式错误')
          }

          const { accessToken, refreshToken, userInfo } = response.data
          
          // 检查 token 值
          console.log('Tokens received:', { accessToken, refreshToken })
          
          // 保存 token
          const tokenSet = tokenManager.setTokens(accessToken, refreshToken)
          if (!tokenSet) {
            throw new Error('保存令牌失败')
          }
          
          // 更新用户状态
          this.isLoggedIn = true
          this.setUserInfo(userInfo)
          
          console.log('Login successful, tokens set')
          return response
        }
        
        throw new Error(response.message || '登录失败')
      } catch (error) {
        console.error('登录失败，详细错误:', error)
        throw error
      }
    },

    async logout() {
      try {
        await httpClient.post('/auth/logout')
      } catch (error) {
        console.error('登出失败:', error)
      } finally {
        this.clearUserState()
        tokenManager.clearTokens()
        router.push('/login')
      }
    },

    setUserInfo(info) {
      this.userInfo = info
      this.isLoggedIn = true
      localStorage.setItem('userInfo', JSON.stringify(info))
    },

    clearUserState() {
      this.userInfo = null
      this.isLoggedIn = false
      localStorage.removeItem('userInfo')
    }
  }
}) 