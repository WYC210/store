import { defineStore } from 'pinia';
import { productService } from '@/api/product';
import { errorHandler } from '@/utils/errorHandler';
import { cacheManager } from '@/utils/cache';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    pagination: {
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    filters: {
      keyword: '',
      categoryId: null,
      sortField: 'default',
      sortOrder: 'desc'
    },
    sort: {}
  }),

  getters: {
    hasProducts: (state) => state.products.length > 0,
    getProductById: (state) => (id) => state.products.find(p => p.id === id),
    filteredProducts: (state) => {
      // 实现过滤逻辑
      return state.products;
    }
  },

  actions: {
    // 重置状态
    resetState() {
      this.products = [];
      this.currentProduct = null;
      this.error = null;
      this.loading = false;
    },

    // 更新过滤器
    updateFilters(filters) {
      this.filters = {
        ...this.filters,
        ...filters
      };
      return this.fetchProducts();
    },

    // 更新分页
    updatePagination(pagination) {
      this.pagination = {
        ...this.pagination,
        ...pagination
      };
      return this.fetchProducts();
    },

    // 获取商品列表
    async fetchProducts() {
      this.loading = true;
      this.error = null;

      try {
        const cacheKey = `products_${JSON.stringify(this.filters)}_${JSON.stringify(this.pagination)}`;
        const cachedData = cacheManager.get(cacheKey);

        if (cachedData) {
          this.products = cachedData.list;
          this.pagination.total = cachedData.total;
          return cachedData;
        }

        const response = await productService.getProducts({
          ...this.filters,
          ...this.pagination
        });

        this.products = response.list;
        this.pagination.total = response.total;

        cacheManager.set(cacheKey, response);
        return response;
      } catch (error) {
        const errorInfo = errorHandler.handleApiError(error);
        this.error = errorInfo.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取商品详情
    async fetchProductDetail(productId) {
      this.loading = true;
      this.error = null;

      try {
        const cacheKey = `product_${productId}`;
        const cachedData = cacheManager.get(cacheKey);

        if (cachedData) {
          this.currentProduct = cachedData;
          return cachedData;
        }

        const data = await productService.getProductDetails(productId);
        this.currentProduct = data;

        cacheManager.set(cacheKey, data);
        return data;
      } catch (error) {
        const errorInfo = errorHandler.handleApiError(error);
        this.error = errorInfo.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取推荐商品
    async fetchRecommendedProducts(productId) {
      try {
        return await productService.getRecommendedProducts(productId);
      } catch (error) {
        const errorInfo = errorHandler.handleApiError(error);
        this.error = errorInfo.message;
        throw error;
      }
    },

    updateSort(sort) {
      this.sort = sort;
      return this.fetchProducts();
    }
  },
    // 新增：上架商品
    async createProduct(productData) {
      this.loading = true
      try {
        const response = await productService.createProduct(productData)
        // 可选：更新本地商品列表
        await this.fetchProducts() 
        return response
      } catch (error) {
        this.error = errorHandler.handleApiError(error).message
        throw error
      } finally {
        this.loading = false
      }
    },

    // 新增：更新商品
    async updateProduct(productId, productData) {
      this.loading = true
      try {
        const response = await productService.updateProduct(productId, productData)
        // 更新当前商品详情缓存
        cacheManager.set(`product_${productId}`, response)
        if (this.currentProduct?.product_id === productId) {
          this.currentProduct = response // 更新当前商品状态
        }
        return response
      } catch (error) {
        this.error = errorHandler.handleApiError(error).message
        throw error
      } finally {
        this.loading = false
      }
    },

    // 新增：下架商品
    async deactivateProduct(productId) {
      this.loading = true
      try {
        await productService.deactivateProduct(productId)
        // 从本地列表中移除或更新状态
        this.products = this.products.filter(p => p.product_id !== productId)
        if (this.currentProduct?.product_id === productId) {
          this.currentProduct.is_active = false // 标记为下架
        }
      } catch (error) {
        this.error = errorHandler.handleApiError(error).message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
); 