import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/utils/auth'
import { setCookie, getCookie, removeCookie } from '@/utils/cookie'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getCookie('token') || '',
    userInfo: null,
    logoutTimer: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    setToken(token) {
      if (!token) {
        console.error('Token is empty')
        return
      }
      
      this.token = token
      setCookie('token', token, {
        path: '/',
        sameSite: 'Lax',
        maxAge: 7200 // 2小时过期
      })
    },

    clearToken() {
      this.token = ''
      removeCookie('token')
    },

    setUserInfo(info) {
      this.userInfo = info
    },

    async login(userData) {
      try {
        const response = await login({
          username: userData.username.trim(),
          password: userData.password
        })

        console.log('Login response:', response) // 调试用

        if (response.state === 200 && response.data) {
          const token = response.data.token
          
          // 先设置 token
          this.setToken(token)
          console.log('Token set:', token) // 调试用
          
          // 验证 token 是否设置成功
          const savedToken = getCookie('token')
          console.log('Saved token:', savedToken) // 调试用
          
          if (!savedToken) {
            throw new Error('Token 设置失败')
          }

          // 设置用户信息
          this.setUserInfo({
            uid: response.data.uid,
            username: response.data.username,
            avatar: response.data.avatar
          })

          return response
        } else {
          throw new Error(response.message || '登录失败')
        }
      } catch (error) {
        console.error('Login error:', error)
        this.clearToken()
        this.userInfo = null
        throw error
      }
    },

    async logout() {
      this.clearAutoLogout()
      try {
        this.clearToken()
        this.userInfo = null
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    },

    async validateToken() {
      try {
        const token = getCookie('token')
        if (!token) {
          throw new Error('未登录')
        }

        const response = await getUserInfo()
        
        if (response.state === 200 && response.data) {
          this.setUserInfo(response.data)
          return response
        } else {
          this.clearToken()
          this.userInfo = null
          throw new Error(response.message || '验证失败')
        }
      } catch (error) {
        this.clearToken()
        this.userInfo = null
        throw error
      }
    },

    startAutoLogout() {
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer)
      }

      const token = localStorage.getItem('token')
      if (token) {
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]))
          const expTime = tokenData.exp * 1000
          const timeToExpire = expTime - Date.now()
          
          if (timeToExpire > 0) {
            this.logoutTimer = setTimeout(() => {
              this.logout()
              ElMessage.warning('登录已过期，请重新登录')
            }, timeToExpire)
          }
        } catch (error) {
          console.error('Token parse error:', error)
        }
      }
    },

    clearAutoLogout() {
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer)
        this.logoutTimer = null
      }
    }
  }
}) 