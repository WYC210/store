import { getCategories } from '@/api/category'; // 确保正确导入
import { useCategoryStore } from '@/stores/category'; // 确保正确导入


export const fetchCategories = async () => {
  try {
    console.log('调用 getCategories 方法');
    console.log('getCategories:', getCategories); // 检查 getCategories 是否定义
    const response = await getCategories(); // 调用 getCategories
    return response.data; // 返回分类数据
  } catch (error) {
    console.error('获取分类失败:', error);
    throw error; // 抛出错误以便上层处理
  }
} 