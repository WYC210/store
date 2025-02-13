<template>
  <div class="cart-container dream-card">
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
        已选择 <span class="highlight">{{ selectedCount }}</span> 件商品
        总计: <span class="price">¥{{ totalPrice.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 购物车列表 -->
    <div class="cart-list" v-loading="loading">
      <template v-if="cartItems.length">
        <div class="cart-item dream-card" v-for="item in cartItems" :key="item.id">
          <el-checkbox v-model="item.selected" @change="updateSelection"/>
          
          <div class="item-image">
            <el-image 
              v-if="item.product"
              :src="item.product.imageUrl" 
              fit="cover"
              :preview-src-list="[item.product.imageUrl]"
            >
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div v-else class="image-placeholder">
              <el-icon><Picture /></el-icon>
            </div>
          </div>

          <div class="item-info">
            <h3 class="item-name">{{ item.product ? item.product.name : '未知商品' }}</h3>
            <p class="item-price">¥{{ item.product ? item.product.price : '0.00' }}</p>
          </div>

          <div class="item-quantity">
            <el-input-number 
              v-model="item.quantity" 
              :min="1" 
              :max="item.product ? item.product.stock : 1"
              @change="updateQuantity(item)"
            />
          </div>

          <div class="item-total">
            <p class="total-price">¥{{ (item.product ? item.product.price : 0) * item.quantity }}</p>
          </div>

          <div class="item-actions">
            <el-button 
              type="danger" 
              circle
              @click="removeItem(item.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </template>

      <div v-else class="empty-cart">
        <el-empty description="购物车是空的">
          <template #image>
            <el-icon class="empty-icon"><ShoppingCart /></el-icon>
          </template>
          <template #description>
            <p>您的购物车还是空的，快去选购心仪的商品吧！</p>
          </template>
          <router-link to="/home">
            <el-button type="primary">去购物</el-button>
          </router-link>
        </el-empty>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="cart-footer" v-if="cartItems.length">
      <div class="select-all">
        <el-checkbox 
          v-model="isAllSelected"
          @change="toggleSelectAll"
        >
          全选
        </el-checkbox>
      </div>
      
      <div class="checkout-info">
        <div class="total-section">
          <span>总计:</span>
          <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <el-button 
          type="primary" 
          :disabled="!selectedCount"
          @click="handleCheckout"
          class="checkout-btn hologram-btn"
        >
          结算 ({{ selectedCount }})
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { getProductDetail } from '@/api/product'  // 导入获取产品详情的 API
import { useCheckoutStore } from '@/stores/checkout'  // 添加导入

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const loading = ref(false)

// 获取购物车数据
const fetchCartData = async () => {
  loading.value = true
  try {
    await cartStore.fetchCartItems()
    await fetchProductDetails()  // 获取产品详情
  } catch (error) {
    ElMessage.error('获取购物车数据失败')
  } finally {
    loading.value = false
  }
}

// 获取产品详情
const fetchProductDetails = async () => {
  for (const item of cartStore.cartItems) {
    try {
      const productResponse = await getProductDetail(item.productId)
      item.product = productResponse  // 将完整的产品信息添加到购物车项中
    } catch (error) {
      console.error('获取产品详情失败:', error)
      ElMessage.error('获取产品详情失败')
    }
  }
}

// 计算属性
const cartItems = computed(() => cartStore.cartItems)
const selectedCount = computed(() => cartItems.value.filter(item => item.selected).length)
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    if (item.selected && item.product) {
      return total + (item.product.price * item.quantity)
    }
    return total
  }, 0)
})

const isAllSelected = computed({
  get: () => cartItems.value.length && cartItems.value.every(item => item.selected),
  set: (value) => toggleSelectAll(value)
})

// 方法
const updateQuantity = async (item) => {
  try {
    await cartStore.updateCartItem({
      id: item.id,
      quantity: item.quantity
    })
  } catch (error) {
    ElMessage.error('更新数量失败')
  }
}

const removeItem = async (itemId) => {
  try {
    await ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
      type: 'warning'
    })
    await cartStore.removeCartItem(itemId)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const toggleSelectAll = (value) => {
  cartItems.value.forEach(item => {
    item.selected = value
  })
}

const updateSelection = () => {
  cartStore.updateSelection(cartItems.value)
}

const handleCheckout = () => {
  const selectedItems = cartItems.value.filter(item => item.selected)
  console.log('1. 选中的商品:', selectedItems)
  
  if (!selectedItems.length) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  
  // 构建结算商品信息
  const itemsToCheckout = selectedItems.map(item => {
    console.log('2. 处理商品:', item)
    return {
      cartItemId: item.cartItemId,
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity
    }
  })

  console.log('3. 准备发送到结算页面的商品信息:', itemsToCheckout)

  if (!itemsToCheckout.length) {
    ElMessage.warning('选择的商品中有无效的商品ID')
    return
  }

  // 使用 store 保存结算信息
  const checkoutStore = useCheckoutStore()
  checkoutStore.setCheckoutItems(itemsToCheckout)

  // 跳转到结算页面
  router.push({
    name: 'Checkout'
  })
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push({
      path: '/login',
      query: { redirect: '/cart' }
    })
    return
  }
  fetchCartData()
})
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 80px auto 20px;
  padding: 20px;
  background: rgba(6, 5, 36, 0.95);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(250, 159, 252, 0.2);
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
  grid-template-columns: auto 100px 1fr auto auto auto;
  gap: 20px;
  align-items: center;
  padding: 20px;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.3s;
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(250, 159, 252, 0.3);
}

.item-image {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
}

.item-image :deep(.el-image) {
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
}

.item-image :deep(.el-image:hover) {
  transform: scale(1.05);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-name {
  color: var(--starlight);
  margin: 0;
}

.item-price {
  color: var(--aurora-pink);
  font-weight: bold;
}

.item-quantity {
  display: flex;
  align-items: center;
}

.item-total {
  color: var(--aurora-pink);
  font-weight: bold;
  font-size: 18px;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-top: 20px;
  border-top: 1px solid rgba(250, 159, 252, 0.3);
}

.checkout-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-section {
  color: var(--starlight);
  font-size: 18px;
}

.checkout-btn {
  min-width: 150px;
  background: linear-gradient(45deg, var(--aurora-pink), var(--cosmic-blue));
  border: none;
  font-weight: bold;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(250, 159, 252, 0.3);
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

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: var(--starlight);
  font-size: 24px;
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