import { onMounted, onUnmounted } from 'vue'

export function useSvgAnimation() {
  const startAnimation = () => {
    const paths = document.querySelectorAll('.logo-path')
    paths.forEach(path => {
      const length = path.getTotalLength()
      path.style.strokeDasharray = length
      path.style.strokeDashoffset = length
      path.style.animation = 'logo-anim 15s cubic-bezier(0.4, 0, 0.2, 1) infinite'
    })
  }

  onMounted(() => {
    startAnimation()
  })

  onUnmounted(() => {
    const paths = document.querySelectorAll('.logo-path')
    paths.forEach(path => {
      path.style.animation = 'none'
    })
  })

  return {
    startAnimation
  }
} 