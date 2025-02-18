import { ref, reactive } from 'vue'
import { getProducts } from '@/api/product'
import { ElMessage } from 'element-plus'

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  
  // 分页信息
  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1
  })

  // 请求参数
  const productParams = reactive({
    pageNum: 1,
    pageSize: 10,
    keyword: ''
  })

  const fetchProducts = async () => {
    loading.value = true
    try {
      const response = await getProducts(productParams)
      console.log('商品列表响应:', response)
      
      // 直接使用返回的数据结构
      if (response && response.list) {
        // 处理商品数据
        products.value = response.list.map(product => ({
          ...product,
          // 确保图片路径正确
          imageUrl: product.imageUrl.startsWith('http') 
            ? product.imageUrl 
            : `http://localhost:8088${product.imageUrl}`,
          // 确保数值类型正确
          price: Number(product.price),
          rating: Number(product.rating),
          reviewCount: Number(product.reviewCount),
          stock: Number(product.stock)
        }))
        
        // 更新分页信息
        pagination.total = response.total
        pagination.currentPage = response.pageNum
        pagination.pageSize = response.pageSize
      } else {
        throw new Error('获取商品列表失败')
      }
    } catch (error) {
      console.error('获取商品列表失败:', error)
      ElMessage.error(error.message || '获取商品列表失败')
      products.value = []
    } finally {
      loading.value = false
    }
  }

  // 处理分页变化
  const handlePageChange = (newPage) => {
    productParams.pageNum = newPage
    fetchProducts()
  }

  // 处理每页数量变化
  const handleSizeChange = (newSize) => {
    productParams.pageSize = newSize
    productParams.pageNum = 1 // 重置到第一页
    fetchProducts()
  }

  return {
    products,
    loading,
    pagination,
    productParams,
    fetchProducts,
    handlePageChange,
    handleSizeChange
  }
} 