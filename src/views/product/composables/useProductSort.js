import { ref } from 'vue'

export function useProductSort() {
  const sortOptions = [
    { label: '默认', value: 'default' },
    { label: '最新', value: 'newest', icon: 'Timer' },
    { label: '评分', value: 'rating', icon: 'StarFilled' },
    { label: '销量', value: 'sales', icon: 'Sell' },
    { label: '价格↑', value: 'priceAsc', icon: 'SortUp' },
    { label: '价格↓', value: 'priceDesc', icon: 'SortDown' }
  ]

  return {
    sortOptions
  }
} 