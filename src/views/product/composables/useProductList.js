// 新增文件，处理产品列表逻辑
export function useProductList() {
  const viewMode = ref('grid')
  const hoveredProduct = ref(null)
  
  const handleProductHover = (event, product) => {
    // 处理悬浮逻辑
  }
  
  const handleProductClick = (product) => {
    // 处理点击逻辑
  }

  return {
    viewMode,
    hoveredProduct,
    handleProductHover,
    handleProductClick
  }
} 