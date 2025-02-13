<template>
  <div class="orders-container dream-card">
    <div class="page-header">
      <router-link to="/home" class="back-home">
        <el-button type="primary" class="home-btn">
          <el-icon><HomeFilled /></el-icon>
          返回主页
        </el-button>
      </router-link>
      <h1 class="cyber-text">我的订单</h1>
    </div>

    <div class="orders-list" v-loading="loading">
      <!-- 订单列表内容 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrderList } from '@/api/order'

const router = useRouter()
const loading = ref(false)
const orders = ref([])

const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await getOrderList()
    orders.value = response.data
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-container {
  max-width: 1200px;
  margin: 80px auto 20px;
  padding: 20px;
  background: rgba(6, 5, 36, 0.95);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(250, 159, 252, 0.2);
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(250, 159, 252, 0.3);
}

.back-home {
  margin-right: 20px;
}

.home-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style> 