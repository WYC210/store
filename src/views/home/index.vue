<template>
  <div class="home-container" :class="{ 'light-theme': !isDarkTheme }">
    <HomeHeader @search="handleSearch" />

    <div class="main-content">
      <el-row :gutter="20">
        <!-- 左侧分类和筛选 -->
        <el-col :xs="24" :sm="24" :md="8" :lg="6">
          <div class="sticky-sidebar">
            <CategoryMenu
              :content-height="contentHeight"
              @category-change="handleCategoryChange"
            />
            <ProductFilter
              class="filter-component"
              @filter-change="handleFilterChange"
            />
          </div>
        </el-col>

        <!-- 右侧内容区 -->
        <el-col :xs="24" :sm="24" :md="16" :lg="18">
          <HomeCarousel :content-height="contentHeight" />
          <ProductSorter
            class="sorter-component"
            @sort-change="handleSortChange"
            @view-change="handleViewChange"
          />
          <ProductList
            :view-mode="viewMode"
            :filter-params="filterParams"
            :sort-params="sortParams"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useTheme } from "./composables/useTheme";
import HomeHeader from "./components/HomeHeader.vue";
import CategoryMenu from "./components/CategoryMenu.vue";
import HomeCarousel from "./components/HomeCarousel.vue";
import ProductList from "@/views/product/components/ProductList.vue";
import ProductSorter from "@/views/product/components/ProductSorter.vue";
import ProductFilter from "@/views/product/components/ProductFilter.vue";

const { isDarkTheme } = useTheme();
const contentHeight = ref("400px");
const viewMode = ref("grid");

// 筛选参数
const filterParams = reactive({
  categoryId: null,
  price: {
    min: null,
    max: null,
  },
  ratings: [],
  tags: [],
});

// 排序参数
const sortParams = reactive({
  field: "default",
  order: "desc",
});

// 处理搜索
const handleSearch = (keyword) => {
  filterParams.keyword = keyword;
};

// 处理分类变化
const handleCategoryChange = (category) => {
  filterParams.categoryId = category.categoryId;
  // 如果需要，可以在这里触发商品列表的重新加载
  // 例如：重新获取商品列表数据
};

// 处理筛选条件变化
const handleFilterChange = (filters) => {
  Object.assign(filterParams, filters);
};

// 处理排序方式变化
const handleSortChange = (sort) => {
  sortParams.field = sort;
};

// 处理视图模式变化
const handleViewChange = (mode) => {
  viewMode.value = mode;
};

onMounted(() => {
  console.log("首页组件已加载");
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #060524;
  padding-top: 60px; /* 为固定导航栏留出空间 */
  transition: all 0.3s;
}

.home-container.light-theme {
  background: #f5f7fa;
}

.main-content {
  padding: 20px;
}

/* 侧边栏固定定位 */
.sticky-sidebar {
  position: sticky;
  top: 80px; /* 导航栏高度 + 间距 */
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

/* 自定义滚动条 */
.sticky-sidebar::-webkit-scrollbar {
  width: 6px;
}

.sticky-sidebar::-webkit-scrollbar-thumb {
  background: rgba(250, 159, 252, 0.3);
  border-radius: 3px;
}

.sticky-sidebar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.filter-component {
  margin-top: 20px;
}

.sorter-component {
  margin-bottom: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }

  .sticky-sidebar {
    position: static;
    max-height: none;
    overflow-y: visible;
  }

  .filter-component,
  .sorter-component {
    margin: 10px 0;
  }
}

/* 优化动画性能 */
.home-container {
  will-change: transform;
  transform: translateZ(0);
}

/* 添加过渡效果 */
.el-col {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.light-theme :deep(.el-card),
.light-theme :deep(.categories),
.light-theme :deep(.product-filter),
.light-theme :deep(.product-sorter) {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.1);
  color: #333;
}

.light-theme :deep(.el-card:hover) {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.light-theme :deep(h2),
.light-theme :deep(h3),
.light-theme :deep(.el-menu-item),
.light-theme :deep(.sub-category) {
  color: #333;
}

.light-theme :deep(.el-menu-item:hover),
.light-theme :deep(.sub-category:hover) {
  background: rgba(0, 0, 0, 0.05);
}
</style>
