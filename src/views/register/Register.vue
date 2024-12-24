<template>
  <div class="register-container">
    <el-card class="register-box">
      <div class="register-header">
        <div class="logo-container">
          <svg class="animated-text" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%;" viewBox="41.8 35.90001 205.50002 94.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FF6B6B"/>
                <stop offset="50%" style="stop-color:#4ECDC4"/>
                <stop offset="100%" style="stop-color:#45B7D1"/>
              </linearGradient>
            </defs>
            <!-- 使用与登录页相同的 SVG path -->
            <path d="M 53.5 47.800003 Q 55.2 45.90001 58.5 45.90001 L 58.7 45.90001 Q 61.5 45.90001 63.4 47.300003 Q 65.3 48.700005 66 51.40001 L 76 92.90001 L 87.7 51.40001 Q 89.2 45.90001 95 45.90001 L 95.600006 45.90001 Q 101.3 45.90001 102.9 51.40001 L 115.200005 93.200005 L 125.200005 51.40001 Q 126.6 45.90001 132.1 45.90001 L 132.3 45.90001 Q 135.70001 45.90001 137.55 47.800003 Q 139.4 49.700005 138.6 52.90001 L 123.200005 114.40001 Q 121.9 120.00001 116 120.00001 L 115.700005 120.00001 Q 109.9 120.00001 108.4 114.50001 L 95.4 68.20001 L 82.7 114.50001 Q 81.3 120.00001 75.5 120.00001 L 75.2 120.00001 Q 69.3 120.00001 68 114.40001 L 52.6 52.90001 Q 51.8 49.700005 53.5 47.800003 Z" style="--path-length: 583.52783; fill: transparent; stroke: url(#logoGradient)"/>
            <path d="M 235.65001 108.65001 Q 237.30002 110.30001 237.30002 113.40001 L 237.30002 113.600006 Q 237.30002 116.700005 235.65001 118.350006 Q 234.00002 120.00001 230.90001 120.00001 L 187.00002 120.00001 Q 184.00002 120.00001 182.30002 118.25001 Q 180.6 116.50001 180.6 114.00001 L 180.6 113.40001 Q 180.6 111.100006 181.30002 109.50001 Q 182.00002 107.90001 184.30002 104.80001 L 216.70001 58.900005 L 187.80002 58.900005 Q 184.70001 58.900005 183.05002 57.250008 Q 181.40001 55.600006 181.40001 52.500008 L 181.40001 52.300003 Q 181.40001 49.200005 183.05002 47.550003 Q 184.70001 45.90001 187.80002 45.90001 L 228.6 45.90001 Q 231.6 45.90001 233.30002 47.65001 Q 235.00002 49.40001 235.00002 51.90001 L 235.00002 52.500008 Q 235.00002 54.800003 234.35 56.300007 Q 233.70001 57.800007 231.80002 60.500008 L 198.90001 107.00001 L 230.90001 107.00001 Q 234.00002 107.00001 235.65001 108.65001 Z" style="--path-length: 404.6023; fill: transparent; stroke: url(#logoGradient)"/>
          </svg>
        </div>
        <h2>注册账号</h2>
        <p class="welcome-text">创建您的账号，开始使用</p>
      </div>
      
      <el-form :model="registerForm" :rules="rules" ref="registerForm" class="register-form">
        <el-form-item prop="username">
          <el-input 
            v-model="registerForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
            size="large">
          </el-input>
        </el-form-item>

        <el-form-item prop="email">
          <el-input 
            v-model="registerForm.email"
            :prefix-icon="Message"
            placeholder="请输入邮箱"
            size="large">
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="registerForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password>
          </el-input>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请确认密码"
            size="large"
            show-password>
          </el-input>
        </el-form-item>

        <el-form-item prop="agreement">
          <el-checkbox v-model="registerForm.agreement">
            我已阅读并同意
            <el-link type="primary" :underline="false">用户协议</el-link>
            和
            <el-link type="primary" :underline="false">隐私政策</el-link>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleRegister" 
            class="register-button"
            :loading="loading"
            size="large">
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>

        <div class="login-link">
          已有账号？
          <router-link to="/login">立即登录</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { register } from '@/api/user'

export default {
  name: 'UserRegister',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const registerForm = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreement: false
    })

    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== registerForm.value.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名长度不能小于3位', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, validator: validatePass2, trigger: 'blur' }
      ],
      agreement: [
        {
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请阅读并同意用户协议和隐私政策'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }
      ]
    }

    const handleRegister = async () => {
      try {
        loading.value = true
        const res = await register({
          username: registerForm.value.username,
          email: registerForm.value.email,
          password: registerForm.value.password
        })
        
        ElMessage.success('注册成功！')
        // 注册成功后跳转到登录页
        router.push('/login')
      } catch (error) {
        console.error('注册失败:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      registerForm,
      rules,
      loading,
      handleRegister,
      User,
      Lock,
      Message
    }
  }
}
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #212121;
  overflow: hidden;
}

.register-box {
  width: 400px;
  padding: 40px;
  background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: slideUp 0.6s ease-out;
}

/* 复用登录页面的大部分样式 */
:deep(.el-input__wrapper) {
  background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6)) !important;
  border: 2px solid transparent !important;
  background-clip: padding-box !important;
  backdrop-filter: blur(5px) !important;
  box-shadow: 0 2px 10px rgba(31, 38, 135, 0.07) !important;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper.is-focus) {
  border-image: linear-gradient(45deg, #FF6B6B, #4ECDC4) 1 !important;
  box-shadow: 0 4px 15px rgba(31, 38, 135, 0.1) !important;
}

:deep(.el-button--primary) {
  background: linear-gradient(45deg, #FF6B6B, #4ECDC4) !important;
  border: none !important;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(78, 205, 196, 0.4);
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  width: 180px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-text {
  color: #909399;
  margin-top: 10px;
  font-size: 14px;
}

.register-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #909399;
}

.login-link a {
  color: #4ECDC4;
  text-decoration: none;
  margin-left: 5px;
}

.login-link a:hover {
  text-decoration: underline;
}

/* 复用动画相关样式 */
.animated-text {
  max-width: 100%;
  height: auto;
  transform: scale(1.2);
}

.animated-text path {
  fill: transparent;
  stroke: url(#logoGradient);
  stroke-width: 2;
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);
  animation: logo-anim 15s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  transform-origin: center;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@keyframes logo-anim {
  0% {
    stroke-dashoffset: var(--path-length);
    stroke-dasharray: var(--path-length) var(--path-length);
    opacity: 0;
    fill: transparent;
  }

  5% {
    opacity: 1;
    stroke-dashoffset: var(--path-length);
    stroke-dasharray: var(--path-length) var(--path-length);
  }

  50% {
    stroke-dashoffset: 0;
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: transparent;
  }

  60% {
    stroke-dashoffset: 0;
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: currentColor;
    opacity: 1;
  }

  75% {
    stroke-dashoffset: 0;
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: currentColor;
    opacity: 1;
  }

  85% {
    stroke-dashoffset: 0;
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: transparent;
    opacity: 1;
  }

  95% {
    stroke-dashoffset: var(--path-length);
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: transparent;
    opacity: 1;
  }

  100% {
    stroke-dashoffset: var(--path-length);
    stroke-dasharray: var(--path-length) var(--path-length);
    fill: transparent;
    opacity: 0;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
