<template>
  <div class="filter-card dream-card">
    <div class="product-filter">
      <div class="filter-section">
        <h3>价格区间</h3>
        <div class="price-range">
          <el-input-number
            v-model="priceRange.min"
            :min="0"
            :step="10"
            placeholder="最低价"
          />
          <span class="separator">-</span>
          <el-input-number
            v-model="priceRange.max"
            :min="0"
            :step="10"
            placeholder="最高价"
          />
        </div>
      </div>

      <div class="filter-section">
        <h3>商品评分</h3>
        <div class="rating-filter">
          <el-checkbox-group v-model="selectedRatings">
            <el-checkbox
              v-for="rating in ratingOptions"
              :key="rating.value"
              :label="rating.value"
            >
              <el-rate :model-value="rating.value" disabled show-score />
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="filter-section">
        <h3>商品标签</h3>
        <div class="tags-filter">
          <el-tag
            v-for="tag in tags"
            :key="tag"
            :class="{ active: selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
            :effect="selectedTags.includes(tag) ? 'dark' : 'plain'"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <div class="filter-actions">
        <el-button type="primary" @click="applyFilters">应用筛选</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useProductFilter } from "../composables/useProductFilter";

const emit = defineEmits(["filter-change"]);

const {
  filterParams,
  priceRanges,
  ratingOptions: defaultRatingOptions,
  tagOptions,
  updateFilter,
  resetFilter,
} = useProductFilter();

// 价格区间
const priceRange = ref(filterParams.price);

// 评分选项
const ratingOptions = defaultRatingOptions;
const selectedRatings = ref([]);

// 标签
const tags = tagOptions;
const selectedTags = ref([]);

// 切换标签选择
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
  updateFilter("tags", selectedTags.value);
};

// 应用筛选
const applyFilters = () => {
  updateFilter("price", [priceRange.value.min, priceRange.value.max]);
  updateFilter("ratings", selectedRatings.value);
  emit("filter-change", {
    ...filterParams,
  });
};

// 重置筛选
const resetFilters = () => {
  resetFilter();
  priceRange.value = filterParams.price;
  selectedRatings.value = [];
  selectedTags.value = [];
  applyFilters();
};

// 监听筛选条件变化
watch(
  [priceRange, selectedRatings, selectedTags],
  () => {
    applyFilters();
  },
  { deep: true }
);
</script>

<style scoped>
.filter-section {
  margin-bottom: 20px;
}

.filter-section h3 {
  color: var(--starlight);
  margin-bottom: 15px;
}

.filter-section h3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: linear-gradient(to bottom, #fa9ffc, #24d0fe);
  border-radius: 2px;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.separator {
  color: #fff;
}

.rating-filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.el-checkbox) {
  margin-right: 0;
  margin-bottom: 8px;
  color: #fff;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.el-tag) {
  cursor: pointer;
  transition: all 0.3s;
  background: transparent;
  border-color: rgba(250, 159, 252, 0.3);
  color: #fff;
}

:deep(.el-tag.active) {
  background: rgba(250, 159, 252, 0.2);
  border-color: rgba(250, 159, 252, 0.5);
  animation: neonGlow 2s infinite;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(250, 159, 252, 0.3);
}

:deep(.el-input-number) {
  background: transparent;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--starlight);
}

:deep(.el-input__inner) {
  color: var(--starlight);
  background: transparent;
}

.tag {
  background: rgba(255, 97, 210, 0.1);
  color: var(--starlight);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tag.active {
  background: var(--cosmic-blue);
  color: white;
  border-color: var(--cosmic-blue);
}

@keyframes neonGlow {
  0% {
    box-shadow: 0 0 5px rgba(250, 159, 252, 0.2);
  }
  50% {
    box-shadow: 0 0 10px rgba(250, 159, 252, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(250, 159, 252, 0.2);
  }
}
</style>
