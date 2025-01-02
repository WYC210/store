<template>
  <div class="register-container">
    <el-card class="register-box">
      <div class="register-header">
        <div class="logo-container" ref="logoRef">
          <svg class="animated-text" preserveAspectRatio="xMidYMid meet" viewBox="41.8 35.90001 205.50002 94.1">
            <!-- SVG 路径保持不变 -->
          </svg>
        </div>
        <h2>注册</h2>
        <p class="welcome-text">创建您的账号</p>
      </div>

      <el-form 
        :model="formData" 
        :rules="rules" 
        ref="registerFormRef" 
        class="register-form"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="formData.username" 
            placeholder="请输入用户名"
            :disabled="loading"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="formData.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
            :disabled="loading"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleRegister"
            :loading="loading"
            class="register-button"
          >
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-link">
        已有账号？
        <router-link to="/login">立即登录</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/utils/auth'

const router = useRouter()
const loading = ref(false)
const registerFormRef = ref(null)

const formData = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    loading.value = true
    
    // 表单验证
    await registerFormRef.value.validate()
    
    // 发送注册请求
    const response = await register({
      username: formData.value.username.trim(),
      password: formData.value.password
    })

    // 注册成功
    ElMessage.success('注册成功，请登录')
    router.push('/login')
    
  } catch (error) {
    console.error('Register error:', error)
    ElMessage.error(error.message || '注册失败，请重试')
  } finally {
    loading.value = false
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

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-container {
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  position: relative;
}

.animated-text {
  width: 100%;
  height: 100%;
}

.animated-text path {
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);
  animation: drawPath 2s ease forwards;
}

@keyframes drawPath {
  to {
    stroke-dashoffset: 0;
  }
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #333;
  margin: 0;
  font-size: 24px;
  animation: fadeIn 0.6s ease-out 0.3s both;
}

.welcome-text {
  color: #666;
  margin: 10px 0 0;
  animation: fadeIn 0.6s ease-out 0.4s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-form {
  animation: fadeIn 0.6s ease-out 0.5s both;
}

:deep(.el-input__wrapper) {
  background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6)) !important;
  border: 2px solid transparent !important;
  background-clip: padding-box !important;
  backdrop-filter: blur(5px) !important;
  box-shadow: none !important;
  transition: all 0.3s ease !important;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  border-color: #4ECDC4 !important;
  box-shadow: 0 0 10px rgba(78, 205, 196, 0.2) !important;
}

:deep(.el-button) {
  background: linear-gradient(45deg, #4ECDC4, #45B7D1);
  border: none;
  width: 100%;
  height: 40px;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
}

:deep(.el-button)::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

:deep(.el-button:hover)::before {
  left: 100%;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  animation: fadeIn 0.6s ease-out 0.6s both;
}

.login-link a {
  color: #4ECDC4;
  text-decoration: none;
  margin-left: 5px;
}

.login-link a:hover {
  text-decoration: underline;
}

/* 优化动画性能 */
.animated-logo {
  width: 100%;
  height: 100%;
  will-change: transform;
  transform: translateZ(0);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .register-box {
    width: 90%;
    padding: 20px;
  }

  .logo-container {
    width: 100px;
    height: 100px;
  }
}
</style> 