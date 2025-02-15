<template>
  <header class="header" :class="{ 'header-fixed': isScrolled }">
    <div class="header-content">
      <!-- Logo -->
      <router-link to="/home" class="logo">
        <img src="@/assets/logo_w.png" alt="Logo" />
      </router-link>

      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <router-link to="/home" class="nav-item">首页</router-link>
        <router-link to="/products" class="nav-item">商品</router-link>
        <router-link to="/cart" class="nav-item">
          <el-badge
            :value="cartStore.totalCount"
            :hidden="!cartStore.totalCount"
          >
            <el-icon><ShoppingCart /></el-icon>
            购物车
          </el-badge>
        </router-link>
      </nav>

      <!-- 用户区域 -->
      <div class="user-area">
        <template v-if="userStore.isLoggedIn">
          <UserDropdown />
        </template>
        <template v-else>
          <el-button
            type="primary"
            class="login-btn hologram-btn"
            @click="handleLogin"
          >
            登录
          </el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useCartStore } from "@/stores/cart";
import { ShoppingCart } from "@element-plus/icons-vue";
import UserDropdown from "@/components/UserDropdown.vue";

const router = useRouter();
const userStore = useUserStore();
const cartStore = useCartStore();
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

const handleLogin = () => {
  router.push("/login");
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 1000;
  transition: all 0.3s ease;
  background: transparent;
}

.header-fixed {
  background: rgba(6, 5, 36, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(250, 159, 252, 0.2);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
}

.logo img {
  height: 100%;
  object-fit: contain;
}

.nav-menu {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-item {
  color: var(--starlight);
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: var(--cosmic-blue);
  background: rgba(250, 159, 252, 0.1);
  transform: translateY(-2px);
}

.nav-item.router-link-active {
  color: var(--cosmic-blue);
  background: rgba(250, 159, 252, 0.1);
}

.user-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.login-btn {
  min-width: 100px;
  background: linear-gradient(45deg, var(--aurora-pink), var(--cosmic-blue));
  border: none;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(250, 159, 252, 0.3);
}

/* 购物车图标样式 */
.el-badge :deep(.el-badge__content) {
  background-color: var(--aurora-pink);
}

/* 确保导航栏在滚动时平滑过渡 */
.header-fixed .nav-item {
  color: var(--starlight);
}

.header-fixed .nav-item:hover {
  color: var(--cosmic-blue);
}

/* 适配移动端 */
@media screen and (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .header-content {
    padding: 0 15px;
  }

  .logo {
    height: 50px;
  }
}
</style>
