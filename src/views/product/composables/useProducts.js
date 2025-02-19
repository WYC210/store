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
    keyword: '',
    categoryId: null,  // 添加分类ID
    sortField: 'default',  // 添加排序字段
    sortOrder: 'desc'  // 添加排序顺序
  })

  const fetchProducts = async () => {
    loading.value = true
    try {
      const response = await getProducts(productParams)
      console.log('获取商品响应:', response)
      
      if (response && Array.isArray(response.list)) {
        // 处理商品数据，确保所有必要字段都存在
        products.value = response.list.map(product => ({
          ...product,
          productId: product.productId || product.id,
          name: product.name || '未命名商品',
          description: product.description || '暂无描述',
          price: Number(product.price) || 0,
          rating: Number(product.rating) || 0,
          reviewCount: Number(product.reviewCount) || 0,
          stock: Number(product.stock) || 0,
          createdTime: product.createdTime || new Date().toISOString(),
          imageUrl: product.imageUrl ? (
            product.imageUrl.startsWith('http') 
              ? product.imageUrl 
              : `http://localhost:8088${product.imageUrl}`
          ) : require('@/assets/cs.png')
        }))
        
        // 更新分页信息
        pagination.total = response.total || 0
        pagination.currentPage = response.pageNum || 1
        pagination.pageSize = response.pageSize || 10
        
        console.log('处理后的商品数据:', products.value)
      } else {
        console.error('返回的数据格式不正确:', response)
        throw new Error('获取商品列表失败：数据格式不正确')
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
    productParams.pageNum = 1
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