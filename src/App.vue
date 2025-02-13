<template>
  <div class="dream-theme">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onUnmounted, onMounted } from "vue";
import { provideAnimationManager } from "./composables/useAnimationManager";
import { useUserStore } from "@/stores/user";
import { useOrderStore } from "@/stores/order";
import { useCategoryStore } from "@/stores/category";
import { useTheme } from "./views/home/composables/useTheme";

const animationManager = provideAnimationManager();
const userStore = useUserStore();
const orderStore = useOrderStore();
const categoryStore = useCategoryStore();
const { isDarkTheme } = useTheme();

onUnmounted(() => {
  animationManager.cleanup();
});

onMounted(async () => {
  try {
    const token = document.cookie.includes("AUTH-TOKEN");
    if (token) {
      await userStore.validateToken();
    }

    await categoryStore.fetchCategories();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
