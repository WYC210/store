<template>
  <div class="theme-toggle" @click="toggleTheme" :class="{ 'dark': isDark, 'light': !isDark }">
    <div class="toggle-button">
      <div class="icon sun" v-show="!isDark">
        <div class="rays">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="circle"></div>
      </div>
      <div class="icon moon" v-show="isDark">
        <div class="crater"></div>
        <div class="crater"></div>
        <div class="crater"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isDark: Boolean
})

const emit = defineEmits(['update:isDark'])

const isDark = ref(props.isDark)

watch(() => props.isDark, (newVal) => {
  isDark.value = newVal
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  emit('update:isDark', isDark.value)
}
</script>

<style scoped>
.theme-toggle {
  position: relative;
  width: 60px;
  height: 30px;
  border-radius: 15px;
  cursor: pointer;
  padding: 2px;
  transition: all 0.3s ease;
}

.theme-toggle.dark {
  background: linear-gradient(45deg, #FF00FF, #00FFFF);
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
}

.theme-toggle.light {
  background: linear-gradient(45deg, #8B4513, #A0522D);
  border: 1px solid rgba(139, 109, 30, 0.3);
  box-shadow: 
    0 5px 15px rgba(139, 109, 30, 0.1),
    inset 0 0 10px rgba(139, 109, 30, 0.05);
}

.toggle-button {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  position: absolute;
  left: 2px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .toggle-button {
  background: #fff;
  left: 2px;
}

.light .toggle-button {
  background: #F4ECD8;
  left: calc(100% - 28px);
  border: 1px solid rgba(139, 109, 30, 0.2);
}

.icon {
  width: 16px;
  height: 16px;
  position: relative;
}

.light .sun .rays span {
  background: #8B4513;
}

.light .sun .circle {
  background: #8B4513;
}

.sun .rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sun .rays span {
  position: absolute;
  width: 2px;
  height: 8px;
  transform-origin: center 12px;
}

.sun .rays span:nth-child(1) { transform: rotate(0deg); }
.sun .rays span:nth-child(2) { transform: rotate(90deg); }
.sun .rays span:nth-child(3) { transform: rotate(180deg); }
.sun .rays span:nth-child(4) { transform: rotate(270deg); }

.sun .circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.light .moon {
  background: #8B4513;
}

.light .moon .crater {
  background: rgba(244, 236, 216, 0.3);
}

.moon {
  border-radius: 50%;
  overflow: hidden;
}

.crater {
  position: absolute;
  border-radius: 50%;
}

.crater:nth-child(1) {
  width: 6px;
  height: 6px;
  top: 3px;
  left: 5px;
}

.crater:nth-child(2) {
  width: 4px;
  height: 4px;
  top: 8px;
  left: 3px;
}

.crater:nth-child(3) {
  width: 5px;
  height: 5px;
  top: 4px;
  right: 4px;
}

.light.theme-toggle::before {
  content: '☯';
  position: absolute;
  font-size: 12px;
  color: rgba(139, 109, 30, 0.3);
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
}

.light.theme-toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 13px;
  background: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h28v28H1z' fill='none' stroke='%23698269' stroke-width='0.5' stroke-opacity='0.2' stroke-dasharray='2 2'/%3E%3C/svg%3E");
  opacity: 0.1;
  pointer-events: none;
}
</style> 