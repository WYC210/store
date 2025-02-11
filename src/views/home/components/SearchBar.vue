<template>
  <div class="search-container">
    <el-input
      v-model="searchKeyword"
      placeholder="输入关键词进行搜索..."
      class="search-input"
      :prefix-icon="Search"
      @focus="isSearchFocused = true"
      @blur="isSearchFocused = false"
      @input="handleSearch"
    >
      <template #append>
        <el-button 
          @click="handleSearch" 
          class="search-button"
        >
          <span class="button-text">搜索</span>
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { debounce as _debounce } from 'lodash-es'

const searchKeyword = ref('')
const isSearchFocused = ref(false)

const emit = defineEmits(['search'])

const handleSearch = _debounce(() => {
  emit('search', searchKeyword.value)
}, 300)
</script>

<style scoped>
.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 20px;
  position: relative;
  padding: 5px;
}

.search-input {
  width: 100%;
  transition: transform 0.3s ease;
  transform: translateZ(0);
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-text {
  white-space: nowrap;
}
</style> 