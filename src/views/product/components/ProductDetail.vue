<template>
  <div class="product-detail" v-if="product">
    <!-- 商品图片展示区 -->
    <div class="product-gallery">
      <el-image
        v-if="product.images && product.images.length"
        :src="product.images[0]"
        fit="contain"
        class="product-main-image"
        :preview-src-list="product.images"
        @error="handleImageError"
      >
        <template #error>
          <div class="image-placeholder">
            <el-image
              :src="errorImage"
              fit="contain"
            />
          </div>
        </template>
      </el-image>
    </div>

    <!-- 商品信息区 -->
    <div class="product-info">
      <h1 class="product-title magic-text">{{ product.name }}</h1>
      <div class="price-box">
        <span class="current-price">¥{{ product.price?.toFixed(2) }}</span>
      </div>

      <!-- 商品评分 -->
      <div class="rating-box">
        <el-rate
          :model-value="productRating"
          disabled
          show-score
        />
        <span class="review-count">({{ product.reviewCount || 0 }}条评价)</span>
      </div>

      <!-- 商品标签 -->
      <div class="tags-section" v-if="product.tags">
        <el-tag v-for="tag in productTags" :key="tag" class="product-tag">
          {{ tag }}
        </el-tag>
      </div>

      <!-- 数量选择 -->
      <div class="quantity-section">
        <h3>购买数量</h3>
        <el-input-number
          v-model="quantity"
          :min="1"
          :max="maxQuantity"
          class="quantity-input"
          :disabled="!product.stock"
        />
        <span class="stock-info" :class="{ 'out-of-stock': !product.stock }">
          {{ product.stock ? `库存: ${product.stock}件` : "暂时无货" }}
        </span>
      </div>

      <!-- 按钮区域 -->
      <div class="action-buttons">
        <el-button
          class="add-to-cart-btn hologram-btn glow-effect"
          @click="handleAddToCart"
        >
          <el-icon><ShoppingCart /></el-icon>
          加入购物车
        </el-button>
        <el-button
          type="primary"
          class="buy-now-btn hologram-btn glow-effect"
          @click="handleBuyNow"
        >
          立即购买
        </el-button>
      </div>

      <!-- 商品详情 -->
      <div class="product-details">
        <h2>商品详情</h2>
        <div class="detail-content">
          <div class="parameters">
            <h3>规格参数</h3>
            <ul>
              <li>
                <span class="param-name">品牌:</span>
                <span class="param-value">{{ product.brand }}</span>
              </li>
              <li>
                <span class="param-name">分类:</span>
                <span class="param-value">{{ categoryName }}</span>
              </li>
            </ul>
          </div>
          <div class="description" v-html="product.description"></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading-placeholder">
    <el-skeleton :rows="3" animated />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ShoppingCart, Picture } from "@element-plus/icons-vue";
import { getProductDetail, addToCart } from "@/api/product";
import { createOrder } from "@/api/order";
import { useUserStore } from "@/stores/user";
import { useOrderStore } from "@/stores/order";
import { useCategoryStore } from "@/stores/category";

const route = useRoute();
const router = useRouter();
const productId = route.params.id;
const userStore = useUserStore();
const orderStore = useOrderStore();
const categoryStore = useCategoryStore();

console.log("获取到的商品ID:", productId);

// 商品数据
const product = ref(null);
const errorImage = require('@/assets/cs.png'); // 引入备用图片

// 使用计算属性来处理评分
const productRating = computed(() => {
  return product.value?.rating || 0;
});

// 计算商品标签
const productTags = computed(() => {
  return product.value?.tags ? product.value.tags.split(",") : [];
});

// 获取分类名称
const categoryName = computed(() => {
  if (!product.value?.categoryId) return "";
  const category = categoryStore.getCategoryById(product.value.categoryId);
  return category?.name || "";
});

// 计算最大可购买数量
const maxQuantity = computed(() => {
  return Math.max(product.value?.stock || 0, 1);
});

// 选中的数量
const quantity = ref(1);

// 监听库存变化，调整购买数量
watch(
  () => product.value?.stock,
  (newStock) => {
    if (newStock < quantity.value) {
      quantity.value = Math.max(Math.min(newStock, 1), 1);
    }
  }
);

// 添加数据加载状态
const loading = ref(false);

