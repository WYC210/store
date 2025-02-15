<template>
  <div class="user-dropdown">
    <el-dropdown trigger="hover" @command="handleCommand">
      <el-button class="user-btn hologram-btn" type="primary">
        <el-icon><User /></el-icon>
        {{ userStore.userInfo?.username || '个人中心' }}
      </el-button>
      
      <template #dropdown>
        <el-dropdown-menu class="dream-dropdown">
          <el-dropdown-item command="profile">
            <el-icon><UserFilled /></el-icon>
            我的信息
          </el-dropdown-item>
          <el-dropdown-item command="orders">
            <el-icon><List /></el-icon>
            我的订单
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { User, UserFilled, List } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'orders':
      router.push('/profile/orders')
      break
  }
}
</script>

<style scoped>
.user-dropdown {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

:deep(.dream-dropdown) {
  background: rgba(6, 5, 36, 0.95);
  border: 1px solid rgba(250, 159, 252, 0.3);
  backdrop-filter: blur(10px);
}

:deep(.el-dropdown-menu__item) {
  color: var(--starlight);
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-dropdown-menu__item:hover) {
  background: rgba(250, 159, 252, 0.1);
  color: var(--cosmic-blue);
}

:deep(.el-dropdown-menu__item i) {
  margin-right: 5px;
}
</style> 