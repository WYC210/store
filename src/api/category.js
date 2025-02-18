import request from '@/utils/request'

// 获取分类树
export const getCategories = () => {
  return request({
    url: '/categories',
    method: 'GET'
  })
} 