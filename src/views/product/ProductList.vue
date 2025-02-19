<template>
  <section class="products">
    <ProductFilter @filter-change="handleFilterChange" />
    <ProductSorter 
      :products="products"
      :current-view="viewMode"
      @sort-change="handleSortChange"
      @view-change="handleViewChange"
    />
    <Sidebar />

    <div class="title-divider">
      <span class="divider-text magic-text">热销商品</span>
    </div>

    <!-- 网格视图 -->
    <el-row v-if="viewMode === 'grid'" v-loading="loading" :gutter="20">
      <el-col
        v-for="product in displayProducts"
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
          <el-image
            :src="product.imageUrl"
            class="product-image"
            fit="cover"
            @error="handleImageError(product)"
          >
            <template #error>
              <el-image :src="errorImage" fit="cover" />
            </template>
          </el-image>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="description">{{ product.description }}</p>
            <p class="price">¥{{ product.price }}</p>
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

    <!-- 列表视图 -->
    <div v-else-if="viewMode === 'list'" v-loading="loading" class="list-view">
      <el-card
        v-for="product in displayProducts"
        :key="product.productId"
        class="product-list-item dream-card"
        @mouseenter="handleProductHover($event, product)"
        @mouseleave="handleProductLeave"
        @click="goToDetail(product.productId)"
      >
        <div class="product-list-content">
          <el-image
            :src="product.imageUrl"
            class="product-list-image"
            fit="cover"
            @error="handleImageError(product)"
          >
            <template #error>
              <el-image :src="errorImage" fit="cover" />
            </template>
          </el-image>
          <div class="product-list-info">
            <h3>{{ product.name }}</h3>
            <p class="description">{{ product.description }}</p>
            <div class="product-list-details">
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
              <p class="price">¥{{ product.price }}</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>

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

    <!-- 添加错误提示 -->
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      closable
      @close="error = null"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { Picture, Warning } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useProducts } from "../composables/useProducts";
import ProductHoverCard from "./ProductHoverCard.vue";
import { useRouter } from "vue-router";
import { useProductSort } from './composables/useProductSort'
import { useProductFilter } from './composables/useProductFilter'
import ProductSorter from './components/ProductSorter.vue'
import ProductFilter from './components/ProductFilter.vue'
import Sidebar from './components/Sidebar.vue'

const { 
  products, 
  loading, 
  pagination, 
  productParams, 
  fetchProducts,
  handlePageChange: onPageChange,
  handleSizeChange: onSizeChange
} = useProducts();
const router = useRouter();
const errorImage = require('@/assets/cs.png'); // 引入备用图片
const { 
  sortParams, 
  updateSort, 
  applySorting,
  sortOptions 
} = useProductSort()
const { filterParams, updateFilter, applyFilter } = useProductFilter()

// 悬浮卡片状态
const hoveredProduct = ref(null);
const showHoverCard = ref(false);
const hoverCardPosition = ref({ x: 0, y: 0 });

// 添加错误状态
const error = ref(null)

// 视图模式状态
const viewMode = ref('grid')
const currentSortType = ref('default')

// 计算排序和筛选后的商品列表
const sortedProducts = computed(() => {
  console.log('开始计算排序后的商品列表')
  console.log('当前排序参数:', currentSortType.value)
  console.log('原始商品列表:', products.value)

  if (!products.value || !products.value.length) {
    return []
  }

  // 创建商品列表的副本进行排序
  const productsToSort = [...products.value].map(product => ({
    ...product,
    price: Number(product.price),
    rating: Number(product.rating),
    reviewCount: Number(product.reviewCount),
    stock: Number(product.stock),
    createdTime: product.createdTime || new Date().toISOString()
  }));

  // 根据当前排序条件进行排序
  switch (currentSortType.value) {
    case 'newest':
      console.log('按最新排序')
      return productsToSort.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
    case 'rating':
      console.log('按评分排序')
      return productsToSort.sort((a, b) => b.rating - a.rating)
    case 'sales':
      console.log('按销量排序')
      return productsToSort.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'priceAsc':
      console.log('按价格升序排序')
      return productsToSort.sort((a, b) => a.price - b.price)
    case 'priceDesc':
      console.log('按价格降序排序')
      return productsToSort.sort((a, b) => b.price - a.price)
    default:
      console.log('默认排序')
      return productsToSort
  }
})

