import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getProducts } from '@/api/product'; // 假设有获取产品的 API

export const useProductStore = defineStore('product', {
  state: () => ({
    products: ref([]),
    loading: ref(false),
    error: ref(null),
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getProducts();
        console.log("获取产品响应:", response); // 输出获取产品的响应
        if (response.state === 200) {
          this.products = response.data; // 假设返回的数据是产品数组
          console.log("产品数据:", this.products); // 输出产品数据
        } else {
          throw new Error(response.message || '获取产品失败');
        }
      } catch (error) {
        this.error = error.message || '获取产品失败';
        console.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    sortProducts(criteria) {
      console.log("排序标准:", criteria); // 输出排序标准
      switch (criteria) {
        case 'latest':
          this.products.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
          break;
        case 'highestRating':
          this.products.sort((a, b) => b.rating - a.rating);
          break;
        case 'highestSales':
          this.products.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case 'brand':
          this.products.sort((a, b) => a.brand.localeCompare(b.brand));
          break;
        default:
          break;
      }
      console.log("排序后的产品数据:", this.products); // 输出排序后的产品数据
    }
  }
}); 