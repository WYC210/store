import { ref, computed } from 'vue'

export function useProductSort() {
  // 排序参数
  const sortParams = ref({
    field: 'default',
    order: 'desc'
  })

  // 排序选项
  const sortOptions = [
    { label: '综合排序', value: 'default', icon: 'Sort' },
    { label: '最新上架', value: 'newest', icon: 'Timer' },
    { label: '评分最高', value: 'rating', icon: 'StarFilled' },
    { label: '销量优先', value: 'sales', icon: 'Sell' },
    { label: '价格从低到高', value: 'priceAsc', icon: 'SortUp' },
    { label: '价格从高到低', value: 'priceDesc', icon: 'SortDown' }
  ]

  // 更新排序方式
  const updateSort = (field, order = 'desc') => {
    sortParams.value = { field, order }
  }

  // 应用排序到商品列表
  const applySorting = (products) => {
    const { field, order } = sortParams.value
    
    return [...products].sort((a, b) => {
      let comparison = 0
      
      switch (field) {
        case 'newest':
          comparison = new Date(b.createdTime) - new Date(a.createdTime)
          break
        case 'rating':
          comparison = b.rating - a.rating
          break
        case 'sales':
          comparison = b.salesCount - a.salesCount
          break
        case 'priceAsc':
          comparison = a.price - b.price
          order = 'asc'
          break
        case 'priceDesc':
          comparison = b.price - a.price
          break
        default:
          // 综合排序：按照权重计算（可以根据需求调整权重）
          const getWeight = (product) => {
            return (
              product.rating * 0.4 +
              (product.salesCount || 0) * 0.3 +
              (product.reviewCount || 0) * 0.2 +
              (new Date(product.createdTime).getTime() / Date.now()) * 0.1
            )
          }
          comparison = getWeight(b) - getWeight(a)
      }
      
      return order === 'asc' ? comparison : -comparison
    })
  }

  // 计算当前排序方式的显示文本
  const currentSortLabel = computed(() => {
    const option = sortOptions.find(opt => opt.value === sortParams.value.field)
    return option?.label || '综合排序'
  })

  return {
    sortParams,
    sortOptions,
    updateSort,
    applySorting,
    currentSortLabel
  }
} 