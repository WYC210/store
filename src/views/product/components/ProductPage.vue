<template>
  <div class="product-page">
    <header class="header">
      <div class="header-content">
        <router-link to="/home" class="logo">
          <img src="@/assets/logo_w.png" alt="Logo" />
        </router-link>
        <nav class="nav-menu">
          <router-link to="/home" class="nav-item">首页</router-link>
          <router-link to="/products" class="nav-item">商品</router-link>
          <router-link to="/cart" class="nav-item">
            <el-badge
              :value="cartStore.totalCount"
              :hidden="!cartStore.totalCount"
            >
              <el-icon><ShoppingCart /></el-icon>
              购物车
            </el-badge>
          </router-link>
        </nav>
      </div>
    </header>

    <div class="filter-section">
      <ProductFilter @filter-change="applyFilters" />
    </div>

    <div class="product-list-section">
      <ProductSorter @sort-change="handleSortChange" />
      <ProductList :products="filteredProducts" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductFilter } from '@/views/product/composables/useProductFilter';
import { useProducts } from '@/views/product/composables/useProducts';
import { useCartStore } from '@/stores/cart';
import ProductFilter from './ProductFilter.vue';
import ProductSorter from './ProductSorter.vue';
import ProductList from './ProductList.vue';

const cartStore = useCartStore();
const { products, fetchProducts } = useProducts();
const { applyFilter } = useProductFilter();

const filteredProducts = ref([]);

const applyFilters = (filters) => {
  filteredProducts.value = applyFilter(products.value, filters);
};

const handleSortChange = (sortOption) => {
  // 处理排序逻辑
  console.log('当前排序方式:', sortOption);
};

onMounted(() => {
  fetchProducts(); // 获取所有商品
});
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 1000;
  transition: all 0.3s ease;
  background: transparent;
}

.header-fixed {
  background: rgba(6, 5, 36, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(250, 159, 252, 0.2);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
}

.logo img {
  height: 100%;
  object-fit: contain;
}

.nav-menu {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-item {
  color: var(--starlight);
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: var(--cosmic-blue);
  background: rgba(250, 159, 252, 0.1);
  transform: translateY(-2px);
}

.nav-item.router-link-active {
  color: var(--cosmic-blue);
  background: rgba(250, 159, 252, 0.1);
}

.filter-section {
  margin-top: 100px; /* 确保分类不与导航栏重叠 */
}

.product-list-section {
  margin-top: 20px; /* 商品列表的顶部间距 */
}

.user-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.login-btn {
  min-width: 100px;
  background: linear-gradient(45deg, var(--aurora-pink), var(--cosmic-blue));
  border: none;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(250, 159, 252, 0.3);
}

/* 购物车图标样式 */
.el-badge :deep(.el-badge__content) {
  background-color: var(--aurora-pink);
}

/* 确保导航栏在滚动时平滑过渡 */
.header-fixed .nav-item {
  color: var(--starlight);
}

.header-fixed .nav-item:hover {
  color: var(--cosmic-blue);
}

/* 适配移动端 */
@media screen and (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .header-content {
    padding: 0 15px;
  }

  .logo {
    height: 50px;
  }
}
</style>