// 处理排序变化
const handleSortChange = (criteria) => {
  console.log('ProductList: 收到排序变化 ->', criteria)
  currentSortType.value = criteria
}

// 处理筛选变化
const handleFilterChange = (filters) => {
  console.log('筛选条件变化:', filters)
  updateFilter(filters)
}

// 处理视图模式变化
const handleViewChange = (mode) => {
  console.log('视图模式变化:', mode)
  viewMode.value = mode
}

// 组件挂载时获取数据
onMounted(async () => {
  console.log('商品列表组件挂载')
  try {
    await fetchProducts()
    console.log('商品数据获取完成:', products.value)
  } catch (err) {
    error.value = err.message
    console.error('获取商品数据失败:', err)
  }
})

// 监听筛选和排序参数变化
watch([sortParams, filterParams], () => {
  console.log('排序或筛选条件发生变化')
  console.log('当前排序参数:', sortParams)
  console.log('当前筛选参数:', filterParams)
})

// 监听排序参数变化
watch(sortParams, (newParams) => {
  console.log('排序参数发生变化:', newParams)
  // 删除这里的 fetchProducts 调用，只依赖 computed 属性进行排序
  // fetchProducts().then(() => {
  //   console.log('商品列表已更新')
  // })
}, { deep: true })

// 监听筛选参数变化
watch(filterParams, () => {
  console.log('筛选参数发生变化，重新获取数据')
  fetchProducts()
}, { deep: true })

// 监听分页参数变化
watch(
  () => ({
    pageNum: productParams.pageNum,
    pageSize: productParams.pageSize
  }),
  () => {
    console.log('分页参数发生变化，重新获取数据')
    fetchProducts()
  },
  { deep: true }
)

// 监听搜索关键词变化
watch(
  () => productParams.keyword,
  () => {
    console.log('搜索关键词发生变化，重新获取数据')
    fetchProducts()
  }
)

// 处理商品悬浮
const handleProductHover = (event, product) => {
  // 悬浮逻辑
};

// 处理鼠标离开
const handleProductLeave = () => {
  showHoverCard.value = false;
  hoveredProduct.value = null;
};

// 处理图片加载错误
const handleImageError = (product) => {
  product.imageUrl = errorImage; // 替换为备用图片
};

// 处理分页大小变化
const handleSizeChange = (size) => {
  console.log('改变每页显示数量:', size)
  onSizeChange(size)
}

// 处理页码变化
const handleCurrentChange = (page) => {
  console.log('改变当前页码:', page)
  onPageChange(page)
}

// 监听商品参数变化
watch(productParams, () => {
  console.log('商品参数发生变化:', productParams)
  fetchProducts()
}, { deep: true })
</script>

<style scoped>
.products {
  position: relative;
  padding: 20px;
}

/* 网格视图样式 */
.product-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  height: 200px;
  width: 100%;
}

/* 列表视图样式 */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-list-item {
  width: 100%;
  transition: transform 0.3s;
}

.product-list-item:hover {
  transform: translateX(5px);
}

.product-list-content {
  display: flex;
  gap: 20px;
}

.product-list-image {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
}

.product-list-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-list-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

/* 共用样式 */
.product-info h3,
.product-list-info h3 {
  margin: 10px 0;
  font-size: 1.1em;
  color: var(--el-text-color-primary);
}

.description {
  color: var(--el-text-color-secondary);
  font-size: 0.9em;
  margin: 5px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  color: #ff6b6b;
  font-size: 1.2em;
  font-weight: bold;
  margin: 5px 0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.review-count {
  color: var(--el-text-color-secondary);
  font-size: 0.9em;
}

.stock {
  color: var(--el-text-color-secondary);
  font-size: 0.9em;
}

/* 动画效果 */
.dream-card {
  background: rgba(6, 5, 36, 0.95);
  border: 1px solid rgba(250, 159, 252, 0.3);
  backdrop-filter: blur(10px);
}

.dream-card:hover {
  border-color: rgba(250, 159, 252, 0.6);
  box-shadow: 0 0 15px rgba(250, 159, 252, 0.3);
}
</style> 