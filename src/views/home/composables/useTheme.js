import { ref, onMounted } from 'vue'

export function useTheme() {
  // 移除主题切换功能，只使用梦幻主题
  onMounted(() => {
    document.documentElement.classList.add('dream-theme')
  })

  return {
    // 为了兼容性保留这个返回值，但实际上不再使用
    isDarkTheme: ref(true)
  }
}