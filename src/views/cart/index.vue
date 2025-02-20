<template>
  <div class="cart-container">
    <div class="page-header">
      <router-link to="/home" class="back-home">
        <el-button type="primary" class="home-btn">
          <el-icon><HomeFilled /></el-icon>
          返回主页
        </el-button>
      </router-link>
      <h1 class="cyber-text">我的购物车</h1>
    </div>

    <div class="cart-header">
      <div class="cart-summary">
        已选择 {{ selectedCount }} 件商品
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>

    <div v-else-if="cartItems.length === 0" class="empty-cart">
      <el-empty description="购物车是空的" />
    </div>

    <div v-else class="cart-list">
      <div class="cart-list-header">
        <el-checkbox 
          v-model="isAllSelected"
          @change="handleSelectAll"
        >
          全选
        </el-checkbox>
        <span>商品信息</span>
        <span>单价</span>
        <span>数量</span>
        <span>小计</span>
        <span>操作</span>
      </div>

      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <el-checkbox v-model="item.selected" />
        
        <div class="product-info">
          <img :src="item.imageUrl" :alt="item.name" class="product-image" />
          <span class="product-name">{{ item.name }}</span>
        </div>

        <div class="product-price">
          ¥{{ item.price }}
        </div>

        <div class="quantity-control">
          <el-input-number 
            v-model="item.quantity"
            :min="1"
            :max="99"
            size="small"
            @change="(val) => handleQuantityChange(item.id, val)"
          />
        </div>

        <div class="subtotal">
          ¥{{ item.price * item.quantity }}
        </div>

        <div class="operations">
          <el-button 
            type="danger" 
            size="small"
            @click="handleDelete(item.id)"
          >
            删除
          </el-button>
        </div>
      </div>

      <div class="cart-footer">
        <div class="selected-info">
          已选择 {{ selectedCount }} 件商品
        </div>
        <div class="total-price">
          总计: ¥{{ totalPrice }}
        </div>
        <el-button 
          type="primary" 
          :loading="loading"
          :disabled="selectedCount === 0"
          @click="handleCheckout"
        >
          {{ loading ? '处理中...' : '结算' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { HomeFilled, Picture } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const loading = ref(false)
const errorImage = require('@/assets/cs.png')

// 获取购物车数据
const cartItems = computed(() => cartStore.cartItems)
const totalPrice = computed(() => cartStore.totalPrice)
const selectedCount = computed(() => cartStore.selectedItems.length)

// 全选状态
const isAllSelected = computed({
  get: () => cartItems.value.length > 0 && cartItems.value.every(item => item.selected),
  set: (val) => handleSelectAll(val)
})

// 获取购物车数据
const fetchCartData = async () => {
  loading.value = true
  try {
    await cartStore.fetchCartItems()
  } catch (error) {
    console.error('获取购物车数据失败:', error)
    ElMessage.error('获取购物车数据失败')
  } finally {
    loading.value = false
  }
}

// 全选/取消全选
const handleSelectAll = (val) => {
  cartItems.value.forEach(item => {
    item.selected = val
  })
}

// 更新商品数量
const handleQuantityChange = async (id, quantity) => {
  try {
    await cartStore.updateCartItem(id, quantity)
    ElMessage.success('更新数量成功')
  } catch (error) {
    ElMessage.error('更新数量失败')
  }
}

// 删除商品
const handleDelete = async (id) => {
  try {
    await cartStore.deleteCartItem(id)
    ElMessage.success('删除成功')
    await fetchCartData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 结算
const handleCheckout = async () => {
  try {
    if (selectedCount.value === 0) {
      ElMessage.warning('请选择要结算的商品')
      return
    }
    
    loading.value = true
    ElMessage.info('正在处理结算请求...')
    
    // 调用结算方法，会自动跳转到支付页面
    await cartStore.prepareCheckout()
  } catch (error) {
    ElMessage.error(error.message || '结算失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取购物车数据
onMounted(() => {
  if (userStore.isLoggedIn) {
    fetchCartData()
  } else {
    ElMessage.warning('请先登录')
    router.push('/login')
  }
})
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 80px auto 20px;
  padding: 20px;
  background: rgba(6, 5, 36, 0.95);
  border-radius: 15px;
  border: 1px solid rgba(250, 159, 252, 0.3);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(250, 159, 252, 0.3);
}

.cyber-text {
  color: var(--cosmic-blue);
  font-size: 24px;
  text-shadow: 0 0 10px rgba(36, 208, 254, 0.5);
}

.cart-summary {
  color: var(--starlight);
}

.highlight {
  color: var(--cosmic-blue);
  font-weight: bold;
}

.price {
  color: var(--aurora-pink);
  font-size: 18px;
  font-weight: bold;
}

.cart-item {
  display: grid;
  grid-template-columns: 50px 2fr 1fr 1fr 1fr 1fr;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cart-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-name {
  color: var(--starlight);
}

.cart-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(250, 159, 252, 0.3);
}

.total-price {
  color: var(--cosmic-blue);
  font-size: 1.2em;
  font-weight: bold;
}

.empty-cart {
  text-align: center;
  padding: 40px;
}

.empty-icon {
  font-size: 64px;
  color: var(--cosmic-blue);
}

/* 自定义 Element Plus 组件样式 */
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--cosmic-blue);
  border-color: var(--cosmic-blue);
}

:deep(.el-input-number) {
  background: transparent;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background-color: transparent;
  border-color: rgba(250, 159, 252, 0.3);
  color: var(--starlight);
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  color: var(--cosmic-blue);
}

:deep(.el-input__inner) {
  background: transparent;
  color: var(--starlight);
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

.loading-container {
  text-align: center;
  padding: 40px;
}

.cart-list-header {
  display: grid;
  grid-template-columns: 50px 2fr 1fr 1fr 1fr 1fr;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 10px;
  color: var(--starlight);
}

.selected-info {
  color: var(--starlight);
}

.operations {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.product-price,
.subtotal {
  color: var(--starlight);
}

/* 自定义 Element Plus 组件样式 */
:deep(.el-checkbox__label) {
  color: var(--starlight) !important;
}

:deep(.el-button) {
  background: transparent;
  border: 1px solid rgba(250, 159, 252, 0.3);
  color: var(--starlight);
}

:deep(.el-button:hover) {
  background: rgba(250, 159, 252, 0.1);
  color: var(--cosmic-blue);
}

:deep(.el-input-number) {
  background: transparent;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background: transparent !important;
  border-color: rgba(250, 159, 252, 0.3) !important;
  color: var(--starlight) !important;
}

:deep(.el-input__inner) {
  background: transparent !important;
  color: var(--starlight) !important;
}
</style>


