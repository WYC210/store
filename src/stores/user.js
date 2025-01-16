import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/utils/auth'
import { setCookie, getCookie, removeCookie } from '@/utils/cookie'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.userInfo
  },

  actions: {
    setUserInfo(info) {
      this.userInfo = info
      localStorage.setItem('userInfo', JSON.stringify(info))
    },

    async login(userData) {
      try {
        const response = await login({
          username: userData.username.trim(),
          password: userData.password
        })

        if (response.state === 200 && response.data) {
          // 先获取用户信息
          const userInfoResponse = await getUserInfo()
          
          if (userInfoResponse.state === 200 && userInfoResponse.data) {
            // 确保异步操作完成
            await new Promise(resolve => setTimeout(resolve, 50))
            
            // 设置用户信息
            this.setUserInfo({
              uid: userInfoResponse.data.uid,
              username: userInfoResponse.data.username,
              avatar: userInfoResponse.data.avatar,
              power: userInfoResponse.data.power
            })
            
            // 再次确认用户信息已经设置
            if (!this.userInfo) {
              throw new Error('用户信息设置失败')
            }
          } else {
            throw new Error('获取用户信息失败')
          }

          return response
        } else {
          throw new Error(response.message || '登录失败')
        }
      } catch (error) {
        console.error('Login error:', error)
        this.clearUserInfo()
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
      localStorage.removeItem('userInfo')
    },

    async validateToken() {
      try {
        // 尝试从 localStorage 恢复用户信息
        const savedUserInfo = localStorage.getItem('userInfo')
        if (savedUserInfo) {
          this.userInfo = JSON.parse(savedUserInfo)
        }

        const response = await getUserInfo()
        
        if (response.state === 200 && response.data) {
          this.setUserInfo(response.data)
          return response
        } else {
          this.clearUserInfo()
          throw new Error(response.message || '验证失败')
        }
      } catch (error) {
        this.clearUserInfo()
        throw error
      }
    },
  }
}) 