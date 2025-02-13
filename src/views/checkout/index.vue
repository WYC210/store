<template>
  <div class="checkout-container dream-card">
    <div class="page-header">
      <router-link to="/home" class="back-home">
        <el-button type="primary" class="home-btn">
          <el-icon><HomeFilled /></el-icon>
          返回主页
        </el-button>
      </router-link>
      <h1 class="cyber-text">结算</h1>
    </div>

    <div v-if="productDetails.length">
      <h2>您选择的商品:</h2>
      <ul class="product-list">
        <li v-for="product in productDetails" :key="product.cartItemId" class="product-item">
          {{ product.productName }} - 数量: {{ product.quantity }} - 价格: ¥{{ product.price }}
        </li>
      </ul>
      <div class="checkout-actions">
        <el-button type="primary" @click="confirmOrder" :loading="loading">
          确认支付
        </el-button>
        <router-link to="/cart">
          <el-button>返回购物车</el-button>
        </router-link>
      </div>
    </div>
    <div v-else>
      <el-empty description="没有选择商品"></el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProductDetail } from '@/api/product'
import { createOrder, payOrder } from '@/api/order'
import { ElMessage } from 'element-plus'
import { useCheckoutStore } from '@/stores/checkout'
import { generatePaymentId } from '@/utils/payment'

const router = useRouter()
const checkoutStore = useCheckoutStore()
const productDetails = ref([])
const loading = ref(false)

// 获取传递的商品信息
const checkoutItems = checkoutStore.checkoutItems
console.log('1. 结算页面接收到的商品信息:', checkoutItems)

const fetchProductDetails = async () => {
  if (!checkoutItems.length) {
    console.log('2. 没有收到商品信息')
    ElMessage.warning('没有选择要结算的商品')
    router.push('/cart')
    return
  }

  for (const item of checkoutItems) {
    console.log('3. 处理商品:', item)
    if (!item.productId) {
      console.error('无效的商品ID:', item)
      continue
    }
    try {
      const productResponse = await getProductDetail(item.productId)
      console.log('4. 获取到的商品详情:', productResponse)
      
      productDetails.value.push({
        ...productResponse,
        cartItemId: item.cartItemId,
        quantity: item.quantity,
        price: item.price
      })
    } catch (error) {
      console.error('获取产品详情失败:', error)
      ElMessage.error(`获取商品 ${item.productName} 的详情失败`)
    }
  }
  console.log('5. 最终的商品详情列表:', productDetails.value)
}

onMounted(() => {
  fetchProductDetails()
})

// 在组件卸载时清除结算信息
onUnmounted(() => {
  checkoutStore.clearCheckoutItems()
})

const confirmOrder = async () => {
  loading.value = true
  try {
    // 1. 创建订单
    const orderData = {
      items: productDetails.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    }
    
    const orderResponse = await createOrder(orderData)
    const { orderId, totalAmount } = orderResponse.data

    // 2. 跳转到支付页面
    router.push(`/payment/${orderId}/${totalAmount}`)
  } catch (error) {
    console.error('创建订单失败:', error)
    ElMessage.error('创建订单失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-container {
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

.product-list {
  list-style: none;
  padding: 0;
}

.product-item {
  padding: 15px;
  margin: 10px 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: var(--starlight);
}

.checkout-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: flex-end;
}
</style> 