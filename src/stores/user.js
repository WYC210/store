import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/utils/auth'
import { setCookie, getCookie, removeCookie } from '@/utils/cookie'
import router from '@/router'

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

    async login(credentials) {
      try {
        const response = await login(credentials)
        if (response.state === 200 && response.data) {
          const { token, ...userInfo } = response.data
          
          // 保存 token 到 cookie
          if (token) {
            // 去掉 "Bearer " 前缀
            const tokenValue = token.replace('Bearer ', '')
            setCookie('token', tokenValue, {
              path: '/',
              maxAge: 7 * 24 * 60 * 60,  // 7天有效期（秒）
              secure: false  // 开发环境设置为 false
            })
            console.log('Token saved:', tokenValue) // 调试用
          }

          // 保存用户信息
          this.userInfo = userInfo
          this._isLoggedIn = true
          localStorage.setItem('userInfo', JSON.stringify(userInfo))

          return true
        }
        return false
      } catch (error) {
        console.error('登录失败:', error)
        return false
      }
    },

    logout() {
      this.userInfo = null
      this._isLoggedIn = false
      localStorage.removeItem('userInfo')
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
        this.logout()
        return false
      } catch (error) {
        console.error('Validate token error:', error)
        this.logout()
        throw error
      }
    },

    initializeFromStorage() {
      const userInfo = localStorage.getItem('userInfo')
      const token = getCookie('token')
      if (userInfo && token) {
        this.userInfo = JSON.parse(userInfo)
        this._isLoggedIn = true
      } else {
        this.logout()
      }
    }
  }
}) 