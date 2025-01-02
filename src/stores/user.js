import { defineStore } from 'pinia'
import { login } from '@/utils/auth'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
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
        
        if (response.state === 200 && response.data) {
          this.setToken(response.data.token)
          this.setUserInfo(response.data)
          return response
        } else {
          throw new Error(response.message || '登录失败')
        }
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    
    async logout() {
      try {
        this.token = ''
        this.userInfo = null
        localStorage.removeItem('token')
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    }
  }
}) 