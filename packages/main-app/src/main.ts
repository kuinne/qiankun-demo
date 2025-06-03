import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initGlobalState, loadMicroApp } from 'qiankun'
import router from './router'

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

// 子应用管理
class MicroAppManager {
  private microApp: any = null
  private isLoading: boolean = false
  private isUnmounting: boolean = false
  private containerCheckInterval: any = null
  private retryCount: number = 0
  private maxRetries: number = 3

  // 检查容器是否存在
  private checkContainer(): HTMLElement | null {
    const container = document.querySelector('#sub-app-viewport')
    if (!container) {
      console.warn('子应用容器 #sub-app-viewport 不存在')
    }
    return container as HTMLElement
  }

  // 清除所有定时器
  private clearTimers() {
    if (this.containerCheckInterval) {
      clearInterval(this.containerCheckInterval)
      this.containerCheckInterval = null
    }
  }

  // 重置状态
  private reset() {
    this.microApp = null
    this.isLoading = false
    this.isUnmounting = false
    this.retryCount = 0
    this.clearTimers()
  }

  // 卸载子应用
  async unmount(): Promise<void> {
    if (!this.microApp) return Promise.resolve()
    if (this.isUnmounting) return Promise.resolve()

    this.isUnmounting = true
    this.clearTimers()

    try {
      console.log('开始卸载子应用...')
      await this.microApp.unmount()
      console.log('子应用已成功卸载')
      this.reset()
      return Promise.resolve()
    } catch (error) {
      console.error('子应用卸载失败:', error)
      this.reset()
      return Promise.reject(error)
    }
  }

  // 加载子应用
  async mount(): Promise<void> {
    // 如果正在加载或卸载，直接返回
    if (this.isLoading || this.isUnmounting) {
      console.log('子应用正在加载或卸载中，请稍后再试')
      return
    }

    this.isLoading = true
    this.clearTimers()

    // 检查容器是否存在
    const container = this.checkContainer()
    if (!container) {
      console.log('容器不存在，启动定时检查...')

      // 如果容器不存在，设置定时器检查
      return new Promise((resolve) => {
        this.containerCheckInterval = setInterval(() => {
          const container = this.checkContainer()
          if (container) {
            clearInterval(this.containerCheckInterval)
            this.containerCheckInterval = null
            this.isLoading = false
            this.mount().then(resolve)
          } else {
            this.retryCount++
            if (this.retryCount >= this.maxRetries) {
              console.error(
                `容器检查超过最大重试次数(${this.maxRetries})，放弃加载`
              )
              clearInterval(this.containerCheckInterval)
              this.containerCheckInterval = null
              this.isLoading = false
              resolve()
            }
          }
        }, 300)
      })
    }

    // 如果已经有子应用实例，先卸载
    if (this.microApp) {
      try {
        await this.unmount()
      } catch (error) {
        console.error('卸载现有子应用失败:', error)
        this.isLoading = false
        return
      }
    }

    try {
      console.log('开始加载子应用...')
      this.microApp = loadMicroApp({
        name: 'sub-app-1',
        entry: '//localhost:5001',
        container: '#sub-app-viewport',
        props: {
          initialState: {
            message: 'hello from main-app',
            from: 'main-app',
            timestamp: new Date().getTime(),
          },
          onGlobalStateChange,
          setGlobalState,
        },
      })

      await this.microApp.mountPromise
      console.log('子应用加载成功')
      this.isLoading = false
    } catch (error) {
      console.error('加载子应用时发生错误:', error)
      this.reset()
    }
  }

  // 获取子应用实例
  getMicroApp() {
    return this.microApp
  }

  // 是否有子应用
  hasMicroApp() {
    return !!this.microApp
  }
}

// 创建子应用管理器实例
const microAppManager = new MicroAppManager()

// 监听容器准备好的事件
window.addEventListener('container-ready', (event: any) => {
  console.log('收到容器准备好的事件:', event.detail)
  if (event.detail.id === 'sub-app-viewport') {
    // 如果当前路由是子应用路由，则加载子应用
    if (router.currentRoute.value.path.startsWith('/sub-app-1')) {
      setTimeout(() => {
        microAppManager.mount()
      }, 50)
    }
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  try {
    if (to.path.startsWith('/sub-app-1')) {
      // 放行路由，确保容器组件会被渲染
      next()
      // 容器组件会在挂载后触发 container-ready 事件
    } else {
      // 如果离开子应用路由，卸载子应用
      if (microAppManager.hasMicroApp()) {
        await microAppManager.unmount()
      }
      next()
    }
  } catch (error) {
    console.error('路由守卫中发生错误:', error)
    next()
  }
})
