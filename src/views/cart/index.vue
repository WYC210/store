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
        已选择 <span class="highlight">{{ selectedCount }}</span> 件商品 总计:
        <span class="price">¥{{ totalPrice.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 购物车列表 -->
    <div class="cart-list" v-loading="loading">
      <template v-if="cartStore.cartItems.length">
        <div class="cart-item" v-for="item in cartStore.cartItems" :key="item.cartItemId">
          <el-checkbox v-model="item.selected" @change="updateSelection" />

          <div class="item-image">
            <el-image
              :src="getImageUrl(item.imageUrl || item.product.imageUrl)"
              fit="cover"
              class="product-image"
            >
              <template #error>
                <div class="image-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>

          <div class="item-info">
            <h3 class="item-name">{{ item.productName }}</h3>
            <p class="item-price">¥{{ item.price.toFixed(2) }}</p>
            <p>数量: {{ item.quantity }}</p>
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
            <p class="total-price">
              ¥{{ (item.price * item.quantity).toFixed(2) }}
            </p>
          </div>

          <div class="item-actions">
            <el-button
              type="danger"
              circle
              @click="removeItem(item.cartItemId)"
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
    <div class="cart-footer" v-if="cartStore.cartItems.length">
      <div class="select-all">
        <el-checkbox v-model="isAllSelected" @change="toggleSelectAll">
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useCartStore } from "@/stores/cart";
import { useUserStore } from "@/stores/user";
import { getProductDetail } from "@/api/product";
import { createOrder } from "@/api/order";
import cartApi from "@/api/cart";
import { useOrderStore } from "@/stores/order";
import { useCheckoutStore } from "@/stores/checkout";

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
const orderStore = useOrderStore();
const checkoutStore = useCheckoutStore();
const loading = ref(false);

const fetchCartData = async () => {
  try {
    const cartItems = await cartApi.getCartItems();
    console.log("购物车商品列表:", cartItems);

    // 验证购物车数据格式
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("购物车数据格式错误");
    }

    // 进一步验证每个购物车项的结构
    cartItems.forEach(item => {
      if (!item.cartItemId || !item.productId || !item.quantity) {
        throw new Error("购物车项格式错误");
      }
    });

    // 处理购物车数据
    cartStore.setCartItems(cartItems);
  } catch (error) {
    console.error("获取购物车数据失败:", error);
    ElMessage.error(error.message || "获取购物车数据失败");
  }
};

// 获取产品详情
const fetchProductDetails = async () => {
  try {
    for (const item of cartStore.cartItems) {
      if (item.productId) {
        // 确保有 productId
        const productResponse = await getProductDetail(item.productId);
        if (productResponse.state === 200) {
          item.product = productResponse.data;
        } else {
          console.error("获取产品详情失败:", productResponse);
        }
      }
    }
  } catch (error) {
    console.error("获取产品详情失败:", error);
    ElMessage.error("获取产品详情失败");
  }
};

// 计算属性
const selectedCount = computed(
  () => cartStore.cartItems.filter((item) => item.selected).length
);
const totalPrice = computed(() => {
  return cartStore.cartItems.reduce((total, item) => {
    if (item.selected) {
      return total + (item.price * item.quantity);
    }
    return total;
  }, 0);
});

const isAllSelected = computed({
  get: () =>
    cartStore.cartItems.length && cartStore.cartItems.every((item) => item.selected),
  set: (value) => toggleSelectAll(value),
});

// 方法
const updateQuantity = async (item) => {
  try {
    await cartStore.updateCartItem({
      id: item.cartItemId,
      quantity: item.quantity,
    });
  } catch (error) {
    ElMessage.error("更新数量失败");
  }
};

const removeItem = async (itemId) => {
  try {
    await ElMessageBox.confirm("确定要删除这个商品吗？", "提示", {
      type: "warning",
    });

    console.log("准备删除购物车商品，ID:", itemId);

    // 发送删除请求
    await cartApi.deleteCartItem(itemId);
    ElMessage.success("删除成功");
    // 重新获取购物车数据
    await fetchCartData();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除购物车商品失败:", error);
      ElMessage.error("删除失败，请重试");
    }
  }
};

const toggleSelectAll = (value) => {
  cartStore.cartItems.forEach((item) => {
    item.selected = value;
  });
};

const updateSelection = () => {
  cartStore.updateSelection(cartStore.cartItems);
};

const handleCheckout = async () => {
  const selectedItems = cartStore.cartItems.filter((item) => item.selected);
  if (!selectedItems.length) {
    ElMessage.warning("请至少选择一件商品进行结算");
    return;
  }

  try {
    const orderData = {
      items: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        productName: item.productName,
        imageUrl: item.imageUrl,
      })),
    };

    console.log("发送结算请求，请求数据:", orderData);
    const response = await cartApi.purchase(orderData);
    console.log("结算响应:", response);

    if (response.state === 200) {
      const { orderId, totalAmount } = response.data;
      orderStore.currentOrder = {
        orderId,
        totalAmount,
        items: orderData.items,
      };

      checkoutStore.setCheckoutItems(selectedItems);
      router.push(`/payment/${orderId}/${totalAmount}`);
    }
  } catch (error) {
    console.error("结算失败:", error);
    ElMessage.error("结算失败，请重试");
  }
};

// 添加处理图片 URL 的方法
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  // 如果已经是完整的 URL，则直接返回
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }
  // 否则，添加后端基础 URL
  return `http://localhost:8088/${imageUrl}`;
};

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push({
      path: "/login",
      query: { redirect: "/cart" },
    });
    return;
  }
  fetchCartData();
});
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 80px auto 20px;
  padding: 20px;
  background: rgba(6, 5, 36, 0.95);
  border-radius: 15px;
  border: 1px solid rgba(250, 159, 252, 0.3);
  transform: none !important;
  transition: none !important;
  box-shadow: none !important;
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
  border: 1px solid rgba(250, 159, 252, 0.3);
  transform: none !important;
  transition: none !important;
  box-shadow: none !important;
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