// 获取商品详情
const fetchProductDetail = async () => {
  loading.value = true;
  try {
    console.log("正在获取商品详情，ID:", productId);
    if (!productId) {
      throw new Error("商品ID不存在");
    }
    const response = await getProductDetail(productId);
    console.log("商品详情响应:", response);

    if (response) {
      // 合并 product 和 images 数据
      product.value = {
        ...response.data.product,
        images: response.data.images.map(image => {
          // 修复重复的基础URL问题
          return image.replace(/^http:\/\/localhost:8088\/products\/images\/http:\/\/localhost:8088\/products\/images\//, 'http://localhost:8088/products/images/');
        })
      };

      console.log("商品数据已更新:", product.value);
    } else {
      throw new Error("获取商品详情失败");
    }
  } catch (error) {
    console.error("获取商品详情失败:", error);
    ElMessage.error(error.message || "获取商品详情失败");
  } finally {
    loading.value = false;
  }
};

// 加入购物车
const handleAddToCart = async () => {
  try {
    // 检查登录状态
    if (!userStore.isLoggedIn) {
      ElMessage.warning("请先登录");
      router.push({
        path: "/login",
        query: { redirect: route.fullPath },
      });
      return;
    }

    if (!product.value?.stock) {
      ElMessage.warning("商品暂时无货");
      return;
    }

    const cartData = {
      productId: productId,
      quantity: quantity.value,
    };

    await addToCart(cartData);
    ElMessage.success("已添加到购物车");
  } catch (error) {
    console.error("添加到购物车失败:", error);
    ElMessage.error("添加失败，请重试");
  }
};

// 立即购买
const handleBuyNow = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  try {
    // 1. 创建订单
    const orderData = {
      items: [{
        productId: productId,
        quantity: quantity.value,
        price: product.value?.price
      }]
    }
    
    const orderResponse = await createOrder(orderData)
    const { orderId, totalAmount } = orderResponse.data

    // 2. 跳转到支付页面
    router.push(`/payment/${orderId}/${totalAmount}`)
  } catch (error) {
    console.error('创建订单失败:', error)
    ElMessage.error('创建订单失败，请重试')
  }
};

// 处理图片加载错误
const handleImageError = () => {
  if (product.value && product.value.images) {
    product.value.images = [errorImage];
  }
};

onMounted(() => {
  console.log("商品详情页面加载，ID:", productId);
  fetchProductDetail();
});
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 20px auto;
  padding: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.product-gallery {
  border-radius: 15px;
  overflow: hidden;
}

.product-title {
  font-size: 2em;
  margin-bottom: 20px;
}

.price-box {
  margin: 20px 0;
}

.current-price {
  font-size: 2em;
  color: var(--aurora-pink);
  font-weight: bold;
}

.original-price {
  font-size: 1.2em;
  color: var(--text-secondary);
  text-decoration: line-through;
  margin-left: 10px;
}

.rating-box {
  margin: 15px 0;
}

.review-count {
  color: var(--text-secondary);
  margin-left: 10px;
}

.specs-section,
.quantity-section {
  margin: 20px 0;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.spec-group {
  margin: 15px 0;
}

.spec-title {
  color: var(--starlight);
  margin-bottom: 10px;
}

.spec-values {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.quantity-input {
  margin-right: 15px;
}

.stock-info {
  color: var(--text-secondary);
  transition: color 0.3s;
}

.stock-info.out-of-stock {
  color: var(--aurora-pink);
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin: 30px 0;
}

.add-to-cart-btn,
.buy-now-btn {
  flex: 1;
  height: 50px;
  font-size: 1.2em;
}

.product-details {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.parameters {
  margin: 20px 0;
}

.parameters ul {
  list-style: none;
  padding: 0;
}

.parameters li {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.param-name {
  color: var(--text-secondary);
  width: 100px;
}

.param-value {
  color: var(--text-primary);
  flex: 1;
}

/* 全息按钮样式增强 */
.hologram-btn {
  background: linear-gradient(
    45deg,
    rgba(255, 0, 255, 0.8),
    rgba(0, 255, 255, 0.8)
  );
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5),
    inset 0 0 15px rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  transition: all 0.3s;
}

.hologram-btn:hover {
  filter: hue-rotate(90deg);
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
}

/* 添加一些动画效果 */
.action-buttons .hologram-btn {
  position: relative;
  overflow: hidden;
}

.action-buttons .hologram-btn::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: rotate(45deg);
  animation: buttonShine 2s infinite;
}

@keyframes buttonShine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

/* 添加点击反馈 */
.action-buttons .hologram-btn:active {
  transform: scale(0.98);
}

/* 添加新样式 */
.product-main-image {
  width: 100%;
  height: 400px;
  border-radius: 15px;
}

.tags-section {
  margin: 15px 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.product-tag {
  background: rgba(255, 97, 210, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--starlight);
}

.loading-placeholder {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
}
</style>
