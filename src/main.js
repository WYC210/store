import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './assets/styles/global.css'
import Hammer from 'hammerjs'

const app = createApp(App)
app.use(ElementPlus)
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)

// 添加全局手势指令
app.directive('touch', {
  mounted(el, binding) {
    const hammer = new Hammer(el)
    const { arg, value, modifiers } = binding

    // 配置识别器
    if (modifiers.pan) {
      hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL })
    }

    if (modifiers.swipe) {
      hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL })
    }

    // 绑定事件
    hammer.on(arg, (ev) => {
      value(ev)
    })

    // 保存实例用于清理
    el.hammer = hammer
  },
  unmounted(el) {
    if (el.hammer) {
      el.hammer.destroy()
      delete el.hammer
    }
  }
})

app.mount('#app')
