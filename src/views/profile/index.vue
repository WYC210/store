<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <div class="profile-header">
        <div class="avatar-container">
          <el-avatar 
            :size="100" 
            :src="userStore.userInfo?.avatar || '/default-avatar.png'"
          />
        </div>
        <h2>个人中心</h2>
      </div>

      <div class="profile-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户名">
            {{ userStore.userInfo?.username }}
          </el-descriptions-item>
          <el-descriptions-item label="用户ID">
            {{ userStore.userInfo?.uid }}
          </el-descriptions-item>
          <el-descriptions-item label="注册时间">
            {{ formatDate(userStore.userInfo?.createTime) }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="action-buttons">
          <el-button type="primary" @click="handleEditProfile">
            编辑资料
          </el-button>
          <el-button type="danger" @click="handleLogout">
            退出登录
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { getCookie, removeCookie } from '@/utils/cookie'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)

// 格式化日期
const formatDate = (date) => {
  if (!date) return '暂无数据'
  return new Date(date).toLocaleDateString()
}

// 编辑资料
const handleEditProfile = () => {
  ElMessage.info('编辑资料功能开发中...')
}

// 退出登录
const handleLogout = async () => {
  try {
    await userStore.logout()
    ElMessage.success('退出成功')
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
    ElMessage.error('退出失败')
  }
}

// 检查登录状态并获取用户信息
const checkAuth = async () => {
  try {
    loading.value = true
    // 先验证本地是否有 token
    const token = getCookie('token')
    if (!token) {
      throw new Error('未登录')
    }

    // 验证 token 并获取用户信息
    const response = await userStore.validateToken()
    if (!response || response.state !== 200) {
      throw new Error('验证失败')
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    removeCookie('token')
    ElMessage.warning('请重新登录')
    router.push('/login')
  } finally {
    loading.value = false
  }
}

// 在组件挂载时立即验证
onMounted(async () => {
  await checkAuth()
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  background: #0B0B2B;
}

.profile-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-container {
  margin-bottom: 20px;
}

.profile-header h2 {
  color: #4ECDC4;
  margin: 0;
}

.profile-content {
  padding: 20px 0;
}

:deep(.el-descriptions) {
  margin-bottom: 30px;
}

:deep(.el-descriptions__label) {
  color: #4ECDC4;
}

:deep(.el-descriptions__content) {
  color: #fff;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

@media screen and (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }
  
  .avatar-container :deep(.el-avatar) {
    width: 80px;
    height: 80px;
  }
}
</style> 