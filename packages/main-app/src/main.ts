import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initGlobalState } from 'qiankun'
import router from './router'
import { MicroAppManager, isSubAppRoute, getSubAppByPath } from 'common'
import type { MicroAppConfig } from 'common'

// 子应用配置列表
const microApps: MicroAppConfig[] = [
  {
    name: 'sub-app-1',
    entry: '//localhost:5002',
    activeRule: '/sub-app/sub-app-1',
    container: '#sub-app-viewport',
    defaultPath: '/sub-app/sub-app-1',
    title: '子应用1',
  },
  {
    name: 'sub-app-2',
    entry: '//localhost:5003',
    activeRule: '/sub-app/sub-app-2',
    container: '#sub-app-viewport',
    defaultPath: '/sub-app/sub-app-2',
    title: '子应用2',
  },
]

// 初始化全局状态
const { onGlobalStateChange, setGlobalState } = initGlobalState({
  message: 'hello from main-app',
  from: 'main-app',
  timestamp: new Date().getTime(),
})

onGlobalStateChange((value, prev) =>
  console.log('[onGlobalStateChange - master]', value, prev)
)

setGlobalState({
  message: 'hello from main-app',
  from: 'main-app',
  timestamp: new Date().getTime(),
})

// 创建主应用
function render() {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
}

render()

// 创建子应用管理器实例
const microAppManager = new MicroAppManager()

// 监听容器准备好的事件
window.addEventListener('container-ready', async (event: any) => {
  console.log('收到容器准备好的事件:', event.detail)
  if (event.detail.id === 'sub-app-viewport') {
    // 根据当前路由决定加载哪个子应用
    const currentPath = event.detail.path || router.currentRoute.value.path
    console.log(`容器准备好，准备加载子应用，当前路径: ${currentPath}`)

    // 获取当前路径对应的子应用配置
    const subAppConfig = getSubAppByPath(currentPath, microApps)
    if (!subAppConfig) {
      console.log(`当前路径 ${currentPath} 没有对应的子应用配置`)
      return
    }

    // 如果当前已有子应用在运行，且与目标路径不匹配，先卸载
    const currentAppName = microAppManager.getCurrentAppName()
    if (currentAppName) {
      if (currentAppName !== subAppConfig.name) {
        console.log(
          `当前子应用 ${currentAppName} 与路径 ${currentPath} 不匹配，准备卸载`
        )
        await microAppManager.unmount(currentAppName)
      } else {
        console.log(
          `当前子应用 ${currentAppName} 与路径 ${currentPath} 匹配，无需重新加载`
        )
        return
      }
    }

    // 加载子应用
    console.log(`准备加载子应用 ${subAppConfig.name}`)
    await microAppManager.mount(
      subAppConfig.name,
      subAppConfig.entry,
      subAppConfig.container
    )
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  console.log(`路由守卫 - 路由变化: 从 ${from.path} 到 ${to.path}`)
  try {
    const isToSubApp = isSubAppRoute(to.path)
    const isFromSubApp = isSubAppRoute(from.path)
    const currentAppName = microAppManager.getCurrentAppName()

    // 如果要去子应用路由
    if (isToSubApp) {
      // 获取目标子应用配置
      const toSubAppConfig = getSubAppByPath(to.path, microApps)

      // 如果从主应用来，或者从不同的子应用来，需要确保先卸载当前子应用
      if (
        !isFromSubApp ||
        (currentAppName && currentAppName !== toSubAppConfig?.name)
      ) {
        // 从主应用或其他子应用切换，需要卸载当前子应用
        if (currentAppName) {
          await microAppManager.unmount(currentAppName)
        }
      }
    } else {
      // 如果去往主应用，卸载当前子应用
      if (currentAppName) {
        await microAppManager.unmount(currentAppName)
      }
    }
    next()
  } catch (error) {
    console.error('路由守卫中发生错误:', error)
    next()
  }
})
