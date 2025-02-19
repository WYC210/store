<template>
  <el-drawer
    :visible.sync="visible"
    title="筛选"
    size="30%"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="分类">
        <el-select v-model="selectedCategory" placeholder="选择分类">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="applyFilters">应用</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const selectedCategory = ref(null)
const categories = ref([]) // 这里可以从 API 获取分类数据

const applyFilters = () => {
  // 应用筛选逻辑
  console.log('应用筛选:', selectedCategory.value)
  visible.value = false
}
</script>

<style scoped>
/* 侧边栏样式 */
</style> 