import { ref, reactive } from 'vue'
import { getProducts } from '@/api/product'
import { ElMessage } from 'element-plus'

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const pagination = reactive({
    total: 0,
    pages: 0,
    pageNum: 1,
    pageSize: 10
  })

  const productParams = reactive({
    pageNum: 1,
    pageSize: 10,
    categoryId: undefined,
    keyword: '',
  })

  // 获取商品列表
  const fetchProducts = async () => {
    loading.value = true
    try {
      const response = await getProducts(productParams)
      console.log('商品列表响应:', response)
      
      if (response?.list) {
        products.value = response.list
        Object.assign(pagination, {
          total: response.total || 0,
          pages: response.pages || 1,
          pageNum: response.pageNum || 1,
          pageSize: response.pageSize || 10
        })
      } else {
        throw new Error('获取商品列表失败')
      }
    } catch (error) {
      console.error('获取商品列表失败:', error)
      ElMessage.error('获取商品列表失败，请稍后重试')
      products.value = []
      Object.assign(pagination, {
        total: 0,
        pages: 1,
        pageNum: 1,
        pageSize: 10
      })
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    pagination,
    productParams,
    fetchProducts
  }
} 