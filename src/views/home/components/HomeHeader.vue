<template>
  <header
    class="navbar"
    :class="{ 'navbar-fixed': isNavFixed, 'light-theme': !isDarkTheme }"
  >
    <router-link to="/home" class="logo-container">
      <img src="@/assets/logo_w.png" alt="Logo" class="logo" />
      <CyberText />
    </router-link>

    <SearchBar @search="handleSearch" />

    <div class="theme-switch">
      <el-button
        :icon="isDarkTheme ? 'Sunny' : 'Moon'"
        circle
        @click="toggleTheme"
        class="theme-button"
      />
    </div>

    <nav class="nav-links">
      <router-link to="/" class="nav-link hologram-btn glow-effect">
        <el-icon><HomeFilled /></el-icon>
        首页
      </router-link>
      <router-link to="/cart" class="nav-link hologram-btn glow-effect">
        <el-icon><ShoppingCart /></el-icon>
        购物车
      </router-link>
      <router-link to="/profile" class="nav-link hologram-btn glow-effect">
        <el-icon><User /></el-icon>
        个人中心
      </router-link>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useTheme } from "../composables/useTheme";
import CyberText from "@/components/CyberText.vue";
import SearchBar from "./SearchBar.vue";
import { debounce as _debounce } from "lodash-es";

const router = useRouter();
const { isDarkTheme, toggleTheme } = useTheme();
const isNavFixed = ref(false);

// 滚动处理
const handleScroll = _debounce(() => {
  isNavFixed.value = window.scrollY > 0;
}, 16);

// 导航方法
const goToHome = () => router.push("/home");
const goToCart = () => router.push("/cart");
const goToProfile = () => router.push("/profile");

const emit = defineEmits(["search"]);

const handleSearch = (keyword) => {
  emit("search", keyword);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: rgba(6, 5, 36, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(250, 159, 252, 0.3);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  width: 100%;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
}

.navbar-fixed {
  transform: translateY(0);
}

.logo-container {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.theme-switch {
  margin-left: auto;
}

.theme-button {
  background: transparent;
  border: 1px solid rgba(250, 159, 252, 0.3);
  color: #fff;
  transition: all 0.3s;
}

.theme-button:hover {
  background: rgba(250, 159, 252, 0.1);
  transform: rotate(180deg);
}

.light-theme .theme-button {
  border-color: rgba(0, 0, 0, 0.1);
  color: #333;
}

.light-theme .theme-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.nav-link {
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    45deg,
    rgba(255, 0, 255, 0.8),
    rgba(0, 255, 255, 0.8)
  );
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5),
    inset 0 0 15px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  animation: buttonPulse 2s infinite;
}

.nav-link:hover {
  filter: hue-rotate(90deg);
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.7),
    inset 0 0 20px rgba(255, 255, 255, 0.5);
}

@keyframes buttonPulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5),
      inset 0 0 15px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.7),
      inset 0 0 25px rgba(255, 255, 255, 0.5);
  }
}

.nav-link .el-icon {
  font-size: 1.2em;
  color: white;
}

/* 激活状态特效 */
.nav-link.router-link-active {
  background: linear-gradient(
    45deg,
    rgba(255, 0, 255, 0.9),
    rgba(0, 255, 255, 0.9)
  );
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.8),
    inset 0 0 30px rgba(255, 255, 255, 0.6);
  animation: activeButtonPulse 2s infinite;
}

@keyframes activeButtonPulse {
  0%,
  100% {
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.8),
      inset 0 0 30px rgba(255, 255, 255, 0.6);
  }
  50% {
    box-shadow: 0 0 60px rgba(0, 255, 255, 1),
      inset 0 0 45px rgba(255, 255, 255, 0.8);
  }
}
</style>
