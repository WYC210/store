import { onMounted, onUnmounted } from 'vue'

export function useSvgAnimation() {
  const startAnimation = () => {
    const paths = document.querySelectorAll('.logo-path')
    paths.forEach(path => {
      const length = path.getTotalLength()
      path.style.strokeDasharray = length
      path.style.strokeDashoffset = length
    })
  }

  onMounted(() => {
    startAnimation()
  })

  return {
    startAnimation
  }
} 