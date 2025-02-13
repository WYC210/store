<template>
  <section class="products">
    <div class="title-divider">
      <span class="divider-text magic-text">热销商品</span>
    </div>

    <!-- 添加流星效果 -->
    <div class="shooting-star"></div>

    <el-row v-loading="loading" :gutter="20">
      <el-col
        v-for="product in products"
        :key="product.productId"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <el-card
          class="product-card dream-card"
          :body-style="{ padding: '0px' }"
          @mouseenter="handleProductHover($event, product)"
          @mouseleave="handleProductLeave"
          @click="goToDetail(product.productId)"
        >
          <el-image :src="product.imageUrl" class="product-image" fit="cover">
            <template #error>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="description">{{ product.description }}</p>
            <p class="price">¥{{ product.price.toFixed(2) }}</p>
            <div class="rating">
              <el-rate
                v-model="product.rating"
                disabled
                show-score
                text-color="#ff9900"
              />
              <span class="review-count">({{ product.reviewCount }})</span>
            </div>
            <p class="stock">库存: {{ product.stock }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 悬浮卡片 -->
    <Teleport to="body">
      <Transition name="fade">
        <ProductHoverCard
          v-if="showHoverCard"
          :product="hoveredProduct"
          :style="[hoverCardStyle, { zIndex: 9999 }]"
          @mouseleave="handleProductLeave"
          class="product-hover-layer"
        />
      </Transition>
    </Teleport>

    <!-- 添加分页组件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="productParams.pageNum"
        v-model:page-size="productParams.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Picture, Warning } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useProducts } from "../composables/useProducts";
import { addToCart } from "@/api/product";
import { debounce as _debounce } from "lodash-es";
import ProductHoverCard from "./ProductHoverCard.vue";
import shoppingIcon from "@/assets/shopping.png";
import csImage from "@/assets/cs.png";
import { useRouter } from "vue-router";

const { products, loading, pagination, productParams, fetchProducts } =
  useProducts();

const router = useRouter();

// 悬浮卡片状态
const hoveredProduct = ref(null);
const showHoverCard = ref(false);
const hoverCardPosition = ref({ x: 0, y: 0 });

// 计算悬浮卡片样式
const hoverCardStyle = computed(() => {
  const { x, y } = hoverCardPosition.value;
  return {
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
  };
});

// 处理商品悬浮
const handleProductHover = _debounce((event, product) => {
  if (!event || !product) return;

  const cardElement = event.currentTarget;
  if (!cardElement) return;

  console.log("触发商品悬浮框:", {
    product: product.name,
    position: {
      x: event.clientX,
      y: event.clientY,
    },
    elementRect: cardElement.getBoundingClientRect(),
  });

  // 获取元素位置信息
  const rect = cardElement.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 计算悬浮窗的位置：卡片的中间位置
  let x = rect.left + rect.width / 2 - 250; // 悬浮窗宽度的一半(500/2)
  let y = rect.top - 420; // 悬浮窗高度(400) + 间距(20)

  // 确保不超出左边界
  if (x < 20) {
    x = 20;
  }

  // 确保不超出右边界
  if (x + 500 > windowWidth - 20) {
    x = windowWidth - 520; // 留出右边距
  }

  // 确保不超出顶部边界
  if (y < 20) {
    // 如果上方空间不够，就显示在卡片下方
    y = rect.bottom + 20;
  }

  // 确保不超出底部边界
  if (y + 400 > windowHeight - 20) {
    // 如果下方空间也不够，就显示在上方，但贴近顶部
    y = 20;
  }

  hoveredProduct.value = product;
  hoverCardPosition.value = { x, y };
  showHoverCard.value = true;
}, 100);

// 处理鼠标离开
const handleProductLeave = _debounce(() => {
  console.log("关闭商品悬浮框");
  showHoverCard.value = false;
  hoveredProduct.value = null;
}, 200);

// 添加到购物车
const handleAddToCart = async (product) => {
  try {
    await addToCart(product.id);
    ElMessage.success("添加成功");
  } catch (error) {
    ElMessage.error("添加失败");
  }
};

// 立即购买
const handleBuyNow = (product) => {
  // 实现购买逻辑
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  productParams.pageSize = size;
  productParams.pageNum = 1;
  fetchProducts();
};

// 处理页码变化
const handleCurrentChange = (page) => {
  productParams.pageNum = page;
  fetchProducts();
};

// 监听筛选参数变化
watch(
  () => ({ ...productParams }),
  () => {
    fetchProducts();
  },
  { deep: true }
);

// 组件挂载时获取数据
onMounted(() => {
  fetchProducts();
});

const goToDetail = (productId) => {
  if (!productId) {
    ElMessage.error('商品ID不存在')
    return
  }
  console.log('跳转到商品详情，ID:', productId)  // 添加日志
  router.push({
    name: 'ProductDetail',
    params: { id: productId }
  })
}

// 在获取商品列表数据时，确保每个商品都有 productId
watch(products, (newProducts) => {
  console.log('商品列表数据:', newProducts)
}, { deep: true })
</script>

<style scoped>
.products {
  position: relative;
  padding: 20px;
}

.title-divider {
  position: relative;
  text-align: center;
  margin: 20px 0 40px;
}

.divider-text {
  background: var(--deep-space);
  color: var(--starlight);
  padding: 0 20px;
  font-size: 1.5em;
  position: relative;
  z-index: 1;
}

.title-divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--accent-primary),
    transparent
  );
}

.product-card {
  margin-bottom: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 30px rgba(173, 216, 230, 0.2);
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-10px) perspective(1000px) rotateX(10deg);
  box-shadow: 0 0 50px rgba(255, 105, 180, 0.4);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
  color: var(--starlight);
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 1.2em;
  color: var(--starlight);
}

.description {
  color: var(--aurora-pink);
  font-size: 0.9em;
  margin: 10px 0;
}

.price {
  color: var(--cosmic-blue);
  font-size: 1.5em;
  margin: 10px 0;
  font-weight: 600;
}

.stock {
  color: var(--aurora-pink);
  font-size: 0.9em;
  margin: 10px 0;
}

.rating {
  margin-top: 10px;
  text-align: center;
}

.pagination-container {
  margin-top: 30px;
  text-align: center;
}

/* 分页样式 */
:deep(.el-pagination) {
  --el-pagination-bg-color: rgba(255, 255, 255, 0.05);
  --el-pagination-text-color: var(--starlight);
  --el-pagination-button-color: var(--starlight);
  --el-pagination-hover-color: var(--cosmic-blue);
}

/* 评分样式 */
:deep(.el-rate__icon) {
  color: var(--nebula-green) !important;
}

.review-count {
  color: var(--aurora-pink);
  margin-left: 8px;
}

/* 图片占位符样式 */
.image-placeholder,
.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(245, 247, 250, 0.1);
}

.image-placeholder .el-icon,
.image-error .el-icon {
  font-size: 24px;
  color: #909399;
}

.image-error .el-icon {
  color: #f56c6c;
}

/* 添加呼吸光球效果 */
.product-card::after {
  content: "";
  position: absolute;
  top: -25px;
  right: -25px;
  width: 50px;
  height: 50px;
  background: radial-gradient(
    circle,
    rgba(255, 218, 121, 0.8) 20%,
    rgba(255, 121, 218, 0.4) 60%,
    transparent 80%
  );
  animation: pulse 4s ease-in-out infinite;
  pointer-events: none;
}

/* 其他现有样式保持不变 */
</style>
