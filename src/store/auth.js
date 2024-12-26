import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { http } from '@/utils/request'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
  // 登录状态
  const userInfo = ref(null)
  const loading = ref(false)
  const formState = reactive({
    username: '',
    password: '',
    remember: false
  })

  // 注册状态
  const registerState = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreement: false
  })

  // 注册方法
  const register = async (formData) => {
    loading.value = true
    try {
      const res = await http.post('/users/reg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res.state === 200) {
        ElMessage.success('注册成功！')
        return true
      } else {
        handleRegisterError(res.state)
        return false
      }
    } catch (error) {
      handleError(error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 注册错误处理
  const handleRegisterError = (state) => {
    switch (state) {
      case 4000:
        ElMessage.error('用户名已被占用')
        break
      case 5000:
        ElMessage.error('注册时发生未知错误')
        break
      default:
        ElMessage.error('注册失败')
    }
  }

  // 重置状态
  const resetState = () => {
    if (!formState.remember) {
      formState.username = ''
      formState.password = ''
      formState.remember = false
    }
    registerState.username = ''
    registerState.email = ''
    registerState.password = ''
    registerState.confirmPassword = ''
    registerState.agreement = false
    loading.value = false
  }

  // 登录方法
  const login = async (formData) => {
    loading.value = true
    try {
      const res = await http.post('/users/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res.state === 200) {
        userInfo.value = res.data
        sessionStorage.setItem('userInfo', JSON.stringify(res.data))
        ElMessage.success('登录成功！')
        return true
      }
    } catch (error) {
      // 显示后端返回的错误消息
      ElMessage.error(error.message)
      return false
    } finally {
      loading.value = false
    }
  }

  // 登出方法
  const logout = () => {
    userInfo.value = null
    sessionStorage.removeItem('userInfo')
  }

  // 清理方法
  const cleanup = () => {
    if (!formState.remember) {
      formState.username = ''
      formState.password = ''
      formState.remember = false
    }
    loading.value = false
  }

  return {
    userInfo,
    loading,
    formState,
    registerState,
    login,
    register,
    resetState
  }
}) 