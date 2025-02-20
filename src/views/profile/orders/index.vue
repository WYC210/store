<template>
  <div class="orders-container">
    <div class="page-header">
      <router-link to="/home" class="back-home">
        <el-button type="primary" class="home-btn">
          <el-icon><HomeFilled /></el-icon>
          返回主页
        </el-button>
      </router-link>
      <h1 class="cyber-text">我的订单</h1>
    </div>

    <div class="order-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="全部订单" name="all">
          <OrderList :orders="filteredOrders" />
        </el-tab-pane>
        <el-tab-pane label="待支付" name="unpaid">
          <OrderList :orders="filteredOrders" />
        </el-tab-pane>
        <el-tab-pane label="已支付" name="paid">
          <OrderList :orders="filteredOrders" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { HomeFilled } from '@element-plus/icons-vue'
import { useOrderStore } from '@/stores/order'
import OrderList from './components/OrderList.vue'

const router = useRouter()
const orderStore = useOrderStore()
const activeTab = ref('all')
const loading = ref(false)

// 移除 orders ref，直接使用 store 中的数据
const orders = computed(() => orderStore.orderList)

// 简化计算属性，直接使用 computed orders
const filteredOrders = computed(() => {
  console.log('过滤订单，当前标签:', activeTab.value, '订单数量:', orders.value.length)
  
  switch (activeTab.value) {
    case 'unpaid':
      return orders.value.filter(order => order.status === 'PENDING_PAY')
    case 'paid':
      return orders.value.filter(order => order.status === 'PAID')
    default:
      return orders.value
  }
})

// 简化获取订单列表的方法
const fetchOrders = async () => {
  loading.value = true
  try {
    await orderStore.fetchOrderList()
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const handleTabClick = () => {
  // 可以在这里添加额外的处理逻辑
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 15px;
  background: rgba(6, 5, 36, 0.95);
  border-radius: 15px;
  border: 1px solid rgba(250, 159, 252, 0.3);
  transform: none !important;
  transition: none !important;
  box-shadow: none !important;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(250, 159, 252, 0.3);
}

.home-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 15px;
}

.cyber-text {
  color: var(--cosmic-blue);
  font-size: 20px;
  text-shadow: 0 0 10px rgba(36, 208, 254, 0.5);
}

:deep(.el-tabs__item) {
  color: var(--starlight);
  padding: 0 15px;
}

:deep(.el-tabs__item.is-active) {
  color: var(--cosmic-blue);
}

:deep(.el-tabs__active-bar) {
  background-color: var(--cosmic-blue);
}

:deep(.el-tabs__content) {
  padding-top: 10px;
}

.order-tabs {
  margin-top: 10px;
}
</style> 