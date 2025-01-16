import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/utils/auth'
import { setCookie, getCookie, removeCookie } from '@/utils/cookie'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    isAuthenticated: false
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.userInfo
  },

  actions: {
    setUserInfo(info) {
      this.userInfo = info
      this.isAuthenticated = true
      localStorage.setItem('userInfo', JSON.stringify(info))
      localStorage.setItem('isAuthenticated', 'true')
    },

    async login(userData) {
      try {
        const response = await login({
          username: userData.username.trim(),
          password: userData.password
        })

        if (response.state === 200 && response.data) {
          // 保存登录返回的 token
          const { token, ...userInfo } = response.data
          if (token) {
            setCookie('token', token, {
              path: '/',
              maxAge: 7 * 24 * 60 * 60  // 7天有效期
            })
          }
          
          // 直接使用登录响应中的用户信息
          this.setUserInfo({
            uid: userInfo.uid,
            username: userInfo.username,
            avatar: userInfo.avatar,
            power: userInfo.power,
            phone: userInfo.phone,
            email: userInfo.email,
            gender: userInfo.gender,
            createdTime: userInfo.createdTime,
            modifiedTime: userInfo.modifiedTime
          })

          return response
        } else {
          throw new Error(response.message || '登录失败')
        }
      } catch (error) {
        console.error('Login error:', error)
        this.clearUserInfo()
        removeCookie('token')
        throw error
      }
    },

    async logout() {
      try {
        this.clearUserInfo()
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    },

    clearUserInfo() {
      this.userInfo = null
      this.isAuthenticated = false
      localStorage.removeItem('userInfo')
      localStorage.removeItem('isAuthenticated')
      // 确保清除 cookie
      removeCookie('token')
    },

    async validateToken() {
      try {
        const response = await getUserInfo()
        
        // 检查响应状态和数据
        if (response.state === 200) {
          // 如果后端直接返回 true，说明用户已登录
          if (response.data === true) {
            // 再次获取用户详细信息
            const userInfoResponse = await getUserInfo()
            if (userInfoResponse.state === 200 && userInfoResponse.data) {
              this.setUserInfo({
                ...userInfoResponse.data
              })
              return true
            }
          } else if (typeof response.data === 'object') {
            // 如果返回的是用户信息对象，直接使用
            this.setUserInfo({
              ...response.data
            })
            return true
          }
        }
        
        // 如果没有有效的用户信息，清除状态
        this.clearUserInfo()
        return false
      } catch (error) {
        console.error('Validate token error:', error)
        this.clearUserInfo()
        throw error
      }
    },

    initializeFromStorage() {
      const savedUserInfo = localStorage.getItem('userInfo')
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
      
      if (savedUserInfo && isAuthenticated) {
        this.userInfo = JSON.parse(savedUserInfo)
        this.isAuthenticated = true
      }
    }
  }
}) 