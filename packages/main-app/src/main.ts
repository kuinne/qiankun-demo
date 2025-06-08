import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useRouteGuard } from './hooks/useRouteGuard'
import { useGlobalState } from './hooks/useGlobalState'

// 设置路由守卫
useRouteGuard(router)

// 初始化全局状态
const { updateGlobalState } = useGlobalState()

// 创建主应用
function render() {
  const app = createApp(App)
  app.use(router)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.mount('#app')
}

render()

// 示例：更新全局状态
setTimeout(() => {
  updateGlobalState({
    message: 'hello from main-app (updated)',
    timestamp: new Date().getTime(),
  })
}, 5000)
