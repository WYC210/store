import { ref, reactive } from 'vue'

export function useProductFilter() {
  // 筛选参数
  const filterParams = reactive({
    categoryId: null,
    price: {
      min: null,
      max: null
    },
    ratings: [],
    tags: [],
    keyword: ''
  })

  // 价格范围选项
  const priceRanges = [
    { label: '全部', value: [null, null] },
    { label: '0-1000', value: [0, 1000] },
    { label: '1000-3000', value: [1000, 3000] },
    { label: '3000-5000', value: [3000, 5000] },
    { label: '5000以上', value: [5000, null] }
  ]

  // 评分选项
  const ratingOptions = [
    { label: '五星', value: 5 },
    { label: '四星及以上', value: 4 },
    { label: '三星及以上', value: 3 }
  ]

  // 标签选项
  const tagOptions = ref(['新品', '热销', '促销', '限时', '精选'])

  // 更新筛选条件
  const updateFilter = (type, value) => {
    switch (type) {
      case 'price':
        filterParams.price.min = value[0]
        filterParams.price.max = value[1]
        break
      case 'ratings':
        filterParams.ratings = Array.isArray(value) ? value : [value]
        break
      case 'tags':
        filterParams.tags = Array.isArray(value) ? value : [value]
        break
      case 'category':
        filterParams.categoryId = value
        break
      case 'keyword':
        filterParams.keyword = value
        break
    }
  }

  // 重置筛选条件
  const resetFilter = () => {
    Object.assign(filterParams, {
      categoryId: null,
      price: {
        min: null,
        max: null
      },
      ratings: [],
      tags: [],
      keyword: ''
    })
  }

  // 应用筛选条件到商品列表
  const applyFilter = (products) => {
    return products.filter(product => {
      // 价格筛选
      if (filterParams.price.min !== null && product.price < filterParams.price.min) return false
      if (filterParams.price.max !== null && product.price > filterParams.price.max) return false

      // 评分筛选
      if (filterParams.ratings.length && !filterParams.ratings.some(rating => product.rating >= rating)) return false

      // 标签筛选
      if (filterParams.tags.length && !filterParams.tags.some(tag => product.tags?.includes(tag))) return false

      // 分类筛选
      if (filterParams.categoryId && product.categoryId !== filterParams.categoryId) return false

      // 关键词搜索
      if (filterParams.keyword && !product.name.toLowerCase().includes(filterParams.keyword.toLowerCase())) return false

      return true
    })
  }

  return {
    filterParams,
    priceRanges,
    ratingOptions,
    tagOptions,
    updateFilter,
    resetFilter,
    applyFilter
  }
} 