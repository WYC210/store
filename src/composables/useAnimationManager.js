import { provide, inject, onMounted, onUnmounted } from 'vue'

const AnimationKey = Symbol('animation')

export function createAnimationManager() {
  const animations = new Map()
  
  // 注册 SVG 动画
  const registerSvgAnimation = (element) => {
    if (!element) return

    const paths = element.querySelectorAll('.logo-path')
    paths.forEach(path => {
      const length = path.getTotalLength()
      path.style.strokeDasharray = length
      path.style.strokeDashoffset = length
      animations.set(path, { length })
    })
  }

  // 开始动画
  const startAnimation = (name) => {
    const animation = animations.get(name)
    if (!animation) return

    animation.active = true
    if (animation.element) {
      animation.element.style.animation = animation.animationStyle
    }
  }

  // 停止动画
  const stopAnimation = (name) => {
    const animation = animations.get(name)
    if (!animation) return

    animation.active = false
    if (animation.element) {
      animation.element.style.animation = 'none'
    }
  }

  // 清理所有动画
  const cleanup = () => {
    animations.forEach((animation, element) => {
      if (element.style) {
        element.style.animation = 'none'
        element.style.removeProperty('stroke-dasharray')
        element.style.removeProperty('stroke-dashoffset')
      }
    })
    animations.clear()
  }

  return {
    registerSvgAnimation,
    startAnimation,
    stopAnimation,
    cleanup
  }
}

// 提供动画管理器
export function provideAnimationManager() {
  const manager = createAnimationManager()
  provide(AnimationKey, manager)
  return manager
}

// 在组件中使用动画管理器
export function useAnimation(element) {
  const manager = inject(AnimationKey)
  if (!manager) {
    throw new Error('Animation manager not provided')
  }

  onMounted(() => {
    if (element?.value) {
      manager.registerSvgAnimation(element.value)
    }
  })

  onUnmounted(() => {
    manager.cleanup()
  })

  return manager
} 