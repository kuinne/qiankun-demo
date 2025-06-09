import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 创建应用实例和状态管理
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// 使用路由
app.use(router)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 挂载应用
app.mount('#app')

// 初始化其他功能
import { useRouteGuard } from './hooks/useRouteGuard'
import { useGlobalState } from './hooks/useGlobalState'

// 设置路由守卫
useRouteGuard(router)

// 初始化全局状态
const { updateGlobalState } = useGlobalState()

// 示例：更新全局状态
setTimeout(() => {
  updateGlobalState({
    message: 'hello from main-app (updated)',
    timestamp: new Date().getTime(),
  })
}, 5000)
