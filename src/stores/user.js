import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/utils/auth'
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
      if (!token) {
        console.error('Token is empty')
        return
      }
      console.log('Setting token:', token) // 调试用
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
        
        console.log('登录响应:', response)
        
        if (response.state === 200 && response.data) {
          const token = response.data.token
          console.log('保存 token:', token) // 调试用
          
          this.setToken(token)
          
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
    },
    
    async validateToken() {
      try {
        if (!this.token) {
          throw new Error('未登录')
        }
        
        const response = await getUserInfo()
        console.log('验证响应:', response)
        
        if (response.state === 200 && response.data) {
          this.setUserInfo(response.data)
          return response
        } else {
          this.token = ''
          this.userInfo = null
          localStorage.removeItem('token')
          throw new Error(response.message || '验证失败')
        }
      } catch (error) {
        this.token = ''
        this.userInfo = null
        localStorage.removeItem('token')
        throw error
      }
    }
  }
}) 